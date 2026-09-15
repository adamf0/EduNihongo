import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const customGraphRon = {
  categories: [
    {
      title: "1. DISKUSI / PERDEBATAN",
      color: "border-blue-500",
      jukugos: [
        { word: "論議", reading: "ろんぎ", meaning: "perdebatan / diskusi" },
        { word: "議論", reading: "ぎろん", meaning: "diskusi / perdebatan" },
        { word: "討論", reading: "とうろん", meaning: "diskusi / debat" },
        { word: "口論", reading: "こうろん", meaning: "pertengkaran / perdebatan lisan" },
        { word: "反論", reading: "はんろん", meaning: "sanggahan / argumen balasan" },
        { word: "弁論", reading: "べんろん", meaning: "argumentasi / pembelaan / debat" },
        { word: "論争", reading: "ろんそう", meaning: "perdebatan / perselisihan" }
      ]
    },
    {
      title: "2. PENDAPAT / WACANA",
      color: "border-green-500",
      jukugos: [
        { word: "異論", reading: "いろん", meaning: "pendapat berbeda / keberatan" },
        { word: "持論", reading: "じろん", meaning: "pendapat pribadi" },
        { word: "言論", reading: "げんろん", meaning: "pendapat / wacana" },
        { word: "世論", reading: "よろん", meaning: "opini publik" }
      ]
    },
    {
      title: "3. PENALARAN / PEMIKIRAN",
      color: "border-purple-500",
      jukugos: [
        { word: "論理", reading: "ろんり", meaning: "logika / penalaran" },
        { word: "理論", reading: "りろん", meaning: "teori" },
        { word: "論点", reading: "ろんてん", meaning: "pokok persoalan" },
        { word: "結論", reading: "けつろん", meaning: "kesimpulan" }
      ]
    },
    {
      title: "4. PENYAMPAIAN / HASIL PEMIKIRAN",
      color: "border-orange-500",
      jukugos: [
        { word: "評論", reading: "ひょうろん", meaning: "kritik / ulasan" },
        { word: "論述", reading: "ろんじゅつ", meaning: "uraian argumentatif / editorial" },
        { word: "論文", reading: "ろんぶん", meaning: "karya tulis ilmiah" }
      ]
    }
  ]
};

