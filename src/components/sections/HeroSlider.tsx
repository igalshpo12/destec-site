'use client';

import Link from 'next/link';
import { GradientText } from '@/components/ui/GradientText';

/* ─── Animated SVG path data ────────────────────────────────────────────────
   30 bezier curves at low navy opacity, varying stroke widths.
   Each path drifts via CSS @keyframes — no framer-motion.
──────────────────────────────────────────────────────────────────────────── */
const PATHS = [
  { d: 'M-100 80 C 120 20, 300 160, 500 60 S 700 180, 900 80',       dur: 28, delay: 0,  w: 0.8, tx: 60,  ty: -20 },
  { d: 'M-60 200 C 80 120, 250 300, 450 180 S 680 320, 950 200',      dur: 35, delay: 3,  w: 1.2, tx: -40, ty: 30  },
  { d: 'M0 350 C 150 280, 320 420, 550 300 S 750 440, 980 350',       dur: 42, delay: 6,  w: 0.6, tx: 80,  ty: -15 },
  { d: 'M-80 500 C 100 430, 280 560, 500 460 S 700 580, 960 500',     dur: 38, delay: 1,  w: 1.5, tx: -50, ty: 25  },
  { d: 'M50 650 C 200 580, 380 710, 600 600 S 800 740, 1020 650',     dur: 50, delay: 8,  w: 0.5, tx: 70,  ty: -30 },
  { d: 'M-120 750 C 80 680, 260 800, 480 720 S 680 840, 940 750',     dur: 33, delay: 2,  w: 1.0, tx: -60, ty: 20  },
  { d: 'M30 850 C 180 780, 360 900, 580 820 S 780 940, 1050 850',     dur: 45, delay: 10, w: 0.7, tx: 50,  ty: -25 },
  { d: 'M-90 150 C 110 80, 290 220, 510 140 S 710 260, 970 150',      dur: 31, delay: 5,  w: 1.8, tx: -30, ty: 40  },
  { d: 'M20 420 C 170 350, 350 480, 560 390 S 760 520, 1000 420',     dur: 47, delay: 12, w: 0.9, tx: 90,  ty: -10 },
  { d: 'M-50 600 C 120 530, 300 660, 520 570 S 720 700, 990 600',     dur: 36, delay: 4,  w: 1.3, tx: -70, ty: 35  },
  { d: 'M70 100 C 220 30, 400 160, 620 80 S 820 200, 1080 100',       dur: 53, delay: 15, w: 0.4, tx: 40,  ty: -40 },
  { d: 'M-110 300 C 90 230, 270 360, 490 280 S 690 400, 950 300',     dur: 29, delay: 7,  w: 2.0, tx: -45, ty: 15  },
  { d: 'M40 450 C 190 380, 370 510, 590 430 S 790 560, 1060 450',     dur: 44, delay: 9,  w: 0.6, tx: 65,  ty: -20 },
  { d: 'M-70 700 C 100 630, 280 760, 500 680 S 700 800, 960 700',     dur: 60, delay: 18, w: 1.1, tx: -55, ty: 30  },
  { d: 'M10 250 C 160 180, 340 310, 560 230 S 760 360, 1030 250',     dur: 37, delay: 11, w: 0.8, tx: 75,  ty: -35 },
  { d: 'M-130 800 C 70 730, 250 860, 470 780 S 670 900, 930 800',     dur: 41, delay: 13, w: 1.6, tx: -35, ty: 45  },
  { d: 'M60 550 C 210 480, 390 610, 610 530 S 810 660, 1070 550',     dur: 25, delay: 20, w: 0.5, tx: 55,  ty: -15 },
  { d: 'M-40 380 C 110 310, 290 440, 510 360 S 710 490, 970 380',     dur: 56, delay: 2,  w: 1.4, tx: -65, ty: 20  },
  { d: 'M80 750 C 230 680, 410 810, 630 730 S 830 860, 1090 750',     dur: 32, delay: 16, w: 0.7, tx: 45,  ty: -30 },
  { d: 'M-100 500 C 100 430, 280 560, 500 460 S 700 580, 960 500',    dur: 48, delay: 6,  w: 1.9, tx: -80, ty: 25  },
  { d: 'M20 170 C 170 100, 350 230, 570 150 S 770 280, 1040 170',     dur: 39, delay: 14, w: 0.6, tx: 85,  ty: -45 },
  { d: 'M-60 620 C 100 550, 280 680, 500 600 S 700 720, 960 620',     dur: 27, delay: 19, w: 1.2, tx: -40, ty: 35  },
  { d: 'M50 320 C 200 250, 380 380, 600 300 S 800 430, 1060 320',     dur: 52, delay: 3,  w: 0.8, tx: 60,  ty: -20 },
  { d: 'M-90 720 C 80 650, 260 780, 480 700 S 680 820, 940 720',      dur: 34, delay: 17, w: 1.5, tx: -50, ty: 30  },
  { d: 'M30 400 C 180 330, 360 460, 580 380 S 780 510, 1050 400',     dur: 43, delay: 8,  w: 0.9, tx: 70,  ty: -25 },
  { d: 'M-120 200 C 60 130, 240 260, 460 180 S 660 300, 920 200',     dur: 30, delay: 21, w: 1.7, tx: -60, ty: 40  },
  { d: 'M70 870 C 220 800, 400 930, 620 850 S 820 970, 1080 870',     dur: 58, delay: 5,  w: 0.5, tx: 50,  ty: -35 },
  { d: 'M-50 470 C 120 400, 300 530, 520 450 S 720 580, 990 470',     dur: 46, delay: 11, w: 1.3, tx: -70, ty: 20  },
  { d: 'M40 680 C 190 610, 370 740, 590 660 S 790 790, 1060 680',     dur: 22, delay: 23, w: 0.6, tx: 80,  ty: -15 },
  { d: 'M-80 300 C 90 230, 270 360, 490 280 S 690 400, 950 300',      dur: 55, delay: 0,  w: 1.0, tx: -45, ty: 30  },
];

