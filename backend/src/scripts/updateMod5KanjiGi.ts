import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const customGraphGi = {
  categories: [
    {
      title: "1. PERTEMUAN / DISKUSI",
      color: "border-blue-500",
      jukugos: [
        { word: "会議", reading: "かいぎ", meaning: "rapat / pertemuan" },
        { word: "議論", reading: "ぎろん", meaning: "diskusi / perdebatan" },
        { word: "論議", reading: "ろんぎ", meaning: "perdebatan / diskusi" },
        { word: "討議", reading: "とうぎ", meaning: "membahas / berdiskusi" },
        { word: "合議", reading: "ごうぎ", meaning: "bermusyawarah" },
        { word: "談議", reading: "だんぎ", meaning: "percakapan / pembicaraan" },
        { word: "評議", reading: "ひょうぎ", meaning: "membahas / meninjau" }
      ]
    },
    {
      title: "2. KEPUTUSAN / PENETAPAN",
      color: "border-green-500",
      jukugos: [
        { word: "決議", reading: "けつぎ", meaning: "keputusan bulat" },
        { word: "議決", reading: "ぎけつ", meaning: "keputusan (resmi)" }
      ]
    },
    {
      title: "3. USULAN / AGENDA",
      color: "border-orange-500",
      jukugos: [
        { word: "発議", reading: "はつぎ", meaning: "mengajukan usul" },
        { word: "建議", reading: "けんぎ", meaning: "membuat usulan / rekomendasi" },
        { word: "動議", reading: "どうぎ", meaning: "usulan dalam rapat" },
        { word: "議案", reading: "ぎあん", meaning: "rancangan usulan / agenda" },
        { word: "議題", reading: "ぎだい", meaning: "topik / agenda rapat" }
      ]
    },
    {
      title: "4. PENDAPAT / KONFLIK",
      color: "border-purple-500",
      jukugos: [
        { word: "異議", reading: "いぎ", meaning: "keberatan / sanggahan" },
        { word: "物議", reading: "ぶつぎ", meaning: "menjadi perdebatan" },
        { word: "争議", reading: "そうぎ", meaning: "perselisihan / sengketa" },
        { word: "和議", reading: "わぎ", meaning: "perjanjian damai" }
      ]
    },
    {
      title: "5. PELAKU / LEMBAGA / JALANNYA RAPAT",
      color: "border-teal-500",
      jukugos: [
        { word: "議員", reading: "ぎいん", meaning: "anggota dewan / parlemen" },
        { word: "議長", reading: "ぎちょう", meaning: "ketua sidang / pimpinan rapat" },
        { word: "議事", reading: "ぎじ", meaning: "jalannya rapat / prosedur rapat" },
        { word: "議会", reading: "ぎかい", meaning: "dewan / parlemen / legislatif" }
      ]
    }
  ]
};

