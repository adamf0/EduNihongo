import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/auth";

const prisma = new PrismaClient();

// Normalisasi teks untuk membandingkan jawaban susun kalimat (Section A)
const normalizeSentence = (str: string) => {
  return (str || "")
    .replace(/[\s\u3000。、・,.!?！？]/g, "")
    .trim()
    .toLowerCase();
};

export const getReviewQuizzes = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const quizzes = await prisma.reviewQuiz.findMany({
      where: { isOpen: true },
      include: {
        _count: {
          select: { questions: true },
        },
        attempts: userId
          ? {
              where: { userId },
              orderBy: { score: "desc" },
              take: 1,
            }
          : false,
      },
      orderBy: { peletakanSetelahModul: "asc" },
    });

    const result = quizzes.map((q) => {
      const bestAttempt = q.attempts?.[0] || null;
      let parsedSectionScores = null;
      if (bestAttempt?.sectionScores) {
        try {
          parsedSectionScores = JSON.parse(bestAttempt.sectionScores);
        } catch (e) {
          parsedSectionScores = null;
        }
      }

      return {
        id: q.id,
        judul: q.judul,
        peletakanSetelahModul: q.peletakanSetelahModul,
        deskripsi: q.deskripsi,
        durasiMenit: q.durasiMenit,
        totalSoal: q._count.questions || q.totalSoal,
        targetScore: q.targetScore,
        isOpen: q.isOpen,
        bestAttempt: bestAttempt
          ? {
              id: bestAttempt.id,
              score: bestAttempt.score,
              totalCorrect: bestAttempt.totalCorrect,
              totalQuestions: bestAttempt.totalQuestions,
              isPassed: bestAttempt.isPassed,
              sectionScores: parsedSectionScores,
              createdAt: bestAttempt.createdAt,
            }
          : null,
      };
    });

    res.json(result);
  } catch (error: any) {
    console.error("Error getReviewQuizzes:", error);
    res.status(500).json({ error: "Gagal memuat daftar review quiz." });
  }
};

export const getReviewQuizDetail = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const userId = req.user?.id;

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID Review Quiz tidak valid." });
    }

    const reviewQuiz = await prisma.reviewQuiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: [
            { section: "asc" },
            { moduleNumber: "asc" },
            { questionNumber: "asc" },
          ],
        },
        attempts: userId
          ? {
              where: { userId },
              orderBy: { createdAt: "desc" },
              take: 5,
            }
          : false,
      },
    });

    if (!reviewQuiz) {
      return res.status(404).json({ error: "Review Quiz tidak ditemukan." });
    }

    // Ambil user draft progress jika user terautentikasi
    const userProgress = userId
      ? await prisma.reviewQuizProgress.findUnique({
          where: {
            userId_reviewQuizId: {
              userId,
              reviewQuizId: id,
            },
          },
        })
      : null;

    let parsedProgressAnswers: Record<string, any> = {};
    if (userProgress?.answers) {
      try {
        parsedProgressAnswers = JSON.parse(userProgress.answers);
      } catch (e) {
        parsedProgressAnswers = {};
      }
    }

    // Format questions (parse JSON fields for frontend ease)
    const formattedQuestions = reviewQuiz.questions.map((q) => {
      let parsedOptions: string[] = [];
      let parsedWords: string[] = [];
      let parsedCorrectOrder: string[] = [];

      try {
        if (q.options) parsedOptions = JSON.parse(q.options);
      } catch (e) {
        parsedOptions = [];
      }

      try {
        if (q.words) parsedWords = JSON.parse(q.words);
      } catch (e) {
        parsedWords = [];
      }

      try {
        if (q.correctOrder) parsedCorrectOrder = JSON.parse(q.correctOrder);
      } catch (e) {
        parsedCorrectOrder = [];
      }

      return {
        id: q.id,
        reviewQuizId: q.reviewQuizId,
        moduleNumber: q.moduleNumber,
        section: q.section,
        type: q.type,
        questionNumber: q.questionNumber,
        question: q.question,
        options: parsedOptions,
        words: parsedWords,
        // Expose correct data only if needed or keep for display after submit
        correctAnswer: q.correctAnswer,
        correctOrder: parsedCorrectOrder,
        explanation: q.explanation,
      };
    });

    res.json({
      id: reviewQuiz.id,
      judul: reviewQuiz.judul,
      peletakanSetelahModul: reviewQuiz.peletakanSetelahModul,
      deskripsi: reviewQuiz.deskripsi,
      durasiMenit: reviewQuiz.durasiMenit,
      totalSoal: formattedQuestions.length || reviewQuiz.totalSoal,
      targetScore: reviewQuiz.targetScore,
      isOpen: reviewQuiz.isOpen,
      questions: formattedQuestions,
      attempts: (reviewQuiz.attempts || []).map((a) => {
        let sec = null;
        try {
          if (a.sectionScores) sec = JSON.parse(a.sectionScores);
        } catch (e) {
          sec = null;
        }
        return {
          id: a.id,
          score: a.score,
          totalCorrect: a.totalCorrect,
          totalQuestions: a.totalQuestions,
          isPassed: a.isPassed,
          sectionScores: sec,
          createdAt: a.createdAt,
        };
      }),
      userProgress: userProgress
        ? {
            id: userProgress.id,
            stage: userProgress.stage,
            activeSection: userProgress.activeSection,
            currentIdxInSection: userProgress.currentIdxInSection,
            answers: parsedProgressAnswers,
            updatedAt: userProgress.updatedAt.getTime(),
          }
        : null,
    });
  } catch (error: any) {
    console.error("Error getReviewQuizDetail:", error);
    res.status(500).json({ error: "Gagal memuat detail review quiz." });
  }
};

