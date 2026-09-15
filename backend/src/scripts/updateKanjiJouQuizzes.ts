import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateJouQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '情' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 情 not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 情 (ID: ${kanji.id})...`);

  // Preserve grouping quiz if exists
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete non-grouping quizzes for kanji 情
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
      // Scrambled pool from prompt: でしょう・きれい・の・情景・は・写真：この
      words: JSON.stringify(['でしょう', 'きれい', 'の', '情景', 'は', '写真', 'この']),
      correctOrder: JSON.stringify(['この', '写真', 'の', '情景', 'は', 'きれい', 'でしょう']),
      correctAnswer: '0',
      explanation: 'Jawaban: この写真の情景はきれいでしょう。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 話す ・ 事情 ・ 先生 ・ を ・ んです ・ に
      words: JSON.stringify(['話す', '事情', '先生', 'を', 'んです', 'に']),
      correctOrder: JSON.stringify(['先生', 'に', '事情', 'を', '話す', 'んです']),
      correctAnswer: '0',
      explanation: 'Jawaban: 先生に事情を話すんです。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 集めて ・ 情報 ・ インターネット ・ を ・ おきます ・ で
      words: JSON.stringify(['集めて', '情報', 'インターネット', 'を', 'おきます', 'で']),
      correctOrder: JSON.stringify(['インターネット', 'で', '情報', 'を', '集めて', 'おきます']),
      correctAnswer: '0',
      explanation: 'Jawaban: インターネットで情報を集めておきます。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 明るい ・ 表情 ・ 先生 ・ を ・ しています ・ は ・ いつも
      words: JSON.stringify(['明るい', '表情', '先生', 'を', 'しています', 'は', 'いつも']),
      correctOrder: JSON.stringify(['先生', 'は', 'いつも', '明るい', '表情', 'を', 'しています']),
      correctAnswer: '0',
      explanation: 'Jawaban: 先生はいつも明るい表情をしています。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 出さない ・ 感情 ・ ほうが ・ を ・ いいです ・ あまり
      words: JSON.stringify(['出さない', '感情', 'ほうが', 'を', 'いいです', 'あまり']),
      correctOrder: JSON.stringify(['あまり', '感情', 'を', '出さない', 'ほうが', 'いいです']),
      correctAnswer: '0',
      explanation: 'Jawaban: あまり感情を出さないほうがいいです。'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna ”perasaan atau emosi seseorang”?',
      options: JSON.stringify(['情報', '感情', '事情', '苦情']),
      correctAnswer: '1', // b. 感情
      explanation: 'Jawaban tepat: b. 感情 (kanjou) - perasaan/emosi.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna ” keadaan atau alasan yang sebenarnya dalam suatu peristiwa”?',
      options: JSON.stringify(['愛情', '事情', '表情', '友情']),
      correctAnswer: '1', // b. 事情
      explanation: 'Jawaban tepat: b. 事情 (jijou) - keadaan/alasan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “pemandangan atau suasana yang terlihat dalam suatu keadaan”?',
      options: JSON.stringify(['愛情', '情熱', '情景', '同情']),
      correctAnswer: '2', // c. 情景
      explanation: 'Jawaban tepat: c. 情景 (joukei) - pemandangan/suasana.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna ” rasa simpati atau empati terhadap keadaan orang lain”?',
      options: JSON.stringify(['同情', '純情', '表情', '情報']),
      correctAnswer: '0', // a. 同情
      explanation: 'Jawaban tepat: a. 同情 (doujou) - simpati/empati.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan ” keluhan atau perasaan tidak puas terhadap sesuatu” ”?',
      options: JSON.stringify(['情報', '感情', '事情', '苦情']),
      correctAnswer: '3', // d. 苦情
      explanation: 'Jawaban tepat: d. 苦情 (kujou) - keluhan.'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '友達から日本の大学についていろいろな（　　　　）を教えてもらいました。',
      options: JSON.stringify(['情報', '情熱', '苦情']),
      correctAnswer: '0', // a. 情報
      explanation: 'Jawaban tepat: a. 情報 (jouhou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '人の（　　　　）を考えて、話したほうがいいです。',
      options: JSON.stringify(['感情', '情景', '情報']),
      correctAnswer: '0', // a. 感情
      explanation: 'Jawaban tepat: a. 感情 (kanjou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '田中さんは友達が困っているとき、いつも（　　　　）を感じています。',
      options: JSON.stringify(['情報', '情景', '同情']),
      correctAnswer: '2', // c. 同情
      explanation: 'Jawaban tepat: c. 同情 (doujou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'この写真を見ると、昔の日本の（　　　　）がよく分かります。',
      options: JSON.stringify(['情熱', '情景', '苦情']),
      correctAnswer: '1', // b. 情景
      explanation: 'Jawaban tepat: b. 情景 (joukei).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '彼は日本の歴史にとてもがあって、日本の文化に（　　　　）を持っています。',
      options: JSON.stringify(['情熱', '苦情', '表情']),
      correctAnswer: '0', // a. 情熱
      explanation: 'Jawaban tepat: a. 情熱 (jounetsu).'
    }
  ];

  for (const q of newQuizzes) {
    await prisma.quiz.create({
      data: q
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 情.`);
  if (groupingQuiz) {
    console.log(`Grouping quiz ID ${groupingQuiz.id} was retained intact.`);
  }

  await prisma.$disconnect();
}

updateJouQuizzes().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
