'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/user-auth/hooks/useAuth';
import { useSubmitSuggestion } from '../hooks/useSubmitSuggestion';

export function SuggestionBox() {
  const { user } = useAuth();
  const { submit, loading, error } = useSubmitSuggestion();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await submit(message);
      setSent(true);
      setMessage('');
    } catch {
      // error shown via hook state
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setSent(false);
  };

  const handleClose = () => {
    setOpen(false);
    setSent(false);
    setMessage('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 print:hidden">
      {open && (
        <div className="w-80 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          <div className="flex items-center justify-between bg-blue-600 px-4 py-3">
            <span className="text-sm font-semibold text-white">Leave a suggestion</span>
            <button onClick={handleClose} className="text-white/80 hover:text-white text-lg leading-none">×</button>
          </div>
          <div className="p-4">
            {sent ? (
              <div className="text-center py-4">
                <p className="text-sm font-medium text-gray-900 mb-1">Thanks for your feedback!</p>
                <p className="text-xs text-gray-500 mb-4">We read every suggestion.</p>
                <button
                  onClick={() => setSent(false)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="text-xs text-gray-500">
                  Submitting as <span className="font-medium text-gray-700">{user.name}</span>
                </div>
                {error && <p className="text-xs text-red-600 bg-red-50 px-2 py-1.5 rounded">{error}</p>}
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your idea or feedback..."
                  rows={4}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <button
                  type="submit"
                  disabled={loading || message.trim().length === 0}
                  className="w-full bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? 'Sending...' : 'Send suggestion'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      <button
        onClick={open ? handleClose : handleOpen}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-3-3z" />
        </svg>
        {open ? 'Close' : 'Suggestion'}
      </button>
    </div>
  );
}
