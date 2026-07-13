import type { Metadata } from 'next';
import ActionBar from '@/components/card/ActionBar';
import {
  CardHero,
  CardAbout,
  CardServices,
  BrandsStrip,
  CardGallery,
  CardReviews,
  CardContact,
  CardFooter,
} from '@/components/card/CardSections';

export const metadata: Metadata = {
  title: 'DES — כרטיס ביקור דיגיטלי',
  description:
    'DES שירותי ציוד רפואי ודנטלי — כל פרטי הקשר במקום אחד: חיוג, וואטסאפ, ניווט, שמירת איש קשר. מכירה, תיקון והדרכה לציוד דנטלי ורפואי משנת 1998.',
  alternates: { canonical: '/card' },
  openGraph: {
    title: 'DES — שירותי ציוד רפואי ודנטלי | כרטיס ביקור דיגיטלי',
    description: 'מכירה · מעבדת תיקונים · איסוף והחזרה · הדרכות. ISO 9001 · רישיון אמ״ר · משנת 1998.',
    url: 'https://destec.co.il/card',
    siteName: 'DES destec.co.il',
    locale: 'he_IL',
    type: 'website',
  },
};

export default function CardPage() {
  return (
    <main
      id="main-content"
      dir="rtl"
      className="min-h-screen"
      style={{
        background:
          'radial-gradient(ellipse 120% 60% at 50% -10%, #1c3a66 0%, #12233f 45%, #0d1929 100%)',
      }}
    >
      <div className="mx-auto flex w-full max-w-md flex-col gap-5 px-4">
        <CardHero />
        <ActionBar />
        <CardAbout />
        <CardServices />
        <BrandsStrip />
        <CardGallery />
        <CardReviews />
        <CardContact />
        <CardFooter />
      </div>
    </main>
  );
}
