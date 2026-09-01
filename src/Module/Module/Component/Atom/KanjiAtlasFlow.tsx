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
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import KanjiNode from "./KanjiNode";
import { api } from "../../../Common/Utility/api";
import tts from "../../../Common/Utility/tts";
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Gamepad2,
  Compass,
  X,
  Play,
  Check,
} from "lucide-react";

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

// Helper function to pick optimal handles on all 4 sides
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

export interface QuestStepItem {
  id: string;
  nodeId: string;
  type: "root" | "category" | "jukugo" | "leaf" | "relation";
  word: string;
  reading: string;
  meaning: string;
  categoryName?: string;
  categoryColor?: string;
  constituents?: Array<{ word: string; reading?: string; meaning?: string }>;
  sourceWord?: string;
  sourceReading?: string;
  targetWord?: string;
  targetReading?: string;
  predicate?: string;
  sourceNodeId?: string;
  targetNodeId?: string;
  x: number;
  y: number;
  bounds?: { x: number; y: number; width: number; height: number };
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
  const edgeTypes = useMemo(() => ({ crossLinkEdge: CustomCrossLinkEdge }), []);
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [kanjis, setKanjis] = useState<any[]>([]);
  const [jukugos, setJukugos] = useState<any[]>([]);

  // Guided Quest Step & Minimized states
  const [questMode, setQuestMode] = useState(true);
  const [isQuestMinimized, setIsQuestMinimized] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [questSteps, setQuestSteps] = useState<QuestStepItem[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

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

      const col1X = catX + dir * 420;
      const col2X = catX + dir * 840;
      const col3X = catX + dir * 1240;

      const subCompoundRequests: Map<string, { subWord: string; meaning: string; parentJkIds: string[]; preferredY: number }> = new Map();
      const leafKanjiRequests: Map<string, { char: string; parentIds: string[]; preferredY: number }> = new Map();

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
          const chars: string[] = Array.from(new Set(Array.from(word as string))).filter((c: string) => c !== rootChar);
          chars.forEach((char: string) => {
            const req = leafKanjiRequests.get(char) || { char, parentIds: [], preferredY: jkY };
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

        const pChars: string[] = Array.from(req.subWord as string).filter((c: string) => c !== rootChar);
        pChars.forEach((char: string) => {
          const lReq = leafKanjiRequests.get(char) || { char, parentIds: [], preferredY: subY };
          if (!lReq.parentIds.includes(subNodeId)) lReq.parentIds.push(subNodeId);
          leafKanjiRequests.set(char, lReq);
        });
      });

      // Render Leaf Kanjis in Column 3
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

      const srcNodes = positionedNodes.filter((n: any) => (n.kanji || n.character || n.word || n.label || "").trim() === srcWord);
      const tgtNodes = positionedNodes.filter((n: any) => (n.kanji || n.character || n.word || n.label || "").trim() === tgtWord);

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
      const pairKey = `${edge.source}->${edge.target}`;
      if (!uniqueEdgesMap.has(pairKey)) {
        uniqueEdgesMap.set(pairKey, edge);
      } else {
        const existing = uniqueEdgesMap.get(pairKey);
        if (!existing.label && edge.label) {
          uniqueEdgesMap.set(pairKey, edge);
        }
      }
    });

    const deduplicatedEdges = Array.from(uniqueEdgesMap.values());

    // 4. Build Guided Quest Steps dynamically
    const stepsList: QuestStepItem[] = [];

    // Phase 1: Individual Main Jukugo Vocabulary Steps (Excluding constituent sub-Jukugos and single leaf Kanjis)
    categoryNodes.forEach((cat) => {
      const catWord = (cat.kanji || cat.name || cat.label || "").trim();
      const catColor = catColorMap.get(cat.id) || "#f97316";

      const rawCatJkIds = new Set(
        initialRawNodes
          .filter(
            (n: any) =>
              (n.type === "sub-bottom" || n.type === "sub") &&
              (n.parentPill === cat.id || n.categoryId === cat.id),
          )
          .map((n: any) => n.id),
      );

      const childJukugos = positionedNodes.filter((n: any) =>
        rawCatJkIds.has(n.id),
      );

      childJukugos.forEach((jk) => {
        const jkWord = (jk.kanji || jk.character || jk.word || jk.label || "").trim();
        if (!jkWord) return;

        const dbJ = jukugoMap.get(jkWord);
        const rText = dbJ?.reading || jk.reading || "";
        const mText = dbJ?.meaning || jk.meaning || jk.description || "";

        const constituents: Array<{ word: string; reading?: string; meaning?: string }> = [];
        Array.from(new Set(Array.from(jkWord as string))).forEach((char: string) => {
          const kInf = kanjiMap.get(char);
          const cReading = kInf?.romaji || kInf?.onyomi || kInf?.kunyomi || "";
          const cMeaning = kInf?.meaning || "";
          constituents.push({ word: char, reading: cReading, meaning: cMeaning });
        });

        stepsList.push({
          id: `step-jk-${jk.id}`,
          nodeId: jk.id,
          type: "jukugo",
          word: jkWord,
          reading: rText,
          meaning: mText,
          categoryName: catWord,
          categoryColor: catColor,
          constituents,
          x: nodePosMap.get(jk.id)?.x || 0,
          y: nodePosMap.get(jk.id)?.y || 0,
        });
      });
    });

    // Phase 2: Cross-Link Semantic Relation Steps (EXCLUSIVELY for relations between 2 real main Jukugo words)
    const addedRelationPairs = new Set<string>();

    deduplicatedEdges.forEach((edge: any) => {
      const predRaw = (edge.label || edge.predicate || "").trim();
      if (!predRaw || predRaw === "kategori" || predRaw === "mencakup" || predRaw === "penyusun") return;

      // Match ONLY non-root, non-category, non-constituent main Jukugo nodes!
      const sNode = positionedNodes.find((n: any) => {
        if (
          n.type === "root" ||
          n.isRoot ||
          n.type === "category" ||
          n.meaning === "Kategori" ||
          (typeof n.id === "string" && (n.id.startsWith("sub-jokugo-") || n.id.startsWith("leaf-")))
        )
          return false;
        const w = (n.kanji || n.character || n.word || n.label || "").trim();
        return n.id === edge.source || w === edge.source;
      });

      const tNode = positionedNodes.find((n: any) => {
        if (
          n.type === "root" ||
          n.isRoot ||
          n.type === "category" ||
          n.meaning === "Kategori" ||
          (typeof n.id === "string" && (n.id.startsWith("sub-jokugo-") || n.id.startsWith("leaf-")))
        )
          return false;
        const w = (n.kanji || n.character || n.word || n.label || "").trim();
        return n.id === edge.target || w === edge.target;
      });

      if (!sNode || !tNode) return;

      const sWord = (sNode.kanji || sNode.character || sNode.word || sNode.label || "").trim();
      const tWord = (tNode.kanji || tNode.character || tNode.word || tNode.label || "").trim();

      if (!sWord || !tWord || sWord === tWord) return;

      const pairKey = [sWord, tWord].sort().join("<->");
      if (addedRelationPairs.has(pairKey)) return;
      addedRelationPairs.add(pairKey);

      const formattedPred = predRaw.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());

      // Exact coordinates of source & target Jukugo nodes
      const sX = sNode.x;
      const sY = sNode.y;
      const tX = tNode.x;
      const tY = tNode.y;

      const minX = Math.min(sX, tX) - 180;
      const maxX = Math.max(sX, tX) + 180;
      const minY = Math.min(sY, tY) - 140;
      const maxY = Math.max(sY, tY) + 140;

      const width = Math.max(maxX - minX, 450);
      const height = Math.max(maxY - minY, 320);

      const midX = (sX + tX) / 2;
      const midY = (sY + tY) / 2;

      const sDb = jukugoMap.get(sWord) || kanjiMap.get(sWord);
      const tDb = jukugoMap.get(tWord) || kanjiMap.get(tWord);
      const sMeaning = sNode.meaning || sDb?.meaning || "";
      const tMeaning = tNode.meaning || tDb?.meaning || "";

      stepsList.push({
        id: `step-rel-${sNode.id}-${tNode.id}`,
        nodeId: sNode.id,
        type: "relation",
        word: `${sWord} ↔ ${tWord}`,
        reading: `Relasi Semantik`,
        meaning: `Hubungan ${formattedPred}: Menghubungkan makna kata "${sWord}" (${sMeaning}) dengan "${tWord}" (${tMeaning}).`,
        sourceWord: sWord,
        sourceReading: sNode.reading || sDb?.reading || sDb?.romaji || "",
        targetWord: tWord,
        targetReading: tNode.reading || tDb?.reading || tDb?.romaji || "",
        predicate: formattedPred,
        sourceNodeId: sNode.id,
        targetNodeId: tNode.id,
        categoryName: `Relasi: ${formattedPred}`,
        categoryColor: "#a855f7",
        x: midX,
        y: midY,
        bounds: { x: minX, y: minY, width, height },
      });
    });

    setQuestSteps(stepsList);

    // 5. Format nodes for ReactFlow
    const isStepActiveAndShowing = questMode && !isQuestMinimized && stepsList.length > 0;
    const currentStep = isStepActiveAndShowing ? stepsList[currentStepIndex] : null;
    const isRelationStep = currentStep?.type === "relation";

    const formattedNodes = positionedNodes.map((node: any) => {
      const isExpanded = expandedNodes.has(node.id);
      const hasChildren = (node.type === "bottom" || node.type === "category") && initialRawNodes.some(
        (n: any) => (n.type === "sub-bottom" || n.type === "sub") && (n.parentPill === node.id || n.categoryId === node.id)
      );

      const nodeWord = (node.kanji || node.character || node.word || node.label || "").trim();

      let isActiveStep = false;
      if (isStepActiveAndShowing && currentStep) {
        if (isRelationStep) {
          // Highlight ONLY the 2 Jukugo nodes participating in relation (strictly exclude root & categories)
          const isRootOrCat = node.type === "root" || node.isRoot || node.type === "category" || node.meaning === "Kategori";
          if (!isRootOrCat) {
            isActiveStep = node.id === currentStep.sourceNodeId ||
                           node.id === currentStep.targetNodeId ||
                           nodeWord === currentStep.sourceWord ||
                           nodeWord === currentStep.targetWord;
          }
        } else if (currentStep.nodeId) {
          isActiveStep = node.id === currentStep.nodeId || nodeWord === currentStep.word;
        }
      } else if (activeNodeId) {
        isActiveStep = node.id === activeNodeId;
      } else if (activeJukugoWord) {
        isActiveStep = nodeWord === activeJukugoWord;
      }

      const isDimmed = isStepActiveAndShowing && !isActiveStep;

      return {
        id: node.id,
        type: "kanjiNode",
        position: { x: node.x, y: node.y },
        data: { 
          ...node,
          isExpanded,
          hasChildren,
          isActiveStep,
          isDimmed,
        },
      };
    });

    const rootNodeObj = initialRawNodes.find((n: any) => n.type === "root" || n.isRoot);
    const rootExpanded = rootNodeObj ? expandedNodes.has(rootNodeObj.id) : true;

    let baseVisibleNodes = formattedNodes.filter((node: any) => {
      if (node.data.isRoot || node.data.type === "root") return true;
      if (node.data.type === "bottom" || node.data.type === "category") return rootExpanded;
      if (node.data.type === "sub-bottom" || node.data.type === "sub") {
        const parentId = node.data.parentPill || node.data.categoryId;
        return rootExpanded && (parentId ? expandedNodes.has(parentId) : true);
      }
      if (node.data.type === "leafKanji") return rootExpanded;
      return true;
    });

    // 6. Format Edges for ReactFlow
    const formattedEdges = deduplicatedEdges.map((edge: any) => {
      const strokeColor = edge.color || catColorMap.get(edge.source) || catColorMap.get(edge.target) || "#64748b";
      const srcPos = nodePosMap.get(edge.source);
      const tgtPos = nodePosMap.get(edge.target);

      const { sourceHandle, targetHandle } = getOptimalHandles(srcPos, tgtPos);

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

      let isEdgeConnectedToActive = false;
      if (isStepActiveAndShowing && currentStep) {
        if (isRelationStep) {
          isEdgeConnectedToActive = (edge.source === currentStep.sourceNodeId && edge.target === currentStep.targetNodeId) ||
                                    (edge.source === currentStep.targetNodeId && edge.target === currentStep.sourceNodeId);
        } else if (currentStep.nodeId) {
          isEdgeConnectedToActive = edge.source === currentStep.nodeId || edge.target === currentStep.nodeId;
        }
      }

      return {
        ...edge,
        type: "bezier",
        sourceHandle: edge.sourceHandle || sourceHandle,
        targetHandle: edge.targetHandle || targetHandle,
        label: edgeLabel,
        labelBgPadding: edgeLabel ? [8, 4] : undefined,
        labelBgBorderRadius: edgeLabel ? 8 : undefined,
        labelBgStyle: edgeLabel ? { fill: "#ffffff", color: "#1e293b", stroke: isEdgeConnectedToActive ? "#f59e0b" : strokeColor, strokeWidth: 1.5 } : undefined,
        labelStyle: edgeLabel ? { fill: "#1e293b", fontWeight: 800, fontSize: 10 } : undefined,
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 14,
          height: 14,
          color: isEdgeConnectedToActive ? "#f59e0b" : strokeColor,
        },
        style: { 
          stroke: isEdgeConnectedToActive ? "#f59e0b" : strokeColor, 
          strokeWidth: isEdgeConnectedToActive ? 4.5 : (edge.style?.strokeWidth || 2.2),
          strokeDasharray: edge.style?.strokeDasharray || undefined,
          opacity: isStepActiveAndShowing ? (isEdgeConnectedToActive ? 1 : 0.4) : 0.95,
          ...edge.style,
        },
      };
    });

    const visibleEdgeSet = new Set(baseVisibleNodes.map((n: any) => n.id));
    const visibleEdges = formattedEdges.filter(
      (e: any) => visibleEdgeSet.has(e.source) && visibleEdgeSet.has(e.target)
    );

    setNodes(baseVisibleNodes);
    setEdges(visibleEdges);
  }, [initialRawNodes, initialRawEdges, expandedNodes, kanjiMap, activeJukugoWord, activeNodeId, questMode, isQuestMinimized, currentStepIndex]);

  // Synchronize Quest Step Index when activeJukugoWord or activeNodeId is set externally
  useEffect(() => {
    if (activeJukugoWord && questSteps.length > 0) {
      const currentStep = questSteps[currentStepIndex];
      if (currentStep?.type === "relation") return;

      const matchingIdx = questSteps.findIndex(
        (s) => s.type !== "relation" && (s.word === activeJukugoWord || s.nodeId === activeNodeId)
      );
      if (matchingIdx !== -1 && matchingIdx !== currentStepIndex) {
        setCurrentStepIndex(matchingIdx);
      }
    }
  }, [activeJukugoWord, activeNodeId, questSteps, currentStepIndex]);

  // Clean camera framing centered on active node(s) with 0% screen obstruction!
  useEffect(() => {
    if (questMode && !isQuestMinimized && questSteps.length > 0 && questSteps[currentStepIndex]) {
      const activeStep = questSteps[currentStepIndex];
      if (activeStep.type === "relation") {
        if (activeStep.bounds) {
          fitBounds(activeStep.bounds, { padding: 0.35, duration: 800 });
        }
        if (activeJukugoWord !== null) {
          onSelectJukugoRef.current?.(null, null);
        }
      } else {
        setCenter(activeStep.x, activeStep.y, { zoom: 1.2, duration: 800 });
        if (activeStep.word && !activeStep.word.includes("↔") && activeJukugoWord !== activeStep.word) {
          onSelectJukugoRef.current?.(activeStep.word, activeStep.nodeId);
        }
      }
    }
  }, [currentStepIndex, questMode, isQuestMinimized, questSteps, setCenter, fitBounds, activeJukugoWord]);

  // Keyboard Step Controls (Left / Right / Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!questMode || isQuestMinimized || questSteps.length === 0) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentStepIndex((prev) => Math.min(prev + 1, questSteps.length - 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === " " && questSteps[currentStepIndex]) {
        e.preventDefault();
        const activeStep = questSteps[currentStepIndex];
        if (activeStep.type === "relation" && activeStep.sourceWord && activeStep.targetWord) {
          setIsPlayingAudio(true);
          tts.speak(`${activeStep.sourceWord}。 ${activeStep.targetWord}`, () => setIsPlayingAudio(false));
        } else if (activeStep.word) {
          setIsPlayingAudio(true);
          tts.speak(activeStep.word, () => setIsPlayingAudio(false));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [questMode, isQuestMinimized, currentStepIndex, questSteps]);

  // Close Quest HUD, reset step counter to 0 (Start 1), and return entire graph to normal view
  const handleCloseQuestHUD = () => {
    setIsQuestMinimized(true);
    setCurrentStepIndex(0); // Reset step back to Start 1!
    fitView({ padding: 0.35, duration: 700 });
  };

  // Re-open Quest HUD from FAB Play Button or Root Kanji node click
  const handleStartQuest = (stepIdx: number = 0) => {
    setQuestMode(true);
    setIsQuestMinimized(false);
    if (questSteps.length > 0) {
      const validIdx = Math.max(0, Math.min(stepIdx, questSteps.length - 1));
      setCurrentStepIndex(validIdx);
      const targetStep = questSteps[validIdx];
      if (targetStep) {
        if (targetStep.type === "relation" && targetStep.bounds) {
          fitBounds(targetStep.bounds, { padding: 0.35, duration: 800 });
        } else {
          setCenter(targetStep.x, targetStep.y, { zoom: 1.2, duration: 800 });
        }
        if (targetStep.word && !targetStep.word.includes("↔")) {
          onSelectJukugo?.(targetStep.word, targetStep.nodeId);
        }
      }
    }
  };

  // Click node handler
  const onNodeClick = (_: any, node: any) => {
    const isRootNode = node.data.isRoot || node.data.type === "root";
    const word = (node.data.kanji || node.data.character || node.data.word || "").trim();
    onSelectJukugo?.(word, node.id);

    // Root Kanji acts as Trigger Start Belajar
    if (isRootNode) {
      handleStartQuest(0);
      return;
    }

    // If node is a vocabulary word or relation node, open HUD at matching step
    const matchingStepIdx = questSteps.findIndex(
      (s) => s.nodeId === node.id || s.word === word || s.sourceNodeId === node.id || s.targetNodeId === node.id
    );
    if (matchingStepIdx !== -1) {
      handleStartQuest(matchingStepIdx);
    }
  };

  const activeStep = questSteps[currentStepIndex];

  const handlePlayAudio = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeStep) {
      if (activeStep.type === "relation" && activeStep.sourceWord && activeStep.targetWord) {
        setIsPlayingAudio(true);
        tts.speak(`${activeStep.sourceWord}。 ${activeStep.targetWord}`, () => setIsPlayingAudio(false));
      } else if (activeStep.word) {
        setIsPlayingAudio(true);
        tts.speak(activeStep.word, () => setIsPlayingAudio(false));
      }
    }
  };

  return (
    <div className="w-full h-full bg-slate-50 flex flex-col font-sans select-none relative overflow-hidden">
      {/* Top Floating Mode Switch Toolbar - Clean Solid Color Theme (No Gradients) */}
      <div className="absolute top-4 left-4 z-40 flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (questMode && !isQuestMinimized) {
              handleCloseQuestHUD();
            } else {
              handleStartQuest(currentStepIndex);
            }
          }}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl font-black text-[11px] sm:text-xs shadow-lg border-2 transition-all duration-300 backdrop-blur-md cursor-pointer ${
            questMode && !isQuestMinimized
              ? "bg-rose-600 text-white border-rose-400 shadow-rose-500/20 hover:bg-rose-700 hover:scale-105"
              : "bg-white/95 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-white"
          }`}
        >
          {questMode && !isQuestMinimized ? (
            <>
              <Gamepad2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200 animate-pulse" />
              <span>Mode Belajar</span>
            </>
          ) : (
            <>
              <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500" />
              <span>Mode Normal</span>
            </>
          )}
        </button>
      </div>

      {/* Gambar 2 + Gambar 3: Integrated Mobile-Responsive Quest Control Card attached above React Flow Controls */}
      {questMode && !isQuestMinimized && activeStep && (
        <div className="absolute bottom-16 sm:bottom-20 left-2 sm:left-4 z-40 flex flex-col items-center gap-1.5 sm:gap-2.5 bg-slate-900/95 text-white p-2 sm:p-3.5 rounded-2xl sm:rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] border-2 border-white/20 backdrop-blur-xl transition-all duration-300 w-40 sm:w-48 md:w-52">
          {/* Header Step Counter Badge - Solid Color Theme (No Gradients) */}
          <div className="w-full flex flex-col items-center text-center">
            <span className="bg-rose-600 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 sm:px-3 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-rose-400">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-300 text-amber-300" />
              LANGKAH {currentStepIndex + 1} / {questSteps.length}
            </span>

            {/* Custom Label: "jokugo" when highlighting a Jukugo vs "relasi hubungan kanji" when highlighting a Relation */}
            <span className="text-[10px] sm:text-[11px] font-extrabold text-amber-300 mt-1 truncate max-w-[130px] sm:max-w-[170px] uppercase tracking-wider">
              {activeStep.type === "relation" ? "relasi hubungan kanji" : "jokugo"}
            </span>
          </div>

          <div className="w-full h-px bg-white/10 my-0.5" />

          {/* Step Navigation Controls: Prev & Next/Done - Solid Color Theme (No Gradients) */}
          <div className="flex items-center gap-1.5 sm:gap-2 w-full justify-between">
            <button
              type="button"
              disabled={currentStepIndex === 0}
              onClick={() => setCurrentStepIndex((prev) => Math.max(prev - 1, 0))}
              className="flex-1 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-bold flex items-center justify-center border border-white/15 transition-all cursor-pointer"
              title="Langkah Sebelumnya (Kembali)"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (currentStepIndex === questSteps.length - 1) {
                  handleCloseQuestHUD();
                } else {
                  setCurrentStepIndex((prev) => Math.min(prev + 1, questSteps.length - 1));
                }
              }}
              className={`flex-1 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-white text-xs font-black flex items-center justify-center border border-white/30 shadow-md transition-all cursor-pointer ${
                currentStepIndex === questSteps.length - 1
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-rose-600 hover:bg-rose-700 active:scale-95 border-rose-500"
              }`}
              title={currentStepIndex === questSteps.length - 1 ? "Selesai Quest & Reset ke Langkah 1" : "Langkah Selanjutnya"}
            >
              {currentStepIndex === questSteps.length - 1 ? (
                <Check className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>

          {/* Utility Row: TTS Audio Suara & Close X */}
          <div className="flex items-center gap-1.5 sm:gap-2 w-full pt-1 border-t border-white/10">
            <button
              type="button"
              onClick={handlePlayAudio}
              className={`flex-1 py-1.5 rounded-lg sm:rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                isPlayingAudio
                  ? "bg-amber-400 text-slate-950 border-amber-300 animate-pulse"
                  : "bg-white/10 hover:bg-white/20 text-white border-white/20"
              }`}
              title="Dengarkan Suara Audio (Spasi)"
            >
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <button
              type="button"
              onClick={handleCloseQuestHUD}
              className="p-1.5 rounded-lg sm:rounded-xl bg-white/10 hover:bg-rose-600 text-white/80 hover:text-white border border-white/20 transition-all cursor-pointer"
              title="Tutup Mode Langkah (Reset ke Langkah 1)"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Gambar 2: Integrated Keyboard Shortcut Helper Badge - ONLY VISIBLE ON DESKTOP (md:block) */}
          <div className="w-full pt-1.5 border-t border-white/10 hidden md:block">
            <div className="bg-white/10 text-slate-200 text-[9px] font-bold px-2 py-1 rounded-lg border border-white/15 flex items-center justify-center gap-1">
              <span className="bg-white/20 text-white px-1 rounded text-[8px]">Panah ⬅➡</span>
              <span>Navigasi</span>
              <span className="text-white/40">•</span>
              <span className="bg-white/20 text-white px-1 rounded text-[8px]">Spasi</span>
              <span>Suara</span>
            </div>
          </div>
        </div>
      )}

      {/* React Flow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
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

      {/* Floating Action Button (FAB Play) when Minimized - Solid Color Theme (No Gradients) */}
      {isQuestMinimized && questSteps.length > 0 && (
        <button
          type="button"
          onClick={() => handleStartQuest(currentStepIndex)}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black px-6 py-3.5 rounded-full shadow-[0_12px_35px_rgba(225,29,72,0.5)] border-2 border-white flex items-center gap-2.5 animate-bounce hover:scale-105 transition-all cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Mulai Belajar</span>
        </button>
      )}
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
