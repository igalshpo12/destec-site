// A paid order → a חשבונית מס/קבלה DRAFT in des-manager, created by the manager's own document
// code (des-manager api/_lib/webSaleRoute.js). Shared secret WEB_SALE_KEY on both sides.
// Idempotent there (one draft per WEB ref); a failure here never fails the customer's payment.
import type { WebOrder } from './payments';

export const managerDraftEnabled = () => !!(process.env.MANAGER_URL && process.env.WEB_SALE_KEY);

export async function createManagerDraft(row: WebOrder): Promise<{ doc_number?: string; doc_id?: string; existed?: boolean; warning?: string; client?: { created?: boolean } } | null> {
  if (!managerDraftEnabled() || row.status !== 'approved') return null;
  try {
    const res = await fetch(`${String(process.env.MANAGER_URL).replace(/\/+$/, '')}/api/calendar/web-sale-draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-web-sale-key': String(process.env.WEB_SALE_KEY) },
      body: JSON.stringify({
        ref: row.ref, online_order_id: row.id,
        customer: row.customer,
        lines: row.lines.map((l) => ({ name: l.name, item_number: l.item_number, qty: l.qty, unit_price_incl_vat: l.unit_price })),
        payment: { amount: row.amount_agorot / 100, approval: row.approval || '', brand: row.card_brand || '' },
      }),
      signal: AbortSignal.timeout(20_000),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { console.error('[Manager] draft failed:', res.status, data?.error); return null; }
    return data;
  } catch (e) {
    console.error('[Manager] draft request failed:', e);
    return null;
  }
}
