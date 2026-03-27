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
  },
  upload_title: { en: 'Upload Trick Video', zh: '上傳招式影片' },
  upload_subtitle: { en: 'Upload video to YouTube and add it to Gratry Snow library.', zh: '將影片直接上傳至你的 YouTube 頻道，並收錄到 Gratry Snow 招式庫中。' },
  click_to_upload: { en: 'Click to select video', zh: '點擊選擇影片' },
  support_formats: { en: 'Supports MP4, WebM', zh: '支援 MP4, WebM 等常見格式' },
  category: { en: 'Category', zh: '招式類別' },
  select_category: { en: 'Select category...', zh: '選擇類別...' },
  trick_name: { en: 'Trick Name', zh: '招式名稱' },
  trick_name_placeholder: { en: 'e.g. Nollie 360', zh: '例如: Nollie 360' },
  privacy_settings: { en: 'Privacy Settings', zh: '影片隱私設定 (收錄方式)' },
  private_note: { en: 'Private Note', zh: '私人筆記' },
  private_desc: { en: 'For your eyes only', zh: '收錄為私人用途，僅限自己觀看' },
  public_share: { en: 'Public Share', zh: '公開分享' },
  public_desc: { en: 'Publish to library', zh: '發佈至公共招式庫，可被評分與留言' },
  youtube_optional: { en: 'YouTube Video Info (Optional)', zh: 'YouTube 影片資訊 (選填)' },
  video_title: { en: 'Video Title', zh: '影片標題 (若留空將預設為招式名稱)' },
  video_desc: { en: 'Description...', zh: '在此記錄發力點、重心位置，這段文字也會同步為 YouTube 影片說明...' },
  uploading: { en: 'Uploading to YouTube...', zh: '正在上傳至 YouTube...' },
  submit_upload: { en: 'Confirm & Upload', zh: '確認並上傳' }
};

export type Locale = 'en' | 'zh';

export const getMessages = (locale: Locale) => {
  return Object.fromEntries(
    Object.entries(translations).map(([key, value]) => [key, value[locale]])
  );
};