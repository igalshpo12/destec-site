// ONE way out for every e-mail the site sends (leads, orders, thank-you, login links).
// Transport, in order: Resend when RESEND_API_KEY is set; otherwise Zoho SMTP — the domain's
// real mail provider, the same transport des-manager uses (its api/_lib/mailer.js) — when
// ZOHO_SMTP_USER/PASS are set. Zoho only sends from the authenticated mailbox, so `from` is
// always that address; `fromName` is the display name. Nothing configured → logged, not sent.
import nodemailer from 'nodemailer';

export type MailAttachment = { filename: string; content: Buffer };
export type Mail = { to: string | string[]; subject: string; html: string; fromName?: string; replyTo?: string; attachments?: MailAttachment[] };

export function mailEnabled() {
  return !!(process.env.RESEND_API_KEY || (process.env.ZOHO_SMTP_USER && process.env.ZOHO_SMTP_PASS));
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
    if (!res.ok) { console.error('[Mail] Resend error:', await res.text()); return false; }
    return true;
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
      return false;
    }
  }
  console.log('[Mail] no transport configured (RESEND_API_KEY or ZOHO_SMTP_USER/PASS) — not sent:', m.subject);
  return false;
}
