import Link from 'next/link';

export default function TrainingSection() {
  return (
    <section
      dir="rtl"
      className="relative overflow-hidden py-16 lg:py-24"
      style={{ background: '#0d1929' }}
      aria-label="הדרכות תחזוקת ציוד"
    >
      {/* Subtle cross-hatch pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(30,144,255,0.04) 39px, rgba(30,144,255,0.04) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(30,144,255,0.04) 39px, rgba(30,144,255,0.04) 40px)',
        }}
      />

      {/* Blue radial glow — top right */}
      <div
        className="absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 20% 20%, rgba(30,144,255,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── Photo placeholder (right column in RTL → renders right on screen) ── */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-start">
            {/*
              PHOTO SLOT — replace the inner content with:
              <img src="/images/michael-shapoliansky-lecture.jpg" alt="מיכאל שפוליאנסקי בהרצאה" ... />
              Keep the outer frame div intact.
            */}
            <div
              className="relative w-full max-w-[340px] mx-auto"
              style={{ aspectRatio: '2/3' }}
              aria-label="מקום לתמונת מיכאל שפוליאנסקי"
            >
              {/* Frame border with thin blue accent */}
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(30,144,255,0.25) 0%, rgba(13,25,41,0.8) 100%)',
                  border: '1px solid rgba(30,144,255,0.25)',
                }}
              />

              {/* Inner dark field — the placeholder */}
              <div
                className="absolute inset-[3px] rounded-2xl flex flex-col items-center justify-center gap-4"
                style={{ background: 'rgba(10,18,32,0.85)' }}
              >
                {/* Camera icon */}
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(30,144,255,0.45)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>

                {/* Placeholder caption */}
                <p
                  className="text-center px-6 leading-snug"
                  style={{
                    color: 'rgba(30,144,255,0.55)',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    letterSpacing: '0.03em',
                  }}
                >
                  תמונה: מיכאל שפוליאנסקי בהרצאה
                </p>

                {/* Thin horizontal rule */}
                <div
                  className="w-12"
                  style={{ height: '1px', background: 'rgba(30,144,255,0.18)' }}
                />

                {/* Corner accent marks */}
                <div
                  className="absolute top-4 right-4 w-5 h-5"
                  style={{
                    borderTop: '2px solid rgba(30,144,255,0.40)',
                    borderRight: '2px solid rgba(30,144,255,0.40)',
                    borderRadius: '0 4px 0 0',
                  }}
                />
                <div
                  className="absolute bottom-4 left-4 w-5 h-5"
                  style={{
                    borderBottom: '2px solid rgba(30,144,255,0.40)',
                    borderLeft: '2px solid rgba(30,144,255,0.40)',
                    borderRadius: '0 0 0 4px',
                  }}
                />
              </div>
            </div>
          </div>

          {/* ── Text + CTA (left column in RTL → renders left on screen) ── */}
          <div className="order-2 lg:order-1 flex flex-col justify-center">

            {/* Thin accent line + label */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="h-px w-10 flex-shrink-0"
                style={{ background: '#1e90ff' }}
              />
              <span
                className="text-xs font-semibold tracking-[0.22em] uppercase"
                style={{ color: '#1e90ff' }}
              >
                מומחיות &middot; הכשרה &middot; תחזוקה
              </span>
            </div>

            {/* Main headline */}
            <h2
              className="font-black leading-tight mb-3"
              style={{
                color: '#ffffff',
                fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
                letterSpacing: '-0.01em',
              }}
            >
              הדרכות תחזוקת ציוד
            </h2>

            {/* Sub-headline */}
            <p
              className="font-semibold mb-5"
              style={{ color: '#1e90ff', fontSize: '1.05rem' }}
            >
              מיכאל שפוליאנסקי — 25+ שנות ניסיון
            </p>

            {/* Body copy */}
            <p
              className="leading-relaxed mb-8"
              style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', maxWidth: '440px' }}
            >
              DES מציעה הדרכות מקצועיות לצוות רפואי בנושאי תחזוקה, שימוש נכון וכיול ציוד.
              ההדרכות מותאמות לקליניקות, בתי חולים ומרפאות שיניים.
            </p>

            {/* Feature bullets */}
            <ul className="space-y-3 mb-10">
              {[
                'הדרכות בהתאמה אישית לכל מכשיר',
                'תיעוד ואישורי השתתפות',
                'מרצה מוסמך עם ניסיון קליני',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(30,144,255,0.15)', border: '1px solid rgba(30,144,255,0.30)' }}
                    aria-hidden="true"
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5.5L4 7.5L8 3" stroke="#1e90ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.92rem' }}>{item}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: '#1e90ff', color: '#ffffff' }}
              >
                לפרטים ורישום
                <span style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
