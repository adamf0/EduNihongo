import React, { useState, useEffect } from "react";
import Layout from "../../Common/Component/Organism/Layout";
import { api } from "../../Common/Utility/api";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Layers,
  Sparkles,
  Save,
  X,
  AlertCircle,
  ListChecks,
} from "lucide-react";

export const ReviewQuizAdminPage: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [moduleOptions, setModuleOptions] = useState<any[]>([]);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<any | null>(null);

  // Form fields
  const [judul, setJudul] = useState("");
  const [peletakanSetelahModul, setPeletakanSetelahModul] = useState<number>(6);
  const [deskripsi, setDeskripsi] = useState("");
  const [targetScore, setTargetScore] = useState<number>(60);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // Submitting state
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [quizList, modsData] = await Promise.all([
        api.reviewQuiz.adminList(),
        api.admin.modules.list(),
      ]);

      setQuizzes(quizList);
      setModuleOptions(modsData || []);
    } catch (err: any) {
      console.error("Error loading admin review quizzes:", err);
      setError(err.message || "Gagal memuat data review quiz.");
      if (err.message?.includes("Token") || err.message?.includes("Akses ditolak")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingQuiz(null);
    setJudul("");
    setPeletakanSetelahModul(6);
    setDeskripsi("");
    setTargetScore(60);
    setIsOpen(true);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (q: any) => {
    setEditingQuiz(q);
    setJudul(q.judul || "");
    setPeletakanSetelahModul(q.peletakanSetelahModul || 6);
    setDeskripsi(q.deskripsi || "");
    setTargetScore(q.targetScore || 60);
    setIsOpen(q.isOpen !== false);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim()) {
      setFormError("Judul Review Quiz wajib diisi.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      const payload = {
        id: editingQuiz ? editingQuiz.id : undefined,
        judul: judul.trim(),
        peletakanSetelahModul: Number(peletakanSetelahModul),
        deskripsi: deskripsi.trim(),
        durasiMenit: 0,
        targetScore: Number(targetScore),
        isOpen: Boolean(isOpen),
      };

      await api.reviewQuiz.adminSave(payload);
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      console.error("Error saving review quiz:", err);
      setFormError(err.message || "Gagal menyimpan review quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, quizTitle: string) => {
    if (!window.confirm(`Yakin ingin menghapus review quiz "${quizTitle}"?`)) {
      return;
    }

    try {
      await api.reviewQuiz.adminDelete(id);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus review quiz.");
    }
  };

  return (
    <Layout>
      <div className="w-full min-h-screen bg-slate-50/50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#8f0020] text-white text-[10px] font-black tracking-widest px-2.5 py-0.5 rounded-md uppercase">
                  ADMIN LMS
                </span>
                <span className="text-xs font-semibold text-slate-500">Kelola Review & Evaluasi</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 mt-1">
                Kelola Review Quiz (Fukushuu)
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Atur judul, peletakan modul review, bobot nilai, dan daftar pertanyaan review materi.
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="bg-[#8f0020] hover:brightness-110 active:scale-95 text-white px-5 py-3 rounded-2xl font-bold text-xs shadow-md shadow-[#8f0020]/20 flex items-center gap-2 border-none cursor-pointer transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              Tambah Review Quiz
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              {error}
            </div>
          )}

          {/* Table List of Review Quizzes */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#8f0020]" />
                Daftar Review Quiz Aktif ({quizzes.length})
              </h2>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-400 font-bold text-sm">
                Memuat data review quiz...
              </div>
            ) : quizzes.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-sm text-slate-600">Belum ada review quiz</p>
                <p className="text-xs text-slate-400 mt-1">
                  Klik tombol "Tambah Review Quiz" di atas untuk menambahkan.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                      <th className="py-3.5 px-5">Judul Review</th>
                      <th className="py-3.5 px-4">Peletakan Setelah</th>
                      <th className="py-3.5 px-4 text-center">Total Soal</th>
                      <th className="py-3.5 px-4 text-center">Target Lulus</th>
                      <th className="py-3.5 px-5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {quizzes.map((q) => {
                      // Find matched module title
                      const matchedMod = moduleOptions.find(
                        (m) => m.id === q.peletakanSetelahModul
                      );
                      const modLabel = matchedMod
                        ? matchedMod.title
                        : `Modul ke-${q.peletakanSetelahModul}`;

                      return (
                        <tr key={q.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-4 px-5">
                            <span className="font-extrabold text-sm text-slate-900 block">
                              {q.judul}
                            </span>
                            <span className="text-[11px] text-slate-400 block line-clamp-1">
                              {q.deskripsi || "Tanpa deskripsi"}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-indigo-50 border border-indigo-200 text-indigo-800 font-bold px-2.5 py-1 rounded-lg text-[11px] inline-flex items-center gap-1">
                              Setelah: {modLabel}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="font-black text-slate-800 text-sm">
                              {q._count?.questions || q.totalSoal}
                            </span>
                            <span className="text-[10px] text-slate-400 block">butir</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              ≥ {q.targetScore}%
                            </span>
                          </td>
                          <td className="py-4 px-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => navigate(`/admin/review-quiz/${q.id}/questions`)}
                                className="px-3 py-1.5 rounded-xl font-bold text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200/60 cursor-pointer transition-all flex items-center gap-1.5"
                                title="Buka Halaman Kelola Daftar 120 Soal"
                              >
                                <ListChecks className="w-3.5 h-3.5" />
                                <span>Kelola Soal</span>
                              </button>
                              <button
                                onClick={() => openEditModal(q)}
                                className="p-2 rounded-xl text-slate-500 hover:text-[#8f0020] hover:bg-rose-50 border-none bg-transparent cursor-pointer transition-all"
                                title="Edit Pengaturan"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(q.id, q.judul)}
                                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border-none bg-transparent cursor-pointer transition-all"
                                title="Hapus Review Quiz"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Modal Edit / Add Review Quiz */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-2xl shadow-2xl flex flex-col gap-4 animate-scale-up border border-slate-100 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#8f0020]" />
                {editingQuiz ? "Edit Review Quiz" : "Tambah Review Quiz Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 border-none bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-extrabold text-slate-700">
                  Judul Review Quiz <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Contoh: Fukushuu Modul 1 - 6"
                  className="p-2.5 rounded-xl border border-slate-300 text-slate-800 focus:border-[#8f0020] outline-none font-bold"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-extrabold text-slate-700">
                  Peletakan Setelah Modul <span className="text-rose-500">*</span>
                </label>
                <select
                  value={peletakanSetelahModul}
                  onChange={(e) => setPeletakanSetelahModul(Number(e.target.value))}
                  className="p-2.5 rounded-xl border border-slate-300 text-slate-800 focus:border-[#8f0020] outline-none font-semibold bg-white cursor-pointer"
                >
                  {moduleOptions.map((mod) => (
                    <option key={mod.id} value={mod.id}>
                      Setelah {mod.title}
                    </option>
                  ))}
                  {/* Fallback option by index */}
                  <option value={6}>Setelah Modul ke-6</option>
                </select>
                <span className="text-[10px] text-slate-400">
                  Node card review quiz akan disisipkan di alur belajar (/#/module) tepat setelah modul yang dipilih.
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-extrabold text-slate-700">Deskripsi / Petunjuk</label>
                <textarea
                  rows={3}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Deskripsi materi ujian review..."
                  className="p-2.5 rounded-xl border border-slate-300 text-slate-800 focus:border-[#8f0020] outline-none leading-relaxed"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-extrabold text-slate-700">Target Kelulusan (%)</label>
                <input
                  type="number"
                  value={targetScore}
                  onChange={(e) => setTargetScore(Number(e.target.value))}
                  className="p-2.5 rounded-xl border border-slate-300 text-slate-800 focus:border-[#8f0020] outline-none font-bold"
                  min={0}
                  max={100}
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isOpenCheck"
                  checked={isOpen}
                  onChange={(e) => setIsOpen(e.target.checked)}
                  className="w-4 h-4 rounded text-[#8f0020] cursor-pointer"
                />
                <label htmlFor="isOpenCheck" className="font-bold text-slate-700 cursor-pointer">
                  Buka akses Review Quiz untuk mahasiswa
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border-none cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#8f0020] hover:brightness-110 border-none cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  {submitting ? "Menyimpan..." : "Simpan Pengaturan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ReviewQuizAdminPage;
