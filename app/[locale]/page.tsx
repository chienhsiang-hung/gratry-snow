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
    <main className="flex flex-1 flex-col items-center w-full px-4 pt-16 pb-12 md:px-8 md:pt-24 gap-8">
      {/* 調整為 flex-col 並置中，加入 Logo */}
      <div className="flex flex-col items-center text-center space-y-4">
        <Image 
          src="/gratry-snow/logo.svg" 
          alt="Gratry Snow Logo" 
          width={80} 
          height={80} 
          className="mb-2 drop-shadow-md hover:scale-105 transition-transform duration-300 dark:brightness-0 dark:invert"
          priority // 首圖建議加上 priority 提升 LCP
        />
        <h1 className="text-4xl font-bold tracking-tight">Gratry Snow</h1>
        <p className="text-muted-foreground max-w-[600px]">{t("description")}</p>
      </div>

      <TrickList />
    </main>
  );
}