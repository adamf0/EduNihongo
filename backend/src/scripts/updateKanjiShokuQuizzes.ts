import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateShokuQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '職' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 職 not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 職 (ID: ${kanji.id})...`);

  // Preserve grouping quiz if exists
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete non-grouping quizzes for kanji 職
  await prisma.quiz.deleteMany({
    where: {
      kanjiId: kanji.id,
      type: { not: 'grouping' }
    }
  });

  const newQuizzes = [
    // --- UNSCRAMBLE QUIZZES (5) ---
    // Instruction from prompt: Susunlah kata-kata berikut ini menjadi kalimat yang benar.
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Prompt 1: 有職者が ・ 増えている ・ 最近 ・ んです
      words: JSON.stringify(['有職者が', '増えている', '最近', 'んです']),
      correctOrder: JSON.stringify(['最近', '有職者が', '増えている', 'んです']),
      correctAnswer: '0',
      explanation: 'Jawaban: 最近有職者が増えているんです。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Prompt 2: 辞職するな！ ・ 簡単に ・ 会社を
      words: JSON.stringify(['辞職するな！', '簡単に', '会社を']),
      correctOrder: JSON.stringify(['簡単に', '会社を', '辞職するな！']),
      correctAnswer: '0',
      explanation: 'Jawaban: 簡単に会社を辞職するな！'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Prompt 3: 職能を ・ 高めようと ・ 研修で ・ 思っています
      words: JSON.stringify(['職能を', '高めようと', '研修で', '思っています']),
      correctOrder: JSON.stringify(['研修で', '職能を', '高めようと', '思っています']),
      correctAnswer: '0',
      explanation: 'Jawaban: 研修で職能を高めようと思っています。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Prompt 4: しく ・ 書類に・書いてあります・ 職歴が
      words: JSON.stringify(['しく', '書類に', '書いてあります', '職歴が']),
      correctOrder: JSON.stringify(['書類に', '職歴が', 'しく', '書いてあります']),
      correctAnswer: '0',
      explanation: 'Jawaban: 書類に職歴が詳しく書いてあります。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Prompt 5: 休職した ・ 体調が ・ 方が ・ 悪いときは ・ いいです
      words: JSON.stringify(['休職した', '体調が', '方が', '悪いときは', 'いいです']),
      correctOrder: JSON.stringify(['体調が', '悪いときは', '休職した', '方が', 'いいです']),
      correctAnswer: '0',
      explanation: 'Jawaban: 体調が悪いときは休職した方がいいです。'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “profesi atau pekerjaan yang dilakukan seseorang”?',
      options: JSON.stringify(['職業', '職場', '職員']),
      correctAnswer: '0', // a. 職業
      explanation: 'Jawaban tepat: a. 職業 (shokugyou) - profesi/pekerjaan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “orang yang bekerja sebagai staf atau pegawai”?',
      options: JSON.stringify(['職人', '職員', '職業']),
      correctAnswer: '1', // b. 職員
      explanation: 'Jawaban tepat: b. 職員 (shokuin) - staf/pegawai.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “tempat seseorang bekerja”?',
      options: JSON.stringify(['職場', '職人', '求職']),
      correctAnswer: '0', // a. 職場
      explanation: 'Jawaban tepat: a. 職場 (shokuba) - tempat kerja.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “orang yang memiliki keterampilan tertentu dan bekerja sebagai pengrajin atau pekerja terampil”?',
      options: JSON.stringify(['職員', '職人', '職場']),
      correctAnswer: '1', // b. 職人
      explanation: 'Jawaban tepat: b. 職人 (shokunin) - pengrajin.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “berhenti dari pekerjaan”?',
      options: JSON.stringify(['退職', '職業', '有職']),
      correctAnswer: '0', // a. 退職
      explanation: 'Jawaban tepat: a. 退職 (taishoku) - berhenti dari pekerjaan.'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '私は大学を卒業したら、（　　　　）を探すつもりです。',
      options: JSON.stringify(['職場', '職業', '求職']),
      correctAnswer: '0', // a. 職場
      explanation: 'Jawaban tepat: a. 職場 (shokuba).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '父は銀行で（　　　　）をしています。',
      options: JSON.stringify(['職員', '職業', '職人']),
      correctAnswer: '0', // a. 職員
      explanation: 'Jawaban tepat: a. 職員 (shokuin).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '会社を変えたいんですが、（　　　　）したほうがいいですか。',
      options: JSON.stringify(['退職', '転職', '有職']),
      correctAnswer: '1', // b. 転職
      explanation: 'Jawaban tepat: b. 転職 (tenshoku).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '仕事がないので、今（　　　　）です。',
      options: JSON.stringify(['有職', '職人', '無職']),
      correctAnswer: '2', // c. 無職
      explanation: 'Jawaban tepat: c. 無職 (mushoku).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'ここは私の（　　　　）です。毎日ここで働いています。',
      options: JSON.stringify(['職場', '職業', '求職']),
      correctAnswer: '0', // a. 職場
      explanation: 'Jawaban tepat: a. 職場 (shokuba).'
    }
  ];

  for (const q of newQuizzes) {
    await prisma.quiz.create({
      data: q
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 職.`);
  if (groupingQuiz) {
    console.log(`Grouping quiz ID ${groupingQuiz.id} was retained intact.`);
  }

  await prisma.$disconnect();
}

updateShokuQuizzes().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
