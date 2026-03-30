'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { v4 as uuidv4 } from 'uuid'

export async function generateShareLink(trickId: string, currentPath: string) {
  const supabase = await createClient()
  
  // 1. 確認當前使用者
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // 2. 產生 UUID
  const newShareId = uuidv4()

  // 3. 更新資料庫 (因為使用一般的 client，這會受到 RLS 保護，只有作者能更新自己的 trick)
  const { error } = await supabase
    .from('tricks')
    .update({ share_id: newShareId })
    .eq('id', trickId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error generating share link:', error)
    return { success: false, error: 'Failed to generate link' }
  }

  // 4. 清除快取，讓畫面的分享圖示更新
  revalidatePath(currentPath)

  return { success: true, shareId: newShareId }
}