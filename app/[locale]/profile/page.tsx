'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useTranslations } from "next-intl";
import AuthGuard from "@/components/auth-guard";
import Image from "next/image";

export default function ProfilePage() {
  const t = useTranslations();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-12 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-bold tracking-tight mb-8">
          {t('profile')} {/* 這裡原本的 || 'User Profile' 拿掉，直接套用翻譯 */}
        </h1>

        {user && (
          <div className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            
            {/* 大頭貼區塊 */}
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-full overflow-hidden border-4 border-background shadow-md">
              {(user.user_metadata?.avatar_url || user.user_metadata?.picture) ? (
                <img 
                  src={user.user_metadata?.avatar_url || user.user_metadata?.picture} 
                  alt={user.user_metadata?.full_name || t('avatar')}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-3xl font-bold text-muted-foreground">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* 基本資料區塊 */}
            <div className="flex flex-col space-y-3 text-center sm:text-left w-full">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  {user.user_metadata?.full_name || t('default_name')}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {user.email}
                </p>
              </div>

              {/* 狀態區塊 */}
              <div className="grid grid-cols-2 gap-4 pt-4 mt-4 border-t border-border/40">
                <div className="bg-muted/30 p-4 rounded-xl">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    {t('status')}
                  </p>
                  <p className="font-medium text-primary">
                    {t('active')}
                  </p>
                </div>
                <div className="bg-muted/30 p-4 rounded-xl">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    {t('provider')}
                  </p>
                  <p className="font-medium capitalize">
                    {user.app_metadata.provider}
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </AuthGuard>
  );
}