const GI_SEMANTIC_DATA = [
  // 1) PERTEMUAN / DISKUSI
  {
    word: "会議",
    penjelasan: "Hubungan makna antara kanji 会 dan 議 menjadi 会議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “rapat atau pertemuan yang dilakukan untuk membahas suatu persoalan.”",
    nodes: [
      { jokugo: "会", arti: "bertemu, berkumpul" },
      { jokugo: "議", arti: "membahas, berunding" }
    ]
  },
  {
    word: "議論",
    penjelasan: "Hubungan makna antara kanji 議 dan 論 menjadi 議論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan membahas suatu persoalan dengan mengemukakan pendapat atau argumentasi.”",
    nodes: [
      { jokugo: "議", arti: "membahas, mengemukakan pendapat" },
      { jokugo: "論", arti: "membahas, berargumentasi" }
    ]
  },
  {
    word: "論議",
    penjelasan: "Hubungan makna antara kanji 論 dan 議 menjadi 論議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pembahasan atau perdebatan mengenai suatu persoalan.”",
    nodes: [
      { jokugo: "論", arti: "membahas, berargumentasi" },
      { jokugo: "議", arti: "membahas, berunding" }
    ]
  },
  {
    word: "討議",
    penjelasan: "Hubungan makna antara kanji 討 dan 議 menjadi 討議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan membahas atau mengkaji suatu persoalan secara mendalam.”",
    nodes: [
      { jokugo: "討", arti: "membahas, menyelidiki, mengkaji" },
      { jokugo: "議", arti: "membahas, berunding" }
    ]
  },
  {
    word: "合議",
    penjelasan: "Hubungan makna antara kanji 合 dan 議 menjadi 合議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “musyawarah atau pembahasan bersama untuk mencapai suatu keputusan.”",
    nodes: [
      { jokugo: "合", arti: "bersama, menyatukan" },
      { jokugo: "議", arti: "membahas, berunding" }
    ]
  },
  {
    word: "談議",
    penjelasan: "Hubungan makna antara kanji 談 dan 議 menjadi 談議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pembicaraan atau diskusi mengenai suatu persoalan.”",
    nodes: [
      { jokugo: "談", arti: "berbicara, membicarakan" },
      { jokugo: "議", arti: "membahas, berunding" }
    ]
  },
  {
    word: "評議",
    penjelasan: "Hubungan makna antara kanji 評 dan 議 menjadi 評議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan mempertimbangkan dan membahas suatu persoalan untuk memperoleh penilaian atau keputusan.”",
    nodes: [
      { jokugo: "評", arti: "menilai, mempertimbangkan" },
      { jokugo: "議", arti: "membahas, berunding" }
    ]
  },

  // 2) KEPUTUSAN / PENETAPAN
  {
    word: "決議",
    penjelasan: "Hubungan makna antara kanji 決 dan 議 menjadi 決議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keputusan atau resolusi yang ditetapkan melalui pembahasan atau rapat.”",
    nodes: [
      { jokugo: "決", arti: "memutuskan, menentukan" },
      { jokugo: "議", arti: "membahas, berunding" }
    ]
  },
  {
    word: "議決",
    penjelasan: "Hubungan makna antara kanji 議 dan 決 menjadi 議決, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keputusan yang ditetapkan setelah melalui pembahasan atau musyawarah.”",
    nodes: [
      { jokugo: "議", arti: "membahas, berunding" },
      { jokugo: "決", arti: "memutuskan, menentukan" }
    ]
  },

  // 3) USULAN / AGENDA
  {
    word: "発議",
    penjelasan: "Hubungan makna antara kanji 発 dan 議 menjadi 発議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tindakan mengajukan suatu usulan atau persoalan untuk dibahas.”",
    nodes: [
      { jokugo: "発", arti: "mengajukan, memulai, mengeluarkan" },
      { jokugo: "議", arti: "membahas, mengusulkan" }
    ]
  },
  {
    word: "建議",
    penjelasan: "Hubungan makna antara kanji 建 dan 議 menjadi 建議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “usulan atau rekomendasi yang diajukan kepada pihak yang berwenang.”",
    nodes: [
      { jokugo: "建", arti: "mengemukakan, mengusulkan" },
      { jokugo: "議", arti: "membahas, mengajukan pendapat" }
    ]
  },
  {
    word: "動議",
    penjelasan: "Hubungan makna antara kanji 動 dan 議 menjadi 動議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mosi atau usul yang diajukan dalam suatu rapat untuk dibahas atau diputuskan.”",
    nodes: [
      { jokugo: "動", arti: "menggerakkan, mengajukan tindakan" },
      { jokugo: "議", arti: "membahas, mengusulkan" }
    ]
  },
  {
    word: "議案",
    penjelasan: "Hubungan makna antara kanji 議 dan 案 menjadi 議案, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “rancangan usulan atau perkara yang diajukan untuk dibahas dalam rapat.”",
    nodes: [
      { jokugo: "議", arti: "membahas, berunding" },
      { jokugo: "案", arti: "rancangan, usulan" }
    ]
  },
  {
    word: "議題",
    penjelasan: "Hubungan makna antara kanji 議 dan 題 menjadi 議題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “topik atau pokok persoalan yang menjadi bahan pembahasan dalam rapat.”",
    nodes: [
      { jokugo: "議", arti: "membahas, berunding" },
      { jokugo: "題", arti: "topik, pokok persoalan" }
    ]
  },

  // 4) PENDAPAT / KONFLIK
  {
    word: "異議",
    penjelasan: "Hubungan makna antara kanji 異 dan 議 menjadi 異議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keberatan atau pendapat yang berbeda terhadap suatu keputusan atau pendapat.”",
    nodes: [
      { jokugo: "異", arti: "berbeda, tidak sama" },
      { jokugo: "議", arti: "pendapat, pembahasan" }
    ]
  },
  {
    word: "物議",
    penjelasan: "Hubungan makna antara kanji 物 dan 議 menjadi 物議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “suatu perkara yang menjadi bahan pembicaraan atau menimbulkan kontroversi.”",
    nodes: [
      { jokugo: "物", arti: "hal, perkara" },
      { jokugo: "議", arti: "pembicaraan, pendapat" }
    ]
  },
  {
    word: "争議",
    penjelasan: "Hubungan makna antara kanji 争 dan 議 menjadi 争議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perselisihan atau konflik yang berkaitan dengan suatu persoalan dan memerlukan pembahasan atau penyelesaian.”",
    nodes: [
      { jokugo: "争", arti: "berselisih, memperdebatkan" },
      { jokugo: "議", arti: "membahas, berunding" }
    ]
  },
  {
    word: "和議",
    penjelasan: "Hubungan makna antara kanji 和 dan 議 menjadi 和議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perundingan yang dilakukan untuk mencapai perdamaian atau menyelesaikan perselisihan.”",
    nodes: [
      { jokugo: "和", arti: "damai, harmonis" },
      { jokugo: "議", arti: "berunding, membahas" }
    ]
  },

  // 5) PELAKU / LEMBAGA / JALANNYA RAPAT
  {
    word: "議員",
    penjelasan: "Hubungan makna antara kanji 議 dan 員 menjadi 議員, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “orang yang menjadi anggota lembaga perwakilan dan terlibat dalam pembahasan atau pengambilan keputusan.”",
    nodes: [
      { jokugo: "議", arti: "membahas, berunding" },
      { jokugo: "員", arti: "anggota, personel" }
    ]
  },
  {
    word: "議長",
    penjelasan: "Hubungan makna antara kanji 議 dan 長 menjadi 議長, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “orang yang memimpin dan mengatur jalannya sidang atau rapat.”",
    nodes: [
      { jokugo: "議", arti: "rapat, pembahasan" },
      { jokugo: "長", arti: "pemimpin, ketua" }
    ]
  },
  {
    word: "議事",
    penjelasan: "Hubungan makna antara kanji 議 dan 事 menjadi 議事, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “hal-hal atau urusan yang berkaitan dengan jalannya rapat atau persidangan.”",
    nodes: [
      { jokugo: "議", arti: "rapat, pembahasan" },
      { jokugo: "事", arti: "hal, perkara, urusan" }
    ]
  },
  {
    word: "議会",
    penjelasan: "Hubungan makna antara kanji 議 dan 会 menjadi 議会, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “lembaga atau forum tempat para anggota berkumpul untuk membahas persoalan dan mengambil keputusan.”",
    nodes: [
      { jokugo: "議", arti: "membahas, berunding" },
      { jokugo: "会", arti: "pertemuan, perkumpulan" }
    ]
  }
];

