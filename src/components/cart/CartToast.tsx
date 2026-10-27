'use client';
import Link from 'next/link';
import { ShoppingCart, X } from 'lucide-react';
import { useCart } from '@/lib/cart';

/** Small bottom-left (RTL: visually left) confirmation after "add to cart". */
export default function CartToast() {
  const { lastAdded, count, dismissToast } = useCart();
  if (!lastAdded) return null;
  const { item } = lastAdded;
  return (
    <div
      dir="rtl"
      role="status"
      aria-live="polite"
      data-testid="cart-toast"
      className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-[360px] z-[60] rounded-2xl p-4 flex items-center gap-3"
      style={{ background: '#1a2b4a', color: '#fff', boxShadow: '0 16px 40px rgba(0,0,0,0.25)' }}
    >
      <div className="w-12 h-12 rounded-lg bg-white flex-shrink-0 overflow-hidden flex items-center justify-center">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt="" className="w-full h-full object-contain p-1" />
        ) : (
          <ShoppingCart className="w-5 h-5 text-gray-400" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs opacity-75">נוסף לעגלה</div>
        <div className="text-sm font-semibold truncate">{item.name}</div>
        <Link href="/cart" className="text-xs font-semibold underline underline-offset-2" style={{ color: '#7cc0ff' }}>
          לעגלה ({count})
        </Link>
      </div>
      <button type="button" onClick={dismissToast} aria-label="סגור" className="p-1 opacity-70 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
