import { useMemo, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  getBezierPath,
  type EdgeProps,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import KanjiNode from "./KanjiNode";

// Custom Edge component for Cross-Links that bows OUTWARD away from central root node (0,0)
const CustomCrossLinkEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
}: EdgeProps) => {
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;
  const distFromCenter = Math.sqrt(midX * midX + midY * midY);

  let edgePath = "";
  let labelX = midX;
  let labelY = midY;

  // If the line passes close to central root node (within 380px radius), push curve OUTWARD into outer orbit
  if (distFromCenter < 380) {
    const dirX = distFromCenter > 1 ? midX / distFromCenter : 0;
    const dirY = distFromCenter > 1 ? midY / distFromCenter : -1;
    
    // Outward control point
    const ctrlX = midX + dirX * 320;
    const ctrlY = midY + dirY * 320;

    edgePath = `M ${sourceX} ${sourceY} Q ${ctrlX} ${ctrlY} ${targetX} ${targetY}`;
    labelX = (sourceX + 2 * ctrlX + targetX) / 4;
    labelY = (sourceY + 2 * ctrlY + targetY) / 4;
  } else {
    const [path, lx, ly] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
    edgePath = path;
    labelX = lx;
    labelY = ly;
  }

  const strokeColor = (style as any).stroke || "#3b82f6";
  const labelText = typeof label === "string" ? label.replace(/_/g, " ") : label;

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {labelText && (
        <g transform={`translate(${labelX}, ${labelY})`}>
          <rect
            x="-50"
            y="-12"
            width="100"
            height="24"
            rx="8"
            ry="8"
            fill="#ffffff"
            stroke={strokeColor}
            strokeWidth="2"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
          />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="#0f172a"
            fontSize="10"
            fontWeight="800"
            fontFamily="sans-serif"
          >
            {labelText}
          </text>
        </g>
      )}
    </>
  );
};

// Helper function to pick the optimal handles on all 4 sides
function getOptimalHandles(srcPos?: { x: number; y: number }, tgtPos?: { x: number; y: number }) {
  if (!srcPos || !tgtPos) return { sourceHandle: undefined, targetHandle: undefined };

  const dx = tgtPos.x - srcPos.x;
  const dy = tgtPos.y - srcPos.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0
      ? { sourceHandle: "s-right", targetHandle: "t-left" }
      : { sourceHandle: "s-left", targetHandle: "t-right" };
  } else {
    return dy > 0
      ? { sourceHandle: "s-bottom", targetHandle: "t-top" }
      : { sourceHandle: "s-top", targetHandle: "t-bottom" };
  }
}

