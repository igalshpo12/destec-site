'use client';
import { useState } from 'react';
import { ShoppingCart, Check, Minus, Plus } from 'lucide-react';
import { useCart } from '@/lib/cart';
import type { EquipmentWithPrice } from '@/lib/supabase';

interface Props {
  item: EquipmentWithPrice;
  /** 'compact' = icon button for product cards; 'full' = qty stepper + wide button for product page */
  variant?: 'compact' | 'full';
  accent?: string;
  className?: string;
}

export default function AddToCartButton({ item, variant = 'compact', accent = '#1e90ff', className = '' }: Props) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);

  const name = item.name_he || item.name_en || 'מוצר';
  const doAdd = () => {
    add(
      {
        id: item.id,
        name,
        itemNumber: item.item_number,
        manufacturer: item.manufacturer,
        image: item.image_url,
        price: item.price ?? null,
      },
      qty
    );
    setDone(true);
    setTimeout(() => setDone(false), 1600);
  };

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          doAdd();
        }}
        aria-label={`הוסף לעגלה: ${name}`}
        title="הוסף לעגלה"
        data-testid="add-to-cart"
        className={`relative z-[2] inline-flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold px-2.5 sm:px-3 py-2 transition-colors duration-150 ${className}`}
        style={{
          background: done ? '#16a34a' : '#eaf4ff',
          color: done ? '#fff' : '#1a2b4a',
          border: `1px solid ${done ? '#16a34a' : '#cfe3fb'}`,
        }}
        onMouseEnter={(e) => {
          if (done) return;
          const el = e.currentTarget as HTMLElement;
          el.style.background = accent;
          el.style.color = '#fff';
          el.style.borderColor = accent;
        }}
        onMouseLeave={(e) => {
          if (done) return;
          const el = e.currentTarget as HTMLElement;
          el.style.background = '#eaf4ff';
          el.style.color = '#1a2b4a';
          el.style.borderColor = '#cfe3fb';
        }}
      >
        {done ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
        <span className="hidden sm:inline">{done ? 'נוסף' : 'לעגלה'}</span>
      </button>
    );
  }

  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`} dir="rtl">
      <div
        className="inline-flex items-center justify-between rounded-xl overflow-hidden self-start sm:self-auto"
        style={{ border: '1px solid #e8ecf0', background: '#fff' }}
        aria-label="כמות"
      >
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="px-3 py-3 transition-colors hover:bg-gray-50"
          aria-label="הפחת כמות"
          style={{ color: '#1a2b4a' }}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-10 text-center font-bold tabular-nums" style={{ color: '#1a2b4a' }} data-testid="qty">
          {qty}
        </span>
        <button
          type="button"
          onClick={() => setQty((q) => Math.min(99, q + 1))}
          className="px-3 py-3 transition-colors hover:bg-gray-50"
          aria-label="הוסף כמות"
          style={{ color: '#1a2b4a' }}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <button
        type="button"
        onClick={doAdd}
        data-testid="add-to-cart"
        className="flex-1 inline-flex items-center justify-center gap-2 font-semibold px-6 py-3.5 rounded-xl text-white transition-all hover:-translate-y-0.5"
        style={{ background: done ? '#16a34a' : '#1e90ff', boxShadow: '0 8px 20px rgba(30,144,255,0.25)' }}
      >
        {done ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
        {done ? 'נוסף לעגלה' : 'הוסף לעגלה'}
      </button>
    </div>
  );
}
