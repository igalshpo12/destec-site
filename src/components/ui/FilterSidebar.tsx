'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { NAV_CATEGORIES, CATALOG_MANUFACTURERS } from '@/lib/utils';
import { SlidersHorizontal, X } from 'lucide-react';

export default function FilterSidebar() {
  const router = useRouter();
  const params = useSearchParams();

  const currentCategory = params.get('category') || '';
  const currentManufacturer = params.get('manufacturer') || '';
  const currentSearch = params.get('q') || '';

  function updateParam(key: string, value: string) {
    const p = new URLSearchParams(params.toString());
    if (value) {
      p.set(key, value);
    } else {
      p.delete(key);
    }
    p.delete('page'); // reset pagination on filter change
    router.push(`/catalog?${p.toString()}`);
  }

  function clearAll() {
    const p = new URLSearchParams();
    if (currentSearch) p.set('q', currentSearch);
    router.push(`/catalog?${p.toString()}`);
  }

  const hasActiveFilters = currentCategory || currentManufacturer;

  return (
    <aside dir="rtl" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#1a2b4a]" />
          <h2 className="font-bold text-[#1a2b4a]">סינון</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-3 h-3" />
            נקה הכל
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">קטגוריה</h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => updateParam('category', '')}
              className={`w-full text-right text-sm px-3 py-2 rounded-lg transition-colors ${
                !currentCategory
                  ? 'bg-[#1a2b4a] text-white font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              כל הקטגוריות
            </button>
          </li>
          {NAV_CATEGORIES.map(({ slug, label }) => (
            <li key={slug}>
              <button
                onClick={() => updateParam('category', slug)}
                className={`w-full text-right text-sm px-3 py-2 rounded-lg transition-colors ${
                  currentCategory === slug
                    ? 'bg-[#1a2b4a] text-white font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Manufacturer filter */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">יצרן</h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => updateParam('manufacturer', '')}
              className={`w-full text-right text-sm px-3 py-2 rounded-lg transition-colors ${
                !currentManufacturer
                  ? 'bg-[#1a2b4a] text-white font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              כל היצרנים
            </button>
          </li>
          {CATALOG_MANUFACTURERS.map((s) => (
            <li key={s.value}>
              <button
                onClick={() => updateParam('manufacturer', s.value)}
                className={`w-full text-right text-sm px-3 py-2 rounded-lg transition-colors ${
                  currentManufacturer === s.value
                    ? 'bg-[#1a2b4a] text-white font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
