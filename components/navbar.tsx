'use client';

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import AuthButton from "@/components/auth-button";
import { Menu, Home, Upload } from "lucide-react";
import { SiGithub } from "react-icons/si"; 
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // 為了讓選單更豐富，我幫你加了首頁的連結，並配上圖示
  const navItems = [
    { href: "/", label: t('home') || "Home", icon: Home }, // 如果沒有翻譯檔，預設顯示 Home
    { href: "/upload", label: t('upload_trick'), icon: Upload },
  ];

  const closeSheet = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        
        <div className="flex items-center gap-6">
          {/* 手機版：漢堡選單 */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden -ml-2" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            {/* 加上毛玻璃效果與更柔和的背景色 */}
            <SheetContent side="left" className="w-[300px] p-0 bg-background/80 backdrop-blur-xl border-r-border/50 flex flex-col"> 
              
              <SheetHeader className="p-6 text-left border-b border-border/50">
                <SheetTitle className="font-bold text-2xl tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Gratry Snow
                </SheetTitle>
              </SheetHeader>
              
              <nav className="flex flex-col gap-2 p-4 flex-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  // 簡單判斷是否為當前頁面 (支援多語系路徑)
                  const isActive = pathname === item.href || pathname === `${item.href}/`;
                  
                  return (
                    <Link 
                      key={item.href}
                      href={item.href} 
                      onClick={closeSheet}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                        isActive 
                          ? "bg-primary/10 text-primary" // 選中狀態：主色淡背景、主色字體
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground" // 一般狀態：懸浮時有淡灰色背景
                      )}
                    >
                      {/* 選中時左側出現一條亮色的線，增加細節 */}
                      {isActive && (
                         <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                      )}
                      
                      <Icon className={cn(
                        "h-5 w-5 transition-transform duration-200",
                        isActive ? "scale-110" : "group-hover:scale-110 group-hover:text-primary/70"
                      )} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* 底部加入一些裝飾性的元素或額外連結，讓選單不空虛 */}
              <div className="p-6 border-t border-border/50">
                 <a 
                   href="https://github.com/chienhsiang-hung/gratry-snow" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                 >
                   <SiGithub className="h-4 w-4" />
                   <span>View on GitHub</span>
                 </a>
              </div>

            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-lg tracking-tight">
              Gratry Snow
            </span>
          </Link>

          {/* 電腦版導覽 (稍微調整了一下 active 判斷邏輯，讓他更準確) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname === `${item.href}/`;
              // 電腦版我們就先不顯示 Icon，保持乾淨
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={cn(
                    "transition-colors py-1 relative",
                    isActive 
                      ? "text-foreground font-semibold" 
                      : "text-muted-foreground hover:text-foreground/80"
                  )}
                >
                  {item.label}
                  {/* 電腦版選中時底部加一條線 */}
                  {isActive && (
                    <div className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-foreground rounded-t-full" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* 右側工具欄 */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <div className="h-6 w-px bg-border hidden sm:block"></div>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}