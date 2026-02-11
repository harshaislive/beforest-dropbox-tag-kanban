'use client';

import { FormEvent, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function AuthForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });

    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage('Magic link sent. Check your inbox.');
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
      <h1 className="mb-4 text-xl font-semibold">Sign in</h1>
      <p className="mb-4 text-sm text-slate-600">Use your email to receive a magic link.</p>
      <input
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-3 w-full rounded-lg border border-border bg-white p-3 text-sm"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {loading ? 'Sending...' : 'Send magic link'}
      </button>
      {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}
    </form>
  );
}
