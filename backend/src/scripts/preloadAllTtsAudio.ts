import { PrismaClient } from "@prisma/client";
import { preloadTexts } from "../routes/tts";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Memulai proses preload seluruh audio TTS (Latihan Membaca, Jukugo, dan Karakter Kanji)...");
  console.log("ℹ️ Karakter yang dibaca adalah Kanji asli (bukan onyomi, bushu, ataupun kunyomi).");

  const startTime = Date.now();

  // 1. Ambil seluruh kanji
  const allKanjis = await prisma.kanji.findMany({
    select: { character: true },
  });

  // 2. Ambil seluruh jukugo
  const allJukugos = await prisma.jukugo.findMany({
    select: { word: true },
  });

  // 3. Ambil seluruh contoh kalimat latihan membaca
  const allExamples = await prisma.exampleSentence.findMany({
    select: { japanese: true },
  });

  const kanjiTexts = allKanjis.map((k) => k.character?.trim()).filter(Boolean);
  const jukugoTexts = allJukugos.map((j) => j.word?.trim()).filter(Boolean);
  const exampleTexts = allExamples.map((e) => e.japanese?.trim()).filter(Boolean);

  const allTexts = [...kanjiTexts, ...jukugoTexts, ...exampleTexts];

  console.log(`📊 Statistik teks database:`);
  console.log(`   - Karakter Kanji unik: ${new Set(kanjiTexts).size}`);
  console.log(`   - Kata Jukugo unik: ${new Set(jukugoTexts).size}`);
  console.log(`   - Contoh Kalimat (Latihan Membaca) unik: ${new Set(exampleTexts).size}`);
  console.log(`   - Total Teks Unik untuk di-cache: ${new Set(allTexts).size}`);

  console.log(`\n⏳ Mengunduh dan menyimpan ke /backend/uploads/tts_cache...`);
  const result = await preloadTexts(allTexts, false, 5);

  const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n🎉 SELESAI dalam ${elapsedSec} detik!`);
  console.log(`   - Total Teks: ${result.total}`);
  console.log(`   - Sudah ada di cache (HIT): ${result.alreadyCached}`);
  console.log(`   - Baru dibuat (MISS -> Saved): ${result.newlyCreated}`);
  console.log(`   - Gagal: ${result.failed}`);
}

main()
  .catch((e) => {
    console.error("Error saat preload audio TTS:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
