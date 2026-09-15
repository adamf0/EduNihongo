import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const customGraphMu = {
  categories: [
    {
      title: "1. PEKERJAAN / TUGAS",
      color: "border-blue-500",
      jukugos: [
        { word: "業務", reading: "ぎょうむ", meaning: "pekerjaan / tugas" },
        { word: "職務", reading: "しょくむ", meaning: "tugas / pekerjaan jabatan" },
        { word: "勤務", reading: "きんむ", meaning: "bekerja / bertugas" },
        { word: "実務", reading: "じつむ", meaning: "pekerjaan praktis" },
        { word: "事務", reading: "じむ", meaning: "urusan administrasi" }
      ]
    },
    {
      title: "2. TUGAS / KEWAJIBAN",
      color: "border-green-500",
      jukugos: [
        { word: "任務", reading: "にんむ", meaning: "tugas / misi" },
        { word: "義務", reading: "ぎむ", meaning: "kewajiban" },
        { word: "公務", reading: "こうむ", meaning: "tugas resmi" }
      ]
    },
    {
      title: "3. URUSAN / PELAKSANAAN TUGAS",
      color: "border-orange-500",
      jukugos: [
        { word: "労務", reading: "ろうむ", meaning: "urusan tenaga kerja" },
        { word: "服務", reading: "ふくむ", meaning: "menjalankan tugas" },
        { word: "用務", reading: "ようむ", meaning: "urusan / keperluan" }
      ]
    },
    {
      title: "4. BIDANG / URUSAN TUGAS",
      color: "border-purple-500",
      jukugos: [
        { word: "財務", reading: "ざいむ", meaning: "urusan keuangan" },
        { word: "教務", reading: "きょうむ", meaning: "urusan pendidikan" },
        { word: "法務", reading: "ほうむ", meaning: "urusan hukum" }
      ]
    }
  ]
};

