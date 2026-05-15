'use client';

interface Supplier {
  name: string;
  country: string;
  color: string;
  initials: string;
  desc: string;
}

const SUPPLIERS: Supplier[] = [
  { name: 'NSK',              country: 'Japan',       color: '#c0392b', initials: 'NSK',  desc: 'Handpieces' },
  { name: 'W&H',              country: 'Austria',     color: '#1e3a6e', initials: 'W&H',  desc: 'Dental Units' },
  { name: 'KaVo',             country: 'Germany',     color: '#005baa', initials: 'KaVo', desc: 'Systems' },
  { name: 'MK-dent',          country: 'Germany',     color: '#d35400', initials: 'MK',   desc: 'Instruments' },
  { name: 'Nouvag',           country: 'Switzerland', color: '#27ae60', initials: 'NVG',  desc: 'Motors' },
  { name: 'Bien-Air',         country: 'Switzerland', color: '#2c3e50', initials: 'BA',   desc: 'Micro-motors' },
  { name: 'Anthogyr',         country: 'France',      color: '#8e44ad', initials: 'ANT',  desc: 'Implants' },
  { name: 'Dentsply Sirona',  country: 'USA/Germany', color: '#00589b', initials: 'DS',   desc: 'Full Systems' },
  { name: 'JINME',            country: 'China',       color: '#c0392b', initials: 'JME',  desc: 'Instruments' },
];

export default function SupplierLogoStrip() {
  return (
    <section
      dir="rtl"
      style={{ background: '#0d1929' }}
      className="relative overflow-hidden py-16"
      aria-label="הספקים שלנו"
    >
      {/* Subtle top line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(30,144,255,0.3), transparent)' }}
      />

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
            className="font-black text-white"
            style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}
          >
            מותגים עולמיים. ייצוג ישראלי מורשה.
          </h2>
          <p
            className="text-sm mt-3 max-w-lg mx-auto"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            DES הינו יבואן מורשה ומפיץ רשמי של כל המותגים הבאים בישראל
          </p>
        </div>

        {/* Supplier grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3">
          {SUPPLIERS.map((s) => (
            <div
              key={s.name}
              className="group flex flex-col items-center p-4 rounded-xl cursor-default transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = `${s.color}12`;
                el.style.borderColor = `${s.color}40`;
                el.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(255,255,255,0.04)';
                el.style.borderColor = 'rgba(255,255,255,0.07)';
                el.style.transform = '';
              }}
            >
              {/* Logo circle */}
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center font-black text-xs mb-2 transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: s.initials.length > 3 ? '0.5rem' : '0.65rem',
                  letterSpacing: '-0.02em',
                  filter: 'grayscale(1)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = s.color;
                  el.style.color = '#fff';
                  el.style.filter = 'grayscale(0)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'rgba(255,255,255,0.07)';
                  el.style.color = 'rgba(255,255,255,0.4)';
                  el.style.filter = 'grayscale(1)';
                }}
              >
                {s.initials}
              </div>

              {/* Name */}
              <span
                className="text-xs font-semibold text-center leading-tight transition-colors duration-300"
                style={{ color: 'rgba(255,255,255,0.5)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
              >
                {s.name}
              </span>

              {/* Country */}
              <span
                className="text-xs mt-0.5 text-center"
                style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.6rem' }}
              >
                {s.country}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p
          className="text-center text-xs mt-10"
          style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.04em' }}
        >
          כל הסחורה מיובאת ישירות מהיצרן · אחריות מלאה · תמיכה טכנית
        </p>
      </div>
    </section>
  );
}
