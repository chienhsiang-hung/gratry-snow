import { NextResponse } from "next/server";

interface InstagramResponse {
  // 根據 API 回傳結果定義型別，這裡先用 any 或記錄已知欄位
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
    console.log(result);

    return NextResponse.json({
      ig_handle: handle,
      ig_name: result.result.full_name,
      ig_avatar_url: result.result.profile_pic_url,
    });
  } catch (error) {
    console.error('Error fetching Instagram profile:', error);
    return NextResponse.json({ error: 'Failed to fetch Instagram data' }, { status: 500 });
  }
};