import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Seed initial categories if table is empty
async function ensureInitialCategories() {
  const count = await prisma.masterCategory.count();
  if (count === 0) {
    const defaults = [
      { name: "Kombinasi Utama", description: "Kategori gabungan kanji utama" },
      { name: "Aktivitas Pengujian", description: "Kategori pengujian dan tes" },
      { name: "Konsumsi", description: "Kategori makanan dan minuman" },
      { name: "Ekonomi & Bisnis", description: "Kategori perdagangan dan keuangan" },
      { name: "Pendidikan & Sains", description: "Kategori ilmu pengetahuan dan sekolah" },
      { name: "Alam & Lingkungan", description: "Kategori cuaca, flora, dan fauna" },
    ];
    for (const d of defaults) {
      await prisma.masterCategory.create({ data: d });
    }
  }
}

// GET /api/admin/categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    await ensureInitialCategories();
    const categories = await prisma.masterCategory.findMany({
      orderBy: { id: "asc" },
    });
    res.json(categories);
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: error?.message || "Gagal mengambil data kategori." });
  }
};

// POST /api/admin/categories
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Nama kategori wajib diisi." });
    }

    const existing = await prisma.masterCategory.findUnique({
      where: { name: name.trim() },
    });
    if (existing) {
      return res.status(400).json({ error: "Kategori dengan nama tersebut sudah ada." });
    }

    const newCategory = await prisma.masterCategory.create({
      data: {
        name: name.trim(),
        description: description ? description.trim() : null,
      },
    });

    res.status(201).json(newCategory);
  } catch (error: any) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: error?.message || "Gagal membuat kategori." });
  }
};

// PUT /api/admin/categories/:id
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const categoryId = parseInt(id, 10);

    const existing = await prisma.masterCategory.findUnique({
      where: { id: categoryId },
    });
    if (!existing) {
      return res.status(404).json({ error: "Kategori tidak ditemukan." });
    }

    const updatedName = name ? name.trim() : existing.name;

    // Check duplicate name if name changed
    if (updatedName !== existing.name) {
      const dup = await prisma.masterCategory.findUnique({ where: { name: updatedName } });
      if (dup) {
        return res.status(400).json({ error: "Nama kategori sudah digunakan." });
      }
    }

    const updated = await prisma.masterCategory.update({
      where: { id: categoryId },
      data: {
        name: updatedName,
        description: description !== undefined ? description?.trim() : existing.description,
      },
    });

    res.json(updated);
  } catch (error: any) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: error?.message || "Gagal mengupdate kategori." });
  }
};

// DELETE /api/admin/categories/:id
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const categoryId = parseInt(id, 10);

    const existing = await prisma.masterCategory.findUnique({
      where: { id: categoryId },
    });
    if (!existing) {
      return res.status(404).json({ error: "Kategori tidak ditemukan." });
    }

    await prisma.masterCategory.delete({ where: { id: categoryId } });
    res.json({ message: "Kategori berhasil dihapus." });
  } catch (error: any) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: error?.message || "Gagal menghapus kategori." });
  }
};
