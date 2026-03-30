'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { v4 as uuidv4 } from 'uuid'

export async function generateShareLink(trickId: string) {
  const supabase = await createClient()
  
  // 1. 確認當前使用者
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  // 2. 產生 UUID
  const newShareId = uuidv4()

  // 3. 更新資料庫並回傳更新後的完整 Trick 資料
  const { data, error } = await supabase
    .from('tricks')
    .update({ share_id: newShareId })
    .eq('id', trickId)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error generating share link:', error)
    return { success: false, error: 'Failed to generate link' }
  }

  // 將新的資料回傳給前端，讓前端可以利用現有的 onUpdate 刷新畫面
  return { success: true, trick: data }
}