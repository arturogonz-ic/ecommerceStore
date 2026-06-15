'use client';

import { useState } from 'react';
import { apiFetch } from '@/shared/api';
import type { CartItem } from '@/cart/hooks/useCart';
import type { Order } from '@/orders/hooks/useOrders';

export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const place = async (items: CartItem[]): Promise<Order> => {
    setLoading(true);
    setError('');
    try {
      const payload = items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      }));
      const data = await apiFetch<{ order: Order }>('/orders', {
        method: 'POST',
        body: JSON.stringify({ items: payload }),
      });
      return data.order;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to place order';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { place, loading, error };
}
