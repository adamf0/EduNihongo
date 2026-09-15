import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const customGraphHou = {
  categories: [
    {
      title: "1. INFORMASI / PEMBERITAHUAN",
      color: "border-red-500",
      jukugos: [
        { word: "情報", reading: "じょうほう", meaning: "informasi" },
        { word: "報知", reading: "ほうち", meaning: "pemberitahuan" },
        { word: "報告", reading: "ほうこく", meaning: "laporan" },
        { word: "予報", reading: "よほう", meaning: "prakiraan / ramalan" },
        { word: "通報", reading: "つうほう", meaning: "pelaporan / pemberitahuan" }
      ]
    },
    {
      title: "2. BERITA / JENIS INFORMASI",
      color: "border-orange-500",
      jukugos: [
        { word: "速報", reading: "そくほう", meaning: "berita cepat / berita terkini" },
        { word: "続報", reading: "ぞくほう", meaning: "berita lanjutan" },
        { word: "特報", reading: "とくほう", meaning: "berita khusus" },
        { word: "悲報", reading: "ひほう", meaning: "berita duka" },
        { word: "勝報", reading: "しょうほう", meaning: "berita kemenangan" }
      ]
    },
    {
      title: "3. LAPORAN / PUBLIKASI / INFORMASI RESMI",
      color: "border-blue-500",
      jukugos: [
        { word: "日報", reading: "にっぽう", meaning: "laporan harian" },
        { word: "広報", reading: "こうほう", meaning: "informasi / publikasi kepada masyarakat" },
        { word: "公報", reading: "こうほう", meaning: "pengumuman / berita resmi" },
        { word: "確報", reading: "かくほう", meaning: "laporan yang telah dipastikan" },
        { word: "会報", reading: "かいほう", meaning: "buletin / laporan organisasi" },
        { word: "時報", reading: "じほう", meaning: "informasi waktu yang diumumkan berkala" }
      ]
    },
    {
      title: "4. BALASAN / PEMBALASAN",
      color: "border-green-500",
      jukugos: [
        { word: "返報", reading: "へんぽう", meaning: "balasan / pembalasan" },
        { word: "報復", reading: "ほうふく", meaning: "pembalasan" }
      ]
    },
    {
      title: "5. MEDIA / CARA PENYAMPAIAN INFORMASI",
      color: "border-purple-500",
      jukugos: [
        { word: "電報", reading: "でんぽう", meaning: "telegram" },
        { word: "外報", reading: "がいほう", meaning: "berita dari luar negeri" },
        { word: "報道", reading: "ほうどう", meaning: "pemberitaan / media berita" }
      ]
    }
  ]
};

