import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=== MEMULAI SINKRONISASI KETAT MODUL 1 (試・験・問・題・答) ===");

  // 1. Registrasi 9 Kanji Penyusun Tunggal yang belum ada di tabel Kanji (moduleId: null)
  const constituentKanjis = [
    {
      character: "射",
      romaji: "sha",
      meaning: "menembak, melepaskan",
      bushuu: "身",
      onyomi: "シャ",
      kunyomi: "い.る, さ.す",
    },
    {
      character: "練",
      romaji: "ren",
      meaning: "melatih, menggembleng",
      bushuu: "糸",
      onyomi: "レン",
      kunyomi: "ね.る",
    },
    {
      character: "治",
      romaji: "chi, ji",
      meaning: "mengobati, menyembuhkan, mengatur",
      bushuu: "水",
      onyomi: "チ, ジ",
      kunyomi: "おさ.める, なお.る",
    },
    {
      character: "効",
      romaji: "kou",
      meaning: "efek, khasiat, berguna",
      bushuu: "力",
      onyomi: "コウ",
      kunyomi: "き.く",
    },
    {
      character: "難",
      romaji: "nan",
      meaning: "sulit, sukar, bencana",
      bushuu: "隹",
      onyomi: "ナン",
      kunyomi: "むずか.しい",
    },
    {
      character: "責",
      romaji: "seki",
      meaning: "tanggung jawab, kewajiban, menuntut",
      bushuu: "貝",
      onyomi: "セキ",
      kunyomi: "せ.める",
    },
    {
      character: "副",
      romaji: "fuku",
      meaning: "tambahan, sekunder, wakil",
      bushuu: "刀",
      onyomi: "フク",
      kunyomi: "-",
    },
    {
      character: "筆",
      romaji: "hitsu",
      meaning: "kuas, pena, menulis",
      bushuu: "竹",
      onyomi: "ヒツ",
      kunyomi: "ふで",
    },
    {
      character: "礼",
      romaji: "rei",
      meaning: "salam, kesopanan, penghormatan, etiket",
      bushuu: "示",
      onyomi: "レイ, ライ",
      kunyomi: "-",
    },
  ];

  for (const ck of constituentKanjis) {
    await prisma.kanji.upsert({
      where: { character: ck.character },
      update: {
        romaji: ck.romaji,
        meaning: ck.meaning,
        bushuu: ck.bushuu,
        onyomi: ck.onyomi,
        kunyomi: ck.kunyomi,
      },
      create: {
        character: ck.character,
        romaji: ck.romaji,
        meaning: ck.meaning,
        bushuu: ck.bushuu,
        onyomi: ck.onyomi,
        kunyomi: ck.kunyomi,
        moduleId: null,
      },
    });
  }
  console.log("✓ 9 Kanji penyusun tunggal terverifikasi di database.");

  // 2. Data lengkap per Kanji
  const kanjiDataset = [
    // -------------------------------------------------------------
    // KANJI 試 (ID: 3212)
    // -------------------------------------------------------------
    {
      id: 3212,
      character: "試",
      romaji: "shi",
      meaning: "Mencoba / Menguji",
      baseMeaning:
        "mencoba atau menguji sesuatu untuk mengetahui hasil, kemampuan, kualitas, fungsi, atau kecocokannya.",
      categories: [
        {
          name: "Aktivitas Pengujian",
          jukugos: [
            {
              word: "試験",
              reading: "しけん",
              meaning: "ujian",
              unsur: [
                { jokugo: "試", arti: "mencoba, menguji" },
                {
                  jokugo: "験",
                  arti: "menguji, membuktikan melalui pengalaman atau pengujian",
                },
              ],
              penjelasan:
                "Hubungan makna antar kanji 試 dan 験 menjadi 試験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan menguji untuk mengetahui atau membuktikan kemampuan, pengetahuan, atau hasil tertentu.”",
            },
            {
              word: "入試",
              reading: "にゅうし",
              meaning: "ujian masuk",
              unsur: [
                { jokugo: "入", arti: "masuk, memasuki" },
                { jokugo: "試", arti: "mencoba, menguji" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 入 dan 試 menjadi 入試, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “ujian yang dilakukan untuk menentukan apakah seseorang dapat masuk ke sekolah, universitas, atau lembaga tertentu.”",
            },
            {
              word: "追試",
              reading: "ついし",
              meaning: "ujian susulan",
              unsur: [
                {
                  jokugo: "追",
                  arti: "mengikuti, menyusul, menambahkan",
                },
                { jokugo: "試", arti: "ujian, pengujian" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 追 dan 試 menjadi 追試, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “ujian tambahan atau ujian susulan yang dilakukan setelah ujian utama.”",
            },
            {
              word: "試問",
              reading: "しもん",
              meaning: "ujian lisan",
              unsur: [
                { jokugo: "試", arti: "mencoba, menguji" },
                { jokugo: "問", arti: "bertanya, pertanyaan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 試 dan 問 menjadi 試問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengujian yang dilakukan dengan memberikan pertanyaan untuk mengetahui kemampuan atau pengetahuan seseorang.”",
            },
          ],
        },
        {
          name: "Penggunaan",
          jukugos: [
            {
              word: "試着",
              reading: "しちゃく",
              meaning: "coba pakaian",
              unsur: [
                { jokugo: "試", arti: "mencoba, menguji" },
                { jokugo: "着", arti: "memakai, mengenakan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 試 dan 着 menjadi 試着, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba mengenakan pakaian untuk mengetahui ukuran, penampilan, atau kecocokannya.”",
            },
            {
              word: "試用",
              reading: "しよう",
              meaning: "uji coba",
              unsur: [
                { jokugo: "試", arti: "mencoba, menguji" },
                { jokugo: "用", arti: "menggunakan, memakai" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 試 dan 用 menjadi 試用, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba menggunakan sesuatu untuk mengetahui fungsi, kualitas, atau kesesuaiannya.”",
            },
            {
              word: "試乗",
              reading: "しじょう",
              meaning: "test drive",
              unsur: [
                { jokugo: "試", arti: "mencoba, menguji" },
                { jokugo: "乗", arti: "menaiki, mengendarai" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 試 dan 乗 menjadi 試乗, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba menaiki atau mengendarai kendaraan untuk mengetahui kondisi, kenyamanan, atau performanya.”",
            },
          ],
        },
        {
          name: "Konsumsi",
          jukugos: [
            {
              word: "試食",
              reading: "ししょく",
              meaning: "uji rasa",
              unsur: [
                { jokugo: "試", arti: "mencoba, menguji" },
                { jokugo: "食", arti: "makan, makanan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 試 dan 食 menjadi 試食, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba atau mencicipi makanan untuk mengetahui rasa atau kualitasnya.”",
            },
            {
              word: "試飲",
              reading: "しいん",
              meaning: "coba minuman",
              unsur: [
                { jokugo: "試", arti: "mencoba, menguji" },
                { jokugo: "飲", arti: "minum" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 試 dan 飲 menjadi 試飲, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba atau mencicipi minuman untuk mengetahui rasa atau kualitasnya.”",
            },
          ],
        },
        {
          name: "Bahan Pengujian",
          jukugos: [
            {
              word: "試薬",
              reading: "しやく",
              meaning: "reagen uji",
              unsur: [
                { jokugo: "試", arti: "mencoba, menguji" },
                { jokugo: "薬", arti: "obat, bahan kimia" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 試 dan 薬 menjadi 試薬, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bahan kimia atau reagen yang digunakan untuk melakukan suatu pengujian.”",
            },
          ],
        },
        {
          name: "Produksi dan Pengembangan",
          jukugos: [
            {
              word: "試作",
              reading: "しさく",
              meaning: "prototipe",
              unsur: [
                { jokugo: "試", arti: "mencoba, menguji" },
                { jokugo: "作", arti: "membuat, menghasilkan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 試 dan 作 menjadi 試作, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba membuat suatu benda atau produk sebagai percobaan untuk menilai bentuk, fungsi, atau kualitasnya.”",
            },
            {
              word: "試製",
              reading: "しせい",
              meaning: "produksi uji",
              unsur: [
                { jokugo: "試", arti: "mencoba, menguji" },
                { jokugo: "製", arti: "membuat, memproduksi" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 試 dan 製 menjadi 試製, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “membuat atau memproduksi sesuatu secara percobaan untuk menguji hasilnya sebelum produksi sebenarnya.”",
            },
          ],
        },
        {
          name: "Kompetisi dan Keterampilan",
          jukugos: [
            {
              word: "試合",
              reading: "しあい",
              meaning: "pertandingan",
              unsur: [
                { jokugo: "試", arti: "mencoba, menguji" },
                { jokugo: "合", arti: "bertemu, berhadapan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 試 dan 合 menjadi 試合, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan mempertemukan dua pihak untuk menguji atau membandingkan kemampuan dalam suatu pertandingan.”",
            },
            {
              word: "試技",
              reading: "しぎ",
              meaning: "uji keterampilan",
              unsur: [
                { jokugo: "試", arti: "mencoba, menguji" },
                { jokugo: "技", arti: "keterampilan, teknik" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 試 dan 技 menjadi 試技, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pelaksanaan atau percobaan suatu teknik untuk menunjukkan atau menguji keterampilan.”",
            },
            {
              word: "試射",
              reading: "ししゃ",
              meaning: "uji tembak",
              unsur: [
                { jokugo: "試", arti: "mencoba, menguji" },
                { jokugo: "射", arti: "menembak" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 試 dan 射 menjadi 試射, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba menembak untuk menguji ketepatan, jarak, atau kinerja senjata.”",
            },
            {
              word: "試練",
              reading: "しれん",
              meaning: "latihan / ujian berat",
              unsur: [
                { jokugo: "試", arti: "mencoba, menguji" },
                { jokugo: "練", arti: "melatih" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 試 dan 練 menjadi 試練, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “latihan atau ujian berat yang dialami untuk menguji dan melatih kemampuan seseorang.”",
            },
          ],
        },
        {
          name: "Media",
          jukugos: [
            {
              word: "試写",
              reading: "ししゃ",
              meaning: "pratinjau film",
              unsur: [
                { jokugo: "試", arti: "mencoba, menguji" },
                {
                  jokugo: "写",
                  arti: "memotret, menyalin, menayangkan gambar",
                },
              ],
              penjelasan:
                "Hubungan makna antar kanji 試 dan 写 menjadi 試写, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menayangkan atau melihat film sebagai percobaan sebelum ditampilkan secara umum.”",
            },
            {
              word: "試聴",
              reading: "しちょう",
              meaning: "mendengar contoh",
              unsur: [
                { jokugo: "試", arti: "mencoba, menguji" },
                { jokugo: "聴", arti: "mendengarkan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 試 dan 聴 menjadi 試聴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba mendengarkan musik, rekaman, atau media suara untuk mengetahui isi atau kualitasnya.”",
            },
            {
              word: "試読",
              reading: "しどく",
              meaning: "membaca contoh",
              unsur: [
                { jokugo: "試", arti: "mencoba, menguji" },
                { jokugo: "読", arti: "membaca" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 試 dan 読 menjadi 試読, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba membaca suatu tulisan atau karya untuk mengetahui isi atau kualitasnya sebelum membaca lebih lanjut.”",
            },
          ],
        },
      ],
      quizzes: [
        // a) Unscramble (Model A)
        {
          type: "unscramble",
          question:
            "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
          words: JSON.stringify([
            "ありました",
            "試合",
            "きのう",
            "が",
          ]),
          correctOrder: JSON.stringify([
            "きのう",
            "試合",
            "が",
            "ありました",
          ]),
          correctAnswer: "0",
          explanation: "Jawaban: きのう試合がありました。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
          words: JSON.stringify([
            "試食",
            "しました",
            "新しいパンを",
            "スーパーで",
          ]),
          correctOrder: JSON.stringify([
            "スーパーで",
            "新しいパンを",
            "試食",
            "しました",
          ]),
          correctAnswer: "0",
          explanation:
            "Jawaban: スーパーで新しいパンを試食しました。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
          words: JSON.stringify([
            "試飲",
            "けさ",
            "ジャム",
            "しました",
            "田中さん",
            "を",
            "は",
          ]),
          correctOrder: JSON.stringify([
            "田中さん",
            "は",
            "けさ",
            "ジャム",
            "を",
            "試飲",
            "しました",
          ]),
          correctAnswer: "0",
          explanation:
            "Jawaban: 田中さんはけさジャムを試飲しました。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
          words: JSON.stringify([
            "します",
            "前に",
            "試乗",
            "買う",
            "新しい車を",
            "まず",
          ]),
          correctOrder: JSON.stringify([
            "新しい車を",
            "買う",
            "前に",
            "まず",
            "試乗",
            "します",
          ]),
          correctAnswer: "0",
          explanation:
            "Jawaban: 新しい車を買う前に、まず試乗します。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
          words: JSON.stringify([
            "あったので",
            "昨日",
            "休みました",
            "試合が",
            "大学を",
          ]),
          correctOrder: JSON.stringify([
            "昨日",
            "試合が",
            "あったので",
            "大学を",
            "休みました",
          ]),
          correctAnswer: "0",
          explanation:
            "Jawaban: 昨日試合があったので、大学をやすみました。",
        },
        // c) Multiple choice (Model C)
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan  makna “kegiatan menguji kemampuan seseorang?",
          options: JSON.stringify(["試験", "試食", "試着"]),
          correctAnswer: "0",
          explanation: "Kunci: a (試験)",
        },
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan  makna“mencoba pakaian sebelum membeli”?",
          options: JSON.stringify(["試用", "試着", "試写"]),
          correctAnswer: "1",
          explanation: "Kunci: b (試着)",
        },
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan makna “mencicipi makanan”?",
          options: JSON.stringify(["試食", "試飲", "試薬"]),
          correctAnswer: "0",
          explanation: "Kunci: a (試食)",
        },
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan  makna “pembuatan produk percobaan /prototype”?",
          options: JSON.stringify(["試合", "試作", "試製"]),
          correctAnswer: "1",
          explanation: "Kunci: b (試作)",
        },
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan  makna ”kompetisi/pertandingan\"?",
          options: JSON.stringify(["試合", "試写", "試技"]),
          correctAnswer: "0",
          explanation: "Kunci: a (試合)",
        },
        // d) Fill in the blank (Model D)
        {
          type: "fill",
          question:
            "来週は（　　　　）がありますから、今から勉強しなければなりません 。",
          options: JSON.stringify(["試合", "試験", "試薬"]),
          correctAnswer: "1",
          explanation: "Kunci: b (試験)",
        },
        {
          type: "fill",
          question:
            "パーティーへ行く前に、服はちゃんと（　　　）して下さい。",
          options: JSON.stringify(["試作", "試着", "試飲"]),
          correctAnswer: "1",
          explanation: "Kunci: b (試着)",
        },
        {
          type: "fill",
          question:
            "今月に工場で（　　　）がありますから、社長が工場に来ます。",
          options: JSON.stringify(["試着", "試薬", "試製"]),
          correctAnswer: "2",
          explanation: "Kunci: c (試製)",
        },
        {
          type: "fill",
          question:
            "今日の午後へ（　　　　）に行く予定があります。",
          options: JSON.stringify(["試験", "試写", "試作"]),
          correctAnswer: "1",
          explanation: "Kunci: b (試写)",
        },
        {
          type: "fill",
          question: "実験の前に＿＿＿＿を準備してください。",
          options: JSON.stringify(["試合", "試験", "試薬"]),
          correctAnswer: "2",
          explanation: "Kunci: c (試薬)",
        },
        // Grouping (Model B)
        {
          type: "grouping",
          question:
            "Kelompokkan jukugo kanji 試 berikut ke dalam cabang semantic graph yang tepat.",
          words: JSON.stringify([
            "試験",
            "入試",
            "追試",
            "試問",
            "試着",
            "試用",
            "試乗",
            "試食",
            "試飲",
            "試薬",
            "試作",
            "試製",
            "試合",
            "試技",
            "試射",
            "試練",
            "試写",
            "試聴",
            "試読",
          ]),
          groups: JSON.stringify([
            {
              name: "Aktivitas Pengujian",
              correctWords: ["試験", "入試", "追試", "試問"],
            },
            {
              name: "Penggunaan",
              correctWords: ["試着", "試用", "試乗"],
            },
            {
              name: "Konsumsi",
              correctWords: ["試食", "試飲"],
            },
            {
              name: "Bahan Pengujian",
              correctWords: ["試薬"],
            },
            {
              name: "Produksi dan Pengembangan",
              correctWords: ["試作", "試製"],
            },
            {
              name: "Kompetisi dan Keterampilan",
              correctWords: ["試合", "試技", "試射", "試練"],
            },
            {
              name: "Media",
              correctWords: ["試写", "試聴", "試読"],
            },
          ]),
          correctAnswer: null,
          explanation: "Kelompokkan 19 kata jukugo kanji 試.",
        },
      ],
    },

    // -------------------------------------------------------------
    // KANJI 験 (ID: 3213)
    // -------------------------------------------------------------
    {
      id: 3213,
      character: "験",
      romaji: "ken",
      meaning: "Mengalami, membuktikan, memverifikasi melalui pengujian",
      baseMeaning: "pengalaman, pengujian, atau verifikasi.",
      categories: [
        {
          name: "Pengujian / Pembuktian",
          jukugos: [
            {
              word: "試験",
              reading: "しけん",
              meaning: "ujian / pengujian",
              unsur: [
                { jokugo: "試", arti: "mencoba, menguji" },
                {
                  jokugo: "験",
                  arti: "menguji, memverifikasi hasil",
                },
              ],
              penjelasan:
                "Hubungan makna antar kanji 試 dan 験 menjadi 試験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “suatu kegiatan pengujian yang dilakukan untuk mengetahui atau mengukur pengetahuan, kemampuan, maupun hasil seseorang atau sesuatu”, sehingga mengandung makna ujian atau pengujian.",
            },
            {
              word: "受験",
              reading: "じゅけん",
              meaning: "mengikuti ujian",
              unsur: [
                { jokugo: "受", arti: "menerima, menjalani" },
                { jokugo: "験", arti: "ujian, pengujian" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 受 dan 験 menjadi 受験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menjalani atau mengikuti suatu proses pengujian”, sehingga mengandung makna mengikuti ujian.",
            },
            {
              word: "実験",
              reading: "じっけん",
              meaning: "eksperimen / percobaan",
              unsur: [
                { jokugo: "実", arti: "nyata, sebenarnya" },
                { jokugo: "験", arti: "menguji, membuktikan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 実 dan 験 menjadi 実験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “melakukan pengujian atau percobaan secara nyata untuk mengetahui dan membuktikan suatu hasil”, sehingga mengandung makna eksperimen atau percobaan.",
            },
            {
              word: "治験",
              reading: "ちけん",
              meaning: "uji klinis",
              unsur: [
                { jokugo: "治", arti: "mengobati, pengobatan" },
                {
                  jokugo: "験",
                  arti: "menguji, memverifikasi",
                },
              ],
              penjelasan:
                "Hubungan makna antar kanji 治 dan 験 menjadi 治験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengujian yang dilakukan dalam bidang pengobatan untuk mengetahui dan memastikan efektivitas serta keamanan suatu obat atau metode pengobatan”, sehingga mengandung makna uji klinis.",
            },
          ],
        },
        {
          name: "Pengalaman",
          jukugos: [
            {
              word: "経験",
              reading: "けいけん",
              meaning: "pengalaman",
              unsur: [
                { jokugo: "経", arti: "melalui, menjalani" },
                {
                  jokugo: "験",
                  arti:
                    "mengalami, memperoleh pengetahuan melalui pengalaman",
                },
              ],
              penjelasan:
                "Hubungan makna antar kanji 経 dan 験 menjadi 経験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sesuatu yang dilalui atau dijalani sehingga seseorang memperoleh pengetahuan atau pemahaman dari apa yang dialaminya”, sehingga mengandung makna pengalaman.",
            },
            {
              word: "体験",
              reading: "たいけん",
              meaning: "pengalaman langsung",
              unsur: [
                { jokugo: "体", arti: "tubuh, diri sendiri" },
                { jokugo: "験", arti: "mengalami" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 体 dan 験 menjadi 体験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengalami sendiri suatu peristiwa atau kegiatan secara langsung”, sehingga mengandung makna pengalaman langsung.",
            },
          ],
        },
        {
          name: "Verifikasi / Pemeriksaan",
          jukugos: [
            {
              word: "験算",
              reading: "けんざん",
              meaning: "pemeriksaan ulang perhitungan",
              unsur: [
                {
                  jokugo: "験",
                  arti: "memeriksa, memverifikasi",
                },
                {
                  jokugo: "算",
                  arti: "menghitung, perhitungan",
                },
              ],
              penjelasan:
                "Hubungan makna antar kanji 験 dan 算 menjadi 験算, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memeriksa atau menghitung kembali suatu perhitungan untuk memastikan bahwa hasilnya benar”, sehingga mengandung makna pemeriksaan ulang perhitungan.",
            },
          ],
        },
        {
          name: "Hasil / Efek / Bukti",
          jukugos: [
            {
              word: "効験",
              reading: "こうけん",
              meaning: "efek / khasiat",
              unsur: [
                { jokugo: "効", arti: "efek, khasiat" },
                { jokugo: "験", arti: "hasil, tanda, bukti" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 効 dan 験 menjadi 効験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “hasil atau efek yang tampak sebagai tanda bahwa sesuatu bekerja atau memberikan hasil”, sehingga mengandung makna efek atau khasiat.",
            },
          ],
        },
      ],
      quizzes: [
        // a) Unscramble (Model A)
        {
          type: "unscramble",
          question:
            "Susunlah  kata-kata berikut berikut menjadi kalimat yang tepat.",
          words: JSON.stringify([
            "明日",
            "試験",
            "が",
            "から",
            "勉強します",
            "ある",
            "の点数",
          ]),
          correctOrder: JSON.stringify([
            "明日",
            "試験",
            "が",
            "ある",
            "から",
            "勉強します",
          ]),
          correctAnswer: "0",
          explanation:
            "Jawaban: 明日、試験があるから、勉強します。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah  kata-kata berikut berikut menjadi kalimat yang tepat.",
          words: JSON.stringify([
            "経験",
            "働いた",
            "が",
            "あります",
            "日本で",
          ]),
          correctOrder: JSON.stringify([
            "日本で",
            "働いた",
            "経験",
            "が",
            "あります",
          ]),
          correctAnswer: "0",
          explanation: "Jawaban: 日本で働いた経験があります。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah  kata-kata berikut berikut menjadi kalimat yang tepat.",
          words: JSON.stringify([
            "文化を",
            "体験しました",
            "京都で",
          ]),
          correctOrder: JSON.stringify([
            "京都で",
            "文化を",
            "体験しました",
          ]),
          correctAnswer: "0",
          explanation:
            "Jawaban: 京都で文化を体験しました。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah  kata-kata berikut berikut menjadi kalimat yang tepat.",
          words: JSON.stringify([
            "実験",
            "を",
            "料理室",
            "しました",
            "で",
          ]),
          correctOrder: JSON.stringify([
            "料理室",
            "で",
            "実験",
            "を",
            "しました",
          ]),
          correctAnswer: "0",
          explanation: "Jawaban: 料理室で実験をしました。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah  kata-kata berikut berikut menjadi kalimat yang tepat.",
          words: JSON.stringify([
            "受検しようと",
            "日本語の",
            "思っています",
            "試験を",
          ]),
          correctOrder: JSON.stringify([
            "日本語の",
            "試験を",
            "受検しようと",
            "思っています",
          ]),
          correctAnswer: "0",
          explanation:
            "Jawaban: 日本語の試験を受検しようと思っています。",
        },
        // c) Multiple choice (Model C)
        {
          type: "multiple",
          question:
            "Jukugo mana  yang berhubungan dengan makna percobaan?",
          options: JSON.stringify(["実験", "体験", "試験"]),
          correctAnswer: "0",
          explanation: "Kunci: a (実験)",
        },
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan makna “efek atau khasiat yang menunjukkan suatu hasil”?",
          options: JSON.stringify(["治験", "効験", "実験"]),
          correctAnswer: "1",
          explanation: "Kunci: b (効験)",
        },
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan makna “pengalaman yang diperoleh dari sesuatu yang telah dijalani”?",
          options: JSON.stringify(["実験", "経験", "験算"]),
          correctAnswer: "1",
          explanation: "Kunci: b (経験)",
        },
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan makna “uji klinis untuk mengetahui efektivitas dan keamanan obat”?",
          options: JSON.stringify(["体験", "試験", "治験"]),
          correctAnswer: "2",
          explanation: "Kunci: c (治験)",
        },
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan makna “mengikuti atau menjalani suatu ujian”?",
          options: JSON.stringify(["受験", "効験", "体験"]),
          correctAnswer: "0",
          explanation: "Kunci: a (受験)",
        },
        // d) Fill in the blank (Model D)
        {
          type: "fill",
          question:
            "日本へいって、色々な（　　　　）をしました。",
          options: JSON.stringify(["実験", "経験", "被験者"]),
          correctAnswer: "1",
          explanation: "Kunci: b (経験)",
        },
        {
          type: "fill",
          question:
            "大学の化学の授業では、学生が（　　　　）を行いました。",
          options: JSON.stringify(["実験", "体験", "受験"]),
          correctAnswer: "0",
          explanation: "Kunci: a (実験)",
        },
        {
          type: "fill",
          question:
            "明日は大切な（　　　　）がありますから、今晩勉強しなければなりません。",
          options: JSON.stringify(["経験", "試験", "体験"]),
          correctAnswer: "1",
          explanation: "Kunci: b (試験)",
        },
        {
          type: "fill",
          question:
            "この薬には（　　　　）があるかもしれません。",
          options: JSON.stringify(["受験", "試験", "効験"]),
          correctAnswer: "2",
          explanation: "Kunci: c (効験)",
        },
        // Grouping (Model B)
        {
          type: "grouping",
          question:
            "Kelompokkan jukugo kanji 験 berikut ke dalam cabang semantic graph yang tepat.",
          words: JSON.stringify([
            "試験",
            "受験",
            "実験",
            "治験",
            "経験",
            "体験",
            "験算",
            "効験",
          ]),
          groups: JSON.stringify([
            {
              name: "Pengujian / Pembuktian",
              correctWords: ["試験", "受験", "実験", "治験"],
            },
            {
              name: "Pengalaman",
              correctWords: ["経験", "体験"],
            },
            {
              name: "Verifikasi / Pemeriksaan",
              correctWords: ["験算"],
            },
            {
              name: "Hasil / Efek / Bukti",
              correctWords: ["効験"],
            },
          ]),
          correctAnswer: null,
          explanation: "Kelompokkan 8 kata jukugo kanji 験.",
        },
      ],
    },

    // -------------------------------------------------------------
    // KANJI 問 (ID: 3214)
    // -------------------------------------------------------------
    {
      id: 3214,
      character: "問",
      romaji: "mon",
      meaning:
        "bertanya, menanyakan, mempertanyakan, mempermasalahkan, mengunjungi (menengok)",
      baseMeaning:
        "bertanya, menanyakan, mempertanyakan, atau mempermasalahkan sesuatu; dalam makna perluasannya juga dapat menunjukkan tindakan mengunjungi atau menengok.",
      categories: [
        {
          name: "1. Bertanya / Mengajukan Pertanyaan",
          jukugos: [
            {
              word: "質問",
              reading: "しつもん",
              meaning: "pertanyaan",
              unsur: [
                {
                  jokugo: "質",
                  arti: "menanyakan, mencari kepastian",
                },
                { jokugo: "問", arti: "bertanya, menanyakan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 質 dan 問 menjadi 質問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pertanyaan yang diajukan untuk memperoleh informasi atau penjelasan mengenai sesuatu.”",
            },
            {
              word: "自問",
              reading: "じもん",
              meaning: "bertanya pada diri sendiri",
              unsur: [
                { jokugo: "自", arti: "diri sendiri" },
                { jokugo: "問", arti: "bertanya, menanyakan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 自 dan 問 menjadi 自問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bertanya atau mempertanyakan sesuatu kepada diri sendiri.”",
            },
            {
              word: "発問",
              reading: "はつもん",
              meaning: "mengajukan pertanyaan",
              unsur: [
                {
                  jokugo: "発",
                  arti: "mengeluarkan, mengemukakan",
                },
                { jokugo: "問", arti: "bertanya, pertanyaan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 発 dan 問 menjadi 発問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengemukakan atau mengajukan suatu pertanyaan kepada orang lain.”",
            },
            {
              word: "反問",
              reading: "はんもん",
              meaning: "pertanyaan balik",
              unsur: [
                { jokugo: "反", arti: "berbalik, kembali" },
                { jokugo: "問", arti: "bertanya, pertanyaan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 反 dan 問 menjadi 反問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengajukan pertanyaan kembali sebagai tanggapan terhadap pertanyaan yang diterima.”",
            },
          ],
        },
        {
          name: "2. Tanya Jawab",
          jukugos: [
            {
              word: "問答",
              reading: "もんどう",
              meaning: "tanya jawab",
              unsur: [
                { jokugo: "問", arti: "bertanya, pertanyaan" },
                { jokugo: "答", arti: "menjawab, jawaban" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 問 dan 答 menjadi 問答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan saling bertanya dan menjawab mengenai suatu hal.”",
            },
          ],
        },
        {
          name: "3. Soal / Pertanyaan",
          jukugos: [
            {
              word: "問題",
              reading: "もんだい",
              meaning: "masalah",
              unsur: [
                { jokugo: "問", arti: "pertanyaan, masalah" },
                { jokugo: "題", arti: "topik, pokok persoalan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 問 dan 題 menjadi 問題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “suatu hal yang menjadi persoalan atau masalah yang perlu dipikirkan dan diselesaikan.”",
            },
            {
              word: "設問",
              reading: "せつもん",
              meaning: "pertanyaan",
              unsur: [
                { jokugo: "設", arti: "menyusun, menetapkan" },
                { jokugo: "問", arti: "pertanyaan, soal" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 設 dan 問 menjadi 設問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pertanyaan atau soal yang disusun dan diberikan untuk dijawab.”",
            },
            {
              word: "試問",
              reading: "しもん",
              meaning: "ujian lisan",
              unsur: [
                { jokugo: "試", arti: "mencoba, menguji" },
                { jokugo: "問", arti: "bertanya, pertanyaan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 試 dan 問 menjadi 試問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengujian yang dilakukan dengan memberikan pertanyaan kepada seseorang”, sehingga mengandung makna ujian lisan.",
            },
            {
              word: "難問",
              reading: "なんもん",
              meaning: "pertanyaan sulit",
              unsur: [
                { jokugo: "難", arti: "sulit, kesulitan" },
                { jokugo: "問", arti: "pertanyaan, soal" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 難 dan 問 menjadi 難問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pertanyaan atau soal yang sulit untuk dijawab atau diselesaikan.”",
            },
          ],
        },
        {
          name: "4. Pemeriksaan dengan Pertanyaan",
          jukugos: [
            {
              word: "問診",
              reading: "もんしん",
              meaning: "wawancara medis",
              unsur: [
                { jokugo: "問", arti: "bertanya, menanyakan" },
                {
                  jokugo: "診",
                  arti: "memeriksa, mendiagnosis",
                },
              ],
              penjelasan:
                "Hubungan makna antar kanji 問 dan 診 menjadi 問診, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menanyakan kondisi atau gejala seseorang untuk keperluan pemeriksaan dan diagnosis medis.”",
            },
            {
              word: "検問",
              reading: "けんもん",
              meaning: "pemeriksaan",
              unsur: [
                { jokugo: "検", arti: "memeriksa, mengecek" },
                { jokugo: "問", arti: "bertanya, menanyakan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 検 dan 問 menjadi 検問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “melakukan pemeriksaan atau pengecekan terhadap seseorang atau sesuatu, termasuk dengan menanyakan keterangan.”",
            },
          ],
        },
        {
          name: "5. Mempertanyakan / Meminta Pertanggungjawaban",
          jukugos: [
            {
              word: "問責",
              reading: "もんせき",
              meaning: "meminta pertanggungjawaban",
              unsur: [
                {
                  jokugo: "問",
                  arti: "mempertanyakan, meminta penjelasan",
                },
                {
                  jokugo: "責",
                  arti: "tanggung jawab, kewajiban",
                },
              ],
              penjelasan:
                "Hubungan makna antar kanji 問 dan 責 menjadi 問責, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mempertanyakan dan meminta seseorang bertanggung jawab atas suatu tindakan atau keadaan.”",
            },
            {
              word: "不問",
              reading: "ふもん",
              meaning: "tidak dipermasalahkan",
              unsur: [
                { jokugo: "不", arti: "tidak" },
                {
                  jokugo: "問",
                  arti: "mempertanyakan, mempermasalahkan",
                },
              ],
              penjelasan:
                "Hubungan makna antar kanji 不 dan 問 menjadi 不問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tidak mempertanyakan atau tidak mempermasalahkan suatu hal.”",
            },
          ],
        },
        {
          name: "6. Mengunjungi (Makna Perluasan)",
          jukugos: [
            {
              word: "訪問",
              reading: "ほうもん",
              meaning: "kunjungan",
              unsur: [
                {
                  jokugo: "訪",
                  arti: "mengunjungi, mendatangi",
                },
                {
                  jokugo: "問",
                  arti: "mengunjungi, menengok",
                },
              ],
              penjelasan:
                "Hubungan makna antar kanji 訪 dan 問 menjadi 訪問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tindakan mendatangi atau mengunjungi seseorang maupun suatu tempat.”",
            },
          ],
        },
      ],
      quizzes: [
        // a) Unscramble (Model A)
        {
          type: "unscramble",
          question:
            "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
          words: JSON.stringify([
            "あったら",
            "先生",
            "が",
            "問題",
            "に",
            "もし",
            "聞いて下さい",
          ]),
          correctOrder: JSON.stringify([
            "もし",
            "問題",
            "が",
            "あったら",
            "先生",
            "に",
            "聞いて下さい",
          ]),
          correctAnswer: "0",
          explanation:
            "Jawaban: もし質問があったら、先生に聞いて下さい。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
          words: JSON.stringify([
            "質問",
            "先生",
            "が",
            "あるん",
            "に",
            "です",
          ]),
          correctOrder: JSON.stringify([
            "先生",
            "に",
            "質問",
            "が",
            "あるん",
            "です",
          ]),
          correctAnswer: "0",
          explanation: "Jawaban: 先生に質問があるんです。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
          words: JSON.stringify([
            "設問",
            "書いて",
            "が",
            "に",
            "あります",
          ]),
          correctOrder: JSON.stringify([
            "設問",
            "に",
            "書いて",
            "あります",
          ]),
          correctAnswer: "0",
          explanation: "Jawaban: 設問に書いてあります。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
          words: JSON.stringify([
            "反問した ん",
            "先生",
            "です",
            "に",
            "彼は",
          ]),
          correctOrder: JSON.stringify([
            "彼は",
            "先生",
            "に",
            "反問した ん",
            "です",
          ]),
          correctAnswer: "0",
          explanation: "Jawaban: 彼は先生に反問したんです。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
          words: JSON.stringify([
            "予定",
            "を",
            "先生の家",
            "です",
            "来週",
            "訪問する",
          ]),
          correctOrder: JSON.stringify([
            "来週",
            "先生の家",
            "を",
            "訪問する",
            "予定",
            "です",
          ]),
          correctAnswer: "0",
          explanation:
            "Jawaban: 来週、先生の家を訪問する予定です。",
        },
        // c) Multiple choice (Model C)
        {
          type: "multiple",
          question:
            "Jukugo mana  yang berhubungan dengan kegiatan wawancara medis?",
          options: JSON.stringify(["設問", "問診", "質問"]),
          correctAnswer: "1",
          explanation: "Kunci: b (問診)",
        },
        {
          type: "multiple",
          question:
            "Jukugo mana  yang berhubungan dengan makna “pertanyaan yang diajukan untuk memperoleh informasi atau penjelasan”?",
          options: JSON.stringify(["質問", "問答", "問題"]),
          correctAnswer: "0",
          explanation: "Kunci: a (質問)",
        },
        {
          type: "multiple",
          question:
            "Jukugo apa yang berhubungan dengan kegiatan “bertanya kepada diri sendiri”?",
          options: JSON.stringify(["発問", "自問", "設問"]),
          correctAnswer: "1",
          explanation: "Kunci: b (自問)",
        },
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan makna “bertanya kembali kepada orang yang telah mengajukan pertanyaan”?",
          options: JSON.stringify(["自問", "質問", "反問"]),
          correctAnswer: "2",
          explanation: "Kunci: c (反問)",
        },
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan kegiatan “menguji seseorang dengan memberikan pertanyaan”?",
          options: JSON.stringify(["問診", "試問", "難問"]),
          correctAnswer: "1",
          explanation: "Kunci: b (試問)",
        },
        // d) Fill in the blank (Model D)
        {
          type: "fill",
          question:
            "この問題は難しいんですが、先生に（　　　　）してもいいですか。",
          options: JSON.stringify(["訪問", "質問", "検問"]),
          correctAnswer: "1",
          explanation: "Kunci: b (質問)",
        },
        {
          type: "fill",
          question:
            "日本語の勉強で何か（　　　　）があるんですが、先生に聞いてもいいですか。",
          options: JSON.stringify(["問題", "問診", "訪問"]),
          correctAnswer: "0",
          explanation: "Kunci: a (問題)",
        },
        {
          type: "fill",
          question: "病院では最初に（　　　　）を受けます。",
          options: JSON.stringify(["問診", "問答", "設問"]),
          correctAnswer: "0",
          explanation: "Kunci: a (問診)",
        },
        {
          type: "fill",
          question:
            "この（　　　　）に答えたら、次のページを見てください。",
          options: JSON.stringify(["問答", "設問", "訪問"]),
          correctAnswer: "1",
          explanation: "Kunci: b (設問)",
        },
        {
          type: "fill",
          question:
            "明日（　　　　）があるかもしれませんから、よく勉強しておきます。",
          options: JSON.stringify(["問責", "自問", "試問"]),
          correctAnswer: "2",
          explanation: "Kunci: c (試問)",
        },
        // Grouping (Model B)
        {
          type: "grouping",
          question:
            "Kelompokkan jukugo kanji 問 berikut ke dalam cabang semantic graph yang tepat.",
          words: JSON.stringify([
            "質問",
            "自問",
            "発問",
            "反問",
            "問答",
            "問題",
            "設問",
            "試問",
            "難問",
            "問診",
            "検問",
            "問責",
            "不問",
            "訪問",
          ]),
          groups: JSON.stringify([
            {
              name: "1. Bertanya / Mengajukan Pertanyaan",
              correctWords: ["質問", "自問", "発問", "反問"],
            },
            {
              name: "2. Tanya Jawab",
              correctWords: ["問答"],
            },
            {
              name: "3. Soal / Pertanyaan",
              correctWords: [
                "問題",
                "設問",
                "試問",
                "難問",
              ],
            },
            {
              name: "4. Pemeriksaan dengan Pertanyaan",
              correctWords: ["問診", "検問"],
            },
            {
              name: "5. Mempertanyakan / Meminta Pertanggungjawaban",
              correctWords: ["問責", "不問"],
            },
            {
              name: "6. Mengunjungi (Makna Perluasan)",
              correctWords: ["訪問"],
            },
          ]),
          correctAnswer: null,
          explanation: "Kelompokkan 14 kata jukugo kanji 問.",
        },
      ],
    },

    // -------------------------------------------------------------
    // KANJI 題 (ID: 3215)
    // -------------------------------------------------------------
    {
      id: 3215,
      character: "題",
      romaji: "dai",
      meaning:
        "Soal atau hal yang perlu diselesaikan; topik, tema, atau judul yang menunjukkan pokok suatu hal.",
      baseMeaning:
        "soal atau hal yang perlu diselesaikan; topik, tema, atau judul yang menunjukkan pokok suatu hal.",
      categories: [
        {
          name: "1. Soal / Tugas / Masalah",
          jukugos: [
            {
              word: "問題",
              reading: "もんだい",
              meaning: "masalah / soal",
              unsur: [
                { jokugo: "問", arti: "bertanya, menanyakan" },
                { jokugo: "題", arti: "soal, persoalan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 問 dan 題 menjadi 問題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “soal yang menuntut jawaban atau persoalan yang perlu dipikirkan dan diselesaikan.”",
            },
            {
              word: "課題",
              reading: "かだい",
              meaning: "tugas / persoalan",
              unsur: [
                {
                  jokugo: "課",
                  arti: "memberikan atau membebankan tugas",
                },
                { jokugo: "題", arti: "soal, persoalan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 課 dan 題 menjadi 課題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tugas atau persoalan yang diberikan untuk dikerjakan atau diselesaikan.”",
            },
            {
              word: "宿題",
              reading: "しゅくだい",
              meaning: "pekerjaan rumah",
              unsur: [
                {
                  jokugo: "宿",
                  arti: "tempat menginap; bermalam",
                },
                { jokugo: "題", arti: "soal, tugas" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 宿 dan 題 menjadi 宿題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tugas yang dibawa pulang untuk dikerjakan di luar waktu pembelajaran.”",
            },
            {
              word: "出題",
              reading: "しゅつだい",
              meaning: "pemberian soal / membuat soal",
              unsur: [
                {
                  jokugo: "出",
                  arti: "mengeluarkan, memberikan",
                },
                { jokugo: "題", arti: "soal, pertanyaan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 出 dan 題 menjadi 出題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengeluarkan atau memberikan soal untuk dijawab.”",
            },
            {
              word: "例題",
              reading: "れいだい",
              meaning: "contoh soal",
              unsur: [
                { jokugo: "例", arti: "contoh" },
                { jokugo: "題", arti: "soal, pertanyaan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 例 dan 題 menjadi 例題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “soal yang digunakan sebagai contoh.”",
            },
            {
              word: "難題",
              reading: "なんだい",
              meaning: "masalah sulit",
              unsur: [
                { jokugo: "難", arti: "sulit, sukar" },
                { jokugo: "題", arti: "soal, persoalan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 難 dan 題 menjadi 難題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “persoalan atau masalah yang sulit untuk dijawab atau diselesaikan.”",
            },
          ],
        },
        {
          name: "2. Tema / Topik",
          jukugos: [
            {
              word: "主題",
              reading: "しゅだい",
              meaning: "tema utama",
              unsur: [
                { jokugo: "主", arti: "utama, pokok" },
                { jokugo: "題", arti: "tema, topik" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 主 dan 題 menjadi 主題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tema atau pokok utama yang menjadi pusat suatu pembahasan atau karya.”",
            },
            {
              word: "話題",
              reading: "わだい",
              meaning: "topik pembicaraan",
              unsur: [
                {
                  jokugo: "話",
                  arti: "berbicara, pembicaraan",
                },
                { jokugo: "題", arti: "topik, pokok" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 話 dan 題 menjadi 話題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “topik atau pokok yang menjadi bahan pembicaraan.”",
            },
            {
              word: "論題",
              reading: "ろんだい",
              meaning: "topik pembahasan / perdebatan",
              unsur: [
                {
                  jokugo: "論",
                  arti: "membahas, berargumentasi",
                },
                { jokugo: "題", arti: "tema, topik" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 論 dan 題 menjadi 論題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tema atau topik yang menjadi bahan pembahasan, argumentasi, atau perdebatan.”",
            },
            {
              word: "議題",
              reading: "ぎだい",
              meaning: "agenda / topik pembahasan",
              unsur: [
                { jokugo: "議", arti: "membahas, berunding" },
                { jokugo: "題", arti: "topik, persoalan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 議 dan 題 menjadi 議題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “topik atau persoalan yang diajukan untuk dibahas dalam suatu pertemuan atau rapat.”",
            },
          ],
        },
        {
          name: "3. Judul",
          jukugos: [
            {
              word: "題名",
              reading: "だいめい",
              meaning: "judul",
              unsur: [
                { jokugo: "題", arti: "judul" },
                { jokugo: "名", arti: "nama" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 題 dan 名 menjadi 題名, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “nama atau judul yang diberikan pada suatu karya atau tulisan.”",
            },
            {
              word: "表題",
              reading: "ひょうだい",
              meaning: "judul",
              unsur: [
                {
                  jokugo: "表",
                  arti: "permukaan, menampilkan",
                },
                { jokugo: "題", arti: "judul" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 表 dan 題 menjadi 表題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “judul yang ditampilkan sebagai penanda isi suatu karya atau tulisan.”",
            },
            {
              word: "副題",
              reading: "ふくだい",
              meaning: "subjudul",
              unsur: [
                { jokugo: "副", arti: "tambahan, sekunder" },
                { jokugo: "題", arti: "judul" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 副 dan 題 menjadi 副題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “judul tambahan yang melengkapi judul utama.”",
            },
            {
              word: "演題",
              reading: "えんだい",
              meaning: "judul / topik presentasi",
              unsur: [
                {
                  jokugo: "演",
                  arti: "menyampaikan, mempertunjukkan",
                },
                { jokugo: "題", arti: "judul, topik" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 演 dan 題 menjadi 演題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “judul atau topik yang disampaikan dalam ceramah, pidato, atau presentasi.”",
            },
            {
              word: "題字",
              reading: "だいじ",
              meaning: "tulisan judul",
              unsur: [
                { jokugo: "題", arti: "judul" },
                { jokugo: "字", arti: "huruf, tulisan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 題 dan 字 menjadi 題字, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “huruf atau tulisan yang digunakan sebagai judul.”",
            },
          ],
        },
        {
          name: "4. Bahan / Tema Karya",
          jukugos: [
            {
              word: "題材",
              reading: "だいざい",
              meaning: "bahan / tema karya",
              unsur: [
                { jokugo: "題", arti: "tema, pokok" },
                { jokugo: "材", arti: "bahan, material" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 題 dan 材 menjadi 題材, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bahan atau tema yang dijadikan dasar untuk membuat suatu karya.”",
            },
          ],
        },
      ],
      quizzes: [
        // a) Unscramble (Model A)
        {
          type: "unscramble",
          question:
            "Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.",
          words: JSON.stringify([
            "質問",
            "分からないこと",
            "先生",
            "が",
            "に",
            "します",
            "ありますから",
          ]),
          correctOrder: JSON.stringify([
            "分からないこと",
            "が",
            "ありますから",
            "先生",
            "に",
            "質問",
            "します",
          ]),
          correctAnswer: "0",
          explanation:
            "Kunci Jawaban: 分からないことがありますから、先生に質問します。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.",
          words: JSON.stringify([
            "です",
            "調べたい",
            "本の",
            "主題を",
          ]),
          correctOrder: JSON.stringify([
            "本の",
            "主題を",
            "調べたい",
            "です",
          ]),
          correctAnswer: "0",
          explanation:
            "Kunci Jawaban: 本の 主題を 調べたい です。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.",
          words: JSON.stringify([
            "10個",
            "明日の",
            "試験は",
            "あります",
            "問題が",
          ]),
          correctOrder: JSON.stringify([
            "明日の",
            "試験は",
            "問題が",
            "10個",
            "あります",
          ]),
          correctAnswer: "0",
          explanation:
            "Kunci Jawaban: 明日の試験は問題が10個あります",
        },
        {
          type: "unscramble",
          question:
            "Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.",
          words: JSON.stringify([
            "読んで",
            "を",
            "ください",
            "設問",
          ]),
          correctOrder: JSON.stringify([
            "設問",
            "を",
            "読んで",
            "ください",
          ]),
          correctAnswer: "0",
          explanation:
            "Kunci Jawaban: 設問を読んでください",
        },
        // c) Multiple choice (Model C)
        {
          type: "multiple",
          question:
            'Jukugo  yang mana  digunakan untuk menyebut "judul sebuah buku, artikel, atau karya tulis"?',
          options: JSON.stringify(["主題", "題名", "話題"]),
          correctAnswer: "1",
          explanation: "Kunci: b (題名)",
        },
        {
          type: "multiple",
          question:
            'Jukugo mana  yang digunakan untuk menyebut "tugas yang diberikan oleh guru atau dosen"?',
          options: JSON.stringify(["題字", "論題", "課題"]),
          correctAnswer: "2",
          explanation: "Kunci: c (課題)",
        },
        {
          type: "multiple",
          question:
            "Jukugo mana  yang digunakan untuk menyebut “topik atau pokok yang menjadi bahan pembahasan atau penelitian”?",
          options: JSON.stringify(["主題", "論題", "話題"]),
          correctAnswer: "1",
          explanation: "Kunci: b (論題)",
        },
        {
          type: "multiple",
          question:
            'Jukugo mana yang digunakan untuk menyebut "topik pembicaraan dalam percakapan atau diskusi"?',
          options: JSON.stringify(["題名", "主題", "話題"]),
          correctAnswer: "2",
          explanation: "Kunci: c (話題)",
        },
        {
          type: "multiple",
          question:
            'Jukugo mana yang digunakan untuk menyebut "bahan cerita atau materi yang digunakan untuk membuat karya"?',
          options: JSON.stringify(["題材", "課題", "表題"]),
          correctAnswer: "0",
          explanation: "Kunci: a (題材)",
        },
        // d) Fill in the blank (Model D)
        {
          type: "fill",
          question:
            "夏休みの（　　　　）はまだ終わっていません。",
          options: JSON.stringify(["宿題", "題材", "話題"]),
          correctAnswer: "0",
          explanation: "Kunci Jawaban: ① a (宿題)",
        },
        {
          type: "fill",
          question:
            "卒業論文の（　　　　）が決まりました。",
          options: JSON.stringify([
            "題名",
            "出題",
            "問題意識",
          ]),
          correctAnswer: "0",
          explanation: "Kunci Jawaban: ② a (題名)",
        },
        {
          type: "fill",
          question:
            "先生は授業で新しい（　　　　）を出しました。",
          options: JSON.stringify(["話題", "課題", "題字"]),
          correctAnswer: "1",
          explanation: "Kunci Jawaban: ③ b (課題)",
        },
        {
          type: "fill",
          question:
            "最近、そのニュースがみんなの（　　　　）になっています。",
          options: JSON.stringify(["主題", "話題", "題材"]),
          correctAnswer: "1",
          explanation: "Kunci Jawaban: ④ b (話題)",
        },
        {
          type: "fill",
          question:
            "この小説は家族の愛について書かれているんですが、（　　　）は「家族のきずな」です。",
          options: JSON.stringify(["出題", "題字", "主題"]),
          correctAnswer: "2",
          explanation: "Kunci Jawaban: ⑤ c (主題)",
        },
        // Grouping (Model B)
        {
          type: "grouping",
          question:
            "Kelompokkan jukugo kanji 題 berikut ke dalam cabang semantic graph yang tepat.",
          words: JSON.stringify([
            "問題",
            "課題",
            "宿題",
            "出題",
            "例題",
            "難題",
            "主題",
            "話題",
            "論題",
            "議題",
            "題名",
            "表題",
            "副題",
            "演題",
            "題字",
            "題材",
          ]),
          groups: JSON.stringify([
            {
              name: "1. Soal / Tugas / Masalah",
              correctWords: [
                "問題",
                "課題",
                "宿題",
                "出題",
                "例題",
                "難題",
              ],
            },
            {
              name: "2. Tema / Topik",
              correctWords: ["主題", "話題", "論題", "議題"],
            },
            {
              name: "3. Judul",
              correctWords: [
                "題名",
                "表題",
                "副題",
                "演題",
                "題字",
              ],
            },
            {
              name: "4. Bahan / Tema Karya",
              correctWords: ["題材"],
            },
          ]),
          correctAnswer: null,
          explanation: "Kelompokkan 16 kata jukugo kanji 題.",
        },
      ],
    },

    // -------------------------------------------------------------
    // KANJI 答 (ID: 3216)
    // -------------------------------------------------------------
    {
      id: 3216,
      character: "答",
      romaji: "kota(eru)",
      meaning:
        "menjawab, memberikan jawaban, tanggapan, atau balasan",
      baseMeaning:
        "menjawab, memberikan jawaban, tanggapan, atau balasan terhadap pertanyaan maupun sesuatu yang diterima.",
      categories: [
        {
          name: "1. Jawaban / Tanggapan",
          jukugos: [
            {
              word: "回答",
              reading: "かいとう",
              meaning: "jawaban",
              unsur: [
                { jokugo: "回", arti: "mengembalikan" },
                { jokugo: "答", arti: "jawaban" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 回 dan 答, menunjukan bahwa gabungan kedua kanji itu mengandung makna “jawaban yang diberikan terhadap suatu pertanyaan atau permintaan informasi”.",
            },
            {
              word: "応答",
              reading: "おうとう",
              meaning: "tanggapan, respons",
              unsur: [
                { jokugo: "応", arti: "menanggapi" },
                { jokugo: "答", arti: "jawaban" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 応 dan 答, menunjukan bahwa gabungan kedua kanji itu mengandung makna “respons yang diberikan terhadap pertanyaan, panggilan, atau komunikasi”.",
            },
            {
              word: "返答",
              reading: "へんとう",
              meaning: "jawaban, balasan",
              unsur: [
                {
                  jokugo: "返",
                  arti: "mengembalikan, membalas",
                },
                { jokugo: "答", arti: "menjawab, jawaban" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 返 dan 答 menjadi 返答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memberikan jawaban atau balasan kembali kepada orang lain.”",
            },
            {
              word: "問答",
              reading: "もんどう",
              meaning: "tanya jawab",
              unsur: [
                { jokugo: "問", arti: "bertanya, pertanyaan" },
                { jokugo: "答", arti: "menjawab, jawaban" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 問 dan 答 menjadi 問答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan bertanya dan menjawab antar dua pihak.”",
            },
            {
              word: "自答",
              reading: "じとう",
              meaning: "menjawab sendiri",
              unsur: [
                { jokugo: "自", arti: "diri sendiri" },
                { jokugo: "答", arti: "menjawab, jawaban" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 自 dan 答 menjadi 自答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menjawab sendiri terhadap pertanyaan atau persoalan yang dipikirkan.”",
            },
            {
              word: "答弁",
              reading: "とうべん",
              meaning: "jawaban, penjelasan resmi",
              unsur: [
                { jokugo: "答", arti: "menjawab, jawaban" },
                {
                  jokugo: "弁",
                  arti: "menjelaskan, menyampaikan dengan kata-kata",
                },
              ],
              penjelasan:
                "Hubungan makna antar kanji 答 dan 弁 menjadi 答弁, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memberikan jawaban atau penjelasan terhadap pertanyaan, terutama dalam situasi resmi.”",
            },
          ],
        },
        {
          name: "2. Hasil Jawaban",
          jukugos: [
            {
              word: "解答",
              reading: "かいとう",
              meaning: "jawaban, penyelesaian",
              unsur: [
                {
                  jokugo: "解",
                  arti: "memecahkan, menjelaskan",
                },
                { jokugo: "答", arti: "jawaban" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 解 dan 答 menjadi 解答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “jawaban yang diperoleh melalui proses memecahkan atau menyelesaikan suatu persoalan.”",
            },
            {
              word: "答案",
              reading: "とうあん",
              meaning: "jawaban, lembar jawaban",
              unsur: [
                { jokugo: "答", arti: "jawaban" },
                { jokugo: "案", arti: "naskah" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 答 dan 案, menunjukan bahwa gabungan kedua kanji itu mengandung makna “lembar jawaban untuk menuliskan jawaban dalam ujian atau latihan”.",
            },
            {
              word: "正答",
              reading: "せいとう",
              meaning: "jawaban benar",
              unsur: [
                { jokugo: "正", arti: "benar" },
                { jokugo: "答", arti: "jawaban" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 正 dan 答 menjadi 正答, menunjukan bahwa gabungan kedua kanji tersebut membentuk makna “jawaban yang benar atau tepat.”",
            },
            {
              word: "確答",
              reading: "かくとう",
              meaning: "jawaban yang pasti",
              unsur: [
                { jokugo: "確", arti: "pasti, jelas" },
                { jokugo: "答", arti: "jawaban" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 確 dan 答 menjadi 確答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “jawaban yang pasti dan jelas.”",
            },
          ],
        },
        {
          name: "3. Cara Menjawab",
          jukugos: [
            {
              word: "口答",
              reading: "こうとう",
              meaning: "jawaban lisan",
              unsur: [
                { jokugo: "口", arti: "mulut, lisan" },
                { jokugo: "答", arti: "menjawab, jawaban" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 口 dan 答 menjadi 口答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memberikan jawaban secara lisan.”",
            },
            {
              word: "直答",
              reading: "ちょくとう",
              meaning: "jawaban langsung",
              unsur: [
                {
                  jokugo: "直",
                  arti: "langsung, tanpa perantar",
                },
                { jokugo: "答", arti: "menjawab, jawaban" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 直 dan 答 menjadi 直答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memberikan jawaban secara langsung.”",
            },
            {
              word: "筆答",
              reading: "ひっとう",
              meaning: "jawaban tertulis",
              unsur: [
                { jokugo: "筆", arti: "pena, tulisan" },
                { jokugo: "答", arti: "menjawab, jawaban" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 筆 dan 答 menjadi 筆答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memberikan jawaban melalui tulisan.”",
            },
          ],
        },
        {
          name: "4. Balasan",
          jukugos: [
            {
              word: "答辞",
              reading: "とうじ",
              meaning: "ucapan, pidato balasan",
              unsur: [
                { jokugo: "答", arti: "menjawab, membalas" },
                { jokugo: "辞", arti: "kata-kata, ucapan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 答 dan 辞 menjadi 答辞, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “ucapan atau pidato yang disampaikan sebagai balasan terhadap ucapan dari pihak lain.”",
            },
            {
              word: "答礼",
              reading: "とうれい",
              meaning: "membalas penghormatan",
              unsur: [
                { jokugo: "答", arti: "menjawab, membalas" },
                { jokugo: "礼", arti: "salam, penghormatan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 答 dan 礼 menjadi 答礼, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “membalas salam, penghormatan, atau kesopanan yang diterima dari orang lain.”",
            },
          ],
        },
      ],
      quizzes: [
        // a) Unscramble (Model A)
        {
          type: "unscramble",
          question:
            "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
          words: JSON.stringify([
            "回答",
            "を",
            "アンケート",
            "の",
            "出してください",
          ]),
          correctOrder: JSON.stringify([
            "アンケート",
            "の",
            "回答",
            "を",
            "出してください",
          ]),
          correctAnswer: "0",
          explanation:
            "Jawban: アンケートの回答を出して下さい。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
          words: JSON.stringify([
            "解答",
            "見ない",
            "ほうがいいです",
            "を",
          ]),
          correctOrder: JSON.stringify([
            "解答",
            "を",
            "見ない",
            "ほうがいいです",
          ]),
          correctAnswer: "0",
          explanation: "Jawaban: 解答を見ない方がいいです。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
          words: JSON.stringify([
            "返答",
            "まだ",
            "メール",
            "が",
            "来ていません",
            "の",
          ]),
          correctOrder: JSON.stringify([
            "まだ",
            "メール",
            "の",
            "返答",
            "が",
            "来ていません",
          ]),
          correctAnswer: "0",
          explanation:
            "Jawaban：まだメールの返答が来ていません。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
          words: JSON.stringify([
            "口答",
            "試験",
            "です",
            "この",
            "の",
          ]),
          correctOrder: JSON.stringify([
            "この",
            "試験",
            "は",
            "口答",
            "です",
          ]),
          correctAnswer: "0",
          explanation: "Jawaban: この試験は口答です。。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
          words: JSON.stringify([
            "問答",
            "が",
            "ありました",
            "先生",
            "と",
          ]),
          correctOrder: JSON.stringify([
            "先生",
            "と",
            "問答",
            "が",
            "ありました",
          ]),
          correctAnswer: "0",
          explanation: "Jawaban: 先生と問答がありました。",
        },
        // c) Multiple choice (Model C)
        {
          type: "multiple",
          question:
            'Jukugo mana  　yang berhubungan dengan makna "jawaban terhadap suatu pertanyaan atau permintaan informasi" ?',
          options: JSON.stringify(["解答", "回答", "答案"]),
          correctAnswer: "1",
          explanation: "Kunci Jawaban: ① b (回答)",
        },
        {
          type: "multiple",
          question:
            'Jukugo mana yang berhubungan dengan makna "lembar jawaban yang digunakan saat ujian" ?',
          options: JSON.stringify(["正答", "問答", "答案"]),
          correctAnswer: "2",
          explanation: "Kunci Jawaban: ② c (答案)",
        },
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan makna “memberikan jawaban secara langsung tanpa perantar”?",
          options: JSON.stringify(["筆答", "直答", "口答"]),
          correctAnswer: "1",
          explanation: "Kunci Jawaban: ③ b (直答)",
        },
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan makna “memberikan jawaban atau balasan kembali kepada orang lain”?",
          options: JSON.stringify(["応答", "返答", "答弁"]),
          correctAnswer: "1",
          explanation: "Kunci Jawaban: ④ b (返答)",
        },
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan makna “jawaban yang benar atau tepat”?",
          options: JSON.stringify(["正答", "確答", "解答"]),
          correctAnswer: "0",
          explanation: "Kunci Jawaban: ⑤ a (正答)",
        },
        // d) Fill in the blank (Model D)
        {
          type: "fill",
          question: "質問に正しく（　　　　）してください。",
          options: JSON.stringify(["回答", "答案", "自答"]),
          correctAnswer: "0",
          explanation: "Kunci Jawaban: ① a (回答)",
        },
        {
          type: "fill",
          question:
            "試験が終わったら、（　　　　）をしてください。",
          options: JSON.stringify(["答弁", "答案", "応答"]),
          correctAnswer: "1",
          explanation: "Kunci Jawaban: ② b (答案)",
        },
        {
          type: "fill",
          question:
            "メールの（　　　　）が遅くなってしまいました。",
          options: JSON.stringify(["問答", "正答", "返答"]),
          correctAnswer: "2",
          explanation: "Kunci Jawaban: ③ c (返答)",
        },
        {
          type: "fill",
          question:
            "電話をかけましたが、相手から（　　　）がありませんでした。",
          options: JSON.stringify(["解答", "応答", "正答"]),
          correctAnswer: "1",
          explanation: "Kunci Jawaban: ④ b (応答)",
        },
        {
          type: "fill",
          question:
            "答えがわからないときは、すぐ（　　　）を見ないほうがいいです。",
          options: JSON.stringify(["回答", "答礼", "解答"]),
          correctAnswer: "2",
          explanation: "Kunci Jawaban: ⑤ c (解答)",
        },
        // Grouping (Model B)
        {
          type: "grouping",
          question:
            "Kelompokkan jukugo kanji 答 berikut ke dalam cabang semantic graph yang tepat.",
          words: JSON.stringify([
            "回答",
            "応答",
            "返答",
            "問答",
            "自答",
            "答弁",
            "解答",
            "答案",
            "正答",
            "確答",
            "口答",
            "直答",
            "筆答",
            "答辞",
            "答礼",
          ]),
          groups: JSON.stringify([
            {
              name: "1. Jawaban / Tanggapan",
              correctWords: [
                "回答",
                "応答",
                "返答",
                "問答",
                "自答",
                "答弁",
              ],
            },
            {
              name: "2. Hasil Jawaban",
              correctWords: ["解答", "答案", "正答", "確答"],
            },
            {
              name: "3. Cara Menjawab",
              correctWords: ["口答", "直答", "筆答"],
            },
            {
              name: "4. Balasan",
              correctWords: ["答辞", "答礼"],
            },
          ]),
          correctAnswer: null,
          explanation: "Kelompokkan 15 kata jukugo kanji 答.",
        },
      ],
    },
  ];

  // Eksekusi per Kanji
  for (const kd of kanjiDataset) {
    console.log(`\nProcessing Kanji ${kd.character} (id: ${kd.id})...`);

    // 1. Update Kanji
    await prisma.kanji.update({
      where: { id: kd.id },
      data: {
        meaning: kd.meaning,
        romaji: kd.romaji,
        baseMeaning: kd.baseMeaning,
      },
    });

    // 2. Clear existing KanjiGraphEdge for clean dynamic tree
    await prisma.kanjiGraphEdge.deleteMany({
      where: { kanjiId: kd.id },
    });

    // 3. Clear existing Quizzes for this kanji
    await prisma.quiz.deleteMany({
      where: { kanjiId: kd.id },
    });

    // 4. Clear existing SemanticRelations & Jukugos for this kanji
    const existingJukugos = await prisma.jukugo.findMany({
      where: { kanjiId: kd.id },
      select: { id: true },
    });
    const existingJukugoIds = existingJukugos.map((j) => j.id);

    // Remove KategoriKanji
    if (existingJukugoIds.length > 0) {
      await prisma.kategoriKanji.deleteMany({
        where: { jokugoId: { in: existingJukugoIds } },
      });
    }

    // Remove SemanticRelation & SemanticRelationNode
    const existingSRs = await prisma.semanticRelation.findMany({
      where: { kanjiId: kd.id },
      select: { id: true },
    });
    const existingSRIds = existingSRs.map((sr) => sr.id);
    if (existingSRIds.length > 0) {
      await prisma.semanticRelationNode.deleteMany({
        where: { semanticId: { in: existingSRIds } },
      });
      await prisma.semanticRelation.deleteMany({
        where: { id: { in: existingSRIds } },
      });
    }

    // Delete existing Jukugos
    await prisma.jukugo.deleteMany({
      where: { kanjiId: kd.id },
    });

    // 5. Insert Categories, Jukugos, KategoriKanji, SemanticRelation, SemanticRelationNode
    let totalJukugos = 0;
    for (const cat of kd.categories) {
      // Upsert MasterCategory
      const masterCat = await prisma.masterCategory.upsert({
        where: { name: cat.name },
        update: {},
        create: { name: cat.name },
      });

      for (const jk of cat.jukugos) {
        totalJukugos++;
        // Create Jukugo
        const createdJukugo = await prisma.jukugo.create({
          data: {
            kanjiId: kd.id,
            word: jk.word,
            reading: jk.reading,
            meaning: jk.meaning,
          },
        });

        // Link KategoriKanji
        await prisma.kategoriKanji.create({
          data: {
            categoryId: masterCat.id,
            jokugoId: createdJukugo.id,
          },
        });

        // Create SemanticRelation
        const createdSR = await prisma.semanticRelation.create({
          data: {
            kanjiId: kd.id,
            jukugoId: createdJukugo.id,
            penjelasan: jk.penjelasan,
          },
        });

        // Create SemanticRelationNodes
        for (const u of jk.unsur) {
          await prisma.semanticRelationNode.create({
            data: {
              semanticId: createdSR.id,
              jokugo: u.jokugo,
              arti: u.arti,
            },
          });
        }
      }
    }

    // 6. Insert Quizzes
    for (const q of kd.quizzes) {
      await prisma.quiz.create({
        data: {
          kanjiId: kd.id,
          type: q.type,
          question: q.question,
          options: (q as any).options || null,
          correctAnswer: q.correctAnswer,
          words: (q as any).words || null,
          correctOrder: (q as any).correctOrder || null,
          groups: (q as any).groups || null,
          explanation: q.explanation,
        },
      });
    }

    console.log(
      `✓ Kanji ${kd.character}: ${totalJukugos} Jukugo across ${kd.categories.length} categories, ${kd.quizzes.length} quizzes tersimpan rapi.`
    );
  }

  console.log("\n=== SINKRONISASI MODUL 1 SUKSES 100% ===");
}

main()
  .catch((e) => {
    console.error("Error saat sinkronisasi Modul 1:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
