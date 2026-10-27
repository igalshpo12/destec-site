'use client';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart';

/** Header cart icon with live count badge. */
export default function CartButton({ className = '' }: { className?: string }) {
  const { count, hydrated } = useCart();
  return (
    <Link
      href="/cart"
      aria-label={`העגלה שלי${hydrated && count ? ` — ${count} פריטים` : ''}`}
      data-testid="cart-button"
      className={`relative p-2 rounded-lg transition-all duration-150 ${className}`}
      style={{ color: '#1a2b4a' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(30,144,255,0.1)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}
    >
      <ShoppingCart className="w-5 h-5" />
      {hydrated && count > 0 && (
        <span
          data-testid="cart-count"
          className="absolute -top-0.5 -left-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center"
          style={{ background: '#1e90ff', color: '#fff', boxShadow: '0 0 0 2px #fff' }}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
