const SUPPLIERS = [
  { name: 'NSK', country: 'Japan', color: '#c0392b', textColor: '#fff' },
  { name: 'W&H', country: 'Austria', color: '#1e3a6e', textColor: '#fff' },
  { name: 'KaVo', country: 'Germany', color: '#005baa', textColor: '#fff' },
  { name: 'MK-dent', country: 'Germany', color: '#e67e22', textColor: '#fff' },
  { name: 'Nouvag', country: 'Switzerland', color: '#27ae60', textColor: '#fff' },
  { name: 'Bien-Air', country: 'Switzerland', color: '#2c3e50', textColor: '#fff' },
  { name: 'Anthogyr', country: 'France', color: '#8e44ad', textColor: '#fff' },
  { name: 'Dentsply Sirona', country: 'USA/Germany', color: '#00589b', textColor: '#fff' },
  { name: 'JINME', country: 'China', color: '#c0392b', textColor: '#fff' },
];

export default function SupplierLogoStrip() {
  return (
    <section dir="rtl" className="py-12 bg-white border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-xl font-bold text-[#1a2b4a] mb-2">הספקים שלנו</h2>
        <p className="text-center text-gray-500 text-sm mb-8">
          DES הינו יבואן מורשה ומפיץ רשמי של כל המותגים הבאים בישראל
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3">
          {SUPPLIERS.map((s) => (
            <div
              key={s.name}
              className="group flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 cursor-default"
              title={`${s.name} — ${s.country}`}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-xs mb-2 group-hover:scale-110 transition-transform"
                style={{ background: s.color, color: s.textColor }}
              >
                {s.name.length > 4 ? s.name.slice(0, 4) : s.name}
              </div>
              <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{s.name}</span>
              <span className="text-xs text-gray-400">{s.country}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
