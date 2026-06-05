'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import {
  GA4_ID,
  META_PIXEL_ID,
  ANALYTICS_CONFIGURED,
  getConsent,
  setConsent,
  captureAttribution,
  trackEvent,
  type ConsentValue,
} from '@/lib/analytics';
import ConsentBanner from './ConsentBanner';

/**
 * Single client-side entry point for site analytics. Mounted once in the root
 * layout. Loads GA4 + Meta Pixel only after the visitor opts in, records UTM
 * attribution, tracks SPA page views, and turns outbound contact clicks
 * (tel / WhatsApp / mailto) into conversion events.
 */
export default function SiteAnalytics() {
  const pathname = usePathname();
  const [consent, setConsentState] = useState<ConsentValue | null>(null);
  const prevPath = useRef<string | null>(null);

  // Resolve stored consent on mount + react to changes from elsewhere.
  useEffect(() => {
    setConsentState(getConsent());
    const onChange = (e: Event) =>
      setConsentState((e as CustomEvent<ConsentValue>).detail);
    window.addEventListener('des-consent-change', onChange);
    return () => window.removeEventListener('des-consent-change', onChange);
  }, []);

  // First-party attribution capture — independent of consent (no third party).
  useEffect(() => {
    captureAttribution();
  }, [pathname]);

  // SPA page views (the initial view is sent by the tag's own init).
  useEffect(() => {
    if (consent !== 'granted') return;
    if (prevPath.current && prevPath.current !== pathname) {
      window.gtag?.('event', 'page_view', { page_path: pathname });
      window.fbq?.('track', 'PageView');
    }
    prevPath.current = pathname;
  }, [pathname, consent]);

  // Outbound contact clicks → conversion events (delegated, attached once).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest?.('a');
      const href = anchor?.getAttribute('href');
      if (!href) return;
      if (href.startsWith('tel:')) {
        trackEvent('phone_click', { value: href.replace('tel:', '') });
        window.fbq?.('track', 'Contact', { method: 'phone' });
      } else if (/wa\.me|whatsapp\.com/.test(href)) {
        trackEvent('whatsapp_click', { link_url: href });
        window.fbq?.('track', 'Contact', { method: 'whatsapp' });
      } else if (href.startsWith('mailto:')) {
        trackEvent('email_click', { value: href.replace('mailto:', '') });
        window.fbq?.('track', 'Contact', { method: 'email' });
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  if (!ANALYTICS_CONFIGURED) return null;

  return (
    <>
      {consent === 'granted' && GA4_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA4_ID}', { anonymize_ip: true });`}
          </Script>
        </>
      )}

      {consent === 'granted' && META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
        </Script>
      )}

      {consent === null && (
        <ConsentBanner
          onAccept={() => setConsent('granted')}
          onDecline={() => setConsent('denied')}
        />
      )}
    </>
  );
}
