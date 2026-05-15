'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

/* ─── Animated dental turbine SVG ──────────────────────────────────────── */
function TurbineIllustration() {
  return (
    <svg
      viewBox="0 0 280 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full max-w-[260px] mx-auto drop-shadow-2xl"
      aria-hidden="true"
    >
      <defs>
        {/* Metallic body gradient */}
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2a2f3a" />
          <stop offset="20%" stopColor="#5c6370" />
          <stop offset="40%" stopColor="#9aa0aa" />
          <stop offset="55%" stopColor="#c8ccd4" />
          <stop offset="70%" stopColor="#9aa0aa" />
          <stop offset="85%" stopColor="#4a5060" />
          <stop offset="100%" stopColor="#1e2230" />
        </linearGradient>
        {/* Head chrome gradient */}
        <linearGradient id="headGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c0c8d8" />
          <stop offset="35%" stopColor="#e8ecf4" />
          <stop offset="60%" stopColor="#a0a8b8" />
          <stop offset="100%" stopColor="#606878" />
        </linearGradient>
        {/* Bur gradient */}
        <linearGradient id="burGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d0d8e8" />
          <stop offset="50%" stopColor="#a8b0c0" />
          <stop offset="100%" stopColor="#606878" />
        </linearGradient>
        {/* Grip ring gradient */}
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e90ff" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#1e90ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#1e90ff" stopOpacity="0.4" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="4" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* ── Handpiece body (long cylinder) ── */}
      {/* Main shaft */}
      <rect x="100" y="90" width="80" height="310" rx="40" fill="url(#bodyGrad)" filter="url(#softShadow)" />
      {/* Highlight stripe */}
      <rect x="126" y="95" width="12" height="300" rx="6" fill="white" opacity="0.12" />
      {/* Texture rings — grip zone */}
      {[190, 200, 210, 220, 230, 240, 250, 260, 270, 280].map((y) => (
        <rect key={y} x="100" y={y} width="80" height="3" rx="1.5" fill="#1a1e28" opacity="0.25" />
      ))}
      {/* Blue accent ring at top of grip */}
      <rect x="100" y="182" width="80" height="5" rx="2.5" fill="url(#ringGrad)" />
      {/* Blue accent ring at bottom of grip */}
      <rect x="100" y="290" width="80" height="5" rx="2.5" fill="url(#ringGrad)" />

      {/* ── Turbine head ── */}
      {/* Neck taper */}
      <path d="M118 90 Q140 74 162 90" fill="url(#headGrad)" />
      {/* Head housing */}
      <ellipse cx="140" cy="68" rx="34" ry="34" fill="url(#headGrad)" filter="url(#softShadow)" />
      {/* Head highlight */}
      <ellipse cx="128" cy="56" rx="14" ry="10" fill="white" opacity="0.2" />
      {/* Head center hole */}
      <circle cx="140" cy="68" r="10" fill="#1a1e28" />
      <circle cx="140" cy="68" r="7" fill="#0d1118" />
      <circle cx="137" cy="65" r="2.5" fill="#3a4050" />

      {/* ── Bur (drill bit) ── */}
      {/* Collar */}
      <rect x="133" y="34" width="14" height="8" rx="3" fill="#8890a0" />
      {/* Shank */}
      <rect x="136" y="6" width="8" height="30" rx="4" fill="url(#burGrad)" />
      {/* Cutting flutes */}
      <rect x="136.5" y="6" width="1.5" height="28" rx="0.5" fill="white" opacity="0.3" />
      <rect x="139" y="6" width="1.5" height="28" rx="0.5" fill="#606878" opacity="0.4" />
      {/* Bur tip */}
      <ellipse cx="140" cy="6" rx="4" ry="3" fill="#c0c8d8" />

      {/* ── Connector end ── */}
      <rect x="108" y="390" width="64" height="16" rx="8" fill="#2a3040" />
      <rect x="114" y="406" width="52" height="10" rx="5" fill="#1a2030" />
      {/* Connector pins */}
      {[124, 132, 140, 148, 156].map((x) => (
        <circle key={x} cx={x} cy="411" r="2.5" fill="#4a5060" />
      ))}

      {/* ── Tubing connector ── */}
      <path d="M140 416 Q140 450 120 470 Q105 485 105 500" stroke="#3a4050" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M140 416 Q140 450 120 470 Q105 485 105 500" stroke="#5a6070" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Tube highlight */}
      <path d="M140 416 Q140 450 122 469 Q108 483 108 497" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.15" />

      {/* ── Glow effects ── */}
      {/* Blue LED glow from head */}
      <ellipse cx="140" cy="68" rx="40" ry="40" fill="#1e90ff" opacity="0.06" filter="url(#glow)" />
      {/* Subtle reflection on shaft */}
      <rect x="170" y="100" width="3" height="280" rx="1.5" fill="white" opacity="0.04" />
    </svg>
  );
}

/* ─── Scroll indicator ──────────────────────────────────────────────────── */
function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
      <span className="text-xs tracking-[0.2em] uppercase font-light" style={{ fontSize: '10px' }}>
        גלול
      </span>
      <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent relative overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full bg-white/70 rounded-full"
          style={{
            height: '40%',
            animation: 'scrollDrop 1.8s cubic-bezier(0.25,0.46,0.45,0.94) infinite',
          }}
        />
      </div>
    </div>
  );
}

