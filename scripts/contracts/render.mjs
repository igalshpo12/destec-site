#!/usr/bin/env node
/**
 * Renders the DES × AJAX Hebrew sales agreements to branded, fillable A4 PDFs.
 *
 * Pipeline: build RTL HTML → Chromium lays it out into A4 .page containers via an
 * in-browser paginator → page.pdf() gives a flat PDF with blank underlines →
 * pdf-lib overlays interactive AcroForm text fields (Hebrew-capable font) exactly
 * over those underlines, so fields are typeable AND print as blank lines when empty.
 *
 * Usage:  node scripts/contracts/render.mjs
 * Output: asset-gen/contracts/ (working) + docs/contracts/ (tracked deliverables)
 */

import { chromium } from 'playwright';
import { PDFDocument, TextAlignment, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildBody } from './template.mjs';
import { COMPANY, MODELS } from './data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const FONT_DIR = path.join(__dirname, 'fonts');
const WORK_DIR = path.join(ROOT, 'asset-gen', 'contracts');
const DOCS_DIR = path.join(ROOT, 'docs', 'contracts');

const FILENAMES = {
  AJ15: 'הסכם-מכר-AJAX-AJ15.pdf',
  AJ25: 'הסכם-מכר-AJAX-AJ25.pdf',
};

// Numeric / LTR fields are left-aligned; Hebrew text fields are right-aligned.
const LEFT_ALIGN = new Set([
  'doc_no', 'doc_date', 'serial_no', 'qty', 'buyer_id', 'buyer_phone', 'delivery_date',
  'price_before', 'vat_amount', 'price_total', 'pay_advance', 'pay_delivery', 'pay_balance',
]);

function findChrome() {
  const base = '/opt/pw-browsers';
  try {
    const dirs = fs.readdirSync(base).filter((d) => /^chromium-\d+$/.test(d)).sort();
    for (const d of dirs.reverse()) {
      const p = path.join(base, d, 'chrome-linux', 'chrome');
      if (fs.existsSync(p)) return p;
    }
  } catch { /* fall through */ }
  return undefined;
}

