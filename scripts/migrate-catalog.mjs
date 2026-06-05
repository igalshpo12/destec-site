/**
 * Catalog migration script — matches Excel items against Supabase DB,
 * enriches with descriptions and images, and activates them.
 *
 * Usage:
 *   node scripts/migrate-catalog.mjs [--dry-run]
 *
 * Inputs required in data/:
 *   data/items-list.xlsx      — DES_Products_Filtered_HebrewOnly.xlsx
 *   data/konimbo-export.csv   — exported from Konimbo admin (Products → Export)
 *
 * Outputs written to data/:
 *   data/matched.csv          — items matched & updated
 *   data/missing-from-db.csv  — in Excel but not found in Supabase
 *   data/missing-images.csv   — matched but no image in Konimbo export
 */

import { readFileSync, writeFileSync, mkdirSync, createWriteStream } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import XLSX from 'xlsx';
import { parse as csvParse } from 'csv-parse/sync';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_DIR = join(ROOT, 'data');
const DRY_RUN = process.argv.includes('--dry-run');

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

// Load env vars from .env.local
const envPath = join(ROOT, '.env.local');
const envVars = {};
try {
  readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [k, ...vs] = line.split('=');
    if (k && !k.startsWith('#')) envVars[k.trim()] = vs.join('=').trim();
  });
} catch {
  console.error('Could not read .env.local — make sure it exists');
  process.exit(1);
}

const SUPABASE_URL = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const SUPABASE_KEY = envVars['SUPABASE_SERVICE_ROLE_KEY'] || envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Normalize Hebrew string for fuzzy matching: trim, collapse spaces, lowercase */
const normalize = s => (s || '').trim().replace(/\s+/g, ' ').toLowerCase();

/** Strip Konimbo HTML artifacts from description text */
const cleanDesc = s => {
  if (!s) return null;
  const cleaned = s
    .replace(/<\s*>/g, '')     // remove < > tags
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s{2,}/g, ' ')
    .trim();
  return cleaned || null;
};

/** Write a CSV file from array of objects */
const writeCsv = (path, rows) => {
  if (rows.length === 0) {
    writeFileSync(path, '(empty)\n', 'utf8');
    return;
  }
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(','),
    ...rows.map(r => headers.map(h => `"${String(r[h] || '').replace(/"/g, '""')}"`).join(','))
  ];
  writeFileSync(path, lines.join('\n') + '\n', 'utf8');
};

/** Download a file from a URL and save to destPath. Returns true on success. */
const downloadFile = async (url, destPath) => {
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(destPath, buf);
    return true;
  } catch {
    return false;
  }
};

// ---------------------------------------------------------------------------
// Step 1: Parse Excel
// ---------------------------------------------------------------------------

console.log('\n📂 Reading Excel file...');
const excelPath = join(DATA_DIR, 'items-list.xlsx');
const wb = XLSX.readFile(excelPath);
const ws = wb.Sheets[wb.SheetNames[0]];
const rawRows = XLSX.utils.sheet_to_json(ws, { header: 1 });

// Row 0 = headers, Row 1 = often empty, Row 2+ = data
const excelProducts = rawRows
  .slice(1)
  .filter(r => r[0] != null)
  .map(r => ({
    name: String(r[0] || '').trim(),
    description_raw: r[1] != null ? String(r[1]) : null,
    price: r[2] != null ? Number(r[2]) : null,
    sku: r[3] != null ? String(r[3]).trim() : null,
    parent_category: r[4] != null ? String(r[4]).trim() : null,
    sub_category: r[5] != null ? String(r[5]).trim() : null,
  }));

// Deduplicate by name
const seen = new Set();
const excelDeduped = excelProducts.filter(p => {
  if (seen.has(p.name)) return false;
  seen.add(p.name);
  return true;
});

console.log(`   Found ${excelProducts.length} rows, ${excelDeduped.length} unique product names`);

