import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const customGraphSou = {
  categories: [
    {
      title: "1. PENGIRIMAN INFORMASI / PESAN",
      color: "border-red-500",
      jukugos: [
        { word: "送信", reading: "そうしん", meaning: "mengirim pesan / mengirimkan (data/informasi)" },
        { word: "電送", reading: "でんそう", meaning: "pengiriman melalui media elektronik / transmisi elektronik" },
        { word: "伝送", reading: "でんそう", meaning: "meneruskan / mentransmisikan informasi, sinyal" },
        { word: "放送", reading: "ほうそう", meaning: "siaran / menyebarkan informasi kepada banyak orang" }
      ]
    },
    {
      title: "2. PENGIRIMAN / PENGANTARAN BENDA / BARANG",
      color: "border-orange-500",
      jukugos: [
        { word: "発送", reading: "はっそう", meaning: "mengirim / mengeluarkan kiriman" },
        { word: "直送", reading: "ちょくそう", meaning: "pengiriman langsung ke tujuan" },
        { word: "送付", reading: "そうふ", meaning: "mengirimkan (barang, dokumen, surat, dll.)" },
        { word: "郵送", reading: "ゆうそう", meaning: "mengirim melalui pos / surat" },
        { word: "配送", reading: "はいそう", meaning: "pengiriman (barang, paket, pesanan)" },
        { word: "輸送", reading: "ゆそう", meaning: "mengangkut / mengirim barang atau penumpang" },
        { word: "移送", reading: "いそう", meaning: "memindahkan / mengirim ke tempat lain" },
        { word: "回送", reading: "かいそう", meaning: "mengirim kembali / mengirim ke tempat asal atau tempat lain" },
        { word: "転送", reading: "てんそう", meaning: "meneruskan / mengalihkan kiriman ke tujuan lain" },
        { word: "押送", reading: "おうそう", meaning: "mengawal / mengantar seseorang dengan kendaraan resmi" }
      ]
    },
    {
      title: "3. PENYERAHAN / PENGIRIMAN KEPADA PIHAK BERWENANG",
      color: "border-green-500",
      jukugos: [
        { word: "送検", reading: "そうけん", meaning: "mengirim tersangka / berkas perkara ke jaksa (untuk dituntut)" },
        { word: "送信", reading: "そうしん", meaning: "menyerahkan / mengirim kepada pihak berwenang" },
        { word: "護送", reading: "ごそう", meaning: "mengawal / mengantar terdakwa, tahanan, dsb." },
        { word: "押送", reading: "おうそう", meaning: "mengawal / mengantar seseorang dengan kendaraan resmi" }
      ]
    },
    {
      title: "4. MENGIRIM / MELEPAS ORANG YANG PERGI",
      color: "border-purple-500",
      jukugos: [
        { word: "送別", reading: "そうべつ", meaning: "perpisahan / mengantar seseorang yang pergi" },
        { word: "歓送", reading: "かんそう", meaning: "melepas / mengantar seseorang dengan ucapan selamat atau penghormatan" },
        { word: "送辞", reading: "そうじ", meaning: "pidato perpisahan / ucapan saat mengantar pergi" },
        { word: "押送", reading: "おうそう", meaning: "mengantar / melepas jenazah (dalam konteks pemakaman)" }
      ]
    },
    {
      title: "5. PENGIRIMAN MELALUI JALUR KHUSUS",
      color: "border-blue-500",
      jukugos: [
        { word: "陸送", reading: "りくそう", meaning: "pengiriman melalui jalur darat" },
        { word: "電送", reading: "でんそう", meaning: "pengiriman melalui jalur listrik / transmisi elektronik" }
      ]
    }
  ]
};

