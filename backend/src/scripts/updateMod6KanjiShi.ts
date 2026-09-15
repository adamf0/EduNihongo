import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const customGraphShi = {
  categories: [
    {
      title: "1. AWAL WAKTU",
      color: "border-green-500",
      jukugos: [
        { word: "年始", reading: "ねんし", meaning: "awal tahun" }
      ]
    },
    {
      title: "2. MULAI",
      color: "border-blue-500",
      jukugos: [
        { word: "開始", reading: "かいし", meaning: "mulai" },
        { word: "始業", reading: "しぎょう", meaning: "mulai bekerja" },
        { word: "始動", reading: "しどう", meaning: "mulai bergerak" }
      ]
    },
    {
      title: "3. AWAL-AKHIR",
      color: "border-orange-500",
      jukugos: [
        { word: "終始", reading: "しゅうし", meaning: "dari awal sampai akhir" },
        { word: "始終", reading: "しじゅう", meaning: "selalu" }
      ]
    },
    {
      title: "4. PENYELESAIAN",
      color: "border-purple-500",
      jukugos: [
        { word: "始末", reading: "しまつ", meaning: "penyelesaian" }
      ]
    }
  ]
};

const SHI_SEMANTIC_DATA = [
  // 1) AWAL WAKTU
  {
    word: "年始",
    penjelasan: "Hubungan makna antara kanji 年 dan 始 menjadi 年始, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “awal suatu tahun.”",
    nodes: [
      { jokugo: "年", arti: "tahun" },
      { jokugo: "始", arti: "awal, mulai" }
    ]
  },

  // 2) MULAI
  {
    word: "開始",
    penjelasan: "Hubungan makna antara kanji 開 dan 始 menjadi 開始, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memulai atau membuka dimulainya suatu kegiatan.”",
    nodes: [
      { jokugo: "開", arti: "membuka" },
      { jokugo: "始", arti: "mulai" }
    ]
  },
  {
    word: "始業",
    penjelasan: "Hubungan makna antara kanji 始 dan 業 menjadi 始業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mulainya suatu pekerjaan atau kegiatan.”",
    nodes: [
      { jokugo: "始", arti: "mulai" },
      { jokugo: "業", arti: "pekerjaan, kegiatan" }
    ]
  },
  {
    word: "始動",
    penjelasan: "Hubungan makna antara kanji 始 dan 動 menjadi 始動, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mulai bergerak atau mulai beroperasi.”",
    nodes: [
      { jokugo: "始", arti: "mulai" },
      { jokugo: "動", arti: "bergerak" }
    ]
  },

  // 3) AWAL-AKHIR
  {
    word: "終始",
    penjelasan: "Hubungan makna antara kanji 終 dan 始 menjadi 終始, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keadaan yang berlangsung dari awal sampai akhir.”",
    nodes: [
      { jokugo: "終", arti: "akhir" },
      { jokugo: "始", arti: "awal" }
    ]
  },
  {
    word: "始終",
    penjelasan: "Hubungan makna antara kanji 始 dan 終 menjadi 始終, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sesuatu yang berlangsung terus dari awal sampai akhir, sehingga bermakna selalu.”",
    nodes: [
      { jokugo: "始", arti: "awal" },
      { jokugo: "終", arti: "akhir" }
    ]
  },

  // 4) PENYELESAIAN
  {
    word: "始末",
    penjelasan: "Hubungan makna antara kanji 始 dan 末 menjadi 始末, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menangani suatu urusan sampai selesai.”",
    nodes: [
      { jokugo: "始", arti: "awal" },
      { jokugo: "末", arti: "akhir" }
    ]
  }
];

