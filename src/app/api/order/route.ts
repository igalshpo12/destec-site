import { NextRequest, NextResponse } from 'next/server';

/**
 * Order request from the cart/checkout. Sends the order to DES by email
 * (same Resend pipeline as /api/contact) and logs it. Online payment is NOT
 * processed here yet — see the payment note in src/lib/cart.tsx.
 */
interface OrderLine {
  id: string;
  name: string;
  itemNumber?: string | null;
  manufacturer?: string | null;
  price?: number | null;
  qty: number;
}
interface OrderPayload {
  name: string;
  phone: string;
  email?: string;
  clinic?: string;
  address?: string;
  notes?: string;
  items: OrderLine[];
}

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ils = (n: number) => new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 2 }).format(n);

export async function POST(req: NextRequest) {
  try {
    const body: OrderPayload = await req.json();
    if (!body.name || !body.phone || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields: name, phone, items' }, { status: 400 });
    }
    if (body.items.length > 100) return NextResponse.json({ error: 'Too many items' }, { status: 400 });

    const lines = body.items.map((l) => ({
      ...l,
      qty: Math.max(1, Math.min(99, Math.floor(Number(l.qty) || 1))),
      price: typeof l.price === 'number' && l.price > 0 ? l.price : null,
    }));
    const subtotal = lines.reduce((s, l) => s + (l.price ? l.price * l.qty : 0), 0);
    const unpriced = lines.filter((l) => !l.price).length;
    const orderRef = `WEB-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    console.log('[Order]', { ref: orderRef, timestamp: new Date().toISOString(), name: body.name, phone: body.phone, email: body.email, clinic: body.clinic, lines: lines.length, subtotal });

    const resendKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL || 'info@destec.co.il';
    if (resendKey) {
      const rows = lines
        .map(
          (l) => `<tr>
            <td style="padding:8px;border-bottom:1px solid #eee;">${esc(l.name)}${l.manufacturer ? `<br/><span style="color:#888;font-size:12px;">${esc(l.manufacturer)}</span>` : ''}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;" dir="ltr">${esc(l.itemNumber || '')}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${l.qty}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;">${l.price ? ils(l.price) : 'לפי הצעת מחיר'}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;">${l.price ? ils(l.price * l.qty) : '—'}</td>
          </tr>`
        )
        .join('');
      const html = `
        <div dir="rtl" style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;">
          <h2 style="color:#1a2b4a;">הזמנה חדשה מאתר DES — ${orderRef}</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
            <tr><td style="padding:6px;color:#666;">שם:</td><td style="padding:6px;">${esc(body.name)}</td></tr>
            ${body.clinic ? `<tr><td style="padding:6px;color:#666;">מרפאה/חברה:</td><td style="padding:6px;">${esc(body.clinic)}</td></tr>` : ''}
            <tr><td style="padding:6px;color:#666;">טלפון:</td><td style="padding:6px;" dir="ltr">${esc(body.phone)}</td></tr>
            ${body.email ? `<tr><td style="padding:6px;color:#666;">אימייל:</td><td style="padding:6px;">${esc(body.email)}</td></tr>` : ''}
            ${body.address ? `<tr><td style="padding:6px;color:#666;">כתובת למשלוח:</td><td style="padding:6px;">${esc(body.address)}</td></tr>` : ''}
          </table>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <thead><tr style="background:#f4f6f8;">
              <th style="padding:8px;text-align:right;">מוצר</th><th style="padding:8px;text-align:right;">מק״ט</th><th style="padding:8px;">כמות</th><th style="padding:8px;text-align:right;">מחיר</th><th style="padding:8px;text-align:right;">סה״כ</th>
            </tr></thead>
            <tbody>${rows}</tbody>
          </table>
          <p style="font-size:16px;margin:16px 0 4px;"><strong>סה״כ פריטים מתומחרים: ${ils(subtotal)}</strong> <span style="color:#888;font-size:12px;">(כולל מע״מ)</span></p>
          ${unpriced ? `<p style="color:#b45309;">${unpriced} פריטים ללא מחיר באתר — נדרשת הצעת מחיר.</p>` : ''}
          ${body.notes ? `<h3 style="color:#1a2b4a;margin-top:20px;">הערות</h3><p style="white-space:pre-wrap;">${esc(body.notes)}</p>` : ''}
          <hr style="margin:20px 0;border:none;border-top:1px solid #eee;" />
          <p style="color:#999;font-size:12px;">נשלח מאתר destec.co.il · התשלום טרם בוצע — יש ליצור קשר עם הלקוח לאישור ולגבייה.</p>
        </div>`;
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'DES Orders <noreply@destec.co.il>',
            to: [contactEmail],
            reply_to: body.email || undefined,
            subject: `[הזמנה מהאתר] ${orderRef} — ${body.name}${body.clinic ? ` (${body.clinic})` : ''} · ${lines.length} פריטים`,
            html,
          }),
        });
        if (!res.ok) console.error('[Order] Resend error:', await res.text());
      } catch (e) {
        console.error('[Order] Failed to send email:', e);
      }
    } else {
      console.log('[Order] RESEND_API_KEY not configured — email not sent');
    }

    return NextResponse.json({ success: true, ref: orderRef });
  } catch (err) {
    console.error('[Order] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
