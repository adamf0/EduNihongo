import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const customGraphI = {
  categories: [
    {
      title: "1. PIKIRAN / MAKNA",
      color: "border-purple-500",
      jukugos: [
        { word: "意味", reading: "いみ", meaning: "makna / arti" },
        { word: "意見", reading: "いけん", meaning: "pendapat" }
      ]
    },
    {
      title: "2. KEHENDAK / MAKSUD",
      color: "border-green-500",
      jukugos: [
        { word: "意思", reading: "いし", meaning: "kehendak" },
        { word: "意志", reading: "いし", meaning: "tekad" },
        { word: "意向", reading: "いこう", meaning: "maksud" },
        { word: "意図", reading: "いと", meaning: "niat" },
        { word: "決意", reading: "けつい", meaning: "tekad" },
        { word: "意欲", reading: "いよく", meaning: "kemauan" }
      ]
    },
    {
      title: "3. KESADARAN / PERHATIAN",
      color: "border-blue-500",
      jukugos: [
        { word: "意識", reading: "いしき", meaning: "kesadaran" },
        { word: "注意", reading: "ちゅうい", meaning: "perhatian" }
      ]
    },
    {
      title: "4. PERSETUJUAN / SIKAP",
      color: "border-orange-500",
      jukugos: [
        { word: "同意", reading: "どうい", meaning: "persetujuan" },
        { word: "合意", reading: "ごうい", meaning: "kesepakatan" },
        { word: "好意", reading: "こうい", meaning: "niat baik" },
        { word: "悪意", reading: "あくい", meaning: "niat buruk" }
      ]
    },
    {
      title: "5. TUJUAN / PERSIAPAN",
      color: "border-red-500",
      jukugos: [
        { word: "用意", reading: "ようい", meaning: "persiapan" }
      ]
    }
  ]
};

const I_SEMANTIC_DATA = [
  // 1) PIKIRAN / MAKNA
  {
    word: "意味",
    penjelasan: "Hubungan makna antar kanji 意 dan 味 menjadi 意味, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “makna atau arti yang terkandung dalam suatu kata, ungkapan, atau hal.”",
    nodes: [
      { jokugo: "意", arti: "pikiran, maksud" },
      { jokugo: "味", arti: "rasa, makna" }
    ]
  },
  {
    word: "意見",
    penjelasan: "Hubungan makna antar kanji 意 dan 見 menjadi 意見, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pendapat atau pandangan seseorang terhadap suatu hal.”",
    nodes: [
      { jokugo: "意", arti: "pikiran, maksud" },
      { jokugo: "見", arti: "melihat, pandangan" }
    ]
  },
  // 2) KEHENDAK / MAKSUD
  {
    word: "意思",
    penjelasan: "Hubungan makna antar kanji 意 dan 思 menjadi 意思, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kehendak atau maksud yang ada dalam pikiran seseorang.”",
    nodes: [
      { jokugo: "意", arti: "pikiran, kehendak" },
      { jokugo: "思", arti: "berpikir, perasaan" }
    ]
  },
  {
    word: "意志",
    penjelasan: "Hubungan makna antar kanji 意 dan 志 menjadi 意志, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kehendak atau tekad yang kuat untuk mencapai atau melakukan sesuatu.”",
    nodes: [
      { jokugo: "意", arti: "kehendak, maksud" },
      { jokugo: "志", arti: "tekad, cita-cita" }
    ]
  },
  {
    word: "意向",
    penjelasan: "Hubungan makna antar kanji 意 dan 向 menjadi 意向, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “maksud, kehendak, atau arah yang ingin dituju seseorang atau suatu pihak.”",
    nodes: [
      { jokugo: "意", arti: "maksud, kehendak" },
      { jokugo: "向", arti: "arah, mengarah" }
    ]
  },
  {
    word: "意図",
    penjelasan: "Hubungan makna antar kanji 意 dan 図 menjadi 意図, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “niat atau maksud yang direncanakan untuk melakukan sesuatu.”",
    nodes: [
      { jokugo: "意", arti: "maksud, kehendak" },
      { jokugo: "図", arti: "rencana, maksud" }
    ]
  },
  {
    word: "決意",
    penjelasan: "Hubungan makna antar kanji 決 dan 意 menjadi 決意, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tekad atau keputusan hati yang kuat untuk melakukan sesuatu.”",
    nodes: [
      { jokugo: "決", arti: "memutuskan, menetapkan" },
      { jokugo: "意", arti: "kehendak, maksud" }
    ]
  },
  {
    word: "意欲",
    penjelasan: "Hubungan makna antar kanji 意 dan 欲 menjadi 意欲, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kemauan atau dorongan yang kuat untuk melakukan atau mencapai sesuatu.”",
    nodes: [
      { jokugo: "意", arti: "kehendak, maksud" },
      { jokugo: "欲", arti: "keinginan, hasrat" }
    ]
  },
  // 3) KESADARAN / PERHATIAN
  {
    word: "意識",
    penjelasan: "Hubungan makna antar kanji 意 dan 識 menjadi 意識, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kesadaran atau keadaan menyadari dan mengenali sesuatu dalam pikiran.”",
    nodes: [
      { jokugo: "意", arti: "pikiran, kesadaran" },
      { jokugo: "識", arti: "mengetahui, mengenali" }
    ]
  },
  {
    word: "注意",
    penjelasan: "Hubungan makna antar kanji 注 dan 意 menjadi 注意, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perhatian yang dipusatkan pada sesuatu agar tidak terjadi kesalahan atau masalah.”",
    nodes: [
      { jokugo: "注", arti: "memusatkan, mencurahkan" },
      { jokugo: "意", arti: "pikiran, perhatian" }
    ]
  },
  // 4) PERSETUJUAN / SIKAP
  {
    word: "同意",
    penjelasan: "Hubungan makna antar kanji 同 dan 意 menjadi 同意, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “persetujuan atau keadaan memiliki pendapat yang sama terhadap suatu hal.”",
    nodes: [
      { jokugo: "同", arti: "sama, bersama" },
      { jokugo: "意", arti: "pikiran, pendapat" }
    ]
  },
  {
    word: "合意",
    penjelasan: "Hubungan makna antar kanji 合 dan 意 menjadi 合意, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kesepakatan yang dicapai ketika pihak-pihak yang terlibat memiliki kehendak atau pendapat yang sama.”",
    nodes: [
      { jokugo: "合", arti: "bergabung, sesuai" },
      { jokugo: "意", arti: "pendapat, kehendak" }
    ]
  },
  {
    word: "好意",
    penjelasan: "Hubungan makna antar kanji 好 dan 意 menjadi 好意, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perasaan baik atau niat baik yang ditujukan kepada orang lain.”",
    nodes: [
      { jokugo: "好", arti: "suka, baik" },
      { jokugo: "意", arti: "perasaan, maksud" }
    ]
  },
  {
    word: "悪意",
    penjelasan: "Hubungan makna antar kanji 悪 dan 意 menjadi 悪意, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “niat buruk atau maksud yang tidak baik terhadap orang lain.”",
    nodes: [
      { jokugo: "悪", arti: "buruk, jahat" },
      { jokugo: "意", arti: "maksud, niat" }
    ]
  },
  // 5) TUJUAN / PERSIAPAN
  {
    word: "用意",
    penjelasan: "Hubungan makna antar kanji 用 dan 意 menjadi 用意, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “persiapan atau tindakan menyediakan sesuatu yang diperlukan sebelum melakukan suatu kegiatan.”",
    nodes: [
      { jokugo: "用", arti: "menggunakan, keperluan" },
      { jokugo: "意", arti: "pikiran, maksud" }
    ]
  }
];

