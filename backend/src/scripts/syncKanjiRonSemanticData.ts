import { PrismaClient } from "@prisma/client";
import { buildDynamicKanjiGraph } from "../services/graphService";

const prisma = new PrismaClient();

export async function syncKanjiRon() {
  console.log("🚀 Memulai sinkronisasi data Semantic Graph untuk Kanji 論 (Modul 5)...");

  // 1. Ambil Kanji 論 (ID: 3237, ModuleId: 559)
  const kanji = await prisma.kanji.findFirst({
    where: { character: "論" }
  });

  if (!kanji) {
    throw new Error("Kanji 論 tidak ditemukan di database!");
  }

  // Update informasi dasar kanji 論 sesuai diagram & semantic.md
  await prisma.kanji.update({
    where: { id: kanji.id },
    data: {
      romaji: "RON",
      meaning: "Membahas, Berdiskusi, Berpendapat",
      baseMeaning: "Membahas dan mendiskusikan suatu hal secara logis serta mengemukakan pendapat atau pandangan."
    }
  });
  console.log("✅ Kanji 論 diperbarui: romaji 'RON', meaning 'Membahas, Berdiskusi, Berpendapat'.");

  // Perbarui metadata kanji penyusun 結 agar lengkap
  const kanjiKetsu = await prisma.kanji.findFirst({ where: { character: "結" } });
  if (kanjiKetsu) {
    await prisma.kanji.update({
      where: { id: kanjiKetsu.id },
      data: {
        romaji: "KETSU",
        meaning: "Mengikat, Menghubungkan, Menghasilkan",
        bushuu: "糸 (Benang)",
        onyomi: "ケツ",
        kunyomi: "むす・ぶ",
        baseMeaning: "mengikat, menyatukan, atau menghasilkan suatu kesimpulan."
      }
    });
    console.log("✅ Kanji penyusun 結 diperbarui dengan informasi kamus lengkap.");
  }

  // Bersihkan data relasi lama untuk kanji 論
  const oldJukugos = await prisma.jukugo.findMany({
    where: { kanjiId: kanji.id }
  });
  for (const oj of oldJukugos) {
    await prisma.kategoriKanji.deleteMany({ where: { jokugoId: oj.id } });
    await prisma.semanticRelation.deleteMany({ where: { jukugoId: oj.id } });
    await prisma.jukugo.delete({ where: { id: oj.id } });
  }
  await prisma.semanticRelation.deleteMany({ where: { kanjiId: kanji.id } });
  await prisma.kanjiGraphEdge.deleteMany({ where: { kanjiId: kanji.id } });
  console.log("🗑️ Data lama berhasil dibersihkan untuk kanji 論.");

  // 2. Daftar 18 Jukugo Resmi Sesuai Urutan Diagram Tangkapan Layar & semantic.md
  const jukugoData = [
    // Kategori 1: 1. DISKUSI / PERDEBATAN (7 jukugos)
    { word: "議論", reading: "ぎろん", meaning: "diskusi" },
    { word: "討論", reading: "とうろん", meaning: "debat" },
    { word: "口論", reading: "こうろん", meaning: "perdebatan lisan" },
    { word: "反論", reading: "はんろん", meaning: "sanggahan" },
    { word: "弁論", reading: "べんろん", meaning: "penyampaian argumentasi" },
    { word: "争論", reading: "そうろん", meaning: "perdebatan" },
    { word: "論争", reading: "ろんそう", meaning: "perdebatan" },

    // Kategori 2: 2. PENDAPAT / WACANA (4 jukugos)
    { word: "異論", reading: "いろん", meaning: "pendapat berbeda" },
    { word: "持論", reading: "じろん", meaning: "pendapat yang dianut" },
    { word: "言論", reading: "げんろん", meaning: "penyampaian pendapat" },
    { word: "世論", reading: "よろん", meaning: "opini publik" },

    // Kategori 3: 3. PENALARAN / PEMIKIRAN (4 jukugos)
    { word: "論理", reading: "ろんり", meaning: "penalaran" },
    { word: "理論", reading: "りろん", meaning: "teori" },
    { word: "論点", reading: "ろんてん", meaning: "pokok bahasan" },
    { word: "結論", reading: "けつろん", meaning: "kesimpulan" },

    // Kategori 4: 4. PENYAMPAIAN / HASIL PEMIKIRAN (3 jukugos)
    { word: "評論", reading: "ひょうろん", meaning: "ulasan kritis" },
    { word: "論説", reading: "ろんせつ", meaning: "uraian argumentatif" },
    { word: "論文", reading: "ろんぶん", meaning: "karya tulis ilmiah" }
  ];

  const jukugoMap = new Map<string, number>();
  for (const item of jukugoData) {
    const createdJ = await prisma.jukugo.create({
      data: {
        kanjiId: kanji.id,
        word: item.word,
        reading: item.reading,
        meaning: item.meaning
      }
    });
    jukugoMap.set(item.word, createdJ.id);
  }
  console.log("✅ 18 Jukugo baru berhasil dibuat dengan ID berurutan presisi.");

  // 3. 4 Kategori Master Resmi Sesuai Diagram Tangkapan Layar & semantic.md
  const categoryDefs = [
    {
      name: "1. DISKUSI / PERDEBATAN",
      description: "Kelompok ini menunjukkan makna yang berkaitan dengan kegiatan membahas suatu persoalan, melakukan diskusi, menyampaikan argumen, atau memperdebatkan suatu pendapat.",
      words: ["議論", "討論", "口論", "反論", "弁論", "争論", "論争"]
    },
    {
      name: "2. PENDAPAT / WACANA",
      description: "Kelompok ini berkaitan dengan pendapat, pandangan, atau wacana yang dikemukakan oleh seseorang maupun masyarakat mengenai suatu persoalan.",
      words: ["異論", "持論", "言論", "世論"]
    },
    {
      name: "3. PENALARAN / PEMIKIRAN",
      description: "Kelompok ini menunjukkan makna yang berkaitan dengan proses berpikir secara logis, penalaran, teori, pokok persoalan, hingga hasil pemikiran.",
      words: ["論理", "理論", "論点", "結論"]
    },
    {
      name: "4. PENYAMPAIAN / HASIL PEMIKIRAN",
      description: "Kelompok ini berkaitan dengan penyampaian hasil pemikiran dalam bentuk kritik, ulasan, uraian argumentatif, atau karya tulis ilmiah.",
      words: ["評論", "論説", "論文"]
    }
  ];

  for (const catDef of categoryDefs) {
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
    } else {
      await prisma.masterCategory.update({
        where: { id: cat.id },
        data: {
          name: catDef.name,
          description: catDef.description
        }
      });
    }

    for (const w of catDef.words) {
      const jukugoId = jukugoMap.get(w);
      if (!jukugoId) continue;

      await prisma.kategoriKanji.create({
        data: {
          categoryId: cat.id,
          jokugoId: jukugoId
        }
      });
    }
  }
  console.log("✅ 18 Jukugo berhasil dipetakan ke 4 MasterCategory resmi.");

  // 4. Update Semantic Relations & Constituent Nodes (18 penjelasan makna presisi sesuai semantic.md)
  const semanticDataList = [
    {
      word: "議論",
      penjelasan: "Hubungan makna antar kanji 議 dan 論 menjadi 議論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “diskusi atau perdebatan mengenai suatu persoalan.”",
      nodes: [
        { jokugo: "議", arti: "membahas, berunding" },
        { jokugo: "論", arti: "membahas, mengemukakan pendapat atau argumen" }
      ]
    },
    {
      word: "討論",
      penjelasan: "Hubungan makna antar kanji 討 dan 論 menjadi 討論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “diskusi atau debat untuk membahas suatu persoalan atau topik.”",
      nodes: [
        { jokugo: "討", arti: "membahas, mendiskusikan, menyelidiki" },
        { jokugo: "論", arti: "membahas, mengemukakan pendapat atau argumen" }
      ]
    },
    {
      word: "反論",
      penjelasan: "Hubungan makna antar kanji 反 dan 論 menjadi 反論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sanggahan atau argumen yang digunakan untuk menentang atau membalas pendapat sebelumnya.”",
      nodes: [
        { jokugo: "反", arti: "melawan, berbalik, menentang" },
        { jokugo: "論", arti: "pendapat, argumen" }
      ]
    },
    {
      word: "口論",
      penjelasan: "Hubungan makna antar kanji 口 dan 論 menjadi 口論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perdebatan atau pertengkaran yang dilakukan secara lisan.”",
      nodes: [
        { jokugo: "口", arti: "mulut, ucapan" },
        { jokugo: "論", arti: "membahas, berdebat" }
      ]
    },
    {
      word: "論争",
      penjelasan: "Hubungan makna antar kanji 論 dan 争 menjadi 論争, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perdebatan atau perselisihan mengenai suatu pendapat atau persoalan.”",
      nodes: [
        { jokugo: "論", arti: "pendapat, argumen, pembahasan" },
        { jokugo: "争", arti: "berselisih, bertentangan" }
      ]
    },
    {
      word: "争論",
      penjelasan: "Hubungan makna antar kanji 争 dan 論 menjadi 争論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perdebatan atau pertentangan pendapat mengenai suatu persoalan.”",
      nodes: [
        { jokugo: "争", arti: "berselisih, bertentangan" },
        { jokugo: "論", arti: "pendapat, argumen" }
      ]
    },
    {
      word: "弁論",
      penjelasan: "Hubungan makna antar kanji 弁 dan 論 menjadi 弁論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “penyampaian argumentasi atau pembelaan melalui pendapat dan penjelasan.”",
      nodes: [
        { jokugo: "弁", arti: "berbicara, menjelaskan, membela" },
        { jokugo: "論", arti: "pendapat, argumen" }
      ]
    },
    {
      word: "異論",
      penjelasan: "Hubungan makna antar kanji 異 dan 論 menjadi 異論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pendapat yang berbeda atau keberatan terhadap suatu pendapat.”",
      nodes: [
        { jokugo: "異", arti: "berbeda, tidak sama" },
        { jokugo: "論", arti: "pendapat, pandangan" }
      ]
    },
    {
      word: "持論",
      penjelasan: "Hubungan makna antar kanji 持 dan 論 menjadi 持論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pendapat atau pandangan yang secara pribadi dimiliki dan dianut seseorang.”",
      nodes: [
        { jokugo: "持", arti: "memegang, memiliki" },
        { jokugo: "論", arti: "pendapat, pandangan" }
      ]
    },
    {
      word: "言論",
      penjelasan: "Hubungan makna antar kanji 言 dan 論 menjadi 言論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pendapat atau wacana yang disampaikan melalui bahasa atau ucapan.”",
      nodes: [
        { jokugo: "言", arti: "kata, ucapan, menyatakan" },
        { jokugo: "論", arti: "pendapat, pandangan" }
      ]
    },
    {
      word: "世論",
      penjelasan: "Hubungan makna antar kanji 世 dan 論 menjadi 世論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pendapat atau pandangan yang berkembang di tengah masyarakat.”",
      nodes: [
        { jokugo: "世", arti: "masyarakat, dunia" },
        { jokugo: "論", arti: "pendapat, pandangan" }
      ]
    },
    {
      word: "論理",
      penjelasan: "Hubungan makna antar kanji 論 dan 理 menjadi 論理, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “logika atau penalaran yang digunakan untuk berpikir dan menjelaskan suatu persoalan secara sistematis.”",
      nodes: [
        { jokugo: "論", arti: "membahas, mengemukakan pendapat" },
        { jokugo: "理", arti: "alasan, logika, prinsip" }
      ]
    },
    {
      word: "理論",
      penjelasan: "Hubungan makna antar kanji 理 dan 論 menjadi 理論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “teori atau sistem pemikiran yang menjelaskan suatu hal berdasarkan prinsip dan penalaran.”",
      nodes: [
        { jokugo: "理", arti: "alasan, prinsip, logika" },
        { jokugo: "論", arti: "pendapat, pembahasan" }
      ]
    },
    {
      word: "論点",
      penjelasan: "Hubungan makna antar kanji 論 dan 点 menjadi 論点, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pokok persoalan atau titik utama yang menjadi fokus dalam suatu pembahasan.”",
      nodes: [
        { jokugo: "論", arti: "pembahasan, pendapat" },
        { jokugo: "点", arti: "titik, pokok" }
      ]
    },
    {
      word: "結論",
      penjelasan: "Hubungan makna antar kanji 結 dan 論 menjadi 結論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kesimpulan yang diperoleh setelah melakukan pembahasan atau penalaran.”",
      nodes: [
        { jokugo: "結", arti: "mengikat, menyatukan, menghasilkan" },
        { jokugo: "論", arti: "pembahasan, pendapat" }
      ]
    },
    {
      word: "評論",
      penjelasan: "Hubungan makna antar kanji 評 dan 論 menjadi 評論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pembahasan atau tulisan yang memberikan penilaian dan kritik terhadap suatu hal.”",
      nodes: [
        { jokugo: "評", arti: "menilai, memberikan penilaian" },
        { jokugo: "論", arti: "membahas, mengemukakan pendapat" }
      ]
    },
    {
      word: "論説",
      penjelasan: "Hubungan makna antar kanji 論 dan 説 menjadi 論説, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “uraian atau tulisan yang menyampaikan pendapat dan argumentasi mengenai suatu persoalan.”",
      nodes: [
        { jokugo: "論", arti: "pendapat, pembahasan" },
        { jokugo: "説", arti: "menjelaskan, teori, pendapat" }
      ]
    },
    {
      word: "論文",
      penjelasan: "Hubungan makna antar kanji 論 dan 文 menjadi 論文, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “karya tulis ilmiah yang membahas suatu persoalan berdasarkan pemikiran, penalaran, dan argumentasi.”",
      nodes: [
        { jokugo: "論", arti: "pembahasan, pendapat, argumen" },
        { jokugo: "文", arti: "tulisan, karangan" }
      ]
    }
  ];

  for (const sData of semanticDataList) {
    const jId = jukugoMap.get(sData.word);
    if (!jId) continue;

    const createdSR = await prisma.semanticRelation.create({
      data: {
        kanjiId: kanji.id,
        jukugoId: jId,
        penjelasan: sData.penjelasan
      }
    });

    for (const n of sData.nodes) {
      await prisma.semanticRelationNode.create({
        data: {
          semanticId: createdSR.id,
          jokugo: n.jokugo,
          arti: n.arti
        }
      });
    }
  }
  console.log("✅ 18 Semantic Relations & Constituent Nodes berhasil diperbarui sesuai semantic.md.");

  // 5. Bersihkan Graph Edges (0 cross-link buatan)
  await prisma.kanjiGraphEdge.deleteMany({
    where: { kanjiId: kanji.id }
  });
  console.log("✅ KanjiGraphEdge bersih (0 cross-link buatan, grafik 100% mengikuti 4 cluster resmi).");

  // 6. Verifikasi Dynamic Kanji Graph
  const graph = await buildDynamicKanjiGraph(kanji.id);
  console.log("\n=== HASIL VERIFIKASI GRAPH KANJI 論 ===");
  console.log("Root Node:", graph.nodes.filter(n => n.type === "root").map(n => ({ id: n.id, label: n.label, meaning: n.description })));
  console.log("Category Nodes:", graph.nodes.filter(n => n.type === "category").map(n => ({ id: n.id, label: n.label, color: n.color })));
  console.log("Sub-bottom Nodes Count:", graph.nodes.filter(n => n.type === "sub-bottom").length);
  console.log("Total Nodes:", graph.nodes.length);
  console.log("Total Edges:", graph.edges.length);
  console.log("Cross-link Edges Total:", graph.edges.filter(e => e.isCrossLink).length);
}

if (require.main === module) {
  syncKanjiRon()
    .catch(e => {
      console.error("Gagal sinkronisasi:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
