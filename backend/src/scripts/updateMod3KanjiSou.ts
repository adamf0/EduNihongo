import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const customGraphSou = {
  categories: [
    {
      title: "1. PENGIRIMAN INFORMASI / PESAN",
      color: "border-red-500",
      jukugos: [
        { word: "送信", reading: "そうしん", meaning: "mengirim pesan / mengirimkan data/informasi" },
        { word: "電送", reading: "でんそう", meaning: "mengirim informasi secara elektronik" },
        { word: "伝送", reading: "でんそう", meaning: "meneruskan / mentransmisikan informasi, sinyal" },
        { word: "放送", reading: "ほうそう", meaning: "siaran" }
      ]
    },
    {
      title: "2. PENGIRIMAN / PENGANTARAN BARANG",
      color: "border-orange-500",
      jukugos: [
        { word: "発送", reading: "はっそう", meaning: "mengirim / mengeluarkan kiriman" },
        { word: "直送", reading: "ちょくそう", meaning: "pengiriman langsung ke tujuan" },
        { word: "送付", reading: "そうふ", meaning: "mengirimkan barang atau dokumen" },
        { word: "郵送", reading: "ゆうそう", meaning: "mengirim melalui pos surat" },
        { word: "配送", reading: "はいそう", meaning: "pengiriman barang, paket, pesanan" },
        { word: "輸送", reading: "ゆそう", meaning: "mengangkut / mengirim barang atau penumpang" },
        { word: "移送", reading: "いそう", meaning: "memindahkan / mengirim ke tempat lain" },
        { word: "回送", reading: "かいそう", meaning: "mengirim ke tempat asal atau tempat lain" },
        { word: "転送", reading: "てんそう", meaning: "meneruskan kiriman ke tujuan lain" }
      ]
    },
    {
      title: "3. PENYERAHAN / PENGIRIMAN KEPADA PIHAK BERWENANG",
      color: "border-purple-500",
      jukugos: [
        { word: "送検", reading: "そうけん", meaning: "mengirim tersangka / berkas perkara ke jaksa (untuk dituntut)" },
        { word: "送致", reading: "そうち", meaning: "menyerahkan / mengirim kepada pihak berwenang" },
        { word: "護送", reading: "ごそう", meaning: "mengawal / mengantar terdakwa, tahanan, dsb." }
      ]
    },
    {
      title: "4. PENGIRIMAN / PENGANTARAN ORANG",
      color: "border-green-500",
      jukugos: [
        { word: "押送", reading: "おうそう", meaning: "mengawal / mengantar seseorang dengan kendaraan resmi" },
        { word: "送別", reading: "そうべつ", meaning: "perpisahan / mengantar seseorang yang pergi" },
        { word: "歓送", reading: "かんそう", meaning: "melepas / mengantar seseorang dengan ucapan selamat atau penghormatan" },
        { word: "送辞", reading: "そうじ", meaning: "pidato perpisahan" }
      ]
    },
    {
      title: "5. PENGIRIMAN / MELALUI JALUR KHUSUS",
      color: "border-blue-500",
      jukugos: [
        { word: "陸送", reading: "りくそう", meaning: "pengiriman melalui jalur darat" },
        { word: "送電", reading: "そうでん", meaning: "menyalurkan tenaga listrik" }
      ]
    }
  ]
};

