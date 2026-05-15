import type { Metadata } from 'next';
import { Noto_Sans_Hebrew } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/sections/AnnouncementBar';

const notoSansHebrew = Noto_Sans_Hebrew({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-hebrew',
  display: 'swap',
});

export const metadata: Metadata = {
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
        <AnnouncementBar />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
