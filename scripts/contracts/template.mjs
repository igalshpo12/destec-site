// Builds the RTL Hebrew HTML body for a DES × AJAX sales agreement.
// Fill-in fields are emitted as <span class="field" data-field="…"> blank underlines;
// render.mjs measures them and overlays interactive AcroForm fields at the same spot.

import {
  COMPANY, MODELS,
  DELIVERY_CLAUSES, WARRANTY_CLAUSES, PROPER_USE_CLAUSES, PROPER_USE_EXTRA,
  EXCLUSION_CLAUSES, OWNERSHIP_CLAUSES, GENERAL_CLAUSES,
} from './data.mjs';

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// A fill-in field: blank underline of a given width (mm).
function field(name, w, type = 'text') {
  return `<span class="field" data-field="${name}" data-type="${type}" style="min-width:${w}mm;width:${w}mm"></span>`;
}

// Replace [[field|width]] tokens inside clause text with field spans.
function withFields(text) {
  return esc(text).replace(/\[\[(\w+)\|(\d+)\]\]/g, (_, name, w) => field(name, w));
}

function clauseList(items) {
  const lis = items
    .map(([n, t]) => `<li><span class="num">${esc(n)}</span><span class="txt">${withFields(t)}</span></li>`)
    .join('');
  return `<ol class="clauses">${lis}</ol>`;
}

// A section that may be split across pages (heading + clause list).
function splitSection(title, items, intro) {
  const introHtml = intro ? `<div class="intro">${esc(intro)}</div>` : '';
  return `<section class="blk" data-split="yes"><h2 class="sec">${esc(title)}</h2>${introHtml}${clauseList(items)}</section>`;
}

// An atomic section (never split).
function atomicSection(inner) {
  return `<section class="blk" data-split="no">${inner}</section>`;
}

