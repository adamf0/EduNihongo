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
    penjelasan: "Hubungan makna antara kanji 経 dan 由 menjadi 経由, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “melalui suatu tempat, jalur, atau perantar.”",
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

const CONSTITUENT_KANJI_DATA = [
  {
    character: "験",
    romaji: "KEN",
    meaning: "Pengalaman, Ujian",
    baseMeaning: "pengalaman atau ujian yang dijalani.",
    bushuu: "馬",
    kunyomi: "ため・す",
    onyomi: "ケン"
  },
  {
    character: "過",
    romaji: "KA / Su",
    meaning: "Melewati, Berlalu",
    baseMeaning: "melewati atau berlalu melampaui batas.",
    bushuu: "辶",
    kunyomi: "す・ぎる、す・ごす",
    onyomi: "カ"
  },
  {
    character: "歴",
    romaji: "REKI",
    meaning: "Riwayat, Perjalanan yang dilalui",
    baseMeaning: "riwayat atau urutan peristiwa yang dilalui.",
    bushuu: "厂",
    kunyomi: "-",
    onyomi: "レキ"
  },
  {
    character: "由",
    romaji: "YUU / YUI",
    meaning: "Asal, Melalui",
    baseMeaning: "asal mula, alasan, atau jalur yang dilalui.",
    bushuu: "田",
    kunyomi: "よし",
    onyomi: "ユウ、ユ"
  },
  {
    character: "口",
    romaji: "KOU / Kuchi",
    meaning: "Mulut",
    baseMeaning: "mulut atau pintu masuk.",
    bushuu: "口",
    kunyomi: "くち",
    onyomi: "コウ、ク"
  },
  {
    character: "済",
    romaji: "SAI / SEI / Su",
    meaning: "Menyelesaikan, Mengatur",
    baseMeaning: "menyelesaikan, melunasi, atau menolong.",
    bushuu: "氵",
    kunyomi: "す・む、す・ます",
    onyomi: "サイ、セイ"
  },
  {
    character: "営",
    romaji: "EI / Itona",
    meaning: "Menjalankan, Mengusahakan",
    baseMeaning: "mengelola atau menjalankan suatu usaha.",
    bushuu: "口",
    kunyomi: "いとな・む",
    onyomi: "エイ"
  },
  {
    character: "費",
    romaji: "HI / Tsui",
    meaning: "Biaya, Pengeluaran",
    baseMeaning: "biaya atau pengeluaran yang dihabiskan.",
    bushuu: "貝",
    kunyomi: "つい・やす",
    onyomi: "ヒ"
  },
  {
    character: "理",
    romaji: "RI",
    meaning: "Mengatur, Menata",
    baseMeaning: "mengatur, menata, atau prinsip logika.",
    bushuu: "王",
    kunyomi: "ことわり",
    onyomi: "リ"
  },
  {
    character: "常",
    romaji: "JOU / Tsune",
    meaning: "Selalu, Biasa",
    baseMeaning: "berlangsung terus-menerus atau rutin seperti biasa.",
    bushuu: "巾",
    kunyomi: "つね、とこ",
    onyomi: "ジョウ"
  }
];

const CROSS_LINKS = [
  { source: "経験", target: "経歴", predicate: "pengalaman & rekam jejak" },
  { source: "経済", target: "経営", predicate: "perekonomian & pengelolaan" },
  { source: "経過", target: "経由", predicate: "proses waktu & transit / jalur" },
  { source: "経費", target: "経理", predicate: "biaya & akuntansi keuangan" },
  { source: "経営", target: "経理", predicate: "manajemen usaha & akuntansi" },
  { source: "経過", target: "経験", predicate: "proses berjalannya waktu & pengalaman" },
  { source: "経由", target: "経口", predicate: "jalur perantara & jalur oral" },
  { source: "経済", target: "経常", predicate: "ekonomi & kondisi rutin" }
];

async function run() {
  const char = "経";
  console.log(`Starting update for kanji ${char}...`);

  // 1. Dapatkan atau verifikasi Kanji 経
  const kanji = await prisma.kanji.findFirst({
    where: { character: char },
  });

  if (!kanji) {
    console.error(`Kanji ${char} not found in DB!`);
    return;
  }

  // Update atribut kanji 経 agar sesuai gambar referensi
  await prisma.kanji.update({
    where: { id: kanji.id },
    data: {
      meaning: "melalui, melewati, atau menjalani suatu proses",
      baseMeaning: "melalui, melewati, atau menjalani suatu proses.",
      romaji: "KEI",
      bushuu: "糸",
      onyomi: "ケイ",
      kunyomi: "へ・る"
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
        id: `経-cross-${kanji.id}-${i + 1}-${link.source}-${link.target}`,
        kanjiId: kanji.id,
        source: link.source,
        target: link.target,
        predicate: link.predicate
      }
    });
  }
  console.log(`Inserted ${CROSS_LINKS.length} clean cross-link edges into KanjiGraphEdge.`);

  // 5. Bersihkan relasi KategoriKanji lama untuk jukugo kanji 経
  const existingJukugos = await prisma.jukugo.findMany({
    where: { kanjiId: kanji.id }
  });
  const existingJukugoIds = existingJukugos.map(j => j.id);
  if (existingJukugoIds.length > 0) {
    await prisma.kategoriKanji.deleteMany({
      where: { jokugoId: { in: existingJukugoIds } }
    });
  }

  // 6. Pastikan MasterCategory ada, Jukugo terupdate, dan KategoriKanji terisi
  const allWords: string[] = [];
  for (const cat of customGraphKei.categories) {
    const masterCat = await prisma.masterCategory.upsert({
      where: { name: cat.title },
      update: {
        name: cat.title,
        description: `Kategori ${cat.title} untuk kanji ${char}`
      },
      create: {
        name: cat.title,
        description: `Kategori ${cat.title} untuk kanji ${char}`
      }
    });

    for (const jk of cat.jukugos) {
      allWords.push(jk.word);

      let dbJukugo = await prisma.jukugo.findFirst({
        where: { kanjiId: kanji.id, word: jk.word }
      });

      if (!dbJukugo) {
        dbJukugo = await prisma.jukugo.create({
          data: {
            kanjiId: kanji.id,
            word: jk.word,
            reading: jk.reading,
            meaning: jk.meaning
          }
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
          categoryId: masterCat.id
        }
      });
    }
  }
  console.log(`Populated KategoriKanji for all ${allWords.length} jukugos across ${customGraphKei.categories.length} categories.`);

  // 7. Update SemanticRelation & SemanticRelationNode untuk kanji 経
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

  for (const semItem of KEI_SEMANTIC_DATA) {
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
  console.log(`Updated ${KEI_SEMANTIC_DATA.length} SemanticRelation records and nodes.`);

  // 8. Update Grouping Quiz for kanji 経
  await prisma.quiz.deleteMany({
    where: { kanjiId: kanji.id, type: "grouping" }
  });

  const formattedGroups = customGraphKei.categories.map(cat => ({
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
    console.error("Error updating kanji Kei:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