// Separate drills (name = item_number) from others (match by name_he)
const drills = excelDeduped.filter(p => p.parent_category === 'מקדחים');
const others = excelDeduped.filter(p => p.parent_category !== 'מקדחים');
console.log(`   Drills (item_number match): ${drills.length}`);
console.log(`   Other items (name_he match): ${others.length}`);

// ---------------------------------------------------------------------------
// Step 2: Parse Konimbo export (optional — skip if file not present)
// ---------------------------------------------------------------------------

let konimboMap = new Map(); // name → { imageUrl, description }
const konimboPath = join(DATA_DIR, 'konimbo-export.csv');
try {
  console.log('\n📂 Reading Konimbo export...');
  const csvRaw = readFileSync(konimboPath, 'utf8');
  const konimboRows = csvParse(csvRaw, { columns: true, skip_empty_lines: true });
  console.log(`   Found ${konimboRows.length} rows in Konimbo export`);

  // Try to detect the relevant columns (Konimbo exports vary by store config)
  const sample = konimboRows[0] || {};
  const cols = Object.keys(sample);
  console.log(`   Columns: ${cols.join(', ')}`);

  // Common Konimbo column names (Hebrew and English variants)
  const nameCol = cols.find(c => /שם|name/i.test(c) && !/brand|manufacturer/i.test(c));
  const imageCol = cols.find(c => /תמונ|image|img|photo/i.test(c));
  const descCol = cols.find(c => /תיאור|description|desc/i.test(c));
  const skuCol = cols.find(c => /מק"ט|מק״ט|sku|code|catalog/i.test(c));

  console.log(`   Name col: ${nameCol}, Image col: ${imageCol}, Desc col: ${descCol}, SKU col: ${skuCol}`);

  for (const row of konimboRows) {
    const name = nameCol ? normalize(row[nameCol]) : null;
    const sku = skuCol ? String(row[skuCol] || '').trim() : null;
    const entry = {
      imageUrl: imageCol ? (row[imageCol] || '').trim() || null : null,
      description: descCol ? cleanDesc(row[descCol]) : null,
    };
    if (name) konimboMap.set(name, entry);
    if (sku) konimboMap.set(sku.toLowerCase(), entry);
  }
  console.log(`   Built Konimbo lookup map with ${konimboMap.size} entries`);
} catch (e) {
  if (e.code === 'ENOENT') {
    console.log('\n⚠️  data/konimbo-export.csv not found — skipping image import');
    console.log('   Export from Konimbo admin and save as data/konimbo-export.csv to include images');
  } else {
    console.error('Error reading Konimbo export:', e.message);
  }
}

// ---------------------------------------------------------------------------
// Step 3: Fetch all equipment from Supabase
// ---------------------------------------------------------------------------

console.log('\n🔌 Fetching equipment from Supabase (paginated)...');
const allEquipment = [];
const PAGE_SIZE = 1000;
let page = 0;
while (true) {
  const { data, error } = await supabase
    .from('equipment')
    .select('id, item_number, name_he, is_active, description_he, image_url')
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

  if (error) {
    console.error('Supabase fetch error:', error.message);
    process.exit(1);
  }
  if (!data || data.length === 0) break;
  allEquipment.push(...data);
  if (data.length < PAGE_SIZE) break;
  page++;
  process.stdout.write(`   Fetched ${allEquipment.length} rows...\r`);
}

console.log(`   Loaded ${allEquipment.length} equipment rows`);

// Build lookup maps
const dbByItemNumber = new Map(); // item_number (exact) → row
const dbByItemNumberBase = new Map(); // item_number without suffix → row (for fuzzy drill matching)
const dbByNameHe = new Map();     // normalized name_he → row

/** Normalize item number for matching:
 *  - remove spaces around dashes: "197 - 025" → "197-025"
 *  - remove spaces before trailing letters: "112-014 C" → "112-014C"
 *  - strip leading zeros from purely-numeric FG.TC/RA.TC suffix: "FG.TC000004" → "FG.TC4"
 */
const normalizeItemNum = s => {
  let n = s.trim()
    .replace(/\([^)]*\)/g, '')              // strip parentheticals: "(Short)", "(FO)"
    .replace(/\s*-\s*/g, '-')               // spaces around dashes → just dash
    .replace(/\s+([A-Za-z]+)$/, '$1')       // space before trailing suffix
    .replace(/\s+/g, '-')                   // remaining internal spaces → dash (e.g. "R04 327-514-220")
    .replace(/-+/g, '-')                    // collapse multiple dashes
    .trim().replace(/^-|-$/g, '');          // trim leading/trailing dashes

  // FG.TC / HP.TC / RA.TC: strip leading zeros from a purely-numeric suffix
  const prefixMatch = n.match(/^((?:FG|HP|RA)\.TC)(\d+)$/i);
  if (prefixMatch && /^\d+$/.test(prefixMatch[2])) {
    n = prefixMatch[1] + String(parseInt(prefixMatch[2], 10));
  }
  return n.toLowerCase();
};

