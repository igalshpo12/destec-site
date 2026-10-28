// Browser side of the online payment: the shapes /api/order and /api/pay/verify return, and the
// message the return page posts into the checkout window.
export type PaymentStart = { order_id: string; page_url: string; amount: number };
export type PaymentView = { order_id: string; ref: string; status: 'pending' | 'approved' | 'declined' | 'error' | 'abandoned'; amount: number; approval: string; brand: string; error: string };

export async function verifyPayment(orderId: string, uid?: string | null): Promise<PaymentView> {
  const res = await fetch('/api/pay/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order_id: orderId, uid: uid || undefined }) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok && !data?.status) throw new Error(data?.error || `HTTP ${res.status}`);
  return data as PaymentView;
}

// Only our own origin, only the order this page started.
export function returnMessage(event: MessageEvent, orderId: string): { uid: string | null; view: PaymentView | null } | null {
  if (event.origin !== window.location.origin) return null;
  const d = event.data;
  if (!d || d.type !== 'c2k-return' || d.order_id !== orderId) return null;
  return { uid: typeof d.uid === 'string' ? d.uid : null, view: d.view && typeof d.view === 'object' ? (d.view as PaymentView) : null };
}