const CONSTITUENT_KANJI_DATA = [
  {
    character: "味",
    romaji: "MI / Aji",
    meaning: "Rasa, Makna",
    baseMeaning: "rasa atau makna yang terkandung.",
    bushuu: "口",
    kunyomi: "あじ",
    onyomi: "ミ"
  },
  {
    character: "見",
    romaji: "KEN / Mi",
    meaning: "Melihat, Pandangan",
    baseMeaning: "melihat atau memiliki pandangan.",
    bushuu: "見",
    kunyomi: "み・る",
    onyomi: "ケン"
  },
  {
    character: "思",
    romaji: "SHI / Omo",
    meaning: "Berpikir, Perasaan",
    baseMeaning: "berpikir atau merasakan dalam hati.",
    bushuu: "心",
    kunyomi: "おも・う",
    onyomi: "シ"
  },
  {
    character: "志",
    romaji: "SHI / Kokorozashi",
    meaning: "Tekad, Cita-cita",
    baseMeaning: "tekad atau cita-cita yang kuat.",
    bushuu: "心",
    kunyomi: "こころざし",
    onyomi: "シ"
  },
  {
    character: "向",
    romaji: "KOU / Muka",
    meaning: "Arah, Mengarah",
    baseMeaning: "menghadap, menuju, atau arah tujuan.",
    bushuu: "口",
    kunyomi: "む・かう",
    onyomi: "コウ"
  },
  {
    character: "図",
    romaji: "ZU / TO / Haka",
    meaning: "Rencana, Maksud",
    baseMeaning: "gambar, rencana, atau maksud yang dirancang.",
    bushuu: "囗",
    kunyomi: "はか・る",
    onyomi: "ズ、ト"
  },
  {
    character: "決",
    romaji: "KETSU / Ki",
    meaning: "Memutuskan, Menetapkan",
    baseMeaning: "memutuskan atau menetapkan dengan tegas.",
    bushuu: "氵",
    kunyomi: "き・める",
    onyomi: "ケツ"
  },
  {
    character: "欲",
    romaji: "YOKU / Hosshi",
    meaning: "Keinginan, Hasrat",
    baseMeaning: "keinginan atau hasrat untuk memiliki sesuatu.",
    bushuu: "欠",
    kunyomi: "ほっ・する",
    onyomi: "ヨク"
  },
  {
    character: "識",
    romaji: "SHIKI",
    meaning: "Mengetahui, Mengenali",
    baseMeaning: "mengetahui, mengenali, atau membedakan.",
    bushuu: "言",
    kunyomi: "し・る",
    onyomi: "シキ"
  },
  {
    character: "注",
    romaji: "CHUU / Soso",
    meaning: "Memusatkan, Mencurahkan",
    baseMeaning: "mencurahkan atau memusatkan perhatian.",
    bushuu: "氵",
    kunyomi: "そそ・ぐ",
    onyomi: "チュウ"
  },
  {
    character: "同",
    romaji: "DOU / Ona",
    meaning: "Sama, Bersama",
    baseMeaning: "sama, serupa, atau bersama-sama.",
    bushuu: "口",
    kunyomi: "おな・じ",
    onyomi: "ドウ"
  },
  {
    character: "合",
    romaji: "GOU / A",
    meaning: "Bergabung, Sesuai",
    baseMeaning: "bergabung, cocok, atau sesuai.",
    bushuu: "口",
    kunyomi: "あ・う",
    onyomi: "ゴウ、ガッ"
  },
  {
    character: "好",
    romaji: "KOU / Kono / Suki",
    meaning: "Suka, Baik",
    baseMeaning: "suka, baik, atau menyenangkan.",
    bushuu: "女",
    kunyomi: "す・き、この・む",
    onyomi: "コウ"
  },
  {
    character: "悪",
    romaji: "AKU / Waru",
    meaning: "Buruk, Jahat",
    baseMeaning: "buruk, jahat, atau salah.",
    bushuu: "心",
    kunyomi: "わる・い",
    onyomi: "アク、オ"
  },
  {
    character: "用",
    romaji: "YOU / Mochi",
    meaning: "Menggunakan, Keperluan",
    baseMeaning: "menggunakan atau menyediakan keperluan.",
    bushuu: "用",
    kunyomi: "もち・いる",
    onyomi: "ヨウ"
  }
];

