'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Lock, Globe, Play, Loader2, Calendar, X, Edit } from 'lucide-react'
import { TrickPlayer } from './trick-player'
import { useTranslations } from "next-intl"
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const t = useTranslations()

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

    // 2. 監聽登入/登出事件，一有變動就重新抓取資料更新畫面
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null)
      fetchTricks() 
    })

    return () => subscription.unsubscribe()
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
      <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-muted-foreground/25 bg-muted/10 py-32 px-6 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Play className="h-8 w-8 ml-1 opacity-80" />
        </div>
        <p className="text-xl font-semibold text-foreground mb-2">{t('no_tricks')}</p>
        <p className="max-w-[300px] text-sm text-muted-foreground sm:max-w-none">
          {t('be_first')}
        </p>
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
          t={t}
        />      
      ))}
    </div>
  )
}

function TrickCard({
  trick, currentUser, onUpdate, t
}: {
  trick: Trick; currentUser: any; onUpdate: (trick: Trick) => void; t: any
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // ▼▼▼ 新增：專門給劇院模式快速編輯筆記用的 State ▼▼▼
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [tempNote, setTempNote] = useState(trick.description || '')
  const [isSavingNote, setIsSavingNote] = useState(false)

  const [editForm, setEditForm] = useState({
    name: trick.name,
    category: trick.category,
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
        category: editForm.category,
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

  // ▼▼▼ 新增：專門儲存劇院模式筆記的 Function ▼▼▼
  const handleSaveNote = async () => {
    setIsSavingNote(true)
    const { data, error } = await supabase
      .from('tricks')
      .update({ description: tempNote })
      .eq('id', trick.id)
      .select()
      .single()

    if (error) {
      console.error('更新筆記失敗:', error)
      alert(t('update_failed'))
    } else if (data) {
      onUpdate(data) 
      setIsEditingNote(false)
      // 同步更新主表單的內容，確保兩邊資料一致
      setEditForm(prev => ({ ...prev, description: tempNote }))
    }
    setIsSavingNote(false)
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
      <div className="group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-primary/30 animate-in fade-in zoom-in-95">
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

      {/* 🚀 升級版：全螢幕劇院模式 (Lightbox) */}
      {isPlaying && (
        <div
          className="dark fixed inset-0 z-100 flex flex-col items-center justify-start bg-black/80 px-4 backdrop-blur-xl sm:px-12 md:px-24 overflow-y-auto pt-16 pb-12 animate-in fade-in duration-300 ease-out"
          onClick={() => setIsPlaying(false)}
        >
          {/* 背景的微弱光暈，增加空間感 */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
          
          {/* 右上角關閉按鈕：加上群組 hover 旋轉與放大動畫 */}
          <button 
            onClick={() => {
              setIsPlaying(false);
              setIsEditingNote(false);
            }}
            className="group fixed right-4 top-4 z-50 rounded-full bg-white/10 p-2 sm:p-3 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:scale-110 sm:right-8 sm:top-8 border border-white/5"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:rotate-90" />
          </button>

          {/* 放大版的播放器容器 */}
          <div
            className="relative w-full max-w-5xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-6 text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
              {trick.name}
            </h2>
            
            <TrickPlayer videoId={trick.video_id} />

            {/* 筆記區塊升級 */}
            <div className="mt-8 w-full">
              {isEditingNote ? (
                <div className="rounded-2xl bg-black/40 p-5 border border-white/10 shadow-2xl backdrop-blur-md animate-in slide-in-from-top-2 duration-300">
                  <textarea
                    className="w-full bg-white/5 text-white rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none placeholder:text-white/30 border border-white/5"
                    rows={4}
                    value={tempNote}
                    onChange={(e) => setTempNote(e.target.value)}
                    placeholder={t('notes_placeholder')}
                    autoFocus
                  />
                  <div className="flex justify-end gap-3 mt-4">
                    <Button 
                      variant="ghost" 
                      className="text-white/70 hover:bg-white/10 hover:text-white rounded-full" 
                      onClick={() => { setIsEditingNote(false); setTempNote(trick.description || ''); }} 
                      disabled={isSavingNote}
                    >
                      {t('cancel')}
                    </Button>
                    <Button
                      className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all hover:shadow-[0_0_20px_rgba(var(--primary),0.6)]" 
                      onClick={handleSaveNote} 
                      disabled={isSavingNote}
                    >
                      {isSavingNote ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      {t('save')}
                    </Button>
                  </div>
                </div>
              ) : (
                (trick.description || isOwner) && (
                  <div className="group relative rounded-2xl bg-white/5 p-6 border border-white/5 shadow-xl transition-all duration-300 hover:bg-white/10 hover:border-white/10 backdrop-blur-sm">
                    {isOwner && (
                      <button 
                        onClick={() => { setTempNote(trick.description || ''); setIsEditingNote(true); }}
                        className="absolute right-4 top-4 rounded-full p-2 text-white/40 md:opacity-0 transition-all hover:bg-primary/20 hover:text-primary group-hover:opacity-100"
                        title={t('edit_note')}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}

                    {trick.description ? (
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">Director's Notes</h4>
                        <p className="text-sm md:text-base text-white/90 whitespace-pre-wrap leading-relaxed pr-8 font-light">
                          {trick.description}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm italic text-white/40 cursor-pointer pr-8 hover:text-white/60 transition-colors" onClick={() => setIsEditingNote(true)}>
                        + {t('notes_placeholder')} ({t('edit_note')})
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* ✏️ 修改招式 Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-xl border bg-card p-6 text-card-foreground shadow-lg animate-in zoom-in-95 duration-200">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">{t('edit_title')}</h2>
              <button onClick={() => setIsEditing(false)} className="rounded-full p-1 hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">{t('trick_name')}</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">{t('category')}</label>
                <Select
                  value={editForm.category} 
                  onValueChange={(val) => setEditForm({...editForm, category: val})}
                >
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder={t('select_category')} />
                  </SelectTrigger>
                  <SelectContent className="z-[70]">
                    <SelectItem value="Riding">Riding</SelectItem>
                    <SelectItem value="Carving">Carving</SelectItem>
                    <SelectItem value="Style">Style</SelectItem>
                    <SelectItem value="GroundTrick">GroundTrick</SelectItem>
                    <SelectItem value="Jump">Jump</SelectItem>
                    <SelectItem value="Lock">Lock</SelectItem>
                    <SelectItem value="Flip">Flip</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">{t('privacy_setting')}</label>
                <Select
                  value={editForm.privacy}
                  onValueChange={(val) => setEditForm({...editForm, privacy: val as 'public' | 'private'})}
                >
                  <SelectTrigger className="w-full h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[70]"> {/* 加上 z-[70] 避免被 Modal 擋住 */}
                    <SelectItem value="public">{t('public_visibility')}</SelectItem>
                    <SelectItem value="private">{t('private_visibility')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">{t('trick_notes')}</label>
                <textarea
                  rows={4}
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  placeholder={t('notes_placeholder')}
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                  {t('cancel')}
                </Button>
                <Button onClick={handleSave} disabled={isSaving || !editForm.name.trim()}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isSaving ? t('saving') : t('save_changes')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}