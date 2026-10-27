import ajaxData from '../../../data/ajax-products.json';

/**
 * Feature-highlight grid for the spotlighted AJAX units (AJ15 / AJ25).
 * Images live in public/ajax/<slug>/ (re-hosted from ajaxdent.com); captions
 * come from data/ajax-products.json so copy and assets stay in one place.
 */
type Entry = { slug: string; model: string; gallery?: [string, string][] };

export default function AjaxFeatureGallery({ model }: { model: string | null | undefined }) {
  if (!model) return null;
  const entry = (ajaxData.products as Entry[]).find((p) => p.model === model && p.gallery?.length);
  if (!entry || !entry.gallery) return null;

  return (
    <section dir="rtl" className="mt-14" aria-labelledby="ajax-features">
      <div className="flex items-baseline justify-between gap-4 mb-5">
        <h2 id="ajax-features" className="text-xl sm:text-2xl font-bold" style={{ color: '#1a2b4a' }}>
          {entry.model} מקרוב
        </h2>
        <span className="text-xs text-gray-400">תמונות: AJAX Dental</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {entry.gallery.map(([id, caption]) => {
          const n = id.split('-')[1];
          return (
            <figure
              key={id}
              className="rounded-2xl overflow-hidden bg-white flex flex-col"
              style={{ border: '1px solid #e8ecf0' }}
            >
              <div className="aspect-[4/3] flex items-center justify-center overflow-hidden" style={{ background: '#f8f9fb' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/ajax/${entry.slug}/${n}.webp`}
                  alt={caption}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="px-3 py-2.5 text-xs sm:text-sm font-medium leading-snug" style={{ color: '#1a2b4a' }}>
                {caption}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
