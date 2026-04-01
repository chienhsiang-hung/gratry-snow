'use client'

import { supabase } from '@/lib/supabase/supabase';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud, Lock, Globe, X, ChevronDown, ChevronUp, CheckCircle2, Film, Server, Info, Link2 } from 'lucide-react';
import { SiInstagram } from "react-icons/si"; 
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
import { InstagramEmbed } from 'react-social-media-embed';

// ==========================================
// Sub-components: 成功畫面
// ==========================================
function SuccessView({ mode, onReset }: { mode: 'file' | 'url', onReset: () => void }) {
  const t = useTranslations();
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
          {mode === 'file' ? t("youtube_processing_desc") : t("ig_upload_success_desc")}
        </p>
      </div>
      <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button asChild size="lg" className="w-full sm:w-auto font-medium transition-transform hover:scale-105">
          <Link href="/">{t("back_to_home")}</Link>
        </Button>
        <Button variant="outline" size="lg" onClick={onReset} className="w-full sm:w-auto font-medium transition-transform hover:scale-105">
          {t("upload_another")}
        </Button>
      </div>
    </div>
  );
}

// ==========================================
// Sub-components: 處理中畫面
// ==========================================
function ProgressView({ 
  uploadStep, processProgress, uploadProgress, mode 
}: { 
  uploadStep: string, processProgress: number, uploadProgress: number, mode: 'file' | 'url' 
}) {
  const t = useTranslations();
  
  let overallProgress = 0;
  if (uploadStep === 'processing') overallProgress = processProgress * 0.3; 
  else if (uploadStep === 'uploading') overallProgress = 30 + (uploadProgress * 0.6); 
  else if (uploadStep === 'saving') overallProgress = 95; 

  const CurrentIcon = () => {
    switch (uploadStep) {
      case 'processing': return <Film className="h-6 w-6 animate-pulse text-primary" />;
      case 'uploading': return <UploadCloud className="h-6 w-6 animate-bounce text-primary" />;
      case 'saving': return <Server className="h-6 w-6 animate-pulse text-primary" />;
      default: return <Film className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <div className="w-full max-w-2xl rounded-xl border bg-card p-6 sm:p-8 shadow-sm flex flex-col items-center justify-center min-h-[400px] animate-in fade-in zoom-in-95 duration-300">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CurrentIcon />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {uploadStep === 'processing' && t('step_processing')}
            {uploadStep === 'uploading' && t('step_uploading')}
            {uploadStep === 'saving' && t('step_saving')}
          </h2>
          <p className="text-sm text-muted-foreground">{t('do_not_close')}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium transition-opacity duration-300">
            <span className="text-foreground">
              {uploadStep === 'processing' && t('frontend_muting')}
              {uploadStep === 'uploading' && t('uploading_to_youtube')}
              {uploadStep === 'saving' && t('saving_to_library')}
            </span>
            <span className="text-foreground font-mono">{Math.round(overallProgress)}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-primary transition-all duration-500 ease-in-out" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>

        {mode === 'file' && (
          <div className="mt-8 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 p-4 border border-blue-100 dark:border-blue-900 flex gap-3 items-start transition-colors">
            <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">{t('upload_notice_title')}</p>
              <p className="text-xs text-blue-800/80 dark:text-blue-200/80 leading-relaxed">
                {t('upload_notice_desc').split(/("Unlisted"|「不公開 \(Unlisted\)」)/).map((part, i) => 
                  part.match(/("Unlisted"|「不公開 \(Unlisted\)」)/) 
                    ? <span key={i} className="font-medium text-blue-700 dark:text-blue-300">{part}</span> 
                    : part
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// Main Component
// ==========================================
export function UploadTrickForm() {
  const t = useTranslations();
  
  // 表單狀態
  const [privacy, setPrivacy] = useState<'private' | 'public'>('private');
  const [category, setCategory] = useState('');
  const [trickName, setTrickName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [igUrl, setIgUrl] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [showOptional, setShowOptional] = useState(false);

  // 流程狀態
  const [uploadStep, setUploadStep] = useState<'idle' | 'processing' | 'uploading' | 'saving' | 'success'>('idle');
  const [processProgress, setProcessProgress] = useState(0); 
  const [uploadProgress, setUploadProgress] = useState(0);   

  const fileInputRef = useRef<HTMLInputElement>(null);
  const ffmpegRef = useRef(new FFmpeg());
  
  // 提取 IG ID 的 Regex
  const extractIgId = (url: string) => {
    const regex = /instagram\.com\/(?:p|reel|reels|s|stories)\/([^/?#&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };
  const isIgStory = igUrl.includes('/s/') || igUrl.includes('/stories/') || igUrl.includes('story_media_id');

  const loadFFmpeg = async () => {
    const ffmpeg = ffmpegRef.current;
    if (ffmpeg.loaded) return;
    
    ffmpeg.on('progress', ({ progress }) => setProcessProgress(Math.round(progress * 100)));

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

  const uploadToYouTubeWithProgress = (formData: FormData, token: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status');
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) setUploadProgress(Math.round((event.loaded / event.total) * 100));
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            const isAuthError = xhr.status === 401 || xhr.status === 403;
            reject(new Error((isAuthError ? '[AUTH_ERROR] ' : '') + (errorData.error?.message || '上傳失敗')));
          } catch {
            reject(new Error(`HTTP Error ${xhr.status}: 上傳失敗`));
          }
        }
      };
      xhr.onerror = () => reject(new Error('網路連線錯誤，無法上傳'));
      xhr.send(formData);
    });
  };

  const showAuthErrorToast = () => {
    toast.error(t('auth_expired'), {
      description: t('auth_expired_desc'),
      duration: 10000,
      action: {
        label: t('relogin'),
        onClick: async () => {
          await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { scopes: 'https://www.googleapis.com/auth/youtube.upload', redirectTo: window.location.href }
          });
        },
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadMode === 'file') {
      if (!file || !category || !trickName) return toast.error(t('error_missing_fields'));

      try {
        setUploadStep('processing');
        const mutedFile = await processVideoToMute(file);

        setUploadStep('uploading');
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.provider_token) {
          showAuthErrorToast();
          return setUploadStep('idle');
        }

        const metadata = {
          snippet: {
            title: title || trickName,
            description: description || `招式: ${trickName}\n分類: ${category}\n\nUploaded via Gratry Snow`,
            categoryId: '17', 
          },
          status: { privacyStatus: 'unlisted', embeddable: true },
        };

        const formData = new FormData();
        formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        formData.append('file', mutedFile);

        const data = await uploadToYouTubeWithProgress(formData, session.provider_token);
        
        setUploadStep('saving');
        const { error: dbError } = await supabase.from('tricks').insert([{
            user_id: session.user.id,
            video_id: data.id,
            video_type: 'youtube',
            category, name: trickName, privacy,
            title: title || null, description: description || null,
        }]);

        if (dbError) throw new Error('寫入資料庫失敗');
        setUploadStep('success');

      } catch (error: any) {
        if (error.message.includes('[AUTH_ERROR]')) showAuthErrorToast(); 
        else toast.error(`發生錯誤: ${error.message.replace('[AUTH_ERROR] ', '')}`); 
        setUploadStep('idle');
      }
    } else {
      // IG 模式
      const igId = extractIgId(igUrl);
      if (!igId) return toast.error(t('error_invalid_ig_url'));

      try {
        setUploadStep('saving');
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) throw new Error('無法取得使用者 ID');
        
        const { error: dbError } = await supabase.from('tricks').insert([{
            user_id: session.user.id,
            video_id: igUrl, 
            video_type: 'instagram',
            category, name: trickName, privacy,
            title: title || null, description: description || null,
        }]);
        
        if (dbError) throw new Error('寫入資料庫失敗');
        setUploadStep('success');
      } catch (error: any) {
        toast.error(`發生錯誤: ${error.message}`);
        setUploadStep('idle');
      }
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResetForm = () => {
    clearFile();
    setTrickName(''); setTitle(''); setDescription(''); setIgUrl('');
    setUploadStep('idle'); setProcessProgress(0); setUploadProgress(0);
  };

  // --- 渲染不同狀態 ---
  if (uploadStep === 'success') {
    return <SuccessView mode={uploadMode} onReset={handleResetForm} />;
  }

  if (uploadStep !== 'idle') {
    return <ProgressView uploadStep={uploadStep} processProgress={processProgress} uploadProgress={uploadProgress} mode={uploadMode} />;
  }

  // --- 預設表單 ---
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-8 rounded-xl border bg-card p-6 shadow-sm sm:p-8 relative">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">{t("upload_title")}</h2>
        <p className="text-sm text-muted-foreground">{t("upload_subtitle")}</p>
      </div>

      <div className="space-y-6">
        {/* 切換模式 */}
        <div className="flex w-full rounded-lg border bg-muted p-1">
          <button
            type="button"
            onClick={() => setUploadMode('file')}
            className={`
              flex flex-1 flex-col items-center justify-center gap-1 
              rounded-md py-2.5 text-xs leading-tight transition-all
              sm:flex-row sm:gap-2 sm:text-sm
              ${uploadMode === 'file' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}
            `}
          >
            <UploadCloud className="h-4 w-4 shrink-0" />
            {t('mode_file')}
          </button>
          <button
            type="button"
            onClick={() => setUploadMode('url')}
            className={`
              flex flex-1 flex-col items-center justify-center gap-1 
              rounded-md py-2.5 text-xs leading-tight transition-all
              sm:flex-row sm:gap-2 sm:text-sm
              ${uploadMode === 'url' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}
            `}
          >
            <Link2 className="h-4 w-4 shrink-0" />
            {t('mode_url')}
          </button>
        </div>

        {/* 檔案上傳 or 連結輸入 */}
        {uploadMode === 'file' ? (
          <div className="flex w-full flex-col items-center justify-center gap-2 animate-in fade-in duration-300">
            {!file ? (
              <label htmlFor="video-upload" className="group flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/30 transition-all duration-300 hover:border-primary/50 hover:bg-primary/5">
                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                  <div className="mb-4 rounded-full bg-background p-4 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md">
                    <UploadCloud className="h-8 w-8 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                  <p className="mb-2 text-sm font-semibold text-foreground">{t("click_to_upload")}</p>
                  <p className="text-xs text-muted-foreground">{t("support_formats")}</p>
                </div>
                <input id="video-upload" type="file" accept="video/*" className="hidden" ref={fileInputRef} onChange={(e) => setFile(e.target.files?.[0] || null)} />
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
        ) : (
          <div className="flex w-full flex-col gap-4 animate-in fade-in duration-300">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('ig_link_label')} <span className="text-destructive">*</span></label>
              <input type="url" value={igUrl} onChange={(e) => setIgUrl(e.target.value)} placeholder={t('ig_url_placeholder')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" required={uploadMode === 'url'} />
            </div>
            {igUrl && extractIgId(igUrl) ? (
              isIgStory ? (
                // 限時動態/精選動態的 Fallback UI
                <div className="w-full rounded-xl border border-primary/20 bg-primary/5 p-6 flex flex-col items-center justify-center animate-in zoom-in-95">
                  <div className="rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px] mb-3">
                    <div className="bg-background rounded-full p-2">
                      <SiInstagram className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                  <p className="text-sm font-bold mb-1">{t('ig_story_recorded')}</p>
                  <p className="text-xs text-muted-foreground text-center max-w-[280px]">{t('ig_story_no_preview')}</p>
                </div>
              ) : (
                // 一般貼文/Reels 的正常預覽
                <div className="w-full rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col items-center justify-center animate-in zoom-in-95">
                  <p className="text-xs text-muted-foreground mb-3 font-medium">{t('ig_preview_confirm')}</p>
                  <div className="w-full max-w-[328px] overflow-hidden rounded-lg shadow-sm pointer-events-none opacity-90">
                    <InstagramEmbed url={igUrl} width="100%" />
                  </div>
                </div>
              )
            ) : igUrl ? (
              <p className="text-xs text-destructive flex items-center gap-1"><Info className="h-3 w-3" /> {t('error_invalid_ig_url')}</p>
            ) : null}
          </div>
        )}

        {/* 基礎資訊表單 */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('category')} <span className="text-destructive">*</span></label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="w-full"><SelectValue placeholder={t('select_category')} /></SelectTrigger>
              <SelectContent>
                {['Riding', 'Carving', 'Style', 'GroundTrick', 'Jump', 'Lock', 'Flip'].map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('trick_name')} <span className="text-destructive">*</span></label>
            <input type="text" value={trickName} onChange={(e) => setTrickName(e.target.value)} placeholder={t('trick_name_placeholder')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" required />
          </div>
        </div>

        {/* 隱私設定 */}
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

        {/* YouTube 附加資訊 */}
        <div className="space-y-4 rounded-lg border bg-muted/10 p-4 transition-all">
          <button type="button" onClick={() => setShowOptional(!showOptional)} className="flex w-full items-center justify-between text-sm font-medium text-muted-foreground hover:text-foreground">
            <span>{t('youtube_optional')}</span>
            {showOptional ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {showOptional && (
            <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('video_title')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('video_desc')} className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full text-base relative overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]" size="lg" disabled={uploadMode === 'file' ? !file : !igUrl}>
        {t('submit_upload')}
      </Button>
    </form>
  );
}