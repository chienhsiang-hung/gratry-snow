import createMiddleware from 'next-intl/middleware';

// 建立 next-intl 的中間件邏輯
const intlMiddleware = createMiddleware({
  locales: ['en', 'zh'],
  defaultLocale: 'zh'
});

// Next.js 16 改用 export const proxy 取代 export default
export const proxy = intlMiddleware;
 
export const config = {
  matcher: ['/', '/(zh|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
};