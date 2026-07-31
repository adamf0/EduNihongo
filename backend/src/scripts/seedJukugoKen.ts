import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 15 Jukugo for Kanji 研 (ID 3218)
const JUKUGO_KEN_LIST = [
  { word: "研究", reading: "けんきゅう", meaning: "Penelitian" },
  { word: "研究室", reading: "けんきゅうしつ", meaning: "Laboratorium/ruang penelitian" },
  { word: "研究者", reading: "けんきゅうしゃ", meaning: "Peneliti" },
  { word: "研究会", reading: "けんきゅうかい", meaning: "Kelompok atau forum penelitian" },
  { word: "研修", reading: "けんしゅう", meaning: "Pelatihan" },
  { word: "研修生", reading: "けんしゅうせい", meaning: "Peserta pelatihan" },
  { word: "研修会", reading: "けんしゅうかい", meaning: "Seminar atau kegiatan pelatihan" },
  { word: "研修旅行", reading: "けんしゅうりょこう", meaning: "Kunjungan atau perjalanan studi" },
  { word: "研磨", reading: "けんま", meaning: "Mengasah, memoles" },
  { word: "研ぐ", reading: "とぐ", meaning: "Mengasah" },
  { word: "研石", reading: "といし", meaning: "Batu asah" },
  { word: "研削", reading: "けんさく", meaning: "Menggiling" },
  { word: "研修医", reading: "けんしゅうい", meaning: "Dokter peserta pelatihan" },
  { word: "研修制度", reading: "けんしゅうせいど", meaning: "Sistem pelatihan" },
  { word: "研修先", reading: "けんしゅうさき", meaning: "Tempat pelatihan" },
];

// Constituent single kanjis with complete metadata
const CONSTITUENT_KANJIS: Record<string, {
  romaji: string;
  meaning: string;
  baseMeaning: string;
  bushuu: string;
  onyomi: string;
  kunyomi: string;
}> = {
  "究": { romaji: "Kyuu", meaning: "Mendalami / Meneliti", baseMeaning: "Menyelidiki hingga tuntas, mendalami ilmu", bushuu: "穴 (Lubang)", onyomi: "キュウ", kunyomi: "きわ.める" },
  "室": { romaji: "Shitsu", meaning: "Ruangan / Kamar", baseMeaning: "Ruangan, Kamar, Tempat", bushuu: "宀 (Atap)", onyomi: "シツ", kunyomi: "むろ" },
  "者": { romaji: "Sha", meaning: "Orang / Subjek", baseMeaning: "Orang, Pelaku, Subjek", bushuu: "老 (Orang Tua)", onyomi: "シャ", kunyomi: "もの" },
  "会": { romaji: "Kai", meaning: "Kumpulan / Pertemuan", baseMeaning: "Bertemu, Berkumpul, Asosiasi", bushuu: "人 (Manusia)", onyomi: "カイ, エ", kunyomi: "あ.う" },
  "修": { romaji: "Shuu", meaning: "Memperbaiki / Pelatihan", baseMeaning: "Membina, Memperbaiki, Belajar", bushuu: "人 (Manusia)", onyomi: "シュウ, シュ", kunyomi: "おさ.める" },
  "生": { romaji: "Sei", meaning: "Hidup / Siswa / Lahir", baseMeaning: "Hidup, Lahir, Siswa", bushuu: "生 (Hidup)", onyomi: "セイ, ショウ", kunyomi: "い.きる" },
  "旅": { romaji: "Ryo", meaning: "Perjalanan / Wisata", baseMeaning: "Bepergian, Wisata, Perjalanan", bushuu: "方 (Arah)", onyomi: "リョ", kunyomi: "たび" },
  "行": { romaji: "Kou", meaning: "Pergi / Melakukan", baseMeaning: "Pergi, Melakukan, Melaksanakan", bushuu: "行 (Melangkah)", onyomi: "コウ, ギョウ", kunyomi: "い.く, おこな.う" },
  "磨": { romaji: "Ma", meaning: "Menggosok / Mengasah", baseMeaning: "Menggosok, Mengasah, Memoles", bushuu: "麻 (Rami)", onyomi: "マ", kunyomi: "みが.く" },
  "石": { romaji: "Seki", meaning: "Batu", baseMeaning: "Batu, Mineral", bushuu: "石 (Batu)", onyomi: "セキ", kunyomi: "いし" },
  "削": { romaji: "Saku", meaning: "Mengikis / Memotong", baseMeaning: "Mengikis, Memotong, Menggiling", bushuu: "刀 (Pisau)", onyomi: "サク", kunyomi: "けず.る" },
  "医": { romaji: "I", meaning: "Kedokteran / Dokter", baseMeaning: "Pengobatan, Kedokteran, Dokter", bushuu: "匚 (Kotak)", onyomi: "イ", kunyomi: "い.する" },
  "制": { romaji: "Sei", meaning: "Sistem / Aturan", baseMeaning: "Aturan, Kontrol, Sistem", bushuu: "刀 (Pisau)", onyomi: "セイ", kunyomi: "せい.する" },
  "度": { romaji: "Do", meaning: "Tingkat / Sistem", baseMeaning: "Tingkat, Ukuran, Sistem, Frekuensi", bushuu: "广 (Rumah)", onyomi: "ド, ト", kunyomi: "たび" },
  "先": { romaji: "Sen", meaning: "Dahulu / Tempat Tujuan", baseMeaning: "Awal, Ujung, Tempat Tujuan", bushuu: "儿 (Kaki)", onyomi: "セン", kunyomi: "さき" },
};

async function seedJukugoKen() {
  console.log("🚀 Seeding Jukugo and Constituent Kanjis for Kanji 研 (ID 3218)...");

  // Get Kanji 研
  const kenKanji = await prisma.kanji.findUnique({ where: { character: "研" } });
  if (!kenKanji) {
    console.error("❌ Kanji 研 not found in DB!");
    return;
  }

  // 1. Verify/Insert constituent single kanjis
  for (const [char, meta] of Object.entries(CONSTITUENT_KANJIS)) {
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
      console.log(`✅ Verified/Updated constituent Kanji: ${char} (ID: ${existing.id})`);
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
          moduleId: null, // constituent kanji gets null
        },
      });
      console.log(`✅ Inserted new constituent Kanji: ${char} (ID: ${created.id})`);
    }
  }

  // 2. Insert/Update Jukugo records
  let jukugoCount = 0;
  for (const item of JUKUGO_KEN_LIST) {
    const existingJukugo = await prisma.jukugo.findFirst({
      where: { kanjiId: kenKanji.id, word: item.word },
    });

    if (existingJukugo) {
      await prisma.jukugo.update({
        where: { id: existingJukugo.id },
        data: {
          reading: item.reading,
          meaning: item.meaning,
        },
      });
    } else {
      await prisma.jukugo.create({
        data: {
          kanjiId: kenKanji.id,
          word: item.word,
          reading: item.reading,
          meaning: item.meaning,
        },
      });
    }
    jukugoCount++;
  }

  console.log(`✅ Successfully saved ${jukugoCount} Jukugo entries for Kanji 研!`);
}

seedJukugoKen()
  .catch((err) => console.error("❌ Seeding failed:", err))
  .finally(async () => await prisma.$disconnect());
