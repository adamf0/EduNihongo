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

    res.json({
      overallProgress,
      modules,
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
