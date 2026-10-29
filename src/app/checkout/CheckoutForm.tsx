'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, ShieldCheck, ArrowLeft, CreditCard, ExternalLink, XCircle } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';
import { verifyPayment, returnMessage, type PaymentStart, type PaymentView } from '@/lib/payment-client';

type Form = { name: string; phone: string; email: string; clinic: string; vat_number: string; address: string; city: string; notes: string };
const EMPTY: Form = { name: '', phone: '', email: '', clinic: '', vat_number: '', address: '', city: '', notes: '' };

/**
 * Online payment (Credit2000 hosted page, the same terminal des-manager charges on). When
 * /api/order answers with `payment`, the card is typed on Credit2000's own form shown right
 * here; the result is confirmed SERVER-SIDE (/api/pay/verify asks Credit2000 — the page's
 * redirect alone proves nothing). Quote orders, or payment not configured: e-mail as before.
 */
const POLL_MS = 5000;

export default function CheckoutForm() {
  const { items, count, subtotal, unpricedCount, hydrated, clear } = useCart();
  const [form, setForm] = useState<Form>(EMPTY);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error' | 'paying' | 'verifying' | 'paid' | 'declined'>('idle');
  const [orderRef, setOrderRef] = useState('');
  const [payment, setPayment] = useState<PaymentStart | null>(null);
  const [payView, setPayView] = useState<PaymentView | null>(null);
  const search = useSearchParams();
  const busy = useRef(false);

  // The server's verdict for one order. True once settled (paid / declined / error).
  const settle = useCallback((view: PaymentView) => {
    setPayView(view);
    if (view.status === 'approved') { clear(); setStatus('paid'); return true; }
    if (view.status === 'declined' || view.status === 'error') { setStatus('declined'); return true; }
    return false;
  }, [clear]);

  const check = useCallback(async (orderId: string, uid?: string | null, visible = false) => {
    if (busy.current) return;
    busy.current = true;
    if (visible) setStatus('verifying');
    try { if (!settle(await verifyPayment(orderId, uid)) && visible) setStatus('paying'); }
    catch { if (visible) setStatus('paying'); }
    finally { busy.current = false; }
  }, [settle]);

  // Returning from a tab the customer opened (the return page links back with ?order=<id>).
  useEffect(() => {
    const id = search.get('order');
    if (id && status === 'idle') { setPayment({ order_id: id, page_url: '', amount: 0 }); check(id, null, true); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The return page (inside the iframe or a tab) posts { type: 'c2k-return', order_id, uid, view }.
  useEffect(() => {
    if (!payment) return undefined;
    const onMessage = (e: MessageEvent) => {
      const m = returnMessage(e, payment.order_id);
      if (!m) return;
      if (m.view && settle(m.view)) return;
      check(payment.order_id, m.uid, true);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [payment, settle, check]);

  // Slow poll while the form is open — covers a redirect that never reaches us.
  useEffect(() => {
    if (!payment || status !== 'paying') return undefined;
    const t = setInterval(() => check(payment.order_id), POLL_MS);
    return () => clearInterval(t);
  }, [payment, status, check]);

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
      if (data.payment?.page_url) {
        setPayment(data.payment as PaymentStart);
        setStatus('paying');          // the cart is cleared only once the payment is approved
        return;
      }
      clear();
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'paid') {
    return (
      <div dir="rtl" className="max-w-2xl mx-auto px-4 py-20 text-center" data-testid="order-paid">
        <CheckCircle2 className="w-14 h-14 mx-auto mb-4" style={{ color: '#16a34a' }} />
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#1a2b4a' }}>התשלום התקבל, תודה!</h1>
        <p className="text-sm text-gray-400 font-mono mb-1" dir="ltr">{payView?.ref || orderRef}</p>
        <p className="text-sm text-gray-500 mb-6">
          {payView?.amount ? `${formatPrice(payView.amount)} · ` : ''}אישור {payView?.approval}
        </p>
        <p className="text-gray-600 leading-relaxed mb-8">
          ההזמנה נקלטה ושולמה. נציג DES יחזור אליכם לתיאום המשלוח/ההתקנה, והקבלה תישלח אליכם.
        </p>
        <Link href="/catalog" className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-white" style={{ background: '#1a2b4a' }}>
          חזרה לקטלוג
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (status === 'declined') {
    return (
      <div dir="rtl" className="max-w-2xl mx-auto px-4 py-20 text-center" data-testid="order-declined">
        <XCircle className="w-14 h-14 mx-auto mb-4" style={{ color: '#dc2626' }} />
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#1a2b4a' }}>התשלום לא אושר</h1>
        <p className="text-sm text-gray-400 font-mono mb-3" dir="ltr">{payView?.ref || orderRef}</p>
        <p className="text-gray-600 leading-relaxed mb-8">
          החיוב לא בוצע והעגלה נשמרה. אפשר לנסות שוב, או לשלוח את ההזמנה ונחזור אליכם להסדרת התשלום.
        </p>
        <button type="button" onClick={() => { setPayment(null); setPayView(null); setStatus('idle'); }}
          className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-white" style={{ background: '#1e90ff' }}>
          נסיון נוסף
        </button>
      </div>
    );
  }

  if (payment && (status === 'paying' || status === 'verifying')) {
    return (
      <div dir="rtl" className="max-w-2xl mx-auto px-4 py-8" data-testid="order-payment">
        <h1 className="text-2xl font-bold mb-1 flex items-center gap-2" style={{ color: '#1a2b4a' }}>
          <CreditCard className="w-6 h-6" /> תשלום מאובטח
        </h1>
        <p className="text-sm text-gray-500 mb-1">הזמנה <span className="font-mono" dir="ltr">{orderRef}</span>{payment.amount ? ` · ${formatPrice(payment.amount)} כולל מע״מ` : ''}</p>
        <p className="text-xs text-gray-400 mb-4">הכרטיס מוקלד בדף המאובטח של קרדיט 2000 — פרטי הכרטיס לא עוברים דרך האתר.</p>
        {status === 'verifying' && (
          <div className="mb-3 text-sm rounded-lg p-3 flex items-center gap-2" style={{ background: '#fffbeb', color: '#92400e' }}>
            <Loader2 className="w-4 h-4 animate-spin" /> מאמת את התשלום מול קרדיט 2000…
          </div>
        )}
        {payment.page_url ? (
          <>
            <iframe title="תשלום מאובטח" src={payment.page_url} allow="payment" referrerPolicy="no-referrer"
              className="w-full rounded-2xl bg-white" style={{ height: 600, border: '1px solid #e8ecf0' }} />
            <a href={payment.page_url} target="_blank" rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs" style={{ color: '#1e90ff' }}>
              <ExternalLink className="w-3.5 h-3.5" /> הטופס לא נטען? פתחו אותו בלשונית נפרדת
            </a>
          </>
        ) : null}
        <p className="mt-4 text-xs text-gray-400 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> סליקה מאובטחת (PCI DSS) באמצעות קרדיט 2000 · <Link href="/privacy" className="underline">תקנון ומדיניות ביטולים</Link>
        </p>
      </div>
    );
  }

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
          <p className="text-sm text-gray-500 mb-6">{unpricedCount ? 'מלאו את הפרטים ונחזור אליכם עם הצעת מחיר ולתשלום.' : 'מלאו את הפרטים והמשיכו לתשלום מאובטח בכרטיס אשראי.'}</p>

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
              <span className="text-xs font-semibold text-gray-600 mb-1 block">אימייל *</span>
              <input required name="email" type="email" dir="ltr" value={form.email} onChange={set('email')} className={input} style={inputStyle} autoComplete="email" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-gray-600 mb-1 block">מרפאה / חברה</span>
              <input name="clinic" value={form.clinic} onChange={set('clinic')} className={input} style={inputStyle} autoComplete="organization" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-gray-600 mb-1 block">ח.פ / ע.מ / ת.ז *</span>
              <input required name="vat_number" dir="ltr" inputMode="numeric" pattern="[0-9]{5,9}" maxLength={9} title="5–9 ספרות"
                value={form.vat_number} onChange={set('vat_number')} className={input} style={inputStyle} />
              <span className="text-[11px] text-gray-400 mt-1 block">נדרש להפקת חשבונית מס/קבלה</span>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-gray-600 mb-1 block">עיר *</span>
              <input required name="city" value={form.city} onChange={set('city')} className={input} style={inputStyle} autoComplete="address-level2" />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-semibold text-gray-600 mb-1 block">כתובת למשלוח / התקנה *</span>
              <input required name="address" value={form.address} onChange={set('address')} className={input} style={inputStyle} autoComplete="street-address" />
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
            {unpricedCount ? 'שליחת ההזמנה' : 'המשך לתשלום'}
          </button>
          <p className="mt-3 text-xs text-gray-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            {unpricedCount
              ? 'פריטים לפי הצעת מחיר — נחזור אליכם לאישור ההזמנה ולתשלום.'
              : 'תשלום מאובטח בכרטיס אשראי דרך קרדיט 2000. אם התשלום באתר אינו זמין, ההזמנה תישלח אלינו ונחזור אליכם.'}
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
