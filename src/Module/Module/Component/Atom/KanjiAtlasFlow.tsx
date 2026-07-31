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
import { api } from "../../../Common/Utility/api";

const PALETTE = [
  "#f97316", // Vibrant Orange
  "#10b981", // Emerald Green
  "#3b82f6", // Royal Blue
  "#a855f7", // Deep Purple
  "#eab308", // Golden Yellow
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#f43f5e", // Rose
  "#8b5cf6", // Violet
  "#14b8a6", // Teal
  "#d97706", // Dark Amber
  "#0284c7", // Sky Blue
];

function getCategoryColor(index: number, name: string): string {
  if (index < PALETTE.length) {
    return PALETTE[index];
  }
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 85%, 42%)`;
}

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
            x="-55"
            y="-13"
            width="110"
            height="26"
            rx="10"
            ry="10"
            fill="#ffffff"
            stroke={strokeColor}
            strokeWidth="2.5"
            filter="drop-shadow(0 4px 8px rgba(0,0,0,0.12))"
          />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="#0f172a"
            fontSize="11"
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
  activeJukugoWord = null,
  activeNodeId = null,
  onSelectJukugo,
}: {
  initialRawEdges?: any[];
  initialRawNodes?: any[];
  activeJukugoWord?: string | null;
  activeNodeId?: string | null;
  onSelectJukugo?: (word: string | null, nodeId?: string | null) => void;
}) {
  const nodeTypes = useMemo(() => ({ kanjiNode: KanjiNode }), []);
  const edgeTypes = useMemo(() => ({ crossLinkEdge: CustomCrossLinkEdge }), []);
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [kanjis, setKanjis] = useState<any[]>([]);

  // Fetch all kanji details for romaji & meaning lookup
  useEffect(() => {
    api.admin.kanjis
      .list()
      .then((data) => setKanjis(data))
      .catch((err) => console.error("Gagal memuat detail kanji untuk atlas:", err));
  }, []);

  const kanjiMap = useMemo(() => {
    const map = new Map<string, any>();
    kanjis.forEach((k) => map.set(k.character, k));
    return map;
  }, [kanjis]);

  // Automatically expand root and categories on initial mount
  useEffect(() => {
    if (initialRawNodes.length > 0 && expandedNodes.size === 0) {
      const defaultExpanded = new Set<string>();
      initialRawNodes.forEach((n: any) => {
        if (n.type === "root" || n.isRoot || n.type === "bottom" || n.type === "category") {
          defaultExpanded.add(n.id);
        }
      });
      setExpandedNodes(defaultExpanded);
    }
  }, [initialRawNodes]);

  useEffect(() => {
    // 1. Identify root, category, and sub-word nodes
    const rootNode = initialRawNodes.find((n: any) => n.type === "root" || n.isRoot);
    const categoryNodes = initialRawNodes.filter((n: any) => n.type === "bottom" || n.type === "category");

    const categoryOrderMap: Record<string, number> = {
      green: 0,
      orange: 1,
      yellow: 2,
      purple: 3,
      blue: 4,
    };

    categoryNodes.sort((a, b) => {
      const colorA = (a.color || a.borderColor?.split("-")[1] || "").toLowerCase();
      const colorB = (b.color || b.borderColor?.split("-")[1] || "").toLowerCase();
      const orderA = categoryOrderMap[colorA] ?? 99;
      const orderB = categoryOrderMap[colorB] ?? 99;
      return orderA - orderB;
    });

    const positionedNodes: any[] = [];
    const nodePosMap = new Map<string, { x: number; y: number }>();
    const generatedEdges: any[] = [...initialRawEdges];
    const catColorMap = new Map<string, string>();

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

    // 2. Optimized 360° Circular Network Positioning for Categories & Jukugo
    const numCategories = categoryNodes.length;
    const categoryRadius = 520;

    categoryNodes.forEach((cat, catIdx) => {
      const catColor = getCategoryColor(catIdx, cat.kanji || cat.name || cat.id);
      catColorMap.set(cat.id, catColor);

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
        categoryColor: catColor,
        x: catX,
        y: catY,
      });
      nodePosMap.set(cat.id, { x: catX, y: catY });

      const children = initialRawNodes.filter(
        (n: any) => (n.type === "sub-bottom" || n.type === "sub") && (n.parentPill === cat.id || n.categoryId === cat.id)
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
            categoryColor: catColor,
            x: childX,
            y: childY,
          });
          nodePosMap.set(child.id, { x: childX, y: childY });
        });
      }
    });

    // 2b. Deduplicate Leaf Kanji Nodes across ALL Jukugo Nodes
    const allSubNodes = initialRawNodes.filter(
      (n: any) => n.type === "sub-bottom" || n.type === "sub"
    );

    interface LeafCluster {
      char: string;
      parentIds: string[];
    }

    const leafMap = new Map<string, LeafCluster>();

    allSubNodes.forEach((sub: any) => {
      const word = (sub.kanji || sub.character || sub.word || "").trim();
      if (word) {
        const charList: string[] = Array.from(new Set(Array.from(String(word))));
        charList.forEach((char: string) => {
          if (!leafMap.has(char)) {
            leafMap.set(char, { char, parentIds: [sub.id] });
          } else {
            const existing = leafMap.get(char)!;
            if (!existing.parentIds.includes(sub.id)) {
              existing.parentIds.push(sub.id);
            }
          }
        });
      }
    });

    // Position each UNIQUE Leaf Kanji Node (and reroute root character directly to KANJI INTI)
    const rootChar = (rootNode?.kanji || rootNode?.character || rootNode?.label || "").trim();

    leafMap.forEach((leafData, char) => {
      const isRootChar = rootChar && char.trim() === rootChar;

      let primaryCatColor = PALETTE[0];
      leafData.parentIds.forEach((pId, idx) => {
        if (idx === 0) {
          const pNode = initialRawNodes.find((n: any) => n.id === pId);
          const catId = pNode?.parentPill || pNode?.categoryId;
          if (catId && catColorMap.has(catId)) {
            primaryCatColor = catColorMap.get(catId)!;
          }
        }
      });

      if (isRootChar && rootNode) {
        // DO NOT create duplicate leaf node! Connect parent Jukugos directly to KANJI INTI root node
        leafData.parentIds.forEach((pId) => {
          const edgeColor = primaryCatColor || "#10b981";
          generatedEdges.push({
            id: `edge-${pId}-${rootNode.id}`,
            source: pId,
            target: rootNode.id,
            color: edgeColor,
            style: { stroke: edgeColor, strokeWidth: 2, strokeDasharray: "4 3" },
            animated: true,
          });
        });
        return; // Skip adding duplicate leaf node
      }

      const leafId = `unique-leaf-${char}`;
      const kInfo = kanjiMap.get(char);

      // Compute average position of parent Jukugo nodes
      let avgX = 0;
      let avgY = 0;
      let validCount = 0;

      leafData.parentIds.forEach((pId) => {
        const pos = nodePosMap.get(pId);
        if (pos) {
          avgX += pos.x;
          avgY += pos.y;
          validCount++;
        }
      });

      if (validCount > 0) {
        avgX /= validCount;
        avgY /= validCount;
      }

      // Radiate outward from average position
      const angleFromCenter = Math.atan2(avgY, avgX);
      const leafDistance = 240;
      const leafX = Math.round(avgX + Math.cos(angleFromCenter) * leafDistance);
      const leafY = Math.round(avgY + Math.sin(angleFromCenter) * leafDistance);

      const parentCount = leafData.parentIds.length;

      positionedNodes.push({
        id: leafId,
        type: "leafKanji",
        kanji: char,
        romaji: kInfo?.romaji || "",
        meaning: kInfo?.meaning || "",
        parentIds: leafData.parentIds,
        parentCount: parentCount,
        categoryColor: primaryCatColor,
        x: leafX,
        y: leafY,
      });
      nodePosMap.set(leafId, { x: leafX, y: leafY });

      // Add animated edge connecting EVERY parent Jukugo to this Leaf Kanji
      leafData.parentIds.forEach((pId) => {
        const edgeColor = primaryCatColor || "#10b981";
        generatedEdges.push({
          id: `edge-${pId}-${leafId}`,
          source: pId,
          target: leafId,
          color: edgeColor,
          style: { stroke: edgeColor, strokeWidth: 2, strokeDasharray: "4 3" },
          animated: true,
        });
      });
    });

    // 3. Format nodes for ReactFlow
    const formattedNodes = positionedNodes.map((node: any) => {
      const isExpanded = expandedNodes.has(node.id);
      const hasChildren = (node.type === "bottom" || node.type === "category") && initialRawNodes.some(
        (n: any) => (n.type === "sub-bottom" || n.type === "sub") && (n.parentPill === node.id || n.categoryId === node.id)
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

    let baseVisibleNodes = formattedNodes.filter((node: any) => {
      if (node.data.isRoot || node.data.type === "root") {
        return true;
      }
      if (node.data.type === "bottom" || node.data.type === "category") {
        return rootExpanded;
      }
      if (node.data.type === "sub-bottom" || node.data.type === "sub") {
        const parentId = node.data.parentPill || node.data.categoryId;
        return rootExpanded && (parentId ? expandedNodes.has(parentId) : true);
      }
      if (node.data.type === "leafKanji") {
        const parentIds: string[] = node.data.parentIds || [];
        return rootExpanded && parentIds.some((pId) => {
          const parentNode = initialRawNodes.find((n: any) => n.id === pId);
          const catId = parentNode?.parentPill || parentNode?.categoryId;
          return catId ? expandedNodes.has(catId) : true;
        });
      }
      return true;
    });

    // 4. Format Edges with Custom Cross-Link Outward Arc Routing and Animation for EVERY edge
    const baseEdges = [...generatedEdges];
    const subWordMap = new Map<string, string>();
    positionedNodes.forEach((n: any) => {
      if (n.type === "sub-bottom" && (n.character || n.kanji)) {
        subWordMap.set((n.character || n.kanji).trim(), n.id);
      }
    });

    // Cross-links between related jukugo cards derived dynamically from raw edges
    const crossLinkTriples: [string, string, string, string?][] = (initialRawEdges || [])
      .filter((e: any) => e.isCrossLink || (e.predicate && e.predicate !== "kategori" && e.predicate !== "mencakup"))
      .map((e: any) => [e.source, e.predicate || e.label || "", e.target, e.color]);

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

      const isCross = Boolean(edge.isCrossLink || (edge.id && edge.id.startsWith("cross-")) || (edge.predicate && edge.predicate !== "kategori" && edge.predicate !== "mencakup"));
      const { sourceHandle, targetHandle } = getOptimalHandles(srcPos, tgtPos);
      const labelText = isCross ? (edge.label || edge.predicate) : undefined;

      return {
        ...edge,
        type: isCross ? "crossLinkEdge" : "default",
        sourceHandle,
        targetHandle,
        label: labelText,
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 14,
          height: 14,
          color: strokeColor,
        },
        style: { 
          stroke: strokeColor, 
          strokeWidth: isCross ? 2.5 : 2,
          strokeDasharray: "5 4",
          opacity: isCross ? 1 : 0.85,
          ...edge.style,
        },
      };
    });

    // 5. Active Jukugo Isolation / Focus Mode (Exact Node ID matching first, then Word fallback)
    if (activeNodeId || activeJukugoWord) {
      let targetJukugoNode: any = null;

      if (activeNodeId) {
        targetJukugoNode = baseVisibleNodes.find((n: any) => n.id === activeNodeId);
      }
      if (!targetJukugoNode && activeJukugoWord) {
        const activeWordTrim = activeJukugoWord.trim();
        targetJukugoNode = baseVisibleNodes.find(
          (n: any) => (n.data.kanji || n.data.character || n.data.word || "").trim() === activeWordTrim
        );
      }

      if (targetJukugoNode) {
        const targetId = targetJukugoNode.id;
        const connectedNodeIds = new Set<string>([targetId]);

        // Find root and category nodes
        if (rootNodeObj) connectedNodeIds.add(rootNodeObj.id);
        const catId = targetJukugoNode.data.parentPill || targetJukugoNode.data.categoryId;
        if (catId) connectedNodeIds.add(catId);

        // Find all connected nodes via edges
        formattedEdges.forEach((e: any) => {
          if (e.source === targetId) connectedNodeIds.add(e.target);
          if (e.target === targetId) connectedNodeIds.add(e.source);
        });

        // Filter visible nodes to only connected ones
        baseVisibleNodes = baseVisibleNodes.filter((n: any) => connectedNodeIds.has(n.id));
      }
    }

    const visibleEdgeSet = new Set(baseVisibleNodes.map((n: any) => n.id));
    const visibleEdges = formattedEdges.filter(
      (e: any) => visibleEdgeSet.has(e.source) && visibleEdgeSet.has(e.target)
    );

    setNodes(baseVisibleNodes);
    setEdges(visibleEdges);
  }, [initialRawNodes, initialRawEdges, expandedNodes, kanjiMap, activeJukugoWord, activeNodeId]);

  // Click node handler
  const onNodeClick = (_: any, node: any) => {
    if (node.data.type === "sub-bottom" || node.data.type === "sub") {
      const word = (node.data.kanji || node.data.character || node.data.word || "").trim();
      onSelectJukugo?.(word, node.id);
    } else if (node.data.hasChildren) {
      setExpandedNodes((prev) => {
        const next = new Set(prev);
        if (next.has(node.id)) {
          next.delete(node.id);
        } else {
          next.add(node.id);
        }
        return next;
      });
    }
  };

  // Click background canvas -> clear selection and show all nodes
  const onPaneClick = () => {
    onSelectJukugo?.(null, null);
  };

  return (
    <div className="w-full h-full min-h-[640px] bg-slate-50 relative cursor-grab active:cursor-grabbing">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        minZoom={0.1}
        maxZoom={2.5}
      >
        <Background color="#cbd5e1" gap={24} size={1} />
        <Controls className="!bg-white !border-slate-200 !fill-slate-700 rounded-xl overflow-hidden shadow-md" />
      </ReactFlow>
    </div>
  );
}
