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
  Node,
  Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTranslations } from 'next-intl';
import { SkillNode } from '@/components/tricks/skill-node';
import { GroupNode } from '@/components/tricks/group-node';
import { useTheme } from 'next-themes';

// 定義自定義節點類型
const nodeTypes = {
  skill: SkillNode,
  group: GroupNode,
};

// 共用的 Group 樣式
const groupStyle = { 
  width: 760, 
  height: 150, 
  backgroundColor: 'rgba(255, 255, 255, 0.05)', 
  border: '2px dashed var(--border)', 
  borderRadius: '1rem' 
};

// 初始預設樹狀結構 (根據日系平花技能樹重構)
const initialNodes: Node[] = [
  // --- Layer 1: Foundation (基礎地基) ---
  {
    id: 'group-foundation', type: 'group', position: { x: 0, y: -600 }, style: groupStyle,
    data: { label: 'Foundation (基礎地基)' }
  },
  { id: 'switch', type: 'skill', position: { x: 40, y: 60 }, parentId: 'group-foundation', data: { label: 'Switch Riding', status: { isUnlocked: true, hasPublic: false, hasPrivate: false, hasFavorite: false } } },
  { id: 'hop', type: 'skill', position: { x: 220, y: 60 }, parentId: 'group-foundation', data: { label: 'Hop', status: { isUnlocked: true, hasPublic: false, hasPrivate: false, hasFavorite: false } } },
  { id: 'ollie', type: 'skill', position: { x: 400, y: 60 }, parentId: 'group-foundation', data: { label: 'Ollie', status: { isUnlocked: true, hasPublic: false, hasPrivate: false, hasFavorite: false } } },
  { id: 'nollie', type: 'skill', position: { x: 580, y: 60 }, parentId: 'group-foundation', data: { label: 'Nollie', status: { isUnlocked: true, hasPublic: false, hasPrivate: false, hasFavorite: false } } },

  // --- Layer 2: Press (壓板平衡) ---
  {
    id: 'group-press', type: 'group', position: { x: 0, y: -400 }, style: groupStyle,
    data: { label: 'Press (壓板平衡)' }
  },
  { id: 'fnp', type: 'skill', position: { x: 40, y: 60 }, parentId: 'group-press', data: { label: 'Frontside Nose', status: { isUnlocked: true, hasPublic: false, hasPrivate: false, hasFavorite: false } } },
  { id: 'bnp', type: 'skill', position: { x: 220, y: 60 }, parentId: 'group-press', data: { label: 'Backside Nose', status: { isUnlocked: true, hasPublic: false, hasPrivate: false, hasFavorite: false } } },
  { id: 'ftp', type: 'skill', position: { x: 400, y: 60 }, parentId: 'group-press', data: { label: 'Frontside Tail', status: { isUnlocked: true, hasPublic: false, hasPrivate: false, hasFavorite: false } } },
  { id: 'btp', type: 'skill', position: { x: 580, y: 60 }, parentId: 'group-press', data: { label: 'Backside Tail', status: { isUnlocked: true, hasPublic: false, hasPrivate: false, hasFavorite: false } } },

  // --- Layer 3: 180s & Pivots (入門旋轉與位移) ---
  {
    id: 'group-180', type: 'group', position: { x: 0, y: -200 }, style: groupStyle,
    data: { label: '180s & Pivots (入門旋轉)' }
  },
  { id: 'fs180', type: 'skill', position: { x: 40, y: 60 }, parentId: 'group-180', data: { label: 'FS 180', status: { isUnlocked: true, hasPublic: false, hasPrivate: false, hasFavorite: false } } },
  { id: 'bs180', type: 'skill', position: { x: 220, y: 60 }, parentId: 'group-180', data: { label: 'BS 180', status: { isUnlocked: true, hasPublic: false, hasPrivate: false, hasFavorite: false } } },
  { id: 'pivot180', type: 'skill', position: { x: 400, y: 60 }, parentId: 'group-180', data: { label: 'Pivot 180', status: { isUnlocked: true, hasPublic: false, hasPrivate: false, hasFavorite: false } } },
  { id: 'revert', type: 'skill', position: { x: 580, y: 60 }, parentId: 'group-180', data: { label: 'Revert', status: { isUnlocked: true, hasPublic: false, hasPrivate: false, hasFavorite: false } } },

  // --- Layer 4: Press Spin (乘載旋轉) ---
  {
    id: 'group-press-spin', type: 'group', position: { x: 0, y: 0 }, style: groupStyle,
    data: { label: 'Press Spin (乘載旋轉)' }
  },
  { id: 'fnps', type: 'skill', position: { x: 40, y: 60 }, parentId: 'group-press-spin', data: { label: 'Frontside Nose Spin', status: { isUnlocked: false, hasPublic: false, hasPrivate: false, hasFavorite: false } } },
  { id: 'bnps', type: 'skill', position: { x: 220, y: 60 }, parentId: 'group-press-spin', data: { label: 'Backside Nose Spin', status: { isUnlocked: false, hasPublic: false, hasPrivate: false, hasFavorite: false } } },
  { id: 'ftps', type: 'skill', position: { x: 400, y: 60 }, parentId: 'group-press-spin', data: { label: 'Frontside Tail Spin', status: { isUnlocked: false, hasPublic: false, hasPrivate: false, hasFavorite: false } } },
  { id: 'btps', type: 'skill', position: { x: 580, y: 60 }, parentId: 'group-press-spin', data: { label: 'Backside Tail Spin', status: { isUnlocked: false, hasPublic: false, hasPrivate: false, hasFavorite: false } } },

  // --- Layer 5: Compass & Buttering (圓規與平花) ---
  {
    id: 'group-compass', type: 'group', position: { x: 0, y: 200 }, style: groupStyle,
    data: { label: 'Compass & Buttering (圓規與滑行平花)' }
  },
  { id: 'fnc', type: 'skill', position: { x: 40, y: 60 }, parentId: 'group-compass', data: { label: 'FS Nose Compass', status: { isUnlocked: false, hasPublic: false, hasPrivate: false, hasFavorite: false } } },
  { id: 'bnc', type: 'skill', position: { x: 220, y: 60 }, parentId: 'group-compass', data: { label: 'BS Nose Compass', status: { isUnlocked: false, hasPublic: false, hasPrivate: false, hasFavorite: false } } },
  { id: 'ftc', type: 'skill', position: { x: 400, y: 60 }, parentId: 'group-compass', data: { label: 'FS Tail Compass', status: { isUnlocked: false, hasPublic: false, hasPrivate: false, hasFavorite: false } } },
  { id: 'tripod', type: 'skill', position: { x: 580, y: 60 }, parentId: 'group-compass', data: { label: 'Tripod', status: { isUnlocked: false, hasPublic: false, hasPrivate: false, hasFavorite: false } } },

  // --- Layer 6: Intermediate Balance (中階平衡與複合招) ---
  {
    id: 'group-intermediate', type: 'group', position: { x: 0, y: 400 }, style: groupStyle,
    data: { label: 'Intermediate (中階複合招式)' }
  },
  { id: 'sone', type: 'skill', position: { x: 40, y: 60 }, parentId: 'group-intermediate', data: { label: 'Sone', status: { isUnlocked: false, hasPublic: false, hasPrivate: false, hasFavorite: false } } },
  { id: 'ds', type: 'skill', position: { x: 220, y: 60 }, parentId: 'group-intermediate', data: { label: 'Drive Spin', status: { isUnlocked: false, bothSides: true, hasPublic: false, hasPrivate: false, hasFavorite: false } } },
  { id: 'owen', type: 'skill', position: { x: 400, y: 60 }, parentId: 'group-intermediate', data: { label: 'Owen', status: { isUnlocked: false, hasPublic: false, hasPrivate: false, hasFavorite: false } } },
  { id: 'shifty', type: 'skill', position: { x: 580, y: 60 }, parentId: 'group-intermediate', data: { label: 'Shifty', status: { isUnlocked: false, hasPublic: false, hasPrivate: false, hasFavorite: false } } },

  // --- Layer 7: Advanced Spins (高階旋轉) ---
  {
    id: 'group-advanced', type: 'group', position: { x: 0, y: 600 }, style: groupStyle,
    data: { label: 'Advanced Spins (高階旋轉)' }
  },
  { id: 'spin360', type: 'skill', position: { x: 40, y: 60 }, parentId: 'group-advanced', data: { label: '360s (FS/BS/Nollie)', status: { isUnlocked: false, hasPublic: false, hasPrivate: false, hasFavorite: false } } },
  { id: 'spin540', type: 'skill', position: { x: 220, y: 60 }, parentId: 'group-advanced', data: { label: '540s', status: { isUnlocked: false, hasPublic: false, hasPrivate: false, hasFavorite: false } } },
  { id: 'spin720', type: 'skill', position: { x: 400, y: 60 }, parentId: 'group-advanced', data: { label: '720s', status: { isUnlocked: false, hasPublic: false, hasPrivate: false, hasFavorite: false } } },
  { id: 'bside', type: 'skill', position: { x: 580, y: 60 }, parentId: 'group-advanced', data: { label: 'B-side Spins', status: { isUnlocked: false, hasPublic: false, hasPrivate: false, hasFavorite: false } } },
];

