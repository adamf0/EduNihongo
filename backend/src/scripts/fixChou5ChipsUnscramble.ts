import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixChou5Chips() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '調' }
  });

  if (!kanji) {
    console.error('Kanji 調 not found in database!');
    process.exit(1);
  }

  console.log(`Fixing unscramble quizzes for Kanji 調 (ID: ${kanji.id})...`);

  await prisma.quiz.deleteMany({
    where: {
      kanjiId: kanji.id,
      type: 'unscramble'
    }
  });

  const unscrambleQuizzes = [
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt (5 chips): 1.聞きながら・調理します・を・音楽・・を
      words: JSON.stringify(['聞きながら', '調理します', 'を', '音楽', 'を']),
      correctOrder: JSON.stringify(['音楽', 'を', '聞きながら', 'を', '調理します']),
      correctAnswer: '0',
      explanation: 'Jawaban: 音楽を聞きながら調理をします。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 2. 行きます・悪い・病院・体調・とき・が・へ
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
      // Scrambled pool from prompt: 3. に・調味料・が・おいてあります
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
      // Scrambled pool from prompt: 4. 思っています・で・辞書・調べよう・を・意味・と
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
      // Scrambled pool from prompt: 5. 休んだ・体調が・悪い・いいです・方が・とき
      words: JSON.stringify(['休んだ', '体調が', '悪い', 'いいです', '方が', 'とき']),
      correctOrder: JSON.stringify(['体調が', '悪い', 'とき', '休んだ', '方が', 'いいです']),
      correctAnswer: '0',
      explanation: 'Jawaban: 体調が悪いとき、休んだほうがいいです。'
    }
  ];

  for (const q of unscrambleQuizzes) {
    await prisma.quiz.create({ data: q });
  }

  console.log(`Successfully created 5 unscramble quizzes (with 5 chips for Q1) for Kanji 調.`);
  await prisma.$disconnect();
}

fixChou5Chips().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
