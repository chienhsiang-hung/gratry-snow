'use client'

import { Handle, Position } from '@xyflow/react';
import { Video, Lock, Star, ArrowLeftRight } from 'lucide-react';

export function SkillNode({ data }: { data: any }) {
  const { label, status } = data;

  return (
    <div className={`relative px-4 py-3 shadow-xl rounded-xl bg-card border-2 transition-all ${
      status.isUnlocked ? 'border-primary' : 'border-muted opacity-60'
    }`}>
      {/* 兩邊都會的 Badge */}
      {status.bothSides && (
        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-md">
          <ArrowLeftRight className="w-3 h-3" />
        </div>
      )}

      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-primary" />
      
      <div className="flex flex-col items-center min-w-[100px]">
        <div className="text-sm font-bold mb-2 tracking-tight">{label}</div>
          
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