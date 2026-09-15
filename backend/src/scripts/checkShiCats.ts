import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const kanjiShi = await prisma.kanji.findFirst({
    where: { character: '試' },
    include: {
      jukugos: {
        include: {
          kategoriKanji: {
            include: { category: true }
          }
        }
      }
    }
  });

  console.log('Kanji 試 Jukugos and their categories:');
  for (const j of kanjiShi?.jukugos || []) {
    const cats = j.kategoriKanji.map(k => k.category.name).join(', ');
    console.log(`  ${j.word} -> ${cats}`);
  }
}

main().finally(() => prisma.$disconnect());
