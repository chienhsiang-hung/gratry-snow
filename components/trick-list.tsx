// 檔案位置：components/trick-list.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Lock, Globe, Play, Loader2, Calendar } from 'lucide-react'
import { TrickPlayer } from './trick-player'

type Trick = {
  id: string
  created_at: string
  user_id: string
  video_id: string
  category: string
  name: string
  privacy: 'public' | 'private'
  description: string | null
}

export function TrickList() {
  const [tricks, setTricks] = useState<Trick[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTricks() {
      // 因為我們已經在後端設定了 RLS，這裡只需要無腦 select('*')，
      // Supabase 就會自動根據當前的登入狀態，回傳你「有權限看」的資料！
      const { data, error } = await supabase
        .from('tricks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('取得招式失敗:', error)
      } else {
        setTricks(data || [])
      }
      setLoading(false)
    }

    fetchTricks()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
      </div>
    )
  }

  if (tricks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 py-32 text-center">
        <p className="text-lg font-medium text-muted-foreground">目前還沒有收錄任何招式</p>
        <p className="text-sm text-muted-foreground/70">趕快點擊右上角的新增招式，成為第一個上傳的人吧！</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tricks.map((trick) => (
        <TrickCard key={trick.id} trick={trick} />
      ))}
    </div>
  )
}

function TrickCard({ trick }: { trick: Trick }) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
      {isPlaying ? (
        // 播放狀態：讓 TrickPlayer 自由展開，不限制高度
        <div className="w-full bg-muted/20 p-3">
          <TrickPlayer videoId={trick.video_id} />
        </div>
      ) : (
        // 未播放狀態：嚴格套用 16:9 (aspect-video) 顯示精美縮圖
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <div className="relative h-full w-full cursor-pointer" onClick={() => setIsPlaying(true)}>
            {/* 縮圖 */}
            <img 
              src={`https://img.youtube.com/vi/${trick.video_id}/hqdefault.jpg`} 
              alt={trick.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* 播放按鈕遮罩 */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/30">
              <div className="rounded-full bg-background/90 p-4 text-foreground shadow-lg backdrop-blur-sm transition-transform group-hover:scale-110">
                <Play className="h-6 w-6 ml-1" />
              </div>
            </div>
            {/* 右上角隱私標籤 */}
            <div className="absolute right-3 top-3 rounded-md bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur-md">
              {trick.privacy === 'private' ? (
                <span className="flex items-center gap-1.5 text-muted-foreground"><Lock className="h-3.5 w-3.5" /> 私人</span>
              ) : (
                <span className="flex items-center gap-1.5 text-primary"><Globe className="h-3.5 w-3.5" /> 公開</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 資訊區塊保持不變 */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-primary">
            {trick.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(trick.created_at).toLocaleDateString()}
          </span>
        </div>
        <h3 className="text-xl font-bold tracking-tight">{trick.name}</h3>
        {trick.description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {trick.description}
          </p>
        )}
      </div>
    </div>
  )
}