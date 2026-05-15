'use client';
import { useState, useEffect } from 'react';
import { supabase, EquipmentWithPrice } from '@/lib/supabase';
import ProductCard from '@/components/ui/ProductCard';
import Link from 'next/link';

const TABS = [
  { id: 'featured', label: 'מומלצים' },
  { id: 'new',      label: 'חדשים'   },
  { id: 'sale',     label: 'מבצעים'  },
];

function extractPrice(prices: unknown): { price: number | undefined; currency: string | undefined } {
  if (!prices) return { price: undefined, currency: undefined };
  const arr = Array.isArray(prices) ? prices : [prices];
  if (arr.length === 0) return { price: undefined, currency: undefined };
  const tier1 = arr.find((p) => (p as { tier?: number }).tier === 1) ?? arr[0];
  const p = tier1 as { price: number; currency: string } | null;
  if (!p) return { price: undefined, currency: undefined };
  return { price: p.price, currency: p.currency };
}

function mapRows(data: unknown[]): EquipmentWithPrice[] {
  return data.map((row) => {
    const r = row as Record<string, unknown>;
    const { price, currency } = extractPrice(r.equipment_prices);
    const { equipment_prices: _ep, ...rest } = r;
    void _ep;
    return { ...rest, price, currency } as EquipmentWithPrice;
  });
}

const PRICE_SELECT = 'equipment_prices(tier, price, currency)';
const BASE_SELECT = `id, item_number, name_he, name_en, manufacturer, model, category,
  description_he, description_en, is_active, created_at, updated_at, ${PRICE_SELECT}`;

async function fetchFeatured(): Promise<EquipmentWithPrice[]> {
  try {
    const { data, error } = await supabase
      .from('equipment').select(BASE_SELECT)
      .eq('is_active', true).eq('is_public', true).limit(80);
    if (error || !data) return [];
    const withPrices = mapRows(data).filter((item) => item.price != null);
    withPrices.sort((a, b) => {
      const numA = parseInt(String(a.id).replace(/\D/g, '').slice(-6) || '0', 10);
      const numB = parseInt(String(b.id).replace(/\D/g, '').slice(-6) || '0', 10);
      return (numA % 97) - (numB % 97);
    });
    return withPrices.slice(0, 12);
  } catch { return []; }
}

async function fetchNew(): Promise<EquipmentWithPrice[]> {
  try {
    const { data, error } = await supabase
      .from('equipment').select(BASE_SELECT)
      .eq('is_active', true).eq('is_public', true)
      .order('created_at', { ascending: false }).limit(12);
    if (error || !data) return [];
    return mapRows(data);
  } catch { return []; }
}

async function fetchSale(): Promise<EquipmentWithPrice[]> {
  try {
    const { data, error } = await supabase
      .from('equipment').select(BASE_SELECT)
      .eq('is_active', true).eq('is_public', true).limit(80);
    if (error || !data) return [];
    const withPrices = mapRows(data).filter((item) => item.price != null);
    withPrices.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    return withPrices.slice(0, 12);
  } catch { return []; }
}

async function fetchProducts(tab: string): Promise<{ items: EquipmentWithPrice[]; showSaleBadge: boolean }> {
  if (tab === 'new')  return { items: await fetchNew(),      showSaleBadge: false };
  if (tab === 'sale') return { items: await fetchSale(),     showSaleBadge: true  };
  return                    { items: await fetchFeatured(),  showSaleBadge: false };
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg overflow-hidden" style={{ border: '1px solid #f0f2f5' }}>
      <div className="aspect-[4/3]" style={{ background: 'linear-gradient(110deg, #f0f2f5 8%, #e8eaed 18%, #f0f2f5 33%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s linear infinite' }} />
      <div className="p-4 space-y-3">
        <div className="h-2 rounded" style={{ background: '#f0f2f5', width: '40%' }} />
        <div className="h-3 rounded" style={{ background: '#f0f2f5', width: '85%' }} />
        <div className="h-3 rounded" style={{ background: '#f0f2f5', width: '60%' }} />
      </div>
    </div>
  );
}

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState('featured');
  const [products, setProducts] = useState<EquipmentWithPrice[]>([]);
  const [showSaleBadge, setShowSaleBadge] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchProducts(activeTab)
      .then(({ items, showSaleBadge: badge }) => { setProducts(items); setShowSaleBadge(badge); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <section dir="rtl" className="py-16" style={{ background: '#f7f8fa' }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
            <p
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-2"
              style={{ color: '#1e90ff' }}
            >
              קטלוג מוצרים
            </p>
            <h2
              className="font-black"
              style={{ color: '#0d1929', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
            >
              מוצרי DES
            </h2>
          </div>

          {/* Pill tab switcher */}
          <div
            className="flex gap-1 p-1 rounded-xl self-start sm:self-auto"
            style={{ background: '#e8eaed' }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
                style={
                  activeTab === tab.id
                    ? { background: '#0d1929', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }
                    : { background: 'transparent', color: '#6b7280' }
                }
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : products.length === 0
            ? (
              <div className="col-span-full text-center py-16" style={{ color: '#9ba3af' }}>
                לא נמצאו מוצרים
              </div>
            )
            : products.map((item) => (
              <ProductCard key={item.id} item={item} showSaleBadge={showSaleBadge} />
            ))
          }
        </div>

        {/* View all */}
        <div className="text-center mt-10">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-3 font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: '#0d1929',
              color: '#fff',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#1e90ff';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#0d1929';
            }}
          >
            <span>לכל הקטלוג</span>
            <span style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
