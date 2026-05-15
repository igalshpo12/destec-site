import { Suspense } from 'react';
import { Metadata } from 'next';
import { supabase, EquipmentWithPrice, inferCategory } from '@/lib/supabase';
import ProductCard from '@/components/ui/ProductCard';
import FilterSidebar from '@/components/ui/FilterSidebar';
import { Search, Loader2, SlidersHorizontal } from 'lucide-react';
import { CATEGORY_LABELS } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'קטלוג מוצרים',
  description: 'קטלוג ציוד דנטלי ורפואי של DES — 9,000+ מוצרים. NSK, W&H, KaVo, MK-dent, Nouvag ועוד.',
};

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 24;

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    manufacturer?: string;
    page?: string;
  }>;
}

async function fetchCatalogProducts(params: {
  q?: string;
  category?: string;
  manufacturer?: string;
  page?: number;
}): Promise<{ items: EquipmentWithPrice[]; total: number }> {
  const { q, category, manufacturer, page = 1 } = params;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from('equipment')
    .select(
      `id, item_number, name_he, name_en, manufacturer, model, category,
       description_he, is_active,
       equipment_prices!left(price, currency)`,
      { count: 'exact' }
    )
    .eq('is_active', true);

  // Price tier filter — only tier=1
  // We'll filter in memory after fetch since left join with eq doesn't chain well for optional join
  // Instead use inner join when we want only priced items — show all and mark price as null if missing

  if (q) {
    query = query.or(
      `name_he.ilike.%${q}%,name_en.ilike.%${q}%,item_number.ilike.%${q}%,model.ilike.%${q}%`
    );
  }

  if (category) {
    query = query.eq('category', category);
  }

  if (manufacturer) {
    query = query.eq('manufacturer', manufacturer);
  }

  query = query.order('id', { ascending: true }).range(from, to);

  const { data, error, count } = await query;

  if (error || !data) return { items: [], total: 0 };

  const items = (data as unknown[]).map((row: unknown) => {
    const r = row as Record<string, unknown>;
    const prices = r.equipment_prices as { price: number; currency: string; tier?: number }[] | null;
    let price: number | undefined;
    let currency: string | undefined;
    if (Array.isArray(prices) && prices.length > 0) {
      // filter for tier=1 after the fact
      const tier1 = prices.find((p) => !p.tier || p.tier === 1);
      if (tier1) {
        price = tier1.price;
        currency = tier1.currency;
      }
    }
    const { equipment_prices: _ep, ...rest } = r;
    void _ep;
    const item = { ...rest, price, currency } as EquipmentWithPrice;
    // Fall back to inferred category
    if (!item.category) item.category = inferCategory(item);
    return item;
  });

  return { items, total: count || 0 };
}

function CatalogContent({ items, total, page, q, category, manufacturer }: {
  items: EquipmentWithPrice[];
  total: number;
  page: number;
  q: string;
  category: string;
  manufacturer: string;
}) {
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const catLabel = category ? (CATEGORY_LABELS[category] || category) : '';

  return (
    <div className="flex-1 min-w-0">
      {/* Results header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#1a2b4a]">
            {catLabel || manufacturer || (q ? `תוצאות: "${q}"` : 'כל הקטלוג')}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {total.toLocaleString('he-IL')} מוצרים נמצאו
          </p>
        </div>
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">לא נמצאו מוצרים</p>
          <p className="text-sm mt-1">נסה לשנות את הסינון או מילות החיפוש</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10" dir="ltr">
          {page > 1 && (
            <a
              href={`/catalog?${new URLSearchParams({ ...(q && { q }), ...(category && { category }), ...(manufacturer && { manufacturer }), page: String(page - 1) }).toString()}`}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              ←
            </a>
          )}
          {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
            const p = i + 1;
            return (
              <a
                key={p}
                href={`/catalog?${new URLSearchParams({ ...(q && { q }), ...(category && { category }), ...(manufacturer && { manufacturer }), page: String(p) }).toString()}`}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  p === page
                    ? 'bg-[#1a2b4a] text-white font-semibold'
                    : 'border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {p}
              </a>
            );
          })}
          {page < totalPages && (
            <a
              href={`/catalog?${new URLSearchParams({ ...(q && { q }), ...(category && { category }), ...(manufacturer && { manufacturer }), page: String(page + 1) }).toString()}`}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              →
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const q = sp.q || '';
  const category = sp.category || '';
  const manufacturer = sp.manufacturer || '';
  const page = Number(sp.page) || 1;

  const { items, total } = await fetchCatalogProducts({ q, category, manufacturer, page });

  return (
    <div dir="rtl" className="max-w-7xl mx-auto px-4 py-8">
      {/* Search bar — mobile */}
      <form action="/catalog" method="get" className="mb-6 sm:hidden">
        <div className="relative">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="חיפוש מוצרים..."
            dir="rtl"
            className="w-full border border-gray-200 rounded-xl py-3 pr-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e90ff]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </form>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="hidden lg:block w-56 flex-shrink-0">
          <Suspense fallback={
            <div className="bg-white rounded-2xl border border-gray-100 h-96 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
            </div>
          }>
            <FilterSidebar />
          </Suspense>
        </div>

        {/* Mobile filter hint */}
        <div className="lg:hidden mb-4 flex gap-2">
          <a
            href="/catalog"
            className="flex items-center gap-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl px-4 py-2 hover:border-[#1e90ff] hover:text-[#1e90ff] transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>סינון</span>
          </a>
        </div>

        {/* Main content */}
        <CatalogContent
          items={items}
          total={total}
          page={page}
          q={q}
          category={category}
          manufacturer={manufacturer}
        />
      </div>
    </div>
  );
}
