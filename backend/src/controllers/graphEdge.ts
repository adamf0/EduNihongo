import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/admin/graph-edges?kanjiId=X
export const getGraphEdges = async (req: Request, res: Response) => {
  try {
    const { kanjiId } = req.query;

    const where: any = {};
    if (kanjiId) {
      where.kanjiId = parseInt(kanjiId as string, 10);
    }

    const edges = await prisma.kanjiGraphEdge.findMany({
      where,
      include: {
        kanjiRef: {
          select: { id: true, character: true, romaji: true }
        }
      },
      orderBy: { id: "asc" }
    });

    res.json(edges);
  } catch (error: any) {
    console.error("Error fetching graph edges:", error);
    res.status(500).json({ error: error?.message || "Gagal mengambil data KanjiGraphEdge." });
  }
};

// POST /api/admin/graph-edges
export const createGraphEdge = async (req: Request, res: Response) => {
  try {
    const { kanjiId, source, target, predicate } = req.body;

    if (!kanjiId || !source || !target) {
      return res.status(400).json({ error: "kanjiId, source, dan target wajib diisi." });
    }

    const targetKanjiId = parseInt(kanjiId, 10);
    const kanji = await prisma.kanji.findUnique({ where: { id: targetKanjiId } });
    if (!kanji) {
      return res.status(404).json({ error: `Kanji dengan ID ${targetKanjiId} tidak ditemukan.` });
    }

    const trimmedSource = source.trim();
    const trimmedTarget = target.trim();
    const edgeId = `cross-${targetKanjiId}-${trimmedSource}-${trimmedTarget}`;

    // Upsert or create
    const edge = await prisma.kanjiGraphEdge.upsert({
      where: { id: edgeId },
      update: {
        predicate: predicate ? predicate.trim() : null
      },
      create: {
        id: edgeId,
        kanjiId: targetKanjiId,
        source: trimmedSource,
        target: trimmedTarget,
        predicate: predicate ? predicate.trim() : null
      }
    });

    res.status(201).json(edge);
  } catch (error: any) {
    console.error("Error creating graph edge:", error);
    res.status(500).json({ error: error?.message || "Gagal membuat data KanjiGraphEdge." });
  }
};

// PUT /api/admin/graph-edges/:id
export const updateGraphEdge = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { predicate } = req.body;

    const existing = await prisma.kanjiGraphEdge.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "KanjiGraphEdge tidak ditemukan." });
    }

    const updated = await prisma.kanjiGraphEdge.update({
      where: { id },
      data: {
        predicate: predicate !== undefined ? (predicate ? predicate.trim() : null) : existing.predicate
      }
    });

    res.json(updated);
  } catch (error: any) {
    console.error("Error updating graph edge:", error);
    res.status(500).json({ error: error?.message || "Gagal mengupdate data KanjiGraphEdge." });
  }
};

// DELETE /api/admin/graph-edges/:id
export const deleteGraphEdge = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.kanjiGraphEdge.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "KanjiGraphEdge tidak ditemukan." });
    }

    await prisma.kanjiGraphEdge.delete({ where: { id } });
    res.json({ message: "KanjiGraphEdge berhasil dihapus." });
  } catch (error: any) {
    console.error("Error deleting graph edge:", error);
    res.status(500).json({ error: error?.message || "Gagal menghapus data KanjiGraphEdge." });
  }
};
