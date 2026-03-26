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

  // 定義導航項目，方便統一管理
  const navItems = [
    { href: "/upload", label: t('upload_trick') },
    // { href: "/explore", label: t('explore') }, // 方便未來擴充
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
            <SheetContent side="left" className="w-[280px] sm:w-[350px] px-6">
              <SheetHeader className="text-left mb-8">
                <SheetTitle className="font-bold text-xl tracking-tight">
                  Gratry Snow
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-5">
                {navItems.map((item) => (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    onClick={closeSheet}
                    className={cn(
                      "text-base font-medium py-2 transition-colors border-l-2 pl-4 -ml-4",
                      pathname === `${item.href}/`
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
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
                  "transition-colors hover:text-foreground/80",
                  pathname === `${item.href}/` ? "text-foreground" : "text-muted-foreground"
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
