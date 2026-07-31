import React, { useState, useEffect, useCallback, useMemo } from "react";
import Layout from "../../Common/Component/Organism/Layout";
import Icon from "../../Common/Component/Icon";
import { api } from "../../Common/Utility/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  useNodesState,
  useEdgesState,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import SemanticJukugoNode from "../Component/Organism/SemanticJukugoNode";
import SemanticLeafNode from "../Component/Organism/SemanticLeafNode";
import SemanticCustomEdge from "../Component/Organism/SemanticCustomEdge";
import { CancelButton } from "../../Common/Component/Atoms/CancelButton";

interface KanjiItem {
  id: number;
  character: string;
  romaji: string | null;
  meaning: string | null;
}

interface JukugoItem {
  id: number;
  word: string;
  reading: string;
  meaning: string;
  kanjiId: number;
}

interface GraphEdgeItem {
  id: string;
  kanjiId: number;
  source: string;
  target: string;
  predicate: string | null;
}

const nodeTypes = {
  jukugoNode: SemanticJukugoNode,
  leafNode: SemanticLeafNode,
};

const edgeTypes = {
  semanticEdge: SemanticCustomEdge,
};

export const SemanticControlPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const kanjiIdQuery = searchParams.get("kanjiId");

  const [kanjis, setKanjis] = useState<KanjiItem[]>([]);
  const [selectedKanjiId, setSelectedKanjiId] = useState<number | null>(
    kanjiIdQuery ? Number(kanjiIdQuery) : null
  );

  const [, setJukugos] = useState<JukugoItem[]>([]);
  const [, setGraphEdges] = useState<GraphEdgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Connection Interaction state
  const [sourceNodeWord, setSourceNodeWord] = useState<string | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [formSourceWord, setFormSourceWord] = useState("");
  const [formTargetWord, setFormTargetWord] = useState("");
  const [predicateText, setPredicateText] = useState("");
  const [submittingEdge, setSubmittingEdge] = useState(false);

  // Selected Edge for Unlink
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  // Unlink Confirmation Modal state
  const [isUnlinkConfirmOpen, setIsUnlinkConfirmOpen] = useState(false);
  const [edgeToUnlink, setEdgeToUnlink] = useState<GraphEdgeItem | null>(null);

  // Map of Kanji characters to details (romaji, meaning)
  const kanjiMap = useMemo(() => {
    const map = new Map<string, KanjiItem>();
    kanjis.forEach((k) => map.set(k.character, k));
    return map;
  }, [kanjis]);

  // Load list of all Kanjis
  useEffect(() => {
    const loadKanjis = async () => {
      try {
        const list = await api.admin.kanjis.list();
        setKanjis(list);
        if (!selectedKanjiId && list.length > 0) {
          const target = list.find((k: any) => k.character === "試") || list[0];
          setSelectedKanjiId(target.id);
          setSearchParams({ kanjiId: target.id.toString() });
        }
      } catch (err: any) {
        console.error("Gagal memuat list kanji:", err);
      }
    };
    loadKanjis();
  }, []);

  // Handle Unlink button click on Edge
  const triggerUnlinkModal = useCallback((edgeId: string) => {
    setGraphEdges((prev) => {
      const match = prev.find((e) => e.id === edgeId);
      if (match) {
        setEdgeToUnlink(match);
        setIsUnlinkConfirmOpen(true);
      }
      return prev;
    });
  }, []);

  // Primary Node Selection Handler
  const handleSelectNodeByWord = useCallback(
    (targetWord: string) => {
      if (!targetWord || targetWord.startsWith("root-") || targetWord.startsWith("leaf-")) return;

      setSourceNodeWord((prevSource) => {
        if (!prevSource) {
          setSelectedEdgeId(null);
          return targetWord;
        }

        if (prevSource === targetWord) {
          return null;
        }

        setFormSourceWord(prevSource);
        setFormTargetWord(targetWord);
        setPredicateText("");
        setIsConnectModalOpen(true);
        return prevSource;
      });
    },
    []
  );

  // Fetch Jukugos and GraphEdges when selectedKanjiId changes
  const fetchGraphData = useCallback(async () => {
    if (!selectedKanjiId) return;
    try {
      setLoading(true);
      setError("");

      const [allJukugos, edgesData] = await Promise.all([
        api.admin.jukugos.list(),
        api.admin.graphEdges.list(selectedKanjiId),
      ]);

      const filteredJukugos = allJukugos.filter(
        (j: JukugoItem) => j.kanjiId === selectedKanjiId
      );

      setJukugos(filteredJukugos);
      setGraphEdges(edgesData);

      const flowNodes: Node[] = [];
      const flowEdges: Edge[] = [];

      // 1. Ring of Jukugo Nodes (Extra Spacious 680px radius around clean open center)
      const count = filteredJukugos.length;
      const jukugoRadius = Math.max(680, count * 50);

      filteredJukugos.forEach((j: JukugoItem, idx: number) => {
        const jukugoAngle = (idx / Math.max(1, count)) * 2 * Math.PI - Math.PI / 2;
        const jukugoX = Math.round(Math.cos(jukugoAngle) * jukugoRadius);
        const jukugoY = Math.round(Math.sin(jukugoAngle) * jukugoRadius);

        const word = j.word.trim();

        // Add Jukugo Node
        flowNodes.push({
          id: word,
          type: "jukugoNode",
          position: { x: jukugoX, y: jukugoY },
          data: {
            word: word,
            reading: j.reading,
            meaning: j.meaning,
            isRoot: false,
            isSourceNode: sourceNodeWord === word,
            onSelectNode: handleSelectNodeByWord,
          },
        });

        // 2. Component Leaf Kanji Nodes Radiating OUTWARD from this Jukugo Node (Spacious 300px offset)
        const charList = Array.from(word);
        const leafDistance = 300;
        const totalChars = charList.length;

        charList.forEach((char, cIdx) => {
          const kInfo = kanjiMap.get(char);
          // Tight fan offset so leaf nodes belonging to same Jukugo stay clustered
          const spreadOffset = (cIdx - (totalChars - 1) / 2) * 0.38;
          const leafAngle = jukugoAngle + spreadOffset;
          const leafX = Math.round(jukugoX + Math.cos(leafAngle) * leafDistance);
          const leafY = Math.round(jukugoY + Math.sin(leafAngle) * leafDistance);

          const leafId = `leaf-${word}-${char}-${cIdx}`;

          // Add Leaf Kanji Node
          flowNodes.push({
            id: leafId,
            type: "leafNode",
            position: { x: leafX, y: leafY },
            data: {
              character: char,
              romaji: kInfo?.romaji || "",
              meaning: kInfo?.meaning || "",
              parentWord: word,
            },
          });

          // Add Edge connecting Jukugo Node -> Leaf Kanji Node
          flowEdges.push({
            id: `edge-${leafId}`,
            source: word,
            target: leafId,
            type: "default",
            style: { stroke: "#10b981", strokeWidth: 2.5, strokeDasharray: "5 3" },
            animated: true,
          });
        });
      });

      // 3. Cross-link React Flow Edges (KanjiGraphEdge between Jukugos)
      edgesData.forEach((e: GraphEdgeItem) => {
        flowEdges.push({
          id: e.id,
          source: e.source.trim(),
          target: e.target.trim(),
          type: "semanticEdge",
          label: e.predicate || "hubungan",
          data: {
            isSelected: selectedEdgeId === e.id,
            onUnlinkClick: triggerUnlinkModal,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: selectedEdgeId === e.id ? "#ef4444" : "#4f46e5",
            width: 22,
            height: 22,
          },
        });
      });

      setNodes(flowNodes);
      setEdges(flowEdges);
    } catch (err: any) {
      console.error("Gagal memuat data graf semantik:", err);
      setError(err.message || "Gagal memuat data graf.");
    } finally {
      setLoading(false);
    }
  }, [
    selectedKanjiId,
    kanjis,
    kanjiMap,
    sourceNodeWord,
    selectedEdgeId,
    handleSelectNodeByWord,
    setNodes,
    setEdges,
    triggerUnlinkModal,
  ]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  // Handle Kanji Selection change
  const handleSelectKanji = (id: number) => {
    setSelectedKanjiId(id);
    setSourceNodeWord(null);
    setSelectedEdgeId(null);
    setSearchParams({ kanjiId: id.toString() });
  };

  // Node click handler from React Flow
  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      handleSelectNodeByWord(node.id);
    },
    [handleSelectNodeByWord]
  );

  // Click on background canvas -> cancel connection mode or deselect edge
  const handlePaneClick = useCallback(() => {
    setSourceNodeWord(null);
    setSelectedEdgeId(null);
  }, []);

  // Click on edge -> highlight edge and show Unlink button
  const handleEdgeClick = useCallback(
    (e: React.MouseEvent, edge: Edge) => {
      e.stopPropagation();
      setSourceNodeWord(null);
      setSelectedEdgeId(edge.id);
    },
    []
  );

  // Save new connection
  const handleSaveConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKanjiId || !formSourceWord || !formTargetWord) return;

    if (formSourceWord === formTargetWord) {
      alert("Jukugo asal dan tujuan tidak boleh sama.");
      return;
    }

    const finalPredicate = predicateText.trim();
    if (!finalPredicate) {
      alert("Jenis hubungan semantik (predicate) wajib diisi.");
      return;
    }

    try {
      setSubmittingEdge(true);
      await api.admin.graphEdges.create({
        kanjiId: selectedKanjiId,
        source: formSourceWord,
        target: formTargetWord,
        predicate: finalPredicate,
      });

      setIsConnectModalOpen(false);
      setSourceNodeWord(null);
      await fetchGraphData();
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan hubungan semantik.");
    } finally {
      setSubmittingEdge(false);
    }
  };

  // Perform actual Unlink
  const handleConfirmUnlink = async () => {
    if (!edgeToUnlink) return;
    try {
      setSubmittingEdge(true);
      await api.admin.graphEdges.delete(edgeToUnlink.id);
      setIsUnlinkConfirmOpen(false);
      setEdgeToUnlink(null);
      setSelectedEdgeId(null);
      await fetchGraphData();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus hubungan.");
    } finally {
      setSubmittingEdge(false);
    }
  };

  const selectedKanji = useMemo(
    () => kanjis.find((k) => k.id === selectedKanjiId),
    [kanjis, selectedKanjiId]
  );

  return (
    <Layout>
      <main className="flex-1 w-full px-4 md:px-6 max-w-[1200px] mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-outline-variant/30 pb-4">
          <div>
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface flex items-center gap-2">
              <button
                onClick={() =>
                  navigate(
                    `/admin/jukugo${
                      selectedKanjiId ? `?kanjiId=${selectedKanjiId}` : ""
                    }`
                  )
                }
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 border-none bg-transparent cursor-pointer transition-all flex items-center justify-center"
                title="Kembali ke Kelola Jukugo"
              >
                <Icon name="arrow_back" className="text-2xl" />
              </button>
              <Icon name="hub" className="text-indigo-600 text-3xl" />
              Control Semantic: Hubungan Jukugo
            </h2>
            <p className="text-body-md text-on-surface-variant font-medium mt-1">
              Hubungkan relasi semantik antar Jukugo serta lihat komponen karakter Kanji leaf terkait.
            </p>
          </div>

          {/* Kanji Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-600 whitespace-nowrap">
              Pilih Kanji Target:
            </span>
            <select
              value={selectedKanjiId || ""}
              onChange={(e) => handleSelectKanji(Number(e.target.value))}
              className="bg-slate-50 border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary font-bold cursor-pointer min-w-[200px]"
            >
              {kanjis.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.character} ({k.romaji || "N/A"})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Interaction Status Banner */}
        <div
          className={`p-4 rounded-2xl border transition-all flex items-center justify-between shadow-xs ${
            sourceNodeWord
              ? "bg-emerald-500 text-white border-emerald-600 animate-pulse"
              : "bg-white border-indigo-100 text-slate-700"
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon
              name={sourceNodeWord ? "add_link" : "touch_app"}
              className={`text-2xl ${
                sourceNodeWord ? "text-white" : "text-indigo-600"
              }`}
            />
            <div className="text-xs font-semibold leading-relaxed">
              {sourceNodeWord ? (
                <>
                  <span className="font-extrabold text-sm block">
                    Menghubungkan dari: "{sourceNodeWord}"
                  </span>
                  Klik node Jukugo tujuan di canvas untuk menghubungkan, atau klik area kosong untuk membatalkan.
                </>
              ) : (
                <>
                  <span className="font-extrabold text-slate-900 block">
                    Cara Menghubungkan Jukugo:
                  </span>
                  Klik pada node Jukugo pertama (Asal), lalu klik pada Jukugo kedua (Tujuan) untuk membuat hubungan baru. Karakter Kanji penyusun Jukugo otomatis ditampilkan sebagai node leaf hijau di sekitar Jukugo.
                </>
              )}
            </div>
          </div>

          {sourceNodeWord && (
            <button
              type="button"
              onClick={() => setSourceNodeWord(null)}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-extrabold cursor-pointer border-none transition-all flex items-center gap-1"
            >
              <Icon name="close" className="text-sm" />
              Batal
            </button>
          )}
        </div>

        {/* Visual Canvas (Spacious Tiered Layout, Full Zoom & Pan) */}
        <div className="bg-slate-50 border border-outline-variant/30 rounded-3xl overflow-hidden shadow-sm h-[660px] relative cursor-default">
          {loading ? (
            <div className="flex justify-center items-center h-full text-slate-400 gap-3">
              <Icon name="sync" className="w-8 h-8 animate-spin text-indigo-600" />
              <span className="font-bold text-sm">Memuat visualizer semantik...</span>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-full text-rose-500 font-bold">
              {error}
            </div>
          ) : nodes.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-full text-slate-400 gap-2 p-6 text-center">
              <Icon name="device_hub" className="w-12 h-12 text-slate-400" />
              <p className="font-bold text-slate-700">
                Kanji '{selectedKanji?.character}' belum memiliki data Jukugo.
              </p>
            </div>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={handleNodeClick}
              onEdgeClick={handleEdgeClick}
              onPaneClick={handlePaneClick}
              nodesDraggable={true}
              nodesConnectable={false}
              elementsSelectable={true}
              panOnDrag={true}
              zoomOnScroll={true}
              minZoom={0.1}
              maxZoom={2.0}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              className="bg-slate-50 cursor-grab active:cursor-grabbing"
            >
              <Background color="#cbd5e1" gap={24} size={1} />
              <Controls className="!bg-white !border-slate-200 !fill-slate-700 rounded-xl overflow-hidden shadow-md" />
            </ReactFlow>
          )}
        </div>

        {/* Modal Create New Connection */}
        {isConnectModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
            <div className="bg-white border border-outline-variant/30 rounded-3xl w-full sm:w-[560px] md:w-[640px] max-w-2xl shrink-0 shadow-2xl overflow-hidden animate-scale-up flex flex-col">
              <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between bg-slate-50">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Icon name="hub" className="text-indigo-600 text-xl" />
                  Tambah Hubungan Semantik Jukugo
                </h3>
                <button
                  type="button"
                  onClick={() => setIsConnectModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 p-1 bg-transparent border-none cursor-pointer"
                >
                  <Icon name="close" className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleSaveConnection} className="p-6 space-y-4">
                {/* Source & Target Pre-filled Display */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Jukugo Asal (Source)
                    </label>
                    <input
                      type="text"
                      value={formSourceWord}
                      readOnly
                      className="w-full bg-indigo-50 border border-indigo-200 text-indigo-900 font-extrabold rounded-xl px-3.5 py-2.5 text-sm outline-none cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Jukugo Tujuan (Target)
                    </label>
                    <input
                      type="text"
                      value={formTargetWord}
                      readOnly
                      className="w-full bg-emerald-50 border border-emerald-200 text-emerald-900 font-extrabold rounded-xl px-3.5 py-2.5 text-sm outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Jenis Hubungan Semantik (Predicate) <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: sejenis uji coba, mirip makna, komponen dari"
                    value={predicateText}
                    onChange={(e) => setPredicateText(e.target.value)}
                    className="w-full bg-slate-50 border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary font-bold"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <CancelButton onClick={() => setIsConnectModalOpen(false)} />
                  <button
                    type="submit"
                    disabled={submittingEdge}
                    className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md cursor-pointer transition-all border-none flex items-center gap-2 text-sm"
                  >
                    {submittingEdge && (
                      <Icon name="sync" className="text-lg animate-spin" />
                    )}
                    <span>Simpan Hubungan</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Unlink Confirmation Modal */}
        {isUnlinkConfirmOpen && edgeToUnlink && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="bg-white border border-outline-variant/30 rounded-3xl w-full sm:w-[480px] md:w-[520px] max-w-lg shrink-0 shadow-2xl overflow-hidden animate-scale-up flex flex-col p-6 space-y-4">
              <div className="flex items-center gap-3 text-rose-600">
                <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                  <Icon name="link_off" className="text-xl" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Konfirmasi Unlink Hubungan
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Tindakan ini akan menghapus garis relasi semantik.
                  </p>
                </div>
              </div>

              <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-2xl text-center space-y-2 text-sm">
                <div className="font-extrabold text-slate-800 flex flex-wrap items-center justify-center gap-2">
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-xl">
                    {edgeToUnlink.source}
                  </span>
                  <span className="text-xs text-rose-600 font-bold break-all">
                    ➔ ({edgeToUnlink.predicate || "hubungan"}) ➔
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-xl">
                    {edgeToUnlink.target}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium pt-1">
                  Apakah Anda yakin ingin menghapus hubungan semantik di atas?
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <CancelButton onClick={() => setIsUnlinkConfirmOpen(false)} />
                <button
                  type="button"
                  disabled={submittingEdge}
                  onClick={handleConfirmUnlink}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm font-bold shadow-md cursor-pointer border-none transition-all flex items-center gap-2"
                >
                  {submittingEdge && (
                    <Icon name="sync" className="text-base animate-spin" />
                  )}
                  <span>Ya, Hapus Hubungan</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default SemanticControlPage;
