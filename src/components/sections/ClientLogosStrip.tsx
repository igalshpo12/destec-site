// "לקוחות מרכזיים" — real client logos (owner 2026-11-14: "fetch their logos instead of those
// colors"). Logos come from each organisation's own site (Clalit: Hebrew Wikipedia) and live in
// public/clients/. A client without a findable logo keeps a plain name chip until one is supplied.
// "המרכז הרפואי ת"א" was dropped: it is Ichilov itself (the Ichilov logo already reads
// "המרכז הרפואי האוניברסיטאי תל אביב").
type Client = { name: string; logo?: string; dark?: boolean };

const CLIENTS: Client[] = [
  { name: 'שירותי בריאות כללית', logo: '/clients/clalit.svg' },
  { name: 'מכבידנט', logo: '/clients/maccabi-dent.svg' },
  { name: 'איכילוב — המרכז הרפואי תל אביב', logo: '/clients/ichilov.svg' },
  // white-lettered logo: shown on a navy tile so the whole mark reads
  { name: 'לוריאן מדיקל', logo: '/clients/lorian-medic.png', dark: true },
  { name: 'מרפאות שיניים ד"ר שוורץ', logo: '/clients/schwartz.png' },
  { name: 'Atidant' },
  { name: 'Mardent' },
];

export default function ClientLogosStrip() {
  return (
    <section
      dir="rtl"
      className="py-12"
      style={{ background: '#ffffff', borderTop: '1px solid #e8ecf0' }}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <p
          className="text-center text-xs font-semibold tracking-[0.2em] uppercase mb-6"
          style={{ color: '#9ba3af' }}
        >
          לקוחות מרכזיים
        </p>

        <ul className="flex flex-wrap items-center justify-center gap-3 sm:gap-4" aria-label="לקוחות מרכזיים">
          {CLIENTS.map((c) => (
            <li
              key={c.name}
              className="flex items-center justify-center rounded-xl px-5"
              style={{
                height: 72,
                minWidth: 150,
                background: c.dark ? '#1a2b4a' : '#fff',
                border: '1px solid #eaecf0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              {c.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.logo}
                  alt={c.name}
                  title={c.name}
                  loading="lazy"
                  style={{ maxHeight: 44, maxWidth: 170, width: 'auto', height: 'auto', objectFit: 'contain' }}
                />
              ) : (
                <span className="text-base font-semibold whitespace-nowrap" style={{ color: '#374151' }}>
                  {c.name}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
