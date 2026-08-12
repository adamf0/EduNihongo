import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const COLOR_NAMES = ["green", "orange", "blue", "purple", "yellow"];
const BORDER_CLASSES = [
  "border-green-500",
  "border-orange-500",
  "border-blue-500",
  "border-purple-500",
  "border-yellow-500"
];

export async function buildDynamicKanjiGraph(kanjiId: number) {
  const kanji = await prisma.kanji.findUnique({
    where: { id: kanjiId },
    include: {
      jukugos: {
        include: {
          kategoriKanji: {
            include: {
              category: true
            }
          },
          semanticRelations: {
            include: {
              nodes: true
            }
          }
        }
      },
      semanticRelations: {
        include: {
          nodes: true
        }
      },
      graphEdges: true
    }
  });

  if (!kanji) {
    return { nodes: [], edges: [] };
  }

  const char = kanji.character;
  const rootId = `${char}-root`;

  const nodes: any[] = [];
  const edges: any[] = [];

  // 1. Root Node
  nodes.push({
    id: rootId,
    kanji: char,
    label: char,
    subLabel: `(${kanji.romaji || "-"})`,
    description: kanji.meaning || "-",
    meaning: `(${kanji.romaji || "-"})\n${kanji.meaning || "-"}`,
    type: "root",
    isRoot: true,
    isPill: false
  });

  // 2. Group Jukugos by Category
  const categoryMap = new Map<string, typeof kanji.jukugos>();

  for (const jk of kanji.jukugos) {
    const categories = jk.kategoriKanji.map((k) => k.category.name);
    if (categories.length === 0) {
      categories.push("Kombinasi Utama");
    }

    for (const catName of categories) {
      if (!categoryMap.has(catName)) {
        categoryMap.set(catName, []);
      }
      categoryMap.get(catName)!.push(jk);
    }
  }

  const categoryList = Array.from(categoryMap.entries());
  const wordToSubNodeIdMap = new Map<string, string>();
  const nodeIdSet = new Set<string>([rootId]);

  // 3. Construct Category Nodes & Sub-bottom Jukugo Nodes
  categoryList.forEach(([catName, catJukugos], catIdx) => {
    const catId = `${char}-cat-${catIdx + 1}`;
    const colorName = COLOR_NAMES[catIdx % COLOR_NAMES.length];
    const borderClass = BORDER_CLASSES[catIdx % BORDER_CLASSES.length];

    // Category Node
    nodes.push({
      id: catId,
      kanji: catName,
      label: catName,
      meaning: "Kategori",
      type: "category",
      color: colorName,
      borderColor: borderClass,
      isPill: true
    });
    nodeIdSet.add(catId);

    // Hierarchy Edge: Root -> Category
    edges.push({
      id: `e-${char}-root-cat${catIdx + 1}`,
      source: rootId,
      target: catId,
      predicate: "kategori",
      isCrossLink: false
    });

    // Sub-bottom Jukugo Nodes
    catJukugos.forEach((jk, jkIdx) => {
      const subId = `${char}-sub-${catIdx + 1}-${jkIdx + 1}`;

      const matchedSR = jk.semanticRelations?.[0] || kanji.semanticRelations.find(sr => sr.jukugoId === jk.id);
      const semanticNodes = matchedSR?.nodes?.map(n => ({
        jokugo: n.jokugo,
        arti: n.arti
      })) || [];

      nodes.push({
        id: subId,
        jukugoId: jk.id,
        kanji: jk.word,
        label: jk.word,
        subLabel: `(${jk.reading})`,
        description: jk.meaning,
        meaning: `(${jk.reading}) ${jk.meaning}`,
        type: "sub-bottom",
        parentPill: catId,
        categoryId: catId,
        semanticNodes: semanticNodes
      });
      nodeIdSet.add(subId);
      wordToSubNodeIdMap.set(jk.word.trim(), subId);

      // Hierarchy Edge: Category -> Sub-bottom
      edges.push({
        id: `e-${char}-c${catIdx + 1}-s${jkIdx + 1}`,
        source: catId,
        target: subId,
        predicate: "mencakup",
        isCrossLink: false
      });
    });
  });

  // 4. Cross-link Edges with Predicates (Pass word-based cross-links directly so frontend can match to any Jukugo or Sub-Jukugo)
  for (const edge of kanji.graphEdges) {
    const isCross = Boolean(
      edge.predicate &&
      edge.predicate !== "kategori" &&
      edge.predicate !== "mencakup"
    );

    edges.push({
      id: edge.id,
      source: edge.source.trim(),
      target: edge.target.trim(),
      predicate: edge.predicate || undefined,
      label: edge.predicate || undefined,
      isCrossLink: isCross
    });
  }

  return { nodes, edges };
}
