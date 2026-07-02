'use client';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  slug: string;
  label: string;
  labelEn: string;
  desc: string;
  count: string;
  image: string;
  wide?: boolean;
}

const CATEGORIES: Category[] = [
  {
    slug: 'drills',
    label: 'מקדחים',
    labelEn: 'Drills & Burs',
    desc: 'מקדחי יהלום, טונגסטן קרבייד וזרקוניה — MDT',
    count: '396',
    image: '/images/categories/cat-drills.webp',
    wide: true,
  },
  {
    slug: 'polishing',
    label: 'ליטוש וגימור',
    labelEn: 'Polishing & Finishing',
    desc: 'דיסקים, סטריפים וגומיות ליטוש',
    count: '232',
    image: '/images/categories/cat-polishing.webp',
  },
  {
    slug: 'general',
    label: 'ערכות וכללי',
    labelEn: 'Kits & General',
    desc: 'ערכות MDT ומכשירי רפואה כללית',
    count: '40',
    image: '/images/categories/cat-general.webp',
  },
  {
    slug: 'surgery',
    label: 'כירורגיה והשתלות',
    labelEn: 'Surgery & Implants',
    desc: 'פיזיודיספנסרים, שאיבה ואלקטרוכירורגיה',
    count: '36',
    image: '/images/categories/cat-surgery.webp',
  },
  {
    slug: 'handpieces',
    label: 'טורבינות וזוויתנים',
    labelEn: 'Handpieces & Turbines',
    desc: 'טורבינות, זוויתנים וידיתנים — Jinme, MK-dent',
    count: '25',
    image: '/images/categories/cat-handpieces.webp',
  },
];

function CategoryCard({ cat }: { cat: Category }) {
  return (
    <Link
      href={`/catalog?category=${cat.slug}`}
      className="group relative overflow-hidden block"
      style={{
        borderRadius: '14px',
        gridColumn: cat.wide ? 'span 2' : undefined,
        background: '#0F2D52',
        textDecoration: 'none',
      }}
      aria-label={cat.label}
    >
      {/* Photo */}
      <Image
        src={cat.image}
        alt={cat.label}
        fill
        sizes={cat.wide ? '(max-width: 900px) 100vw, 66vw' : '(max-width: 580px) 100vw, (max-width: 900px) 50vw, 33vw'}
        className="object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-105"
        style={{ objectPosition: 'center' }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-95"
        style={{
          background: `linear-gradient(to top,
            rgba(6,14,28,0.92) 0%,
            rgba(6,14,28,0.65) 30%,
            rgba(6,14,28,0.25) 55%,
            rgba(6,14,28,0.08) 75%,
            transparent 100%
          )`,
        }}
      />

      {/* Count badge — top-left (visually right in RTL) */}
      <span
        className="absolute top-4 left-4 text-white transition-all duration-250"
        style={{
          fontFamily: "'Noto Sans', sans-serif",
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.04em',
          background: 'rgba(75,174,232,0.22)',
          border: '1px solid rgba(75,174,232,0.45)',
          backdropFilter: 'blur(8px)',
          borderRadius: '100px',
          padding: '5px 12px',
        }}
      >
        {cat.count} מוצרים
      </span>

      {/* Text content */}
      <div className="absolute bottom-0 right-0 left-0" style={{ padding: '20px 22px 22px' }}>
        <span
          style={{
            fontFamily: "'Noto Sans', sans-serif",
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(75,174,232,0.85)',
            display: 'block',
            marginBottom: '5px',
          }}
        >
          {cat.labelEn}
        </span>
        <h3
          style={{
            fontFamily: "'Figtree', sans-serif",
            fontWeight: 800,
            color: '#fff',
            lineHeight: 1.1,
            marginBottom: '5px',
            fontSize: cat.wide ? 'clamp(1.4rem, 2.2vw, 1.9rem)' : '1.15rem',
          }}
        >
          {cat.label}
        </h3>
        <p
          style={{
            fontFamily: "'Noto Sans', sans-serif",
            fontSize: '12.5px',
            color: 'rgba(255,255,255,0.58)',
            lineHeight: 1.5,
          }}
        >
          {cat.desc}
        </p>
      </div>

      {/* Arrow — slides in on hover */}
      <div
        className="absolute bottom-5 left-5 flex items-center justify-center opacity-0 scale-90 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0"
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          background: 'rgba(30,140,212,0.85)',
        }}
        aria-hidden="true"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: 'scaleX(-1)' }}>
          <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  );
}

export default function CategoryShowcase() {
  return (
    <section dir="rtl" className="py-16 bg-white" style={{ overflowX: 'clip' }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-7">
          <div>
            <p
              className="text-xs font-semibold tracking-[0.22em] uppercase mb-2"
              style={{ color: '#1E8CD4' }}
            >
              קטגוריות
            </p>
            <h2
              className="font-black"
              style={{ color: '#0F2D52', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}
            >
              ציוד לפי תחום
            </h2>
          </div>
          <Link
            href="/catalog"
            className="text-sm font-semibold flex items-center gap-1.5 transition-colors pb-1"
            style={{ color: '#5A7A94' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#1E8CD4'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#5A7A94'; }}
          >
            כל הקטגוריות
            <span style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>→</span>
          </Link>
        </div>

        {/* Bento grid */}
        <style>{`
          .cat-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: 280px 220px;
            gap: 14px;
          }
          .cat-grid > *:first-child { grid-column: span 2; }
          @media (max-width: 900px) {
            .cat-grid { grid-template-columns: 1fr 1fr; grid-template-rows: 240px 190px 190px; }
          }
          @media (max-width: 580px) {
            .cat-grid { grid-template-columns: 1fr; grid-template-rows: repeat(5, 210px); }
            .cat-grid > * { grid-column: span 1 !important; }
          }
        `}</style>
        <div className="cat-grid">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.slug} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
