'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

const SPECS = [
  { label: 'קצב זרימה',     value: '60 L/min' },
  { label: 'ואקום מקסימלי', value: '65 kPa'   },
  { label: 'רמת רעש',       value: '< 55 dB'  },
  { label: 'נפח אוסף',      value: '2 × 2 L'  },
  { label: 'הספק',          value: '180 W'     },
];

const HOTSPOTS = [
  { id: 'gauge',     label: 'מד ואקום',      sub: 'בקרה מדויקת של לחץ',          top: 26, left: 38, lineDir: 'left'  },
  { id: 'handpiece', label: 'ידית כירורגית', sub: 'ידית מנועית מובנית',           top: 42, left: 62, lineDir: 'right' },
  { id: 'jars',      label: 'מיכלי איסוף',   sub: '2 × 2 ליטר, פוליקרבונט',      top: 66, left: 22, lineDir: 'left'  },
  { id: 'pedal',     label: 'דוושת רגל',     sub: 'שליטה חופשת ידיים',            top: 88, left: 68, lineDir: 'right' },
];

export default function VacusonShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mouse, setMouse]   = useState({ x: 0, y: 0 });
  const [active, setActive] = useState<string | null>(null);
  const [ready,  setReady]  = useState(false);

  useEffect(() => { setReady(true); }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      setMouse({
        x: ((e.clientX - r.left) / r.width  - 0.5) * 18,
        y: ((e.clientY - r.top)  / r.height - 0.5) * 10,
      });
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      dir="rtl"
      style={{
        background: '#070e1a',
        minHeight: '620px',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* ── Top accent line ── */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:'1px',
        background:'linear-gradient(90deg,transparent,rgba(30,140,212,0.5),transparent)',
      }}/>

      {/* ── Ambient glow behind product ── */}
      <div style={{
        position:'absolute', left:'50%', top:'50%',
        transform:'translate(-50%,-50%)',
        width:'600px', height:'500px', borderRadius:'50%',
        background:'radial-gradient(ellipse, rgba(30,140,212,0.08) 0%, transparent 70%)',
        pointerEvents:'none',
      }}/>

      <div style={{
        maxWidth:'1280px', margin:'0 auto', padding:'48px 40px',
        display:'grid', gridTemplateColumns:'1fr 1fr',
        alignItems:'center', gap:'0', width:'100%',
      }}>

        {/* ── LEFT: Product image + hotspots ── */}
        <div style={{ position:'relative', height:'500px' }}>

          {/* Parallax image wrapper */}
          <div
            style={{
              position:'absolute', inset:'-20px',
              transition: ready ? 'transform 0.12s ease-out' : 'none',
              transform: `translate3d(${mouse.x}px, ${mouse.y}px, 0)`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/suppliers/nouvag/vacuson.jpg"
              alt="Nouvag Vacuson 60 LP"
              style={{
                width:'100%', height:'100%',
                objectFit:'contain', objectPosition:'center',
                animation: 'vacFloat 7s ease-in-out infinite',
              }}
            />

            {/* Vignette — fades white bg into dark page */}
            <div style={{
              position:'absolute', inset:0,
              background:`
                radial-gradient(ellipse 70% 80% at 50% 50%, transparent 40%, #070e1a 100%)
              `,
              pointerEvents:'none',
            }}/>
          </div>

          {/* ── Hotspot callouts ── */}
          {HOTSPOTS.map(h => (
            <div
              key={h.id}
              style={{
                position:'absolute',
                top: `${h.top}%`,
                left: `${h.left}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                cursor: 'pointer',
              }}
              onMouseEnter={() => setActive(h.id)}
              onMouseLeave={() => setActive(null)}
            >
              {/* Pulsing dot */}
              <div style={{ position:'relative', width:'12px', height:'12px' }}>
                <div style={{
                  width:'12px', height:'12px', borderRadius:'50%',
                  background:'#1E8CD4',
                  boxShadow:'0 0 0 0 rgba(30,140,212,0.7)',
                  animation: 'hotPulse 2s ease-in-out infinite',
                }}/>
                <div style={{
                  position:'absolute', inset:'-4px', borderRadius:'50%',
                  border:'1px solid rgba(30,140,212,0.4)',
                  animation: 'hotRing 2s ease-in-out infinite',
                }}/>
              </div>

              {/* Label bubble — appears on hover */}
              <div style={{
                position:'absolute',
                [h.lineDir === 'right' ? 'left' : 'right']: '20px',
                top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(7,14,26,0.92)',
                border: '1px solid rgba(30,140,212,0.35)',
                borderRadius: '8px',
                padding: '8px 12px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                opacity: active === h.id ? 1 : 0,
                transform: active === h.id
                  ? 'translateY(-50%) translateX(0)'
                  : `translateY(-50%) translateX(${h.lineDir === 'right' ? '-8px' : '8px'})`,
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(8px)',
              }}>
                <div style={{
                  fontFamily:"'Noto Sans', sans-serif",
                  fontSize:'12px', fontWeight:700,
                  color:'#fff', marginBottom:'2px',
                }}>{h.label}</div>
                <div style={{
                  fontFamily:"'Noto Sans', sans-serif",
                  fontSize:'10px', color:'rgba(255,255,255,0.5)',
                }}>{h.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── RIGHT: Text + specs ── */}
        <div style={{ padding:'0 0 0 40px' }}>

          {/* Badge */}
          <span style={{
            display:'inline-flex', alignItems:'center', gap:'8px',
            background:'rgba(30,140,212,0.1)',
            border:'1px solid rgba(30,140,212,0.3)',
            color:'#4BAEE8',
            fontSize:'10px', fontWeight:700,
            letterSpacing:'0.2em', textTransform:'uppercase',
            padding:'5px 14px', borderRadius:'999px',
            marginBottom:'24px',
          }}>
            <span style={{
              width:'6px', height:'6px', borderRadius:'50%',
              background:'#4BAEE8',
              animation:'hotPulse 2s ease-in-out infinite',
              display:'inline-block',
            }}/>
            NOUVAG · יבואן רשמי DES
          </span>

          {/* Product name */}
          <h2 style={{
            fontFamily:"'Figtree', sans-serif",
            fontWeight:900, color:'#ffffff',
            fontSize:'clamp(1.8rem, 3vw, 2.8rem)',
            lineHeight:1.1, marginBottom:'8px',
          }}>
            Vacuson 60 LP
          </h2>
          <p style={{
            fontFamily:"'Figtree', sans-serif",
            fontWeight:700, color:'#1E8CD4',
            fontSize:'1.1rem', marginBottom:'20px',
            letterSpacing:'0.02em',
          }}>
            מערכת שאיבה כירורגית שקטה
          </p>

          <p style={{
            fontFamily:"'Noto Sans', sans-serif",
            color:'rgba(255,255,255,0.55)',
            fontSize:'14.5px', lineHeight:1.8,
            marginBottom:'32px', maxWidth:'380px',
          }}>
            מכשיר שאיבה כירורגי עוצמתי ושקט במיוחד (&lt;55 dB).
            מתאים לניתוחי שתלים, אנדודונטיה וכירורגיה אוראלית.
            מופץ בישראל באופן בלעדי על ידי DES.
          </p>

          {/* Specs grid */}
          <div style={{
            display:'grid', gridTemplateColumns:'1fr 1fr',
            gap:'10px', marginBottom:'36px',
          }}>
            {SPECS.map(s => (
              <div key={s.label} style={{
                background:'rgba(255,255,255,0.04)',
                border:'1px solid rgba(255,255,255,0.07)',
                borderRadius:'10px', padding:'14px 16px',
              }}>
                <div style={{
                  fontFamily:"'Noto Sans', sans-serif",
                  fontSize:'10px', fontWeight:600,
                  letterSpacing:'0.12em', textTransform:'uppercase',
                  color:'rgba(255,255,255,0.3)', marginBottom:'5px',
                }}>{s.label}</div>
                <div style={{
                  fontFamily:"'Figtree', sans-serif",
                  fontSize:'18px', fontWeight:800,
                  color:'#fff',
                }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
            <Link
              href="/catalog?category=surgery&brand=nouvag"
              style={{
                fontFamily:"'Noto Sans', sans-serif",
                fontSize:'14px', fontWeight:600,
                background:'#1E8CD4', color:'#fff',
                padding:'13px 26px', borderRadius:'8px',
                textDecoration:'none', display:'inline-block',
                transition:'background 0.2s',
              }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='#2A9FE0';}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='#1E8CD4';}}
            >
              פרטים והזמנה
            </Link>
            <Link
              href="/contact"
              style={{
                fontFamily:"'Noto Sans', sans-serif",
                fontSize:'14px', fontWeight:500,
                color:'rgba(255,255,255,0.7)',
                border:'1px solid rgba(255,255,255,0.15)',
                padding:'12px 26px', borderRadius:'8px',
                textDecoration:'none', display:'inline-block',
                transition:'all 0.2s',
              }}
              onMouseEnter={e=>{
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor='rgba(255,255,255,0.4)';
                el.style.color='#fff';
              }}
              onMouseLeave={e=>{
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor='rgba(255,255,255,0.15)';
                el.style.color='rgba(255,255,255,0.7)';
              }}
            >
              צור קשר
            </Link>
          </div>

          {/* Official distributor note */}
          <p style={{
            fontFamily:"'Noto Sans', sans-serif",
            fontSize:'11px', color:'rgba(255,255,255,0.25)',
            marginTop:'20px', letterSpacing:'0.04em',
          }}>
            * DES הינו היבואן והמפיץ הרשמי של Nouvag בישראל
          </p>
        </div>
      </div>

      {/* ── Bottom accent ── */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0, height:'1px',
        background:'linear-gradient(90deg,transparent,rgba(30,140,212,0.3),transparent)',
      }}/>

      <style>{`
        @keyframes vacFloat {
          0%,100% { transform: translateY(0px);   }
          50%      { transform: translateY(-12px); }
        }
        @keyframes hotPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(30,140,212,0.6); }
          50%      { box-shadow: 0 0 0 6px rgba(30,140,212,0); }
        }
        @keyframes hotRing {
          0%   { transform: scale(1);   opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0;   }
        }
        @media (max-width:768px) {
          .vacuson-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
