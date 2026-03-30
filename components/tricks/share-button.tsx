'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations, useLocale } from 'next-intl';
// 這裡請換成你專案中實例化 Supabase Browser Client 的路徑
// 例如 import { createClient } from '@/lib/supabase/client' 或 supabase.ts
import { supabase } from '@/lib/supabase/supabase'; 

interface ShareButtonProps {
  trickId: string;
  initialShareId?: string | null;
}

export function ShareButton({ trickId, initialShareId }: ShareButtonProps) {
  const t = useTranslations();
  const locale = useLocale(); // 抓取當前語系，確保分享出去的連結預設是該語系
  
  const [shareId, setShareId] = useState<string | null>(initialShareId || null);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleShare = async () => {
    try {
      setIsLoading(true);
      let currentShareId = shareId;

      // 1. 如果還沒有 share_id，就產生一個並更新到 Supabase
      if (!currentShareId) {
        const newShareId = crypto.randomUUID();
        
        const { error } = await supabase
          .from('tricks')
          .update({ share_id: newShareId })
          .eq('id', trickId); // RLS 政策會確保只有擁有者可以 update

        if (error) throw error;
        
        currentShareId = newShareId;
        setShareId(newShareId);
      }

      // 2. 組合完整的分享網址 (包含當前網域與語系)
      // 例如：https://gratrysnow.com/zh/trick/share/xxxxx-xxxx-xxxx...
      const shareUrl = `${window.location.origin}/${locale}/trick/share/${currentShareId}`;

      // 3. 複製到使用者的剪貼簿
      await navigator.clipboard.writeText(shareUrl);
      
      // 4. UI 回饋
      setIsCopied(true);
      toast.success(t('share_link_copied') || 'Share link copied to clipboard!');

      // 2秒後把打勾圖示換回分享圖示
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);

    } catch (error) {
      console.error('Failed to generate share link:', error);
      toast.error(t('share_error') || 'Failed to generate share link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleShare} 
      disabled={isLoading}
      className="gap-2 transition-all"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isCopied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Share2 className="h-4 w-4" />
      )}
      <span className="hidden sm:inline">
        {isCopied ? (t('copied') || 'Copied') : (t('share') || 'Share')}
      </span>
    </Button>
  );
}