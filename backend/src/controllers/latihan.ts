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

    // Find Kanji
    const kanji = await prisma.kanji.findUnique({
      where: { character },
      include: {
        examples: true,
        etymologies: true,
        graphNodes: true,
        graphEdges: true,
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

    res.json({
      kanji: kanji.character,
      romaji: kanji.romaji,
      meaning: kanji.meaning,
      onyomi: kanji.onyomi,
      kunyomi: kanji.kunyomi,
      masteryPercent,
      masteryLevelTitle: levelTitle,
      examples: kanji.examples.map((ex) => ({
        japanese: ex.japanese,
        romaji: ex.romaji,
        translation: ex.translation,
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

// Verify handwriting OCR (Mock verification)
export const verifyHandwriting = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { character, drawingData } = req.body;
    
    if (!character) {
      return res.status(400).json({ error: "Karakter target wajib ditentukan." });
    }

    // Mock OCR processing time and success
    // Generate simulated accuracy score between 75% and 98%
    const score = Math.floor(Math.random() * (98 - 75 + 1)) + 75;
    
    // Simulate updating user progress on success
    const userId = req.user?.id;
    if (userId) {
      const kanji = await prisma.kanji.findUnique({ where: { character } });
      if (kanji) {
        const userProgress = await prisma.userKanjiProgress.findUnique({
          where: {
            userId_kanjiId: {
              userId,
              kanjiId: kanji.id,
            },
          },
        });

        if (userProgress) {
          // Increase mastery percent by 2 points (capped at 100) if score is high
          const newPercent = Math.min(100, userProgress.masteryPercent + (score > 85 ? 2 : 1));
          await prisma.userKanjiProgress.update({
            where: {
              userId_kanjiId: {
                userId,
                kanjiId: kanji.id,
              },
            },
            data: {
              masteryPercent: newPercent,
              lastPracticed: new Date(),
              status: newPercent === 100 ? "MASTERED" : "LEARNING",
            },
          });
        }
      }
    }

    res.json({
      success: true,
      accuracy: score,
      detectedText: character, // Simulate perfect recognition for targeted char
      message: score >= 85 ? "Luar biasa! Goresan Anda sangat akurat." : "Cukup baik, terus latihan untuk menyempurnakan goresan Anda.",
    });
  } catch (error) {
    console.error("Latihan verify error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat melakukan verifikasi goresan." });
  }
};