function dataUri(file, mime) {
  return `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;
}

function buildFontFaceCss() {
  const face = (weight, f) =>
    `@font-face{font-family:'Noto Sans Hebrew';font-style:normal;font-weight:${weight};` +
    `src:url(${dataUri(path.join(FONT_DIR, f), 'font/ttf')}) format('truetype');}`;
  return [
    face(400, 'NotoSansHebrew-Regular.ttf'),
    face(500, 'NotoSansHebrew-Medium.ttf'),
    face(700, 'NotoSansHebrew-Bold.ttf'),
  ].join('\n');
}

/* ── Runs inside the browser: paginate into A4 pages, then measure field boxes. ── */
function paginateAndMeasure(footerText) {
  const pagesEl = document.getElementById('pages');
  const source = document.getElementById('source');
  let page, body;

  function addPage() {
    page = document.createElement('div');
    page.className = 'page';
    body = document.createElement('div');
    body.className = 'page-body';
    const foot = document.createElement('div');
    foot.className = 'page-foot';
    foot.innerHTML = '<span class="co"></span><span class="pnum"></span>';
    foot.querySelector('.co').textContent = footerText;
    page.appendChild(body);
    page.appendChild(foot);
    pagesEl.appendChild(page);
  }
  function fits() { return body.scrollHeight <= body.clientHeight + 1; }

  function makeShell(section, includeIntro, cont) {
    const s = document.createElement('section');
    s.className = 'blk';
    const h2 = section.querySelector(':scope > h2.sec');
    if (h2) {
      const nh = h2.cloneNode(true);
      if (cont) { nh.classList.add('cont'); nh.textContent = h2.textContent + ' (המשך)'; }
      s.appendChild(nh);
    }
    if (includeIntro) {
      const intro = section.querySelector(':scope > .intro');
      if (intro) s.appendChild(intro.cloneNode(true));
    }
    const ol = document.createElement('ol');
    ol.className = 'clauses';
    s.appendChild(ol);
    return { shell: s, ol };
  }

  addPage();
  const blocks = Array.from(source.children);

  for (const blk of blocks) {
    body.appendChild(blk);
    if (fits()) continue;

    if (blk.dataset.split === 'yes') {
      body.removeChild(blk);
      const items = Array.from(blk.querySelectorAll(':scope > ol.clauses > li'));
      let { shell, ol } = makeShell(blk, true, false);
      body.appendChild(shell);
      if (!fits() && body.children.length > 1) {
        body.removeChild(shell);
        addPage();
        body.appendChild(shell);
      }
      for (const it of items) {
        ol.appendChild(it);
        if (!fits()) {
          if (ol.children.length === 1) continue; // single item taller than page: accept
          ol.removeChild(it);
          addPage();
          ({ shell, ol } = makeShell(blk, false, true));
          body.appendChild(shell);
          ol.appendChild(it);
        }
      }
    } else {
      if (body.children.length === 1) continue; // alone & overflowing: accept
      body.removeChild(blk);
      addPage();
      body.appendChild(blk);
    }
  }

  source.remove();

  const pageEls = Array.from(document.querySelectorAll('#pages > .page'));
  const total = pageEls.length;
  pageEls.forEach((p, i) => {
    const pn = p.querySelector('.page-foot .pnum');
    if (pn) pn.textContent = 'עמוד ' + (i + 1) + ' מתוך ' + total;
  });

  const fields = [];
  pageEls.forEach((p, pi) => {
    const pr = p.getBoundingClientRect();
    p.querySelectorAll('.field').forEach((f) => {
      const r = f.getBoundingClientRect();
      fields.push({
        name: f.dataset.field,
        type: f.dataset.type || 'text',
        page: pi,
        leftPx: r.left - pr.left,
        topPx: r.top - pr.top,
        wPx: r.width,
        hPx: r.height,
      });
    });
  });

  const p0 = pageEls[0].getBoundingClientRect();
  return { pageCount: total, pageWidthPx: p0.width, pageHeightPx: p0.height, fields };
}

async function renderModel(browser, model, assets) {
  const footerText = `${COMPANY.legalName} · עוסק מורשה ${COMPANY.vatId} · ${COMPANY.phone} · ${COMPANY.web}`;
  const html =
    `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8">` +
    `<style>${assets.fontFaceCss}</style><style>${assets.stylesCss}</style></head>` +
    `<body>${buildBody(model, { logoSrc: assets.logoSrc })}</body></html>`;

  const page = await browser.newPage({ viewport: { width: 900, height: 1300 }, deviceScaleFactor: 2 });
  await page.emulateMedia({ media: 'print' });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);

  const meas = await page.evaluate(paginateAndMeasure, footerText);
  const flatPdf = await page.pdf({ printBackground: true, preferCSSPageSize: true });

  // QA screenshots of every page.
  const pageEls = await page.$$('#pages > .page');
  for (let i = 0; i < pageEls.length; i++) {
    await pageEls[i].screenshot({ path: path.join(WORK_DIR, `qa-${model}-p${i + 1}.png`) });
  }
  await page.close();

  // Overlay interactive AcroForm fields with pdf-lib.
  const pdfDoc = await PDFDocument.load(flatPdf);
  pdfDoc.registerFontkit(fontkit);
  const hebFont = await pdfDoc.embedFont(assets.regularTtf, { subset: false });
  const form = pdfDoc.getForm();
  const pdfPages = pdfDoc.getPages();
  const pw = pdfPages[0].getWidth();
  const ph = pdfPages[0].getHeight();
  const sx = pw / meas.pageWidthPx;
  const sy = ph / meas.pageHeightPx;

  const used = new Map();
  for (const f of meas.fields) {
    const p = pdfPages[f.page];
    if (!p) continue;
    const x = f.leftPx * sx;
    const w = f.wPx * sx;
    const h = Math.max(f.hPx * sy, 11);
    const y = ph - f.topPx * sy - h;

    let name = f.name;
    const n = (used.get(f.name) || 0) + 1;
    used.set(f.name, n);
    if (n > 1) name = `${f.name}_${n}`;

    const tf = form.createTextField(name);
    tf.setText('');
    tf.setAlignment(LEFT_ALIGN.has(f.name) ? TextAlignment.Left : TextAlignment.Right);
    tf.addToPage(p, {
      x, y, width: w, height: h,
      font: hebFont,
      textColor: rgb(0.05, 0.1, 0.28),
      borderWidth: 0,
    });
    tf.setFontSize(10);
  }
  form.updateFieldAppearances(hebFont);
  const finalPdf = await pdfDoc.save();

  const outName = FILENAMES[model];
  fs.writeFileSync(path.join(WORK_DIR, outName), finalPdf);
  fs.writeFileSync(path.join(DOCS_DIR, outName), finalPdf);

  console.log(`✅  ${model}: ${meas.pageCount} pages, ${meas.fields.length} fields → ${outName}`);
  return { model, pages: meas.pageCount, fields: meas.fields.length, file: outName };
}