const HOU_SEMANTIC_DATA = [
  // 1) INFORMASI / PEMBERITAHUAN
  {
    word: "情報",
    penjelasan: "Hubungan makna antar kanji 情 dan 報 menjadi 情報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “informasi atau keterangan mengenai suatu hal.”",
    nodes: [
      { jokugo: "情", arti: "perasaan, keadaan, situasi, informasi mengenai sesuatu" },
      { jokugo: "報", arti: "memberitahukan, menyampaikan informasi" }
    ]
  },
  {
    word: "報知",
    penjelasan: "Hubungan makna antar kanji 報 dan 知 menjadi 報知, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memberitahukan atau menyampaikan sesuatu agar diketahui oleh orang lain.”",
    nodes: [
      { jokugo: "報", arti: "memberitahukan, menyampaikan" },
      { jokugo: "知", arti: "mengetahui, pengetahuan" }
    ]
  },
  {
    word: "報告",
    penjelasan: "Hubungan makna antar kanji 報 dan 告 menjadi 報告, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menyampaikan atau memberitahukan hasil, keadaan, atau informasi mengenai suatu kegiatan kepada pihak lain.”",
    nodes: [
      { jokugo: "報", arti: "memberitahukan, menyampaikan" },
      { jokugo: "告", arti: "memberitahukan, memberi tahu" }
    ]
  },
  {
    word: "予報",
    penjelasan: "Hubungan makna antar kanji 予 dan 報 menjadi 予報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “informasi atau pemberitahuan mengenai sesuatu yang diperkirakan akan terjadi.”",
    nodes: [
      { jokugo: "予", arti: "sebelumnya, perkiraan" },
      { jokugo: "報", arti: "memberitahukan, menyampaikan informasi" }
    ]
  },
  {
    word: "通報",
    penjelasan: "Hubungan makna antar kanji 通 dan 報 menjadi 通報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menyampaikan atau melaporkan suatu informasi kepada pihak tertentu.”",
    nodes: [
      { jokugo: "通", arti: "menyampaikan, meneruskan, menghubungkan" },
      { jokugo: "報", arti: "memberitahukan, melaporkan" }
    ]
  },

  // 2) BERITA / JENIS INFORMASI
  {
    word: "速報",
    penjelasan: "Hubungan makna antar kanji 速 dan 報 menjadi 速報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “berita atau informasi yang disampaikan dengan cepat mengenai suatu peristiwa yang baru terjadi.”",
    nodes: [
      { jokugo: "速", arti: "cepat" },
      { jokugo: "報", arti: "berita, pemberitahuan" }
    ]
  },
  {
    word: "続報",
    penjelasan: "Hubungan makna antar kanji 続 dan 報 menjadi 続報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “berita atau informasi lanjutan mengenai suatu peristiwa yang telah diberitakan sebelumnya.”",
    nodes: [
      { jokugo: "続", arti: "melanjutkan, berlanjut" },
      { jokugo: "報", arti: "berita, informasi" }
    ]
  },
  {
    word: "特報",
    penjelasan: "Hubungan makna antar kanji 特 dan 報 menjadi 特報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “berita atau informasi yang disampaikan secara khusus karena memiliki sifat atau kepentingan tertentu.”",
    nodes: [
      { jokugo: "特", arti: "khusus" },
      { jokugo: "報", arti: "berita, informasi" }
    ]
  },
  {
    word: "悲報",
    penjelasan: "Hubungan makna antar kanji 悲 dan 報 menjadi 悲報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “berita yang membawa atau menyampaikan kabar duka atau kesedihan.”",
    nodes: [
      { jokugo: "悲", arti: "sedih, duka" },
      { jokugo: "報", arti: "berita, informasi" }
    ]
  },
  {
    word: "勝報",
    penjelasan: "Hubungan makna antar kanji 勝 dan 報 menjadi 勝報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “berita yang menyampaikan kemenangan atau hasil yang baik dalam suatu pertandingan atau peristiwa.”",
    nodes: [
      { jokugo: "勝", arti: "menang, kemenangan" },
      { jokugo: "報", arti: "berita, informasi" }
    ]
  },

  // 3) LAPORAN / PUBLIKASI / INFORMASI RESMI
  {
    word: "日報",
    penjelasan: "Hubungan makna antar kanji 日 dan 報 menjadi 日報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “laporan atau informasi yang dibuat atau disampaikan setiap hari.”",
    nodes: [
      { jokugo: "日", arti: "hari" },
      { jokugo: "報", arti: "laporan, berita" }
    ]
  },
  {
    word: "広報",
    penjelasan: "Hubungan makna antar kanji 広 dan 報 menjadi 広報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “informasi atau pemberitaan yang disampaikan secara luas kepada masyarakat.”",
    nodes: [
      { jokugo: "広", arti: "luas" },
      { jokugo: "報", arti: "informasi, pemberitaan" }
    ]
  },
  {
    word: "公報",
    penjelasan: "Hubungan makna antar kanji 公 dan 報 menjadi 公報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pemberitahuan atau berita yang disampaikan secara resmi kepada masyarakat atau untuk kepentingan umum.”",
    nodes: [
      { jokugo: "公", arti: "umum, publik" },
      { jokugo: "報", arti: "berita, pemberitahuan" }
    ]
  },
  {
    word: "確報",
    penjelasan: "Hubungan makna antar kanji 確 dan 報 menjadi 確報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “berita atau laporan yang kebenarannya telah dipastikan.”",
    nodes: [
      { jokugo: "確", arti: "pasti, memastikan" },
      { jokugo: "報", arti: "berita, laporan" }
    ]
  },
  {
    word: "会報",
    penjelasan: "Hubungan makna antar kanji 会 dan 報 menjadi 会報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “buletin atau laporan yang berisi informasi mengenai kegiatan suatu organisasi atau perkumpulan.”",
    nodes: [
      { jokugo: "会", arti: "perkumpulan, organisasi" },
      { jokugo: "報", arti: "berita, laporan" }
    ]
  },
  {
    word: "時報",
    penjelasan: "Hubungan makna antar kanji 時 dan 報 menjadi 時報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pemberitahuan mengenai waktu yang disampaikan pada waktu-waktu tertentu secara berkala.”",
    nodes: [
      { jokugo: "時", arti: "waktu" },
      { jokugo: "報", arti: "memberitahukan, menyampaikan informasi" }
    ]
  },

  // 4) BALASAN / PEMBALASAN
  {
    word: "返報",
    penjelasan: "Hubungan makna antar kanji 返 dan 報 menjadi 返報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memberikan balasan atau mengembalikan suatu tindakan yang telah diterima.”",
    nodes: [
      { jokugo: "返", arti: "mengembalikan, membalas" },
      { jokugo: "報", arti: "membalas, memberikan balasan" }
    ]
  },
  {
    word: "報復",
    penjelasan: "Hubungan makna antar kanji 報 dan 復 menjadi 報復, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “melakukan pembalasan terhadap suatu tindakan atau perlakuan yang telah diterima.”",
    nodes: [
      { jokugo: "報", arti: "membalas, memberikan balasan" },
      { jokugo: "復", arti: "kembali, mengembalikan" }
    ]
  },

  // 5) MEDIA / CARA PENYAMPAIAN INFORMASI
  {
    word: "電報",
    penjelasan: "Hubungan makna antar kanji 電 dan 報 menjadi 電報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “penyampaian berita atau pesan melalui sarana komunikasi listrik/telegraf.”",
    nodes: [
      { jokugo: "電", arti: "listrik, elektronik" },
      { jokugo: "報", arti: "berita, pemberitahuan" }
    ]
  },
  {
    word: "外報",
    penjelasan: "Hubungan makna antar kanji 外 dan 報 menjadi 外報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “berita atau informasi yang berasal dari luar negeri atau dari luar suatu wilayah.”",
    nodes: [
      { jokugo: "外", arti: "luar" },
      { jokugo: "報", arti: "berita, informasi" }
    ]
  },
  {
    word: "報道",
    penjelasan: "Hubungan makna antar kanji 報 dan 道 menjadi 報道, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan menyampaikan atau memberitakan informasi mengenai suatu peristiwa kepada masyarakat.”",
    nodes: [
      { jokugo: "報", arti: "berita, memberitahukan" },
      { jokugo: "道", arti: "jalan, menyampaikan" }
    ]
  }
];

