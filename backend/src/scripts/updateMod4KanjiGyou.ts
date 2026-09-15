import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const customGraphGyou = {
  categories: [
    {
      title: "1. PEKERJAAN / TUGAS",
      color: "border-blue-500",
      jukugos: [
        { word: "業務", reading: "ぎょうむ", meaning: "tugas / pekerjaan" },
        { word: "作業", reading: "さぎょう", meaning: "pekerjaan / tugas" },
        { word: "始業", reading: "しぎょう", meaning: "mulai kerja" },
        { word: "残業", reading: "ざんぎょう", meaning: "kerja lembur" },
        { word: "就業", reading: "しゅうぎょう", meaning: "bekerja / mulai bekerja" },
        { word: "失業", reading: "しつぎょう", meaning: "kehilangan pekerjaan / pengangguran" }
      ]
    },
    {
      title: "2. USAHA / BISNIS / DUNIA KERJA",
      color: "border-green-500",
      jukugos: [
        { word: "営業", reading: "えいぎょう", meaning: "usaha / bisnis / penjualan" },
        { word: "業者", reading: "ぎょうしゃ", meaning: "pelaku usaha / pedagang" },
        { word: "業界", reading: "ぎょうかい", meaning: "dunia usaha / industri" },
        { word: "家業", reading: "かぎょう", meaning: "usaha keluarga" },
        { word: "企業", reading: "きぎょう", meaning: "perusahaan / usaha" },
        { word: "事業", reading: "じぎょう", meaning: "usaha / kegiatan bisnis" },
        { word: "自営業", reading: "じえいぎょう", meaning: "usaha sendiri / wiraswasta" }
      ]
    },
    {
      title: "3. BIDANG INDUSTRI / PEKERJAAN",
      color: "border-purple-500",
      jukugos: [
        { word: "工業", reading: "こうぎょう", meaning: "industri" },
        { word: "農業", reading: "のうぎょう", meaning: "pertanian" },
        { word: "漁業", reading: "ぎょぎょう", meaning: "perikanan" },
        { word: "産業", reading: "さんぎょう", meaning: "industri" },
        { word: "商業", reading: "しょうぎょう", meaning: "perdagangan / bisnis" }
      ]
    },
    {
      title: "4. BENTUK / STATUS PEKERJAAN",
      color: "border-orange-500",
      jukugos: [
        { word: "本業", reading: "ほんぎょう", meaning: "pekerjaan utama" }
      ]
    }
  ]
};

