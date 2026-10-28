// DES is e-mailed exactly once per APPROVED online order (the row's notified_at is the claim).
import type { SupabaseClient } from '@supabase/supabase-js';
import type { WebOrder } from './payments';
import { sendOrderEmail } from './orderEmail';
import { pushToInbox, orderMessage } from './inbox';

export async function notifyIfApproved(db: SupabaseClient, row: WebOrder) {
  if (row.status !== 'approved' || row.notified_at) return;
  // claim the notification so two verifiers never send two e-mails
  const { data } = await db.from('online_orders').update({ notified_at: new Date().toISOString() }).eq('id', row.id).is('notified_at', null).select('id').maybeSingle();
  if (!data) return;
  const lines = row.lines.map((l) => ({ name: l.name, itemNumber: l.item_number, manufacturer: l.manufacturer, price: l.unit_price, qty: l.qty }));
  const payment = { approval: row.approval || '', brand: row.card_brand || '', amount: row.amount_agorot / 100 };
  await pushToInbox({
    source: 'website', client_name: row.customer.name, client_phone: row.customer.phone, client_email: row.customer.email,
    subject: `הזמנה מהאתר ${row.ref} — שולם ${new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(payment.amount)}`,
    message: orderMessage({ lines, customer: row.customer, paid: payment }), order_ref: row.ref,
    equipment_item_number: lines[0]?.itemNumber || null, equipment_name: lines.length === 1 ? lines[0].name : null,
    notes: `Credit2000 אישור ${payment.approval} · online_orders ${row.id}`,
  });
  try {
    await sendOrderEmail({ ref: row.ref, customer: row.customer, lines, payment });
  } catch (e) {
    console.error('[Pay] order e-mail failed:', e);
    await db.from('online_orders').update({ notified_at: null }).eq('id', row.id);
  }
}
