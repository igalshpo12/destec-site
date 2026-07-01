'use client';

import { Cookie } from 'lucide-react';

interface ConsentBannerProps {
  onAccept: () => void;
  onDecline: () => void;
}

/**
 * Hebrew RTL cookie-consent banner. Shown only when tracking tags are
 * configured and the visitor has not yet chosen. No third-party script
 * loads until "אישור".
 */
export default function ConsentBanner({ onAccept, onDecline }: ConsentBannerProps) {
  return (
    <div
      dir="rtl"
      role="dialog"
      aria-live="polite"
      aria-label="הסכמה לעוגיות"
      className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4"
    >
      <div className="mx-auto max-w-3xl bg-white border border-gray-200 shadow-lg rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="bg-[#1a2b4a]/5 rounded-full p-2 flex-shrink-0">
            <Cookie className="w-5 h-5 text-[#1a2b4a]" />
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            אנו משתמשים בעוגיות לניתוח תנועה ולשיפור חוויית הגלישה. תוכלו לאשר או
            לדחות שימוש בכלי ניתוח ופרסום. פנייה ישירה (טופס, טלפון, וואטסאפ)
            תמשיך לעבוד בכל מקרה. פרטים נוספים ב
            <a href="/privacy" className="underline text-[#1a2b4a] hover:text-[#1e90ff]">מדיניות הפרטיות והעוגיות</a>.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={onDecline}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            דחייה
          </button>
          <button
            onClick={onAccept}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#1a2b4a] hover:bg-[#243d6b] transition-colors"
          >
            אישור
          </button>
        </div>
      </div>
    </div>
  );
}
