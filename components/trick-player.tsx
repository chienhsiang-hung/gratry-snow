'use client'

import { useState, useEffect } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import { Button } from '@/components/ui/button';
import { FlipHorizontal, VolumeX, Volume2, Play, Pause } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function TrickPlayer({ videoId }: { videoId: string }) {
  const t = useTranslations();
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMirrored, setIsMirrored] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // 💡 預設改為 false，等 YouTube 真正開始播放時再變 true，避免被瀏覽器阻擋自動播放時狀態不同步
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false); // 判斷使用者是否正在拖拉進度條

  const onReady = (event: YouTubeEvent) => {
    const ytPlayer = event.target;
    setPlayer(ytPlayer);
    ytPlayer.mute();
    setIsMuted(true);
    setDuration(ytPlayer.getDuration()); // 取得影片總長度
  };

  // 💡 直接吃 YouTube 官方的事件，確保按鈕狀態 100% 同步
  const handlePlay = (event: YouTubeEvent) => {
    setIsPlayingVideo(true);
    setDuration(event.target.getDuration() || 0);
  };
  const handlePause = () => setIsPlayingVideo(false);
  const handleEnd = () => setIsPlayingVideo(false);

  // 進度條同步
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

  // 播放與暫停控制
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
    setCurrentTime(time); // 讓畫面即時跟著拖拉的數值變動
    if (player) {
      player.seekTo(time, true); // 命令 YouTube 跳轉到該秒數
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

  return (
    <div className="space-y-3 w-full">
      {/* 影片播放區塊 (單獨翻轉這塊) */}
      <div 
        className={`relative aspect-video w-full overflow-hidden rounded-xl bg-black transition-transform duration-500 ${
          isMirrored ? '-scale-x-100' : ''
        }`}
      >
        <YouTube
          videoId={videoId}
          opts={{
            width: '100%',
            height: '100%',
            playerVars: {
              autoplay: 1, // 自動播放
              rel: 0,      // 不顯示無關的推薦影片
              modestbranding: 1, // 隱藏 YouTube Logo
              controls: 0, // 💡 魔法在這裡：關閉原生 YouTube 控制列！
              disablekb: 1, // 關閉 YouTube 預設鍵盤控制，以免干擾
              playsinline: 1, // 避免 iOS 自動全螢幕彈出
            }
          }}
          onReady={onReady}
          onPlay={handlePlay}     // ✨ 綁定官方事件
          onPause={handlePause}   // ✨ 綁定官方事件
          onEnd={handleEnd}       // ✨ 綁定官方事件
          className="absolute inset-0 h-full w-full pointer-events-none"
          iframeClassName="h-full w-full border-0"
        />
      </div>

      {/* 控制面板 */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-muted/40 p-3 shadow-sm">
        
        {/* 第一排：進度條與播放按鈕 */}
        <div className="flex items-center gap-3 w-full px-1">
          <button 
            onClick={togglePlayPause} 
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
          >
            {isPlayingVideo ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
          </button>

          <span className="text-xs font-medium tabular-nums text-muted-foreground w-10 text-right shrink-0">
            {formatTime(currentTime)}
          </span>

          {/* 超順暢原生 Range 進度條 */}
          <input
            type="range"
            min={0}
            max={duration || 1}
            step="0.01"
            value={currentTime}
            onPointerDown={() => setIsDragging(true)}
            onPointerUp={() => setIsDragging(false)}
            onChange={handleSeekChange}
            className="flex-1 h-1.5 cursor-pointer rounded-full bg-muted-foreground/30"
            // 使用內聯樣式將左側進度塗上主色 (取代 accent-color 達到更完美的 UI)
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) ${(currentTime / (duration || 1)) * 100}%, transparent ${(currentTime / (duration || 1)) * 100}%)`
            }}
          />

          <span className="text-xs font-medium tabular-nums text-muted-foreground w-10 shrink-0">
            {formatTime(duration)}
          </span>
        </div>

        {/* 第二排：實用工具區 (速度, 靜音, 視角) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-2">
            <span className="mr-1 text-sm font-semibold text-muted-foreground">{t('speed')}</span>
              {[0.25, 0.5, 0.75, 1].map((rate) => (
                <Button
                  key={rate}
                  variant={playbackRate === rate ? "default" : "outline"}
                  size="sm"
                  onClick={() => changeSpeed(rate)}
                  // 💡 修改這裡：特別針對劇院模式的深色背景，強制設定未選中狀態的配色
                  className={`h-8 px-2.5 text-xs font-medium transition-all ${
                    playbackRate !== rate
                      // 未選中狀態：強制白色文字、淡色邊框、Hover 時更亮
                      ? 'text-white/90 border-white/20 hover:bg-white/10 hover:text-white' 
                      : '' // 選中狀態保持原本的 variant="default" 配色
                  }`}
                >
                 {rate}x
                </Button>
              ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleMute}
              className="h-8 w-8 p-0 text-muted-foreground"
              title={isMuted ? t('unmute') : t('mute')}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>

            <Button
              variant={isMirrored ? "default" : "secondary"}
              size="sm"
              onClick={() => setIsMirrored(!isMirrored)}
              className="h-8 gap-1.5 px-3 text-xs font-medium"
            >
              <FlipHorizontal className="h-4 w-4" />
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