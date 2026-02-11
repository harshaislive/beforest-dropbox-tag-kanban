export { auth as middleware } from '@/auth';

export const config = {
  matcher: ['/dashboard/:path*', '/api/board/:path*', '/api/tags/:path*', '/api/assets/:path*']
};
