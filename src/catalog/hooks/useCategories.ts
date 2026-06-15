'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/shared/api';

export interface Category {
  _id: string;
  name: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ categories: Category[] }>('/categories')
      .then((data) => setCategories(data.categories))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}
