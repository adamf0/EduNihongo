import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 15 Jukugo for Kanji 究 (ID 3219)
const JUKUGO_KYUU_LIST = [
  { word: "究明", reading: "きゅうめい", meaning: "Penyelidikan menyeluruh" },
  { word: "究査", reading: "きゅうさ", meaning: "Penyelidikan secara mendalam" },
  { word: "究問", reading: "きゅうもん", meaning: "Penyelidikan terhadap satu perkara" },
  { word: "究理", reading: "きゅうり", meaning: "Menyelidiki atau mencari prinsip yang benar." },
  { word: "原因究明", reading: "げんいんきゅうめい", meaning: "Menyelidiki penyebab" },
  { word: "真相究明", reading: "しんそうきゅうめい", meaning: "Menyelidiki kebenaran suatu peristiwa" },
  { word: "事実究明", reading: "じじつきゅうめい", meaning: "Menyelidiki fakta" },
  { word: "問題究明", reading: "もんだいきゅうめい", meaning: "Menyelidiki atau memecahkan masalah" },
  { word: "研究科", reading: "けんきゅうか", meaning: "Program studi / Pascasarjana" },
  { word: "研究室", reading: "けんきゅうしつ", meaning: "Ruang penelitian" },
  { word: "研究書", reading: "けんきゅうしょ", meaning: "Buku penelitian" },
  { word: "研究方法", reading: "けんきゅうほうほう", meaning: "Metode penelitian" },
  { word: "探究心", reading: "たんきゅうしん", meaning: "Rasa ingin tahu yang tinggi" },
  { word: "学究心", reading: "がっきゅうしん", meaning: "Semangat mendalami ilmu" },
  { word: "深く究める", reading: "ふかくきわめる", meaning: "Mendalami ilmu sampai selesai" },
];

// Constituent single kanjis with complete metadata
const CONSTITUENT_KANJIS: Record<string, {
  romaji: string; meaning: string; baseMeaning: string; bushuu: string; onyomi: string; kunyomi: string;
}> = {
  "理": { romaji: "Ri", meaning: "Prinsip / Kebenaran / Alasan", baseMeaning: "Prinsip dasar, Kebenaran, Logika", bushuu: "玉 (Permata)", onyomi: "リ", kunyomi: "ことわり" },
  "真": { romaji: "Shin", meaning: "Kebenaran / Sungguh", baseMeaning: "Kebenaran, Asli, Fakta", bushuu: "目 (Mata)", onyomi: "シン", kunyomi: "ま, まこと" },
  "相": { romaji: "Sou", meaning: "Saling / Penampilan / Aspek", baseMeaning: "Saling, Aspek, Penampilan, Wajah", bushuu: "目 (Mata)", onyomi: "ソウ, ショウ", kunyomi: "あい" },
  "探": { romaji: "Tan", meaning: "Mencari / Menjelajah", baseMeaning: "Mencari, Menyelidiki, Menjelajah", bushuu: "手 (Tangan)", onyomi: "タン", kunyomi: "さが.す, さぐ.る" },
  "心": { romaji: "Shin", meaning: "Hati / Perasaan / Semangat", baseMeaning: "Hati, Pikiran, Semangat", bushuu: "心 (Hati)", onyomi: "シン", kunyomi: "こころ" },
  "学": { romaji: "Gaku", meaning: "Belajar / Ilmu", baseMeaning: "Belajar, Studi, Ilmu Pengetahuan", bushuu: "子 (Anak)", onyomi: "ガク", kunyomi: "まな.ぶ" },
  "深": { romaji: "Shin", meaning: "Dalam / Mendalam", baseMeaning: "Dalam, Mendalam, Intensif", bushuu: "水 (Air)", onyomi: "シン", kunyomi: "ふか.い, ふか.まる" },
};

async function seedJukugoKyuu() {
  console.log("🚀 Seeding Jukugo and Constituent Kanjis for Kanji 究 (ID 3219)...");

  const kyuuKanji = await prisma.kanji.findUnique({ where: { character: "究" } });
  if (!kyuuKanji) {
    console.error("❌ Kanji 究 not found in DB!");
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
          moduleId: null,
        },
      });
      console.log(`✅ Inserted new constituent Kanji: ${char} (ID: ${created.id})`);
    }
  }

  // 2. Insert/Update Jukugo records for Kanji 究
  let jukugoCount = 0;
  for (const item of JUKUGO_KYUU_LIST) {
    const existingJukugo = await prisma.jukugo.findFirst({
      where: { kanjiId: kyuuKanji.id, word: item.word },
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
          kanjiId: kyuuKanji.id,
          word: item.word,
          reading: item.reading,
          meaning: item.meaning,
        },
      });
    }
    jukugoCount++;
  }

  console.log(`✅ Successfully saved ${jukugoCount} Jukugo entries for Kanji 究!`);
}

seedJukugoKyuu()
  .catch((err) => console.error("❌ Seeding failed:", err))
  .finally(async () => await prisma.$disconnect());
