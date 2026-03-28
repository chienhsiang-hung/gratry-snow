'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import './globals.css';
import { ThemeProvider } from "@/components/theme-provider";
import { Geist, Geist_Mono, Inter } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export default function NotFound() {
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    const path = window.location.pathname;
    const basePath = '/gratry-snow';
    
    const cleanPath = path.startsWith(basePath) 
      ? path.slice(basePath.length) 
      : path;

    if (!cleanPath.startsWith('/en') && !cleanPath.startsWith('/zh')) {
      const newPath = `${basePath}/en${cleanPath === '/' ? '' : cleanPath}`;
      window.location.replace(newPath);
    } else {
      setIsRedirecting(false);
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* 背景裝飾光暈 */}
          <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20 pointer-events-none">
              <div className="h-[40rem] w-[40rem] rounded-full bg-primary/30 blur-3xl"></div>
            </div>

            {/* 主要內容區塊：加上進場動畫 */}
            <div className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-700 ease-out">
              
              {isRedirecting ? (
                // --- Loading 狀態 ---
                <div className="flex flex-col items-center space-y-8">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute h-20 w-20 animate-ping rounded-full bg-primary/20"></div>
                    <Image 
                      src="/gratry-snow/logo.svg" 
                      alt="Loading..." 
                      width={48} 
                      height={48} 
                      className="animate-pulse drop-shadow-lg"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]"></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-primary"></span>
                    </div>
                    <p className="text-sm font-semibold tracking-[0.2em] text-muted-foreground">
                      ROUTING
                    </p>
                  </div>
                </div>
              ) : (
                // --- 404 狀態 ---
                <div className="flex flex-col items-center">
                  <Image 
                    src="/gratry-snow/logo.svg" 
                    alt="Gratry Snow Logo" 
                    width={96} 
                    height={96} 
                    className="mb-8 drop-shadow-2xl transition-transform duration-500 hover:scale-110 hover:rotate-12"
                  />
                  
                  <h1 className="text-7xl font-extrabold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/60">
                    404
                  </h1>
                  <h2 className="text-2xl font-semibold tracking-tight mb-4">
                    Lost in the snow?
                  </h2>
                  <p className="text-muted-foreground mb-10 max-w-[450px] leading-relaxed text-lg">
                    The trail you are looking for might have been closed, renamed, or is currently buried under fresh powder.
                  </p>
                  
                  <button 
                    onClick={() => window.location.href = '/gratry-snow/en'}
                    className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-primary px-8 font-medium text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-primary/25 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                  >
                    <span className="mr-2">Return to Base Camp</span>
                    <svg 
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}