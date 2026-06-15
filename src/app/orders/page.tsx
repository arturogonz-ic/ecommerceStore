'use client';

import Link from 'next/link';
import { useRequireUser } from '@/user-auth/hooks/useRequireUser';
import { useOrders } from '@/orders/hooks/useOrders';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  lost: 'bg-gray-100 text-gray-800',
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useRequireUser();
  const { orders, loading, error } = useOrders();

  if (authLoading || !user) return null;
  if (loading) return <p className="p-6 text-sm text-gray-500">Loading orders...</p>;
  if (error) return <p className="p-6 text-sm text-red-600">{error}</p>;

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">You haven&#39;t placed any orders yet.</p>
        <Link href="/catalog" className="text-blue-600 hover:underline text-sm font-medium">
          Browse catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">My orders</h1>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {orders.map((order, idx) => (
          <Link
            key={order._id}
            href={`/orders/${order._id}`}
            className={`flex items-center gap-4 px-4 py-4 hover:bg-gray-50 ${idx < orders.length - 1 ? 'border-b border-gray-100' : ''}`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-mono truncate">#{order._id}</p>
              <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-800'}`}
            >
              {order.status}
            </span>
            <p className="text-sm font-bold text-gray-900 w-20 text-right">${order.total.toFixed(2)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
