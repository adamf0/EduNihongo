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
    // Kanji dikuasai: kanjis with masteryPercent >= 75 (fully mastered)
    const masteredCount = await prisma.userKanjiProgress.count({
      where: { userId, masteryPercent: { gte: 75 } },
    });

    // Kanji dipelajari: kanjis with masteryPercent > 0 (any progress)
    const studiedCount = await prisma.userKanjiProgress.count({
      where: { userId, masteryPercent: { gt: 0 } },
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
      "bg-surface-container-high",  // 0 = no activity (neutral gray)
      "bg-primary/20",
      "bg-primary/40",
      "bg-primary/70",
      "bg-primary",
    ];

    // Pre-build a map: "YYYY-MM-DD" (WIB = UTC+7) => { totalXp, totalKanji, hasActivity }
    const TZ_OFFSET_MS = 7 * 60 * 60 * 1000; // UTC+7 = WIB
    const dayMap = new Map<string, { totalXp: number; totalKanji: number }>();

    for (const act of activities) {
      // Convert to WIB local date string
      const localDate = new Date(new Date(act.date).getTime() + TZ_OFFSET_MS);
      const dayKey = localDate.toISOString().slice(0, 10); // "YYYY-MM-DD"
      const existing = dayMap.get(dayKey) || { totalXp: 0, totalKanji: 0 };
      dayMap.set(dayKey, {
        totalXp: existing.totalXp + act.xpEarned,
        totalKanji: existing.totalKanji + act.kanjiCount,
      });
    }

    const formatHeatmap = (days: number) => {
      const dots = [];
      const nowLocal = new Date(new Date().getTime() + TZ_OFFSET_MS);

      for (let i = days - 1; i >= 0; i--) {
        const targetLocal = new Date(nowLocal.getTime() - i * 24 * 60 * 60 * 1000);
        const dayKey = targetLocal.toISOString().slice(0, 10);

        const dayData = dayMap.get(dayKey);

        let opacityClass = opacities[0]; // no activity
        if (dayData) {
          // Use total XP for intensity; any activity day shows at least level 1
          const totalXp = dayData.totalXp;
          let idx: number;
          if (totalXp === 0) {
            // Had activity but no XP (e.g., just opened a module)
            idx = 1;
          } else if (totalXp < 10) {
            idx = 1;
          } else if (totalXp < 20) {
            idx = 2;
          } else if (totalXp < 40) {
            idx = 3;
          } else {
            idx = 4;
          }
          opacityClass = opacities[idx];
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

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayActivities = await prisma.userActivity.findMany({
      where: {
        userId,
        date: { gte: startOfToday },
      },
    });

    const kanjiPracticedToday = todayActivities.reduce((sum, act) => sum + act.kanjiCount, 0);
    const xpEarnedToday = todayActivities.reduce((sum, act) => sum + act.xpEarned, 0);
    const dailyTarget = user.dailyTargetKanji || 5;

    const computedStats = await calculateUserStats(userId);

    res.json({
      stats: {
        kanjiMastered: masteredCount > 0
          ? `${masteredCount} / ${totalKanjiCount} Kanji`
          : studiedCount > 0
            ? `${studiedCount} sedang dipelajari`
            : `0 / ${totalKanjiCount} Kanji`,
        accuracy: `${accuracyScore}%`,
        streak: `${computedStats.streak} Hari`,
        level: "Kanjigraph Learner",
        masteryWriting: `${computedStats.masteryWriting}%`,
        masteryVocabulary: `${computedStats.masteryVocabulary}%`,
        xpToday: `${xpEarnedToday} XP`,
        todayProgress: `${kanjiPracticedToday} / ${dailyTarget} Kanji`
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
