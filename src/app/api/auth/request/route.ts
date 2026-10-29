import { NextRequest, NextResponse } from 'next/server';
import { authEnabled, normEmail, isEmail, issueLoginToken, sendLoginLink } from '@/lib/server/auth';

// POST { email } → a magic link by e-mail. Always answers ok for a well-formed address, so the
// form cannot be used to probe which e-mails have accounts.
export async function POST(req: NextRequest) {
  if (!authEnabled()) return NextResponse.json({ error: 'Login is not available yet' }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  const email = normEmail(body?.email);
  if (!isEmail(email)) return NextResponse.json({ error: 'כתובת אימייל לא תקינה' }, { status: 400 });
  const r = await issueLoginToken(email);
  if ('error' in r) {
    if (r.error === 'rate_limited') return NextResponse.json({ error: 'נשלחו כבר כמה קישורים — בדקו את תיבת הדואר או נסו שוב בעוד כמה דקות' }, { status: 429 });
    return NextResponse.json({ error: 'שגיאה זמנית, נסו שוב' }, { status: 502 });
  }
  const sent = await sendLoginLink(email, r.token);
  return sent ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'שליחת המייל נכשלה, נסו שוב' }, { status: 502 });
}
