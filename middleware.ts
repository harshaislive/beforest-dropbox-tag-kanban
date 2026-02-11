import NextAuth from 'next-auth';
import authConfig from '@/auth.config';

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ['/dashboard/:path*', '/api/board/:path*', '/api/tags/:path*', '/api/assets/:path*', '/api/leaderboard/:path*']
};
