'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/en');
  }, [router]);

  return(
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-6">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-foreground border-r-foreground/50 transition-all duration-500"></div>
        <p className="animate-pulse text-sm font-medium tracking-widest text-muted-foreground">
          LOADING...
        </p>
      </div>
    </div>
  );
}