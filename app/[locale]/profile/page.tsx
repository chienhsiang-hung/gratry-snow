'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabase";
import { useTranslations } from "next-intl";
import AuthGuard from "@/components/auth-guard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { SiInstagram } from "react-icons/si"; 

interface Profile {
  id: string;
  email: string;
  username: string;
  avatar_url: string;
  ig_handle?: string;
  ig_name?: string;
  ig_avatar_url?: string;
}

export default function ProfilePage() {
  const t = useTranslations();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [igInput, setIgInput] = useState("");
  const [isLinking, setIsLinking] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const user = session.user;
    const defaultUsername = user.email?.split('@')[0] || t('default_name');
    const defaultAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture;

    // 去 profiles table 抓資料
    let { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();

    // 如果是第一次登入，沒有 profile，則建立一筆
    if (!data) {
      const newProfile = {
        id: user.id,
        email: user.email,
        username: defaultUsername,
        avatar_url: defaultAvatar,
      };
      await supabase.from('profiles').insert([newProfile]);
      data = newProfile;
    }

    setProfile(data as Profile);
    if (data.ig_handle) setIgInput(data.ig_handle);
  };

  const handleLinkIG = async () => {
    if (!igInput.trim() || !profile) return;
    setIsLinking(true);

    try {
      // 1. 呼叫我們自己寫的 API 爬取 IG 資訊
      const res = await fetch(`/api/ig-profile?handle=${igInput.replace('@', '')}`);
      const igData = await res.json();

      if (!res.ok) throw new Error(igData.error);

      // 2. 更新到 Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          ig_handle: igData.ig_handle,
          ig_name: igData.ig_name,
          ig_avatar_url: igData.ig_avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) throw error;

      // 3. 刷新前端狀態
      await fetchProfile();
      alert("IG Linked Successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to link IG. Make sure the account is public.");
    } finally {
      setIsLinking(false);
    }
  };

  if (!profile) return null; // 或顯示 Skeleton

  // 優先判斷要顯示的資訊 (IG 優先，沒有才用 Google)
  const displayAvatar = profile.ig_avatar_url || profile.avatar_url;
  const displayName = profile.ig_name || profile.username;
  const displaySubtext = profile.ig_handle ? `@${profile.ig_handle}` : profile.email;

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">{t('profile')}</h1>

        <div className="bg-card border rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
          {/* 大頭貼區塊 */}
          <div className="relative w-24 h-24 shrink-0 rounded-full overflow-hidden border border-border">
            {displayAvatar ? (
              <img src={displayAvatar} alt="avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center font-bold">
                {profile.email?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          {/* 基本資料區塊 */}
          <div className="flex flex-col w-full">
            <h2 className="text-2xl font-semibold">{displayName}</h2>
            <p className="text-sm text-muted-foreground">{displaySubtext}</p>

            {/* IG 綁定區塊 */}
            <div className="mt-6 pt-6 border-t border-border/40">
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <SiInstagram className="h-4 w-4 text-pink-500" />
                {t('link_instagram')}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t('link_instagram_placeholder')}
                  value={igInput}
                  onChange={(e) => setIgInput(e.target.value)}
                  className="flex h-10 w-full rounded-md border px-3 text-sm focus:ring-2"
                />
                <Button onClick={handleLinkIG} disabled={isLinking || !igInput}>
                  {isLinking ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Link'}
                </Button>
              </div>
              </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}