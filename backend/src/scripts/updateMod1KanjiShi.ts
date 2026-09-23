import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const customGraphShi = {
  categories: [
    {
      title: "1. Aktivitas Pengujian",
      color: "border-green-500",
      jukugos: [
        { word: "試験", reading: "しけん", meaning: "ujian" },
        { word: "入試", reading: "にゅうし", meaning: "ujian masuk" },
        { word: "追試", reading: "ついし", meaning: "ujian susulan" },
        { word: "試問", reading: "しもん", meaning: "ujian lisan" }
      ]
    },
    {
      title: "2. Penggunaan",
      color: "border-orange-500",
      jukugos: [
        { word: "試着", reading: "しちゃく", meaning: "coba pakaian" },
        { word: "試用", reading: "しよう", meaning: "uji coba" },
        { word: "試乗", reading: "しじょう", meaning: "test drive" }
      ]
    },
    {
      title: "3. Konsumsi",
      color: "border-blue-500",
      jukugos: [
        { word: "試食", reading: "ししょく", meaning: "uji rasa" },
        { word: "試飲", reading: "しいん", meaning: "coba minuman" }
      ]
    },
    {
      title: "4. Bahan Pengujian",
      color: "border-purple-500",
      jukugos: [
        { word: "試薬", reading: "しやく", meaning: "reagen uji" }
      ]
    },
    {
      title: "5. Produksi dan Pengembangan",
      color: "border-yellow-500",
      jukugos: [
        { word: "試作", reading: "しさく", meaning: "prototipe" },
        { word: "試製", reading: "しせい", meaning: "produksi uji" }
      ]
    },
    {
      title: "6. Kompetisi dan Keterampilan",
      color: "border-cyan-500",
      jukugos: [
        { word: "試合", reading: "しあい", meaning: "pertandingan" },
        { word: "試技", reading: "しぎ", meaning: "uji keterampilan" },
        { word: "試射", reading: "ししゃ", meaning: "uji tembak" },
        { word: "試練", reading: "しれん", meaning: "latihan / ujian berat" }
      ]
    },
    {
      title: "7. Media",
      color: "border-pink-500",
      jukugos: [
        { word: "試写", reading: "ししゃ", meaning: "pratinjau film" },
        { word: "試聴", reading: "しちょう", meaning: "mendengar contoh" },
        { word: "試読", reading: "しどく", meaning: "membaca contoh" }
      ]
    }
  ]
};

