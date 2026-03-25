import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  localePrefix: 'always' 
});

// Next.js 16 改用 export const proxy 取代 export default
export const proxy = intlMiddleware;
 
export const config = {
  matcher: ['/', '/(zh|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
};