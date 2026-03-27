import { Geist, Geist_Mono, Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://chienhsiang-hung.github.io'),
  
  title: "Gratry Snow | Snowboard Ground Trick Library",
  description: "Your ultimate snowboard ground tricks library and notes. Upload, mute, and organize your Gratry practice videos.",
  keywords: ["snowboard", "gratry", "ground tricks", "flatland", "snowboarding"],
  icons: {
    icon: '/gratry-snow/favicon.ico',
    apple: '/gratry-snow/apple-touch-icon.png',
  },
  openGraph: {
    title: "Gratry Snow | Snowboard Ground Trick Library",
    description: "Your ultimate snowboard ground tricks library and notes.",
    type: "website",
    siteName: "Gratry Snow",
    images: [
      {
        url: '/gratry-snow/og-image.svg', 
        width: 1200,
        height: 630,
        alt: "Gratry Snow Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gratry Snow | Snowboard Ground Trick Library",
    description: "Your ultimate snowboard ground tricks library and notes.",
    images: ['/gratry-snow/og-image.svg'],
  },
};

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      className={cn("antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}