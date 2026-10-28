// Every lead or order the site receives is pushed into des-manager's inbox — the `web_orders`
// table its "הזמנות נכנסות" page reads (status new → read / converted / spam; convertible to a
// document or a service call there). Shared Supabase project, service role; nothing is thrown
// to the visitor if the inbox is unreachable — the e-mail still goes out.
import { serviceDb } from './payments';

export type InboxSource = 'website' | 'contact' | 'repair';
export type InboxEntry = {
  source: InboxSource;
  client_name: string; client_phone: string; client_email?: string | null;
  subject: string; message: string;
  equipment_item_number?: string | null; equipment_name?: string | null;
  order_ref?: string | null; notes?: string | null;
};

export async function pushToInbox(entry: InboxEntry): Promise<string | null> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const { data, error } = await serviceDb().from('web_orders').insert({
      source: entry.source, status: 'new',
      client_name: entry.client_name.slice(0, 120), client_phone: entry.client_phone.slice(0, 40), client_email: entry.client_email || null,
      subject: entry.subject.slice(0, 200), message: entry.message.slice(0, 4000),
      equipment_item_number: entry.equipment_item_number || null, equipment_name: entry.equipment_name || null,
      order_ref: entry.order_ref || null, notes: entry.notes || null,
    }).select('id').single();
    if (error) { console.error('[Inbox] insert failed:', error.message); return null; }
    return data?.id ?? null;
  } catch (e) {
    console.error('[Inbox] insert failed:', e);
    return null;
  }
}

const ils = (n: number) => new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 2 }).format(n);

// The order as the inbox shows it: one line per item, then the customer's details.
export function orderMessage({ lines, customer, paid }: {
  lines: Array<{ name: string; itemNumber?: string | null; manufacturer?: string | null; qty: number; price?: number | null }>;
  customer: { clinic?: string; address?: string; notes?: string; email?: string };
  paid?: { amount: number; approval: string; brand?: string } | null;
}) {
  const items = lines.map((l) => `• ${l.name}${l.manufacturer ? ` (${l.manufacturer})` : ''}${l.itemNumber ? ` · מק״ט ${l.itemNumber}` : ''} × ${l.qty}${l.price ? ` · ${ils(l.price * l.qty)}` : ' · לפי הצעת מחיר'}`);
  const total = lines.reduce((s, l) => s + (l.price ? l.price * l.qty : 0), 0);
  const out = [...items, `סה״כ מתומחר: ${ils(total)} כולל מע״מ`];
  if (paid) out.push(`✔ שולם באתר בכרטיס אשראי: ${ils(paid.amount)} · אישור ${paid.approval}${paid.brand ? ` · ${paid.brand}` : ''} — יש להפיק קבלה`);
  else out.push('התשלום טרם בוצע');
  if (customer.clinic) out.push(`מרפאה/חברה: ${customer.clinic}`);
  if (customer.address) out.push(`כתובת: ${customer.address}`);
  if (customer.notes) out.push(`הערות: ${customer.notes}`);
  return out.join('\n');
}
