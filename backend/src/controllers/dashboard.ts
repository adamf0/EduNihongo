import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/auth";
import { calculateUserStats } from "../utils/stats";

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

    // 2. Format Weekly Activity Chart: last 7 calendar days (WIB = UTC+7), one entry per day
    const daysName = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const TZ_OFFSET_MS = 7 * 60 * 60 * 1000; // WIB = UTC+7

    // Fetch all activities in last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentSevenDayActivities = await prisma.userActivity.findMany({
      where: { userId, date: { gte: sevenDaysAgo } },
      orderBy: { date: "asc" },
    });

    // Aggregate XP and kanji per local date (WIB)
    const dayAggMap = new Map<string, { xp: number; kanji: number; vocab: number; dayName: string }>();
    const nowLocalMs = Date.now() + TZ_OFFSET_MS;
    for (let i = 6; i >= 0; i--) {
      const dayLocalMs = nowLocalMs - i * 24 * 60 * 60 * 1000;
      const dayKey = new Date(dayLocalMs).toISOString().slice(0, 10); // "YYYY-MM-DD"
      const dayOfWeek = new Date(dayLocalMs).getUTCDay(); // UTC day of the WIB-shifted date
      dayAggMap.set(dayKey, { xp: 0, kanji: 0, vocab: 0, dayName: daysName[dayOfWeek] });
    }

    for (const act of recentSevenDayActivities) {
      const localDate = new Date(new Date(act.date).getTime() + TZ_OFFSET_MS);
      const dayKey = localDate.toISOString().slice(0, 10);
      const existing = dayAggMap.get(dayKey);
      if (existing) {
        dayAggMap.set(dayKey, {
          ...existing,
          xp: existing.xp + act.xpEarned,
          kanji: existing.kanji + act.kanjiCount,
          vocab: existing.vocab + act.vocabCount,
        });
      }
    }

    // Convert to array sorted by date (oldest → newest)
    const weeklyActivity = Array.from(dayAggMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, val]) => ({
        day: val.dayName,
        kanji: val.kanji,
        vocab: val.vocab,
        xp: val.xp,
      }));

    // 3. Calculate Today's Progress
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
    const todayProgressPercent = Math.min(100, Math.round((kanjiPracticedToday / dailyTarget) * 100));

    // 4. Continue Learning Module & Dynamic Next Kanji details
    const activeModuleProgress = await prisma.userModuleProgress.findFirst({
      where: {
        userId,
        isCompleted: false,
        isLocked: false,
      },
      include: { module: true },
      orderBy: { moduleId: "asc" },
    });

    let nextKanjiDetails = {
      character: "学",
      romaji: "Gaku",
      meaning: "Belajar, Pembelajaran, Ilmu",
    };

    if (activeModuleProgress) {
      const kanjisInModule = await prisma.kanji.findMany({
        where: { moduleId: activeModuleProgress.moduleId },
        orderBy: { id: "asc" },
      });

      if (kanjisInModule.length > 0) {
        const progressList = await prisma.userKanjiProgress.findMany({
          where: {
            userId,
            kanjiId: { in: kanjisInModule.map((k) => k.id) },
          },
        });

        const nextK = kanjisInModule.find((k) => {
          const p = progressList.find((pl) => pl.kanjiId === k.id);
          return !p || p.masteryPercent < 75;
        }) || kanjisInModule[0];

        if (nextK) {
          nextKanjiDetails = {
            character: nextK.character,
            romaji: nextK.romaji,
            meaning: nextK.meaning,
          };
        }
      }
    }

    // 5. Fetch Recent Activities for the bento list
    const recentActivities = await prisma.userActivity.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 5,
    });

    // 6. Daily Insight
    const dailyInsight = {
      quote: "Urutan goresan bukan sekadar aturan kaku, melainkan aliran seni yang menghidupkan makna di setiap lekukannya.",
      author: "Kanjigraph Sensei",
    };

    const computedStats = await calculateUserStats(userId);

    res.json({
      stats: {
        dailyTarget: `${kanjiPracticedToday} / ${dailyTarget} Kanji`,
        streak: `${computedStats.streak} Hari`,
        levelProgress: todayProgressPercent,
        level: "Progres Target Hari Ini",
        totalDays: `${totalDaysActive} Hari`,
        xpToday: `${xpEarnedToday} XP`,
        masteryWriting: `${computedStats.masteryWriting}%`,
        masteryVocabulary: `${computedStats.masteryVocabulary}%`,
        totalXp: `${computedStats.totalXp} XP`,
      },
      weeklyActivity,
      activities: recentActivities.map((act) => ({
        id: act.id,
        date: act.date,
        xpEarned: act.xpEarned,
        kanjiCount: act.kanjiCount,
        vocabCount: act.vocabCount,
        activityType: act.activityType,
        description: act.description,
      })),
      continueLearning: activeModuleProgress
        ? {
            moduleTitle: activeModuleProgress.module.title,
            progressPercent: activeModuleProgress.progressPercent,
            nextKanji: nextKanjiDetails.character,
            nextKanjiRomaji: nextKanjiDetails.romaji,
            nextKanjiMeaning: nextKanjiDetails.meaning,
          }
        : {
            moduleTitle: "Semua modul selesai!",
            progressPercent: 100,
            nextKanji: "学",
            nextKanjiRomaji: "Gaku",
            nextKanjiMeaning: "Belajar, Pembelajaran, Ilmu",
          },
      dailyInsight,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat memuat data dasbor." });
  }
};
