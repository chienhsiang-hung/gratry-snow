const translations = {
  // =================================================================
  // Metadata & SEO
  // =================================================================
  metadata_title: {
    en: 'Gratry Snow | Snowboard Ground Trick Library',
    zh: 'Gratry Snow | 平地花式滑雪招式與筆記庫'
  },
  metadata_desc: {
    en: 'Your ultimate snowboard ground tricks library and notes. Upload, mute, and organize your Gratry practice videos.',
    zh: '你的專屬滑雪平花影片與筆記庫。支援前端影片靜音、上傳並整理你的滑雪練習紀錄。'
  },
  description: {
    en: 'My exclusive snowboard ground tricks notes and video library',
    zh: '我的專屬滑雪平花筆記與影片庫'
  },

  // =================================================================
  // Navigation & General UI
  // =================================================================
  home: {
    en: 'Home',
    zh: '首頁'
  },
  profile: { en: 'Profile', zh: '個人資料' },
  tricks: { en: 'Tricks', zh: '收藏招式' },
  issues: { en: 'Report Issue', zh: '問題回報' },
  discussions: { en: 'Discussions', zh: '討論區' },
  privacy: { en: 'Privacy Policy', zh: '隱私政策' },
  terms: { en: 'Terms of Service', zh: '服務條款' },

  // =================================================================
  // Common Actions & Labels
  // =================================================================
  loading: { en: 'Loading...', zh: '載入中...' },
  saving: { en: 'Saving...', zh: '儲存中...' },
  cancel: { en: 'Cancel', zh: '取消' },
  save: { en: 'Save', zh: '儲存' },
  save_changes: { en: 'Save Changes', zh: '儲存修改' },
  completed: {
    en: 'Completed',
    zh: '完成'
  },
  private: { en: 'Private', zh: '私人' },
  public: { en: 'Public', zh: '公開' },
  all_categories: { en: 'All', zh: '全部' },
  category: { en: 'Category', zh: '招式類別' },
  speed: { en: 'Speed', zh: '速度' },
  status: { en: 'Status', zh: '狀態' },
  active: { en: 'Active', zh: '活躍' },

  // =================================================================
  // Authentication
  // =================================================================
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
  require_login: { en: 'Please Log In', zh: '請先登入' },
  require_login_desc: { en: 'You need to log in to upload tricks.', zh: '您需要登入帳號才能上傳動作' },
  auth_expired: {
    en: 'Google Authorization Expired',
    zh: 'Google 授權已過期'
  },
  auth_expired_desc: {
    en: 'Please log in again to grant YouTube upload permissions.',
    zh: '請重新登入以獲取 YouTube 上傳權限。'
  },
  relogin: {
    en: 'Log in again',
    zh: '重新登入'
  },
  provider: { en: 'Provider', zh: '登入方式' },

  // =================================================================
  // Theme Toggle
  // =================================================================
  toggle_theme: {
    en: 'Toggle theme',
    zh: '切換主題'
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

  // =================================================================
  // Upload Flow
  // =================================================================
  // --- Form ---
  upload_trick: {
    en: 'Upload Trick',
    zh: '上傳動作'
  },
  upload_title: { en: 'Upload Trick Video', zh: '上傳招式影片' },
  upload_subtitle: { en: 'Upload video to YouTube and add it to Gratry Snow library.', zh: '將影片直接上傳至你的 YouTube 頻道，並收錄到 Gratry Snow 招式庫中。' },
  click_to_upload: { en: 'Click to select video', zh: '點擊選擇影片' },
  support_formats: { en: 'Supports MP4, WebM', zh: '支援 MP4, WebM 等常見格式' },
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
  submit_upload: { en: 'Confirm & Upload', zh: '確認並上傳' },
  error_missing_fields: {
    en: 'Please fill in required fields and select a video!',
    zh: '請填寫必填欄位並選擇影片！'
  },
  // --- Upload Modes & IG ---
  mode_file: { en: 'Upload File (YouTube)', zh: '上傳檔案 (YouTube)' },
  mode_url: { en: 'Paste Link (Instagram)', zh: '貼上連結 (Instagram)' },
  ig_link_label: { en: 'Instagram Link', zh: 'Instagram 連結' },
  ig_url_placeholder: { en: 'e.g. https://www.instagram.com/reel/C4x...', zh: '例如: https://www.instagram.com/reel/C4x...' },
  ig_preview_confirm: { en: 'Video Preview', zh: '影片預覽確認' },
  error_invalid_ig_url: { en: 'Please enter a valid Instagram Reels or post link.', zh: '請輸入正確的 Instagram Reels 或貼文連結' },
  ig_upload_success_desc: { en: 'Trick successfully saved to your progress!', zh: '招式已成功儲存至你的進度中！' },
  ig_story_recorded: { en: 'Story/Highlight Recorded', zh: '限時 / 精選動態已記錄' },
  ig_story_no_preview: { en: 'Instagram does not support previews for stories, but the link can still be saved.', zh: 'IG 官方不開放限時動態預覽，但連結仍可正常儲存。' },
  // --- Progress ---
  uploading: { en: 'Uploading to YouTube...', zh: '正在上傳至 YouTube...' },
  processing_video: { en: 'Processing video...', zh: '影片靜音處理中...' },
  uploading_to_youtube: {
    en: 'Uploading to YouTube...',
    zh: '上傳至 YouTube 中...'
  },
  processing_progress: {
    en: 'Muting video {progress}%',
    zh: '影片靜音處理中 {progress}%'
  },
  step_processing: {
    en: 'Processing Video...',
    zh: '處理影片中...'
  },
  step_uploading: {
    en: 'Uploading to YouTube...',
    zh: '上傳至 YouTube...'
  },
  step_saving: {
    en: 'Saving Data...',
    zh: '儲存資料中...'
  },
  do_not_close: {
    en: 'Please do not close this window, it may take a few minutes.',
    zh: '請勿關閉視窗，這可能需要幾分鐘的時間'
  },
  frontend_muting: {
    en: 'Frontend Muting',
    zh: '前端靜音處理'
  },
  saving_to_library: {
    en: 'Saving to Library',
    zh: '儲存至招式庫'
  },
  upload_notice_title: {
    en: 'Upload Privacy Notice',
    zh: '上傳隱私說明'
  },
  upload_notice_desc: {
    en: 'Your video will be uploaded to your connected YouTube account and set as "Unlisted".',
    zh: '您的影片將會上傳至您綁定的 YouTube 帳號，並設定為「不公開 (Unlisted)」。'
  },

  // --- Result ---
  upload_success: {
    en: '🎉 Trick uploaded successfully!',
    zh: '🎉 招式收錄成功！'
  },
  youtube_processing_desc: {
    en: 'Video submitted. YouTube is processing the high-quality version, it may take a few minutes to be playable on the site.',
    zh: '影片已送出。YouTube 目前正在處理影片畫質，可能需要幾分鐘後才能在網站上正常播放。'
  },
  back_to_home: {
    en: 'Back to Home',
    zh: '回首頁'
  },
  upload_another: {
    en: 'Upload Another',
    zh: '繼續上傳下一個'
  },

  // =================================================================
  // Trick List & Details
  // =================================================================
  // --- List & Filtering ---
  search_placeholder: { en: 'Search trick name...', zh: '搜尋招式名稱...' },
  no_tricks: { en: 'No tricks found yet.', zh: '目前還沒有收錄任何招式' },
  no_tricks_in_category: { en: 'No tricks in this category yet', zh: '此分類目前還沒有招式' },
  no_tricks_found: { en: 'No tricks match your search', zh: '找不到符合名稱的招式' },
  be_first: { en: 'Click "Add Trick" at the top right to be the first to upload!', zh: '趕快點擊右上角的新增招式，成為第一個上傳的人吧！' },

  // --- Details & Editing ---
  edit_tooltip: { en: 'Edit trick', zh: '修改招式' },
  edit_title: { en: 'Edit Trick Information', zh: '修改招式資訊' },
  edit_note: { en: 'Edit Note', zh: '編輯筆記' },
  privacy_setting: { en: 'Privacy Setting', zh: '權限設定' },
  public_visibility: { en: 'Public (Visible to everyone)', zh: '公開 (所有人可見)' },
  private_visibility: { en: 'Private (Only visible to you)', zh: '私人 (僅自己可見)' },
  trick_notes: { en: 'Notes / Description', zh: '招式筆記 / 描述' },
  notes_placeholder: { en: 'Write down your practice notes or tips...', zh: '寫下練習的心得或重點...' },
  director_notes: {
    en: "Notes",
    zh: '筆記'
  },
  update_failed: { en: 'Failed to update. Please try again later.', zh: '更新失敗，請稍後再試' },
  update_failed_restore: {
    en: 'Update failed, data restored. Please try again later.',
    zh: '更新失敗，已還原資料，請稍後再試。'
  },
  update_success: {
    en: 'Update successful!',
    zh: '更新成功！'
  },
  uploaded_by: { en: 'Uploaded by', zh: '上傳者' },

  // --- Player ---
  unmute: { en: 'Unmute', zh: '取消靜音' },
  mute: { en: 'Mute', zh: '靜音' },
  regular_stance: { en: 'Regular', zh: 'Regular 視角' },
  goofy_stance: { en: 'Goofy', zh: 'Goofy 視角' },
  view_on_ig: { en: 'View on Instagram', zh: '前往 Instagram 觀看' },

  // =================================================================
  // Profile
  // =================================================================
  avatar: { en: 'Avatar', zh: '大頭貼' },
  default_name: { en: 'Snowboarder', zh: '滑雪者' },
  link_instagram: { en: 'Connect Instagram', zh: '連結 Instagram' },
  link_instagram_placeholder: { en: 'e.g. hung_chienhsiang', zh: '例如: hung_chienhsiang' },

  // =================================================================
  // Sharing
  // =================================================================
  share: { en: 'Share', zh: '分享' },
  copied: { en: 'Copied!', zh: '已複製！' },
  share_link_copied: { en: 'Share link copied to clipboard!', zh: '專屬分享連結已複製到剪貼簿！' },
  share_error: { en: 'Failed to generate share link. Please try again.', zh: '產生分享連結失敗，請稍後再試。' },
  share_native_title: {
    en: 'Check out my trick! | Gratry Snow',
    zh: '看看我的滑雪新招！ | Gratry Snow'
  },
  not_found_title: {
    en: 'Page Not Found | Gratry Snow',
    zh: '找不到頁面 | Gratry Snow'
  },
  default_trick_name: {
    en: 'Untitled Trick',
    zh: '未命名招式'
  },
  private_share_notice: {
    en: 'This is a private link shared with you. 🏂',
    zh: '這是一個專屬的私人分享連結 🏂'
  },

  // --- Skill Tree ---
  skill_tree: { en: 'Skill Tree', zh: '技能樹' },
  skill_tree_desc: { en: 'Visualize your progress and build your own combo paths.', zh: '視覺化你的練習進度，並建立專屬的連招路線。' },
  node_public: { en: 'Public', zh: '公開' },
  node_private: { en: 'Private', zh: '私人' },
  node_favorite: { en: 'Favorite', zh: '收藏' },

  // =================================================================
  // Skill Tree Groups (技能樹分類)
  // =================================================================
  group_foundation: { en: 'Foundation', zh: '基礎地基 (Foundation)' },
  group_press: { en: 'Press', zh: '壓板平衡 (Press)' },
  group_180: { en: '180s & Pivots', zh: '入門旋轉 (180 & Pivot)' },
  group_press_spin: { en: 'Press Spin', zh: '乘載旋轉 (Press Spin)' },
  group_compass: { en: 'Compass & Tripod', zh: '圓規與三腳架 (Compass)' },
  group_classic: { en: 'Classic Buttering', zh: '經典平花 (Classic)' },
  group_advanced: { en: 'Advanced Combos', zh: '高階複合招式 (Advanced)' },
  group_spin: { en: 'High Spins', zh: '空中與高旋轉 (High Spins)' },

  // =================================================================
  // Tricks Dictionary (招式名稱字典)
  // =================================================================
  trick_switch: { en: 'Switch Riding', zh: '反腳滑行 (Switch)' },
  trick_hop: { en: 'Hop', zh: '原地跳躍 (Hop)' },
  trick_ollie: { en: 'Ollie', zh: '豚跳 (Ollie)' },
  trick_nollie: { en: 'Nollie', zh: '反豚跳 (Nollie)' },
  
  trick_fnp: { en: 'FS Nose Press', zh: '前刃壓板頭 (FS Nose)' },
  trick_bnp: { en: 'BS Nose Press', zh: '後刃壓板頭 (BS Nose)' },
  trick_ftp: { en: 'FS Tail Press', zh: '前刃壓板尾 (FS Tail)' },
  trick_btp: { en: 'BS Tail Press', zh: '後刃壓板尾 (BS Tail)' },
  
  trick_fs180: { en: 'FS 180', zh: '內轉 180 (FS 180)' },
  trick_bs180: { en: 'BS 180', zh: '外轉 180 (BS 180)' },
  trick_pivot: { en: 'Pivot', zh: '板心旋轉 (Pivot)' },
  trick_revert: { en: 'Revert', zh: '回轉 (Revert)' },
  
  trick_fnps: { en: 'FS Nose Spin', zh: '前刃板頭轉 (FNPS)' },
  trick_bnps: { en: 'BS Nose Spin', zh: '後刃板頭轉 (BNPS)' },
  trick_ftps: { en: 'FS Tail Spin', zh: '前刃板尾轉 (FTPS)' },
  trick_btps: { en: 'BS Tail Spin', zh: '後刃板尾轉 (BTPS)' },

  trick_fnc: { en: 'FS Nose Compass', zh: '前刃板頭圓規 (FNC)' },
  trick_bnc: { en: 'BS Nose Compass', zh: '後刃板頭圓規 (BNC)' },
  trick_ftc: { en: 'FS Tail Compass', zh: '前刃板尾圓規 (FTC)' },
  trick_tripod: { en: 'Tripod', zh: '三腳架 (Tripod)' },
  
  trick_mfm: { en: 'MFM Butter', zh: 'MFM 平花' },
  trick_sone: { en: 'Sone', zh: 'ソネ (Sone)' },
  trick_ds: { en: 'Drive Spin', zh: '驅動旋轉 (Drive Spin)' },
  trick_shifty: { en: 'Shifty', zh: '空中扭腰 (Shifty)' },
  
  trick_owen: { en: 'Owen', zh: '歐文 (Owen)' },
  trick_andy: { en: 'Andy', zh: '安迪 (Andy)' },
  trick_kamikaze: { en: 'Kamikaze', zh: '神風 (Kamikaze)' },
  trick_rewind: { en: 'Rewind', zh: '倒帶/反拉 (Rewind)' },
  trick_bside: { en: 'B-Side Spins', zh: '背面/反刃起跳 (B-side)' },
};

export type Locale = 'en' | 'zh';

export const getMessages = (locale: Locale) => {
  return Object.fromEntries(
    Object.entries(translations).map(([key, value]) => [key, value[locale]])
  );
};
