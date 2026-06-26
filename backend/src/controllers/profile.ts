import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/auth";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Get profile details, mastered kanji, activities, and settings
export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
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
          take: 5,
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    // 1. Fetch Mastered Kanji Collection (masteryPercent = 100 or status = "MASTERED")
    const masteredKanjiProgress = await prisma.userKanjiProgress.findMany({
      where: {
        userId,
        status: "MASTERED",
      },
      include: { kanji: true },
      take: 6, // limit to 6 for profile display
    });

    const masteredKanji = masteredKanjiProgress.map((mp) => ({
      character: mp.kanji.character,
      romaji: mp.kanji.romaji,
      meaning: mp.kanji.meaning,
    }));

    // 2. Format Recent Activities
    // Helper to format timestamps to relative strings in Indonesian
    const getRelativeTime = (date: Date) => {
      const diffMs = Date.now() - new Date(date).getTime();
      const diffMins = Math.floor(diffMs / (60 * 1000));
      const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
      const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

      if (diffMins < 60) return `${diffMins} menit yang lalu`;
      if (diffHours < 24) return `${diffHours} jam yang lalu`;
      if (diffDays === 1) return "Kemarin";
      return `${diffDays} hari yang lalu`;
    };

    const recentActivities = user.activities.map((act) => {
      let icon = "school";
      let bgClass = "bg-secondary-container text-on-secondary-container";
      
      if (act.activityType === "ACHIEVEMENT") {
        icon = "emoji_events";
        bgClass = "bg-tertiary-container text-on-tertiary-container";
      } else if (act.activityType === "REVIEW") {
        icon = "history";
        bgClass = "bg-primary-fixed text-on-primary-fixed";
      }

      // Title & desc breakdown
      const parts = act.description.split(":");
      const title = parts[0]?.trim() || "Aktivitas Belajar";
      const desc = parts[1]?.trim() || "";

      return {
        icon,
        bgClass,
        title,
        desc,
        time: getRelativeTime(act.date),
        xp: act.xpEarned > 0 ? `+${act.xpEarned} XP` : "0 XP",
      };
    });

    // 3. Format joined date (e.g. October 2023)
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const joinedDate = new Date(user.joinedAt);
    const joinedMonthYear = `Mastering the strokes since ${months[joinedDate.getMonth()]} ${joinedDate.getFullYear()}`;

    res.json({
      name: user.name,
      email: user.email,
      level: `Tingkat ${user.level}`,
      levelName: user.levelName,
      joinedMonthYear,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiQe5kqkxQSznu5qP6MOCvqYEImp869C8EXKrPH0xqE-mSavCz012Q0MTtSiFiePGaV02jEkiMUlPH1dLTj1avEShwCtSPBlbHOZxnVTLhGL0HVhU5xknHCCYedJb-IxKOpMgxpKK-Ow5sIgWFUsyyY7_E-KIuwiPB5-20LhiSP8pqZauZlFtFZIf2EzIHFf1ANexPscHZGB71rWIQwJNpU7zy75AnxMohpp66viSQtkCUk07SBp5f7FtlpU8V_ukuBsXxmpoldEg",
      stats: {
        streak: user.streak, // 342 days in UI or user.streak, let's use user.streak (default 15, or let's override with 342 in response to match UI precisely)
        xp: user.totalXp, // 1240 XP
        rank: user.rank, // Top 5% Learner
      },
      masteredKanji,
      activities: recentActivities,
      masteryBreakdown: [
        { label: "Reading", percentage: user.masteryReading, colorClass: "bg-primary" },
        { label: "Writing", percentage: user.masteryWriting, colorClass: "bg-secondary" },
        { label: "Vocabulary", percentage: user.masteryVocabulary, colorClass: "bg-tertiary" },
      ],
    });
  } catch (error) {
    console.error("Profile get error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat memuat data profil." });
  }
};

// Update profile details
export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, email, password } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const dataToUpdate: any = {};
    if (name) dataToUpdate.name = name;
    
    if (email) {
      // Check if email already taken
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ error: "Email sudah digunakan oleh akun lain." });
      }
      dataToUpdate.email = email;
    }

    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    res.json({
      message: "Profil berhasil diperbarui.",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat memperbarui profil." });
  }
};
