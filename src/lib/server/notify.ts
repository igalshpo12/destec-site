// DES is e-mailed exactly once per APPROVED online order (the row's notified_at is the claim).
import type { SupabaseClient } from '@supabase/supabase-js';
import type { WebOrder } from './payments';
import { sendOrderEmail } from './orderEmail';

export async function notifyIfApproved(db: SupabaseClient, row: WebOrder) {
  if (row.status !== 'approved' || row.notified_at) return;
  // claim the notification so two verifiers never send two e-mails
  const { data } = await db.from('web_orders').update({ notified_at: new Date().toISOString() }).eq('id', row.id).is('notified_at', null).select('id').maybeSingle();
  if (!data) return;
  try {
    await sendOrderEmail({
      ref: row.ref, customer: row.customer,
      lines: row.lines.map((l) => ({ name: l.name, itemNumber: l.item_number, manufacturer: l.manufacturer, price: l.unit_price, qty: l.qty })),
      payment: { approval: row.approval || '', brand: row.card_brand || '', amount: row.amount_agorot / 100 },
    });
  } catch (e) {
    console.error('[Pay] order e-mail failed:', e);
    await db.from('web_orders').update({ notified_at: null }).eq('id', row.id);
  }
}
