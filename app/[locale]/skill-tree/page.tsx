'use client'

import { useCallback } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  Connection,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTranslations } from 'next-intl';
import { SkillNode } from '@/components/tricks/skill-node';

// 定義自定義節點類型
const nodeTypes = {
  skill: SkillNode,
};
  
// 初始預設樹狀結構 (參考你的 Vue Flow 資料)
const initialNodes = [
  { 
    id: 'press', type: 'skill', position: { x: 400, y: 0 },
    data: { label: 'Nose / Tail Press', status: { isUnlocked: true, hasPublic: true, hasPrivate: false, hasFavorite: false } } 
  },
  { 
    id: 'backNose', type: 'skill', position: { x: 200, y: 150 },
    data: { label: 'Back Nose', status: { isUnlocked: false, hasPublic: false, hasPrivate: false, hasFavorite: false } } 
  },
  { 
    id: 'frontTail', type: 'skill', position: { x: 600, y: 150 },
    data: { label: 'Front Tail', status: { isUnlocked: true, hasPublic: false, hasPrivate: true, hasFavorite: true } } 
  }
];

const initialEdges = [
  { id: 'e-press-backNose', source: 'press', target: 'backNose', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-press-frontTail', source: 'press', target: 'frontTail', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
];

export default function SkillTreePage() {
  const t = useTranslations();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full">
      <div className="p-6 bg-background border-b">
        <h1 className="text-3xl font-extrabold tracking-tight">{t('skill_tree')}</h1>
        <p className="text-muted-foreground">{t('skill_tree_desc')}</p>
      </div>

      <div className="flex-1 w-full bg-zinc-50 dark:bg-zinc-950">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background gap={20} color="#888" />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}