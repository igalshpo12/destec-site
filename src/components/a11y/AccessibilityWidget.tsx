'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/* ────────────────────────────────────────────────────────────────────────────
   Accessibility widget (IS 5568 / WCAG 2.1 AA aid).
   Settings persist in localStorage and are applied as classes on <html> +
   an inline font-size; the color filters target #site so this widget (a sibling
   of #site) stays unaffected. A no-FOUC init script in layout.tsx restores them
   before paint.
──────────────────────────────────────────────────────────────────────────── */

const STORAGE_KEY = 'des-a11y';

type ColorMode = '' | 'contrast' | 'grayscale' | 'sepia' | 'invert';

interface State {
  font: number; // percent, 100 = default
  color: ColorMode;
  readable: boolean;
  links: boolean;
  headings: boolean;
  noAnim: boolean;
  bigCursor: boolean;
  kbd: boolean;
}

const DEFAULT: State = {
  font: 100,
  color: '',
  readable: false,
  links: false,
  headings: false,
  noAnim: false,
  bigCursor: false,
  kbd: false,
};

const FONT_MIN = 90;
const FONT_MAX: number = 160;
const FONT_STEP = 10;

function apply(s: State) {
  const d = document.documentElement;
  (['contrast', 'grayscale', 'sepia', 'invert'] as const).forEach((c) =>
    d.classList.toggle(`a11y-${c}`, s.color === c)
  );
  d.classList.toggle('a11y-readable', s.readable);
  d.classList.toggle('a11y-links', s.links);
  d.classList.toggle('a11y-headings', s.headings);
  d.classList.toggle('a11y-no-anim', s.noAnim);
  d.classList.toggle('a11y-big-cursor', s.bigCursor);
  d.classList.toggle('a11y-kbd', s.kbd);
  d.style.fontSize = s.font === 100 ? '' : `${s.font}%`;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {}
}

/* tiny inline icons */
const I = {
  access: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="3.5" r="1.8" />
      <path d="M5 7.5c0-.6.5-1 1.1-1 .2 0 4 .9 5.9.9s5.7-.9 5.9-.9c.6 0 1.1.4 1.1 1s-.4 1.1-1 1.2l-4 .7v3.2l1.8 6.1c.2.6-.2 1.2-.8 1.4-.6.2-1.2-.2-1.4-.8l-1.7-5.4-1.7 5.4c-.2.6-.8 1-1.4.8-.6-.2-1-.8-.8-1.4l1.8-6.1V9.4l-4-.7c-.6-.1-1-.6-1-1.2z" />
    </svg>
  ),
};

function Toggle({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        padding: '12px 6px',
        borderRadius: 12,
        border: `1.5px solid ${active ? '#1e90ff' : '#e2e8f0'}`,
        background: active ? '#eaf3ff' : '#fff',
        color: active ? '#0d4a8a' : '#1a2b4a',
        fontSize: 12.5,
        fontWeight: 600,
        cursor: 'pointer',
        lineHeight: 1.2,
        textAlign: 'center',
        minHeight: 74,
        transition: 'border-color .15s, background .15s',
      }}
    >
      <span aria-hidden="true" style={{ opacity: active ? 1 : 0.75 }}>{icon}</span>
      {label}
    </button>
  );
}

