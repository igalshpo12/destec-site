import Link from 'next/link';
import SpinTurbine360 from './SpinTurbine360';


/* ─── Metric card ─────────────────────────────────────────────────────────── */
function MetricCard({ metric, label }: { metric: string; label: string }) {
  return (
    <div
      className="text-center p-6 rounded-2xl"
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 12px rgba(26,43,74,0.07)',
      }}
    >
      <div
        className="font-black mb-1"
        style={{ color: '#1a2b4a', fontSize: 'clamp(2rem, 4vw, 2.8rem)', lineHeight: 1.1 }}
      >
        {metric}
      </div>
      <div className="text-sm font-medium" style={{ color: '#6b7280' }}>{label}</div>
    </div>
  );
}

/* ─── Process step ────────────────────────────────────────────────────────── */
function ProcessStep({
  number,
  label,
  isLast = false,
}: {
  number: string;
  label: string;
  isLast?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 flex-1 min-w-0">
      {/* Circle + number */}
      <div
        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm"
        style={{ background: '#1a2b4a', color: '#ffffff' }}
      >
        {number}
      </div>

      {/* Label */}
      <span className="font-semibold text-sm" style={{ color: '#1a2b4a', whiteSpace: 'nowrap' }}>
        {label}
      </span>

      {/* Connector arrow (hidden after last step) */}
      {!isLast && (
        <div className="hidden sm:flex flex-1 items-center justify-center px-2 min-w-0">
          <div className="flex-1 h-px" style={{ background: '#e2e8f0' }} />
          <span
            className="mx-1 flex-shrink-0"
            style={{ color: '#1e90ff', transform: 'scaleX(-1)', display: 'inline-block' }}
          >
            →
          </span>
        </div>
      )}
    </div>
  );
}

/* ─── Main section ────────────────────────────────────────────────────────── */
export default function WorkshopSection() {
  return (
    <section
      dir="rtl"
      className="relative overflow-hidden py-16 lg:py-24"
      style={{ background: '#f7f8fa' }}
      aria-label="מעבדת השירות של DES"
    >
      {/* Very subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(26,43,74,0.07) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">

        {/* ── Main grid: SVG left, content right ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-12 lg:gap-16 items-start">

          {/* SVG decorative column */}
          <div className="hidden lg:flex flex-col items-center justify-center pt-8">
            {/* Outer glow ring */}
            <div className="relative flex items-center justify-center">
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 280,
                  height: 280,
                  background: 'radial-gradient(circle, rgba(30,144,255,0.07) 0%, transparent 70%)',
                }}
              />
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 260,
                  height: 260,
                  border: '1px dashed rgba(30,144,255,0.12)',
                  animation: 'spinSlow 50s linear infinite',
                }}
              />
              <div className="relative z-10">
                <SpinTurbine360 />
              </div>
            </div>

            {/* Caption below illustration */}
            <p
              className="mt-6 text-center text-xs font-medium tracking-wider uppercase"
              style={{ color: '#9ba3af', letterSpacing: '0.15em' }}
            >
              גררו לסיבוב &middot; 360°
            </p>
          </div>

          {/* Content column */}
          <div className="flex flex-col justify-center">

            {/* Pre-heading */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 flex-shrink-0" style={{ background: '#1e90ff' }} />
              <span
                className="text-xs font-semibold tracking-[0.22em] uppercase"
                style={{ color: '#1e90ff' }}
              >
                שירות &middot; כיול &middot; אחריות
              </span>
            </div>

            {/* Headline */}
            <h2
              className="font-black leading-tight mb-3"
              style={{
                color: '#0d1929',
                fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
                letterSpacing: '-0.01em',
              }}
            >
              מעבדת השירות של DES
            </h2>

            {/* Sub */}
            <p
              className="font-semibold mb-8"
              style={{ color: '#4a5568', fontSize: '1.05rem' }}
            >
              תיקון, כיול ואחריות על כל ציוד — 30 שנות מקצועיות
            </p>

            {/* Three metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <MetricCard metric="30+" label="שנות ניסיון בתחזוקת ציוד" />
              <MetricCard metric="כל המותגים" label="NSK · W&H · KaVo · Nouvag · Bien-Air ועוד" />
              <MetricCard metric="48 ש'" label="זמן תגובה ממוצע לתיקון" />
            </div>

            {/* Process flow */}
            <div
              className="rounded-2xl p-6 mb-8"
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 12px rgba(26,43,74,0.06)',
              }}
            >
              <p
                className="text-xs font-semibold tracking-[0.20em] uppercase mb-5"
                style={{ color: '#9ba3af' }}
              >
                תהליך השירות
              </p>

              {/* Flex row — wraps on mobile */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0">
                <ProcessStep number="1" label="קבלת ציוד" />
                <ProcessStep number="2" label="אבחון ותיקון" />
                <ProcessStep number="3" label="בדיקה ואחריות" isLast />
              </div>
            </div>

            {/* CTA */}
            <div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: '#0d1929', color: '#ffffff' }}
              >
                צור קשר לשירות
                <span style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