export const submitReviewQuiz = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID Review Quiz tidak valid." });
    }

    const reviewQuiz = await prisma.reviewQuiz.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    });

    if (!reviewQuiz) {
      return res.status(404).json({ error: "Review Quiz tidak ditemukan." });
    }

    const userAnswers: Record<string | number, any> = req.body?.answers || {};

    let totalCorrect = 0;
    const sectionCounts: Record<string, { correct: number; total: number }> = {
      A: { correct: 0, total: 0 },
      B: { correct: 0, total: 0 },
      C: { correct: 0, total: 0 },
      D: { correct: 0, total: 0 },
    };

    const feedbacks: Record<number, { isCorrect: boolean; correctAnswer: any }> = {};

    for (const q of reviewQuiz.questions) {
      const sec = q.section || "A";
      if (!sectionCounts[sec]) {
        sectionCounts[sec] = { correct: 0, total: 0 };
      }
      sectionCounts[sec].total++;

      const userAns = userAnswers[q.id];
      let isCorrect = false;

      if (q.type === "unscramble") {
        // Jawaban susun kalimat
        let userSentence = "";
        if (Array.isArray(userAns)) {
          userSentence = userAns.join("");
        } else if (typeof userAns === "string") {
          userSentence = userAns;
        }

        const normUser = normalizeSentence(userSentence);
        const normKeyAnswer = normalizeSentence(q.correctAnswer || "");

        // Periksa juga apakah cocok dengan correctOrder array
        let normKeyOrder = "";
        try {
          if (q.correctOrder) {
            const arr = JSON.parse(q.correctOrder);
            if (Array.isArray(arr)) {
              normKeyOrder = normalizeSentence(arr.join(""));
            }
          }
        } catch (e) {
          // ignore
        }

        if (normUser && (normUser === normKeyAnswer || normUser === normKeyOrder)) {
          isCorrect = true;
        }
      } else {
        // multiple & fill
        let parsedOpts: string[] = [];
        try {
          if (q.options) parsedOpts = JSON.parse(q.options);
        } catch (e) {
          parsedOpts = [];
        }

        const rawUser = String(userAns !== undefined && userAns !== null ? userAns : "").trim();
        const rawKey = String(q.correctAnswer || "").trim();

        // 1. Cocok langsung
        if (rawUser && rawUser.toLowerCase() === rawKey.toLowerCase()) {
          isCorrect = true;
        }
        // 2. Jika user menjawab dengan index ("0", "1", "2") dan key adalah index
        else if (rawUser === rawKey) {
          isCorrect = true;
        }
        // 3. Jika user menjawab nama opsi (misal "Ujian") dan key adalah index ("2")
        else if (parsedOpts.length > 0) {
          const keyIdx = parseInt(rawKey, 10);
          if (!isNaN(keyIdx) && parsedOpts[keyIdx]) {
            if (rawUser.toLowerCase() === parsedOpts[keyIdx].toLowerCase()) {
              isCorrect = true;
            }
          }
          // Atau jika key adalah huruf "A", "B", "C"
          const letterMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
          if (letterMap[rawKey.toUpperCase()] !== undefined) {
            const idx = letterMap[rawKey.toUpperCase()];
            if (rawUser === String(idx) || rawUser.toLowerCase() === parsedOpts[idx]?.toLowerCase()) {
              isCorrect = true;
            }
          }
        }
      }

      if (isCorrect) {
        totalCorrect++;
        sectionCounts[sec].correct++;
      }

      feedbacks[q.id] = {
        isCorrect,
        correctAnswer: q.correctAnswer,
      };
    }

    const totalQuestions = reviewQuiz.questions.length || reviewQuiz.totalSoal || 120;
    // Formula nilai: (total poin benar / total soal) * 100, dibulatkan 2 desimal
    const rawScore = (totalCorrect / totalQuestions) * 100;
    const finalScore = Math.round(rawScore * 100) / 100;
    const isPassed = finalScore >= (reviewQuiz.targetScore || 60);

    const sectionScores = {
      A: sectionCounts.A.correct,
      B: sectionCounts.B.correct,
      C: sectionCounts.C.correct,
      D: sectionCounts.D.correct,
      totals: {
        A: sectionCounts.A.total,
        B: sectionCounts.B.total,
        C: sectionCounts.C.total,
        D: sectionCounts.D.total,
      },
    };

    // Simpan riwayat attempt
    const attempt = await prisma.reviewQuizAttempt.create({
      data: {
        userId,
        reviewQuizId: reviewQuiz.id,
        score: finalScore,
        totalCorrect,
        totalQuestions,
        answers: JSON.stringify(userAnswers),
        sectionScores: JSON.stringify(sectionScores),
        isPassed,
      },
    });

    // Bersihkan draft progress karena sudah selesai disubmit
    await prisma.reviewQuizProgress.deleteMany({
      where: { userId, reviewQuizId: reviewQuiz.id },
    });

    // Beri XP jika lulus atau mendapat nilai bagus
    let xpEarned = 0;
    if (isPassed) {
      xpEarned = Math.round(finalScore * 1.5);
      await prisma.user.update({
        where: { id: userId },
        data: { totalXp: { increment: xpEarned } },
      });

      await prisma.userActivity.create({
        data: {
          userId,
          xpEarned,
          activityType: "REVIEW_QUIZ",
          description: `Menyelesaikan ${reviewQuiz.judul} dengan skor ${finalScore}% (${totalCorrect}/${totalQuestions} benar)`,
        },
      });
    }

    res.json({
      attemptId: attempt.id,
      score: finalScore,
      totalCorrect,
      totalQuestions,
      isPassed,
      xpEarned,
      sectionScores,
      feedbacks,
      message: isPassed
        ? `Selamat! Anda lulus review dengan skor ${finalScore}%.`
        : `Nilai Anda ${finalScore}%. Belum mencapai target kelulusan ${reviewQuiz.targetScore}%. Silakan pelajari kembali materi dan coba lagi.`,
    });
  } catch (error: any) {
    console.error("Error submitReviewQuiz:", error);
    res.status(500).json({ error: "Gagal menyimpan hasil review quiz." });
  }
};

