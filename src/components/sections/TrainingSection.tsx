import Link from 'next/link';
import Image from 'next/image';

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

          {/* ── Photo collage (renders right in RTL) ── */}
          <div className="order-1 lg:order-2 relative mx-auto w-full max-w-[480px] pb-16 pl-10">
            {/* Main photo — Michael lecturing at the projected exploded-view */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                aspectRatio: '7/6',
                border: '1px solid rgba(30,144,255,0.35)',
                boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)',
              }}
            >
              <Image
                src="/images/training/lecture-screen.webp"
                alt="מיכאל שפוליאנסקי מדגים תחזוקת טורבינה בהדרכה"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 480px"
              />
              {/* subtle navy tint so the photo sits in the section's palette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(13,25,41,0.35) 0%, transparent 45%)' }}
              />
              {/* caption chip */}
              <span
                className="absolute bottom-3 right-3 text-[11px] font-semibold px-3 py-1.5 rounded-full"
                style={{
                  background: 'rgba(13,25,41,0.72)',
                  color: 'rgba(255,255,255,0.85)',
                  border: '1px solid rgba(30,144,255,0.3)',
                  backdropFilter: 'blur(6px)',
                }}
              >
                הדרכה במעבדת DES
              </span>
            </div>

            {/* Secondary photo — offset, overlapping */}
            <div
              className="absolute bottom-0 left-0 w-[42%] rounded-xl overflow-hidden"
              style={{
                aspectRatio: '559/600',
                border: '1px solid rgba(30,144,255,0.45)',
                boxShadow: '0 18px 44px -14px rgba(0,0,0,0.7)',
                transform: 'rotate(-2deg)',
              }}
            >
              <Image
                src="/images/training/lecture-case.webp"
                alt="הדגמת ערכת מקדחים בהדרכה"
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>

            {/* Corner accent marks */}
            <div
              className="absolute -top-3 right-[-12px] w-8 h-8 pointer-events-none"
              style={{
                borderTop: '2px solid rgba(30,144,255,0.5)',
                borderRight: '2px solid rgba(30,144,255,0.5)',
                borderRadius: '0 8px 0 0',
              }}
            />
          </div>

          {/* ── Text + CTA (renders left in RTL) ── */}
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
              הדרכות תחזוקת ציוד — זה עלינו
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
              כחלק מהמעטפת שלנו, לקוחות DES מקבלים הדרכת תחזוקת ציוד חינמית אחת לשנה.
              הרופאים והצוותים לומדים כיצד לתחזק את הציוד ולמנוע תקלות עתידיות —
              ידע שנצבר לאורך שנים, שמועבר לכם במספר שעות.
            </p>

            {/* Feature bullets */}
            <ul className="space-y-3 mb-10">
              {[
                'הדרכה חינמית אחת לשנה ללקוחות DES',
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
