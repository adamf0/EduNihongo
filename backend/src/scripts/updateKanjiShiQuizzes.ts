import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateShiQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '始' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 始 not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 始 (ID: ${kanji.id}, Module: ${kanji.moduleId})...`);

  // Preserve grouping quiz if exists
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete non-grouping quizzes for kanji 始
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
      // Prompt 1: 書いてあります・開始時間が ・ ポスターに
      words: JSON.stringify(['書いてあります', '開始時間が', 'ポスターに']),
      correctOrder: JSON.stringify(['ポスターに', '開始時間が', '書いてあります']),
      correctAnswer: '0',
      explanation: 'Jawaban: ポスターに開始時間が書いてあります'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 2: かもしれません ・変わる・ 明日・始業時間が
      words: JSON.stringify(['かもしれません', '変わる', '明日', '始業時間が']),
      correctOrder: JSON.stringify(['明日', '始業時間が', '変わる', 'かもしれません']),
      correctAnswer: '0',
      explanation: 'Jawaban: 明日始業時間が変わるかもしれません。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 3: できるように ・ 準備します ・ すぐに ・始動
      words: JSON.stringify(['できるように', '準備します', 'すぐに', '始動']),
      correctOrder: JSON.stringify(['すぐに', '始動', 'できるように', '準備します']),
      correctAnswer: '0',
      explanation: 'Jawaban: すぐに始動できるように、準備します。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 4: 年始に ・ んです ・ 実家へ ・ 帰る
      words: JSON.stringify(['年始に', 'んです', '実家へ', '帰る']),
      correctOrder: JSON.stringify(['年始に', '実家へ', '帰る', 'んです']),
      correctAnswer: '0',
      explanation: 'Jawaban: 年始に実家へ帰るんです。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 5: いいです・書類を ・ 始末した ・ 早く ・ ほうが
      words: JSON.stringify(['いいです', '書類を', '始末した', '早く', 'ほうが']),
      correctOrder: JSON.stringify(['早く', '書類を', '始末した', 'ほうが', 'いいです']),
      correctAnswer: '0',
      explanation: 'Jawaban: 早く書類を始末したほうがいいです。'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “awal suatu tahun”?',
      options: JSON.stringify(['年末', '始業', '年始']),
      correctAnswer: '2', // c. 年始
      explanation: 'Jawaban tepat: c. 年始 (nenshi) - awal tahun.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “memulai atau membuka dimulainya suatu kegiatan”?',
      options: JSON.stringify(['開始', '始動', '始業']),
      correctAnswer: '0', // a. 開始
      explanation: 'Jawaban tepat: a. 開始 (kaishi) - memulai kegiatan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “mulainya suatu pekerjaan atau kegiatan”?',
      options: JSON.stringify(['開始', '始動', '始業']),
      correctAnswer: '2', // c. 始業
      explanation: 'Jawaban tepat: c. 始業 (shigyou) - mulainya pekerjaan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “mulai bergerak atau mulai beroperasi”?',
      options: JSON.stringify(['始終', '始動', '開始']),
      correctAnswer: '1', // b. 始動
      explanation: 'Jawaban tepat: b. 始動 (shidou) - mulai beroperasi.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “keadaan yang berlangsung dari awal sampai akhir”?',
      options: JSON.stringify(['終始', '始終', '始末']),
      correctAnswer: '1', // b. 始終
      explanation: 'Jawaban tepat: b. 始終 (shijuu) - dari awal sampai akhir.'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '新しい学期は4月から（　　　）します。',
      options: JSON.stringify(['開始', '始終', '始末']),
      correctAnswer: '0', // a. 開始
      explanation: 'Jawaban tepat: a. 開始 (kaishi).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '仕事を（　　　）する前に、準備をしておいたほうがいいです。',
      options: JSON.stringify(['始業', '始動', '年始']),
      correctAnswer: '0', // a. 始業
      explanation: 'Jawaban tepat: a. 始業 (shigyou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'このボタンを押すと、すぐに（　　　）します。',
      options: JSON.stringify(['始終', '始動', '始末']),
      correctAnswer: '1', // b. 始動
      explanation: 'Jawaban tepat: b. 始動 (shidou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '（　　　）には、家族にあいさつをするようにしています。',
      options: JSON.stringify(['始業', '開始', '年始']),
      correctAnswer: '2', // c. 年始
      explanation: 'Jawaban tepat: c. 年始 (nenshi).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '朝から夜まで（　　　）忙しくて、休む時間がありませんでした。',
      options: JSON.stringify(['始終', '始動', '年始']),
      correctAnswer: '0', // a. 始終
      explanation: 'Jawaban tepat: a. 始終 (shijuu).'
    }
  ];

  for (const q of newQuizzes) {
    await prisma.quiz.create({
      data: q
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 始.`);
  if (groupingQuiz) {
    console.log(`Grouping quiz ID ${groupingQuiz.id} was retained intact.`);
  }

  await prisma.$disconnect();
}

updateShiQuizzes().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
