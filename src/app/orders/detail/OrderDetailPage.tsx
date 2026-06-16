'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRequireUser } from '@/user-auth/hooks/useRequireUser';
import { useOrder } from '@/orders/hooks/useOrder';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  lost: 'bg-gray-100 text-gray-800',
};

export default function OrderDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') ?? '';
  const { user, loading: authLoading } = useRequireUser();
  const { order, loading, error } = useOrder(id);

  if (authLoading || !user) return null;
  if (loading) return <p className="p-6 text-sm text-gray-500">Loading...</p>;
  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-900 font-medium mb-4">Order not found.</p>
        <Link href="/orders" className="text-blue-600 hover:underline text-sm">
          Back to orders
        </Link>
      </div>
    );
  }

  const hasShipping = order.status === 'shipped' || order.status === 'delivered';
  const trackingAvailable = hasShipping && (order.shippingCarrier || order.trackingId);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 print:px-0 print:py-4 print:max-w-full">
      <div className="mb-4 flex items-center justify-between print:hidden">
        <Link href="/orders" className="text-sm text-blue-600 hover:underline">
          ← Back to orders
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-5 py-2.5 transition-colors shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print / Save as PDF
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 print:border-0 print:shadow-none print:p-0">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-400 font-mono print:text-sm print:text-gray-800">#{order._id}</p>
            <p className="text-xs text-gray-500 mt-0.5 print:text-sm print:text-gray-700">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full print:text-sm print:font-semibold ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-800'}`}
          >
            {order.status}
          </span>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Items</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-100">
                <th className="text-left pb-2">Product</th>
                <th className="text-center pb-2">Qty</th>
                <th className="text-right pb-2">Unit</th>
                <th className="text-right pb-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-2 text-gray-900">{item.name}</td>
                  <td className="py-2 text-center text-gray-700">{item.quantity}</td>
                  <td className="py-2 text-right text-gray-700">${item.price.toFixed(2)}</td>
                  <td className="py-2 text-right font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center pt-3 font-semibold">
            <span className="text-gray-900">Order total</span>
            <span className="text-lg text-gray-900">${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-2 print:text-base">Shipping</h2>
          {trackingAvailable ? (
            <div className="text-sm text-gray-700 space-y-1 print:text-base print:text-gray-800">
              {order.shippingCarrier && <p>Carrier: {order.shippingCarrier}</p>}
              {order.trackingId && <p>Tracking: {order.trackingId}</p>}
            </div>
          ) : (
            <p className="text-sm text-gray-500 print:text-base print:text-gray-700">Not available yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
