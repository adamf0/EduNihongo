import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function getModuleQuizzes() {
  const quizzes = await prisma.quiz.findMany({
    where: {
      type: 'multiple',
      kanjiRef: {
        moduleId: { not: null }
      }
    },
    include: {
      kanjiRef: {
        include: { module: true }
      }
    },
    orderBy: [{ kanjiId: 'asc' }, { id: 'asc' }]
  });

  const overThree = quizzes.filter(q => {
    try {
      const opts = JSON.parse(q.options || '[]');
      return opts.length > 3;
    } catch {
      return false;
    }
  });

  console.log(`Found ${overThree.length} main module quizzes with >3 options:\n`);
  overThree.forEach((q, idx) => {
    const opts = JSON.parse(q.options || '[]');
    const correctIdx = parseInt(q.correctAnswer || '0', 10);
    const correctText = opts[correctIdx] || q.correctAnswer;

    console.log(`--- [${idx + 1}] ${q.kanjiRef?.module?.title} | Kanji: ${q.kanjiRef?.character} (Quiz ID: ${q.id}) ---`);
    console.log(`Pertanyaan: ${q.question}`);
    console.log(`Pilihan (${opts.length}): ${opts.join(' / ')}`);
    console.log(`Jawaban Benar: [Index ${correctIdx}] "${correctText}"\n`);
  });
}

getModuleQuizzes().catch(console.error).finally(() => prisma.$disconnect());
