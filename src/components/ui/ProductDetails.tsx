import { CheckCircle2 } from 'lucide-react';

/**
 * Splits a structured description_he (intro + "תכונות עיקריות:" + "מפרט:"
 * blocks, bullet lines prefixed "• ") into parts. Unstructured descriptions
 * come back as { intro } only and render as plain pre-line text.
 */
export function parseDescription(desc: string | null | undefined) {
  if (!desc) return { intro: '', features: [] as string[], specs: [] as string[] };
  const blocks = desc.split(/\n\s*\n/);
  let intro = '';
  const features: string[] = [];
  const specs: string[] = [];
  const bullets = (b: string) => b.split('\n').slice(1).map((l) => l.replace(/^[•\-–]\s*/, '').trim()).filter(Boolean);
  for (const b of blocks) {
    const t = b.trim();
    if (t.startsWith('תכונות עיקריות:')) features.push(...bullets(t));
    else if (t.startsWith('מפרט:')) specs.push(...bullets(t));
    else intro = intro ? `${intro}\n\n${t}` : t;
  }
  return { intro, features, specs };
}

export default function ProductDetails({ features, specs }: { features: string[]; specs: string[] }) {
  if (!features.length && !specs.length) return null;
  return (
    <section dir="rtl" className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start" aria-label="פרטי המוצר">
      {features.length > 0 && (
        <div className="rounded-2xl p-5 sm:p-7 bg-white" style={{ border: '1px solid #e8ecf0' }}>
          <h2 className="text-lg sm:text-xl font-bold mb-4" style={{ color: '#1a2b4a' }}>תכונות עיקריות</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            {features.map((f, i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-gray-700">
                <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: '#1e90ff' }} />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {specs.length > 0 && (
        <div className="rounded-2xl p-5 sm:p-7" style={{ background: '#1a2b4a', color: '#fff' }}>
          <h2 className="text-lg sm:text-xl font-bold mb-4">מפרט טכני</h2>
          <dl>
            {specs.map((s, i) => {
              const idx = s.indexOf(':');
              const k = idx > 0 ? s.slice(0, idx).trim() : '';
              const v = idx > 0 ? s.slice(idx + 1).trim() : s;
              return (
                <div key={i} className="flex justify-between gap-4 py-2.5 text-sm" style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                  {k && <dt className="opacity-70 flex-shrink-0">{k}</dt>}
                  <dd className="font-semibold text-left" dir="auto">{v}</dd>
                </div>
              );
            })}
          </dl>
        </div>
      )}
    </section>
  );
}
