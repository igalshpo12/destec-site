import type { Metadata } from 'next';
import { Suspense } from 'react';
import CheckoutForm from './CheckoutForm';

export const metadata: Metadata = {
  title: 'סיום הזמנה',
  description: 'השלמת הזמנה מקטלוג DES.',
  robots: { index: false },
};

export default function CheckoutPage() {
  // Suspense: the form reads ?order=<id> (return from a payment tab) via useSearchParams.
  return <Suspense fallback={null}><CheckoutForm /></Suspense>;
}
