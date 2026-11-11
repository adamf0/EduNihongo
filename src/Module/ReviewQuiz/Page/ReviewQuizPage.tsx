import React, { useState, useEffect, useMemo, useRef } from "react";
import Layout from "../../Common/Component/Organism/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../Common/Utility/api";
import {
  triggerCheckpointCelebration,
  playSelectSound,
} from "../Utility/celebration";
import {
  Award,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  Check,
  BarChart3,
  BookOpen,
  AlertCircle,
  Layers,
} from "lucide-react";

interface QuestionItem {
  id: number;
  reviewQuizId: number;
  moduleNumber: number;
  section: "A" | "B" | "C" | "D";
  type: "unscramble" | "multiple" | "fill";
  questionNumber: number;
  question: string;
  options: string[];
  words: string[];
  correctAnswer?: string;
  correctOrder?: string[];
  explanation?: string;
}

interface ReviewQuizData {
  id: number;
  judul: string;
  peletakanSetelahModul: number;
  deskripsi: string;
  durasiMenit: number;
  totalSoal: number;
  targetScore: number;
  questions: QuestionItem[];
  attempts: any[];
  userProgress?: {
    id: number;
    stage:
      | "quiz"
      | "checkpoint_A"
      | "checkpoint_B"
      | "checkpoint_C"
      | "final_summary";
    activeSection: "A" | "B" | "C" | "D";
    currentIdxInSection: number;
    answers: Record<string | number, any>;
    updatedAt: number;
  } | null;
}

const MODULE_NAMES: Record<number, string> = {
  1: "Modul 1: Ujian, Pertanyaan, dan Jawaban",
  2: "Modul 2: Penelitian dan Pengumpulan Data",
  3: "Modul 3: Informasi dan Data",
  4: "Modul 4: Dunia Kerja dan Perdagangan",
  5: "Modul 5: Komunikasi dan Pertukaran Ide",
  6: "Modul 6: Waktu dan Pengalaman",
};

const normalizeSentence = (str: string) => {
  return (str || "")
    .replace(/[\s\u3000・,，.、。！？!?]/g, "")
    .trim()
    .toLowerCase();
};

export const evaluateQuestion = (q: QuestionItem, userAns: any): boolean => {
  if (userAns === undefined || userAns === null || userAns === "") return false;

  if (q.type === "unscramble") {
    let userSentence = "";
    if (Array.isArray(userAns)) {
      userSentence = userAns.join("");
    } else if (typeof userAns === "string") {
      userSentence = userAns;
    }
    const normUser = normalizeSentence(userSentence);
    const normKey = normalizeSentence(q.correctAnswer || "");
    let normOrder = "";
    if (Array.isArray(q.correctOrder)) {
      normOrder = normalizeSentence(q.correctOrder.join(""));
    }
    return Boolean(
      normUser && (normUser === normKey || normUser === normOrder),
    );
  }

  const rawUser = String(userAns).trim();
  const rawKey = String(q.correctAnswer ?? "").trim();

  if (rawUser && rawUser.toLowerCase() === rawKey.toLowerCase()) return true;
  if (rawUser === rawKey) return true;

  if (Array.isArray(q.options) && q.options.length > 0) {
    const keyIdx = parseInt(rawKey, 10);
    if (!isNaN(keyIdx) && q.options[keyIdx]) {
      if (rawUser.toLowerCase() === q.options[keyIdx].toLowerCase())
        return true;
    }
    const letterMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
    if (letterMap[rawKey.toUpperCase()] !== undefined) {
      const idx = letterMap[rawKey.toUpperCase()];
      if (
        rawUser === String(idx) ||
        rawUser.toLowerCase() === q.options[idx]?.toLowerCase()
      ) {
        return true;
      }
    }
  }

  return false;
};

