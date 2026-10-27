/**
 * Load the AJAX Dental (ajaxdent.com) product line into the public
 * `catalog_products` table + re-host their images in the `products` bucket.
 *
 * SAFE / non-destructive: only touches catalog_products rows whose
 * konimbo_id starts with "ajax:" (idempotent upsert) and the
 * products/ajax/ storage folder. Never touches the shared `equipment` tables.
 *
 * Usage:
 *   node scripts/load-ajax.mjs <dir-with-source-images> [--dry-run] [--skip-images]
 *
 * Copy lives in data/ajax-products.json (intro + features + specs → description_he).
 * Requires in .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC_DIR = process.argv[2];
const DRY_RUN = process.argv.includes('--dry-run');
const SKIP_IMAGES = process.argv.includes('--skip-images');
const BUCKET = 'products';
const MANUFACTURER = 'AJAX';

if (!SRC_DIR || !existsSync(SRC_DIR)) { console.error('Usage: node scripts/load-ajax.mjs <src-image-dir> [--dry-run]'); process.exit(1); }

const env = {};
readFileSync(join(ROOT, '.env.local'), 'utf8').split('\n').forEach(l => {
  const [k, ...v] = l.split('='); if (k && !k.startsWith('#')) env[k.trim()] = v.join('=').trim();
});
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) { console.error('❌ Need URL + SERVICE_ROLE_KEY in .env.local'); process.exit(1); }
const sb = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
const publicUrl = path => `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;

const data = JSON.parse(readFileSync(join(ROOT, 'data', 'ajax-products.json'), 'utf8'));

function buildDescription(p) {
  const parts = [p.intro.trim()];
  if (p.features?.length) parts.push('תכונות עיקריות:\n' + p.features.map(f => `• ${f}`).join('\n'));
  if (p.specs?.length) parts.push('מפרט:\n' + p.specs.map(s => `• ${s}`).join('\n'));
  return parts.join('\n\n');
}

/** Main catalog image: ≤1600px, WebP, alpha kept (card bg is white, page bg is light). */
async function toWebp(srcPath) {
  const img = sharp(srcPath, { limitInputPixels: false });
  const meta = await img.metadata();
  return img
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 86, alphaQuality: 90, effort: 5 })
    .toBuffer()
    .then(buf => ({ buf, meta }));
}

async function uploadWebp(path, buf) {
  const { error } = await sb.storage.from(BUCKET).upload(path, buf, { contentType: 'image/webp', upsert: true });
  if (error) throw new Error(`upload ${path}: ${error.message}`);
  return publicUrl(path);
}

const rows = [];
for (const p of data.products) {
  const srcPath = join(SRC_DIR, p.src);
  let image_url = null;
  if (!SKIP_IMAGES) {
    if (!existsSync(srcPath)) { console.error(`❌ missing image ${srcPath}`); process.exit(1); }
    const { buf, meta } = await toWebp(srcPath);
    const path = `ajax/${p.slug}.webp`;
    if (DRY_RUN) { console.log(`  [dry] ${p.model}: ${meta.width}x${meta.height} ${meta.format} → ${path} (${(buf.length/1024).toFixed(0)} KB)`); image_url = publicUrl(path); }
    else { image_url = await uploadWebp(path, buf); console.log(`  ↑ ${path} (${(buf.length/1024).toFixed(0)} KB)`); }
  }
  const row = {
    konimbo_id: `ajax:${p.slug}`,
    item_number: `AJAX-${p.model.replace(/\s+/g, '-').toUpperCase()}`,
    name_he: p.name_he,
    name_en: p.name_en,
    manufacturer: MANUFACTURER,
    model: p.model,
    category: data.categories[p.cat],
    description_he: buildDescription(p),
    description_en: null,
    price: null,
    currency: 'ILS',
    is_active: p.active !== false,
    sort_order: p.sort,
    updated_at: new Date().toISOString(),
  };
  if (image_url) row.image_url = image_url;
  rows.push(row);
}

console.log(`\n${rows.length} rows prepared`);
if (DRY_RUN) { console.log(JSON.stringify(rows.slice(0, 2), null, 1)); process.exit(0); }

const { data: up, error } = await sb.from('catalog_products').upsert(rows, { onConflict: 'konimbo_id' }).select('id, item_number, name_he');
if (error) { console.error('❌ upsert failed:', error.message); process.exit(1); }
console.log(`✅ upserted ${up.length} catalog_products rows`);
up.forEach(r => console.log(`   ${r.item_number}  ${r.name_he}`));
