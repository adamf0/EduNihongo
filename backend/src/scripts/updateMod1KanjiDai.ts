import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const customGraphDai = {
  categories: [
    {
      title: "1. Soal / Tugas / Masalah",
      color: "border-green-500",
      jukugos: [
        { word: "問題", reading: "もんだい", meaning: "masalah / soal" },
        { word: "課題", reading: "かだい", meaning: "tugas / persoalan" },
        { word: "宿題", reading: "しゅくだい", meaning: "pekerjaan rumah" },
        { word: "出題", reading: "しゅつだい", meaning: "pemberian soal / membuat soal" },
        { word: "例題", reading: "れいだい", meaning: "contoh soal" },
        { word: "難題", reading: "なんだい", meaning: "masalah sulit" }
      ]
    },
    {
      title: "2. Tema / Topik",
      color: "border-blue-500",
      jukugos: [
        { word: "主題", reading: "しゅだい", meaning: "tema utama" },
        { word: "話題", reading: "わだい", meaning: "topik pembicaraan" },
        { word: "論題", reading: "ろんだい", meaning: "topik pembahasan / perdebatan" },
        { word: "議題", reading: "ぎだい", meaning: "agenda / topik pembahasan" }
      ]
    },
    {
      title: "3. Judul",
      color: "border-orange-500",
      jukugos: [
        { word: "題名", reading: "だいめい", meaning: "judul" },
        { word: "表題", reading: "ひょうだい", meaning: "judul" },
        { word: "副題", reading: "ふくだい", meaning: "subjudul" },
        { word: "演題", reading: "えんだい", meaning: "judul / topik presentasi" },
        { word: "題字", reading: "だいじ", meaning: "tulisan judul" }
      ]
    },
    {
      title: "4. Bahan / Tema Karya",
      color: "border-purple-500",
      jukugos: [
        { word: "題材", reading: "だいざい", meaning: "bahan / tema karya" }
      ]
    }
  ]
};

const DAI_SEMANTIC_DATA = [
  // 1) Soal / Tugas / Masalah
  {
    word: "問題",
    penjelasan: "Hubungan makna antar kanji 問 dan 題 menjadi 問題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “soal yang menuntut jawaban atau persoalan yang perlu dipikirkan dan diselesaikan.”",
    nodes: [
      { jokugo: "問", arti: "bertanya, menanyakan" },
      { jokugo: "題", arti: "soal, persoalan" }
    ]
  },
  {
    word: "課題",
    penjelasan: "Hubungan makna antar kanji 課 dan 題 menjadi 課題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tugas atau persoalan yang diberikan untuk dikerjakan atau diselesaikan.”",
    nodes: [
      { jokugo: "課", arti: "memberikan atau membebankan tugas" },
      { jokugo: "題", arti: "soal, persoalan" }
    ]
  },
  {
    word: "宿題",
    penjelasan: "Hubungan makna antar kanji 宿 dan 題 menjadi 宿題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tugas yang dibawa pulang untuk dikerjakan di luar waktu pembelajaran.”",
    nodes: [
      { jokugo: "宿", arti: "tempat menginap; bermalam" },
      { jokugo: "題", arti: "soal, tugas" }
    ]
  },
  {
    word: "出題",
    penjelasan: "Hubungan makna antar kanji 出 dan 題 menjadi 出題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengeluarkan atau memberikan soal untuk dijawab.”",
    nodes: [
      { jokugo: "出", arti: "mengeluarkan, memberikan" },
      { jokugo: "題", arti: "soal, pertanyaan" }
    ]
  },
  {
    word: "例題",
    penjelasan: "Hubungan makna antar kanji 例 dan 題 menjadi 例題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “soal yang digunakan sebagai contoh.”",
    nodes: [
      { jokugo: "例", arti: "contoh" },
      { jokugo: "題", arti: "soal, pertanyaan" }
    ]
  },
  {
    word: "難題",
    penjelasan: "Hubungan makna antar kanji 難 dan 題 menjadi 難題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “persoalan atau masalah yang sulit untuk dijawab atau diselesaikan.”",
    nodes: [
      { jokugo: "難", arti: "sulit, sukar" },
      { jokugo: "題", arti: "soal, persoalan" }
    ]
  },

  // 2) Tema / Topik
  {
    word: "主題",
    penjelasan: "Hubungan makna antar kanji 主 dan 題 menjadi 主題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tema atau pokok utama yang menjadi pusat suatu pembahasan atau karya.”",
    nodes: [
      { jokugo: "主", arti: "utama, pokok" },
      { jokugo: "題", arti: "tema, topik" }
    ]
  },
  {
    word: "話題",
    penjelasan: "Hubungan makna antar kanji 話 dan 題 menjadi 話題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “topik atau pokok yang menjadi bahan pembicaraan.”",
    nodes: [
      { jokugo: "話", arti: "berbicara, pembicaraan" },
      { jokugo: "題", arti: "topik, pokok" }
    ]
  },
  {
    word: "論題",
    penjelasan: "Hubungan makna antar kanji 論 dan 題 menjadi 論題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tema atau topik yang menjadi bahan pembahasan, argumentasi, atau perdebatan.”",
    nodes: [
      { jokugo: "論", arti: "membahas, berargumentasi" },
      { jokugo: "題", arti: "tema, topik" }
    ]
  },
  {
    word: "議題",
    penjelasan: "Hubungan makna antar kanji 議 dan 題 menjadi 議題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “topik atau persoalan yang diajukan untuk dibahas dalam suatu pertemuan atau rapat.”",
    nodes: [
      { jokugo: "議", arti: "membahas, berunding" },
      { jokugo: "題", arti: "topik, persoalan" }
    ]
  },

  // 3) Judul
  {
    word: "題名",
    penjelasan: "Hubungan makna antar kanji 題 dan 名 menjadi 題名, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “nama atau judul yang diberikan pada suatu karya atau tulisan.”",
    nodes: [
      { jokugo: "題", arti: "judul" },
      { jokugo: "名", arti: "nama" }
    ]
  },
  {
    word: "表題",
    penjelasan: "Hubungan makna antar kanji 表 dan 題 menjadi 表題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “judul yang ditampilkan sebagai penanda isi suatu karya atau tulisan.”",
    nodes: [
      { jokugo: "表", arti: "permukaan, menampilkan" },
      { jokugo: "題", arti: "judul" }
    ]
  },
  {
    word: "副題",
    penjelasan: "Hubungan makna antar kanji 副 dan 題 menjadi 副題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “judul tambahan yang melengkapi judul utama.”",
    nodes: [
      { jokugo: "副", arti: "tambahan, sekunder" },
      { jokugo: "題", arti: "judul" }
    ]
  },
  {
    word: "演題",
    penjelasan: "Hubungan makna antar kanji 演 dan 題 menjadi 演題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “judul atau topik yang disampaikan dalam ceramah, pidato, atau presentasi.”",
    nodes: [
      { jokugo: "演", arti: "menyampaikan, mempertunjukkan" },
      { jokugo: "題", arti: "judul, topik" }
    ]
  },
  {
    word: "題字",
    penjelasan: "Hubungan makna antar kanji 題 dan 字 menjadi 題字, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “huruf atau tulisan yang digunakan sebagai judul.”",
    nodes: [
      { jokugo: "題", arti: "judul" },
      { jokugo: "字", arti: "huruf, tulisan" }
    ]
  },

  // 4) Bahan / Tema Karya
  {
    word: "題材",
    penjelasan: "Hubungan makna antar kanji 題 dan 材 menjadi 題材, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bahan atau tema yang dijadikan dasar untuk membuat suatu karya.”",
    nodes: [
      { jokugo: "題", arti: "tema, pokok" },
      { jokugo: "材", arti: "bahan, material" }
    ]
  }
];