const SHI_SEMANTIC_DATA = [
  // 1) Aktivitas Pengujian
  {
    word: "試験",
    penjelasan: "Hubungan makna antar kanji 試 dan 験 menjadi 試験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan menguji untuk mengetahui atau membuktikan kemampuan, pengetahuan, atau hasil tertentu.”",
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "験", arti: "menguji, membuktikan melalui pengalaman atau pengujian" }
    ]
  },
  {
    word: "入試",
    penjelasan: "Hubungan makna antar kanji 入 dan 試 menjadi 入試, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “ujian yang dilakukan untuk menentukan apakah seseorang dapat masuk ke sekolah, universitas, atau lembaga tertentu.”",
    nodes: [
      { jokugo: "入", arti: "masuk, memasuki" },
      { jokugo: "試", arti: "mencoba, menguji" }
    ]
  },
  {
    word: "追試",
    penjelasan: "Hubungan makna antar kanji 追 dan 試 menjadi 追試, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “ujian tambahan atau ujian susulan yang dilakukan setelah ujian utama.”",
    nodes: [
      { jokugo: "追", arti: "mengikuti, menyusul, menambahkan" },
      { jokugo: "試", arti: "ujian, pengujian" }
    ]
  },
  {
    word: "試問",
    penjelasan: "Hubungan makna antar kanji 試 dan 問 menjadi 試問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengujian yang dilakukan dengan memberikan pertanyaan untuk mengetahui kemampuan atau pengetahuan seseorang.”",
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "問", arti: "bertanya, pertanyaan" }
    ]
  },

  // 2) Penggunaan
  {
    word: "試着",
    penjelasan: "Hubungan makna antar kanji 試 dan 着 menjadi 試着, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba mengenakan pakaian untuk mengetahui ukuran, penampilan, atau kecocokannya.”",
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "着", arti: "memakai, mengenakan" }
    ]
  },
  {
    word: "試用",
    penjelasan: "Hubungan makna antar kanji 試 dan 用 menjadi 試用, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba menggunakan sesuatu untuk mengetahui fungsi, kualitas, atau kesesuaiannya.”",
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "用", arti: "menggunakan, memakai" }
    ]
  },
  {
    word: "試乗",
    penjelasan: "Hubungan makna antar kanji 試 dan 乗 menjadi 試乗, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba menaiki atau mengendarai kendaraan untuk mengetahui kondisi, kenyamanan, atau performanya.”",
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "乗", arti: "menaiki, mengendarai" }
    ]
  },

  // 3) Konsumsi
  {
    word: "試食",
    penjelasan: "Hubungan makna antar kanji 試 dan 食 menjadi 試食, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba atau mencicipi makanan untuk mengetahui rasa atau kualitasnya.”",
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "食", arti: "makan, makanan" }
    ]
  },
  {
    word: "試飲",
    penjelasan: "Hubungan makna antar kanji 試 dan 飲 menjadi 試飲, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba atau mencicipi minuman untuk mengetahui rasa atau kualitasnya.”",
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "飲", arti: "minum" }
    ]
  },

  // 4) Bahan Pengujian
  {
    word: "試薬",
    penjelasan: "Hubungan makna antar kanji 試 dan 薬 menjadi 試薬, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bahan kimia atau reagen yang digunakan untuk melakukan suatu pengujian.”",
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "薬", arti: "obat, bahan kimia" }
    ]
  },

  // 5) Produksi dan Pengembangan
  {
    word: "試作",
    penjelasan: "Hubungan makna antar kanji 試 dan 作 menjadi 試作, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba membuat suatu benda atau produk sebagai percobaan untuk menilai bentuk, fungsi, atau kualitasnya.”",
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "作", arti: "membuat, menghasilkan" }
    ]
  },
  {
    word: "試製",
    penjelasan: "Hubungan makna antar kanji 試 dan 製 menjadi 試製, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “membuat atau memproduksi sesuatu secara percobaan untuk menguji hasilnya sebelum produksi sebenarnya.”",
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "製", arti: "membuat, memproduksi" }
    ]
  },

  // 6) Kompetisi dan Keterampilan
  {
    word: "試合",
    penjelasan: "Hubungan makna antar kanji 試 dan 合 menjadi 試合, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan mempertemukan dua pihak untuk menguji atau membandingkan kemampuan dalam suatu pertandingan.”",
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "合", arti: "bertemu, berhadapan" }
    ]
  },
  {
    word: "試技",
    penjelasan: "Hubungan makna antar kanji 試 dan 技 menjadi 試技, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pelaksanaan atau percobaan suatu teknik untuk menunjukkan atau menguji keterampilan.”",
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "技", arti: "keterampilan, teknik" }
    ]
  },
  {
    word: "試射",
    penjelasan: "Hubungan makna antar kanji 試 dan 射 menjadi 試射, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba menembakkan senjata atau peluru untuk menguji ketepatan dan fungsinya.”",
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "射", arti: "menembak, melepaskan" }
    ]
  },
  {
    word: "試練",
    penjelasan: "Hubungan makna antar kanji 試 dan 練 menjadi 試練, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “ujian atau cobaan berat yang dihadapi untuk menggembleng ketahanan dan kemampuan seseorang.”",
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "練", arti: "melatih, menggembleng" }
    ]
  },

  // 7) Media
  {
    word: "試写",
    penjelasan: "Hubungan makna antar kanji 試 dan 写 menjadi 試写, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menayangkan atau melihat film sebagai percobaan sebelum ditampilkan secara umum.”",
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "写", arti: "memotret, menyalin, menayangkan gambar" }
    ]
  },
  {
    word: "試聴",
    penjelasan: "Hubungan makna antar kanji 試 dan 聴 menjadi 試聴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba mendengarkan musik, rekaman, atau media suara untuk mengetahui isi atau kualitasnya.”",
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "聴", arti: "mendengarkan" }
    ]
  },
  {
    word: "試読",
    penjelasan: "Hubungan makna antar kanji 試 dan 読 menjadi 試読, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba membaca suatu tulisan atau karya untuk mengetahui isi atau kualitasnya sebelum membaca lebih lanjut.”",
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "読", arti: "membaca" }
    ]
  }
];

