import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const REFLEKSI_QUESTIONS_KEN = [
  "Apa makna dasar kanji 研 yang anda pahami?",
  "Jukugo mana yang mudah untuk di ingat? Mengapa?",
  "Apa perbedaan penggunaan 研究科、研究者、dan 研究会?",
  "Cabang semantic graph mana yang menurut anda paling mudah dipahami?",
  "Bagaimana cara anda mengingat hubungan makna antar jukugo yang mengandung kanji 研?",
];

async function seedMasterRefleksiKen() {
  console.log("🚀 Seeding MasterRefleksi for Kanji 研 (ID 3218)...");

  const kenKanji = await prisma.kanji.findUnique({ where: { character: "研" } });
  if (!kenKanji) {
    console.error("❌ Kanji 研 not found!");
    return;
  }

  // Delete existing MasterRefleksi for Kanji 研 to avoid duplicates
  await prisma.masterRefleksi.deleteMany({
    where: { kanjiId: kenKanji.id },
  });

  let count = 0;
  for (const q of REFLEKSI_QUESTIONS_KEN) {
    await prisma.masterRefleksi.create({
      data: {
        kanjiId: kenKanji.id,
        question: q,
      },
    });
    count++;
  }

  console.log(`✅ Successfully saved ${count} MasterRefleksi questions for Kanji 研 (ID: ${kenKanji.id})!`);
}

seedMasterRefleksiKen()
  .catch((err) => console.error("❌ Seeding failed:", err))
  .finally(async () => await prisma.$disconnect());
