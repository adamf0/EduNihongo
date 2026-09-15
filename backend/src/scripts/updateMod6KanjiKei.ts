import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const customGraphKei = {
  categories: [
    {
      title: "1. Pengalaman / Perjalanan Waktu",
      color: "border-green-500",
      jukugos: [
        { word: "経験", reading: "けいけん", meaning: "pengalaman" },
        { word: "経過", reading: "けいか", meaning: "proses" },
        { word: "経歴", reading: "けいれき", meaning: "riwayat" }
      ]
    },
    {
      title: "2. Jalur / Cara Melalui",
      color: "border-blue-500",
      jukugos: [
        { word: "経由", reading: "けいゆ", meaning: "melalui" },
        { word: "経口", reading: "けいこう", meaning: "oral" }
      ]
    },
    {
      title: "3. Ekonomi / Pengelolaan",
      color: "border-orange-500",
      jukugos: [
        { word: "経済", reading: "けいざい", meaning: "ekonomi" },
        { word: "経営", reading: "けいえい", meaning: "manajemen" },
        { word: "経費", reading: "けいひ", meaning: "biaya" },
        { word: "経理", reading: "けいり", meaning: "akuntansi" },
        { word: "経常", reading: "けいじょう", meaning: "rutin" }
      ]
    }
  ]
};

const KEI_SEMANTIC_DATA = [
  // 1) Pengalaman / Perjalanan Waktu
  {
    word: "経験",
    penjelasan: "Hubungan makna antara kanji 経 dan 験 menjadi 経験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengalaman yang diperoleh melalui sesuatu yang telah dijalani.”",
    nodes: [
      { jokugo: "経", arti: "melalui, menjalani" },
      { jokugo: "験", arti: "pengalaman, ujian" }
    ]
  },
  {
    word: "経過",
    penjelasan: "Hubungan makna antara kanji 経 dan 過 menjadi 経過, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “proses atau keadaan yang berlangsung dan telah melewati suatu rentang waktu.”",
    nodes: [
      { jokugo: "経", arti: "melalui, melewati" },
      { jokugo: "過", arti: "melewati, berlalu" }
    ]
  },
  {
    word: "経歴",
    penjelasan: "Hubungan makna antara kanji 経 dan 歴 menjadi 経歴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “riwayat atau perjalanan hidup dan karier yang telah dilalui.”",
    nodes: [
      { jokugo: "経", arti: "melalui, menjalani" },
      { jokugo: "歴", arti: "riwayat, perjalanan yang telah dilalui" }
    ]
  },

  // 2) Jalur / Cara Melalui
  {
    word: "経由",
    penjelasan: "Hubungan makna antara kanji 経 dan 由 menjadi 経由, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “melalui suatu tempat, jalur, atau perantara.”",
    nodes: [
      { jokugo: "経", arti: "melalui" },
      { jokugo: "由", arti: "asal, melalui" }
    ]
  },
  {
    word: "経口",
    penjelasan: "Hubungan makna antara kanji 経 dan 口 menjadi 経口, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “melalui mulut atau dilakukan secara oral.”",
    nodes: [
      { jokugo: "経", arti: "melalui" },
      { jokugo: "口", arti: "mulut" }
    ]
  },

  // 3) Ekonomi / Pengelolaan
  {
    word: "経済",
    penjelasan: "Hubungan makna antara kanji 経 dan 済 menjadi 経済, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan mengelola dan mengatur kehidupan atau sumber daya ekonomi.”",
    nodes: [
      { jokugo: "経", arti: "mengatur, mengelola" },
      { jokugo: "済", arti: "menyelesaikan, mengatur" }
    ]
  },
  {
    word: "経営",
    penjelasan: "Hubungan makna antara kanji 経 dan 営 menjadi 経営, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan mengelola dan menjalankan suatu usaha atau organisasi.”",
    nodes: [
      { jokugo: "経", arti: "mengelola, mengatur" },
      { jokugo: "営", arti: "menjalankan, mengusahakan" }
    ]
  },
  {
    word: "経費",
    penjelasan: "Hubungan makna antara kanji 経 dan 費 menjadi 経費, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “biaya yang dikeluarkan untuk menjalankan suatu kegiatan atau keperluan.”",
    nodes: [
      { jokugo: "経", arti: "urusan, pengelolaan" },
      { jokugo: "費", arti: "biaya, pengeluaran" }
    ]
  },
  {
    word: "経理",
    penjelasan: "Hubungan makna antara kanji 経 dan 理 menjadi 経理, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan mengatur dan mengelola urusan keuangan, khususnya pencatatan keuangan.”",
    nodes: [
      { jokugo: "経", arti: "mengatur, mengelola" },
      { jokugo: "理", arti: "mengatur, menata" }
    ]
  },
  {
    word: "経常",
    penjelasan: "Hubungan makna antara kanji 経 dan 常 menjadi 経常, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sesuatu yang berlangsung secara rutin atau terus-menerus.”",
    nodes: [
      { jokugo: "経", arti: "berlangsung, berjalan" },
      { jokugo: "常", arti: "selalu, biasa" }
    ]
  }
];

async function run() {
  const char = "経";
  const kanji = await prisma.kanji.findFirst({ where: { character: char } });
  if (!kanji) {
    console.error(`Kanji ${char} not found in DB`);
    return;
  }

  const validWords = new Set<string>();
  customGraphKei.categories.forEach(cat => {
    cat.jukugos.forEach(jk => validWords.add(jk.word));
  });

  // 1. Clean obsolete Jukugo records for 経
  const existingJukugos = await prisma.jukugo.findMany({
    where: { kanjiId: kanji.id }
  });

  for (const j of existingJukugos) {
    if (!validWords.has(j.word)) {
      await prisma.kategoriKanji.deleteMany({ where: { jokugoId: j.id } });
      await prisma.semanticRelation.deleteMany({ where: { jukugoId: j.id } });
      await prisma.jukugo.delete({ where: { id: j.id } });
      console.log(`Deleted obsolete jukugo for 経: ${j.word}`);
    }
  }

  // 2. Delete existing KanjiGraphEdge for 経
  await prisma.kanjiGraphEdge.deleteMany({ where: { kanjiId: kanji.id } });

  // 3. Re-create KanjiGraphEdge
  const graphEdges: any[] = [];
  customGraphKei.categories.forEach((cat, catIdx) => {
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

  for (const cat of customGraphKei.categories) {
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

  // 6. Update SemanticRelation & SemanticRelationNode for kanji 経
  await prisma.semanticRelation.deleteMany({ where: { kanjiId: kanji.id } });

  for (const semItem of KEI_SEMANTIC_DATA) {
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

  // 7. Update Grouping Quiz for kanji 経
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
