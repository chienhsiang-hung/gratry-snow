import { getRequestConfig } from 'next-intl/server';
import { getMessages, type Locale } from './messages';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  
  // 確保 locale 是我們支援的語言，否則預設為 zh
  if (!locale || !['en', 'zh'].includes(locale)) {
    locale = 'zh';
  }
  
  return {
    locale,
    messages: getMessages(locale as Locale)
  };
});