import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sanitizeObject } from "../utils/sanitize";
import { buildDynamicKanjiGraph } from "../services/graphService";

const prisma = new PrismaClient();

// ================= MODULE CRUD =================

export const getModules = async (req: Request, res: Response) => {
  try {
    const modules = await prisma.module.findMany({
      include: {
        kanjis: {
          include: {
            examples: true,
            jukugos: true,
            semanticRelations: true,
            masterRefleksi: true,
            quizzes: { orderBy: { type: "asc" } },
          },
          orderBy: { id: "asc" },
        },
      },
      orderBy: { id: "asc" },
    });

    const formattedModules = modules.map((mod) => ({
      ...mod,
      kanjis: (mod.kanjis || []).map((k) => {
        const quizQuestions = (k.quizzes || []).map(formatQuizFromDb);
        const refQuestions = (k.masterRefleksi || []).map((mr) => mr.question);

        return {
          ...k,
          quizData: JSON.stringify(quizQuestions),
          quizzes: quizQuestions,
          reflectionData: JSON.stringify(refQuestions),
          masterRefleksi: k.masterRefleksi || [],
        };
      }),
    }));

    res.json(formattedModules);
  } catch (error: any) {
    console.error("Admin getModules error:", error);
    res.status(500).json({ error: error?.message || "Gagal mengambil data modul." });
  }
};

export const getModuleDetail = async (req: Request, res: Response) => {
  try {
    const moduleId = parseInt(req.params.id, 10);
    if (isNaN(moduleId)) {
      return res.status(400).json({ error: "ID Modul tidak valid." });
    }

    const mod = await prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        kanjis: {
          include: {
            examples: true,
            jukugos: true,
            semanticRelations: true,
            masterRefleksi: true,
            quizzes: { orderBy: { type: "asc" } },
          },
          orderBy: { id: "asc" },
        },
      },
    });

    if (!mod) {
      return res.status(404).json({ error: "Modul tidak ditemukan." });
    }

    const formattedKanji = await Promise.all(
      (mod.kanjis || []).map(async (k) => {
        const quizQuestions = (k.quizzes || []).map(formatQuizFromDb);
        const refQuestions = (k.masterRefleksi || []).map((mr) => mr.question);
        const dynamicGraph = await buildDynamicKanjiGraph(k.id);

        return {
          ...k,
          graphNodes: dynamicGraph.nodes,
          graphEdges: dynamicGraph.edges,
          quizData: JSON.stringify(quizQuestions),
          quizzes: quizQuestions,
          reflectionData: JSON.stringify(refQuestions),
          masterRefleksi: k.masterRefleksi || [],
        };
      })
    );

    res.json({
      ...mod,
      kanjis: formattedKanji,
    });
  } catch (error: any) {
    console.error("Admin getModuleDetail error:", error);
    res.status(500).json({ error: error?.message || "Gagal mengambil detail modul." });
  }
};

export const createModule = async (req: Request, res: Response) => {
  try {
    const body = sanitizeObject(req.body);
    const { title, tujuanPembelajaran } = body;
    if (!title) {
      return res.status(400).json({ error: "Judul modul wajib diisi." });
    }

    const module = await prisma.module.create({
      data: { 
        title,
        tujuanPembelajaran: tujuanPembelajaran || null
      },
    });

    // Automatically create userModuleProgress for existing users
    const users = await prisma.user.findMany();
    for (const u of users) {
      await prisma.userModuleProgress.create({
        data: {
          userId: u.id,
          moduleId: module.id,
          isCompleted: false,
          isLocked: true,
          progressPercent: 0,
        },
      });
    }

    res.status(201).json(module);
  } catch (error: any) {
    console.error("Admin createModule error:", error);
    res.status(500).json({ error: "Gagal membuat modul baru." });
  }
};

export const updateModule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = sanitizeObject(req.body);
    const { title, tujuanPembelajaran } = body;

    if (!title) {
      return res.status(400).json({ error: "Judul modul wajib diisi." });
    }

    const module = await prisma.module.update({
      where: { id: parseInt(id, 10) },
      data: { 
        title,
        tujuanPembelajaran: tujuanPembelajaran || null
      },
    });

    res.json(module);
  } catch (error: any) {
    console.error("Admin updateModule error:", error);
    res.status(500).json({ error: "Gagal memperbarui modul." });
  }
};

