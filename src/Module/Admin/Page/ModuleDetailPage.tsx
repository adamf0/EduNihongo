import React, { useState, useEffect } from "react";
import Layout from "../../Common/Component/Organism/Layout";
import Icon from "../../Common/Component/Icon";
import { api } from "../../Common/Utility/api";
import { useNavigate, useSearchParams } from "react-router-dom";

interface ModuleData {
  id: number;
  title: string;
}

interface KanjiData {
  id: number;
  character: string;
  romaji: string;
  meaning: string;
  isJukugo: boolean;
  border: string | null;
  moduleId: number | null;
  examples: any[];
  graphNodes: any[];
  graphEdges: any[];
}

export const ModuleDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const moduleIdStr = searchParams.get("id");
  const moduleId = moduleIdStr ? parseInt(moduleIdStr, 10) : null;

  const [module, setModule] = useState<ModuleData | null>(null);
  const [kanjis, setKanjis] = useState<KanjiData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // LMS Admin state
  const [activeTab, setActiveTab] = useState<"kanjis" | "assignments" | "submissions" | "discussions">("kanjis");
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  
  // Assignment Modal & Form states
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedAssign, setSelectedAssign] = useState<any>(null);
  const [assignTitle, setAssignTitle] = useState("");
  const [assignDesc, setAssignDesc] = useState("");
  const [assignDueDate, setAssignDueDate] = useState("");
  const [assignKanjiId, setAssignKanjiId] = useState<string>(""); // empty string means Module-level

  // Grading Modal & Form states
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [subGrade, setSubGrade] = useState("");
  const [subFeedback, setSubFeedback] = useState("");

  // Post Discussion Comment state
  const [newComment, setNewComment] = useState("");

  const loadModuleAndKanjis = async () => {
    if (!moduleId) {
      setError("ID Modul tidak valid.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError("");
      
      // Fetch modules to find name
      const allModules = await api.admin.modules.list();
      const currentMod = allModules.find((m: any) => m.id === moduleId);
      if (!currentMod) {
        setError("Modul tidak ditemukan.");
        setLoading(false);
        return;
      }
      setModule(currentMod);

      // Fetch Kanjis filter by module ID
      const allKanjis = await api.admin.kanjis.list();
      const filtered = allKanjis.filter((k: any) => k.moduleId === moduleId);
      setKanjis(filtered);

      // Load assignments, submissions, and discussions
      const assigns = await api.lms.assignments.list({ moduleId });
      setAssignments(assigns);

      const subs = await api.lms.submissions.list({});
      const filteredSubs = subs.filter((s: any) => s.assignment?.moduleId === moduleId);
      setSubmissions(filteredSubs);

      // Load discussions for module
      const modComms = await api.lms.comments.list({ moduleId });
      // Load discussions for kanjis in module
      const kanjiCommsPromises = filtered.map((kj: any) => api.lms.comments.list({ kanjiId: kj.id }).catch(() => []));
      const kanjiCommsResults = await Promise.all(kanjiCommsPromises);
      const allComms = [...modComms, ...kanjiCommsResults.flat()];
      allComms.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      setComments(allComms);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal memuat detail modul.");
      if (err.message?.includes("Token") || err.message?.includes("Akses ditolak")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModuleAndKanjis();
  }, [moduleId, navigate]);

  const loadLmsData = async () => {
    if (!moduleId) return;
    try {
      const assigns = await api.lms.assignments.list({ moduleId });
      setAssignments(assigns);

      const subs = await api.lms.submissions.list({});
      const filteredSubs = subs.filter((s: any) => s.assignment?.moduleId === moduleId);
      setSubmissions(filteredSubs);

      // Load discussions for module
      const modComms = await api.lms.comments.list({ moduleId });
      // Load discussions for kanjis in module
      const kanjiCommsPromises = kanjis.map((kj: any) => api.lms.comments.list({ kanjiId: kj.id }).catch(() => []));
      const kanjiCommsResults = await Promise.all(kanjiCommsPromises);
      const allComms = [...modComms, ...kanjiCommsResults.flat()];
      allComms.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      setComments(allComms);
    } catch (err) {
      console.error("Gagal memuat data LMS admin:", err);
    }
  };

  const handleDeleteKanji = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus kanji ini beserta seluruh progres dan grafik terkait?")) {
      return;
    }
    try {
      setLoading(true);
      await api.admin.kanjis.delete(id);
      loadModuleAndKanjis();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus kanji.");
      setLoading(false);
    }
  };

  // Assignment handlers
  const openAddAssignModal = () => {
    setSelectedAssign(null);
    setAssignTitle("");
    setAssignDesc("");
    setAssignDueDate("");
    setAssignKanjiId("");
    setIsAssignModalOpen(true);
  };

  const openEditAssignModal = (assign: any) => {
    setSelectedAssign(assign);
    setAssignTitle(assign.title);
    setAssignDesc(assign.description);
    setAssignDueDate(assign.dueDate ? new Date(assign.dueDate).toISOString().split("T")[0] : "");
    setAssignKanjiId(assign.kanjiId ? assign.kanjiId.toString() : "");
    setIsAssignModalOpen(true);
  };

  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTitle.trim() || !assignDesc.trim() || !moduleId) {
      alert("Judul dan deskripsi wajib diisi.");
      return;
    }

    const payload = {
      title: assignTitle,
      description: assignDesc,
      dueDate: assignDueDate || null,
      moduleId,
      kanjiId: assignKanjiId ? parseInt(assignKanjiId, 10) : null
    };

    try {
      if (selectedAssign) {
        await api.lms.assignments.update(selectedAssign.id, payload);
      } else {
        await api.lms.assignments.create(payload);
      }
      setIsAssignModalOpen(false);
      loadLmsData();
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan tugas.");
    }
  };

  const handleDeleteAssignment = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus tugas ini? Seluruh jawaban pengumpulan mahasiswa juga akan terhapus.")) {
      return;
    }
    try {
      await api.lms.assignments.delete(id);
      loadLmsData();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus tugas.");
    }
  };

  // Grading handlers
  const openGradeModal = (sub: any) => {
    setSelectedSubmission(sub);
    setSubGrade(sub.grade || "");
    setSubFeedback(sub.feedback || "");
    setIsGradeModalOpen(true);
  };

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    try {
      await api.lms.submissions.grade(selectedSubmission.id, {
        grade: subGrade || null,
        feedback: subFeedback || null
      });
      setIsGradeModalOpen(false);
      loadLmsData();
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan penilaian.");
    }
  };

  // Comment handlers
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !moduleId) return;

    try {
      const res = await api.lms.comments.create({
        content: newComment,
        moduleId
      });
      setComments(prev => [...prev, res]);
      setNewComment("");
    } catch (err: any) {
      alert(err.message || "Gagal mengirim komentar.");
    }
  };

  const handleDeleteComment = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus komentar ini?")) return;

    try {
      await api.lms.comments.delete(id);
      setComments(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      alert(err.message || "Gagal menghapus komentar.");
    }
  };

  if (loading && !module) {
    return (
      <Layout>
        <div className="flex-grow flex items-center justify-center min-h-[400px]">
          <div className="text-primary font-bold animate-pulse text-lg">Memuat Detail Modul...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="flex-grow w-full px-4 md:px-6 max-w-[1200px] mx-auto py-6 select-text text-left">
        <div className="flex flex-col gap-base">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-base border-b border-outline-variant/30 pb-base">
            <div>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface flex items-center gap-sm">
                <Icon name="folder_open" className="text-primary text-3xl" />
                Detail Modul: {module?.title || "Loading..."}
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Kelola kurikulum daftar karakter kanji, contoh kalimat, tugas LMS, dan diskusi mahasiswa pada modul ini.
              </p>
            </div>
            <button
              onClick={() => navigate("/admin")}
              className="px-4 py-2 border border-outline hover:bg-surface-container transition-all cursor-pointer font-bold text-on-surface bg-transparent rounded-lg flex items-center gap-sm text-sm"
            >
              <Icon name="arrow_back" className="text-lg" />
              Kembali ke Kelola Modul
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-error-container text-on-error-container border border-error/20 rounded-xl font-semibold">
              {error}
            </div>
          )}

          {/* LMS Admin Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-outline-variant/30 pb-2">
            <button
              onClick={() => setActiveTab("kanjis")}
              className={`px-4 py-2 font-bold text-sm rounded-lg border-none cursor-pointer select-none transition-all ${
                activeTab === "kanjis"
                  ? "bg-[#8f0020] text-white shadow-sm"
                  : "bg-transparent text-slate-600 hover:bg-slate-100"
              }`}
            >
              Daftar Kanji ({kanjis.length})
            </button>
            <button
              onClick={() => setActiveTab("assignments")}
              className={`px-4 py-2 font-bold text-sm rounded-lg border-none cursor-pointer select-none transition-all ${
                activeTab === "assignments"
                  ? "bg-[#8f0020] text-white shadow-sm"
                  : "bg-transparent text-slate-600 hover:bg-slate-100"
              }`}
            >
              Tugas LMS ({assignments.length})
            </button>
            <button
              onClick={() => setActiveTab("submissions")}
              className={`px-4 py-2 font-bold text-sm rounded-lg border-none cursor-pointer select-none transition-all ${
                activeTab === "submissions"
                  ? "bg-[#8f0020] text-white shadow-sm"
                  : "bg-transparent text-slate-600 hover:bg-slate-100"
              }`}
            >
              Pengumpulan Tugas ({submissions.length})
            </button>
            <button
              onClick={() => setActiveTab("discussions")}
              className={`px-4 py-2 font-bold text-sm rounded-lg border-none cursor-pointer select-none transition-all ${
                activeTab === "discussions"
                  ? "bg-[#8f0020] text-white shadow-sm"
                  : "bg-transparent text-slate-600 hover:bg-slate-100"
              }`}
            >
              Forum Diskusi ({comments.length})
            </button>
          </div>

          {/* TAB 1: KANJIS */}
          {activeTab === "kanjis" && (
            <div className="flex flex-col gap-md">
              <div className="flex justify-between items-center">
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                  Daftar Kanji Terdaftar
                </h3>
                <button
                  onClick={() => navigate(`/admin/kanji-form?moduleId=${moduleId}`)}
                  className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-bold shadow-md cursor-pointer hover:brightness-110 active:scale-95 transition-all border-none flex items-center gap-sm text-sm"
                >
                  <Icon name="add" className="text-lg" />
                  Tambah Kanji Baru
                </button>
              </div>

              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[850px]">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant/20 text-label-md text-on-surface-variant font-semibold">
                      <th className="p-4 w-24 text-center">Kanji</th>
                      <th className="p-4">Romaji</th>
                      <th className="p-4">Arti / Terjemahan</th>
                      <th className="p-4">Struktur Simpul (Nodes)</th>
                      <th className="p-4 w-36 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 text-body-md text-on-surface">
                    {kanjis.map((kj) => (
                      <tr key={kj.id} className="hover:bg-surface-container-low/50">
                        <td className="p-4 text-center">
                          <span className="font-display-kanji text-4xl block font-normal text-on-surface">
                            {kj.character}
                          </span>
                        </td>
                        <td className="p-4 font-bold">{kj.romaji}</td>
                        <td className="p-4 text-on-surface-variant text-sm">{kj.meaning}</td>

                        <td className="p-4 text-xs text-slate-500 font-mono">
                          {kj.graphNodes.length} Nodes • {kj.graphEdges.length} Edges
                        </td>
                        <td className="p-4 text-center flex items-center justify-center gap-sm">
                          <button
                            onClick={() => navigate(`/admin/kanji-form?moduleId=${moduleId}&kanjiId=${kj.id}`)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg cursor-pointer bg-transparent border-none"
                            title="Edit Kanji"
                          >
                            <Icon name="edit" className="text-xl" />
                          </button>
                          <button
                            onClick={() => handleDeleteKanji(kj.id)}
                            className="p-2 text-error hover:bg-error/10 rounded-lg cursor-pointer bg-transparent border-none"
                            title="Hapus Kanji"
                          >
                            <Icon name="delete" className="text-xl" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {kanjis.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-on-surface-variant italic">
                          Belum ada Kanji yang terdaftar pada modul ini. Silakan tambah Kanji pertama Anda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ASSIGNMENTS */}
          {activeTab === "assignments" && (
            <div className="flex flex-col gap-md">
              <div className="flex justify-between items-center">
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                  Daftar Tugas Modul
                </h3>
                <button
                  onClick={openAddAssignModal}
                  className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-bold shadow-md cursor-pointer hover:brightness-110 active:scale-95 transition-all border-none flex items-center gap-sm text-sm"
                >
                  <Icon name="assignment" className="text-lg" />
                  Tambah Tugas Baru
                </button>
              </div>

              {assignments.length === 0 ? (
                <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/30 text-center text-on-surface-variant italic">
                  Belum ada tugas yang ditambahkan.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assignments.map((assign) => (
                    <div key={assign.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h4 className="font-black text-slate-800 text-lg leading-tight">{assign.title}</h4>
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                            assign.kanjiId ? "bg-slate-100 text-slate-700" : "bg-purple-100 text-purple-700"
                          }`}>
                            {assign.kanjiId ? `Kanji: ${assign.kanji?.character || ""}` : "Modul Utama"}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed mb-4">
                          {assign.description}
                        </p>
                      </div>
                      <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                        <div className="text-xs text-slate-400 font-bold">
                          Batas Waktu: {assign.dueDate ? new Date(assign.dueDate).toLocaleDateString("id-ID") : "Tidak ada"}
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => openEditAssignModal(assign)}
                            className="p-1.5 text-primary hover:bg-slate-50 rounded-lg cursor-pointer bg-transparent border-none"
                            title="Edit Tugas"
                          >
                            <Icon name="edit" className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDeleteAssignment(assign.id)}
                            className="p-1.5 text-error hover:bg-slate-50 rounded-lg cursor-pointer bg-transparent border-none"
                            title="Hapus Tugas"
                          >
                            <Icon name="delete" className="text-lg" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SUBMISSIONS */}
          {activeTab === "submissions" && (
            <div className="flex flex-col gap-md">
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                Tugas Mahasiswa yang Dikumpulkan
              </h3>

              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant/20 text-label-md text-on-surface-variant font-semibold">
                      <th className="p-4 w-44">Mahasiswa</th>
                      <th className="p-4 w-52">Tugas / Target</th>
                      <th className="p-4">Jawaban / Jawaban Tugas</th>
                      <th className="p-4 w-32 text-center">Status / Nilai</th>
                      <th className="p-4 w-28 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 text-body-md text-on-surface">
                    {submissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-surface-container-low/50 align-top">
                        <td className="p-4">
                          <div className="flex items-center gap-sm">
                            <img
                              src={sub.user?.avatar}
                              alt={sub.user?.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            />
                            <div className="min-w-0">
                              <span className="font-bold text-xs block text-slate-800">{sub.user?.name}</span>
                              <span className="text-[10px] text-slate-400 font-medium block truncate font-mono">{sub.user?.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-xs text-slate-700 block leading-snug">{sub.assignment?.title}</span>
                          <span className="text-[9px] text-slate-400 block font-mono mt-0.5">
                            Kumpul: {new Date(sub.submittedAt).toLocaleString("id-ID")}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-slate-600 font-medium whitespace-pre-wrap leading-relaxed">
                          {sub.content}
                        </td>
                        <td className="p-4 text-center">
                          {sub.grade ? (
                            <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                              Grade: {sub.grade}
                            </span>
                          ) : (
                            <span className="inline-block px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                              Belum Dinilai
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => openGradeModal(sub)}
                            className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-bold cursor-pointer hover:brightness-105 active:scale-95 transition-all border-none flex items-center justify-center gap-0.5 mx-auto"
                          >
                            <Icon name="grade" className="text-sm" />
                            Nilai
                          </button>
                        </td>
                      </tr>
                    ))}
                    {submissions.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-on-surface-variant italic">
                          Belum ada pengumpulan tugas dari mahasiswa.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: DISCUSSIONS */}
          {activeTab === "discussions" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Discussion Feed */}
              <div className="lg:col-span-8 bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
                <h3 className="font-extrabold text-slate-800 text-lg border-b border-slate-100 pb-3">Forum Diskusi Modul & Kanji</h3>
                
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 sidebar-scroll">
                  {comments.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 italic text-sm">
                      Belum ada komentar atau diskusi mahasiswa pada modul ini.
                    </div>
                  ) : (
                    comments.map((comm) => (
                      <div key={comm.id} className="flex gap-4 items-start border-b border-slate-50 pb-4">
                        <img
                          src={comm.user?.avatar}
                          alt={comm.user?.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-800 text-sm">{comm.user?.name}</span>
                              {comm.user?.role === "ADMIN" ? (
                                <span className="px-1.5 py-0.5 rounded-md bg-[#8f0020]/10 text-[#8f0020] text-[9px] font-black uppercase tracking-wider">Dosen</span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[9px] font-bold uppercase tracking-wider">Mahasiswa</span>
                              )}
                              {comm.kanjiId ? (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold">
                                  Kanji: {comm.kanji?.character || ""}
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded bg-purple-50 border border-purple-100 text-purple-700 text-[10px] font-bold">
                                  Modul Utama
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-400 font-bold font-mono">
                              {new Date(comm.createdAt).toLocaleString("id-ID")}
                            </span>
                          </div>
                          <p className="text-slate-600 text-sm font-medium mt-1 leading-relaxed whitespace-pre-wrap">
                            {comm.content}
                          </p>
                          <button
                            onClick={() => handleDeleteComment(comm.id)}
                            className="text-xs text-red-500 hover:text-red-700 bg-transparent border-none cursor-pointer mt-2 font-bold p-0 block"
                          >
                            Hapus Komentar
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handlePostComment} className="border-t border-slate-100 pt-4 flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Tulis komentar/umpan balik dosen untuk diskusi modul utama..."
                    className="flex-1 p-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8f0020]"
                    required
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 bg-[#8f0020] text-white rounded-xl font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer border-none flex items-center gap-1 text-sm"
                  >
                    Kirim
                  </button>
                </form>
              </div>

              {/* Discussion instructions card */}
              <div className="lg:col-span-4 bg-slate-50 border border-slate-100 rounded-2xl p-5 text-slate-600 text-sm space-y-3 leading-relaxed">
                <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide flex items-center gap-1.5">
                  <Icon name="info" className="text-primary text-base" />
                  Info Moderasi
                </h4>
                <p>
                  Sebagai <strong>Dosen/Admin</strong>, Anda memiliki hak penuh untuk memoderasi forum diskusi. Anda dapat:
                </p>
                <ul className="list-disc pl-4 space-y-1.5 font-medium text-xs">
                  <li>Membaca seluruh tanggapan mahasiswa di level modul utama maupun kanji spesifik.</li>
                  <li>Menjawab pertanyaan mahasiswa langsung dari halaman modul ini.</li>
                  <li>Menghapus komentar yang tidak pantas atau tidak relevan.</li>
                </ul>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ================= MODAL: ADD/EDIT ASSIGNMENT ================= */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-outline-variant/30 rounded-2xl p-6 max-w-2xl w-full shadow-2xl relative flex flex-col gap-4 text-left select-text">
            <button
              onClick={() => setIsAssignModalOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container transition-colors cursor-pointer border-none bg-transparent"
            >
              <Icon name="close" className="text-xl block" />
            </button>

            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
              {selectedAssign ? "Edit Tugas LMS" : "Tambah Tugas LMS Baru"}
            </h3>

            <form onSubmit={handleSaveAssignment} className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md font-bold text-on-surface">
                  Judul Tugas
                </label>
                <input
                  type="text"
                  value={assignTitle}
                  onChange={(e) => setAssignTitle(e.target.value)}
                  className="bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl p-3 w-full focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-sm"
                  placeholder="Contoh: Tugas Menulis Kanji"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md font-bold text-on-surface">
                  Deskripsi / Instruksi Tugas
                </label>
                <textarea
                  value={assignDesc}
                  onChange={(e) => setAssignDesc(e.target.value)}
                  rows={4}
                  className="bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl p-3 w-full focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-sm"
                  placeholder="Tuliskan petunjuk pengerjaan tugas di sini..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md font-bold text-on-surface">
                    Batas Waktu (Due Date)
                  </label>
                  <input
                    type="date"
                    value={assignDueDate}
                    onChange={(e) => setAssignDueDate(e.target.value)}
                    className="bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl p-3 w-full focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-sm cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md font-bold text-on-surface">
                    Target Penugasan
                  </label>
                  <select
                    value={assignKanjiId}
                    onChange={(e) => setAssignKanjiId(e.target.value)}
                    className="bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl p-3 w-full focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-sm cursor-pointer"
                  >
                    <option value="">-- Modul Utama (Tingkat Modul) --</option>
                    {kanjis.map((kj) => (
                      <option key={kj.id} value={kj.id}>
                        Kanji: {kj.character} ({kj.meaning})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-6 py-2.5 border border-outline hover:bg-slate-100 rounded-xl transition-all cursor-pointer font-bold text-slate-600 bg-transparent text-sm border-none"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold shadow-md cursor-pointer hover:brightness-110 active:scale-95 transition-all border-none text-sm"
                >
                  Simpan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: GRADE SUBMISSION ================= */}
      {isGradeModalOpen && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-outline-variant/30 rounded-2xl p-6 max-w-xl w-full shadow-2xl relative flex flex-col gap-4 text-left select-text">
            <button
              onClick={() => setIsGradeModalOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container transition-colors cursor-pointer border-none bg-transparent"
            >
              <Icon name="close" className="text-xl block" />
            </button>

            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
              Penilaian Tugas
            </h3>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs space-y-2 text-slate-600 font-medium">
              <p><strong>Nama Mahasiswa:</strong> {selectedSubmission.user?.name}</p>
              <p><strong>Tugas:</strong> {selectedSubmission.assignment?.title}</p>
              <p className="border-t border-slate-200/60 pt-2 font-mono whitespace-pre-wrap leading-relaxed">
                <strong>Jawaban Mahasiswa:</strong><br />
                {selectedSubmission.content}
              </p>
            </div>

            <form onSubmit={handleSaveGrade} className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md font-bold text-on-surface">
                  Nilai (Grade / Score)
                </label>
                <input
                  type="text"
                  value={subGrade}
                  onChange={(e) => setSubGrade(e.target.value)}
                  className="bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl p-3 w-full focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-sm"
                  placeholder="Contoh: A, A+, atau 0-100 (misal: 95)"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md font-bold text-on-surface">
                  Catatan Umpan Balik (Feedback Dosen)
                </label>
                <textarea
                  value={subFeedback}
                  onChange={(e) => setSubFeedback(e.target.value)}
                  rows={3}
                  className="bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl p-3 w-full focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-sm"
                  placeholder="Berikan umpan balik konstruktif untuk mahasiswa..."
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsGradeModalOpen(false)}
                  className="px-6 py-2.5 border border-outline hover:bg-slate-100 rounded-xl transition-all cursor-pointer font-bold text-slate-600 bg-transparent text-sm border-none"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold shadow-md cursor-pointer hover:brightness-110 active:scale-95 transition-all border-none text-sm"
                >
                  Simpan Penilaian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </Layout>
  );
};

export default ModuleDetailPage;
