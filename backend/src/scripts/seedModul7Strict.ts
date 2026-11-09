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
  type: "unscramble" | "grouping" | "multiple" | "fill";
  question: string;
  words?: string;
  correctOrder?: string;
  options?: string;
  correctAnswer?: string | null;
  groups?: string;
  explanation: string;
}

interface ExampleSentenceData {
  japanese: string;
  romaji: string;
  translation: string;
}

interface KanjiData {
  id?: number;
  character: string;
  romaji: string;
  meaning: string;
  baseMeaning: string;
  bushuu: string;
  onyomi: string;
  kunyomi: string;
  examples: ExampleSentenceData[];
  reflections: string[];
  categories: CategoryData[];
  quizzes: QuizData[];
  crossLinks: Array<[string, string, string]>;
}

// -------------------------------------------------------------
// CONSTITUENT KANJIS TO ENSURE (moduleId: null)
// -------------------------------------------------------------
const CONSTITUENTS_TO_ENSURE = [
  {
    character: "老",
    romaji: "ROU / oi, fu(keru)",
    meaning: "tua, lanjut usia",
    bushuu: "老",
    onyomi: "ロウ",
    kunyomi: "お・いる、ふ・ける",
    baseMeaning: "tua, usia lanjut"
  },
  {
    character: "硬",
    romaji: "KOU / kata(i)",
    meaning: "keras, kaku",
    bushuu: "石",
    onyomi: "コウ",
    kunyomi: "かた・い",
    baseMeaning: "keras, kaku, padat"
  },
  {
    character: "軟",
    romaji: "NAN / yawa(raka)",
    meaning: "lunak, lembut",
    bushuu: "車",
    onyomi: "ナン",
    kunyomi: "やわ・らか、やわ・らかい",
    baseMeaning: "lunak, lembut"
  },
  {
    character: "浄",
    romaji: "JOU",
    meaning: "murni, bersih",
    bushuu: "氵",
    onyomi: "ジョウ",
    kunyomi: "きよ・める、きよ・い",
    baseMeaning: "murni, bersih, pembersihan"
  },
  {
    character: "緑",
    romaji: "RYOKU, ROKU / midori",
    meaning: "hijau",
    bushuu: "糸",
    onyomi: "リョク、ロク",
    kunyomi: "みどり",
    baseMeaning: "warna hijau, pepohonan hijau"
  },
  {
    character: "育",
    romaji: "IKU / soda(tsu)",
    meaning: "tumbuh, mendidik, membesarkan",
    bushuu: "月",
    onyomi: "イク",
    kunyomi: "そだ・つ、そだ・てる",
    baseMeaning: "tumbuh, membesarkan, merawat"
  },
  {
    character: "伸",
    romaji: "SHIN / no(biru)",
    meaning: "meregang, memanjang",
    bushuu: "亻",
    onyomi: "シン",
    kunyomi: "の・びる、の・ばす",
    baseMeaning: "memanjang, meregang, meluas"
  },
  {
    character: "個",
    romaji: "KO",
    meaning: "individu, perorangan",
    bushuu: "亻",
    onyomi: "コ",
    kunyomi: "―",
    baseMeaning: "individu, satu per satu, benda tunggal"
  },
  {
    character: "親",
    romaji: "SHIN / oya, shita(shii)",
    meaning: "orang tua, akrab, langsung",
    bushuu: "見",
    onyomi: "シン",
    kunyomi: "おや、した・しい",
    baseMeaning: "orang tua, dekat, langsung"
  },
  {
    character: "構",
    romaji: "KOU / kama(eru)",
    meaning: "menyusun, struktur",
    bushuu: "木",
    onyomi: "コウ",
    kunyomi: "かま・える",
    baseMeaning: "struktur, penyusunan, rencana"
  },
  {
    character: "養",
    romaji: "YOU / yashina(u)",
    meaning: "memelihara, membina",
    bushuu: "食",
    onyomi: "ヨウ",
    kunyomi: "やしな・う",
    baseMeaning: "memelihara, merawat, melatih"
  },
  {
    character: "賛",
    romaji: "SAN",
    meaning: "setuju, mendukung, memuji",
    bushuu: "貝",
    onyomi: "サン",
    kunyomi: "―",
    baseMeaning: "mendukung, persetujuan, pujian"
  },
  {
    character: "加",
    romaji: "KA / kuwa(eru)",
    meaning: "tambah, ikut serta",
    bushuu: "力",
    onyomi: "カ",
    kunyomi: "くわ・える、くわ・わる",
    baseMeaning: "menambah, memperbesar"
  },
  {
    character: "倍",
    romaji: "BAI",
    meaning: "dua kali lipat, kelipatan",
    bushuu: "亻",
    onyomi: "バイ",
    kunyomi: "―",
    baseMeaning: "kelipatan, ganda"
  },
  {
    character: "急",
    romaji: "KYUU / iso(gu)",
    meaning: "cepat, mendesak, tiba-tiba",
    bushuu: "心",
    onyomi: "キュウ",
    kunyomi: "いそ・ぐ",
    baseMeaning: "cepat, mendadak, genting"
  },
  {
    character: "援",
    romaji: "EN",
    meaning: "membantu, menolong",
    bushuu: "扌",
    onyomi: "エン",
    kunyomi: "―",
    baseMeaning: "bantuan, pertolongan"
  },
  {
    character: "訂",
    romaji: "TEI",
    meaning: "memperbaiki, merevisi",
    bushuu: "言",
    onyomi: "テイ",
    kunyomi: "―",
    baseMeaning: "memperbaiki, revisi teks"
  },
  {
    character: "血",
    romaji: "KETSU / chi",
    meaning: "darah",
    bushuu: "血",
    onyomi: "ケツ",
    kunyomi: "ち",
    baseMeaning: "darah"
  }
];

