import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateRonQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '論' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 論 not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 論 (ID: ${kanji.id})...`);

  // Preserve grouping quiz if exists
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete non-grouping quizzes for kanji 論
  await prisma.quiz.deleteMany({
    where: {
      kanjiId: kanji.id,
      type: { not: 'grouping' }
    }
  });

  const newQuizzes = [
    // --- UNSCRAMBLE QUIZZES (5) ---
    // Header from prompt: Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 1: 好きです ・ 討論するのが ・ クラスで
      words: JSON.stringify(['好きです', '討論するのが', 'クラスで']),
      correctOrder: JSON.stringify(['クラスで', '討論するのが', '好きです']),
      correctAnswer: '0',
      explanation: 'Jawaban：クラスで討論するのが好きです。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 2: 変えられました ・世界が ニュースで
      words: JSON.stringify(['変えられました', '世界が', 'ニュースで']),
      correctOrder: JSON.stringify(['ニュースで', '世界が', '変えられました']),
      correctAnswer: '0',
      explanation: 'Jawaban：ニュースで世界が変えられました。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 3: 思っています ・話そうと ・ 持論を
      words: JSON.stringify(['思っています', '話そうと', '持論を']),
      correctOrder: JSON.stringify(['持論を', '話そうと', '思っています']),
      correctAnswer: '0',
      explanation: 'Jawaban:持論を話そうと思っています。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 4: 口論しない ・ いいです ・ ほうが・友達
      words: JSON.stringify(['口論しない', 'いいです', 'ほうが', '友達']),
      correctOrder: JSON.stringify(['友達', '口論しない', 'ほうが', 'いいです']),
      correctAnswer: '0',
      explanation: 'Jawaban：友達と口論した方がいいです。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 5: 反論できるように ・ 準備します ・ 上手に
      words: JSON.stringify(['反論できるように', '準備します', '上手に']),
      correctOrder: JSON.stringify(['反論できるように', '上手に', '準備します']),
      correctAnswer: '0',
      explanation: 'Jawaban：反論できるように、上手にします。'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “diskusi atau pembahasan mengenai suatu masalah”?',
      options: JSON.stringify(['論議', '結論', '論文']),
      correctAnswer: '0', // a. 論議
      explanation: 'Jawaban tepat: a. 論議 (rongi) - diskusi/pembahasan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “debat atau perdebatan mengenai suatu hal”?',
      options: JSON.stringify(['評論', '討論', '論理']),
      correctAnswer: '1', // b. 討論
      explanation: 'Jawaban tepat: b. 討論 (touron) - debat/perdebatan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “sanggahan atau argumen untuk membalas pendapat orang lain”?',
      options: JSON.stringify(['反論', '持論', '世論']),
      correctAnswer: '0', // a. 反論
      explanation: 'Jawaban tepat: a. 反論 (hanron) - sanggahan/argumen balasan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “pendapat yang berbeda atau keberatan terhadap suatu pendapat”?',
      options: JSON.stringify(['異論', '理論', '論点']),
      correctAnswer: '0', // a. 異論
      explanation: 'Jawaban tepat: a. 異論 (iron) - pendapat berbeda/keberatan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “kesimpulan yang diperoleh setelah membahas atau mempertimbangkan suatu hal”?',
      options: JSON.stringify(['論点', '評論', '結論']),
      correctAnswer: '2', // c. 結論
      explanation: 'Jawaban tepat: c. 結論 (ketsuron) - kesimpulan.'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'この問題について、みんなで（　　　）したほうがいいでしょう。',
      options: JSON.stringify(['持論', '議論', '異論']),
      correctAnswer: '1', // b. 議論
      explanation: 'Jawaban tepat: b. 議論 (giron).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '二人はそのテーマについて（　　　）しています。',
      options: JSON.stringify(['論理', '討論', '反論']),
      correctAnswer: '1', // b. 討論
      explanation: 'Jawaban tepat: b. 討論 (touron).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '先生の意見に（　　　）する前に、よく考えてください。',
      options: JSON.stringify(['持論', '異論', '反論']),
      correctAnswer: '2', // c. 反論
      explanation: 'Jawaban tepat: c. 反論 (hanron).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'その考えには（　　　）があるかもしれません。',
      options: JSON.stringify(['異論', '論理', '討論']),
      correctAnswer: '0', // a. 異論
      explanation: 'Jawaban tepat: a. 異論 (iron).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'この文章は（　　　）がはっきりしていて、読みやすいです。',
      options: JSON.stringify(['論理', '異論', '持論']),
      correctAnswer: '0', // a. 論理
      explanation: 'Jawaban tepat: a. 論理 (ronri).'
    }
  ];

  for (const q of newQuizzes) {
    await prisma.quiz.create({
      data: q
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 論.`);
  if (groupingQuiz) {
    console.log(`Grouping quiz ID ${groupingQuiz.id} was retained intact.`);
  }

  await prisma.$disconnect();
}

updateRonQuizzes().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
