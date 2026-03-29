'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabase";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing"; // <-- 新增引入 Link

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const t = useTranslations();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${window.location.pathname}`,
        scopes: 'https://www.googleapis.com/auth/youtube.upload'
      }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (user) {
    const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 overflow-hidden border">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt="Avatar" 
                className="h-full w-full object-cover" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <UserIcon className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.user_metadata.full_name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          {/* --- 新增的 Profile 連結 --- */}
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer w-full flex items-center">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>{t('profile') || 'Profile'}</span>
            </Link>
          </DropdownMenuItem>
          {/* ------------------------- */}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t('log_out')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleLogin}
      className="group flex items-center gap-2 rounded-full px-4 transition-all"
    >
      <LogIn className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
      <span className="hidden text-sm font-medium sm:inline-block">{t('log_in')}</span>
      <span className="sr-only sm:hidden">{t('sign_in_google')}</span>
    </Button>
  );
}