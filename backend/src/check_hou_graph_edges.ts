import { PrismaClient } from "@prisma/client";
import { buildDynamicKanjiGraph } from "./services/graphService";

const prisma = new PrismaClient();

async function check() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: "報" }
  });

  if (!kanji) {
    console.error("Kanji 報 not found!");
    return;
  }

  const result = await buildDynamicKanjiGraph(kanji.id);
  console.log(`Node count for 報: ${result.nodes.length}`);
  console.log(`Edge count for 報: ${result.edges.length}`);
  console.log("Nodes detail:");
  result.nodes.forEach((n: any) => {
    console.log(`  - [${n.type}] id: ${n.id}, label: ${n.label || n.data?.label}`);
  });
}

check()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
