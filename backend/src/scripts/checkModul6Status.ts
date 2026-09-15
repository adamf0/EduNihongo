import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const chars = ['経', '始', '歴', '史', '期'];
  for (const c of chars) {
    const k = await prisma.kanji.findFirst({
      where: { character: c },
      include: {
        jukugos: true,
        quizzes: true,
        semanticRelations: true,
        graphEdges: true,
        masterRefleksi: true
      }
    });
    if (!k) {
      console.log(c, 'NOT FOUND');
      continue;
    }
    console.log(`${c} (ID: ${k.id}, Module: ${k.moduleId}) -> Jukugos: ${k.jukugos.length}, Quizzes: ${k.quizzes.length}, SemanticRel: ${k.semanticRelations.length}, GraphEdges: ${k.graphEdges.length}, Refleksi: ${k.masterRefleksi.length}`);
    const typeCounts: Record<string, number> = {};
    k.quizzes.forEach(q => {
      typeCounts[q.type] = (typeCounts[q.type] || 0) + 1;
    });
    console.log(`  Quiz breakdown: ${JSON.stringify(typeCounts)}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
