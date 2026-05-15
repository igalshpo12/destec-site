import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Equipment = {
  id: string;
  item_number: string;
  name_he: string;
  name_en: string | null;
  manufacturer: string | null;
  model: string | null;
  category: string | null;
  description_he: string | null;
  description_en: string | null;
  warranty_purchase_months: number | null;
  warranty_repair_months: number | null;
  warranty_manufacturer_months: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type EquipmentPrice = {
  id: string;
  equipment_id: string;
  tier: number;
  price: number;
  currency: string;
  updated_at: string;
};

export type EquipmentWithPrice = Equipment & {
  price?: number;
  currency?: string;
};

// Infer category from name when DB column is null
export function inferCategory(item: Equipment): string | null {
  const he = (item.name_he || '').toLowerCase();
  const en = (item.name_en || '').toLowerCase();
  const num = (item.item_number || '').toLowerCase();
  const all = `${he} ${en} ${num}`;

  if (all.includes('טורבינ') || all.includes('turbine')) return 'turbines';
  if (all.includes('זוויתנ') || all.includes('angle')) return 'angles';
  if (all.includes('ידיתנ') || all.includes('handpiece')) return 'handpieces';
  if (all.includes('מקדח') || all.includes('drill')) return 'drills';
  if (all.includes('מנוע') || all.includes('motor') || all.includes('implant')) return 'motors';
  if (all.includes('סטריל') || all.includes('steriliz') || all.includes('autoclave')) return 'sterilization';
  if (all.includes('פרופי') || all.includes('prophy')) return 'prophylaxis';
  if (all.includes('שיקום') || all.includes('restor') || all.includes('composite')) return 'restorative';
  if (all.includes('סקילר') || all.includes('scaler') || all.includes('ultrasonic')) return 'scalers';
  if (all.includes('כירורג') || all.includes('surgical')) return 'surgery';
  return null;
}
