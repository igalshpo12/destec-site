import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
    dbCategories: ['sterilization', 'spare_parts', 'consumables'],
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

export const HIDDEN_CATEGORIES = ['services'];

export const SUPPLIERS = [
  'NSK', 'W&H', 'KaVo', 'MK-dent', 'Nouvag', 'Bien-Air', 'Anthogyr', 'Dentsply Sirona', 'JINME',
];
