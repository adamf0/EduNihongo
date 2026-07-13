import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const calculateUserStats = async (userId: number) => {
  // 1. Calculate Streak
  const activities = await prisma.userActivity.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  // Extract unique local YYYY-MM-DD strings
  const activeDates = new Set<string>();
  activities.forEach((act) => {
    const dateStr = new Date(act.date).toISOString().split("T")[0];
    activeDates.add(dateStr);
  });

  let streak = 0;
  const today = new Date();
  
  // Helper to format date as YYYY-MM-DD in local time
  const formatDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayStr = formatDate(today);
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  // Streak continues if active today or active yesterday
  let checkDate = new Date();
  if (!activeDates.has(todayStr) && activeDates.has(yesterdayStr)) {
    checkDate = yesterday;
  }

  while (true) {
    const checkStr = formatDate(checkDate);
    if (activeDates.has(checkStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // 2. Calculate Total XP
  const xpSum = await prisma.userActivity.aggregate({
    where: { userId },
    _sum: { xpEarned: true },
  });
  const totalXp = xpSum._sum.xpEarned || 0;

  // 3. Calculate Mastery Writing: average writingPercent across all kanjis user has practiced
  const writingAgg = await prisma.userKanjiProgress.aggregate({
    where: { userId },
    _avg: { writingPercent: true },
    _count: { _all: true },
  });
  const masteryWriting = (writingAgg._count?._all ?? 0) > 0
    ? Math.round(writingAgg._avg?.writingPercent ?? 0)
    : 0;
  
  // 4. Calculate Kemajuan Modul: average progressPercent across all user's module progress rows
  const modulesProgress = await prisma.userModuleProgress.findMany({
    where: { userId },
    orderBy: { moduleId: "asc" },
  });

  const masteryVocabulary = modulesProgress.length > 0
    ? Math.round(
        modulesProgress.reduce((sum, m) => sum + m.progressPercent, 0) / modulesProgress.length
      )
    : 0;

  // Update the user table record as a cache (optional but keeps DB record accurate)
  await prisma.user.update({
    where: { id: userId },
    data: {
      streak,
      totalXp,
      masteryWriting,
      masteryVocabulary,
    },
  });

  return {
    streak,
    totalXp,
    masteryWriting,
    masteryVocabulary,
  };
};
