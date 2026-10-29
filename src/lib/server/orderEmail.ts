// The order e-mail to DES (Resend). One builder for both paths: a quote/e-mail order (no payment)
// and an online order that was PAID through Credit2000 (approval number included; a קבלה must
// then be issued in des-manager — the site issues no documents). Since 2026-10-29 the manager
// issues a קבלה for the money at once; the חשבונית מס is staff's job at delivery.
import { sendMail } from './mail';

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ils = (n: number) => new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 2 }).format(n);

export type EmailLine = { name: string; itemNumber?: string | null; manufacturer?: string | null; price?: number | null; qty: number };
export type EmailCustomer = { name: string; phone: string; email?: string; clinic?: string; vat_number?: string; address?: string; city?: string; notes?: string };
export type Payment = { approval: string; brand?: string; amount: number; document?: { issued: boolean; doc_number?: string; warning?: string } | null };

export function orderEmailHtml({ ref, customer, lines, payment }: { ref: string; customer: EmailCustomer; lines: EmailLine[]; payment?: Payment | null }) {
  const subtotal = lines.reduce((s, l) => s + (l.price ? l.price * l.qty : 0), 0);
  const unpriced = lines.filter((l) => !l.price).length;
  const rows = lines.map((l) => `<tr>
      <td style="padding:8px;border-bottom:1px solid #eee;">${esc(l.name)}${l.manufacturer ? `<br/><span style="color:#888;font-size:12px;">${esc(l.manufacturer)}</span>` : ''}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;" dir="ltr">${esc(l.itemNumber || '')}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${l.qty}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;">${l.price ? ils(l.price) : 'לפי הצעת מחיר'}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;">${l.price ? ils(l.price * l.qty) : '—'}</td>
    </tr>`).join('');
  const paidBlock = payment
    ? `<div style="margin:16px 0;padding:12px 14px;border-radius:10px;background:#f0fdf4;border:1px solid #bbf7d0;color:#166534;">
         <strong>שולם באתר בכרטיס אשראי (קרדיט 2000)</strong> — ${ils(payment.amount)} · אישור ${esc(payment.approval)}${payment.brand ? ` · ${esc(payment.brand)}` : ''}<br/>
         <div style="font-size:12px;margin-top:6px;">${payment.document?.issued
           ? `הופקה קבלה <b dir="ltr">${esc(payment.document.doc_number || '')}</b> במערכת הניהול. חשבונית מס — עם האספקה, לשייך לקבלה.`
           : `<span style="color:#b91c1c;font-weight:bold;">לא הופקה קבלה אוטומטית${payment.document?.doc_number ? ` — נשמרה טיוטה ${esc(payment.document.doc_number)}` : ''}. יש להפיק קבלה במערכת הניהול היום.</span>${payment.document?.warning ? `<br/><span style="color:#777;">${esc(payment.document.warning)}</span>` : ''}`}</div>
       </div>`
    : '';
  return `
    <div dir="rtl" style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;">
      <h2 style="color:#1a2b4a;">הזמנה חדשה מאתר DES — ${esc(ref)}${payment ? ' · שולם' : ''}</h2>
      ${paidBlock}
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <tr><td style="padding:6px;color:#666;">שם:</td><td style="padding:6px;">${esc(customer.name)}</td></tr>
        ${customer.clinic ? `<tr><td style="padding:6px;color:#666;">מרפאה/חברה:</td><td style="padding:6px;">${esc(customer.clinic)}</td></tr>` : ''}
        <tr><td style="padding:6px;color:#666;">טלפון:</td><td style="padding:6px;" dir="ltr">${esc(customer.phone)}</td></tr>
        ${customer.email ? `<tr><td style="padding:6px;color:#666;">אימייל:</td><td style="padding:6px;">${esc(customer.email)}</td></tr>` : ''}
        ${customer.vat_number ? `<tr><td style="padding:6px;color:#666;">ח.פ/ע.מ:</td><td style="padding:6px;" dir="ltr">${esc(customer.vat_number)}</td></tr>` : ''}
        ${customer.address || customer.city ? `<tr><td style="padding:6px;color:#666;">כתובת למשלוח:</td><td style="padding:6px;">${esc([customer.address, customer.city].filter(Boolean).join(', '))}</td></tr>` : ''}
      </table>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead><tr style="background:#f4f6f8;">
          <th style="padding:8px;text-align:right;">מוצר</th><th style="padding:8px;text-align:right;">מק״ט</th><th style="padding:8px;">כמות</th><th style="padding:8px;text-align:right;">מחיר</th><th style="padding:8px;text-align:right;">סה״כ</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="font-size:16px;margin:16px 0 4px;"><strong>סה״כ פריטים מתומחרים: ${ils(subtotal)}</strong> <span style="color:#888;font-size:12px;">(כולל מע״מ)</span></p>
      ${unpriced ? `<p style="color:#b45309;">${unpriced} פריטים ללא מחיר באתר — נדרשת הצעת מחיר.</p>` : ''}
      ${customer.notes ? `<h3 style="color:#1a2b4a;margin-top:20px;">הערות</h3><p style="white-space:pre-wrap;">${esc(customer.notes)}</p>` : ''}
      <hr style="margin:20px 0;border:none;border-top:1px solid #eee;" />
      <p style="color:#999;font-size:12px;">נשלח מאתר destec.co.il · ${payment ? 'התשלום בוצע באתר.' : 'התשלום טרם בוצע — יש ליצור קשר עם הלקוח לאישור ולגבייה.'}</p>
    </div>`;
}

