import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=== MEMULAI SINKRONISASI KETAT MODUL 2 (研・究・調・査・集) ===");

  // 1. Registrasi 11 Kanji Penyusun Tunggal (moduleId: null)
  const constituentKanjis = [
    {
      character: "精",
      romaji: "sei, shou",
      meaning: "teliti, cermat, murni",
      bushuu: "米",
      onyomi: "セイ, ショウ",
      kunyomi: "-",
    },
    {
      character: "鑽",
      romaji: "san",
      meaning: "menggali, menembus, mengasah",
      bushuu: "金",
      onyomi: "サン",
      kunyomi: "き.る",
    },
    {
      character: "点",
      romaji: "ten",
      meaning: "titik, bagian, tanda",
      bushuu: "黒",
      onyomi: "テン",
      kunyomi: "つ.く, つ.ける",
    },
    {
      character: "簡",
      romaji: "kan",
      meaning: "sederhana, ringkas",
      bushuu: "竹",
      onyomi: "カン",
      kunyomi: "-",
    },
    {
      character: "細",
      romaji: "sai",
      meaning: "halus, rinci, sempit",
      bushuu: "糸",
      onyomi: "サイ",
      kunyomi: "ほそ.い, こま.かい",
    },
    {
      character: "密",
      romaji: "mitsu",
      meaning: "rapat, padat, rahasia",
      bushuu: "宀",
      onyomi: "ミツ",
      kunyomi: "ひそ.か",
    },
    {
      character: "募",
      romaji: "bo",
      meaning: "mengajak, merekrut, mengumpulkan",
      bushuu: "力",
      onyomi: "ボ",
      kunyomi: "つの.る",
    },
    {
      character: "招",
      romaji: "shou",
      meaning: "memanggil, mengundang",
      bushuu: "手",
      onyomi: "ショウ",
      kunyomi: "まね.く",
    },
    {
      character: "積",
      romaji: "seki",
      meaning: "menumpuk, mengakumulasi",
      bushuu: "禾",
      onyomi: "セキ",
      kunyomi: "つ.む, つ.もる",
    },
    {
      character: "全",
      romaji: "zen",
      meaning: "seluruh, lengkap, semua",
      bushuu: "入",
      onyomi: "ゼン",
      kunyomi: "まった.く, すべ.て",
    },
    {
      character: "選",
      romaji: "sen",
      meaning: "memilih, pilihan",
      bushuu: "辵",
      onyomi: "セン",
      kunyomi: "えら.ぶ",
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
  console.log("✓ 11 Kanji penyusun tunggal terverifikasi di database.");

  // 2. Data lengkap per Kanji di Modul 2
  const kanjiDataset = [
    // -------------------------------------------------------------
    // KANJI 研 (ID: 3218)
    // -------------------------------------------------------------
    {
      id: 3218,
      character: "研",
      romaji: "ken",
      meaning: "Mengasah / Memperdalam",
      baseMeaning:
        "mengasah atau memperdalam suatu hal.",
      categories: [
        {
          name: "1. Meneliti / Mendalami",
          jukugos: [
            {
              word: "研究",
              reading: "けんきゅう",
              meaning: "penelitian",
              unsur: [
                { jokugo: "研", arti: "mengasah, memperdalam" },
                { jokugo: "究", arti: "menyelidiki, mendalami" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 研 dan 究 menjadi 研究, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan menyelidiki dan mendalami suatu hal secara sungguh-sungguh.”",
            },
            {
              word: "研学",
              reading: "けんがく",
              meaning: "belajar",
              unsur: [
                { jokugo: "研", arti: "mengasah, memperdalam" },
                { jokugo: "学", arti: "belajar, ilmu" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 研 dan 学 menjadi 研学, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “belajar atau mendalami ilmu pengetahuan.”",
            },
            {
              word: "研精",
              reading: "けんせい",
              meaning: "meneliti",
              unsur: [
                { jokugo: "研", arti: "mengasah, memperdalam" },
                { jokugo: "精", arti: "teliti, cermat" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 研 dan 精 menjadi 研精, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “meneliti atau mendalami sesuatu dengan cermat.”",
            },
          ],
        },
        {
          name: "2. Belajar / Mengasah Kemampuan",
          jukugos: [
            {
              word: "研修",
              reading: "けんしゅう",
              meaning: "pelatihan",
              unsur: [
                { jokugo: "研", arti: "mengasah, memperdalam" },
                { jokugo: "修", arti: "mempelajari, memperbaiki" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 研 dan 修 menjadi 研修, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan belajar atau berlatih untuk meningkatkan pengetahuan dan kemampuan.”",
            },
            {
              word: "研習",
              reading: "けんしゅう",
              meaning: "mempelajari",
              unsur: [
                { jokugo: "研", arti: "mengasah, memperdalam" },
                { jokugo: "習", arti: "belajar, berlatih" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 研 dan 習 menjadi 研習, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mempelajari atau melatih sesuatu untuk memperdalam kemampuan.”",
            },
            {
              word: "研鑽",
              reading: "けんさん",
              meaning: "mengasah kemampuan",
              unsur: [
                { jokugo: "研", arti: "mengasah, memperdalam" },
                { jokugo: "鑽", arti: "menggali, mendalami" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 研 dan 鑽 menjadi 研鑽, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “terus belajar dan mendalami sesuatu untuk mengasah pengetahuan atau kemampuan.”",
            },
          ],
        },
        {
          name: "3. Mengasah / Menghaluskan",
          jukugos: [
            {
              word: "研磨",
              reading: "けんま",
              meaning: "memoles",
              unsur: [
                { jokugo: "研", arti: "mengasah, memoles" },
                { jokugo: "磨", arti: "menggosok, memoles" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 研 dan 磨 menjadi 研磨, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengasah atau memoles suatu benda agar lebih halus.”",
            },
            {
              word: "研削",
              reading: "けんさく",
              meaning: "menggerinda",
              unsur: [
                { jokugo: "研", arti: "mengasah" },
                { jokugo: "削", arti: "mengikis, mengurangi" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 研 dan 削 menjadi 研削, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengikis atau mengasah permukaan suatu benda dengan proses penggerindaan.”",
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
            "研鑽を",
            "積もうと",
            "技術の",
            "思っています",
          ]),
          correctOrder: JSON.stringify([
            "技術の",
            "研鑽を",
            "積もうと",
            "思っています",
          ]),
          correctAnswer: "0",
          explanation: "Jawaban: 技術の 研鑽を 積もうと 思っています。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
          words: JSON.stringify([
            "研習した",
            "ほうが",
            "です",
            "しっかり",
            "いい",
          ]),
          correctOrder: JSON.stringify([
            "しっかり",
            "研習した",
            "ほうが",
            "いい",
            "です",
          ]),
          correctAnswer: "0",
          explanation: "Jawaban: しっかり 研習した ほうが いいです。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
          words: JSON.stringify([
            "学問を",
            "研精しながら",
            "書きます",
            "論文を",
          ]),
          correctOrder: JSON.stringify([
            "学問を",
            "研精しながら",
            "論文を",
            "書きます",
          ]),
          correctAnswer: "0",
          explanation: "Jawaban: 学問を 研精しながら 論文を 書きます。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
          words: JSON.stringify([
            "資料",
            "研修",
            "準備して",
            "をおきます",
            "の",
            "前に",
          ]),
          correctOrder: JSON.stringify([
            "研修",
            "の",
            "前に",
            "資料",
            "準備して",
            "をおきます",
          ]),
          correctAnswer: "0",
          explanation: "Jawaban: 研修の前に、資料を準備しておきます。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
          words: JSON.stringify([
            "準備してあります",
            "研削の",
            "事前に",
            "工具が",
          ]),
          correctOrder: JSON.stringify([
            "事前に",
            "研削の",
            "工具が",
            "準備してあります",
          ]),
          correctAnswer: "0",
          explanation: "Jawaban：事前に 研削の 工具が 準備してあります。",
        },
        // c) Multiple choice (Model C)
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan “kegiatan penelitian untuk memperoleh pengetahuan baru?",
          options: JSON.stringify(["研究", "研修", "研磨"]),
          correctAnswer: "0",
          explanation: "Kunci: a (研究)",
        },
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan makna “mengasah atau memoles suatu benda agar permukaannya menjadi lebih halus”?",
          options: JSON.stringify(["研精", "研習", "研磨"]),
          correctAnswer: "2",
          explanation: "Kunci: c (研磨)",
        },
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan makna “kegiatan belajar atau berlatih untuk meningkatkan pengetahuan dan kemampuan”?",
          options: JSON.stringify(["研精", "研削", "研修"]),
          correctAnswer: "2",
          explanation: "Kunci: c (研修)",
        },
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan makna “terus belajar dan mendalami sesuatu untuk mengasah pengetahuan atau kemampuan”?",
          options: JSON.stringify(["研学", "研鑽", "研究"]),
          correctAnswer: "1",
          explanation: "Kunci: b (研鑽)",
        },
        // d) Fill in the blank (Model D)
        {
          type: "fill",
          question:
            "大学で日本語教育について（　　　）するつもりです。",
          options: JSON.stringify(["研磨", "研究", "研削"]),
          correctAnswer: "1",
          explanation: "Kunci: b (研究)",
        },
        {
          type: "fill",
          question:
            "来月、会社の新人（　　　）に参加するんです。",
          options: JSON.stringify(["研修", "研精", "研磨"]),
          correctAnswer: "0",
          explanation: "Kunci: a (研修)",
        },
        {
          type: "fill",
          question:
            "日本語の能力を高めたいんですが、もっと（　　　）したほうがいいです。",
          options: JSON.stringify(["研削", "研鑽", "研究"]),
          correctAnswer: "1",
          explanation: "Kunci: b (研鑽)",
        },
        {
          type: "fill",
          question:
            "この金属の表面をきれいにするために、（　　　）します。",
          options: JSON.stringify(["研習", "研究", "研磨"]),
          correctAnswer: "2",
          explanation: "Kunci: c (研磨)",
        },
        {
          type: "fill",
          question:
            "工場では、このを使って物を（　　　）する予定です。",
          options: JSON.stringify(["研削", "研修", "研学"]),
          correctAnswer: "0",
          explanation: "Kunci: a (研削)",
        },
        // Grouping (Model B)
        {
          type: "grouping",
          question:
            "Kelompokkan jukugo kanji 研 berikut ke dalam cabang semantic graph yang tepat.",
          words: JSON.stringify([
            "研究",
            "研学",
            "研精",
            "研修",
            "研習",
            "研鑽",
            "研磨",
            "研削",
          ]),
          groups: JSON.stringify([
            {
              name: "1. Meneliti / Mendalami",
              correctWords: ["研究", "研学", "研精"],
            },
            {
              name: "2. Belajar / Mengasah Kemampuan",
              correctWords: ["研修", "研習", "研鑽"],
            },
            {
              name: "3. Mengasah / Menghaluskan",
              correctWords: ["研磨", "研削"],
            },
          ]),
          correctAnswer: null,
          explanation: "Kelompokkan 8 kata jukugo kanji 研.",
        },
      ],
    },

    // -------------------------------------------------------------
    // KANJI 究 (ID: 3219)
    // -------------------------------------------------------------
    {
      id: 3219,
      character: "究",
      romaji: "kyuu",
      meaning: "Mendalami / Menyelidiki Sampai Tuntas",
      baseMeaning:
        "mendalami atau menyelidiki sesuatu sampai tuntas.",
      categories: [
        {
          name: "1. Meneliti / Menyelidiki",
          jukugos: [
            {
              word: "研究",
              reading: "けんきゅう",
              meaning: "penelitian",
              unsur: [
                { jokugo: "研", arti: "mengasah, memperdalam" },
                { jokugo: "究", arti: "menyelidiki, mendalami" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 研 dan 究 menjadi 研究, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan menyelidiki dan mendalami suatu hal secara sungguh-sungguh.”",
            },
            {
              word: "探究",
              reading: "たんきゅう",
              meaning: "penyelidikan",
              unsur: [
                { jokugo: "探", arti: "mencari, menyelidiki" },
                { jokugo: "究", arti: "mendalami, menelusuri sampai tuntas" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 探 dan 究 menjadi 探究, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencari dan menyelidiki suatu hal secara mendalam sampai memahami hakikatnya.”",
            },
            {
              word: "追究",
              reading: "ついきゅう",
              meaning: "penyelidikan / penelusuran",
              unsur: [
                { jokugo: "追", arti: "mengejar, menelusuri" },
                { jokugo: "究", arti: "mendalami, menyelidiki sampai tuntas" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 追 dan 究 menjadi 追究, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menelusuri atau menyelidiki suatu persoalan secara terus-menerus sampai memperoleh kejelasan.”",
            },
          ],
        },
        {
          name: "2. Mengkaji / Membahas",
          jukugos: [
            {
              word: "考究",
              reading: "こうきゅう",
              meaning: "mengkaji",
              unsur: [
                { jokugo: "考", arti: "berpikir, mempertimbangkan" },
                { jokugo: "究", arti: "mendalami, menyelidiki" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 考 dan 究 menjadi 考究, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memikirkan dan mengkaji suatu hal secara mendalam.”",
            },
            {
              word: "討究",
              reading: "とうきゅう",
              meaning: "mengkaji",
              unsur: [
                { jokugo: "討", arti: "membahas, menelaah" },
                { jokugo: "究", arti: "mendalami, menyelidiki" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 討 dan 究 menjadi 討究, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “membahas dan menelaah suatu hal secara mendalam untuk memperoleh pemahaman.”",
            },
            {
              word: "論究",
              reading: "ろんきゅう",
              meaning: "membahas secara mendalam",
              unsur: [
                { jokugo: "論", arti: "membahas, berargumentasi" },
                { jokugo: "究", arti: "mendalami, menyelidiki" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 論 dan 究 menjadi 論究, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “membahas atau menguraikan suatu persoalan secara mendalam.”",
            },
            {
              word: "講究",
              reading: "こうきゅう",
              meaning: "mengkaji secara mendalam",
              unsur: [
                { jokugo: "講", arti: "membahas, mempelajari" },
                { jokugo: "究", arti: "mendalami, menyelidiki" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 講 dan 究 menjadi 講究, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mempelajari dan mengkaji suatu hal secara mendalam untuk memahami makna atau hakikatnya.”",
            },
          ],
        },
        {
          name: "3. Mendalami / Mengungkap",
          jukugos: [
            {
              word: "究理",
              reading: "きゅうり",
              meaning: "mendalami prinsip",
              unsur: [
                { jokugo: "究", arti: "mendalami, menelusuri sampai tuntas" },
                { jokugo: "理", arti: "prinsip, alasan, hakikat" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 究 dan 理 menjadi 究理, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mendalami prinsip, alasan, atau hakikat suatu hal sampai tuntas.”",
            },
            {
              word: "究明",
              reading: "きゅうめい",
              meaning: "mengungkap / menjelaskan",
              unsur: [
                { jokugo: "究", arti: "mendalami, menyelidiki sampai tuntas" },
                { jokugo: "明", arti: "jelas, menerangkan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 究 dan 明 menjadi 究明, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menyelidiki suatu hal secara mendalam sampai kebenaran atau penyebabnya menjadi jelas.”",
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
            "究理を",
            "自然の",
            "思っています",
            "勉強しようと",
            "もっと",
          ]),
          correctOrder: JSON.stringify([
            "自然の",
            "究理を",
            "もっと",
            "勉強しようと",
            "思っています",
          ]),
          correctAnswer: "0",
          explanation:
            "Jawaban：自然の 究理を もっと 勉強しようと 思っています。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah  kata-kata berikut berikut menjadi kalimat yang tepat.",
          words: JSON.stringify([
            "しっかり",
            "考究した",
            "ほうが",
            "いいです",
            "計画を",
          ]),
          correctOrder: JSON.stringify([
            "計画を",
            "しっかり",
            "考究した",
            "ほうが",
            "いいです",
          ]),
          correctAnswer: "0",
          explanation:
            "Jawaban：計画を しっかり 考究した ほうが いいです。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah  kata-kata berikut berikut menjadi kalimat yang tepat.",
          words: JSON.stringify([
            "真実を",
            "追究しながら",
            "書きます",
            "論文を",
          ]),
          correctOrder: JSON.stringify([
            "真実を",
            "追究しながら",
            "論文を",
            "書きます",
          ]),
          correctAnswer: "0",
          explanation:
            "Jawaban: 真実を 追究しながら 論文を 書きます。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah  kata-kata berikut berikut menjadi kalimat yang tepat.",
          words: JSON.stringify([
            "論究するでしょう",
            "深く",
            "問題を",
            "専門家が",
          ]),
          correctOrder: JSON.stringify([
            "専門家が",
            "問題を",
            "深く",
            "論究するでしょう",
          ]),
          correctAnswer: "0",
          explanation:
            "Jawaban： 専門家が 問題を 深く 論究するでしょう。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah  kata-kata berikut berikut menjadi kalimat yang tepat.",
          words: JSON.stringify([
            "考究しようと",
            "専門的な",
            "思っています",
            "問題を",
          ]),
          correctOrder: JSON.stringify([
            "専門的な",
            "問題を",
            "考究しようと",
            "思っています",
          ]),
          correctAnswer: "0",
          explanation:
            "Jawaban：専門的な 問題を 考究しようと 思っています。",
        },
        // c) Multiple choice (Model C)
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan makna “mencari dan menyelidiki suatu hal secara mendalam sampai memahami hakikatnya”?",
          options: JSON.stringify(["究明", "探究", "論究"]),
          correctAnswer: "1",
          explanation: "Kunci: b (探究)",
        },
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan makna “menelusuri atau menyelidiki suatu persoalan secara terus-menerus sampai memperoleh kejelasan”?",
          options: JSON.stringify(["考究", "究理", "追究"]),
          correctAnswer: "2",
          explanation: "Kunci: c (追究)",
        },
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan makna “membahas atau menguraikan suatu persoalan secara mendalam”?",
          options: JSON.stringify(["論究", "探究", "究明"]),
          correctAnswer: "0",
          explanation: "Kunci: a (論究)",
        },
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan makna “mendalami prinsip, alasan, atau hakikat suatu hal sampai tuntas”?",
          options: JSON.stringify(["討究", "究理", "研究"]),
          correctAnswer: "1",
          explanation: "Kunci: b (究理)",
        },
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan makna “menyelidiki suatu hal secara mendalam sampai kebenaran atau penyebabnya menjadi jelas”?",
          options: JSON.stringify(["講究", "追究", "究明"]),
          correctAnswer: "2",
          explanation: "Kunci: c (究明)",
        },
        // d) Fill in the blank (Model D)
        {
          type: "fill",
          question:
            "卒業論文のために、日本の若者の言葉について（　　　）するつもりです。",
          options: JSON.stringify(["究明", "研究", "究理"]),
          correctAnswer: "1",
          explanation: "Kunci: b (研究)",
        },
        {
          type: "fill",
          question:
            "この問題についてもっと深く知りたいんですが、（　　　）したほうがいいです。",
          options: JSON.stringify(["探究", "究明", "論究"]),
          correctAnswer: "0",
          explanation: "Kunci: a (探究)",
        },
        {
          type: "fill",
          question:
            "事故の原因はまだわかりません。これから詳しく（　　　）するでしょう。",
          options: JSON.stringify(["考究", "究理", "究明"]),
          correctAnswer: "2",
          explanation: "Kunci: c (究明)",
        },
        {
          type: "fill",
          question:
            "この問題について専門家と深く（　　　）する予定です。",
          options: JSON.stringify(["探究", "討究", "究明"]),
          correctAnswer: "1",
          explanation: "Kunci: b (討究)",
        },
        {
          type: "fill",
          question:
            "この理論の意味や本質を理解するために、詳しく（　　　）するつもりです。",
          options: JSON.stringify(["追究", "考究", "究明"]),
          correctAnswer: "1",
          explanation: "Kunci: b (考究)",
        },
        // Grouping (Model B)
        {
          type: "grouping",
          question:
            "Kelompokkan jukugo kanji 究 berikut ke dalam cabang semantic graph yang tepat.",
          words: JSON.stringify([
            "研究",
            "探究",
            "追究",
            "考究",
            "討究",
            "論究",
            "講究",
            "究理",
            "究明",
          ]),
          groups: JSON.stringify([
            {
              name: "1. Meneliti / Menyelidiki",
              correctWords: ["研究", "探究", "追究"],
            },
            {
              name: "2. Mengkaji / Membahas",
              correctWords: ["考究", "討究", "論究", "講究"],
            },
            {
              name: "3. Mendalami / Mengungkap",
              correctWords: ["究理", "究明"],
            },
          ]),
          correctAnswer: null,
          explanation: "Kelompokkan 9 kata jukugo kanji 究.",
        },
      ],
    },

    // -------------------------------------------------------------
    // KANJI 調 (ID: 3221)
    // -------------------------------------------------------------
    {
      id: 3221,
      character: "調",
      romaji: "chou",
      meaning: "Mengatur, Menyesuaikan, Memeriksa, Menyelidiki",
      baseMeaning:
        "mengatur, menyesuaikan, memeriksa, atau menyelidiki sehingga sesuatu menjadi sesuai atau seimbang.",
      categories: [
        {
          name: "1. Kondisi dan Keadaan",
          jukugos: [
            {
              word: "体調",
              reading: "たいちょう",
              meaning: "kondisi tubuh",
              unsur: [
                { jokugo: "体", arti: "tubuh" },
                { jokugo: "調", arti: "kondisi, penyesuaian" },
              ],
              penjelasan:
                'Hubungan makna antar kanji 体 dan 調 menjadi 体調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna "keadaan atau kondisi kesehatan tubuh seseorang."',
            },
            {
              word: "好調",
              reading: "こうちょう",
              meaning: "kondisi baik",
              unsur: [
                { jokugo: "好", arti: "baik" },
                { jokugo: "調", arti: "keadaan" },
              ],
              penjelasan:
                'Hubungan makna antar kanji 好 dan 調 menjadi 好調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna "keadaan yang baik atau performa yang sedang meningkat."',
            },
            {
              word: "不調",
              reading: "ふちょう",
              meaning: "kondisi buruk",
              unsur: [
                { jokugo: "不", arti: "tidak" },
                { jokugo: "調", arti: "keadaan" },
              ],
              penjelasan:
                'Hubungan makna antar kanji 不 dan 調 menjadi 不調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna "kondisi yang tidak baik atau mengalami gangguan."',
            },
            {
              word: "快調",
              reading: "かいちょう",
              meaning: "sangat baik, segar",
              unsur: [
                { jokugo: "快", arti: "nyaman, menyenangkan" },
                { jokugo: "調", arti: "keadaan" },
              ],
              penjelasan:
                'Hubungan makna antar kanji 快 dan 調 menjadi 快調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna "keadaan yang sangat baik, sehat, atau suatu aktivitas yang berjalan dengan lancar."',
            },
            {
              word: "順調",
              reading: "じゅんちょう",
              meaning: "berjalan lancar",
              unsur: [
                { jokugo: "順", arti: "sesuai urutan" },
                { jokugo: "調", arti: "keadaan" },
              ],
              penjelasan:
                'Hubungan makna antar kanji 順 dan 調 menjadi 順調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna "suatu kegiatan atau proses yang berlangsung sesuai rencana tanpa mengalami hambatan."',
            },
            {
              word: "高調",
              reading: "こうちょう",
              meaning: "nada/keadaan tinggi, meningkat",
              unsur: [
                { jokugo: "高", arti: "tinggi" },
                { jokugo: "調", arti: "keadaan" },
              ],
              penjelasan:
                'Hubungan makna antar kanji 高 dan 調 menjadi 高調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna "keadaan yang meningkat atau berada pada tingkat yang tinggi."',
            },
            {
              word: "低調",
              reading: "ていちょう",
              meaning: "keadaan rendah, lesu",
              unsur: [
                { jokugo: "低", arti: "rendah" },
                { jokugo: "調", arti: "keadaan" },
              ],
              penjelasan:
                'Hubungan makna antar kanji 低 dan 調 menjadi 低調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna "keadaan yang menurun, kurang aktif, atau tidak berkembang."',
            },
          ],
        },
        {
          name: "2. Cara Berbicara dan Bunyi",
          jukugos: [
            {
              word: "口調",
              reading: "くちょう",
              meaning: "cara berbicara",
              unsur: [
                { jokugo: "口", arti: "mulut" },
                { jokugo: "調", arti: "nada, cara" },
              ],
              penjelasan:
                'Hubungan makna antar kanji 口 dan 調 menjadi 口調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna "cara seseorang berbicara atau menyampaikan sesuatu melalui nada dan gaya berbicara."',
            },
            {
              word: "語調",
              reading: "ごちょう",
              meaning: "gaya bahasa",
              unsur: [
                { jokugo: "語", arti: "bahasa" },
                { jokugo: "調", arti: "nada" },
              ],
              penjelasan:
                'Hubungan makna antar kanji 語 dan 調 menjadi 語調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna "gaya bahasa atau nada yang digunakan seseorang dalam berkomunikasi."',
            },
            {
              word: "声調",
              reading: "せいちょう",
              meaning: "intonasi",
              unsur: [
                { jokugo: "声", arti: "suara" },
                { jokugo: "調", arti: "nada" },
              ],
              penjelasan:
                'Hubungan makna antar kanji 声 dan 調 menjadi 声調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna "tinggi rendah atau irama suara ketika mengucapkan suatu kata atau kalimat."',
            },
            {
              word: "音調",
              reading: "おんちょう",
              meaning: "nada suara",
              unsur: [
                { jokugo: "音", arti: "bunyi" },
                { jokugo: "調", arti: "irama" },
              ],
              penjelasan:
                'Hubungan makna antar kanji 音 dan 調 menjadi 音調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna "keselarasan tinggi rendah nada dalam bunyi atau musik."',
            },
          ],
        },
        {
          name: "3. Pemeriksaan dan Administrasi",
          jukugos: [
            {
              word: "調査",
              reading: "ちょうさ",
              meaning: "survei, penelitian",
              unsur: [
                { jokugo: "調", arti: "menyelidiki" },
                { jokugo: "査", arti: "memeriksa" },
              ],
              penjelasan:
                'Hubungan makna antar kanji 調 dan 査 menjadi 調査, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna "kegiatan memeriksa atau menyelidiki suatu objek secara sistematis untuk memperoleh data atau informasi."',
            },
            {
              word: "調書",
              reading: "ちょうしょ",
              meaning: "dokumen pemeriksaan",
              unsur: [
                { jokugo: "調", arti: "menyelidiki" },
                { jokugo: "書", arti: "dokumen" },
              ],
              penjelasan:
                'Hubungan makna antar kanji 調 dan 書 menjadi 調書, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna "dokumen yang berisi hasil pemeriksaan, penyelidikan, atau pencatatan suatu peristiwa."',
            },
            {
              word: "調印",
              reading: "ちょういん",
              meaning: "penandatanganan perjanjian",
              unsur: [
                { jokugo: "調", arti: "menyepakati" },
                { jokugo: "印", arti: "tanda tangan / cap" },
              ],
              penjelasan:
                'Hubungan makna antar kanji 調 dan 印 menjadi 調印, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna "kegiatan menandatangani suatu dokumen setelah isi perjanjian disepakati oleh para pihak."',
            },
            {
              word: "調達",
              reading: "ちょうたつ",
              meaning: "pengadaan, memperoleh barang yang diperlukan",
              unsur: [
                { jokugo: "調", arti: "mengatur" },
                { jokugo: "達", arti: "memperoleh" },
              ],
              penjelasan:
                'Hubungan makna antar kanji 調 dan 達 menjadi 調達, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna "kegiatan mengatur dan memperoleh barang atau perlengkapan yang diperlukan."',
            },
          ],
        },
        {
          name: "4. Pengaturan dan Penyesuaian",
          jukugos: [
            {
              word: "調理",
              reading: "ちょうり",
              meaning: "memasak",
              unsur: [
                { jokugo: "調", arti: "mengolah" },
                { jokugo: "理", arti: "mengatur" },
              ],
              penjelasan:
                'Hubungan makna antar kanji 調 dan 理 menjadi 調理, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna "mengolah dan mengatur bahan makanan hingga siap dikonsumsi."',
            },
            {
              word: "調合",
              reading: "ちょうごう",
              meaning: "mencampur",
              unsur: [
                { jokugo: "調", arti: "menyesuaikan" },
                { jokugo: "合", arti: "menggabungkan" },
              ],
              penjelasan:
                'Hubungan makna antar kanji 調 dan 合 menjadi 調合, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna "mencampurkan beberapa bahan dengan komposisi yang sesuai sehingga menghasilkan campuran yang diinginkan."',
            },
            {
              word: "調製",
              reading: "ちょうせい",
              meaning: "menyiapkan, membuat",
              unsur: [
                { jokugo: "調", arti: "menyiapkan" },
                { jokugo: "製", arti: "membuat" },
              ],
              penjelasan:
                'Hubungan makna antar kanji 調 dan 製 menjadi 調製, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna "menyiapkan atau membuat sesuatu sesuai kebutuhan atau tujuan tertentu."',
            },
            {
              word: "調薬",
              reading: "ちょうやく",
              meaning: "meracik obat",
              unsur: [
                { jokugo: "調", arti: "menyiapkan" },
                { jokugo: "薬", arti: "obat" },
              ],
              penjelasan:
                'Hubungan makna antar kanji 調 dan 薬 menjadi 調薬, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna "menyiapkan atau meracik obat sesuai dengan resep atau kebutuhan pasien."',
            },
            {
              word: "調律",
              reading: "ちょうりつ",
              meaning: "menyetel nada alat musik",
              unsur: [
                { jokugo: "調", arti: "menyesuaikan, mengatur" },
                { jokugo: "律", arti: "nada, aturan" },
              ],
              penjelasan:
                'Hubungan makna antar kanji 調 dan 律 menjadi 調律, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna "menyetel atau menyesuaikan nada alat musik agar selaras dan tepat."',
            },
            {
              word: "調味料",
              reading: "ちょうみりょう",
              meaning: "bumbu",
              unsur: [
                { jokugo: "調味", arti: "memberi rasa" },
                { jokugo: "料", arti: "bahan" },
              ],
              penjelasan:
                'Hubungan makna antar 調味 dan 料 menjadi 調味料, menunjukkan bahwa gabungan kedua unsur tersebut membentuk sebuah makna "bahan yang digunakan untuk menyesuaikan atau memperkaya cita rasa makanan."',
            },
          ],
        },
        {
          name: "5. Penyelidikan dan Perubahan Keadaan",
          jukugos: [
            {
              word: "強調",
              reading: "きょうちょう",
              meaning: "penekanan, menegaskan",
              unsur: [
                { jokugo: "強", arti: "kuat" },
                { jokugo: "調", arti: "menonjolkan" },
              ],
              penjelasan:
                'Hubungan makna antar kanji 強 dan 調 menjadi 強調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna "memberikan penekanan yang kuat pada bagian yang dianggap penting."',
            },
            {
              word: "歩調",
              reading: "ほちょう",
              meaning: "langkah yang selaras, irama langkah",
              unsur: [
                { jokugo: "歩", arti: "berjalan" },
                { jokugo: "調", arti: "irama" },
              ],
              penjelasan:
                'Hubungan makna antar kanji 歩 dan 調 menjadi 歩調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna "menyelaraskan langkah atau gerakan agar berjalan bersama secara teratur."',
            },
            {
              word: "変調",
              reading: "へんちょう",
              meaning: "perubahan nada/kondisi, tidak normal",
              unsur: [
                { jokugo: "変", arti: "berubah" },
                { jokugo: "調", arti: "keadaan" },
              ],
              penjelasan:
                'Hubungan makna antar kanji 変 dan 調 menjadi 変調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna "perubahan kondisi dari keadaan yang normal menjadi keadaan yang berbeda."',
            },
            {
              word: "移調",
              reading: "いちょう",
              meaning: "mengubah nada (transportasi nada)",
              unsur: [
                { jokugo: "移", arti: "memindahkan" },
                { jokugo: "調", arti: "nada" },
              ],
              penjelasan:
                'Hubungan makna antar kanji 移 dan 調 menjadi 移調, menunjukkan bahwa gabungan kedua kanji tersebut membentuk sebuah makna "memindahkan tinggi rendah nada suatu lagu tanpa mengubah susunan melodinya."',
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
            "聞きながら",
            "調理します",
            "を",
            "音楽",
            "を",
          ]),
          correctOrder: JSON.stringify([
            "音楽",
            "を",
            "聞きながら",
            "調理します",
          ]),
          correctAnswer: "0",
          explanation: "Jawaban: 音楽を聞きながら調理します。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.",
          words: JSON.stringify([
            "行きます",
            "悪い",
            "病院",
            "体調",
            "とき",
            "が",
            "へ",
          ]),
          correctOrder: JSON.stringify([
            "体調",
            "が",
            "悪い",
            "とき",
            "病院",
            "へ",
            "行きます",
          ]),
          correctAnswer: "0",
          explanation: "Jawaban: 体調が悪いとき、病院へ行きます。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.",
          words: JSON.stringify([
            "に",
            "が",
            "おいてあります",
            "調味料",
          ]),
          correctOrder: JSON.stringify([
            "に",
            "調味料",
            "が",
            "おいてあります",
          ]),
          correctAnswer: "0",
          explanation: "Jawaban: に調味料がおいてあります。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.",
          words: JSON.stringify([
            "思っています",
            "で",
            "辞書",
            "調べよう",
            "を",
            "意味",
            "と",
          ]),
          correctOrder: JSON.stringify([
            "辞書",
            "で",
            "意味",
            "を",
            "調べよう",
            "と",
            "思っています",
          ]),
          correctAnswer: "0",
          explanation:
            "Jawaban: 辞書で意味を調べようと思っています。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.",
          words: JSON.stringify([
            "休んだ",
            "体調が",
            "悪い",
            "いいです",
            "方が",
            "とき",
          ]),
          correctOrder: JSON.stringify([
            "体調が",
            "悪い",
            "とき",
            "休んだ",
            "方が",
            "いいです",
          ]),
          correctAnswer: "0",
          explanation:
            "Jawaban: 体調が悪いとき、休んだ方がいいです。",
        },
        // c) Multiple choice (Model C)
        {
          type: "multiple",
          question:
            'Jukugo mana   yang berhubungan "kegiatan memeriksa atau menyelidiki suatu objek agar mendapatkah data yang benar"?',
          options: JSON.stringify(["調理", "調査", "調薬"]),
          correctAnswer: "1",
          explanation: "Kunci: b (調査)",
        },
        {
          type: "multiple",
          question:
            'Jukugo  mana  yang berhubungan dengan makna "kegiatan memasak atau menyiapkan makanan "?',
          options: JSON.stringify(["調理", "調査", "調子"]),
          correctAnswer: "0",
          explanation: "Kunci: a (調理)",
        },
        {
          type: "multiple",
          question:
            'Jukugo  mana  yang berhubungan dengan makna " mencampurkan beberapa bahan agar hasilnya menjadi suatu komposisi yang sesuai dengan dinginkan?',
          options: JSON.stringify(["調合", "調査", "調薬"]),
          correctAnswer: "0",
          explanation: "Kunci: a (調合)",
        },
        {
          type: "multiple",
          question:
            'Jukugo  mana  yang berhubungan dengan makna "keadaan tubuh atau kondisi kesehatan "?',
          options: JSON.stringify(["歩調", "語調", "体調"]),
          correctAnswer: "2",
          explanation: "Kunci: c (体調)",
        },
        {
          type: "multiple",
          question:
            'Jukugo  mana  yang berhubungan dengan makna "kemampuan memusatkan perhatian  saat belajar "?',
          options: JSON.stringify(["調理", "調子", "強調"]),
          correctAnswer: "2",
          explanation: "Kunci: c (強調)",
        },
        // d) Fill in the blank (Model D)
        {
          type: "fill",
          question:
            "風邪をひいているので、今日は（　　　　）があまりよくありません。",
          options: JSON.stringify(["語調", "体調", "調書"]),
          correctAnswer: "1",
          explanation: "Kunci: b (体調)",
        },
        {
          type: "fill",
          question:
            "先生は大事なところを（　　　　）しながら説明しました。",
          options: JSON.stringify(["強調", "調理", "調合"]),
          correctAnswer: "0",
          explanation: "Kunci: a (強調)",
        },
        {
          type: "fill",
          question:
            "医者はは病気について（　　　　）を行っています。",
          options: JSON.stringify(["調理", "調査", "調味料"]),
          correctAnswer: "1",
          explanation: "Kunci: b (調査)",
        },
        {
          type: "fill",
          question:
            "母は夕食の前にらめんを（　　　　）しています。",
          options: JSON.stringify(["調印", "調理", "歩調"]),
          correctAnswer: "1",
          explanation: "Kunci: b (調理)",
        },
        {
          type: "fill",
          question:
            "みんなで同じ（　　　　）で歩きましょう。",
          options: JSON.stringify(["歩調", "好調", "調書"]),
          correctAnswer: "0",
          explanation: "Kunci: a (歩調)",
        },
        // Grouping (Model B)
        {
          type: "grouping",
          question:
            "Kelompokkan jukugo kanji 調 berikut ke dalam cabang semantic graph yang tepat.",
          words: JSON.stringify([
            "体調",
            "好調",
            "不調",
            "快調",
            "順調",
            "高調",
            "低調",
            "口調",
            "語調",
            "声調",
            "音調",
            "調査",
            "調書",
            "調印",
            "調達",
            "調理",
            "調合",
            "調製",
            "調薬",
            "調律",
            "調味料",
            "強調",
            "歩調",
            "変調",
            "移調",
          ]),
          groups: JSON.stringify([
            {
              name: "1. Kondisi dan Keadaan",
              correctWords: [
                "体調",
                "好調",
                "不調",
                "快調",
                "順調",
                "高調",
                "低調",
              ],
            },
            {
              name: "2. Cara Berbicara dan Bunyi",
              correctWords: ["口調", "語調", "声調", "音調"],
            },
            {
              name: "3. Pemeriksaan dan Administrasi",
              correctWords: ["調査", "調書", "調印", "調達"],
            },
            {
              name: "4. Pengaturan dan Penyesuaian",
              correctWords: [
                "調理",
                "調合",
                "調製",
                "調薬",
                "調律",
                "調味料",
              ],
            },
            {
              name: "5. Penyelidikan dan Perubahan Keadaan",
              correctWords: ["強調", "歩調", "変調", "移調"],
            },
          ]),
          correctAnswer: null,
          explanation: "Kelompokkan 25 kata jukugo kanji 調.",
        },
      ],
    },

    // -------------------------------------------------------------
    // KANJI 査 (ID: 3222)
    // -------------------------------------------------------------
    {
      id: 3222,
      character: "査",
      romaji: "sa",
      meaning: "Menyelidiki / Memeriksa",
      baseMeaning:
        "menyelidiki, memeriksa, atau mengecek untuk mengetahui kebenaran sesuatu.",
      categories: [
        {
          name: "1. Memeriksa",
          jukugos: [
            {
              word: "調査",
              reading: "ちょうさ",
              meaning: "survei",
              unsur: [
                { jokugo: "調", arti: "mengatur, memeriksa" },
                { jokugo: "査", arti: "memeriksa, menyelidiki" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 調 dan 査 menjadi 調査, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memeriksa atau menyelidiki suatu hal untuk memperoleh informasi.”",
            },
            {
              word: "検査",
              reading: "けんさ",
              meaning: "pemeriksaan",
              unsur: [
                { jokugo: "検", arti: "memeriksa, mengecek" },
                { jokugo: "査", arti: "memeriksa, menyelidiki" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 検 dan 査 menjadi 検査, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memeriksa sesuatu untuk mengetahui keadaan atau kebenarannya.”",
            },
            {
              word: "実査",
              reading: "じっさ",
              meaning: "inspeksi",
              unsur: [
                { jokugo: "実", arti: "nyata, sebenarnya" },
                { jokugo: "査", arti: "memeriksa, menyelidiki" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 実 dan 査 menjadi 実査, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “melakukan pemeriksaan secara langsung terhadap keadaan yang sebenarnya.”",
            },
            {
              word: "点査",
              reading: "てんさ",
              meaning: "pemeriksaan",
              unsur: [
                { jokugo: "点", arti: "titik, bagian" },
                { jokugo: "査", arti: "memeriksa, menyelidiki" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 点 dan 査 menjadi 点査, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memeriksa bagian atau hal tertentu.”",
            },
            {
              word: "簡査",
              reading: "かんさ",
              meaning: "pemeriksaan",
              unsur: [
                { jokugo: "簡", arti: "sederhana, ringkas" },
                { jokugo: "査", arti: "memeriksa, menyelidiki" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 簡 dan 査 menjadi 簡査, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “melakukan pemeriksaan secara sederhana atau ringkas.”",
            },
          ],
        },
        {
          name: "2. Memeriksa dengan Teliti",
          jukugos: [
            {
              word: "精査",
              reading: "せいさ",
              meaning: "pemeriksaan teliti",
              unsur: [
                { jokugo: "精", arti: "teliti, cermat" },
                { jokugo: "査", arti: "memeriksa, menyelidiki" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 精 dan 査 menjadi 精査, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memeriksa sesuatu secara teliti dan cermat.”",
            },
            {
              word: "細査",
              reading: "さいさ",
              meaning: "pemeriksaan rinci",
              unsur: [
                { jokugo: "細", arti: "halus, rinci" },
                { jokugo: "査", arti: "memeriksa, menyelidiki" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 細 dan 査 menjadi 細査, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memeriksa sesuatu secara rinci.”",
            },
          ],
        },
        {
          name: "3. Menilai",
          jukugos: [
            {
              word: "査定",
              reading: "さてい",
              meaning: "penilaian",
              unsur: [
                { jokugo: "査", arti: "memeriksa, menyelidiki" },
                { jokugo: "定", arti: "menentukan, menetapkan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 査 dan 定 menjadi 査定, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memeriksa sesuatu kemudian menentukan atau menetapkan nilainya.”",
            },
            {
              word: "考査",
              reading: "こうさ",
              meaning: "penilaian",
              unsur: [
                { jokugo: "考", arti: "memikirkan, mempertimbangkan" },
                { jokugo: "査", arti: "memeriksa, menyelidiki" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 考 dan 査 menjadi 考査, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memeriksa dan mempertimbangkan sesuatu untuk memberikan penilaian.”",
            },
          ],
        },
        {
          name: "4. Menyelidiki",
          jukugos: [
            {
              word: "査問",
              reading: "さもん",
              meaning: "penyelidikan",
              unsur: [
                { jokugo: "査", arti: "memeriksa, menyelidiki" },
                { jokugo: "問", arti: "bertanya, menanyakan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 査 dan 問 menjadi 査問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menyelidiki suatu hal dengan melakukan pemeriksaan atau pertanyaan.”",
            },
            {
              word: "内査",
              reading: "ないさ",
              meaning: "penyelidikan",
              unsur: [
                { jokugo: "内", arti: "dalam, internal" },
                { jokugo: "査", arti: "memeriksa, menyelidiki" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 内 dan 査 menjadi 内査, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “melakukan penyelidikan atau pemeriksaan dari dalam.”",
            },
          ],
        },
        {
          name: "5. Menguji",
          jukugos: [
            {
              word: "査験",
              reading: "さけん",
              meaning: "pengujian",
              unsur: [
                { jokugo: "査", arti: "memeriksa, menyelidiki" },
                { jokugo: "験", arti: "menguji, membuktikan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 査 dan 験 menjadi 査験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memeriksa sesuatu melalui suatu pengujian.”",
            },
          ],
        },
      ],
      quizzes: [
        // a) Unscramble (Model A)
        {
          type: "unscramble",
          question:
            "Susunlah kalimat dari kata-kata berikut (5x5=25)",
          words: JSON.stringify([
            "質問の",
            "査問の",
            "準備して",
            "前に",
            "おきます",
          ]),
          correctOrder: JSON.stringify([
            "査問の",
            "前に",
            "質問の",
            "準備して",
            "おきます",
          ]),
          correctAnswer: "0",
          explanation: "Jawaban: 査問の 前に 質問の 準備して おきます。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah kalimat dari kata-kata berikut (5x5=25)",
          words: JSON.stringify([
            "考査のために",
            "思っています",
            "準備しようと",
            "来週の",
          ]),
          correctOrder: JSON.stringify([
            "来週の",
            "考査のために",
            "準備しようと",
            "思っています",
          ]),
          correctAnswer: "0",
          explanation:
            "Jawaban: 来週の 考査のために 準備しようと 思っています。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah kalimat dari kata-kata berikut (5x5=25)",
          words: JSON.stringify([
            "査定が",
            "もう",
            "してあります",
            "車の",
          ]),
          correctOrder: JSON.stringify([
            "車の",
            "査定が",
            "もう",
            "してあります",
          ]),
          correctAnswer: "0",
          explanation: "Jawaban: 車の 査定が もう してあります。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah kalimat dari kata-kata berikut (5x5=25)",
          words: JSON.stringify([
            "実査を",
            "です",
            "現場の",
            "予定",
            "行う",
          ]),
          correctOrder: JSON.stringify([
            "現場の",
            "実査を",
            "行う",
            "予定",
            "です",
          ]),
          correctAnswer: "0",
          explanation: "Jawaban: 現場の 実査を 行う 予定です。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah kalimat dari kata-kata berikut (5x5=25)",
          words: JSON.stringify([
            "検査を",
            "思っています",
            "体の",
            "受けようと",
          ]),
          correctOrder: JSON.stringify([
            "体の",
            "検査を",
            "受けようと",
            "思っています",
          ]),
          correctAnswer: "0",
          explanation:
            "Jawaban: 体の 検査を 受けようと 思っています。",
        },
        // c) Multiple choice (Model C)
        {
          type: "multiple",
          question:
            "Jukugo mana   yang berhubungan dengan “kegiatan memeriksa atau menyelidiki atau memperoleh suatu data?",
          options: JSON.stringify(["検査", "調査", "査読"]),
          correctAnswer: "1",
          explanation: "Kunci: b (調査)",
        },
        {
          type: "multiple",
          question:
            "Jukugo  mana  yang berhubungan dengan “ pemeriksaan kesehatan atau inspeksi terhadap suatu benda atau pun orang”?",
          options: JSON.stringify(["番査", "検査", "査定"]),
          correctAnswer: "1",
          explanation: "Kunci: b (検査)",
        },
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan makna “memeriksa sesuatu kemudian menentukan atau menetapkan nilainya”?",
          options: JSON.stringify(["査験", "精査", "査定"]),
          correctAnswer: "2",
          explanation: "Kunci: c (査定)",
        },
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan makna “menyelidiki suatu hal dengan melakukan pemeriksaan atau pertanyaan”?",
          options: JSON.stringify(["査問", "査定", "精査"]),
          correctAnswer: "0",
          explanation: "Kunci: a (査問)",
        },
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan makna “memeriksa sesuatu melalui suatu pengujian”?",
          options: JSON.stringify(["調査", "査験", "査問"]),
          correctAnswer: "1",
          explanation: "Kunci: b (査験)",
        },
        // d) Fill in the blank (Model D)
        {
          type: "fill",
          question:
            "体の具合が悪いんですが、病院で（　　　）を受けたほうがいいです。",
          options: JSON.stringify(["検査", "点査", "内査"]),
          correctAnswer: "0",
          explanation: "Kunci: a (検査)",
        },
        {
          type: "fill",
          question:
            "この会社では、来週、実際の品物を見て（　　　）する予定です。",
          options: JSON.stringify(["簡査", "内査", "実査"]),
          correctAnswer: "2",
          explanation: "Kunci: c (実査)",
        },
        {
          type: "fill",
          question:
            "この部分に問題があるかもしれませんから、もう一度（　　　）してください。",
          options: JSON.stringify(["内査", "点査", "検査"]),
          correctAnswer: "1",
          explanation: "Kunci: b (点査)",
        },
        {
          type: "fill",
          question:
            "時間がありませんから、まず簡単に（　　　）したほうがいいです。",
          options: JSON.stringify(["簡査", "実査", "点査"]),
          correctAnswer: "0",
          explanation: "Kunci: a (簡査)",
        },
        {
          type: "fill",
          question:
            "会社の中で問題があるかもしれないので、まず（　　　）することになりました。",
          options: JSON.stringify(["実査", "簡査", "内査"]),
          correctAnswer: "2",
          explanation: "Kunci: c (内査)",
        },
        // Grouping (Model B)
        {
          type: "grouping",
          question:
            "Kelompokkan jukugo kanji 査 berikut ke dalam cabang semantic graph yang tepat.",
          words: JSON.stringify([
            "調査",
            "検査",
            "実査",
            "点査",
            "簡査",
            "精査",
            "細査",
            "査定",
            "考査",
            "査問",
            "内査",
            "査験",
          ]),
          groups: JSON.stringify([
            {
              name: "1. Memeriksa",
              correctWords: ["調査", "検査", "実査", "点査", "簡査"],
            },
            {
              name: "2. Memeriksa dengan Teliti",
              correctWords: ["精査", "細査"],
            },
            {
              name: "3. Menilai",
              correctWords: ["査定", "考査"],
            },
            {
              name: "4. Menyelidiki",
              correctWords: ["査問", "内査"],
            },
            {
              name: "5. Menguji",
              correctWords: ["査験"],
            },
          ]),
          correctAnswer: null,
          explanation: "Kelompokkan 12 kata jukugo kanji 査.",
        },
      ],
    },

    // -------------------------------------------------------------
    // KANJI 集 (ID: 3220)
    // -------------------------------------------------------------
    {
      id: 3220,
      character: "集",
      romaji: "shuu",
      meaning: "Berkumpul / Mengumpulkan",
      baseMeaning:
        "berkumpul, mengumpulkan, menghimpun, atau menyatukan sesuatu.",
      categories: [
        {
          name: "1. Berkumpul / Berkelompok",
          jukugos: [
            {
              word: "集合",
              reading: "しゅうごう",
              meaning: "berkumpul",
              unsur: [
                { jokugo: "集", arti: "berkumpul, mengumpulkan" },
                { jokugo: "合", arti: "bergabung, menjadi satu" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 集 dan 合 menjadi 集合, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “orang atau benda berkumpul dan bergabung menjadi satu.”",
            },
            {
              word: "集会",
              reading: "しゅうかい",
              meaning: "pertemuan",
              unsur: [
                { jokugo: "集", arti: "berkumpul, mengumpulkan" },
                { jokugo: "会", arti: "bertemu, pertemuan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 集 dan 会 menjadi 集会, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan orang-orang berkumpul untuk mengadakan suatu pertemuan.”",
            },
            {
              word: "集団",
              reading: "しゅうだん",
              meaning: "kelompok",
              unsur: [
                { jokugo: "集", arti: "berkumpul, mengumpulkan" },
                { jokugo: "団", arti: "kelompok, kumpulan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 集 dan 団 menjadi 集団, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sekumpulan orang atau benda yang berhimpun menjadi suatu kelompok.”",
            },
            {
              word: "密集",
              reading: "みっしゅう",
              meaning: "padat / berdesakan",
              unsur: [
                { jokugo: "密", arti: "rapat, padat" },
                { jokugo: "集", arti: "berkumpul, mengumpulkan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 密 dan 集 menjadi 密集, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “banyak orang atau benda berkumpul secara rapat atau padat pada suatu tempat.”",
            },
            {
              word: "集結",
              reading: "しゅうけつ",
              meaning: "berkumpul di satu tempat",
              unsur: [
                { jokugo: "集", arti: "berkumpul, mengumpulkan" },
                { jokugo: "結", arti: "mengikat, menyatukan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 集 dan 結 menjadi 集結, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “orang atau benda berkumpul dan menyatu pada satu tempat.”",
            },
            {
              word: "結集",
              reading: "けっしゅう",
              meaning: "berhimpun / bersatu",
              unsur: [
                { jokugo: "結", arti: "mengikat, menyatukan" },
                { jokugo: "集", arti: "berkumpul, mengumpulkan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 結 dan 集 menjadi 結集, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menghimpun atau menyatukan orang maupun kekuatan menjadi satu.”",
            },
          ],
        },
        {
          name: "2. Mengumpulkan / Menghimpun",
          jukugos: [
            {
              word: "収集",
              reading: "しゅうしゅう",
              meaning: "mengumpulkan",
              unsur: [
                { jokugo: "収", arti: "mengambil, menerima, menghimpun" },
                { jokugo: "集", arti: "mengumpulkan, berkumpul" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 収 dan 集 menjadi 収集, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengambil dan mengumpulkan berbagai benda atau informasi menjadi satu.”",
            },
            {
              word: "採集",
              reading: "さいしゅう",
              meaning: "mengumpulkan / mengambil",
              unsur: [
                { jokugo: "採", arti: "mengambil, memetik" },
                { jokugo: "集", arti: "mengumpulkan, berkumpul" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 採 dan 集 menjadi 採集, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengambil sesuatu dari berbagai tempat kemudian mengumpulkannya.”",
            },
            {
              word: "募集",
              reading: "ぼしゅう",
              meaning: "merekrut / menghimpun",
              unsur: [
                { jokugo: "募", arti: "mengajak, mencari, merekrut" },
                { jokugo: "集", arti: "mengumpulkan, berkumpul" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 募 dan 集 menjadi 募集, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencari atau mengajak orang agar terkumpul untuk suatu tujuan.”",
            },
            {
              word: "招集",
              reading: "しょうしゅう",
              meaning: "memanggil untuk berkumpul",
              unsur: [
                { jokugo: "招", arti: "memanggil, mengundang" },
                { jokugo: "集", arti: "berkumpul, mengumpulkan" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 招 dan 集 menjadi 招集, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memanggil atau mengundang orang agar berkumpul pada suatu tempat.”",
            },
          ],
        },
        {
          name: "3. Memusatkan / Mengakumulasi",
          jukugos: [
            {
              word: "集中",
              reading: "しゅうちゅう",
              meaning: "berkonsentrasi / memusatkan",
              unsur: [
                { jokugo: "集", arti: "mengumpulkan, memusatkan" },
                { jokugo: "中", arti: "tengah, pusat" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 集 dan 中 menjadi 集中, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengumpulkan atau memusatkan perhatian maupun sesuatu pada satu titik atau sasaran.”",
            },
            {
              word: "集積",
              reading: "しゅうせき",
              meaning: "mengumpulkan / menumpuk",
              unsur: [
                { jokugo: "集", arti: "mengumpulkan, berkumpul" },
                { jokugo: "積", arti: "menumpuk, mengakumulasi" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 集 dan 積 menjadi 集積, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengumpulkan sesuatu sehingga menumpuk atau terakumulasi.”",
            },
            {
              word: "集成",
              reading: "しゅうせい",
              meaning: "menghimpun menjadi satu",
              unsur: [
                { jokugo: "集", arti: "mengumpulkan, menghimpun" },
                { jokugo: "成", arti: "menjadi, membentuk" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 集 dan 成 menjadi 集成, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menghimpun berbagai unsur dan membentuknya menjadi satu kesatuan.”",
            },
          ],
        },
        {
          name: "4. Kumpulan / Hasil yang Dihimpun",
          jukugos: [
            {
              word: "全集",
              reading: "ぜんしゅう",
              meaning: "kumpulan lengkap karya",
              unsur: [
                { jokugo: "全", arti: "seluruh, lengkap" },
                { jokugo: "集", arti: "kumpulan, menghimpun" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 全 dan 集 menjadi 全集, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kumpulan lengkap dari seluruh karya atau tulisan tertentu.”",
            },
            {
              word: "選集",
              reading: "せんしゅう",
              meaning: "kumpulan karya pilihan",
              unsur: [
                { jokugo: "選", arti: "memilih, pilihan" },
                { jokugo: "集", arti: "kumpulan, menghimpun" },
              ],
              penjelasan:
                "Hubungan makna antar kanji 選 dan 集 menjadi 選集, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kumpulan karya atau tulisan yang dipilih dan dihimpun menjadi satu.”",
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
            "準備してあります",
            "事前に",
            "採集の",
            "工具が",
          ]),
          correctOrder: JSON.stringify([
            "事前に",
            "採集の",
            "工具が",
            "準備してあります",
          ]),
          correctAnswer: "0",
          explanation:
            "Jawaban: 事前に 採集の工具が 準備してあります。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
          words: JSON.stringify([
            "物が",
            "密集しています",
            "この",
            "地域は",
          ]),
          correctOrder: JSON.stringify([
            "この",
            "地域は",
            "物が",
            "密集しています",
          ]),
          correctAnswer: "0",
          explanation:
            "Jawaban：この 地域は 建物が 密集しています。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
          words: JSON.stringify([
            "買おうと",
            "小説の",
            "選集を",
            "思っています",
          ]),
          correctOrder: JSON.stringify([
            "小説の",
            "選集を",
            "買おうと",
            "思っています",
          ]),
          correctAnswer: "0",
          explanation:
            "Jawaban：小説の 選集を 買おうと 思っています。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
          words: JSON.stringify([
            "いいです",
            "行動した",
            "ほうが",
            "集団で",
          ]),
          correctOrder: JSON.stringify([
            "集団で",
            "行動した",
            "ほうが",
            "いいです",
          ]),
          correctAnswer: "0",
          explanation:
            "Jawaban：集団で 行動した ほうが いいです。",
        },
        {
          type: "unscramble",
          question:
            "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
          words: JSON.stringify([
            "参加しようと",
            "思っています",
            "集会に",
            "明日の",
          ]),
          correctOrder: JSON.stringify([
            "明日の",
            "集会に",
            "参加しようと",
            "思っています",
          ]),
          correctAnswer: "0",
          explanation:
            "Jawaban: 明日の 集会に 参加しようと 思っています。",
        },
        // c) Multiple choice (Model C)
        {
          type: "multiple",
          question:
            "Jukugo mana   yang berhubungan dengan “pertemuan atau rapat yang dihadiri banyak orang?",
          options: JSON.stringify(["集団", "集会", "集客"]),
          correctAnswer: "1",
          explanation: "Kunci: ① b (集会)",
        },
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan makna “kumpulan karya atau tulisan yang telah dipilih dan dihimpun menjadi satu”?",
          options: JSON.stringify(["選集", "収集", "集会"]),
          correctAnswer: "0",
          explanation: "Kunci: ② a (選集)",
        },
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan makna “mengambil dan mengumpulkan sesuatu dari berbagai tempat”?",
          options: JSON.stringify(["採集", "集結", "全集"]),
          correctAnswer: "0",
          explanation: "Kunci: ③ a (採集)",
        },
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan makna “mencari atau mengajak orang agar terkumpul untuk suatu tujuan”?",
          options: JSON.stringify(["集積", "募集", "集団"]),
          correctAnswer: "1",
          explanation: "Kunci: ④ b (募集)",
        },
        {
          type: "multiple",
          question:
            "Jukugo mana yang berhubungan dengan makna “memusatkan perhatian atau pikiran pada satu hal”?",
          options: JSON.stringify(["集合", "選集", "集中"]),
          correctAnswer: "2",
          explanation: "Kunci: ⑤ c (集中)",
        },
        // d) Fill in the blank (Model D)
        {
          type: "fill",
          question:
            "会議は午前九時に始まりますので、時間までに（　　　　）してください。",
          options: JSON.stringify(["集合", "集中", "集団"]),
          correctAnswer: "0",
          explanation: "Kunci: ① a (集合)",
        },
        {
          type: "fill",
          question:
            "来週、学校で学生の（　　　）があるんです。",
          options: JSON.stringify(["集会", "採集", "集積"]),
          correctAnswer: "0",
          explanation: "Kunci: ② a (集会)",
        },
        {
          type: "fill",
          question:
            "試験中はほかのことを考えないで、（　　　　）してください。",
          options: JSON.stringify(["収集", "集客", "集中"]),
          correctAnswer: "2",
          explanation: "Kunci: ③ c (集中)",
        },
        {
          type: "fill",
          question:
            "大学では来月から新しい学生を（　　　）する予定です。",
          options: JSON.stringify(["集結", "募集", "集積"]),
          correctAnswer: "1",
          explanation: "Kunci: ④ b (募集)",
        },
        {
          type: "fill",
          question:
            "夏休みに山へ行って、植物を（　　　）するつもりです。",
          options: JSON.stringify(["集会", "採集", "集団"]),
          correctAnswer: "1",
          explanation: "Kunci: ⑤ b (採集)",
        },
        // Grouping (Model B)
        {
          type: "grouping",
          question:
            "Kelompokkan jukugo kanji 集 berikut ke dalam cabang semantic graph yang tepat.",
          words: JSON.stringify([
            "集合",
            "集会",
            "集団",
            "密集",
            "集結",
            "結集",
            "収集",
            "採集",
            "募集",
            "招集",
            "集中",
            "集積",
            "集成",
            "全集",
            "選集",
          ]),
          groups: JSON.stringify([
            {
              name: "1. Berkumpul / Berkelompok",
              correctWords: [
                "集合",
                "集会",
                "集団",
                "密集",
                "集結",
                "結集",
              ],
            },
            {
              name: "2. Mengumpulkan / Menghimpun",
              correctWords: ["収集", "採集", "募集", "招集"],
            },
            {
              name: "3. Memusatkan / Mengakumulasi",
              correctWords: ["集中", "集積", "集成"],
            },
            {
              name: "4. Kumpulan / Hasil yang Dihimpun",
              correctWords: ["全集", "選集"],
            },
          ]),
          correctAnswer: null,
          explanation: "Kelompokkan 15 kata jukugo kanji 集.",
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
        baseMeaning: kd.baseMeaning,
      },
    });

    // 2. Bersihkan KanjiGraphEdge untuk kanji ini agar Semantic Graph dibangun dinamis
    await prisma.kanjiGraphEdge.deleteMany({
      where: { kanjiId: kd.id },
    });

    // 3. Bersihkan kuis lama untuk kanji ini
    await prisma.quiz.deleteMany({
      where: { kanjiId: kd.id },
    });

    // 4. Bersihkan KategoriKanji, SemanticRelation & SemanticRelationNode, dan Jukugo lama
    const existingJukugos = await prisma.jukugo.findMany({
      where: { kanjiId: kd.id },
      select: { id: true },
    });
    const existingJukugoIds = existingJukugos.map((j) => j.id);
    if (existingJukugoIds.length > 0) {
      await prisma.kategoriKanji.deleteMany({
        where: { jokugoId: { in: existingJukugoIds } },
      });
    }

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

    await prisma.jukugo.deleteMany({
      where: { kanjiId: kd.id },
    });

    // 5. Insert MasterCategory, Jukugo, KategoriKanji, SemanticRelation, SemanticRelationNode
    for (const cat of kd.categories) {
      const masterCat = await prisma.masterCategory.upsert({
        where: { name: cat.name },
        update: {},
        create: {
          name: cat.name,
          description: `Kategori ${cat.name} untuk kanji ${kd.character}`,
        },
      });

      for (const jk of cat.jukugos) {
        const createdJukugo = await prisma.jukugo.create({
          data: {
            kanjiId: kd.id,
            word: jk.word,
            reading: jk.reading,
            meaning: jk.meaning,
          },
        });

        await prisma.kategoriKanji.create({
          data: {
            categoryId: masterCat.id,
            jokugoId: createdJukugo.id,
          },
        });

        const createdSR = await prisma.semanticRelation.create({
          data: {
            kanjiId: kd.id,
            jukugoId: createdJukugo.id,
            penjelasan: jk.penjelasan,
          },
        });

        for (const un of jk.unsur) {
          await prisma.semanticRelationNode.create({
            data: {
              semanticId: createdSR.id,
              jokugo: un.jokugo,
              arti: un.arti,
            },
          });
        }
      }
    }

    // 7. Simpan kuis-kuis baru
    for (const q of kd.quizzes) {
      await prisma.quiz.create({
        data: {
          kanjiId: kd.id,
          type: q.type,
          question: q.question,
          words: (q as any).words ?? null,
          correctOrder: (q as any).correctOrder ?? null,
          options: (q as any).options ?? null,
          correctAnswer: (q as any).correctAnswer ?? null,
          groups: (q as any).groups ?? null,
          explanation: q.explanation,
        },
      });
    }

    const totalJukugos = kd.categories.reduce((acc, c) => acc + c.jukugos.length, 0);
    console.log(
      `✓ Kanji ${kd.character}: ${totalJukugos} Jukugo across ${kd.categories.length} categories, ${kd.quizzes.length} quizzes tersimpan rapi.`
    );
  }

  console.log("\n=== SINKRONISASI MODUL 2 SUKSES 100% ===");
}

main()
  .catch((e) => {
    console.error("Error saat sinkronisasi Modul 2:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
