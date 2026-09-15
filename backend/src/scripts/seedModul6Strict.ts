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

// -------------------------------------------------------------
// CONSTITUENT KANJIS TO UPSERT (moduleId: null)
// -------------------------------------------------------------
const CONSTITUENTS_TO_ENSURE = [
  {
    character: "年",
    romaji: "NEN / toshi",
    meaning: "tahun",
    bushuu: "干",
    onyomi: "ネン",
    kunyomi: "とし",
    baseMeaning: "tahun"
  },
  {
    character: "月",
    romaji: "GETSU / GATSU / tsuki",
    meaning: "bulan",
    bushuu: "月",
    onyomi: "ゲツ、ガツ",
    kunyomi: "つき",
    baseMeaning: "bulan"
  },
  {
    character: "程",
    romaji: "TEI / hodo",
    meaning: "proses / tingkat / batasan",
    bushuu: "禾",
    onyomi: "テイ",
    kunyomi: "ほど",
    baseMeaning: "proses, batasan, perjalanan"
  }
];

const MODUL_6_DATA: KanjiData[] = [
  // =============================================================
  // 1. KANJI 経 (ID: 3242)
  // =============================================================
  {
    id: 3242,
    character: "経",
    romaji: "KEI",
    meaning: "Melewati, Melalui, Mengelola, Mengatur",
    baseMeaning: "melewati, melalui, mengelola, mengatur.",
    bushuu: "糸",
    onyomi: "ケイ",
    kunyomi: "へ・る",
    categories: [
      {
        name: "1. Pengalaman / Perjalanan Waktu",
        jukugos: [
          {
            word: "経験",
            reading: "けいけん",
            meaning: "pengalaman",
            unsur: [
              { jokugo: "経", arti: "melalui, menjalani" },
              { jokugo: "験", arti: "pengalaman, ujian" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 経 dan 験 menjadi 経験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengalaman yang diperoleh melalui sesuatu yang telah dijalani.”"
          },
          {
            word: "経過",
            reading: "けいか",
            meaning: "proses",
            unsur: [
              { jokugo: "経", arti: "melalui, melewati" },
              { jokugo: "過", arti: "melewati, berlalu" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 経 dan 過 menjadi 経過, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “proses atau keadaan yang berlangsung dan telah melewati suatu rentang waktu.”"
          },
          {
            word: "経歴",
            reading: "けいれき",
            meaning: "riwayat",
            unsur: [
              { jokugo: "経", arti: "melalui, menjalani" },
              { jokugo: "歴", arti: "riwayat, perjalanan yang telah dilalui" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 経 dan 歴 menjadi 経歴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “riwayat atau perjalanan hidup dan karier yang telah dilalui.”"
          }
        ]
      },
      {
        name: "2. Jalur / Cara Melalui",
        jukugos: [
          {
            word: "経由",
            reading: "けいゆ",
            meaning: "melalui",
            unsur: [
              { jokugo: "経", arti: "melalui" },
              { jokugo: "由", arti: "asal, melalui" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 経 dan 由 menjadi 経由, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “melalui suatu tempat, jalur, atau perantara.”"
          },
          {
            word: "経口",
            reading: "けいこう",
            meaning: "oral",
            unsur: [
              { jokugo: "経", arti: "melalui" },
              { jokugo: "口", arti: "mulut" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 経 dan 口 menjadi 経口, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “melalui mulut atau dilakukan secara oral.”"
          }
        ]
      },
      {
        name: "3. Ekonomi / Pengelolaan",
        jukugos: [
          {
            word: "経済",
            reading: "けいざい",
            meaning: "ekonomi",
            unsur: [
              { jokugo: "経", arti: "mengatur, mengelola" },
              { jokugo: "済", arti: "menyelesaikan, mengatur" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 経 dan 済 menjadi 経済, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan mengelola dan mengatur kehidupan atau sumber daya ekonomi.”"
          },
          {
            word: "経営",
            reading: "けいえい",
            meaning: "manajemen",
            unsur: [
              { jokugo: "経", arti: "mengelola, mengatur" },
              { jokugo: "営", arti: "menjalankan, mengusahakan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 経 dan 営 menjadi 経営, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan mengelola dan menjalankan suatu usaha atau organisasi.”"
          },
          {
            word: "経費",
            reading: "けいひ",
            meaning: "biaya",
            unsur: [
              { jokugo: "経", arti: "urusan, pengelolaan" },
              { jokugo: "費", arti: "biaya, pengeluaran" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 経 dan 費 menjadi 経費, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “biaya yang dikeluarkan untuk menjalankan suatu kegiatan atau keperluan.”"
          },
          {
            word: "経理",
            reading: "けいり",
            meaning: "akuntansi",
            unsur: [
              { jokugo: "経", arti: "mengatur, mengelola" },
              { jokugo: "理", arti: "mengatur, menata" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 経 dan 理 menjadi 経理, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan mengatur dan mengelola urusan keuangan, khususnya pencatatan keuangan.”"
          },
          {
            word: "経常",
            reading: "けいじょう",
            meaning: "rutin",
            unsur: [
              { jokugo: "経", arti: "berlangsung, berjalan" },
              { jokugo: "常", arti: "selalu, biasa" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 経 dan 常 menjadi 経常, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sesuatu yang berlangsung secara rutin atau terus-menerus.”"
          }
        ]
      }
    ],
    quizzes: [
      // 5 Unscramble
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["経口で", "方が", "薬を", "飲んだ", "いいです"]),
        correctOrder: JSON.stringify(["経口で", "薬を", "飲んだ", "方が", "いいです"]),
        explanation: "Jawaban: 口で薬を飲んだ方がいいです。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["経験するのは", "楽しい", "海外で", "です"]),
        correctOrder: JSON.stringify(["海外で", "経験するのは", "楽しい", "です"]),
        explanation: "Jawaban: 海外で経験するのは楽しいです。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["経済が", "なるかもしれません", "来年", "よく"]),
        correctOrder: JSON.stringify(["来年", "経済が", "よく", "なるかもしれません"]),
        explanation: "Jawaban: 来年経済がよくなるかもしれません。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["経営しようと", "自分の", "思っています", "会社を"]),
        correctOrder: JSON.stringify(["自分の", "会社を", "経営しようと", "思っています"]),
        explanation: "Jawaban: 自分の会社を経営しようと思っています。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["経費を", "安くなるでしょう", "へらせば"]),
        correctOrder: JSON.stringify(["経費を", "へらせば", "安くなるでしょう"]),
        explanation: "Jawaban: 経費をへらせば、安くなるでしょう。"
      },
      // 1 Grouping
      {
        type: "grouping",
        question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
        words: JSON.stringify([
          "経験", "経過", "経歴",
          "経由", "経口",
          "経済", "経営", "経費", "経理", "経常"
        ]),
        groups: JSON.stringify([
          {
            name: "1. Pengalaman / Perjalanan Waktu",
            correctWords: ["経験", "経過", "経歴"]
          },
          {
            name: "2. Jalur / Cara Melalui",
            correctWords: ["経由", "経口"]
          },
          {
            name: "3. Ekonomi / Pengelolaan",
            correctWords: ["経済", "経営", "経費", "経理", "経常"]
          }
        ]),
        explanation: "Pengelompokan jukugo berdasarkan cabang semantic graph kanji 経."
      },
      // 5 Multiple Choice (Section c)
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “pengalaman yang diperoleh melalui sesuatu yang telah dijalani”?",
        options: JSON.stringify(["経過", "経歴", "経験"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 経験 (keiken) - pengalaman."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “proses atau keadaan yang berlangsung dan telah melewati suatu rentang waktu”?",
        options: JSON.stringify(["経費", "経過", "経由"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 経過 (keika) - proses."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “riwayat atau perjalanan hidup dan karier yang telah dilalui”?",
        options: JSON.stringify(["経歴", "経験", "経営"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 経歴 (keireki) - riwayat."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “melalui suatu tempat, jalur, atau perantar”?",
        options: JSON.stringify(["経口", "経常", "経由"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 経由 (keiyu) - melalui."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “melalui mulut atau dilakukan secara oral”?",
        options: JSON.stringify(["経理", "経口", "経由"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 経口 (keikou) - oral."
      },
      // 5 Fill in Blank (Section d)
      {
        type: "fill",
        question: "東京を（　　　）して大阪へ行く予定です。",
        options: JSON.stringify(["経営", "経由", "経験"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 経由 (keiyu)."
      },
      {
        type: "fill",
        question: "日本へ来て、いろいろなことを（　　　）しました。",
        options: JSON.stringify(["経済", "経験", "経理"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 経験 (keiken)."
      },
      {
        type: "fill",
        question: "会社を（　　　）するのは大変でしょう。",
        options: JSON.stringify(["経営", "経過", "経口"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 経営 (keiei)."
      },
      {
        type: "fill",
        question: "この薬は水といっしょに（　　　）で飲みます。",
        options: JSON.stringify(["経歴", "経口", "経費"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 経口 (keikou)."
      },
      {
        type: "fill",
        question: "旅行にかかった（　　　）が高かったので、来月は旅行しないつもりです。",
        options: JSON.stringify(["経費", "経常", "経由"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 経費 (keihi)."
      }
    ]
  },

  // =============================================================
  // 2. KANJI 始 (ID: 3569)
  // =============================================================
  {
    id: 3569,
    character: "始",
    romaji: "SHI",
    meaning: "Awal, Mulai",
    baseMeaning: "awal atau mulai.",
    bushuu: "女",
    onyomi: "シ",
    kunyomi: "はじ・める、はじ・まる",
    categories: [
      {
        name: "1. Awal Waktu",
        jukugos: [
          {
            word: "年始",
            reading: "ねんし",
            meaning: "awal tahun",
            unsur: [
              { jokugo: "年", arti: "tahun" },
              { jokugo: "始", arti: "awal, mulai" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 年 dan 始 menjadi 年始, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “awal suatu tahun.”"
          },
          {
            word: "年初",
            reading: "ねんしょ",
            meaning: "awal tahun",
            unsur: [
              { jokugo: "年", arti: "tahun" },
              { jokugo: "初", arti: "awal, mula" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 年 dan 初 menjadi 年初, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “awal atau permulaan suatu tahun.”"
          },
          {
            word: "月始",
            reading: "げっし",
            meaning: "awal bulan",
            unsur: [
              { jokugo: "月", arti: "bulan" },
              { jokugo: "始", arti: "awal, mulai" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 月 dan 始 menjadi 月始, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “awal suatu bulan.”"
          }
        ]
      },
      {
        name: "2. Mulai",
        jukugos: [
          {
            word: "開始",
            reading: "かいし",
            meaning: "mulai",
            unsur: [
              { jokugo: "開", arti: "membuka" },
              { jokugo: "始", arti: "mulai" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 開 dan 始 menjadi 開始, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memulai atau membuka dimulainya suatu kegiatan.”"
          },
          {
            word: "始業",
            reading: "しぎょう",
            meaning: "mulai bekerja",
            unsur: [
              { jokugo: "始", arti: "mulai" },
              { jokugo: "業", arti: "pekerjaan, kegiatan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 始 dan 業 menjadi 始業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mulainya suatu pekerjaan atau kegiatan.”"
          },
          {
            word: "始動",
            reading: "しどう",
            meaning: "mulai bergerak",
            unsur: [
              { jokugo: "始", arti: "mulai" },
              { jokugo: "動", arti: "bergerak" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 始 dan 動 menjadi 始動, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mulai bergerak atau mulai beroperasi.”"
          }
        ]
      },
      {
        name: "3. Awal–Akhir",
        jukugos: [
          {
            word: "終始",
            reading: "しゅうし",
            meaning: "dari awal sampai akhir",
            unsur: [
              { jokugo: "終", arti: "akhir" },
              { jokugo: "始", arti: "awal" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 終 dan 始 menjadi 終始, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keadaan yang berlangsung dari awal sampai akhir.”"
          },
          {
            word: "始終",
            reading: "しじゅう",
            meaning: "selalu",
            unsur: [
              { jokugo: "始", arti: "awal" },
              { jokugo: "終", arti: "akhir" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 始 dan 終 menjadi 始終, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sesuatu yang berlangsung terus dari awal sampai akhir, sehingga bermakna selalu.”"
          }
        ]
      },
      {
        name: "4. Penyelesaian",
        jukugos: [
          {
            word: "始末",
            reading: "しまつ",
            meaning: "penyelesaian",
            unsur: [
              { jokugo: "始", arti: "awal" },
              { jokugo: "末", arti: "akhir" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 始 dan 末 menjadi 始末, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menangani suatu urusan sampai selesai.”"
          }
        ]
      }
    ],
    quizzes: [
      // 5 Unscramble
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["書いてあります", "開始時間が", "ポスターに"]),
        correctOrder: JSON.stringify(["ポスターに", "開始時間が", "書いてあります"]),
        explanation: "Jawaban tepat: ポスターに開始時間が書いてあります。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["かもしれません", "変わる", "明日", "始業時間が"]),
        correctOrder: JSON.stringify(["明日", "始業時間が", "変わる", "かもしれません"]),
        explanation: "Jawaban tepat: 明日始業時間が変わるかもしれません。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["できるように", "準備します", "すぐに", "始動"]),
        correctOrder: JSON.stringify(["すぐに", "始動", "できるように", "準備します"]),
        explanation: "Jawaban tepat: すぐに始動できるように、準備します。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["年始に", "んです", "実家へ", "帰る"]),
        correctOrder: JSON.stringify(["年始に", "実家へ", "帰る", "んです"]),
        explanation: "Jawaban tepat: 年始に実家へ帰るんです。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["いいです", "書類を", "始末した", "早く", "ほうが"]),
        correctOrder: JSON.stringify(["早く", "書類を", "始末した", "ほうが", "いいです"]),
        explanation: "Jawaban tepat: 早く書類を始末したほうがいいです。"
      },
      // 1 Grouping
      {
        type: "grouping",
        question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
        words: JSON.stringify([
          "年始", "年初", "月始",
          "開始", "始業", "始動",
          "終始", "始終",
          "始末"
        ]),
        groups: JSON.stringify([
          {
            name: "1. Awal Waktu",
            correctWords: ["年始", "年初", "月始"]
          },
          {
            name: "2. Mulai",
            correctWords: ["開始", "始業", "始動"]
          },
          {
            name: "3. Awal–Akhir",
            correctWords: ["終始", "始終"]
          },
          {
            name: "4. Penyelesaian",
            correctWords: ["始末"]
          }
        ]),
        explanation: "Pengelompokan jukugo berdasarkan cabang semantic graph kanji 始."
      },
      // 5 Multiple Choice (Section c)
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “awal suatu tahun”?",
        options: JSON.stringify(["年末", "始業", "年始"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 年始 (nenshi)."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “memulai atau membuka dimulainya suatu kegiatan”?",
        options: JSON.stringify(["開始", "始動", "始業"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 開始 (kaishi)."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “mulainya suatu pekerjaan atau kegiatan”?",
        options: JSON.stringify(["開始", "始動", "始業"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 始業 (shigyou)."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “mulai bergerak atau mulai beroperasi”?",
        options: JSON.stringify(["始終", "始動", "開始"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 始動 (shidou)."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “keadaan yang berlangsung dari awal sampai akhir”?",
        options: JSON.stringify(["終始", "始終", "始末"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 始終 (atau 終始)."
      },
      // 5 Fill in Blank (Section d)
      {
        type: "fill",
        question: "新しい学期は4月から（　　　）します。",
        options: JSON.stringify(["開始", "始終", "始末"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 開始 (kaishi)."
      },
      {
        type: "fill",
        question: "仕事を（　　　）する前に、準備をしておいたほうがいいです。",
        options: JSON.stringify(["始業", "始動", "年始"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 始業 (shigyou)."
      },
      {
        type: "fill",
        question: "このはボタンを押すと、すぐに（　　　）します。",
        options: JSON.stringify(["始終", "始動", "始末"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 始動 (shidou)."
      },
      {
        type: "fill",
        question: "（　　　）には、家族にあいさつをするようにしています。",
        options: JSON.stringify(["始業", "開始", "年始"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 年始 (nenshi)."
      },
      {
        type: "fill",
        question: "朝から夜まで（　　　）忙しくて、休む時間がありませんでした。",
        options: JSON.stringify(["始終", "始動", "年始"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 始終 (shijuu)."
      }
    ]
  },

  // =============================================================
  // 3. KANJI 歴 (ID: 3244)
  // =============================================================
  {
    id: 3244,
    character: "歴",
    romaji: "REKI",
    meaning: "Urutan Peristiwa, Pengalaman, Riwayat",
    baseMeaning: "urutan peristiwa, pengalaman, atau perjalanan waktu yang telah dilalui secara berurutan.",
    bushuu: "厂",
    onyomi: "レキ",
    kunyomi: "-",
    categories: [
      {
        name: "1. Peristiwa",
        jukugos: [
          {
            word: "年表",
            reading: "ねんぴょう",
            meaning: "kronologi / tabel sejarah",
            unsur: [
              { jokugo: "年", arti: "tahun" },
              { jokugo: "表", arti: "tabel, kronologi" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 年 dan 表 menjadi 年表, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “daftar kronologis peristiwa bersejarah menurut urutan tahun.”"
          },
          {
            word: "歴史",
            reading: "れきし",
            meaning: "sejarah",
            unsur: [
              { jokugo: "歴", arti: "melewati, riwayat" },
              { jokugo: "史", arti: "sejarah, catatan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 歴 dan 史 menjadi 歴史, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sejarah atau catatan mengenai peristiwa yang telah berlangsung pada masa lalu.”"
          },
          {
            word: "戦歴",
            reading: "せんれき",
            meaning: "rekam jejak militer",
            unsur: [
              { jokugo: "戦", arti: "perang, pertempuran" },
              { jokugo: "歴", arti: "riwayat, jejak" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 戦 dan 歴 menjadi 戦歴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “rekam jejak atau riwayat pertempuran militer.”"
          },
          {
            word: "前歴",
            reading: "ぜんれき",
            meaning: "riwayat sebelumnya",
            unsur: [
              { jokugo: "前", arti: "sebelumnya" },
              { jokugo: "歴", arti: "riwayat" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 前 dan 歴 menjadi 前歴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “riwayat yang terjadi atau dimiliki sebelumnya.”"
          }
        ]
      },
      {
        name: "2. Pengalaman",
        jukugos: [
          {
            word: "経歴",
            reading: "けいれき",
            meaning: "riwayat hidup / pengalaman",
            unsur: [
              { jokugo: "経", arti: "melalui, menjalani" },
              { jokugo: "歴", arti: "riwayat, perjalanan yang telah dilalui" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 経 dan 歴 menjadi 経歴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “riwayat atau perjalanan hidup dan karier yang telah dilalui.”"
          },
          {
            word: "職歴",
            reading: "しょくれき",
            meaning: "riwayat pekerjaan",
            unsur: [
              { jokugo: "職", arti: "pekerjaan, jabatan" },
              { jokugo: "歴", arti: "riwayat, perjalanan yang telah dilalui" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 職 dan 歴 menjadi 職歴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “riwayat pekerjaan yang telah dijalani.”"
          },
          {
            word: "学歴",
            reading: "がくれき",
            meaning: "riwayat pendidikan",
            unsur: [
              { jokugo: "学", arti: "belajar, pendidikan" },
              { jokugo: "歴", arti: "riwayat, perjalanan yang telah dilalui" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 学 dan 歴 menjadi 学歴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “riwayat pendidikan yang telah ditempuh.”"
          },
          {
            word: "履歴",
            reading: "りれき",
            meaning: "riwayat / daftar riwayat",
            unsur: [
              { jokugo: "履", arti: "menginjak, menelusuri" },
              { jokugo: "歴", arti: "riwayat, pengalaman" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 履 dan 歴 menjadi 履歴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “daftar riwayat perjalanan atau catatan latar belakang seseorang.”"
          }
        ]
      },
      {
        name: "3. Perjalanan Waktu",
        jukugos: [
          {
            word: "歴年",
            reading: "れきねん",
            meaning: "tahun-tahun berlalu",
            unsur: [
              { jokugo: "歴", arti: "melewati" },
              { jokugo: "年", arti: "tahun" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 歴 dan 年 menjadi 歴年, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “rentang waktu yang telah berlangsung selama bertahun-tahun.”"
          },
          {
            word: "歴代",
            reading: "れきだい",
            meaning: "dari generasi ke generasi",
            unsur: [
              { jokugo: "歴", arti: "melewati masa" },
              { jokugo: "代", arti: "generasi, masa" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 歴 dan 代 menjadi 歴代, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pergantian atau keberlangsungan dari satu generasi atau masa ke generasi berikutnya.”"
          },
          {
            word: "歴訪",
            reading: "れきほう",
            meaning: "kunjungan ke berbagai tempat",
            unsur: [
              { jokugo: "歴", arti: "berkeliling, melewati" },
              { jokugo: "訪", arti: "mengunjungi" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 歴 dan 訪 menjadi 歴訪, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “melakukan kunjungan resmi ke berbagai tempat atau negara secara berturut-turut.”"
          },
          {
            word: "歴程",
            reading: "れきてい",
            meaning: "proses perjalanan / perjalanan waktu",
            unsur: [
              { jokugo: "歴", arti: "melewati" },
              { jokugo: "程", arti: "perjalanan, proses" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 歴 dan 程 menjadi 歴程, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “proses perjalanan hidup atau perjalanan waktu yang dilalui.”"
          }
        ]
      }
    ],
    quizzes: [
      // 5 Unscramble
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["調べておきます", "来歴を", "事前に", "商品の"]),
        correctOrder: JSON.stringify(["事前に", "商品の", "来歴を", "調べておきます"]),
        explanation: "Jawaban: 事前に商品の来歴を調べておきます。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["歴年", "研究するのは", "大変です", "データを"]),
        correctOrder: JSON.stringify(["歴年", "データを", "研究するのは", "大変です"]),
        explanation: "Jawaban: 歴年データを研究するのは大変です。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["前歴が", "分かるでしょう", "調べれば"]),
        correctOrder: JSON.stringify(["調べれば", "前歴が", "分かるでしょう"]),
        explanation: "Jawaban: 調べれば前歴が分かるでしょう。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["質問されたんです", "病歴を", "病院で"]),
        correctOrder: JSON.stringify(["病院で", "病歴を", "質問されたんです"]),
        explanation: "Jawaban: 病院で病歴を質問されたんです。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["歴史を", "好きです", "調べるのが"]),
        correctOrder: JSON.stringify(["歴史を", "調べるのが", "好きです"]),
        explanation: "Jawaban: 歴史を調べるのが好きです。"
      },
      // 1 Grouping
      {
        type: "grouping",
        question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
        words: JSON.stringify([
          "年表", "歴史", "戦歴", "前歴",
          "経歴", "職歴", "学歴", "履歴",
          "歴年", "歴代", "歴訪", "歴程"
        ]),
        groups: JSON.stringify([
          {
            name: "1. Peristiwa",
            correctWords: ["年表", "歴史", "戦歴", "前歴"]
          },
          {
            name: "2. Pengalaman",
            correctWords: ["経歴", "職歴", "学歴", "履歴"]
          },
          {
            name: "3. Perjalanan Waktu",
            correctWords: ["歴年", "歴代", "歴訪", "歴程"]
          }
        ]),
        explanation: "Pengelompokan jukugo berdasarkan cabang semantic graph kanji 歴."
      },
      // 5 Multiple Choice (Section c)
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “riwayat pendidikan yang telah ditempuh”?",
        options: JSON.stringify(["学歴", "職歴", "経歴"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 学歴 (gakureki)."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “riwayat pekerjaan yang telah dijalani”?",
        options: JSON.stringify(["学歴", "来歴", "職歴"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 職歴 (shokureki)."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “riwayat atau perjalanan hidup dan karier yang telah dilalui”?",
        options: JSON.stringify(["学歴", "経歴", "職歴"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 経歴 (keireki)."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “riwayat penyakit yang pernah dialami”?",
        options: JSON.stringify(["前歴", "経歴", "病歴"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 病歴 (byoureki)."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “riwayat yang terjadi atau dimiliki sebelumnya”?",
        options: JSON.stringify(["前歴", "病歴", "来歴"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 前歴 (zenreki)."
      },
      // 5 Fill in Blank (Section d)
      {
        type: "fill",
        question: "大学を卒業したあとで、自分の（　　　）について説明しました。",
        options: JSON.stringify(["学歴", "病歴", "歴代"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 学歴 (gakureki)."
      },
      {
        type: "fill",
        question: "日本へ来る前の仕事の（　　　）を先生に話しました。",
        options: JSON.stringify(["病歴", "経歴", "歴代"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 経歴 (keireki)."
      },
      {
        type: "fill",
        question: "この古い建物の（　　　）を調べるために、図書館へ行きました。",
        options: JSON.stringify(["来歴", "職歴", "歴代"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 来歴 (raireki)."
      },
      {
        type: "fill",
        question: "病院へ行ったので、医者に（　　　）を聞かれました。",
        options: JSON.stringify(["病歴", "来歴", "歴年"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 病歴 (byoureki)."
      },
      {
        type: "fill",
        question: "日本の（　　　）を勉強すると、昔の生活がよく分かるようになります。",
        options: JSON.stringify(["歴史", "歴年", "学歴"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 歴史 (rekishi)."
      }
    ]
  },

  // =============================================================
  // 4. KANJI 史 (ID: 3245)
  // =============================================================
  {
    id: 3245,
    character: "史",
    romaji: "SHI",
    meaning: "Catatan, Sejarah",
    baseMeaning: "catatan / sejarah.",
    bushuu: "口",
    onyomi: "シ",
    kunyomi: "-",
    categories: [
      {
        name: "1. Sejarah",
        jukugos: [
          {
            word: "歴史",
            reading: "れきし",
            meaning: "sejarah",
            unsur: [
              { jokugo: "歴", arti: "melewati, riwayat" },
              { jokugo: "史", arti: "sejarah, catatan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 歴 dan 史 menjadi 歴史, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sejarah atau catatan mengenai peristiwa yang telah berlangsung pada masa lalu.”"
          },
          {
            word: "先史",
            reading: "せんし",
            meaning: "prasejarah",
            unsur: [
              { jokugo: "先", arti: "sebelum, terdahulu" },
              { jokugo: "史", arti: "sejarah" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 先 dan 史 menjadi 先史, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “masa sebelum sejarah tertulis.”"
          },
          {
            word: "前史",
            reading: "ぜんし",
            meaning: "sejarah sebelumnya",
            unsur: [
              { jokugo: "前", arti: "sebelumnya" },
              { jokugo: "史", arti: "sejarah" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 前 dan 史 menjadi 前史, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sejarah atau latar belakang yang terjadi sebelum suatu peristiwa atau masa tertentu.”"
          }
        ]
      },
      {
        name: "2. Fakta",
        jukugos: [
          {
            word: "史実",
            reading: "しじつ",
            meaning: "fakta sejarah",
            unsur: [
              { jokugo: "史", arti: "sejarah" },
              { jokugo: "実", arti: "kenyataan, fakta" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 史 dan 実 menjadi 史実, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “fakta atau kenyataan yang benar-benar terjadi dalam sejarah.”"
          }
        ]
      },
      {
        name: "3. Sumber",
        jukugos: [
          {
            word: "史料",
            reading: "しりょう",
            meaning: "bahan sejarah",
            unsur: [
              { jokugo: "史", arti: "sejarah" },
              { jokugo: "料", arti: "bahan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 史 dan 料 menjadi 史料, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bahan atau sumber yang digunakan untuk mempelajari sejarah.”"
          }
        ]
      },
      {
        name: "4. Jenis Sejarah",
        jukugos: [
          {
            word: "正史",
            reading: "せいし",
            meaning: "sejarah resmi",
            unsur: [
              { jokugo: "正", arti: "benar, resmi" },
              { jokugo: "史", arti: "sejarah" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 正 dan 史 menjadi 正史, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sejarah yang dicatat atau diakui sebagai sejarah resmi.”"
          },
          {
            word: "秘史",
            reading: "ひし",
            meaning: "sejarah rahasia",
            unsur: [
              { jokugo: "秘", arti: "rahasia" },
              { jokugo: "史", arti: "sejarah" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 秘 dan 史 menjadi 秘史, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sejarah atau peristiwa masa lalu yang bersifat rahasia.”"
          }
        ]
      },
      {
        name: "5. Dalam Sejarah",
        jukugos: [
          {
            word: "史上",
            reading: "しじょう",
            meaning: "dalam sejarah",
            unsur: [
              { jokugo: "史", arti: "sejarah" },
              { jokugo: "上", arti: "di dalam, pada" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 史 dan 上 menjadi 史上, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sesuatu yang terjadi atau dikenal dalam sejarah.”"
          }
        ]
      }
    ],
    quizzes: [
      // 5 Unscramble
      {
        type: "unscramble",
        question: "Susunlah kata-kata dibawah ini menjadi kalimat yang tepat.",
        words: JSON.stringify(["前史を", "思っています", "調べようと", "事件の"]),
        correctOrder: JSON.stringify(["事件の", "前史を", "調べようと", "思っています"]),
        explanation: "Jawaban: 事件の前史を調べようと思っています。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata dibawah ini menjadi kalimat yang tepat.",
        words: JSON.stringify(["歴史を", "勉強します", "理解できるように"]),
        correctOrder: JSON.stringify(["歴史を", "理解できるように", "勉強します"]),
        explanation: "Jawaban: 歴史を理解できるように勉強します。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata dibawah ini menjadi kalimat yang tepat.",
        words: JSON.stringify(["史実を", "ほうが", "調べた", "いいです"]),
        correctOrder: JSON.stringify(["史実を", "調べた", "ほうが", "いいです"]),
        explanation: "Jawaban: 史実を調べたほうがいいです。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata dibawah ini menjadi kalimat yang tepat.",
        words: JSON.stringify(["史料を", "難しいです", "読むのは", "古い"]),
        correctOrder: JSON.stringify(["古い", "史料を", "読むのは", "難しいです"]),
        explanation: "Jawaban: 古い史料を読むのは難しいです。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata dibawah ini menjadi kalimat yang tepat.",
        words: JSON.stringify(["正史が", "本に", "書いてあります"]),
        correctOrder: JSON.stringify(["本に", "正史が", "書いてあります"]),
        explanation: "Jawaban: 本に正史が書いてあります。"
      },
      // 1 Grouping
      {
        type: "grouping",
        question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
        words: JSON.stringify([
          "歴史", "先史", "前史",
          "史実",
          "史料",
          "正史", "秘史",
          "史上"
        ]),
        groups: JSON.stringify([
          {
            name: "1. Sejarah",
            correctWords: ["歴史", "先史", "前史"]
          },
          {
            name: "2. Fakta",
            correctWords: ["史実"]
          },
          {
            name: "3. Sumber",
            correctWords: ["史料"]
          },
          {
            name: "4. Jenis Sejarah",
            correctWords: ["正史", "秘史"]
          },
          {
            name: "5. Dalam Sejarah",
            correctWords: ["史上"]
          }
        ]),
        explanation: "Pengelompokan jukugo berdasarkan cabang semantic graph kanji 史."
      },
      // 5 Multiple Choice (Section c)
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “sejarah atau catatan mengenai peristiwa yang telah berlangsung pada masa lalu”?",
        options: JSON.stringify(["歴史", "先史", "前史"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 歴史 (rekishi)."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “masa sebelum sejarah tertulis”?",
        options: JSON.stringify(["前史", "史上", "先史"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 先史 (senshi)."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “riwayat pendidikan yang telah ditempuh”?",
        options: JSON.stringify(["職歴", "学歴", "経歴"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 学歴 (gakureki)."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “fakta atau kenyataan yang benar-benar terjadi dalam sejarah”?",
        options: JSON.stringify(["史実", "史料", "正史"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 史実 (shijitsu)."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “bahan atau sumber yang digunakan untuk mempelajari sejarah”?",
        options: JSON.stringify(["史実", "秘史", "史料"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 史料 (shiryou)."
      },
      // 5 Fill in Blank (Section d)
      {
        type: "fill",
        question: "日本の（　　　）を勉強すると、昔のことがよく分かるようになります。",
        options: JSON.stringify(["歴史", "史料", "史実"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 歴史 (rekishi)."
      },
      {
        type: "fill",
        question: "文字が使われる前の時代を（　　　）といいます。",
        options: JSON.stringify(["正史", "前史", "史上"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 前史 (zenji)."
      },
      {
        type: "fill",
        question: "この出来事が本当の（　　　）かどうか、調べてください。",
        options: JSON.stringify(["前史", "史実", "前史"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 史実 (shijitsu)."
      },
      {
        type: "fill",
        question: "昔の文書や記録などの（　　　）を使って、歴史を研究します。",
        options: JSON.stringify(["史実", "歴史", "史料"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 史料 (shiryou)."
      },
      {
        type: "fill",
        question: "教科書に書かれていることが、全部（　　　）とは限りません。",
        options: JSON.stringify(["正史", "史実", "先史"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 史実 (shijitsu)."
      }
    ]
  },

  // =============================================================
  // 5. KANJI 期 (ID: 3246)
  // =============================================================
  {
    id: 3246,
    character: "期",
    romaji: "KI",
    meaning: "Waktu, Periode, Harapan",
    baseMeaning: "waktu / periode / harapan.",
    bushuu: "月",
    onyomi: "キ、ゴ",
    kunyomi: "-",
    categories: [
      {
        name: "1. Waktu / Periode",
        jukugos: [
          {
            word: "時期",
            reading: "じき",
            meaning: "waktu / periode",
            unsur: [
              { jokugo: "時", arti: "waktu" },
              { jokugo: "期", arti: "periode, masa yang ditentukan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 時 dan 期 menjadi 時期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “waktu atau periode tertentu.”"
          },
          {
            word: "期間",
            reading: "きかん",
            meaning: "jangka waktu",
            unsur: [
              { jokugo: "期", arti: "periode" },
              { jokugo: "間", arti: "jarak, rentang" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 期 dan 間 menjadi 期間, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “jangka atau rentang waktu.”"
          },
          {
            word: "長期",
            reading: "ちょうき",
            meaning: "jangka panjang",
            unsur: [
              { jokugo: "長", arti: "panjang" },
              { jokugo: "期", arti: "periode" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 長 dan 期 menjadi 長期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “periode atau jangka waktu yang panjang.”"
          },
          {
            word: "短期",
            reading: "たんき",
            meaning: "jangka pendek",
            unsur: [
              { jokugo: "短", arti: "pendek" },
              { jokugo: "期", arti: "periode" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 短 dan 期 menjadi 短期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “periode atau jangka waktu yang pendek.”"
          },
          {
            word: "定期",
            reading: "ていき",
            meaning: "berkala",
            unsur: [
              { jokugo: "定", arti: "tetap, menentukan" },
              { jokugo: "期", arti: "periode" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 定 dan 期 menjadi 定期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sesuatu yang berlangsung pada periode yang telah ditentukan atau secara berkala.”"
          },
          {
            word: "周期",
            reading: "しゅうき",
            meaning: "siklus",
            unsur: [
              { jokugo: "周", arti: "berputar, mengelilingi" },
              { jokugo: "期", arti: "periode" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 周 dan 期 menjadi 周期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “periode yang berulang secara teratur sehingga membentuk suatu siklus.”"
          },
          {
            word: "学期",
            reading: "がっき",
            meaning: "semester",
            unsur: [
              { jokugo: "学", arti: "belajar, pendidikan" },
              { jokugo: "期", arti: "periode" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 学 dan 期 menjadi 学期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “periode tertentu dalam kegiatan pendidikan atau semester.”"
          },
          {
            word: "会期",
            reading: "かいき",
            meaning: "masa sidang",
            unsur: [
              { jokugo: "会", arti: "pertemuan, sidang" },
              { jokugo: "期", arti: "periode" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 会 dan 期 menjadi 会期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “periode atau masa berlangsungnya suatu sidang.”"
          }
        ]
      },
      {
        name: "2. Tahap Waktu",
        jukugos: [
          {
            word: "初期",
            reading: "しょき",
            meaning: "tahap awal",
            unsur: [
              { jokugo: "初", arti: "awal, pertama" },
              { jokugo: "期", arti: "periode" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 初 dan 期 menjadi 初期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “periode atau tahap awal.”"
          },
          {
            word: "前期",
            reading: "ぜんき",
            meaning: "periode awal",
            unsur: [
              { jokugo: "前", arti: "sebelum, awal" },
              { jokugo: "期", arti: "periode" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 前 dan 期 menjadi 前期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “periode sebelumnya atau bagian awal dari suatu rangkaian periode.”"
          },
          {
            word: "後期",
            reading: "こうき",
            meaning: "periode akhir",
            unsur: [
              { jokugo: "後", arti: "sesudah, akhir" },
              { jokugo: "期", arti: "periode" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 後 dan 期 menjadi 後期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “periode setelahnya atau bagian akhir dari suatu rangkaian periode.”"
          },
          {
            word: "早期",
            reading: "そうき",
            meaning: "tahap awal",
            unsur: [
              { jokugo: "早", arti: "awal, cepat" },
              { jokugo: "期", arti: "periode" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 早 dan 期 menjadi 早期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “periode atau tahap yang masih awal.”"
          },
          {
            word: "期首",
            reading: "きしゅ",
            meaning: "awal periode",
            unsur: [
              { jokugo: "期", arti: "periode" },
              { jokugo: "首", arti: "awal, bagian depan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 期 dan 首 menjadi 期首, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bagian awal dari suatu periode.”"
          },
          {
            word: "期末",
            reading: "きまつ",
            meaning: "akhir periode",
            unsur: [
              { jokugo: "期", arti: "periode" },
              { jokugo: "末", arti: "akhir" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 期 dan 末 menjadi 期末, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bagian akhir dari suatu periode.”"
          },
          {
            word: "末期",
            reading: "まっき",
            meaning: "tahap akhir",
            unsur: [
              { jokugo: "末", arti: "akhir" },
              { jokugo: "期", arti: "periode" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 末 dan 期 menjadi 末期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “periode atau tahap yang berada pada bagian akhir.”"
          }
        ]
      },
      {
        name: "3. Batas Waktu",
        jukugos: [
          {
            word: "期限",
            reading: "きげん",
            meaning: "batas waktu",
            unsur: [
              { jokugo: "期", arti: "periode, waktu yang ditentukan" },
              { jokugo: "限", arti: "batas" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 期 dan 限 menjadi 期限, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “batas waktu yang telah ditentukan.”"
          },
          {
            word: "期日",
            reading: "きじつ",
            meaning: "tanggal yang ditentukan",
            unsur: [
              { jokugo: "期", arti: "waktu yang ditentukan" },
              { jokugo: "日", arti: "hari, tanggal" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 期 dan 日 menjadi 期日, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “hari atau tanggal yang telah ditentukan.”"
          },
          {
            word: "納期",
            reading: "のうき",
            meaning: "batas penyerahan",
            unsur: [
              { jokugo: "納", arti: "menyerahkan, memasukkan" },
              { jokugo: "期", arti: "waktu yang ditentukan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 納 dan 期 menjadi 納期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “batas waktu yang ditentukan untuk menyerahkan sesuatu.”"
          },
          {
            word: "延期",
            reading: "えんき",
            meaning: "penundaan",
            unsur: [
              { jokugo: "延", arti: "memperpanjang, menunda" },
              { jokugo: "期", arti: "periode, waktu yang ditentukan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 延 dan 期 menjadi 延期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menunda suatu kegiatan atau waktu ke periode yang lebih kemudian.”"
          },
          {
            word: "満期",
            reading: "まんき",
            meaning: "jatuh tempo",
            unsur: [
              { jokugo: "満", arti: "penuh, mencapai" },
              { jokugo: "期", arti: "periode, masa yang ditentukan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 満 dan 期 menjadi 満期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “berakhirnya periode yang telah ditentukan atau saat jatuh tempo.”"
          }
        ]
      },
      {
        name: "4. Harapan / Perkiraan",
        jukugos: [
          {
            word: "期待",
            reading: "きたい",
            meaning: "harapan",
            unsur: [
              { jokugo: "期", arti: "mengharapkan" },
              { jokugo: "待", arti: "menunggu" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 期 dan 待 menjadi 期待, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “harapan terhadap sesuatu yang dinantikan atau diharapkan terjadi.”"
          },
          {
            word: "予期",
            reading: "よき",
            meaning: "perkiraan / mengharapkan",
            unsur: [
              { jokugo: "予", arti: "sebelumnya, memperkirakan" },
              { jokugo: "期", arti: "mengharapkan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 予 dan 期 menjadi 予期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memperkirakan atau mengharapkan sesuatu akan terjadi.”"
          }
        ]
      }
    ],
    quizzes: [
      // 5 Unscramble
      {
        type: "unscramble",
        question: "Susunlah kalimat dari kata-kata berikut.",
        words: JSON.stringify(["思っています", "短期留学を", "と", "しよう"]),
        correctOrder: JSON.stringify(["短期留学を", "しよう", "と", "思っています"]),
        explanation: "Jawaban: 短期留学をしようと思っています。"
      },
      {
        type: "unscramble",
        question: "Susunlah kalimat dari kata-kata berikut.",
        words: JSON.stringify(["たてておきます", "前に", "長期計画を"]),
        correctOrder: JSON.stringify(["前に", "長期計画を", "たてておきます"]),
        explanation: "Jawaban: 前に長期計画をたてておきます。"
      },
      {
        type: "unscramble",
        question: "Susunlah kalimat dari kata-kata berikut.",
        words: JSON.stringify(["いいです", "初期に", "ほうが", "治した", "病気を"]),
        correctOrder: JSON.stringify(["初期に", "病気を", "治した", "ほうが", "いいです"]),
        explanation: "Jawaban: 初期に病気を治したほうがいいです。"
      },
      {
        type: "unscramble",
        question: "Susunlah kalimat dari kata-kata berikut.",
        words: JSON.stringify(["期日が", "書いてあります", "書類に"]),
        correctOrder: JSON.stringify(["書類に", "期日が", "書いてあります"]),
        explanation: "Jawaban: 書類に期日が書いてあります。"
      },
      {
        type: "unscramble",
        question: "Susunlah kalimat dari kata-kata berikut.",
        words: JSON.stringify(["大変", "期末テストを", "です", "受けるのは"]),
        correctOrder: JSON.stringify(["期末テストを", "受けるのは", "大変", "です"]),
        explanation: "Jawaban: 期末テストを受けるのは大変です。"
      },
      // 1 Grouping
      {
        type: "grouping",
        question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
        words: JSON.stringify([
          "時期", "期間", "長期", "短期", "定期", "周期", "学期", "会期",
          "初期", "前期", "後期", "早期", "期首", "期末", "末期",
          "期限", "期日", "納期", "延期", "満期",
          "期待", "予期"
        ]),
        groups: JSON.stringify([
          {
            name: "1. Waktu / Periode",
            correctWords: ["時期", "期間", "長期", "短期", "定期", "周期", "学期", "会期"]
          },
          {
            name: "2. Tahap Waktu",
            correctWords: ["初期", "前期", "後期", "早期", "期首", "期末", "末期"]
          },
          {
            name: "3. Batas Waktu",
            correctWords: ["期限", "期日", "納期", "延期", "満期"]
          },
          {
            name: "4. Harapan / Perkiraan",
            correctWords: ["期待", "予期"]
          }
        ]),
        explanation: "Pengelompokan jukugo berdasarkan cabang semantic graph kanji 期."
      },
      // 5 Multiple Choice (Section c)
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “waktu atau periode tertentu”?",
        options: JSON.stringify(["定期", "時期", "期間"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 時期 (jiki)."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “jangka atau rentang waktu”?",
        options: JSON.stringify(["期間", "時期", "周期"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 期間 (kikan)."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “periode atau jangka waktu yang panjang”?",
        options: JSON.stringify(["短期", "定期", "長期"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 長期 (chouki)."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “periode atau jangka waktu yang pendek”?",
        options: JSON.stringify(["初期", "短期", "長期"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 短期 (tanki)."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “periode tertentu dalam kegiatan pendidikan atau semester”?",
        options: JSON.stringify(["時期", "学期", "会期"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 学期 (gakki)."
      },
      // 5 Fill in Blank (Section d)
      {
        type: "fill",
        question: "大学の（　　　）は4月から始まります。",
        options: JSON.stringify(["学期", "長期", "期日"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 学期 (gakki)."
      },
      {
        type: "fill",
        question: "夏休みは（　　　）の旅行をする予定です。",
        options: JSON.stringify(["長期", "短期", "定期"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 長期 (chouki)."
      },
      {
        type: "fill",
        question: "この仕事は（　　　）で終わるでしょう。",
        options: JSON.stringify(["周期", "短期", "学期"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 短期 (tanki)."
      },
      {
        type: "fill",
        question: "この電車は（　　　）に運行されています。",
        options: JSON.stringify(["末期", "初期", "定期"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 定期 (teiki)."
      },
      {
        type: "fill",
        question: "日本語の勉強を始めた（　　　）は、漢字があまり読めませんでした。",
        options: JSON.stringify(["前期", "初期", "後期"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 初期 (shoki)."
      }
    ]
  }
];

const REFLEKSI_MAP: Record<string, string[]> = {
  "経": [
    "Apa makna dasar kanji 経 yang anda pahami?",
    "Jukugo mana yang mudah untuk di ingat? Mengapa?",
    "Apa perbedaan penggunaan 経済、経営 dan 経理?",
    "Cabang semantic graph mana yang menurut anda paling mudah dipahami?",
    "Bagaimana cara anda mengingat hubungan makna antar jukugo yang mengandung kanji 経?"
  ],
  "始": [
    "Apa makna dasar kanji 始 yang anda pahami?",
    "Jukugo mana yang mudah untuk di ingat? Mengapa?",
    "Apa perbedaan penggunaan 終始、開始 dan 年始?",
    "Cabang semantic graph mana yang menurut anda paling mudah dipahami?",
    "Bagaimana cara anda mengingat hubungan makna antar jukugo yang mengandung kanji 始?"
  ],
  "歴": [
    "Apa makna dasar kanji 歴 yang anda pahami?",
    "Jukugo mana yang mudah untuk di ingat? Mengapa?",
    "Apa perbedaan makna antara 学歴、職歴 dan 経歴?",
    "Cabang semantic graph mana yang menurut anda paling mudah dipahami?",
    "Bagaimana cara anda mengingat hubungan makna antar jukugo yang mengandung kanji 歴?"
  ],
  "史": [
    "Apa makna dasar kanji 史 yang anda pahami?",
    "Jukugo mana yang mudah untuk di ingat? Mengapa?",
    "Apa perbedaan antara 史実 dan 史料?",
    "Cabang semantic graph mana yang menurut anda paling mudah dipahami?",
    "Bagaimana cara anda mengingat hubungan makna antar jukugo yang mengandung kanji 史?"
  ],
  "期": [
    "Apa makna dasar kanji 期 yang anda pahami?",
    "Jukugo mana yang mudah untuk di ingat? Mengapa?",
    "Apa perbedaan antara 期間、期限 dan 期日?",
    "Cabang semantic graph mana yang menurut anda paling mudah dipahami?",
    "Bagaimana cara anda mengingat hubungan makna antar jukugo yang mengandung kanji 期?"
  ]
};

async function main() {
  console.log("=== MEMULAI SINKRONISASI KETAT MODUL 6 ===");

  // 1. Pastikan single kanji pembangun (tanpa module) tersedia
  for (const c of CONSTITUENTS_TO_ENSURE) {
    await prisma.kanji.upsert({
      where: { character: c.character },
      update: {
        romaji: c.romaji,
        meaning: c.meaning,
        bushuu: c.bushuu,
        onyomi: c.onyomi,
        kunyomi: c.kunyomi,
        baseMeaning: c.baseMeaning
      },
      create: {
        character: c.character,
        romaji: c.romaji,
        meaning: c.meaning,
        bushuu: c.bushuu,
        onyomi: c.onyomi,
        kunyomi: c.kunyomi,
        baseMeaning: c.baseMeaning,
        moduleId: null
      }
    });
    console.log(`✓ Kanji konstituen '${c.character}' berhasil dipastikan.`);
  }

  // 2. Iterasi untuk setiap kanji di Modul 6
  for (const kd of MODUL_6_DATA) {
    console.log(`\nMemproses Kanji: ${kd.character} (ID: ${kd.id})...`);

    // Update data dasar kanji
    await prisma.kanji.update({
      where: { id: kd.id },
      data: {
        romaji: kd.romaji,
        meaning: kd.meaning,
        baseMeaning: kd.baseMeaning,
        bushuu: kd.bushuu,
        onyomi: kd.onyomi,
        kunyomi: kd.kunyomi,
        moduleId: 560
      }
    });

    // Simpan MasterRefleksi
    await prisma.masterRefleksi.deleteMany({ where: { kanjiId: kd.id } });
    const refls = REFLEKSI_MAP[kd.character] || [];
    for (const q of refls) {
      await prisma.masterRefleksi.create({
        data: {
          kanjiId: kd.id,
          question: q
        }
      });
    }

    // Bersihkan Quizzes lama
    await prisma.quiz.deleteMany({
      where: { kanjiId: kd.id }
    });

    // Bersihkan graphEdges lama (agar diagram hierarki murni bersih sesuai gambar)
    await prisma.kanjiGraphEdge.deleteMany({
      where: { kanjiId: kd.id }
    });

    // Bersihkan KategoriKanji, SemanticRelation & SemanticRelationNode, dan Jukugo lama
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

    // Insert MasterCategory, Jukugo, KategoriKanji, SemanticRelation, SemanticRelationNode
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

    // Simpan 16 kuis baru
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

  console.log("\n=== SINKRONISASI MODUL 6 SUKSES 100% ===");
}

main()
  .catch((e) => {
    console.error("Error saat sinkronisasi Modul 6:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
