// The order-confirmation PDF attached to the buyer's thank-you e-mail. Rendered from HTML by
// headless Chromium, so Hebrew and RTL come out right. NOT a tax document (it says so): the
// קבלה / חשבונית מס-קבלה is issued in des-manager.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { EmailCustomer, EmailLine, Payment } from './orderEmail';

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ils = (n: number) => new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 2 }).format(n);
const fmtDate = (d: Date) => d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Jerusalem' });

export function orderConfirmationHtml({ ref, customer, lines, payment, date = new Date(), logoDataUrl = '' }: {
  ref: string; customer: EmailCustomer; lines: EmailLine[]; payment: Payment; date?: Date; logoDataUrl?: string;
}) {
  const subtotal = lines.reduce((s, l) => s + (l.price ? l.price * l.qty : 0), 0);
  const rows = lines.map((l, i) => `<tr>
      <td class="c">${i + 1}</td>
      <td>${esc(l.name)}${l.manufacturer ? `<div class="sub">${esc(l.manufacturer)}</div>` : ''}</td>
      <td class="mono">${esc(l.itemNumber || '')}</td>
      <td class="c">${l.qty}</td>
      <td class="num">${l.price ? ils(l.price) : ''}</td>
      <td class="num">${l.price ? ils(l.price * l.qty) : ''}</td>
    </tr>`).join('');
  return `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8">
<style>
  @page { size: A4; margin: 16mm 14mm; }
  body { font-family: "Noto Sans Hebrew", "Arial Hebrew", Arial, sans-serif; color: #1a2b4a; font-size: 12.5px; margin: 0; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #1a2b4a; padding-bottom: 12px; margin-bottom: 18px; }
  .brand { font-size: 11px; color: #555; line-height: 1.5; }
  h1 { font-size: 22px; margin: 0 0 4px; }
  .meta { font-size: 12px; color: #555; }
  .mono { font-family: Menlo, Consolas, monospace; direction: ltr; unicode-bidi: embed; text-align: right; }
  .box { border: 1px solid #e8ecf0; border-radius: 8px; padding: 10px 12px; margin: 10px 0; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .lbl { font-size: 10.5px; color: #777; }
  table { width: 100%; border-collapse: collapse; margin-top: 14px; }
  th { background: #f4f6f8; text-align: right; padding: 7px 8px; font-size: 11.5px; }
  td { padding: 7px 8px; border-bottom: 1px solid #eee; vertical-align: top; }
  .c { text-align: center; } .num { text-align: left; direction: ltr; white-space: nowrap; }
  .sub { color: #888; font-size: 10.5px; }
  .total { display: flex; justify-content: flex-start; gap: 24px; margin-top: 12px; font-size: 14px; }
  .paid { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; border-radius: 8px; padding: 10px 12px; margin-top: 14px; }
  .note { margin-top: 26px; font-size: 11px; color: #777; border-top: 1px solid #eee; padding-top: 10px; line-height: 1.6; }
</style></head><body>
  <div class="head">
    <div>
      <h1>אישור הזמנה</h1>
      <div class="meta">מספר הזמנה <span class="mono">${esc(ref)}</span> · תאריך ${fmtDate(date)}</div>
    </div>
    <div style="text-align:left">
      ${logoDataUrl ? `<img src="${logoDataUrl}" style="height:46px" alt="DES">` : '<div style="font-weight:700;font-size:20px">DES</div>'}
      <div class="brand">DES — שירותי ציוד רפואי ודנטלי<br>054-881-8681 · info@destec.co.il · destec.co.il</div>
    </div>
  </div>
  <div class="box grid">
    <div><div class="lbl">לכבוד</div><div><b>${esc(customer.name)}</b>${customer.clinic ? `<br>${esc(customer.clinic)}` : ''}</div></div>
    <div><div class="lbl">פרטי קשר</div><div><span class="mono">${esc(customer.phone)}</span>${customer.email ? `<br><span class="mono">${esc(customer.email)}</span>` : ''}</div></div>
    ${customer.address ? `<div style="grid-column:1/-1"><div class="lbl">כתובת למשלוח / התקנה</div><div>${esc(customer.address)}</div></div>` : ''}
  </div>
  <table>
    <thead><tr><th class="c">#</th><th>מוצר</th><th>מק״ט</th><th class="c">כמות</th><th>מחיר ליח׳</th><th>סה״כ</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="total"><span>סה״כ לתשלום (כולל מע״מ):</span><b>${ils(subtotal)}</b></div>
  <div class="paid">✔ שולם בכרטיס אשראי באתר (קרדיט 2000) — ${ils(payment.amount)} · אישור ${esc(payment.approval)}${payment.brand ? ` · ${esc(payment.brand)}` : ''}</div>
  ${customer.notes ? `<div class="box"><div class="lbl">הערות</div><div>${esc(customer.notes)}</div></div>` : ''}
  <div class="note">
    מסמך זה הוא אישור הזמנה בלבד ואינו חשבונית או קבלה. חשבונית מס/קבלה תופק ותישלח אליכם על ידי DES.<br>
    נציג DES ייצור עמכם קשר לתיאום המשלוח או ההתקנה. תודה שבחרתם ב-DES.
  </div>
</body></html>`;
}

async function launch() {
  const puppeteer = await import('puppeteer-core');
  // Locally (dev/tests) point CHROME_PATH at any Chrome; on Vercel the packaged Chromium is used.
  if (process.env.CHROME_PATH) {
    return puppeteer.default.launch({ executablePath: process.env.CHROME_PATH, headless: true, args: ['--no-sandbox', '--disable-gpu'] });
  }
  const chromium = (await import('@sparticuz/chromium')).default;
  return puppeteer.default.launch({ executablePath: await chromium.executablePath(), args: chromium.args, headless: true });
}

export async function renderOrderPdf(input: Parameters<typeof orderConfirmationHtml>[0]): Promise<Buffer> {
  let logoDataUrl = input.logoDataUrl || '';
  if (!logoDataUrl) {
    try { logoDataUrl = `data:image/png;base64,${(await readFile(path.join(process.cwd(), 'public', 'des_logo.png'))).toString('base64')}`; } catch { /* no logo */ }
  }
  const browser = await launch();
  try {
    const page = await browser.newPage();
    await page.setContent(orderConfirmationHtml({ ...input, logoDataUrl }), { waitUntil: 'load' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
