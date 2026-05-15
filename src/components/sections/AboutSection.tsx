'use client';
import Link from 'next/link';
import type { ReactNode } from 'react';

function CertCard({
  title,
  subtitle,
  detail,
  color,
  icon,
}: {
  title: string;
  subtitle: string;
  detail: string;
  color: string;
  icon: ReactNode;
}) {
  return (
    <div
      className="relative rounded-xl p-5 overflow-hidden"
      style={{
        background: '#fff',
        border: `1px solid ${color}30`,
        boxShadow: `0 2px 16px rgba(0,0,0,0.06), inset 0 0 0 1px ${color}18`,
      }}
    >
      {/* Corner watermark */}
      <div
        className="absolute -top-4 -left-4 w-20 h-20 rounded-full opacity-[0.07]"
        style={{ background: color }}
      />

      {/* Icon */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
        style={{ background: `${color}12`, border: `1px solid ${color}25` }}
      >
        <span style={{ color }}>{icon}</span>
      </div>

      {/* Cert type */}
      <div
        className="text-xs font-bold tracking-wider uppercase mb-1"
        style={{ color, letterSpacing: '0.12em' }}
      >
        {title}
      </div>
      <div className="font-black text-gray-900 text-base leading-tight mb-2">{subtitle}</div>
      <div className="text-xs text-gray-500 leading-relaxed">{detail}</div>

      {/* "CERTIFIED" stamp */}
      <div
        className="absolute bottom-4 left-4 text-xs font-black tracking-[0.2em] uppercase rotate-[-12deg] opacity-10"
        style={{ color, fontSize: '0.55rem' }}
      >
        CERTIFIED
      </div>
    </div>
  );
}

export default function AboutSection() {
  return (
    <section
      dir="rtl"
      className="py-16 lg:py-24 bg-white overflow-hidden"
      aria-label="אודות DES"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-16 items-start">

          {/* ── Left column: "1998" + founding story ── */}
          <div className="relative">
            {/* "1998" as huge decorative type */}
            <div
              className="font-black select-none leading-none mb-6"
              style={{
                fontSize: 'clamp(5rem, 14vw, 10rem)',
                color: 'transparent',
                WebkitTextStroke: '2px #e8eaed',
                letterSpacing: '-0.04em',
                lineHeight: 0.85,
              }}
              aria-hidden="true"
            >
              1998
            </div>

            {/* Pre-heading */}
            <p
              className="text-xs font-semibold tracking-[0.22em] uppercase mb-3"
              style={{ color: '#1e90ff' }}
            >
              מאז 1998
            </p>

            {/* Heading */}
            <h2
              className="font-black leading-tight mb-5"
              style={{
                color: '#0d1929',
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
              }}
            >
              אודות DES
            </h2>

            {/* Story */}
            <div className="space-y-4 text-gray-600 leading-relaxed text-sm lg:text-base">
              <p>
                DES נוסדה ב-1998 על ידי מיכאל שפוליאנסקי ומתמחה ביבוא, שיווק ושירות של ציוד דנטלי
                ורפואי מהמותגים המובילים בעולם: NSK, W&amp;H, KaVo, MK-dent, Nouvag, Bien-Air,
                Anthogyr, Dentsply Sirona ו-JINME.
              </p>
              <p>
                החברה מחזיקה ברישיון אמ&quot;ר ממשרד הבריאות ומוסמכת ISO 9001 — ערובה לאיכות
                ואמינות בכל תהליך, מהייבוא ועד האחריות וטיפול שוטף בציוד.
              </p>
              <p>
                בין לקוחותינו: שירותי בריאות כללית, מכבי דנט, בית חולים איכילוב, Atidant, Lorian
                Medic ועוד.
              </p>
            </div>

            {/* Contact details */}
            <div
              className="mt-8 space-y-2 text-sm"
              style={{ color: '#6b7280' }}
            >
              <div className="flex items-center gap-2">
                <span style={{ color: '#1e90ff' }}>◈</span>
                <span>רח&apos; מסריק 23, בת ים</span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ color: '#1e90ff' }}>◈</span>
                <a href="tel:035081868" className="hover:text-[#1e90ff] transition-colors" dir="ltr">
                  03-5081868
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ color: '#1e90ff' }}>◈</span>
                <a href="mailto:info@destec.co.il" className="hover:text-[#1e90ff] transition-colors">
                  info@destec.co.il
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ color: '#1e90ff' }}>◈</span>
                <span>ע&quot;מ 310737085</span>
              </div>
            </div>

            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2.5 font-semibold text-sm px-7 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: '#0d1929', color: '#fff' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#1e90ff'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#0d1929'; }}
            >
              צור קשר
              <span style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>→</span>
            </Link>
          </div>

          {/* ── Right column: certification cards ── */}
          <div className="flex flex-col gap-5 lg:pt-8">
            {/* Intro */}
            <div
              className="text-sm font-medium mb-2"
              style={{ color: '#9ba3af', letterSpacing: '0.03em' }}
            >
              הסמכות ורישיונות
            </div>

            <CertCard
              title="ISO 9001"
              subtitle="מוסמך לניהול איכות"
              detail="ARS מספר אישור #260225019743 · בתוקף עד 25 פברואר 2027 · מכסה את כל תהליכי הייבוא, השיווק והשירות."
              color="#1e90ff"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              }
            />

            <CertCard
              title='רישיון אמ"ר'
              subtitle="יבואן מורשה — משרד הבריאות"
              detail='רישיון אמ"ר לייבוא ציוד דנטלי ורפואי בישראל. ציות מלא לתקנות הבריאות הישראליות ולדירקטיבות CE האירופאיות.'
              color="#22c55e"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              }
            />

            {/* Client logos mini strip */}
            <div
              className="rounded-xl p-5"
              style={{ background: '#f7f8fa', border: '1px solid #eaecf0' }}
            >
              <div
                className="text-xs font-semibold tracking-wider uppercase mb-4"
                style={{ color: '#9ba3af' }}
              >
                לקוחות מרכזיים
              </div>
              <div className="flex flex-wrap gap-2">
                {['כללית', 'מכבי דנט', 'איכילוב', 'Atidant', 'Lorian Medic'].map((client) => (
                  <span
                    key={client}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg"
                    style={{ background: '#fff', border: '1px solid #e2e5ea', color: '#374151' }}
                  >
                    {client}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
