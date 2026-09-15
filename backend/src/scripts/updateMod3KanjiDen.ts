import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const customGraphDen = {
  categories: [
    {
      title: "1. PENYAMPAIAN PESAN DAN INFORMASI",
      color: "border-red-500",
      jukugos: [
        { word: "伝言", reading: "でんごん", meaning: "pesan / titipan pesan" },
        { word: "伝達", reading: "でんたつ", meaning: "penyampaian" },
        { word: "伝聞", reading: "でんぶん", meaning: "kabar" },
        { word: "伝令", reading: "でんれい", meaning: "utusan" }
      ]
    },
    {
      title: "2. PENYAMPAIAN DAN PEWARISAN ILMU / AJARAN",
      color: "border-orange-500",
      jukugos: [
        { word: "伝授", reading: "でんじゅ", meaning: "mengajarkan" },
        { word: "伝受", reading: "でんじゅ", meaning: "menerima dan meneruskan sesuatu" },
        { word: "伝習", reading: "でんしゅう", meaning: "mempelajari" },
        { word: "伝道", reading: "でんどう", meaning: "menyebarkan ajaran" }
      ]
    },
    {
      title: "3. PEWARISAN TRADISI DAN CERITA",
      color: "border-teal-500",
      jukugos: [
        { word: "伝統", reading: "でんとう", meaning: "tradisi" },
        { word: "伝説", reading: "でんせつ", meaning: "legenda" }
      ]
    },
    {
      title: "4. RIWAYAT DAN INFORMASI TERTULIS",
      color: "border-blue-500",
      jukugos: [
        { word: "伝記", reading: "でんき", meaning: "biografi / riwayat hidup" },
        { word: "自伝", reading: "じでん", meaning: "autobiografi" },
        { word: "伝書", reading: "でんしょ", meaning: "dokumen" },
        { word: "伝写", reading: "でんしゃ", meaning: "menyalin" }
      ]
    },
    {
      title: "5. PENGIRIMAN DAN PENERUSAN",
      color: "border-green-500",
      jukugos: [
        { word: "伝送", reading: "でんそう", meaning: "pengiriman / transmisi" }
      ]
    }
  ]
};

