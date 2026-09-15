import React, { useState, useEffect, useCallback, useMemo } from "react";
import Icon from "../../Common/Component/Icon";
import { api } from "../../Common/Utility/api";
import RotationLearningChart, { type StudentRotationItem } from "./RotationLearningChart";

interface QuizReportSummary {
  totalAttempts: number;
  activeUsersCount: number;
  avgAttemptScore: number;
  avgMaxScore: number;
  modelAverages: {
    modelA: number;
    modelB: number;
    modelC: number;
    modelD: number;
  };
  distribution: {
    sangatBaik: number;
    baik: number;
    cukup: number;
    perluPenguatan: number;
  };
}

interface AttemptHistoryItem {
  id: number;
  attemptNumber?: number;
  date: string;
  totalScore: number;
  scoreModelA: number | null;
  rawModelA?: number | null;
  maxModelA?: number | null;
  scoreModelB: number | null;
  rawModelB?: number | null;
  maxModelB?: number | null;
  scoreModelC: number | null;
  rawModelC?: number | null;
  maxModelC?: number | null;
  scoreModelD: number | null;
  rawModelD?: number | null;
  maxModelD?: number | null;
  isBestAttempt?: boolean;
  interpretation?: string;
  details?: string | null;
}

interface RecapItem {
  userId: number;
  userName: string;
  userEmail: string;
  userAvatar: string;
  kanjiId: number;
  kanjiChar: string;
  kanjiRomaji: string;
  kanjiMeaning: string;
  moduleTitle: string;
  attemptsCount: number;
  maxScore: number;
  avgScore: number;
  scoreModelA: number | null;
  scoreModelB: number | null;
  scoreModelC: number | null;
  scoreModelD: number | null;
  lastPracticed: string;
  interpretation: "Sangat Baik" | "Baik" | "Cukup" | "Perlu Penguatan" | string;
  attemptsHistory: AttemptHistoryItem[];
}

// Standard 30 module kanjis (strictly 5 kanji per module for Modul 1 - 6)
export const MODULE_TARGET_KANJIS_CONFIG = [
  {
    moduleName: "Modul 1",
    kanjis: [
      { char: "試", romaji: "shi" },
      { char: "験", romaji: "ken" },
      { char: "問", romaji: "mon" },
      { char: "題", romaji: "dai" },
      { char: "答", romaji: "tou" },
    ],
  },
  {
    moduleName: "Modul 2",
    kanjis: [
      { char: "研", romaji: "ken" },
      { char: "究", romaji: "kyuu" },
      { char: "調", romaji: "chou" },
      { char: "査", romaji: "sa" },
      { char: "集", romaji: "shuu" },
    ],
  },
  {
    moduleName: "Modul 3",
    kanjis: [
      { char: "伝", romaji: "den" },
      { char: "信", romaji: "shin" },
      { char: "報", romaji: "hou" },
      { char: "情", romaji: "jou" },
      { char: "送", romaji: "sou" },
    ],
  },
  {
    moduleName: "Modul 4",
    kanjis: [
      { char: "務", romaji: "mu" },
      { char: "商", romaji: "shou" },
      { char: "業", romaji: "gyou" },
      { char: "職", romaji: "shoku" },
      { char: "術", romaji: "jutsu" },
    ],
  },
  {
    moduleName: "Modul 5",
    kanjis: [
      { char: "意", romaji: "i" },
      { char: "討", romaji: "tou" },
      { char: "談", romaji: "dan" },
      { char: "論", romaji: "ron" },
      { char: "議", romaji: "gi" },
    ],
  },
  {
    moduleName: "Modul 6",
    kanjis: [
      { char: "史", romaji: "shi" },
      { char: "始", romaji: "shi" },
      { char: "期", romaji: "ki" },
      { char: "歴", romaji: "reki" },
      { char: "経", romaji: "kei" },
    ],
  },
];

export const ALL_MODULE_KANJIS = new Set(
  MODULE_TARGET_KANJIS_CONFIG.flatMap((m) => m.kanjis.map((k) => k.char))
);

