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

export const getKanjis = async (req: Request, res: Response) => {
  try {
    const kanjis = await prisma.kanji.findMany({
      include: {
        examples: true,
        graphNodes: true,
        graphEdges: true,
        module: true,
        jukugos: true,
        etymologies: true,
      },
      orderBy: { id: "asc" },
    });
    res.json(kanjis);
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
      jlpt,
      bushuu,
      strokeCount,
      onyomi,
      kunyomi,
      baseMeaning,
      isJukugo,
      border,
      moduleId,
      examples,
      jukugos,
      graphNodes,
      graphEdges,
      etymologies,
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
        jlpt: jlpt || null,
        bushuu: bushuu || null,
        strokeCount: strokeCount ? parseInt(strokeCount, 10) : null,
        onyomi: onyomi || null,
        kunyomi: kunyomi || null,
        baseMeaning: baseMeaning || null,
        isJukugo: !!isJukugo,
        border: border || null,
        moduleId: moduleId ? parseInt(moduleId, 10) : null,
        quizData: quizData || null,
        reflectionData: reflectionData || null,
      },
    });

    // Create examples
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
          kanjiBreakdown: j.kanjiBreakdown || null,
          explanation: j.explanation || null,
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

    res.status(201).json(kanji);
  } catch (error: any) {
    console.error("Admin createKanji error:", error);
    res.status(500).json({ error: "Gagal membuat kanji baru." });
  }
};

export const updateKanji = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const kanjiId = parseInt(id, 10);
    const body = sanitizeObject(req.body);
    const {
      character,
      romaji,
      meaning,
      jlpt,
      bushuu,
      strokeCount,
      onyomi,
      kunyomi,
      baseMeaning,
      isJukugo,
      border,
      moduleId,
      examples,
      jukugos,
      graphNodes,
      graphEdges,
      etymologies,
      quizData,
      reflectionData,
    } = body;

    if (!character || !romaji || !meaning) {
      return res.status(400).json({ error: "Karakter, romaji, dan arti wajib diisi." });
    }

    // Update Kanji basic info
    const kanji = await prisma.kanji.update({
      where: { id: kanjiId },
      data: {
        character,
        romaji,
        meaning,
        jlpt: jlpt || null,
        bushuu: bushuu || null,
        strokeCount: strokeCount ? parseInt(strokeCount, 10) : null,
        onyomi: onyomi || null,
        kunyomi: kunyomi || null,
        baseMeaning: baseMeaning || null,
        isJukugo: !!isJukugo,
        border: border || null,
        moduleId: moduleId ? parseInt(moduleId, 10) : null,
        quizData: quizData || null,
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
          kanjiBreakdown: j.kanjiBreakdown || null,
          explanation: j.explanation || null,
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

    // Update Graph Nodes: Delete and Re-create
    await prisma.kanjiGraphNode.deleteMany({ where: { kanjiId } });
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

    // Update Graph Edges: Delete and Re-create
    await prisma.kanjiGraphEdge.deleteMany({ where: { kanjiId } });
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

    res.json(kanji);
  } catch (error: any) {
    console.error("Admin updateKanji error:", error);
    res.status(500).json({ error: "Gagal memperbarui kanji." });
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
