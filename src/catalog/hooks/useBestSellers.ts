'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/shared/api';
import type { Product } from './useProducts';

export function useBestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<{ products: Product[] }>('/catalog/products/best-sellers')
      .then((data) => setProducts(data.products))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
}
