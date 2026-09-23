import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const customGraphShi = {
  categories: [
    {
      title: "1. Awal Waktu",
      description: "Kelompok ini menunjukkan makna yang berkaitan dengan awal suatu rentang waktu.",
      color: "border-green-500",
      jukugos: [
        { word: "年始", reading: "ねんし", meaning: "awal tahun" },
        { word: "年初", reading: "ねんしょ", meaning: "awal tahun" },
        { word: "月始", reading: "げっし", meaning: "awal bulan" }
      ]
    },
    {
      title: "2. Mulai",
      description: "Kelompok ini menunjukkan makna yang berkaitan dengan dimulainya suatu kegiatan, pekerjaan, atau gerakan.",
      color: "border-blue-500",
      jukugos: [
        { word: "開始", reading: "かいし", meaning: "mulai" },
        { word: "始業", reading: "しぎょう", meaning: "mulai bekerja" },
        { word: "始動", reading: "しどう", meaning: "mulai bergerak" }
      ]
    },
    {
      title: "3. Awal–Akhir",
      description: "Kelompok ini menunjukkan makna yang berkaitan dengan keseluruhan rentang suatu keadaan dari awal hingga akhir.",
      color: "border-orange-500",
      jukugos: [
        { word: "終始", reading: "しゅうし", meaning: "dari awal sampai akhir" },
        { word: "始終", reading: "しじゅう", meaning: "selalu" }
      ]
    },
    {
      title: "4. Penyelesaian",
      description: "Kelompok ini menunjukkan makna yang berkaitan dengan penanganan suatu urusan sampai pada bagian akhirnya.",
      color: "border-purple-500",
      jukugos: [
        { word: "始末", reading: "しまつ", meaning: "penyelesaian" }
      ]
    }
  ]
};

const SHI_SEMANTIC_DATA = [
  // 1. Awal Waktu
  {
    word: "年始",
    penjelasan: "Hubungan makna antar kanji 年 dan 始 menjadi 年始, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “awal suatu tahun.”",
    nodes: [
      { jokugo: "年", arti: "tahun" },
      { jokugo: "始", arti: "awal, mulai" }
    ]
  },
  {
    word: "年初",
    penjelasan: "Hubungan makna antar kanji 年 dan 初 menjadi 年初, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “awal atau permulaan suatu tahun.”",
    nodes: [
      { jokugo: "年", arti: "tahun; periode waktu satu tahun" },
      { jokugo: "初", arti: "awal; pertama; permulaan" }
    ]
  },
  {
    word: "月始",
    penjelasan: "Hubungan makna antar kanji 月 dan 始 menjadi 月始, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “awal suatu bulan.”",
    nodes: [
      { jokugo: "月", arti: "bulan" },
      { jokugo: "始", arti: "awal, mulai" }
    ]
  },
  // 2. Mulai
  {
    word: "開始",
    penjelasan: "Hubungan makna antar kanji 開 dan 始 menjadi 開始, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memulai atau membuka dimulainya suatu kegiatan.”",
    nodes: [
      { jokugo: "開", arti: "membuka" },
      { jokugo: "始", arti: "mulai" }
    ]
  },
  {
    word: "始業",
    penjelasan: "Hubungan makna antar kanji 始 dan 業 menjadi 始業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mulainya suatu pekerjaan atau kegiatan.”",
    nodes: [
      { jokugo: "始", arti: "mulai" },
      { jokugo: "業", arti: "pekerjaan, kegiatan" }
    ]
  },
  {
    word: "始動",
    penjelasan: "Hubungan makna antar kanji 始 dan 動 menjadi 始動, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mulai bergerak atau mulai beroperasi.”",
    nodes: [
      { jokugo: "始", arti: "mulai" },
      { jokugo: "動", arti: "bergerak" }
    ]
  },
  // 3. Awal–Akhir
  {
    word: "終始",
    penjelasan: "Hubungan makna antar kanji 終 dan 始 menjadi 終始, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keadaan yang berlangsung dari awal sampai akhir.”",
    nodes: [
      { jokugo: "終", arti: "akhir" },
      { jokugo: "始", arti: "awal" }
    ]
  },
  {
    word: "始終",
    penjelasan: "Hubungan makna antar kanji 始 dan 終 menjadi 始終, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sesuatu yang berlangsung terus dari awal sampai akhir, sehingga bermakna selalu.”",
    nodes: [
      { jokugo: "始", arti: "awal" },
      { jokugo: "終", arti: "akhir" }
    ]
  },
  // 4. Penyelesaian
  {
    word: "始末",
    penjelasan: "Hubungan makna antar kanji 始 dan 末 menjadi 始末, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menangani suatu urusan sampai selesai.”",
    nodes: [
      { jokugo: "始", arti: "awal" },
      { jokugo: "末", arti: "akhir" }
    ]
  }
];

