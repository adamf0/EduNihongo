import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/auth";
import { sortModuleKanjis } from "../utils/kanjiOrder";

const prisma = new PrismaClient();

// ============================================================================
// KONFIGURASI SISTEM PENGUNCIAN (LOCK) MODUL & KANJI
// true  = Fitur lock aktif (modul & kanji harus dibuka berurutan dengan threshold mastery > 60%)
// false = Fitur lock dinonaktifkan (seluruh modul & kanji terbuka bebas)
// ============================================================================
export const ENABLE_LOCK_SYSTEM: boolean = true;

export const getModulesData = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true },
    });
    const userEmail = (currentUser?.email || req.user?.email || "").toLowerCase();
    const isExempt = userEmail === "haruki@sato.com" || currentUser?.role === "ADMIN";

    // Fetch user module progress with associated modules and their kanjis
    const userProgress = await prisma.userModuleProgress.findMany({
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
    });

    let previousModulePassed = true; // Module 1 is always unlocked by default
    const modules: any[] = [];
    const now = new Date();

    for (let index = 0; index < userProgress.length; index++) {
      const up = userProgress[index];

      // Check date lock: locked if openDate is set and in the future (bypassed for exempt users)
      const isDateLocked: boolean = isExempt
        ? false
        : Boolean(up.module.openDate && new Date(up.module.openDate) > now);

      // Sequential unlock: subsequent modules unlock only if preceding module reached threshold > 60%
      const isSequentialLocked: boolean = (ENABLE_LOCK_SYSTEM && !isExempt)
        ? (index === 0 ? false : !previousModulePassed)
        : false;

      // Module is locked if either date is not reached or sequential requirement not met
      const isModuleLocked: boolean = isDateLocked || isSequentialLocked;

      // Sequential unlock for kanjis in this module:
      // First kanji is unlocked if module is unlocked.
      // Subsequent kanji unlocks if the preceding kanji has progress (masteryPercent > 0).
      let previousKanjiHasProgress = true;
      interface ModuleKanjiItem {
        id: number;
        character: string;
        meaning: string;
        masteryPercent: number;
        isCompleted: boolean;
        isLocked: boolean;
      }

      const sortedKanjis = sortModuleKanjis(up.module.kanjis || [], up.module.id);
      const moduleKanjis: ModuleKanjiItem[] = sortedKanjis.map((k: any, kIdx: number): ModuleKanjiItem => {
        const progress = k.userProgress?.[0];
        const masteryPercent: number = progress?.masteryPercent || 0;
        const isCompleted: boolean = masteryPercent > 60;

        // Kanji is locked if lock system enabled AND (module is locked OR preceding kanji has masteryPercent <= 0)
        const isKanjiLocked: boolean = isExempt
          ? false
          : (isModuleLocked || (ENABLE_LOCK_SYSTEM ? (kIdx === 0 ? false : !previousKanjiHasProgress) : false));

        // Next kanji in module unlocks if this kanji has masteryPercent > 0
        previousKanjiHasProgress = masteryPercent > 0;

        return {
          id: k.id,
          character: k.character,
          meaning: k.meaning,
          masteryPercent,
          isCompleted,
          isLocked: isKanjiLocked,
        };
      });

      // Calculate dynamic progressPercent based on kanjis in this module
      const progressPercent: number = moduleKanjis.length > 0
        ? Math.round(moduleKanjis.reduce((sum: number, k: ModuleKanjiItem) => sum + k.masteryPercent, 0) / moduleKanjis.length)
        : up.progressPercent;

      const allKanjisCompleted: boolean = moduleKanjis.length > 0 && moduleKanjis.every((k: ModuleKanjiItem) => k.isCompleted);
      const isModuleCompleted: boolean = moduleKanjis.length > 0 ? allKanjisCompleted : (up.isCompleted || progressPercent === 100);

      // Current module passes only if unlocked and ALL kanjis in this module have exceeded 60% mastery
      previousModulePassed = !isModuleLocked && (moduleKanjis.length > 0 ? allKanjisCompleted : isModuleCompleted);

      modules.push({
        id: up.module.id,
        title: up.module.title,
        tujuanPembelajaran: up.module.tujuanPembelajaran,
        openDate: up.module.openDate,
        isCompleted: isModuleCompleted,
        isLocked: isModuleLocked,
        isDateLocked,
        progressPercent,
        kanjis: moduleKanjis,
      });
    }

    // Synchronize isLocked, progressPercent, and isCompleted to DB asynchronously
    Promise.all(
      modules.map((m) =>
        prisma.userModuleProgress.update({
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
        }).catch((err) => console.error("Error updating userModuleProgress:", err))
      )
    );

    // Calculate overall course progress (average of modules with kanjis)
    const activeModules = modules.filter((m) => m.kanjis && m.kanjis.length > 0);
    const overallProgress = activeModules.length > 0
      ? Math.round(activeModules.reduce((sum, m) => sum + m.progressPercent, 0) / activeModules.length)
      : 0;

    res.json({
      overallProgress,
      modules,
      isLockSystemEnabled: isExempt ? false : ENABLE_LOCK_SYSTEM,
      isExempt,
    });
  } catch (error) {
    console.error("Modules error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat memuat data modul." });
  }
};
