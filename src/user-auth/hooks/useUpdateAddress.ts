'use client';

import { useState } from 'react';
import { apiFetch } from '@/shared/api';
import type { Address } from './useAuth';

export function useUpdateAddress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateAddress = async (address: Address) => {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch<{ billingAddress: Address }>('/user-auth/me/address', {
        method: 'PUT',
        body: JSON.stringify(address),
      });
      return data.billingAddress;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update address';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateAddress, loading, error };
}
