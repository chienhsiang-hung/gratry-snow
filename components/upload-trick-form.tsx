'use client'

import { supabase } from '@/lib/supabase';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud, Lock, Globe, X } from 'lucide-react';

export function UploadTrickForm() {
  const [privacy, setPrivacy] = useState<'private' | 'public'>('private');
  const [category, setCategory] = useState('');
  const [trickName, setTrickName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !category || !trickName) {
      alert('請填寫必填欄位並選擇影片！');
      return;
    }

    setIsUploading(true);
    
    try {
      // 1. 取得當前 Session 中的 Google Provider Token
      const { data: { session } } = await supabase.auth.getSession();
      const providerToken = session?.provider_token;

      if (!providerToken) {
        alert('無法取得 Google 授權 Token。請嘗試登出並重新登入，確保有同意 YouTube 權限！');
        setIsUploading(false);
        return;
      }

      // 2. 準備 YouTube 影片的 Metadata (中繼資料)
      const metadata = {
        snippet: {
          title: title || trickName, // 若沒填標題，預設用招式名稱
          description: description || `招式: ${trickName}\n分類: ${category}\n\nUploaded via Gratry Snow`,
          categoryId: '17', // 17 代表 YouTube 的 "Sports" (體育) 類別
        },
        status: {
          // 私人筆記設為 private。
          // 公開分享建議設為 unlisted (非公開)，這樣網站能正常播放，但不會把使用者的個人頻道洗版。
          privacyStatus: privacy === 'private' ? 'private' : 'unlisted', 
          embeddable: true, // 允許在你的網站上透過 iframe 嵌入播放
        },
      };

      // 3. 建立 Multipart FormData
      const formData = new FormData();
      formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      formData.append('file', file);

      // 4. 發送請求至 YouTube Data API
      const response = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${providerToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('YouTube API Error:', data);
        throw new Error(data.error?.message || '上傳失敗');
      }

      const videoId = data.id;
      console.log('上傳成功！YouTube Video ID:', videoId);
      alert(`🎉 影片上傳成功！YouTube ID: ${videoId}`);

      // TODO: 下一步，我們要將 videoId、category、trickName 等資料寫入 Supabase 資料庫！
      
      // 清空表單
      // clearFile();
      // setTrickName('');
      // setTitle('');
      // setDescription('');

    } catch (error: any) {
      console.error(error);
      alert(`發生錯誤: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-8 rounded-xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">上傳招式影片</h2>
        <p className="text-sm text-muted-foreground">將影片直接上傳至你的 YouTube 頻道，並收錄到 Gratry Snow 招式庫中。</p>
      </div>

      <div className="space-y-6">
        {/* 影片檔案上傳區塊 */}
        <div className="flex w-full flex-col items-center justify-center gap-2">
          {!file ? (
            <label htmlFor="video-upload" className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted">
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <UploadCloud className="mb-3 h-8 w-8 text-muted-foreground" />
                <p className="mb-2 text-sm font-medium text-foreground">點擊選擇影片</p>
                <p className="text-xs text-muted-foreground">支援 MP4, WebM 等常見格式</p>
              </div>
              <input 
                id="video-upload" 
                type="file" 
                accept="video/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          ) : (
            <div className="flex w-full items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <UploadCloud className="h-5 w-5 text-primary" />
                </div>
                <div className="truncate">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={clearFile} className="shrink-0 text-muted-foreground hover:text-destructive">
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* 必填：招式類別 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">招式類別 <span className="text-destructive">*</span></label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            >
              <option value="" disabled>選擇類別...</option>
              <option value="classic">Classic (經典)</option>
              <option value="style">Style (風格)</option>
              <option value="jump">Jump (跳躍)</option>
              <option value="lock">Lock (鎖定)</option>
            </select>
          </div>

          {/* 必填：招式名稱 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">招式名稱 <span className="text-destructive">*</span></label>
            <input 
              type="text" 
              value={trickName}
              onChange={(e) => setTrickName(e.target.value)}
              placeholder="例如: Nollie 360"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
          </div>
        </div>

        {/* 隱私設定 */}
        <div className="space-y-3">
          <label className="text-sm font-medium">影片隱私設定 (收錄方式)</label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${privacy === 'private' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}>
              <input type="radio" name="privacy" value="private" className="mt-1 sr-only" checked={privacy === 'private'} onChange={() => setPrivacy('private')} />
              <Lock className={`mt-0.5 h-5 w-5 shrink-0 ${privacy === 'private' ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">私人筆記</p>
                <p className="text-xs text-muted-foreground">收錄為私人用途，僅限自己觀看</p>
              </div>
            </label>
            
            <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${privacy === 'public' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}>
              <input type="radio" name="privacy" value="public" className="mt-1 sr-only" checked={privacy === 'public'} onChange={() => setPrivacy('public')} />
              <Globe className={`mt-0.5 h-5 w-5 shrink-0 ${privacy === 'public' ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">公開分享</p>
                <p className="text-xs text-muted-foreground">發佈至公共招式庫，可被評分與留言</p>
              </div>
            </label>
          </div>
        </div>

        {/* 選填：標題與描述 */}
        <div className="space-y-4 rounded-lg bg-muted/30 p-4">
          <p className="text-sm font-medium text-muted-foreground">YouTube 影片資訊 (選填)</p>
          <div className="space-y-2">
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="影片標題 (若留空將預設為招式名稱)"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="在此記錄發力點、重心位置，這段文字也會同步為 YouTube 影片說明..."
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full text-base" size="lg" disabled={isUploading}>
        {isUploading ? '正在上傳至 YouTube...' : '確認並上傳'}
      </Button>
    </form>
  );
}