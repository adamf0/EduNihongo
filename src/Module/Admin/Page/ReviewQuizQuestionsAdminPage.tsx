import React, { useState, useEffect, useMemo } from "react";
import Layout from "../../Common/Component/Organism/Layout";
import { api } from "../../Common/Utility/api";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Filter,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  ChevronDown,
} from "lucide-react";

export const ReviewQuizQuestionsAdminPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quiz, setQuiz] = useState<any | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  // Active section tab: "A" | "B" | "C" | "D"
  const [activeTab, setActiveTab] = useState<"A" | "B" | "C" | "D">("A");
  // Active module filter: "all" | 1..6
  const [moduleFilter, setModuleFilter] = useState<number | "all">("all");

  // Save state
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [saveError, setSaveError] = useState("");

  const loadQuizData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError("");
      setSuccessMsg("");
      setSaveError("");

      const res = await api.reviewQuiz.get(id);
      const quizDetail = res?.quiz || res;
      setQuiz(quizDetail);

      const rawQuestions = res?.questions || res?.quiz?.questions || [];
      const formatted = rawQuestions.map((q: any) => {
        let optsStr = "";
        if (Array.isArray(q.options)) {
          optsStr = q.options.join(", ");
        } else if (typeof q.options === "string") {
          try {
            const parsed = JSON.parse(q.options);
            optsStr = Array.isArray(parsed) ? parsed.join(", ") : q.options;
          } catch {
            optsStr = q.options;
          }
        }

        let wordsStr = "";
        if (Array.isArray(q.words)) {
          wordsStr = q.words.join(" ・ ");
        } else if (typeof q.words === "string") {
          try {
            const parsed = JSON.parse(q.words);
            wordsStr = Array.isArray(parsed) ? parsed.join(" ・ ") : q.words;
          } catch {
            wordsStr = q.words;
          }
        }

        let orderStr = "";
        if (Array.isArray(q.correctOrder)) {
          orderStr = q.correctOrder.join(" ");
        } else if (typeof q.correctOrder === "string") {
          try {
            const parsed = JSON.parse(q.correctOrder);
            orderStr = Array.isArray(parsed) ? parsed.join(" ") : q.correctOrder;
          } catch {
            orderStr = q.correctOrder;
          }
        }

        return {
          ...q,
          rawOptions: optsStr,
          rawWords: wordsStr,
          rawCorrectOrder: orderStr,
        };
      });
      setQuestions(formatted);
    } catch (err: any) {
      console.error("Error loading review quiz questions:", err);
      setError(err.message || "Gagal memuat daftar soal review quiz.");
      if (err.message?.includes("Token") || err.message?.includes("Akses ditolak")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizData();
  }, [id]);

  // Tab definitions matching the user's screenshots
  const tabConfigs = [
    {
      key: "A" as const,
      title: "Susun Kalimat (Unscramble)",
      defaultQuestion: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
      defaultType: "unscramble",
      badgeColor: "bg-rose-50 text-[#8f0020] border-rose-200",
      activeColor: "bg-[#8f0020] text-white border-[#8f0020]",
    },
    {
      key: "B" as const,
      title: "Pengelompokan Kata (Grouping)",
      defaultQuestion: "Pilih satu kelompok makna untuk jukugo berikut:",
      defaultType: "multiple",
      badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
      activeColor: "bg-blue-700 text-white border-blue-700",
    },
    {
      key: "C" as const,
      title: "Pilihan Ganda (Multiple Choice)",
      defaultQuestion: "Pilihlah satu arti yang paling tepat untuk jukugo berikut:",
      defaultType: "multiple",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      activeColor: "bg-amber-700 text-white border-amber-700",
    },
    {
      key: "D" as const,
      title: "Melengkapi Kalimat (Fill-in-the-blank)",
      defaultQuestion: "Pilihlah jukugo yang paling tepat untuk melengkapi kalimat berikut:",
      defaultType: "fill",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      activeColor: "bg-emerald-700 text-white border-emerald-700",
    },
  ];

  // Filter questions for active section and module filter
  const currentTabQuestions = useMemo(() => {
    return questions
      .filter((q) => q.section === activeTab)
      .filter((q) => moduleFilter === "all" || q.moduleNumber === moduleFilter);
  }, [questions, activeTab, moduleFilter]);

  // Counts for each tab
  const tabCounts = useMemo(() => {
    return {
      A: questions.filter((q) => q.section === "A").length,
      B: questions.filter((q) => q.section === "B").length,
      C: questions.filter((q) => q.section === "C").length,
      D: questions.filter((q) => q.section === "D").length,
    };
  }, [questions]);

  // Update a field in a specific question
  const updateQuestion = (qId: number, field: string, value: any) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, [field]: value } : q))
    );
  };

  // Add a new question to the active section
  const handleAddQuestion = () => {
    const activeConfig = tabConfigs.find((t) => t.key === activeTab)!;
    const sectionQuestions = questions.filter((q) => q.section === activeTab);
    const assignedModule = moduleFilter === "all" ? 1 : Number(moduleFilter);

    const newQ = {
      id: Date.now(),
      reviewQuizId: quiz?.id || Number(id),
      moduleNumber: assignedModule,
      section: activeTab,
      type: activeConfig.defaultType,
      questionNumber: sectionQuestions.length + 1,
      question: activeConfig.defaultQuestion,
      options: activeTab !== "A" ? ["Pilihan A", "Pilihan B", "Pilihan C"] : [],
      rawOptions: activeTab !== "A" ? "Pilihan A, Pilihan B, Pilihan C" : "",
      correctAnswer: activeTab === "A" ? "" : "0",
      words: activeTab === "A" ? ["kata 1", "kata 2", "kata 3"] : [],
      rawWords: activeTab === "A" ? "kata 1 ・ kata 2 ・ kata 3" : "",
      correctOrder: activeTab === "A" ? ["kata 1", "kata 2", "kata 3"] : [],
      rawCorrectOrder: activeTab === "A" ? "kata 1 kata 2 kata 3" : "",
      explanation: "",
    };

    setQuestions((prev) => [...prev, newQ]);
  };

  // Remove a question
  const handleRemoveQuestion = (qId: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus butir soal ini?")) {
      setQuestions((prev) => prev.filter((q) => q.id !== qId));
    }
  };

  // Move question up in the section
  const handleMoveUp = (currentIdxInTab: number) => {
    if (currentIdxInTab <= 0) return;
    const targetQ = currentTabQuestions[currentIdxInTab];
    const prevQ = currentTabQuestions[currentIdxInTab - 1];

    setQuestions((prev) => {
      const copy = [...prev];
      const idxA = copy.findIndex((q) => q.id === targetQ.id);
      const idxB = copy.findIndex((q) => q.id === prevQ.id);
      if (idxA !== -1 && idxB !== -1) {
        // Swap questionNumber
        const tempNum = copy[idxA].questionNumber;
        copy[idxA].questionNumber = copy[idxB].questionNumber;
        copy[idxB].questionNumber = tempNum;
        // Swap positions
        const temp = copy[idxA];
        copy[idxA] = copy[idxB];
        copy[idxB] = temp;
      }
      return copy;
    });
  };

  // Move question down in the section
  const handleMoveDown = (currentIdxInTab: number) => {
    if (currentIdxInTab >= currentTabQuestions.length - 1) return;
    const targetQ = currentTabQuestions[currentIdxInTab];
    const nextQ = currentTabQuestions[currentIdxInTab + 1];

    setQuestions((prev) => {
      const copy = [...prev];
      const idxA = copy.findIndex((q) => q.id === targetQ.id);
      const idxB = copy.findIndex((q) => q.id === nextQ.id);
      if (idxA !== -1 && idxB !== -1) {
        // Swap questionNumber
        const tempNum = copy[idxA].questionNumber;
        copy[idxA].questionNumber = copy[idxB].questionNumber;
        copy[idxB].questionNumber = tempNum;
        // Swap positions
        const temp = copy[idxA];
        copy[idxA] = copy[idxB];
        copy[idxB] = temp;
      }
      return copy;
    });
  };

  // Save all questions back to database
  const handleSaveAll = async () => {
    if (!quiz) return;
    try {
      setSaving(true);
      setSuccessMsg("");
      setSaveError("");

      const preparedQuestions = questions.map((q) => {
        let finalOptions = q.options;
        if (q.rawOptions !== undefined) {
          finalOptions = q.rawOptions
            .split(/[,、]/)
            .map((s: string) => s.trim())
            .filter(Boolean);
        }

        let finalWords = q.words;
        if (q.rawWords !== undefined) {
          finalWords = q.rawWords
            .split(/[・\s]+/)
            .map((s: string) => s.trim())
            .filter(Boolean);
        }

        let finalCorrectOrder = q.correctOrder;
        if (q.rawCorrectOrder !== undefined) {
          finalCorrectOrder = q.rawCorrectOrder
            .split(/\s+/)
            .map((s: string) => s.trim())
            .filter(Boolean);
        }

        return {
          ...q,
          options: finalOptions,
          words: finalWords,
          correctOrder: finalCorrectOrder,
        };
      });

      const payload = {
        id: quiz.id,
        judul: quiz.judul,
        peletakanSetelahModul: quiz.peletakanSetelahModul,
        deskripsi: quiz.deskripsi,
        durasiMenit: quiz.durasiMenit,
        targetScore: quiz.targetScore,
        isOpen: quiz.isOpen,
        questions: preparedQuestions,
      };

      await api.reviewQuiz.adminSave(payload);
      setSuccessMsg(`Berhasil menyimpan ${questions.length} butir soal ke database!`);
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      console.error("Error saving questions:", err);
      setSaveError(err.message || "Gagal menyimpan perubahan soal.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="w-full min-h-screen bg-slate-50/60 p-4 md:p-8 text-[#191c1e]">
        <div className="max-w-6xl mx-auto flex flex-col gap-6 pb-24">

          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => navigate("/admin/review-quiz")}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200/80 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Daftar Review Quiz</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={loadQuizData}
                disabled={loading}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200/80 hover:bg-slate-100 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Muat ulang data dari database"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Muat Ulang</span>
              </button>

              <button
                onClick={handleSaveAll}
                disabled={saving || loading}
                className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-[#8f0020] hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#8f0020]/20 flex items-center gap-2 border-none cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Menyimpan Soal..." : "Simpan Perubahan Soal"}</span>
              </button>
            </div>
          </div>

          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#8f0020] text-white text-[10px] font-black tracking-widest px-2.5 py-0.5 rounded-md uppercase">
                  BANK SOAL
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {quiz?.judul || "Review Quiz"}
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 mt-1">
                Kelola Daftar Soal Review Quiz ({questions.length} Butir)
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Seluruh data pertanyaan, potongan kata, pilihan jawaban, dan kunci jawaban tersinkronisasi langsung dengan database.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold">
                {questions.length} Soal Terdaftar di DB
              </span>
            </div>
          </div>

          {/* Alerts */}
          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-scale-up">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {saveError && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-scale-up">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Tab Navigation & Module Filter Bar */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Tabs matching screenshots */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              {tabConfigs.map((tab) => {
                const isActive = activeTab === tab.key;
                const count = tabCounts[tab.key];
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer flex items-center gap-2 ${
                      isActive
                        ? tab.activeColor + " shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{tab.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Controls: Module Filter & Add Button */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span>Modul:</span>
                <select
                  value={moduleFilter}
                  onChange={(e) =>
                    setModuleFilter(e.target.value === "all" ? "all" : Number(e.target.value))
                  }
                  className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="all">Semua Modul</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      Modul {m}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold border-none cursor-pointer flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Soal</span>
              </button>
            </div>

          </div>

          {/* Question List Container */}
          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="bg-white rounded-3xl p-16 text-center text-slate-400 font-bold border border-slate-200/80">
                <Sparkles className="w-8 h-8 text-[#8f0020] mx-auto mb-2 animate-bounce" />
                <p>Memuat butir pertanyaan dari database...</p>
              </div>
            ) : currentTabQuestions.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center text-slate-400 border border-slate-200/80">
                <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="font-extrabold text-base text-slate-700">Tidak ada soal untuk filter ini</p>
                <p className="text-xs text-slate-400 mt-1">
                  Klik tombol "+ Tambah Soal" di atas untuk menambahkan butir soal baru pada bagian ini.
                </p>
              </div>
            ) : (
              currentTabQuestions.map((q, idxInTab) => {
                const wordsValue = q.rawWords !== undefined
                  ? q.rawWords
                  : Array.isArray(q.words)
                  ? q.words.join(" ・ ")
                  : typeof q.words === "string"
                  ? q.words
                  : "";

                const correctOrderValue = q.rawCorrectOrder !== undefined
                  ? q.rawCorrectOrder
                  : Array.isArray(q.correctOrder)
                  ? q.correctOrder.join(" ")
                  : typeof q.correctOrder === "string"
                  ? q.correctOrder
                  : q.correctAnswer || "";

                const optionsValue = q.rawOptions !== undefined
                  ? q.rawOptions
                  : Array.isArray(q.options)
                  ? q.options.join(", ")
                  : typeof q.options === "string"
                  ? q.options
                  : "";

                return (
                  <div
                    key={q.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col gap-4 transition-all hover:border-slate-300"
                  >
                    {/* Card Header matching screenshots */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-xs font-black">
                          Soal #{q.questionNumber}
                        </span>
                        <div className="relative inline-flex items-center">
                          <select
                            value={q.moduleNumber || 1}
                            onChange={(e) => updateQuestion(q.id, "moduleNumber", Number(e.target.value))}
                            className="bg-rose-50 text-[#8f0020] border border-rose-200 hover:border-[#8f0020] px-2.5 py-1 rounded-lg text-xs font-bold outline-none cursor-pointer appearance-none pr-6 transition-colors shadow-2xs"
                            title="Pilih Modul (1 - 12)"
                          >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                              <option key={m} value={m} className="bg-white text-slate-800 font-bold">
                                Modul {m}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3 h-3 text-[#8f0020] pointer-events-none absolute right-1.5" />
                        </div>
                        <span className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase">
                          Tipe: {q.type}
                        </span>
                      </div>

                      {/* Action buttons: Move Up, Move Down, Delete */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveUp(idxInTab)}
                          disabled={idxInTab === 0}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed border-none bg-transparent cursor-pointer transition-all"
                          title="Geser ke atas"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveDown(idxInTab)}
                          disabled={idxInTab === currentTabQuestions.length - 1}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed border-none bg-transparent cursor-pointer transition-all"
                          title="Geser ke bawah"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(q.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border-none bg-transparent cursor-pointer transition-all ml-1"
                          title="Hapus soal ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* PERTANYAAN (matching screenshot style) */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black tracking-wider uppercase text-slate-500">
                        PERTANYAAN
                      </label>
                      <input
                        type="text"
                        value={q.question || ""}
                        onChange={(e) => updateQuestion(q.id, "question", e.target.value)}
                        placeholder="Tuliskan pertanyaan soal..."
                        className="p-3 rounded-2xl border border-slate-200 text-slate-900 text-xs font-semibold focus:border-[#8f0020] outline-none transition-colors"
                      />
                    </div>

                    {/* SECTION A: Unscramble Inputs (matching Screenshot 3) */}
                    {q.section === "A" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black tracking-wider uppercase text-slate-500">
                            URUTAN KATA PERTANYAAN (PISAHKAN DENGAN SPASI ATAU ・)
                          </label>
                          <input
                            type="text"
                            value={wordsValue}
                            onChange={(e) => updateQuestion(q.id, "rawWords", e.target.value)}
                            placeholder="Contoh: ありました ・ 試合 ・ きのう ・ が"
                            className="p-3 rounded-2xl border border-slate-200 text-slate-900 text-xs font-semibold focus:border-[#8f0020] outline-none transition-colors"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black tracking-wider uppercase text-slate-500">
                            URUTAN KALIMAT BENAR (PISAHKAN DENGAN SPASI)
                          </label>
                          <input
                            type="text"
                            value={correctOrderValue}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateQuestion(q.id, "rawCorrectOrder", val);
                              updateQuestion(q.id, "correctAnswer", val.replace(/\s+/g, ""));
                            }}
                            placeholder="Contoh: きのう 試合 が ありました"
                            className="p-3 rounded-2xl border border-slate-200 text-slate-900 text-xs font-semibold focus:border-[#8f0020] outline-none transition-colors"
                          />
                        </div>
                      </div>
                    )}

                    {/* SECTION B, C, D: Options & Correct Answer (matching Screenshots 1, 2, 4) */}
                    {q.section !== "A" && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 flex flex-col gap-1.5">
                          <label className="text-[10px] font-black tracking-wider uppercase text-slate-500">
                            PILIHAN JAWABAN (PISAHKAN DENGAN KOMA)
                          </label>
                          <input
                            type="text"
                            value={optionsValue}
                            onChange={(e) => updateQuestion(q.id, "rawOptions", e.target.value)}
                            placeholder="Contoh: 試験, 試食, 試着"
                            className="p-3 rounded-2xl border border-slate-200 text-slate-900 text-xs font-semibold focus:border-[#8f0020] outline-none transition-colors"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black tracking-wider uppercase text-slate-500">
                            JAWABAN BENAR (INDEX 0..N ATAU TEKS)
                          </label>
                          <input
                            type="text"
                            value={q.correctAnswer ?? ""}
                            onChange={(e) => updateQuestion(q.id, "correctAnswer", e.target.value)}
                            placeholder="Contoh: 0 atau A"
                            className="p-3 rounded-2xl border border-slate-200 text-slate-900 text-xs font-semibold focus:border-[#8f0020] outline-none transition-colors"
                          />
                        </div>
                      </div>
                    )}

                    {/* Penjelasan / Catatan Kunci Jawaban */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black tracking-wider uppercase text-slate-400">
                        CATATAN / PENJELASAN KUNCI JAWABAN (OPSIONAL)
                      </label>
                      <input
                        type="text"
                        value={q.explanation || ""}
                        onChange={(e) => updateQuestion(q.id, "explanation", e.target.value)}
                        placeholder="Catatan untuk dosen atau penjelasan saat ulasan..."
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs focus:border-[#8f0020] outline-none"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Sticky Bottom Bar */}
          <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-8 max-w-6xl mx-auto z-30">
            <div className="bg-white/95 backdrop-blur-xl border border-slate-200 p-4 rounded-2xl shadow-xl flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-600">
                Total {questions.length} butir soal terdaftar ({currentTabQuestions.length} tampil pada filter ini)
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/admin/review-quiz")}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border-none cursor-pointer transition-all"
                >
                  Kembali
                </button>

                <button
                  type="button"
                  onClick={handleSaveAll}
                  disabled={saving || loading}
                  className="px-6 py-2 rounded-xl text-xs font-black text-white bg-[#8f0020] hover:brightness-110 active:scale-95 border-none cursor-pointer shadow-md shadow-[#8f0020]/20 flex items-center gap-2 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Menyimpan Soal..." : "Simpan Perubahan Soal"}</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default ReviewQuizQuestionsAdminPage;
