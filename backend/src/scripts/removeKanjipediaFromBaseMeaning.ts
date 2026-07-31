import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=== Memulai Update baseMeaning pada Tabel Kanji ===");

  const kanjisToUpdate = await prisma.kanji.findMany({
    where: {
      baseMeaning: {
        contains: "Kanjipedia",
      },
    },
    select: { id: true, character: true, baseMeaning: true },
  });

  console.log(`Ditemukan ${kanjisToUpdate.length} baris Kanji yang berisi 'Kanjipedia' pada kolom baseMeaning.`);

  let updatedCount = 0;

  for (const k of kanjisToUpdate) {
    if (!k.baseMeaning) continue;

    const newBaseMeaning = k.baseMeaning
      .replace(/\s*\(Kanjipedia\)/gi, "")
      .replace(/\s*Kanjipedia/gi, "")
      .trim();

    await prisma.kanji.update({
      where: { id: k.id },
      data: { baseMeaning: newBaseMeaning },
    });

    updatedCount++;
  }

  console.log(`Berhasil memperbarui ${updatedCount} baris Kanji di database!`);
}

main()
  .catch((e) => {
    console.error("Gagal memperbarui baseMeaning:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
