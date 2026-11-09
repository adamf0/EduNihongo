import { PrismaClient } from "@prisma/client";
import { sortModuleKanjis } from "./kanjiOrder";

export const MASTERY_PASS_THRESHOLD = 60;

export interface AccessConfigState {
  id: number;
  enableMasteryLock: boolean;
  enableScheduleLock: boolean;
  updatedAt: Date;
}

export async function getAccessConfig(prisma: PrismaClient): Promise<AccessConfigState> {
  return prisma.systemConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      enableMasteryLock: true,
      enableScheduleLock: true,
    },
  });
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
  progressPercent: number;
  kanjis: ModuleKanjiAccessItem[];
}

export async function computeUserModuleAccess(prisma: PrismaClient, userId: number) {
  const [currentUser, config, userProgress] = await Promise.all([
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
  ]);

  const userEmail = (currentUser?.email || "").toLowerCase();
  const isExempt = userEmail === "haruki@sato.com" || currentUser?.role === "ADMIN";
  const applyMasteryLock = !isExempt && config.enableMasteryLock;
  const applyScheduleLock = !isExempt && config.enableScheduleLock;

  let previousModulePassed: boolean = true;
  const now = new Date();
  const modules: ComputedModuleAccessItem[] = [];

  for (let index = 0; index < userProgress.length; index++) {
    const up = userProgress[index];

    const isDateLocked: boolean = applyScheduleLock
      ? Boolean(up.module.openDate && new Date(up.module.openDate) > now)
      : false;

    const isSequentialLocked: boolean = applyMasteryLock
      ? index === 0
        ? false
        : !previousModulePassed
      : false;

    const isModuleLocked: boolean = isDateLocked || isSequentialLocked;

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
      progressPercent,
      kanjis: moduleKanjis,
    });
  }

  return {
    config,
    isExempt,
    applyMasteryLock,
    applyScheduleLock,
    modules,
  };
}
