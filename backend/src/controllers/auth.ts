import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-kanjigraph-key-12345";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Email, password, dan nama wajib diisi." });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email sudah terdaftar." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        name,
        // Set default values matching Haruki Sato's starter kit
        level: "N3",
        levelName: "Gerbang Besi",
        streak: 0,
        totalXp: 0,
        rank: "Pemula",
        masteryReading: 0,
        masteryWriting: 0,
        masteryVocabulary: 0,
      },
    });

    // Create default user progress entries for modules & kanji
    // Modules default
    const modules = await prisma.module.findMany();
    for (const mod of modules) {
      await prisma.userModuleProgress.create({
        data: {
          userId: user.id,
          moduleId: mod.id,
          isCompleted: false,
          isLocked: mod.category === "VOCABULARY", // lock vocabulary by default
          progressPercent: 0,
        },
      });
    }

    // Kanji default progress
    const kanjiList = await prisma.kanji.findMany();
    for (const k of kanjiList) {
      await prisma.userKanjiProgress.create({
        data: {
          userId: user.id,
          kanjiId: k.id,
          masteryPercent: 0,
          status: "LEARNING",
          mistakeCount: 0,
        },
      });
    }

    // Token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(201).json({
      message: "Registrasi berhasil.",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        level: user.level,
        levelName: user.levelName,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat registrasi." });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email dan password wajib diisi." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Email atau password salah." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Email atau password salah." });
    }

    // Token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({
      message: "Login berhasil.",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        level: user.level,
        levelName: user.levelName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat login." });
  }
};
