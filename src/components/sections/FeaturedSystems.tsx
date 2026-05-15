import Link from 'next/link';

const SYSTEMS = [
  {
    manufacturer: 'Nouvag',
    origin: 'Switzerland',
    title: 'מנועי כירורגיה',
    titleSub: 'Nouvag',
    tagline: 'דיוק מרבי בכל השתלה',
    description:
      'מנועי Nouvag מביאים דיוק וביצועים חסרי פשרות לכירורגיה אוראלית ואימפלנטולוגיה. הבחירה הראשונה של כירורגים מובילים בישראל.',
    specs: [
      { label: 'טווח מהירות', value: '200–40,000 סל"ד' },
      { label: 'מומנט', value: 'גבוה ל-Bone surgery' },
      { label: 'תאורה', value: 'LED fiber optic' },
      { label: 'כבל', value: 'סיבים אופטיים' },
    ],
    cta: { label: 'מנועי Nouvag', href: '/catalog?manufacturer=Nouvag' },
    accent: '#00c6a7',
    bg: '#07121e',
    borderColor: '#0a2e28',
    numBg: '#071a16',
  },
  {
    manufacturer: 'SURTRON',
    origin: 'Electrosurgery Unit',
    title: 'אלקטרוכירורגיה',
    titleSub: 'SURTRON',
    tagline: 'חתך מדויק, קאוטריזציה מבוקרת',
    description:
      'מכשיר SURTRON לאלקטרוכירורגיה מאפשר עבודה מדויקת ברקמות רכות. טכנולוגיה מוכחת, ממשק פשוט, בטיחות מרבית למטופל.',
    specs: [
      { label: 'מצב', value: 'ביפולרי / מונופולרי' },
      { label: 'שליטה', value: 'הגדרות דיגיטליות' },
      { label: 'ידיות', value: 'חד-פעמיות' },
      { label: 'בטיחות', value: 'מונע כוויות' },
    ],
    cta: { label: 'ציוד כירורגי', href: '/catalog?category=surgery' },
    accent: '#9b59b6',
    bg: '#0e0717',
    borderColor: '#22093a',
    numBg: '#130820',
  },
];

export default function FeaturedSystems() {
  return (
    <section
      dir="rtl"
      className="relative overflow-hidden"
      style={{ background: '#070e1a' }}
      aria-label="מערכות מובחרות"
    >
      {/* Top border line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }}
      />

      {/* Section header */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-16 pb-10">
        <p
          className="text-xs font-semibold tracking-[0.2em] uppercase mb-2"
          style={{ color: '#1e90ff' }}
        >
          מערכות מובחרות
        </p>
        <h2
          className="font-black text-white"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
        >
          טכנולוגיה מוכחת
        </h2>
      </div>

      {/* Two-panel grid */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {SYSTEMS.map((sys) => (
            <div
              key={sys.manufacturer}
              className="group relative overflow-hidden rounded-2xl"
              style={{
                background: sys.bg,
                border: `1px solid ${sys.borderColor}`,
              }}
            >
              {/* Hover animated border glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  boxShadow: `inset 0 0 0 1px ${sys.accent}30`,
                }}
              />

              {/* Subtle pattern */}
              <div
                className="absolute inset-0 opacity-[0.035] pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(${sys.accent} 1px, transparent 1px), linear-gradient(90deg, ${sys.accent} 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                }}
              />

              {/* Corner accent */}
              <div
                className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at top right, ${sys.accent}15, transparent 65%)`,
                }}
              />

              <div className="relative z-10 p-8 lg:p-10">
                {/* Origin badge */}
                <div className="flex items-center gap-3 mb-8">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full tracking-wider"
                    style={{
                      background: `${sys.accent}15`,
                      color: sys.accent,
                      border: `1px solid ${sys.accent}30`,
                    }}
                  >
                    {sys.origin}
                  </span>
                  <div className="h-px flex-1" style={{ background: `${sys.accent}20` }} />
                </div>

                {/* Title */}
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}
                >
                  {sys.title}
                </p>
                <h3
                  className="font-black text-white mb-2"
                  style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', lineHeight: 1.05 }}
                >
                  {sys.titleSub}
                </h3>
                <p
                  className="text-sm font-semibold mb-5"
                  style={{ color: sys.accent }}
                >
                  {sys.tagline}
                </p>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed mb-8"
                  style={{ color: 'rgba(255,255,255,0.55)', maxWidth: '380px' }}
                >
                  {sys.description}
                </p>

                {/* Specs grid */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {sys.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="rounded-lg p-3"
                      style={{ background: sys.numBg, border: `1px solid ${sys.borderColor}` }}
                    >
                      <div
                        className="text-xs mb-0.5"
                        style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}
                      >
                        {spec.label}
                      </div>
                      <div
                        className="text-sm font-bold"
                        style={{ color: 'rgba(255,255,255,0.9)' }}
                        dir="rtl"
                      >
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={sys.cta.href}
                  className="inline-flex items-center gap-2.5 font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                  style={{
                    background: sys.accent,
                    color: '#fff',
                  }}
                >
                  {sys.cta.label}
                  <span style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
