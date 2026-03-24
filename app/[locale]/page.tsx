import { ThemeToggle } from "@/components/theme-toggle";
import { useTranslations } from "next-intl";

export default function Home() {
  // 透過 useTranslations 取得翻譯方法
  const t = useTranslations();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 space-y-8">
      {/* 帶入 messages.ts 裡設定的 key */}
      <h1 className="text-4xl font-bold">{t("title")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>
      
      <ThemeToggle />
    </main>
  );
}