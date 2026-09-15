import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateDanQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '談' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 談 not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 談 (ID: ${kanji.id})...`);

  // Preserve grouping quiz if exists
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete non-grouping quizzes for kanji 談
  await prisma.quiz.deleteMany({
    where: {
      kanjiId: kanji.id,
      type: { not: 'grouping' }
    }
  });

  const newQuizzes = [
    // --- UNSCRAMBLE QUIZZES (5) ---
    // Header from prompt: Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 1: 参加するのは ・ 座談会に ・ 楽しいです
      words: JSON.stringify(['参加するのは', '座談会に', '楽しいです']),
      correctOrder: JSON.stringify(['座談会に', '参加するのは', '楽しいです']),
      correctAnswer: '0',
      explanation: 'Jawaban:座談会に参加するのは楽しいです。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 2: 用談・ あるかもしれません ・ 急な・が
      words: JSON.stringify(['あるかもしれません', '急な', '用談', 'が']),
      correctOrder: JSON.stringify(['急な', '用談', 'が', 'あるかもしれません']),
      correctAnswer: '0',
      explanation: 'Jawaban:急な用談があるかもしれません。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 3: 発表されました ・で・ 談話が ・ ニュース
      words: JSON.stringify(['発表されました', 'で', '談話が', 'ニュース']),
      correctOrder: JSON.stringify(['ニュース', 'で', '談話が', '発表されました']),
      correctAnswer: '0',
      explanation: 'Jawaban:ニュースで談話がされました。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 4: 談笑できるように ・ 話します ・ 楽しく
      words: JSON.stringify(['話します', '楽しく', '談笑できるように']),
      correctOrder: JSON.stringify(['談笑できるように', '楽しく', '話します']),
      correctAnswer: '0',
      explanation: 'Jawaban：談笑できるように、楽しくはなします。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 5: 談合しない ・ いいです ・ ほうが・みんなで
      words: JSON.stringify(['談合しない', 'いいです', 'ほうが', 'みんなで']),
      correctOrder: JSON.stringify(['みんなで', '談合しない', 'ほうが', 'いいです']),
      correctAnswer: '0',
      explanation: 'Jawaban：みんなで談合しない方がいいです。'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “pertemuan untuk berbicara atau berunding mengenai suatu hal”?',
      options: JSON.stringify(['会談', '談笑', '冗談']),
      correctAnswer: '0', // a. 会談
      explanation: 'Jawaban tepat: a. 会談 (kaidan) - pertemuan/perundingan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “percakapan atau dialog antar dua orang atau pihak”?',
      options: JSON.stringify(['対談', '直談', '談話']),
      correctAnswer: '0', // a. 対談
      explanation: 'Jawaban tepat: a. 対談 (taidan) - percakapan/dialog dua pihak.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “percakapan santai bersama”?',
      options: JSON.stringify(['座談', '商談', '面談']),
      correctAnswer: '0', // a. 座談
      explanation: 'Jawaban tepat: a. 座談 (zadan) - percakapan santai bersama.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “berbicara atau bertemu secara langsung”?',
      options: JSON.stringify(['相談', '直談', '雑談']),
      correctAnswer: '1', // b. 直談
      explanation: 'Jawaban tepat: b. 直談 (jikidan) - pembicaraan langsung.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “berkonsultasi atau meminta pendapat seseorang mengenai suatu masalah”?',
      options: JSON.stringify(['用談', '相談', '談笑']),
      correctAnswer: '1', // b. 相談
      explanation: 'Jawaban tepat: b. 相談 (soudan) - berkonsultasi.'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '来週、日本とアメリカの代表が（　　　）を行う予定です。',
      options: JSON.stringify(['会談', '面談', '雑談']),
      correctAnswer: '0', // a. 会談
      explanation: 'Jawaban tepat: a. 会談 (kaidan).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '二人の作家がテレビで（　　　）をしています。',
      options: JSON.stringify(['対談', '相談', '商談']),
      correctAnswer: '0', // a. 対談
      explanation: 'Jawaban tepat: a. 対談 (taidan).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '先生と学生が一対一で（　　　）することになりました。',
      options: JSON.stringify(['会談', '雑談', '面談']),
      correctAnswer: '2', // c. 面談
      explanation: 'Jawaban tepat: c. 面談 (mendan).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '会社の人と新しい商品について（　　　）をしました。',
      options: JSON.stringify(['会談', '商談', '雑談']),
      correctAnswer: '1', // b. 商談
      explanation: 'Jawaban tepat: b. 商談 (shoudan).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '休み時間に友達と（　　　）するのは楽しいです。',
      options: JSON.stringify(['雑談', '面談', '商談']),
      correctAnswer: '0', // a. 雑談
      explanation: 'Jawaban tepat: a. 雑談 (zatsudan).'
    }
  ];

  for (const q of newQuizzes) {
    await prisma.quiz.create({
      data: q
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 談.`);
  if (groupingQuiz) {
    console.log(`Grouping quiz ID ${groupingQuiz.id} was retained intact.`);
  }

  await prisma.$disconnect();
}

updateDanQuizzes().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
