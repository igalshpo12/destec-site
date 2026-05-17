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
    slug: 'handpieces',
    label: 'טורבינות זוויתנים וידיתנים',
    dbCategories: ['turbines', 'angles', 'handpieces'],
  },
  {
    slug: 'surgery',
    label: 'כירורגיה והשתלות',
    dbCategories: ['surgery', 'electrosurgery'],
  },
  {
    slug: 'sterilization',
    label: 'סטריליזציה ותחזוקה',
    dbCategories: ['sterilization'],
  },
  {
    slug: 'restorative',
    label: 'שיקום הפה',
    dbCategories: ['restorative'],
  },
  {
    slug: 'prophylaxis',
    label: 'פרופילקטיקה',
    dbCategories: ['prophylaxis', 'scalers'],
  },
  {
    slug: 'motors',
    label: 'מנועים',
    dbCategories: ['motors'],
  },
  {
    slug: 'drills',
    label: 'מקדחים',
    dbCategories: ['drills'],
  },
];

// Set to true to show catalog items publicly
export const CATALOG_LIVE = false;

// Categories never shown on the public catalog
// spare_parts / consumables / services are internal repair/service items
// not purchased directly by clinics or healthcare centers
export const HIDDEN_CATEGORIES = ['services', 'spare_parts', 'consumables'];

export const SUPPLIERS = [
  'NSK', 'W&H', 'KaVo', 'MK-dent', 'Nouvag', 'Bien-Air', 'Anthogyr', 'Dentsply Sirona', 'JINME', 'MDT', 'CHIRMED',
];
