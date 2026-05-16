'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';

interface ShowcaseCard {
  brand: string;
  productName: string;
  category: string;
  imagePath: string;
  imageAlt: string;
  accent: string;
  catalogHref: string;
}

const SHOWCASE_CARDS: ShowcaseCard[] = [
  {
    brand: 'NSK',
    productName: 'S-Max M Turbine',
    category: 'טורבינה אוויר',
    imagePath: '/suppliers/nsk/product.png',
    imageAlt: 'NSK S-Max M air turbine handpiece',
    accent: '#c0392b',
    catalogHref: '/catalog?manufacturer=NSK&category=turbines',
  },
  {
    brand: 'W&H',
    productName: 'Synea Vision TK-97L',
    category: 'טורבינה אוויר',
    imagePath: '/suppliers/wh/product.jpg',
    imageAlt: 'W&H Synea Vision TK-97L air turbine',
    accent: '#1e3a6e',
    catalogHref: '/catalog?manufacturer=W%26H&category=turbines',
  },
  {
    brand: 'KaVo',
    productName: 'MASTERtorque LUX M8900L',
    category: 'טורבינה אוויר',
    imagePath: '/suppliers/kavo/product.jpg',
    imageAlt: 'KaVo MASTERtorque LUX M8900L air turbine',
    accent: '#005baa',
    catalogHref: '/catalog?manufacturer=KaVo&category=turbines',
  },
  {
    brand: 'MK-dent',
    productName: 'Prime Line Turbine',
    category: 'טורבינה אוויר',
    imagePath: '/suppliers/mk-dent/product.jpg',
    imageAlt: 'MK-dent Prime Line turbine handpiece set',
    accent: '#d35400',
    catalogHref: '/catalog?manufacturer=MK-dent&category=turbines',
  },
  {
    brand: 'Bien-Air',
    productName: 'iCHIROPRO',
    category: 'מנוע שתלים',
    imagePath: '/suppliers/bien-air/product.png',
    imageAlt: 'Bien-Air iCHIROPRO implant physiodispenser',
    accent: '#2c3e50',
    catalogHref: '/catalog?manufacturer=Bien-Air&category=motors',
  },
  {
    brand: 'Nouvag',
    productName: 'High-Speed Handpiece',
    category: 'כלי ניתוח',
    imagePath: '/suppliers/nouvag/product.jpg',
    imageAlt: 'Nouvag high-speed surgical handpieces',
    accent: '#27ae60',
    catalogHref: '/catalog?manufacturer=Nouvag',
  },
  {
    brand: 'Dentsply Sirona',
    productName: 'Dental Instruments',
    category: 'ציוד דנטלי',
    imagePath: '/suppliers/dentsply-sirona/product.png',
    imageAlt: 'Dentsply Sirona dental handpiece instruments',
    accent: '#00589b',
    catalogHref: '/catalog?manufacturer=Dentsply+Sirona',
  },
];

