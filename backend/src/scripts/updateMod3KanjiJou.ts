import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const customGraphJou = {
  categories: [
    {
      title: "1. PERASAAN / EMOSI",
      color: "border-pink-500",
      jukugos: [
        { word: "感情", reading: "かんじょう", meaning: "perasaan, emosi" },
        { word: "表情", reading: "ひょうじょう", meaning: "ekspresi wajah" },
        { word: "心情", reading: "しんじょう", meaning: "perasaan hati, suasana batin" },
        { word: "真情", reading: "しんじょう", meaning: "perasaan yang sebenarnya" },
        { word: "純情", reading: "じゅんじょう", meaning: "perasaan yang murni, tulus" }
      ]
    },
    {
      title: "2. KASIH SAYANG / HUBUNGAN ANTARMANUSIA",
      color: "border-orange-500",
      jukugos: [
        { word: "愛情", reading: "あいじょう", meaning: "kasih sayang, cinta" },
        { word: "友情", reading: "ゆうじょう", meaning: "persahabatan, persahabatan tulus" },
        { word: "同情", reading: "どうじょう", meaning: "simpati, empati" },
        { word: "人情", reading: "にんじょう", meaning: "perasaan kemanusiaan" },
        { word: "交情", reading: "こうじょう", meaning: "hubungan akrab, perasaan kedekatan" }
      ]
    },
    {
      title: "3. PERASAAN / SEMANGAT YANG KUAT",
      color: "border-cyan-500",
      jukugos: [
        { word: "情熱", reading: "じょうねつ", meaning: "semangat, gairah, passion" },
        { word: "熱情", reading: "ねつじょう", meaning: "perasaan, semangat yang kuat" }
      ]
    },
    {
      title: "4. KEADAAN / SITUASI",
      color: "border-purple-500",
      jukugos: [
        { word: "事情", reading: "じじょう", meaning: "keadaan, alasan, latar belakang" },
        { word: "実情", reading: "じつじょう", meaning: "keadaan sebenarnya, realitas" },
        { word: "内情", reading: "ないじょう", meaning: "keadaan internal, keadaan di dalam" },
        { word: "情勢", reading: "じょうせい", meaning: "situasi, kondisi, keadaan terkini" },
        { word: "情景", reading: "じょうけい", meaning: "pemandangan, adegan, suasana" }
      ]
    },
    {
      title: "5. KELUHAN / PERASAAN TIDAK PUAS",
      color: "border-green-500",
      jukugos: [
        { word: "苦情", reading: "くじょう", meaning: "keluhan, komplain" }
      ]
    },
    {
      title: "6. INFORMASI / DATA",
      color: "border-blue-500",
      jukugos: [
        { word: "情報", reading: "じょうほう", meaning: "informasi, berita, data" }
      ]
    }
  ]
};

