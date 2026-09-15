import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateGiQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '議' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 議 not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 議 (ID: ${kanji.id})...`);

  // Preserve grouping quiz if exists
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete non-grouping quizzes for kanji 議
  await prisma.quiz.deleteMany({
    where: {
      kanjiId: kanji.id,
      type: { not: 'grouping' }
    }
  });

  const newQuizzes = [
    // --- UNSCRAMBLE QUIZZES (5) ---
    // Header from prompt: Susunlah kata-kata berikut ini menjadi kalimat yang benar.
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Prompt 1: 議論するのは ・ 面白いです ・ 友だちと
      words: JSON.stringify(['議論するのは', '面白いです', '友だちと']),
      correctOrder: JSON.stringify(['友だちと', '議論するのは', '面白いです']),
      correctAnswer: '0',
      explanation: 'Jawaban: 友だちと議論するのは面白いです。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Prompt 2: 前に・出しておきます ・ 議案を ・ 会議の
      words: JSON.stringify(['前に', '出しておきます', '議案を', '会議の']),
      correctOrder: JSON.stringify(['会議の', '前に', '議案を', '出しておきます']),
      correctAnswer: '0',
      explanation: 'Jawaban: 会議の前に議案を出しておきます。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Prompt 3: 始まるでしょう ・ 来月 ・ 議会が
      words: JSON.stringify(['始まるでしょう', '来月', '議会が']),
      correctOrder: JSON.stringify(['来月', '議会が', '始まるでしょう']),
      correctAnswer: '0',
      explanation: 'Jawaban: 来月議会が始まるでしょう'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Prompt 4: 異議が ・ 出るかもしれません ・ 新しい ・ 計画に
      words: JSON.stringify(['異議が', '出るかもしれません', '新しい', '計画に']),
      correctOrder: JSON.stringify(['計画に', '新しい', '異議が', '出るかもしれません']),
      correctAnswer: '0',
      explanation: 'Jawaban: 計画に新しい異議が出るかもしれません。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Prompt 5: 和議を ・ 思っています ・ と ・ 結ぼう
      words: JSON.stringify(['和議を', '思っています', 'と', '結ぼう']),
      correctOrder: JSON.stringify(['和議を', '結ぼう', 'と', '思っています']),
      correctAnswer: '0',
      explanation: 'Jawaban: 和議を結ぼうと思っています。'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “rapat atau pertemuan untuk membahas suatu hal”?',
      options: JSON.stringify(['会議', '議員', '議題']),
      correctAnswer: '0', // a. 会議
      explanation: 'Jawaban tepat: a. 会議 (kaigi) - rapat/pertemuan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “diskusi atau perdebatan mengenai suatu hal”?',
      options: JSON.stringify(['議長', '議論', '議事']),
      correctAnswer: '1', // b. 議論
      explanation: 'Jawaban tepat: b. 議論 (giron) - diskusi/perdebatan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “keputusan yang telah ditetapkan secara resmi”?',
      options: JSON.stringify(['決議', '発議', '異議']),
      correctAnswer: '0', // a. 決議
      explanation: 'Jawaban tepat: a. 決議 (ketsugi) - keputusan resmi.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “orang yang menjadi anggota dewan atau parlemen”?',
      options: JSON.stringify(['議長', '議員', '議事']),
      correctAnswer: '1', // b. 議員
      explanation: 'Jawaban tepat: b. 議員 (giin) - anggota dewan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “topik atau agenda yang dibahas dalam rapat”?',
      options: JSON.stringify(['議題', '議決', '争議']),
      correctAnswer: '0', // a. 議題
      explanation: 'Jawaban tepat: a. 議題 (gidai) - topik/agenda.'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '来週、先生と学生の代表が（　　　）をする予定です。',
      options: JSON.stringify(['会議', '議員', '議題']),
      correctAnswer: '0', // a. 会議
      explanation: 'Jawaban tepat: a. 会議 (kaigi).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'この問題について、みんなで（　　　）したほうがいいでしょう。',
      options: JSON.stringify(['議題', '議論', '議員']),
      correctAnswer: '1', // b. 議論
      explanation: 'Jawaban tepat: b. 議論 (giron).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '今日の（　　　）は「日本語の勉強方法」です。',
      options: JSON.stringify(['議題', '議決', '議員']),
      correctAnswer: '0', // a. 議題
      explanation: 'Jawaban tepat: a. 議題 (gidai).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '国会で働いている人を（　　　）といいます。',
      options: JSON.stringify(['会議', '決議', '議員']),
      correctAnswer: '2', // c. 議員
      explanation: 'Jawaban tepat: c. 議員 (giin).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '会議で大切なことについてみんなで話したあとで、（　　　）が行われました。',
      options: JSON.stringify(['議論', '議題', '決議']),
      correctAnswer: '2', // c. 決議
      explanation: 'Jawaban tepat: c. 決議 (ketsugi).'
    }
  ];

  for (const q of newQuizzes) {
    await prisma.quiz.create({
      data: q
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 議.`);
  if (groupingQuiz) {
    console.log(`Grouping quiz ID ${groupingQuiz.id} was retained intact.`);
  }

  await prisma.$disconnect();
}

updateGiQuizzes().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
