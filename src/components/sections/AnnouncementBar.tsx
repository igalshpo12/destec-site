'use client';
import { useState } from 'react';
import { X } from 'lucide-react';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div
      dir="rtl"
      className="relative flex items-center justify-center py-2.5 px-4 text-sm"
      style={{
        background: '#1e90ff',
        color: '#fff',
      }}
    >
      <span className="font-medium">
        משלוחים חינם ברכישה מעל ₪500 &nbsp;·&nbsp; יבואן מורשה ומפיץ רשמי &nbsp;·&nbsp; שירות ותיקונים &nbsp;·&nbsp; ISO 9001
      </span>
      <button
        onClick={() => setVisible(false)}
        aria-label="סגור הודעה"
        className="absolute left-4 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-60"
        style={{ color: '#fff' }}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
