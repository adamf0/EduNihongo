import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkKanjiJou() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '情' },
    include: { quizzes: true }
  });

  console.log('Kanji 情:', kanji);
  await prisma.$disconnect();
}

checkKanjiJou().catch(err => {
  console.error(err);
  prisma.$disconnect();
});
