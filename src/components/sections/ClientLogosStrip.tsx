const CLIENTS = [
  { name: 'שירותי בריאות כללית', color: '#e74c3c' },
  { name: 'מכבי דנט',            color: '#27ae60' },
  { name: 'איכילוב',              color: '#2980b9' },
  { name: 'Atidant',              color: '#d35400' },
  { name: 'Lorian Medic',         color: '#16a085' },
  { name: 'Schwartz',             color: '#2c3e50' },
  { name: 'Mardent',              color: '#c0392b' },
  { name: 'המרכז הרפואי ת"א',    color: '#1e3a6e' },
];

export default function ClientLogosStrip() {
  return (
    <section
      dir="rtl"
      className="py-12"
      style={{ background: '#ffffff', borderTop: '1px solid #e8ecf0' }}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Label */}
        <p
          className="text-center text-xs font-semibold tracking-[0.2em] uppercase mb-6"
          style={{ color: '#9ba3af' }}
        >
          לקוחות מרכזיים
        </p>

        {/* Client tags */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {CLIENTS.map((c) => (
            <div
              key={c.name}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg transition-all duration-200"
              style={{
                background: '#fff',
                border: '1px solid #eaecf0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                style={{ background: c.color, fontSize: '0.6rem' }}
              >
                {c.name.charAt(0)}
              </div>
              <span
                className="text-sm font-medium whitespace-nowrap"
                style={{ color: '#374151' }}
              >
                {c.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
