import { Router, Request, Response } from "express";
import https from "https";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const router = Router();

// Direktori cache audio
const CACHE_DIR = path.join(__dirname, "../../uploads/tts_cache");
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Helper untuk mendownload audio dari Google Translate TTS
function fetchGoogleTts(text: string): Promise<Buffer> {
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

router.get("/", async (req: Request, res: Response) => {
  try {
    const rawText = (req.query.text as string) || "";
    const targetText = rawText.trim();

    if (!targetText) {
      return res.status(400).json({ error: "Parameter 'text' diperlukan." });
    }

    // Batasi panjang teks untuk keamanan
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

    // Simpan ke disk cache secara aman (tulis ke temp lalu rename)
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

export default router;
