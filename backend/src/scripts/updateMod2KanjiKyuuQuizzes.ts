import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateKyuuQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '究' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 究 (Module 2) not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 究 (ID: ${kanji.id})...`);

  // Preserve grouping quiz
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete non-grouping quizzes for kanji 究
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
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 究理を ・ 自然の ・ 思っています ・ 勉強しようと ・ もっと
      words: JSON.stringify(['究理を', '自然の', '思っています', '勉強しようと', 'もっと']),
      correctOrder: JSON.stringify(['自然の', '究理を', 'もっと', '勉強しようと', '思っています']),
      correctAnswer: '0',
      explanation: 'Jawaban: 自然の究理をもっと勉強しようと思っています。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: しっかり ・ 考究した ・ ほうが ・ いいです ・ 計画を
      words: JSON.stringify(['しっかり', '考究した', 'ほうが', 'いいです', '計画を']),
      correctOrder: JSON.stringify(['計画を', 'しっかり', '考究した', 'ほうが', 'いいです']),
      correctAnswer: '0',
      explanation: 'Jawaban: 計画をしっかり考究したほうがいいです。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 真実を ・ 追究しながら ・ 書きます ・ 論文を
      words: JSON.stringify(['真実を', '追究しながら', '書きます', '論文を']),
      correctOrder: JSON.stringify(['真実を', '追究しながら', '論文を', '書きます']),
      correctAnswer: '0',
      explanation: 'Jawaban: 真実を追究しながら論文を書きます。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 論究するでしょう ・ 深く ・ 問題を ・ 専門家が
      words: JSON.stringify(['論究するでしょう', '深く', '問題を', '専門家が']),
      correctOrder: JSON.stringify(['専門家が', '問題を', '深く', '論究するでしょう']),
      correctAnswer: '0',
      explanation: 'Jawaban: 専門家が問題を深く論究するでしょう。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 考究しようと ・ 専門的な ・ 思っています ・ 問題を
      words: JSON.stringify(['考究しようと', '専門的な', '思っています', '問題を']),
      correctOrder: JSON.stringify(['専門的な', '問題を', '考究しようと', '思っています']),
      correctAnswer: '0',
      explanation: 'Jawaban: 専門的な問題を考究しようと思っています。'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “mencari dan menyelidiki suatu hal secara mendalam sampai memahami hakikatnya"?',
      options: JSON.stringify(['究明', '探究', '論究']),
      correctAnswer: '1', // b. 探究
      explanation: 'Jawaban tepat: b. 探究 (tankyuu).'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “menelusuri atau menyelidiki suatu persoalan secara terus-menerus sampai memperoleh kejelasan"?',
      options: JSON.stringify(['考究', '究理', '追究']),
      correctAnswer: '2', // c. 追究
      explanation: 'Jawaban tepat: c. 追究 (tsuikyuu).'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “membahas atau menguraikan suatu persoalan secara mendalam"?',
      options: JSON.stringify(['論究', '探究', '究明']),
      correctAnswer: '0', // a. 論究
      explanation: 'Jawaban tepat: a. 論究 (ronkyuu).'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “mendalami prinsip, alasan, atau hakikat suatu hal sampai tuntas"?',
      options: JSON.stringify(['討究', '究理', '研究']),
      correctAnswer: '1', // b. 究理
      explanation: 'Jawaban tepat: b. 究理 (kyuuri).'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “menyelidiki suatu hal secara mendalam sampai kebenaran atau penyebabnya menjadi jelas"?',
      options: JSON.stringify(['講究', '追究', '究明']),
      correctAnswer: '2', // c. 究明
      explanation: 'Jawaban tepat: c. 究明 (kyuumei).'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '卒業論文のために、日本の若者の言葉について（　　　　）するつもりです。',
      options: JSON.stringify(['究明', '研究', '究理']),
      correctAnswer: '1', // b. 研究
      explanation: 'Jawaban tepat: b. 研究 (kenkyuu).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'この問題についてもっと深く知りたいんですが、（　　　　）したほうがいいです。',
      options: JSON.stringify(['探究', '究明', '論究']),
      correctAnswer: '0', // a. 探究
      explanation: 'Jawaban tepat: a. 探究 (tankyuu).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '事故の原因はまだわかりません。これから詳しく（　　　　）するでしょう。',
      options: JSON.stringify(['考究', '究理', '究明']),
      correctAnswer: '2', // c. 究明
      explanation: 'Jawaban tepat: c. 究明 (kyuumei).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'この問題について専門家と深く（　　　　）する予定です。',
      options: JSON.stringify(['探究', '討究', '究明']),
      correctAnswer: '1', // b. 討究
      explanation: 'Jawaban tepat: b. 討究 (toukyuu).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'この理論の意味や本質を理解するために、詳しく（　　　　）するつもりです。',
      options: JSON.stringify(['追究', '考究', '究明']),
      correctAnswer: '1', // b. 考究
      explanation: 'Jawaban tepat: b. 考究 (koukyuu).'
    }
  ];

  for (const q of newQuizzes) {
    await prisma.quiz.create({
      data: q
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 究.`);
  if (groupingQuiz) {
    console.log(`Grouping quiz ID ${groupingQuiz.id} was retained intact.`);
  }

  await prisma.$disconnect();
}

updateKyuuQuizzes().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
