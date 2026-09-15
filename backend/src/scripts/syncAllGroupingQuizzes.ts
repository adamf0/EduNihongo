import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function syncGroupingQuizzes() {
  console.log("🚀 Starting synchronization of all Grouping Quizzes from Modul 1 to Modul 6...");

  const kanjis = await prisma.kanji.findMany({
    where: {
      moduleId: { not: null }
    },
    include: {
      module: true,
      jukugos: {
        include: {
          kategoriKanji: {
            include: {
              category: true
            }
          }
        }
      }
    },
    orderBy: [
      { moduleId: 'asc' },
      { id: 'asc' }
    ]
  });

  console.log(`Found ${kanjis.length} learning kanjis in DB.\n`);

  let updatedCount = 0;

  for (const kanji of kanjis) {
    const char = kanji.character;
    
    // Group Jukugos by Category from DB
    const categoryMap = new Map<string, string[]>();
    const allWordsSet = new Set<string>();

    for (const jk of kanji.jukugos) {
      const categories = jk.kategoriKanji.map(k => k.category.name);
      if (categories.length === 0) {
        categories.push("Kombinasi Utama");
      }

      allWordsSet.add(jk.word.trim());

      for (const catName of categories) {
        if (!categoryMap.has(catName)) {
          categoryMap.set(catName, []);
        }
        if (!categoryMap.get(catName)!.includes(jk.word.trim())) {
          categoryMap.get(catName)!.push(jk.word.trim());
        }
      }
    }

    // Sort categories by leading number if present (1., 2., etc.)
    const sortedCategories = Array.from(categoryMap.entries()).sort(([nameA], [nameB]) => {
      const matchA = nameA.match(/^(\d+)\./);
      const matchB = nameB.match(/^(\d+)\./);
      if (matchA && matchB) {
        return parseInt(matchA[1], 10) - parseInt(matchB[1], 10);
      }
      return 0;
    });

    function shuffleArray<T>(array: T[]): T[] {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    const allWords = shuffleArray(Array.from(allWordsSet));
    const groups: Record<string, string[]>[] = sortedCategories.map(([catName, words]) => ({
      [catName]: words
    }));

    if (allWords.length === 0 || groups.length === 0) {
      console.warn(`⚠️ Skipping ${char} (ID: ${kanji.id}) - No jukugos or categories found.`);
      continue;
    }

    const question = "Kelompokkan jukugo berikut ini ke dalam cabang semantic graph yang tepat.";
    const explanation = `Pengelompokan jukugo berdasarkan cabang semantic graph kanji ${char}.`;

    // Upsert Grouping Quiz
    const existingQuiz = await prisma.quiz.findFirst({
      where: {
        kanjiId: kanji.id,
        type: "grouping"
      }
    });

    if (existingQuiz) {
      await prisma.quiz.update({
        where: { id: existingQuiz.id },
        data: {
          question,
          words: JSON.stringify(allWords),
          groups: JSON.stringify(groups),
          explanation
        }
      });
      console.log(`✅ Updated Grouping Quiz for Kanji ${char} (${kanji.module?.title || kanji.moduleId}) - ${allWords.length} words, ${groups.length} categories.`);
    } else {
      await prisma.quiz.create({
        data: {
          kanjiId: kanji.id,
          type: "grouping",
          question,
          words: JSON.stringify(allWords),
          groups: JSON.stringify(groups),
          explanation
        }
      });
      console.log(`✨ Created new Grouping Quiz for Kanji ${char} (${kanji.module?.title || kanji.moduleId}) - ${allWords.length} words, ${groups.length} categories.`);
    }

    updatedCount++;
  }

  console.log(`\n🎉 Successfully synchronized ${updatedCount} Grouping Quizzes across Modul 1 to Modul 6!`);
}

syncGroupingQuizzes()
  .catch(e => {
    console.error("Error syncing grouping quizzes:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
