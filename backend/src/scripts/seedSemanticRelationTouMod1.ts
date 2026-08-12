import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const TOU_MOD1_SEMANTIC_DATA = [
  // 1) Pertanyaan dan Jawaban
  {
    kanji: "回答",
    arti: "jawaban",
    penjelasan: 'Hubungan makna antar kanji 回 dan 答, menunjukan bahwa gabungan kedua kanji itu mengandung makna "jawaban yang diberikan terhadap suatu pertanyaan atau perminataan informasi" (kanji pedia, 2026).',
    nodes: [
      { jokugo: "回", arti: "mengembalikan" },
      { jokugo: "答", arti: "jawaban" }
    ]
  },
  {
    kanji: "解答",
    arti: "soal jawaban",
    penjelasan: 'Hubungan makna antar kanji 解 dan 答, menunjukan bahwa gabungan kedua kanji itu mengandung makna "jawaban yang digunakan untuk menyelesaikan soal atau permasalahan".',
    nodes: [
      { jokugo: "解", arti: "menyelesaikan" },
      { jokugo: "答", arti: "jawaban" }
    ]
  },
  {
    kanji: "応答",
    arti: "respons",
    penjelasan: 'Hubungan makna antar kanji 応dan 答, menunjukan bahwa gabungan kedua kanji itu mengandung makna"respons yang diberikan terhadap pertanyaan, panggilan, atau komunikasi"',
    nodes: [
      { jokugo: "応", arti: "menanggapi" },
      { jokugo: "答", arti: "jawaban" }
    ]
  },

  // 2) Pendidikan dan Evaluasi
  {
    kanji: "答案",
    arti: "lembar jawaban",
    penjelasan: 'Hubungan makna antar kanji 答 dan 案, menunjukan bahwa gabungan kedua kanji itu mengandung makna "lembar jawaban untuk menuliskan jawaban dalam ujian atau latihan"',
    nodes: [
      { jokugo: "答", arti: "jawaban" },
      { jokugo: "案", arti: "naskah" }
    ]
  },
  {
    kanji: "正答",
    arti: "jawaban benar",
    penjelasan: 'Hubungan makna antar kanji 正 dan 答 menjadi 正答, menunjukan bahwa gabungan kedua kanji itu mengandung makna "jawaban yang tepat dan benar sesuai kunci jawaban".',
    nodes: [
      { jokugo: "正", arti: "benar" },
      { jokugo: "答", arti: "jawaban" }
    ]
  },
  {
    kanji: "解答用紙",
    arti: "kertas jawaban",
    penjelasan: 'Hubungan makna antar kanji 解答 dan用紙 menjadi 解答用紙, menunjukan bahwa gabungan kedua kanji itu mengandung makna "sebuah lembaran resmi yang digunakan untuk menuliskan jawaban peserta ujian"',
    nodes: [
      { jokugo: "解答", arti: "jawaban" },
      { jokugo: "用紙", arti: "lembar kertas" }
    ]
  },

  // 3) Komunikasi dan Diskusi
  {
    kanji: "返答",
    arti: "balasan",
    penjelasan: 'Hubungan makna antar kanji 返 dan 答 mejadi 返答, menunjukan bahwa gabungan kedua kanji itu mengandung makna "jawaban atau balasan terhadap pertanyaan, suray, maupun pesan"',
    nodes: [
      { jokugo: "返", arti: "mengembalikan" },
      { jokugo: "答", arti: "jawaban" }
    ]
  },
  {
    kanji: "口答",
    arti: "jawaban lisan",
    penjelasan: 'Hubungan makna antar kanji 口 dan 答 menjadi口答, menunjukan bahwa gabungan kedua kanji itu mengandung makna "jawaban yang disampaikan secara lisan"',
    nodes: [
      { jokugo: "口", arti: "mulut" },
      { jokugo: "答", arti: "jawaban" }
    ]
  },
  {
    kanji: "答弁",
    arti: "penjelasan resmi",
    penjelasan: 'Hubungan makna antar kanji 答 dan 弁 menjadi 答弁, menunjukan bahwa gabungan kedua kanji itu mengandung makna "jawaban resmi yang diberikan dalam rapat,siding atau pun forum"',
    nodes: [
      { jokugo: "答", arti: "menjawab" },
      { jokugo: "弁", arti: "penjelasan" }
    ]
  },

  // 4) Akademik dan Penelitian
  {
    kanji: "問答",
    arti: "tanya jawab",
    penjelasan: 'Hubungan makna antar kanji 問 dan 答 menjadi問答, menunjukan bahwa gabungan kedua kanji itu mengandung makna "suatu kegiatan tanya jawab sebagai proses pembelajaran".',
    nodes: [
      { jokugo: "問", arti: "bertanya" },
      { jokugo: "答", arti: "menjawab" }
    ]
  },
  {
    kanji: "一問一答",
    arti: "satu pertanyaan satu jawaban",
    penjelasan: 'Hubungan makna antar kanji 一、問、一、dan答 menjadi 一問一答, menunjukan bahwa gabungan kedua kanji itu mengandung makna "metode belajar yang menyajikan satu pertanyaan untuk satu jawaban".',
    nodes: [
      { jokugo: "一", arti: "satu" },
      { jokugo: "問", arti: "pertanyaan" },
      { jokugo: "一", arti: "satu" },
      { jokugo: "答", arti: "jawaban" }
    ]
  },
  {
    kanji: "答申",
    arti: "rekomnedasi resmi",
    penjelasan: 'Hubungan makna antar kanji 答 dan 申 menjadi 答申, menunjukan bahwa gabungan kedua kanji itu mengandung makna "jawaban resmi yang disampaikan kepada pihak yang meminta pertimbangan"',
    nodes: [
      { jokugo: "答", arti: "menjawab" },
      { jokugo: "申", arti: "menyampaikan" }
    ]
  },

  // 5) Teknologi dan Layanan
  {
    kanji: "自動応答",
    arti: "jawaban otomatis",
    penjelasan: 'Hubungan makna antar kanji 自動 dan 応答 menjadi 自動応答, menunjukan bahwa gabungan kedua kanji itu mengandung makna "jawaban yang diberikan secara otomatis oleh sistem komputer atau perangkat"',
    nodes: [
      { jokugo: "自動", arti: "otomatis" },
      { jokugo: "応答", arti: "respons" }
    ]
  },
  {
    kanji: "応答時間",
    arti: "waktu respons",
    penjelasan: 'Hubungan makna antar kanji 応答 dan 時間 menjadi応答時間, menunjukan bahwa gabungan kedua kanji itu mengandung makna "lamanya waktu yang diperlukan seseorang atau sistem untuk memberikan jawaban".',
    nodes: [
      { jokugo: "応答", arti: "respons" },
      { jokugo: "時間", arti: "waktu" }
    ]
  },
  {
    kanji: "応答率",
    arti: "tingkat respons",
    penjelasan: 'Hubungan makna antar kanji 応答 dan 率 menjadi応答率, menunjukan bahwa gabungan kedua kanji itu mengandung makna "presentase jumalah respons yang diterima dibanding jumlah pertanyaan"',
    nodes: [
      { jokugo: "応答", arti: "respons" },
      { jokugo: "率", arti: "tingkat" }
    ]
  }
];

export async function seedSemanticRelationTouMod1() {
  const kanji = await prisma.kanji.findFirst({ where: { character: "答" } });
  if (!kanji) {
    console.error("Kanji 答 not found");
    return;
  }

  await prisma.semanticRelation.deleteMany({ where: { kanjiId: kanji.id } });

  for (const item of TOU_MOD1_SEMANTIC_DATA) {
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
  console.log(`✅ Seeded ${TOU_MOD1_SEMANTIC_DATA.length} SemanticRelation records for Kanji 答.`);
}
