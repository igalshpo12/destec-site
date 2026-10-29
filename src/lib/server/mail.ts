// ONE way out for every e-mail the site sends (leads, orders, thank-you, login links).
// Transports, tried in order until one succeeds:
//   1. Resend — when RESEND_API_KEY is set (never was; needs DNS the domain can't get).
//   2. Zoho SMTP — ZOHO_SMTP_USER/PASS; the site's own mailbox is on Zoho's free plan, which
//      refuses SMTP logins (535, 2026-10-29), so this stays as the upgrade path.
//   3. The manager's relay — MANAGER_URL + WEB_SALE_KEY: des-manager sends it through its working
//      Zoho transport (noreply@destec.co.il). This is what carries the mail today.
// Zoho only sends from the authenticated mailbox; `fromName` is the display name.
import nodemailer from 'nodemailer';

export type MailAttachment = { filename: string; content: Buffer };
export type Mail = { to: string | string[]; subject: string; html: string; fromName?: string; replyTo?: string; attachments?: MailAttachment[] };

export function mailEnabled() {
  return !!(process.env.RESEND_API_KEY || (process.env.ZOHO_SMTP_USER && process.env.ZOHO_SMTP_PASS) || (process.env.MANAGER_URL && process.env.WEB_SALE_KEY));
}

async function viaManager(m: Mail, to: string[], fromName: string): Promise<boolean> {
  try {
    const res = await fetch(`${String(process.env.MANAGER_URL).replace(/\/+$/, '')}/api/calendar/send-mail-relay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-web-sale-key': String(process.env.WEB_SALE_KEY) },
      body: JSON.stringify({
        to, subject: m.subject, html: m.html, fromName, replyTo: m.replyTo || undefined,
        attachments: m.attachments?.map((a) => ({ filename: a.filename, content: a.content.toString('base64') })),
      }),
      signal: AbortSignal.timeout(25_000),
    });
    if (!res.ok) { console.error('[Mail] relay error:', res.status, await res.text().catch(() => '')); return false; }
    return true;
  } catch (e) {
    console.error('[Mail] relay request failed:', e);
    return false;
  }
}

let transport: nodemailer.Transporter | null = null;
function zoho() {
  if (!transport) {
    transport = nodemailer.createTransport({
      host: process.env.ZOHO_SMTP_HOST || 'smtp.zoho.com',
      port: Number(process.env.ZOHO_SMTP_PORT || 465),
      secure: true,
      auth: { user: process.env.ZOHO_SMTP_USER, pass: process.env.ZOHO_SMTP_PASS },
    });
  }
  return transport;
}

export async function sendMail(m: Mail): Promise<boolean> {
  const to = Array.isArray(m.to) ? m.to : [m.to];
  const fromName = m.fromName || 'DES';
  if (process.env.RESEND_API_KEY) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `${fromName} <${process.env.MAIL_FROM || 'noreply@destec.co.il'}>`, to, reply_to: m.replyTo || undefined, subject: m.subject, html: m.html,
        ...(m.attachments?.length ? { attachments: m.attachments.map((a) => ({ filename: a.filename, content: a.content.toString('base64') })) } : {}),
      }),
    });
    if (res.ok) return true;
    console.error('[Mail] Resend error:', await res.text());
  }
  if (process.env.ZOHO_SMTP_USER && process.env.ZOHO_SMTP_PASS) {
    try {
      await zoho().sendMail({
        from: `${fromName} <${process.env.ZOHO_SMTP_USER}>`, to, replyTo: m.replyTo || undefined, subject: m.subject, html: m.html,
        attachments: m.attachments?.map((a) => ({ filename: a.filename, content: a.content })),
      });
      return true;
    } catch (e) {
      console.error('[Mail] Zoho SMTP error:', e);
    }
  }
  if (process.env.MANAGER_URL && process.env.WEB_SALE_KEY) return viaManager(m, to, fromName);
  console.log('[Mail] no transport configured — not sent:', m.subject);
  return false;
}
