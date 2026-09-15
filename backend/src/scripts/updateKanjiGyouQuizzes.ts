import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateGyouQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '業' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 業 not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 業 (ID: ${kanji.id})...`);

  // Preserve grouping quiz if exists
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete non-grouping quizzes for kanji 業
  await prisma.quiz.deleteMany({
    where: {
      kanjiId: kanji.id,
      type: { not: 'grouping' }
    }
  });

  const newQuizzes = [
    // --- UNSCRAMBLE QUIZZES (5) ---
    // Instruction from prompt: Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 1: 働いている ・ ITの ・ 業界で ・ んです
      words: JSON.stringify(['働いている', 'ITの', '業界で', 'んです']),
      correctOrder: JSON.stringify(['ITの', '業界で', '働いている', 'んです']),
      correctAnswer: '0',
      explanation: 'Jawaban: ITの業界で働いているんです。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 2: 家業を ・ と ・ 手伝おう ・ 思っています ・ 将来
      words: JSON.stringify(['家業を', 'と', '手伝おう', '思っています', '将来']),
      correctOrder: JSON.stringify(['将来', '家業を', '手伝おう', 'と', '思っています']),
      correctAnswer: '0',
      explanation: 'Jawaban: 将来、家業を手伝おうと思っています。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 3: 営業の ・ はってあります ・ 紙が ・ドアに
      words: JSON.stringify(['営業の', 'はってあります', '紙が', 'ドアに']),
      correctOrder: JSON.stringify(['ドアに', '営業の', '紙が', 'はってあります']),
      correctAnswer: '0',
      explanation: 'Jawaban: ドアに営業の紙がはってあります。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 4: 農業を ・ 勉強しながら ・ 手伝います ・ 実家の
      words: JSON.stringify(['農業を', '勉強しながら', '手伝います', '実家の']),
      correctOrder: JSON.stringify(['勉強しながら', '実家の', '農業を', '手伝います']),
      correctAnswer: '0',
      explanation: 'Jawaban: 勉強しながら、実家の農業を手伝います。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 5: 商業の ・ 忘れるな！ ・ 基本を
      words: JSON.stringify(['商業の', '忘れるな！', '基本を']),
      correctOrder: JSON.stringify(['商業の', '基本を', '忘れるな！']),
      correctAnswer: '0',
      explanation: 'Jawaban: 商業の基本を忘れるな！'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “tugas atau pekerjaan yang dilakukan dalam suatu kegiatan atau usaha”?',
      options: JSON.stringify(['業務', '営業', '工業']),
      correctAnswer: '0', // a. 業務
      explanation: 'Jawaban tepat: a. 業務 (gyoumu) - tugas/pekerjaan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “pekerjaan atau tugas yang dilakukan”?',
      options: JSON.stringify(['作業', '業界', '本業']),
      correctAnswer: '0', // a. 作業
      explanation: 'Jawaban tepat: a. 作業 (sagyou) - pekerjaan/tugas.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “mulai bekerja”?',
      options: JSON.stringify(['就業', '始業', '農業']),
      correctAnswer: '1', // b. 始業
      explanation: 'Jawaban tepat: b. 始業 (shigyou) - mulai bekerja.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “usaha atau kegiatan bisnis yang dilakukan untuk menjual barang atau jasa”?',
      options: JSON.stringify(['工業', '営業', '漁業']),
      correctAnswer: '1', // b. 営業
      explanation: 'Jawaban tepat: b. 営業 (eigyou) - kegiatan bisnis.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “pekerjaan utama seseorang”?',
      options: JSON.stringify(['家業', '本業', '産業']),
      correctAnswer: '1', // b. 本業
      explanation: 'Jawaban tepat: b. 本業 (hongyou) - pekerjaan utama.'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '会社では、毎日いろいろな（　　　　）があります。',
      options: JSON.stringify(['業務', '工業', '農業']),
      correctAnswer: '0', // a. 業務
      explanation: 'Jawaban tepat: a. 業務 (gyoumu).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '日本の（　　　　）は自動車などで有名です。',
      options: JSON.stringify(['農業', '工業', '本業']),
      correctAnswer: '1', // b. 工業
      explanation: 'Jawaban tepat: b. 工業 (kougyou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '毎日、会社で（　　　　）をしています。',
      options: JSON.stringify(['作業', '漁業', '産業']),
      correctAnswer: '0', // a. 作業
      explanation: 'Jawaban tepat: a. 作業 (sagyou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '今日は仕事が多いので、（　　　　）するかもしれません。',
      options: JSON.stringify(['始業', '残業', '失業']),
      correctAnswer: '1', // b. 残業
      explanation: 'Jawaban tepat: b. 残業 (zangyou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '会社は午前9時から（　　　　）します。',
      options: JSON.stringify(['始業', '失業', '本業']),
      correctAnswer: '0', // a. 始業
      explanation: 'Jawaban tepat: a. 始業 (shigyou).'
    }
  ];

  for (const q of newQuizzes) {
    await prisma.quiz.create({
      data: q
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 業.`);
  if (groupingQuiz) {
    console.log(`Grouping quiz ID ${groupingQuiz.id} was retained intact.`);
  }

  await prisma.$disconnect();
}

updateGyouQuizzes().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
