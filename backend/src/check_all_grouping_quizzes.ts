import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const kanjis = await prisma.kanji.findMany({
    where: {
      moduleId: { not: null }
    },
    include: {
      module: true,
      jukugos: {
        include: {
          kategoriKanji: {
            include: { category: true }
          }
        }
      },
      quizzes: {
        where: { type: 'grouping' }
      }
    },
    orderBy: [
      { moduleId: 'asc' },
      { id: 'asc' }
    ]
  });

  console.log(`Total main learning Kanjis across modules: ${kanjis.length}\n`);

  for (const k of kanjis) {
    console.log(`Kanji: ${k.character} (ID: ${k.id}, Module: ${k.module?.title || k.moduleId})`);
    
    // Build DB categories & jukugos map
    const catMap = new Map<string, string[]>();
    for (const jk of k.jukugos) {
      const cats = jk.kategoriKanji.map(kk => kk.category.name);
      if (cats.length === 0) {
        cats.push('Kombinasi Utama');
      }
      for (const catName of cats) {
        if (!catMap.has(catName)) catMap.set(catName, []);
        catMap.get(catName)!.push(jk.word);
      }
    }

    console.log(`  - Total Jukugos in DB: ${k.jukugos.length}`);
    console.log(`  - Categories count: ${catMap.size}`);
    catMap.forEach((words, catName) => {
      console.log(`     * Category "${catName}": ${words.length} words -> [${words.join(', ')}]`);
    });

    const groupingQuiz = k.quizzes[0];
    if (!groupingQuiz) {
      console.log(`  ⚠️ NO GROUPING QUIZ IN DB!`);
    } else {
      console.log(`  - Grouping Quiz ID: ${groupingQuiz.id}`);
      console.log(`  - Question: "${groupingQuiz.question}"`);
      console.log(`  - Quiz Words: ${groupingQuiz.words}`);
      console.log(`  - Quiz Groups: ${groupingQuiz.groups}`);
    }
    console.log('--------------------------------------------------\n');
  }

  await prisma.$disconnect();
}

check().catch(console.error);
