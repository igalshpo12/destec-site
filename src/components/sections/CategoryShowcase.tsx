'use client';
import Link from 'next/link';

interface Category {
  slug: string;
  label: string;
  labelEn: string;
  desc: string;
  count: string;
  span: 'wide' | 'normal';
  bg: string;
  textAccent: string;
}

const CATEGORIES: Category[] = [
  {
    slug: 'turbines',
    label: 'טורבינות',
    labelEn: 'Turbines',
    desc: 'טורבינות אוויר במהירות גבוהה',
    count: '778',
    span: 'wide',
    bg: 'linear-gradient(135deg, #0d1929 0%, #1a2b4a 60%, #1e3a5c 100%)',
    textAccent: '#1e90ff',
  },
  {
    slug: 'angles',
    label: 'זוויתנים',
    labelEn: 'Contra-Angles',
    desc: 'זוויתנים ישרים וכפופים',
    count: '412',
    span: 'normal',
    bg: 'linear-gradient(135deg, #0a1f1a 0%, #0d3325 100%)',
    textAccent: '#00c6a7',
  },
  {
    slug: 'handpieces',
    label: 'ידיתנים',
    labelEn: 'Handpieces',
    desc: 'ידיתנים לכל שימוש קליני',
    count: '324',
    span: 'normal',
    bg: 'linear-gradient(135deg, #160a2a 0%, #2a1050 100%)',
    textAccent: '#a78bfa',
  },
  {
    slug: 'drills',
    label: 'מקדחים',
    labelEn: 'Drills',
    desc: 'מקדחים לאימפלנטולוגיה',
    count: '196',
    span: 'normal',
    bg: 'linear-gradient(135deg, #1a0d00 0%, #3d2000 100%)',
    textAccent: '#f59e0b',
  },
  {
    slug: 'scalers',
    label: 'סקילרים',
    labelEn: 'Scalers',
    desc: 'סקילרים אולטרסוניים',
    count: '148',
    span: 'normal',
    bg: 'linear-gradient(135deg, #071a0d 0%, #0d2e18 100%)',
    textAccent: '#34d399',
  },
  {
    slug: 'motors',
    label: 'מנועים',
    labelEn: 'Motors',
    desc: 'מנועי כירורגיה ואימפלנטולוגיה',
    count: '89',
    span: 'normal',
    bg: 'linear-gradient(135deg, #1a1a0d 0%, #2e2e10 100%)',
    textAccent: '#fbbf24',
  },
];

function ArrowIcon({ color }: { color: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color }}
    >
      {/* RTL arrow — pointing left */}
      <path d="M14 9H4M4 9L8 5M4 9L8 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
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
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, ${cat.textAccent}30 1px, transparent 1px)`,
          backgroundSize: '22px 22px',
        }}
      />

      {/* Hover overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${cat.textAccent}08, transparent 60%)` }}
      />

      {/* Count badge */}
      <div className="flex justify-between items-start relative z-10">
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{
            background: `${cat.textAccent}18`,
            color: cat.textAccent,
            border: `1px solid ${cat.textAccent}30`,
            letterSpacing: '0.04em',
          }}
        >
          {cat.count} מוצרים
        </span>

        {/* Arrow icon — appears on hover */}
        <span
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0"
          style={{ color: cat.textAccent }}
        >
          <ArrowIcon color={cat.textAccent} />
        </span>
      </div>

      {/* Bottom text */}
      <div className="relative z-10 mt-auto">
        <p
          className="text-xs font-medium mb-1.5 tracking-wider uppercase"
          style={{ color: cat.textAccent, opacity: 0.8 }}
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
    <section dir="rtl" className="py-16 bg-white">
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
              style={{ color: '#0d1929', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
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

        {/* Bento grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {CATEGORIES.map((cat) => (
            <CategoryTile key={cat.slug} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
