import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/auth";
import { computeUserModuleAccess } from "../utils/accessConfig";

const prisma = new PrismaClient();

export const getModulesData = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const {
      isExempt,
      applyMasteryLock,
      applyScheduleLock,
      modules: computedModules,
    } = await computeUserModuleAccess(prisma, userId);

    const modules = computedModules.map((m) => ({
      id: m.id,
      title: m.title,
      tujuanPembelajaran: m.tujuanPembelajaran,
      openDate: m.openDate,
      isCompleted: m.isCompleted,
      isLocked: m.isLocked,
      isDateLocked: m.isDateLocked,
      isSequentialLocked: m.isSequentialLocked,
      isEvaluationLocked: m.isEvaluationLocked,
      evaluationLockTitle: m.evaluationLockTitle,
      progressPercent: m.progressPercent,
      kanjis: m.kanjis.map(({ romaji: _romaji, ...rest }) => rest),
    }));

    // Synchronize isLocked, progressPercent, and isCompleted to DB asynchronously
    Promise.all(
      modules.map((m) =>
        prisma.userModuleProgress
          .update({
            where: {
              userId_moduleId: {
                userId,
                moduleId: m.id,
              },
            },
            data: {
              isLocked: m.isLocked,
              progressPercent: m.progressPercent,
              isCompleted: m.isCompleted,
            },
          })
          .catch((err) => console.error("Error updating userModuleProgress:", err))
      )
    );

    // Calculate overall course progress (average of modules with kanjis)
    const activeModules = modules.filter((m) => m.kanjis && m.kanjis.length > 0);
    const overallProgress =
      activeModules.length > 0
        ? Math.round(
            activeModules.reduce((sum, m) => sum + m.progressPercent, 0) / activeModules.length
          )
        : 0;

    // Fetch Review Quizzes and evaluate lock status relative to target module
    const rawReviewQuizzes = await prisma.reviewQuiz.findMany({
      where: { isOpen: true },
      include: {
        attempts: {
          where: { userId },
          orderBy: { score: "desc" },
          take: 1,
        },
        _count: { select: { questions: true } },
      },
      orderBy: { peletakanSetelahModul: "asc" },
    });

    let cumulativeQuizLock = false;
    let precedingQuizLockTitle: string | null = null;

    const reviewQuizzes = rawReviewQuizzes.map((rq) => {
      // Find the module before this review quiz
      const matchedMod =
        modules.find((m) => m.id === rq.peletakanSetelahModul) ||
        modules[rq.peletakanSetelahModul - 1] ||
        null;

      let isLocked = false;
      let lockReason = "";
      if (!isExempt) {
        if (cumulativeQuizLock) {
          isLocked = true;
          lockReason = `Selesaikan evaluasi ${precedingQuizLockTitle} terlebih dahulu untuk membuka evaluasi ini.`;
        } else if (matchedMod) {
          if (matchedMod.isLocked) {
            isLocked = true;
            lockReason = matchedMod.isEvaluationLocked
              ? `Selesaikan evaluasi ${matchedMod.evaluationLockTitle} terlebih dahulu untuk membuka evaluasi ini.`
              : `Selesaikan ${matchedMod.title} terlebih dahulu untuk membuka evaluasi ini.`;
          } else if (applyMasteryLock && !matchedMod.isCompleted) {
            isLocked = true;
            lockReason = `Kuasai seluruh kanji pada ${matchedMod.title} minimal 60% untuk membuka evaluasi ini.`;
          }
        }
      }

      const bestAttempt = rq.attempts?.[0] || null;
      const hasFilledThisQuiz = Boolean(bestAttempt);

      // Jika kuis evaluasi ini belum terisi, kuis evaluasi selanjutnya akan terkunci
      if (!hasFilledThisQuiz && !cumulativeQuizLock) {
        cumulativeQuizLock = true;
        precedingQuizLockTitle = rq.judul;
      }

      let parsedSectionScores = null;
      if (bestAttempt?.sectionScores) {
        try {
          parsedSectionScores = JSON.parse(bestAttempt.sectionScores);
        } catch (e) {
          parsedSectionScores = null;
        }
      }

      return {
        id: rq.id,
        judul: rq.judul,
        peletakanSetelahModul: rq.peletakanSetelahModul,
        deskripsi: rq.deskripsi,
        durasiMenit: rq.durasiMenit,
        totalSoal: rq._count.questions || rq.totalSoal,
        targetScore: rq.targetScore,
        isLocked,
        lockReason,
        isOpen: rq.isOpen,
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

    res.json({
      overallProgress,
      modules,
      reviewQuizzes,
      isMasteryLockEnabled: applyMasteryLock,
      isScheduleLockEnabled: applyScheduleLock,
      isLockSystemEnabled: applyMasteryLock || applyScheduleLock,
      isExempt,
    });
  } catch (error) {
    console.error("Modules error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat memuat data modul." });
  }
};
