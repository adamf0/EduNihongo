import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/auth";
import { calculateUserStats } from "../utils/stats";

const prisma = new PrismaClient();

export const getProgressData = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    // 1. Calculate Stats
    // Mastered kanjis: masteryPercent >= 75
    const masteredCount = await prisma.userKanjiProgress.count({
      where: { userId, masteryPercent: { gte: 75 } },
    });

    const totalKanjiCount = await prisma.kanji.count();

    const averageAccuracy = await prisma.userKanjiProgress.aggregate({
      where: { userId },
      _avg: {
        masteryPercent: true
      }
    });
    const accuracyScore = averageAccuracy._avg.masteryPercent
      ? Math.round(averageAccuracy._avg.masteryPercent)
      : 0;

    // 2. Fetch Heatmap Dots (UserActivity logs for 30 / 90 days)
    const activities = await prisma.userActivity.findMany({
      where: { userId },
      orderBy: { date: "asc" },
    });

    // We can map this to opacities classes to make it easy for UI
    const opacities = [
      "bg-primary/5",
      "bg-primary/20",
      "bg-primary/40",
      "bg-primary/70",
      "bg-primary",
    ];

    const formatHeatmap = (days: number) => {
      const dots = [];
      const now = new Date();
      // Generate activity dots for the last N days
      for (let i = days - 1; i >= 0; i--) {
        const targetDate = new Date();
        targetDate.setDate(now.getDate() - i);
        const dateStr = targetDate.toDateString();

        // Check if there was activity on this day
        const activity = activities.find(
          (act) => new Date(act.date).toDateString() === dateStr
        );

        let opacityClass = opacities[0];
        if (activity) {
          // Map xpEarned or kanjiCount to opacity level
          const idx = Math.min(4, Math.floor(activity.xpEarned / 20));
          opacityClass = opacities[idx] || opacities[4];
        }
        dots.push(opacityClass);
      }
      return dots;
    };

    // 4. Focus Review Kanji List (mistakeCount > 0, status = "REVIEW" or "LEARNING", ordered by mistakes desc)
    const reviewKanjiProgress = await prisma.userKanjiProgress.findMany({
      where: {
        userId,
        mistakeCount: { gte: 1 },
      },
      include: { kanji: true },
      orderBy: { mistakeCount: "desc" },
      take: 3,
    });

    const reviewKanji = reviewKanjiProgress.map((rp) => ({
      character: rp.kanji.character,
      romaji: rp.kanji.romaji,
      meaning: rp.kanji.meaning,
      mistakeCount: rp.mistakeCount,
    }));

    const computedStats = await calculateUserStats(userId);

    res.json({
      stats: {
        kanjiMastered: `${masteredCount} / ${totalKanjiCount} Kanji`,
        accuracy: `${accuracyScore}%`,
        streak: `${computedStats.streak} Hari`,
        level: "Kanjigraph Learner",
      },
      heatmap: {
        last30Days: formatHeatmap(42), // UI expects 42 dots for last 30 days
        last90Days: formatHeatmap(84), // UI expects 84 dots for last 90 days
      },
      reviewKanji,
    });
  } catch (error) {
    console.error("Progress error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat memuat data progress." });
  }
};
