import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const kanjis = await prisma.kanji.findMany({
    where: { moduleId: { not: null } },
    orderBy: [{ moduleId: 'asc' }, { id: 'asc' }],
    include: {
      quizzes: { where: { type: 'grouping' } },
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
    console.log(`\n=== Kanji: ${k.character} (ID: ${k.id}, Modul: ${k.moduleId}) ===`);
    
    // Semantic Graph Categories
    const semanticCatMap: Record<string, string[]> = {};
    for (const j of k.jukugos) {
      const catNames = j.kategoriKanji.map(kk => kk.category.name);
      if (catNames.length === 0) {
        catNames.push('Kombinasi Utama');
      }
      for (const cn of catNames) {
        if (!semanticCatMap[cn]) semanticCatMap[cn] = [];
        semanticCatMap[cn].push(j.word);
      }
    }
    console.log('Semantic Graph Categories:');
    for (const [cName, words] of Object.entries(semanticCatMap)) {
      console.log(`  [${cName}] (${words.length}): ${words.join(', ')}`);
    }

    const gq = k.quizzes[0];
    if (!gq) {
      console.log('  -> NO GROUPING QUIZ!');
      continue;
    }

    console.log('Grouping Quiz Data:');
    console.log(`  Question: ${gq.question}`);
    console.log(`  Words: ${gq.words}`);
    console.log(`  Groups: ${gq.groups}`);
  }
}

main().finally(() => prisma.$disconnect());
