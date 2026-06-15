'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRequireUser } from '@/user-auth/hooks/useRequireUser';
import { useUpdateAddress } from '@/user-auth/hooks/useUpdateAddress';
import { useAuth } from '@/user-auth/hooks/useAuth';
import type { Address } from '@/user-auth/hooks/useAuth';

export default function AccountPage() {
  const { user, loading } = useRequireUser();
  const { refreshUser } = useAuth();
  const { updateAddress, loading: saving, error: saveError } = useUpdateAddress();
  const [address, setAddress] = useState<Address>({});
  const [success, setSuccess] = useState(false);

  // Pre-fill form once user data loads — unavoidable pattern for form initialization
  useEffect(() => {
    if (user?.billingAddress) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAddress(user.billingAddress);
    }
  }, [user]);

  if (loading || !user) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    try {
      await updateAddress(address);
      await refreshUser();
      setSuccess(true);
    } catch {
      // error is set in hook
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-2">Account settings</h1>
      <p className="text-sm text-gray-500 mb-6">{user.email}</p>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Billing address</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          {saveError && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{saveError}</p>}
          {success && <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded">Address saved.</p>}
          {(['street', 'city', 'state', 'country', 'zip'] as const).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
              <input
                type="text"
                value={address[field] ?? ''}
                onChange={(e) => setAddress((a) => ({ ...a, [field]: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white py-2 rounded font-medium text-sm hover:bg-blue-700 disabled:opacity-60 mt-2"
          >
            {saving ? 'Saving...' : 'Save address'}
          </button>
        </form>
      </div>
    </div>
  );
}
