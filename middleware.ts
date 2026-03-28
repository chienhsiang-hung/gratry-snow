import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // 1. 匹配根目錄 (會自動轉導向 /en 或 /zh)
    '/',
    
    // 2. 匹配已經帶有語系的路由 (保留原本的 locale)
    '/(zh|en)/:path*',
    
    // 3. 攔截所有「沒有帶語系」的路由 (例如 /upload -> 自動補上 locale 變成 /en/upload)
    // 這裡的 Regex 語法是：攔截所有路徑，但是「排除」 _next、_vercel 內部系統，以及帶有小數點的靜態檔案 (如 .png, .svg, .ico 等)
    '/((?!_next|_vercel|.*\\..*).*)'
  ]
};