import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const TO_MOD1_SEMANTIC_DATA = [
  // 1) Pertanyaan dan ujian
  {
    kanji: "問題",
    arti: "soal/masalah",
    penjelasan: 'Hubungan makna antar kanji 問 dan 題 menjadi 問題, menunjukan bahwa gabungan kedua kanji itu mengandung makna "sebagai persoalan yang harus diselesaikan".',
    nodes: [
      { jokugo: "問", arti: "bertanya" },
      { jokugo: "題", arti: "persoalan" }
    ]
  },
  {
    kanji: "質問",
    arti: "pertanyaan",
    penjelasan: 'Hubungan makna antar kanji 質dan 問 menjadi 質問, menunjukan bahwa gabungan kedua kanji itu mengandung "pertanyaan yang dikemukakan agar memperoleh suatu informasi"',
    nodes: [
      { jokugo: "質", arti: "kualitas/inti" },
      { jokugo: "問", arti: "bertanya" }
    ]
  },
  {
    kanji: "問答",
    arti: "tanya jawab",
    penjelasan: 'Hubungan makna antar kanji 問dan 答 ketika digabungkan menjadi 問答, menunjukan bahwa gabungan kedua kanji itu mengandung makna " suatu kegiatan saling bertanya jawab antara pembicara dan lawan bicara".',
    nodes: [
      { jokugo: "問", arti: "bertanya" },
      { jokugo: "答", arti: "menjawab" }
    ]
  },

  // 2) Investigasi dan Penyelidikan
  {
    kanji: "問診",
    arti: "wawasan medis",
    penjelasan: 'Hubungan makna antar kanji 問 dan 診 ketika digabung menjadi 問診, menunjukan bahwa gabungan kanji tersebut mengandung makna "pemerikasaan pasein melalaui serangkaian pertanyaan".',
    nodes: [
      { jokugo: "問", arti: "bertanya" },
      { jokugo: "診", arti: "memeriksa" }
    ]
  },
  {
    kanji: "尋問",
    arti: "introgasi",
    penjelasan: 'Hubungan makna antar kanji 尋 dan問 ketika digabung menjadi 尋問, menunjukan bahwa gabungan kanji tersebut mengandung makna "proses pengajuan pertanyaan secara mendalam untuk memperoleh suatu keterangan informasi".',
    nodes: [
      { jokugo: "尋", arti: "menyelidiki" },
      { jokugo: "問", arti: "bertanya" }
    ]
  },
  {
    kanji: "訪問調査",
    arti: "survei lapangan",
    penjelasan: 'Hubungan makna antar kanji 訪問 dan 調査, ketika digabung menjadi dua kosakata yaitu 訪問調査, menunjukan bahwa gabungan kedua kosakata kanji tersebut mengandung makna "pengumpulan data yang dilakukan melalui kunjungan langsung".',
    nodes: [
      { jokugo: "訪問", arti: "mengunjungi" },
      { jokugo: "調査", arti: "penyelidikan" }
    ]
  },

  // 3) Permasalahan sosial
  {
    kanji: "問題点",
    arti: "titik masalah",
    penjelasan: 'Hubungan makna antar kanji 問題 dan点, ketika digabungkan menjadi 問題点, menunjukan bahwa gabungan kedua kanji tersebut mengandung makna "bagian yang menjadi fokus masalah."',
    nodes: [
      { jokugo: "問題", arti: "masalah" },
      { jokugo: "点", arti: "titik atau poin" }
    ]
  },
  {
    kanji: "社会問題",
    arti: "masalah sosial",
    penjelasan: 'Hubungan makna antar kanji 社会 dan 問題, ketika digabungkan menjadi 社会問題, menunjukan bahwa gabungan dua kosakata kanji tersebut, mengandung makna "masalah yang dihadapi dalam kehidupan masyarat".',
    nodes: [
      { jokugo: "社会", arti: "masyarakat" },
      { jokugo: "問題", arti: "masalah" }
    ]
  },
  {
    kanji: "環境問題",
    arti: "masalah lingkungan",
    penjelasan: 'Hubungan makna antar kanji 環境 dan 問題 , ketika digabungkan menjadi 環境問題, menunjukan bahwa gabungan kanji tersebut mengandung makna "suatu persoalan yang berhubungan dengan lingkungan hidup".',
    nodes: [
      { jokugo: "環境", arti: "lingkungan" },
      { jokugo: "問題", arti: "masalah" }
    ]
  },

  // 4) Pendidikan dan Evaluasi
  {
    kanji: "設問",
    arti: "butir pertanyaan",
    penjelasan: 'Hubungan makna antar kanji 設 dan 問, ketika digabungan menjadi 設問, menunjukan bahwa gabungan kanji tersebut mengandung makna "pertanyaan yang disusun dalam test atau angket".',
    nodes: [
      { jokugo: "設", arti: "menyusun" },
      { jokugo: "問", arti: "pertanyaan" }
    ]
  },
  {
    kanji: "問題集",
    arti: "kumpulan soal",
    penjelasan: 'Hubungan makna antar kanji 問題 dan集, ketika digabungkan menjadi 問題集, menunjukan bahwa gabungan kanji tersebut mengandung makna "buku yang berisi kumpulan berbagai latihan soal".',
    nodes: [
      { jokugo: "問題", arti: "soal" },
      { jokugo: "集", arti: "kumpulan" }
    ]
  },
  {
    kanji: "問一",
    arti: "soal nomor satu",
    penjelasan: 'Hubungan makna antar kanji 問 dan一, ketika digabung menjadi 問一、menunjukan bahwa gabungan kanji tersebut mengandung makna nomor "pertama dalam suatu latihan atau ujian".',
    nodes: [
      { jokugo: "問", arti: "soal" },
      { jokugo: "一", arti: "satu" }
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
