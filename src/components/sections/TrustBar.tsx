'use client';
import { useEffect, useRef, useState } from 'react';
import { ShimmerText } from '@/components/ui/ShimmerText';

interface Stat {
  value: string;
  numericEnd: number | null;
  suffix: string;
  label: string;
  sublabel: string;
}

const STATS: Stat[] = [
  {
    value: '10+',
    numericEnd: 10,
    suffix: '+',
    label: 'מותגים מובילים',
    sublabel: 'יבואן ומפיץ מורשה',
  },
  {
    value: '28',
    numericEnd: 28,
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
      {/* Big number / value */}
      <div
        className="font-black mb-1 tabular-nums"
        style={{
          fontSize: 'clamp(2rem, 4vw, 2.8rem)',
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}
        dir="ltr"
      >
        <span style={{ color: '#1e90ff' }}>{displayValue}</span>
      </div>

      {/* Label with shimmer sweep */}
      <div
        className="font-semibold text-sm text-center leading-tight"
        style={{ letterSpacing: '0.02em' }}
      >
        <ShimmerText shimmerColor="#ffffff" duration={3 + index * 0.5}>
          {stat.label}
        </ShimmerText>
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
      style={{ background: '#1a2b4a' }}
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
              {/* Vertical divider (except first) */}
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

        {/* ShimmerText divider line */}
        <div
          className="text-center pb-5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}
        >
          <ShimmerText shimmerColor="#1e90ff" duration={4} className="text-xs">
            ISO 9001 מוסמך &nbsp;&middot;&nbsp; רישיון אמ&quot;ר &nbsp;&middot;&nbsp; יבואן ומפיץ מורשה &nbsp;&middot;&nbsp; ניסיון של עשרות שנים
          </ShimmerText>
        </div>
      </div>
    </section>
  );
}
