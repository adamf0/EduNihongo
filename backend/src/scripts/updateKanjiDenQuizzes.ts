import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateDenQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '伝' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 伝 not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 伝 (ID: ${kanji.id})...`);

  // Preserve grouping quiz if exists
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete non-grouping quizzes for kanji 伝
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
      // Scrambled pool from prompt: 伝説を ・ んです ・ 調べて ・ 古い ・ いる・この
      words: JSON.stringify(['伝説を', 'んです', '調べて', '古い', 'いる', 'この']),
      correctOrder: JSON.stringify(['この', '古い', '伝説を', '調べて', 'いる', 'んです']),
      correctAnswer: '0',
      explanation: 'Jawaban: この古い伝説を調べているんです。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: に ・ 有名な ・ おいてあります ・つくえ・ 自伝が ・ 人の ・ 上
      words: JSON.stringify(['に', '有名な', 'おいてあります', 'つくえ', 'の', '自伝が', '人の', '上']),
      correctOrder: JSON.stringify(['つくえ', 'の', '上', 'に', '有名な', '人の', '自伝が', 'おいてあります']),
      correctAnswer: '0',
      explanation: 'Jawaban: つくえの上に有名な人の自伝がおいてあります。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 守ります ・ 伝統を ・ はたらきながら ・ 町の
      words: JSON.stringify(['守ります', '伝統を', 'はたらきながら', '町の']),
      correctOrder: JSON.stringify(['はたらきながら', '町の', '伝統を', '守ります']),
      correctAnswer: '0',
      explanation: 'Jawaban: はたらきながら、町の伝統を守ります。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 読もう ・ 伝書を ・ 古い ・ と ・ 思っています
      words: JSON.stringify(['読もう', '伝書を', '古い', 'と', '思っています']),
      correctOrder: JSON.stringify(['古い', '伝書を', '読もう', 'と', '思っています']),
      correctAnswer: '0',
      explanation: 'Jawaban: 古い伝書を読もうと思っています。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: その ・ かもしれません ・ 話は ・ 伝聞に ・ 過ぎない
      words: JSON.stringify(['その', 'かもしれません', '話は', '伝聞に', '過ぎない']),
      correctOrder: JSON.stringify(['その', '話は', '伝聞に', '過ぎない', 'かもしれません']),
      correctAnswer: '0',
      explanation: 'Jawaban: その話は伝聞に過ぎないかもしれません。'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “pesan yang dititipkan kepada seseorang untuk disampaikan kepada orang lain”?舞台',
      questionClean: 'Jukugo mana yang berhubungan dengan makna “pesan yang dititipkan kepada seseorang untuk disampaikan kepada orang lain”?',
      options: JSON.stringify(['伝言', '伝統', '伝記']),
      correctAnswer: '0', // a. 伝言
      explanation: 'Jawaban tepat: a. 伝言 (dengon) - pesan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “tindakan menyampaikan informasi atau sesuatu dari satu pihak kepada pihak lain”?',
      options: JSON.stringify(['伝習', '伝説', '伝達']),
      correctAnswer: '2', // c. 伝達
      explanation: 'Jawaban tepat: c. 伝達 (dentatsu) - penyampaian informasi.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “sesuatu yang didengar atau diketahui dari orang lain tanpa melihat atau mengalaminya secara langsung”?',
      options: JSON.stringify(['伝授', '伝聞', '伝統']),
      correctAnswer: '1', // b. 伝聞
      explanation: 'Jawaban tepat: b. 伝聞 (denbun) - kabar/desas-desus.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “kebiasaan atau budaya yang diwariskan dari generasi ke generasi dan tetap dipertahankan”?',
      options: JSON.stringify(['伝令', '伝統', '伝言']),
      correctAnswer: '1', // b. 伝統
      explanation: 'Jawaban tepat: b. 伝統 (dentou) - tradisi.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “cerita yang diwariskan dari masa lalu dan biasanya mengandung unsur sejarah atau khayalan”?',
      options: JSON.stringify(['伝説', '伝記', '伝達']),
      correctAnswer: '0', // a. 伝説
      explanation: 'Jawaban tepat: a. 伝説 (densetsu) - legenda.'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '先生からの（　　　　）をクラスのみんなに伝えてください。',
      options: JSON.stringify(['伝言', '伝統', '伝記']),
      correctAnswer: '0', // a. 伝言
      explanation: 'Jawaban tepat: a. 伝言 (dengon).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '大切な情報を学生に正しく（　　　　）する必要があります。',
      options: JSON.stringify(['伝達', '伝説', '自伝']),
      correctAnswer: '0', // a. 伝達
      explanation: 'Jawaban tepat: a. 伝達 (dentatsu).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '日本には長い歴史を持つ（　　　　）がたくさんあります。',
      options: JSON.stringify(['伝統', '伝令', '伝言']),
      correctAnswer: '0', // a. 伝統
      explanation: 'Jawaban tepat: a. 伝統 (dentou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'その有名な人物の人生について書かれた（　　　　）を読みました。',
      options: JSON.stringify(['伝説', '伝記', '伝達']),
      correctAnswer: '1', // b. 伝記
      explanation: 'Jawaban tepat: b. 伝記 (denki).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '昔から伝わってきた話なので、これは有名な（　　　　）です。',
      options: JSON.stringify(['伝説', '伝習', '伝授']),
      correctAnswer: '0', // a. 伝説
      explanation: 'Jawaban tepat: a. 伝説 (densetsu).'
    }
  ];

  for (const q of newQuizzes) {
    const { questionClean, ...qData } = q as any;
    await prisma.quiz.create({
      data: {
        ...qData,
        question: questionClean || qData.question
      }
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 伝.`);
  if (groupingQuiz) {
    console.log(`Grouping quiz ID ${groupingQuiz.id} was retained intact.`);
  }

  await prisma.$disconnect();
}

updateDenQuizzes().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
