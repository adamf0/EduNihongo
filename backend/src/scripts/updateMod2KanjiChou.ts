import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const customGraphChou = {
  categories: [
    {
      title: "1. Kondisi dan Keadaan",
      color: "border-pink-500",
      jukugos: [
        { word: "体調", reading: "たいちょう", meaning: "Kondisi tubuh / kesehatan" },
        { word: "好調", reading: "こうちょう", meaning: "Kondisi baik" },
        { word: "不調", reading: "ふちょう", meaning: "Kondisi buruk" },
        { word: "快調", reading: "かいちょう", meaning: "Kondisi sangat baik" },
        { word: "順調", reading: "じゅんちょう", meaning: "Berjalan lancar" },
        { word: "高調", reading: "こうちょう", meaning: "Keadaan meningkat" },
        { word: "低調", reading: "ていちょう", meaning: "Keadaan rendah" }
      ]
    },
    {
      title: "2. Cara Berbicara dan Bunyi",
      color: "border-green-500",
      jukugos: [
        { word: "口調", reading: "くちょう", meaning: "Cara berbicara" },
        { word: "語調", reading: "ごちょう", meaning: "Gaya bahasa" },
        { word: "声調", reading: "せいちょう", meaning: "Intonasi suara" },
        { word: "音調", reading: "おんちょう", meaning: "Nada suara" }
      ]
    },
    {
      title: "3. Pemeriksaan dan Administrasi",
      color: "border-blue-500",
      jukugos: [
        { word: "調査", reading: "ちょうさ", meaning: "Survei / penelitian" },
        { word: "調書", reading: "ちょうしょ", meaning: "Dokumen pemeriksaan" },
        { word: "調印", reading: "ちょういん", meaning: "Penandatanganan perjanjian" },
        { word: "調達", reading: "ちょうたつ", meaning: "Pengadaan" }
      ]
    },
    {
      title: "4. Pengaturan dan Penyesuaian",
      color: "border-yellow-500",
      jukugos: [
        { word: "調理", reading: "ちょうり", meaning: "Memasak" },
        { word: "調合", reading: "ちょうごう", meaning: "Mencampur" },
        { word: "調製", reading: "ちょうせい", meaning: "Menyiapkan / membuat" },
        { word: "調薬", reading: "ちょうやく", meaning: "Meracik obat" },
        { word: "調律", reading: "ちょうりつ", meaning: "Menyetel nada alat musik" },
        { word: "調味料", reading: "ちょうみりょう", meaning: "Bumbu" }
      ]
    },
    {
      title: "5. Pengendalian dan Perubahan Keadaan",
      color: "border-purple-500",
      jukugos: [
        { word: "強調", reading: "きょうちょう", meaning: "Penekanan" },
        { word: "歩調", reading: "ほちょう", meaning: "Irama langkah" },
        { word: "変調", reading: "へんちょう", meaning: "Perubahan keadaan" },
        { word: "移調", reading: "いちょう", meaning: "Mengubah nada" }
      ]
    }
  ]
};

