import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Defined semantic cross-link relationships between Jukugos
const jukugoCrossLinkRules: { word1: string; word2: string; predicate: string }[] = [
  { word1: "起点", word2: "終点", predicate: "berlawanan dengan" },
  { word1: "採点", word2: "点数", predicate: "menghasilkan" },
  { word1: "観点", word2: "視点", predicate: "mirip makna" },
  { word1: "問題点", word2: "点検", predicate: "memerlukan" },
  { word1: "重点", word2: "要点", predicate: "lebih spesifik" },
  { word1: "試着", word2: "試用", predicate: "mirip penggunaan" },
  { word1: "試用", word2: "試乗", predicate: "sejenis uji coba" },
  { word1: "試食", word2: "試飲", predicate: "sejenis uji konsumsi" },
  { word1: "試作", word2: "試作品", predicate: "tahap awal dari" },
  { word1: "試験", word2: "入試", predicate: "jenis dari" },
  { word1: "試験", word2: "受験", predicate: "proses lanjutan" },
  { word1: "経験", word2: "実験", predicate: "penerapan ilmiah" },
  { word1: "質問", word2: "問題", predicate: "berhubungan dengan" },
  { word1: "問題", word2: "宿題", predicate: "bagian dari tugas" },
  { word1: "議題", word2: "論題", predicate: "mirip makna" },
  { word1: "解答", word2: "応答", predicate: "bentuk jawaban" },
];

async function main() {
  console.log("=== Memulai Verifikasi & Seeding KategoriKanji + Graph Edges ===");

  const jukugos = await prisma.jukugo.findMany();
  let createdKategoriEntries = 0;

  // Ensure every Jukugo has at least 1 KategoriKanji entry
  for (const j of jukugos) {
    const existingCatCount = await prisma.kategoriKanji.count({
      where: { jokugoId: j.id }
    });

    if (existingCatCount === 0) {
      let masterCat = await prisma.masterCategory.findUnique({
        where: { name: "Kombinasi Utama" }
      });
      if (!masterCat) {
        masterCat = await prisma.masterCategory.create({
          data: { name: "Kombinasi Utama", description: "Kategori gabungan kanji utama" }
        });
      }
      await prisma.kategoriKanji.create({
        data: {
          categoryId: masterCat.id,
          jokugoId: j.id
        }
      });
      createdKategoriEntries++;
    }
  }

  console.log(`Berhasil memverifikasi KategoriKanji (${createdKategoriEntries} entri baru dibuat).`);

  // Clear and rebuild cross-link KanjiGraphEdges
  await prisma.kanjiGraphEdge.deleteMany();

  const allKanji = await prisma.kanji.findMany({
    include: { jukugos: true }
  });

  let totalEdgesCreated = 0;

  for (const kanji of allKanji) {
    const wordSet = new Set(kanji.jukugos.map((j) => j.word.trim()));

    for (const rule of jukugoCrossLinkRules) {
      if (wordSet.has(rule.word1) && wordSet.has(rule.word2)) {
        const edgeId = `cross-${kanji.id}-${rule.word1}-${rule.word2}`;
        await prisma.kanjiGraphEdge.create({
          data: {
            id: edgeId,
            kanjiId: kanji.id,
            source: rule.word1,
            target: rule.word2,
            predicate: rule.predicate
          }
        });
        totalEdgesCreated++;
      }
    }
  }

  console.log(`Berhasil membuat ${totalEdgesCreated} Cross-link KanjiGraphEdge untuk ${allKanji.length} Kanji.`);
}

main()
  .catch((e) => {
    console.error("Error running script:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
