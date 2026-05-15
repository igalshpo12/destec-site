'use client';
import { useEffect, useRef, useState } from 'react';

interface Stat {
  value: string;
  numericEnd: number | null;
  suffix: string;
  label: string;
  sublabel: string;
}

const STATS: Stat[] = [
  {
    value: '9,000+',
    numericEnd: 9000,
    suffix: '+',
    label: 'מוצרים במלאי',
    sublabel: 'זמינות מיידית',
  },
  {
    value: '27',
    numericEnd: 27,
    suffix: '',
    label: 'שנות ניסיון',
    sublabel: 'פועלים מאז 1998',
  },
  {
    value: 'ISO 9001',
    numericEnd: null,
    suffix: '',
    label: 'מוסמך',
    sublabel: 'ARS #260225019743',
  },
  {
    value: 'אמ״ר',
    numericEnd: null,
    suffix: '',
    label: 'רישיון יבואן',
    sublabel: 'משרד הבריאות',
  },
];

function useCountUp(end: number | null, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active || end === null) return;
    let start = 0;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, end);
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [active, end, duration]);
  return count;
}

function StatBlock({ stat, active, index }: { stat: Stat; active: boolean; index: number }) {
  const count = useCountUp(stat.numericEnd, 1600, active);

  const displayValue =
    stat.numericEnd !== null
      ? stat.numericEnd >= 1000
        ? count.toLocaleString('he-IL') + stat.suffix
        : count + stat.suffix
      : stat.value;

  return (
    <div
      className="flex flex-col items-center justify-center py-8 px-4 relative"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? 'translateY(0)' : 'translateY(12px)',
        transition: `opacity 0.6s ease ${index * 0.12}s, transform 0.6s ease ${index * 0.12}s`,
      }}
    >
      {/* Big number */}
      <div
        className="font-black mb-1 tabular-nums"
        style={{
          fontSize: 'clamp(2rem, 4vw, 2.8rem)',
          color: '#1e90ff',
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}
        dir="ltr"
      >
        {displayValue}
      </div>
      {/* Label */}
      <div
        className="font-semibold text-white text-sm text-center leading-tight"
        style={{ letterSpacing: '0.02em' }}
      >
        {stat.label}
      </div>
      {/* Sublabel */}
      <div className="text-xs text-center mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
        {stat.sublabel}
      </div>
    </div>
  );
}

export default function TrustBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      dir="rtl"
      className="relative overflow-hidden"
      style={{ background: '#070e1a' }}
      aria-label="נתוני DES"
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #1e90ff40, transparent)' }}
      />
      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #1e90ff30, transparent)' }}
      />

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="relative">
              {/* Vertical divider (except first in row) */}
              {i > 0 && (
                <div
                  className="absolute right-0 top-6 bottom-6 w-px"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                />
              )}
              <StatBlock stat={stat} active={active} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