const DEN_SEMANTIC_DATA = [
  // 1) PENYAMPAIAN PESAN DAN INFORMASI
  {
    word: "伝言",
    penjelasan: "Hubungan makna antar kanji 伝 dan 言 menjadi 伝言, menunjukkan bahwa penyampaian (伝) dilakukan melalui kata atau ucapan (言), sehingga membentuk makna “pesan atau titipan pesan.”",
    nodes: [
      { jokugo: "伝", arti: "menyampaikan, meneruskan" },
      { jokugo: "言", arti: "kata, ucapan, pesan" }
    ]
  },
  {
    word: "伝達",
    penjelasan: "Hubungan makna antar kanji 伝 dan 達 menjadi 伝達, menunjukkan proses menyampaikan sesuatu (伝) hingga informasi tersebut sampai kepada pihak lain (達), sehingga membentuk makna “penyampaian atau penyebaran informasi.”",
    nodes: [
      { jokugo: "伝", arti: "menyampaikan, meneruskan" },
      { jokugo: "達", arti: "mencapai, sampai kepada" }
    ]
  },
  {
    word: "伝聞",
    penjelasan: "Hubungan makna antar kanji 伝 dan 聞 menjadi 伝聞, menunjukkan informasi yang diteruskan (伝) melalui apa yang didengar (聞), sehingga membentuk makna “kabar yang didengar dari orang lain.”",
    nodes: [
      { jokugo: "伝", arti: "menyampaikan, meneruskan" },
      { jokugo: "聞", arti: "mendengar, mendengarkan" }
    ]
  },
  {
    word: "伝令",
    penjelasan: "Hubungan makna antar kanji 伝 dan 令 menjadi 伝令, menunjukkan seseorang yang menyampaikan (伝) perintah atau instruksi (令) kepada pihak lain, sehingga membentuk makna “pembawa atau penyampai pesan/perintah.”",
    nodes: [
      { jokugo: "伝", arti: "menyampaikan, meneruskan" },
      { jokugo: "令", arti: "perintah, instruksi" }
    ]
  },

  // 2) PENYAMPAIAN DAN PEWARISAN ILMU / AJARAN
  {
    word: "伝授",
    penjelasan: "Hubungan makna antar kanji 伝 dan 授 menjadi 伝授, menunjukkan proses meneruskan atau mewariskan (伝) pengetahuan/keterampilan dengan cara mengajarkannya (授), sehingga membentuk makna “mengajarkan atau mewariskan ilmu/keterampilan.”",
    nodes: [
      { jokugo: "伝", arti: "meneruskan" },
      { jokugo: "授", arti: "memberikan, mengajarkan" }
    ]
  },
  {
    word: "伝受",
    penjelasan: "Hubungan makna antar kanji 伝 dan 受 menjadi 伝受, menunjukkan proses menerima (受) sesuatu yang diteruskan atau diwariskan (伝), sehingga membentuk makna “menerima dan meneruskan sesuatu.”",
    nodes: [
      { jokugo: "伝", arti: "meneruskan, mewariskan" },
      { jokugo: "受", arti: "menerima" }
    ]
  },
  {
    word: "伝習",
    penjelasan: "Hubungan makna antar kanji 伝 dan 習 menjadi 伝習, menunjukkan kegiatan mempelajari (習) sesuatu yang telah diwariskan atau diteruskan (伝), sehingga membentuk makna “mempelajari sesuatu yang diwariskan/diajarkan.”",
    nodes: [
      { jokugo: "伝", arti: "meneruskan, mewariskan" },
      { jokugo: "習", arti: "belajar, mempelajari" }
    ]
  },
  {
    word: "伝道",
    penjelasan: "Hubungan makna antar kanji 伝 dan 道 menjadi 伝道, menunjukkan kegiatan menyampaikan atau meneruskan (伝) ajaran atau doktrin (道), sehingga membentuk makna “menyebarkan atau menyampaikan ajaran.”",
    nodes: [
      { jokugo: "伝", arti: "meneruskan, menyampaikan" },
      { jokugo: "道", arti: "jalan; ajaran/doktrin" }
    ]
  },

  // 3) PEWARISAN TRADISI DAN CERITA
  {
    word: "伝統",
    penjelasan: "Hubungan makna antar kanji 伝 dan 統 menjadi 伝統, menunjukkan sesuatu yang diteruskan (伝) dan dipertahankan sebagai satu kesatuan dari generasi ke generasi (統), sehingga membentuk makna “tradisi.”",
    nodes: [
      { jokugo: "伝", arti: "meneruskan, mewariskan" },
      { jokugo: "統", arti: "menyatukan, meneruskan sebagai satu kesatuan" }
    ]
  },
  {
    word: "伝説",
    penjelasan: "Hubungan makna antar kanji 伝 dan 説 menjadi 伝説, menunjukkan cerita atau penjelasan (説) yang diteruskan dan diwariskan (伝) dari generasi ke generasi, sehingga membentuk makna “legenda.”",
    nodes: [
      { jokugo: "伝", arti: "meneruskan, menyampaikan" },
      { jokugo: "説", arti: "cerita, penjelasan" }
    ]
  },

  // 4) RIWAYAT DAN INFORMASI TERTULIS
  {
    word: "伝記",
    penjelasan: "Hubungan makna antar kanji 伝 dan 記 menjadi 伝記, menunjukkan riwayat seseorang yang disampaikan melalui catatan tertulis (記), sehingga membentuk makna “biografi atau riwayat hidup.”",
    nodes: [
      { jokugo: "伝", arti: "meneruskan, menyampaikan" },
      { jokugo: "記", arti: "mencatat, catatan" }
    ]
  },
  {
    word: "自伝",
    penjelasan: "Hubungan makna antar kanji 自 dan 伝 menjadi 自伝, menunjukkan riwayat tentang diri sendiri (自) yang disampaikan atau dituliskan (伝), sehingga membentuk makna “autobiografi.”",
    nodes: [
      { jokugo: "自", arti: "diri sendiri" },
      { jokugo: "伝", arti: "menyampaikan, meneruskan" }
    ]
  },
  {
    word: "伝書",
    penjelasan: "Hubungan makna antar kanji 伝 dan 書 menjadi 伝書, menunjukkan tulisan atau dokumen (書) yang diteruskan atau diwariskan (伝), sehingga membentuk makna “tulisan/dokumen yang diwariskan atau disampaikan.”",
    nodes: [
      { jokugo: "伝", arti: "meneruskan, menyampaikan" },
      { jokugo: "書", arti: "menulis, tulisan/dokumen" }
    ]
  },
  {
    word: "伝写",
    penjelasan: "Hubungan makna antar kanji 伝 dan 写 menjadi 伝写, menunjukkan proses meneruskan isi tulisan (伝) dengan cara menyalin atau menggandakannya (写), sehingga membentuk makna “menyalin atau meneruskan tulisan.”",
    nodes: [
      { jokugo: "伝", arti: "meneruskan, menyampaikan" },
      { jokugo: "写", arti: "menyalin, menggandakan" }
    ]
  },

  // 5) PENGIRIMAN DAN PENERUSAN
  {
    word: "伝送",
    penjelasan: "Hubungan makna antar kanji 伝 dan 送 menjadi 伝送, menunjukkan sesuatu yang diteruskan atau disampaikan (伝) melalui proses pengiriman (送), sehingga membentuk makna “pengiriman atau transmisi.”",
    nodes: [
      { jokugo: "伝", arti: "meneruskan, menyampaikan" },
      { jokugo: "送", arti: "mengirim, mengantarkan" }
    ]
  }
];

async function run() {
  const char = "伝";
  const kanji = await prisma.kanji.findFirst({ where: { character: char } });
  if (!kanji) {
    console.error(`Kanji ${char} not found in DB`);
    return;
  }

  const validWords = new Set<string>();
  customGraphDen.categories.forEach(cat => {
    cat.jukugos.forEach(jk => validWords.add(jk.word));
  });

  // 1. Clean obsolete Jukugo records for 伝
  const existingJukugos = await prisma.jukugo.findMany({
    where: { kanjiId: kanji.id }
  });

  for (const j of existingJukugos) {
    if (!validWords.has(j.word)) {
      await prisma.kategoriKanji.deleteMany({ where: { jokugoId: j.id } });
      await prisma.semanticRelation.deleteMany({ where: { jukugoId: j.id } });
      await prisma.jukugo.delete({ where: { id: j.id } });
      console.log(`Deleted obsolete jukugo for 伝: ${j.word}`);
    }
  }

  // 2. Delete existing KanjiGraphEdge for 伝
  await prisma.kanjiGraphEdge.deleteMany({ where: { kanjiId: kanji.id } });

  // 3. Re-create KanjiGraphEdge
  const graphEdges: any[] = [];
  customGraphDen.categories.forEach((cat, catIdx) => {
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

  for (const cat of customGraphDen.categories) {
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

  // 6. Update SemanticRelation & SemanticRelationNode for kanji 伝
  await prisma.semanticRelation.deleteMany({ where: { kanjiId: kanji.id } });

  for (const semItem of DEN_SEMANTIC_DATA) {
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

  // 7. Update Grouping Quiz for kanji 伝
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