const CONSTITUENT_KANJI_DATA = [
  {
    character: "年",
    romaji: "NEN",
    meaning: "tahun",
    baseMeaning: "tahun, masa atau periode satu tahun.",
    bushuu: "干",
    kunyomi: "とし",
    onyomi: "ネン"
  },
  {
    character: "初",
    romaji: "SHO",
    meaning: "awal, permulaan",
    baseMeaning: "awal, pertama kali, atau tahap permulaan.",
    bushuu: "刀",
    kunyomi: "はじ・め、はつ",
    onyomi: "ショ"
  },
  {
    character: "月",
    romaji: "GETSU",
    meaning: "bulan",
    baseMeaning: "bulan (kalender) atau satelit alami bumi.",
    bushuu: "月",
    kunyomi: "つき",
    onyomi: "ゲツ、ガツ"
  },
  {
    character: "開",
    romaji: "KAI",
    meaning: "membuka, memulai",
    baseMeaning: "membuka atau memulai suatu kegiatan.",
    bushuu: "門",
    kunyomi: "ひら・く、あ・ける",
    onyomi: "カイ"
  },
  {
    character: "業",
    romaji: "GYOU",
    meaning: "pekerjaan, kegiatan",
    baseMeaning: "pekerjaan, usaha, bisnis, atau kegiatan profesional.",
    bushuu: "木",
    kunyomi: "わざ",
    onyomi: "ギョウ、ゴウ"
  },
  {
    character: "動",
    romaji: "DOU",
    meaning: "bergerak",
    baseMeaning: "bergerak atau mulai beroperasi.",
    bushuu: "力",
    kunyomi: "うご・く、うご・かす",
    onyomi: "ドウ"
  },
  {
    character: "終",
    romaji: "SHUU",
    meaning: "akhir, selesai",
    baseMeaning: "berakhir, selesai, atau bagian penghabisan.",
    bushuu: "糸",
    kunyomi: "お・わる、お・える",
    onyomi: "シュウ"
  },
  {
    character: "末",
    romaji: "MATSU",
    meaning: "akhir, penyelesaian",
    baseMeaning: "ujung, bagian akhir, atau penanganan hingga selesai.",
    bushuu: "木",
    kunyomi: "すえ",
    onyomi: "マツ、バツ"
  }
];

const CROSS_LINKS = [
  { source: "年始", target: "年初", predicate: "makna serupa awal tahun" },
  { source: "年始", target: "月始", predicate: "rentang awal waktu" },
  { source: "開始", target: "始動", predicate: "memulai operasi / pergerakan" },
  { source: "始業", target: "開始", predicate: "mulai kerja & pembukaan" },
  { source: "始業", target: "始動", predicate: "mulai aktivitas" },
  { source: "年始", target: "始業", predicate: "awal tahun & aktivitas kerja" },
  { source: "終始", target: "始終", predicate: "awal hingga akhir & senantiasa" },
  { source: "始末", target: "終始", predicate: "penyelesaian urusan & akhir" },
  { source: "始末", target: "開始", predicate: "penyelesaian vs pengawalan" }
];

