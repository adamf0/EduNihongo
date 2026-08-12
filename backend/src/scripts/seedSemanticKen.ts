import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedSemanticKen() {
  const kanjiKen = await prisma.kanji.findFirst({ where: { character: "研" } });
  if (!kanjiKen) {
    console.error("Kanji 研 not found");
    return;
  }

  const jukugos = await prisma.jukugo.findMany({ where: { kanjiId: kanjiKen.id } });
  const jukugoMap = new Map<string, number>();
  jukugos.forEach(j => jukugoMap.set(j.word.trim(), j.id));

  const semanticData = [
    {
      word: "研究",
      penjelasan: "Hubungan makna antara 研 (Mengarahkan / Mempelajari) dan 究 (Menyelidiki hingga tuntas) membentuk 研究 yang berarti Penelitian.",
      nodes: [
        { jokugo: "研", arti: "Mengarahkan / Mempelajari" },
        { jokugo: "究", arti: "Menyelidiki hingga tuntas" }
      ]
    },
    {
      word: "研修",
      penjelasan: "Hubungan makna antara 研 (Mengarahkan / Mempelajari) dan 修 (Mengisi / Belajar) membentuk 研修 yang berarti Pelatihan / Magang.",
      nodes: [
        { jokugo: "研", arti: "Mengarahkan / Mempelajari" },
        { jokugo: "修", arti: "Mengisi / Belajar" }
      ]
    },
    {
      word: "研磨",
      penjelasan: "Hubungan makna antara 研 (Mengasah) dan 磨 (Gosok / Asah) membentuk 研磨 yang berarti Mengasah / Memoles.",
      nodes: [
        { jokugo: "研", arti: "Mengasah" },
        { jokugo: "磨", arti: "Gosok / Asah" }
      ]
    },
    {
      word: "調査報告書",
      penjelasan: "Hubungan makna antara 調査 (Survei) dan 報告書 (Laporan) membentuk 調査報告書 yang berarti Laporan Hasil Penelitian.",
      nodes: [
        { jokugo: "調査", arti: "Survei / Penelitian" },
        { jokugo: "報告書", arti: "Laporan" }
      ]
    },
    {
      word: "研修旅行",
      penjelasan: "Hubungan makna antara 研修 (Pelatihan) dan 旅行 (Perjalanan) membentuk 研修旅行 yang berarti Perjalanan Studi / Field Trip.",
      nodes: [
        { jokugo: "研修", arti: "Pelatihan" },
        { jokugo: "旅行", arti: "Perjalanan" }
      ]
    }
  ];

  await prisma.semanticRelation.deleteMany({ where: { kanjiId: kanjiKen.id } });

  for (const item of semanticData) {
    const jukugoId = jukugoMap.get(item.word);
    const created = await prisma.semanticRelation.create({
      data: {
        kanjiId: kanjiKen.id,
        jukugoId: jukugoId || null,
        penjelasan: item.penjelasan,
      }
    });

    for (const node of item.nodes) {
      await prisma.semanticRelationNode.create({
        data: {
          semanticId: created.id,
          jokugo: node.jokugo,
          arti: node.arti
        }
      });
    }
  }

  console.log(`✅ Seeded ${semanticData.length} SemanticRelations for Kanji 研 (ID: ${kanjiKen.id}).`);
}
