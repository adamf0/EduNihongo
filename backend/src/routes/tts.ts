import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import https from "https";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const router = Router();
const prisma = new PrismaClient();

// Direktori cache audio
const CACHE_DIR = path.join(__dirname, "../../uploads/tts_cache");
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Helper untuk mendownload audio dari Google Translate TTS
export function fetchGoogleTts(text: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      text
    )}&tl=ja&client=tw-ob`;

    const req = https.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "*/*",
        },
      },
      (res) => {
        if (res.statusCode !== 200) {
          return reject(
            new Error(
              `Google Translate TTS mengembalikan status ${res.statusCode}`
            )
          );
        }

        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const buffer = Buffer.concat(chunks);
          if (buffer.length === 0) {
            return reject(new Error("Audio kosong diterima dari Google TTS"));
          }
          resolve(buffer);
        });
      }
    );

    req.on("error", (err) => reject(err));
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error("Timeout saat menghubungi Google Translate TTS"));
    });
  });
}

// Fungsi pembantu untuk preload array teks dengan concurrency pool
export async function preloadTexts(
  texts: string[],
  force = false,
  concurrency = 4
): Promise<{ total: number; alreadyCached: number; newlyCreated: number; failed: number }> {
  let alreadyCached = 0;
  let newlyCreated = 0;
  let failed = 0;

  // Deduplikasi teks dan filter teks kosong
  const uniqueTexts = Array.from(
    new Set(texts.map((t) => (t || "").trim()).filter((t) => t.length > 0))
  );

  let currentIndex = 0;

  const worker = async () => {
    while (currentIndex < uniqueTexts.length) {
      const idx = currentIndex++;
      const text = uniqueTexts[idx];
      const hash = crypto.createHash("md5").update(text).digest("hex");
      const filePath = path.join(CACHE_DIR, `${hash}.mp3`);

      if (!force && fs.existsSync(filePath)) {
        alreadyCached++;
        continue;
      }

      try {
        const audioBuffer = await fetchGoogleTts(text);
        const tempPath = path.join(CACHE_DIR, `${hash}.tmp_${Date.now()}`);
        fs.writeFileSync(tempPath, audioBuffer);
        fs.renameSync(tempPath, filePath);
        newlyCreated++;
        // Jeda kecil untuk menjaga traffic tetap stabil
        await new Promise((r) => setTimeout(r, 40));
      } catch (err) {
        console.error(`Gagal preload audio untuk "${text}":`, err);
        failed++;
      }
    }
  };

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);

  return {
    total: uniqueTexts.length,
    alreadyCached,
    newlyCreated,
    failed,
  };
}

/**
 * GET /api/tts
 * Memutar audio teks kanji atau kalimat bahasa Jepang secara langsung
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const rawText = (req.query.text as string) || "";
    const targetText = rawText.trim();

    if (!targetText) {
      return res.status(400).json({ error: "Parameter 'text' diperlukan." });
    }

    if (targetText.length > 500) {
      return res.status(400).json({ error: "Teks terlalu panjang (maksimum 500 karakter)." });
    }

    const hash = crypto.createHash("md5").update(targetText).digest("hex");
    const cachedFilePath = path.join(CACHE_DIR, `${hash}.mp3`);

    // 1. Cek disk cache
    if (fs.existsSync(cachedFilePath)) {
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.setHeader("X-TTS-Cache", "HIT");
      return res.sendFile(cachedFilePath);
    }

    // 2. Fetch dari Google Translate TTS dengan teks asli (kanji / kalimat Jepang)
    const audioBuffer = await fetchGoogleTts(targetText);

    // Simpan ke disk cache secara aman
    const tempPath = path.join(CACHE_DIR, `${hash}.tmp_${Date.now()}`);
    fs.writeFileSync(tempPath, audioBuffer);
    fs.renameSync(tempPath, cachedFilePath);

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.setHeader("X-TTS-Cache", "MISS");
    return res.send(audioBuffer);
  } catch (error: any) {
    console.error("TTS Proxy Error:", error);
    return res.status(500).json({
      error: "Gagal memproses audio TTS",
      message: error?.message || "Unknown error",
    });
  }
});

/**
 * GET & POST /api/tts/preload
 * Endpoint untuk membuat dan mem-preload seluruh audio latihan membaca, jukugo, dan karakter kanji
 * (Murni membaca karakter Kanji asli, bukan bushu, onyomi, atau kunyomi)
 */
const handlePreload = async (req: Request, res: Response) => {
  try {
    const moduleIdParam = req.query.moduleId || req.body?.moduleId;
    const charParam = req.query.character || req.body?.character;
    const scopeParam = (req.query.scope || req.body?.scope || "all") as string;
    const forceParam = (req.query.force === "true" || req.body?.force === true);

    const whereKanji: any = {};
    if (moduleIdParam) {
      whereKanji.moduleId = Number(moduleIdParam);
    } else if (scopeParam === "module") {
      whereKanji.moduleId = { not: null };
    }

    if (charParam) {
      whereKanji.character = String(charParam);
    }

    console.log("Memulai pengumpulan teks untuk preload audio TTS...", { whereKanji, scopeParam });

    // 1. Ambil kanji sesuai kriteria
    const kanjis = await prisma.kanji.findMany({
      where: whereKanji,
      include: {
        jukugos: true,
        examples: true,
      },
    });

    const kanjiTexts: string[] = [];
    const jukugoTexts: string[] = [];
    const exampleTexts: string[] = [];

    kanjis.forEach((k) => {
      // Kanji itu sendiri (bukan bushu, bukan onyomi, bukan kunyomi)
      if (k.character) kanjiTexts.push(k.character.trim());

      // Seluruh kata jukugo
      k.jukugos.forEach((j) => {
        if (j.word) jukugoTexts.push(j.word.trim());
      });

      // Seluruh kalimat latihan membaca (ExampleSentence)
      k.examples.forEach((e) => {
        if (e.japanese) exampleTexts.push(e.japanese.trim());
      });
    });

    // Jika scope "all" dan tidak ada filter tertentu, pastikan seluruh Jukugo dan ExampleSentence di DB ikut tercakup
    if (scopeParam === "all" && !moduleIdParam && !charParam) {
      const allJukugos = await prisma.jukugo.findMany({ select: { word: true } });
      const allExamples = await prisma.exampleSentence.findMany({ select: { japanese: true } });

      allJukugos.forEach((j) => {
        if (j.word) jukugoTexts.push(j.word.trim());
      });
      allExamples.forEach((e) => {
        if (e.japanese) exampleTexts.push(e.japanese.trim());
      });
    }

    const allTexts = [...kanjiTexts, ...jukugoTexts, ...exampleTexts];
    const stats = await preloadTexts(allTexts, forceParam, 4);

    return res.json({
      status: "success",
      message: "Preload audio ke /backend/uploads/tts_cache berhasil dijalankan.",
      summary: {
        totalKanjis: new Set(kanjiTexts).size,
        totalJukugos: new Set(jukugoTexts).size,
        totalLatihanMembaca: new Set(exampleTexts).size,
        totalUniqueTexts: stats.total,
        alreadyCached: stats.alreadyCached,
        newlyCreated: stats.newlyCreated,
        failed: stats.failed,
      },
      cacheDir: CACHE_DIR,
    });
  } catch (error: any) {
    console.error("Gagal menjalankan preload audio TTS:", error);
    return res.status(500).json({
      error: "Gagal menjalankan preload audio TTS",
      message: error?.message || "Unknown error",
    });
  }
};

router.get("/preload", handlePreload);
router.post("/preload", handlePreload);

/**
 * GET /api/tts/cache-status
 * Menampilkan status isi cache folder audio
 */
router.get("/cache-status", (req: Request, res: Response) => {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      return res.json({ totalFiles: 0, totalSizeBytes: 0, cacheDir: CACHE_DIR });
    }
    const files = fs.readdirSync(CACHE_DIR).filter((f) => f.endsWith(".mp3"));
    let totalSizeBytes = 0;
    files.forEach((f) => {
      try {
        const stat = fs.statSync(path.join(CACHE_DIR, f));
        totalSizeBytes += stat.size;
      } catch (e) {
        // ignore
      }
    });

    return res.json({
      totalFiles: files.length,
      totalSizeBytes,
      totalSizeMB: (totalSizeBytes / (1024 * 1024)).toFixed(2) + " MB",
      cacheDir: CACHE_DIR,
    });
  } catch (error: any) {
    return res.status(500).json({ error: "Gagal membaca status cache TTS", message: error?.message });
  }
});

export default router;
