import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateIQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '意' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 意 not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 意 (ID: ${kanji.id})...`);

  // Preserve grouping quiz if exists
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete non-grouping quizzes for kanji 意
  await prisma.quiz.deleteMany({
    where: {
      kanjiId: kanji.id,
      type: { not: 'grouping' }
    }
  });

  const newQuizzes = [
    // --- UNSCRAMBLE QUIZZES (5) ---
    // Header from prompt: Susunlah kalimat dari kata-kata berikut.
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kalimat dari kata-kata berikut.',
      options: JSON.stringify([]),
      // Prompt 1: 意向が ・ 書いてあります ・ 書類に
      words: JSON.stringify(['意向が', '書いてあります', '書類に']),
      correctOrder: JSON.stringify(['書類に', '意向が', '書いてあります']),
      correctAnswer: '0',
      explanation: 'Jawaban: 書類に意向が書いてあります。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kalimat dari kata-kata berikut.',
      options: JSON.stringify([]),
      // Prompt 2: 意図を ・ 理解するのを ・ 相手の ・ 忘れました
      words: JSON.stringify(['意図を', '理解するのを', '相手の', '忘れました']),
      correctOrder: JSON.stringify(['相手の', '意図を', '理解するのを', '忘れました']),
      correctAnswer: '0',
      explanation: 'Jawaban: 相手の意図を理解するのを忘れました。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kalimat dari kata-kata berikut.',
      options: JSON.stringify([]),
      // Prompt 3: 決意しようと ・ 留学を ・ 思っています
      words: JSON.stringify(['決意しようと', '留学を', '思っています']),
      correctOrder: JSON.stringify(['留学を', '決意しようと', '思っています']),
      correctAnswer: '0',
      explanation: 'Jawaban: 留学を決意しようと思っています。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kalimat dari kata-kata berikut.',
      options: JSON.stringify([]),
      // Prompt 4: 出るでしょう ・意欲を・ 勉強の
      words: JSON.stringify(['出るでしょう', '意欲を', '勉強の']),
      correctOrder: JSON.stringify(['勉強の', '意欲を', '出るでしょう']),
      correctAnswer: '0',
      explanation: 'Jawaban: 勉強の意欲を出るでしょう。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kalimat dari kata-kata berikut.',
      options: JSON.stringify([]),
      // Prompt 5: あるかもしれません ・ 言葉に・悪意が
      words: JSON.stringify(['あるかもしれません', '言葉に', '悪意が']),
      correctOrder: JSON.stringify(['言葉に', '悪意が', 'あるかもしれません']),
      correctAnswer: '0',
      explanation: 'Jawaban: 言葉に悪意があるかもしれません。'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “makna atau arti dari sesuatu”?',
      options: JSON.stringify(['意味', '意見', '意識']),
      correctAnswer: '0', // a. 意味
      explanation: 'Jawaban tepat: a. 意味 (imi) - makna/arti.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “pendapat atau pandangan seseorang mengenai suatu hal”?',
      options: JSON.stringify(['意思', '意見', '意図']),
      correctAnswer: '1', // b. 意見
      explanation: 'Jawaban tepat: b. 意見 (iken) - pendapat/pandangan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “kehendak atau kemauan seseorang untuk melakukan sesuatu”?',
      options: JSON.stringify(['意思', '注意', '同意']),
      correctAnswer: '0', // a. 意思
      explanation: 'Jawaban tepat: a. 意思 (ishi) - kehendak/kemauan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “maksud atau tujuan yang ingin dicapai atau dilakukan seseorang”?',
      options: JSON.stringify(['意識', '意図', '好意']),
      correctAnswer: '1', // b. 意図
      explanation: 'Jawaban tepat: b. 意図 (ito) - maksud/tujuan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “kesadaran terhadap sesuatu”?',
      options: JSON.stringify(['意識', '意志', '意向']),
      correctAnswer: '0', // a. 意識
      explanation: 'Jawaban tepat: a. 意識 (ishiki) - kesadaran.'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'この言葉の（　　　）がよくわかりません。',
      options: JSON.stringify(['意味', '意識', '同意']),
      correctAnswer: '0', // a. 意味
      explanation: 'Jawaban tepat: a. 意味 (imi).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '私はその考えについて、自分の（　　　）を言いました。',
      options: JSON.stringify(['意図', '意識', '意見']),
      correctAnswer: '2', // c. 意見
      explanation: 'Jawaban tepat: c. 意見 (iken).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '将来、日本で働きたいという（　　　）を持っています。',
      options: JSON.stringify(['同意', '意志', '意見']),
      correctAnswer: '1', // b. 意志
      explanation: 'Jawaban tepat: b. 意志 (ishi).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '先生が何を伝えたいのか、その（　　　）を考えてください。',
      options: JSON.stringify(['意識', '意見', '意図']),
      correctAnswer: '2', // c. 意図
      explanation: 'Jawaban tepat: c. 意図 (ito).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'みんながその計画に（　　　）したので、来月から始めます。',
      options: JSON.stringify(['同意', '意識', '意味']),
      correctAnswer: '0', // a. 同意
      explanation: 'Jawaban tepat: a. 同意 (doui).'
    }
  ];

  for (const q of newQuizzes) {
    await prisma.quiz.create({
      data: q
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 意.`);
  if (groupingQuiz) {
    console.log(`Grouping quiz ID ${groupingQuiz.id} was retained intact.`);
  }

  await prisma.$disconnect();
}

updateIQuizzes().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