async function run() {
  const char = "始";
  const kanji = await prisma.kanji.findFirst({ where: { character: char } });
  if (!kanji) {
    console.error(`Kanji ${char} not found in DB`);
    return;
  }

  const validWords = new Set<string>();
  customGraphShi.categories.forEach(cat => {
    cat.jukugos.forEach(jk => validWords.add(jk.word));
  });

  // 1. Clean obsolete Jukugo records for 始
  const existingJukugos = await prisma.jukugo.findMany({
    where: { kanjiId: kanji.id }
  });

  for (const j of existingJukugos) {
    if (!validWords.has(j.word)) {
      await prisma.kategoriKanji.deleteMany({ where: { jokugoId: j.id } });
      await prisma.semanticRelation.deleteMany({ where: { jukugoId: j.id } });
      await prisma.jukugo.delete({ where: { id: j.id } });
      console.log(`Deleted obsolete jukugo for 始: ${j.word}`);
    }
  }

  // 2. Delete existing KanjiGraphEdge for 始
  await prisma.kanjiGraphEdge.deleteMany({ where: { kanjiId: kanji.id } });

  // 3. Re-create KanjiGraphEdge
  const graphEdges: any[] = [];
  customGraphShi.categories.forEach((cat, catIdx) => {
    const catId = `${char}-cat-${catIdx + 1}`;
    graphEdges.push({
      id: `${char}-e-root-cat${catIdx + 1}`,
      kanjiId: kanji.id,
      source: `${char}-root`,
      target: catId,
      predicate: null
    });

    cat.jukugos.forEach((jk, jkIdx) => {
      const subId = `${char}-sub-${catIdx + 1}-${jkIdx + 1}`;
      graphEdges.push({
        id: `${char}-e-cat${catIdx + 1}-sub${jkIdx + 1}`,
        kanjiId: kanji.id,
        source: catId,
        target: subId,
        predicate: null
      });
    });
  });

  await prisma.kanjiGraphEdge.createMany({ data: graphEdges });

  // 4. Clear all old KategoriKanji mappings for this kanji's jukugos
  const currentJukugos = await prisma.jukugo.findMany({ where: { kanjiId: kanji.id } });
  const currentJukugoIds = currentJukugos.map(j => j.id);
  await prisma.kategoriKanji.deleteMany({
    where: { jokugoId: { in: currentJukugoIds } }
  });

  // 5. Update MasterCategory, Jukugo, KategoriKanji
  const allWords: string[] = [];
  const groups: Record<string, string[]>[] = [];

  for (const cat of customGraphShi.categories) {
    let masterCat = await prisma.masterCategory.findFirst({
      where: { name: cat.title },
    });
    if (!masterCat) {
      masterCat = await prisma.masterCategory.create({
        data: { name: cat.title },
      });
    }

    const categoryWords: string[] = [];

    for (const jk of cat.jukugos) {
      categoryWords.push(jk.word);
      if (!allWords.includes(jk.word)) {
        allWords.push(jk.word);
      }

      let dbJukugo = await prisma.jukugo.findFirst({
        where: { kanjiId: kanji.id, word: jk.word },
      });
      if (!dbJukugo) {
        dbJukugo = await prisma.jukugo.create({
          data: {
            kanjiId: kanji.id,
            word: jk.word,
            reading: jk.reading,
            meaning: jk.meaning,
          },
        });
      } else {
        await prisma.jukugo.update({
          where: { id: dbJukugo.id },
          data: {
            reading: jk.reading,
            meaning: jk.meaning
          }
        });
      }

      await prisma.kategoriKanji.create({
        data: {
          jokugoId: dbJukugo.id,
          categoryId: masterCat.id,
        },
      });
    }

    groups.push({ [cat.title]: categoryWords });
  }

  // 6. Update SemanticRelation & SemanticRelationNode for kanji 始
  await prisma.semanticRelation.deleteMany({ where: { kanjiId: kanji.id } });

  for (const semItem of SHI_SEMANTIC_DATA) {
    const targetWord = semItem.word;
    const matchedJukugo = await prisma.jukugo.findFirst({
      where: { kanjiId: kanji.id, word: targetWord }
    });

    const createdSem = await prisma.semanticRelation.create({
      data: {
        kanjiId: kanji.id,
        jukugoId: matchedJukugo?.id || null,
        penjelasan: semItem.penjelasan,
      }
    });

    if (semItem.nodes && semItem.nodes.length > 0) {
      await prisma.semanticRelationNode.createMany({
        data: semItem.nodes.map(n => ({
          semanticId: createdSem.id,
          jokugo: n.jokugo,
          arti: n.arti
        }))
      });
    }
  }

  // 7. Update Grouping Quiz for kanji 始
  await prisma.quiz.deleteMany({
    where: { kanjiId: kanji.id, type: "grouping" }
  });

  await prisma.quiz.create({
    data: {
      kanjiId: kanji.id,
      type: "grouping",
      question: "Kelompokkan jukugo berikut ini ke dalam cabang semantic graph yang tepat.",
      words: JSON.stringify(allWords),
      groups: JSON.stringify(groups),
      explanation: `Pengelompokan jukugo berdasarkan cabang semantic graph kanji ${char}.`
    }
  });

  console.log(`Successfully updated graph, categories, semantic relations & grouping quiz for ${char}`);
}

run()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