export const saveReviewQuizProgress = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID Review Quiz tidak valid." });
    }

    const { stage, activeSection, currentIdxInSection, answers } = req.body;
    const answersStr = typeof answers === "string" ? answers : JSON.stringify(answers || {});

    const progress = await prisma.reviewQuizProgress.upsert({
      where: {
        userId_reviewQuizId: {
          userId,
          reviewQuizId: id,
        },
      },
      create: {
        userId,
        reviewQuizId: id,
        stage: stage || "quiz",
        activeSection: activeSection || "A",
        currentIdxInSection: Number(currentIdxInSection) || 0,
        answers: answersStr,
      },
      update: {
        stage: stage || "quiz",
        activeSection: activeSection || "A",
        currentIdxInSection: Number(currentIdxInSection) || 0,
        answers: answersStr,
      },
    });

    res.json({
      success: true,
      message: "Progres review quiz berhasil disimpan.",
      progress: {
        id: progress.id,
        stage: progress.stage,
        activeSection: progress.activeSection,
        currentIdxInSection: progress.currentIdxInSection,
        updatedAt: progress.updatedAt.getTime(),
      },
    });
  } catch (error: any) {
    console.error("Error saveReviewQuizProgress:", error);
    res.status(500).json({ error: "Gagal menyimpan progres review quiz." });
  }
};

