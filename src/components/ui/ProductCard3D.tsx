'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useCallback } from 'react';
import { EquipmentWithPrice } from '@/lib/supabase';
import { formatPrice, CATEGORY_LABELS, shortName } from '@/lib/utils';

/* Brand → accent color + letter map */
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

/* Supplier slug → local image path */
const SUPPLIER_IMAGES: Record<string, string> = {
  NSK:               '/suppliers/nsk/product.png',
  'W&H':             '/suppliers/wh/product.jpg',
  KaVo:              '/suppliers/kavo/product.jpg',
  'MK-dent':         '/suppliers/mk-dent/product.jpg',
  Nouvag:            '/suppliers/nouvag/product.jpg',
  'Bien-Air':        '/suppliers/bien-air/product.png',
  'Dentsply Sirona': '/suppliers/dentsply-sirona/product.png',
};

/* Category images that exist in /public/images/categories/ */
const CATEGORY_IMAGES = new Set([
  'turbines', 'angles', 'handpieces', 'drills', 'motors',
  'sterilization', 'electrosurgery', 'surgery',
]);

const FALLBACK_BRAND = { accent: '#1a2b4a', letter: '?' };

interface Props {
  item: EquipmentWithPrice;
  showSaleBadge?: boolean;
}

/**
 * ProductCard3D — CSS 3D flip card.
 *
 * Front: category icon + product name + price (matches flat ProductCard look).
 * Back:  supplier product image (or category image) + manufacturer credit + CTA.
 *
 * Flip trigger:
 *   - Desktop: onMouseEnter / onMouseLeave
 *   - Mobile:  onClick (toggles flip, second click navigates via the CTA)
 *
 * CSS technique: perspective on wrapper, transform-style: preserve-3d on inner,
 * rotateY(180deg) on hover/click. Both faces use backface-visibility: hidden.
 */
export default function ProductCard3D({ item, showSaleBadge = false }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [imgError, setImgError] = useState(false);

  const mfr = item.manufacturer || '';
  const brand = BRAND_COLORS[mfr] || FALLBACK_BRAND;
  const categoryLabel = item.category ? (CATEGORY_LABELS[item.category] || item.category) : null;
  const displayName = shortName(item);

  // Determine which image to show on the back face
  const supplierImg = SUPPLIER_IMAGES[mfr] || null;
  const categoryImg =
    item.category && CATEGORY_IMAGES.has(item.category)
      ? `/images/categories/${item.category}.jpg`
      : null;
  const backImg = item.image_url || (imgError ? categoryImg : (supplierImg || categoryImg));

  const handleMouseEnter = useCallback(() => setFlipped(true), []);
  const handleMouseLeave = useCallback(() => setFlipped(false), []);
  const handleClick = useCallback(() => setFlipped((f) => !f), []);

  return (
    <div
      aria-label={`${displayName} — ${mfr}`}
      style={{ perspective: '1000px', height: '360px', cursor: 'pointer' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Inner — rotates on flip */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* ─────────────────── FRONT FACE ─────────────────── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: '#fff',
            borderRight: `3px solid ${brand.accent}`,
            borderTop: '1px solid #e8ecf0',
            borderBottom: '1px solid #e8ecf0',
            borderLeft: '1px solid #e8ecf0',
            borderRadius: '2px 10px 10px 2px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Top colour band */}
          <div
            style={{
              height: '4px',
              background: `linear-gradient(90deg, ${brand.accent}, ${brand.accent}88)`,
            }}
          />

          {/* Brand letter avatar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '140px',
              background: `${brand.accent}08`,
              position: 'relative',
            }}
          >
            <span
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: brand.accent,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                boxShadow: `0 4px 16px ${brand.accent}40`,
              }}
            >
              {brand.letter}
            </span>

            {showSaleBadge && (
              <span
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: '#92400e',
                  color: '#fde68a',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.6rem',
                  borderRadius: '9999px',
                }}
              >
                מחיר מיוחד
              </span>
            )}
          </div>

          {/* Content */}
          <div
            dir="rtl"
            style={{
              flex: 1,
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.65rem',
                color: '#9ba3af',
                letterSpacing: '0.04em',
              }}
              dir="ltr"
            >
              {item.item_number || '—'}
            </span>

            <h3
              style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                color: '#1a2b4a',
                lineHeight: 1.35,
                flex: 1,
                margin: 0,
              }}
              title={item.name_he || item.name_en || ''}
            >
              {displayName}
            </h3>

            {mfr && (
              <p style={{ fontSize: '0.7rem', color: '#9ba3af', margin: 0 }}>
                {mfr} · {categoryLabel || ''}
              </p>
            )}

            {/* Price */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.5rem',
                borderTop: '1px solid #f0f2f5',
                marginTop: 'auto',
              }}
            >
              {item.price ? (
                <span
                  style={{ fontWeight: 900, fontSize: '1rem', color: '#1a2b4a' }}
                >
                  {formatPrice(item.price, item.currency || 'ILS')}
                </span>
              ) : (
                <span style={{ fontSize: '0.8rem', color: '#9ba3af' }}>
                  לפרטי מחיר
                </span>
              )}
              <span style={{ fontSize: '0.7rem', color: `${brand.accent}`, fontWeight: 600 }}>
                להפוך ←
              </span>
            </div>
          </div>
        </div>

        {/* ─────────────────── BACK FACE ─────────────────── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: '#0d1929',
            borderRadius: '10px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
          dir="rtl"
        >
          {/* Product image */}
          <div
            style={{
              position: 'relative',
              flex: 1,
              background: backImg ? '#0a1520' : `${brand.accent}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              minHeight: '200px',
            }}
          >
            {backImg ? (
              <Image
                src={backImg}
                alt={`${mfr} — ${displayName}`}
                fill
                className="object-contain"
                onError={() => setImgError(true)}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                style={{ padding: '1rem' }}
              />
            ) : (
              <span
                style={{
                  fontSize: '3rem',
                  fontWeight: 900,
                  color: brand.accent,
                  opacity: 0.3,
                }}
              >
                {brand.letter}
              </span>
            )}

            {/* Gradient overlay at bottom */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '60px',
                background: 'linear-gradient(to top, #0d1929, transparent)',
              }}
            />

            {/* Manufacturer badge */}
            <span
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: brand.accent,
                color: '#fff',
                fontSize: '0.6rem',
                fontWeight: 700,
                padding: '0.25rem 0.65rem',
                borderRadius: '9999px',
                letterSpacing: '0.06em',
              }}
            >
              {mfr}
            </span>
          </div>

          {/* Back content footer */}
          <div
            style={{
              padding: '0.875rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              background: '#0d1929',
            }}
          >
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#fff',
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              {displayName}
            </p>
            <p
              style={{
                fontSize: '0.6rem',
                color: 'rgba(255,255,255,0.45)',
                margin: 0,
              }}
            >
              {'מיוצר עיי '}{mfr}{' · מופץ עיי DES'}
            </p>

            <Link
              href={`/catalog/${item.id}`}
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                background: brand.accent,
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '0.5rem 0.875rem',
                borderRadius: '6px',
                textDecoration: 'none',
                marginTop: '0.125rem',
                letterSpacing: '0.03em',
              }}
            >
              {'לפרטים ←'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
