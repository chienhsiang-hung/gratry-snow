import { cache } from 'react';
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { createClient } from '@supabase/supabase-js';
import type { Metadata } from "next";
import { TrickPlayer } from "@/components/tricks/trick-player";

// ⚠️ 重要：建立一個 Admin Client 來繞過 RLS。
// 只有在 Server Component 裡才可以這樣做，避免私有資料被 RLS 擋下。
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const getTrickByShareId = cache(async (share_id: string) => {
  return await supabaseAdmin
    .from('tricks')
    .select('*')
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

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl flex flex-col gap-6 animate-in fade-in duration-700 pt-20">
      
      {/* 標題區 */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{trick.name}</h1>
      </div>
      
      {/* 播放器區：引入你寫好的 TrickPlayer */}
      <div className="w-full">
        <TrickPlayer videoId={trick.video_id} />
      </div>

      {/* 描述區塊 */}
      {trick.description && (
        <div className="prose dark:prose-invert max-w-none bg-muted/40 p-6 rounded-2xl border border-white/5 shadow-sm">
          <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
            {trick.description}
          </p>
        </div>
      )}

      {/* 提示：這是一個私人分享連結 */}
      <div className="mt-8 text-center text-sm text-muted-foreground bg-primary/10 py-3 rounded-xl">
        <p>{t('private_share_notice')}</p>
      </div>

    </main>
  );
}