import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkKanjiMu() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '務' },
    include: { quizzes: true }
  });

  console.log('Kanji 務:', JSON.stringify(kanji, null, 2));
  await prisma.$disconnect();
}

checkKanjiMu().catch(err => {
  console.error(err);
  prisma.$disconnect();
});
