import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Master Categories for Kanji 研
const CATEGORIES_DATA = [
  { name: "Kegiatan Penelitian", description: "Kelompok ini berkaitan dengan kegiatan penelitian, pelaku penelitian, serta tempat berlangsungnya penelitian." },
  { name: "Pelatihan dan Pengembangan", description: "Kelompok ini berkaitan dengan proses belajar untuk meningkatkan pengetahuan dan keterampilan." },
  { name: "Proses Mengasah dan Memperhalus", description: "Kelompok ini menunjukkan makna asli kanji 研, yaitu mengasah atau memperhalus sesuatu." },
  { name: "Ilmu Pengetahuan dan Akademik", description: "Kelompok ini berkaitan dengan hasil dan bidang penelitian dalam dunia akademik." },
  { name: "Analisis dan Pemeriksaan", description: "Kelompok ini berkaitan dengan pemeriksaan, verifikasi, dan penyelidikan masalah." },
];

// Full Jukugo list with category, reading, meaning, roles, and explanations
const JUKUGO_FULL_RESEARCH: {
  word: string;
  reading: string;
  meaning: string;
  category: string;
  explanation: string;
  charRoles: Record<string, string>;
}[] = [
  // Kelompok 1: Kegiatan Penelitian
  {
    word: "研究", reading: "けんきゅう", meaning: "Penelitian",
    category: "Kegiatan Penelitian",
    explanation: "Penelitian yang dilakukan secara mendalam untuk memperoleh pengetahuan atau menemukan suatu kebenaran.",
    charRoles: { "研": "meneliti, mempelajari secara mendalam", "究": "menyelidiki hingga tuntas, mencari hakikat sesuatu" }
  },
  {
    word: "研究室", reading: "けんきゅうしつ", meaning: "Ruang penelitian / Laboratorium",
    category: "Kegiatan Penelitian",
    explanation: "Ruangan yang digunakan untuk melakukan kegiatan penelitian.",
    charRoles: { "研": "meneliti", "究": "menyelidiki", "室": "ruangan" }
  },
  {
    word: "研究者", reading: "けんきゅうしゃ", meaning: "Peneliti",
    category: "Kegiatan Penelitian",
    explanation: "Orang yang melakukan penelitian secara mendalam.",
    charRoles: { "研": "meneliti", "究": "menyelidiki", "者": "orang" }
  },
  {
    word: "研究会", reading: "けんきゅうかい", meaning: "Kelompok atau forum penelitian",
    category: "Kegiatan Penelitian",
    explanation: "Kelompok atau forum yang melakukan diskusi dan penelitian bersama.",
    charRoles: { "研": "meneliti", "究": "menyelidiki", "会": "pertemuan" }
  },

  // Kelompok 2: Pelatihan dan Pengembangan
  {
    word: "研修", reading: "けんしゅう", meaning: "Pelatihan",
    category: "Pelatihan dan Pengembangan",
    explanation: "Kegiatan belajar untuk meningkatkan pengetahuan atau keterampilan.",
    charRoles: { "研": "mempelajari secara mendalam", "修": "belajar, memperbaiki" }
  },
  {
    word: "研修生", reading: "けんしゅうせい", meaning: "Peserta pelatihan",
    category: "Pelatihan dan Pengembangan",
    explanation: "Orang yang mengikuti kegiatan pelatihan.",
    charRoles: { "研": "mempelajari", "修": "belajar", "生": "orang yang belajar" }
  },
  {
    word: "研修会", reading: "けんしゅうかい", meaning: "Seminar / kegiatan pelatihan",
    category: "Pelatihan dan Pengembangan",
    explanation: "Pertemuan yang bertujuan meningkatkan pengetahuan dan keterampilan.",
    charRoles: { "研": "mempelajari", "修": "belajar", "会": "pertemuan" }
  },
  {
    word: "研修旅行", reading: "けんしゅうりょこう", meaning: "Perjalanan studi",
    category: "Pelatihan dan Pengembangan",
    explanation: "Perjalanan yang dilakukan sebagai bagian dari kegiatan belajar atau pelatihan.",
    charRoles: { "研": "mempelajari", "修": "belajar", "旅": "perjalanan", "行": "pergi" }
  },
  {
    word: "研修医", reading: "けんしゅうい", meaning: "Dokter peserta pelatihan",
    category: "Pelatihan dan Pengembangan",
    explanation: "Dokter muda yang sedang menjalani proses pelatihan medis.",
    charRoles: { "研": "mempelajari", "修": "belajar", "医": "dokter" }
  },
  {
    word: "研修制度", reading: "けんしゅうせいど", meaning: "Sistem pelatihan",
    category: "Pelatihan dan Pengembangan",
    explanation: "Sistem atau struktur resmi yang mengatur kegiatan pelatihan.",
    charRoles: { "研": "mempelajari", "修": "belajar", "制": "sistem", "度": "aturan" }
  },
  {
    word: "研修先", reading: "けんしゅうさき", meaning: "Tempat pelatihan",
    category: "Pelatihan dan Pengembangan",
    explanation: "Lokasi atau institusi tujuan pelaksanaan pelatihan.",
    charRoles: { "研": "mempelajari", "修": "belajar", "先": "tempat tujuan" }
  },

  // Kelompok 3: Mengasah dan Memperhalus
  {
    word: "研磨", reading: "けんま", meaning: "Mengasah, memoles",
    category: "Proses Mengasah dan Memperhalus",
    explanation: "Menghaluskan permukaan benda hingga menjadi lebih baik.",
    charRoles: { "研": "mengasah", "磨": "memoles" }
  },
  {
    word: "研ぐ", reading: "とぐ", meaning: "Mengasah",
    category: "Proses Mengasah dan Memperhalus",
    explanation: "Mengasah benda agar menjadi tajam atau halus.",
    charRoles: { "研": "mengasah" }
  },
  {
    word: "研石", reading: "といし", meaning: "Batu asah",
    category: "Proses Mengasah dan Memperhalus",
    explanation: "Batu yang digunakan untuk mengasah pisau atau alat lainnya.",
    charRoles: { "研": "mengasah", "石": "batu" }
  },
  {
    word: "研削", reading: "けんさく", meaning: "Penggerindaan",
    category: "Proses Mengasah dan Memperhalus",
    explanation: "Proses mengikis atau menghaluskan permukaan suatu benda menggunakan alat.",
    charRoles: { "研": "mengasah", "削": "mengikis" }
  },

  // Kelompok 4: Ilmu Pengetahuan dan Akademik
  {
    word: "研究科", reading: "けんきゅうか", meaning: "Program studi / Pascasarjana",
    category: "Ilmu Pengetahuan dan Akademik",
    explanation: "Bidang ilmu yang mempelajari suatu disiplin secara mendalam.",
    charRoles: { "研": "meneliti", "究": "menyelidiki", "科": "bidang ilmu" }
  },
  {
    word: "研究書", reading: "けんきゅうしょ", meaning: "Buku penelitian",
    category: "Ilmu Pengetahuan dan Akademik",
    explanation: "Buku yang memuat hasil penelitian atau kajian ilmiah.",
    charRoles: { "研": "meneliti", "究": "menyelidiki", "書": "buku" }
  },
  {
    word: "研究方法", reading: "けんきゅうほうほう", meaning: "Metode penelitian",
    category: "Ilmu Pengetahuan dan Akademik",
    explanation: "Cara atau prosedur yang digunakan dalam melakukan penelitian.",
    charRoles: { "研": "meneliti", "究": "menyelidiki", "方": "cara", "法": "metode" }
  },
  {
    word: "研究分野", reading: "けんきゅうぶんや", meaning: "Bidang penelitian",
    category: "Ilmu Pengetahuan dan Akademik",
    explanation: "Cabang ilmu atau topik yang menjadi fokus penelitian.",
    charRoles: { "研": "meneliti", "究": "menyelidiki", "分": "bagian", "野": "bidang" }
  },

  // Kelompok 5: Analisis dan Pemeriksaan
  {
    word: "検討", reading: "けんとう", meaning: "Mengajukan untuk diteliti",
    category: "Analisis dan Pemeriksaan",
    explanation: "Membahas dan meneliti suatu masalah untuk pertimbangan keputusan.",
    charRoles: { "検": "memeriksa", "討": "membahas" }
  },
  {
    word: "検証", reading: "けんしょう", meaning: "Memverifikasi, meneliti kebenaran",
    category: "Analisis dan Pemeriksaan",
    explanation: "Memeriksa dan membuktikan kebenaran suatu fakta atau hipotesis.",
    charRoles: { "検": "memeriksa", "証": "membuktikan" }
  },
  {
    word: "検査", reading: "けんさ", meaning: "Pemeriksaan",
    category: "Analisis dan Pemeriksaan",
    explanation: "Proses pemeriksaan terhadap kondisi suatu benda atau kesehatan.",
    charRoles: { "検": "memeriksa", "査": "inspeksi" }
  },
  {
    word: "原因究明", reading: "げんいんきゅうめい", meaning: "Penyelidikan penyebab",
    category: "Analisis dan Pemeriksaan",
    explanation: "Menyelidiki sumber atau alasan terjadinya suatu masalah hingga terang benderang.",
    charRoles: { "原": "sumber", "因": "sebab", "究": "menyelidiki", "明": "terang" }
  },
];

