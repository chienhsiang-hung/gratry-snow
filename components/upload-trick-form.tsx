'use client'

import { supabase } from '@/lib/supabase/supabase';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud, Lock, Globe, X, ChevronDown, ChevronUp, Loader2, CheckCircle2, Film, Server } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { toast } from 'sonner';
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

  // 狀態管理
  const [uploadStep, setUploadStep] = useState<'idle' | 'processing' | 'uploading' | 'saving' | 'success'>('idle');
  const [processProgress, setProcessProgress] = useState(0); // FFmpeg 進度
  const [uploadProgress, setUploadProgress] = useState(0);   // YouTube 上傳進度
  const [showOptional, setShowOptional] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const ffmpegRef = useRef(new FFmpeg());

  // 載入 FFmpeg
  const loadFFmpeg = async () => {
    const ffmpeg = ffmpegRef.current;
    if (ffmpeg.loaded) return;
    
    ffmpeg.on('progress', ({ progress }) => {
      setProcessProgress(Math.round(progress * 100));
    });

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
  };

  const processVideoToMute = async (inputFile: File): Promise<File> => {
    const ffmpeg = ffmpegRef.current;
    await loadFFmpeg();

    const inputName = 'input.mp4';
    const outputName = 'output.mp4';

    await ffmpeg.writeFile(inputName, await fetchFile(inputFile));
    await ffmpeg.exec(['-i', inputName, '-c:v', 'copy', '-an', outputName]);

    const data = await ffmpeg.readFile(outputName);
    const fileData = data as Uint8Array;
    const mutedBlob = new Blob([fileData.buffer as ArrayBuffer], { type: 'video/mp4' });
    return new File([mutedBlob], `muted_${inputFile.name}`, { type: 'video/mp4' });
  };

  // 輔助函數：使用 XMLHttpRequest 支援進度條的上傳
  const uploadToYouTubeWithProgress = (formData: FormData, token: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status');
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      
      // 監聽上傳進度
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            reject(new Error(errorData.error?.message || '上傳失敗'));
          } catch {
            reject(new Error('上傳失敗'));
          }
        }
      };
      
      xhr.onerror = () => reject(new Error('網路連線錯誤，無法上傳'));
      xhr.send(formData);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !category || !trickName) {
      toast.error(t('error_missing_fields'));
      return;
    }

    try {
      // --- 步驟 A：前端靜音處理 ---
      setUploadStep('processing');
      setProcessProgress(0);
      const mutedFile = await processVideoToMute(file);

      // --- 步驟 B：開始上傳至 YouTube ---
      setUploadStep('uploading');
      setUploadProgress(0);
      
      const { data: { session } } = await supabase.auth.getSession();
      const providerToken = session?.provider_token;

      if (!providerToken) {
        toast.error(t('error_no_token'));
        setUploadStep('idle');
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
      formData.append('file', mutedFile);

      // 改用 XHR 來獲取進度
      const data = await uploadToYouTubeWithProgress(formData, providerToken);
      const videoId = data.id;
      
      // --- 步驟 C：寫入 Supabase 資料庫 ---
      setUploadStep('saving');
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

      // 觸發成功畫面
      toast.success(t('upload_success'));
      setUploadStep('success');

    } catch (error: any) {
      console.error(error);
      toast.error(`發生錯誤: ${error.message}`);
      setUploadStep('idle');
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResetForm = () => {
    clearFile();
    setTrickName('');
    setTitle('');
    setDescription('');
    setUploadStep('idle');
    setProcessProgress(0);
    setUploadProgress(0);
  };

  // ==========================================
  // 畫面 A：成功狀態 UI
  // ==========================================
  if (uploadStep === 'success') {
    return (
      <div className="w-full max-w-2xl space-y-6 rounded-2xl border bg-card p-10 shadow-lg text-center animate-in zoom-in-95 duration-500">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-500/10 p-4 animate-in zoom-in duration-500 delay-150">
            <CheckCircle2 className="h-16 w-16 text-green-500 drop-shadow-sm animate-bounce" />
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight">{t("upload_success")}</h2>
          <p className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
            {t("youtube_processing_desc")}
          </p>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="w-full sm:w-auto font-medium transition-transform hover:scale-105">
            <Link href="/">
              {t("back_to_home")}
            </Link>
          </Button>
          <Button variant="outline" size="lg" onClick={handleResetForm} className="w-full sm:w-auto font-medium transition-transform hover:scale-105">
            {t("upload_another")}
          </Button>
        </div>
      </div>
    );
  }

  // ==========================================
  // 畫面 B：上傳處理中的進度 UI (替換掉整個表單)
  // ==========================================
  if (uploadStep !== 'idle') {
    return (
      <div className="w-full max-w-2xl rounded-xl border bg-card p-8 shadow-sm flex flex-col items-center justify-center min-h-[400px] animate-in fade-in zoom-in-95 duration-300">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              {uploadStep === 'processing' && t('step_processing')}
              {uploadStep === 'uploading' && t('step_uploading')}
              {uploadStep === 'saving' && t('step_saving')}
            </h2>
            <p className="text-sm text-muted-foreground">{t('do_not_close')}</p>
          </div>

          <div className="space-y-6">
            {/* Step 1: 處理影片 */}
            <div className={`flex items-center gap-4 ${uploadStep === 'processing' ? 'opacity-100' : 'opacity-40'}`}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                {uploadStep === 'uploading' || uploadStep === 'saving' ? <CheckCircle2 className="h-5 w-5" /> : <Film className={`h-5 w-5 ${uploadStep === 'processing' ? 'animate-pulse' : ''}`} />}
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex justify-between text-sm font-medium">
                  <span>{t('frontend_muting')}</span>
                  <span>{uploadStep === 'processing' ? `${processProgress}%` : t('completed')}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: uploadStep === 'processing' ? `${processProgress}%` : '100%' }} />
                </div>
              </div>
            </div>

            {/* Step 2: 上傳影片 */}
            <div className={`flex items-center gap-4 ${uploadStep === 'uploading' ? 'opacity-100' : uploadStep === 'saving' ? 'opacity-40' : 'opacity-30 grayscale'}`}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                {uploadStep === 'saving' ? <CheckCircle2 className="h-5 w-5" /> : <UploadCloud className={`h-5 w-5 ${uploadStep === 'uploading' ? 'animate-bounce' : ''}`} />}
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex justify-between text-sm font-medium">
                  <span>{t('uploading_to_youtube')}</span>
                  <span>{uploadStep === 'uploading' ? `${uploadProgress}%` : uploadStep === 'saving' ? t('completed') : ''}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: uploadStep === 'uploading' ? `${uploadProgress}%` : uploadStep === 'saving' ? '100%' : '0%' }} />
                </div>
              </div>
            </div>

            {/* Step 3: 寫入資料庫 */}
            <div className={`flex items-center gap-4 ${uploadStep === 'saving' ? 'opacity-100' : 'opacity-30 grayscale'}`}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Server className={`h-5 w-5 ${uploadStep === 'saving' ? 'animate-pulse' : ''}`} />
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex justify-between text-sm font-medium">
                  <span>{t('saving_to_library')}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className={`h-full bg-primary transition-all duration-500 ease-out ${uploadStep === 'saving' ? 'w-full' : 'w-0'}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 畫面 C：預設表單 UI (idle 狀態)
  // ==========================================
  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full max-w-2xl space-y-8 rounded-xl border bg-card p-6 shadow-sm sm:p-8 relative"
    >
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">{t("upload_title")}</h2>
        <p className="text-sm text-muted-foreground">{t("upload_subtitle")}</p>
      </div>

      <div className="space-y-6">
        {/* 影片檔案上傳區塊 */}
        <div className="flex w-full flex-col items-center justify-center gap-2">
          {!file ? (
            <label htmlFor="video-upload" className="group flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/30 transition-all duration-300 hover:border-primary/50 hover:bg-primary/5">
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <div className="mb-4 rounded-full bg-background p-4 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md">
                  <UploadCloud className="h-8 w-8 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <p className="mb-2 text-sm font-semibold text-foreground">{t("click_to_upload")}</p>
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
            <div className="flex w-full items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4 transition-all animate-in zoom-in-95">
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

      <Button type="submit" className="w-full text-base relative overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]" size="lg">
        {t('submit_upload')}
      </Button>
    </form>
  );
}