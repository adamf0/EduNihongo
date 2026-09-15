import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkKanjiJutsu() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '術' },
    include: { quizzes: true }
  });

  console.log('Kanji 術:', JSON.stringify(kanji, null, 2));
  await prisma.$disconnect();
}

checkKanjiJutsu().catch(err => {
  console.error(err);
  prisma.$disconnect();
});
