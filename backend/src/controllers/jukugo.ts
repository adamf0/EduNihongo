import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper to extract CJK Kanji characters from a word string
function extractKanjiCharacters(text: string): string[] {
  if (!text) return [];
  const matches = text.match(/[\u4e00-\u9faf\u3400-\u4dbf]/g);
  if (!matches) return [];
  return Array.from(new Set(matches));
}

// Ensure all single kanji in a jukugo word exist in Kanji table with moduleId = null if missing
async function ensureSingleKanjiExist(word: string) {
  const characters = extractKanjiCharacters(word);
  for (const char of characters) {
    const existing = await prisma.kanji.findUnique({
      where: { character: char }
    });

    if (!existing) {
      console.log(`Kanji tunggal '${char}' belum ada di database, menginsert dengan moduleId = null...`);
      await prisma.kanji.create({
        data: {
          character: char,
          romaji: "",
          meaning: "",
          baseMeaning: "",
          bushuu: "",
          onyomi: "",
          kunyomi: "",
          moduleId: null
        }
      });
    }
  }
}

// Helper to resolve MasterCategory ID from name or ID
async function resolveCategoryId(catInput: string | number): Promise<number> {
  if (typeof catInput === "number") {
    return catInput;
  }
  const catName = catInput.trim();
  let masterCat = await prisma.masterCategory.findUnique({
    where: { name: catName }
  });
  if (!masterCat) {
    masterCat = await prisma.masterCategory.create({
      data: { name: catName, description: `Kategori ${catName}` }
    });
  }
  return masterCat.id;
}

// GET /api/admin/jukugos
export const getJukugos = async (req: Request, res: Response) => {
  try {
    const jukugos = await prisma.jukugo.findMany({
      include: {
        kanji: {
          select: {
            id: true,
            character: true,
            romaji: true,
            meaning: true,
            moduleId: true
          }
        },
        kategoriKanji: {
          include: {
            category: true
          }
        }
      },
      orderBy: { id: "desc" }
    });

    const formatted = jukugos.map((j) => ({
      ...j,
      categories: j.kategoriKanji.map((k) => k.category.name),
      extractedKanji: extractKanjiCharacters(j.word)
    }));

    res.json(formatted);
  } catch (error: any) {
    console.error("Error fetching jukugos:", error);
    res.status(500).json({ error: error?.message || "Gagal mengambil data Jukugo." });
  }
};

// POST /api/admin/jukugos
export const createJukugo = async (req: Request, res: Response) => {
  try {
    const { kanjiId, word, reading, meaning, categories } = req.body;

    if (!word || !reading || !meaning || !kanjiId || !categories || (Array.isArray(categories) && categories.length === 0)) {
      return res.status(400).json({ error: "Kanji ID, kata, cara baca, arti, dan Kategori Semantik wajib diisi." });
    }

    const targetKanjiId = parseInt(kanjiId, 10);
    const parentKanji = await prisma.kanji.findUnique({ where: { id: targetKanjiId } });
    if (!parentKanji) {
      return res.status(404).json({ error: `Kanji dengan ID ${targetKanjiId} tidak ditemukan.` });
    }

    // 1. Split word into single kanji characters and insert missing ones to Kanji table (moduleId = null)
    await ensureSingleKanjiExist(word.trim());

    // 2. Create Jukugo record
    const jukugo = await prisma.jukugo.create({
      data: {
        kanjiId: targetKanjiId,
        word: word.trim(),
        reading: reading.trim(),
        meaning: meaning.trim()
      }
    });

    // 3. Create KategoriKanji entries using normalized MasterCategory.id
    const categoryList: (string | number)[] = Array.isArray(categories)
      ? categories
      : typeof categories === "string"
        ? categories.split(",").map((c) => c.trim()).filter(Boolean)
        : ["Kombinasi Utama"];

    if (categoryList.length === 0) categoryList.push("Kombinasi Utama");

    const categoryNames: string[] = [];
    for (const catInput of categoryList) {
      const categoryId = await resolveCategoryId(catInput);
      await prisma.kategoriKanji.create({
        data: {
          categoryId: categoryId,
          jokugoId: jukugo.id
        }
      });
      const masterCat = await prisma.masterCategory.findUnique({ where: { id: categoryId } });
      if (masterCat) categoryNames.push(masterCat.name);
    }

    const fullJukugo = await prisma.jukugo.findUnique({
      where: { id: jukugo.id },
      include: {
        kanji: true,
        kategoriKanji: { include: { category: true } }
      }
    });

    res.status(201).json({
      ...fullJukugo,
      categories: categoryNames,
      extractedKanji: extractKanjiCharacters(word)
    });
  } catch (error: any) {
    console.error("Error creating jukugo:", error);
    res.status(500).json({ error: error?.message || "Gagal membuat data Jukugo." });
  }
};