async function run() {
  const char = "議";
  const kanji = await prisma.kanji.findFirst({ where: { character: char } });
  if (!kanji) {
    console.error(`Kanji ${char} not found in DB`);
    return;
  }

  const validWords = new Set<string>();
  customGraphGi.categories.forEach(cat => {
    cat.jukugos.forEach(jk => validWords.add(jk.word));
  });

  // 1. Update Kanji record for 議
  await prisma.kanji.update({
    where: { id: kanji.id },
    data: {
      romaji: "GI",
      meaning: "membahas, berunding, bertukar pendapat, atau mempertimbangkan suatu hal.",
      baseMeaning: "membahas, berunding, bertukar pendapat, atau mempertimbangkan suatu hal."
    }
  });
  console.log(`Updated kanji 議 baseMeaning and romaji`);

  // Ensure constituent kanji base meanings match semantic analysis
  const CONSTITUENTS = [
    { char: "会", meaning: "bertemu, berkumpul", baseMeaning: "bertemu, berkumpul" },
    { char: "論", meaning: "membahas, berargumentasi", baseMeaning: "membahas, berargumentasi" },
    { char: "討", meaning: "membahas, menyelidiki, mengkaji", baseMeaning: "membahas, menyelidiki, mengkaji" },
    { char: "協", meaning: "bekerja sama, bersepakat", baseMeaning: "bekerja sama, bersepakat" },
    { char: "合", meaning: "bersama, menyatukan", baseMeaning: "bersama, menyatukan" },
    { char: "談", meaning: "berbicara, membicarakan", baseMeaning: "berbicara, membicarakan" },
    { char: "評", meaning: "menilai, mempertimbangkan", baseMeaning: "menilai, mempertimbangkan" },
    { char: "決", meaning: "memutuskan, menentukan", baseMeaning: "memutuskan, menentukan" },
    { char: "発", meaning: "mengajukan, memulai, mengeluarkan", baseMeaning: "mengajukan, memulai, mengeluarkan" },
    { char: "建", meaning: "mengemukakan, mengusulkan", baseMeaning: "mengemukakan, mengusulkan" },
    { char: "動", meaning: "menggerakkan, mengajukan tindakan", baseMeaning: "menggerakkan, mengajukan tindakan" },
    { char: "案", meaning: "rancangan, usulan", baseMeaning: "rancangan, usulan" },
    { char: "題", meaning: "topik, pokok persoalan", baseMeaning: "topik, pokok persoalan" },
    { char: "異", meaning: "berbeda, tidak sama", baseMeaning: "berbeda, tidak sama" },
    { char: "物", meaning: "hal, perkara", baseMeaning: "hal, perkara" },
    { char: "争", meaning: "berselisih, memperdebatkan", baseMeaning: "berselisih, memperdebatkan" },
    { char: "和", meaning: "damai, harmonis", baseMeaning: "damai, harmonis" },
    { char: "員", meaning: "anggota, personel", baseMeaning: "anggota, personel" },
    { char: "長", meaning: "pemimpin, ketua", baseMeaning: "pemimpin, ketua" },
    { char: "事", meaning: "hal, perkara, urusan", baseMeaning: "hal, perkara, urusan" }
  ];

  for (const c of CONSTITUENTS) {
    const existing = await prisma.kanji.findUnique({ where: { character: c.char } });
    if (existing) {
      await prisma.kanji.update({
        where: { character: c.char },
        data: { baseMeaning: c.baseMeaning }
      });
    }
  }

  // 2. Clean obsolete Jukugo records for 議
  const existingJukugos = await prisma.jukugo.findMany({
    where: { kanjiId: kanji.id }
  });

  for (const j of existingJukugos) {
    if (!validWords.has(j.word)) {
      await prisma.kategoriKanji.deleteMany({ where: { jokugoId: j.id } });
      await prisma.semanticRelation.deleteMany({ where: { jukugoId: j.id } });
      await prisma.jukugo.delete({ where: { id: j.id } });
      console.log(`Deleted obsolete jukugo for 議: ${j.word}`);
    }
  }

  // 3. Re-create KanjiGraphEdge with 13 valid cross-links
  const GI_CROSS_LINKS = [
    { id: "cross-3236-1-会議-議会", source: "会議", target: "議会", predicate: "rapat & parlemen dewan" },
    { id: "cross-3236-2-議論-討議", source: "議論", target: "討議", predicate: "perdebatan & pembahasan" },
    { id: "cross-3236-3-決議-議決", source: "決議", target: "議決", predicate: "penetapan keputusan" },
    { id: "cross-3236-4-議案-議題", source: "議案", target: "議題", predicate: "draf usulan & agenda" },
    { id: "cross-3236-5-発議-動議", source: "発議", target: "動議", predicate: "pengajuan usulan & mosi" },
    { id: "cross-3236-6-建議-発議", source: "建議", target: "発議", predicate: "rekomendasi usulan formal" },
    { id: "cross-3236-7-議員-議長", source: "議員", target: "議長", predicate: "anggota & ketua dewan" },
    { id: "cross-3236-8-異議-物議", source: "異議", target: "物議", predicate: "keberatan & kontroversi" },
    { id: "cross-3236-9-争議-和議", source: "争議", target: "和議", predicate: "perselisihan vs perdamaian" },
    { id: "cross-3236-10-論議-議論", source: "論議", target: "議論", predicate: "diskusi pembahasan masalah" },
    { id: "cross-3236-11-合議-評議", source: "合議", target: "評議", predicate: "musyawarah kesepakatan" },
    { id: "cross-3236-12-談議-会議", source: "談議", target: "会議", predicate: "obrolan diskusi & rapat" },
    { id: "cross-3236-13-議事-議案", source: "議事", target: "議案", predicate: "jalannya sidang & materi draf" }
  ];

  await prisma.kanjiGraphEdge.deleteMany({ where: { kanjiId: kanji.id } });
  await prisma.kanjiGraphEdge.createMany({
    data: GI_CROSS_LINKS.map(e => ({
      id: e.id,
      kanjiId: kanji.id,
      source: e.source,
      target: e.target,
      predicate: e.predicate
    }))
  });
  console.log(`Inserted 13 valid cross-link edges for 議`);

  // 4. Clear all old KategoriKanji mappings for this kanji's jukugos
  const currentJukugos = await prisma.jukugo.findMany({ where: { kanjiId: kanji.id } });
  const currentJukugoIds = currentJukugos.map(j => j.id);
  await prisma.kategoriKanji.deleteMany({
    where: { jokugoId: { in: currentJukugoIds } }
  });

  // 5. Update MasterCategory, Jukugo, KategoriKanji
  const allWords: string[] = [];
  const groups: Record<string, string[]>[] = [];

  for (const cat of customGraphGi.categories) {
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

  // 6. Update SemanticRelation & SemanticRelationNode for kanji 議
  await prisma.semanticRelation.deleteMany({ where: { kanjiId: kanji.id } });

  for (const semItem of GI_SEMANTIC_DATA) {
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

  // 7. Update Grouping Quiz for kanji 議
  await prisma.quiz.deleteMany({
    where: { kanjiId: kanji.id, type: "grouping" }
  });

  const formattedGroups = customGraphGi.categories.map(cat => ({
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

  console.log(`Successfully updated graph, categories, semantic relations & grouping quiz for ${char}`);
}

run()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
