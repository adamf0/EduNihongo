import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/auth";

const prisma = new PrismaClient();

export const getDashboardData = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        activities: {
          orderBy: { date: "desc" },
          take: 7,
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    // 1. Calculate Stats
    // Calculate total days active by counting unique dates in UserActivity
    const uniqueDaysCount = await prisma.userActivity.groupBy({
      by: ["date"],
      where: { userId },
    });
    const totalDaysActive = uniqueDaysCount.length;

    // 2. Format Weekly Activity Chart (last 7 days)
    // Days representation (e.g. Mon, Tue, Wed, etc. in Indonesian or abbreviations)
    const daysName = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const weeklyActivity = user.activities.map((act) => {
      const d = new Date(act.date);
      return {
        day: daysName[d.getDay()],
        kanji: act.kanjiCount,
        vocab: act.vocabCount,
        xp: act.xpEarned,
        date: act.date,
      };
    }).reverse(); // chronologically

    // 3. Fetch Jukugo recommendations
    const jukugoRecommendations = await prisma.kanji.findMany({
      where: { isJukugo: true },
      take: 4,
    });

    // 4. Continue Learning Module
    const activeModuleProgress = await prisma.userModuleProgress.findFirst({
      where: {
        userId,
        isCompleted: false,
        isLocked: false,
      },
      include: { module: true },
      orderBy: { moduleId: "asc" },
    });

    // 5. Daily Insight
    const dailyInsight = {
      quote: "Urutan goresan bukan sekadar aturan kaku, melainkan aliran seni yang menghidupkan makna di setiap lekukannya.",
      author: "Kanjigraph Sensei",
    };

    res.json({
      stats: {
        dailyTarget: `Target: ${user.dailyTargetKanji} Kanji, ${user.dailyTargetVocab} Kosakata`,
        streak: `${user.streak} Hari`,
        levelProgress: 65, // Static progress from Dashboard UI
        level: `Tingkat ${user.level}`,
        totalDays: `${totalDaysActive} Hari`,
      },
      weeklyActivity,
      recommendedJukugo: jukugoRecommendations.map((k) => ({
        kanji: k.character,
        romaji: k.romaji,
        meaning: k.meaning,
        border: k.border || "border-l-4 border-primary",
      })),
      continueLearning: activeModuleProgress
        ? {
            moduleTitle: activeModuleProgress.module.title,
            category: activeModuleProgress.module.category,
            progressPercent: activeModuleProgress.progressPercent,
            level: activeModuleProgress.module.level,
          }
        : {
            moduleTitle: "Semua modul selesai!",
            category: "NONE",
            progressPercent: 100,
            level: "N3",
          },
      dailyInsight,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat memuat data dasbor." });
  }
};
