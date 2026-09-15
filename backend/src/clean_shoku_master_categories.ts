import { PrismaClient } from "@prisma/client";
import { buildDynamicKanjiGraph } from "./services/graphService";

const prisma = new PrismaClient();

async function checkShokuGraph() {
  const kanji = await prisma.kanji.findFirst({ where: { character: "職" } });
  if (!kanji) {
    console.error("Kanji 職 not found!");
    return;
  }

  // 1. Delete KategoriKanji for unnumbered categories linked to 職's jukugos
  const obsoleteCats = await prisma.masterCategory.findMany({
    where: {
      name: {
        in: [
          "Profesi / Pekerjaan",
          "Orang / Tempat Kerja",
          "Mencari / Memiliki Pekerjaan",
          "Perubahan / Status Pekerjaan"
        ]
      }
    }
  });

  const obsoleteCatIds = obsoleteCats.map(c => c.id);
  const jukugosOfShoku = await prisma.jukugo.findMany({ where: { kanjiId: kanji.id } });
  const jukugoIds = jukugosOfShoku.map(j => j.id);

  const deletedkk = await prisma.kategoriKanji.deleteMany({
    where: {
      jokugoId: { in: jukugoIds },
      categoryId: { in: obsoleteCatIds }
    }
  });
  console.log(`Deleted ${deletedkk.count} obsolete KategoriKanji links`);

  // 2. Test buildDynamicKanjiGraph output for 職
  const graph = await buildDynamicKanjiGraph(kanji.id);
  console.log(`\n=== DYNAMIC GRAPH FOR 職 (ID: ${kanji.id}) ===`);
  console.log(`Total Nodes: ${graph.nodes.length}`);
  console.log(`Total Edges: ${graph.edges.length}`);
  console.log("Nodes list:");
  graph.nodes.forEach((n: any) => {
    console.log(`  - [${n.type}] id: "${n.id}", label: "${n.label}"`);
  });
}

checkShokuGraph()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
