'use client';

import Link from 'next/link';
import { useCart } from '@/cart/hooks/useCart';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg mb-4">Your cart is empty.</p>
        <Link href="/catalog" className="text-blue-600 hover:underline text-sm font-medium">
          Browse catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Your cart</h1>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {items.map((item, idx) => (
          <div
            key={item.productId}
            className={`flex items-center gap-4 px-4 py-4 ${idx < items.length - 1 ? 'border-b border-gray-100' : ''}`}
          >
            <div className="flex-1 min-w-0">
              <Link href={`/catalog/detail?id=${item.productId}`} className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate block">
                {item.name}
              </Link>
              <p className="text-xs text-gray-500 mt-0.5">${item.price.toFixed(2)} each</p>
            </div>
            <div className="flex items-center border border-gray-300 rounded overflow-hidden">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="px-2 py-1 text-gray-700 hover:bg-gray-100 text-sm"
              >
                -
              </button>
              <span className="px-3 py-1 text-sm">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="px-2 py-1 text-gray-700 hover:bg-gray-100 text-sm"
              >
                +
              </button>
            </div>
            <p className="text-sm font-semibold text-gray-900 w-20 text-right">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
            <button
              onClick={() => removeItem(item.productId)}
              className="text-gray-400 hover:text-red-500 text-sm ml-2"
            >
              ✕
            </button>
          </div>
        ))}
        <div className="px-4 py-4 border-t border-gray-200 flex items-center justify-between">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="text-xl font-bold text-gray-900">${total.toFixed(2)}</span>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Link
          href="/checkout"
          className="bg-blue-600 text-white px-6 py-2.5 rounded font-medium hover:bg-blue-700 text-sm"
        >
          Proceed to Checkout
        </Link>
      </div>
      <p className="mt-2 text-xs text-gray-400 text-right">Prices confirmed at checkout</p>
    </div>
  );
}