export function buildBody(model, { logoSrc } = {}) {
  const m = MODELS[model];
  if (!m) throw new Error(`Unknown model: ${model}`);

  const properUse = [...PROPER_USE_CLAUSES, ...(PROPER_USE_EXTRA[model] || [])];

  // ── Header (logo + seller legal block + title + doc meta + trust bar) ──
  const header = atomicSection(`
    <div class="doc-header">
      <img class="logo" src="${logoSrc || ''}" alt="DES" />
      <div class="seller">
        <div class="name">${esc(COMPANY.legalName)}</div>
        <div>עוסק מורשה ${esc(COMPANY.vatId)}</div>
        <div>${esc(COMPANY.address)} ${esc(COMPANY.zip)}</div>
        <div>טל' ${esc(COMPANY.phone)} · ${esc(COMPANY.email)}</div>
        <div>${esc(COMPANY.web)}</div>
        <div class="certs">${esc(COMPANY.certs)}</div>
      </div>
    </div>
    <div class="doc-title">
      <h1>הסכם מכר</h1>
      <div class="sub">${esc(m.title)}</div>
    </div>
    <div class="doc-meta">
      <div>הסכם מס' ${field('doc_no', 30)}</div>
      <div>תאריך ${field('doc_date', 32, 'date')}</div>
    </div>
    <div class="trust-bar">
      <span>ISO 9001</span><span>רישיון אמ״ר</span>
      <span>יבואן ומפיץ מורשה</span><span>מאז ${esc(COMPANY.founded)}</span>
    </div>
    <div class="intro">שנערך ונחתם ביום הנקוב לעיל, בין המוכר לבין הקונה כמפורט להלן:</div>
  `);

  // ── 1. הצדדים ──
  const parties = atomicSection(`
    <h2 class="sec">1. הצדדים</h2>
    <table class="grid">
      <tr><th>המוכר</th>
        <td>${esc(COMPANY.legalName)} · עוסק מורשה ${esc(COMPANY.vatId)}<br/>
        ${esc(COMPANY.address)} ${esc(COMPANY.zip)} · טל' ${esc(COMPANY.phone)} · ${esc(COMPANY.email)}
        <br/>(להלן: "המוכר")</td></tr>
      <tr><td class="label">שם הקונה / המרפאה</td><td>${field('buyer_name', 95)}</td></tr>
      <tr><td class="label">ח.פ / ע.מ</td><td>${field('buyer_id', 55)}</td></tr>
      <tr><td class="label">כתובת המרפאה</td><td>${field('buyer_address', 110)}</td></tr>
      <tr><td class="label">איש קשר</td><td>${field('buyer_contact', 60)}</td></tr>
      <tr><td class="label">טלפון</td><td>${field('buyer_phone', 45, 'tel')}</td></tr>
      <tr><td class="label">דוא״ל</td><td>${field('buyer_email', 70)}</td></tr>
    </table>
    <div class="intro">הקונה כאמור לעיל יכונה להלן: "הקונה".</div>
  `);

  // ── 2. הממכר ──
  const specRows = m.specRows
    .map(([k, v]) => `<tr><td class="label">${esc(k)}</td><td>${esc(v)}</td></tr>`)
    .join('');
  const goods = atomicSection(`
    <h2 class="sec">2. הממכר</h2>
    <div class="intro">המוכר מוכר לקונה, והקונה רוכש מהמוכר, ${esc(m.title)} (להלן: "הממכר"), על כל מרכיביה ואביזריה כמפורט להלן:</div>
    <table class="grid">${specRows}</table>
    <table class="grid">
      <tr><td class="label">מספר סידורי</td><td>${field('serial_no', 55)}</td>
          <td class="label">כמות</td><td>${field('qty', 20)}</td></tr>
      <tr><td class="label">אביזרים כלולים</td><td colspan="3">${esc(m.accessories)}</td></tr>
    </table>
  `);

  // ── 3. התמורה ותנאי תשלום ──
  const consideration = atomicSection(`
    <h2 class="sec">3. התמורה ותנאי תשלום</h2>
    <table class="grid pay">
      <tr><td class="label">מחיר לפני מע״מ (₪)</td><td class="money">${field('price_before', 45)}</td></tr>
      <tr><td class="label">מע״מ ${COMPANY.vatRate}% (₪)</td><td class="money">${field('vat_amount', 45)}</td></tr>
      <tr><td class="label">סה״כ לתשלום כולל מע״מ (₪)</td><td class="money">${field('price_total', 45)}</td></tr>
    </table>
    <table class="grid pay">
      <caption>לוח תשלומים</caption>
      <tr><td class="label">מקדמה עם החתימה (₪)</td><td class="money">${field('pay_advance', 45)}</td></tr>
      <tr><td class="label">בעת המסירה (₪)</td><td class="money">${field('pay_delivery', 45)}</td></tr>
      <tr><td class="label">יתרה (₪)</td><td class="money">${field('pay_balance', 45)}</td></tr>
    </table>
    <div class="note">המחיר אינו כולל עלויות הכנת אתר ההתקנה (חשמל, מים, אוויר דחוס וניקוז), אשר יחולו על הקונה. פיגור בתשלום יישא ריבית והצמדה כדין.</div>
  `);

  // ── 4–9 legal sections ──
  const delivery = splitSection('4. אספקה, התקנה והדרכה', DELIVERY_CLAUSES);
  const warranty = splitSection('5. אחריות', WARRANTY_CLAUSES);
  const proper = splitSection('6. שימוש נכון וחובות המשתמש', properUse,
    'לשמירה על תקינות הממכר ולתוקף האחריות, מתחייב הקונה להקפיד על הכללים הבאים:');
  const exclusions = splitSection('7. סייגים לאחריות', EXCLUSION_CLAUSES,
    'האחריות לא תחול, ותהיה בטלה, במקרים הבאים:');
  const ownership = splitSection('8. בעלות וסיכון', OWNERSHIP_CLAUSES);
  const general = splitSection('9. כללי', GENERAL_CLAUSES);

  // ── 10. חתימות ──
  const signatures = atomicSection(`
    <h2 class="sec">10. חתימות</h2>
    <div class="intro">ולראיה באו הצדדים על החתום:</div>
    <div class="sign-wrap">
      <div class="sign-box">
        <div class="who">המוכר — ${esc(COMPANY.legalName)}</div>
        <div class="sign-line">שם החותם</div>
        <div class="row">
          <div class="cell sign-line">חתימה + חותמת</div>
          <div class="cell sign-line">תאריך</div>
        </div>
      </div>
      <div class="sign-box">
        <div class="who">הקונה</div>
        <div class="sign-line">שם החותם</div>
        <div class="row">
          <div class="cell sign-line">חתימה + חותמת</div>
          <div class="cell sign-line">תאריך</div>
        </div>
      </div>
    </div>
    <div class="note">מסמך זה הוא טיוטה עסקית סטנדרטית ואינו מהווה ייעוץ משפטי. מומלץ להעביר את ההסכם לבדיקת עורך דין לפני חתימה.</div>
  `);

  const blocks = [
    header, parties, goods, consideration,
    delivery, warranty, proper, exclusions, ownership, general,
    signatures,
  ].join('\n');

  return `<div id="source">${blocks}</div><div id="pages"></div>`;
}