function FloatingPaths() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <style>{`
        ${PATHS.map((p, i) => `
          @keyframes pathDrift${i} {
            0%   { transform: translate(0px, 0px); opacity: ${0.06 + (i % 5) * 0.015}; }
            33%  { transform: translate(${p.tx * 0.5}px, ${p.ty * 0.5}px); opacity: ${0.04 + (i % 5) * 0.01}; }
            66%  { transform: translate(${p.tx}px, ${p.ty}px); opacity: ${0.08 + (i % 5) * 0.018}; }
            100% { transform: translate(0px, 0px); opacity: ${0.06 + (i % 5) * 0.015}; }
          }
        `).join('')}
      `}</style>
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 1000 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden="true"
      >
        {PATHS.map((p, i) => (
          <path
            key={i}
            d={p.d}
            stroke="#1a2b4a"
            strokeWidth={p.w}
            strokeOpacity={0.06 + (i % 8) * 0.01}
            strokeLinecap="round"
            fill="none"
            style={{
              animation: `pathDrift${i} ${p.dur}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ─── Letter-by-letter entrance animation ───────────────────────────────── */
function AnimatedLine({ text, baseDelay = 0 }: { text: string; baseDelay?: number }) {
  return (
    <>
      <style>{`
        @keyframes letterEntrance {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <span dir="rtl" className="block" aria-label={text}>
        {text.split('').map((char, i) => (
          <span
            key={i}
            aria-hidden="true"
            style={{
              display: 'inline',
              opacity: 0,
              animation: 'letterEntrance 0.5s ease forwards',
              animationDelay: `${(baseDelay + i) * 0.04}s`,
              whiteSpace: char === ' ' ? 'pre' : undefined,
            }}
          >
            {char === ' ' ? ' ' : char}
          </span>
        ))}
      </span>
    </>
  );
}

/* ─── Dental turbine SVG illustration (preserved from original) ─────────── */
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
        <linearGradient id="bodyGradH" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#2a2f3a" />
          <stop offset="20%"  stopColor="#5c6370" />
          <stop offset="40%"  stopColor="#9aa0aa" />
          <stop offset="55%"  stopColor="#c8ccd4" />
          <stop offset="70%"  stopColor="#9aa0aa" />
          <stop offset="85%"  stopColor="#4a5060" />
          <stop offset="100%" stopColor="#1e2230" />
        </linearGradient>
        <linearGradient id="headGradH" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#c0c8d8" />
          <stop offset="35%"  stopColor="#e8ecf4" />
          <stop offset="60%"  stopColor="#a0a8b8" />
          <stop offset="100%" stopColor="#606878" />
        </linearGradient>
        <linearGradient id="burGradH" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#d0d8e8" />
          <stop offset="50%"  stopColor="#a8b0c0" />
          <stop offset="100%" stopColor="#606878" />
        </linearGradient>
        <linearGradient id="ringGradH" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#1e90ff" stopOpacity="0.6" />
          <stop offset="50%"  stopColor="#1e90ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#1e90ff" stopOpacity="0.4" />
        </linearGradient>
        <filter id="glowH">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="softShadowH" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="4" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>

      <rect x="100" y="90" width="80" height="310" rx="40" fill="url(#bodyGradH)" filter="url(#softShadowH)" />
      <rect x="126" y="95" width="12" height="300" rx="6" fill="white" opacity="0.10" />
      {[190,200,210,220,230,240,250,260,270,280].map((y) => (
        <rect key={y} x="100" y={y} width="80" height="3" rx="1.5" fill="#1a1e28" opacity="0.2" />
      ))}
      <rect x="100" y="182" width="80" height="5" rx="2.5" fill="url(#ringGradH)" />
      <rect x="100" y="290" width="80" height="5" rx="2.5" fill="url(#ringGradH)" />

      <path d="M118 90 Q140 74 162 90" fill="url(#headGradH)" />
      <ellipse cx="140" cy="68" rx="34" ry="34" fill="url(#headGradH)" filter="url(#softShadowH)" />
      <ellipse cx="128" cy="56" rx="14" ry="10" fill="white" opacity="0.18" />
      <circle cx="140" cy="68" r="10" fill="#1a1e28" />
      <circle cx="140" cy="68" r="7"  fill="#0d1118" />
      <circle cx="137" cy="65" r="2.5" fill="#3a4050" />

      <rect x="133" y="34" width="14" height="8" rx="3" fill="#8890a0" />
      <rect x="136" y="6"  width="8"  height="30" rx="4" fill="url(#burGradH)" />
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

      <ellipse cx="140" cy="68" rx="40" ry="40" fill="#1e90ff" opacity="0.05" filter="url(#glowH)" />
      <rect x="170" y="100" width="3" height="280" rx="1.5" fill="white" opacity="0.03" />
    </svg>
  );
}

/* ─── Main hero (BackgroundPaths variant) ───────────────────────────────── */
export default function HeroSlider() {
  const LINE1 = 'מעבדת הציוד המקיפה'; // מעבדת הציוד המקיפה
  const LINE2 = 'של '; // של (with trailing space before DES)

  return (
    <section
      dir="rtl"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: '#ffffff' }}
      aria-label="Hero — DES ציוד דנטלי"
    >
      {/* ── Animated SVG paths background ── */}
      <FloatingPaths />

      {/* ── Subtle radial glow on right (where text sits) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 75% 40%, rgba(30,144,255,0.04) 0%, transparent 70%)',
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full py-24 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-center min-h-screen lg:min-h-0 lg:h-screen max-h-[900px]">

          {/* ── Text column (right side in RTL) ── */}
          <div className="flex flex-col justify-center pt-16 lg:pt-0">

            {/* Pre-heading badge */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="h-px flex-1 max-w-[48px]"
                style={{ background: 'linear-gradient(90deg, #1e90ff, transparent)' }}
              />
              <span
                className="text-xs font-semibold tracking-[0.25em] uppercase"
                style={{ color: '#1e90ff' }}
              >
                ISO 9001 &nbsp;&middot;&nbsp; {'אמי"ר'} &nbsp;&middot;&nbsp; {'משנת 1998'}
              </span>
            </div>

            {/* Main heading — two lines, no mid-word break */}
            <h1
              className="font-black leading-[1.15] mb-5"
              style={{
                fontSize: 'clamp(1.8rem, 5vw, 4.5rem)',
                color: '#1a2b4a',
              }}
            >
              <AnimatedLine text={LINE1} baseDelay={0} />
              {/* "של DES" must stay on one line — whitespace-nowrap prevents break */}
              <span dir="rtl" className="block whitespace-nowrap">
                {'של '.split('').map((char, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    style={{
                      display: 'inline',
                      opacity: 0,
                      animation: 'letterEntrance 0.5s ease forwards',
                      animationDelay: `${(LINE1.length + i) * 0.04}s`,
                      whiteSpace: char === ' ' ? 'pre' : undefined,
                    }}
                  >
                    {char}
                  </span>
                ))}
                <GradientText>DES</GradientText>
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="mb-8 leading-relaxed"
              style={{ color: '#6b7280', fontSize: '1.1rem', maxWidth: '36rem' }}
            >
              NSK &middot; W&amp;H &middot; KaVo &middot; Nouvag &middot; Bien-Air —{' '}
              {'יבואן מורשה ומפיץ רשמי מ-1998'}
            </p>

            {/* CTA row — stacked on mobile, side-by-side on sm+ */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href="/catalog"
                className="group relative inline-flex items-center gap-3 font-semibold px-8 py-4 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: '#1a2b4a', color: '#fff' }}
              >
                <span className="relative z-10">{'לקטלוג המוצרים'}</span>
                <span
                  className="relative z-10 text-lg font-light"
                  style={{ transform: 'scaleX(-1)', display: 'inline-block' }}
                >
                  →
                </span>
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(135deg, rgba(30,144,255,0.25) 0%, transparent 60%)' }}
                />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-3 font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  color: '#1a2b4a',
                  border: '1.5px solid #1a2b4a',
                  background: 'transparent',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = '#1a2b4a';
                  el.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'transparent';
                  el.style.color = '#1a2b4a';
                }}
              >
                {'צור קשר'}
              </Link>
            </div>

            {/* Trust line */}
            <p
              className="text-xs"
              style={{ color: '#9ba3af', letterSpacing: '0.05em' }}
            >
              ISO 9001 {'✓'} &nbsp;&middot;&nbsp; {'רישיון אמ"ר'} {'✓'} &nbsp;&middot;&nbsp; 9,000+ {'מוצרים'}
            </p>
          </div>

          {/* ── Product image column (left in RTL) — hidden on mobile ── */}
          <div className="hidden md:flex items-center justify-center relative">
            {/* Studio dark panel — gives the handpiece a dark backdrop so
                drop-shadow renders cinematic and the white of the product image
                dissolves naturally into the surrounding atmosphere */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 80% 90% at 50% 50%, #0d1929 0%, #0d1929 55%, rgba(13,25,41,0.6) 75%, transparent 100%)',
              }}
            />

            {/* Concentric orbit rings */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 460,
                height: 460,
                border: '1px solid rgba(30,144,255,0.10)',
                animation: 'spinSlow 60s linear infinite',
              }}
            />
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 340,
                height: 340,
                border: '1px dashed rgba(30,144,255,0.08)',
                animation: 'spinSlow 40s linear infinite reverse',
              }}
            />

            {/* Blue accent glow at centre */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 220,
                height: 220,
                background: 'radial-gradient(circle, rgba(30,144,255,0.18) 0%, transparent 70%)',
              }}
            />

            {/* The handpiece — floats against the dark radial zone */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/suppliers/wh/product.jpg"
              alt="W&H Synea Vision TK-97L — distributed by DES"
              style={{
                position: 'relative',
                zIndex: 10,
                height: 420,
                width: 'auto',
                maxWidth: '100%',
                objectFit: 'contain',
                /* multiply dissolves the white background of the jpg into the
                   dark radial panel behind it, leaving the handpiece floating */
                mixBlendMode: 'multiply',
                animation: 'floatY 6s ease-in-out infinite',
                transform: 'rotate(8deg)',
                filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.55)) drop-shadow(0 0 24px rgba(30,144,255,0.18))',
              }}
            />

            {/* Ground reflection */}
            <div
              className="absolute pointer-events-none"
              style={{
                bottom: 30,
                width: 110,
                height: 16,
                borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(30,144,255,0.20) 0%, transparent 70%)',
                filter: 'blur(10px)',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
