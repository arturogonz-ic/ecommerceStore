'use client';

import { useState, useMemo } from 'react';
import { useProducts } from './useProducts';
import type { Product } from './useProducts';

export function useCatalog() {
  const { products, loading, error } = useProducts();
  const [nameFilter, setNameFilter] = useState('');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return products.filter((p: Product) => {
      if (nameFilter && !p.name.toLowerCase().includes(nameFilter.toLowerCase())) return false;
      if (minPrice !== '' && p.effectivePrice < minPrice) return false;
      if (maxPrice !== '' && p.effectivePrice > maxPrice) return false;
      if (categoryFilter.length > 0 && !categoryFilter.some((c) => p.categories.includes(c))) return false;
      return true;
    });
  }, [products, nameFilter, minPrice, maxPrice, categoryFilter]);

  return {
    products,
    filtered,
    loading,
    error,
    setNameFilter,
    setPriceRange: (min: number | '', max: number | '') => {
      setMinPrice(min);
      setMaxPrice(max);
    },
    setCategoryFilter,
    nameFilter,
    minPrice,
    maxPrice,
    categoryFilter,
  };
}