const CHOU_SEMANTIC_DATA = [
  // 1) Kondisi dan Keadaan
  {
    word: "体調",
    penjelasan: "Hubungan makna antar kanji 体 dan 調 menjadi 体調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna \"keadaan atau kondisi kesehatan tubuh seseorang.\"",
    nodes: [
      { jokugo: "体", arti: "tubuh" },
      { jokugo: "調", arti: "kondisi, penyesuaian" }
    ]
  },
  {
    word: "好調",
    penjelasan: "Hubungan makna antar kanji 好 dan 調 menjadi 好調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna \"keadaan yang baik atau performa yang sedang meningkat.\"",
    nodes: [
      { jokugo: "好", arti: "baik" },
      { jokugo: "調", arti: "keadaan" }
    ]
  },
  {
    word: "不調",
    penjelasan: "Hubungan makna antar kanji 不 dan 調 menjadi 不調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna \"kondisi yang tidak baik atau mengalami gangguan.\"",
    nodes: [
      { jokugo: "不", arti: "tidak" },
      { jokugo: "調", arti: "keadaan" }
    ]
  },
  {
    word: "快調",
    penjelasan: "Hubungan makna antar kanji 快 dan 調 menjadi 快調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna \"keadaan yang sangat baik, sehat, atau suatu aktivitas yang berjalan dengan lancar.\"",
    nodes: [
      { jokugo: "快", arti: "nyaman, menyenangkan" },
      { jokugo: "調", arti: "keadaan" }
    ]
  },
  {
    word: "順調",
    penjelasan: "Hubungan makna antar kanji 順 dan 調 menjadi 順調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna \"suatu kegiatan atau proses yang berlangsung sesuai rencana tanpa mengalami hambatan.\"",
    nodes: [
      { jokugo: "順", arti: "sesuai urutan" },
      { jokugo: "調", arti: "keadaan" }
    ]
  },
  {
    word: "高調",
    penjelasan: "Hubungan makna antar kanji 高 dan 調 menjadi 高調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna \"keadaan yang meningkat atau berada pada tingkat yang tinggi.\"",
    nodes: [
      { jokugo: "高", arti: "tinggi" },
      { jokugo: "調", arti: "keadaan" }
    ]
  },
  {
    word: "低調",
    penjelasan: "Hubungan makna antar kanji 低 dan 調 menjadi 低調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna \"keadaan yang menurun, kurang aktif, atau tidak berkembang.\"",
    nodes: [
      { jokugo: "低", arti: "rendah" },
      { jokugo: "調", arti: "keadaan" }
    ]
  },

  // 2) Cara Berbicara dan Bunyi
  {
    word: "口調",
    penjelasan: "Hubungan makna antar kanji 口 dan 調 menjadi 口調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna \"cara seseorang berbicara atau menyampaikan sesuatu melalui nada dan gaya berbicara.\"",
    nodes: [
      { jokugo: "口", arti: "mulut" },
      { jokugo: "調", arti: "nada, cara" }
    ]
  },
  {
    word: "語調",
    penjelasan: "Hubungan makna antar kanji 語 dan 調 menjadi 語調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna \"gaya bahasa atau nada yang digunakan seseorang dalam berkomunikasi.\"",
    nodes: [
      { jokugo: "語", arti: "bahasa" },
      { jokugo: "調", arti: "nada" }
    ]
  },
  {
    word: "声調",
    penjelasan: "Hubungan makna antar kanji 声 dan 調 menjadi 声調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna \"tinggi rendah atau irama suara ketika mengucapkan suatu kata atau kalimat.\"",
    nodes: [
      { jokugo: "声", arti: "suara" },
      { jokugo: "調", arti: "nada" }
    ]
  },
  {
    word: "音調",
    penjelasan: "Hubungan makna antar kanji 音 dan 調 menjadi 音調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna \"keselarasan tinggi rendah nada dalam bunyi atau musik.\"",
    nodes: [
      { jokugo: "音", arti: "bunyi" },
      { jokugo: "調", arti: "irama" }
    ]
  },

  // 3) Pemeriksaan dan Administrasi
  {
    word: "調査",
    penjelasan: "Hubungan makna antar kanji 調 dan 査 menjadi 調査, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna \"kegiatan memeriksa atau menyelidiki suatu objek secara sistematis untuk memperoleh data atau informasi.\"",
    nodes: [
      { jokugo: "調", arti: "menyelidiki" },
      { jokugo: "査", arti: "memeriksa" }
    ]
  },
  {
    word: "調書",
    penjelasan: "Hubungan makna antar kanji 調 dan 書 menjadi 調書, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna \"dokumen yang berisi hasil pemeriksaan, penyelidikan, atau pencatatan suatu peristiwa.\"",
    nodes: [
      { jokugo: "調", arti: "menyelidiki" },
      { jokugo: "書", arti: "dokumen" }
    ]
  },
  {
    word: "調印",
    penjelasan: "Hubungan makna antar kanji 調 dan 印 menjadi 調印, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna \"kegiatan menandatangani suatu dokumen setelah isi perjanjian disepakati oleh para pihak.\"",
    nodes: [
      { jokugo: "調", arti: "menyepakati" },
      { jokugo: "印", arti: "tanda tangan / cap" }
    ]
  },
  {
    word: "調達",
    penjelasan: "Hubungan makna antar kanji 調 dan 達 menjadi 調達, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna \"kegiatan mengatur dan memperoleh barang atau perlengkapan yang diperlukan.\"",
    nodes: [
      { jokugo: "調", arti: "mengatur" },
      { jokugo: "達", arti: "memperoleh" }
    ]
  },

  // 4) Pengaturan dan Penyesuaian
  {
    word: "調理",
    penjelasan: "Hubungan makna antar kanji 調 dan 理 menjadi 調理, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna \"mengolah dan mengatur bahan makanan hingga siap dikonsumsi.\"",
    nodes: [
      { jokugo: "調", arti: "mengolah" },
      { jokugo: "理", arti: "mengatur" }
    ]
  },
  {
    word: "調合",
    penjelasan: "Hubungan makna antar kanji 調 dan 合 menjadi 調合, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna \"mencampurkan beberapa bahan dengan komposisi yang sesuai sehingga menghasilkan campuran yang diinginkan.\"",
    nodes: [
      { jokugo: "調", arti: "menyesuaikan" },
      { jokugo: "合", arti: "menggabungkan" }
    ]
  },
  {
    word: "調製",
    penjelasan: "Hubungan makna antar kanji 調 dan 製 menjadi 調製, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna \"menyiapkan atau membuat sesuatu sesuai kebutuhan atau tujuan tertentu.\"",
    nodes: [
      { jokugo: "調", arti: "menyiapkan" },
      { jokugo: "製", arti: "membuat" }
    ]
  },
  {
    word: "調薬",
    penjelasan: "Hubungan makna antar kanji 調 dan 薬 menjadi 調薬, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna \"menyiapkan atau meracik obat sesuai dengan resep atau kebutuhan pasien.\"",
    nodes: [
      { jokugo: "調", arti: "menyiapkan" },
      { jokugo: "薬", arti: "obat" }
    ]
  },
  {
    word: "調律",
    penjelasan: "Hubungan makna antar kanji 調 dan 律 menjadi 調律, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna \"menyelaraskan nada atau frekuensi instrumen musik agar kembali standar dan seimbang.\"",
    nodes: [
      { jokugo: "調", arti: "menyesuaikan, menyetel" },
      { jokugo: "律", arti: "nada, hukum" }
    ]
  },
  {
    word: "調味料",
    penjelasan: "Hubungan makna antar 調味 dan 料 menjadi 調味料, menunjukkan bahwa gabungan kedua unsur tersebut membentuk sebuah makna \"bahan yang digunakan untuk menyesuaikan atau memperkaya cita rasa makanan.\"",
    nodes: [
      { jokugo: "調味", arti: "memberi rasa" },
      { jokugo: "料", arti: "bahan" }
    ]
  },

  // 5) Pengendalian dan Perubahan Keadaan
  {
    word: "強調",
    penjelasan: "Hubungan makna antar kanji 強 dan 調 menjadi 強調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna \"memberikan penekanan yang kuat pada bagian yang dianggap penting.\"",
    nodes: [
      { jokugo: "強", arti: "kuat" },
      { jokugo: "調", arti: "menonjolkan" }
    ]
  },
  {
    word: "歩調",
    penjelasan: "Hubungan makna antar kanji 歩 dan 調 menjadi 歩調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna \"menyelaraskan langkah atau gerakan agar berjalan bersama secara teratur.\"",
    nodes: [
      { jokugo: "歩", arti: "berjalan" },
      { jokugo: "調", arti: "irama" }
    ]
  },
  {
    word: "変調",
    penjelasan: "Hubungan makna antar kanji 変 dan 調 menjadi 変調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna \"perubahan kondisi dari keadaan yang normal menjadi keadaan yang berbeda.\"",
    nodes: [
      { jokugo: "変", arti: "berubah" },
      { jokugo: "調", arti: "keadaan" }
    ]
  },
  {
    word: "移調",
    penjelasan: "Hubungan makna antar kanji 移 dan 調 menjadi 移調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna \"memindahkan tinggi rendah nada suatu lagu tanpa mengubah susunan melodinya.\"",
    nodes: [
      { jokugo: "移", arti: "memindahkan" },
      { jokugo: "調", arti: "nada" }
    ]
  }
];

