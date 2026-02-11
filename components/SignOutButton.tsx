'use client';

import { signOut } from 'next-auth/react';

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/auth/login' })}
      className="rounded-lg border border-border px-3 py-2 text-sm"
    >
      Sign out
    </button>
  );
}