const SOU_SEMANTIC_DATA = [
  // 1) PENGIRIMAN INFORMASI / PESAN
  {
    word: "送信",
    penjelasan: "Hubungan makna antar kanji 送 dan 信 menjadi 送信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirim pesan atau mengirimkan data/informasi.”",
    nodes: [
      { jokugo: "送", arti: "mengirim, menyampaikan" },
      { jokugo: "信", arti: "pesan, informasi; kepercayaan" }
    ]
  },
  {
    word: "電送",
    penjelasan: "Hubungan makna antar kanji 電 dan 送 menjadi 電送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengiriman melalui media elektronik atau transmisi elektronik.”",
    nodes: [
      { jokugo: "電", arti: "listrik, elektronik" },
      { jokugo: "送", arti: "mengirim, mentransmisikan" }
    ]
  },
  {
    word: "伝送",
    penjelasan: "Hubungan makna antar kanji 伝 dan 送 menjadi 伝送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “meneruskan atau mentransmisikan informasi/sinyal.”",
    nodes: [
      { jokugo: "伝", arti: "meneruskan, menyampaikan" },
      { jokugo: "送", arti: "mengirim, mentransmisikan" }
    ]
  },
  {
    word: "放送",
    penjelasan: "Hubungan makna antar kanji 放 dan 送 menjadi 放送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “siaran atau penyebaran informasi kepada banyak orang.”",
    nodes: [
      { jokugo: "放", arti: "melepaskan, menyebarkan" },
      { jokugo: "送", arti: "mengirim, menyampaikan" }
    ]
  },

  // 2) PENGIRIMAN / PENGANTARAN BARANG
  {
    word: "発送",
    penjelasan: "Hubungan makna antar kanji 発 dan 送 menjadi 発送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirim atau mengeluarkan kiriman.”",
    nodes: [
      { jokugo: "発", arti: "mengeluarkan, memulai, mengirim" },
      { jokugo: "送", arti: "mengirim, mengantarkan" }
    ]
  },
  {
    word: "直送",
    penjelasan: "Hubungan makna antar kanji 直 dan 送 menjadi 直送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengiriman langsung ke tujuan.”",
    nodes: [
      { jokugo: "直", arti: "langsung" },
      { jokugo: "送", arti: "mengirim, mengantarkan" }
    ]
  },
  {
    word: "送付",
    penjelasan: "Hubungan makna antar kanji 送 dan 付 menjadi 送付, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirimkan barang, dokumen, surat, dan sebagainya.”",
    nodes: [
      { jokugo: "送", arti: "mengirim, mengantarkan" },
      { jokugo: "付", arti: "menyerahkan, melampirkan" }
    ]
  },
  {
    word: "郵送",
    penjelasan: "Hubungan makna antar kanji 郵 dan 送 menjadi 郵送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirim melalui pos atau surat.”",
    nodes: [
      { jokugo: "郵", arti: "pos" },
      { jokugo: "送", arti: "mengirim" }
    ]
  },
  {
    word: "配送",
    penjelasan: "Hubungan makna antar kanji 配 dan 送 menjadi 配送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengiriman barang, paket, atau pesanan.”",
    nodes: [
      { jokugo: "配", arti: "membagikan, mendistribusikan" },
      { jokugo: "送", arti: "mengirim, mengantarkan" }
    ]
  },
  {
    word: "輸送",
    penjelasan: "Hubungan makna antar kanji 輸 dan 送 menjadi 輸送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengangkut atau mengirim barang atau penumpang.”",
    nodes: [
      { jokugo: "輸", arti: "mengangkut, memindahkan" },
      { jokugo: "送", arti: "mengirim, mengantarkan" }
    ]
  },
  {
    word: "移送",
    penjelasan: "Hubungan makna antar kanji 移 dan 送 menjadi 移送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memindahkan atau mengirim ke tempat lain.”",
    nodes: [
      { jokugo: "移", arti: "memindahkan" },
      { jokugo: "送", arti: "mengirim, mengantarkan" }
    ]
  },
  {
    word: "回送",
    penjelasan: "Hubungan makna antar kanji 回 dan 送 menjadi 回送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirim kembali atau mengirim ke tempat asal/tempat lain.”",
    nodes: [
      { jokugo: "回", arti: "kembali, berputar" },
      { jokugo: "送", arti: "mengirim, mengantarkan" }
    ]
  },
  {
    word: "転送",
    penjelasan: "Hubungan makna antar kanji 転 dan 送 menjadi 転送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “meneruskan atau mengalihkan kiriman ke tujuan lain.”",
    nodes: [
      { jokugo: "転", arti: "berpindah, mengalihkan" },
      { jokugo: "送", arti: "mengirim, meneruskan" }
    ]
  },

  // 3) PENYERAHAN / PENGIRIMAN KEPADA PIHAK BERWENANG
  {
    word: "送検",
    penjelasan: "Hubungan makna antar kanji 送 dan 検 menjadi 送検, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirim tersangka atau berkas perkara ke jaksa untuk dituntut.”",
    nodes: [
      { jokugo: "送", arti: "mengirim, menyerahkan" },
      { jokugo: "検", arti: "pemeriksaan, penyelidikan" }
    ]
  },
  {
    word: "送致",
    penjelasan: "Hubungan makna antar kanji 送 dan 致 menjadi 送致, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirim atau menyerahkan seseorang maupun berkas perkara kepada pihak yang berwenang untuk diproses lebih lanjut.”",
    nodes: [
      { jokugo: "送", arti: "mengirim, menyerahkan" },
      { jokugo: "致", arti: "menyampaikan atau membawa sampai kepada tujuan" }
    ]
  },
  {
    word: "護送",
    penjelasan: "Hubungan makna antar kanji 護 dan 送 menjadi 護送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengawal atau mengantar terdakwa, tahanan, dan sebagainya.”",
    nodes: [
      { jokugo: "護", arti: "melindungi, mengawal" },
      { jokugo: "送", arti: "mengantar, membawa" }
    ]
  },

  // 4) PENGIRIMAN / PENGANTARAN ORANG
  {
    word: "押送",
    penjelasan: "Hubungan makna antar kanji 押 dan 送 menjadi 押送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengawal atau mengantar seseorang dengan kendaraan resmi.”",
    nodes: [
      { jokugo: "押", arti: "mengawal, membawa secara resmi" },
      { jokugo: "送", arti: "mengantar, membawa" }
    ]
  },
  {
    word: "送別",
    penjelasan: "Hubungan makna antar kanji 送 dan 別 menjadi 送別, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perpisahan atau mengantar seseorang yang pergi.”",
    nodes: [
      { jokugo: "送", arti: "mengantar, melepas" },
      { jokugo: "別", arti: "berpisah, perpisahan" }
    ]
  },
  {
    word: "歓送",
    penjelasan: "Hubungan makna antar kanji 歓 dan 送 menjadi 歓送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “melepas atau mengantar seseorang dengan ucapan selamat atau penghormatan.”",
    nodes: [
      { jokugo: "歓", arti: "senang, menyambut dengan gembira" },
      { jokugo: "送", arti: "mengantar, melepas" }
    ]
  },
  {
    word: "送辞",
    penjelasan: "Hubungan makna antar kanji 送 dan 辞 menjadi 送辞, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pidato perpisahan atau ucapan saat mengantar pergi.”",
    nodes: [
      { jokugo: "送", arti: "mengantar, melepas" },
      { jokugo: "辞", arti: "kata-kata, ucapan" }
    ]
  },

  // 5) PENGIRIMAN / MELALUI JALUR KHUSUS
  {
    word: "陸送",
    penjelasan: "Hubungan makna antar kanji 陸 dan 送 menjadi 陸送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengiriman melalui jalur darat.”",
    nodes: [
      { jokugo: "陸", arti: "darat" },
      { jokugo: "送", arti: "mengirim, mengangkut" }
    ]
  },
  {
    word: "送電",
    penjelasan: "Hubungan makna antar kanji 送 dan 電 menjadi 送電, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan mengirim atau menyalurkan tenaga listrik dari pembangkit maupun gardu listrik menuju tempat penggunaan melalui jaringan listrik.”",
    nodes: [
      { jokugo: "送", arti: "mengirim, menyalurkan" },
      { jokugo: "電", arti: "listrik atau tenaga listrik" }
    ]
  }
];

