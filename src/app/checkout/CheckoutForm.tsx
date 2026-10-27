'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';

type Form = { name: string; phone: string; email: string; clinic: string; address: string; notes: string };
const EMPTY: Form = { name: '', phone: '', email: '', clinic: '', address: '', notes: '' };

/**
 * Online payment seam. When Credit2000 (hosted payment page) credentials
 * are configured, this is where we redirect/open the hosted page with the
 * order ref + amount. Until then the order goes to DES by email and
 * payment is settled with the client directly.
 */
async function startPayment(orderRef: string, amount: number): Promise<void> {
  // not wired yet — see src/lib/cart.tsx header comment
  void orderRef;
  void amount;
}

export default function CheckoutForm() {
  const { items, count, subtotal, unpricedCount, hydrated, clear } = useCart();
  const [form, setForm] = useState<Form>(EMPTY);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [orderRef, setOrderRef] = useState('');

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ id: i.id, name: i.name, itemNumber: i.itemNumber, manufacturer: i.manufacturer, price: i.price ?? null, qty: i.qty })),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setOrderRef(data.ref || '');
      await startPayment(data.ref, subtotal);
      clear();
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <div dir="rtl" className="max-w-2xl mx-auto px-4 py-20 text-center" data-testid="order-success">
        <CheckCircle2 className="w-14 h-14 mx-auto mb-4" style={{ color: '#16a34a' }} />
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#1a2b4a' }}>ההזמנה התקבלה</h1>
        {orderRef && <p className="text-sm text-gray-400 font-mono mb-3" dir="ltr">{orderRef}</p>}
        <p className="text-gray-600 leading-relaxed mb-8">
          תודה! נציג DES יחזור אליכם בהקדם לאישור ההזמנה, תיאום משלוח/התקנה והסדרת התשלום.
        </p>
        <Link href="/catalog" className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-white" style={{ background: '#1a2b4a' }}>
          חזרה לקטלוג
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (hydrated && items.length === 0) {
    return (
      <div dir="rtl" className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#1a2b4a' }}>העגלה ריקה</h1>
        <Link href="/catalog" className="text-sm font-semibold underline" style={{ color: '#1e90ff' }}>לקטלוג המוצרים</Link>
      </div>
    );
  }

  const input = 'w-full rounded-xl px-4 py-3 text-sm outline-none transition-all';
  const inputStyle = { background: '#f8f9fb', border: '1px solid #e8ecf0', color: '#1a2b4a' } as const;

  return (
    <div dir="rtl" className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-400 mb-6 flex gap-2">
        <Link href="/cart" className="hover:text-[#1e90ff]">העגלה</Link>
        <span>›</span>
        <span className="text-gray-600">פרטי הזמנה</span>
      </nav>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        <form onSubmit={submit} className="rounded-2xl p-5 sm:p-7 bg-white" style={{ border: '1px solid #e8ecf0' }} data-testid="checkout-form">
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#1a2b4a' }}>פרטי ההזמנה</h1>
          <p className="text-sm text-gray-500 mb-6">מלאו את הפרטים ונחזור אליכם לאישור ההזמנה ולתשלום.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-semibold text-gray-600 mb-1 block">שם מלא *</span>
              <input required name="name" value={form.name} onChange={set('name')} className={input} style={inputStyle} autoComplete="name" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-gray-600 mb-1 block">טלפון *</span>
              <input required name="phone" type="tel" dir="ltr" value={form.phone} onChange={set('phone')} className={input} style={inputStyle} autoComplete="tel" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-gray-600 mb-1 block">אימייל</span>
              <input name="email" type="email" dir="ltr" value={form.email} onChange={set('email')} className={input} style={inputStyle} autoComplete="email" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-gray-600 mb-1 block">מרפאה / חברה</span>
              <input name="clinic" value={form.clinic} onChange={set('clinic')} className={input} style={inputStyle} autoComplete="organization" />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-semibold text-gray-600 mb-1 block">כתובת למשלוח / התקנה</span>
              <input name="address" value={form.address} onChange={set('address')} className={input} style={inputStyle} autoComplete="street-address" />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-semibold text-gray-600 mb-1 block">הערות</span>
              <textarea name="notes" rows={3} value={form.notes} onChange={set('notes')} className={input} style={inputStyle} />
            </label>
          </div>

          {status === 'error' && (
            <div className="mt-4 text-sm rounded-lg p-3" style={{ background: '#fef2f2', color: '#991b1b' }}>
              שליחת ההזמנה נכשלה. נסו שוב או פנו אלינו ב-WhatsApp.
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'sending' || !hydrated}
            data-testid="submit-order"
            className="mt-6 w-full inline-flex items-center justify-center gap-2 font-semibold px-6 py-4 rounded-xl text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
            style={{ background: '#1e90ff', boxShadow: '0 8px 20px rgba(30,144,255,0.25)' }}
          >
            {status === 'sending' ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            שליחת ההזמנה
          </button>
          <p className="mt-3 text-xs text-gray-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            לא נדרש תשלום באתר בשלב זה — התשלום מוסדר מול נציג DES לאחר אישור ההזמנה.
          </p>
        </form>

        <aside className="rounded-2xl p-5 bg-white lg:sticky lg:top-24" style={{ border: '1px solid #e8ecf0' }}>
          <h2 className="font-bold mb-3" style={{ color: '#1a2b4a' }}>הפריטים בהזמנה</h2>
          <ul className="divide-y" style={{ borderColor: '#f0f2f5' }}>
            {items.map((it) => (
              <li key={it.id} className="py-2.5 flex items-center gap-3 text-sm">
                <div className="w-11 h-11 rounded-lg flex-shrink-0 overflow-hidden" style={{ background: '#f8f9fb', border: '1px solid #e8ecf0' }}>
                  {it.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.image} alt="" className="w-full h-full object-contain p-1" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium" style={{ color: '#1a2b4a' }}>{it.name}</div>
                  <div className="text-xs text-gray-400">×{it.qty}</div>
                </div>
                <div className="text-sm font-semibold tabular-nums flex-shrink-0">{it.price ? formatPrice(it.price * it.qty) : 'לפי הצעה'}</div>
              </li>
            ))}
          </ul>
          <div className="flex justify-between pt-4 mt-2" style={{ borderTop: '1px solid #e8ecf0' }}>
            <span className="text-gray-600">סה״כ ({count} פריטים)</span>
            <span className="font-black text-lg" style={{ color: '#1a2b4a' }}>{subtotal > 0 ? formatPrice(subtotal) : 'לפי הצעת מחיר'}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">כולל מע״מ{unpricedCount ? ` · ${unpricedCount} פריטים לפי הצעת מחיר` : ''}</div>
        </aside>
      </div>
    </div>
  );
}
