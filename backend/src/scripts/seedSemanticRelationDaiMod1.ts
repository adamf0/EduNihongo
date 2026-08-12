import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const DAI_MOD1_SEMANTIC_DATA = [
  // 1) Pendidikan dan Evaluasi
  {
    kanji: "問題",
    arti: "Soal/masalah",
    penjelasan: 'Hubungan makna antar kanji 問 dan 題 ketika digabungkan menjadi 問題、menunjukan bahwa gabungan kanji tersebut mengandung makna suatu persoalan atau "masalah yang harus diselesaikan".',
    nodes: [
      { jokugo: "問", arti: "bertanya" },
      { jokugo: "題", arti: "topik atau persoalan" }
    ]
  },
  {
    kanji: "課題",
    arti: "Tugas",
    penjelasan: 'Hubungan makna antara kanji 課 dan 題、ketika digabung menjadi 課題, menunjukan bahwa gabungan kanji tersebut mengandung makna "tugas yang diberikan untuk dikerjakan".',
    nodes: [
      { jokugo: "課", arti: "Pelajaran/mata kuliah" },
      { jokugo: "題", arti: "Topik" }
    ]
  },
  {
    kanji: "宿題",
    arti: "pekerjaan rumah",
    penjelasan: 'Hubungan makna antar kanji 宿 dan 題 apabila digabungkan menjadi 宿題、 menunjukan bahwa gabungan kanji tersebut mengandung makna "sesuatu tugas yang dikerjakan di rumah".',
    nodes: [
      { jokugo: "宿", arti: "tempat tinggal/rumah" },
      { jokugo: "題", arti: "tugas" }
    ]
  },

  // 2) Judul dan Tema
  {
    kanji: "題名",
    arti: "judul",
    penjelasan: 'Hubungan makna antar kanji 題dan 名, ketika digabungkan menjadi 題名、menunjukan bahwa gabungan kanji tersebut mengandung makna menunjukan makna atau arti nama sebuah tulisan atau karya.',
    nodes: [
      { jokugo: "題", arti: "judul" },
      { jokugo: "名", arti: "nama" }
    ]
  },
  {
    kanji: "表題",
    arti: "judul utama",
    penjelasan: 'Hubungan makna antar kanji 表 dan題, ketika digabungkan menjadi 表題、menunjukan bahwa gabungan kanji tersebut mengandung makna "judul yang muncul pada bagian dokumen".',
    nodes: [
      { jokugo: "表", arti: "bagian depan" },
      { jokugo: "題", arti: "judul" }
    ]
  },
  {
    kanji: "主題",
    arti: "tema utama",
    penjelasan: 'Hubungan makna antar kanji 主 dan 題, ketika digabungkan menjadi kanji 主題、 menunjukan bahwa gabungan kanji tersebut mengandung makna "pokok pembahasan utama".',
    nodes: [
      { jokugo: "主", arti: "utama" },
      { jokugo: "題", arti: "tema" }
    ]
  },

  // 3) Akademik dan Penelitian
  {
    kanji: "研究課題",
    arti: "topik penelitian",
    penjelasan: 'Hubungan makna antar kanji 研究 dan課題, ketika digabungkan menjadi 研究課題、 menunjukan bahwa gabungan kanji tersebut mengandung makna "suatu masalah yang menjadi fokus penelitian".',
    nodes: [
      { jokugo: "研究", arti: "penelitian" },
      { jokugo: "課題", arti: "tugas" }
    ]
  },
  {
    kanji: "論題",
    arti: "tema kajian",
    penjelasan: 'Hubungan makna antar kanji 論dan題, ketika digabungkan menjadi kanji論題、menunjukan bahwa gabungan kanji tersebut mengandung makna "topik yang dibahas secara akademik".',
    nodes: [
      { jokugo: "論", arti: "argumen/diskusi" },
      { jokugo: "題", arti: "tema" }
    ]
  },
  {
    kanji: "出題",
    arti: "pembuatan soal",
    penjelasan: 'Hubungan makna antar kanji 出dan題, ketika digabungkan menjadi kanji出題、menunjukan bahwa gabungan kanji tersebut mengandung makna "kegiatan membuat atau mengeluarkan soal".',
    nodes: [
      { jokugo: "出", arti: "mengeluarkan" },
      { jokugo: "題", arti: "soal" }
    ]
  },

  // 4) Diskusi dan Pemikiran
  {
    kanji: "話題",
    arti: "topik pembicaraan",
    penjelasan: 'Hubungan makna antar kanji 話 dan 題, menunjukan bahwa gabungan kedua kanji itu mengandung makna" sesuatu hal yang sedang dibicarakan".',
    nodes: [
      { jokugo: "話", arti: "berbicara" },
      { jokugo: "題", arti: "topik" }
    ]
  },
  {
    kanji: "時事問題",
    arti: "isu aktual",
    penjelasan: 'Hubungan makna antar kanji 時事 dan 問題 saat digabungkan 時事問題、menunjukan bahwa gabungan kanji tersebut mengandung makna "persoalan yang sedang hangat dibicarakan di ｍasyarakat".',
    nodes: [
      { jokugo: "時事", arti: "peristiwa terkini" },
      { jokugo: "問題", arti: "masalah" }
    ]
  },
  {
    kanji: "問題意識",
    arti: "kesadaran masalah",
    penjelasan: 'Hubungan makna antar kanji 問題 dan 意識 saat digabungkan menjadi 問題意識、menunjukan bahwa gabungan kanji tersebut mengandung makna "suatu kemampuan adanya persoalan yang perlu diselesaikan".',
    nodes: [
      { jokugo: "問題", arti: "masalah" },
      { jokugo: "意識", arti: "kesadaran" }
    ]
  },

  // 5) Media dan Publikasi
  {
    kanji: "題材",
    arti: "bahan cerita",
    penjelasan: 'Hubungan makna antar kanji 題 dan材, saat digabungakan menjadi kanji 題材、menunjukan bahwa gabungan kanji tersebut mengandung makna"bahan atau tema yang digunakan untuk membuat sebuah karya" (kotobank digital jiten)',
    nodes: [
      { jokugo: "題", arti: "tema" },
      { jokugo: "材", arti: "bahan" }
    ]
  },
  {
    kanji: "題字",
    arti: "tulisan judul",
    penjelasan: 'Hubungan makna antar kanji 題 dan字 ketika digabung menjadi 題字、menunjukan bahwa gabungan kanji tersebut mengandung makna "tulisan yang digunakan sebagai judul".',
    nodes: [
      { jokugo: "題", arti: "judul" },
      { jokugo: "字", arti: "huruf/lisan" }
    ]
  },
  {
    kanji: "演題",
    arti: "judul presentasi",
    penjelasan: 'Hubungan makna antar kanji dari kanji 演 dan題, ketika digabung menjadi 演題、menunjukan bahwa gabungan kanji tersebut mengandung makna "judul sebuah presentasi, seminar, atau pidato."',
    nodes: [
      { jokugo: "演", arti: "presentasi / pertunjukan" },
      { jokugo: "題", arti: "judul" }
    ]
  }
];

export async function seedSemanticRelationDaiMod1() {
  const kanji = await prisma.kanji.findFirst({ where: { character: "題" } });
  if (!kanji) {
    console.error("Kanji 題 not found");
    return;
  }

  await prisma.semanticRelation.deleteMany({ where: { kanjiId: kanji.id } });

  for (const item of DAI_MOD1_SEMANTIC_DATA) {
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
  console.log(`✅ Seeded ${DAI_MOD1_SEMANTIC_DATA.length} SemanticRelation records for Kanji 題.`);
}
