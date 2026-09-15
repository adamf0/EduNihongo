import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkKanjiShou() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '商' },
    include: { quizzes: true }
  });

  console.log('Kanji 商:', JSON.stringify(kanji, null, 2));
  await prisma.$disconnect();
}

checkKanjiShou().catch(err => {
  console.error(err);
  prisma.$disconnect();
});
