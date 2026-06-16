'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRequireUser } from '@/user-auth/hooks/useRequireUser';
import { useAuth } from '@/user-auth/hooks/useAuth';
import { useCart } from '@/cart/hooks/useCart';
import { useCheckout } from '@/checkout/hooks/useCheckout';
import { useUpdateAddress } from '@/user-auth/hooks/useUpdateAddress';
import type { Address } from '@/user-auth/hooks/useAuth';

function hasAddress(a?: Address): boolean {
  return !!a && Object.values(a).some(Boolean);
}

export default function CheckoutPage() {
  const { user, loading: authLoading } = useRequireUser();
  const { refreshUser } = useAuth();
  const { items, total, clearCart } = useCart();
  const { place, loading: placing, error: placeError } = useCheckout();
  const { updateAddress, loading: savingAddr, error: addrError } = useUpdateAddress();

  const [address, setAddress] = useState<Address>({});
  const [addrSaved, setAddrSaved] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  if (authLoading || !user) return null;

  const needsAddress = !hasAddress(user.billingAddress) && !addrSaved;

  const handleSaveAddress = async (e: FormEvent) => {
    e.preventDefault();
    await updateAddress(address);
    await refreshUser();
    setAddrSaved(true);
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    const order = await place(items);
    clearCart();
    setPlacedOrderId(order._id);
  };

  if (placedOrderId) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <p className="text-lg font-semibold text-green-800 mb-2">Order placed!</p>
          <p className="text-sm text-gray-600 mb-4">Order ID: <span className="font-mono text-xs">{placedOrderId}</span></p>
          <Link href={`/orders/detail?id=${placedOrderId}`} className="text-blue-600 hover:underline text-sm font-medium block mb-2">
            View order details
          </Link>
          <Link href="/catalog" className="text-gray-500 hover:underline text-sm block">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Link href="/catalog" className="text-blue-600 hover:underline text-sm">Browse catalog</Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Order summary</h2>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span className="text-gray-700">{item.name} × {item.quantity}</span>
              <span className="text-gray-900 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {needsAddress && (
        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Billing address required</h2>
          <form onSubmit={handleSaveAddress} className="space-y-3">
            {addrError && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{addrError}</p>}
            {(['street', 'city', 'state', 'country', 'zip'] as const).map((field) => (
              <div key={field}>
                <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">{field}</label>
                <input
                  type="text"
                  value={address[field] ?? ''}
                  onChange={(e) => setAddress((a) => ({ ...a, [field]: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={savingAddr}
              className="w-full bg-gray-800 text-white py-2 rounded text-sm font-medium hover:bg-gray-900 disabled:opacity-60"
            >
              {savingAddr ? 'Saving...' : 'Save address'}
            </button>
          </form>
        </div>
      )}

      {placeError && <p className="text-sm text-red-600 mb-4">{placeError}</p>}

      <button
        onClick={handlePlaceOrder}
        disabled={needsAddress || placing}
        className="w-full bg-blue-600 text-white py-3 rounded font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {placing ? 'Placing order...' : 'Place order'}
      </button>
      {needsAddress && (
        <p className="text-xs text-gray-400 text-center mt-2">Save your billing address to continue</p>
      )}
    </div>
  );
}
