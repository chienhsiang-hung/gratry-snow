'use client'

import { useState } from 'react'
import { Lock, Globe, Play, Calendar, Edit } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from "next-intl"
import { ShareButton } from "@/components/tricks/share-button"
import { TrickLightbox } from './trick-lightbox'
import { TrickEditModal } from './trick-edit-modal'
import type { Trick } from './trick-list'

export function TrickCard({ trick, currentUser, onUpdate }: { trick: Trick; currentUser: any; onUpdate: (trick: Trick) => void }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  const t = useTranslations()
  const isOwner = currentUser?.id === trick.user_id

  const uploaderProfile = trick.profiles;
  const uploaderAvatar = uploaderProfile?.ig_avatar_url || uploaderProfile?.avatar_url;
  const uploaderName = uploaderProfile?.ig_name || uploaderProfile?.username || 'Unknown Rider';
  const uploaderHandle = uploaderProfile?.ig_handle;

  return (
    <>
      <div className="group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-primary/30 animate-in fade-in zoom-in-95">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <div className="relative h-full w-full cursor-pointer" onClick={() => setIsPlaying(true)}>
            <Image 
              src={`https://img.youtube.com/vi/${trick.video_id}/hqdefault.jpg`} 
              alt={trick.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
          <div className="mb-4 flex items-center gap-3">
            <div className="h-8 w-8 overflow-hidden rounded-full border bg-muted">
              {uploaderAvatar ? (
                <img src={uploaderAvatar} alt={uploaderName} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-bold">
                  {uploaderName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none">{uploaderName}</span>
              {uploaderHandle && (
                <a 
                  href={`https://instagram.com/${uploaderHandle}`} 
                  target="_blank" 
                  className="text-xs text-muted-foreground hover:text-pink-500 transition-colors mt-1"
                >
                  @{uploaderHandle}
                </a>
              )}
            </div>
          </div>
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
              <div className="flex items-center gap-2">
                <ShareButton trickId={trick.id} initialShareId={trick.share_id} />
                <button 
                  onClick={() => setIsEditing(true)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  title={t('edit_tooltip')}
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          {trick.description && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground whitespace-pre-wrap">
              {trick.description}
            </p>
          )}
        </div>
      </div>

      {isPlaying && (
        <TrickLightbox 
          trick={trick} 
          isOwner={isOwner} 
          onClose={() => setIsPlaying(false)} 
          onUpdate={onUpdate} 
        />
      )}

      {isEditing && (
        <TrickEditModal 
          trick={trick} 
          onClose={() => setIsEditing(false)} 
          onUpdate={onUpdate} 
        />
      )}
    </>
  )
}