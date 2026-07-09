import React, { useState, useEffect, useRef } from "react";
import Layout from "../../Common/Component/Organism/Layout";
import Icon from "../../Common/Component/Icon";
import { api } from "../../Common/Utility/api";
import { useNavigate, useSearchParams } from "react-router-dom";

export const KanjiFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const moduleIdStr = searchParams.get("moduleId");
  const kanjiIdStr = searchParams.get("kanjiId");

  const moduleId = moduleIdStr ? parseInt(moduleIdStr, 10) : null;
  const kanjiId = kanjiIdStr ? parseInt(kanjiIdStr, 10) : null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");

  // Form Fields
  const [kanjiChar, setKanjiChar] = useState("");
  const [kanjiRomaji, setKanjiRomaji] = useState("");
  const [kanjiMeaning, setKanjiMeaning] = useState("");

  
  // Random border initialization helper
  const getRandomBorder = () => {
    const bordersList = ["border-l-4 border-primary", "border-l-4 border-secondary", "border-l-4 border-tertiary"];
    return bordersList[Math.floor(Math.random() * bordersList.length)];
  };
  const [kanjiBorder, setKanjiBorder] = useState(getRandomBorder());

  // Form Lists
  const [examples, setExamples] = useState<any[]>([]);
  const [jukugos, setJukugos] = useState<any[]>([]);
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);

  // Virtual Keyboard state
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [keyboardTab, setKeyboardTab] = useState<"N5" | "N4" | "N3" | "Radical">("N5");
  const keyboardRef = useRef<HTMLDivElement>(null);

  const kanjiLists = {
    N5: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "百", "千", "万", "円", "口", "目", "耳", "手", "足", "力", "人", "子", "女", "男", "先", "生", "学", "校", "年", "日", "月", "火", "水", "木", "金", "土", "本", "東", "西", "南", "北", "前", "後", "上", "下", "左", "右", "中", "大", "小", "長", "高", "安", "新", "古", "多", "少", "行", "来", "友", "会", "社", "父", "母", "毎", "書", "読", "聞", "話", "見", "食", "食", "飲", "買"],
    N4: ["会", "同", "事", "自", "社", "発", "者", "地", "業", "方", "新", "場", "員", "立", "開", "手", "代", "力", "问", "明", "京", "国", "画", "聞", "読", "書", "通", "走", "歩", "旅", "屋", "店", "物", "空", "雨", "風", "林", "森", "花", "海", "鳥", "牛", "馬", "魚", "米", "茶"],
    N3: ["情", "報", "感", "覚", "最", "初", "的", "政", "治", "経", "済", "歴", "史", "辞", "宿", "題", "寒", "暑", "薬", "医", "術", "運", "動", "転", "働", "痛", "悲", "怒", "考", "信", "想", "調", "査", "果", "戦", "争", "面", "接", "練", "習"],
    Radical: ["心", "門", "木", "氵", "扌", "火", "土", "女", "子", "糸", "言", "金", "貝", "車", "雨", "疒", "辶", "人", "口", "日", "月", "力", "手", "目", "耳", "足"]
  };

  const handleKeyboardInput = (char: string) => {
    setKanjiChar((prev) => {
      const nextVal = prev.length < 10 ? prev + char : prev;
      setNodes((prevNodes) =>
        prevNodes.map((n) => (n.type === "root" ? { ...n, character: nextVal } : n))
      );
      return nextVal;
    });
  };

  const handleBackspace = () => {
    setKanjiChar((prev) => {
      const nextVal = prev.slice(0, -1);
      setNodes((prevNodes) =>
        prevNodes.map((n) => (n.type === "root" ? { ...n, character: nextVal } : n))
      );
      return nextVal;
    });
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (keyboardRef.current && !keyboardRef.current.contains(e.target as Node)) {
        setShowKeyboard(false);
      }
    };
    if (showKeyboard) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showKeyboard]);

  // Graph nodes edit mode: "table" | "visual"
  const [graphEditMode, setGraphEditMode] = useState<"table" | "visual">("visual");

  // Drag and Drop Coordinates state
  const [nodeCoords, setNodeCoords] = useState<Record<string, { x: number; y: number }>>({});
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [linkingSourceId, setLinkingSourceId] = useState<string | null>(null);

  // Pan and Zoom States
  const [zoomScale, setZoomScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStartPos, setPanStartPos] = useState({ x: 0, y: 0 });
  const [panOffsetStart, setPanOffsetStart] = useState({ x: 0, y: 0 });

  // For node drag tracking
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [nodeStartPos, setNodeStartPos] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadKanjiData = async () => {
      if (!moduleId) {
        setError("ID Modul tidak valid.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        if (kanjiId) {
          // Edit mode: fetch all kanjis and find the matches
          const allKanjis = await api.admin.kanjis.list();
          const target = allKanjis.find((k: any) => k.id === kanjiId);
          if (!target) {
            setError("Karakter Kanji tidak ditemukan.");
            return;
          }
          
          setKanjiChar(target.character);
          setKanjiRomaji(target.romaji);
          setKanjiMeaning(target.meaning);

          setKanjiBorder(target.border || "border-l-4 border-primary");
          setExamples(target.examples.length > 0 ? target.examples : [{ japanese: "", romaji: "", translation: "" }]);
          setJukugos(target.jukugos && target.jukugos.length > 0 ? target.jukugos : [{ word: "", reading: "", meaning: "" }]);
          setNodes(target.graphNodes.length > 0 ? target.graphNodes : [{ id: "root", character: target.character, meaning: "INTI", type: "root", borderColor: "border-blue-500", isPill: false, parentPill: null }]);
          setEdges(target.graphEdges);
        } else {
          // Add mode: default initialization
          setExamples([{ japanese: "", romaji: "", translation: "" }]);
          setJukugos([{ word: "", reading: "", meaning: "" }]);
          setNodes([{ id: "root", character: "", meaning: "INTI", type: "root", borderColor: "border-blue-500", isPill: false, parentPill: null }]);
          setEdges([]);
          setKanjiBorder(getRandomBorder());
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Gagal memuat data formulir.");
      } finally {
        setLoading(false);
      }
    };

    loadKanjiData();
  }, [moduleId, kanjiId]);

  // Sync node coords when nodes change or component initializes without resetting active drags (Neat hierarchical spacing)
  useEffect(() => {
    setNodeCoords((prev) => {
      const updated = { ...prev };
      
      // Separate nodes by type
      const rootNode = nodes.find((n) => n.type === "root");
      const topNodes = nodes.filter((n) => n.type === "top");
      const bottomNodes = nodes.filter((n) => n.type === "bottom");
      const subBottomNodes = nodes.filter((n) => n.type === "sub-bottom");

      // 1. Root node coord (Centered at 440)
      if (rootNode && !updated[rootNode.id]) {
        updated[rootNode.id] = { x: 440, y: 120 };
      }

      // 2. Top nodes coords (Radicals centered above root at 440)
      topNodes.forEach((n, idx) => {
        if (!updated[n.id]) {
          const x = topNodes.length === 1 ? 440 : 320 + idx * 240;
          updated[n.id] = { x, y: 30 };
        }
      });

      // 3. Bottom nodes coords (Middle compound words widely spaced)
      bottomNodes.forEach((n, idx) => {
        if (!updated[n.id]) {
          const x = bottomNodes.length === 1 ? 440 : 220 + idx * 440;
          updated[n.id] = { x, y: 220 };
        }
      });

      // 4. Sub-bottom nodes coords (Symmetrically staggered under parent bottom nodes)
      bottomNodes.forEach((parent) => {
        const children = subBottomNodes.filter((child) => child.parentPill === parent.id);
        const parentCoord = updated[parent.id] || { x: 440, y: 220 };

        children.forEach((child, childIdx) => {
          if (!updated[child.id]) {
            const offset = (childIdx - (children.length - 1) / 2) * 190;
            updated[child.id] = {
              x: parentCoord.x + offset,
              y: 330,
            };
          }
        });
      });

      // 5. Fallback for any other node types (e.g. newly added nodes)
      let fallbackIndex = 0;
      nodes.forEach((n) => {
        if (!updated[n.id]) {
          updated[n.id] = { x: 100 + fallbackIndex * 180, y: 330 };
          fallbackIndex++;
        }
      });

      return updated;
    });
  }, [nodes]);

  const handleCharInput = (val: string) => {
    setKanjiChar(val);
    setNodes((prev) =>
      prev.map((n) => (n.type === "root" ? { ...n, character: val } : n))
    );
  };

  const addExampleRow = () => {
    setExamples((prev) => [...prev, { japanese: "", romaji: "", translation: "" }]);
  };
  const removeExampleRow = (idx: number) => {
    setExamples((prev) => prev.filter((_, i) => i !== idx));
  };

  const addJukugoRow = () => {
    setJukugos((prev) => [...prev, { word: "", reading: "", meaning: "" }]);
  };
  const removeJukugoRow = (idx: number) => {
    setJukugos((prev) => prev.filter((_, i) => i !== idx));
  };

  const addNodeRow = () => {
    const id = `node-${Date.now()}`;
    setNodes((prev) => [
      ...prev,
      { id, character: "", meaning: "", type: "bottom", borderColor: "border-green-500", isPill: true, parentPill: null },
    ]);
  };
  const removeNodeRow = (idx: number) => {
    const nodeToRemove = nodes[idx];
    setNodes((prev) => prev.filter((_, i) => i !== idx));
    setEdges((prev) => prev.filter((e) => e.source !== nodeToRemove.id && e.target !== nodeToRemove.id));
  };

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (linkingSourceId) return;
    e.preventDefault();
    e.stopPropagation(); // Stop propagation to prevent panning trigger!
    setDraggedNodeId(nodeId);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    setNodeStartPos({ ...nodeCoords[nodeId] });
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Only pan if clicking on empty space in canvas background
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains("grid-crosshair")) {
      e.preventDefault();
      setIsPanning(true);
      setPanStartPos({ x: e.clientX, y: e.clientY });
      setPanOffsetStart({ ...panOffset });
    }
  };

  const handleContainerMouseMove = (e: React.MouseEvent) => {
    if (draggedNodeId) {
      e.preventDefault();
      // Calculate delta divided by zoomScale to match cursor speed
      const dx = (e.clientX - dragStartPos.x) / zoomScale;
      const dy = (e.clientY - dragStartPos.y) / zoomScale;

      const newX = Math.max(10, nodeStartPos.x + dx);
      const newY = Math.max(10, nodeStartPos.y + dy);

      setNodeCoords((prev) => ({
        ...prev,
        [draggedNodeId]: { x: newX, y: newY },
      }));
    } else if (isPanning) {
      e.preventDefault();
      const dx = e.clientX - panStartPos.x;
      const dy = e.clientY - panStartPos.y;
      setPanOffset({
        x: panOffsetStart.x + dx,
        y: panOffsetStart.y + dy,
      });
    }
  };

  const handleContainerMouseUp = () => {
    setDraggedNodeId(null);
    setIsPanning(false);
  };

  const handleCanvasWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomIntensity = 0.05;
    const delta = e.deltaY < 0 ? 1 : -1;
    setZoomScale((prev) => {
      const nextScale = prev + delta * zoomIntensity;
      return Math.max(0.4, Math.min(2.0, nextScale)); // clamp between 0.4x and 2.0x
    });
  };

  const startConnection = (nodeId: string) => {
    setLinkingSourceId(nodeId);
  };

  const completeConnection = (targetId: string) => {
    if (!linkingSourceId || linkingSourceId === targetId) {
      setLinkingSourceId(null);
      return;
    }

    const edgeId = `e-${linkingSourceId}-${targetId}`;
    const exists = edges.some((e) => e.source === linkingSourceId && e.target === targetId);

    if (!exists) {
      setEdges((prev) => [...prev, { id: edgeId, source: linkingSourceId, target: targetId }]);
    }
    setLinkingSourceId(null);
  };

  const removeEdge = (idx: number) => {
    setEdges((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveKanji = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kanjiChar.trim() || !kanjiRomaji.trim() || !kanjiMeaning.trim()) {
      setActionError("Karakter, romaji, dan arti wajib diisi.");
      return;
    }

    const formattedNodes = nodes.map((n) => {
      const formattedId = n.id.startsWith(kanjiChar) ? n.id : `${kanjiChar}-${n.id}`;
      return {
        ...n,
        id: formattedId,
        parentPill: n.parentPill && !n.parentPill.startsWith(kanjiChar) ? `${kanjiChar}-${n.parentPill}` : n.parentPill
      };
    });

    const formattedEdges = edges.map((eg) => ({
      ...eg,
      id: eg.id.startsWith(kanjiChar) ? eg.id : `${kanjiChar}-${eg.id}`,
      source: eg.source.startsWith(kanjiChar) ? eg.source : `${kanjiChar}-${eg.source}`,
      target: eg.target.startsWith(kanjiChar) ? eg.target : `${kanjiChar}-${eg.target}`
    }));

    const payload = {
      character: kanjiChar,
      romaji: kanjiRomaji,
      meaning: kanjiMeaning,

      isJukugo: kanjiChar.length > 1, // Automatically set based on character length
      border: kanjiBorder || null,
      moduleId,
      examples: examples.filter((ex) => ex.japanese.trim() !== ""),
      jukugos: jukugos.filter((j) => j.word.trim() !== ""),
      graphNodes: formattedNodes,
      graphEdges: formattedEdges,
    };

    try {
      setSubmitting(true);
      setActionError("");
      if (kanjiId) {
        await api.admin.kanjis.update(kanjiId, payload);
      } else {
        await api.admin.kanjis.create(payload);
      }
      navigate(`/admin/module-detail?id=${moduleId}`);
    } catch (err: any) {
      setActionError(err.message || "Gagal menyimpan kanji.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex-grow flex items-center justify-center min-h-[400px]">
          <div className="text-primary font-bold animate-pulse text-lg">Memuat Formulir Kanji...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="flex-grow w-full px-4 md:px-6 max-w-[1000px] mx-auto py-6">
        <div className="flex flex-col gap-base">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-base border-b border-outline-variant/30 pb-base">
            <div>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface flex items-center gap-sm">
                <Icon name="draw" className="text-primary text-3xl" />
                {kanjiId ? `Edit Kanji: ${kanjiChar}` : "Tambah Kanji Baru"}
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Lengkapi kurikulum details, kalimat contoh, dan visualisasi graf hubungan simpul untuk Kanji ini.
              </p>
            </div>
            <button
              onClick={() => navigate(`/admin/module-detail?id=${moduleId}`)}
              className="px-4 py-2 border border-outline hover:bg-surface-container transition-all cursor-pointer font-bold text-on-surface bg-transparent rounded-lg flex items-center gap-sm text-sm"
            >
              <Icon name="close" className="text-lg" />
              Batal & Kembali
            </button>
          </div>

          {/* Form Error */}
          {error && (
            <div className="p-4 bg-error-container text-on-error-container border border-error/20 rounded-xl font-semibold">
              {error}
            </div>
          )}

          {/* Form Element */}
          <form onSubmit={handleSaveKanji} className="flex flex-col gap-6 bg-white border border-outline-variant/30 p-6 rounded-2xl shadow-sm">
            
            {/* Section 1: Basic Info */}
            <div className="flex flex-col gap-4">
              <h4 className="font-label-lg text-label-lg font-bold border-b border-outline-variant/20 pb-1 text-primary">
                1. Data Karakter Kanji
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5 relative">
                  <label className="font-label-sm text-label-sm font-semibold text-on-surface">Karakter Kanji</label>
                  <div className="relative flex items-center w-full">
                    <input
                      type="text"
                      value={kanjiChar}
                      onChange={(e) => handleCharInput(e.target.value)}
                      maxLength={10}
                      className="bg-slate-50 border border-outline-variant/30 text-on-surface rounded-lg p-2.5 pr-10 w-full focus:ring-2 focus:ring-primary outline-none text-center font-bold text-xl"
                      placeholder="Contoh: 学"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowKeyboard((prev) => !prev)}
                      className="absolute right-3 p-1 text-slate-400 hover:text-primary rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center transition-all"
                      title="Toggle Keyboard Virtual"
                    >
                      <Icon name="keyboard" className="text-xl" />
                    </button>
                  </div>

                  {/* Virtual Keyboard Overlay */}
                  {showKeyboard && (
                    <div
                      ref={keyboardRef}
                      className="absolute top-[75px] left-0 z-50 bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl p-4 rounded-2xl w-[320px] md:w-[450px] flex flex-col gap-3 select-none"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-xs text-primary flex items-center gap-1">
                          <Icon name="keyboard" className="text-sm" />
                          Keyboard Kanji Virtual
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleBackspace}
                            className="px-2 py-1 text-[10px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-md border-none cursor-pointer flex items-center gap-0.5"
                            title="Hapus Karakter Terakhir"
                          >
                            <Icon name="backspace" className="text-[10px]" />
                            DEL
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowKeyboard(false)}
                            className="p-0.5 hover:bg-slate-100 rounded-full border-none bg-transparent cursor-pointer"
                          >
                            <Icon name="close" className="text-sm text-slate-400" />
                          </button>
                        </div>
                      </div>

                      {/* Tabs */}
                      <div className="flex gap-1 border-b border-slate-100 pb-1">
                        {(["N5", "N4", "N3", "Radical"] as const).map((tab) => (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => setKeyboardTab(tab)}
                            className={`flex-1 py-1 text-[10px] font-bold rounded-md border-none cursor-pointer transition-all ${
                              keyboardTab === tab
                                ? "bg-primary text-on-primary"
                                : "bg-transparent text-slate-500 hover:bg-slate-50"
                            }`}
                          >
                            {tab === "Radical" ? "Radikal" : tab}
                          </button>
                        ))}
                      </div>

                      {/* Keys Grid */}
                      <div className="grid grid-cols-8 gap-1.5 h-[160px] overflow-y-auto pr-1 sidebar-scroll">
                        {kanjiLists[keyboardTab].map((char) => (
                          <button
                            key={char}
                            type="button"
                            onClick={() => handleKeyboardInput(char)}
                            className="w-full h-8 flex items-center justify-center text-sm font-semibold rounded-lg bg-slate-50 border border-slate-100 hover:border-primary hover:bg-primary/5 active:scale-95 transition-all text-on-surface cursor-pointer"
                          >
                            {char}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm font-semibold text-on-surface">Romaji</label>
                  <input
                    type="text"
                    value={kanjiRomaji}
                    onChange={(e) => setKanjiRomaji(e.target.value)}
                    className="bg-slate-50 border border-outline-variant/30 text-on-surface rounded-lg p-2.5 w-full focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Contoh: Manabu"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm font-semibold text-on-surface">Arti / Makna</label>
                  <input
                    type="text"
                    value={kanjiMeaning}
                    onChange={(e) => setKanjiMeaning(e.target.value)}
                    className="bg-slate-50 border border-outline-variant/30 text-on-surface rounded-lg p-2.5 w-full focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Contoh: Belajar"
                    required
                  />
                </div>
              </div>



              {/* Jukugo automatically determined on save */}
            </div>

            {/* Section 2: Examples */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-end border-b border-outline-variant/20 pb-1">
                <h4 className="font-label-lg text-label-lg font-bold text-primary">
                  2. Kalimat Contoh (Examples)
                </h4>
                <button
                  type="button"
                  onClick={addExampleRow}
                  className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-md font-bold cursor-pointer hover:bg-primary/20 border-none animate-pulse-slow"
                >
                  + Tambah Baris Kalimat
                </button>
              </div>

              <div className="space-y-3">
                {examples.map((ex, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-slate-500">Bahasa Jepang</label>
                        <input
                          type="text"
                          value={ex.japanese}
                          onChange={(e) => {
                            const newEx = [...examples];
                            newEx[idx].japanese = e.target.value;
                            setExamples(newEx);
                          }}
                          className="bg-white border border-outline-variant/30 rounded-lg p-2.5 text-sm text-on-surface outline-none"
                          placeholder="日本語を学びます。"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-slate-500">Romaji</label>
                        <input
                          type="text"
                          value={ex.romaji}
                          onChange={(e) => {
                            const newEx = [...examples];
                            newEx[idx].romaji = e.target.value;
                            setExamples(newEx);
                          }}
                          className="bg-white border border-outline-variant/30 rounded-lg p-2.5 text-sm text-on-surface outline-none"
                          placeholder="Nihongo wo manabimasu."
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-slate-500">Terjemahan</label>
                        <input
                          type="text"
                          value={ex.translation}
                          onChange={(e) => {
                            const newEx = [...examples];
                            newEx[idx].translation = e.target.value;
                            setExamples(newEx);
                          }}
                          className="bg-white border border-outline-variant/30 rounded-lg p-2.5 text-sm text-on-surface outline-none"
                          placeholder="Belajar bahasa Jepang."
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExampleRow(idx)}
                      disabled={examples.length === 1}
                      className="text-error bg-transparent hover:bg-error-container/20 p-2.5 rounded-lg cursor-pointer border-none mt-4 disabled:opacity-30"
                    >
                      <Icon name="delete" className="text-lg block" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Jukugo */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
                <h4 className="font-label-lg text-label-lg font-bold text-primary flex items-center gap-sm">
                  3. Daftar Jukugo (Compound Words)
                </h4>
                <button
                  type="button"
                  onClick={addJukugoRow}
                  className="px-3.5 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-1"
                >
                  <Icon name="add" className="text-sm" />
                  Tambah Jukugo
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {jukugos.map((j, idx) => (
                  <div key={idx} className="flex gap-4 items-end bg-surface-container-low/40 p-4 rounded-xl border border-outline-variant/20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-slate-500">Kata Jukugo</label>
                        <input
                          type="text"
                          value={j.word}
                          onChange={(e) => {
                            const newJ = [...jukugos];
                            newJ[idx].word = e.target.value;
                            setJukugos(newJ);
                          }}
                          className="bg-white border border-outline-variant/30 rounded-lg p-2.5 text-sm text-on-surface outline-none"
                          placeholder="試験"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-slate-500">Pembacaan (Furigana / Reading)</label>
                        <input
                          type="text"
                          value={j.reading}
                          onChange={(e) => {
                            const newJ = [...jukugos];
                            newJ[idx].reading = e.target.value;
                            setJukugos(newJ);
                          }}
                          className="bg-white border border-outline-variant/30 rounded-lg p-2.5 text-sm text-on-surface outline-none"
                          placeholder="しけん"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-slate-500">Arti (Meaning)</label>
                        <input
                          type="text"
                          value={j.meaning}
                          onChange={(e) => {
                            const newJ = [...jukugos];
                            newJ[idx].meaning = e.target.value;
                            setJukugos(newJ);
                          }}
                          className="bg-white border border-outline-variant/30 rounded-lg p-2.5 text-sm text-on-surface outline-none"
                          placeholder="Ujian"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeJukugoRow(idx)}
                      disabled={jukugos.length === 1}
                      className="text-error bg-transparent hover:bg-error-container/20 p-2.5 rounded-lg cursor-pointer border-none mt-4 disabled:opacity-30"
                    >
                      <Icon name="delete" className="text-lg block" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: KanjiGraphNode Visual Drag & Drop Editor */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-1">
                <h4 className="font-label-lg text-label-lg font-bold text-primary flex items-center gap-sm">
                  4. Simpul Grafik Semantik
                </h4>
                <div className="flex gap-2 bg-slate-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setGraphEditMode("visual")}
                    className={`px-3 py-1 text-xs font-bold rounded-md border-none cursor-pointer transition-all ${
                      graphEditMode === "visual" ? "bg-primary text-on-primary" : "bg-transparent text-on-surface-variant"
                    }`}
                  >
                    <Icon name="gesture" className="text-sm mr-1" />
                    Visual Drag-Drop
                  </button>
                  <button
                    type="button"
                    onClick={() => setGraphEditMode("table")}
                    className={`px-3 py-1 text-xs font-bold rounded-md border-none cursor-pointer transition-all ${
                      graphEditMode === "table" ? "bg-primary text-on-primary" : "bg-transparent text-on-surface-variant"
                    }`}
                  >
                    <Icon name="table_chart" className="text-sm mr-1" />
                    Tabel Mode
                  </button>
                </div>
              </div>

              {/* TABLE MODE */}
              {graphEditMode === "table" && (
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={addNodeRow}
                      className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-md font-bold cursor-pointer hover:bg-primary/20 border-none"
                    >
                      + Tambah Node
                    </button>
                  </div>
                  {nodes.map((n, idx) => (
                    <div key={idx} className="flex gap-4 items-start p-3 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase font-bold text-slate-500">ID Node</label>
                          <input
                            type="text"
                            value={n.id.replace(`${kanjiChar}-`, "")}
                            disabled={n.type === "root"}
                            onChange={(e) => {
                              const newN = [...nodes];
                              newN[idx].id = e.target.value;
                              setNodes(newN);
                            }}
                            className="bg-white border border-outline-variant/30 rounded-lg p-2 text-xs text-on-surface outline-none font-mono disabled:opacity-60"
                            placeholder="top-1"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase font-bold text-slate-500">Karakter</label>
                          <input
                            type="text"
                            value={n.character}
                            disabled={n.type === "root" && kanjiChar !== ""}
                            onChange={(e) => {
                              const newN = [...nodes];
                              newN[idx].character = e.target.value;
                              setNodes(newN);
                            }}
                            className="bg-white border border-outline-variant/30 rounded-lg p-2 text-sm text-on-surface outline-none text-center font-bold"
                            placeholder="子"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase font-bold text-slate-500">Arti / Makna</label>
                          <input
                            type="text"
                            value={n.meaning}
                            onChange={(e) => {
                              const newN = [...nodes];
                              newN[idx].meaning = e.target.value;
                              setNodes(newN);
                            }}
                            className="bg-white border border-outline-variant/30 rounded-lg p-2 text-sm text-on-surface outline-none"
                            placeholder="Anak"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase font-bold text-slate-500">Tipe Node</label>
                          <select
                            value={n.type}
                            disabled={n.type === "root"}
                            onChange={(e) => {
                              const newN = [...nodes];
                              newN[idx].type = e.target.value;
                              if (e.target.value === "top") {
                                newN[idx].borderColor = "border-blue-500";
                                newN[idx].isPill = false;
                              } else {
                                newN[idx].borderColor = "border-green-500";
                                newN[idx].isPill = true;
                              }
                              setNodes(newN);
                            }}
                            className="bg-white border border-outline-variant/30 rounded-lg p-2 text-xs text-on-surface outline-none"
                          >
                            <option value="root">root (Utama)</option>
                            <option value="top">top (Radikal Atas)</option>
                            <option value="bottom">bottom (Gabungan Bawah)</option>
                          </select>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNodeRow(idx)}
                        disabled={n.type === "root"}
                        className="text-error bg-transparent hover:bg-error-container/20 p-2 rounded-lg cursor-pointer border-none mt-4 disabled:opacity-30"
                      >
                        <Icon name="delete" className="text-lg block" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* VISUAL DRAG & DROP EDITOR */}
              {graphEditMode === "visual" && (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <p>
                      💡 <strong>Drag-Drop</strong> node untuk menyusun posisi. Klik ikon <strong>Rantai (Link)</strong> pada node asal, lalu klik node tujuan untuk menghubungkan (Edge).
                    </p>
                    <button
                      type="button"
                      onClick={addNodeRow}
                      className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-md font-bold cursor-pointer hover:bg-primary/20 border-none"
                    >
                      + Tambah Node
                    </button>
                  </div>

                  <div
                    ref={containerRef}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleContainerMouseMove}
                    onMouseUp={handleContainerMouseUp}
                    onWheel={handleCanvasWheel}
                    className="relative overflow-hidden w-full h-[350px] bg-slate-50 border border-slate-200 rounded-xl cursor-grab active:cursor-grabbing select-none"
                  >
                    <div className="absolute inset-0 grid-crosshair opacity-30 pointer-events-none"></div>

                    {/* Zoom / Pan Control Panel in top-right corner */}
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-xs border border-slate-200 shadow-sm p-1 rounded-lg pointer-events-auto select-none">
                      <button
                        type="button"
                        onClick={() => setZoomScale((prev) => Math.min(2.0, prev + 0.1))}
                        className="p-1 hover:bg-slate-100 text-slate-700 rounded border-none bg-transparent cursor-pointer flex items-center justify-center"
                        title="Zoom In"
                      >
                        <Icon name="add" className="text-sm" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setZoomScale((prev) => Math.max(0.4, prev - 0.1))}
                        className="p-1 hover:bg-slate-100 text-slate-700 rounded border-none bg-transparent cursor-pointer flex items-center justify-center"
                        title="Zoom Out"
                      >
                        <Icon name="remove" className="text-sm" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setZoomScale(1);
                          setPanOffset({ x: 0, y: 0 });
                        }}
                        className="px-2 py-1 hover:bg-slate-100 text-[10px] font-bold text-slate-700 rounded border-none bg-transparent cursor-pointer flex items-center justify-center"
                        title="Reset Pan & Zoom"
                      >
                        {Math.round(zoomScale * 100)}%
                      </button>
                    </div>

                    {/* Transforming viewport wrapper */}
                    <div
                      style={{
                        transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale})`,
                        transformOrigin: "0 0",
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        top: 0,
                        left: 0
                      }}
                    >
                      {/* SVG Connections overlay */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: "1500px", minHeight: "1500px" }}>
                        {edges.map((edge, index) => {
                          const sourceCoord = nodeCoords[edge.source];
                          const targetCoord = nodeCoords[edge.target];
                          if (!sourceCoord || !targetCoord) return null;

                          const x1 = sourceCoord.x + 60;
                          const y1 = sourceCoord.y + 21;
                          const x2 = targetCoord.x + 60;
                          const y2 = targetCoord.y + 21;

                          return (
                            <g key={index} className="cursor-pointer group" style={{ pointerEvents: "auto" }}>
                              <line
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="#3b82f6"
                                strokeWidth="3"
                                className="group-hover:stroke-red-500 group-hover:stroke-[4px] transition-all"
                              />
                              <circle
                                cx={(x1 + x2) / 2}
                                cy={(y1 + y2) / 2}
                                r="12"
                                fill="#ef4444"
                                style={{ pointerEvents: "auto" }}
                                className="opacity-80 md:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeEdge(index);
                                }}
                              />
                              <text
                                x={(x1 + x2) / 2}
                                y={(y1 + y2) / 2 - 14}
                                fill="#ef4444"
                                textAnchor="middle"
                                style={{ pointerEvents: "none" }}
                                className="text-[10px] font-bold opacity-80 md:opacity-0 group-hover:opacity-100 transition-opacity select-none font-mono"
                              >
                                Hapus
                              </text>
                            </g>
                          );
                        })}
                      </svg>

                      {/* Draggable Node elements */}
                      {nodes.map((n, idx) => {
                        const coord = nodeCoords[n.id] || { x: 50, y: 50 };
                        const isRoot = n.type === "root";
                        const isTop = n.type === "top";
                        const isLinkingSource = linkingSourceId === n.id;
                        
                        return (
                          <div
                            key={n.id}
                            style={{
                              left: `${coord.x}px`,
                              top: `${coord.y}px`,
                              position: "absolute",
                            }}
                            className={`w-[120px] p-2 bg-white rounded-lg border-2 shadow-sm flex flex-col items-center justify-between text-center select-none ${
                              isLinkingSource
                                ? "border-amber-500 ring-4 ring-amber-200"
                                : isRoot
                                ? "border-blue-500 shadow-md"
                                : isTop
                                ? "border-purple-500"
                                : "border-emerald-500"
                            } ${draggedNodeId === n.id ? "opacity-80 scale-105" : ""}`}
                          >
                            <div
                              onMouseDown={(e) => handleNodeMouseDown(e, n.id)}
                              className="w-full flex items-center justify-between cursor-move pb-1 border-b border-slate-100"
                            >
                              <span className="text-[8px] font-bold uppercase font-mono text-slate-400">
                                {n.type}
                              </span>
                              <div className="flex gap-1">
                                {!isLinkingSource && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (linkingSourceId) {
                                        completeConnection(n.id);
                                      } else {
                                        startConnection(n.id);
                                      }
                                    }}
                                    className="p-0.5 hover:bg-slate-100 text-slate-500 hover:text-amber-600 rounded bg-transparent border-none cursor-pointer"
                                    title={linkingSourceId ? "Hubungkan" : "Hubungkan Node"}
                                  >
                                    <Icon name={linkingSourceId ? "add" : "link"} className="text-xs block" />
                                  </button>
                                )}
                                {!isRoot && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeNodeRow(idx);
                                    }}
                                    className="p-0.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded bg-transparent border-none cursor-pointer"
                                    title="Hapus Node"
                                  >
                                    <Icon name="close" className="text-xs block" />
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="w-full mt-1.5 flex flex-col gap-1">
                              <input
                                type="text"
                                value={n.character}
                                disabled={isRoot && kanjiChar !== ""}
                                onChange={(e) => {
                                  const newN = [...nodes];
                                  newN[idx].character = e.target.value;
                                  setNodes(newN);
                                }}
                                className="w-full border-none bg-slate-50 rounded p-0.5 text-center text-sm font-bold text-slate-800 outline-none select-all"
                                placeholder="Char"
                              />
                              <input
                                type="text"
                                value={n.meaning}
                                onChange={(e) => {
                                  const newN = [...nodes];
                                  newN[idx].meaning = e.target.value;
                                  setNodes(newN);
                                }}
                                className="w-full border-none bg-transparent text-center text-[10px] text-slate-500 outline-none select-all"
                                placeholder="Makna"
                              />
                            </div>

                            {linkingSourceId && !isLinkingSource && (
                              <div
                                onClick={() => completeConnection(n.id)}
                                className="absolute inset-0 bg-amber-500/10 hover:bg-amber-500/25 border-2 border-dashed border-amber-500 rounded-lg cursor-pointer flex items-center justify-center font-bold text-amber-700 text-xs animate-pulse"
                              >
                                Pilih Target
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* List of active edges for easy management and unlinking */}
              {edges.length > 0 && (
                <div className="flex flex-col gap-2 bg-slate-50 border border-slate-200 p-4 rounded-xl mt-2">
                  <span className="font-label-sm text-label-sm font-bold text-on-surface flex items-center gap-1 select-none">
                    <Icon name="link" className="text-primary text-sm" />
                    Koneksi Garis Hubungan Antar Simpul ({edges.length})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {edges.map((edge, index) => {
                      const sourceNode = nodes.find((n) => n.id === edge.source);
                      const targetNode = nodes.find((n) => n.id === edge.target);
                      const labelSource = sourceNode
                        ? sourceNode.character || `[ID: ${sourceNode.id.replace(`${kanjiChar}-`, "")}]`
                        : edge.source.replace(`${kanjiChar}-`, "");
                      const labelTarget = targetNode
                        ? targetNode.character || `[ID: ${targetNode.id.replace(`${kanjiChar}-`, "")}]`
                        : edge.target.replace(`${kanjiChar}-`, "");
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-white border border-outline-variant/30 px-3 py-1 rounded-full text-xs font-semibold text-on-surface shadow-sm select-none"
                        >
                          <span>{labelSource}</span>
                          <Icon name="arrow_forward" className="text-xs text-primary" />
                          <span>{labelTarget}</span>
                          <button
                            type="button"
                            onClick={() => removeEdge(index)}
                            className="ml-1 text-error hover:bg-error-container/20 p-0.5 rounded-full cursor-pointer bg-transparent border-none flex items-center justify-center"
                            title="Hapus Koneksi"
                          >
                            <Icon name="close" className="text-xs block" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {actionError && (
              <p className="text-error font-body-md text-body-md font-semibold">
                {actionError}
              </p>
            )}

            {/* Save Buttons */}
            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate(`/admin/module-detail?id=${moduleId}`)}
                className="px-5 py-2.5 rounded-lg border border-outline hover:bg-surface-container transition-all cursor-pointer font-bold text-on-surface bg-transparent"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-lg bg-primary text-on-primary font-bold shadow-md cursor-pointer hover:brightness-110 active:scale-95 transition-all border-none flex items-center justify-center"
              >
                {submitting ? "Menyimpan..." : "Simpan Karakter"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </Layout>
  );
};

export default KanjiFormPage;
