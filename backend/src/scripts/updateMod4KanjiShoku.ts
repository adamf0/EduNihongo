import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const customGraphShoku = {
  categories: [
    {
      title: "1. PROFESI / PEKERJAAN",
      color: "border-purple-500",
      jukugos: [
        { word: "職業", reading: "しょくぎょう", meaning: "profesi / pekerjaan" },
        { word: "職人", reading: "しょくにん", meaning: "pengrajin / pekerja terampil" }
      ]
    },
    {
      title: "2. ORANG / TEMPAT KERJA",
      color: "border-blue-500",
      jukugos: [
        { word: "職員", reading: "しょくいん", meaning: "staf / pegawai" },
        { word: "職場", reading: "しょくば", meaning: "tempat kerja" }
      ]
    },
    {
      title: "3. MENCARI / MEMILIKI PEKERJAAN",
      color: "border-green-500",
      jukugos: [
        { word: "求職", reading: "きゅうしょく", meaning: "mencari pekerjaan" },
        { word: "有職", reading: "ゆうしょく", meaning: "memiliki pekerjaan" }
      ]
    },
    {
      title: "4. PERUBAHAN / STATUS PEKERJAAN",
      color: "border-orange-500",
      jukugos: [
        { word: "転職", reading: "てんしょく", meaning: "pindah pekerjaan" },
        { word: "退職", reading: "たいしょく", meaning: "berhenti bekerja" },
        { word: "無職", reading: "むしょく", meaning: "tidak bekerja / pengangguran" }
      ]
    }
  ]
};

const SHOKU_SEMANTIC_DATA = [
  // 1) PROFESI / PEKERJAAN
  {
    word: "職業",
    penjelasan: "Hubungan makna antar kanji 職 dan 業 menjadi 職業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “profesi atau pekerjaan yang dilakukan seseorang.”",
    nodes: [
      { jokugo: "職", arti: "pekerjaan, jabatan, profesi" },
      { jokugo: "業", arti: "pekerjaan, usaha, kegiatan" }
    ]
  },
  {
    word: "職人",
    penjelasan: "Hubungan makna antar kanji 職 dan 人 menjadi 職人, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “orang yang memiliki pekerjaan atau keterampilan khusus, terutama sebagai pengrajin atau pekerja terampil.”",
    nodes: [
      { jokugo: "職", arti: "pekerjaan, profesi" },
      { jokugo: "人", arti: "orang, manusia" }
    ]
  },

  // 2) ORANG / TEMPAT KERJA
  {
    word: "職員",
    penjelasan: "Hubungan makna antar kanji 職 dan 員 menjadi 職員, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “orang yang bekerja sebagai staf atau pegawai dalam suatu organisasi.”",
    nodes: [
      { jokugo: "職", arti: "pekerjaan, jabatan" },
      { jokugo: "員", arti: "anggota, staf" }
    ]
  },
  {
    word: "職場",
    penjelasan: "Hubungan makna antar kanji 職 dan 場 menjadi 職場, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tempat berlangsungnya kegiatan pekerjaan.”",
    nodes: [
      { jokugo: "職", arti: "pekerjaan" },
      { jokugo: "場", arti: "tempat" }
    ]
  },

  // 3) MENCARI / MEMILIKI PEKERJAAN
  {
    word: "求職",
    penjelasan: "Hubungan makna antar kanji 求 dan 職 menjadi 求職, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan mencari pekerjaan.”",
    nodes: [
      { jokugo: "求", arti: "mencari, meminta" },
      { jokugo: "職", arti: "pekerjaan" }
    ]
  },
  {
    word: "有職",
    penjelasan: "Hubungan makna antar kanji 有 dan 職 menjadi 有職, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keadaan memiliki pekerjaan atau jabatan.”",
    nodes: [
      { jokugo: "有", arti: "ada, memiliki" },
      { jokugo: "職", arti: "pekerjaan, jabatan" }
    ]
  },

  // 4) PERUBAHAN / STATUS PEKERJAAN
  {
    word: "転職",
    penjelasan: "Hubungan makna antar kanji 転 dan 職 menjadi 転職, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “berpindah dari satu pekerjaan ke pekerjaan lain.”",
    nodes: [
      { jokugo: "転", arti: "berpindah, beralih" },
      { jokugo: "職", arti: "pekerjaan" }
    ]
  },
  {
    word: "退職",
    penjelasan: "Hubungan makna antar kanji 退 dan 職 menjadi 退職, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “berhenti dari pekerjaan atau jabatan.”",
    nodes: [
      { jokugo: "退", arti: "mundur, berhenti" },
      { jokugo: "職", arti: "pekerjaan" }
    ]
  },
  {
    word: "無職",
    penjelasan: "Hubungan makna antar kanji 無 dan 職 menjadi 無職, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keadaan tidak memiliki pekerjaan.”",
    nodes: [
      { jokugo: "無", arti: "tidak ada, tanpa" },
      { jokugo: "職", arti: "pekerjaan" }
    ]
  }
];

async function run() {
  const char = "職";
  const kanji = await prisma.kanji.findFirst({ where: { character: char } });
  if (!kanji) {
    console.error(`Kanji ${char} not found in DB`);
    return;
  }

  const validWords = new Set<string>();
  customGraphShoku.categories.forEach(cat => {
    cat.jukugos.forEach(jk => validWords.add(jk.word));
  });

  // 1. Clean obsolete Jukugo records for 職
  const existingJukugos = await prisma.jukugo.findMany({
    where: { kanjiId: kanji.id }
  });

  for (const j of existingJukugos) {
    if (!validWords.has(j.word)) {
      await prisma.kategoriKanji.deleteMany({ where: { jokugoId: j.id } });
      await prisma.semanticRelation.deleteMany({ where: { jukugoId: j.id } });
      await prisma.jukugo.delete({ where: { id: j.id } });
      console.log(`Deleted obsolete jukugo for 職: ${j.word}`);
    }
  }

  // 2. Delete existing KanjiGraphEdge for 職
  await prisma.kanjiGraphEdge.deleteMany({ where: { kanjiId: kanji.id } });

  // 3. Re-create KanjiGraphEdge
  const graphEdges: any[] = [];
  customGraphShoku.categories.forEach((cat, catIdx) => {
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

  for (const cat of customGraphShoku.categories) {
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

  // 6. Update SemanticRelation & SemanticRelationNode for kanji 職
  await prisma.semanticRelation.deleteMany({ where: { kanjiId: kanji.id } });

  for (const semItem of SHOKU_SEMANTIC_DATA) {
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

  // 7. Update Grouping Quiz for kanji 職
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