const GYOU_SEMANTIC_DATA = [
  // 1) PEKERJAAN / TUGAS
  {
    word: "業務",
    penjelasan: "Hubungan makna antara kanji 業 dan 務 menjadi 業務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tugas atau pekerjaan yang menjadi tanggung jawab seseorang dalam suatu pekerjaan atau organisasi.”",
    nodes: [
      { jokugo: "業", arti: "pekerjaan, kegiatan" },
      { jokugo: "務", arti: "tugas, kewajiban" }
    ]
  },
  {
    word: "作業",
    penjelasan: "Hubungan makna antara kanji 作 dan 業 menjadi 作業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pekerjaan atau kegiatan yang dilakukan untuk menyelesaikan suatu tugas.”",
    nodes: [
      { jokugo: "作", arti: "mengerjakan, membuat" },
      { jokugo: "業", arti: "pekerjaan, kegiatan" }
    ]
  },
  {
    word: "始業",
    penjelasan: "Hubungan makna antara kanji 始 dan 業 menjadi 始業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “dimulainya kegiatan kerja atau waktu ketika pekerjaan dimulai.”",
    nodes: [
      { jokugo: "始", arti: "mulai" },
      { jokugo: "業", arti: "pekerjaan, kegiatan" }
    ]
  },
  {
    word: "残業",
    penjelasan: "Hubungan makna antara kanji 残 dan 業 menjadi 残業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pekerjaan yang dilakukan setelah waktu kerja normal berakhir atau pekerjaan lembur.”",
    nodes: [
      { jokugo: "残", arti: "tersisa, tetap" },
      { jokugo: "業", arti: "pekerjaan, kegiatan" }
    ]
  },
  {
    word: "就業",
    penjelasan: "Hubungan makna antara kanji 就 dan 業 menjadi 就業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan bekerja atau keadaan seseorang mulai menjalankan suatu pekerjaan.”",
    nodes: [
      { jokugo: "就", arti: "mulai melakukan, menjalankan" },
      { jokugo: "業", arti: "pekerjaan, kegiatan" }
    ]
  },
  {
    word: "失業",
    penjelasan: "Hubungan makna antara kanji 失 dan 業 menjadi 失業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keadaan seseorang kehilangan pekerjaan atau tidak memiliki pekerjaan.”",
    nodes: [
      { jokugo: "失", arti: "kehilangan" },
      { jokugo: "業", arti: "pekerjaan" }
    ]
  },

  // 2) USAHA / BISNIS / DUNIA KERJA
  {
    word: "営業",
    penjelasan: "Hubungan makna antara kanji 営 dan 業 menjadi 営業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan menjalankan usaha atau bisnis, termasuk kegiatan penjualan dan pelayanan.”",
    nodes: [
      { jokugo: "営", arti: "menjalankan, mengelola" },
      { jokugo: "業", arti: "usaha, kegiatan" }
    ]
  },
  {
    word: "業者",
    penjelasan: "Hubungan makna antara kanji 業 dan 者 menjadi 業者, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “orang atau pihak yang menjalankan suatu usaha atau pekerjaan tertentu.”",
    nodes: [
      { jokugo: "業", arti: "usaha, pekerjaan" },
      { jokugo: "者", arti: "orang, pelaku" }
    ]
  },
  {
    word: "業界",
    penjelasan: "Hubungan makna antara kanji 業 dan 界 menjadi 業界, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “suatu bidang atau lingkungan usaha dan industri tertentu.”",
    nodes: [
      { jokugo: "業", arti: "usaha, pekerjaan" },
      { jokugo: "界", arti: "dunia, bidang" }
    ]
  },
  {
    word: "家業",
    penjelasan: "Hubungan makna antara kanji 家 dan 業 menjadi 家業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “usaha atau pekerjaan yang dijalankan oleh suatu keluarga.”",
    nodes: [
      { jokugo: "家", arti: "keluarga, rumah" },
      { jokugo: "業", arti: "usaha, pekerjaan" }
    ]
  },
  {
    word: "企業",
    penjelasan: "Hubungan makna antara kanji 企 dan 業 menjadi 企業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perusahaan atau organisasi yang menjalankan kegiatan usaha.”",
    nodes: [
      { jokugo: "企", arti: "merencanakan, mengusahakan" },
      { jokugo: "業", arti: "usaha, kegiatan" }
    ]
  },
  {
    word: "事業",
    penjelasan: "Hubungan makna antara kanji 事 dan 業 menjadi 事業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “usaha atau kegiatan yang dilakukan secara terencana, terutama dalam bidang bisnis atau organisasi.”",
    nodes: [
      { jokugo: "事", arti: "hal, urusan, kegiatan" },
      { jokugo: "業", arti: "usaha, pekerjaan" }
    ]
  },
  {
    word: "自営業",
    penjelasan: "Hubungan makna antara kanji 自・営 dan 業 menjadi 自営業, menunjukkan bahwa gabungan ketiga kanji tersebut membentuk makna “usaha yang dijalankan dan dikelola oleh seseorang untuk dirinya sendiri.”",
    nodes: [
      { jokugo: "自", arti: "diri sendiri" },
      { jokugo: "営", arti: "menjalankan, mengelola" },
      { jokugo: "業", arti: "usaha, pekerjaan" }
    ]
  },

  // 3) BIDANG INDUSTRI / PEKERJAAN
  {
    word: "工業",
    penjelasan: "Hubungan makna antara kanji 工 dan 業 menjadi 工業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bidang industri yang berkaitan dengan kegiatan produksi dan pengolahan barang.”",
    nodes: [
      { jokugo: "工", arti: "pekerjaan, teknik, industri" },
      { jokugo: "業", arti: "usaha, kegiatan" }
    ]
  },
  {
    word: "農業",
    penjelasan: "Hubungan makna antara kanji 農 dan 業 menjadi 農業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bidang usaha atau pekerjaan yang berkaitan dengan pertanian.”",
    nodes: [
      { jokugo: "農", arti: "pertanian" },
      { jokugo: "業", arti: "usaha, pekerjaan" }
    ]
  },
  {
    word: "漁業",
    penjelasan: "Hubungan makna antara kanji 漁 dan 業 menjadi 漁業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bidang usaha atau pekerjaan yang berkaitan dengan penangkapan dan pemanfaatan hasil perikanan.”",
    nodes: [
      { jokugo: "漁", arti: "menangkap ikan, perikanan" },
      { jokugo: "業", arti: "usaha, pekerjaan" }
    ]
  },
  {
    word: "産業",
    penjelasan: "Hubungan makna antara kanji 産 dan 業 menjadi 産業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan atau bidang ekonomi yang menghasilkan barang atau jasa.”",
    nodes: [
      { jokugo: "産", arti: "menghasilkan, produksi" },
      { jokugo: "業", arti: "usaha, kegiatan" }
    ]
  },
  {
    word: "商業",
    penjelasan: "Hubungan makna antara kanji 商 dan 業 menjadi 商業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan usaha yang berkaitan dengan perdagangan dan jual beli barang atau jasa.”",
    nodes: [
      { jokugo: "商", arti: "perdagangan, jual beli" },
      { jokugo: "業", arti: "usaha, kegiatan" }
    ]
  },

  // 4) BENTUK / STATUS PEKERJAAN
  {
    word: "本業",
    penjelasan: "Hubungan makna antara kanji 本 dan 業 menjadi 本業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pekerjaan atau usaha utama yang menjadi kegiatan pokok seseorang.”",
    nodes: [
      { jokugo: "本", arti: "utama, pokok" },
      { jokugo: "業", arti: "pekerjaan, usaha" }
    ]
  }
];

