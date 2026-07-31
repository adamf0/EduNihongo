import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

async function addPredicatesToGraphEdges() {
  console.log("=== Memulai Penambahan Predicate pada KanjiGraphEdge ===");

  const allKanji = await prisma.kanji.findMany({
    include: {
      graphEdges: true,
      jukugos: true,
    },
  });

  console.log(`Ditemukan ${allKanji.length} Kanji di database.`);

  let createdCrossEdges = 0;

  for (const kanji of allKanji) {
    const existingEdges = kanji.graphEdges;
    const wordToNodeMap = new Map<string, string>();
    kanji.jukugos.forEach((j) => {
      wordToNodeMap.set(j.word.trim(), j.word.trim());
    });

    for (const rule of jukugoCrossLinkRules) {
      const srcId = wordToNodeMap.get(rule.word1);
      const tgtId = wordToNodeMap.get(rule.word2);

      if (srcId && tgtId) {
        const edgeId = `cross-${kanji.id}-${srcId}-${tgtId}`;
        const alreadyExists = existingEdges.some(
          (e: any) => (e.source === srcId && e.target === tgtId) || e.id === edgeId
        );

        if (!alreadyExists) {
          await prisma.kanjiGraphEdge.create({
            data: {
              id: edgeId,
              kanjiId: kanji.id,
              source: srcId,
              target: tgtId,
              predicate: rule.predicate,
            },
          });
          createdCrossEdges++;
        }
      }
    }
  }

  console.log(`Selesai! Berhasil menambah ${createdCrossEdges} cross-link edge dengan predicate.`);
}

addPredicatesToGraphEdges()
  .catch((e) => {
    console.error("Gagal menambahkan predicate:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
