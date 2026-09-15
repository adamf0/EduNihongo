import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateKiQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '期' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 期 not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 期 (ID: ${kanji.id}, Module: ${kanji.moduleId})...`);

  // Preserve grouping quiz if exists
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete non-grouping quizzes for kanji 期
  await prisma.quiz.deleteMany({
    where: {
      kanjiId: kanji.id,
      type: { not: 'grouping' }
    }
  });

  const newQuizzes = [
    // --- UNSCRAMBLE QUIZZES (5) ---
    // Header from prompt: Susunlah kalimat dari kata-kata berikut.
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kalimat dari kata-kata berikut.',
      options: JSON.stringify([]),
      // Prompt 1: 思っています・短期留学を ・ と ・ しよう
      words: JSON.stringify(['思っています', '短期留学を', 'と', 'しよう']),
      correctOrder: JSON.stringify(['短期留学を', 'しよう', 'と', '思っています']),
      correctAnswer: '0',
      explanation: 'Jawaban: 短期留学をしようと思っています。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kalimat dari kata-kata berikut.',
      options: JSON.stringify([]),
      // Prompt 2: たてておきます・前に・長期計画を
      words: JSON.stringify(['たてておきます', '前に', '長期計画を']),
      correctOrder: JSON.stringify(['前に', '長期計画を', 'たてておきます']),
      correctAnswer: '0',
      explanation: 'Jawaban: 前に長期計画をたてておきます。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kalimat dari kata-kata berikut.',
      options: JSON.stringify([]),
      // Prompt 3: いいです・初期に・ほうが・治した・病気を
      words: JSON.stringify(['いいです', '初期に', 'ほうが', '治した', '病気を']),
      correctOrder: JSON.stringify(['初期に', '病気を', '治した', 'ほうが', 'いいです']),
      correctAnswer: '0',
      explanation: 'Jawaban: 初期に病気を治したほうがいいです。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kalimat dari kata-kata berikut.',
      options: JSON.stringify([]),
      // Prompt 4: 期日が・書いてあります・書類に
      words: JSON.stringify(['期日が', '書いてあります', '書類に']),
      correctOrder: JSON.stringify(['書類に', '期日が', '書いてあります']),
      correctAnswer: '0',
      explanation: 'Jawaban: 書類に期日が書いてあります。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kalimat dari kata-kata berikut.',
      options: JSON.stringify([]),
      // Prompt 5: 大変・期末テストを・です・受けるのは
      words: JSON.stringify(['大変', '期末テストを', 'です', '受けるのは']),
      correctOrder: JSON.stringify(['期末テストを', '受けるのは', '大変', 'です']),
      correctAnswer: '0',
      explanation: 'Jawaban: 期末テストを受けるのは大変です。'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “waktu atau periode tertentu”?',
      options: JSON.stringify(['定期', '時期', '期間']),
      correctAnswer: '1', // b. 時期
      explanation: 'Jawaban tepat: b. 時期 (jiki) - waktu/periode tertentu.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “jangka atau rentang waktu”?',
      options: JSON.stringify(['期間', '時期', '周期']),
      correctAnswer: '0', // a. 期間
      explanation: 'Jawaban tepat: a. 期間 (kikan) - jangka/rentang waktu.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “periode atau jangka waktu yang panjang”?',
      options: JSON.stringify(['短期', '定期', '長期']),
      correctAnswer: '2', // c. 長期
      explanation: 'Jawaban tepat: c. 長期 (chouki) - jangka panjang.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “periode atau jangka waktu yang pendek”?',
      options: JSON.stringify(['初期', '短期', '長期']),
      correctAnswer: '1', // b. 短期
      explanation: 'Jawaban tepat: b. 短期 (tanki) - jangka pendek.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “periode tertentu dalam kegiatan pendidikan atau semester”?',
      options: JSON.stringify(['時期', '学期', '会期']),
      correctAnswer: '1', // b. 学期
      explanation: 'Jawaban tepat: b. 学期 (gakki) - semester/periode pendidikan.'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '大学の（　　　）は4月から始まります。',
      options: JSON.stringify(['学期', '長期', '期日']),
      correctAnswer: '0', // a. 学期
      explanation: 'Jawaban tepat: a. 学期 (gakki).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '夏休みは（　　　）の旅行をする予定です。',
      options: JSON.stringify(['長期', '短期', '定期']),
      correctAnswer: '0', // a. 長期
      explanation: 'Jawaban tepat: a. 長期 (chouki).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'この仕事は（　　　）で終わるでしょう。',
      options: JSON.stringify(['周期', '短期', '学期']),
      correctAnswer: '1', // b. 短期
      explanation: 'Jawaban tepat: b. 短期 (tanki).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'この電車は（　　　）に運行されています。',
      options: JSON.stringify(['末期', '初期', '定期']),
      correctAnswer: '2', // c. 定期
      explanation: 'Jawaban tepat: c. 定期 (teiki).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '日本語の勉強を始めた（　　　）は、漢字があまり読めませんでした。',
      options: JSON.stringify(['前期', '初期', '後期']),
      correctAnswer: '1', // b. 初期
      explanation: 'Jawaban tepat: b. 初期 (shoki).'
    }
  ];

  for (const q of newQuizzes) {
    await prisma.quiz.create({
      data: q
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 期.`);
  if (groupingQuiz) {
    console.log(`Grouping quiz ID ${groupingQuiz.id} was retained intact.`);
  }

  await prisma.$disconnect();
}

updateKiQuizzes().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
