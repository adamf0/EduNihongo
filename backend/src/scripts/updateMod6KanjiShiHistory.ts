import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const customGraphShiHistory = {
  categories: [
    {
      title: "1. SEJARAH",
      color: "border-blue-500",
      jukugos: [
        { word: "歴史", reading: "れきし", meaning: "sejarah" },
        { word: "先史", reading: "せんし", meaning: "prasejarah" },
        { word: "前史", reading: "ぜんし", meaning: "sejarah sebelumnya" }
      ]
    },
    {
      title: "2. FAKTA",
      color: "border-green-500",
      jukugos: [
        { word: "史実", reading: "しじつ", meaning: "fakta sejarah" }
      ]
    },
    {
      title: "3. SUMBER",
      color: "border-purple-500",
      jukugos: [
        { word: "史料", reading: "しりょう", meaning: "bahan sejarah" }
      ]
    },
    {
      title: "4. JENIS SEJARAH",
      color: "border-orange-500",
      jukugos: [
        { word: "正史", reading: "せいし", meaning: "sejarah resmi" },
        { word: "秘史", reading: "ひし", meaning: "sejarah rahasia" }
      ]
    },
    {
      title: "5. DALAM SEJARAH",
      color: "border-pink-500",
      jukugos: [
        { word: "史上", reading: "しじょう", meaning: "dalam sejarah" }
      ]
    }
  ]
};

const SHI_SEMANTIC_DATA = [
  // 1) SEJARAH
  {
    word: "歴史",
    penjelasan: "Hubungan makna antara kanji 歴 dan 史 menjadi 歴史, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sejarah atau catatan mengenai peristiwa yang telah berlangsung pada masa lalu.”",
    nodes: [
      { jokugo: "歴", arti: "melewati, riwayat" },
      { jokugo: "史", arti: "sejarah, catatan" }
    ]
  },
  {
    word: "先史",
    penjelasan: "Hubungan makna antara kanji 先 dan 史 menjadi 先史, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “masa sebelum sejarah tertulis.”",
    nodes: [
      { jokugo: "先", arti: "sebelum, terdahulu" },
      { jokugo: "史", arti: "sejarah" }
    ]
  },
  {
    word: "前史",
    penjelasan: "Hubungan makna antara kanji 前 dan 史 menjadi 前史, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sejarah atau latar belakang yang terjadi sebelum suatu peristiwa atau masa tertentu.”",
    nodes: [
      { jokugo: "前", arti: "sebelumnya" },
      { jokugo: "史", arti: "sejarah" }
    ]
  },

  // 2) FAKTA
  {
    word: "史実",
    penjelasan: "Hubungan makna antara kanji 史 dan 実 menjadi 史実, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “fakta atau kenyataan yang benar-benar terjadi dalam sejarah.”",
    nodes: [
      { jokugo: "史", arti: "sejarah" },
      { jokugo: "実", arti: "kenyataan, fakta" }
    ]
  },

  // 3) SUMBER
  {
    word: "史料",
    penjelasan: "Hubungan makna antara kanji 史 dan 料 menjadi 史料, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bahan atau sumber yang digunakan untuk mempelajari sejarah.”",
    nodes: [
      { jokugo: "史", arti: "sejarah" },
      { jokugo: "料", arti: "bahan" }
    ]
  },

  // 4) JENIS SEJARAH
  {
    word: "正史",
    penjelasan: "Hubungan makna antara kanji 正 dan 史 menjadi 正史, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sejarah yang dicatat atau diakui sebagai sejarah resmi.”",
    nodes: [
      { jokugo: "正", arti: "benar, resmi" },
      { jokugo: "史", arti: "sejarah" }
    ]
  },
  {
    word: "秘史",
    penjelasan: "Hubungan makna antara kanji 秘 dan 史 menjadi 秘史, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sejarah atau peristiwa masa lalu yang bersifat rahasia.”",
    nodes: [
      { jokugo: "秘", arti: "rahasia" },
      { jokugo: "史", arti: "sejarah" }
    ]
  },

  // 5) DALAM SEJARAH
  {
    word: "史上",
    penjelasan: "Hubungan makna antara kanji 史 dan 上 menjadi 史上, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sesuatu yang terjadi atau dikenal dalam sejarah.”",
    nodes: [
      { jokugo: "史", arti: "sejarah" },
      { jokugo: "上", arti: "di dalam, pada" }
    ]
  }
];

async function run() {
  const char = "史";
  const kanji = await prisma.kanji.findFirst({ where: { character: char } });
  if (!kanji) {
    console.error(`Kanji ${char} not found in DB`);
    return;
  }

  const validWords = new Set<string>();
  customGraphShiHistory.categories.forEach(cat => {
    cat.jukugos.forEach(jk => validWords.add(jk.word));
  });

  // 1. Clean obsolete Jukugo records for 史
  const existingJukugos = await prisma.jukugo.findMany({
    where: { kanjiId: kanji.id }
  });

  for (const j of existingJukugos) {
    if (!validWords.has(j.word)) {
      await prisma.kategoriKanji.deleteMany({ where: { jokugoId: j.id } });
      await prisma.semanticRelation.deleteMany({ where: { jukugoId: j.id } });
      await prisma.jukugo.delete({ where: { id: j.id } });
      console.log(`Deleted obsolete jukugo for 史: ${j.word}`);
    }
  }

  // 2. Delete existing KanjiGraphEdge for 史
  await prisma.kanjiGraphEdge.deleteMany({ where: { kanjiId: kanji.id } });

  // 3. Re-create KanjiGraphEdge
  const graphEdges: any[] = [];
  customGraphShiHistory.categories.forEach((cat, catIdx) => {
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

  for (const cat of customGraphShiHistory.categories) {
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

  // 6. Update SemanticRelation & SemanticRelationNode for kanji 史
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

  // 7. Update Grouping Quiz for kanji 史
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
