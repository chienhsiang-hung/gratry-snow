'use client'

import { useCallback, useEffect, useMemo } from 'react';
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

export interface TrickStatus {
  isUnlocked: boolean;
  bothSides: boolean;
  hasPublic: boolean;
  hasPrivate: boolean;
  hasFavorite: boolean;
}

export interface TrickNodeData extends Record<string, unknown> {
  label: string;
  status?: TrickStatus; // Group 節點沒有 status，所以設為可選
  id?: string;
  onStatusChange?: (id: string, newStatus: Partial<TrickStatus>) => void;
}

type AppNode = Node<TrickNodeData>;

const nodeTypes = {
  skill: SkillNode,
  group: GroupNode,
};

// 寬度 940 剛好可以容納 5 個招式 (x: 40, 220, 400, 580, 760)
const groupStyle = { 
  width: 940, height: 150, 
  backgroundColor: 'rgba(255, 255, 255, 0.05)', 
  border: '2px dashed var(--border)', borderRadius: '1rem' 
};

// 預設全為未解鎖狀態
const defaultStatus = () => ({ isUnlocked: false, bothSides: false, hasPublic: false, hasPrivate: false, hasFavorite: false });

export default function SkillTreePage() {
  const t = useTranslations();
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  const initialNodes: AppNode[] = useMemo(() => [
    // Layer 1: Foundation
    { id: 'group-foundation', type: 'group', position: { x: 0, y: -800 }, style: groupStyle, data: { label: t('group_foundation') } },
    { id: 'switch', type: 'skill', position: { x: 40, y: 60 }, parentId: 'group-foundation', data: { label: t('trick_switch'), status: defaultStatus() } },
    { id: 'ollie', type: 'skill', position: { x: 220, y: 60 }, parentId: 'group-foundation', data: { label: t('trick_ollie'), status: defaultStatus() } },
    { id: 'nollie', type: 'skill', position: { x: 400, y: 60 }, parentId: 'group-foundation', data: { label: t('trick_nollie'), status: defaultStatus() } },
    { id: 'hop', type: 'skill', position: { x: 580, y: 60 }, parentId: 'group-foundation', data: { label: t('trick_hop'), status: defaultStatus() } },

    // Layer 2: Press
    { id: 'group-press', type: 'group', position: { x: 0, y: -600 }, style: groupStyle, data: { label: t('group_press') } },
    { id: 'fnp', type: 'skill', position: { x: 40, y: 60 }, parentId: 'group-press', data: { label: t('trick_fnp'), status: defaultStatus() } },
    { id: 'bnp', type: 'skill', position: { x: 220, y: 60 }, parentId: 'group-press', data: { label: t('trick_bnp'), status: defaultStatus() } },
    { id: 'ftp', type: 'skill', position: { x: 400, y: 60 }, parentId: 'group-press', data: { label: t('trick_ftp'), status: defaultStatus() } },
    { id: 'btp', type: 'skill', position: { x: 580, y: 60 }, parentId: 'group-press', data: { label: t('trick_btp'), status: defaultStatus() } },

    // Layer 3: 180s & Pivots
    { id: 'group-180', type: 'group', position: { x: 0, y: -400 }, style: groupStyle, data: { label: t('group_180') } },
    { id: 'fs180', type: 'skill', position: { x: 40, y: 60 }, parentId: 'group-180', data: { label: t('trick_fs180'), status: defaultStatus() } },
    { id: 'bs180', type: 'skill', position: { x: 220, y: 60 }, parentId: 'group-180', data: { label: t('trick_bs180'), status: defaultStatus() } },
    { id: 'pivot', type: 'skill', position: { x: 400, y: 60 }, parentId: 'group-180', data: { label: t('trick_pivot'), status: defaultStatus() } },
    { id: 'revert', type: 'skill', position: { x: 580, y: 60 }, parentId: 'group-180', data: { label: t('trick_revert'), status: defaultStatus() } },

    // Layer 4: Press Spin
    { id: 'group-press-spin', type: 'group', position: { x: 0, y: -200 }, style: groupStyle, data: { label: t('group_press_spin') } },
    { id: 'fnps', type: 'skill', position: { x: 40, y: 60 }, parentId: 'group-press-spin', data: { label: t('trick_fnps'), status: defaultStatus() } },
    { id: 'bnps', type: 'skill', position: { x: 220, y: 60 }, parentId: 'group-press-spin', data: { label: t('trick_bnps'), status: defaultStatus() } },
    { id: 'ftps', type: 'skill', position: { x: 400, y: 60 }, parentId: 'group-press-spin', data: { label: t('trick_ftps'), status: defaultStatus() } },
    { id: 'btps', type: 'skill', position: { x: 580, y: 60 }, parentId: 'group-press-spin', data: { label: t('trick_btps'), status: defaultStatus() } },

    // Layer 5: Compass & Tripod
    { id: 'group-compass', type: 'group', position: { x: 0, y: 0 }, style: groupStyle, data: { label: t('group_compass') } },
    { id: 'fnc', type: 'skill', position: { x: 40, y: 60 }, parentId: 'group-compass', data: { label: t('trick_fnc'), status: defaultStatus() } },
    { id: 'bnc', type: 'skill', position: { x: 220, y: 60 }, parentId: 'group-compass', data: { label: t('trick_bnc'), status: defaultStatus() } },
    { id: 'ftc', type: 'skill', position: { x: 400, y: 60 }, parentId: 'group-compass', data: { label: t('trick_ftc'), status: defaultStatus() } },
    { id: 'tripod', type: 'skill', position: { x: 580, y: 60 }, parentId: 'group-compass', data: { label: t('trick_tripod'), status: defaultStatus() } },

    // Layer 6: Classic Buttering
    { id: 'group-classic', type: 'group', position: { x: 0, y: 200 }, style: groupStyle, data: { label: t('group_classic') } },
    { id: 'mfm', type: 'skill', position: { x: 40, y: 60 }, parentId: 'group-classic', data: { label: t('trick_mfm'), status: defaultStatus() } },
    { id: 'sone', type: 'skill', position: { x: 220, y: 60 }, parentId: 'group-classic', data: { label: t('trick_sone'), status: defaultStatus() } },
    { id: 'ds', type: 'skill', position: { x: 400, y: 60 }, parentId: 'group-classic', data: { label: t('trick_ds'), status: defaultStatus() } },
    { id: 'shifty', type: 'skill', position: { x: 580, y: 60 }, parentId: 'group-classic', data: { label: t('trick_shifty'), status: defaultStatus() } },
    { id: 'dolphin', type: 'skill', position: { x: 760, y: 60 }, parentId: 'group-classic', data: { label: t('trick_dolphin'), status: defaultStatus() } }, // 加入 Dolphin Turn

    // Layer 7: Advanced Combos
    { id: 'group-advanced', type: 'group', position: { x: 0, y: 400 }, style: groupStyle, data: { label: t('group_advanced') } },
    { id: 'owen', type: 'skill', position: { x: 40, y: 60 }, parentId: 'group-advanced', data: { label: t('trick_owen'), status: defaultStatus() } },
    { id: 'andy', type: 'skill', position: { x: 220, y: 60 }, parentId: 'group-advanced', data: { label: t('trick_andy'), status: defaultStatus() } },
    { id: 'kamikaze', type: 'skill', position: { x: 400, y: 60 }, parentId: 'group-advanced', data: { label: t('trick_kamikaze'), status: defaultStatus() } },
    { id: 'rewind', type: 'skill', position: { x: 580, y: 60 }, parentId: 'group-advanced', data: { label: t('trick_rewind'), status: defaultStatus() } },
    { id: 'tochi', type: 'skill', position: { x: 760, y: 60 }, parentId: 'group-advanced', data: { label: t('trick_tochi'), status: defaultStatus() } },

    // Layer 8: High Spins
    { id: 'group-spin', type: 'group', position: { x: 0, y: 600 }, style: groupStyle, data: { label: t('group_spin') } },
    { id: 'spin360', type: 'skill', position: { x: 40, y: 60 }, parentId: 'group-spin', data: { label: '360s', status: defaultStatus() } },
    { id: 'spin540', type: 'skill', position: { x: 220, y: 60 }, parentId: 'group-spin', data: { label: '540s', status: defaultStatus() } },
    { id: 'spin720', type: 'skill', position: { x: 400, y: 60 }, parentId: 'group-spin', data: { label: '720s', status: defaultStatus() } },
    { id: 'bside', type: 'skill', position: { x: 580, y: 60 }, parentId: 'group-spin', data: { label: t('trick_bside'), status: defaultStatus() } },
  ], [t]);

  // 整理過的技能連線路徑
  const rawEdges: Edge[] = useMemo(() => [
    { id: 'e-ollie-fnp', source: 'ollie', target: 'fnp' },
    { id: 'e-nollie-fnp', source: 'nollie', target: 'fnp' },
    { id: 'e-ollie-dolphin', source: 'ollie', target: 'dolphin' }, // 將 Ollie 連結至 Dolphin Turn
    { id: 'e-switch-fs180', source: 'switch', target: 'fs180' },
    { id: 'e-switch-bs180', source: 'switch', target: 'bs180' },
    { id: 'e-fnp-fnps', source: 'fnp', target: 'fnps' },
    { id: 'e-fnps-fnc', source: 'fnps', target: 'fnc' },
    { id: 'e-fs180-mfm', source: 'fs180', target: 'mfm' },
    { id: 'e-revert-ds', source: 'revert', target: 'ds' },
    { id: 'e-fnps-sone', source: 'fnps', target: 'sone' },
    { id: 'e-fnc-owen', source: 'fnc', target: 'owen' },
    { id: 'e-pivot-andy', source: 'pivot', target: 'andy' },
    { id: 'e-ollie-kamikaze', source: 'ollie', target: 'kamikaze' }, 
    { id: 'e-shifty-rewind', source: 'shifty', target: 'rewind' },
    { id: 'e-nollie-tochi', source: 'nollie', target: 'tochi' },
    { id: 'e-andy-spin540', source: 'andy', target: 'spin540' },
    { id: 'e-spin360-spin540', source: 'spin360', target: 'spin540' },
    { id: 'e-spin540-spin720', source: 'spin540', target: 'spin720' },
  ], []);

  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const handleStatusChange = useCallback((id: string, newStatus: Partial<TrickStatus>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { 
            ...node, 
            data: { 
              ...node.data, 
              status: { 
                ...(node.data.status as TrickStatus), 
                ...newStatus 
              } 
            } 
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === 'skill' && !node.data.onStatusChange) {
          return { ...node, data: { ...node.data, id: node.id, onStatusChange: handleStatusChange } };
        }
        return node;
      })
    );
  }, [handleStatusChange, setNodes]);

  useEffect(() => {
    const updatedEdges = rawEdges.map((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const isUnlocked = sourceNode?.data?.status?.isUnlocked || false;
      const isBothSides = sourceNode?.data?.status?.bothSides || false;

      return {
        ...edge,
        animated: isUnlocked,
        markerEnd: isUnlocked ? { type: MarkerType.ArrowClosed, color: isBothSides ? '#fbbf24' : 'var(--primary)' } : undefined,
        style: isBothSides 
          ? { stroke: '#fbbf24', strokeWidth: 3, filter: 'drop-shadow(0 0 4px rgba(251,191,36,0.6))' } 
          : (isUnlocked ? { stroke: 'var(--primary)', strokeWidth: 2 } : { stroke: 'var(--border)' }),
      };
    });
    setEdges(updatedEdges);
  }, [nodes, rawEdges, setEdges]);

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