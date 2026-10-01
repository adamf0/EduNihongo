import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/auth";

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

    for (let index = 0; index < userProgress.length; index++) {
      const up = userProgress[index];

      // Module 1 (index 0) is always unlocked.
      // Subsequent modules unlock only if the preceding module reached threshold > 60%
      const isModuleLocked: boolean = ENABLE_LOCK_SYSTEM
        ? (index === 0 ? false : !previousModulePassed)
        : false;

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

      const moduleKanjis: ModuleKanjiItem[] = up.module.kanjis.map((k: any, kIdx: number): ModuleKanjiItem => {
        const progress = k.userProgress?.[0];
        const masteryPercent: number = progress?.masteryPercent || 0;
        const isCompleted: boolean = masteryPercent > 60;

        // Kanji is locked if lock system enabled AND (module is locked OR preceding kanji has masteryPercent <= 0)
        const isKanjiLocked: boolean = ENABLE_LOCK_SYSTEM
          ? (isModuleLocked || (kIdx === 0 ? false : !previousKanjiHasProgress))
          : false;

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
        isCompleted: isModuleCompleted,
        isLocked: isModuleLocked,
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

    // Calculate overall course progress (average of modules progress)
    const overallProgress = modules.length > 0
      ? Math.round(modules.reduce((sum, m) => sum + m.progressPercent, 0) / modules.length)
      : 0;

    res.json({
      overallProgress,
      modules,
      isLockSystemEnabled: ENABLE_LOCK_SYSTEM,
    });
  } catch (error) {
    console.error("Modules error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat memuat data modul." });
  }
};
