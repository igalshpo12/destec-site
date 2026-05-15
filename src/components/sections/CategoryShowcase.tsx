import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

const CATEGORIES = [
  {
    slug: 'turbines',
    label: 'טורבינות',
    sublabel: 'Turbines',
    desc: 'טורבינות אוויר במהירות גבוהה',
    bg: 'from-blue-900 to-[#1a2b4a]',
    accent: '#1e90ff',
  },
  {
    slug: 'angles',
    label: 'זוויתנים',
    sublabel: 'Contra-Angles',
    desc: 'זוויתנים ישרים וכפופים',
    bg: 'from-teal-900 to-[#0d2447]',
    accent: '#00c6a7',
  },
  {
    slug: 'handpieces',
    label: 'ידיתנים',
    sublabel: 'Handpieces',
    desc: 'ידיתנים לכל שימוש קליני',
    bg: 'from-purple-900 to-[#1a1040]',
    accent: '#9b59b6',
  },
  {
    slug: 'drills',
    label: 'מקדחים',
    sublabel: 'Drills',
    desc: 'מקדחים לאימפלנטולוגיה',
    bg: 'from-orange-900 to-[#3d1a00]',
    accent: '#e67e22',
  },
  {
    slug: 'scalers',
    label: 'סקילרים',
    sublabel: 'Scalers',
    desc: 'סקילרים אולטרסוניים ופנאומטיים',
    bg: 'from-green-900 to-[#0a2d1a]',
    accent: '#27ae60',
  },
];

export default function CategoryShowcase() {
  return (
    <section dir="rtl" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#1a2b4a]">קטגוריות מוצרים</h2>
          <Link href="/catalog" className="text-sm text-[#1e90ff] hover:underline flex items-center gap-1">
            כל הקטגוריות
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/catalog?category=${cat.slug}`}
              className={`relative flex flex-col justify-end p-5 rounded-2xl aspect-[3/4] bg-gradient-to-b ${cat.bg} text-white overflow-hidden group hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
              aria-label={cat.label}
            >
              {/* Decorative circle */}
              <div
                className="absolute top-4 right-4 w-16 h-16 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"
                style={{ background: cat.accent }}
              />

              {/* Text */}
              <div>
                <p className="text-xs font-medium tracking-wider mb-1" style={{ color: cat.accent }}>
                  {cat.sublabel}
                </p>
                <h3 className="text-xl font-bold leading-tight">{cat.label}</h3>
                <p className="text-white/60 text-xs mt-1">{cat.desc}</p>
              </div>

              {/* Arrow */}
              <div
                className="mt-4 inline-flex items-center gap-1 text-xs font-medium"
                style={{ color: cat.accent }}
              >
                לצפייה &#x2190;
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
