import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateChouQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '調' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 調 not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 調 (ID: ${kanji.id})...`);

  // Preserve grouping quiz
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete non-grouping quizzes for kanji 調
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
      // Scrambled pool from prompt: 聞きながら ・ 調理します ・ を ・ 音楽
      words: JSON.stringify(['聞きながら', '調理します', 'を', '音楽']),
      correctOrder: JSON.stringify(['音楽', 'を', '聞きながら', '調理します']),
      correctAnswer: '0',
      explanation: 'Jawaban: 音楽を聞きながら調理します。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 行きます ・ 悪い ・ 病院 ・ 体調 ・ とき ・ が ・ へ
      words: JSON.stringify(['行きます', '悪い', '病院', '体調', 'とき', 'が', 'へ']),
      correctOrder: JSON.stringify(['体調', 'が', '悪い', 'とき', '病院', 'へ', '行きます']),
      correctAnswer: '0',
      explanation: 'Jawaban: 体調が悪いとき、病院へ行きます。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: に ・ 調味料 ・ が ・ おいてあります
      words: JSON.stringify(['に', '調味料', 'が', 'おいてあります']),
      correctOrder: JSON.stringify(['に', '調味料', 'が', 'おいてあります']),
      correctAnswer: '0',
      explanation: 'Jawaban: に調味料がおいてあります。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 思っています ・ で ・ 辞書 ・ 調べよう ・ を ・ 意味 ・ と
      words: JSON.stringify(['思っています', 'で', '辞書', '調べよう', 'を', '意味', 'と']),
      correctOrder: JSON.stringify(['辞書', 'で', '意味', 'を', '調べよう', 'と', '思っています']),
      correctAnswer: '0',
      explanation: 'Jawaban: 辞書で意味を調べようと思っています。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 休んだ ・ 体調が ・ 悪い ・ いいです ・ 方が ・ とき
      words: JSON.stringify(['休んだ', '体調が', '悪い', 'いいです', '方が', 'とき']),
      correctOrder: JSON.stringify(['体調が', '悪い', 'とき', '休んだ', '方が', 'いいです']),
      correctAnswer: '0',
      explanation: 'Jawaban: 体調が悪いとき、休んだほうがいいです。'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan "kegiatan memeriksa atau menyelidiki suatu objek agar mendapatkah data yang benar"?',
      options: JSON.stringify(['調理', '調査', '調薬']),
      correctAnswer: '1', // b. 調査
      explanation: 'Jawaban tepat: b. 調査 (chousa) - pemeriksaan/penyelidikan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna "kegiatan memasak atau menyiapkan makanan "?',
      options: JSON.stringify(['調理', '調査', '調子']),
      correctAnswer: '0', // a. 調理
      explanation: 'Jawaban tepat: a. 調理 (chouri) - memasak.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna " mencampurkan beberapa bahan agar hasilnya menjadi suatu komposisi yang sesuai dengan dinginkan?',
      options: JSON.stringify(['調合', '調査', '調薬']),
      correctAnswer: '0', // a. 調合
      explanation: 'Jawaban tepat: a. 調合 (chougou) - mencampurkan bahan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna "keadaan tubuh atau kondisi kesehatan "?',
      options: JSON.stringify(['歩調', '語調', '体調']),
      correctAnswer: '2', // c. 体調
      explanation: 'Jawaban tepat: c. 体調 (taichou) - kondisi kesehatan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna "kemampuan memusatkan perhatian saat belajar "?',
      options: JSON.stringify(['調理', '調子', '強調']),
      correctAnswer: '2', // c. 強調
      explanation: 'Jawaban tepat: c. 強調 (kyouchou) - penegasan/fokus.'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '風邪をひいているので、今日は（　　　　）があまりよくありません。',
      options: JSON.stringify(['語調', '体調', '調書']),
      correctAnswer: '1', // b. 体調
      explanation: 'Jawaban tepat: b. 体調 (taichou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '先生は大事なところを（　　　　）しながら説明しました。',
      options: JSON.stringify(['強調', '調理', '調合']),
      correctAnswer: '0', // a. 強調
      explanation: 'Jawaban tepat: a. 強調 (kyouchou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '医者は病気について（　　　　）を行っています。',
      options: JSON.stringify(['調理', '調査', '調味料']),
      correctAnswer: '1', // b. 調査
      explanation: 'Jawaban tepat: b. 調査 (chousa).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '母は夕食の前にラーメンを（　　　　）しています。',
      options: JSON.stringify(['調印', '調理', '歩調']),
      correctAnswer: '1', // b. 調理
      explanation: 'Jawaban tepat: b. 調理 (chouri).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'みんなで同じ（　　　　）で歩きましょう。',
      options: JSON.stringify(['歩調', '好調', '調書']),
      correctAnswer: '0', // a. 歩調
      explanation: 'Jawaban tepat: a. 歩調 (hochou).'
    }
  ];

  for (const q of newQuizzes) {
    await prisma.quiz.create({
      data: q
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 調.`);
  if (groupingQuiz) {
    console.log(`Grouping quiz ID ${groupingQuiz.id} was retained intact.`);
  }

  await prisma.$disconnect();
}

updateChouQuizzes().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
