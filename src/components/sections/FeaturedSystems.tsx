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
    image: 'https://likaubaiqrojlwqzoepp.supabase.co/storage/v1/object/public/products/8602320.jpg',
    imageAlt: 'LED Surtron 300 HP',
    imageCaption: 'LED Surtron 300 HP',
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
    image: 'https://likaubaiqrojlwqzoepp.supabase.co/storage/v1/object/public/products/8585131.jpg',
    imageAlt: 'Nouvag TCM 3000 BL',
    imageCaption: 'TCM 3000 BL',
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
              className="relative overflow-hidden"
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

              <div className="relative p-8 flex flex-col sm:flex-row-reverse gap-6 items-start">
                {/* Product photo — white inset card */}
                <div className="flex-shrink-0 self-center sm:self-end order-last sm:order-none">
                  <div
                    className="rounded-2xl p-3"
                    style={{ background: '#ffffff', boxShadow: '0 8px 28px rgba(0,0,0,0.35)' }}
                  >
                    <div className="relative w-36 h-36 sm:w-44 sm:h-44">
                      <Image
                        src={panel.image}
                        alt={panel.imageAlt}
                        fill
                        className="object-contain"
                        sizes="176px"
                      />
                    </div>
                    <p
                      className="text-center font-mono mt-1"
                      dir="ltr"
                      style={{ color: '#9ba3af', fontSize: '0.62rem', letterSpacing: '0.05em' }}
                    >
                      {panel.imageCaption}
                    </p>
                  </div>
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
                    className="text-sm leading-relaxed mb-6"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