const SOU_SEMANTIC_DATA = [
  // 1) PENGIRIMAN INFORMASI / PESAN
  {
    word: "送信",
    penjelasan: "Hubungan makna antar kanji 送 dan 信 menjadi 送信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirim pesan atau mengirimkan data/informasi.”",
    nodes: [
      { jokugo: "送", arti: "mengirim, menyampaikan" },
      { jokugo: "信", arti: "pesan, informasi; kepercayaan" }
    ]
  },
  {
    word: "電送",
    penjelasan: "Hubungan makna antar kanji 電 dan 送 menjadi 電送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengiriman melalui media elektronik atau transmisi elektronik.”",
    nodes: [
      { jokugo: "電", arti: "listrik, elektronik" },
      { jokugo: "送", arti: "mengirim, mentransmisikan" }
    ]
  },
  {
    word: "伝送",
    penjelasan: "Hubungan makna antar kanji 伝 dan 送 menjadi 伝送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “meneruskan atau mentransmisikan informasi/sinyal.”",
    nodes: [
      { jokugo: "伝", arti: "meneruskan, menyampaikan" },
      { jokugo: "送", arti: "mengirim, mentransmisikan" }
    ]
  },
  {
    word: "放送",
    penjelasan: "Hubungan makna antar kanji 放 dan 送 menjadi 放送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “siaran atau penyebaran informasi kepada banyak orang.”",
    nodes: [
      { jokugo: "放", arti: "melepaskan, menyebarkan" },
      { jokugo: "送", arti: "mengirim, menyampaikan" }
    ]
  },

  // 2) PENGIRIMAN / PENGANTARAN BENDA / BARANG
  {
    word: "発送",
    penjelasan: "Hubungan makna antar kanji 発 dan 送 menjadi 発送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirim atau mengeluarkan kiriman.”",
    nodes: [
      { jokugo: "発", arti: "mengeluarkan, memulai, mengirim" },
      { jokugo: "送", arti: "mengirim, mengantarkan" }
    ]
  },
  {
    word: "直送",
    penjelasan: "Hubungan makna antar kanji 直 dan 送 menjadi 直送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengiriman langsung ke tujuan.”",
    nodes: [
      { jokugo: "直", arti: "langsung" },
      { jokugo: "送", arti: "mengirim, mengantarkan" }
    ]
  },
  {
    word: "送付",
    penjelasan: "Hubungan makna antar kanji 送 dan 付 menjadi 送付, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirimkan barang, dokumen, surat, dan sebagainya.”",
    nodes: [
      { jokugo: "送", arti: "mengirim, mengantarkan" },
      { jokugo: "付", arti: "menyerahkan, melampirkan" }
    ]
  },
  {
    word: "郵送",
    penjelasan: "Hubungan makna antar kanji 郵 dan 送 menjadi 郵送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirim melalui pos atau surat.”",
    nodes: [
      { jokugo: "郵", arti: "pos" },
      { jokugo: "送", arti: "mengirim" }
    ]
  },
  {
    word: "配送",
    penjelasan: "Hubungan makna antar kanji 配 dan 送 menjadi 配送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengiriman barang, paket, atau pesanan.”",
    nodes: [
      { jokugo: "配", arti: "membagikan, mendistribusikan" },
      { jokugo: "送", arti: "mengirim, mengantarkan" }
    ]
  },
  {
    word: "輸送",
    penjelasan: "Hubungan makna antar kanji 輸 dan 送 menjadi 輸送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengangkut atau mengirim barang atau penumpang.”",
    nodes: [
      { jokugo: "輸", arti: "mengangkut, memindahkan" },
      { jokugo: "送", arti: "mengirim, mengantarkan" }
    ]
  },
  {
    word: "移送",
    penjelasan: "Hubungan makna antar kanji 移 dan 送 menjadi 移送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memindahkan atau mengirim ke tempat lain.”",
    nodes: [
      { jokugo: "移", arti: "memindahkan" },
      { jokugo: "送", arti: "mengirim, mengantarkan" }
    ]
  },
  {
    word: "回送",
    penjelasan: "Hubungan makna antar kanji 回 dan 送 menjadi 回送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirim kembali atau mengirim ke tempat asal/tempat lain.”",
    nodes: [
      { jokugo: "回", arti: "kembali, berputar" },
      { jokugo: "送", arti: "mengirim, mengantarkan" }
    ]
  },
  {
    word: "転送",
    penjelasan: "Hubungan makna antar kanji 転 dan 送 menjadi 転送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “meneruskan atau mengalihkan kiriman ke tujuan lain.”",
    nodes: [
      { jokugo: "転", arti: "berpindah, mengalihkan" },
      { jokugo: "送", arti: "mengirim, meneruskan" }
    ]
  },
  {
    word: "押送",
    penjelasan: "Hubungan makna antar kanji 押 dan 送 menjadi 押送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengawal atau mengantar seseorang dengan kendaraan resmi.”",
    nodes: [
      { jokugo: "押", arti: "mengawal, membawa secara paksa" },
      { jokugo: "送", arti: "mengantar, membawa" }
    ]
  },

  // 3) PENYERAHAN / PENGIRIMAN KEPADA PIHAK BERWENANG
  {
    word: "送検",
    penjelasan: "Hubungan makna antar kanji 送 dan 検 menjadi 送検, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirim tersangka atau berkas perkara ke jaksa untuk dituntut.”",
    nodes: [
      { jokugo: "送", arti: "mengirim, menyerahkan" },
      { jokugo: "検", arti: "pemeriksaan, penyelidikan" }
    ]
  },
  {
    word: "護送",
    penjelasan: "Hubungan makna antar kanji 護 dan 送 menjadi 護送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengawal atau mengantar terdakwa, tahanan, dsb.”",
    nodes: [
      { jokugo: "護", arti: "melindungi, mengawal" },
      { jokugo: "送", arti: "mengantar, membawa" }
    ]
  },

  // 4) MENGIRIM / MELEPAS ORANG YANG PERGI
  {
    word: "送別",
    penjelasan: "Hubungan makna antar kanji 送 dan 別 menjadi 送別, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perpisahan atau mengantar seseorang yang pergi.”",
    nodes: [
      { jokugo: "送", arti: "mengantar, melepas" },
      { jokugo: "別", arti: "berpisah, perpisahan" }
    ]
  },
  {
    word: "歓送",
    penjelasan: "Hubungan makna antar kanji 歓 dan 送 menjadi 歓送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “melepas atau mengantar seseorang dengan ucapan selamat atau penghormatan.”",
    nodes: [
      { jokugo: "歓", arti: "senang, menyambut dengan gembira" },
      { jokugo: "送", arti: "mengantar, melepas" }
    ]
  },
  {
    word: "送辞",
    penjelasan: "Hubungan makna antar kanji 送 dan 辞 menjadi 送辞, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pidato perpisahan atau ucapan saat mengantar pergi.”",
    nodes: [
      { jokugo: "送", arti: "mengantar, melepas" },
      { jokugo: "辞", arti: "kata-kata, ucapan" }
    ]
  },

  // 5) PENGIRIMAN MELALUI JALUR KHUSUS
  {
    word: "陸送",
    penjelasan: "Hubungan makna antar kanji 陸 dan 送 menjadi 陸送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengiriman melalui jalur darat.”",
    nodes: [
      { jokugo: "陸", arti: "darat" },
      { jokugo: "送", arti: "mengirim, mengangkut" }
    ]
  }
];