// PUT /api/admin/jukugos/:id
export const updateJukugo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { kanjiId, word, reading, meaning, categories } = req.body;

    const jukugoId = parseInt(id, 10);
    const existingJukugo = await prisma.jukugo.findUnique({ where: { id: jukugoId } });
    if (!existingJukugo) {
      return res.status(404).json({ error: "Data Jukugo tidak ditemukan." });
    }

    const targetKanjiId = kanjiId ? parseInt(kanjiId, 10) : existingJukugo.kanjiId;
    const updatedWord = word ? word.trim() : existingJukugo.word;

    // 1. Split word into single kanji characters and insert missing ones to Kanji table (moduleId = null)
    await ensureSingleKanjiExist(updatedWord);

    // 2. Update Jukugo record
    await prisma.jukugo.update({
      where: { id: jukugoId },
      data: {
        kanjiId: targetKanjiId,
        word: updatedWord,
        reading: reading ? reading.trim() : existingJukugo.reading,
        meaning: meaning ? meaning.trim() : existingJukugo.meaning
      }
    });

    // 3. Update KategoriKanji entries if provided
    if (categories !== undefined) {
      await prisma.kategoriKanji.deleteMany({ where: { jokugoId: jukugoId } });

      const categoryList: (string | number)[] = Array.isArray(categories)
        ? categories
        : typeof categories === "string"
          ? categories.split(",").map((c) => c.trim()).filter(Boolean)
          : ["Kombinasi Utama"];

      if (categoryList.length === 0) categoryList.push("Kombinasi Utama");

      for (const catInput of categoryList) {
        const categoryId = await resolveCategoryId(catInput);
        await prisma.kategoriKanji.create({
          data: {
            categoryId: categoryId,
            jokugoId: jukugoId
          }
        });
      }
    }

    const fullJukugo = await prisma.jukugo.findUnique({
      where: { id: jukugoId },
      include: {
        kanji: true,
        kategoriKanji: { include: { category: true } }
      }
    });

    const categoryNames = fullJukugo?.kategoriKanji.map((k) => k.category.name) || [];

    res.json({
      ...fullJukugo,
      categories: categoryNames,
      extractedKanji: extractKanjiCharacters(updatedWord)
    });
  } catch (error: any) {
    console.error("Error updating jukugo:", error);
    res.status(500).json({ error: error?.message || "Gagal mengupdate data Jukugo." });
  }
};

// DELETE /api/admin/jukugos/:id
export const deleteJukugo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const jukugoId = parseInt(id, 10);

    const existingJukugo = await prisma.jukugo.findUnique({ where: { id: jukugoId } });
    if (!existingJukugo) {
      return res.status(404).json({ error: "Data Jukugo tidak ditemukan." });
    }

    await prisma.jukugo.delete({ where: { id: jukugoId } });
    res.json({ message: "Jukugo berhasil dihapus." });
  } catch (error: any) {
    console.error("Error deleting jukugo:", error);
    res.status(500).json({ error: error?.message || "Gagal menghapus data Jukugo." });
  }
};
