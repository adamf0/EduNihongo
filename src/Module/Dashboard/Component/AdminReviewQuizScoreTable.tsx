import React, { useState, useEffect, useMemo } from "react";
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
} from "lucide-react";
import { api } from "../../Common/Utility/api";

interface ModuleSectionScore {
  moduleNumber: number;
  moduleTitle: string;
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
  modules: Array<{ moduleNumber: number; title: string }>;
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

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.reviewQuiz.adminScoreReport();
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

  // Export CSV
  const handleExportCSV = () => {
    if (!data || !data.students.length) return;

    const headers = [
      "No",
      "Nama Mahasiswa",
      "Email",
      "Status Pengerjaan",
      "Total Skor Akhir (%)",
      "Total Soal Benar",
      "Status Kelulusan",
      // Modul 1
      "M1 Bagian A (Susun)",
      "M1 Rubrik A (%)",
      "M1 Bagian B (Semantik)",
      "M1 Rubrik B (%)",
      "M1 Bagian C (Makna)",
      "M1 Rubrik C (%)",
      "M1 Bagian D (Rumpang)",
      "M1 Rubrik D (%)",
      "M1 Total Benar",
      "M1 Persentase (%)",
      // Modul 2
      "M2 Bagian A",
      "M2 Rubrik A (%)",
      "M2 Bagian B",
      "M2 Rubrik B (%)",
      "M2 Bagian C",
      "M2 Rubrik C (%)",
      "M2 Bagian D",
      "M2 Rubrik D (%)",
      "M2 Total Benar",
      "M2 Persentase (%)",
      // Modul 3
      "M3 Bagian A",
      "M3 Rubrik A (%)",
      "M3 Bagian B",
      "M3 Rubrik B (%)",
      "M3 Bagian C",
      "M3 Rubrik C (%)",
      "M3 Bagian D",
      "M3 Rubrik D (%)",
      "M3 Total Benar",
      "M3 Persentase (%)",
      // Modul 4
      "M4 Bagian A",
      "M4 Rubrik A (%)",
      "M4 Bagian B",
      "M4 Rubrik B (%)",
      "M4 Bagian C",
      "M4 Rubrik C (%)",
      "M4 Bagian D",
      "M4 Rubrik D (%)",
      "M4 Total Benar",
      "M4 Persentase (%)",
      // Modul 5
      "M5 Bagian A",
      "M5 Rubrik A (%)",
      "M5 Bagian B",
      "M5 Rubrik B (%)",
      "M5 Bagian C",
      "M5 Rubrik C (%)",
      "M5 Bagian D",
      "M5 Rubrik D (%)",
      "M5 Total Benar",
      "M5 Persentase (%)",
      // Modul 6
      "M6 Bagian A",
      "M6 Rubrik A (%)",
      "M6 Bagian B",
      "M6 Rubrik B (%)",
      "M6 Bagian C",
      "M6 Rubrik C (%)",
      "M6 Bagian D",
      "M6 Rubrik D (%)",
      "M6 Total Benar",
      "M6 Persentase (%)",
    ];

    const rows = filteredStudents.map((std, idx) => {
      const row = [
        idx + 1,
        `"${std.name.replace(/"/g, '""')}"`,
        `"${std.email.replace(/"/g, '""')}"`,
        std.hasAttempted ? "Sudah Mengerjakan" : std.isDraft ? "Draft" : "Belum Mengerjakan",
        std.finalScore !== null ? std.finalScore : "-",
        std.totalCorrect !== null ? `${std.totalCorrect}/120` : "-",
        std.hasAttempted ? (std.isPassed ? "LULUS" : "REMEDIAL") : "-",
      ];

      [1, 2, 3, 4, 5, 6].forEach((mNum) => {
        const m = std.modules[mNum];
        if (m) {
          row.push(
            `${m.correctA}/${m.totalA}`,
            m.rubricA,
            `${m.correctB}/${m.totalB}`,
            m.rubricB,
            `${m.correctC}/${m.totalC}`,
            m.rubricC,
            `${m.correctD}/${m.totalD}`,
            m.rubricD,
            `${m.totalCorrect}/${m.totalQuestions}`,
            `${m.percent}%`
          );
        } else {
          row.push("-", "-", "-", "-", "-", "-", "-", "-", "-", "-");
        }
      });

      return row.join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_Review_Quiz_Fukushuu_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#8f0020]/10 text-[#8f0020] uppercase tracking-wider flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              Rubrik Evaluasi Komprehensif
            </span>
            <span className="text-xs text-slate-400 font-semibold">• 120 Butir Soal</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-[#8f0020]" />
            Rekap Skor Review Quiz Mahasiswa (Fukushuu Modul 1 – 6)
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
            onClick={handleExportCSV}
            disabled={!data || !data.students.length}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 cursor-pointer transition-all active:scale-95 shadow-2xs disabled:opacity-50"
            title="Download file spreadsheet CSV"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
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
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari mahasiswa berdasarkan nama atau email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 placeholder-slate-400 bg-white focus:border-[#8f0020] outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer p-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
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

        {/* Module View Tabs: Semua Modul vs Modul 1..6 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            Tampilan:
          </span>

          <button
            onClick={() => setActiveModuleTab("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 cursor-pointer ${
              activeModuleTab === "all"
                ? "bg-[#8f0020] text-white border-[#8f0020] shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
          >
            Semua Modul (Komprehensif A–D)
          </button>

          {[1, 2, 3, 4, 5, 6].map((mNum) => (
            <button
              key={mNum}
              onClick={() => setActiveModuleTab(mNum)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 cursor-pointer ${
                activeModuleTab === mNum
                  ? "bg-[#8f0020] text-white border-[#8f0020] shadow-xs"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              Fokus Modul {mNum}
            </button>
          ))}
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
            onClick={loadReport}
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
                  {[1, 2, 3, 4, 5, 6].map((mNum) => (
                    <th
                      key={mNum}
                      colSpan={4}
                      className="py-2.5 px-2 text-center border-r border-slate-200 bg-slate-50/90 font-black text-slate-800"
                    >
                      Modul {mNum}
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
                  {[1, 2, 3, 4, 5, 6].map((mNum) => (
                    <React.Fragment key={mNum}>
                      <th className="py-1.5 px-2 text-center border-r border-slate-100" title="Bagian A: Menyusun Kalimat (Maks 5)">
                        A
                      </th>
                      <th className="py-1.5 px-2 text-center border-r border-slate-100" title="Bagian B: Grouping Semantik (Maks 5)">
                        B
                      </th>
                      <th className="py-1.5 px-2 text-center border-r border-slate-100" title="Bagian C: Makna Jukugo (Maks 5)">
                        C
                      </th>
                      <th className="py-1.5 px-2 text-center border-r border-slate-200" title="Bagian D: Melengkapi Kalimat (Maks 5)">
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

                    {/* Modul 1 to 6 Scores */}
                    {[1, 2, 3, 4, 5, 6].map((mNum) => {
                      const m = std.modules[mNum];
                      if (!std.hasAttempted && !std.isDraft) {
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
                                m.correctA
                              )}`}
                              title={`Modul ${mNum} Bagian A: ${m.correctA}/5 benar (${m.rubricA}% rubrik)`}
                            >
                              {m.correctA}
                            </span>
                          </td>
                          <td className="py-3 px-1.5 text-center border-r border-slate-100">
                            <span
                              className={`px-1.5 py-0.5 rounded-md font-black text-[11px] border inline-block ${getScoreCellBadge(
                                m.correctB
                              )}`}
                              title={`Modul ${mNum} Bagian B: ${m.correctB}/5 benar (${m.rubricB}% rubrik)`}
                            >
                              {m.correctB}
                            </span>
                          </td>
                          <td className="py-3 px-1.5 text-center border-r border-slate-100">
                            <span
                              className={`px-1.5 py-0.5 rounded-md font-black text-[11px] border inline-block ${getScoreCellBadge(
                                m.correctC
                              )}`}
                              title={`Modul ${mNum} Bagian C: ${m.correctC}/5 benar (${m.rubricC}% rubrik)`}
                            >
                              {m.correctC}
                            </span>
                          </td>
                          <td className="py-3 px-1.5 text-center border-r border-slate-200">
                            <span
                              className={`px-1.5 py-0.5 rounded-md font-black text-[11px] border inline-block ${getScoreCellBadge(
                                m.correctD
                              )}`}
                              title={`Modul ${mNum} Bagian D: ${m.correctD}/5 benar (${m.rubricD}% rubrik)`}
                            >
                              {m.correctD}
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
                            {std.totalCorrect}/120
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
                    <span className="text-[9px] font-normal lowercase text-slate-400">skor /5 • rubrik /4.2%</span>
                  </th>
                  <th className="py-3.5 px-3 text-center">
                    Bagian B (Semantik)<br />
                    <span className="text-[9px] font-normal lowercase text-slate-400">skor /5 • rubrik /4.2%</span>
                  </th>
                  <th className="py-3.5 px-3 text-center">
                    Bagian C (Makna)<br />
                    <span className="text-[9px] font-normal lowercase text-slate-400">skor /5 • rubrik /4.2%</span>
                  </th>
                  <th className="py-3.5 px-3 text-center">
                    Bagian D (Rumpang)<br />
                    <span className="text-[9px] font-normal lowercase text-slate-400">skor /5 • rubrik /4.2%</span>
                  </th>
                  <th className="py-3.5 px-3 text-center">
                    Total Modul {activeModuleTab}<br />
                    <span className="text-[9px] font-normal lowercase text-slate-400">maks 20 butir</span>
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
                  const hasAttempt = std.hasAttempted || std.isDraft;

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
                            <span className="font-black text-slate-900 text-xs block">{m.correctA} / 5</span>
                            <span className="text-[10px] text-slate-400 font-bold">{m.rubricA}%</span>
                          </div>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        {hasAttempt ? (
                          <div>
                            <span className="font-black text-slate-900 text-xs block">{m.correctB} / 5</span>
                            <span className="text-[10px] text-slate-400 font-bold">{m.rubricB}%</span>
                          </div>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        {hasAttempt ? (
                          <div>
                            <span className="font-black text-slate-900 text-xs block">{m.correctC} / 5</span>
                            <span className="text-[10px] text-slate-400 font-bold">{m.rubricC}%</span>
                          </div>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        {hasAttempt ? (
                          <div>
                            <span className="font-black text-slate-900 text-xs block">{m.correctD} / 5</span>
                            <span className="text-[10px] text-slate-400 font-bold">{m.rubricD}%</span>
                          </div>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-center font-black text-slate-900">
                        {hasAttempt ? `${m.totalCorrect} / 20` : "-"}
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
                    ? `${selectedStudent.totalCorrect} / 120`
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

            {/* Comprehensive Breakdown Table Modul 1-6 */}
            <div className="flex-1 overflow-y-auto pr-1">
              <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#8f0020]" />
                Rincian Pemetaan Modul 1 sampai Modul 6 (Bagian A – D)
              </h5>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <th className="py-3 px-3">Modul</th>
                      <th className="py-3 px-2 text-center" title="Bagian A (Susun Kalimat)">
                        A (Susun)<br />
                        <span className="text-[9px] font-normal lowercase text-slate-400">/5</span>
                      </th>
                      <th className="py-3 px-2 text-center" title="Bagian B (Grouping Semantik)">
                        B (Semantik)<br />
                        <span className="text-[9px] font-normal lowercase text-slate-400">/5</span>
                      </th>
                      <th className="py-3 px-2 text-center" title="Bagian C (Makna Jukugo)">
                        C (Makna)<br />
                        <span className="text-[9px] font-normal lowercase text-slate-400">/5</span>
                      </th>
                      <th className="py-3 px-2 text-center" title="Bagian D (Konteks Kalimat)">
                        D (Rumpang)<br />
                        <span className="text-[9px] font-normal lowercase text-slate-400">/5</span>
                      </th>
                      <th className="py-3 px-2.5 text-center">
                        Total<br />
                        <span className="text-[9px] font-normal lowercase text-slate-400">/20</span>
                      </th>
                      <th className="py-3 px-2.5 text-center">Persentase</th>
                      <th className="py-3 px-3 text-right">Kemahiran</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {[1, 2, 3, 4, 5, 6].map((mNum) => {
                      const m = selectedStudent.modules[mNum];
                      const hasData = selectedStudent.hasAttempted || selectedStudent.isDraft;

                      return (
                        <tr key={mNum} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-3 font-extrabold text-slate-900">
                            {m?.moduleTitle || `Modul ${mNum}`}
                          </td>
                          <td className="py-3 px-2 text-center font-bold">
                            {hasData ? (
                              <span className={m.correctA >= 4 ? "text-emerald-700 font-black" : "text-slate-800"}>
                                {m.correctA}/5
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="py-3 px-2 text-center font-bold">
                            {hasData ? (
                              <span className={m.correctB >= 4 ? "text-emerald-700 font-black" : "text-slate-800"}>
                                {m.correctB}/5
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="py-3 px-2 text-center font-bold">
                            {hasData ? (
                              <span className={m.correctC >= 4 ? "text-emerald-700 font-black" : "text-slate-800"}>
                                {m.correctC}/5
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="py-3 px-2 text-center font-bold">
                            {hasData ? (
                              <span className={m.correctD >= 4 ? "text-emerald-700 font-black" : "text-slate-800"}>
                                {m.correctD}/5
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="py-3 px-2.5 text-center font-black text-slate-900">
                            {hasData ? `${m.totalCorrect}/20` : "-"}
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
