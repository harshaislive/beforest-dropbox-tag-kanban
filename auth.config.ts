import type { NextAuthConfig } from 'next-auth';

export default {
  providers: [],
  pages: {
    signIn: '/auth/login'
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isProtectedApi =
        nextUrl.pathname.startsWith('/api/board') ||
        nextUrl.pathname.startsWith('/api/tags') ||
        nextUrl.pathname.startsWith('/api/assets') ||
        nextUrl.pathname.startsWith('/api/leaderboard');

      if ((isDashboard || isProtectedApi) && !isLoggedIn) {
        return false;
      }

      return true;
    }
  }
} satisfies NextAuthConfig;
