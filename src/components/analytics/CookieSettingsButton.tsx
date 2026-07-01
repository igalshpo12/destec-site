'use client';

import { clearConsent } from '@/lib/analytics';

/**
 * Re-opens the cookie consent banner so a visitor can change or withdraw a
 * previous choice (Israeli Privacy Protection Law — right to withdraw consent).
 */
export default function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => clearConsent()}
      className={className ?? 'underline hover:text-white transition-colors'}
    >
      הגדרות עוגיות
    </button>
  );
}
