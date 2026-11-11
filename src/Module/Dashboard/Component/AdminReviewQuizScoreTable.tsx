import React, { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";
import {
  FileText,
  Search,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Filter,
  Layers,
  Award,
  Users,
  X,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { api } from "../../Common/Utility/api";

interface ModuleSectionScore {
  moduleNumber: number;
  moduleTitle: string;
  hasQuestions?: boolean;
  correctA: number;
  totalA: number;
  rubricA: number;
  correctB: number;
  totalB: number;
  rubricB: number;
  correctC: number;
  totalC: number;
  rubricC: number;
  correctD: number;
  totalD: number;
  rubricD: number;
  totalCorrect: number;
  totalQuestions: number;
  percent: number;
  totalRubric: number;
  status: string;
}

interface StudentReportItem {
  userId: number;
  name: string;
  email: string;
  avatar: string;
  joinedAt: string;
  hasAttempted: boolean;
  isDraft: boolean;
  attemptCount: number;
  finalScore: number | null;
  totalCorrect: number | null;
  totalQuestions: number;
  isPassed: boolean;
  submittedAt: string | null;
  modules: Record<number, ModuleSectionScore>;
}

interface ReviewQuizScoreReportData {
  reviewQuiz: {
    id: number;
    judul: string;
    peletakanSetelahModul: number;
    totalSoal: number;
    targetScore: number;
  };
  modules: Array<{
    moduleNumber: number;
    title: string;
    id?: number;
    hasQuestions?: boolean;
    questionCount?: number;
  }>;
  students: StudentReportItem[];
  summary: {
    totalStudents: number;
    completedCount: number;
    passedCount: number;
    avgScore: number;
  };
}

export const AdminReviewQuizScoreTable: React.FC = () => {
  const [data, setData] = useState<ReviewQuizScoreReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Review Quiz selection
  const [quizList, setQuizList] = useState<any[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all"); // 'all' | 'passed' | 'remedial' | 'not_attempted'
  const [activeModuleTab, setActiveModuleTab] = useState<number | "all">("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Detail Modal
  const [selectedStudent, setSelectedStudent] = useState<StudentReportItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const loadReport = async (quizId?: number | null) => {
    try {
      setLoading(true);
      setError("");
      const targetId = quizId !== undefined ? quizId : selectedQuizId;
      const res = await api.reviewQuiz.adminScoreReport(targetId || undefined);
      setData(res);
    } catch (err: any) {
      console.error("Error loading review quiz score report:", err);
      setError(err.message || "Gagal memuat rekap nilai review quiz.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
    const fetchQuizList = async () => {
      try {
        const list = await api.reviewQuiz.adminList();
        if (Array.isArray(list) && list.length > 0) {
          setQuizList(list);
          if (!selectedQuizId) {
            setSelectedQuizId(list[0].id);
          }
        }
      } catch (err) {
        console.error("Gagal memuat daftar review quiz:", err);
      }
    };
    fetchQuizList();
  }, []);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    if (!data?.students) return [];
    return data.students.filter((std) => {
      // Search by Name or Email
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = std.name?.toLowerCase().includes(q);
        const matchEmail = std.email?.toLowerCase().includes(q);
        if (!matchName && !matchEmail) return false;
      }

      // Status filter
      if (statusFilter === "passed") {
        return std.hasAttempted && std.isPassed;
      }
      if (statusFilter === "remedial") {
        return std.hasAttempted && !std.isPassed;
      }
      if (statusFilter === "not_attempted") {
        return !std.hasAttempted;
      }

      return true;
    });
  }, [data?.students, searchQuery, statusFilter]);

  // Pagination calculations
  const totalItems = filteredStudents.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  // Seluruh modul dari tabel Module (tanpa batasan 6)
  const allModules = useMemo(() => {
    return data?.modules || [];
  }, [data?.modules]);

  // Modul yang memiliki pertanyaan di review quiz ini (untuk kolom tabel tampilan semua modul)
  const modulesWithQuestions = useMemo(() => {
    if (!data?.modules || data.modules.length === 0) return [];
    const withQ = data.modules.filter((m) => m.hasQuestions !== false && (m.questionCount ?? 1) > 0);
    return withQ.length > 0 ? withQ : data.modules;
  }, [data?.modules]);

  // Modul yang sedang difokuskan (jika tab fokus aktif)
  const focusedModuleInfo = useMemo(() => {
    if (activeModuleTab === "all") return null;
    return allModules.find((m) => m.moduleNumber === activeModuleTab) || null;
  }, [allModules, activeModuleTab]);

  // Export Excel (.xlsx)
  const handleExportXLSX = () => {
    if (!data || !data.students.length) return;

    const modulesToExport = modulesWithQuestions.length > 0 ? modulesWithQuestions : allModules;

    const headers = [
      "No",
      "Nama Mahasiswa",
      "Email",
      "Status Pengerjaan",
      "Total Skor Akhir (%)",
      "Total Soal Benar",
      "Status Kelulusan",
    ];

    modulesToExport.forEach((m) => {
      headers.push(
        `M${m.moduleNumber} Bagian A`,
        `M${m.moduleNumber} Rubrik A (%)`,
        `M${m.moduleNumber} Bagian B`,
        `M${m.moduleNumber} Rubrik B (%)`,
        `M${m.moduleNumber} Bagian C`,
        `M${m.moduleNumber} Rubrik C (%)`,
        `M${m.moduleNumber} Bagian D`,
        `M${m.moduleNumber} Rubrik D (%)`,
        `M${m.moduleNumber} Total Benar`,
        `M${m.moduleNumber} Persentase (%)`
      );
    });

    const rows = filteredStudents.map((std, idx) => {
      const row: (string | number)[] = [
        idx + 1,
        std.name,
        std.email,
        std.hasAttempted ? "Sudah Mengerjakan" : std.isDraft ? "Draft" : "Belum Mengerjakan",
        std.finalScore !== null ? `${std.finalScore}%` : "-",
        std.totalCorrect !== null ? `${std.totalCorrect}/${std.totalQuestions || 120}` : "-",
        std.hasAttempted ? (std.isPassed ? "LULUS" : "REMEDIAL") : "-",
      ];

      modulesToExport.forEach((m) => {
        const mod = std.modules[m.moduleNumber];
        if (mod && mod.hasQuestions !== false) {
          row.push(
            `${mod.correctA}/${mod.totalA || 5}`,
            `${mod.rubricA}%`,
            `${mod.correctB}/${mod.totalB || 5}`,
            `${mod.rubricB}%`,
            `${mod.correctC}/${mod.totalC || 5}`,
            `${mod.rubricC}%`,
            `${mod.correctD}/${mod.totalD || 5}`,
            `${mod.rubricD}%`,
            `${mod.totalCorrect}/${mod.totalQuestions || 20}`,
            `${mod.percent}%`
          );
        } else {
          row.push("-", "-", "-", "-", "-", "-", "-", "-", "-", "-");
        }
      });

      return row;
    });

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    // Auto column width calculation
    const colWidths = headers.map((h, i) => {
      let maxLen = h.length;
      rows.forEach((r) => {
        const val = r[i] !== undefined && r[i] !== null ? String(r[i]) : "";
        if (val.length > maxLen) maxLen = val.length;
      });
      return { wch: Math.min(Math.max(maxLen + 3, 10), 36) };
    });
    ws["!cols"] = colWidths;

    const wb = XLSX.utils.book_new();
    const sheetTitle = (data?.reviewQuiz?.judul || "Rekap Review Quiz").slice(0, 31);
    XLSX.utils.book_append_sheet(wb, ws, sheetTitle);

    const safeTitle = (data?.reviewQuiz?.judul || "Rekap_Review_Quiz")
      .replace(/[^a-zA-Z0-9_\-]/g, "_")
      .replace(/_+/g, "_");
    XLSX.writeFile(wb, `${safeTitle}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const openStudentDetail = (std: StudentReportItem) => {
    setSelectedStudent(std);
    setIsModalOpen(true);
  };

  const getScoreCellBadge = (correct: number) => {
    if (correct >= 4) {
      return "text-emerald-700 bg-emerald-50 border-emerald-200";
    }
    if (correct >= 3) {
      return "text-amber-700 bg-amber-50 border-amber-200";
    }
    return "text-rose-700 bg-rose-50 border-rose-200";
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col gap-6">
      {/* 1. Header Banner & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-[#8f0020]" />
            Rekap Review Quiz Mahasiswa
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Menampilkan rincian pencapaian skor dan kontribusi rubrik penilaian masing-masing mahasiswa untuk setiap modul
            (Modul 1 s.d. 6) pada 4 model keterampilan: <strong>Bagian A (Susun Kalimat)</strong>,{" "}
            <strong>Bagian B (Grouping Semantik)</strong>, <strong>Bagian C (Makna Jukugo)</strong>, dan{" "}
            <strong>Bagian D (Lengkapi Kalimat)</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-center">
          <button
            onClick={handleExportXLSX}
            disabled={!data || !data.students.length}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 cursor-pointer transition-all active:scale-95 shadow-2xs disabled:opacity-50"
            title="Download file spreadsheet Excel (.xlsx)"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor XLSX</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary Stat Cards */}
      {data?.summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Mahasiswa
              </span>
              <span className="text-xl font-black text-slate-900 block mt-0.5">
                {data.summary.totalStudents}{" "}
                <span className="text-xs font-semibold text-slate-400">orang</span>
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Sudah Mengerjakan
              </span>
              <span className="text-xl font-black text-slate-900 block mt-0.5">
                {data.summary.completedCount}{" "}
                <span className="text-xs font-semibold text-slate-400">
                  ({Math.round((data.summary.completedCount / (data.summary.totalStudents || 1)) * 100)}%)
                </span>
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Lulus Evaluasi
              </span>
              <span className="text-xl font-black text-emerald-700 block mt-0.5">
                {data.summary.passedCount}{" "}
                <span className="text-xs font-semibold text-slate-400">
                  (Target ≥{data.reviewQuiz.targetScore}%)
                </span>
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-[#8f0020] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Rata-Rata Nilai
              </span>
              <span className="text-xl font-black text-slate-900 block mt-0.5">
                {data.summary.avgScore}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Filter Controls & Tab Pemetaan Modul */}
      <div className="flex flex-col gap-3.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/70">
        {/* Search & Status Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-[420px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari mahasiswa berdasarkan nama atau email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 placeholder-slate-400 bg-white focus:border-[#8f0020] focus:ring-2 focus:ring-rose-100 outline-none transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer p-0.5 inline-flex items-center justify-center rounded-md"
                title="Hapus pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs font-bold text-slate-600">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">Semua Status</option>
                <option value="passed">Lulus (≥{data?.reviewQuiz?.targetScore || 60}%)</option>
                <option value="remedial">Perlu Peningkatan (&lt;{data?.reviewQuiz?.targetScore || 60}%)</option>
                <option value="not_attempted">Belum Mengerjakan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pilihan Review Quiz dari Tabel review_quiz */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#8f0020]" />
              Review Quiz:
            </span>

            <div className="relative inline-flex items-center">
              <select
                value={selectedQuizId || (data?.reviewQuiz?.id ?? "")}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setSelectedQuizId(id);
                  loadReport(id);
                  setActiveModuleTab("all");
                  setCurrentPage(1);
                }}
                className="pl-3.5 pr-8 py-2 rounded-xl text-xs font-bold transition-all border appearance-none outline-none cursor-pointer shadow-2xs min-w-[280px] sm:min-w-[340px] bg-white text-slate-800 border-slate-300 hover:border-[#8f0020] focus:border-[#8f0020] focus:ring-2 focus:ring-rose-100"
              >
                {quizList.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.judul} ({q.totalSoal || 120} Butir Soal)
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>

            {data?.reviewQuiz && (
              <span className="text-[11px] font-semibold text-slate-500 hidden md:inline ml-1">
                Menampilkan nilai komprehensif untuk <strong>{data.reviewQuiz.judul}</strong> (Target: ≥{data.reviewQuiz.targetScore || 60}%)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4. Table Container */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 font-bold text-sm animate-pulse flex flex-col items-center gap-2">
          <Clock className="w-6 h-6 text-[#8f0020] animate-spin" />
          <span>Memuat data rekapitulasi score review quiz...</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => loadReport()}
            className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold border-none cursor-pointer hover:bg-rose-700"
          >
            Coba Lagi
          </button>
        </div>
      ) : paginatedStudents.length === 0 ? (
        <div className="py-14 text-center text-slate-400 text-xs font-bold bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          Tidak ditemukan mahasiswa yang sesuai dengan filter pencarian.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
          {activeModuleTab === "all" ? (
            /* Multi-column All Modules View */
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <th rowSpan={2} className="py-3 px-4 border-r border-slate-200 sticky left-0 bg-slate-100 z-10 min-w-[200px]">
                    Mahasiswa
                  </th>
                  {modulesWithQuestions.map((m) => (
                    <th
                      key={m.moduleNumber}
                      colSpan={4}
                      className="py-2.5 px-2 text-center border-r border-slate-200 bg-slate-50/90 font-black text-slate-800"
                      title={m.title}
                    >
                      Modul {m.moduleNumber}
                    </th>
                  ))}
                  <th rowSpan={2} className="py-3 px-3 text-center border-r border-slate-200 min-w-[95px]">
                    Total Skor
                  </th>
                  <th rowSpan={2} className="py-3 px-3 text-center border-r border-slate-200 min-w-[110px]">
                    Status
                  </th>
                  <th rowSpan={2} className="py-3 px-4 text-center min-w-[80px]">
                    Aksi
                  </th>
                </tr>
                <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase text-[9px] border-b border-slate-200">
                  {modulesWithQuestions.map((m) => (
                    <React.Fragment key={m.moduleNumber}>
                      <th className="py-1.5 px-2 text-center border-r border-slate-100" title={`Modul ${m.moduleNumber} Bagian A: Menyusun Kalimat`}>
                        A
                      </th>
                      <th className="py-1.5 px-2 text-center border-r border-slate-100" title={`Modul ${m.moduleNumber} Bagian B: Grouping Semantik`}>
                        B
                      </th>
                      <th className="py-1.5 px-2 text-center border-r border-slate-100" title={`Modul ${m.moduleNumber} Bagian C: Makna Jukugo`}>
                        C
                      </th>
                      <th className="py-1.5 px-2 text-center border-r border-slate-200" title={`Modul ${m.moduleNumber} Bagian D: Melengkapi Kalimat`}>
                        D
                      </th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {paginatedStudents.map((std) => (
                  <tr key={std.userId} className="hover:bg-slate-50/80 transition-colors">
                    {/* Mahasiswa Info */}
                    <td className="py-3.5 px-4 border-r border-slate-200 sticky left-0 bg-white z-10 shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={std.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150"}
                          alt={std.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                          onError={(e: any) => {
                            e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150";
                          }}
                        />
                        <div className="min-w-0">
                          <span className="font-extrabold text-slate-900 block truncate max-w-[150px]">
                            {std.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                            {std.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Dynamic Modules Scores */}
                    {modulesWithQuestions.map((m) => {
                      const mNum = m.moduleNumber;
                      const mod = std.modules[mNum];
                      if (!mod || (!std.hasAttempted && !std.isDraft) || mod.hasQuestions === false) {
                        return (
                          <React.Fragment key={mNum}>
                            <td className="py-3 px-2 text-center text-slate-300 font-bold border-r border-slate-100">-</td>
                            <td className="py-3 px-2 text-center text-slate-300 font-bold border-r border-slate-100">-</td>
                            <td className="py-3 px-2 text-center text-slate-300 font-bold border-r border-slate-100">-</td>
                            <td className="py-3 px-2 text-center text-slate-300 font-bold border-r border-slate-200">-</td>
                          </React.Fragment>
                        );
                      }

                      return (
                        <React.Fragment key={mNum}>
                          <td className="py-3 px-1.5 text-center border-r border-slate-100">
                            <span
                              className={`px-1.5 py-0.5 rounded-md font-black text-[11px] border inline-block ${getScoreCellBadge(
                                mod.correctA
                              )}`}
                              title={`Modul ${mNum} Bagian A: ${mod.correctA}/${mod.totalA || 5} benar (${mod.rubricA}% rubrik)`}
                            >
                              {mod.correctA}<br/>
                              {mod.correctA}/{mod.totalA || 5} ({mod.rubricA}%)
                            </span>
                          </td>
                          <td className="py-3 px-1.5 text-center border-r border-slate-100">
                            <span
                              className={`px-1.5 py-0.5 rounded-md font-black text-[11px] border inline-block ${getScoreCellBadge(
                                mod.correctB
                              )}`}
                              title={`Modul ${mNum} Bagian B: ${mod.correctB}/${mod.totalB || 5} benar (${mod.rubricB}% rubrik)`}
                            >
                              {mod.correctB}<br/>
                              {mod.correctB}/{mod.totalB || 5} ({mod.rubricB}%)
                            </span>
                          </td>
                          <td className="py-3 px-1.5 text-center border-r border-slate-100">
                            <span
                              className={`px-1.5 py-0.5 rounded-md font-black text-[11px] border inline-block ${getScoreCellBadge(
                                mod.correctC
                              )}`}
                              title={`Modul ${mNum} Bagian C: ${mod.correctC}/${mod.totalC || 5} benar (${mod.rubricC}% rubrik)`}
                            >
                              {mod.correctC}<br/>
                              {mod.correctC}/{mod.totalC || 5} ({mod.rubricC}%)
                            </span>
                          </td>
                          <td className="py-3 px-1.5 text-center border-r border-slate-200">
                            <span
                              className={`px-1.5 py-0.5 rounded-md font-black text-[11px] border inline-block ${getScoreCellBadge(
                                mod.correctD
                              )}`}
                              title={`Modul ${mNum} Bagian D: ${mod.correctD}/${mod.totalD || 5} benar (${mod.rubricD}% rubrik)`}
                            >
                              {mod.correctD}<br/>
                              {mod.correctD}/{mod.totalD || 5} ({mod.rubricD}%)
                            </span>
                          </td>
                        </React.Fragment>
                      );
                    })}

                    {/* Total Skor Akhir */}
                    <td className="py-3 px-3 text-center border-r border-slate-200">
                      {std.finalScore !== null ? (
                        <div>
                          <span
                            className={`font-black text-sm block ${
                              std.isPassed ? "text-emerald-700" : "text-rose-600"
                            }`}
                          >
                            {std.finalScore}%
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {std.totalCorrect}/{data?.reviewQuiz?.totalSoal || std.totalQuestions || 120}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-300 font-bold">-</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3 text-center border-r border-slate-200">
                      {std.hasAttempted ? (
                        std.isPassed ? (
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold px-2 py-1 rounded-lg text-[10px] inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Lulus
                          </span>
                        ) : (
                          <span className="bg-rose-50 text-[#8f0020] border border-rose-200 font-extrabold px-2 py-1 rounded-lg text-[10px] inline-flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-[#8f0020]" />
                            Remedial
                          </span>
                        )
                      ) : std.isDraft ? (
                        <span className="bg-amber-50 text-amber-800 border border-amber-200 font-bold px-2 py-0.5 rounded-lg text-[10px]">
                          Draft
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-lg text-[10px]">
                          Belum Mulai
                        </span>
                      )}
                    </td>

                    {/* Aksi Button */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => openStudentDetail(std)}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-[#8f0020] text-slate-600 hover:text-white transition-all border-none cursor-pointer"
                        title="Lihat Detail Rubrik Modul Mahasiswa"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            /* Focused Single Module View */
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-4 min-w-[200px]">Mahasiswa</th>
                  <th className="py-3.5 px-3 text-center">
                    Bagian A (Susun)<br />
                    <span className="text-[9px] font-normal lowercase text-slate-400">
                      skor /{focusedModuleInfo?.questionCount ? Math.round(focusedModuleInfo.questionCount / 4) : 5} • rubrik /4.2%
                    </span>
                  </th>
                  <th className="py-3.5 px-3 text-center">
                    Bagian B (Semantik)<br />
                    <span className="text-[9px] font-normal lowercase text-slate-400">
                      skor /{focusedModuleInfo?.questionCount ? Math.round(focusedModuleInfo.questionCount / 4) : 5} • rubrik /4.2%
                    </span>
                  </th>
                  <th className="py-3.5 px-3 text-center">
                    Bagian C (Makna)<br />
                    <span className="text-[9px] font-normal lowercase text-slate-400">
                      skor /{focusedModuleInfo?.questionCount ? Math.round(focusedModuleInfo.questionCount / 4) : 5} • rubrik /4.2%
                    </span>
                  </th>
                  <th className="py-3.5 px-3 text-center">
                    Bagian D (Rumpang)<br />
                    <span className="text-[9px] font-normal lowercase text-slate-400">
                      skor /{focusedModuleInfo?.questionCount ? Math.round(focusedModuleInfo.questionCount / 4) : 5} • rubrik /4.2%
                    </span>
                  </th>
                  <th className="py-3.5 px-3 text-center">
                    Total Modul {activeModuleTab}<br />
                    <span className="text-[9px] font-normal lowercase text-slate-400">
                      maks {focusedModuleInfo?.questionCount || 20} butir
                    </span>
                  </th>
                  <th className="py-3.5 px-3 text-center">Persentase</th>
                  <th className="py-3.5 px-3 text-center">Tingkat Kemahiran</th>
                  <th className="py-3.5 px-3 text-center">Skor Akhir Evaluasi</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {paginatedStudents.map((std) => {
                  const m = std.modules[activeModuleTab as number];
                  const hasQuestions = m && m.hasQuestions !== false;
                  const hasAttempt = (std.hasAttempted || std.isDraft) && hasQuestions;

                  return (
                    <tr key={std.userId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={std.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150"}
                            alt={std.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                            onError={(e: any) => {
                              e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150";
                            }}
                          />
                          <div className="min-w-0">
                            <span className="font-extrabold text-slate-900 block truncate max-w-[170px]">
                              {std.name}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate max-w-[170px]">
                              {std.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        {hasAttempt ? (
                          <div>
                            <span className="font-black text-slate-900 text-xs block">{m.correctA} / {m.totalA || 5}</span>
                            <span className="text-[10px] text-slate-400 font-bold">{m.rubricA}%</span>
                          </div>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        {hasAttempt ? (
                          <div>
                            <span className="font-black text-slate-900 text-xs block">{m.correctB} / {m.totalB || 5}</span>
                            <span className="text-[10px] text-slate-400 font-bold">{m.rubricB}%</span>
                          </div>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        {hasAttempt ? (
                          <div>
                            <span className="font-black text-slate-900 text-xs block">{m.correctC} / {m.totalC || 5}</span>
                            <span className="text-[10px] text-slate-400 font-bold">{m.rubricC}%</span>
                          </div>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        {hasAttempt ? (
                          <div>
                            <span className="font-black text-slate-900 text-xs block">{m.correctD} / {m.totalD || 5}</span>
                            <span className="text-[10px] text-slate-400 font-bold">{m.rubricD}%</span>
                          </div>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-center font-black text-slate-900">
                        {hasAttempt ? `${m.totalCorrect} / ${m.totalQuestions || 20}` : "-"}
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        {hasAttempt ? (
                          <span
                            className={`font-black ${
                              m.percent >= 60 ? "text-emerald-700" : "text-rose-600"
                            }`}
                          >
                            {m.percent}%
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        {hasAttempt ? (
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black border inline-block ${
                              m.percent >= 80
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : m.percent >= 60
                                  ? "bg-amber-50 text-amber-800 border-amber-200"
                                  : "bg-rose-50 text-rose-800 border-rose-200"
                            }`}
                          >
                            {m.status}
                          </span>
                        ) : (
                          <span className="text-slate-300 font-bold">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        {std.finalScore !== null ? (
                          <span
                            className={`font-black text-sm ${
                              std.isPassed ? "text-emerald-700" : "text-rose-600"
                            }`}
                          >
                            {std.finalScore}%
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => openStudentDetail(std)}
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-[#8f0020] text-slate-600 hover:text-white transition-all border-none cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* 5. Pagination Footer */}
      {!loading && totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-500 font-semibold border-t border-slate-100">
          <div>
            Menampilkan{" "}
            <strong className="text-slate-800">
              {(currentPage - 1) * pageSize + 1} – {Math.min(currentPage * pageSize, totalItems)}
            </strong>{" "}
            dari <strong className="text-slate-800">{totalItems}</strong> mahasiswa
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-all"
            >
              Sebelumnya
            </button>
            <span className="px-2 font-bold text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-all"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}

      {/* 6. Modal Detail Rubrik Per Mahasiswa */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-hidden border border-slate-100 animate-scale-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudent.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150"}
                  alt={selectedStudent.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                  onError={(e: any) => {
                    e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150";
                  }}
                />
                <div>
                  <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    {selectedStudent.name}
                    {selectedStudent.hasAttempted && (
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                          selectedStudent.isPassed
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-rose-50 text-rose-800 border-rose-200"
                        }`}
                      >
                        {selectedStudent.isPassed ? "LULUS" : "REMEDIAL"}
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-400 font-semibold">{selectedStudent.email}</p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 border-none bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score Overview Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Nilai Akhir
                </span>
                <span
                  className={`text-2xl font-black block mt-0.5 ${
                    selectedStudent.finalScore !== null && selectedStudent.finalScore >= 60
                      ? "text-emerald-700"
                      : "text-rose-600"
                  }`}
                >
                  {selectedStudent.finalScore !== null ? `${selectedStudent.finalScore}%` : "-"}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Soal Benar
                </span>
                <span className="text-2xl font-black text-slate-900 block mt-0.5">
                  {selectedStudent.totalCorrect !== null
                    ? `${selectedStudent.totalCorrect} / ${selectedStudent.totalQuestions || data?.reviewQuiz?.totalSoal || 120}`
                    : "-"}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Status Percobaan
                </span>
                <span className="text-sm font-extrabold text-slate-800 block mt-1.5">
                  {selectedStudent.hasAttempted
                    ? `${selectedStudent.attemptCount}x Submisi`
                    : selectedStudent.isDraft
                      ? "Sedang Mengerjakan"
                      : "Belum Mengikuti"}
                </span>
              </div>
            </div>

            {/* Comprehensive Breakdown Table Modul */}
            <div className="flex-1 overflow-y-auto pr-1">
              <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#8f0020]" />
                Rincian Pemetaan Modul (Bagian A – D)
              </h5>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <th className="py-3 px-3">Modul</th>
                      <th className="py-3 px-2 text-center" title="Bagian A (Susun Kalimat)">
                        A (Susun)<br />
                        <span className="text-[9px] font-normal lowercase text-slate-400">skor</span>
                      </th>
                      <th className="py-3 px-2 text-center" title="Bagian B (Grouping Semantik)">
                        B (Semantik)<br />
                        <span className="text-[9px] font-normal lowercase text-slate-400">skor</span>
                      </th>
                      <th className="py-3 px-2 text-center" title="Bagian C (Makna Jukugo)">
                        C (Makna)<br />
                        <span className="text-[9px] font-normal lowercase text-slate-400">skor</span>
                      </th>
                      <th className="py-3 px-2 text-center" title="Bagian D (Konteks Kalimat)">
                        D (Rumpang)<br />
                        <span className="text-[9px] font-normal lowercase text-slate-400">skor</span>
                      </th>
                      <th className="py-3 px-2.5 text-center">
                        Total<br />
                        <span className="text-[9px] font-normal lowercase text-slate-400">benar</span>
                      </th>
                      <th className="py-3 px-2.5 text-center">Persentase</th>
                      <th className="py-3 px-3 text-right">Kemahiran</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {(modulesWithQuestions.length > 0 ? modulesWithQuestions : allModules).map((modItem) => {
                      const mNum = modItem.moduleNumber;
                      const m = selectedStudent.modules[mNum];
                      const hasData = (selectedStudent.hasAttempted || selectedStudent.isDraft) && m && m.hasQuestions !== false;

                      return (
                        <tr key={mNum} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-3 font-extrabold text-slate-900">
                            {m?.moduleTitle || modItem.title || `Modul ${mNum}`}
                          </td>
                          <td className="py-3 px-2 text-center font-bold">
                            {hasData ? (
                              <span className={m.correctA >= 4 ? "text-emerald-700 font-black" : "text-slate-800"}>
                                {m.correctA}/{m.totalA || 5}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="py-3 px-2 text-center font-bold">
                            {hasData ? (
                              <span className={m.correctB >= 4 ? "text-emerald-700 font-black" : "text-slate-800"}>
                                {m.correctB}/{m.totalB || 5}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="py-3 px-2 text-center font-bold">
                            {hasData ? (
                              <span className={m.correctC >= 4 ? "text-emerald-700 font-black" : "text-slate-800"}>
                                {m.correctC}/{m.totalC || 5}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="py-3 px-2 text-center font-bold">
                            {hasData ? (
                              <span className={m.correctD >= 4 ? "text-emerald-700 font-black" : "text-slate-800"}>
                                {m.correctD}/{m.totalD || 5}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="py-3 px-2.5 text-center font-black text-slate-900">
                            {hasData ? `${m.totalCorrect}/${m.totalQuestions || 20}` : "-"}
                          </td>
                          <td className="py-3 px-2.5 text-center font-black">
                            {hasData ? (
                              <span className={m.percent >= 60 ? "text-emerald-700" : "text-rose-600"}>
                                {m.percent}%
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            {hasData ? (
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border inline-block ${
                                  m.percent >= 80
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                    : m.percent >= 60
                                      ? "bg-amber-50 text-amber-800 border-amber-200"
                                      : "bg-rose-50 text-rose-800 border-rose-200"
                                }`}
                              >
                                {m.status}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border-none cursor-pointer"
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

export default AdminReviewQuizScoreTable;