const CONSTITUENT_KANJI_DATA = [
  {
    character: "問",
    romaji: "MON / To",
    meaning: "Bertanya, Menanyakan",
    baseMeaning: "bertanya, menanyakan, atau menguji.",
    bushuu: "口",
    kunyomi: "と・う、と・い",
    onyomi: "モン"
  },
  {
    character: "課",
    romaji: "KA",
    meaning: "Tugas, Pelajaran",
    baseMeaning: "memberikan atau membebankan tugas.",
    bushuu: "言",
    kunyomi: "-",
    onyomi: "カ"
  },
  {
    character: "宿",
    romaji: "SHUKU / Yado",
    meaning: "Menginap, Bermalam",
    baseMeaning: "tempat menginap atau bermalam.",
    bushuu: "宀",
    kunyomi: "やど、やど・る",
    onyomi: "シュク"
  },
  {
    character: "出",
    romaji: "SHUTSU / De / Da",
    meaning: "Mengeluarkan, Keluar",
    baseMeaning: "mengeluarkan atau memberikan.",
    bushuu: "凵",
    kunyomi: "で・る、だ・す",
    onyomi: "シュツ、スイ"
  },
  {
    character: "例",
    romaji: "REI / Tato",
    meaning: "Contoh, Perumpamaan",
    baseMeaning: "contoh atau perumpamaan.",
    bushuu: "亻",
    kunyomi: "たと・える",
    onyomi: "レイ"
  },
  {
    character: "難",
    romaji: "NAN / Muzuka",
    meaning: "Sulit, Sukar",
    baseMeaning: "sulit atau sukar diselesaikan.",
    bushuu: "隹",
    kunyomi: "むずか・しい、かた・い",
    onyomi: "ナン"
  },
  {
    character: "主",
    romaji: "SHU / Omo",
    meaning: "Utama, Pokok",
    baseMeaning: "utama atau pokok pembahasan.",
    bushuu: "丶",
    kunyomi: "おも、ぬし",
    onyomi: "シュ、ス"
  },
  {
    character: "話",
    romaji: "WA / Hana",
    meaning: "Berbicara, Pembicaraan",
    baseMeaning: "berbicara atau topik pembicaraan.",
    bushuu: "言",
    kunyomi: "はな・す、はなし",
    onyomi: "ワ"
  },
  {
    character: "論",
    romaji: "RON",
    meaning: "Membahas, Berargumentasi",
    baseMeaning: "membahas atau berargumentasi mengenai suatu hal.",
    bushuu: "言",
    kunyomi: "-",
    onyomi: "ロン"
  },
  {
    character: "議",
    romaji: "GI",
    meaning: "Membahas, Berunding",
    baseMeaning: "membahas atau berunding dalam pertemuan.",
    bushuu: "言",
    kunyomi: "-",
    onyomi: "ギ"
  },
  {
    character: "名",
    romaji: "MEI / Na",
    meaning: "Nama, Judul",
    baseMeaning: "nama atau judul karya.",
    bushuu: "口",
    kunyomi: "な",
    onyomi: "メイ、ミョウ"
  },
  {
    character: "表",
    romaji: "HYOU / Omote",
    meaning: "Menampilkan, Permukaan",
    baseMeaning: "menampilkan atau penanda isi.",
    bushuu: "衣",
    kunyomi: "おもて、あらわ・す",
    onyomi: "ヒョウ"
  },
  {
    character: "副",
    romaji: "FUKU",
    meaning: "Tambahan, Sekunder",
    baseMeaning: "tambahan atau sekunder yang melengkapi judul.",
    bushuu: "刂",
    kunyomi: "-",
    onyomi: "フク"
  },
  {
    character: "演",
    romaji: "EN",
    meaning: "Menyampaikan, Mempertunjukkan",
    baseMeaning: "menyampaikan pidato atau presentasi.",
    bushuu: "氵",
    kunyomi: "-",
    onyomi: "エン"
  },
  {
    character: "字",
    romaji: "JI / Aza",
    meaning: "Huruf, Tulisan",
    baseMeaning: "huruf atau tulisan penanda judul.",
    bushuu: "子",
    kunyomi: "あざ",
    onyomi: "ジ"
  },
  {
    character: "材",
    romaji: "ZAI",
    meaning: "Bahan, Material",
    baseMeaning: "bahan atau material pembuatan karya.",
    bushuu: "木",
    kunyomi: "-",
    onyomi: "ザイ"
  }
];