async function run() {
  const char = "始";
  console.log(`Starting update for kanji ${char}...`);

  // 1. Dapatkan atau verifikasi Kanji 始
  const kanji = await prisma.kanji.findFirst({
    where: { character: char }
  });

  if (!kanji) {
    console.error(`Kanji ${char} not found in DB!`);
    return;
  }

  // Update atribut kanji 始 agar sesuai gambar referensi
  await prisma.kanji.update({
    where: { id: kanji.id },
    data: {
      meaning: "awal atau mulai.",
      baseMeaning: "awal atau mulai.",
      romaji: "SHI",
      bushuu: "女",
      onyomi: "シ",
      kunyomi: "はじ・まる、はじ・める"
    }
  });
  console.log(`Updated root Kanji ${char} attributes.`);

  // 2. Sinkronkan kanji-kanji penyusun tunggal
  for (const cData of CONSTITUENT_KANJI_DATA) {
    const existing = await prisma.kanji.findFirst({
      where: { character: cData.character }
    });
    if (existing) {
      await prisma.kanji.update({
        where: { id: existing.id },
        data: {
          romaji: cData.romaji,
          meaning: cData.meaning,
          baseMeaning: cData.baseMeaning,
          bushuu: cData.bushuu,
          kunyomi: cData.kunyomi,
          onyomi: cData.onyomi
        }
      });
    } else {
      await prisma.kanji.create({
        data: {
          character: cData.character,
          romaji: cData.romaji,
          meaning: cData.meaning,
          baseMeaning: cData.baseMeaning,
          bushuu: cData.bushuu,
          kunyomi: cData.kunyomi,
          onyomi: cData.onyomi,
          moduleId: null
        }
      });
    }
  }
  console.log(`Synchronized ${CONSTITUENT_KANJI_DATA.length} constituent kanji records.`);

  // 3. Bersihkan KanjiGraphEdge lama (prefix liar & edge hirarki redundan)
  await prisma.kanjiGraphEdge.deleteMany({
    where: { kanjiId: kanji.id }
  });

  // 4. Masukkan cross-link bersih (source & target persis kata Jukugo)
  for (let i = 0; i < CROSS_LINKS.length; i++) {
    const link = CROSS_LINKS[i];
    await prisma.kanjiGraphEdge.create({
      data: {
        id: `始-cross-${kanji.id}-${i + 1}-${link.source}-${link.target}`,
        kanjiId: kanji.id,
        source: link.source,
        target: link.target,
        predicate: link.predicate
      }
    });
  }
  console.log(`Inserted ${CROSS_LINKS.length} clean cross-link edges into KanjiGraphEdge.`);

  // 5. Bersihkan relasi KategoriKanji, SemanticRelation, dan Jukugo lama untuk kanji 始
  const existingJukugos = await prisma.jukugo.findMany({
    where: { kanjiId: kanji.id }
  });
  const existingJukugoIds = existingJukugos.map(j => j.id);
  if (existingJukugoIds.length > 0) {
    await prisma.kategoriKanji.deleteMany({
      where: { jokugoId: { in: existingJukugoIds } }
    });
  }

  const oldSRs = await prisma.semanticRelation.findMany({
    where: { kanjiId: kanji.id },
    select: { id: true }
  });
  const oldSRIds = oldSRs.map(sr => sr.id);
  if (oldSRIds.length > 0) {
    await prisma.semanticRelationNode.deleteMany({
      where: { semanticId: { in: oldSRIds } }
    });
    await prisma.semanticRelation.deleteMany({
      where: { id: { in: oldSRIds } }
    });
  }

  await prisma.jukugo.deleteMany({
    where: { kanjiId: kanji.id }
  });
  console.log(`Cleaned up old Jukugo and related records for kanji ${char}.`);

  // 6. Buat Jukugo baru (9 kata murni), MasterCategory, dan relasi KategoriKanji
  const allWords: string[] = [];
  for (const cat of customGraphShi.categories) {
    const masterCat = await prisma.masterCategory.upsert({
      where: { name: cat.title },
      update: {
        name: cat.title,
        description: cat.description
      },
      create: {
        name: cat.title,
        description: cat.description
      }
    });

    for (const jk of cat.jukugos) {
      allWords.push(jk.word);

      const dbJukugo = await prisma.jukugo.create({
        data: {
          kanjiId: kanji.id,
          word: jk.word,
          reading: jk.reading,
          meaning: jk.meaning
        }
      });

      await prisma.kategoriKanji.create({
        data: {
          jokugoId: dbJukugo.id,
          categoryId: masterCat.id
        }
      });
    }
  }
  console.log(`Populated KategoriKanji for all ${allWords.length} unique jukugos across ${customGraphShi.categories.length} categories.`);

  // 7. Update SemanticRelation & SemanticRelationNode untuk kanji 始
  for (const semItem of SHI_SEMANTIC_DATA) {
    const targetWord = semItem.word;
    const matchedJukugo = await prisma.jukugo.findFirst({
      where: { kanjiId: kanji.id, word: targetWord }
    });

    const createdSem = await prisma.semanticRelation.create({
      data: {
        kanjiId: kanji.id,
        jukugoId: matchedJukugo?.id || null,
        penjelasan: semItem.penjelasan
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
  console.log(`Updated ${SHI_SEMANTIC_DATA.length} SemanticRelation records and constituent nodes.`);

  // 8. Update Grouping Quiz for kanji 始
  await prisma.quiz.deleteMany({
    where: { kanjiId: kanji.id, type: "grouping" }
  });

  const formattedGroups = customGraphShi.categories.map(cat => ({
    name: cat.title,
    category: cat.title,
    correctWords: cat.jukugos.map(j => j.word),
    items: cat.jukugos.map(j => j.word),
    [cat.title]: cat.jukugos.map(j => j.word)
  }));

  await prisma.quiz.create({
    data: {
      kanjiId: kanji.id,
      type: "grouping",
      question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
      words: JSON.stringify(allWords),
      groups: JSON.stringify(formattedGroups),
      explanation: `Pengelompokan jukugo berdasarkan cabang semantic graph kanji ${char}.`
    }
  });
  console.log(`Updated grouping quiz for ${char}.`);

  console.log(`\n=== SUKSES MEMPERBARUI SEMANTIC DATA KANJI ${char} 100% ===`);
}

run()
  .catch(e => {
    console.error("Error updating kanji Shi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
