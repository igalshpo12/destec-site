import type { Metadata } from 'next';
import CartView from './CartView';

export const metadata: Metadata = {
  title: 'העגלה שלי',
  description: 'פריטים שבחרתם מקטלוג DES — המשיכו להזמנה.',
  robots: { index: false },
};

export default function CartPage() {
  return <CartView />;
}
