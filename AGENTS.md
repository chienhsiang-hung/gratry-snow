<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Gratry Snow 專案開發指南 (For AI Agents)

## 1. 核心技術棧 (Tech Stack)
- **框架:** Next.js (App Router)
- **資料庫/Auth:** Supabase
- **多國語系:** `next-intl`
- **樣式與 UI:** Tailwind CSS, `shadcn/ui`, `lucide-react` (Icons)
- **影片處理:** `@ffmpeg/ffmpeg` (WASM 前端處理影片靜音) + YouTube Data API V3

## 2. i18n 多國語系嚴格規範 (Critical)
- **絕對禁止**在 Component 中寫死中文或英文靜態字串 (Hardcoded strings)。
- 所有的文字都必須透過 `const t = useTranslations()` 獲取。
- 翻譯結構存放在 TypeScript 字典中，格式為 `{ key: { en: '...', zh: '...' } }`。
- 如果開發新功能需要新文字，請自行發想合適的 Key 並在程式碼實作時提醒開發者將這些 Keys 補入字典。
- 專案內部頁面切換一律使用 `import { Link } from '@/i18n/routing'` 而非 `next/link`。

## 3. 架構與重構原則
- **元件瘦身 (Component Size):** 避免讓單一 Component 累積過多行數。如果有複雜的狀態機 (例如：表單、處理中、成功等 UI 切換)，請優先拆分成 Sub-components。
- **邏輯抽離:** 第三方 API (如 YouTube、Instagram 邏輯) 或 FFmpeg 轉檔邏輯，若過於龐大，請盡量封裝為 Custom Hooks (例如 `useVideoProcessor`) 或 utility functions。
- **樣式控制:** 盡量使用 Tailwind 原生 class，需要條件組合時請使用 `@/lib/utils` 的 `cn()` 函式。

## 4. 資料庫概念 (Supabase)
- **Tricks Table:** 負責記錄使用者的招式。核心欄位包含 `user_id`, `video_id` (存放 YT ID 或 IG URL), `video_type` ('youtube' | 'instagram'), `category`, `name`, `privacy` ('public' | 'private')。