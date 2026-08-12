import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedSemanticKyuu() {
  const kanjiKyuu = await prisma.kanji.findFirst({ where: { character: "究" } });
  if (!kanjiKyuu) {
    console.error("Kanji 究 not found");
    return;
  }

  const jukugos = await prisma.jukugo.findMany({ where: { kanjiId: kanjiKyuu.id } });
  const jukugoMap = new Map<string, number>();
  jukugos.forEach(j => jukugoMap.set(j.word.trim(), j.id));

  const semanticData = [
    {
      word: "深く究める",
      penjelasan: "Hubungan makna antara 深く (secara mendalam) dan 究める (mendalami hingga mencapai pemahaman yang utuh) membentuk 深く究める yang berarti Mendalami ilmu sampai selesai.",
      nodes: [
        { jokugo: "深く", arti: "secara mendalam" },
        { jokugo: "究める", arti: "mendalami hingga mencapai pemahaman yang utuh" }
      ]
    },
    {
      word: "原因究明",
      penjelasan: "Hubungan makna antara 原因 (Penyebab) dan 究明 (Menyelidiki hingga jelas) membentuk 原因究明 yang berarti Menyelidiki penyebab.",
      nodes: [
        { jokugo: "原因", arti: "Penyebab" },
        { jokugo: "究明", arti: "Menyelidiki hingga jelas" }
      ]
    },
    {
      word: "真相究明",
      penjelasan: "Hubungan makna antara 真相 (Kebenaran) dan 究明 (Menyelidiki hingga jelas) membentuk 真相究明 yang berarti Menyelidiki kebenaran suatu peristiwa.",
      nodes: [
        { jokugo: "真相", arti: "Kebenaran" },
        { jokugo: "究明", arti: "Menyelidiki hingga jelas" }
      ]
    },
    {
      word: "事実究明",
      penjelasan: "Hubungan makna antara 事実 (Fakta) dan 究明 (Menyelidiki hingga jelas) membentuk 事実究明 yang berarti Menyelidiki fakta.",
      nodes: [
        { jokugo: "事実", arti: "Fakta" },
        { jokugo: "究明", arti: "Menyelidiki hingga jelas" }
      ]
    },
    {
      word: "問題究明",
      penjelasan: "Hubungan makna antara 問題 (Masalah) dan 究明 (Menyelidiki hingga jelas) membentuk 問題究明 yang berarti Menyelidiki atau memecahkan masalah.",
      nodes: [
        { jokugo: "問題", arti: "Masalah" },
        { jokugo: "究明", arti: "Menyelidiki hingga jelas" }
      ]
    },
    {
      word: "結論究明",
      penjelasan: "Hubungan makna antara 結論 (Kesimpulan) dan 究明 (Menyelidiki hingga jelas) membentuk 結論究明 yang berarti Meneliti hingga memperoleh kesimpulan.",
      nodes: [
        { jokugo: "結論", arti: "Kesimpulan" },
        { jokugo: "究明", arti: "Menyelidiki hingga jelas" }
      ]
    },
    {
      word: "本質究明",
      penjelasan: "Hubungan makna antara 本質 (Hakikat / Esensi) dan 究明 (Menyelidiki hingga jelas) membentuk 本質究明 yang berarti Menemukan hakikat (esensi) sesungguhnya.",
      nodes: [
        { jokugo: "本質", arti: "Hakikat / Esensi" },
        { jokugo: "究明", arti: "Menyelidiki hingga jelas" }
      ]
    },
    {
      word: "研究",
      penjelasan: "Hubungan makna antara 研 (Mengarahkan / Mempelajari) dan 究 (Menyelidiki hingga tuntas) membentuk 研究 yang berarti Penelitian.",
      nodes: [
        { jokugo: "研", arti: "Mengarahkan / Mempelajari" },
        { jokugo: "究", arti: "Menyelidiki hingga tuntas" }
      ]
    },
    {
      word: "究明",
      penjelasan: "Hubungan makna antara 究 (Menyelidiki hingga tuntas) dan 明 (Terang / Jelas) membentuk 究明 yang berarti Menyelidiki hingga jelas.",
      nodes: [
        { jokugo: "究", arti: "Menyelidiki hingga tuntas" },
        { jokugo: "明", arti: "Terang / Jelas" }
      ]
    }
  ];

  // Clean old semantic relations for kanji 究
  await prisma.semanticRelation.deleteMany({ where: { kanjiId: kanjiKyuu.id } });

  for (const item of semanticData) {
    const jukugoId = jukugoMap.get(item.word);
    const created = await prisma.semanticRelation.create({
      data: {
        kanjiId: kanjiKyuu.id,
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

  console.log(`✅ Seeded ${semanticData.length} SemanticRelations for Kanji 究 (ID: ${kanjiKyuu.id}).`);
}
