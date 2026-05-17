import Link from 'next/link';

/* ─── Turbine SVG (precision tool decorative) ── copied from HeroSlider ── */
function TurbineIllustration() {
  return (
    <svg
      viewBox="0 0 280 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full max-w-[200px] mx-auto"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="wsBodyGradH" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#2a2f3a" />
          <stop offset="20%"  stopColor="#5c6370" />
          <stop offset="40%"  stopColor="#9aa0aa" />
          <stop offset="55%"  stopColor="#c8ccd4" />
          <stop offset="70%"  stopColor="#9aa0aa" />
          <stop offset="85%"  stopColor="#4a5060" />
          <stop offset="100%" stopColor="#1e2230" />
        </linearGradient>
        <linearGradient id="wsHeadGradH" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#c0c8d8" />
          <stop offset="35%"  stopColor="#e8ecf4" />
          <stop offset="60%"  stopColor="#a0a8b8" />
          <stop offset="100%" stopColor="#606878" />
        </linearGradient>
        <linearGradient id="wsBurGradH" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#d0d8e8" />
          <stop offset="50%"  stopColor="#a8b0c0" />
          <stop offset="100%" stopColor="#606878" />
        </linearGradient>
        <linearGradient id="wsRingGradH" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#1e90ff" stopOpacity="0.6" />
          <stop offset="50%"  stopColor="#1e90ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#1e90ff" stopOpacity="0.4" />
        </linearGradient>
        <filter id="wsGlowH">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="wsSoftShadowH" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="4" dy="4" stdDeviation="8" floodColor="#1a2b4a" floodOpacity="0.20" />
        </filter>
      </defs>

      <rect x="100" y="90" width="80" height="310" rx="40" fill="url(#wsBodyGradH)" filter="url(#wsSoftShadowH)" />
      <rect x="126" y="95" width="12" height="300" rx="6" fill="white" opacity="0.10" />
      {[190,200,210,220,230,240,250,260,270,280].map((y) => (
        <rect key={y} x="100" y={y} width="80" height="3" rx="1.5" fill="#1a2b4a" opacity="0.15" />
      ))}
      <rect x="100" y="182" width="80" height="5" rx="2.5" fill="url(#wsRingGradH)" />
      <rect x="100" y="290" width="80" height="5" rx="2.5" fill="url(#wsRingGradH)" />

      <path d="M118 90 Q140 74 162 90" fill="url(#wsHeadGradH)" />
      <ellipse cx="140" cy="68" rx="34" ry="34" fill="url(#wsHeadGradH)" filter="url(#wsSoftShadowH)" />
      <ellipse cx="128" cy="56" rx="14" ry="10" fill="white" opacity="0.18" />
      <circle cx="140" cy="68" r="10" fill="#1a2b4a" />
      <circle cx="140" cy="68" r="7"  fill="#0d1929" />
      <circle cx="137" cy="65" r="2.5" fill="#3a4050" />

      <rect x="133" y="34" width="14" height="8" rx="3" fill="#8890a0" />
      <rect x="136" y="6"  width="8"  height="30" rx="4" fill="url(#wsBurGradH)" />
      <rect x="136.5" y="6" width="1.5" height="28" rx="0.5" fill="white" opacity="0.28" />
      <rect x="139"   y="6" width="1.5" height="28" rx="0.5" fill="#606878" opacity="0.35" />
      <ellipse cx="140" cy="6" rx="4" ry="3" fill="#c0c8d8" />

      <rect x="108" y="390" width="64" height="16" rx="8"  fill="#2a3040" />
      <rect x="114" y="406" width="52" height="10" rx="5"  fill="#1a2030" />
      {[124,132,140,148,156].map((x) => (
        <circle key={x} cx={x} cy="411" r="2.5" fill="#4a5060" />
      ))}

      <path d="M140 416 Q140 450 120 470 Q105 485 105 500"
            stroke="#3a4050" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M140 416 Q140 450 120 470 Q105 485 105 500"
            stroke="#5a6070" strokeWidth="4"  strokeLinecap="round" fill="none" />
      <path d="M140 416 Q140 450 122 469 Q108 483 108 497"
            stroke="white"   strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.12" />

      <ellipse cx="140" cy="68" rx="40" ry="40" fill="#1e90ff" opacity="0.04" filter="url(#wsGlowH)" />
    </svg>
  );
}

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
              <div className="relative z-10" style={{ height: 320 }}>
                <TurbineIllustration />
              </div>
            </div>

            {/* Caption below illustration */}
            <p
              className="mt-6 text-center text-xs font-medium tracking-wider uppercase"
              style={{ color: '#9ba3af', letterSpacing: '0.15em' }}
            >
              כל מותג &middot; כל מכשיר
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
