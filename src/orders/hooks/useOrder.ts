'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/shared/api';
import type { Order } from './useOrders';

export function useOrder(id: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<{ order: Order }>(`/orders/my/${id}`)
      .then((data) => setOrder(data.order))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { order, loading, error };
}
