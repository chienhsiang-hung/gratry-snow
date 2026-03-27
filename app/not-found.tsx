'use client'

import { useEffect, useState } from 'react';
// 引入全域 CSS，確保 Tailwind 樣式能正常運作
import './globals.css'; 

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
    // 加上 <html> 和 <body> 標籤！
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground">
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
      </body>
    </html>
  );
}