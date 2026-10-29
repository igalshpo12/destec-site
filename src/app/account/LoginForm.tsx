'use client';
import { useState } from 'react';
import { Loader2, Mail, KeyRound } from 'lucide-react';

export default function LoginForm({ notice }: { notice?: string | null }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending'); setError('');
    try {
      const res = await fetch('/api/auth/request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'שגיאה');
      setStatus('sent');
    } catch (err) {
      setError((err as Error).message); setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="rounded-2xl p-6 bg-white text-center" style={{ border: '1px solid #e8ecf0' }} data-testid="login-sent">
        <Mail className="w-10 h-10 mx-auto mb-3" style={{ color: '#1e90ff' }} />
        <h2 className="text-lg font-bold mb-1" style={{ color: '#1a2b4a' }}>שלחנו לך קישור כניסה</h2>
        <p className="text-sm text-gray-600">בדקו את תיבת הדואר של <span dir="ltr" className="font-mono">{email}</span> ולחצו על הקישור. הוא תקף ל-30 דקות.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl p-6 bg-white" style={{ border: '1px solid #e8ecf0' }} data-testid="login-form">
      <div className="flex items-center gap-2 mb-1"><KeyRound className="w-5 h-5" style={{ color: '#1e90ff' }} /><h2 className="text-lg font-bold" style={{ color: '#1a2b4a' }}>כניסה לאזור האישי</h2></div>
      <p className="text-sm text-gray-500 mb-4">בלי סיסמה: הזינו את האימייל שאיתו הזמנתם ונשלח לכם קישור כניסה.</p>
      {notice && <div className="mb-3 text-sm rounded-lg p-3" style={{ background: '#fffbeb', color: '#92400e' }}>{notice}</div>}
      <label className="block mb-3">
        <span className="text-xs font-semibold text-gray-600 mb-1 block">אימייל</span>
        <input required type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"
          className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={{ background: '#f8f9fb', border: '1px solid #e8ecf0', color: '#1a2b4a' }} />
      </label>
      {error && <div className="mb-3 text-sm rounded-lg p-3" style={{ background: '#fef2f2', color: '#991b1b' }}>{error}</div>}
      <button type="submit" disabled={status === 'sending'} data-testid="login-submit"
        className="w-full inline-flex items-center justify-center gap-2 font-semibold px-6 py-3.5 rounded-xl text-white disabled:opacity-60"
        style={{ background: '#1e90ff' }}>
        {status === 'sending' ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
        שלחו לי קישור כניסה
      </button>
    </form>
  );
}
