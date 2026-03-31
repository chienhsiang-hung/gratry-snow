import { cache } from 'react';
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { createClient } from '@supabase/supabase-js';
import type { Metadata } from "next";
import { TrickPlayer } from "@/components/tricks/trick-player";
import Link from 'next/link';

// ⚠️ 重要：建立一個 Admin Client 來繞過 RLS。
// 只有在 Server Component 裡才可以這樣做，避免私有資料被 RLS 擋下。
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const getTrickByShareId = cache(async (share_id: string) => {
  return await supabaseAdmin
    .from('tricks')
    .select('*, profiles(*)')
    .eq('share_id', share_id)
    .single();
});

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string; share_id: string }> 
}): Promise<Metadata> {
  const { locale, share_id } = await params;
  const t = await getTranslations({ locale });
  
  // 透過 share_id 抓取影片資訊 (無權限阻礙)
  const { data: trick } = await getTrickByShareId(share_id);

  if (!trick) {
    return { title: t('not_found_title') || 'Not Found' };
  }

  const trickName = trick.name || t('default_trick_name');
  const description = trick.description || t('metadata_desc');
  
  // 🚀 魔法在這裡：直接使用 YouTube 預設的高畫質縮圖作為 Meta Image
  // YouTube 預設縮圖格式有 hqdefault.jpg 或 maxresdefault.jpg
  const ogImage = `https://img.youtube.com/vi/${trick.video_id}/maxresdefault.jpg`;

  return {
    title: trickName,
    description: description,
    openGraph: {
      title: `${trickName} | Gratry Snow`,
      description: description,
      type: "video.other",
      images: [
        {
          url: ogImage,
          width: 1280, // maxresdefault 通常是 720p 比例
          height: 720,
          alt: trickName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: trickName,
      description: description,
      images: [ogImage],
    },
  };
}

export default async function TrickSharePage({ 
  params 
}: { 
  params: Promise<{ locale: string; share_id: string }> 
}) {
  const { locale, share_id } = await params;
  const t = await getTranslations({ locale });
  
  if (!routing.locales.includes(locale as any)) notFound();
  setRequestLocale(locale);

  const { data: trick, error } = await getTrickByShareId(share_id);

  // 如果找不到這個 share_id 或是發生錯誤，直接 404
  if (error || !trick) {
    notFound();
  }

  // 提取 Uploader 資訊 (IG 優先)
  const uploader = trick.profiles;
  const uploaderAvatar = uploader?.ig_avatar_url || uploader?.avatar_url;
  const uploaderName = uploader?.ig_name || uploader?.username || 'Unknown Rider';

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl flex flex-col gap-6 animate-in fade-in duration-700">
      
      {/* 標題與 Uploader 區塊 */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{trick.name}</h1>

        {/* 🟢 4. Uploader 資訊連結 (放在標題下方) */}
        <Link href={`/${locale}/profile/${trick.user_id}`} className="flex items-center gap-3 w-fit group">
          <div className="h-10 w-10 overflow-hidden rounded-full border border-primary/20 bg-muted shrink-0">
            {uploaderAvatar ? (
              <img src={uploaderAvatar} alt={uploaderName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-bold text-sm text-muted-foreground">
                {uploaderName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground leading-tight">Uploaded by</span>
            <span className="text-sm font-semibold group-hover:text-primary transition-colors leading-tight mt-0.5">
              {uploaderName}
            </span>
          </div>
        </Link>
      </div>
      
      {/* 播放器區：引入你寫好的 TrickPlayer */}
      <div className="w-full">
        <TrickPlayer videoId={trick.video_id} />
      </div>

      {/* 提示：這是一個私人分享連結 */}
      <div className="mt-8 text-center text-sm text-muted-foreground bg-primary/10 py-3 rounded-xl">
        <p>{t('private_share_notice')}</p>
      </div>

    </main>
  );
}