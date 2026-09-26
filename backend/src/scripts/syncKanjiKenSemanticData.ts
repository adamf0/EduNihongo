import { PrismaClient } from "@prisma/client";
import { buildDynamicKanjiGraph } from "../services/graphService";

const prisma = new PrismaClient();

async function syncKanjiKen() {
  console.log("🚀 Memulai sinkronisasi data Semantic Graph untuk Kanji 験 (Modul 1)...");

  // 1. Update Kanji 験 (ID: 3213)
  const kanji = await prisma.kanji.findFirst({
    where: { character: "験" }
  });

  if (!kanji) {
    throw new Error("Kanji 験 tidak ditemukan di database!");
  }

  await prisma.kanji.update({
    where: { id: kanji.id },
    data: {
      romaji: "Ken",
      meaning: "Mengalami, membuktikan, memverifikasi melalui pengujian",
      baseMeaning: "pengalaman, pengujian, atau verifikasi."
    }
  });
  console.log("✅ Kanji 験 diperbarui: romaji 'Ken', meaning & baseMeaning presisi.");

  // 2. Kategori Master & KategoriKanji
  const categoryDefs = [
    {
      name: "Pengujian / Pembuktian",
      description: "Kelompok ini menunjukkan makna yang berkaitan dengan kegiatan menguji, menjalani pengujian, atau membuktikan sesuatu melalui percobaan.",
      words: ["試験", "受験", "実験", "治験"]
    },
    {
      name: "Pengalaman",
      description: "Kelompok ini menunjukkan makna yang berkaitan dengan sesuatu yang dialami atau dijalani secara langsung sehingga seseorang memperoleh pengetahuan atau pemahaman.",
      words: ["経験", "体験"]
    },
    {
      name: "Verifikasi / Pemeriksaan",
      description: "Kelompok ini menunjukkan makna yang berkaitan dengan kegiatan memeriksa kembali untuk memastikan kebenaran suatu hasil.",
      words: ["験算"]
    },
    {
      name: "Hasil / Efek / Bukti",
      description: "Kelompok ini menunjukkan makna yang berkaitan dengan hasil atau efek yang tampak dan dapat menjadi tanda atau bukti dari suatu proses.",
      words: ["効験"]
    }
  ];

  // Ambil semua jukugo kanji 験
  const jukugos = await prisma.jukugo.findMany({
    where: { kanjiId: kanji.id }
  });

  const jukugoMap = new Map<string, number>();
  jukugos.forEach(j => jukugoMap.set(j.word.trim(), j.id));

  for (const catDef of categoryDefs) {
    // Cari atau buat MasterCategory
    let cat = await prisma.masterCategory.findFirst({
      where: { name: catDef.name }
    });

    if (!cat) {
      cat = await prisma.masterCategory.create({
        data: {
          name: catDef.name,
          description: catDef.description
        }
      });
    }

    for (const w of catDef.words) {
      const jukugoId = jukugoMap.get(w);
      if (!jukugoId) {
        console.warn(`Jukugo '${w}' tidak ditemukan untuk kanji 験!`);
        continue;
      }

      // Hapus relasi lama untuk jukugo ini
      await prisma.kategoriKanji.deleteMany({
        where: { jokugoId: jukugoId }
      });

      // Hubungkan ke kategori yang benar
      await prisma.kategoriKanji.create({
        data: {
          categoryId: cat.id,
          jokugoId: jukugoId
        }
      });
    }
  }
  console.log("✅ 8 Jukugo berhasil ditautkan ke 4 MasterCategory.");

  // 3. Bersihkan & Perbarui Graph Edges (Hanya 6 Cross-Link Edges Bersih)
  await prisma.kanjiGraphEdge.deleteMany({
    where: { kanjiId: kanji.id }
  });

  const crossLinks = [
    { source: "試験", target: "受験", predicate: "proses pengujian" },
    { source: "経験", target: "体験", predicate: "mirip makna pengalaman" },
    { source: "実験", target: "治験", predicate: "pengujian medis ilmiah" },
    { source: "試験", target: "実験", predicate: "metode pembuktian" },
    { source: "験算", target: "実験", predicate: "verifikasi hitungan" },
    { source: "効験", target: "治験", predicate: "efektivitas obat" }
  ];

  for (let idx = 0; idx < crossLinks.length; idx++) {
    const cl = crossLinks[idx];
    const edgeId = `cross-${kanji.id}-${idx + 1}-${cl.source}-${cl.target}`;

    await prisma.kanjiGraphEdge.create({
      data: {
        id: edgeId,
        kanjiId: kanji.id,
        source: cl.source,
        target: cl.target,
        predicate: cl.predicate
      }
    });
  }
  console.log(`✅ 6 Cross-Link Edges bersih berhasil dibuat untuk Kanji 験.`);

  // 4. Verifikasi Dynamic Kanji Graph
  const graph = await buildDynamicKanjiGraph(kanji.id);
  console.log("\n=== HASIL VERIFIKASI GRAPH KANJI 験 ===");
  console.log("Root Node:", graph.nodes.filter(n => n.type === "root").map(n => ({ id: n.id, label: n.label, subLabel: n.subLabel, meaning: n.description })));
  console.log("Category Nodes:", graph.nodes.filter(n => n.type === "category").map(n => ({ id: n.id, label: n.label, color: n.color })));
  console.log("Sub-bottom Nodes:", graph.nodes.filter(n => n.type === "sub-bottom").map(n => ({ id: n.id, label: n.label, parent: n.parentPill, category: n.categoryName })));
  console.log("Edges Total:", graph.edges.length);
  console.log("Cross-link Edges:", graph.edges.filter(e => e.isCrossLink).map(e => `${e.source} -> ${e.target} [${e.predicate}]`));
}

syncKanjiKen()
  .catch(e => {
    console.error("Gagal sinkronisasi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
