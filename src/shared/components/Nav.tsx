'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/user-auth/hooks/useAuth';
import { CartIcon } from '@/cart/components/CartIcon';

export function Nav() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const firstName = user?.name.split(' ')[0] ?? '';

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-6">
        <Link href="/" className="text-xl font-bold text-blue-600 mr-4">
          Store
        </Link>
        <Link href="/catalog" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
          Catalog
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <CartIcon />
          {user ? (
            <div className="relative">
              <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                {firstName}
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow-lg z-50">
                  <Link
                    href="/orders"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    My Orders
                  </Link>
                  <Link
                    href="/account"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Account
                  </Link>
                  <button
                    onClick={async () => { setOpen(false); await logout(); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-700 hover:text-blue-600 font-medium">
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
