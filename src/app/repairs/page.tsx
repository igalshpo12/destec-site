import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageCircle, Phone, Microscope, Truck, FileCheck, ShieldCheck, Wrench, Cog, Zap, Droplets, Activity, RotateCw } from 'lucide-react';
import RepairForm from '@/components/ui/RepairForm';

export const metadata: Metadata = {
  title: 'תיקון טורבינות, זוויתנים ומנועים דנטליים',
  description:
    'מעבדת השירות של DES בבת ים: תיקון טורבינות, זוויתנים, ידיות ומנועים כירורגיים לכל המותגים. איסוף מהמרפאה, אבחון תחת מיקרוסקופ, הצעת מחיר לפני כל תיקון ואחריות על התיקון.',
  alternates: { canonical: 'https://destec.co.il/repairs' },
};

const WA = 'https://wa.me/972548818681?text=' + encodeURIComponent('שלום, אשמח לתאם איסוף ציוד לתיקון');

const DEVICES = [
  { icon: RotateCw, name: 'טורבינות', brands: 'NSK · W&H · KaVo · MK-dent · Bien-Air · Jinme' },
  { icon: Wrench, name: 'זוויתנים 1:1, 1:5, 20:1', brands: 'כולל פייבר אופטי וראשי השתלות' },
  { icon: Cog, name: 'ידיות ישרות ומנועי אוויר', brands: 'כל היצרנים, חיבור 4 חורים / Midwest' },
  { icon: Zap, name: 'מיקרומוטורים חשמליים', brands: 'NSK · W&H · Bien-Air · Saeshin' },
  { icon: Activity, name: 'מנועים כירורגיים ולהשתלות', brands: 'Nouvag · TCM 3000 · HighSurg — יבואן רשמי' },
  { icon: Droplets, name: 'שאיבה, סקיילרים ואלקטרוכירורגיה', brands: 'Vacuson · סקיילרים אולטרסוניים · Surtron' },
];

const STEPS = [
  { icon: MessageCircle, title: 'פותחים קריאה', desc: 'בטופס, בוואטסאפ או בטלפון. מספרים מה הציוד ומה התקלה.' },
  { icon: Truck, title: 'אוספים מהמרפאה', desc: 'שליח מגיע למרפאה, או שולחים אלינו למעבדה בבת ים.' },
  { icon: Microscope, title: 'מאבחנים ומתמחרים', desc: 'אבחון תחת מיקרוסקופ והצעת מחיר לאישורכם לפני כל תיקון.' },
  { icon: FileCheck, title: 'מתקנים, בודקים, מחזירים', desc: 'בדיקת סל״ד, לחץ ורעש, דוח בדיקה ואחריות על התיקון.' },
];

const FACTS = [
  { n: '1998', l: 'מעבדה פעילה מאז' },
  { n: '48 ש׳', l: 'זמן תגובה ממוצע' },
  { n: 'ISO 9001', l: 'מערכת איכות מוסמכת' },
  { n: 'אמ״ר', l: 'יבואן מורשה · משרד הבריאות' },
];

const FAQ = [
  { q: 'כמה זמן לוקח תיקון?', a: 'רוב הידיות חוזרות תוך ימים ספורים מרגע אישור הצעת המחיר. תיקונים שדורשים חלק מחו״ל מתואמים מראש.' },
  { q: 'יש עלות לאבחון?', a: 'האבחון כלול כשמאשרים את התיקון. אם בוחרים לא לתקן, נעדכן מראש על עלות הבדיקה וההובלה.' },
  { q: 'מתקנים גם מותגים שאתם לא מייבאים?', a: 'כן. המעבדה מטפלת בכל היצרנים הנפוצים: NSK, W&H, KaVo, Bien-Air, Sirona ועוד. ל‑MK-dent, Jinme ו‑Nouvag יש לנו חלפים מקוריים במלאי כיבואן.' },
  { q: 'מה כוללת האחריות?', a: 'אחריות על החלקים שהוחלפו ועל העבודה שבוצעה. פרטי האחריות מופיעים בדוח הבדיקה שמצורף לכל ידית.' },
  { q: 'אפשר לקבל ציוד חלופי לזמן התיקון?', a: 'במקרים רבים כן. ציינו זאת בקריאת השירות ונבדוק זמינות.' },
];

