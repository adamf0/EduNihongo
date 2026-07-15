import React, { useState, useEffect, useRef } from "react";
import { 
  X, 
  FileText, 
  Download, 
  Volume2, 
  Sparkles, 
  Calendar, 
  Paperclip, 
  Send,
  MessageSquare
} from "lucide-react";
import confetti from "canvas-confetti";
import { api } from "../../../Common/Utility/api";

interface LmsModuleModalProps {
  moduleId: number;
  moduleTitle: string;
  onClose: () => void;
}

export const LmsModuleModal: React.FC<LmsModuleModalProps> = ({
  moduleId,
  moduleTitle,
  onClose
}) => {
  const [lmsAssignments, setLmsAssignments] = useState<any[]>([]);
  const [lmsComments, setLmsComments] = useState<any[]>([]);
  const [newCommentContents, setNewCommentContents] = useState<Record<number, string>>({});
  const [submittingComment, setSubmittingComment] = useState<Record<number, boolean>>({});
  const [submittingSubmission, setSubmittingSubmission] = useState<Record<number, boolean>>({});
  const [submissionContents, setSubmissionContents] = useState<Record<number, string>>({});
  const [submissionFiles, setSubmissionFiles] = useState<Record<number, File | null>>({});
  const [activeSubmissionTypes, setActiveSubmissionTypes] = useState<Record<number, "file" | "youtube" | "gdrive" | "text">>({});
  const [submissionLinks, setSubmissionLinks] = useState<Record<number, string>>({});
  const [loadingLms, setLoadingLms] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Grade notification modal state
  const [gradeNotification, setGradeNotification] = useState<{ title: string; grade: string; feedback: string | null } | null>(null);

  const assignmentsRef = useRef<any[]>([]);
  useEffect(() => {
    assignmentsRef.current = lmsAssignments;
  }, [lmsAssignments]);

  const getFileUrl = (pathUrl: string | null | undefined) => {
    if (!pathUrl) return "";
    const origin =
      window.location.hostname === "localhost"
        ? "http://localhost:5001"
        : window.location.origin;
    return `${origin}${pathUrl}`;
  };

  const playSuccessFanfare = () => {
    try {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      const playNote = (
        freq: number,
        startDelay: number,
        duration: number,
        volume: number = 0.08
      ) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startDelay);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + startDelay);
        gain.gain.linearRampToValueAtTime(
          volume,
          ctx.currentTime + startDelay + 0.02
        );
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + startDelay + duration
        );

        osc.start(ctx.currentTime + startDelay);
        osc.stop(ctx.currentTime + startDelay + duration);
      };

      // Play major arpeggio fanfare
      playNote(523.25, 0.0, 0.15); // C5
      playNote(659.25, 0.1, 0.15); // E5
      playNote(783.99, 0.2, 0.15); // G5
      playNote(1046.5, 0.3, 0.4);  // C6
    } catch (e) {
      console.error("Audio error:", e);
    }
  };

  const triggerGradeNotification = (title: string, grade: string, feedback: string | null) => {
    confetti({
      particleCount: 150,
      spread: 85,
      origin: { y: 0.6 },
    });
    playSuccessFanfare();
    setGradeNotification({ title, grade, feedback });
  };

  const loadLmsData = async () => {
    try {
      setLoadingLms(true);
      const assigns = await api.lms.assignments.list({
        moduleId: moduleId,
      });
      setLmsAssignments(assigns);

      if (assigns.length > 0) {
        const commentPromises = assigns.map((assign: any) =>
          api.lms.comments.list({
            assignmentId: assign.id,
          })
        );

        const commentsResponses = await Promise.all(commentPromises);
        setLmsComments(commentsResponses.flat());
      } else {
        setLmsComments([]);
      }
    } catch (err: any) {
      console.error("Gagal memuat tugas LMS modul:", err);
    } finally {
      setLoadingLms(false);
    }
  };

  useEffect(() => {
    loadLmsData();
    // Load current user for comment ownership verification
    const fetchUser = async () => {
      try {
        const profile = await api.profile.get();
        setCurrentUser(profile);
      } catch (err) {
        console.error("Gagal memuat profil user:", err);
      }
    };
    fetchUser();

    // Set polling interval for realtime updates (every 4 seconds)
    const intervalId = setInterval(() => {
      const currentAssigns = assignmentsRef.current;
      const pollLmsData = async () => {
        try {
          const assigns = await api.lms.assignments.list({ moduleId });
          
          if (currentAssigns.length > 0) {
            // Compare grades
            assigns.forEach((newAssign: any) => {
              const oldAssign = currentAssigns.find((a: any) => a.id === newAssign.id);
              if (!oldAssign) return;

              const newSub = newAssign.submissions && newAssign.submissions[0];
              const oldSub = oldAssign.submissions && oldAssign.submissions[0];

              if (newSub && newSub.grade && (!oldSub || !oldSub.grade)) {
                triggerGradeNotification(newAssign.title, newSub.grade, newSub.feedback);
              }
            });
          }

          setLmsAssignments(assigns);

          if (assigns.length > 0) {
            const commentPromises = assigns.map((assign: any) =>
              api.lms.comments.list({ assignmentId: assign.id })
            );
            const commentsResponses = await Promise.all(commentPromises);
            setLmsComments(commentsResponses.flat());
          }
        } catch (e) {
          console.error("Realtime poll error:", e);
        }
      };
      
      pollLmsData();
    }, 4000);

    return () => clearInterval(intervalId);
  }, [moduleId]);

  const handlePostComment = async (e: React.FormEvent, assignmentId: number) => {
    e.preventDefault();
    const text = newCommentContents[assignmentId] || "";
    if (!text.trim()) return;

    try {
      setSubmittingComment(prev => ({ ...prev, [assignmentId]: true }));
      const res = await api.lms.comments.create({
        content: text,
        assignmentId,
      });
      setLmsComments(prev => [...prev, res]);
      setNewCommentContents(prev => ({ ...prev, [assignmentId]: "" }));
    } catch (err: any) {
      alert(err.message || "Gagal mengirim komentar.");
    } finally {
      setSubmittingComment(prev => ({ ...prev, [assignmentId]: false }));
    }
  };

  const handleDeleteComment = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus komentar ini?")) return;
    try {
      await api.lms.comments.delete(id);
      setLmsComments(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      alert(err.message || "Gagal menghapus komentar.");
    }
  };

  const handleSubmitAssignment = async (assignmentId: number) => {
    const textContent = submissionContents[assignmentId];
    const file = submissionFiles[assignmentId];
    const type = activeSubmissionTypes[assignmentId] || "text";
    const link = submissionLinks[assignmentId] || "";

    if (type === "text" && (!textContent || !textContent.trim())) {
      alert("Harap masukkan jawaban teks Anda.");
      return;
    }
    if (type === "file" && !file) {
      alert("Harap pilih berkas jawaban yang ingin diunggah.");
      return;
    }
    if ((type === "youtube" || type === "gdrive") && (!link || !link.trim())) {
      alert("Harap isi tautan (link) jawaban Anda.");
      return;
    }

    const formData = new FormData();
    formData.append("assignmentId", assignmentId.toString());
    formData.append("content", textContent || "");
    formData.append("submissionType", type);

    if (type === "file" && file) {
      formData.append("submissionFile", file);
    } else if (type === "youtube" || type === "gdrive") {
      formData.append("submissionLink", link);
    }

    try {
      setSubmittingSubmission(prev => ({ ...prev, [assignmentId]: true }));
      await api.lms.submissions.submit(formData);
      alert("Tugas berhasil dikumpulkan!");
      // Reset upload states
      setSubmissionFiles(prev => ({ ...prev, [assignmentId]: null }));
      setSubmissionLinks(prev => ({ ...prev, [assignmentId]: "" }));
      loadLmsData();
    } catch (err: any) {
      alert(err.message || "Gagal mengumpulkan tugas.");
    } finally {
      setSubmittingSubmission(prev => ({ ...prev, [assignmentId]: false }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div 
        className="bg-slate-50 border border-slate-200 rounded-3xl shadow-2xl relative flex flex-col w-full max-w-4xl h-[90vh] overflow-hidden text-left"
      >
        {/* Header Modal */}
        <div className="bg-white border-b border-slate-100 p-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <FileText className="text-[#8f0020] w-6 h-6" />
            <div>
              <h2 className="text-xl font-black text-slate-800">Tugas & Diskusi Modul</h2>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">{moduleTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer border-none bg-transparent flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Container (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loadingLms ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 font-bold animate-pulse text-sm py-12">
              <FileText className="w-12 h-12 text-slate-300 mb-2 animate-bounce" />
              Memuat tugas LMS modul...
            </div>
          ) : lmsAssignments.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-400 font-medium italic text-sm">
              Belum ada tugas yang diberikan untuk Modul ini.
            </div>
          ) : (
            <div className="space-y-6">
              {lmsAssignments.map((assign) => {
                const hasSubmitted = assign.submissions && assign.submissions.length > 0;
                const submission = hasSubmitted ? assign.submissions[0] : null;
                const dueDateText = assign.dueDate
                  ? new Date(assign.dueDate).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Tidak ada";

                const currentAssignmentComments = lmsComments.filter(
                  (comm) => comm.assignmentId === assign.id
                );

                return (
                  <div
                    key={assign.id}
                    className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col gap-5"
                  >
                    <div>
                      {/* Title & Target Status */}
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-[#8f0020]/10 text-[#8f0020] text-[9px] font-black uppercase tracking-wider">
                              {assign.kanji ? `Kanji: ${assign.kanji.character}` : "Modul"}
                            </span>
                            <h3 className="font-extrabold text-slate-800 text-base">{assign.title}</h3>
                          </div>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            hasSubmitted
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {hasSubmitted ? "Sudah Mengumpulkan" : "Belum Mengumpulkan"}
                        </span>
                      </div>

                      <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed mt-2 mb-4 font-medium">
                        {assign.description}
                      </p>

                      {/* Materials List */}
                      {(() => {
                        const materials = [];
                        if (assign.materialsData) {
                          try {
                            materials.push(...JSON.parse(assign.materialsData));
                          } catch (e) {}
                        } else if (assign.fileUrl) {
                          materials.push({
                            type: "file",
                            url: assign.fileUrl,
                            name: "Lampiran Berkas",
                          });
                        }

                        if (materials.length === 0) return null;

                        return (
                          <div className="mb-4 space-y-1.5 text-left">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                              Materi Pendukung ({materials.length})
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {materials.map((m: any, idx: number) => {
                                let bgClass = "bg-slate-100 border-slate-200 text-slate-700";
                                let targetUrl = m.url;

                                if (m.type === "youtube") {
                                  bgClass = "bg-red-50 border-red-200/45 text-red-700";
                                } else if (m.type === "gdrive") {
                                  bgClass = "bg-blue-50 border-blue-200/45 text-blue-700";
                                } else {
                                  targetUrl = getFileUrl(m.url);
                                }

                                return (
                                  <a
                                    key={idx}
                                    href={targetUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs font-black decoration-none transition-all ${bgClass}`}
                                  >
                                    {m.type === "youtube" ? (
                                      <Volume2 className="w-3.5 h-3.5" />
                                    ) : m.type === "gdrive" ? (
                                      <Sparkles className="w-3.5 h-3.5" />
                                    ) : (
                                      <Download className="w-3.5 h-3.5" />
                                    )}
                                    <span className="truncate max-w-[150px]">
                                      {m.name || "Berkas"}
                                    </span>
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}

                      <div className="flex items-center gap-1 text-xs text-slate-400 font-bold mb-2">
                        <Calendar className="w-3.5 h-3.5" />
                        Batas Waktu: {dueDateText}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-slate-100 pt-5">
                      {/* Left: Submission Form */}
                      <div>
                        {hasSubmitted ? (
                          <div className="border border-slate-200/60 rounded-xl p-4 bg-slate-50/30 space-y-3">
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                Jawaban Anda
                              </span>
                              {submission.content && (
                                <p className="text-slate-700 text-sm font-medium whitespace-pre-wrap mt-0.5">
                                  {submission.content}
                                </p>
                              )}
                              {submission.submissionType === "file" && submission.fileUrl && (
                                <div className="mt-2 flex items-center gap-1.5">
                                  <Paperclip className="w-3.5 h-3.5 text-[#8f0020]" />
                                  <a
                                    href={getFileUrl(submission.fileUrl)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-[#8f0020] font-black hover:underline"
                                  >
                                    Unduh Berkas Jawaban Anda
                                  </a>
                                </div>
                              )}
                              {submission.submissionType === "youtube" && submission.submissionLink && (
                                <div className="mt-2 flex items-center gap-1.5">
                                  <Volume2 className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                                  <a
                                    href={submission.submissionLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-red-700 font-black hover:underline"
                                  >
                                    Buka Video YouTube Jawaban Anda
                                  </a>
                                </div>
                              )}
                              {submission.submissionType === "gdrive" && submission.submissionLink && (
                                <div className="mt-2 flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                                  <a
                                    href={submission.submissionLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-blue-700 font-black hover:underline"
                                  >
                                    Buka Google Drive Jawaban Anda
                                  </a>
                                </div>
                              )}
                            </div>

                            {submission.grade && (
                              <div className="border-t border-slate-100 pt-3 flex flex-wrap gap-4 items-center">
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                    Nilai
                                  </span>
                                  <span className="block font-black text-[#8f0020] text-lg">
                                    {submission.grade}
                                  </span>
                                </div>
                                {submission.feedback && (
                                  <div className="flex-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                      Catatan Dosen
                                    </span>
                                    <p className="text-slate-600 text-xs italic font-medium whitespace-pre-wrap mt-0.5">
                                      {submission.feedback}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {!submission.grade && (
                              <div className="border-t border-slate-100 pt-3 space-y-3">
                                <p className="text-slate-400 text-xs italic font-medium">
                                  Menunggu penilaian & feedback dari Dosen...
                                </p>

                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                                  Perbarui Jawaban
                                </span>

                                {/* Selector buttons */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-50 p-1 rounded-xl">
                                  {([
                                    { id: "text", label: "Teks", icon: FileText },
                                    { id: "file", label: "File", icon: Paperclip },
                                    { id: "youtube", label: "YouTube", icon: Volume2 },
                                    { id: "gdrive", label: "GDrive", icon: Sparkles }
                                  ] as const).map((typeItem) => {
                                    const IconComp = typeItem.icon;
                                    const isSelected = (activeSubmissionTypes[assign.id] || "text") === typeItem.id;
                                    return (
                                      <button
                                        key={typeItem.id}
                                        type="button"
                                        onClick={() => {
                                          setActiveSubmissionTypes(prev => ({ ...prev, [assign.id]: typeItem.id }));
                                        }}
                                        className={`py-1.5 rounded-lg text-[10px] font-black border-none cursor-pointer flex items-center justify-center gap-1 transition-all ${
                                          isSelected
                                            ? "bg-[#8f0020] text-white shadow-sm"
                                            : "bg-transparent text-slate-500 hover:bg-slate-100"
                                        }`}
                                      >
                                        <IconComp className="w-3.5 h-3.5" />
                                        {typeItem.label}
                                      </button>
                                    );
                                  })}
                                </div>

                                {(activeSubmissionTypes[assign.id] || "text") === "text" && (
                                  <textarea
                                    value={
                                      submissionContents[assign.id] !== undefined
                                        ? submissionContents[assign.id]
                                        : submission.content
                                    }
                                    onChange={(e) =>
                                      setSubmissionContents(prev => ({
                                        ...prev,
                                        [assign.id]: e.target.value,
                                      }))
                                    }
                                    placeholder="Perbarui jawaban teks Anda..."
                                    className="w-full min-h-[80px] p-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#8f0020] font-medium"
                                  />
                                )}

                                {(activeSubmissionTypes[assign.id] || "text") === "file" && (
                                  <input
                                    type="file"
                                    onChange={(e) =>
                                      setSubmissionFiles(prev => ({
                                        ...prev,
                                        [assign.id]: e.target.files?.[0] || null,
                                      }))
                                    }
                                    className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl p-2 w-full text-xs font-semibold cursor-pointer outline-none"
                                  />
                                )}

                                {(activeSubmissionTypes[assign.id] || "text") === "youtube" && (
                                  <input
                                    type="url"
                                    value={submissionLinks[assign.id] || ""}
                                    onChange={(e) =>
                                      setSubmissionLinks(prev => ({
                                        ...prev,
                                        [assign.id]: e.target.value,
                                      }))
                                    }
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none"
                                  />
                                )}

                                {(activeSubmissionTypes[assign.id] || "text") === "gdrive" && (
                                  <input
                                    type="url"
                                    value={submissionLinks[assign.id] || ""}
                                    onChange={(e) =>
                                      setSubmissionLinks(prev => ({
                                        ...prev,
                                        [assign.id]: e.target.value,
                                      }))
                                    }
                                    placeholder="https://drive.google.com/drive/folders/..."
                                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none"
                                  />
                                )}

                                <button
                                  onClick={() => handleSubmitAssignment(assign.id)}
                                  disabled={submittingSubmission[assign.id]}
                                  className="bg-[#8f0020] text-white w-full py-2 rounded-lg text-xs font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all border-none cursor-pointer disabled:opacity-50 mt-1"
                                >
                                  {submittingSubmission[assign.id] ? "Memperbarui..." : "Perbarui Jawaban"}
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="border border-slate-200/60 rounded-xl p-4 bg-white space-y-4 text-left">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                              Metode Pengumpulan Jawaban
                            </span>

                            {/* Selector buttons */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-50 p-1 rounded-xl">
                              {([
                                { id: "text", label: "Teks", icon: FileText },
                                { id: "file", label: "File", icon: Paperclip },
                                { id: "youtube", label: "YouTube", icon: Volume2 },
                                { id: "gdrive", label: "GDrive", icon: Sparkles }
                              ] as const).map((typeItem) => {
                                const IconComp = typeItem.icon;
                                const isSelected = (activeSubmissionTypes[assign.id] || "text") === typeItem.id;
                                return (
                                  <button
                                    key={typeItem.id}
                                    type="button"
                                    onClick={() => {
                                      setActiveSubmissionTypes(prev => ({ ...prev, [assign.id]: typeItem.id }));
                                    }}
                                    className={`py-1.5 rounded-lg text-[11px] font-black border-none cursor-pointer flex items-center justify-center gap-1 transition-all ${
                                      isSelected
                                        ? "bg-[#8f0020] text-white shadow-sm"
                                        : "bg-transparent text-slate-500 hover:bg-slate-100"
                                    }`}
                                  >
                                    <IconComp className="w-3 h-3" />
                                    {typeItem.label}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Type conditional input */}
                            {(activeSubmissionTypes[assign.id] || "text") === "text" && (
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                  Ketik Jawaban Teks
                                </span>
                                <textarea
                                  value={submissionContents[assign.id] || ""}
                                  onChange={(e) =>
                                    setSubmissionContents(prev => ({
                                      ...prev,
                                      [assign.id]: e.target.value,
                                    }))
                                  }
                                  placeholder="Ketik jawaban tugas Anda di sini..."
                                  className="w-full min-h-[100px] p-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#8f0020] font-medium"
                                />
                              </div>
                            )}

                            {(activeSubmissionTypes[assign.id] || "text") === "file" && (
                              <div className="flex flex-col gap-1.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                  Pilih Berkas Jawaban (Maks 10MB)
                                </span>
                                <input
                                  type="file"
                                  onChange={(e) =>
                                    setSubmissionFiles(prev => ({
                                      ...prev,
                                      [assign.id]: e.target.files?.[0] || null,
                                    }))
                                  }
                                  className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl p-2 w-full text-xs font-semibold cursor-pointer outline-none"
                                />
                                {submissionFiles[assign.id] && (
                                  <span className="text-[10px] text-emerald-600 font-bold block">
                                    Terpilih: {submissionFiles[assign.id]?.name}
                                  </span>
                                )}
                              </div>
                            )}

                            {(activeSubmissionTypes[assign.id] || "text") === "youtube" && (
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                  Link Video YouTube
                                </span>
                                <input
                                  type="url"
                                  value={submissionLinks[assign.id] || ""}
                                  onChange={(e) =>
                                    setSubmissionLinks(prev => ({
                                      ...prev,
                                      [assign.id]: e.target.value,
                                    }))
                                  }
                                  placeholder="https://www.youtube.com/watch?v=..."
                                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none"
                                />
                              </div>
                            )}

                            {(activeSubmissionTypes[assign.id] || "text") === "gdrive" && (
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                  Link Google Drive
                                </span>
                                <input
                                  type="url"
                                  value={submissionLinks[assign.id] || ""}
                                  onChange={(e) =>
                                    setSubmissionLinks(prev => ({
                                      ...prev,
                                      [assign.id]: e.target.value,
                                    }))
                                  }
                                  placeholder="https://drive.google.com/drive/folders/..."
                                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none"
                                />
                              </div>
                            )}

                            <button
                              onClick={() => handleSubmitAssignment(assign.id)}
                              disabled={submittingSubmission[assign.id]}
                              className="bg-[#8f0020] text-white w-full py-2.5 rounded-xl text-xs font-bold shadow-md hover:brightness-105 active:scale-95 transition-all border-none cursor-pointer disabled:opacity-50 mt-2"
                            >
                              {submittingSubmission[assign.id] ? "Mengirim..." : "Kumpulkan Tugas"}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Right: Comments / Discussions Forum */}
                      <div className="border-l border-slate-100 pl-0 md:pl-5">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-3">
                          <MessageSquare className="text-[#8f0020] w-5 h-5 shrink-0" />
                          <h4 className="font-extrabold text-slate-800 text-sm">
                            Forum Diskusi Tugas
                          </h4>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 sidebar-scroll">
                          {currentAssignmentComments.length === 0 ? (
                            <div className="text-center py-8 text-slate-400 font-medium italic text-xs">
                              Belum ada diskusi untuk tugas ini. Mulai kirim komentar pertama Anda!
                            </div>
                          ) : (
                            currentAssignmentComments.map((comm) => {
                              const isOwner = currentUser && comm.userId === currentUser.id;
                              return (
                                <div
                                  key={comm.id}
                                  className="flex gap-2.5 items-start border-b border-slate-50 pb-2.5 last:border-0 text-xs"
                                >
                                  <img
                                    src={
                                      comm.user?.avatar ||
                                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150"
                                    }
                                    alt={comm.user?.name}
                                    className="w-6 h-6 rounded-full object-cover shadow-xs"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                      <span className="font-bold text-slate-800">
                                        {comm.user?.name || "User"}
                                      </span>
                                      {isOwner && (
                                        <button
                                          onClick={() => handleDeleteComment(comm.id)}
                                          className="text-rose-600 hover:underline bg-transparent border-none text-[10px] font-bold cursor-pointer"
                                        >
                                          Hapus
                                        </button>
                                      )}
                                    </div>
                                    <p className="text-slate-600 font-medium mt-0.5 break-words">
                                      {comm.content}
                                    </p>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>

                        {/* Post New Comment Form */}
                        <form
                          onSubmit={(e) => handlePostComment(e, assign.id)}
                          className="border-t border-slate-100 pt-3 flex gap-2"
                        >
                          <input
                            type="text"
                            value={newCommentContents[assign.id] || ""}
                            onChange={(e) =>
                              setNewCommentContents(prev => ({
                                ...prev,
                                [assign.id]: e.target.value,
                              }))
                            }
                            placeholder="Tulis tanggapan..."
                            className="flex-1 p-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#8f0020] font-medium"
                            required
                          />
                          <button
                            type="submit"
                            disabled={
                              submittingComment[assign.id] || !(newCommentContents[assign.id] || "").trim()
                            }
                            className="bg-[#8f0020] text-white px-3 py-2 rounded-xl hover:brightness-105 active:scale-95 transition-all cursor-pointer border-none flex items-center justify-center disabled:opacity-50"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      {/* Realtime Graded Notification Modal overlay */}
      {gradeNotification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in select-none">
          <div className="bg-white border border-amber-200/50 rounded-3xl p-8 w-[92vw] max-w-[400px] shadow-2xl text-center flex flex-col items-center gap-5 relative overflow-hidden">
            {/* Ambient gold glow backplate */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#8f0020]/10 rounded-full blur-3xl"></div>

            {/* Glowing Grade Badge */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 shadow-xl shadow-amber-500/20 flex flex-col items-center justify-center border-4 border-white animate-bounce shrink-0 mx-auto">
              <span className="text-[9px] font-black text-white uppercase tracking-wider leading-none">Nilai</span>
              <span className="text-3xl font-black text-white leading-none mt-1">{gradeNotification.grade}</span>
            </div>

            <div className="space-y-2 text-center">
              <h3 className="font-extrabold text-slate-800 text-lg">Tugas Anda Telah Dinilai!</h3>
              <p className="text-xs font-semibold text-slate-400 leading-snug">{gradeNotification.title}</p>
            </div>

            {/* Exp Reward simulation */}
            <div className="bg-emerald-50 border border-emerald-200/40 rounded-2xl py-2.5 px-6 flex items-center gap-2 animate-pulse mx-auto">
              <Sparkles className="w-5 h-5 text-emerald-600 fill-emerald-100" />
              <span className="text-sm font-black text-emerald-800">+100 EXP Diperoleh</span>
            </div>

            {gradeNotification.feedback && (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 w-full text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Catatan Dosen</span>
                <p className="text-xs font-medium text-slate-600 italic whitespace-pre-wrap leading-relaxed">
                  "{gradeNotification.feedback}"
                </p>
              </div>
            )}

            <button
              onClick={() => setGradeNotification(null)}
              className="w-full py-3 bg-[#8f0020] text-white font-bold rounded-xl shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer border-none text-sm"
            >
              Terima Kasih & Lanjutkan
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