const CROSS_LINKS = [
  { source: "意見", target: "意向", predicate: "pendapat & arah maksud" },
  { source: "意思", target: "意志", predicate: "kehendak & tekad kuat" },
  { source: "意図", target: "決意", predicate: "niat terencana & tekad ketetapan" },
  { source: "意欲", target: "意識", predicate: "kemauan dorongan & kesadaran" },
  { source: "同意", target: "合意", predicate: "persetujuan & kesepakatan" },
  { source: "好意", target: "悪意", predicate: "niat baik vs niat buruk" },
  { source: "注意", target: "用意", predicate: "perhatian waspada & persiapan" },
  { source: "意味", target: "意図", predicate: "makna arti & niat maksud" },
  { source: "決意", target: "意志", predicate: "tekad keputusan & tekad kemauan" },
  { source: "意見", target: "意思", predicate: "pendapat pandangan & kehendak pikiran" }
];

async function run() {
  const char = "意";
  console.log(`Starting update for kanji ${char}...`);

  // 1. Dapatkan atau verifikasi Kanji 意
  const kanji = await prisma.kanji.findFirst({
    where: { character: char },
  });

  if (!kanji) {
    console.error(`Kanji ${char} not found in DB!`);
    return;
  }

  // Update atribut kanji 意 agar sesuai gambar referensi
  await prisma.kanji.update({
    where: { id: kanji.id },
    data: {
      meaning: "pikiran, perasaan, kehendak, maksud",
      baseMeaning: "pikiran, perasaan, kehendak, atau maksud.",
      romaji: "I",
      bushuu: "心",
      onyomi: "イ",
      kunyomi: "-"
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
        id: `意-cross-${kanji.id}-${i + 1}-${link.source}-${link.target}`,
        kanjiId: kanji.id,
        source: link.source,
        target: link.target,
        predicate: link.predicate
      }
    });
  }
  console.log(`Inserted ${CROSS_LINKS.length} clean cross-link edges into KanjiGraphEdge.`);

  // 5. Bersihkan relasi KategoriKanji lama untuk jukugo kanji 意
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
  for (const cat of customGraphI.categories) {
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
  console.log(`Populated KategoriKanji for all ${allWords.length} jukugos across ${customGraphI.categories.length} categories.`);

  // 7. Update SemanticRelation & SemanticRelationNode untuk kanji 意
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

  for (const semItem of I_SEMANTIC_DATA) {
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
  console.log(`Updated ${I_SEMANTIC_DATA.length} SemanticRelation records and nodes.`);

  // 8. Update Grouping Quiz for kanji 意
  await prisma.quiz.deleteMany({
    where: { kanjiId: kanji.id, type: "grouping" }
  });

  const formattedGroups = customGraphI.categories.map(cat => ({
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
    console.error("Error updating kanji I:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
