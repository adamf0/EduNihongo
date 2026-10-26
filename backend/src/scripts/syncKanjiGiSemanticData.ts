import { PrismaClient } from "@prisma/client";
import { buildDynamicKanjiGraph } from "../services/graphService";

const prisma = new PrismaClient();

export async function syncKanjiGi() {
  console.log("🚀 Memulai sinkronisasi data Semantic Graph untuk Kanji 議 (Modul 5)...");

  // 1. Ambil Kanji 議 (ID: 3236, ModuleId: 559)
  const kanji = await prisma.kanji.findFirst({
    where: { character: "議" }
  });

  if (!kanji) {
    throw new Error("Kanji 議 tidak ditemukan di database!");
  }

  // Update informasi dasar kanji 議 sesuai diagram Tangkapan Layar & semantic.md
  await prisma.kanji.update({
    where: { id: kanji.id },
    data: {
      romaji: "GI",
      onyomi: "ギ",
      meaning: "Membahas, Berunding, Mengemukakan Pendapat",
      baseMeaning: "Membahas, berunding, bertukar pendapat, atau mempertimbangkan suatu hal."
    }
  });
  console.log("✅ Kanji 議 diperbarui: romaji 'GI', meaning 'Membahas, Berunding, Mengemukakan Pendapat'.");

  // Perbarui metadata seluruh kanji penyusun agar lengkap & akurat
  const CONSTITUENTS = [
    { char: "会", romaji: "KAI", onyomi: "カイ", kunyomi: "あ・う", bushuu: "人 (Manusia)", meaning: "Bertemu, Berkumpul", baseMeaning: "bertemu, berkumpul" },
    { char: "論", romaji: "RON", onyomi: "ロン", kunyomi: "-", bushuu: "言 (Kata / Bahasa)", meaning: "Membahas, Berdiskusi, Berpendapat", baseMeaning: "membahas dan mendiskusikan suatu hal secara logis serta mengemukakan pendapat atau pandangan." },
    { char: "討", romaji: "TOU", onyomi: "トウ", kunyomi: "う・つ", bushuu: "言 (Kata / Bahasa)", meaning: "Membahas, Menyelidiki, Mengkaji", baseMeaning: "membahas, menyelidiki, atau mengkaji suatu persoalan secara mendalam." },
    { char: "協", romaji: "KYOU", onyomi: "キョウ", kunyomi: "-", bushuu: "十 (Sepuluh / Kerja Sama)", meaning: "Bekerja Sama, Bersepakat", baseMeaning: "bekerja sama, bersepakat, atau menyatukan usaha." },
    { char: "合", romaji: "GOU", onyomi: "ゴウ, ガッ", kunyomi: "あ・う, あ・わせる", bushuu: "口 (Mulut)", meaning: "Bersama, Menyatukan", baseMeaning: "bersama, menyatukan, atau mencocokkan." },
    { char: "談", romaji: "DAN", onyomi: "ダン", kunyomi: "-", bushuu: "言 (Kata / Bahasa)", meaning: "Berbicara, Membicarakan", baseMeaning: "berbicara, membicarakan, atau berdiskusi mengenai suatu persoalan." },
    { char: "評", romaji: "HYOU", onyomi: "ヒョウ", kunyomi: "-", bushuu: "言 (Kata / Bahasa)", meaning: "Menilai, Mempertimbangkan", baseMeaning: "menilai, mempertimbangkan, atau mengkritisi." },
    { char: "決", romaji: "KETSU", onyomi: "ケツ", kunyomi: "き・める, き・まる", bushuu: "氵 (Air)", meaning: "Memutuskan, Menentukan", baseMeaning: "memutuskan atau menentukan suatu hal." },
    { char: "発", romaji: "HATSU", onyomi: "ハツ, ホツ", kunyomi: "-", bushuu: "癶 (Langkah / Kaki)", meaning: "Mengajukan, Memulai, Mengeluarkan", baseMeaning: "mengajukan, memulai, atau mengeluarkan gagasan/usulan." },
    { char: "建", romaji: "KEN", onyomi: "ケン, コン", kunyomi: "た・てる, た・つ", bushuu: "廴 (Melangkah Panjang)", meaning: "Mengemukakan, Mengusulkan", baseMeaning: "mengemukakan atau mengusulkan rekomendasi." },
    { char: "動", romaji: "DOU", onyomi: "ドウ", kunyomi: "うご・く, うご・かす", bushuu: "力 (Kekuatan)", meaning: "Menggerakkan, Mengajukan Tindakan", baseMeaning: "menggerakkan atau mengajukan usul/tindakan." },
    { char: "案", romaji: "AN", onyomi: "アン", kunyomi: "-", bushuu: "木 (Pohon)", meaning: "Rancangan, Usulan", baseMeaning: "rancangan, usulan, rencana, atau gagasan." },
    { char: "題", romaji: "DAI", onyomi: "ダイ", kunyomi: "-", bushuu: "頁 (Kepala / Halaman)", meaning: "Topik, Pokok Persoalan", baseMeaning: "topik, pokok persoalan, tema, atau hal yang perlu dibahas/diselesaikan." },
    { char: "異", romaji: "I", onyomi: "イ", kunyomi: "こと・なる", bushuu: "田 (Sawah / Ladang)", meaning: "Berbeda, Tidak Sama", baseMeaning: "berbeda, tidak sama, atau berbeda pendapat." },
    { char: "物", romaji: "BUTSU", onyomi: "ブツ, モツ", kunyomi: "もの", bushuu: "牛 (Sapi)", meaning: "Hal, Perkara", baseMeaning: "hal, perkara, benda, atau urusan." },
    { char: "争", romaji: "SOU", onyomi: "ソウ", kunyomi: "あらそ・う", bushuu: "亅 (Kait)", meaning: "Berselisih, Memperdebatkan", baseMeaning: "berselisih, memperdebatkan, atau bertikai." },
    { char: "和", romaji: "WA", onyomi: "ワ, オ", kunyomi: "やわ・らぐ, なご・む", bushuu: "口 (Mulut)", meaning: "Damai, Harmonis", baseMeaning: "damai, harmonis, atau saling bersepakat." },
    { char: "員", romaji: "IN", onyomi: "イン", kunyomi: "-", bushuu: "口 (Mulut)", meaning: "Anggota, Personel", baseMeaning: "anggota, personel, atau orang yang menjadi bagian dari lembaga." },
    { char: "長", romaji: "CHOU", onyomi: "チョウ", kunyomi: "なが・い", bushuu: "長 (Panjang)", meaning: "Pemimpin, Ketua", baseMeaning: "pemimpin, ketua, atau orang yang memimpin rapat/sidang." },
    { char: "事", romaji: "JI", onyomi: "ジ, ズ", kunyomi: "こと", bushuu: "亅 (Kait)", meaning: "Hal, Perkara, Urusan", baseMeaning: "hal, perkara, urusan, atau jalannya suatu kegiatan/rapat." }
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
  console.log("✅ 20 Kanji penyusun diperbarui dengan informasi kamus lengkap.");

  // Bersihkan data relasi lama untuk kanji 議
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
  console.log("🗑️ Data lama berhasil dibersihkan untuk kanji 議.");

  // 2. Daftar 23 Jukugo Resmi Sesuai Urutan Diagram Tangkapan Layar & semantic.md
  const jukugoData = [
    // Kategori 1: 1. PERTEMUAN / DISKUSI (8 jukugos)
    { word: "会議", reading: "かいぎ", meaning: "Rapat" },
    { word: "議論", reading: "ぎろん", meaning: "Diskusi" },
    { word: "論議", reading: "ろんぎ", meaning: "Pembahasan" },
    { word: "討議", reading: "とうぎ", meaning: "Pembahasan" },
    { word: "協議", reading: "きょうぎ", meaning: "Perundingan" },
    { word: "合議", reading: "ごうぎ", meaning: "Musyawarah" },
    { word: "談議", reading: "だんぎ", meaning: "Pembicaraan" },
    { word: "評議", reading: "ひょうぎ", meaning: "Pembahasan untuk mengambil keputusan" },

    // Kategori 2: 2. KEPUTUSAN / PENETAPAN (2 jukugos)
    { word: "決議", reading: "けつぎ", meaning: "Keputusan" },
    { word: "議決", reading: "ぎけつ", meaning: "Penetapan keputusan rapat" },

    // Kategori 3: 3. USULAN / AGENDA (5 jukugos)
    { word: "発議", reading: "はつぎ", meaning: "Pengajuan usul" },
    { word: "建議", reading: "けんぎ", meaning: "Pengajuan usulan" },
    { word: "動議", reading: "どうぎ", meaning: "Mosi" },
    { word: "議案", reading: "ぎあん", meaning: "Rancangan usul" },
    { word: "議題", reading: "ぎだい", meaning: "Topik rapat" },

    // Kategori 4: 4. PENDAPAT / KONFLIK (4 jukugos)
    { word: "異議", reading: "いぎ", meaning: "Keberatan" },
    { word: "物議", reading: "ぶつぎ", meaning: "Kontroversi" },
    { word: "争議", reading: "そうぎ", meaning: "Perselisihan" },
    { word: "和議", reading: "わぎ", meaning: "Perundingan damai" },

    // Kategori 5: 5. PELAKU / LEMBAGA / JALANNYA RAPAT (4 jukugos)
    { word: "議員", reading: "ぎいん", meaning: "Anggota dewan" },
    { word: "議長", reading: "ぎちょう", meaning: "Ketua sidang" },
    { word: "議事", reading: "ぎじ", meaning: "Jalannya rapat" },
    { word: "議会", reading: "ぎかい", meaning: "Parlemen" }
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
  console.log("✅ 23 Jukugo baru berhasil dibuat dengan ID berurutan presisi.");

  // 3. 5 Kategori Master Resmi Sesuai Diagram Tangkapan Layar & semantic.md
  const categoryDefs = [
    {
      name: "1. PERTEMUAN / DISKUSI",
      description: "Kelompok ini menunjukkan makna yang berkaitan dengan kegiatan berkumpul untuk membahas suatu persoalan, melakukan diskusi, bertukar pendapat, atau melakukan perundingan.",
      words: ["会議", "議論", "論議", "討議", "協議", "合議", "談議", "評議"]
    },
    {
      name: "2. KEPUTUSAN / PENETAPAN",
      description: "Kelompok ini menunjukkan makna yang berkaitan dengan hasil pembahasan berupa keputusan, penetapan, atau resolusi.",
      words: ["決議", "議決"]
    },
    {
      name: "3. USULAN / AGENDA",
      description: "Kelompok ini menunjukkan makna yang berkaitan dengan pengajuan suatu usulan, penyampaian gagasan, pengajuan mosi, rancangan usulan, atau topik yang dibahas dalam suatu rapat.",
      words: ["発議", "建議", "動議", "議案", "議題"]
    },
    {
      name: "4. PENDAPAT / KONFLIK",
      description: "Kelompok ini menunjukkan makna yang berkaitan dengan perbedaan pendapat, keberatan, kontroversi, perselisihan, atau upaya mencapai penyelesaian melalui perundingan.",
      words: ["異議", "物議", "争議", "和議"]
    },
    {
      name: "5. PELAKU / LEMBAGA / JALANNYA RAPAT",
      description: "Kelompok ini menunjukkan makna yang berkaitan dengan orang yang terlibat dalam rapat atau lembaga perwakilan, pimpinan rapat, jalannya rapat, serta forum tempat pembahasan dilakukan.",
      words: ["議員", "議長", "議事", "議会"]
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
  console.log("✅ 23 Jukugo berhasil dipetakan ke 5 MasterCategory resmi.");

  // 4. Update Semantic Relations & Constituent Nodes (23 penjelasan makna presisi sesuai semantic.md)
  const semanticDataList = [
    // 1) Pertemuan / Diskusi
    {
      word: "会議",
      penjelasan: "Hubungan makna antar kanji 会 dan 議 menjadi 会議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “rapat atau pertemuan yang dilakukan untuk membahas suatu persoalan.”",
      nodes: [
        { jokugo: "会", arti: "bertemu, berkumpul" },
        { jokugo: "議", arti: "membahas, berunding" }
      ]
    },
    {
      word: "議論",
      penjelasan: "Hubungan makna antar kanji 議 dan 論 menjadi 議論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan membahas suatu persoalan dengan mengemukakan pendapat atau argumentasi.”",
      nodes: [
        { jokugo: "議", arti: "membahas, mengemukakan pendapat" },
        { jokugo: "論", arti: "membahas, berargumentasi" }
      ]
    },
    {
      word: "論議",
      penjelasan: "Hubungan makna antar kanji 論 dan 議 menjadi 論議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pembahasan atau perdebatan mengenai suatu persoalan.”",
      nodes: [
        { jokugo: "論", arti: "membahas, berargumentasi" },
        { jokugo: "議", arti: "membahas, berunding" }
      ]
    },
    {
      word: "討議",
      penjelasan: "Hubungan makna antar kanji 討 dan 議 menjadi 討議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan membahas atau mengkaji suatu persoalan secara mendalam.”",
      nodes: [
        { jokugo: "討", arti: "membahas, menyelidiki, mengkaji" },
        { jokugo: "議", arti: "membahas, berunding" }
      ]
    },
    {
      word: "協議",
      penjelasan: "Hubungan makna antar kanji 協 dan 議 menjadi 協議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perundingan yang dilakukan dengan bekerja sama untuk mencapai kesepakatan.”",
      nodes: [
        { jokugo: "協", arti: "bekerja sama, bersepakat" },
        { jokugo: "議", arti: "membahas, berunding" }
      ]
    },
    {
      word: "合議",
      penjelasan: "Hubungan makna antar kanji 合 dan 議 menjadi 合議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “musyawarah atau pembahasan bersama untuk mencapai suatu keputusan.”",
      nodes: [
        { jokugo: "合", arti: "bersama, menyatukan" },
        { jokugo: "議", arti: "membahas, berunding" }
      ]
    },
    {
      word: "談議",
      penjelasan: "Hubungan makna antar kanji 談 dan 議 menjadi 談議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pembicaraan atau diskusi mengenai suatu persoalan.”",
      nodes: [
        { jokugo: "談", arti: "berbicara, membicarakan" },
        { jokugo: "議", arti: "membahas, berunding" }
      ]
    },
    {
      word: "評議",
      penjelasan: "Hubungan makna antar kanji 評 dan 議 menjadi 評議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan mempertimbangkan dan membahas suatu persoalan untuk memperoleh penilaian atau keputusan.”",
      nodes: [
        { jokugo: "評", arti: "menilai, mempertimbangkan" },
        { jokugo: "議", arti: "membahas, berunding" }
      ]
    },

    // 2) Keputusan / Penetapan
    {
      word: "決議",
      penjelasan: "Hubungan makna antar kanji 決 dan 議 menjadi 決議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keputusan atau resolusi yang ditetapkan melalui pembahasan atau rapat.”",
      nodes: [
        { jokugo: "決", arti: "memutuskan, menentukan" },
        { jokugo: "議", arti: "membahas, berunding" }
      ]
    },
    {
      word: "議決",
      penjelasan: "Hubungan makna antar kanji 議 dan 決 menjadi 議決, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keputusan yang ditetapkan setelah melalui pembahasan atau musyawarah.”",
      nodes: [
        { jokugo: "議", arti: "membahas, berunding" },
        { jokugo: "決", arti: "memutuskan, menentukan" }
      ]
    },

    // 3) Usulan / Agenda
    {
      word: "発議",
      penjelasan: "Hubungan makna antar kanji 発 dan 議 menjadi 発議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tindakan mengajukan suatu usulan atau persoalan untuk dibahas.”",
      nodes: [
        { jokugo: "発", arti: "mengajukan, memulai, mengeluarkan" },
        { jokugo: "議", arti: "membahas, mengusulkan" }
      ]
    },
    {
      word: "建議",
      penjelasan: "Hubungan makna antar kanji 建 dan 議 menjadi 建議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “usulan atau rekomendasi yang diajukan kepada pihak yang berwenang.”",
      nodes: [
        { jokugo: "建", arti: "mengemukakan, mengusulkan" },
        { jokugo: "議", arti: "membahas, mengajukan pendapat" }
      ]
    },
    {
      word: "動議",
      penjelasan: "Hubungan makna antar kanji 動 dan 議 menjadi 動議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mosi atau usul yang diajukan dalam suatu rapat untuk dibahas atau diputuskan.”",
      nodes: [
        { jokugo: "動", arti: "menggerakkan, mengajukan tindakan" },
        { jokugo: "議", arti: "membahas, mengusulkan" }
      ]
    },
    {
      word: "議案",
      penjelasan: "Hubungan makna antar kanji 議 dan 案 menjadi 議案, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “rancangan usulan atau perkara yang diajukan untuk dibahas dalam rapat.”",
      nodes: [
        { jokugo: "議", arti: "membahas, berunding" },
        { jokugo: "案", arti: "rancangan, usulan" }
      ]
    },
    {
      word: "議題",
      penjelasan: "Hubungan makna antar kanji 議 dan 題 menjadi 議題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “topik atau pokok persoalan yang menjadi bahan pembahasan dalam rapat.”",
      nodes: [
        { jokugo: "議", arti: "membahas, berunding" },
        { jokugo: "題", arti: "topik, pokok persoalan" }
      ]
    },

    // 4) Pendapat / Konflik
    {
      word: "異議",
      penjelasan: "Hubungan makna antar kanji 異 dan 議 menjadi 異議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keberatan atau pendapat yang berbeda terhadap suatu keputusan atau pendapat.”",
      nodes: [
        { jokugo: "異", arti: "berbeda, tidak sama" },
        { jokugo: "議", arti: "pendapat, pembahasan" }
      ]
    },
    {
      word: "物議",
      penjelasan: "Hubungan makna antar kanji 物 dan 議 menjadi 物議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “suatu perkara yang menjadi bahan pembicaraan atau menimbulkan kontroversi.”",
      nodes: [
        { jokugo: "物", arti: "hal, perkara" },
        { jokugo: "議", arti: "pembicaraan, pendapat" }
      ]
    },
    {
      word: "争議",
      penjelasan: "Hubungan makna antar kanji 争 dan 議 menjadi 争議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perselisihan atau konflik yang berkaitan dengan suatu persoalan dan memerlukan pembahasan atau penyelesaian.”",
      nodes: [
        { jokugo: "争", arti: "berselisih, memperdebatkan" },
        { jokugo: "議", arti: "membahas, berunding" }
      ]
    },
    {
      word: "和議",
      penjelasan: "Hubungan makna antar kanji 和 dan 議 menjadi 和議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perundingan yang dilakukan untuk mencapai perdamaian atau menyelesaikan perselisihan.”",
      nodes: [
        { jokugo: "和", arti: "damai, harmonis" },
        { jokugo: "議", arti: "berunding, membahas" }
      ]
    },

    // 5) Pelaku / Lembaga / Jalannya Rapat
    {
      word: "議員",
      penjelasan: "Hubungan makna antar kanji 議 dan 員 menjadi 議員, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “orang yang menjadi anggota lembaga perwakilan dan terlibat dalam pembahasan atau pengambilan keputusan.”",
      nodes: [
        { jokugo: "議", arti: "membahas, berunding" },
        { jokugo: "員", arti: "anggota, personel" }
      ]
    },
    {
      word: "議長",
      penjelasan: "Hubungan makna antar kanji 議 dan 長 menjadi 議長, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “orang yang memimpin dan mengatur jalannya sidang atau rapat.”",
      nodes: [
        { jokugo: "議", arti: "rapat, pembahasan" },
        { jokugo: "長", arti: "pemimpin, ketua" }
      ]
    },
    {
      word: "議事",
      penjelasan: "Hubungan makna antar kanji 議 dan 事 menjadi 議事, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “hal-hal atau urusan yang berkaitan dengan jalannya rapat atau persidangan.”",
      nodes: [
        { jokugo: "議", arti: "rapat, pembahasan" },
        { jokugo: "事", arti: "hal, perkara, urusan" }
      ]
    },
    {
      word: "議会",
      penjelasan: "Hubungan makna antar kanji 議 dan 会 menjadi 議会, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “lembaga atau forum tempat para anggota berkumpul untuk membahas persoalan dan mengambil keputusan.”",
      nodes: [
        { jokugo: "議", arti: "membahas, berunding" },
        { jokugo: "会", arti: "pertemuan, perkumpulan" }
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
  console.log("✅ 23 Semantic Relations & Constituent Nodes berhasil diperbarui sesuai semantic.md.");

  // 5. Bersihkan Graph Edges (0 cross-link buatan, sesuai screenshot bersih)
  await prisma.kanjiGraphEdge.deleteMany({
    where: { kanjiId: kanji.id }
  });
  console.log("✅ KanjiGraphEdge bersih (0 cross-link buatan, grafik 100% mengikuti 5 cluster resmi).");

  // 6. Update Grouping Quiz 7460 agar konsisten dengan 23 kosakata & 5 kategori resmi
  const groupingWords = [
    "会議", "議論", "協議",
    "決議", "議決",
    "発議", "動議", "議題",
    "異議", "争議", "和議",
    "議員", "議長", "議会"
  ];

  const groupingCategories = [
    { name: "1. PERTEMUAN / DISKUSI", correctWords: ["会議", "議論", "協議"] },
    { name: "2. KEPUTUSAN / PENETAPAN", correctWords: ["決議", "議決"] },
    { name: "3. USULAN / AGENDA", correctWords: ["発議", "動議", "議題"] },
    { name: "4. PENDAPAT / KONFLIK", correctWords: ["異議", "争議", "和議"] },
    { name: "5. PELAKU / LEMBAGA / JALANNYA RAPAT", correctWords: ["議員", "議長", "議会"] }
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
        explanation: "Pengelompokan jukugo berdasarkan cabang semantic graph kanji 議."
      }
    });
    console.log("✅ Grouping Quiz 7460 berhasil diselaraskan.");
  }

  // 7. Verifikasi Dynamic Kanji Graph
  const graph = await buildDynamicKanjiGraph(kanji.id);
  console.log("\n=== HASIL VERIFIKASI GRAPH KANJI 議 ===");
  console.log("Root Node:", graph.nodes.filter(n => n.type === "root").map(n => ({ id: n.id, label: n.label, meaning: n.description })));
  console.log("Category Nodes:", graph.nodes.filter(n => n.type === "category").map(n => ({ id: n.id, label: n.label, color: n.color })));
  console.log("Sub-bottom Nodes Count:", graph.nodes.filter(n => n.type === "sub-bottom").length);
  console.log("Total Nodes:", graph.nodes.length);
  console.log("Total Edges:", graph.edges.length);
  console.log("Cross-link Edges Total:", graph.edges.filter(e => e.isCrossLink).length);
}

if (require.main === module) {
  syncKanjiGi()
    .catch(e => {
      console.error("Gagal sinkronisasi:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
