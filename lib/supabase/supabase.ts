import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 改用 createBrowserClient，它會自動處理 Cookie 同步
export const supabase = createBrowserClient(supabaseUrl, supabaseKey);