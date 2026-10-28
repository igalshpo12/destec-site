// Online payment through Credit2000's hosted page — the server half (service role only).
// Mirrors des-manager's receipt charge (api/_lib/cardPayRoute.js) with three public-site
// differences: prices are RE-PRICED from catalog_products (the browser's numbers are never
// charged), the order row is claimed before the read-once verify call, and the raw answer is
// stored before anything is parsed.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { randomBytes } from 'node:crypto';
import {
  C2K_DEFAULT_URL, TOKEN_OP, sendParamsEnvelope, tokenEnvelope, soapCall, parsePageUrl, parseToken,
  isApprovedCode, isUid, uidFromUrl, newOrderRef, toAgorot, cardBrand,
} from '../credit2000.js';

export type Customer = { name: string; phone: string; email?: string; clinic?: string; address?: string; notes?: string };
export type OrderLine = { id: string; item_number: string | null; name: string; manufacturer: string | null; qty: number; unit_price: number };
export type WebOrder = {
  id: string; ref: string; order_ref: string; status: 'pending' | 'approved' | 'declined' | 'error' | 'abandoned';
  amount_agorot: number; customer: Customer; lines: OrderLine[]; gateway_uid: string | null; approval: string | null;
  card_brand: string | null; gateway_return_code: string | null; notified_at: string | null; error_text: string | null;
};

export function paymentEnv() {
  const vendor = process.env.CREDIT2000_VENDOR || '';
  const clientKey = process.env.CREDIT2000_CLIENT_KEY || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const siteUrl = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/+$/, '');
  return {
    vendor, clientKey, siteUrl,
    url: process.env.CREDIT2000_URL || C2K_DEFAULT_URL,
    // the whole feature is off until every piece is configured — then checkout behaves as before
    enabled: !!(vendor && clientKey && serviceKey && siteUrl),
  };
}

export function serviceDb(): SupabaseClient {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
}

// Re-price the cart from the catalog. Returns null when anything cannot be charged (unknown or
// inactive product, no price): the order then goes the quote/e-mail way, never to the gateway.
export async function repriceLines(db: SupabaseClient, items: Array<{ id: string; qty: number }>): Promise<OrderLine[] | null> {
  const ids = [...new Set(items.map((i) => String(i.id)))];
  if (!ids.length || ids.length > 100) return null;
  const { data, error } = await db.from('catalog_products').select('id, item_number, name_he, manufacturer, price, is_active').in('id', ids);
  if (error || !data) return null;
  const byId = new Map(data.map((r) => [String(r.id), r]));
  const lines: OrderLine[] = [];
  for (const it of items) {
    const r = byId.get(String(it.id));
    const price = Number(r?.price);
    if (!r || !r.is_active || !(price > 0)) return null;
    lines.push({
      id: String(r.id), item_number: r.item_number ?? null, name: r.name_he, manufacturer: r.manufacturer ?? null,
      qty: Math.max(1, Math.min(99, Math.floor(Number(it.qty) || 1))), unit_price: Math.round(price * 100) / 100,
    });
  }
  return lines;
}

export const linesTotal = (lines: OrderLine[]) => Math.round(lines.reduce((s, l) => s + l.unit_price * l.qty, 0) * 100) / 100;

// 1. durable row, 2. the hosted page. Returns the page URL for the browser.
export async function startOrderPayment(db: SupabaseClient, { ref, customer, lines }: { ref: string; customer: Customer; lines: OrderLine[] }) {
  const env = paymentEnv();
  const amountAgorot = toAgorot(linesTotal(lines));
  const orderRef = newOrderRef(randomBytes);
  const { data: row, error } = await db.from('web_orders')
    .insert({ ref, order_ref: orderRef, amount_agorot: amountAgorot, customer, lines, status: 'pending' })
    .select('id').single();
  if (error || !row) throw new Error('Could not record the order');
  try {
    const xml = await soapCall(fetch, env.url, 'SendParamToCredit2000', sendParamsEnvelope({
      vendor: env.vendor, clientKey: env.clientKey,
      host: `${env.siteUrl}/pay/return/${row.id}`,
      amountAgorot, installments: 1, orderRef, clientName: customer.name,
    }));
    const pageUrl = parsePageUrl(xml, '');
    if (!pageUrl) throw new Error('Credit2000 did not return a payment page');
    const uid = uidFromUrl(pageUrl);
    if (uid) await db.from('web_orders').update({ gateway_uid: uid }).eq('id', row.id).eq('status', 'pending');
    return { orderId: row.id as string, pageUrl, amount: amountAgorot / 100 };
  } catch (err) {
    await db.from('web_orders').update({ status: 'error', error_text: String((err as Error)?.message || err).slice(0, 500) })
      .eq('id', row.id).eq('status', 'pending');
    throw err;
  }
}

