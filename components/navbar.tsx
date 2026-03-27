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

  const navItems = [
    { href: "/", label: t('home') || "Home", icon: Home },
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
            <SheetContent side="left" className="w-[300px] p-0 bg-background/80 backdrop-blur-xl border-r-border/50 flex flex-col"> 
              <SheetHeader className="p-6 text-left border-b border-border/50">
                <SheetTitle className="font-bold text-2xl tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
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
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                        isActive 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground" 
                      )}
                    >
                      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />}
                      <Icon className={cn(
                        "h-5 w-5 transition-transform duration-200",
                        isActive ? "scale-110" : "group-hover:scale-110 group-hover:text-primary/70"
                      )} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

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
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <span className="font-bold text-lg tracking-tight">
              Gratry Snow
            </span>
          </Link>

          {/* 電腦版導覽：改用現代化的膠囊 (Pill) 風格 */}
          <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname === `${item.href}/`;
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={cn(
                    "transition-all duration-200 px-4 py-2 rounded-full", // 改為圓角膠囊
                    isActive 
                      ? "bg-primary/10 text-primary font-semibold" // 選中時有淡淡的背景色
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* 右側工具欄：加入電腦版 GitHub 連結 */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center">
            <a 
              href="https://github.com/chienhsiang-hung/gratry-snow" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon" aria-label="GitHub">
                <SiGithub className="h-5 w-5" />
              </Button>
            </a>
          </div>
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