export async function sendOrderEmail({ ref, customer, lines, payment }: { ref: string; customer: EmailCustomer; lines: EmailLine[]; payment?: Payment | null }) {
  const contactEmail = process.env.CONTACT_EMAIL || 'info@destec.co.il';
  return sendMail({
    to: [contactEmail], fromName: 'DES Orders', replyTo: customer.email || undefined,
    subject: `[הזמנה מהאתר${payment ? ' · שולם' : ''}] ${ref} — ${customer.name}${customer.clinic ? ` (${customer.clinic})` : ''} · ${lines.length} פריטים`,
    html: orderEmailHtml({ ref, customer, lines, payment }),
  });
}

// To the CUSTOMER, once the payment is approved: thanks + the order summary. Not a tax document —
// the קבלה is issued in des-manager (and must carry a secure digital signature to be e-mailed).
export type ReceiptAttachment = { filename: string; content: Buffer };
// `receipt`: the SIGNED חשבונית מס/קבלה from des-manager (a מסמך ממוחשב, 18ב) — attached when the
// customer consented at checkout; otherwise the document follows by print.
export async function sendCustomerThanks({ ref, customer, lines, payment, pdf, receipt }: { ref: string; customer: EmailCustomer; lines: EmailLine[]; payment: Payment; pdf?: Buffer | null; receipt?: ReceiptAttachment | null }) {
  if (!customer.email) return false;
  const site = process.env.SITE_URL || 'https://destec.co.il';
  const rows = lines.map((l) => `<tr><td style="padding:8px;border-bottom:1px solid #eee;">${esc(l.name)}${l.manufacturer ? ` <span style="color:#888;font-size:12px;">${esc(l.manufacturer)}</span>` : ''}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${l.qty}</td><td style="padding:8px;border-bottom:1px solid #eee;">${l.price ? ils(l.price * l.qty) : ''}</td></tr>`).join('');
  const html = `<div dir="rtl" style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#1a2b4a;">
    <h2 style="margin-bottom:4px;">תודה על הרכישה ב-DES!</h2>
    <p style="margin-top:0;color:#555;">${esc(customer.name)}, ההזמנה <span dir="ltr" style="font-family:monospace;">${esc(ref)}</span> התקבלה והתשלום אושר.</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0;">
      <thead><tr style="background:#f4f6f8;"><th style="padding:8px;text-align:right;">מוצר</th><th style="padding:8px;">כמות</th><th style="padding:8px;text-align:right;">סה״כ</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="font-size:16px;"><strong>סה״כ ששולם: ${ils(payment.amount)}</strong> <span style="color:#888;font-size:12px;">כולל מע״מ · אישור ${esc(payment.approval)}</span></p>
    ${customer.address ? `<p style="color:#555;">כתובת למשלוח/התקנה: ${esc(customer.address)}</p>` : ''}
    <p>${receipt
      ? 'הקבלה על התשלום מצורפת כקובץ PDF חתום דיגיטלית (מסמך ממוחשב), יחד עם אישור ההזמנה. חשבונית המס תופק ותישלח אליכם עם אספקת המוצרים.'
      : 'אישור ההזמנה מצורף כקובץ PDF; הקבלה על התשלום תישלח אליכם בנפרד, וחשבונית המס — עם אספקת המוצרים.'} נציג DES ייצור איתכם קשר בהקדם לאישור הזמינות ולתיאום המשלוח או ההתקנה.</p>
    <p style="margin:20px 0;"><a href="${site}/account" style="background:#1e90ff;color:#fff;padding:10px 18px;border-radius:10px;text-decoration:none;font-weight:bold;">ההזמנות שלי באתר</a></p>
    <hr style="margin:20px 0;border:none;border-top:1px solid #eee;" />
    <p style="color:#999;font-size:12px;">DES — שירותי ציוד רפואי ודנטלי · 054-881-8681 · info@destec.co.il</p>
  </div>`;
  const attachments = [...(receipt ? [receipt] : []), ...(pdf ? [{ filename: `DES-order-${ref}.pdf`, content: pdf }] : [])];
  return sendMail({
    to: [customer.email], fromName: 'DES', replyTo: process.env.CONTACT_EMAIL || 'info@destec.co.il',
    subject: `תודה על הרכישה ב-DES — הזמנה ${ref}`, html,
    attachments: attachments.length ? attachments : undefined,
  });
}
