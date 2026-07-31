import React, { useState, useEffect } from "react";
import Layout from "../../Common/Component/Organism/Layout";
import Icon from "../../Common/Component/Icon";
import { api } from "../../Common/Utility/api";
import { useNavigate, useSearchParams } from "react-router-dom";

interface ModuleData {
  id: number;
  title: string;
  tujuanPembelajaran?: string | null;
}

interface KanjiData {
  id: number;
  character: string;
  romaji: string;
  meaning: string;
  isJukugo: boolean;
  border: string | null;
  moduleId: number | null;
  examples?: any[];
  graphNodes?: any[];
  graphEdges?: any[];
}

const getFileUrl = (pathUrl: string | null | undefined) => {
  if (!pathUrl) return "";
  const origin = window.location.hostname === "localhost" ? "http://localhost:5001" : window.location.origin;
  return `${origin}${pathUrl}`;
};

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
  const [activeTab, setActiveTab] = useState<"lms-curriculum" | "kanji-list" | "submissions">("lms-curriculum");
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);

  // Local Loading & Error States
  const [loadingLmsData, setLoadingLmsData] = useState(false);
  const [lmsDataError, setLmsDataError] = useState("");
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [submissionsError, setSubmissionsError] = useState("");
  
  // Comments per task map
  const [commentsMap, setCommentsMap] = useState<Record<number, any[]>>({});
  const [newCommentTexts, setNewCommentTexts] = useState<Record<number, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});

  // Submissions filter state
  const [filterTaskId, setFilterTaskId] = useState<number | null>(null);

  // Assignment Modal & Form states
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedAssign, setSelectedAssign] = useState<any>(null);
  const [assignTitle, setAssignTitle] = useState("");
  const [assignDesc, setAssignDesc] = useState("");
  const [assignDueDate, setAssignDueDate] = useState("");
  const [assignKanjiId, setAssignKanjiId] = useState<string>(""); // empty string means Module-level
  const [isKanjiTargetLocked, setIsKanjiTargetLocked] = useState(false);
  const [assignFiles, setAssignFiles] = useState<File[]>([]);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [gdriveLink, setGdriveLink] = useState("");
  const [existingMaterials, setExistingMaterials] = useState<any[]>([]);

  // Grading Modal & Form states
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [subGrade, setSubGrade] = useState("");
  const [subFeedback, setSubFeedback] = useState("");

  // Add Kanji Modal states
  const [isAddKanjiModalOpen, setIsAddKanjiModalOpen] = useState(false);
  const [allAvailableKanjis, setAllAvailableKanjis] = useState<any[]>([]);
  const [selectedKanjiIdsToAdd, setSelectedKanjiIdsToAdd] = useState<number[]>([]);
  const [kanjiSearchTerm, setKanjiSearchTerm] = useState("");
  const [submittingAddKanji, setSubmittingAddKanji] = useState(false);

  const handleOpenAddKanjiModal = async () => {
    try {
      const list = await api.admin.kanjis.list();
      setAllAvailableKanjis(list);
      setSelectedKanjiIdsToAdd([]);
      setKanjiSearchTerm("");
      setIsAddKanjiModalOpen(true);
    } catch (err: any) {
      alert(err.message || "Gagal memuat daftar Kanji.");
    }
  };

  const handleSaveAddKanjiToModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedKanjiIdsToAdd.length === 0) {
      alert("Silakan pilih minimal 1 Kanji untuk ditambahkan ke modul ini.");
      return;
    }

    try {
      setSubmittingAddKanji(true);
      await Promise.all(
        selectedKanjiIdsToAdd.map((id) =>
          api.admin.kanjis.update(id, { moduleId: Number(moduleId) })
        )
      );
      setIsAddKanjiModalOpen(false);
      // Refresh kanjis in this module
      const updatedModule = await api.admin.modules.getDetail(Number(moduleId));
      setModule(updatedModule);
      setKanjis(updatedModule.kanjis || []);
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan Kanji ke modul.");
    } finally {
      setSubmittingAddKanji(false);
    }
  };

  const loadAssignmentsAndComments = async (isSilent = false) => {
    if (!moduleId) return;
    try {
      if (!isSilent) {
        setLoadingLmsData(true);
        setLmsDataError("");
      }
      
      // Load assignments for this module
      const assigns = await api.lms.assignments.list({ moduleId });
      setAssignments(assigns);

      // Load comments for each task
      const commentsPromises = assigns.map((assign: any) =>
        api.lms.comments.list({ assignmentId: assign.id })
          .then(comms => ({ id: assign.id, comms }))
          .catch(() => ({ id: assign.id, comms: [] }))
      );
      const commentsResults = await Promise.all(commentsPromises);
      const newMap: Record<number, any[]> = {};
      commentsResults.forEach(res => {
        newMap[res.id] = res.comms;
      });
      console.log("[LMS Admin Poll] Loaded comments map:", newMap);
      setCommentsMap(newMap);
    } catch (err: any) {
      console.error("Gagal memuat tugas LMS admin:", err);
      if (!isSilent) setLmsDataError(err.message || "Gagal memuat daftar tugas modul.");
    } finally {
      if (!isSilent) setLoadingLmsData(false);
    }
  };

  const loadSubmissionsData = async (isSilent = false) => {
    if (!moduleId) return;
    try {
      if (!isSilent) {
        setLoadingSubmissions(true);
        setSubmissionsError("");
      }
      
      // Load submissions
      const subs = await api.lms.submissions.list({});
      const filteredSubs = subs.filter((s: any) => s.assignment?.moduleId === moduleId);
      setSubmissions(filteredSubs);
    } catch (err: any) {
      console.error("Gagal memuat pengumpulan mahasiswa:", err);
      if (!isSilent) setSubmissionsError(err.message || "Gagal memuat data pengumpulan tugas.");
    } finally {
      if (!isSilent) setLoadingSubmissions(false);
    }
  };

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

      // Load LMS Data
      await Promise.all([
        loadAssignmentsAndComments(),
        loadSubmissionsData()
      ]);

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

  const loadLmsData = async () => {
    await Promise.all([
      loadAssignmentsAndComments(),
      loadSubmissionsData()
    ]);
  };

  useEffect(() => {
    loadModuleAndKanjis();
  }, [moduleId, navigate]);

  useEffect(() => {
    if (!moduleId) return;
    
    // Poll assignments, comments, and submissions every 4 seconds for realtime updates
    const intervalId = setInterval(() => {
      loadAssignmentsAndComments(true);
      loadSubmissionsData(true);
    }, 4000);

    return () => clearInterval(intervalId);
  }, [moduleId]);

  const handleDeleteKanji = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin mengeluarkan Kanji ini dari modul ini?")) {
      return;
    }
    try {
      setLoading(true);
      await api.admin.kanjis.update(id, { moduleId: null });
      await loadModuleAndKanjis();
    } catch (err: any) {
      alert(err.message || "Gagal mengeluarkan Kanji dari modul.");
      setLoading(false);
    }
  };

  // Assignment Modal launchers
  const openAddAssignModal = (targetKanjiId: number | null) => {
    setSelectedAssign(null);
    setAssignTitle("");
    setAssignDesc("");
    setAssignDueDate("");
    setAssignFiles([]);
    setYoutubeLink("");
    setGdriveLink("");
    setExistingMaterials([]);
    if (targetKanjiId !== null) {
      setAssignKanjiId(targetKanjiId.toString());
      setIsKanjiTargetLocked(true);
    } else {
      setAssignKanjiId("");
      setIsKanjiTargetLocked(true); // Locked because they clicked specifically on Module-level
    }
    setIsAssignModalOpen(true);
  };

  const openEditAssignModal = (assign: any) => {
    setSelectedAssign(assign);
    setAssignTitle(assign.title);
    setAssignDesc(assign.description);
    setAssignDueDate(assign.dueDate ? new Date(assign.dueDate).toISOString().split("T")[0] : "");
    setAssignKanjiId(assign.kanjiId ? assign.kanjiId.toString() : "");
    setIsKanjiTargetLocked(true);
    setAssignFiles([]);
    
    // Parse materials
    let mats = [];
    if (assign.materialsData) {
      try {
        mats = JSON.parse(assign.materialsData);
      } catch (e) {}
    } else if (assign.fileUrl) {
      mats = [{ type: "file", url: assign.fileUrl, name: "Lampiran Tugas" }];
    }
    setExistingMaterials(mats);

    const yt = mats.find((m: any) => m.type === "youtube")?.url || "";
    const gd = mats.find((m: any) => m.type === "gdrive")?.url || "";
    setYoutubeLink(yt);
    setGdriveLink(gd);

    setIsAssignModalOpen(true);
  };

  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTitle.trim() || !assignDesc.trim() || !moduleId) {
      alert("Judul dan deskripsi wajib diisi.");
      return;
    }

    const formData = new FormData();
    formData.append("title", assignTitle);
    formData.append("description", assignDesc);
    if (assignDueDate) formData.append("dueDate", assignDueDate);
    formData.append("moduleId", moduleId.toString());
    if (assignKanjiId) formData.append("kanjiId", assignKanjiId);
    
    formData.append("youtubeLink", youtubeLink);
    formData.append("gdriveLink", gdriveLink);

    // Keep existing files that are still present
    const filesToKeep = existingMaterials.filter((m: any) => m.type === "file");
    formData.append("keepMaterials", JSON.stringify(filesToKeep));

    // Append newly selected files
    assignFiles.forEach((file) => {
      formData.append("materialFiles", file);
    });

    try {
      if (selectedAssign) {
        await api.lms.assignments.update(selectedAssign.id, formData);
      } else {
        await api.lms.assignments.create(formData);
      }
      setIsAssignModalOpen(false);
      setAssignFiles([]);
      setYoutubeLink("");
      setGdriveLink("");
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
  const handlePostTaskComment = async (e: React.FormEvent, taskId: number) => {
    e.preventDefault();
    const commentText = newCommentTexts[taskId];
    if (!commentText || !commentText.trim()) return;

    try {
      const res = await api.lms.comments.create({
        content: commentText,
        assignmentId: taskId
      });
      setCommentsMap(prev => ({
        ...prev,
        [taskId]: [...(prev[taskId] || []), res]
      }));
      setNewCommentTexts(prev => ({ ...prev, [taskId]: "" }));
    } catch (err: any) {
      alert(err.message || "Gagal mengirim komentar.");
    }
  };

  const handleDeleteComment = async (commentId: number, taskId: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus komentar ini?")) return;

    try {
      await api.lms.comments.delete(commentId);
      setCommentsMap(prev => ({
        ...prev,
        [taskId]: (prev[taskId] || []).filter(c => c.id !== commentId)
      }));
    } catch (err: any) {
      alert(err.message || "Gagal menghapus komentar.");
    }
  };

  const toggleCommentsExpansion = (taskId: number) => {
    setExpandedComments(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const handleViewSubmissionsForTask = (taskId: number) => {
    setFilterTaskId(taskId);
    setActiveTab("submissions");
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

  // Filter tasks
  const moduleLevelTasks = assignments.filter(a => !a.kanjiId);

  return (
    <Layout>
      <main className="flex-grow w-full px-4 md:px-6 max-w-[1200px] mx-auto py-6 select-text text-left">
        <div className="flex flex-col gap-base">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-base border-b border-outline-variant/30 pb-base">
            <div>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface flex items-center gap-sm">
                <Icon name="school" className="text-primary text-3xl animate-bounce" />
                LMS Dosen: {module?.title || "Loading..."}
              </h2>
              <p className="text-body-md text-on-surface-variant font-medium">
                Manajemen kurikulum materi kuliah, penugasan mahasiswa, penilaian tugas, dan diskusi kelas.
              </p>
            </div>
            <button
              onClick={() => navigate("/admin")}
              className="px-4 py-2 border border-outline hover:bg-[#8f0020]/5 hover:border-[#8f0020]/50 transition-all cursor-pointer font-bold text-on-surface bg-transparent rounded-lg flex items-center gap-sm text-sm"
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

          {/* LMS Admin Ecosystem Navigation Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-outline-variant/30 pb-2">
            <button
              onClick={() => setActiveTab("lms-curriculum")}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm border-none cursor-pointer select-none transition-all flex items-center gap-2 ${
                activeTab === "lms-curriculum"
                  ? "bg-[#8f0020] text-white shadow-md"
                  : "bg-transparent text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon name="menu_book" className="text-lg" />
              Materi & Tugas Modul
            </button>
            <button
              onClick={() => setActiveTab("kanji-list")}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm border-none cursor-pointer select-none transition-all flex items-center gap-2 ${
                activeTab === "kanji-list"
                  ? "bg-[#8f0020] text-white shadow-md"
                  : "bg-transparent text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon name="table_chart" className="text-lg" />
              Kelola Kurikulum Kanji ({kanjis.length})
            </button>
            <button
              onClick={() => setActiveTab("submissions")}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm border-none cursor-pointer select-none transition-all flex items-center gap-2 ${
                activeTab === "submissions"
                  ? "bg-[#8f0020] text-white shadow-md"
                  : "bg-transparent text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon name="fact_check" className="text-lg" />
              Pengumpulan Mahasiswa ({submissions.length})
            </button>
          </div>

          {/* ================= TAB 1: LMS CURRICULUM (MATERI KAMPUS) ================= */}
          {activeTab === "lms-curriculum" && (
            <div className="space-y-8 animate-fade-in">
              
              {/* MODULE LEVEL SECTION */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/60 pb-4 mb-5 gap-4">
                  <div>
                    <h3 className="font-headline-md text-headline-sm font-black text-slate-800 flex items-center gap-2">
                      <Icon name="library_books" className="text-[#8f0020]" />
                      Materi Utama: {module?.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mt-1">
                      Tujuan: {module?.tujuanPembelajaran || "Belum ada tujuan pembelajaran."}
                    </p>
                  </div>
                  <button
                    onClick={() => openAddAssignModal(null)}
                    className="px-4 py-2 bg-[#8f0020] text-white text-xs font-bold rounded-xl shadow-sm hover:brightness-110 active:scale-95 border-none transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Icon name="add" className="text-base" />
                    Tambah Tugas Modul
                  </button>
                </div>

                {/* Module Tasks List */}
                {loadingLmsData ? (
                  <div className="py-8 text-center flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-slate-100/80 shadow-xs">
                    <Icon name="sync" className="text-3xl text-[#8f0020] animate-spin" />
                    <span className="text-xs text-slate-500 font-bold">Memuat tugas modul...</span>
                  </div>
                ) : lmsDataError ? (
                  <div className="py-6 text-center flex flex-col items-center justify-center gap-2 max-w-sm mx-auto bg-white rounded-2xl border border-slate-100/80 p-4 shadow-xs">
                    <span className="text-xs text-red-600 font-bold">Gagal memuat tugas modul: {lmsDataError}</span>
                    <button 
                      onClick={() => loadAssignmentsAndComments()}
                      className="px-3 py-1.5 bg-[#8f0020] text-white text-[11px] font-bold rounded-lg hover:brightness-110 cursor-pointer border-none flex items-center gap-1"
                    >
                      <Icon name="replay" className="text-sm" /> Coba Lagi
                    </button>
                  </div>
                ) : moduleLevelTasks.length === 0 ? (
                  <p className="text-slate-400 text-xs italic font-medium py-3">
                    Belum ada tugas tingkat modul utama.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {moduleLevelTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        comments={commentsMap[task.id] || []}
                        isExpanded={expandedComments[task.id]}
                        newCommentText={newCommentTexts[task.id] || ""}
                        setNewCommentText={(text) => setNewCommentTexts(prev => ({ ...prev, [task.id]: text }))}
                        onToggleComments={() => toggleCommentsExpansion(task.id)}
                        onPostComment={(e) => handlePostTaskComment(e, task.id)}
                        onDeleteComment={(commentId) => handleDeleteComment(commentId, task.id)}
                        onEdit={() => openEditAssignModal(task)}
                        onDelete={() => handleDeleteAssignment(task.id)}
                        onViewSubmissions={() => handleViewSubmissionsForTask(task.id)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* KANJI TOPICS / SUB-SECTIONS */}
              <div className="space-y-6">
                <h3 className="font-headline-md text-headline-sm font-black text-slate-800 flex items-center gap-2">
                  <Icon name="layers" className="text-[#8f0020]" />
                  Materi Kanji & Sub-Pembelajaran
                </h3>

                <div className="space-y-4">
                  {kanjis.map((kj) => {
                    const kanjiTasks = assignments.filter(a => a.kanjiId === kj.id);

                    return (
                      <div key={kj.id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs hover:border-[#8f0020]/20 transition-all">
                        {/* Kanji Subheader */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-50 pb-4 mb-4 gap-4">
                          <div className="flex items-center gap-4">
                            <span className="font-display-kanji text-5xl font-normal text-[#8f0020] bg-[#8f0020]/5 w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner">
                              {kj.character}
                            </span>
                            <div>
                              <h4 className="font-extrabold text-slate-800 text-base">
                                Materi Kanji: {kj.character} ({kj.meaning})
                              </h4>
                              <p className="text-xs text-slate-500 font-bold mt-0.5">
                                Romaji: <span className="font-mono text-[#8f0020] font-black">{kj.romaji}</span> • {kj.graphNodes?.length || 0} Graf Simpul
                              </p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => openAddAssignModal(kj.id)}
                            className="px-3.5 py-2 bg-slate-100 hover:bg-[#8f0020] hover:text-white text-slate-700 text-xs font-extrabold rounded-xl border-none transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Icon name="add" className="text-base" />
                            Tambah Tugas Kanji ({kj.character})
                          </button>
                        </div>

                        {/* Kanji Specific Tasks List */}
                        {loadingLmsData ? (
                          <div className="py-6 text-center flex flex-col items-center justify-center gap-2 bg-slate-50/50 rounded-2xl border border-slate-100/40">
                            <Icon name="sync" className="text-2xl text-[#8f0020] animate-spin" />
                            <span className="text-[11px] text-slate-500 font-bold">Memuat tugas kanji...</span>
                          </div>
                        ) : lmsDataError ? (
                          <div className="py-4 text-center flex flex-col items-center justify-center gap-2 max-w-sm mx-auto bg-slate-50/50 rounded-2xl border border-slate-100/40 p-3">
                            <span className="text-[11px] text-red-600 font-bold">Gagal memuat: {lmsDataError}</span>
                            <button 
                              onClick={() => loadAssignmentsAndComments()}
                              className="px-2.5 py-1 bg-[#8f0020] text-white text-[10px] font-bold rounded-lg hover:brightness-110 cursor-pointer border-none flex items-center gap-1"
                            >
                              <Icon name="replay" className="text-xs" /> Coba Lagi
                            </button>
                          </div>
                        ) : kanjiTasks.length === 0 ? (
                          <p className="text-slate-400 text-[11px] italic font-semibold pl-2">
                            Tidak ada tugas khusus untuk Kanji ini.
                          </p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {kanjiTasks.map((task) => (
                              <TaskCard
                                key={task.id}
                                task={task}
                                comments={commentsMap[task.id] || []}
                                isExpanded={expandedComments[task.id]}
                                newCommentText={newCommentTexts[task.id] || ""}
                                setNewCommentText={(text) => setNewCommentTexts(prev => ({ ...prev, [task.id]: text }))}
                                onToggleComments={() => toggleCommentsExpansion(task.id)}
                                onPostComment={(e) => handlePostTaskComment(e, task.id)}
                                onDeleteComment={(commentId) => handleDeleteComment(commentId, task.id)}
                                onEdit={() => openEditAssignModal(task)}
                                onDelete={() => handleDeleteAssignment(task.id)}
                                onViewSubmissions={() => handleViewSubmissionsForTask(task.id)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: KANJI LIST (CURRICULUM ADMIN CRUD) ================= */}
          {activeTab === "kanji-list" && (
            <div className="flex flex-col gap-md animate-fade-in">
              <div className="flex justify-between items-center">
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                  Daftar Kanji Terdaftar
                </h3>
                <button
                  onClick={handleOpenAddKanjiModal}
                  className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-bold shadow-md cursor-pointer hover:brightness-110 active:scale-95 transition-all border-none flex items-center gap-sm text-sm"
                >
                  <Icon name="add" className="text-lg" />
                  Kanji ke Module
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
                          {kj.graphNodes?.length || 0} Nodes • {kj.graphEdges?.length || 0} Edges
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

          {/* ================= TAB 3: SUBMISSIONS (GRADING) ================= */}
          {activeTab === "submissions" && (
            <div className="flex flex-col gap-md animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 gap-2">
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                  Tugas Mahasiswa yang Dikumpulkan
                </h3>
                {filterTaskId && (
                  <button
                    onClick={() => setFilterTaskId(null)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg border-none cursor-pointer transition-all"
                  >
                    Tampilkan Semua Tugas
                  </button>
                )}
              </div>

              {filterTaskId && (
                <div className="bg-[#8f0020]/5 border border-[#8f0020]/15 p-4 rounded-2xl flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Menyaring Jawaban Tugas: <span className="underline">{assignments.find(a => a.id === filterTaskId)?.title || ""}</span>
                  </span>
                  <button
                    onClick={() => setFilterTaskId(null)}
                    className="text-xs font-bold text-[#8f0020] bg-transparent border-none cursor-pointer"
                  >
                    Reset Filter
                  </button>
                </div>
              )}

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
                    {loadingSubmissions ? (
                      <tr>
                        <td colSpan={5} className="p-12 text-center">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Icon name="sync" className="text-3xl text-[#8f0020] animate-spin" />
                            <span className="text-xs text-slate-500 font-bold">Memuat pengumpulan mahasiswa...</span>
                          </div>
                        </td>
                      </tr>
                    ) : submissionsError ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center">
                          <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto bg-red-50 border border-red-100 rounded-xl p-4">
                            <span className="text-xs text-red-600 font-bold">Gagal memuat pengumpulan: {submissionsError}</span>
                            <button 
                              type="button"
                              onClick={() => loadSubmissionsData()}
                              className="px-3 py-1.5 bg-[#8f0020] text-white text-[11px] font-bold rounded-lg hover:brightness-110 cursor-pointer border-none flex items-center gap-1 mx-auto"
                            >
                              <Icon name="replay" className="text-sm" /> Coba Lagi
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      (filterTaskId ? submissions.filter(s => s.assignmentId === filterTaskId || s.taskId === filterTaskId) : submissions).map((sub) => (
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
                          <span className="font-bold text-xs text-slate-700 block leading-snug">{sub.assignment?.title || sub.Task?.title}</span>
                          <span className="text-[9px] text-slate-400 block font-mono mt-0.5">
                            Kumpul: {new Date(sub.submittedAt).toLocaleString("id-ID")}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-slate-600 font-medium whitespace-pre-wrap leading-relaxed">
                          {sub.content && <div className="mb-2">{sub.content}</div>}
                          {sub.submissionType === "file" && sub.fileUrl && (
                            <div className="flex items-center gap-1.5 mt-1 bg-slate-50 border border-slate-200/50 rounded-lg p-2 max-w-[320px]">
                              <Icon name="attachment" className="text-sm text-primary" />
                              <a
                                href={getFileUrl(sub.fileUrl)}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-primary font-bold hover:underline truncate"
                              >
                                Unduh File Jawaban
                              </a>
                            </div>
                          )}
                          {sub.submissionType === "youtube" && sub.submissionLink && (
                            <div className="flex items-center gap-1.5 mt-1 bg-red-50 border border-red-200/50 rounded-lg p-2 max-w-[320px]">
                              <Icon name="play_circle" className="text-sm text-red-600" />
                              <a
                                href={sub.submissionLink}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-red-700 font-bold hover:underline truncate"
                              >
                                Tonton Link YouTube Jawaban
                              </a>
                            </div>
                          )}
                          {sub.submissionType === "gdrive" && sub.submissionLink && (
                            <div className="flex items-center gap-1.5 mt-1 bg-blue-50 border border-blue-200/50 rounded-lg p-2 max-w-[320px]">
                              <Icon name="cloud" className="text-sm text-blue-600" />
                              <a
                                href={sub.submissionLink}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-blue-700 font-bold hover:underline truncate"
                              >
                                Buka Link Google Drive Jawaban
                              </a>
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {(() => {
                            const dueDate = sub.assignment?.dueDate || sub.Task?.dueDate;
                            const isLate = dueDate && new Date(sub.submittedAt) > new Date(dueDate);
                            return (
                              <div className="flex flex-col items-center gap-1">
                                {sub.grade ? (
                                  <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                                    Grade: {sub.grade}
                                  </span>
                                ) : (
                                  <span className="inline-block px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                                    Belum Dinilai
                                  </span>
                                )}
                                {isLate && (
                                  <span className="inline-block px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wide">
                                    Terlambat
                                  </span>
                                )}
                              </div>
                            );
                          })()}
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
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ================= MODAL: ADD/EDIT ASSIGNMENT ================= */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-outline-variant/30 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] shadow-2xl relative flex flex-col gap-4 text-left select-text overflow-hidden">
            <button
              onClick={() => setIsAssignModalOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container transition-colors cursor-pointer border-none bg-transparent"
            >
              <Icon name="close" className="text-xl block" />
            </button>

            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
              {selectedAssign ? "Edit Tugas LMS" : "Tambah Tugas LMS Baru"}
            </h3>

            <form onSubmit={handleSaveAssignment} className="flex flex-col gap-4 mt-2 overflow-y-auto pr-1.5 scrollbar-thin">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md font-bold text-on-surface">
                  Judul Tugas
                </label>
                <input
                  type="text"
                  value={assignTitle}
                  onChange={(e) => setAssignTitle(e.target.value)}
                  className="bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl p-3 w-full focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-sm"
                  placeholder="Contoh: Tugas Analisis Kanji 試"
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
                  placeholder="Tuliskan petunjuk pengerjaan tugas kuliah di sini..."
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5 border border-slate-100 rounded-2xl p-4 bg-slate-50/40">
                <span className="font-bold text-xs text-slate-800 uppercase tracking-wide">Materi & Sumber Pendukung (LMS)</span>
                
                {/* Multi file upload */}
                <div className="flex flex-col gap-1 mt-1">
                  <label className="font-label-sm text-xs font-bold text-slate-700">
                    Unggah Berkas Pendukung (Bisa pilih lebih dari 1 file - Maks 5 berkas, @10MB)
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        setAssignFiles(Array.from(e.target.files));
                      }
                    }}
                    className="bg-white border border-outline-variant/30 text-on-surface rounded-xl p-2.5 w-full focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-xs cursor-pointer"
                  />
                  
                  {/* Selected files preview */}
                  {assignFiles.length > 0 && (
                    <div className="text-xs text-slate-500 font-medium mt-1">
                      Berkas baru dipilih: <span className="font-bold text-primary">{assignFiles.map(f => f.name).join(", ")}</span>
                    </div>
                  )}
                </div>

                {/* Youtube link */}
                <div className="flex flex-col gap-1 mt-2">
                  <label className="font-label-sm text-xs font-bold text-slate-700">
                    Link Video YouTube (Opsional)
                  </label>
                  <input
                    type="url"
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="bg-white border border-outline-variant/30 text-on-surface rounded-xl p-2.5 w-full focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-xs"
                  />
                </div>

                {/* Google drive link */}
                <div className="flex flex-col gap-1 mt-2">
                  <label className="font-label-sm text-xs font-bold text-slate-700">
                    Link Google Drive (Opsional)
                  </label>
                  <input
                    type="url"
                    value={gdriveLink}
                    onChange={(e) => setGdriveLink(e.target.value)}
                    placeholder="https://drive.google.com/drive/folders/..."
                    className="bg-white border border-outline-variant/30 text-on-surface rounded-xl p-2.5 w-full focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-xs"
                  />
                </div>

                {/* List of currently uploaded files when editing */}
                {existingMaterials.filter((m: any) => m.type === "file").length > 0 && (
                  <div className="mt-3 border-t border-slate-200/60 pt-3 space-y-2">
                    <span className="text-xs font-bold text-slate-600 block">Berkas yang Sudah Terunggah:</span>
                    <div className="space-y-1">
                      {existingMaterials.filter((m: any) => m.type === "file").map((m: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between bg-white border border-slate-100 rounded-lg p-2">
                          <a href={getFileUrl(m.url)} target="_blank" rel="noreferrer" className="text-xs text-primary font-bold hover:underline truncate max-w-[280px]">
                            {m.name || "Berkas"}
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              setExistingMaterials(prev => prev.filter(item => item.url !== m.url));
                            }}
                            className="text-red-500 hover:text-red-700 font-bold text-xs bg-transparent border-none cursor-pointer flex items-center gap-0.5"
                          >
                            <Icon name="delete" className="text-sm" /> Hapus
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                    disabled={isKanjiTargetLocked}
                    className="bg-slate-100 border border-outline-variant/30 text-on-surface rounded-xl p-3 w-full outline-none font-semibold text-sm cursor-not-allowed opacity-80"
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
          <div className="bg-white border border-outline-variant/30 rounded-2xl p-6 max-w-2xl w-full shadow-2xl relative flex flex-col gap-4 text-left select-text">
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
              <p><strong>Tugas:</strong> {selectedSubmission.assignment?.title || selectedSubmission.Task?.title}</p>
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

      {/* Modal Add Kanji to Module */}
      {isAddKanjiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white border border-outline-variant/30 rounded-3xl w-full sm:w-[560px] md:w-[640px] max-w-2xl shadow-2xl overflow-hidden animate-scale-up max-h-[90vh] flex flex-col shrink-0">
            <div className="px-6 py-4 border-b border-outline-variant/20 flex justify-between items-center bg-slate-50 shrink-0">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Icon name="add" className="text-indigo-600 text-xl" />
                Tambah Kanji ke Modul
              </h3>
              <button
                type="button"
                onClick={() => setIsAddKanjiModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 bg-transparent border-none cursor-pointer rounded-lg hover:bg-slate-200/50 transition-all"
              >
                <Icon name="close" className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSaveAddKanjiToModule} className="p-6 space-y-4 overflow-y-auto flex-1 sidebar-scroll">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Modul
                </label>
                <input
                  type="text"
                  disabled
                  value={module?.title || `Module ${moduleId}`}
                  className="w-full bg-slate-100 border border-outline-variant/30 rounded-xl px-3 py-2 text-sm text-slate-600 font-bold cursor-not-allowed outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih Kanji (Multiple Select Search)
                </label>
                <div className="relative mb-2">
                  <Icon name="search" className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari kanji, romaji, atau arti..."
                    value={kanjiSearchTerm}
                    onChange={(e) => setKanjiSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border border-outline-variant/30 rounded-xl pl-9 pr-3 py-2 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary font-medium"
                  />
                </div>

                {/* Selected Kanji Pills */}
                {selectedKanjiIdsToAdd.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 p-2 bg-indigo-50/50 border border-indigo-100 rounded-xl mb-2 max-h-24 overflow-y-auto sidebar-scroll">
                    {selectedKanjiIdsToAdd.map((id) => {
                      const k = allAvailableKanjis.find((item) => item.id === id);
                      if (!k) return null;
                      return (
                        <span
                          key={id}
                          className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                        >
                          <span>{k.character} ({k.romaji || 'Inkomplit'})</span>
                          <button
                            type="button"
                            onClick={() => setSelectedKanjiIdsToAdd((prev) => prev.filter((i) => i !== id))}
                            className="hover:text-rose-200 border-none bg-transparent cursor-pointer p-0 text-xs font-extrabold"
                          >
                            ✕
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Selectable Kanjis Grid / List */}
                <div className="border border-outline-variant/30 rounded-xl max-h-60 overflow-y-auto p-2 space-y-1 bg-slate-50 sidebar-scroll">
                  {allAvailableKanjis
                    .filter((k) => {
                      if (!kanjiSearchTerm.trim()) return true;
                      const q = kanjiSearchTerm.toLowerCase();
                      return (
                        k.character.toLowerCase().includes(q) ||
                        (k.romaji && k.romaji.toLowerCase().includes(q)) ||
                        (k.meaning && k.meaning.toLowerCase().includes(q))
                      );
                    })
                    .map((k) => {
                      const isSelected = selectedKanjiIdsToAdd.includes(k.id);
                      const isAlreadyInThisModule = Number(k.moduleId) === Number(moduleId);

                      return (
                        <div
                          key={k.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedKanjiIdsToAdd((prev) => prev.filter((i) => i !== k.id));
                            } else {
                              setSelectedKanjiIdsToAdd((prev) => [...prev, k.id]);
                            }
                          }}
                          className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? "bg-indigo-50 border-indigo-300 text-indigo-900 font-bold"
                              : "bg-white border-slate-200/60 hover:bg-slate-100/80 text-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-8 h-8 rounded-lg bg-slate-100 font-extrabold text-lg flex items-center justify-center text-slate-900 border border-slate-200">
                              {k.character}
                            </span>
                            <div>
                              <div className="text-xs font-bold text-slate-900">
                                {k.romaji || "Inkomplit"}{" "}
                                <span className="text-slate-500 font-normal">
                                  {k.meaning ? `- ${k.meaning}` : ""}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {isAlreadyInThisModule
                                  ? "Sudah di Modul Ini"
                                  : k.moduleId
                                  ? `Modul ID: ${k.moduleId}`
                                  : "Tidak Terdaftar ke Modul"}
                              </div>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                          />
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setIsAddKanjiModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-300 hover:bg-slate-100 transition-all text-slate-700 cursor-pointer bg-transparent"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submittingAddKanji}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all border-none cursor-pointer flex items-center gap-2"
                >
                  {submittingAddKanji ? "Memproses..." : "Simpan ke Modul"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

// ================= CUSTOM SUB-COMPONENT: TASKCARD =================
interface TaskCardProps {
  task: any;
  comments: any[];
  isExpanded: boolean;
  newCommentText: string;
  setNewCommentText: (text: string) => void;
  onToggleComments: () => void;
  onPostComment: (e: React.FormEvent) => void;
  onDeleteComment: (commentId: number) => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewSubmissions: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  comments,
  isExpanded,
  newCommentText,
  setNewCommentText,
  onToggleComments,
  onPostComment,
  onDeleteComment,
  onEdit,
  onDelete,
  onViewSubmissions
}) => {
  const dueDateText = task.dueDate ? new Date(task.dueDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }) : "Tidak ada";

  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <div className="flex justify-between items-start gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <Icon name="assignment" className="text-[#8f0020] text-xl" />
            <h4 className="font-black text-slate-800 text-base leading-snug">{task.title}</h4>
          </div>
          <div className="flex gap-0.5">
            <button
              onClick={onEdit}
              className="p-1 text-primary hover:bg-slate-50 rounded-lg cursor-pointer bg-transparent border-none"
              title="Edit Tugas"
            >
              <Icon name="edit" className="text-base" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-error hover:bg-slate-50 rounded-lg cursor-pointer bg-transparent border-none"
              title="Hapus Tugas"
            >
              <Icon name="delete" className="text-base" />
            </button>
          </div>
        </div>

        <p className="text-slate-600 text-xs font-semibold whitespace-pre-wrap leading-relaxed mb-4">
          {task.description}
        </p>

        {(() => {
          const materials = [];
          if (task.materialsData) {
            try {
              materials.push(...JSON.parse(task.materialsData));
            } catch (e) {}
          } else if (task.fileUrl) {
            materials.push({ type: "file", url: task.fileUrl, name: "Lampiran Berkas" });
          }

          if (materials.length === 0) return null;

          return (
            <div className="mb-4 space-y-1.5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide block">Materi Pendukung ({materials.length})</span>
              <div className="flex flex-wrap gap-2">
                {materials.map((m: any, idx: number) => {
                  let iconName = "file_present";
                  let bgClass = "bg-slate-50 border-slate-200 text-slate-700";
                  let targetUrl = m.url;

                  if (m.type === "youtube") {
                    iconName = "play_circle";
                    bgClass = "bg-red-50 border-red-200/50 text-red-700";
                  } else if (m.type === "gdrive") {
                    iconName = "cloud";
                    bgClass = "bg-blue-50 border-blue-200/50 text-blue-700";
                  } else {
                    targetUrl = getFileUrl(m.url);
                  }

                  return (
                    <a
                      key={idx}
                      href={targetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 border rounded-lg text-xs font-extrabold decoration-none transition-colors ${bgClass}`}
                    >
                      <Icon name={iconName} className="text-sm" />
                      <span className="truncate max-w-[150px]">{m.name || "Berkas"}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          );
        })()}

        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold mb-4 uppercase tracking-wider">
          <Icon name="calendar_today" className="text-xs" />
          Batas Waktu: {dueDateText}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-3 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <button
            onClick={onViewSubmissions}
            className="px-3 py-1.5 bg-[#8f0020]/10 hover:bg-[#8f0020]/20 text-[#8f0020] rounded-xl text-xs font-bold border-none transition-all cursor-pointer flex items-center gap-1"
          >
            <Icon name="fact_check" className="text-sm" />
            Lihat Jawaban Mahasiswa
          </button>
          
          <button
            onClick={onToggleComments}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold border-none transition-all cursor-pointer flex items-center gap-1"
          >
            <Icon name="forum" className="text-sm" />
            Diskusi ({comments.length})
          </button>
        </div>

        {/* TASK INLINE DISCUSSION BOARD */}
        {isExpanded && (
          <div className="border-t border-slate-100 pt-3 space-y-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Forum Diskusi Tugas</span>
            
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 sidebar-scroll">
              {comments.length === 0 ? (
                <p className="text-slate-400 text-xs italic font-medium py-1">
                  Belum ada komentar untuk tugas ini.
                </p>
              ) : (
                comments.map((comm) => (
                  <div key={comm.id} className="flex gap-2.5 items-start border-b border-slate-50 pb-2.5">
                    <img
                      src={comm.user?.avatar}
                      alt={comm.user?.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <div className="flex items-center gap-1">
                          <span className="font-extrabold text-slate-800 text-[11px]">{comm.user?.name}</span>
                          {comm.user?.role === "ADMIN" && (
                            <span className="px-1 py-0.2 rounded bg-[#8f0020]/10 text-[#8f0020] text-[8px] font-black uppercase">Dosen</span>
                          )}
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold font-mono">
                          {new Date(comm.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs font-medium mt-0.5 leading-relaxed">
                        {comm.content}
                      </p>
                      <button
                        onClick={() => onDeleteComment(comm.id)}
                        className="text-[9px] text-red-500 hover:text-red-700 bg-transparent border-none cursor-pointer mt-1 font-bold p-0"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={onPostComment} className="flex gap-2">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Ketik balasan/instruksi dosen..."
                className="flex-1 p-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#8f0020] font-semibold"
                required
              />
              <button
                type="submit"
                className="bg-[#8f0020] text-white px-3 py-2 rounded-xl text-xs font-bold hover:brightness-105 active:scale-95 transition-all border-none cursor-pointer"
              >
                Kirim
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleDetailPage;
