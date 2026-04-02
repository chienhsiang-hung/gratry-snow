'use client'

import { useState, useEffect } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import { Button } from '@/components/ui/button';
import { FlipHorizontal, VolumeX, Volume2, Play, Pause, ExternalLink } from 'lucide-react';
import { SiInstagram } from "react-icons/si"; 
import { useTranslations, useLocale } from 'next-intl';
import { InstagramEmbed } from 'react-social-media-embed';
import Script from 'next/script';

export function TrickPlayer({ videoId, videoType='youtube' }: { videoId: string, videoType?: string }) {
  const t = useTranslations();
  const locale = useLocale();

  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMirrored, setIsMirrored] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // 🚀 新增：用來判斷是否為直式影片 (Shorts/Reels)
  const [isVertical, setIsVertical] = useState(false);
  const igLocale = locale.includes('zh') ? 'zh_TW' : 'en_US';

  // 🚀 新增：透過 YouTube oEmbed API 獲取影片原始比例
  useEffect(() => {
    const checkVideoFormat = async () => {
      try {
        const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/shorts/${videoId}&format=json`);
        if (res.ok) {
          const data = await res.json();
          // 如果寬度小於高度，代表這是直式影片 (Shorts)
          if (data.width && data.height && data.width < data.height) {
            setIsVertical(true);
          } else {
            setIsVertical(false);
          }
        }
      } catch (e) {
        console.error("Failed to fetch video metadata", e);
      }
    };

    if (videoId) {
      checkVideoFormat();
    }
  }, [videoId]);

  const onReady = async (event: YouTubeEvent) => {
    const ytPlayer = event.target;
    setPlayer(ytPlayer);
    ytPlayer.mute();
    setIsMuted(true);

    const duration = await ytPlayer.getDuration();
    setDuration(duration);
  };

  const handlePlay = async (event: YouTubeEvent) => {
    setIsPlayingVideo(true);

    const duration = await event.target.getDuration() || 0;
    setDuration(duration);
  };
  const handlePause = () => setIsPlayingVideo(false);
  const handleEnd = () => setIsPlayingVideo(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (player && isPlayingVideo && !isDragging) {
      interval = setInterval(async () => {
        const time = await player.getCurrentTime();
        setCurrentTime(time);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [player, isPlayingVideo, isDragging]);

  const togglePlayPause = () => {
    if (player) {
      if (isPlayingVideo) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (player) {
      player.seekTo(time, true);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const changeSpeed = (rate: number) => {
    if (player) {
      player.setPlaybackRate(rate);
      setPlaybackRate(rate);
    }
  };

  const toggleMute = () => {
    if (player) {
      if (isMuted) player.unMute();
      else player.mute();
      setIsMuted(!isMuted);
    }
  };

  if (videoType === 'instagram') {
    // 判斷是否為限時動態或精選
    const isIgStory = videoId.includes('/s/') || videoId.includes('/stories/') || videoId.includes('story_media_id');

    if (isIgStory) {
      return (
        <div className="flex flex-col items-center justify-center w-full max-w-[400px] mx-auto bg-black/40 border border-white/10 rounded-2xl overflow-hidden aspect-[9/16] p-6 text-center shadow-2xl backdrop-blur-xl transition-all">
          {/* IG 漸層外框 Icon */}
          <div className="rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px] mb-5 shadow-lg">
            <div className="bg-black rounded-full p-4">
              <SiInstagram className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <p className="text-white font-bold mb-2 text-lg tracking-wide">{t('ig_story_recorded')}</p>
          <p className="text-white/60 text-sm mb-8 max-w-[260px] leading-relaxed">
            {t('ig_story_no_preview')}
          </p>
          
          {/* 前往 IG 觀看按鈕 */}
          <Button asChild size="lg" className="rounded-full font-bold bg-white text-black hover:bg-gray-200 transition-transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)] w-full max-w-[200px]">
            <a href={videoId} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
              <ExternalLink className="h-4 w-4" />
              {t('view_on_ig')}
            </a>
          </Button>
        </div>
      );
    }

    // 一般的 Reels 或貼文，正常顯示 Embed
    // 順便加上 max-w-[400px] 與 mx-auto，避免在電腦版上被拉得太巨大
    return (
      <div className="flex justify-center w-full max-w-[400px] mx-auto bg-black rounded-2xl overflow-hidden aspect-[9/16] shadow-xl">
        <InstagramEmbed url={videoId} width="100%" linkText={t('view_on_ig')} />
      </div>
    );
  }

  return (
    // 🚀 修改：如果偵測到是直式影片，就限制最大寬度並置中，看起來才像手機
    <div className={`group w-full space-y-4 mx-auto transition-all duration-500 ${isVertical ? 'max-w-[400px]' : 'max-w-full'}`}>
      
      {/* 🚀 修改：根據 isVertical 切換為 aspect-[9/16] 或是 aspect-video (16:9) */}
      <div 
        className={`relative w-full overflow-hidden rounded-2xl bg-black ring-1 ring-white/10 shadow-2xl transition-all duration-500 ${
          isVertical ? 'aspect-[9/16]' : 'aspect-video'
        } ${
          isMirrored ? '-scale-x-100' : ''
        }`}
      >
        <YouTube
          videoId={videoId}
          opts={{
            width: '100%',
            height: '100%',
            playerVars: {
              autoplay: 1,
              rel: 0,
              modestbranding: 1,
              controls: 0,
              disablekb: 1,
              playsinline: 1,
            }
          }}
          onReady={onReady}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnd={handleEnd}
          className="absolute inset-0 h-full w-full pointer-events-none"
          iframeClassName="h-full w-full border-0"
        />
      </div>

      {/* 控制面板 */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 shadow-xl backdrop-blur-xl transition-all duration-300">
        
        {/* 第一排：進度條與播放按鈕 */}
        <div className="flex items-center gap-4 w-full px-1">
          <button 
            onClick={togglePlayPause} 
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black transition-all hover:scale-105 hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_15px_rgba(var(--primary),0.5)]"
          >
            {isPlayingVideo ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-1" />}
          </button>

          <span className="text-xs font-medium tabular-nums text-white/70 w-9 text-right shrink-0">
            {formatTime(currentTime)}
          </span>

          {/* 進度條 */}
          <div className="relative flex-1 group/slider flex items-center h-4 cursor-pointer">
            <input
              type="range"
              min={0}
              max={duration || 1}
              step="0.01"
              value={currentTime}
              onPointerDown={() => setIsDragging(true)}
              onPointerUp={() => setIsDragging(false)}
              onChange={handleSeekChange}
              className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
            />
            {/* 自訂進度條視覺 */}
            <div className="h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-75 ease-linear"
                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              />
            </div>
            {/* 拖拉點 (Thumb) */}
            <div 
              className="absolute h-3 w-3 rounded-full bg-white shadow-md transition-transform scale-0 group-hover/slider:scale-100"
              style={{ left: `calc(${(currentTime / (duration || 1)) * 100}% - 6px)` }}
            />
          </div>

          <span className="text-xs font-medium tabular-nums text-white/50 w-9 shrink-0">
            {formatTime(duration)}
          </span>
        </div>

        {/* 第二排：實用工具區 (速度, 靜音, 視角) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="mr-1 hidden sm:inline-block text-xs font-semibold uppercase tracking-wider text-white/40">{t('speed')}</span>
              {[0.25, 0.5, 0.75, 1].map((rate) => (
                <Button
                  key={rate}
                  variant="ghost"
                  size="sm"
                  onClick={() => changeSpeed(rate)}
                  className={`h-7 px-2 text-xs font-medium rounded-full transition-all ${
                    playbackRate === rate
                      ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                 {rate}x
                </Button>
              ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="h-8 w-8 rounded-full p-0 text-white/70 hover:bg-white/10 hover:text-white"
              title={isMuted ? t('unmute') : t('mute')}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>

            <Button
              variant={isMirrored ? "default" : "outline"}
              size="sm"
              onClick={() => setIsMirrored(!isMirrored)}
              className={`h-8 gap-1.5 px-3 text-xs font-medium rounded-full transition-all border-white/10 ${
                isMirrored 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'bg-white/5 text-white/90 hover:bg-white/15'
              }`}
            >
              <FlipHorizontal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {isMirrored ? t('regular_stance') : t('goofy_stance')}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}