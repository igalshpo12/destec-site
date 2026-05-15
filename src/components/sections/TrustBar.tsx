import { ShieldCheck, Award, Package, Clock } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: Award,
    label: 'ISO 9001 מוסמך',
    sub: 'ARS #260225019743',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
  },
  {
    icon: ShieldCheck,
    label: 'רישיון אמ"ר',
    sub: 'משרד הבריאות',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Package,
    label: '9,000+ מוצרים',
    sub: 'במלאי מיידי',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    icon: Clock,
    label: 'ניסיון של עשרות שנים',
    sub: 'בשוק מאז 1998',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
];

export default function TrustBar() {
  return (
    <section
      dir="rtl"
      className="bg-white border-b border-gray-100 py-5"
      aria-label="אמינות ואחריות"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {TRUST_ITEMS.map(({ icon: Icon, label, sub, color, bg }) => (
            <div
              key={label}
              className="flex items-center gap-3 p-3 rounded-xl hover:shadow-sm transition-shadow"
            >
              <div className={`${bg} rounded-full p-2.5 flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm leading-tight">{label}</p>
                <p className="text-gray-500 text-xs mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
