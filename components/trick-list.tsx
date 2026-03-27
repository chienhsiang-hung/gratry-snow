'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Lock, Globe, Play, Loader2, Calendar, X, Edit } from 'lucide-react'
import { TrickPlayer } from './trick-player'
import { useTranslations } from "next-intl"
import { Button } from '@/components/ui/button'

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
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    async function fetchTricks() {
      // 1. 先取得當前登入的使用者
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)

      // 2. 取得招式列表
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

  const handleTrickUpdated = (updatedTrick: Trick) => {
    setTricks((prev) => 
      prev.map((t) => (t.id === updatedTrick.id ? updatedTrick : t))
    )
  }

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
        <TrickCard 
          key={trick.id} 
          trick={trick} 
          currentUser={currentUser} 
          onUpdate={handleTrickUpdated} 
        />      
      ))}
    </div>
  )
}

function TrickCard({
  trick, currentUser, onUpdate 
}: {
  trick: Trick; currentUser: any; onUpdate: (trick: Trick) => void
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const t = useTranslations();

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    name: trick.name,
    description: trick.description || '',
    privacy: trick.privacy,
  })

  const isOwner = currentUser?.id === trick.user_id

  const handleSave = async () => {
    if (!editForm.name.trim()) return

    setIsSaving(true)
    const { data, error } = await supabase
      .from('tricks')
      .update({
        name: editForm.name,
        description: editForm.description,
        privacy: editForm.privacy,
      })
      .eq('id', trick.id)
      .select()
      .single()
  
    if (error) {
      console.error('更新失敗:', error)
      alert('更新失敗，請稍後再試')
    } else if (data) {
      onUpdate(data) // 通知父元件更新列表
      setIsEditing(false) // 關閉編輯彈窗
    }
    setIsSaving(false)
  }

  // 當開啟劇院模式時，禁止背景滾動 (優化手機體驗)
  useEffect(() => {
    if (isPlaying || isEditing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isPlaying, isEditing]);

  return (
    <>
      {/* 這是原本的卡片 (永遠只顯示縮圖與資訊) */}
      <div className="group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <div className="relative h-full w-full cursor-pointer" onClick={() => setIsPlaying(true)}>
            <img 
              src={`https://img.youtube.com/vi/${trick.video_id}/hqdefault.jpg`} 
              alt={trick.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/30">
              <div className="rounded-full bg-background/90 p-4 text-foreground shadow-lg backdrop-blur-sm transition-transform group-hover:scale-110">
                <Play className="h-6 w-6 ml-1" />
              </div>
            </div>
            <div className="absolute right-3 top-3 rounded-md bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur-md">
              {trick.privacy === 'private' ? (
                <span className="flex items-center gap-1.5 text-muted-foreground"><Lock className="h-3.5 w-3.5" /> {t('private')}</span>
              ) : (
                <span className="flex items-center gap-1.5 text-primary"><Globe className="h-3.5 w-3.5" /> {t('public')}</span>
              )}
            </div>
          </div>
        </div>

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

          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-bold tracking-tight">{trick.name}</h3>
              {isOwner && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="mt-1 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  title="修改招式"
                >
                  <Edit className="h-4 w-4" />
                </button>
              )}
            </div>
            {trick.description && (
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground whitespace-pre-wrap">
                {trick.description}
              </p>
            )}
          </div>
        </div>

      {/* 🚀 魔法在這裡：全螢幕劇院模式 (Lightbox) */}
      {isPlaying && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 px-4 backdrop-blur-sm sm:px-12 md:px-24">
          
          {/* 右上角關閉按鈕 */}
          <button 
            onClick={() => setIsPlaying(false)}
            className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/25 sm:right-8 sm:top-8"
          >
            <X className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>

          {/* 放大版的播放器容器 */}
          <div className="w-full max-w-5xl animate-in fade-in zoom-in-95 duration-200">
            {/* 招式名稱顯示在播放器上方，方便知道在看什麼 */}
            <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">{trick.name}</h2>
            <TrickPlayer videoId={trick.video_id} />
            {trick.description && (
              <p className="mt-4 text-sm text-white/80 whitespace-pre-wrap max-w-3xl">
                {trick.description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ✏️ [新增] 修改招式 Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-xl border bg-card p-6 text-card-foreground shadow-lg animate-in zoom-in-95 duration-200">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">修改招式資訊</h2>
              <button onClick={() => setIsEditing(false)} className="rounded-full p-1 hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">招式名稱</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">權限設定</label>
                <select
                  value={editForm.privacy}
                  onChange={(e) => setEditForm({...editForm, privacy: e.target.value as 'public' | 'private'})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="public">公開 (所有人可見)</option>
                  <option value="private">私人 (僅自己可見)</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">招式筆記 / 描述</label>
                <textarea
                  rows={4}
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  placeholder="寫下練習的心得或重點..."
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                  取消
                </Button>
                <Button onClick={handleSave} disabled={isSaving || !editForm.name.trim()}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isSaving ? '儲存中...' : '儲存修改'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}