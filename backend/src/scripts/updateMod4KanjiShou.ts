import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const customGraphShou = {
  categories: [
    {
      title: "1. TEMPAT",
      color: "border-green-500",
      jukugos: [
        { word: "商店", reading: "しょうてん", meaning: "toko" },
        { word: "商店街", reading: "しょうてんがい", meaning: "kawasan pertokoan" }
      ]
    },
    {
      title: "2. PRODUK",
      color: "border-blue-500",
      jukugos: [
        { word: "商品", reading: "しょうひん", meaning: "barang / produk" }
      ]
    },
    {
      title: "3. KEGIATAN",
      color: "border-orange-500",
      jukugos: [
        { word: "商売", reading: "しょうばい", meaning: "bisnis / perdagangan" },
        { word: "商業", reading: "しょうぎょう", meaning: "perdagangan" },
        { word: "商取引", reading: "しょうとりひき", meaning: "transaksi perdagangan" }
      ]
    },
    {
      title: "4. PELAKU",
      color: "border-purple-500",
      jukugos: [
        { word: "商人", reading: "しょうにん", meaning: "pedagang" }
      ]
    },
    {
      title: "5. JENIS USAHA",
      color: "border-teal-500",
      jukugos: [
        { word: "商社", reading: "しょうしゃ", meaning: "perusahaan dagang" }
      ]
    }
  ]
};

const SHOU_SEMANTIC_DATA = [
  // 1) TEMPAT
  {
    word: "商店",
    penjelasan: "Hubungan makna antar kanji 商 dan 店 menjadi 商店, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “toko atau tempat untuk melakukan kegiatan perdagangan.”",
    nodes: [
      { jokugo: "商", arti: "perdagangan, bisnis" },
      { jokugo: "店", arti: "toko, tempat berjualan" }
    ]
  },
  {
    word: "商店街",
    penjelasan: "Hubungan makna antar kanji 商・店・街 menjadi 商店街, menunjukkan bahwa gabungan ketiga kanji tersebut membentuk makna “kawasan yang terdiri atas toko-toko atau tempat berlangsungnya kegiatan perdagangan.”",
    nodes: [
      { jokugo: "商", arti: "perdagangan, bisnis" },
      { jokugo: "店", arti: "toko" },
      { jokugo: "街", arti: "jalan, kawasan" }
    ]
  },

  // 2) PRODUK
  {
    word: "商品",
    penjelasan: "Hubungan makna antar kanji 商 dan 品 menjadi 商品, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “barang atau produk yang diperjualbelikan dalam kegiatan perdagangan.”",
    nodes: [
      { jokugo: "商", arti: "perdagangan, bisnis" },
      { jokugo: "品", arti: "barang, produk" }
    ]
  },

  // 3) KEGIATAN
  {
    word: "商売",
    penjelasan: "Hubungan makna antar kanji 商 dan 売 menjadi 商売, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan bisnis atau perdagangan yang dilakukan melalui aktivitas jual beli.”",
    nodes: [
      { jokugo: "商", arti: "perdagangan, bisnis" },
      { jokugo: "売", arti: "menjual, penjualan" }
    ]
  },
  {
    word: "商業",
    penjelasan: "Hubungan makna antar kanji 商 dan 業 menjadi 商業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan usaha atau bisnis dalam bidang perdagangan.”",
    nodes: [
      { jokugo: "商", arti: "perdagangan, bisnis" },
      { jokugo: "業", arti: "pekerjaan, usaha, kegiatan" }
    ]
  },
  {
    word: "商取引",
    penjelasan: "Hubungan makna antar kanji 商・取・引 menjadi 商取引, menunjukkan bahwa gabungan ketiga kanji tersebut membentuk makna “kegiatan transaksi yang dilakukan dalam perdagangan atau bisnis.”",
    nodes: [
      { jokugo: "商", arti: "perdagangan, bisnis" },
      { jokugo: "取", arti: "mengambil, memperoleh" },
      { jokugo: "引", arti: "menarik, melakukan transaksi" }
    ]
  },

  // 4) PELAKU
  {
    word: "商人",
    penjelasan: "Hubungan makna antar kanji 商 dan 人 menjadi 商人, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “orang yang melakukan kegiatan perdagangan atau berdagang.”",
    nodes: [
      { jokugo: "商", arti: "perdagangan, bisnis" },
      { jokugo: "人", arti: "orang" }
    ]
  },

  // 5) JENIS USAHA
  {
    word: "商社",
    penjelasan: "Hubungan makna antar kanji 商 dan 社 menjadi 商社, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perusahaan yang bergerak dalam kegiatan perdagangan atau bisnis.”",
    nodes: [
      { jokugo: "商", arti: "perdagangan, bisnis" },
      { jokugo: "社", arti: "perusahaan, organisasi" }
    ]
  }
];

async function run() {
  const char = "商";
  const kanji = await prisma.kanji.findFirst({ where: { character: char } });
  if (!kanji) {
    console.error(`Kanji ${char} not found in DB`);
    return;
  }

  const validWords = new Set<string>();
  customGraphShou.categories.forEach(cat => {
    cat.jukugos.forEach(jk => validWords.add(jk.word));
  });

  // 1. Clean obsolete Jukugo records for 商
  const existingJukugos = await prisma.jukugo.findMany({
    where: { kanjiId: kanji.id }
  });

  for (const j of existingJukugos) {
    if (!validWords.has(j.word)) {
      await prisma.kategoriKanji.deleteMany({ where: { jokugoId: j.id } });
      await prisma.semanticRelation.deleteMany({ where: { jukugoId: j.id } });
      await prisma.jukugo.delete({ where: { id: j.id } });
      console.log(`Deleted obsolete jukugo for 商: ${j.word}`);
    }
  }

  // 2. Delete existing KanjiGraphEdge for 商
  await prisma.kanjiGraphEdge.deleteMany({ where: { kanjiId: kanji.id } });

  // 3. Re-create KanjiGraphEdge
  const graphEdges: any[] = [];
  customGraphShou.categories.forEach((cat, catIdx) => {
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

  for (const cat of customGraphShou.categories) {
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

  // 6. Update SemanticRelation & SemanticRelationNode for kanji 商
  await prisma.semanticRelation.deleteMany({ where: { kanjiId: kanji.id } });

  for (const semItem of SHOU_SEMANTIC_DATA) {
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

  // 7. Update Grouping Quiz for kanji 商
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