const CONSTITUENT_KANJI_DATA = [
  {
    character: "験",
    romaji: "KEN",
    meaning: "Pengalaman, Ujian",
    baseMeaning: "menguji, membuktikan melalui pengalaman atau pengujian.",
    bushuu: "馬",
    kunyomi: "ため・す",
    onyomi: "ケン"
  },
  {
    character: "入",
    romaji: "NYUU / Hai",
    meaning: "Masuk, Memasuki",
    baseMeaning: "masuk atau memasuki.",
    bushuu: "入",
    kunyomi: "はい・る、い・れる",
    onyomi: "ニュウ"
  },
  {
    character: "追",
    romaji: "TSUI / O",
    meaning: "Mengikuti, Menyusul",
    baseMeaning: "mengikuti, menyusul, atau menambahkan.",
    bushuu: "辶",
    kunyomi: "お・う",
    onyomi: "ツイ"
  },
  {
    character: "問",
    romaji: "MON / To",
    meaning: "Bertanya, Pertanyaan",
    baseMeaning: "bertanya, pertanyaan, atau menguji.",
    bushuu: "口",
    kunyomi: "と・う、と・い",
    onyomi: "モン"
  },
  {
    character: "着",
    romaji: "CHAKU / Ki",
    meaning: "Memakai, Mengenakan",
    baseMeaning: "memakai, mengenakan pakaian.",
    bushuu: "目",
    kunyomi: "き・る、つ・く",
    onyomi: "チャク"
  },
  {
    character: "用",
    romaji: "YOU / Mochi",
    meaning: "Menggunakan, Memakai",
    baseMeaning: "menggunakan atau memakai sesuatu.",
    bushuu: "用",
    kunyomi: "もち・いる",
    onyomi: "ヨウ"
  },
  {
    character: "乗",
    romaji: "JOU / No",
    meaning: "Menaiki, Mengendarai",
    baseMeaning: "menaiki atau mengendarai kendaraan.",
    bushuu: "丿",
    kunyomi: "の・る、の・せる",
    onyomi: "ジョウ"
  },
  {
    character: "食",
    romaji: "SHOKU / Tabe",
    meaning: "Makan, Makanan",
    baseMeaning: "makan atau makanan yang dicicipi.",
    bushuu: "食",
    kunyomi: "た・べる、く・う",
    onyomi: "ショク"
  },
  {
    character: "飲",
    romaji: "IN / No",
    meaning: "Minum, Minuman",
    baseMeaning: "minum atau mencicipi minuman.",
    bushuu: "飠",
    kunyomi: "の・む",
    onyomi: "イン"
  },
  {
    character: "薬",
    romaji: "YAKU / Kusuri",
    meaning: "Obat, Bahan Kimia",
    baseMeaning: "obat, reagen, atau bahan kimia pengujian.",
    bushuu: "艹",
    kunyomi: "くすり",
    onyomi: "ヤク"
  },
  {
    character: "作",
    romaji: "SAKU / Tsuku",
    meaning: "Membuat, Menghasilkan",
    baseMeaning: "membuat atau menghasilkan prototipe.",
    bushuu: "亻",
    kunyomi: "つく・る",
    onyomi: "サク、サ"
  },
  {
    character: "製",
    romaji: "SEI",
    meaning: "Membuat, Memproduksi",
    baseMeaning: "membuat atau memproduksi barang uji.",
    bushuu: "衣",
    kunyomi: "-",
    onyomi: "セイ"
  },
  {
    character: "合",
    romaji: "GOU / A",
    meaning: "Bertemu, Berhadapan",
    baseMeaning: "bertemu atau berhadapan dalam pertandingan.",
    bushuu: "口",
    kunyomi: "あ・う",
    onyomi: "ゴウ、ガッ"
  },
  {
    character: "技",
    romaji: "GI / Waza",
    meaning: "Keterampilan, Teknik",
    baseMeaning: "keterampilan atau teknik yang diuji.",
    bushuu: "扌",
    kunyomi: "わざ",
    onyomi: "ギ"
  },
  {
    character: "射",
    romaji: "SHA / I",
    meaning: "Menembak, Melepaskan",
    baseMeaning: "menembak atau melepaskan sasaran.",
    bushuu: "寸",
    kunyomi: "い・る",
    onyomi: "シャ"
  },
  {
    character: "練",
    romaji: "REN / Ne",
    meaning: "Melatih, Menggembleng",
    baseMeaning: "melatih, menggembleng, atau ujian berat.",
    bushuu: "糸",
    kunyomi: "ね・る",
    onyomi: "レン"
  },
  {
    character: "写",
    romaji: "SHA / Utsu",
    meaning: "Menayangkan, Menyalin",
    baseMeaning: "menayangkan gambar atau memotret.",
    bushuu: "冖",
    kunyomi: "うつ・す",
    onyomi: "シャ"
  },
  {
    character: "聴",
    romaji: "CHOU / Ki",
    meaning: "Mendengarkan",
    baseMeaning: "mendengarkan contoh rekaman atau suara.",
    bushuu: "耳",
    kunyomi: "き・く",
    onyomi: "チョウ"
  },
  {
    character: "読",
    romaji: "DOKU / Yo",
    meaning: "Membaca",
    baseMeaning: "membaca contoh atau karya tulisan.",
    bushuu: "言",
    kunyomi: "よ・む",
    onyomi: "ドク"
  }
];

