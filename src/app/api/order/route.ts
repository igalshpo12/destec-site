import { NextRequest, NextResponse } from 'next/server';
import { sendOrderEmail } from '@/lib/server/orderEmail';
import { paymentEnv, serviceDb, repriceLines, startOrderPayment } from '@/lib/server/payments';

/**
 * Order request from the cart/checkout.
 *  - Online payment configured (Credit2000) and every item priced in the catalog: the order is
 *    recorded (online_orders), the hosted payment page is opened, and DES is e-mailed only once the
 *    payment is approved (/api/pay/verify).
 *  - Otherwise (quote items, or payment not configured): the order goes to DES by e-mail, as before.
 * Prices in the request are display only — a charge is always re-priced from catalog_products.
 */
interface OrderLine { id: string; name: string; itemNumber?: string | null; manufacturer?: string | null; price?: number | null; qty: number }
interface OrderPayload { name: string; phone: string; email?: string; clinic?: string; address?: string; notes?: string; items: OrderLine[] }

const clean = (s: unknown, max = 200) => String(s ?? '').trim().slice(0, max);

export async function POST(req: NextRequest) {
  try {
    const body: OrderPayload = await req.json();
    if (!body.name || !body.phone || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields: name, phone, items' }, { status: 400 });
    }
    if (body.items.length > 100) return NextResponse.json({ error: 'Too many items' }, { status: 400 });

    const customer = {
      name: clean(body.name, 120), phone: clean(body.phone, 40), email: clean(body.email, 120) || undefined,
      clinic: clean(body.clinic, 120) || undefined, address: clean(body.address, 300) || undefined, notes: clean(body.notes, 2000) || undefined,
    };
    const lines = body.items.map((l) => ({
      ...l,
      qty: Math.max(1, Math.min(99, Math.floor(Number(l.qty) || 1))),
      price: typeof l.price === 'number' && l.price > 0 ? l.price : null,
    }));
    const orderRef = `WEB-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const subtotal = lines.reduce((s, l) => s + (l.price ? l.price * l.qty : 0), 0);
    console.log('[Order]', { ref: orderRef, timestamp: new Date().toISOString(), name: customer.name, phone: customer.phone, lines: lines.length, subtotal });

    // ---- online payment path
    if (paymentEnv().enabled) {
      const db = serviceDb();
      const priced = await repriceLines(db, lines.map((l) => ({ id: l.id, qty: l.qty })));
      if (priced) {
        try {
          const { orderId, pageUrl, amount } = await startOrderPayment(db, { ref: orderRef, customer, lines: priced });
          return NextResponse.json({ success: true, ref: orderRef, payment: { order_id: orderId, page_url: pageUrl, amount } });
        } catch (e) {
          console.error('[Order] payment start failed, falling back to e-mail:', e);
        }
      }
    }

    // ---- quote / e-mail path (unchanged behaviour)
    try { await sendOrderEmail({ ref: orderRef, customer, lines }); } catch (e) { console.error('[Order] Failed to send email:', e); }
    return NextResponse.json({ success: true, ref: orderRef });
  } catch (err) {
    console.error('[Order] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
