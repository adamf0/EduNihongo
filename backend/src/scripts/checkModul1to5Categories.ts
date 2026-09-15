import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const kanjis = await prisma.kanji.findMany({
    where: { moduleId: { in: [555, 556, 557, 558, 559] } },
    orderBy: [{ moduleId: 'asc' }, { id: 'asc' }],
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

  for (const k of kanjis) {
    const catMap = new Map<string, string[]>();
    for (const j of k.jukugos) {
      const cats = j.kategoriKanji.map(kk => kk.category.name);
      for (const c of cats) {
        if (!catMap.has(c)) catMap.set(c, []);
        catMap.get(c)!.push(j.word);
      }
    }
    console.log(`\nModul ${k.moduleId} - Kanji ${k.character} (ID: ${k.id}, Total Jukugo: ${k.jukugos.length}):`);
    for (const [catName, words] of catMap.entries()) {
      console.log(`  [${catName}] (${words.length}): ${words.join(', ')}`);
    }
  }
}

main().finally(() => prisma.$disconnect());
