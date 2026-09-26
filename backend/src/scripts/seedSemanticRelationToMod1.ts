import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const TO_MOD1_SEMANTIC_DATA = [
  // 1) 1. BERTANYA / MENGAJUKAN PERTANYAAN
  {
    kanji: "質問",
    arti: "pertanyaan",
    penjelasan: "Hubungan makna antar kanji 質 dan 問 menjadi 質問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pertanyaan yang diajukan untuk memperoleh informasi atau penjelasan mengenai sesuatu.”",
    nodes: [
      { jokugo: "質", arti: "menanyakan, mencari kepastian" },
      { jokugo: "問", arti: "bertanya, menanyakan" }
    ]
  },
  {
    kanji: "自問",
    arti: "bertanya pada diri sendiri",
    penjelasan: "Hubungan makna antar kanji 自 dan 問 menjadi 自問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bertanya atau mempertanyakan sesuatu kepada diri sendiri.”",
    nodes: [
      { jokugo: "自", arti: "diri sendiri" },
      { jokugo: "問", arti: "bertanya, menanyakan" }
    ]
  },
  {
    kanji: "発問",
    arti: "mengajukan pertanyaan",
    penjelasan: "Hubungan makna antar kanji 発 dan 問 menjadi 発問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengemukakan atau mengajukan suatu pertanyaan kepada orang lain.”",
    nodes: [
      { jokugo: "発", arti: "mengeluarkan, mengemukakan" },
      { jokugo: "問", arti: "bertanya, pertanyaan" }
    ]
  },
  {
    kanji: "反問",
    arti: "pertanyaan balik",
    penjelasan: "Hubungan makna antar kanji 反 dan 問 menjadi 反問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengajukan pertanyaan kembali sebagai tanggapan terhadap pertanyaan yang diterima.”",
    nodes: [
      { jokugo: "反", arti: "berbalik, kembali" },
      { jokugo: "問", arti: "bertanya, pertanyaan" }
    ]
  },

  // 2) 2. TANYA JAWAB
  {
    kanji: "問答",
    arti: "tanya jawab",
    penjelasan: "Hubungan makna antar kanji 問 dan 答 menjadi 問答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan saling bertanya dan menjawab mengenai suatu hal.”",
    nodes: [
      { jokugo: "問", arti: "bertanya, pertanyaan" },
      { jokugo: "答", arti: "menjawab, jawaban" }
    ]
  },

  // 3) 3. SOAL / PERTANYAAN
  {
    kanji: "問題",
    arti: "masalah",
    penjelasan: "Hubungan makna antar kanji 問 dan 題 menjadi 問題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “suatu hal yang menjadi persoalan atau masalah yang perlu dipikirkan dan diselesaikan.”",
    nodes: [
      { jokugo: "問", arti: "pertanyaan, masalah" },
      { jokugo: "題", arti: "topik, pokok persoalan" }
    ]
  },
  {
    kanji: "設問",
    arti: "pertanyaan",
    penjelasan: "Hubungan makna antar kanji 設 dan 問 menjadi 設問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pertanyaan atau soal yang disusun dan diberikan untuk dijawab.”",
    nodes: [
      { jokugo: "設", arti: "menyusun, menetapkan" },
      { jokugo: "問", arti: "pertanyaan, soal" }
    ]
  },
  {
    kanji: "試問",
    arti: "ujian lisan",
    penjelasan: "Hubungan makna antar kanji 試 dan 問 menjadi 試問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengujian yang dilakukan dengan memberikan pertanyaan kepada seseorang”, sehingga mengandung makna ujian lisan.",
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "問", arti: "bertanya, pertanyaan" }
    ]
  },
  {
    kanji: "難問",
    arti: "pertanyaan sulit",
    penjelasan: "Hubungan makna antar kanji 難 dan 問 menjadi 難問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pertanyaan atau soal yang sulit untuk dijawab atau diselesaikan.”",
    nodes: [
      { jokugo: "難", arti: "sulit, kesulitan" },
      { jokugo: "問", arti: "pertanyaan, soal" }
    ]
  },

  // 4) 4. PEMERIKSAAN DENGAN PERTANYAAN
  {
    kanji: "問診",
    arti: "wawancara medis",
    penjelasan: "Hubungan makna antar kanji 問 dan 診 menjadi 問診, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menanyakan kondisi atau gejala seseorang untuk keperluan pemeriksaan dan diagnosis medis.”",
    nodes: [
      { jokugo: "問", arti: "bertanya, menanyakan" },
      { jokugo: "診", arti: "memeriksa, mendiagnosis" }
    ]
  },
  {
    kanji: "検問",
    arti: "pemeriksaan",
    penjelasan: "Hubungan makna antar kanji 検 dan 問 menjadi 検問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “melakukan pemeriksaan atau pengecekan terhadap seseorang atau sesuatu, termasuk dengan menanyakan keterangan.”",
    nodes: [
      { jokugo: "検", arti: "memeriksa, mengecek" },
      { jokugo: "問", arti: "bertanya, menanyakan" }
    ]
  },

  // 5) 5. MEMPERTANYAKAN / MEMINTA PERTANGGUNGJAWABAN
  {
    kanji: "問責",
    arti: "meminta pertanggungjawaban",
    penjelasan: "Hubungan makna antar kanji 問 dan 責 menjadi 問責, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mempertanyakan dan meminta seseorang bertanggung jawab atas suatu tindakan atau keadaan.”",
    nodes: [
      { jokugo: "問", arti: "mempertanyakan, meminta penjelasan" },
      { jokugo: "責", arti: "tanggung jawab, kewajiban" }
    ]
  },
  {
    kanji: "不問",
    arti: "tidak dipermasalahkan",
    penjelasan: "Hubungan makna antar kanji 不 dan 問 menjadi 不問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tidak mempertanyakan atau tidak mempermasalahkan suatu hal.”",
    nodes: [
      { jokugo: "不", arti: "tidak" },
      { jokugo: "問", arti: "mempertanyakan, mempermasalahkan" }
    ]
  },

  // 6) 6. MENGUNJUNGI (MAKNA PERLUASAN)
  {
    kanji: "訪問",
    arti: "kunjungan",
    penjelasan: "Hubungan makna antar kanji 訪 dan 問 menjadi 訪問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tindakan mendatangi atau mengunjungi seseorang maupun suatu tempat.”",
    nodes: [
      { jokugo: "訪", arti: "mengunjungi, mendatangi" },
      { jokugo: "問", arti: "mengunjungi, menengok" }
    ]
  }
];

export async function seedSemanticRelationToMod1() {
  const kanji = await prisma.kanji.findFirst({ where: { character: "問" } });
  if (!kanji) {
    console.error("Kanji 問 not found");
    return;
  }

  await prisma.semanticRelation.deleteMany({ where: { kanjiId: kanji.id } });

  for (const item of TO_MOD1_SEMANTIC_DATA) {
    const matchedJukugo = await prisma.jukugo.findFirst({
      where: { kanjiId: kanji.id, word: item.kanji }
    });

    const createdSem = await prisma.semanticRelation.create({
      data: {
        kanjiId: kanji.id,
        jukugoId: matchedJukugo?.id || null,
        penjelasan: item.penjelasan,
      }
    });

    if (item.nodes && item.nodes.length > 0) {
      await prisma.semanticRelationNode.createMany({
        data: item.nodes.map(n => ({
          semanticId: createdSem.id,
          jokugo: n.jokugo,
          arti: n.arti
        }))
      });
    }
  }
  console.log(`✅ Seeded ${TO_MOD1_SEMANTIC_DATA.length} SemanticRelation records for Kanji 問.`);
}