export const resetReviewQuizProgress = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    await prisma.reviewQuizProgress.deleteMany({
      where: {
        userId,
        reviewQuizId: id,
      },
    });
    res.json({ success: true, message: "Progres review quiz berhasil direset." });
  } catch (error: any) {
    console.error("Error resetReviewQuizProgress:", error);
    res.status(500).json({ error: "Gagal mereset progres review quiz." });
  }
};

// ================= ADMIN CONTROLLERS =================

export const adminGetReviewQuizzes = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await prisma.reviewQuiz.findMany({
      include: {
        _count: {
          select: { questions: true, attempts: true },
        },
      },
      orderBy: { peletakanSetelahModul: "asc" },
    });

    res.json(list);
  } catch (error: any) {
    console.error("Error adminGetReviewQuizzes:", error);
    res.status(500).json({ error: "Gagal memuat daftar review quiz admin." });
  }
};

export const adminSaveReviewQuiz = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      id,
      judul,
      peletakanSetelahModul,
      deskripsi,
      durasiMenit,
      targetScore,
      isOpen,
      questions,
    } = req.body;

    if (!judul || !judul.trim()) {
      return res.status(400).json({ error: "Judul review quiz wajib diisi." });
    }

    const peletakan = parseInt(peletakanSetelahModul, 10) || 6;
    const durasi = parseInt(durasiMenit, 10) || 60;
    const target = parseInt(targetScore, 10) || 60;

    let reviewQuiz;

    if (id) {
      // Update
      reviewQuiz = await prisma.reviewQuiz.update({
        where: { id: parseInt(id, 10) },
        data: {
          judul: judul.trim(),
          peletakanSetelahModul: peletakan,
          deskripsi: deskripsi || null,
          durasiMenit: durasi,
          targetScore: target,
          isOpen: isOpen !== undefined ? Boolean(isOpen) : true,
        },
      });
    } else {
      // Create
      reviewQuiz = await prisma.reviewQuiz.create({
        data: {
          judul: judul.trim(),
          peletakanSetelahModul: peletakan,
          deskripsi: deskripsi || null,
          durasiMenit: durasi,
          targetScore: target,
          isOpen: isOpen !== undefined ? Boolean(isOpen) : true,
          totalSoal: Array.isArray(questions) ? questions.length : 120,
        },
      });
    }

    // Jika ada daftar questions baru yang dikirimkan, update
    if (Array.isArray(questions) && questions.length > 0) {
      await prisma.reviewQuizQuestion.deleteMany({
        where: { reviewQuizId: reviewQuiz.id },
      });

      const records = questions.map((q: any, idx: number) => ({
        reviewQuizId: reviewQuiz.id,
        moduleNumber: parseInt(q.moduleNumber, 10) || 1,
        section: String(q.section || "A").toUpperCase(),
        type: String(q.type || "multiple"),
        questionNumber: parseInt(q.questionNumber, 10) || idx + 1,
        question: q.question || "",
        options: q.options
          ? typeof q.options === "string"
            ? (q.options.trim().startsWith("[")
                ? q.options
                : JSON.stringify(q.options.split(/[,、]/).map((s: string) => s.trim()).filter(Boolean)))
            : JSON.stringify(q.options)
          : null,
        correctAnswer: String(q.correctAnswer || ""),
        words: q.words
          ? typeof q.words === "string"
            ? (q.words.trim().startsWith("[")
                ? q.words
                : JSON.stringify(q.words.split(/[・\s]+/).map((s: string) => s.trim()).filter(Boolean)))
            : JSON.stringify(q.words)
          : null,
        correctOrder: q.correctOrder
          ? typeof q.correctOrder === "string"
            ? (q.correctOrder.trim().startsWith("[")
                ? q.correctOrder
                : JSON.stringify(q.correctOrder.split(/\s+/).map((s: string) => s.trim()).filter(Boolean)))
            : JSON.stringify(q.correctOrder)
          : null,
        explanation: q.explanation || null,
      }));

      await prisma.reviewQuizQuestion.createMany({
        data: records,
      });

      await prisma.reviewQuiz.update({
        where: { id: reviewQuiz.id },
        data: { totalSoal: records.length },
      });
    }

    res.json({
      message: "Review quiz berhasil disimpan.",
      reviewQuiz,
    });
  } catch (error: any) {
    console.error("Error adminSaveReviewQuiz:", error);
    res.status(500).json({ error: "Gagal menyimpan review quiz." });
  }
};

