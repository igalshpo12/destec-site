'use client';

import { useEffect, useRef } from 'react';

const N = 40;
const FRAMES = Array.from({ length: N }, (_, i) => `/products/turbine-360/f-${String(i).padStart(2, '0')}.webp`);

/**
 * Real 360° product viewer for the MK-Dent Prime Line turbine.
 * Gently auto-rotates; grab and drag horizontally to spin it yourself.
 * Frames are pre-rendered (turntable video → cut-out webp), swapped via opacity
 * so there's no reload flicker.
 */
export default function SpinTurbine360() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgs = useRef<(HTMLImageElement | null)[]>([]);
  const idx = useRef(0);

  useEffect(() => {
    const show = (i: number) => {
      const n = ((i % N) + N) % N;
      const arr = imgs.current;
      const prev = idx.current;
      if (arr[prev]) arr[prev]!.style.opacity = '0';
      if (arr[n]) arr[n]!.style.opacity = '1';
      idx.current = n;
    };
    show(0);

    let raf = 0;
    let auto = true;
    let last = 0;
    const STEP_MS = 120; // ~4.8s per rotation
    const tick = (t: number) => {
      if (auto) {
        if (!last) last = t;
        if (t - last >= STEP_MS) {
          show(idx.current + 1);
          last = t;
        }
      } else {
        last = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const wrap = wrapRef.current!;
    let dragging = false;
    let lastX = 0;
    let acc = 0;
    let resume: ReturnType<typeof setTimeout> | undefined;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      auto = false;
      lastX = e.clientX;
      acc = 0;
      if (resume) clearTimeout(resume);
      wrap.style.cursor = 'grabbing';
      try { wrap.setPointerCapture(e.pointerId); } catch {}
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      acc += dx;
      const step = Math.trunc(acc / 7);
      if (step !== 0) {
        show(idx.current - step); // drag right → spin forward
        acc -= step * 7;
      }
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      wrap.style.cursor = 'grab';
      resume = setTimeout(() => { auto = true; }, 1800);
    };

    wrap.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      cancelAnimationFrame(raf);
      if (resume) clearTimeout(resume);
      wrap.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-label="MK-Dent Prime Line — צפייה ב 360°"
      style={{ position: 'relative', width: 300, height: 340, cursor: 'grab', touchAction: 'pan-y' }}
    >
      {FRAMES.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          ref={(el) => { imgs.current[i] = el; }}
          src={src}
          alt={i === 0 ? 'MK-Dent Prime Line turbine' : ''}
          draggable={false}
          loading="eager"
          decoding="sync"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            // hard cut between frames — no crossfade (avoids the blink)
            opacity: i === 0 ? 1 : 0,
            transition: 'none',
            filter: 'drop-shadow(0 18px 26px rgba(26,43,74,0.18))',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
      ))}
    </div>
  );
}
