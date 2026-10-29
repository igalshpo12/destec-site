import { NextRequest, NextResponse } from 'next/server';
import { sendOrderEmail } from '@/lib/server/orderEmail';
import { paymentEnv, serviceDb, repriceLines, startOrderPayment, knownClient } from '@/lib/server/payments';
import { pushToInbox, orderMessage } from '@/lib/server/inbox';

/**
 * Order request from the cart/checkout.
 *  - Online payment configured (Credit2000) and every item priced in the catalog: the order is
 *    recorded (online_orders), the hosted payment page is opened, and DES is e-mailed only once the
 *    payment is approved (/api/pay/verify).
 *  - Otherwise (quote items, or payment not configured): the order goes to DES by e-mail, as before.
 * Prices in the request are display only — a charge is always re-priced from catalog_products.
 */
interface OrderLine { id: string; name: string; itemNumber?: string | null; manufacturer?: string | null; price?: number | null; qty: number }
interface OrderPayload { name: string; phone: string; email?: string; clinic?: string; vat_number?: string; address?: string; city?: string; notes?: string; digital_docs_consent?: boolean; items: OrderLine[] }

const clean = (s: unknown, max = 200) => String(s ?? '').trim().slice(0, max);

export async function POST(req: NextRequest) {
  try {
    const body: OrderPayload = await req.json();
    if (!body.name || !body.phone || !body.email || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields: name, phone, email, items' }, { status: 400 });
    }
    if (body.items.length > 100) return NextResponse.json({ error: 'Too many items' }, { status: 400 });

    const customer = {
      name: clean(body.name, 120), phone: clean(body.phone, 40), email: clean(body.email, 120) || undefined,
      clinic: clean(body.clinic, 120) || undefined, address: clean(body.address, 300) || undefined, notes: clean(body.notes, 2000) || undefined,
      vat_number: clean(body.vat_number, 9).replace(/\D/g, '') || undefined, city: clean(body.city, 80) || undefined,
      // 18ב(ג) consent to receive signed documents by e-mail — kept with the order, recorded on the client by the manager.
      consent_digital_docs: body.digital_docs_consent === true,
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
      // A paid order becomes an issued חשבונית מס/קבלה, which needs the client's business number.
      // Known clients have it on their card in the manager; only a new buyer must type it.
      if (priced && !customer.vat_number && !(await knownClient(db, customer))) {
        return NextResponse.json({ error: 'נדרש ח.פ / ע.מ / ת.ז להפקת חשבונית מס/קבלה', code: 'need_vat' }, { status: 400 });
      }
      if (priced) {
        try {
          const { orderId, pageUrl, amount } = await startOrderPayment(db, { ref: orderRef, customer, lines: priced });
          // In the inbox right away as "awaiting payment": a customer who fills everything and
          // never pays is a lead. /api/pay/verify rewrites the entry when the payment settles.
          const emailLines = priced.map((l) => ({ name: l.name, itemNumber: l.item_number, manufacturer: l.manufacturer, price: l.unit_price, qty: l.qty }));
          await pushToInbox({
            source: 'website', client_name: customer.name, client_phone: customer.phone, client_email: customer.email,
            subject: `הזמנה מהאתר ${orderRef} — ממתין לתשלום באתר (${new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(amount)})`,
            message: orderMessage({ lines: emailLines, customer, paymentNote: '⏳ דף התשלום נפתח ללקוח — התשלום טרם אושר' }),
            order_ref: orderRef, equipment_item_number: priced[0]?.item_number || null, equipment_name: priced.length === 1 ? priced[0].name : null,
            notes: `online_orders ${orderId}`,
          });
          return NextResponse.json({ success: true, ref: orderRef, payment: { order_id: orderId, page_url: pageUrl, amount } });
        } catch (e) {
          console.error('[Order] payment start failed, falling back to e-mail:', e);
        }
      }
    }

    // ---- quote / e-mail path: e-mail to DES + the manager's inbox (הזמנות נכנסות)
    try { await sendOrderEmail({ ref: orderRef, customer, lines }); } catch (e) { console.error('[Order] Failed to send email:', e); }
    await pushToInbox({
      source: 'website', client_name: customer.name, client_phone: customer.phone, client_email: customer.email,
      subject: `הזמנה מהאתר ${orderRef} — ${lines.length} פריטים (טרם שולם)`,
      message: orderMessage({ lines, customer }), order_ref: orderRef,
      equipment_item_number: lines[0]?.itemNumber || null, equipment_name: lines.length === 1 ? lines[0].name : null,
    });
    return NextResponse.json({ success: true, ref: orderRef });
  } catch (err) {
    console.error('[Order] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
