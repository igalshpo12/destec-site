/**
 * Load the Konimbo catalog into the standalone public `catalog_products` table.
 *
 * SAFE / non-destructive: only writes to catalog_products (and the products
 * storage bucket). Never touches the shared `equipment` / `equipment_prices` /
 * `client_equipment` tables used by the internal des-manager app.
 *
 * Prereq: run sql/catalog_products.sql once in the Supabase SQL editor.
 *
 * Usage:
 *   node scripts/load-catalog.mjs --dry-run   # download+upload images, preview rows
 *   node scripts/load-catalog.mjs             # upsert into catalog_products
 *
 * Requires in .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_DIR = join(ROOT, 'data');
const DRY_RUN = process.argv.includes('--dry-run');
const BUCKET = 'products';
const IMG_CONCURRENCY = 6;

const env = {};
readFileSync(join(ROOT, '.env.local'), 'utf8').split('\n').forEach(l => {
  const [k, ...v] = l.split('=');
  if (k && !k.startsWith('#')) env[k.trim()] = v.join('=').trim();
});
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) { console.error('❌ Need URL + SERVICE_ROLE_KEY in .env.local'); process.exit(1); }
const sb = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const products = JSON.parse(readFileSync(join(DATA_DIR, 'konimbo-products.json'), 'utf8')).filter(p => p.ok);
console.log(`Loaded ${products.length} scraped products`);

const ext = url => {
  const m = (url || '').split('?')[0].match(/\.(png|jpe?g|gif|webp)$/i);
  return m ? m[1].toLowerCase().replace('jpeg', 'jpg') : 'jpg';
};
const mime = e => ({ png: 'image/png', jpg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp' }[e] || 'image/jpeg');
const publicUrl = path => `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“',
  hellip: '…', deg: '°', times: '×', middot: '·', bull: '•', plusmn: '±',
  laquo: '«', raquo: '»', shy: '', trade: '™', reg: '®', copy: '©',
};
const decodeEntities = s => {
  let out = s;
  for (let i = 0; i < 2; i++) {
    out = out
      .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
      .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
      .replace(/&([a-z]+);/gi, (m, n) => (ENTITIES[n.toLowerCase()] ?? m));
  }
  return out;
};
const clean = s => decodeEntities(s || '').replace(/\s+/g, ' ').trim() || null;

// --- ensure bucket ---
if (!DRY_RUN) {
  const { data: buckets } = await sb.storage.listBuckets();
  if (!buckets?.some(b => b.name === BUCKET)) {
    const { error } = await sb.storage.createBucket(BUCKET, { public: true });
    if (error) { console.error('❌ createBucket:', error.message); process.exit(1); }
    console.log(`✅ created public bucket "${BUCKET}"`);
  } else console.log(`bucket "${BUCKET}" exists`);
}

// --- re-host images (idempotent upsert) ---
console.log('\n📥 Re-hosting product images...');
let imgOk = 0, imgSkip = 0, imgFail = 0, imgDone = 0;
const rehost = async (p) => {
  if (!p.image_src) { p._image_url = null; imgSkip++; imgDone++; return; }
  const path = `${p.konimbo_id}.${ext(p.image_src)}`;
  try {
    const res = await fetch(p.image_src, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (!DRY_RUN) {
      const { error } = await sb.storage.from(BUCKET).upload(path, buf, { contentType: mime(ext(p.image_src)), upsert: true });
      if (error) throw new Error(error.message);
    }
    p._image_url = publicUrl(path); imgOk++;
  } catch (err) { p._image_url = null; p._image_error = String(err.message || err); imgFail++; }
  finally { imgDone++; if (imgDone % 25 === 0 || imgDone === products.length) process.stdout.write(`   images ${imgDone}/${products.length}\r`); }
};
{
  let i = 0;
  await Promise.all(Array.from({ length: IMG_CONCURRENCY }, async () => { while (i < products.length) await rehost(products[i++]); }));
}
console.log(`\n   ✅ uploaded ${imgOk}  |  ⏭️  no source ${imgSkip}  |  ❌ failed ${imgFail}`);

// --- build rows ---
const rows = products.map((p, i) => ({
  konimbo_id: String(p.konimbo_id),
  item_number: clean(p.sku),
  name_he: clean(p.name) || clean(p.h1) || String(p.konimbo_id),
  manufacturer: clean(p.manufacturer) || clean(p.brand),
  category: clean(p.category),
  description_he: clean(p.description_text),
  image_url: p._image_url,
  price: p.price ?? p.ld_price ?? null,
  currency: 'ILS',
  is_active: true,
  sort_order: i,
}));

if (DRY_RUN) {
  console.log('\n🔵 DRY RUN — no DB writes.');
  console.log(`   Would upsert ${rows.length} catalog_products (${rows.filter(r => r.image_url).length} with image, ${rows.filter(r => r.description_he).length} with description, ${rows.filter(r => r.price != null).length} with price).`);
  console.log('   Sample:', JSON.stringify({ ...rows.find(r => r.image_url && r.description_he), description_he: '…' }, null, 2));
  process.exit(0);
}

// --- upsert ---
console.log(`\n⬆️  Upserting ${rows.length} rows into catalog_products...`);
const BATCH = 200;
let up = 0;
for (let i = 0; i < rows.length; i += BATCH) {
  const { error } = await sb.from('catalog_products').upsert(rows.slice(i, i + BATCH), { onConflict: 'konimbo_id' });
  if (error) {
    if (/relation .*catalog_products.* does not exist/i.test(error.message))
      console.error('\n❌ Table missing. Run sql/catalog_products.sql in the Supabase SQL editor first.');
    else console.error('\n❌ upsert:', error.message);
    process.exit(1);
  }
  up += Math.min(BATCH, rows.length - i);
  process.stdout.write(`   upserted ${up}/${rows.length}\r`);
}

const { count } = await sb.from('catalog_products').select('*', { count: 'exact', head: true });
console.log(`\n\n✅ Done. catalog_products now has ${count} rows.`);
console.log(`   with image:       ${rows.filter(r => r.image_url).length}`);
console.log(`   with description: ${rows.filter(r => r.description_he).length}`);
console.log(`   with price:       ${rows.filter(r => r.price != null).length}`);
console.log('\n🔜 Next: repoint the site catalog queries to catalog_products, set CATALOG_LIVE=true, push.');
