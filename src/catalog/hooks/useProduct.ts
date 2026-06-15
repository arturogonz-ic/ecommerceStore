'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/shared/api';
import type { Product } from './useProducts';

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<{ product: Product }>(`/catalog/products/${id}`)
      .then((data) => setProduct(data.product))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { product, loading, error };
}
