import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'zh'],
  defaultLocale: 'en'
});

// 產生我們專屬的導覽 API，這些 API 都會自動處理 locale
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);