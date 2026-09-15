import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const customGraphsMod4: Record<string, {
  categories: { title: string; color: string; jukugos: { word: string; reading: string; meaning: string }[] }[]
}> = {
  "職": {
    categories: [
      {
        title: "1. PROFESI / PEKERJAAN",
        color: "border-purple-500",
        jukugos: [
          { word: "職業", reading: "しょくぎょう", meaning: "profesi / pekerjaan" },
          { word: "職人", reading: "しょくにん", meaning: "pengrajin / pekerja terampil" }
        ]
      },
      {
        title: "2. ORANG / TEMPAT KERJA",
        color: "border-blue-500",
        jukugos: [
          { word: "職員", reading: "しょくいん", meaning: "staf / pegawai" },
          { word: "職場", reading: "しょくば", meaning: "tempat kerja" }
        ]
      },
      {
        title: "3. MENCARI / MEMILIKI PEKERJAAN",
        color: "border-green-500",
        jukugos: [
          { word: "求職", reading: "きゅうしょく", meaning: "mencari pekerjaan" },
          { word: "有職", reading: "ゆうしょく", meaning: "memiliki pekerjaan" }
        ]
      },
      {
        title: "4. PERUBAHAN / STATUS PEKERJAAN",
        color: "border-orange-500",
        jukugos: [
          { word: "転職", reading: "てんしょく", meaning: "pindah pekerjaan" },
          { word: "退職", reading: "たいしょく", meaning: "berhenti bekerja" },
          { word: "無職", reading: "むしょく", meaning: "tidak bekerja / pengangguran" }
        ]
      }
    ]
  },
  "業": {
    categories: [
      {
        title: "1. PEKERJAAN / TUGAS",
        color: "border-blue-500",
        jukugos: [
          { word: "業務", reading: "ぎょうむ", meaning: "tugas / pekerjaan" },
          { word: "作業", reading: "さぎょう", meaning: "pekerjaan / tugas" },
          { word: "始業", reading: "しぎょう", meaning: "mulai kerja" },
          { word: "残業", reading: "ざんぎょう", meaning: "kerja lembur" },
          { word: "就業", reading: "しゅうぎょう", meaning: "bekerja / mulai bekerja" },
          { word: "失業", reading: "しつぎょう", meaning: "kehilangan pekerjaan / pengangguran" }
        ]
      },
      {
        title: "2. USAHA / BISNIS / DUNIA KERJA",
        color: "border-green-500",
        jukugos: [
          { word: "営業", reading: "えいぎょう", meaning: "usaha / bisnis / penjualan" },
          { word: "業者", reading: "ぎょうしゃ", meaning: "pelaku usaha / pedagang" },
          { word: "業界", reading: "ぎょうかい", meaning: "dunia usaha / industri" },
          { word: "家業", reading: "かぎょう", meaning: "usaha keluarga" },
          { word: "企業", reading: "きぎょう", meaning: "perusahaan / usaha" },
          { word: "事業", reading: "じぎょう", meaning: "usaha / kegiatan bisnis" },
          { word: "自営業", reading: "じえいぎょう", meaning: "usaha sendiri / wiraswasta" }
        ]
      },
      {
        title: "3. BIDANG INDUSTRI / PEKERJAAN",
        color: "border-purple-500",
        jukugos: [
          { word: "工業", reading: "こうぎょう", meaning: "industri" },
          { word: "農業", reading: "のうぎょう", meaning: "pertanian" },
          { word: "漁業", reading: "ぎょぎょう", meaning: "perikanan" },
          { word: "産業", reading: "さんぎょう", meaning: "industri" },
          { word: "商業", reading: "しょうぎょう", meaning: "perdagangan / bisnis" }
        ]
      },
      {
        title: "4. BENTUK / STATUS PEKERJAAN",
        color: "border-orange-500",
        jukugos: [
          { word: "本業", reading: "ほんぎょう", meaning: "pekerjaan utama" }
        ]
      }
    ]
  },
  "商": {
    categories: [
      {
        title: "1. TEMPAT",
        color: "border-green-500",
        jukugos: [
          { word: "商店", reading: "しょうてん", meaning: "toko" },
          { word: "商店街", reading: "しょうてんがい", meaning: "kawasan pertokoan" }
        ]
      },
      {
        title: "2. PRODUK",
        color: "border-blue-500",
        jukugos: [
          { word: "商品", reading: "しょうひん", meaning: "barang/produk" }
        ]
      },
      {
        title: "3. KEGIATAN",
        color: "border-orange-500",
        jukugos: [
          { word: "商売", reading: "しょうばい", meaning: "bisnis/perdagangan" },
          { word: "商業", reading: "しょうぎょう", meaning: "perdagangan" },
          { word: "商取引", reading: "しょうとりひき", meaning: "transaksi perdagangan" }
        ]
      },
      {
        title: "4. PELAKU",
        color: "border-purple-500",
        jukugos: [
          { word: "商人", reading: "しょうにん", meaning: "pedagang" }
        ]
      },
      {
        title: "5. JENIS USAHA",
        color: "border-teal-500",
        jukugos: [
          { word: "商社", reading: "しょうしゃ", meaning: "perusahaan dagang" }
        ]
      }
    ]
  },
  "務": {
    categories: [
      {
        title: "1. PEKERJAAN / TUGAS",
        color: "border-blue-500",
        jukugos: [
          { word: "業務", reading: "ぎょうむ", meaning: "pekerjaan / tugas" },
          { word: "職務", reading: "しょくむ", meaning: "tugas / pekerjaan jabatan" },
          { word: "勤務", reading: "きんむ", meaning: "bekerja / bertugas" },
          { word: "実務", reading: "じつむ", meaning: "pekerjaan praktis" },
          { word: "事務", reading: "じむ", meaning: "urusan administrasi" }
        ]
      },
      {
        title: "2. TUGAS / KEWAJIBAN",
        color: "border-green-500",
        jukugos: [
          { word: "任務", reading: "にんむ", meaning: "tugas / misi" },
          { word: "義務", reading: "ぎむ", meaning: "kewajiban" },
          { word: "公務", reading: "こうむ", meaning: "tugas resmi" }
        ]
      },
      {
        title: "3. URUSAN / PELAKSANAAN TUGAS",
        color: "border-orange-500",
        jukugos: [
          { word: "労務", reading: "ろうむ", meaning: "urusan tenaga kerja" },
          { word: "服務", reading: "ふくむ", meaning: "menjalankan tugas" },
          { word: "用務", reading: "ようむ", meaning: "urusan / keperluan" }
        ]
      },
      {
        title: "4. BIDANG / URUSAN TUGAS",
        color: "border-purple-500",
        jukugos: [
          { word: "財務", reading: "ざいむ", meaning: "urusan keuangan" },
          { word: "教務", reading: "きょうむ", meaning: "urusan pendidikan" },
          { word: "法務", reading: "ほうむ", meaning: "urusan hukum" }
        ]
      }
    ]
  },
  "術": {
    categories: [
      {
        title: "1. TEKNIK / KETERAMPILAN",
        color: "border-blue-500",
        jukugos: [
          { word: "技術", reading: "ぎじゅつ", meaning: "teknik / keterampilan" },
          { word: "手術", reading: "しゅじゅつ", meaning: "operasi" },
          { word: "話術", reading: "わじゅつ", meaning: "keterampilan berbicara" },
          { word: "秘術", reading: "ひじゅつ", meaning: "teknik rahasia" }
        ]
      },
      {
        title: "2. ILMU / PENGETAHUAN",
        color: "border-green-500",
        jukugos: [
          { word: "学術", reading: "がくじゅつ", meaning: "ilmu / akademik" },
          { word: "算術", reading: "さんじゅつ", meaning: "ilmu hitung" }
        ]
      },
      {
        title: "3. SENI / KEAHLIAN SENI",
        color: "border-orange-500",
        jukugos: [
          { word: "芸術", reading: "げいじゅつ", meaning: "seni" },
          { word: "美術", reading: "びじゅつ", meaning: "seni rupa" }
        ]
      }
    ]
  }
};

