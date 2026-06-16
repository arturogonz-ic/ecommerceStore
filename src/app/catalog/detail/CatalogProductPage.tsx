'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProduct } from '@/catalog/hooks/useProduct';
import { useCart } from '@/cart/hooks/useCart';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export default function ProductDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') ?? '';
  const { product, loading, error } = useProduct(id);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (loading) return <p className="p-6 text-sm text-gray-500">Loading...</p>;
  if (error || !product) return <p className="p-6 text-sm text-red-600">Product not found.</p>;

  const hasDiscount = product.discount?.isActive && product.effectivePrice < product.price;
  const inStock = product.stock > 0;

  const handleAdd = () => {
    addItem({
      productId: product._id,
      name: product.name,
      price: product.effectivePrice,
      stock: product.stock,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2">
          {(product.images ?? [])[0] ? (
            <img
              src={`${API_URL}/${product.images[0]}`}
              alt={product.name}
              className="w-full h-72 md:h-full object-cover"
            />
          ) : (
            <div className="w-full h-72 bg-gray-100 flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>
        <div className="md:w-1/2 p-6 flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          {product.description && (
            <p className="text-sm text-gray-600">{product.description}</p>
          )}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-gray-900">${product.effectivePrice.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">${product.price.toFixed(2)}</span>
            )}
            {hasDiscount && (
              <span className="text-sm text-green-600 font-medium">
                -{product.discount!.percentage}% off
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {inStock ? `${product.stock} in stock` : <span className="text-red-500">Out of stock</span>}
          </p>
          {inStock && (
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Quantity</label>
              <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 text-gray-700 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1 text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-1 text-gray-700 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          )}
          <button
            onClick={handleAdd}
            disabled={!inStock}
            className="mt-2 bg-blue-600 text-white py-2.5 rounded font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {added ? 'Added to cart!' : inStock ? 'Add to cart' : 'Out of stock'}
          </button>
        </div>
      </div>
    </div>
  );
}