const JOU_SEMANTIC_DATA = [
  // 1. PERASAAN / EMOSI
  {
    word: "感情",
    penjelasan: "Hubungan makna antar kanji 感 dan 情 menjadi 感情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perasaan atau emosi yang timbul sebagai reaksi terhadap sesuatu.”",
    nodes: [
      { jokugo: "感", arti: "merasakan, perasaan" },
      { jokugo: "情", arti: "perasaan, emosi" }
    ]
  },
  {
    word: "表情",
    penjelasan: "Hubungan makna antar kanji 表 dan 情 menjadi 表情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perasaan atau emosi yang tampak dan diperlihatkan melalui raut wajah.”",
    nodes: [
      { jokugo: "表", arti: "menampilkan, memperlihatkan" },
      { jokugo: "情", arti: "perasaan, emosi" }
    ]
  },
  {
    word: "心情",
    penjelasan: "Hubungan makna antar kanji 心 dan 情 menjadi 心情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perasaan mendalam yang dirasakan dalam hati atau batin seseorang.”",
    nodes: [
      { jokugo: "心", arti: "hati, batin" },
      { jokugo: "情", arti: "perasaan, emosi" }
    ]
  },
  {
    word: "真情",
    penjelasan: "Hubungan makna antar kanji 真 dan 情 menjadi 真情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perasaan yang murni dan benar-benar dirasakan tanpa kepalsuan.”",
    nodes: [
      { jokugo: "真", arti: "benar, sungguh-sungguh, murni" },
      { jokugo: "情", arti: "perasaan, emosi" }
    ]
  },
  {
    word: "純情",
    penjelasan: "Hubungan makna antar kanji 純 dan 情 menjadi 純情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perasaan yang murni, polos, dan tulus tanpa kepentingan tertentu.”",
    nodes: [
      { jokugo: "純", arti: "murni, polos" },
      { jokugo: "情", arti: "perasaan, emosi" }
    ]
  },

  // 2. KASIH SAYANG / HUBUNGAN ANTARMANUSIA
  {
    word: "愛情",
    penjelasan: "Hubungan makna antar kanji 愛 dan 情 menjadi 愛情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perasaan kasih sayang dan cinta yang mendalam terhadap seseorang.”",
    nodes: [
      { jokugo: "愛", arti: "mencintai, menyayangi" },
      { jokugo: "情", arti: "perasaan, kasih sayang" }
    ]
  },
  {
    word: "友情",
    penjelasan: "Hubungan makna antar kanji 友 dan 情 menjadi 友情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perasaan kasih sayang dan kehangatan dalam ikatan persahabatan.”",
    nodes: [
      { jokugo: "友", arti: "teman, sahabat" },
      { jokugo: "情", arti: "perasaan, kasih sayang" }
    ]
  },
  {
    word: "同情",
    penjelasan: "Hubungan makna antar kanji 同 dan 情 menjadi 同情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “merasakan perasaan yang sama terhadap penderitaan atau kesusahan orang lain (simpati/empati).”",
    nodes: [
      { jokugo: "同", arti: "sama, bersama" },
      { jokugo: "情", arti: "perasaan" }
    ]
  },
  {
    word: "人情",
    penjelasan: "Hubungan makna antar kanji 人 dan 情 menjadi 人情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perasaan kasih sayang, empati, dan kepedulian yang alami antar sesama manusia.”",
    nodes: [
      { jokugo: "人", arti: "manusia" },
      { jokugo: "情", arti: "perasaan, kasih sayang" }
    ]
  },
  {
    word: "交情",
    penjelasan: "Hubungan makna antar kanji 交 dan 情 menjadi 交情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perasaan kedekatan dan kehangatan yang terjalin dalam hubungan pergaulan.”",
    nodes: [
      { jokugo: "交", arti: "bergaul, berhubungan" },
      { jokugo: "情", arti: "perasaan" }
    ]
  },

  // 3. PERASAAN / SEMANGAT YANG KUAT
  {
    word: "情熱",
    penjelasan: "Hubungan makna antar kanji 情 dan 熱 menjadi 情熱, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perasaan yang membara dan semangat yang sangat kuat terhadap sesuatu.”",
    nodes: [
      { jokugo: "情", arti: "perasaan" },
      { jokugo: "熱", arti: "panas, semangat tinggi" }
    ]
  },
  {
    word: "熱情",
    penjelasan: "Hubungan makna antar kanji 熱 dan 情 menjadi 熱情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perasaan emosional yang sangat mendalam dan penuh antusiasme.”",
    nodes: [
      { jokugo: "熱", arti: "panas, kuat" },
      { jokugo: "情", arti: "perasaan" }
    ]
  },

  // 4. KEADAAN / SITUASI
  {
    word: "事情",
    penjelasan: "Hubungan makna antar kanji 事 dan 情 menjadi 事情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keadaan atau latar belakang situasi yang berkaitan dengan suatu urusan.”",
    nodes: [
      { jokugo: "事", arti: "hal, urusan" },
      { jokugo: "情", arti: "keadaan, situasi" }
    ]
  },
  {
    word: "実情",
    penjelasan: "Hubungan makna antar kanji 実 dan 情 menjadi 実情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keadaan atau kondisi nyata yang sebenarnya terjadi di lapangan.”",
    nodes: [
      { jokugo: "実", arti: "nyata, sebenarnya" },
      { jokugo: "情", arti: "keadaan, situasi" }
    ]
  },
  {
    word: "内情",
    penjelasan: "Hubungan makna antar kanji 内 dan 情 menjadi 内情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keadaan atau situasi rahasia yang ada di bagian dalam suatu organisasi atau kelompok.”",
    nodes: [
      { jokugo: "内", arti: "dalam, internal" },
      { jokugo: "情", arti: "keadaan, situasi" }
    ]
  },
  {
    word: "情勢",
    penjelasan: "Hubungan makna antar kanji 情 dan 勢 menjadi 情勢, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perkembangan situasi atau kondisi terkini dalam suatu keadaan.”",
    nodes: [
      { jokugo: "情", arti: "keadaan, situasi" },
      { jokugo: "勢", arti: "kecenderungan, perkembangan" }
    ]
  },
  {
    word: "情景",
    penjelasan: "Hubungan makna antar kanji 情 dan 景 menjadi 情景, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pemandangan atau suasana tertentu yang membangkitkan kesan dan perasaan.”",
    nodes: [
      { jokugo: "情", arti: "perasaan, suasana" },
      { jokugo: "景", arti: "pemandangan, adegan" }
    ]
  },

  // 5. KELUHAN / PERASAAN TIDAK PUAS
  {
    word: "苦情",
    penjelasan: "Hubungan makna antar kanji 苦 dan 情 menjadi 苦情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perasaan tidak puas atau keluhan yang disampaikan atas rasa tidak nyaman/kerugian yang dialami.”",
    nodes: [
      { jokugo: "苦", arti: "pahit, derita, ketidakpuasan" },
      { jokugo: "情", arti: "perasaan, keadaan" }
    ]
  },

  // 6. INFORMASI / DATA
  {
    word: "情報",
    penjelasan: "Hubungan makna antar kanji 情 dan 報 menjadi 情報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pemberitahuan atau laporan mengenai keadaan/situasi tertentu (informasi/data).”",
    nodes: [
      { jokugo: "情", arti: "keadaan, kondisi" },
      { jokugo: "報", arti: "memberitahukan, melaporkan" }
    ]
  }
];

