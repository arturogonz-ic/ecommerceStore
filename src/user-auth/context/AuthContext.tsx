'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { apiFetch } from '@/shared/api';

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  billingAddress?: Address;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: { name: string; email: string; password: string; billingAddress?: Address }) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const data = await apiFetch<{ user: User }>('/user-auth/me');
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    apiFetch<{ user: User }>('/user-auth/me')
      .then((data) => { if (!cancelled) { setUser(data.user); setLoading(false); } })
      .catch(() => { if (!cancelled) { setUser(null); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const data = await apiFetch<{ user: User }>('/user-auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setUser(data.user);
    return data.user;
  };

  const register = async (payload: { name: string; email: string; password: string; billingAddress?: Address }): Promise<User> => {
    const data = await apiFetch<{ user: User }>('/user-auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await apiFetch('/user-auth/logout', { method: 'POST' });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider');
  return ctx;
}
