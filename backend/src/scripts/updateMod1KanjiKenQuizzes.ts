import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateKenQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '験' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 験 (Module 1) not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 験 (ID: ${kanji.id})...`);

  // Preserve grouping quiz
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete non-grouping quizzes for kanji 験
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
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      words: JSON.stringify(['明日', '試験が', 'あるから', '勉強します']),
      correctOrder: JSON.stringify(['明日', '試験が', 'あるから', '勉強します。']),
      correctAnswer: '0',
      explanation: 'Jawaban: 明日、試験があるから、勉強します。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      words: JSON.stringify(['経験', '働いたが', 'あります', '日本で']),
      correctOrder: JSON.stringify(['日本で', '働いた', '経験が', 'あります。']),
      correctAnswer: '0',
      explanation: 'Jawaban: 日本で働いた経験があります。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      words: JSON.stringify(['文化を', '体験しました', '京都で']),
      correctOrder: JSON.stringify(['京都で', '文化を', '体験しました。']),
      correctAnswer: '0',
      explanation: 'Jawaban: 京都で文化を体験しました。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      words: JSON.stringify(['実験を', '料理室で', 'しました']),
      correctOrder: JSON.stringify(['料理室で', '実験を', 'しました。']),
      correctAnswer: '0',
      explanation: 'Jawaban: 料理室で実験をしました。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      words: JSON.stringify(['受検しようと', '日本語の', '思っています', '試験を']),
      correctOrder: JSON.stringify(['日本語の', '試験を', '受検しようと', '思っています。']),
      correctAnswer: '0',
      explanation: 'Jawaban: 日本語の試験を受検しようと思っています。'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna percobaan?',
      options: JSON.stringify(['実験', '体験', '試験']),
      correctAnswer: '0', // a. 実験
      explanation: 'Jawaban tepat: a. 実験 (jikken) - percobaan/eksperimen.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “efek atau khasiat yang menunjukkan suatu hasil"?',
      options: JSON.stringify(['治験', '効験', '実験']),
      correctAnswer: '1', // b. 効験
      explanation: 'Jawaban tepat: b. 効験 (kouken) - efek atau khasiat.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “pengalaman yang diperoleh dari sesuatu yang telah dijalani"?',
      options: JSON.stringify(['実験', '経験', '験算']),
      correctAnswer: '1', // b. 経験
      explanation: 'Jawaban tepat: b. 経験 (keiken) - pengalaman.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “uji klinis untuk mengetahui efektivitas dan keamanan obat"?',
      options: JSON.stringify(['体験', '試験', '治験']),
      correctAnswer: '2', // c. 治験
      explanation: 'Jawaban tepat: c. 治験 (chiken) - uji klinis.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “mengikuti atau menjalani suatu ujian"?',
      options: JSON.stringify(['受験', '効験', '体験']),
      correctAnswer: '0', // a. 受験
      explanation: 'Jawaban tepat: a. 受験 (juken) - mengikuti ujian.'
    },

    // --- FILL IN THE BLANK QUIZZES (4) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '日本へいって、色々な（　　　　）をしました。',
      options: JSON.stringify(['実験', '経験', '被験者']),
      correctAnswer: '1', // b. 経験
      explanation: 'Jawaban tepat: b. 経験 (keiken).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '大学の化学の授業では、学生が（　　　　）を行いました。',
      options: JSON.stringify(['実験', '体験', '受験']),
      correctAnswer: '0', // a. 実験
      explanation: 'Jawaban tepat: a. 実験 (jikken).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '明日は大切な（　　　　）がありますから、今晩勉強しなければなりません。',
      options: JSON.stringify(['経験', '試験', '体験']),
      correctAnswer: '1', // b. 試験
      explanation: 'Jawaban tepat: b. 試験 (shiken).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'この薬には（　　　　）があるかもしれません。',
      options: JSON.stringify(['受験', '試験', '効験']),
      correctAnswer: '2', // c. 効験
      explanation: 'Jawaban tepat: c. 効験 (kouken).'
    }
  ];

  for (const q of newQuizzes) {
    await prisma.quiz.create({
      data: q
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 験.`);
  if (groupingQuiz) {
    console.log(`Grouping quiz ID ${groupingQuiz.id} was retained intact.`);
  }

  await prisma.$disconnect();
}

updateKenQuizzes().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
