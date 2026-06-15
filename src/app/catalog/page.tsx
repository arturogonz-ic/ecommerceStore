'use client';

import { useState, Suspense, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCatalog } from '@/catalog/hooks/useCatalog';
import { useCategories } from '@/catalog/hooks/useCategories';
import { MultiSelect } from '@/shared/components/MultiSelect';
import type { Product } from '@/catalog/hooks/useProducts';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.discount?.isActive && product.effectivePrice < product.price;
  return (
    <Link
      href={`/catalog/${product._id}`}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
    >
      {(product.images ?? [])[0] ? (
        <img
          src={`${API_URL}/${product.images[0]}`}
          alt={product.name}
          className="w-full h-44 object-cover"
        />
      ) : (
        <div className="w-full h-44 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          No image
        </div>
      )}
      <div className="p-3">
        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-base font-bold text-gray-900">${product.effectivePrice.toFixed(2)}</span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">${product.price.toFixed(2)}</span>
          )}
        </div>
        {product.stock === 0 && (
          <p className="text-xs text-red-500 mt-1">Out of stock</p>
        )}
      </div>
    </Link>
  );
}

function CatalogInner() {
  const searchParams = useSearchParams();
  const { products, filtered, loading, error, setNameFilter, setPriceRange, setCategoryFilter, nameFilter, minPrice, maxPrice, categoryFilter } = useCatalog();
  const { categories } = useCategories();
  const [name, setName] = useState('');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  const suggestions = name.trim().length > 0
    ? products
        .filter((p) => p.name.toLowerCase().includes(name.toLowerCase()))
        .slice(0, 8)
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategoryFilter([cat]);
  }, [searchParams, setCategoryFilter]);

  const applyFilters = () => {
    setNameFilter(name);
    setPriceRange(min !== '' ? parseFloat(min) : '', max !== '' ? parseFloat(max) : '');
  };

  if (loading) return <p className="p-4 text-sm text-gray-500">Loading products...</p>;
  if (error) return <p className="p-4 text-sm text-red-600">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Catalog</h1>
      <div className="flex gap-6">
        <aside className="w-52 shrink-0">
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
            <div ref={searchRef}>
              <label className="block text-xs font-medium text-gray-700 mb-1">Search by name</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setShowSuggestions(true);
                    setHighlightedIndex(-1);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setHighlightedIndex((i) => Math.min(i + 1, suggestions.length - 1));
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setHighlightedIndex((i) => Math.max(i - 1, -1));
                    } else if (e.key === 'Enter') {
                      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
                        setName(suggestions[highlightedIndex].name);
                        setNameFilter(suggestions[highlightedIndex].name);
                        setShowSuggestions(false);
                        setHighlightedIndex(-1);
                      } else {
                        applyFilters();
                        setShowSuggestions(false);
                      }
                    } else if (e.key === 'Escape') {
                      setShowSuggestions(false);
                    }
                  }}
                  placeholder="Product name"
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-md max-h-52 overflow-y-auto">
                    {suggestions.map((p, i) => (
                      <li
                        key={p._id}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setName(p.name);
                          setNameFilter(p.name);
                          setShowSuggestions(false);
                          setHighlightedIndex(-1);
                        }}
                        className={`px-3 py-2 text-sm cursor-pointer ${
                          i === highlightedIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {p.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Price range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                  placeholder="Min"
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                  placeholder="Max"
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {categories.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                <MultiSelect
                  options={categories.map((c) => ({ value: c._id, label: c.name }))}
                  selected={categoryFilter}
                  onChange={setCategoryFilter}
                  placeholder="All categories"
                />
              </div>
            )}
            <button
              onClick={applyFilters}
              className="w-full bg-blue-600 text-white py-1.5 rounded text-sm font-medium hover:bg-blue-700"
            >
              Apply filters
            </button>
            <button
              onClick={() => {
                setName('');
                setMin('');
                setMax('');
                setNameFilter('');
                setPriceRange('', '');
                setCategoryFilter([]);
              }}
              className="w-full text-sm text-gray-500 hover:text-gray-700"
            >
              Clear filters
            </button>
          </div>
        </aside>
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-500">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense>
      <CatalogInner />
    </Suspense>
  );
}
