import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface UnsurData {
  jokugo: string;
  arti: string;
}

interface JukugoData {
  word: string;
  reading: string;
  meaning: string;
  unsur: UnsurData[];
  penjelasan: string;
}

interface CategoryData {
  name: string;
  jukugos: JukugoData[];
}

interface QuizData {
  type: "unscramble" | "multiple" | "fill" | "grouping";
  question: string;
  words?: string;
  correctOrder?: string;
  options?: string;
  correctAnswer?: string | null;
  groups?: string;
  explanation: string;
}

interface KanjiData {
  id: number;
  character: string;
  romaji: string;
  meaning: string;
  baseMeaning: string;
  bushuu: string;
  onyomi: string;
  kunyomi: string;
  categories: CategoryData[];
  quizzes: QuizData[];
}

const MODUL_5_DATA: KanjiData[] = [
  // =============================================================
  // 1. KANJI 議 (ID: 3236)
  // =============================================================
  {
    id: 3236,
    character: "議",
    romaji: "GI",
    meaning: "Membahas, Berunding, Pendapat",
    baseMeaning: "membahas, berunding, mengemukakan pendapat, serta memutuskan.",
    bushuu: "言",
    onyomi: "ギ",
    kunyomi: "-",
    categories: [
      {
        name: "1. Pertemuan / Diskusi",
        jukugos: [
          {
            word: "会議",
            reading: "かいぎ",
            meaning: "rapat / pertemuan",
            unsur: [
              { jokugo: "会", arti: "bertemu, berkumpul" },
              { jokugo: "議", arti: "membahas, berunding" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 会 dan 議 menjadi 会議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “rapat atau pertemuan yang dilakukan untuk membahas suatu persoalan.”"
          },
          {
            word: "議論",
            reading: "ぎろん",
            meaning: "diskusi / perdebatan",
            unsur: [
              { jokugo: "議", arti: "membahas, mengemukakan pendapat" },
              { jokugo: "論", arti: "membahas, berargumentasi" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 議 dan 論 menjadi 議論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan membahas suatu persoalan dengan mengemukakan pendapat atau argumentasi.”"
          },
          {
            word: "論議",
            reading: "ろんぎ",
            meaning: "perdebatan / diskusi",
            unsur: [
              { jokugo: "論", arti: "membahas, berargumentasi" },
              { jokugo: "議", arti: "membahas, berunding" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 論 dan 議 menjadi 論議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pembahasan atau perdebatan mengenai suatu persoalan.”"
          },
          {
            word: "討議",
            reading: "とうぎ",
            meaning: "membahas / berdiskusi",
            unsur: [
              { jokugo: "討", arti: "membahas, menyelidiki, mengkaji" },
              { jokugo: "議", arti: "membahas, berunding" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 討 dan 議 menjadi 討議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan membahas atau mengkaji suatu persoalan secara mendalam.”"
          },
          {
            word: "合議",
            reading: "ごうぎ",
            meaning: "bermusyawarah",
            unsur: [
              { jokugo: "合", arti: "bersama, menyatukan" },
              { jokugo: "議", arti: "membahas, berunding" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 合 dan 議 menjadi 合議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “musyawarah atau pembahasan bersama untuk mencapai suatu keputusan.”"
          },
          {
            word: "談議",
            reading: "だんぎ",
            meaning: "percakapan / pembicaraan",
            unsur: [
              { jokugo: "談", arti: "berbicara, membicarakan" },
              { jokugo: "議", arti: "membahas, berunding" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 談 dan 議 menjadi 談議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pembicaraan atau diskusi mengenai suatu persoalan.”"
          },
          {
            word: "評議",
            reading: "ひょうぎ",
            meaning: "membahas / meninjau",
            unsur: [
              { jokugo: "評", arti: "menilai, mempertimbangkan" },
              { jokugo: "議", arti: "membahas, berunding" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 評 dan 議 menjadi 評議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan mempertimbangkan dan membahas suatu persoalan untuk memperoleh penilaian atau keputusan.”"
          }
        ]
      },
      {
        name: "2. Keputusan / Penetapan",
        jukugos: [
          {
            word: "決議",
            reading: "けつぎ",
            meaning: "keputusan bulat",
            unsur: [
              { jokugo: "決", arti: "memutuskan, menentukan" },
              { jokugo: "議", arti: "membahas, berunding" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 決 dan 議 menjadi 決議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keputusan atau resolusi yang ditetapkan melalui pembahasan atau rapat.”"
          },
          {
            word: "議決",
            reading: "ぎけつ",
            meaning: "keputusan (resmi)",
            unsur: [
              { jokugo: "議", arti: "membahas, berunding" },
              { jokugo: "決", arti: "memutuskan, menentukan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 議 dan 決 menjadi 議決, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keputusan yang ditetapkan setelah melalui pembahasan atau musyawarah.”"
          }
        ]
      },
      {
        name: "3. Usulan / Agenda",
        jukugos: [
          {
            word: "発議",
            reading: "はつぎ",
            meaning: "mengajukan usul",
            unsur: [
              { jokugo: "発", arti: "mengajukan, memulai, mengeluarkan" },
              { jokugo: "議", arti: "membahas, mengusulkan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 発 dan 議 menjadi 発議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tindakan mengajukan suatu usulan atau persoalan untuk dibahas.”"
          },
          {
            word: "建議",
            reading: "けんぎ",
            meaning: "membuat usulan / rekomendasi",
            unsur: [
              { jokugo: "建", arti: "mengemukakan, mengusulkan" },
              { jokugo: "議", arti: "membahas, mengajukan pendapat" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 建 dan 議 menjadi 建議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “usulan atau rekomendasi yang diajukan kepada pihak yang berwenang.”"
          },
          {
            word: "動議",
            reading: "どうぎ",
            meaning: "usulan dalam rapat",
            unsur: [
              { jokugo: "動", arti: "menggerakkan, mengajukan tindakan" },
              { jokugo: "議", arti: "membahas, mengusulkan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 動 dan 議 menjadi 動議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mosi atau usul yang diajukan dalam suatu rapat untuk dibahas atau diputuskan.”"
          },
          {
            word: "議案",
            reading: "ぎあん",
            meaning: "rancangan usulan / agenda",
            unsur: [
              { jokugo: "議", arti: "membahas, berunding" },
              { jokugo: "案", arti: "rancangan, usulan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 議 dan 案 menjadi 議案, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “rancangan usulan atau perkara yang diajukan untuk dibahas dalam rapat.”"
          },
          {
            word: "議題",
            reading: "ぎだい",
            meaning: "topik / agenda rapat",
            unsur: [
              { jokugo: "議", arti: "membahas, berunding" },
              { jokugo: "題", arti: "topik, pokok persoalan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 議 dan 題 menjadi 議題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “topik atau pokok persoalan yang menjadi bahan pembahasan dalam rapat.”"
          }
        ]
      },
      {
        name: "4. Pendapat / Konflik",
        jukugos: [
          {
            word: "異議",
            reading: "いぎ",
            meaning: "keberatan / sanggahan",
            unsur: [
              { jokugo: "異", arti: "berbeda, tidak sama" },
              { jokugo: "議", arti: "pendapat, pembahasan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 異 dan 議 menjadi 異議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keberatan atau pendapat yang berbeda terhadap suatu keputusan atau pendapat.”"
          },
          {
            word: "物議",
            reading: "ぶつぎ",
            meaning: "menjadi perdebatan",
            unsur: [
              { jokugo: "物", arti: "hal, perkara" },
              { jokugo: "議", arti: "pembicaraan, pendapat" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 物 dan 議 menjadi 物議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “suatu perkara yang menjadi bahan pembicaraan atau menimbulkan kontroversi.”"
          },
          {
            word: "争議",
            reading: "そうぎ",
            meaning: "perselisihan / sengketa",
            unsur: [
              { jokugo: "争", arti: "berselisih, memperdebatkan" },
              { jokugo: "議", arti: "membahas, berunding" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 争 dan 議 menjadi 争議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perselisihan atau konflik yang berkaitan dengan suatu persoalan dan memerlukan pembahasan atau penyelesaian.”"
          },
          {
            word: "和議",
            reading: "わぎ",
            meaning: "perjanjian damai",
            unsur: [
              { jokugo: "和", arti: "damai, harmonis" },
              { jokugo: "議", arti: "berunding, membahas" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 和 dan 議 menjadi 和議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perundingan yang dilakukan untuk mencapai perdamaian atau menyelesaikan perselisihan.”"
          }
        ]
      },
      {
        name: "5. Pelaku / Lembaga / Jalannya Rapat",
        jukugos: [
          {
            word: "議員",
            reading: "ぎいん",
            meaning: "anggota dewan / parlemen",
            unsur: [
              { jokugo: "議", arti: "membahas, berunding" },
              { jokugo: "員", arti: "anggota, personel" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 議 dan 員 menjadi 議員, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “orang yang menjadi anggota lembaga perwakilan dan terlibat dalam pembahasan atau pengambilan keputusan.”"
          },
          {
            word: "議長",
            reading: "ぎちょう",
            meaning: "ketua sidang / pimpinan rapat",
            unsur: [
              { jokugo: "議", arti: "rapat, pembahasan" },
              { jokugo: "長", arti: "pemimpin, ketua" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 議 dan 長 menjadi 議長, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “orang yang memimpin dan mengatur jalannya sidang atau rapat.”"
          },
          {
            word: "議事",
            reading: "ぎじ",
            meaning: "jalannya rapat / prosedur rapat",
            unsur: [
              { jokugo: "議", arti: "rapat, pembahasan" },
              { jokugo: "事", arti: "hal, perkara, urusan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 議 dan 事 menjadi 議事, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “hal-hal atau urusan yang berkaitan dengan jalannya rapat atau persidangan.”"
          },
          {
            word: "議会",
            reading: "ぎかい",
            meaning: "dewan / parlemen / legislatif",
            unsur: [
              { jokugo: "議", arti: "membahas, berunding" },
              { jokugo: "会", arti: "pertemuan, perkumpulan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 議 dan 会 menjadi 議会, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “lembaga atau forum tempat para anggota berkumpul untuk membahas persoalan dan mengambil keputusan.”"
          }
        ]
      }
    ],
    quizzes: [
      // 5 Unscramble
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["議論するのは", "面白いです", "友だちと"]),
        correctOrder: JSON.stringify(["友だちと", "議論するのは", "面白いです"]),
        correctAnswer: "0",
        explanation: "Jawaban: 友だちと議論するのは面白いです。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["前に", "出しておきます", "議案を", "会議の"]),
        correctOrder: JSON.stringify(["会議の", "前に", "議案を", "出しておきます"]),
        correctAnswer: "0",
        explanation: "Jawaban: 会議の 前に議案を出しておきます。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["始まるでしょう", "来月", "議会が"]),
        correctOrder: JSON.stringify(["来月", "議会が", "始まるでしょう"]),
        correctAnswer: "0",
        explanation: "Jawaban: 来月議会が始まるでしょう"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["異議が", "出るかもしれません", "新しい", "計画に"]),
        correctOrder: JSON.stringify(["計画に", "新しい", "異議が", "出るかもしれません"]),
        correctAnswer: "0",
        explanation: "Jawaban: 計画に新しい異議が出るかもしれません。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["和議を", "思っています", "と", "結ぼう"]),
        correctOrder: JSON.stringify(["和議を", "結ぼう", "と", "思っています"]),
        correctAnswer: "0",
        explanation: "Jawaban: 和議を結ぼうと思っています。"
      },

      // 5 Multiple Choice (Section c)
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “rapat atau pertemuan untuk membahas suatu hal”?",
        options: JSON.stringify(["会議", "議員", "議題"]),
        correctAnswer: "会議",
        explanation: "Kunci Jawaban: ① a"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “diskusi atau perdebatan mengenai suatu hal”?",
        options: JSON.stringify(["議長", "議論", "議事"]),
        correctAnswer: "議論",
        explanation: "Kunci Jawaban: ② b"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “keputusan yang telah ditetapkan secara resmi”?",
        options: JSON.stringify(["決議", "発議", "異議"]),
        correctAnswer: "決議",
        explanation: "Kunci Jawaban: ③ a"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “orang yang menjadi anggota dewan atau parlemen”?",
        options: JSON.stringify(["議長", "議員", "議事"]),
        correctAnswer: "議員",
        explanation: "Kunci Jawaban: ④ b"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “topik atau agenda yang dibahas dalam rapat”?",
        options: JSON.stringify(["議題", "議決", "争議"]),
        correctAnswer: "議題",
        explanation: "Kunci Jawaban: ⑤ a"
      },

      // 5 Fill-in-the-blank (Section d)
      {
        type: "fill",
        question: "来週、先生と学生の代表が（　　　）をする予定です。",
        options: JSON.stringify(["会議", "議員", "議題"]),
        correctAnswer: "会議",
        explanation: "Kunci Jawaban: ① a"
      },
      {
        type: "fill",
        question: "この問題について、みんなで（　　　）したほうがいいでしょう。",
        options: JSON.stringify(["議題", "議論", "議員"]),
        correctAnswer: "議論",
        explanation: "Kunci Jawaban: ② b"
      },
      {
        type: "fill",
        question: "今日の（　　　）は「日本語の勉強方法」です。",
        options: JSON.stringify(["議題", "議決", "議員"]),
        correctAnswer: "議題",
        explanation: "Kunci Jawaban: ③ a"
      },
      {
        type: "fill",
        question: "国会で働いている人を（　　　）といいます。",
        options: JSON.stringify(["会議", "決議", "議員"]),
        correctAnswer: "議員",
        explanation: "Kunci Jawaban: ④ c"
      },
      {
        type: "fill",
        question: "会議で大切なことについてみんなで話したあとで、（　　　）が行われました。",
        options: JSON.stringify(["議論", "議題", "決議"]),
        correctAnswer: "決議",
        explanation: "Kunci Jawaban: ⑤ c"
      },

      // 1 Grouping
      {
        type: "grouping",
        question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
        groups: JSON.stringify([
          { name: "Pertemuan / Diskusi", correctWords: ["会議", "議論", "論議", "討議", "合議", "談議", "評議"] },
          { name: "Keputusan / Penetapan", correctWords: ["決議", "議決"] },
          { name: "Usulan / Agenda", correctWords: ["発議", "建議", "動議", "議案", "議題"] },
          { name: "Pendapat / Konflik", correctWords: ["異議", "物議", "争議", "和議"] },
          { name: "Pelaku / Lembaga / Jalannya Rapat", correctWords: ["議員", "議長", "議事", "議会"] }
        ]),
        explanation: "Kelompokkan jukugo kanji 議 ke dalam 5 kategori makna yang tepat."
      }
    ]
  },

  // =============================================================
  // 2. KANJI 論 (ID: 3237)
  // =============================================================
  {
    id: 3237,
    character: "論",
    romaji: "RON",
    meaning: "Teori, Argumen, Membahas",
    baseMeaning: "membahas atau menjelaskan suatu hal secara logis serta mengemukakan pendapat atau pandangan.",
    bushuu: "言",
    onyomi: "ロン",
    kunyomi: "-",
    categories: [
      {
        name: "1. Diskusi / Perdebatan",
        jukugos: [
          {
            word: "論議",
            reading: "ろんぎ",
            meaning: "diskusi, perdebatan",
            unsur: [
              { jokugo: "論", arti: "pendapat, argumen" },
              { jokugo: "議", arti: "membahas, berunding" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 論 dan 議 menjadi 論議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pembahasan atau perdebatan mengenai suatu persoalan.”"
          },
          {
            word: "議論",
            reading: "ぎろん",
            meaning: "diskusi",
            unsur: [
              { jokugo: "議", arti: "membahas, berunding" },
              { jokugo: "論", arti: "membahas, mengemukakan pendapat atau argumen" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 議 dan 論 menjadi 議論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “diskusi atau perdebatan mengenai suatu persoalan.”"
          },
          {
            word: "討論",
            reading: "とうろん",
            meaning: "debat",
            unsur: [
              { jokugo: "討", arti: "membahas, mendiskusikan, menyelidiki" },
              { jokugo: "論", arti: "membahas, mengemukakan pendapat atau argumen" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 討 dan 論 menjadi 討論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “diskusi atau debat untuk membahas suatu persoalan atau topik.”"
          },
          {
            word: "口論",
            reading: "こうろん",
            meaning: "pertengkaran, perselisihan lisan",
            unsur: [
              { jokugo: "口", arti: "mulut, ucapan" },
              { jokugo: "論", arti: "membahas, berdebat" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 口 dan 論 menjadi 口論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perdebatan atau pertengkaran yang dilakukan secara lisan.”"
          },
          {
            word: "反論",
            reading: "はんろん",
            meaning: "sanggahan, argumen balasan",
            unsur: [
              { jokugo: "反", arti: "melawan, berbalik, menentang" },
              { jokugo: "論", arti: "pendapat, argumen" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 反 dan 論 menjadi 反論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sanggahan atau argumen yang digunakan untuk menentang atau membalas pendapat sebelumnya.”"
          },
          {
            word: "弁論",
            reading: "べんろん",
            meaning: "pembelaan, pembicaraan",
            unsur: [
              { jokugo: "弁", arti: "berbicara, menjelaskan, membela" },
              { jokugo: "論", arti: "pendapat, argumen" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 弁 dan 論 menjadi 弁論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “penyampaian argumentasi atau pembelaan melalui pendapat dan penjelasan.”"
          },
          {
            word: "論争",
            reading: "ろんそう",
            meaning: "perselisihan, pertentangan",
            unsur: [
              { jokugo: "論", arti: "pendapat, argumen, pembahasan" },
              { jokugo: "争", arti: "berselisih, bertentangan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 論 dan 争 menjadi 論争, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perdebatan atau perselisihan mengenai suatu pendapat atau persoalan.”"
          }
        ]
      },
      {
        name: "2. Pendapat / Wacana",
        jukugos: [
          {
            word: "異論",
            reading: "いろん",
            meaning: "pendapat berbeda, keberatan",
            unsur: [
              { jokugo: "異", arti: "berbeda, tidak sama" },
              { jokugo: "論", arti: "pendapat, pandangan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 異 dan 論 menjadi 異論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pendapat yang berbeda atau keberatan terhadap suatu pendapat.”"
          },
          {
            word: "持論",
            reading: "じろん",
            meaning: "pendapat yang dianut",
            unsur: [
              { jokugo: "持", arti: "memegang, memiliki" },
              { jokugo: "論", arti: "pendapat, pandangan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 持 dan 論 menjadi 持論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pendapat atau pandangan yang secara pribadi dimiliki dan dianut seseorang.”"
          },
          {
            word: "言論",
            reading: "げんろん",
            meaning: "wacana, pendapat umum",
            unsur: [
              { jokugo: "言", arti: "kata, ucapan, menyatakan" },
              { jokugo: "論", arti: "pendapat, pandangan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 言 dan 論 menjadi 言論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pendapat atau wacana yang disampaikan melalui bahasa atau ucapan.”"
          },
          {
            word: "世論",
            reading: "よろん",
            meaning: "opini publik",
            unsur: [
              { jokugo: "世", arti: "masyarakat, dunia" },
              { jokugo: "論", arti: "pendapat, pandangan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 世 dan 論 menjadi 世論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pendapat atau pandangan yang berkembang di tengah masyarakat.”"
          }
        ]
      },
      {
        name: "3. Penalaran / Pemikiran",
        jukugos: [
          {
            word: "論理",
            reading: "ろんり",
            meaning: "logika, penalaran",
            unsur: [
              { jokugo: "論", arti: "membahas, mengemukakan pendapat" },
              { jokugo: "理", arti: "alasan, logika, prinsip" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 論 dan 理 menjadi 論理, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “logika atau penalaran yang digunakan untuk berpikir dan menjelaskan suatu persoalan secara sistematis.”"
          },
          {
            word: "理論",
            reading: "りろん",
            meaning: "teori",
            unsur: [
              { jokugo: "理", arti: "alasan, prinsip, logika" },
              { jokugo: "論", arti: "pendapat, pembahasan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 理 dan 論 menjadi 理論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “teori atau sistem pemikiran yang menjelaskan suatu hal berdasarkan prinsip dan penalaran.”"
          },
          {
            word: "論点",
            reading: "ろんてん",
            meaning: "pokok persoalan, titik pembahasan",
            unsur: [
              { jokugo: "論", arti: "pembahasan, pendapat" },
              { jokugo: "点", arti: "titik, pokok" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 論 dan 点 menjadi 論点, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pokok persoalan atau titik utama yang menjadi fokus dalam suatu pembahasan.”"
          },
          {
            word: "結論",
            reading: "けつろん",
            meaning: "kesimpulan",
            unsur: [
              { jokugo: "結", arti: "mengikat, menyatukan, menghasilkan" },
              { jokugo: "論", arti: "pembahasan, pendapat" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 結 dan 論 menjadi 結論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kesimpulan yang diperoleh setelah melakukan pembahasan atau penalaran.”"
          }
        ]
      },
      {
        name: "4. Penyampaian / Hasil Pemikiran",
        jukugos: [
          {
            word: "評論",
            reading: "ひょうろん",
            meaning: "kritik, ulasan",
            unsur: [
              { jokugo: "評", arti: "menilai, memberikan penilaian" },
              { jokugo: "論", arti: "membahas, mengemukakan pendapat" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 評 dan 論 menjadi 評論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pembahasan atau tulisan yang memberikan penilaian dan kritik terhadap suatu hal.”"
          },
          {
            word: "論述",
            reading: "ろんじゅつ",
            meaning: "uraian argumentatif, editorial",
            unsur: [
              { jokugo: "論", arti: "pendapat, pembahasan" },
              { jokugo: "述", arti: "menyatakan, menguraikan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 論 dan 述 menjadi 論述, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “uraian atau tulisan yang menyampaikan pendapat dan argumentasi mengenai suatu persoalan.”"
          },
          {
            word: "論文",
            reading: "ろんぶん",
            meaning: "karya tulis ilmiah, makalah",
            unsur: [
              { jokugo: "論", arti: "pembahasan, pendapat, argumen" },
              { jokugo: "文", arti: "tulisan, karangan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 論 dan 文 menjadi 論文, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “karya tulis ilmiah yang membahas suatu persoalan berdasarkan pemikiran, penalaran, dan argumentasi.”"
          }
        ]
      }
    ],
    quizzes: [
      // 5 Unscramble
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["好きです", "討論するのが", "クラスで"]),
        correctOrder: JSON.stringify(["クラスで", "討論するのが", "好きです"]),
        correctAnswer: "0",
        explanation: "Jawaban: クラスで討論するのが好きです。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["変えられました", "世界が", "ニュースで"]),
        correctOrder: JSON.stringify(["ニュースで", "世界が", "変えられました"]),
        correctAnswer: "0",
        explanation: "Jawaban: ニュースで世界が変えられました。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["思っています", "話そうと", "持論を"]),
        correctOrder: JSON.stringify(["持論を", "話そうと", "思っています"]),
        correctAnswer: "0",
        explanation: "Jawaban: 持論を話そうと思っています。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["口論しない", "いいです", "ほうが", "友達"]),
        correctOrder: JSON.stringify(["友達", "口論しない", "ほうが", "いいです"]),
        correctAnswer: "0",
        explanation: "Jawaban: 友達と口論した方がいいです。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["反論できるように", "準備します", "上手に"]),
        correctOrder: JSON.stringify(["上手に", "反論できるように", "準備します"]),
        correctAnswer: "0",
        explanation: "Jawaban: 上手に反論できるように準備します。"
      },

      // 5 Multiple Choice (Section c)
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “diskusi atau pembahasan mengenai suatu masalah”?",
        options: JSON.stringify(["論議", "結論", "論文"]),
        correctAnswer: "論議",
        explanation: "Kunci Jawaban: ① a"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “debat atau perdebatan mengenai suatu hal”?",
        options: JSON.stringify(["評論", "討論", "論理"]),
        correctAnswer: "討論",
        explanation: "Kunci Jawaban: ② b"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “sanggahan atau argumen untuk membalas pendapat orang lain”?",
        options: JSON.stringify(["反論", "持論", "世論"]),
        correctAnswer: "反論",
        explanation: "Kunci Jawaban: ③ a"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “pendapat yang berbeda atau keberatan terhadap suatu pendapat”?",
        options: JSON.stringify(["異論", "理論", "論点"]),
        correctAnswer: "異論",
        explanation: "Kunci Jawaban: ④ a"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “kesimpulan yang diperoleh setelah membahas atau mempertimbangkan suatu hal”?",
        options: JSON.stringify(["論点", "評論", "結論"]),
        correctAnswer: "結論",
        explanation: "Kunci Jawaban: ⑤ c"
      },

      // 5 Fill-in-the-blank (Section d)
      {
        type: "fill",
        question: "この問題について、みんなで（　　　）したほうがいいでしょう。",
        options: JSON.stringify(["持論", "議論", "異論"]),
        correctAnswer: "議論",
        explanation: "Kunci Jawaban: ① b"
      },
      {
        type: "fill",
        question: "二人はそのテーマについて（　　　）しています。",
        options: JSON.stringify(["論理", "討論", "反論"]),
        correctAnswer: "討論",
        explanation: "Kunci Jawaban: ② b"
      },
      {
        type: "fill",
        question: "先生の意見に（　　　）する前に、よく考えてください。",
        options: JSON.stringify(["持論", "異論", "反論"]),
        correctAnswer: "反論",
        explanation: "Kunci Jawaban: ③ c"
      },
      {
        type: "fill",
        question: "その考えには（　　　）があるかもしれません。",
        options: JSON.stringify(["異論", "論理", "討論"]),
        correctAnswer: "異論",
        explanation: "Kunci Jawaban: ④ a"
      },
      {
        type: "fill",
        question: "この文章は（　　　）がはっきりしていて、読みやすいです。",
        options: JSON.stringify(["論理", "異論", "持論"]),
        correctAnswer: "論理",
        explanation: "Kunci Jawaban: ⑤ a"
      },

      // 1 Grouping
      {
        type: "grouping",
        question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
        groups: JSON.stringify([
          { name: "Diskusi / Perdebatan", correctWords: ["論議", "議論", "討論", "口論", "反論", "弁論", "論争"] },
          { name: "Pendapat / Wacana", correctWords: ["異論", "持論", "言論", "世論"] },
          { name: "Penalaran / Pemikiran", correctWords: ["論理", "理論", "論点", "結論"] },
          { name: "Penyampaian / Hasil Pemikiran", correctWords: ["評論", "論述", "論文"] }
        ]),
        explanation: "Kelompokkan jukugo kanji 論 ke dalam 4 kategori makna yang tepat."
      }
    ]
  },

  // =============================================================
  // 3. KANJI 討 (ID: 3239)
  // =============================================================
  {
    id: 3239,
    character: "討",
    romaji: "TOU",
    meaning: "Membahas, Menyerang",
    baseMeaning: "menyelidiki, membahas, mempertimbangkan; menyerang, menumpas.",
    bushuu: "言",
    onyomi: "トウ",
    kunyomi: "う.つ",
    categories: [
      {
        name: "1. Membahas / Berdiskusi",
        jukugos: [
          {
            word: "討議",
            reading: "とうぎ",
            meaning: "diskusi",
            unsur: [
              { jokugo: "討", arti: "membahas, berdiskusi" },
              { jokugo: "議", arti: "membahas, berunding" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 討 dan 議 menjadi 討議, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “diskusi atau pembahasan mengenai suatu persoalan.”"
          },
          {
            word: "討論",
            reading: "とうろん",
            meaning: "debat",
            unsur: [
              { jokugo: "討", arti: "membahas, berdiskusi" },
              { jokugo: "論", arti: "membahas, berpendapat" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 討 dan 論 menjadi 討論, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “debat atau pembahasan mengenai suatu persoalan.”"
          }
        ]
      },
      {
        name: "2. Menyelidiki / Mengkaji",
        jukugos: [
          {
            word: "討究",
            reading: "とうきゅう",
            meaning: "mengkaji",
            unsur: [
              { jokugo: "討", arti: "menyelidiki, membahas" },
              { jokugo: "究", arti: "menyelidiki, mengkaji" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 討 dan 究 menjadi 討究, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengkaji atau menyelidiki sesuatu secara mendalam.”"
          },
          {
            word: "検討",
            reading: "けんとう",
            meaning: "meninjau",
            unsur: [
              { jokugo: "検", arti: "memeriksa, meneliti" },
              { jokugo: "討", arti: "mempertimbangkan, membahas" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 検 dan 討 menjadi 検討, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “meninjau atau mempertimbangkan sesuatu dengan cermat.”"
          }
        ]
      },
      {
        name: "3. Menyerang / Menumpas",
        jukugos: [
          {
            word: "討伐",
            reading: "とうばつ",
            meaning: "menumpas",
            unsur: [
              { jokugo: "討", arti: "menyerang, menumpas" },
              { jokugo: "伐", arti: "menebang, menaklukkan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 討 dan 伐 menjadi 討伐, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menyerang atau menumpas untuk menaklukkan.”"
          }
        ]
      }
    ],
    quizzes: [
      // 5 Unscramble
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["思っています", "あの", "検討しようと", "意見を"]),
        correctOrder: JSON.stringify(["あの", "意見を", "検討しようと", "思っています"]),
        correctAnswer: "0",
        explanation: "Jawaban: あの意見を検討しようと思っています。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["討論できるように", "練習します", "上手に"]),
        correctOrder: JSON.stringify(["上手に", "討論できるように", "練習します"]),
        correctAnswer: "0",
        explanation: "Jawaban: 上手に討論できるように、練習します。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["討究するのは", "大変です", "心理を"]),
        correctOrder: JSON.stringify(["心理を", "討究するのは", "大変です"]),
        correctAnswer: "0",
        explanation: "Jawaban: 心理を討究するのは大変です。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["が 始まるかもしれません", "明日", "検討会"]),
        correctOrder: JSON.stringify(["明日", "検討会", "が 始まるかもしれません"]),
        correctAnswer: "0",
        explanation: "Jawaban: 明日検討会が始まるかもしれません。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["返事を", "ご検討の", "します", "あとで"]),
        correctOrder: JSON.stringify(["あとで", "ご検討の", "返事を", "します"]),
        correctAnswer: "0",
        explanation: "Jawaban: あとでご検討の返事をします。"
      },

      // 5 Multiple Choice (Section c)
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “membahas suatu hal dalam rapat atau pertemuan”?",
        options: JSON.stringify(["討議", "討伐", "討究"]),
        correctAnswer: "討議",
        explanation: "Kunci Jawaban: ① a"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “debat atau perdebatan mengenai suatu masalah”?",
        options: JSON.stringify(["検討", "討論", "討議"]),
        correctAnswer: "討論",
        explanation: "Kunci Jawaban: ② b"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “mengkaji atau menyelidiki suatu hal secara mendalam”?",
        options: JSON.stringify(["討究", "討伐", "討論"]),
        correctAnswer: "討究",
        explanation: "Kunci Jawaban: ③ a"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “mempertimbangkan atau meninjau sesuatu sebelum mengambil keputusan”?",
        options: JSON.stringify(["討究", "検討", "討議"]),
        correctAnswer: "検討",
        explanation: "Kunci Jawaban: ④ b"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “menyerang dan menumpas musuh atau kelompok tertentu”?",
        options: JSON.stringify(["討論", "討伐", "検討"]),
        correctAnswer: "討伐",
        explanation: "Kunci Jawaban: ⑤ b"
      },

      // 5 Fill-in-the-blank (Section d)
      {
        type: "fill",
        question: "この問題について、学生たちは（　　　）をしています。",
        options: JSON.stringify(["討議", "討伐", "討究"]),
        correctAnswer: "討議",
        explanation: "Kunci Jawaban: ① a"
      },
      {
        type: "fill",
        question: "みんなでよく（　　　）してから、答えを決めましょう。",
        options: JSON.stringify(["討論", "討伐", "検討"]),
        correctAnswer: "検討",
        explanation: "Kunci Jawaban: ② c"
      },
      {
        type: "fill",
        question: "この計画をもう一度（　　　）したほうがいいでしょう。",
        options: JSON.stringify(["討論", "討伐", "検討"]),
        correctAnswer: "検討",
        explanation: "Kunci Jawaban: ③ c"
      },
      {
        type: "fill",
        question: "昔の軍隊が敵を（　　　）しました。",
        options: JSON.stringify(["討論", "討伐", "討議"]),
        correctAnswer: "討伐",
        explanation: "Kunci Jawaban: ④ b"
      },
      {
        type: "fill",
        question: "この問題について（　　　）したあとで、結論を出しましょう。",
        options: JSON.stringify(["検討", "討伐", "討議"]),
        correctAnswer: "討議",
        explanation: "Kunci Jawaban: ⑤ c"
      },

      // 1 Grouping
      {
        type: "grouping",
        question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
        groups: JSON.stringify([
          { name: "Membahas / Berdiskusi", correctWords: ["討議", "討論"] },
          { name: "Menyelidiki / Mengkaji", correctWords: ["討究", "検討"] },
          { name: "Menyerang / Menumpas", correctWords: ["討伐"] }
        ]),
        explanation: "Kelompokkan jukugo kanji 討 ke dalam 3 kategori makna yang tepat."
      }
    ]
  },

  // =============================================================
  // 4. KANJI 談 (ID: 3238)
  // =============================================================
  {
    id: 3238,
    character: "談",
    romaji: "DAN",
    meaning: "Berbicara, Percakapan, Diskusi",
    baseMeaning: "berbicara, bercakap-cakap, membicarakan.",
    bushuu: "言",
    onyomi: "ダン",
    kunyomi: "-",
    categories: [
      {
        name: "1. Bentuk / Cara Pembicaraan",
        jukugos: [
          {
            word: "会談",
            reading: "かいだん",
            meaning: "berunding",
            unsur: [
              { jokugo: "会", arti: "bertemu, berkumpul" },
              { jokugo: "談", arti: "berbicara, membicarakan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 会 dan 談 menjadi 会談, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pembicaraan atau perundingan yang dilakukan melalui suatu pertemuan.”"
          },
          {
            word: "対談",
            reading: "たいだん",
            meaning: "dialog",
            unsur: [
              { jokugo: "対", arti: "berhadapan, berpasangan" },
              { jokugo: "談", arti: "berbicara, bercakap-cakap" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 対 dan 談 menjadi 対談, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “dialog atau pembicaraan antar dua pihak.”"
          },
          {
            word: "座談",
            reading: "ざだん",
            meaning: "percakapan bersama",
            unsur: [
              { jokugo: "座", arti: "duduk" },
              { jokugo: "談", arti: "berbicara, bercakap-cakap" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 座 dan 談 menjadi 座談, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “percakapan bersama dalam suasana duduk dan berbincang.”"
          },
          {
            word: "面談",
            reading: "めんだん",
            meaning: "tatap muka",
            unsur: [
              { jokugo: "面", arti: "wajah, permukaan" },
              { jokugo: "談", arti: "berbicara, membicarakan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 面 dan 談 menjadi 面談, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pembicaraan secara tatap muka.”"
          },
          {
            word: "直談",
            reading: "じきだん",
            meaning: "langsung",
            unsur: [
              { jokugo: "直", arti: "langsung, lurus" },
              { jokugo: "談", arti: "berbicara, membicarakan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 直 dan 談 menjadi 直談, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pembicaraan yang dilakukan secara langsung.”"
          }
        ]
      },
      {
        name: "2. Tujuan / Kegiatan Pembicaraan",
        jukugos: [
          {
            word: "相談",
            reading: "そうだん",
            meaning: "konsultasi",
            unsur: [
              { jokugo: "相", arti: "bersama, saling" },
              { jokugo: "談", arti: "berbicara, membicarakan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 相 dan 談 menjadi 相談, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “konsultasi atau pembicaraan untuk meminta pendapat.”"
          },
          {
            word: "談合",
            reading: "だんごう",
            meaning: "musyawarah",
            unsur: [
              { jokugo: "談", arti: "berbicara, membicarakan" },
              { jokugo: "合", arti: "bergabung, menyatukan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 談 dan 合 menjadi 談合, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “musyawarah atau pembicaraan untuk mencapai kesepakatan.”"
          },
          {
            word: "用談",
            reading: "ようだん",
            meaning: "urusan",
            unsur: [
              { jokugo: "用", arti: "urusan, keperluan" },
              { jokugo: "談", arti: "berbicara, membicarakan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 用 dan 談 menjadi 用談, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pembicaraan mengenai suatu urusan atau keperluan.”"
          },
          {
            word: "商談",
            reading: "しょうだん",
            meaning: "negosiasi bisnis",
            unsur: [
              { jokugo: "商", arti: "perdagangan, bisnis" },
              { jokugo: "談", arti: "berbicara, membicarakan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 商 dan 談 menjadi 商談, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pembicaraan atau negosiasi mengenai bisnis.”"
          }
        ]
      },
      {
        name: "3. Suasana / Sifat Pembicaraan",
        jukugos: [
          {
            word: "雑談",
            reading: "ざつだん",
            meaning: "santai",
            unsur: [
              { jokugo: "雑", arti: "beragam, campur" },
              { jokugo: "談", arti: "berbicara, bercakap-cakap" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 雑 dan 談 menjadi 雑談, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pembicaraan santai mengenai berbagai hal.”"
          },
          {
            word: "談話",
            reading: "だんわ",
            meaning: "pembicaraan",
            unsur: [
              { jokugo: "談", arti: "berbicara, membicarakan" },
              { jokugo: "話", arti: "berbicara, cerita" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 談 dan 話 menjadi 談話, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pembicaraan atau percakapan.”"
          },
          {
            word: "談笑",
            reading: "だんしょう",
            meaning: "bersenda gurau",
            unsur: [
              { jokugo: "談", arti: "berbicara, bercakap-cakap" },
              { jokugo: "笑", arti: "tertawa, tersenyum" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 談 dan 笑 menjadi 談笑, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “berbincang dalam suasana menyenangkan dan penuh tawa.”"
          },
          {
            word: "冗談",
            reading: "じょうだん",
            meaning: "gurauan",
            unsur: [
              { jokugo: "冗", arti: "berlebihan, tidak serius" },
              { jokugo: "談", arti: "berbicara, bercakap-cakap" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 冗 dan 談 menjadi 冗談, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pembicaraan yang tidak serius atau berupa gurauan.”"
          }
        ]
      }
    ],
    quizzes: [
      // 5 Unscramble
      {
        type: "unscramble",
        question: "Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.",
        words: JSON.stringify(["参加するのは", "座談会に", "楽しいです"]),
        correctOrder: JSON.stringify(["座談会に", "参加するのは", "楽しいです"]),
        correctAnswer: "0",
        explanation: "Jawaban: 座談会に参加するのは楽しいです。"
      },
      {
        type: "unscramble",
        question: "Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.",
        words: JSON.stringify(["用談", "あるかもしれません", "急な", "が"]),
        correctOrder: JSON.stringify(["急な", "用談", "が", "あるかもしれません"]),
        correctAnswer: "0",
        explanation: "Jawaban: 急な用談があるかもしれません。"
      },
      {
        type: "unscramble",
        question: "Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.",
        words: JSON.stringify(["発表されました", "で", "談話が", "ニュース"]),
        correctOrder: JSON.stringify(["ニュース", "で", "談話が", "発表されました"]),
        correctAnswer: "0",
        explanation: "Jawaban: ニュースで談話が発表されました。"
      },
      {
        type: "unscramble",
        question: "Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.",
        words: JSON.stringify(["談笑できるように", "話します", "楽しく"]),
        correctOrder: JSON.stringify(["談笑できるように", "楽しく", "話します"]),
        correctAnswer: "0",
        explanation: "Jawaban: 談笑できるように、楽しくはなします。"
      },
      {
        type: "unscramble",
        question: "Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.",
        words: JSON.stringify(["談合しない", "いいです", "ほうが", "みんなで"]),
        correctOrder: JSON.stringify(["みんなで", "談合しない", "ほうが", "いいです"]),
        correctAnswer: "0",
        explanation: "Jawaban: みんなで談合しない方がいいです。"
      },

      // 5 Multiple Choice (Section c)
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “pertemuan untuk berbicara atau berunding mengenai suatu hal”?",
        options: JSON.stringify(["会談", "談笑", "冗談"]),
        correctAnswer: "会談",
        explanation: "Kunci Jawaban: ① a"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “percakapan atau dialog antar dua orang atau pihak”?",
        options: JSON.stringify(["対談", "直談", "談話"]),
        correctAnswer: "対談",
        explanation: "Kunci Jawaban: ② a"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “percakapan santai bersama”?",
        options: JSON.stringify(["座談", "商談", "面談"]),
        correctAnswer: "座談",
        explanation: "Kunci Jawaban: ③ a"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “berbicara atau bertemu secara langsung”?",
        options: JSON.stringify(["相談", "直談", "雑談"]),
        correctAnswer: "直談",
        explanation: "Kunci Jawaban: ④ b"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “berkonsultasi atau meminta pendapat seseorang mengenai suatu masalah”?",
        options: JSON.stringify(["用談", "相談", "談笑"]),
        correctAnswer: "相談",
        explanation: "Kunci Jawaban: ⑤ b"
      },

      // 5 Fill-in-the-blank (Section d)
      {
        type: "fill",
        question: "来週、日本とアメリカの代表が（　　　）を行う予定です。",
        options: JSON.stringify(["会談", "面談", "雑談"]),
        correctAnswer: "会談",
        explanation: "Kunci Jawaban: ① a"
      },
      {
        type: "fill",
        question: "二人の作家がテレビで（　　　）をしています。",
        options: JSON.stringify(["対談", "相談", "商談"]),
        correctAnswer: "対談",
        explanation: "Kunci Jawaban: ② a"
      },
      {
        type: "fill",
        question: "先生と学生が一対一で（　　　）することになりました。",
        options: JSON.stringify(["会談", "雑談", "面談"]),
        correctAnswer: "面談",
        explanation: "Kunci Jawaban: ③ c"
      },
      {
        type: "fill",
        question: "会社の人と新しい商品について（　　　）をしました。",
        options: JSON.stringify(["会談", "商談", "雑談"]),
        correctAnswer: "商談",
        explanation: "Kunci Jawaban: ④ b"
      },
      {
        type: "fill",
        question: "休み時間に友達と（　　　）するのは楽しいです。",
        options: JSON.stringify(["雑談", "面談", "商談"]),
        correctAnswer: "雑談",
        explanation: "Kunci Jawaban: ⑤ a"
      },

      // 1 Grouping
      {
        type: "grouping",
        question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
        groups: JSON.stringify([
          { name: "Bentuk / Cara Pembicaraan", correctWords: ["会談", "対談", "座談", "面談", "直談"] },
          { name: "Tujuan / Kegiatan Pembicaraan", correctWords: ["相談", "談合", "用談", "商談"] },
          { name: "Suasana / Sifat Pembicaraan", correctWords: ["雑談", "談話", "談笑", "冗談"] }
        ]),
        explanation: "Kelompokkan jukugo kanji 談 ke dalam 3 kategori makna yang tepat."
      }
    ]
  },

  // =============================================================
  // 5. KANJI 意 (ID: 3241)
  // =============================================================
  {
    id: 3241,
    character: "意",
    romaji: "I",
    meaning: "Pikiran, Perasaan, Maksud",
    baseMeaning: "pikiran, perasaan, kehendak, atau maksud.",
    bushuu: "心",
    onyomi: "イ",
    kunyomi: "-",
    categories: [
      {
        name: "1. Pikiran / Makna",
        jukugos: [
          {
            word: "意味",
            reading: "いみ",
            meaning: "makna / arti",
            unsur: [
              { jokugo: "意", arti: "pikiran, maksud" },
              { jokugo: "味", arti: "rasa, makna" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 意 dan 味 menjadi 意味, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “makna atau arti yang terkandung dalam suatu kata, ungkapan, atau hal.”"
          },
          {
            word: "意見",
            reading: "いけん",
            meaning: "pendapat",
            unsur: [
              { jokugo: "意", arti: "pikiran, maksud" },
              { jokugo: "見", arti: "melihat, pandangan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 意 dan 見 menjadi 意見, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pendapat atau pandangan seseorang terhadap suatu hal.”"
          }
        ]
      },
      {
        name: "2. Kehendak / Maksud",
        jukugos: [
          {
            word: "意思",
            reading: "いし",
            meaning: "kehendak",
            unsur: [
              { jokugo: "意", arti: "pikiran, kehendak" },
              { jokugo: "思", arti: "berpikir, perasaan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 意 dan 思 menjadi 意思, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kehendak atau maksud yang ada dalam pikiran seseorang.”"
          },
          {
            word: "意志",
            reading: "いし",
            meaning: "tekad",
            unsur: [
              { jokugo: "意", arti: "kehendak, maksud" },
              { jokugo: "志", arti: "tekad, cita-cita" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 意 dan 志 menjadi 意志, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kehendak atau tekad yang kuat untuk mencapai atau melakukan sesuatu.”"
          },
          {
            word: "意向",
            reading: "いこう",
            meaning: "maksud",
            unsur: [
              { jokugo: "意", arti: "maksud, kehendak" },
              { jokugo: "向", arti: "arah, mengarah" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 意 dan 向 menjadi 意向, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “maksud, kehendak, atau arah yang ingin dituju seseorang atau suatu pihak.”"
          },
          {
            word: "意図",
            reading: "いと",
            meaning: "niat",
            unsur: [
              { jokugo: "意", arti: "maksud, kehendak" },
              { jokugo: "図", arti: "rencana, maksud" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 意 dan 図 menjadi 意図, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “niat atau maksud yang direncanakan untuk melakukan sesuatu.”"
          },
          {
            word: "決意",
            reading: "けつい",
            meaning: "tekad",
            unsur: [
              { jokugo: "決", arti: "memutuskan, menetapkan" },
              { jokugo: "意", arti: "kehendak, maksud" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 決 dan 意 menjadi 決意, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tekad atau keputusan hati yang kuat untuk melakukan sesuatu.”"
          },
          {
            word: "意欲",
            reading: "いよく",
            meaning: "kemauan",
            unsur: [
              { jokugo: "意", arti: "kehendak, maksud" },
              { jokugo: "欲", arti: "keinginan, hasrat" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 意 dan 欲 menjadi 意欲, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kemauan atau dorongan yang kuat untuk melakukan atau mencapai sesuatu.”"
          }
        ]
      },
      {
        name: "3. Kesadaran / Perhatian",
        jukugos: [
          {
            word: "意識",
            reading: "いしき",
            meaning: "kesadaran",
            unsur: [
              { jokugo: "意", arti: "pikiran, kesadaran" },
              { jokugo: "識", arti: "mengetahui, mengenali" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 意 dan 識 menjadi 意識, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kesadaran atau keadaan menyadari dan mengenali sesuatu dalam pikiran.”"
          },
          {
            word: "注意",
            reading: "ちゅうい",
            meaning: "perhatian",
            unsur: [
              { jokugo: "注", arti: "memusatkan, mencurahkan" },
              { jokugo: "意", arti: "pikiran, perhatian" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 注 dan 意 menjadi 注意, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perhatian yang dipusatkan pada sesuatu agar tidak terjadi kesalahan atau masalah.”"
          }
        ]
      },
      {
        name: "4. Persetujuan / Sikap",
        jukugos: [
          {
            word: "同意",
            reading: "どうい",
            meaning: "persetujuan",
            unsur: [
              { jokugo: "同", arti: "sama, bersama" },
              { jokugo: "意", arti: "pikiran, pendapat" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 同 dan 意 menjadi 同意, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “persetujuan atau keadaan memiliki pendapat yang sama terhadap suatu hal.”"
          },
          {
            word: "合意",
            reading: "ごうい",
            meaning: "kesepakatan",
            unsur: [
              { jokugo: "合", arti: "bergabung, sesuai" },
              { jokugo: "意", arti: "pendapat, kehendak" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 合 dan 意 menjadi 合意, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kesepakatan yang dicapai ketika pihak-pihak yang terlibat memiliki kehendak atau pendapat yang sama.”"
          },
          {
            word: "好意",
            reading: "こうい",
            meaning: "niat baik",
            unsur: [
              { jokugo: "好", arti: "suka, baik" },
              { jokugo: "意", arti: "perasaan, maksud" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 好 dan 意 menjadi 好意, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perasaan baik atau niat baik yang ditujukan kepada orang lain.”"
          },
          {
            word: "悪意",
            reading: "あくい",
            meaning: "niat buruk",
            unsur: [
              { jokugo: "悪", arti: "buruk, jahat" },
              { jokugo: "意", arti: "maksud, niat" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 悪 dan 意 menjadi 悪意, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “niat buruk atau maksud yang tidak baik terhadap orang lain.”"
          }
        ]
      },
      {
        name: "5. Tujuan / Persiapan",
        jukugos: [
          {
            word: "用意",
            reading: "ようい",
            meaning: "persiapan",
            unsur: [
              { jokugo: "用", arti: "menggunakan, keperluan" },
              { jokugo: "意", arti: "pikiran, maksud" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 用 dan 意 menjadi 用意, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “persiapan atau tindakan menyediakan sesuatu yang diperlukan sebelum melakukan suatu kegiatan.”"
          }
        ]
      }
    ],
    quizzes: [
      // 5 Unscramble
      {
        type: "unscramble",
        question: "Susunlah kalimat dari kata-kata berikut.",
        words: JSON.stringify(["意向が", "書いてあります", "書類に"]),
        correctOrder: JSON.stringify(["書類に", "意向が", "書いてあります"]),
        correctAnswer: "0",
        explanation: "Jawaban: 書類に意向が書いてあります。"
      },
      {
        type: "unscramble",
        question: "Susunlah kalimat dari kata-kata berikut.",
        words: JSON.stringify(["意図を", "理解するのを", "相手の", "忘れました"]),
        correctOrder: JSON.stringify(["相手の", "意図を", "理解するのを", "忘れました"]),
        correctAnswer: "0",
        explanation: "Jawaban: 相手の意図を理解するのを忘れました。"
      },
      {
        type: "unscramble",
        question: "Susunlah kalimat dari kata-kata berikut.",
        words: JSON.stringify(["決意しようと", "留学を", "思っています"]),
        correctOrder: JSON.stringify(["留学を", "決意しようと", "思っています"]),
        correctAnswer: "0",
        explanation: "Jawaban: 留学を決意しようと思っています。"
      },
      {
        type: "unscramble",
        question: "Susunlah kalimat dari kata-kata berikut.",
        words: JSON.stringify(["出るでしょう", "意欲を", "勉強の"]),
        correctOrder: JSON.stringify(["勉強の", "意欲を", "出るでしょう"]),
        correctAnswer: "0",
        explanation: "Jawaban: 勉強の意欲を出るでしょう。"
      },
      {
        type: "unscramble",
        question: "Susunlah kalimat dari kata-kata berikut.",
        words: JSON.stringify(["あるかもしれません", "言葉に", "悪意が"]),
        correctOrder: JSON.stringify(["言葉に", "悪意が", "あるかもしれません"]),
        correctAnswer: "0",
        explanation: "Jawaban: 言葉に悪意があるかもしれません。"
      },

      // 5 Multiple Choice (Section c)
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “makna atau arti dari sesuatu”?",
        options: JSON.stringify(["意味", "意見", "意識"]),
        correctAnswer: "意味",
        explanation: "Kunci Jawaban: ① a"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “pendapat atau pandangan seseorang mengenai suatu hal”?",
        options: JSON.stringify(["意思", "意見", "意図"]),
        correctAnswer: "意見",
        explanation: "Kunci Jawaban: ② b"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “kehendak atau kemauan seseorang untuk melakukan sesuatu”?",
        options: JSON.stringify(["意思", "注意", "同意"]),
        correctAnswer: "意思",
        explanation: "Kunci Jawaban: ③ a"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “maksud atau tujuan yang ingin dicapai atau dilakukan seseorang”?",
        options: JSON.stringify(["意識", "意図", "好意"]),
        correctAnswer: "意図",
        explanation: "Kunci Jawaban: ④ b"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “kesadaran terhadap sesuatu”?",
        options: JSON.stringify(["意識", "意志", "意向"]),
        correctAnswer: "意識",
        explanation: "Kunci Jawaban: ⑤ a"
      },

      // 5 Fill-in-the-blank (Section d)
      {
        type: "fill",
        question: "この言葉の（　　　）がよくわかりません。",
        options: JSON.stringify(["意味", "意識", "同意"]),
        correctAnswer: "意味",
        explanation: "Kunci Jawaban: ① a"
      },
      {
        type: "fill",
        question: "私はその考えについて、自分の（　　　）を言いました。",
        options: JSON.stringify(["意図", "意識", "意見"]),
        correctAnswer: "意見",
        explanation: "Kunci Jawaban: ② c"
      },
      {
        type: "fill",
        question: "将来、日本で働きたいという（　　　）を持っています。",
        options: JSON.stringify(["同意", "意志", "意見"]),
        correctAnswer: "意志",
        explanation: "Kunci Jawaban: ③ b"
      },
      {
        type: "fill",
        question: "先生が何を伝えたいのか、その（　　　）を考えてください。",
        options: JSON.stringify(["意識", "意見", "意図"]),
        correctAnswer: "意図",
        explanation: "Kunci Jawaban: ④ c"
      },
      {
        type: "fill",
        question: "みんながその計画に（　　　）したので、来月から始めます。",
        options: JSON.stringify(["同意", "意識", "意味"]),
        correctAnswer: "同意",
        explanation: "Kunci Jawaban: ⑤ a"
      },

      // 1 Grouping
      {
        type: "grouping",
        question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
        groups: JSON.stringify([
          { name: "Pikiran / Makna", correctWords: ["意味", "意見"] },
          { name: "Kehendak / Maksud", correctWords: ["意思", "意志", "意向", "意図", "決意", "意欲"] },
          { name: "Kesadaran / Perhatian", correctWords: ["意識", "注意"] },
          { name: "Persetujuan / Sikap", correctWords: ["同意", "合意", "好意", "悪意"] },
          { name: "Tujuan / Persiapan", correctWords: ["用意"] }
        ]),
        explanation: "Kelompokkan jukugo kanji 意 ke dalam 5 kategori makna yang tepat."
      }
    ]
  }
];

async function main() {
  console.log("=== MEMULAI SINKRONISASI MODUL 5 STRICT (100% VERBATIM) ===");

  // Pastikan Modul 5 (ID 559) terdaftar
  let module5 = await prisma.module.findUnique({
    where: { id: 559 }
  });
  if (!module5) {
    module5 = await prisma.module.create({
      data: {
        id: 559,
        title: "Modul 5: Diskusi, Pemikiran & Musyawarah",
        tujuanPembelajaran:
          "Menguasai kanji-kanji yang berkaitan dengan rapat, perdebatan, kajian pemikiran, percakapan, dan kehendak/pikiran."
      }
    });
    console.log("✓ Module 5 (ID 559) berhasil dibuat.");
  }

  for (const kd of MODUL_5_DATA) {
    console.log(`\nProcessing Kanji ${kd.character} (ID: ${kd.id})...`);

    // 1. Update metadata Kanji & pastikan moduleId: 559
    await prisma.kanji.upsert({
      where: { id: kd.id },
      update: {
        character: kd.character,
        romaji: kd.romaji,
        meaning: kd.meaning,
        baseMeaning: kd.baseMeaning,
        bushuu: kd.bushuu,
        onyomi: kd.onyomi,
        kunyomi: kd.kunyomi,
        moduleId: 559,
        isJukugo: false
      },
      create: {
        id: kd.id,
        character: kd.character,
        romaji: kd.romaji,
        meaning: kd.meaning,
        baseMeaning: kd.baseMeaning,
        bushuu: kd.bushuu,
        onyomi: kd.onyomi,
        kunyomi: kd.kunyomi,
        moduleId: 559,
        isJukugo: false
      }
    });

    // 2. Bersihkan refleksi lama & buat MasterRefleksi yang rapi
    await prisma.refleksiData.deleteMany({
      where: { kanjiId: kd.id }
    });
    await prisma.masterRefleksi.deleteMany({
      where: { kanjiId: kd.id }
    });

    const refleksiQuestions = [
      `Apa arti dasar dari kanji ${kd.character} dan bagaimana konsep tersebut tercermin dalam kosakata turunannya?`,
      `Bagaimana hubungan makna antara kanji ${kd.character} dengan kanji pembentuk lainnya dalam membentuk jukugo baru?`,
      `Kelompok makna apa saja yang dibentuk oleh kanji ${kd.character} dan bagaimana pengelompokan tersebut membantu Anda memahami kosakatanya?`,
      `Bagaimana perbedaan nuansa penggunaan jukugo dari kanji ${kd.character} dalam konteks kalimat nyata?`,
      `Strategi apa yang paling efektif bagi Anda untuk mengingat cara baca On/Kun dan makna kanji ${kd.character}?`
    ];

    for (const q of refleksiQuestions) {
      await prisma.masterRefleksi.create({
        data: {
          kanjiId: kd.id,
          question: q
        }
      });
    }

    // 3. Bersihkan Quizzes lama
    await prisma.quiz.deleteMany({
      where: { kanjiId: kd.id }
    });

    // 4. Bersihkan graphEdges lama (agar diagram hierarki murni bersih sesuai gambar)
    await prisma.kanjiGraphEdge.deleteMany({
      where: { kanjiId: kd.id }
    });

    // 5. Bersihkan KategoriKanji, SemanticRelation & SemanticRelationNode, dan Jukugo lama
    const existingJukugos = await prisma.jukugo.findMany({
      where: { kanjiId: kd.id },
      select: { id: true }
    });
    const existingJukugoIds = existingJukugos.map((j) => j.id);
    if (existingJukugoIds.length > 0) {
      await prisma.kategoriKanji.deleteMany({
        where: { jokugoId: { in: existingJukugoIds } }
      });
    }

    const existingSRs = await prisma.semanticRelation.findMany({
      where: { kanjiId: kd.id },
      select: { id: true }
    });
    const existingSRIds = existingSRs.map((sr) => sr.id);
    if (existingSRIds.length > 0) {
      await prisma.semanticRelationNode.deleteMany({
        where: { semanticId: { in: existingSRIds } }
      });
      await prisma.semanticRelation.deleteMany({
        where: { id: { in: existingSRIds } }
      });
    }

    await prisma.jukugo.deleteMany({
      where: { kanjiId: kd.id }
    });

    // 6. Insert MasterCategory, Jukugo, KategoriKanji, SemanticRelation, SemanticRelationNode
    for (const cat of kd.categories) {
      const masterCat = await prisma.masterCategory.upsert({
        where: { name: cat.name },
        update: {},
        create: {
          name: cat.name,
          description: `Kategori ${cat.name} untuk kanji ${kd.character}`
        }
      });

      for (const jk of cat.jukugos) {
        const createdJukugo = await prisma.jukugo.create({
          data: {
            kanjiId: kd.id,
            word: jk.word,
            reading: jk.reading,
            meaning: jk.meaning
          }
        });

        await prisma.kategoriKanji.create({
          data: {
            categoryId: masterCat.id,
            jokugoId: createdJukugo.id
          }
        });

        const createdSR = await prisma.semanticRelation.create({
          data: {
            kanjiId: kd.id,
            jukugoId: createdJukugo.id,
            penjelasan: jk.penjelasan
          }
        });

        for (const un of jk.unsur) {
          await prisma.semanticRelationNode.create({
            data: {
              semanticId: createdSR.id,
              jokugo: un.jokugo,
              arti: un.arti
            }
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
          explanation: q.explanation
        }
      });
    }

    const totalJukugos = kd.categories.reduce((acc, c) => acc + c.jukugos.length, 0);
    console.log(
      `✓ Kanji ${kd.character}: ${totalJukugos} Jukugo across ${kd.categories.length} categories, ${kd.quizzes.length} quizzes tersimpan rapi.`
    );
  }

  console.log("\n=== SINKRONISASI MODUL 5 SUKSES 100% ===");
}

main()
  .catch((e) => {
    console.error("Error saat sinkronisasi Modul 5:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