export default function RepairsPage() {
  return (
    <div dir="rtl" className="bg-white text-gray-900">
      {/* hero */}
      <section className="relative overflow-hidden bg-[#05080f] text-[#eef2f8]" aria-label="מעבדת השירות של DES">
        <video
          src="/videos/repair-explainer.mp4"
          poster="/videos/repair-explainer-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to left, rgba(5,8,15,.94) 0%, rgba(5,8,15,.8) 45%, rgba(5,8,15,.25) 100%), linear-gradient(to top, #05080f 0%, rgba(5,8,15,.92) 28%, rgba(5,8,15,0) 60%)' }}
        />
        <div className="relative mx-auto max-w-[1280px] px-5 py-20 md:py-28 lg:py-36">
          <div className="max-w-[620px] flex flex-col items-start gap-5">
            <div className="text-[12.5px] font-medium uppercase tracking-[0.2em] text-[#b7c3dd]">שירות ומעבדה · בת ים</div>
            <h1 className="font-black text-[clamp(32px,4.4vw,60px)] leading-[1.08] tracking-[-0.02em] text-balance">
              תיקון טורבינות, זוויתנים ומנועים.
              <br />
              במעבדה שלנו בבת ים.
            </h1>
            <p className="max-w-[34em] text-lg leading-relaxed text-[#c3cce0]">
              איסוף מהמרפאה, אבחון תחת מיקרוסקופ, הצעת מחיר לפני כל תיקון ודוח בדיקה לכל ידית.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a href="#form" className="inline-flex items-center rounded bg-des-blue px-6 py-3.5 font-medium text-white transition-colors hover:bg-[#1273d6]">
                פתיחת קריאת שירות
              </a>
              <a href={WA} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded border border-white/30 px-5 py-3.5 font-medium text-white transition-colors hover:border-white">
                <MessageCircle className="h-[18px] w-[18px]" aria-hidden /> וואטסאפ
              </a>
              <a href="tel:035081868" className="inline-flex items-center gap-2 font-medium border-b border-white/40 pb-0.5 hover:border-white" dir="ltr">
                <Phone className="h-4 w-4" aria-hidden /> 03-5081868
              </a>
            </div>
          </div>
          <dl className="mt-14 grid grid-cols-2 gap-6 border-t border-white/10 pt-7 md:grid-cols-4">
            {FACTS.map((f) => (
              <div key={f.l}>
                <dt className="text-[13px] text-[#8e9ab3]">{f.l}</dt>
                <dd className="text-2xl font-bold tabular-nums" dir="ltr" style={{ textAlign: 'right' }}>{f.n}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* what we repair */}
      <section className="mx-auto max-w-[1280px] px-5 py-16 lg:py-24">
        <div className="mb-10 flex flex-col gap-3">
          <div className="text-[12.5px] font-medium uppercase tracking-[0.2em] text-gray-500">מה מתקנים</div>
          <h2 className="font-black text-[clamp(26px,3.2vw,42px)] leading-tight text-[#1a2b4a] text-balance">כל ידית שמסתובבת, וכל מנוע שמסובב אותה.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEVICES.map(({ icon: Icon, name, brands }) => (
            <div key={name} className="flex gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5">
              <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-[#1a2b4a] text-white">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <h3 className="font-bold text-[#1a2b4a]">{name}</h3>
                <p className="mt-1 text-sm text-gray-500" dir="auto">{brands}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* process */}
      <section className="bg-[#0a1626] text-white">
        <div className="mx-auto max-w-[1280px] px-5 py-16 lg:py-24">
          <div className="mb-10 flex flex-col gap-3">
            <div className="text-[12.5px] font-medium uppercase tracking-[0.2em] text-[#8e9ab3]">איך זה עובד</div>
            <h2 className="font-black text-[clamp(26px,3.2vw,42px)] leading-tight text-balance">ארבעה שלבים. הצעת מחיר לפני שנוגעים.</h2>
          </div>
          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ icon: Icon, title, desc }, i) => (
              <li key={title} className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Icon className="h-6 w-6 text-[#1e90ff]" aria-hidden />
                  <span className="text-sm text-white/40 tabular-nums">{i + 1}/4</span>
                </div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{desc}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/70">
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#1e90ff]" aria-hidden /> חלפים מקוריים MK-dent · Jinme · Nouvag מהמלאי</span>
            <span className="inline-flex items-center gap-2"><FileCheck className="h-4 w-4 text-[#1e90ff]" aria-hidden /> דוח בדיקה לכל ידית</span>
            <span className="inline-flex items-center gap-2"><Microscope className="h-4 w-4 text-[#1e90ff]" aria-hidden /> אבחון תחת מיקרוסקופ</span>
          </div>
        </div>
      </section>

      {/* form + faq */}
      <section id="form" className="mx-auto max-w-[1280px] px-5 py-16 lg:py-24 scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">
          <div className="rounded-2xl bg-[#1a2b4a] p-6 sm:p-8">
            <h2 className="mb-1 text-2xl font-black text-white">פתיחת קריאת שירות</h2>
            <p className="mb-6 text-sm text-white/60">נחזור אליכם לתיאום איסוף. אפשר גם ישירות בוואטסאפ: <a href={WA} target="_blank" rel="noopener noreferrer" className="text-[#5eb2ff] underline-offset-2 hover:underline">054-8818681</a></p>
            <RepairForm />
          </div>
          <div>
            <h2 className="mb-6 font-black text-[clamp(24px,2.6vw,34px)] text-[#1a2b4a]">שאלות שחוזרות.</h2>
            <dl className="divide-y divide-gray-200 border-y border-gray-200">
              {FAQ.map((f) => (
                <div key={f.q} className="py-5">
                  <dt className="font-bold text-[#1a2b4a]">{f.q}</dt>
                  <dd className="mt-2 text-[15px] leading-relaxed text-gray-600">{f.a}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm text-gray-500">
              מחפשים ציוד חדש במקום לתקן? <Link href="/catalog?category=handpieces" className="font-medium text-des-blue hover:underline">לטורבינות ולזוויתנים בקטלוג</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
