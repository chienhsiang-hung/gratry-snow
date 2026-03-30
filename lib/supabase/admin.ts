import { createClient } from '@supabase/supabase-js'

// ⚠️ 這個 Client 擁有最高權限，絕對不能在 Client Component 中使用
// 只能在 Server Component (如 page.tsx) 或 Server Actions 中呼叫
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 請確保 .env.local 有這把 key
)