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

const MODUL_4_DATA: KanjiData[] = [
  // =============================================================
  // 1. KANJI 職 (ID: 3230)
  // =============================================================
  {
    id: 3230,
    character: "職",
    romaji: "SHOKU, SHIKI",
    meaning: "Pekerjaan, Profesi",
    baseMeaning: "pekerjaan, jabatan, atau profesi.",
    bushuu: "耳",
    onyomi: "ショク, シキ",
    kunyomi: "-",
    categories: [
      {
        name: "1. Profesi / Pekerjaan",
        jukugos: [
          {
            word: "職業",
            reading: "しょくぎょう",
            meaning: "profesi / pekerjaan",
            unsur: [
              { jokugo: "職", arti: "pekerjaan, jabatan, profesi" },
              { jokugo: "業", arti: "pekerjaan, usaha, kegiatan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 職 dan 業 menjadi 職業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “profesi atau pekerjaan yang dilakukan seseorang.”"
          },
          {
            word: "職人",
            reading: "しょくにん",
            meaning: "pengrajin / pekerja terampil",
            unsur: [
              { jokugo: "職", arti: "pekerjaan, profesi" },
              { jokugo: "人", arti: "orang, manusia" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 職 dan 人 menjadi 職人, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “orang yang memiliki pekerjaan atau keterampilan khusus, terutama sebagai pengrajin atau pekerja terampil.”"
          }
        ]
      },
      {
        name: "2. Orang / Tempat Kerja",
        jukugos: [
          {
            word: "職員",
            reading: "しょくいん",
            meaning: "staf / pegawai",
            unsur: [
              { jokugo: "職", arti: "pekerjaan, jabatan" },
              { jokugo: "員", arti: "anggota, staf" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 職 dan 員 menjadi 職員, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “orang yang bekerja sebagai staf atau pegawai dalam suatu organisasi.”"
          },
          {
            word: "職場",
            reading: "しょくば",
            meaning: "tempat kerja",
            unsur: [
              { jokugo: "職", arti: "pekerjaan" },
              { jokugo: "場", arti: "tempat" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 職 dan 場 menjadi 職場, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tempat berlangsungnya kegiatan pekerjaan.”"
          }
        ]
      },
      {
        name: "3. Mencari / Memiliki Pekerjaan",
        jukugos: [
          {
            word: "求職",
            reading: "きゅうしょく",
            meaning: "mencari pekerjaan",
            unsur: [
              { jokugo: "求", arti: "mencari, meminta" },
              { jokugo: "職", arti: "pekerjaan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 求 dan 職 menjadi 求職, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan mencari pekerjaan.”"
          },
          {
            word: "有職",
            reading: "ゆうしょく",
            meaning: "memiliki pekerjaan",
            unsur: [
              { jokugo: "有", arti: "ada, memiliki" },
              { jokugo: "職", arti: "pekerjaan, jabatan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 有 dan 職 menjadi 有職, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keadaan memiliki pekerjaan atau jabatan.”"
          }
        ]
      },
      {
        name: "4. Perubahan / Status Pekerjaan",
        jukugos: [
          {
            word: "転職",
            reading: "てんしょく",
            meaning: "pindah pekerjaan",
            unsur: [
              { jokugo: "転", arti: "berpindah, beralih" },
              { jokugo: "職", arti: "pekerjaan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 転 dan 職 menjadi 転職, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “berpindah dari satu pekerjaan ke pekerjaan lain.”"
          },
          {
            word: "退職",
            reading: "たいしょく",
            meaning: "berhenti bekerja",
            unsur: [
              { jokugo: "退", arti: "mundur, berhenti" },
              { jokugo: "職", arti: "pekerjaan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 退 dan 職 menjadi 退職, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “berhenti dari pekerjaan atau jabatan.”"
          },
          {
            word: "無職",
            reading: "むしょく",
            meaning: "tidak bekerja / pengangguran",
            unsur: [
              { jokugo: "無", arti: "tidak ada, tanpa" },
              { jokugo: "職", arti: "pekerjaan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 無 dan 職 menjadi 無職, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keadaan tidak memiliki pekerjaan.”"
          }
        ]
      }
    ],
    quizzes: [
      // 5 Unscramble
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["有職者が", "増えている", "最近", "んです"]),
        correctOrder: JSON.stringify(["最近", "有職者が", "増えている", "んです"]),
        correctAnswer: "0",
        explanation: "Jawaban: 最近有職者が増えているんです。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["辞職するな！", "簡単に", "会社を"]),
        correctOrder: JSON.stringify(["簡単に", "会社を", "辞職するな！"]),
        correctAnswer: "0",
        explanation: "Jawaban: 簡単に会社を辞職するな！"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["職能を", "高めようと", "研修で", "思っています"]),
        correctOrder: JSON.stringify(["研修で", "職能を", "高めようと", "思っています"]),
        correctAnswer: "0",
        explanation: "Jawaban: 研修で職能を高めようと思っています。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["しく", "書類に", "書いてあります", "職歴が"]),
        correctOrder: JSON.stringify(["書類に", "職歴が", "しく", "書いてあります"]),
        correctAnswer: "0",
        explanation: "Jawaban: 書類に職歴が詳しく書いてあります。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["休職した", "体調が", "方が", "悪いときは", "いいです"]),
        correctOrder: JSON.stringify(["体調が", "悪いときは", "休職した", "方が", "いいです"]),
        correctAnswer: "0",
        explanation: "Jawaban: 体調が悪いときは休職した方がいいです。"
      },

      // 5 Multiple Choice (Section c)
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “profesi atau pekerjaan yang dilakukan seseorang”?",
        options: JSON.stringify(["職業", "職場", "職員"]),
        correctAnswer: "職業",
        explanation: "Kunci Jawaban: ① a"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “orang yang bekerja sebagai staf atau pegawai”?",
        options: JSON.stringify(["職人", "職員", "職業"]),
        correctAnswer: "職員",
        explanation: "Kunci Jawaban: ② b"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “tempat seseorang bekerja”?",
        options: JSON.stringify(["職場", "職人", "求職"]),
        correctAnswer: "職場",
        explanation: "Kunci Jawaban: ③ a"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “orang yang memiliki keterampilan tertentu dan bekerja sebagai pengrajin atau pekerja terampil”?",
        options: JSON.stringify(["職員", "職人", "職場"]),
        correctAnswer: "職人",
        explanation: "Kunci Jawaban: ④ b"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “berhenti dari pekerjaan”?",
        options: JSON.stringify(["退職", "職業", "有職"]),
        correctAnswer: "退職",
        explanation: "Kunci Jawaban: ⑤ a"
      },

      // 5 Fill-in-the-blank (Section d)
      {
        type: "fill",
        question: "私は大学を卒業したら、（　　　　）を探すつもりです。",
        options: JSON.stringify(["職場", "職業", "求職"]),
        correctAnswer: "職場",
        explanation: "Kunci Jawaban: ① a"
      },
      {
        type: "fill",
        question: "父は銀行で（　　　　）をしています。",
        options: JSON.stringify(["職員", "職業", "職人"]),
        correctAnswer: "職員",
        explanation: "Kunci Jawaban: ② a"
      },
      {
        type: "fill",
        question: "会社を変えたいんですが、（　　　　）したほうがいいですか。",
        options: JSON.stringify(["退職", "転職", "有職"]),
        correctAnswer: "転職",
        explanation: "Kunci Jawaban: ③ b"
      },
      {
        type: "fill",
        question: "仕事がないので、今（　　　　）です。",
        options: JSON.stringify(["有職", "職人", "無職"]),
        correctAnswer: "無職",
        explanation: "Kunci Jawaban: ④ c"
      },
      {
        type: "fill",
        question: "ここは私の（　　　　）です。毎日ここで働いています。",
        options: JSON.stringify(["職場", "職業", "求職"]),
        correctAnswer: "職場",
        explanation: "Kunci Jawaban: ⑤ a"
      },

      // 1 Grouping
      {
        type: "grouping",
        question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
        groups: JSON.stringify([
          { name: "Profesi / Pekerjaan", correctWords: ["職業", "職人"] },
          { name: "Orang / Tempat Kerja", correctWords: ["職員", "職場"] },
          { name: "Mencari / Memiliki Pekerjaan", correctWords: ["求職", "有職"] },
          { name: "Perubahan / Status Pekerjaan", correctWords: ["転職", "退職", "無職"] }
        ]),
        explanation: "Kelompokkan jukugo kanji 職 ke dalam 4 kategori makna yang tepat."
      }
    ]
  },

  // =============================================================
  // 2. KANJI 業 (ID: 3231)
  // =============================================================
  {
    id: 3231,
    character: "業",
    romaji: "GYOU, GOU",
    meaning: "Pekerjaan, Usaha, Kegiatan",
    baseMeaning: "pekerjaan, usaha, atau kegiatan.",
    bushuu: "木",
    onyomi: "ギョウ, ゴウ",
    kunyomi: "わざ",
    categories: [
      {
        name: "1. Pekerjaan / Tugas",
        jukugos: [
          {
            word: "業務",
            reading: "ぎょうむ",
            meaning: "tugas / pekerjaan",
            unsur: [
              { jokugo: "業", arti: "pekerjaan, kegiatan" },
              { jokugo: "務", arti: "tugas, kewajiban" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 業 dan 務 menjadi 業務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tugas atau pekerjaan yang menjadi tanggung jawab seseorang dalam suatu pekerjaan atau organisasi.”"
          },
          {
            word: "作業",
            reading: "さぎょう",
            meaning: "pekerjaan / tugas",
            unsur: [
              { jokugo: "作", arti: "mengerjakan, membuat" },
              { jokugo: "業", arti: "pekerjaan, kegiatan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 作 dan 業 menjadi 作業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pekerjaan atau kegiatan yang dilakukan untuk menyelesaikan suatu tugas.”"
          },
          {
            word: "始業",
            reading: "しぎょう",
            meaning: "mulai kerja",
            unsur: [
              { jokugo: "始", arti: "mulai" },
              { jokugo: "業", arti: "pekerjaan, kegiatan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 始 dan 業 menjadi 始業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “dimulainya kegiatan kerja atau waktu ketika pekerjaan dimulai.”"
          },
          {
            word: "残業",
            reading: "ざんぎょう",
            meaning: "kerja lembur",
            unsur: [
              { jokugo: "残", arti: "tersisa, tetap" },
              { jokugo: "業", arti: "pekerjaan, kegiatan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 残 dan 業 menjadi 残業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pekerjaan yang dilakukan setelah waktu kerja normal berakhir atau pekerjaan lembur.”"
          },
          {
            word: "就業",
            reading: "しゅうぎょう",
            meaning: "bekerja / mulai bekerja",
            unsur: [
              { jokugo: "就", arti: "mulai melakukan, menjalankan" },
              { jokugo: "業", arti: "pekerjaan, kegiatan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 就 dan 業 menjadi 就業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan bekerja atau keadaan seseorang mulai menjalankan suatu pekerjaan.”"
          },
          {
            word: "失業",
            reading: "しつぎょう",
            meaning: "kehilangan pekerjaan / pengangguran",
            unsur: [
              { jokugo: "失", arti: "kehilangan" },
              { jokugo: "業", arti: "pekerjaan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 失 dan 業 menjadi 失業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keadaan seseorang kehilangan pekerjaan atau tidak memiliki pekerjaan.”"
          }
        ]
      },
      {
        name: "2. Usaha / Bisnis / Dunia Kerja",
        jukugos: [
          {
            word: "営業",
            reading: "えいぎょう",
            meaning: "usaha / bisnis / penjualan",
            unsur: [
              { jokugo: "営", arti: "menjalankan, mengelola" },
              { jokugo: "業", arti: "usaha, kegiatan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 営 dan 業 menjadi 営業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan menjalankan usaha atau bisnis, termasuk kegiatan penjualan dan pelayanan.”"
          },
          {
            word: "業者",
            reading: "ぎょうしゃ",
            meaning: "pelaku usaha / pedagang",
            unsur: [
              { jokugo: "業", arti: "usaha, pekerjaan" },
              { jokugo: "者", arti: "orang, pelaku" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 業 dan 者 menjadi 業者, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “orang atau pihak yang menjalankan suatu usaha atau pekerjaan tertentu.”"
          },
          {
            word: "業界",
            reading: "ぎょうかい",
            meaning: "dunia usaha / industri",
            unsur: [
              { jokugo: "業", arti: "usaha, pekerjaan" },
              { jokugo: "界", arti: "dunia, bidang" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 業 dan 界 menjadi 業界, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “suatu bidang atau lingkungan usaha dan industri tertentu.”"
          },
          {
            word: "家業",
            reading: "かぎょう",
            meaning: "usaha keluarga",
            unsur: [
              { jokugo: "家", arti: "keluarga, rumah" },
              { jokugo: "業", arti: "usaha, pekerjaan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 家 dan 業 menjadi 家業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “usaha atau pekerjaan yang dijalankan oleh suatu keluarga.”"
          },
          {
            word: "企業",
            reading: "きぎょう",
            meaning: "perusahaan / usaha",
            unsur: [
              { jokugo: "企", arti: "merencanakan, mengusahakan" },
              { jokugo: "業", arti: "usaha, kegiatan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 企 dan 業 menjadi 企業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perusahaan atau organisasi yang menjalankan kegiatan usaha.”"
          },
          {
            word: "事業",
            reading: "じぎょう",
            meaning: "usaha / kegiatan bisnis",
            unsur: [
              { jokugo: "事", arti: "hal, urusan, kegiatan" },
              { jokugo: "業", arti: "usaha, pekerjaan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 事 dan 業 menjadi 事業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “usaha atau kegiatan yang dilakukan secara terencana, terutama dalam bidang bisnis atau organisasi.”"
          },
          {
            word: "自営業",
            reading: "じえいぎょう",
            meaning: "usaha sendiri / wiraswasta",
            unsur: [
              { jokugo: "自", arti: "diri sendiri" },
              { jokugo: "営", arti: "menjalankan, mengelola" },
              { jokugo: "業", arti: "usaha, pekerjaan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 自・営 dan 業 menjadi 自営業, menunjukkan bahwa gabungan ketiga kanji tersebut membentuk makna “usaha yang dijalankan dan dikelola oleh seseorang untuk dirinya sendiri.”"
          }
        ]
      },
      {
        name: "3. Bidang Industri / Pekerjaan",
        jukugos: [
          {
            word: "工業",
            reading: "こうぎょう",
            meaning: "industri",
            unsur: [
              { jokugo: "工", arti: "pekerjaan, teknik, industry" },
              { jokugo: "業", arti: "usaha, kegiatan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 工 dan 業 menjadi 工業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bidang industri yang berkaitan dengan kegiatan produksi dan pengolahan barang.”"
          },
          {
            word: "農業",
            reading: "のうぎょう",
            meaning: "pertanian",
            unsur: [
              { jokugo: "農", arti: "pertanian" },
              { jokugo: "業", arti: "usaha, pekerjaan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 農 dan 業 menjadi 農業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bidang usaha atau pekerjaan yang berkaitan dengan pertanian.”"
          },
          {
            word: "漁業",
            reading: "ぎょぎょう",
            meaning: "perikanan",
            unsur: [
              { jokugo: "漁", arti: "menangkap ikan, perikanan" },
              { jokugo: "業", arti: "usaha, pekerjaan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 漁 dan 業 menjadi 漁業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bidang usaha atau pekerjaan yang berkaitan dengan penangkapan dan pemanfaatan hasil perikanan.”"
          },
          {
            word: "産業",
            reading: "さんぎょう",
            meaning: "industri",
            unsur: [
              { jokugo: "産", arti: "menghasilkan, produksi" },
              { jokugo: "業", arti: "usaha, kegiatan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 産 dan 業 menjadi 産業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan atau bidang ekonomi yang menghasilkan barang atau jasa.”"
          },
          {
            word: "商業",
            reading: "しょうぎょう",
            meaning: "perdagangan / bisnis",
            unsur: [
              { jokugo: "商", arti: "perdagangan, jual beli" },
              { jokugo: "業", arti: "usaha, kegiatan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 商 dan 業 menjadi 商業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan usaha yang berkaitan dengan perdagangan dan jual beli barang atau jasa.”"
          }
        ]
      },
      {
        name: "4. Bentuk / Status Pekerjaan",
        jukugos: [
          {
            word: "本業",
            reading: "ほんぎょう",
            meaning: "pekerjaan utama",
            unsur: [
              { jokugo: "本", arti: "utama, pokok" },
              { jokugo: "業", arti: "pekerjaan, usaha" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 本 dan 業 menjadi 本業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pekerjaan atau usaha utama yang menjadi kegiatan pokok seseorang.”"
          }
        ]
      }
    ],
    quizzes: [
      // 5 Unscramble
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["働いている", "ITの", "業界で", "んです"]),
        correctOrder: JSON.stringify(["ITの", "業界で", "働いている", "んです"]),
        correctAnswer: "0",
        explanation: "Jawaban: ITの業界で働いているんです。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["家業を", "と", "手伝おう", "思っています", "将来"]),
        correctOrder: JSON.stringify(["将来", "家業を", "手伝おう", "と", "思っています"]),
        correctAnswer: "0",
        explanation: "Jawaban: 将来家業を手伝おうと思っています。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["営業の", "はってあります", "紙が", "ドアに"]),
        correctOrder: JSON.stringify(["ドアに", "営業の", "紙が", "はってあります"]),
        correctAnswer: "0",
        explanation: "Jawaban: ドアに営業の紙がはってあります。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["農業を", "勉強しながら", "手伝います", "実家の"]),
        correctOrder: JSON.stringify(["実家の", "農業を", "勉強しながら", "手伝います"]),
        correctAnswer: "0",
        explanation: "Jawaban: 実家の農業を勉強しながら手伝います。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["商業の", "忘れるな！", "基本を"]),
        correctOrder: JSON.stringify(["商業の", "基本を", "忘れるな！"]),
        correctAnswer: "0",
        explanation: "Jawaban: 商業の基本を忘れるな！"
      },

      // 5 Multiple Choice (Section c)
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “tugas atau pekerjaan yang dilakukan dalam suatu kegiatan atau usaha”?",
        options: JSON.stringify(["業務", "営業", "工業"]),
        correctAnswer: "業務",
        explanation: "Kunci Jawaban: ① a"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “pekerjaan atau tugas yang dilakukan”?",
        options: JSON.stringify(["作業", "業界", "本業"]),
        correctAnswer: "作業",
        explanation: "Kunci Jawaban: ② a"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “mulai bekerja”?",
        options: JSON.stringify(["就業", "始業", "農業"]),
        correctAnswer: "始業",
        explanation: "Kunci Jawaban: ③ b"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “usaha atau kegiatan bisnis yang dilakukan untuk menjual barang atau jasa”?",
        options: JSON.stringify(["工業", "営業", "漁業"]),
        correctAnswer: "営業",
        explanation: "Kunci Jawaban: ④ b"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “pekerjaan utama seseorang”?",
        options: JSON.stringify(["家業", "本業", "産業"]),
        correctAnswer: "本業",
        explanation: "Kunci Jawaban: ⑤ b"
      },

      // 5 Fill-in-the-blank (Section d)
      {
        type: "fill",
        question: "会社では、毎日いろいろな（　　　　）があります。",
        options: JSON.stringify(["業務", "工業", "農業"]),
        correctAnswer: "業務",
        explanation: "Kunci Jawaban: ① a"
      },
      {
        type: "fill",
        question: "日本の（　　　　）は自動車などで有名です。",
        options: JSON.stringify(["農業", "工業", "本業"]),
        correctAnswer: "工業",
        explanation: "Kunci Jawaban: ② b"
      },
      {
        type: "fill",
        question: "毎日、会社で（　　　　）をしています。",
        options: JSON.stringify(["作業", "漁業", "産業"]),
        correctAnswer: "作業",
        explanation: "Kunci Jawaban: ③ a"
      },
      {
        type: "fill",
        question: "今日は仕事が多いので、（　　　　）するかもしれません。",
        options: JSON.stringify(["始業", "残業", "失業"]),
        correctAnswer: "残業",
        explanation: "Kunci Jawaban: ④ b"
      },
      {
        type: "fill",
        question: "会社は午前9時から（　　　　）します。",
        options: JSON.stringify(["始業", "失業", "本業"]),
        correctAnswer: "始業",
        explanation: "Kunci Jawaban: ⑤ a"
      },

      // 1 Grouping
      {
        type: "grouping",
        question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
        groups: JSON.stringify([
          { name: "Pekerjaan / Tugas", correctWords: ["業務", "作業", "始業", "残業", "就業", "失業"] },
          { name: "Usaha / Bisnis / Dunia Kerja", correctWords: ["営業", "業者", "業界", "家業", "企業", "事業", "自営業"] },
          { name: "Bidang Industri / Pekerjaan", correctWords: ["工業", "農業", "漁業", "産業", "商業"] },
          { name: "Bentuk / Status Pekerjaan", correctWords: ["本業"] }
        ]),
        explanation: "Kelompokkan jukugo kanji 業 ke dalam 4 kategori makna yang tepat."
      }
    ]
  },

  // =============================================================
  // 3. KANJI 商 (ID: 3560)
  // =============================================================
  {
    id: 3560,
    character: "商",
    romaji: "SHOU",
    meaning: "Perdagangan, Bisnis",
    baseMeaning: "perdagangan, bisnis.",
    bushuu: "口",
    onyomi: "ショウ",
    kunyomi: "あきな.う",
    categories: [
      {
        name: "1. Tempat Perdagangan",
        jukugos: [
          {
            word: "商店",
            reading: "しょうてん",
            meaning: "toko",
            unsur: [
              { jokugo: "商", arti: "perdagangan, bisnis" },
              { jokugo: "店", arti: "toko, tempat berjualan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 商 dan 店 menjadi 商店, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “toko atau tempat untuk melakukan kegiatan perdagangan.”"
          },
          {
            word: "商店街",
            reading: "しょうてんがい",
            meaning: "kawasan pertokoan",
            unsur: [
              { jokugo: "商", arti: "perdagangan, bisnis" },
              { jokugo: "店", arti: "toko" },
              { jokugo: "街", arti: "jalan, kawasan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 商・店・街 menjadi 商店街, menunjukkan bahwa gabungan ketiga kanji tersebut membentuk makna “kawasan yang terdiri atas toko-toko atau tempat berlangsungnya kegiatan perdagangan.”"
          }
        ]
      },
      {
        name: "2. Produk / Barang Dagangan",
        jukugos: [
          {
            word: "商品",
            reading: "しょうひん",
            meaning: "barang / produk",
            unsur: [
              { jokugo: "商", arti: "perdagangan, bisnis" },
              { jokugo: "品", arti: "barang, produk" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 商 dan 品 menjadi 商品, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “barang atau produk yang diperjualbelikan dalam kegiatan perdagangan.”"
          }
        ]
      },
      {
        name: "3. Kegiatan Perdagangan",
        jukugos: [
          {
            word: "商売",
            reading: "しょうばい",
            meaning: "bisnis / perdagangan",
            unsur: [
              { jokugo: "商", arti: "perdagangan, bisnis" },
              { jokugo: "売", arti: "menjual, penjualan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 商 dan 売 menjadi 商売, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan bisnis atau perdagangan yang dilakukan melalui aktivitas jual beli.”"
          },
          {
            word: "商業",
            reading: "しょうぎょう",
            meaning: "perdagangan",
            unsur: [
              { jokugo: "商", arti: "perdagangan, bisnis" },
              { jokugo: "業", arti: "pekerjaan, usaha, kegiatan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 商 dan 業 menjadi 商業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan usaha atau bisnis dalam bidang perdagangan.”"
          },
          {
            word: "商取引",
            reading: "しょうとりひき",
            meaning: "transaksi perdagangan",
            unsur: [
              { jokugo: "商", arti: "perdagangan, bisnis" },
              { jokugo: "取", arti: "mengambil, memperoleh" },
              { jokugo: "引", arti: "menarik, melakukan transaksi" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 商・取・引 menjadi 商取引, menunjukkan bahwa gabungan ketiga kanji tersebut membentuk makna “kegiatan transaksi yang dilakukan dalam perdagangan atau bisnis.”"
          }
        ]
      },
      {
        name: "4. Pelaku Perdagangan",
        jukugos: [
          {
            word: "商人",
            reading: "しょうにん",
            meaning: "pedagang",
            unsur: [
              { jokugo: "商", arti: "perdagangan, bisnis" },
              { jokugo: "人", arti: "orang" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 商 dan 人 menjadi 商人, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “orang yang melakukan kegiatan perdagangan atau berdagang.”"
          }
        ]
      },
      {
        name: "5. Jenis Usaha",
        jukugos: [
          {
            word: "商社",
            reading: "しょうしゃ",
            meaning: "perusahaan dagang",
            unsur: [
              { jokugo: "商", arti: "perdagangan, bisnis" },
              { jokugo: "社", arti: "perusahaan, organisasi" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 商 dan 社 menjadi 商社, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perusahaan yang bergerak dalam kegiatan perdagangan atau bisnis.”"
          }
        ]
      }
    ],
    quizzes: [
      // 5 Unscramble
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["商社で", "働こうと", "有名な", "思っています"]),
        correctOrder: JSON.stringify(["有名な", "商社で", "働こうと", "思っています"]),
        correctAnswer: "0",
        explanation: "Jawaban: 有名な商社で働こうと思っています。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["いいです", "した", "商談の", "ほうが いいです", "前に"]),
        correctOrder: JSON.stringify(["商談の", "前に", "した", "ほうが いいです", "いいです"]),
        correctAnswer: "0",
        explanation: "Jawaban: 商談の前に準備したほうがいいです。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["んです", "書類を", "商工会議所に", "出す"]),
        correctOrder: JSON.stringify(["商工会議所に", "書類を", "出す", "んです"]),
        correctAnswer: "0",
        explanation: "Jawaban: 商工会議所に書類を出すんです。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["港に", "到着するかもしれません", "大きな 商船が"]),
        correctOrder: JSON.stringify(["港に", "大きな 商船が", "到着するかもしれません"]),
        correctAnswer: "0",
        explanation: "Jawaban: 港に大きな商船が到着するかもしれません。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["会社の", "商号を", "変更して", "おきます", "事前に"]),
        correctOrder: JSON.stringify(["事前に", "会社の", "商号を", "変更して", "おきます"]),
        correctAnswer: "0",
        explanation: "Jawaban: 事前に会社の商号を変更しておきます。"
      },

      // 5 Multiple Choice (Section c)
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “toko atau tempat untuk melakukan kegiatan perdagangan”?",
        options: JSON.stringify(["商店", "商品", "商人"]),
        correctAnswer: "商店",
        explanation: "Kunci Jawaban: ① a"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “kawasan yang terdiri atas toko-toko”?",
        options: JSON.stringify(["商社", "商店街", "商売"]),
        correctAnswer: "商店街",
        explanation: "Kunci Jawaban: ② b"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “barang atau produk yang diperjualbelikan”?",
        options: JSON.stringify(["商人", "商業", "商品"]),
        correctAnswer: "商品",
        explanation: "Kunci Jawaban: ③ c"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “kegiatan bisnis atau perdagangan”?",
        options: JSON.stringify(["商売", "商店", "商人"]),
        correctAnswer: "商売",
        explanation: "Kunci Jawaban: ④ a"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “kegiatan usaha dalam bidang perdagangan”?",
        options: JSON.stringify(["商業", "商社", "商店街"]),
        correctAnswer: "商業",
        explanation: "Kunci Jawaban: ⑤ a"
      },

      // 5 Fill-in-the-blank (Section d)
      {
        type: "fill",
        question: "駅の近くに新しい（　　　　）ができました。",
        options: JSON.stringify(["商店", "商品", "商人"]),
        correctAnswer: "商店",
        explanation: "Kunci Jawaban: ① a"
      },
      {
        type: "fill",
        question: "デパートで新しい（　　　　）を買いました。",
        options: JSON.stringify(["商店街", "商品", "商社"]),
        correctAnswer: "商品",
        explanation: "Kunci Jawaban: ② b"
      },
      {
        type: "fill",
        question: "父は会社で（　　　　）の仕事をしています。",
        options: JSON.stringify(["商取引", "商人", "商店"]),
        correctAnswer: "商取引",
        explanation: "Kunci Jawaban: ③ a"
      },
      {
        type: "fill",
        question: "日本の（　　　　）について勉強しています。",
        options: JSON.stringify(["商業", "商店", "商品"]),
        correctAnswer: "商業",
        explanation: "Kunci Jawaban: ④ a"
      },
      {
        type: "fill",
        question: "この店ではいろいろな商品を（　　　　）しています。",
        options: JSON.stringify(["商人", "商店街", "商売"]),
        correctAnswer: "商売",
        explanation: "Kunci Jawaban: ⑤ c"
      },

      // 1 Grouping
      {
        type: "grouping",
        question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
        groups: JSON.stringify([
          { name: "Tempat Perdagangan", correctWords: ["商店", "商店街"] },
          { name: "Produk / Barang Dagangan", correctWords: ["商品"] },
          { name: "Kegiatan Perdagangan", correctWords: ["商売", "商業", "商取引"] },
          { name: "Pelaku Perdagangan", correctWords: ["商人"] },
          { name: "Jenis Usaha", correctWords: ["商社"] }
        ]),
        explanation: "Kelompokkan jukugo kanji 商 ke dalam 5 kategori makna yang tepat."
      }
    ]
  },

  // =============================================================
  // 4. KANJI 務 (ID: 3233)
  // =============================================================
  {
    id: 3233,
    character: "務",
    romaji: "MU",
    meaning: "Tugas, Urusan, Kewajiban",
    baseMeaning: "tugas, pekerjaan, kewajiban, atau urusan yang harus dilaksanakan.",
    bushuu: "力",
    onyomi: "ム",
    kunyomi: "つと.める",
    categories: [
      {
        name: "1. Pekerjaan / Tugas",
        jukugos: [
          {
            word: "業務",
            reading: "ぎょうむ",
            meaning: "pekerjaan / tugas",
            unsur: [
              { jokugo: "業", arti: "pekerjaan, usaha, kegiatan" },
              { jokugo: "務", arti: "tugas, pekerjaan, urusan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 業 dan 務 menjadi 業務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pekerjaan atau tugas yang dilakukan dalam suatu kegiatan atau usaha.”"
          },
          {
            word: "職務",
            reading: "しょくむ",
            meaning: "tugas / pekerjaan jabatan",
            unsur: [
              { jokugo: "職", arti: "pekerjaan, jabatan, profesi" },
              { jokugo: "務", arti: "tugas, pekerjaan, kewajiban" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 職 dan 務 menjadi 職務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tugas atau pekerjaan yang berkaitan dengan suatu jabatan.”"
          },
          {
            word: "勤務",
            reading: "きんむ",
            meaning: "bekerja / bertugas",
            unsur: [
              { jokugo: "勤", arti: "bekerja, menjalankan tugas" },
              { jokugo: "務", arti: "tugas, pekerjaan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 勤 dan 務 menjadi 勤務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “melaksanakan pekerjaan atau menjalankan tugas dalam suatu pekerjaan.”"
          },
          {
            word: "実務",
            reading: "じつむ",
            meaning: "pekerjaan praktis",
            unsur: [
              { jokugo: "実", arti: "nyata, praktik, kenyataan" },
              { jokugo: "務", arti: "tugas, pekerjaan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 実 dan 務 menjadi 実務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pekerjaan yang bersifat praktis atau pekerjaan yang benar-benar dilaksanakan.”"
          },
          {
            word: "事務",
            reading: "じむ",
            meaning: "pekerjaan administrasi / urusan kantor",
            unsur: [
              { jokugo: "事", arti: "urusan, hal, perkara" },
              { jokugo: "務", arti: "tugas, pekerjaan, urusan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 事 dan 務 menjadi 事務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “urusan atau pekerjaan administratif yang perlu dilaksanakan.”"
          }
        ]
      },
      {
        name: "2. Tugas / Kewajiban",
        jukugos: [
          {
            word: "任務",
            reading: "にんむ",
            meaning: "tugas / misi",
            unsur: [
              { jokugo: "任", arti: "tugas, tanggung jawab, penugasan" },
              { jokugo: "務", arti: "tugas, pekerjaan, kewajiban" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 任 dan 務 menjadi 任務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tugas atau misi yang dipercayakan kepada seseorang untuk dilaksanakan.”"
          },
          {
            word: "義務",
            reading: "ぎむ",
            meaning: "kewajiban",
            unsur: [
              { jokugo: "義", arti: "kewajiban, prinsip" },
              { jokugo: "務", arti: "tugas, kewajiban" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 義 dan 務 menjadi 義務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kewajiban yang harus dilakukan atau dipenuhi.”"
          },
          {
            word: "公務",
            reading: "こうむ",
            meaning: "tugas / pekerjaan resmi",
            unsur: [
              { jokugo: "公", arti: "umum, publik, resmi" },
              { jokugo: "務", arti: "tugas, pekerjaan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 公 dan 務 menjadi 公務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tugas atau pekerjaan resmi yang berkaitan dengan kepentingan umum atau pelayanan publik.”"
          }
        ]
      },
      {
        name: "3. Urusan / Pelaksanaan Tugas",
        jukugos: [
          {
            word: "労務",
            reading: "ろうむ",
            meaning: "urusan / pekerjaan tenaga kerja",
            unsur: [
              { jokugo: "労", arti: "tenaga, kerja, usaha" },
              { jokugo: "務", arti: "tugas, pekerjaan, urusan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 労 dan 務 menjadi 労務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “urusan atau pekerjaan yang berkaitan dengan tenaga kerja.”"
          },
          {
            word: "服務",
            reading: "ふくむ",
            meaning: "menjalankan tugas / dinas",
            unsur: [
              { jokugo: "服", arti: "melayani, menaati, menjalankan" },
              { jokugo: "務", arti: "tugas, pekerjaan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 服 dan 務 menjadi 服務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menjalankan tugas atau melakukan pekerjaan dalam suatu dinas.”"
          },
          {
            word: "用務",
            reading: "ようむ",
            meaning: "urusan / keperluan pekerjaan",
            unsur: [
              { jokugo: "用", arti: "keperluan, penggunaan, urusan" },
              { jokugo: "務", arti: "tugas, pekerjaan, urusan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 用 dan 務 menjadi 用務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “urusan atau keperluan yang berkaitan dengan pekerjaan.”"
          }
        ]
      },
      {
        name: "4. Bidang / Urusan Tugas",
        jukugos: [
          {
            word: "財務",
            reading: "ざいむ",
            meaning: "urusan keuangan",
            unsur: [
              { jokugo: "財", arti: "harta, keuangan, kekayaan" },
              { jokugo: "務", arti: "tugas, pekerjaan, urusan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 財 dan 務 menjadi 財務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “urusan atau tugas yang berkaitan dengan keuangan.”"
          },
          {
            word: "教務",
            reading: "きょうむ",
            meaning: "urusan / tugas pendidikan",
            unsur: [
              { jokugo: "教", arti: "mengajar, pendidikan, ajaran" },
              { jokugo: "務", arti: "tugas, pekerjaan, urusan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 教 dan 務 menjadi 教務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “urusan atau tugas yang berkaitan dengan kegiatan pendidikan.”"
          },
          {
            word: "法務",
            reading: "ほうむ",
            meaning: "urusan / tugas hukum",
            unsur: [
              { jokugo: "法", arti: "hukum, aturan, ketentuan" },
              { jokugo: "務", arti: "tugas, pekerjaan, urusan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 法 dan 務 menjadi 法務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “urusan atau tugas yang berkaitan dengan hukum.”"
          }
        ]
      }
    ],
    quizzes: [
      // 5 Unscramble
      {
        type: "unscramble",
        question: "Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.",
        words: JSON.stringify(["業務の", "マニュアルが", "おいてあります", "机に"]),
        correctOrder: JSON.stringify(["机に", "業務の", "マニュアルが", "おいてあります"]),
        correctAnswer: "0",
        explanation: "Jawaban: 机に業務のマニュアルがおいてあります。"
      },
      {
        type: "unscramble",
        question: "Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.",
        words: JSON.stringify(["用務員室へ", "んです", "用務が", "行く", "あるから"]),
        correctOrder: JSON.stringify(["用務が", "あるから", "用務員室へ", "行く", "んです"]),
        correctAnswer: "0",
        explanation: "Jawaban: 用務があるから用務員室へ行くんです。"
      },
      {
        type: "unscramble",
        question: "Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.",
        words: JSON.stringify(["教務課に", "書類を", "前に", "出して", "おきます"]),
        correctOrder: JSON.stringify(["前に", "教務課に", "書類を", "出して", "おきます"]),
        correctAnswer: "0",
        explanation: "Jawaban: 前に教務課に書類を出しておきます。"
      },
      {
        type: "unscramble",
        question: "Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.",
        words: JSON.stringify(["法務部に", "確認した", "ほうが", "先に", "いいです"]),
        correctOrder: JSON.stringify(["先に", "法務部に", "確認した", "ほうが", "いいです"]),
        correctAnswer: "0",
        explanation: "Jawaban: 先に法務部に確認したほうがいいです。"
      },
      {
        type: "unscramble",
        question: "Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.",
        words: JSON.stringify(["労務が", "大変に", "になるかもしれません", "急に"]),
        correctOrder: JSON.stringify(["急に", "労務が", "大変に", "になるかもしれません"]),
        correctAnswer: "0",
        explanation: "Jawaban: 急に労務が大変になるかもしれません。"
      },

      // 5 Multiple Choice (Section c)
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “pekerjaan atau tugas yang dilakukan dalam suatu kegiatan atau usaha”?",
        options: JSON.stringify(["業務", "任務", "財務"]),
        correctAnswer: "業務",
        explanation: "Kunci Jawaban: ① a"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “tugas atau pekerjaan yang berkaitan dengan suatu jabatan”?",
        options: JSON.stringify(["職務", "用務", "労務"]),
        correctAnswer: "職務",
        explanation: "Kunci Jawaban: ② a"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “kegiatan bekerja atau menjalankan tugas dalam suatu pekerjaan”?",
        options: JSON.stringify(["義務", "勤務", "法務"]),
        correctAnswer: "勤務",
        explanation: "Kunci Jawaban: ③ b"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “tugas atau misi yang dipercayakan kepada seseorang”?",
        options: JSON.stringify(["任務", "実務", "教務"]),
        correctAnswer: "任務",
        explanation: "Kunci Jawaban: ④ a"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “kewajiban yang harus dilakukan atau dipenuhi”?",
        options: JSON.stringify(["公務", "義務", "服務"]),
        correctAnswer: "義務",
        explanation: "Kunci Jawaban: ⑤ b"
      },

      // 5 Fill-in-the-blank (Section d)
      {
        type: "fill",
        question: "会社で毎日（　　　　）をしています。",
        options: JSON.stringify(["業務", "義務", "財務"]),
        correctAnswer: "業務",
        explanation: "Kunci Jawaban: ① a"
      },
      {
        type: "fill",
        question: "私は会社で営業の（　　　　）をしています。",
        options: JSON.stringify(["職務", "法務", "教務"]),
        correctAnswer: "職務",
        explanation: "Kunci Jawaban: ② a"
      },
      {
        type: "fill",
        question: "父は会社に毎日（　　　　）しています。",
        options: JSON.stringify(["任務", "勤務", "財務"]),
        correctAnswer: "勤務",
        explanation: "Kunci Jawaban: ③ b"
      },
      {
        type: "fill",
        question: "この仕事は私の（　　　　）ですから、しなければなりません。",
        options: JSON.stringify(["義務", "用務", "服務"]),
        correctAnswer: "義務",
        explanation: "Kunci Jawaban: ④ a"
      },
      {
        type: "fill",
        question: "明日の会議について、資料を準備して（　　　　）必要があります。",
        options: JSON.stringify(["公務", "用務", "義務"]),
        correctAnswer: "義務",
        explanation: "Kunci Jawaban: ⑤ c"
      },

      // 1 Grouping
      {
        type: "grouping",
        question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
        groups: JSON.stringify([
          { name: "Pekerjaan / Tugas", correctWords: ["業務", "職務", "勤務", "実務", "事務"] },
          { name: "Tugas / Kewajiban", correctWords: ["任務", "義務", "公務"] },
          { name: "Urusan / Pelaksanaan Tugas", correctWords: ["労務", "服務", "用務"] },
          { name: "Bidang / Urusan Tugas", correctWords: ["財務", "教務", "法務"] }
        ]),
        explanation: "Kelompokkan jukugo kanji 務 ke dalam 4 kategori makna yang tepat."
      }
    ]
  },

  // =============================================================
  // 5. KANJI 術 (ID: 3235)
  // =============================================================
  {
    id: 3235,
    character: "術",
    romaji: "JUTSU",
    meaning: "Seni, Teknik, Cara",
    baseMeaning: "teknik, keterampilan, atau metode untuk melakukan sesuatu.",
    bushuu: "行",
    onyomi: "ジュツ",
    kunyomi: "すべ",
    categories: [
      {
        name: "1. Teknik / Keterampilan",
        jukugos: [
          {
            word: "技術",
            reading: "ぎじゅつ",
            meaning: "teknik / keterampilan",
            unsur: [
              { jokugo: "技", arti: "keterampilan, teknik, keahlian" },
              { jokugo: "術", arti: "teknik, keterampilan, metode" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 技 dan 術 menjadi 技術, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “teknik atau keterampilan untuk melakukan sesuatu.”"
          },
          {
            word: "手術",
            reading: "しゅじゅつ",
            meaning: "operasi",
            unsur: [
              { jokugo: "手", arti: "tangan" },
              { jokugo: "術", arti: "teknik, metode, cara" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 手 dan 術 menjadi 手術, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tindakan medis yang dilakukan dengan teknik atau metode tertentu.”"
          },
          {
            word: "話術",
            reading: "わじゅつ",
            meaning: "keterampilan berbicara",
            unsur: [
              { jokugo: "話", arti: "berbicara, percakapan" },
              { jokugo: "術", arti: "teknik, keterampilan, metode" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 話 dan 術 menjadi 話術, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “teknik atau keterampilan dalam berbicara.”"
          },
          {
            word: "秘術",
            reading: "ひじゅつ",
            meaning: "teknik rahasia",
            unsur: [
              { jokugo: "秘", arti: "rahasia, tersembunyi" },
              { jokugo: "術", arti: "teknik, metode, keterampilan" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 秘 dan 術 menjadi 秘術, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “teknik atau metode khusus yang dirahasiakan.”"
          }
        ]
      },
      {
        name: "2. Ilmu / Pengetahuan",
        jukugos: [
          {
            word: "学術",
            reading: "がくじゅつ",
            meaning: "ilmu / akademik",
            unsur: [
              { jokugo: "学", arti: "belajar, ilmu, pengetahuan" },
              { jokugo: "術", arti: "teknik, metode, keahlian" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 学 dan 術 menjadi 学術, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “ilmu atau bidang akademik yang memiliki pengetahuan dan metode tertentu.”"
          },
          {
            word: "算術",
            reading: "さんじゅつ",
            meaning: "ilmu hitung",
            unsur: [
              { jokugo: "算", arti: "menghitung, perhitungan" },
              { jokugo: "術", arti: "teknik, metode, cara" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 算 dan 術 menjadi 算術, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “metode atau ilmu yang berkaitan dengan perhitungan.”"
          }
        ]
      },
      {
        name: "3. Seni / Keahlian Seni",
        jukugos: [
          {
            word: "芸術",
            reading: "げいじゅつ",
            meaning: "seni",
            unsur: [
              { jokugo: "芸", arti: "seni, keterampilan, karya seni" },
              { jokugo: "術", arti: "teknik, keterampilan, metode" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 芸 dan 術 menjadi 芸術, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “seni yang melibatkan keterampilan dan teknik tertentu.”"
          },
          {
            word: "美術",
            reading: "びじゅつ",
            meaning: "seni rupa",
            unsur: [
              { jokugo: "美", arti: "indah, keindahan" },
              { jokugo: "術", arti: "teknik, keterampilan, metode" }
            ],
            penjelasan:
              "Hubungan makna antar kanji 美 dan 術 menjadi 美術, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “seni yang berkaitan dengan keindahan dan karya seni rupa.”"
          }
        ]
      }
    ],
    quizzes: [
      // 5 Unscramble
      {
        type: "unscramble",
        question: "Susunlah kalimat dari kata-kata berikut.",
        words: JSON.stringify(["書いてあります", "秘術が", "古い", "書物に"]),
        correctOrder: JSON.stringify(["古い", "書物に", "秘術が", "書いてあります"]),
        correctAnswer: "0",
        explanation: "Jawaban: 古い書物に秘術が書いてあります。"
      },
      {
        type: "unscramble",
        question: "Susunlah kalimat dari kata-kata berikut.",
        words: JSON.stringify(["変えよう", "試合の", "思っています", "戦術を", "と"]),
        correctOrder: JSON.stringify(["試合の", "戦術を", "変えよう", "と", "思っています"]),
        correctAnswer: "0",
        explanation: "Jawaban: 試合の戦術を変えようと思っています。"
      },
      {
        type: "unscramble",
        question: "Susunlah kalimat dari kata-kata berikut.",
        words: JSON.stringify(["心術を", "いいです", "正しい", "持った", "ほうが"]),
        correctOrder: JSON.stringify(["正しい", "心術を", "持った", "ほうが", "いいです"]),
        correctAnswer: "0",
        explanation: "Jawaban: 正しい心術を持ったほうがいいです。"
      },
      {
        type: "unscramble",
        question: "Susunlah kalimat dari kata-kata berikut.",
        words: JSON.stringify(["話術を", "先生の", "メモします", "聞きながら"]),
        correctOrder: JSON.stringify(["先生の", "話術を", "聞きながら", "メモします"]),
        correctAnswer: "0",
        explanation: "Jawaban: 先生の話術を聞きながらメモします。"
      },
      {
        type: "unscramble",
        question: "Susunlah kalimat dari kata-kata berikut.",
        words: JSON.stringify(["病院で", "ほうが", "手術を", "受けた", "いいです"]),
        correctOrder: JSON.stringify(["病院で", "手術を", "受けた", "ほうが", "いいです"]),
        correctAnswer: "0",
        explanation: "Jawaban: 病院で手術を受けたほうがいいです。"
      },

      // 5 Multiple Choice (Section c)
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “teknik atau keterampilan untuk melakukan sesuatu”?",
        options: JSON.stringify(["技術", "学術", "美術"]),
        correctAnswer: "技術",
        explanation: "Kunci Jawaban: ① a"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “tindakan medis yang dilakukan dengan teknik tertentu”?",
        options: JSON.stringify(["話術", "手術", "芸術"]),
        correctAnswer: "手術",
        explanation: "Kunci Jawaban: ② b"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “keterampilan dalam berbicara”?",
        options: JSON.stringify(["話術", "秘術", "算術"]),
        correctAnswer: "話術",
        explanation: "Kunci Jawaban: ③ a"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “teknik atau metode khusus yang dirahasiakan”?",
        options: JSON.stringify(["手術", "秘術", "技術"]),
        correctAnswer: "秘術",
        explanation: "Kunci Jawaban: ④ b"
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “ilmu atau bidang akademik”?",
        options: JSON.stringify(["学術", "美術", "話術"]),
        correctAnswer: "学術",
        explanation: "Kunci Jawaban: ⑤ a"
      },

      // 5 Fill-in-the-blank (Section d)
      {
        type: "fill",
        question: "日本語の（　　　　）をもっと勉強したいです。",
        options: JSON.stringify(["技術", "手術", "美術"]),
        correctAnswer: "技術",
        explanation: "Kunci Jawaban: ① a"
      },
      {
        type: "fill",
        question: "病院で（　　　　）を受けたんです。",
        options: JSON.stringify(["話術", "手術", "算術"]),
        correctAnswer: "手術",
        explanation: "Kunci Jawaban: ② b"
      },
      {
        type: "fill",
        question: "先生は学生に話す（　　　　）が上手です。",
        options: JSON.stringify(["話術", "秘術", "学術"]),
        correctAnswer: "話術",
        explanation: "Kunci Jawaban: ③ a"
      },
      {
        type: "fill",
        question: "大学で日本の（　　　　）について研究しています。",
        options: JSON.stringify(["美術", "学術", "手術"]),
        correctAnswer: "学術",
        explanation: "Kunci Jawaban: ④ b"
      },
      {
        type: "fill",
        question: "私は日本の（　　　　）が好きです。美しい絵を見たいです。",
        options: JSON.stringify(["美術", "技術", "算術"]),
        correctAnswer: "美術",
        explanation: "Kunci Jawaban: ⑤ a"
      },

      // 1 Grouping
      {
        type: "grouping",
        question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
        groups: JSON.stringify([
          { name: "Teknik / Keterampilan", correctWords: ["技術", "手術", "話術", "秘術"] },
          { name: "Ilmu / Pengetahuan", correctWords: ["学術", "算術"] },
          { name: "Seni / Keahlian Seni", correctWords: ["芸術", "美術"] }
        ]),
        explanation: "Kelompokkan jukugo kanji 術 ke dalam 3 kategori makna yang tepat."
      }
    ]
  }
];

async function main() {
  console.log("=== MEMULAI SINKRONISASI MODUL 4 STRICT (100% VERBATIM) ===");

  // Pastikan Modul 4 (ID 558) terdaftar
  let module4 = await prisma.module.findUnique({
    where: { id: 558 }
  });
  if (!module4) {
    module4 = await prisma.module.create({
      data: {
        id: 558,
        title: "Modul 4: Dunia Kerja & Keahlian",
        tujuanPembelajaran:
          "Menguasai kanji-kanji yang berkaitan dengan dunia kerja, perdagangan, urusan tugas, dan keahlian/teknik."
      }
    });
    console.log("✓ Module 4 (ID 558) berhasil dibuat.");
  }

  for (const kd of MODUL_4_DATA) {
    console.log(`\nProcessing Kanji ${kd.character} (ID: ${kd.id})...`);

    // 1. Update metadata Kanji & pastikan moduleId: 558
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
        moduleId: 558,
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
        moduleId: 558,
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

  console.log("\n=== SINKRONISASI MODUL 4 SUKSES 100% ===");
}

main()
  .catch((e) => {
    console.error("Error saat sinkronisasi Modul 4:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
