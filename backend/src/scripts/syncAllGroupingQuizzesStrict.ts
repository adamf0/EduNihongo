import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=== SINKRONISASI SEMUA KUIS GROUPING (MODUL 1 S/D MODUL 6) ===");

  const kanjis = await prisma.kanji.findMany({
    where: { moduleId: { in: [555, 556, 557, 558, 559, 560] } },
    orderBy: [{ moduleId: "asc" }, { id: "asc" }],
    include: {
      quizzes: { where: { type: "grouping" } },
      jukugos: {
        include: {
          kategoriKanji: {
            include: { category: true }
          }
        }
      }
    }
  });

  console.log(`Ditemukan ${kanjis.length} Kanji di Modul 1 sampai 6.`);

  let updatedCount = 0;
  let createdCount = 0;

  for (const k of kanjis) {
    const categoryMap = new Map<string, string[]>();

    for (const j of k.jukugos) {
      const catNames = j.kategoriKanji.map((kk) => kk.category.name);
      if (catNames.length === 0) {
        catNames.push("Kombinasi Utama");
      }
      for (const cn of catNames) {
        if (!categoryMap.has(cn)) {
          categoryMap.set(cn, []);
        }
        if (!categoryMap.get(cn)!.includes(j.word)) {
          categoryMap.get(cn)!.push(j.word);
        }
      }
    }

    // Sort categories: prefer numeric prefix like "1. ", "2. "
    const sortedCategories = Array.from(categoryMap.entries()).sort(
      ([catA], [catB]) => {
        const matchA = catA.match(/^(\d+)[\.\)]/);
        const matchB = catB.match(/^(\d+)[\.\)]/);
        if (matchA && matchB) {
          return parseInt(matchA[1], 10) - parseInt(matchB[1], 10);
        }
        return catA.localeCompare(catB);
      }
    );

    const allWords = Array.from(
      new Set(sortedCategories.flatMap(([_, words]) => words))
    );

    const groupsData = sortedCategories.map(([name, correctWords]) => ({
      name,
      correctWords
    }));

    const existingGrouping = k.quizzes[0];

    if (existingGrouping) {
      await prisma.quiz.update({
        where: { id: existingGrouping.id },
        data: {
          question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
          words: JSON.stringify(allWords),
          groups: JSON.stringify(groupsData),
          explanation: `Pengelompokan jukugo berdasarkan cabang semantic graph kanji ${k.character}.`
        }
      });
      updatedCount++;
    } else {
      await prisma.quiz.create({
        data: {
          kanjiId: k.id,
          type: "grouping",
          question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
          words: JSON.stringify(allWords),
          groups: JSON.stringify(groupsData),
          explanation: `Pengelompokan jukugo berdasarkan cabang semantic graph kanji ${k.character}.`
        }
      });
      createdCount++;
    }

    console.log(
      `✓ Kanji ${k.character} (ID: ${k.id}, Modul: ${k.moduleId}): ${allWords.length} jukugo dikelompokkan ke dalam ${groupsData.length} kategori.`
    );
  }

  console.log(
    `\n=== SELESAI: ${updatedCount} kuis diperbarui, ${createdCount} kuis dibuat. Total: ${kanjis.length} kanji. ===`
  );
}

main()
  .catch((e) => {
    console.error("Error sinkronisasi grouping quizzes:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
