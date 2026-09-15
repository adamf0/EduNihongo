import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateKeiQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '経' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 経 not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 経 (ID: ${kanji.id}, Module: ${kanji.moduleId})...`);

  // Preserve grouping quiz if exists
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete non-grouping quizzes for kanji 経
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
      // Prompt 1: 経口で ・ 方が ・ 薬を ・ 飲んだ ・ いいです
      words: JSON.stringify(['経口で', '方が', '薬を', '飲んだ', 'いいです']),
      correctOrder: JSON.stringify(['経口で', '薬を', '飲んだ', '方が', 'いいです']),
      correctAnswer: '0',
      explanation: 'Jawaban: 口で薬を飲んだ方がいいです。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Prompt 2: 経験するのは ・楽しい・ 海外で ・ です
      words: JSON.stringify(['経験するのは', '楽しい', '海外で', 'です']),
      correctOrder: JSON.stringify(['海外で', '経験するのは', '楽しい', 'です']),
      correctAnswer: '0',
      explanation: 'Jawaban:海外で経験するのは楽しいです。。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Prompt 3: 経済が ・なるかもしれません ・ 来年・よく
      words: JSON.stringify(['経済が', 'なるかもしれません', '来年', 'よく']),
      correctOrder: JSON.stringify(['来年', '経済が', 'よく', 'なるかもしれません']),
      correctAnswer: '0',
      explanation: 'Jawaban:来年経済がよくなるかもしれません。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Prompt 4: 経営しようと ・ 自分の ・ 思っています ・ 会社を
      words: JSON.stringify(['経営しようと', '自分の', '思っています', '会社を']),
      correctOrder: JSON.stringify(['自分の', '会社を', '経営しようと', '思っています']),
      correctAnswer: '0',
      explanation: 'Jawaban:自分の会社を経営しようと思っています。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Prompt 5: 経費を ・ 安くなるでしょう ・ へらせば
      words: JSON.stringify(['経費を', '安くなるでしょう', 'へらせば']),
      correctOrder: JSON.stringify(['経費を', 'へらせば', '安くなるでしょう']),
      correctAnswer: '0',
      explanation: 'Jawaban:経費をへらせば、安くなるでしょう。'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “pengalaman yang diperoleh melalui sesuatu yang telah dijalani”?',
      options: JSON.stringify(['経過', '経歴', '経験']),
      correctAnswer: '2', // c. 経験
      explanation: 'Jawaban tepat: c. 経験 (keiken) - pengalaman.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “proses atau keadaan yang berlangsung dan telah melewati suatu rentang waktu”?',
      options: JSON.stringify(['経費', '経過', '経由']),
      correctAnswer: '1', // b. 経過
      explanation: 'Jawaban tepat: b. 経過 (keika) - proses/perkembangan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “riwayat atau perjalanan hidup dan karier yang telah dilalui”?',
      options: JSON.stringify(['経歴', '経験', '経営']),
      correctAnswer: '0', // a. 経歴
      explanation: 'Jawaban tepat: a. 経歴 (keireki) - riwayat/karier.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “melalui suatu tempat, jalur, atau perantar”?',
      options: JSON.stringify(['経口', '経常', '経由']),
      correctAnswer: '2', // c. 経由
      explanation: 'Jawaban tepat: c. 経由 (keiyu) - transit/melalui.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “melalui mulut atau dilakukan secara oral”?',
      options: JSON.stringify(['経理', '経口', '経由']),
      correctAnswer: '1', // b. 経口
      explanation: 'Jawaban tepat: b. 経口 (keikou) - oral/melalui mulut.'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '東京を（　　　）して大阪へ行く予定です。',
      options: JSON.stringify(['経営', '経由', '経験']),
      correctAnswer: '1', // b. 経由
      explanation: 'Jawaban tepat: b. 経由 (keiyu).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '日本へ来て、いろいろなことを（　　　）しました。',
      options: JSON.stringify(['経済', '経験', '経理']),
      correctAnswer: '1', // b. 経験
      explanation: 'Jawaban tepat: b. 経験 (keiken).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '会社を（　　　）するのは大変でしょう。',
      options: JSON.stringify(['経営', '経過', '経口']),
      correctAnswer: '0', // a. 経営
      explanation: 'Jawaban tepat: a. 経営 (keiei).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'この薬は水といっしょに（　　　）で飲みます。',
      options: JSON.stringify(['経歴', '経口', '経費']),
      correctAnswer: '1', // b. 経口
      explanation: 'Jawaban tepat: b. 経口 (keikou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '旅行にかかった（　　　）が高かったので、来月は旅行しないつもりです。',
      options: JSON.stringify(['経費', '経常', '経由']),
      correctAnswer: '0', // a. 経費
      explanation: 'Jawaban tepat: a. 経費 (keihi).'
    }
  ];

  for (const q of newQuizzes) {
    await prisma.quiz.create({
      data: q
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 経.`);
  if (groupingQuiz) {
    console.log(`Grouping quiz ID ${groupingQuiz.id} was retained intact.`);
  }

  await prisma.$disconnect();
}

updateKeiQuizzes().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
