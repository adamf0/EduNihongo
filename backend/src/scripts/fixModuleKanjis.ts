import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fixModuleKanjis() {
  console.log("🛠 Fix Module Kanji Assignments...");

  const mainLearningKanjis = ["試", "験", "問", "題", "答", "点"];

  let defaultModule = await prisma.module.findFirst();
  if (!defaultModule) {
    console.error("Module 1 not found!");
    return;
  }

  // Set moduleId for main 6 kanji to defaultModule.id
  const updatedMain = await prisma.kanji.updateMany({
    where: {
      character: { in: mainLearningKanjis },
    },
    data: {
      moduleId: defaultModule.id,
    },
  });

  console.log(`✅ Main learning kanji updated (${updatedMain.count} kanji assigned to Module ${defaultModule.id}).`);

  // Unset moduleId (set to null) for all other constituent kanji
  const updatedConstituents = await prisma.kanji.updateMany({
    where: {
      character: { notIn: mainLearningKanjis },
    },
    data: {
      moduleId: null,
    },
  });

  console.log(`✅ Other constituent kanji removed from Module 1 (${updatedConstituents.count} kanji set to moduleId: null).`);
}

fixModuleKanjis()
  .catch((err) => console.error(err))
  .finally(async () => await prisma.$disconnect());
