import React, { useMemo, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  MarkerType,
  getBezierPath,
  type EdgeProps,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// 1. Edge Kustom untuk Hubungan Silang yang Melengkung Keluar Mengelilingi Inti
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

  // Jika jalur mendekati titik pusat (0,0), dorong melengkung KELUAR ke orbit luar
  if (distFromCenter < 380) {
    const dirX = distFromCenter > 1 ? midX / distFromCenter : 0;
    const dirY = distFromCenter > 1 ? midY / distFromCenter : -1;
    
    // Titik kontrol melengkung keluar
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

// 2. Helper Handle Terluar Dinamis
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

// 3. Titik Handle Multi-Arah
const NodeHandles = () => (
  <>
    <Handle type="target" position={Position.Top} id="t-top" className="opacity-0 pointer-events-none" />
    <Handle type="target" position={Position.Bottom} id="t-bottom" className="opacity-0 pointer-events-none" />
    <Handle type="target" position={Position.Left} id="t-left" className="opacity-0 pointer-events-none" />
    <Handle type="target" position={Position.Right} id="t-right" className="opacity-0 pointer-events-none" />

    <Handle type="source" position={Position.Top} id="s-top" className="opacity-0 pointer-events-none" />
    <Handle type="source" position={Position.Bottom} id="s-bottom" className="opacity-0 pointer-events-none" />
    <Handle type="source" position={Position.Left} id="s-left" className="opacity-0 pointer-events-none" />
    <Handle type="source" position={Position.Right} id="s-right" className="opacity-0 pointer-events-none" />
  </>
);

// 4. Simpul Graph Kustom
const CustomSemanticNode = ({ data }: { data: any }) => {
  if (data.isRoot || data.type === "root") {
    return (
      <div 
        className={`bg-gradient-to-br from-[#ff5b94] via-[#ff3b7b] to-[#ff1b5f] text-white px-7 py-4 rounded-3xl shadow-xl min-w-[210px] text-center relative border-2 border-white/30 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-rose-500/30 ${
          !data.isExpanded ? "animate-pulse" : "ring-4 ring-rose-400/20"
        }`}
      >
        <NodeHandles />
        <div className="flex flex-col items-center justify-center">
          <span className="text-[10px] uppercase font-black tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full mb-1">
            Entitas Inti
          </span>
          <span className="text-4xl font-extrabold tracking-wide mb-1 font-serif drop-shadow-md">
            {data.label}
          </span>
          {data.subLabel && (
            <span className="text-xs font-semibold opacity-90 tracking-wide bg-black/10 px-2 py-0.5 rounded-full">
              {data.subLabel}
            </span>
          )}
          {data.description && (
            <span className="text-xs font-bold tracking-wider mt-1.5 opacity-95 max-w-[180px] leading-tight">
              {data.description}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (data.type === "category") {
    let bgClass = "bg-slate-600 border-slate-700 shadow-slate-500/20";
    if (data.color === "green") bgClass = "bg-emerald-500 border-emerald-400 shadow-emerald-500/25";
    else if (data.color === "orange") bgClass = "bg-amber-500 border-amber-400 shadow-amber-500/25";
    else if (data.color === "blue") bgClass = "bg-blue-600 border-blue-400 shadow-blue-500/25";
    else if (data.color === "purple") bgClass = "bg-purple-600 border-purple-400 shadow-purple-500/25";
    else if (data.color === "yellow") bgClass = "bg-yellow-500 border-yellow-300 shadow-yellow-500/25";

    return (
      <div 
        className={`text-white px-6 py-3 rounded-2xl text-xs font-black border-2 shadow-lg text-center relative whitespace-nowrap cursor-pointer transition-all duration-300 hover:scale-105 ${bgClass}`}
      >
        <NodeHandles />
        <div className="flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span className="tracking-wide text-sm font-extrabold">{data.label}</span>
        </div>
        {data.hasChildren && (
          <span 
            className={`absolute -top-2 -right-2 flex items-center justify-center rounded-full w-5 h-5 text-[10px] font-black border-2 border-white shadow-md transition-all ${
              data.isExpanded ? "bg-slate-700 text-white" : "bg-rose-500 text-white animate-bounce"
            }`}
          >
            {data.isExpanded ? "−" : "+"}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white/95 text-slate-800 px-5 py-3 rounded-2xl border-2 border-slate-200 shadow-md text-center relative min-w-[130px] hover:shadow-xl hover:border-blue-400 hover:scale-105 transition-all duration-300 backdrop-blur-sm">
      <NodeHandles />
      <div className="flex flex-col items-center justify-center">
        <span className="text-base font-extrabold text-slate-900 font-serif tracking-wide">{data.label}</span>
        {data.subLabel && <span className="text-[11px] text-blue-600 font-bold mt-0.5 bg-blue-50 px-2 py-0.5 rounded-full">{data.subLabel}</span>}
        {data.description && <span className="text-[11px] text-slate-600 font-bold mt-1 max-w-[140px] leading-tight">{data.description}</span>}
      </div>
    </div>
  );
};

// 5. Dataset Triples
const INITIAL_NODES:any = [];

const INITIAL_EDGES:any = [];

const DYNAMIC_PALETTE = [
  "#22c55e", // green
  "#f97316", // orange
  "#3b82f6", // blue
  "#a855f7", // purple
  "#eab308", // yellow
  "#ec4899", // pink
  "#14b8a6", // teal
  "#6366f1", // indigo
];

export const getDynamicColor = (key: string | number): string => {
  if (typeof key === "string" && key.startsWith("#")) return key;
  const namedColors: Record<string, string> = {
    green: "#22c55e",
    orange: "#f97316",
    yellow: "#eab308",
    purple: "#a855f7",
    blue: "#3b82f6",
    pink: "#ec4899",
    teal: "#14b8a6",
    indigo: "#6366f1",
  };
  if (typeof key === "string" && namedColors[key.toLowerCase()]) {
    return namedColors[key.toLowerCase()];
  }
  const hash = typeof key === "number" ? key : String(key).split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return DYNAMIC_PALETTE[Math.abs(hash) % DYNAMIC_PALETTE.length];
};

export const COLOR_MAP: Record<string, string> = new Proxy({}, {
  get: (_, prop: string) => getDynamicColor(prop)
});

// 6. Komponen Utama
export default function SemanticGraph({
  rawNodes = INITIAL_NODES,
  rawEdges = INITIAL_EDGES,
}: {
  rawNodes?: any[];
  rawEdges?: any[];
}) {
  const nodeTypes = useMemo(() => ({ semanticNode: CustomSemanticNode }), []);
  const edgeTypes = useMemo(() => ({ crossLinkEdge: CustomCrossLinkEdge }), []);
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (rawNodes.length > 0 && expandedNodes.size === 0) {
      const defaultExpanded = new Set<string>();
      rawNodes.forEach((n) => {
        if (n.type === "root" || n.type === "category") defaultExpanded.add(n.id);
      });
      setExpandedNodes(defaultExpanded);
    }
  }, [rawNodes]);

  useEffect(() => {
    const rootNode = rawNodes.find((n) => n.type === "root");
    const categoryNodes = rawNodes.filter((n) => n.type === "category");

    // Dynamic category sorting based on order attribute, category id index, or category label
    categoryNodes.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
      const aIdNum = parseInt(String(a.id).replace(/\D/g, ""), 10);
      const bIdNum = parseInt(String(b.id).replace(/\D/g, ""), 10);
      if (!isNaN(aIdNum) && !isNaN(bIdNum)) return aIdNum - bIdNum;
      return (a.label || a.kanji || "").localeCompare(b.label || b.kanji || "");
    });

    const positionedNodes: any[] = [];
    const nodePosMap = new Map<string, { x: number; y: number }>();
    const rootX = 0;
    const rootY = 0;

    if (rootNode) {
      positionedNodes.push({ ...rootNode, x: rootX, y: rootY });
      nodePosMap.set(rootNode.id, { x: rootX, y: rootY });
    }

    const numCategories = categoryNodes.length;
    const categoryRadius = 520;

    categoryNodes.forEach((cat, catIdx) => {
      let angleRad = 0;
      if (numCategories === 1) angleRad = -Math.PI / 2;
      else if (numCategories === 2) angleRad = catIdx === 0 ? Math.PI : 0;
      else angleRad = -Math.PI * 0.75 + (catIdx / numCategories) * 2 * Math.PI;

      const catX = rootX + categoryRadius * Math.cos(angleRad);
      const catY = rootY + categoryRadius * Math.sin(angleRad);

      positionedNodes.push({ ...cat, x: catX, y: catY });
      nodePosMap.set(cat.id, { x: catX, y: catY });

      const children = rawNodes.filter((n) => n.categoryId === cat.id);
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

          positionedNodes.push({ ...child, x: childX, y: childY });
          nodePosMap.set(child.id, { x: childX, y: childY });
        });
      }
    });

    const formattedNodes = positionedNodes.map((node) => ({
      id: node.id,
      type: "semanticNode",
      position: { x: node.x, y: node.y },
      data: {
        ...node,
        isExpanded: expandedNodes.has(node.id),
        hasChildren: node.type === "category" && rawNodes.some((n) => n.categoryId === node.id),
      },
    }));

    const rootExpanded = rootNode ? expandedNodes.has(rootNode.id) : true;
    const visibleNodes = formattedNodes.filter((node) => {
      if (node.data.type === "root") return true;
      if (node.data.type === "category") return rootExpanded;
      if (node.data.categoryId) return rootExpanded && expandedNodes.has(node.data.categoryId);
      return true;
    });

    const catColorMap = new Map<string, string>();
    categoryNodes.forEach((cat) => catColorMap.set(cat.id, COLOR_MAP[cat.color] || "#3b82f6"));

    const formattedEdges = rawEdges.map((edge) => {
      const strokeColor = edge.color || catColorMap.get(edge.source) || catColorMap.get(edge.target) || "#64748b";
      const srcPos = nodePosMap.get(edge.source);
      const tgtPos = nodePosMap.get(edge.target);

      const isCross = Boolean(edge.isCrossLink || (edge.predicate && edge.predicate !== "kategori" && edge.predicate !== "mencakup"));
      const { sourceHandle, targetHandle } = getOptimalHandles(srcPos, tgtPos);
      const labelText = isCross ? edge.predicate : undefined;

      return {
        ...edge,
        type: isCross ? "crossLinkEdge" : "default",
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
          strokeWidth: isCross ? 2.5 : 2,
          strokeDasharray: isCross ? "6,4" : undefined,
          opacity: isCross ? 1 : 0.75,
        },
      };
    });

    const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));
    const visibleEdges = formattedEdges.filter(
      (edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    );

    setNodes(visibleNodes);
    setEdges(visibleEdges);
  }, [rawNodes, rawEdges, expandedNodes]);

  const onNodeClick = (_: React.MouseEvent, node: any) => {
    const { id, data } = node;
    if (data.type === "root" || data.type === "category") {
      setExpandedNodes((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
          if (data.type === "root") rawNodes.forEach((n) => { if (n.type === "category") next.delete(n.id); });
        } else {
          next.add(id);
        }
        return next;
      });
    }
  };

  return (
    <div className="w-full h-screen bg-slate-50 flex flex-col font-sans select-none relative">
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