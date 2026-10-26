'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import s from './studio.module.css';

type Slide = {
  key: string;
  tab: string;
  img: string;
  imgMobile: string;
  alt: string;
  kicker: string;
  title: [string, string];
  lede: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
  waText: string;
  shrink?: boolean;
};

const SLIDES: Slide[] = [
  {
    key: 'jinme',
    tab: 'Jinme',
    img: '/studio/jinme-201-dark.webp',
    imgMobile: '/studio/jinme-201-dark-m.jpg',
    alt: 'זוויתן השתלות Jinme 20:1 פייבר אופטי',
    kicker: 'Jinme · זוויתני השתלות',
    title: ['זוויתן השתלות 20:1.', 'פייבר אופטי, בלי רעידה.'],
    lede: 'הפחתה 20:1 להשתלות ולכירורגיה. כל יחידה נבדקת ומכוילת במעבדת DES לפני המסירה.',
    primary: { href: '/catalog/2ba3cf5e-e0ad-4324-b4a2-f6240b80412d', label: 'לעמוד המוצר' },
    secondary: { href: '/catalog?manufacturer=JINME', label: 'לכל מוצרי Jinme' },
    waText: 'שלום, אשמח לפרטים על זוויתן השתלות 20:1 Jinme',
  },
  {
    key: 'nouvag',
    tab: 'Nouvag',
    img: '/studio/vacuson-dark.webp',
    imgMobile: '/studio/vacuson-dark-m.jpg',
    alt: 'Nouvag Vacuson 60 LP',
    kicker: 'Nouvag · שוויץ',
    title: ['Vacuson 60 LP.', 'שאיבה כירורגית, מתחת ל‑55 dB.'],
    lede: '60 ליטר לדקה, 65 kPa, שני מכלי איסוף. מופץ בישראל באופן בלעדי על ידי DES.',
    primary: { href: '/catalog/240257ad-fab8-462d-8560-ed23aaafe0f8', label: 'לעמוד המוצר' },
    secondary: { href: '/catalog?manufacturer=NOUVAG', label: 'למערכות Nouvag' },
    waText: 'שלום, אשמח לפרטים על Nouvag Vacuson 60 LP',
  },
  {
    key: 'surtron',
    tab: 'LED SpA',
    img: '/studio/surtron-dark.webp',
    imgMobile: '/studio/surtron-dark-m.jpg',
    alt: 'LED Surtron 300 HP',
    kicker: 'LED SpA · איטליה',
    title: ['Surtron 300 HP.', 'חיתוך, קרישה ובייפולר.'],
    lede: 'יחידת אלקטרוכירורגיה בהספק גבוה לכירורגיה אוראלית, פריודונטיה ורפואה כללית.',
    primary: { href: '/catalog/44fa86ba-9998-4ffd-a8b8-50a45ca7cc50', label: 'לעמוד המוצר' },
    secondary: { href: '/catalog?category=surgery', label: 'לאלקטרוכירורגיה' },
    waText: 'שלום, אשמח לפרטים על LED Surtron 300 HP',
    shrink: true,
  },
];

const INTERVAL = 6500;

export default function StudioHero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % SLIDES.length), INTERVAL);
    return () => clearInterval(t);
  }, [paused, i]);

  return (
    <section
      dir="rtl"
      className={`${s.stage} ${s.hero}`}
      aria-label="מוצרים נבחרים"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {SLIDES.map((sl, k) => (
        <div
          key={sl.key}
          className={`${s.slide} ${k === i ? s.on : ''} ${sl.shrink ? s.shrink : ''}`}
          aria-hidden={k !== i}
        >
          <div className={`${s.pic} absolute inset-0 max-[860px]:relative`}>
            <Image
              src={sl.img}
              alt={sl.alt}
              fill
              priority={k === 0}
              quality={90}
              sizes="100vw"
              className="max-[860px]:hidden"
            />
            <Image
              src={sl.imgMobile}
              alt={sl.alt}
              fill
              priority={k === 0}
              sizes="100vw"
              className="min-[861px]:hidden object-cover"
            />
          </div>
          <div className={s.copy}>
            <div className="mx-auto w-full max-w-[1280px] px-5 flex flex-col items-start gap-5">
              <div className="text-[12.5px] font-medium tracking-[0.2em] uppercase text-[#b7c3dd]">{sl.kicker}</div>
              {k === 0 ? (
                <h1 className={s.title}>{sl.title[0]}<br />{sl.title[1]}</h1>
              ) : (
                <h2 className={s.title}>{sl.title[0]}<br />{sl.title[1]}</h2>
              )}
              <p className="text-[17px] md:text-lg leading-relaxed text-[#c3cce0]">{sl.lede}</p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={sl.primary.href}
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded bg-des-blue text-white font-medium hover:bg-[#1273d6] transition-colors"
                >
                  {sl.primary.label}
                </Link>
                <a
                  href={`https://wa.me/972548818681?text=${encodeURIComponent(sl.waText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded border border-white/30 text-white font-medium hover:border-white transition-colors"
                >
                  <MessageCircle className="w-[18px] h-[18px]" aria-hidden />
                  וואטסאפ
                </a>
                <Link href={sl.secondary.href} className="font-medium border-b border-white/40 pb-0.5 hover:border-white">
                  {sl.secondary.label}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-7 inset-x-0 z-10" role="tablist" aria-label="יצרנים">
        <div className="mx-auto max-w-[1280px] px-5 flex gap-2 flex-wrap">
          {SLIDES.map((sl, k) => (
            <button
              key={sl.key}
              role="tab"
              aria-selected={k === i}
              className={`${s.tab} ${k === i ? s.on : ''}`}
              onClick={() => setI(k)}
            >
              {sl.tab}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
