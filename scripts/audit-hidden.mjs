import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

// load .env.local
const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const sb = createClient(url, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

// Nav-covered DB categories (mirror of src/lib/utils.ts NAV_CATEGORIES)
const NAV = [
  'מקדחי יהלום','מקדחי טונגסטן קרבייד','מקדחים לידיתן (HP)','מקדחים לזרקוניה','מקדחים לזוויתן (RA)','מקדחי הליקס',
  'דיסקים וסטריפים','גומיות ליטוש',"פרופיג'ט - MK-DENT",
  'ידיתנים 1:1','טורבינות Jinme','ידיתנים כירורגיים','זוויתנים 1:5 (מגבירי מהירות)','טורבינות MK-DENT','זוויתנים 1:1','זוויתנים 20:1 (השתלות)','זוויתני השתלות',
  'מערכות שאיבה והזרקה','מזרקי אספירציה','מברגת טורק חשמלית','אלקטרוכירורגיה','צינורות לפיזיאודיספנסר','פיזיודיספנסרים',"פיאזוסארג'רי",'עגלות כירורגיות','מפתחות הברגה',"טיפים לפיאזוסארג'רי",'מברגת מומנט חשמלית',
  'מנועים של חברת Jinme','מיקרומוטורים של חברת Jinme','מנועים של חברת MK-DENT','מנועים טכניים','מערכות שליטה ומנועים כירורגיים',
  'שמן פרימיום סינטטלי מלא','Exo-Safe','פיות שימון מכל הסוגים','Safe-Relax','מפתח טורק לסקיילר','אמבטית(YESON) 2.5 ליטר','אוטוקלאב (YESON)3 ליטר','Smart Cleaner','Osteo Safe',
  'חיבור EMS','חיבור SATALEC','חיבור Kavo','חיבור NSK','חיבור W&H',
  'ערכות','מכשירי רפואה כללית',
];
const HIDDEN_CATEGORIES = ['מאמרים | DES'];

const { data, error } = await sb.from('catalog_products')
  .select('konimbo_id, name_he, category, is_active, image_url, created_at');
if (error) { console.error(error); process.exit(1); }

const total = data.length;
const inactive = data.filter(r => r.is_active === false);
const active = data.filter(r => r.is_active !== false);

// Group by category
const byCat = {};
for (const r of active) {
  const c = r.category || '(ללא קטגוריה)';
  byCat[c] = (byCat[c] || 0) + 1;
}

const navSet = new Set(NAV);
const hiddenByFilter = Object.entries(byCat).filter(([c]) => HIDDEN_CATEGORIES.includes(c));
const notInNav = Object.entries(byCat).filter(([c]) => !navSet.has(c) && !HIDDEN_CATEGORIES.includes(c) && c !== '(ללא קטגוריה)');
const noCat = byCat['(ללא קטגוריה)'] || 0;

console.log('=== CATALOG AUDIT ===');
console.log('Total rows:', total);
console.log('is_active = false (hidden by flag):', inactive.length);
console.log('is_active = true:', active.length);
console.log('');
console.log('--- Hidden by HIDDEN_CATEGORIES filter (in DB but never shown) ---');
if (hiddenByFilter.length === 0) console.log('(none)');
for (const [c, n] of hiddenByFilter) console.log(`  ${c}: ${n}`);
console.log('');
console.log('--- Active categories NOT in any nav group (reachable only via search/all) ---');
if (notInNav.length === 0) console.log('(none — every category maps to a nav group)');
for (const [c, n] of notInNav.sort((a,b)=>b[1]-a[1])) console.log(`  ${c}: ${n}`);
console.log('');
console.log('--- Active with NO category ---');
console.log('  count:', noCat);
console.log('');
console.log('--- Active with NO image ---');
console.log('  count:', active.filter(r => !r.image_url).length);

if (inactive.length) {
  console.log('');
  console.log('--- Sample of inactive items ---');
  for (const r of inactive.slice(0, 20)) console.log(`  [${r.konimbo_id}] ${r.name_he} — ${r.category}`);
}
