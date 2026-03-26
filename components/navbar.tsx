'use client';

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import AuthButton from "@/components/auth-button";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const locale = useLocale();
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  // 關閉側邊欄的輔助函式（點擊連結後觸發）
  const closeSheet = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        
        {/* 左側：Logo 與 導覽連結 */}
        <div className="flex items-center gap-6">
          
          {/* 手機版：漢堡選單按鈕 (md 以上隱藏) */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden -ml-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <SheetHeader className="text-left mb-6">
                <SheetTitle className="font-bold text-lg tracking-tight">
                  Gratry Snow
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 text-sm font-medium">
                <Link 
                  href={`/${locale}/upload`} 
                  onClick={closeSheet}
                  className="text-foreground/70 transition-colors hover:text-foreground"
                >
                  {t('upload_trick')}
                </Link>
                {/* 未來可以在這裡加入更多手機版連結 */}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <span className="font-bold text-lg tracking-tight hidden sm:inline-block">
              Gratry Snow
            </span>
          </Link>

          {/* 電腦版：一般導覽連結 (md 以下隱藏) */}
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
            <Link 
              href={`/${locale}/upload`} 
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {t('upload_trick')}
            </Link>
            {/* 未來可以在這裡加入更多電腦版連結 */}
          </nav>
        </div>

        {/* 右側：工具與個人資料 */}
        <div className="flex items-center gap-1 sm:gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <div className="h-4 w-px bg-border mx-1 hidden sm:block"></div>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}