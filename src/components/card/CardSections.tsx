import Image from 'next/image';
import { COMPANY } from '@/lib/company';
import ContactForm from '@/components/ui/ContactForm';
import {
  StarIcon,
  MapPinIcon,
  ClockIcon,
  MailIcon,
  InstagramIcon,
  PhoneIcon,
} from './icons';

/* ---------- shared shell ---------- */

export function CardSection({
  title,
  children,
  id,
}: {
  title?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-sm">
      {title && (
        <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold text-white">
          <span className="h-5 w-1 rounded-full bg-[#1e90ff]" />
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

/* ---------- hero ---------- */

export function CardHero() {
  return (
    <header className="flex flex-col items-center gap-4 pt-10 text-center">
      <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/15 bg-gradient-to-b from-white/10 to-white/[0.03] shadow-[0_8px_40px_rgba(30,144,255,0.25)]">
        <Image src="/des-white.png" alt="des" width={88} height={50} priority />
      </div>
      <div>
        <h1 className="text-2xl font-black leading-snug text-white">
          DES — שירותי ציוד רפואי ודנטלי
        </h1>
        <p className="mt-1 text-sm text-white/70">{COMPANY.tagline}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 text-[11px] font-semibold">
        {['משנת 1998', 'ISO 9001', 'רישיון אמ״ר', 'יבואן מורשה'].map((b) => (
          <span
            key={b}
            className="rounded-full border border-[#1e90ff]/40 bg-[#1e90ff]/10 px-3 py-1 text-[#7cbcff]"
          >
            {b}
          </span>
        ))}
      </div>
    </header>
  );
}

/* ---------- about ---------- */

export function CardAbout() {
  return (
    <CardSection title="מי אנחנו">
      <p className="text-sm leading-relaxed text-white/80">
        כבר יותר מ-25 שנה אנחנו מייבאים, מוכרים ומתקנים ציוד דנטלי ורפואי עבור
        מרפאות, מעבדות ומוסדות בכל הארץ. מעבדת השירות שלנו בבת ים מטפלת
        בטורבינות, מנועים, זוויתנים וציוד כירורגי של כל היצרנים המובילים —
        עם איסוף והחזרה עד הדלת.
      </p>
    </CardSection>
  );
}

/* ---------- services ---------- */

const SERVICES = [
  { icon: '🦷', title: 'מכירת ציוד', desc: 'יבוא רשמי של מותגים מובילים — טורבינות, מנועים, אוטוקלבים וציוד כירורגי' },
  { icon: '🔧', title: 'מעבדת תיקונים', desc: 'תיקון והשמשת ציוד דנטלי ורפואי במעבדה מוסמכת, עם אחריות' },
  { icon: '🚚', title: 'איסוף והחזרה', desc: 'שליח אוסף את הציוד מהמרפאה ומחזיר אותו מתוקן — בכל הארץ' },
  { icon: '🎓', title: 'הדרכות וסדנאות', desc: 'הדרכות תפעול ותחזוקה נכונה לצוותי מרפאה' },
];

export function CardServices() {
  return (
    <CardSection title="השירותים שלנו">
      <div className="grid grid-cols-1 gap-3">
        {SERVICES.map((s) => (
          <div
            key={s.title}
            className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3"
          >
            <span className="text-2xl leading-none">{s.icon}</span>
            <div>
              <div className="text-sm font-bold text-white">{s.title}</div>
              <div className="mt-0.5 text-xs leading-relaxed text-white/65">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </CardSection>
  );
}

/* ---------- brands ---------- */

const BRANDS = [
  'NSK', 'W&H', 'KaVo', 'Bien-Air', 'Nouvag',
  'MK-dent', 'Anthogyr', 'Dentsply Sirona', 'JINME', 'MDT',
];

export function BrandsStrip() {
  return (
    <CardSection title="המותגים שאנחנו מייצגים">
      <div className="flex flex-wrap gap-2">
        {BRANDS.map((b) => (
          <span
            key={b}
            className="rounded-xl border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-bold tracking-wide text-white/85"
            dir="ltr"
          >
            {b}
          </span>
        ))}
      </div>
    </CardSection>
  );
}

/* ---------- gallery ---------- */

const GALLERY = [
  { src: '/images/workshop-bench.webp', alt: 'מעבדת השירות של DES' },
  { src: '/hero/contra-15.jpg', alt: 'זוויתן 1:5' },
  { src: '/hero/surgical.jpg', alt: 'ציוד כירורגי' },
  { src: '/hero/implant-201.jpg', alt: 'זוויתן שתלים 20:1' },
  { src: '/images/training/lecture-case.webp', alt: 'הדרכה מקצועית' },
  { src: '/hero/vacuson.jpg', alt: 'שואב כירורגי Vacuson' },
];

export function CardGallery() {
  return (
    <CardSection title="הצצה לעבודה שלנו">
      <div className="grid grid-cols-3 gap-2">
        {GALLERY.map((g) => (
          <div key={g.src} className="relative aspect-square overflow-hidden rounded-xl border border-white/10">
            <Image src={g.src} alt={g.alt} fill sizes="130px" className="object-cover" />
          </div>
        ))}
      </div>
    </CardSection>
  );
}

/* ---------- reviews ---------- */

export function CardReviews() {
  return (
    <CardSection title="לקוחות ממליצים">
      <p className="text-sm leading-relaxed text-white/80">
        מאות מרפאות ומעבדות סומכות עלינו בתחזוקת הציוד שלהן. נשמח אם גם אתם
        תשתפו את החוויה שלכם.
      </p>
      <a
        href={COMPANY.googleReviewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-[#1a2b4a] shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
      >
        <span className="flex text-[#f5a623]">
          {[1, 2, 3, 4, 5].map((i) => (
            <StarIcon key={i} size={16} />
          ))}
        </span>
        דרגו אותנו בגוגל
      </a>
    </CardSection>
  );
}

/* ---------- contact form ---------- */

export function CardContact() {
  return (
    <CardSection title="השאירו פרטים ונחזור אליכם">
      <div className="rounded-2xl bg-white p-4">
        <ContactForm />
      </div>
    </CardSection>
  );
}

/* ---------- footer ---------- */

export function CardFooter() {
  const rows = [
    { icon: <MapPinIcon />, text: COMPANY.addressHe, href: COMPANY.mapsUrl },
    { icon: <PhoneIcon size={18} />, text: COMPANY.landline, href: COMPANY.landlineHref },
    { icon: <MailIcon />, text: COMPANY.email, href: `mailto:${COMPANY.email}` },
    { icon: <ClockIcon />, text: `שעות פעילות: ${COMPANY.hoursHe}` },
  ];
  return (
    <footer className="flex flex-col items-center gap-4 pb-12 pt-2 text-center">
      <div className="flex flex-col gap-2 text-sm text-white/75">
        {rows.map((r) =>
          r.href ? (
            <a key={r.text} href={r.href} className="flex items-center justify-center gap-2 hover:text-white" dir="rtl">
              <span className="text-[#1e90ff]">{r.icon}</span>
              {r.text}
            </a>
          ) : (
            <div key={r.text} className="flex items-center justify-center gap-2" dir="rtl">
              <span className="text-[#1e90ff]">{r.icon}</span>
              {r.text}
            </div>
          )
        )}
      </div>
      <a
        href={COMPANY.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="אינסטגרם"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
      >
        <InstagramIcon />
      </a>
      <div className="text-[11px] text-white/40">
        ע״מ {COMPANY.businessId} · {COMPANY.iso}
        <br />
        <a href={COMPANY.website} className="text-[#7cbcff] hover:underline" dir="ltr">
          destec.co.il
        </a>
      </div>
    </footer>
  );
}
