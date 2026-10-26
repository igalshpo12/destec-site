'use client';
import { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { getAttribution, trackEvent, trackMeta } from '@/lib/analytics';

type Status = 'idle' | 'loading' | 'success' | 'error';

const DEVICE_TYPES = [
  'טורבינה',
  'זוויתן (1:1 / 1:5 / 20:1)',
  'ידית ישרה',
  'מנוע אוויר',
  'מיקרומוטור חשמלי',
  'מנוע כירורגי / השתלות',
  'סקיילר אולטרסוני',
  'יחידת אלקטרוכירורגיה',
  'משאבת שאיבה',
  'אחר',
];

const inputCls =
  'w-full rounded-lg border border-white/15 bg-white/[0.06] px-4 py-3 text-white placeholder:text-white/35 focus:border-[#1e90ff] focus:outline-none focus:ring-2 focus:ring-[#1e90ff]/30';
const labelCls = 'block text-sm font-medium text-white/70 mb-1.5';

export default function RepairForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [f, setF] = useState({
    name: '',
    phone: '',
    clinic: '',
    device: DEVICE_TYPES[0],
    model: '',
    problem: '',
    pickup: 'pickup',
  });

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const eventId =
      typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `lead_${Date.now()}`;
    const message = [
      '[קריאת שירות — תיקון]',
      `סוג ציוד: ${f.device}`,
      f.model && `יצרן / דגם: ${f.model}`,
      `אופן מסירה: ${f.pickup === 'pickup' ? 'איסוף מהמרפאה' : 'משלוח / הבאה למעבדה'}`,
      `תיאור התקלה: ${f.problem}`,
    ]
      .filter(Boolean)
      .join('\n');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.name,
          phone: f.phone,
          company: f.clinic,
          message,
          attribution: getAttribution(),
          eventId,
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      trackEvent('contact_form_submit', { form: 'repair' });
      trackMeta('Lead', { content_name: 'repair_form' }, eventId);
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-green-400/30 bg-green-400/10 p-8 text-center">
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-400" />
        <h3 className="mb-2 text-xl font-bold text-white">קריאת השירות התקבלה.</h3>
        <p className="text-white/70">נחזור אליך לתיאום איסוף בשעות הפעילות. לקריאה דחופה: 03-5081868.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4" aria-label="טופס קריאת שירות">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="r-name" className={labelCls}>שם מלא *</label>
          <input id="r-name" name="name" required autoComplete="name" value={f.name} onChange={set} className={inputCls} />
        </div>
        <div>
          <label htmlFor="r-phone" className={labelCls}>טלפון *</label>
          <input id="r-phone" name="phone" type="tel" required autoComplete="tel" dir="ltr" value={f.phone} onChange={set} className={`${inputCls} text-right`} />
        </div>
      </div>
      <div>
        <label htmlFor="r-clinic" className={labelCls}>מרפאה / מוסד</label>
        <input id="r-clinic" name="clinic" autoComplete="organization" value={f.clinic} onChange={set} className={inputCls} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="r-device" className={labelCls}>סוג הציוד *</label>
          <select id="r-device" name="device" value={f.device} onChange={set} className={inputCls}>
            {DEVICE_TYPES.map((d) => (
              <option key={d} value={d} className="text-gray-900">{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="r-model" className={labelCls}>יצרן / דגם</label>
          <input id="r-model" name="model" placeholder="לדוגמה: NSK Ti-Max X600" value={f.model} onChange={set} className={inputCls} />
        </div>
      </div>
      <div>
        <label htmlFor="r-problem" className={labelCls}>מה התקלה? *</label>
        <textarea id="r-problem" name="problem" required rows={4} placeholder="רעש, חימום, ירידה בעוצמה, מים, לא מסתובב..." value={f.problem} onChange={set} className={inputCls} />
      </div>
      <fieldset className="flex flex-wrap gap-5 text-sm text-white/80">
        <legend className={labelCls}>איך הציוד מגיע אלינו?</legend>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="pickup" value="pickup" checked={f.pickup === 'pickup'} onChange={set} className="accent-[#1e90ff]" />
          איסוף מהמרפאה
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="pickup" value="ship" checked={f.pickup === 'ship'} onChange={set} className="accent-[#1e90ff]" />
          משלוח / הבאה למעבדה
        </label>
      </fieldset>
      {status === 'error' && (
        <p className="flex items-center gap-2 text-sm text-red-300">
          <AlertCircle className="h-4 w-4" /> השליחה נכשלה. נסו שוב או התקשרו 03-5081868.
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-des-blue px-6 py-3.5 font-semibold text-white transition-colors hover:bg-[#1273d6] disabled:opacity-60"
      >
        {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        פתיחת קריאת שירות
      </button>
      <p className="text-xs text-white/45">מענה בשעות הפעילות א׳–ה׳ 08:00–17:00. הצעת מחיר לפני כל תיקון.</p>
    </form>
  );
}
