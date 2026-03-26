'use client';

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
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
import { cn } from "@/lib/utils";

export default function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/upload", label: t('upload_trick') },
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
            <SheetContent side="left" className="w-[280px] p-0"> {/* 移除預設 Pading 重新定義 */}
              <SheetHeader className="p-6 text-left border-b">
                <SheetTitle className="font-bold text-xl tracking-tight">
                  Gratry Snow
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col pt-2">
                {navItems.map((item) => (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    onClick={closeSheet}
                    className={cn(
                      "flex items-center px-6 py-4 text-sm font-medium transition-colors hover:bg-accent",
                      pathname === `${item.href}/`
                        ? "bg-accent text-primary" // 選中時背景加深，字體變色
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-lg tracking-tight">
              Gratry Snow
            </span>
          </Link>

          {/* 電腦版導覽 */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className={cn(
                  "transition-colors hover:text-foreground/80 py-1",
                  pathname === `${item.href}/` ? "text-foreground font-semibold" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
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