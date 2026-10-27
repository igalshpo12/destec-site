'use client';
/**
 * Client-side shopping cart. Persists to localStorage ('des-cart') so it
 * survives reloads; read in an effect (never during render) to avoid
 * hydration mismatches on the header badge.
 *
 * Prices stored here are the catalog prices (ILS, VAT included). Items with
 * no price are allowed — they become "לפי הצעת מחיר" lines in checkout.
 *
 * Payment: checkout currently sends the order to DES by email (/api/order).
 * The online-payment hook (Credit2000 hosted page) will be wired in
 * `startPayment()` in src/app/checkout/CheckoutForm.tsx once credentials exist.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export type CartItem = {
  id: string;            // catalog_products.id
  name: string;
  itemNumber?: string | null;
  manufacturer?: string | null;
  image?: string | null;
  price?: number | null; // ILS incl. VAT, null = quote
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;              // total units
  subtotal: number;           // sum of priced lines
  unpricedCount: number;      // lines with no price
  hydrated: boolean;
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  lastAdded: { item: CartItem; at: number } | null;
  dismissToast: () => void;
};

const STORAGE_KEY = 'des-cart';
const CartContext = createContext<CartContextValue | null>(null);

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x) => x && typeof x.id === 'string' && typeof x.name === 'string')
      .map((x) => ({ ...x, qty: Math.max(1, Math.min(99, Number(x.qty) || 1)) }));
  } catch {
    return [];
  }
}

function save(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* private mode / quota — cart still works for the session */
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [lastAdded, setLastAdded] = useState<{ item: CartItem; at: number } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setItems(load());
    setHydrated(true);
    // keep tabs in sync
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(load());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const commit = useCallback((next: CartItem[]) => {
    setItems(next);
    save(next);
  }, []);

  const add = useCallback<CartContextValue['add']>((item, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.id === item.id);
      let next: CartItem[];
      if (idx >= 0) {
        next = prev.map((x, i) => (i === idx ? { ...x, ...item, qty: Math.min(99, x.qty + qty) } : x));
      } else {
        next = [...prev, { ...item, qty: Math.max(1, qty) }];
      }
      save(next);
      const added = next.find((x) => x.id === item.id)!;
      setLastAdded({ item: { ...added, qty }, at: Date.now() });
      return next;
    });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setLastAdded(null), 3500);
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((x) => x.id !== id);
      save(next);
      return next;
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) => {
      const q = Math.max(0, Math.min(99, Math.floor(qty)));
      const next = q === 0 ? prev.filter((x) => x.id !== id) : prev.map((x) => (x.id === id ? { ...x, qty: q } : x));
      save(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => commit([]), [commit]);
  const dismissToast = useCallback(() => setLastAdded(null), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, x) => s + x.qty, 0);
    const subtotal = items.reduce((s, x) => s + (x.price ? x.price * x.qty : 0), 0);
    const unpricedCount = items.filter((x) => !x.price).length;
    return { items, count, subtotal, unpricedCount, hydrated, add, remove, setQty, clear, lastAdded, dismissToast };
  }, [items, hydrated, add, remove, setQty, clear, lastAdded, dismissToast]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
