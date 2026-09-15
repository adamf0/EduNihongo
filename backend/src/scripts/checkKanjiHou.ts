import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkKanjiHou() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '報' },
    include: { quizzes: true }
  });

  console.log('Kanji 報:', JSON.stringify(kanji, null, 2));
  await prisma.$disconnect();
}

checkKanjiHou().catch(err => {
  console.error(err);
  prisma.$disconnect();
});
