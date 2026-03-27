import { getTranslations, setRequestLocale } from "next-intl/server";
import { TrickList } from "@/components/trick-list";

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  return (
    <main className="flex flex-1 flex-col items-center w-full px-4 pt-16 pb-12 md:px-8 md:pt-24 gap-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Gratry Snow</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <TrickList />
    </main>
  );
}