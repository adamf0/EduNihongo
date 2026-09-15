import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const customGraphsMod3: Record<string, {
  categories: { title: string; color: string; jukugos: { word: string; reading: string; meaning: string }[] }[]
}> = {
  "情": {
    categories: [
      {
        title: "1. PERASAAN / EMOSI",
        color: "border-pink-500",
        jukugos: [
          { word: "感情", reading: "かんじょう", meaning: "perasaan, emosi" },
          { word: "表情", reading: "ひょうじょう", meaning: "ekspresi wajah" },
          { word: "真情", reading: "しんじょう", meaning: "perasaan yang sebenarnya" },
          { word: "心情", reading: "しんじょう", meaning: "perasaan hati, suasana batin" },
          { word: "純情", reading: "じゅんじょう", meaning: "perasaan yang murni, tulus" }
        ]
      },
      {
        title: "2. KASIH SAYANG / HUBUNGAN ANTARMANUSIA",
        color: "border-orange-500",
        jukugos: [
          { word: "愛情", reading: "あいじょう", meaning: "kasih sayang, cinta" },
          { word: "友情", reading: "ゆうじょう", meaning: "persahabatan, persahabatan tulus" },
          { word: "同情", reading: "どうじょう", meaning: "simpati, empati" },
          { word: "人情", reading: "にんじょう", meaning: "perasaan kemanusiaan" },
          { word: "交情", reading: "こうじょう", meaning: "hubungan akrab, perasaan kedekatan" }
        ]
      },
      {
        title: "3. PERASAAN / SEMANGAT YANG KUAT",
        color: "border-cyan-500",
        jukugos: [
          { word: "情熱", reading: "じょうねつ", meaning: "semangat, gairah, passion" },
          { word: "熱情", reading: "ねつじょう", meaning: "perasaan, semangat yang kuat" }
        ]
      },
      {
        title: "4. KEADAAN / SITUASI",
        color: "border-purple-500",
        jukugos: [
          { word: "事情", reading: "じじょう", meaning: "keadaan, alasan, latar belakang" },
          { word: "実情", reading: "じつじょう", meaning: "keadaan sebenarnya, realitas" },
          { word: "内情", reading: "ないじょう", meaning: "keadaan internal, keadaan di dalam" },
          { word: "情勢", reading: "じょうせい", meaning: "situasi, kondisi, keadaan terkini" },
          { word: "情景", reading: "じょうけい", meaning: "pemandangan, adegan, suasana" }
        ]
      },
      {
        title: "5. KELUHAN / PERASAAN TIDAK PUAS",
        color: "border-green-500",
        jukugos: [
          { word: "苦情", reading: "くじょう", meaning: "keluhan, komplain" }
        ]
      },
      {
        title: "6. INFORMASI / DATA",
        color: "border-blue-500",
        jukugos: [
          { word: "情報", reading: "じょうほう", meaning: "informasi, berita, data" }
        ]
      }
    ]
  },
  "報": {
    categories: [
      {
        title: "1. INFORMASI / PEMBERITAHUAN",
        color: "border-red-500",
        jukugos: [
          { word: "情報", reading: "じょうほう", meaning: "informasi" },
          { word: "予報", reading: "よほう", meaning: "prakiraan / ramalan" },
          { word: "報知", reading: "ほうち", meaning: "pemberitahuan" },
          { word: "通報", reading: "つうほう", meaning: "melaporkan / memberitahukan" },
          { word: "報告", reading: "ほうこく", meaning: "laporan" }
        ]
      },
      {
        title: "2. BERITA / JENIS INFORMASI",
        color: "border-orange-500",
        jukugos: [
          { word: "速報", reading: "そくほう", meaning: "berita cepat / terkini" },
          { word: "続報", reading: "ぞくほう", meaning: "berita lanjutan" },
          { word: "特報", reading: "とくほう", meaning: "berita khusus" },
          { word: "悲報", reading: "ひほう", meaning: "berita duka" },
          { word: "勝報", reading: "しょうほう", meaning: "berita kemenangan" }
        ]
      },
      {
        title: "3. LAPORAN / PUBLIKASI / INFORMASI RESMI",
        color: "border-blue-500",
        jukugos: [
          { word: "日報", reading: "にっぽう", meaning: "laporan harian" },
          { word: "広報", reading: "こうほう", meaning: "informasi / publikasi kepada masyarakat" },
          { word: "公報", reading: "こうほう", meaning: "pengumuman / berita resmi" },
          { word: "確報", reading: "かくほう", meaning: "laporan yang telah dipastikan" },
          { word: "会報", reading: "かいほう", meaning: "buletin / laporan organisasi" },
          { word: "時報", reading: "じほう", meaning: "informasi waktu yang diumumkan berkala" }
        ]
      },
      {
        title: "4. BALASAN / PEMBALASAN",
        color: "border-green-500",
        jukugos: [
          { word: "返報", reading: "へんぽう", meaning: "balasan / pembalasan" },
          { word: "報復", reading: "ほうふく", meaning: "pembalasan" }
        ]
      },
      {
        title: "5. MEDIA / CARA PENYAMPAIAN INFORMASI",
        color: "border-purple-500",
        jukugos: [
          { word: "電報", reading: "でんぽう", meaning: "telegram" },
          { word: "外報", reading: "がいほう", meaning: "berita dari luar negeri" },
          { word: "報道", reading: "ほうどう", meaning: "pemberitaan / media berita" }
        ]
      }
    ]
  },
  "伝": {
    categories: [
      {
        title: "1. PENYAMPAIAN PESAN DAN INFORMASI",
        color: "border-red-500",
        jukugos: [
          { word: "伝言", reading: "でんごん", meaning: "pesan" },
          { word: "伝達", reading: "でんたつ", meaning: "penyampaian" },
          { word: "伝聞", reading: "でんぶん", meaning: "kabar" },
          { word: "伝令", reading: "でんれい", meaning: "utusan" }
        ]
      },
      {
        title: "2. PENYAMPAIAN DAN PEWARISAN ILMU / AJARAN",
        color: "border-orange-500",
        jukugos: [
          { word: "伝授", reading: "でんじゅ", meaning: "mengajarkan" },
          { word: "伝受", reading: "でんじゅ", meaning: "menerima" },
          { word: "伝習", reading: "でんしゅう", meaning: "mempelajari" },
          { word: "伝道", reading: "でんどう", meaning: "menyebarkan ajaran" }
        ]
      },
      {
        title: "3. PEWARISAN TRADISI DAN CERITA",
        color: "border-teal-500",
        jukugos: [
          { word: "伝統", reading: "でんとう", meaning: "tradisi" },
          { word: "伝説", reading: "でんせつ", meaning: "legenda" }
        ]
      },
      {
        title: "4. RIWAYAT DAN INFORMASI TERTULIS",
        color: "border-blue-500",
        jukugos: [
          { word: "伝記", reading: "でんき", meaning: "biografi" },
          { word: "自伝", reading: "じでん", meaning: "autobiografi" },
          { word: "伝書", reading: "でんしょ", meaning: "dokumen" },
          { word: "伝写", reading: "でんしゃ", meaning: "menyalin" }
        ]
      },
      {
        title: "5. PENGIRIMAN DAN PENERUSAN",
        color: "border-green-500",
        jukugos: [
          { word: "伝送", reading: "でんそう", meaning: "pengiriman" }
        ]
      }
    ]
  },
  "信": {
    categories: [
      {
        title: "1. PENYAMPAIAN PESAN DAN INFORMASI",
        color: "border-red-500",
        jukugos: [
          { word: "信言", reading: "しんげん", meaning: "kata-kata / pernyataan yang dapat dipercaya" },
          { word: "通信", reading: "つうしん", meaning: "komunikasi / pertukaran informasi" },
          { word: "発信", reading: "はっしん", meaning: "mengirim / menyampaikan informasi" },
          { word: "送信", reading: "そうしん", meaning: "mengirim / mentransmisikan informasi" },
          { word: "返信", reading: "へんしん", meaning: "membalas pesan / surat" },
          { word: "交信", reading: "こうしん", meaning: "saling berkomunikasi" },
          { word: "信号", reading: "しんごう", meaning: "tanda / sinyal" }
        ]
      },
      {
        title: "2. PENYAMPAIAN DAN PEWARISAN ILMU / AJARAN",
        color: "border-orange-500",
        jukugos: [
          { word: "信念", reading: "しんねん", meaning: "keyakinan / prinsip yang diyakini" },
          { word: "信者", reading: "しんじゃ", meaning: "orang yang percaya / penganut" },
          { word: "信徒", reading: "しんと", meaning: "penganut agama" },
          { word: "信頼", reading: "しんらい", meaning: "kepercayaan / dapat dipercaya" },
          { word: "信用", reading: "しんよう", meaning: "kepercayaan / kredibilitas" },
          { word: "信任", reading: "しんにん", meaning: "kepercayaan / mempercayakan" },
          { word: "信義", reading: "しんぎ", meaning: "kepercayaan dan kesetiaan" }
        ]
      },
      {
        title: "3. KEYAKINAN DAN KEPERCAYAAN DIRI",
        color: "border-green-500",
        jukugos: [
          { word: "確信", reading: "かくしん", meaning: "keyakinan kuat / kepastian" },
          { word: "自信", reading: "じしん", meaning: "percaya diri / keyakinan terhadap diri sendiri" }
        ]
      },
      {
        title: "4. INFORMASI DAN DOKUMEN",
        color: "border-blue-500",
        jukugos: [
          { word: "信書", reading: "しんしょ", meaning: "surat / dokumen yang disampaikan" }
        ]
      }
    ]
  },
  "送": {
    categories: [
      {
        title: "1. PENGIRIMAN INFORMASI / PESAN",
        color: "border-red-500",
        jukugos: [
          { word: "送信", reading: "そうしん", meaning: "mengirim pesan / mengirimkan (data/informasi)" },
          { word: "電送", reading: "でんそう", meaning: "pengiriman melalui media elektronik / transmisi elektronik" },
          { word: "伝送", reading: "でんそう", meaning: "meneruskan / mentransmisikan informasi, sinyal" },
          { word: "放送", reading: "ほうそう", meaning: "siaran / menyebarkan informasi kepada banyak orang" }
        ]
      },
      {
        title: "2. PENGIRIMAN / PENGANTARAN BENDA / BARANG",
        color: "border-orange-500",
        jukugos: [
          { word: "発送", reading: "はっそう", meaning: "mengirim / mengeluarkan kiriman" },
          { word: "直送", reading: "ちょくそう", meaning: "pengiriman langsung ke tujuan" },
          { word: "送付", reading: "そうふ", meaning: "mengirimkan (barang, dokumen, surat, dll.)" },
          { word: "郵送", reading: "ゆうそう", meaning: "mengirim melalui pos / surat" },
          { word: "配送", reading: "はいそう", meaning: "pengiriman (barang, paket, pesanan)" },
          { word: "輸送", reading: "ゆそう", meaning: "mengangkut / mengirim barang atau penumpang" },
          { word: "移送", reading: "いそう", meaning: "memindahkan / mengirim ke tempat lain" },
          { word: "回送", reading: "かいそう", meaning: "mengirim kembali / mengirim ke tempat asal atau tempat lain" },
          { word: "転送", reading: "てんそう", meaning: "meneruskan / mengalihkan kiriman ke tujuan lain" },
          { word: "押送", reading: "おうそう", meaning: "mengawal / mengantar seseorang dengan kendaraan resmi" }
        ]
      },
      {
        title: "3. PENYERAHAN / PENGIRIMAN KEPADA PIHAK BERWENANG",
        color: "border-green-500",
        jukugos: [
          { word: "送検", reading: "そうけん", meaning: "mengirim tersangka / berkas perkara ke jaksa (untuk dituntut)" },
          { word: "送信", reading: "そうしん", meaning: "menyerahkan / mengirim kepada pihak berwenang" },
          { word: "護送", reading: "ごそう", meaning: "mengawal / mengantar terdakwa, tahanan, dsb." },
          { word: "押送", reading: "おうそう", meaning: "mengawal / mengantar seseorang dengan kendaraan resmi" }
        ]
      },
      {
        title: "4. MENGIRIM / MELEPAS ORANG YANG PERGI",
        color: "border-purple-500",
        jukugos: [
          { word: "送別", reading: "そうべつ", meaning: "perpisahan / mengantar seseorang yang pergi" },
          { word: "歓送", reading: "かんそう", meaning: "melepas / mengantar seseorang dengan ucapan selamat atau penghormatan" },
          { word: "送辞", reading: "そうじ", meaning: "pidato perpisahan / ucapan saat mengantar pergi" },
          { word: "押送", reading: "おうそう", meaning: "mengantar / melepas jenazah (dalam konteks pemakaman)" }
        ]
      },
      {
        title: "5. PENGIRIMAN MELALUI JALUR KHUSUS",
        color: "border-blue-500",
        jukugos: [
          { word: "陸送", reading: "りくそう", meaning: "pengiriman melalui jalur darat" },
          { word: "電送", reading: "でんそう", meaning: "pengiriman melalui jalur listrik / transmisi elektronik" }
        ]
      }
    ]
  }
};

async function run() {
  for (const char of Object.keys(customGraphsMod3)) {
    const kanji = await prisma.kanji.findFirst({ where: { character: char } });
    if (!kanji) {
      console.log(`Kanji ${char} not found in DB`);
      continue;
    }

    const config = customGraphsMod3[char];

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
