import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const k = await prisma.kanji.findFirst({ where: { character: '答' } });
  if (!k) return;
  const edges = await prisma.kanjiGraphEdge.findMany({
    where: { kanjiId: k.id }
  });
  console.log(`KanjiGraphEdges for 答 (ID: ${k.id}):`);
  edges.forEach(e => {
    console.log(`  ${e.source} --[${e.predicate}]--> ${e.target}`);
  });
}

main().finally(() => prisma.$disconnect());
