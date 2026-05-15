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
};

export const SUPPLIERS = [
  'NSK', 'W&H', 'KaVo', 'MK-dent', 'Nouvag', 'Bien-Air', 'Anthogyr', 'Dentsply Sirona', 'JINME',
];
