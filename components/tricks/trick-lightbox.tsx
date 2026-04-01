'use client'

import { useState, useEffect } from 'react'
import { X, Edit, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from "next-intl"
import { supabase } from '@/lib/supabase/supabase'
import { TrickPlayer } from './trick-player'
import type { Trick } from './trick-list'
import { toast } from 'sonner'

export function TrickLightbox({ trick, isOwner, onClose, onUpdate }: { trick: Trick; isOwner: boolean; onClose: () => void; onUpdate: (trick: Trick) => void }) {
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [tempNote, setTempNote] = useState(trick.description || '')
  const [isSavingNote, setIsSavingNote] = useState(false)
  const t = useTranslations()

  // 當開啟劇院模式時，禁止背景滾動
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'unset' }
  }, [])

  const handleSaveNote = async () => {
    const previousTrick = { ...trick }
    const optimisticTrick = { ...trick, description: tempNote }

    setIsSavingNote(true)
    onUpdate(optimisticTrick)
    setIsEditingNote(false)

    const { error } = await supabase
      .from('tricks')
      .update({ description: tempNote })
      .eq('id', trick.id)

    setIsSavingNote(false)

    if (error) {
      console.error('更新筆記失敗:', error)
      onUpdate(previousTrick)
      setTempNote(previousTrick.description || '')
      // 🛑 把 alert 換成 toast.error
      toast.error(t('update_failed'))
    } else {
      // ✅ 加上成功的 toast
      toast.success(t('update_success'))
    }
  }

  return (
    <div
      className="dark fixed inset-0 z-100 flex flex-col items-center justify-start bg-black/80 px-4 backdrop-blur-xl sm:px-12 md:px-24 overflow-y-auto overflow-x-hidden pt-16 pb-12 animate-in fade-in duration-300 ease-out "
      onClick={onClose}
    >
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
      
      <button 
        onClick={onClose}
        className="group fixed right-4 top-4 z-50 rounded-full bg-white/10 p-2 sm:p-3 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:scale-110 sm:right-8 sm:top-8 border border-white/5"
      >
        <X className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:rotate-90" />
      </button>

      <div
        className="relative w-full max-w-5xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
          {trick.name}
        </h2>
        
        <TrickPlayer videoId={trick.video_id} />

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
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">{t('director_notes')}</h4>
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
  )
}