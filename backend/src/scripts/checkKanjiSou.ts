import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkKanjiSou() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '送' },
    include: { quizzes: true }
  });

  console.log('Kanji 送:', JSON.stringify(kanji, null, 2));
  await prisma.$disconnect();
}

checkKanjiSou().catch(err => {
  console.error(err);
  prisma.$disconnect();
});
