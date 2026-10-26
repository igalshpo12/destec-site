import Link from 'next/link';
import Image from 'next/image';
import s from './studio.module.css';

const BRANDS = [
  { name: 'Jinme', kicker: 'Handpieces', sub: 'טורבינות, זוויתנים, מנועים', img: '/studio/jinme-15-dark.jpg', pos: '50% 40%', tall: true, href: '/catalog?manufacturer=JINME' },
  { name: 'Nouvag', kicker: 'Surgery', sub: 'מנועים כירורגיים, שאיבה, ליפו', img: '/studio/vacuson-dark.webp', pos: '30% 50%', href: '/catalog?manufacturer=NOUVAG' },
  { name: 'LED SpA', kicker: 'Electrosurgery', sub: 'יחידות Surtron', img: '/studio/surtron-dark.webp', pos: '30% 50%', href: '/catalog?manufacturer=SPA%20LED' },
  { name: 'MK-dent', kicker: 'Turbines', sub: 'Prime, Classic, Eco Line', img: '/studio/turbine-dark.jpg', pos: '27% 50%', fit: true, href: '/catalog?manufacturer=MK-DENT' },
];


const kicker = 'text-[12.5px] font-medium tracking-[0.2em] uppercase text-[#8e9ab3]';
const h2 = 'font-black text-[clamp(28px,3.6vw,46px)] leading-[1.1] tracking-[-0.02em] text-balance';

export default function BrandShowcase() {
  return (
    <div dir="rtl" className="bg-[#070b14] text-[#eef2f8]">
      {/* brands */}
      <section className="py-[clamp(64px,8vw,110px)]" id="brands">
        <div className="mx-auto max-w-[1280px] px-5">
          <div className="flex flex-col gap-3 mb-10">
            <div className={kicker}>יבואן ומפיץ מורשה · משרד הבריאות</div>
            <h2 className={h2}>היצרנים שאנחנו מייצגים.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            {BRANDS.map((b) => (
              <Link key={b.name} href={b.href} className={`${s.card} ${'fit' in b && b.fit ? s.fit : ''} ${'tall' in b && b.tall ? s.tall : ''}`} aria-label={`${b.name} – ${b.sub}`}>
                <Image src={b.img} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw" style={{ objectPosition: b.pos }} />
                <div className={`${s.cap} flex flex-col gap-1`}>
                  <div className="text-[11.5px] font-medium tracking-[0.2em] uppercase text-[#aab6cf]">{b.kicker}</div>
                  <b className="text-[19px] font-bold">{b.name}</b>
                  <small className="text-[13px] text-[#8e9ab3]">{b.sub}</small>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* family band */}
      <section className="relative bg-[#05080f] overflow-hidden">
        <div className="relative z-10 flex flex-col items-start text-right md:items-center md:text-center gap-3.5 px-5 pt-[clamp(56px,8vw,110px)] pb-6 md:pb-0 md:-mb-[6vw]">
          <div className="text-[12.5px] font-medium tracking-[0.2em] uppercase text-[#b7c3dd]">ידיות מכל היצרנים · מעבדה אחת</div>
          <h2 className="font-black text-[clamp(28px,4.2vw,54px)] leading-[1.05] tracking-[-0.02em] text-balance">
            כל ידית שיוצאת מכאן נבדקה בלחץ, בסל״ד וברעש.
          </h2>
          <p className="text-lg text-[#c3cce0] max-w-[40em]">Jinme, MK‑dent ו‑Nouvag. תיקון, כיול וחלקים מקוריים, בישראל.</p>
        </div>
        <Image
          src="/studio/family.jpg"
          alt="ידיות של Jinme, MK-dent ו-Nouvag"
          width={2400}
          height={1018}
          sizes="100vw"
          className="w-full h-auto min-h-[320px] md:min-h-[420px] object-cover object-[50%_70%]"
        />
      </section>

    </div>
  );
}