async function run() {
  const char = "情";
  const kanji = await prisma.kanji.findFirst({ where: { character: char } });
  if (!kanji) {
    console.error(`Kanji ${char} not found in DB`);
    return;
  }

  const validWords = new Set<string>();
  customGraphJou.categories.forEach(cat => {
    cat.jukugos.forEach(jk => validWords.add(jk.word));
  });

  // 1. Clean obsolete Jukugo records for 情
  const existingJukugos = await prisma.jukugo.findMany({
    where: { kanjiId: kanji.id }
  });

  for (const j of existingJukugos) {
    if (!validWords.has(j.word)) {
      await prisma.kategoriKanji.deleteMany({ where: { jokugoId: j.id } });
      await prisma.semanticRelation.deleteMany({ where: { jukugoId: j.id } });
      await prisma.jukugo.delete({ where: { id: j.id } });
      console.log(`Deleted obsolete jukugo for 情: ${j.word}`);
    }
  }

  // 2. Delete existing KanjiGraphEdge for 情
  await prisma.kanjiGraphEdge.deleteMany({ where: { kanjiId: kanji.id } });

  // 3. Re-create KanjiGraphEdge
  const graphEdges: any[] = [];
  customGraphJou.categories.forEach((cat, catIdx) => {
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

  for (const cat of customGraphJou.categories) {
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

  // 6. Update SemanticRelation & SemanticRelationNode for kanji 情
  await prisma.semanticRelation.deleteMany({ where: { kanjiId: kanji.id } });

  for (const semItem of JOU_SEMANTIC_DATA) {
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

  // 7. Update Grouping Quiz for kanji 情
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
