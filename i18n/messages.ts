const translations = {
  title: { 
    en: 'Snowboard Tricks Hub', 
    zh: '滑雪平花技巧庫' 
  },
  description: { 
    en: 'My exclusive snowboard ground tricks notes and video library', 
    zh: '我的專屬滑雪平花筆記與影片庫' 
  }
};

export type Locale = 'en' | 'zh';

export const getMessages = (locale: Locale) => {
  return Object.fromEntries(
    Object.entries(translations).map(([key, value]) => [key, value[locale]])
  );
};