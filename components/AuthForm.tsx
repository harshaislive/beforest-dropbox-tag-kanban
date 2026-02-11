'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: '/dashboard'
    });

    setLoading(false);

    if (result?.error) {
      setMessage('Invalid email or password.');
      return;
    }

    window.location.href = '/dashboard';
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
      <h1 className="mb-4 text-xl font-semibold">Sign in</h1>
      <p className="mb-4 text-sm text-slate-600">Use your email and password to continue.</p>
      <input
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-3 w-full rounded-lg border border-border bg-white p-3 text-sm"
      />
      <input
        type="password"
        required
        minLength={8}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-3 w-full rounded-lg border border-border bg-white p-3 text-sm"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
      {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
      <p className="mt-3 text-sm text-slate-600">
        New here?{' '}
        <Link href="/auth/signup" className="text-slate-900 underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
