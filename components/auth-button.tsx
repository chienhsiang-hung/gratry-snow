'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabase";
import { User } from "@supabase/supabase-js";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogIn, Loader2, LogOut, User as UserIcon } from "lucide-react";

// 定義一下 Profile 的型別
interface ProfileData {
  avatar_url?: string;
  ig_avatar_url?: string;
  username?: string;
  ig_name?: string;
}

export default function AuthButton() {
  const t = useTranslations();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLogin = async () => {
    const redirectTo = `${window.location.origin}/api/auth/callback?next=${window.location.pathname}`;
    // console.log("redirectTo:", redirectTo);

    // // 2. 加上這行，按下「確定」才會繼續跑下面的 Supabase 登入
    // if (!window.confirm(`即將跳轉，請確認網址：\n${redirectTo}`)) {
    //   return; // 如果按「取消」，就不執行登入跳轉
    // }
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo,
        scopes: 'https://www.googleapis.com/auth/youtube.upload'
      }
    });
  };

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        // 🚀 關鍵：去 profiles 資料表撈 IG 頭像資訊
        const { data: profileData } = await supabase
          .from('profiles')
          .select('avatar_url, ig_avatar_url, username, ig_name')
          .eq('id', session.user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
        }
      }
      setLoading(false);
    };

    fetchSessionAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchSessionAndProfile(); // 登入狀態改變時重新抓取
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
  }

  if (!user) {
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

  // 🚀 優先顯示邏輯：IG 頭像 > 系統頭像 > Google 原始頭像
  const displayAvatar = profile?.ig_avatar_url || profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture;
  // 名稱也套用同樣的邏輯
  const displayName = profile?.ig_name || profile?.username || user.user_metadata?.full_name || user.email?.split('@')[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full overflow-hidden border border-border/50 hover:border-primary/50 transition-colors p-0">
          {displayAvatar ? (
            <img 
              src={displayAvatar} 
              alt={displayName}
              className="h-full w-full object-cover"
              // 💡 確保外部圖片 (Google 或 IG) 不會被擋
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted font-semibold text-muted-foreground">
              {displayName?.charAt(0).toUpperCase()}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-border/50">
        <div className="flex items-center justify-start gap-2 p-3">
          <div className="flex flex-col space-y-0.5 leading-none">
            <p className="font-medium text-sm">{displayName}</p>
            <p className="w-[180px] truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator className="bg-border/40" />
        <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer py-2.5 rounded-lg focus:bg-primary/10 focus:text-primary transition-colors">
          <UserIcon className="mr-2 h-4 w-4" />
          <span>{t('profile') || 'Profile'}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border/40" />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer py-2.5 rounded-lg text-red-500 focus:bg-red-500/10 focus:text-red-500 transition-colors">
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('log_out')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}