export const AdminQuizRubricReport: React.FC = () => {
  // Filter States
  const [datePreset, setDatePreset] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");
  const [selectedKanjiId, setSelectedKanjiId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Data States
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [summary, setSummary] = useState<QuizReportSummary | null>(null);
  const [recapTable, setRecapTable] = useState<RecapItem[]>([]);
  const [moduleOptions, setModuleOptions] = useState<Array<{ id: number; title: string }>>([]);
  const [kanjiOptions, setKanjiOptions] = useState<Array<{ id: number; character: string; romaji: string; moduleId?: number; moduleTitle?: string }>>([]);

  // Analytics States
  const [rotationItems, setRotationItems] = useState<StudentRotationItem[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState<boolean>(true);

  // Modal State for Attempt History
  const [selectedRecapItem, setSelectedRecapItem] = useState<RecapItem | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [expandedAttemptId, setExpandedAttemptId] = useState<number | null>(null);
  // Table Specific Filters: Nama Mahasiswa, Kanji Target, Interpretasi
  const [tableFilterNama, setTableFilterNama] = useState<string>("");
  const [tableFilterKanji, setTableFilterKanji] = useState<string>("");
  const [tableFilterInterpretasi, setTableFilterInterpretasi] = useState<string>("");

  // Computed list of target module kanjis grouped by module (strictly 5 kanji per module)
  const availableKanjiList = useMemo(() => {
    const kanjiOptionMap = new Map<string, { id?: number; romaji?: string; moduleTitle?: string }>();
    if (kanjiOptions && kanjiOptions.length > 0) {
      kanjiOptions.forEach((k: any) => {
        if (k.character) {
          kanjiOptionMap.set(k.character, {
            id: k.id,
            romaji: k.romaji || "",
            moduleTitle: k.moduleTitle || "",
          });
        }
      });
    }

    return MODULE_TARGET_KANJIS_CONFIG.map((group) => ({
      moduleName: group.moduleName,
      kanjis: group.kanjis.map((k) => {
        const option = kanjiOptionMap.get(k.char);
        return {
          id: option?.id,
          char: k.char,
          romaji: option?.romaji || k.romaji,
          moduleTitle: option?.moduleTitle || group.moduleName,
        };
      }),
    }));
  }, [kanjiOptions]);

  // Computed filtered recap table based on Nama, Kanji, and Interpretasi filters
  const filteredRecapTable = useMemo(() => {
    return recapTable.filter((item) => {
      // 0. Ensure strictly only the 30 module kanjis (5 kanjis per module) are included
      if (!ALL_MODULE_KANJIS.has(item.kanjiChar)) {
        return false;
      }

      // 1. Filter Nama Mahasiswa / Email
      if (tableFilterNama.trim()) {
        const query = tableFilterNama.toLowerCase().trim();
        const matchName = (item.userName || "").toLowerCase().includes(query);
        const matchEmail = (item.userEmail || "").toLowerCase().includes(query);
        if (!matchName && !matchEmail) return false;
      }

      // 2. Filter Kanji Target
      if (tableFilterKanji) {
        if (item.kanjiChar !== tableFilterKanji && String(item.kanjiId) !== tableFilterKanji) {
          return false;
        }
      }

      // 3. Filter Interpretasi
      if (tableFilterInterpretasi) {
        if (item.interpretation !== tableFilterInterpretasi) {
          return false;
        }
      }

      return true;
    });
  }, [recapTable, tableFilterNama, tableFilterKanji, tableFilterInterpretasi]);

  // Set preset dates helper
  const handlePresetChange = (preset: string) => {
    setDatePreset(preset);
    const now = new Date();

    if (preset === "7d") {
      const past = new Date();
      past.setDate(now.getDate() - 7);
      setStartDate(past.toISOString().slice(0, 10));
      setEndDate(now.toISOString().slice(0, 10));
    } else if (preset === "30d") {
      const past = new Date();
      past.setDate(now.getDate() - 30);
      setStartDate(past.toISOString().slice(0, 10));
      setEndDate(now.toISOString().slice(0, 10));
    } else if (preset === "month") {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      setStartDate(firstDay.toISOString().slice(0, 10));
      setEndDate(now.toISOString().slice(0, 10));
    } else if (preset === "all") {
      setStartDate("");
      setEndDate("");
    }
  };

  // Set default preset on mount
  useEffect(() => {
    handlePresetChange("all");
  }, []);

  // Fetch Report & Analytics Data from API
  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.admin.getQuizRubricReport({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        moduleId: selectedModuleId ? Number(selectedModuleId) : undefined,
        kanjiId: selectedKanjiId ? Number(selectedKanjiId) : undefined,
        search: searchQuery || undefined,
      });

      setSummary(res.summary);
      const validTable = (res.recapTable || []).filter((item: RecapItem) =>
        ALL_MODULE_KANJIS.has(item.kanjiChar)
      );
      setRecapTable(validTable);
      setModuleOptions(res.moduleOptions || []);
      const validOptions = (res.kanjiOptions || []).filter((k: any) =>
        ALL_MODULE_KANJIS.has(k.character)
      );
      setKanjiOptions(validOptions);
    } catch (err: any) {
      console.error("Gagal memuat pelaporan rubrik kuis:", err);
      setError(err.message || "Gagal memuat pelaporan kuis.");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, selectedModuleId, selectedKanjiId, searchQuery]);

  const fetchAnalytics = useCallback(async () => {
    try {
      setAnalyticsLoading(true);
      const res = await api.admin.getLearningAnalytics({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        moduleId: selectedModuleId ? Number(selectedModuleId) : undefined,
        kanjiId: selectedKanjiId ? Number(selectedKanjiId) : undefined,
        search: searchQuery || undefined,
      });
      setRotationItems(res.rotationAnalytics || []);
    } catch (err: any) {
      console.error("Gagal memuat analitik rotation learning:", err);
    } finally {
      setAnalyticsLoading(false);
    }
  }, [startDate, endDate, selectedModuleId, selectedKanjiId, searchQuery]);

  useEffect(() => {
    fetchReport();
    fetchAnalytics();
  }, [fetchReport, fetchAnalytics]);

  // Export Table to CSV
  const handleExportCSV = () => {
    const dataToExport = filteredRecapTable.length > 0 ? filteredRecapTable : recapTable;
    if (dataToExport.length === 0) {
      alert("Tidak ada data rekap nilai untuk diunduh.");
      return;
    }

    const headers = [
      "Nama Mahasiswa",
      "Email",
      "Kanji Target",
      "Romaji",
      "Modul",
      "Model A (Unscramble)",
      "Model B (Grouping)",
      "Model C (Meaning)",
      "Model D (Sentence Context)",
      "Nilai Tertinggi (Max)",
      "Nilai Rata-rata (Avg)",
      "Jumlah Percobaan",
      "Tanggal Terakhir",
      "Interpretasi",
    ];

    const rows = dataToExport.map((item) => [
      `"${item.userName.replace(/"/g, '""')}"`,
      `"${item.userEmail.replace(/"/g, '""')}"`,
      `"${item.kanjiChar}"`,
      `"${item.kanjiRomaji}"`,
      `"${item.moduleTitle.replace(/"/g, '""')}"`,
      item.scoreModelA !== null ? item.scoreModelA : "-",
      item.scoreModelB !== null ? item.scoreModelB : "-",
      item.scoreModelC !== null ? item.scoreModelC : "-",
      item.scoreModelD !== null ? item.scoreModelD : "-",
      item.maxScore,
      item.avgScore,
      item.attemptsCount,
      `"${new Date(item.lastPracticed).toLocaleDateString("id-ID")}"`,
      `"${item.interpretation}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_Nilai_Kuis_Model_A-D_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getInterpretationBadge = (interp: string) => {
    switch (interp) {
      case "Sangat Baik":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Baik":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Cukup":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-rose-100 text-rose-800 border-rose-300";
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full select-none">
      {/* 1. Rubrik Overview & Pedoman Info Card (Placed directly under main header) */}
      <div className="bg-gradient-to-br from-[#8f0020] to-[#5b0014] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none">
          <Icon name="analytics" className="text-9xl" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-white uppercase tracking-wider">
                Pedoman Penskoran Kuis Model A-D
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Icon name="assessment" className="text-white text-3xl" />
              Pelaporan Rubrik & Analytics Hasil Kuis
            </h2>
            <p className="text-white/80 text-sm mt-1 max-w-3xl">
              Memantau perkembangan kuis mahasiswa berdasarkan 4 Model Kuis (Model A: Menyusun Kalimat, Model B: Grouping Semantic Graph, Model C: Deskripsi Makna, Model D: Konteks Kalimat). Kuis dapat dilakukan berkali-kali, nilai tertinggi diambil untuk batas ketuntasan belajar, dan riwayat percobaan tersimpan lengkap.
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#8f0020] rounded-xl font-bold text-sm hover:bg-slate-100 active:scale-95 transition-all shadow-md cursor-pointer border-none"
          >
            <Icon name="download" className="text-lg" />
            Ekspor CSV Rekap
          </button>
        </div>

        {/* Model Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-white/20 text-xs">
          <div className="bg-white/10 rounded-lg p-3">
            <span className="font-bold block text-white">Model A (Sentence Unscramble)</span>
            <span className="text-white/80 text-[11px]">Rubrik analitik 0–4 per butir</span>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <span className="font-bold block text-white">Model B (Semantic Graph)</span>
            <span className="text-white/80 text-[11px]">Benar = 1, Salah = 0 per jukugo</span>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <span className="font-bold block text-white">Model C (Deskripsi Makna)</span>
            <span className="text-white/80 text-[11px]">Dikotomis 1/0 per butir</span>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <span className="font-bold block text-white">Model D (Konteks Kalimat)</span>
            <span className="text-white/80 text-[11px]">Dikotomis 1/0 per butir</span>
          </div>
        </div>
      </div>

      {/* 2. Date Range & Filter Controls */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/20 pb-4">
          <div className="flex items-center gap-2">
            <Icon name="filter_alt" className="text-primary text-xl" />
            <h3 className="font-bold text-on-surface text-base">Filter Range Tanggal & Parameter</h3>
          </div>
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {[
              { id: "7d", label: "7 Hari" },
              { id: "30d", label: "30 Hari" },
              { id: "month", label: "Bulan Ini" },
              { id: "all", label: "Semua Waktu" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => handlePresetChange(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border-none cursor-pointer ${
                  datePreset === p.id
                    ? "bg-[#8f0020] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Start Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Dari Tanggal</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setDatePreset("custom");
              }}
              className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#8f0020]"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Sampai Tanggal</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setDatePreset("custom");
              }}
              className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#8f0020]"
            />
          </div>

          {/* Module Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Modul Pembelajaran</label>
            <select
              value={selectedModuleId}
              onChange={(e) => setSelectedModuleId(e.target.value)}
              className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#8f0020] bg-white"
            >
              <option value="">Semua Modul</option>
              {moduleOptions.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          {/* Kanji Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Kanji Target</label>
            <select
              value={selectedKanjiId}
              onChange={(e) => setSelectedKanjiId(e.target.value)}
              className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#8f0020] bg-white"
            >
              <option value="">Semua Kanji (5 Kanji Per Modul)</option>
              {availableKanjiList.map((group) => (
                <optgroup key={group.moduleName} label={`— ${group.moduleName} —`}>
                  {group.kanjis.map((k) => (
                    <option key={k.char} value={k.id ? String(k.id) : k.char}>
                      {k.char} {k.romaji ? `(${k.romaji})` : ""}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Search Query */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Cari Mahasiswa</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nama / Email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 pl-8 rounded-xl border border-slate-300 focus:outline-none focus:border-[#8f0020]"
              />
              <Icon name="search" className="absolute left-2.5 top-2.5 text-slate-400 text-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Metrik Rotation Learning Pengguna (RRG 4-Kuadran) */}
      {/* <RotationLearningChart items={rotationItems} loading={analyticsLoading} /> */}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-semibold text-sm">
          {error}
        </div>
      )}

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Percobaan</p>
            <h4 className="text-2xl font-bold text-on-surface mt-1">
              {summary ? summary.totalAttempts : 0} <span className="text-xs font-semibold text-slate-400">kali</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-1">Frekuensi submit kuis</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
            <Icon name="touch_app" className="text-2xl" />
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mahasiswa Aktif</p>
            <h4 className="text-2xl font-bold text-on-surface mt-1">
              {summary ? summary.activeUsersCount : 0} <span className="text-xs font-semibold text-slate-400">orang</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-1">Mengikuti kuis di periode</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
            <Icon name="people" className="text-2xl" />
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rata-Rata Nilai Kuis</p>
            <h4 className="text-2xl font-bold text-emerald-600 mt-1">
              {summary ? summary.avgMaxScore : 0}%
            </h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Rata-rata percobaan: <span className="font-bold text-slate-600">{summary ? summary.avgAttemptScore : 0}%</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
            <Icon name="insights" className="text-2xl" />
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kategori Sangat Baik</p>
            <h4 className="text-2xl font-bold text-[#8f0020] mt-1">
              {summary ? summary.distribution.sangatBaik : 0} <span className="text-xs font-semibold text-slate-400">siswa</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-1">Nilai $\ge 86$ (Tuntas Sangat Baik)</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-[#8f0020] flex items-center justify-center">
            <Icon name="verified" className="text-2xl" />
          </div>
        </div>
      </div>

      {/* Model Performance Breakdown Cards */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-3">
          <Icon name="grid_view" className="text-[#8f0020] text-xl" />
          <h3 className="font-bold text-on-surface text-base">Rata-Rata Capaian Per Model Kuis (Model A - D)</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-600 uppercase">Model A (Unscramble)</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-slate-800">
                {summary?.modelAverages.modelA ?? 0}%
              </span>
              <span className="text-[11px] font-semibold text-slate-400">Rubrik 0-4</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Menyusun kata menjadi kalimat yang tepat</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-600 uppercase">Model B (Semantic Graph)</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-slate-800">
                {summary?.modelAverages.modelB ?? 0}%
              </span>
              <span className="text-[11px] font-semibold text-slate-400">Per Jukugo</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Mengelompokkan jukugo ke dalam semantic graph</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-600 uppercase">Model C (Deskripsi Makna)</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-slate-800">
                {summary?.modelAverages.modelC ?? 0}%
              </span>
              <span className="text-[11px] font-semibold text-slate-400">Dikotomis 1/0</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Memilih jukugo berdasarkan deskripsi makna</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-600 uppercase">Model D (Konteks Kalimat)</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-slate-800">
                {summary?.modelAverages.modelD ?? 0}%
              </span>
              <span className="text-[11px] font-semibold text-slate-400">Dikotomis 1/0</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Memilih jukugo untuk melengkapi kalimat</p>
          </div>
        </div>
      </div>

      {/* Recap Table (Contoh Lembar Rekap Nilai per Kanji) */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        {/* Header Title & Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/20 pb-3">
          <div>
            <h3 className="font-bold text-on-surface text-base flex items-center gap-2">
              <Icon name="table_chart" className="text-[#8f0020] text-xl" />
              Tabel Rekapitulasi Nilai Kuis per Kanji (Bagian H & I Rubrik)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Menampilkan nilai tertinggi (diambil untuk batas ketuntasan), rata-rata, dan perincian nilai Model A-D.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap self-start sm:self-auto bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/60">
            Total: <strong className="text-slate-800">{filteredRecapTable.length}</strong> entri
            {filteredRecapTable.length !== recapTable.length && (
              <span className="text-slate-400"> (dari {recapTable.length})</span>
            )}
          </span>
        </div>

        {/* Toolbar Filter: Nama Mahasiswa, Kanji Target, dan Interpretasi */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/70">
          {/* 1. Filter Nama Mahasiswa */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Filter Nama Mahasiswa
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari nama atau email..."
                value={tableFilterNama}
                onChange={(e) => setTableFilterNama(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 pl-8 pr-7 rounded-xl border border-slate-300 focus:outline-none focus:border-[#8f0020] bg-white transition-all shadow-2xs"
              />
              <Icon name="search" className="absolute left-2.5 top-2.5 text-slate-400 text-sm" />
              {tableFilterNama && (
                <button
                  type="button"
                  onClick={() => setTableFilterNama("")}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer p-0"
                >
                  <Icon name="close" className="text-sm" />
                </button>
              )}
            </div>
          </div>

          {/* 2. Filter Kanji Target */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Filter Kanji Target
            </label>
            <select
              value={tableFilterKanji}
              onChange={(e) => setTableFilterKanji(e.target.value)}
              className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#8f0020] bg-white transition-all shadow-2xs cursor-pointer"
            >
              <option value="">Semua Kanji Target (5 Kanji Per Modul)</option>
              {availableKanjiList.map((group) => (
                <optgroup key={group.moduleName} label={`— ${group.moduleName} —`}>
                  {group.kanjis.map((k) => (
                    <option key={k.char} value={k.char}>
                      {k.char} {k.romaji ? `(${k.romaji})` : ""}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* 3. Filter Interpretasi */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Filter Interpretasi
            </label>
            <div className="flex items-center gap-2">
              <select
                value={tableFilterInterpretasi}
                onChange={(e) => setTableFilterInterpretasi(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#8f0020] bg-white transition-all shadow-2xs cursor-pointer"
              >
                <option value="">Semua Interpretasi</option>
                <option value="Sangat Baik">Sangat Baik (≥ 86%)</option>
                <option value="Baik">Baik (76% - 85%)</option>
                <option value="Cukup">Cukup (66% - 75%)</option>
                <option value="Perlu Penguatan">Perlu Penguatan (&lt; 66%)</option>
              </select>

              {(tableFilterNama || tableFilterKanji || tableFilterInterpretasi) && (
                <button
                  type="button"
                  onClick={() => {
                    setTableFilterNama("");
                    setTableFilterKanji("");
                    setTableFilterInterpretasi("");
                  }}
                  className="px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-all shrink-0 cursor-pointer flex items-center gap-1"
                  title="Reset Semua Filter Tabel"
                >
                  <Icon name="refresh" className="text-xs" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-[#8f0020] font-bold animate-pulse">
            Memuat data rekapitulasi kuis...
          </div>
        ) : filteredRecapTable.length === 0 ? (
          <div className="p-12 text-center text-slate-400 italic text-sm flex flex-col items-center justify-center gap-2">
            <span>Tidak ditemukan data kuis pada filter yang dipilih.</span>
            {(tableFilterNama || tableFilterKanji || tableFilterInterpretasi) && (
              <button
                type="button"
                onClick={() => {
                  setTableFilterNama("");
                  setTableFilterKanji("");
                  setTableFilterInterpretasi("");
                }}
                className="mt-1 px-4 py-1.5 text-xs font-bold text-[#8f0020] bg-[#8f0020]/10 hover:bg-[#8f0020]/20 rounded-lg border border-[#8f0020]/20 transition-all cursor-pointer"
              >
                Reset Filter Tabel
              </button>
            )}
          </div>
        ) : (
          <div>
            {/* Mobile swipe hint */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100/90 px-3 py-1.5 rounded-lg w-fit md:hidden mb-2">
              <Icon name="swipe" className="text-sm text-slate-400" />
              <span>Geser tabel secara horizontal untuk melihat seluruh kolom</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200/80 shadow-xs">
              <table className="w-full text-left border-collapse min-w-[1050px]">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 text-xs uppercase font-bold border-b border-slate-200">
                    <th className="p-3 text-left w-[200px] min-w-[180px] whitespace-nowrap">Nama Mahasiswa</th>
                    <th className="p-3 text-left w-[240px] min-w-[220px] whitespace-nowrap">Kanji / Modul</th>
                    <th className="p-3 text-center w-[75px] min-w-[70px] whitespace-nowrap">Model A</th>
                    <th className="p-3 text-center w-[75px] min-w-[70px] whitespace-nowrap">Model B</th>
                    <th className="p-3 text-center w-[75px] min-w-[70px] whitespace-nowrap">Model C</th>
                    <th className="p-3 text-center w-[75px] min-w-[70px] whitespace-nowrap">Model D</th>
                    <th className="p-3 text-center w-[90px] min-w-[85px] whitespace-nowrap">Nilai Max</th>
                    <th className="p-3 text-center w-[85px] min-w-[80px] whitespace-nowrap">Rata-rata</th>
                    <th className="p-3 text-center w-[80px] min-w-[75px] whitespace-nowrap">Percobaan</th>
                    <th className="p-3 text-left w-[125px] min-w-[115px] whitespace-nowrap">Interpretasi</th>
                    <th className="p-3 text-center w-[85px] min-w-[80px] whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredRecapTable.map((item, idx) => (
                    <tr key={`${item.userId}_${item.kanjiId}_${idx}`} className="hover:bg-slate-50/80 transition-all">
                      {/* Nama Mahasiswa */}
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150"}
                            alt={item.userName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0 max-w-[140px]">
                            <p className="font-bold text-slate-800 truncate" title={item.userName}>{item.userName}</p>
                            <p className="text-[10px] text-slate-400 truncate" title={item.userEmail}>{item.userEmail}</p>
                          </div>
                        </div>
                      </td>

                      {/* Kanji / Modul */}
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-lg bg-[#8f0020]/10 text-[#8f0020] font-black flex items-center justify-center text-sm border border-[#8f0020]/20 shrink-0">
                            {item.kanjiChar}
                          </span>
                          <div className="min-w-0 flex-1 max-w-[180px]">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-800 text-xs shrink-0">{item.kanjiRomaji}</span>
                              <span
                                className="text-[11px] text-slate-500 truncate block max-w-[130px]"
                                title={`${item.kanjiRomaji} (${item.kanjiMeaning})`}
                              >
                                ({item.kanjiMeaning})
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.moduleTitle}</p>
                          </div>
                        </div>
                      </td>

                      {/* Model Scores */}
                      <td className="p-3 text-center font-semibold text-slate-700 whitespace-nowrap">
                        {item.scoreModelA !== null ? `${item.scoreModelA}%` : "-"}
                      </td>
                      <td className="p-3 text-center font-semibold text-slate-700 whitespace-nowrap">
                        {item.scoreModelB !== null ? `${item.scoreModelB}%` : "-"}
                      </td>
                      <td className="p-3 text-center font-semibold text-slate-700 whitespace-nowrap">
                        {item.scoreModelC !== null ? `${item.scoreModelC}%` : "-"}
                      </td>
                      <td className="p-3 text-center font-semibold text-slate-700 whitespace-nowrap">
                        {item.scoreModelD !== null ? `${item.scoreModelD}%` : "-"}
                      </td>

                      {/* Nilai Max */}
                      <td className="p-3 text-center font-black text-emerald-700 text-sm whitespace-nowrap">
                        {item.maxScore}%
                      </td>

                      {/* Rata-rata */}
                      <td className="p-3 text-center font-semibold text-slate-600 whitespace-nowrap">
                        {item.avgScore}%
                      </td>

                      {/* Percobaan */}
                      <td className="p-3 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-700 border border-slate-200">
                          {item.attemptsCount}x
                        </span>
                      </td>

                      {/* Interpretasi */}
                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${getInterpretationBadge(
                            item.interpretation
                          )}`}
                        >
                          {item.interpretation}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="p-3 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRecapItem(item);
                            setIsHistoryModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-[#8f0020] hover:text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer border-none flex items-center gap-1 mx-auto"
                        >
                          <Icon name="history" className="text-xs" />
                          Riwayat
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Detail Attempt History */}
      {isHistoryModalOpen && selectedRecapItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl flex flex-col gap-4 max-h-[85vh] overflow-hidden">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Icon name="history" className="text-[#8f0020]" />
                  Riwayat Percobaan Kuis
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mahasiswa: <strong className="text-slate-800">{selectedRecapItem.userName}</strong> | Kanji:{" "}
                  <strong className="text-[#8f0020] font-black">{selectedRecapItem.kanjiChar} ({selectedRecapItem.kanjiRomaji})</strong>
                </p>
              </div>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-all border-none cursor-pointer"
              >
                <Icon name="close" className="text-lg" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 flex flex-col gap-3 pr-1">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                <Icon name="info" className="text-base text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Sesuai aturan penskoran: Meskipun kuis dapat diulang berkali-kali, <strong>nilai tertinggi ({selectedRecapItem.maxScore}%)</strong> diambil sebagai skor capaian progres belajar utama.
                </span>
              </div>

              <div className="space-y-3">
                {selectedRecapItem.attemptsHistory.map((att, idx) => {
                  let parsedDetails: any[] = [];
                  if (att.details) {
                    try {
                      parsedDetails = typeof att.details === "string" ? JSON.parse(att.details) : att.details;
                    } catch (e) {
                      parsedDetails = [];
                    }
                  }
                  const isExpanded = expandedAttemptId === att.id;

                  return (
                    <div
                      key={att.id || idx}
                      className={`p-3.5 rounded-xl border transition-all ${
                        att.isBestAttempt
                          ? "border-emerald-300 bg-emerald-50/30 shadow-xs"
                          : "border-slate-200 bg-slate-50/50"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-800">
                              Percobaan #{att.attemptNumber || selectedRecapItem.attemptsHistory.length - idx}
                            </span>
                            {att.isBestAttempt && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                                ⭐ Nilai Terbaik (Diterima)
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400">
                              {new Date(att.date).toLocaleString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600 mt-1.5">
                            <span>
                              <strong>Model A:</strong> {att.scoreModelA !== null ? `${att.scoreModelA}%` : "-"}
                              {att.rawModelA !== null && att.rawModelA !== undefined && att.maxModelA ? ` (${att.rawModelA}/${att.maxModelA} pt)` : ""}
                            </span>
                            <span>
                              <strong>Model B:</strong> {att.scoreModelB !== null ? `${att.scoreModelB}%` : "-"}
                              {att.rawModelB !== null && att.rawModelB !== undefined && att.maxModelB ? ` (${att.rawModelB}/${att.maxModelB} kata)` : ""}
                            </span>
                            <span>
                              <strong>Model C:</strong> {att.scoreModelC !== null ? `${att.scoreModelC}%` : "-"}
                              {att.rawModelC !== null && att.rawModelC !== undefined && att.maxModelC ? ` (${att.rawModelC}/${att.maxModelC} butir)` : ""}
                            </span>
                            <span>
                              <strong>Model D:</strong> {att.scoreModelD !== null ? `${att.scoreModelD}%` : "-"}
                              {att.rawModelD !== null && att.rawModelD !== undefined && att.maxModelD ? ` (${att.rawModelD}/${att.maxModelD} butir)` : ""}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Nilai Total</span>
                            <span className="text-lg font-black text-emerald-700 leading-none">
                              {att.totalScore}%
                            </span>
                          </div>
                          {Array.isArray(parsedDetails) && parsedDetails.length > 0 && (
                            <button
                              onClick={() => setExpandedAttemptId(isExpanded ? null : att.id)}
                              className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                            >
                              {isExpanded ? "Tutup" : `Soal (${parsedDetails.length})`}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expanded Question Breakdown */}
                      {isExpanded && Array.isArray(parsedDetails) && parsedDetails.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                          <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                            Rincian Jawaban Soal:
                          </p>
                          <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                            {parsedDetails.map((fb: any, qIdx: number) => (
                              <div
                                key={qIdx}
                                className="p-2 rounded-lg bg-white border border-slate-200 text-xs flex items-start gap-2"
                              >
                                <span
                                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-bold mt-0.5 ${
                                    fb.isCorrect ? "bg-emerald-500" : "bg-rose-500"
                                  }`}
                                >
                                  {fb.isCorrect ? "✓" : "✗"}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-slate-800 leading-snug">{fb.question}</p>
                                  <p className="text-slate-500 text-[11px] mt-0.5">
                                    Jawaban Mahasiswa:{" "}
                                    <span className={fb.isCorrect ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>
                                      {fb.studentAnswer || "-"}
                                    </span>
                                  </p>
                                  {!fb.isCorrect && fb.correctAnswer && (
                                    <p className="text-slate-400 text-[10px]">
                                      Kunci: <span className="text-emerald-700 font-medium">{fb.correctAnswer}</span>
                                    </p>
                                  )}
                                  {fb.rubricScore !== undefined && (
                                    <p className="text-[10px] text-amber-700 font-semibold mt-0.5">
                                      Skor Rubrik Analitik: {fb.rubricScore} / 4
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 flex justify-end">
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="px-5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-all border-none cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuizRubricReport;
