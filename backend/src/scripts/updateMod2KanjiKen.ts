import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const customGraphKen = {
  categories: [
    {
      title: "1. Meneliti / Mendalami",
      color: "border-green-500",
      jukugos: [
        { word: "研究", reading: "けんきゅう", meaning: "penelitian" },
        { word: "研学", reading: "けんがく", meaning: "belajar" },
        { word: "研精", reading: "けんせい", meaning: "meneliti" }
      ]
    },
    {
      title: "2. Belajar / Mengasah Kemampuan",
      color: "border-blue-500",
      jukugos: [
        { word: "研修", reading: "けんしゅう", meaning: "pelatihan" },
        { word: "研習", reading: "けんしゅう", meaning: "mempelajari" },
        { word: "研鑽", reading: "けんさん", meaning: "mengasah" }
      ]
    },
    {
      title: "3. Mengasah / Menghaluskan",
      color: "border-orange-500",
      jukugos: [
        { word: "研磨", reading: "けんま", meaning: "memoles" },
        { word: "研削", reading: "けんさく", meaning: "menggerinda" }
      ]
    }
  ]
};

const KEN_SEMANTIC_DATA = [
  // 1) Meneliti / Mendalami
  {
    word: "研究",
    penjelasan: "Hubungan makna antar kanji 研 dan 究 menjadi 研究, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan menyelidiki dan mendalami suatu hal secara sungguh-sungguh.”",
    nodes: [
      { jokugo: "研", arti: "mengasah, memperdalam" },
      { jokugo: "究", arti: "menyelidiki, mendalami" }
    ]
  },
  {
    word: "研学",
    penjelasan: "Hubungan makna antar kanji 研 dan 学 menjadi 研学, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “belajar atau mendalami ilmu pengetahuan.”",
    nodes: [
      { jokugo: "研", arti: "mengasah, memperdalam" },
      { jokugo: "学", arti: "belajar, ilmu" }
    ]
  },
  {
    word: "研精",
    penjelasan: "Hubungan makna antar kanji 研 dan 精 menjadi 研精, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “meneliti atau mendalami sesuatu dengan cermat.”",
    nodes: [
      { jokugo: "研", arti: "mengasah, memperdalam" },
      { jokugo: "精", arti: "teliti, cermat" }
    ]
  },

  // 2) Belajar / Mengasah Kemampuan
  {
    word: "研修",
    penjelasan: "Hubungan makna antar kanji 研 dan 修 menjadi 研修, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan belajar atau berlatih untuk meningkatkan pengetahuan dan kemampuan.”",
    nodes: [
      { jokugo: "研", arti: "mengasah, memperdalam" },
      { jokugo: "修", arti: "mempelajari, memperbaiki" }
    ]
  },
  {
    word: "研習",
    penjelasan: "Hubungan makna antar kanji 研 dan 習 menjadi 研習, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mempelajari atau melatih sesuatu untuk memperdalam kemampuan.”",
    nodes: [
      { jokugo: "研", arti: "mengasah, memperdalam" },
      { jokugo: "習", arti: "belajar, berlatih" }
    ]
  },
  {
    word: "研鑽",
    penjelasan: "Hubungan makna antar kanji 研 dan 鑽 menjadi 研鑽, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “terus belajar dan mendalami sesuatu untuk mengasah pengetahuan atau kemampuan.”",
    nodes: [
      { jokugo: "研", arti: "mengasah, memperdalam" },
      { jokugo: "鑽", arti: "menggali, mendalami" }
    ]
  },

  // 3) Mengasah / Menghaluskan
  {
    word: "研磨",
    penjelasan: "Hubungan makna antar kanji 研 dan 磨 menjadi 研磨, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengasah atau memoles suatu benda agar lebih halus.”",
    nodes: [
      { jokugo: "研", arti: "mengasah, memoles" },
      { jokugo: "磨", arti: "menggosok, memoles" }
    ]
  },
  {
    word: "研削",
    penjelasan: "Hubungan makna antar kanji 研 dan 削 menjadi 研削, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengikis atau mengasah permukaan suatu benda dengan proses penggerindaan.”",
    nodes: [
      { jokugo: "研", arti: "mengasah" },
      { jokugo: "削", arti: "mengikis, mengurangi" }
    ]
  }
];

const KEN_GRAPH_EDGES = [
  { source: "研究", target: "研学", predicate: "mirip pendalaman" },
  { source: "研究", target: "研精", predicate: "meneliti dengan cermat" },
  { source: "研修", target: "研習", predicate: "proses pelatihan" },
  { source: "研習", target: "研鑽", predicate: "pendalaman kemampuan" },
  { source: "研磨", target: "研削", predicate: "proses pengerjaan fisik" }
];

async function updateKen() {
  const char = "研";
  const kanji = await prisma.kanji.findFirst({ where: { character: char } });
  if (!kanji) {
    console.error(`Kanji ${char} not found in DB`);
    return;
  }

  // Target 8 valid words
  const validWords = new Set<string>();
  customGraphKen.categories.forEach(cat => {
    cat.jukugos.forEach(jk => validWords.add(jk.word));
  });

  // 1. Clean obsolete Jukugo records for 研
  const existingJukugos = await prisma.jukugo.findMany({
    where: { kanjiId: kanji.id }
  });

  for (const j of existingJukugos) {
    if (!validWords.has(j.word)) {
      await prisma.kategoriKanji.deleteMany({ where: { jokugoId: j.id } });
      await prisma.semanticRelation.deleteMany({ where: { jukugoId: j.id } });
      await prisma.jukugo.delete({ where: { id: j.id } });
      console.log(`Deleted obsolete jukugo for ${char}: ${j.word}`);
    }
  }

  // 2. Populate Categories and Jukugos
  const groups: Record<string, string[]>[] = [];
  const allWords: string[] = [];

  for (const cat of customGraphKen.categories) {
    let masterCat = await prisma.masterCategory.findFirst({
      where: { name: cat.title },
    });
    if (!masterCat) {
      masterCat = await prisma.masterCategory.create({
        data: { name: cat.title, description: `Kategori ${cat.title}` },
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

      // Link to category if not linked
      const link = await prisma.kategoriKanji.findFirst({
        where: { jokugoId: dbJukugo.id, categoryId: masterCat.id }
      });
      if (!link) {
        await prisma.kategoriKanji.create({
          data: {
            jokugoId: dbJukugo.id,
            categoryId: masterCat.id,
          },
        });
      }
    }

    groups.push({ [cat.title]: categoryWords });
  }

  // 3. Update SemanticRelation for kanji 研
  await prisma.semanticRelation.deleteMany({ where: { kanjiId: kanji.id } });

  for (const semItem of KEN_SEMANTIC_DATA) {
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

  // 4. Update KanjiGraphEdge cross-links for kanji 研
  await prisma.kanjiGraphEdge.deleteMany({ where: { kanjiId: kanji.id } });

  for (const edge of KEN_GRAPH_EDGES) {
    const edgeId = `edge-${kanji.id}-${edge.source}-${edge.target}`;
    await prisma.kanjiGraphEdge.create({
      data: {
        id: edgeId,
        kanjiId: kanji.id,
        source: edge.source,
        target: edge.target,
        predicate: edge.predicate
      }
    });
  }

  // 5. Update Grouping Quiz for kanji 研
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

updateKen()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
