import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkKanjiDen() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '伝' },
    include: { quizzes: true }
  });

  console.log('Kanji 伝:', JSON.stringify(kanji, null, 2));
  await prisma.$disconnect();
}

checkKanjiDen().catch(err => {
  console.error(err);
  prisma.$disconnect();
});
