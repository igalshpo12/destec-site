import { NextRequest, NextResponse } from 'next/server';

interface ContactPayload {
  name: string;
  company?: string;
  phone: string;
  email?: string;
  message: string;
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
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>שם:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${body.name}</td></tr>
                  ${body.company ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>חברה:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${body.company}</td></tr>` : ''}
                  <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>טלפון:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;" dir="ltr">${body.phone}</td></tr>
                  ${body.email ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>אימייל:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${body.email}</td></tr>` : ''}
                  <tr><td style="padding: 8px;" colspan="2"><strong>הודעה:</strong><br/><p style="white-space: pre-wrap;">${body.message}</p></td></tr>
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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Contact Form] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
