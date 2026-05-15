'use client';
import { useState } from 'react';
import { X, Truck } from 'lucide-react';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div
      dir="rtl"
      className="bg-[#1e90ff] text-white text-sm font-medium py-2.5 px-4 flex items-center justify-center relative"
    >
      <Truck className="w-4 h-4 ml-2 flex-shrink-0" />
      <span>משלוחים חינם ברכישה החל מ &#x2005;500 &#8362;</span>
      <button
        onClick={() => setVisible(false)}
        aria-label="סגור הודעה"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
