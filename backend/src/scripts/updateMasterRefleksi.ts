import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const REFLEKSI_QUESTIONS: Record<number, { character: string; questions: string[] }> = {
  3212: {
    character: "試",
    questions: [
      "Apa makna dasar kanji 試 yang anda pahami?",
      "Jukugo mana yang mudah untuk di ingat? Mengapa?",
      "Apa perbedaan penggunaan 試飲、試着、dan 試作?",
      "Cabang semantic graph mana yang menurut anda paling mudah dipahami?",
      "Bagaimana cara anda mengingat hubungan makna antar jukugo yang mengandung kanji 試?",
    ],
  },
  3213: {
    character: "験",
    questions: [
      "Apa makna dasar kanji 験 yang anda pahami?",
      "Jukugo mana yang mudah untuk di ingat? Mengapa?",
      "Apa perbedaan penggunaan 体験、経験、dan 試験?",
      "Cabang semantic graph mana yang menurut anda paling mudah dipahami?",
      "Bagaimana cara anda mengingat hubungan makna antar jukugo yang mengandung kanji 験?",
    ],
  },
  3214: {
    character: "問",
    questions: [
      "Apa makna dasar kanji 問 yang anda pahami?",
      "Jukugo mana yang mudah untuk di ingat? Mengapa?",
      "Apa perbedaan penggunaan 問題、質問、dan 設問?",
      "Cabang semantic graph mana yang menurut anda paling mudah dipahami?",
      "Bagaimana cara anda mengingat hubungan makna antar jukugo yang mengandung kanji 問?",
    ],
  },
  3215: {
    character: "題",
    questions: [
      "Apa makna dasar kanji 題 yang anda pahami?",
      "Jukugo mana yang mudah untuk di ingat? Mengapa?",
      "Apa perbedaan penggunaan 課題、話題、dan 題名?",
      "Cabang semantic graph mana yang menurut anda paling mudah dipahami?",
      "Bagaimana cara anda mengingat hubungan makna antar jukugo yang mengandung kanji 題?",
    ],
  },
  3216: {
    character: "答",
    questions: [
      "Apa makna dasar kanji 答 yang anda pahami?",
      "Jukugo mana yang mudah untuk di ingat? Mengapa?",
      "Apa perbedaan penggunaan 回答、解答、dan 問答?",
      "Cabang semantic graph mana yang menurut anda paling mudah dipahami?",
      "Bagaimana cara anda mengingat hubungan makna antar jukugo yang mengandung kanji 答?",
    ],
  },
  3217: {
    character: "点",
    questions: [
      "Apa makna dasar kanji 点 yang anda pahami?",
      "Jukugo mana yang mudah untuk di ingat? Mengapa?",
      "Apa perbedaan penggunaan 要点、重点、dan 点数?",
      "Cabang semantic graph mana yang menurut anda paling mudah dipahami?",
      "Bagaimana cara anda mengingat hubungan makna antar jukugo yang mengandung kanji 点?",
    ],
  },
};

async function updateMasterRefleksi() {
  console.log("🛠 Updating MasterRefleksi questions in database...");

  for (const [kanjiIdStr, data] of Object.entries(REFLEKSI_QUESTIONS)) {
    const kanjiId = parseInt(kanjiIdStr, 10);

    // Delete existing MasterRefleksi rows for this kanji
    await prisma.masterRefleksi.deleteMany({
      where: { kanjiId },
    });

    // Create new MasterRefleksi questions
    for (const question of data.questions) {
      await prisma.masterRefleksi.create({
        data: {
          kanjiId,
          question,
        },
      });
    }

    console.log(`✅ Updated MasterRefleksi for Kanji ${data.character} (ID: ${kanjiId}) with 5 questions.`);
  }

  console.log("\n🎉 MasterRefleksi update completed successfully!");
}

updateMasterRefleksi()
  .catch((err) => console.error("❌ Update failed:", err))
  .finally(async () => await prisma.$disconnect());
