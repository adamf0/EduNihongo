import React, { useState, useEffect, useRef } from "react";
import Layout from "../../Common/Component/Organism/Layout";
import Icon from "../../Common/Component/Icon";
import { api } from "../../Common/Utility/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CancelButton } from "../../Common/Component/Atoms/CancelButton";
import { CancelAndReturnButton } from "../../Common/Component/Atoms/CancelAndReturnButton";
import KanjiAtlasFlow from "../../Module/Component/Atom/KanjiAtlasFlow";

const formatGroupsToText = (groupsData: any): string => {
  let parsed = groupsData;
  while (typeof parsed === "string") {
    const trimmed = parsed.trim();
    if (
      (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
      (trimmed.startsWith("{") && trimmed.endsWith("}"))
    ) {
      try {
        parsed = JSON.parse(parsed);
      } catch (e) {
        break;
      }
    } else {
      break;
    }
  }

  if (!parsed) return "";
  if (typeof parsed === "string") return parsed;

  const pairs: string[] = [];

  if (typeof parsed === "object" && !Array.isArray(parsed)) {
    for (const [catName, words] of Object.entries(parsed)) {
      const items = Array.isArray(words)
        ? words
        : typeof words === "string"
          ? [words]
          : [];
      if (catName && items.length > 0) {
        pairs.push(`${catName}: ${items.join(", ")}`);
      }
    }
  } else if (Array.isArray(parsed)) {
    for (const g of parsed) {
      if (typeof g === "string") {
        if (g) pairs.push(g);
      } else if (typeof g === "object" && g !== null) {
        if (g.name === undefined && g.category === undefined) {
          const entries = Object.entries(g);
          for (const [catName, words] of entries) {
            const items = Array.isArray(words)
              ? words
              : typeof words === "string"
                ? [words]
                : [];
            if (catName && items.length > 0) {
              pairs.push(`${catName}: ${items.join(", ")}`);
            }
          }
        } else {
          const catName = g.name || g.category || g.title || "";
          const items = Array.isArray(g.correctWords)
            ? g.correctWords
            : Array.isArray(g.items)
              ? g.items
              : Array.isArray(g.words)
                ? g.words
                : [];
          if (catName && items.length > 0) {
            pairs.push(`${catName}: ${items.join(", ")}`);
          }
        }
      }
    }
  }

  return pairs.join(" | ");
};

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
  const [actionSuccess, setActionSuccess] = useState("");
  const [moduleData, setModuleData] = useState<any>(null);

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
    const bordersList = [
      "border-l-4 border-primary",
      "border-l-4 border-secondary",
      "border-l-4 border-tertiary",
    ];
    return bordersList[Math.floor(Math.random() * bordersList.length)];
  };
  const [kanjiBorder, setKanjiBorder] = useState(getRandomBorder());

  // Form Lists
  const [examples, setExamples] = useState<any[]>([]);
  const [jukugos, setJukugos] = useState<any[]>([]);
  const [semanticRelations, setSemanticRelations] = useState<
    Array<{
      jukugoId?: number | null;
      kanji: string;
      arti: string;
      penjelasan: string;
      nodes: Array<{ jokugo: string; arti: string }>;
    }>
  >([
    {
      jukugoId: null,
      kanji: "",
      arti: "",
      penjelasan: "",
      nodes: [{ jokugo: "", arti: "" }],
    },
  ]);
  const [etymologies, setEtymologies] = useState<any[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [reflectionQuestions, setReflectionQuestions] = useState<string[]>([]);
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);

  // Virtual Keyboard state
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [keyboardTab, setKeyboardTab] = useState<
    "N5" | "N4" | "N3" | "N2" | "N1" | "Radical"
  >("N5");
  const keyboardRef = useRef<HTMLDivElement>(null);

  const kanjiLists = {
    N5: [
      "一",
      "二",
      "三",
      "四",
      "五",
      "六",
      "七",
      "八",
      "九",
      "十",
      "百",
      "千",
      "万",
      "円",
      "口",
      "目",
      "耳",
      "手",
      "足",
      "力",
      "人",
      "子",
      "女",
      "男",
      "先",
      "生",
      "学",
      "校",
      "年",
      "日",
      "月",
      "火",
      "水",
      "木",
      "金",
      "土",
      "本",
      "東",
      "西",
      "南",
      "北",
      "前",
      "後",
      "上",
      "下",
      "左",
      "右",
      "中",
      "大",
      "小",
      "長",
      "高",
      "安",
      "新",
      "古",
      "多",
      "少",
      "行",
      "来",
      "友",
      "会",
      "社",
      "父",
      "母",
      "毎",
      "書",
      "読",
      "聞",
      "話",
      "見",
      "食",
      "飲",
      "買",
    ],
    N4: [
      "会",
      "同",
      "事",
      "自",
      "社",
      "発",
      "者",
      "地",
      "業",
      "方",
      "新",
      "場",
      "員",
      "立",
      "開",
      "手",
      "代",
      "力",
      "問",
      "明",
      "京",
      "国",
      "画",
      "聞",
      "読",
      "書",
      "通",
      "走",
      "歩",
      "旅",
      "屋",
      "店",
      "物",
      "空",
      "雨",
      "風",
      "林",
      "森",
      "花",
      "海",
      "鳥",
      "牛",
      "馬",
      "魚",
      "米",
      "茶",
    ],
    N3: [
      "情",
      "報",
      "感",
      "覚",
      "最",
      "初",
      "的",
      "政",
      "治",
      "経",
      "済",
      "歴",
      "史",
      "辞",
      "宿",
      "題",
      "寒",
      "暑",
      "薬",
      "医",
      "術",
      "運",
      "動",
      "転",
      "働",
      "痛",
      "悲",
      "怒",
      "考",
      "信",
      "想",
      "調",
      "査",
      "果",
      "戦",
      "争",
      "面",
      "接",
      "練",
      "習",
    ],
    N2: [
      "党",
      "協",
      "総",
      "区",
      "領",
      "県",
      "設",
      "改",
      "府",
      "重",
      "委",
      "文",
      "実",
      "制",
      "基",
      "各",
      "長",
      "機",
      "演",
      "選",
      "関",
      "点",
      "権",
      "警",
      "産",
      "判",
      "項",
      "公",
      "不",
      "認",
      "市",
      "決",
      "使",
      "表",
      "主",
      "理",
      "退",
      "企",
      "姿",
      "管",
      "省",
      "相",
    ],
    N1: [
      "氏",
      "統",
      "保",
      "第",
      "義",
      "宗",
      "球",
      "断",
      "済",
      "個",
      "害",
      "特",
      "割",
      "難",
      "補",
      "職",
      "護",
      "課",
      "論",
      "過",
      "政",
      "積",
      "適",
      "規",
      "型",
      "務",
      "構",
      "資",
      "告",
      "際",
      "模",
      "施",
      "導",
    ],
    Radical: [
      "心",
      "門",
      "木",
      "氵",
      "扌",
      "火",
      "土",
      "女",
      "子",
      "糸",
      "言",
      "金",
      "貝",
      "車",
      "雨",
      "疒",
      "辶",
      "人",
      "口",
      "日",
      "月",
      "力",
      "手",
      "目",
      "耳",
      "足",
    ],
  };

  const handleKeyboardInput = (char: string) => {
    setKanjiChar((prev) => {
      const nextVal = prev.length < 10 ? prev + char : prev;
      setNodes((prevNodes) =>
        prevNodes.map((n) =>
          n.type === "root" ? { ...n, character: nextVal } : n,
        ),
      );
      return nextVal;
    });
  };

  const handleBackspace = () => {
    setKanjiChar((prev) => {
      const nextVal = prev.slice(0, -1);
      setNodes((prevNodes) =>
        prevNodes.map((n) =>
          n.type === "root" ? { ...n, character: nextVal } : n,
        ),
      );
      return nextVal;
    });
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        keyboardRef.current &&
        !keyboardRef.current.contains(e.target as Node)
      ) {
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



  useEffect(() => {
    const loadKanjiData = async () => {
      try {
        setLoading(true);
        setError("");

        if (moduleId) {
          try {
            const mData = await api.admin.modules.getDetail(moduleId);
            setModuleData(mData);
          } catch (e) {
            console.error("Gagal memuat detail modul:", e);
          }
        }

        if (kanjiId) {
          // Edit mode: fetch all kanjis and find the matches
          const allKanjis = await api.admin.kanjis.list();
          const target = allKanjis.find(
            (k: any) => Number(k.id) === Number(kanjiId),
          );
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

          const dbExamples = target.examples || [];

          setExamples(
            dbExamples.length > 0
              ? dbExamples
              : [
                  {
                    japanese: "",
                    romaji: "",
                    translation: "",
                    isReading: false,
                  },
                ],
          );

          setJukugos(
            target.jukugos && target.jukugos.length > 0
              ? target.jukugos.map((j: any) => ({
                  id: j.id,
                  jukugoId: j.id,
                  word: j.word,
                  reading: j.reading,
                  meaning: j.meaning,
                }))
              : [
                  {
                    id: null,
                    word: "",
                    reading: "",
                    meaning: "",
                  },
                ],
          );
          setSemanticRelations(
            target.semanticRelations && target.semanticRelations.length > 0
              ? target.semanticRelations.map((sr: any) => {
                  let parsedNodes: Array<{ jokugo: string; arti: string }> = [];
                  if (Array.isArray(sr.nodes) && sr.nodes.length > 0) {
                    parsedNodes = sr.nodes.map((n: any) => ({
                      jokugo: n.jokugo || n.jukugo || "",
                      arti: n.arti || "",
                    }));
                  } else {
                    parsedNodes = [
                      { jokugo: sr.jukugo_1 || sr.jokugo_1 || "", arti: sr.jukugo_1_arti || sr.jokugo_1_arti || "" },
                      { jokugo: sr.jukugo_2 || sr.jokugo_2 || "", arti: sr.jukugo_2_arti || sr.jokugo_2_arti || "" },
                    ].filter((n) => n.jokugo || n.arti);
                  }
                  if (parsedNodes.length === 0) {
                    parsedNodes = [{ jokugo: "", arti: "" }];
                  }

                  const matchedJukugo = sr.jukugo || (sr.jukugoId && (target.jukugos || []).find((j: any) => j.id === sr.jukugoId));

                  return {
                    jukugoId: sr.jukugoId || (matchedJukugo ? matchedJukugo.id : null),
                    kanji: matchedJukugo ? matchedJukugo.word : (sr.kanji || sr.jokugo || ""),
                    arti: matchedJukugo ? matchedJukugo.meaning : (sr.arti || ""),
                    penjelasan: sr.penjelasan || "",
                    nodes: parsedNodes,
                  };
                })
              : [
                  {
                    jukugoId: null,
                    kanji: "",
                    arti: "",
                    penjelasan: "",
                    nodes: [{ jokugo: "", arti: "" }],
                  },
                ],
          );
          setEtymologies(
            target.etymologies && target.etymologies.length > 0
              ? target.etymologies
              : [{ character: "", romaji: "", detail: "" }],
          );

          if (Array.isArray(target.quizzes) && target.quizzes.length > 0) {
            setQuizQuestions(target.quizzes);
          } else if (target.quizData) {
            try {
              setQuizQuestions(JSON.parse(target.quizData));
            } catch (e) {
              setQuizQuestions([]);
            }
          } else {
            setQuizQuestions([]);
          }

          if (target.masterRefleksi && Array.isArray(target.masterRefleksi) && target.masterRefleksi.length > 0) {
            setReflectionQuestions(target.masterRefleksi.map((mr: any) => mr.question));
          } else {
            setReflectionQuestions([]);
          }

          setNodes(
            target.graphNodes && target.graphNodes.length > 0
              ? target.graphNodes
              : [
                  {
                    id: "root",
                    character: target.character,
                    meaning: "INTI",
                    type: "root",
                    borderColor: "border-blue-500",
                    isPill: false,
                    parentPill: null,
                  },
                ],
          );
          setEdges(target.graphEdges || []);
        } else {
          // Add mode: default initialization
          setKanjiChar("");
          setKanjiRomaji("");
          setKanjiMeaning("");
          setKanjiBushuu("");
          setKanjiOnyomi("");
          setKanjiKunyomi("");
          setExamples([
            { japanese: "", romaji: "", translation: "", isReading: false },
          ]);
          setJukugos([
            {
              word: "",
              reading: "",
              meaning: "",
            },
          ]);
          setSemanticRelations([
            {
              kanji: "",
              arti: "",
              penjelasan: "",
              nodes: [{ jokugo: "", arti: "" }],
            },
          ]);
          setEtymologies([{ character: "", romaji: "", detail: "" }]);
          setQuizQuestions([]);
          setReflectionQuestions([]);
          setNodes([
            {
              id: "root",
              character: "",
              meaning: "INTI",
              type: "root",
              borderColor: "border-blue-500",
              isPill: false,
              parentPill: null,
            },
          ]);
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



  const handleCharInput = (val: string) => {
    setKanjiChar(val);
    setNodes((prev) =>
      prev.map((n) => (n.type === "root" ? { ...n, character: val } : n)),
    );
  };

  const addExampleRow = () => {
    setExamples((prev) => [
      ...prev,
      { japanese: "", romaji: "", translation: "", isReading: false },
    ]);
  };
  const removeExampleRow = (idx: number) => {
    setExamples((prev) => prev.filter((_, i) => i !== idx));
  };

  const addSemanticRelationRow = () => {
    setSemanticRelations((prev) => [
      ...prev,
      {
        jukugoId: null,
        kanji: "",
        arti: "",
        penjelasan: "",
        nodes: [{ jokugo: "", arti: "" }],
      },
    ]);
  };
  const removeSemanticRelationRow = (idx: number) => {
    setSemanticRelations((prev) => prev.filter((_, i) => i !== idx));
  };

  const addSemanticRelationNode = (srIdx: number) => {
    setSemanticRelations((prev) =>
      prev.map((sr, i) =>
        i === srIdx
          ? {
              ...sr,
              nodes: [...(sr.nodes || []), { jokugo: "", arti: "" }],
            }
          : sr
      )
    );
  };

  const removeSemanticRelationNode = (srIdx: number, nodeIdx: number) => {
    setSemanticRelations((prev) =>
      prev.map((sr, i) => {
        if (i !== srIdx) return sr;
        const newNodes = (sr.nodes || []).filter((_, nI) => nI !== nodeIdx);
        return {
          ...sr,
          nodes: newNodes.length > 0 ? newNodes : [{ jokugo: "", arti: "" }],
        };
      })
    );
  };

  const handleCancel = () => {
    if (moduleId) {
      navigate(`/admin/module-detail?id=${moduleId}`);
    } else {
      navigate("/admin/kanji");
    }
  };

  const handleSaveKanji = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kanjiChar.trim() || !kanjiRomaji.trim() || !kanjiMeaning.trim()) {
      setActionError("Karakter, romaji, dan arti wajib diisi.");
      return;
    }

    const formattedNodes = nodes.map((n) => {
      const formattedId = n.id.startsWith(kanjiChar)
        ? n.id
        : `${kanjiChar}-${n.id}`;
      return {
        ...n,
        id: formattedId,
        parentPill:
          n.parentPill && !n.parentPill.startsWith(kanjiChar)
            ? `${kanjiChar}-${n.parentPill}`
            : n.parentPill,
      };
    });

    const formattedEdges = edges.map((eg) => ({
      ...eg,
      id: eg.id.startsWith(kanjiChar) ? eg.id : `${kanjiChar}-${eg.id}`,
      source: eg.source.startsWith(kanjiChar)
        ? eg.source
        : `${kanjiChar}-${eg.source}`,
      target: eg.target.startsWith(kanjiChar)
        ? eg.target
        : `${kanjiChar}-${eg.target}`,
    }));

    const cleanExamples = examples
      .filter((ex) => ex.japanese.trim() !== "")
      .map((ex) => ({
        japanese: ex.japanese,
        romaji: ex.romaji,
        translation: ex.translation,
        isReading: false,
      }));

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
      examples: cleanExamples,
      jukugos: jukugos
        .filter((j) => j.word.trim() !== "")
        .map((j) => ({
          word: j.word,
          reading: j.reading,
          meaning: j.meaning,
        })),
      semanticRelations: semanticRelations
        .filter((sr) => sr.kanji.trim() !== "" || sr.penjelasan.trim() !== "")
        .map((sr) => ({
          kanji: sr.kanji,
          arti: sr.arti || null,
          penjelasan: sr.penjelasan || null,
          nodes: (sr.nodes || []).filter((n) => n.jokugo && n.jokugo.trim() !== ""),
        })),
      etymologies: etymologies.filter((et) => et.character.trim() !== ""),
      graphNodes: formattedNodes,
      graphEdges: formattedEdges,
      quizzes: quizQuestions.filter((q) => q.question && q.question.trim() !== ""),
      quizData:
        quizQuestions.length > 0
          ? JSON.stringify(
              quizQuestions.filter((q) => q.question && q.question.trim() !== ""),
            )
          : null,
      masterRefleksi: reflectionQuestions.filter((r) => r.trim() !== ""),
    };

    try {
      setSubmitting(true);
      setActionError("");
      setActionSuccess("");
      if (kanjiId) {
        await api.admin.kanjis.update(kanjiId, payload);
        setActionSuccess(`Berhasil memperbarui data Kanji "${kanjiChar}"!`);
        setTimeout(() => {
          setActionSuccess("");
        }, 4000);
      } else {
        await api.admin.kanjis.create(payload);
        setActionSuccess(`Berhasil membuat Kanji "${kanjiChar}" baru!`);
        setTimeout(() => {
          handleCancel();
        }, 1200);
      }
    } catch (err: any) {
      setActionError(err.message || "Gagal menyimpan kanji.");
      setTimeout(() => {
        setActionError("");
      }, 5000);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex-grow flex items-center justify-center min-h-[400px]">
          <div className="text-primary font-bold animate-pulse text-lg">
            Memuat Formulir Kanji...
          </div>
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
                {moduleId ? (
                  `Edit Module: ${
                    moduleData?.title
                      ? moduleData.title.replace(/^[^\d]*/i, "")
                      : moduleId
                  } Kanji: ${kanjiChar || "..."}`
                ) : kanjiId ? (
                  `Edit Kanji: ${kanjiChar}`
                ) : (
                  "Tambah Kanji Baru"
                )}
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Lengkapi kurikulum details, kalimat contoh, dan visualisasi graf
                hubungan simpul untuk Kanji ini.
              </p>
            </div>
            <CancelAndReturnButton onClick={handleCancel} />
          </div>

          {/* Form Error */}
          {error && (
            <div className="p-4 bg-error-container text-on-error-container border border-error/20 rounded-xl font-semibold">
              {error}
            </div>
          )}

          {/* Form Element */}
          <form
            onSubmit={handleSaveKanji}
            className="flex flex-col gap-6 w-full animate-fade-in"
          >
            {/* Form Sections */}
            <div className="flex flex-col gap-6 w-full">
                {/* Section 1: Basic Info */}
                <div className="bg-white border border-outline-variant/30 p-6 rounded-2xl shadow-sm flex flex-col gap-4 animate-scale-up h-[450px] justify-between">
                  <h4 className="font-label-lg text-label-lg font-bold border-b border-outline-variant/20 pb-1 text-primary">
                    1. Informasi Kanji
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5 relative">
                      <label className="font-label-sm text-label-sm font-semibold text-on-surface">
                        Karakter Kanji
                      </label>
                      <div className="relative flex items-center w-full">
                        <input
                          type="text"
                          value={kanjiChar}
                          onChange={(e) => handleCharInput(e.target.value)}
                          maxLength={10}
                          disabled={Boolean(moduleId)}
                          className={`${
                            moduleId ? "bg-slate-100/70 text-slate-500 cursor-not-allowed" : "bg-slate-50 text-on-surface"
                          } border border-outline-variant/30 rounded-lg p-2.5 pr-10 w-full focus:ring-2 focus:ring-primary outline-none text-center font-bold text-xl`}
                          placeholder="Contoh: 学"
                          required
                        />
                        {!moduleId && (
                          <button
                            type="button"
                            onClick={() => setShowKeyboard((prev) => !prev)}
                            className="absolute right-3 p-1 text-slate-400 hover:text-primary rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center transition-all"
                            title="Toggle Keyboard Virtual"
                          >
                            <Icon name="keyboard" className="text-xl" />
                          </button>
                        )}
                      </div>

                      {/* Virtual Keyboard Overlay */}
                      {!moduleId && showKeyboard && (
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
                                <Icon
                                  name="backspace"
                                  className="text-[10px]"
                                />
                                DEL
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowKeyboard(false)}
                                className="p-0.5 hover:bg-slate-100 rounded-full border-none bg-transparent cursor-pointer"
                              >
                                <Icon
                                  name="close"
                                  className="text-sm text-slate-400"
                                />
                              </button>
                            </div>
                          </div>

                          {/* Tabs */}
                          <div className="flex gap-1 border-b border-slate-100 pb-1">
                            {(
                              ["N5", "N4", "N3", "N2", "N1", "Radical"] as const
                            ).map((tab) => (
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
                      <label className="font-label-sm text-label-sm font-semibold text-on-surface">
                        Romaji
                      </label>
                      <input
                        type="text"
                        value={kanjiRomaji}
                        onChange={(e) => setKanjiRomaji(e.target.value)}
                        disabled={Boolean(moduleId)}
                        className={`${
                          moduleId ? "bg-slate-100/70 text-slate-500 cursor-not-allowed" : "bg-slate-50 text-on-surface"
                        } border border-outline-variant/30 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-primary outline-none`}
                        placeholder="Contoh: Shi"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-label-sm font-semibold text-on-surface">
                        Arti Singkat
                      </label>
                      <input
                        type="text"
                        value={kanjiMeaning}
                        onChange={(e) => setKanjiMeaning(e.target.value)}
                        disabled={Boolean(moduleId)}
                        className={`${
                          moduleId ? "bg-slate-100/70 text-slate-500 cursor-not-allowed" : "bg-slate-50 text-on-surface"
                        } border border-outline-variant/30 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-primary outline-none`}
                        placeholder="Contoh: Mencoba"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-label-sm font-semibold text-on-surface">
                        Bushuu
                      </label>
                      <input
                        type="text"
                        value={kanjiBushuu}
                        onChange={(e) => setKanjiBushuu(e.target.value)}
                        disabled={Boolean(moduleId)}
                        className={`${
                          moduleId ? "bg-slate-100/70 text-slate-500 cursor-not-allowed" : "bg-slate-50 text-on-surface"
                        } border border-outline-variant/30 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-primary outline-none text-xs`}
                        placeholder="Contoh: 言"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-label-sm font-semibold text-on-surface">
                        Onyomi
                      </label>
                      <input
                        type="text"
                        value={kanjiOnyomi}
                        onChange={(e) => setKanjiOnyomi(e.target.value)}
                        disabled={Boolean(moduleId)}
                        className={`${
                          moduleId ? "bg-slate-100/70 text-slate-500 cursor-not-allowed" : "bg-slate-50 text-on-surface"
                        } border border-outline-variant/30 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-primary outline-none text-xs`}
                        placeholder="Contoh: シ"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-label-sm font-semibold text-on-surface">
                        Kunyomi
                      </label>
                      <input
                        type="text"
                        value={kanjiKunyomi}
                        onChange={(e) => setKanjiKunyomi(e.target.value)}
                        disabled={Boolean(moduleId)}
                        className={`${
                          moduleId ? "bg-slate-100/70 text-slate-500 cursor-not-allowed" : "bg-slate-50 text-on-surface"
                        } border border-outline-variant/30 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-primary outline-none text-xs`}
                        placeholder="Contoh: ためす"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-2">
                    <label className="font-label-sm text-label-sm font-semibold text-on-surface">
                      Makna Dasar (Lengkap)
                    </label>
                    <textarea
                      value={kanjiBaseMeaning}
                      onChange={(e) => setKanjiBaseMeaning(e.target.value)}
                      disabled={Boolean(moduleId)}
                      rows={3}
                      className={`${
                        moduleId ? "bg-slate-100/70 text-slate-500 cursor-not-allowed" : "bg-slate-50 text-on-surface"
                      } border border-outline-variant/30 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-primary outline-none text-xs leading-relaxed`}
                      placeholder="Contoh: Mencoba, menguji, melakukan percobaan untuk mengetahui kemampuan, kualitas atau pun hasil (Kanjipedia)"
                    />
                  </div>
                </div>

                {/* Section 2: Data Jukugo & Semantik Graph (Dinamis) */}
                <div className="bg-white border border-outline-variant/30 p-6 rounded-2xl shadow-sm flex flex-col gap-4 animate-scale-up">
                  <div className="border-b border-outline-variant/20 pb-3 flex flex-wrap justify-between items-center gap-3">
                    <div>
                      <h4 className="font-label-lg text-label-lg font-bold text-primary flex items-center gap-2">
                        <Icon name="auto_graph" className="text-primary text-base" />
                        2. Semantik Graph (Dinamis)
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        Grafik Semantik Kanji dibangun secara otomatis dari relasi Kanji, Kategori, dan Kata Jukugo.
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={!kanjiId}
                      onClick={() => navigate(`/admin/jukugo?kanjiId=${kanjiId}`)}
                      className={`px-4 py-2 font-semibold text-xs rounded-xl shadow-md transition flex items-center gap-2 border-none ${
                        !kanjiId
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                          : "bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                      }`}
                      title={!kanjiId ? "Simpan kanji terlebih dahulu untuk mengelola Jukugo" : "Kelola Data Jukugo"}
                    >
                      <Icon name="open_in_new" />
                      <span>Kelola Data Jukugo</span>
                    </button>
                  </div>

                  {/* Interactive Dynamic Semantic Graph Canvas */}
                  <div className="relative h-[450px] w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
                    {nodes && nodes.length > 0 ? (
                      <KanjiAtlasFlow
                        initialRawNodes={nodes}
                        initialRawEdges={edges}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-400 font-semibold text-xs">
                        Memuat Grafik Semantik...
                      </div>
                    )}
                  </div>
                </div>

                {/* Sections 4, 5, 6, 7 (Only shown in Module context) */}
                {Boolean(moduleId) && (
                  <>
                    {/* Section 4: e. Hubungan Makna Antar Kanji */}
                    <div className="bg-white border border-outline-variant/30 p-6 rounded-2xl shadow-sm flex flex-col gap-4 animate-scale-up">
                  <div className="border-b border-outline-variant/20 pb-2 flex flex-wrap gap-2 justify-between items-center">
                    <h4 className="font-label-lg text-label-lg font-bold text-primary flex items-center gap-2">
                      <Icon
                        name="account_tree"
                        className="text-primary text-base"
                      />
                      3. Hubungan Makna Antar Kanji
                    </h4>
                    <button
                      type="button"
                      onClick={addSemanticRelationRow}
                      className="px-3 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-0.5"
                    >
                      <Icon name="add" className="text-xs" />
                      Hubungan Makna
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 font-medium">
                    Isi rincian kata majemuk, hiragana, arti, dan penjelasan hubungan makna (Tabel SemanticRelation).
                  </p>

                  <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1.5 sidebar-scroll">
                    {semanticRelations.length === 0 ? (
                      <p className="text-slate-400 text-xs italic font-medium py-3 text-center">
                        Belum ada data Hubungan Makna. Klik "+ Hubungan Makna"
                        di atas untuk menambah.
                      </p>
                    ) : (
                      semanticRelations.map((sr, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-col gap-3 relative animate-scale-up"
                        >
                          {/* Card Sub-header */}
                          <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <span className="font-bold text-xs text-slate-800">
                                {sr.kanji || `Item #${idx + 1}`}
                              </span>
                              {sr.arti && (
                                <span className="text-[11px] text-slate-500">
                                  ({sr.arti})
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeSemanticRelationRow(idx)}
                              disabled={semanticRelations.length === 1}
                              className="text-error bg-transparent hover:bg-error-container/20 p-1.5 rounded-lg cursor-pointer border-none disabled:opacity-30"
                              title="Hapus Item"
                            >
                              <Icon name="delete" className="text-base block" />
                            </button>
                          </div>

                          {/* Row 1: Relasi Jukugo ID & Arti */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] uppercase font-bold text-slate-500 flex items-center justify-between">
                                <span>PILIH KATA JUKUGO (JUKUGO ID)</span>
                                {sr.jukugoId && (
                                  <span className="text-indigo-600 font-mono text-[10px] font-extrabold bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                                    ID: #{sr.jukugoId}
                                  </span>
                                )}
                              </label>
                              {jukugos && jukugos.length > 0 ? (
                                <select
                                  value={
                                    sr.jukugoId
                                      ? String(sr.jukugoId)
                                      : (jukugos.find((j: any) => j.word && j.word === sr.kanji)?.id
                                          ? String(jukugos.find((j: any) => j.word === sr.kanji)?.id)
                                          : "")
                                  }
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const matchedJukugo = jukugos.find((j: any) => 
                                      String(j.id || j.jukugoId) === val || `word-${j.word}` === val
                                    );
                                    const selectedId = matchedJukugo && (matchedJukugo.id || matchedJukugo.jukugoId)
                                      ? Number(matchedJukugo.id || matchedJukugo.jukugoId)
                                      : (val && !isNaN(Number(val)) ? Number(val) : null);

                                    const newSR = [...semanticRelations];
                                    newSR[idx].jukugoId = selectedId;
                                    newSR[idx].kanji = matchedJukugo ? matchedJukugo.word : (newSR[idx].kanji || "");
                                    newSR[idx].arti = matchedJukugo ? matchedJukugo.meaning : (newSR[idx].arti || "");
                                    setSemanticRelations(newSR);
                                  }}
                                  className="bg-white border border-outline-variant/30 rounded-lg p-2 text-xs text-on-surface outline-none font-bold cursor-pointer hover:border-primary transition-all"
                                >
                                  <option value="">-- Pilih Kata Jukugo --</option>
                                  {jukugos.map((j: any, jIdx: number) => {
                                    const optValue = (j.id || j.jukugoId) ? String(j.id || j.jukugoId) : `word-${j.word}`;
                                    return (
                                      <option key={jIdx} value={optValue}>
                                        {j.word} ({j.meaning})
                                      </option>
                                    );
                                  })}
                                </select>
                              ) : (
                                <input
                                  type="text"
                                  value={sr.kanji}
                                  onChange={(e) => {
                                    const newSR = [...semanticRelations];
                                    newSR[idx].kanji = e.target.value;
                                    setSemanticRelations(newSR);
                                  }}
                                  className="bg-white border border-outline-variant/30 rounded-lg p-2 text-xs text-on-surface outline-none font-bold"
                                  placeholder="Contoh: 資格試験"
                                />
                              )}
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] uppercase font-bold text-slate-500">
                                ARTI / TERJEMAHAN (OTOMATIS DARI JUKUGO)
                              </label>
                              <input
                                type="text"
                                readOnly={!!sr.jukugoId}
                                value={sr.arti}
                                onChange={(e) => {
                                  if (!sr.jukugoId) {
                                    const newSR = [...semanticRelations];
                                    newSR[idx].arti = e.target.value;
                                    setSemanticRelations(newSR);
                                  }
                                }}
                                className={`border border-outline-variant/30 rounded-lg p-2 text-xs outline-none ${
                                  sr.jukugoId
                                    ? "bg-slate-100/70 text-slate-600 font-medium cursor-not-allowed"
                                    : "bg-white text-on-surface"
                                }`}
                                placeholder="Arti terisi otomatis setelah memilih Jukugo..."
                              />
                            </div>
                          </div>

                          {/* Row 2: Dynamic Kata Jukugo Fields */}
                          <div className="flex flex-col gap-3">
                            {(sr.nodes || []).map((node, nodeIdx) => (
                              <div key={nodeIdx} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                  <label className="text-[9px] uppercase font-bold text-slate-500">
                                    KATA JUKUGO {nodeIdx + 1}
                                  </label>
                                  <input
                                    type="text"
                                    value={node.jokugo || (node as any).jukugo || (node as any).word || ""}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setSemanticRelations((prev) =>
                                        prev.map((srItem, srI) =>
                                          srI === idx
                                            ? {
                                                ...srItem,
                                                nodes: srItem.nodes.map((n, nI) =>
                                                  nI === nodeIdx ? { ...n, jokugo: val } : n
                                                ),
                                              }
                                            : srItem
                                        )
                                      );
                                    }}
                                    className="bg-white border border-outline-variant/30 rounded-lg p-2 text-xs text-on-surface outline-none font-medium"
                                    placeholder={`Contoh: ${nodeIdx === 0 ? "試" : nodeIdx === 1 ? "験" : "資格"}`}
                                  />
                                </div>

                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[9px] uppercase font-bold text-slate-500">
                                      ARTI KATA JUKUGO {nodeIdx + 1}
                                    </label>
                                    {sr.nodes.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removeSemanticRelationNode(idx, nodeIdx)}
                                        className="text-error bg-transparent hover:bg-error-container/20 p-0.5 rounded cursor-pointer border-none"
                                        title={`Hapus Jukugo ${nodeIdx + 1}`}
                                      >
                                        <Icon name="delete" className="text-xs block" />
                                      </button>
                                    )}
                                  </div>
                                  <input
                                    type="text"
                                    value={node.arti || ""}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setSemanticRelations((prev) =>
                                        prev.map((srItem, srI) =>
                                          srI === idx
                                            ? {
                                                ...srItem,
                                                nodes: srItem.nodes.map((n, nI) =>
                                                  nI === nodeIdx ? { ...n, arti: val } : n
                                                ),
                                              }
                                            : srItem
                                        )
                                      );
                                    }}
                                    className="bg-white border border-outline-variant/30 rounded-lg p-2 text-xs text-on-surface outline-none"
                                    placeholder={`Contoh: ${nodeIdx === 0 ? "Menguji" : nodeIdx === 1 ? "Hasil / Verifikasi" : "Kualifikasi"}`}
                                  />
                                </div>
                              </div>
                            ))}

                            <div className="flex justify-start">
                              <button
                                type="button"
                                onClick={() => addSemanticRelationNode(idx)}
                                className="px-3 py-1.5 text-[11px] font-bold bg-primary/10 text-primary hover:bg-primary/20 rounded-lg border-none cursor-pointer flex items-center gap-1.5 transition-all"
                              >
                                <Icon name="add" className="text-sm" />
                                <span>+ Tambah Kata Jukugo</span>
                              </button>
                            </div>
                          </div>

                          {/* Row 3: Penjelasan Hubungan Makna */}
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] uppercase font-bold text-slate-500">
                              Penjelasan Hubungan Makna
                            </label>
                            <textarea
                              value={sr.penjelasan}
                              onChange={(e) => {
                                const newSR = [...semanticRelations];
                                newSR[idx].penjelasan = e.target.value;
                                setSemanticRelations(newSR);
                              }}
                              rows={2}
                              className="bg-white border border-outline-variant/30 rounded-lg p-2 text-xs text-on-surface outline-none leading-relaxed"
                              placeholder="Contoh: Hubungan makna antara 資格 dan 試験 membentuk 資格試験 yang berarti Ujian Sertifikasi."
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

            {/* Flex 4: "2. Contoh Kalimat & Tata Bahasa" */}
            <div className="bg-white border border-outline-variant/30 p-6 rounded-2xl shadow-sm flex flex-col gap-4 animate-scale-up">
              <div className="flex flex-wrap gap-2 justify-between items-end border-b border-outline-variant/20 pb-1">
                <h4 className="font-label-lg text-label-lg font-bold text-primary">
                  4. Latihan membaca
                </h4>
                <button
                  type="button"
                  onClick={addExampleRow}
                  className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-md font-bold cursor-pointer hover:bg-primary/20 border-none animate-pulse-slow"
                >
                  + Kalimat
                </button>
              </div>

              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1.5 sidebar-scroll">
                {examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 items-start p-3 bg-slate-50 border border-slate-100 rounded-xl animate-scale-up"
                  >
                    <div className="flex-grow grid grid-cols-1 gap-2">
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[9px] uppercase font-bold text-slate-500">
                          Bahasa Jepang
                        </label>
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
                          <label className="text-[9px] uppercase font-bold text-slate-500">
                            Romaji
                          </label>
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
                          <label className="text-[9px] uppercase font-bold text-slate-500">
                            Terjemahan
                          </label>
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

            {/* Flex 5: "5. Daftar Kuis Evaluasi Kanji" (Full Width) */}
            <div className="bg-white border border-outline-variant/30 p-6 rounded-2xl shadow-sm flex flex-col gap-6 animate-scale-up">
              <div className="flex flex-wrap gap-2 justify-between items-center border-b border-outline-variant/20 pb-2">
                <h4 className="font-label-lg text-label-lg font-bold text-primary flex items-center gap-sm">
                  5. Quiz
                </h4>
                <span className="text-xs text-slate-400 font-medium">
                  {quizQuestions.length} soal total
                </span>
              </div>

              {/* Render per-type sections */}
              {[
                {
                  type: "multiple",
                  label: "Pilihan Ganda (Multiple Choice)",
                  icon: "radio_button_checked",
                  color: "blue",
                  defaultItem: {
                    type: "multiple",
                    question: "",
                    options: ["", "", "", ""],
                    correctAnswer: "",
                  },
                },
                {
                  type: "fill",
                  label: "Melengkapi Kalimat (Fill-in-the-blank)",
                  icon: "text_fields",
                  color: "teal",
                  defaultItem: {
                    type: "fill",
                    question: "",
                    options: ["", "", "", ""],
                    correctAnswer: "",
                  },
                },
                {
                  type: "unscramble",
                  label: "Susun Kalimat (Unscramble)",
                  icon: "shuffle",
                  color: "orange",
                  defaultItem: {
                    type: "unscramble",
                    question: "",
                    words: [],
                    correctOrder: [],
                  },
                },
                {
                  type: "matching",
                  label: "Menjodohkan (Matching)",
                  icon: "compare_arrows",
                  color: "purple",
                  defaultItem: { type: "matching", question: "", pairs: [] },
                },
                {
                  type: "essay",
                  label: "Membuat Kalimat (Essay/Writing)",
                  icon: "edit_note",
                  color: "green",
                  defaultItem: { type: "essay", question: "", targetWord: "" },
                },
                {
                  type: "grouping",
                  label: "Pengelompokan Kata (Grouping)",
                  icon: "category",
                  color: "rose",
                  defaultItem: {
                    type: "grouping",
                    question: "",
                    words: [],
                    groups: [],
                  },
                },
              ].map(
                ({ type: sectionType, label, icon, color, defaultItem }) => {
                  const colorMap: Record<string, string> = {
                    blue: "bg-blue-50   border-blue-200   text-blue-700",
                    teal: "bg-teal-50   border-teal-200   text-teal-700",
                    orange: "bg-orange-50 border-orange-200 text-orange-700",
                    purple: "bg-purple-50 border-purple-200 text-purple-700",
                    green: "bg-green-50  border-green-200  text-green-700",
                    rose: "bg-rose-50   border-rose-200   text-rose-700",
                  };
                  const badgeClass =
                    colorMap[color] ??
                    "bg-slate-50 border-slate-200 text-slate-700";
                  const questionsOfType = quizQuestions.filter(
                    (q) => q.type === sectionType,
                  );
                  return (
                    <div key={sectionType} className="flex flex-col gap-3">
                      {/* Sub-section Header */}
                      <div className="flex flex-wrap gap-2 items-center justify-between">
                        <div
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold ${badgeClass}`}
                        >
                          <Icon name={icon} className="text-sm" />
                          {label}
                          <span className="ml-1 opacity-60">
                            ({questionsOfType.length})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setQuizQuestions((prev) => [
                              ...prev,
                              { ...defaultItem },
                            ])
                          }
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
                        <div className="flex flex-wrap gap-2 flex-col gap-3">
                          {quizQuestions.map((q, idx) => {
                            if (q.type !== sectionType) return null;
                            return (
                              <div
                                key={idx}
                                className="flex gap-4 items-start bg-surface-container-low/40 p-5 rounded-xl border border-outline-variant/20"
                              >
                                <div className="flex-grow flex flex-col gap-3">
                                  <div className="grid grid-cols-1 gap-4">
                                    <div className="flex flex-col gap-1">
                                      <label className="text-[10px] uppercase font-bold text-slate-500">
                                        Pertanyaan
                                      </label>
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
                                      <label className="text-[10px] uppercase font-bold text-slate-500">
                                        Pasangan Pencocokan (Format: Kiri:Kanan,
                                        Pisahkan dengan koma)
                                      </label>
                                      <input
                                        type="text"
                                        value={
                                          q.rawPairsText !== undefined
                                            ? q.rawPairsText
                                            : Array.isArray(q.pairs)
                                            ? q.pairs
                                                .map(
                                                  (p: any) =>
                                                    `${p.left}:${p.right}`,
                                                )
                                                .join(", ")
                                            : typeof q.pairs === "string"
                                            ? q.pairs
                                            : ""
                                        }
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          const newQ = [...quizQuestions];
                                          newQ[idx].rawPairsText = val;
                                          newQ[idx].pairs = val
                                            .split(",")
                                            .map((pairStr) => {
                                              const parts = pairStr.split(":");
                                              return {
                                                left: parts[0]?.trim() || "",
                                                right: parts[1]?.trim() || "",
                                              };
                                            });
                                          setQuizQuestions(newQ);
                                        }}
                                        className="bg-white border border-outline-variant/30 rounded-lg p-2.5 text-sm text-on-surface outline-none"
                                        placeholder="試験:ujian, 受験:Mengikuti ujian"
                                      />
                                    </div>
                                  ) : q.type === "grouping" ? (
                                    <div className="flex flex-col gap-1">
                                      <label className="text-[10px] uppercase font-bold text-slate-500">
                                        Kelompok &amp; Kosakata (Format:
                                        Kelompok1: kata1, kata2 | Kelompok2:
                                        kata3)
                                      </label>
                                      <textarea
                                        value={
                                          q.rawGroupsText !== undefined
                                            ? q.rawGroupsText
                                            : formatGroupsToText(q.groups)
                                        }
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          const newQ = [...quizQuestions];
                                          newQ[idx].rawGroupsText = val;
                                          const parts = val.split("|");
                                          const groups: any[] = [];
                                          const allWords: string[] = [];
                                          for (const part of parts) {
                                            const subParts = part.split(":");
                                            if (subParts.length >= 2) {
                                              const name = subParts[0].trim();
                                              const correctWords = subParts[1]
                                                .split(",")
                                                .map((w: string) => w.trim())
                                                .filter(Boolean);
                                              if (name && correctWords.length > 0) {
                                                groups.push({
                                                  [name]: correctWords,
                                                  name,
                                                  category: name,
                                                  correctWords,
                                                  items: correctWords,
                                                });
                                                allWords.push(...correctWords);
                                              }
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
                                      <label className="text-[10px] uppercase font-bold text-slate-500">
                                        Kosakata Wajib (Target Word)
                                      </label>
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
                                      <label className="text-[10px] uppercase font-bold text-slate-500">
                                        Urutan Kalimat Benar (Pisahkan dengan
                                        spasi)
                                      </label>
                                      <input
                                        type="text"
                                        value={
                                          Array.isArray(q.correctOrder)
                                            ? q.correctOrder.join(" ")
                                            : ""
                                        }
                                        onChange={(e) => {
                                          const newQ = [...quizQuestions];
                                          const words = e.target.value
                                            .split(/[\s,]+/g)
                                            .filter(Boolean);
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
                                        <label className="text-[10px] uppercase font-bold text-slate-500">
                                          Pilihan Jawaban (Pisahkan dengan koma)
                                        </label>
                                        <input
                                          type="text"
                                          value={
                                            Array.isArray(q.options)
                                              ? q.options.join(", ")
                                              : ""
                                          }
                                          onChange={(e) => {
                                            const newQ = [...quizQuestions];
                                            newQ[idx].options = e.target.value
                                              .split(",")
                                              .map((s) => s.trim());
                                            setQuizQuestions(newQ);
                                          }}
                                          className="bg-white border border-outline-variant/30 rounded-lg p-2.5 text-sm text-on-surface outline-none"
                                          placeholder="Pilihan 1, Pilihan 2, Pilihan 3"
                                        />
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        <label className="text-[10px] uppercase font-bold text-slate-500">
                                          Jawaban Benar
                                        </label>
                                        <input
                                          type="text"
                                          value={q.correctAnswer}
                                          onChange={(e) => {
                                            const newQ = [...quizQuestions];
                                            newQ[idx].correctAnswer =
                                              e.target.value;
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
                                  onClick={() =>
                                    setQuizQuestions((prev) =>
                                      prev.filter((_, i) => i !== idx),
                                    )
                                  }
                                  className="text-error bg-transparent hover:bg-error-container/20 p-2.5 rounded-lg cursor-pointer border-none disabled:opacity-30 self-center"
                                >
                                  <Icon
                                    name="delete"
                                    className="text-lg block"
                                  />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                },
              )}
            </div>

            {/* Section 7: Pertanyaan Refleksi Siswa */}
            <div className="bg-white border border-outline-variant/30 p-6 rounded-2xl shadow-sm flex flex-col gap-4 animate-scale-up">
              <div className="flex flex-wrap gap-2 justify-between items-center border-b border-outline-variant/20 pb-2">
                <h4 className="font-label-lg text-label-lg font-bold text-primary flex items-center gap-2">
                  <Icon name="help" className="text-primary text-base" />
                  6. Pertanyaan Refleksi
                </h4>
                <button
                  type="button"
                  onClick={() =>
                    setReflectionQuestions([...reflectionQuestions, ""])
                  }
                  className="px-3 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-0.5"
                >
                  <Icon name="add" className="text-xs" />
                  Tambah Pertanyaan
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {reflectionQuestions.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="w-full overflow-x-auto flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/60"
                  >
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
                      onClick={() =>
                        setReflectionQuestions(
                          reflectionQuestions.filter((_, idx) => idx !== qIdx),
                        )
                      }
                      className="text-error bg-transparent hover:bg-error-container/20 p-2 rounded-lg cursor-pointer border-none"
                      title="Hapus Pertanyaan"
                    >
                      <Icon name="delete" className="text-base block" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
          </div>

            {/* Floating Toast Notification */}
            {(actionSuccess || actionError) && (
              <div className="fixed top-6 right-6 z-50">
                {actionSuccess && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-body-md flex items-center gap-2 shadow-xl">
                    <span className="material-symbols-outlined select-none text-xl shrink-0">check_circle</span>
                    <span>{actionSuccess}</span>
                    <button
                      type="button"
                      onClick={() => setActionSuccess("")}
                      className="ml-auto text-emerald-600 hover:text-emerald-900 bg-transparent border-none cursor-pointer p-1"
                    >
                      <Icon name="close" className="text-base block" />
                    </button>
                  </div>
                )}

                {actionError && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-body-md flex items-center gap-2 shadow-xl">
                    <span className="material-symbols-outlined select-none text-xl shrink-0">error</span>
                    <span>{actionError}</span>
                    <button
                      type="button"
                      onClick={() => setActionError("")}
                      className="ml-auto text-rose-600 hover:text-rose-900 bg-transparent border-none cursor-pointer p-1"
                    >
                      <Icon name="close" className="text-base block" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Save Buttons */}
            <div className="flex flex-wrap gap-2 justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
              <CancelButton onClick={handleCancel} />
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
