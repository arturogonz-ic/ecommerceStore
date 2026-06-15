'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
}

const CART_KEY = 'cart';

function readCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // Start with [] on both server and client first render to avoid hydration mismatch.
  const [items, setItems] = useState<CartItem[]>([]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setItems(readCart()); }, []);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    writeCart(next);
  }, []);

  const addItem = useCallback(
    (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === item.productId);
        let next: CartItem[];
        if (existing) {
          next = prev.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: Math.min(i.quantity + (item.quantity ?? 1), i.stock) }
              : i
          );
        } else {
          next = [...prev, { ...item, quantity: item.quantity ?? 1 }];
        }
        writeCart(next);
        return next;
      });
    },
    []
  );

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.productId !== productId);
      writeCart(next);
      return next;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      const next = prev
        .map((i) => (i.productId === productId ? { ...i, quantity: Math.max(0, Math.min(quantity, i.stock)) } : i))
        .filter((i) => i.quantity > 0);
      writeCart(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => persist([]), [persist]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartContext must be used inside CartProvider');
  return ctx;
}