const CONSTITUENT_KANJI_DATA = [
  {
    character: "信",
    romaji: "SHIN",
    meaning: "Pesan, Informasi, Percaya",
    baseMeaning: "pesan, informasi, atau kepercayaan.",
    bushuu: "亻",
    kunyomi: "-",
    onyomi: "シン"
  },
  {
    character: "電",
    romaji: "DEN",
    meaning: "Listrik, Elektronik",
    baseMeaning: "listrik atau sinyal elektronik.",
    bushuu: "雨",
    kunyomi: "-",
    onyomi: "デン"
  },
  {
    character: "伝",
    romaji: "DEN / Tsuta",
    meaning: "Meneruskan, Menyampaikan",
    baseMeaning: "meneruskan atau menyampaikan.",
    bushuu: "亻",
    kunyomi: "つた・わる、つた・える",
    onyomi: "デン"
  },
  {
    character: "放",
    romaji: "HOU / Hana",
    meaning: "Melepaskan, Menyebarkan",
    baseMeaning: "melepaskan atau menyebarkan.",
    bushuu: "攵",
    kunyomi: "はな・す、はな・つ",
    onyomi: "ホウ"
  },
  {
    character: "発",
    romaji: "HATSU",
    meaning: "Mengeluarkan, Memulai",
    baseMeaning: "mengeluarkan, memulai, atau mengirim.",
    bushuu: "癶",
    kunyomi: "-",
    onyomi: "ハツ、ホツ"
  },
  {
    character: "直",
    romaji: "CHOKU / JIKI",
    meaning: "Langsung, Memperbaiki",
    baseMeaning: "langsung ke tujuan tanpa perantara.",
    bushuu: "目",
    kunyomi: "ただ・ちに、なお・す",
    onyomi: "チョク、ジキ"
  },
  {
    character: "付",
    romaji: "FU / Tsu",
    meaning: "Menyerahkan, Melampirkan",
    baseMeaning: "menyerahkan atau melampirkan.",
    bushuu: "亻",
    kunyomi: "つ・ける、つ・く",
    onyomi: "フ"
  },
  {
    character: "郵",
    romaji: "YUU",
    meaning: "Pos, Surat",
    baseMeaning: "layanan pos atau surat.",
    bushuu: "阝",
    kunyomi: "-",
    onyomi: "ユウ"
  },
  {
    character: "配",
    romaji: "HAI / Koba",
    meaning: "Membagikan, Mendistribusikan",
    baseMeaning: "membagikan atau mendistribusikan barang.",
    bushuu: "酉",
    kunyomi: "くば・る",
    onyomi: "ハイ"
  },
  {
    character: "輸",
    romaji: "YU",
    meaning: "Mengangkut, Memindahkan",
    baseMeaning: "mengangkut atau mengirim barang/penumpang.",
    bushuu: "車",
    kunyomi: "-",
    onyomi: "ユ、シュ"
  },
  {
    character: "移",
    romaji: "I / Utsu",
    meaning: "Memindahkan, Berpindah",
    baseMeaning: "memindahkan atau berpindah ke tempat lain.",
    bushuu: "禾",
    kunyomi: "うつ・る、うつ・す",
    onyomi: "イ"
  },
  {
    character: "回",
    romaji: "KAI / Mawa",
    meaning: "Kembali, Berputar",
    baseMeaning: "kembali ke asal atau berputar.",
    bushuu: "囗",
    kunyomi: "まわ・る、まわ・す",
    onyomi: "カイ、エ"
  },
  {
    character: "転",
    romaji: "TEN / Koro",
    meaning: "Berpindah, Mengalihkan",
    baseMeaning: "berpindah atau mengalihkan kiriman.",
    bushuu: "車",
    kunyomi: "ころ・がる、ころ・ぶ",
    onyomi: "テン"
  },
  {
    character: "検",
    romaji: "KEN",
    meaning: "Pemeriksaan, Penyelidikan",
    baseMeaning: "pemeriksaan atau penyelidikan perkara.",
    bushuu: "木",
    kunyomi: "しら・べる",
    onyomi: "ケン"
  },
  {
    character: "致",
    romaji: "CHI / Ita",
    meaning: "Menyampaikan, Membawa Sampai Tujuan",
    baseMeaning: "menyampaikan atau membawa sampai ke tujuan.",
    bushuu: "至",
    kunyomi: "いた・す",
    onyomi: "チ"
  },
  {
    character: "護",
    romaji: "GO",
    meaning: "Melindungi, Mengawal",
    baseMeaning: "melindungi atau mengawal tahanan.",
    bushuu: "言",
    kunyomi: "まも・る",
    onyomi: "ゴ"
  },
  {
    character: "押",
    romaji: "OU / O",
    meaning: "Mengawal, Membawa Resmi",
    baseMeaning: "mengawal atau membawa seseorang dengan kendaraan resmi.",
    bushuu: "扌",
    kunyomi: "お・す、お・さえる",
    onyomi: "オウ"
  },
  {
    character: "別",
    romaji: "BETSU / Waka",
    meaning: "Berpisah, Perpisahan",
    baseMeaning: "berpisah atau perpisahan.",
    bushuu: "刂",
    kunyomi: "わか・れる",
    onyomi: "ベツ"
  },
  {
    character: "歓",
    romaji: "KAN",
    meaning: "Senang, Menyambut Gembira",
    baseMeaning: "senang, gembira, atau ucapan selamat.",
    bushuu: "欠",
    kunyomi: "よろこ・ぶ",
    onyomi: "カン"
  },
  {
    character: "辞",
    romaji: "JI / Ya",
    meaning: "Kata-kata, Ucapan",
    baseMeaning: "kata-kata, pidato, atau ucapan perpisahan.",
    bushuu: "辛",
    kunyomi: "や・める",
    onyomi: "ジ"
  },
  {
    character: "陸",
    romaji: "RIKU",
    meaning: "Darat",
    baseMeaning: "jalur darat atau daratan.",
    bushuu: "阝",
    kunyomi: "おか",
    onyomi: "リク、ロク"
  }
];

