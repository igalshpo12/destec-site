import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

const SYSTEMS = [
  {
    manufacturer: 'Nouvag',
    title: 'מנועי כירורגיה Nouvag',
    description:
      'מנועי הכירורגיה המתקדמים של Nouvag מביאים דיוק מרבי לכל תהליך השתלות וכירורגיה אוראלית. מהירות משתנה, מומנט גבוה, ממשק אינטואיטיבי — הבחירה הראשונה של כירורגים מובילים בישראל.',
    features: ['מהירות 200–40,000 סל"ד', 'מומנט גבוה ל-bone surgery', 'תצוגת LED', 'כבל סיבים אופטיים'],
    cta: { label: 'מנועי Nouvag בקטלוג', href: '/catalog?manufacturer=Nouvag&category=motors' },
    bg: 'bg-gradient-to-l from-[#0d2447] to-[#1a2b4a]',
    accent: '#00c6a7',
    badge: 'Nouvag · Switzerland',
  },
  {
    manufacturer: 'SURTRON',
    title: 'SURTRON — אלקטרוכירורגיה',
    description:
      'מכשיר ה-SURTRON לאלקטרוכירורגיה מאפשר חתך מדויק וקאוטריזציה מבוקרת ברקמות רכות בפה. טכנולוגיה מוכחת, ידנית קלת משקל, בטיחות מרבית למטופל.',
    features: ['קאוטריזציה ביפולרית/מונופולרית', 'הגדרות דיגיטליות', 'ידיות חד-פעמיות', 'תיעוד מדויק'],
    cta: { label: 'ציוד כירורגי בקטלוג', href: '/catalog?category=surgery' },
    bg: 'bg-gradient-to-l from-[#1a0d30] to-[#2d1a4a]',
    accent: '#9b59b6',
    badge: 'Electrosurgery Unit',
  },
];

export default function FeaturedSystems() {
  return (
    <section dir="rtl" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-[#1a2b4a] mb-8">מערכות מובחרות</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {SYSTEMS.map((sys) => (
            <div
              key={sys.title}
              className={`relative ${sys.bg} rounded-2xl p-8 text-white overflow-hidden group`}
            >
              {/* Background decoration */}
              <div
                className="absolute -top-12 -left-12 w-56 h-56 rounded-full opacity-10 group-hover:opacity-15 transition-opacity"
                style={{ background: sys.accent }}
              />
              <div
                className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full opacity-5"
                style={{ background: sys.accent }}
              />

              <div className="relative z-10">
                {/* Badge */}
                <span
                  className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4"
                  style={{ background: `${sys.accent}25`, border: `1px solid ${sys.accent}50`, color: sys.accent }}
                >
                  {sys.badge}
                </span>

                <h3 className="text-2xl font-bold mb-3">{sys.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-5">{sys.description}</p>

                {/* Features */}
                <ul className="grid grid-cols-2 gap-2 mb-6">
                  {sys.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/80">
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: sys.accent }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={sys.cta.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:opacity-90 hover:scale-105 active:scale-95"
                  style={{ background: sys.accent, color: '#fff' }}
                >
                  {sys.cta.label}
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
