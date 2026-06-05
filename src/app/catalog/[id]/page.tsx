import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase, EquipmentWithPrice } from '@/lib/supabase';
import { formatPrice, CATEGORY_LABELS, CATALOG_LIVE } from '@/lib/utils';
import { MessageCircle, ChevronLeft, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

const CATEGORIES_WITH_IMAGES = new Set([
  'turbines', 'angles', 'handpieces', 'drills', 'motors',
  'sterilization', 'electrosurgery', 'surgery',
]);

async function fetchOne(id: string): Promise<EquipmentWithPrice | null> {
  const { data, error } = await supabase
    .from('equipment')
    .select(
      `id, item_number, name_he, name_en, manufacturer, model, category,
       description_he, description_en, is_active,
       warranty_purchase_months, warranty_repair_months, warranty_manufacturer_months,
       image_url, equipment_prices(tier, price, currency)`
    )
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) return null;

  const r = data as Record<string, unknown>;
  const prices = r.equipment_prices as { price: number; currency: string; tier?: number }[] | null;
  let price: number | undefined;
  let currency: string | undefined;
  if (Array.isArray(prices) && prices.length > 0) {
    const tier1 = prices.find((p) => !p.tier || p.tier === 1) ?? prices[0];
    price = tier1.price;
    currency = tier1.currency;
  }
  const { equipment_prices: _ep, ...rest } = r;
  void _ep;
  return { ...rest, price, currency } as EquipmentWithPrice;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  if (!CATALOG_LIVE) return { title: 'מוצר' };
  const item = await fetchOne(id);
  if (!item) return { title: 'מוצר לא נמצא' };
  const name = item.name_he || item.name_en || 'מוצר';
  return {
    title: name,
    description: item.description_he || `${name} — ${item.manufacturer || 'DES'} · מופץ בישראל על ידי DES.`,
  };
}

function WarrantyRow({ label, months }: { label: string; months: number | null | undefined }) {
  if (!months) return null;
  return (
    <div className="flex items-center justify-between text-sm py-2" style={{ borderBottom: '1px solid #f0f2f5' }}>
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold" style={{ color: '#1a2b4a' }}>{months} חודשים</span>
    </div>
  );
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  if (!CATALOG_LIVE) notFound();

  const item = await fetchOne(id);
  if (!item) notFound();

  const name = item.name_he || item.name_en || '';
  const categoryLabel = item.category ? (CATEGORY_LABELS[item.category] || item.category) : null;
  const image =
    item.image_url ||
    (item.category && CATEGORIES_WITH_IMAGES.has(item.category)
      ? `/images/categories/${item.category}.jpg`
      : null);

  const hasWarranty =
    item.warranty_purchase_months || item.warranty_repair_months || item.warranty_manufacturer_months;

  const waText = encodeURIComponent(
    `שלום, אני מעוניין בפרטים על: ${name}${item.item_number ? ` (${item.item_number})` : ''}`
  );

  return (
    <div dir="rtl" className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6" aria-label="פירורי לחם">
        <Link href="/" className="hover:text-[#1e90ff] transition-colors">בית</Link>
        <ChevronLeft className="w-3.5 h-3.5" />
        <Link href="/catalog" className="hover:text-[#1e90ff] transition-colors">קטלוג</Link>
        <ChevronLeft className="w-3.5 h-3.5" />
        <span className="text-gray-600 truncate max-w-[50vw]">{name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div
          className="relative aspect-square rounded-2xl overflow-hidden flex items-center justify-center"
          style={{ background: '#f0f4f8', border: '1px solid #e8ecf0' }}
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={name} className="w-full h-full object-contain p-6" />
          ) : (
            <span className="text-gray-300 text-sm">אין תמונה זמינה</span>
          )}
          {item.manufacturer && (
            <span
              className="absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full bg-white"
              style={{ color: '#1a2b4a', border: '1px solid #e8ecf0', letterSpacing: '0.05em' }}
            >
              {item.manufacturer}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {categoryLabel && (
            <span className="text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: '#1e90ff' }}>
              {categoryLabel}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-2" style={{ color: '#1a2b4a' }}>
            {name}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400 mb-5" dir="ltr">
            {item.item_number && <span className="font-mono">מק״ט {item.item_number}</span>}
            {item.model && <span className="font-mono">{item.model}</span>}
          </div>

          {item.description_he && (
            <p className="text-gray-600 leading-relaxed mb-6">{item.description_he}</p>
          )}

          {/* Price */}
          <div className="rounded-2xl p-5 mb-5" style={{ background: '#f8f9fb', border: '1px solid #e8ecf0' }}>
            {item.price ? (
              <>
                <div className="font-black" style={{ color: '#1a2b4a', fontSize: '1.8rem', lineHeight: 1 }}>
                  {formatPrice(item.price, item.currency || 'ILS')}
                </div>
                <div className="text-xs text-gray-400 mt-1">כולל מע״מ</div>
              </>
            ) : (
              <div className="text-gray-600 font-medium">לקבלת מחיר וזמינות — צרו קשר</div>
            )}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <a
              href={`https://wa.me/972548818681?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 font-semibold px-6 py-3.5 rounded-xl text-white transition-all hover:-translate-y-0.5"
              style={{ background: '#128c7e' }}
            >
              <MessageCircle className="w-5 h-5" />
              שאל ב-WhatsApp
            </a>
            <Link
              href="/contact"
              className="flex-1 inline-flex items-center justify-center gap-2 font-semibold px-6 py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
              style={{ background: '#1a2b4a', color: '#fff' }}
            >
              בקשת הצעת מחיר
            </Link>
          </div>

          {/* Warranty */}
          {hasWarranty && (
            <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #e8ecf0' }}>
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4" style={{ color: '#22c55e' }} />
                <h2 className="font-bold text-sm" style={{ color: '#1a2b4a' }}>אחריות</h2>
              </div>
              <WarrantyRow label="אחריות רכישה" months={item.warranty_purchase_months} />
              <WarrantyRow label="אחריות תיקון" months={item.warranty_repair_months} />
              <WarrantyRow label="אחריות יצרן" months={item.warranty_manufacturer_months} />
            </div>
          )}

          {item.manufacturer && (
            <p className="text-xs text-gray-400 mt-5">
              מיוצר ע״י {item.manufacturer} · מיובא ומופץ בישראל על ידי DES
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
