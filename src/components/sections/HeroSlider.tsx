'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { GradientText } from '@/components/ui/gradient-text';

const BG = '#fbfcfe';

const DECK = [
  { img: '/hero/vacuson.jpg',     t: 'Nouvag Vacuson 60 LP', s: 'מערכת שאיבה כירורגית' },
  { img: '/hero/surgical.jpg',    t: 'Nouvag · מנוע ניתוחי',  s: 'כירורגיה אוראלית והשתלות' },
  { img: '/hero/contra-15.jpg',   t: 'Jinme · זוויתן 1:5',    s: 'מגדיל לטיפולי שיקום' },
  { img: '/hero/implant-201.jpg', t: 'Jinme · זוויתן 20:1',   s: 'להשתלות שיניים' },
  { img: '/hero/straight.jpg',    t: 'Jinme · ידית ישרה',     s: 'טיפול ושיקום מדויק' },
];

const STATS = [
  { n: '10', suf: '+', l: 'מותגים מובילים' },
  { n: '28', suf: '', l: 'שנות ניסיון' },
  { n: 'ISO 9001', suf: '', l: 'מערכת איכות מוסמכת' },
  { n: 'אמ״ר', suf: '', l: 'רישיון יבואן · משרד הבריאות' },
];

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/* ── shuffle deck ── */
function ProductDeck() {
  const deckRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;
    let order = Array.from(deck.querySelectorAll<HTMLElement>('[data-card]'));
    const pos = [
      { x: 0, y: 0, r: 0, s: 1, z: 50, o: 1 },
      { x: -14, y: 14, r: -3, s: 0.965, z: 40, o: 1 },
      { x: -26, y: 26, r: -5.5, s: 0.935, z: 30, o: 1 },
      { x: -36, y: 36, r: -8, s: 0.91, z: 20, o: 0.9 },
      { x: -44, y: 44, r: -10, s: 0.89, z: 10, o: 0.78 },
    ];
    const at = (i: number) => pos[Math.min(i, pos.length - 1)];
    const place = (card: HTMLElement, i: number, animate: boolean) => {
      const p = at(i);
      card.style.transition = animate
        ? 'transform .55s cubic-bezier(.2,.7,.2,1),opacity .5s'
        : 'none';
      card.style.zIndex = String(p.z);
      card.style.opacity = String(p.o);
      card.style.transform = `translate(${p.x}px,${p.y}px) rotate(${p.r}deg) scale(${p.s})`;
    };
    order.forEach((c, i) => place(c, i, false));

    let busy = false;
    const advance = () => {
      if (busy) return;
      busy = true;
      const front = order[0];
      front.style.transition = 'transform .5s cubic-bezier(.55,0,.7,.25),opacity .45s';
      front.style.transform = 'translate(40px,-120px) rotate(11deg) scale(.92)';
      front.style.opacity = '0';
      for (let i = 1; i < order.length; i++) place(order[i], i - 1, true);
      window.setTimeout(() => {
        order = [...order.slice(1), front];
        const p = at(order.length - 1);
        front.style.transition = 'none';
        front.style.zIndex = String(p.z);
        front.style.opacity = '0';
        front.style.transform = `translate(${p.x}px,${p.y}px) rotate(${p.r}deg) scale(${p.s})`;
        void front.offsetWidth;
        front.style.transition = 'opacity .55s';
        front.style.opacity = String(p.o);
        busy = false;
      }, 510);
    };

    const onClick = () => advance();
    deck.addEventListener('click', onClick);
    let timer = window.setInterval(advance, 3400);
    const stop = () => window.clearInterval(timer);
    const start = () => {
      window.clearInterval(timer);
      timer = window.setInterval(advance, 3400);
    };
    deck.addEventListener('mouseenter', stop);
    deck.addEventListener('mouseleave', start);
    return () => {
      window.clearInterval(timer);
      deck.removeEventListener('click', onClick);
      deck.removeEventListener('mouseenter', stop);
      deck.removeEventListener('mouseleave', start);
    };
  }, []);

  return (
    <div
      ref={deckRef}
      title="לחצו לדפדוף בין המוצרים"
      style={{
        position: 'relative',
        width: '92%',
        maxWidth: 500,
        aspectRatio: '3 / 2',
        margin: 'auto',
        cursor: 'pointer',
        zIndex: 2,
      }}
    >
      {DECK.map((d) => (
        <div
          key={d.img}
          data-card
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 22,
            overflow: 'hidden',
            background: '#eef0f3',
            boxShadow: '0 34px 74px -34px rgba(26,43,74,.62),inset 0 1px 0 rgba(255,255,255,.5)',
            border: '1px solid rgba(255,255,255,.6)',
            willChange: 'transform,opacity',
            backfaceVisibility: 'hidden',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={d.img}
            alt={d.t}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', pointerEvents: 'none' }}
          />
          <div
            style={{
              position: 'absolute',
              insetInline: 0,
              bottom: 0,
              padding: '32px 18px 16px',
              color: '#fff',
              background: 'linear-gradient(to top,rgba(7,14,26,.85),rgba(7,14,26,.12) 70%,transparent)',
            }}
          >
            <b style={{ display: 'block', fontSize: '1.06rem', fontWeight: 800 }}>{d.t}</b>
            <span style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.74)' }}>{d.s}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HeroSlider() {
  return (
    <section
      dir="rtl"
      aria-label="Hero — DES ציוד דנטלי"
      className="relative overflow-hidden"
      style={{ background: BG }}
    >
      {/* atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(46% 50% at 84% 8%,rgba(30,144,255,.12),transparent 70%),radial-gradient(40% 45% at 6% 92%,rgba(26,43,74,.06),transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#1a2b4a14 1.1px,transparent 1.1px)',
          backgroundSize: '26px 26px',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 72% 38%,#000,transparent 78%)',
          maskImage: 'radial-gradient(ellipse 70% 60% at 72% 38%,#000,transparent 78%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.045, mixBlendMode: 'multiply', backgroundImage: GRAIN }}
      />
      {/* soft-blue DES ghost */}
      <div
        aria-hidden
        className="absolute select-none pointer-events-none"
        style={{
          top: '5%',
          left: '-3%',
          fontSize: '26vw',
          fontWeight: 900,
          lineHeight: 0.8,
          letterSpacing: '-.04em',
          backgroundImage: 'linear-gradient(125deg,#1e90ff,#6fc0ff)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          opacity: 0.12,
          filter: 'blur(2px)',
        }}
      >
        DES
      </div>

      {/* content */}
      <div
        className="relative z-[3] grid grid-cols-1 lg:grid-cols-[1.02fr_.98fr] items-center gap-8 lg:gap-8 max-w-[1300px] mx-auto px-6 lg:px-12 pt-10 pb-9"
        style={{ minHeight: '72vh' }}
      >
        {/* text */}
        <div>
          <div
            className="inline-flex items-center gap-3 mb-6 text-xs font-bold uppercase"
            style={{ color: '#1e90ff', letterSpacing: '.22em', animation: 'heroUp .8s cubic-bezier(.2,.7,.2,1) both' }}
          >
            <span style={{ width: 46, height: 2, background: 'linear-gradient(90deg,#1e90ff,transparent)' }} />
            יבואן מורשה · ISO 9001 · מאז 1998
          </div>

          <h1
            className="font-black"
            style={{
              fontSize: 'clamp(2.6rem,5.3vw,5.1rem)',
              lineHeight: 1.03,
              letterSpacing: '-.022em',
              color: '#0d1929',
              animation: 'heroUp .8s cubic-bezier(.2,.7,.2,1) .1s both',
            }}
          >
            מעבדת הציוד
            <br />
            המקיפה של{' '}
            <GradientText className="rounded-lg align-baseline bg-[#fbfcfe]">DES</GradientText>
          </h1>

          <p
            className="leading-relaxed"
            style={{
              margin: '26px 0 34px',
              fontSize: '1.2rem',
              color: '#5b6677',
              maxWidth: '29rem',
              animation: 'heroUp .8s cubic-bezier(.2,.7,.2,1) .2s both',
            }}
          >
            יבוא, אספקה ושירות לציוד דנטלי ורפואי מהמותגים המובילים בעולם — NSK · W&amp;H · KaVo · Nouvag · Bien-Air.
          </p>

          <div
            className="flex flex-wrap items-center gap-3.5"
            style={{ animation: 'heroUp .8s cubic-bezier(.2,.7,.2,1) .3s both' }}
          >
            <a
              href="https://wa.me/972548818681?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A7%D7%91%D7%9C%20%D7%94%D7%A6%D7%A2%D7%AA%20%D7%9E%D7%97%D7%99%D7%A8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold rounded-xl transition-all hover:-translate-y-0.5"
              style={{ background: '#128c7e', color: '#fff', padding: '14px 26px', boxShadow: '0 16px 34px -14px rgba(18,140,126,.75)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07a8.1 8.1 0 01-2.39-1.47 8.96 8.96 0 01-1.65-2.05c-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z" />
                <path d="M12.05 2a9.9 9.9 0 00-8.57 14.86L2 22l5.28-1.38A9.9 9.9 0 1012.05 2zm0 18.13c-1.62 0-3.2-.44-4.58-1.26l-.33-.2-3.13.82.84-3.06-.22-.34a8.23 8.23 0 116.94 3.8z" />
              </svg>
              קבלו הצעת מחיר עכשיו
            </a>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 font-bold rounded-xl transition-all hover:-translate-y-0.5"
              style={{ background: '#1a2b4a', color: '#fff', padding: '14px 26px', boxShadow: '0 16px 34px -14px rgba(26,43,74,.7)' }}
            >
              לקטלוג המוצרים
              <span style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>→</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center font-bold rounded-xl transition-all hover:-translate-y-0.5"
              style={{ color: '#1a2b4a', border: '1.5px solid #e8ecf0', background: '#fff', padding: '14px 26px' }}
            >
              דברו איתנו
            </Link>
          </div>
        </div>

        {/* visual */}
        <div
          className="relative flex justify-center items-center"
          style={{ padding: 18, animation: 'heroUp .9s cubic-bezier(.2,.7,.2,1) .2s both' }}
        >
          <ProductDeck />

          {/* floating cards */}
          <div
            className="absolute z-[6] flex items-center gap-3"
            style={{
              top: '7%', right: -10,
              background: 'rgba(255,255,255,.85)', backdropFilter: 'blur(10px)',
              border: '1px solid #fff', borderRadius: 16, padding: '13px 16px',
              boxShadow: '0 22px 50px -22px rgba(26,43,74,.5)', animation: 'heroFloat 6s ease-in-out infinite',
            }}
          >
            <span className="flex items-center justify-center flex-shrink-0" style={{ width: 34, height: 34, borderRadius: 10, background: '#e7f7ee', color: '#16a34a' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            </span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '.92rem', color: '#1a2b4a', lineHeight: 1.1 }}>ISO 9001 מוסמך</div>
              <div style={{ fontSize: '.72rem', color: '#9ba3af', marginTop: 2 }}>מערכת ניהול איכות</div>
            </div>
          </div>

          <div
            className="absolute z-[6] flex items-center gap-3"
            style={{
              bottom: '9%', left: -6,
              background: 'rgba(255,255,255,.85)', backdropFilter: 'blur(10px)',
              border: '1px solid #fff', borderRadius: 16, padding: '13px 16px',
              boxShadow: '0 22px 50px -22px rgba(26,43,74,.5)', animation: 'heroFloat 6.6s ease-in-out infinite .5s',
            }}
          >
            <span className="flex items-center justify-center flex-shrink-0" style={{ width: 34, height: 34, borderRadius: 10, background: '#e8f1fd', color: '#1e90ff' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 4 7v6c0 5 8 9 8 9s8-4 8-9V7z" /></svg>
            </span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '.92rem', color: '#1a2b4a', lineHeight: 1.1 }}>+10 מותגים בלעדיים</div>
              <div style={{ fontSize: '.72rem', color: '#9ba3af', marginTop: 2 }}>יבוא ושיווק רשמי</div>
            </div>
          </div>
        </div>
      </div>

      {/* stat row */}
      <div
        className="relative z-[3] flex max-w-[1300px] mx-auto px-6 lg:px-12"
        style={{ borderTop: '1px solid #e8ecf0', background: 'linear-gradient(180deg,#f7faff,#fbfcfe 60%)' }}
      >
        {STATS.map((s, i) => (
          <div
            key={s.l}
            className="flex-1 text-right"
            style={{ padding: '26px 10px', borderRight: i === 0 ? 'none' : '1px solid #e8ecf0' }}
          >
            <div style={{ fontSize: '2.05rem', fontWeight: 900, color: '#1a2b4a', letterSpacing: '-.02em' }}>
              {s.n}
              <span style={{ color: '#1e90ff' }}>{s.suf}</span>
            </div>
            <div style={{ fontSize: '.82rem', color: '#9ba3af', marginTop: 3 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes heroUp { from { opacity:0; transform:translateY(26px) } to { opacity:1; transform:translateY(0) } }
        @keyframes heroFloat { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-9px) } }
        @media (max-width:1023px){ .hero-stat-hide { display:none } }
      `}</style>
    </section>
  );
}
