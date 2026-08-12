import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const KEN_MOD1_SEMANTIC_DATA = [
  // 1) Pengujian
  {
    kanji: "試験",
    arti: "Ujian",
    penjelasan: 'Hubungan makna antar kanji 試 dan 験, menunjukan bahwa gabungan kedua kanji itu mengandung makna "menguji kemampuan untuk membuktikan penguasan seseorang".',
    nodes: [
      { jokugo: "試", arti: "Menguji" },
      { jokugo: "験", arti: "Membuktikan hasil" }
    ]
  },
  {
    kanji: "受験",
    arti: "Mengikuti ujian",
    penjelasan: 'Hubungan makna antar kanji 受 dan 験, menunjukan bahwa gabungan kedua kanji itu mengandung makna "seseorang mengikuti proses ujian".',
    nodes: [
      { jokugo: "受", arti: "Menerima" },
      { jokugo: "験", arti: "Ujian/verifikasi" }
    ]
  },
  {
    kanji: "資格試験",
    arti: "ujian sertifikasi",
    penjelasan: 'Hubungan makna dari kanji 資格, menunjukan bahwa gabungan kedua kanji itu mengandung makna "ujian fungsinya untuk membuktikan kompetesnsi tertentu."',
    nodes: [
      { jokugo: "資格", arti: "kualifikasi" },
      { jokugo: "試験", arti: "ujian" }
    ]
  },

  // 2) Pengalaman
  {
    kanji: "経験",
    arti: "pengalaman",
    penjelasan: 'Hubungan makna antar kanji 経 dan 験, menunjukan bahwa gabungan kedua kanji itu mengandung makna" sesuatu yang telah dialami secara langsung".',
    nodes: [
      { jokugo: "経", arti: "Melewati" },
      { jokugo: "験", arti: "Mengalami" }
    ]
  },
  {
    kanji: "体験",
    arti: "pengalaman langsung",
    penjelasan: 'Hubungan makna antar 体 dan 験 , menunjukan bahwa gabungan kedua kanji itu mengandung makna "pengalaman yang dirasakan sendiri secara nyata".',
    nodes: [
      { jokugo: "体", arti: "badan" },
      { jokugo: "験", arti: "mengalami" }
    ]
  },
  {
    kanji: "経験者",
    arti: "orang yang berepangalam",
    penjelasan: 'Hubungan makna antar kanji体 dan 験, menunjukan bahwa gabungan kedua kanji itu mengandung makna " orang yang telah memiliki pengalaman."',
    nodes: [
      { jokugo: "経験", arti: "Pengalaman" },
      { jokugo: "者", arti: "Orang" }
    ]
  },

  // 3) Penelitian
  {
    kanji: "実験",
    arti: "eksperimen",
    penjelasan: 'Hubungan makna dari kanji 実 dan 験, menunjukan bahwa gabungan kedua kanji itu mengandung makna "pembuktian suatu teori melalui percobaan".',
    nodes: [
      { jokugo: "実", arti: "nyata" },
      { jokugo: "験", arti: "pembuktian" }
    ]
  },
  {
    kanji: "実験室",
    arti: "laboratorium",
    penjelasan: 'Hubungan makna antar kanji 実験 dan 室, menunjukan bahwa gabungan kedua kanji itu mengandung makna "tempat melakukan eksperimen"',
    nodes: [
      { jokugo: "実験", arti: "percobaan" },
      { jokugo: "室", arti: "ruangan" }
    ]
  },
  {
    kanji: "被験者",
    arti: "subjek penelitian",
    penjelasan: 'Hubungan makna antar kanji dari 被, 験 dan 者, menunjukan bahwa gabungan ketiga kanji itu mengandung makna "orang yang menjadi objek eksperimen atau penelitian".',
    nodes: [
      { jokugo: "被", arti: "yang dikenai" },
      { jokugo: "験", arti: "menguji" },
      { jokugo: "者", arti: "orang" }
    ]
  },

  // 4) Sertifikasi
  {
    kanji: "受験生",
    arti: "peserta ujian",
    penjelasan: 'Hubungan makna antar kanji 受験 dan 生, menunjukan bahwa gabungan kedua kanji itu mengandung makna "seseorang sedang mengikuti ujian".',
    nodes: [
      { jokugo: "受験", arti: "mengikuti ujian" },
      { jokugo: "生", arti: "siswa/pelajar" }
    ]
  },
  {
    kanji: "検定試験",
    arti: "ujian sertifikasi",
    penjelasan: 'Hubungan makna dari kanji検 dan 定, menunjukan bahwa gabungan kedua kanji itu mengandung makna" proses pemeriksaan untuk menetapkan kemampuan seseorang".',
    nodes: [
      { jokugo: "検定", arti: "pemeriksaan standar" },
      { jokugo: "試験", arti: "ujian" }
    ]
  },
  {
    kanji: "試験",
    arti: "ujian",
    penjelasan: 'Hubungan makna dari kanji試 dan験, menunjukan bahwa gabungan kedua kanji itu mengandung makna "menguji kemampuan seseorang".',
    nodes: [
      { jokugo: "試", arti: "menguji" },
      { jokugo: "験", arti: "ujian" }
    ]
  },
  {
    kanji: "受験番号",
    arti: "nomor peserta ujian",
    penjelasan: 'Hubungan makna antar kanji 受験 dan 番号 saat disatukan menjadi 受験番号, menunjukan bahwa gabungan kedua kosakata kanji tersebut, mengandung makna "nomor identitas khusus yang diberikan kepada peserta ujian untuk memastikan pengenalan dan verifikasi data diri selama seluruh rangkain ujian berlangsung".',
    nodes: [
      { jokugo: "受験", arti: "mengikuti ujian" },
      { jokugo: "番号", arti: "nomor identitas" }
    ]
  }
];

export async function seedSemanticRelationKenMod1() {
  const kanji = await prisma.kanji.findFirst({ where: { character: "験" } });
  if (!kanji) {
    console.error("Kanji 験 not found");
    return;
  }

  await prisma.semanticRelation.deleteMany({ where: { kanjiId: kanji.id } });

  for (const item of KEN_MOD1_SEMANTIC_DATA) {
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
  console.log(`✅ Seeded ${KEN_MOD1_SEMANTIC_DATA.length} SemanticRelation records for Kanji 験.`);
}