const CROSS_LINKS = [
  { source: "発送", target: "直送", predicate: "pengiriman & pengiriman langsung" },
  { source: "郵送", target: "配送", predicate: "kirim pos & distribusi paket" },
  { source: "輸送", target: "陸送", predicate: "pengangkutan barang & angkutan darat" },
  { source: "転送", target: "回送", predicate: "meneruskan kiriman & pengembalian" },
  { source: "護送", target: "送検", predicate: "pengawalan terdakwa & penyerahan berkas perkara" },
  { source: "送致", target: "送検", predicate: "penyerahan ke pihak berwenang & pengiriman ke jaksa" },
  { source: "押送", target: "護送", predicate: "pengawalan resmi & pengawalan tahanan" },
  { source: "送別", target: "歓送", predicate: "acara perpisahan & pelepasan gembira" },
  { source: "送別", target: "送辞", predicate: "perpisahan & pidato perpisahan" },
  { source: "送信", target: "伝送", predicate: "pengiriman pesan & transmisi data" },
  { source: "電送", target: "送電", predicate: "transmisi data elektronik & penyaluran listrik" },
  { source: "放送", target: "送信", predicate: "siaran publik & pengiriman pesan" },
  { source: "送付", target: "郵送", predicate: "penyerahan dokumen & kirim pos" },
  { source: "移送", target: "輸送", predicate: "pemindahan lokasi & pengangkutan" },
  { source: "配送", target: "直送", predicate: "distribusi paket & kirim langsung" }
];

