'use client';

import { Suspense, lazy, useEffect, useRef, useState } from 'react';

// Lazy-load Spline only when in viewport — saves ~300 kB on initial load
const Spline = lazy(() => import('@splinetool/react-spline'));

const SPLINE_SCENE = 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode';

function SplineLoader() {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ minHeight: '320px' }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          border: '3px solid rgba(30,144,255,0.2)',
          borderTopColor: '#1e90ff',
          borderRadius: '50%',
          animation: 'spinSlow 0.8s linear infinite',
        }}
      />
    </div>
  );
}

export default function SplineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // Only mount Spline after element is scrolled into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      dir="rtl"
      aria-label="הדמיה תלת-ממדית DES"
      style={{
        background: '#0d1929',
        minHeight: '500px',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #1e90ff40, transparent)',
        }}
      />

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '500px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0',
            alignItems: 'center',
            minHeight: '500px',
          }}
          className="max-lg:grid-cols-1"
        >
          {/* ── Text side (right in RTL = rendered first in DOM) ── */}
          <div
            style={{
              padding: '4rem 3rem 4rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '1.25rem',
            }}
          >
            {/* Pill badge */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(30,144,255,0.12)',
                border: '1px solid rgba(30,144,255,0.3)',
                color: '#1e90ff',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                alignSelf: 'flex-start',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#1e90ff',
                  animation: 'pulse 2s ease-in-out infinite',
                  display: 'inline-block',
                }}
              />
              INTERACTIVE 3D
            </span>

            <h2
              style={{
                color: '#ffffff',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                fontWeight: 900,
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              הדמיה תלת-ממדית
              <br />
              <span style={{ color: '#1e90ff' }}>של ציוד DES</span>
            </h2>

            <p
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '1rem',
                lineHeight: 1.7,
                margin: 0,
                maxWidth: '380px',
              }}
            >
              סובבו, בדקו פרטים, חוו את המוצר לפני הרכישה.
              הדמיה אינטראקטיבית מלאה של הציוד הדנטלי שלנו.
            </p>

            <p
              style={{
                color: 'rgba(255,255,255,0.3)',
                fontSize: '0.72rem',
                letterSpacing: '0.04em',
                margin: 0,
              }}
            >
              * הדמיה לצורך המחשה — Phase 2B תכלול מודלים של המוצרים הממשיים
            </p>
          </div>

          {/* ── 3D scene side (left in RTL = rendered second) ── */}
          <div
            style={{
              position: 'relative',
              minHeight: '500px',
              borderRight: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {inView ? (
              <Suspense fallback={<SplineLoader />}>
                <Spline
                  scene={SPLINE_SCENE}
                  style={{ width: '100%', height: '100%', minHeight: '500px' }}
                />
              </Suspense>
            ) : (
              <SplineLoader />
            )}
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #1e90ff30, transparent)',
        }}
      />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }
        @media (max-width: 1023px) {
          .max-lg\\:grid-cols-1 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