async function run() {
  for (const char of Object.keys(customGraphsMod4)) {
    const kanji = await prisma.kanji.findFirst({ where: { character: char } });
    if (!kanji) {
      console.log(`Kanji ${char} not found in DB`);
      continue;
    }

    const config = customGraphsMod4[char];

    // 1. Delete existing KanjiGraphEdge for this kanji
    await prisma.kanjiGraphEdge.deleteMany({ where: { kanjiId: kanji.id } });

    // 2. Re-create KanjiGraphEdge
    const graphEdges: any[] = [];
    config.categories.forEach((cat, catIdx) => {
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

    // 3. Update MasterCategory, Jukugo, KategoriKanji
    const allWords: string[] = [];
    const groups: Record<string, string[]>[] = [];

    for (const cat of config.categories) {
      let masterCat = await prisma.masterCategory.findUnique({
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

        const existingMap = await prisma.kategoriKanji.findFirst({
          where: { jokugoId: dbJukugo.id, categoryId: masterCat.id },
        });
        if (!existingMap) {
          await prisma.kategoriKanji.create({
            data: {
              jokugoId: dbJukugo.id,
              categoryId: masterCat.id,
            },
          });
        }
      }

      groups.push({ [cat.title]: categoryWords });
    }

    // 4. Update Grouping Quiz for this kanji
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

    console.log(`Successfully updated graph & grouping quiz for ${char}`);
  }
}

run()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
