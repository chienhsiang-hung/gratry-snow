// 檔案位置：app/[locale]/upload/page.tsx
import { UploadTrickForm } from "@/components/upload-trick-form";
import { setRequestLocale } from "next-intl/server";
import AuthGuard from "@/components/auth-guard";
import { routing } from '@/i18n/routing';

export const dynamicParams = false;
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata = {
  title: "Upload Trick", 
};

export default async function UploadPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="flex flex-1 flex-col items-center p-4 pt-12 sm:p-12 md:p-24">
      <AuthGuard>
        <UploadTrickForm />
      </AuthGuard>
    </main>
  );
}