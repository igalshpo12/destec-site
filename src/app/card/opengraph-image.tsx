import { ImageResponse } from 'next/og';

// Share preview for the digital business card (SMS / WhatsApp link previews).
export const alt = 'DES — Digital Business Card · destec.co.il';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Latin-only layout so it renders reliably without an embedded Hebrew font.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background:
            'radial-gradient(ellipse at top, #1c3a66 0%, #12233f 50%, #0d1929 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            color: '#4baee8',
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: '0.18em',
          }}
        >
          <div style={{ width: 56, height: 4, background: '#1e90ff' }} />
          DIGITAL BUSINESS CARD
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              fontSize: 190,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}
          >
            DES
          </div>
          <div style={{ fontSize: 44, fontWeight: 700, color: '#e8ecf4' }}>
            Dental &amp; Medical Equipment Services
          </div>
          <div style={{ fontSize: 30, color: 'rgba(255,255,255,0.55)' }}>
            Sales · Repair Lab · Pickup &amp; Return · Training
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 30,
          }}
        >
          <div style={{ color: '#1e90ff', fontWeight: 700 }}>destec.co.il/card</div>
          <div style={{ color: 'rgba(255,255,255,0.45)' }}>Est. 1998 · ISO 9001</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
