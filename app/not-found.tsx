'use client'

import { useEffect, useState } from 'react';
import './globals.css';
import { ThemeProvider } from "@/components/theme-provider";

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
    // suppressHydrationWarning 是給 next-themes 用的，防止報錯
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground">
        {/* 2. 用 ThemeProvider 包住畫面內容 */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {isRedirecting ? (
            <div className="flex min-h-screen w-full items-center justify-center">
              <div className="flex flex-col items-center space-y-6">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary border-r-primary/50 transition-all duration-500"></div>
                <p className="animate-pulse text-sm font-medium tracking-widest text-muted-foreground">
                  ROUTING...
                </p>
              </div>
            </div>
          ) : (
            <div className="flex min-h-screen flex-col items-center justify-center text-center">
              <h1 className="text-4xl font-bold">404</h1>
              <p className="mt-4 text-muted-foreground">This page could not be found.</p>
              <a href="/gratry-snow/en" className="mt-6 text-primary hover:underline">
                Return Home
              </a>
            </div>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}