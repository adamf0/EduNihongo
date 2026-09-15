import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkKanjiRon() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '論' },
    include: { quizzes: true }
  });

  console.log('Kanji 論:', JSON.stringify(kanji, null, 2));
  await prisma.$disconnect();
}

checkKanjiRon().catch(err => {
  console.error(err);
  prisma.$disconnect();
});
