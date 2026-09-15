import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const customGraphShin = {
  categories: [
    {
      title: "1. PENYAMPAIAN PESAN DAN INFORMASI",
      color: "border-red-500",
      jukugos: [
        { word: "信言", reading: "しんげん", meaning: "kata-kata / pernyataan yang dapat dipercaya" },
        { word: "通信", reading: "つうしん", meaning: "komunikasi / pertukaran informasi" },
        { word: "発信", reading: "はっしん", meaning: "mengirim / menyampaikan informasi" },
        { word: "送信", reading: "そうしん", meaning: "mengirim / mentransmisikan informasi" },
        { word: "返信", reading: "へんしん", meaning: "membalas pesan / surat" },
        { word: "交信", reading: "こうしん", meaning: "saling berkomunikasi" },
        { word: "信号", reading: "しんごう", meaning: "tanda / sinyal" }
      ]
    },
    {
      title: "2. PENYAMPAIAN DAN PEWARISAN ILMU / AJARAN",
      color: "border-orange-500",
      jukugos: [
        { word: "信念", reading: "しんねん", meaning: "keyakinan / prinsip yang diyakini" },
        { word: "信者", reading: "しんじゃ", meaning: "orang yang percaya / penganut" },
        { word: "信徒", reading: "しんと", meaning: "penganut agama" },
        { word: "信頼", reading: "しんらい", meaning: "kepercayaan / dapat dipercaya" },
        { word: "信用", reading: "しんよう", meaning: "kepercayaan / kredibilitas" },
        { word: "信任", reading: "しんにん", meaning: "kepercayaan / mempercayakan" },
        { word: "信義", reading: "しんぎ", meaning: "kepercayaan dan kesetiaan" },
        { word: "不信", reading: "ふしん", meaning: "ketidakpercayaan" }
      ]
    },
    {
      title: "3. KEYAKINAN DAN KEPERCAYAAN DIRI",
      color: "border-green-500",
      jukugos: [
        { word: "確信", reading: "かくしん", meaning: "keyakinan kuat / kepastian" },
        { word: "自信", reading: "じしん", meaning: "percaya diri / keyakinan terhadap diri sendiri" }
      ]
    },
    {
      title: "4. INFORMASI DAN DOKUMEN",
      color: "border-blue-500",
      jukugos: [
        { word: "信書", reading: "しんしょ", meaning: "surat / dokumen yang disampaikan" }
      ]
    }
  ]
};

