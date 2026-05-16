'use client';
import Link from 'next/link';
import type { ReactNode } from 'react';

interface Category {
  slug: string;
  label: string;
  labelEn: string;
  desc: string;
  count: string;
  span: 'wide' | 'normal';
  bg: string;
}

const CATEGORIES: Category[] = [
  {
    slug: 'turbines',
    label: 'טורבינות',
    labelEn: 'Turbines',
    desc: 'טורבינות אוויר במהירות גבוהה',
    count: '778',
    span: 'wide',
    bg: 'linear-gradient(135deg, #0d2137 0%, #1a3a5c 100%)',
  },
  {
    slug: 'angles',
    label: 'זוויתנים',
    labelEn: 'Contra-Angles',
    desc: 'זוויתנים ישרים וכפופים',
    count: '412',
    span: 'normal',
    bg: 'linear-gradient(135deg, #1a0d37 0%, #2d1a5c 100%)',
  },
  {
    slug: 'handpieces',
    label: 'ידיתנים',
    labelEn: 'Handpieces',
    desc: 'ידיתנים לכל שימוש קליני',
    count: '324',
    span: 'normal',
    bg: 'linear-gradient(135deg, #0d2437 0%, #0f3d5e 100%)',
  },
  {
    slug: 'drills',
    label: 'מקדחים',
    labelEn: 'Drills',
    desc: 'מקדחים לאימפלנטולוגיה',
    count: '196',
    span: 'normal',
    bg: 'linear-gradient(135deg, #1a1a0d 0%, #3a3a1a 100%)',
  },
  {
    slug: 'scalers',
    label: 'סקילרים',
    labelEn: 'Scalers',
    desc: 'סקילרים אולטרסוניים',
    count: '148',
    span: 'normal',
    bg: 'linear-gradient(135deg, #0d1f37 0%, #1a3020 100%)',
  },
];

/** Large decorative background icon for each category (white at 20% opacity) */
function getCategoryBgIcon(slug: string): ReactNode {
  const props = {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 64 64',
    fill: 'none',
    stroke: 'white',
    strokeWidth: '2',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    style: { opacity: 0.2, width: '80px', height: '80px' },
  };

  switch (slug) {
    case 'turbines':
      return (
        <svg {...props}>
          <circle cx="32" cy="32" r="5" />
          <path d="M32 27 C28 16, 18 14, 16 20 C14 26, 22 28, 27 29" />
          <path d="M37 32 C48 28, 50 18, 44 16 C38 14, 36 22, 35 27" />
          <path d="M32 37 C36 48, 46 50, 48 44 C50 38, 42 36, 37 35" />
          <path d="M27 32 C16 36, 14 46, 20 48 C26 50, 28 42, 29 37" />
        </svg>
      );
    case 'angles':
      return (
        <svg {...props}>
          <path d="M14 48 L34 28" strokeWidth="5" strokeLinecap="round" />
          <path d="M34 28 L34 16" strokeWidth="5" strokeLinecap="round" />
          <circle cx="34" cy="12" r="4" fill="white" fillOpacity="0.3" stroke="none" />
        </svg>
      );
    case 'handpieces':
      return (
        <svg {...props}>
          <rect x="12" y="28" width="40" height="8" rx="4" />
          <circle cx="52" cy="32" r="3" />
          <rect x="14" y="30" width="6" height="4" rx="1" fill="white" fillOpacity="0.3" stroke="none" />
          <rect x="22" y="30" width="4" height="4" rx="1" fill="white" fillOpacity="0.3" stroke="none" />
        </svg>
      );
    case 'drills':
      return (
        <svg {...props}>
          <line x1="32" y1="8" x2="32" y2="52" />
          <path d="M26 52 L32 60 L38 52" />
          <path d="M26 16 Q32 20 38 16" />
          <path d="M26 24 Q32 28 38 24" />
          <path d="M26 32 Q32 36 38 32" />
          <path d="M26 40 Q32 44 38 40" />
          <rect x="24" y="8" width="16" height="6" rx="2" />
        </svg>
      );
    case 'scalers':
      return (
        <svg {...props}>
          <path d="M20 16 C20 12, 26 10, 32 12 C38 10, 44 12, 44 16 C46 22, 44 30, 40 40 C38 46, 36 52, 34 52 C32 52, 32 48, 32 48 C32 48, 32 52, 30 52 C28 52, 26 46, 24 40 C20 30, 18 22, 20 16 Z" />
          <line x1="46" y1="22" x2="54" y2="22" strokeWidth="2.5" />
          <line x1="48" y1="28" x2="56" y2="28" strokeWidth="2.5" />
          <line x1="46" y1="34" x2="54" y2="34" strokeWidth="2.5" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <rect x="28" y="12" width="8" height="40" rx="4" fill="white" fillOpacity="0.3" stroke="none" />
          <rect x="12" y="28" width="40" height="8" rx="4" fill="white" fillOpacity="0.3" stroke="none" />
        </svg>
      );
  }
}

function CategoryTile({ cat }: { cat: Category }) {
  const isWide = cat.span === 'wide';
  return (
    <Link
      href={`/catalog?category=${cat.slug}`}
      className={`group relative flex flex-col justify-between overflow-hidden p-6 lg:p-7 ${isWide ? 'lg:col-span-2' : ''}`}
      style={{
        background: cat.bg,
        borderRadius: '12px',
        minHeight: cat.span === 'wide' ? '220px' : '190px',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
      aria-label={cat.label}
    >
      {/* Large background icon — top-left, white 20% opacity */}
      <div
        className="absolute top-4 right-4 pointer-events-none"
        aria-hidden="true"
      >
        {getCategoryBgIcon(cat.slug)}
      </div>

      {/* Hover overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04), transparent 60%)' }}
      />

      {/* Count badge */}
      <div className="flex justify-between items-start relative z-10">
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(255,255,255,0.2)',
            letterSpacing: '0.04em',
          }}
        >
          {cat.count} מוצרים
        </span>

        {/* Arrow icon — animates to blue on hover */}
        <span
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0"
          style={{ color: 'rgba(255,255,255,0.7)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#1e90ff'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'; }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 9H4M4 9L8 5M4 9L8 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      {/* Bottom text */}
      <div className="relative z-10 mt-auto">
        <p
          className="text-xs font-medium mb-1.5 tracking-wider uppercase"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          {cat.labelEn}
        </p>
        <h3
          className="font-black text-white leading-tight"
          style={{ fontSize: cat.span === 'wide' ? 'clamp(1.6rem, 3vw, 2.2rem)' : '1.35rem' }}
        >
          {cat.label}
        </h3>
        <p
          className="text-sm mt-1.5 max-w-[220px]"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          {cat.desc}
        </p>
      </div>
    </Link>
  );
}

export default function CategoryShowcase() {
  return (
    <section dir="rtl" className="py-16 bg-white" style={{ overflowX: 'clip' }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-2"
              style={{ color: '#1e90ff' }}
            >
              קטגוריות
            </p>
            <h2
              className="font-black"
              style={{ color: '#1a2b4a', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
            >
              ציוד לפי תחום
            </h2>
          </div>
          <Link
            href="/catalog"
            className="text-sm font-semibold flex items-center gap-1.5 transition-colors"
            style={{ color: '#6b7280' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#1e90ff'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#6b7280'; }}
          >
            כל הקטגוריות
            <span style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>→</span>
          </Link>
        </div>

        {/* Bento grid — 3-col desktop so col-span-2 tile fills row 1 correctly */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {CATEGORIES.map((cat) => (
            <CategoryTile key={cat.slug} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
