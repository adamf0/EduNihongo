import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateRekiQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '歴' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 歴 not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 歴 (ID: ${kanji.id}, Module: ${kanji.moduleId})...`);

  // Preserve grouping quiz if exists
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete non-grouping quizzes for kanji 歴
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
      // Prompt 1: ① 調べておきます ・ 来歴を ・ 事前に ・ 商品の
      words: JSON.stringify(['調べておきます', '来歴を', '事前に', '商品の']),
      correctOrder: JSON.stringify(['事前に', '商品の', '来歴を', '調べておきます']),
      correctAnswer: '0',
      explanation: 'Jawaban: 事前に商品の来歴を調べておきます。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 2: ② 歴年 ・ 研究するのは ・ 大変です ・ データを
      words: JSON.stringify(['歴年', '研究するのは', '大変です', 'データを']),
      correctOrder: JSON.stringify(['歴年', 'データを', '研究するのは', '大変です']),
      correctAnswer: '0',
      explanation: 'Jawaban: 歴年データを研究するのは大変です。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 3: ③前歴が ・ 分かるでしょう ・ 調べれば
      words: JSON.stringify(['前歴が', '分かるでしょう', '調べれば']),
      correctOrder: JSON.stringify(['調べれば', '前歴が', '分かるでしょう']),
      correctAnswer: '0',
      explanation: 'Jawaban: 調べれば前歴が分かるでしょう。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 4: ④ 質問されたんです ・ 病歴を ・ 病院で
      words: JSON.stringify(['質問されたんです', '病歴を', '病院で']),
      correctOrder: JSON.stringify(['病院で', '病歴を', '質問されたんです']),
      correctAnswer: '0',
      explanation: 'Jawaban: 病院で病歴を質問されたんです。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 5: ⑤ 歴史を ・ 好きです ・ 調べるのが
      words: JSON.stringify(['歴史を', '好きです', '調べるのが']),
      correctOrder: JSON.stringify(['歴史を', '調べるのが', '好きです']),
      correctAnswer: '0',
      explanation: 'Jawaban: 歴史を調べるのが好きです。'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “riwayat pendidikan yang telah ditempuh”?',
      options: JSON.stringify(['学歴', '職歴', '経歴']),
      correctAnswer: '0', // a. 学歴
      explanation: 'Jawaban tepat: a. 学歴 (gakureki) - riwayat pendidikan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “riwayat pekerjaan yang telah dijalani”?',
      options: JSON.stringify(['学歴', '来歴', '職歴']),
      correctAnswer: '2', // c. 職歴
      explanation: 'Jawaban tepat: c. 職歴 (shokureki) - riwayat pekerjaan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “riwayat atau perjalanan hidup dan karier yang telah dilalui”?',
      options: JSON.stringify(['学歴', '経歴', '職歴']),
      correctAnswer: '1', // b. 経歴
      explanation: 'Jawaban tepat: b. 経歴 (keireki) - riwayat hidup/karier.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “riwayat penyakit yang pernah dialami”?',
      options: JSON.stringify(['前歴', '経歴', '病歴']),
      correctAnswer: '2', // c. 病歴
      explanation: 'Jawaban tepat: c. 病歴 (byoureki) - riwayat penyakit.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “riwayat yang terjadi atau dimiliki sebelumnya”?',
      options: JSON.stringify(['前歴', '病歴', '来歴']),
      correctAnswer: '0', // a. 前歴
      explanation: 'Jawaban tepat: a. 前歴 (zenreki) - riwayat sebelumnya.'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '大学を卒業したあとで、自分の（　　　）について説明しました。',
      options: JSON.stringify(['学歴', '病歴', '歴代']),
      correctAnswer: '0', // a. 学歴
      explanation: 'Jawaban tepat: a. 学歴 (gakureki).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '日本へ来る前の仕事の（　　　）を先生に話しました。',
      options: JSON.stringify(['病歴', '経歴', '歴代']),
      correctAnswer: '1', // b. 経歴
      explanation: 'Jawaban tepat: b. 経歴 (keireki).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'この古い建物の（　　　）を調べるために、図書館へ行きました。',
      options: JSON.stringify(['来歴', '職歴', '歴代']),
      correctAnswer: '0', // a. 来歴
      explanation: 'Jawaban tepat: a. 来歴 (raireki).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '病院へ行ったので、医者に（　　　）を聞かれました。',
      options: JSON.stringify(['病歴', '来歴', '歴年']),
      correctAnswer: '0', // a. 病歴
      explanation: 'Jawaban tepat: a. 病歴 (byoureki).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '日本の（　　　）を勉強すると、昔の生活がよく分かるようになります。',
      options: JSON.stringify(['歴史', '歴年', '学歴']),
      correctAnswer: '0', // a. 歴史
      explanation: 'Jawaban tepat: a. 歴史 (rekishi).'
    }
  ];

  for (const q of newQuizzes) {
    await prisma.quiz.create({
      data: q
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 歴.`);
  if (groupingQuiz) {
    console.log(`Grouping quiz ID ${groupingQuiz.id} was retained intact.`);
  }

  await prisma.$disconnect();
}

updateRekiQuizzes().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