export async function loadOrder(db: SupabaseClient, id: string): Promise<WebOrder | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data } = await db.from('web_orders').select('*').eq('id', id).maybeSingle();
  return (data as WebOrder) || null;
}

// Ask Credit2000 ONCE and store the answer. getTokenAndApprovePro is read-once (live 2026-10-28:
// the second read of a paid uid came back empty), so: claim the row, store the raw XML, then parse.
//   unpaid  → return_Code "123" (our SendParam echo) → stays pending
//   paid    → "000" + a real Approve → approved
//   other   → declined;   empty answer → stays pending (nothing more can be learned)
export async function resolveOrder(db: SupabaseClient, order: WebOrder, uidHint?: string | null): Promise<WebOrder> {
  if (order.status !== 'pending') return order;
  const env = paymentEnv();
  const uid = (uidHint && isUid(uidHint) ? uidHint : null) || order.gateway_uid;
  if (!uid) return order;

  // claim: one verifier at a time; a stale claim (crashed verifier) is released after 20 s
  const now = new Date();
  const stale = new Date(now.getTime() - 20_000).toISOString();
  const { data: claimed } = await db.from('web_orders').update({ verifying_at: now.toISOString(), gateway_uid: uid })
    .eq('id', order.id).eq('status', 'pending').or(`verifying_at.is.null,verifying_at.lt.${stale}`).select('id').maybeSingle();
  if (!claimed) return order;

  let xml = '';
  try {
    xml = await soapCall(fetch, env.url, TOKEN_OP, tokenEnvelope({ uid }));
  } finally {
    if (!xml) await db.from('web_orders').update({ verifying_at: null }).eq('id', order.id);
  }
  const tk = parseToken(xml);
  const pending = !tk.returnCode || tk.returnCode === '123';
  if (pending) {
    await db.from('web_orders').update({ verifying_at: null }).eq('id', order.id);
    return { ...order, gateway_uid: uid };
  }
  // money may have moved: the raw answer is on the row before any decision is made
  await db.from('web_orders').update({ gateway_raw: xml, gateway_return_code: tk.returnCode || null }).eq('id', order.id);

  const problems: string[] = [];
  if (tk.productId && tk.productId !== order.order_ref) problems.push(`order ${tk.productId} ≠ ${order.order_ref}`);
  if (tk.totalAgorot != null && tk.totalAgorot !== Number(order.amount_agorot)) problems.push(`amount ${tk.totalAgorot} ≠ ${order.amount_agorot}`);
  const approval = /^0*$/.test(tk.approval) ? '' : tk.approval;
  const declined = !isApprovedCode(tk.returnCode) || !approval;
  const patch: Record<string, unknown> = {
    verifying_at: null, resolved_at: now.toISOString(), approval: approval || null, card_brand: cardBrand(tk) || null,
  };
  if (problems.length) Object.assign(patch, { status: 'error', error_text: `Mismatch: ${problems.join('; ')}` });
  else if (declined) Object.assign(patch, { status: 'declined', error_text: !isApprovedCode(tk.returnCode) ? `Return code ${tk.returnCode}` : 'No approval number' });
  else Object.assign(patch, { status: 'approved', error_text: null });
  const { data: saved } = await db.from('web_orders').update(patch).eq('id', order.id).eq('status', 'pending').select('*').maybeSingle();
  return (saved as WebOrder) || { ...order, ...patch } as WebOrder;
}

// What the browser may see. Never the raw answer, never the uid.
export function publicView(o: WebOrder) {
  return { order_id: o.id, ref: o.ref, status: o.status, amount: o.amount_agorot / 100, approval: o.approval || '', brand: o.card_brand || '', error: o.error_text || '' };
}
