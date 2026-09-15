import { useMemo, useEffect, useState, useRef } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  Background,
  Controls,
  MarkerType,
  getBezierPath,
  type EdgeProps,
  EdgeLabelRenderer,
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

// Web Audio API Synthesized SFX for Node & Category Pop Animations
function playPopSfx(index: number = 0, type: "category" | "node" = "node") {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "category") {
      // Soft pleasant chime pop for categories (C5, E5, G5, C6...)
      const scale = [523.25, 659.25, 783.99, 1046.5, 1318.5];
      const freq = scale[index % scale.length];

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.25, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } else {
      // Crisp bubble pop / chime for Jukugo & Leaf pairs (E5, G5, B5, D6, F#6...)
      const scale = [659.25, 783.99, 987.77, 1174.66, 1479.98];
      const freq = scale[index % scale.length];

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq * 0.85, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.15, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch (err) {
    // Ignore audio restrictions
  }
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
  data,
}: EdgeProps) => {
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;
  const distFromCenter = Math.sqrt(midX * midX + midY * midY);
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;

  let edgePath = "";
  let labelX = midX;
  let labelY = midY;

  // 1. Same-column / vertical cross links (e.g. 経験 -> 経歴 in same vertical stack)
  if (Math.abs(dx) < 160 && Math.abs(dy) > 100) {
    const isLeftSide = midX < 0;
    const curveOffset = isLeftSide ? -240 : 240;
    const ctrlX = Math.min(sourceX, targetX) + curveOffset;

    // Cubic bezier curve extending outward to avoid middle nodes (e.g. 経過)
    edgePath = `M ${sourceX} ${sourceY} C ${ctrlX} ${sourceY}, ${ctrlX} ${targetY}, ${targetX} ${targetY}`;
    labelX = ctrlX * 0.75 + midX * 0.25;
    labelY = midY;
  }
  // 2. Lines passing close to central root node (within 380px radius)
  else if (distFromCenter < 380) {
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

  const labelText = typeof label === "string" ? label.replace(/_/g, " ") : label;
  const isVisible = style.opacity === undefined || (typeof style.opacity === "number" && style.opacity > 0);
  const isSelected = Boolean((data as any)?.isSelected);

  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          stroke: isSelected ? "#f59e0b" : (style.stroke || "#3b82f6"),
          strokeWidth: isSelected ? 4.5 : (style.strokeWidth || 2.2),
          transition: "opacity 0.5s ease-out, stroke 0.5s ease-out, stroke-width 0.3s ease",
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {labelText && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: isVisible ? "all" : "none",
              transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
              opacity: style.opacity ?? 1,
            }}
            className="nodrag nopan"
            onClick={(e) => {
              e.stopPropagation();
              (data as any)?.onSelectRelation?.(id);
            }}
          >
            <div className={`px-3.5 py-1 rounded-full text-[11px] font-black shadow-lg border-2 cursor-pointer transition-all duration-300 ${
              isSelected
                ? "bg-amber-400 text-slate-950 border-amber-300 ring-4 ring-amber-400/50 scale-115 z-50"
                : "bg-white text-slate-900 border-slate-700 hover:bg-slate-900 hover:text-white hover:scale-110"
            }`}>
              {labelText}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

// Custom Edge component for Structural Hierarchy Edges (kategori, mencakup, penyusun)
const CustomHierarchyEdge = ({
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
  data,
}: EdgeProps) => {
  const [edgePath, _lx, ly] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Calculate label position at 36% along the X axis between source and target,
  // keeping it cleanly in the open gap near source node and away from target node cards.
  const labelX = sourceX + (targetX - sourceX) * 0.36;
  const labelY = ly;

  const labelText = typeof label === "string" ? label.replace(/_/g, " ") : label;
  const isVisible = style.opacity === undefined || (typeof style.opacity === "number" && style.opacity > 0);
  const isSelected = Boolean((data as any)?.isSelected);

  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          stroke: isSelected ? "#f59e0b" : (style.stroke || "#64748b"),
          strokeWidth: isSelected ? 4 : (style.strokeWidth || 2),
          transition: "opacity 0.5s ease-out, stroke 0.5s ease-out, stroke-width 0.3s ease",
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {labelText && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: isVisible ? "all" : "none",
              transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
              opacity: isVisible ? (style.opacity ?? 1) : 0,
            }}
            className="nodrag nopan"
            onClick={(e) => {
              e.stopPropagation();
              (data as any)?.onSelectRelation?.(id);
            }}
          >
            <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-xs whitespace-nowrap backdrop-blur-xs cursor-pointer transition-all duration-300 ${
              isSelected
                ? "bg-amber-400 text-slate-950 border-2 border-amber-300 ring-4 ring-amber-400/50 scale-110 z-50"
                : "bg-white/95 text-slate-700 border border-slate-300 hover:bg-slate-900 hover:text-white hover:scale-105"
            }`}>
              {labelText}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

// Helper function to pick optimal handles on all 4 sides
function getOptimalHandles(
  srcPos?: { x: number; y: number },
  tgtPos?: { x: number; y: number },
  isCross?: boolean
) {
  if (!srcPos || !tgtPos) return { sourceHandle: undefined, targetHandle: undefined };

  const dx = tgtPos.x - srcPos.x;
  const dy = tgtPos.y - srcPos.y;

  if (isCross && Math.abs(dx) < 160 && Math.abs(dy) > 100) {
    const isLeft = srcPos.x < 0;
    return isLeft
      ? { sourceHandle: "s-left", targetHandle: "t-left" }
      : { sourceHandle: "s-right", targetHandle: "t-right" };
  }

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

function KanjiAtlasFlowInner({
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
  const { setCenter, fitBounds, fitView } = useReactFlow();
  const nodeTypes = useMemo(() => ({ kanjiNode: KanjiNode }), []);
  const edgeTypes = useMemo(() => ({ crossLinkEdge: CustomCrossLinkEdge, hierarchyEdge: CustomHierarchyEdge }), []);

  // Progressive Interactive State
  const [areCategoriesVisible, setAreCategoriesVisible] = useState(false);
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<string>>(new Set());
  const [openCategoryHistory, setOpenCategoryHistory] = useState<string[]>([]);
  const [selectedRelationEdgeId, setSelectedRelationEdgeId] = useState<string | null>(null);

  const [kanjis, setKanjis] = useState<any[]>([]);
  const [jukugos, setJukugos] = useState<any[]>([]);

  const onSelectJukugoRef = useRef(onSelectJukugo);
  useEffect(() => {
    onSelectJukugoRef.current = onSelectJukugo;
  }, [onSelectJukugo]);

  // Fetch all kanji & jukugo details for romaji & meaning lookup
  useEffect(() => {
    api.admin.kanjis
      .list()
      .then((data) => setKanjis(data))
      .catch((err) => console.error("Gagal memuat detail kanji untuk atlas:", err));

    api.admin.jukugos
      .list()
      .then((data) => setJukugos(data))
      .catch((err) => console.error("Gagal memuat detail jukugo untuk atlas:", err));
  }, []);

  const kanjiMap = useMemo(() => {
    const map = new Map<string, any>();
    kanjis.forEach((k) => map.set(k.character, k));
    return map;
  }, [kanjis]);

  const jukugoMap = useMemo(() => {
    const map = new Map<string, any>();
    jukugos.forEach((j) => map.set(j.word, j));
    return map;
  }, [jukugos]);

  const { positionedNodes, nodePosMap, deduplicatedEdges, catColorMap } = useMemo(() => {
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
      const labelA = a.label || a.kanji || a.name || "";
      const labelB = b.label || b.kanji || b.name || "";
      const matchA = labelA.match(/^(\d+)\./);
      const matchB = labelB.match(/^(\d+)\./);
      if (matchA && matchB) {
        return parseInt(matchA[1], 10) - parseInt(matchB[1], 10);
      }
      const colorA = (a.color || a.borderColor?.split("-")[1] || "").toLowerCase();
      const colorB = (b.color || b.borderColor?.split("-")[1] || "").toLowerCase();
      const orderA = categoryOrderMap[colorA] ?? 99;
      const orderB = categoryOrderMap[colorB] ?? 99;
      return orderA - orderB;
    });

    const positionedNodes: any[] = [];
    const nodePosMap = new Map<string, { x: number; y: number }>();
    const generatedEdges: any[] = [];
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

    // 2. Dynamic 2-Column Grid Layout for Category Clusters
    const rootChar = (rootNode?.kanji || rootNode?.character || rootNode?.word || rootNode?.label || "").trim();

    const catHeights = categoryNodes.map((cat) => {
      const jks = initialRawNodes.filter(
        (n: any) => (n.type === "sub-bottom" || n.type === "sub") && (n.parentPill === cat.id || n.categoryId === cat.id)
      );
      const numJk = jks.length || 1;
      return Math.max(numJk * 220 + 150, 500);
    });

    const leftCatIndices: number[] = [];
    const rightCatIndices: number[] = [];
    categoryNodes.forEach((_, idx) => {
      if (idx % 2 === 0) leftCatIndices.push(idx);
      else rightCatIndices.push(idx);
    });

    const totalLeftHeight = leftCatIndices.reduce((sum, idx) => sum + catHeights[idx] + 350, -350);
    const totalRightHeight = rightCatIndices.reduce((sum, idx) => sum + catHeights[idx] + 350, -350);

    let currentLeftY = -totalLeftHeight / 2;
    let currentRightY = -totalRightHeight / 2;

    const categoryComputedPositions: Array<{ x: number; y: number; dir: number }> = new Array(categoryNodes.length);

    leftCatIndices.forEach((catIdx) => {
      const h = catHeights[catIdx];
      const centerY = currentLeftY + h / 2;
      categoryComputedPositions[catIdx] = { x: -1600, y: centerY, dir: -1 };
      currentLeftY += h + 350;
    });

    rightCatIndices.forEach((catIdx) => {
      const h = catHeights[catIdx];
      const centerY = currentRightY + h / 2;
      categoryComputedPositions[catIdx] = { x: 1600, y: centerY, dir: 1 };
      currentRightY += h + 350;
    });

    categoryNodes.forEach((cat, catIdx) => {
      const catColor = getCategoryColor(catIdx, cat.kanji || cat.name || cat.id);
      catColorMap.set(cat.id, catColor);

      const catPos = categoryComputedPositions[catIdx] || { x: catIdx % 2 === 0 ? -1600 : 1600, y: catIdx * 600, dir: catIdx % 2 === 0 ? -1 : 1 };
      const catX = catPos.x;
      const catY = catPos.y;
      const dir = catPos.dir;

      // Stagger delay for categories (150ms, 300ms, 450ms...)
      positionedNodes.push({
        ...cat,
        categoryColor: catColor,
        staggerIndex: catIdx,
        animDelayMs: 150 + catIdx * 150,
        x: catX,
        y: catY,
      });
      nodePosMap.set(cat.id, { x: catX, y: catY });

      // Edge: Root -> Category
      const rootToCatEdgeId = `e-${rootNode?.id || "root"}-${cat.id}`;
      if (!generatedEdges.some((e: any) => e.id === rootToCatEdgeId)) {
        generatedEdges.push({
          id: rootToCatEdgeId,
          source: rootNode?.id || "root",
          target: cat.id,
          sourceHandle: catX < 0 ? "s-left" : "s-right",
          targetHandle: catX < 0 ? "t-right" : "t-left",
          label: "kategori",
          color: catColor,
          style: { stroke: catColor, strokeWidth: 3 },
          animated: true,
        });
      }

      // Fetch main Jukugo children of this category
      const mainJukugos = initialRawNodes.filter(
        (n: any) => (n.type === "sub-bottom" || n.type === "sub") && (n.parentPill === cat.id || n.categoryId === cat.id)
      );
      mainJukugos.sort((a, b) => a.id.localeCompare(b.id));

      if (mainJukugos.length === 0) return;

      const col1X = catX + dir * 540;
      const col2X = catX + dir * 1020;
      const col3X = catX + dir * 1480;

      const subCompoundRequests: Map<string, { subWord: string; meaning: string; parentJkIds: string[]; preferredY: number }> = new Map();
      const leafKanjiRequests: Map<string, { char: string; parentIds: string[]; preferredY: number; animIndex?: number }> = new Map();

      const jukugoSpacingY = 200;
      const numJk = mainJukugos.length;
      const startJukugoY = catY - ((numJk - 1) * jukugoSpacingY) / 2;

      mainJukugos.forEach((jk, jkIdx) => {
        const jkX = col1X;
        const jkY = startJukugoY + jkIdx * jukugoSpacingY;

        // Node Jukugo gets staggered wave delay: Pair 0 = 300ms, Pair 1 = 500ms, Pair 2 = 700ms...
        const pairDelayMs = 300 + jkIdx * 200;

        positionedNodes.push({
          ...jk,
          categoryColor: catColor,
          parentPill: cat.id,
          categoryId: cat.id,
          staggerIndex: jkIdx,
          animDelayMs: pairDelayMs,
          x: jkX,
          y: jkY,
        });
        nodePosMap.set(jk.id, { x: jkX, y: jkY });

        const catToJkEdgeId = `e-${cat.id}-${jk.id}`;
        if (!generatedEdges.some((e: any) => e.id === catToJkEdgeId)) {
          generatedEdges.push({
            id: catToJkEdgeId,
            source: cat.id,
            target: jk.id,
            sourceHandle: dir === 1 ? "s-right" : "s-left",
            targetHandle: dir === 1 ? "t-left" : "t-right",
            label: "mencakup",
            color: catColor,
            style: { stroke: catColor, strokeWidth: 2 },
            animated: true,
          });
        }

        const word = (jk.kanji || jk.character || jk.word || "").trim();
        if (!word) return;

        let parts: Array<{ word: string; meaning: string }> = [];
        if (Array.isArray(jk.semanticNodes) && jk.semanticNodes.length > 0) {
          parts = jk.semanticNodes
            .map((sn: any) => ({
              word: (sn.jokugo || sn.kanji || "").trim(),
              meaning: sn.arti || "",
            }))
            .filter((p: any) => p.word.length > 0);
        }

        if (word.length >= 3 && parts.length === 0) {
          const isKnownSub = (w: string) => jukugoMap.has(w);

          if (word.length === 4) {
            const head2 = word.slice(0, 2);
            const tail2 = word.slice(2, 4);
            if (head2 !== tail2) {
              parts = [
                { word: head2, meaning: jukugoMap.get(head2)?.meaning || "" },
                { word: tail2, meaning: jukugoMap.get(tail2)?.meaning || "" },
              ];
            } else {
              parts = Array.from(word as string).map((c) => ({ word: c, meaning: "" }));
            }
          } else if (word.length === 3) {
            const head2 = word.slice(0, 2);
            const tail2 = word.slice(1, 3);
            if (isKnownSub(head2)) {
              parts = [
                { word: head2, meaning: jukugoMap.get(head2)?.meaning || "" },
                { word: word.slice(2), meaning: "" },
              ];
            } else if (isKnownSub(tail2)) {
              parts = [
                { word: word.slice(0, 1), meaning: "" },
                { word: tail2, meaning: jukugoMap.get(tail2)?.meaning || "" },
              ];
            } else {
              parts = Array.from(word as string).map((c) => ({ word: c, meaning: "" }));
            }
          } else if (word.length > 4) {
            const head2 = word.slice(0, 2);
            const tailSub = word.slice(2);
            parts = [
              { word: head2, meaning: jukugoMap.get(head2)?.meaning || "" },
              { word: tailSub, meaning: jukugoMap.get(tailSub)?.meaning || "" },
            ];
          }
        }

        const subCompounds = parts.filter((p) => p.word.length >= 2);
        const hasSubCompounds = subCompounds.length > 0;

        if (hasSubCompounds) {
          subCompounds.forEach((p) => {
            const req = subCompoundRequests.get(p.word) || {
              subWord: p.word,
              meaning: p.meaning,
              parentJkIds: [] as string[],
              preferredY: jkY,
            };
            if (!req.parentJkIds.includes(jk.id)) req.parentJkIds.push(jk.id);
            if (p.meaning && (!req.meaning || req.meaning === "Sub-Jukugo")) {
              req.meaning = p.meaning;
            }
            subCompoundRequests.set(p.word, req);
          });
        } else {
          const chars: string[] = Array.from(new Set(Array.from(word as string))).filter((c: string) => c !== rootChar);
          chars.forEach((char: string) => {
            const req = leafKanjiRequests.get(char) || { char, parentIds: [] as string[], preferredY: jkY, animIndex: jkIdx };
            if (!req.parentIds.includes(jk.id)) req.parentIds.push(jk.id);
            leafKanjiRequests.set(char, req);
          });
        }
      });

      // Render Sub-Jukugo Cards in Column 2
      const subCompArray = Array.from(subCompoundRequests.values());
      const subSpacingY = 220;
      const numSub = subCompArray.length;
      const startSubY = catY - ((numSub - 1) * subSpacingY) / 2;

      subCompArray.forEach((req, sIdx) => {
        const subNodeId = `sub-jokugo-${cat.id}-${req.subWord}`;
        const dbJ = jukugoMap.get(req.subWord);
        const rText = dbJ?.reading || (req.subWord === "分野" ? "ぶんや" : req.subWord === "方法" ? "ほうほう" : "");
        const mText = (req.meaning && req.meaning !== "Sub-Jukugo")
          ? req.meaning
          : (dbJ?.meaning || (req.subWord === "分野" ? "bidang ilmu" : req.subWord === "方法" ? "cara atau prosedur" : req.subWord));

        const subX = col2X;
        const subY = startSubY + sIdx * subSpacingY;

        const parentJkNode = positionedNodes.find((n) => req.parentJkIds.includes(n.id));
        const sAnimIdx = parentJkNode?.staggerIndex ?? sIdx;
        const sAnimDelay = 300 + sAnimIdx * 200;

        if (!positionedNodes.some((n: any) => n.id === subNodeId)) {
          positionedNodes.push({
            id: subNodeId,
            type: "sub-bottom",
            kanji: req.subWord,
            label: req.subWord,
            subLabel: rText ? `(${rText})` : "",
            reading: rText,
            meaning: mText,
            description: mText,
            categoryColor: catColor,
            parentPill: cat.id,
            categoryId: cat.id,
            staggerIndex: sAnimIdx,
            animDelayMs: sAnimDelay,
            x: subX,
            y: subY,
          });
          nodePosMap.set(subNodeId, { x: subX, y: subY });
        }

        req.parentJkIds.forEach((pId) => {
          const subEdgeId = `edge-subjokugo-${pId}-${subNodeId}`;
          if (!generatedEdges.some((e: any) => e.id === subEdgeId)) {
            generatedEdges.push({
              id: subEdgeId,
              source: pId,
              target: subNodeId,
              sourceHandle: dir === 1 ? "s-right" : "s-left",
              targetHandle: dir === 1 ? "t-left" : "t-right",
              label: mText || "unsur",
              color: catColor,
              style: { stroke: catColor, strokeWidth: 2 },
              animated: true,
            });
          }
        });

        const pChars: string[] = Array.from(req.subWord as string).filter((c: string) => c !== rootChar);
        pChars.forEach((char: string) => {
          const lReq = leafKanjiRequests.get(char) || { char, parentIds: [] as string[], preferredY: subY, animIndex: sAnimIdx };
          if (!lReq.parentIds.includes(subNodeId)) lReq.parentIds.push(subNodeId);
          leafKanjiRequests.set(char, lReq);
        });
      });

      // Render Leaf Kanjis in Column 3 - Matches parent Jukugo pair delay!
      const leafRequestsArray = Array.from(leafKanjiRequests.values());
      leafRequestsArray.sort((a, b) => a.preferredY - b.preferredY);

      const leafSpacingY = 180;
      const numLeaves = leafRequestsArray.length;
      const startLeafY = catY - ((numLeaves - 1) * leafSpacingY) / 2;

      leafRequestsArray.forEach((lReq, lIdx) => {
        const leafNodeId = `leaf-${cat.id}-${lReq.char}`;
        const leafX = col3X;
        const leafY = startLeafY + lIdx * leafSpacingY;

        const kInfo = kanjiMap.get(lReq.char);
        const romajiText = kInfo?.romaji || kInfo?.onyomi || kInfo?.kunyomi || lReq.char;
        const kanjiMeaning = kInfo?.meaning || `Kanji ${lReq.char}`;

        const animIdx = lReq.animIndex ?? lIdx;
        const animDelayMs = 300 + animIdx * 200;

        if (!positionedNodes.some((n: any) => n.id === leafNodeId)) {
          positionedNodes.push({
            id: leafNodeId,
            type: "leafKanji",
            kanji: lReq.char,
            label: lReq.char,
            subLabel: `(${romajiText})`,
            romaji: romajiText,
            reading: romajiText,
            meaning: kanjiMeaning,
            description: kanjiMeaning,
            categoryColor: catColor,
            parentPill: cat.id,
            categoryId: cat.id,
            staggerIndex: animIdx,
            animDelayMs: animDelayMs,
            x: leafX,
            y: leafY,
          });
          nodePosMap.set(leafNodeId, { x: leafX, y: leafY });
        }

        lReq.parentIds.forEach((pId) => {
          const leafEdgeId = `edge-leaf-${pId}-${leafNodeId}`;
          if (!generatedEdges.some((e: any) => e.id === leafEdgeId)) {
            generatedEdges.push({
              id: leafEdgeId,
              source: pId,
              target: leafNodeId,
              sourceHandle: dir === 1 ? "s-right" : "s-left",
              targetHandle: dir === 1 ? "t-left" : "t-right",
              label: "penyusun",
              color: catColor,
              style: { stroke: catColor, strokeWidth: 1.8, strokeDasharray: "4 3" },
              animated: true,
            });
          }
        });
      });
    });

    // 3. Process Cross-Link Edges between nodes
    const baseEdges = [...generatedEdges];

    (initialRawEdges || []).forEach((rawEdge: any) => {
      const pred = (rawEdge.predicate || rawEdge.label || "").trim();
      if (!pred || pred === "kategori" || pred === "mencakup" || pred === "penyusun") return;

      const srcWord = (rawEdge.source || "").trim();
      const tgtWord = (rawEdge.target || "").trim();

      if (!srcWord || !tgtWord || srcWord === tgtWord) return;

      let srcNodes = positionedNodes.filter((n: any) => (n.kanji || n.character || n.word || n.label || "").trim() === srcWord);
      let tgtNodes = positionedNodes.filter((n: any) => (n.kanji || n.character || n.word || n.label || "").trim() === tgtWord);

      // Prefer sub/leaf nodes over root node for cross links to avoid attaching cross links directly to root
      if (srcNodes.some((n: any) => !n.isRoot && n.type !== "root")) {
        srcNodes = srcNodes.filter((n: any) => !n.isRoot && n.type !== "root");
      }
      if (tgtNodes.some((n: any) => !n.isRoot && n.type !== "root")) {
        tgtNodes = tgtNodes.filter((n: any) => !n.isRoot && n.type !== "root");
      }

      srcNodes.forEach((sNode) => {
        tgtNodes.forEach((tNode) => {
          if (sNode.id !== tNode.id) {
            const crossEdgeId = `cross-${sNode.id}-${tNode.id}`;
            if (!baseEdges.some((e: any) => e.id === crossEdgeId)) {
              baseEdges.push({
                id: crossEdgeId,
                source: sNode.id,
                target: tNode.id,
                label: pred,
                predicate: pred,
                color: "#3b82f6",
                isCrossLink: true,
                style: { stroke: "#3b82f6", strokeWidth: 2.2, strokeDasharray: "6 4" },
                animated: true,
              });
            }
          }
        });
      });
    });

    const uniqueEdgesMap = new Map<string, any>();
    baseEdges.forEach((edge: any) => {
      // Always use undirected pair key to strictly prevent duplicate lines between any pair of nodes
      const pairKey = [edge.source, edge.target].sort().join("<->");

      if (!uniqueEdgesMap.has(pairKey)) {
        uniqueEdgesMap.set(pairKey, edge);
      } else {
        const existing = uniqueEdgesMap.get(pairKey);
        // Prefer edge that has explicit handles and label/styling
        if ((!existing.sourceHandle && edge.sourceHandle) || (!existing.label && edge.label)) {
          uniqueEdgesMap.set(pairKey, edge);
        }
      }
    });

    const deduplicatedEdges = Array.from(uniqueEdgesMap.values());

    return {
      positionedNodes,
      nodePosMap,
      deduplicatedEdges,
      catColorMap,
    };
  }, [initialRawNodes, initialRawEdges, kanjiMap, jukugoMap]);

  // Helper to focus camera on a specific category cluster
  const focusOnCategoryCluster = (catId: string, duration: number = 800) => {
    const catClusterNodes = positionedNodes.filter(
      (n: any) => n.id === catId || n.parentPill === catId || n.categoryId === catId || n.id.includes(catId)
    );

    if (catClusterNodes.length > 0) {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      catClusterNodes.forEach((cn) => {
        if (cn.x < minX) minX = cn.x;
        if (cn.x > maxX) maxX = cn.x;
        if (cn.y < minY) minY = cn.y;
        if (cn.y > maxY) maxY = cn.y;
      });

      const padX = 250;
      const padY = 200;
      const width = Math.max(maxX - minX + padX * 2, 900);
      const height = Math.max(maxY - minY + padY * 2, 600);

      fitBounds(
        { x: minX - padX, y: minY - padY, width, height },
        { padding: 0.2, duration }
      );
    } else {
      const nodeObj = positionedNodes.find((n) => n.id === catId);
      if (nodeObj) {
        setCenter(nodeObj.x, nodeObj.y, { zoom: 0.9, duration });
      }
    }
  };

  // Helper to restore camera view after unselecting relation edge
  const restoreCameraView = () => {
    if (openCategoryHistory.length > 0) {
      const lastOpenCatId = openCategoryHistory[openCategoryHistory.length - 1];
      focusOnCategoryCluster(lastOpenCatId, 750);
    } else if (areCategoriesVisible) {
      const visibleCatNodes = positionedNodes.filter((n: any) => n.id === "root" || n.type === "bottom" || n.type === "category");
      fitView({ nodes: visibleCatNodes, padding: 0.35, duration: 750 });
    } else {
      setCenter(0, 0, { zoom: 1.1, duration: 700 });
    }
  };

  // Helper to select a relation edge and isolate connected nodes & branch path
  const handleSelectRelation = (edgeId: string) => {
    if (selectedRelationEdgeId === edgeId) {
      setSelectedRelationEdgeId(null);
      restoreCameraView();
    } else {
      setSelectedRelationEdgeId(edgeId);
      playPopSfx(0, "node");

      const relEdge = deduplicatedEdges.find((e: any) => e.id === edgeId);
      if (relEdge) {
        const sNode = positionedNodes.find((n: any) => n.id === relEdge.source);
        const tNode = positionedNodes.find((n: any) => n.id === relEdge.target);

        if (sNode && tNode) {
          const branchIds = new Set<string>([sNode.id, tNode.id]);
          [sNode, tNode].forEach((node) => {
            let curr = node;
            while (curr) {
              const parentId = curr.parentPill || curr.categoryId;
              if (!parentId || branchIds.has(parentId)) break;
              branchIds.add(parentId);
              curr = positionedNodes.find((n: any) => n.id === parentId);
            }
          });

          const rootObj = positionedNodes.find((n: any) => n.type === "root" || n.isRoot);
          if (rootObj) branchIds.add(rootObj.id);

          const branchNodes = positionedNodes.filter((n: any) => branchIds.has(n.id));
          if (branchNodes.length > 0) {
            const xs = branchNodes.map((n: any) => n.x);
            const ys = branchNodes.map((n: any) => n.y);
            const minX = Math.min(...xs) - 250;
            const maxX = Math.max(...xs) + 250;
            const minY = Math.min(...ys) - 200;
            const maxY = Math.max(...ys) + 200;
            const width = Math.max(maxX - minX, 600);
            const height = Math.max(maxY - minY, 400);

            fitBounds({ x: minX, y: minY, width, height }, { padding: 0.25, duration: 800 });
          }
        }
      }
    }
  };

  // Initial Camera Focus centered on Root Node at startup
  const initialFocusedRef = useRef(false);
  useEffect(() => {
    if (positionedNodes.length > 0 && !initialFocusedRef.current) {
      initialFocusedRef.current = true;
      setTimeout(() => {
        setCenter(0, 0, { zoom: 1.1, duration: 600 });
      }, 150);
    }
  }, [positionedNodes, setCenter]);

  // Auto-expand root & parent category when activeJukugoWord or activeNodeId is set externally
  useEffect(() => {
    if (!activeJukugoWord && !activeNodeId) return;

    const targetNode = positionedNodes.find((n: any) => {
      if (activeNodeId && n.id === activeNodeId) return true;
      const w = (n.kanji || n.character || n.word || n.label || "").trim();
      return Boolean(w) && w === activeJukugoWord;
    });

    if (targetNode) {
      const parentCatId = targetNode.parentPill || targetNode.categoryId;

      // 1. Reveal categories if hidden
      if (!areCategoriesVisible) {
        setAreCategoriesVisible(true);
      }

      // 2. Expand parent category if not expanded
      if (parentCatId && !expandedCategoryIds.has(parentCatId)) {
        setExpandedCategoryIds((prev) => new Set([...Array.from(prev), parentCatId]));
        setOpenCategoryHistory((prev) => (prev.includes(parentCatId) ? prev : [...prev, parentCatId]));
      }

      // 3. Smoothly center camera on target node
      if (targetNode.x !== undefined && targetNode.y !== undefined) {
        setCenter(targetNode.x, targetNode.y, { zoom: 1.2, duration: 750 });
      }
    }
  }, [activeJukugoWord, activeNodeId, positionedNodes]);

  // Compute set of all node IDs connected in the branch path of the selected relation edge
  const selectedRelationConnectedIds = useMemo(() => {
    const ids = new Set<string>();
    if (!selectedRelationEdgeId) return ids;

    const selectedEdge = deduplicatedEdges.find((e: any) => e.id === selectedRelationEdgeId);
    if (!selectedEdge) return ids;

    const sNode = positionedNodes.find((n: any) => n.id === selectedEdge.source);
    const tNode = positionedNodes.find((n: any) => n.id === selectedEdge.target);

    if (sNode) ids.add(sNode.id);
    if (tNode) ids.add(tNode.id);

    // Walk UP parent hierarchy only (parentPill / categoryId), strictly ignoring cross links
    [sNode, tNode].forEach((node) => {
      let curr = node;
      while (curr) {
        const parentId = curr.parentPill || curr.categoryId;
        if (!parentId || ids.has(parentId)) break;
        ids.add(parentId);
        curr = positionedNodes.find((n: any) => n.id === parentId);
      }
    });

    const rootObj = positionedNodes.find((n: any) => n.type === "root" || n.isRoot);
    if (rootObj) {
      ids.add(rootObj.id);
    }

    return ids;
  }, [selectedRelationEdgeId, deduplicatedEdges, positionedNodes]);

  // Compute set of all node IDs connected to active selected node (root, parent category, cross links, constituent nodes)
  const activeNodeConnectedIds = useMemo(() => {
    const ids = new Set<string>();
    if (!activeJukugoWord && !activeNodeId) return ids;

    const targetNodes = positionedNodes.filter((n: any) => {
      if (activeNodeId && n.id === activeNodeId) return true;
      const w = (n.kanji || n.character || n.word || n.label || "").trim();
      return Boolean(w) && w === activeJukugoWord;
    });

    if (targetNodes.length === 0) return ids;

    targetNodes.forEach((n: any) => ids.add(n.id));

    const rootObj = positionedNodes.find((n: any) => n.type === "root" || n.isRoot);
    if (rootObj) ids.add(rootObj.id);

    targetNodes.forEach((targetNode: any) => {
      const parentCatId = targetNode.parentPill || targetNode.categoryId;
      if (parentCatId) ids.add(parentCatId);

      const isCat = targetNode.type === "bottom" || targetNode.type === "category";
      if (isCat) {
        positionedNodes.forEach((n: any) => {
          if (n.parentPill === targetNode.id || n.categoryId === targetNode.id || n.id.includes(targetNode.id)) {
            ids.add(n.id);
          }
        });
      }

      deduplicatedEdges.forEach((edge: any) => {
        const isConnected = edge.source === targetNode.id || edge.target === targetNode.id;
        if (isConnected) {
          ids.add(edge.source);
          ids.add(edge.target);

          const sNode = positionedNodes.find((n: any) => n.id === edge.source);
          const tNode = positionedNodes.find((n: any) => n.id === edge.target);
          if (sNode?.parentPill) ids.add(sNode.parentPill);
          if (sNode?.categoryId) ids.add(sNode.categoryId);
          if (tNode?.parentPill) ids.add(tNode.parentPill);
          if (tNode?.categoryId) ids.add(tNode.categoryId);
        }
      });

      const targetWord = (targetNode.kanji || targetNode.character || targetNode.word || targetNode.label || "").trim();
      if (targetWord) {
        initialRawEdges.forEach((rawEdge: any) => {
          const srcW = (rawEdge.source || "").trim();
          const tgtW = (rawEdge.target || "").trim();
          if (srcW === targetWord || tgtW === targetWord) {
            const otherW = srcW === targetWord ? tgtW : srcW;
            positionedNodes.forEach((n: any) => {
              const nW = (n.kanji || n.character || n.word || n.label || "").trim();
              if (nW === otherW) {
                ids.add(n.id);
                if (n.parentPill) ids.add(n.parentPill);
                if (n.categoryId) ids.add(n.categoryId);
              }
            });
          }
        });
      }
    });

    return ids;
  }, [activeJukugoWord, activeNodeId, positionedNodes, deduplicatedEdges, initialRawEdges]);

  // Progressive Interactive Node State with Animated Visibility Flag & Relation Isolation
  const nodes = useMemo(() => {
    const selectedEdge = selectedRelationEdgeId
      ? deduplicatedEdges.find((e: any) => e.id === selectedRelationEdgeId)
      : null;

    let relSrcNodeId = selectedEdge?.source;
    let relTgtNodeId = selectedEdge?.target;

    if (selectedEdge) {
      const sNode = positionedNodes.find((n: any) => n.id === selectedEdge.source);
      const tNode = positionedNodes.find((n: any) => n.id === selectedEdge.target);

      if (sNode) relSrcNodeId = sNode.id;
      if (tNode) relTgtNodeId = tNode.id;
    }

    return positionedNodes.map((node: any) => {
      const isCategory = node.type === "bottom" || node.type === "category";
      const isRootNode = node.type === "root" || node.isRoot;
      const parentCatId = node.parentPill || node.categoryId;
      const nodeWord = (node.kanji || node.character || node.word || node.label || "").trim();

      let isVisible = false;
      let isActiveStep = false;

      if (selectedEdge) {
        // IF A RELATION EDGE IS CLICKED/SELECTED:
        // Keep ONLY exact endpoints and their parent branch path visible, hide all rest!
        const isDirectEndpoint = node.id === relSrcNodeId || node.id === relTgtNodeId;
        const isInConnectedPath = selectedRelationConnectedIds.has(node.id) || isDirectEndpoint;

        if (isInConnectedPath) {
          isVisible = true;
          isActiveStep = isDirectEndpoint; // Highlight ring ONLY on exact direct endpoints!
        } else {
          isVisible = false; // Hide all rest!
        }
      } else if (activeJukugoWord || activeNodeId) {
        // IF A NODE IS SELECTED:
        // Keep ONLY exact connected subnet visible, hide all unrelated nodes!
        if (activeNodeConnectedIds.has(node.id)) {
          isVisible = true;
        } else {
          isVisible = false;
        }

        if (activeNodeId) {
          isActiveStep = node.id === activeNodeId;
        } else if (activeJukugoWord) {
          isActiveStep = nodeWord === activeJukugoWord;
        }
      } else {
        // NORMAL HIERARCHY VISIBILITY:
        if (isRootNode) {
          isVisible = true;
        } else if (isCategory) {
          isVisible = areCategoriesVisible;
        } else if (areCategoriesVisible) {
          if (parentCatId) {
            isVisible = expandedCategoryIds.has(parentCatId);
          } else {
            isVisible = Array.from(expandedCategoryIds).some((catId) => node.id.includes(catId));
          }
        }

        if (activeNodeId) {
          isActiveStep = node.id === activeNodeId;
        } else if (activeJukugoWord) {
          isActiveStep = nodeWord === activeJukugoWord;
        }
      }

      return {
        id: node.id,
        type: "kanjiNode",
        position: { x: node.x, y: node.y },
        data: { 
          ...node,
          isExpanded: isCategory ? (parentCatId ? expandedCategoryIds.has(parentCatId) : false) : true,
          hasChildren: isCategory,
          isActiveStep,
          isDimmed: false,
          isVisible,
          animDelayMs: selectedEdge ? 0 : node.animDelayMs,
        },
      };
    });
  }, [positionedNodes, areCategoriesVisible, expandedCategoryIds, selectedRelationEdgeId, selectedRelationConnectedIds, activeJukugoWord, activeNodeId, deduplicatedEdges, activeNodeConnectedIds]);

  const edges = useMemo(() => {
    const nodeVisibilityMap = new Map<string, boolean>();
    nodes.forEach((n: any) => {
      nodeVisibilityMap.set(n.id, Boolean(n.data?.isVisible));
    });

    const formattedEdges = deduplicatedEdges.map((edge: any) => {
      const isSelectedRelation = selectedRelationEdgeId === edge.id;
      const strokeColor = isSelectedRelation ? "#f59e0b" : (edge.color || catColorMap.get(edge.source) || catColorMap.get(edge.target) || "#64748b");
      const srcPos = nodePosMap.get(edge.source);
      const tgtPos = nodePosMap.get(edge.target);

      const { sourceHandle, targetHandle } = getOptimalHandles(srcPos, tgtPos, edge.isCrossLink);

      const tgtNodeObj = positionedNodes.find((n: any) => n.id === edge.target);
      let edgeLabel = edge.label;

      if (edgeLabel && tgtNodeObj) {
        const rawLabel = edgeLabel.trim().toLowerCase();
        const nodeKanji = (tgtNodeObj.kanji || tgtNodeObj.character || tgtNodeObj.word || tgtNodeObj.label || "").trim().toLowerCase();
        const nodeMeaning = (tgtNodeObj.meaning || tgtNodeObj.description || "").trim().toLowerCase();
        const nodeReading = (tgtNodeObj.reading || tgtNodeObj.subLabel || "").trim().replace(/[()]/g, "").toLowerCase();

        if (!edge.isCrossLink) {
          if (
            rawLabel === nodeKanji ||
            rawLabel === nodeMeaning ||
            rawLabel === nodeReading ||
            rawLabel === "unsur"
          ) {
            edgeLabel = undefined;
          }
        }
      }

      const isSrcVisible = nodeVisibilityMap.get(edge.source) ?? false;
      const isTgtVisible = nodeVisibilityMap.get(edge.target) ?? false;
      
      // When a relation edge is selected, show selected relation edge AND connected branch edges!
      let isEdgeVisible = false;
      if (selectedRelationEdgeId) {
        const isSrcInPath = selectedRelationConnectedIds.has(edge.source);
        const isTgtInPath = selectedRelationConnectedIds.has(edge.target);
        isEdgeVisible = isSelectedRelation || (isSrcInPath && isTgtInPath);
      } else if (activeJukugoWord || activeNodeId) {
        const isSrcInPath = activeNodeConnectedIds.has(edge.source);
        const isTgtInPath = activeNodeConnectedIds.has(edge.target);
        isEdgeVisible = isSrcInPath && isTgtInPath;
      } else {
        isEdgeVisible = isSrcVisible && isTgtVisible;
      }

      const edgeAnimDelay = selectedRelationEdgeId ? 0 : (tgtNodeObj?.animDelayMs || 300);

      return {
        ...edge,
        type: edge.isCrossLink ? "crossLinkEdge" : "hierarchyEdge",
        sourceHandle: edge.sourceHandle || sourceHandle,
        targetHandle: edge.targetHandle || targetHandle,
        label: edgeLabel,
        data: {
          ...edge.data,
          isSelected: isSelectedRelation,
          onSelectRelation: handleSelectRelation,
        },
        labelBgPadding: edgeLabel ? [8, 4] : undefined,
        labelBgBorderRadius: edgeLabel ? 8 : undefined,
        labelBgStyle: edgeLabel ? { fill: "#ffffff", color: "#1e293b", stroke: strokeColor, strokeWidth: isSelectedRelation ? 2.5 : 1.5, opacity: isEdgeVisible ? 1 : 0 } : undefined,
        labelStyle: edgeLabel ? { fill: "#1e293b", fontWeight: 800, fontSize: 10, opacity: isEdgeVisible ? 1 : 0 } : undefined,
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 14,
          height: 14,
          color: strokeColor,
        },
        style: { 
          stroke: strokeColor, 
          strokeWidth: isSelectedRelation ? 4.5 : (edge.style?.strokeWidth || 2.2),
          strokeDasharray: edge.style?.strokeDasharray || undefined,
          opacity: isEdgeVisible ? 1 : 0,
          pointerEvents: isEdgeVisible ? "all" : "none",
          transition: "opacity 0.5s ease-out, stroke 0.5s ease-out, stroke-width 0.3s ease",
          transitionDelay: isEdgeVisible ? `${edgeAnimDelay}ms` : "0ms",
          ...edge.style,
        },
      };
    });

    return formattedEdges;
  }, [positionedNodes, deduplicatedEdges, nodePosMap, catColorMap, nodes, selectedRelationEdgeId, selectedRelationConnectedIds, activeJukugoWord, activeNodeId, activeNodeConnectedIds]);

  // Click node handler - Progressive Sequenced Hierarchy Reveal, History Redirection & SFX Focus
  const onNodeClick = (_: any, node: any) => {
    // If a relation edge is currently isolated, un-isolate first
    if (selectedRelationEdgeId) {
      setSelectedRelationEdgeId(null);
    }

    const isRootNode = node.data.isRoot || node.data.type === "root";
    const isCategoryNode = node.data.type === "bottom" || node.data.type === "category";
    const word = (node.data.kanji || node.data.character || node.data.word || "").trim();

    // 1. Click ROOT Node: Zoom out camera first, then reveal category nodes with staggered SFX
    if (isRootNode) {
      if (!areCategoriesVisible) {
        // Zoom out camera first towards categories orbit
        const visibleCatNodes = positionedNodes.filter((n: any) => n.id === node.id || n.type === "bottom" || n.type === "category");
        fitView({ nodes: visibleCatNodes, padding: 0.35, duration: 750 });

        // Reveal categories animation after camera starts zooming out & play pop SFX
        setTimeout(() => {
          setAreCategoriesVisible(true);
          const catCount = positionedNodes.filter((n: any) => n.type === "bottom" || n.type === "category").length;
          for (let i = 0; i < catCount; i++) {
            setTimeout(() => {
              playPopSfx(i, "category");
            }, 150 + i * 150);
          }
        }, 250);
      } else {
        // Collapse: Fade out categories first, reset history, then zoom in back to root node
        setAreCategoriesVisible(false);
        setExpandedCategoryIds(new Set());
        setOpenCategoryHistory([]);
        setTimeout(() => {
          setCenter(0, 0, { zoom: 1.1, duration: 700 });
        }, 300);
      }
      return;
    }

    // 2. Click CATEGORY Node: "Kalau pop redirect ke last open category, kalau tak ada baru zoom out"
    if (isCategoryNode) {
      const catId = node.id;
      const isCurrentlyExpanded = expandedCategoryIds.has(catId);

      if (isCurrentlyExpanded) {
        // COLLAPSE (Pop category from open history):
        const nextHistory = openCategoryHistory.filter((id) => id !== catId);
        const nextExpanded = new Set(nextHistory);

        setOpenCategoryHistory(nextHistory);
        setExpandedCategoryIds(nextExpanded);

        // Smart Camera Redirection:
        setTimeout(() => {
          if (nextHistory.length > 0) {
            // Redirect back to the last open category that remains open!
            const lastOpenCatId = nextHistory[nextHistory.length - 1];
            focusOnCategoryCluster(lastOpenCatId, 750);
          } else {
            // No categories are open anymore -> Zoom out to show all categories!
            const visibleCatNodes = nodes.filter((n: any) => {
              if (n.data.isRoot || n.data.type === "root") return true;
              if (n.data.type === "bottom" || n.data.type === "category") return true;
              return false;
            });
            fitView({ nodes: visibleCatNodes, padding: 0.35, duration: 750 });
          }
        }, 300);
      } else {
        // EXPAND (Push category to open history):
        const nextHistory = [...openCategoryHistory.filter((id) => id !== catId), catId];
        setOpenCategoryHistory(nextHistory);

        // 1. FIRST: Camera smoothly zooms in & focuses on target category cluster position!
        focusOnCategoryCluster(catId, 800);

        // 2. AFTER camera zooms in, trigger staggered node wave animations & play SFX!
        setTimeout(() => {
          setExpandedCategoryIds(new Set(nextHistory));

          const mainJks = positionedNodes.filter(
            (n: any) => (n.type === "sub-bottom" || n.type === "sub") && (n.parentPill === catId || n.categoryId === catId)
          );

          mainJks.forEach((_, jkIdx) => {
            setTimeout(() => {
              playPopSfx(jkIdx, "node");
            }, 300 + jkIdx * 200);
          });
        }, 300);
      }
      return;
    }

    // 3. Click JUKUGO / LEAF / SUB-JUKUGO Node: Toggle off if already active, else focus camera, play select SFX & select jukugo
    const isAlreadyActive = node.id === activeNodeId || (Boolean(word) && word === activeJukugoWord);

    if (isAlreadyActive) {
      onSelectJukugoRef.current?.(null, null);
      restoreCameraView();
    } else {
      playPopSfx(0, "node");
      setCenter(node.position.x, node.position.y, { zoom: 1.2, duration: 800 });
      onSelectJukugoRef.current?.(word, node.id);
    }
  };

  return (
    <div className="w-full h-full bg-slate-50 flex flex-col font-sans select-none relative overflow-hidden">
      {/* React Flow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={onNodeClick}
        onEdgeClick={(_e, edge) => {
          if (edge.isCrossLink || edge.predicate || edge.label) {
            handleSelectRelation(edge.id);
          }
        }}
        onPaneClick={() => {
          let needsCameraReset = false;
          if (selectedRelationEdgeId) {
            setSelectedRelationEdgeId(null);
            needsCameraReset = true;
          }
          if (activeNodeId || activeJukugoWord) {
            onSelectJukugoRef.current?.(null, null);
            needsCameraReset = true;
          }
          if (needsCameraReset) {
            restoreCameraView();
          }
        }}
        fitView
        fitViewOptions={{ padding: 0.35 }}
        minZoom={0.12}
        maxZoom={1.5}
        nodesConnectable={false}
        nodesDraggable={true}
      >
        <Background color="#cbd5e1" gap={20} size={1} />
        {/* Integrated React Flow Controls at bottom-left position */}
        <Controls position="bottom-left" className="bg-white/95 backdrop-blur-sm border-2 border-slate-200 rounded-xl sm:rounded-2xl shadow-lg text-slate-700 overflow-hidden" />
      </ReactFlow>
    </div>
  );
}

export default function KanjiAtlasFlow(props: any) {
  return (
    <ReactFlowProvider>
      <KanjiAtlasFlowInner {...props} />
    </ReactFlowProvider>
  );
}
