'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { EquipmentWithPrice } from '@/lib/supabase';
import { formatPrice, CATEGORY_LABELS, shortName } from '@/lib/utils';

/* Brand → accent color map */
const BRAND_COLORS: Record<string, { accent: string; letter: string }> = {
  NSK:               { accent: '#c0392b', letter: 'N' },
  'W&H':             { accent: '#1e3a6e', letter: 'W' },
  KaVo:              { accent: '#005baa', letter: 'K' },
  'MK-dent':         { accent: '#d35400', letter: 'M' },
  Nouvag:            { accent: '#27ae60', letter: 'N' },
  'Bien-Air':        { accent: '#2c3e50', letter: 'B' },
  Anthogyr:          { accent: '#8e44ad', letter: 'A' },
  'Dentsply Sirona': { accent: '#00589b', letter: 'D' },
  JINME:             { accent: '#e74c3c', letter: 'J' },
};

const FALLBACK = { accent: '#1a2b4a', letter: '?' };

/** Returns an inline SVG icon for the given category slug */
function getCategoryIcon(category: string): ReactNode {
  const iconProps = {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 64 64',
    fill: 'none',
    stroke: '#1a2b4a',
    strokeWidth: '2.5',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    style: { opacity: 0.4, width: '42%', height: '42%' },
  };

  switch (category) {
    case 'turbines':
      // Turbine / fan blade — circular, 4 blades
      return (
        <svg {...iconProps} viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="5" />
          {/* 4 blade arcs */}
          <path d="M32 27 C28 16, 18 14, 16 20 C14 26, 22 28, 27 29" />
          <path d="M37 32 C48 28, 50 18, 44 16 C38 14, 36 22, 35 27" />
          <path d="M32 37 C36 48, 46 50, 48 44 C50 38, 42 36, 37 35" />
          <path d="M27 32 C16 36, 14 46, 20 48 C26 50, 28 42, 29 37" />
        </svg>
      );

    case 'angles':
      // Contra-angle handpiece — angled tube
      return (
        <svg {...iconProps} viewBox="0 0 64 64">
          <path d="M14 48 L34 28" strokeWidth="5" strokeLinecap="round" />
          <path d="M34 28 L34 16" strokeWidth="5" strokeLinecap="round" />
          <circle cx="34" cy="12" r="4" fill="#1a2b4a" fillOpacity="0.4" stroke="none" />
          <rect x="10" y="44" width="8" height="12" rx="2" transform="rotate(-45 14 50)" />
        </svg>
      );

    case 'handpieces':
      // Straight handpiece silhouette
      return (
        <svg {...iconProps} viewBox="0 0 64 64">
          <rect x="12" y="28" width="40" height="8" rx="4" />
          <circle cx="52" cy="32" r="3" />
          <rect x="14" y="30" width="6" height="4" rx="1" fill="#1a2b4a" fillOpacity="0.4" stroke="none" />
          <rect x="22" y="30" width="4" height="4" rx="1" fill="#1a2b4a" fillOpacity="0.4" stroke="none" />
        </svg>
      );

    case 'drills':
      // Drill bit — pointed spiral
      return (
        <svg {...iconProps} viewBox="0 0 64 64">
          <line x1="32" y1="8" x2="32" y2="52" />
          <path d="M26 52 L32 60 L38 52" />
          {/* Spiral flutes */}
          <path d="M26 16 Q32 20 38 16" />
          <path d="M26 24 Q32 28 38 24" />
          <path d="M26 32 Q32 36 38 32" />
          <path d="M26 40 Q32 44 38 40" />
          <rect x="24" y="8" width="16" height="6" rx="2" />
        </svg>
      );

    case 'motors':
      // Gear / motor icon
      return (
        <svg {...iconProps} viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="9" />
          <circle cx="32" cy="32" r="3" fill="#1a2b4a" fillOpacity="0.4" stroke="none" />
          {/* 8 teeth */}
          {[0,45,90,135,180,225,270,315].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = 32 + 13 * Math.cos(rad);
            const y1 = 32 + 13 * Math.sin(rad);
            const x2 = 32 + 19 * Math.cos(rad);
            const y2 = 32 + 19 * Math.sin(rad);
            return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="3" strokeLinecap="round" />;
          })}
        </svg>
      );

    case 'surgery':
    case 'electrosurgery':
      // Scalpel
      return (
        <svg {...iconProps} viewBox="0 0 64 64">
          <path d="M16 48 L44 20" strokeWidth="3" />
          <path d="M44 20 L50 14 L52 16 L46 22 Z" fill="#1a2b4a" fillOpacity="0.4" />
          <path d="M44 20 L40 28 L46 26 Z" fill="#1a2b4a" fillOpacity="0.35" />
        </svg>
      );

    case 'sterilization':
      // Autoclave / flask
      return (
        <svg {...iconProps} viewBox="0 0 64 64">
          <rect x="18" y="28" width="28" height="22" rx="4" />
          <rect x="14" y="24" width="36" height="6" rx="2" />
          <rect x="26" y="12" width="12" height="14" rx="2" />
          <line x1="24" y1="36" x2="40" y2="36" />
          <line x1="24" y1="42" x2="40" y2="42" />
        </svg>
      );

    case 'prophylaxis':
    case 'scalers':
      // Tooth with brush strokes
      return (
        <svg {...iconProps} viewBox="0 0 64 64">
          {/* Tooth */}
          <path d="M20 16 C20 12, 26 10, 32 12 C38 10, 44 12, 44 16 C46 22, 44 30, 40 40 C38 46, 36 52, 34 52 C32 52, 32 48, 32 48 C32 48, 32 52, 30 52 C28 52, 26 46, 24 40 C20 30, 18 22, 20 16 Z" />
          {/* Brush lines */}
          <line x1="46" y1="22" x2="54" y2="22" strokeWidth="2.5" />
          <line x1="48" y1="28" x2="56" y2="28" strokeWidth="2.5" />
          <line x1="46" y1="34" x2="54" y2="34" strokeWidth="2.5" />
        </svg>
      );

    case 'restorative':
      // Tooth icon
      return (
        <svg {...iconProps} viewBox="0 0 64 64">
          <path d="M20 16 C20 12, 26 10, 32 12 C38 10, 44 12, 44 16 C46 22, 44 30, 40 40 C38 46, 36 52, 34 52 C32 52, 32 48, 32 48 C32 48, 32 52, 30 52 C28 52, 26 46, 24 40 C20 30, 18 22, 20 16 Z" />
          <path d="M26 18 C28 16, 36 16, 38 18" strokeWidth="1.5" />
        </svg>
      );

    default:
      // Medical cross
      return (
        <svg {...iconProps} viewBox="0 0 64 64">
          <rect x="28" y="12" width="8" height="40" rx="4" fill="#1a2b4a" fillOpacity="0.4" stroke="none" />
          <rect x="12" y="28" width="40" height="8" rx="4" fill="#1a2b4a" fillOpacity="0.4" stroke="none" />
        </svg>
      );
  }
}

