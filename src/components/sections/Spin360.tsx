'use client';

import { useEffect, useRef } from 'react';

interface Props {
  /** folder under /public/products/<dir>/ holding f-00.webp … */
  dir: string;
  count: number;
  /** intrinsic frame size (used for max width + aspect ratio) */
  width: number;
  height: number;
  alt: string;
  /** ms between auto-rotate steps (0 disables auto-rotate) */
  autoMs?: number;
  /** px of drag per frame step */
  dragSens?: number;
  /** CSS drop-shadow filter applied once to the canvas */
  shadow?: string;
}

/**
 * Reusable real-360° product viewer rendered on a single <canvas>.
 * All frames are pre-decoded into Image objects and drawn one at a time, so
 * there is no multi-layer compositing, no per-frame filters and no
 * decode-on-show — the spin stays smooth. Gentle auto-rotate + pointer drag.
 */
export default function Spin360({
  dir,
  count,
  width,
  height,
  alt,
  autoMs = 110,
  dragSens = 6,
  shadow = 'drop-shadow(0 18px 26px rgba(26,43,74,0.18))',
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const images: (HTMLImageElement | null)[] = new Array(count).fill(null);
    let idx = 0;
    let ready = false;

    const fit = () => {
      const r = wrap.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
    };

    const draw = (i: number) => {
      const n = ((i % count) + count) % count;
      idx = n;
      const img = images[n];
      const cw = canvas.width;
      const ch = canvas.height;
      ctx.clearRect(0, 0, cw, ch);
      if (!img) return;
      const s = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    fit();

    // preload + decode every frame; draw frame 0 as soon as it arrives
    let cancelled = false;
    const load = (i: number) =>
      new Promise<void>((res) => {
        const im = new Image();
        im.decoding = 'async';
        im.onload = () => {
          images[i] = im;
          if (i === 0 && !cancelled) draw(0);
          res();
        };
        im.onerror = () => res();
        im.src = `/products/${dir}/f-${String(i).padStart(2, '0')}.webp`;
      });
    Promise.all(Array.from({ length: count }, (_, i) => load(i))).then(() => {
      if (!cancelled) {
        ready = true;
        draw(idx);
      }
    });

    // auto-rotate
    let raf = 0;
    let auto = autoMs > 0;
    let last = 0;
    const tick = (t: number) => {
      if (auto && ready) {
        if (!last) last = t;
        if (t - last >= autoMs) {
          draw(idx + 1);
          last = t;
        }
      } else {
        last = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // drag to spin
    let dragging = false;
    let lastX = 0;
    let acc = 0;
    let resume: ReturnType<typeof setTimeout> | undefined;
    const onDown = (e: PointerEvent) => {
      if (!ready) return;
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
      const step = Math.trunc(acc / dragSens);
      if (step !== 0) {
        draw(idx - step);
        acc -= step * dragSens;
      }
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      wrap.style.cursor = 'grab';
      if (autoMs > 0) resume = setTimeout(() => { auto = true; }, 1800);
    };

    const ro = new ResizeObserver(() => { fit(); draw(idx); });
    ro.observe(wrap);
    wrap.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (resume) clearTimeout(resume);
      ro.disconnect();
      wrap.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [dir, count, autoMs, dragSens]);

  return (
    <div
      ref={wrapRef}
      aria-label={`${alt} — צפייה ב 360°`}
      role="img"
      style={{ position: 'relative', width: '100%', maxWidth: width, aspectRatio: `${width} / ${height}`, cursor: 'grab', touchAction: 'pan-y' }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', filter: shadow }} />
    </div>
  );
}
