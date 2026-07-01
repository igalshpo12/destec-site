'use client';

import { useState, useEffect } from 'react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

interface SupplierData {
  name: string;
  flag: string;
  countryHe: string;
  accentColor: string;
  productCount?: number;
}

const SUPPLIERS: SupplierData[] = [
  { name: 'NSK',             flag: '\u{1F1EF}\u{1F1F5}', countryHe: 'יפן',      accentColor: '#c0392b' },
  { name: 'W&H',             flag: '\u{1F1E6}\u{1F1F9}', countryHe: 'אוסטריה',  accentColor: '#1e3a6e' },
  { name: 'KaVo',            flag: '\u{1F1E9}\u{1F1EA}', countryHe: 'גרמניה',   accentColor: '#005baa' },
  { name: 'MK-dent',         flag: '\u{1F1E9}\u{1F1EA}', countryHe: 'גרמניה',   accentColor: '#d35400' },
  { name: 'Nouvag',          flag: '\u{1F1E8}\u{1F1ED}', countryHe: 'שוויץ',    accentColor: '#27ae60' },
  { name: 'Bien-Air',        flag: '\u{1F1E8}\u{1F1ED}', countryHe: 'שוויץ',    accentColor: '#2c3e50' },
  { name: 'Anthogyr',        flag: '\u{1F1EB}\u{1F1F7}', countryHe: 'צרפת',     accentColor: '#8e44ad' },
  { name: 'Dentsply Sirona', flag: '\u{1F1FA}\u{1F1F8}', countryHe: 'ארה״ב',   accentColor: '#00589b' },
  { name: 'JINME',           flag: '\u{1F1E8}\u{1F1F3}', countryHe: 'סין',      accentColor: '#c0392b' },
  { name: 'MDT',             flag: '\u{1F1EE}\u{1F1F1}', countryHe: 'ישראל',   accentColor: '#1a6bcf' },
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
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '6px',
        cursor: 'default',
        minHeight: '100px',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 8px 24px ${supplier.accentColor}18`
          : '0 1px 3px rgba(0,0,0,0.04)',
        borderColor: hovered ? `${supplier.accentColor}30` : '#e8ecf0',
      }}
    >
      {/* Country flag + country name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '1rem', lineHeight: 1 }}>{supplier.flag}</span>
        <span style={{ fontSize: '0.7rem', color: '#9ba3af' }}>{supplier.countryHe}</span>
      </div>

      {/* Manufacturer name */}
      <span
        style={{
          fontSize: '1rem',
          fontWeight: 700,
          color: '#1a2b4a',
          lineHeight: 1.2,
        }}
      >
        {supplier.name}
      </span>

      {/* Product count pill */}
      {count > 0 && (
        <span
          style={{
            fontSize: '0.75rem',
            color: '#1e90ff',
            fontWeight: 600,
            background: '#f0f7ff',
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
          }}
        >
          {count.toLocaleString('he-IL')} {'מוצרים'}
        </span>
      )}
    </SpotlightCard>
  );
}

export default function SupplierLogoStrip() {
  const [counts, setCounts] = useState<CountMap>({});

  useEffect(() => {
    async function fetchCounts() {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data, error } = await supabase
          .from('catalog_products')
          .select('manufacturer')
          .eq('is_active', true)
          .not('category', 'in', '("services","spare_parts","consumables")')
          .not('manufacturer', 'is', null);

        if (error || !data) return;

        const map: CountMap = {};
        (data ?? []).forEach((row) => {
          const m: string = row.manufacturer as string;
          if (m) map[m] = (map[m] ?? 0) + 1;
        });
        setCounts(map);
      } catch {
        // Silent fail — counts just won't show
      }
    }
    fetchCounts();
  }, []);

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
      className="relative py-16"
      aria-label="הספקים המובילים שלנו"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p
            className="text-xs font-semibold tracking-[0.25em] uppercase mb-3"
            style={{ color: '#1e90ff' }}
          >
            {'הספקים הרשמיים שלנו'}
          </p>
          <h2
            className="font-black"
            style={{ color: '#1a2b4a', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}
          >
            {'הספקים המובילים שלנו'}
          </h2>
          <p
            className="text-sm mt-3 max-w-lg mx-auto"
            style={{ color: '#6b7280' }}
          >
            {'DES הינו יבואן מורשה ומפיץ רשמי של כל המותגים הבאים בישראל'}
          </p>
        </div>

        {/* GlowCard grid — Tailwind responsive columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {SUPPLIERS.map((s) => (
            <SupplierCard key={s.name} supplier={s} count={getCount(s)} />
          ))}
        </div>

        {/* Bottom note */}
        <p
          className="text-center text-xs mt-10"
          style={{ color: '#9ba3af', letterSpacing: '0.04em' }}
        >
          {'כל הסחורה מיובאת ישירות מהיצרן · אחריות מלאה · תמיכה טכנית'}
        </p>
      </div>
    </section>
  );
}
