'use client';
import Link from 'next/link';
import { EquipmentWithPrice } from '@/lib/supabase';
import { formatPrice, CATEGORY_LABELS } from '@/lib/utils';

/* Brand → accent color map */
const BRAND_COLORS: Record<string, { accent: string; bg: string; letter: string }> = {
  NSK:               { accent: '#c0392b', bg: 'rgba(192,57,43,0.08)',   letter: 'N' },
  'W&H':             { accent: '#1e3a6e', bg: 'rgba(30,58,110,0.08)',   letter: 'W' },
  KaVo:              { accent: '#005baa', bg: 'rgba(0,91,170,0.08)',    letter: 'K' },
  'MK-dent':         { accent: '#d35400', bg: 'rgba(211,84,0,0.08)',    letter: 'M' },
  Nouvag:            { accent: '#27ae60', bg: 'rgba(39,174,96,0.08)',   letter: 'N' },
  'Bien-Air':        { accent: '#2c3e50', bg: 'rgba(44,62,80,0.08)',    letter: 'B' },
  Anthogyr:          { accent: '#8e44ad', bg: 'rgba(142,68,173,0.08)', letter: 'A' },
  'Dentsply Sirona': { accent: '#00589b', bg: 'rgba(0,88,155,0.08)',    letter: 'D' },
  JINME:             { accent: '#e74c3c', bg: 'rgba(231,76,60,0.08)',   letter: 'J' },
};

const FALLBACK = { accent: '#1a2b4a', bg: 'rgba(26,43,74,0.08)', letter: '?' };

interface Props {
  item: EquipmentWithPrice;
  showSaleBadge?: boolean;
}

export default function ProductCard({ item, showSaleBadge = false }: Props) {
  const mfr = item.manufacturer || '';
  const brand = BRAND_COLORS[mfr] || FALLBACK;
  const categoryLabel = item.category ? (CATEGORY_LABELS[item.category] || item.category) : null;

  return (
    <article
      dir="rtl"
      className="group bg-white flex flex-col overflow-hidden transition-all duration-250"
      style={{
        borderRight: `2px solid ${brand.accent}`,
        borderTop: '1px solid #f0f2f5',
        borderBottom: '1px solid #f0f2f5',
        borderLeft: '1px solid #f0f2f5',
        borderRadius: '2px 10px 10px 2px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        willChange: 'transform, box-shadow',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(-4px)';
        el.style.boxShadow = `0 12px 32px rgba(0,0,0,0.10), 0 0 0 1px ${brand.accent}30`;
        el.style.borderRightColor = brand.accent;
        el.style.borderRightWidth = '3px';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = '';
        el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
        el.style.borderRightColor = brand.accent;
        el.style.borderRightWidth = '2px';
      }}
    >
      {/* Image area — clean navy gradient with brand initial */}
      <div
        className="relative aspect-[4/3] flex items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, #0d1929 0%, #1a2b4a 100%)` }}
      >
        {/* Subtle pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, ${brand.accent}40 1px, transparent 1px)`,
            backgroundSize: '18px 18px',
          }}
        />
        {/* Brand letter */}
        <div
          className="relative z-10 flex items-center justify-center font-black"
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: `${brand.accent}22`,
            border: `1.5px solid ${brand.accent}50`,
            color: brand.accent,
            fontSize: '1.5rem',
            letterSpacing: '-0.02em',
            opacity: 0.9,
          }}
        >
          {brand.letter}
        </div>

        {/* Manufacturer pill — top right */}
        {mfr && (
          <span
            className="absolute top-2.5 right-2.5 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{
              background: '#0d1929',
              color: brand.accent,
              border: `1px solid ${brand.accent}40`,
              fontSize: '0.65rem',
              letterSpacing: '0.06em',
            }}
          >
            {mfr}
          </span>
        )}

        {/* Sale badge */}
        {showSaleBadge && (
          <span
            className="absolute top-2.5 left-2.5 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{
              background: '#92400e',
              color: '#fde68a',
              fontSize: '0.65rem',
            }}
          >
            מחיר מיוחד
          </span>
        )}

        {/* Category tag — bottom left */}
        {categoryLabel && (
          <span
            className="absolute bottom-2.5 left-2.5 text-xs px-2 py-0.5 rounded"
            style={{
              background: 'rgba(13,25,41,0.75)',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.6rem',
              backdropFilter: 'blur(4px)',
              letterSpacing: '0.05em',
            }}
          >
            {categoryLabel}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        {/* Item number */}
        <span
          className="font-mono text-xs"
          dir="ltr"
          style={{ color: '#9ba3af', letterSpacing: '0.04em' }}
        >
          {item.item_number || '—'}
        </span>

        {/* Product name */}
        <h3
          className="font-bold text-sm leading-snug line-clamp-2 flex-1"
          style={{ color: '#0d1929' }}
        >
          {item.name_he || item.name_en}
        </h3>

        {/* Model */}
        {item.model && (
          <p className="text-xs font-mono" dir="ltr" style={{ color: '#b0b8c4' }}>
            {item.model}
          </p>
        )}

        {/* Manufacturer credit */}
        {mfr && (
          <p className="text-xs" style={{ color: '#9ba3af' }}>
            מיוצר ע&quot;י {mfr} · מופץ ע&quot;י DES
          </p>
        )}

        {/* Price + CTA */}
        <div
          className="flex items-end justify-between pt-3 mt-auto"
          style={{ borderTop: '1px solid #f0f2f5' }}
        >
          <div>
            {item.price ? (
              <>
                <div
                  className="font-black"
                  style={{ color: '#0d1929', fontSize: '1.1rem', lineHeight: 1 }}
                >
                  {formatPrice(item.price, item.currency || 'ILS')}
                </div>
                <div className="text-xs mt-0.5" style={{ color: '#9ba3af' }}>
                  כולל מע&quot;מ
                </div>
              </>
            ) : (
              <span className="text-sm" style={{ color: '#9ba3af' }}>
                לפרטי מחיר
              </span>
            )}
          </div>
          <Link
            href={`/catalog/${item.id}`}
            className="text-xs font-semibold px-4 py-2 rounded-lg transition-colors duration-150"
            style={{
              background: '#0d1929',
              color: '#fff',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = brand.accent;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#0d1929';
            }}
          >
            פרטים
          </Link>
        </div>
      </div>
    </article>
  );
}
