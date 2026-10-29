// Customer login for destec.co.il: a magic link by e-mail, then a signed cookie. No passwords,
// no Supabase Auth (see migration 006 for why). Tables are service-role only.
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { serviceDb } from './payments';

export const SESSION_COOKIE = 'des_session';
const SESSION_DAYS = 30;
const TOKEN_MINUTES = 30;
const MAX_LINKS_PER_15_MIN = 5;

const secret = () => process.env.SITE_AUTH_SECRET || '';
export const authEnabled = () => !!(secret() && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.RESEND_API_KEY && (process.env.SITE_URL || '').startsWith('http'));

export const normEmail = (e: string) => String(e || '').trim().toLowerCase();
export const isEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) && e.length <= 254;

const b64 = (s: string | Buffer) => Buffer.from(s).toString('base64url');
const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url');

export function sessionCookieValue(email: string): string {
  const payload = b64(JSON.stringify({ e: email, x: Date.now() + SESSION_DAYS * 86400_000 }));
  return `${payload}.${sign(payload)}`;
}

// The logged-in customer's e-mail, or null. Constant-time signature check, expiry honoured.
export function readSession(value: string | undefined | null): string | null {
  if (!value || !secret()) return null;
  const [payload, sig] = value.split('.');
  if (!payload || !sig) return null;
  const expected = sign(payload);
  if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const { e, x } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return typeof e === 'string' && typeof x === 'number' && x > Date.now() ? e : null;
  } catch { return null; }
}

export async function currentCustomerEmail(): Promise<string | null> {
  const jar = await cookies();
  return readSession(jar.get(SESSION_COOKIE)?.value);
}

export const sessionCookieOptions = () => ({
  httpOnly: true, secure: true, sameSite: 'lax' as const, path: '/', maxAge: SESSION_DAYS * 86400,
});

const hash = (t: string) => createHash('sha256').update(t).digest('hex');

// Issue a one-time token for this e-mail (rate-limited). Returns the raw token for the link.
export async function issueLoginToken(email: string): Promise<{ token: string } | { error: 'rate_limited' | 'db' }> {
  const db = serviceDb();
  const since = new Date(Date.now() - 15 * 60_000).toISOString();
  const { count } = await db.from('site_login_tokens').select('*', { count: 'exact', head: true }).eq('email', email).gte('created_at', since);
  if ((count || 0) >= MAX_LINKS_PER_15_MIN) return { error: 'rate_limited' };
  const token = randomBytes(32).toString('base64url');
  const { error } = await db.from('site_login_tokens').insert({
    token_hash: hash(token), email, expires_at: new Date(Date.now() + TOKEN_MINUTES * 60_000).toISOString(),
  });
  return error ? { error: 'db' } : { token };
}

// Redeem a token exactly once; the customer row is created on first login.
export async function consumeLoginToken(token: string): Promise<string | null> {
  if (!token || token.length > 200) return null;
  const db = serviceDb();
  const { data } = await db.from('site_login_tokens').update({ used_at: new Date().toISOString() })
    .eq('token_hash', hash(token)).is('used_at', null).gt('expires_at', new Date().toISOString()).select('email').maybeSingle();
  if (!data?.email) return null;
  await db.from('site_customers').upsert({ email: data.email, last_login_at: new Date().toISOString() }, { onConflict: 'email' });
  return data.email as string;
}

export async function sendLoginLink(email: string, token: string): Promise<boolean> {
  const link = `${process.env.SITE_URL}/api/auth/verify?token=${encodeURIComponent(token)}`;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'DES <noreply@destec.co.il>', to: [email], subject: 'הכניסה שלך לאתר DES',
      html: `<div dir="rtl" style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#1a2b4a;">
        <h2>כניסה לאזור האישי</h2>
        <p>לחצו על הכפתור כדי להיכנס. הקישור תקף ל-${TOKEN_MINUTES} דקות ולשימוש חד-פעמי.</p>
        <p style="margin:24px 0;"><a href="${link}" style="background:#1e90ff;color:#fff;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:bold;">כניסה לחשבון</a></p>
        <p style="color:#888;font-size:12px;">אם לא ביקשתם להיכנס, אפשר להתעלם מהודעה זו.</p>
      </div>`,
    }),
  });
  if (!res.ok) console.error('[Auth] Resend error:', await res.text());
  return res.ok;
}
