import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner"
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { routing, Link } from '@/i18n/routing';

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
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    openGraph: {
      title: t('metadata_title'),
      description: t('metadata_desc'),
      type: "website",
      siteName: "Gratry Snow",
      images: [
        {
          url: '/og-image.svg', 
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
      images: ['/og-image.svg'],
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
  const t = await getTranslations({ locale });

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
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1 flex flex-col">
                {children}
              </main>

              <footer className="border-t py-6 bg-background/95">
              <div className="container mx-auto flex flex-col items-center justify-center gap-4 px-4 md:flex-row md:justify-between text-sm text-muted-foreground">
    
                  {/* 版權宣告 */}
                  <p className="text-center md:text-left">
                    © {new Date().getFullYear()} Gratry Snow. All rights reserved.
                  </p>
                  {/* 連結區塊：加上 flex-wrap 允許手機版自動換行，並用 justify-center 讓換行後也能置中 */}
                  <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
                    <a 
                      href="https://github.com/chienhsiang-hung/gratry-snow/issues" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:text-foreground transition-colors whitespace-nowrap"
                    >
                      {t('issues')}
                    </a>
                    <a 
                      href="https://github.com/chienhsiang-hung/gratry-snow/discussions" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors whitespace-nowrap"
                    >
                      {t('discussions')}
                    </a>
                    <Link href="/privacy" className="hover:text-foreground transition-colors whitespace-nowrap">
                      {t('privacy')}
                    </Link>
                    <Link href="/terms" className="hover:text-foreground transition-colors whitespace-nowrap">
                      {t('terms')}
                    </Link>
                  </div>
                </div>
              </footer>

            </div>
          </NextIntlClientProvider>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}