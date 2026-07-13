import type { Metadata } from 'next';
import { Noto_Sans_Hebrew } from 'next/font/google';
import './globals.css';
import SiteAnalytics from '@/components/analytics/SiteAnalytics';
import AccessibilityWidget from '@/components/a11y/AccessibilityWidget';

// Restore saved accessibility settings before paint (no flash of unstyled content)
const A11Y_INIT = `(function(){try{var s=JSON.parse(localStorage.getItem('des-a11y')||'{}'),d=document.documentElement;
if(s.color)d.classList.add('a11y-'+s.color);
if(s.readable)d.classList.add('a11y-readable');
if(s.links)d.classList.add('a11y-links');
if(s.headings)d.classList.add('a11y-headings');
if(s.noAnim)d.classList.add('a11y-no-anim');
if(s.bigCursor)d.classList.add('a11y-big-cursor');
if(s.kbd)d.classList.add('a11y-kbd');
if(s.font&&s.font!==100)d.style.fontSize=s.font+'%';}catch(e){}})();`;

const notoSansHebrew = Noto_Sans_Hebrew({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-hebrew',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://destec.co.il'),
  title: {
    default: 'DES — שירותי ציוד רפואי ודנטלי | destec.co.il',
    template: '%s | DES destec.co.il',
  },
  description:
    'DES — יבואן מורשה ומפיץ רשמי של ציוד דנטלי ורפואי מהמובילים בישראל. NSK, W&H, KaVo, Nouvag, Bien-Air, MK-dent, Anthogyr, Dentsply Sirona, JINME. ISO 9001 · רישיון אמ"ר.',
  keywords:
    'ציוד דנטלי, ציוד רפואי, NSK, W&H, KaVo, MK-dent, Nouvag, Bien-Air, Anthogyr, Dentsply Sirona, JINME, טורבינה, ידית, זוויתנים, אוטוקלב, DES, destec',
  authors: [{ name: 'DES שירותי ציוד רפואי ודנטלי' }],
  openGraph: {
    title: 'DES — שירותי ציוד רפואי ודנטלי',
    description: 'יבואן מורשה של ציוד דנטלי ורפואי. ISO 9001 · אמ"ר.',
    url: 'https://destec.co.il',
    siteName: 'DES destec.co.il',
    locale: 'he_IL',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={notoSansHebrew.variable}>
      <body className={`${notoSansHebrew.variable} font-sans antialiased bg-gray-50 text-gray-900`}>
        <script dangerouslySetInnerHTML={{ __html: A11Y_INIT }} />
        <a href="#main-content" className="skip-link">דלג לתוכן הראשי</a>
        <div id="site">{children}</div>
        <AccessibilityWidget />
        <SiteAnalytics />
      </body>
    </html>
  );
}
