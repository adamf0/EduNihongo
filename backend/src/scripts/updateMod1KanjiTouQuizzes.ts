import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateTouQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '答' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 答 (Module 1) not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 答 (ID: ${kanji.id})...`);

  // Preserve grouping quiz
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete non-grouping quizzes for kanji 答
  await prisma.quiz.deleteMany({
    where: {
      kanjiId: kanji.id,
      type: { not: 'grouping' }
    }
  });

  const newQuizzes = [
    // --- UNSCRAMBLE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 回答 ・ を ・ アンケート ・ の ・ 出してください
      words: JSON.stringify(['回答', 'を', 'アンケート', 'の', '出して下さい']),
      correctOrder: JSON.stringify(['アンケート', 'の', '回答', 'を', '出して下さい']),
      correctAnswer: '0',
      explanation: 'Jawaban: アンケートの回答を出して下さい。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 解答 ・ 見ない ・ ほうがいいです ・ を
      words: JSON.stringify(['解答', '見ない', 'ほうがいいです', 'を']),
      correctOrder: JSON.stringify(['解答', 'を', '見ない', 'ほうがいいです']),
      correctAnswer: '0',
      explanation: 'Jawaban: 解答を見ない方がいいです。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 返答 ・ まだ ・ メール ・ が ・ 来ていません ・ の
      words: JSON.stringify(['返答', 'まだ', 'メール', 'が', '来ていません', 'の']),
      correctOrder: JSON.stringify(['まだ', 'メール', 'の', '返答', 'が', '来ていません']),
      correctAnswer: '0',
      explanation: 'Jawaban: まだメールの返答が来ていません。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 口答 ・ 試験 ・ です ・ この ・ は
      words: JSON.stringify(['口答', '試験', 'です', 'この', 'は']),
      correctOrder: JSON.stringify(['この', '試験', 'は', '口答', 'です']),
      correctAnswer: '0',
      explanation: 'Jawaban: この試験は口答です。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 問答 ・ が ・ ありました ・ 先生 ・ と
      words: JSON.stringify(['問答', 'が', 'ありました', '先生', 'と']),
      correctOrder: JSON.stringify(['先生', 'と', '問答', 'が', 'ありました']),
      correctAnswer: '0',
      explanation: 'Jawaban: 先生と問答がありました。'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna "jawaban terhadap suatu pertanyaan atau permintaan informasi"?',
      options: JSON.stringify(['解答', '回答', '答案']),
      correctAnswer: '1', // b. 回答
      explanation: 'Jawaban tepat: b. 回答 (kaitou) - jawaban/tanggapan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna "lembar jawaban yang digunakan saat ujian"?',
      options: JSON.stringify(['正答', '問答', '答案']),
      correctAnswer: '2', // c. 答案
      explanation: 'Jawaban tepat: c. 答案 (touan) - lembar jawaban.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “memberikan jawaban secara langsung tanpa perantar”?',
      options: JSON.stringify(['筆答', '直答', '口答']),
      correctAnswer: '1', // b. 直答
      explanation: 'Jawaban tepat: b. 直答 (jikitou) - jawaban langsung.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “memberikan jawaban atau balasan kembali kepada orang lain”?',
      options: JSON.stringify(['応答', '返答', '答弁']),
      correctAnswer: '1', // b. 返答
      explanation: 'Jawaban tepat: b. 返答 (hentou) - balasan/jawaban.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “jawaban yang benar atau tepat”?',
      options: JSON.stringify(['正答', '確答', '解答']),
      correctAnswer: '0', // a. 正答
      explanation: 'Jawaban tepat: a. 正答 (seitou) - jawaban benar.'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '質問に正しく（　　　　）してください。',
      options: JSON.stringify(['回答', '答案', '自答']),
      correctAnswer: '0', // a. 回答
      explanation: 'Jawaban tepat: a. 回答 (kaitou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '試験が終わったら、（　　　　）をしてください。',
      options: JSON.stringify(['答弁', '答案', '応答']),
      correctAnswer: '1', // b. 答案
      explanation: 'Jawaban tepat: b. 答案 (touan).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'メールの（　　　　）が遅くなってしまいました。',
      options: JSON.stringify(['問答', '正答', '返答']),
      correctAnswer: '2', // c. 返答
      explanation: 'Jawaban tepat: c. 返答 (hentou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '電話をかけましたが、相手から（　　　　）がありませんでした。',
      options: JSON.stringify(['解答', '応答', '正答']),
      correctAnswer: '1', // b. 応答
      explanation: 'Jawaban tepat: b. 応答 (outou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '答えがわからないときは、すぐ（　　　　）を見ないほうがいいです。',
      options: JSON.stringify(['回答', '答礼', '解答']),
      correctAnswer: '2', // c. 解答
      explanation: 'Jawaban tepat: c. 解答 (kaitou).'
    }
  ];

  for (const q of newQuizzes) {
    await prisma.quiz.create({
      data: q
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 答.`);
  if (groupingQuiz) {
    console.log(`Grouping quiz ID ${groupingQuiz.id} was retained intact.`);
  }

  await prisma.$disconnect();
}

updateTouQuizzes().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
