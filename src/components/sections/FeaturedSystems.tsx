import Link from 'next/link';
import Image from 'next/image';

const PANELS = [
  {
    pill: 'Electrosurgery Unit',
    pillBg: '#1e90ff',
    heading: 'SURTRON',
    subtitle: 'מכשירי אלקטרוכירורגיה',
    description: 'מכשירי SURTRON לאלקטרוכירורגיה מאפשרים עבודה מדויקת ברקמות רכות',
    spec: 'ביפולרי / מונופולרי · הגנות דיגיטליות',
    cta: 'ציוד כירורגי',
    href: '/catalog?category=surgery',
    hero: { src: '/products/cutouts/surtron-300hp.webp', alt: 'LED Surtron 300 HP', caption: 'LED Surtron 300 HP' },
    more: [
      { src: '/products/cutouts/surtron-400hp.webp', label: 'Surtron 400 HP', q: 'Surtron 400' },
      { src: '/products/cutouts/surtron-80d.webp', label: 'Surtron 80d', q: 'Surtron 80d' },
      { src: '/products/cutouts/surtron-50d.webp', label: 'Surtron 50d', q: 'Surtron 50d' },
    ],
  },
  {
    pill: 'Switzerland',
    pillBg: '#c0392b',
    heading: 'Nouvag',
    subtitle: 'מנועי כירורגיה',
    description: 'מנועי Nouvag השוויצריים מביאים דיוק מרבי לכירורגיה ולהשתלות',
    spec: 'Bone surgery · שליטה דיגיטלית',
    cta: 'מנועי Nouvag',
    href: '/catalog?manufacturer=NOUVAG',
    hero: { src: '/products/cutouts/tcm-3000bl.webp', alt: 'Nouvag TCM 3000 BL', caption: 'TCM 3000 BL' },
    more: [
      { src: '/products/cutouts/vacuson-60.webp', label: 'Vacuson 60 LP', q: 'Vacuson' },
      { src: '/products/cutouts/microsaws.webp', label: 'MicroSaws', q: 'MicroSaws' },
      { src: '/products/cutouts/lipocart.webp', label: 'LipoCart', q: 'LipoCart' },
    ],
  },
];

export default function FeaturedSystems() {
  return (
    <section
      dir="rtl"
      className="relative overflow-hidden py-16"
      style={{ background: '#f7f8fa' }}
      aria-label="מערכות מובחרות"
    >
      {/* Section header */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-10">
        <p
          className="text-xs font-semibold tracking-[0.2em] uppercase mb-2"
          style={{ color: '#1e90ff' }}
        >
          מערכות מובחרות
        </p>
        <h2
          className="font-black"
          style={{ color: '#1a2b4a', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
        >
          טכנולוגיה מוכחת
        </h2>
      </div>

      {/* Two-panel grid */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {PANELS.map((panel) => (
            <div
              key={panel.heading}
              className="relative overflow-hidden flex flex-col"
              style={{
                borderRadius: '16px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                background: '#12203a url(/images/brand-plate-navy.webp) center/cover no-repeat',
              }}
            >
              {/* Legibility overlay — darker on the text (right) side */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(270deg, rgba(13,25,41,0.82) 0%, rgba(13,25,41,0.55) 55%, rgba(13,25,41,0.25) 100%)',
                }}
              />

              {/* Top accent bar */}
              <div
                className="relative"
                style={{ height: '3px', background: '#1e90ff', borderRadius: '16px 16px 0 0' }}
              />

              <div className="relative p-8 flex flex-col sm:flex-row-reverse gap-6 items-start flex-1">
                {/* Hero product — cutout floating on the plate */}
                <div className="flex-shrink-0 self-center sm:self-end order-last sm:order-none flex flex-col items-center gap-2">
                  <div
                    className="relative w-44 h-40 sm:w-56 sm:h-48"
                    style={{ filter: 'drop-shadow(0 18px 26px rgba(0,0,0,0.55))' }}
                  >
                    <Image
                      src={panel.hero.src}
                      alt={panel.hero.alt}
                      fill
                      className="object-contain"
                      sizes="224px"
                    />
                  </div>
                  {/* soft floor glow under the device */}
                  <div
                    className="w-3/4 h-2 rounded-full -mt-1"
                    style={{ background: 'radial-gradient(ellipse, rgba(94,178,255,0.28) 0%, transparent 70%)' }}
                  />
                  <p
                    className="font-mono"
                    dir="ltr"
                    style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.65rem', letterSpacing: '0.06em' }}
                  >
                    {panel.hero.caption}
                  </p>
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <span
                    className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-6"
                    style={{ background: panel.pillBg, color: '#ffffff', letterSpacing: '0.06em' }}
                  >
                    {panel.pill}
                  </span>

                  <h3
                    className="font-black mb-1"
                    style={{
                      color: '#ffffff',
                      fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                      lineHeight: 1.05,
                    }}
                  >
                    {panel.heading}
                  </h3>

                  <p className="font-semibold mb-4" style={{ color: '#5eb2ff', fontSize: '1rem' }}>
                    {panel.subtitle}
                  </p>

                  <p
                    className="text-sm leading-relaxed mb-5"
                    style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '380px' }}
                  >
                    {panel.description}
                  </p>

                  <div
                    className="text-sm font-medium px-4 py-2.5 rounded-lg mb-6 inline-block"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      color: '#dbeafe',
                      border: '1px solid rgba(94,178,255,0.35)',
                    }}
                  >
                    {panel.spec}
                  </div>

                  <div className="block" />

                  <Link
                    href={panel.href}
                    className="inline-flex items-center gap-2.5 font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: '#1e90ff', color: '#fff' }}
                  >
                    {panel.cta}
                    <span style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>→</span>
                  </Link>
                </div>
              </div>

              {/* More-products strip */}
              <div
                className="relative flex items-stretch gap-2 px-6 py-4"
                style={{ borderTop: '1px solid rgba(94,178,255,0.18)', background: 'rgba(9,17,31,0.45)' }}
              >
                {panel.more.map((m) => (
                  <Link
                    key={m.label}
                    href={`/catalog?q=${encodeURIComponent(m.q)}`}
                    className="group flex-1 flex flex-col items-center gap-1.5 rounded-xl px-2 py-2.5 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <div
                      className="relative w-full h-12 transition-transform duration-200 group-hover:scale-105"
                      style={{ filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.5))' }}
                    >
                      <Image src={m.src} alt={m.label} fill className="object-contain" sizes="120px" />
                    </div>
                    <span
                      className="font-mono text-center"
                      dir="ltr"
                      style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.6rem', letterSpacing: '0.04em' }}
                    >
                      {m.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
