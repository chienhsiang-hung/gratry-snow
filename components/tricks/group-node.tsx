'use client'

import { memo } from 'react';

export const GroupNode = memo(({ data }: { data: any }) => {
  return (
    <div className="w-full h-full relative">
      {/* 這裡把 Label 放在左上角，你可以依照需求調整樣式 (例如文字顏色、大小) */}
      {data.label && (
        <div className="absolute top-2 left-4 text-xl font-bold text-muted-foreground/30 pointer-events-none">
          {data.label}
        </div>
      )}
    </div>
  );
});

GroupNode.displayName = 'GroupNode';