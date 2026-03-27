import { UploadTrickForm } from "@/components/upload-trick-form";
import { setRequestLocale } from "next-intl/server";
import AuthGuard from "@/components/auth-guard";
import { routing } from '@/i18n/routing';
import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';

export const dynamicParams = false;
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: t('upload_trick'),
  };
}

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