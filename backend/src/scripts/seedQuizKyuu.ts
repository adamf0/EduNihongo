import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const QUIZ_ITEMS_KYUU = [
  // a) Unscramble (5 items)
  {
    type: "unscramble",
    question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
    words: JSON.stringify(["に", "絵", "はってあります", "が", "の", "かべ", "教室"]),
    correctOrder: JSON.stringify(["教室", "の", "かべ", "に", "絵", "が", "はってあります"]),
    targetWord: "教室のかべに絵がはってあります。",
    explanation: "Jawaban tepat: 教室のかべに絵がはってあります。"
  },
  {
    type: "unscramble",
    question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
    words: JSON.stringify(["本", "から", "です", "研究したい", "かりたい", "を", "もっと"]),
    correctOrder: JSON.stringify(["もっと", "研究したい", "から", "本", "を", "かりたい", "です"]),
    targetWord: "もっと研究したいから、本をかりたいです。",
    explanation: "Jawaban tepat: もっと研究したいから、本をかりたいです。"
  },
  {
    type: "unscramble",
    question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
    words: JSON.stringify(["研究会", "出て", "先生", "います", "を", "は"]),
    correctOrder: JSON.stringify(["先生", "は", "研究会", "を", "出て", "います"]),
    targetWord: "先生は研究会を出ています。",
    explanation: "Jawaban tepat: 先生は研究会を出ています。"
  },
  {
    type: "unscramble",
    question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
    words: JSON.stringify(["が", "説明して", "先生", "くれました", "研究方法を"]),
    correctOrder: JSON.stringify(["先生", "が", "研究方法を", "説明して", "くれました"]),
    targetWord: "先生が研究方法を説明してくれました",
    explanation: "Jawaban tepat: 先生が研究方法を説明してくれました"
  },
  {
    type: "unscramble",
    question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
    words: JSON.stringify(["あります", "大学", "が", "研究会", "来週", "に"]),
    correctOrder: JSON.stringify(["来週", "大学", "に", "研究会", "が", "あります"]),
    targetWord: "来週大学に研究会があります。",
    explanation: "Jawaban tepat: 来週大学に研究会があります。"
  },

  // b) Grouping (1 item)
  {
    type: "grouping",
    question: "Kelompokkan jukugo berikut ini ke dalam cabang semantic graph yang tepat.",
    words: JSON.stringify([
      "究明", "究査", "究問",
      "原因究明", "真相究明", "事実究明", "問題究明",
      "研究科", "研究室", "研究書", "研究方法",
      "探究心", "学究心", "深く究める",
      "究理", "本質究明", "結論究明", "究極"
    ]),
    groups: JSON.stringify([
      { "Penelitian dan Penyelidikan": ["究明", "究査", "究問"] },
      { "Pencarian Penyebab": ["原因究明", "真相究明", "事実究明", "問題究明"] },
      { "Akademik dan Ilmiah": ["研究科", "研究室", "研究書", "研究方法"] },
      { "Pendalaman Ilmu": ["探究心", "学究心", "深く究める"] },
      { "Hasil dan Pemahaman": ["究理", "本質究明", "結論究明", "究極"] }
    ]),
    explanation: "Pengelompokan jukugo berdasarkan cabang semantic graph kanji 究."
  },

  // c) Multiple Choice (5 items)
  {
    type: "multiple",
    question: "Jukugo apa yang berhubungan dengan “mencari kebenaran dibalik suatu peristiwa”?",
    options: JSON.stringify(["研究室", "究明", "探究心", "研究書"]),
    correctAnswer: "1",
    explanation: "Jawaban tepat: b. 究明"
  },
  {
    type: "multiple",
    question: "Jukugo apa yang berhubungan dengan \"mengidentifikasi sumber masalah dari suatu kejadian\"?",
    options: JSON.stringify(["学究心", "深く究める", "原因究明", "研究科"]),
    correctAnswer: "2",
    explanation: "Jawaban tepat: c. 原因究明"
  },
  {
    type: "multiple",
    question: "Jukugo apa yang berhubungan dengan \"program studi yang berfokus pada riset/penelitian\"?",
    options: JSON.stringify(["研究書", "研究科", "究査", "真相究明"]),
    correctAnswer: "1",
    explanation: "Jawaban tepat: b. 研究科"
  },
  {
    type: "multiple",
    question: "Jukugo apa yang berhubungan dengan \"semangat yang tinggi untuk menggali ilmu pengetahuan\"?",
    options: JSON.stringify(["究理", "研究方法", "探究心", "真相究明"]),
    correctAnswer: "2",
    explanation: "Jawaban tepat: c. 探究心"
  },
  {
    type: "multiple",
    question: "Jukugo apa yang berhubungan dengan \"cara atau prosedur yang digunakan dalam melaksanakan penelitian\"?",
    options: JSON.stringify(["究明", "学究心", "研究方法", "研究書"]),
    correctAnswer: "2",
    explanation: "Jawaban tepat: c. 研究方法"
  },

  // d) Fill in the blank (5 items)
  {
    type: "fill",
    question: "警察は事件の原因を調べるために（　　　　）を続けています。",
    options: JSON.stringify(["原因究明", "研究室", "研究科"]),
    correctAnswer: "0",
    explanation: "Jawaban tepat: 原因究明"
  },
  {
    type: "fill",
    question: "この大学には最新の設備を備えた（　　　　）があります。",
    options: JSON.stringify(["研究書", "研究室", "探究心"]),
    correctAnswer: "1",
    explanation: "Jawaban tepat: 研究室"
  },
  {
    type: "fill",
    question: "この本は日本語教育について書かれた有名な（　　　　）です。",
    options: JSON.stringify(["研究書", "研究室", "究明"]),
    correctAnswer: "0",
    explanation: "Jawaban tepat: 研究書"
  },
  {
    type: "fill",
    question: "学生たちは卒業論文のために新しい（　　　　）を学びました。",
    options: JSON.stringify(["研究方法", "探究心", "究極"]),
    correctAnswer: "0",
    explanation: "Jawaban tepat: 研究方法"
  },
  {
    type: "fill",
    question: "良い研究者になるためには、強い（　　　　）が必要です。",
    options: JSON.stringify(["研究方法", "学究心", "結論究明"]),
    correctAnswer: "1",
    explanation: "Jawaban tepat: 学究心"
  }
];

export async function seedQuizKyuu() {
  const kanji = await prisma.kanji.findFirst({ where: { character: "究" } });
  if (!kanji) {
    console.error("Kanji 究 not found");
    return;
  }

  await prisma.quiz.deleteMany({ where: { kanjiId: kanji.id } });

  for (const q of QUIZ_ITEMS_KYUU) {
    await prisma.quiz.create({
      data: {
        kanjiId: kanji.id,
        type: q.type,
        question: q.question,
        options: q.options || null,
        correctAnswer: q.correctAnswer || null,
        words: q.words || null,
        correctOrder: q.correctOrder || null,
        targetWord: q.targetWord || null,
        groups: q.groups || null,
        explanation: q.explanation || null
      }
    });
  }
  console.log(`✅ Seeded ${QUIZ_ITEMS_KYUU.length} Quiz records for Kanji 究.`);
}
