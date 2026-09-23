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

const MODUL_3_DATA: KanjiData[] = [
  // -------------------------------------------------------------
  // KANJI 情 (ID: 3224)
  // -------------------------------------------------------------
  {
    id: 3224,
    character: "情",
    romaji: "jou",
    meaning: "Perasaan / Emosi",
    baseMeaning:
      "perasaan, kasih sayang, keadaan/situasi, atau informasi mengenai suatu hal.",
    bushuu: "忄",
    onyomi: "ジョウ, セイ",
    kunyomi: "なさ.け",
    categories: [
      {
        name: "1. Perasaan / Emosi",
        jukugos: [
          {
            word: "感情",
            reading: "かんじょう",
            meaning: "perasaan, emosi",
            unsur: [
              { jokugo: "感", arti: "merasakan, perasaan" },
              { jokugo: "情", arti: "perasaan, emosi" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 感 dan 情 menjadi 感情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perasaan atau emosi yang dirasakan oleh seseorang.”",
          },
          {
            word: "表情",
            reading: "ひょうじょう",
            meaning: "ekspresi wajah",
            unsur: [
              { jokugo: "表", arti: "luar, memperlihatkan" },
              { jokugo: "情", arti: "perasaan, emosi" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 表 dan 情 menjadi 表情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perasaan atau emosi yang tampak pada raut wajah seseorang.”",
          },
          {
            word: "心情",
            reading: "しんじょう",
            meaning: "perasaan hati, suasana batin",
            unsur: [
              { jokugo: "心", arti: "hati, batin" },
              { jokugo: "情", arti: "perasaan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 心 dan 情 menjadi 心情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perasaan yang ada di dalam hati atau suasana batin seseorang.”",
          },
          {
            word: "真情",
            reading: "しんじょう",
            meaning: "perasaan yang sebenarnya",
            unsur: [
              { jokugo: "真", arti: "sebenarnya, nyata" },
              { jokugo: "情", arti: "perasaan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 真 dan 情 menjadi 真情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perasaan yang sesungguhnya atau ungkapan perasaan yang jujur.”",
          },
          {
            word: "純情",
            reading: "じゅんじょう",
            meaning: "perasaan yang murni, tulus",
            unsur: [
              { jokugo: "純", arti: "murni, polos" },
              { jokugo: "情", arti: "perasaan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 純 dan 情 menjadi 純情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perasaan yang murni, polos, dan tulus tanpa kepentingan tertentu.”",
          },
        ],
      },
      {
        name: "2. Kasih Sayang / Hubungan Antarmanusia",
        jukugos: [
          {
            word: "愛情",
            reading: "あいじょう",
            meaning: "kasih sayang, cinta",
            unsur: [
              { jokugo: "愛", arti: "cinta, kasih sayang" },
              { jokugo: "情", arti: "perasaan, kasih sayang" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 愛 dan 情 menjadi 愛情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perasaan cinta atau kasih sayang yang diberikan kepada seseorang atau sesuatu.”",
          },
          {
            word: "友情",
            reading: "ゆうじょう",
            meaning: "persahabatan, persahabatan tulus",
            unsur: [
              { jokugo: "友", arti: "teman" },
              { jokugo: "情", arti: "perasaan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 友 dan 情 menjadi 友情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perasaan kasih dan kedekatan yang terjalin antar teman.”",
          },
          {
            word: "同情",
            reading: "どうじょう",
            meaning: "simpati, empati",
            unsur: [
              { jokugo: "同", arti: "sama" },
              { jokugo: "情", arti: "perasaan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 同 dan 情 menjadi 同情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “merasakan atau memahami perasaan orang lain karena memiliki perasaan yang sama terhadap keadaan yang dialaminya.”",
          },
          {
            word: "人情",
            reading: "にんじょう",
            meaning: "perasaan kemanusiaan",
            unsur: [
              { jokugo: "人", arti: "manusia, orang" },
              { jokugo: "情", arti: "perasaan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 人 dan 情 menjadi 人情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perasaan kemanusiaan, kasih sayang, dan kepedulian yang muncul dalam hubungan antarmanusia.”",
          },
          {
            word: "交情",
            reading: "こうじょう",
            meaning: "hubungan akrab, perasaan kedekatan",
            unsur: [
              { jokugo: "交", arti: "bergaul, berhubungan" },
              { jokugo: "情", arti: "perasaan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 交 dan 情 menjadi 交情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “hubungan dekat yang terbentuk melalui pergaulan dan perasaan saling mengenal.”",
          },
        ],
      },
      {
        name: "3. Perasaan / Semangat yang Kuat",
        jukugos: [
          {
            word: "情熱",
            reading: "じょうねつ",
            meaning: "semangat, gairah, passion",
            unsur: [
              { jokugo: "情", arti: "perasaan" },
              { jokugo: "熱", arti: "panas, kuat" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 情 dan 熱 menjadi 情熱, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perasaan atau semangat yang sangat kuat terhadap seseorang, kegiatan, atau sesuatu yang diminati.”",
          },
          {
            word: "熱情",
            reading: "ねつじょう",
            meaning: "perasaan, semangat yang kuat",
            unsur: [
              { jokugo: "熱", arti: "panas, kuat" },
              { jokugo: "情", arti: "perasaan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 熱 dan 情 menjadi 熱情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perasaan yang kuat dan penuh semangat terhadap seseorang atau sesuatu.”",
          },
        ],
      },
      {
        name: "4. Keadaan / Situasi",
        jukugos: [
          {
            word: "事情",
            reading: "じじょう",
            meaning: "keadaan, alasan, latar belakang",
            unsur: [
              { jokugo: "事", arti: "hal, peristiwa" },
              { jokugo: "情", arti: "keadaan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 事 dan 情 menjadi 事情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keadaan atau latar belakang yang berkaitan dengan suatu peristiwa atau masalah.”",
          },
          {
            word: "実情",
            reading: "じつじょう",
            meaning: "keadaan sebenarnya, realitas",
            unsur: [
              { jokugo: "実", arti: "nyata, sebenarnya" },
              { jokugo: "情", arti: "keadaan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 実 dan 情 menjadi 実情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keadaan yang sebenarnya atau kondisi nyata dari suatu hal.”",
          },
          {
            word: "内情",
            reading: "ないじょう",
            meaning: "keadaan internal, keadaan di dalam",
            unsur: [
              { jokugo: "内", arti: "dalam" },
              { jokugo: "情", arti: "keadaan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 内 dan 情 menjadi 内情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keadaan atau kondisi yang terdapat di dalam suatu organisasi, kelompok, atau masalah.”",
          },
          {
            word: "情勢",
            reading: "じょうせい",
            meaning: "situasi, kondisi, keadaan terkini",
            unsur: [
              { jokugo: "情", arti: "keadaan, situasi" },
              { jokugo: "勢", arti: "keadaan, kekuatan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 情 dan 勢 menjadi 情勢, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keadaan atau situasi yang sedang berlangsung pada suatu waktu tertentu.”",
          },
          {
            word: "情景",
            reading: "じょうけい",
            meaning: "pemandangan, adegan, suasana",
            unsur: [
              { jokugo: "情", arti: "keadaan, suasana" },
              { jokugo: "景", arti: "pemandangan, keadaan yang terlihat" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 情 dan 景 menjadi 情景, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “gambaran suatu keadaan, suasana, atau pemandangan yang dapat dilihat atau dibayangkan.”",
          },
        ],
      },
      {
        name: "5. Keluhan / Perasaan Tidak Puas",
        jukugos: [
          {
            word: "苦情",
            reading: "くじょう",
            meaning: "keluhan, komplain",
            unsur: [
              { jokugo: "苦", arti: "sulit, menyakitkan" },
              { jokugo: "情", arti: "perasaan, keadaan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 苦 dan 情 menjadi 苦情, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “ungkapan ketidakpuasan atau keluhan terhadap suatu keadaan, pelayanan, atau tindakan tertentu.”",
          },
        ],
      },
      {
        name: "6. Informasi / Data",
        jukugos: [
          {
            word: "情報",
            reading: "じょうほう",
            meaning: "informasi, berita, data",
            unsur: [
              { jokugo: "情", arti: "keadaan, informasi" },
              { jokugo: "報", arti: "memberitahukan, laporan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 情 dan 報 menjadi 情報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “informasi atau data mengenai suatu keadaan, peristiwa, atau hal tertentu yang disampaikan kepada seseorang.”",
          },
        ],
      },
    ],
    quizzes: [
      // a) Unscramble (Model A)
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify([
          "でしょう",
          "きれい",
          "の",
          "情景",
          "は",
          "写真",
          "この",
        ]),
        correctOrder: JSON.stringify([
          "この",
          "写真",
          "の",
          "情景",
          "は",
          "きれい",
          "でしょう",
        ]),
        correctAnswer: "0",
        explanation: "Jawaban: この写真の情景はきれいでしょう。",
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify([
          "話す",
          "事情",
          "先生",
          "を",
          "んです",
          "に",
        ]),
        correctOrder: JSON.stringify([
          "先生",
          "に",
          "事情",
          "を",
          "話す",
          "んです",
        ]),
        correctAnswer: "0",
        explanation: "Jawaban: 先生に事情を話すんです。",
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify([
          "集めて",
          "情報",
          "インターネット",
          "を",
          "おきます",
          "で",
        ]),
        correctOrder: JSON.stringify([
          "インターネット",
          "で",
          "情報",
          "を",
          "集めて",
          "おきます",
        ]),
        correctAnswer: "0",
        explanation: "Jawaban: インターネットで情報を集めておきます。",
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify([
          "明るい",
          "表情",
          "先生",
          "を",
          "しています",
          "は",
          "いつも",
        ]),
        correctOrder: JSON.stringify([
          "先生",
          "は",
          "いつも",
          "明るい",
          "表情",
          "を",
          "しています",
        ]),
        correctAnswer: "0",
        explanation: "Jawaban: 先生はいつも明るい表情をしています。",
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify([
          "出さない",
          "感情",
          "ほうが",
          "を",
          "いいです",
          "あまり",
        ]),
        correctOrder: JSON.stringify([
          "あまり",
          "感情",
          "を",
          "出さない",
          "ほうが",
          "いいです",
        ]),
        correctAnswer: "0",
        explanation: "Jawaban: あまり感情を出さないほうがいいです。",
      },
      // c) Multiple Choice (Model C - Definisi)
      {
        type: "multiple",
        question:
          "Jukugo mana yang berhubungan dengan makna ”perasaan atau emosi seseorang”?",
        options: JSON.stringify(["情報", "感情", "事情"]),
        correctAnswer: "1",
        explanation: "Kunci: b (感情)",
      },
      {
        type: "multiple",
        question:
          "Jukugo mana yang berhubungan dengan makna ” keadaan atau alasan yang sebenarnya dalam suatu peristiwa”?",
        options: JSON.stringify(["愛情", "事情", "表情"]),
        correctAnswer: "1",
        explanation: "Kunci: b (事情)",
      },
      {
        type: "multiple",
        question:
          "Jukugo mana yang berhubungan dengan makna “pemandangan atau suasana yang terlihat dalam suatu keadaan”?",
        options: JSON.stringify(["愛情", "情熱", "情景"]),
        correctAnswer: "2",
        explanation: "Kunci: c (情景)",
      },
      {
        type: "multiple",
        question:
          "Jukugo mana yang berhubungan dengan makna  ” rasa simpati atau empati terhadap keadaan orang lain”?",
        options: JSON.stringify(["同情", "純情", "表情"]),
        correctAnswer: "0",
        explanation: "Kunci: a (同情)",
      },
      {
        type: "multiple",
        question:
          "Jukugo mana yang berhubungan dengan ” keluhan atau perasaan tidak puas terhadap sesuatu” ”?",
        options: JSON.stringify(["情報", "感情", "苦情"]),
        correctAnswer: "2",
        explanation: "Kunci: c (苦情)",
      },
      // d) Fill in the blank (Model D)
      {
        type: "fill",
        question:
          "友達から日本の大学についていろいろな（　　　　）を教えてもらいました。",
        options: JSON.stringify(["情報", "情熱", "苦情"]),
        correctAnswer: "0",
        explanation: "Kunci: a (情報)",
      },
      {
        type: "fill",
        question:
          "人の（　　　　）を考えて、話したほうがいいです。",
        options: JSON.stringify(["感情", "情景", "情報"]),
        correctAnswer: "0",
        explanation: "Kunci: a (感情)",
      },
      {
        type: "fill",
        question:
          "田中さんは友達が困っているとき、いつも（　　　　）を感じています。",
        options: JSON.stringify(["情報", "情景", "同情"]),
        correctAnswer: "2",
        explanation: "Kunci: c (同情)",
      },
      {
        type: "fill",
        question:
          "この写真を見ると、昔の日本の（　　　　）がよく分かります。",
        options: JSON.stringify(["情熱", "情景", "苦情"]),
        correctAnswer: "1",
        explanation: "Kunci: b (情景)",
      },
      {
        type: "fill",
        question:
          "彼は日本の歴史にとてもがあって、日本の文化に（　　　　）を持っています。",
        options: JSON.stringify(["情熱", "苦情", "表情"]),
        correctAnswer: "0",
        explanation: "Kunci: a (情熱)",
      },
      // Grouping (Model B)
      {
        type: "grouping",
        question:
          "Kelompokkan jukugo kanji 情 berikut ke dalam cabang semantic graph yang tepat.",
        words: JSON.stringify([
          "感情",
          "表情",
          "心情",
          "真情",
          "純情",
          "愛情",
          "友情",
          "同情",
          "人情",
          "交情",
          "情熱",
          "熱情",
          "事情",
          "実情",
          "内情",
          "情勢",
          "情景",
          "苦情",
          "情報",
        ]),
        groups: JSON.stringify([
          {
            name: "1. Perasaan / Emosi",
            correctWords: ["感情", "表情", "心情", "真情", "純情"],
          },
          {
            name: "2. Kasih Sayang / Hubungan Antarmanusia",
            correctWords: ["愛情", "友情", "同情", "人情", "交情"],
          },
          {
            name: "3. Perasaan / Semangat yang Kuat",
            correctWords: ["情熱", "熱情"],
          },
          {
            name: "4. Keadaan / Situasi",
            correctWords: ["事情", "実情", "内情", "情勢", "情景"],
          },
          {
            name: "5. Keluhan / Perasaan Tidak Puas",
            correctWords: ["苦情"],
          },
          {
            name: "6. Informasi / Data",
            correctWords: ["情報"],
          },
        ]),
        correctAnswer: null,
        explanation: "Kelompokkan 19 kata jukugo kanji 情.",
      },
    ],
  },

  // -------------------------------------------------------------
  // KANJI 報 (ID: 3225)
  // -------------------------------------------------------------
  {
    id: 3225,
    character: "報",
    romaji: "hou",
    meaning: "Informasi / Berita / Membalas",
    baseMeaning:
      "memberitahukan, menyampaikan berita atau informasi, serta membalas atau memberikan balasan.",
    bushuu: "土",
    onyomi: "ホウ",
    kunyomi: "むく.いる",
    categories: [
      {
        name: "1. Informasi / Pemberitahuan",
        jukugos: [
          {
            word: "情報",
            reading: "じょうほう",
            meaning: "informasi",
            unsur: [
              { jokugo: "情", arti: "perasaan, keadaan, informasi" },
              { jokugo: "報", arti: "memberitahukan, menyampaikan informasi" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 情 dan 報 menjadi 情報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “informasi atau keterangan mengenai suatu hal.”",
          },
          {
            word: "報知",
            reading: "ほうち",
            meaning: "pemberitahuan",
            unsur: [
              { jokugo: "報", arti: "memberitahukan, menyampaikan" },
              { jokugo: "知", arti: "mengetahui, pengetahuan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 報 dan 知 menjadi 報知, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memberitahukan atau menyampaikan sesuatu agar diketahui oleh orang lain.”",
          },
          {
            word: "報告",
            reading: "ほうこく",
            meaning: "laporan",
            unsur: [
              { jokugo: "報", arti: "memberitahukan, menyampaikan" },
              { jokugo: "告", arti: "memberitahukan, memberi tahu" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 報 dan 告 menjadi 報告, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menyampaikan atau memberitahukan hasil, keadaan, atau informasi mengenai suatu kegiatan kepada pihak lain.”",
          },
          {
            word: "予報",
            reading: "よほう",
            meaning: "prakiraan / ramalan",
            unsur: [
              { jokugo: "予", arti: "sebelumnya, perkiraan" },
              { jokugo: "報", arti: "memberitahukan, menyampaikan informasi" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 予 dan 報 menjadi 予報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “informasi atau pemberitahuan mengenai sesuatu yang diperkirakan akan terjadi.”",
          },
          {
            word: "通報",
            reading: "つうほう",
            meaning: "pelaporan / pemberitahuan",
            unsur: [
              { jokugo: "通", arti: "menyampaikan, meneruskan" },
              { jokugo: "報", arti: "memberitahukan, melaporkan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 通 dan 報 menjadi 通報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menyampaikan atau melaporkan suatu informasi kepada pihak tertentu.”",
          },
        ],
      },
      {
        name: "2. Berita / Jenis Informasi",
        jukugos: [
          {
            word: "速報",
            reading: "そくほう",
            meaning: "berita cepat / berita terkini",
            unsur: [
              { jokugo: "速", arti: "cepat" },
              { jokugo: "報", arti: "berita, pemberitahuan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 速 dan 報 menjadi 速報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “berita atau informasi yang disampaikan dengan cepat mengenai suatu peristiwa yang baru terjadi.”",
          },
          {
            word: "続報",
            reading: "ぞくほう",
            meaning: "berita lanjutan",
            unsur: [
              { jokugo: "続", arti: "melanjutkan, berlanjut" },
              { jokugo: "報", arti: "berita, informasi" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 続 dan 報 menjadi 続報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “berita atau informasi lanjutan mengenai suatu peristiwa yang telah diberitakan sebelumnya.”",
          },
          {
            word: "特報",
            reading: "とくほう",
            meaning: "berita khusus",
            unsur: [
              { jokugo: "特", arti: "khusus" },
              { jokugo: "報", arti: "berita, informasi" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 特 dan 報 menjadi 特報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “berita atau informasi yang disampaikan secara khusus karena memiliki sifat atau kepentingan tertentu.”",
          },
          {
            word: "悲報",
            reading: "ひほう",
            meaning: "berita duka",
            unsur: [
              { jokugo: "悲", arti: "sedih, duka" },
              { jokugo: "報", arti: "berita, informasi" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 悲 dan 報 menjadi 悲報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “berita yang membawa atau menyampaikan kabar duka atau kesedihan.”",
          },
          {
            word: "勝報",
            reading: "しょうほう",
            meaning: "berita kemenangan",
            unsur: [
              { jokugo: "勝", arti: "menang, kemenangan" },
              { jokugo: "報", arti: "berita, informasi" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 勝 dan 報 menjadi 勝報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “berita yang menyampaikan kemenangan atau hasil yang baik dalam suatu pertandingan atau peristiwa.”",
          },
        ],
      },
      {
        name: "3. Laporan / Publikasi / Informasi Resmi",
        jukugos: [
          {
            word: "日報",
            reading: "にっぽう",
            meaning: "laporan harian",
            unsur: [
              { jokugo: "日", arti: "hari" },
              { jokugo: "報", arti: "laporan, berita" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 日 dan 報 menjadi 日報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “laporan atau informasi yang dibuat atau disampaikan setiap hari.”",
          },
          {
            word: "広報",
            reading: "こうほう",
            meaning: "informasi / publikasi kepada masyarakat",
            unsur: [
              { jokugo: "広", arti: "luas" },
              { jokugo: "報", arti: "informasi, pemberitaan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 広 dan 報 menjadi 広報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “informasi atau pemberitaan yang disampaikan secara luas kepada masyarakat.”",
          },
          {
            word: "公報",
            reading: "こうほう",
            meaning: "pengumuman / berita resmi",
            unsur: [
              { jokugo: "公", arti: "umum, publik" },
              { jokugo: "報", arti: "berita, pemberitahuan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 公 dan 報 menjadi 公報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pemberitahuan atau berita yang disampaikan secara resmi kepada masyarakat atau untuk kepentingan umum.”",
          },
          {
            word: "確報",
            reading: "かくほう",
            meaning: "laporan yang telah dipastikan",
            unsur: [
              { jokugo: "確", arti: "pasti, memastikan" },
              { jokugo: "報", arti: "berita, laporan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 確 dan 報 menjadi 確報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “berita atau laporan yang kebenarannya telah dipastikan.”",
          },
          {
            word: "会報",
            reading: "かいほう",
            meaning: "buletin / laporan organisasi",
            unsur: [
              { jokugo: "会", arti: "perkumpulan, organisasi" },
              { jokugo: "報", arti: "berita, laporan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 会 dan 報 menjadi 会報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “buletin atau laporan yang berisi informasi mengenai kegiatan suatu organisasi atau perkumpulan.”",
          },
          {
            word: "時報",
            reading: "じほう",
            meaning: "informasi waktu yang diumumkan berkala",
            unsur: [
              { jokugo: "時", arti: "waktu" },
              { jokugo: "報", arti: "memberitahukan, menyampaikan informasi" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 時 dan 報 menjadi 時報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pemberitahuan mengenai waktu yang disampaikan pada waktu-waktu tertentu secara berkala.”",
          },
        ],
      },
      {
        name: "4. Balasan / Pembalasan",
        jukugos: [
          {
            word: "返報",
            reading: "へんぽう",
            meaning: "balasan / pembalasan",
            unsur: [
              { jokugo: "返", arti: "mengembalikan, membalas" },
              { jokugo: "報", arti: "membalas, memberikan balasan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 返 dan 報 menjadi 返報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memberikan balasan atau mengembalikan suatu tindakan yang telah diterima.”",
          },
          {
            word: "報復",
            reading: "ほうふく",
            meaning: "pembalasan",
            unsur: [
              { jokugo: "報", arti: "membalas, memberikan balasan" },
              { jokugo: "復", arti: "kembali, mengembalikan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 報 dan 復 menjadi 報復, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “melakukan pembalasan terhadap suatu tindakan atau perlakuan yang telah diterima.”",
          },
        ],
      },
      {
        name: "5. Media / Cara Penyampaian Informasi",
        jukugos: [
          {
            word: "電報",
            reading: "でんぽう",
            meaning: "telegram",
            unsur: [
              { jokugo: "電", arti: "listrik, elektronik" },
              { jokugo: "報", arti: "berita, pemberitahuan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 電 dan 報 menjadi 電報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “penyampaian berita atau pesan melalui sarana komunikasi listrik/telegraf.”",
          },
          {
            word: "外報",
            reading: "がいほう",
            meaning: "berita dari luar negeri",
            unsur: [
              { jokugo: "外", arti: "luar" },
              { jokugo: "報", arti: "berita, informasi" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 外 dan 報 menjadi 外報, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “berita atau informasi yang berasal dari luar negeri atau dari luar suatu wilayah.”",
          },
          {
            word: "報道",
            reading: "ほうどう",
            meaning: "pemberitaan / media berita",
            unsur: [
              { jokugo: "報", arti: "berita, memberitahukan" },
              { jokugo: "道", arti: "jalan, menyampaikan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 報 dan 道 menjadi 報道, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan menyampaikan atau memberitakan informasi mengenai suatu peristiwa kepada masyarakat.”",
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
          "日報",
          "に",
          "テーブル",
          "が",
          "おいてあります",
          "の",
          "上",
        ]),
        correctOrder: JSON.stringify([
          "テーブル",
          "の",
          "上",
          "に",
          "日報",
          "が",
          "おいてあります",
        ]),
        correctAnswer: "0",
        explanation:
          "Jawaban: テーブルの上に日報がおいてあります。",
      },
      {
        type: "unscramble",
        question:
          "Susunlah  kata-kata berikut berikut menjadi kalimat yang tepat.",
        words: JSON.stringify([
          "通報した",
          "に",
          "ほうが",
          "すぐ",
          "いいです",
        ]),
        correctOrder: JSON.stringify([
          "すぐ",
          "に",
          "通報した",
          "ほうが",
          "いいです",
        ]),
        correctAnswer: "0",
        explanation: "Jawaban: すぐに通報したほうがいいです。",
      },
      {
        type: "unscramble",
        question:
          "Susunlah  kata-kata berikut berikut menjadi kalimat yang tepat.",
        words: JSON.stringify([
          "集めている",
          "情報を",
          "新しい",
          "んです",
        ]),
        correctOrder: JSON.stringify([
          "新しい",
          "情報を",
          "集めている",
          "んです",
        ]),
        correctAnswer: "0",
        explanation: "Jawaban: 新しい情報を集めているんです。",
      },
      {
        type: "unscramble",
        question:
          "Susunlah  kata-kata berikut berikut menjadi kalimat yang tepat.",
        words: JSON.stringify([
          "待ちます",
          "確報",
          "を",
          "聞きながら",
          "ニュース",
          "を",
        ]),
        correctOrder: JSON.stringify([
          "ニュース",
          "を",
          "聞きながら",
          "確報",
          "を",
          "待ちます",
        ]),
        correctAnswer: "0",
        explanation:
          "Jawaban: ニュースを聞きながら確報を待ちます。",
      },
      {
        type: "unscramble",
        question:
          "Susunlah  kata-kata berikut berikut menjadi kalimat yang tepat.",
        words: JSON.stringify([
          "方がいいですよ",
          "ニュースの報道を",
          "見た",
          "よく",
        ]),
        correctOrder: JSON.stringify([
          "ニュースの報道を",
          "よく",
          "見た",
          "方がいいですよ",
        ]),
        correctAnswer: "0",
        explanation:
          "Jawaban: ニュースの報道を よく 見た 方がいいですよ",
      },
      // c) Multiple Choice (Model C)
      {
        type: "multiple",
        question:
          "Jukugo apa yang berhubungan dengan makna  “informasi atau keterangan mengenai suatu hal“?",
        options: JSON.stringify(["悲報", "情報", "返報"]),
        correctAnswer: "1",
        explanation: "Kunci: b (情報)",
      },
      {
        type: "multiple",
        question:
          "Jukugo  apa yang berhubungan dengan makna “memberitahukan atau menyampaikan sesuatu agar diketahui oleh orang lain “?",
        options: JSON.stringify(["報知", "特報", "報復"]),
        correctAnswer: "0",
        explanation: "Kunci: a (報知)",
      },
      {
        type: "multiple",
        question:
          "Jukugo apa  yang berhubungan dengan makna  “berita yang disampaikan dengan cepat mengenai suatu peristiwa yang baru terjadi “?",
        options: JSON.stringify(["続報", "勝報", "速報"]),
        correctAnswer: "2",
        explanation: "Kunci: c (速報)",
      },
      {
        type: "multiple",
        question:
          "Jukugo apa yang berhubungan dengan makna “nformasi atau pemberitaan yang disampaikan secara luas kepada masyarakat “?",
        options: JSON.stringify(["外報", "広報", "悲報"]),
        correctAnswer: "1",
        explanation: "Kunci: b (広報)",
      },
      {
        type: "multiple",
        question:
          "Jukugo　apa  yang berhubungan dengan  makna “ memberikan balasan terhadap suatu tindakan yang telah diterima “?",
        options: JSON.stringify(["予報", "報告", "報復"]),
        correctAnswer: "2",
        explanation: "Kunci: c (報復)",
      },
      // d) Fill in the blank (Model D)
      {
        type: "fill",
        question:
          "地震が起きたので、テレビで最新の（　　　　）を確認しました。",
        options: JSON.stringify(["返報", "情報", "報復"]),
        correctAnswer: "1",
        explanation: "Kunci: b (情報)",
      },
      {
        type: "fill",
        question:
          "先生は学生に試験の日を（　　　　）しました。",
        options: JSON.stringify(["報知", "悲報", "外報"]),
        correctAnswer: "0",
        explanation: "Kunci: a (報知)",
      },
      {
        type: "fill",
        question:
          "会社は毎日、仕事の内容を（　　　　）にまとめています。",
        options: JSON.stringify(["公報", "日報", "特報"]),
        correctAnswer: "1",
        explanation: "Kunci: b (日報)",
      },
      {
        type: "fill",
        question:
          "新聞でその事件についての（　　　　）を読みました。",
        options: JSON.stringify(["報道", "予報", "報復"]),
        correctAnswer: "0",
        explanation: "Kunci: a (報道)",
      },
      {
        type: "fill",
        question:
          "天気（　　　　）によると、明日は雨が降るそうです。",
        options: JSON.stringify(["情報", "予報", "悲報"]),
        correctAnswer: "1",
        explanation: "Kunci: b (予報)",
      },
      // Grouping (Model B)
      {
        type: "grouping",
        question:
          "Kelompokkan jukugo kanji 報 berikut ke dalam cabang semantic graph yang tepat.",
        words: JSON.stringify([
          "情報",
          "報知",
          "報告",
          "予報",
          "通報",
          "速報",
          "続報",
          "特報",
          "悲報",
          "勝報",
          "日報",
          "広報",
          "公報",
          "確報",
          "会報",
          "時報",
          "返報",
          "報復",
          "電報",
          "外報",
          "報道",
        ]),
        groups: JSON.stringify([
          {
            name: "1. Informasi / Pemberitahuan",
            correctWords: ["情報", "報知", "報告", "予報", "通報"],
          },
          {
            name: "2. Berita / Jenis Informasi",
            correctWords: ["速報", "続報", "特報", "悲報", "勝報"],
          },
          {
            name: "3. Laporan / Publikasi / Informasi Resmi",
            correctWords: ["日報", "広報", "公報", "確報", "会報", "時報"],
          },
          {
            name: "4. Balasan / Pembalasan",
            correctWords: ["返報", "報復"],
          },
          {
            name: "5. Media / Cara Penyampaian Informasi",
            correctWords: ["電報", "外報", "報道"],
          },
        ]),
        correctAnswer: null,
        explanation: "Kelompokkan 21 kata jukugo kanji 報.",
      },
    ],
  },

  // -------------------------------------------------------------
  // KANJI 伝 (ID: 3226)
  // -------------------------------------------------------------
  {
    id: 3226,
    character: "伝",
    romaji: "den",
    meaning: "Menyampaikan / Mewariskan",
    baseMeaning:
      "menyampaikan, meneruskan, mewariskan, menyebarkan, mengajarkan, dan mengirimkan sesuatu kepada pihak lain.",
    bushuu: "亻",
    onyomi: "デン, テン",
    kunyomi: "つた.わる, つた.える, つた.う",
    categories: [
      {
        name: "1. Penyampaian Pesan dan Informasi",
        jukugos: [
          {
            word: "伝言",
            reading: "でんごん",
            meaning: "pesan / titipan pesan",
            unsur: [
              { jokugo: "伝", arti: "menyampaikan, meneruskan" },
              { jokugo: "言", arti: "kata, ucapan, pesan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 伝 dan 言 menjadi 伝言, menunjukkan bahwa penyampaian dilakukan melalui kata atau ucapan, sehingga membentuk makna “pesan atau titipan pesan.”",
          },
          {
            word: "伝達",
            reading: "でんたつ",
            meaning: "penyampaian",
            unsur: [
              { jokugo: "伝", arti: "menyampaikan, meneruskan" },
              { jokugo: "達", arti: "mencapai, sampai kepada" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 伝 dan 達 menjadi 伝達, menunjukkan proses menyampaikan sesuatu hingga informasi tersebut sampai kepada pihak lain, sehingga membentuk makna “penyampaian atau penyebaran informasi.”",
          },
          {
            word: "伝聞",
            reading: "でんぶん",
            meaning: "kabar",
            unsur: [
              { jokugo: "伝", arti: "menyampaikan, meneruskan" },
              { jokugo: "聞", arti: "mendengar, mendengarkan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 伝 dan 聞 menjadi 伝聞, menunjukkan informasi yang diteruskan melalui apa yang didengar, sehingga membentuk makna “kabar yang didengar dari orang lain.”",
          },
          {
            word: "伝令",
            reading: "でんれい",
            meaning: "utusan",
            unsur: [
              { jokugo: "伝", arti: "menyampaikan, meneruskan" },
              { jokugo: "令", arti: "perintah, instruksi" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 伝 dan 令 menjadi 伝令, menunjukkan seseorang yang menyampaikan perintah atau instruksi kepada pihak lain, sehingga membentuk makna “pembawa atau penyampai pesan/perintah.”",
          },
        ],
      },
      {
        name: "2. Penyampaian dan Pewarisan Ilmu / Ajaran",
        jukugos: [
          {
            word: "伝授",
            reading: "でんじゅ",
            meaning: "mengajarkan",
            unsur: [
              { jokugo: "伝", arti: "meneruskan" },
              { jokugo: "授", arti: "memberikan, mengajarkan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 伝 dan 授 menjadi 伝授, menunjukkan proses meneruskan atau mewariskan pengetahuan/keterampilan dengan cara mengajarkannya, sehingga membentuk makna “mengajarkan atau mewariskan ilmu/keterampilan.”",
          },
          {
            word: "伝受",
            reading: "でんじゅ",
            meaning: "menerima dan meneruskan sesuatu",
            unsur: [
              { jokugo: "伝", arti: "meneruskan, mewariskan" },
              { jokugo: "受", arti: "menerima" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 伝 dan 受 menjadi 伝受, menunjukkan proses menerima sesuatu yang diteruskan atau diwariskan, sehingga membentuk makna “menerima dan meneruskan sesuatu.”",
          },
          {
            word: "伝習",
            reading: "でんしゅう",
            meaning: "mempelajari",
            unsur: [
              { jokugo: "伝", arti: "meneruskan, mewariskan" },
              { jokugo: "習", arti: "belajar, mempelajari" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 伝 dan 習 menjadi 伝習, menunjukkan kegiatan mempelajari sesuatu yang telah diwariskan atau diteruskan, sehingga membentuk makna “mempelajari sesuatu yang diwariskan/diajarkan.”",
          },
          {
            word: "伝道",
            reading: "でんどう",
            meaning: "menyebarkan ajaran",
            unsur: [
              { jokugo: "伝", arti: "meneruskan, menyampaikan" },
              { jokugo: "道", arti: "jalan; ajaran/doktrin" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 伝 dan 道 menjadi 伝道, menunjukkan kegiatan menyampaikan atau meneruskan ajaran atau doktrin, sehingga membentuk makna “menyebarkan atau menyampaikan ajaran.”",
          },
        ],
      },
      {
        name: "3. Pewarisan Tradisi dan Cerita",
        jukugos: [
          {
            word: "伝統",
            reading: "でんとう",
            meaning: "tradisi",
            unsur: [
              { jokugo: "伝", arti: "meneruskan, mewariskan" },
              { jokugo: "統", arti: "menyatukan, meneruskan sebagai satu kesatuan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 伝 dan 統 menjadi 伝統, menunjukkan sesuatu yang diteruskan dan dipertahankan sebagai satu kesatuan dari generasi ke generasi, sehingga membentuk makna “tradisi.”",
          },
          {
            word: "伝説",
            reading: "でんせつ",
            meaning: "legenda",
            unsur: [
              { jokugo: "伝", arti: "meneruskan, menyampaikan" },
              { jokugo: "説", arti: "cerita, penjelasan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 伝 dan 説 menjadi 伝説, menunjukkan cerita atau penjelasan yang diteruskan dan diwariskan dari generasi ke generasi, sehingga membentuk makna “legenda.”",
          },
        ],
      },
      {
        name: "4. Riwayat dan Informasi Tertulis",
        jukugos: [
          {
            word: "伝記",
            reading: "でんき",
            meaning: "biografi / riwayat hidup",
            unsur: [
              { jokugo: "伝", arti: "meneruskan, menyampaikan" },
              { jokugo: "記", arti: "mencatat, catatan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 伝 dan 記 menjadi 伝記, menunjukkan riwayat seseorang yang disampaikan melalui catatan tertulis, sehingga membentuk makna “biografi atau riwayat hidup.”",
          },
          {
            word: "自伝",
            reading: "じでん",
            meaning: "autobiografi",
            unsur: [
              { jokugo: "自", arti: "diri sendiri" },
              { jokugo: "伝", arti: "menyampaikan, meneruskan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 自 dan 伝 menjadi 自伝, menunjukkan riwayat tentang diri sendiri yang disampaikan atau dituliskan, sehingga membentuk makna “autobiografi.”",
          },
          {
            word: "伝書",
            reading: "でんしょ",
            meaning: "dokumen",
            unsur: [
              { jokugo: "伝", arti: "meneruskan, menyampaikan" },
              { jokugo: "書", arti: "menulis, tulisan/dokumen" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 伝 dan 書 menjadi 伝書, menunjukkan tulisan atau dokumen yang diteruskan atau diwariskan, sehingga membentuk makna “tulisan/dokumen yang diwariskan atau disampaikan.”",
          },
          {
            word: "伝写",
            reading: "でんしゃ",
            meaning: "menyalin",
            unsur: [
              { jokugo: "伝", arti: "meneruskan, menyampaikan" },
              { jokugo: "写", arti: "menyalin, menggandakan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 伝 dan 写 menjadi 伝写, menunjukkan proses meneruskan isi tulisan dengan cara menyalin atau menggandakannya, sehingga membentuk makna “menyalin atau meneruskan tulisan.”",
          },
        ],
      },
      {
        name: "5. Pengiriman dan Penerusan",
        jukugos: [
          {
            word: "伝送",
            reading: "でんそう",
            meaning: "pengiriman / transmisi",
            unsur: [
              { jokugo: "伝", arti: "meneruskan, menyampaikan" },
              { jokugo: "送", arti: "mengirim, mengantarkan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 伝 dan 送 menjadi 伝送, menunjukkan sesuatu yang diteruskan atau disampaikan melalui proses pengiriman, sehingga membentuk makna “pengiriman atau transmisi.”",
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
          "伝説を",
          "んです",
          "調べて",
          "古い",
          "いる",
          "この",
        ]),
        correctOrder: JSON.stringify([
          "この",
          "古い",
          "伝説を",
          "調べて",
          "いる",
          "んです",
        ]),
        correctAnswer: "0",
        explanation: "Jawaban: この古い伝説を調べているんです。",
      },
      {
        type: "unscramble",
        question:
          "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify([
          "に",
          "有名な",
          "おいてあります",
          "つくえ",
          "自伝が",
          "人の",
          "上",
        ]),
        correctOrder: JSON.stringify([
          "つくえ",
          "上",
          "に",
          "有名な",
          "人の",
          "自伝が",
          "おいてあります",
        ]),
        correctAnswer: "0",
        explanation:
          "Jawaban: つくえの上に有名な人の自伝がおいてあります。",
      },
      {
        type: "unscramble",
        question:
          "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify([
          "守ります",
          "伝統を",
          "はたらきながら",
          "町の",
        ]),
        correctOrder: JSON.stringify([
          "はたらきながら",
          "町の",
          "伝統を",
          "守ります",
        ]),
        correctAnswer: "0",
        explanation:
          "Jawaban: はたらきながら、町の伝統を守ります。",
      },
      {
        type: "unscramble",
        question:
          "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify([
          "読もう",
          "伝書を",
          "古い",
          "と",
          "思っています",
        ]),
        correctOrder: JSON.stringify([
          "古い",
          "伝書を",
          "読もう",
          "と",
          "思っています",
        ]),
        correctAnswer: "0",
        explanation:
          "Jawaban: 古い伝書を読もうと思っています。",
      },
      {
        type: "unscramble",
        question:
          "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify([
          "その",
          "かもしれません",
          "話は",
          "伝聞に",
          "過ぎない",
        ]),
        correctOrder: JSON.stringify([
          "その",
          "話は",
          "伝聞に",
          "過ぎない",
          "かもしれません",
        ]),
        correctAnswer: "0",
        explanation:
          "Jawaban: その話は伝聞に過ぎないかもしれません。",
      },
      // c) Multiple Choice (Model C)
      {
        type: "multiple",
        question:
          "Jukugo mana yang berhubungan dengan makna “pesan yang dititipkan kepada seseorang untuk disampaikan kepada orang lain”?",
        options: JSON.stringify(["伝言", "伝統", "伝記"]),
        correctAnswer: "0",
        explanation: "Kunci: a (伝言)",
      },
      {
        type: "multiple",
        question:
          "Jukugo mana yang berhubungan dengan makna “tindakan menyampaikan informasi atau sesuatu dari satu pihak kepada pihak lain”?",
        options: JSON.stringify(["伝習", "伝説", "伝達"]),
        correctAnswer: "2",
        explanation: "Kunci: c (伝達)",
      },
      {
        type: "multiple",
        question:
          "Jukugo mana yang berhubungan dengan makna “sesuatu yang didengar atau diketahui dari orang lain tanpa melihat atau mengalaminya secara langsung”?",
        options: JSON.stringify(["伝授", "伝聞", "伝統"]),
        correctAnswer: "1",
        explanation: "Kunci: b (伝聞)",
      },
      {
        type: "multiple",
        question:
          "Jukugo mana yang berhubungan dengan makna “kebiasaan atau budaya yang diwariskan dari generasi ke generasi dan tetap dipertahankan”?",
        options: JSON.stringify(["伝令", "伝統", "伝言"]),
        correctAnswer: "1",
        explanation: "Kunci: b (伝統)",
      },
      {
        type: "multiple",
        question:
          "Jukugo mana yang berhubungan dengan makna “cerita yang diwariskan dari masa lalu dan biasanya mengandung unsur sejarah atau khayalan”?",
        options: JSON.stringify(["伝説", "伝記", "伝達"]),
        correctAnswer: "0",
        explanation: "Kunci: a (伝説)",
      },
      // d) Fill in the blank (Model D)
      {
        type: "fill",
        question:
          "先生からの（　　　　）をクラスのみんなに伝えてください。",
        options: JSON.stringify(["伝言", "伝統", "伝記"]),
        correctAnswer: "0",
        explanation: "Kunci: a (伝言)",
      },
      {
        type: "fill",
        question:
          "大切な情報を学生に正しく（　　　　）する必要があります。",
        options: JSON.stringify(["伝達", "伝説", "自伝"]),
        correctAnswer: "0",
        explanation: "Kunci: a (伝達)",
      },
      {
        type: "fill",
        question:
          "日本には長い歴史を持つ（　　　　）がたくさんあります。",
        options: JSON.stringify(["伝統", "伝令", "伝言"]),
        correctAnswer: "0",
        explanation: "Kunci: a (伝統)",
      },
      {
        type: "fill",
        question:
          "その有名な人物の人生について書かれた（　　　　）を読みました。",
        options: JSON.stringify(["伝説", "伝記", "伝達"]),
        correctAnswer: "1",
        explanation: "Kunci: b (伝記)",
      },
      {
        type: "fill",
        question:
          "昔から伝わってきた話なので、これは有名な（　　　　）です。",
        options: JSON.stringify(["伝説", "伝習", "伝授"]),
        correctAnswer: "0",
        explanation: "Kunci: a (伝説)",
      },
      // Grouping (Model B)
      {
        type: "grouping",
        question:
          "Kelompokkan jukugo kanji 伝 berikut ke dalam cabang semantic graph yang tepat.",
        words: JSON.stringify([
          "伝言",
          "伝達",
          "伝聞",
          "伝令",
          "伝授",
          "伝受",
          "伝習",
          "伝道",
          "伝統",
          "伝説",
          "伝記",
          "自伝",
          "伝書",
          "伝写",
          "伝送",
        ]),
        groups: JSON.stringify([
          {
            name: "1. Penyampaian Pesan dan Informasi",
            correctWords: ["伝言", "伝達", "伝聞", "伝令"],
          },
          {
            name: "2. Penyampaian dan Pewarisan Ilmu / Ajaran",
            correctWords: ["伝授", "伝受", "伝習", "伝道"],
          },
          {
            name: "3. Pewarisan Tradisi dan Cerita",
            correctWords: ["伝統", "伝説"],
          },
          {
            name: "4. Riwayat dan Informasi Tertulis",
            correctWords: ["伝記", "自伝", "伝書", "伝写"],
          },
          {
            name: "5. Pengiriman dan Penerusan",
            correctWords: ["伝送"],
          },
        ]),
        correctAnswer: null,
        explanation: "Kelompokkan 15 kata jukugo kanji 伝.",
      },
    ],
  },

  // -------------------------------------------------------------
  // KANJI 信 (ID: 3227)
  // -------------------------------------------------------------
  {
    id: 3227,
    character: "信",
    romaji: "shin",
    meaning: "Percaya / Informasi",
    baseMeaning:
      "percaya / yakin / kebenaran, menyampaikan, meneruskan, mewariskan, menyebarkan, mengajarkan, dan mengirimkan sesuatu kepada pihak lain.",
    bushuu: "亻",
    onyomi: "シン",
    kunyomi: "-",
    categories: [
      {
        name: "1. Penyampaian Pesan dan Informasi",
        jukugos: [
          {
            word: "信言",
            reading: "しんげん",
            meaning: "kata-kata / pernyataan yang dapat dipercaya",
            unsur: [
              { jokugo: "信", arti: "percaya, dapat dipercaya" },
              { jokugo: "言", arti: "kata, perkataan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 信 dan 言 menjadi 信言, menunjukkan bahwa perkataan atau ucapan yang disampaikan dapat dipercaya kebenarannya.",
          },
          {
            word: "通信",
            reading: "つうしん",
            meaning: "komunikasi / pertukaran informasi",
            unsur: [
              { jokugo: "通", arti: "melalui, menghubungkan" },
              { jokugo: "信", arti: "kabar, informasi, pesan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 通 dan 信 menjadi 通信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “proses penyampaian atau pertukaran informasi antar pihak yang satu dengan pihak lainnya.”",
          },
          {
            word: "発信",
            reading: "はっしん",
            meaning: "mengirim / menyampaikan informasi",
            unsur: [
              { jokugo: "発", arti: "mengeluarkan, mengirim, memulai" },
              { jokugo: "信", arti: "informasi, pesan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 発 dan 信 menjadi 発信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirimkan atau menyampaikan informasi dari suatu pihak kepada pihak lain.”",
          },
          {
            word: "送信",
            reading: "そうしん",
            meaning: "mengirim / mentransmisikan informasi",
            unsur: [
              { jokugo: "送", arti: "mengirim" },
              { jokugo: "信", arti: "informasi, pesan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 送 dan 信 menjadi 送信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirimkan pesan, informasi, atau data kepada pihak lain.”",
          },
          {
            word: "返信",
            reading: "へんしん",
            meaning: "membalas pesan / surat",
            unsur: [
              { jokugo: "返", arti: "mengembalikan, membalas" },
              { jokugo: "信", arti: "surat, pesan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 返 dan 信 menjadi 返信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirimkan kembali pesan atau surat sebagai balasan.”",
          },
          {
            word: "交信",
            reading: "こうしん",
            meaning: "saling berkomunikasi",
            unsur: [
              { jokugo: "交", arti: "saling, berhubungan, bertukar" },
              { jokugo: "信", arti: "pesan, informasi" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 交 dan 信 menjadi 交信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “saling bertukar pesan atau informasi antar dua pihak atau lebih.”",
          },
          {
            word: "信号",
            reading: "しんごう",
            meaning: "tanda / sinyal",
            unsur: [
              { jokugo: "信", arti: "tanda, isyarat" },
              { jokugo: "号", arti: "tanda, simbol, nomor" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 信 dan 号 menjadi 信号, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tanda atau isyarat yang digunakan untuk menyampaikan informasi atau pesan tertentu.”",
          },
        ],
      },
      {
        name: "2. Kepercayaan dan Keyakinan",
        jukugos: [
          {
            word: "信念",
            reading: "しんねん",
            meaning: "keyakinan / prinsip yang diyakini",
            unsur: [
              { jokugo: "信", arti: "percaya, meyakini" },
              { jokugo: "念", arti: "pikiran, keyakinan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 信 dan 念 menjadi 信念, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keyakinan yang dipegang dengan kuat dan tidak mudah berubah.”",
          },
          {
            word: "信者",
            reading: "しんじゃ",
            meaning: "orang yang percaya / penganut",
            unsur: [
              { jokugo: "信", arti: "percaya, meyakini" },
              { jokugo: "者", arti: "orang" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 信 dan 者 menjadi 信者, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “orang yang percaya atau menganut suatu kepercayaan.”",
          },
          {
            word: "信徒",
            reading: "しんと",
            meaning: "penganut agama",
            unsur: [
              { jokugo: "信", arti: "percaya, meyakini" },
              { jokugo: "徒", arti: "pengikut, penganut" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 信 dan 徒 menjadi 信徒, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “orang yang mengikuti atau menganut suatu kepercayaan atau agama.”",
          },
          {
            word: "信頼",
            reading: "しんらい",
            meaning: "kepercayaan / dapat dipercaya",
            unsur: [
              { jokugo: "信", arti: "percaya, kepercayaan" },
              { jokugo: "頼", arti: "mengandalkan, bergantung kepada" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 信 dan 頼 menjadi 信頼, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kepercayaan terhadap seseorang atau sesuatu yang dianggap dapat diandalkan.”",
          },
          {
            word: "信用",
            reading: "しんよう",
            meaning: "kepercayaan / kredibilitas",
            unsur: [
              { jokugo: "信", arti: "percaya, kepercayaan" },
              { jokugo: "用", arti: "menggunakan, kegunaan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 信 dan 用 menjadi 信用, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kepercayaan atau penilaian bahwa seseorang atau sesuatu dapat dipercaya.”",
          },
          {
            word: "信任",
            reading: "しんにん",
            meaning: "kepercayaan / mempercayakan",
            unsur: [
              { jokugo: "信", arti: "percaya, kepercayaan" },
              { jokugo: "任", arti: "mempercayakan, menyerahkan tanggung jawab" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 信 dan 任 menjadi 信任, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memberikan kepercayaan kepada seseorang untuk menjalankan tugas atau tanggung jawab.”",
          },
          {
            word: "信義",
            reading: "しんぎ",
            meaning: "kepercayaan dan kesetiaan",
            unsur: [
              { jokugo: "信", arti: "percaya, dapat dipercaya" },
              { jokugo: "義", arti: "kebenaran, kewajiban moral" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 信 dan 義 menjadi 信義, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kepercayaan dan kesetiaan yang didasarkan pada kebenaran atau prinsip moral.”",
          },
        ],
      },
      {
        name: "3. Keyakinan dan Kepercayaan Diri",
        jukugos: [
          {
            word: "確信",
            reading: "かくしん",
            meaning: "keyakinan kuat / kepastian",
            unsur: [
              { jokugo: "確", arti: "pasti, jelas, memastikan" },
              { jokugo: "信", arti: "percaya, yakin" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 確 dan 信 menjadi 確信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keyakinan yang kuat atau kepastian terhadap sesuatu.”",
          },
          {
            word: "自信",
            reading: "じしん",
            meaning: "percaya diri / keyakinan terhadap diri sendiri",
            unsur: [
              { jokugo: "自", arti: "diri sendiri" },
              { jokugo: "信", arti: "percaya, yakin" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 自 dan 信 menjadi 自信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kepercayaan terhadap diri sendiri atau percaya pada kemampuan diri.”",
          },
        ],
      },
      {
        name: "4. Informasi dan Dokumen",
        jukugos: [
          {
            word: "信書",
            reading: "しんしょ",
            meaning: "surat / dokumen yang disampaikan",
            unsur: [
              { jokugo: "信", arti: "surat, kabar" },
              { jokugo: "書", arti: "tulisan, dokumen, surat" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 信 dan 書 menjadi 信書, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “surat atau dokumen tertulis yang digunakan untuk menyampaikan pesan dari seseorang kepada orang lain.”",
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
          "情報を",
          "前に",
          "発信して",
          "おきます",
          "の",
        ]),
        correctOrder: JSON.stringify([
          "の",
          "前に",
          "情報を",
          "発信して",
          "おきます",
        ]),
        correctAnswer: "0",
        explanation:
          "Jawaban: (会議)の前に、情報を発信しておきます。",
      },
      {
        type: "unscramble",
        question:
          "Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.",
        words: JSON.stringify([
          "信用を",
          "うそを",
          "つけば",
          "なくします",
          "ついたら",
        ]),
        correctOrder: JSON.stringify([
          "うそを",
          "ついたら",
          "信用を",
          "なくします",
        ]),
        correctAnswer: "0",
        explanation: "Jawaban: うそをついたら、信用をなくします。",
      },
      {
        type: "unscramble",
        question:
          "Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.",
        words: JSON.stringify([
          "おいてあります",
          "大切な",
          "の",
          "信書が",
          "上に",
        ]),
        correctOrder: JSON.stringify([
          "の",
          "上に",
          "大切な",
          "信書が",
          "おいてあります",
        ]),
        correctAnswer: "0",
        explanation:
          "Jawaban: (机)の上に大切な信書がおいてあります。",
      },
      {
        type: "unscramble",
        question:
          "Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.",
        words: JSON.stringify([
          "あれば",
          "するでしょう",
          "信念が",
          "く",
        ]),
        correctOrder: JSON.stringify([
          "信念が",
          "く",
          "あれば",
          "するでしょう",
        ]),
        correctAnswer: "0",
        explanation:
          "Jawaban: 信念が(強)くあれば、(せいこう)するでしょう。",
      },
      {
        type: "unscramble",
        question:
          "Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.",
        words: JSON.stringify([
          "返信が",
          "んです",
          "まだ",
          "来ない",
        ]),
        correctOrder: JSON.stringify([
          "返信が",
          "まだ",
          "来ない",
          "んです",
        ]),
        correctAnswer: "0",
        explanation: "Jawaban: 返信がまだ来ないんです。",
      },
      // c) Multiple Choice (Model C)
      {
        type: "multiple",
        question:
          "Jukugo mana yang berhubungan dengan makna “kegiatan saling mengirim dan menerima pesan atau informasi antar dua pihak atau lebih”?",
        options: JSON.stringify(["通信", "信号", "信念"]),
        correctAnswer: "0",
        explanation: "Kunci: a (通信)",
      },
      {
        type: "multiple",
        question:
          "Jukugo mana yang berhubungan dengan makna “kegiatan mengirim pesan atau informasi kepada orang lain melalui suatu media”?",
        options: JSON.stringify(["発信", "自信", "信者"]),
        correctAnswer: "0",
        explanation: "Kunci: a (発信)",
      },
      {
        type: "multiple",
        question:
          "Jukugo mana yang berhubungan dengan makna “tindakan membalas pesan atau surat yang telah diterima dari orang lain”?",
        options: JSON.stringify(["信頼", "返信", "信号"]),
        correctAnswer: "1",
        explanation: "Kunci: b (返信)",
      },
      {
        type: "multiple",
        question:
          "Jukugo mana yang berhubungan dengan makna “tanda yang digunakan untuk menyampaikan informasi atau petunjuk tertentu”?",
        options: JSON.stringify(["信書", "信義", "信号"]),
        correctAnswer: "2",
        explanation: "Kunci: c (信号)",
      },
      {
        type: "multiple",
        question:
          "Jukugo mana yang berhubungan dengan makna “keyakinan atau prinsip yang diyakini dan dijadikan pegangan oleh seseorang”?",
        options: JSON.stringify(["信念", "信者", "自信"]),
        correctAnswer: "0",
        explanation: "Kunci: a (信念)",
      },
      // d) Fill in the blank (Model D)
      {
        type: "fill",
        question:
          "インターネットを使って友達と（　　　　）しています。",
        options: JSON.stringify(["通信", "信号", "信念"]),
        correctAnswer: "0",
        explanation: "Kunci: a (通信)",
      },
      {
        type: "fill",
        question:
          "メールを受け取ったので、すぐに（　　　　）しました。",
        options: JSON.stringify(["信頼", "返信", "信用"]),
        correctAnswer: "1",
        explanation: "Kunci: b (返信)",
      },
      {
        type: "fill",
        question:
          "駅では赤い（　　　　）が見えたら、電車に注意してください。",
        options: JSON.stringify(["信号", "信者", "信念"]),
        correctAnswer: "0",
        explanation: "Kunci: a (信号)",
      },
      {
        type: "fill",
        question:
          "彼は自分の力を信じる強い（　　　　）を持っています。",
        options: JSON.stringify(["自信", "信書", "信号"]),
        correctAnswer: "0",
        explanation: "Kunci: a (自信)",
      },
      {
        type: "fill",
        question:
          "私は約束を守る彼をとても（　　　　）しています。",
        options: JSON.stringify(["信号", "信頼", "信念"]),
        correctAnswer: "1",
        explanation: "Kunci: b (信頼)",
      },
      // Grouping (Model B)
      {
        type: "grouping",
        question:
          "Kelompokkan jukugo kanji 信 berikut ke dalam cabang semantic graph yang tepat.",
        words: JSON.stringify([
          "信言",
          "通信",
          "発信",
          "送信",
          "返信",
          "交信",
          "信号",
          "信念",
          "信者",
          "信徒",
          "信頼",
          "信用",
          "信任",
          "信義",
          "確信",
          "自信",
          "信書",
        ]),
        groups: JSON.stringify([
          {
            name: "1. Penyampaian Pesan dan Informasi",
            correctWords: [
              "信言",
              "通信",
              "発信",
              "送信",
              "返信",
              "交信",
              "信号",
            ],
          },
          {
            name: "2. Kepercayaan dan Keyakinan",
            correctWords: [
              "信念",
              "信者",
              "信徒",
              "信頼",
              "信用",
              "信任",
              "信義",
            ],
          },
          {
            name: "3. Keyakinan dan Kepercayaan Diri",
            correctWords: ["確信", "自信"],
          },
          {
            name: "4. Informasi dan Dokumen",
            correctWords: ["信書"],
          },
        ]),
        correctAnswer: null,
        explanation: "Kelompokkan 17 kata jukugo kanji 信.",
      },
    ],
  },

  // -------------------------------------------------------------
  // KANJI 送 (ID: 3229)
  // -------------------------------------------------------------
  {
    id: 3229,
    character: "送",
    romaji: "sou",
    meaning: "Mengirim / Mengantarkan",
    baseMeaning:
      "mengirim, menyampaikan, mengantarkan, mengirimkan ke suatu tempat atau kepada seseorang.",
    bushuu: "辶",
    onyomi: "ソウ",
    kunyomi: "おく.る",
    categories: [
      {
        name: "1. Pengiriman Informasi / Pesan",
        jukugos: [
          {
            word: "送信",
            reading: "そうしん",
            meaning: "mengirim pesan / mengirimkan (data/informasi)",
            unsur: [
              { jokugo: "送", arti: "mengirim, menyampaikan" },
              { jokugo: "信", arti: "pesan, informasi" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 送 dan 信 menjadi 送信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirim pesan atau mengirimkan data/informasi.”",
          },
          {
            word: "電送",
            reading: "でんそう",
            meaning: "pengiriman melalui media elektronik / transmisi elektronik",
            unsur: [
              { jokugo: "電", arti: "listrik, elektronik" },
              { jokugo: "送", arti: "mengirim, mentransmisikan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 電 dan 送 menjadi 電送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengiriman melalui media elektronik atau transmisi elektronik.”",
          },
          {
            word: "伝送",
            reading: "でんそう",
            meaning: "meneruskan / mentransmisikan informasi, sinyal",
            unsur: [
              { jokugo: "伝", arti: "meneruskan, menyampaikan" },
              { jokugo: "送", arti: "mengirim, mentransmisikan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 伝 dan 送 menjadi 伝送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “meneruskan atau mentransmisikan informasi/sinyal.”",
          },
          {
            word: "放送",
            reading: "ほうそう",
            meaning: "siaran",
            unsur: [
              { jokugo: "放", arti: "melepaskan, menyebarkan" },
              { jokugo: "送", arti: "mengirim, menyampaikan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 放 dan 送 menjadi 放送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna siaran atau penyebaran informasi kepada banyak orang.”",
          },
        ],
      },
      {
        name: "2. Pengiriman / Pengantaran Benda / Barang",
        jukugos: [
          {
            word: "発送",
            reading: "はっそう",
            meaning: "mengirim / mengeluarkan kiriman",
            unsur: [
              { jokugo: "発", arti: "mengeluarkan, memulai, mengirim" },
              { jokugo: "送", arti: "mengirim, mengantarkan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 発 dan 送 menjadi 発送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirim atau mengeluarkan kiriman.”",
          },
          {
            word: "直送",
            reading: "ちょくそう",
            meaning: "pengiriman langsung ke tujuan",
            unsur: [
              { jokugo: "直", arti: "langsung" },
              { jokugo: "送", arti: "mengirim, mengantarkan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 直 dan 送 menjadi 直送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengiriman langsung ke tujuan.”",
          },
          {
            word: "送付",
            reading: "そうふ",
            meaning: "mengirimkan (barang, dokumen, surat, dll.)",
            unsur: [
              { jokugo: "送", arti: "mengirim, mengantarkan" },
              { jokugo: "付", arti: "menyerahkan, melampirkan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 送 dan 付 menjadi 送付, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirimkan barang, dokumen, surat, dan sebagainya.”",
          },
          {
            word: "郵送",
            reading: "ゆうそう",
            meaning: "mengirim melalui pos / surat",
            unsur: [
              { jokugo: "郵", arti: "pos" },
              { jokugo: "送", arti: "mengirim" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 郵 dan 送 menjadi 郵送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirim melalui pos atau surat.”",
          },
          {
            word: "配送",
            reading: "はいそう",
            meaning: "pengiriman (barang, paket, pesanan)",
            unsur: [
              { jokugo: "配", arti: "membagikan, mendistribusikan" },
              { jokugo: "送", arti: "mengirim, mengantarkan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 配 dan 送 menjadi 配送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengiriman barang, paket, atau pesanan.”",
          },
          {
            word: "輸送",
            reading: "ゆそう",
            meaning: "mengangkut / mengirim barang atau penumpang",
            unsur: [
              { jokugo: "輸", arti: "mengangkut, memindahkan" },
              { jokugo: "送", arti: "mengirim, mengantarkan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 輸 dan 送 menjadi 輸送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengangkut atau mengirim barang atau penumpang.”",
          },
          {
            word: "移送",
            reading: "いそう",
            meaning: "memindahkan / mengirim ke tempat lain",
            unsur: [
              { jokugo: "移", arti: "memindahkan" },
              { jokugo: "送", arti: "mengirim, mengantarkan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 移 dan 送 menjadi 移送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memindahkan atau mengirim ke tempat lain.”",
          },
          {
            word: "回送",
            reading: "かいそう",
            meaning: "mengirim kembali / mengirim ke tempat asal",
            unsur: [
              { jokugo: "回", arti: "kembali, berputar" },
              { jokugo: "送", arti: "mengirim, mengantarkan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 回 dan 送 menjadi 回送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirim kembali atau mengirim ke tempat asal/tempat lain.”",
          },
          {
            word: "転送",
            reading: "てんそう",
            meaning: "meneruskan / mengalihkan kiriman ke tujuan lain",
            unsur: [
              { jokugo: "転", arti: "berpindah, mengalihkan" },
              { jokugo: "送", arti: "mengirim, meneruskan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 転 dan 送 menjadi 転送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk “meneruskan atau mengalihkan kiriman ke tujuan lain.”",
          },
          {
            word: "押送",
            reading: "おうそう",
            meaning: "mengawal / mengantar dengan kendaraan resmi",
            unsur: [
              { jokugo: "押", arti: "mengawal, membawa secara paksa" },
              { jokugo: "送", arti: "mengantar, membawa" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 押 dan 送 menjadi 押送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengawal atau mengantar seseorang dengan kendaraan resmi.”",
          },
        ],
      },
      {
        name: "3. Penyerahan / Pengiriman kepada Pihak Berwenang",
        jukugos: [
          {
            word: "送検",
            reading: "そうけん",
            meaning: "mengirim tersangka / berkas perkara ke jaksa",
            unsur: [
              { jokugo: "送", arti: "mengirim, menyerahkan" },
              { jokugo: "検", arti: "pemeriksaan, penyelidikan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 送 dan 検 menjadi 送検, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengirim tersangka atau berkas perkara ke jaksa untuk dituntut.”",
          },
          {
            word: "送信",
            reading: "そうしん",
            meaning: "menyerahkan / mengirim kepada pihak berwenang",
            unsur: [
              { jokugo: "送", arti: "mengirim, menyampaikan" },
              { jokugo: "信", arti: "pesan, informasi; kepercayaan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 送 dan 信 menjadi 送信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menyerahkan atau mengirim kepada pihak berwenang.”",
          },
          {
            word: "護送",
            reading: "ごそう",
            meaning: "mengawal / mengantar terdakwa, tahanan, dsb.",
            unsur: [
              { jokugo: "護", arti: "melindungi, mengawal" },
              { jokugo: "送", arti: "mengantar, membawa" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 護 dan 送 menjadi 護送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengawal atau mengantar terdakwa, tahanan, dan sebagainya.”",
          },
          {
            word: "押送",
            reading: "おうそう",
            meaning: "mengawal / mengantar seseorang dengan kendaraan resmi",
            unsur: [
              { jokugo: "押", arti: "mengawal, membawa secara paksa" },
              { jokugo: "送", arti: "mengantar, membawa" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 押 dan 送 menjadi 押送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengawal atau mengantar seseorang dengan kendaraan resmi.”",
          },
        ],
      },
      {
        name: "4. Mengirim / Melepas Orang yang Pergi",
        jukugos: [
          {
            word: "送別",
            reading: "そうべつ",
            meaning: "perpisahan / mengantar seseorang yang pergi",
            unsur: [
              { jokugo: "送", arti: "mengantar, melepas" },
              { jokugo: "別", arti: "berpisah, perpisahan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 送 dan 別 menjadi 送別, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perpisahan atau mengantar seseorang yang pergi.”",
          },
          {
            word: "歓送",
            reading: "かんそう",
            meaning: "melepas dengan ucapan selamat / penghormatan",
            unsur: [
              { jokugo: "歓", arti: "senang, gembira" },
              { jokugo: "送", arti: "mengantar, melepas" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 歓 dan 送 menjadi 歓送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “melepas atau mengantar seseorang dengan ucapan selamat atau penghormatan.”",
          },
          {
            word: "送辞",
            reading: "そうじ",
            meaning: "pidato perpisahan / ucapan saat mengantar pergi",
            unsur: [
              { jokugo: "送", arti: "mengantar, melepas" },
              { jokugo: "辞", arti: "kata-kata, ucapan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 送 dan 辞 menjadi 送辞, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pidato perpisahan atau ucapan saat mengantar pergi.”",
          },
          {
            word: "押送",
            reading: "おうそう",
            meaning: "mengantar / melepas jenazah (dalam konteks pemakaman)",
            unsur: [
              { jokugo: "押", arti: "mengawal, membawa secara paksa" },
              { jokugo: "送", arti: "mengantar, membawa" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 押 dan 送 menjadi 押送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengawal atau mengantar seseorang dengan kendaraan resmi (dalam konteks pemakaman).”",
          },
        ],
      },
      {
        name: "5. Pengiriman Melalui Jalur Khusus",
        jukugos: [
          {
            word: "陸送",
            reading: "りくそう",
            meaning: "pengiriman melalui jalur darat",
            unsur: [
              { jokugo: "陸", arti: "darat" },
              { jokugo: "送", arti: "mengirim, mengangkut" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 陸 dan 送 menjadi 陸送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengiriman melalui jalur darat.”",
          },
          {
            word: "電送",
            reading: "でんそう",
            meaning: "pengiriman melalui jalur listrik / transmisi elektronik",
            unsur: [
              { jokugo: "電", arti: "listrik, elektronik" },
              { jokugo: "送", arti: "mengirim, mentransmisikan" },
            ],
            penjelasan:
              "Hubungan makna antar kanji 電 dan 送 menjadi 電送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna pengiriman melalui media jalur listrik atau transmisi elektronik.",
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
          "船で",
          "輸送すれば",
          "安くなるでしょう",
          "荷物を",
        ]),
        correctOrder: JSON.stringify([
          "船で",
          "荷物を",
          "輸送すれば",
          "安くなるでしょう",
        ]),
        correctAnswer: "0",
        explanation:
          "Jawaban: 船で荷物を輸送すれば、安くなるでしょう。",
      },
      {
        type: "unscramble",
        question:
          "Susunlah kalimat dari kata-kata berikut (5x5=25)",
        words: JSON.stringify([
          "時間が",
          "データ",
          "の",
          "かかるかもしれません",
          "伝送に",
        ]),
        correctOrder: JSON.stringify([
          "データ",
          "の",
          "伝送に",
          "時間が",
          "かかるかもしれません",
        ]),
        correctAnswer: "0",
        explanation:
          "Jawaban: データの伝送に時間がかかるかもしれません。",
      },
      {
        type: "unscramble",
        question:
          "Susunlah kalimat dari kata-kata berikut (5x5=25)",
        words: JSON.stringify([
          "注文した",
          "直送して",
          "おきます",
          "果物を",
          "家に",
        ]),
        correctOrder: JSON.stringify([
          "注文した",
          "果物を",
          "家に",
          "直送して",
          "おきます",
        ]),
        correctAnswer: "0",
        explanation:
          "Jawaban: 注文した果物を家に直送しておきます。",
      },
      {
        type: "unscramble",
        question:
          "Susunlah kalimat dari kata-kata berikut (5x5=25)",
        words: JSON.stringify([
          "練習しよう",
          "式の",
          "前に",
          "送辞を",
          "と",
          "思っています",
        ]),
        correctOrder: JSON.stringify([
          "式の",
          "前に",
          "送辞を",
          "練習しよう",
          "と",
          "思っています",
        ]),
        correctAnswer: "0",
        explanation:
          "Jawaban: 式の前に送辞を練習しようと思っています。",
      },
      {
        type: "unscramble",
        question:
          "Susunlah kalimat dari kata-kata berikut (5x5=25)",
        words: JSON.stringify([
          "放送を",
          "聞いた",
          "ほうが",
          "館内の",
          "いいです",
        ]),
        correctOrder: JSON.stringify([
          "館内の",
          "放送を",
          "聞いた",
          "ほうが",
          "いいです",
        ]),
        correctAnswer: "0",
        explanation:
          "Jawaban: 館内の放送を聞いたほうがいいです。",
      },
      // c) Multiple Choice (Model C)
      {
        type: "multiple",
        question:
          "Jukugo mana yang berhubungan dengan makna “kegiatan mengirim barang atau benda dari satu tempat ke tempat lain”?",
        options: JSON.stringify(["歓送", "送別", "発送"]),
        correctAnswer: "2",
        explanation: "Kunci: c (発送)",
      },
      {
        type: "multiple",
        question:
          "Jukugo mana yang berhubungan dengan makna “kegiatan mengirim surat atau barang menggunakan layanan pos”?",
        options: JSON.stringify(["郵送", "送別", "送検"]),
        correctAnswer: "0",
        explanation: "Kunci: a (郵送)",
      },
      {
        type: "multiple",
        question:
          "Jukugo mana yang berhubungan dengan makna “kegiatan mengirim atau menyampaikan informasi melalui alat komunikasi”?",
        options: JSON.stringify(["送信", "送別", "転送"]),
        correctAnswer: "0",
        explanation: "Kunci: a (送信)",
      },
      {
        type: "multiple",
        question:
          "Jukugo mana yang berhubungan dengan makna “kegiatan mengantarkan atau mengirim barang sampai ke tempat tujuan”?",
        options: JSON.stringify(["歓送", "配送", "送辞"]),
        correctAnswer: "1",
        explanation: "Kunci: b (配送)",
      },
      {
        type: "multiple",
        question:
          "Jukugo mana yang berhubungan dengan makna “kegiatan mengucapkan atau menyampaikan kata-kata ketika seseorang akan meninggalkan suatu tempat atau kelompok”?",
        options: JSON.stringify(["送辞", "郵送", "輸送"]),
        correctAnswer: "0",
        explanation: "Kunci: a (送辞)",
      },
      // d) Fill in the blank (Model D)
      {
        type: "fill",
        question:
          "荷物を明日の朝、東京へ（　　　　）します。",
        options: JSON.stringify(["発別", "発送", "送辞"]),
        correctAnswer: "1",
        explanation: "Kunci: b (発送)",
      },
      {
        type: "fill",
        question:
          "日本からインドネシアへ手紙を（　　　　）しました。",
        options: JSON.stringify(["郵送", "送別", "送辞"]),
        correctAnswer: "0",
        explanation: "Kunci: a (郵送)",
      },
      {
        type: "fill",
        question:
          "友達が引っ越すので、みんなで（　　　　）の会を開きました。",
        options: JSON.stringify(["送信", "送別", "送検"]),
        correctAnswer: "1",
        explanation: "Kunci: b (送別)",
      },
      {
        type: "fill",
        question:
          "メールを友達に（　　　　）しました。",
        options: JSON.stringify(["送信", "送別", "送辞"]),
        correctAnswer: "0",
        explanation: "Kunci: a (送信)",
      },
      {
        type: "fill",
        question:
          "会社は新しい商品を全国の店に（　　　　）しています。",
        options: JSON.stringify(["送別", "配送", "送辞"]),
        correctAnswer: "1",
        explanation: "Kunci: b (配送)",
      },
      // Grouping (Model B)
      {
        type: "grouping",
        question:
          "Kelompokkan jukugo kanji 送 berikut ke dalam cabang semantic graph yang tepat.",
        words: JSON.stringify([
          "送信",
          "電送",
          "伝送",
          "放送",
          "発送",
          "直送",
          "送付",
          "郵送",
          "配送",
          "輸送",
          "移送",
          "回送",
          "転送",
          "押送",
          "送検",
          "送達",
          "護送",
          "送別",
          "歓送",
          "送辞",
          "葬送",
          "陸送",
        ]),
        groups: JSON.stringify([
          {
            name: "1. Pengiriman Informasi / Pesan",
            correctWords: ["送信", "電送", "伝送", "放送"],
          },
          {
            name: "2. Pengiriman / Pengantaran Benda / Barang",
            correctWords: [
              "発送",
              "直送",
              "送付",
              "郵送",
              "配送",
              "輸送",
              "移送",
              "回送",
              "転送",
              "押送",
            ],
          },
          {
            name: "3. Penyerahan / Pengiriman kepada Pihak Berwenang",
            correctWords: ["送検", "送達", "護送"],
          },
          {
            name: "4. Mengirim / Melepas Orang yang Pergi",
            correctWords: ["送別", "歓送", "送辞", "葬送"],
          },
          {
            name: "5. Pengiriman Melalui Jalur Khusus",
            correctWords: ["陸送"],
          },
        ]),
        correctAnswer: null,
        explanation: "Kelompokkan 24 kata jukugo kanji 送.",
      },
    ],
  },
];

async function main() {
  console.log("=== MEMULAI SINKRONISASI KETAT MODUL 3 (情・報・伝・信・送) ===");

  for (const kd of MODUL_3_DATA) {
    console.log(`\nProcessing Kanji ${kd.character} (id: ${kd.id})...`);

    // 1. Update info dasar kanji
    await prisma.kanji.update({
      where: { id: kd.id },
      data: {
        romaji: kd.romaji,
        meaning: kd.meaning,
        baseMeaning: kd.baseMeaning,
        bushuu: kd.bushuu,
        onyomi: kd.onyomi,
        kunyomi: kd.kunyomi,
        moduleId: 557,
      },
    });

    // 2. Nolkan KanjiGraphEdge manual lama agar graf murni berhirarki bersih
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
        // Bersihkan nama jukugo dari suffix penanda jika ada (misal: 電送_線 -> 電送)
        const cleanWord = jk.word.replace(/_[a-zA-Z0-9_\u4e00-\u9faf]+$/, "");

        const createdJukugo = await prisma.jukugo.create({
          data: {
            kanjiId: kd.id,
            word: cleanWord,
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

    // 6. Simpan kuis-kuis baru
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

  console.log("\n=== SINKRONISASI MODUL 3 SUKSES 100% ===");
}

main()
  .catch((e) => {
    console.error("Error saat sinkronisasi Modul 3:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
