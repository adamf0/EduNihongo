import { PrismaClient } from "@prisma/client";
import { buildDynamicKanjiGraph } from "./services/graphService";

const prisma = new PrismaClient();

async function checkShiGraph() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: "始" }
  });

  if (!kanji) {
    console.error("Kanji 始 not found");
    return;
  }

  const result = await buildDynamicKanjiGraph(kanji.id);
  console.log("=== GRAPH NODES ===");
  console.log(`Total nodes: ${result.nodes.length}`);
  
  const rootNode = result.nodes.find(n => n.type === "root");
  console.log("Root Node:", rootNode);

  const categories = result.nodes.filter(n => n.type === "category");
  console.log(`\nCategories (${categories.length}):`);
  for (const c of categories) {
    console.log(`- ${c.id}: ${c.label} (color: ${c.color})`);
  }

  const subNodes = result.nodes.filter(n => n.type === "sub-bottom");
  console.log(`\nSub-bottom nodes (${subNodes.length}):`);
  for (const s of subNodes) {
    console.log(`- ${s.id} | ${s.kanji} | parent: ${s.parentPill} | meaning: ${s.meaning}`);
  }

  console.log("\n=== GRAPH EDGES ===");
  console.log(`Total edges: ${result.edges.length}`);
  const crossEdges = result.edges.filter(e => e.isCrossLink);
  console.log(`Cross-links (${crossEdges.length}):`);
  for (const ce of crossEdges) {
    console.log(`- ${ce.id}: ${ce.source} -> ${ce.target} (${ce.predicate})`);
  }

  const hierEdges = result.edges.filter(e => !e.isCrossLink);
  console.log(`Hierarchy edges (${hierEdges.length}):`);
  for (const he of hierEdges) {
    console.log(`- ${he.id}: ${he.source} -> ${he.target} (${he.predicate})`);
  }
}

checkShiGraph()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