/* ─── Main Hero ─────────────────────────────────────────────────────────── */
export default function HeroSlider() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Entrance animation
    const el = headingRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  }, []);

  return (
    <section
      dir="rtl"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: '#0d1929' }}
      aria-label="Hero — DES ציוד דנטלי"
    >
      {/* ── Subtle grid texture ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(30,144,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30,144,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Radial glow — top right ── */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top right, rgba(30,144,255,0.12) 0%, transparent 65%)',
        }}
      />
      {/* ── Radial glow — bottom left ── */}
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at bottom left, rgba(30,144,255,0.07) 0%, transparent 65%)',
        }}
      />

      {/* ── Thin accent line ── */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #1e90ff, transparent)' }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full py-24 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-center min-h-screen lg:min-h-0 lg:h-screen max-h-[900px]">

          {/* ── Text column ── */}
          <div className="flex flex-col justify-center pt-12 lg:pt-0">
            {/* Pre-heading badge */}
            <div className="flex items-center gap-3 mb-8">
              <div
                className="h-px flex-1 max-w-[48px]"
                style={{ background: 'linear-gradient(90deg, transparent, #1e90ff)' }}
              />
              <span
                className="text-xs font-semibold tracking-[0.25em] uppercase"
                style={{ color: '#1e90ff' }}
              >
                ISO 9001 &nbsp;·&nbsp; אמ&quot;ר &nbsp;·&nbsp; משנת 1998
              </span>
            </div>

            {/* Main heading */}
            <h1
              ref={headingRef}
              className="font-black text-white leading-[1.1] mb-6"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)' }}
            >
              ציוד דנטלי
              <br />
              <span style={{ color: '#1e90ff' }}>מהמותגים</span>
              <br />
              המובילים בעולם
            </h1>

            {/* Supplier names */}
            <p
              className="font-semibold tracking-[0.12em] mb-8"
              style={{
                color: '#1e90ff',
                fontSize: '0.78rem',
                opacity: 0.85,
                letterSpacing: '0.15em',
              }}
            >
              NSK &nbsp;·&nbsp; W&amp;H &nbsp;·&nbsp; KaVo &nbsp;·&nbsp; Nouvag &nbsp;·&nbsp; Bien-Air
            </p>

            {/* Body copy */}
            <p
              className="text-lg leading-relaxed mb-10 max-w-lg"
              style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 300 }}
            >
              יבואן מורשה ומפיץ רשמי לישראל.
              מעל 9,000 מוצרים במלאי מיידי — לקליניקות, בתי חולים ומרפאות שיניים.
            </p>

            {/* CTA row */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/catalog"
                className="group relative inline-flex items-center gap-3 font-semibold px-8 py-4 rounded-xl overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: '#1e90ff', color: '#fff' }}
              >
                <span className="relative z-10">לקטלוג המוצרים</span>
                <span
                  className="relative z-10 text-lg font-light"
                  style={{ transform: 'scaleX(-1)', display: 'inline-block' }}
                >
                  →
                </span>
                {/* Hover shimmer */}
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)' }}
                />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-3 font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                style={{
                  color: '#fff',
                  border: '1.5px solid rgba(255,255,255,0.3)',
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(4px)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.6)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                }}
              >
                צור קשר
              </Link>
            </div>

            {/* Bottom trust micro-line */}
            <div
              className="flex items-center gap-6 mt-12 pt-8"
              style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
            >
              {[
                { num: '9,000+', label: 'מוצרים' },
                { num: '27', label: 'שנות ניסיון' },
                { num: '5', label: 'ספקים עולמיים' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-black text-white" style={{ fontSize: '1.4rem', lineHeight: 1 }}>
                    {s.num}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Illustration column ── */}
          <div className="hidden lg:flex items-center justify-center relative">
            {/* Circular glow backdrop */}
            <div
              className="absolute inset-0 m-auto w-[380px] h-[380px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(30,144,255,0.08) 0%, transparent 70%)',
              }}
            />
            {/* Rotating ring */}
            <div
              className="absolute w-[320px] h-[320px] rounded-full"
              style={{
                border: '1px solid rgba(30,144,255,0.15)',
                animation: 'spinSlow 18s linear infinite',
              }}
            />
            <div
              className="absolute w-[400px] h-[400px] rounded-full"
              style={{
                border: '1px dashed rgba(30,144,255,0.08)',
                animation: 'spinSlow 30s linear infinite reverse',
              }}
            />
            {/* The turbine */}
            <div
              className="relative z-10 w-[200px] h-[400px]"
              style={{ animation: 'floatY 4s ease-in-out infinite' }}
            >
              <TurbineIllustration />
            </div>
            {/* Reflection */}
            <div
              className="absolute bottom-12 w-[80px] h-[16px] rounded-full"
              style={{
                background: 'radial-gradient(ellipse, rgba(30,144,255,0.25) 0%, transparent 70%)',
                filter: 'blur(6px)',
              }}
            />
          </div>
        </div>
      </div>

      <ScrollIndicator />

    </section>
  );
}
