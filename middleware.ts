import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing'; // 引入你原本寫好的 routing

export default createMiddleware(routing);

export const config = {
  // 匹配所有非靜態檔案的路徑
  matcher: ['/', '/(zh|en)/:path*']
};