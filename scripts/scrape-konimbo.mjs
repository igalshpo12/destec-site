/**
 * Scrape the Konimbo storefront for the active catalog — gentle, resumable.
 *
 * Konimbo rate-limits bulk access aggressively, so this runs at concurrency 1
 * with pacing + long cooldowns when it detects a block, and saves progress
 * incrementally. Re-running skips products already captured (resume).
 *
 * Source spine: data/konimbo-active.xml (762 active products from admin export).
 * Per product it fetches the public page https://www.destec.co.il/items/<id> and
 * extracts, in order of preference:
 *   - description: #item_content (long) -> #item_current_sub_title (short)
 *   - image:       JSON-LD Product.image (original res) -> og:image
 *   - manufacturer: JSON-LD Product.brand.name
 * No auth required.
 *
 * Output: data/konimbo-products.json
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse as parseHtml } from 'node-html-parser';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_DIR = join(ROOT, 'data');
const OUT = join(DATA_DIR, 'konimbo-products.json');

const REQ_DELAY = Number(process.env.REQ_DELAY) || 1100; // ms between requests
const COOLDOWN = Number(process.env.COOLDOWN) || 150000; // ms to wait when blocked
const MAX_COOLDOWNS = 8;                                  // per product before giving up
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36';
const HEADERS = { 'User-Agent': UA, 'Accept-Language': 'he-IL,he;q=0.9,en;q=0.8', 'Accept': 'text/html,application/xhtml+xml' };
const sleep = ms => new Promise(r => setTimeout(r, ms));

// --- XML spine ---
const decode = s => (s || '')
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
const tag = (b, n) => { const m = b.match(new RegExp(`<${n}>([\\s\\S]*?)</${n}>`)); return m ? decode(m[1]) : null; };
const xml = readFileSync(join(DATA_DIR, 'konimbo-active.xml'), 'utf8');
const spine = [...xml.matchAll(/<Item>([\s\S]*?)<\/Item>/g)].map(m => m[1]).map(b => {
  const id = (tag(b, 'visit_link') || '').match(/item_id=(\d+)/)?.[1] || null;
  return { konimbo_id: id, sku: tag(b, 'ID'), name: tag(b, 'Desc'), price: parseFloat(tag(b, 'price1')) || null, category: tag(b, 'category'), brand: tag(b, 'brand') || null };
}).filter(p => p.konimbo_id);
console.log(`Spine: ${spine.length} active products`);

// --- resume: load prior results ---
const byId = new Map();
if (existsSync(OUT)) {
  try { JSON.parse(readFileSync(OUT, 'utf8')).forEach(r => byId.set(r.konimbo_id, r)); } catch {}
}
const isGood = r => r && r.ok && (r.description_text || r.image_src); // has at least desc or image
const todo = spine.filter(p => !isGood(byId.get(p.konimbo_id)));
console.log(`Already captured: ${[...byId.values()].filter(isGood).length} | to fetch: ${todo.length}`);

const stripTags = s => (s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || null;
const save = () => writeFileSync(OUT, JSON.stringify(spine.map(p => byId.get(p.konimbo_id) || p), null, 2), 'utf8');

const isBlocked = html => html.length < 5000 || html.includes('נחסמת בגלל ריבוי') ||
  (!html.includes('application/ld+json') && !html.includes('og:image') && !html.includes('id="item_content"'));

const extract = (p, html) => {
  const root = parseHtml(html);
  let ld = {};
  for (const s of root.querySelectorAll('script[type="application/ld+json"]')) {
    try { const j = JSON.parse(s.text); if ((j['@type'] || '').includes?.('Product') || j['@type'] === 'Product') ld = j; } catch {}
  }
  const og = root.querySelector('meta[property="og:image"]')?.getAttribute('content') || null;
  const contentEl = root.querySelector('#item_content');
  if (contentEl) contentEl.querySelectorAll('#item_content_title').forEach(e => e.remove());
  const longDesc = contentEl ? stripTags(contentEl.innerHTML) : null;
  const shortDesc = stripTags(root.querySelector('#item_current_sub_title')?.innerHTML);
  return {
    ...p,
    page_url: `https://www.destec.co.il/items/${p.konimbo_id}`,
    h1: root.querySelector('h1')?.text?.trim() || null,
    image_src: (typeof ld.image === 'string' ? ld.image : og) || null,
    manufacturer: ld.brand?.name?.trim() || p.brand || null,
    ld_price: ld.offers?.price ? parseFloat(ld.offers.price) : null,
    description_text: longDesc || shortDesc || null,
    description_long: longDesc,
    description_short: shortDesc,
    ok: true,
  };
};

// --- crawl ---
let done = 0, blocks = 0;
for (const p of todo) {
  const url = `https://www.destec.co.il/items/${p.konimbo_id}`;
  let cooldowns = 0;
  while (true) {
    try {
      const res = await fetch(url, { redirect: 'follow', headers: HEADERS });
      const html = await res.text();
      if (res.ok && !isBlocked(html)) { byId.set(p.konimbo_id, extract(p, html)); break; }
      throw new Error(res.ok ? `blocked/thin (${html.length}b)` : `HTTP ${res.status}`);
    } catch (e) {
      cooldowns++;
      blocks++;
      if (cooldowns > MAX_COOLDOWNS) { byId.set(p.konimbo_id, { ...p, ok: false, error: String(e.message || e) }); break; }
      process.stdout.write(`\n   ⏸️  ${p.konimbo_id} ${e.message} — cooldown ${cooldowns}/${MAX_COOLDOWNS} (${COOLDOWN/1000}s)\n`);
      save();
      await sleep(COOLDOWN);
    }
  }
  done++;
  if (done % 10 === 0) { save(); process.stdout.write(`   fetched ${done}/${todo.length} (blocks so far: ${blocks})\r`); }
  await sleep(REQ_DELAY);
}
save();

const all = spine.map(p => byId.get(p.konimbo_id)).filter(Boolean);
console.log(`\n\nDone. ${all.length} products in ${OUT}`);
console.log(`  ✅ ok:            ${all.filter(r => r.ok).length}`);
console.log(`  📝 with desc:     ${all.filter(r => r.description_text).length}`);
console.log(`  🖼️  with image:    ${all.filter(r => r.image_src).length}`);
console.log(`  ❌ failed:        ${all.filter(r => !r.ok).length}`);
console.log(`  🚧 total blocks:  ${blocks}`);
