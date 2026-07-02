#!/usr/bin/env node
/**
 * One-shot catalog data quality pass on catalog_products:
 *   1. Decode HTML entities left over from the Konimbo scrape (name + description).
 *   2. Humanize SKU-only titles: "130-012" → "מקדח יהלום MDT 130-012".
 *   3. Set sort_order so products with photos (devices before burs) come first.
 *
 * Backs up all rows to asset-gen/backups/ before writing anything.
 * Re-runnable: decoding and naming are idempotent.
 *
 * Usage: node scripts/fix-catalog-quality.mjs [--dry-run]
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const DRY = process.argv.includes('--dry-run');

const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n').filter((l) => l.includes('='))
    .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()])
);
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

/* ---------- 1. entity decoding ---------- */
const NAMED = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“',
  hellip: '…', deg: '°', times: '×', middot: '·', bull: '•',
  laquo: '«', raquo: '»', shy: '', trade: '™', reg: '®', copy: '©', plusmn: '±',
};
function decodeEntities(s) {
  if (!s) return s;
  let out = s;
  // run twice to handle double-encoding (&amp;#8211;)
  for (let i = 0; i < 2; i++) {
    out = out
      .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
      .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
      .replace(/&([a-z]+);/gi, (m, n) => (NAMED[n.toLowerCase()] ?? m));
  }
  return out.replace(/\s+/g, ' ').trim();
}

/* ---------- 2. humanize SKU titles ---------- */
const SINGULAR = {
  'מקדחי יהלום': 'מקדח יהלום',
  'מקדחי טונגסטן קרבייד': 'מקדח טונגסטן קרבייד',
  'מקדחים לידיתן (HP)': 'מקדח לידיתן (HP)',
  'מקדחים לזרקוניה': 'מקדח לזרקוניה',
  'מקדחים לזוויתן (RA)': 'מקדח לזוויתן (RA)',
  'מקדחי הליקס': 'מקדח הליקס',
  'ערכות': 'ערכה',
  'גומיות ליטוש': 'גומיית ליטוש',
};
const skuLike = (s) => /^[A-Z0-9.\-\/ ]+$/.test((s || '').trim());

function humanTitle(p) {
  const name = (p.name_he || '').trim();
  if (!skuLike(name)) return name;
  const desc = p.description_he || '';
  let prefix = SINGULAR[p.category];
  if (!prefix && p.category === 'דיסקים וסטריפים') {
    prefix = desc.includes('סטריפ') ? 'סטריפ ליטוש' : desc.includes('דיסק') ? 'דיסק ליטוש' : 'דיסק/סטריפ ליטוש';
  }
  // Unmapped category → the SKU-ish name is likely already readable; leave it.
  if (!prefix) return name;
  let mfr = (p.manufacturer || '').trim();
  if (mfr && name.toUpperCase().startsWith(mfr.toUpperCase())) mfr = '';
  return [prefix, mfr, name].filter(Boolean).join(' ');
}

/* ---------- 3. sort_order ---------- */
// lower = earlier. Devices/systems first, then handpieces, then burs, discs last.
const CATEGORY_RANK = [
  // accessories/consumables first in the list so they don't match the device patterns below
  [/טיפים|צינורות|מזרקי|מפתח|פיות שימון|חיבור/i, 4],
  [/מערכות|פיזיודיספנסר|פיאזוסארג|אלקטרוכירורגיה|מברגת|רפואה כללית|אוטוקלאב|אמבטית|Smart Cleaner|עגלות/i, 0],
  [/טורבינות|זוויתנ|ידיתנים|מנועים|מיקרומוטור/i, 1],
  [/סטריל|שמן|Exo-Safe|Safe-Relax|Osteo|פיות שימון|חיבור|מפתח/i, 2],
  [/ערכות|מזרקי|צינורות|טיפים/i, 3],
  [/מקדח/i, 5],
  [/גומיות|פרופיג/i, 6],
  [/דיסקים/i, 7],
];
function rank(p) {
  const hasImg = !!(p.image_url || '').trim();
  let cat = 4;
  for (const [re, r] of CATEGORY_RANK) if (re.test(p.category || '')) { cat = r; break; }
  return (hasImg ? 0 : 100) + cat * 10;
}

/* ---------- run ---------- */
let all = [], from = 0;
while (true) {
  const { data, error } = await sb.from('catalog_products').select('*').range(from, from + 999);
  if (error) { console.error(error); process.exit(1); }
  all.push(...data);
  if (data.length < 1000) break;
  from += 1000;
}
console.log(`Fetched ${all.length} rows.`);

const stamp = new Date().toISOString().slice(0, 10);
mkdirSync(new URL('../asset-gen/backups/', import.meta.url), { recursive: true });
const backupPath = new URL(`../asset-gen/backups/catalog_products-${stamp}.json`, import.meta.url);
writeFileSync(backupPath, JSON.stringify(all, null, 1));
console.log(`Backup written: ${backupPath.pathname}`);

const updates = [];
for (const p of all) {
  const u = {};
  const decodedDesc = decodeEntities(p.description_he);
  const decodedName = decodeEntities(p.name_he);
  if (decodedDesc !== p.description_he) u.description_he = decodedDesc;
  if (decodedName !== p.name_he) u.name_he = decodedName;
  const title = humanTitle({ ...p, name_he: u.name_he ?? p.name_he, description_he: u.description_he ?? p.description_he });
  if (title && title !== (u.name_he ?? p.name_he)) u.name_he = title;
  const so = rank(p);
  if (p.sort_order !== so) u.sort_order = so;
  if (Object.keys(u).length) updates.push({ id: p.id, ...u });
}
console.log(`${updates.length} rows need updates ` +
  `(desc: ${updates.filter((u) => u.description_he).length}, name: ${updates.filter((u) => u.name_he).length}, sort: ${updates.filter((u) => u.sort_order != null).length})`);
console.log('Samples:', JSON.stringify(updates.slice(0, 3), null, 1));

if (DRY) { console.log('Dry run — nothing written.'); process.exit(0); }

let done = 0, failed = 0;
for (let i = 0; i < updates.length; i += 20) {
  const batch = updates.slice(i, i + 20);
  const results = await Promise.all(batch.map(({ id, ...u }) =>
    sb.from('catalog_products').update({ ...u, updated_at: new Date().toISOString() }).eq('id', id)
  ));
  results.forEach((r) => (r.error ? failed++ : done++));
  if ((i / 20) % 5 === 0) process.stdout.write(`\r${done + failed}/${updates.length}`);
}
console.log(`\nUpdated ${done}, failed ${failed}.`);
