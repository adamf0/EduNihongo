import { PrismaClient } from "@prisma/client";
import { buildDynamicKanjiGraph } from "../services/graphService";

const prisma = new PrismaClient();

export const resolvers = {
  SemanticNode: {
    __resolveType(obj: any) {
      if (obj.nodeType === "KANJI" || obj.onyomi !== undefined || obj.kunyomi !== undefined) {
        return "KanjiNode";
      }
      if (obj.nodeType === "SUB_JUKUGO" || obj.constituents !== undefined) {
        return "SubJukugoNode";
      }
      if (obj.nodeType === "JUKUGO" || obj.formulaPattern !== undefined) {
        return "JukugoNode";
      }
      return "KanjiNode";
    },
  },

  Query: {
    getKanjiSemanticGraph: async (_: any, { character }: { character: string }) => {
      try {
        const kanji = await prisma.kanji.findUnique({
          where: { character },
          include: {
            examples: true,
            graphEdges: true,
            jukugos: true,
            semanticRelations: {
              include: {
                nodes: true,
              },
            },
          },
        });

        if (!kanji) {
          return {
            targetKanji: null,
            nodes: [],
            edges: [],
            breakdownTree: [],
          };
        }

        // Build dynamic graph nodes and edges
        const { nodes, edges } = await buildDynamicKanjiGraph(kanji.id);

        // Target Kanji Node representation
        const targetKanji = {
          id: `kanji-${kanji.id}`,
          word: kanji.character,
          meaning: kanji.meaning || "-",
          reading: kanji.onyomi || kanji.kunyomi || kanji.romaji || "-",
          nodeType: "KANJI",
          onyomi: kanji.onyomi || "-",
          kunyomi: kanji.kunyomi || "-",
          bushuu: kanji.bushuu || "-",
          romaji: kanji.romaji || "-",
        };

        // Construct polymorphic breakdown trees
        const breakdownTree = await Promise.all(
          kanji.jukugos.map(async (jk) => {
            const matchedSR = kanji.semanticRelations.find((sr) => sr.jukugoId === jk.id);

            let formulaPattern = "STANDARD_2KANJI";
            let explanation = matchedSR?.penjelasan || `${jk.word} (${jk.meaning})`;

            let component1: any = null;
            let component2: any = null;
            let subJukugo1: any = null;
            let subJukugo2: any = null;

            // Check if Dual Sub-Jukugo pattern (e.g., 原因究明 = 原因 + 究明)
            if (matchedSR && matchedSR.nodes && matchedSR.nodes.length >= 2) {
              formulaPattern = "DUAL_SUB_JUKUGO";

              subJukugo1 = {
                id: `subjk-1-${jk.id}`,
                word: matchedSR.nodes[0].jokugo,
                meaning: matchedSR.nodes[0].arti || "-",
                reading: "-",
                nodeType: "SUB_JUKUGO",
                constituents: [],
              };

              subJukugo2 = {
                id: `subjk-2-${jk.id}`,
                word: matchedSR.nodes[1].jokugo,
                meaning: matchedSR.nodes[1].arti || "-",
                reading: "-",
                nodeType: "SUB_JUKUGO",
                constituents: [],
              };

              component1 = subJukugo1;
              component2 = subJukugo2;
            } else {
              // Standard constituent kanjis breakdown (e.g., 研 + 究 = 研究)
              const charList = jk.word.split("");
              const kanjiNodes = await Promise.all(
                charList.map(async (ch, idx) => {
                  const foundK = await prisma.kanji.findUnique({ where: { character: ch } });
                  return {
                    id: `k-${jk.id}-${idx}`,
                    word: ch,
                    meaning: foundK?.meaning || foundK?.baseMeaning || "-",
                    reading: foundK?.onyomi || foundK?.kunyomi || foundK?.romaji || "-",
                    nodeType: "KANJI",
                    onyomi: foundK?.onyomi || "-",
                    kunyomi: foundK?.kunyomi || "-",
                    bushuu: foundK?.bushuu || "-",
                    romaji: foundK?.romaji || "-",
                  };
                })
              );

              if (kanjiNodes.length >= 2) {
                component1 = kanjiNodes[0];
                component2 = kanjiNodes[1];
              } else if (kanjiNodes.length === 1) {
                component1 = kanjiNodes[0];
              }
            }

            // Fetch explicit Kanji Cards for detail component grid
            const kanjiCards = await Promise.all(
              jk.word.split("").map(async (ch, idx) => {
                const foundK = await prisma.kanji.findUnique({ where: { character: ch } });
                return {
                  id: `card-${jk.id}-${idx}`,
                  word: ch,
                  meaning: foundK?.meaning || foundK?.baseMeaning || "-",
                  reading: foundK?.onyomi || foundK?.kunyomi || foundK?.romaji || "-",
                  nodeType: "KANJI",
                  onyomi: foundK?.onyomi || "-",
                  kunyomi: foundK?.kunyomi || "-",
                  bushuu: foundK?.bushuu || "-",
                  romaji: foundK?.romaji || "-",
                };
              })
            );

            return {
              id: `jukugo-${jk.id}`,
              word: jk.word,
              meaning: jk.meaning,
              reading: jk.reading,
              nodeType: "JUKUGO",
              formulaPattern,
              explanation,
              component1,
              component2,
              subJukugo1,
              subJukugo2,
              kanjiCards,
            };
          })
        );

        return {
          targetKanji,
          nodes: nodes.map((n) => ({
            id: String(n.id),
            kanji: String(n.kanji || n.label),
            label: String(n.label),
            subLabel: n.subLabel || null,
            meaning: n.meaning || null,
            type: String(n.type),
            color: n.color || null,
            borderColor: n.borderColor || null,
            isPill: Boolean(n.isPill),
          })),
          edges: edges.map((e) => ({
            id: String(e.id),
            source: String(e.source),
            target: String(e.target),
            predicate: e.predicate || null,
            isCrossLink: Boolean(e.isCrossLink),
          })),
          breakdownTree,
        };
      } catch (err) {
        console.error("GraphQL getKanjiSemanticGraph error:", err);
        throw new Error("Gagal mengambil data semantic graph untuk karakter kanji.");
      }
    },
  },
};
