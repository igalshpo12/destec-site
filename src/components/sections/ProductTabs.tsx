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

async function fetchProducts(tab: string): Promise<EquipmentWithPrice[]> {
  // Base query — join with equipment_prices tier=1
  let query = supabase
    .from('equipment')
    .select(`
      id, item_number, name_he, name_en, manufacturer, model, category,
      description_he, description_en, is_active,
      equipment_prices!inner(price, currency)
    `)
    .eq('is_active', true)
    .eq('equipment_prices.tier', 1);

  if (tab === 'new') {
    query = query.order('created_at', { ascending: false }).limit(12);
  } else {
    query = query.order('id', { ascending: true }).limit(12);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return (data as unknown[]).map((row: unknown) => {
    const r = row as Record<string, unknown>;
    const prices = r.equipment_prices as { price: number; currency: string }[] | { price: number; currency: string } | null;
    let price: number | undefined;
    let currency: string | undefined;
    if (Array.isArray(prices) && prices.length > 0) {
      price = prices[0].price;
      currency = prices[0].currency;
    } else if (prices && !Array.isArray(prices)) {
      price = prices.price;
      currency = prices.currency;
    }
    const { equipment_prices: _ep, ...rest } = r;
    void _ep;
    return { ...rest, price, currency } as EquipmentWithPrice;
  });
}

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState('featured');
  const [products, setProducts] = useState<EquipmentWithPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchProducts(activeTab).then((data) => {
      setProducts(data);
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
              <ProductCard key={item.id} item={item} />
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
