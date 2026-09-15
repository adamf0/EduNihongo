import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const SHI_SEMANTIC_DATA = [
  // 1) Aktivitas Pengujian
  {
    kanji: "試験",
    arti: "ujian",
    penjelasan: 'Hubungan makna antara kanji 試 dan 験 menjadi 試験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan menguji untuk mengetahui atau membuktikan kemampuan, pengetahuan, atau hasil tertentu.”',
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "験", arti: "menguji, membuktikan melalui pengalaman atau pengujian" }
    ]
  },
  {
    kanji: "入試",
    arti: "ujian masuk",
    penjelasan: 'Hubungan makna antara kanji 入 dan 試 menjadi 入試, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “ujian yang dilakukan untuk menentukan apakah seseorang dapat masuk ke sekolah, universitas, atau lembaga tertentu.”',
    nodes: [
      { jokugo: "入", arti: "masuk, memasuki" },
      { jokugo: "試", arti: "mencoba, menguji" }
    ]
  },
  {
    kanji: "追試",
    arti: "ujian susulan",
    penjelasan: 'Hubungan makna antara kanji 追 dan 試 menjadi 追試, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “ujian tambahan atau ujian susulan yang dilakukan setelah ujian utama.”',
    nodes: [
      { jokugo: "追", arti: "mengikuti, menyusul, menambahkan" },
      { jokugo: "試", arti: "ujian, pengujian" }
    ]
  },
  {
    kanji: "試問",
    arti: "ujian lisan / pengujian melalui pertanyaan",
    penjelasan: 'Hubungan makna antara kanji 試 dan 問 menjadi 試問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengujian yang dilakukan dengan memberikan pertanyaan untuk mengetahui kemampuan atau pengetahuan seseorang.”',
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "問", arti: "bertanya, pertanyaan" }
    ]
  },

  // 2) Penggunaan
  {
    kanji: "試着",
    arti: "coba pakaian",
    penjelasan: 'Hubungan makna antara kanji 試 dan 着 menjadi 試着, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba mengenakan pakaian untuk mengetahui ukuran, penampilan, atau kecocokannya.”',
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "着", arti: "memakai, mengenakan" }
    ]
  },
  {
    kanji: "試用",
    arti: "uji coba",
    penjelasan: 'Hubungan makna antara kanji 試 dan 用 menjadi 試用, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba menggunakan sesuatu untuk mengetahui fungsi, kualitas, atau kesesuaiannya.”',
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "用", arti: "menggunakan, memakai" }
    ]
  },
  {
    kanji: "試乗",
    arti: "test drive / coba kendaraan",
    penjelasan: 'Hubungan makna antara kanji 試 dan 乗 menjadi 試乗, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba menaiki atau mengendarai kendaraan untuk mengetahui kondisi, kenyamanan, atau performanya.”',
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "乗", arti: "menaiki, mengendarai" }
    ]
  },

  // 3) Konsumsi
  {
    kanji: "試食",
    arti: "uji rasa / mencicipi makanan",
    penjelasan: 'Hubungan makna antara kanji 試 dan 食 menjadi 試食, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba atau mencicipi makanan untuk mengetahui rasa atau kualitasnya.”',
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "食", arti: "makan, makanan" }
    ]
  },
  {
    kanji: "試飲",
    arti: "coba minuman",
    penjelasan: 'Hubungan makna antara kanji 試 dan 飲 menjadi 試飲, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba atau mencicipi minuman untuk mengetahui rasa atau kualitasnya.”',
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "飲", arti: "minum" }
    ]
  },

  // 4) Bahan Pengujian
  {
    kanji: "試薬",
    arti: "reagen uji / bahan uji",
    penjelasan: 'Hubungan makna antara kanji 試 dan 薬 menjadi 試薬, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bahan kimia atau reagen yang digunakan untuk melakukan suatu pengujian.”',
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "薬", arti: "obat, bahan kimia" }
    ]
  },

  // 5) Produksi dan Pengembangan
  {
    kanji: "試作",
    arti: "prototipe / pembuatan percobaan",
    penjelasan: 'Hubungan makna antara kanji 試 dan 作 menjadi 試作, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba membuat suatu benda atau produk sebagai percobaan untuk menilai bentuk, fungsi, atau kualitasnya.”',
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "作", arti: "membuat, menghasilkan" }
    ]
  },
  {
    kanji: "試製",
    arti: "produksi uji / pembuatan percobaan",
    penjelasan: 'Hubungan makna antara kanji 試 dan 製 menjadi 試製, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “membuat atau memproduksi sesuatu secara percobaan untuk menguji hasilnya sebelum produksi sebenarnya.”',
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "製", arti: "membuat, memproduksi" }
    ]
  },

  // 6) Kompetisi dan Keterampilan
  {
    kanji: "試合",
    arti: "pertandingan",
    penjelasan: 'Hubungan makna antara kanji 試 dan 合 menjadi 試合, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan mempertemukan dua pihak untuk menguji atau membandingkan kemampuan dalam suatu pertandingan.”',
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "合", arti: "bertemu, berhadapan" }
    ]
  },
  {
    kanji: "試技",
    arti: "uji keterampilan",
    penjelasan: 'Hubungan makna antara kanji 試 dan 技 menjadi 試技, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pelaksanaan atau percobaan suatu teknik untuk menunjukkan atau menguji keterampilan.”',
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "技", arti: "keterampilan, teknik" }
    ]
  },
  {
    kanji: "試射",
    arti: "uji tembak",
    penjelasan: 'Hubungan makna antara kanji 試 dan 射 menjadi 試射, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “percobaan menembak untuk menguji ketepatan, jarak, atau kondisi senjata.”',
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "射", arti: "menembak, memanah" }
    ]
  },
  {
    kanji: "試練",
    arti: "latihan / ujian berat",
    penjelasan: 'Hubungan makna antara kanji 試 dan 練 menjadi 試練, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “ujian atau cobaan berat yang dialami seseorang untuk melatih dan menguji ketahanan serta kesabaran.”',
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "練", arti: "melatih, menempa" }
    ]
  },

  // 7) Media
  {
    kanji: "試写",
    arti: "pratinjau film / pemutaran uji",
    penjelasan: 'Hubungan makna antara kanji 試 dan 写 menjadi 試写, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menayangkan atau melihat film sebagai percobaan sebelum ditampilkan secara umum.”',
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "写", arti: "memotret, menyalin, menayangkan gambar" }
    ]
  },
  {
    kanji: "試聴",
    arti: "mendengar contoh / mencoba mendengarkan",
    penjelasan: 'Hubungan makna antara kanji 試 dan 聴 menjadi 試聴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba mendengarkan musik, rekaman, atau media suara untuk mengetahui isi atau kualitasnya.”',
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "聴", arti: "mendengarkan" }
    ]
  },
  {
    kanji: "試読",
    arti: "membaca contoh / mencoba membaca",
    penjelasan: 'Hubungan makna antara kanji 試 dan 読 menjadi 試読, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba membaca suatu tulisan atau karya untuk mengetahui isi atau kualitasnya sebelum membaca lebih lanjut.”',
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
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