// Additional constituent kanji metadata
const EXTRA_CONSTITUENT_KANJIS: Record<string, {
  romaji: string; meaning: string; baseMeaning: string; bushuu: string; onyomi: string; kunyomi: string;
}> = {
  "科": { romaji: "Ka", meaning: "Program Studi / Jurusan", baseMeaning: "Divisi, Jurusan, Cabang Ilmu", bushuu: "禾 (Gandum)", onyomi: "カ", kunyomi: "-" },
  "書": { romaji: "Sho", meaning: "Buku / Menulis", baseMeaning: "Buku, Dokumen, Menulis", bushuu: "曰 (Bicara)", onyomi: "ショ", kunyomi: "か.く" },
  "方": { romaji: "Hou", meaning: "Metode / Cara / Arah", baseMeaning: "Arah, Metode, Cara", bushuu: "方 (Arah)", onyomi: "ホウ", kunyomi: "かた" },
  "法": { romaji: "Hou", meaning: "Hukum / Metode", baseMeaning: "Aturan, Metode, Hukum", bushuu: "水 (Air)", onyomi: "ホウ, ハッ", kunyomi: "のり" },
  "分": { romaji: "Bun / Fun", meaning: "Bagian / Membagi", baseMeaning: "Bagian, Membagi, Menit", bushuu: "刀 (Pisau)", onyomi: "ブン, フン", kunyomi: "わ.かる, わ.ける" },
  "野": { romaji: "Ya / No", meaning: "Bidang / Lapangan", baseMeaning: "Lapangan, Bidang, Alam", bushuu: "里 (Desa)", onyomi: "ヤ", kunyomi: "の" },
  "討": { romaji: "Tou", meaning: "Membahas / Menyerang", baseMeaning: "Membahas, Meneliti, Membicarakan", bushuu: "言 (Bicara)", onyomi: "トウ", kunyomi: "う.つ" },
  "証": { romaji: "Shou", meaning: "Bukti / Verifikasi", baseMeaning: "Bukti, Saksi, Verifikasi", bushuu: "言 (Bicara)", onyomi: "ショウ", kunyomi: "あかし" },
  "査": { romaji: "Sa", meaning: "Memeriksa / Inspeksi", baseMeaning: "Inspeksi, Memeriksa, Penelitian", bushuu: "木 (Pohon)", onyomi: "サ", kunyomi: "-" },
  "原": { romaji: "Gen / Hara", meaning: "Sumber / Asal / Padang", baseMeaning: "Asal, Sumber, Padang", bushuu: "厂 (Tebing)", onyomi: "ゲン", kunyomi: "はら" },
  "因": { romaji: "In", meaning: "Sebab / Alasan", baseMeaning: "Alasan, Penyebab, Faktor", bushuu: "囗 (Pagar)", onyomi: "イン", kunyomi: "よ.る" },
  "明": { romaji: "Mei / Aka", meaning: "Terang / Jelas", baseMeaning: "Terang, Jelas, Memahami", bushuu: "日 (Matahari)", onyomi: "メイ, ミョウ", kunyomi: "あか.るい, あき.らか" },
};