async function run() {
  const char = "送";
  const kanji = await prisma.kanji.findFirst({ where: { character: char } });
  if (!kanji) {
    console.error(`Kanji ${char} not found in DB`);
    return;
  }

  const validWords = new Set<string>();
  customGraphSou.categories.forEach(cat => {
    cat.jukugos.forEach(jk => validWords.add(jk.word));
  });

  // 1. Clean obsolete Jukugo records for 送
  const existingJukugos = await prisma.jukugo.findMany({
    where: { kanjiId: kanji.id }
  });

  for (const j of existingJukugos) {
    if (!validWords.has(j.word)) {
      await prisma.kategoriKanji.deleteMany({ where: { jokugoId: j.id } });
      await prisma.semanticRelation.deleteMany({ where: { jukugoId: j.id } });
      await prisma.jukugo.delete({ where: { id: j.id } });
      console.log(`Deleted obsolete jukugo for 送: ${j.word}`);
    }
  }

  // 2. Delete existing KanjiGraphEdge for 送
  await prisma.kanjiGraphEdge.deleteMany({ where: { kanjiId: kanji.id } });

  // 3. Re-create KanjiGraphEdge
  const graphEdges: any[] = [];
  customGraphSou.categories.forEach((cat, catIdx) => {
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

  for (const cat of customGraphSou.categories) {
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

  // 6. Update SemanticRelation & SemanticRelationNode for kanji 送
  await prisma.semanticRelation.deleteMany({ where: { kanjiId: kanji.id } });

  for (const semItem of SOU_SEMANTIC_DATA) {
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

  // 7. Update Grouping Quiz for kanji 送
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
