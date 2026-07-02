import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';

const SPECS = [
  { label: 'קצב זרימה', value: '60 L/min' },
  { label: 'ואקום מקסימלי', value: '65 kPa' },
  { label: 'רמת רעש', value: '< 55 dB' },
  { label: 'נפח אוסף', value: '2 × 2 L' },
  { label: 'הספק', value: '180 W' },
];

const WA = 'https://wa.me/972548818681?text=' +
  encodeURIComponent('שלום, אשמח לפרטים על Nouvag Vacuson 60 LP');

export default function VacusonShowcase() {
  return (
    <section
      dir="rtl"
      aria-label="Nouvag Vacuson 60 LP"
      style={{ background: '#070e1a' }}
      className="relative overflow-hidden"
    >
      {/* top + bottom hairlines */}
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(30,140,212,0.5),transparent)' }} />
      <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(30,140,212,0.3),transparent)' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">

          {/* ── Product stage (renders right in RTL) ── */}
          <div className="relative order-1">
            {/* soft blue glow behind the card */}
            <div
              className="absolute -inset-6 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(30,140,212,0.18) 0%, transparent 65%)' }}
            />
            <div
              className="relative rounded-[28px] overflow-hidden"
              style={{
                background: '#eceef1',
                boxShadow: '0 30px 70px -25px rgba(0,0,0,0.65)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* real product photo, untouched — its own studio backdrop fills the card */}
              <div className="relative w-full" style={{ aspectRatio: '1600/915' }}>
                <Image
                  src="https://likaubaiqrojlwqzoepp.supabase.co/storage/v1/object/public/products/8585237.jpg"
                  alt="Nouvag Vacuson 60 LP"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 92vw, 620px"
                />
              </div>
              {/* corner model tag */}
              <span
                className="absolute top-4 right-4 text-[11px] font-bold tracking-wide px-3 py-1 rounded-full"
                style={{ background: '#fff', color: '#0d2b4a', border: '1px solid rgba(13,43,74,0.12)' }}
              >
                NOUVAG
              </span>
            </div>
          </div>

          {/* ── Info (renders left in RTL) ── */}
          <div className="order-2 flex flex-col">
            <span
              className="inline-flex items-center gap-2 self-start text-[10px] font-bold tracking-[0.2em] uppercase px-3.5 py-1.5 rounded-full mb-6"
              style={{ background: 'rgba(30,140,212,0.1)', border: '1px solid rgba(30,140,212,0.3)', color: '#4BAEE8' }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#4BAEE8' }} />
              NOUVAG · יבואן רשמי DES
            </span>

            <h2 className="font-black text-white leading-[1.05] mb-2" style={{ fontSize: 'clamp(2rem, 3.4vw, 3rem)' }}>
              Vacuson 60 LP
            </h2>
            <p className="font-bold mb-5" style={{ color: '#1E8CD4', fontSize: '1.1rem' }}>
              מערכת שאיבה כירורגית שקטה
            </p>

            <p className="leading-relaxed mb-8 max-w-md" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>
              מכשיר שאיבה כירורגי עוצמתי ושקט במיוחד (&lt;55&nbsp;dB). מתאים לניתוחי שתלים,
              אנדודונטיה וכירורגיה אוראלית. מופץ בישראל באופן בלעדי על ידי DES.
            </p>

            {/* Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-9">
              {SPECS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl px-3.5 py-3"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div
                    className="text-[10px] font-semibold uppercase mb-1.5"
                    style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em' }}
                  >
                    {s.label}
                  </div>
                  <div className="font-extrabold text-white" style={{ fontSize: '1.05rem', direction: 'ltr', textAlign: 'right' }}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-white transition-transform hover:-translate-y-0.5"
                style={{ background: '#1E8CD4' }}
              >
                <MessageCircle className="w-4.5 h-4.5" />
                פרטים והזמנה
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 font-medium px-6 py-3 rounded-xl transition-colors"
                style={{ color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.18)' }}
              >
                צור קשר
              </Link>
            </div>

            <p className="text-[11px] mt-6" style={{ color: 'rgba(255,255,255,0.28)' }}>
              * DES הינו היבואן והמפיץ הרשמי של Nouvag בישראל
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
