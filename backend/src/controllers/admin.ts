import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sanitizeObject } from "../utils/sanitize";

const prisma = new PrismaClient();

// ================= MODULE CRUD =================

export const getModules = async (req: Request, res: Response) => {
  try {
    const modules = await prisma.module.findMany({
      include: { kanjis: true },
      orderBy: { id: "asc" },
    });
    res.json(modules);
  } catch (error: any) {
    console.error("Admin getModules error:", error);
    res.status(500).json({ error: "Gagal mengambil data modul." });
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

const formatQuizFromDb = (q: any) => {
  const parseJsonOrRaw = (val: any) => {
    if (!val) return val;
    if (typeof val === "string" && (val.startsWith("[") || val.startsWith("{"))) {
      try {
        return JSON.parse(val);
      } catch (e) {
        return val;
      }
    }
    return val;
  };

  const parsedOptions = parseJsonOrRaw(q.options);
  const parsedCorrectAnswer = parseJsonOrRaw(q.correctAnswer);

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
    words: parseJsonOrRaw(q.words),
    correctOrder: parseJsonOrRaw(q.correctOrder),
    targetWord: q.targetWord || "",
    leftItems: parseJsonOrRaw(q.leftItems),
    rightItems: parseJsonOrRaw(q.rightItems),
    pairs: parseJsonOrRaw(q.pairs),
    groups: parseJsonOrRaw(q.groups),
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

    return {
      kanjiId,
      type: q.type || "multiple",
      question: q.question || "",
      options: stringifyIfNeeded(opts),
      correctAnswer: stringifyIfNeeded(q.correctAnswer),
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

export const getKanjis = async (req: Request, res: Response) => {
  try {
    const kanjis = await prisma.kanji.findMany({
      include: {
        examples: true,
        graphNodes: true,
        graphEdges: true,
        module: true,
        jukugos: true,
        semanticRelations: true,
        etymologies: true,
        quizzes: true,
      },
      orderBy: { id: "asc" },
    });

    const formatted = kanjis.map((k) => {
      const quizQuestions = k.quizzes.map(formatQuizFromDb);

      return {
        ...k,
        quizData: JSON.stringify(quizQuestions),
        quizzes: quizQuestions,
      };
    });

    res.json(formatted);
  } catch (error: any) {
    console.error("Admin getKanjis error:", error);
    res.status(500).json({ error: "Gagal mengambil data kanji." });
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
        reflectionData: reflectionData || null,
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

    // Create Etymologies
    if (Array.isArray(etymologies) && etymologies.length > 0) {
      await prisma.etymology.createMany({
        data: etymologies.map((et: any) => ({
          kanjiId: kanji.id,
          character: et.character || "",
          romaji: et.romaji || "",
          detail: et.detail || "",
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

    // Create Graph Nodes
    if (Array.isArray(graphNodes) && graphNodes.length > 0) {
      await prisma.kanjiGraphNode.createMany({
        data: graphNodes.map((n: any) => ({
          id: n.id,
          kanjiId: kanji.id,
          character: n.character || "",
          meaning: n.meaning || "",
          type: n.type || "root",
          borderColor: n.borderColor || null,
          isPill: !!n.isPill,
          parentPill: n.parentPill || null,
        })),
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

    const fullKanji = await prisma.kanji.findUnique({
      where: { id: kanji.id },
      include: {
        examples: true,
        graphNodes: true,
        graphEdges: true,
        module: true,
        jukugos: true,
        semanticRelations: true,
        etymologies: true,
        quizzes: true,
      },
    });

    const formattedQuizList = fullKanji?.quizzes.map(formatQuizFromDb) || [];

    res.status(201).json({
      ...fullKanji,
      quizData: JSON.stringify(formattedQuizList),
      quizzes: formattedQuizList,
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
    const { id } = req.params;
    const kanjiId = parseInt(id, 10);

    const existingKanji = await prisma.kanji.findUnique({ where: { id: kanjiId } });
    if (!existingKanji) {
      return res.status(404).json({ error: `Karakter Kanji dengan ID ${kanjiId} tidak ditemukan. Silakan refresh halaman admin.` });
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
    } = body;

    if (!character || !romaji || !meaning) {
      return res.status(400).json({ error: "Karakter, romaji, dan arti wajib diisi." });
    }

    // Verify moduleId exists if provided
    let targetModuleId: number | null = null;
    if (moduleId !== undefined && moduleId !== null) {
      const parsedMod = typeof moduleId === "number" ? moduleId : parseInt(moduleId, 10);
      if (!isNaN(parsedMod)) {
        const existingMod = await prisma.module.findUnique({ where: { id: parsedMod } });
        if (existingMod) {
          targetModuleId = parsedMod;
        }
      }
    }

    // Update Kanji basic info
    const kanji = await prisma.kanji.update({
      where: { id: kanjiId },
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
        moduleId: targetModuleId,
        reflectionData: reflectionData || null,
      },
    });

    // Update Example Sentences: Delete and Re-create
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

    // Update Jukugos: Delete and Re-create
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

    // Update SemanticRelations: Delete and Re-create
    await prisma.semanticRelation.deleteMany({ where: { kanjiId } });
    if (Array.isArray(semanticRelations) && semanticRelations.length > 0) {
      await prisma.semanticRelation.createMany({
        data: semanticRelations.map((sr: any) => ({
          kanjiId,
          ...parseSemanticRelationFields(sr),
        })),
      });
    }

    // Update Etymologies: Delete and Re-create
    await prisma.etymology.deleteMany({ where: { kanjiId } });
    if (Array.isArray(etymologies) && etymologies.length > 0) {
      await prisma.etymology.createMany({
        data: etymologies.map((et: any) => ({
          kanjiId,
          character: et.character || "",
          romaji: et.romaji || "",
          detail: et.detail || "",
        })),
      });
    }

    // Update Quizzes: Delete and Re-create in Quiz table
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

    // Update Graph Edges FIRST (to prevent foreign key/duplicate ID constraints)
    const edgeIds = Array.isArray(graphEdges) ? graphEdges.map((e: any) => e.id).filter(Boolean) : [];
    await prisma.kanjiGraphEdge.deleteMany({
      where: {
        OR: [
          { kanjiId },
          ...(edgeIds.length > 0 ? [{ id: { in: edgeIds } }] : []),
        ],
      },
    });

    // Update Graph Nodes (by kanjiId OR target node IDs)
    const nodeIds = Array.isArray(graphNodes) ? graphNodes.map((n: any) => n.id).filter(Boolean) : [];
    await prisma.kanjiGraphNode.deleteMany({
      where: {
        OR: [
          { kanjiId },
          ...(nodeIds.length > 0 ? [{ id: { in: nodeIds } }] : []),
        ],
      },
    });

    // Create Graph Nodes
    if (Array.isArray(graphNodes) && graphNodes.length > 0) {
      await prisma.kanjiGraphNode.createMany({
        data: graphNodes.map((n: any) => ({
          id: n.id,
          kanjiId,
          character: n.character || "",
          meaning: n.meaning || "",
          type: n.type || "root",
          borderColor: n.borderColor || null,
          isPill: !!n.isPill,
          parentPill: n.parentPill || null,
        })),
      });
    }

    // Create Graph Edges
    if (Array.isArray(graphEdges) && graphEdges.length > 0) {
      await prisma.kanjiGraphEdge.createMany({
        data: graphEdges.map((e: any) => ({
          id: e.id,
          kanjiId,
          source: e.source || "",
          target: e.target || "",
        })),
      });
    }

    const fullKanji = await prisma.kanji.findUnique({
      where: { id: kanjiId },
      include: {
        examples: true,
        graphNodes: true,
        graphEdges: true,
        module: true,
        jukugos: true,
        semanticRelations: true,
        etymologies: true,
        quizzes: true,
      },
    });

    const formattedQuizList = fullKanji?.quizzes.map(formatQuizFromDb) || [];

    res.json({
      ...fullKanji,
      quizData: JSON.stringify(formattedQuizList),
      quizzes: formattedQuizList,
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
    await prisma.kanjiGraphNode.deleteMany({ where: { kanjiId } });
    await prisma.kanjiGraphEdge.deleteMany({ where: { kanjiId } });
    await prisma.etymology.deleteMany({ where: { kanjiId } });

    await prisma.kanji.delete({
      where: { id: kanjiId },
    });

    res.json({ message: "Kanji berhasil dihapus." });
  } catch (error: any) {
    console.error("Admin deleteKanji error:", error);
    res.status(500).json({ error: "Gagal menghapus kanji." });
  }
};
