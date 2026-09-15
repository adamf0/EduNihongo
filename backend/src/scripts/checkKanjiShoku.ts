import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkKanjiShoku() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '職' },
    include: { quizzes: true }
  });

  console.log('Kanji 職:', JSON.stringify(kanji, null, 2));
  await prisma.$disconnect();
}

checkKanjiShoku().catch(err => {
  console.error(err);
  prisma.$disconnect();
});