async function run() {
  const char = "報";
  const kanji = await prisma.kanji.findFirst({ where: { character: char } });
  if (!kanji) {
    console.error(`Kanji ${char} not found in DB`);
    return;
  }

  const validWords = new Set<string>();
  customGraphHou.categories.forEach(cat => {
    cat.jukugos.forEach(jk => validWords.add(jk.word));
  });

  // 1. Clean obsolete Jukugo records for 報
  const existingJukugos = await prisma.jukugo.findMany({
    where: { kanjiId: kanji.id }
  });

  for (const j of existingJukugos) {
    if (!validWords.has(j.word)) {
      await prisma.kategoriKanji.deleteMany({ where: { jokugoId: j.id } });
      await prisma.semanticRelation.deleteMany({ where: { jukugoId: j.id } });
      await prisma.jukugo.delete({ where: { id: j.id } });
      console.log(`Deleted obsolete jukugo for 報: ${j.word}`);
    }
  }

  // 2. Delete existing KanjiGraphEdge for 報
  await prisma.kanjiGraphEdge.deleteMany({ where: { kanjiId: kanji.id } });

  // 3. Re-create KanjiGraphEdge
  const graphEdges: any[] = [];
  customGraphHou.categories.forEach((cat, catIdx) => {
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

  for (const cat of customGraphHou.categories) {
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

  // 6. Update SemanticRelation & SemanticRelationNode for kanji 報
  await prisma.semanticRelation.deleteMany({ where: { kanjiId: kanji.id } });

  for (const semItem of HOU_SEMANTIC_DATA) {
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

  // 7. Update Grouping Quiz for kanji 報
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
