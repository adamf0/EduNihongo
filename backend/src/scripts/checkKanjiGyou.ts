import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkKanjiGyou() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '業' },
    include: { quizzes: true }
  });

  console.log('Kanji 業:', JSON.stringify(kanji, null, 2));
  await prisma.$disconnect();
}

checkKanjiGyou().catch(err => {
  console.error(err);
  prisma.$disconnect();
});
