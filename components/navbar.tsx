'use client';

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import AuthButton from "@/components/auth-button";
import { Menu, Home, Upload, Bug, MessageSquare, ListTree } from "lucide-react";
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
import Image from "next/image";

export default function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: t('home') || "Home", icon: Home },
    { href: "/upload", label: t('upload_trick'), icon: Upload },
    { href: "/skill-tree", label: t('skill_tree') || "Skill Tree", icon: ListTree },
  ];

  const closeSheet = () => setIsOpen(false);

  return (
    // 優化 1：加強毛玻璃效果（調低背景不透明度），並加入由上往下的進場動畫
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-8 ease-out supports-[backdrop-filter]:bg-background/50">
      <div className="flex h-16 items-center justify-between px-4">
        
        <div className="flex items-center gap-3">
          {/* 手機版：漢堡選單 */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden -ml-2 hover:bg-primary/10 hover:text-primary transition-colors" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0 bg-background/80 backdrop-blur-xl border-r-border/50 flex flex-col"> 
              <SheetHeader className="p-6 text-left border-b border-border/20">
                <SheetTitle className="flex items-center gap-2 font-bold text-2xl tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  <Image
                    src="/logo.svg"
                    alt="Gratry Snow Logo"
                    width={28}
                    height={28}
                    className="drop-shadow-sm"
                    priority
                  />
                  Gratry Snow
                </SheetTitle>
              </SheetHeader>
              
              <nav className="flex flex-col gap-2 p-4 flex-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname === `${item.href}/`;
                  return (
                    <Link 
                      key={item.href}
                      href={item.href} 
                      onClick={closeSheet}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                        isActive 
                          ? "bg-primary/10 text-primary shadow-sm" 
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground" 
                      )}
                    >
                      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />}
                      <Icon className={cn(
                        "h-5 w-5 transition-transform duration-300",
                        isActive ? "scale-110" : "group-hover:scale-110 group-hover:text-primary/70"
                      )} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-border/20 flex flex-col gap-1 bg-muted/10">
                {/* Issues 連結 */}
                <a 
                  href="https://github.com/chienhsiang-hung/gratry-snow/issues" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-md bg-background shadow-sm border border-border/50 group-hover:border-primary/30 transition-colors">
                    <Bug className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary" />
                  </div>
                  <span>{t('issues') || "Report Issue"}</span>
                </a>
              
                {/* Discussions 連結 */}
                <a
                  href="https://github.com/chienhsiang-hung/gratry-snow/discussions" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-md bg-background shadow-sm border border-border/50 group-hover:border-primary/30 transition-colors">
                    <MessageSquare className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary" />
                  </div>
                  <span>{t('discussions') || "Discussions"}</span>
                </a>

                {/* GitHub 連結 */}
                <a 
                  href="https://github.com/chienhsiang-hung/gratry-snow" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-md bg-background shadow-sm border border-border/50 group-hover:border-primary/30 transition-colors">
                    <SiGithub className="h-3.5 w-3.5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:text-primary" />
                  </div>
                  <span>View on GitHub</span>
                </a>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo 區塊：優化 2：加上 Hover 時的 Logo 旋轉放大效果 */}
          <Link href="/" className="group flex items-center gap-2 transition-all duration-300">
            <div className="relative flex items-center justify-center">
              <Image 
                src="/logo.svg" 
                alt="Gratry Snow Logo" 
                width={32} 
                height={32} 
                className="drop-shadow-md transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:drop-shadow-primary/50"
                priority
              />
            </div>
            <span className="font-extrabold text-lg tracking-tight hidden sm:inline-block bg-clip-text transition-colors group-hover:text-primary">
              Gratry Snow
            </span>
          </Link>

          {/* 電腦版導覽 */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium ml-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname === `${item.href}/`;
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={cn(
                    "relative px-4 py-2 rounded-full transition-all duration-300 group",
                    isActive 
                      ? "bg-primary/10 text-primary font-semibold shadow-sm"
                      : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                  )}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {/* 優化 3：在按鈕 Hover 時加入一個極輕微的彈跳動畫 */}
                    <span className={cn("transition-transform duration-300", isActive ? "" : "group-hover:-translate-y-0.5")}>
                      {item.label}
                    </span>
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* 右側工具欄 */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* 新增：手機版專屬的直接上傳按鈕 (只在 md 以下尺寸顯示) */}
          <Link href="/upload" className="md:hidden flex items-center" aria-label={t('upload_trick') || "Upload"}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
            >
              <Upload className="h-5 w-5 transition-transform hover:scale-110" />
            </Button>
          </Link>

          <div className="hidden md:flex items-center">
            <a 
              href="https://github.com/chienhsiang-hung/gratry-snow" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon" className="group rounded-full hover:bg-primary/10" aria-label="GitHub">
                {/* 優化 4：讓 GitHub Icon Hover 時會轉動 */}
                <SiGithub className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:scale-110 group-hover:rotate-12" />
              </Button>
            </a>
          </div>
          <div className="flex items-center gap-1 bg-muted/30 rounded-full p-1 border border-border/40 shadow-inner">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <div className="h-6 w-px bg-border/50 hidden sm:block mx-1"></div>
          {/* AuthButton 內部如果你有寫 Hover 也可以套用類似邏輯 */}
          <AuthButton />
        </div>
      </div>
    </header>
  );
}