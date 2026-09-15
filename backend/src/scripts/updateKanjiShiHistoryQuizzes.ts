import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateShiHistoryQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '史' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 史 not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 史 (ID: ${kanji.id}, Module: ${kanji.moduleId})...`);

  // Preserve grouping quiz if exists
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete non-grouping quizzes for kanji 史
  await prisma.quiz.deleteMany({
    where: {
      kanjiId: kanji.id,
      type: { not: 'grouping' }
    }
  });

  const newQuizzes = [
    // --- UNSCRAMBLE QUIZZES (5) ---
    // Header from prompt: Susunlah kata-kata dibawah ini menjadi kalimat yang tepat.
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata dibawah ini menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 1: 1. 前史を ・ 思っています ・ 調べようと ・ 事件の
      words: JSON.stringify(['前史を', '思っています', '調べようと', '事件の']),
      correctOrder: JSON.stringify(['事件の', '前史を', '調べようと', '思っています']),
      correctAnswer: '0',
      explanation: 'Jawaban: 事件の前史を調べようと思っています。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata dibawah ini menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 2: 2. 歴史を ・ 勉強します ・ 理解できるように
      words: JSON.stringify(['歴史を', '勉強します', '理解できるように']),
      correctOrder: JSON.stringify(['理解できるように', '歴史を', '勉強します']),
      correctAnswer: '0',
      explanation: 'Jawaban: 理解できるように歴史を勉強します。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata dibawah ini menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 3: 3. 史実を ・ ほうが ・ 調べた ・ いいです
      words: JSON.stringify(['史実を', 'ほうが', '調べた', 'いいです']),
      correctOrder: JSON.stringify(['史実を', '調べた', 'ほうが', 'いいです']),
      correctAnswer: '0',
      explanation: 'Jawaban: 史実を調べたほうがいいです。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata dibawah ini menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 4: 4. 史料を ・ 難しいです ・ 読むのは ・ 古い
      words: JSON.stringify(['史料を', '難しいです', '読むのは', '古い']),
      correctOrder: JSON.stringify(['古い', '史料を', '読むのは', '難しいです']),
      correctAnswer: '0',
      explanation: 'Jawaban: 古い史料を読むのは難しいです。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata dibawah ini menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 5: 5. 正史が ・ 本に ・ 書いてあります
      words: JSON.stringify(['正史が', '本に', '書いてあります']),
      correctOrder: JSON.stringify(['本に', '正史が', '書いてあります']),
      correctAnswer: '0',
      explanation: 'Jawaban: 本に正史が書いてあります。'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “sejarah atau catatan mengenai peristiwa yang telah berlangsung pada masa lalu”?',
      options: JSON.stringify(['歴史', '先史', '前史']),
      correctAnswer: '0', // a. 歴史
      explanation: 'Jawaban tepat: a. 歴史 (rekishi) - sejarah.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “masa sebelum sejarah tertulis”?',
      options: JSON.stringify(['前史', '史上', '先史']),
      correctAnswer: '2', // c. 先史
      explanation: 'Jawaban tepat: c. 先史 (senshi) - pra-sejarah.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “riwayat pendidikan yang telah ditempuh”?',
      options: JSON.stringify(['職歴', '学歴', '経歴']),
      correctAnswer: '1', // b. 学歴
      explanation: 'Jawaban tepat: b. 学歴 (gakureki) - riwayat pendidikan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “fakta atau kenyataan yang benar-benar terjadi dalam sejarah”?',
      options: JSON.stringify(['史実', '史料', '正史']),
      correctAnswer: '0', // a. 史実
      explanation: 'Jawaban tepat: a. 史実 (shijitsu) - fakta sejarah.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “bahan atau sumber yang digunakan untuk mempelajari sejarah”?',
      options: JSON.stringify(['史実', '秘史', '史料']),
      correctAnswer: '2', // c. 史料
      explanation: 'Jawaban tepat: c. 史料 (shiryou) - sumber sejarah.'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '日本の（　　　）を勉強すると、昔のことがよく分かるようになります。',
      options: JSON.stringify(['歴史', '史料', '史実']),
      correctAnswer: '0', // a. 歴史
      explanation: 'Jawaban tepat: a. 歴史 (rekishi).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '文字が使われる前の時代を（　　　）といいます。',
      options: JSON.stringify(['正史', '前史', '史上']),
      correctAnswer: '1', // b. 前史
      explanation: 'Jawaban tepat: b. 前史 (zenshi).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'この出来事が本当の（　　　）かどうか、調べてください。',
      options: JSON.stringify(['前史', '史実', '前史']),
      correctAnswer: '1', // b. 史実
      explanation: 'Jawaban tepat: b. 史実 (shijitsu).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '昔の文書や記録などの（　　　）を使って、歴史を研究します。',
      options: JSON.stringify(['史実', '歴史', '史料']),
      correctAnswer: '2', // c. 史料
      explanation: 'Jawaban tepat: c. 史料 (shiryou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '教科書に書かれていることが、全部（　　　）とは限りません。',
      options: JSON.stringify(['正史', '史実', '先史']),
      correctAnswer: '1', // b. 史実
      explanation: 'Jawaban tepat: b. 史実 (shijitsu).'
    }
  ];

  for (const q of newQuizzes) {
    await prisma.quiz.create({
      data: q
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 史.`);
  if (groupingQuiz) {
    console.log(`Grouping quiz ID ${groupingQuiz.id} was retained intact.`);
  }

  await prisma.$disconnect();
}

updateShiHistoryQuizzes().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
