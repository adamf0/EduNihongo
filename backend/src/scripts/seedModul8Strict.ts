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
  id: number;
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
    character: "否",
    romaji: "HI / ina",
    meaning: "tidak, menyangkal",
    bushuu: "口",
    onyomi: "ヒ",
    kunyomi: "いな",
    baseMeaning: "menyangkal, tidak, penolakan"
  },
  {
    character: "良",
    romaji: "RYOU / yo(i)",
    meaning: "baik, bagus",
    bushuu: "艮",
    onyomi: "リョウ",
    kunyomi: "よ・い",
    baseMeaning: "baik, bagus, tepat"
  },
  {
    character: "眼",
    romaji: "GAN, GEN / me",
    meaning: "mata, pandangan",
    bushuu: "目",
    onyomi: "ガン、ゲン",
    kunyomi: "まなこ、め",
    baseMeaning: "mata, pengamatan, daya melihat"
  },
  {
    character: "標",
    romaji: "HYOU",
    meaning: "tanda, penanda, sasaran",
    bushuu: "木",
    onyomi: "ヒョウ",
    kunyomi: "しるし",
    baseMeaning: "tanda, rambu, patokan"
  },
  {
    character: "批",
    romaji: "HI",
    meaning: "mengkritik, menilai",
    bushuu: "扌",
    onyomi: "ヒ",
    kunyomi: "―",
    baseMeaning: "menilai, mengkritik, menguji"
  },
  {
    character: "裁",
    romaji: "SAI / saba(ku), ta(tsu)",
    meaning: "mengadili, memotong kain",
    bushuu: "衣",
    onyomi: "サイ",
    kunyomi: "さば・く、た・つ",
    baseMeaning: "mengadili, memutuskan perkara, memotong"
  },
  {
    character: "切",
    romaji: "SETSU, SAI / ki(ru)",
    meaning: "memotong, mendesak",
    bushuu: "刀",
    onyomi: "セツ、サイ",
    kunyomi: "き・る、き・れる",
    baseMeaning: "memotong, putus, mendesak"
  },
  {
    character: "遮",
    romaji: "SHA / saegi(ru)",
    meaning: "menghalangi, memblokir",
    bushuu: "辶",
    onyomi: "シャ",
    kunyomi: "さえぎ・る",
    baseMeaning: "menghalangi, memotong jalan/arus"
  },
  {
    character: "独",
    romaji: "DOKU / hito(ri)",
    meaning: "sendiri, tunggal, sepihak",
    bushuu: "犭",
    onyomi: "ドク",
    kunyomi: "ひと・り",
    baseMeaning: "sendiri, mandiri, sepihak"
  },
  {
    character: "横",
    romaji: "OU / yoko",
    meaning: "melintang, horizontal, samping",
    bushuu: "木",
    onyomi: "オウ",
    kunyomi: "よこ",
    baseMeaning: "melintang, menyamping, melintasi"
  },
  {
    character: "空",
    romaji: "KUU / sora, kara, a(ku)",
    meaning: "langit, kosong, hampa",
    bushuu: "穴",
    onyomi: "クウ",
    kunyomi: "そら、から、あ・く",
    baseMeaning: "langit, kosong, khayal, tidak nyata"
  }
];

