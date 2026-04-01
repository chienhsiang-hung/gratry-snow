import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // next 參數用來記住使用者原本在哪一頁登入的，預設導回首頁
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    // 這裡會將 URL 的 code 轉換為 Session，並安全地寫入 Server Cookie
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 確保 Cookie 寫入後，再重導向回目標頁面
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // 發生錯誤時的 fallback (可以自己決定要導去哪)
  return NextResponse.redirect(`${origin}/`)
}