const CROSS_LINKS = [
  { source: "課題", target: "宿題", predicate: "mirip makna tugas" },
  { source: "題名", target: "表題", predicate: "mirip makna judul" },
  { source: "主題", target: "演題", predicate: "mirip makna tema" },
  { source: "論題", target: "議題", predicate: "topik pembahasan" },
  { source: "出題", target: "例題", predicate: "pembuatan contoh soal" },
  { source: "話題", target: "題材", predicate: "bahan perbincangan" },
  { source: "副題", target: "題名", predicate: "sub-judul pendukung" },
  { source: "難題", target: "課題", predicate: "tugas berat" },
  { source: "問題", target: "出題", predicate: "proses pembuatan soal" },
  { source: "題字", target: "題名", predicate: "gaya penulisan judul" }
];

async function run() {
  const char = "題";
  console.log(`Starting update for kanji ${char}...`);

  // 1. Dapatkan atau verifikasi Kanji 題
  const kanji = await prisma.kanji.findFirst({
    where: { character: char },
  });

  if (!kanji) {
    console.error(`Kanji ${char} not found in DB!`);
    return;
  }

  // Update atribut kanji 題 agar sesuai gambar referensi
  await prisma.kanji.update({
    where: { id: kanji.id },
    data: {
      meaning: "Soal atau hal yang perlu diselesaikan; topik, tema, atau judul yang menunjukkan pokok suatu hal.",
      baseMeaning: "soal atau hal yang perlu diselesaikan; topik, tema, atau judul yang menunjukkan pokok suatu hal.",
      romaji: "DAI",
      bushuu: "頁",
      onyomi: "ダイ",
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
        id: `題-cross-${kanji.id}-${i + 1}-${link.source}-${link.target}`,
        kanjiId: kanji.id,
        source: link.source,
        target: link.target,
        predicate: link.predicate
      }
    });
  }
  console.log(`Inserted ${CROSS_LINKS.length} clean cross-link edges into KanjiGraphEdge.`);

  // 5. Bersihkan relasi KategoriKanji, SemanticRelation, dan Jukugo lama untuk kanji 題
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

  // 6. Buat Jukugo baru (16 kata murni), MasterCategory, dan relasi KategoriKanji
  const allWords: string[] = [];
  for (const cat of customGraphDai.categories) {
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
  console.log(`Populated KategoriKanji for all ${allWords.length} unique jukugos across ${customGraphDai.categories.length} categories.`);

  // 7. Update SemanticRelation & SemanticRelationNode untuk kanji 題
  for (const semItem of DAI_SEMANTIC_DATA) {
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
  console.log(`Updated ${DAI_SEMANTIC_DATA.length} SemanticRelation records and constituent nodes.`);

  // 8. Update Grouping Quiz for kanji 題
  await prisma.quiz.deleteMany({
    where: { kanjiId: kanji.id, type: "grouping" }
  });

  const formattedGroups = customGraphDai.categories.map(cat => ({
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
    console.error("Error updating kanji Dai:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
