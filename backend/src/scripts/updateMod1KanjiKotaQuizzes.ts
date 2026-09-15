import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateKotaQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '答' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 答 (Module 1) not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 答 (ID: ${kanji.id})...`);

  // Preserve grouping quiz if exists
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
      // Prompt chips: 回答 ・ を ・ アンケート ・ の ・ 出してください (5 chips)
      words: JSON.stringify(['回答', 'を', 'アンケート', 'の', '出してください']),
      correctOrder: JSON.stringify(['アンケート', 'の', '回答', 'を', '出してください']),
      correctAnswer: '0',
      explanation: 'Jawaban: アンケートの回答を出して下さい。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Prompt chips: 解答 ・ 見ない ・ ほうがいいです ・ を (4 chips)
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
      // Prompt chips: 返答 ・ まだ ・ メール ・ が ・ 来ていません ・ の (6 chips)
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
      // Prompt chips: 口答 ・ 試験 ・ です ・ この ・ の ・ は
      words: JSON.stringify(['口答', '試験', 'です', 'この', 'の', 'は']),
      correctOrder: JSON.stringify(['この', '試験', 'は', '口答', 'です']),
      correctAnswer: '0',
      explanation: 'Jawaban: この試験は口答です。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Prompt chips: 問答 ・ が ・ ありました ・ 先生 ・ と (5 chips)
      words: JSON.stringify(['問答', 'が', 'ありました', '先生', 'と']),
      correctOrder: JSON.stringify(['先生', 'と', '問答', 'が', 'ありました']),
      correctAnswer: '0',
      explanation: 'Jawaban: 先生と問答がありました。'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna "jawaban atas pertanyaan/kuesioner"?',
      options: JSON.stringify(['回答', '解答', '口答']),
      correctAnswer: '0', // a. 回答
      explanation: 'Jawaban tepat: a. 回答 (kaitou) - jawaban kuesioner/permintaan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna "jawaban soal ujian/latihan"?',
      options: JSON.stringify(['正答', '解答', '返答']),
      correctAnswer: '1', // b. 解答
      explanation: 'Jawaban tepat: b. 解答 (kaitou) - jawaban ujian/soal.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna "jawaban lisan"?',
      options: JSON.stringify(['口答', '筆答', '直答']),
      correctAnswer: '0', // a. 口答
      explanation: 'Jawaban tepat: a. 口答 (koutou) - jawaban lisan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna "kegiatan tanya jawab"?',
      options: JSON.stringify(['自答', '問答', '答弁']),
      correctAnswer: '1', // b. 問答
      explanation: 'Jawaban tepat: b. 問答 (mondou) - tanya jawab.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna "jawaban yang benar"?',
      options: JSON.stringify(['正答', '確答', '答案']),
      correctAnswer: '0', // a. 正答
      explanation: 'Jawaban tepat: a. 正答 (seitou) - jawaban benar.'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'アンケートの（　　　　）をお願いします。',
      options: JSON.stringify(['回答', '解答', '答案']),
      correctAnswer: '0', // a. 回答
      explanation: 'Jawaban tepat: a. 回答 (kaitou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'テストの（　　　　）を配ります。',
      options: JSON.stringify(['返答', '解答', '問答']),
      correctAnswer: '1', // b. 解答
      explanation: 'Jawaban tepat: b. 解答 (kaitou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'メールの（　　　　）がまだ来ません。',
      options: JSON.stringify(['口答', '返答', '正答']),
      correctAnswer: '1', // b. 返答
      explanation: 'Jawaban tepat: b. 返答 (hentou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'この試験は筆記ではなく（　　　　）です。',
      options: JSON.stringify(['口答', '自答', '答辞']),
      correctAnswer: '0', // a. 口答
      explanation: 'Jawaban tepat: a. 口答 (koutou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '卒業式で（　　　　）を読みました。',
      options: JSON.stringify(['答礼', '答弁', '答辞']),
      correctAnswer: '2', // c. 答辞
      explanation: 'Jawaban tepat: c. 答辞 (touji).'
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

updateKotaQuizzes().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
