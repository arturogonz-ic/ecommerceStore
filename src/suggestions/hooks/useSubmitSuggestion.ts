'use client';

import { useState } from 'react';
import { apiFetch } from '@/shared/api';

export function useSubmitSuggestion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (message: string) => {
    setLoading(true);
    setError('');
    try {
      await apiFetch('/suggestions', { method: 'POST', body: JSON.stringify({ message }) });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}