export const deleteModule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const moduleId = parseInt(id, 10);

    // Delete user progress first due to constraints
    await prisma.userModuleProgress.deleteMany({
      where: { moduleId },
    });

    await prisma.module.delete({
      where: { id: moduleId },
    });

    res.json({ message: "Modul berhasil dihapus." });
  } catch (error: any) {
    console.error("Admin deleteModule error:", error);
    res.status(500).json({ error: "Gagal menghapus modul." });
  }
};

// ================= KANJI CRUD =================

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
        [catName]: items,
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
        result.push({ [g]: [], name: g, category: g, correctWords: [], items: [] });
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
                [catName]: items,
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
          [catName]: words,
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

const formatQuizFromDb = (q: any) => {
  const parsedOptions = parseJsonDeep(q.options);
  const parsedCorrectAnswer = parseJsonDeep(q.correctAnswer);
  const parsedGroups = normalizeGroups(q.groups);

  return {
    id: q.id,
    type: q.type || "multiple",
    question: q.question || "",
    options: Array.isArray(parsedOptions) ? parsedOptions : (parsedOptions ? [parsedOptions] : []),
    optionA: Array.isArray(parsedOptions) ? (parsedOptions[0] || "") : "",
    optionB: Array.isArray(parsedOptions) ? (parsedOptions[1] || "") : "",
    optionC: Array.isArray(parsedOptions) ? (parsedOptions[2] || "") : "",
    optionD: Array.isArray(parsedOptions) ? (parsedOptions[3] || "") : "",
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
};

const prepareQuizForDb = (kanjiId: number, rawQuizzes: any[]) => {
  const stringifyIfNeeded = (val: any) => {
    if (val === undefined || val === null) return null;
    if (typeof val === "object") return JSON.stringify(val);
    return String(val);
  };

  return rawQuizzes.map((q: any) => {
    let opts = q.options;
    if (!opts && (q.optionA || q.optionB || q.optionC || q.optionD)) {
      opts = [q.optionA || "", q.optionB || "", q.optionC || "", q.optionD || ""].filter(Boolean);
    }

    let corrAns = q.correctAnswer;
    if (q.type === "unscramble" && (corrAns === undefined || corrAns === null || (typeof corrAns === "string" && isNaN(Number(corrAns))))) {
      corrAns = "0";
    }

    return {
      kanjiId,
      type: q.type || "multiple",
      question: q.question || "",
      options: stringifyIfNeeded(opts),
      correctAnswer: stringifyIfNeeded(corrAns),
      words: stringifyIfNeeded(q.words),
      correctOrder: stringifyIfNeeded(q.correctOrder),
      targetWord: q.targetWord || null,
      leftItems: stringifyIfNeeded(q.leftItems),
      rightItems: stringifyIfNeeded(q.rightItems),
      pairs: stringifyIfNeeded(q.pairs),
      groups: stringifyIfNeeded(q.groups),
      explanation: q.explanation || null,
    };
  });
};

const saveMasterRefleksiForKanji = async (kanjiId: number, rawRefleksi: any) => {
  await prisma.masterRefleksi.deleteMany({ where: { kanjiId } });
  
  let questions: string[] = [];
  if (Array.isArray(rawRefleksi)) {
    questions = rawRefleksi.map((item: any) => {
      if (typeof item === "string") return item.trim();
      if (item && typeof item === "object" && item.question) return String(item.question).trim();
      return String(item).trim();
    }).filter(Boolean);
  } else if (typeof rawRefleksi === "string" && rawRefleksi.trim()) {
    try {
      const parsed = JSON.parse(rawRefleksi);
      if (Array.isArray(parsed)) {
        questions = parsed.map((item: any) => {
          if (typeof item === "string") return item.trim();
          if (item && typeof item === "object" && item.question) return String(item.question).trim();
          return String(item).trim();
        }).filter(Boolean);
      } else {
        questions = [rawRefleksi.trim()];
      }
    } catch (e) {
      questions = rawRefleksi.split("\n").map(s => s.trim()).filter(Boolean);
    }
  }

  if (questions.length > 0) {
    await prisma.masterRefleksi.createMany({
      data: questions.map((q) => ({
        kanjiId,
        question: q,
      })),
    });
  }
};

export const getKanjis = async (req: Request, res: Response) => {
  try {
    const kanjis = await prisma.kanji.findMany({
      include: {
        examples: true,
        graphEdges: true,
        module: true,
        jukugos: true,
        semanticRelations: true,
        masterRefleksi: true,
        quizzes: { orderBy: { type: "asc" } },
      },
      orderBy: { id: "asc" },
    });

    const formatted = await Promise.all(
      kanjis.map(async (k) => {
        const quizQuestions = (k.quizzes || []).map(formatQuizFromDb);
        const refQuestions = (k.masterRefleksi || []).map((mr) => mr.question);
        const dynamicGraph = await buildDynamicKanjiGraph(k.id);

        return {
          ...k,
          graphNodes: dynamicGraph.nodes,
          graphEdges: dynamicGraph.edges,
          quizData: JSON.stringify(quizQuestions),
          quizzes: quizQuestions,
          reflectionData: JSON.stringify(refQuestions),
          masterRefleksi: k.masterRefleksi || [],
        };
      })
    );

    res.json(formatted);
  } catch (error: any) {
    console.error("Admin getKanjis error:", error);
    res.status(500).json({ error: error?.message || "Gagal mengambil data kanji." });
  }
};

export const createKanji = async (req: Request, res: Response) => {
  try {
    const body = sanitizeObject(req.body);
    const {
      character,
      romaji,
      meaning,
      bushuu,
      onyomi,
      kunyomi,
      baseMeaning,
      isJukugo,
      border,
      moduleId,
      examples,
      jukugos,
      semanticRelations,
      graphNodes,
      graphEdges,
      etymologies,
      quizzes,
      quizQuestions,
      quizData,
      reflectionData,
    } = body;

    if (!character || !romaji || !meaning) {
      return res.status(400).json({ error: "Karakter, romaji, dan arti wajib diisi." });
    }

    // Check duplicate
    const existing = await prisma.kanji.findUnique({ where: { character } });
    if (existing) {
      return res.status(400).json({ error: "Karakter Kanji sudah ada." });
    }

    // Create Kanji
    const kanji = await prisma.kanji.create({
      data: {
        character,
        romaji,
        meaning,
        bushuu: bushuu || null,
        onyomi: onyomi || null,
        kunyomi: kunyomi || null,
        baseMeaning: baseMeaning || null,
        isJukugo: !!isJukugo,
        border: border || null,
        moduleId: moduleId ? parseInt(moduleId, 10) : null,
      },
    });

    // Create Examples
    if (Array.isArray(examples) && examples.length > 0) {
      await prisma.exampleSentence.createMany({
        data: examples.map((ex: any) => ({
          kanjiId: kanji.id,
          japanese: ex.japanese || "",
          romaji: ex.romaji || "",
          translation: ex.translation || "",
          isReading: !!ex.isReading,
        })),
      });
    }

    // Create Jukugos
    if (Array.isArray(jukugos) && jukugos.length > 0) {
      await prisma.jukugo.createMany({
        data: jukugos.map((j: any) => ({
          kanjiId: kanji.id,
          word: j.word || "",
          reading: j.reading || "",
          meaning: j.meaning || "",
        })),
      });
    }

    // Create SemanticRelations
    if (Array.isArray(semanticRelations) && semanticRelations.length > 0) {
      await prisma.semanticRelation.createMany({
        data: semanticRelations.map((sr: any) => ({
          kanjiId: kanji.id,
          ...parseSemanticRelationFields(sr),
        })),
      });
    }

    // Create Quizzes in Quiz table
    const rawQuizzes = Array.isArray(quizzes)
      ? quizzes
      : Array.isArray(quizQuestions)
      ? quizQuestions
      : typeof quizData === "string"
      ? (() => {
          try {
            return JSON.parse(quizData);
          } catch (e) {
            return [];
          }
        })()
      : [];

    if (Array.isArray(rawQuizzes) && rawQuizzes.length > 0) {
      await prisma.quiz.createMany({
        data: prepareQuizForDb(kanji.id, rawQuizzes),
      });
    }



    // Create Graph Edges
    if (Array.isArray(graphEdges) && graphEdges.length > 0) {
      await prisma.kanjiGraphEdge.createMany({
        data: graphEdges.map((e: any) => ({
          id: e.id,
          kanjiId: kanji.id,
          source: e.source || "",
          target: e.target || "",
          predicate: e.predicate || e.label || null,
        })),
      });
    }

    // Create default progress for all users
    const users = await prisma.user.findMany();
    for (const u of users) {
      await prisma.userKanjiProgress.create({
        data: {
          userId: u.id,
          kanjiId: kanji.id,
          masteryPercent: 0,
          status: "LEARNING",
          mistakeCount: 0,
        },
      });
    }

    // Save MasterRefleksi
    await saveMasterRefleksiForKanji(kanji.id, reflectionData || body.masterRefleksi);

    const fullKanji = await prisma.kanji.findUnique({
      where: { id: kanji.id },
      include: {
        examples: true,
        graphEdges: true,
        module: true,
        jukugos: true,
        semanticRelations: true,
        masterRefleksi: true,
        quizzes: { orderBy: { type: "asc" } },
      },
    });

    const formattedQuizList = fullKanji?.quizzes.map(formatQuizFromDb) || [];
    const refQuestions = fullKanji?.masterRefleksi.map((mr: any) => mr.question) || [];
    const dynamicGraph = await buildDynamicKanjiGraph(kanji.id);

    res.status(201).json({
      ...fullKanji,
      graphNodes: dynamicGraph.nodes,
      graphEdges: dynamicGraph.edges,
      quizData: JSON.stringify(formattedQuizList),
      quizzes: formattedQuizList,
      reflectionData: JSON.stringify(refQuestions),
      masterRefleksi: fullKanji?.masterRefleksi || [],
    });
  } catch (error: any) {
    console.error("Admin createKanji error:", error);
    res.status(500).json({ error: "Gagal membuat kanji baru." });
  }
};

const cleanArti = (val: string) => {
  if (!val) return "";
  let cleaned = val.trim();
  while (/^[^\s:：；;]+?\s*[:：；;]\s*/i.test(cleaned)) {
    cleaned = cleaned.replace(/^[^\s:：；;]+?\s*[:：；;]\s*/i, "").trim();
  }
  return cleaned;
};

const parseSemanticRelationFields = (sr: any) => {
  let kanjiVal = (sr.kanji || "").trim();
  let j1Val = (sr.jukugo_1 || "").trim();
  let j1ArtiVal = cleanArti(sr.jukugo_1_arti || "");
  let j2Val = (sr.jukugo_2 || "").trim();
  let j2ArtiVal = cleanArti(sr.jukugo_2_arti || "");
  const artiVal = (sr.arti || "").trim();
  const penjelasanVal = (sr.penjelasan || "").trim();

  // If kanjiVal is empty, attempt regex extraction from penjelasan
  if (!kanjiVal && penjelasanVal) {
    const matchMenjadi = penjelasanVal.match(/menjadi\s*([一-龯ぁ-んァ-ヶA-Za-z0-9]+)/i);
    if (matchMenjadi && matchMenjadi[1]) {
      kanjiVal = matchMenjadi[1].trim();
    }
  }

  // If j1Val or j2Val is empty, attempt regex extraction from penjelasan
  if ((!j1Val || !j2Val) && penjelasanVal) {
    const matchKanjiBoth = penjelasanVal.match(/kanji\s*([一-龯])\s*dan\s*([一-龯])/i);
    if (matchKanjiBoth) {
      if (!j1Val) j1Val = matchKanjiBoth[1];
      if (!j2Val) j2Val = matchKanjiBoth[2];
    }
  }

  if (!j1Val && kanjiVal.length > 0) j1Val = kanjiVal.charAt(0);
  if (!j2Val && kanjiVal.length > 1) j2Val = kanjiVal.charAt(1);

  return {
    kanji: kanjiVal,
    arti: artiVal,
    jukugo_1: j1Val,
    jukugo_1_arti: j1ArtiVal,
    jukugo_2: j2Val,
    jukugo_2_arti: j2ArtiVal,
    penjelasan: penjelasanVal,
  };
};

export const updateKanji = async (req: Request, res: Response) => {
  try {
    const kanjiId = parseInt(req.params.id, 10);
    if (isNaN(kanjiId)) {
      return res.status(400).json({ error: "ID Kanji tidak valid." });
    }

    const existingKanji = await prisma.kanji.findUnique({ where: { id: kanjiId } });
    if (!existingKanji) {
      return res.status(404).json({ error: "Kanji tidak ditemukan." });
    }

    const body = sanitizeObject(req.body);
    const {
      character,
      romaji,
      meaning,
      bushuu,
      onyomi,
      kunyomi,
      baseMeaning,
      isJukugo,
      border,
      moduleId,
      examples,
      jukugos,
      semanticRelations,
      graphNodes,
      graphEdges,
      etymologies,
      quizzes,
      quizQuestions,
      quizData,
      reflectionData,
      masterRefleksi,
    } = body;

    const finalCharacter = character !== undefined ? character : existingKanji.character;
    const finalRomaji = romaji !== undefined ? romaji : existingKanji.romaji;
    const finalMeaning = meaning !== undefined ? meaning : existingKanji.meaning;
    const finalBushuu = bushuu !== undefined ? bushuu : existingKanji.bushuu;
    const finalOnyomi = onyomi !== undefined ? onyomi : existingKanji.onyomi;
    const finalKunyomi = kunyomi !== undefined ? kunyomi : existingKanji.kunyomi;
    const finalBaseMeaning = baseMeaning !== undefined ? baseMeaning : existingKanji.baseMeaning;
    const finalIsJukugo = isJukugo !== undefined ? !!isJukugo : existingKanji.isJukugo;
    const finalBorder = border !== undefined ? border : existingKanji.border;

    if (!finalCharacter) {
      return res.status(400).json({ error: "Karakter kanji wajib diisi." });
    }

    let targetModuleId: number | null = existingKanji.moduleId;
    if (moduleId !== undefined) {
      if (moduleId === null) {
        targetModuleId = null;
      } else {
        const parsedMod = typeof moduleId === "number" ? moduleId : parseInt(moduleId, 10);
        if (!isNaN(parsedMod)) {
          const existingMod = await prisma.module.findUnique({ where: { id: parsedMod } });
          if (existingMod) {
            targetModuleId = parsedMod;
          }
        }
      }
    }

    // Update Kanji basic info
    const kanji = await prisma.kanji.update({
      where: { id: kanjiId },
      data: {
        character: finalCharacter,
        romaji: finalRomaji,
        meaning: finalMeaning,
        bushuu: finalBushuu,
        onyomi: finalOnyomi,
        kunyomi: finalKunyomi,
        baseMeaning: finalBaseMeaning,
        isJukugo: finalIsJukugo,
        border: finalBorder,
        moduleId: targetModuleId,
      },
    });

    // Update Example Sentences if provided
    if (examples !== undefined) {
      await prisma.exampleSentence.deleteMany({ where: { kanjiId } });
      if (Array.isArray(examples) && examples.length > 0) {
        await prisma.exampleSentence.createMany({
          data: examples.map((ex: any) => ({
            kanjiId,
            japanese: ex.japanese || "",
            romaji: ex.romaji || "",
            translation: ex.translation || "",
            isReading: !!ex.isReading,
          })),
        });
      }
    }

    // Update Jukugos if provided
    if (jukugos !== undefined) {
      await prisma.jukugo.deleteMany({ where: { kanjiId } });
      if (Array.isArray(jukugos) && jukugos.length > 0) {
        await prisma.jukugo.createMany({
          data: jukugos.map((j: any) => ({
            kanjiId,
            word: j.word || "",
            reading: j.reading || "",
            meaning: j.meaning || "",
          })),
        });
      }
    }

    // Update SemanticRelations if provided
    if (semanticRelations !== undefined) {
      await prisma.semanticRelation.deleteMany({ where: { kanjiId } });
      if (Array.isArray(semanticRelations) && semanticRelations.length > 0) {
        await prisma.semanticRelation.createMany({
          data: semanticRelations.map((sr: any) => ({
            kanjiId,
            ...parseSemanticRelationFields(sr),
          })),
        });
      }
    }

    // Update Quizzes if provided
    if (quizzes !== undefined || quizQuestions !== undefined || quizData !== undefined) {
      await prisma.quiz.deleteMany({ where: { kanjiId } });
      const rawQuizzes = Array.isArray(quizzes)
        ? quizzes
        : Array.isArray(quizQuestions)
        ? quizQuestions
        : typeof quizData === "string"
        ? (() => {
            try {
              return JSON.parse(quizData);
            } catch (e) {
              return [];
            }
          })()
        : [];

      if (Array.isArray(rawQuizzes) && rawQuizzes.length > 0) {
        await prisma.quiz.createMany({
          data: prepareQuizForDb(kanjiId, rawQuizzes),
        });
      }
    }

    // Update Graph Edges if provided
    if (graphEdges !== undefined) {
      const edgeIds = Array.isArray(graphEdges) ? graphEdges.map((e: any) => e.id).filter(Boolean) : [];
      await prisma.kanjiGraphEdge.deleteMany({
        where: {
          OR: [
            { kanjiId },
            ...(edgeIds.length > 0 ? [{ id: { in: edgeIds } }] : []),
          ],
        },
      });

      if (Array.isArray(graphEdges) && graphEdges.length > 0) {
        await prisma.kanjiGraphEdge.createMany({
          data: graphEdges.map((e: any) => ({
            id: e.id,
            kanjiId,
            source: e.source || "",
            target: e.target || "",
            predicate: e.predicate || e.label || null,
          })),
        });
      }
    }

    // Save MasterRefleksi if provided
    if (reflectionData !== undefined || masterRefleksi !== undefined) {
      await saveMasterRefleksiForKanji(kanjiId, reflectionData || masterRefleksi);
    }

    const fullKanji = await prisma.kanji.findUnique({
      where: { id: kanjiId },
      include: {
        examples: true,
        graphEdges: true,
        module: true,
        jukugos: true,
        semanticRelations: true,
        masterRefleksi: true,
        quizzes: { orderBy: { type: "asc" } },
      },
    });

    const formattedQuizList = fullKanji?.quizzes.map(formatQuizFromDb) || [];
    const refQuestions = fullKanji?.masterRefleksi.map(mr => mr.question) || [];
    const dynamicGraph = await buildDynamicKanjiGraph(kanjiId);

    res.json({
      ...fullKanji,
      graphNodes: dynamicGraph.nodes,
      graphEdges: dynamicGraph.edges,
      quizzes: formattedQuizList,
      quizData: JSON.stringify(formattedQuizList),
      masterRefleksi: fullKanji?.masterRefleksi || [],
      reflectionData: JSON.stringify(refQuestions)
    });
  } catch (error: any) {
    console.error("Admin updateKanji error:", error);
    res.status(500).json({ error: error.message || "Gagal memperbarui kanji." });
  }
};

export const deleteKanji = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const kanjiId = parseInt(id, 10);

    // Delete associated relations first due to constraints
    await prisma.userKanjiProgress.deleteMany({ where: { kanjiId } });
    await prisma.exampleSentence.deleteMany({ where: { kanjiId } });
    await prisma.kanjiGraphEdge.deleteMany({ where: { kanjiId } });

    await prisma.kanji.delete({
      where: { id: kanjiId },
    });

    res.json({ message: "Kanji berhasil dihapus." });
  } catch (error: any) {
    console.error("Admin deleteKanji error:", error);
    res.status(500).json({ error: "Gagal menghapus kanji." });
  }
};
