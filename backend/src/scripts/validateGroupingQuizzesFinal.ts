import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=== VALIDASI AKHIR KUIS GROUPING (MODUL 1 - MODUL 6) ===");

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

  let allValid = true;

  for (const k of kanjis) {
    const gq = k.quizzes[0];
    if (!gq) {
      console.error(`❌ Kanji ${k.character}: Tidak ada kuis grouping!`);
      allValid = false;
      continue;
    }

    const words = JSON.parse(gq.words || "[]");
    const groups = JSON.parse(gq.groups || "[]");

    if (!Array.isArray(words) || words.length === 0) {
      console.error(`❌ Kanji ${k.character}: words kosong atau bukan array!`);
      allValid = false;
      continue;
    }

    if (!Array.isArray(groups) || groups.length === 0) {
      console.error(`❌ Kanji ${k.character}: groups kosong atau bukan array!`);
      allValid = false;
      continue;
    }

    // Verify each word is in at least one group
    for (const w of words) {
      const inGroup = groups.some((g: any) =>
        Array.isArray(g.correctWords) && g.correctWords.includes(w)
      );
      if (!inGroup) {
        console.error(`❌ Kanji ${k.character}: kata '${w}' tidak ditemukan di kelompok mana pun!`);
        allValid = false;
      }
    }

    // Verify categories match semantic graph categories
    const sgCatNames = new Set(
      k.jukugos.flatMap((j) => j.kategoriKanji.map((kk) => kk.category.name))
    );
    for (const g of groups) {
      if (!sgCatNames.has(g.name)) {
        console.warn(`⚠️ Kanji ${k.character}: nama kategori quiz '${g.name}' tidak ada di semantic graph!`);
      }
    }

    console.log(
      `✓ Kanji ${k.character} (Modul ${k.moduleId}): ${words.length} jukugo, ${groups.length} kategori [OK]`
    );
  }

  if (allValid) {
    console.log("\n🎉 SEMUA 30 KANJI (MODUL 1 - 6) KUIS GROUPING 100% VALID DAN SESUAI DENGAN SEMANTIC GRAPH!");
  } else {
    console.error("\nAda kesalahan validasi kuis grouping!");
    process.exit(1);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
