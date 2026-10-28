import { NextRequest, NextResponse } from 'next/server';
import { paymentEnv, serviceDb, loadOrder, resolveOrder, publicView } from '@/lib/server/payments';
import { notifyIfApproved, markInboxUnpaid } from '@/lib/server/notify';

// The checkout page polls this (and calls it when the return page reports). The answer comes
// from Credit2000 itself — the redirect alone proves nothing. Approved → DES is e-mailed once.
export async function POST(req: NextRequest) {
  if (!paymentEnv().enabled) return NextResponse.json({ error: 'Payments not configured' }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  const db = serviceDb();
  const order = await loadOrder(db, String(body?.order_id || ''));
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  try {
    const row = await resolveOrder(db, order, typeof body?.uid === 'string' ? body.uid : null);
    await notifyIfApproved(db, row); await markInboxUnpaid(row);
    return NextResponse.json({ ok: true, ...publicView(row) });
  } catch (e) {
    console.error('[Pay] verify failed:', e);
    return NextResponse.json({ ...publicView(order), error: 'Could not reach Credit2000 to confirm the payment' }, { status: 502 });
  }
}
