import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkKanjiShin() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '信' },
    include: { quizzes: true }
  });

  console.log('Kanji 信:', JSON.stringify(kanji, null, 2));
  await prisma.$disconnect();
}

checkKanjiShin().catch(err => {
  console.error(err);
  prisma.$disconnect();
});
