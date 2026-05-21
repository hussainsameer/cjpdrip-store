'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Size } from '@/lib/products';

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  size: Size;
  color: string;
  qty: number;
  personalization?: { name?: string; exp?: string };
};

type CartCtx = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (slug: string, size: Size, color: string) => void;
  updateQty: (slug: string, size: Size, color: string, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
  ready: boolean;
};

const Ctx = createContext<CartCtx | null>(null);

const KEY = 'cjp-cart-v1';
const itemKey = (i: { slug: string; size: Size; color: string; personalization?: { name?: string; exp?: string } }) =>
  `${i.slug}__${i.size}__${i.color}__${i.personalization?.name || ''}__${i.personalization?.exp || ''}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items, ready]);

  const add = (item: CartItem) => {
    setItems(prev => {
      const k = itemKey(item);
      const idx = prev.findIndex(p => itemKey(p) === k);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + item.qty };
        return next;
      }
      return [...prev, item];
    });
  };

  const remove = (slug: string, size: Size, color: string) => {
    setItems(prev => prev.filter(p => itemKey(p) !== itemKey({ slug, size, color })));
  };

  const updateQty = (slug: string, size: Size, color: string, qty: number) => {
    if (qty <= 0) return remove(slug, size, color);
    setItems(prev => prev.map(p => itemKey(p) === itemKey({ slug, size, color }) ? { ...p, qty } : p));
  };

  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  return <Ctx.Provider value={{ items, add, remove, updateQty, clear, count, total, ready }}>{children}</Ctx.Provider>;
}

export const useCart = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useCart outside CartProvider');
  return v;
};
