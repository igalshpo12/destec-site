'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    tagline: 'ציוד דנטלי מהמותגים המובילים',
    headline: 'NSK · W&H · KaVo',
    subline: 'יבואן מורשה — ישירות מהיצרן לקליניקה שלך',
    cta: { label: 'לצפייה בקטלוג', href: '/catalog' },
    bg: 'from-[#0d1b30] via-[#1a2b4a] to-[#1e3a6a]',
    accent: '#1e90ff',
  },
  {
    id: 2,
    tagline: 'מנועי כירורגיה — Nouvag',
    headline: 'דיוק, ביצועים, אמינות',
    subline: '9,000+ מוצרים במלאי · אחריות יצרן · תמיכה מקצועית',
    cta: { label: 'ציוד כירורגי', href: '/catalog?category=surgery' },
    bg: 'from-[#0a1628] via-[#1a2b4a] to-[#0d2447]',
    accent: '#00c6a7',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [paused, next]);

  const slide = SLIDES[current];

  return (
    <section
      dir="rtl"
      className={`relative overflow-hidden bg-gradient-to-l ${slide.bg} transition-all duration-700`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="סליידר ראשי"
    >
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/3" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{ background: `radial-gradient(circle, ${slide.accent}, transparent 70%)` }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 lg:py-36 flex flex-col items-start justify-center min-h-[420px]">
        {/* Tagline */}
        <span
          className="inline-block text-sm font-medium px-4 py-1.5 rounded-full mb-4 text-white"
          style={{ background: `${slide.accent}30`, border: `1px solid ${slide.accent}60` }}
        >
          {slide.tagline}
        </span>

        {/* Headline */}
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight max-w-2xl"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
        >
          {slide.headline}
        </h1>

        {/* Subline */}
        <p className="text-lg text-white/70 mb-8 max-w-xl leading-relaxed">
          {slide.subline}
        </p>

        {/* CTA */}
        <Link
          href={slide.cta.href}
          className="inline-flex items-center gap-2 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 hover:opacity-90 hover:scale-105 active:scale-95"
          style={{ background: slide.accent }}
        >
          {slide.cta.label}
          <ChevronLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all backdrop-blur-sm"
        aria-label="הקודם"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all backdrop-blur-sm"
        aria-label="הבא"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? '24px' : '8px',
              height: '8px',
              background: i === current ? slide.accent : 'rgba(255,255,255,0.35)',
            }}
            aria-label={`סליידר ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
