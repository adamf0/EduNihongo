import Layout from "../../Common/Component/Organism/Layout";
import DrawingCanvas, {
  type DrawingCanvasRef,
} from "../Component/Atoms/DrawingCanvas";
import Icon from "../../Common/Component/Icon";
import confetti from "canvas-confetti";
import KanjiStrokeVisualizer from "../../Module/Component/Atom/KanjiStrokeVisualizer";
import { createWorker, PSM } from "tesseract.js";
import KanjiAtlasFlow from "../../Module/Component/Atom/KanjiAtlasFlow";
import Breadcrumbs from "../Component/Atoms/Breadcrumbs";

import KanjiEtymology from "../Component/Atoms/KanjiEtymology";
import ExampleSentence from "../Component/Atoms/ExampleSentence";
import { api } from "../../Common/Utility/api";
import tts from "../../Common/Utility/tts";
import StrokeByStroke from "../Component/Atoms/StrokeByStroke";
import {
  BookOpen,
  Award,
  PenTool,
  HelpCircle,
  Info,
  X,
  Volume2,
  RotateCcw,
  Sparkles,
  Check,
  ArrowRight,
  MessageSquare,
  FileText,
  Calendar,
  Send,
  Download,
  Paperclip,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const worker = await createWorker("jpn");

await worker.setParameters({
  tessedit_pageseg_mode: PSM.SINGLE_CHAR,
  tessedit_char_whitelist: "一二三四五六七八九十",
} as any);

interface QuizQuestion {
  type: "unscramble" | "fill" | "multiple" | "matching" | "essay" | "grouping";
  question: string;
  targetWord?: string;
  words?: string[];
  correctOrder?: string[];
  options?: string[];
  correctAnswer?: string;
  pairs?: { left: string; right: string }[];
  groups?: { name: string; correctWords: string[] }[];
}

const getQuizQuestions = (
  _kanjiChar: string,
  _jukugosList: any[],
  _examplesList: any[],
): QuizQuestion[] => {
  // No hardcoded fallback — all quiz data must come from the DB (quizData field).
  return [];
};

interface DiffPart {
  char: string;
  type: "match" | "miss";
}

const getLevenshteinDistance = (a: string, b: string): number => {
  const tmp: number[][] = [];
  for (let i = 0; i <= a.length; i++) {
    tmp[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    tmp[0][j] = j;
  }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,
        tmp[i][j - 1] + 1,
        tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return tmp[a.length][b.length];
};

const getSimilarity = (str1: string, str2: string): number => {
  const clean = (s: string) =>
    s.replace(/[\s\u3000、。！？」『』\.,\?!-]/g, "").toLowerCase();
  const s1 = clean(str1);
  const s2 = clean(str2);
  if (!s1 || !s2) return 0;
  const distance = getLevenshteinDistance(s1, s2);
  const maxLength = Math.max(s1.length, s2.length);
  return Math.round(((maxLength - distance) / maxLength) * 100);
};

const diffCharacters = (target: string, spoken: string): DiffPart[] => {
  const clean = (s: string) =>
    s.replace(/[\s\u3000、。！？」『』\.,\?!-]/g, "").toLowerCase();
  const targetClean = clean(target);
  const spokenClean = clean(spoken);

  const m = targetClean.length;
  const n = spokenClean.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0),
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (targetClean[i - 1] === spokenClean[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: DiffPart[] = [];
  let i = m;
  let j = n;

  const matchedOriginal = new Array(target.length).fill(false);

  const cleanToOrigMap: number[] = [];
  for (let idx = 0; idx < target.length; idx++) {
    const c = target[idx];
    if (!/[\s\u3000、。！？」『』\.,\?!-]/.test(c)) {
      cleanToOrigMap.push(idx);
    }
  }

  while (i > 0 && j > 0) {
    if (targetClean[i - 1] === spokenClean[j - 1]) {
      const origIdx = cleanToOrigMap[i - 1];
      if (origIdx !== undefined) {
        matchedOriginal[origIdx] = true;
      }
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  for (let idx = 0; idx < target.length; idx++) {
    const char = target[idx];
    const isPunctuation = /[\s\u3000、。！？」『』\.,\?!-]/.test(char);
    result.push({
      char,
      type: isPunctuation || matchedOriginal[idx] ? "match" : "miss",
    });
  }

  return result;
};

export const LatihanPage: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = React.useRef<DrawingCanvasRef>(null);
  const [searchParams] = useSearchParams();
  const charParam = searchParams.get("char") || "試";

  const renderXpBadge = (isClaimed: boolean, amount: number) => {
    if (isClaimed) {
      return (
        <span className="bg-emerald-500/10 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-extrabold flex items-center gap-1 select-none border border-emerald-500/10">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>+
          {amount} XP
        </span>
      );
    }
    return (
      <span className="bg-amber-500/10 text-amber-700 text-xs px-2.5 py-1 rounded-full font-extrabold flex items-center gap-1 select-none border border-amber-500/10">
        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
        +{amount} XP
      </span>
    );
  };

  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [kanjiData, setKanjiData] = useState<any>(null);
  const [verification, setVerificationInfo] = useState<any | null>(null);
  const [showGuide, setShowGuide] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "detail" | "reading" | "quiz" | "lms"
  >("detail");

  // Reading tab states
  const [readSentences, setReadSentences] = useState<Record<number, boolean>>(
    {},
  );
  const [revealedTranslation, setRevealedTranslation] = useState<
    Record<number, boolean>
  >({});

  // Reading Speech-to-Text states
  const [activeRecordingIdx, setActiveRecordingIdx] = useState<number | null>(
    null,
  );
  const [speechResults, setSpeechResults] = useState<
    Record<number, { transcript: string; score: number; diffParts: DiffPart[] }>
  >({});
  const recognitionRef = React.useRef<any>(null);

  // Quiz tab states
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [matchingAnswers, setMatchingAnswers] = useState<
    Record<string, string>
  >({});
  const [unscrambleSelected, setUnscrambleSelected] = useState<string[]>([]);
  const [essayAnswer, setEssayAnswer] = useState("");
  const [groupingAnswers, setGroupingAnswers] = useState<
    Record<string, string>
  >({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<any[]>([]);
  const [savingQuiz, setSavingQuiz] = useState(false);
  const [xpNotification, setXpNotification] = useState<{
    amount: number;
    description: string;
  } | null>(null);
  const [successNotification, setSuccessNotification] = useState<{
    score: number;
    text: string;
  } | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const [correctAnswerClicked, setCorrectAnswerClicked] = useState<
    string | null
  >(null);
  const [matchingCorrect, setMatchingCorrect] = useState<
    Record<string, boolean>
  >({});
  const [matchingWrong, setMatchingWrong] = useState<Record<string, boolean>>(
    {},
  );
  const [groupingCorrect, setGroupingCorrect] = useState<
    Record<string, boolean>
  >({});
  const [groupingWrong, setGroupingWrong] = useState<Record<string, boolean>>(
    {},
  );
  const [unscrambleWrongWord, setUnscrambleWrongWord] = useState<string | null>(
    null,
  );
  const [essayStatus, setEssayStatus] = useState<
    "neutral" | "correct" | "wrong"
  >("neutral");
  const [hasQuestionMistake, setHasQuestionMistake] = useState(false);

  // LMS states
  const [lmsAssignments, setLmsAssignments] = useState<any[]>([]);
  const [lmsComments, setLmsComments] = useState<any[]>([]);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [submittingSubmission, setSubmittingSubmission] = useState<
    Record<number, boolean>
  >({});
  const [submissionContents, setSubmissionContents] = useState<
    Record<number, string>
  >({});
  const [submissionFiles, setSubmissionFiles] = useState<
    Record<number, File | null>
  >({});
  const [activeSubmissionTypes, setActiveSubmissionTypes] = useState<
    Record<number, "file" | "youtube" | "gdrive" | "text">
  >({});
  const [submissionLinks, setSubmissionLinks] = useState<
    Record<number, string>
  >({});
  const [loadingLms, setLoadingLms] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Realtime graded notification state
  const [gradeNotification, setGradeNotification] = useState<{ title: string; grade: string; feedback: string | null } | null>(null);

  const assignmentsRef = React.useRef<any[]>([]);
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

  const loadLmsData = async () => {
    if (!charParam) return;

    try {
      setLoadingLms(true);
      console.log({
        kanjiId: kanjiData.id,
        moduleId: kanjiData.moduleId || undefined,
      })
      const assigns = await api.lms.assignments.list({
        kanji: charParam,
        moduleId: kanjiData.moduleId || undefined,
      });
      console.log({
        kanji: charParam,
        moduleId: kanjiData.moduleId || undefined,
      })
      const filteredAssigns = assigns.filter((item:any) => {
        return item?.kanji?.character == charParam;
      });
      setLmsAssignments(filteredAssigns);

      if (filteredAssigns.length > 0) {
        const commentPromises = filteredAssigns.map((assign:any) =>
          api.lms.comments.list({
            kanjiId: kanjiData.id,
            assignmentId: assign.id, // Menggunakan ID dari masing-masing assignment
          }),
        );

        // Tunggu semua request selesai
        const commentsResponses = await Promise.all(commentPromises);

        // Gabungkan semua array komentar menjadi satu array datar (flat)
        const allComments = commentsResponses.flat();
        setLmsComments(allComments);
      } else {
        setLmsComments([]);
      }
    } catch (err) {
      console.error("Gagal memuat data LMS:", err);
    } finally {
      setLoadingLms(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await api.profile.get();
        setCurrentUser(profile);
      } catch (e) {
        console.error("Gagal memuat profil pengguna:", e);
      }
    };
    fetchUser();
  }, []);

  const triggerGradeNotification = (title: string, grade: string, feedback: string | null) => {
    confetti({
      particleCount: 150,
      spread: 85,
      origin: { y: 0.6 },
    });
    playSuccessFanfare();
    setGradeNotification({ title, grade, feedback });
  };

  useEffect(() => {
    if (activeTab === "lms" && kanjiData) {
      loadLmsData();

      // Poll every 4 seconds for new grades realtime
      const intervalId = setInterval(() => {
        const currentAssigns = assignmentsRef.current;
        const pollLms = async () => {
          try {
            const assigns = await api.lms.assignments.list({
              kanji: charParam,
              moduleId: kanjiData.moduleId || undefined,
            });
            const filteredAssigns = assigns.filter((item: any) => {
              return item?.kanji?.character == charParam;
            });

            if (currentAssigns.length > 0) {
              filteredAssigns.forEach((newAssign: any) => {
                const oldAssign = currentAssigns.find((a: any) => a.id === newAssign.id);
                if (!oldAssign) return;

                const newSub = newAssign.submissions && newAssign.submissions[0];
                const oldSub = oldAssign.submissions && oldAssign.submissions[0];

                if (newSub && newSub.grade && (!oldSub || !oldSub.grade)) {
                  triggerGradeNotification(newAssign.title, newSub.grade, newSub.feedback);
                }
              });
            }

            setLmsAssignments(filteredAssigns);

            if (filteredAssigns.length > 0) {
              const commentPromises = filteredAssigns.map((assign: any) =>
                api.lms.comments.list({
                  kanjiId: kanjiData.id,
                  assignmentId: assign.id,
                })
              );
              const commentsResponses = await Promise.all(commentPromises);
              const allComms = commentsResponses.flat();
              console.log("[LMS Student Poll] Loaded comments:", allComms);
              setLmsComments(allComms);
            }
          } catch (err) {
            console.error("Gagal melakukan polling data LMS:", err);
          }
        };
        pollLms();
      }, 4000);

      return () => clearInterval(intervalId);
    }
  }, [activeTab, kanjiData, charParam]);

  const handlePostComment = async (
    e: React.FormEvent,
    assignmentId: number,
  ) => {
    e.preventDefault();
    if (!newCommentContent.trim() || !kanjiData) return;

    try {
      setSubmittingComment(true);
      const res = await api.lms.comments.create({
        content: newCommentContent,
        kanjiId: kanjiData.id,
        assignmentId: assignmentId,
      });
      setLmsComments((prev) => [...prev, res]);
      setNewCommentContent("");
    } catch (err: any) {
      alert(err.message || "Gagal mengirim komentar.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus komentar ini?"))
      return;

    try {
      await api.lms.comments.delete(id);
      setLmsComments((prev) => prev.filter((c) => c.id !== id));
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
      setSubmittingSubmission((prev) => ({ ...prev, [assignmentId]: true }));
      await api.lms.submissions.submit(formData);
      alert("Tugas berhasil dikumpulkan!");
      // Reset upload states
      setSubmissionFiles((prev) => ({ ...prev, [assignmentId]: null }));
      setSubmissionLinks((prev) => ({ ...prev, [assignmentId]: "" }));
      loadLmsData();
    } catch (err: any) {
      alert(err.message || "Gagal mengumpulkan tugas.");
    } finally {
      setSubmittingSubmission((prev) => ({ ...prev, [assignmentId]: false }));
    }
  };

  const triggerXpReward = (amount: number, description: string) => {
    if (amount <= 0) return;
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
    setXpNotification({ amount, description });
    setTimeout(() => {
      setXpNotification(null);
    }, 4500);
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
        volume: number = 0.08,
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
          ctx.currentTime + startDelay + 0.02,
        );
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + startDelay + duration,
        );

        osc.start(ctx.currentTime + startDelay);
        osc.stop(ctx.currentTime + startDelay + duration);
      };

      // "tet" - C5
      playNote(523.25, 0.0, 0.12);
      // "te" - E5
      playNote(659.25, 0.14, 0.1);
      // "re" - G5
      playNote(783.99, 0.22, 0.1);
      // "ret" - C6
      playNote(1046.5, 0.3, 0.4, 0.1);
    } catch (e) {
      console.error("Gagal memutar audio fanfare:", e);
    }
  };

  const playPageLoadSound = () => {
    try {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      const playNote = (
        freq: number,
        startDelay: number,
        duration: number,
        type: OscillatorType = "sine",
        volume: number = 0.05,
      ) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startDelay);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + startDelay);
        gain.gain.linearRampToValueAtTime(
          volume,
          ctx.currentTime + startDelay + 0.05,
        );
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + startDelay + duration,
        );

        osc.start(ctx.currentTime + startDelay);
        osc.stop(ctx.currentTime + startDelay + duration);
      };

      // Clean futuristic chime
      playNote(659.25, 0.0, 0.35, "sine", 0.05);
      playNote(880.0, 0.12, 0.45, "sine", 0.06);
    } catch (e) {
      console.error("Gagal memutar audio load:", e);
    }
  };

  const playTabClickSound = () => {
    try {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.error("Gagal memutar suara tab:", e);
    }
  };

  const handleTabChange = (tab: "detail" | "reading" | "quiz" | "lms") => {
    playTabClickSound();
    setActiveTab(tab);
  };

  const playTingTing = () => {
    try {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      const playNote = (freq: number, startDelay: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startDelay);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + startDelay);
        gain.gain.linearRampToValueAtTime(
          0.08,
          ctx.currentTime + startDelay + 0.02,
        );
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + startDelay + duration,
        );

        osc.start(ctx.currentTime + startDelay);
        osc.stop(ctx.currentTime + startDelay + duration);
      };

      playNote(1318.51, 0.0, 0.15);
      playNote(1567.98, 0.08, 0.25);
    } catch (e) {
      console.error("Gagal memutar suara ting-ting:", e);
    }
  };

  const playTungTung = () => {
    try {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      const playNote = (freq: number, startDelay: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startDelay);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + startDelay);
        gain.gain.linearRampToValueAtTime(
          0.12,
          ctx.currentTime + startDelay + 0.02,
        );
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + startDelay + duration,
        );

        osc.start(ctx.currentTime + startDelay);
        osc.stop(ctx.currentTime + startDelay + duration);
      };

      playNote(130.81, 0.0, 0.15);
      playNote(98.0, 0.12, 0.25);
    } catch (e) {
      console.error("Gagal memutar suara tung-tung:", e);
    }
  };

  const handleMultipleChoiceClick = (
    opt: string,
    correctAnswer: string,
    questions: QuizQuestion[],
  ) => {
    if (correctAnswerClicked || wrongAnswers.includes(opt)) return;

    if (opt === correctAnswer) {
      playTingTing();
      setCorrectAnswerClicked(opt);
      setTimeout(() => {
        handleNextQuizQuestion(questions, opt);
      }, 1000);
    } else {
      playTungTung();
      setHasQuestionMistake(true);
      setWrongAnswers((prev) => [...prev, opt]);
    }
  };

  const handleMatchingSelect = (
    leftItem: string,
    matchedVal: string,
    currentQ: QuizQuestion,
    questions: QuizQuestion[],
  ) => {
    if (matchingCorrect[leftItem]) return;

    const pair = (currentQ.pairs || []).find((p) => p.left === leftItem);
    if (!pair) return;

    if (matchedVal === pair.right) {
      playTingTing();
      setMatchingCorrect((prev) => {
        const next = { ...prev, [leftItem]: true };

        // Check if all matched correctly
        const totalPairs = (currentQ.pairs || []).length;
        const correctCount = Object.keys(next).length;
        if (correctCount === totalPairs) {
          setTimeout(() => {
            handleNextQuizQuestion(questions);
          }, 1000);
        }
        return next;
      });
      setMatchingWrong((prev) => {
        const next = { ...prev };
        delete next[leftItem];
        return next;
      });
      setMatchingAnswers((prev) => ({ ...prev, [leftItem]: matchedVal }));
    } else {
      playTungTung();
      setHasQuestionMistake(true);
      setMatchingWrong((prev) => ({ ...prev, [leftItem]: true }));
      setMatchingAnswers((prev) => ({ ...prev, [leftItem]: matchedVal }));
    }
  };

  const handleGroupingSelect = (
    word: string,
    groupName: string,
    currentQ: QuizQuestion,
    questions: QuizQuestion[],
  ) => {
    if (groupingCorrect[word]) return;

    const groups = currentQ.groups || [];
    const correctGroup = groups.find((g) =>
      (g.correctWords || []).includes(word),
    );
    const correctGroupName = correctGroup ? correctGroup.name : "";

    if (groupName === correctGroupName) {
      playTingTing();
      setGroupingCorrect((prev) => {
        const next = { ...prev, [word]: true };

        // Check if all words correctly classified
        const totalWords = (currentQ.words || []).length;
        const correctCount = Object.keys(next).length;
        if (correctCount === totalWords) {
          setTimeout(() => {
            handleNextQuizQuestion(questions);
          }, 1000);
        }
        return next;
      });
      setGroupingWrong((prev) => {
        const next = { ...prev };
        delete next[word];
        return next;
      });
      setGroupingAnswers((prev) => ({ ...prev, [word]: groupName }));
    } else {
      playTungTung();
      setHasQuestionMistake(true);
      setGroupingWrong((prev) => ({ ...prev, [word]: true }));
      setGroupingAnswers((prev) => ({ ...prev, [word]: groupName }));
    }
  };

  const handleUnscrambleWordClick = (
    word: string,
    currentQ: QuizQuestion,
    questions: QuizQuestion[],
  ) => {
    if (unscrambleSelected.includes(word)) return;

    const nextIdx = unscrambleSelected.length;
    const correctOrder = currentQ.correctOrder || [];

    if (word === correctOrder[nextIdx]) {
      playTingTing();
      const nextSelected = [...unscrambleSelected, word];
      setUnscrambleSelected(nextSelected);

      if (nextSelected.length === correctOrder.length) {
        setTimeout(() => {
          handleNextQuizQuestion(questions);
        }, 1000);
      }
    } else {
      playTungTung();
      setHasQuestionMistake(true);
      setUnscrambleWrongWord(word);
      setTimeout(() => {
        setUnscrambleWrongWord(null);
      }, 600);
    }
  };

  const handleEssayCheck = (
    currentQ: QuizQuestion,
    questions: QuizQuestion[],
  ) => {
    if (essayStatus === "correct") return;

    const targetWord = currentQ.targetWord || "";
    const isCorrect = targetWord
      ? essayAnswer.includes(targetWord)
      : essayAnswer.trim().length > 0;

    if (isCorrect) {
      playTingTing();
      setEssayStatus("correct");
      setTimeout(() => {
        handleNextQuizQuestion(questions);
      }, 1000);
    } else {
      playTungTung();
      setHasQuestionMistake(true);
      setEssayStatus("wrong");
    }
  };

  const triggerSuccessNotification = (score: number, text: string) => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
    playSuccessFanfare();
    setSuccessNotification({ score, text });
    setTimeout(() => {
      setSuccessNotification(null);
    }, 4500);
  };



  useEffect(() => {
    const fetchKanji = async () => {
      try {
        setLoading(true);
        const data = await api.latihan.get(charParam);
        setKanjiData(data);

        if (data.xpEarned > 0) {
          triggerXpReward(data.xpEarned, "Membuka modul pembelajaran baru");
        } else {
          playPageLoadSound();
        }

        // Initialize reading completion checkboxes from cache or database percentage
        const cached = localStorage.getItem(`read_sentences_${data.kanji}`);
        if (cached) {
          try {
            setReadSentences(JSON.parse(cached));
          } catch (e) {
            console.error(e);
          }
        } else if (data.examples && data.readingPercent > 0) {
          const readList = data.examples.filter((ex: any) => ex.isReading);
          const totalCount =
            readList.length > 0 ? readList.length : data.examples.length;
          const checkedCount = Math.min(
            totalCount,
            Math.round((data.readingPercent / 100) * totalCount),
          );
          const sentencesMap: Record<number, boolean> = {};
          for (let idx = 0; idx < totalCount; idx++) {
            sentencesMap[idx] = idx < checkedCount;
          }
          setReadSentences(sentencesMap);
          localStorage.setItem(
            `read_sentences_${data.kanji}`,
            JSON.stringify(sentencesMap),
          );
        } else {
          setReadSentences({});
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Gagal memuat detail latihan.");
        if (
          err.message?.includes("Token") ||
          err.message?.includes("Akses ditolak")
        ) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchKanji();
  }, [navigate, charParam]);

  const handleClear = () => {
    canvasRef.current?.clear();
    setVerificationInfo(null);
  };

  const handleUndo = () => {
    canvasRef.current?.undo();
  };

  const handleVerify = async () => {
    if (!canvasRef.current || !kanjiData) return;

    setVerifying(true);
    setVerificationInfo(null);

    const validation = canvasRef.current.validateStrokeOrder();

    if (!validation) {
      setVerificationInfo({
        stars: 0,
        accuracy: 0,
        correctCount: 0,
        totalStrokes: 0,
        incorrectStrokes: [],
        feedbackMessage: "Gagal menganalisa goresan. Silakan coba lagi.",
        infoText: "",
        backendMessage: "Validasi gagal dijalankan",
        isSaved: false,
      });
      setVerifying(false);
      return;
    }

    let stars = 1;
    if (validation.accuracy >= 90) stars = 5;
    else if (validation.accuracy >= 75) stars = 4;
    else if (validation.accuracy >= 60) stars = 3;
    else if (validation.accuracy >= 40) stars = 2;

    let feedbackMessage = "";
    if (stars === 5) {
      feedbackMessage = "Sempurna! Urutan dan arah goresan Anda sangat akurat.";
    } else if (stars === 4) {
      feedbackMessage =
        "Sangat bagus! Coretan ditulis dengan urutan yang benar.";
    } else if (stars === 3) {
      feedbackMessage = "Kerja bagus! Tulisan Anda sudah cukup baik.";
    } else if (stars === 2) {
      feedbackMessage = "Coba lagi! Perhatikan urutan goresan yang salah.";
    } else {
      feedbackMessage =
        "Periksa kembali jumlah goresan dan arah penulisan Anda.";
    }

    const infoText = `Akurasi: ${validation.accuracy}%. Goresan benar: ${validation.correctCount}/${validation.totalStrokes}.${
      validation.incorrectStrokes.length > 0
        ? ` Goresan salah pada urutan ke: ${validation.incorrectStrokes.join(", ")}.`
        : ""
    }`;

    if (validation.accuracy >= 45) {
      try {
        const response = await api.latihan.verify(
          kanjiData.kanji,
          validation.accuracy,
        );
        setVerificationInfo({
          stars,
          accuracy: validation.accuracy,
          correctCount: validation.correctCount,
          totalStrokes: validation.totalStrokes,
          incorrectStrokes: validation.incorrectStrokes,
          feedbackMessage,
          infoText,
          backendMessage: response.message,
          isSaved: true,
        });

        if (response.xpEarned > 0) {
          triggerXpReward(
            response.xpEarned,
            `Berlatih menulis Kanji ${kanjiData.kanji}`,
          );
        } else if (stars >= 4) {
          confetti();
        }

        const updatedData = await api.latihan.get(kanjiData.kanji);
        setKanjiData(updatedData);
      } catch (err: any) {
        setVerificationInfo({
          stars,
          accuracy: validation.accuracy,
          correctCount: validation.correctCount,
          totalStrokes: validation.totalStrokes,
          incorrectStrokes: validation.incorrectStrokes,
          feedbackMessage,
          infoText,
          backendMessage: `Gagal menyimpan progress: ${err.message}`,
          isSaved: false,
        });
      }
    } else {
      setVerificationInfo({
        stars,
        accuracy: validation.accuracy,
        correctCount: validation.correctCount,
        totalStrokes: validation.totalStrokes,
        incorrectStrokes: validation.incorrectStrokes,
        feedbackMessage,
        infoText,
        backendMessage:
          "Urutan goresan belum sesuai target (min. 45%). Progres belum disimpan.",
        isSaved: false,
      });
    }

    setVerifying(false);
  };

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.error(e);
        }
      }
    };
  }, []);

  const handleToggleReading = async (idx: number, isCompleted: boolean) => {
    if (!kanjiData || !kanjiData.examples) return;

    // Calculate new readSentences state
    const newReadSentences = {
      ...readSentences,
      [idx]: isCompleted,
    };
    setReadSentences(newReadSentences);

    // Save to localStorage
    localStorage.setItem(
      `read_sentences_${kanjiData.kanji}`,
      JSON.stringify(newReadSentences),
    );

    // Auto-save progress to backend
    try {
      const readList = kanjiData.examples.filter((ex: any) => ex.isReading);
      const totalCount =
        readList.length > 0 ? readList.length : kanjiData.examples.length;
      const checkedCount =
        Object.values(newReadSentences).filter(Boolean).length;
      const readingScore =
        totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

      const response = await api.latihan.verifyReading(
        kanjiData.kanji,
        readingScore,
      );

      // Refresh local progress data
      const updatedData = await api.latihan.get(kanjiData.kanji);
      setKanjiData(updatedData);

      if (response.xpEarned > 0) {
        triggerXpReward(
          response.xpEarned,
          `Berhasil menyelesaikan kalimat latihan membaca`,
        );
      } else if (isCompleted && readingScore >= 100) {
        confetti();
      }
    } catch (err) {
      console.error("Gagal menyimpan progres membaca otomatis:", err);
    }
  };

  const startSpeechRecognition = (idx: number, targetSentence: string) => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        console.error(e);
      }
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(
        "Browser Anda tidak mendukung Web Speech API (Perekaman Suara). Harap gunakan Google Chrome atau browser modern lainnya.",
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ja-JP";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setActiveRecordingIdx(idx);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript || "";
      const score = getSimilarity(targetSentence, transcript);
      const diffParts = diffCharacters(targetSentence, transcript);

      setSpeechResults((prev) => ({
        ...prev,
        [idx]: { transcript, score, diffParts },
      }));

      // If score is >= 70%, mark as completed
      if (score >= 70) {
        handleToggleReading(idx, true);
      }

      // If score is > 75%, trigger confetti and learning success modal
      if (score > 75) {
        triggerSuccessNotification(score, "Pelafalan sangat baik & akurat!");
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event);
      if (event.error !== "aborted") {
        alert(
          `Error Perekaman: ${event.error}. Harap pastikan mikrofon Anda aktif dan berikan izin akses.`,
        );
      }
      setActiveRecordingIdx(null);
    };

    recognition.onend = () => {
      setActiveRecordingIdx(null);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (err) {
      console.error("Recognition start error:", err);
      setActiveRecordingIdx(null);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error(e);
      }
      setActiveRecordingIdx(null);
    }
  };

  const playAudio = (text: string) => {
    tts.speak(text);
  };

  const handleNextQuizQuestion = (
    questions: QuizQuestion[],
    passedSelectedAnswer?: string,
  ) => {
    const currentQ = questions[currentQuestionIdx];
    let isCorrect = false;
    let studentAnswerString = "";
    let correctAnswerString = "";

    const finalAnswer = passedSelectedAnswer || selectedAnswer;

    if (currentQ.type === "multiple" || currentQ.type === "fill") {
      studentAnswerString = finalAnswer || "(Tidak ada jawaban)";
      correctAnswerString = currentQ.correctAnswer || "";
    } else if (currentQ.type === "unscramble") {
      studentAnswerString = unscrambleSelected.join("");
      correctAnswerString = (currentQ.correctOrder || []).join("");
    } else if (currentQ.type === "matching") {
      const pairs = currentQ.pairs || [];
      const matchedDetails: string[] = [];
      pairs.forEach((p) => {
        const studentMatch = matchingAnswers[p.left] || "";
        matchedDetails.push(`${p.left} → ${studentMatch || "?"}`);
      });
      studentAnswerString = matchedDetails.join(", ");
      correctAnswerString = pairs
        .map((p) => `${p.left} → ${p.right}`)
        .join(", ");
    } else if (currentQ.type === "essay") {
      studentAnswerString = essayAnswer.trim();
      correctAnswerString = `(Kosakata wajib: ${currentQ.targetWord || ""})`;
    } else if (currentQ.type === "grouping") {
      const groups = currentQ.groups || [];
      const details: string[] = [];
      const words = currentQ.words || [];
      words.forEach((w) => {
        const studentGroup = groupingAnswers[w] || "";
        details.push(`${w} → ${studentGroup || "?"}`);
      });
      studentAnswerString = details.join(", ");
      correctAnswerString = groups
        .map((g) => `${g.name}: [${(g.correctWords || []).join(", ")}]`)
        .join(" | ");
    }

    // scoring is correct only if student made no mistake on this question
    isCorrect = !hasQuestionMistake;

    setQuizFeedback((prev) => [
      ...prev,
      {
        question: currentQ.question,
        type: currentQ.type,
        studentAnswer: studentAnswerString,
        correctAnswer: correctAnswerString,
        isCorrect,
      },
    ]);

    // Reset temporary question selections
    setSelectedAnswer(null);
    setCorrectAnswerClicked(null);
    setWrongAnswers([]);
    setMatchingCorrect({});
    setMatchingWrong({});
    setGroupingCorrect({});
    setGroupingWrong({});
    setUnscrambleWrongWord(null);
    setEssayStatus("neutral");
    setHasQuestionMistake(false);
    setUnscrambleSelected([]);
    setEssayAnswer("");
    setGroupingAnswers({});
    setMatchingAnswers({});

    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      // Evaluate final score
      const finalFeedback = [
        ...quizFeedback,
        {
          question: currentQ.question,
          type: currentQ.type,
          studentAnswer: studentAnswerString,
          correctAnswer: correctAnswerString,
          isCorrect,
        },
      ];
      const correctCount = finalFeedback.filter((f) => f.isCorrect).length;
      const score = Math.round((correctCount / questions.length) * 100);

      setQuizScore(score);
      setQuizFinished(true);
      submitQuizScore(score);
    }
  };

  const submitQuizScore = async (score: number) => {
    setSavingQuiz(true);
    try {
      const response = await api.latihan.verifyQuiz(kanjiData.kanji, score);
      const updatedData = await api.latihan.get(kanjiData.kanji);
      setKanjiData(updatedData);

      if (response.xpEarned > 0) {
        triggerXpReward(response.xpEarned, `Menyelesaikan kuis evaluasi kanji`);
      } else if (score >= 75) {
        confetti();
      }
    } catch (err: any) {
      console.error("Gagal mengirim kuis:", err);
    } finally {
      setSavingQuiz(false);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setCorrectAnswerClicked(null);
    setWrongAnswers([]);
    setMatchingCorrect({});
    setMatchingWrong({});
    setGroupingCorrect({});
    setGroupingWrong({});
    setUnscrambleWrongWord(null);
    setEssayStatus("neutral");
    setHasQuestionMistake(false);
    setMatchingAnswers({});
    setUnscrambleSelected([]);
    setEssayAnswer("");
    setGroupingAnswers({});
    setQuizFinished(false);
    setQuizScore(0);
    setQuizFeedback([]);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="text-[#8f0020] font-bold animate-pulse text-lg">
            Memuat detail latihan...
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !kanjiData) {
    return (
      <Layout>
        <div className="flex-1 w-full px-4 md:px-6 max-w-[1200px] mx-auto py-6">
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center font-bold">
            {error || "Karakter tidak ditemukan"}
            <button
              onClick={() => window.location.reload()}
              className="block mx-auto mt-4 px-6 py-2 bg-[#8f0020] text-white rounded-full text-sm font-semibold hover:brightness-110 active:scale-95 transition-all cursor-pointer border-none"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const {
    kanji,
    romaji: kanjiRomaji,
    meaning: kanjiMeaning,
    masteryPercent,
    writingPercent = 0,
    readingPercent = 0,
    quizPercent = 0,
    examples,
    jukugos = [],
    etymologies,
    graph,
  } = kanjiData;

  let quizQuestions: QuizQuestion[] = [];
  if (kanjiData.quizData) {
    try {
      quizQuestions = JSON.parse(kanjiData.quizData);
    } catch (e) {
      quizQuestions = getQuizQuestions(kanji, jukugos, examples);
    }
  } else {
    quizQuestions = getQuizQuestions(kanji, jukugos, examples);
  }

  return (
    <Layout>
      <div className="w-full mx-auto px-4 md:px-8 py-8 flex flex-col gap-6 select-none relative z-10">
        {/* Custom style for background */}
        <style>{`
          .seigaiha-bg {
            background-image: radial-gradient(circle at 100% 150%, #edeef0 24%, white 25%, white 28%, #edeef0 29%, #edeef0 36%, white 36%, white 40%, transparent 40%, transparent);
            background-size: 40px 20px;
          }

          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-60px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .animate-slide-in-left {
            animation: slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          @keyframes zoomIn {
            from {
              opacity: 0;
              transform: scale(0.6);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-zoom-in {
            animation: zoomIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
        `}</style>

        {/* Background Texture */}
        <div className="absolute inset-0 seigaiha-bg pointer-events-none opacity-20 -z-10"></div>

        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Dasbor", path: "/dashboard" },
            { label: "Kanji & Kosakata", path: "/module" },
            {
              label: `Latihan & Evaluasi: ${kanji} (${kanjiData.moduleTitle || "Kanji"})`,
            },
          ]}
        />

        {/* Primary Header Card with Detailed Percent Stats */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="flex items-center gap-6 self-start md:self-center animate-slide-in-left opacity-0">
            <div className="w-24 h-24 bg-[#8f0020]/5 rounded-2xl flex items-center justify-center text-slate-800 font-bold border border-slate-100 relative shrink-0">
              <span className="font-serif text-5xl leading-none">{kanji}</span>
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <span className="bg-[#fcebeb] text-[#8f0020] px-3 py-1 rounded-full text-xs font-bold w-fit uppercase tracking-wider">
                {kanjiData.moduleTitle || "Syllabus"}
              </span>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-none">
                {kanjiMeaning}
              </h1>
              <p className="text-sm font-medium text-slate-400">
                Romaji:{" "}
                <span className="font-semibold text-slate-600 font-mono">
                  {kanjiRomaji}
                </span>{" "}
                | Tingkat kesulitan:{" "}
                <span className="font-bold text-[#8f0020]">
                  {kanjiData.difficulty || "N4"}
                </span>
              </p>
            </div>
          </div>

          {/* Progress Breakdown Grid */}
          <div className="flex flex-wrap items-center gap-4 shrink-0 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 justify-around animate-zoom-in opacity-0">
            <div className="flex flex-col items-center select-none bg-slate-50/50 p-3 rounded-2xl border border-slate-100 min-w-[70px]">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Total
              </span>
              <div className="w-11 h-11 rounded-full bg-[#8f0020] flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                {masteryPercent}%
              </div>
            </div>

            <div className="flex flex-col items-center min-w-[60px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Tulis
              </span>
              <span className="text-sm font-bold text-slate-700">
                {writingPercent}%
              </span>
            </div>

            <div className="flex flex-col items-center min-w-[60px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Baca
              </span>
              <span className="text-sm font-bold text-slate-700">
                {readingPercent}%
              </span>
            </div>

            <div className="flex flex-col items-center min-w-[60px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Kuis
              </span>
              <span className="text-sm font-bold text-slate-700">
                {quizPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex border-b border-slate-200/80 mb-2 bg-white/60 backdrop-blur-md p-1.5 rounded-2xl shadow-xs gap-2">
          <button
            onClick={() => handleTabChange("detail")}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-extrabold text-sm transition-all border-none cursor-pointer select-none ${
              activeTab === "detail"
                ? "bg-[#8f0020] text-white shadow-md"
                : "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <PenTool className="w-4 h-4" />
            Menulis & Detail
          </button>
          <button
            onClick={() => handleTabChange("reading")}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-extrabold text-sm transition-all border-none cursor-pointer select-none ${
              activeTab === "reading"
                ? "bg-[#8f0020] text-white shadow-md"
                : "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Latihan Membaca
          </button>
          <button
            onClick={() => handleTabChange("quiz")}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-extrabold text-sm transition-all border-none cursor-pointer select-none ${
              activeTab === "quiz"
                ? "bg-[#8f0020] text-white shadow-md"
                : "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Kuis Evaluasi
          </button>
          <button
            onClick={() => handleTabChange("lms")}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-extrabold text-sm transition-all border-none cursor-pointer select-none ${
              activeTab === "lms"
                ? "bg-[#8f0020] text-white shadow-md"
                : "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Tugas & Diskusi
          </button>
        </div>

        {/* ================= TAB CONTENT: DETAIL & MENULIS ================= */}
        {activeTab === "detail" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Details + Jukugo + Examples + Etymology */}
            <div className="lg:col-span-6 space-y-6">
              {/* Onyomi/Kunyomi Card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex justify-around select-none animate-zoom-in opacity-0">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1">
                    Onyomi
                  </span>
                  <span className="text-xl font-extrabold text-[#8f0020] font-mono bg-[#8f0020]/5 px-4 py-1.5 rounded-xl border border-[#8f0020]/10">
                    {kanjiData.onyomi || etymologies?.[0]?.romaji || "-"}
                  </span>
                </div>
                <div className="w-[1px] bg-slate-100 self-stretch"></div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1">
                    Kunyomi
                  </span>
                  <span className="text-xl font-extrabold text-[#8f0020] font-mono bg-[#8f0020]/5 px-4 py-1.5 rounded-xl border border-[#8f0020]/10">
                    {kanjiData.kunyomi || etymologies?.[1]?.romaji || "-"}
                  </span>
                </div>
              </div>

              {/* Jukugo List */}
              <div className="space-y-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
                <h4 className="font-extrabold text-lg text-slate-800 flex items-center justify-between border-b border-slate-50 pb-3">
                  <span className="flex items-center gap-2">
                    <Volume2 className="text-[#8f0020] w-5 h-5" />
                    Daftar Jukugo (Kata Majemuk)
                  </span>
                  {renderXpBadge(!!kanjiData?.xpClaimed?.lesson, 5)}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {jukugos.map((j: any, idx: number) => (
                    <div
                      key={idx}
                      className="animate-jukugo-card border border-slate-100 hover:border-[#8f0020]/20 bg-slate-50/20 hover:bg-white rounded-2xl p-4 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-between group cursor-default"
                      style={{ animationDelay: `${idx * 60}ms` }}
                    >
                      <div className="flex flex-col gap-1 text-left">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-serif text-xl font-bold text-slate-800 tracking-wide select-all">
                            {j.word}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">
                            ({j.reading})
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#8f0020] leading-snug">
                          {j.meaning}
                        </span>
                      </div>

                      <button
                        onClick={() => playAudio(j.word)}
                        className="w-9 h-9 rounded-full bg-white border border-slate-100 hover:bg-[#8f0020] hover:text-white text-slate-500 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90"
                        title="Putar Suara"
                      >
                        <Volume2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Example sentences */}
              <div className="space-y-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
                <h4 className="font-extrabold text-lg text-slate-800">
                  Contoh Kalimat Penggunaan
                </h4>
                <div className="space-y-4">
                  {examples
                    .filter((ex: any) => !ex.isReading)
                    .map((item: any, idx: number) => (
                      <ExampleSentence
                        key={idx}
                        japanese={item.japanese}
                        romaji={item.romaji}
                        translation={item.translation}
                      />
                    ))}
                </div>
              </div>

              {/* Etymology Breakdown */}
              <KanjiEtymology etymologies={etymologies} />
            </div>

            {/* Right Column: Drawing Workspace + Stroke by Stroke + Semantic Graph */}
            <div className="lg:col-span-6 space-y-6">
              {/* Handwriting Practice Canvas */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-50">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center justify-between w-full">
                    <span className="flex items-center gap-2">
                      <PenTool className="text-[#8f0020] w-5 h-5 animate-bounce" />
                      Latihan Menulis Goresan
                    </span>
                    {renderXpBadge(!!kanjiData?.xpClaimed?.writing, 15)}
                  </h2>
                </div>

                <div className="flex flex-col gap-4">
                  {/* SVG Animated Stroke Visualizer */}
                  <KanjiStrokeVisualizer kanji={kanji.charAt(0)} />

                  {/* Canvas Pad */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
                    <div className="relative bg-white rounded-2xl border-2 border-slate-200/80 shadow-md w-full max-w-[340px] aspect-square overflow-hidden shrink-0">
                      <DrawingCanvas
                        ref={canvasRef}
                        strokeColor="#0f172a"
                        lineWidth={9}
                        kanji={kanji.charAt(0)}
                        showGuide={showGuide}
                      />
                    </div>

                    <div className="flex flex-row sm:flex-col gap-3 shrink-0">
                      <button
                        onClick={handleClear}
                        className="w-12 h-12 bg-white border border-slate-200 text-slate-600 rounded-full shadow-md flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all cursor-pointer active:scale-95"
                        title="Clear pad"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleUndo}
                        className="w-12 h-12 bg-white border border-slate-200 text-slate-600 rounded-full shadow-md flex items-center justify-center hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer active:scale-95"
                        title="Undo"
                      >
                        <Icon name="undo" className="block text-2xl" />
                      </button>
                      <button
                        onClick={() => setShowGuide(!showGuide)}
                        className={`w-12 h-12 border rounded-full shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-95 ${showGuide ? "bg-[#8f0020] border-[#8f0020] text-white hover:brightness-110" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                        title={
                          showGuide
                            ? "Sembunyikan panduan"
                            : "Tampilkan panduan"
                        }
                      >
                        <Icon
                          name={showGuide ? "visibility" : "visibility_off"}
                          className="block text-2xl"
                        />
                      </button>
                    </div>
                  </div>

                  {verifying && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center font-bold text-slate-600 flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-[#8f0020]"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Menganalisa urutan goresan penulisan...
                    </div>
                  )}

                  {verification && !verifying && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col gap-3 text-left select-text">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <span className="font-bold text-slate-800 text-sm">
                          Hasil Penulisan
                        </span>

                        <div className="flex gap-0.5 text-xl select-none">
                          {Array.from({ length: 5 }, (_, idx) => {
                            const isFilled = idx < verification.stars;
                            return (
                              <span
                                key={idx}
                                className={`${isFilled ? "text-amber-500" : "text-slate-300"}`}
                              >
                                ★
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div className="text-slate-700 font-extrabold text-sm">
                        {verification.feedbackMessage}
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[11px] font-bold text-slate-400">
                          <span>AKURASI</span>
                          <span>{verification.accuracy}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              verification.accuracy >= 80
                                ? "bg-emerald-500"
                                : verification.accuracy >= 60
                                  ? "bg-blue-500"
                                  : verification.accuracy >= 45
                                    ? "bg-amber-500"
                                    : "bg-rose-500"
                            }`}
                            style={{ width: `${verification.accuracy}%` }}
                          />
                        </div>
                      </div>

                      {/* Stroke status matrix grid */}
                      <div className="flex flex-col gap-1.5 mt-1">
                        <span className="text-[11px] font-bold text-slate-400">
                          DETAIL GORESAN:
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {Array.from(
                            { length: verification.totalStrokes },
                            (_, idx) => {
                              const strokeNum = idx + 1;
                              const isIncorrect =
                                verification.incorrectStrokes.includes(
                                  strokeNum,
                                );
                              return (
                                <div
                                  key={strokeNum}
                                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                                    isIncorrect
                                      ? "bg-rose-50 border-rose-200 text-rose-700"
                                      : "bg-emerald-50 border-emerald-200 text-emerald-700"
                                  }`}
                                  title={`Goresan ${strokeNum}: ${isIncorrect ? "Salah" : "Benar"}`}
                                >
                                  {strokeNum}
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>

                      {verification.backendMessage && (
                        <div
                          className={`p-3 rounded-xl flex items-start gap-2 border text-xs font-bold mt-2 ${
                            verification.isSaved
                              ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                              : "bg-rose-50 border-rose-100 text-rose-800"
                          }`}
                        >
                          <Icon
                            name={
                              verification.isSaved ? "check_circle" : "info"
                            }
                            className={`text-lg shrink-0 ${verification.isSaved ? "text-emerald-600" : "text-rose-600"}`}
                          />
                          <div className="flex-1 leading-relaxed">
                            {verification.backendMessage}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-center mt-2">
                    <button
                      onClick={handleVerify}
                      disabled={verifying}
                      className="bg-[#8f0020] text-white px-8 py-3 rounded-full hover:brightness-110 active:scale-95 transition-all cursor-pointer font-bold border-none shadow-md shadow-[#8f0020]/20"
                    >
                      {verifying ? "Menganalisa..." : "Evaluasi Goresan"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Stroke-by-Stroke guides */}
              <StrokeByStroke kanji={kanji.charAt(0)} />

              {/* Semantic Graph */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-extrabold text-lg text-slate-800">
                    Peta Semantik & Hubungan Kata
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowInfoModal(true)}
                    className="p-1 hover:bg-slate-100 rounded-full border-none bg-transparent cursor-pointer flex items-center justify-center text-slate-400 hover:text-slate-600"
                    title="Petunjuk Grafik Semantik"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                </div>

                {/* Graph Modal */}
                {showInfoModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
                    <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl max-w-[480px] w-full p-6 flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="font-bold text-lg text-[#8f0020] flex items-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          Petunjuk Grafik Semantik
                        </h3>
                        <button
                          type="button"
                          onClick={() => setShowInfoModal(false)}
                          className="p-1 hover:bg-slate-100 rounded-full border-none bg-transparent cursor-pointer flex items-center justify-center"
                        >
                          <X className="w-5 h-5 text-slate-400" />
                        </button>
                      </div>

                      <div className="text-sm text-slate-600 space-y-4 text-left">
                        <p>
                          Peta visual interaktif yang menggambarkan relasi
                          etimologis dan pembentukan kata gabungan (Jukugo) dari
                          Kanji yang sedang dipelajari.
                        </p>
                        <div>
                          <h4 className="font-bold text-slate-800 mb-1">
                            Arti Warna Simpul (Node):
                          </h4>
                          <ul className="space-y-2 mt-2">
                            <li className="flex items-center gap-2">
                              <span className="w-3.5 h-3.5 border-2 border-dashed border-red-500 rounded-md shrink-0 bg-white"></span>
                              <span>
                                <strong>ROOT (Garis Putus Merah)</strong>: Kanji
                                utama.
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-3.5 h-3.5 border-2 border-blue-500 rounded-md shrink-0 bg-white"></span>
                              <span>
                                <strong>TOP (Biru)</strong>: Karakter radikal
                                pembentuk bagian atas.
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-3.5 h-3.5 border-2 border-emerald-500 rounded-md shrink-0 bg-white"></span>
                              <span>
                                <strong>BOTTOM (Hijau)</strong>: Kata gabungan
                                Jukugo tingkat pertama.
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-3.5 h-3.5 border border-amber-500 rounded-md shrink-0 bg-amber-50"></span>
                              <span>
                                <strong>SUB-BOTTOM (Kuning / Oranye)</strong>:
                                Kosakata turunan lebih lanjut.
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex justify-end border-t border-slate-100 pt-3">
                        <button
                          type="button"
                          onClick={() => setShowInfoModal(false)}
                          className="px-5 py-2.5 bg-[#8f0020] text-white font-bold rounded-xl border-none hover:brightness-110 active:scale-95 transition-all cursor-pointer text-sm"
                        >
                          Tutup
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="relative h-80 w-full flex items-center justify-center bg-slate-50/50 border border-slate-100 rounded-2xl overflow-hidden">
                  {graph && graph.nodes && graph.nodes.length > 0 && (
                    <KanjiAtlasFlow
                      initialRawEdges={graph.edges}
                      initialRawNodes={graph.nodes}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB CONTENT: LATIHAN MEMBACA ================= */}
        {activeTab === "reading" && (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6 text-left max-w-4xl mx-auto w-full select-text">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center justify-between w-full mb-2">
                <span className="flex items-center gap-2">
                  <BookOpen className="text-[#8f0020] w-6 h-6" />
                  Latihan Membaca Contoh Kalimat
                </span>
                {renderXpBadge(!!kanjiData?.xpClaimed?.reading, 10)}
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Membaca nyaring contoh kalimat di bawah ini membantu menguasai
                konteks penggunaan Kanji serta memperkuat ingatan semantik Anda.
                Gunakan pemutaran suara untuk mencocokkan pelafalan.
              </p>
            </div>

            {/* Reading list sentences */}
            <div className="space-y-6">
              {examples
                .filter((ex: any) => ex.isReading)
                .map((item: any, idx: number) => {
                  const isChecked = !!readSentences[idx];
                  const isRevealed = !!revealedTranslation[idx];
                  return (
                    <div
                      key={idx}
                      className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row gap-4 justify-between items-start ${
                        isChecked
                          ? "bg-emerald-50/30 border-emerald-200/70 shadow-xs"
                          : "bg-slate-50/20 border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <div className="flex gap-4 items-start flex-1 min-w-0">
                        {/* Checkbox item */}
                        <div
                          className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 pointer-events-none select-none ${
                            isChecked
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "bg-slate-200/50 border-slate-300 text-transparent"
                          }`}
                        >
                          <Check className="w-4.5 h-4.5 stroke-[3px]" />
                        </div>

                        <div className="flex flex-col gap-2 flex-1 min-w-0">
                          {/* Sentence Text */}
                          <p className="font-serif text-2xl text-slate-800 tracking-wide leading-relaxed select-all">
                            {item.japanese}
                          </p>

                          {/* Speech Recording Active State Indicator */}
                          {activeRecordingIdx === idx && (
                            <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-800 text-xs font-bold animate-pulse">
                              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                              Mendengarkan... Silakan baca kalimat di atas
                              dengan suara lantang.
                            </div>
                          )}

                          {/* Speech Results comparison card */}
                          {speechResults[idx] && (
                            <div className="mt-3 p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2 select-text font-medium text-xs text-slate-600">
                              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                <span className="font-extrabold text-slate-700 uppercase tracking-wider">
                                  Hasil Tes Membaca
                                </span>
                                <span
                                  className={`px-2.5 py-1 rounded-full text-white font-extrabold text-[10px] uppercase tracking-wider ${
                                    speechResults[idx].score >= 70
                                      ? "bg-emerald-500 shadow-sm"
                                      : "bg-rose-500 shadow-sm"
                                  }`}
                                >
                                  Akurasi: {speechResults[idx].score}%{" "}
                                  {speechResults[idx].score >= 70
                                    ? "(LULUS)"
                                    : "(COBA LAGI)"}
                                </span>
                              </div>

                              <div className="py-1">
                                <span className="text-[10px] font-bold text-slate-400 block mb-1">
                                  SOROTAN PELAFALAN:
                                </span>
                                <p className="font-serif text-lg tracking-wide leading-relaxed">
                                  {speechResults[idx].diffParts.map(
                                    (part, pIdx) => (
                                      <span
                                        key={pIdx}
                                        className={
                                          part.type === "match"
                                            ? "text-emerald-600 font-bold"
                                            : "text-rose-500 font-black underline decoration-rose-500 decoration-2"
                                        }
                                      >
                                        {part.char}
                                      </span>
                                    ),
                                  )}
                                </p>
                              </div>

                              <div>
                                <span className="text-[10px] font-bold text-slate-400 block">
                                  ANDA MENGUCAPKAN:
                                </span>
                                <p className="font-mono text-slate-700 mt-0.5">
                                  "{speechResults[idx].transcript}"
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Interactive Translation Toggles */}
                          <div className="flex flex-col gap-1 mt-2">
                            <button
                              onClick={() => {
                                setRevealedTranslation((prev) => ({
                                  ...prev,
                                  [idx]: !prev[idx],
                                }));
                              }}
                              className="text-xs font-bold text-[#8f0020] hover:underline bg-transparent border-none cursor-pointer w-fit text-left p-0"
                            >
                              {isRevealed
                                ? "Sembunyikan arti & romaji"
                                : "Tampilkan arti & romaji"}
                            </button>

                            {isRevealed && (
                              <div className="mt-2 text-sm space-y-1 bg-white p-3 rounded-xl border border-slate-100 shadow-xs leading-relaxed animate-fade-in font-medium text-slate-600">
                                <p className="font-mono text-slate-500 text-xs">
                                  Romaji: {item.romaji}
                                </p>
                                <p className="text-slate-700">
                                  Arti: {item.translation}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Audio & Recording Control Panel */}
                      <div className="flex flex-row sm:flex-col gap-2 items-center self-end sm:self-center shrink-0">
                        <button
                          onClick={() => playAudio(item.japanese)}
                          className="w-10 h-10 rounded-full bg-white border border-slate-100 hover:bg-[#8f0020] hover:text-white text-slate-500 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90"
                          title="Dengarkan Suara Pelafalan"
                        >
                          <Volume2 className="w-4.5 h-4.5" />
                        </button>

                        {activeRecordingIdx === idx ? (
                          <button
                            onClick={stopSpeechRecognition}
                            className="h-10 px-4 rounded-full bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md hover:bg-red-600 active:scale-95 transition-all border-none"
                          >
                            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                            Stop Tes
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              startSpeechRecognition(idx, item.japanese)
                            }
                            disabled={activeRecordingIdx !== null}
                            className={`h-10 px-4 rounded-full border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                              activeRecordingIdx !== null &&
                              activeRecordingIdx !== idx
                                ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-white border-slate-200 text-slate-700 hover:border-[#8f0020] hover:text-[#8f0020] active:scale-95 shadow-xs"
                            }`}
                          >
                            <Icon name="mic" className="text-sm" />
                            Mulai Tes
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

              {examples.filter((ex: any) => ex.isReading).length === 0 && (
                <p className="text-sm text-slate-400 italic">
                  Belum ada kalimat latihan membaca yang dimuat untuk kanji ini.
                </p>
              )}
            </div>

            {/* Submit progress */}
            <div className="border-t border-slate-100 pt-6 flex justify-between items-center">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                PROGRES: {Object.values(readSentences).filter(Boolean).length} /{" "}
                {examples.filter((ex: any) => ex.isReading).length > 0
                  ? examples.filter((ex: any) => ex.isReading).length
                  : examples.length}{" "}
                SELESAI
              </div>

              <div className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 select-none">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Progres Tersimpan Otomatis
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB CONTENT: LATIHAN SOAL (KUIS) ================= */}
        {activeTab === "quiz" && (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs max-w-2xl mx-auto w-full select-text text-left min-h-[380px] flex flex-col gap-6">
            {/* Quiz Heading info */}
            {!quizFinished && quizQuestions.length > 0 && (
              <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Award className="text-[#8f0020] w-6 h-6 shrink-0" />
                    <span className="font-extrabold text-slate-800 text-lg">
                      Kuis Evaluasi Kanji
                    </span>
                  </div>
                  <div className="mr-2">
                    {renderXpBadge(!!kanjiData?.xpClaimed?.quiz, 20)}
                  </div>
                </div>
                <div className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                  Soal {currentQuestionIdx + 1} dari {quizQuestions.length}
                </div>
              </div>
            )}

            {/* Stepper implementation */}
            {!quizFinished && quizQuestions.length > 0 && (
              <div className="flex-1 flex flex-col gap-6 justify-between">
                {/* Question Details container */}
                <div className="space-y-4">
                  <p className="font-extrabold text-slate-700 text-base leading-relaxed">
                    {quizQuestions[currentQuestionIdx].question}
                  </p>

                  {/* MULTIPLE CHOICE / FILL IN BLANKS */}
                  {(quizQuestions[currentQuestionIdx].type === "multiple" ||
                    quizQuestions[currentQuestionIdx].type === "fill") && (
                    <div className="grid grid-cols-1 gap-3 mt-4">
                      {(quizQuestions[currentQuestionIdx].options || []).map(
                        (opt, oIdx) => {
                          const isCorrect = correctAnswerClicked === opt;
                          const isWrong = wrongAnswers.includes(opt);
                          return (
                            <button
                              key={oIdx}
                              onClick={() =>
                                handleMultipleChoiceClick(
                                  opt,
                                  quizQuestions[currentQuestionIdx]
                                    .correctAnswer || "",
                                  quizQuestions,
                                )
                              }
                              disabled={!!correctAnswerClicked}
                              className={`p-4 rounded-2xl border text-left font-bold text-sm transition-all flex items-center justify-between cursor-pointer ${
                                isCorrect
                                  ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                                  : isWrong
                                    ? "bg-red-50 border-red-500 text-red-700"
                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              <span>{opt}</span>
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                                  isCorrect
                                    ? "border-emerald-500 bg-emerald-500 text-white"
                                    : isWrong
                                      ? "border-red-500 bg-red-500 text-white"
                                      : "border-slate-300 bg-transparent text-transparent"
                                }`}
                              >
                                {isWrong ? (
                                  <X className="w-3.5 h-3.5 stroke-[3px]" />
                                ) : (
                                  <Check className="w-3.5 h-3.5 stroke-[3px]" />
                                )}
                              </div>
                            </button>
                          );
                        },
                      )}
                    </div>
                  )}

                  {/* SENTENCE UNSCRAMBLE */}
                  {quizQuestions[currentQuestionIdx].type === "unscramble" && (
                    <div className="space-y-6 mt-4">
                      {/* Selection visual board area */}
                      <div className="min-h-[70px] p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-wrap gap-2 items-center">
                        {unscrambleSelected.map((word, wIdx) => (
                          <div
                            key={wIdx}
                            className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm flex items-center gap-1"
                          >
                            {word}
                            <Check className="w-3.5 h-3.5 stroke-[3px]" />
                          </div>
                        ))}
                        {unscrambleSelected.length === 0 && (
                          <span className="text-slate-400 font-medium text-sm italic">
                            Klik tombol kata di bawah untuk menyusun kalimat...
                          </span>
                        )}
                      </div>

                      {/* Word buttons pool */}
                      <div className="flex flex-wrap gap-2 justify-center pt-2">
                        {(quizQuestions[currentQuestionIdx].words || []).map(
                          (word, wIdx) => {
                            const isUsed = unscrambleSelected.includes(word);
                            const isWrongWord = unscrambleWrongWord === word;
                            return (
                              <button
                                key={wIdx}
                                onClick={() =>
                                  handleUnscrambleWordClick(
                                    word,
                                    quizQuestions[currentQuestionIdx],
                                    quizQuestions,
                                  )
                                }
                                disabled={isUsed}
                                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all border cursor-pointer select-none active:scale-95 ${
                                  isUsed
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-500 cursor-not-allowed"
                                    : isWrongWord
                                      ? "bg-red-50 border-red-500 text-red-600 animate-pulse"
                                      : "bg-white border-slate-200 text-slate-700 hover:border-[#8f0020]/30 hover:bg-slate-50"
                                }`}
                              >
                                {word}
                              </button>
                            );
                          },
                        )}
                      </div>
                    </div>
                  )}

                  {/* MATCHING COMPONENT */}
                  {quizQuestions[currentQuestionIdx].type === "matching" && (
                    <div className="space-y-3 mt-4">
                      {(quizQuestions[currentQuestionIdx].pairs || []).map(
                        (pair, pIdx) => {
                          const allRightOptions = (
                            quizQuestions[currentQuestionIdx].pairs || []
                          ).map((p) => p.right);
                          const isCorrect = matchingCorrect[pair.left];
                          const isWrong = matchingWrong[pair.left];
                          return (
                            <div
                              key={pIdx}
                              className={`flex items-center justify-between gap-4 p-3 border rounded-2xl transition-all ${
                                isCorrect
                                  ? "bg-emerald-50/70 border-emerald-500 text-emerald-700"
                                  : isWrong
                                    ? "bg-red-50/70 border-red-400 text-red-700"
                                    : "bg-slate-50/50 border-slate-100 text-slate-700"
                              }`}
                            >
                              <span className="font-serif text-lg font-bold px-2 shrink-0 select-none">
                                {pair.left}
                              </span>

                              <select
                                value={matchingAnswers[pair.left] || ""}
                                disabled={isCorrect}
                                onChange={(e) =>
                                  handleMatchingSelect(
                                    pair.left,
                                    e.target.value,
                                    quizQuestions[currentQuestionIdx],
                                    quizQuestions,
                                  )
                                }
                                className={`px-4 py-2 border rounded-xl text-sm font-bold focus:outline-none bg-white cursor-pointer ${
                                  isCorrect
                                    ? "border-emerald-500 text-emerald-700 bg-emerald-50/20"
                                    : isWrong
                                      ? "border-red-400 text-red-700 bg-red-50/20"
                                      : "border-slate-200 text-slate-600 focus:border-[#8f0020]"
                                }`}
                              >
                                <option value="">-- Pilih Arti --</option>
                                {allRightOptions.map((opt, oIdx) => (
                                  <option key={oIdx} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            </div>
                          );
                        },
                      )}
                    </div>
                  )}

                  {/* ESSAY COMPONENT */}
                  {quizQuestions[currentQuestionIdx].type === "essay" && (
                    <div className="space-y-3 mt-4">
                      <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wide">
                        Gunakan kosakata:{" "}
                        <span className="text-[#8f0020] font-mono font-black text-sm">
                          {quizQuestions[currentQuestionIdx].targetWord}
                        </span>
                      </p>
                      <textarea
                        value={essayAnswer}
                        disabled={essayStatus === "correct"}
                        onChange={(e) => {
                          setEssayAnswer(e.target.value);
                          if (essayStatus === "wrong") {
                            setEssayStatus("neutral");
                          }
                        }}
                        placeholder="Ketik kalimat buatan Anda di sini..."
                        className={`w-full min-h-[100px] p-4 border rounded-2xl focus:outline-none text-sm font-medium transition-all ${
                          essayStatus === "correct"
                            ? "border-emerald-500 bg-emerald-50/20 text-emerald-800"
                            : essayStatus === "wrong"
                              ? "border-red-400 bg-red-50/20 text-red-800"
                              : "border-slate-200 text-slate-700 focus:border-[#8f0020]"
                        }`}
                      />
                    </div>
                  )}

                  {/* GROUPING COMPONENT */}
                  {quizQuestions[currentQuestionIdx].type === "grouping" && (
                    <div className="space-y-4 mt-4 animate-scale-up">
                      <p className="text-xs font-extrabold text-slate-500 italic select-none">
                        Pilihlah kelompok/kategori yang tepat untuk
                        masing-masing kosakata di bawah ini:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1 sidebar-scroll">
                        {(quizQuestions[currentQuestionIdx].words || []).map(
                          (word, wIdx) => {
                            const groupOptions = (
                              quizQuestions[currentQuestionIdx].groups || []
                            ).map((g) => g.name);
                            const isCorrect = groupingCorrect[word];
                            const isWrong = groupingWrong[word];
                            return (
                              <div
                                key={wIdx}
                                className={`flex items-center justify-between gap-4 p-3 border rounded-2xl shadow-sm transition-all ${
                                  isCorrect
                                    ? "bg-emerald-50/70 border-emerald-500 text-emerald-700"
                                    : isWrong
                                      ? "bg-red-50/70 border-red-400 text-red-700"
                                      : "bg-slate-50/50 border-slate-100 text-slate-700"
                                }`}
                              >
                                <span className="font-serif text-sm font-bold select-none">
                                  {word}
                                </span>
                                <select
                                  value={groupingAnswers[word] || ""}
                                  disabled={isCorrect}
                                  onChange={(e) =>
                                    handleGroupingSelect(
                                      word,
                                      e.target.value,
                                      quizQuestions[currentQuestionIdx],
                                      quizQuestions,
                                    )
                                  }
                                  className={`px-3 py-1.5 border rounded-xl text-xs font-bold focus:outline-none bg-white cursor-pointer ${
                                    isCorrect
                                      ? "border-emerald-500 text-emerald-700 bg-emerald-50/20"
                                      : isWrong
                                        ? "border-red-400 text-red-700 bg-red-50/20"
                                        : "border-slate-200 text-slate-600 focus:border-[#8f0020]"
                                  }`}
                                >
                                  <option value="">-- Pilih Kelompok --</option>
                                  {groupOptions.map((gName, gIdx) => (
                                    <option key={gIdx} value={gName}>
                                      {gName}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Step Controller action buttons */}
                <div className="border-t border-slate-100 pt-6 flex justify-end">
                  {quizQuestions[currentQuestionIdx].type === "essay" &&
                    essayStatus !== "correct" && (
                      <button
                        onClick={() =>
                          handleEssayCheck(
                            quizQuestions[currentQuestionIdx],
                            quizQuestions,
                          )
                        }
                        disabled={!essayAnswer.trim()}
                        className="bg-[#8f0020] text-white px-8 py-3 rounded-full font-bold shadow-md hover:brightness-110 active:scale-95 transition-all border-none flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <span>Periksa</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                </div>
              </div>
            )}

            {/* Finished/Completed Quiz View */}
            {quizFinished && (
              <div className="flex-1 flex flex-col gap-6 text-center select-text">
                <div className="space-y-3">
                  <div className="w-20 h-20 bg-[#8f0020]/5 text-[#8f0020] rounded-full flex items-center justify-center mx-auto border border-[#8f0020]/10 shadow-sm">
                    <Award className="w-10 h-10 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800">
                    Kuis Selesai!
                  </h3>
                  <p className="text-sm font-bold text-slate-400">
                    Nilai akhir Anda:
                  </p>
                  <div className="text-5xl font-black text-[#8f0020] tracking-tight">
                    {quizScore}%
                  </div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 rounded-full px-4 py-1.5 w-fit mx-auto">
                    {quizScore >= 75
                      ? "LUAR BIASA! KUIS SELESAI"
                      : "TETAP SEMANGAT, COBA LAGI!"}
                  </p>
                </div>

                {/* Answers audit breakdown check */}
                <div className="space-y-4 text-left border border-slate-100 bg-slate-50/20 p-5 rounded-3xl">
                  <h4 className="font-extrabold text-sm text-slate-700 uppercase tracking-wide">
                    Tinjauan Jawaban:
                  </h4>
                  <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                    {quizFeedback.map((fb, idx) => (
                      <div
                        key={idx}
                        className="p-3 border border-slate-50 bg-white rounded-xl shadow-xs leading-relaxed flex items-start gap-3"
                      >
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold mt-0.5 ${
                            fb.isCorrect ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                        >
                          {fb.isCorrect ? "✓" : "✗"}
                        </div>
                        <div className="flex-1 text-sm font-medium">
                          <p className="font-bold text-slate-800 leading-snug">
                            {fb.question}
                          </p>
                          <p className="text-slate-500 text-xs mt-1">
                            Jawaban Anda:{" "}
                            <span
                              className={
                                fb.isCorrect
                                  ? "text-emerald-700 font-bold"
                                  : "text-rose-700 font-bold"
                              }
                            >
                              {fb.studentAnswer}
                            </span>
                          </p>
                          {!fb.isCorrect && (
                            <p className="text-slate-500 text-xs">
                              Jawaban Benar:{" "}
                              <span className="text-emerald-700 font-bold">
                                {fb.correctAnswer}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleResetQuiz}
                    disabled={savingQuiz}
                    className="px-6 py-3 bg-[#8f0020] text-white rounded-full font-bold shadow-md hover:brightness-110 active:scale-95 transition-all border-none cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {savingQuiz ? "Menyimpan Nilai..." : "Ulangi Kuis"}
                  </button>
                  <button
                    onClick={() => handleTabChange("detail")}
                    className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-full font-bold shadow-xs hover:bg-slate-50 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                  >
                    Kembali Ke Detail
                  </button>
                </div>
              </div>
            )}

            {quizQuestions.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <p className="text-sm text-slate-400 italic">
                  Gagal memuat atau menyusun soal kuis latihan.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB CONTENT: LMS TUGAS & DISKUSI ================= */}
        {activeTab === "lms" && (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
              <FileText className="text-[#8f0020] w-6 h-6 shrink-0" />
              <h3 className="font-extrabold text-slate-800 text-lg">
                Tugas & Latihan LMS
              </h3>
            </div>

            {loadingLms ? (
              <div className="text-center py-8 text-slate-400 font-bold animate-pulse text-sm">
                Memuat tugas modul...
              </div>
            ) : lmsAssignments.length === 0 ? (
              <div className="text-center py-8 text-slate-400 font-medium italic text-sm">
                Belum ada tugas yang diberikan untuk Modul atau Kanji ini.
              </div>
            ) : (
              <div className="space-y-4">
                {lmsAssignments.map((assign) => {
                  const hasSubmitted =
                    assign.submissions && assign.submissions.length > 0;

                  const submission = hasSubmitted
                    ? assign.submissions[0]
                    : null;
                  const dueDateText = assign.dueDate
                    ? new Date(assign.dueDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Tidak ada";

                  // Memfilter komentar yang hanya milik assignmentId ini
                  const currentAssignmentComments = lmsComments.filter(
                    (comm) => comm.assignmentId === assign.id,
                  );

                  return (
                    <div
                      key={assign.id}
                      className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col gap-4"
                    >
                      <div>
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                          <h4 className="font-black text-slate-800 text-base">
                            {assign.title}
                          </h4>
                          <div className="flex flex-col items-end gap-1">
                            {(() => {
                              const now = new Date();
                              const due = assign.dueDate ? new Date(assign.dueDate) : null;
                              const isExpired = due && now > due && !hasSubmitted;
                              const isLate = due && hasSubmitted && submission && new Date(submission.submittedAt) > due;

                              if (isExpired) {
                                return (
                                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-red-100 text-red-700">
                                    Expired
                                  </span>
                                );
                              }

                              return (
                                <>
                                  <span
                                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                      hasSubmitted
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-amber-100 text-amber-700"
                                    }`}
                                  >
                                    {hasSubmitted
                                      ? "Sudah Mengumpulkan"
                                      : "Belum Mengumpulkan"}
                                  </span>
                                  {isLate && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-700 uppercase tracking-wide">
                                      Terlambat
                                    </span>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        </div>

                        <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed mb-4">
                          {assign.description}
                        </p>

                        {(() => {
                          const materials = [];
                          if (assign.materialsData) {
                            try {
                              materials.push(
                                ...JSON.parse(assign.materialsData),
                              );
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
                                  let bgClass =
                                    "bg-slate-100 border-slate-200 text-slate-700";
                                  let targetUrl = m.url;

                                  if (m.type === "youtube") {
                                    bgClass =
                                      "bg-red-50 border-red-200/45 text-red-700";
                                  } else if (m.type === "gdrive") {
                                    bgClass =
                                      "bg-blue-50 border-blue-200/45 text-blue-700";
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

                        <div className="flex items-center gap-1 text-xs text-slate-400 font-bold mb-4">
                          <Calendar className="w-3.5 h-3.5" />
                          Batas Waktu: {dueDateText}
                        </div>

                        {/* Submission state/form */}
                        {hasSubmitted ? (
                          <div className="border border-slate-200/60 rounded-xl p-4 bg-white space-y-3">
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                Jawaban Anda
                              </span>
                              {submission.content && (
                                <p className="text-slate-700 text-sm font-medium whitespace-pre-wrap mt-0.5">
                                  {submission.content}
                                </p>
                              )}
                              {submission.submissionType === "file" &&
                                submission.fileUrl && (
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
                              {submission.submissionType === "youtube" &&
                                submission.submissionLink && (
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
                              {submission.submissionType === "gdrive" &&
                                submission.submissionLink && (
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
                              <p className="text-slate-400 text-xs italic font-medium pt-2 border-t border-slate-100">
                                Menunggu penilaian & feedback dari Dosen...
                              </p>
                            )}

                            {/* Re-submit option if not graded */}
                            {!submission.grade && (
                              <div className="mt-3 border-t border-slate-100 pt-3 space-y-3">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                                  Perbarui Jawaban
                                </span>

                                {/* Selector buttons */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-50 p-1 rounded-xl">
                                  {(
                                    [
                                      {
                                        id: "text",
                                        label: "Teks",
                                        icon: FileText,
                                      },
                                      {
                                        id: "file",
                                        label: "File",
                                        icon: Paperclip,
                                      },
                                      {
                                        id: "youtube",
                                        label: "YouTube",
                                        icon: Volume2,
                                      },
                                      {
                                        id: "gdrive",
                                        label: "GDrive",
                                        icon: Sparkles,
                                      },
                                    ] as const
                                  ).map((typeItem) => {
                                    const IconComp = typeItem.icon;
                                    const isSelected =
                                      (activeSubmissionTypes[assign.id] ||
                                        "text") === typeItem.id;
                                    return (
                                      <button
                                        key={typeItem.id}
                                        type="button"
                                        onClick={() => {
                                          setActiveSubmissionTypes((prev) => ({
                                            ...prev,
                                            [assign.id]: typeItem.id,
                                          }));
                                        }}
                                        className={`py-1.5 rounded-lg text-[10px] font-black border-none cursor-pointer flex items-center justify-center gap-1 transition-all ${
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

                                {(activeSubmissionTypes[assign.id] ||
                                  "text") === "text" && (
                                  <textarea
                                    value={
                                      submissionContents[assign.id] !==
                                      undefined
                                        ? submissionContents[assign.id]
                                        : submission.content
                                    }
                                    onChange={(e) =>
                                      setSubmissionContents((prev) => ({
                                        ...prev,
                                        [assign.id]: e.target.value,
                                      }))
                                    }
                                    placeholder="Perbarui jawaban teks Anda..."
                                    className="w-full min-h-[80px] p-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8f0020] font-medium"
                                  />
                                )}

                                {(activeSubmissionTypes[assign.id] ||
                                  "text") === "file" && (
                                  <div className="flex flex-col gap-1">
                                    <input
                                      type="file"
                                      onChange={(e) =>
                                        setSubmissionFiles((prev) => ({
                                          ...prev,
                                          [assign.id]:
                                            e.target.files?.[0] || null,
                                        }))
                                      }
                                      className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl p-2 w-full text-xs font-semibold cursor-pointer outline-none"
                                    />
                                  </div>
                                )}

                                {(activeSubmissionTypes[assign.id] ||
                                  "text") === "youtube" && (
                                  <input
                                    type="url"
                                    value={submissionLinks[assign.id] || ""}
                                    onChange={(e) =>
                                      setSubmissionLinks((prev) => ({
                                        ...prev,
                                        [assign.id]: e.target.value,
                                      }))
                                    }
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#8f0020] font-semibold"
                                  />
                                )}

                                {(activeSubmissionTypes[assign.id] ||
                                  "text") === "gdrive" && (
                                  <input
                                    type="url"
                                    value={submissionLinks[assign.id] || ""}
                                    onChange={(e) =>
                                      setSubmissionLinks((prev) => ({
                                        ...prev,
                                        [assign.id]: e.target.value,
                                      }))
                                    }
                                    placeholder="https://drive.google.com/drive/folders/..."
                                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#8f0020] font-semibold"
                                  />
                                )}

                                <button
                                  onClick={() =>
                                    handleSubmitAssignment(assign.id)
                                  }
                                  disabled={submittingSubmission[assign.id]}
                                  className="bg-[#8f0020] text-white w-full py-2 rounded-lg text-xs font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all border-none cursor-pointer disabled:opacity-50 mt-1"
                                >
                                  {submittingSubmission[assign.id]
                                    ? "Memperbarui..."
                                    : "Perbarui Jawaban"}
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
                              {(
                                [
                                  {
                                    id: "text",
                                    label: "Teks",
                                    icon: FileText,
                                  },
                                  {
                                    id: "file",
                                    label: "File",
                                    icon: Paperclip,
                                  },
                                  {
                                    id: "youtube",
                                    label: "YouTube",
                                    icon: Volume2,
                                  },
                                  {
                                    id: "gdrive",
                                    label: "GDrive",
                                    icon: Sparkles,
                                  },
                                ] as const
                              ).map((typeItem) => {
                                const IconComp = typeItem.icon;
                                const isSelected =
                                  (activeSubmissionTypes[assign.id] ||
                                    "text") === typeItem.id;
                                return (
                                  <button
                                    key={typeItem.id}
                                    type="button"
                                    onClick={() => {
                                      setActiveSubmissionTypes((prev) => ({
                                        ...prev,
                                        [assign.id]: typeItem.id,
                                      }));
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
                            {(activeSubmissionTypes[assign.id] || "text") ===
                              "text" && (
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                  Ketik Jawaban Teks
                                </span>
                                <textarea
                                  value={submissionContents[assign.id] || ""}
                                  onChange={(e) =>
                                    setSubmissionContents((prev) => ({
                                      ...prev,
                                      [assign.id]: e.target.value,
                                    }))
                                  }
                                  placeholder="Ketik jawaban tugas Anda di sini..."
                                  className="w-full min-h-[100px] p-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#8f0020] font-medium"
                                />
                              </div>
                            )}

                            {(activeSubmissionTypes[assign.id] || "text") ===
                              "file" && (
                              <div className="flex flex-col gap-1.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                  Pilih Berkas Jawaban (Gambar, PDF, Word, Teks
                                  - Maks 1 berkas, 10MB)
                                </span>
                                <input
                                  type="file"
                                  onChange={(e) =>
                                    setSubmissionFiles((prev) => ({
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

                            {(activeSubmissionTypes[assign.id] || "text") ===
                              "youtube" && (
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                  Link Video YouTube
                                </span>
                                <input
                                  type="url"
                                  value={submissionLinks[assign.id] || ""}
                                  onChange={(e) =>
                                    setSubmissionLinks((prev) => ({
                                      ...prev,
                                      [assign.id]: e.target.value,
                                    }))
                                  }
                                  placeholder="https://www.youtube.com/watch?v=..."
                                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#8f0020] font-semibold"
                                />
                              </div>
                            )}

                            {(activeSubmissionTypes[assign.id] || "text") ===
                              "gdrive" && (
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                  Link Google Drive
                                </span>
                                <input
                                  type="url"
                                  value={submissionLinks[assign.id] || ""}
                                  onChange={(e) =>
                                    setSubmissionLinks((prev) => ({
                                      ...prev,
                                      [assign.id]: e.target.value,
                                    }))
                                  }
                                  placeholder="https://drive.google.com/drive/folders/..."
                                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#8f0020] font-semibold"
                                />
                              </div>
                            )}

                            <button
                              onClick={() => handleSubmitAssignment(assign.id)}
                              disabled={submittingSubmission[assign.id]}
                              className="bg-[#8f0020] text-white w-full py-2.5 rounded-xl text-sm font-bold shadow-md hover:brightness-105 active:scale-95 transition-all border-none cursor-pointer disabled:opacity-50 mt-2"
                            >
                              {submittingSubmission[assign.id]
                                ? "Mengirim..."
                                : "Kumpulkan Tugas"}
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                          <MessageSquare className="text-[#8f0020] w-6 h-6 shrink-0" />
                          <h3 className="font-extrabold text-slate-800 text-lg">
                            Forum Diskusi Kanji
                          </h3>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1 sidebar-scroll">
                          {currentAssignmentComments.length === 0 ? (
                            <div className="text-center py-4 text-slate-400 font-medium italic text-xs">
                              Belum ada diskusi untuk tugas ini. Mulai kirim
                              komentar pertama Anda!
                            </div>
                          ) : (
                            currentAssignmentComments.map((comm) => {
                              const isOwner =
                                currentUser && comm.userId === currentUser.id;
                              return (
                                <div
                                  key={comm.id}
                                  className="flex gap-3 items-start border-b border-slate-50 pb-2 last:border-0 text-xs"
                                >
                                  <img
                                    src={
                                      comm.user?.avatar ||
                                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150"
                                    }
                                    alt={comm.user?.name}
                                    className="w-6 h-6 rounded-full object-cover shadow-xs"
                                  />
                                  <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                      <span className="font-bold text-slate-800">
                                        {comm.user?.name || "User"}
                                      </span>
                                      {isOwner && (
                                        <button
                                          onClick={() =>
                                            handleDeleteComment(comm.id)
                                          }
                                          className="text-rose-600 hover:underline bg-transparent border-none text-[10px] font-bold cursor-pointer"
                                        >
                                          Hapus
                                        </button>
                                      )}
                                    </div>
                                    <p className="text-slate-600 font-medium mt-0.5">
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
                          className="border-t border-slate-100 pt-4 flex gap-2"
                        >
                          <input
                            type="text"
                            value={newCommentContent}
                            onChange={(e) =>
                              setNewCommentContent(e.target.value)
                            }
                            placeholder="Tulis tanggapan atau pertanyaan..."
                            className="flex-1 p-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#8f0020] font-medium"
                            required
                          />
                          <button
                            type="submit"
                            disabled={
                              submittingComment || !newCommentContent.trim()
                            }
                            className="bg-[#8f0020] text-white p-3 rounded-xl hover:brightness-105 active:scale-95 transition-all cursor-pointer border-none flex items-center justify-center disabled:opacity-50"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating XP Reward Notification Toast */}
      {xpNotification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur text-white px-6 py-3.5 rounded-full border border-amber-500/35 shadow-2xl flex items-center gap-3 animate-fade-in animate-bounce">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-md text-xs">
            XP
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-sm text-amber-400">
              Selamat! Anda mendapatkan +{xpNotification.amount} XP
            </span>
            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
              {xpNotification.description}
            </span>
          </div>
          <button
            onClick={() => setXpNotification(null)}
            className="text-white/50 hover:text-white transition-all bg-transparent border-none cursor-pointer p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Floating Learning Success Notification Toast */}
      {successNotification && (
        <div
          className={`fixed ${xpNotification ? "top-24" : "top-6"} left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur text-white px-6 py-3.5 rounded-full border border-emerald-500/35 shadow-2xl flex items-center gap-3 animate-fade-in animate-bounce`}
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-md">
            <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-sm text-emerald-400">
              Keberhasilan Belajar! ({successNotification.score}%)
            </span>
            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
              {successNotification.text}
            </span>
          </div>
          <button
            onClick={() => setSuccessNotification(null)}
            className="text-white/50 hover:text-white transition-all bg-transparent border-none cursor-pointer p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Realtime Graded Notification Modal overlay */}
      {gradeNotification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in select-none">
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

            {gradeNotification.feedback && (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 w-full">
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
    </Layout>
  );
};

export default LatihanPage;
