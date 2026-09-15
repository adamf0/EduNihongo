import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateTouQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '討' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 討 not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 討 (ID: ${kanji.id})...`);

  // Preserve grouping quiz if exists
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete non-grouping quizzes for kanji 討
  await prisma.quiz.deleteMany({
    where: {
      kanjiId: kanji.id,
      type: { not: 'grouping' }
    }
  });

  const newQuizzes = [
    // --- UNSCRAMBLE QUIZZES (5) ---
    // Header from prompt: Susunlah kata-kata berikut menjadi kalimat yang tepat.
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 1: ①  思っています ・あの・ 検討しようと ・ 意見を
      words: JSON.stringify(['思っています', 'あの', '検討しようと', '意見を']),
      correctOrder: JSON.stringify(['あの', '意見を', '検討しようと', '思っています']),
      correctAnswer: '0',
      explanation: 'Jawaban:あの意見を検討しようと思っています。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 2: ② 　討論できるように ・ 練習します ・ 上手に
      words: JSON.stringify(['討論できるように', '練習します', '上手に']),
      correctOrder: JSON.stringify(['上手に', '討論できるように', '練習します']),
      correctAnswer: '0',
      explanation: 'Jawaban：上手に討論できるように、練習します。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 3: ③　討究するのは ・ 大変です ・ 心理を
      words: JSON.stringify(['討究するのは', '大変です', '心理を']),
      correctOrder: JSON.stringify(['心理を', '討究するのは', '大変です']),
      correctAnswer: '0',
      explanation: 'Jawaban：心理を討究するのは大変です。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 4: ④が  始まるかもしれません ・ 明日・ 検討会
      words: JSON.stringify(['が', '始まるかもしれません', '明日', '検討会']),
      correctOrder: JSON.stringify(['明日', '検討会', 'が', '始まるかもしれません']),
      correctAnswer: '0',
      explanation: 'Jawaban：明日検討会が始まるかもしれません。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 5: ⑤ 返事を ・ ご検討の ・ します・あとで
      words: JSON.stringify(['返事を', 'ご検討の', 'します', 'あとで']),
      correctOrder: JSON.stringify(['あとで', 'ご検討の', '返事を', 'します']),
      correctAnswer: '0',
      explanation: 'Jawaban：あとでご検討の返事をします。'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “membahas suatu hal dalam rapat atau pertemuan”?',
      options: JSON.stringify(['討議', '討伐', '討究']),
      correctAnswer: '0', // a. 討議
      explanation: 'Jawaban tepat: a. 討議 (tougi) - membahas suatu hal dalam rapat.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “debat atau perdebatan mengenai suatu masalah”?',
      options: JSON.stringify(['検討', '討論', '討議']),
      correctAnswer: '1', // b. 討論
      explanation: 'Jawaban tepat: b. 討論 (touron) - debat atau perdebatan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “mengkaji atau menyelidiki suatu hal secara mendalam”?',
      options: JSON.stringify(['討究', '討伐', '討論']),
      correctAnswer: '0', // a. 討究
      explanation: 'Jawaban tepat: a. 討究 (toukyuu) - mengkaji secara mendalam.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “mempertimbangkan atau meninjau sesuatu sebelum mengambil keputusan”?',
      options: JSON.stringify(['討究', '検討', '討議']),
      correctAnswer: '1', // b. 検討
      explanation: 'Jawaban tepat: b. 検討 (kentou) - mempertimbangkan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “menyerang dan menumpas musuh atau kelompok tertentu”?',
      options: JSON.stringify(['討論', '討伐', '検討']),
      correctAnswer: '1', // b. 討伐
      explanation: 'Jawaban tepat: b. 討伐 (toubatsu) - menyerang dan menumpas musuh.'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'この問題について、学生たちは（　　　）をしています。',
      options: JSON.stringify(['討議', '討伐', '討究']),
      correctAnswer: '0', // a. 討議
      explanation: 'Jawaban tepat: a. 討議 (tougi).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'みんなでよく（　　　）してから、答えを決めましょう。',
      options: JSON.stringify(['討論', '討伐', '検討']),
      correctAnswer: '2', // c. 検討
      explanation: 'Jawaban tepat: c. 検討 (kentou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'この計画をもう一度（　　　）したほうがいいでしょう。',
      options: JSON.stringify(['討論', '討伐', '検討']),
      correctAnswer: '2', // c. 検討
      explanation: 'Jawaban tepat: c. 検討 (kentou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '昔の軍隊が敵を（　　　）しました。',
      options: JSON.stringify(['討論', '討伐', '討議']),
      correctAnswer: '1', // b. 討伐
      explanation: 'Jawaban tepat: b. 討伐 (toubatsu).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'この問題について（　　　）したあとで、結論を出しましょう。',
      options: JSON.stringify(['検討', '討伐', '討議']),
      correctAnswer: '2', // c. 討議
      explanation: 'Jawaban tepat: c. 討議 (tougi).'
    }
  ];

  for (const q of newQuizzes) {
    await prisma.quiz.create({
      data: q
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 討.`);
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