export default function KanjiAtlasFlow({
  initialRawEdges = [],
  initialRawNodes = [],
}: {
  initialRawEdges?: any[];
  initialRawNodes?: any[];
}) {
  const nodeTypes = useMemo(() => ({ kanjiNode: KanjiNode }), []);
  const edgeTypes = useMemo(() => ({ crossLinkEdge: CustomCrossLinkEdge }), []);
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Automatically expand root and categories on initial mount
  useEffect(() => {
    if (initialRawNodes.length > 0 && expandedNodes.size === 0) {
      const defaultExpanded = new Set<string>();
      initialRawNodes.forEach((n: any) => {
        if (n.type === "root" || n.isRoot || n.type === "bottom") {
          defaultExpanded.add(n.id);
        }
      });
      setExpandedNodes(defaultExpanded);
    }
  }, [initialRawNodes]);

  useEffect(() => {
    // 1. Identify root, category, and sub-word nodes
    const rootNode = initialRawNodes.find((n: any) => n.type === "root" || n.isRoot);
    const categoryNodes = initialRawNodes.filter((n: any) => n.type === "bottom");
    
    // Sort categories in optimal circular order
    const categoryOrderMap: Record<string, number> = {
      green: 0,
      orange: 1,
      yellow: 2,
      purple: 3,
      blue: 4,
    };

    categoryNodes.sort((a, b) => {
      const colorA = a.borderColor?.split("-")[1] || "";
      const colorB = b.borderColor?.split("-")[1] || "";
      const orderA = categoryOrderMap[colorA] ?? 99;
      const orderB = categoryOrderMap[colorB] ?? 99;
      return orderA - orderB;
    });

    const positionedNodes: any[] = [];
    const nodePosMap = new Map<string, { x: number; y: number }>();

    // Central Root Node at origin (0, 0)
    const rootX = 0;
    const rootY = 0;

    if (rootNode) {
      positionedNodes.push({
        ...rootNode,
        x: rootX,
        y: rootY,
      });
      nodePosMap.set(rootNode.id, { x: rootX, y: rootY });
    }

    // 2. Optimized 360° Circular Network Positioning
    const numCategories = categoryNodes.length;
    const categoryRadius = 520;

    categoryNodes.forEach((cat, catIdx) => {
      let angleRad = 0;
      if (numCategories === 1) {
        angleRad = -Math.PI / 2;
      } else if (numCategories === 2) {
        angleRad = catIdx === 0 ? Math.PI : 0;
      } else {
        angleRad = -Math.PI * 0.75 + (catIdx / numCategories) * 2 * Math.PI;
      }

      const catX = rootX + categoryRadius * Math.cos(angleRad);
      const catY = rootY + categoryRadius * Math.sin(angleRad);

      positionedNodes.push({
        ...cat,
        x: catX,
        y: catY,
      });
      nodePosMap.set(cat.id, { x: catX, y: catY });

      const children = initialRawNodes.filter(
        (n: any) => n.type === "sub-bottom" && n.parentPill === cat.id
      );
      children.sort((a, b) => a.id.localeCompare(b.id));

      const numChildren = children.length;
      if (numChildren > 0) {
        const childRadius = 380;
        const arcSpreadRad = numChildren > 1 ? Math.min((150 * Math.PI) / 180, (numChildren - 1) * ((50 * Math.PI) / 180)) : 0;
        const startChildAngleRad = angleRad - arcSpreadRad / 2;

        children.forEach((child, childIdx) => {
          let cAngleRad = angleRad;
          if (numChildren > 1) {
            cAngleRad = startChildAngleRad + (childIdx / (numChildren - 1)) * arcSpreadRad;
          }

          const childX = catX + childRadius * Math.cos(cAngleRad);
          const childY = catY + childRadius * Math.sin(cAngleRad);

          positionedNodes.push({
            ...child,
            x: childX,
            y: childY,
          });
          nodePosMap.set(child.id, { x: childX, y: childY });
        });
      }
    });

    // 3. Format nodes for ReactFlow
    const formattedNodes = positionedNodes.map((node: any) => {
      const isExpanded = expandedNodes.has(node.id);
      const hasChildren = node.type === "bottom" && initialRawNodes.some(
        (n: any) => n.type === "sub-bottom" && n.parentPill === node.id
      );

      return {
        id: node.id,
        type: "kanjiNode",
        position: { x: node.x, y: node.y },
        data: { 
          ...node,
          isExpanded,
          hasChildren,
        },
      };
    });

    // Filter nodes based on expandedNodes state
    const rootNodeObj = initialRawNodes.find((n: any) => n.type === "root" || n.isRoot);
    const rootExpanded = rootNodeObj ? expandedNodes.has(rootNodeObj.id) : true;

    const visibleNodes = formattedNodes.filter((node: any) => {
      if (node.data.isRoot || node.data.type === "root") {
        return true;
      }
      if (node.data.type === "bottom") {
        return rootExpanded;
      }
      if (node.data.type === "sub-bottom") {
        return rootExpanded && expandedNodes.has(node.data.parentPill);
      }
      return true;
    });

    // 4. Format Edges with Custom Cross-Link Outward Arc Routing
    const catColorMap = new Map<string, string>();
    categoryNodes.forEach((cat: any) => {
      let strokeColor = "#3b82f6";
      if (cat.borderColor?.includes("green")) strokeColor = "#22c55e";
      else if (cat.borderColor?.includes("orange")) strokeColor = "#f97316";
      else if (cat.borderColor?.includes("purple")) strokeColor = "#a855f7";
      else if (cat.borderColor?.includes("yellow")) strokeColor = "#eab308";
      catColorMap.set(cat.id, strokeColor);
    });

    const baseEdges = [...initialRawEdges];
    const subWordMap = new Map<string, string>();
    positionedNodes.forEach((n: any) => {
      if (n.type === "sub-bottom" && n.character) {
        subWordMap.set(n.character.trim(), n.id);
      }
    });

    // Cross-links between related jukugo cards
    const crossLinkTriples = [
      ["起点", "berlawanan dengan", "終点", "#f97316"],
      ["採点", "menghasilkan", "点数", "#22c55e"],
      ["観点", "mirip makna", "視点", "#3b82f6"],
      ["問題点", "memerlukan", "点検", "#a855f7"],
      ["重点", "lebih spesifik", "要点", "#ca8a04"],
    ];

    crossLinkTriples.forEach(([srcWord, pred, tgtWord, color]) => {
      const srcId = subWordMap.get(srcWord);
      const tgtId = subWordMap.get(tgtWord);
      if (srcId && tgtId) {
        const edgeId = `cross-${srcId}-${tgtId}`;
        if (!baseEdges.some((e) => e.id === edgeId)) {
          baseEdges.push({
            id: edgeId,
            source: srcId,
            target: tgtId,
            label: pred,
            color,
            isCrossLink: true,
          });
        }
      }
    });

    const formattedEdges = baseEdges.map((edge: any) => {
      const strokeColor = edge.color || catColorMap.get(edge.source) || catColorMap.get(edge.target) || "#64748b";
      const srcPos = nodePosMap.get(edge.source);
      const tgtPos = nodePosMap.get(edge.target);

      const { sourceHandle, targetHandle } = getOptimalHandles(srcPos, tgtPos);
      const labelText = edge.isCrossLink ? (edge.label || edge.predicate) : undefined;

      return {
        ...edge,
        type: edge.isCrossLink ? "crossLinkEdge" : "default",
        sourceHandle,
        targetHandle,
        label: labelText,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 14,
          height: 14,
          color: strokeColor,
        },
        style: { 
          stroke: strokeColor, 
          strokeWidth: edge.isCrossLink ? 2.5 : 2,
          strokeDasharray: edge.isCrossLink ? "6,4" : undefined,
          opacity: edge.isCrossLink ? 1 : 0.75,
        },
      };
    });

    const visibleNodeIds = new Set(visibleNodes.map((n: any) => n.id));
    const visibleEdges = formattedEdges.filter(
      (edge: any) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    );

    setNodes(visibleNodes);
    setEdges(visibleEdges);
  }, [initialRawNodes, initialRawEdges, expandedNodes]);

  const playClickSound = (isCollapse: boolean) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (isCollapse) {
        osc.type = "sine";
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else {
        osc.type = "sine";
        osc.frequency.setValueAtTime(420, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      }
    } catch (e) {
      console.warn("Click audio play error:", e);
    }
  };

  const onNodeClick = (_event: React.MouseEvent, node: any) => {
    const nodeId = node.id;
    const nodeData = node.data;

    const isRoot = nodeData.isRoot || nodeData.type === "root";
    const isCategory = nodeData.type === "bottom";

    if (isRoot || isCategory) {
      setExpandedNodes((prev) => {
        const next = new Set(prev);
        const isCurrentlyExpanded = next.has(nodeId);
        if (isCurrentlyExpanded) {
          next.delete(nodeId);
          if (isRoot) {
            initialRawNodes.forEach((n: any) => {
              if (n.type === "bottom") {
                next.delete(n.id);
              }
            });
          }
          playClickSound(true);
        } else {
          next.add(nodeId);
          playClickSound(false);
        }
        return next;
      });
    }
  };

  return (
    <div className="w-full h-full min-h-[520px] bg-slate-50 flex flex-col font-sans select-none relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.12}
        maxZoom={1.5}
        nodesConnectable={false}
        nodesDraggable={true}
      >
        <Background color="#cbd5e1" gap={20} size={1} />
        <Controls className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl shadow-md text-slate-700 overflow-hidden" />
      </ReactFlow>
    </div>
  );
}


