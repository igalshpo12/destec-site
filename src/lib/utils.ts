import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns a short display name for a product item.
 * Prefers name_he, falls back to name_en.
 * Splits at the first occurrence of " - ", " / ", ",", or " – " and takes the part before.
 * Trims whitespace. Caps at 40 characters with "…" if truncated.
 */
export function shortName(item: { name_he?: string | null; name_en?: string | null }): string {
  const raw = (item.name_he?.trim()) ? item.name_he.trim() : (item.name_en?.trim() ?? '');
  const delimiterRe = / - | \/ |,| – /;
  const match = delimiterRe.exec(raw);
  const part = match ? raw.slice(0, match.index).trim() : raw.trim();
  if (part.length > 40) return part.slice(0, 40) + '…';
  return part;
}

export function formatPrice(price: number, currency = 'ILS'): string {
  if (currency === 'ILS') {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

export const CATEGORY_LABELS: Record<string, string> = {
  turbines: 'טורבינות',
  angles: 'זוויתנים',
  handpieces: 'ידיתנים',
  drills: 'מקדחים',
  motors: 'מנועים',
  sterilization: 'סטריליזציה',
  prophylaxis: 'פרופילקטיקה',
  restorative: 'שיקום',
  scalers: 'סקילרים',
  surgery: 'כירורגיה',
  electrosurgery: 'אלקטרוכירורגיה',
  spare_parts: 'חלקי חילוף',
  consumables: 'מתרפים',
};

export const NAV_CATEGORIES = [
  {
    slug: 'drills',
    label: 'מקדחים',
    dbCategories: ['מקדחי יהלום', 'מקדחי טונגסטן קרבייד', 'מקדחים לידיתן (HP)', 'מקדחים לזרקוניה', 'מקדחים לזוויתן (RA)', 'מקדחי הליקס'],
  },
  {
    slug: 'polishing',
    label: 'ליטוש וגימור',
    dbCategories: ['דיסקים וסטריפים', 'גומיות ליטוש', 'פרופיג\'ט - MK-DENT'],
  },
  {
    slug: 'handpieces',
    label: 'טורבינות, זוויתנים וידיתנים',
    dbCategories: ['ידיתנים 1:1', 'טורבינות Jinme', 'ידיתנים כירורגיים', 'זוויתנים 1:5 (מגבירי מהירות)', 'טורבינות MK-DENT', 'זוויתנים 1:1', 'זוויתנים 20:1 (השתלות)', 'זוויתני השתלות'],
  },
  {
    slug: 'surgery',
    label: 'כירורגיה והשתלות',
    dbCategories: ['מערכות שאיבה והזרקה', 'מזרקי אספירציה', 'מברגת טורק חשמלית', 'אלקטרוכירורגיה', 'צינורות לפיזיאודיספנסר', 'פיזיודיספנסרים', 'פיאזוסארג\'רי', 'עגלות כירורגיות', 'מפתחות הברגה', 'טיפים לפיאזוסארג\'רי', 'מברגת מומנט חשמלית'],
  },
  {
    slug: 'motors',
    label: 'מנועים',
    dbCategories: ['מנועים של חברת Jinme', 'מיקרומוטורים של חברת Jinme', 'מנועים של חברת MK-DENT', 'מנועים טכניים', 'מערכות שליטה ומנועים כירורגיים'],
  },
  {
    slug: 'sterilization',
    label: 'סטריליזציה ותחזוקה',
    dbCategories: ['שמן פרימיום סינטטלי מלא', 'Exo-Safe', 'פיות שימון מכל הסוגים', 'Safe-Relax', 'מפתח טורק לסקיילר', 'אמבטית(YESON) 2.5 ליטר', 'אוטוקלאב (YESON)3 ליטר', 'Smart Cleaner', 'Osteo Safe'],
  },
  {
    slug: 'connectors',
    label: 'חיבורים ומתאמים',
    dbCategories: ['חיבור EMS', 'חיבור SATALEC', 'חיבור Kavo', 'חיבור NSK', 'חיבור W&H'],
  },
  {
    slug: 'clinic',
    label: 'יחידות טיפול',
    dbCategories: ['יחידות טיפול דנטליות', 'מדחסי אוויר', 'מערכות ואקום מרכזיות', 'דימות ורנטגן'],
  },
  {
    slug: 'general',
    label: 'ערכות וכללי',
    dbCategories: ['ערכות', 'מכשירי רפואה כללית'],
  },
];

// Set to true to show catalog items publicly
export const CATALOG_LIVE = true;

// Categories never shown on the public catalog
// spare_parts / consumables / services are internal repair/service items
// not purchased directly by clinics or healthcare centers
export const HIDDEN_CATEGORIES = ['מאמרים | DES'];

export const SUPPLIERS = [
  'NSK', 'W&H', 'KaVo', 'MK-dent', 'Nouvag', 'Bien-Air', 'Anthogyr', 'Dentsply Sirona', 'JINME', 'MDT', 'CHIRMED',
];

// Manufacturers as they actually appear in catalog_products.manufacturer —
// the filter matches with eq(), so `value` must be the exact DB string.
export const CATALOG_MANUFACTURERS: { value: string; label: string }[] = [
  { value: 'AJAX', label: 'AJAX Dental' },
  { value: 'MDT', label: 'MDT' },
  { value: 'JINME', label: 'Jinme' },
  { value: 'NOUVAG', label: 'Nouvag' },
  { value: 'MK-DENT', label: 'MK-dent' },
  { value: 'SPA LED', label: 'SPA LED' },
  { value: 'ANTOGYR', label: 'Anthogyr' },
  { value: 'SAESHIN', label: 'Saeshin' },
  { value: 'ATITAN', label: 'ATitan' },
  { value: 'MicroNX', label: 'MicroNX' },
];

/**
 * Homepage "מומלצים" showcase — curated by Igal (2026-10-27), shown in this order.
 * catalog_products.id values; rows without an item_number are referenced by id only.
 */
export const FEATURED_PRODUCT_IDS: string[] = [
  '6bb09f83-232a-46ce-86a6-d3edede337d6', // AJAX AJ15 dental unit
  'a8d32c03-6f00-4e7d-84af-bc0da90e5843', // AJAX AJ25 dental unit
  '0c2e6321-8e31-4ae7-9ea9-97ce40f30255', // Jinme J6 fiber-optic turbine
  '2ba3cf5e-e0ad-4324-b4a2-f6240b80412d', // Jinme CA201L implant contra-angle 20:1
  '5b7ba80e-db7c-49b8-a65f-8172ed52198e', // Jinme CA15L speed-increasing 1:5
  '3bcf34a6-8915-4da1-81dd-9c6f240a700f', // Jinme CA11L fiber-optic 1:1
  'cac6c22e-e93d-4f62-a78c-3fea4b2a27d4', // NOUVAG TCM 3000 BL
  '6093f561-df67-4605-942c-2c82c785a93b', // NOUVAG HighSurg 30
  '96e40e37-1593-469e-9836-e371dd992a9f', // NOUVAG Vacuson 60
  '83279a6a-b20d-4ad8-8746-acae0f5792cb', // NOUVAG surgical handpiece NO-1710
  'd92644b3-3d7c-40eb-9f75-cc9c679f9691', // MK-DENT Service Oil
  '2baf4a00-9163-453e-9ba8-f6ed3327fb86', // MicroNX automatic torque driver
];