function FlipCard({ card }: { card: ShowcaseCard }) {
  const [flipped, setFlipped] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      style={{
        flexShrink: 0,
        width: '240px',
        height: '300px',
        perspective: '1000px',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped((f) => !f)}
      aria-label={`${card.brand} ${card.productName}`}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* ── FRONT ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: '#fff',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Colour top bar */}
          <div style={{ height: '3px', background: card.accent }} />

          {/* Image area */}
          <div
            style={{
              flex: 1,
              position: 'relative',
              background: `${card.accent}08`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              minHeight: 0,
            }}
          >
            {!imgError ? (
              <Image
                src={card.imagePath}
                alt={card.imageAlt}
                fill
                className="object-contain"
                onError={() => setImgError(true)}
                sizes="240px"
                style={{ padding: '1.25rem' }}
              />
            ) : (
              <span
                style={{
                  fontSize: '3rem',
                  fontWeight: 900,
                  color: card.accent,
                  opacity: 0.25,
                }}
              >
                {card.brand[0]}
              </span>
            )}
          </div>

          {/* Footer */}
          <div
            dir="rtl"
            style={{
              padding: '0.875rem',
              background: '#fff',
              borderTop: '1px solid #f0f2f5',
            }}
          >
            <p
              style={{
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: card.accent,
                margin: '0 0 0.2rem',
                textTransform: 'uppercase',
              }}
            >
              {card.brand}
            </p>
            <p
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#1a2b4a',
                margin: '0 0 0.25rem',
                lineHeight: 1.3,
              }}
            >
              {card.productName}
            </p>
            <p style={{ fontSize: '0.65rem', color: '#9ba3af', margin: 0 }}>
              {card.category} · להפוך לפרטים ←
            </p>
          </div>
        </div>

        {/* ── BACK ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, #0d1929 0%, #1a2b4a 100%)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: `0 8px 24px ${card.accent}30`,
            display: 'flex',
            flexDirection: 'column',
            padding: '1.25rem',
          }}
          dir="rtl"
        >
          {/* Brand badge */}
          <span
            style={{
              display: 'inline-block',
              background: card.accent,
              color: '#fff',
              fontSize: '0.6rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              alignSelf: 'flex-start',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            מוצר מוביל — {card.brand}
          </span>

          <h3
            style={{
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: 900,
              lineHeight: 1.25,
              margin: '0 0 0.5rem',
            }}
          >
            {card.productName}
          </h3>

          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.7rem', margin: '0 0 0.35rem' }}>
            {card.category}
          </p>

          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem', margin: '0 0 auto' }}>
            {'מיוצר עיי '}{card.brand}{' · מופץ עיי DES'}
          </p>

          <Link
            href={card.catalogHref}
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'block',
              textAlign: 'center',
              background: card.accent,
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.75rem',
              padding: '0.625rem 1rem',
              borderRadius: '8px',
              textDecoration: 'none',
              marginTop: '1rem',
              letterSpacing: '0.03em',
            }}
          >
            לקטלוג ←
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProductShowcase3D() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  return (
    <section
      dir="rtl"
      aria-label="המוצרים המובילים שלנו"
      style={{
        background: '#fff',
        padding: '4rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle top border */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)',
        }}
      />

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingInline: '1.5rem',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <p
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#1e90ff',
                margin: '0 0 0.4rem',
              }}
            >
              ספקים מובילים
            </p>
            <h2
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 900,
                color: '#1a2b4a',
                margin: 0,
              }}
            >
              המוצרים המובילים שלנו
            </h2>
            <p
              style={{
                fontSize: '0.85rem',
                color: '#64748b',
                margin: '0.5rem 0 0',
              }}
            >
              ציוד דנטלי ורפואי מהיצרנים המובילים בעולם · העבירו את העכבר לגלות פרטים
            </p>
          </div>

          {/* Scroll controls — desktop */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={scrollRight}
              aria-label="גלול שמאלה"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1px solid #e2e8f0',
                background: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                color: '#1a2b4a',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#1a2b4a';
                (e.currentTarget as HTMLElement).style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#fff';
                (e.currentTarget as HTMLElement).style.color = '#1a2b4a';
              }}
            >
              →
            </button>
            <button
              onClick={scrollLeft}
              aria-label="גלול ימינה"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1px solid #e2e8f0',
                background: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                color: '#1a2b4a',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#1a2b4a';
                (e.currentTarget as HTMLElement).style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#fff';
                (e.currentTarget as HTMLElement).style.color = '#1a2b4a';
              }}
            >
              ←
            </button>
          </div>
        </div>

        {/* Horizontal scroll strip */}
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: '1.25rem',
            overflowX: 'auto',
            paddingBottom: '1rem',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
          }}
          className="hide-scrollbar"
        >
          {SHOWCASE_CARDS.map((card) => (
            <div
              key={card.brand}
              style={{ scrollSnapAlign: 'start', flexShrink: 0 }}
            >
              <FlipCard card={card} />
            </div>
          ))}
        </div>

        {/* Mobile swipe hint */}
        <p
          style={{
            textAlign: 'center',
            fontSize: '0.7rem',
            color: '#94a3b8',
            marginTop: '1rem',
          }}
        >
          גררו לצדדים לגלות יותר מוצרים · הקישו על הכרטיס לפרטים
        </p>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}
