import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface TouchData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  landing_page?: string;
  referrer?: string;
  ts?: string;
}

interface ContactPayload {
  name: string;
  company?: string;
  phone: string;
  email?: string;
  message: string;
  attribution?: { first?: TouchData; last?: TouchData };
  eventId?: string;
}

const esc = (s = '') =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Human-readable one-liner for a touch, e.g. "facebook / cpc / repairs-may". */
function touchSummary(t?: TouchData): string {
  if (!t) return '—';
  const parts = [t.utm_source, t.utm_medium, t.utm_campaign].filter(Boolean);
  let s = parts.length ? parts.join(' / ') : t.referrer || 'ישיר/אורגני';
  const ids = [t.gclid && 'gclid', t.fbclid && 'fbclid'].filter(Boolean);
  if (ids.length) s += ` (${ids.join(', ')})`;
  return esc(s);
}

const sha256 = (v: string) => crypto.createHash('sha256').update(v).digest('hex');
const normEmail = (e?: string) => (e ? e.trim().toLowerCase() : '');
function normPhone(p?: string): string {
  if (!p) return '';
  let d = p.replace(/\D/g, '');
  if (d.startsWith('0')) d = '972' + d.slice(1); // Israeli local → E.164 digits
  return d;
}

/**
 * Server-side Meta Conversions API "Lead" event. Improves match quality and
 * survives ad-blockers / iOS tracking limits. Deduplicated against the browser
 * pixel via the shared eventId. No-ops unless the pixel id + CAPI token are set.
 */
async function sendMetaCapiLead(req: NextRequest, body: ContactPayload) {
  const pixelId = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!pixelId || !token) return;

  const fbp = req.cookies.get('_fbp')?.value;
  const fbc = req.cookies.get('_fbc')?.value;
  const ua = req.headers.get('user-agent') || undefined;
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    undefined;
  const sourceUrl =
    req.headers.get('referer') || `https://destec.co.il${body.attribution?.last?.landing_page ?? ''}`;

  const userData: Record<string, unknown> = { client_user_agent: ua, client_ip_address: ip };
  if (body.email) userData.em = [sha256(normEmail(body.email))];
  if (body.phone) userData.ph = [sha256(normPhone(body.phone))];
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;

  const last = body.attribution?.last;
  const payload = {
    data: [
      {
        event_name: 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        event_id: body.eventId,
        action_source: 'website',
        event_source_url: sourceUrl,
        user_data: userData,
        custom_data: {
          content_name: 'contact_form',
          utm_source: last?.utm_source,
          utm_medium: last?.utm_medium,
          utm_campaign: last?.utm_campaign,
        },
      },
    ],
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) console.error('[Contact Form] Meta CAPI error:', await res.text());
    else console.log('[Contact Form] Meta CAPI Lead sent');
  } catch (e) {
    console.error('[Contact Form] Meta CAPI request failed:', e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: ContactPayload = await req.json();

    // Validate required fields
    if (!body.name || !body.phone || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, phone, message' },
        { status: 400 }
      );
    }

    // Log submission (always)
    console.log('[Contact Form]', {
      timestamp: new Date().toISOString(),
      ...body,
    });

    // Send email via Resend if API key is configured
    const resendKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL || 'info@destec.co.il';

    if (resendKey) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'DES Contact Form <noreply@destec.co.il>',
            to: [contactEmail],
            subject: `פנייה חדשה מ-${body.name}${body.company ? ` (${body.company})` : ''}`,
            html: `
              <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1a2b4a;">פנייה חדשה מאתר DES</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>שם:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${esc(body.name)}</td></tr>
                  ${body.company ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>חברה:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${esc(body.company)}</td></tr>` : ''}
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>טלפון:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;" dir="ltr">${esc(body.phone)}</td></tr>
                  ${body.email ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>אימייל:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${esc(body.email)}</td></tr>` : ''}
                  <tr><td style="padding: 8px;" colspan="2"><strong>הודעה:</strong><br/><p style="white-space: pre-wrap;">${esc(body.message)}</p></td></tr>
                </table>
                <h3 style="color: #1a2b4a; margin: 20px 0 8px;">מקור הליד</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                  <tr><td style="padding: 6px; border-bottom: 1px solid #eee; color:#666;">מקור אחרון (last-touch):</td><td style="padding: 6px; border-bottom: 1px solid #eee;">${touchSummary(body.attribution?.last)}</td></tr>
                  <tr><td style="padding: 6px; border-bottom: 1px solid #eee; color:#666;">מקור ראשון (first-touch):</td><td style="padding: 6px; border-bottom: 1px solid #eee;">${touchSummary(body.attribution?.first)}</td></tr>
                  <tr><td style="padding: 6px; color:#666;">דף נחיתה:</td><td style="padding: 6px;" dir="ltr">${esc(body.attribution?.last?.landing_page || '/')}</td></tr>
                </table>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
                <p style="color: #999; font-size: 12px;">נשלח מאתר destec.co.il</p>
              </div>
            `,
          }),
        });

        if (!res.ok) {
          const err = await res.text();
          console.error('[Contact Form] Resend error:', err);
        } else {
          console.log('[Contact Form] Email sent via Resend');
        }
      } catch (emailErr) {
        console.error('[Contact Form] Failed to send email:', emailErr);
        // Don't fail the request if email fails — submission is still logged
      }
    } else {
      console.log('[Contact Form] RESEND_API_KEY not configured — email not sent');
    }

    // Server-side conversion signal (non-fatal).
    await sendMetaCapiLead(req, body);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Contact Form] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
