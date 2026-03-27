import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner"
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: {
      template: "%s | Gratry Snow",
      default: t('metadata_title'),
    },
    description: t('metadata_desc'),
    keywords: ["snowboard", "gratry", "ground tricks", "flatland", "snowboarding", "平花", "滑雪", "單板"],
    icons: {
      icon: '/gratry-snow/favicon.ico',
      apple: '/gratry-snow/apple-touch-icon.png',
    },
    openGraph: {
      title: t('metadata_title'),
      description: t('metadata_desc'),
      type: "website",
      siteName: "Gratry Snow",
      images: [
        {
          url: '/gratry-snow/og-image.png', 
          width: 1200,
          height: 630,
          alt: "Gratry Snow Preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t('metadata_title'),
      description: t('metadata_desc'),
      images: ['/gratry-snow/og-image.png'],
    },
  };
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();

return (
    <html
      lang={locale}
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            {/* 將內容用 flex 容器包起來，加入 Navbar */}
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1 flex flex-col">
                {children}
              </main>
            </div>
          </NextIntlClientProvider>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}