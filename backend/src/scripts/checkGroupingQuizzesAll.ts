import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const modules = await prisma.module.findMany({
    orderBy: { id: 'asc' },
    include: {
      kanjis: {
        orderBy: { id: 'asc' },
        include: {
          quizzes: {
            where: { type: 'grouping' }
          },
          jukugos: {
            include: {
              kategoriKanji: {
                include: { category: true }
              }
            }
          }
        }
      }
    }
  });

  for (const m of modules) {
    console.log(`\n=== Module ${m.id}: ${m.title} ===`);
    for (const k of m.kanjis) {
      const gq = k.quizzes[0];
      console.log(`  Kanji: ${k.character} (ID: ${k.id}), Jukugos in DB: ${k.jukugos.length}, Grouping Quiz: ${!!gq}`);
      if (gq) {
        console.log(`    Words: ${gq.words}`);
        console.log(`    Groups: ${gq.groups}`);
      } else {
        console.log(`    NO GROUPING QUIZ FOUND!`);
      }
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