const ico = (path: React.ReactNode) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {path}
  </svg>
);

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [s, setS] = useState<State>(DEFAULT);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // sync from storage on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      setS({ ...DEFAULT, ...saved });
    } catch {}
  }, []);

  const update = useCallback((patch: Partial<State>) => {
    setS((prev) => {
      const next = { ...prev, ...patch };
      apply(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    apply(DEFAULT);
    setS(DEFAULT);
  }, []);

  // Esc to close, basic focus management
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const first = panelRef.current?.querySelector<HTMLElement>('button, a, [tabindex]');
    first?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const colorBtn = (mode: ColorMode, label: string, icon: React.ReactNode) => (
    <Toggle active={s.color === mode} onClick={() => update({ color: s.color === mode ? '' : mode })} icon={icon} label={label} />
  );

  return (
    <div className="a11y-widget" style={{ direction: 'rtl' }}>
      {/* Launcher button */}
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="תפריט נגישות"
        title="נגישות"
        style={{
          position: 'fixed',
          insetInlineStart: 16,
          bottom: 16,
          zIndex: 9998,
          width: 52,
          height: 52,
          borderRadius: '50%',
          border: '2px solid #fff',
          background: '#1a2b4a',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(13,25,41,.35)',
          cursor: 'pointer',
        }}
      >
        {I.access}
      </button>

      {open && (
        <>
          {/* backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(13,25,41,.35)', zIndex: 9998 }}
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="הגדרות נגישות"
            style={{
              position: 'fixed',
              insetInlineStart: 16,
              bottom: 80,
              zIndex: 9999,
              width: 'min(360px, calc(100vw - 32px))',
              maxHeight: '78vh',
              overflowY: 'auto',
              background: '#fff',
              borderRadius: 18,
              boxShadow: '0 24px 60px rgba(13,25,41,.4)',
              border: '1px solid #e2e8f0',
              padding: 16,
              fontFamily: 'Heebo, Arial, sans-serif',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0d1929', margin: 0 }}>נגישות</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="סגור" style={{ border: 'none', background: '#f1f5f9', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: '#1a2b4a', fontSize: 18 }}>×</button>
            </div>

            {/* Font size */}
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', margin: '0 0 8px' }}>גודל טקסט</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button type="button" onClick={() => update({ font: Math.max(FONT_MIN, s.font - FONT_STEP) })} disabled={s.font <= FONT_MIN} aria-label="הקטנת טקסט" style={fontBtn(s.font <= FONT_MIN)}>A−</button>
                <span style={{ flex: 1, textAlign: 'center', fontWeight: 700, color: '#1a2b4a' }}>{s.font}%</span>
                <button type="button" onClick={() => update({ font: Math.min(FONT_MAX, s.font + FONT_STEP) })} disabled={s.font >= FONT_MAX} aria-label="הגדלת טקסט" style={fontBtn(s.font >= FONT_MAX)}>A+</button>
              </div>
            </div>

            {/* Color & contrast */}
            <p style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', margin: '0 0 8px' }}>צבע וניגודיות</p>
            <div style={grid}>
              {colorBtn('contrast', 'ניגודיות גבוהה', ico(<><circle cx="12" cy="12" r="9" /><path d="M12 3v18" fill="currentColor" /><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" /></>))}
              {colorBtn('grayscale', 'גווני אפור', ico(<><circle cx="12" cy="12" r="9" /></>))}
              {colorBtn('sepia', 'ספיה', ico(<><circle cx="12" cy="12" r="9" /><path d="M7 14c2 2 8 2 10 0" /></>))}
              {colorBtn('invert', 'היפוך צבעים', ico(<><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" /></>))}
            </div>

            {/* Content helpers */}
            <p style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', margin: '14px 0 8px' }}>עזרי קריאה וניווט</p>
            <div style={grid}>
              <Toggle active={s.readable} onClick={() => update({ readable: !s.readable })} label="גופן קריא" icon={ico(<><path d="M4 7V5h16v2" /><path d="M9 19h6" /><path d="M12 5v14" /></>)} />
              <Toggle active={s.links} onClick={() => update({ links: !s.links })} label="הדגשת קישורים" icon={ico(<><path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" /><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" /></>)} />
              <Toggle active={s.headings} onClick={() => update({ headings: !s.headings })} label="הדגשת כותרות" icon={ico(<><path d="M6 4v16" /><path d="M18 4v16" /><path d="M6 12h12" /></>)} />
              <Toggle active={s.noAnim} onClick={() => update({ noAnim: !s.noAnim })} label="עצירת אנימציות" icon={ico(<><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h6v6H9z" fill="currentColor" /></>)} />
              <Toggle active={s.bigCursor} onClick={() => update({ bigCursor: !s.bigCursor })} label="סמן גדול" icon={ico(<><path d="M5 3l7 18 2-7 7-2z" fill="currentColor" /></>)} />
              <Toggle active={s.kbd} onClick={() => update({ kbd: !s.kbd })} label="הבלטת מיקוד" icon={ico(<><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10" /></>)} />
            </div>

            <button type="button" onClick={reset} style={{ width: '100%', marginTop: 14, padding: '11px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#b91c1c', fontWeight: 700, cursor: 'pointer' }}>
              איפוס הגדרות נגישות
            </button>

            <a href="/accessibility" style={{ display: 'block', textAlign: 'center', marginTop: 10, fontSize: 13, color: '#1e90ff', fontWeight: 600 }}>
              הצהרת הנגישות שלנו
            </a>
          </div>
        </>
      )}
    </div>
  );
}

const grid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 };
const fontBtn = (disabled: boolean): React.CSSProperties => ({
  width: 56,
  height: 40,
  borderRadius: 10,
  border: '1.5px solid #e2e8f0',
  background: disabled ? '#f8fafc' : '#fff',
  color: disabled ? '#cbd5e1' : '#1a2b4a',
  fontWeight: 800,
  fontSize: 15,
  cursor: disabled ? 'default' : 'pointer',
});
