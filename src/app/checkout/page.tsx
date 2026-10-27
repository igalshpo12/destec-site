import type { Metadata } from 'next';
import CheckoutForm from './CheckoutForm';

export const metadata: Metadata = {
  title: 'סיום הזמנה',
  description: 'השלמת הזמנה מקטלוג DES.',
  robots: { index: false },
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
