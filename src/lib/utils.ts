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
