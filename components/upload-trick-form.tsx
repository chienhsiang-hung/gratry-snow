'use client'

import { supabase } from '@/lib/supabase';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud, Lock, Globe, X, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export function UploadTrickForm() {
  const t = useTranslations();
  const [privacy, setPrivacy] = useState<'private' | 'public'>('private');
  const [category, setCategory] = useState('');
  const [trickName, setTrickName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  // 狀態管理：增加「影片處理中」的狀態
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showOptional, setShowOptional] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const ffmpegRef = useRef(new FFmpeg());
  // 載入 FFmpeg (因為 GitHub Pages 無法設定 SharedArrayBuffer 的 Header，所以我們使用單執行緒版本)
  const loadFFmpeg = async () => {
    const ffmpeg = ffmpegRef.current;
    if (ffmpeg.loaded) return;
    
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
  };

  // 執行靜音處理的函數
  const processVideoToMute = async (inputFile: File): Promise<File> => {
    const ffmpeg = ffmpegRef.current;
    await loadFFmpeg();

    const inputName = 'input.mp4';
    const outputName = 'output.mp4';

    // 將使用者上傳的檔案寫入 FFmpeg 的虛擬檔案系統
    await ffmpeg.writeFile(inputName, await fetchFile(inputFile));

    // 核心指令：-c:v copy (複製影像不重壓) / -an (移除聲音)
    // 這個指令執行速度極快！
    await ffmpeg.exec(['-i', inputName, '-c:v', 'copy', '-an', outputName]);

    // 從虛擬檔案系統讀取處理好的檔案
    const data = await ffmpeg.readFile(outputName);
    
    const fileData = data as Uint8Array;
    const mutedBlob = new Blob([fileData.buffer as ArrayBuffer], { type: 'video/mp4' });
    return new File([mutedBlob], `muted_${inputFile.name}`, { type: 'video/mp4' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !category || !trickName) {
      alert('請填寫必填欄位並選擇影片！');
      return;
    }

    try {
      // --- 步驟 A：前端靜音處理 ---
      setIsProcessing(true);
      const mutedFile = await processVideoToMute(file);
      setIsProcessing(false);

      // --- 步驟 B：開始上傳至 YouTube ---
      setIsUploading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const providerToken = session?.provider_token;

      if (!providerToken) {
        alert('無法取得 Google 授權 Token。請嘗試登出並重新登入，確保有同意 YouTube 權限！');
        return;
      }

      const metadata = {
        snippet: {
          title: title || trickName,
          description: description || `招式: ${trickName}\n分類: ${category}\n\nUploaded via Gratry Snow`,
          categoryId: '17', 
        },
        status: {
          privacyStatus: 'unlisted', 
          embeddable: true, 
        },
      };

      const formData = new FormData();
      formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      
      // 注意：這裡改為上傳 mutedFile (靜音後的檔案)
      formData.append('file', mutedFile);

      const response = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${providerToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || '上傳失敗');
      }

      const videoId = data.id;
      
      // --- 步驟 C：寫入 Supabase 資料庫 ---
      const userId = session?.user?.id;
      if (!userId) throw new Error('無法取得使用者 ID');

      const { error: dbError } = await supabase
        .from('tricks')
        .insert([{
            user_id: userId,
            video_id: videoId,
            category: category,
            name: trickName,
            privacy: privacy,
            title: title || null,
            description: description || null,
        }]);

      if (dbError) throw new Error('寫入資料庫失敗');

      alert(`🎉 影片上傳且靜音成功！\nYouTube ID: ${videoId}`);
      clearFile();
      setTrickName('');
      setTitle('');
      setDescription('');

    } catch (error: any) {
      console.error(error);
      alert(`發生錯誤: ${error.message}`);
    } finally {
      setIsProcessing(false);
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
        <h2 className="text-2xl font-bold tracking-tight">{t("upload_title")}</h2>
        <p className="text-sm text-muted-foreground">{t("upload_subtitle")}</p>
      </div>

      <div className="space-y-6">
        {/* 影片檔案上傳區塊 */}
        <div className="flex w-full flex-col items-center justify-center gap-2">
          {!file ? (
            <label htmlFor="video-upload" className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted">
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <UploadCloud className="mb-3 h-8 w-8 text-muted-foreground" />
                <p className="mb-2 text-sm font-medium text-foreground">{t("click_to_upload")}</p>
                <p className="text-xs text-muted-foreground">{t("support_formats")}</p>
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
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('category')} <span className="text-destructive">*</span></label>
              <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('select_category')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Riding">Riding</SelectItem>
                <SelectItem value="Carving">Carving</SelectItem>
                <SelectItem value="Style">Style</SelectItem>
                <SelectItem value="GroundTrick">GroundTrick</SelectItem>
                <SelectItem value="Jump">Jump</SelectItem>
                <SelectItem value="Lock">Lock</SelectItem>
                <SelectItem value="Flip">Flip</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('trick_name')} <span className="text-destructive">*</span></label>
            <input 
              type="text" 
              value={trickName}
              onChange={(e) => setTrickName(e.target.value)}
              placeholder={t('trick_name_placeholder')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">{t('privacy_settings')}</label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${privacy === 'private' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}>
              <input type="radio" name="privacy" value="private" className="mt-1 sr-only" checked={privacy === 'private'} onChange={() => setPrivacy('private')} />
              <Lock className={`mt-0.5 h-5 w-5 shrink-0 ${privacy === 'private' ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{t('private_note')}</p>
                <p className="text-xs text-muted-foreground">{t('private_desc')}</p>
              </div>
            </label>
            
            <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${privacy === 'public' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}>
              <input type="radio" name="privacy" value="public" className="mt-1 sr-only" checked={privacy === 'public'} onChange={() => setPrivacy('public')} />
              <Globe className={`mt-0.5 h-5 w-5 shrink-0 ${privacy === 'public' ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{t('public_share')}</p>
                <p className="text-xs text-muted-foreground">{t('public_desc')}</p>
              </div>
            </label>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border bg-muted/10 p-4 transition-all">
          <button
            type="button" 
            onClick={() => setShowOptional(!showOptional)}
            className="flex w-full items-center justify-between text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <span>{t('youtube_optional')}</span>
            {showOptional ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showOptional && (
            <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-2">
                <input
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('video_title')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('video_desc')}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full text-base" size="lg" disabled={isProcessing || isUploading}>
        {isProcessing && (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('processing_video') || '影片靜音處理中...'}</>
        )}
        {!isProcessing && isUploading && (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('uploading') || '上傳至 YouTube...'}</>
        )}
        {!isProcessing && !isUploading && (t('submit_upload') || '確認上傳')}
      </Button>
    </form>
  );
}