export const adminDeleteReviewQuiz = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID Review Quiz tidak valid." });
    }

    await prisma.reviewQuiz.delete({
      where: { id },
    });

    res.json({ message: "Review quiz berhasil dihapus." });
  } catch (error: any) {
    console.error("Error adminDeleteReviewQuiz:", error);
    res.status(500).json({ error: "Gagal menghapus review quiz." });
  }
};

export const adminGetReviewQuizScoreReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const quizIdParam = req.query.quizId ? Number(req.query.quizId) : undefined;

    // 1. Ambil review quiz yang ditarget (default quiz id: 1 atau yang pertama)
    const reviewQuiz = await prisma.reviewQuiz.findFirst({
      where: quizIdParam ? { id: quizIdParam } : undefined,
      include: {
        questions: {
          orderBy: [
            { moduleNumber: "asc" },
            { section: "asc" },
            { questionNumber: "asc" },
          ],
        },
      },
    });

    if (!reviewQuiz) {
      return res.status(404).json({ error: "Review Quiz tidak ditemukan." });
    }

    // 2. Ambil seluruh modul untuk label judul modul
    const dbModules = await prisma.module.findMany({
      orderBy: { id: "asc" },
    });
    const moduleMap: Record<number, string> = {
      1: "Modul 1: Ujian, Pertanyaan, dan Jawaban",
      2: "Modul 2: Penelitian dan Pengumpulan Data",
      3: "Modul 3: Informasi dan Data",
      4: "Modul 4: Dunia Kerja dan Perdagangan",
      5: "Modul 5: Komunikasi dan Pertukaran Ide",
      6: "Modul 6: Waktu dan Pengalaman",
    };
    dbModules.slice(0, 6).forEach((m, idx) => {
      moduleMap[idx + 1] = m.title;
    });

    // 3. Ambil seluruh user mahasiswa (role = USER) beserta attempts dan progress
    const students = await prisma.user.findMany({
      where: { role: "USER" },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        joinedAt: true,
        reviewQuizAttempts: {
          where: { reviewQuizId: reviewQuiz.id },
          orderBy: { score: "desc" },
        },
        reviewQuizProgresses: {
          where: { reviewQuizId: reviewQuiz.id },
          take: 1,
        },
      },
      orderBy: { name: "asc" },
    });

    // Helper evaluate
    const evaluate = (q: any, userAns: any): boolean => {
      if (userAns === undefined || userAns === null) return false;
      if (q.type === "unscramble") {
        let userSentence = "";
        if (Array.isArray(userAns)) userSentence = userAns.join("");
        else if (typeof userAns === "string") userSentence = userAns;
        const normUser = normalizeSentence(userSentence);
        const normKeyAnswer = normalizeSentence(q.correctAnswer || "");
        let normKeyOrder = "";
        try {
          if (q.correctOrder) {
            const arr = JSON.parse(q.correctOrder);
            if (Array.isArray(arr)) normKeyOrder = normalizeSentence(arr.join(""));
          }
        } catch (e) {}
        return Boolean(normUser && (normUser === normKeyAnswer || normUser === normKeyOrder));
      } else {
        let parsedOpts: string[] = [];
        try {
          if (q.options) parsedOpts = JSON.parse(q.options);
        } catch (e) {}
        const rawUser = String(userAns).trim();
        const rawKey = String(q.correctAnswer || "").trim();
        if (rawUser && rawUser.toLowerCase() === rawKey.toLowerCase()) return true;
        if (rawUser === rawKey) return true;
        if (parsedOpts.length > 0) {
          const keyIdx = parseInt(rawKey, 10);
          if (!isNaN(keyIdx) && parsedOpts[keyIdx]) {
            if (rawUser.toLowerCase() === parsedOpts[keyIdx].toLowerCase()) return true;
          }
          const letterMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
          if (letterMap[rawKey.toUpperCase()] !== undefined) {
            const idx = letterMap[rawKey.toUpperCase()];
            if (rawUser === String(idx) || rawUser.toLowerCase() === parsedOpts[idx]?.toLowerCase()) {
              return true;
            }
          }
        }
        return false;
      }
    };

    let totalScoreSum = 0;
    let completedCount = 0;
    let passedCount = 0;

    const moduleList = [1, 2, 3, 4, 5, 6].map((mNum) => ({
      moduleNumber: mNum,
      title: moduleMap[mNum] || `Modul ${mNum}`,
    }));

    const studentReports = students.map((std) => {
      const bestAttempt = std.reviewQuizAttempts?.[0] || null;
      const attemptCount = std.reviewQuizAttempts?.length || 0;
      const inProgress = std.reviewQuizProgresses?.[0] || null;

      let answersObj: Record<string | number, any> = {};
      let isOfficialAttempt = false;

      if (bestAttempt?.answers) {
        try {
          answersObj = JSON.parse(bestAttempt.answers);
          isOfficialAttempt = true;
        } catch (e) {
          answersObj = {};
        }
      } else if (inProgress?.answers) {
        try {
          answersObj = JSON.parse(inProgress.answers);
        } catch (e) {
          answersObj = {};
        }
      }

      const hasAttempted = isOfficialAttempt;
      const isDraft = !isOfficialAttempt && Object.keys(answersObj).length > 0;

      const moduleScores: Record<number, any> = {};
      let studentTotalCorrect = 0;

      [1, 2, 3, 4, 5, 6].forEach((mNum) => {
        const modQuestions = reviewQuiz.questions.filter((q) => q.moduleNumber === mNum);
        const correctA = modQuestions.filter((q) => q.section === "A" && evaluate(q, answersObj[q.id])).length;
        const correctB = modQuestions.filter((q) => q.section === "B" && evaluate(q, answersObj[q.id])).length;
        const correctC = modQuestions.filter((q) => q.section === "C" && evaluate(q, answersObj[q.id])).length;
        const correctD = modQuestions.filter((q) => q.section === "D" && evaluate(q, answersObj[q.id])).length;

        const totalModCorrect = correctA + correctB + correctC + correctD;
        studentTotalCorrect += totalModCorrect;

        const totalQuestionsInMod = modQuestions.length || 20;
        const percent = Math.round((totalModCorrect / totalQuestionsInMod) * 100);

        // Bobot kontribusi rubrik (Bagian A-D masing-masing bobot 25%, per modul 5 soal = max 4.17%)
        const rubricA = parseFloat(((correctA / 30) * 25).toFixed(1));
        const rubricB = parseFloat(((correctB / 30) * 25).toFixed(1));
        const rubricC = parseFloat(((correctC / 30) * 25).toFixed(1));
        const rubricD = parseFloat(((correctD / 30) * 25).toFixed(1));
        const totalRubricMod = parseFloat((rubricA + rubricB + rubricC + rubricD).toFixed(1));

        let status = "Perlu Latihan (<60%)";
        if (percent >= 80) status = "Mahir (≥80%)";
        else if (percent >= 60) status = "Cukup (≥60%)";

        moduleScores[mNum] = {
          moduleNumber: mNum,
          moduleTitle: moduleMap[mNum] || `Modul ${mNum}`,
          correctA,
          totalA: 5,
          rubricA,
          correctB,
          totalB: 5,
          rubricB,
          correctC,
          totalC: 5,
          rubricC,
          correctD,
          totalD: 5,
          rubricD,
          totalCorrect: totalModCorrect,
          totalQuestions: totalQuestionsInMod,
          percent,
          totalRubric: totalRubricMod,
          status: hasAttempted || isDraft ? status : "Belum Mengerjakan",
        };
      });

      const totalQuestions = reviewQuiz.questions.length || 120;
      let finalScore = 0;
      let isPassed = false;

      if (hasAttempted && bestAttempt) {
        finalScore = bestAttempt.score;
        isPassed = bestAttempt.isPassed;
        completedCount++;
        totalScoreSum += finalScore;
        if (isPassed) passedCount++;
      } else if (isDraft) {
        finalScore = Math.round((studentTotalCorrect / totalQuestions) * 100);
        isPassed = finalScore >= (reviewQuiz.targetScore || 60);
      }

      return {
        userId: std.id,
        name: std.name,
        email: std.email,
        avatar: std.avatar,
        joinedAt: std.joinedAt,
        hasAttempted,
        isDraft,
        attemptCount,
        finalScore: hasAttempted || isDraft ? finalScore : null,
        totalCorrect: hasAttempted || isDraft ? studentTotalCorrect : null,
        totalQuestions,
        isPassed: hasAttempted ? isPassed : false,
        submittedAt: bestAttempt ? bestAttempt.createdAt : null,
        modules: moduleScores,
      };
    });

    const avgScore = completedCount > 0 ? Math.round((totalScoreSum / completedCount) * 10) / 10 : 0;

    res.json({
      reviewQuiz: {
        id: reviewQuiz.id,
        judul: reviewQuiz.judul,
        peletakanSetelahModul: reviewQuiz.peletakanSetelahModul,
        totalSoal: reviewQuiz.questions.length || reviewQuiz.totalSoal,
        targetScore: reviewQuiz.targetScore,
      },
      modules: moduleList,
      students: studentReports,
      summary: {
        totalStudents: students.length,
        completedCount,
        passedCount,
        avgScore,
      },
    });
  } catch (error: any) {
    console.error("Error adminGetReviewQuizScoreReport:", error);
    res.status(500).json({ error: "Gagal memuat laporan nilai review quiz." });
  }
};
