'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/shared/api';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  effectivePrice: number;
  stock: number;
  images: string[];
  categories: string[];
  discount?: { percentage: number; isActive: boolean; expiresAt?: string };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<{ products: Product[] }>('/catalog/products')
      .then((data) => setProducts(data.products))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
}
