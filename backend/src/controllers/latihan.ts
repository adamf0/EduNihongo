import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/auth";

const prisma = new PrismaClient();

// Get detail of a specific kanji (e.g., "情報")
export const getKanjiDetail = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { character } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!character) {
      return res.status(400).json({ error: "Karakter kanji wajib ditentukan." });
    }

    // Find Kanji with parent Module title
    const kanji = await prisma.kanji.findUnique({
      where: { character },
      include: {
        examples: true,
        graphNodes: true,
        graphEdges: true,
        module: true,
        etymologies: true,
        jukugos: true,
      },
    });

    if (!kanji) {
      return res.status(404).json({ error: `Kanji ${character} tidak ditemukan.` });
    }

    // Find User progress for this Kanji
    const progress = await prisma.userKanjiProgress.findUnique({
      where: {
        userId_kanjiId: {
          userId,
          kanjiId: kanji.id,
        },
      },
    });

    const masteryPercent = progress ? progress.masteryPercent : 0;
    
    // Map mastery level to title
    let levelTitle = "Perunggu";
    if (masteryPercent >= 80) levelTitle = "Tingkat Emas";
    else if (masteryPercent >= 50) levelTitle = "Tingkat Perak";

    // Format Graph Nodes to match frontend initialRawNodes format
    const nodes = kanji.graphNodes.map((n) => ({
      id: n.id,
      kanji: n.character,
      meaning: n.meaning,
      type: n.type,
      borderColor: n.borderColor || undefined,
      isPill: n.isPill || undefined,
      parentPill: n.parentPill || undefined,
      isRoot: n.type === "root" ? true : undefined,
    }));

    // Format Graph Edges
    const edges = kanji.graphEdges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
    }));

    // Record user activity for accessing this Kanji/Module (XP awarded only on first access)
    const hasAccessedBefore = await prisma.userActivity.findFirst({
      where: {
        userId,
        activityType: "LESSON",
        description: {
          contains: `Kanji ${character}`
        }
      }
    });

    const xpEarnedAccess = hasAccessedBefore ? 0 : 5;

    await prisma.userActivity.create({
      data: {
        userId,
        kanjiCount: 0,
        vocabCount: 1,
        xpEarned: xpEarnedAccess,
        activityType: "LESSON",
        description: `Membuka Modul: Mempelajari tata bahasa & etimologi Kanji ${character}`,
      },
    });

    res.json({
      kanji: kanji.character,
      romaji: kanji.romaji,
      meaning: kanji.meaning,
      moduleTitle: kanji.module ? kanji.module.title : null,
      masteryPercent,
      masteryLevelTitle: levelTitle,
      examples: kanji.examples.map((ex) => ({
        japanese: ex.japanese,
        romaji: ex.romaji,
        translation: ex.translation,
      })),
      jukugos: kanji.jukugos.map((j) => ({
        word: j.word,
        reading: j.reading,
        meaning: j.meaning,
      })),
      etymologies: kanji.etymologies.map((et) => ({
        character: et.character,
        romaji: et.romaji,
        detail: et.detail,
      })),
      graph: {
        nodes,
        edges,
      },
    });
  } catch (error) {
    console.error("Latihan detail error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat memuat detail latihan." });
  }
};

// Verify handwriting accuracy and save to userkanjiprogress
export const verifyHandwriting = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { character, accuracy } = req.body;
    
    if (!character) {
      return res.status(400).json({ error: "Karakter target wajib ditentukan." });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const kanji = await prisma.kanji.findUnique({ 
      where: { character },
      include: { module: true }
    });

    if (!kanji) {
      return res.status(404).json({ error: `Kanji ${character} tidak ditemukan.` });
    }

    // Get previous mastery progress to keep the highest score achieved
    const existingProgress = await prisma.userKanjiProgress.findUnique({
      where: {
        userId_kanjiId: {
          userId,
          kanjiId: kanji.id,
        },
      },
    });

    const previousScore = existingProgress?.masteryPercent || 0;
    const score = typeof accuracy === "number" ? Math.min(100, Math.max(0, accuracy)) : 100;
    const finalScore = Math.max(previousScore, score);
    const isMastered = finalScore >= 75;

    await prisma.userKanjiProgress.upsert({
      where: {
        userId_kanjiId: {
          userId,
          kanjiId: kanji.id,
        },
      },
      update: {
        masteryPercent: finalScore,
        status: isMastered ? "MASTERED" : "STUDYING",
        lastPracticed: new Date(),
      },
      create: {
        userId,
        kanjiId: kanji.id,
        masteryPercent: finalScore,
        status: isMastered ? "MASTERED" : "STUDYING",
      },
    });

    // Recalculate associated Module Progress dynamically
    if (kanji.moduleId) {
      const linkedKanjis = await prisma.kanji.findMany({
        where: { moduleId: kanji.moduleId },
        include: {
          userProgress: {
            where: { userId },
          },
        },
      });

      if (linkedKanjis.length > 0) {
        const totalProgress = linkedKanjis.reduce((sum, k) => {
          const mastery = k.userProgress[0]?.masteryPercent || 0;
          return sum + mastery;
        }, 0);
        const averageProgress = Math.round(totalProgress / linkedKanjis.length);

        await prisma.userModuleProgress.update({
          where: {
            userId_moduleId: {
              userId,
              moduleId: kanji.moduleId,
            },
          },
          data: {
            progressPercent: averageProgress,
            isCompleted: averageProgress === 100,
          },
        });
      }
    }

    // Record user activity for successfully submitting verification (XP awarded only on first writing >= 75%)
    let xpEarnedWrite = 0;
    if (score >= 75) {
      const hasPassedBefore = await prisma.userActivity.findFirst({
        where: {
          userId,
          activityType: "REVIEW",
          xpEarned: 15,
          description: {
            contains: `Kanji ${character}`
          }
        }
      });
      if (!hasPassedBefore) {
        xpEarnedWrite = 15;
      }
    }

    await prisma.userActivity.create({
      data: {
        userId,
        kanjiCount: 1,
        vocabCount: 0,
        xpEarned: xpEarnedWrite,
        activityType: "REVIEW",
        description: `Melatih Penulisan: Berlatih menulis Kanji ${character} dengan akurasi ${score}%`,
      },
    });

    res.json({
      success: true,
      accuracy: finalScore,
      detectedText: character,
      message: "Modul Kanji berhasil diselesaikan dan ditandai sebagai Sudah Dipelajari!",
    });
  } catch (error) {
    console.error("Latihan verify error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat melakukan verifikasi goresan." });
  }
};