// =============================================================
// MODUL 7 KANJI LEARNING DATA (化・発・展・成・増)
// =============================================================
const MODUL_7_DATA: KanjiData[] = [
  // ===========================================================
  // 1. KANJI 化 (ID: 3249)
  // ===========================================================
  {
    id: 3249,
    character: "化",
    romaji: "KA, KE / ba(keru)",
    meaning: "berubah, perubahan, wujud",
    baseMeaning: "Menunjukkan proses atau hasil perubahan keadaan, sifat, wujud, atau bentuk dari satu hal menjadi hal lain. (https://kanji.me; kanjipedia; kakijun.com)",
    bushuu: "匕 (Sendok / Berubah)",
    onyomi: "カ、ケ",
    kunyomi: "ば（ける）、ば（かす）",
    examples: [
      {
        japanese: "音楽を聞きながら、化学を勉強しています。",
        romaji: "Ongaku o kikinagara, kagaku o benkyou shite imasu.",
        translation: "Saya belajar kimia sambil mendengarkan musik."
      },
      {
        japanese: "この町は、十年で大きく変化してしまいました。",
        romaji: "Kono machi wa, juunen de ookiku henka shite shimaimashita.",
        translation: "Kota ini telah mengalami perubahan besar dalam sepuluh tahun."
      },
      {
        japanese: "日本へ行く前に、日本の文化について調べておきます。",
        romaji: "Nihon e iku mae ni, Nihon no bunka ni tsuite shirabete okimasu.",
        translation: "Sebelum pergi ke Jepang, saya akan mencari tahu tentang budaya Jepang terlebih dahulu."
      },
      {
        japanese: "来年、学校の庭を緑化するつもりです。",
        romaji: "Rainen, gakkou no niwa o ryokka suru tsumori desu.",
        translation: "Tahun depan, saya berencana melakukan penghijauan di halaman sekolah."
      },
      {
        japanese: "雨がたくさん降ったら、道の状態が悪化するかもしれません。",
        romaji: "Ame ga takusan futtara, michi no joutai ga akka suru kamoshiremasen.",
        translation: "Jika hujan turun lebat, kondisi jalan mungkin akan memburuk."
      }
    ],
    reflections: [
      "Apa makna dasar kanji 化 yang anda pahami?",
      "Jukugo mana yang mudah untuk di ingat? Mengapa?",
      "Apa perbedaan penggunaan 変化、化学 dan 化合?",
      "Cabang semantic graph mana yang menurut anda paling mudah dipahami?",
      "Bagaimana cara anda mengingat hubungan makna antar jukugo yang mengandung kanji 化?"
    ],
    categories: [
      {
        name: "1. Perkembangan",
        jukugos: [
          {
            word: "進化",
            reading: "しんか",
            meaning: "evolusi",
            unsur: [
              { jokugo: "進", arti: "maju" },
              { jokugo: "化", arti: "berubah" }
            ],
            penjelasan: "Hubungan makna antar kanji 進 dan 化 menjadi 進化, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perkembangan bentuk atau sifat makhluk hidup melalui proses evolusi.”"
          },
          {
            word: "老化",
            reading: "ろうか",
            meaning: "penuaan",
            unsur: [
              { jokugo: "老", arti: "tua" },
              { jokugo: "化", arti: "menjadi" }
            ],
            penjelasan: "Hubungan makna antar kanji 老 dan 化 menjadi 老化, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perubahan yang terjadi seiring bertambahnya usia sehingga mengalami penuaan.”"
          },
          {
            word: "退化",
            reading: "たいか",
            meaning: "degenerasi",
            unsur: [
              { jokugo: "退", arti: "mundur" },
              { jokugo: "化", arti: "berubah" }
            ],
            penjelasan: "Hubungan makna antar kanji 退 dan 化 menjadi 退化, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perubahan yang menunjukkan penurunan perkembangan atau fungsi dibandingkan keadaan sebelumnya.”"
          },
          {
            word: "分化",
            reading: "ぶんか",
            meaning: "diferensiasi",
            unsur: [
              { jokugo: "分", arti: "terbagi" },
              { jokugo: "化", arti: "berubah" }
            ],
            penjelasan: "Hubungan makna antar kanji 分 dan 化 menjadi 分化, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perubahan yang menghasilkan bagian-bagian dengan bentuk atau fungsi yang berbeda.”"
          },
          {
            word: "同化",
            reading: "どうか",
            meaning: "asimilasi",
            unsur: [
              { jokugo: "同", arti: "sama" },
              { jokugo: "化", arti: "menjadi" }
            ],
            penjelasan: "Hubungan makna antarkanji 同 dan 化 menjadi 同化, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “proses penyesuaian sehingga menjadi serupa dengan unsur atau kelompok lain.”"
          }
        ]
      },
      {
        name: "2. Perubahan Keadaan dan Zat",
        jukugos: [
          {
            word: "変化",
            reading: "へんか",
            meaning: "perubahan",
            unsur: [
              { jokugo: "変", arti: "berubah" },
              { jokugo: "化", arti: "berubah" }
            ],
            penjelasan: "Hubungan makna antarkanji 変 dan 化 menjadi 変化, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “peralihan dari suatu keadaan atau bentuk menjadi keadaan atau bentuk yang berbeda.”"
          },
          {
            word: "化学",
            reading: "かがく",
            meaning: "kimia",
            unsur: [
              { jokugo: "化", arti: "perubahan" },
              { jokugo: "学", arti: "ilmu" }
            ],
            penjelasan: "Hubungan makna antarkanji 化 dan 学 menjadi 化学, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “ilmu yang mempelajari zat, sifat, susunan, dan perubahannya.”"
          },
          {
            word: "化合",
            reading: "かごう",
            meaning: "kombinasi",
            unsur: [
              { jokugo: "化", arti: "perubahan" },
              { jokugo: "合", arti: "bergabung" }
            ],
            penjelasan: "Hubungan makna antarkanji 化 dan 合 menjadi 化合, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “penggabungan unsur melalui reaksi kimia sehingga menghasilkan senyawa.” Padanan “kombinasi” dalam daftar jukugo digunakan khusus untuk konteks kimia ini."
          },
          {
            word: "悪化",
            reading: "あっか",
            meaning: "kemerosotan",
            unsur: [
              { jokugo: "悪", arti: "buruk" },
              { jokugo: "化", arti: "menjadi" }
            ],
            penjelasan: "Hubungan makna antarkanji 悪 dan 化 menjadi 悪化, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perubahan suatu keadaan menjadi lebih buruk daripada sebelumnya.”"
          },
          {
            word: "消化",
            reading: "しょうか",
            meaning: "pencernaan",
            unsur: [
              { jokugo: "消", arti: "menghilangkan" },
              { jokugo: "化", arti: "mengubah" }
            ],
            penjelasan: "Hubungan makna antarkanji 消 dan 化 menjadi 消化, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “proses penguraian dan perubahan makanan agar zat gizinya dapat diserap oleh tubuh.” Makna pencernaan dipahami dari kata 消化 secara utuh."
          },
          {
            word: "硬化",
            reading: "こうか",
            meaning: "pengerasan",
            unsur: [
              { jokugo: "硬", arti: "keras" },
              { jokugo: "化", arti: "menjadi" }
            ],
            penjelasan: "Hubungan makna antarkanji 硬 dan 化 menjadi 硬化, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perubahan suatu bahan menjadi keras.”"
          },
          {
            word: "軟化",
            reading: "なんか",
            meaning: "pelunakan",
            unsur: [
              { jokugo: "軟", arti: "lunak" },
              { jokugo: "化", arti: "menjadi" }
            ],
            penjelasan: "Hubungan makna antar kanji 軟 dan 化 menjadi 軟化, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perubahan suatu bahan menjadi lebih lunak.”"
          }
        ]
      },
      {
        name: "3. Perbaikan",
        jukugos: [
          {
            word: "強化",
            reading: "きょうか",
            meaning: "penguatan",
            unsur: [
              { jokugo: "強", arti: "kuat" },
              { jokugo: "化", arti: "menjadikan" }
            ],
            penjelasan: "Hubungan makna antar kanji 強 dan 化 menjadi 強化, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tindakan menjadikan sesuatu lebih kuat.”"
          },
          {
            word: "美化",
            reading: "びか",
            meaning: "memperindah",
            unsur: [
              { jokugo: "美", arti: "indah" },
              { jokugo: "化", arti: "menjadikan" }
            ],
            penjelasan: "Hubungan makna antarkanji 美 dan 化 menjadi 美化, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tindakan menjadikan suatu tempat atau lingkungan lebih indah.”"
          },
          {
            word: "浄化",
            reading: "じょうか",
            meaning: "pemurnian",
            unsur: [
              { jokugo: "浄", arti: "murni" },
              { jokugo: "化", arti: "menjadikan" }
            ],
            penjelasan: "Hubungan makna antar kanji 浄 dan 化 menjadi 浄化, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “proses menghilangkan unsur pengotor atau pencemar sehingga menjadi lebih murni.”"
          },
          {
            word: "緑化",
            reading: "りょっか",
            meaning: "penghijauan",
            unsur: [
              { jokugo: "緑", arti: "hijau" },
              { jokugo: "化", arti: "menjadikan" }
            ],
            penjelasan: "Hubungan makna antar kanji 緑 dan 化 menjadi 緑化, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan menjadikan suatu kawasan lebih hijau melalui penanaman tumbuhan.”"
          }
        ]
      },
      {
        name: "4. Budaya",
        jukugos: [
          {
            word: "文化",
            reading: "ぶんか",
            meaning: "budaya",
            unsur: [
              { jokugo: "文", arti: "kebudayaan" },
              { jokugo: "化", arti: "pembentukan dalam konteks kata ini" }
            ],
            penjelasan: "Hubungan makna antar kanji 文 dan 化 menjadi 文化, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “budaya yang mencakup kebiasaan, pengetahuan, nilai, dan hasil kegiatan manusia dalam masyarakat.”"
          }
        ]
      },
      {
        name: "5. Penerapan Teknologi",
        jukugos: [
          {
            word: "電化",
            reading: "でんか",
            meaning: "elektrifikasi",
            unsur: [
              { jokugo: "電", arti: "listrik" },
              { jokugo: "化", arti: "menjadikan" }
            ],
            penjelasan: "Hubungan makna antar kanji 電 dan 化 menjadi 電化, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perubahan suatu sistem atau peralatan menjadi menggunakan tenaga listrik.”"
          }
        ]
      }
    ],
    crossLinks: [
      ["進化", "evolusi vs degenerasi", "退化"],
      ["進化", "diferensiasi evolusi", "分化"],
      ["硬化", "pengerasan vs pelunakan", "軟化"],
      ["強化", "penguatan & perbaikan", "美化"],
      ["浄化", "pemurnian & penghijauan", "緑化"],
      ["変化", "perubahan keadaan memburuk", "悪化"],
      ["化学", "reaksi & ilmu kimia", "化合"],
      ["文化", "kemajuan budaya & teknologi", "電化"]
    ],
    quizzes: [
      // 5 Unscramble
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["化学を", "聞きながら", "勉強しています", "音楽を"]),
        correctOrder: JSON.stringify(["音楽を", "聞きながら", "化学を", "勉強しています"]),
        correctAnswer: "0",
        explanation: "Jawaban: 音楽を聞きながら、化学を勉強しています。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["があります", "文化に", "興味", "日本の"]),
        correctOrder: JSON.stringify(["日本の", "文化に", "興味", "があります"]),
        correctAnswer: "0",
        explanation: "Jawaban: 日本の文化に興味があります。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["つもりです", "学校の庭を", "来年", "緑化する"]),
        correctOrder: JSON.stringify(["来年", "学校の庭を", "緑化する", "つもりです"]),
        correctAnswer: "0",
        explanation: "Jawaban: 来年、学校の庭を緑化するつもりです。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["調べています", "変化について", "生活の"]),
        correctOrder: JSON.stringify(["生活の", "変化について", "調べています"]),
        correctAnswer: "0",
        explanation: "Jawaban: 生活の変化について調べています。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["悪化したんです", "天気が", "昨日から"]),
        correctOrder: JSON.stringify(["昨日から", "天気が", "悪化したんです"]),
        correctAnswer: "0",
        explanation: "Jawaban: 昨日から天気が悪化したんです。"
      },
      // 1 Grouping
      {
        type: "grouping",
        question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
        words: JSON.stringify([
          "硬化", "文化", "強化", "進化", "変化",
          "電化", "化学", "緑化", "消化", "老化"
        ]),
        groups: JSON.stringify([
          {
            name: "1. Perkembangan",
            category: "1. Perkembangan",
            correctWords: ["進化", "老化"],
            items: ["進化", "老化"],
            "1. Perkembangan": ["進化", "老化"]
          },
          {
            name: "2. Perubahan Keadaan dan Zat",
            category: "2. Perubahan Keadaan dan Zat",
            correctWords: ["変化", "化学", "消化", "硬化"],
            items: ["変化", "化学", "消化", "硬化"],
            "2. Perubahan Keadaan dan Zat": ["変化", "化学", "消化", "硬化"]
          },
          {
            name: "3. Perbaikan",
            category: "3. Perbaikan",
            correctWords: ["強化", "緑化"],
            items: ["強化", "緑化"],
            "3. Perbaikan": ["強化", "緑化"]
          },
          {
            name: "4. Budaya dan Teknologi",
            category: "4. Budaya dan Teknologi",
            correctWords: ["文化", "電化"],
            items: ["文化", "電化"],
            "4. Budaya dan Teknologi": ["文化", "電化"]
          }
        ]),
        explanation: "Kunci Jawaban:\n1. Perkembangan: 進化・老化\n2. Perubahan keadaan dan zat: 変化・化学・消化・硬化\n3. Perbaikan: 強化・緑化\n4. Budaya dan teknologi: 文化・電化"
      },
      // 5 Multiple Choice (Section c)
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “perubahan menjadi lebih buruk”?",
        options: JSON.stringify(["悪化", "浄化", "同化"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 悪化 (akka) - perubahan kondisi menjadi lebih buruk."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “proses perubahan dari satu keadaan atau wujud menjadi keadaan lain”?",
        options: JSON.stringify(["変化", "強化", "悪化"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 変化 (henka) - perubahan dari satu keadaan ke keadaan lain."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “upaya memperkuat atau meningkatkan kualitas/daya tahan”?",
        options: JSON.stringify(["消化", "強化", "劣化"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 強化 (kyouka) - upaya memperkuat."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “proses menjadi tua atau mengalami penuaan”?",
        options: JSON.stringify(["国際化", "老化", "美化"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 老化 (rouka) - proses penuaan seiring usia."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “proses menjadi keras atau mengalami pengerasan”?",
        options: JSON.stringify(["分化", "悪化", "硬化"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 硬化 (kouka) - perubahan bahan menjadi keras."
      },
      // 5 Fill in Blank (Section d)
      {
        type: "fill",
        question: "この資料で、食べ物の（　　　　）の仕組みが調べられます。",
        options: JSON.stringify(["消化", "文化", "緑化"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 消化 (shouka) - pencernaan makanan."
      },
      {
        type: "fill",
        question: "木を植えながら、公園の（　　　　）について話しています。",
        options: JSON.stringify(["消化", "老化", "緑化"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 緑化 (ryokka) - penghijauan taman dengan menanam pohon."
      },
      {
        type: "fill",
        question: "寒くなって、病気が（　　　　）してしまいました。",
        options: JSON.stringify(["文化", "悪化", "化学"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 悪化 (akka) - penyakit menjadi memburuk."
      },
      {
        type: "fill",
        question: "試合の前に、チームの守りを（　　　　）しておきます。",
        options: JSON.stringify(["強化", "消化", "老化"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 強化 (kyouka) - memperkuat pertahanan tim."
      },
      {
        type: "fill",
        question: "日本へ（　　　　　）を研究に行く予定です。",
        options: JSON.stringify(["文化", "悪化", "化学"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 文化 (bunka) - meneliti kebudayaan Jepang."
      }
    ]
  },

  // ===========================================================
  // 2. KANJI 発 (ID: 3250)
  // ===========================================================
  {
    id: 3250,
    character: "発",
    romaji: "HATSU, HOTSU / ta(tsu)",
    meaning: "Memulai, mengeluarkan, berangkat, muncul",
    baseMeaning: "Memulai atau menyebabkan sesuatu keluar, muncul, bergerak, atau berkembang dari suatu titik awal. (Kakijun.com; kanjime: kanjipedia)",
    bushuu: "癶 (Langkah / Kaki)",
    onyomi: "ハツ、ホツ",
    kunyomi: "た（つ）",
    examples: [
      {
        japanese: "先生の発音を聞きながら、練習します。",
        romaji: "Sensei no hatsuon o kikinagara, renshuu shimasu.",
        translation: "Saya berlatih sambil mendengarkan pengucapan guru."
      },
      {
        japanese: "発表の資料を家に忘れてしまいました。",
        romaji: "Happyou no shiryou o ie ni wasurete shimaimashita.",
        translation: "Saya lupa membawa dokumen presentasi yang tertinggal di rumah."
      },
      {
        japanese: "明日の出発の時間を、先生に聞いておきます。",
        romaji: "Ashita no shuppatsu no jikan o, sensei ni kiite okimasu.",
        translation: "Saya akan menanyakan waktu keberangkatan besok kepada guru terlebih dahulu."
      },
      {
        japanese: "将来、日本語のアプリを開発するつもりです。",
        romaji: "Shourai, Nihongo no apuri o kaihatsu suru tsumori desu.",
        translation: "Di masa depan, saya berniat mengembangkan aplikasi bahasa Jepang."
      },
      {
        japanese: "この会社は来月、新しい本を発売するかもしれません。",
        romaji: "Kono kaisha wa raigetsu, atarashii hon o hatsubai suru kamoshiremasen.",
        translation: "Perusahaan ini mungkin akan merilis buku baru bulan depan."
      }
    ],
    reflections: [
      "Apa makna dasar kanji 発 yang anda pahami?",
      "Jukugo mana yang mudah untuk di ingat? Mengapa?",
      "Apa perbedaan penggunaan 発展、発表 dan 発送?",
      "Cabang semantic graph mana yang menurut anda paling mudah dipahami?",
      "Bagaimana cara anda mengingat hubungan makna antar jukugo yang mengandung kanji 発?"
    ],
    categories: [
      {
        name: "1. Berangkat",
        jukugos: [
          {
            word: "出発",
            reading: "しゅっぱつ",
            meaning: "keberangkatan",
            unsur: [
              { jokugo: "出", arti: "keluar" },
              { jokugo: "発", arti: "mulai" }
            ],
            penjelasan: "Hubungan makna antar kanji 出 dan 発 menjadi 出発, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tindakan mulai meninggalkan suatu tempat untuk menuju tempat lain.”"
          },
          {
            word: "発車",
            reading: "はっしゃ",
            meaning: "keberangkatan kereta/kendaraan",
            unsur: [
              { jokugo: "発", arti: "mulai" },
              { jokugo: "車", arti: "kendaraan" }
            ],
            penjelasan: "Hubungan makna antar kanji 発 dan 車 menjadi 発車, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kendaraan yang mulai bergerak meninggalkan tempat pemberhentian.”"
          },
          {
            word: "発進",
            reading: "はっしん",
            meaning: "memulai bergerak maju",
            unsur: [
              { jokugo: "発", arti: "mulai" },
              { jokugo: "進", arti: "maju" }
            ],
            penjelasan: "Hubungan makna antar kanji 発 dan 進 menjadi 発進, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tindakan memulai gerakan maju dari keadaan berhenti.”"
          }
        ]
      },
      {
        name: "2. Muncul dan Berkembang",
        jukugos: [
          {
            word: "発生",
            reading: "はっせい",
            meaning: "terjadinya sesuatu",
            unsur: [
              { jokugo: "発", arti: "muncul" },
              { jokugo: "生", arti: "timbul" }
            ],
            penjelasan: "Hubungan makna antarkanji 発 dan 生 menjadi 発生, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “munculnya suatu peristiwa atau keadaan.”"
          },
          {
            word: "発達",
            reading: "はったつ",
            meaning: "perkembangan",
            unsur: [
              { jokugo: "発", arti: "muncul" },
              { jokugo: "達", arti: "mencapai" }
            ],
            penjelasan: "Hubungan makna antarkanji 発 dan 達 menjadi 発達, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perkembangan fungsi, kemampuan, atau keadaan hingga mencapai tingkat yang lebih maju.”"
          },
          {
            word: "発展",
            reading: "はってん",
            meaning: "perkembangan lebih lanjut",
            unsur: [
              { jokugo: "発", arti: "muncul" },
              { jokugo: "展", arti: "memperluas" }
            ],
            penjelasan: "Hubungan makna antarkanji 発 dan 展 menjadi 発展, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perkembangan suatu kegiatan atau keadaan sehingga menjadi lebih luas atau maju.”"
          },
          {
            word: "発育",
            reading: "はついく",
            meaning: "pertumbuhan",
            unsur: [
              { jokugo: "発", arti: "mulai muncul" },
              { jokugo: "育", arti: "tumbuh" }
            ],
            penjelasan: "Hubungan makna antarkanji 発 dan 育 menjadi 発育, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “proses pertumbuhan dan perkembangan tubuh makhluk hidup.”"
          }
        ]
      },
      {
        name: "3. Mengembangkan",
        jukugos: [
          {
            word: "開発",
            reading: "かいはつ",
            meaning: "pengembangan",
            unsur: [
              { jokugo: "開", arti: "membuka" },
              { jokugo: "発", arti: "menghasilkan" }
            ],
            penjelasan: "Hubungan makna antar kanji 開 dan 発 menjadi 開発, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan mengembangkan sumber daya, wilayah, atau produk agar memiliki kegunaan atau nilai baru.”"
          }
        ]
      },
      {
        name: "4. Menemukan",
        jukugos: [
          {
            word: "発見",
            reading: "はっけん",
            meaning: "penemuan hal tak terduga",
            unsur: [
              { jokugo: "発", arti: "menampakkan" },
              { jokugo: "見", arti: "melihat" }
            ],
            penjelasan: "Hubungan makna antar kanji 発 dan 見 menjadi 発見, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menemukan sesuatu yang sebelumnya belum terlihat atau belum diketahui.”"
          },
          {
            word: "発明",
            reading: "はつめい",
            meaning: "penemuan ciptaan baru",
            unsur: [
              { jokugo: "発", arti: "menghasilkan" },
              { jokugo: "明", arti: "jelas" }
            ],
            penjelasan: "Hubungan makna antar kanji 発 dan 明 menjadi 発明, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menciptakan sesuatu yang baru melalui pemikiran atau percobaan.”"
          }
        ]
      },
      {
        name: "5. Menyampaikan",
        jukugos: [
          {
            word: "発表",
            reading: "はっぴょう",
            meaning: "pengumuman / presentasi",
            unsur: [
              { jokugo: "発", arti: "mengeluarkan" },
              { jokugo: "表", arti: "menampilkan" }
            ],
            penjelasan: "Hubungan makna antar kanji 発 dan 表 menjadi 発表, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “penyampaian hasil, informasi, atau gagasan kepada orang lain.”"
          },
          {
            word: "発言",
            reading: "はつげん",
            meaning: "pernyataan",
            unsur: [
              { jokugo: "発", arti: "mengeluarkan" },
              { jokugo: "言", arti: "perkataan" }
            ],
            penjelasan: "Hubungan makna antar kanji 発 dan 言 menjadi 発言, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tindakan menyampaikan pendapat melalui perkataan.”"
          },
          {
            word: "発音",
            reading: "はつおん",
            meaning: "pengucapan",
            unsur: [
              { jokugo: "発", arti: "mengeluarkan" },
              { jokugo: "音", arti: "bunyi" }
            ],
            penjelasan: "Hubungan makna antar kanji 発 dan 音 menjadi 発音, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tindakan menghasilkan bunyi bahasa dalam pengucapan.”"
          },
          {
            word: "発信",
            reading: "はっしん",
            meaning: "mengirimkan informasi",
            unsur: [
              { jokugo: "発", arti: "mengirim" },
              { jokugo: "信", arti: "pesan" }
            ],
            penjelasan: "Hubungan makna antar kanji 発 dan 信 menjadi 発信, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tindakan mengirim pesan atau informasi dari pengirim kepada penerima.”"
          }
        ]
      },
      {
        name: "6. Mengirim dan Menerbitkan",
        jukugos: [
          {
            word: "発送",
            reading: "はっそう",
            meaning: "pengiriman",
            unsur: [
              { jokugo: "発", arti: "mengeluarkan" },
              { jokugo: "送", arti: "mengirim" }
            ],
            penjelasan: "Hubungan makna antar kanji 発 dan 送 menjadi 発送, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tindakan mengirim barang dari tempat asal menuju penerima atau tempat tujuan.”"
          },
          {
            word: "発売",
            reading: "はつばい",
            meaning: "penjualan",
            unsur: [
              { jokugo: "発", arti: "mulai" },
              { jokugo: "売", arti: "menjual" }
            ],
            penjelasan: "Hubungan makna antar kanji 発 dan 売 menjadi 発売, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tindakan mulai menawarkan suatu produk untuk dijual kepada masyarakat.”"
          },
          {
            word: "発行",
            reading: "はっこう",
            meaning: "penerbitan",
            unsur: [
              { jokugo: "発", arti: "mengeluarkan" },
              { jokugo: "行", arti: "menjalankan" }
            ],
            penjelasan: "Hubungan makna antar kanji 発 dan 行 menjadi 発行, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tindakan menerbitkan dan mengedarkan buku, surat kabar, atau dokumen.”"
          }
        ]
      }
    ],
    crossLinks: [
      ["出発", "keberangkatan orang vs kendaraan", "発車"],
      ["発車", "kendaraan mulai bergerak", "発進"],
      ["発見", "menemukan vs menciptakan hal baru", "発明"],
      ["発生", "kemunculan & perkembangan", "発達"],
      ["発達", "perkembangan menuju kemajuan", "発展"],
      ["発表", "penyampaian presentasi & pernyataan lisan", "発言"],
      ["発表", "penyampaian & pengiriman pesan", "発信"],
      ["発送", "pengiriman barang & penjualan produk", "発売"],
      ["発売", "penjualan & penerbitan", "発行"],
      ["開発", "pengembangan & perluasan", "発展"]
    ],
    quizzes: [
      // 5 Unscramble
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["先生の", "聞きながら", "練習します", "発音を"]),
        correctOrder: JSON.stringify(["先生の", "発音を", "聞きながら", "練習します"]),
        correctAnswer: "0",
        explanation: "Jawaban: 先生の発音を聞きながら、練習します。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["発表の", "忘れてしまいました", "家に", "資料を"]),
        correctOrder: JSON.stringify(["発表の", "資料を", "家に", "忘れてしまいました"]),
        correctAnswer: "0",
        explanation: "Jawaban: 発表の資料を家に忘れてしまいました。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["先生に", "明日の", "聞いておきます", "出発の時間を"]),
        correctOrder: JSON.stringify(["明日の", "出発の時間を", "先生に", "聞いておきます"]),
        correctAnswer: "0",
        explanation: "Jawaban: 明日の出発の時間を、先生に聞いておきます。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["開発するつもりです", "将来", "日本語のアプリを"]),
        correctOrder: JSON.stringify(["将来", "日本語のアプリを", "開発するつもりです"]),
        correctAnswer: "0",
        explanation: "Jawaban: 将来、日本語のアプリを開発するつもりです。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["発売するかもしれません", "来月", "この会社は", "新しい本を"]),
        correctOrder: JSON.stringify(["この会社は", "来月", "新しい本を", "発売するかもしれません"]),
        correctAnswer: "0",
        explanation: "Jawaban: この会社は来月、新しい本を発売するかもしれません。"
      },
      // 1 Grouping
      {
        type: "grouping",
        question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
        words: JSON.stringify([
          "開発", "発育", "発音", "発表", "発行",
          "発車", "発生", "出発", "発送", "発見"
        ]),
        groups: JSON.stringify([
          {
            name: "1. Berangkat",
            category: "1. Berangkat",
            correctWords: ["出発", "発車"],
            items: ["出発", "発車"],
            "1. Berangkat": ["出発", "発車"]
          },
          {
            name: "2. Muncul dan Berkembang",
            category: "2. Muncul dan Berkembang",
            correctWords: ["発生", "発育"],
            items: ["発生", "発育"],
            "2. Muncul dan Berkembang": ["発生", "発育"]
          },
          {
            name: "3. Mengembangkan",
            category: "3. Mengembangkan",
            correctWords: ["開発"],
            items: ["開発"],
            "3. Mengembangkan": ["開発"]
          },
          {
            name: "4. Menemukan",
            category: "4. Menemukan",
            correctWords: ["発見"],
            items: ["発見"],
            "4. Menemukan": ["発見"]
          },
          {
            name: "5. Menyampaikan",
            category: "5. Menyampaikan",
            correctWords: ["発表", "発音"],
            items: ["発表", "発音"],
            "5. Menyampaikan": ["発表", "発音"]
          },
          {
            name: "6. Mengirim dan Menerbitkan",
            category: "6. Mengirim dan Menerbitkan",
            correctWords: ["発送", "発行"],
            items: ["発送", "発行"],
            "6. Mengirim dan Menerbitkan": ["発送", "発行"]
          }
        ]),
        explanation: "Kunci Jawaban:\n1. Berangkat: 出発・発車\n2. Muncul dan Berkembang: 発生・発育\n3. Mengembangkan: 開発\n4. Menemukan: 発見\n5. Menyampaikan: 発表・発音\n6. Mengirimkan dan Menerbitkan: 発送・発行"
      },
      // 5 Multiple Choice (Section c)
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “keberangkatan dari suatu tempat”?",
        options: JSON.stringify(["出発", "発見", "発表"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 出発 (shuppatsu) - keberangkatan."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “sesuatu terjadi atau muncul”?",
        options: JSON.stringify(["発行", "発生", "発車"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 発生 (hassei) - munculnya peristiwa."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “berkembang atau mengalami perkembangan”?",
        options: JSON.stringify(["発送", "発音", "発達"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 発達 (hattatsu) - perkembangan kemampuan/keadaan."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “mengembangkan atau menciptakan sesuatu yang baru”?",
        options: JSON.stringify(["開発", "発育", "発言"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 開発 (kaihatsu) - pengembangan produk/sumber daya."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “menemukan sesuatu yang sebelumnya belum diketahui”?",
        options: JSON.stringify(["発売", "発見", "発進"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 発見 (hakken) - menemukan hal belum diketahui."
      },
      // 5 Fill in Blank (Section d)
      {
        type: "fill",
        question: "八時に電車が（　　　　）するんです。",
        options: JSON.stringify(["発明", "発音", "発車"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 発車 (hassha) - kereta berangkat."
      },
      {
        type: "fill",
        question: "この辞書で、言葉の（　　　　）が聞けます。",
        options: JSON.stringify(["発売", "発音", "発育"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 発音 (hatsuon) - pengucapan kata."
      },
      {
        type: "fill",
        question: "住所を確認しながら、荷物の（　　　　）をしています。",
        options: JSON.stringify(["発送", "発育", "発音"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 発送 (hassou) - pengiriman barang."
      },
      {
        type: "fill",
        question: "会議で、まだ秘密の計画を（　　　　）してしまいました。",
        options: JSON.stringify(["発車", "発育", "発表"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 発表 (happyou) - mengumumkan rencana rahasia."
      },
      {
        type: "fill",
        question: "新しい機械の（　　　　）の前に、説明の資料を作っておきます。",
        options: JSON.stringify(["発育", "発売", "発音"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 発売 (hatsubai) - penjualan mesin baru ke pasar."
      }
    ]
  },

  // ===========================================================
  // 3. KANJI 展 (ID: 3251)
  // ===========================================================
  {
    id: 3251,
    character: "展",
    romaji: "TEN",
    meaning: "Membentangkan, memperluas, mengembangkan",
    baseMeaning: "Membentangkan atau memperluas sesuatu sehingga terbuka, terlihat, atau berkembang. (Kanjime; kakijun.com; Kanji Pedia)",
    bushuu: "尸 (Tubuh / Berkembang)",
    onyomi: "テン",
    kunyomi: "-",
    examples: [
      {
        japanese: "先生の話を聞きながら、展示を見ます。",
        romaji: "Sensei no hanashi o kikinagara, tenji o mimasu.",
        translation: "Saya melihat pameran sambil mendengarkan penjelasan guru."
      },
      {
        japanese: "研究の展望を書いたノートを忘れてしまいました。",
        romaji: "Kenkyuu no tenbou o kaita nooto o wasurete shimaimashita.",
        translation: "Saya lupa membawa buku catatan yang memuat pandangan tentang penelitian."
      },
      {
        japanese: "個展に行く前に、場所を調べておきます。",
        romaji: "Koten ni iku mae ni, basho o shirabete okimasu.",
        translation: "Sebelum pergi ke pameran tunggal, saya akan mencari tahu lokasinya terlebih dahulu."
      },
      {
        japanese: "来年、新しい町で店を展開するつもりです。",
        romaji: "Rainen, atarashii machi de mise o tenkai suru tsumori desu.",
        translation: "Tahun depan, saya berencana membuka cabang toko di kota baru."
      },
      {
        japanese: "この計画は、来月進展するかもしれません。",
        romaji: "Kono keikaku wa, raigetsu shinten suru kamoshiremasen.",
        translation: "Rencana ini mungkin akan mengalami kemajuan bulan depan."
      }
    ],
    reflections: [
      "Apa makna dasar kanji 展 yang anda pahami?",
      "Jukugo mana yang mudah untuk di ingat? Mengapa?",
      "Apa perbedaan penggunaan 展示、親展 dan 展開?",
      "Cabang semantic graph mana yang menurut anda paling mudah dipahami?",
      "Bagaimana cara anda mengingat hubungan makna antar jukugo yang mengandung kanji 展?"
    ],
    categories: [
      {
        name: "1. Berkembang",
        jukugos: [
          {
            word: "展開",
            reading: "てんかい",
            meaning: "pengembangan",
            unsur: [
              { jokugo: "展", arti: "membentangkan" },
              { jokugo: "開", arti: "membuka" }
            ],
            penjelasan: "Hubungan makna antar kanji 展 dan 開 menjadi 展開, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “proses membuka dan mengembangkan sesuatu sehingga bagian, kegiatan, atau pembahasannya menjadi lebih luas.”"
          },
          {
            word: "発展",
            reading: "はってん",
            meaning: "perkembangan",
            unsur: [
              { jokugo: "発", arti: "muncul" },
              { jokugo: "展", arti: "memperluas" }
            ],
            penjelasan: "Hubungan makna antar kanji 発 dan 展 menjadi 発展, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perkembangan suatu kegiatan atau keadaan sehingga menjadi lebih luas atau maju.”"
          },
          {
            word: "進展",
            reading: "しんてん",
            meaning: "kemajuan",
            unsur: [
              { jokugo: "進", arti: "maju" },
              { jokugo: "展", arti: "berkembang" }
            ],
            penjelasan: "Hubungan makna antar kanji 進 dan 展 menjadi 進展, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kemajuan suatu kegiatan atau keadaan yang bergerak menuju tahap berikutnya.”"
          },
          {
            word: "伸展",
            reading: "しんてん",
            meaning: "perpanjangan",
            unsur: [
              { jokugo: "伸", arti: "meregang" },
              { jokugo: "展", arti: "membentangkan" }
            ],
            penjelasan: "Hubungan makna antar kanji 伸 dan 展 menjadi 伸展, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “proses meregangkan atau membentangkan sesuatu sehingga menjadi lebih panjang atau terbentang.”"
          }
        ]
      },
      {
        name: "2. Menampilkan",
        jukugos: [
          {
            word: "展示",
            reading: "てんじ",
            meaning: "pameran",
            unsur: [
              { jokugo: "展", arti: "menampilkan" },
              { jokugo: "示", arti: "menunjukkan" }
            ],
            penjelasan: "Hubungan makna antar kanji 展 dan 示 menjadi 展示, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan menampilkan benda atau karya agar dapat dilihat oleh orang lain.”"
          },
          {
            word: "展覧",
            reading: "てんらん",
            meaning: "pameran karya",
            unsur: [
              { jokugo: "展", arti: "menampilkan" },
              { jokugo: "覧", arti: "melihat" }
            ],
            penjelasan: "Hubungan makna antar kanji 展 dan 覧 menjadi 展覧, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan memamerkan benda atau karya agar dapat dilihat oleh pengunjung.”"
          },
          {
            word: "個展",
            reading: "こてん",
            meaning: "pameran tunggal",
            unsur: [
              { jokugo: "個", arti: "perorangan" },
              { jokugo: "展", arti: "pameran" }
            ],
            penjelasan: "Hubungan makna antar kanji 個 dan 展 menjadi 個展, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pameran yang menampilkan karya dari satu orang.” Dalam jukugo ini, 展 digunakan dengan makna pameran."
          }
        ]
      },
      {
        name: "3. Pandangan",
        jukugos: [
          {
            word: "展望",
            reading: "てんぼう",
            meaning: "pandangan luas / prospek",
            unsur: [
              { jokugo: "展", arti: "membentangkan" },
              { jokugo: "望", arti: "memandang luas" }
            ],
            penjelasan: "Hubungan makna antarkanji 展 dan 望 menjadi 展望, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pandangan yang menjangkau keadaan secara luas, termasuk gambaran mengenai kemungkinan keadaan pada masa depan.”"
          }
        ]
      },
      {
        name: "4. Membuka",
        jukugos: [
          {
            word: "親展",
            reading: "しんてん",
            meaning: "pribadi / rahasia langsung",
            unsur: [
              { jokugo: "親", arti: "sendiri secara langsung" },
              { jokugo: "展", arti: "membuka" }
            ],
            penjelasan: "Hubungan makna antar kanji 親 dan 展 menjadi 親展, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “penandaan pada surat agar surat tersebut dibuka sendiri oleh penerima yang dituju.”"
          }
        ]
      }
    ],
    crossLinks: [
      ["展開", "pembentangan & perluasan kemajuan", "発展"],
      ["発展", "perkembangan & kemajuan bertahap", "進展"],
      ["展示", "pameran benda vs galeri umum", "展覧"],
      ["展覧", "pameran umum vs pameran tunggal", "個展"],
      ["進展", "kemajuan & perpanjangan", "伸展"],
      ["展開", "pengembangan wawasan luas", "展望"]
    ],
    quizzes: [
      // 5 Unscramble
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["見ます", "聞きながら", "先生の話を", "展示を"]),
        correctOrder: JSON.stringify(["先生の話を", "聞きながら", "展示を", "見ます"]),
        correctAnswer: "0",
        explanation: "Jawaban: 先生の話を聞きながら、展示を見ます。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["展望を", "研究の", "忘れてしまいました"]),
        correctOrder: JSON.stringify(["研究の", "展望を", "忘れてしまいました"]),
        correctAnswer: "0",
        explanation: "Jawaban: 研究の展望を忘れてしまいました。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["前に", "ホテルを", "出張の", "予約しておきます", "出発の"]),
        correctOrder: JSON.stringify(["出張の", "出発の", "前に", "ホテルを", "予約しておきます"]),
        correctAnswer: "0",
        explanation: "Jawaban: 出張の出発の前に、ホテルを予約しておきます。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["日本語の", "つもりです", "開発する", "将来", "アプリを"]),
        correctOrder: JSON.stringify(["将来", "日本語の", "アプリを", "開発する", "つもりです"]),
        correctAnswer: "0",
        explanation: "Jawaban: 将来、日本語のアプリを開発するつもりです。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["かもしれません", "新しい本を", "発売する", "この会社は"]),
        correctOrder: JSON.stringify(["この会社は", "新しい本を", "発売する", "かもしれません"]),
        correctAnswer: "0",
        explanation: "Jawaban: この会社は新しい本を発売するかもしれません。"
      },
      // 1 Grouping
      {
        type: "grouping",
        question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
        words: JSON.stringify([
          "展開", "発展", "進展", "伸展",
          "展示", "展覧", "個展", "展望", "親展"
        ]),
        groups: JSON.stringify([
          {
            name: "1. Berkembang",
            category: "1. Berkembang",
            correctWords: ["展開", "発展", "進展", "伸展"],
            items: ["展開", "発展", "進展", "伸展"],
            "1. Berkembang": ["展開", "発展", "進展", "伸展"]
          },
          {
            name: "2. Menampilkan",
            category: "2. Menampilkan",
            correctWords: ["展示", "展覧", "個展"],
            items: ["展示", "展覧", "個展"],
            "2. Menampilkan": ["展示", "展覧", "個展"]
          },
          {
            name: "3. Pandangan",
            category: "3. Pandangan",
            correctWords: ["展望"],
            items: ["展望"],
            "3. Pandangan": ["展望"]
          },
          {
            name: "4. Membuka",
            category: "4. Membuka",
            correctWords: ["親展"],
            items: ["親展"],
            "4. Membuka": ["親展"]
          }
        ]),
        explanation: "Kunci Jawaban:\n1. Berkembang: 展開・発展・進展・伸展\n2. Menampilkan: 展示・展覧・個展\n3. Pandangan: 展望\n4. Membuka: 親展"
      },
      // 5 Multiple Choice (Section c)
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “pengembangan atau berlangsungnya suatu keadaan atau kegiatan”?",
        options: JSON.stringify(["展開", "展示", "親展"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 展開 (tenkai) - proses membuka dan mengembangkan cakupan kegiatan."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “perkembangan menuju keadaan yang lebih maju”?",
        options: JSON.stringify(["展覧", "展望", "発展"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 発展 (hatten) - perkembangan ke arah lebih maju."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “kemajuan atau perkembangan suatu keadaan”?",
        options: JSON.stringify(["個展", "進展", "親展"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 進展 (shinten) - kemajuan keadaan menuju tahap baru."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “perpanjangan atau pembentangan”?",
        options: JSON.stringify(["伸展", "展示", "発展"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 伸展 (shinten) - perpanjangan atau peregangan fisik."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “memamerkan atau menampilkan sesuatu”?",
        options: JSON.stringify(["展望", "展示", "親展"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 展示 (tenji) - menampilkan karya/benda untuk umum."
      },
      // 5 Fill in Blank (Section d)
      {
        type: "fill",
        question: "来週、私の絵だけを集めた（　　　　）があるんです。",
        options: JSON.stringify(["展望", "個展", "進展"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 個展 (koten) - pameran tunggal karya pribadi."
      },
      {
        type: "fill",
        question: "この会場では、学生の作品を（　　　　）できます。",
        options: JSON.stringify(["展示", "親展", "伸展"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 展示 (tenji) - memamerkan karya siswa di aula."
      },
      {
        type: "fill",
        question: "地図を見ながら、海外への事業（　　　　）について話しています。",
        options: JSON.stringify(["展覧", "親展", "展開"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 展開 (tenkai) - ekspansi atau pengembangan bisnis."
      },
      {
        type: "fill",
        question: "町の（　　　　）を調べたノートをなくしてしまいました。",
        options: JSON.stringify(["親展", "発展", "伸展"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 発展 (hatten) - perkembangan kota."
      },
      {
        type: "fill",
        question: "大切な手紙ですから、封筒に「（　　　　）」と書いておきます。",
        options: JSON.stringify(["親展", "展示", "発展"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 親展 (shinten) - surat rahasia/pribadi dibuka langsung penerima."
      }
    ]
  },

  // ===========================================================
  // 4. KANJI 成 (ID: 3253)
  // ===========================================================
  {
    id: 3253,
    character: "成",
    romaji: "SEI, JOU / na(ru)",
    meaning: "Menjadi, terbentuk, berhasil, menyelesaikan",
    baseMeaning: "Menjadi atau membentuk sesuatu hingga mencapai keadaan atau hasil tertentu. (Kanjime; kakijun.com; Kanji Pedia)",
    bushuu: "戈 (Tombak / Menjadi)",
    onyomi: "セイ、ジョウ",
    kunyomi: "な（る）、な（す）",
    examples: [
      {
        japanese: "子どもの成長を見ながら、写真を撮っています。",
        romaji: "Kodomo no seichou o minagara, shashin o totte imasu.",
        translation: "Saya mengambil foto sambil melihat pertumbuhan anak saya."
      },
      {
        japanese: "昨日、レポートを完成してしまいました。",
        romaji: "Kinou, repooto o kansei shite shimaimashita.",
        translation: "Kemarin saya telah menyelesaikan laporan itu."
      },
      {
        japanese: "会議の前に、資料を作成しておきます。",
        romaji: "Kaigi no mae ni, shiryou o sakusei shite okimasu.",
        translation: "Sebelum rapat, saya akan membuat dokumen terlebih dahulu."
      },
      {
        japanese: "今年みんなで協力したら、この計画は成功するかもしれません。",
        romaji: "Kotoshi minna de kyouryoku shitara, kono keikaku wa seikou suru kamoshiremasen.",
        translation: "Jika tahun ini semua orang bekerja sama, rencana ini mungkin akan berhasil."
      },
      {
        japanese: "日本語の勉強の目標を達成するつもりです。",
        romaji: "Nihongo no benkyou no mokuhyou o tassei suru tsumori desu.",
        translation: "Saya berencana mencapai target belajar bahasa Jepang saya."
      }
    ],
    reflections: [
      "Apa makna dasar kanji 成 yang anda pahami?",
      "Jukugo mana yang mudah untuk di ingat? Mengapa?",
      "Apa perbedaan penggunaan 達成、合成 dan 育成?",
      "Cabang semantic graph mana yang menurut anda paling mudah dipahami?",
      "Bagaimana cara anda mengingat hubungan makna antar jukugo yang mengandung kanji 成?"
    ],
    categories: [
      {
        name: "1. Pencapaian",
        jukugos: [
          {
            word: "成功",
            reading: "せいこう",
            meaning: "keberhasilan",
            unsur: [
              { jokugo: "成", arti: "menjadi" },
              { jokugo: "功", arti: "hasil usaha" }
            ],
            penjelasan: "Hubungan makna antar kanji 成 dan 功 menjadi 成功, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keberhasilan dalam mencapai tujuan melalui suatu usaha.”"
          },
          {
            word: "成果",
            reading: "せいか",
            meaning: "hasil",
            unsur: [
              { jokugo: "成", arti: "menghasilkan" },
              { jokugo: "果", arti: "buah" }
            ],
            penjelasan: "Hubungan makna antar kanji 成 dan 果 menjadi 成果, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “hasil yang diperoleh dari suatu usaha atau kegiatan.”"
          },
          {
            word: "達成",
            reading: "たっせい",
            meaning: "pencapaian sasaran",
            unsur: [
              { jokugo: "達", arti: "mencapai" },
              { jokugo: "成", arti: "berhasil" }
            ],
            penjelasan: "Hubungan makna antar kanji 達 dan 成 menjadi 達成, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pencapaian suatu sasaran hingga berhasil diwujudkan.”"
          },
          {
            word: "成就",
            reading: "じょうじゅ",
            meaning: "tercapai wujud",
            unsur: [
              { jokugo: "成", arti: "berhasil" },
              { jokugo: "就", arti: "menyelesaikan" }
            ],
            penjelasan: "Hubungan makna antar kanji 成 dan 就 menjadi 成就, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “terwujudnya suatu keinginan atau tujuan hingga tercapai.”"
          }
        ]
      },
      {
        name: "2. Pertumbuhan",
        jukugos: [
          {
            word: "成長",
            reading: "せいちょう",
            meaning: "pertumbuhan",
            unsur: [
              { jokugo: "成", arti: "tumbuh" },
              { jokugo: "長", arti: "memanjang" }
            ],
            penjelasan: "Hubungan makna antar kanji 成 dan 長 menjadi 成長, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pertumbuhan makhluk hidup menuju ukuran atau tingkat perkembangan yang lebih besar.”"
          },
          {
            word: "成育",
            reading: "せいいく",
            meaning: "pertumbuhan & pembesaran",
            unsur: [
              { jokugo: "成", arti: "tumbuh" },
              { jokugo: "育", arti: "berkembang" }
            ],
            penjelasan: "Hubungan makna antar kanji 成 dan 育 menjadi 成育, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “proses pertumbuhan dan perkembangan makhluk hidup.”"
          }
        ]
      },
      {
        name: "3. Kedewasaan",
        jukugos: [
          {
            word: "成人",
            reading: "せいじん",
            meaning: "orang dewasa",
            unsur: [
              { jokugo: "成", arti: "menjadi" },
              { jokugo: "人", arti: "orang" }
            ],
            penjelasan: "Hubungan makna antar kanji 成 dan 人 menjadi 成人, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “orang yang telah mencapai tahap dewasa.”"
          },
          {
            word: "成年",
            reading: "せいねん",
            meaning: "kedewasaan",
            unsur: [
              { jokugo: "成", arti: "mencapai" },
              { jokugo: "年", arti: "usia" }
            ],
            penjelasan: "Hubungan makna antar kanji 成 dan 年 menjadi 成年, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keadaan seseorang yang telah mencapai usia dewasa.”"
          }
        ]
      },
      {
        name: "4. Pembentukan",
        jukugos: [
          {
            word: "成立",
            reading: "せいりつ",
            meaning: "pembentukan resmi / berlaku",
            unsur: [
              { jokugo: "成", arti: "terbentuk" },
              { jokugo: "立", arti: "berdiri" }
            ],
            penjelasan: "Hubungan makna antar kanji 成 dan 立 menjadi 成立, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “terbentuknya sesuatu sehingga dapat berdiri atau berlaku.”"
          },
          {
            word: "完成",
            reading: "かんせい",
            meaning: "penyelesaian sempurna",
            unsur: [
              { jokugo: "完", arti: "lengkap" },
              { jokugo: "成", arti: "terbentuk" }
            ],
            penjelasan: "Hubungan makna antar kanji 完 dan 成 menjadi 完成, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keadaan ketika pembuatan sesuatu telah selesai dan menjadi lengkap.”"
          },
          {
            word: "作成",
            reading: "さくせい",
            meaning: "pembuatan dokumen/karya",
            unsur: [
              { jokugo: "作", arti: "membuat" },
              { jokugo: "成", arti: "menyelesaikan" }
            ],
            penjelasan: "Hubungan makna antarkanji 作 dan 成 menjadi 作成, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pembuatan atau penyusunan sesuatu hingga menjadi hasil yang selesai.”"
          },
          {
            word: "形成",
            reading: "けいせい",
            meaning: "pembentukan struktur",
            unsur: [
              { jokugo: "形", arti: "bentuk" },
              { jokugo: "成", arti: "membentuk" }
            ],
            penjelasan: "Hubungan makna antar kanji 形 dan 成 menjadi 形成, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “proses terbentuknya suatu bentuk, keadaan, atau sistem.”"
          },
          {
            word: "構成",
            reading: "こうせい",
            meaning: "komposisi susunan",
            unsur: [
              { jokugo: "構", arti: "menyusun" },
              { jokugo: "成", arti: "membentuk" }
            ],
            penjelasan: "Hubungan makna antar kanji 構 dan 成 menjadi 構成, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “susunan beberapa unsur yang membentuk suatu keseluruhan.”"
          },
          {
            word: "合成",
            reading: "ごうせい",
            meaning: "sintesis penggabungan",
            unsur: [
              { jokugo: "合", arti: "menggabungkan" },
              { jokugo: "成", arti: "membentuk" }
            ],
            penjelasan: "Hubungan makna antar kanji 合 dan 成 menjadi 合成, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pembentukan sesuatu dengan menggabungkan dua unsur atau lebih.”"
          },
          {
            word: "結成",
            reading: "けっせい",
            meaning: "pembentukan organisasi",
            unsur: [
              { jokugo: "結", arti: "menyatukan" },
              { jokugo: "成", arti: "membentuk" }
            ],
            penjelasan: "Hubungan makna antar kanji 結 dan 成 menjadi 結成, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pembentukan kelompok atau organisasi dengan menyatukan sejumlah orang.”"
          },
          {
            word: "生成",
            reading: "せいせい",
            meaning: "generasi pembentukan",
            unsur: [
              { jokugo: "生", arti: "lahir" },
              { jokugo: "成", arti: "terbentuk" }
            ],
            penjelasan: "Hubungan makna antar kanji 生 dan 成 menjadi 生成, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “proses terbentuk atau dihasilkannya sesuatu.”"
          },
          {
            word: "成形",
            reading: "せいけい",
            meaning: "pembentukan cetakan",
            unsur: [
              { jokugo: "成", arti: "membentuk" },
              { jokugo: "形", arti: "bentuk" }
            ],
            penjelasan: "Hubungan makna antar kanji 成 dan 形 menjadi 成形, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “proses membentuk suatu bahan hingga memiliki bentuk tertentu.”"
          }
        ]
      },
      {
        name: "5. Pengembangan",
        jukugos: [
          {
            word: "育成",
            reading: "いくせい",
            meaning: "pengembangan pembinaan",
            unsur: [
              { jokugo: "育", arti: "membina" },
              { jokugo: "成", arti: "membentuk" }
            ],
            penjelasan: "Hubungan makna antar kanji 育 dan 成 menjadi 育成, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengembangan kemampuan atau pertumbuhan melalui pembinaan.”"
          },
          {
            word: "養成",
            reading: "ようせい",
            meaning: "pelatihan kejuruan",
            unsur: [
              { jokugo: "養", arti: "memelihara" },
              { jokugo: "成", arti: "membentuk" }
            ],
            penjelasan: "Hubungan makna antar kanji 養 dan 成 menjadi 養成, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pelatihan untuk membentuk seseorang agar memiliki kemampuan tertentu.”"
          }
        ]
      },
      {
        name: "6. Persetujuan",
        jukugos: [
          {
            word: "賛成",
            reading: "さんせい",
            meaning: "persetujuan dukungan",
            unsur: [
              { jokugo: "賛", arti: "mendukung" },
              { jokugo: "成", arti: "terwujud" }
            ],
            penjelasan: "Hubungan makna antar kanji 賛 dan 成 menjadi 賛成, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “persetujuan atau dukungan terhadap suatu pendapat, usulan, atau keputusan.”"
          }
        ]
      }
    ],
    crossLinks: [
      ["成功", "keberhasilan & perolehan hasil usaha", "成果"],
      ["達成", "pencapaian sasaran & terwujud cita-cita", "成就"],
      ["成長", "tumbuh kembang makhluk hidup", "成育"],
      ["成人", "orang dewasa & usia kedewasaan", "成年"],
      ["完成", "penyelesaian akhir & proses pembuatan", "作成"],
      ["形成", "pembentukan wujud & susunan struktur", "構成"],
      ["合成", "sintesis penggabungan & produksi hasil", "生成"],
      ["育成", "pembinaan bakat & pelatihan keahlian", "養成"],
      ["成立", "kesepakatan berdiri berkat persetujuan", "賛成"],
      ["結成", "pembentukan tim & pendirian organisasi", "成立"]
    ],
    quizzes: [
      // 5 Unscramble
      {
        type: "unscramble",
        question: "Susunlah kata-kata dibawah ini menjadi kalimat yang tepat.",
        words: JSON.stringify(["見ながら", "撮っています", "写真を", "成長を", "子どもの"]),
        correctOrder: JSON.stringify(["子どもの", "成長を", "見ながら", "写真を", "撮っています"]),
        correctAnswer: "0",
        explanation: "Jawaban: 子どもの成長を見ながら、写真を撮っています。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata dibawah ini menjadi kalimat yang tepat.",
        words: JSON.stringify(["完成して", "昨日", "しまいました", "レポートを"]),
        correctOrder: JSON.stringify(["昨日", "レポートを", "完成して", "しまいました"]),
        correctAnswer: "0",
        explanation: "Jawaban: 昨日、レポートを完成してしまいました。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata dibawah ini menjadi kalimat yang tepat.",
        words: JSON.stringify(["つもりです", "勉強の", "達成する", "目標を", "今年", "日本語の"]),
        correctOrder: JSON.stringify(["今年", "日本語の", "勉強の", "目標を", "達成する", "つもりです"]),
        correctAnswer: "0",
        explanation: "Jawaban: 今年、日本語の勉強の目標を達成するつもりです。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata dibawah ini menjadi kalimat yang tepat.",
        words: JSON.stringify(["おきます", "資料を", "会議の前に", "作成して"]),
        correctOrder: JSON.stringify(["会議の前に", "資料を", "作成して", "おきます"]),
        correctAnswer: "0",
        explanation: "Jawaban: 会議の前に資料を作成しておきます。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata dibawah ini menjadi kalimat yang tepat.",
        words: JSON.stringify(["協力したら", "この計画は", "かもしれません", "みんなで", "成功する"]),
        correctOrder: JSON.stringify(["みんなで", "協力したら", "この計画は", "成功する", "かもしれません"]),
        correctAnswer: "0",
        explanation: "Jawaban: みんなで協力したら、この計画は成功するかもしれません。"
      },
      // 1 Grouping
      {
        type: "grouping",
        question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
        words: JSON.stringify([
          "成功", "成果", "達成", "成長", "育成",
          "成人", "成年", "成立", "完成", "形成"
        ]),
        groups: JSON.stringify([
          {
            name: "1. Pencapaian",
            category: "1. Pencapaian",
            correctWords: ["成功", "成果", "達成"],
            items: ["成功", "成果", "達成"],
            "1. Pencapaian": ["成功", "成果", "達成"]
          },
          {
            name: "2. Pertumbuhan",
            category: "2. Pertumbuhan",
            correctWords: ["成長"],
            items: ["成長"],
            "2. Pertumbuhan": ["成長"]
          },
          {
            name: "3. Kedewasaan",
            category: "3. Kedewasaan",
            correctWords: ["成人", "成年"],
            items: ["成人", "成年"],
            "3. Kedewasaan": ["成人", "成年"]
          },
          {
            name: "4. Pembentukan",
            category: "4. Pembentukan",
            correctWords: ["成立", "完成", "形成"],
            items: ["成立", "完成", "形成"],
            "4. Pembentukan": ["成立", "完成", "形成"]
          },
          {
            name: "5. Pengembangan",
            category: "5. Pengembangan",
            correctWords: ["育成"],
            items: ["育成"],
            "5. Pengembangan": ["育成"]
          }
        ]),
        explanation: "Kunci Jawaban:\n1. Pencapaian: 成功・成果・達成\n2. Pertumbuhan: 成長\n3. Kedewasaan: 成人・成年\n4. Pembentukan: 成立・完成・形成\n5. Pengembangan: 育成"
      },
      // 5 Multiple Choice (Section c)
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “keberhasilan dalam mencapai suatu tujuan”?",
        options: JSON.stringify(["成人", "成功", "形成"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 成功 (seikou) - keberhasilan mencapai tujuan."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “hasil yang diperoleh dari suatu usaha atau kegiatan”?",
        options: JSON.stringify(["賛成", "成年", "成果"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 成果 (seika) - hasil perolehan dari usaha."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “mencapai sesuatu yang telah ditargetkan”?",
        options: JSON.stringify(["達成", "構成", "成長"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 達成 (tassei) - pencapaian target/sasaran."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “pertumbuhan atau proses menjadi lebih berkembang”?",
        options: JSON.stringify(["成立", "成長", "合成"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 成長 (seichou) - pertumbuhan menjadi lebih besar."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “orang yang telah menjadi dewasa”?",
        options: JSON.stringify(["成人", "作成", "育成"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 成人 (seijin) - orang dewasa."
      },
      // 5 Fill in Blank (Section d)
      {
        type: "fill",
        question: "この計画には（　　　　）なんです。ぜひ一緒にやりましょう。",
        options: JSON.stringify(["成長", "合成", "賛成"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 賛成 (sansei) - menyetujui dan mendukung rencana."
      },
      {
        type: "fill",
        question: "このソフトで、会議の資料が（　　　　）できます。",
        options: JSON.stringify(["成人", "作成", "成長"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 作成 (sakusei) - membuat dokumen rapat."
      },
      {
        type: "fill",
        question: "子どもの写真を見ながら、（　　　　）について話しています。",
        options: JSON.stringify(["成長", "合成", "賛成"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 成長 (seichou) - pertumbuhan anak."
      },
      {
        type: "fill",
        question: "このパズルは、もう（　　　　）しています。",
        options: JSON.stringify(["成人", "成育", "完成"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 完成 (kansei) - susunan teka-teki sudah selesai lengkap."
      },
      {
        type: "fill",
        question: "チームを（　　　　）してから、試合の準備をしておきます。",
        options: JSON.stringify(["成人", "結成", "成長"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 結成 (kessei) - membentuk tim olahraga/grup."
      }
    ]
  },

  // ===========================================================
  // 5. KANJI 増 (New ID / Auto-increment)
  // ===========================================================
  {
    character: "増",
    romaji: "ZOU / ma(su), fu(eru)",
    meaning: "Bertambah, menambah, meningkat",
    baseMeaning: "Bertambah atau meningkatkan jumlah, ukuran, maupun tingkat sesuatu. (Kakijun.com; kanjime; kanjipedia)",
    bushuu: "土 (Tanah)",
    onyomi: "ゾウ",
    kunyomi: "ま（す）、ふ（える）、ふ（やす）",
    examples: [
      {
        japanese: "人口が増加しているし、車も多いし、この町はにぎやかです。",
        romaji: "Jinkou ga zouka shite iru shi, kuruma mo ooi shi, kono machi wa nigiyaka desu.",
        translation: "Populasinya meningkat dan ada banyak mobil, sehingga kota ini sangat ramai."
      },
      {
        japanese: "この町では、外国人の数が急増してしまいました。",
        romaji: "Kono machi de wa, gaikokujin no kazu ga kyuuzou shite shimaimashita.",
        translation: "Di kota ini, jumlah orang asing telah meningkat tajam secara mendadak."
      },
      {
        japanese: "学生が多くなる前に、教室を増設しておきます。",
        romaji: "Gakusei ga ooku naru mae ni, kyoushitsu o zousetsu shite okimasu.",
        translation: "Sebelum siswa bertambah banyak, kami akan menambah ruang kelas terlebih dahulu."
      },
      {
        japanese: "来年、会社の設備を増強するつもりです。",
        romaji: "Rainen, kaisha no setsubi o zoukyou suru tsumori desu.",
        translation: "Tahun depan, kami berencana memperkuat fasilitas perusahaan."
      },
      {
        japanese: "無理をすると、病気が増悪するかもしれません。",
        romaji: "Muri o suru to, byouki ga zouaku suru kamoshiremasen.",
        translation: "Jika memaksakan diri, penyakitnya mungkin akan memburuk."
      }
    ],
    reflections: [
      "Apa makna dasar kanji 増 yang anda pahami?",
      "Jukugo mana yang mudah untuk di ingat? Mengapa?",
      "Apa perbedaan penggunaan 増大、増加 dan 増進?",
      "Cabang semantic graph mana yang menurut anda paling mudah dipahami?",
      "Bagaimana cara anda mengingat hubungan makna antar jukugo yang mengandung kanji 増?"
    ],
    categories: [
      {
        name: "1. Bertambah",
        jukugos: [
          {
            word: "増加",
            reading: "ぞうか",
            meaning: "peningkatan jumlah",
            unsur: [
              { jokugo: "増", arti: "bertambah" },
              { jokugo: "加", arti: "menambah" }
            ],
            penjelasan: "Hubungan makna antar kanji 増 dan 加 menjadi 増加, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bertambahnya jumlah atau tingkat dari keadaan sebelumnya.”"
          },
          {
            word: "増大",
            reading: "ぞうだい",
            meaning: "peningkatan ukuran / tingkat",
            unsur: [
              { jokugo: "増", arti: "bertambah" },
              { jokugo: "大", arti: "besar" }
            ],
            penjelasan: "Hubungan makna antar kanji 増 dan 大 menjadi 増大, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bertambahnya ukuran, jumlah, atau tingkat sehingga menjadi lebih besar.”"
          },
          {
            word: "倍増",
            reading: "ばいぞう",
            meaning: "penggandaan berlipat",
            unsur: [
              { jokugo: "倍", arti: "dua kali lipat" },
              { jokugo: "増", arti: "bertambah" }
            ],
            penjelasan: "Hubungan makna antar kanji 倍 dan 増 menjadi 倍増, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pertambahan jumlah hingga menjadi dua kali lipat.”"
          },
          {
            word: "急増",
            reading: "きゅうぞう",
            meaning: "peningkatan tajam cepat",
            unsur: [
              { jokugo: "急", arti: "cepat" },
              { jokugo: "増", arti: "bertambah" }
            ],
            penjelasan: "Hubungan makna antar kanji 急 dan 増 menjadi 急増, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pertambahan jumlah yang terjadi dengan cepat dalam waktu singkat.”"
          }
        ]
      },
      {
        name: "2. Meningkatkan",
        jukugos: [
          {
            word: "増強",
            reading: "ぞうきょう",
            meaning: "penguatan daya / fasilitas",
            unsur: [
              { jokugo: "増", arti: "menambah" },
              { jokugo: "強", arti: "kuat" }
            ],
            penjelasan: "Hubungan makna antar kanji 増 dan 強 menjadi 増強, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “penambahan kekuatan atau kemampuan sehingga menjadi lebih kuat.”"
          },
          {
            word: "増進",
            reading: "ぞうしん",
            meaning: "peningkatan kesehatan / mutu",
            unsur: [
              { jokugo: "増", arti: "bertambah" },
              { jokugo: "進", arti: "maju" }
            ],
            penjelasan: "Hubungan makna antar kanji 増 dan 進 menjadi 増進, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “peningkatan suatu keadaan atau kemampuan sehingga menjadi lebih baik atau maju.”"
          }
        ]
      },
      {
        name: "3. Hasil",
        jukugos: [
          {
            word: "増収",
            reading: "ぞうしゅう",
            meaning: "peningkatan pendapatan",
            unsur: [
              { jokugo: "増", arti: "bertambah" },
              { jokugo: "収", arti: "penerimaan" }
            ],
            penjelasan: "Hubungan makna antar kanji 増 dan 収 menjadi 増収, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bertambahnya jumlah pendapatan atau penerimaan dibandingkan sebelumnya.”"
          }
        ]
      },
      {
        name: "4. Penambahan",
        jukugos: [
          {
            word: "増設",
            reading: "ぞうせつ",
            meaning: "penambahan fasilitas",
            unsur: [
              { jokugo: "増", arti: "menambah" },
              { jokugo: "設", arti: "memasang" }
            ],
            penjelasan: "Hubungan makna antar kanji 増 dan 設 menjadi 増設, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “penambahan fasilitas atau peralatan dengan memasang yang baru.”"
          },
          {
            word: "増結",
            reading: "ぞうけつ",
            meaning: "penambahan gerbong",
            unsur: [
              { jokugo: "増", arti: "menambah" },
              { jokugo: "結", arti: "menghubungkan" }
            ],
            penjelasan: "Hubungan makna antar kanji 増 dan 結 menjadi 増結, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “penambahan gerbong dengan menghubungkannya pada rangkaian kereta.”"
          }
        ]
      },
      {
        name: "5. Bantuan",
        jukugos: [
          {
            word: "増援",
            reading: "ぞうえん",
            meaning: "bantuan tambahan personel",
            unsur: [
              { jokugo: "増", arti: "menambah" },
              { jokugo: "援", arti: "bantuan" }
            ],
            penjelasan: "Hubungan makna antar kanji 増 dan 援 menjadi 増援, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bantuan tambahan yang diberikan untuk memperkuat dukungan yang sudah ada.”"
          },
          {
            word: "増訂",
            reading: "ぞうてい",
            meaning: "revisi tambahan cetakan",
            unsur: [
              { jokugo: "増", arti: "menambah" },
              { jokugo: "訂", arti: "memperbaiki" }
            ],
            penjelasan: "Hubungan makna antar kanji 増 dan 訂 menjadi 増訂, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “penambahan dan perbaikan isi buku atau tulisan pada penerbitan berikutnya.”"
          }
        ]
      },
      {
        name: "6. Kondisi",
        jukugos: [
          {
            word: "増悪",
            reading: "ぞうあく",
            meaning: "memburuknya kondisi klinis",
            unsur: [
              { jokugo: "増", arti: "bertambah" },
              { jokugo: "悪", arti: "buruk" }
            ],
            penjelasan: "Hubungan makna antar kanji 増 dan 悪 menjadi 増悪, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keadaan penyakit atau gejala yang menjadi lebih buruk.”"
          },
          {
            word: "増血",
            reading: "ぞうけつ",
            meaning: "peningkatan pembentukan darah",
            unsur: [
              { jokugo: "増", arti: "menambah" },
              { jokugo: "血", arti: "darah" }
            ],
            penjelasan: "Hubungan makna antar kanji 増 dan 血 menjadi 増血, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bertambahnya atau meningkatnya pembentukan darah dalam tubuh.”"
          }
        ]
      }
    ],
    crossLinks: [
      ["増加", "peningkatan jumlah & ukuran", "増大"],
      ["増加", "penambahan biasa vs lonjakan tajam", "急増"],
      ["倍増", "pelipatgandaan & lonjakan cepat", "急増"],
      ["増強", "penguatan daya & peningkatan kesehatan", "増進"],
      ["増設", "penambahan fasilitas & gerbong sarana", "増結"],
      ["増援", "dukungan bantuan & penambahan revisi buku", "増訂"],
      ["増悪", "perubahan kondisi klinis & penambahan darah", "増血"]
    ],
    quizzes: [
      // 5 Unscramble
      {
        type: "unscramble",
        question: "Susunlah kalimat dari kata-kata berikut.",
        words: JSON.stringify(["数が", "しまいました", "この町では", "急増して", "外国人の"]),
        correctOrder: JSON.stringify(["この町では", "外国人の", "数が", "急増して", "しまいました"]),
        correctAnswer: "0",
        explanation: "Jawaban: この町では外国人の数が急増してしまいました。"
      },
      {
        type: "unscramble",
        question: "Susunlah kalimat dari kata-kata berikut.",
        words: JSON.stringify(["増設して", "なる前に", "教室を", "おきます", "学生が多く"]),
        correctOrder: JSON.stringify(["学生が多く", "なる前に", "教室を", "増設して", "おきます"]),
        correctAnswer: "0",
        explanation: "Jawaban: 学生が多くなる前に、教室を増設しておきます。"
      },
      {
        type: "unscramble",
        question: "Susunlah kalimat dari kata-kata berikut.",
        words: JSON.stringify(["会社の", "増強する", "来年", "つもりです", "設備を"]),
        correctOrder: JSON.stringify(["来年", "会社の", "設備を", "増強する", "つもりです"]),
        correctAnswer: "0",
        explanation: "Jawaban: 来年会社の設備を増強するつもりです。"
      },
      {
        type: "unscramble",
        question: "Susunlah kalimat dari kata-kata berikut.",
        words: JSON.stringify(["かもしれません", "病気が", "増悪する", "無理をすると"]),
        correctOrder: JSON.stringify(["無理をすると", "病気が", "増悪する", "かもしれません"]),
        correctAnswer: "0",
        explanation: "Jawaban: 無理をすると、病気が増悪するかもしれません。"
      },
      {
        type: "unscramble",
        question: "Susunlah kalimat dari kata-kata berikut.",
        words: JSON.stringify(["増加して", "この町の", "いるんです", "人口が"]),
        correctOrder: JSON.stringify(["この町の", "人口が", "増加して", "いるんです"]),
        correctAnswer: "0",
        explanation: "Jawaban: この町の人口が増加しているんです。"
      },
      // 1 Grouping
      {
        type: "grouping",
        question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
        words: JSON.stringify([
          "増収", "増強", "増設", "増援", "増結",
          "増加", "急増", "増大", "増悪", "増血"
        ]),
        groups: JSON.stringify([
          {
            name: "1. Bertambah",
            category: "1. Bertambah",
            correctWords: ["増加", "増大", "急増"],
            items: ["増加", "増大", "急増"],
            "1. Bertambah": ["増加", "増大", "急増"]
          },
          {
            name: "2. Meningkatkan",
            category: "2. Meningkatkan",
            correctWords: ["増強"],
            items: ["増強"],
            "2. Meningkatkan": ["増強"]
          },
          {
            name: "3. Hasil",
            category: "3. Hasil",
            correctWords: ["増収"],
            items: ["増収"],
            "3. Hasil": ["増収"]
          },
          {
            name: "4. Penambahan",
            category: "4. Penambahan",
            correctWords: ["増設", "増結"],
            items: ["増設", "増結"],
            "4. Penambahan": ["増設", "増結"]
          },
          {
            name: "5. Bantuan",
            category: "5. Bantuan",
            correctWords: ["増援"],
            items: ["増援"],
            "5. Bantuan": ["増援"]
          },
          {
            name: "6. Kondisi",
            category: "6. Kondisi",
            correctWords: ["増悪", "増血"],
            items: ["増悪", "増血"],
            "6. Kondisi": ["増悪", "増血"]
          }
        ]),
        explanation: "Kunci Jawaban:\n1. Bertambah: 増加・増大・急増\n2. Meningkatkan: 増強\n3. Hasil: 増収\n4. Penambahan: 増設・増結\n5. Bantuan: 増援\n6. Kondisi: 増悪・増血"
      },
      // 5 Multiple Choice (Section c)
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “peningkatan atau bertambahnya jumlah”?",
        options: JSON.stringify(["増加", "増強", "増援"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 増加 (zouka) - pertambahan jumlah."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “menjadi lebih besar atau mengalami peningkatan ukuran/jumlah”?",
        options: JSON.stringify(["増設", "増大", "増収"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 増大 (zoudai) - bertambahnya ukuran/tingkat sehingga lebih besar."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “menjadi dua kali lipat”?",
        options: JSON.stringify(["増進", "急増", "倍増"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 倍増 (baizou) - pertambahan berlipat ganda."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “peningkatan yang terjadi dengan cepat atau pesat”?",
        options: JSON.stringify(["増強", "急増", "増援"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 急増 (kyuuzou) - lonjakan peningkatan cepat."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “peningkatan pendapatan atau penerimaan”?",
        options: JSON.stringify(["増収", "増設", "倍増"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 増収 (zoushuu) - peningkatan penerimaan/omzet."
      },
      // 5 Fill in Blank (Section d)
      {
        type: "fill",
        question: "教室が足りないんです。来年、教室を（　　　　）します。",
        options: JSON.stringify(["増設", "増血", "増訂"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 増設 (zousetsu) - menambah fasilitas ruang kelas baru."
      },
      {
        type: "fill",
        question: "この表で、店の売上の（　　　　）が確認できます。",
        options: JSON.stringify(["増援", "増血", "増加"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 増加 (zouka) - peningkatan penjualan toko."
      },
      {
        type: "fill",
        question: "毎日練習しながら、チームの力を（　　　　）しています。",
        options: JSON.stringify(["増結", "増強", "増訂"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 増強 (zoukyou) - memperkuat kemampuan tim."
      },
      {
        type: "fill",
        question: "急に病気が（　　　　）してしまいました。",
        options: JSON.stringify(["増悪", "増収", "増結"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 増悪 (zouaku) - kondisi penyakit memburuk tiba-tiba."
      },
      {
        type: "fill",
        question: "連休は客が多いですから、列車を（　　　　）しておきます。",
        options: JSON.stringify(["増血", "増悪", "増結"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 増結 (zouketsu) - menambah gerbong kereta saat musim libur."
      }
    ]
  }
];

// =============================================================
// MAIN SEED FUNCTION
// =============================================================
async function seedModul7() {
  console.log("=============================================================");
  console.log("🚀 MEMULAI SEEDING STRICT MODUL 7 (化・発・展・成・増)");
  console.log("=============================================================\n");

  // 1. Pastikan Modul 7 memiliki judul dan tujuan pembelajaran yang tepat
  await prisma.module.upsert({
    where: { id: 561 },
    update: {
      title: "MODUL 7: PERUBAHAN DAN PERKEMBANGAN",
      tujuanPembelajaran:
        "Mahasiswa mampu:\n- Memahami konsep perubahan dan perkembangan kanji\n- Menjelaskan hubungan makna antar-kanji perubahan\n- Menganalisis pembentukan jukugo terkait perkembangan\n- Menyusun semantic graph perubahan\n- Menggunakan jukugo dalam konteks sosial dan akademik"
    },
    create: {
      id: 561,
      title: "MODUL 7: PERUBAHAN DAN PERKEMBANGAN",
      tujuanPembelajaran:
        "Mahasiswa mampu:\n- Memahami konsep perubahan dan perkembangan kanji\n- Menjelaskan hubungan makna antar-kanji perubahan\n- Menganalisis pembentukan jukugo terkait perkembangan\n- Menyusun semantic graph perubahan\n- Menggunakan jukugo dalam konteks sosial dan akademik"
    }
  });
  console.log("✅ Modul 561: MODUL 7: PERUBAHAN DAN PERKEMBANGAN siap.");

  // 2. Registrasi seluruh Kanji Tunggal Penyusun yang belum ada di DB (moduleId: null)
  console.log("\n📦 Menyelaraskan kanji penyusun (constituent kanjis) ke database...");
  for (const c of CONSTITUENTS_TO_ENSURE) {
    const existing = await prisma.kanji.findFirst({
      where: { character: c.character }
    });
    if (!existing) {
      await prisma.kanji.create({
        data: {
          character: c.character,
          romaji: c.romaji,
          meaning: c.meaning,
          baseMeaning: c.baseMeaning,
          bushuu: c.bushuu,
          onyomi: c.onyomi,
          kunyomi: c.kunyomi,
          moduleId: null
        }
      });
      console.log(`  + Kanji penyusun '${c.character}' berhasil dibuat.`);
    } else {
      console.log(`  ✓ Kanji penyusun '${c.character}' sudah ada di DB.`);
    }
  }

  // 3. Pastikan UserModuleProgress untuk seluruh user terdaftar di Modul 561
  const allUsers = await prisma.user.findMany({ select: { id: true } });
  for (const u of allUsers) {
    const existingUMP = await prisma.userModuleProgress.findUnique({
      where: {
        userId_moduleId: {
          userId: u.id,
          moduleId: 561
        }
      }
    });
    if (!existingUMP) {
      await prisma.userModuleProgress.create({
        data: {
          userId: u.id,
          moduleId: 561,
          isCompleted: false,
          isLocked: false,
          progressPercent: 0
        }
      });
    }
  }

  // 4. Proses Seeding Kanji Modul 7 secara sekuensial (化・発・展・成・増)
  console.log("\n📚 Memulai pemrosesan 5 Kanji Utama Modul 7...");

  const ORDER_CANONICAL = ["化", "発", "展", "成", "増"];

  for (const char of ORDER_CANONICAL) {
    const data = MODUL_7_DATA.find((k) => k.character === char)!;
    console.log(`\n-------------------------------------------------------------`);
    console.log(`▶ Memproses Kanji [ ${char} ]...`);

    // 4a. Cari atau buat kanji utama
    let kanji = await prisma.kanji.findFirst({
      where: { character: char }
    });

    if (kanji) {
      kanji = await prisma.kanji.update({
        where: { id: kanji.id },
        data: {
          romaji: data.romaji,
          meaning: data.meaning,
          baseMeaning: data.baseMeaning,
          bushuu: data.bushuu,
          onyomi: data.onyomi,
          kunyomi: data.kunyomi,
          moduleId: 561
        }
      });
    } else {
      kanji = await prisma.kanji.create({
        data: {
          character: data.character,
          romaji: data.romaji,
          meaning: data.meaning,
          baseMeaning: data.baseMeaning,
          bushuu: data.bushuu,
          onyomi: data.onyomi,
          kunyomi: data.kunyomi,
          moduleId: 561
        }
      });
    }

    const kanjiId = kanji.id;
    console.log(`  ✓ Data dasar kanji '${char}' tersimpan (ID: ${kanjiId}, moduleId: 561)`);

    // 4b. Pastikan UserKanjiProgress untuk setiap user
    for (const u of allUsers) {
      const existingUKP = await prisma.userKanjiProgress.findUnique({
        where: {
          userId_kanjiId: {
            userId: u.id,
            kanjiId: kanjiId
          }
        }
      });
      if (!existingUKP) {
        await prisma.userKanjiProgress.create({
          data: {
            userId: u.id,
            kanjiId: kanjiId,
            masteryPercent: 0,
            writingPercent: 0,
            readingPercent: 0,
            quizPercent: 0,
            status: "LEARNING"
          }
        });
      }
    }

    // 4c. Bersihkan relasi lama kanji ini
    await prisma.exampleSentence.deleteMany({ where: { kanjiId } });
    await prisma.masterRefleksi.deleteMany({ where: { kanjiId } });
    await prisma.quiz.deleteMany({ where: { kanjiId } });
    await prisma.kanjiGraphEdge.deleteMany({ where: { kanjiId } });

    // Hapus semanticRelation, semanticRelationNode, kategoriKanji, dan jukugo lama
    const existingJukugos = await prisma.jukugo.findMany({
      where: { kanjiId },
      select: { id: true }
    });
    const jukugoIds = existingJukugos.map((j) => j.id);

    if (jukugoIds.length > 0) {
      await prisma.kategoriKanji.deleteMany({
        where: { jokugoId: { in: jukugoIds } }
      });
    }

    const existingSRs = await prisma.semanticRelation.findMany({
      where: { kanjiId },
      select: { id: true }
    });
    const srIds = existingSRs.map((sr) => sr.id);

    if (srIds.length > 0) {
      await prisma.semanticRelationNode.deleteMany({
        where: { semanticId: { in: srIds } }
      });
      await prisma.semanticRelation.deleteMany({
        where: { id: { in: srIds } }
      });
    }

    await prisma.jukugo.deleteMany({ where: { kanjiId } });

    // 4d. Simpan Latihan Membaca (ExampleSentence)
    for (const ex of data.examples) {
      await prisma.exampleSentence.create({
        data: {
          kanjiId,
          japanese: ex.japanese,
          romaji: ex.romaji,
          translation: ex.translation,
          isReading: true
        }
      });
    }
    console.log(`  ✓ ${data.examples.length} Latihan membaca kalimat (ExampleSentence) tersimpan.`);

    // 4e. Simpan Pertanyaan Refleksi (MasterRefleksi)
    for (const q of data.reflections) {
      await prisma.masterRefleksi.create({
        data: {
          kanjiId,
          question: q
        }
      });
    }
    console.log(`  ✓ ${data.reflections.length} Pertanyaan refleksi tersimpan.`);

    // 4f. Simpan MasterCategory, Jukugo, KategoriKanji, SemanticRelation, SemanticRelationNode
    let totalJukugoSaved = 0;
    for (const cat of data.categories) {
      const masterCat = await prisma.masterCategory.upsert({
        where: { name: cat.name },
        update: {},
        create: {
          name: cat.name,
          description: `Kategori ${cat.name} untuk kanji ${char}`
        }
      });

      for (const jk of cat.jukugos) {
        const createdJukugo = await prisma.jukugo.create({
          data: {
            kanjiId,
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
            kanjiId,
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

        totalJukugoSaved++;
      }
    }
    console.log(`  ✓ ${totalJukugoSaved} Jukugo di ${data.categories.length} kategori Semantic Graph tersimpan.`);

    // 4g. Simpan Cross-Link Graph Edges (KanjiGraphEdge)
    for (let i = 0; i < data.crossLinks.length; i++) {
      const [source, predicate, target] = data.crossLinks[i];
      const edgeId = `cross-${kanjiId}-${i + 1}-${source}-${target}`;
      await prisma.kanjiGraphEdge.create({
        data: {
          id: edgeId,
          kanjiId,
          source,
          target,
          predicate
        }
      });
    }
    console.log(`  ✓ ${data.crossLinks.length} Cross-link Graph Edges tersimpan.`);

    // 4h. Simpan 16 Kuis Evaluasi (Quiz)
    for (const q of data.quizzes) {
      await prisma.quiz.create({
        data: {
          kanjiId,
          type: q.type,
          question: q.question,
          words: q.words ?? null,
          correctOrder: q.correctOrder ?? null,
          options: q.options ?? null,
          correctAnswer: q.correctAnswer ?? null,
          groups: q.groups ?? null,
          explanation: q.explanation
        }
      });
    }
    console.log(`  ✓ ${data.quizzes.length} Kuis evaluasi (5 susun kata, 1 kelompok kata, 5 makna, 5 kalimat) tersimpan.`);
  }

  // 5. Validasi hasil akhir dari database
  console.log("\n=============================================================");
  console.log("🔍 VALIDASI HASIL DATABASE MODUL 7");
  console.log("=============================================================");

  const mod7 = await prisma.module.findUnique({
    where: { id: 561 },
    include: {
      kanjis: {
        include: {
          jukugos: true,
          examples: true,
          masterRefleksi: true,
          quizzes: true,
          graphEdges: true,
          semanticRelations: true
        },
        orderBy: { id: "asc" }
      }
    }
  });

  if (!mod7) {
    throw new Error("Modul 561 tidak ditemukan di DB!");
  }

  console.log(`Modul ID: ${mod7.id} | Judul: ${mod7.title}`);
  console.log(`Urutan Kanji Tersimpan di Database:`);
  mod7.kanjis.forEach((k, index) => {
    console.log(
      `  [${index + 1}] Kanji: ${k.character} (ID: ${k.id}) -> ` +
        `Jukugo: ${k.jukugos.length}, Membaca: ${k.examples.length}, Refleksi: ${k.masterRefleksi.length}, ` +
        `Kuis: ${k.quizzes.length}, Edges: ${k.graphEdges.length}, SemanticRel: ${k.semanticRelations.length}`
    );
  });

  const actualOrder = mod7.kanjis.map((k) => k.character).join("・");
  const expectedOrder = "化・発・展・成・増";

  if (actualOrder === expectedOrder) {
    console.log(`\n🎉 URUTAN KANJI TEPAT & SEMPURNA: ${actualOrder}`);
  } else {
    console.warn(`\n⚠️ URUTAN KANJI TIDAK COCOK: Aktual=${actualOrder}, Harapan=${expectedOrder}`);
  }

  console.log("\n=== SEEDING MODUL 7 SELESAI DENGAN SUKSES ===");
}

seedModul7()
  .catch((err) => {
    console.error("❌ Gagal saat melakukan seeding Modul 7:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
