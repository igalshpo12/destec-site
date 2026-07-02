import Link from 'next/link';
import Image from 'next/image';
import { Wrench, Clock, ShieldCheck } from 'lucide-react';

/* ─── Metric card ─────────────────────────────────────────────────────────── */
function MetricCard({
  icon,
  metric,
  label,
}: {
  icon: React.ReactNode;
  metric: string;
  label: string;
}) {
  return (
    <div
      className="p-5 rounded-2xl"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(94,178,255,0.16)',
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
        style={{ background: 'rgba(30,144,255,0.14)', border: '1px solid rgba(30,144,255,0.3)' }}
      >
        {icon}
      </div>
      <div
        className="font-black mb-1"
        style={{
          fontSize: 'clamp(1.5rem, 2.6vw, 2rem)',
          lineHeight: 1.1,
          background: 'linear-gradient(180deg, #ffffff 0%, #9ec8f5 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {metric}
      </div>
      <div className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
        {label}
      </div>
    </div>
  );
}

/* ─── Process step ────────────────────────────────────────────────────────── */
const STEPS = [
  { n: '1', title: 'קבלת ציוד', desc: 'איסוף מהמרפאה או משלוח למעבדה' },
  { n: '2', title: 'אבחון ותיקון', desc: 'אבחון תחת מיקרוסקופ וחלפים מקוריים' },
  { n: '3', title: 'בדיקה ואחריות', desc: 'בדיקת ביצועים מלאה ואחריות על התיקון' },
];

/* ─── Main section ────────────────────────────────────────────────────────── */
export default function WorkshopSection() {
  return (
    <section
      dir="rtl"
      className="relative overflow-hidden py-16 lg:py-24"
      style={{ background: '#0a1626' }}
      aria-label="מעבדת השירות של DES"
    >
      {/* hairlines */}
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(30,140,212,0.45),transparent)' }} />
      <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(30,140,212,0.3),transparent)' }} />
      {/* blue glow */}
      <div
        className="absolute -top-32 right-0 w-[560px] h-[560px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(30,144,255,0.09) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-12 lg:gap-16 items-center">

          {/* ── Media column: workshop photo + video slot ── */}
          <div className="relative order-2 lg:order-1">
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                aspectRatio: '16/9',
                border: '1px solid rgba(94,178,255,0.25)',
                boxShadow: '0 30px 70px -25px rgba(0,0,0,0.7)',
              }}
            >
              <video
                className="absolute inset-0 w-full h-full object-cover"
                src="/videos/repair-explainer.mp4"
                poster="/videos/repair-explainer-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                aria-label="תהליך התיקון במעבדת השירות של DES — קבלה, אבחון תחת מיקרוסקופ, בדיקה והחזרה"
              />
              <span
                className="absolute top-4 right-4 text-[11px] font-semibold px-3 py-1.5 rounded-full"
                style={{
                  background: 'rgba(10,22,38,0.75)',
                  color: 'rgba(255,255,255,0.85)',
                  border: '1px solid rgba(94,178,255,0.3)',
                  backdropFilter: 'blur(6px)',
                }}
              >
                כך אנחנו מתקנים · המעבדה שלנו
              </span>
            </div>

            {/* Workshop still — small companion card */}
            <div
              className="absolute -bottom-8 left-2 hidden sm:block w-[38%] rounded-2xl overflow-hidden"
              style={{
                aspectRatio: '4/3',
                border: '1px solid rgba(94,178,255,0.35)',
                boxShadow: '0 18px 44px -14px rgba(0,0,0,0.8)',
                transform: 'rotate(-2deg)',
              }}
            >
              <Image
                src="/images/workshop-bench.webp"
                alt="שולחן עבודה במעבדת השירות — טורבינה מפורקת וכלי דיוק"
                fill
                className="object-cover"
                sizes="240px"
              />
            </div>
          </div>

          {/* ── Content column ── */}
          <div className="order-1 lg:order-2 flex flex-col justify-center">

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
                color: '#ffffff',
                fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
                letterSpacing: '-0.01em',
              }}
            >
              מעבדת השירות של DES
            </h2>

            {/* Sub */}
            <p
              className="font-semibold mb-8"
              style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem' }}
            >
              תיקון, כיול ואחריות על כל ציוד — 30 שנות מקצועיות
            </p>

            {/* Metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8">
              <MetricCard
                icon={<Wrench className="w-4.5 h-4.5" style={{ color: '#5eb2ff' }} />}
                metric="30+"
                label="שנות ניסיון בתחזוקת ציוד"
              />
              <MetricCard
                icon={<ShieldCheck className="w-4.5 h-4.5" style={{ color: '#5eb2ff' }} />}
                metric="כל המותגים"
                label="NSK · W&H · KaVo · Nouvag · Bien-Air ועוד"
              />
              <MetricCard
                icon={<Clock className="w-4.5 h-4.5" style={{ color: '#5eb2ff' }} />}
                metric="48 ש׳"
                label="זמן תגובה ממוצע לתיקון"
              />
            </div>

            {/* Process timeline */}
            <div
              className="rounded-2xl p-6 mb-8"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(94,178,255,0.14)' }}
            >
              <p
                className="text-xs font-semibold tracking-[0.20em] uppercase mb-5"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                תהליך השירות
              </p>
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-4">
                {STEPS.map((s, i) => (
                  <div key={s.n} className="flex-1 flex items-start gap-3">
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-black text-sm"
                      style={{
                        background: i === 0 ? '#1e90ff' : 'rgba(30,144,255,0.15)',
                        color: i === 0 ? '#fff' : '#5eb2ff',
                        border: '1px solid rgba(30,144,255,0.4)',
                      }}
                    >
                      {s.n}
                    </div>
                    <div>
                      <div className="font-bold text-sm mb-0.5" style={{ color: '#ffffff' }}>
                        {s.title}
                      </div>
                      <div className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        {s.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: '#1e90ff', color: '#ffffff' }}
              >
                צור קשר לשירות
                <span style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>→</span>
              </Link>
              <a
                href="https://wa.me/972548818681?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%AA%D7%90%D7%9D%20%D7%90%D7%99%D7%A1%D7%95%D7%A3%20%D7%A6%D7%99%D7%95%D7%93%20%D7%9C%D7%AA%D7%99%D7%A7%D7%95%D7%9F"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-medium px-6 py-4 rounded-xl transition-colors"
                style={{ color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.18)' }}
              >
                איסוף לתיקון ב-WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
