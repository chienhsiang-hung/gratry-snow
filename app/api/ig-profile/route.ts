import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'; // 🟢 1. 記得引入 Supabase

// 🟢 2. 初始化一個具備最高權限的 Supabase Admin (專門用來在後端操作 Storage)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface InstagramResponse {
  [key: string]: any;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get('handle');

  if (!handle) {
    return NextResponse.json({ error: 'IG handle is required' }, { status: 400 });
  }

  const url = `https://${process.env.RAPIDAPI_HOST}/api/instagram/profile`;

  const options: RequestInit = {
    method: 'POST',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
      'x-rapidapi-host': process.env.RAPIDAPI_HOST || '',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: handle
    })
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error('Failed to fetch IG profile');

    const result: InstagramResponse = await response.json();
    console.log("RapidAPI Result:", result.result.full_name);

    // 從 RapidAPI 拿到的原始圖片網址 (會過期的那個)
    const originalAvatarUrl = result.result.profile_pic_url;
    let finalAvatarUrl = originalAvatarUrl;

    // 🟢 3. 轉存圖片到 Supabase Storage 的邏輯
    if (originalAvatarUrl) {
      try {
        // 從 IG CDN 把圖片下載到我們的後端記憶體中
        // (後端 fetch 沒有瀏覽器的 Referer 限制，通常可以直接抓到圖)
        const imageRes = await fetch(originalAvatarUrl);
        const arrayBuffer = await imageRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 建立不重複的檔名 (例如: markz-1709123456789.jpg)
        const fileName = `${handle}-${Date.now()}.jpg`;

        // 上傳到你剛剛建立的 'avatars' 儲存桶
        const { error: uploadError } = await supabaseAdmin.storage
          .from('avatars')
          .upload(fileName, buffer, {
            contentType: 'image/jpeg',
            upsert: true // 如果同名就直接覆蓋
          });

        if (uploadError) {
          console.error('Supabase Storage upload error:', uploadError);
        } else {
          // 上傳成功！取得我們自己的公開網址
          const { data: { publicUrl } } = supabaseAdmin.storage
            .from('avatars')
            .getPublicUrl(fileName);
            
          // 替換掉原本的網址
          finalAvatarUrl = publicUrl;
        }
      } catch (uploadProcessError) {
        console.error('Failed to process and upload image:', uploadProcessError);
        // 如果轉存失敗，我們就不覆蓋 finalAvatarUrl，讓它 fallback 回傳 IG 原本的網址
      }
    }

    return NextResponse.json({
      ig_handle: handle,
      ig_name: result.result.full_name,
      ig_avatar_url: finalAvatarUrl, // 🟢 4. 回傳我們 Supabase 的永久網址！
    });

  } catch (error) {
    console.error('Error fetching Instagram profile:', error);
    return NextResponse.json({ error: 'Failed to fetch Instagram data' }, { status: 500 });
  }
}