import { NextRequest, NextResponse } from 'next/server';
import { paymentEnv, serviceDb, loadOrder, resolveOrder, publicView } from '@/lib/server/payments';
import { isUid } from '@/lib/credit2000.js';
import { notifyIfApproved, markInboxUnpaid } from '@/lib/server/notify';

// Where Credit2000 sends the payer's browser after the hosted form (?params=<uid>). It lands
// inside the checkout page's iframe (or a tab the customer opened). The payment is verified
// SERVER-SIDE right here, so a customer who closes the tab is still recorded; then the page
// tells the checkout window, which shows the result.
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const env = paymentEnv();
  const uidParam = req.nextUrl.searchParams.get('params') || '';
  const uid = isUid(uidParam) ? uidParam : null;
  let view: ReturnType<typeof publicView> | null = null;
  if (env.enabled) {
    const db = serviceDb();
    const order = await loadOrder(db, id);
    if (order) {
      try { const row = await resolveOrder(db, order, uid); await notifyIfApproved(db, row); await markInboxUnpaid(row); view = publicView(row); }
      catch (e) { console.error('[Pay] return verify failed:', e); view = publicView(order); }
    }
  }
  const payload = JSON.stringify({ type: 'c2k-return', order_id: id, uid, view }).replace(/</g, '\\u003c');
  const origin = JSON.stringify(env.siteUrl || '*');
  const text = view?.status === 'approved' ? 'התשלום התקבל, תודה!' : view?.status === 'declined' ? 'התשלום לא אושר.' : 'מאמת את התשלום…';
  const html = `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DES</title>
<style>body{font-family:system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:90vh;margin:0;color:#1a2b4a;background:#fff;gap:12px}a{color:#1e90ff}</style></head>
<body><p>${text}</p><a href="${env.siteUrl || ''}/checkout?order=${encodeURIComponent(id)}">חזרה לאתר</a><script>
(function(){var m=${payload},o=${origin};
try{if(window.parent&&window.parent!==window)window.parent.postMessage(m,o)}catch(e){}
try{if(window.opener)window.opener.postMessage(m,o)}catch(e){}
})()</script></body></html>`;
  return new NextResponse(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}
