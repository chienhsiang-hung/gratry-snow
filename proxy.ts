import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    '/',
    '/(zh|en)/:path*',
    // 加上 api，避免 API 路由被當成頁面加上語系前綴！
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};