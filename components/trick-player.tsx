'use client'

import { useState } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import { Button } from '@/components/ui/button';
import { FlipHorizontal, VolumeX, Volume2 } from 'lucide-react';

export function TrickPlayer({ videoId }: { videoId: string }) {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMirrored, setIsMirrored] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // 預設可以設為 true 避免被版權音樂嚇到

  const onReady = (event: YouTubeEvent) => {
    const ytPlayer = event.target;
    setPlayer(ytPlayer);
    
    // 如果你希望一開始就靜音，可以在這裡加上：
    // ytPlayer.mute();
    // setIsMuted(true);
  };

  const changeSpeed = (rate: number) => {
    if (player) {
      player.setPlaybackRate(rate);
      setPlaybackRate(rate);
    }
  };

  const toggleMute = () => {
    if (player) {
      if (isMuted) {
        player.unMute();
      } else {
        player.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="space-y-3 w-full">
      {/* 影片播放區塊 (包含鏡像翻轉的 CSS 魔法) */}
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
              controls: 1, // 保留進度條
            }
          }}
          onReady={onReady}
          className="absolute inset-0 h-full w-full"
          iframeClassName="h-full w-full border-0"
        />
      </div>

      {/* 控制面板 */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-muted/40 p-3 shadow-sm">
        
        {/* 左側：多段速控制 */}
        <div className="flex items-center gap-2">
          <span className="mr-1 text-sm font-semibold text-muted-foreground">速度</span>
          {[0.25, 0.5, 0.75, 1].map((rate) => (
            <Button
              key={rate}
              variant={playbackRate === rate ? "default" : "outline"}
              size="sm"
              onClick={() => changeSpeed(rate)}
              className="h-8 px-2.5 text-xs font-medium transition-all"
            >
              {rate}x
            </Button>
          ))}
        </div>

        {/* 右側：實用工具 (靜音與鏡像) */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMute}
            className="h-8 w-8 p-0 text-muted-foreground"
            title={isMuted ? "取消靜音" : "靜音"}
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
              {isMirrored ? 'Regular 視角' : 'Goofy 視角'}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}