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
  CheckCircle2,
  Info,
  X,
  Volume2,
  RotateCcw,
  Sparkles,
  Check,
  ArrowRight
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

const getQuizQuestions = (_kanjiChar: string, _jukugosList: any[], _examplesList: any[]): QuizQuestion[] => {
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
        tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return tmp[a.length][b.length];
};

const getSimilarity = (str1: string, str2: string): number => {
  const clean = (s: string) => s.replace(/[\s\u3000、。！？」『』\.,\?!-]/g, "").toLowerCase();
  const s1 = clean(str1);
  const s2 = clean(str2);
  if (!s1 || !s2) return 0;
  const distance = getLevenshteinDistance(s1, s2);
  const maxLength = Math.max(s1.length, s2.length);
  return Math.round(((maxLength - distance) / maxLength) * 100);
};

const diffCharacters = (target: string, spoken: string): DiffPart[] => {
  const clean = (s: string) => s.replace(/[\s\u3000、。！？」『』\.,\?!-]/g, "").toLowerCase();
  const targetClean = clean(target);
  const spokenClean = clean(spoken);
  
  const m = targetClean.length;
  const n = spokenClean.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  
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
      type: isPunctuation || matchedOriginal[idx] ? "match" : "miss"
    });
  }
  
  return result;
};

