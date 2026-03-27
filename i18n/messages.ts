const translations = {
  description: { 
    en: 'My exclusive snowboard ground tricks notes and video library', 
    zh: '我的專屬滑雪平花筆記與影片庫' 
  },
  upload_trick: {
    en: 'Upload Trick',
    zh: '上傳動作'
  },
  log_in: {
    en: 'Log In',
    zh: '登入'
  },
  log_out: {
    en: 'Log Out',
    zh: '登出'
  },
  sign_in_google: {
    en: 'Sign in with Google',
    zh: '使用 Google 登入'
  },
  light_mode: {
    en: 'Light',
    zh: '淺色模式'
  },
  dark_mode: {
    en: 'Dark',
    zh: '深色模式'
  },
  system_mode: {
    en: 'System',
    zh: '系統設定'
  },
  toggle_theme: {
    en: 'Toggle theme',
    zh: '切換主題'
  }
};

export type Locale = 'en' | 'zh';

export const getMessages = (locale: Locale) => {
  return Object.fromEntries(
    Object.entries(translations).map(([key, value]) => [key, value[locale]])
  );
};