import React, { useState, useEffect, useMemo, useCallback } from "react";
import Icon from "../../Common/Component/Icon";
import { api } from "../../Common/Utility/api";
import { MODULE_TARGET_KANJIS_CONFIG } from "./AdminQuizRubricReport";

export interface StudentKanjiProgressItem {
  userId: number;
  userName: string;
  userEmail: string;
  userAvatar?: string | null;
  kanjiId: number;
  kanjiChar: string;
  kanjiRomaji: string;
  kanjiMeaning: string;
  moduleId: number;
  moduleTitle: string;
  masteryPercent: number;
  readingPercent: number;
  writingPercent: number;
  quizPercent: number;
  status: string;
  lastPracticed: string;
}

export const AdminKanjiProgressMonitoring: React.FC = () => {
  const [data, setData] = useState<StudentKanjiProgressItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Filters
  const [filterModule, setFilterModule] = useState<string>(""); // "1", "2", "3", etc.
  const [filterKanji, setFilterKanji] = useState<string>(""); // kanjiChar, e.g. "試"
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>(""); // "completed", "learning"

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<"name" | "kanji" | "module" | "total" | "reading" | "writing" | "quiz">("module");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Fetch progress data from backend once on mount (and on manual reload)
  const fetchProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.admin.getStudentKanjiProgress();
      setData(Array.isArray(res) ? res : []);
    } catch (err: any) {
      console.error("Gagal memuat monitoring progress kanji mahasiswa:", err);
      setError(err?.message || "Gagal memuat data progress kanji mahasiswa.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  // Reset page to 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterModule, filterKanji, searchQuery, filterStatus]);

  // Module filter options
  const moduleOptions = useMemo(() => {
    return MODULE_TARGET_KANJIS_CONFIG.map((m, idx) => ({
      num: String(idx + 1),
      name: m.moduleName,
    }));
  }, []);

  // Kanji options based on selected module
  const currentModuleKanjis = useMemo(() => {
    if (filterModule) {
      const selected = MODULE_TARGET_KANJIS_CONFIG.find(
        (_, idx) => String(idx + 1) === filterModule
      );
      return selected ? selected.kanjis : [];
    }
    return [];
  }, [filterModule]);

  // Filtered & Sorted Data (100% Client-Side for instant responsiveness)
  const processedData = useMemo(() => {
    let result = [...data];

    // 1. Filter Modul
    if (filterModule) {
      const modNum = filterModule; // e.g. "1"
      result = result.filter((item) => {
        const titleLower = (item.moduleTitle || "").toLowerCase();
        return (
          titleLower.includes(`modul ${modNum}`) ||
          titleLower.includes(`modul: ${modNum}`) ||
          titleLower.includes(`modul ${modNum}:`) ||
          String(item.moduleId) === modNum
        );
      });
    }

    // 2. Filter Kanji Target (Character match)
    if (filterKanji) {
      result = result.filter((item) => item.kanjiChar === filterKanji);
    }

    // 3. Filter Status Ketuntasan
    if (filterStatus === "completed") {
      result = result.filter((item) => item.masteryPercent > 60);
    } else if (filterStatus === "learning") {
      result = result.filter((item) => item.masteryPercent <= 60);
    }

    // 4. Cari Mahasiswa (Nama, Email, Kanji, Romaji)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        const nameMatch = (item.userName || "").toLowerCase().includes(q);
        const emailMatch = (item.userEmail || "").toLowerCase().includes(q);
        const kanjiMatch = (item.kanjiChar || "").includes(q);
        const romajiMatch = (item.kanjiRomaji || "").toLowerCase().includes(q);
        const meaningMatch = (item.kanjiMeaning || "").toLowerCase().includes(q);
        return nameMatch || emailMatch || kanjiMatch || romajiMatch || meaningMatch;
      });
    }

    // 5. Sorting
    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") {
        cmp = a.userName.localeCompare(b.userName);
      } else if (sortBy === "kanji") {
        cmp = a.kanjiChar.localeCompare(b.kanjiChar);
      } else if (sortBy === "module") {
        cmp = a.moduleId - b.moduleId || a.kanjiId - b.kanjiId;
      } else if (sortBy === "total") {
        cmp = a.masteryPercent - b.masteryPercent;
      } else if (sortBy === "reading") {
        cmp = a.readingPercent - b.readingPercent;
      } else if (sortBy === "writing") {
        cmp = a.writingPercent - b.writingPercent;
      } else if (sortBy === "quiz") {
        cmp = a.quizPercent - b.quizPercent;
      }

      return sortOrder === "asc" ? cmp : -cmp;
    });

    return result;
  }, [data, filterModule, filterKanji, filterStatus, searchQuery, sortBy, sortOrder]);

  // Paginated slice
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage, pageSize]);

  const totalPages = Math.ceil(processedData.length / pageSize) || 1;

  // Sorting handler
  const handleSort = (field: "name" | "kanji" | "module" | "total" | "reading" | "writing" | "quiz") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (processedData.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }

    const headers = [
      "Nama Mahasiswa",
      "Email",
      "Kanji",
      "Romaji",
      "Arti Kanji",
      "Modul",
      "Progress Total (%)",
      "Progress Baca (%)",
      "Progress Tulis (%)",
      "Progress Kuis (%)",
      "Status Ketuntasan",
    ];

    const rows = processedData.map((item) => [
      `"${item.userName.replace(/"/g, '""')}"`,
      `"${item.userEmail.replace(/"/g, '""')}"`,
      `"${item.kanjiChar}"`,
      `"${item.kanjiRomaji}"`,
      `"${item.kanjiMeaning.replace(/"/g, '""')}"`,
      `"${item.moduleTitle.replace(/"/g, '""')}"`,
      item.masteryPercent,
      item.readingPercent,
      item.writingPercent,
      item.quizPercent,
      item.masteryPercent > 60 ? "Tuntas (> 60%)" : "Belum Tuntas (<= 60%)",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Monitoring_Progress_Kanji_Mahasiswa_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Quick stats computed on filtered dataset
  const stats = useMemo(() => {
    const totalEntries = processedData.length;
    const completedCount = processedData.filter((d) => d.masteryPercent > 60).length;
    const avgTotal = totalEntries > 0 ? Math.round(processedData.reduce((acc, d) => acc + d.masteryPercent, 0) / totalEntries) : 0;
    const avgReading = totalEntries > 0 ? Math.round(processedData.reduce((acc, d) => acc + d.readingPercent, 0) / totalEntries) : 0;
    const avgWriting = totalEntries > 0 ? Math.round(processedData.reduce((acc, d) => acc + d.writingPercent, 0) / totalEntries) : 0;
    const avgQuiz = totalEntries > 0 ? Math.round(processedData.reduce((acc, d) => acc + d.quizPercent, 0) / totalEntries) : 0;

    return { totalEntries, completedCount, avgTotal, avgReading, avgWriting, avgQuiz };
  }, [processedData]);

  const hasActiveFilters = Boolean(filterModule || filterKanji || searchQuery || filterStatus);

  const resetFilters = () => {
    setFilterModule("");
    setFilterKanji("");
    setSearchQuery("");
    setFilterStatus("");
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
      {/* Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-outline-variant/20 pb-3">
        <div>
          <h3 className="font-bold text-on-surface text-base flex items-center gap-2">
            <Icon name="monitoring" className="text-[#8f0020] text-xl" />
            Monitoring Progress Pembelajaran Kanji Mahasiswa
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Pantau rincian penguasaan kanji (total, baca, tulis, kuis) setiap mahasiswa per modul & kanji target.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/60 whitespace-nowrap">
            Total: <strong className="text-slate-800">{processedData.length}</strong> entri
            {processedData.length !== data.length && (
              <span className="text-slate-400"> (dari {data.length})</span>
            )}
          </span>

          <button
            type="button"
            onClick={handleExportCSV}
            disabled={processedData.length === 0}
            className="px-3.5 py-1.5 bg-[#8f0020] hover:bg-[#730019] text-white text-xs font-bold rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="download" className="text-sm" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Mini Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Rata-rata Total</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-black text-slate-800">{stats.avgTotal}%</span>
            <span className="text-[10px] text-slate-400">mastery</span>
          </div>
        </div>

        <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-[10px] uppercase font-bold text-emerald-700">Tuntas (&gt; 60%)</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-black text-emerald-800">{stats.completedCount}</span>
            <span className="text-[10px] text-emerald-600 font-medium">
              ({stats.totalEntries > 0 ? Math.round((stats.completedCount / stats.totalEntries) * 100) : 0}%)
            </span>
          </div>
        </div>

        <div className="bg-blue-50/50 border border-blue-200/60 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-[10px] uppercase font-bold text-blue-700">Rata-rata Membaca</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-black text-blue-800">{stats.avgReading}%</span>
            <span className="text-[10px] text-blue-600 font-medium">reading</span>
          </div>
        </div>

        <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-3 flex flex-col justify-center">
          <span className="text-[10px] uppercase font-bold text-amber-700">Rata-rata Menulis</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-black text-amber-800">{stats.avgWriting}%</span>
            <span className="text-[10px] text-amber-600 font-medium">writing</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar Inside Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/70">
        {/* 1. Filter Modul */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Filter Modul
          </label>
          <select
            value={filterModule}
            onChange={(e) => {
              setFilterModule(e.target.value);
              setFilterKanji(""); // Reset kanji when module changes
            }}
            className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#8f0020] bg-white transition-all shadow-2xs cursor-pointer"
          >
            <option value="">Semua Modul (Modul 1 - 6)</option>
            {moduleOptions.map((m) => (
              <option key={m.num} value={m.num}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Filter Kanji */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Filter Kanji Target
          </label>
          <select
            value={filterKanji}
            onChange={(e) => setFilterKanji(e.target.value)}
            className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#8f0020] bg-white transition-all shadow-2xs cursor-pointer"
          >
            <option value="">Semua Kanji Target</option>
            {filterModule ? (
              currentModuleKanjis.map((k) => (
                <option key={k.char} value={k.char}>
                  {k.char} ({k.romaji})
                </option>
              ))
            ) : (
              MODULE_TARGET_KANJIS_CONFIG.map((group) => (
                <optgroup key={group.moduleName} label={`— ${group.moduleName} —`}>
                  {group.kanjis.map((k) => (
                    <option key={k.char} value={k.char}>
                      {k.char} ({k.romaji})
                    </option>
                  ))}
                </optgroup>
              ))
            )}
          </select>
        </div>

        {/* 3. Filter Status Ketuntasan */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Status Ketuntasan
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#8f0020] bg-white transition-all shadow-2xs cursor-pointer"
          >
            <option value="">Semua Status</option>
            <option value="completed">Tuntas (&gt; 60%)</option>
            <option value="learning">Belum Tuntas (≤ 60%)</option>
          </select>
        </div>

        {/* 4. Pencarian Mahasiswa & Reset */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Cari Mahasiswa
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Nama, email, atau kanji..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 pl-8 pr-7 rounded-xl border border-slate-300 focus:outline-none focus:border-[#8f0020] bg-white transition-all shadow-2xs"
              />
              <Icon name="search" className="absolute left-2.5 top-2.5 text-slate-400 text-sm" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer p-0"
                >
                  <Icon name="close" className="text-sm" />
                </button>
              )}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-all shrink-0 cursor-pointer flex items-center gap-1"
                title="Reset Semua Filter"
              >
                <Icon name="refresh" className="text-xs" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      {loading ? (
        <div className="p-12 text-center text-[#8f0020] font-bold animate-pulse flex flex-col items-center justify-center gap-2">
          <Icon name="sync" className="animate-spin text-2xl" />
          <span>Memuat data monitoring progress kanji mahasiswa...</span>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-rose-600 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold">
          {error}
        </div>
      ) : processedData.length === 0 ? (
        <div className="p-12 text-center text-slate-400 italic text-sm flex flex-col items-center justify-center gap-2">
          <Icon name="search_off" className="text-3xl text-slate-300" />
          <span>Tidak ditemukan data progress pembelajaran kanji pada filter yang dipilih.</span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-1 px-4 py-1.5 text-xs font-bold text-[#8f0020] bg-[#8f0020]/10 hover:bg-[#8f0020]/20 rounded-lg border border-[#8f0020]/20 transition-all cursor-pointer"
            >
              Reset Semua Filter
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
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead>
                <tr className="bg-slate-100/80 text-slate-700 text-xs uppercase font-bold border-b border-slate-200 select-none">
                  {/* 1. Nama Mahasiswa */}
                  <th
                    onClick={() => handleSort("name")}
                    className="p-3 text-left w-[200px] min-w-[180px] whitespace-nowrap cursor-pointer hover:bg-slate-200/60 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Nama Mahasiswa</span>
                      {sortBy === "name" && (
                        <Icon name={sortOrder === "asc" ? "arrow_upward" : "arrow_downward"} className="text-xs" />
                      )}
                    </div>
                  </th>

                  {/* 2. Kanji */}
                  <th
                    onClick={() => handleSort("kanji")}
                    className="p-3 text-left w-[180px] min-w-[160px] whitespace-nowrap cursor-pointer hover:bg-slate-200/60 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Kanji</span>
                      {sortBy === "kanji" && (
                        <Icon name={sortOrder === "asc" ? "arrow_upward" : "arrow_downward"} className="text-xs" />
                      )}
                    </div>
                  </th>

                  {/* 3. Modul */}
                  <th
                    onClick={() => handleSort("module")}
                    className="p-3 text-left w-[180px] min-w-[160px] whitespace-nowrap cursor-pointer hover:bg-slate-200/60 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Modul</span>
                      {sortBy === "module" && (
                        <Icon name={sortOrder === "asc" ? "arrow_upward" : "arrow_downward"} className="text-xs" />
                      )}
                    </div>
                  </th>

                  {/* 4. Progress Total */}
                  <th
                    onClick={() => handleSort("total")}
                    className="p-3 text-center w-[140px] min-w-[130px] whitespace-nowrap cursor-pointer hover:bg-slate-200/60 transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Progress Total</span>
                      {sortBy === "total" && (
                        <Icon name={sortOrder === "asc" ? "arrow_upward" : "arrow_downward"} className="text-xs" />
                      )}
                    </div>
                  </th>

                  {/* 5. Progress Baca */}
                  <th
                    onClick={() => handleSort("reading")}
                    className="p-3 text-center w-[110px] min-w-[100px] whitespace-nowrap cursor-pointer hover:bg-slate-200/60 transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Progress Baca</span>
                      {sortBy === "reading" && (
                        <Icon name={sortOrder === "asc" ? "arrow_upward" : "arrow_downward"} className="text-xs" />
                      )}
                    </div>
                  </th>

                  {/* 6. Progress Tulis */}
                  <th
                    onClick={() => handleSort("writing")}
                    className="p-3 text-center w-[110px] min-w-[100px] whitespace-nowrap cursor-pointer hover:bg-slate-200/60 transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Progress Tulis</span>
                      {sortBy === "writing" && (
                        <Icon name={sortOrder === "asc" ? "arrow_upward" : "arrow_downward"} className="text-xs" />
                      )}
                    </div>
                  </th>

                  {/* 7. Progress Kuis */}
                  <th
                    onClick={() => handleSort("quiz")}
                    className="p-3 text-center w-[110px] min-w-[100px] whitespace-nowrap cursor-pointer hover:bg-slate-200/60 transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Progress Kuis</span>
                      {sortBy === "quiz" && (
                        <Icon name={sortOrder === "asc" ? "arrow_upward" : "arrow_downward"} className="text-xs" />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedData.map((item, idx) => {
                  const isCompleted = item.masteryPercent > 60;

                  return (
                    <tr
                      key={`${item.userId}_${item.kanjiId}_${idx}`}
                      className="hover:bg-slate-50/80 transition-all"
                    >
                      {/* Kolom 1: Nama Mahasiswa */}
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={
                              item.userAvatar ||
                              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150"
                            }
                            alt={item.userName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0 max-w-[150px]">
                            <p className="font-bold text-slate-800 truncate" title={item.userName}>
                              {item.userName}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate" title={item.userEmail}>
                              {item.userEmail}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Kolom 2: Kanji */}
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-lg bg-[#8f0020]/10 text-[#8f0020] font-black flex items-center justify-center text-sm border border-[#8f0020]/20 shrink-0">
                            {item.kanjiChar}
                          </span>
                          <div className="min-w-0 max-w-[140px]">
                            <p className="font-bold text-slate-800 text-xs truncate">
                              {item.kanjiRomaji}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate" title={item.kanjiMeaning}>
                              {item.kanjiMeaning}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Kolom 3: Modul */}
                      <td className="p-3">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80 max-w-[180px] truncate" title={item.moduleTitle}>
                          {item.moduleTitle}
                        </span>
                      </td>

                      {/* Kolom 4: Progress Total */}
                      <td className="p-3">
                        <div className="flex flex-col items-center gap-1.5 w-full max-w-[130px] mx-auto">
                          <div className="flex items-center justify-between w-full text-xs">
                            <span
                              className={`font-black ${
                                isCompleted ? "text-emerald-700" : "text-amber-700"
                              }`}
                            >
                              {item.masteryPercent}%
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                isCompleted
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {isCompleted ? "Tuntas" : "Belum"}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isCompleted ? "bg-[#4F7942]" : "bg-[#8f0020]"
                              }`}
                              style={{ width: `${Math.min(100, Math.max(0, item.masteryPercent))}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Kolom 5: Progress Baca */}
                      <td className="p-3">
                        <div className="flex flex-col items-center gap-1 w-full max-w-[90px] mx-auto">
                          <span className="font-bold text-slate-700 text-xs">
                            {item.readingPercent}%
                          </span>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${Math.min(100, Math.max(0, item.readingPercent))}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Kolom 6: Progress Tulis */}
                      <td className="p-3">
                        <div className="flex flex-col items-center gap-1 w-full max-w-[90px] mx-auto">
                          <span className="font-bold text-slate-700 text-xs">
                            {item.writingPercent}%
                          </span>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                            <div
                              className="h-full bg-amber-500 rounded-full"
                              style={{ width: `${Math.min(100, Math.max(0, item.writingPercent))}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Kolom 7: Progress Kuis */}
                      <td className="p-3">
                        <div className="flex flex-col items-center gap-1 w-full max-w-[90px] mx-auto">
                          <span className="font-bold text-slate-700 text-xs">
                            {item.quizPercent}%
                          </span>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                            <div
                              className="h-full bg-indigo-500 rounded-full"
                              style={{ width: `${Math.min(100, Math.max(0, item.quizPercent))}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span>Tampilkan:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="p-1 rounded-lg border border-slate-300 font-bold bg-white text-slate-700 cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>
                entri per halaman (Menampilkan{" "}
                <strong>
                  {processedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} -{" "}
                  {Math.min(processedData.length, currentPage * pageSize)}
                </strong>{" "}
                dari <strong>{processedData.length}</strong> entri)
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-bold cursor-pointer"
              >
                Sebelumnya
              </button>

              <span className="px-3 py-1 font-bold text-slate-800">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-bold cursor-pointer"
              >
                Berikutnya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminKanjiProgressMonitoring;
