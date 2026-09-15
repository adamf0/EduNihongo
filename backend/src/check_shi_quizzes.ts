import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '試' },
    include: {
      quizzes: true
    }
  });

  if (!kanji) {
    console.log('Kanji 試 not found in DB!');
  } else {
    console.log(`Kanji 試 found (ID: ${kanji.id}):`);
    console.log(`Total quizzes: ${kanji.quizzes.length}`);
    kanji.quizzes.forEach((q, idx) => {
      console.log(`\n--- Quiz ${idx + 1} (ID: ${q.id}, Type: ${q.type}) ---`);
      console.log(`Question: ${q.question}`);
      if (q.options) console.log(`Options: ${q.options}`);
      if (q.correctAnswer !== null) console.log(`CorrectAnswer: ${q.correctAnswer}`);
      if (q.words) console.log(`Words: ${q.words}`);
      if (q.correctOrder) console.log(`CorrectOrder: ${q.correctOrder}`);
      if (q.groups) console.log(`Groups: ${q.groups}`);
      if (q.explanation) console.log(`Explanation: ${q.explanation}`);
    });
  }

  await prisma.$disconnect();
}

check().catch(console.error);
