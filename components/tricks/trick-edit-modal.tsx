'use client'

import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslations } from "next-intl"
import { supabase } from '@/lib/supabase/supabase'
import type { Trick } from './trick-list'

export function TrickEditModal({ trick, onClose, onUpdate }: { trick: Trick; onClose: () => void; onUpdate: (trick: Trick) => void }) {
  const [isSaving, setIsSaving] = useState(false)
  const t = useTranslations()

  const [editForm, setEditForm] = useState({
    name: trick.name,
    category: trick.category,
    description: trick.description || '',
    privacy: trick.privacy,
  })

  // 當開啟 Modal 時，禁止背景滾動
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'unset' }
  }, [])

  const handleSave = async () => {
    if (!editForm.name.trim()) return

    const previousTrick = { ...trick }
    const optimisticTrick = {
      ...trick,
      name: editForm.name,
      category: editForm.category,
      description: editForm.description,
      privacy: editForm.privacy,
    }

    setIsSaving(true)
    onUpdate(optimisticTrick)
    onClose() // 立刻關閉 Modal，體驗更順暢

    const { error } = await supabase
      .from('tricks')
      .update({
        name: editForm.name,
        category: editForm.category,
        description: editForm.description,
        privacy: editForm.privacy,
      })
      .eq('id', trick.id)

    setIsSaving(false)

    if (error) {
      console.error('更新失敗:', error)
      onUpdate(previousTrick) 
      alert(t('update_failed_restore'))
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 text-card-foreground shadow-lg animate-in zoom-in-95 duration-200">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">{t('edit_title')}</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-muted">
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
              <SelectContent className="z-[70]">
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
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
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
  )
}