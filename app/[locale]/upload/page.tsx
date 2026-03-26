// 檔案位置：app/[locale]/upload/page.tsx
import { UploadTrickForm } from "@/components/upload-trick-form";
import { setRequestLocale } from "next-intl/server";
import AuthGuard from "@/components/auth-guard";

export default async function UploadPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 pt-12 sm:p-12 md:p-24">
      {/* 使用 AuthGuard 保護這區塊 */}
      <AuthGuard>
        <UploadTrickForm />
      </AuthGuard>
    </main>
  );
}