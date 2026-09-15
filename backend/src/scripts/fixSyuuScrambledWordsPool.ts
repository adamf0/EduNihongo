import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixSyuuScrambledWords() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '集' }
  });

  if (!kanji) {
    console.error('Kanji 集 not found in database!');
    process.exit(1);
  }

  console.log(`Fixing scrambled words pool for Kanji 集 (ID: ${kanji.id})...`);

  // Delete existing unscramble quizzes for kanji 集
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
      // Scrambled pool from prompt: ① 準備してあります ・ 事前に ・ 採集の ・ 工具が
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
      // Scrambled pool from prompt: ② 建物が ・ 密集しています ・ この ・ 地域は
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
      // Scrambled pool from prompt: ③ 買おうと ・ 小説の ・ 選集を ・ 思っています
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
      // Scrambled pool from prompt: ④ いいです ・ 行動した ・ ほうが ・ 集団で
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
      // Scrambled pool from prompt: ⑤ 参加しようと ・ 思っています ・ 集会に ・ 明日の
      words: JSON.stringify(['参加しようと', '思っています', '集会に', '明日の']),
      correctOrder: JSON.stringify(['明日の', '集会に', '参加しようと', '思っています']),
      correctAnswer: '0',
      explanation: 'Jawaban: 明日の集会に参加しようと思っています。'
    }
  ];

  for (const q of unscrambleQuizzes) {
    await prisma.quiz.create({ data: q });
  }

  console.log(`Successfully created 5 scrambled unscramble quizzes for Kanji 集.`);
  await prisma.$disconnect();
}

fixSyuuScrambledWords().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
