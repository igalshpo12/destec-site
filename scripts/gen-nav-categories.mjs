/**
 * Regenerate NAV_CATEGORIES + HIDDEN_CATEGORIES in src/lib/utils.ts from the
 * live catalog_products categories (Hebrew Konimbo categories), grouping the
 * 50 raw categories into the public nav menu via keyword rules. Byte-exact
 * category strings come straight from the DB.
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const env = {};
readFileSync(join(ROOT, '.env.local'), 'utf8').split('\n').forEach(l => {
  const [k, ...v] = l.split('='); if (k && !k.startsWith('#')) env[k.trim()] = v.join('=').trim();
});
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const { data } = await sb.from('catalog_products').select('category').eq('is_active', true);
const cats = [...new Set(data.map(r => r.category).filter(Boolean))];

// Ordered groups (first matching rule wins). slug = URL, label = Hebrew nav text.
const GROUPS = [
  { slug: '__hidden', label: '', test: c => /מאמר/.test(c) },
  { slug: 'connectors',    label: 'חיבורים ומתאמים',            test: c => /חיבור/.test(c) },
  { slug: 'motors',        label: 'מנועים',                     test: c => /מנוע|מיקרומוטור/.test(c) },
  { slug: 'drills',        label: 'מקדחים',                     test: c => /מקדח/.test(c) },
  { slug: 'polishing',     label: 'ליטוש וגימור',               test: c => /דיסק|גומיות|סטריפ|פרופיג/.test(c) },
  { slug: 'handpieces',    label: 'טורבינות, זוויתנים וידיתנים', test: c => /טורבינ|זוויתנ|ידיתנ/.test(c) },
  { slug: 'sterilization', label: 'סטריליזציה ותחזוקה',         test: c => /אוטוקלאב|אמבטית|Cleaner|Safe|שמן|שימון|סקיילר/i.test(c) },
  { slug: 'surgery',       label: 'כירורגיה והשתלות',           test: c => /כירורג|אלקטרו|פיאזו|השתל|שאיבה|דיספנסר|אספירציה|מברג|מפתח/.test(c) },
  { slug: 'general',       label: 'ערכות וכללי',                test: () => true },
];

const buckets = Object.fromEntries(GROUPS.map(g => [g.slug, []]));
for (const c of cats) buckets[GROUPS.find(g => g.test(c)).slug].push(c);

// Display order for the nav menu (independent of the matching precedence above).
const DISPLAY = ['drills', 'polishing', 'handpieces', 'surgery', 'motors', 'sterilization', 'connectors', 'general'];
const q = s => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const navGroups = DISPLAY.map(slug => GROUPS.find(g => g.slug === slug))
  .filter(g => g && buckets[g.slug].length);
const navBlock = 'export const NAV_CATEGORIES = [\n' + navGroups.map(g =>
  `  {\n    slug: '${g.slug}',\n    label: '${g.label}',\n    dbCategories: [${buckets[g.slug].map(q).join(', ')}],\n  },`
).join('\n') + '\n];';
const hiddenBlock = `export const HIDDEN_CATEGORIES = [${buckets.__hidden.map(q).join(', ')}];`;

let src = readFileSync(join(ROOT, 'src/lib/utils.ts'), 'utf8');
src = src.replace(/export const NAV_CATEGORIES = \[[\s\S]*?\n\];/, navBlock);
src = src.replace(/export const HIDDEN_CATEGORIES = \[[\s\S]*?\];/, hiddenBlock);
writeFileSync(join(ROOT, 'src/lib/utils.ts'), src);

console.log('Updated NAV_CATEGORIES + HIDDEN_CATEGORIES:');
for (const g of navGroups) console.log(`  ${g.label} (${g.slug}): ${buckets[g.slug].length} categories`);
console.log(`  [hidden]: ${buckets.__hidden.length} — ${buckets.__hidden.join(', ')}`);
const total = navGroups.reduce((n, g) => n + buckets[g.slug].length, 0) + buckets.__hidden.length;
console.log(`  total categories mapped: ${total}/${cats.length}`);
