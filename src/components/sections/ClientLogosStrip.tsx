const CLIENTS = [
  { name: 'שירותי בריאות כללית', short: 'כללית', color: '#e74c3c' },
  { name: 'מכבי דנט', short: 'מכבי', color: '#27ae60' },
  { name: 'איכילוב', short: 'איכילוב', color: '#2980b9' },
  { name: 'בית חולים ברזילי', short: 'ברזילי', color: '#8e44ad' },
  { name: 'Atidant', short: 'Atidant', color: '#d35400' },
  { name: 'Lorian Medic', short: 'Lorian', color: '#16a085' },
  { name: 'Schwartz', short: 'Schwartz', color: '#2c3e50' },
  { name: 'Mardent', short: 'Mardent', color: '#c0392b' },
  { name: 'המרכז הרפואי ת"א', short: 'ת"א מד', color: '#1e3a6e' },
];

export default function ClientLogosStrip() {
  return (
    <section dir="rtl" className="py-12 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-xl font-bold text-[#1a2b4a] mb-2">לקוחות DES</h2>
        <p className="text-center text-gray-500 text-sm mb-8">
          בין לקוחותינו הנאמנים נמנים בתי חולים, קופות חולים וקליניקות פרטיות מובילות
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {CLIENTS.map((c) => (
            <div
              key={c.name}
              className="bg-white border border-gray-100 rounded-xl px-5 py-3 flex items-center gap-3 hover:shadow-md transition-shadow"
              title={c.name}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: c.color }}
              >
                {c.short.charAt(0)}
              </div>
              <span className="text-gray-700 font-medium text-sm whitespace-nowrap">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
