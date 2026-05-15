'use client';
import { useState, useEffect } from 'react';
import { supabase, EquipmentWithPrice } from '@/lib/supabase';
import ProductCard from '@/components/ui/ProductCard';
import { Loader2 } from 'lucide-react';

const TABS = [
  { id: 'featured', label: 'מומלצים' },
  { id: 'new', label: 'חדשים' },
  { id: 'sale', label: 'מבצעים' },
];

// Normalise a Supabase embedded-relation result into { price, currency }
// Includes tier in select so we can reliably filter tier=1 in JS
function extractPrice(
  prices: unknown,
): { price: number | undefined; currency: string | undefined } {
  if (!prices) return { price: undefined, currency: undefined };
  const arr = Array.isArray(prices) ? prices : [prices];
  if (arr.length === 0) return { price: undefined, currency: undefined };
  // prefer tier=1 explicitly; fall back to first entry
  const tier1 = arr.find((p) => (p as { tier?: number }).tier === 1) ?? arr[0];
  const p = tier1 as { price: number; currency: string } | null;
  if (!p) return { price: undefined, currency: undefined };
  return { price: p.price, currency: p.currency };
}

async function fetchFeatured(): Promise<EquipmentWithPrice[]> {
  // Active items with tier-1 price, stable pseudo-random order (id % 97)
  // Use a left join so items without prices are included but we filter them below
  const { data, error } = await supabase
    .from('equipment')
    .select(
      `id, item_number, name_he, name_en, manufacturer, model, category,
       description_he, description_en, is_active, created_at, updated_at,
       equipment_prices(price, currency)`,
    )
    .eq('is_active', true)
    .eq('equipment_prices.tier', 1)
    .limit(80); // fetch extra then sort/slice in JS

  if (error || !data) return [];

  const withPrices = (data as unknown[])
    .map((row) => {
      const r = row as Record<string, unknown>;
      const { price, currency } = extractPrice(r.equipment_prices);
      const { equipment_prices: _ep, ...rest } = r;
      void _ep;
      return { ...rest, price, currency } as EquipmentWithPrice;
    })
    .filter((item) => item.price !== undefined && item.price !== null);

  // Stable pseudo-random order: sort by (numeric part of id) % 97
  withPrices.sort((a, b) => {
    const numA = parseInt(String(a.id).replace(/\D/g, '').slice(-6) || '0', 10);
    const numB = parseInt(String(b.id).replace(/\D/g, '').slice(-6) || '0', 10);
    return (numA % 97) - (numB % 97);
  });

  return withPrices.slice(0, 12);
}

async function fetchNew(): Promise<EquipmentWithPrice[]> {
  // Newest active items regardless of price
  const { data, error } = await supabase
    .from('equipment')
    .select(
      `id, item_number, name_he, name_en, manufacturer, model, category,
       description_he, description_en, is_active, created_at, updated_at,
       equipment_prices(price, currency)`,
    )
    .eq('is_active', true)
    .eq('equipment_prices.tier', 1)
    .order('created_at', { ascending: false })
    .limit(12);

  if (error || !data) return [];

  return (data as unknown[]).map((row) => {
    const r = row as Record<string, unknown>;
    const { price, currency } = extractPrice(r.equipment_prices);
    const { equipment_prices: _ep, ...rest } = r;
    void _ep;
    return { ...rest, price, currency } as EquipmentWithPrice;
  });
}

async function fetchSale(): Promise<EquipmentWithPrice[]> {
  // Cheapest active items with a known tier-1 price (stand-in until real sale flags exist)
  const { data, error } = await supabase
    .from('equipment')
    .select(
      `id, item_number, name_he, name_en, manufacturer, model, category,
       description_he, description_en, is_active, created_at, updated_at,
       equipment_prices!inner(price, currency)`,
    )
    .eq('is_active', true)
    .eq('equipment_prices.tier', 1)
    .order('equipment_prices(price)', { ascending: true })
    .limit(12);

  if (error || !data) {
    // Fallback: if ordering by nested column fails, fetch and sort in JS
    const { data: fallback, error: fallbackError } = await supabase
      .from('equipment')
      .select(
        `id, item_number, name_he, name_en, manufacturer, model, category,
         description_he, description_en, is_active, created_at, updated_at,
         equipment_prices!inner(price, currency)`,
      )
      .eq('is_active', true)
      .eq('equipment_prices.tier', 1)
      .limit(80);

    if (fallbackError || !fallback) return [];

    const items = (fallback as unknown[])
      .map((row) => {
        const r = row as Record<string, unknown>;
        const { price, currency } = extractPrice(r.equipment_prices);
        const { equipment_prices: _ep, ...rest } = r;
        void _ep;
        return { ...rest, price, currency } as EquipmentWithPrice;
      })
      .filter((item) => item.price !== undefined && item.price !== null);

    items.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    return items.slice(0, 12);
  }

  return (data as unknown[]).map((row) => {
    const r = row as Record<string, unknown>;
    const { price, currency } = extractPrice(r.equipment_prices);
    const { equipment_prices: _ep, ...rest } = r;
    void _ep;
    return { ...rest, price, currency } as EquipmentWithPrice;
  });
}

async function fetchProducts(
  tab: string,
): Promise<{ items: EquipmentWithPrice[]; showSaleBadge: boolean }> {
  if (tab === 'new') {
    return { items: await fetchNew(), showSaleBadge: false };
  }
  if (tab === 'sale') {
    return { items: await fetchSale(), showSaleBadge: true };
  }
  return { items: await fetchFeatured(), showSaleBadge: false };
}

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState('featured');
  const [products, setProducts] = useState<EquipmentWithPrice[]>([]);
  const [showSaleBadge, setShowSaleBadge] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchProducts(activeTab).then(({ items, showSaleBadge: badge }) => {
      setProducts(items);
      setShowSaleBadge(badge);
      setLoading(false);
    });
  }, [activeTab]);

  return (
    <section dir="rtl" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-[#1a2b4a]">מוצרי DES</h2>

          {/* Tab buttons */}
          <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm self-start sm:self-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  activeTab === tab.id
                    ? 'bg-[#1a2b4a] text-white shadow-sm'
                    : 'text-gray-600 hover:text-[#1a2b4a]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-8 h-8 text-[#1e90ff] animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-400 py-16">
            <p className="text-lg">לא נמצאו מוצרים</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((item) => (
              <ProductCard key={item.id} item={item} showSaleBadge={showSaleBadge} />
            ))}
          </div>
        )}

        {/* View all link */}
        <div className="text-center mt-8">
          <a
            href="/catalog"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-[#1e90ff] text-[#1a2b4a] hover:text-[#1e90ff] font-medium px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            לכל הקטלוג ←
          </a>
        </div>
      </div>
    </section>
  );
}