const RON_SEMANTIC_DATA = [
  // 1) DISKUSI / PERDEBATAN
  {
    word: "論議",
    penjelasan: "Hubungan makna antara kanji 論 dan 議 menjadi 論議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pembahasan atau perdebatan mengenai suatu persoalan.”",
    nodes: [
      { jokugo: "論", arti: "membahas, berargumentasi" },
      { jokugo: "議", arti: "membahas, berunding" }
    ]
  },
  {
    word: "議論",
    penjelasan: "Hubungan makna antara kanji 議 dan 論 menjadi 議論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “diskusi atau perdebatan mengenai suatu persoalan.”",
    nodes: [
      { jokugo: "議", arti: "membahas, berunding" },
      { jokugo: "論", arti: "membahas, mengemukakan pendapat atau argumen" }
    ]
  },
  {
    word: "討論",
    penjelasan: "Hubungan makna antara kanji 討 dan 論 menjadi 討論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “diskusi atau debat untuk membahas suatu persoalan atau topik.”",
    nodes: [
      { jokugo: "討", arti: "membahas, mendiskusikan, menyelidiki" },
      { jokugo: "論", arti: "membahas, mengemukakan pendapat atau argumen" }
    ]
  },
  {
    word: "口論",
    penjelasan: "Hubungan makna antara kanji 口 dan 論 menjadi 口論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perdebatan atau pertengkaran yang dilakukan secara lisan.”",
    nodes: [
      { jokugo: "口", arti: "mulut, ucapan" },
      { jokugo: "論", arti: "membahas, berdebat" }
    ]
  },
  {
    word: "反論",
    penjelasan: "Hubungan makna antara kanji 反 dan 論 menjadi 反論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sanggahan atau argumen yang digunakan untuk menentang atau membalas pendapat sebelumnya.”",
    nodes: [
      { jokugo: "反", arti: "melawan, berbalik, menentang" },
      { jokugo: "論", arti: "pendapat, argumen" }
    ]
  },
  {
    word: "弁論",
    penjelasan: "Hubungan makna antara kanji 弁 dan 論 menjadi 弁論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “penyampaian argumentasi atau pembelaan melalui pendapat dan penjelasan.”",
    nodes: [
      { jokugo: "弁", arti: "berbicara, menjelaskan, membela" },
      { jokugo: "論", arti: "pendapat, argumen" }
    ]
  },
  {
    word: "論争",
    penjelasan: "Hubungan makna antara kanji 論 dan 争 menjadi 論争, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perdebatan atau perselisihan mengenai suatu pendapat atau persoalan.”",
    nodes: [
      { jokugo: "論", arti: "pendapat, argumen, pembahasan" },
      { jokugo: "争", arti: "berselisih, bertentangan" }
    ]
  },

  // 2) PENDAPAT / WACANA
  {
    word: "異論",
    penjelasan: "Hubungan makna antara kanji 異 dan 論 menjadi 異論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pendapat yang berbeda atau keberatan terhadap suatu pendapat.”",
    nodes: [
      { jokugo: "異", arti: "berbeda, tidak sama" },
      { jokugo: "論", arti: "pendapat, pandangan" }
    ]
  },
  {
    word: "持論",
    penjelasan: "Hubungan makna antara kanji 持 dan 論 menjadi 持論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pendapat atau pandangan yang secara pribadi dimiliki dan dianut seseorang.”",
    nodes: [
      { jokugo: "持", arti: "memegang, memiliki" },
      { jokugo: "論", arti: "pendapat, pandangan" }
    ]
  },
  {
    word: "言論",
    penjelasan: "Hubungan makna antara kanji 言 dan 論 menjadi 言論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pendapat atau wacana yang disampaikan melalui bahasa atau ucapan.”",
    nodes: [
      { jokugo: "言", arti: "kata, ucapan, menyatakan" },
      { jokugo: "論", arti: "pendapat, pandangan" }
    ]
  },
  {
    word: "世論",
    penjelasan: "Hubungan makna antara kanji 世 dan 論 menjadi 世論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pendapat atau pandangan yang berkembang di tengah masyarakat.”",
    nodes: [
      { jokugo: "世", arti: "masyarakat, dunia" },
      { jokugo: "論", arti: "pendapat, pandangan" }
    ]
  },

  // 3) PENALARAN / PEMIKIRAN
  {
    word: "論理",
    penjelasan: "Hubungan makna antara kanji 論 dan 理 menjadi 論理, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “logika atau penalaran yang digunakan untuk berpikir dan menjelaskan suatu persoalan secara sistematis.”",
    nodes: [
      { jokugo: "論", arti: "membahas, mengemukakan pendapat" },
      { jokugo: "理", arti: "alasan, logika, prinsip" }
    ]
  },
  {
    word: "理論",
    penjelasan: "Hubungan makna antara kanji 理 dan 論 menjadi 理論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “teori atau sistem pemikiran yang menjelaskan suatu hal berdasarkan prinsip dan penalaran.”",
    nodes: [
      { jokugo: "理", arti: "alasan, prinsip, logika" },
      { jokugo: "論", arti: "pendapat, pembahasan" }
    ]
  },
  {
    word: "論点",
    penjelasan: "Hubungan makna antara kanji 論 dan 点 menjadi 論点, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pokok persoalan atau titik utama yang menjadi fokus dalam suatu pembahasan.”",
    nodes: [
      { jokugo: "論", arti: "pembahasan, pendapat" },
      { jokugo: "点", arti: "titik, pokok" }
    ]
  },
  {
    word: "結論",
    penjelasan: "Hubungan makna antara kanji 結 dan 論 menjadi 結論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kesimpulan yang diperoleh setelah melakukan pembahasan atau penalaran.”",
    nodes: [
      { jokugo: "結", arti: "mengikat, menyatukan, menghasilkan" },
      { jokugo: "論", arti: "pembahasan, pendapat" }
    ]
  },

  // 4) PENYAMPAIAN / HASIL PEMIKIRAN
  {
    word: "評論",
    penjelasan: "Hubungan makna antara kanji 評 dan 論 menjadi 評論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pembahasan atau tulisan yang memberikan penilaian dan kritik terhadap suatu hal.”",
    nodes: [
      { jokugo: "評", arti: "menilai, memberikan penilaian" },
      { jokugo: "論", arti: "membahas, mengemukakan pendapat" }
    ]
  },
  {
    word: "論述",
    penjelasan: "Hubungan makna antara kanji 論 dan 述 menjadi 論述, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “uraian atau tulisan yang menyampaikan pendapat dan argumentasi mengenai suatu persoalan.”",
    nodes: [
      { jokugo: "論", arti: "pendapat, pembahasan" },
      { jokugo: "述", arti: "menjelaskan, menguraikan, menyampaikan" }
    ]
  },
  {
    word: "論文",
    penjelasan: "Hubungan makna antara kanji 論 dan 文 menjadi 論文, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “karya tulis ilmiah yang membahas suatu persoalan berdasarkan pemikiran, penalaran, dan argumentasi.”",
    nodes: [
      { jokugo: "論", arti: "pembahasan, pendapat, argumen" },
      { jokugo: "文", arti: "tulisan, karangan" }
    ]
  }
];

async function run() {
  const char = "論";
  const kanji = await prisma.kanji.findFirst({ where: { character: char } });
  if (!kanji) {
    console.error(`Kanji ${char} not found in DB`);
    return;
  }

  const validWords = new Set<string>();
  customGraphRon.categories.forEach(cat => {
    cat.jukugos.forEach(jk => validWords.add(jk.word));
  });

  // 1. Clean obsolete Jukugo records for 論
  const existingJukugos = await prisma.jukugo.findMany({
    where: { kanjiId: kanji.id }
  });

  for (const j of existingJukugos) {
    if (!validWords.has(j.word)) {
      await prisma.kategoriKanji.deleteMany({ where: { jokugoId: j.id } });
      await prisma.semanticRelation.deleteMany({ where: { jukugoId: j.id } });
      await prisma.jukugo.delete({ where: { id: j.id } });
      console.log(`Deleted obsolete jukugo for 論: ${j.word}`);
    }
  }

  // 2. Delete existing KanjiGraphEdge for 論
  await prisma.kanjiGraphEdge.deleteMany({ where: { kanjiId: kanji.id } });

  // 3. Re-create KanjiGraphEdge
  const graphEdges: any[] = [];
  customGraphRon.categories.forEach((cat, catIdx) => {
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

  for (const cat of customGraphRon.categories) {
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

  // 6. Update SemanticRelation & SemanticRelationNode for kanji 論
  await prisma.semanticRelation.deleteMany({ where: { kanjiId: kanji.id } });

  for (const semItem of RON_SEMANTIC_DATA) {
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

  // 7. Update Grouping Quiz for kanji 論
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
