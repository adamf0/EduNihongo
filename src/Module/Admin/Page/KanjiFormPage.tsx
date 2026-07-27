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
  const [kanjiBushuu, setKanjiBushuu] = useState("");
  const [kanjiOnyomi, setKanjiOnyomi] = useState("");
  const [kanjiKunyomi, setKanjiKunyomi] = useState("");
  const [kanjiBaseMeaning, setKanjiBaseMeaning] = useState("");

  
  // Random border initialization helper
  const getRandomBorder = () => {
    const bordersList = ["border-l-4 border-primary", "border-l-4 border-secondary", "border-l-4 border-tertiary"];
    return bordersList[Math.floor(Math.random() * bordersList.length)];
  };
  const [kanjiBorder, setKanjiBorder] = useState(getRandomBorder());

  // Form Lists
  const [examples, setExamples] = useState<any[]>([]);
  const [readingExamples, setReadingExamples] = useState<any[]>([]);
  const [jukugos, setJukugos] = useState<any[]>([]);
  const [etymologies, setEtymologies] = useState<any[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [reflectionQuestions, setReflectionQuestions] = useState<string[]>([]);
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);

  // Virtual Keyboard state
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [keyboardTab, setKeyboardTab] = useState<"N5" | "N4" | "N3" | "N2" | "N1" | "Radical">("N5");
  const keyboardRef = useRef<HTMLDivElement>(null);

  const kanjiLists = {
    N5: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "百", "千", "万", "円", "口", "目", "耳", "手", "足", "力", "人", "子", "女", "男", "先", "生", "学", "校", "年", "日", "月", "火", "水", "木", "金", "土", "本", "東", "西", "南", "北", "前", "後", "上", "下", "左", "右", "中", "大", "小", "長", "高", "安", "新", "古", "多", "少", "行", "来", "友", "会", "社", "父", "母", "毎", "書", "読", "聞", "話", "見", "食", "飲", "買"],
    N4: ["会", "同", "事", "自", "社", "発", "者", "地", "業", "方", "新", "場", "員", "立", "開", "手", "代", "力", "問", "明", "京", "国", "画", "聞", "読", "書", "通", "走", "歩", "旅", "屋", "店", "物", "空", "雨", "風", "林", "森", "花", "海", "鳥", "牛", "馬", "魚", "米", "茶"],
    N3: ["情", "報", "感", "覚", "最", "初", "的", "政", "治", "経", "済", "歴", "史", "辞", "宿", "題", "寒", "暑", "薬", "医", "術", "運", "動", "転", "働", "痛", "悲", "怒", "考", "信", "想", "調", "査", "果", "戦", "争", "面", "接", "練", "習"],
    N2: ["党", "協", "総", "区", "領", "県", "設", "改", "府", "重", "委", "文", "実", "制", "基", "各", "長", "機", "演", "選", "関", "点", "権", "警", "産", "判", "項", "公", "不", "認", "市", "決", "使", "表", "主", "理", "退", "企", "姿", "管", "省", "相"],
    N1: ["氏", "統", "保", "第", "義", "宗", "球", "断", "済", "個", "害", "特", "割", "難", "補", "職", "護", "課", "論", "過", "政", "積", "適", "規", "型", "務", "構", "資", "告", "際", "模", "施", "導"],
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
          const target = allKanjis.find((k: any) => Number(k.id) === Number(kanjiId));
          if (!target) {
            setError("Karakter Kanji tidak ditemukan.");
            return;
          }
          
          setKanjiChar(target.character);
          setKanjiRomaji(target.romaji);
          setKanjiMeaning(target.meaning);
          setKanjiBushuu(target.bushuu || "");
          setKanjiOnyomi(target.onyomi || "");
          setKanjiKunyomi(target.kunyomi || "");
          setKanjiBaseMeaning(target.baseMeaning || "");

          setKanjiBorder(target.border || "border-l-4 border-primary");
          
          setNodeCoords({}); // Reset coordinates dynamically to avoid old positions
          const dbExamples = target.examples || [];
          const writeEx = dbExamples.filter((ex: any) => !ex.isReading);
          const readEx = dbExamples.filter((ex: any) => ex.isReading);
          
          setExamples(writeEx.length > 0 ? writeEx : [{ japanese: "", romaji: "", translation: "", isReading: false }]);
          setReadingExamples(readEx.length > 0 ? readEx : [{ japanese: "", romaji: "", translation: "", isReading: true }]);
          
          setJukugos(
            target.jukugos && target.jukugos.length > 0
              ? target.jukugos.map((j: any) => ({
                  word: j.word,
                  reading: j.reading,
                  meaning: j.meaning,
                  kanjiBreakdown: j.kanjiBreakdown || "",
                  explanation: j.explanation || ""
                }))
              : [{ word: "", reading: "", meaning: "", kanjiBreakdown: "", explanation: "" }]
          );
          setEtymologies(target.etymologies && target.etymologies.length > 0 ? target.etymologies : [{ character: "", romaji: "", detail: "" }]);
          
          if (target.quizData) {
            try {
              setQuizQuestions(JSON.parse(target.quizData));
            } catch (e) {
              setQuizQuestions([]);
            }
          } else {
            setQuizQuestions([]);
          }

          if (target.reflectionData) {
            try {
              setReflectionQuestions(JSON.parse(target.reflectionData));
            } catch (e) {
              setReflectionQuestions([]);
            }
          } else {
            setReflectionQuestions([]);
          }

          setNodes(target.graphNodes.length > 0 ? target.graphNodes : [{ id: "root", character: target.character, meaning: "INTI", type: "root", borderColor: "border-blue-500", isPill: false, parentPill: null }]);
          setEdges(target.graphEdges);
        } else {
          // Add mode: default initialization
          setKanjiChar("");
          setKanjiRomaji("");
          setKanjiMeaning("");
          setKanjiBushuu("");
          setKanjiOnyomi("");
          setKanjiKunyomi("");
          setKanjiBaseMeaning("");
          setNodeCoords({}); // Reset coordinates
          setExamples([{ japanese: "", romaji: "", translation: "", isReading: false }]);
          setReadingExamples([{ japanese: "", romaji: "", translation: "", isReading: true }]);
          setJukugos([{ word: "", reading: "", meaning: "", kanjiBreakdown: "", explanation: "" }]);
          setEtymologies([{ character: "", romaji: "", detail: "" }]);
          setQuizQuestions([]);
          setReflectionQuestions([
            "Apa makna dasar kanji ini yang Anda pahami?",
            "Jukugo mana yang paling mudah untuk Anda ingat? Mengapa?",
            "Apa perbedaan penggunaan antar-jukugo yang mengandung kanji ini?",
            "Cabang semantic graph mana yang menurut Anda paling mudah dipahami?",
            "Bagaimana cara Anda mengingat hubungan makna antar-jukugo yang mengandung kanji ini?"
          ]);
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

      // Dynamic spacing parameters to prevent overlaps
      const spacingX = 650;
      const startX = 220;
      const totalWidth = (bottomNodes.length - 1) * spacingX;
      const midX = bottomNodes.length > 0 ? startX + totalWidth / 2 : 440;

      // 1. Root node coord (Centered at midX)
      if (rootNode && !updated[rootNode.id]) {
        updated[rootNode.id] = { x: Math.max(startX, midX), y: 120 };
      }

      const rootX = rootNode ? (updated[rootNode.id]?.x ?? midX) : midX;

      // 2. Top nodes coords (Radicals centered above root)
      topNodes.forEach((n, idx) => {
        if (!updated[n.id]) {
          const x = topNodes.length === 1 ? rootX : rootX - ((topNodes.length - 1) / 2) * 200 + idx * 200;
          updated[n.id] = { x, y: 30 };
        }
      });

      // 3. Bottom nodes coords (Middle compound words widely spaced)
      bottomNodes.forEach((n, idx) => {
        if (!updated[n.id]) {
          const x = bottomNodes.length === 1 ? rootX : startX + idx * spacingX;
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
    setExamples((prev) => [...prev, { japanese: "", romaji: "", translation: "", isReading: false }]);
  };
  const removeExampleRow = (idx: number) => {
    setExamples((prev) => prev.filter((_, i) => i !== idx));
  };

  const addReadingExampleRow = () => {
    setReadingExamples((prev) => [...prev, { japanese: "", romaji: "", translation: "", isReading: true }]);
  };
  const removeReadingExampleRow = (idx: number) => {
    setReadingExamples((prev) => prev.filter((_, i) => i !== idx));
  };

  const addJukugoRow = () => {
    setJukugos((prev) => [...prev, { word: "", reading: "", meaning: "" }]);
  };
  const removeJukugoRow = (idx: number) => {
    setJukugos((prev) => prev.filter((_, i) => i !== idx));
  };


  const handleLinkStartOrEnd = (nodeId: string) => {
    if (linkingSourceId === null) {
      startConnection(nodeId);
    } else {
      completeConnection(nodeId);
    }
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

    const mergedExamples = [
      ...examples.filter((ex) => ex.japanese.trim() !== "").map((ex) => ({ ...ex, isReading: false })),
      ...readingExamples.filter((ex) => ex.japanese.trim() !== "").map((ex) => ({ ...ex, isReading: true }))
    ];

    const payload = {
      character: kanjiChar,
      romaji: kanjiRomaji,
      meaning: kanjiMeaning,
      bushuu: kanjiBushuu,
      onyomi: kanjiOnyomi,
      kunyomi: kanjiKunyomi,
      baseMeaning: kanjiBaseMeaning,

      isJukugo: kanjiChar.length > 1, // Automatically set based on character length
      border: kanjiBorder || null,
      moduleId,
      examples: mergedExamples,
      jukugos: jukugos.filter((j) => j.word.trim() !== "").map((j) => ({
        word: j.word,
        reading: j.reading,
        meaning: j.meaning,
        kanjiBreakdown: j.kanjiBreakdown || null,
        explanation: j.explanation || null,
      })),
      etymologies: etymologies.filter((et) => et.character.trim() !== ""),
      graphNodes: formattedNodes,
      graphEdges: formattedEdges,
      quizData: quizQuestions.length > 0 ? JSON.stringify(quizQuestions.filter(q => q.question.trim() !== "")) : null,
      reflectionData: reflectionQuestions.length > 0 ? JSON.stringify(reflectionQuestions.filter(r => r.trim() !== "")) : null,
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
          <form onSubmit={handleSaveKanji} className="flex flex-col gap-6 w-full animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
              
              {/* Kolom Kiri: Info Dasar & Etimologi */}
              <div className="flex flex-col gap-6 w-full">
                
                {/* Section 1: Basic Info */}
                <div className="bg-white border border-outline-variant/30 p-6 rounded-2xl shadow-sm flex flex-col gap-4 animate-scale-up">
                  <h4 className="font-label-lg text-label-lg font-bold border-b border-outline-variant/20 pb-1 text-primary">
                    1. Data Karakter Kanji
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                          className="absolute top-[75px] left-0 z-50 bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl p-4 rounded-2xl w-[300px] sm:w-[400px] flex flex-col gap-3 select-none"
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
                            {(["N5", "N4", "N3", "N2", "N1", "Radical"] as const).map((tab) => (
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
                          <div className="grid grid-cols-6 gap-1.5 h-[160px] overflow-y-auto pr-1 sidebar-scroll">
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
                        placeholder="Contoh: Shi"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-label-sm font-semibold text-on-surface">Arti Singkat</label>
                      <input
                        type="text"
                        value={kanjiMeaning}
                        onChange={(e) => setKanjiMeaning(e.target.value)}
                        className="bg-slate-50 border border-outline-variant/30 text-on-surface rounded-lg p-2.5 w-full focus:ring-2 focus:ring-primary outline-none"
                        placeholder="Contoh: Mencoba"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-label-sm font-semibold text-on-surface">Bushuu / Radical</label>
                      <input
                        type="text"
                        value={kanjiBushuu}
                        onChange={(e) => setKanjiBushuu(e.target.value)}
                        className="bg-slate-50 border border-outline-variant/30 text-on-surface rounded-lg p-2.5 w-full focus:ring-2 focus:ring-primary outline-none text-xs"
                        placeholder="Contoh: 言"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-label-sm font-semibold text-on-surface">Onyomi</label>
                      <input
                        type="text"
                        value={kanjiOnyomi}
                        onChange={(e) => setKanjiOnyomi(e.target.value)}
                        className="bg-slate-50 border border-outline-variant/30 text-on-surface rounded-lg p-2.5 w-full focus:ring-2 focus:ring-primary outline-none text-xs"
                        placeholder="Contoh: シ"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-label-sm font-semibold text-on-surface">Kunyomi</label>
                      <input
                        type="text"
                        value={kanjiKunyomi}
                        onChange={(e) => setKanjiKunyomi(e.target.value)}
                        className="bg-slate-50 border border-outline-variant/30 text-on-surface rounded-lg p-2.5 w-full focus:ring-2 focus:ring-primary outline-none text-xs"
                        placeholder="Contoh: ためす"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-2">
                    <label className="font-label-sm text-label-sm font-semibold text-on-surface">Makna Dasar (Lengkap)</label>
                    <textarea
                      value={kanjiBaseMeaning}
                      onChange={(e) => setKanjiBaseMeaning(e.target.value)}
                      rows={3}
                      className="bg-slate-50 border border-outline-variant/30 text-on-surface rounded-lg p-2.5 w-full focus:ring-2 focus:ring-primary outline-none text-xs leading-relaxed"
                      placeholder="Contoh: Mencoba, menguji, melakukan percobaan untuk mengetahui kemampuan, kualitas atau pun hasil (Kanjipedia)"
                    />
                  </div>
                </div>

              </div>

              {/* Kolom Kanan: Kalimat Contoh, Jukugo, Latihan Membaca */}
              <div className="flex flex-col gap-6 w-full">
                
                {/* Section 2: Contoh Kalimat */}
                <div className="bg-white border border-outline-variant/30 p-6 rounded-2xl shadow-sm flex flex-col gap-4 animate-scale-up">
                  <div className="flex justify-between items-end border-b border-outline-variant/20 pb-1">
                    <h4 className="font-label-lg text-label-lg font-bold text-primary">
                      2. Contoh Kalimat & Tata Bahasa
                    </h4>
                    <button
                      type="button"
                      onClick={addExampleRow}
                      className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-md font-bold cursor-pointer hover:bg-primary/20 border-none animate-pulse-slow"
                    >
                      + Kalimat
                    </button>
                  </div>

                  <div className="space-y-3">
                    {examples.map((ex, idx) => (
                      <div key={idx} className="flex gap-3 items-start p-3 bg-slate-50 border border-slate-100 rounded-xl animate-scale-up">
                        <div className="flex-grow grid grid-cols-1 gap-2">
                          <div className="flex flex-col gap-0.5">
                            <label className="text-[9px] uppercase font-bold text-slate-500">Bahasa Jepang</label>
                            <input
                              type="text"
                              value={ex.japanese}
                              onChange={(e) => {
                                const newEx = [...examples];
                                newEx[idx].japanese = e.target.value;
                                setExamples(newEx);
                              }}
                              className="bg-white border border-outline-variant/30 rounded-lg p-2 text-xs text-on-surface outline-none font-medium"
                              placeholder="日本語を学びます。"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col gap-0.5">
                              <label className="text-[9px] uppercase font-bold text-slate-500">Romaji</label>
                              <input
                                type="text"
                                value={ex.romaji}
                                onChange={(e) => {
                                  const newEx = [...examples];
                                  newEx[idx].romaji = e.target.value;
                                  setExamples(newEx);
                                }}
                                className="bg-white border border-outline-variant/30 rounded-lg p-2 text-xs text-on-surface outline-none"
                                placeholder="Nihongo wo manabimasu."
                              />
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <label className="text-[9px] uppercase font-bold text-slate-500">Terjemahan</label>
                              <input
                                type="text"
                                value={ex.translation}
                                onChange={(e) => {
                                  const newEx = [...examples];
                                  newEx[idx].translation = e.target.value;
                                  setExamples(newEx);
                                }}
                                className="bg-white border border-outline-variant/30 rounded-lg p-2 text-xs text-on-surface outline-none"
                                placeholder="Belajar bahasa Jepang."
                              />
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExampleRow(idx)}
                          disabled={examples.length === 1}
                          className="text-error bg-transparent hover:bg-error-container/20 p-2 rounded-lg cursor-pointer border-none mt-3 disabled:opacity-30"
                        >
                          <Icon name="delete" className="text-base block" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Daftar Jukugo */}
                <div className="bg-white border border-outline-variant/30 p-6 rounded-2xl shadow-sm flex flex-col gap-4 animate-scale-up">
                  <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
                    <h4 className="font-label-lg text-label-lg font-bold text-primary flex items-center gap-sm">
                      3. Daftar Jukugo (Kata Majemuk)
                    </h4>
                    <button
                      type="button"
                      onClick={addJukugoRow}
                      className="px-3 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-0.5"
                    >
                      <Icon name="add" className="text-xs" />
                      Jukugo
                    </button>
                  </div>

                  <div className="flex flex-col gap-3 max-h-[450px] overflow-y-auto pr-1.5 sidebar-scroll">
                    {jukugos.map((j, idx) => (
                      <div key={idx} className="flex gap-3 items-start bg-surface-container-low/40 p-4 rounded-xl border border-outline-variant/20">
                        <div className="grid grid-cols-1 gap-3 flex-grow">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                                className="bg-white border border-outline-variant/30 rounded-lg p-2 text-xs text-on-surface outline-none font-bold"
                                placeholder="試験"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] uppercase font-bold text-slate-500">Kata Hiragana</label>
                              <input
                                type="text"
                                value={j.reading}
                                onChange={(e) => {
                                  const newJ = [...jukugos];
                                  newJ[idx].reading = e.target.value;
                                  setJukugos(newJ);
                                }}
                                className="bg-white border border-outline-variant/30 rounded-lg p-2 text-xs text-on-surface outline-none"
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
                                className="bg-white border border-outline-variant/30 rounded-lg p-2 text-xs text-on-surface outline-none"
                                placeholder="Ujian"
                              />
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeJukugoRow(idx)}
                          disabled={jukugos.length === 1}
                          className="text-error bg-transparent hover:bg-error-container/20 p-2 rounded-lg cursor-pointer border-none disabled:opacity-30 mt-1"
                        >
                          <Icon name="delete" className="text-base block" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 4: e. Hubungan Makna Antar Kanji */}
                <div className="bg-white border border-outline-variant/30 p-6 rounded-2xl shadow-sm flex flex-col gap-4 animate-scale-up">
                  <div className="border-b border-outline-variant/20 pb-2 flex justify-between items-center">
                    <h4 className="font-label-lg text-label-lg font-bold text-primary flex items-center gap-2">
                      <Icon name="account_tree" className="text-primary text-base" />
                      4. e. Hubungan Makna Antar Kanji
                    </h4>
                    <button
                      type="button"
                      onClick={addJukugoRow}
                      className="px-3 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-0.5"
                    >
                      <Icon name="add" className="text-xs" />
                      Hubungan Makna
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 font-medium">
                    Isi rincian kata majemuk, hiragana, breakdown kanji penyusun, dan penjelasan hubungan makna.
                  </p>

                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1.5 sidebar-scroll">
                    {jukugos.length === 0 ? (
                      <p className="text-slate-400 text-xs italic font-medium py-3 text-center">
                        Belum ada data Hubungan Makna. Klik "+ Hubungan Makna" di atas untuk menambah.
                      </p>
                    ) : (
                      jukugos.map((j, idx) => (
                        <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-col gap-3 relative animate-scale-up">
                          {/* Card Sub-header */}
                          <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <span className="font-bold text-xs text-slate-800">
                                {j.word || `Item #${idx + 1}`}
                              </span>
                              {j.reading && (
                                <span className="text-[11px] text-slate-500">({j.reading})</span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeJukugoRow(idx)}
                              disabled={jukugos.length === 1}
                              className="text-error bg-transparent hover:bg-error-container/20 p-1.5 rounded-lg cursor-pointer border-none disabled:opacity-30"
                              title="Hapus Item"
                            >
                              <Icon name="delete" className="text-base block" />
                            </button>
                          </div>

                          {/* Row 1: Jukugo, Hiragana, & Arti */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] uppercase font-bold text-slate-500">Kata Jukugo</label>
                              <input
                                type="text"
                                value={j.word}
                                onChange={(e) => {
                                  const newJ = [...jukugos];
                                  newJ[idx].word = e.target.value;
                                  setJukugos(newJ);
                                }}
                                className="bg-white border border-outline-variant/30 rounded-lg p-2 text-xs text-on-surface outline-none font-bold"
                                placeholder="Contoh: 試験"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] uppercase font-bold text-slate-500">Kata Hiragana</label>
                              <input
                                type="text"
                                value={j.reading}
                                onChange={(e) => {
                                  const newJ = [...jukugos];
                                  newJ[idx].reading = e.target.value;
                                  setJukugos(newJ);
                                }}
                                className="bg-white border border-outline-variant/30 rounded-lg p-2 text-xs text-on-surface outline-none"
                                placeholder="Contoh: しけん"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] uppercase font-bold text-slate-500">Arti / Terjemahan</label>
                              <input
                                type="text"
                                value={j.meaning}
                                onChange={(e) => {
                                  const newJ = [...jukugos];
                                  newJ[idx].meaning = e.target.value;
                                  setJukugos(newJ);
                                }}
                                className="bg-white border border-outline-variant/30 rounded-lg p-2 text-xs text-on-surface outline-none"
                                placeholder="Contoh: Ujian"
                              />
                            </div>
                          </div>

                          {/* Row 2: Penjelasan Hubungan Makna Jukugo */}
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] uppercase font-bold text-slate-500">
                              Penjelasan Hubungan Makna Jukugo
                            </label>
                            <textarea
                              value={j.explanation || ""}
                              onChange={(e) => {
                                const newJ = [...jukugos];
                                newJ[idx].explanation = e.target.value;
                                setJukugos(newJ);
                              }}
                              rows={2}
                              className="bg-white border border-outline-variant/30 rounded-lg p-2 text-xs text-on-surface outline-none leading-relaxed"
                              placeholder="Contoh: Hubungan makna antara kanji 試 dan 験 menjadi..."
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Section 5: Latihan Membaca */}
                <div className="bg-white border border-outline-variant/30 p-6 rounded-2xl shadow-sm flex flex-col gap-4 animate-scale-up">
                  <div className="flex justify-between items-end border-b border-outline-variant/20 pb-1">
                    <h4 className="font-label-lg text-label-lg font-bold text-primary">
                      5. Latihan Membaca (Speech-to-Text)
                    </h4>
                    <button
                      type="button"
                      onClick={addReadingExampleRow}
                      className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-md font-bold cursor-pointer hover:bg-primary/20 border-none animate-pulse-slow"
                    >
                      + Latihan Baca
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1.5 sidebar-scroll">
                    {readingExamples.map((ex, idx) => (
                      <div key={idx} className="flex gap-3 items-start p-3 bg-slate-50 border border-slate-100 rounded-xl animate-scale-up">
                        <div className="flex-grow grid grid-cols-1 gap-2">
                          <div className="flex flex-col gap-0.5">
                            <label className="text-[9px] uppercase font-bold text-slate-500">Bahasa Jepang</label>
                            <input
                              type="text"
                              value={ex.japanese}
                              onChange={(e) => {
                                const newEx = [...readingExamples];
                                newEx[idx].japanese = e.target.value;
                                setReadingExamples(newEx);
                              }}
                              className="bg-white border border-outline-variant/30 rounded-lg p-2 text-xs text-on-surface outline-none font-medium"
                              placeholder="日本語を学びます。"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col gap-0.5">
                              <label className="text-[9px] uppercase font-bold text-slate-500">Romaji</label>
                              <input
                                type="text"
                                value={ex.romaji}
                                onChange={(e) => {
                                  const newEx = [...readingExamples];
                                  newEx[idx].romaji = e.target.value;
                                  setReadingExamples(newEx);
                                }}
                                className="bg-white border border-outline-variant/30 rounded-lg p-2 text-xs text-on-surface outline-none"
                                placeholder="Nihongo wo manabimasu."
                              />
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <label className="text-[9px] uppercase font-bold text-slate-500">Terjemahan</label>
                              <input
                                type="text"
                                value={ex.translation}
                                onChange={(e) => {
                                  const newEx = [...readingExamples];
                                  newEx[idx].translation = e.target.value;
                                  setReadingExamples(newEx);
                                }}
                                className="bg-white border border-outline-variant/30 rounded-lg p-2 text-xs text-on-surface outline-none"
                                placeholder="Belajar bahasa Jepang."
                              />
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeReadingExampleRow(idx)}
                          disabled={readingExamples.length === 1}
                          className="text-error bg-transparent hover:bg-error-container/20 p-2 rounded-lg cursor-pointer border-none mt-3 disabled:opacity-30"
                        >
                          <Icon name="delete" className="text-base block" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* Section 6: Daftar Kuis Evaluasi Kanji (Full Width) */}
            <div className="bg-white border border-outline-variant/30 p-6 rounded-2xl shadow-sm flex flex-col gap-6 animate-scale-up">
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
                <h4 className="font-label-lg text-label-lg font-bold text-primary flex items-center gap-sm">
                  6. Daftar Kuis Evaluasi Kanji
                </h4>
                <span className="text-xs text-slate-400 font-medium">{quizQuestions.length} soal total</span>
              </div>

              {/* Render per-type sections */}
              {[
                { type: "multiple",   label: "Pilihan Ganda (Multiple Choice)",        icon: "radio_button_checked",  color: "blue",   defaultItem: { type: "multiple",   question: "", options: ["", "", "", ""], correctAnswer: "" } },
                { type: "fill",       label: "Melengkapi Kalimat (Fill-in-the-blank)", icon: "text_fields",           color: "teal",   defaultItem: { type: "fill",       question: "", options: ["", "", "", ""], correctAnswer: "" } },
                { type: "unscramble", label: "Susun Kalimat (Unscramble)",             icon: "shuffle",               color: "orange", defaultItem: { type: "unscramble", question: "", words: [],   correctOrder: [] } },
                { type: "matching",   label: "Menjodohkan (Matching)",                 icon: "compare_arrows",        color: "purple", defaultItem: { type: "matching",   question: "", pairs: [] } },
                { type: "essay",      label: "Membuat Kalimat (Essay/Writing)",         icon: "edit_note",             color: "green",  defaultItem: { type: "essay",      question: "", targetWord: "" } },
                { type: "grouping",   label: "Pengelompokan Kata (Grouping)",           icon: "category",              color: "rose",   defaultItem: { type: "grouping",   question: "", words: [],   groups: [] } },
              ].map(({ type: sectionType, label, icon, color, defaultItem }) => {
                const colorMap: Record<string, string> = {
                  blue:   "bg-blue-50   border-blue-200   text-blue-700",
                  teal:   "bg-teal-50   border-teal-200   text-teal-700",
                  orange: "bg-orange-50 border-orange-200 text-orange-700",
                  purple: "bg-purple-50 border-purple-200 text-purple-700",
                  green:  "bg-green-50  border-green-200  text-green-700",
                  rose:   "bg-rose-50   border-rose-200   text-rose-700",
                };
                const badgeClass = colorMap[color] ?? "bg-slate-50 border-slate-200 text-slate-700";
                const questionsOfType = quizQuestions.filter(q => q.type === sectionType);
                return (
                  <div key={sectionType} className="flex flex-col gap-3">
                    {/* Sub-section Header */}
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold ${badgeClass}`}>
                        <Icon name={icon} className="text-sm" />
                        {label}
                        <span className="ml-1 opacity-60">({questionsOfType.length})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setQuizQuestions(prev => [...prev, { ...defaultItem }])}
                        className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-1"
                      >
                        <Icon name="add" className="text-xs" />
                        Tambah
                      </button>
                    </div>

                    {/* Questions of this type */}
                    {questionsOfType.length === 0 ? (
                      <div className="py-4 text-center border border-dashed border-outline-variant/30 rounded-xl text-slate-400 text-xs">
                        Belum ada soal untuk tipe ini.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {quizQuestions.map((q, idx) => {
                          if (q.type !== sectionType) return null;
                          return (
                            <div key={idx} className="flex gap-4 items-start bg-surface-container-low/40 p-5 rounded-xl border border-outline-variant/20">
                              <div className="flex-grow flex flex-col gap-3">
                                <div className="grid grid-cols-1 gap-4">
                                  <div className="flex flex-col gap-1">
                                    <label className="text-[10px] uppercase font-bold text-slate-500">Pertanyaan</label>
                                    <input
                                      type="text"
                                      value={q.question}
                                      onChange={(e) => {
                                        const newQ = [...quizQuestions];
                                        newQ[idx].question = e.target.value;
                                        setQuizQuestions(newQ);
                                      }}
                                      className="bg-white border border-outline-variant/30 rounded-lg p-2.5 text-sm text-on-surface outline-none"
                                      placeholder="Isi pertanyaan soal..."
                                    />
                                  </div>
                                </div>

                                {/* Type-specific inputs */}
                                {q.type === "matching" ? (
                                  <div className="flex flex-col gap-1">
                                    <label className="text-[10px] uppercase font-bold text-slate-500">Pasangan Pencocokan (Format: Kiri:Kanan, Pisahkan dengan koma)</label>
                                    <input
                                      type="text"
                                      value={Array.isArray(q.pairs) ? q.pairs.map((p: any) => `${p.left}:${p.right}`).join(", ") : ""}
                                      onChange={(e) => {
                                        const newQ = [...quizQuestions];
                                        newQ[idx].pairs = e.target.value.split(",").map(pairStr => {
                                          const parts = pairStr.split(":");
                                          return { left: parts[0]?.trim() || "", right: parts[1]?.trim() || "" };
                                        });
                                        setQuizQuestions(newQ);
                                      }}
                                      className="bg-white border border-outline-variant/30 rounded-lg p-2.5 text-sm text-on-surface outline-none"
                                      placeholder="試験:ujian, 受験:Mengikuti ujian"
                                    />
                                  </div>
                                ) : q.type === "grouping" ? (
                                  <div className="flex flex-col gap-1">
                                    <label className="text-[10px] uppercase font-bold text-slate-500">Kelompok &amp; Kosakata (Format: Kelompok1: kata1, kata2 | Kelompok2: kata3)</label>
                                    <textarea
                                      value={Array.isArray(q.groups) ? q.groups.map((g: any) => `${g.name}: ${(g.correctWords || []).join(", ")}`).join(" | ") : ""}
                                      onChange={(e) => {
                                        const newQ = [...quizQuestions];
                                        const parts = e.target.value.split("|");
                                        const groups: any[] = [];
                                        const allWords: string[] = [];
                                        for (const part of parts) {
                                          const subParts = part.split(":");
                                          if (subParts.length >= 2) {
                                            const name = subParts[0].trim();
                                            const correctWords = subParts[1].split(",").map((w: string) => w.trim()).filter(Boolean);
                                            groups.push({ name, correctWords });
                                            allWords.push(...correctWords);
                                          }
                                        }
                                        newQ[idx].groups = groups;
                                        newQ[idx].words = allWords;
                                        setQuizQuestions(newQ);
                                      }}
                                      className="bg-white border border-outline-variant/30 rounded-lg p-2.5 text-sm text-on-surface outline-none min-h-[80px]"
                                      placeholder="Pengujian: 試験, 受験 | Pengalaman: 経験, 体験"
                                    />
                                  </div>
                                ) : q.type === "essay" ? (
                                  <div className="flex flex-col gap-1">
                                    <label className="text-[10px] uppercase font-bold text-slate-500">Kosakata Wajib (Target Word)</label>
                                    <input
                                      type="text"
                                      value={q.targetWord || ""}
                                      onChange={(e) => {
                                        const newQ = [...quizQuestions];
                                        newQ[idx].targetWord = e.target.value;
                                        setQuizQuestions(newQ);
                                      }}
                                      className="bg-white border border-outline-variant/30 rounded-lg p-2.5 text-sm text-on-surface outline-none"
                                      placeholder="Contoh: 試着"
                                    />
                                  </div>
                                ) : q.type === "unscramble" ? (
                                  <div className="flex flex-col gap-1">
                                    <label className="text-[10px] uppercase font-bold text-slate-500">Urutan Kalimat Benar (Pisahkan dengan spasi)</label>
                                    <input
                                      type="text"
                                      value={Array.isArray(q.correctOrder) ? q.correctOrder.join(" ") : ""}
                                      onChange={(e) => {
                                        const newQ = [...quizQuestions];
                                        const words = e.target.value.split(/[\s,]+/g).filter(Boolean);
                                        newQ[idx].words = words;
                                        newQ[idx].correctOrder = words;
                                        setQuizQuestions(newQ);
                                      }}
                                      className="bg-white border border-outline-variant/30 rounded-lg p-2.5 text-sm text-on-surface outline-none"
                                      placeholder="きのう 試合 が ありました"
                                    />
                                  </div>
                                ) : (
                                  /* multiple & fill */
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                      <label className="text-[10px] uppercase font-bold text-slate-500">Pilihan Jawaban (Pisahkan dengan koma)</label>
                                      <input
                                        type="text"
                                        value={Array.isArray(q.options) ? q.options.join(", ") : ""}
                                        onChange={(e) => {
                                          const newQ = [...quizQuestions];
                                          newQ[idx].options = e.target.value.split(",").map(s => s.trim());
                                          setQuizQuestions(newQ);
                                        }}
                                        className="bg-white border border-outline-variant/30 rounded-lg p-2.5 text-sm text-on-surface outline-none"
                                        placeholder="Pilihan 1, Pilihan 2, Pilihan 3"
                                      />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <label className="text-[10px] uppercase font-bold text-slate-500">Jawaban Benar</label>
                                      <input
                                        type="text"
                                        value={q.correctAnswer}
                                        onChange={(e) => {
                                          const newQ = [...quizQuestions];
                                          newQ[idx].correctAnswer = e.target.value;
                                          setQuizQuestions(newQ);
                                        }}
                                        className="bg-white border border-outline-variant/30 rounded-lg p-2.5 text-sm text-on-surface outline-none"
                                        placeholder="Harus persis sama dengan salah satu pilihan"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => setQuizQuestions(prev => prev.filter((_, i) => i !== idx))}
                                className="text-error bg-transparent hover:bg-error-container/20 p-2.5 rounded-lg cursor-pointer border-none disabled:opacity-30 self-center"
                              >
                                <Icon name="delete" className="text-lg block" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Section 7: Peta Semantik & Hubungan Kata (Full Width) */}
            <div className="bg-white border border-outline-variant/30 p-6 rounded-2xl shadow-sm flex flex-col gap-4 w-full animate-fade-in">
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-1">
                <h4 className="font-label-lg text-label-lg font-bold text-primary flex items-center gap-sm">
                  7. Peta Semantik & Hubungan Kata
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
                            onChange={(e) => {
                              const newN = [...nodes];
                              newN[idx].character = e.target.value;
                              setNodes(newN);
                            }}
                            className="bg-white border border-outline-variant/30 rounded-lg p-2 text-xs text-on-surface outline-none font-bold"
                            placeholder="學"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase font-bold text-slate-500">Arti</label>
                          <input
                            type="text"
                            value={n.meaning}
                            onChange={(e) => {
                              const newN = [...nodes];
                              newN[idx].meaning = e.target.value;
                              setNodes(newN);
                            }}
                            className="bg-white border border-outline-variant/30 rounded-lg p-2 text-xs text-on-surface outline-none"
                            placeholder="Belajar"
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
                              setNodes(newN);
                            }}
                            className="bg-white border border-outline-variant/30 rounded-lg p-2 text-xs text-on-surface outline-none h-[34px] disabled:opacity-60"
                          >
                            <option value="root">ROOT (Karakter Ini)</option>
                            <option value="top">TOP (Radikal/Elemen pembentuk)</option>
                            <option value="bottom">BOTTOM (Kategori/Relasi)</option>
                            <option value="sub-bottom">SUB-BOTTOM (Kata gabungan kategori)</option>
                          </select>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNodeRow(idx)}
                        disabled={n.type === "root"}
                        className="text-error bg-transparent hover:bg-error-container/20 p-2 rounded-lg cursor-pointer border-none disabled:opacity-30"
                      >
                        <Icon name="delete" className="text-base block" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* VISUAL DRAG AND DROP MODE */}
              {graphEditMode === "visual" && (
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs text-on-surface-variant bg-slate-50 p-3 rounded-xl border border-slate-100 select-none">
                    <span className="flex items-center gap-1 font-semibold">
                      <Icon name="tips_and_updates" className="text-amber-500 text-sm" />
                      Drag-Drop node untuk menyusun posisi. Klik ikon Rantai (Link) pada node asal, lalu klik node tujuan untuk menghubungkan (Edge).
                    </span>
                    <button
                      type="button"
                      onClick={addNodeRow}
                      className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-bold border-none cursor-pointer flex items-center gap-0.5 transition-all"
                    >
                      <Icon name="add" className="text-xs" />
                      Tambah Node
                    </button>
                  </div>

                  <div className="relative border border-outline-variant/30 rounded-2xl bg-slate-900/5 h-[450px] overflow-hidden select-none">
                    {/* Toolbar zoom */}
                    <div className="absolute top-4 right-4 z-40 bg-white/95 backdrop-blur-md border border-slate-100 shadow-md p-1.5 rounded-xl flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setZoomScale((z) => Math.min(2, z + 0.1))}
                        className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center border-none bg-transparent cursor-pointer"
                      >
                        <Icon name="add" className="text-base text-on-surface" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setZoomScale((z) => Math.max(0.4, z - 0.1))}
                        className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center border-none bg-transparent cursor-pointer"
                      >
                        <Icon name="remove" className="text-base text-on-surface" />
                      </button>
                      <span className="text-[10px] font-bold px-2 text-slate-500 w-10 text-center">
                        {Math.round(zoomScale * 100)}%
                      </span>
                    </div>

                    <div
                      ref={containerRef}
                      className="w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
                      onMouseDown={handleCanvasMouseDown}
                      onMouseMove={handleContainerMouseMove}
                      onMouseUp={handleContainerMouseUp}
                      onMouseLeave={handleContainerMouseUp}
                      onWheel={handleCanvasWheel}
                    >
                      <div
                        className="w-full h-full relative origin-top-left"
                        style={{
                          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale})`,
                        }}
                      >
                        <svg className="absolute inset-0 w-[4000px] h-[4000px] pointer-events-none z-0">
                          {edges.map((edge, index) => {
                            const sourceCoord = nodeCoords[edge.source];
                            const targetCoord = nodeCoords[edge.target];
                            if (!sourceCoord || !targetCoord) return null;
                            const x1 = sourceCoord.x + 90;
                            const y1 = sourceCoord.y + 40;
                            const x2 = targetCoord.x + 90;
                            const y2 = targetCoord.y + 40;
                            return (
                              <line
                                key={index}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="#1e73be"
                                strokeWidth="2.5"
                                strokeDasharray={5}
                              />
                            );
                          })}
                        </svg>

                        {nodes.map((node) => {
                          const coord = nodeCoords[node.id] || { x: 100, y: 100 };
                          let nodeColorClass = "bg-white border-primary text-primary shadow-md";
                          if (node.type === "top") {
                            nodeColorClass = "bg-amber-50/80 border-amber-500 text-amber-900";
                          } else if (node.type === "bottom") {
                            nodeColorClass = "bg-sky-50/80 border-sky-500 text-sky-900";
                          } else if (node.type === "sub-bottom") {
                            nodeColorClass = "bg-emerald-50/80 border-emerald-500 text-emerald-900";
                          }
                          const isLinking = linkingSourceId === node.id;
                          return (
                            <div
                              key={node.id}
                              style={{
                                left: coord.x,
                                top: coord.y,
                                position: "absolute",
                              }}
                              className={`w-[180px] p-3 border rounded-xl flex flex-col items-center justify-between gap-1 select-none z-10 transition-shadow ${nodeColorClass} ${
                                isLinking ? "ring-4 ring-primary animate-pulse" : "hover:shadow-lg"
                              }`}
                            >
                              <div
                                className="w-full text-center cursor-move font-semibold text-xs py-1 select-none flex items-center justify-between"
                                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                              >
                                <span className="text-[9px] uppercase tracking-wider font-bold opacity-60">
                                  {node.type}
                                </span>
                                <div className="flex gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleLinkStartOrEnd(node.id)}
                                    className="p-1 hover:bg-slate-200 rounded text-slate-500 border-none bg-transparent cursor-pointer flex items-center justify-center"
                                    title="Hubungkan (Edge)"
                                  >
                                    <Icon name="link" className="text-xs" />
                                  </button>
                                  {node.type !== "root" && (
                                    <button
                                      type="button"
                                      onClick={() => removeNodeRow(nodes.findIndex((n) => n.id === node.id))}
                                      className="p-1 hover:bg-red-100 rounded text-red-500 border-none bg-transparent cursor-pointer flex items-center justify-center"
                                      title="Hapus Node"
                                    >
                                      <Icon name="close" className="text-xs" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              <input
                                type="text"
                                value={node.character}
                                onChange={(e) => {
                                  const idx = nodes.findIndex((n) => n.id === node.id);
                                  const newNodes = [...nodes];
                                  newNodes[idx].character = e.target.value;
                                  setNodes(newNodes);
                                }}
                                placeholder="Karakter"
                                className="w-full border-none bg-transparent outline-none text-center font-bold text-base text-on-surface"
                              />

                              <input
                                type="text"
                                value={node.meaning}
                                onChange={(e) => {
                                  const idx = nodes.findIndex((n) => n.id === node.id);
                                  const newNodes = [...nodes];
                                  newNodes[idx].meaning = e.target.value;
                                  setNodes(newNodes);
                                }}
                                placeholder="Arti"
                                className="w-full border-none bg-transparent outline-none text-center text-[10px] text-on-surface-variant font-medium mt-0.5"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Edge Connections Log */}
              {edges.length > 0 && (
                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                  <h5 className="text-xs font-bold text-secondary border-b border-outline-variant/10 pb-1 flex items-center gap-1">
                    <Icon name="link" className="text-primary text-sm" />
                    Koneksi Garis Hubungan Antar Simpul ({edges.length})
                  </h5>
                  <div className="flex gap-2 flex-wrap max-h-[140px] overflow-y-auto pr-1 sidebar-scroll">
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

            {/* Section 6: h. Pertanyaan Refleksi Siswa */}
            <div className="bg-white border border-outline-variant/30 p-6 rounded-2xl shadow-sm flex flex-col gap-4 animate-scale-up">
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
                <h4 className="font-label-lg text-label-lg font-bold text-primary flex items-center gap-2">
                  <Icon name="help" className="text-primary text-base" />
                  h. Pertanyaan Refleksi Siswa
                </h4>
                <button
                  type="button"
                  onClick={() => setReflectionQuestions([...reflectionQuestions, ""])}
                  className="px-3 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-0.5"
                >
                  <Icon name="add" className="text-xs" />
                  Tambah Pertanyaan
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {reflectionQuestions.map((q, qIdx) => (
                  <div key={qIdx} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                      {qIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={q}
                      onChange={(e) => {
                        const newQ = [...reflectionQuestions];
                        newQ[qIdx] = e.target.value;
                        setReflectionQuestions(newQ);
                      }}
                      className="bg-white border border-outline-variant/30 rounded-lg p-2.5 text-xs text-on-surface outline-none flex-grow"
                      placeholder={`Pertanyaan refleksi ${qIdx + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => setReflectionQuestions(reflectionQuestions.filter((_, idx) => idx !== qIdx))}
                      className="text-error bg-transparent hover:bg-error-container/20 p-2 rounded-lg cursor-pointer border-none"
                      title="Hapus Pertanyaan"
                    >
                      <Icon name="delete" className="text-base block" />
                    </button>
                  </div>
                ))}
              </div>
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
            </div></form>
        </div>
      </main>
    </Layout>
  );
};

export default KanjiFormPage;