export const LatihanPage: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = React.useRef<DrawingCanvasRef>(null);

  const renderXpBadge = (isClaimed: boolean, amount: number) => {
    if (isClaimed) {
      return (
        <span className="bg-emerald-500/10 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-extrabold flex items-center gap-1 select-none border border-emerald-500/10">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>+{amount} XP
        </span>
      );
    }
    return (
      <span className="bg-amber-500/10 text-amber-700 text-xs px-2.5 py-1 rounded-full font-extrabold flex items-center gap-1 select-none border border-amber-500/10">
        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>+{amount} XP
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
  const [activeTab, setActiveTab] = useState<"detail" | "reading" | "quiz">("detail");

  // Reading tab states
  const [readSentences, setReadSentences] = useState<Record<number, boolean>>({});
  const [savingReading, setSavingReading] = useState(false);
  const [revealedTranslation, setRevealedTranslation] = useState<Record<number, boolean>>({});

  // Reading Speech-to-Text states
  const [activeRecordingIdx, setActiveRecordingIdx] = useState<number | null>(null);
  const [speechResults, setSpeechResults] = useState<Record<number, { transcript: string; score: number; diffParts: DiffPart[] }>>({});
  const recognitionRef = React.useRef<any>(null);

  // Quiz tab states
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [matchingAnswers, setMatchingAnswers] = useState<Record<string, string>>({});
  const [unscrambleSelected, setUnscrambleSelected] = useState<string[]>([]);
  const [essayAnswer, setEssayAnswer] = useState("");
  const [groupingAnswers, setGroupingAnswers] = useState<Record<string, string>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<any[]>([]);
  const [savingQuiz, setSavingQuiz] = useState(false);
  const [xpNotification, setXpNotification] = useState<{ amount: number; description: string } | null>(null);

  const triggerXpReward = (amount: number, description: string) => {
    if (amount <= 0) return;
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
    setXpNotification({ amount, description });
    setTimeout(() => {
      setXpNotification(null);
    }, 4500);
  };

  const [searchParams] = useSearchParams();
  const charParam = searchParams.get("char") || "試";

  useEffect(() => {
    const fetchKanji = async () => {
      try {
        setLoading(true);
        const data = await api.latihan.get(charParam);
        setKanjiData(data);
        
        if (data.xpEarned > 0) {
          triggerXpReward(data.xpEarned, "Membuka modul pembelajaran baru");
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
          const totalCount = readList.length > 0 ? readList.length : data.examples.length;
          const checkedCount = Math.min(totalCount, Math.round((data.readingPercent / 100) * totalCount));
          const sentencesMap: Record<number, boolean> = {};
          for (let idx = 0; idx < totalCount; idx++) {
            sentencesMap[idx] = idx < checkedCount;
          }
          setReadSentences(sentencesMap);
          localStorage.setItem(`read_sentences_${data.kanji}`, JSON.stringify(sentencesMap));
        } else {
          setReadSentences({});
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Gagal memuat detail latihan.");
        if (err.message?.includes("Token") || err.message?.includes("Akses ditolak")) {
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
        isSaved: false
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
      feedbackMessage = "Sangat bagus! Coretan ditulis dengan urutan yang benar.";
    } else if (stars === 3) {
      feedbackMessage = "Kerja bagus! Tulisan Anda sudah cukup baik.";
    } else if (stars === 2) {
      feedbackMessage = "Coba lagi! Perhatikan urutan goresan yang salah.";
    } else {
      feedbackMessage = "Periksa kembali jumlah goresan dan arah penulisan Anda.";
    }

    const infoText = `Akurasi: ${validation.accuracy}%. Goresan benar: ${validation.correctCount}/${validation.totalStrokes}.${
      validation.incorrectStrokes.length > 0
        ? ` Goresan salah pada urutan ke: ${validation.incorrectStrokes.join(", ")}.`
        : ""
    }`;

    if (validation.accuracy >= 45) {
      try {
        const response = await api.latihan.verify(kanjiData.kanji, validation.accuracy);
        setVerificationInfo({
          stars,
          accuracy: validation.accuracy,
          correctCount: validation.correctCount,
          totalStrokes: validation.totalStrokes,
          incorrectStrokes: validation.incorrectStrokes,
          feedbackMessage,
          infoText,
          backendMessage: response.message,
          isSaved: true
        });
        
        if (response.xpEarned > 0) {
          triggerXpReward(response.xpEarned, `Berlatih menulis Kanji ${kanjiData.kanji}`);
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
          isSaved: false
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
        backendMessage: "Urutan goresan belum sesuai target (min. 45%). Progres belum disimpan.",
        isSaved: false
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
      [idx]: isCompleted
    };
    setReadSentences(newReadSentences);
    
    // Save to localStorage
    localStorage.setItem(`read_sentences_${kanjiData.kanji}`, JSON.stringify(newReadSentences));
    
    // Auto-save progress to backend
    try {
      const readList = kanjiData.examples.filter((ex: any) => ex.isReading);
      const totalCount = readList.length > 0 ? readList.length : kanjiData.examples.length;
      const checkedCount = Object.values(newReadSentences).filter(Boolean).length;
      const readingScore = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

      const response = await api.latihan.verifyReading(kanjiData.kanji, readingScore);
      
      // Refresh local progress data
      const updatedData = await api.latihan.get(kanjiData.kanji);
      setKanjiData(updatedData);
      
      if (response.xpEarned > 0) {
        triggerXpReward(response.xpEarned, `Berhasil menyelesaikan kalimat latihan membaca`);
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

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser Anda tidak mendukung Web Speech API (Perekaman Suara). Harap gunakan Google Chrome atau browser modern lainnya.");
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

      setSpeechResults(prev => ({
        ...prev,
        [idx]: { transcript, score, diffParts }
      }));

      // If score is >= 70%, mark as completed
      if (score >= 70) {
        handleToggleReading(idx, true);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event);
      if (event.error !== "aborted") {
        alert(`Error Perekaman: ${event.error}. Harap pastikan mikrofon Anda aktif dan berikan izin akses.`);
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

  // Submit Reading progress
  const handleSubmitReading = async () => {
    if (!kanjiData || !kanjiData.examples) return;
    setSavingReading(true);
    try {
      const readList = kanjiData.examples.filter((ex: any) => ex.isReading);
      const totalCount = readList.length > 0 ? readList.length : kanjiData.examples.length;
      const checkedCount = Object.values(readSentences).filter(Boolean).length;
      const readingScore = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

      const res = await api.latihan.verifyReading(kanjiData.kanji, readingScore);
      
      // Refresh local progress data
      const updatedData = await api.latihan.get(kanjiData.kanji);
      setKanjiData(updatedData);
      
      if (res.xpEarned > 0) {
        triggerXpReward(res.xpEarned, `Menyelesaikan latihan membaca kalimat`);
      } else {
        confetti();
        alert(res.message || "Progress membaca berhasil disimpan!");
      }
    } catch (err: any) {
      alert(`Gagal menyimpan progress membaca: ${err.message}`);
    } finally {
      setSavingReading(false);
    }
  };

  // Stepper Quiz handlers
  const handleAnswerSelect = (option: any) => {
    setSelectedAnswer(option);
  };

  const handleMatchingSelect = (leftItem: string, matchedVal: string) => {
    setMatchingAnswers(prev => ({
      ...prev,
      [leftItem]: matchedVal
    }));
  };

  const handleUnscrambleWordClick = (word: string) => {
    setUnscrambleSelected(prev => {
      if (prev.includes(word)) {
        return prev.filter(w => w !== word);
      }
      return [...prev, word];
    });
  };

  const handleNextQuizQuestion = (questions: QuizQuestion[]) => {
    const currentQ = questions[currentQuestionIdx];
    let isCorrect = false;
    let studentAnswerString = "";
    let correctAnswerString = "";

    if (currentQ.type === "multiple" || currentQ.type === "fill") {
      studentAnswerString = selectedAnswer || "(Tidak ada jawaban)";
      correctAnswerString = currentQ.correctAnswer || "";
      isCorrect = selectedAnswer === currentQ.correctAnswer;
    } else if (currentQ.type === "unscramble") {
      studentAnswerString = unscrambleSelected.join("");
      correctAnswerString = (currentQ.correctOrder || []).join("");
      isCorrect = studentAnswerString === correctAnswerString;
    } else if (currentQ.type === "matching") {
      const pairs = currentQ.pairs || [];
      let allCorrect = true;
      const matchedDetails: string[] = [];
      
      pairs.forEach(p => {
        const studentMatch = matchingAnswers[p.left] || "";
        matchedDetails.push(`${p.left} → ${studentMatch || "?"}`);
        if (studentMatch !== p.right) {
          allCorrect = false;
        }
      });
      isCorrect = allCorrect;
      studentAnswerString = matchedDetails.join(", ");
      correctAnswerString = pairs.map(p => `${p.left} → ${p.right}`).join(", ");
    } else if (currentQ.type === "essay") {
      studentAnswerString = essayAnswer.trim();
      correctAnswerString = `(Kosakata wajib: ${currentQ.targetWord || ""})`;
      const targetWord = currentQ.targetWord || "";
      isCorrect = targetWord ? essayAnswer.includes(targetWord) : essayAnswer.trim().length > 0;
    } else if (currentQ.type === "grouping") {
      const groups = currentQ.groups || [];
      let allCorrect = true;
      const details: string[] = [];
      const words = currentQ.words || [];
      words.forEach(w => {
        const studentGroup = groupingAnswers[w] || "";
        const correctGroup = groups.find(g => (g.correctWords || []).includes(w));
        const correctGroupName = correctGroup ? correctGroup.name : "";
        details.push(`${w} → ${studentGroup || "?"}`);
        if (studentGroup !== correctGroupName) {
          allCorrect = false;
        }
      });
      isCorrect = allCorrect;
      studentAnswerString = details.join(", ");
      correctAnswerString = groups.map(g => `${g.name}: [${(g.correctWords || []).join(", ")}]`).join(" | ");
    }

    setQuizFeedback(prev => [
      ...prev,
      {
        question: currentQ.question,
        type: currentQ.type,
        studentAnswer: studentAnswerString,
        correctAnswer: correctAnswerString,
        isCorrect
      }
    ]);

    // Reset temporary question selections
    setSelectedAnswer(null);
    setUnscrambleSelected([]);
    setEssayAnswer("");
    setGroupingAnswers({});
    
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      // Evaluate final score
      const finalFeedback = [
        ...quizFeedback,
        {
          question: currentQ.question,
          type: currentQ.type,
          studentAnswer: studentAnswerString,
          correctAnswer: correctAnswerString,
          isCorrect
        }
      ];
      const correctCount = finalFeedback.filter(f => f.isCorrect).length;
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
          <div className="text-[#8f0020] font-bold animate-pulse text-lg">Memuat detail latihan...</div>
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
    graph
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
        `}</style>
        
        {/* Background Texture */}
        <div className="absolute inset-0 seigaiha-bg pointer-events-none opacity-20 -z-10"></div>

        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Dasbor", path: "/dashboard" },
            { label: "Kanji & Kosakata", path: "/module" },
            { label: `Latihan & Evaluasi: ${kanji} (${kanjiData.moduleTitle || "Kanji"})` }
          ]}
        />

        {/* Primary Header Card with Detailed Percent Stats */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          
          <div className="flex items-center gap-6 self-start md:self-center">
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
                Romaji: <span className="font-semibold text-slate-600 font-mono">{kanjiRomaji}</span> | Tingkat kesulitan: <span className="font-bold text-[#8f0020]">{kanjiData.difficulty || "N4"}</span>
              </p>
            </div>
          </div>

          {/* Progress Breakdown Grid */}
          <div className="flex flex-wrap items-center gap-4 shrink-0 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 justify-around">
            
            <div className="flex flex-col items-center select-none bg-slate-50/50 p-3 rounded-2xl border border-slate-100 min-w-[70px]">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total</span>
              <div className="w-11 h-11 rounded-full bg-[#8f0020] flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                {masteryPercent}%
              </div>
            </div>

            <div className="flex flex-col items-center min-w-[60px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tulis</span>
              <span className="text-sm font-bold text-slate-700">{writingPercent}%</span>
            </div>

            <div className="flex flex-col items-center min-w-[60px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Baca</span>
              <span className="text-sm font-bold text-slate-700">{readingPercent}%</span>
            </div>

            <div className="flex flex-col items-center min-w-[60px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Kuis</span>
              <span className="text-sm font-bold text-slate-700">{quizPercent}%</span>
            </div>
            
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex border-b border-slate-200/80 mb-2 bg-white/60 backdrop-blur-md p-1.5 rounded-2xl shadow-xs gap-2">
          <button
            onClick={() => setActiveTab("detail")}
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
            onClick={() => setActiveTab("reading")}
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
            onClick={() => setActiveTab("quiz")}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-extrabold text-sm transition-all border-none cursor-pointer select-none ${
              activeTab === "quiz"
                ? "bg-[#8f0020] text-white shadow-md"
                : "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Kuis Evaluasi
          </button>
        </div>

        {/* ================= TAB CONTENT: DETAIL & MENULIS ================= */}
        {activeTab === "detail" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Details + Jukugo + Examples + Etymology */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Onyomi/Kunyomi Card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex justify-around select-none">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1">Onyomi</span>
                  <span className="text-xl font-extrabold text-[#8f0020] font-mono bg-[#8f0020]/5 px-4 py-1.5 rounded-xl border border-[#8f0020]/10">
                    {kanjiData.onyomi || etymologies?.[0]?.romaji || "-"}
                  </span>
                </div>
                <div className="w-[1px] bg-slate-100 self-stretch"></div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1">Kunyomi</span>
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
                      className="border border-slate-100 hover:border-slate-200 bg-slate-50/20 rounded-2xl p-4 shadow-xs transition-all duration-300 flex items-center justify-between group"
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
                  {examples.filter((ex: any) => !ex.isReading).map((item: any, idx: number) => (
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
              <KanjiEtymology etymologies={etymologies}/>
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
                        className={`w-12 h-12 border rounded-full shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-95 ${showGuide ? 'bg-[#8f0020] border-[#8f0020] text-white hover:brightness-110' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        title={showGuide ? "Sembunyikan panduan" : "Tampilkan panduan"}
                      >
                        <Icon name={showGuide ? "visibility" : "visibility_off"} className="block text-2xl" />
                      </button>
                    </div>
                  </div>

                  {verifying && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center font-bold text-slate-600 flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-[#8f0020]" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
                              verification.accuracy >= 80 ? "bg-emerald-500" :
                              verification.accuracy >= 60 ? "bg-blue-500" :
                              verification.accuracy >= 45 ? "bg-amber-500" : "bg-rose-500"
                            }`}
                            style={{ width: `${verification.accuracy}%` }}
                          />
                        </div>
                      </div>

                      {/* Stroke status matrix grid */}
                      <div className="flex flex-col gap-1.5 mt-1">
                        <span className="text-[11px] font-bold text-slate-400">DETAIL GORESAN:</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {Array.from({ length: verification.totalStrokes }, (_, idx) => {
                            const strokeNum = idx + 1;
                            const isIncorrect = verification.incorrectStrokes.includes(strokeNum);
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
                          })}
                        </div>
                      </div>

                      {verification.backendMessage && (
                        <div className={`p-3 rounded-xl flex items-start gap-2 border text-xs font-bold mt-2 ${
                          verification.isSaved 
                            ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
                            : "bg-rose-50 border-rose-100 text-rose-800"
                        }`}>
                          <Icon 
                            name={verification.isSaved ? "check_circle" : "info"} 
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
                          Peta visual interaktif yang menggambarkan relasi etimologis dan pembentukan kata gabungan (Jukugo) dari Kanji yang sedang dipelajari.
                        </p>
                        <div>
                          <h4 className="font-bold text-slate-800 mb-1">Arti Warna Simpul (Node):</h4>
                          <ul className="space-y-2 mt-2">
                            <li className="flex items-center gap-2">
                              <span className="w-3.5 h-3.5 border-2 border-dashed border-red-500 rounded-md shrink-0 bg-white"></span>
                              <span><strong>ROOT (Garis Putus Merah)</strong>: Kanji utama.</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-3.5 h-3.5 border-2 border-blue-500 rounded-md shrink-0 bg-white"></span>
                              <span><strong>TOP (Biru)</strong>: Karakter radikal pembentuk bagian atas.</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-3.5 h-3.5 border-2 border-emerald-500 rounded-md shrink-0 bg-white"></span>
                              <span><strong>BOTTOM (Hijau)</strong>: Kata gabungan Jukugo tingkat pertama.</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-3.5 h-3.5 border border-amber-500 rounded-md shrink-0 bg-amber-50"></span>
                              <span><strong>SUB-BOTTOM (Kuning / Oranye)</strong>: Kosakata turunan lebih lanjut.</span>
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
                Membaca nyaring contoh kalimat di bawah ini membantu menguasai konteks penggunaan Kanji serta memperkuat ingatan semantik Anda. Gunakan pemutaran suara untuk mencocokkan pelafalan.
              </p>
            </div>

            {/* Reading list sentences */}
            <div className="space-y-6">
              {examples.filter((ex: any) => ex.isReading).map((item: any, idx: number) => {
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
                            Mendengarkan... Silakan baca kalimat di atas dengan suara lantang.
                          </div>
                        )}

                        {/* Speech Results comparison card */}
                        {speechResults[idx] && (
                          <div className="mt-3 p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2 select-text font-medium text-xs text-slate-600">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                              <span className="font-extrabold text-slate-700 uppercase tracking-wider">Hasil Tes Membaca</span>
                              <span className={`px-2.5 py-1 rounded-full text-white font-extrabold text-[10px] uppercase tracking-wider ${
                                speechResults[idx].score >= 70 ? "bg-emerald-500 shadow-sm" : "bg-rose-500 shadow-sm"
                              }`}>
                                Akurasi: {speechResults[idx].score}% {speechResults[idx].score >= 70 ? "(LULUS)" : "(COBA LAGI)"}
                              </span>
                            </div>
                            
                            <div className="py-1">
                              <span className="text-[10px] font-bold text-slate-400 block mb-1">SOROTAN PELAFALAN:</span>
                              <p className="font-serif text-lg tracking-wide leading-relaxed">
                                {speechResults[idx].diffParts.map((part, pIdx) => (
                                  <span
                                    key={pIdx}
                                    className={part.type === "match" ? "text-emerald-600 font-bold" : "text-rose-500 font-black underline decoration-rose-500 decoration-2"}
                                  >
                                    {part.char}
                                  </span>
                                ))}
                              </p>
                            </div>

                            <div>
                              <span className="text-[10px] font-bold text-slate-400 block">ANDA MENGUCAPKAN:</span>
                              <p className="font-mono text-slate-700 mt-0.5">"{speechResults[idx].transcript}"</p>
                            </div>
                          </div>
                        )}

                        {/* Interactive Translation Toggles */}
                        <div className="flex flex-col gap-1 mt-2">
                          <button
                            onClick={() => {
                              setRevealedTranslation(prev => ({
                                ...prev,
                                [idx]: !prev[idx]
                              }));
                            }}
                            className="text-xs font-bold text-[#8f0020] hover:underline bg-transparent border-none cursor-pointer w-fit text-left p-0"
                          >
                            {isRevealed ? "Sembunyikan arti & romaji" : "Tampilkan arti & romaji"}
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
                          onClick={() => startSpeechRecognition(idx, item.japanese)}
                          disabled={activeRecordingIdx !== null}
                          className={`h-10 px-4 rounded-full border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                            activeRecordingIdx !== null && activeRecordingIdx !== idx
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
                <p className="text-sm text-slate-400 italic">Belum ada kalimat latihan membaca yang dimuat untuk kanji ini.</p>
              )}
            </div>

            {/* Submit progress */}
            <div className="border-t border-slate-100 pt-6 flex justify-between items-center">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                PROGRES: {Object.values(readSentences).filter(Boolean).length} / {examples.filter((ex: any) => ex.isReading).length > 0 ? examples.filter((ex: any) => ex.isReading).length : examples.length} SELESAI
              </div>
              
              <button
                onClick={handleSubmitReading}
                disabled={savingReading || (examples.filter((ex: any) => ex.isReading).length === 0 && examples.length === 0)}
                className="bg-[#8f0020] text-white px-8 py-3.5 rounded-full font-bold shadow-md hover:brightness-110 active:scale-95 transition-all border-none flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {savingReading ? "Menyimpan..." : "Simpan Progres Membaca"}
                <CheckCircle2 className="w-5 h-5" />
              </button>
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
                    <span className="font-extrabold text-slate-800 text-lg">Kuis Evaluasi Kanji</span>
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
                  {(quizQuestions[currentQuestionIdx].type === "multiple" || quizQuestions[currentQuestionIdx].type === "fill") && (
                    <div className="grid grid-cols-1 gap-3 mt-4">
                      {(quizQuestions[currentQuestionIdx].options || []).map((opt, oIdx) => {
                        const isSelected = selectedAnswer === opt;
                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleAnswerSelect(opt)}
                            className={`p-4 rounded-2xl border text-left font-bold text-sm transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? "bg-[#8f0020]/5 border-[#8f0020] text-[#8f0020]"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <span>{opt}</span>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? "border-[#8f0020] bg-[#8f0020] text-white" : "border-slate-300 bg-transparent text-transparent"
                            }`}>
                              <Check className="w-3.5 h-3.5 stroke-[3px]" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* SENTENCE UNSCRAMBLE */}
                  {quizQuestions[currentQuestionIdx].type === "unscramble" && (
                    <div className="space-y-6 mt-4">
                      {/* Selection visual board area */}
                      <div className="min-h-[70px] p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-wrap gap-2 items-center">
                        {unscrambleSelected.map((word, wIdx) => (
                          <button
                            key={wIdx}
                            onClick={() => handleUnscrambleWordClick(word)}
                            className="bg-[#8f0020] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm flex items-center gap-1 border-none cursor-pointer hover:brightness-105 active:scale-95"
                          >
                            {word}
                            <X className="w-4 h-4" />
                          </button>
                        ))}
                        {unscrambleSelected.length === 0 && (
                          <span className="text-slate-400 font-medium text-sm italic">Klik tombol kata di bawah untuk menyusun kalimat...</span>
                        )}
                      </div>

                      {/* Word buttons pool */}
                      <div className="flex flex-wrap gap-2 justify-center pt-2">
                        {(quizQuestions[currentQuestionIdx].words || []).map((word, wIdx) => {
                          const isUsed = unscrambleSelected.includes(word);
                          return (
                            <button
                              key={wIdx}
                              onClick={() => handleUnscrambleWordClick(word)}
                              disabled={isUsed}
                              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all border cursor-pointer select-none active:scale-95 ${
                                isUsed
                                  ? "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed"
                                  : "bg-white border-slate-200 text-slate-700 hover:border-[#8f0020]/30 hover:bg-slate-50"
                              }`}
                            >
                              {word}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => setUnscrambleSelected([])}
                          disabled={unscrambleSelected.length === 0}
                          className="text-xs font-bold text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1"
                        >
                          Reset Kalimat
                        </button>
                      </div>
                    </div>
                  )}

                  {/* MATCHING COMPONENT */}
                  {quizQuestions[currentQuestionIdx].type === "matching" && (
                    <div className="space-y-3 mt-4">
                      {(quizQuestions[currentQuestionIdx].pairs || []).map((pair, pIdx) => {
                        const allRightOptions = (quizQuestions[currentQuestionIdx].pairs || []).map(p => p.right);
                        return (
                          <div key={pIdx} className="flex items-center justify-between gap-4 p-3 bg-slate-50/50 border border-slate-100 rounded-2xl">
                            <span className="font-serif text-lg font-bold text-slate-700 px-2 shrink-0 select-none">
                              {pair.left}
                            </span>
                            
                            <select
                              value={matchingAnswers[pair.left] || ""}
                              onChange={(e) => handleMatchingSelect(pair.left, e.target.value)}
                              className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-600 text-sm font-bold focus:outline-none focus:border-[#8f0020]"
                            >
                              <option value="">-- Pilih Arti --</option>
                              {allRightOptions.map((opt, oIdx) => (
                                <option key={oIdx} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* ESSAY COMPONENT */}
                  {quizQuestions[currentQuestionIdx].type === "essay" && (
                    <div className="space-y-3 mt-4">
                      <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wide">
                        Gunakan kosakata: <span className="text-[#8f0020] font-mono font-black text-sm">{quizQuestions[currentQuestionIdx].targetWord}</span>
                      </p>
                      <textarea
                        value={essayAnswer}
                        onChange={(e) => setEssayAnswer(e.target.value)}
                        placeholder="Ketik kalimat buatan Anda di sini..."
                        className="w-full min-h-[100px] p-4 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#8f0020] text-sm font-medium"
                      />
                    </div>
                  )}

                  {/* GROUPING COMPONENT */}
                  {quizQuestions[currentQuestionIdx].type === "grouping" && (
                    <div className="space-y-4 mt-4 animate-scale-up">
                      <p className="text-xs font-extrabold text-slate-500 italic select-none">
                        Pilihlah kelompok/kategori yang tepat untuk masing-masing kosakata di bawah ini:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1 sidebar-scroll">
                        {(quizQuestions[currentQuestionIdx].words || []).map((word, wIdx) => {
                          const groupOptions = (quizQuestions[currentQuestionIdx].groups || []).map(g => g.name);
                          return (
                            <div key={wIdx} className="flex items-center justify-between gap-4 p-3 bg-slate-50/50 border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                              <span className="font-serif text-sm font-bold text-slate-700 select-none">
                                {word}
                              </span>
                              <select
                                value={groupingAnswers[word] || ""}
                                onChange={(e) => setGroupingAnswers(prev => ({ ...prev, [word]: e.target.value }))}
                                className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-600 text-xs font-bold focus:outline-none focus:border-[#8f0020] cursor-pointer"
                              >
                                <option value="">-- Pilih Kelompok --</option>
                                {groupOptions.map((gName, gIdx) => (
                                  <option key={gIdx} value={gName}>{gName}</option>
                                ))}
                              </select>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>

                {/* Bottom Step Controller action buttons */}
                <div className="border-t border-slate-100 pt-6 flex justify-end">
                  <button
                    onClick={() => handleNextQuizQuestion(quizQuestions)}
                    disabled={
                      (quizQuestions[currentQuestionIdx].type === "multiple" || quizQuestions[currentQuestionIdx].type === "fill") && !selectedAnswer
                      || (quizQuestions[currentQuestionIdx].type === "unscramble" && unscrambleSelected.length === 0)
                      || (quizQuestions[currentQuestionIdx].type === "matching" && Object.keys(matchingAnswers).length < (quizQuestions[currentQuestionIdx].pairs || []).length)
                      || (quizQuestions[currentQuestionIdx].type === "essay" && !essayAnswer.trim())
                      || (quizQuestions[currentQuestionIdx].type === "grouping" && Object.keys(groupingAnswers).length < (quizQuestions[currentQuestionIdx].words || []).length)
                    }
                    className="bg-[#8f0020] text-white px-8 py-3 rounded-full font-bold shadow-md hover:brightness-110 active:scale-95 transition-all border-none flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <span>Lanjut</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
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
                  <h3 className="text-2xl font-black text-slate-800">Kuis Selesai!</h3>
                  <p className="text-sm font-bold text-slate-400">
                    Nilai akhir Anda:
                  </p>
                  <div className="text-5xl font-black text-[#8f0020] tracking-tight">
                    {quizScore}%
                  </div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 rounded-full px-4 py-1.5 w-fit mx-auto">
                    {quizScore >= 75 ? "LUAR BIASA! KUIS SELESAI" : "TETAP SEMANGAT, COBA LAGI!"}
                  </p>
                </div>

                {/* Answers audit breakdown check */}
                <div className="space-y-4 text-left border border-slate-100 bg-slate-50/20 p-5 rounded-3xl">
                  <h4 className="font-extrabold text-sm text-slate-700 uppercase tracking-wide">Tinjauan Jawaban:</h4>
                  <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                    {quizFeedback.map((fb, idx) => (
                      <div key={idx} className="p-3 border border-slate-50 bg-white rounded-xl shadow-xs leading-relaxed flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold mt-0.5 ${
                          fb.isCorrect ? "bg-emerald-500" : "bg-rose-500"
                        }`}>
                          {fb.isCorrect ? "✓" : "✗"}
                        </div>
                        <div className="flex-1 text-sm font-medium">
                          <p className="font-bold text-slate-800 leading-snug">{fb.question}</p>
                          <p className="text-slate-500 text-xs mt-1">Jawaban Anda: <span className={fb.isCorrect ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>{fb.studentAnswer}</span></p>
                          {!fb.isCorrect && (
                            <p className="text-slate-500 text-xs">Jawaban Benar: <span className="text-emerald-700 font-bold">{fb.correctAnswer}</span></p>
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
                    onClick={() => setActiveTab("detail")}
                    className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-full font-bold shadow-xs hover:bg-slate-50 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                  >
                    Kembali Ke Detail
                  </button>
                </div>
              </div>
            )}

            {quizQuestions.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <p className="text-sm text-slate-400 italic">Gagal memuat atau menyusun soal kuis latihan.</p>
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
            <span className="font-extrabold text-sm text-amber-400">Selamat! Anda mendapatkan +{xpNotification.amount} XP</span>
            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">{xpNotification.description}</span>
          </div>
          <button
            onClick={() => setXpNotification(null)}
            className="text-white/50 hover:text-white transition-all bg-transparent border-none cursor-pointer p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </Layout>
  );
};

export default LatihanPage;
