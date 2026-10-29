// DES is e-mailed exactly once per APPROVED online order (the row's notified_at is the claim).
import type { SupabaseClient } from '@supabase/supabase-js';
import type { WebOrder } from './payments';
import { sendOrderEmail, sendCustomerThanks } from './orderEmail';
import { pushToInbox, updateInboxByRef, orderMessage } from './inbox';
import { renderOrderPdf } from './orderPdf';
import { createManagerDraft } from './managerDraft';

export async function notifyIfApproved(db: SupabaseClient, row: WebOrder) {
  if (row.status !== 'approved' || row.notified_at) return;
  // claim the notification so two verifiers never send two e-mails
  const { data } = await db.from('online_orders').update({ notified_at: new Date().toISOString() }).eq('id', row.id).is('notified_at', null).select('id').maybeSingle();
  if (!data) return;
  const lines = row.lines.map((l) => ({ name: l.name, itemNumber: l.item_number, manufacturer: l.manufacturer, price: l.unit_price, qty: l.qty }));
  const payment = { approval: row.approval || '', brand: row.card_brand || '', amount: row.amount_agorot / 100 };
  const entry = {
    subject: `הזמנה מהאתר ${row.ref} — שולם ${new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(payment.amount)}`,
    message: orderMessage({ lines, customer: row.customer, paid: payment }),
    notes: `Credit2000 אישור ${payment.approval} · online_orders ${row.id}`,
  };
  if (!(await updateInboxByRef(row.ref, entry))) {
    await pushToInbox({
      source: 'website', client_name: row.customer.name, client_phone: row.customer.phone, client_email: row.customer.email,
      ...entry, order_ref: row.ref,
      equipment_item_number: lines[0]?.itemNumber || null, equipment_name: lines.length === 1 ? lines[0].name : null,
    });
  }
  // the manager's draft first (its number goes into the inbox entry), then the e-mails
  const doc = await createManagerDraft(row);
  if (doc) {
    const receiptLine = doc.receipt ? ' · מסמך ממוחשב חתום נשלח ללקוח במייל' : doc.receipt_warning ? ` · ⚠ המסמך לא נשלח ללקוח (${doc.receipt_warning}) — יש להדפיס ולשלוח` : '';
    const line = doc.issued
      ? `קבלה ${doc.doc_number} הופקה במנהל${receiptLine} · חשבונית מס עם האספקה (לשייך לקבלה)`
      : `⚠ לא הופקה קבלה אוטומטית${doc.doc_number ? ` — טיוטה ${doc.doc_number}` : ''}${doc.warning ? ` · ${doc.warning}` : ''} — יש להפיק היום`;
    await updateInboxByRef(row.ref, { notes: `${entry.notes} · ${line}${doc.client?.created ? ' · לקוח חדש נפתח' : ''}` });
  } else {
    await updateInboxByRef(row.ref, { notes: `${entry.notes} · ⚠ המנהל לא הגיב — יש להפיק חשבונית מס/קבלה ידנית` });
  }
  const paymentForDes = { ...payment, document: doc ? { issued: !!doc.issued, doc_number: doc.doc_number, warning: doc.warning } : { issued: false } };
  try {
    await sendOrderEmail({ ref: row.ref, customer: row.customer, lines, payment: paymentForDes });
    let pdf: Buffer | null = null;
    try { pdf = await renderOrderPdf({ ref: row.ref, customer: row.customer, lines, payment }); } catch (e) { console.error('[Pay] order PDF failed (mail goes without it):', e); }
    const receipt = doc?.receipt ? { filename: doc.receipt.filename, content: Buffer.from(doc.receipt.pdf_base64, 'base64') } : null;
    try { await sendCustomerThanks({ ref: row.ref, customer: row.customer, lines, payment, pdf, receipt }); } catch (e) { console.error('[Pay] customer e-mail failed:', e); }
  } catch (e) {
    console.error('[Pay] order e-mail failed:', e);
    await db.from('online_orders').update({ notified_at: null }).eq('id', row.id);
  }
}

// A refused or mismatched payment: the inbox entry says so (the lead stays — DES may call).
export async function markInboxUnpaid(row: WebOrder) {
  if (row.status !== 'declined' && row.status !== 'error') return;
  const lines = row.lines.map((l) => ({ name: l.name, itemNumber: l.item_number, manufacturer: l.manufacturer, price: l.unit_price, qty: l.qty }));
  const why = row.status === 'declined' ? 'התשלום באתר נדחה' : 'שגיאה בתשלום באתר';
  await updateInboxByRef(row.ref, {
    subject: `הזמנה מהאתר ${row.ref} — ${why}`,
    message: orderMessage({ lines, customer: row.customer, paymentNote: `✖ ${why}${row.error_text ? ` (${row.error_text})` : ''} — כדאי ליצור קשר עם הלקוח` }),
  });
}