async function run() {
  const char = "業";
  const kanji = await prisma.kanji.findFirst({ where: { character: char } });
  if (!kanji) {
    console.error(`Kanji ${char} not found in DB`);
    return;
  }

  const validWords = new Set<string>();
  customGraphGyou.categories.forEach(cat => {
    cat.jukugos.forEach(jk => validWords.add(jk.word));
  });

  // 1. Clean obsolete Jukugo records for 業
  const existingJukugos = await prisma.jukugo.findMany({
    where: { kanjiId: kanji.id }
  });

  for (const j of existingJukugos) {
    if (!validWords.has(j.word)) {
      await prisma.kategoriKanji.deleteMany({ where: { jokugoId: j.id } });
      await prisma.semanticRelation.deleteMany({ where: { jukugoId: j.id } });
      await prisma.jukugo.delete({ where: { id: j.id } });
      console.log(`Deleted obsolete jukugo for 業: ${j.word}`);
    }
  }

  // 2. Delete existing KanjiGraphEdge for 業
  await prisma.kanjiGraphEdge.deleteMany({ where: { kanjiId: kanji.id } });

  // 3. Re-create KanjiGraphEdge
  const graphEdges: any[] = [];
  customGraphGyou.categories.forEach((cat, catIdx) => {
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

  for (const cat of customGraphGyou.categories) {
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

  // 6. Update SemanticRelation & SemanticRelationNode for kanji 業
  await prisma.semanticRelation.deleteMany({ where: { kanjiId: kanji.id } });

  for (const semItem of GYOU_SEMANTIC_DATA) {
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

  // 7. Update Grouping Quiz for kanji 業
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
