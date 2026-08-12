import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const SHI_SEMANTIC_DATA = [
  // 1) Aktifitas pengujian
  {
    kanji: "試験",
    arti: "UJian",
    penjelasan: 'Hubungan makna antara kanji 試 dan 験 menjadi 試験 menunjukan gabungan kedua kanji tersebut membentuk sebuah makna "suatu kegiatan untuk mengukur pengetahuan atau kemampuan seseorang, maka ketika digabungkan mengandung makna ujian".',
    nodes: [
      { jokugo: "試", arti: "Menguji" },
      { jokugo: "験", arti: "Memverifikasi hasil" }
    ]
  },
  {
    kanji: "入試",
    arti: "ujian masuk",
    penjelasan: 'Hubungan makna antara kanji 入 dan 試 menjadi 入試 , menunjukan gabungan kedua kanji tersebut membentuk sebuah makna “untuk masuk sekolah atau pun perguruan “tinggi harus melalui ujian’.',
    nodes: [
      { jokugo: "入", arti: "masuk" },
      { jokugo: "試", arti: "ujian" }
    ]
  },
  {
    kanji: "試問",
    arti: "ujian lisan",
    penjelasan: 'Hubungan makna antar kanji 試 dan 問 menjadi 試問, menunjukan gabungan kedua kanji tersebut membentuk sebuah makna "ujian dilakukan dengan tanya jawab secara langsung".',
    nodes: [
      { jokugo: "試", arti: "menguji" },
      { jokugo: "問", arti: "bertanya" }
    ]
  },

  // 2) Penggunaan
  {
    kanji: "試着",
    arti: "mencoba pakaian",
    penjelasan: 'Hubungan makna antar kanji 試 dan 着 menjadi 試着, menunjukan gabungan kedua kanji tersebut membentuk sebuah makna "mencoba pakaian sebelum memutuskan untuk memberlinya".',
    nodes: [
      { jokugo: "試", arti: "Mencoba" },
      { jokugo: "着", arti: "Memakai" }
    ]
  },
  {
    kanji: "試用",
    arti: "Uji Coba",
    penjelasan: 'Hubungan makna antar kanji 試 dan 用 menunjukan gabungan kedua kanji tersebut membentuk sebuah makna "bahwa untuk mengetahui manfaat atau kualitasnya harus menggunakan sesuatu"',
    nodes: [
      { jokugo: "試", arti: "Mencoba" },
      { jokugo: "用", arti: "Menggunakan" }
    ]
  },
  {
    kanji: "試乗",
    arti: "Test Drive",
    penjelasan: 'Hubungan makna antar kanji 試 dan 乗 menunjukan bahwa sebelum membeli atau menggunakan kendaraan harus mencoba kendaraan terlebih dahulu.',
    nodes: [
      { jokugo: "試", arti: "Mencoba" },
      { jokugo: "乗", arti: "Menaiki" }
    ]
  },

  // 3) Konsumsi
  {
    kanji: "試食",
    arti: "Uji rasa",
    penjelasan: 'Hubungan makna antar kanji 試 dan 食 menunjukan bahwa untuk menilai rasa sesuatu, terlebih dahulu harus mencoba makanannya terlebih dahulu.',
    nodes: [
      { jokugo: "試", arti: "Mencoba" },
      { jokugo: "食", arti: "Makan" }
    ]
  },
  {
    kanji: "試飲",
    arti: "Coba Minuman",
    penjelasan: 'Hubungan makna antar kanji 試 dan 飲 menjadi 試飲, menunjukan bahwa gabungan kedua kanji tersebut mengandung makna "sebelum membeli atau memilih produk minuman, terlebih dahulu mencoba minumannya."',
    nodes: [
      { jokugo: "試", arti: "Mencoba" },
      { jokugo: "飲", arti: "Minum" }
    ]
  },
  {
    kanji: "試薬",
    arti: "bahan uji",
    penjelasan: 'Hubungan makna antar kanji 試 dan 薬 menjadi 試薬, menujukan bahwa gabunagn keua kanji itu mengandung makna "zat yang digunakan untuk melakukan pengujian atau eksperimen".',
    nodes: [
      { jokugo: "試", arti: "menguji" },
      { jokugo: "薬", arti: "zat kimia" }
    ]
  },

  // 4) Produksi dan Pengembangan
  {
    kanji: "試作",
    arti: "Prototipe",
    penjelasan: 'Hubungan makna antar kanji 試 dan 作 menjadi 試作, menunjukan bahwa gabungan kedua kanji tersebut mengandung makna "sebelum memperoduksi sesuatu secara massal, terlebih dahulu membuat produk percobaan terlebih dahulu".',
    nodes: [
      { jokugo: "試", arti: "Percobaan" },
      { jokugo: "作", arti: "Membuat" }
    ]
  },
  {
    kanji: "試作品",
    arti: "produk uji",
    penjelasan: 'Hubungan makna antar kanji 試作 dan 品 menjadi 試作品, menunjukan bahwa gabungan kedua kanji tersebut mengandung makan "produk hasil percobaan yang masih dalam tahap pengembangan"',
    nodes: [
      { jokugo: "試作", arti: "Prototipe" },
      { jokugo: "品", arti: "Produk/barang" }
    ]
  },
  {
    kanji: "試製",
    arti: "Uji Produksi",
    penjelasan: 'Hubungan makna antar kanji 試 dan 製, menunjukan bahwa gabungan kedua kanji itu mengandung makna "mengevaluasi kualitas produk, terlebih dahulu memproduksi sesuatu dalam skala percobaan".',
    nodes: [
      { jokugo: "試", arti: "Percobaan" },
      { jokugo: "製", arti: "Memproduksi" }
    ]
  },

  // 5) Kompetisi dan Media
  {
    kanji: "試合",
    arti: "Pertandingan",
    penjelasan: 'Hubungan makna antar kanji 試 dan 合, menunjukan bahwa gabungan kedua kanji itu mengandung makna "ajang untuk menguji kemampuan peserta atau pun tim".',
    nodes: [
      { jokugo: "試", arti: "Menguji" },
      { jokugo: "合", arti: "Bertanding" }
    ]
  },
  {
    kanji: "試技",
    arti: "Uji keterampilan",
    penjelasan: 'Hubungan makna antar kanji 試 dan 技, menunjukan bahwa gabungan kedua kanji itu mengandung makna "demontrasi atau penilaian kemampuan teknis seseorang".',
    nodes: [
      { jokugo: "試", arti: "Menguji" },
      { jokugo: "技", arti: "Keterampilan" }
    ]
  },
  {
    kanji: "試聴",
    arti: "uji dengar",
    penjelasan: 'Hubungan makna antar kanji 試 dan 聴, menunjukan bahwa gabungan kedua kanji itu mengandung makna "sebelum memilih sesuatu, terlebih dahulu mendengarkan contoh audionya".',
    nodes: [
      { jokugo: "試", arti: "Mencoba" },
      { jokugo: "聴", arti: "Mendengar" }
    ]
  },
  {
    kanji: "試写",
    arti: "pratinjau film",
    penjelasan: 'Hubungan makna antar kanji 試 dan 写, menunjukan bahwa gabungan kedua kanji itu mengandung makna "sebelum mempublikasikan film secara resmi, terlebih dahulu filmnya dipertontonkan dulu".',
    nodes: [
      { jokugo: "試", arti: "mencoba" },
      { jokugo: "写", arti: "menayangkan" }
    ]
  },
  {
    kanji: "試読",
    arti: "pratinjau",
    penjelasan: 'Hubungan makna antar kanji, dari kanji 試 dan 読, menunjukan bahwa gabungan kedua kanji itu mengandung makna "sebelum memutuskan membelinya, terlebih dahulu membaca isi buku atau tulisannya".',
    nodes: [
      { jokugo: "試", arti: "mencoba" },
      { jokugo: "読", arti: "membaca" }
    ]
  }
];

export async function seedSemanticRelationShi() {
  const kanji = await prisma.kanji.findFirst({ where: { character: "試" } });
  if (!kanji) {
    console.error("Kanji 試 not found");
    return;
  }

  await prisma.semanticRelation.deleteMany({ where: { kanjiId: kanji.id } });

  for (const item of SHI_SEMANTIC_DATA) {
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
  console.log(`✅ Seeded ${SHI_SEMANTIC_DATA.length} SemanticRelation records for Kanji 試.`);
}
