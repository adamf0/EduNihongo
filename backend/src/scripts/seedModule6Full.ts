import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface JukugoInfo {
  word: string;
  reading: string;
  meaning: string;
  explanation: string;
  charRoles: Record<string, string>;
}

interface CategoryInfo {
  name: string;
  description: string;
  color: string;
  jukugos: JukugoInfo[];
}

interface ExampleInfo {
  japanese: string;
  romaji: string;
  translation: string;
}

interface QuizInfo {
  type: string;
  question: string;
  options?: string[];
  correctAnswer?: number | string;
  words?: string[];
  correctOrder?: string[];
  groups?: Array<Record<string, string[]>>;
  explanation?: string;
}

interface KanjiFullData {
  romaji: string;
  meaning: string;
  bushuu: string;
  onyomi: string;
  kunyomi: string;
  baseMeaning: string;
  border: string;
  categories: CategoryInfo[];
  examples: ExampleInfo[];
  reflections: string[];
  quizzes: QuizInfo[];
  crossLinks: [string, string, string][];
}

async function seedModule6() {
  console.log("🚀 Starting seeding for Modul 6 (経・始・歴・史・期)...");

  // 1. Ensure Module 6 exists in DB
  const moduleId = 560;
  const moduleTitle = "Module 6";
  const tujuanPembelajaran = `Mahasiswa mampu:
Memahami konsep waktu, pengalaman, dan kehidupan yang berkaitan dengan penggunaan kanji; 
Menjelaskan hubungan makna antar-kanji dalam berbagai konteks kehidupan; 
Menganalisis pembentukan jukugo berdasarkan hubungan makna kanji penyusunnya; 
Menyusun semantic graph yang menggambarkan hubungan makna waktu, pengalaman, dan kehidupan; 
Menggunakan jukugo yang berkaitan dengan waktu, pengalaman, dan kehidupan dalam konteks sehari-hari.`;

  await prisma.module.upsert({
    where: { id: moduleId },
    update: {
      title: moduleTitle,
      tujuanPembelajaran
    },
    create: {
      id: moduleId,
      title: moduleTitle,
      tujuanPembelajaran
    }
  });

  // Also ensure all users have UserModuleProgress for Module 6
  const users = await prisma.user.findMany();
  for (const u of users) {
    const existingProgress = await prisma.userModuleProgress.findUnique({
      where: {
        userId_moduleId: {
          userId: u.id,
          moduleId: moduleId
        }
      }
    });
    if (!existingProgress) {
      await prisma.userModuleProgress.create({
        data: {
          userId: u.id,
          moduleId: moduleId,
          isCompleted: false,
          isLocked: false,
          progressPercent: 0
        }
      });
    }
  }

  console.log(`✅ Module 6 (ID: ${moduleId}) initialized.`);

  // 2. Data dictionary for 5 main kanjis of Module 6
  const kanjiDataMap: Record<string, KanjiFullData> = {
    "経": {
      romaji: "Kei / Kyou",
      meaning: "Melalui, melewati, mengalami, mengelola, mengatur",
      bushuu: "糸（いと・いとへん）",
      onyomi: "ケイ、キョウ",
      kunyomi: "（へ）る、（た）つ",
      baseMeaning: "Proses melewati waktu, tempat, atau pengalaman, serta aktivitas mengelola atau mengatur sesuatu.",
      border: "border-l-4 border-primary",
      categories: [
        {
          name: "Pengalaman / Proses",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan sesuatu yang dialami atau dilalui dalam suatu proses maupun perjalanan kehidupan.",
          color: "border-green-500",
          jukugos: [
            {
              word: "経験",
              reading: "けいけん",
              meaning: "pengalaman",
              explanation: "Hubungan makna antara kanji 経 dan 験 menjadi 経験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengalaman yang diperoleh melalui sesuatu yang telah dijalani.”",
              charRoles: { "経": "melalui, menjalani", "験": "pengalaman, ujian" }
            },
            {
              word: "経過",
              reading: "けいか",
              meaning: "proses / perkembangan",
              explanation: "Hubungan makna antara kanji 経 dan 過 menjadi 経過, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “proses atau keadaan yang berlangsung dan telah melewati suatu rentang waktu.”",
              charRoles: { "経": "melalui, melewati", "過": "melewati, berlalu" }
            },
            {
              word: "経歴",
              reading: "けいれき",
              meaning: "riwayat / karier",
              explanation: "Hubungan makna antara kanji 経 dan 歴 menjadi 経歴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “riwayat atau perjalanan hidup dan karier yang telah dilalui.”",
              charRoles: { "経": "melalui, menjalani", "歴": "riwayat, perjalanan yang telah dilalui" }
            }
          ]
        },
        {
          name: "Jalur / Cara Melalui",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan jalur, perantara, atau cara sesuatu dilakukan atau disampaikan.",
          color: "border-blue-500",
          jukugos: [
            {
              word: "経由",
              reading: "けいゆ",
              meaning: "melalui / transit",
              explanation: "Hubungan makna antara kanji 経 dan 由 menjadi 経由, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “melalui suatu tempat, jalur, atau perantara.”",
              charRoles: { "経": "melalui", "由": "asal, melalui" }
            },
            {
              word: "経口",
              reading: "けいこう",
              meaning: "oral / melalui mulut",
              explanation: "Hubungan makna antara kanji 経 dan 口 menjadi 経口, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “melalui mulut atau dilakukan secara oral.”",
              charRoles: { "経": "melalui", "口": "mulut" }
            }
          ]
        },
        {
          name: "Pengelolaan / Ekonomi",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan pengelolaan, penyelenggaraan, dan penggunaan sumber daya dalam kegiatan ekonomi.",
          color: "border-orange-500",
          jukugos: [
            {
              word: "経済",
              reading: "けいざい",
              meaning: "ekonomi",
              explanation: "Hubungan makna antara kanji 経 dan 済 menjadi 経済, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan mengelola dan mengatur kehidupan atau sumber daya ekonomi.”",
              charRoles: { "経": "mengatur, mengelola", "済": "menyelesaikan, mengatur" }
            },
            {
              word: "経営",
              reading: "けいえい",
              meaning: "manajemen / pengelolaan",
              explanation: "Hubungan makna antara kanji 経 dan 営 menjadi 経営, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan mengelola dan menjalankan suatu usaha atau organisasi.”",
              charRoles: { "経": "mengelola, mengatur", "営": "menjalankan, mengusahakan" }
            },
            {
              word: "経費",
              reading: "けいひ",
              meaning: "biaya / pengeluaran",
              explanation: "Hubungan makna antara kanji 経 dan 費 menjadi 経費, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “biaya yang dikeluarkan untuk menjalankan suatu kegiatan atau keperluan.”",
              charRoles: { "経": "urusan, pengelolaan", "費": "biaya, pengeluaran" }
            },
            {
              word: "経理",
              reading: "けいり",
              meaning: "akuntansi",
              explanation: "Hubungan makna antara kanji 経 dan 理 menjadi 経理, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan mengatur dan mengelola urusan keuangan, khususnya pencatatan keuangan.”",
              charRoles: { "経": "mengatur, mengelola", "理": "mengatur, menata" }
            },
            {
              word: "経常",
              reading: "けいじょう",
              meaning: "rutin / berkala",
              explanation: "Hubungan makna antara kanji 経 dan 常 menjadi 経常, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sesuatu yang berlangsung secara rutin atau terus-menerus.”",
              charRoles: { "経": "berlangsung, berjalan", "常": "selalu, biasa" }
            }
          ]
        }
      ],
      examples: [
        {
          japanese: "日本で いろいろな 経験を しようと 思っています。",
          romaji: "Nihon de iroiro na keiken wo shou to omotte imasu.",
          translation: "Saya bermaksud mencoba berbagai pengalaman di Jepang."
        },
        {
          japanese: "大学で 経済を 勉強するのは 面白いです。",
          romaji: "Daigaku de keizai wo benkyou suru no wa omoshiroi desu.",
          translation: "Belajar ekonomi di universitas sangat menarik."
        },
        {
          japanese: "会議の 前に 事件の 経過を 調べて おきます。",
          romaji: "Kaigi no mae ni jiken no keika wo shirabete okimasu.",
          translation: "Sebelum rapat, saya memeriksa kronologi/proses kejadian terlebih dahulu."
        },
        {
          japanese: "この 飛行機は 東京 経由で 行くでしょう。",
          romaji: "Kono hikouki wa Toukyou keiyu de iku deshou.",
          translation: "Pesawat ini mungkin pergi melalui transit di Tokyo."
        },
        {
          japanese: "この 会社は 有名な 社長に 経営されています。",
          romaji: "Kono kaisha wa yuumei na shachou ni keiei sarete imasu.",
          translation: "Perusahaan ini dikelola oleh direktur utama yang terkenal."
        }
      ],
      reflections: [
        "Apa makna dasar kanji 経 yang anda pahami?",
        "Jukugo mana yang mudah untuk di ingat? Mengapa?",
        "Apa perbedaan penggunaan 経済、経営 dan 経理?",
        "Cabang semantic graph mana yang menurut anda paling mudah dipahami?",
        "Bagaimana cara anda mengingat hubungan makna antar jukugo yang mengandung kanji 経?"
      ],
      quizzes: [
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar:\n経口で ・ 方が ・ 薬を ・ 飲んだ ・ いいです",
          words: ["経口で", "薬を", "飲んだ", "方が", "いいです。"],
          correctOrder: ["経口で", "薬を", "飲んだ", "方が", "いいです。"],
          explanation: "Jawaban tepat: 経口で薬を飲んだ方がいいです。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar:\n経験するのは ・ 楽しい ・ 海外で ・ です",
          words: ["海外で", "経験するのは", "楽しい", "です。"],
          correctOrder: ["海外で", "経験するのは", "楽しい", "です。"],
          explanation: "Jawaban tepat: 海外で経験するのは楽しいです。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar:\n経済が ・ なるかもしれません ・ 来年 ・ よく",
          words: ["来年", "経済が", "よく", "なるかもしれません。"],
          correctOrder: ["来年", "経済が", "よく", "なるかもしれません。"],
          explanation: "Jawaban tepat: 来年経済がよくなるかもしれません。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar:\n経営しようと ・ 自分の ・ 思っています ・ 会社を",
          words: ["自分の", "会社を", "経営しようと", "思っています。"],
          correctOrder: ["自分の", "会社を", "経営しようと", "思っています。"],
          explanation: "Jawaban tepat: 自分の会社を経営しようと思っています。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar:\n経費を ・ 安くなるでしょう ・ へらせば",
          words: ["経費を", "へらせば、", "安くなるでしょう。"],
          correctOrder: ["経費を", "へらせば、", "安くなるでしょう。"],
          explanation: "Jawaban tepat: 経費をへらせば、安くなるでしょう。"
        },
        {
          type: "grouping",
          question: "Kelompokkan jukugo kanji 経 berikut ini kedalam semantic graph yang tepat.",
          words: ["経営", "経験", "経費", "経口", "経常", "経歴", "経済", "経由", "経理", "経過"],
          groups: [
            { "Pengalaman / Perjalanan Waktu": ["経験", "経過", "経歴"] },
            { "Jalur / Cara Melalui": ["経由", "経口"] },
            { "Ekonomi / Pengelolaan": ["経済", "経営", "経費", "経理", "経常"] }
          ],
          explanation: "Pengelompokan jukugo berdasarkan cabang semantic graph kanji 経."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “pengalaman yang diperoleh melalui sesuatu yang telah dijalani”?",
          options: ["経過", "経歴", "経験"],
          correctAnswer: 2,
          explanation: "Jawaban tepat: c. 経験 (keiken / pengalaman)."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “proses atau keadaan yang berlangsung dan telah melewati suatu rentang waktu”?",
          options: ["経費", "経過", "経由"],
          correctAnswer: 1,
          explanation: "Jawaban tepat: b. 経過 (keika / proses)."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “riwayat atau perjalanan hidup dan karier yang telah dilalui”?",
          options: ["経歴", "経験", "経営"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: a. 経歴 (keireki / riwayat)."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “melalui suatu tempat, jalur, atau perantara”?",
          options: ["経口", "経常", "経由"],
          correctAnswer: 2,
          explanation: "Jawaban tepat: c. 経由 (keiyu / melalui)."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “melalui mulut atau dilakukan secara oral”?",
          options: ["経理", "経口", "経由"],
          correctAnswer: 1,
          explanation: "Jawaban tepat: b. 経口 (keikou / oral)."
        },
        {
          type: "fill",
          question: "東京を（　　）して大阪へ行く予定です。",
          options: ["経営", "経由", "経験"],
          correctAnswer: 1,
          explanation: "Jawaban tepat: b. 経由 (keiyu / melalui/transit)."
        },
        {
          type: "fill",
          question: "日本へ来て、いろいろなことを（　　）しました。",
          options: ["経済", "経験", "経理"],
          correctAnswer: 1,
          explanation: "Jawaban tepat: b. 経験 (keiken / pengalaman)."
        },
        {
          type: "fill",
          question: "会社を（　　）するのは大変でしょう。",
          options: ["経営", "経過", "経口"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: a. 経営 (keiei / mengelola/manajemen)."
        },
        {
          type: "fill",
          question: "この薬は水といっしょに（　　）で飲みます。",
          options: ["経歴", "経口", "経費"],
          correctAnswer: 1,
          explanation: "Jawaban tepat: b. 経口 (keikou / oral/melalui mulut)."
        },
        {
          type: "fill",
          question: "旅行にかかった（　　）が高かったので、来月は旅行しないつもりです。",
          options: ["経費", "経常", "経由"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: a. 経費 (keihi / biaya)."
        }
      ],
      crossLinks: [
        ["経験", "membentuk", "経歴"],
        ["経過", "berjalan sesuai", "計画"],
        ["経由", "melintasi", "経路"],
        ["経済", "memerlukan", "経営"],
        ["経営", "mengatur", "経費"],
        ["経理", "mencatat", "経費"],
        ["経常", "merupakan status", "経済"]
      ]
    },

    "始": {
      romaji: "Shi",
      meaning: "Mulai, memulai, awal",
      bushuu: "女（おんな・おんなへん）",
      onyomi: "シ",
      kunyomi: "（はじ）まる、（はじ）める",
      baseMeaning: "Titik awal dari suatu tindakan, kegiatan, keadaan, atau periode waktu.",
      border: "border-l-4 border-secondary",
      categories: [
        {
          name: "Awal Waktu",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan awal suatu rentang waktu.",
          color: "border-green-500",
          jukugos: [
            {
              word: "年始",
              reading: "ねんし",
              meaning: "awal tahun",
              explanation: "Hubungan makna antara kanji 年 dan 始 menjadi 年始, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “awal suatu tahun.”",
              charRoles: { "年": "tahun", "始": "awal, mulai" }
            }
          ]
        },
        {
          name: "Mulai / Mengawali",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan dimulainya suatu kegiatan, pekerjaan, atau gerakan.",
          color: "border-blue-500",
          jukugos: [
            {
              word: "開始",
              reading: "かいし",
              meaning: "mulai",
              explanation: "Hubungan makna antara kanji 開 dan 始 menjadi 開始, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memulai atau membuka dimulainya suatu kegiatan.”",
              charRoles: { "開": "membuka", "始": "mulai" }
            },
            {
              word: "始業",
              reading: "しぎょう",
              meaning: "mulai bekerja",
              explanation: "Hubungan makna antara kanji 始 dan 業 menjadi 始業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mulainya suatu pekerjaan atau kegiatan.”",
              charRoles: { "始": "mulai", "業": "pekerjaan, kegiatan" }
            },
            {
              word: "始動",
              reading: "しどう",
              meaning: "mulai bergerak",
              explanation: "Hubungan makna antara kanji 始 dan 動 menjadi 始動, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mulai bergerak atau mulai beroperasi.”",
              charRoles: { "始": "mulai", "動": "bergerak" }
            }
          ]
        },
        {
          name: "Awal dan Akhir",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan keseluruhan rentang suatu keadaan dari awal hingga akhir.",
          color: "border-orange-500",
          jukugos: [
            {
              word: "終始",
              reading: "しゅうし",
              meaning: "dari awal sampai akhir",
              explanation: "Hubungan makna antara kanji 終 dan 始 menjadi 終始, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keadaan yang berlangsung dari awal sampai akhir.”",
              charRoles: { "終": "akhir", "始": "awal" }
            },
            {
              word: "始終",
              reading: "しじゅう",
              meaning: "selalu",
              explanation: "Hubungan makna antara kanji 始 dan 終 menjadi 始終, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sesuatu yang berlangsung terus dari awal sampai akhir, sehingga bermakna selalu.”",
              charRoles: { "始": "awal", "終": "akhir" }
            }
          ]
        },
        {
          name: "Penyelesaian",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan penanganan suatu urusan sampai pada bagian akhirnya.",
          color: "border-purple-500",
          jukugos: [
            {
              word: "始末",
              reading: "しまつ",
              meaning: "penyelesaian",
              explanation: "Hubungan makna antara kanji 始 dan 末 menjadi 始末, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menangani suatu urusan sampai selesai.”",
              charRoles: { "始": "awal", "末": "akhir" }
            }
          ]
        }
      ],
      examples: [
        {
          japanese: "明日の 試合は 10時に 開始するでしょう。",
          romaji: "Ashita no shiai wa juuji ni kaishi suru deshou.",
          translation: "Pertandingan besok mungkin akan dimulai pada pukul 10."
        },
        {
          japanese: "年始の 準備を して おきます。",
          romaji: "Nenshi no junbi wo shite okimasu.",
          translation: "Saya mempersiapkan keperluan awal tahun terlebih dahulu."
        },
        {
          japanese: "新しい 機械が 始動されました。",
          romaji: "Atarashii kikai ga shidou saremashita.",
          translation: "Mesin baru telah mulai dioperasikan / dijalankan."
        },
        {
          japanese: "始業時間の 前に 準備を します。",
          romaji: "Shigyou jikan no mae ni junbi wo shimasu.",
          translation: "Saya melakukan persiapan sebelum jam mulai bekerja."
        },
        {
          japanese: "終始 笑顔で 話すのは 大切です。",
          romaji: "Shuushi egao de hanasu no wa taisetsu desu.",
          translation: "Sangat penting untuk berbicara sambil tersenyum dari awal hingga akhir."
        }
      ],
      reflections: [
        "Apa makna dasar kanji 始 yang anda pahami?",
        "Jukugo mana yang mudah untuk di ingat? Mengapa?",
        "Apa perbedaan penggunaan 終始、開始 dan 年始?",
        "Cabang semantic graph mana yang menurut anda paling mudah dipahami?",
        "Bagaimana cara anda mengingat hubungan makna antar jukugo yang mengandung kanji 始?"
      ],
      quizzes: [
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar:\n書いてあります ・ 開始時間が ・ ポスターに",
          words: ["ポスターに", "開始時間が", "書いてあります。"],
          correctOrder: ["ポスターに", "開始時間が", "書いてあります。"],
          explanation: "Jawaban tepat: ポスターに開始時間が書いてあります。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar:\n変わるかもしれません ・ 明日 ・ 始業時間が",
          words: ["明日", "始業時間が", "変わるかもしれません。"],
          correctOrder: ["明日", "始業時間が", "変わるかもしれません。"],
          explanation: "Jawaban tepat: 明日始業時間が変わるかもしれません。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar:\n始動できるように ・ 準備します ・ すぐに",
          words: ["すぐに", "始動できるように", "準備します。"],
          correctOrder: ["すぐに", "始動できるように", "準備します。"],
          explanation: "Jawaban tepat: すぐに始動できるように準備します。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar:\n年始に ・ んです ・ 実家へ ・ 帰る",
          words: ["年始に", "実家へ", "帰るんです。"],
          correctOrder: ["年始に", "実家へ", "帰るんです。"],
          explanation: "Jawaban tepat: 年始に実家へ帰るんです。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar:\n書類を ・ 始末した ・ 早く ・ ほうが ・ いいです",
          words: ["早く", "書類を", "始末した", "ほうが", "いいです。"],
          correctOrder: ["早く", "書類を", "始末した", "ほうが", "いいです。"],
          explanation: "Jawaban tepat: 早く書類を始末したほうがいいです。"
        },
        {
          type: "grouping",
          question: "Kelompokkan jukugo kanji 始 berikut ini kedalam semantic graph yang tepat.",
          words: ["始動", "年始", "始末", "終始", "開始", "始終", "始業"],
          groups: [
            { "Awal": ["年始"] },
            { "Mulai": ["開始", "始業", "始動"] },
            { "Awal-Akhir": ["終始", "始終"] },
            { "Penyelesaian": ["始末"] }
          ],
          explanation: "Pengelompokan jukugo berdasarkan cabang semantic graph kanji 始."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “awal suatu tahun”?",
          options: ["年末", "始業", "年始"],
          correctAnswer: 2,
          explanation: "Jawaban tepat: c. 年始 (nenshi / awal tahun)."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “memulai atau membuka dimulainya suatu kegiatan”?",
          options: ["開始", "始動", "始業"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: a. 開始 (kaishi / mulai)."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “mulainya suatu pekerjaan atau kegiatan”?",
          options: ["開始", "始動", "始業"],
          correctAnswer: 2,
          explanation: "Jawaban tepat: c. 始業 (shigyou / mulai bekerja)."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “mulai bergerak atau mulai beroperasi”?",
          options: ["始終", "始動", "開始"],
          correctAnswer: 1,
          explanation: "Jawaban tepat: b. 始動 (shidou / mulai bergerak)."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “keadaan yang berlangsung dari awal sampai akhir”?",
          options: ["終始", "始終", "始末"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: a. 終始 (shuushi / dari awal sampai akhir)."
        },
        {
          type: "fill",
          question: "新しい学期は4月から（　　）します。",
          options: ["開始", "始終", "始末"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: a. 開始 (kaishi / mulai)."
        },
        {
          type: "fill",
          question: "仕事を（　　）する前に、準備をしておいたほうがいいです。",
          options: ["始業", "始動", "年始"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: a. 始業 (shigyou / mulai bekerja)."
        },
        {
          type: "fill",
          question: "このボタンを押すと、すぐに（　　）します。",
          options: ["始終", "始動", "始末"],
          correctAnswer: 1,
          explanation: "Jawaban tepat: b. 始動 (shidou / mulai bergerak)."
        },
        {
          type: "fill",
          question: "（　　）には、家族にあいさつをするようにしています。",
          options: ["始業", "開始", "年始"],
          correctAnswer: 2,
          explanation: "Jawaban tepat: c. 年始 (nenshi / awal tahun)."
        },
        {
          type: "fill",
          question: "朝から夜まで（　　）忙しくて、休む時間がありませんでした。",
          options: ["始終", "始動", "年始"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: a. 始終 (shijuu / selalu)."
        }
      ],
      crossLinks: [
        ["開始", "dimulai pada", "始業"],
        ["始動", "memicu", "開始"],
        ["終始", "berlawanan dengan", "始終"],
        ["始末", "berujung pada", "完了"],
        ["年始", "berhubungan dengan", "正月"]
      ]
    },

    "歴": {
      romaji: "Reki",
      meaning: "Riwayat, rekam jejak, melalui, melewati",
      bushuu: "止（とめへん） / 厂（がんだれ）",
      onyomi: "レキ",
      kunyomi: "-",
      baseMeaning: "Urutan peristiwa, pengalaman, atau perjalanan waktu yang telah dilalui secara berurutan.",
      border: "border-l-4 border-tertiary",
      categories: [
        {
          name: "Riwayat Pendidikan / Pekerjaan",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan riwayat atau perjalanan seseorang dalam pendidikan dan pekerjaan.",
          color: "border-purple-500",
          jukugos: [
            {
              word: "学歴",
              reading: "がくれき",
              meaning: "riwayat pendidikan",
              explanation: "Hubungan makna antara kanji 学 dan 歴 menjadi 学歴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “riwayat pendidikan yang telah ditempuh.”",
              charRoles: { "学": "belajar, pendidikan", "歴": "riwayat, perjalanan yang telah dilalui" }
            },
            {
              word: "職歴",
              reading: "しょくれき",
              meaning: "riwayat pekerjaan",
              explanation: "Hubungan makna antara kanji 職 dan 歴 menjadi 職歴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “riwayat pekerjaan yang telah dijalani.”",
              charRoles: { "職": "pekerjaan, jabatan", "歴": "riwayat, perjalanan yang telah dilalui" }
            },
            {
              word: "経歴",
              reading: "けいれき",
              meaning: "riwayat hidup / karier",
              explanation: "Hubungan makna antara kanji 経 dan 歴 menjadi 経歴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “riwayat atau perjalanan hidup dan karier yang telah dilalui.”",
              charRoles: { "経": "melalui, menjalani", "歴": "riwayat, perjalanan yang telah dilalui" }
            }
          ]
        },
        {
          name: "Riwayat Kehidupan",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan catatan atau perjalanan suatu keadaan yang telah terjadi sebelumnya.",
          color: "border-green-500",
          jukugos: [
            {
              word: "前歴",
              reading: "ぜんれき",
              meaning: "riwayat sebelumnya",
              explanation: "Hubungan makna antara kanji 前 dan 歴 menjadi 前歴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “riwayat yang terjadi atau dimiliki sebelumnya.”",
              charRoles: { "前": "sebelumnya", "歴": "riwayat" }
            },
            {
              word: "病歴",
              reading: "びょうれき",
              meaning: "riwayat penyakit",
              explanation: "Hubungan makna antara kanji 病 dan 歴 menjadi 病歴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “riwayat penyakit yang pernah dialami.”",
              charRoles: { "病": "penyakit", "歴": "riwayat" }
            },
            {
              word: "来歴",
              reading: "らいれき",
              meaning: "asal-usul / riwayat",
              explanation: "Hubungan makna antara kanji 来 dan 歴 menjadi 来歴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “asal-usul atau perjalanan suatu hal hingga sampai pada keadaan sekarang.”",
              charRoles: { "来": "datang, asal", "歴": "riwayat, perjalanan" }
            }
          ]
        },
        {
          name: "Sejarah / Perjalanan Waktu",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan perjalanan suatu masa dan peristiwa yang telah berlangsung dari waktu ke waktu.",
          color: "border-blue-500",
          jukugos: [
            {
              word: "歴史",
              reading: "れきし",
              meaning: "sejarah",
              explanation: "Hubungan makna antara kanji 歴 dan 史 menjadi 歴史, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sejarah atau catatan mengenai peristiwa yang telah berlangsung pada masa lalu.”",
              charRoles: { "歴": "melewati, riwayat", "史": "sejarah, catatan" }
            },
            {
              word: "歴代",
              reading: "れくだい",
              meaning: "dari generasi ke generasi",
              explanation: "Hubungan makna antara kanji 歴 dan 代 menjadi 歴代, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pergantian atau keberlangsungan dari satu generasi atau masa ke generasi berikutnya.”",
              charRoles: { "歴": "melewati masa", "代": "generasi, masa" }
            },
            {
              word: "歴年",
              reading: "れきねん",
              meaning: "bertahun-tahun",
              explanation: "Hubungan makna antara kanji 歴 dan 年 menjadi 歴年, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “rentang waktu yang telah berlangsung selama bertahun-tahun.”",
              charRoles: { "歴": "melewati", "年": "tahun" }
            }
          ]
        }
      ],
      examples: [
        {
          japanese: "学歴を 気に するのは 良くないです。",
          romaji: "Gakureki wo ki ni suru no wa yokunai desu.",
          translation: "Mempermasalahkan riwayat pendidikan itu tidak baik."
        },
        {
          japanese: "医者に 自分の 病歴を 話した ほうが いいです。",
          romaji: "Isha ni jibun no byoureki wo hanashita hou ga ii desu.",
          translation: "Lebih baik membicarakan riwayat penyakit Anda kepada dokter."
        },
        {
          japanese: "あの 人は 前歴が あるかもしれません。",
          romaji: "Ano hito wa zenreki ga aru kamo shiremasen.",
          translation: "Orang itu mungkin memiliki riwayat sebelumnya."
        },
        {
          japanese: "大学で 日本の 歴史を 勉強しようと 思っています。",
          romaji: "Daigaku de Nihon no rekishi wo benkyou shiyou to omotte imasu.",
          translation: "Saya berpikir untuk mempelajari sejarah Jepang di universitas."
        },
        {
          japanese: "歴代の 社長の写真が 飾られています。",
          romaji: "Rekidai no shachou no shashin ga kazararete imasu.",
          translation: "Foto-foto direktur dari generasi ke generasi dipajang."
        }
      ],
      reflections: [
        "Apa makna dasar kanji 歴 yang Anda pahami?",
        "Jukugo mana yang mudah untuk diingat? Mengapa?",
        "Apa perbedaan penggunaan 学歴, 病歴, dan 職歴?",
        "Cabang semantic graph mana yang menurut Anda paling mudah dipahami?",
        "Bagaimana cara Anda mengingat hubungan makna antar jukugo yang mengandung kanji 歴?"
      ],
      quizzes: [
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut menjadi kalimat yang tepat:\n① 調べておきます ・ 来歴を ・ 事前に ・ 商品の",
          words: ["事前に", "商品の", "来歴を", "調べておきます。"],
          correctOrder: ["事前に", "商品の", "来歴を", "調べておきます。"],
          explanation: "Jawaban tepat: 事前に商品の来歴を調べておきます。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut menjadi kalimat yang tepat:\n② 歴年 ・ 研究するのは ・ 大変です ・ データを",
          words: ["歴年", "データを", "研究するのは", "大変です。"],
          correctOrder: ["歴年", "データを", "研究するのは", "大変です。"],
          explanation: "Jawaban tepat: 歴年データを研究するのは大変です。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut menjadi kalimat yang tepat:\n③ 前歴が ・ 分かるでしょう ・ 調べれば",
          words: ["調べれば", "前歴が", "分かるでしょう。"],
          correctOrder: ["調べれば", "前歴が", "分かるでしょう。"],
          explanation: "Jawaban tepat: 調べれば前歴が分かるでしょう。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut menjadi kalimat yang tepat:\n④ 質問されたんです ・ 病歴を ・ 病院で",
          words: ["病院で", "病歴を", "質問されたんです。"],
          correctOrder: ["病院で", "病歴を", "質問されたんです。"],
          explanation: "Jawaban tepat: 病院で病歴を質問されたんです。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut menjadi kalimat yang tepat:\n⑤ 歴史を ・ 好きです ・ 調べるのが",
          words: ["歴史を", "調べるのが", "好きです。"],
          correctOrder: ["歴史を", "調べるのが", "好きです。"],
          explanation: "Jawaban tepat: 歴史を調べるのが好きです。"
        },
        {
          type: "grouping",
          question: "Kelompokkan jukugo berikut ini ke dalam semantic graph yang sesuai.",
          words: ["歴代", "病歴", "学歴", "来歴", "歴史", "職歴", "歴年", "前歴", "経歴"],
          groups: [
            { "Riwayat pendidikan / pekerjaan / karier": ["学歴", "職歴", "経歴"] },
            { "Riwayat kehidupan / latar belakang": ["病歴", "前歴", "来歴"] },
            { "Sejarah / perjalanan waktu": ["歴史", "歴代", "歴年"] }
          ],
          explanation: "Pengelompokan jukugo berdasarkan hubungan makna kanji 歴 dengan kanji pasangannya."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “riwayat pendidikan yang telah ditempuh”?",
          options: ["学歴", "職歴", "経歴"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: 学歴 (gakureki / riwayat pendidikan)."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “riwayat pekerjaan yang telah dijalani”?",
          options: ["学歴", "来歴", "職歴"],
          correctAnswer: 2,
          explanation: "Jawaban tepat: 職歴 (shokureki / riwayat pekerjaan)."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “riwayat atau perjalanan hidup dan karier yang telah dilalui”?",
          options: ["学歴", "経歴", "職歴"],
          correctAnswer: 1,
          explanation: "Jawaban tepat: 経歴 (keireki / riwayat karier)."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “riwayat penyakit yang pernah dialami”?",
          options: ["前歴", "経歴", "病歴"],
          correctAnswer: 2,
          explanation: "Jawaban tepat: 病歴 (byoureki / riwayat penyakit)."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “riwayat yang terjadi atau dimiliki sebelumnya”?",
          options: ["前歴", "病歴", "来歴"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: 前歴 (zenreki / riwayat sebelumnya)."
        },
        {
          type: "fill",
          question: "大学を卒業したあとで、自分の（　　）について説明しました。",
          options: ["学歴", "病歴", "歴代"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: 学歴 (gakureki / riwayat pendidikan)."
        },
        {
          type: "fill",
          question: "日本へ来る前の仕事の（　　）を先生に話しました。",
          options: ["病歴", "経歴", "歴代"],
          correctAnswer: 1,
          explanation: "Jawaban tepat: 経歴 (keireki / riwayat karier)."
        },
        {
          type: "fill",
          question: "この古い建物の（　　）を調べるために、図書館へ行きました。",
          options: ["来歴", "職歴", "歴代"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: 来歴 (raireki / asal-usul/riwayat bangungan)."
        },
        {
          type: "fill",
          question: "病院へ行ったので、医者に（　　）を聞かれました。",
          options: ["病歴", "来歴", "歴年"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: 病歴 (byoureki / riwayat penyakit)."
        },
        {
          type: "fill",
          question: "日本の（　　）を勉強すると、昔の生活がよく分かるようになります。",
          options: ["歴史", "歴年", "学歴"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: 歴史 (rekishi / sejarah)."
        }
      ],
      crossLinks: [
        ["学歴", "dicatat bersama", "職歴"],
        ["職歴", "merupakan bagian dari", "経歴"],
        ["病歴", "dicatat dalam", "診察"],
        ["歴史", "terdiri dari masa", "歴代"],
        ["歴代", "berlangsung selama", "歴年"]
      ]
    },

    "史": {
      romaji: "Shi",
      meaning: "Sejarah, catatan peristiwa, dokumen tertulis",
      bushuu: "口（くち）",
      onyomi: "シ",
      kunyomi: "-",
      baseMeaning: "Catatan tertulis mengenai kejadian atau peristiwa fakta di masa lalu yang disusun secara teratur.",
      border: "border-l-4 border-primary",
      categories: [
        {
          name: "Masa / Sejarah",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan sejarah dan masa yang mendahului atau menjadi bagian dari sejarah.",
          color: "border-blue-500",
          jukugos: [
            {
              word: "歴史",
              reading: "れきし",
              meaning: "sejarah",
              explanation: "Hubungan makna antara kanji 歴 dan 史 menjadi 歴史, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sejarah atau catatan mengenai peristiwa yang telah berlangsung pada masa lalu.”",
              charRoles: { "歴": "melewati, riwayat", "史": "sejarah, catatan" }
            },
            {
              word: "先史",
              reading: "せんし",
              meaning: "prasejarah",
              explanation: "Hubungan makna antara kanji 先 dan 史 menjadi 先史, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “masa sebelum sejarah tertulis.”",
              charRoles: { "先": "sebelum, terdahulu", "史": "sejarah" }
            },
            {
              word: "前史",
              reading: "ぜんし",
              meaning: "sejarah sebelumnya",
              explanation: "Hubungan makna antara kanji 前 dan 史 menjadi 前史, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sejarah atau latar belakang yang terjadi sebelum suatu peristiwa atau masa tertentu.”",
              charRoles: { "前": "sebelumnya", "史": "sejarah" }
            }
          ]
        },
        {
          name: "Fakta / Sumber Sejarah",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan fakta dan bahan yang digunakan untuk mengetahui atau mempelajari sejarah.",
          color: "border-green-500",
          jukugos: [
            {
              word: "史実",
              reading: "しじつ",
              meaning: "fakta sejarah",
              explanation: "Hubungan makna antara kanji 史 dan 実 menjadi 史実, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “fakta atau kenyataan yang benar-benar terjadi dalam sejarah.”",
              charRoles: { "史": "sejarah", "実": "kenyataan, fakta" }
            },
            {
              word: "史料",
              reading: "しりょう",
              meaning: "bahan sejarah",
              explanation: "Hubungan makna antara kanji 史 dan 料 menjadi 史料, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bahan atau sumber yang digunakan untuk mempelajari sejarah.”",
              charRoles: { "史": "sejarah", "料": "bahan" }
            }
          ]
        },
        {
          name: "Jenis / Sifat Sejarah",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan sifat atau jenis catatan sejarah.",
          color: "border-orange-500",
          jukugos: [
            {
              word: "正史",
              reading: "せいし",
              meaning: "sejarah resmi",
              explanation: "Hubungan makna antara kanji 正 dan 史 menjadi 正史, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sejarah yang dicatat atau diakui sebagai sejarah resmi.”",
              charRoles: { "正": "benar, resmi", "史": "sejarah" }
            },
            {
              word: "秘史",
              reading: "ひし",
              meaning: "sejarah rahasia",
              explanation: "Hubungan makna antara kanji 秘 dan 史 menjadi 秘史, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sejarah atau peristiwa masa lalu yang bersifat rahasia.”",
              charRoles: { "秘": "rahasia", "史": "sejarah" }
            }
          ]
        },
        {
          name: "Dalam Sejarah",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan sesuatu yang terjadi atau dikenal dalam perjalanan sejarah.",
          color: "border-purple-500",
          jukugos: [
            {
              word: "史上",
              reading: "しじょう",
              meaning: "dalam sejarah",
              explanation: "Hubungan makna antara kanji 史 dan 上 menjadi 史上, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sesuatu yang terjadi atau dikenal dalam sejarah.”",
              charRoles: { "史": "sejarah", "上": "di dalam, pada" }
            }
          ]
        }
      ],
      examples: [
        {
          japanese: "古い 歴史を 調べるのが 好きです。",
          romaji: "Furui rekishi wo shiraberu no ga suki desu.",
          translation: "Saya suka mempelajari sejarah tua."
        },
        {
          japanese: "図書館に 大事な 史料が 集めてあります。",
          romaji: "Toshokan ni daiji na shiryou ga atsumete arimasu.",
          translation: "Bahan/dokumen sejarah penting telah dikumpulkan di perpustakaan."
        },
        {
          japanese: "先史時代の 生活は 面白いでしょう。",
          romaji: "Senshi jidai no seikatsu wa omoshiroi deshou.",
          translation: "Kehidupan di zaman prasejarah mungkin menarik."
        },
        {
          japanese: "昔の 秘史について 調べているんです。",
          romaji: "Mukashi no hishi ni tsuite shirabete iru n desu.",
          translation: "Saya sedang menyelidiki sejarah rahasia masa lalu."
        },
        {
          japanese: "これは 史上 最大の ニュースかもしれません。",
          romaji: "Kore wa shijou saidai no nyuusu kamo shiremasen.",
          translation: "Ini mungkin berita terbesar dalam sejarah."
        }
      ],
      reflections: [
        "Apa makna dasar kanji 史 yang Anda pahami?",
        "Jukugo 史 mana yang mudah untuk diingat? Mengapa?",
        "Apa perbedaan penggunaan 前史, 秘史, dan 歴史?",
        "Cabang semantic graph mana yang menurut Anda paling mudah dipahami?",
        "Bagaimana cara Anda mengingat hubungan makna antar jukugo yang mengandung kanji 史?"
      ],
      quizzes: [
        {
          type: "unscramble",
          question: "Susunlah kata-kata dibawah ini menjadi kalimat yang tepat:\n1. 前史を ・ 思っています ・ 調べようと ・ 事件の",
          words: ["事件の", "前史を", "調べようと", "思っています。"],
          correctOrder: ["事件の", "前史を", "調べようと", "思っています。"],
          explanation: "Jawaban tepat: 事件の前史を調べようと思っています。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata dibawah ini menjadi kalimat yang tepat:\n2. 歴史を ・ 勉強します ・ 理解できるように",
          words: ["理解できるように", "歴史を", "勉強します。"],
          correctOrder: ["理解できるように", "歴史を", "勉強します。"],
          explanation: "Jawaban tepat: 理解できるように歴史を勉強します。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata dibawah ini menjadi kalimat yang tepat:\n3. 史実を ・ ほうが ・ 調べた ・ いいです",
          words: ["史実を", "調べた", "ほうが", "いいです。"],
          correctOrder: ["史実を", "調べた", "ほうが", "いいです。"],
          explanation: "Jawaban tepat: 史実を調べたほうがいいです。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata dibawah ini menjadi kalimat yang tepat:\n4. 史料を ・ 難しいです ・ 読むのは ・ 古い",
          words: ["古い", "史料を", "読むのは", "難しいです。"],
          correctOrder: ["古い", "史料を", "読むのは", "難しいです。"],
          explanation: "Jawaban tepat: 古い史料を読むのは難しいです。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata dibawah ini menjadi kalimat yang tepat:\n5. 正史が ・ 本に ・ 書いてあります",
          words: ["本に", "正史が", "書いてあります。"],
          correctOrder: ["本に", "正史が", "書いてあります。"],
          explanation: "Jawaban tepat: 本に正史が書いてあります。"
        },
        {
          type: "grouping",
          question: "Kelompokkan jukugo berikut ini kedalam semantic graph yang sesuai.",
          words: ["秘史", "史上", "歴史", "史料", "前史", "正史", "先史", "史実"],
          groups: [
            { "Sejarah": ["歴史"] },
            { "Fakta": ["史実"] },
            { "Sumber": ["史料"] },
            { "Jenis Sejarah": ["正史", "前史", "先史", "秘史"] },
            { "Dalam Sejarah": ["史上"] }
          ],
          explanation: "Pengelompokan jukugo berdasarkan hubungan makna kanji 史."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “sejarah atau catatan mengenai peristiwa yang telah berlangsung pada masa lalu”?",
          options: ["歴史", "先史", "前史"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: 歴史 (rekishi / sejarah)."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “masa sebelum sejarah tertulis”?",
          options: ["前史", "史上", "先史"],
          correctAnswer: 2,
          explanation: "Jawaban tepat: 先史 (senshi / prasejarah)."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “riwayat pendidikan yang telah ditempuh”?",
          options: ["職歴", "学歴", "経歴"],
          correctAnswer: 1,
          explanation: "Jawaban tepat: 学歴 (gakureki / riwayat pendidikan)."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “fakta atau kenyataan yang benar-benar terjadi dalam sejarah”?",
          options: ["史実", "史料", "正史"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: 史実 (shijitsu / fakta sejarah)."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “bahan atau sumber yang digunakan untuk mempelajari sejarah”?",
          options: ["史実", "秘史", "史料"],
          correctAnswer: 2,
          explanation: "Jawaban tepat: 史料 (shiryou / bahan/sumber sejarah)."
        },
        {
          type: "fill",
          question: "日本の（　　）を勉強すると、昔のことがよく分かるようになります。",
          options: ["歴史", "史料", "史実"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: 歴史 (rekishi / sejarah)."
        },
        {
          type: "fill",
          question: "文字が使われる前の時代を（　　）といいます。",
          options: ["正史", "前史", "先史"],
          correctAnswer: 2,
          explanation: "Jawaban tepat: 先史 (senshi / prasejarah)."
        },
        {
          type: "fill",
          question: "この出来事が本当の（　　）かどうか、調べてください。",
          options: ["前史", "史実", "史上"],
          correctAnswer: 1,
          explanation: "Jawaban tepat: 史実 (shijitsu / fakta sejarah)."
        },
        {
          type: "fill",
          question: "昔の文書や記録などの（　　）を使って、歴史を研究します。",
          options: ["史実", "歴史", "史料"],
          correctAnswer: 2,
          explanation: "Jawaban tepat: 史料 (shiryou / bahan/sumber sejarah)."
        },
        {
          type: "fill",
          question: "教科書に書かれていることが、全部（　　）とは限りません。",
          options: ["正史", "史実", "先史"],
          correctAnswer: 1,
          explanation: "Jawaban tepat: 史実 (shijitsu / fakta sejarah)."
        }
      ],
      crossLinks: [
        ["歴史", "berawal dari", "先史"],
        ["史実", "dibuktikan oleh", "史料"],
        ["正史", "berlawanan dengan", "秘史"],
        ["歴史", "mencatat peristiwa", "史上"],
        ["史料", "menjadi sumber", "歴史"]
      ]
    },

    "期": {
      romaji: "Ki / Go",
      meaning: "Periode, jangka waktu, batas waktu, harapan",
      bushuu: "月（つき・つきへん）",
      onyomi: "キ、ゴ",
      kunyomi: "-",
      baseMeaning: "Batasan rentang waktu tertentu, tahap/fase perkembangan, atau tanggal yang disepakati.",
      border: "border-l-4 border-secondary",
      categories: [
        {
          name: "Waktu / Periode",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan waktu, rentang waktu, jangka waktu, atau periode tertentu.",
          color: "border-blue-500",
          jukugos: [
            {
              word: "時期",
              reading: "じき",
              meaning: "waktu / periode",
              explanation: "Hubungan makna antara kanji 時 dan 期 menjadi 時期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “waktu atau periode tertentu.”",
              charRoles: { "時": "waktu", "期": "periode, masa yang ditentukan" }
            },
            {
              word: "期間",
              reading: "きかん",
              meaning: "jangka waktu",
              explanation: "Hubungan makna antara kanji 期 dan 間 menjadi 期間, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “jangka atau rentang waktu.”",
              charRoles: { "期": "periode", "間": "jarak, rentang" }
            },
            {
              word: "長期",
              reading: "ちょうき",
              meaning: "jangka panjang",
              explanation: "Hubungan makna antara kanji 長 dan 期 menjadi 長期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “periode atau jangka waktu yang panjang.”",
              charRoles: { "長": "panjang", "期": "periode" }
            },
            {
              word: "短期",
              reading: "たんき",
              meaning: "jangka pendek",
              explanation: "Hubungan makna antara kanji 短 dan 期 menjadi 短期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “periode atau jangka waktu yang pendek.”",
              charRoles: { "短": "pendek", "期": "periode" }
            },
            {
              word: "定期",
              reading: "ていき",
              meaning: "berkala",
              explanation: "Hubungan makna antara kanji 定 dan 期 menjadi 定期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sesuatu yang berlangsung pada periode yang telah ditentukan atau secara berkala.”",
              charRoles: { "定": "tetap, menentukan", "期": "periode" }
            },
            {
              word: "周期",
              reading: "しゅうき",
              meaning: "siklus",
              explanation: "Hubungan makna antara kanji 周 dan 期 menjadi 周期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “periode yang berulang secara teratur sehingga membentuk suatu siklus.”",
              charRoles: { "周": "berputar, mengelilingi", "期": "periode" }
            },
            {
              word: "学期",
              reading: "がっき",
              meaning: "semester",
              explanation: "Hubungan makna antara kanji 学 dan 期 menjadi 学期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “periode tertentu dalam kegiatan pendidikan atau semester.”",
              charRoles: { "学": "belajar, pendidikan", "期": "periode" }
            },
            {
              word: "会期",
              reading: "かいき",
              meaning: "masa sidang",
              explanation: "Hubungan makna antara kanji 会 dan 期 menjadi 会期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “periode atau masa berlangsungnya suatu sidang.”",
              charRoles: { "会": "pertemuan, sidang", "期": "periode" }
            }
          ]
        },
        {
          name: "Tahap Waktu",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan bagian atau tahap tertentu dalam suatu periode.",
          color: "border-green-500",
          jukugos: [
            {
              word: "初期",
              reading: "しょき",
              meaning: "tahap awal",
              explanation: "Hubungan makna antara kanji 初 dan 期 menjadi 初期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “periode atau tahap awal.”",
              charRoles: { "初": "awal, pertama", "期": "periode" }
            },
            {
              word: "前期",
              reading: "ぜんき",
              meaning: "periode awal",
              explanation: "Hubungan makna antara kanji 前 dan 期 menjadi 前期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “periode sebelumnya atau bagian awal dari suatu rangkaian periode.”",
              charRoles: { "前": "sebelum, awal", "期": "periode" }
            },
            {
              word: "後期",
              reading: "こうき",
              meaning: "periode akhir",
              explanation: "Hubungan makna antara kanji 後 dan 期 menjadi 後期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “periode setelahnya atau bagian akhir dari suatu rangkaian periode.”",
              charRoles: { "後": "sesudah, akhir", "期": "periode" }
            },
            {
              word: "早期",
              reading: "そうき",
              meaning: "tahap awal",
              explanation: "Hubungan makna antara kanji 早 dan 期 menjadi 早期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “periode atau tahap yang masih awal.”",
              charRoles: { "早": "awal, cepat", "期": "periode" }
            },
            {
              word: "期首",
              reading: "きしゅ",
              meaning: "awal periode",
              explanation: "Hubungan makna antara kanji 期 dan 首 menjadi 期首, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bagian awal dari suatu periode.”",
              charRoles: { "期": "periode", "首": "awal, bagian depan" }
            },
            {
              word: "期末",
              reading: "きまつ",
              meaning: "akhir periode",
              explanation: "Hubungan makna antara kanji 期 dan 末 menjadi 期末, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bagian akhir dari suatu periode.”",
              charRoles: { "期": "periode", "末": "akhir" }
            },
            {
              word: "末期",
              reading: "まっき",
              meaning: "tahap akhir",
              explanation: "Hubungan makna antara kanji 末 dan 期 menjadi 末期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “periode atau tahap yang berada pada bagian akhir.”",
              charRoles: { "末": "akhir", "期": "periode" }
            }
          ]
        },
        {
          name: "Batas Waktu",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan waktu yang telah ditentukan, batas penyerahan, penundaan, atau berakhirnya suatu periode.",
          color: "border-orange-500",
          jukugos: [
            {
              word: "期限",
              reading: "きげん",
              meaning: "batas waktu",
              explanation: "Hubungan makna antara kanji 期 dan 限 menjadi 期限, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “batas waktu yang telah ditentukan.”",
              charRoles: { "期": "periode, waktu yang ditentukan", "限": "batas" }
            },
            {
              word: "期日",
              reading: "きじつ",
              meaning: "tanggal yang ditentukan",
              explanation: "Hubungan makna antara kanji 期 dan 日 menjadi 期日, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “hari atau tanggal yang telah ditentukan.”",
              charRoles: { "期": "waktu yang ditentukan", "日": "hari, tanggal" }
            },
            {
              word: "納期",
              reading: "のうき",
              meaning: "batas penyerahan",
              explanation: "Hubungan makna antara kanji 納 dan 期 menjadi 納期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “batas waktu yang ditentukan untuk menyerahkan sesuatu.”",
              charRoles: { "納": "menyerahkan, memasukkan", "期": "waktu yang ditentukan" }
            },
            {
              word: "延期",
              reading: "えんき",
              meaning: "penundaan",
              explanation: "Hubungan makna antara kanji 延 dan 期 menjadi 延期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menunda suatu kegiatan atau waktu ke periode yang lebih kemudian.”",
              charRoles: { "延": "memperpanjang, menunda", "期": "periode, waktu yang ditentukan" }
            },
            {
              word: "満期",
              reading: "まんき",
              meaning: "jatuh tempo",
              explanation: "Hubungan makna antara kanji 満 dan 期 menjadi 満期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “berakhirnya periode yang telah ditentukan atau saat jatuh tempo.”",
              charRoles: { "満": "penuh, mencapai", "期": "periode, masa yang ditentukan" }
            }
          ]
        },
        {
          name: "Harapan / Perkiraan",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan sesuatu yang diharapkan atau diperkirakan akan terjadi.",
          color: "border-purple-500",
          jukugos: [
            {
              word: "期待",
              reading: "きたい",
              meaning: "harapan",
              explanation: "Hubungan makna antara kanji 期 dan 待 menjadi 期待, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “harapan terhadap sesuatu yang dinantikan atau diharapkan terjadi.”",
              charRoles: { "期": "mengharapkan", "待": "menunggu" }
            },
            {
              word: "予期",
              reading: "よき",
              meaning: "perkiraan / mengharapkan",
              explanation: "Hubungan makna antara kanji 予 dan 期 menjadi 予期, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memperkirakan atau mengharapkan sesuatu akan terjadi.”",
              charRoles: { "予": "sebelumnya, memperkirakan", "期": "mengharapkan" }
            }
          ]
        }
      ],
      examples: [
        {
          japanese: "テストの 期間を 手帳に 書いて おきます。",
          romaji: "Tesuto no kikan wo techou ni kaite okimasu.",
          translation: "Saya akan mencatat jangka waktu ujian di buku catatan terlebih dahulu."
        },
        {
          japanese: "新しい 学期は 来月 始まるでしょう。",
          romaji: "Atarashii gakki wa raigetsu hajimarudeshou.",
          translation: "Semester baru kemungkinan akan dimulai bulan depan."
        },
        {
          japanese: "いい 時期に 旅行した ほうが いいです。",
          romaji: "Ii jiki ni ryokou shita hou ga ii desu.",
          translation: "Lebih baik melakukan perjalanan di waktu/periode yang baik."
        },
        {
          japanese: "田中さんは 先生に 期待されています。",
          romaji: "Tanaka-san wa sensei ni kitai sarete imasu.",
          translation: "Sdr. Tanaka diharapkan oleh guru."
        },
        {
          japanese: "雨で 試合が 延期に なったんです。",
          romaji: "Ame de shiai ga enki ni natta n desu.",
          translation: "Karena hujan, pertandingan telah ditunda."
        }
      ],
      reflections: [
        "Apa makna dasar kanji 期 yang Anda pahami?",
        "Jukugo mana yang mudah untuk diingat? Mengapa?",
        "Apa perbedaan penggunaan 長期, 短期, dan 期間?",
        "Cabang semantic graph mana yang menurut Anda paling mudah dipahami?",
        "Bagaimana cara Anda mengingat hubungan makna antar jukugo yang mengandung kanji 期?"
      ],
      quizzes: [
        {
          type: "unscramble",
          question: "Susunlah kalimat dari kata-kata berikut:\n1. 思っています・短期留学を ・ と ・ しよう",
          words: ["短期留学を", "しようと", "思っています。"],
          correctOrder: ["短期留学を", "しようと", "思っています。"],
          explanation: "Jawaban tepat: 短期留学をしようと思っています。"
        },
        {
          type: "unscramble",
          question: "Susunlah kalimat dari kata-kata berikut:\n2. たてておきます・前に・長期計画を",
          words: ["前に", "長期計画を", "たてておきます。"],
          correctOrder: ["前に", "長期計画を", "たてておきます。"],
          explanation: "Jawaban tepat: 前に長期計画をたてておきます。"
        },
        {
          type: "unscramble",
          question: "Susunlah kalimat dari kata-kata berikut:\n3. いいです・初期に・ほうが・治した・病気を",
          words: ["初期に", "病気を", "治した", "ほうが", "いいです。"],
          correctOrder: ["初期に", "病気を", "治した", "ほうが", "いいです。"],
          explanation: "Jawaban tepat: 初期に病気を治したほうがいいです。"
        },
        {
          type: "unscramble",
          question: "Susunlah kalimat dari kata-kata berikut:\n4. 期日が・書いてあります・書類に",
          words: ["書類に", "期日が", "書いてあります。"],
          correctOrder: ["書類に", "期日が", "書いてあります。"],
          explanation: "Jawaban tepat: 書類に期日が書いてあります。"
        },
        {
          type: "unscramble",
          question: "Susunlah kalimat dari kata-kata berikut:\n5. 大変・期末テストを・です・受けるのは",
          words: ["期末テストを", "受けるのは", "大変です。"],
          correctOrder: ["期末テストを", "受けるのは", "大変です。"],
          explanation: "Jawaban tepat: 期末テストを受けるのは大変です。"
        },
        {
          type: "grouping",
          question: "Kelompokkan jukugo berikut ini kedalam semantic graph yang sesuai.",
          words: ["時期", "期間", "長期", "定期", "初期", "前期", "後期", "期限", "期日", "満期", "期待", "予期"],
          groups: [
            { "Waktu / Periode": ["時期", "期間", "長期", "定期"] },
            { "Tahap waktu": ["初期", "前期", "後期"] },
            { "Batas Waktu": ["期限", "期日", "満期"] },
            { "Harapan/perkiraan": ["期待", "予期"] }
          ],
          explanation: "Pengelompokan jukugo berdasarkan hubungan makna kanji 期."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “waktu atau periode tertentu”?",
          options: ["定期", "時期", "期間"],
          correctAnswer: 1,
          explanation: "Jawaban tepat: 時期 (jiki / waktu atau periode tertentu)."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “jangka atau rentang waktu”?",
          options: ["期間", "時期", "周期"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: 期間 (kikan / jangka atau rentang waktu)."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “periode atau jangka waktu yang panjang”?",
          options: ["短期", "定期", "長期"],
          correctAnswer: 2,
          explanation: "Jawaban tepat: 長期 (chouki / jangka panjang)."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “periode atau jangka waktu yang pendek”?",
          options: ["初期", "短期", "長期"],
          correctAnswer: 1,
          explanation: "Jawaban tepat: 短期 (tanki / jangka pendek)."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “periode tertentu dalam kegiatan pendidikan atau semester”?",
          options: ["時期", "学期", "会期"],
          correctAnswer: 1,
          explanation: "Jawaban tepat: 学期 (gakki / semester)."
        },
        {
          type: "fill",
          question: "大学の（　　）は4月から始まります。",
          options: ["学期", "長期", "期日"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: 学期 (gakki / semester)."
        },
        {
          type: "fill",
          question: "夏休みは（　　）の旅行をする予定です。",
          options: ["長期", "短期", "定期"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: 長期 (chouki / jangka panjang)."
        },
        {
          type: "fill",
          question: "この仕事は（　　）で終わるでしょう。",
          options: ["周期", "短期", "学期"],
          correctAnswer: 1,
          explanation: "Jawaban tepat: 短期 (tanki / jangka pendek)."
        },
        {
          type: "fill",
          question: "この電車は（　　）に運行されています。",
          options: ["末期", "初期", "定期"],
          correctAnswer: 2,
          explanation: "Jawaban tepat: 定期 (teiki / berkala/teratur)."
        },
        {
          type: "fill",
          question: "日本語の勉強を始めた（　　）は、漢字があまり読めませんでした。",
          options: ["前期", "初期", "後期"],
          correctAnswer: 1,
          explanation: "Jawaban tepat: 初期 (shoki / tahap awal)."
        }
      ],
      crossLinks: [
        ["期間", "terbagi menjadi", "時期"],
        ["長期", "berlawanan dengan", "短期"],
        ["前期", "dilanjutkan oleh", "後期"],
        ["初期", "berkembang ke", "末期"],
        ["期首", "berakhir di", "期末"],
        ["期限", "ditentukan oleh", "期日"],
        ["納期", "jika terhalang menjadi", "延期"],
        ["期待", "berdasarkan", "予期"]
      ]
    }
  };

  // 3. Constituent kanji mapping
  const constituentKanjisInfo: Record<string, { romaji: string; meaning: string; bushuu: string; onyomi: string; kunyomi: string }> = {
    "験": { romaji: "Ken", meaning: "menguji / tes", bushuu: "馬", onyomi: "ケン", kunyomi: "tamesu" },
    "過": { romaji: "Ka", meaning: "melewati / berlebih", bushuu: "⻌", onyomi: "カ", kunyomi: "sugiru" },
    "由": { romaji: "Yuu / Yui", meaning: "asal / alasan", bushuu: "田", onyomi: "ユウ、ユ", kunyomi: "yoshi" },
    "口": { romaji: "Kou / Kuchi", meaning: "mulut", bushuu: "口", onyomi: "コウ、ク", kunyomi: "kuchi" },
    "済": { romaji: "Sai / Sei", meaning: "selesai / menolong", bushuu: "水", onyomi: "サイ、セイ", kunyomi: "sumu" },
    "常": { romaji: "Jou", meaning: "selalu / biasa", bushuu: "巾", onyomi: "ジョウ", kunyomi: "tsune" },
    "理": { romaji: "Ri", meaning: "alasan / mengurus", bushuu: "玉", onyomi: "リ", kunyomi: "kotowari" },
    "費": { romaji: "Hi", meaning: "biaya / pengeluaran", bushuu: "貝", onyomi: "ヒ", kunyomi: "tsuiyasu" },
    "開": { romaji: "Kai", meaning: "membuka", bushuu: "門", onyomi: "カイ", kunyomi: "hiraku" },
    "動": { romaji: "Dou", meaning: "bergerak", bushuu: "力", onyomi: "ドウ", kunyomi: "ugoku" },
    "終": { romaji: "Shuu", meaning: "akhir / selesai", bushuu: "糸", onyomi: "シュウ", kunyomi: "owaru" },
    "末": { romaji: "Matsu", meaning: "akhir / ujung", bushuu: "木", onyomi: "マツ、バツ", kunyomi: "sue" },
    "前": { romaji: "Zen", meaning: "sebelum / depan", bushuu: "刀", onyomi: "ゼン", kunyomi: "mae" },
    "病": { romaji: "Byou", meaning: "sakit / penyakit", bushuu: "疒", onyomi: "ビョウ", kunyomi: "yamai" },
    "来": { romaji: "Rai", meaning: "datang / asal", bushuu: "木", onyomi: "ライ", kunyomi: "kuru" },
    "代": { romaji: "Dai / Tai", meaning: "generasi / mengganti", bushuu: "亻", onyomi: "ダイ、タイ", kunyomi: "kawarudokoro" },
    "先": { romaji: "Sen", meaning: "sebelum / awal", bushuu: "儿", onyomi: "セン", kunyomi: "saki" },
    "上": { romaji: "Jou / Shou", meaning: "atas / di dalam", bushuu: "一", onyomi: "ジョウ", kunyomi: "ue" },
    "間": { romaji: "Kan / Gen", meaning: "rentang / antara", bushuu: "門", onyomi: "カン、ゲン", kunyomi: "aida" },
    "長": { romaji: "Chou", meaning: "panjang / pemimpin", bushuu: "長", onyomi: "チョウ", kunyomi: "nagai" },
    "短": { romaji: "Tan", meaning: "pendek", bushuu: "矢", onyomi: "タン", kunyomi: "mijikai" },
    "定": { romaji: "Tei / Jou", meaning: "tetap / menentukan", bushuu: "宀", onyomi: "テイ、ジョウ", kunyomi: "sadamaru" },
    "周": { romaji: "Shuu", meaning: "sekeliling / siklus", bushuu: "口", onyomi: "シュウ", kunyomi: "mawari" },
    "初": { romaji: "Sho", meaning: "awal / pertama", bushuu: "刀", onyomi: "ショ", kunyomi: "hata" },
    "後": { romaji: "Go / Kou", meaning: "setelah / belakang", bushuu: "⻌", onyomi: "ゴ、コウ", kunyomi: "ushiro" },
    "早": { romaji: "Sou / Sa", meaning: "awal / cepat", bushuu: "日", onyomi: "ソウ", kunyomi: "hayai" },
    "首": { romaji: "Shu", meaning: "kepala / awal", bushuu: "首", onyomi: "シュ", kunyomi: "kubi" },
    "限": { romaji: "Gen", meaning: "batas", bushuu: "阜", onyomi: "ゲン", kunyomi: "kagiru" },
    "日": { romaji: "Nichi / Jitsu", meaning: "hari / tanggal", bushuu: "日", onyomi: "ニチ", kunyomi: "hi" },
    "納": { romaji: "Nou", meaning: "menyerahkan", bushuu: "糸", onyomi: "ノウ", kunyomi: "osameru" },
    "延": { romaji: "En", meaning: "menunda / memperpanjang", bushuu: "廴", onyomi: "エン", kunyomi: "nobiru" },
    "満": { romaji: "Man", meaning: "penuh / jatuh tempo", bushuu: "水", onyomi: "マン", kunyomi: "michiru" },
    "待": { romaji: "Tai", meaning: "menunggu", bushuu: "彳", onyomi: "タイ", kunyomi: "matsu" },
    "予": { romaji: "Yo", meaning: "sebelumnya / menduga", bushuu: "予", onyomi: "ヨ", kunyomi: "arakajime" }
  };

  // Upsert constituent kanji
  for (const [ch, info] of Object.entries(constituentKanjisInfo)) {
    await prisma.kanji.upsert({
      where: { character: ch },
      update: {
        romaji: info.romaji,
        meaning: info.meaning,
        bushuu: info.bushuu,
        onyomi: info.onyomi,
        kunyomi: info.kunyomi,
        baseMeaning: info.meaning,
        isJukugo: false
      },
      create: {
        character: ch,
        romaji: info.romaji,
        meaning: info.meaning,
        bushuu: info.bushuu,
        onyomi: info.onyomi,
        kunyomi: info.kunyomi,
        baseMeaning: info.meaning,
        isJukugo: false,
        moduleId: null
      }
    });
  }

  // 4. Process each of the 5 main kanjis for Module 6
  const mainKanjis = ["経", "始", "歴", "史", "期"];

  for (const char of mainKanjis) {
    const data = kanjiDataMap[char];
    if (!data) continue;

    console.log(`\n📌 Processing main Kanji ${char}...`);

    // Create or update Kanji record
    const kanjiRecord = await prisma.kanji.upsert({
      where: { character: char },
      update: {
        romaji: data.romaji,
        meaning: data.meaning,
        bushuu: data.bushuu,
        onyomi: data.onyomi,
        kunyomi: data.kunyomi,
        baseMeaning: data.baseMeaning,
        border: data.border,
        moduleId: moduleId,
        isJukugo: false
      },
      create: {
        character: char,
        romaji: data.romaji,
        meaning: data.meaning,
        bushuu: data.bushuu,
        onyomi: data.onyomi,
        kunyomi: data.kunyomi,
        baseMeaning: data.baseMeaning,
        border: data.border,
        moduleId: moduleId,
        isJukugo: false
      }
    });

    const kanjiId = kanjiRecord.id;

    // Ensure UserKanjiProgress exists for all users
    for (const user of users) {
      const existingKProgress = await prisma.userKanjiProgress.findUnique({
        where: {
          userId_kanjiId: {
            userId: user.id,
            kanjiId: kanjiId
          }
        }
      });
      if (!existingKProgress) {
        await prisma.userKanjiProgress.create({
          data: {
            userId: user.id,
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

    // Clean existing child records
    await prisma.exampleSentence.deleteMany({ where: { kanjiId } });
    await prisma.masterRefleksi.deleteMany({ where: { kanjiId } });
    await prisma.quiz.deleteMany({ where: { kanjiId } });
    await prisma.kanjiGraphEdge.deleteMany({ where: { kanjiId } });

    // Delete existing SemanticRelations (and cascading nodes)
    const existingSRs = await prisma.semanticRelation.findMany({ where: { kanjiId } });
    for (const sr of existingSRs) {
      await prisma.semanticRelationNode.deleteMany({ where: { semanticId: sr.id } });
    }
    await prisma.semanticRelation.deleteMany({ where: { kanjiId } });

    // Seed Examples
    await prisma.exampleSentence.createMany({
      data: data.examples.map(ex => ({
        kanjiId,
        japanese: ex.japanese,
        romaji: ex.romaji,
        translation: ex.translation,
        isReading: true
      }))
    });

    // Seed MasterRefleksi
    await prisma.masterRefleksi.createMany({
      data: data.reflections.map(q => ({
        kanjiId,
        question: q
      }))
    });

    // Seed Quizzes
    for (const q of data.quizzes) {
      await prisma.quiz.create({
        data: {
          kanjiId,
          type: q.type || "multiple",
          question: q.question,
          options: q.options ? JSON.stringify(q.options) : null,
          correctAnswer: q.correctAnswer !== undefined ? (typeof q.correctAnswer === "object" ? JSON.stringify(q.correctAnswer) : String(q.correctAnswer)) : null,
          words: q.words ? JSON.stringify(q.words) : null,
          correctOrder: q.correctOrder ? JSON.stringify(q.correctOrder) : null,
          groups: q.groups ? JSON.stringify(q.groups) : null,
          explanation: q.explanation || null
        }
      });
    }

    // Seed MasterCategories, Jukugos, KategoriKanji, SemanticRelation & SemanticRelationNode
    for (let catIdx = 0; catIdx < data.categories.length; catIdx++) {
      const cat = data.categories[catIdx];

      // Upsert MasterCategory
      let masterCat = await prisma.masterCategory.findUnique({
        where: { name: cat.name }
      });
      if (!masterCat) {
        masterCat = await prisma.masterCategory.create({
          data: {
            name: cat.name,
            description: cat.description
          }
        });
      }

      for (const jk of cat.jukugos) {
        // Find or create Jukugo
        let dbJukugo = await prisma.jukugo.findFirst({
          where: { kanjiId, word: jk.word }
        });
        if (!dbJukugo) {
          dbJukugo = await prisma.jukugo.create({
            data: {
              kanjiId,
              word: jk.word,
              reading: jk.reading,
              meaning: jk.meaning
            }
          });
        } else {
          dbJukugo = await prisma.jukugo.update({
            where: { id: dbJukugo.id },
            data: {
              reading: jk.reading,
              meaning: jk.meaning
            }
          });
        }

        // Link KategoriKanji
        const existingKategori = await prisma.kategoriKanji.findFirst({
          where: { categoryId: masterCat.id, jokugoId: dbJukugo.id }
        });
        if (!existingKategori) {
          await prisma.kategoriKanji.create({
            data: { categoryId: masterCat.id, jokugoId: dbJukugo.id }
          });
        }

        // Create SemanticRelation
        const createdSR = await prisma.semanticRelation.create({
          data: {
            kanjiId,
            jukugoId: dbJukugo.id,
            penjelasan: jk.explanation
          }
        });

        // Create SemanticRelationNodes
        const nodesData = Object.entries(jk.charRoles).map(([jokugo, arti]) => ({
          semanticId: createdSR.id,
          jokugo,
          arti
        }));
        if (nodesData.length > 0) {
          await prisma.semanticRelationNode.createMany({
            data: nodesData
          });
        }
      }
    }

    // Seed KanjiGraphEdge cross-links
    for (const triple of data.crossLinks) {
      const [source, predicate, target] = triple;
      const edgeId = `cross-${kanjiId}-${source}-${target}`;
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

    console.log(`  ✅ Finished seeding for Kanji ${char}`);
  }

  console.log("\n🎉 Modul 6 (経・始・歴・史・期) successfully seeded into database!");
}

seedModule6()
  .catch(err => {
    console.error("❌ Error seeding Module 6:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