interface Props {
  item: EquipmentWithPrice;
  showSaleBadge?: boolean;
}

export default function ProductCard({ item, showSaleBadge = false }: Props) {
  const mfr = item.manufacturer || '';
  const brand = BRAND_COLORS[mfr] || FALLBACK;
  const categoryLabel = item.category ? (CATEGORY_LABELS[item.category] || item.category) : null;
  const displayName = shortName(item);
  const categoryImage = item.category ? `/images/categories/${item.category}.jpg` : null;
  const [imgError, setImgError] = useState(false);

  return (
    <article
      dir="rtl"
      className="group bg-white flex flex-col overflow-hidden transition-all duration-250"
      style={{
        borderRight: `2px solid ${brand.accent}`,
        borderTop: '1px solid #e8ecf0',
        borderBottom: '1px solid #e8ecf0',
        borderLeft: '1px solid #e8ecf0',
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
      {/* Image area — Nano Banana 2 generated category image, fallback to SVG icon */}
      <div
        className="relative aspect-[4/3] flex items-center justify-center overflow-hidden"
        style={{ background: '#f0f4f8' }}
      >
        {categoryImage && !imgError ? (
          <Image
            src={categoryImage}
            alt={categoryLabel || item.category || ''}
            fill
            className="object-cover"
            onError={() => setImgError(true)}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            {getCategoryIcon(item.category || '')}
          </div>
        )}

        {/* Manufacturer pill — top right */}
        {mfr && (
          <span
            className="absolute top-2.5 right-2.5 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{
              background: '#fff',
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
              background: 'rgba(240,244,248,0.9)',
              color: '#4a5568',
              fontSize: '0.6rem',
              border: '1px solid #e8ecf0',
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

        {/* Product name — short display name */}
        <h3
          className="font-bold text-sm leading-snug flex-1"
          style={{ color: '#1a2b4a' }}
          title={item.name_he || item.name_en || ''}
        >
          {displayName}
        </h3>

        {/* Model */}
        {item.model && (
          <p className="text-xs font-mono" dir="ltr" style={{ color: '#9ba3af' }}>
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
                  style={{ color: '#1a2b4a', fontSize: '1.1rem', lineHeight: 1 }}
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
              background: '#1a2b4a',
              color: '#fff',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = brand.accent;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#1a2b4a';
            }}
          >
            פרטים
          </Link>
        </div>
      </div>
    </article>
  );
}
