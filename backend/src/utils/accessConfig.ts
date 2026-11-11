import { PrismaClient } from "@prisma/client";
import { sortModuleKanjis } from "./kanjiOrder";

export const MASTERY_PASS_THRESHOLD = 60;

export interface AccessConfigState {
  id: number;
  enableMasteryLock: boolean;
  enableScheduleLock: boolean;
  enableEvaluationLock: boolean;
  updatedAt: Date;
}

export async function getAccessConfig(prisma: PrismaClient): Promise<AccessConfigState> {
  const row = await prisma.systemConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      enableMasteryLock: true,
      enableScheduleLock: true,
      enableEvaluationLock: true,
    },
  });

  return {
    id: row.id,
    enableMasteryLock: row.enableMasteryLock,
    enableScheduleLock: row.enableScheduleLock,
    enableEvaluationLock:
      (row as any).enableEvaluationLock !== undefined
        ? Boolean((row as any).enableEvaluationLock)
        : true,
    updatedAt: row.updatedAt,
  };
}

export interface ModuleKanjiAccessItem {
  id: number;
  character: string;
  meaning: string;
  romaji: string;
  masteryPercent: number;
  isCompleted: boolean;
  isLocked: boolean;
}

export interface ComputedModuleAccessItem {
  id: number;
  title: string;
  tujuanPembelajaran: string | null;
  openDate: string | null;
  isCompleted: boolean;
  isLocked: boolean;
  isDateLocked: boolean;
  isSequentialLocked: boolean;
  isEvaluationLocked?: boolean;
  evaluationLockTitle?: string | null;
  progressPercent: number;
  kanjis: ModuleKanjiAccessItem[];
}

export async function computeUserModuleAccess(prisma: PrismaClient, userId: number) {
  const [currentUser, config, userProgress, reviewQuizzes] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true },
    }),
    getAccessConfig(prisma),
    prisma.userModuleProgress.findMany({
      where: { userId },
      include: {
        module: {
          include: {
            kanjis: {
              include: {
                userProgress: {
                  where: { userId },
                },
              },
              orderBy: { id: "asc" },
            },
          },
        },
      },
      orderBy: { moduleId: "asc" },
    }),
    prisma.reviewQuiz.findMany({
      where: { isOpen: true },
      include: {
        attempts: {
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { peletakanSetelahModul: "asc" },
    }),
  ]);

  const isExempt = currentUser?.role === "ADMIN";
  const applyMasteryLock = !isExempt && config.enableMasteryLock;
  const applyScheduleLock = !isExempt && config.enableScheduleLock;
  const applyEvaluationLock = !isExempt && config.enableEvaluationLock;

  let previousModulePassed: boolean = true;
  let cumulativeEvaluationLocked: boolean = false;
  let cumulativeEvaluationTitle: string | null = null;
  const now = new Date();
  const modules: ComputedModuleAccessItem[] = [];

  for (let index = 0; index < userProgress.length; index++) {
    const up = userProgress[index];

    // Cek apakah ada review quiz baru yang ditempatkan sebelum modul ini
    if (index > 0 && applyEvaluationLock) {
      const prevMod = userProgress[index - 1].module;
      const precedingReviewQuizzes = reviewQuizzes.filter(
        (rq) => rq.peletakanSetelahModul === prevMod.id || rq.peletakanSetelahModul === index
      );

      for (const rq of precedingReviewQuizzes) {
        const hasFilled = Boolean(rq.attempts && rq.attempts.length > 0);
        if (!hasFilled && !cumulativeEvaluationLocked) {
          cumulativeEvaluationLocked = true;
          cumulativeEvaluationTitle = rq.judul;
        }
      }
    }

    const isEvaluationLocked: boolean = applyEvaluationLock ? cumulativeEvaluationLocked : false;
    const evaluationLockTitle: string | null = applyEvaluationLock ? cumulativeEvaluationTitle : null;

    const isDateLocked: boolean = applyScheduleLock
      ? Boolean(up.module.openDate && new Date(up.module.openDate) > now)
      : false;

    const isSequentialLocked: boolean = applyMasteryLock
      ? index === 0
        ? false
        : !previousModulePassed || isEvaluationLocked
      : isEvaluationLocked;

    const isModuleLocked: boolean = isDateLocked || isSequentialLocked || isEvaluationLocked;

    let previousKanjiHasProgress = true;
    const sortedKanjis = sortModuleKanjis(up.module.kanjis || [], up.module.id);
    const moduleKanjis: ModuleKanjiAccessItem[] = sortedKanjis.map((k: any, kIdx: number) => {
      const progress = k.userProgress?.[0];
      const masteryPercent: number = progress?.masteryPercent || 0;
      const isCompleted: boolean = masteryPercent >= MASTERY_PASS_THRESHOLD;

      const isKanjiLocked = isExempt
        ? false
        : isModuleLocked || (applyMasteryLock ? (kIdx === 0 ? false : !previousKanjiHasProgress) : false);

      previousKanjiHasProgress = masteryPercent > 0;

      return {
        id: k.id,
        character: k.character,
        meaning: k.meaning,
        romaji: k.romaji,
        masteryPercent,
        isCompleted,
        isLocked: isKanjiLocked,
      };
    });

    const progressPercent =
      moduleKanjis.length > 0
        ? Math.round(
            moduleKanjis.reduce((sum, k) => sum + k.masteryPercent, 0) / moduleKanjis.length
          )
        : up.progressPercent;

    const allKanjisCompleted =
      moduleKanjis.length > 0 && moduleKanjis.every((k) => k.isCompleted);
    const isModuleCompleted =
      moduleKanjis.length > 0
        ? allKanjisCompleted
        : up.isCompleted || progressPercent === 100;

    previousModulePassed =
      !isModuleLocked && (moduleKanjis.length > 0 ? allKanjisCompleted : isModuleCompleted);

    modules.push({
      id: up.module.id,
      title: up.module.title,
      tujuanPembelajaran: up.module.tujuanPembelajaran,
      openDate: up.module.openDate,
      isCompleted: isModuleCompleted,
      isLocked: isModuleLocked,
      isDateLocked,
      isSequentialLocked,
      isEvaluationLocked,
      evaluationLockTitle,
      progressPercent,
      kanjis: moduleKanjis,
    });
  }

  return {
    config,
    isExempt,
    applyMasteryLock,
    applyScheduleLock,
    applyEvaluationLock,
    modules,
  };
}
