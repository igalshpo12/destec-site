'use client';

import { useRef, useState, MouseEvent, useEffect } from 'react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

interface SupplierData {
  name: string;
  flag: string;
  countryHe: string;
  initials: string;
  accentColor: string;
  productCount?: number;
}

const SUPPLIERS: SupplierData[] = [
  { name: 'NSK',             flag: '🇯🇵', countryHe: 'יפן',      initials: 'NSK',  accentColor: '#c0392b' },
  { name: 'W&H',             flag: '🇦🇹', countryHe: 'אוסטריה',  initials: 'W&H',  accentColor: '#1e3a6e' },
  { name: 'KaVo',            flag: '🇩🇪', countryHe: 'גרמניה',   initials: 'KV',   accentColor: '#005baa' },
  { name: 'MK-dent',         flag: '🇩🇪', countryHe: 'גרמניה',   initials: 'MK',   accentColor: '#d35400' },
  { name: 'Nouvag',          flag: '🇨🇭', countryHe: 'שוויץ',    initials: 'NVG',  accentColor: '#27ae60' },
  { name: 'Bien-Air',        flag: '🇨🇭', countryHe: 'שוויץ',    initials: 'BA',   accentColor: '#2c3e50' },
  { name: 'Anthogyr',        flag: '🇫🇷', countryHe: 'צרפת',     initials: 'ANT',  accentColor: '#8e44ad' },
  { name: 'Dentsply Sirona', flag: '🇺🇸', countryHe: 'ארה״ב',   initials: 'DS',   accentColor: '#00589b' },
  { name: 'JINME',           flag: '🇨🇳', countryHe: 'סין',      initials: 'JME',  accentColor: '#c0392b' },
  { name: 'Tuttnauer',       flag: '🇮🇱', countryHe: 'ישראל',   initials: 'TUT',  accentColor: '#1a6bcf' },
];

interface CountMap {
  [manufacturer: string]: number;
}

function SupplierCard({ supplier, count }: { supplier: SupplierData; count: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <SpotlightCard
      spotlightColor="rgba(30,144,255,0.15)"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        textAlign: 'center',
        cursor: 'default',
        transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 8px 24px ${supplier.accentColor}18`
          : '0 1px 3px rgba(0,0,0,0.04)',
        borderColor: hovered ? `${supplier.accentColor}30` : '#e8ecf0',
      }}
    >
      {/* Logo circle */}
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: hovered ? supplier.accentColor : '#f4f6f8',
          color: hovered ? '#ffffff' : '#9ba3af',
          fontSize: supplier.initials.length > 3 ? '0.5rem' : '0.65rem',
          fontWeight: 900,
          letterSpacing: '-0.02em',
          transition: 'background 200ms ease, color 200ms ease',
          flexShrink: 0,
        }}
      >
        {supplier.initials}
      </div>

      {/* Country flag */}
      <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{supplier.flag}</span>

      {/* Name */}
      <span
        style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#1a2b4a',
          lineHeight: 1.2,
        }}
      >
        {supplier.name}
      </span>

      {/* Country */}
      <span
        style={{
          fontSize: '0.65rem',
          color: '#9ba3af',
        }}
      >
        {supplier.countryHe}
      </span>

      {/* Product count */}
      {count > 0 && (
        <span
          style={{
            fontSize: '0.6rem',
            color: '#1e90ff',
            fontWeight: 600,
            background: 'rgba(30,144,255,0.08)',
            padding: '0.15rem 0.5rem',
            borderRadius: '9999px',
          }}
        >
          {count.toLocaleString('he-IL')} מוצרים
        </span>
      )}
    </SpotlightCard>
  );
}

export default function SupplierLogoStrip() {
  const [counts, setCounts] = useState<CountMap>({});

  useEffect(() => {
    // Fetch product counts from Supabase
    async function fetchCounts() {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data, error } = await supabase
          .from('equipment')
          .select('manufacturer')
          .eq('is_active', true)
          .not('manufacturer', 'is', null);

        if (error || !data) return;

        const map: CountMap = {};
        for (const row of data) {
          const m: string = row.manufacturer as string;
          if (m) map[m] = (map[m] ?? 0) + 1;
        }
        setCounts(map);
      } catch {
        // Silent fail — counts just won't show
      }
    }
    fetchCounts();
  }, []);

  // Match supplier name to count map (fuzzy: check if any key contains the supplier name)
  function getCount(supplier: SupplierData): number {
    const key = Object.keys(counts).find(
      (k) =>
        k.toLowerCase().includes(supplier.name.toLowerCase()) ||
        supplier.name.toLowerCase().includes(k.toLowerCase())
    );
    return key ? counts[key] : 0;
  }

  return (
    <section
      dir="rtl"
      style={{ background: '#ffffff', borderTop: '1px solid #e8ecf0', borderBottom: '1px solid #e8ecf0' }}
      className="relative overflow-hidden py-16"
      aria-label="הספקים המובילים שלנו"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p
            className="text-xs font-semibold tracking-[0.25em] uppercase mb-3"
            style={{ color: '#1e90ff' }}
          >
            הספקים הרשמיים שלנו
          </p>
          <h2
            className="font-black"
            style={{ color: '#1a2b4a', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}
          >
            הספקים המובילים שלנו
          </h2>
          <p
            className="text-sm mt-3 max-w-lg mx-auto"
            style={{ color: '#6b7280' }}
          >
            DES הינו יבואן מורשה ומפיץ רשמי של כל המותגים הבאים בישראל
          </p>
        </div>

        {/* GlowCard grid — 5 cols desktop, 3 tablet, 2 mobile */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '1rem',
          }}
          className="supplier-grid"
        >
          {SUPPLIERS.map((s) => (
            <SupplierCard key={s.name} supplier={s} count={getCount(s)} />
          ))}
        </div>

        {/* Bottom note */}
        <p
          className="text-center text-xs mt-10"
          style={{ color: '#9ba3af', letterSpacing: '0.04em' }}
        >
          כל הסחורה מיובאת ישירות מהיצרן · אחריות מלאה · תמיכה טכנית
        </p>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .supplier-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 639px) {
          .supplier-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
