'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/supabase'
import { Play, Search, X } from 'lucide-react'
import { useTranslations } from "next-intl"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { TrickSkeleton } from './trick-skeleton'
import { TrickCard } from './trick-card'

// 匯出型別供其他元件使用
export type Trick = {
  id: string
  created_at: string
  user_id: string
  video_id: string
  category: string
  name: string
  privacy: 'public' | 'private'
  description: string | null
  share_id: string | null
  profiles?: {
    username: string;
    avatar_url: string;
    ig_handle: string | null;
    ig_name: string | null;
    ig_avatar_url: string | null;
  }
}

export function TrickList({ initialTricks }: { initialTricks: Trick[] }) {
  const [tricks, setTricks] = useState<Trick[]>(initialTricks)
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  
  const t = useTranslations()
  const router = useRouter()
  const categories = ['All', 'Riding', 'Carving', 'Style', 'GroundTrick', 'Jump', 'Lock', 'Flip']
  
  const filteredTricks = tricks.filter(trick => {
    const categoryMatch = selectedCategory === 'All' || trick.category === selectedCategory;
    const nameMatch = searchQuery.trim() === '' || 
      trick.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return categoryMatch && nameMatch;
  });

  useEffect(() => {
    setTricks(initialTricks)
    setLoading(false) 
  }, [initialTricks])

  useEffect(() => {
    let currentUserId: string | undefined = undefined;
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      currentUserId = session?.user?.id;
      setCurrentUser(session?.user || null);
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const newUserId = session?.user?.id;
      setCurrentUser(session?.user || null)
      
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        if (currentUserId !== newUserId) {
          currentUserId = newUserId;
          setLoading(true);
          router.refresh();
        }
      }
    })
    
    return () => subscription.unsubscribe()
  }, [router])

  const handleTrickUpdated = (updatedTrick: Trick) => {
    setTricks((prev) => 
      prev.map((t) => (t.id === updatedTrick.id ? updatedTrick : t))
    )
  }

  if (loading) return <TrickSkeleton count={8} />;

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
    <div className="flex w-full flex-col gap-6 md:gap-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-6">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search_placeholder')}
            className="flex h-10 w-full rounded-full border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {searchQuery && (
            <X 
              className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground"
              onClick={() => setSearchQuery('')}
            />
          )}
        </div>

        <div className="flex w-full items-center gap-2 overflow-x-auto pb-2 scrollbar-hide md:overflow-visible md:pb-0 md:justify-end md:flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'secondary'}
              className="rounded-full flex-shrink-0 whitespace-nowrap px-4 py-1 h-8 text-xs md:text-sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'All' ? t('all_categories') : category}
            </Button>
          ))}
        </div>
      </div>

      {tricks.length === 0 && (
        <EmptyState t={t} title={t('no_tricks')} desc={t('be_first')} showPlay />
      )}

      {tricks.length > 0 && filteredTricks.length === 0 && (
        <EmptyState 
          t={t} 
          title={searchQuery.trim() ? t('no_tricks_found') : t('no_tricks_in_category')} 
        />
      )}

      {filteredTricks.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTricks.map((trick) => (
            <TrickCard 
              key={trick.id} 
              trick={trick} 
              currentUser={currentUser} 
              onUpdate={handleTrickUpdated} 
            />      
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyState({ t, title, desc, showPlay }: any) {
  return (
    <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-muted-foreground/25 bg-muted/10 py-24 px-6 text-center animate-in fade-in">
      {showPlay && (
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Play className="h-8 w-8 ml-1 opacity-80" />
        </div>
      )}
      <p className="text-lg font-semibold text-foreground mb-1">{title}</p>
      {desc && <p className="text-sm text-muted-foreground">{desc}</p>}
    </div>
  )
}