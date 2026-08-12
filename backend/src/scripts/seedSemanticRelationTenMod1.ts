import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const TEN_MOD1_SEMANTIC_DATA = [
  // 1) Penilaian dan Nilai
  {
    kanji: "採点",
    arti: "penilaian",
    penjelasan: 'Hubungan makna antar kanji 採 dan 点, saat digabungkan menjadi 採点, menunjukan bahwa gabungan kedua kanji itu mengandung makna “ kegiatan memberikan nilai terhadap hasil pekerjaan”',
    nodes: [
      { jokugo: "採", arti: "memberi/mengambil" },
      { jokugo: "点", arti: "nilai" }
    ]
  },
  {
    kanji: "得点",
    arti: "skor",
    penjelasan: 'Hubungan makna antar kanji 得 dan点 saat digabung menjadi 得点, menunjukan bahwa gabungan kedua kanji itu mengandung makna “jumlah nilai yang diperoleh seseorang”.',
    nodes: [
      { jokugo: "得", arti: "memperoleh" },
      { jokugo: "点", arti: "poin" }
    ]
  },
  {
    kanji: "減点",
    arti: "pengurangan nilai",
    penjelasan: 'Hubungan makna antar kanji減 dan 点 , mumjukan gabungan kanji ini saat digabung menjadi 減点, menunjukan bahwa gabungan kedua kanji itu mengandung makna "nilai yang dikurangi "',
    nodes: [
      { jokugo: "減", arti: "mengurangi" },
      { jokugo: "点", arti: "nilai" }
    ]
  },

  // 2) Titik dan Lokasi
  {
    kanji: "地点",
    arti: "lokasi",
    penjelasan: 'Hubungan makna antar kanji 地dan 点、menjadi 地点 , menunjukan bahwa gabungan kedua kanji itu mengandung makna "titik tertentu pada suatu lokasi"',
    nodes: [
      { jokugo: "地", arti: "tempat" },
      { jokugo: "点", arti: "titik" }
    ]
  },
  {
    kanji: "起点",
    arti: "titik awal",
    penjelasan: 'Hubungan makna antar kanji 起 dan 点 , menunjukan bahwa gabungan dua kanji tersebut mengandung makna "tempat dimulainya suatu perjalanan atau aktivitas" .',
    nodes: [
      { jokugo: "起", arti: "mulai" },
      { jokugo: "点", arti: "awal" }
    ]
  },
  {
    kanji: "終点",
    arti: "titik akhir",
    penjelasan: 'Hubungan makna antar kanji 終 dan 点 , menunjukan bahwa gabungan dua kanji tersebut mengandung makna “tempat berakhirnya suatu perjalanan”.',
    nodes: [
      { jokugo: "終", arti: "selesai" },
      { jokugo: "点", arti: "tempat" }
    ]
  },

  // 3) Pandangan dan Aspek
  {
    kanji: "観点",
    arti: "sudut pandang",
    penjelasan: 'Hubungan makna antar kanji 観 dan 点 menjadi 観点、menunjukan gabungaan dua kanji tersebut mengandung makna "cara melihat/memandang suatu persoalan "',
    nodes: [
      { jokugo: "観", arti: "melihat" },
      { jokugo: "点", arti: "titik" }
    ]
  },
  {
    kanji: "視点",
    arti: "persepketif",
    penjelasan: 'Hubungan makna antar kanji 視 dan 点 menjadi 視点, menunjukan bahwa gabungan dua kanji tersebut mengandung makna "posisi atau sudut pandang dalam memahami suatu masalah".',
    nodes: [
      { jokugo: "視", arti: "melihat" },
      { jokugo: "点", arti: "titik" }
    ]
  },
  {
    kanji: "論点",
    arti: "pokok bahasan",
    penjelasan: 'Hubungan makna antar kanji 論 dan 点 menjadi 論点, menunjukan bahwa gabungan dua kanji tersebut mengandung makna "masalah utama yang menjadi inti pembahasaan".',
    nodes: [
      { jokugo: "論", arti: "pembahasan" },
      { jokugo: "点", arti: "pokok" }
    ]
  },

  // 4) Fokus dan Permasalahan
  {
    kanji: "問題点",
    arti: "titik masalah",
    penjelasan: 'Hubungan makna antar kanji 問題 dan 点 menjadi 問題点, menunjukan bahwa gabungan kedua kanji tersebut mengandung makna "bagian yang menjadi sumber masalah".',
    nodes: [
      { jokugo: "問題", arti: "masalah" },
      { jokugo: "点", arti: "titik" }
    ]
  },
  {
    kanji: "重点",
    arti: "fokus utama",
    penjelasan: 'Hubungan makna antar kanji 重 dan 点 menjadi 重点, menunjukan bahwa gabungan kedua kanji tersebut mengandung makna "bagian yang terpenting untuk diperhatikan"',
    nodes: [
      { jokugo: "重", arti: "penting" },
      { jokugo: "点", arti: "titik" }
    ]
  },
  {
    kanji: "要点",
    arti: "poin penting",
    penjelasan: 'Hubungan makna antar kanji 要 dan 点 menjadi 要点, menunjukan bahwa gabungan kedua kanji tersebut mengandung makna "poko dari suatu penjelasan"',
    nodes: [
      { jokugo: "要", arti: "inti" },
      { jokugo: "点", arti: "poin" }
    ]
  },

  // 5) Pemeriksaan dan Data
  {
    kanji: "点検",
    arti: "pemeriksaan",
    penjelasan: 'Hubungan makna antar kanji 点 dan 検 menjadi 点検, menunjukan bahwa gabungan kedua kanji tersebut mengandung makna "keadaan memeriksa kondisi suatu benda atau sistem".',
    nodes: [
      { jokugo: "点", arti: "memeriksa" },
      { jokugo: "検", arti: "inspeksi" }
    ]
  },
  {
    kanji: "点灯",
    arti: "penerangan",
    penjelasan: 'Hubungan makna antar kanji点 dan 灯 menjadi 点灯、, menunjukan bahwa gabungan kedua kanji tersebut mengandung makna "menghidupkan lampu aatau penerangan".',
    nodes: [
      { jokugo: "点", arti: "menyalakan" },
      { jokugo: "灯", arti: "lampu" }
    ]
  },
  {
    kanji: "点数",
    arti: "nilai",
    penjelasan: 'Hubungan makna antar kanji点 dan数 menjadi 点数、 menunjukan bahwa gabungan kedua kanji tersebut mengandung makna "jumlah nilai yang diperoleh dalam suatu penilaian"',
    nodes: [
      { jokugo: "点", arti: "poin" },
      { jokugo: "数", arti: "jumlah" }
    ]
  }
];

export async function seedSemanticRelationTenMod1() {
  const kanji = await prisma.kanji.findFirst({ where: { character: "点" } });
  if (!kanji) {
    console.error("Kanji 点 not found");
    return;
  }

  await prisma.semanticRelation.deleteMany({ where: { kanjiId: kanji.id } });

  for (const item of TEN_MOD1_SEMANTIC_DATA) {
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
  console.log(`✅ Seeded ${TEN_MOD1_SEMANTIC_DATA.length} SemanticRelation records for Kanji 点.`);
}
