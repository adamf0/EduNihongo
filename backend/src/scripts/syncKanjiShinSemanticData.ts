import { PrismaClient } from "@prisma/client";
import { buildDynamicKanjiGraph } from "../services/graphService";

const prisma = new PrismaClient();

export async function syncKanjiShin() {
  console.log("🚀 Memulai sinkronisasi data Semantic Graph untuk Kanji 信 (Modul 3)...");

  // 1. Ambil Kanji 信 (ID: 3227, ModuleId: 557)
  const kanji = await prisma.kanji.findFirst({
    where: { character: "信" }
  });

  if (!kanji) {
    throw new Error("Kanji 信 tidak ditemukan di database!");
  }

  // Update informasi dasar kanji 信 sesuai diagram WhatsApp Image 2026-09-22 at 09.29.14.jpeg & semantic.md
  await prisma.kanji.update({
    where: { id: kanji.id },
    data: {
      romaji: "SHIN",
      meaning: "Percaya, Meyakini, Kabar, Tanda",
      baseMeaning: "percaya, meyakini, kebenaran, surat atau kabar, serta tanda atau isyarat."
    }
  });
  console.log("✅ Kanji 信 diperbarui: romaji 'SHIN', meaning 'Percaya, Meyakini, Kabar, Tanda'.");

  // 2. Daftar 17 Jukugo Resmi Sesuai Diagram & semantic.md
  const jukugoData = [
    { word: "自信", reading: "じしん", meaning: "percaya diri" },
    { word: "不信", reading: "ふしん", meaning: "ketidakpercayaan" },
    { word: "信頼", reading: "しんらい", meaning: "kepercayaan / rasa percaya" },
    { word: "信用", reading: "しんよう", meaning: "kepercayaan / kredibilitas" },
    { word: "信任", reading: "しんにん", meaning: "kepercayaan / pemberian kepercayaan" },
    { word: "信義", reading: "しんぎ", meaning: "kepercayaan dan kesetiaan" },
    { word: "信念", reading: "しんねん", meaning: "keyakinan / prinsip yang diyakini" },
    { word: "信者", reading: "しんじゃ", meaning: "orang yang percaya / penganut" },
    { word: "信徒", reading: "しんと", meaning: "penganut" },
    { word: "確信", reading: "かくしん", meaning: "keyakinan kuat / kepastian" },
    { word: "通信", reading: "つうしん", meaning: "komunikasi / pertukaran informasi" },
    { word: "発信", reading: "はっしん", meaning: "mengirim / menyampaikan informasi" },
    { word: "送信", reading: "そうしん", meaning: "mengirim / mentransmisikan informasi" },
    { word: "返信", reading: "へんしん", meaning: "membalas pesan / surat" },
    { word: "交信", reading: "こうしん", meaning: "saling berkomunikasi" },
    { word: "信号", reading: "しんごう", meaning: "tanda / sinyal / isyarat" },
    { word: "信書", reading: "しんしょ", meaning: "surat / dokumen yang disampaikan" }
  ];

  // Hapus jukugo 信言 lama jika ada
  const oldShingen = await prisma.jukugo.findFirst({
    where: { kanjiId: kanji.id, word: "信言" }
  });
  if (oldShingen) {
    await prisma.kategoriKanji.deleteMany({ where: { jokugoId: oldShingen.id } });
    await prisma.semanticRelation.deleteMany({ where: { jukugoId: oldShingen.id } });
    await prisma.jukugo.delete({ where: { id: oldShingen.id } });
    console.log("🗑️ Jukugo lama '信言' berhasil dihapus dari kanji 信.");
  }

  // Pastikan seluruh 17 jukugo tersimpan di tabel Jukugo
  const jukugoMap = new Map<string, number>();
  for (const item of jukugoData) {
    let j = await prisma.jukugo.findFirst({
      where: { kanjiId: kanji.id, word: item.word }
    });

    if (!j) {
      j = await prisma.jukugo.create({
        data: {
          kanjiId: kanji.id,
          word: item.word,
          reading: item.reading,
          meaning: item.meaning
        }
      });
      console.log(`➕ Jukugo baru '${item.word}' berhasil ditambahkan.`);
    } else {
      await prisma.jukugo.update({
        where: { id: j.id },
        data: {
          reading: item.reading,
          meaning: item.meaning
        }
      });
    }
    jukugoMap.set(item.word, j.id);
  }

  // 3. 4 Kategori Master Sesuai Diagram WhatsApp Image 2026-09-22 at 09.29.14.jpeg
  const categoryDefs = [
    {
      name: "1. Kepercayaan dan Keyakinan",
      description: "Kanji 信 pada kelompok ini berkaitan dengan makna percaya, meyakini, memberikan kepercayaan, serta keyakinan terhadap seseorang atau sesuatu.",
      words: ["自信", "不信", "信頼", "信用", "信任", "信義", "信念", "信者", "信徒", "確信"]
    },
    {
      name: "2. Surat, Informasi, dan Komunikasi",
      description: "Berkembang dari makna kabar atau surat dan hubungan dengan kegiatan menyampaikan, mengirim, menerima, membalas, dan bertukar informasi.",
      words: ["通信", "発信", "送信", "返信", "交信"]
    },
    {
      name: "3. Tanda dan Isyarat",
      description: "Kanji 信 pada kelompok ini berkaitan dengan makna tanda atau isyarat.",
      words: ["信号"]
    },
    {
      name: "4. Informasi dan Dokumen",
      description: "Kanji 信 pada kelompok ini berkaitan dengan makna informasi atau pesan yang disampaikan dalam bentuk tertulis.",
      words: ["信書"]
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
        data: { description: catDef.description }
      });
    }

    for (const w of catDef.words) {
      const jukugoId = jukugoMap.get(w);
      if (!jukugoId) continue;

      // Hapus relasi lama agar tidak ganda
      await prisma.kategoriKanji.deleteMany({
        where: { jokugoId: jukugoId }
      });

      // Tautkan ke kategori baru
      await prisma.kategoriKanji.create({
        data: {
          categoryId: cat.id,
          jokugoId: jukugoId
        }
      });
    }
  }
  console.log("✅ 17 Jukugo berhasil dipetakan ke 4 MasterCategory bernomor urut.");

  // 4. Update Semantic Relations (17 penjelasan makna presisi sesuai semantic.md)
  const semanticExplanations: Record<string, string> = {
    "自信": "Hubungan makna antar kanji 自 dan 信 menjadi 自信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kepercayaan terhadap diri sendiri atau percaya pada kemampuan diri.”",
    "不信": "Hubungan makna antar kanji 不 dan 信 menjadi 不信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tidak percaya atau keadaan tidak memiliki kepercayaan terhadap seseorang atau sesuatu.”",
    "信頼": "Hubungan makna antar kanji 信 dan 頼 menjadi 信頼, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kepercayaan terhadap seseorang atau sesuatu yang dianggap dapat diandalkan.”",
    "信用": "Hubungan makna antar kanji 信 dan 用 menjadi 信用, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kepercayaan atau penilaian bahwa seseorang atau sesuatu dapat dipercaya.”",
    "信任": "Hubungan makna antar kanji 信 dan 任 menjadi 信任, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memberikan kepercayaan kepada seseorang untuk menjalankan tugas atau tanggung jawab.”",
    "信義": "Hubungan makna antar kanji 信 dan 義 menjadi 信義, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kepercayaan dan kesetiaan yang didasarkan pada kebenaran atau prinsip moral.”",
    "信念": "Hubungan makna antar kanji 信 dan 念 menjadi 信念, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keyakinan yang dipegang dengan kuat dan tidak mudah berubah.”",
    "信者": "Hubungan makna antar kanji 信 dan 者 menjadi 信者, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “orang yang percaya atau menganut suatu kepercayaan.”",
    "信徒": "Hubungan makna antar kanji 信 dan 徒 menjadi 信徒, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “orang yang mengikuti atau menganut suatu kepercayaan.”",
    "確信": "Hubungan makna antar kanji 確 dan 信 menjadi 確信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keyakinan yang kuat atau kepastian terhadap sesuatu.”",
    "通信": "Hubungan makna antar kanji 通 dan 信 menjadi 通信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “proses penyampaian atau pertukaran informasi antar pihak yang satu dengan pihak lainnya.”",
    "発信": "Hubungan makna antar kanji 発 dan 信 menjadi 発信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirimkan atau menyampaikan informasi dari suatu pihak kepada pihak lain.”",
    "送信": "Hubungan makna antar kanji 送 dan 信 menjadi 送信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirimkan pesan, informasi, atau data kepada pihak lain.”",
    "返信": "Hubungan makna antar kanji 返 dan 信 menjadi 返信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirimkan kembali pesan atau surat sebagai balasan.”",
    "交信": "Hubungan makna antar kanji 交 dan 信 menjadi 交信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “saling bertukar pesan atau informasi antar dua pihak atau lebih.”",
    "信号": "Hubungan makna antar kanji 信 dan 号 menjadi 信号, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tanda atau isyarat yang digunakan untuk menyampaikan informasi atau pesan tertentu.”",
    "信書": "Hubungan makna antar kanji 信 dan 書 menjadi 信書, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “surat atau dokumen tertulis yang digunakan untuk menyampaikan pesan dari seseorang kepada orang lain.”"
  };

  // Bersihkan relasi lama kanji 信
  await prisma.semanticRelation.deleteMany({
    where: { kanjiId: kanji.id }
  });

  for (const [w, explanation] of Object.entries(semanticExplanations)) {
    const jId = jukugoMap.get(w);
    if (!jId) continue;

    await prisma.semanticRelation.create({
      data: {
        kanjiId: kanji.id,
        jukugoId: jId,
        penjelasan: explanation
      }
    });
  }
  console.log("✅ 17 Semantic Relations berhasil diperbarui sesuai semantic.md.");

  // 5. Bersihkan & Perbarui Graph Edges (11 Cross-Link Edges Bersih Antar-Jukugo Terdaftar)
  await prisma.kanjiGraphEdge.deleteMany({
    where: { kanjiId: kanji.id }
  });

  const crossLinks = [
    { source: "発信", target: "送信", predicate: "pengiriman pesan" },
    { source: "送信", target: "返信", predicate: "kirim & balasan pesan" },
    { source: "通信", target: "交信", predicate: "komunikasi data & radio" },
    { source: "信号", target: "通信", predicate: "sinyal isyarat & komunikasi" },
    { source: "信書", target: "送信", predicate: "surat dokumen & pengiriman" },
    { source: "信頼", target: "信用", predicate: "kepercayaan & kredibilitas" },
    { source: "信任", target: "信義", predicate: "kepercayaan & integritas" },
    { source: "信者", target: "信徒", predicate: "penganut ajaran" },
    { source: "信念", target: "確信", predicate: "keyakinan & kepastian" },
    { source: "自信", target: "確信", predicate: "percaya diri & keyakinan" },
    { source: "不信", target: "信用", predicate: "ketidakpercayaan & kepercayaan" }
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
  console.log(`✅ 11 Cross-Link Edges bersih berhasil dibuat untuk Kanji 信.`);

  // 6. Verifikasi Dynamic Kanji Graph
  const graph = await buildDynamicKanjiGraph(kanji.id);
  console.log("\n=== HASIL VERIFIKASI GRAPH KANJI 信 ===");
  console.log("Root Node:", graph.nodes.filter(n => n.type === "root").map(n => ({ id: n.id, label: n.label, subLabel: n.subLabel, meaning: n.description })));
  console.log("Category Nodes:", graph.nodes.filter(n => n.type === "category").map(n => ({ id: n.id, label: n.label, color: n.color })));
  console.log("Sub-bottom Nodes Count:", graph.nodes.filter(n => n.type === "sub-bottom").length);
  console.log("Total Nodes:", graph.nodes.length);
  console.log("Total Edges:", graph.edges.length);
  console.log("Cross-link Edges Total:", graph.edges.filter(e => e.isCrossLink).length);
  console.log("Cross-link Edges:", graph.edges.filter(e => e.isCrossLink).map(e => `${e.source} -> ${e.target} [${e.predicate}]`));
}

if (require.main === module) {
  syncKanjiShin()
    .catch(e => {
      console.error("Gagal sinkronisasi:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
