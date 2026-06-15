'use client';

import Link from 'next/link';
import { useBestSellers } from '@/catalog/hooks/useBestSellers';
import { useProducts } from '@/catalog/hooks/useProducts';
import { useCategories } from '@/catalog/hooks/useCategories';
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
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
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
      </div>
    </Link>
  );
}

export default function HomePage() {
  const { products: allProducts, loading: allLoading } = useProducts();
  const { products: bestSellers, loading: bsLoading } = useBestSellers();
  const { categories } = useCategories();

  const discounted = allProducts.filter(
    (p) => p.discount?.isActive && p.effectivePrice < p.price
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          {!allLoading && discounted.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Deals of the day</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {discounted.slice(0, 8).map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Best Sellers</h2>
            {bsLoading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {bestSellers.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="w-44 shrink-0 hidden lg:block">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Categories</h3>
          <ul className="space-y-2">
            {categories.length === 0 && !allLoading && (
              <li className="text-sm text-gray-500">No categories</li>
            )}
            {categories.map((cat) => (
              <li key={cat._id}>
                <Link
                  href={`/catalog?category=${encodeURIComponent(cat._id)}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
