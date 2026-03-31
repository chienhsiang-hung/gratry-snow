import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { TrickList } from '@/components/tricks/trick-list';

export default async function PublicProfilePage({ params }: { params: { id: string, locale: string } }) {
  const supabase = await createClient();
  const { id } = params;

  // 1. 抓取該使用者的公開資料
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (!profile) notFound();

  // 2. 抓取該使用者的公開招式
  const { data: tricks } = await supabase
    .from('tricks')
    .select('*, profiles(*)')
    .eq('user_id', id)
    .eq('privacy', 'public')
    .order('created_at', { ascending: false });

  const displayAvatar = profile.ig_avatar_url || profile.avatar_url;
  const displayName = profile.ig_name || profile.username;
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* 使用者資訊 Header */}
      <div className="flex flex-col items-center mb-12 border-b pb-12">
        <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-background shadow-lg mb-4">
          <img src={displayAvatar} alt={displayName} className="h-full w-full object-cover" />
        </div>
        <h1 className="text-3xl font-bold">{displayName}</h1>
        {profile.ig_handle && (
          <a href={`https://instagram.com/${profile.ig_handle}`} target="_blank" className="text-pink-500 mt-2">
            @{profile.ig_handle}
          </a>
        )}
      </div>

      {/* 該使用者的招式列表 */}
      <h2 className="text-xl font-semibold mb-6">Tricks</h2>
      <TrickList initialTricks={tricks || []} />
    </div>
  );
}