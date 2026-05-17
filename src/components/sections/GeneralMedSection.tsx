'use client';
import Link from 'next/link';

const CARDS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    title: 'ציוד כירורגי',
    body: 'מנועי ניתוח Nouvag ו-NSK לפרוצדורות מדויקות — הספק גבוה, רעש מינימלי, אמינות קלינית.',
    tag: 'Nouvag · NSK',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: 'אלקטרוכירורגיה',
    body: 'מכשירי SURTRON לרקמות רכות — ביפולרי ומונופולרי, בקרה דיגיטלית, בטיחות מרבית.',
    tag: 'SURTRON',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
        <path d="M15.54 8.46a5 5 0 010 7.07M8.46 8.46a5 5 0 000 7.07" />
      </svg>
    ),
    title: 'ציוד אורטופדי',
    body: 'מקדחים ומנועים לכירורגיה אורטופדית — מומנט גבוה, שליטה מדויקת, הסמכות CE.',
    tag: 'NSK · Nouvag',
  },
];

export default function GeneralMedSection() {
  return (
    <section
      dir="rtl"
      className="relative overflow-hidden py-16 lg:py-24"
      aria-label="גם ברפואה כללית"
      style={{ background: '#0a1120' }}
    >
      {/* Background image with heavy dark overlay */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/categories/surgery.jpg"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: 0.18,
          zIndex: 0,
        }}
      />

      {/* Dark overlay — ensures readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(10,17,32,0.82) 0%, rgba(10,17,32,0.90) 60%, rgba(10,17,32,0.96) 100%)',
          zIndex: 1,
        }}
      />

      {/* Subtle cross (+) pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(30,144,255,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">

        {/* Header */}
        <div className="mb-12 lg:mb-16">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10 flex-shrink-0" style={{ background: '#1e90ff' }} />
            <span
              className="text-xs font-semibold tracking-[0.22em] uppercase"
              style={{ color: '#1e90ff' }}
            >
              ציוד רפואי &middot; בתי חולים &middot; מרפאות
            </span>
          </div>

          <h2
            className="font-black leading-tight mb-4"
            style={{
              color: '#ffffff',
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              letterSpacing: '-0.01em',
            }}
          >
            גם ברפואה כללית
          </h2>

          <p
            style={{
              color: 'rgba(255,255,255,0.60)',
              fontSize: '1.05rem',
              maxWidth: '520px',
              lineHeight: 1.65,
            }}
          >
            ציוד כירורגי ורפואי מהמותגים המובילים — כולל Nouvag, NSK ו-SURTRON,
            מוסמך CE ובתוקף רישיון אמ&quot;ר ממשרד הבריאות.
          </p>
        </div>

        {/* Three feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="group relative flex flex-col gap-4 p-7 rounded-2xl transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(30,144,255,0.08)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(30,144,255,0.30)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'rgba(30,144,255,0.12)',
                  color: '#1e90ff',
                  border: '1px solid rgba(30,144,255,0.20)',
                }}
              >
                {card.icon}
              </div>

              {/* Tag pill */}
              <span
                className="self-start text-xs font-bold px-2.5 py-1 rounded-md"
                style={{
                  background: 'rgba(30,144,255,0.15)',
                  color: '#1e90ff',
                  letterSpacing: '0.06em',
                }}
              >
                {card.tag}
              </span>

              {/* Text */}
              <div>
                <h3
                  className="font-black mb-2"
                  style={{ color: '#ffffff', fontSize: '1.15rem' }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.58)',
                    fontSize: '0.9rem',
                    lineHeight: 1.65,
                  }}
                >
                  {card.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-wrap gap-4 items-center">
          <Link
            href="/catalog?category=surgery"
            className="inline-flex items-center gap-3 font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: '#1e90ff', color: '#ffffff' }}
          >
            לציוד רפואי
            <span style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>→</span>
          </Link>

          {/* Inline trust note */}
          <span
            className="text-sm"
            style={{ color: 'rgba(255,255,255,0.40)', letterSpacing: '0.03em' }}
          >
            משלוח לכל בתי החולים בישראל &middot; שירות ואחריות מובטחים
          </span>
        </div>
      </div>
    </section>
  );
}