const MU_SEMANTIC_DATA = [
  // 1) PEKERJAAN / TUGAS
  {
    word: "業務",
    penjelasan: "Hubungan makna antar kanji 業 dan 務 menjadi 業務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pekerjaan atau tugas yang dilakukan dalam suatu kegiatan atau usaha.”",
    nodes: [
      { jokugo: "業", arti: "pekerjaan, usaha, kegiatan" },
      { jokugo: "務", arti: "tugas, pekerjaan, urusan" }
    ]
  },
  {
    word: "職務",
    penjelasan: "Hubungan makna antar kanji 職 dan 務 menjadi 職務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tugas atau pekerjaan yang berkaitan dengan suatu jabatan.”",
    nodes: [
      { jokugo: "職", arti: "pekerjaan, jabatan, profesi" },
      { jokugo: "務", arti: "tugas, pekerjaan, kewajiban" }
    ]
  },
  {
    word: "勤務",
    penjelasan: "Hubungan makna antar kanji 勤 dan 務 menjadi 勤務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “melaksanakan pekerjaan atau menjalankan tugas dalam suatu pekerjaan.”",
    nodes: [
      { jokugo: "勤", arti: "bekerja, menjalankan tugas" },
      { jokugo: "務", arti: "tugas, pekerjaan" }
    ]
  },
  {
    word: "実務",
    penjelasan: "Hubungan makna antar kanji 実 dan 務 menjadi 実務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pekerjaan yang bersifat praktis atau pekerjaan yang benar-benar dilaksanakan.”",
    nodes: [
      { jokugo: "実", arti: "nyata, praktik, kenyataan" },
      { jokugo: "務", arti: "tugas, pekerjaan" }
    ]
  },
  {
    word: "事務",
    penjelasan: "Hubungan makna antar kanji 事 dan 務 menjadi 事務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “urusan atau pekerjaan administratif yang perlu dilaksanakan.”",
    nodes: [
      { jokugo: "事", arti: "urusan, hal, perkara" },
      { jokugo: "務", arti: "tugas, pekerjaan, urusan" }
    ]
  },

  // 2) TUGAS / KEWAJIBAN
  {
    word: "任務",
    penjelasan: "Hubungan makna antar kanji 任 dan 務 menjadi 任務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tugas atau misi yang dipercayakan kepada seseorang untuk dilaksanakan.”",
    nodes: [
      { jokugo: "任", arti: "tugas, tanggung jawab, penugasan" },
      { jokugo: "務", arti: "tugas, pekerjaan, kewajiban" }
    ]
  },
  {
    word: "義務",
    penjelasan: "Hubungan makna antar kanji 義 dan 務 menjadi 義務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kewajiban yang harus dilakukan atau dipenuhi.”",
    nodes: [
      { jokugo: "義", arti: "kewajiban, prinsip" },
      { jokugo: "務", arti: "tugas, kewajiban" }
    ]
  },
  {
    word: "公務",
    penjelasan: "Hubungan makna antar kanji 公 dan 務 menjadi 公務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tugas atau pekerjaan resmi yang berkaitan dengan kepentingan umum atau pelayanan publik.”",
    nodes: [
      { jokugo: "公", arti: "umum, publik, resmi" },
      { jokugo: "務", arti: "tugas, pekerjaan" }
    ]
  },

  // 3) URUSAN / PELAKSANAAN TUGAS
  {
    word: "労務",
    penjelasan: "Hubungan makna antar kanji 労 dan 務 menjadi 労務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “urusan atau pekerjaan yang berkaitan dengan tenaga kerja.”",
    nodes: [
      { jokugo: "労", arti: "tenaga, kerja, usaha" },
      { jokugo: "務", arti: "tugas, pekerjaan, urusan" }
    ]
  },
  {
    word: "服務",
    penjelasan: "Hubungan makna antar kanji 服 dan 務 menjadi 服務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menjalankan tugas atau melakukan pekerjaan dalam suatu dinas.”",
    nodes: [
      { jokugo: "服", arti: "melayani, menaati, menjalankan" },
      { jokugo: "務", arti: "tugas, pekerjaan" }
    ]
  },
  {
    word: "用務",
    penjelasan: "Hubungan makna antar kanji 用 dan 務 menjadi 用務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “urusan atau keperluan yang berkaitan dengan pekerjaan.”",
    nodes: [
      { jokugo: "用", arti: "keperluan, penggunaan, urusan" },
      { jokugo: "務", arti: "tugas, pekerjaan, urusan" }
    ]
  },

  // 4) BIDANG / URUSAN TUGAS
  {
    word: "財務",
    penjelasan: "Hubungan makna antar kanji 財 dan 務 menjadi 財務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “urusan atau tugas yang berkaitan dengan keuangan.”",
    nodes: [
      { jokugo: "財", arti: "harta, keuangan, kekayaan" },
      { jokugo: "務", arti: "tugas, pekerjaan, urusan" }
    ]
  },
  {
    word: "教務",
    penjelasan: "Hubungan makna antar kanji 教 dan 務 menjadi 教務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “urusan atau tugas yang berkaitan dengan kegiatan pendidikan.”",
    nodes: [
      { jokugo: "教", arti: "mengajar, pendidikan, ajaran" },
      { jokugo: "務", arti: "tugas, pekerjaan, urusan" }
    ]
  },
  {
    word: "法務",
    penjelasan: "Hubungan makna antar kanji 法 dan 務 menjadi 法務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “urusan atau tugas yang berkaitan dengan hukum.”",
    nodes: [
      { jokugo: "法", arti: "hukum, aturan, ketentuan" },
      { jokugo: "務", arti: "tugas, pekerjaan, urusan" }
    ]
  }
];

async function run() {
  const char = "務";
  const kanji = await prisma.kanji.findFirst({ where: { character: char } });
  if (!kanji) {
    console.error(`Kanji ${char} not found in DB`);
    return;
  }

  const validWords = new Set<string>();
  customGraphMu.categories.forEach(cat => {
    cat.jukugos.forEach(jk => validWords.add(jk.word));
  });

  // 1. Clean obsolete Jukugo records for 務
  const existingJukugos = await prisma.jukugo.findMany({
    where: { kanjiId: kanji.id }
  });

  for (const j of existingJukugos) {
    if (!validWords.has(j.word)) {
      await prisma.kategoriKanji.deleteMany({ where: { jokugoId: j.id } });
      await prisma.semanticRelation.deleteMany({ where: { jukugoId: j.id } });
      await prisma.jukugo.delete({ where: { id: j.id } });
      console.log(`Deleted obsolete jukugo for 務: ${j.word}`);
    }
  }

  // 2. Delete existing KanjiGraphEdge for 務
  await prisma.kanjiGraphEdge.deleteMany({ where: { kanjiId: kanji.id } });

  // 3. Re-create KanjiGraphEdge
  const graphEdges: any[] = [];
  customGraphMu.categories.forEach((cat, catIdx) => {
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

  for (const cat of customGraphMu.categories) {
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

  // 6. Update SemanticRelation & SemanticRelationNode for kanji 務
  await prisma.semanticRelation.deleteMany({ where: { kanjiId: kanji.id } });

  for (const semItem of MU_SEMANTIC_DATA) {
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

  // 7. Update Grouping Quiz for kanji 務
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
