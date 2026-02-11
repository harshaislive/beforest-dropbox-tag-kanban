'use client';

import { signOut } from 'next-auth/react';

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/auth/login' })}
      className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm font-medium text-[#3f3f3f] transition hover:bg-[#f3f3f1]"
    >
      Sign out
    </button>
  );
}
