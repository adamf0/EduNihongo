import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function inspectShoku() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: "職" },
    include: {
      graphEdges: true,
      quizzes: true,
    }
  });

  if (!kanji) {
    console.log("Kanji 職 not found");
    return;
  }

  console.log("Kanji ID:", kanji.id);
  console.log("Graph Edges count:", kanji.graphEdges.length);
  console.log("Graph Edges:");
  kanji.graphEdges.forEach(e => console.log(`  ${e.id}: ${e.source} -> ${e.target}`));

  const jukugos = await prisma.jukugo.findMany({
    where: { kanjiId: kanji.id },
    include: {
      kategoriKanji: {
        include: {
          category: true
        }
      }
    }
  });

  console.log("\nJukugos count:", jukugos.length);
  jukugos.forEach(j => {
    console.log(`  Jukugo ${j.id} [${j.word}]:`);
    j.kategoriKanji.forEach(kk => console.log(`    - Cat ID ${kk.categoryId}: "${kk.category.name}"`));
  });
}

inspectShoku()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