async function run() {
  const char = "送";
  console.log(`Starting update for kanji ${char}...`);

  // 1. Dapatkan atau verifikasi Kanji 送
  const kanji = await prisma.kanji.findFirst({
    where: { character: char },
  });

  if (!kanji) {
    console.error(`Kanji ${char} not found in DB!`);
    return;
  }

  // Update atribut kanji 送 agar sesuai gambar referensi
  await prisma.kanji.update({
    where: { id: kanji.id },
    data: {
      meaning: "mengirim, menyampaikan, mengantarkan, mengirimkan ke suatu tempat atau kepada seseorang.",
      baseMeaning: "mengirim, menyampaikan, mengantarkan, mengirimkan ke suatu tempat atau kepada seseorang.",
      romaji: "SOU",
      bushuu: "辶",
      onyomi: "ソウ",
      kunyomi: "おく・る"
    }
  });
  console.log(`Updated root Kanji ${char} attributes.`);

  // 2. Sinkronkan kanji-kanji penyusun tunggal
  for (const cData of CONSTITUENT_KANJI_DATA) {
    const existing = await prisma.kanji.findFirst({
      where: { character: cData.character }
    });
    if (existing) {
      await prisma.kanji.update({
        where: { id: existing.id },
        data: {
          romaji: cData.romaji,
          meaning: cData.meaning,
          baseMeaning: cData.baseMeaning,
          bushuu: cData.bushuu,
          kunyomi: cData.kunyomi,
          onyomi: cData.onyomi
        }
      });
    } else {
      await prisma.kanji.create({
        data: {
          character: cData.character,
          romaji: cData.romaji,
          meaning: cData.meaning,
          baseMeaning: cData.baseMeaning,
          bushuu: cData.bushuu,
          kunyomi: cData.kunyomi,
          onyomi: cData.onyomi,
          moduleId: null
        }
      });
    }
  }
  console.log(`Synchronized ${CONSTITUENT_KANJI_DATA.length} constituent kanji records.`);

  // 3. Bersihkan KanjiGraphEdge lama
  await prisma.kanjiGraphEdge.deleteMany({
    where: { kanjiId: kanji.id }
  });

  // 4. Masukkan cross-link bersih (source & target persis kata Jukugo)
  for (let i = 0; i < CROSS_LINKS.length; i++) {
    const link = CROSS_LINKS[i];
    await prisma.kanjiGraphEdge.create({
      data: {
        id: `送-cross-${kanji.id}-${i + 1}-${link.source}-${link.target}`,
        kanjiId: kanji.id,
        source: link.source,
        target: link.target,
        predicate: link.predicate
      }
    });
  }
  console.log(`Inserted ${CROSS_LINKS.length} clean cross-link edges into KanjiGraphEdge.`);

  // 5. Bersihkan relasi KategoriKanji, SemanticRelation, dan Jukugo lama untuk kanji 送
  const existingJukugos = await prisma.jukugo.findMany({
    where: { kanjiId: kanji.id }
  });
  const existingJukugoIds = existingJukugos.map(j => j.id);
  if (existingJukugoIds.length > 0) {
    await prisma.kategoriKanji.deleteMany({
      where: { jokugoId: { in: existingJukugoIds } }
    });
  }

  const oldSRs = await prisma.semanticRelation.findMany({
    where: { kanjiId: kanji.id },
    select: { id: true }
  });
  const oldSRIds = oldSRs.map(sr => sr.id);
  if (oldSRIds.length > 0) {
    await prisma.semanticRelationNode.deleteMany({
      where: { semanticId: { in: oldSRIds } }
    });
    await prisma.semanticRelation.deleteMany({
      where: { id: { in: oldSRIds } }
    });
  }

  // Hapus seluruh jukugo lama agar duplikat (送信, 押送, 電送) bersih total
  await prisma.jukugo.deleteMany({
    where: { kanjiId: kanji.id }
  });
  console.log(`Cleaned up old Jukugo and duplicate records for kanji ${char}.`);

  // 6. Buat Jukugo baru (22 kata murni), MasterCategory, dan relasi KategoriKanji
  const allWords: string[] = [];
  for (const cat of customGraphSou.categories) {
    const masterCat = await prisma.masterCategory.upsert({
      where: { name: cat.title },
      update: {
        name: cat.title,
        description: `Kategori ${cat.title} untuk kanji ${char}`
      },
      create: {
        name: cat.title,
        description: `Kategori ${cat.title} untuk kanji ${char}`
      }
    });

    for (const jk of cat.jukugos) {
      allWords.push(jk.word);

      const dbJukugo = await prisma.jukugo.create({
        data: {
          kanjiId: kanji.id,
          word: jk.word,
          reading: jk.reading,
          meaning: jk.meaning
        }
      });

      await prisma.kategoriKanji.create({
        data: {
          jokugoId: dbJukugo.id,
          categoryId: masterCat.id
        }
      });
    }
  }
  console.log(`Populated KategoriKanji for all ${allWords.length} unique jukugos across ${customGraphSou.categories.length} categories.`);

  // 7. Update SemanticRelation & SemanticRelationNode untuk kanji 送
  for (const semItem of SOU_SEMANTIC_DATA) {
    const targetWord = semItem.word;
    const matchedJukugo = await prisma.jukugo.findFirst({
      where: { kanjiId: kanji.id, word: targetWord }
    });

    const createdSem = await prisma.semanticRelation.create({
      data: {
        kanjiId: kanji.id,
        jukugoId: matchedJukugo?.id || null,
        penjelasan: semItem.penjelasan
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
  console.log(`Updated ${SOU_SEMANTIC_DATA.length} SemanticRelation records and constituent nodes.`);

  // 8. Update Grouping Quiz for kanji 送
  await prisma.quiz.deleteMany({
    where: { kanjiId: kanji.id, type: "grouping" }
  });

  const formattedGroups = customGraphSou.categories.map(cat => ({
    name: cat.title,
    category: cat.title,
    correctWords: cat.jukugos.map(j => j.word),
    items: cat.jukugos.map(j => j.word),
    [cat.title]: cat.jukugos.map(j => j.word)
  }));

  await prisma.quiz.create({
    data: {
      kanjiId: kanji.id,
      type: "grouping",
      question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
      words: JSON.stringify(allWords),
      groups: JSON.stringify(formattedGroups),
      explanation: `Pengelompokan jukugo berdasarkan cabang semantic graph kanji ${char}.`
    }
  });
  console.log(`Updated grouping quiz for ${char}.`);

  console.log(`\n=== SUKSES MEMPERBARUI SEMANTIC DATA KANJI ${char} 100% ===`);
}

run()
  .catch(e => {
    console.error("Error updating kanji Sou:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
