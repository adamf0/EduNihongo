import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function inspectDeepShoku() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: "職" },
  });

  if (!kanji) return;

  console.log("=== ALL JUKUGOS FOR KANJI 職 ===");
  const allJukugos = await prisma.jukugo.findMany({
    where: { kanjiId: kanji.id },
    include: {
      kategoriKanji: {
        include: {
          category: true
        }
      }
    }
  });

  allJukugos.forEach(j => {
    console.log(`Jukugo ID ${j.id}: word="${j.word}", reading="${j.reading}", meaning="${j.meaning}"`);
    j.kategoriKanji.forEach(kk => {
      console.log(`   -> KategoriKanji ID ${kk.id}: Category ID ${kk.categoryId} ("${kk.category.name}")`);
    });
  });

  console.log("\n=== ALL MASTER CATEGORIES IN DB ===");
  const allCats = await prisma.masterCategory.findMany();
  allCats.forEach(c => {
    if (c.name.toLowerCase().includes("profesi") || c.name.toLowerCase().includes("kerja") || c.name.toLowerCase().includes("pekerjaan") || c.name.toLowerCase().includes("shoku")) {
      console.log(`MasterCategory ID ${c.id}: "${c.name}"`);
    }
  });
}

inspectDeepShoku()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
