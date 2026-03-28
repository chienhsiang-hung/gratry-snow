import { getTranslations, setRequestLocale } from "next-intl/server";
import { TrickList } from "@/components/trick-list";
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import Image from "next/image";

export const dynamicParams = false;
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  return (
    // 加上 relative 與 overflow-hidden 以容納背景光暈
    <main className="relative flex flex-1 flex-col items-center w-full px-4 pt-16 pb-12 md:px-8 md:pt-24 gap-12 overflow-hidden">
      
      {/* 背景裝飾光暈 */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-20 pointer-events-none blur-[100px] bg-primary/40 rounded-full"></div>

      {/* Hero 區塊：加上 animate-in 與 slide-in 動畫 */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
        {/* <Image 
          src="/gratry-snow/logo.svg" 
          alt="Gratry Snow Logo" 
          width={88} 
          height={88} 
          className="mb-2 drop-shadow-xl transition-all duration-500 hover:scale-110 hover:rotate-3"
          priority
        /> */}
        {/* 標題改用漸層文字 */}
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/70">
          Gratry Snow
        </h1>
        <p className="text-lg text-muted-foreground max-w-[600px] leading-relaxed">
          {t("description")}
        </p>
      </div>

      <div className="w-full">
        <TrickList />
      </div>
    </main>
  );
}