import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/auth";

const prisma = new PrismaClient();

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
            },
          },
        },
      },
      orderBy: { moduleId: "asc" },
    });

    const modules = userProgress.map((up, index) => {
      const moduleKanjis = up.module.kanjis.map((k) => {
        const progress = k.userProgress[0];
        return {
          character: k.character,
          meaning: k.meaning,
          masteryPercent: progress?.masteryPercent || 0,
          isCompleted: (progress?.masteryPercent || 0) >= 75,
        };
      });

      // Calculate dynamic locks:
      // First module is always unlocked.
      // Subsequent modules are locked if the previous module is not 100% completed.
      let isLocked = false;
      if (index > 0) {
        const prev = userProgress[index - 1];
        isLocked = prev.progressPercent < 100 && !prev.isCompleted;
      }

      return {
        id: up.module.id,
        title: up.module.title,
        tujuanPembelajaran: up.module.tujuanPembelajaran,
        isCompleted: up.isCompleted || up.progressPercent === 100,
        isLocked,
        progressPercent: up.progressPercent,
        kanjis: moduleKanjis,
      };
    });

    // Calculate overall course progress (average of modules progress)
    const overallProgress = modules.length > 0
      ? Math.round(modules.reduce((sum, m) => sum + m.progressPercent, 0) / modules.length)
      : 0;

    res.json({
      overallProgress,
      modules,
    });
  } catch (error) {
    console.error("Modules error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat memuat data modul." });
  }
};