const initialEdges: Edge[] = [
  // Foundation to entry
  { id: 'e-switch-fs180', source: 'switch', target: 'fs180', animated: false, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-switch-bs180', source: 'switch', target: 'bs180', animated: false, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-ollie-spin360', source: 'ollie', target: 'spin360', animated: false, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-nollie-spin360', source: 'nollie', target: 'spin360', animated: false, markerEnd: { type: MarkerType.ArrowClosed } },

  // Press to Press Spin
  { id: 'e-fnp-fnps', source: 'fnp', target: 'fnps', animated: false, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-bnp-bnps', source: 'bnp', target: 'bnps', animated: false, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-ftp-ftps', source: 'ftp', target: 'ftps', animated: false, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-btp-btps', source: 'btp', target: 'btps', animated: false, markerEnd: { type: MarkerType.ArrowClosed } },

  // Press Spin to Compass
  { id: 'e-fnps-fnc', source: 'fnps', target: 'fnc', animated: false, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-bnps-bnc', source: 'bnps', target: 'bnc', animated: false, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-ftps-ftc', source: 'ftps', target: 'ftc', animated: false, markerEnd: { type: MarkerType.ArrowClosed } },
  
  // 180s/Pivots to Intermediate
  { id: 'e-fs180-owen', source: 'fs180', target: 'owen', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-revert-ds', source: 'revert', target: 'ds', animated: false, markerEnd: { type: MarkerType.ArrowClosed } },
  
  // Compass to Intermediate (Owen relies heavily on FNC mechanics)
  { id: 'e-fnc-owen', source: 'fnc', target: 'owen', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  
  // Intermediate to Advanced
  { id: 'e-ds-spin540', source: 'ds', target: 'spin540', animated: false, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-spin360-spin540', source: 'spin360', target: 'spin540', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-spin540-spin720', source: 'spin540', target: 'spin720', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
];

export default function SkillTreePage() {
  const t = useTranslations();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const { theme, systemTheme } = useTheme();
  // 處理 'system' 模式，確保在跟隨系統時也能正確對應
  const currentTheme = theme === 'system' ? systemTheme : theme;

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
          proOptions={{ hideAttribution: true }}
          colorMode={currentTheme === 'dark' ? 'dark' : 'light'}
          fitView
        >
          <Background gap={20} color="#888" />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}