// =============================================================
// MODUL 8 KANJI LEARNING DATA (認・識・判・断・想)
// =============================================================
const MODUL_8_DATA: KanjiData[] = [
  // ===========================================================
  // 1. KANJI 認 (ID: 3254)
  // ===========================================================
  {
    id: 3254,
    character: "認",
    romaji: "NIN / mito(meru)",
    meaning: "Mengenali, mengakui, membenarkan, menyetujui",
    baseMeaning: "Mengenali, memahami, atau mengakui keberadaan, kebenaran, maupun keabsahan sesuatu. (https://kakijun.com; https://kanji.me; https://kanjipedia.jp)",
    bushuu: "言 (Kata / Bahasa)",
    onyomi: "ニン",
    kunyomi: "みと・める",
    examples: [
      {
        japanese: "出かける前に、電車の時間を確認しておきます。",
        romaji: "Dekakeru mae ni, densha no jikan o kakunin shite okimasu.",
        translation: "Sebelum berangkat, saya akan memastikan jadwal kereta terlebih dahulu."
      },
      {
        japanese: "部長の承認をもらってから、資料を送るつもりです。",
        romaji: "Buchou no shounin o moratte kara, shiryou o okuru tsumori desu.",
        translation: "Setelah mendapat persetujuan kepala bagian, saya berencana mengirimkan dokumen."
      },
      {
        japanese: "このクラブは大学の公認を受けています。",
        romaji: "Kono kurabu wa daigaku no kounin o ukete imasu.",
        translation: "Klub ini telah mendapat pengakuan resmi dari universitas."
      },
      {
        japanese: "このアプリは顔の認証もできるし、使い方も簡単です。",
        romaji: "Kono apuri wa kao no ninshou mo dekiru shi, tsukaikata mo kantan desu.",
        translation: "Aplikasi ini dapat melakukan autentikasi wajah, dan cara penggunaannya pun mudah."
      },
      {
        japanese: "試験に合格すれば、認定を受けることができます。",
        romaji: "Shiken ni goukaku sureba, nintei o ukeru koto ga dekimasu.",
        translation: "Jika lulus ujian, Anda dapat memperoleh sertifikasi pengakuan."
      }
    ],
    reflections: [
      "Apa makna dasar kanji 認 yang Anda pahami?",
      "Jukugo mana yang mudah untuk diingat? Mengapa?",
      "Apa perbedaan penggunaan 否認、認知、dan 公認?",
      "Cabang semantic graph mana yang menurut Anda paling mudah dipahami?",
      "Bagaimana cara Anda mengingat hubungan makna antar jukugo yang mengandung kanji 認?"
    ],
    categories: [
      {
        name: "1. Pengenalan",
        jukugos: [
          {
            word: "確認",
            reading: "かくにん",
            meaning: "memastikan kebenaran",
            unsur: [
              { jokugo: "確", arti: "pasti" },
              { jokugo: "認", arti: "mengenali" }
            ],
            penjelasan: "Hubungan makna antar kanji 確 dan 認 pada 確認 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memastikan bahwa suatu informasi benar.”"
          },
          {
            word: "認識",
            reading: "にんしき",
            meaning: "pemahaman terhadap sesuatu",
            unsur: [
              { jokugo: "認", arti: "mengenali" },
              { jokugo: "識", arti: "memahami" }
            ],
            penjelasan: "Hubungan makna antar kanji 認 dan 識 pada 認識 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pemahaman terhadap suatu keadaan setelah mengenalinya.”"
          },
          {
            word: "認知",
            reading: "にんち",
            meaning: "pengenalan / rekognisi",
            unsur: [
              { jokugo: "認", arti: "mengenali" },
              { jokugo: "知", arti: "mengetahui" }
            ],
            penjelasan: "Hubungan makna antar kanji 認 dan 知 pada 認知 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengenalan terhadap sesuatu sehingga keberadaannya diketahui.”"
          }
        ]
      },
      {
        name: "2. Pengakuan",
        jukugos: [
          {
            word: "承認",
            reading: "しょうにん",
            meaning: "persetujuan usulan",
            unsur: [
              { jokugo: "承", arti: "menyetujui" },
              { jokugo: "認", arti: "mengakui" }
            ],
            penjelasan: "Hubungan makna antar kanji 承 dan 認 pada 承認 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “persetujuan terhadap sesuatu yang diajukan.”"
          },
          {
            word: "公認",
            reading: "こうにん",
            meaning: "pengakuan resmi",
            unsur: [
              { jokugo: "公", arti: "resmi" },
              { jokugo: "認", arti: "mengakui" }
            ],
            penjelasan: "Hubungan makna antar kanji 公 dan 認 pada 公認 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengakuan resmi oleh suatu pihak atau lembaga.”"
          },
          {
            word: "容認",
            reading: "ようにん",
            meaning: "penerimaan / toleransi",
            unsur: [
              { jokugo: "容", arti: "membolehkan" },
              { jokugo: "認", arti: "mengakui" }
            ],
            penjelasan: "Hubungan makna antar kanji 容 dan 認 pada 容認 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “penerimaan terhadap suatu tindakan atau keadaan sehingga hal tersebut dibiarkan berlangsung.”"
          },
          {
            word: "認定",
            reading: "にんてい",
            meaning: "penetapan berdasarkan penilaian",
            unsur: [
              { jokugo: "認", arti: "mengakui" },
              { jokugo: "定", arti: "menetapkan" }
            ],
            penjelasan: "Hubungan makna antar kanji 認 dan 定 pada 認定 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “penetapan berdasarkan penilaian terhadap pemenuhan syarat.”"
          },
          {
            word: "認証",
            reading: "にんしょう",
            meaning: "autentikasi identitas",
            unsur: [
              { jokugo: "認", arti: "mengakui" },
              { jokugo: "証", arti: "membuktikan" }
            ],
            penjelasan: "Hubungan makna antar kanji 認 dan 証 pada 認証 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “autentikasi melalui pemeriksaan bukti identitas pengguna.”"
          }
        ]
      },
      {
        name: "3. Penyangkalan",
        jukugos: [
          {
            word: "否認",
            reading: "ひにん",
            meaning: "penyangkalan tuduhan",
            unsur: [
              { jokugo: "否", arti: "menyangkal" },
              { jokugo: "認", arti: "mengakui" }
            ],
            penjelasan: "Hubungan makna antar kanji 否 dan 認 pada 否認 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “penyangkalan terhadap suatu pernyataan atau tuduhan.”"
          }
        ]
      }
    ],
    crossLinks: [
      ["確認", "memastikan fakta vs pemahaman situasi", "認識"],
      ["認識", "pemahaman mendalam & pengenalan luas", "認知"],
      ["承認", "persetujuan usulan vs pengakuan resmi", "公認"],
      ["承認", "menyetujui aktif vs membiarkan/menerima", "容認"],
      ["認定", "penetapan kualifikasi vs verifikasi identitas", "認証"],
      ["承認", "menerima persetujuan vs menyangkal tuduhan", "否認"]
    ],
    quizzes: [
      // 5 Unscramble
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["確認しておきます", "電車の時間を", "出かける前に"]),
        correctOrder: JSON.stringify(["出かける前に", "電車の時間を", "確認しておきます"]),
        correctAnswer: "0",
        explanation: "Jawaban: 出かける前に、電車の時間を確認しておきます。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["簡単です", "できるし", "このアプリは", "顔の認証も", "使い方も"]),
        correctOrder: JSON.stringify(["このアプリは", "顔の認証も", "できるし", "使い方も", "簡単です"]),
        correctAnswer: "0",
        explanation: "Jawaban: このアプリは顔の認証もできるし、使い方も簡単です。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["もらってから", "送るつもりです", "資料を", "部長の承認を"]),
        correctOrder: JSON.stringify(["部長の承認を", "もらってから", "資料を", "送るつもりです"]),
        correctAnswer: "0",
        explanation: "Jawaban: 部長の承認をもらってから、資料を送るつもりです。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["認定を", "試験に", "受けることができます", "合格すれば"]),
        correctOrder: JSON.stringify(["試験に", "合格すれば", "認定を", "受けることができます"]),
        correctAnswer: "0",
        explanation: "Jawaban: 試験に合格すれば、認定を受けることができます。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["受けています", "このクラブは", "公認を", "大学の"]),
        correctOrder: JSON.stringify(["このクラブは", "大学の", "公認を", "受けています"]),
        correctAnswer: "0",
        explanation: "Jawaban: このクラブは大学の公認を受けています。"
      },
      // 1 Grouping
      {
        type: "grouping",
        question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
        words: JSON.stringify([
          "確認", "認証", "公認", "承認", "否認",
          "認定", "容認", "認知", "認識"
        ]),
        groups: JSON.stringify([
          {
            name: "1. Pengenalan",
            category: "1. Pengenalan",
            correctWords: ["確認", "認識", "認知"],
            items: ["確認", "認識", "認知"],
            "1. Pengenalan": ["確認", "認識", "認知"]
          },
          {
            name: "2. Pengakuan",
            category: "2. Pengakuan",
            correctWords: ["承認", "公認", "容認", "認定", "認証"],
            items: ["承認", "公認", "容認", "認定", "認証"],
            "2. Pengakuan": ["承認", "公認", "容認", "認定", "認証"]
          },
          {
            name: "3. Penyangkalan",
            category: "3. Penyangkalan",
            correctWords: ["否認"],
            items: ["否認"],
            "3. Penyangkalan": ["否認"]
          }
        ]),
        explanation: "Kunci Jawaban:\n1. Pengenalan: 確認・認識・認知\n2. Pengakuan: 承認・公認・容認・認定・認証\n3. Penyangkalan: 否認"
      },
      // 5 Multiple Choice (Section c)
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “penyangkalan terhadap suatu tuduhan”?",
        options: JSON.stringify(["公認", "否認", "認知"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 否認 (hinin) - penyangkalan terhadap suatu tuduhan/pernyataan."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “persetujuan terhadap suatu usulan”?",
        options: JSON.stringify(["承認", "確認", "否認"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 承認 (shounin) - persetujuan terhadap pengajuan/usulan."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “mengenali suatu objek atau keadaan”?",
        options: JSON.stringify(["認定", "認知", "否認"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 認知 (ninchi) - pengenalan dan rekognisi keberadaan sesuatu."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “pengakuan resmi oleh suatu lembaga”?",
        options: JSON.stringify(["公認", "確認", "認識"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 公認 (kounin) - pengakuan resmi oleh lembaga yang berwenang."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “proses memastikan identitas seseorang”?",
        options: JSON.stringify(["容認", "否認", "認証"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 認証 (ninshou) - autentikasi dan pembuktian identitas."
      },
      // 5 Fill in Blank (Section d)
      {
        type: "fill",
        question: "旅行の前に、ホテルの予約を（　　　）しておきます。",
        options: JSON.stringify(["否認", "確認", "公認"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 確認 (kakunin) - memastikan reservasi hotel."
      },
      {
        type: "fill",
        question: "このアプリはパスワードを使いません。顔の（　　　）もできるし、使い方も簡単です。",
        options: JSON.stringify(["認識", "容認", "認証"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 認証 (ninshou) - autentikasi wajah (facial recognition)."
      },
      {
        type: "fill",
        question: "名前と住所を（　　　）した後で、この書類を出してください。",
        options: JSON.stringify(["確認", "容認", "公認"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 確認 (kakunin) - memastikan kembali nama dan alamat."
      },
      {
        type: "fill",
        question: "部長の（　　　）をもらってから、資料を送るつもりです。",
        options: JSON.stringify(["認知", "否認", "承認"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 承認 (shounin) - persetujuan dari kepala bagian."
      },
      {
        type: "fill",
        question: "このクラブは大学の（　　　）を受けています。",
        options: JSON.stringify(["公認", "確認", "認識"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 公認 (kounin) - mendapatkan pengakuan resmi kampus."
      }
    ]
  },

  // ===========================================================
  // 2. KANJI 識 (ID: 3255)
  // ===========================================================
  {
    id: 3255,
    character: "識",
    romaji: "SHIKI",
    meaning: "Mengetahui, memahami, membedakan, menandai",
    baseMeaning: "Mengetahui, mengenali, dan membedakan sesuatu berdasarkan pemahaman atau pengetahuan. (https://kakijun.com; https://kanji.me; https://kanjipedia.jp)",
    bushuu: "言 (Kata / Bahasa)",
    onyomi: "シキ、シ、ショク",
    kunyomi: "し（る）、しる（す）",
    examples: [
      {
        japanese: "日本の知識を増やすために、毎日ニュースを読むつもりです。",
        romaji: "Nihon no chishiki o fuyasu tame ni, mainichi nyuusu o yomu tsumori desu.",
        translation: "Untuk menambah pengetahuan tentang Jepang, saya berencana membaca berita setiap hari."
      },
      {
        japanese: "標識に書いてあるとおりに、右へ曲がってください。",
        romaji: "Hyoushiki ni kaite aru toori ni, migi e magatte kudasai.",
        translation: "Silakan belok kanan sesuai dengan apa yang tertulis pada rambu/tanda."
      },
      {
        japanese: "その人は事故の後、意識を失ってしまいました。",
        romaji: "Sono hito wa jiko no ato, ishiki o ushinatte shimaimashita.",
        translation: "Orang itu kehilangan kesadaran setelah kecelakaan."
      },
      {
        japanese: "田中さんとは面識もあるし、連絡先も知っています。",
        romaji: "Tanaka-san to wa menshiki mo aru shi, renrakusaki mo shitte imasu.",
        translation: "Saya kenal baik dengan Tanaka-san, dan saya juga tahu kontak hubungannya."
      },
      {
        japanese: "国が変われば、常識も変わります。",
        romaji: "Kuni ga kawareba, joushiki mo kawarimasu.",
        translation: "Jika negara berganti, akal sehat (norma umum) pun ikut berubah."
      }
    ],
    reflections: [
      "Apa makna dasar kanji 識 yang Anda pahami?",
      "Jukugo mana yang mudah untuk diingat? Mengapa?",
      "Apa perbedaan penggunaan 常識、知識、dan 意識?",
      "Cabang semantic graph mana yang menurut Anda paling mudah dipahami?",
      "Bagaimana cara Anda mengingat hubungan makna antar jukugo yang mengandung kanji 識?"
    ],
    categories: [
      {
        name: "1. Pengetahuan dan Wawasan",
        jukugos: [
          {
            word: "知識",
            reading: "ちしき",
            meaning: "pengetahuan",
            unsur: [
              { jokugo: "知", arti: "mengetahui" },
              { jokugo: "識", arti: "pengetahuan" }
            ],
            penjelasan: "Hubungan makna antar kanji 知 dan 識 pada 知識 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengetahuan yang diperoleh melalui belajar atau pengalaman.”"
          },
          {
            word: "学識",
            reading: "がくしき",
            meaning: "wawasan keilmuan",
            unsur: [
              { jokugo: "学", arti: "belajar" },
              { jokugo: "識", arti: "pengetahuan" }
            ],
            penjelasan: "Hubungan makna antar kanji 学 dan 識 pada 学識 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “wawasan keilmuan yang diperoleh melalui pembelajaran.”"
          },
          {
            word: "常識",
            reading: "じょうしき",
            meaning: "akal sehat / norma lazim",
            unsur: [
              { jokugo: "常", arti: "lazim" },
              { jokugo: "識", arti: "pengetahuan" }
            ],
            penjelasan: "Hubungan makna antar kanji 常 dan 識 pada 常識 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “akal sehat berupa pengetahuan dan pertimbangan yang dianggap wajar dalam masyarakat.”"
          },
          {
            word: "見識",
            reading: "けんしき",
            meaning: "wawasan pandangan",
            unsur: [
              { jokugo: "見", arti: "melihat" },
              { jokugo: "識", arti: "pemahaman" }
            ],
            penjelasan: "Hubungan makna antar kanji 見 dan 識 pada 見識 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “wawasan yang membantu seseorang memahami dan menilai suatu keadaan.”"
          },
          {
            word: "有識",
            reading: "ゆうしき",
            meaning: "pengetahuan luas",
            unsur: [
              { jokugo: "有", arti: "memiliki" },
              { jokugo: "識", arti: "pengetahuan" }
            ],
            penjelasan: "Hubungan makna antar kanji 有 dan 識 pada 有識 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengetahuan luas yang dimiliki seseorang.”"
          },
          {
            word: "良識",
            reading: "りょうしき",
            meaning: "pertimbangan yang tepat",
            unsur: [
              { jokugo: "良", arti: "baik" },
              { jokugo: "識", arti: "pertimbangan" }
            ],
            penjelasan: "Hubungan makna antar kanji 良 dan 識 pada 良識 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pertimbangan yang tepat dalam menilai suatu keadaan.”"
          }
        ]
      },
      {
        name: "2. Pengenalan dan Pembedaan",
        jukugos: [
          {
            word: "認識",
            reading: "にんしき",
            meaning: "kesadaran pemahaman",
            unsur: [
              { jokugo: "認", arti: "mengenali" },
              { jokugo: "識", arti: "memahami" }
            ],
            penjelasan: "Hubungan makna antar kanji 認 dan 識 pada 認識 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kesadaran akan suatu hal setelah mengenali atau memahaminya.”"
          },
          {
            word: "識別",
            reading: "しきべつ",
            meaning: "pembedaan ciri",
            unsur: [
              { jokugo: "識", arti: "mengenali" },
              { jokugo: "別", arti: "membedakan" }
            ],
            penjelasan: "Hubungan makna antar kanji 識 dan 別 pada 識別 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pembedaan sesuatu berdasarkan ciri yang dapat dikenali.”"
          },
          {
            word: "弁識",
            reading: "べんしき",
            meaning: "daya pembeda",
            unsur: [
              { jokugo: "弁", arti: "membedakan" },
              { jokugo: "識", arti: "memahami" }
            ],
            penjelasan: "Hubungan makna antar kanji 弁 dan 識 pada 弁識 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “daya pembeda yang memungkinkan seseorang mengenali perbedaan di antara beberapa hal.”"
          },
          {
            word: "眼識",
            reading: "がんしき",
            meaning: "ketajaman pengamatan",
            unsur: [
              { jokugo: "眼", arti: "mata" },
              { jokugo: "識", arti: "daya menilai" }
            ],
            penjelasan: "Hubungan makna antar kanji 眼 dan 識 pada 眼識 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “ketajaman pengamatan dalam mengenali dan menilai mutu sesuatu.”"
          }
        ]
      },
      {
        name: "3. Kesadaran",
        jukugos: [
          {
            word: "意識",
            reading: "いしき",
            meaning: "kesadaran diri",
            unsur: [
              { jokugo: "意", arti: "pikiran" },
              { jokugo: "識", arti: "menyadari" }
            ],
            penjelasan: "Hubungan makna antar kanji 意 dan 識 pada 意識 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kesadaran terhadap diri atau keadaan sekitar.”"
          }
        ]
      },
      {
        name: "4. Perkenalan",
        jukugos: [
          {
            word: "面識",
            reading: "めんしき",
            meaning: "perkenalan tatap muka",
            unsur: [
              { jokugo: "面", arti: "wajah" },
              { jokugo: "識", arti: "mengenal" }
            ],
            penjelasan: "Hubungan makna antar kanji 面 dan 識 pada 面識 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perkenalan yang terjalin karena pernah bertemu langsung.”"
          }
        ]
      },
      {
        name: "5. Tanda",
        jukugos: [
          {
            word: "標識",
            reading: "ひょうしき",
            meaning: "tanda / rambu petunjuk",
            unsur: [
              { jokugo: "標", arti: "penanda" },
              { jokugo: "識", arti: "tanda" }
            ],
            penjelasan: "Hubungan makna antar kanji 標 dan 識 pada 標識 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tanda yang membantu orang mengenali tempat, aturan, atau informasi.”"
          }
        ]
      }
    ],
    crossLinks: [
      ["知識", "pengetahuan umum & wawasan keilmuan", "学識"],
      ["常識", "akal sehat lazim & pertimbangan matang", "良識"],
      ["見識", "wawasan pandangan & pengetahuan luas", "有識"],
      ["認識", "kesadaran pemahaman & daya pembeda ciri", "識別"],
      ["識別", "membedakan ciri & daya memilah fakta", "弁識"],
      ["見識", "wawasan berpikir & ketajaman mata pengamatan", "眼識"],
      ["意識", "kesadaran diri & pemahaman situasi", "認識"],
      ["面識", "mengenal orang vs mengetahui ilmu", "知識"],
      ["標識", "rambu penanda & pembedaan arah", "識別"]
    ],
    quizzes: [
      // 5 Unscramble
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["知識も", "読めば", "増えます", "本を"]),
        correctOrder: JSON.stringify(["本を", "読めば", "知識も", "増えます"]),
        correctAnswer: "0",
        explanation: "Jawaban: 本を読めば、知識も増えます。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["右へ", "とおりに", "曲がってください", "標識に", "書いてある"]),
        correctOrder: JSON.stringify(["標識に", "書いてある", "とおりに", "右へ", "曲がってください"]),
        correctAnswer: "0",
        explanation: "Jawaban: 標識に書いてあるとおりに、右へ曲がってください。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["失ってしまいました", "事故の後", "意識を", "その人は"]),
        correctOrder: JSON.stringify(["事故の後", "その人は", "意識を", "失ってしまいました"]),
        correctAnswer: "0",
        explanation: "Jawaban: 事故の後、その人は意識を失ってしまいました。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["連絡先も", "面識も", "知っています", "田中さんとは", "あるし"]),
        correctOrder: JSON.stringify(["田中さんとは", "面識も", "あるし", "連絡先も", "知っています"]),
        correctAnswer: "0",
        explanation: "Jawaban: 田中さんとは面識もあるし、連絡先も知っています。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["増やすつもりです", "日本の知識を", "本を読んで"]),
        correctOrder: JSON.stringify(["本を読んで", "日本の知識を", "増やすつもりです"]),
        correctAnswer: "0",
        explanation: "Jawaban: 本を読んで、日本の知識を増やすつもりです。"
      },
      // 1 Grouping
      {
        type: "grouping",
        question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
        words: JSON.stringify([
          "学識", "常識", "意識", "見識", "知識",
          "認識", "標識", "良識", "面識", "識別"
        ]),
        groups: JSON.stringify([
          {
            name: "1. Pengetahuan dan Wawasan",
            category: "1. Pengetahuan dan Wawasan",
            correctWords: ["知識", "学識", "常識", "見識", "良識"],
            items: ["知識", "学識", "常識", "見識", "良識"],
            "1. Pengetahuan dan Wawasan": ["知識", "学識", "常識", "見識", "良識"]
          },
          {
            name: "2. Pengenalan dan Pembedaan",
            category: "2. Pengenalan dan Pembedaan",
            correctWords: ["認識", "識別"],
            items: ["認識", "識別"],
            "2. Pengenalan dan Pembedaan": ["認識", "識別"]
          },
          {
            name: "3. Kesadaran",
            category: "3. Kesadaran",
            correctWords: ["意識"],
            items: ["意識"],
            "3. Kesadaran": ["意識"]
          },
          {
            name: "4. Perkenalan",
            category: "4. Perkenalan",
            correctWords: ["面識"],
            items: ["面識"],
            "4. Perkenalan": ["面識"]
          },
          {
            name: "5. Tanda",
            category: "5. Tanda",
            correctWords: ["標識"],
            items: ["標識"],
            "5. Tanda": ["標識"]
          }
        ]),
        explanation: "Kunci Jawaban:\n1. Pengetahuan dan Wawasan: 知識・学識・常識・見識・良識\n2. Pengenalan dan Pembedaan: 認識・識別\n3. Kesadaran: 意識\n4. Perkenalan: 面識\n5. Tanda: 標識"
      },
      // 5 Multiple Choice (Section c)
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “tanda yang memberi petunjuk di jalan”?",
        options: JSON.stringify(["面識", "標識", "学識"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 標識 (hyoushiki) - rambu atau tanda petunjuk di jalan."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “pernah berkenalan dengan seseorang”?",
        options: JSON.stringify(["知識", "識別", "面識"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 面識 (menshiki) - saling mengenal karena pernah bertemu."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “sesuatu yang diketahui melalui belajar atau pengalaman”?",
        options: JSON.stringify(["知識", "面識", "標識"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 知識 (chishiki) - pengetahuan yang dipelajari."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “membedakan objek berdasarkan ciri-cirinya”?",
        options: JSON.stringify(["常識", "意識", "識別"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 識別 (shikibetsu) - pembedaan berdasarkan karakteristik unik."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “pengetahuan yang diperoleh melalui kegiatan keilmuan”?",
        options: JSON.stringify(["眼識", "学識", "認識"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 学識 (gakushiki) - wawasan ilmiah dan keilmuan."
      },
      // 5 Fill in Blank (Section d)
      {
        type: "fill",
        question: "事故の後、その人は（　　　）を失ってしまいました。",
        options: JSON.stringify(["意識", "標識", "学識"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 意識 (ishiki) - kehilangan kesadaran."
      },
      {
        type: "fill",
        question: "山田さんとは（　　　）もあるし、連絡先も知っています。",
        options: JSON.stringify(["良識", "面識", "知識"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 面識 (menshiki) - kenal baik secara tatap muka."
      },
      {
        type: "fill",
        question: "本をたくさん読めば、（　　　）も増えます。",
        options: JSON.stringify(["意識", "標識", "知識"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 知識 (chishiki) - pengetahuan bertambah banyak."
      },
      {
        type: "fill",
        question: "道路の（　　　）に書いてあるとおりに、右へ曲がってください。",
        options: JSON.stringify(["面識", "標識", "学識"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 標識 (hyoushiki) - rambu lalu lintas jalan raya."
      },
      {
        type: "fill",
        question: "この機械は二つの色を（　　　）できるし、使い方も簡単です。",
        options: JSON.stringify(["識別", "学識", "面識"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 識別 (shikibetsu) - membedakan warna secara tepat."
      }
    ]
  },

  // ===========================================================
  // 3. KANJI 判 (ID: 3256)
  // ===========================================================
  {
    id: 3256,
    character: "判",
    romaji: "HAN, BAN",
    meaning: "Membedakan, menilai, mengadili; cap; ukuran kertas",
    baseMeaning: "Membedakan atau menilai suatu hal untuk menentukan kejelasan, kebenaran, atau keputusan. (https://kakijun.com; https://kanji.me; https://kotobank.jp; https://www.kanjipedia.jp)",
    bushuu: "刀 (Pisau)",
    onyomi: "ハン、バン、ホウ",
    kunyomi: "わ（ける）、わか（る）",
    examples: [
      {
        japanese: "この店は評判もいいし、料理もおいしいです。",
        romaji: "Kono mise wa hyouban mo ii shi, ryouri mo oishii desu.",
        translation: "Toko ini reputasinya bagus dan makanannya juga lezat."
      },
      {
        japanese: "すぐに判断しないほうがいいです。",
        romaji: "Sugu ni handan shinai hou ga ii desu.",
        translation: "Sebaiknya tidak mengambil pertimbangan/keputusan secara tergesa-gesa."
      },
      {
        japanese: "調べた後で、事故の原因が判明しました。",
        romaji: "Shirabeta ato de, jiko no gen'in ga hanmei shimashita.",
        translation: "Setelah diselidiki, penyebab kecelakaan tersebut menjadi jelas terungkap."
      },
      {
        japanese: "机の上に判子が置いてあります。",
        romaji: "Tsukue no ue ni hanko ga oite arimasu.",
        translation: "Di atas meja diletakkan stempel pribadi (hanko)."
      },
      {
        japanese: "判決を聞いた後で、家族に電話しました。",
        romaji: "Hanketsu o kiita ato de, kazoku ni denwa shimashita.",
        translation: "Setelah mendengar putusan pengadilan, saya menelepon keluarga."
      }
    ],
    reflections: [
      "Apa makna dasar kanji 判 yang Anda pahami?",
      "Jukugo mana yang mudah untuk diingat? Mengapa?",
      "Apa perbedaan penggunaan 判明、判読、dan 判決?",
      "Cabang semantic graph mana yang menurut Anda paling mudah dipahami?",
      "Bagaimana cara Anda mengingat hubungan makna antar jukugo yang mengandung kanji 判?"
    ],
    categories: [
      {
        name: "1. Penilaian",
        jukugos: [
          {
            word: "判断",
            reading: "はんだん",
            meaning: "pertimbangan nalar",
            unsur: [
              { jokugo: "判", arti: "menilai" },
              { jokugo: "断", arti: "menentukan" }
            ],
            penjelasan: "Hubungan makna antar kanji 判 dan 断 menjadi 判断 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “proses menilai keadaan untuk menentukan sikap atau tindakan.”"
          },
          {
            word: "判定",
            reading: "はんてい",
            meaning: "penetapan hasil penilaian",
            unsur: [
              { jokugo: "判", arti: "menilai" },
              { jokugo: "定", arti: "menetapkan" }
            ],
            penjelasan: "Hubungan makna antar kanji 判 dan 定 menjadi 判定 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “penetapan hasil berdasarkan kriteria tertentu.”"
          },
          {
            word: "批判",
            reading: "ひはん",
            meaning: "penilaian kritis",
            unsur: [
              { jokugo: "批", arti: "mengkritik" },
              { jokugo: "判", arti: "menilai" }
            ],
            penjelasan: "Hubungan makna antar kanji 批 dan 判 menjadi 批判 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “penilaian kritis terhadap suatu pendapat atau tindakan.”"
          },
          {
            word: "評判",
            reading: "ひょうばん",
            meaning: "reputasi publik",
            unsur: [
              { jokugo: "評", arti: "memberi penilaian" },
              { jokugo: "判", arti: "menilai" }
            ],
            penjelasan: "Hubungan makna antar kanji 評 dan 判 menjadi 評判 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “reputasi yang terbentuk dari penilaian orang banyak.”"
          }
        ]
      },
      {
        name: "2. Pembedaan dan Kejelasan",
        jukugos: [
          {
            word: "判別",
            reading: "はんべつ",
            meaning: "pembedaan ciri",
            unsur: [
              { jokugo: "判", arti: "mengenali perbedaan" },
              { jokugo: "別", arti: "membedakan" }
            ],
            penjelasan: "Hubungan makna antar kanji 判 dan 別 menjadi 判別 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pembedaan sesuatu dengan mengenali ciri-cirinya.”"
          },
          {
            word: "判明",
            reading: "はんめい",
            meaning: "terungkap jelas",
            unsur: [
              { jokugo: "判", arti: "menjadi diketahui" },
              { jokugo: "明", arti: "jelas" }
            ],
            penjelasan: "Hubungan makna antar kanji 判 dan 明 menjadi 判明 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keadaan ketika suatu fakta yang belum diketahui akhirnya menjadi jelas.”"
          },
          {
            word: "判読",
            reading: "はんどく",
            meaning: "membaca tulisan samar",
            unsur: [
              { jokugo: "判", arti: "mengenali" },
              { jokugo: "読", arti: "membaca" }
            ],
            penjelasan: "Hubungan makna antar kanji 判 dan 読 menjadi 判読 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan mengenali dan membaca tulisan yang sulit terbaca.”"
          }
        ]
      },
      {
        name: "3. Peradilan",
        jukugos: [
          {
            word: "裁判",
            reading: "さいばん",
            meaning: "proses peradilan hukum",
            unsur: [
              { jokugo: "裁", arti: "mengadili" },
              { jokugo: "判", arti: "mengadili" }
            ],
            penjelasan: "Hubungan makna antar kanji 裁 dan 判 menjadi 裁判 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “proses pemeriksaan dan pengambilan keputusan atas suatu perkara di pengadilan.”"
          },
          {
            word: "判決",
            reading: "はんけつ",
            meaning: "putusan pengadilan",
            unsur: [
              { jokugo: "判", arti: "mengadili" },
              { jokugo: "決", arti: "memutuskan" }
            ],
            penjelasan: "Hubungan makna antar kanji 判 dan 決 menjadi 判決 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “putusan yang dijatuhkan pengadilan dalam suatu perkara.”"
          },
          {
            word: "判事",
            reading: "はんじ",
            meaning: "hakim pengadilan",
            unsur: [
              { jokugo: "判", arti: "mengadili" },
              { jokugo: "事", arti: "urusan" }
            ],
            penjelasan: "Hubungan makna antar kanji 判 dan 事 menjadi 判事 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sebutan bagi orang yang bertugas mengadili perkara.”"
          }
        ]
      },
      {
        name: "4. Cap",
        jukugos: [
          {
            word: "判子",
            reading: "はんこ",
            meaning: "stempel pribadi",
            unsur: [
              { jokugo: "判", arti: "cap" },
              { jokugo: "子", arti: "unsur pembentuk kata benda" }
            ],
            penjelasan: "Hubungan makna antar kanji 判 dan 子 menjadi 判子 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “stempel pribadi yang digunakan untuk membubuhkan cap pada dokumen.”"
          }
        ]
      }
    ],
    crossLinks: [
      ["判断", "pertimbangan sikap & penetapan hasil", "判定"],
      ["批判", "kritik evaluasi & reputasi publik", "評判"],
      ["判別", "membedakan ciri & fakta terungkap jelas", "判明"],
      ["判別", "membedakan tanda & membaca tulisan samar", "判読"],
      ["裁判", "proses peradilan & putusan pengadilan", "判決"],
      ["裁判", "lembaga peradilan & hakim pemeriksa", "判事"],
      ["判決", "putusan hukum resmi & pertimbangan nalar", "判断"]
    ],
    quizzes: [
      // 5 Unscramble
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["いいです", "すぐに", "しないほうが", "判断"]),
        correctOrder: JSON.stringify(["すぐに", "判断", "しないほうが", "いいです"]),
        correctAnswer: "0",
        explanation: "Jawaban: すぐに判断しないほうがいいです。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["判子を", "日本人が", "この", "買ってくれました"]),
        correctOrder: JSON.stringify(["日本人が", "この", "判子を", "買ってくれました"]),
        correctAnswer: "0",
        explanation: "Jawaban: 日本人がこの判子を買ってくれました。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["料理も", "評判も", "この店は", "おいしいです", "いいし"]),
        correctOrder: JSON.stringify(["この店は", "評判も", "いいし", "料理も", "おいしいです"]),
        correctAnswer: "0",
        explanation: "Jawaban: この店は評判もいいし、料理もおいしいです。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["事故の原因が", "判明しました", "後で", "調べた"]),
        correctOrder: JSON.stringify(["調べた", "後で", "事故の原因が", "判明しました"]),
        correctAnswer: "0",
        explanation: "Jawaban: 調べた後で、事故の原因が判明しました。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["予定です", "来週", "行く", "裁判を", "見に"]),
        correctOrder: JSON.stringify(["来週", "裁判を", "見に", "行く", "予定です"]),
        correctAnswer: "0",
        explanation: "Jawaban: 来週、裁判を見に行く予定です。"
      },
      // 1 Grouping
      {
        type: "grouping",
        question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
        words: JSON.stringify([
          "判事", "裁判", "判別", "判明", "判子",
          "評判", "判断", "判定", "判読", "判決"
        ]),
        groups: JSON.stringify([
          {
            name: "1. Penilaian",
            category: "1. Penilaian",
            correctWords: ["判断", "判定", "評判"],
            items: ["判断", "判定", "評判"],
            "1. Penilaian": ["判断", "判定", "評判"]
          },
          {
            name: "2. Pembedaan dan Kejelasan",
            category: "2. Pembedaan dan Kejelasan",
            correctWords: ["判別", "判明", "判読"],
            items: ["判別", "判明", "判読"],
            "2. Pembedaan dan Kejelasan": ["判別", "判明", "判読"]
          },
          {
            name: "3. Peradilan",
            category: "3. Peradilan",
            correctWords: ["裁判", "判決", "判事"],
            items: ["裁判", "判決", "判事"],
            "3. Peradilan": ["裁判", "判決", "判事"]
          },
          {
            name: "4. Cap",
            category: "4. Cap",
            correctWords: ["判子"],
            items: ["判子"],
            "4. Cap": ["判子"]
          }
        ]),
        explanation: "Kunci Jawaban:\n1. Penilaian: 判断・判定・評判\n2. Pembedaan dan Kejelasan: 判別・判明・判読\n3. Peradilan: 裁判・判決・判事\n4. Cap: 判子"
      },
      // 5 Multiple Choice (Section c)
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “orang yang bertugas mengadili perkara”?",
        options: JSON.stringify(["判子", "評判", "判事"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 判事 (hanji) - hakim peradilan."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “mengenali dan membaca tulisan yang sulit terbaca”?",
        options: JSON.stringify(["判読", "判決", "判定"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 判読 (handoku) - membaca tulisan yang kabur/sulit dibaca."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “membedakan sesuatu dengan mengenali cirinya”?",
        options: JSON.stringify(["判事", "判別", "評判"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 判別 (hanbetsu) - membedakan berdasarkan perbedaan ciri."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “terungkapnya fakta yang sebelumnya belum diketahui”?",
        options: JSON.stringify(["判明", "判子", "判決"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 判明 (hanmei) - fakta yang menjadi jelas terungkap."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “putusan yang dijatuhkan pengadilan”?",
        options: JSON.stringify(["判断", "判定", "判決"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 判決 (hanketsu) - vonis atau putusan perkara pengadilan."
      },
      // 5 Fill in Blank (Section d)
      {
        type: "fill",
        question: "この店は（　　　）もいいし、料理もおいしいです。",
        options: JSON.stringify(["判子", "評判", "裁判"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 評判 (hyouban) - reputasi toko sangat baik."
      },
      {
        type: "fill",
        question: "机の上に、書類と（　　　）が置いてあります。",
        options: JSON.stringify(["判明", "判別", "判子"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 判子 (hanko) - cap/stempel pribadi."
      },
      {
        type: "fill",
        question: "調べた後で、事故の原因が（　　　）しました。",
        options: JSON.stringify(["判定", "判明", "裁判"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 判明 (hanmei) - penyebab kecelakaan terungkap jelas."
      },
      {
        type: "fill",
        question: "来週、（　　　）を見に裁判所へ行く予定です。",
        options: JSON.stringify(["判子", "評判", "裁判"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 裁判 (saiban) - melihat sidang peradilan di pengadilan."
      },
      {
        type: "fill",
        question: "字が消えていますから、この手紙は（　　　）できないかもしれません。",
        options: JSON.stringify(["判読", "判事", "判決"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 判読 (handoku) - membaca tulisan surat yang memudar."
      }
    ]
  },

  // ===========================================================
  // 4. KANJI 断 (ID: 3257)
  // ===========================================================
  {
    id: 3257,
    character: "断",
    romaji: "DAN / ta(tsu), kotowa(ru)",
    meaning: "Memutus, menghentikan, menentukan, menolak",
    baseMeaning: "Memutus suatu benda atau kelanjutan kegiatan, menetapkan keputusan, atau menolak suatu permintaan. (https://kakijun.com; https://kanji.me; https://kotobank.jp; https://www.kanjipedia.jp)",
    bushuu: "斤 (Kapak)",
    onyomi: "ダン",
    kunyomi: "た（つ）、ことわ（る）、さだ（める）",
    examples: [
      {
        japanese: "停電で授業が中断してしまいました。",
        romaji: "Teiden de jugyou ga chuudan shite shimaimashita.",
        translation: "Karena mati listrik, pelajaran terhenti untuk sementara waktu."
      },
      {
        japanese: "医者の診断を聞いた後で、薬をもらいました。",
        romaji: "Isha no shindan o kiita ato de, kusuri o moraimashita.",
        translation: "Setelah mendengarkan diagnosis dokter, saya mendapatkan obat."
      },
      {
        japanese: "ここは危ないですから、横断しないほうがいいです。",
        romaji: "Koko wa abunai desu kara, oudan shinai hou ga ii desu.",
        translation: "Karena di sini berbahaya, sebaiknya jangan menyeberang jalan."
      },
      {
        japanese: "独断で決めれば、問題が起こるかもしれません。",
        romaji: "Dokudan de kimereba, mondai ga okoru kamoshiremasen.",
        translation: "Jika memutuskan secara sepihak sendiri, masalah mungkin bisa timbul."
      },
      {
        japanese: "無断で休めば、先生が心配します。",
        romaji: "Mudan de yasumeba, sensei ga shinpai shimasu.",
        translation: "Jika Anda libur/absen tanpa izin, guru akan merasa khawatir."
      }
    ],
    reflections: [
      "Apa makna dasar kanji 断 yang Anda pahami?",
      "Jukugo mana yang mudah untuk diingat? Mengapa?",
      "Apa perbedaan penggunaan 無断、独断、dan 診断?",
      "Cabang semantic graph mana yang menurut Anda paling mudah dipahami?",
      "Bagaimana cara Anda mengingat hubungan makna antar jukugo yang mengandung kanji 断?"
    ],
    categories: [
      {
        name: "1. Pemutusan dan Penghentian",
        jukugos: [
          {
            word: "切断",
            reading: "せつだん",
            meaning: "pemotongan fisik terpisah",
            unsur: [
              { jokugo: "切", arti: "memotong" },
              { jokugo: "断", arti: "memutus" }
            ],
            penjelasan: "Hubungan makna antar kanji 切 dan 断 menjadi 切断 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memotong sesuatu hingga bagian-bagiannya terpisah.”"
          },
          {
            word: "中断",
            reading: "ちゅうだん",
            meaning: "penghentian sementara",
            unsur: [
              { jokugo: "中", arti: "tengah" },
              { jokugo: "断", arti: "menghentikan" }
            ],
            penjelasan: "Hubungan makna antar kanji 中 dan 断 menjadi 中断 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menghentikan sementara kegiatan yang masih berlangsung.”"
          },
          {
            word: "遮断",
            reading: "しゃだん",
            meaning: "pemblokiran aliran / akses",
            unsur: [
              { jokugo: "遮", arti: "menghalangi" },
              { jokugo: "断", arti: "memutus" }
            ],
            penjelasan: "Hubungan makna antar kanji 遮 dan 断 menjadi 遮断 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menghalangi sesuatu agar aliran atau aksesnya terputus.”"
          },
          {
            word: "断食",
            reading: "だんじき",
            meaning: "puasa makan",
            unsur: [
              { jokugo: "断", arti: "menghentikan" },
              { jokugo: "食", arti: "makan" }
            ],
            penjelasan: "Hubungan makna antar kanji 断 dan 食 menjadi 断食 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menahan diri dari makan selama waktu tertentu.”"
          }
        ]
      },
      {
        name: "2. Penilaian dan Keputusan",
        jukugos: [
          {
            word: "判断",
            reading: "はんだん",
            meaning: "pertimbangan nalar",
            unsur: [
              { jokugo: "判", arti: "menilai" },
              { jokugo: "断", arti: "menentukan" }
            ],
            penjelasan: "Hubungan makna antar kanji 判 dan 断 menjadi 判断 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menilai keadaan sebagai dasar untuk menentukan sikap atau tindakan.”"
          },
          {
            word: "決断",
            reading: "けつだん",
            meaning: "keputusan tegas",
            unsur: [
              { jokugo: "決", arti: "memutuskan" },
              { jokugo: "断", arti: "menetapkan" }
            ],
            penjelasan: "Hubungan makna antar kanji 決 dan 断 menjadi 決断 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengambil keputusan dengan tegas setelah mempertimbangkan pilihan.”"
          },
          {
            word: "診断",
            reading: "しんだん",
            meaning: "diagnosis medis",
            unsur: [
              { jokugo: "診", arti: "memeriksa" },
              { jokugo: "断", arti: "menentukan" }
            ],
            penjelasan: "Hubungan makna antar kanji 診 dan 断 menjadi 診断 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menentukan kondisi kesehatan berdasarkan hasil pemeriksaan.”"
          },
          {
            word: "断定",
            reading: "だんてい",
            meaning: "penetapan pasti",
            unsur: [
              { jokugo: "断", arti: "memutuskan" },
              { jokugo: "定", arti: "menetapkan" }
            ],
            penjelasan: "Hubungan makna antar kanji 断 dan 定 menjadi 断定 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menetapkan suatu kesimpulan sebagai sesuatu yang pasti.”"
          },
          {
            word: "独断",
            reading: "どくだん",
            meaning: "keputusan sepihak",
            unsur: [
              { jokugo: "独", arti: "sendiri" },
              { jokugo: "断", arti: "memutuskan" }
            ],
            penjelasan: "Hubungan makna antar kanji 独 dan 断 menjadi 独断 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengambil keputusan sendiri tanpa mempertimbangkan pendapat orang lain.”"
          }
        ]
      },
      {
        name: "3. Menyeberang",
        jukugos: [
          {
            word: "横断",
            reading: "おうだん",
            meaning: "menyeberang jalan",
            unsur: [
              { jokugo: "横", arti: "melintang" },
              { jokugo: "断", arti: "melintasi" }
            ],
            penjelasan: "Hubungan makna antar kanji 横 dan 断 menjadi 横断 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “melintasi suatu tempat dari satu sisi ke sisi lain, seperti saat menyeberang jalan.”"
          }
        ]
      },
      {
        name: "4. Izin",
        jukugos: [
          {
            word: "無断",
            reading: "むだん",
            meaning: "tanpa izin awal",
            unsur: [
              { jokugo: "無", arti: "tidak ada" },
              { jokugo: "断", arti: "memberi tahu terlebih dahulu" }
            ],
            penjelasan: "Hubungan makna antar kanji 無 dan 断 menjadi 無断 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “melakukan sesuatu tanpa meminta izin atau memberi tahu terlebih dahulu.”"
          }
        ]
      }
    ],
    crossLinks: [
      ["切断", "pemotongan fisik & penghentian sementara", "中断"],
      ["中断", "berhenti sementara & blokir total akses", "遮断"],
      ["断食", "menahan asupan makan & jeda berkegiatan", "中断"],
      ["判断", "pertimbangan nalar & ketegasan keputusan", "決断"],
      ["診断", "diagnosis pemeriksaan & penetapan pasti", "断定"],
      ["独断", "keputusan sepihak vs keputusan matang", "決断"],
      ["無断", "tanpa izin awal & keputusan sendiri", "独断"]
    ],
    quizzes: [
      // 5 Unscramble
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["診断を", "薬を", "聞いた後で", "もらいました", "医者の"]),
        correctOrder: JSON.stringify(["医者の", "診断を", "聞いた後で", "薬を", "もらいました"]),
        correctAnswer: "0",
        explanation: "Jawaban: 医者の診断を聞いた後で、薬をもらいました。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["無断で", "心配します", "休めば", "先生が"]),
        correctOrder: JSON.stringify(["無断で", "休めば", "先生が", "心配します"]),
        correctAnswer: "0",
        explanation: "Jawaban: 無断で休めば、先生が心配します。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["授業が", "してしまいました", "停電で", "中断"]),
        correctOrder: JSON.stringify(["停電で", "授業が", "中断", "してしまいました"]),
        correctAnswer: "0",
        explanation: "Jawaban: 停電で授業が中断してしまいました。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["しないほうが", "ここでは", "いいです", "横断"]),
        correctOrder: JSON.stringify(["ここでは", "横断", "しないほうが", "いいです"]),
        correctAnswer: "0",
        explanation: "Jawaban: ここでは横断しないほうがいいです。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        words: JSON.stringify(["決断する", "相談した", "つもりです", "後で", "家族と"]),
        correctOrder: JSON.stringify(["家族と", "相談した", "後で", "決断する", "つもりです"]),
        correctAnswer: "0",
        explanation: "Jawaban: 家族と相談した後で、決断するつもりです。"
      },
      // 1 Grouping
      {
        type: "grouping",
        question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
        words: JSON.stringify([
          "判断", "独断", "切断", "断食", "決断",
          "無断", "診断", "中断", "遮断", "横断"
        ]),
        groups: JSON.stringify([
          {
            name: "1. Pemutusan dan Penghentian",
            category: "1. Pemutusan dan Penghentian",
            correctWords: ["切断", "中断", "遮断", "断食"],
            items: ["切断", "中断", "遮断", "断食"],
            "1. Pemutusan dan Penghentian": ["切断", "中断", "遮断", "断食"]
          },
          {
            name: "2. Penilaian dan Keputusan",
            category: "2. Penilaian dan Keputusan",
            correctWords: ["判断", "決断", "診断", "独断"],
            items: ["判断", "決断", "診断", "独断"],
            "2. Penilaian dan Keputusan": ["判断", "決断", "診断", "独断"]
          },
          {
            name: "3. Menyeberang",
            category: "3. Menyeberang",
            correctWords: ["横断"],
            items: ["横断"],
            "3. Menyeberang": ["横断"]
          },
          {
            name: "4. Izin",
            category: "4. Izin",
            correctWords: ["無断"],
            items: ["無断"],
            "4. Izin": ["無断"]
          }
        ]),
        explanation: "Kunci Jawaban:\n1. Pemutusan dan Penghentian: 切断・中断・遮断・断食\n2. Penilaian dan Keputusan: 判断・決断・診断・独断\n3. Menyeberang: 横断\n4. Izin: 無断"
      },
      // 5 Multiple Choice (Section c)
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “melakukan sesuatu tanpa meminta izin”?",
        options: JSON.stringify(["無断", "決断", "診断"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 無断 (mudan) - melakukan sesuatu tanpa izin terlebih dahulu."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “berpindah dari satu sisi jalan ke sisi lainnya”?",
        options: JSON.stringify(["中断", "横断", "独断"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 横断 (oudan) - menyeberangi jalan."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “penentuan kondisi kesehatan berdasarkan pemeriksaan”?",
        options: JSON.stringify(["診断", "断食", "横断"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 診断 (shindan) - diagnosis medis oleh dokter."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “penghentian sementara kegiatan yang sedang berlangsung”?",
        options: JSON.stringify(["決断", "中断", "独断"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 中断 (chuudan) - berhenti sementara di tengah kegiatan."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “keputusan yang diambil sendiri tanpa mempertimbangkan pendapat orang lain”?",
        options: JSON.stringify(["切断", "遮断", "独断"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 独断 (dokudan) - keputusan sepihak sendiri."
      },
      // 5 Fill in Blank (Section d)
      {
        type: "fill",
        question: "停電で授業が（　　　）してしまいました。",
        options: JSON.stringify(["診断", "断食", "中断"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 中断 (chuudan) - pelajaran terhenti sementara karena listrik padam."
      },
      {
        type: "fill",
        question: "ここは危ないですから、（　　　）しないほうがいいです。",
        options: JSON.stringify(["横断", "判断", "診断"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 横断 (oudan) - menyeberang jalan."
      },
      {
        type: "fill",
        question: "医者の（　　　）を聞いた後で、薬をもらいました。",
        options: JSON.stringify(["独断", "横断", "診断"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 診断 (shindan) - mendengarkan hasil diagnosis dokter."
      },
      {
        type: "fill",
        question: "（　　　）で学校を休めば、先生が心配します。",
        options: JSON.stringify(["切断", "無断", "断定"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 無断 (mudan) - membolos tanpa izin/kabar."
      },
      {
        type: "fill",
        question: "一人で（　　　）する前に、家族と相談したほうがいいです。",
        options: JSON.stringify(["決断", "切断", "遮断"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 決断 (ketsudan) - mengambil keputusan penting."
      }
    ]
  },

  // ===========================================================
  // 5. KANJI 想 (ID: 3259)
  // ===========================================================
  {
    id: 3259,
    character: "想",
    romaji: "SOU, SO / omo(u)",
    meaning: "Memikirkan, membayangkan, gagasan",
    baseMeaning: "Memikirkan atau menghadirkan gambaran, gagasan, dan perasaan di dalam pikiran. (https://kakijun.com; https://kanji.me; https://kotobank.jp; https://www.kanjipedia.jp)",
    bushuu: "心 (Hati / Pikiran)",
    onyomi: "ソウ、ソ",
    kunyomi: "おも（う）",
    examples: [
      {
        japanese: "音楽を聞きながら、海を想像しています。",
        romaji: "Ongaku o kikinagara, umi o souzou shite imasu.",
        translation: "Sambil mendengarkan musik, saya membayangkan lautan."
      },
      {
        japanese: "会議の前に、新しい発想をメモしておきます。",
        romaji: "Kaigi no mae ni, atarashii hassou o memo shite okimasu.",
        translation: "Sebelum rapat, saya akan mencatat gagasan-gagasan baru."
      },
      {
        japanese: "明日の試合では、予想が外れるかもしれません。",
        romaji: "Ashita no shiai de wa, yosou ga hazureru kamoshiremasen.",
        translation: "Pada pertandingan besok, prediksi mungkin bisa meleset."
      },
      {
        japanese: "この本を読んだ後で、感想を書いてください。",
        romaji: "Kono hon o yonda ato de, kansou o kaite kudasai.",
        translation: "Setelah membaca buku ini, tolong tuliskan kesan Anda."
      },
      {
        japanese: "この写真を見れば、夏を連想します。",
        romaji: "Kono shashin o mireba, natsu o rensou shimasu.",
        translation: "Jika melihat foto ini, saya teringat/terasosiasi dengan musim panas."
      }
    ],
    reflections: [
      "Apa makna dasar kanji 想 yang Anda pahami?",
      "Jukugo mana yang mudah untuk diingat? Mengapa?",
      "Apa perbedaan penggunaan 感想、理想、dan 予想?",
      "Cabang semantic graph mana yang menurut Anda paling mudah dipahami?",
      "Bagaimana cara Anda mengingat hubungan makna antar jukugo yang mengandung kanji 想?"
    ],
    categories: [
      {
        name: "1. Bayangan",
        jukugos: [
          {
            word: "想像",
            reading: "そうぞう",
            meaning: "imajinasi gambaran pikiran",
            unsur: [
              { jokugo: "想", arti: "membayangkan" },
              { jokugo: "像", arti: "gambaran" }
            ],
            penjelasan: "Hubungan makna antar kanji 想 dan 像 menjadi 想像 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “gambaran tentang sesuatu yang dihadirkan dalam pikiran.”"
          },
          {
            word: "空想",
            reading: "くうそう",
            meaning: "khayalan angan-angan",
            unsur: [
              { jokugo: "空", arti: "tidak berpijak pada kenyataan" },
              { jokugo: "想", arti: "membayangkan" }
            ],
            penjelasan: "Hubungan makna antar kanji 空 dan 想 menjadi 空想 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bayangan dalam pikiran yang tidak berpijak pada kenyataan.”"
          },
          {
            word: "理想",
            reading: "りそう",
            meaning: "keadaan idaman terbaik",
            unsur: [
              { jokugo: "理", arti: "prinsip tentang keadaan semestinya" },
              { jokugo: "想", arti: "gambaran dalam pikiran" }
            ],
            penjelasan: "Hubungan makna antar kanji 理 dan 想 menjadi 理想 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “gambaran tentang keadaan terbaik yang diidamkan.”"
          }
        ]
      },
      {
        name: "2. Pemikiran",
        jukugos: [
          {
            word: "思想",
            reading: "しそう",
            meaning: "pemikiran / falsafah",
            unsur: [
              { jokugo: "思", arti: "berpikir" },
              { jokugo: "想", arti: "pikiran" }
            ],
            penjelasan: "Hubungan makna antar kanji 思 dan 想 menjadi 思想 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pemikiran atau pandangan mendalam mengenai suatu hal.”"
          },
          {
            word: "発想",
            reading: "はっそう",
            meaning: "gagasan ide baru",
            unsur: [
              { jokugo: "発", arti: "muncul" },
              { jokugo: "想", arti: "pikiran" }
            ],
            penjelasan: "Hubungan makna antar kanji 発 dan 想 menjadi 発想 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “gagasan yang muncul dalam pikiran.”"
          }
        ]
      },
      {
        name: "3. Perkiraan",
        jukugos: [
          {
            word: "予想",
            reading: "よそう",
            meaning: "perkiraan / prediksi",
            unsur: [
              { jokugo: "予", arti: "sebelumnya" },
              { jokugo: "想", arti: "memikirkan" }
            ],
            penjelasan: "Hubungan makna antar kanji 予 dan 想 menjadi 予想 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perkiraan mengenai sesuatu sebelum hal tersebut terjadi.”"
          },
          {
            word: "想定",
            reading: "そうてい",
            meaning: "asumsi hipotesis",
            unsur: [
              { jokugo: "想", arti: "membayangkan" },
              { jokugo: "定", arti: "menetapkan" }
            ],
            penjelasan: "Hubungan makna antar kanji 想 dan 定 menjadi 想定 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keadaan yang dibayangkan dan ditetapkan sebagai dasar untuk berpikir.”"
          }
        ]
      },
      {
        name: "4. Ingatan",
        jukugos: [
          {
            word: "回想",
            reading: "かいそう",
            meaning: "mengenang masa lalu",
            unsur: [
              { jokugo: "回", arti: "kembali" },
              { jokugo: "想", arti: "mengingat" }
            ],
            penjelasan: "Hubungan makna antar kanji 回 dan 想 menjadi 回想 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menghadirkan kembali pengalaman masa lalu dalam pikiran.”"
          },
          {
            word: "連想",
            reading: "れんそう",
            meaning: "asosiasi pikiran",
            unsur: [
              { jokugo: "連", arti: "menghubungkan" },
              { jokugo: "想", arti: "membayangkan" }
            ],
            penjelasan: "Hubungan makna antar kanji 連 dan 想 menjadi 連想 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “hubungan dalam pikiran ketika suatu hal memunculkan hal lain yang berkaitan.”"
          }
        ]
      },
      {
        name: "5. Kesan",
        jukugos: [
          {
            word: "感想",
            reading: "かんそう",
            meaning: "kesan tanggapan",
            unsur: [
              { jokugo: "感", arti: "merasakan" },
              { jokugo: "想", arti: "pikiran" }
            ],
            penjelasan: "Hubungan makna antar kanji 感 dan 想 menjadi 感想 menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pikiran atau perasaan yang timbul setelah melihat, mendengar, membaca, atau mengalami sesuatu.”"
          }
        ]
      }
    ],
    crossLinks: [
      ["想像", "imajinasi pikiran & khayalan tidak nyata", "空想"],
      ["想像", "gambaran mental & keadaan terbaik idaman", "理想"],
      ["思想", "sistem pemikiran filosofis & ide baru muncul", "発想"],
      ["予想", "perkiraan masa depan & asumsi dasar berpikir", "想定"],
      ["回想", "mengenang masa lalu & asosiasi pikiran", "連想"],
      ["感想", "kesan pengalaman & pandangan pemikiran", "思想"]
    ],
    quizzes: [
      // 5 Unscramble
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["海を", "聞きながら", "想像しています", "音楽を"]),
        correctOrder: JSON.stringify(["音楽を", "聞きながら", "海を", "想像しています"]),
        correctAnswer: "0",
        explanation: "Jawaban: 音楽を聞きながら、海を想像しています。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["書いてください", "読んだ後で", "感想を", "この本を"]),
        correctOrder: JSON.stringify(["この本を", "読んだ後で", "感想を", "書いてください"]),
        correctAnswer: "0",
        explanation: "Jawaban: この本を読んだ後で、感想を書いてください。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["メモしておきます", "新しい発想を", "会議の前に"]),
        correctOrder: JSON.stringify(["会議の前に", "新しい発想を", "メモしておきます"]),
        correctAnswer: "0",
        explanation: "Jawaban: 会議の前に、新しい発想をメモしておきます。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["外れる", "試合では", "かもしれません", "予想が", "明日の"]),
        correctOrder: JSON.stringify(["明日の", "試合では", "予想が", "外れる", "かもしれません"]),
        correctAnswer: "0",
        explanation: "Jawaban: 明日の試合では、予想が外れるかもしれません。"
      },
      {
        type: "unscramble",
        question: "Susunlah kata-kata berikut menjadi kalimat yang tepat.",
        words: JSON.stringify(["夏を", "見れば", "連想します", "この写真を"]),
        correctOrder: JSON.stringify(["この写真を", "見れば", "夏を", "連想します"]),
        correctAnswer: "0",
        explanation: "Jawaban: この写真を見れば、夏を連想します。"
      },
      // 1 Grouping
      {
        type: "grouping",
        question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
        words: JSON.stringify([
          "発想", "想定", "回想", "予想", "空想",
          "想像", "思想", "理想", "感想", "連想"
        ]),
        groups: JSON.stringify([
          {
            name: "1. Bayangan",
            category: "1. Bayangan",
            correctWords: ["想像", "空想", "理想"],
            items: ["想像", "空想", "理想"],
            "1. Bayangan": ["想像", "空想", "理想"]
          },
          {
            name: "2. Pemikiran",
            category: "2. Pemikiran",
            correctWords: ["思想", "発想"],
            items: ["思想", "発想"],
            "2. Pemikiran": ["思想", "発想"]
          },
          {
            name: "3. Perkiraan",
            category: "3. Perkiraan",
            correctWords: ["予想", "想定"],
            items: ["予想", "想定"],
            "3. Perkiraan": ["予想", "想定"]
          },
          {
            name: "4. Ingatan",
            category: "4. Ingatan",
            correctWords: ["回想", "連想"],
            items: ["回想", "連想"],
            "4. Ingatan": ["回想", "連想"]
          },
          {
            name: "5. Kesan",
            category: "5. Kesan",
            correctWords: ["感想"],
            items: ["感想"],
            "5. Kesan": ["感想"]
          }
        ]),
        explanation: "Kunci Jawaban:\n1. Bayangan: 想像・空想・理想\n2. Pemikiran: 思想・発想\n3. Perkiraan: 予想・想定\n4. Ingatan: 回想・連想\n5. Kesan: 感想"
      },
      // 5 Multiple Choice (Section c)
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “gambaran tentang keadaan terbaik yang diidamkan”?",
        options: JSON.stringify(["感想", "回想", "理想"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 理想 (risou) - keadaan terbaik yang diidamkan."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “suatu hal memunculkan hal lain yang berkaitan dalam pikiran”?",
        options: JSON.stringify(["連想", "予想", "思想"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 連想 (rensou) - asosiasi pikiran."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “perkiraan mengenai sesuatu sebelum hal itu terjadi”?",
        options: JSON.stringify(["思想", "感想", "予想"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 予想 (yosou) - prediksi atau perkiraan masa depan."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “mengenang pengalaman masa lalu”?",
        options: JSON.stringify(["回想", "想定", "発想"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 回想 (kaisou) - mengenang pengalaman masa lalu."
      },
      {
        type: "multiple",
        question: "Jukugo mana yang berhubungan dengan makna “kesan setelah membaca, melihat, atau mengalami sesuatu”?",
        options: JSON.stringify(["理想", "感想", "空想"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 感想 (kansou) - kesan atau opini setelah mengalami sesuatu."
      },
      // 5 Fill in Blank (Section d)
      {
        type: "fill",
        question: "この本を読んだ後で、（　　　）を書いてください。",
        options: JSON.stringify(["理想", "感想", "想定"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 感想 (kansou) - menuliskan kesan buku."
      },
      {
        type: "fill",
        question: "明日の試合では、（　　　）が外れるかもしれません。",
        options: JSON.stringify(["思想", "回想", "予想"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 予想 (yosou) - perkiraan hasil pertandingan."
      },
      {
        type: "fill",
        question: "音楽を聞きながら、海を（　　　）しています。",
        options: JSON.stringify(["感想", "理想", "想像"]),
        correctAnswer: "2",
        explanation: "Jawaban tepat: c. 想像 (souzou) - membayangkan pemandangan laut."
      },
      {
        type: "fill",
        question: "会議の前に、新しい（　　　）をメモしておきます。",
        options: JSON.stringify(["発想", "回想", "連想"]),
        correctAnswer: "0",
        explanation: "Jawaban tepat: a. 発想 (hassou) - ide/gagasan baru untuk rapat."
      },
      {
        type: "fill",
        question: "この写真を見れば、夏を（　　　）します。",
        options: JSON.stringify(["感想", "連想", "理想"]),
        correctAnswer: "1",
        explanation: "Jawaban tepat: b. 連想 (rensou) - mengasosiasikan foto dengan musim panas."
      }
    ]
  }
];

// =============================================================
// MAIN SEED FUNCTION
// =============================================================
async function seedModul8() {
  console.log("=============================================================");
  console.log("🚀 MEMULAI SEEDING STRICT MODUL 8 (認・識・判・断・想)");
  console.log("=============================================================\n");

  // 1. Pastikan Modul 8 memiliki judul dan tujuan pembelajaran yang tepat
  await prisma.module.upsert({
    where: { id: 562 },
    update: {
      title: "MODUL 8: PROSES BERPIKIR DAN PENALARAN",
      tujuanPembelajaran:
        "Mahasiswa mampu:\n- Memahami konsep berpikir dan penalaran kanji\n- Mengidentifikasi hubungan makna antar-kanji kognitif\n- Menganalisis pembentukan jukugo yang berkaitan dengan pemikiran\n- Menyusun semantic graph kognitif\n- Menggunakan jukugo dalam konteks pengambilan keputusan"
    },
    create: {
      id: 562,
      title: "MODUL 8: PROSES BERPIKIR DAN PENALARAN",
      tujuanPembelajaran:
        "Mahasiswa mampu:\n- Memahami konsep berpikir dan penalaran kanji\n- Mengidentifikasi hubungan makna antar-kanji kognitif\n- Menganalisis pembentukan jukugo yang berkaitan dengan pemikiran\n- Menyusun semantic graph kognitif\n- Menggunakan jukugo dalam konteks pengambilan keputusan"
    }
  });
  console.log("✅ Modul 562: MODUL 8: PROSES BERPIKIR DAN PENALARAN siap.");

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

  // 3. Pastikan UserModuleProgress untuk seluruh user terdaftar di Modul 562
  const allUsers = await prisma.user.findMany({ select: { id: true } });
  for (const u of allUsers) {
    const existingUMP = await prisma.userModuleProgress.findUnique({
      where: {
        userId_moduleId: {
          userId: u.id,
          moduleId: 562
        }
      }
    });
    if (!existingUMP) {
      await prisma.userModuleProgress.create({
        data: {
          userId: u.id,
          moduleId: 562,
          isCompleted: false,
          isLocked: false,
          progressPercent: 0
        }
      });
    }
  }

  // 4. Proses Seeding Kanji Modul 8 secara sekuensial (認・識・判・断・想)
  console.log("\n📚 Memulai pemrosesan 5 Kanji Utama Modul 8...");

  const ORDER_CANONICAL = ["認", "識", "判", "断", "想"];

  for (const char of ORDER_CANONICAL) {
    const data = MODUL_8_DATA.find((k) => k.character === char)!;
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
          moduleId: 562
        }
      });
    } else {
      kanji = await prisma.kanji.create({
        data: {
          id: data.id,
          character: data.character,
          romaji: data.romaji,
          meaning: data.meaning,
          baseMeaning: data.baseMeaning,
          bushuu: data.bushuu,
          onyomi: data.onyomi,
          kunyomi: data.kunyomi,
          moduleId: 562
        }
      });
    }

    const kanjiId = kanji.id;
    console.log(`  ✓ Data dasar kanji '${char}' tersimpan (ID: ${kanjiId}, moduleId: 562)`);

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
  console.log("🔍 VALIDASI HASIL DATABASE MODUL 8");
  console.log("=============================================================");

  const mod8 = await prisma.module.findUnique({
    where: { id: 562 },
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

  if (!mod8) {
    throw new Error("Modul 562 tidak ditemukan di DB!");
  }

  console.log(`Modul ID: ${mod8.id} | Judul: ${mod8.title}`);
  console.log(`Urutan Kanji Tersimpan di Database:`);
  mod8.kanjis.forEach((k, index) => {
    console.log(
      `  [${index + 1}] Kanji: ${k.character} (ID: ${k.id}) -> ` +
        `Jukugo: ${k.jukugos.length}, Membaca: ${k.examples.length}, Refleksi: ${k.masterRefleksi.length}, ` +
        `Kuis: ${k.quizzes.length}, Edges: ${k.graphEdges.length}, SemanticRel: ${k.semanticRelations.length}`
    );
  });

  const actualOrder = mod8.kanjis.map((k) => k.character).join("・");
  const expectedOrder = "認・識・判・断・想";

  if (actualOrder === expectedOrder) {
    console.log(`\n🎉 URUTAN KANJI TEPAT & SEMPURNA: ${actualOrder}`);
  } else {
    console.warn(`\n⚠️ URUTAN KANJI TIDAK COCOK: Aktual=${actualOrder}, Harapan=${expectedOrder}`);
  }

  console.log("\n=== SEEDING MODUL 8 SELESAI DENGAN SUKSES ===");
}

seedModul8()
  .catch((err) => {
    console.error("❌ Gagal saat melakukan seeding Modul 8:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
