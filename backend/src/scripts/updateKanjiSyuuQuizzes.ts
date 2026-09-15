import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateSyuuQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '集' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 集 not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 集 (ID: ${kanji.id})...`);

  // Preserve grouping quiz
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete non-grouping quizzes for kanji 集
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
      // Scrambled pool from prompt: 準備してあります ・ 事前に ・ 採集の ・ 工具が
      words: JSON.stringify(['準備してあります', '事前に', '採集の', '工具が']),
      correctOrder: JSON.stringify(['事前に', '採集の', '工具が', '準備してあります']),
      correctAnswer: '0',
      explanation: 'Jawaban: 事前に採集の工具が準備してあります。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 建物が ・ 密集しています ・ この ・ 地域は
      words: JSON.stringify(['建物が', '密集しています', 'この', '地域は']),
      correctOrder: JSON.stringify(['この', '地域は', '建物が', '密集しています']),
      correctAnswer: '0',
      explanation: 'Jawaban: この地域は建物が密集しています。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 買おうと ・ 小説の ・ 選集を ・ 思っています
      words: JSON.stringify(['買おうと', '小説の', '選集を', '思っています']),
      correctOrder: JSON.stringify(['小説の', '選集を', '買おうと', '思っています']),
      correctAnswer: '0',
      explanation: 'Jawaban: 小説の選集を買おうと思っています。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: いいです ・ 行動した ・ ほうが ・ 集団で
      words: JSON.stringify(['いいです', '行動した', 'ほうが', '集団で']),
      correctOrder: JSON.stringify(['集団で', '行動した', 'ほうが', 'いいです']),
      correctAnswer: '0',
      explanation: 'Jawaban: 集団に行動したほうがいいです。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 参加しようと ・ 思っています ・ 集会に ・ 明日の
      words: JSON.stringify(['参加しようと', '思っています', '集会に', '明日の']),
      correctOrder: JSON.stringify(['明日の', '集会に', '参加しようと', '思っています']),
      correctAnswer: '0',
      explanation: 'Jawaban: 明日の集会に参加しようと思っています。'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan “pertemuan atau rapat yang dihadiri banyak orang?',
      options: JSON.stringify(['集団', '集会', '集客']),
      correctAnswer: '1', // b. 集会
      explanation: 'Jawaban tepat: b. 集会 (shuukai) - pertemuan/rapat.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “kumpulan karya atau tulisan yang telah dipilih dan dihimpun menjadi satu"?',
      options: JSON.stringify(['選集', '収集', '集会']),
      correctAnswer: '0', // a. 選集
      explanation: 'Jawaban tepat: a. 選集 (senshuu) - antologi/kumpulan karya.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “mengambil dan mengumpulkan sesuatu dari berbagai tempat"?',
      options: JSON.stringify(['採集', '集結', '全集']),
      correctAnswer: '0', // a. 採集
      explanation: 'Jawaban tepat: a. 採集 (saishuu) - mengumpulkan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “mencari atau mengajak orang agar terkumpul untuk suatu tujuan"?',
      options: JSON.stringify(['集積', '募集', '集団']),
      correctAnswer: '1', // b. 募集
      explanation: 'Jawaban tepat: b. 募集 (boshuu) - perekrutan/pengumpulan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “memusatkan perhatian atau pikiran pada satu hal"?',
      options: JSON.stringify(['集合', '選集', '集中']),
      correctAnswer: '2', // c. 集中
      explanation: 'Jawaban tepat: c. 集中 (shuuchuu) - konsentrasi.'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '会議は午前九時に始まりますので、時間までに（　　　　）してください。',
      options: JSON.stringify(['集合', '集中', '集団']),
      correctAnswer: '0', // a. 集合
      explanation: 'Jawaban tepat: a. 集合 (shuugou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '来週、学校で学生の（　　　　）があるんです。',
      options: JSON.stringify(['集会', '採集', '集積']),
      correctAnswer: '0', // a. 集会
      explanation: 'Jawaban tepat: a. 集会 (shuukai).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '試験中はほかのことを考えないで、（　　　　）してください。',
      options: JSON.stringify(['収集', '集客', '集中']),
      correctAnswer: '2', // c. 集中
      explanation: 'Jawaban tepat: c. 集中 (shuuchuu).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '大学では来月から新しい学生を（　　　　）する予定です。',
      options: JSON.stringify(['集結', '募集', '集積']),
      correctAnswer: '1', // b. 募集
      explanation: 'Jawaban tepat: b. 募集 (boshuu).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '夏休みに山へ行って、植物を（　　　　）するつもりです。',
      options: JSON.stringify(['集会', '採集', '集団']),
      correctAnswer: '1', // b. 採集
      explanation: 'Jawaban tepat: b. 採集 (saishuu).'
    }
  ];

  for (const q of newQuizzes) {
    await prisma.quiz.create({
      data: q
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 集.`);
  if (groupingQuiz) {
    console.log(`Grouping quiz ID ${groupingQuiz.id} was retained intact.`);
  }

  await prisma.$disconnect();
}

updateSyuuQuizzes().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
