'use client'

import { Handle, Position } from '@xyflow/react';
import { Video, Lock, Star, Infinity } from 'lucide-react';

export function SkillNode({ data }: { data: any }) {
  const { id, label, status, onStatusChange } = data;

  // 點擊節點切換狀態：未解鎖 -> 單邊解鎖 -> 雙邊解鎖 -> 未解鎖
  const handleToggle = (e: React.MouseEvent) => {
    if (!status.isUnlocked) {
      onStatusChange(id, { isUnlocked: true, bothSides: false });
    } else if (!status.bothSides) {
      onStatusChange(id, { isUnlocked: true, bothSides: true });
    } else {
      onStatusChange(id, { isUnlocked: false, bothSides: false });
    }
  };

  // 統整狀態樣式
  let nodeStyle = "border-muted opacity-60 shadow-sm cursor-pointer hover:border-primary/50";
  if (status.bothSides) {
    // 金色邊框 + 金色外發光
    nodeStyle = "border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)] dark:shadow-[0_0_15px_rgba(251,191,36,0.2)] cursor-pointer";
  } else if (status.isUnlocked) {
    // 一般解鎖狀態
    nodeStyle = "border-primary shadow-lg cursor-pointer";
  }

  return (
    <div 
      className={`relative px-4 py-3 rounded-xl bg-card border-2 transition-all duration-300 select-none ${nodeStyle}`}
      onClick={handleToggle}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-primary" />
      
      {/* 雙邊專精專屬徽章 */}
      {status.bothSides && (
        <div className="absolute -top-2.5 -right-2.5 bg-amber-400 text-amber-950 rounded-full p-1 shadow-[0_0_8px_rgba(251,191,36,0.6)] border-2 border-card">
          <Infinity className="w-3.5 h-3.5" strokeWidth={3} />
        </div>
      )}

      <div className="flex flex-col items-center min-w-[100px]">
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