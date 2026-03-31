import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { TrickList } from "@/components/tricks/trick-list";
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { TrickSkeleton } from "@/components/tricks/trick-skeleton";

export const dynamicParams = false;
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

async function TrickListServer() {
  // 注意這裡不用 await createClient()，直接呼叫即可
  const supabase = await createClient(); 

  // 1. (可選) 檢查目前登入的使用者
  const { data: { user } } = await supabase.auth.getUser();
  console.log("Server 端讀取到的 User:", user?.id); // 如果印出 null，代表你的 cookie 沒帶過去或沒登入

  // 2. 抓取招式列表 (現在這會帶有登入者的權限了)
  const { data: initialTricks, error } = await supabase
    .from('tricks')
    .select(`
      *,
      profiles (
        username,
        avatar_url,
        ig_handle,
        ig_name,
        ig_avatar_url
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Server 抓取資料失敗:', error);
  }

  // 將抓到的資料傳給 Client Component
  return <TrickList initialTricks={initialTricks || []} />;
}

function TrickListSkeleton() {
  return (
    <div className="w-full pt-8">
      <TrickSkeleton count={8} />
    </div>
  );
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  return (
    <main className="relative flex flex-1 flex-col items-center w-full px-4 pt-16 pb-12 md:px-8 md:pt-24 gap-12 overflow-hidden">
      {/* 這些靜態內容會「瞬間」渲染給使用者看 */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/70">
          Gratry Snow
        </h1>
        <p className="text-lg text-muted-foreground max-w-[600px] leading-relaxed">
          {t("description")}
        </p>
      </div>

      <div className="w-full">
        {/* 用 Suspense 包起來，抓資料時顯示 Skeleton，抓完自動替換成 TrickList */}
        <Suspense fallback={<TrickListSkeleton />}>
          <TrickListServer />
        </Suspense>
      </div>
    </main>
  );
}