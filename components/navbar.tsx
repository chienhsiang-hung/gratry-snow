import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import AuthButton from "@/components/auth-button";

export default function Navbar() {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        
        <div className="flex items-center gap-6">
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <span className="font-bold text-lg tracking-tight">Gratry Snow</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
            <Link 
              href={`/${locale}/upload`} 
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {t('upload_trick')} {/* 使用翻譯 */}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <div className="h-4 w-px bg-border mx-1"></div>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}