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
        semanticRelations: true,
        quizzes: true,
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
    const writingPercent = progress ? progress.writingPercent : 0;
    const readingPercent = progress ? progress.readingPercent : 0;
    const quizPercent = progress ? progress.quizPercent : 0;
    
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

    // Record user activity for accessing this Kanji/Module
    // Only create LESSON activity once per day per kanji to avoid duplicates
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const hasAccessedToday = await prisma.userActivity.findFirst({
      where: {
        userId,
        activityType: "LESSON",
        date: { gte: startOfToday },
        description: { contains: `Kanji ${character}` }
      }
    });

    let xpEarnedAccess = 0;
    if (!hasAccessedToday) {
      // XP awarded only on very first access ever
      const hasAccessedEver = await prisma.userActivity.findFirst({
        where: {
          userId,
          activityType: "LESSON",
          description: { contains: `Kanji ${character}` }
        }
      });
      xpEarnedAccess = hasAccessedEver ? 0 : 5;

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
    }

    const claimedActivities = await prisma.userActivity.findMany({
      where: {
        userId,
        date: { gte: startOfToday },
        activityType: "REVIEW"
      }
    });

    const xpClaimed = {
      lesson: true, // opening module theory is always claimed once loaded (either today or previously)
      writing: claimedActivities.some(act => act.description.includes(`menulis Kanji ${character}`)),
      reading: claimedActivities.some(act => act.description.includes(`membaca kalimat Kanji ${character}`)),
      quiz: claimedActivities.some(act => act.description.includes(`kuis latihan Kanji ${character}`))
    };

    const parseJsonDeep = (val: any): any => {
      let result = val;
      while (typeof result === "string") {
        const trimmed = result.trim();
        if (
          (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
          (trimmed.startsWith("{") && trimmed.endsWith("}"))
        ) {
          try {
            result = JSON.parse(result);
          } catch (e) {
            break;
          }
        } else {
          break;
        }
      }
      return result;
    };

    const normalizeGroups = (rawGroups: any): any[] => {
      let data = parseJsonDeep(rawGroups);
      if (!data) return [];

      if (typeof data === "object" && !Array.isArray(data)) {
        return Object.entries(data).map(([catName, words]) => {
          const items = Array.isArray(words)
            ? words
            : typeof words === "string"
              ? [words]
              : [];
          return {
            name: catName,
            category: catName,
            correctWords: items,
            items: items,
          };
        });
      }

      if (Array.isArray(data)) {
        const result: any[] = [];
        for (const g of data) {
          if (typeof g === "string") {
            result.push({ name: g, category: g, correctWords: [], items: [] });
          } else if (typeof g === "object" && g !== null) {
            if (g.name === undefined && g.category === undefined) {
              const entries = Object.entries(g);
              if (entries.length > 0) {
                for (const [catName, words] of entries) {
                  const items = Array.isArray(words)
                    ? words
                    : typeof words === "string"
                      ? [words]
                      : [];
                  result.push({
                    name: catName,
                    category: catName,
                    correctWords: items,
                    items: items,
                  });
                }
                continue;
              }
            }

            const catName = g.name || g.category || g.title || g.label || "";
            const words = Array.isArray(g.correctWords)
              ? g.correctWords
              : Array.isArray(g.items)
                ? g.items
                : Array.isArray(g.words)
                  ? g.words
                  : [];
            result.push({
              name: catName,
              category: catName,
              correctWords: words,
              items: words,
            });
          }
        }
        return result;
      }

      return [];
    };

    const getTypePriority = (typeStr: string): number => {
      const lower = (typeStr || "").toLowerCase().trim();
      switch (lower) {
        case "multiple":
          return 1;
        case "fill":
          return 2;
        case "unscramble":
          return 3;
        case "matching":
          return 4;
        case "essay":
          return 5;
        case "grouping":
          return 6;
        default:
          return 99;
      }
    };

    const formattedQuizzes = kanji.quizzes.map((q) => {
      const parsedOptions = parseJsonDeep(q.options);
      const parsedCorrectAnswer = parseJsonDeep(q.correctAnswer);
      const parsedGroups = normalizeGroups(q.groups);

      return {
        id: q.id,
        type: q.type || "multiple",
        question: q.question || "",
        options: Array.isArray(parsedOptions)
          ? parsedOptions
          : parsedOptions
            ? [parsedOptions]
            : [],
        correctAnswer: parsedCorrectAnswer,
        words: parseJsonDeep(q.words),
        correctOrder: parseJsonDeep(q.correctOrder),
        targetWord: q.targetWord || "",
        leftItems: parseJsonDeep(q.leftItems),
        rightItems: parseJsonDeep(q.rightItems),
        pairs: parseJsonDeep(q.pairs),
        groups: parsedGroups,
        explanation: q.explanation || "",
      };
    });

    formattedQuizzes.sort((a, b) => {
      const pA = getTypePriority(a.type);
      const pB = getTypePriority(b.type);
      if (pA !== pB) return pA - pB;
      return a.id - b.id;
    });

    res.json({
      kanji: kanji.character,
      romaji: kanji.romaji,
      meaning: kanji.meaning,
      moduleTitle: kanji.module ? kanji.module.title : null,
      masteryPercent,
      writingPercent,
      readingPercent,
      quizPercent,
      masteryLevelTitle: levelTitle,
      quizData: JSON.stringify(formattedQuizzes),
      quizzes: formattedQuizzes,
      xpEarned: xpEarnedAccess,
      xpClaimed,
      examples: kanji.examples.map((ex) => ({
        japanese: ex.japanese,
        romaji: ex.romaji,
        translation: ex.translation,
        isReading: ex.isReading,
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

    const prevWriting = existingProgress?.writingPercent || 0;
    const prevReading = existingProgress?.readingPercent || 0;
    const prevQuiz = existingProgress?.quizPercent || 0;

    const score = typeof accuracy === "number" ? Math.min(100, Math.max(0, accuracy)) : 100;
    const finalWritingScore = Math.max(prevWriting, score);

    // Calculate weighted average masteryPercent: 40% writing, 30% reading, 30% quiz
    const finalMasteryScore = Math.round(finalWritingScore * 0.4 + prevReading * 0.3 + prevQuiz * 0.3);
    const isMastered = finalMasteryScore >= 75;

    await prisma.userKanjiProgress.upsert({
      where: {
        userId_kanjiId: {
          userId,
          kanjiId: kanji.id,
        },
      },
      update: {
        writingPercent: finalWritingScore,
        masteryPercent: finalMasteryScore,
        status: isMastered ? "MASTERED" : "STUDYING",
        lastPracticed: new Date(),
      },
      create: {
        userId,
        kanjiId: kanji.id,
        writingPercent: finalWritingScore,
        masteryPercent: finalMasteryScore,
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

    // Record user activity — award XP once per day per kanji if score >= 60
    let xpEarnedWrite = 0;
    if (score >= 60) {
      const startOfToday2 = new Date();
      startOfToday2.setHours(0, 0, 0, 0);
      const hasEarnedWriteXpToday = await prisma.userActivity.findFirst({
        where: {
          userId,
          activityType: "REVIEW",
          date: { gte: startOfToday2 },
          xpEarned: { gt: 0 },
          description: { contains: `Kanji ${character}` }
        }
      });
      if (!hasEarnedWriteXpToday) {
        // 15 XP for first pass (>= 75), 10 XP for practice (>= 60)
        xpEarnedWrite = score >= 75 ? 15 : 10;
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
      accuracy: finalMasteryScore,
      detectedText: character,
      xpEarned: xpEarnedWrite,
      message: "Modul Kanji berhasil diselesaikan dan ditandai sebagai Sudah Dipelajari!",
    });
  } catch (error) {
    console.error("Latihan verify error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat melakukan verifikasi goresan." });
  }
};

// Verify reading practice progress
export const verifyReading = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { character, readingPercent } = req.body;
    
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

    const existingProgress = await prisma.userKanjiProgress.findUnique({
      where: {
        userId_kanjiId: {
          userId,
          kanjiId: kanji.id,
        },
      },
    });

    const prevWriting = existingProgress?.writingPercent || 0;
    const prevReading = existingProgress?.readingPercent || 0;
    const prevQuiz = existingProgress?.quizPercent || 0;

    const score = typeof readingPercent === "number" ? Math.min(100, Math.max(0, readingPercent)) : 100;
    const finalReadingScore = Math.max(prevReading, score);

    const finalMasteryScore = Math.round(prevWriting * 0.4 + finalReadingScore * 0.3 + prevQuiz * 0.3);
    const isMastered = finalMasteryScore >= 75;

    await prisma.userKanjiProgress.upsert({
      where: {
        userId_kanjiId: {
          userId,
          kanjiId: kanji.id,
        },
      },
      update: {
        readingPercent: finalReadingScore,
        masteryPercent: finalMasteryScore,
        status: isMastered ? "MASTERED" : "STUDYING",
        lastPracticed: new Date(),
      },
      create: {
        userId,
        kanjiId: kanji.id,
        readingPercent: finalReadingScore,
        masteryPercent: finalMasteryScore,
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

    // Record activity — award 10 XP only when reading practice is 100% completed, once per day per kanji
    let xpEarnedReading = 0;
    if (score >= 100) {
      const startOfToday2 = new Date();
      startOfToday2.setHours(0, 0, 0, 0);
      const hasEarnedReadingXpToday = await prisma.userActivity.findFirst({
        where: {
          userId,
          activityType: "REVIEW",
          date: { gte: startOfToday2 },
          xpEarned: { gt: 0 },
          description: { contains: `Membaca Kalimat: Menyelesaikan latihan membaca kalimat Kanji ${character}` }
        }
      });
      if (!hasEarnedReadingXpToday) {
        xpEarnedReading = 10;
      }
    }

    await prisma.userActivity.create({
      data: {
        userId,
        kanjiCount: 0,
        vocabCount: 1,
        xpEarned: xpEarnedReading,
        activityType: "REVIEW",
        description: `Membaca Kalimat: Menyelesaikan latihan membaca kalimat Kanji ${character}`,
      },
    });

    res.json({
      success: true,
      accuracy: finalMasteryScore,
      xpEarned: xpEarnedReading,
      message: "Latihan membaca berhasil disimpan!",
    });
  } catch (error) {
    console.error("Latihan verify-reading error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat memverifikasi membaca." });
  }
};

// Verify quiz progress
export const verifyQuiz = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { character, quizPercent } = req.body;
    
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

    const existingProgress = await prisma.userKanjiProgress.findUnique({
      where: {
        userId_kanjiId: {
          userId,
          kanjiId: kanji.id,
        },
      },
    });

    const prevWriting = existingProgress?.writingPercent || 0;
    const prevReading = existingProgress?.readingPercent || 0;
    const prevQuiz = existingProgress?.quizPercent || 0;

    const score = typeof quizPercent === "number" ? Math.min(100, Math.max(0, quizPercent)) : 100;
    const finalQuizScore = Math.max(prevQuiz, score);

    const finalMasteryScore = Math.round(prevWriting * 0.4 + prevReading * 0.3 + finalQuizScore * 0.3);
    const isMastered = finalMasteryScore >= 75;

    await prisma.userKanjiProgress.upsert({
      where: {
        userId_kanjiId: {
          userId,
          kanjiId: kanji.id,
        },
      },
      update: {
        quizPercent: finalQuizScore,
        masteryPercent: finalMasteryScore,
        status: isMastered ? "MASTERED" : "STUDYING",
        lastPracticed: new Date(),
      },
      create: {
        userId,
        kanjiId: kanji.id,
        quizPercent: finalQuizScore,
        masteryPercent: finalMasteryScore,
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

    // Record activity — award XP once per day per kanji if quiz score >= 60%
    let xpEarnedQuiz = 0;
    if (score >= 60) {
      const startOfToday2 = new Date();
      startOfToday2.setHours(0, 0, 0, 0);
      const hasEarnedQuizXpToday = await prisma.userActivity.findFirst({
        where: {
          userId,
          activityType: "REVIEW",
          date: { gte: startOfToday2 },
          xpEarned: { gt: 0 },
          description: { contains: `Kanji ${character}` }
        }
      });
      if (!hasEarnedQuizXpToday) {
        xpEarnedQuiz = score >= 75 ? 20 : 10;
      }
    }

    await prisma.userActivity.create({
      data: {
        userId,
        kanjiCount: 0,
        vocabCount: 1,
        xpEarned: xpEarnedQuiz,
        activityType: "REVIEW",
        description: `Mengerjakan Kuis: Menyelesaikan kuis latihan Kanji ${character} dengan nilai ${score}%`,
      },
    });

    res.json({
      success: true,
      accuracy: finalMasteryScore,
      xpEarned: xpEarnedQuiz,
      message: "Hasil kuis berhasil disimpan!",
    });
  } catch (error) {
    console.error("Latihan verify-quiz error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat memverifikasi kuis." });
  }
};
