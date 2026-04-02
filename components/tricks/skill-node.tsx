'use client'

import { Handle, Position } from '@xyflow/react';
import { Video, Lock, Star, Infinity, MonitorPlay } from 'lucide-react';
import { Link } from '@/i18n/routing';

export function SkillNode({ data }: { data: any }) {
  const { id, label, status, hasResource, isEditing, onStatusChange } = data;

  // 點擊節點切換狀態
  const handleToggle = (e: React.MouseEvent) => {
    // 1. 如果不在編輯模式，禁止修改狀態
    if (!isEditing) return;

    // 避免點擊到超連結時觸發
    if ((e.target as HTMLElement).closest('a')) return;

    if (!status.isUnlocked) {
      onStatusChange(id, { isUnlocked: true, bothSides: false });
    } else if (!status.bothSides) {
      onStatusChange(id, { isUnlocked: true, bothSides: true });
    } else {
      onStatusChange(id, { isUnlocked: false, bothSides: false });
    }
  };

  // 統整狀態樣式，根據 isEditing 動態決定游標樣式
  const cursorStyle = isEditing ? 'cursor-pointer hover:border-primary/50 hover:-translate-y-1' : 'cursor-default';
  
  let nodeStyle = `border-muted opacity-60 shadow-sm transition-all duration-300 select-none ${cursorStyle}`;
  if (status.bothSides) {
    nodeStyle = `border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)] dark:shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all duration-300 select-none ${cursorStyle}`;
  } else if (status.isUnlocked) {
    nodeStyle = `border-primary shadow-lg transition-all duration-300 select-none ${cursorStyle}`;
  }

  return (
    <div 
      className={`relative px-4 py-3 rounded-xl bg-card border-2 ${nodeStyle}`}
      onClick={handleToggle}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-primary" />
      
      {status.bothSides && (
        <div className="absolute -top-2.5 -right-2.5 bg-amber-400 text-amber-950 rounded-full p-1 shadow-[0_0_8px_rgba(251,191,36,0.6)] border-2 border-card">
          <Infinity className="w-3.5 h-3.5" strokeWidth={3} />
        </div>
      )}

      {hasResource && (
        <Link href={`/?category=${id}`} className="absolute -top-2.5 -left-2.5 bg-blue-500 text-white rounded-full p-1 shadow-md border-2 border-card hover:bg-blue-400 transition-colors">
          <MonitorPlay className="w-3.5 h-3.5" />
        </Link>
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