import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkKanjiGi() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '議' },
    include: { quizzes: true }
  });

  console.log('Kanji 議:', JSON.stringify(kanji, null, 2));
  await prisma.$disconnect();
}

checkKanjiGi().catch(err => {
  console.error(err);
  prisma.$disconnect();
});
