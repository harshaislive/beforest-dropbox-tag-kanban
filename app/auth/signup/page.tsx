'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = (await res.json()) as { ok: boolean; message?: string };
    if (!data.ok) {
      setLoading(false);
      setMessage(data.message ?? 'Could not create account.');
      return;
    }

    await signIn('credentials', { email, password, callbackUrl: '/dashboard' });
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
        <h1 className="mb-4 text-xl font-semibold">Create account</h1>
        <p className="mb-4 text-sm text-slate-600">Simple email/password signup backed by PostgreSQL.</p>
        <input
          type="text"
          placeholder="Display name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-3 w-full rounded-lg border border-border bg-white p-3 text-sm"
        />
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
          placeholder="Min 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3 w-full rounded-lg border border-border bg-white p-3 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
        {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
        <p className="mt-3 text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-slate-900 underline">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
