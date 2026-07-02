'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';

type Flagship = {
  key: string;
  pill: string;
  name: string;
  subtitle: string;
  desc: string;
  specs: { label: string; value: string }[];
  image: string;
  productId: string;
  waText: string;
};

const FLAGSHIPS: Flagship[] = [
  {
    key: 'vacuson',
    pill: 'NOUVAG · יבואן רשמי DES',
    name: 'Vacuson 60 LP',
    subtitle: 'מערכת שאיבה כירורגית שקטה',
    desc: 'מכשיר שאיבה כירורגי עוצמתי ושקט במיוחד (<55 dB). מתאים לניתוחי שתלים, אנדודונטיה וכירורגיה אוראלית. מופץ בישראל באופן בלעדי על ידי DES.',
    specs: [
      { label: 'קצב זרימה', value: '60 L/min' },
      { label: 'ואקום מקסימלי', value: '65 kPa' },
      { label: 'רמת רעש', value: '< 55 dB' },
      { label: 'נפח אוסף', value: '2 × 2 L' },
      { label: 'הספק', value: '180 W' },
    ],
    image: 'https://likaubaiqrojlwqzoepp.supabase.co/storage/v1/object/public/products/8585237.jpg',
    productId: '240257ad-fab8-462d-8560-ed23aaafe0f8',
    waText: 'שלום, אשמח לפרטים על Nouvag Vacuson 60 LP',
  },
  {
    key: 'surtron',
    pill: 'SURTRON · יבואן רשמי DES',
    name: 'LED Surtron 300 HP',
    subtitle: 'מכשיר אלקטרוכירורגיה מתקדם',
    desc: 'מכשיר אלקטרוכירורגיה עוצמתי המאפשר ביצוע ניתוחים מונופולריים וביפולריים בו-זמנית — בתחומים שבהם נדרשים דיוק ואמינות גבוהים.',
    specs: [
      { label: 'מצבי עבודה', value: 'מונו + ביפולרי' },
      { label: 'עבודה', value: 'בו-זמנית' },
      { label: 'הגנות', value: 'דיגיטליות' },
    ],
    image: 'https://likaubaiqrojlwqzoepp.supabase.co/storage/v1/object/public/products/8602320.jpg',
    productId: '44fa86ba-9998-4ffd-a8b8-50a45ca7cc50',
    waText: 'שלום, אשמח לפרטים על LED Surtron 300 HP',
  },
  {
    key: 'tcm',
    pill: 'NOUVAG · תוצרת שוויץ',
    name: 'TCM 3000 BL',
    subtitle: 'מערכת מנוע לכירורגיה משחזרת',
    desc: 'מערכת מנוע קומפקטית לקידוח, חיתוך, טחינה ואף השתלת עור באמצעות דרמטומים. אמינה ופשוטה לתפעול — נבחרה על ידי מרפאות וחדרי ניתוח רבים.',
    specs: [
      { label: 'שימושים', value: 'קידוח · חיתוך' },
      { label: 'תואם', value: 'דרמטומים' },
      { label: 'תפעול', value: 'פשוט ואמין' },
    ],
    image: 'https://likaubaiqrojlwqzoepp.supabase.co/storage/v1/object/public/products/8585131.jpg',
    productId: 'cac6c22e-e93d-4f62-a78c-3fea4b2a27d4',
    waText: 'שלום, אשמח לפרטים על Nouvag TCM 3000 BL',
  },
  {
    key: 'smartcleaner',
    pill: 'תחזוקה חכמה במרפאה',
    name: 'Smart Cleaner',
    subtitle: 'פתיחת סתימות במעברי המים של טורבינות',
    desc: 'מכשיר ייעודי לניקוי מהיר ובטוח של תעלות המים בטורבינה — פותרים סתימה בעצמכם בתוך דקות, בלי טכנאי, ומונעים תקלות חוזרות ובלאי.',
    specs: [
      { label: 'טיפול', value: 'עצמי · דקות' },
      { label: 'מונע', value: 'תקלות חוזרות' },
      { label: 'מחיר', value: '₪990' },
    ],
    image: 'https://likaubaiqrojlwqzoepp.supabase.co/storage/v1/object/public/products/8756876.png',
    productId: '050d5896-63ce-4602-8aab-0649612a4530',
    waText: 'שלום, אשמח לפרטים על Smart Cleaner',
  },
];

