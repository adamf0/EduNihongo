import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const customGraphJutsu = {
  categories: [
    {
      title: "1. TEKNIK / KETERAMPILAN",
      color: "border-blue-500",
      jukugos: [
        { word: "技術", reading: "ぎじゅつ", meaning: "teknik / keterampilan" },
        { word: "手術", reading: "しゅじゅつ", meaning: "operasi" },
        { word: "話術", reading: "わじゅつ", meaning: "keterampilan berbicara" },
        { word: "秘術", reading: "ひじゅつ", meaning: "teknik rahasia" }
      ]
    },
    {
      title: "2. ILMU / PENGETAHUAN",
      color: "border-green-500",
      jukugos: [
        { word: "学術", reading: "がくじゅつ", meaning: "ilmu / akademik" },
        { word: "算術", reading: "さんじゅつ", meaning: "ilmu hitung" }
      ]
    },
    {
      title: "3. SENI / KEAHLIAN SENI",
      color: "border-orange-500",
      jukugos: [
        { word: "芸術", reading: "げいじゅつ", meaning: "seni" },
        { word: "美術", reading: "びじゅつ", meaning: "seni rupa" }
      ]
    }
  ]
};

const JUTSU_SEMANTIC_DATA = [
  // 1) TEKNIK / KETERAMPILAN
  {
    word: "技術",
    penjelasan: "Hubungan makna antar kanji 技 dan 術 menjadi 技術, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “teknik atau keterampilan untuk melakukan sesuatu.”",
    nodes: [
      { jokugo: "技", arti: "keterampilan, teknik, keahlian" },
      { jokugo: "術", arti: "teknik, keterampilan, metode" }
    ]
  },
  {
    word: "手術",
    penjelasan: "Hubungan makna antar kanji 手 dan 術 menjadi 手術, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tindakan medis yang dilakukan dengan teknik atau metode tertentu.”",
    nodes: [
      { jokugo: "手", arti: "tangan" },
      { jokugo: "術", arti: "teknik, metode, cara" }
    ]
  },
  {
    word: "話術",
    penjelasan: "Hubungan makna antar kanji 話 dan 術 menjadi 話術, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “teknik atau keterampilan dalam berbicara.”",
    nodes: [
      { jokugo: "話", arti: "berbicara, percakapan" },
      { jokugo: "術", arti: "teknik, keterampilan, metode" }
    ]
  },
  {
    word: "秘術",
    penjelasan: "Hubungan makna antar kanji 秘 dan 術 menjadi 秘術, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “teknik atau metode khusus yang dirahasiakan.”",
    nodes: [
      { jokugo: "秘", arti: "rahasia, tersembunyi" },
      { jokugo: "術", arti: "teknik, metode, keterampilan" }
    ]
  },

  // 2) ILMU / PENGETAHUAN
  {
    word: "学術",
    penjelasan: "Hubungan makna antar kanji 学 dan 術 menjadi 学術, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “ilmu atau bidang akademik yang memiliki pengetahuan dan metode tertentu.”",
    nodes: [
      { jokugo: "学", arti: "belajar, ilmu, pengetahuan" },
      { jokugo: "術", arti: "teknik, metode, keahlian" }
    ]
  },
  {
    word: "算術",
    penjelasan: "Hubungan makna antar kanji 算 dan 術 menjadi 算術, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “metode atau ilmu yang berkaitan dengan perhitungan.”",
    nodes: [
      { jokugo: "算", arti: "menghitung, perhitungan" },
      { jokugo: "術", arti: "teknik, metode, cara" }
    ]
  },

  // 3) SENI / KEAHLIAN SENI
  {
    word: "芸術",
    penjelasan: "Hubungan makna antar kanji 芸 dan 術 menjadi 芸術, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “seni yang melibatkan keterampilan dan teknik tertentu.”",
    nodes: [
      { jokugo: "芸", arti: "seni, keterampilan, karya seni" },
      { jokugo: "術", arti: "teknik, keterampilan, metode" }
    ]
  },
  {
    word: "美術",
    penjelasan: "Hubungan makna antar kanji 美 dan 術 menjadi 美術, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “seni yang berkaitan dengan keindahan dan karya seni rupa.”",
    nodes: [
      { jokugo: "美", arti: "indah, keindahan" },
      { jokugo: "術", arti: "teknik, keterampilan, metode" }
    ]
  }
];

async function run() {
  const char = "術";
  const kanji = await prisma.kanji.findFirst({ where: { character: char } });
  if (!kanji) {
    console.error(`Kanji ${char} not found in DB`);
    return;
  }

  const validWords = new Set<string>();
  customGraphJutsu.categories.forEach(cat => {
    cat.jukugos.forEach(jk => validWords.add(jk.word));
  });

  // 1. Clean obsolete Jukugo records for 術
  const existingJukugos = await prisma.jukugo.findMany({
    where: { kanjiId: kanji.id }
  });

  for (const j of existingJukugos) {
    if (!validWords.has(j.word)) {
      await prisma.kategoriKanji.deleteMany({ where: { jokugoId: j.id } });
      await prisma.semanticRelation.deleteMany({ where: { jukugoId: j.id } });
      await prisma.jukugo.delete({ where: { id: j.id } });
      console.log(`Deleted obsolete jukugo for 術: ${j.word}`);
    }
  }

  // 2. Delete existing KanjiGraphEdge for 術
  await prisma.kanjiGraphEdge.deleteMany({ where: { kanjiId: kanji.id } });

  // 3. Re-create KanjiGraphEdge
  const graphEdges: any[] = [];
  customGraphJutsu.categories.forEach((cat, catIdx) => {
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

  for (const cat of customGraphJutsu.categories) {
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

  // 6. Update SemanticRelation & SemanticRelationNode for kanji 術
  await prisma.semanticRelation.deleteMany({ where: { kanjiId: kanji.id } });

  for (const semItem of JUTSU_SEMANTIC_DATA) {
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

  // 7. Update Grouping Quiz for kanji 術
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