function writeReadme(results) {
  const line = (r) =>
    `- **${MODELS[r.model].title}** — [${FILENAMES[r.model]}](./${encodeURI(FILENAMES[r.model])}) · ` +
    `${r.pages} עמ' · ${r.fields} שדות למילוי.`;
  const md = `# הסכמי מכר — DES × AJAX

מסמכים אלה הם הסכמי מכר בעברית עבור יחידות הטיפול הדנטליות AJAX, לשימוש ${COMPANY.legalName}.

## הקבצים
${results.map(line).join('\n')}

הקבצים הם PDF ניתנים למילוי: ניתן להקליד בשדות המסחריים (שם הקונה, מחיר, מע״מ, לוח תשלומים,
מס' סידורי ועוד) בכל קורא PDF, והם מודפסים כשורות ריקות כאשר הם נותרים ללא מילוי.

## עיקרי האחריות
אחריות 24 חודשים על חלקים ממועד ההתקנה. עבודת טכנאי וקריאת שירות לאחר ההתקנה — לפי מחירון
השירות. האחריות מותנית בשימוש נכון (שטיפת/חיטוי קווי מים, איסור הרצה יבשה, חשמל/מים/אוויר בתקן),
וכפופה לסייגים ולחלקים המתכלים המפורטים בהסכם.

## חשוב
מסמכים אלה הם טיוטות עסקיות סטנדרטיות ואינם מהווים ייעוץ משפטי. מומלץ להעביר לבדיקת עורך דין
לפני חתימה מחייבת.

## הפקה מחדש
\`\`\`
npm install
node scripts/contracts/render.mjs
\`\`\`
המקור: \`scripts/contracts/\` (data.mjs · template.mjs · styles.css · render.mjs · fonts/).
`;
  fs.writeFileSync(path.join(DOCS_DIR, 'README.md'), md);
}

async function main() {
  fs.mkdirSync(WORK_DIR, { recursive: true });
  fs.mkdirSync(DOCS_DIR, { recursive: true });

  const assets = {
    fontFaceCss: buildFontFaceCss(),
    stylesCss: fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8'),
    logoSrc: dataUri(path.join(ROOT, 'public', 'des_logo.png'), 'image/png'),
    regularTtf: fs.readFileSync(path.join(FONT_DIR, 'NotoSansHebrew-Regular.ttf')),
  };

  const browser = await chromium.launch({ headless: true, executablePath: findChrome() });
  const results = [];
  try {
    for (const model of ['AJ15', 'AJ25']) {
      results.push(await renderModel(browser, model, assets));
    }
  } finally {
    await browser.close();
  }
  writeReadme(results);
  console.log(`\n📄  Done. PDFs in docs/contracts/ and asset-gen/contracts/.`);
}

main().catch((err) => { console.error(err); process.exit(1); });
