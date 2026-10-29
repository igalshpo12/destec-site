import type { Metadata } from 'next';
import Link from 'next/link';
import { Package, LogOut, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { currentCustomerEmail, authEnabled } from '@/lib/server/auth';
import { serviceDb, type WebOrder } from '@/lib/server/payments';
import { formatPrice } from '@/lib/utils';
import LoginForm from './LoginForm';

export const metadata: Metadata = { title: 'האזור האישי', description: 'ההזמנות שלי באתר DES.', robots: { index: false } };
export const dynamic = 'force-dynamic';

const STATUS: Record<WebOrder['status'], { label: string; color: string; Icon: typeof Clock }> = {
  approved: { label: 'שולם', color: '#16a34a', Icon: CheckCircle2 },
  pending: { label: 'ממתין לתשלום', color: '#d97706', Icon: Clock },
  declined: { label: 'התשלום לא אושר', color: '#dc2626', Icon: XCircle },
  error: { label: 'שגיאה בתשלום', color: '#dc2626', Icon: XCircle },
  abandoned: { label: 'לא הושלם', color: '#94a3b8', Icon: XCircle },
};
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' });

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ login?: string }> }) {
  const q = await searchParams;
  const email = await currentCustomerEmail();
  if (!email) {
    const notice = !authEnabled() ? 'הכניסה לאזור האישי עדיין לא פעילה.'
      : q.login === 'invalid' ? 'הקישור פג תוקף או כבר נוצל — בקשו קישור חדש.' : null;
    return (
      <div dir="rtl" className="max-w-md mx-auto px-4 py-12">
        <LoginForm notice={notice} />
      </div>
    );
  }

  const { data } = await serviceDb().from('online_orders')
    .select('id, ref, status, amount_agorot, lines, approval, created_at')
    .ilike('customer->>email', email).order('created_at', { ascending: false }).limit(100);
  const orders = (data || []) as Array<Pick<WebOrder, 'id' | 'ref' | 'status' | 'amount_agorot' | 'lines' | 'approval'> & { created_at: string }>;

  return (
    <div dir="rtl" className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1a2b4a' }}>האזור האישי</h1>
          <p className="text-sm text-gray-500" dir="ltr">{email}</p>
        </div>
        <form action="/api/auth/logout" method="post">
          <button type="submit" className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl" style={{ background: '#f8f9fb', border: '1px solid #e8ecf0', color: '#1a2b4a' }}>
            <LogOut className="w-4 h-4" /> יציאה
          </button>
        </form>
      </div>

      <h2 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#1a2b4a' }}><Package className="w-5 h-5" /> ההזמנות שלי</h2>
      {orders.length === 0 ? (
        <div className="rounded-2xl p-8 bg-white text-center text-gray-500" style={{ border: '1px solid #e8ecf0' }} data-testid="orders-empty">
          עדיין אין הזמנות באתר עבור כתובת זו.
          <div className="mt-3"><Link href="/catalog" className="text-sm font-semibold underline" style={{ color: '#1e90ff' }}>לקטלוג המוצרים</Link></div>
        </div>
      ) : (
        <ul className="space-y-3" data-testid="orders-list">
          {orders.map((o) => {
            const st = STATUS[o.status] || STATUS.pending;
            return (
              <li key={o.id} className="rounded-2xl p-5 bg-white" style={{ border: '1px solid #e8ecf0' }}>
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm" dir="ltr">{o.ref}</span>
                    <span className="text-xs text-gray-400">{fmtDate(o.created_at)}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg" style={{ background: `${st.color}15`, color: st.color }}>
                    <st.Icon className="w-3.5 h-3.5" /> {st.label}
                  </span>
                </div>
                <ul className="text-sm divide-y" style={{ borderColor: '#f0f2f5' }}>
                  {o.lines.map((l, i) => (
                    <li key={i} className="py-1.5 flex justify-between gap-3">
                      <span className="truncate" style={{ color: '#1a2b4a' }}>{l.name}{l.manufacturer ? <span className="text-gray-400"> · {l.manufacturer}</span> : null} <span className="text-gray-400">×{l.qty}</span></span>
                      <span className="tabular-nums flex-shrink-0">{formatPrice(l.unit_price * l.qty)}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between pt-3 mt-1 text-sm" style={{ borderTop: '1px solid #e8ecf0' }}>
                  <span className="text-gray-500">סה״כ כולל מע״מ{o.approval ? ` · אישור ${o.approval}` : ''}</span>
                  <span className="font-bold" style={{ color: '#1a2b4a' }}>{formatPrice(o.amount_agorot / 100)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <p className="text-xs text-gray-400 mt-6">חשבוניות וקבלות נשלחות אליכם בנפרד על ידי DES. שאלות? <a className="underline" href="https://wa.me/972548818681">WhatsApp</a></p>
    </div>
  );
}