export const ReviewQuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quizData, setQuizData] = useState<ReviewQuizData | null>(null);

  // Read saved progress from localStorage if available
  const savedProgress = useMemo(() => {
    if (!id) return null;
    try {
      const stored = localStorage.getItem(
        `edunihongo_review_quiz_progress_${id}`,
      );
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Error reading saved progress:", e);
    }
    return null;
  }, [id]);

  // Track whether initial data has been synced with database
  const [isSyncedWithDb, setIsSyncedWithDb] = useState(false);
  const saveTimeoutRef = useRef<any>(null);

  // Workflow stages: "quiz" | "checkpoint_A" | "checkpoint_B" | "checkpoint_C" | "final_summary"
  const [stage, setStage] = useState<
    "quiz" | "checkpoint_A" | "checkpoint_B" | "checkpoint_C" | "final_summary"
  >(() => savedProgress?.stage || "quiz");

  // Current active section and question index within that section (0 to 29)
  const [activeSection, setActiveSection] = useState<"A" | "B" | "C" | "D">(
    () => savedProgress?.activeSection || "A",
  );
  const [currentIdxInSection, setCurrentIdxInSection] = useState<number>(() =>
    typeof savedProgress?.currentIdxInSection === "number"
      ? savedProgress.currentIdxInSection
      : 0,
  );

  // User answers map: questionId -> answer
  const [answers, setAnswers] = useState<Record<number, any>>(
    () => savedProgress?.answers || {},
  );

  // Persist progress to localStorage immediately and debounced to database (only AFTER initial load)
  useEffect(() => {
    if (!id || !isSyncedWithDb) return;

    const progressData = {
      id,
      stage,
      activeSection,
      currentIdxInSection,
      answers,
      updatedAt: Date.now(),
    };

    // 1. Simpan langsung ke localStorage browser
    try {
      localStorage.setItem(
        `edunihongo_review_quiz_progress_${id}`,
        JSON.stringify(progressData),
      );
    } catch (e) {
      console.error("Error saving progress to localStorage:", e);
    }

    // 2. Debounce simpan ke database MySQL agar tersinkronisasi lintas perangkat & mode incognito
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      api.reviewQuiz
        .saveProgress(id, {
          stage,
          activeSection,
          currentIdxInSection,
          answers,
        })
        .catch((err) => {
          console.warn("Auto-save review quiz progress ke server gagal:", err);
        });
    }, 600);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [id, isSyncedWithDb, stage, activeSection, currentIdxInSection, answers]);

  // Submitting to backend state
  const [submitting, setSubmitting] = useState(false);
  const [showReviewAccordion, setShowReviewAccordion] = useState(false);
  const [reviewFilterSection, setReviewFilterSection] = useState<
    "A" | "B" | "C" | "D"
  >("A");

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError("");
        const res = await api.reviewQuiz.get(id);
        const data = res?.quiz || res;
        const questionsList = res?.questions || res?.quiz?.questions || [];
        setQuizData({ ...data, questions: questionsList });

        // Pulihkan progres dari database jika ada
        const dbProgress = res?.userProgress;
        const localProgress = savedProgress;

        const dbAnswersCount = dbProgress?.answers
          ? Object.keys(dbProgress.answers).length
          : 0;
        const localAnswersCount = localProgress?.answers
          ? Object.keys(localProgress.answers).length
          : 0;

        // Jika local kosong (misal di tab penyamaran / peramban baru) atau data DB lebih mutakhir:
        if (
          dbProgress &&
          (localAnswersCount === 0 ||
            dbAnswersCount > localAnswersCount ||
            (dbProgress.updatedAt &&
              dbProgress.updatedAt > (localProgress?.updatedAt || 0)))
        ) {
          if (dbProgress.stage) setStage(dbProgress.stage);
          if (dbProgress.activeSection)
            setActiveSection(dbProgress.activeSection);
          if (typeof dbProgress.currentIdxInSection === "number") {
            setCurrentIdxInSection(dbProgress.currentIdxInSection);
          }
          if (
            dbProgress.answers &&
            Object.keys(dbProgress.answers).length > 0
          ) {
            setAnswers(dbProgress.answers);
          }

          // Sinkronkan ke localStorage tab saat ini
          try {
            localStorage.setItem(
              `edunihongo_review_quiz_progress_${id}`,
              JSON.stringify({
                id,
                stage: dbProgress.stage || "quiz",
                activeSection: dbProgress.activeSection || "A",
                currentIdxInSection: dbProgress.currentIdxInSection || 0,
                answers: dbProgress.answers || {},
                updatedAt: dbProgress.updatedAt || Date.now(),
              }),
            );
          } catch (e) {
            console.error("Error syncing db progress to localStorage:", e);
          }
        }
      } catch (err: any) {
        console.error("Error loading review quiz detail:", err);
        setError(err.message || "Gagal memuat detail review quiz.");
        if (
          err.message?.includes("Token") ||
          err.message?.includes("Akses ditolak")
        ) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
        setIsSyncedWithDb(true);
      }
    };

    fetchDetail();
  }, [id, navigate]);

  // Questions of current section
  const currentSectionQuestions = useMemo(() => {
    if (!quizData?.questions) return [];
    return quizData.questions
      .filter((q) => q.section === activeSection)
      .sort(
        (a, b) =>
          a.moduleNumber - b.moduleNumber ||
          a.questionNumber - b.questionNumber,
      );
  }, [quizData?.questions, activeSection]);

  const currentQ = currentSectionQuestions[currentIdxInSection] || null;

  // Section configs
  const sectionConfigs = {
    A: {
      title: "Bagian A: Menyusun Kalimat",
      desc: "Susun semua potongan kata berikut menjadi satu kalimat bahasa Jepang yang gramatikal dan bermakna.",
      badge: "Susun Kalimat",
      maxPoints: 30,
      nextSection: "B" as const,
      checkpointStage: "checkpoint_A" as const,
    },
    B: {
      title: "Bagian B: Kelompok Makna",
      desc: "Pilih satu kelompok makna untuk setiap jukugo berdasarkan grafik semantik kanji.",
      badge: "Kelompok Makna",
      maxPoints: 30,
      nextSection: "C" as const,
      checkpointStage: "checkpoint_B" as const,
    },
    C: {
      title: "Bagian C: Memilih Makna Jukugo",
      desc: "Pilihlah satu arti bahasa Indonesia yang paling tepat untuk setiap jukugo.",
      badge: "Makna Jukugo",
      maxPoints: 30,
      nextSection: "D" as const,
      checkpointStage: "checkpoint_C" as const,
    },
    D: {
      title: "Bagian D: Melengkapi Kalimat",
      desc: "Pilihlah satu jukugo yang paling tepat untuk melengkapi bagian kalimat yang rumpang.",
      badge: "Lengkapi Kalimat",
      maxPoints: 30,
      nextSection: null,
      checkpointStage: "final_summary" as const,
    },
  };

  // Helper to update answer for a question with sound feedback
  const setAnswerForQ = (
    qId: number,
    val: any,
    soundVariant: "select" | "unselect" = "select",
  ) => {
    playSelectSound(soundVariant);
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  // Helper for unscramble word chips
  const handleWordChipClick = (word: string) => {
    if (!currentQ) return;
    const currentList: string[] = Array.isArray(answers[currentQ.id])
      ? [...answers[currentQ.id]]
      : [];
    currentList.push(word);
    setAnswerForQ(currentQ.id, currentList, "select");
  };

  const handleRemoveWordChip = (idxToRemove: number) => {
    if (!currentQ) return;
    const currentList: string[] = Array.isArray(answers[currentQ.id])
      ? [...answers[currentQ.id]]
      : [];
    currentList.splice(idxToRemove, 1);
    setAnswerForQ(currentQ.id, currentList, "unselect");
  };

  const handleResetWords = () => {
    if (!currentQ) return;
    setAnswerForQ(currentQ.id, [], "unselect");
  };

  // Compute stats for current section
  const sectionStats = useMemo(() => {
    const questions = quizData?.questions || [];
    const secQ = questions.filter((q) => q.section === activeSection);
    const correctCount = secQ.filter((q) =>
      evaluateQuestion(q, answers[q.id]),
    ).length;
    const answeredCount = secQ.filter((q) => {
      const a = answers[q.id];
      return Array.isArray(a)
        ? a.length > 0
        : Boolean(a !== undefined && a !== "");
    }).length;

    return {
      total: secQ.length || 30,
      answered: answeredCount,
      correct: correctCount,
      scorePercent: Math.round((correctCount / (secQ.length || 30)) * 100),
      rubricContribution: ((correctCount / 120) * 100).toFixed(1),
    };
  }, [quizData?.questions, activeSection, answers]);

  // Overall stats
  const overallStats = useMemo(() => {
    const questions = quizData?.questions || [];
    const countA = questions.filter(
      (q) => q.section === "A" && evaluateQuestion(q, answers[q.id]),
    ).length;
    const countB = questions.filter(
      (q) => q.section === "B" && evaluateQuestion(q, answers[q.id]),
    ).length;
    const countC = questions.filter(
      (q) => q.section === "C" && evaluateQuestion(q, answers[q.id]),
    ).length;
    const countD = questions.filter(
      (q) => q.section === "D" && evaluateQuestion(q, answers[q.id]),
    ).length;

    const totalCorrect = countA + countB + countC + countD;
    const finalScore = Math.round((totalCorrect / 120) * 100);
    const isPassed = finalScore >= (quizData?.targetScore || 60);

    return {
      countA,
      countB,
      countC,
      countD,
      totalCorrect,
      finalScore,
      isPassed,
      rubricA: ((countA / 30) * 25).toFixed(1),
      rubricB: ((countB / 30) * 25).toFixed(1),
      rubricC: ((countC / 30) * 25).toFixed(1),
      rubricD: ((countD / 30) * 25).toFixed(1),
    };
  }, [quizData?.questions, answers, quizData?.targetScore]);

  // Mapping kemahiran Modul 1 sampai Modul 6
  const moduleMasteryList = useMemo(() => {
    const questions = quizData?.questions || [];
    return [1, 2, 3, 4, 5, 6].map((modNum) => {
      const modQuestions = questions.filter((q) => q.moduleNumber === modNum);
      const countA = modQuestions.filter((q) => q.section === "A").length || 5;
      const countB = modQuestions.filter((q) => q.section === "B").length || 5;
      const countC = modQuestions.filter((q) => q.section === "C").length || 5;
      const countD = modQuestions.filter((q) => q.section === "D").length || 5;

      const correctA = modQuestions.filter(
        (q) => q.section === "A" && evaluateQuestion(q, answers[q.id]),
      ).length;
      const correctB = modQuestions.filter(
        (q) => q.section === "B" && evaluateQuestion(q, answers[q.id]),
      ).length;
      const correctC = modQuestions.filter(
        (q) => q.section === "C" && evaluateQuestion(q, answers[q.id]),
      ).length;
      const correctD = modQuestions.filter(
        (q) => q.section === "D" && evaluateQuestion(q, answers[q.id]),
      ).length;

      const totalCorrect = correctA + correctB + correctC + correctD;
      const totalQuestions = modQuestions.length || 20;
      const percent = Math.round((totalCorrect / totalQuestions) * 100);

      let level = "Perlu Bimbingan";
      let levelBadge = "bg-rose-50 text-[#8f0020] border-rose-200";
      if (percent >= 85) {
        level = "Sangat Mahir";
        levelBadge = "bg-emerald-100 text-emerald-800 border-emerald-300";
      } else if (percent >= 70) {
        level = "Mahir";
        levelBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";
      } else if (percent >= 60) {
        level = "Cukup (Lulus KKM)";
        levelBadge = "bg-amber-50 text-amber-800 border-amber-200";
      }

      return {
        moduleNumber: modNum,
        name: MODULE_NAMES[modNum] || `Modul ${modNum}`,
        correctA,
        countA,
        percentA: Math.round((correctA / countA) * 100),
        correctB,
        countB,
        percentB: Math.round((correctB / countB) * 100),
        correctC,
        countC,
        percentC: Math.round((correctC / countC) * 100),
        correctD,
        countD,
        percentD: Math.round((correctD / countD) * 100),
        totalCorrect,
        totalQuestions,
        percent,
        level,
        levelBadge,
      };
    });
  }, [quizData?.questions, answers]);

  // Section checkpoint triggers
  const handleCompleteCurrentSection = async () => {
    if (activeSection === "A") {
      setStage("checkpoint_A");
      triggerCheckpointCelebration();
    } else if (activeSection === "B") {
      setStage("checkpoint_B");
      triggerCheckpointCelebration();
    } else if (activeSection === "C") {
      setStage("checkpoint_C");
      triggerCheckpointCelebration();
    } else if (activeSection === "D") {
      // Final submission to backend
      try {
        setSubmitting(true);
        if (quizData?.id) {
          await api.reviewQuiz.submit(quizData.id, answers);
        }
      } catch (e) {
        console.error("Error submitting review quiz to backend:", e);
      } finally {
        setSubmitting(false);
        setStage("final_summary");
        triggerCheckpointCelebration();
      }
    }
  };

  const handleProceedToSection = (nextSec: "A" | "B" | "C" | "D") => {
    setActiveSection(nextSec);
    setCurrentIdxInSection(0);
    setStage("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRestartQuiz = () => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin mengulang evaluasi ini dari awal? Seluruh progres dan jawaban tersimpan akan di-reset.",
      )
    ) {
      if (id) {
        try {
          localStorage.removeItem(`edunihongo_review_quiz_progress_${id}`);
        } catch (e) {
          // ignore
        }
        api.reviewQuiz
          .resetProgress(id)
          .catch((e) => console.warn("Failed to reset progress in DB:", e));
      }
      setAnswers({});
      setActiveSection("A");
      setCurrentIdxInSection(0);
      setStage("quiz");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex-grow flex items-center justify-center min-h-[450px]">
          <div className="text-center flex flex-col items-center gap-3">
            <Sparkles className="w-8 h-8 text-[#8f0020] animate-bounce" />
            <p className="text-slate-600 font-bold text-sm">
              Memuat soal evaluasi Fukushuu...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !quizData) {
    return (
      <Layout>
        <div className="max-w-md mx-auto py-16 px-4 text-center">
          <div className="p-6 bg-rose-50 border border-rose-200 text-rose-800 rounded-3xl">
            <AlertCircle className="w-8 h-8 text-rose-600 mx-auto mb-2" />
            <h3 className="text-base font-bold mb-1">Terjadi Kesalahan</h3>
            <p className="text-xs text-rose-600 mb-4">
              {error || "Data tidak ditemukan."}
            </p>
            <button
              onClick={() => navigate("/module")}
              className="px-5 py-2 rounded-xl bg-[#8f0020] text-white text-xs font-bold border-none cursor-pointer"
            >
              Kembali ke Alur Belajar
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full min-h-screen bg-slate-50/60 text-[#191c1e] antialiased pb-20">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
          <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
            <button
              onClick={() => navigate("/module")}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold text-xs border-none bg-transparent cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Keluar</span>
            </button>

            <div className="text-center">
              <h1 className="text-base font-extrabold text-slate-900 mt-0.5">
                {quizData.judul}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {Object.keys(answers).length > 0 && (
                <button
                  type="button"
                  onClick={handleRestartQuiz}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-[#8f0020] hover:border-rose-200 hover:bg-rose-50 text-xs font-bold transition-all bg-white cursor-pointer"
                  title="Reset dan mulai evaluasi dari awal"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ulangi dari Awal</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* ================= STAGE 1: QUIZ SINGLE QUESTION CARD (Gambar 2) ================= */}
          {stage === "quiz" && currentQ && (
            <div className="flex flex-col gap-6 animate-scale-up">
              {/* Main Card (matching Gambar 2) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col gap-5">
                {/* Card Top Row: Title + Points + Question Counter */}
                <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-[#8f0020] fill-rose-50" />
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      {sectionConfigs[activeSection].title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-amber-50 text-amber-700 border border-amber-200/80 px-2.5 py-0.5 rounded-full text-xs font-black select-none">
                      • +1 Poin
                    </span>
                    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-xl text-xs font-black select-none">
                      Soal {currentIdxInSection + 1} dari{" "}
                      {currentSectionQuestions.length}
                    </span>
                  </div>
                </div>

                {/* Module Badge & Sub-label */}
                {/* <div className="flex items-center gap-2 text-xs">
                  <span className="bg-rose-50 text-[#8f0020] font-bold px-2 py-0.5 rounded-md text-[11px]">
                    Modul {currentQ.moduleNumber}
                  </span>
                  <span className="text-slate-400 text-[11px] font-medium">
                    {MODULE_NAMES[currentQ.moduleNumber]}
                  </span>
                </div> */}

                {/* Question Prompt */}
                <div className="my-1">
                  <p className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                    {currentQ.question}
                  </p>
                </div>

                {/* ================= INTERACTION: SECTION A UNSCRAMBLE ================= */}
                {currentQ.type === "unscramble" && (
                  <div className="flex flex-col gap-5 my-2">
                    {/* Dashed Word Answer Drop Area */}
                    <div className="min-h-[76px] p-4 rounded-2xl bg-slate-50/70 border-2 border-dashed border-slate-300 flex flex-wrap items-center gap-2 transition-all">
                      {!answers[currentQ.id] ||
                      answers[currentQ.id].length === 0 ? (
                        <p className="text-slate-400 text-xs sm:text-sm italic select-none">
                          Klik tombol kata di bawah untuk menyusun kalimat...
                        </p>
                      ) : (
                        answers[currentQ.id].map((w: string, idx: number) => (
                          <button
                            key={`${w}-${idx}`}
                            type="button"
                            onClick={() => handleRemoveWordChip(idx)}
                            className="bg-white border-2 border-[#8f0020] text-slate-900 font-extrabold px-3.5 py-2 rounded-xl text-sm sm:text-base shadow-xs hover:bg-rose-50 cursor-pointer flex items-center gap-1.5 transition-all"
                            title="Klik untuk menghapus potongan kata ini"
                          >
                            <span>{w}</span>
                            <span className="text-[#8f0020] text-xs font-black ml-1">
                              ×
                            </span>
                          </button>
                        ))
                      )}
                    </div>

                    {/* Available Word Buttons */}
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-2.5">
                        {currentQ.words.map((w: string, idx: number) => {
                          const currentSelectedList: string[] =
                            answers[currentQ.id] || [];
                          // Check how many times this word is in original vs selected
                          const totalInOriginal = currentQ.words.filter(
                            (x) => x === w,
                          ).length;
                          const totalInSelected = currentSelectedList.filter(
                            (x) => x === w,
                          ).length;
                          const isFullyUsed =
                            totalInSelected >= totalInOriginal;

                          return (
                            <button
                              key={`avail-${w}-${idx}`}
                              type="button"
                              disabled={isFullyUsed}
                              onClick={() => handleWordChipClick(w)}
                              className={`px-4 py-2.5 rounded-2xl border-2 font-bold text-sm sm:text-base transition-all ${
                                isFullyUsed
                                  ? "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed opacity-40"
                                  : "bg-white border-slate-200 text-slate-800 hover:border-[#8f0020] hover:text-[#8f0020] shadow-xs active:scale-95 cursor-pointer"
                              }`}
                            >
                              {w}
                            </button>
                          );
                        })}
                      </div>

                      {answers[currentQ.id] &&
                        answers[currentQ.id].length > 0 && (
                          <div className="flex justify-end pt-1">
                            <button
                              type="button"
                              onClick={handleResetWords}
                              className="text-[11px] font-bold text-slate-400 hover:text-rose-600 border-none bg-transparent cursor-pointer flex items-center gap-1"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Reset Susunan Kata</span>
                            </button>
                          </div>
                        )}
                    </div>
                  </div>
                )}

                {/* ================= INTERACTION: SECTION B, C, D (CHOICE / FILL) ================= */}
                {currentQ.type !== "unscramble" && (
                  <div className="flex flex-col gap-2.5 my-2">
                    {currentQ.options.map((opt: string, optIdx: number) => {
                      const userChoice = answers[currentQ.id];
                      const isSelected =
                        userChoice === String(optIdx) ||
                        userChoice === opt ||
                        userChoice === ["A", "B", "C", "D"][optIdx];

                      const optLetters = ["A", "B", "C", "D"];

                      return (
                        <button
                          key={`${opt}-${optIdx}`}
                          type="button"
                          onClick={() =>
                            setAnswerForQ(currentQ.id, String(optIdx))
                          }
                          className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 cursor-pointer active:scale-[0.99] ${
                            isSelected
                              ? "border-[#8f0020] bg-rose-50/50 text-[#8f0020] shadow-xs font-black ring-2 ring-[#8f0020]/20 scale-[1.008]"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/60 font-semibold"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
                                isSelected
                                  ? "bg-[#8f0020] text-white"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {optLetters[optIdx] || optIdx + 1}
                            </span>
                            <span className="text-sm sm:text-base leading-relaxed">
                              {opt}
                            </span>
                          </div>

                          {isSelected && (
                            <Check className="w-5 h-5 text-[#8f0020] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Card Bottom Navigation Row (matching Gambar 2) */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentIdxInSection((prev) => Math.max(0, prev - 1))
                    }
                    disabled={currentIdxInSection === 0}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all bg-white cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Sebelumnya</span>
                  </button>

                  {/* Stepper info */}
                  <span className="text-xs font-bold text-slate-400">
                    {currentIdxInSection + 1} / {currentSectionQuestions.length}
                  </span>

                  {currentIdxInSection < currentSectionQuestions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentIdxInSection((prev) => prev + 1)}
                      className="px-5 py-2.5 rounded-xl bg-[#8f0020] hover:brightness-110 active:scale-95 text-white font-black text-xs flex items-center gap-1.5 border-none cursor-pointer shadow-sm transition-all"
                    >
                      <span>Selanjutnya</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={handleCompleteCurrentSection}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs flex items-center gap-1.5 border-none cursor-pointer shadow-md transition-all"
                    >
                      <span>
                        {activeSection === "D"
                          ? submitting
                            ? "Mengirim..."
                            : "Selesai & Kirim Evaluasi ✨"
                          : `Selesaikan Checkpoint ${
                              activeSection === "A"
                                ? 1
                                : activeSection === "B"
                                  ? 2
                                  : 3
                            } →`}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Number Jump Grid (Quick Navigator 1..30) */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
                <p className="text-[10px] font-black tracking-wider uppercase text-slate-400 mb-3">
                  Pintasan Soal {sectionConfigs[activeSection].title} (30 Butir)
                </p>
                <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5">
                  {currentSectionQuestions.map((q, idx) => {
                    const ans = answers[q.id];
                    const isAnswered = Array.isArray(ans)
                      ? ans.length > 0
                      : Boolean(ans !== undefined && ans !== "");
                    const isCurrent = idx === currentIdxInSection;

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentIdxInSection(idx)}
                        className={`h-8 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                          isCurrent
                            ? "bg-[#8f0020] text-white border-[#8f0020] shadow-xs"
                            : isAnswered
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                        title={`Soal #${q.questionNumber} (Modul ${q.moduleNumber})`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= STAGE 2: CHECKPOINT SCREEN (A, B, C) ================= */}
          {(stage === "checkpoint_A" ||
            stage === "checkpoint_B" ||
            stage === "checkpoint_C") && (
            <div className="flex flex-col gap-6 animate-scale-up">
              {/* Checkpoint Header Banner */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col gap-5 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0 shadow-sm animate-ring-celebration">
                        <CheckCircle2 className="w-8 h-8 animate-pop-bounce" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase shadow-xs flex items-center gap-1.5 animate-pop-bounce">
                          CHECKPOINT{" "}
                          {activeSection === "A"
                            ? 1
                            : activeSection === "B"
                              ? 2
                              : 3}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
                        <span>Hasil Evaluasi</span>
                      </h2>
                    </div>
                  </div>
                </div>

                {/* KPI Stat Cards with Progress Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                  {/* Card 1: Poin */}
                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      POIN BAGIAN {activeSection}
                    </span>
                    <span className="text-2xl font-black text-slate-900">
                      {sectionStats.correct} / 30
                    </span>
                    <span className="text-xs font-semibold text-slate-500 block mt-0.5">
                      Ketepatan: {sectionStats.scorePercent}%
                    </span>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                      <div
                        className="bg-[#8f0020] h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${Math.min(100, sectionStats.scorePercent)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Card 2: Kontribusi Rubrik */}
                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      KONTRIBUSI KE NILAI AKHIR
                    </span>
                    <span className="text-2xl font-black text-[#8f0020]">
                      {sectionStats.rubricContribution}%
                    </span>
                    <span className="text-xs font-semibold text-slate-500 block mt-0.5">
                      Maksimal 25.0%
                    </span>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${Math.min(
                            100,
                            (parseFloat(sectionStats.rubricContribution) / 25) *
                              100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Card 3: Status Ketuntasan */}
                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      STATUS KETUNTASAN
                    </span>
                    <span
                      className={`text-base font-black mt-1 block ${
                        sectionStats.scorePercent >= 60
                          ? "text-emerald-700"
                          : "text-amber-700"
                      }`}
                    >
                      {sectionStats.scorePercent >= 60
                        ? "Memenuhi KKM (≥60%)"
                        : "Perlu Peningkatan"}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 block mt-0.5">
                      Target KKM: 60%
                    </span>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          sectionStats.scorePercent >= 60
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                        }`}
                        style={{
                          width: `${Math.min(100, (sectionStats.scorePercent / 60) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pemetaan Kemahiran Modul 1 s.d. 6 untuk Bagian Ini */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-[#8f0020]" />
                      Pemetaan Kemahiran Modul 1 sampai Modul 6 (
                      {sectionConfigs[activeSection].title})
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Masing-masing modul terdiri atas 5 butir soal.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200/80">
                        <th className="py-3 px-4">Modul</th>
                        <th className="py-3 px-4 text-center">
                          Skor Bagian {activeSection}
                        </th>
                        <th className="py-3 px-4 text-center">Persentase</th>
                        <th className="py-3 px-4 text-right">
                          Tingkat Kemahiran
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {moduleMasteryList.map((m, idx) => {
                        const score =
                          activeSection === "A"
                            ? m.correctA
                            : activeSection === "B"
                              ? m.correctB
                              : m.correctC;
                        const pct = Math.round((score / 5) * 100);

                        let badgeStyle =
                          "bg-rose-50 text-[#8f0020] border-rose-200";
                        let label = "Perlu Latihan (<60%)";
                        if (pct >= 80) {
                          badgeStyle =
                            "bg-emerald-100 text-emerald-800 border-emerald-300";
                          label = "Mahir (≥80%)";
                        } else if (pct >= 60) {
                          badgeStyle =
                            "bg-amber-50 text-amber-800 border-amber-200";
                          label = "Cukup (≥60%)";
                        }

                        return (
                          <tr
                            key={m.moduleNumber}
                            className="hover:bg-slate-50/80 transition-colors animate-row-slide"
                            style={{ animationDelay: `${idx * 60}ms` }}
                          >
                            <td className="py-3 px-4 font-bold text-slate-800">
                              {m.name}
                            </td>
                            <td className="py-3 px-4 text-center font-black text-slate-900">
                              {score} / 5
                            </td>
                            <td className="py-3 px-4 text-center font-bold text-slate-600">
                              {pct}%
                            </td>
                            <td className="py-3 px-4 text-right">
                              <span
                                className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-transform hover:scale-105 ${badgeStyle}`}
                              >
                                {label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Continue button */}
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      handleProceedToSection(
                        sectionConfigs[activeSection].nextSection!,
                      )
                    }
                    className="group px-7 py-3 rounded-2xl bg-[#8f0020] hover:bg-[#a10024] active:scale-95 text-white font-black text-xs flex items-center gap-2 border-none cursor-pointer shadow-md shadow-[#8f0020]/20 transition-all hover:shadow-lg"
                  >
                    <span>
                      Lanjut ke{" "}
                      {
                        sectionConfigs[
                          sectionConfigs[activeSection].nextSection!
                        ].title
                      }
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= STAGE 3: FINAL RUBRIC SUMMARY & COMPREHENSIVE MAPPING ================= */}
          {stage === "final_summary" && (
            <div className="flex flex-col gap-6 animate-scale-up">
              {/* Grand Result Banner */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md text-center flex flex-col items-center gap-3">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center border-4 shadow-sm ${
                    overallStats.isPassed
                      ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                      : "border-amber-500 bg-amber-50 text-amber-600"
                  }`}
                >
                  <Award className="w-8 h-8" />
                </div>

                <span
                  className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                    overallStats.isPassed
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                      : "bg-amber-50 text-amber-800 border-amber-300"
                  }`}
                >
                  {overallStats.isPassed ? "LULUS" : "BELUM LULUS"}
                </span>

                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
                  Nilai Akhir: {overallStats.finalScore} / 100
                </h2>

                {/* Rubrik 4 Bagian Card */}
                <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-left">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-black text-slate-400 block uppercase">
                      A. SUSUN KALIMAT
                    </span>
                    <span className="text-lg font-black text-slate-900 block mt-0.5">
                      {overallStats.countA} / 30
                    </span>
                    <span className="text-[11px] font-bold text-slate-600 block">
                      Bobot: {overallStats.rubricA}% / 25%
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-black text-slate-400 block uppercase">
                      B. KELOMPOK MAKNA
                    </span>
                    <span className="text-lg font-black text-slate-900 block mt-0.5">
                      {overallStats.countB} / 30
                    </span>
                    <span className="text-[11px] font-bold text-slate-600 block">
                      Bobot: {overallStats.rubricB}% / 25%
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-black text-slate-400 block uppercase">
                      C. MAKNA JUKUGO
                    </span>
                    <span className="text-lg font-black text-slate-900 block mt-0.5">
                      {overallStats.countC} / 30
                    </span>
                    <span className="text-[11px] font-bold text-slate-600 block">
                      Bobot: {overallStats.rubricC}% / 25%
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-black text-slate-400 block uppercase">
                      D. LENGKAPI KALIMAT
                    </span>
                    <span className="text-lg font-black text-slate-900 block mt-0.5">
                      {overallStats.countD} / 30
                    </span>
                    <span className="text-[11px] font-bold text-slate-600 block">
                      Bobot: {overallStats.rubricD}% / 25%
                    </span>
                  </div>
                </div>
              </div>

              {/* ================= COMPREHENSIVE MAPPING MODUL 1 S.D. 6 PER JENIS (A-D) ================= */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col gap-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    Pemetaan Kemahiran Modul 1 sampai Modul 6
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Rincian penguasaan kanji dan jukugo mahasiswa berdasarkan
                    jenis keterampilan: Menyusun Kalimat, Semantik, Makna, dan
                    Konteks Kalimat.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200">
                        <th className="py-3.5 px-4">Modul Belajar</th>
                        <th className="py-3.5 px-3 text-center">
                          Bagian A<br />
                          <span className="text-[9px] font-normal lowercase">
                            (susun)
                          </span>
                        </th>
                        <th className="py-3.5 px-3 text-center">
                          Bagian B<br />
                          <span className="text-[9px] font-normal lowercase">
                            (semantik)
                          </span>
                        </th>
                        <th className="py-3.5 px-3 text-center">
                          Bagian C<br />
                          <span className="text-[9px] font-normal lowercase">
                            (makna)
                          </span>
                        </th>
                        <th className="py-3.5 px-3 text-center">
                          Bagian D<br />
                          <span className="text-[9px] font-normal lowercase">
                            (rumpang)
                          </span>
                        </th>
                        <th className="py-3.5 px-3 text-center">
                          Total Modul
                          <br />
                          <span className="text-[9px] font-normal lowercase">
                            (20 butir)
                          </span>
                        </th>
                        <th className="py-3.5 px-4 text-right">
                          Tingkat Kemahiran
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold">
                      {moduleMasteryList.map((m) => (
                        <tr
                          key={m.moduleNumber}
                          className="hover:bg-slate-50/70 transition-colors"
                        >
                          <td className="py-3.5 px-4 font-extrabold text-slate-900">
                            {m.name}
                          </td>
                          <td className="py-3.5 px-3 text-center font-bold">
                            <span
                              className={
                                m.correctA >= 4
                                  ? "text-emerald-700"
                                  : m.correctA <= 2
                                    ? "text-rose-600"
                                    : "text-slate-800"
                              }
                            >
                              {m.correctA}/5
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-center font-bold">
                            <span
                              className={
                                m.correctB >= 4
                                  ? "text-emerald-700"
                                  : m.correctB <= 2
                                    ? "text-rose-600"
                                    : "text-slate-800"
                              }
                            >
                              {m.correctB}/5
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-center font-bold">
                            <span
                              className={
                                m.correctC >= 4
                                  ? "text-emerald-700"
                                  : m.correctC <= 2
                                    ? "text-rose-600"
                                    : "text-slate-800"
                              }
                            >
                              {m.correctC}/5
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-center font-bold">
                            <span
                              className={
                                m.correctD >= 4
                                  ? "text-emerald-700"
                                  : m.correctD <= 2
                                    ? "text-rose-600"
                                    : "text-slate-800"
                              }
                            >
                              {m.correctD}/5
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-center font-black text-slate-900">
                            {m.totalCorrect} / 20 ({m.percent}%)
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-xl text-[11px] font-bold border ${m.levelBadge}`}
                            >
                              {m.level}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setShowReviewAccordion((prev) => !prev)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <BookOpen className="w-4 h-4 text-slate-500" />
                    <span>
                      {showReviewAccordion
                        ? "Sembunyikan Pembahasan Soal"
                        : "Ulas Seluruh Pembahasan & Kunci Jawaban"}
                    </span>
                  </button>

                  <div className="flex items-center gap-2">
                    {/* <button
                      type="button"
                      onClick={handleRestartQuiz}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-700 border-none cursor-pointer transition-all flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Ulangi Ujian</span>
                    </button> */}

                    <button
                      type="button"
                      onClick={() => navigate("/module")}
                      className="px-6 py-2.5 rounded-xl bg-[#8f0020] hover:brightness-110 active:scale-95 text-white font-black text-xs border-none cursor-pointer shadow-md shadow-[#8f0020]/20 transition-all flex items-center gap-1.5"
                    >
                      <span>Kembali ke Alur Belajar</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Accordion: Full 120 Questions Detailed Answer Review */}
              {showReviewAccordion && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col gap-4 animate-scale-up">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#8f0020]" />
                      Rincian Jawaban & Kunci Pembahasan
                    </h3>

                    {/* Section filter tabs for review */}
                    <div className="flex items-center gap-1">
                      {(["A", "B", "C", "D"] as const).map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => setReviewFilterSection(sec)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                            reviewFilterSection === sec
                              ? "bg-[#8f0020] text-white border-[#8f0020]"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          Bagian {sec}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {(quizData.questions || [])
                      .filter((q) => q.section === reviewFilterSection)
                      .map((q) => {
                        const userAns = answers[q.id];
                        const isCorrect = evaluateQuestion(q, userAns);

                        let userAnsDisplay = "";
                        if (Array.isArray(userAns)) {
                          userAnsDisplay = userAns.join(" ");
                        } else if (
                          q.options &&
                          q.options[parseInt(userAns, 10)]
                        ) {
                          userAnsDisplay = q.options[parseInt(userAns, 10)];
                        } else {
                          userAnsDisplay = userAns || "(Tidak dijawab)";
                        }

                        let keyDisplay = "";
                        if (
                          Array.isArray(q.correctOrder) &&
                          q.correctOrder.length > 0
                        ) {
                          keyDisplay = q.correctOrder.join(" ");
                        } else if (
                          q.options &&
                          q.options[parseInt(q.correctAnswer || "0", 10)]
                        ) {
                          keyDisplay =
                            q.options[parseInt(q.correctAnswer || "0", 10)];
                        } else {
                          keyDisplay = q.correctAnswer || "-";
                        }

                        return (
                          <div
                            key={q.id}
                            className={`p-4 rounded-2xl border text-xs flex flex-col gap-2 ${
                              isCorrect
                                ? "bg-emerald-50/40 border-emerald-200"
                                : "bg-rose-50/40 border-rose-200"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-extrabold text-slate-800">
                                Soal #{q.questionNumber} (Modul {q.moduleNumber}
                                )
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-md font-black text-[10px] ${
                                  isCorrect
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-rose-100 text-rose-800"
                                }`}
                              >
                                {isCorrect ? "Benar (+1)" : "Salah (0)"}
                              </span>
                            </div>

                            <p className="font-semibold text-slate-900">
                              {q.question}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-medium">
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold block">
                                  JAWABAN ANDA:
                                </span>
                                <span
                                  className={`font-bold ${isCorrect ? "text-emerald-700" : "text-rose-700"}`}
                                >
                                  {userAnsDisplay}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold block">
                                  KUNCI JAWABAN:
                                </span>
                                <span className="font-bold text-slate-900">
                                  {keyDisplay}
                                </span>
                              </div>
                            </div>

                            {q.explanation && (
                              <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200/60">
                                Catatan: {q.explanation}
                              </p>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ReviewQuizPage;
