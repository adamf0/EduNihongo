import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function extractAndInsertKanji() {
  console.log("=== Memulai proses ekstraksi Kanji tunggal dari Jukugo ===");

  // 1. Ambil semua data Jukugo (kolom word)
  const allJukugos = await prisma.jukugo.findMany({
    select: { word: true },
  });

  console.log(`Ditemukan ${allJukugos.length} data Jukugo di database.`);

  // 2. Ambil semua Kanji yang sudah ada di tabel Kanji
  const existingKanjis = await prisma.kanji.findMany({
    select: { character: true },
  });
  const existingKanjiSet = new Set(existingKanjis.map((k) => k.character));
  console.log(`Jumlah Kanji tunggal yang sudah ada di tabel Kanji: ${existingKanjiSet.size}`);

  // 3. Pecah setiap kata Jukugo menjadi karakter Kanji tunggal
  const extractedKanjiSet = new Set<string>();
  const kanjiRegex = /\p{Script=Han}/u;

  for (const jukugo of allJukugos) {
    if (!jukugo.word) continue;
    for (const char of jukugo.word) {
      if (kanjiRegex.test(char)) {
        extractedKanjiSet.add(char);
      }
    }
  }

  console.log(`Total karakter Kanji tunggal unik dari seluruh Jukugo: ${extractedKanjiSet.size}`);

  // 4. Filter Kanji yang belum ada di tabel Kanji
  const missingKanjis = Array.from(extractedKanjiSet).filter(
    (char) => !existingKanjiSet.has(char)
  );

  console.log(`Jumlah Kanji baru yang perlu di-insert: ${missingKanjis.length}`);

  if (missingKanjis.length === 0) {
    console.log("Semua Kanji tunggal dari Jukugo sudah ada di tabel Kanji. Tidak ada data yang di-insert.");
    return;
  }

  // 5. Insert Kanji baru dengan moduleId = null
  let insertedCount = 0;
  for (const char of missingKanjis) {
    await prisma.kanji.create({
      data: {
        character: char,
        romaji: "-",
        meaning: "-",
        isJukugo: false,
        moduleId: null,
      },
    });
    insertedCount++;
  }

  console.log(`Berhasil memasukkan ${insertedCount} Kanji baru ke tabel edunihongoalt.Kanji dengan moduleId = null.`);
}

extractAndInsertKanji()
  .catch((e) => {
    console.error("Gagal mengeksekusi ekstraksi Kanji:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
