// A paid order → a חשבונית מס/קבלה ISSUED in des-manager by the manager's own document code
// (des-manager api/_lib/webSaleRoute.js; owner 2026-10-29: real documents, no receipt drafts). Shared secret WEB_SALE_KEY on both sides.
// Idempotent there (one draft per WEB ref); a failure here never fails the customer's payment.
import type { WebOrder } from './payments';

export const managerDraftEnabled = () => !!(process.env.MANAGER_URL && process.env.WEB_SALE_KEY);

export type ManagerReceipt = { filename: string; pdf_base64: string; archived_at?: string | null; warning?: string };
export type ManagerDoc = {
  doc_number?: string; draft_number?: string; doc_id?: string; issued?: boolean; existed?: boolean; warning?: string; allocation_number?: string | null;
  client?: { created?: boolean; digital_docs_consent?: boolean };
  // The SIGNED original (מסמך ממוחשב) when the client consented and signing is configured there.
  receipt?: ManagerReceipt; receipt_warning?: string;
};

export async function createManagerDraft(row: WebOrder): Promise<ManagerDoc | null> {
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
        consent: { digital_docs: !!row.customer.consent_digital_docs },
      }),
      signal: AbortSignal.timeout(55_000),   // two Chromium renders + signing on a cold function
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { console.error('[Manager] draft failed:', res.status, data?.error); return null; }
    return data;
  } catch (e) {
    console.error('[Manager] draft request failed:', e);
    return null;
  }
}
