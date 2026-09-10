import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '験' },
    include: {
      graphEdges: true
    }
  });

  console.log("=== ALL GRAPH EDGES FOR KANJI 験 ===");
  console.log(JSON.stringify(kanji?.graphEdges, null, 2));

  // Also check if buildDynamicKanjiGraph returns any leftover node
  const { buildDynamicKanjiGraph } = require('../src/services/graphService');
  if (kanji) {
    const graphData = await buildDynamicKanjiGraph(kanji.id);
    console.log("\n=== DYNAMIC GRAPH SERVICE OUTPUT ===");
    console.log("Nodes:", graphData.nodes.map((n: any) => `${n.id} (${n.label}) [${n.type}]`));
    console.log("Edges count:", graphData.edges.length);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
