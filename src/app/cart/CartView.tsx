'use client';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, MessageCircle } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';

export default function CartView() {
  const { items, count, subtotal, unpricedCount, hydrated, setQty, remove, clear } = useCart();

  if (!hydrated) {
    return <div className="max-w-5xl mx-auto px-4 py-16 text-center text-gray-400">טוען את העגלה…</div>;
  }

  if (items.length === 0) {
    return (
      <div dir="rtl" className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#eaf4ff' }}>
          <ShoppingCart className="w-7 h-7" style={{ color: '#1e90ff' }} />
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#1a2b4a' }}>העגלה שלך ריקה</h1>
        <p className="text-gray-500 mb-6">הוסיפו מוצרים מהקטלוג כדי להתחיל הזמנה.</p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-white"
          style={{ background: '#1a2b4a' }}
        >
          לקטלוג המוצרים
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div dir="rtl" className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#1a2b4a' }}>העגלה שלי</h1>
          <p className="text-sm text-gray-500 mt-1" data-testid="cart-summary">{count} פריטים · {items.length} מוצרים</p>
        </div>
        <button type="button" onClick={clear} className="text-xs text-gray-400 hover:text-red-500 transition-colors">
          רוקן עגלה
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        {/* Lines */}
        <div className="rounded-2xl overflow-hidden bg-white" style={{ border: '1px solid #e8ecf0' }}>
          {items.map((it) => (
            <div
              key={it.id}
              data-testid="cart-line"
              className="flex gap-3 sm:gap-4 p-3 sm:p-4 items-center"
              style={{ borderBottom: '1px solid #f0f2f5' }}
            >
              <Link
                href={`/catalog/${it.id}`}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center"
                style={{ background: '#f8f9fb', border: '1px solid #e8ecf0' }}
              >
                {it.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.image} alt={it.name} className="w-full h-full object-contain p-1.5" />
                ) : (
                  <ShoppingCart className="w-6 h-6 text-gray-300" />
                )}
              </Link>

              <div className="min-w-0 flex-1">
                <Link href={`/catalog/${it.id}`} className="font-semibold text-sm sm:text-base leading-snug line-clamp-2 hover:underline" style={{ color: '#1a2b4a' }}>
                  {it.name}
                </Link>
                <div className="text-xs text-gray-400 mt-1 flex flex-wrap gap-x-3" dir="ltr">
                  {it.itemNumber && <span className="font-mono">{it.itemNumber}</span>}
                  {it.manufacturer && <span>{it.manufacturer}</span>}
                </div>
                <div className="mt-2 text-sm">
                  {it.price ? (
                    <span className="font-semibold" style={{ color: '#1a2b4a' }}>{formatPrice(it.price)} <span className="text-xs text-gray-400 font-normal">ליחידה · כולל מע״מ</span></span>
                  ) : (
                    <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: '#fff7ed', color: '#b45309' }}>מחיר לפי הצעה</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <div className="inline-flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid #e8ecf0' }}>
                  <button type="button" onClick={() => setQty(it.id, it.qty - 1)} aria-label="הפחת" className="px-2.5 py-2 hover:bg-gray-50" style={{ color: '#1a2b4a' }}>
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-9 text-center text-sm font-bold tabular-nums" data-testid="line-qty">{it.qty}</span>
                  <button type="button" onClick={() => setQty(it.id, it.qty + 1)} aria-label="הוסף" className="px-2.5 py-2 hover:bg-gray-50" style={{ color: '#1a2b4a' }}>
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-sm font-black tabular-nums" style={{ color: '#1a2b4a' }}>
                  {it.price ? formatPrice(it.price * it.qty) : '—'}
                </div>
                <button type="button" onClick={() => remove(it.id)} aria-label="הסר מהעגלה" className="text-gray-300 hover:text-red-500 transition-colors p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="rounded-2xl p-5 bg-white lg:sticky lg:top-24" style={{ border: '1px solid #e8ecf0' }}>
          <h2 className="font-bold mb-4" style={{ color: '#1a2b4a' }}>סיכום הזמנה</h2>
          <div className="flex justify-between text-sm py-2" style={{ borderBottom: '1px solid #f0f2f5' }}>
            <span className="text-gray-500">פריטים</span>
            <span className="font-semibold">{count}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-gray-600">סה״כ</span>
            <span className="font-black text-xl" style={{ color: '#1a2b4a' }} data-testid="cart-subtotal">
              {subtotal > 0 ? formatPrice(subtotal) : <span className="text-base" style={{ color: '#b45309' }}>לפי הצעת מחיר</span>}
            </span>
          </div>
          <div className="text-xs text-gray-400 -mt-2 mb-3">המחירים כוללים מע״מ. משלוח והתקנה לפי תיאום.</div>
          {unpricedCount > 0 && (
            <div className="text-xs rounded-lg p-3 mb-3" style={{ background: '#fff7ed', color: '#9a3412' }}>
              {unpricedCount === 1 ? 'פריט אחד' : `${unpricedCount} פריטים`} ללא מחיר באתר — נחזור אליכם עם הצעת מחיר יחד עם אישור ההזמנה.
            </div>
          )}
          <Link
            href="/checkout"
            data-testid="to-checkout"
            className="w-full inline-flex items-center justify-center gap-2 font-semibold px-6 py-3.5 rounded-xl text-white transition-all hover:-translate-y-0.5"
            style={{ background: '#1e90ff', boxShadow: '0 8px 20px rgba(30,144,255,0.25)' }}
          >
            המשך להזמנה
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <a
            href={`https://wa.me/972548818681?text=${encodeURIComponent('שלום, אשמח לעזרה עם ההזמנה שלי באתר: ' + items.map((i) => `${i.name} ×${i.qty}`).join(', '))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-2 inline-flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl"
            style={{ color: '#128c7e', border: '1px solid #c6ebe3' }}
          >
            <MessageCircle className="w-4 h-4" />
            שאלה לפני ההזמנה? WhatsApp
          </a>
          <Link href="/catalog" className="block text-center text-xs text-gray-400 mt-4 hover:text-gray-600">← המשך קנייה</Link>
        </aside>
      </div>
    </div>
  );
}
