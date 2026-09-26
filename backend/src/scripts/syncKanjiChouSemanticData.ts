import { PrismaClient } from "@prisma/client";
import { buildDynamicKanjiGraph } from "../services/graphService";

const prisma = new PrismaClient();

async function syncKanjiChou() {
  console.log("🚀 Memulai sinkronisasi data Semantic Graph untuk Kanji 調 (Modul 2)...");

  // 1. Update Kanji 調 (ID: 3221)
  const kanji = await prisma.kanji.findFirst({
    where: { character: "調" }
  });

  if (!kanji) {
    throw new Error("Kanji 調 tidak ditemukan di database!");
  }

  await prisma.kanji.update({
    where: { id: kanji.id },
    data: {
      romaji: "Chō / Shiraberu",
      meaning: "Mengatur, menyesuaikan, memeriksa, menyelidiki sehingga sesuatu menjadi sesuai atau seimbang.",
      baseMeaning: "mengatur, menyesuaikan, memeriksa, atau menyelidiki sehingga sesuatu menjadi sesuai atau seimbang."
    }
  });
  console.log("✅ Kanji 調 diperbarui: romaji 'Chō / Shiraberu', meaning & baseMeaning presisi.");

  // 2. Kategori Master & KategoriKanji
  const categoryDefs = [
    {
      name: "1. Kondisi dan Keadaan",
      description: "Kelompok jukugo yang berkaitan dengan kondisi tubuh, keadaan, dan kesehatan.",
      words: ["体調", "好調", "不調", "快調", "順調", "高調", "低調"]
    },
    {
      name: "2. Cara Berbicara dan Bunyi",
      description: "Kelompok jukugo yang berkaitan dengan intonasi, nada suara, dan gaya tutur.",
      words: ["口調", "語調", "声調", "音調"]
    },
    {
      name: "3. Pemeriksaan dan Administrasi",
      description: "Kelompok jukugo yang berkaitan dengan survei, penyelidikan, dan berita acara.",
      words: ["調査", "調書", "調印", "調達"]
    },
    {
      name: "4. Pengaturan dan Penyesuaian",
      description: "Kelompok jukugo yang berkaitan dengan memasak, meramu, meracik, dan bumbu.",
      words: ["調理", "調合", "調製", "調薬", "調律", "調味料"]
    },
    {
      name: "5. Penyelidikan dan Perubahan Keadaan",
      description: "Kelompok jukugo yang berkaitan dengan penegasan, irama langkah, dan perubahan nada.",
      words: ["強調", "歩調", "変調", "移調"]
    }
  ];

  // Ambil semua jukugo kanji 調
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
        console.warn(`Jukugo '${w}' tidak ditemukan untuk kanji 調!`);
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
  console.log(`✅ ${jukugos.length} Jukugo berhasil ditautkan ke 5 MasterCategory.`);

  // 3. Bersihkan & Perbarui Graph Edges (Hanya 16 Cross-Link Edges Bersih)
  await prisma.kanjiGraphEdge.deleteMany({
    where: { kanjiId: kanji.id }
  });

  const crossLinks = [
    { source: "好調", target: "順調", predicate: "kondisi sangat baik" },
    { source: "不調", target: "低調", predicate: "kondisi lesu/buruk" },
    { source: "口調", target: "語調", predicate: "nada gaya bicara" },
    { source: "声調", target: "音調", predicate: "nada suara & musik" },
    { source: "調査", target: "調書", predicate: "penyelidikan & berita acara" },
    { source: "調合", target: "調製", predicate: "pencampuran & pembuatan" },
    { source: "調薬", target: "調理", predicate: "penyiapan obat vs makanan" },
    { source: "調達", target: "調印", predicate: "pengadaan & penandatanganan" },
    { source: "調律", target: "変調", predicate: "penyetelan & modulasi" },
    { source: "体調", target: "好調", predicate: "kondisi fisik kesehatan" },
    { source: "快調", target: "順調", predicate: "kondisi lancar menyenangkan" },
    { source: "高調", target: "好調", predicate: "kondisi memuncak semangat" },
    { source: "調味料", target: "調理", predicate: "bumbu masakan" },
    { source: "強調", target: "口調", predicate: "penekanan nada bicara" },
    { source: "歩調", target: "順調", predicate: "keselarasan langkah" },
    { source: "移調", target: "変調", predicate: "perubahan nada modulasi" }
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
  console.log(`✅ 16 Cross-Link Edges bersih berhasil dibuat untuk Kanji 調.`);

  // 4. Verifikasi Dynamic Kanji Graph
  const graph = await buildDynamicKanjiGraph(kanji.id);
  console.log("\n=== HASIL VERIFIKASI GRAPH KANJI 調 ===");
  console.log("Root Node:", graph.nodes.filter(n => n.type === "root").map(n => ({ id: n.id, label: n.label, subLabel: n.subLabel, meaning: n.description })));
  console.log("Category Nodes:", graph.nodes.filter(n => n.type === "category").map(n => ({ id: n.id, label: n.label, color: n.color })));
  console.log("Sub-bottom Nodes Count:", graph.nodes.filter(n => n.type === "sub-bottom").length);
  console.log("Edges Total:", graph.edges.length);
  console.log("Cross-link Edges Total:", graph.edges.filter(e => e.isCrossLink).length);
  console.log("Cross-link Edges:", graph.edges.filter(e => e.isCrossLink).map(e => `${e.source} -> ${e.target} [${e.predicate}]`));
}

syncKanjiChou()
  .catch(e => {
    console.error("Gagal sinkronisasi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
