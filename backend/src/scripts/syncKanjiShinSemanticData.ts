import { PrismaClient } from "@prisma/client";
import { buildDynamicKanjiGraph } from "../services/graphService";

const prisma = new PrismaClient();

export async function syncKanjiShin() {
  console.log("🚀 Memulai sinkronisasi data Semantic Graph & Kuis untuk Kanji 信 (Modul 3)...");

  // 1. Ambil Kanji 信 (ID: 3227, ModuleId: 557)
  const kanji = await prisma.kanji.findFirst({
    where: { character: "信" }
  });

  if (!kanji) {
    throw new Error("Kanji 信 tidak ditemukan di database!");
  }

  // Update informasi dasar kanji 信 sesuai diagram & semantic.md
  await prisma.kanji.update({
    where: { id: kanji.id },
    data: {
      romaji: "SHIN",
      meaning: "Percaya, Meyakini, Kabar, Tanda",
      baseMeaning: "percaya, meyakini, kebenaran, surat atau kabar, serta tanda atau isyarat."
    }
  });
  console.log("✅ Kanji 信 diperbarui: romaji 'SHIN', meaning 'Percaya, Meyakini, Kabar, Tanda'.");

  // Hapus jukugo 信言 jika ada
  const oldShingen = await prisma.jukugo.findFirst({
    where: { kanjiId: kanji.id, word: "信言" }
  });
  if (oldShingen) {
    await prisma.kategoriKanji.deleteMany({ where: { jokugoId: oldShingen.id } });
    await prisma.semanticRelation.deleteMany({ where: { jukugoId: oldShingen.id } });
    await prisma.jukugo.delete({ where: { id: oldShingen.id } });
    console.log("🗑️ Jukugo lama '信言' berhasil dihapus dari kanji 信.");
  }

  // 2. Daftar 17 Jukugo Resmi Sesuai Diagram Tangkapan Layar & semantic.md
  const jukugoData = [
    // Kategori 1: 1. Kepercayaan dan Keyakinan (10 jukugos)
    { word: "自信", reading: "じしん", meaning: "kepercayaan diri" },
    { word: "不信", reading: "ふしん", meaning: "ketidakpercayaan" },
    { word: "信頼", reading: "しんらい", meaning: "kepercayaan" },
    { word: "信用", reading: "しんよう", meaning: "kepercayaan" },
    { word: "信任", reading: "しんにん", meaning: "pemberian kepercayaan" },
    { word: "信義", reading: "しんぎ", meaning: "kesetiaan pada janji" },
    { word: "信念", reading: "しんねん", meaning: "keyakinan" },
    { word: "信者", reading: "しんじゃ", meaning: "penganut" },
    { word: "信徒", reading: "しんと", meaning: "penganut agama" },
    { word: "確信", reading: "かくしん", meaning: "keyakinan kuat" },
    // Kategori 2: 2. Surat, Informasi, dan Komunikasi (5 jukugos)
    { word: "通信", reading: "つうしん", meaning: "komunikasi" },
    { word: "発信", reading: "はっしん", meaning: "pemancaran informasi" },
    { word: "送信", reading: "そうしん", meaning: "pengiriman pesan" },
    { word: "返信", reading: "へんしん", meaning: "balasan pesan" },
    { word: "交信", reading: "こうしん", meaning: "saling berkomunikasi" },
    // Kategori 3: 3. Tanda dan Isyarat (1 jukugo)
    { word: "信号", reading: "しんごう", meaning: "sinyal" },
    // Kategori 4: 4. Informasi dan Dokumen (1 jukugo)
    { word: "信書", reading: "しんしょ", meaning: "surat" }
  ];

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

  // 3. 4 Kategori Master Resmi Sesuai Diagram Tangkapan Layar & semantic.md
  const categoryDefs = [
    {
      name: "1. Kepercayaan dan Keyakinan",
      description: "Kanji 信 pada kelompok ini berkaitan dengan makna percaya, meyakini, memberikan kepercayaan, serta keyakinan terhadap seseorang atau sesuatu.",
      words: ["自信", "不信", "信頼", "信用", "信任", "信義", "信念", "信者", "信徒", "確信"]
    },
    {
      name: "2. Surat, Informasi, dan Komunikasi",
      description: "Kelompok kedua berkembang dari makna kabar atau surat dan hubungan dengan kegiatan menyampaikan, mengirim, menerima, membalas, dan bertukar informasi.",
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

  // Hapus pemetaan kategori lama untuk jukugo kanji 信 agar tidak ada kategori ganda/pecahan
  for (const jId of jukugoMap.values()) {
    await prisma.kategoriKanji.deleteMany({
      where: { jokugoId: jId }
    });
  }

  // Bersihkan kategori sampah pecahan ("2. Surat", "Informasi", "dan Komunikasi") jika ada
  for (const bogusName of ["2. Surat", "Informasi", "dan Komunikasi"]) {
    const bogusCat = await prisma.masterCategory.findFirst({ where: { name: bogusName } });
    if (bogusCat) {
      await prisma.kategoriKanji.deleteMany({ where: { categoryId: bogusCat.id } });
      await prisma.masterCategory.delete({ where: { id: bogusCat.id } });
      console.log(`🗑️ Kategori pecahan '${bogusName}' berhasil dihapus.`);
    }
  }

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
  console.log("✅ 17 Jukugo berhasil dipetakan ke 4 MasterCategory bernomor urut.");

  // 4. Update Semantic Relations & Constituent Nodes (17 penjelasan makna presisi sesuai semantic.md)
  const semanticDataList = [
    {
      word: "自信",
      penjelasan: "Hubungan makna antar kanji 自 dan 信 menjadi 自信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kepercayaan terhadap diri sendiri atau percaya pada kemampuan diri.”",
      nodes: [
        { jokugo: "自", arti: "diri sendiri" },
        { jokugo: "信", arti: "percaya / yakin" }
      ]
    },
    {
      word: "不信",
      penjelasan: "Hubungan makna antar kanji 不 dan 信 menjadi 不信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tidak percaya atau keadaan tidak memiliki kepercayaan terhadap seseorang atau sesuatu.”",
      nodes: [
        { jokugo: "不", arti: "tidak / bukan" },
        { jokugo: "信", arti: "percaya / yakin" }
      ]
    },
    {
      word: "信頼",
      penjelasan: "Hubungan makna antar kanji 信 dan 頼 menjadi 信頼, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kepercayaan terhadap seseorang atau sesuatu yang dianggap dapat diandalkan.”",
      nodes: [
        { jokugo: "信", arti: "percaya / kepercayaan" },
        { jokugo: "頼", arti: "mengandalkan / bergantung kepada" }
      ]
    },
    {
      word: "信用",
      penjelasan: "Hubungan makna antar kanji 信 dan 用 menjadi 信用, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kepercayaan atau penilaian bahwa seseorang atau sesuatu dapat dipercaya.”",
      nodes: [
        { jokugo: "信", arti: "percaya / kepercayaan" },
        { jokugo: "用", arti: "menggunakan / kegunaan" }
      ]
    },
    {
      word: "信任",
      penjelasan: "Hubungan makna antar kanji 信 dan 任 menjadi 信任, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memberikan kepercayaan kepada seseorang untuk menjalankan tugas atau tanggung jawab.”",
      nodes: [
        { jokugo: "信", arti: "percaya / kepercayaan" },
        { jokugo: "任", arti: "mempercayakan / menyerahkan tanggung jawab" }
      ]
    },
    {
      word: "信義",
      penjelasan: "Hubungan makna antar kanji 信 dan 義 menjadi 信義, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kepercayaan dan kesetiaan yang didasarkan pada kebenaran atau prinsip moral.”",
      nodes: [
        { jokugo: "信", arti: "percaya / dapat dipercaya" },
        { jokugo: "義", arti: "kebenaran / kewajiban moral" }
      ]
    },
    {
      word: "信念",
      penjelasan: "Hubungan makna antar kanji 信 dan 念 menjadi 信念, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keyakinan yang dipegang dengan kuat dan tidak mudah berubah.”",
      nodes: [
        { jokugo: "信", arti: "percaya / meyakini" },
        { jokugo: "念", arti: "pikiran / keyakinan / perhatian" }
      ]
    },
    {
      word: "信者",
      penjelasan: "Hubungan makna antar kanji 信 dan 者 menjadi 信者, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “orang yang percaya atau menganut suatu kepercayaan.”",
      nodes: [
        { jokugo: "信", arti: "percaya / meyakini" },
        { jokugo: "者", arti: "orang" }
      ]
    },
    {
      word: "信徒",
      penjelasan: "Hubungan makna antar kanji 信 dan 徒 menjadi 信徒, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “orang yang mengikuti atau menganut suatu kepercayaan.”",
      nodes: [
        { jokugo: "信", arti: "percaya / meyakini" },
        { jokugo: "徒", arti: "pengikut / penganut" }
      ]
    },
    {
      word: "確信",
      penjelasan: "Hubungan makna antar kanji 確 dan 信 menjadi 確信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keyakinan yang kuat atau kepastian terhadap sesuatu.”",
      nodes: [
        { jokugo: "確", arti: "pasti / jelas / memastikan" },
        { jokugo: "信", arti: "percaya / yakin" }
      ]
    },
    {
      word: "通信",
      penjelasan: "Hubungan makna antar kanji 通 dan 信 menjadi 通信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “proses penyampaian atau pertukaran informasi antar pihak yang satu dengan pihak lainnya.”",
      nodes: [
        { jokugo: "通", arti: "melalui / menghubungkan / berkomunikasi" },
        { jokugo: "信", arti: "kabar / informasi / pesan" }
      ]
    },
    {
      word: "発信",
      penjelasan: "Hubungan makna antar kanji 発 dan 信 menjadi 発信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirimkan atau menyampaikan informasi dari suatu pihak kepada pihak lain.”",
      nodes: [
        { jokugo: "発", arti: "mengeluarkan / mengirim / memulai" },
        { jokugo: "信", arti: "informasi / pesan" }
      ]
    },
    {
      word: "送信",
      penjelasan: "Hubungan makna antar kanji 送 dan 信 menjadi 送信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirimkan pesan, informasi, atau data kepada pihak lain.”",
      nodes: [
        { jokugo: "送", arti: "mengirim" },
        { jokugo: "信", arti: "informasi / pesan" }
      ]
    },
    {
      word: "返信",
      penjelasan: "Hubungan makna antar kanji 返 dan 信 menjadi 返信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirimkan kembali pesan atau surat sebagai balasan.”",
      nodes: [
        { jokugo: "返", arti: "mengembalikan / membalas" },
        { jokugo: "信", arti: "surat / pesan" }
      ]
    },
    {
      word: "交信",
      penjelasan: "Hubungan makna antar kanji 交 dan 信 menjadi 交信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “saling bertukar pesan atau informasi antar dua pihak atau lebih.”",
      nodes: [
        { jokugo: "交", arti: "saling / berhubungan / bertukar" },
        { jokugo: "信", arti: "pesan / informasi" }
      ]
    },
    {
      word: "信号",
      penjelasan: "Hubungan makna antar kanji 信 dan 号 menjadi 信号, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tanda atau isyarat yang digunakan untuk menyampaikan informasi atau pesan tertentu.”",
      nodes: [
        { jokugo: "信", arti: "tanda / isyarat" },
        { jokugo: "号", arti: "tanda / simbol / nomor" }
      ]
    },
    {
      word: "信書",
      penjelasan: "Hubungan makna antar kanji 信 dan 書 menjadi 信書, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “surat atau dokumen tertulis yang digunakan untuk menyampaikan pesan dari seseorang kepada orang lain.”",
      nodes: [
        { jokugo: "信", arti: "surat / kabar" },
        { jokugo: "書", arti: "tulisan / dokumen / surat" }
      ]
    }
  ];

  // Bersihkan relasi lama kanji 信 (cascade menghapus SemanticRelationNode)
  await prisma.semanticRelation.deleteMany({
    where: { kanjiId: kanji.id }
  });

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
  console.log("✅ 17 Semantic Relations & Constituent Nodes berhasil diperbarui sesuai semantic.md.");

  // 5. Bersihkan Graph Edges (Hapus cross-link buatan; diagram resmi adalah 4 cluster tanpa cross-link busur liar)
  await prisma.kanjiGraphEdge.deleteMany({
    where: { kanjiId: kanji.id }
  });
  console.log("✅ KanjiGraphEdge bersih (0 cross-link buatan, grafik 100% mengikuti 4 cluster resmi).");

  // 6. Update Kuis Sesuai soal.md
  await prisma.quiz.deleteMany({
    where: { kanjiId: kanji.id }
  });

  const quizzesData = [
    // a) Unscramble (5 soal rumpang sesuai soal.md)
    {
      kanjiId: kanji.id,
      type: "unscramble",
      question: "Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.",
      options: JSON.stringify([]),
      words: JSON.stringify(["情報を", "前に", "発信して", "おきます", "会議の"]),
      correctOrder: JSON.stringify(["会議の", "前に", "情報を", "発信して", "おきます"]),
      correctAnswer: "0",
      explanation: "Kalimat yang tepat: 会議の前に情報を発信しておきます。(Sebelum rapat, menyampaikan informasi terlebih dahulu.)"
    },
    {
      kanjiId: kanji.id,
      type: "unscramble",
      question: "Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.",
      options: JSON.stringify([]),
      words: JSON.stringify(["信用を", "うそを", "つけば", "なくします", "ついたら"]),
      correctOrder: JSON.stringify(["うそを", "ついたら", "信用を", "なくします"]),
      correctAnswer: "0",
      explanation: "Kalimat yang tepat: うそをついたら信用をなくします。(Jika berbohong, akan kehilangan kepercayaan.)"
    },
    {
      kanjiId: kanji.id,
      type: "unscramble",
      question: "Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.",
      options: JSON.stringify([]),
      words: JSON.stringify(["おいてあります", "大切な", "机の", "信書が", "上に"]),
      correctOrder: JSON.stringify(["机の", "上に", "大切な", "信書が", "おいてあります"]),
      correctAnswer: "0",
      explanation: "Kalimat yang tepat: 机の上に大切な信書がおいてあります。(Di atas meja diletakkan dokumen/surat penting.)"
    },
    {
      kanjiId: kanji.id,
      type: "unscramble",
      question: "Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.",
      options: JSON.stringify([]),
      words: JSON.stringify(["あれば", "成功するでしょう", "信念が", "強く"]),
      correctOrder: JSON.stringify(["信念が", "強く", "あれば", "成功するでしょう"]),
      correctAnswer: "0",
      explanation: "Kalimat yang tepat: 信念が強くあれば成功するでしょう。(Jika memiliki keyakinan yang kuat, pasti akan berhasil.)"
    },
    {
      kanjiId: kanji.id,
      type: "unscramble",
      question: "Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.",
      options: JSON.stringify([]),
      words: JSON.stringify(["返信が", "んです", "まだ", "来ない"]),
      correctOrder: JSON.stringify(["まだ", "返信が", "来ない", "んです"]),
      correctAnswer: "0",
      explanation: "Kalimat yang tepat: まだ返信が来ないんです。(Balasannya masih belum datang.)"
    },

    // c) Pilihan Ganda Makna (5 soal sesuai soal.md)
    {
      kanjiId: kanji.id,
      type: "multiple",
      question: "Jukugo mana yang berhubungan dengan makna “kegiatan saling mengirim dan menerima pesan atau informasi antar dua pihak atau lebih”?",
      options: JSON.stringify(["通信", "信号", "信念"]),
      correctAnswer: "0",
      explanation: "Jawaban tepat: a. 通信 (tsuushin) = proses penyampaian atau pertukaran informasi antar dua pihak atau lebih."
    },
    {
      kanjiId: kanji.id,
      type: "multiple",
      question: "Jukugo mana yang berhubungan dengan makna “kegiatan mengirim pesan atau informasi kepada orang lain melalui suatu media”?",
      options: JSON.stringify(["発信", "自信", "信者"]),
      correctAnswer: "0",
      explanation: "Jawaban tepat: a. 発信 (hasshin) = mengirimkan atau menyampaikan informasi kepada pihak lain."
    },
    {
      kanjiId: kanji.id,
      type: "multiple",
      question: "Jukugo mana yang berhubungan dengan makna “tindakan membalas pesan atau surat yang telah diterima dari orang lain”?",
      options: JSON.stringify(["信頼", "返信", "信号"]),
      correctAnswer: "1",
      explanation: "Jawaban tepat: b. 返信 (henshin) = membalas pesan atau surat."
    },
    {
      kanjiId: kanji.id,
      type: "multiple",
      question: "Jukugo mana yang berhubungan dengan makna “tAnda yang digunakan untuk menyampaikan informasi atau petunjuk tertentu”?",
      options: JSON.stringify(["信書", "信義", "信号"]),
      correctAnswer: "2",
      explanation: "Jawaban tepat: c. 信号 (shingou) = tanda atau isyarat yang digunakan untuk menyampaikan informasi atau petunjuk."
    },
    {
      kanjiId: kanji.id,
      type: "multiple",
      question: "Jukugo mana yang berhubungan dengan makna “keyakinan atau prinsip yang diyakini dan dijadikan pegangan oleh seseorang”?",
      options: JSON.stringify(["信念", "信者", "自信"]),
      correctAnswer: "0",
      explanation: "Jawaban tepat: a. 信念 (shinnen) = keyakinan atau prinsip yang dipegang teguh."
    },

    // d) Isian Kalimat / Fill in the blank (5 soal sesuai soal.md)
    {
      kanjiId: kanji.id,
      type: "fill",
      question: "インターネットを使って友達と（　　　　）しています。",
      options: JSON.stringify(["通信", "信号", "信念"]),
      correctAnswer: "0",
      targetWord: "通信",
      explanation: "Jawaban tepat: 通信. Kalimat: インターネットを使って友達と通信しています。(Berkomunikasi dengan teman menggunakan internet)."
    },
    {
      kanjiId: kanji.id,
      type: "fill",
      question: "メールを受け取ったので、すぐに（　　　　）しました。",
      options: JSON.stringify(["信頼", "返信", "信用"]),
      correctAnswer: "1",
      targetWord: "返信",
      explanation: "Jawaban tepat: 返信. Kalimat: メールを受け取ったので、すぐに返信しました。(Karena menerima email, segera membalas)."
    },
    {
      kanjiId: kanji.id,
      type: "fill",
      question: "駅では赤い（　　　　）が見えたら、電車に注意してください。",
      options: JSON.stringify(["信号", "信者", "信念"]),
      correctAnswer: "0",
      targetWord: "信号",
      explanation: "Jawaban tepat: 信号. Kalimat: 駅では赤い信号が見えたら、電車に注意してください。(Jika melihat sinyal merah di stasiun, berhati-hatilah terhadap kereta)."
    },
    {
      kanjiId: kanji.id,
      type: "fill",
      question: "彼は自分の力を信じる強い（　　　　）を持っています。",
      options: JSON.stringify(["自信", "信書", "信号"]),
      correctAnswer: "0",
      targetWord: "自信",
      explanation: "Jawaban tepat: 自信. Kalimat: 彼は自分の力を信じる強い自信を持っています。(Dia memiliki rasa percaya diri yang kuat terhadap kemampuannya)."
    },
    {
      kanjiId: kanji.id,
      type: "fill",
      question: "私は約束を守る彼をとても（　　　　）しています。",
      options: JSON.stringify(["信号", "信頼", "信念"]),
      correctAnswer: "1",
      targetWord: "信頼",
      explanation: "Jawaban tepat: 信頼. Kalimat: 私は約束を守る彼をとても信頼しています。(Saya sangat mempercayai dia yang menepati janji)."
    },

    // Grouping Quiz (Menyelaraskan 4 kategori resmi)
    {
      kanjiId: kanji.id,
      type: "grouping",
      question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
      words: JSON.stringify(["通信", "発信", "送信", "返信", "交信", "信号", "信書", "自信", "不信", "信頼", "信用", "信念", "確信"]),
      groups: JSON.stringify([
        {
          name: "1. Kepercayaan dan Keyakinan",
          category: "1. Kepercayaan dan Keyakinan",
          correctWords: ["自信", "不信", "信頼", "信用", "信念", "確信"],
          items: ["自信", "不信", "信頼", "信用", "信念", "確信"]
        },
        {
          name: "2. Surat, Informasi, dan Komunikasi",
          category: "2. Surat, Informasi, dan Komunikasi",
          correctWords: ["通信", "発信", "送信", "返信", "交信"],
          items: ["通信", "発信", "送信", "返信", "交信"]
        },
        {
          name: "3. Tanda dan Isyarat",
          category: "3. Tanda dan Isyarat",
          correctWords: ["信号"],
          items: ["信号"]
        },
        {
          name: "4. Informasi dan Dokumen",
          category: "4. Informasi dan Dokumen",
          correctWords: ["信書"],
          items: ["信書"]
        }
      ]),
      explanation: "Kelompokkan jukugo ke dalam 4 kategori makna dasar Kanji 信: Kepercayaan dan Keyakinan, Surat, Informasi, dan Komunikasi, Tanda dan Isyarat, serta Informasi dan Dokumen."
    }
  ];

  for (const q of quizzesData) {
    await prisma.quiz.create({ data: q });
  }
  console.log("✅ 16 Kuis resmi sesuai soal.md (5 unscramble, 5 multiple, 5 fill, 1 grouping) berhasil diperbarui.");

  // 7. Verifikasi Dynamic Kanji Graph
  const graph = await buildDynamicKanjiGraph(kanji.id);
  console.log("\n=== HASIL VERIFIKASI GRAPH KANJI 信 ===");
  console.log("Root Node:", graph.nodes.filter(n => n.type === "root").map(n => ({ id: n.id, label: n.label, meaning: n.description })));
  console.log("Category Nodes:", graph.nodes.filter(n => n.type === "category").map(n => ({ id: n.id, label: n.label, color: n.color })));
  console.log("Sub-bottom Nodes Count:", graph.nodes.filter(n => n.type === "sub-bottom").length);
  console.log("Total Nodes:", graph.nodes.length);
  console.log("Total Edges:", graph.edges.length);
  console.log("Cross-link Edges Total:", graph.edges.filter(e => e.isCrossLink).length);
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
