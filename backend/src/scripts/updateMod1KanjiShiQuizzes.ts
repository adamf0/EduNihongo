import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateShiQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '試' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 試 (Module 1) not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 試 (ID: ${kanji.id})...`);

  // Preserve grouping quiz if exists
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete existing non-grouping quizzes for kanji 試
  await prisma.quiz.deleteMany({
    where: {
      kanjiId: kanji.id,
      type: { not: 'grouping' }
    }
  });

  // Define updated quizzes according to user request:
  const newQuizzes = [
    // --- UNSCRAMBLE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      words: JSON.stringify(['ありました', '試合', 'きのう', 'が']),
      correctOrder: JSON.stringify(['きのう', '試合', 'が', 'ありました。']),
      correctAnswer: '0',
      explanation: 'Jawaban: きのう試合がありました。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      words: JSON.stringify(['試食', 'しました', '新しいパンを', 'スーパーで']),
      correctOrder: JSON.stringify(['スーパーで', '新しいパンを', '試食', 'しました。']),
      correctAnswer: '0',
      explanation: 'Jawaban: スーパーで新しいパンを試食しました。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      words: JSON.stringify(['試飲', 'けさ', 'ジャム', 'しました', '田中さん', 'を', 'は']),
      correctOrder: JSON.stringify(['田中さん', 'は', 'けさ', 'ジャム', 'を', '試飲', 'しました。']),
      correctAnswer: '0',
      explanation: 'Jawaban: 田中さんはけさジャムを試飲しました。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      words: JSON.stringify(['します', '前に', '試乗', '買う', '新しい車を', 'まず']),
      correctOrder: JSON.stringify(['新しい車を', '買う', '前に、', 'まず', '試乗', 'します。']),
      correctAnswer: '0',
      explanation: 'Jawaban: 新しい車を買う前に、まず試乗します。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      words: JSON.stringify(['あったので', '昨日', '休みました', '試合が', '大学を']),
      correctOrder: JSON.stringify(['昨日', '試合が', 'あったので、', '大学を', 'やすみました。']),
      correctAnswer: '0',
      explanation: 'Jawaban: 昨日試合があったので、大学をやすみました。'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “kegiatan menguji kemampuan seseorang"?',
      options: JSON.stringify(['試験', '試食', '試着']),
      correctAnswer: '0', // a. 試験
      explanation: 'Jawaban tepat: a. 試験 (shiken) - kegiatan menguji kemampuan seseorang.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “mencoba pakaian sebelum membeli"?',
      options: JSON.stringify(['試用', '試着', '試写']),
      correctAnswer: '1', // b. 試着
      explanation: 'Jawaban tepat: b. 試着 (shichaku) - mencoba pakaian sebelum membeli.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “mencicipi makanan"?',
      options: JSON.stringify(['試食', '試飲', '試薬']),
      correctAnswer: '0', // a. 試食
      explanation: 'Jawaban tepat: a. 試食 (shishoku) - mencicipi makanan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “pembuatan produk percobaan /prototype"?',
      options: JSON.stringify(['試合', '試作', '試製']),
      correctAnswer: '1', // b. 試作
      explanation: 'Jawaban tepat: b. 試作 (shisaku) - pembuatan produk percobaan / prototype.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna ”kompetisi/pertandingan"?',
      options: JSON.stringify(['試合', '試写', '試技']),
      correctAnswer: '0', // a. 試合
      explanation: 'Jawaban tepat: a. 試合 (shiai) - kompetisi / pertandingan.'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '来週は（　　　　）がありますから、今から勉強しなければなりません 。',
      options: JSON.stringify(['試合', '試験', '試薬']),
      correctAnswer: '1', // b. 試験
      explanation: 'Jawaban tepat: b. 試験 (shiken).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'パーティーへ行く前に、服はちゃんと（　　　）して下さい。',
      options: JSON.stringify(['試作', '試着', '試飲']),
      correctAnswer: '1', // b. 試着
      explanation: 'Jawaban tepat: b. 試着 (shichaku).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '今月に工場で（　　　）がありますから、社長が工場に来ます。',
      options: JSON.stringify(['試着', '試薬', '試製']),
      correctAnswer: '2', // c. 試製
      explanation: 'Jawaban tepat: c. 試製 (shisei).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '今日の午後へ（　　　　）に行く予定があります。',
      options: JSON.stringify(['試験', '試写', '試作']),
      correctAnswer: '1', // b. 試写
      explanation: 'Jawaban tepat: b. 試写 (shisha).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '実験の前に（　　　　）を準備してください。',
      options: JSON.stringify(['試合', '試験', '試薬']),
      correctAnswer: '2', // c. 試薬
      explanation: 'Jawaban tepat: c. 試薬 (shiyaku).'
    }
  ];

  for (const q of newQuizzes) {
    await prisma.quiz.create({
      data: q
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 試.`);
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