async function run() {
  const char = "調";
  const kanji = await prisma.kanji.findFirst({ where: { character: char } });
  if (!kanji) {
    console.error(`Kanji ${char} not found in DB`);
    return;
  }

  const validWords = new Set<string>();
  customGraphChou.categories.forEach(cat => {
    cat.jukugos.forEach(jk => validWords.add(jk.word));
  });

  // 1. Clean obsolete Jukugo records for 調
  const existingJukugos = await prisma.jukugo.findMany({
    where: { kanjiId: kanji.id }
  });

  for (const j of existingJukugos) {
    if (!validWords.has(j.word)) {
      await prisma.kategoriKanji.deleteMany({ where: { jokugoId: j.id } });
      await prisma.semanticRelation.deleteMany({ where: { jukugoId: j.id } });
      await prisma.jukugo.delete({ where: { id: j.id } });
      console.log(`Deleted obsolete jukugo for 調: ${j.word}`);
    }
  }

  // 2. Delete existing KanjiGraphEdge for 調
  await prisma.kanjiGraphEdge.deleteMany({ where: { kanjiId: kanji.id } });

  // 3. Re-create KanjiGraphEdge
  const graphEdges: any[] = [];
  customGraphChou.categories.forEach((cat, catIdx) => {
    const catId = `${char}-cat-${catIdx + 1}`;
    graphEdges.push({
      id: `${char}-e-root-cat${catIdx + 1}`,
      kanjiId: kanji.id,
      source: `${char}-root`,
      target: catId,
      predicate: null
    });

    cat.jukugos.forEach((jk, jkIdx) => {
      const subId = `${char}-sub-${catIdx + 1}-${jkIdx + 1}`;
      graphEdges.push({
        id: `${char}-e-cat${catIdx + 1}-sub${jkIdx + 1}`,
        kanjiId: kanji.id,
        source: catId,
        target: subId,
        predicate: null
      });
    });
  });

  await prisma.kanjiGraphEdge.createMany({ data: graphEdges });

  // 4. Clear all old KategoriKanji mappings for this kanji's jukugos
  const currentJukugos = await prisma.jukugo.findMany({ where: { kanjiId: kanji.id } });
  const currentJukugoIds = currentJukugos.map(j => j.id);
  await prisma.kategoriKanji.deleteMany({
    where: { jokugoId: { in: currentJukugoIds } }
  });

  // 5. Update MasterCategory, Jukugo, KategoriKanji
  const allWords: string[] = [];
  const groups: Record<string, string[]>[] = [];

  for (const cat of customGraphChou.categories) {
    let masterCat = await prisma.masterCategory.findFirst({
      where: { name: cat.title },
    });
    if (!masterCat) {
      masterCat = await prisma.masterCategory.create({
        data: { name: cat.title },
      });
    }

    const categoryWords: string[] = [];

    for (const jk of cat.jukugos) {
      categoryWords.push(jk.word);
      if (!allWords.includes(jk.word)) {
        allWords.push(jk.word);
      }

      let dbJukugo = await prisma.jukugo.findFirst({
        where: { kanjiId: kanji.id, word: jk.word },
      });
      if (!dbJukugo) {
        dbJukugo = await prisma.jukugo.create({
          data: {
            kanjiId: kanji.id,
            word: jk.word,
            reading: jk.reading,
            meaning: jk.meaning,
          },
        });
      } else {
        await prisma.jukugo.update({
          where: { id: dbJukugo.id },
          data: {
            reading: jk.reading,
            meaning: jk.meaning
          }
        });
      }

      await prisma.kategoriKanji.create({
        data: {
          jokugoId: dbJukugo.id,
          categoryId: masterCat.id,
        },
      });
    }

    groups.push({ [cat.title]: categoryWords });
  }

  // 6. Update SemanticRelation & SemanticRelationNode for kanji 調
  await prisma.semanticRelation.deleteMany({ where: { kanjiId: kanji.id } });

  for (const semItem of CHOU_SEMANTIC_DATA) {
    const targetWord = semItem.word;
    const matchedJukugo = await prisma.jukugo.findFirst({
      where: { kanjiId: kanji.id, word: targetWord }
    });

    const createdSem = await prisma.semanticRelation.create({
      data: {
        kanjiId: kanji.id,
        jukugoId: matchedJukugo?.id || null,
        penjelasan: semItem.penjelasan,
      }
    });

    if (semItem.nodes && semItem.nodes.length > 0) {
      await prisma.semanticRelationNode.createMany({
        data: semItem.nodes.map(n => ({
          semanticId: createdSem.id,
          jokugo: n.jokugo,
          arti: n.arti
        }))
      });
    }
  }

  // 7. Update Grouping Quiz for kanji 調
  await prisma.quiz.deleteMany({
    where: { kanjiId: kanji.id, type: "grouping" }
  });

  await prisma.quiz.create({
    data: {
      kanjiId: kanji.id,
      type: "grouping",
      question: "Kelompokkan jukugo berikut ini ke dalam cabang semantic graph yang tepat.",
      words: JSON.stringify(allWords),
      groups: JSON.stringify(groups),
      explanation: `Pengelompokan jukugo berdasarkan cabang semantic graph kanji ${char}.`
    }
  });

  console.log(`Successfully updated graph, categories, semantic relations & grouping quiz for ${char}`);
}

run()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