// Strip trailing letter suffixes like C, M, XC, XM, F, etc. from item numbers
const stripItemSuffix = s => s.replace(/[A-Z]+$/i, '').trim();

for (const row of allEquipment) {
  if (row.item_number) {
    const num = normalizeItemNum(row.item_number);
    dbByItemNumber.set(num, row);
    // Also index by base number (without suffix) for fuzzy drill matching
    const base = stripItemSuffix(num);
    if (base !== num && !dbByItemNumberBase.has(base)) {
      dbByItemNumberBase.set(base, row);
    }
  }
  if (row.name_he) dbByNameHe.set(normalize(row.name_he), row);
}

// ---------------------------------------------------------------------------
// Step 3b: Load manual mappings (excel_name → [db_item_number, ...])
// ---------------------------------------------------------------------------

const manualMap = new Map(); // normalized excel name → [db_item_numbers]
const manualMapPath = join(DATA_DIR, 'manual-mapping.csv');
try {
  const rawMM = readFileSync(manualMapPath, 'utf8');
  const mmRows = csvParse(rawMM, {
    columns: true,
    skip_empty_lines: true,
    comment: '#',
  });
  for (const row of mmRows) {
    const key = normalize(row['excel_name'] || '');
    const dbNum = (row['db_item_number'] || '').trim();
    if (!key || !dbNum) continue;
    if (!manualMap.has(key)) manualMap.set(key, []);
    // Normalize the DB item number the same way the DB index is keyed
    manualMap.get(key).push(normalizeItemNum(dbNum));
  }
  console.log(`   Loaded ${mmRows.length} manual mappings for ${manualMap.size} distinct Excel names`);
} catch (e) {
  if (e.code !== 'ENOENT') console.warn('   Warning reading manual-mapping.csv:', e.message);
}

// ---------------------------------------------------------------------------
// Step 4: Match and enrich
// ---------------------------------------------------------------------------

console.log('\n🔍 Matching Excel items against DB...');

const matched = [];
const missingFromDb = [];
const missingImages = [];

const processItem = (excelItem, matchByItemNumber) => {
  const key = matchByItemNumber
    ? normalizeItemNum(excelItem.name)
    : normalize(excelItem.name);
  const nameKey = normalize(excelItem.name);

  // --- Auto-match ---
  let dbRows = [];
  if (matchByItemNumber) {
    let dbRow = dbByItemNumber.get(key);
    if (!dbRow) {
      const keyBase = stripItemSuffix(key);
      dbRow = dbByItemNumber.get(keyBase) || dbByItemNumberBase.get(keyBase);
    }
    if (!dbRow) dbRow = dbByItemNumberBase.get(key);
    if (dbRow) dbRows = [dbRow];
  } else {
    const dbRow = dbByNameHe.get(key);
    if (dbRow) dbRows = [dbRow];
  }

  // --- Manual mapping fallback ---
  if (dbRows.length === 0 && manualMap.has(nameKey)) {
    for (const itemNum of manualMap.get(nameKey)) {
      const dbRow = dbByItemNumber.get(itemNum);
      if (dbRow) dbRows.push(dbRow);
    }
  }

  if (dbRows.length === 0) {
    missingFromDb.push({
      name: excelItem.name,
      parent_category: excelItem.parent_category,
      match_strategy: matchByItemNumber ? 'item_number' : 'name_he',
    });
    return;
  }

  const description = cleanDesc(excelItem.description_raw);

  for (const dbRow of dbRows) {
    const rowKey = normalize(dbRow.name_he);
    const konimboEntry = konimboMap.get(nameKey) || konimboMap.get(rowKey) || null;
    const imageUrl = konimboEntry?.imageUrl || null;

    if (!imageUrl) {
      missingImages.push({
        item_number: dbRow.item_number,
        name_he: dbRow.name_he,
        excel_name: excelItem.name,
      });
    }

    matched.push({
      id: dbRow.id,
      item_number: dbRow.item_number,
      name_he: dbRow.name_he,
      excel_name: excelItem.name,
      description_he: description || konimboEntry?.description || null,
      image_url: imageUrl,
      was_active: dbRow.is_active,
    });
  }
};

