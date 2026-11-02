import { PrismaClient } from "@prisma/client";
import { buildDynamicKanjiGraph } from "../services/graphService";

const prisma = new PrismaClient();

export async function syncKanjiReki() {
  console.log("🚀 Memulai sinkronisasi data Semantic Graph untuk Kanji 歴 (Modul 6)...");

  // 1. Ambil Kanji 歴 (ID: 3244, ModuleId: 560)
  const kanji = await prisma.kanji.findFirst({
    where: { character: "歴" }
  });

  if (!kanji) {
    throw new Error("Kanji 歴 tidak ditemukan di database!");
  }

  // Update informasi dasar kanji 歴 sesuai semantic.md
  await prisma.kanji.update({
    where: { id: kanji.id },
    data: {
      romaji: "REKI",
      onyomi: "レキ",
      kunyomi: "―",
      meaning: "Melewati, Riwayat yang Telah Dilalui",
      baseMeaning: "melewati atau riwayat yang telah dilalui."
    }
  });
  console.log("✅ Kanji 歴 diperbarui: romaji 'REKI', meaning 'Melewati, Riwayat yang Telah Dilalui'.");

  // Perbarui metadata seluruh kanji penyusun agar lengkap & akurat
  const CONSTITUENTS = [
    { char: "学", romaji: "GAKU", onyomi: "ガク", kunyomi: "まな・ぶ", bushuu: "子 (Anak)", meaning: "Belajar, Pendidikan", baseMeaning: "belajar, menuntut ilmu, atau pendidikan." },
    { char: "職", romaji: "SHOKU", onyomi: "ショク", kunyomi: "―", bushuu: "耳 (Telinga)", meaning: "Pekerjaan, Jabatan", baseMeaning: "pekerjaan, tugas, jabatan, atau profesi." },
    { char: "経", romaji: "KEI", onyomi: "ケイ, キョウ", kunyomi: "へ・る", bushuu: "糸 (Benang)", meaning: "Melalui, Menjalani", baseMeaning: "melalui, melewati, atau menjalani suatu proses." },
    { char: "前", romaji: "ZEN", onyomi: "ゼン", kunyomi: "まえ", bushuu: "刀 (Pedang)", meaning: "Sebelumnya, Di Depan", baseMeaning: "sebelumnya, di muka, atau mendahului." },
    { char: "病", romaji: "BYOU", onyomi: "ビョウ, ヘイ", kunyomi: "や・む, やまい", bushuu: "疒 (Penyakit)", meaning: "Penyakit, Sakit", baseMeaning: "penyakit, rasa sakit, atau gangguan kesehatan." },
    { char: "来", romaji: "RAI", onyomi: "ライ", kunyomi: "く・る, きた・る", bushuu: "木 (Pohon)", meaning: "Datang, Asal", baseMeaning: "datang, tiba, atau asal-usul." },
    { char: "史", romaji: "SHI", onyomi: "シ", kunyomi: "―", bushuu: "口 (Mulut)", meaning: "Sejarah, Catatan", baseMeaning: "sejarah, catatan, atau riwayat peristiwa masa lalu." },
    { char: "代", romaji: "DAI", onyomi: "ダイ, タイ", kunyomi: "か・わる, よ", bushuu: "亻 (Orang)", meaning: "Generasi, Masa, Mengganti", baseMeaning: "generasi, masa, periode waktu, atau pergantian." },
    { char: "年", romaji: "NEN", onyomi: "ネン", kunyomi: "とし", bushuu: "干 (Perisai)", meaning: "Tahun, Usia", baseMeaning: "tahun, rentang waktu setahun, atau usia." }
  ];

  for (const c of CONSTITUENTS) {
    const existing = await prisma.kanji.findUnique({ where: { character: c.char } });
    if (existing) {
      await prisma.kanji.update({
        where: { character: c.char },
        data: {
          romaji: c.romaji,
          onyomi: c.onyomi,
          kunyomi: c.kunyomi,
          bushuu: c.bushuu,
          meaning: c.meaning,
          baseMeaning: c.baseMeaning
        }
      });
    }
  }
  console.log("✅ 9 Kanji penyusun diperbarui dengan informasi kamus lengkap.");

  // Bersihkan data relasi dan jukugo lama untuk kanji 歴
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
  console.log("🗑️ Data lama berhasil dibersihkan untuk kanji 歴.");

  // 2. Daftar 9 Jukugo Resmi Sesuai semantic.md
  const jukugoData = [
    // Kategori 1: 1. Riwayat Pendidikan / Pekerjaan (3 jukugo)
    { word: "学歴", reading: "がくれき", meaning: "riwayat pendidikan" },
    { word: "職歴", reading: "しょくれき", meaning: "riwayat pekerjaan" },
    { word: "経歴", reading: "けいれき", meaning: "riwayat hidup / karier" },

    // Kategori 2: 2. Riwayat Kehidupan (3 jukugo)
    { word: "前歴", reading: "ぜんれき", meaning: "riwayat sebelumnya" },
    { word: "病歴", reading: "びょうれき", meaning: "riwayat penyakit" },
    { word: "来歴", reading: "らいれき", meaning: "asal-usul / riwayat" },

    // Kategori 3: 3. Sejarah / Perjalanan Waktu (3 jukugo)
    { word: "歴史", reading: "れきし", meaning: "sejarah" },
    { word: "歴代", reading: "れきだい", meaning: "dari generasi ke generasi" },
    { word: "歴年", reading: "れきねん", meaning: "bertahun-tahun" }
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
  console.log("✅ 9 Jukugo baru berhasil dibuat dengan ID berurutan presisi.");

  // 3. 3 Kategori Master Resmi Sesuai semantic.md
  const categoryDefs = [
    {
      name: "1. Riwayat Pendidikan / Pekerjaan",
      description: "Kelompok ini menunjukkan makna yang berkaitan dengan riwayat atau perjalanan seseorang dalam pendidikan dan pekerjaan.",
      words: ["学歴", "職歴", "経歴"]
    },
    {
      name: "2. Riwayat Kehidupan",
      description: "Kelompok ini menunjukkan makna yang berkaitan dengan catatan atau perjalanan suatu keadaan yang telah terjadi sebelumnya.",
      words: ["前歴", "病歴", "来歴"]
    },
    {
      name: "3. Sejarah / Perjalanan Waktu",
      description: "Kelompok ini menunjukkan makna yang berkaitan dengan perjalanan suatu masa dan peristiwa yang telah berlangsung dari waktu ke waktu.",
      words: ["歴史", "歴代", "歴年"]
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
  console.log("✅ 9 Jukugo berhasil dipetakan ke 3 MasterCategory resmi.");

  // 4. Update Semantic Relations & Constituent Nodes (9 penjelasan makna presisi sesuai semantic.md)
  const semanticDataList = [
    // 1) Riwayat Pendidikan / Pekerjaan
    {
      word: "学歴",
      penjelasan: "Hubungan makna antar kanji 学 dan 歴 menjadi 学歴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “riwayat pendidikan yang telah ditempuh.”",
      nodes: [
        { jokugo: "学", arti: "belajar, pendidikan" },
        { jokugo: "歴", arti: "riwayat, perjalanan yang telah dilalui" }
      ]
    },
    {
      word: "職歴",
      penjelasan: "Hubungan makna antar kanji 職 dan 歴 menjadi 職歴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “riwayat pekerjaan yang telah dijalani.”",
      nodes: [
        { jokugo: "職", arti: "pekerjaan, jabatan" },
        { jokugo: "歴", arti: "riwayat, perjalanan yang telah dilalui" }
      ]
    },
    {
      word: "経歴",
      penjelasan: "Hubungan makna antar kanji 経 dan 歴 menjadi 経歴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “riwayat atau perjalanan hidup dan karier yang telah dilalui.”",
      nodes: [
        { jokugo: "経", arti: "melalui, menjalani" },
        { jokugo: "歴", arti: "riwayat, perjalanan yang telah dilalui" }
      ]
    },

    // 2) Riwayat Kehidupan
    {
      word: "前歴",
      penjelasan: "Hubungan makna antar kanji 前 dan 歴 menjadi 前歴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “riwayat yang terjadi atau dimiliki sebelumnya.”",
      nodes: [
        { jokugo: "前", arti: "sebelumnya" },
        { jokugo: "歴", arti: "riwayat" }
      ]
    },
    {
      word: "病歴",
      penjelasan: "Hubungan makna antar kanji 病 dan 歴 menjadi 病歴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “riwayat penyakit yang pernah dialami.”",
      nodes: [
        { jokugo: "病", arti: "penyakit" },
        { jokugo: "歴", arti: "riwayat" }
      ]
    },
    {
      word: "来歴",
      penjelasan: "Hubungan makna antar kanji 来 dan 歴 menjadi 来歴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “asal-usul atau perjalanan suatu hal hingga sampai pada keadaan sekarang.”",
      nodes: [
        { jokugo: "来", arti: "datang, asal" },
        { jokugo: "歴", arti: "riwayat, perjalanan" }
      ]
    },

    // 3) Sejarah / Perjalanan Waktu
    {
      word: "歴史",
      penjelasan: "Hubungan makna antar kanji 歴 dan 史 menjadi 歴史, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sejarah atau catatan mengenai peristiwa yang telah berlangsung pada masa lalu.”",
      nodes: [
        { jokugo: "歴", arti: "melewati, riwayat" },
        { jokugo: "史", arti: "sejarah, catatan" }
      ]
    },
    {
      word: "歴代",
      penjelasan: "Hubungan makna antar kanji 歴 dan 代 menjadi 歴代, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pergantian atau keberlangsungan dari satu generasi atau masa ke generasi berikutnya.”",
      nodes: [
        { jokugo: "歴", arti: "melewati masa" },
        { jokugo: "代", arti: "generasi, masa" }
      ]
    },
    {
      word: "歴年",
      penjelasan: "Hubungan makna antar kanji 歴 dan 年 menjadi 歴年, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “rentang waktu yang telah berlangsung selama bertahun-tahun.”",
      nodes: [
        { jokugo: "歴", arti: "melewati" },
        { jokugo: "年", arti: "tahun" }
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
  console.log("✅ 9 Semantic Relations & Constituent Nodes berhasil diperbarui sesuai semantic.md.");

  // 5. Bersihkan Graph Edges (0 cross-link buatan, pohon murni)
  await prisma.kanjiGraphEdge.deleteMany({
    where: { kanjiId: kanji.id }
  });
  console.log("✅ KanjiGraphEdge bersih (0 cross-link buatan, grafik 100% mengikuti 3 cluster resmi).");

  // 6. Update Grouping Quiz 7269 agar nama kategori dan katanya presisi
  const groupingWords = [
    "学歴", "職歴", "経歴",
    "前歴", "病歴", "来歴",
    "歴史", "歴代", "歴年"
  ];

  const groupingCategories = [
    { name: "1. Riwayat Pendidikan / Pekerjaan", correctWords: ["学歴", "職歴", "経歴"] },
    { name: "2. Riwayat Kehidupan", correctWords: ["前歴", "病歴", "来歴"] },
    { name: "3. Sejarah / Perjalanan Waktu", correctWords: ["歴史", "歴代", "歴年"] }
  ];

  const formattedGroups = groupingCategories.map(cat => ({
    name: cat.name,
    category: cat.name,
    correctWords: cat.correctWords,
    items: cat.correctWords,
    [cat.name]: cat.correctWords
  }));

  const existingGrouping = await prisma.quiz.findFirst({
    where: { kanjiId: kanji.id, type: "grouping" }
  });

  if (existingGrouping) {
    await prisma.quiz.update({
      where: { id: existingGrouping.id },
      data: {
        question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
        words: JSON.stringify(groupingWords),
        groups: JSON.stringify(formattedGroups),
        explanation: "Pengelompokan jukugo berdasarkan cabang semantic graph kanji 歴."
      }
    });
    console.log("✅ Grouping Quiz 7269 berhasil diselaraskan.");
  }

  // 7. Verifikasi Dynamic Kanji Graph
  const graph = await buildDynamicKanjiGraph(kanji.id);
  console.log("\n=== HASIL VERIFIKASI GRAPH KANJI 歴 ===");
  console.log("Root Node:", graph.nodes.filter(n => n.type === "root").map(n => ({ id: n.id, label: n.label, meaning: n.description })));
  console.log("Category Nodes:", graph.nodes.filter(n => n.type === "category").map(n => ({ id: n.id, label: n.label, color: n.color })));
  console.log("Sub-bottom Nodes Count:", graph.nodes.filter(n => n.type === "sub-bottom").length);
  console.log("Total Nodes:", graph.nodes.length);
  console.log("Total Edges:", graph.edges.length);
  console.log("Cross-link Edges Total:", graph.edges.filter(e => e.isCrossLink).length);
}

if (require.main === module) {
  syncKanjiReki()
    .catch(e => {
      console.error("Gagal sinkronisasi:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