// Cross-links between related jukugo cards for Kanji 研
const KEN_CROSS_LINKS: [string, string, string][] = [
  ["研究", "berlokasi di", "研究室"],
  ["研究", "dilakukan oleh", "研究者"],
  ["研究", "didiskusikan di", "研究会"],
  ["研究", "berada di bawah", "研究科"],
  ["研究", "didokumentasikan dalam", "研究書"],
  ["研究", "menggunakan", "研究方法"],
  ["研究", "berfokus pada", "研究分野"],
  ["研修", "diikuti oleh", "研修生"],
  ["研修", "diselenggarakan via", "研修会"],
  ["研修", "dilaksanakan melalui", "研修旅行"],
  ["研修", "diikuti oleh", "研修医"],
  ["研修", "diatur dalam", "研修制度"],
  ["研修", "bertempat di", "研修先"],
  ["研磨", "metode serupa", "研ぐ"],
  ["研磨", "menggunakan", "研石"],
  ["研磨", "metode serupa", "研削"],
  ["検討", "bertujuan", "検証"],
  ["検証", "melalui", "検査"],
  ["検証", "bertujuan", "原因究明"],
];

async function seedKanjiKenFull() {
  console.log("🚀 Starting Full Data Seeding for Kanji 研 (ID 3218)...");

  const kenKanji = await prisma.kanji.findUnique({ where: { character: "研" } });
  if (!kenKanji) {
    console.error("❌ Kanji 研 not found!");
    return;
  }

  // 1. Verify/Insert Extra Constituent Kanjis
  console.log("\n📌 1. Verifying Constituent Single Kanjis...");
  for (const [char, meta] of Object.entries(EXTRA_CONSTITUENT_KANJIS)) {
    const existing = await prisma.kanji.findUnique({ where: { character: char } });
    if (existing) {
      await prisma.kanji.update({
        where: { id: existing.id },
        data: {
          romaji: meta.romaji,
          meaning: meta.meaning,
          baseMeaning: meta.baseMeaning,
          bushuu: meta.bushuu,
          onyomi: meta.onyomi,
          kunyomi: meta.kunyomi,
        },
      });
      console.log(`  ✅ Updated constituent Kanji: ${char} (ID: ${existing.id})`);
    } else {
      const created = await prisma.kanji.create({
        data: {
          character: char,
          romaji: meta.romaji,
          meaning: meta.meaning,
          bushuu: meta.bushuu,
          onyomi: meta.onyomi,
          kunyomi: meta.kunyomi,
          baseMeaning: meta.baseMeaning,
          isJukugo: false,
          border: "border-slate-300",
          moduleId: null,
        },
      });
      console.log(`  ✅ Created constituent Kanji: ${char} (ID: ${created.id})`);
    }
  }

  // 2. MasterCategory & KategoriKanji & Jukugo
  console.log("\n📌 2. Seeding MasterCategory, Jukugo, and KategoriKanji...");
  const categoryMap = new Map<string, number>();

  for (const catData of CATEGORIES_DATA) {
    let cat = await prisma.masterCategory.findFirst({ where: { name: catData.name } });
    if (!cat) {
      cat = await prisma.masterCategory.create({
        data: {
          name: catData.name,
          description: catData.description,
        },
      });
      console.log(`  ✅ Created MasterCategory: ${catData.name}`);
    }
    categoryMap.set(catData.name, cat.id);
  }

  for (const item of JUKUGO_FULL_RESEARCH) {
    // Upsert Jukugo
    let jukugoObj = await prisma.jukugo.findFirst({
      where: { kanjiId: kenKanji.id, word: item.word },
    });

    if (jukugoObj) {
      jukugoObj = await prisma.jukugo.update({
        where: { id: jukugoObj.id },
        data: { reading: item.reading, meaning: item.meaning },
      });
    } else {
      jukugoObj = await prisma.jukugo.create({
        data: {
          kanjiId: kenKanji.id,
          word: item.word,
          reading: item.reading,
          meaning: item.meaning,
        },
      });
    }

    // Link to KategoriKanji
    const catId = categoryMap.get(item.category);
    if (catId) {
      const existingLink = await prisma.kategoriKanji.findFirst({
        where: { categoryId: catId, jokugoId: jukugoObj.id },
      });
      if (!existingLink) {
        await prisma.kategoriKanji.create({
          data: { categoryId: catId, jokugoId: jukugoObj.id },
        });
      }
    }
  }
  console.log(`  ✅ Processed ${JUKUGO_FULL_RESEARCH.length} Jukugo entries with category links.`);

  // 3. SemanticRelation
  console.log("\n📌 3. Seeding SemanticRelation for Kanji 研...");
  let semCount = 0;

  for (const item of JUKUGO_FULL_RESEARCH) {
    const chars = Array.from(item.word);
    const char1 = chars[0] || item.word;
    const char2 = chars[1] || "";
    const role1 = item.charRoles[char1] || "Peran 1";
    const role2 = item.charRoles[char2] || (item.charRoles[chars[2]] || "Peran 2");

    const existingSem = await prisma.semanticRelation.findFirst({
      where: { kanjiId: kenKanji.id, kanji: item.word },
    });

    if (existingSem) {
      await prisma.semanticRelation.update({
        where: { id: existingSem.id },
        data: {
          arti: item.meaning,
          jukugo_1: char1,
          jukugo_1_arti: role1,
          jukugo_2: char2,
          jukugo_2_arti: role2,
          penjelasan: item.explanation,
        },
      });
    } else {
      await prisma.semanticRelation.create({
        data: {
          kanjiId: kenKanji.id,
          kanji: item.word,
          arti: item.meaning,
          jukugo_1: char1,
          jukugo_1_arti: role1,
          jukugo_2: char2,
          jukugo_2_arti: role2,
          penjelasan: item.explanation,
        },
      });
    }
    semCount++;
  }
  console.log(`  ✅ Saved ${semCount} SemanticRelation entries for Kanji 研.`);

  // 4. KanjiGraphEdge
  console.log("\n📌 4. Seeding KanjiGraphEdge cross-links...");
  let edgeCount = 0;

  for (const triple of KEN_CROSS_LINKS) {
    const [srcWord, predicate, tgtWord] = triple;
    const edgeId = `cross-${kenKanji.id}-${srcWord}-${tgtWord}`;

    const existingEdge = await prisma.kanjiGraphEdge.findUnique({ where: { id: edgeId } });
    if (!existingEdge) {
      await prisma.kanjiGraphEdge.create({
        data: {
          id: edgeId,
          kanjiId: kenKanji.id,
          source: srcWord,
          target: tgtWord,
          predicate: predicate,
        },
      });
      edgeCount++;
    }
  }
  console.log(`  ✅ Saved ${edgeCount} KanjiGraphEdge cross-links for Kanji 研.`);

  console.log("\n🎉 Full Seeding for Kanji 研 Completed Successfully!");
}

seedKanjiKenFull()
  .catch((err) => console.error("❌ Seeding failed:", err))
  .finally(async () => await prisma.$disconnect());