for (const item of drills) processItem(item, true);
for (const item of others) processItem(item, false);

console.log(`   ✅ Matched: ${matched.length}`);
console.log(`   ❌ Missing from DB: ${missingFromDb.length}`);
console.log(`   🖼️  Missing images: ${missingImages.length}`);

// ---------------------------------------------------------------------------
// Step 5: Write report CSVs
// ---------------------------------------------------------------------------

mkdirSync(DATA_DIR, { recursive: true });
writeCsv(join(DATA_DIR, 'matched.csv'), matched.map(m => ({ ...m, description_he: (m.description_he || '').slice(0, 80) })));
writeCsv(join(DATA_DIR, 'missing-from-db.csv'), missingFromDb);
writeCsv(join(DATA_DIR, 'missing-images.csv'), missingImages);

console.log('\n📄 Reports written to data/');

// ---------------------------------------------------------------------------
// Step 6: Apply updates to Supabase
// ---------------------------------------------------------------------------

if (DRY_RUN) {
  console.log('\n🔵 DRY RUN — no changes written to database');
  console.log(`   Would deactivate all 9691 items, then activate ${matched.length} matched items`);
  console.log(`   ${missingFromDb.length} items from Excel not found in DB — see data/missing-from-db.csv`);
  console.log('   Run without --dry-run to apply changes (requires SUPABASE_SERVICE_ROLE_KEY in .env.local)');
  process.exit(0);
}

console.log('\n💾 Writing updates to Supabase...');

// Step 1: Deactivate ALL items first (we only want the Excel list visible)
console.log('   Deactivating all items...');
const { error: deactivateErr } = await supabase
  .from('equipment')
  .update({ is_active: false })
  .neq('id', '00000000-0000-0000-0000-000000000000'); // neq always-true trick for bulk update

if (deactivateErr) {
  console.error('   Failed to deactivate all items:', deactivateErr.message);
  console.error('   You may need to use SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}
console.log(`   ✅ All items deactivated`);

// Step 2: Activate matched items + update descriptions/images
console.log(`   Activating ${matched.length} matched items...`);
let successCount = 0;
let errorCount = 0;

for (const item of matched) {
  const update = {
    is_active: true,
  };

  if (item.description_he) update.description_he = item.description_he;
  if (item.image_url) update.image_url = item.image_url;

  const { error } = await supabase
    .from('equipment')
    .update(update)
    .eq('id', item.id);

  if (error) {
    console.error(`   Error updating ${item.item_number}: ${error.message}`);
    errorCount++;
  } else {
    successCount++;
  }

  // Small delay to avoid rate limiting
  if (successCount % 50 === 0) {
    process.stdout.write(`   ${successCount}/${matched.length}...\r`);
  }
}

console.log(`\n✅ Done! Updated ${successCount} items, ${errorCount} errors`);
console.log(`   ${missingFromDb.length} items from Excel not found in DB — see data/missing-from-db.csv`);
console.log(`   ${missingImages.length} items activated without images — see data/missing-images.csv`);
console.log('\n🔜 Next step: set CATALOG_LIVE = true in src/lib/utils.ts when ready to go live');
