import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateJutsuQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '術' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 術 not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 術 (ID: ${kanji.id})...`);

  // Preserve grouping quiz if exists
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete non-grouping quizzes for kanji 術
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
      // Prompt 1: 書いてあります ・ 秘術が ・ 古い ・ 書物に
      words: JSON.stringify(['書いてあります', '秘術が', '古い', '書物に']),
      correctOrder: JSON.stringify(['古い', '書物に', '秘術が', '書いてあります']),
      correctAnswer: '0',
      explanation: 'Jawaban: 古い書物に秘術が書いてあります。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kalimat dari kata-kata berikut.',
      options: JSON.stringify([]),
      // Prompt 2: 変えよう・ 試合の ・ 思っています ・ 戦術を ・ と
      words: JSON.stringify(['変えよう', '試合の', '思っています', '戦術を', 'と']),
      correctOrder: JSON.stringify(['試合の', '戦術を', '変えよう', 'と', '思っています']),
      correctAnswer: '0',
      explanation: 'Jawaban: 試合の戦術を変えようと思っています。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kalimat dari kata-kata berikut.',
      options: JSON.stringify([]),
      // Prompt 3: 心術を ・ いいです ・ 正しい ・ 持った ・ ほうが
      words: JSON.stringify(['心術を', 'いいです', '正しい', '持った', 'ほうが']),
      correctOrder: JSON.stringify(['正しい', '心術を', '持った', 'ほうが', 'いいです']),
      correctAnswer: '0',
      explanation: 'Jawaban: 正しい心術を持ったほうがいいです。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kalimat dari kata-kata berikut.',
      options: JSON.stringify([]),
      // Prompt 4: 話術を ・ 先生の ・ メモします ・ 聞きながら
      words: JSON.stringify(['話術を', '先生の', 'メモします', '聞きながら']),
      correctOrder: JSON.stringify(['先生の', '話術を', '聞きながら', 'メモします']),
      correctAnswer: '0',
      explanation: 'Jawaban: 先生の話術を聞きながらメモします。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kalimat dari kata-kata berikut.',
      options: JSON.stringify([]),
      // Prompt 5: 病院で ・ ほうが ・ 手術を ・ 受けた ・ いいです
      words: JSON.stringify(['病院で', 'ほうが', '手術を', '受けた', 'いいです']),
      correctOrder: JSON.stringify(['病院で', '手術を', '受けた', 'ほうが', 'いいです']),
      correctAnswer: '0',
      explanation: 'Jawaban: 病院で手術を受けたほうがいいです。'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “teknik atau keterampilan untuk melakukan sesuatu”?',
      options: JSON.stringify(['技術', '学術', '美術']),
      correctAnswer: '0', // a. 技術
      explanation: 'Jawaban tepat: a. 技術 (gijutsu) - teknik/keterampilan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “tindakan medis yang dilakukan dengan teknik tertentu”?',
      options: JSON.stringify(['話術', '手術', '芸術']),
      correctAnswer: '1', // b. 手術
      explanation: 'Jawaban tepat: b. 手術 (shujutsu) - operasi medis.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “keterampilan dalam berbicara”?',
      options: JSON.stringify(['話術', '秘術', '算術']),
      correctAnswer: '0', // a. 話術
      explanation: 'Jawaban tepat: a. 話術 (wajutsu) - seni berbicara.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “teknik atau metode khusus yang dirahasiakan”?',
      options: JSON.stringify(['手術', '秘術', '技術']),
      correctAnswer: '1', // b. 秘術
      explanation: 'Jawaban tepat: b. 秘術 (hijutsu) - seni/teknik rahasia.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “ilmu atau bidang akademik”?',
      options: JSON.stringify(['学術', '美術', '話術']),
      correctAnswer: '0', // a. 学術
      explanation: 'Jawaban tepat: a. 学術 (gakujutsu) - bidang akademik.'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '日本語の（　　　　）をもっと勉強したいです。',
      options: JSON.stringify(['技術', '手術', '美術']),
      correctAnswer: '0', // a. 技術
      explanation: 'Jawaban tepat: a. 技術 (gijutsu).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '病院で（　　　　）を受けたんです。',
      options: JSON.stringify(['話術', '手術', '算術']),
      correctAnswer: '1', // b. 手術
      explanation: 'Jawaban tepat: b. 手術 (shujutsu).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '先生は学生に話す（　　　　）が上手です。',
      options: JSON.stringify(['話術', '秘術', '学術']),
      correctAnswer: '0', // a. 話術
      explanation: 'Jawaban tepat: a. 話術 (wajutsu).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '大学で日本の（　　　　）について研究しています。',
      options: JSON.stringify(['美術', '学術', '手術']),
      correctAnswer: '1', // b. 学術
      explanation: 'Jawaban tepat: b. 学術 (gakujutsu).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '私は日本の（　　　　）が好きです。美しい絵を見たいです。',
      options: JSON.stringify(['美術', '技術', '算術']),
      correctAnswer: '0', // a. 美術
      explanation: 'Jawaban tepat: a. 美術 (bijutsu).'
    }
  ];

  for (const q of newQuizzes) {
    await prisma.quiz.create({
      data: q
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 術.`);
  if (groupingQuiz) {
    console.log(`Grouping quiz ID ${groupingQuiz.id} was retained intact.`);
  }

  await prisma.$disconnect();
}

updateJutsuQuizzes().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
