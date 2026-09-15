import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const customGraphReki = {
  categories: [
    {
      title: "1. RIWAYAT",
      color: "border-purple-500",
      jukugos: [
        { word: "学歴", reading: "がくれき", meaning: "riwayat pendidikan" },
        { word: "職歴", reading: "しょくれき", meaning: "riwayat pekerjaan" },
        { word: "経歴", reading: "けいれき", meaning: "riwayat hidup / karier" }
      ]
    },
    {
      title: "2. KEHIDUPAN",
      color: "border-green-500",
      jukugos: [
        { word: "前歴", reading: "ぜんれき", meaning: "riwayat sebelumnya" },
        { word: "病歴", reading: "びょうれき", meaning: "riwayat penyakit" },
        { word: "来歴", reading: "らいれき", meaning: "asal-usul / riwayat" }
      ]
    },
    {
      title: "3. SEJARAH",
      color: "border-blue-500",
      jukugos: [
        { word: "歴史", reading: "れきし", meaning: "sejarah" },
        { word: "歴代", reading: "れきだい", meaning: "dari generasi ke generasi" },
        { word: "歴年", reading: "れきねん", meaning: "bertahun-tahun" }
      ]
    }
  ]
};

const REKI_SEMANTIC_DATA = [
  // 1) RIWAYAT
  {
    word: "学歴",
    penjelasan: "Hubungan makna antara kanji 学 dan 歴 menjadi 学歴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “riwayat pendidikan yang telah ditempuh.”",
    nodes: [
      { jokugo: "学", arti: "belajar, pendidikan" },
      { jokugo: "歴", arti: "riwayat, perjalanan yang telah dilalui" }
    ]
  },
  {
    word: "職歴",
    penjelasan: "Hubungan makna antara kanji 職 dan 歴 menjadi 職歴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “riwayat pekerjaan yang telah dijalani.”",
    nodes: [
      { jokugo: "職", arti: "pekerjaan, jabatan" },
      { jokugo: "歴", arti: "riwayat, perjalanan yang telah dilalui" }
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

  // 2) KEHIDUPAN
  {
    word: "前歴",
    penjelasan: "Hubungan makna antara kanji 前 dan 歴 menjadi 前歴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “riwayat yang terjadi atau dimiliki sebelumnya.”",
    nodes: [
      { jokugo: "前", arti: "sebelumnya" },
      { jokugo: "歴", arti: "riwayat" }
    ]
  },
  {
    word: "病歴",
    penjelasan: "Hubungan makna antara kanji 病 dan 歴 menjadi 病歴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “riwayat penyakit yang pernah dialami.”",
    nodes: [
      { jokugo: "病", arti: "penyakit" },
      { jokugo: "歴", arti: "riwayat" }
    ]
  },
  {
    word: "来歴",
    penjelasan: "Hubungan makna antara kanji 来 dan 歴 menjadi 来歴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “asal-usul atau perjalanan suatu hal hingga sampai pada keadaan sekarang.”",
    nodes: [
      { jokugo: "来", arti: "datang, asal" },
      { jokugo: "歴", arti: "riwayat, perjalanan" }
    ]
  },

  // 3) SEJARAH
  {
    word: "歴史",
    penjelasan: "Hubungan makna antara kanji 歴 dan 史 menjadi 歴史, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sejarah atau catatan mengenai peristiwa yang telah berlangsung pada masa lalu.”",
    nodes: [
      { jokugo: "歴", arti: "melewati, riwayat" },
      { jokugo: "史", arti: "sejarah, catatan" }
    ]
  },
  {
    word: "歴代",
    penjelasan: "Hubungan makna antara kanji 歴 dan 代 menjadi 歴代, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pergantian atau keberlangsungan dari satu generasi atau masa ke generasi berikutnya.”",
    nodes: [
      { jokugo: "歴", arti: "melewati masa" },
      { jokugo: "代", arti: "generasi, masa" }
    ]
  },
  {
    word: "歴年",
    penjelasan: "Hubungan makna antara kanji 歴 dan 年 menjadi 歴年, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “rentang waktu yang telah berlangsung selama bertahun-tahun.”",
    nodes: [
      { jokugo: "歴", arti: "melewati" },
      { jokugo: "年", arti: "tahun" }
    ]
  }
];

async function run() {
  const char = "歴";
  const kanji = await prisma.kanji.findFirst({ where: { character: char } });
  if (!kanji) {
    console.error(`Kanji ${char} not found in DB`);
    return;
  }

  const validWords = new Set<string>();
  customGraphReki.categories.forEach(cat => {
    cat.jukugos.forEach(jk => validWords.add(jk.word));
  });

  // 1. Clean obsolete Jukugo records for 歴
  const existingJukugos = await prisma.jukugo.findMany({
    where: { kanjiId: kanji.id }
  });

  for (const j of existingJukugos) {
    if (!validWords.has(j.word)) {
      await prisma.kategoriKanji.deleteMany({ where: { jokugoId: j.id } });
      await prisma.semanticRelation.deleteMany({ where: { jukugoId: j.id } });
      await prisma.jukugo.delete({ where: { id: j.id } });
      console.log(`Deleted obsolete jukugo for 歴: ${j.word}`);
    }
  }

  // 2. Delete existing KanjiGraphEdge for 歴
  await prisma.kanjiGraphEdge.deleteMany({ where: { kanjiId: kanji.id } });

  // 3. Re-create KanjiGraphEdge
  const graphEdges: any[] = [];
  customGraphReki.categories.forEach((cat, catIdx) => {
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

  for (const cat of customGraphReki.categories) {
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

  // 6. Update SemanticRelation & SemanticRelationNode for kanji 歴
  await prisma.semanticRelation.deleteMany({ where: { kanjiId: kanji.id } });

  for (const semItem of REKI_SEMANTIC_DATA) {
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

  // 7. Update Grouping Quiz for kanji 歴
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
