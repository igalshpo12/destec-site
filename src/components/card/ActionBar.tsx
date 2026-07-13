'use client';

import { useState } from 'react';
import { COMPANY, whatsappLink } from '@/lib/company';
import { trackEvent } from '@/lib/analytics';
import {
  PhoneIcon,
  WhatsAppIcon,
  WazeIcon,
  SaveContactIcon,
  ShareIcon,
} from './icons';

const WA_TEXT = 'שלום, הגעתי דרך כרטיס הביקור הדיגיטלי של DES ואשמח לפרטים';

interface Action {
  key: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  bg: string;
}

export default function ActionBar() {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    trackEvent('card_share');
    const url = typeof window !== 'undefined' ? window.location.href : COMPANY.website + COMPANY.cardPath;
    const data = {
      title: COMPANY.nameHe,
      text: 'כרטיס הביקור הדיגיטלי של DES — שירותי ציוד רפואי ודנטלי',
      url,
    };
    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch {
        /* user dismissed the sheet — fall through to clipboard */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard unavailable (e.g. http) — nothing else to do */
    }
  };

  const actions: Action[] = [
    {
      key: 'call',
      label: 'חיוג למשרד',
      href: COMPANY.landlineHref,
      icon: <PhoneIcon />,
      bg: 'linear-gradient(135deg, #1e90ff, #1565d8)',
    },
    {
      key: 'whatsapp',
      label: 'וואטסאפ',
      href: whatsappLink(WA_TEXT),
      icon: <WhatsAppIcon />,
      bg: 'linear-gradient(135deg, #25d366, #128c7e)',
    },
    {
      key: 'waze',
      label: 'ניווט אלינו',
      href: COMPANY.wazeUrl,
      icon: <WazeIcon />,
      bg: 'linear-gradient(135deg, #33ccff, #0b7bc2)',
    },
    {
      key: 'vcard',
      label: 'שמירת איש קשר',
      href: '/api/vcard',
      icon: <SaveContactIcon />,
      bg: 'linear-gradient(135deg, #6c7a93, #46536b)',
    },
    {
      key: 'share',
      label: 'שיתוף',
      onClick: share,
      icon: <ShareIcon />,
      bg: 'linear-gradient(135deg, #8e54c9, #5b3a9e)',
    },
  ];

  return (
    <div className="relative">
      <div className="grid grid-cols-5 gap-2 sm:gap-3" role="group" aria-label="פעולות מהירות">
        {actions.map((a) => {
          const inner = (
            <>
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg transition-transform group-hover:scale-105 group-active:scale-95"
                style={{ background: a.bg }}
              >
                {a.icon}
              </span>
              <span className="text-[11px] font-medium leading-tight text-white/80">
                {a.label}
              </span>
            </>
          );
          const cls = 'group flex flex-col items-center gap-1.5 text-center';
          return a.href ? (
            <a
              key={a.key}
              href={a.href}
              target={a.key === 'whatsapp' || a.key === 'waze' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className={cls}
              onClick={() => trackEvent(`card_${a.key}`)}
            >
              {inner}
            </a>
          ) : (
            <button key={a.key} type="button" onClick={a.onClick} className={cls}>
              {inner}
            </button>
          );
        })}
      </div>
      {copied && (
        <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-4 py-1 text-xs font-semibold text-[#1a2b4a] shadow-md">
          הקישור הועתק ✓
        </div>
      )}
    </div>
  );
}