const ROTATE_MS = 7000;

export default function FlagshipShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => setActive((i) => (i + 1) % FLAGSHIPS.length), ROTATE_MS);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [paused]);

  const p = FLAGSHIPS[active];

  return (
    <section
      dir="rtl"
      aria-label="מוצרי דגל"
      style={{ background: '#070e1a' }}
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* top + bottom hairlines */}
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(30,140,212,0.5),transparent)' }} />
      <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(30,140,212,0.3),transparent)' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">

        {/* Product switcher tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          <span
            className="text-[10px] font-bold tracking-[0.2em] uppercase ml-3"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            מוצרי דגל
          </span>
          {FLAGSHIPS.map((f, i) => (
            <button
              key={f.key}
              onClick={() => setActive(i)}
              className="text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200"
              style={
                i === active
                  ? { background: '#1E8CD4', color: '#fff' }
                  : {
                      background: 'rgba(255,255,255,0.05)',
                      color: 'rgba(255,255,255,0.6)',
                      border: '1px solid rgba(255,255,255,0.12)',
                    }
              }
              aria-pressed={i === active}
            >
              {f.name}
            </button>
          ))}
        </div>

        <div key={p.key} className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center" style={{ animation: 'flagshipFade .45s ease both' }}>
          <style>{`@keyframes flagshipFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>

          {/* ── Product stage (renders right in RTL) ── */}
          <div className="relative order-1">
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
              <div className="relative w-full" style={{ aspectRatio: '16/10' }}>
                {/* blurred copy of the photo fills the card so its own backdrop
                    extends to the edges — no floating rectangle */}
                <Image
                  src={p.image}
                  alt=""
                  aria-hidden
                  fill
                  className="object-cover"
                  style={{ filter: 'blur(28px)', transform: 'scale(1.15)', opacity: 0.9 }}
                  sizes="(max-width: 1024px) 92vw, 620px"
                />
                <div className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.35)' }} />
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-contain p-8"
                  sizes="(max-width: 1024px) 92vw, 620px"
                />
              </div>
            </div>
          </div>

          {/* ── Info (renders left in RTL) ── */}
          <div className="order-2 flex flex-col">
            <span
              className="inline-flex items-center gap-2 self-start text-[10px] font-bold tracking-[0.2em] uppercase px-3.5 py-1.5 rounded-full mb-6"
              style={{ background: 'rgba(30,140,212,0.1)', border: '1px solid rgba(30,140,212,0.3)', color: '#4BAEE8' }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#4BAEE8' }} />
              {p.pill}
            </span>

            <h2 className="font-black text-white leading-[1.05] mb-2" style={{ fontSize: 'clamp(2rem, 3.4vw, 3rem)' }}>
              {p.name}
            </h2>
            <p className="font-bold mb-5" style={{ color: '#1E8CD4', fontSize: '1.1rem' }}>
              {p.subtitle}
            </p>

            <p className="leading-relaxed mb-8 max-w-md" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>
              {p.desc}
            </p>

            {/* Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-9">
              {p.specs.map((s) => (
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
                  <div className="font-extrabold text-white" style={{ fontSize: '1.05rem' }}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://wa.me/972548818681?text=${encodeURIComponent(p.waText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-white transition-transform hover:-translate-y-0.5"
                style={{ background: '#1E8CD4' }}
              >
                <MessageCircle className="w-4.5 h-4.5" />
                פרטים והזמנה
              </a>
              <Link
                href={`/catalog/${p.productId}`}
                className="inline-flex items-center gap-2 font-medium px-6 py-3 rounded-xl transition-colors"
                style={{ color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.18)' }}
              >
                לעמוד המוצר
              </Link>
            </div>

            <p className="text-[11px] mt-6" style={{ color: 'rgba(255,255,255,0.28)' }}>
              * DES הינו היבואן והמפיץ הרשמי בישראל
            </p>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mt-10" dir="ltr">
          {FLAGSHIPS.map((f, i) => (
            <button
              key={f.key}
              onClick={() => setActive(i)}
              aria-label={f.name}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === active ? 22 : 8,
                height: 8,
                background: i === active ? '#1E8CD4' : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