const CROSS_LINKS = [
  { source: "試験", target: "入試", predicate: "jenis ujian" },
  { source: "試験", target: "追試", predicate: "ujian susulan" },
  { source: "試験", target: "試問", predicate: "metode pengujian" },
  { source: "試着", target: "試用", predicate: "mirip penggunaan" },
  { source: "試用", target: "試乗", predicate: "sejenis uji coba" },
  { source: "試食", target: "試飲", predicate: "pasangan uji rasa" },
  { source: "試作", target: "試製", predicate: "prototipe & produksi" },
  { source: "試合", target: "試技", predicate: "kegiatan keahlian" },
  { source: "試射", target: "試技", predicate: "uji tembak keahlian" },
  { source: "試練", target: "試験", predicate: "cobaan ketahanan & ujian" },
  { source: "試写", target: "試聴", predicate: "pratinjau media gambar & suara" },
  { source: "試聴", target: "試読", predicate: "pratinjau suara & bacaan" },
  { source: "試薬", target: "試用", predicate: "bahan uji coba" }
];

async function run() {
  const char = "試";
  console.log(`Starting update for kanji ${char}...`);

  // 1. Dapatkan atau verifikasi Kanji 試
  const kanji = await prisma.kanji.findFirst({
    where: { character: char },
  });

  if (!kanji) {
    console.error(`Kanji ${char} not found in DB!`);
    return;
  }

  // Update atribut kanji 試 agar sesuai gambar referensi
  await prisma.kanji.update({
    where: { id: kanji.id },
    data: {
      meaning: "Mencoba / Menguji",
      baseMeaning: "mencoba, menguji, atau melakukan untuk mengetahui hasil atau kualitasnya.",
      romaji: "SHI",
      bushuu: "言",
      onyomi: "シ",
      kunyomi: "こころ・みる、ため・す"
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
        id: `試-cross-${kanji.id}-${i + 1}-${link.source}-${link.target}`,
        kanjiId: kanji.id,
        source: link.source,
        target: link.target,
        predicate: link.predicate
      }
    });
  }
  console.log(`Inserted ${CROSS_LINKS.length} clean cross-link edges into KanjiGraphEdge.`);

  // 5. Bersihkan relasi KategoriKanji, SemanticRelation, dan Jukugo lama untuk kanji 試
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

  // 6. Buat Jukugo baru (19 kata murni), MasterCategory, dan relasi KategoriKanji
  const allWords: string[] = [];
  for (const cat of customGraphShi.categories) {
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
  console.log(`Populated KategoriKanji for all ${allWords.length} unique jukugos across ${customGraphShi.categories.length} categories.`);

  // 7. Update SemanticRelation & SemanticRelationNode untuk kanji 試
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

  // 8. Update Grouping Quiz for kanji 試
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
