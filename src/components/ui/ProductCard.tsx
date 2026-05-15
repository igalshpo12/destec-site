'use client';
import Link from 'next/link';
import { ShoppingCart, Tag, Building2 } from 'lucide-react';
import { EquipmentWithPrice } from '@/lib/supabase';
import { formatPrice, CATEGORY_LABELS } from '@/lib/utils';

const MANUFACTURER_COLORS: Record<string, { bg: string; text: string }> = {
  NSK: { bg: 'bg-red-100', text: 'text-red-700' },
  'W&H': { bg: 'bg-blue-100', text: 'text-blue-700' },
  KaVo: { bg: 'bg-orange-100', text: 'text-orange-700' },
  'MK-dent': { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  Nouvag: { bg: 'bg-green-100', text: 'text-green-700' },
  'Bien-Air': { bg: 'bg-sky-100', text: 'text-sky-700' },
  Anthogyr: { bg: 'bg-purple-100', text: 'text-purple-700' },
  'Dentsply Sirona': { bg: 'bg-teal-100', text: 'text-teal-700' },
  JINME: { bg: 'bg-pink-100', text: 'text-pink-700' },
};

interface Props {
  item: EquipmentWithPrice;
  showSaleBadge?: boolean;
}

export default function ProductCard({ item, showSaleBadge = false }: Props) {
  const mfr = item.manufacturer || '';
  const mfrColors = MANUFACTURER_COLORS[mfr] || { bg: 'bg-gray-100', text: 'text-gray-700' };
  const categoryLabel = item.category ? (CATEGORY_LABELS[item.category] || item.category) : null;

  return (
    <article
      dir="rtl"
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col overflow-hidden group"
    >
      {/* Image placeholder */}
      <div className="relative overflow-hidden aspect-[4/3] bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 group-hover:from-blue-50/50 group-hover:to-slate-100 transition-colors duration-300">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center">
            <svg className="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.75H6A2.25 2.25 0 0 0 3.75 6v3.75M9.75 20.25H6A2.25 2.25 0 0 1 3.75 18v-3.75M20.25 9.75V6A2.25 2.25 0 0 0 18 3.75h-3.75M20.25 14.25V18A2.25 2.25 0 0 1 18 20.25h-3.75" />
            </svg>
          </div>
        </div>
        {/* Manufacturer badge top-right */}
        {mfr && (
          <span
            className={`absolute top-2.5 right-2.5 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${mfrColors.bg} ${mfrColors.text}`}
          >
            {mfr}
          </span>
        )}
        {/* Sale badge top-left */}
        {showSaleBadge && (
          <span className="absolute top-2.5 left-2.5 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm bg-amber-100 text-amber-700">
            {'מחיר מיוחד'}
          </span>
        )}
        {categoryLabel && (
          <span className="absolute bottom-2.5 right-2.5 text-xs text-gray-500 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full border border-gray-100">
            {categoryLabel}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Item number */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Tag className="w-3 h-3" />
          <span dir="ltr" className="font-mono">{item.item_number}</span>
        </div>

        {/* Name */}
        <h3 className="text-gray-800 font-semibold text-sm leading-snug line-clamp-2 flex-1">
          {item.name_he}
        </h3>

        {/* Model */}
        {item.model && (
          <p className="text-gray-400 text-xs" dir="ltr">{item.model}</p>
        )}

        {/* Manufacturer credit */}
        {mfr && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Building2 className="w-3 h-3 flex-shrink-0" />
            <span>יוצר: {mfr} · מופץ ע&quot;י DES</span>
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-auto">
          {item.price ? (
            <span className="text-[#1a2b4a] font-bold text-base">
              {formatPrice(item.price, item.currency || 'ILS')}
            </span>
          ) : (
            <span className="text-gray-400 text-sm">לפרטי מחיר</span>
          )}
          <Link
            href={`/catalog/${item.id}`}
            className="flex items-center gap-1.5 bg-[#1e90ff] hover:bg-[#0d7fe0] text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>פרטים</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
