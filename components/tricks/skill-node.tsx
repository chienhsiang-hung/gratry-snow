'use client'

import { Handle, Position } from '@xyflow/react';
import { Video, Lock, Star } from 'lucide-react';

export function SkillNode({ data }: { data: any }) {
  const { label, status } = data;

  // 1. 統整狀態樣式，優先級：雙向都會 > 單向解鎖 > 未解鎖
  let nodeStyle = "border-muted opacity-60 shadow-md";
  if (status.bothSides) {
    // 金色邊框 + 金色外發光
    nodeStyle = "border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)] dark:shadow-[0_0_15px_rgba(251,191,36,0.2)]";
  } else if (status.isUnlocked) {
    // 一般解鎖狀態
    nodeStyle = "border-primary shadow-xl";
  }

  return (
    <div className={`relative px-4 py-3 rounded-xl bg-card border-2 transition-all duration-300 ${nodeStyle}`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-primary" />
      
      <div className="flex flex-col items-center min-w-[100px]">
        {/* 如果是滿級，文字也可以考慮加上一點金色 */}
        <div className={`text-sm font-bold mb-2 tracking-tight ${status.bothSides ? 'text-amber-500' : ''}`}>
          {label}
        </div>
          
        <div className="flex gap-2.5">
          <Video className={`w-3.5 h-3.5 ${status.hasPublic ? 'text-green-500' : 'text-muted-foreground/20'}`} />
          <Lock className={`w-3.5 h-3.5 ${status.hasPrivate ? 'text-blue-500' : 'text-muted-foreground/20'}`} />
          <Star className={`w-3.5 h-3.5 ${status.hasFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/20'}`} />
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-primary" />
    </div>
  );
}