import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { TrickPlayer } from '@/components/tricks/trick-player' // 引入你現有的播放器組件

// Next.js 15+ params 必須是 Promise
type Props = {
  params: Promise<{ locale: string; shareId: string }>
}

// 1. 動態生成 Meta Tags (給 IG, LINE 預覽用)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, shareId } = await params
  
  // 這裡假設你在 messages/zh.json 裡有設定 Share namespace，沒有的話可以先用字串替代
  const t = await getTranslations({ locale, namespace: 'Share' })

  // 使用 Admin Client 繞過 RLS 撈取資料
  const { data: trick } = await supabaseAdmin
    .from('tricks')
    .select('*')
    .eq('share_id', shareId)
    .single()

  if (!trick) {
    return { title: t('notFound', { fallback: '找不到該招式' }) }
  }

  // 從 YouTube 網址萃取 Video ID 來當縮圖
  const videoIdMatch = trick.video_url?.match(/(?:v=|youtu\.be\/)([^&]+)/)
  const videoId = videoIdMatch ? videoIdMatch[1] : null
  const ogImageUrl = videoId 
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` 
    : '/og-image.png'

  const title = `${trick.name} | Gratry Snow`
  // 假設你的私密筆記欄位叫 private_note，可依據你的 DB schema 調整
  const description = trick.private_note || t('defaultDescription', { fallback: '來看看我練習的新招式！' }) 

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1280,
          height: 720,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  }
}

// 2. 伺服器渲染頁面 (SSR)
export default async function SharePage({ params }: Props) {
  const { shareId } = await params

  // 在 Server Component 抓資料
  const { data: trick } = await supabaseAdmin
    .from('tricks')
    .select('*')
    .eq('share_id', shareId)
    .single()

  if (!trick) {
    notFound()
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6 space-y-2">
        <h1 className="text-3xl font-bold">{trick.name}</h1>
        {trick.private_note && (
          <p className="text-muted-foreground bg-muted/50 p-4 rounded-md">
            {trick.private_note}
          </p>
        )}
      </div>
      
      {/* 延用你原本做好的 TrickPlayer */}
      {trick.video_url && (
        <div className="rounded-lg overflow-hidden border bg-card text-card-foreground shadow-sm">
           <TrickPlayer videoId={trick.video_id} />
        </div>
      )}
    </div>
  )
}