import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const EXAMPLE_SENTENCES_KEN = [
  {
    japanese: "研究室の テーブルに 新しい パソコンが おいてあります。",
    romaji: "Kenkyuushitsu no teeburu ni atarashii pasokon ga oite arimasu.",
    translation: "Di meja ruang penelitian ada komputer baru yang diletakkan.",
    isReading: false,
  },
  {
    japanese: "研修生は 先生の 話を 聞きながら メモを とります。",
    romaji: "Kenshuusei wa sensei no hanashi o kikanagara memo o torimasu.",
    translation: "Peserta pelatihan mencatat sambil mendengarkan penjelasan guru.",
    isReading: false,
  },
  {
    japanese: "あの 研究者は 毎日 10時間 勉強するんです。",
    romaji: "Ano kenkyuusha wa mainichi juujikan benkyou suru ndesu.",
    translation: "Peneliti itu belajar selama 10 jam setiap hari.",
    isReading: false,
  },
  {
    japanese: "来月の 研修旅行の チケットを 買って おきます。",
    romaji: "Raigetsu no kenshuuryokou no chiketto o katte okimasu.",
    translation: "Saya akan membeli tiket perjalanan studi bulan depan terlebih dahulu.",
    isReading: false,
  },
  {
    japanese: "図書室で いい 研究方法が 見つかりました。",
    romaji: "Toshoshitsu de ii kenkyuuhouhou ga mitsukarimashita.",
    translation: "Metode penelitian yang bagus telah ditemukan di ruang perpustakaan.",
    isReading: false,
  },
];

async function seedExampleSentenceKen() {
  console.log("🚀 Seeding ExampleSentence for Kanji 研 (ID 3218)...");

  const kenKanji = await prisma.kanji.findUnique({ where: { character: "研" } });
  if (!kenKanji) {
    console.error("❌ Kanji 研 not found!");
    return;
  }

  // Delete old example sentences for Kanji 研 to avoid duplicates
  await prisma.exampleSentence.deleteMany({
    where: { kanjiId: kenKanji.id },
  });

  let count = 0;
  for (const s of EXAMPLE_SENTENCES_KEN) {
    await prisma.exampleSentence.create({
      data: {
        kanjiId: kenKanji.id,
        japanese: s.japanese,
        romaji: s.romaji,
        translation: s.translation,
        isReading: s.isReading,
      },
    });
    count++;
  }

  console.log(`✅ Successfully saved ${count} ExampleSentence records for Kanji 研 (ID: ${kenKanji.id})!`);
}

seedExampleSentenceKen()
  .catch((err) => console.error("❌ Seeding failed:", err))
  .finally(async () => await prisma.$disconnect());
