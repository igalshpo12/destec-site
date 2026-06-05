import { ImageResponse } from 'next/og';

// Social share preview image (WhatsApp / Facebook / LinkedIn / Twitter)
export const alt = 'DES — Dental & Medical Equipment · destec.co.il';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Brand-forward, Latin-only layout so it renders reliably without an
// embedded Hebrew font. Replace with a designed asset later if desired.
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
            'linear-gradient(135deg, #0d1929 0%, #1a2b4a 70%, #102a4d 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        {/* top accent */}
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
          OFFICIAL IMPORTER · ISO 9001
        </div>

        {/* wordmark + tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              fontSize: 200,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}
          >
            DES
          </div>
          <div style={{ fontSize: 46, fontWeight: 700, color: '#e8ecf4' }}>
            Dental &amp; Medical Equipment
          </div>
          <div style={{ fontSize: 30, color: 'rgba(255,255,255,0.55)' }}>
            NSK · W&amp;H · KaVo · Nouvag · Bien-Air · MK-dent
          </div>
        </div>

        {/* footer row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 30,
          }}
        >
          <div style={{ color: '#1e90ff', fontWeight: 700 }}>destec.co.il</div>
          <div style={{ color: 'rgba(255,255,255,0.45)' }}>Est. 1998 · Israel</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
