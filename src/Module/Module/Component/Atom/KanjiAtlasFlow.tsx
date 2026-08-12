import { useMemo, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  getBezierPath,
  type EdgeProps,
  EdgeLabelRenderer,
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

  // const strokeColor = (style as any).stroke || "#3b82f6";
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
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            className="nodrag nopan"
          >
            <div className="bg-white border-2 border-slate-700 text-slate-900 px-3 py-1 rounded-full text-[11px] font-extrabold shadow-md whitespace-nowrap">
              {labelText}
            </div>
          </div>
        </EdgeLabelRenderer>
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
  const [jukugos, setJukugos] = useState<any[]>([]);

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

    // 2. Clean Hierarchical Tree Layout matching reference diagrams
    // 2. Spacious 2D Quadrant / Radial Cluster Layout (Matching Gambar 2)
    const rootChar = (rootNode?.kanji || rootNode?.character || rootNode?.word || rootNode?.label || "").trim();

    // 4 Quadrants + Center-bottom layout positions for Category clusters with wide 2D spacing
    const categoryPositions = [
      { x: -1400, y: -400, dir: -1 }, // Top-Left Quadrant (Category 1)
      { x: 1400, y: -400, dir: 1 },   // Top-Right Quadrant (Category 2)
      { x: -1400, y: 900, dir: -1 },  // Bottom-Left Quadrant (Category 3)
      { x: 1400, y: 900, dir: 1 },    // Bottom-Right Quadrant (Category 4)
      { x: 0, y: 1600, dir: 1 },      // Bottom-Center (Category 5+)
    ];

    categoryNodes.forEach((cat, catIdx) => {
      const catColor = getCategoryColor(catIdx, cat.kanji || cat.name || cat.id);
      catColorMap.set(cat.id, catColor);

      const catPos = categoryPositions[catIdx % categoryPositions.length];
      const catX = catPos.x;
      const catY = catPos.y;
      const dir = catPos.dir; // -1 for left-branching, +1 for right-branching

      positionedNodes.push({
        ...cat,
        categoryColor: catColor,
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

      // Column Spacing inside each quadrant cluster
      const col1X = catX + dir * 420;
      const col2X = catX + dir * 840;
      const col3X = catX + dir * 1240;

      const subCompoundRequests: Map<string, { subWord: string; meaning: string; parentJkIds: string[]; preferredY: number }> = new Map();
      const leafKanjiRequests: Map<string, { char: string; parentIds: string[]; preferredY: number }> = new Map();

      // 1. Position Main Jukugos in Column 1 (spaced vertically)
      const jukugoSpacingY = 200;
      const numJk = mainJukugos.length;
      const startJukugoY = catY - ((numJk - 1) * jukugoSpacingY) / 2;

      mainJukugos.forEach((jk, jkIdx) => {
        const jkX = col1X;
        const jkY = startJukugoY + jkIdx * jukugoSpacingY;

        positionedNodes.push({
          ...jk,
          categoryColor: catColor,
          x: jkX,
          y: jkY,
        });
        nodePosMap.set(jk.id, { x: jkX, y: jkY });

        // Edge: Category -> Jukugo
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

        // Extract semantic parts
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
              parentJkIds: [],
              preferredY: jkY,
            };
            if (!req.parentJkIds.includes(jk.id)) req.parentJkIds.push(jk.id);
            if (p.meaning && (!req.meaning || req.meaning === "Sub-Jukugo")) {
              req.meaning = p.meaning;
            }
            subCompoundRequests.set(p.word, req);
          });
        } else {
          // 2-kanji word constituents
          const chars: string[] = Array.from(new Set(Array.from(word as string))).filter((c: string) => c !== rootChar);
          chars.forEach((char: string) => {
            const req = leafKanjiRequests.get(char) || { char, parentIds: [], preferredY: jkY };
            if (!req.parentIds.includes(jk.id)) req.parentIds.push(jk.id);
            leafKanjiRequests.set(char, req);
          });
        }
      });

      // 2. Render Deduplicated Sub-Jukugo Cards in Column 2
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
            x: subX,
            y: subY,
          });
          nodePosMap.set(subNodeId, { x: subX, y: subY });
        }

        // Edge: Main Jukugo -> Sub-Jukugo
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
              style: { stroke: catColor, strokeWidth: 2, strokeDasharray: "4 3" },
              animated: true,
            });
          }
        });

        // Request Leaf Kanjis for this Sub-Jukugo
        const pChars: string[] = Array.from(req.subWord as string).filter((c: string) => c !== rootChar);
        pChars.forEach((char: string) => {
          const lReq = leafKanjiRequests.get(char) || { char, parentIds: [], preferredY: subY };
          if (!lReq.parentIds.includes(subNodeId)) lReq.parentIds.push(subNodeId);
          leafKanjiRequests.set(char, lReq);
        });
      });

      // 3. Render Deduplicated Leaf Kanjis in Column 3
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
            x: leafX,
            y: leafY,
          });
          nodePosMap.set(leafNodeId, { x: leafX, y: leafY });
        }

        // Edge: Parent -> Leaf Kanji
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
        return rootExpanded;
      }
      return true;
    });

    // 4. Format Edges with Organic Bezier Curves & Smooth Animations (Rope-style lines)
    const baseEdges = [...generatedEdges];

    (initialRawEdges || []).forEach((rawEdge: any) => {
      const pred = (rawEdge.predicate || rawEdge.label || "").trim();
      if (!pred || pred === "kategori" || pred === "mencakup" || pred === "penyusun") return;

      const srcWord = (rawEdge.source || "").trim();
      const tgtWord = (rawEdge.target || "").trim();

      if (!srcWord || !tgtWord || srcWord === tgtWord) return;

      const srcNodes = positionedNodes.filter((n: any) => {
        const word = (n.kanji || n.character || n.word || n.label || "").trim();
        return word === srcWord;
      });

      const tgtNodes = positionedNodes.filter((n: any) => {
        const word = (n.kanji || n.character || n.word || n.label || "").trim();
        return word === tgtWord;
      });

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

    const formattedEdges = baseEdges.map((edge: any) => {
      const strokeColor = edge.color || catColorMap.get(edge.source) || catColorMap.get(edge.target) || "#64748b";
      const srcPos = nodePosMap.get(edge.source);
      const tgtPos = nodePosMap.get(edge.target);

      const { sourceHandle, targetHandle } = getOptimalHandles(srcPos, tgtPos);

      // Check target node text to eliminate duplicate/redundant edge label badges
      const tgtNodeObj = positionedNodes.find((n: any) => n.id === edge.target);
      let edgeLabel = edge.label;

      if (edgeLabel && tgtNodeObj) {
        const rawLabel = edgeLabel.trim().toLowerCase();
        const nodeKanji = (tgtNodeObj.kanji || tgtNodeObj.character || tgtNodeObj.word || tgtNodeObj.label || "").trim().toLowerCase();
        const nodeMeaning = (tgtNodeObj.meaning || tgtNodeObj.description || "").trim().toLowerCase();
        const nodeReading = (tgtNodeObj.reading || tgtNodeObj.subLabel || "").trim().replace(/[()]/g, "").toLowerCase();

        // Preserve cross-link edge labels (e.g. "metode", "referensi", "lokasi") so they are always displayed
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

      return {
        ...edge,
        type: "bezier", // Organic rope-style curved lines!
        sourceHandle: edge.sourceHandle || sourceHandle,
        targetHandle: edge.targetHandle || targetHandle,
        label: edgeLabel,
        labelBgPadding: edgeLabel ? [8, 4] : undefined,
        labelBgBorderRadius: edgeLabel ? 8 : undefined,
        labelBgStyle: edgeLabel ? { fill: "#ffffff", color: "#1e293b", stroke: strokeColor, strokeWidth: 1.5 } : undefined,
        labelStyle: edgeLabel ? { fill: "#1e293b", fontWeight: 800, fontSize: 10 } : undefined,
        animated: true, // Smooth animated flow on all edges!
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 12,
          height: 12,
          color: strokeColor,
        },
        style: { 
          stroke: strokeColor, 
          strokeWidth: edge.style?.strokeWidth || 2.2,
          strokeDasharray: edge.style?.strokeDasharray || undefined,
          opacity: 0.95,
          ...edge.style,
        },
      };
    });

    // 5. Active Node Isolation / Focus Mode (Scoped to relevant local connections only)
    if (activeNodeId || activeJukugoWord) {
      let targetNode: any = null;

      if (activeNodeId) {
        targetNode = baseVisibleNodes.find((n: any) => n.id === activeNodeId);
      }
      if (!targetNode && activeJukugoWord) {
        const activeWordTrim = activeJukugoWord.trim();
        targetNode = baseVisibleNodes.find(
          (n: any) => (n.data.kanji || n.data.character || n.data.word || "").trim() === activeWordTrim
        );
      }

      if (targetNode) {
        const targetId = targetNode.id;
        const targetCatId = targetNode.data.parentPill || targetNode.data.categoryId;

        // Traverse only locally from targetId (do NOT cross through root into other categories)
        const relevantNodeIds = new Set<string>([targetId]);

        // 1. Direct children / parents / cross-linked neighbors of target
        formattedEdges.forEach((e: any) => {
          if (e.source === rootNodeObj?.id || e.target === rootNodeObj?.id) return;

          if (e.source === targetId) relevantNodeIds.add(e.target);
          if (e.target === targetId) relevantNodeIds.add(e.source);
        });

        // 2. Expand 1 more hop for constituent leaves or sub-nodes (strictly within same category)
        const hop1Ids = Array.from(relevantNodeIds);
        hop1Ids.forEach((hId) => {
          formattedEdges.forEach((e: any) => {
            if (e.source === rootNodeObj?.id || e.target === rootNodeObj?.id) return;

            if (e.source === hId && !relevantNodeIds.has(e.target)) {
              const nodeObj = baseVisibleNodes.find((n: any) => n.id === e.target);
              const nodeCat = nodeObj?.data.parentPill || nodeObj?.data.categoryId;
              if (nodeCat === targetCatId) relevantNodeIds.add(e.target);
            }
            if (e.target === hId && !relevantNodeIds.has(e.source)) {
              const nodeObj = baseVisibleNodes.find((n: any) => n.id === e.source);
              const nodeCat = nodeObj?.data.parentPill || nodeObj?.data.categoryId;
              if (nodeCat === targetCatId) relevantNodeIds.add(e.source);
            }
          });
        });

        // 3. Add Category Node and Root Node for context
        if (targetCatId) relevantNodeIds.add(targetCatId);
        if (rootNodeObj) relevantNodeIds.add(rootNodeObj.id);

        // Filter visible nodes to only relevant isolated subgraph
        baseVisibleNodes = baseVisibleNodes.filter((n: any) => relevantNodeIds.has(n.id));
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
    if (node.data.type === "sub-bottom" || node.data.type === "sub" || node.data.type === "leafKanji") {
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
