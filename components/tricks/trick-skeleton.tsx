interface TrickSkeletonProps {
  count?: number;
}

export function TrickSkeleton({ count = 8 }: TrickSkeletonProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(count)].map((_, i) => (
        <div 
          key={i} 
          className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm animate-in fade-in duration-500"
        >
          {/* 1. 影片縮圖 */}
          <div className="aspect-video w-full bg-black/5 dark:bg-white/5 animate-pulse" />
          
          <div className="flex flex-1 flex-col p-4 gap-4">
            <div className="flex items-start justify-between gap-4">
              {/* 2. 標題與難度 */}
              <div className="h-6 w-2/3 rounded-md bg-black/10 dark:bg-white/10 animate-pulse" />
              <div className="h-5 w-12 shrink-0 rounded-full bg-black/10 dark:bg-white/10 animate-pulse" />
            </div>
            
            <div className="mt-auto flex gap-2 pt-2">
              {/* 3. 底部標籤 */}
              <div className="h-5 w-16 rounded-full bg-black/5 dark:bg-white/5 animate-pulse" />
              <div className="h-5 w-14 rounded-full bg-black/5 dark:bg-white/5 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}