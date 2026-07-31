import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const QUIZ_ITEMS_KEN = [
  // Section a: Unscramble (5 items)
  {
    type: "unscramble",
    question: "Susunlah kata-kata berikut menjadi kalimat yang tepat:\n来月 ・ んです ・ 行く ・ 研修旅行 ・ に",
    words: JSON.stringify(["来月", "研修旅行に", "行く", "んです"]),
    correctOrder: JSON.stringify(["来月", "研修旅行に", "行く", "んです"]),
    explanation: "Jawaban tepat: 来月研修旅行に行くんです。",
  },
  {
    type: "unscramble",
    question: "Susunlah kata-kata berikut menjadi kalimat yang tepat:\n新しい ・ 来ています ・ が ・ 研究者 ・ もう",
    words: JSON.stringify(["もう", "新しい", "研究者が", "来ています"]),
    correctOrder: JSON.stringify(["もう", "新しい", "研究者が", "来ています"]),
    explanation: "Jawaban tepat: もう新しい研究者が来ています。",
  },
  {
    type: "unscramble",
    question: "Susunlah kata-kata berikut menjadi kalimat yang tepat:\n本 ・ 調べます ・ 読みながら ・ を ・ 研究方法",
    words: JSON.stringify(["本を", "読みながら、", "研究方法を", "調べます"]),
    correctOrder: JSON.stringify(["本を", "読みながら、", "研究方法を", "調べます"]),
    explanation: "Jawaban tepat: 本を読みながら、研究方法を調べます。",
  },
  {
    type: "unscramble",
    question: "Susunlah kata-kata berikut menjadi kalimat yang tepat:\n資料 ・ 研修 ・ 準備して ・ をおきます ・ の ・ 前に",
    words: JSON.stringify(["研修の", "前に、", "資料を", "準備して", "おきます"]),
    correctOrder: JSON.stringify(["研修の", "前に、", "資料を", "準備して", "おきます"]),
    explanation: "Jawaban tepat: 研修の前に、資料を準備しておきます。",
  },
  {
    type: "unscramble",
    question: "Susunlah kata-kata berikut menjadi kalimat yang tepat:\n研究室 ・ に ・ カレンダー ・ はってあります ・ が ・ の ・ かべ",
    words: JSON.stringify(["研究室の", "かべに", "カレンダーが", "はってあります"]),
    correctOrder: JSON.stringify(["研究室の", "かべに", "カレンダーが", "はってあります"]),
    explanation: "Jawaban tepat: 研究室のかべにカレンダーがはってあります。",
  },

  // Section b: Grouping (1 item)
  {
    type: "grouping",
    question: "Kelompokkan jukugo berikut ini ke dalam cabang semantic graph yang tepat.",
    words: JSON.stringify([
      "研究", "研究室", "研究会", "研究者",
      "研修", "研修生", "研修旅行",
      "研究科", "研究書", "研究分野", "研究方法",
      "研ぐ", "研石", "研削", "研磨"
    ]),
    groups: JSON.stringify([
      { "Kegiatan Penelitian": ["研究", "研究室", "研究会", "研究者"] },
      { "Pelatihan dan Pengembangan": ["研修", "研修生", "研修旅行"] },
      { "Ilmu Pengetahuan dan Akademik": ["研究科", "研究書", "研究分野", "研究方法"] },
      { "Proses Mengasah dan Memperhalus": ["研磨", "研ぐ", "研石", "研削"] }
    ]),
    explanation: "Pengelompokan jukugo berdasarkan cabang semantic graph kanji 研.",
  },

  // Section c: Multiple Choice (5 items)
  {
    type: "multiple",
    question: "Jukugo mana yang berhubungan dengan \"kegiatan penelitian untuk memperoleh pengetahuan baru\"?",
    options: JSON.stringify(["研究", "研修", "研磨", "研石"]),
    correctAnswer: "0",
    explanation: "Jawaban tepat: a. 研究 (Penelitian)",
  },
  {
    type: "multiple",
    question: "Jukugo mana yang berhubungan dengan \"kegiatan pelatihan untuk meningkatkan pengetahuan atau keterampilan\"?",
    options: JSON.stringify(["研究者", "研究室", "研修", "研石"]),
    correctAnswer: "2",
    explanation: "Jawaban tepat: c. 研修 (Pelatihan)",
  },
  {
    type: "multiple",
    question: "Jukugo mana yang berhubungan dengan \"ruangan atau laboratorium yang digunakan untuk melakukan penelitian\"?",
    options: JSON.stringify(["研究科", "研究室", "研究会", "研究書"]),
    correctAnswer: "1",
    explanation: "Jawaban tepat: b. 研究室 (Ruang penelitian)",
  },
  {
    type: "multiple",
    question: "Jukugo mana yang berhubungan dengan \"menghaluskan atau memoles permukaan suatu benda\"?",
    options: JSON.stringify(["研修", "研究", "研磨", "研究方法"]),
    correctAnswer: "2",
    explanation: "Jawaban tepat: c. 研磨 (Mengasah / Memoles)",
  },
  {
    type: "multiple",
    question: "Jukugo mana yang berhubungan dengan \"orang yang melakukan penelitian\"?",
    options: JSON.stringify(["研究者", "研修生", "研究会", "研究科"]),
    correctAnswer: "0",
    explanation: "Jawaban tepat: a. 研究者 (Peneliti)",
  },

  // Section d: Fill in the blank (5 items)
  {
    type: "fill",
    question: "大学で新しいエネルギーについて（　　　　）をしています。",
    options: JSON.stringify(["研究", "研修", "研磨"]),
    correctAnswer: "0",
    explanation: "Jawaban tepat: 研究 (Penelitian)",
  },
  {
    type: "fill",
    question: "来月、新入社員は三日間の（　　　　）を受けます。",
    options: JSON.stringify(["研究", "研修", "研削"]),
    correctAnswer: "1",
    explanation: "Jawaban tepat: 研修 (Pelatihan)",
  },
  {
    type: "fill",
    question: "先生は午後ずっと（　　　　）で実験をしています。",
    options: JSON.stringify(["研究会", "研究書", "研究室"]),
    correctAnswer: "2",
    explanation: "Jawaban tepat: 研究室 (Ruang penelitian)",
  },
  {
    type: "fill",
    question: "包丁は（　　　　）でよく磨いてください。",
    options: JSON.stringify(["研石", "研究者", "研究科"]),
    correctAnswer: "0",
    explanation: "Jawaban tepat: 研石 (Batu asah)",
  },
  {
    type: "fill",
    question: "この本は日本語教育について書かれた（　　　　）です。",
    options: JSON.stringify(["研究会", "研究書", "研究方法"]),
    correctAnswer: "1",
    explanation: "Jawaban tepat: 研究書 (Buku penelitian)",
  },
];

async function seedQuizKen() {
  console.log("🚀 Seeding Quiz items for Kanji 研 (ID 3218)...");

  const kenKanji = await prisma.kanji.findUnique({ where: { character: "研" } });
  if (!kenKanji) {
    console.error("❌ Kanji 研 not found!");
    return;
  }

  // Delete existing quizzes for Kanji 研 to avoid duplicate entries
  await prisma.quiz.deleteMany({
    where: { kanjiId: kenKanji.id },
  });

  let count = 0;
  for (const item of QUIZ_ITEMS_KEN) {
    await prisma.quiz.create({
      data: {
        kanjiId: kenKanji.id,
        type: item.type,
        question: item.question,
        options: item.options || null,
        correctAnswer: item.correctAnswer || null,
        words: item.words || null,
        correctOrder: item.correctOrder || null,
        groups: item.groups || null,
        explanation: item.explanation || null,
      },
    });
    count++;
  }

  console.log(`✅ Successfully saved ${count} Quiz items for Kanji 研 (ID: ${kenKanji.id})!`);
}

seedQuizKen()
  .catch((err) => console.error("❌ Seeding failed:", err))
  .finally(async () => await prisma.$disconnect());
