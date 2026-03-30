import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
// 🐛 修正 1：你的 TrickPlayer 是具名匯出 (Named Export)，必須加上大括號
import { TrickPlayer } from '@/components/tricks/trick-player' 

type Props = {
  params: Promise<{ locale: string; shareId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, shareId } = await params
  
  const t = await getTranslations({ locale, namespace: 'Share' })

  const { data: trick } = await supabaseAdmin
    .from('tricks')
    .select('*')
    .eq('share_id', shareId)
    .single()

  if (!trick) {
    return { title: t('notFound', { fallback: '找不到該招式' }) }
  }

  // 🐛 修正 2：你的資料庫本來就存了 video_id，不用再用 regex 拆解了！
  const ogImageUrl = trick.video_id 
    ? `https://img.youtube.com/vi/${trick.video_id}/maxresdefault.jpg` 
    : '/og-image.png'

  const title = `${trick.name} | Gratry Snow`
  // 你的資料庫筆記欄位叫做 description，不是 private_note
  const description = trick.description || t('defaultDescription', { fallback: '來看看我練習的新招式！' }) 

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

export default async function SharePage({ params }: Props) {
  const { shareId } = await params

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
        {/* 🐛 修正 3：對應你的欄位名稱 description */}
        {trick.description && (
          <p className="text-muted-foreground bg-muted/50 p-4 rounded-md whitespace-pre-wrap">
            {trick.description}
          </p>
        )}
      </div>
      
      {/* 🐛 修正 4：傳遞給 TrickPlayer 的 prop 應該是 videoId */}
      {trick.video_id && (
        <div className="rounded-lg overflow-hidden border bg-card text-card-foreground shadow-sm">
           <TrickPlayer videoId={trick.video_id} />
        </div>
      )}
    </div>
  )
}