const SHIN_SEMANTIC_DATA = [
  // 1) PENYAMPAIAN PESAN DAN INFORMASI
  {
    word: "信言",
    penjelasan: "Hubungan makna antar kanji 信 dan 言 menjadi 信言, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kata-kata atau pernyataan yang dapat dipercaya dan memiliki kebenaran.”",
    nodes: [
      { jokugo: "信", arti: "percaya, kebenaran" },
      { jokugo: "言", arti: "kata, ucapan" }
    ]
  },
  {
    word: "通信",
    penjelasan: "Hubungan makna antar kanji 通 dan 信 menjadi 通信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “proses penyampaian atau pertukaran informasi antara pihak yang satu dengan pihak lainnya.”",
    nodes: [
      { jokugo: "通", arti: "melalui, menghubungkan, berkomunikasi" },
      { jokugo: "信", arti: "kabar, informasi, pesan" }
    ]
  },
  {
    word: "発信",
    penjelasan: "Hubungan makna antar kanji 発 dan 信 menjadi 発信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirimkan atau menyampaikan informasi dari suatu pihak kepada pihak lain.”",
    nodes: [
      { jokugo: "発", arti: "mengeluarkan, mengirim, memulai" },
      { jokugo: "信", arti: "informasi, pesan" }
    ]
  },
  {
    word: "送信",
    penjelasan: "Hubungan makna antar kanji 送 dan 信 menjadi 送信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirimkan pesan, informasi, atau data kepada pihak lain.”",
    nodes: [
      { jokugo: "送", arti: "mengirim" },
      { jokugo: "信", arti: "informasi, pesan" }
    ]
  },
  {
    word: "返信",
    penjelasan: "Hubungan makna antar kanji 返 dan 信 menjadi 返信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirimkan kembali pesan atau surat sebagai balasan.”",
    nodes: [
      { jokugo: "返", arti: "mengembalikan, membalas" },
      { jokugo: "信", arti: "surat, pesan" }
    ]
  },
  {
    word: "交信",
    penjelasan: "Hubungan makna antar kanji 交 dan 信 menjadi 交信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “saling bertukar pesan atau informasi antara dua pihak atau lebih.”",
    nodes: [
      { jokugo: "交", arti: "saling, berhubungan, bertukar" },
      { jokugo: "信", arti: "pesan, informasi" }
    ]
  },
  {
    word: "信号",
    penjelasan: "Hubungan makna antar kanji 信 dan 号 menjadi 信号, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tanda atau isyarat yang digunakan untuk menyampaikan informasi atau pesan tertentu.”",
    nodes: [
      { jokugo: "信", arti: "tanda, isyarat" },
      { jokugo: "号", arti: "tanda, simbol, nomor" }
    ]
  },

  // 2) PENYAMPAIAN DAN PEWARISAN ILMU / AJARAN
  {
    word: "信念",
    penjelasan: "Hubungan makna antar kanji 信 dan 念 menjadi 信念, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keyakinan yang dipegang dengan kuat dan tidak mudah berubah.”",
    nodes: [
      { jokugo: "信", arti: "percaya, meyakini" },
      { jokugo: "念", arti: "pikiran, keyakinan, perhatian" }
    ]
  },
  {
    word: "信者",
    penjelasan: "Hubungan makna antar kanji 信 dan 者 menjadi 信者, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “orang yang percaya atau menganut suatu kepercayaan.”",
    nodes: [
      { jokugo: "信", arti: "percaya, meyakini" },
      { jokugo: "者", arti: "orang" }
    ]
  },
  {
    word: "信徒",
    penjelasan: "Hubungan makna antar kanji 信 dan 徒 menjadi 信徒, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “orang yang mengikuti atau menganut suatu kepercayaan.”",
    nodes: [
      { jokugo: "信", arti: "percaya, meyakini" },
      { jokugo: "徒", arti: "pengikut, penganut" }
    ]
  },
  {
    word: "信頼",
    penjelasan: "Hubungan makna antara kanji 信 dan 頼 menjadi 信頼, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kepercayaan terhadap seseorang atau sesuatu yang dianggap dapat diandalkan.”",
    nodes: [
      { jokugo: "信", arti: "percaya, kepercayaan" },
      { jokugo: "頼", arti: "mengandalkan, bergantung kepada" }
    ]
  },
  {
    word: "信用",
    penjelasan: "Hubungan makna antar kanji 信 dan 用 menjadi 信用, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kepercayaan atau penilaian bahwa seseorang atau sesuatu dapat dipercaya.”",
    nodes: [
      { jokugo: "信", arti: "percaya, kepercayaan" },
      { jokugo: "用", arti: "menggunakan, kegunaan" }
    ]
  },
  {
    word: "信任",
    penjelasan: "Hubungan makna antar kanji 信 dan 任 menjadi 信任, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memberikan kepercayaan kepada seseorang untuk menjalankan tugas atau tanggung jawab.”",
    nodes: [
      { jokugo: "信", arti: "percaya, kepercayaan" },
      { jokugo: "任", arti: "mempercayakan, menyerahkan tanggung jawab" }
    ]
  },
  {
    word: "信義",
    penjelasan: "Hubungan makna antar kanji 信 dan 義 menjadi 信義, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kepercayaan dan kesetiaan yang didasarkan pada kebenaran atau prinsip moral.”",
    nodes: [
      { jokugo: "信", arti: "percaya, dapat dipercaya" },
      { jokugo: "義", arti: "kebenaran, kewajiban moral" }
    ]
  },
  {
    word: "不信",
    penjelasan: "Hubungan makna antara kanji 不 dan 信 menjadi 不信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tidak percaya atau keadaan tidak memiliki kepercayaan terhadap seseorang atau sesuatu.”",
    nodes: [
      { jokugo: "不", arti: "tidak, bukan" },
      { jokugo: "信", arti: "percaya, kepercayaan" }
    ]
  },

  // 3) KEYAKINAN DAN KEPERCAYAAN DIRI
  {
    word: "確信",
    penjelasan: "Hubungan makna antar kanji 確 dan 信 menjadi 確信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keyakinan yang kuat atau kepastian terhadap sesuatu.”",
    nodes: [
      { jokugo: "確", arti: "pasti, jelas, memastikan" },
      { jokugo: "信", arti: "percaya, yakin" }
    ]
  },
  {
    word: "自信",
    penjelasan: "Hubungan makna antar kanji 自 dan 信 menjadi 自信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kepercayaan terhadap diri sendiri atau percaya pada kemampuan diri.”",
    nodes: [
      { jokugo: "自", arti: "diri sendiri" },
      { jokugo: "信", arti: "percaya, yakin" }
    ]
  },

  // 4) INFORMASI DAN DOKUMEN
  {
    word: "信書",
    penjelasan: "Hubungan makna antar kanji 信 dan 書 menjadi 信書, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “surat atau dokumen tertulis yang digunakan untuk menyampaikan pesan dari seseorang kepada orang lain.”",
    nodes: [
      { jokugo: "信", arti: "surat, kabar" },
      { jokugo: "書", arti: "tulisan, dokumen, surat" }
    ]
  }
];

async function run() {
  const char = "信";
  const kanji = await prisma.kanji.findFirst({ where: { character: char } });
  if (!kanji) {
    console.error(`Kanji ${char} not found in DB`);
    return;
  }

  const validWords = new Set<string>();
  customGraphShin.categories.forEach(cat => {
    cat.jukugos.forEach(jk => validWords.add(jk.word));
  });

  // 1. Clean obsolete Jukugo records for 信
  const existingJukugos = await prisma.jukugo.findMany({
    where: { kanjiId: kanji.id }
  });

  for (const j of existingJukugos) {
    if (!validWords.has(j.word)) {
      await prisma.kategoriKanji.deleteMany({ where: { jokugoId: j.id } });
      await prisma.semanticRelation.deleteMany({ where: { jukugoId: j.id } });
      await prisma.jukugo.delete({ where: { id: j.id } });
      console.log(`Deleted obsolete jukugo for 信: ${j.word}`);
    }
  }

  // 2. Delete existing KanjiGraphEdge for 信
  await prisma.kanjiGraphEdge.deleteMany({ where: { kanjiId: kanji.id } });

  // 3. Re-create KanjiGraphEdge
  const graphEdges: any[] = [];
  customGraphShin.categories.forEach((cat, catIdx) => {
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

  for (const cat of customGraphShin.categories) {
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

  // 6. Update SemanticRelation & SemanticRelationNode for kanji 信
  await prisma.semanticRelation.deleteMany({ where: { kanjiId: kanji.id } });

  for (const semItem of SHIN_SEMANTIC_DATA) {
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

  // 7. Update Grouping Quiz for kanji 信
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
