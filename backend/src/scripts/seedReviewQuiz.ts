import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface QuestionSeed {
  moduleNumber: number;
  section: "A" | "B" | "C" | "D";
  type: "unscramble" | "multiple" | "fill";
  questionNumber: number;
  question: string;
  options?: string[];
  correctAnswer: string;
  words?: string[];
  correctOrder?: string[];
  explanation?: string;
}

const sectionA: QuestionSeed[] = [
  // Modul 1
  {
    moduleNumber: 1,
    section: "A",
    type: "unscramble",
    questionNumber: 1,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["向けて", "勉強しておきます", "来週の試験に"],
    correctOrder: ["来週の試験に", "向けて", "勉強しておきます"],
    correctAnswer: "来週の試験に向けて勉強しておきます。",
  },
  {
    moduleNumber: 1,
    section: "A",
    type: "unscramble",
    questionNumber: 2,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["使う道具を", "理科の実験で", "用意してあります"],
    correctOrder: ["理科の実験で", "使う道具を", "用意してあります"],
    correctAnswer: "理科の実験で使う道具を用意してあります。",
  },
  {
    moduleNumber: 1,
    section: "A",
    type: "unscramble",
    questionNumber: 3,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["手を", "挙げてください", "質問があれば"],
    correctOrder: ["質問があれば", "手を", "挙げてください"],
    correctAnswer: "質問があれば手を挙げてください。",
  },
  {
    moduleNumber: 1,
    section: "A",
    type: "unscramble",
    questionNumber: 4,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["宿題を", "終わらせておきます", "寝る前に"],
    correctOrder: ["寝る前に", "宿題を", "終わらせておきます"],
    correctAnswer: "寝る前に宿題を終わらせておきます。",
  },
  {
    moduleNumber: 1,
    section: "A",
    type: "unscramble",
    questionNumber: 5,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["つもりです", "アンケートに", "回答する"],
    correctOrder: ["アンケートに", "回答する", "つもりです"],
    correctAnswer: "アンケートに回答するつもりです。",
  },

  // Modul 2
  {
    moduleNumber: 2,
    section: "A",
    type: "unscramble",
    questionNumber: 1,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["予定です", "来月の研修に", "参加する"],
    correctOrder: ["来月の研修に", "参加する", "予定です"],
    correctAnswer: "来月の研修に参加する予定です。",
  },
  {
    moduleNumber: 2,
    section: "A",
    type: "unscramble",
    questionNumber: 2,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["研究しようと", "日本の文化を", "思っています"],
    correctOrder: ["日本の文化を", "研究しようと", "思っています"],
    correctAnswer: "日本の文化を研究しようと思っています。",
  },
  {
    moduleNumber: 2,
    section: "A",
    type: "unscramble",
    questionNumber: 3,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["集合する", "予定です", "駅の前に"],
    correctOrder: ["駅の前に", "集合する", "予定です"],
    correctAnswer: "駅の前に集合する予定です。",
  },
  {
    moduleNumber: 2,
    section: "A",
    type: "unscramble",
    questionNumber: 4,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["表に", "調査の結果を", "まとめておきます"],
    correctOrder: ["調査の結果を", "表に", "まとめておきます"],
    correctAnswer: "調査の結果を表にまとめておきます。",
  },
  {
    moduleNumber: 2,
    section: "A",
    type: "unscramble",
    questionNumber: 5,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["終わった後で", "結果を聞きます", "検査が"],
    correctOrder: ["検査が", "終わった後で", "結果を聞きます"],
    correctAnswer: "検査が終わった後で結果を聞きます。",
  },

  // Modul 3
  {
    moduleNumber: 3,
    section: "A",
    type: "unscramble",
    questionNumber: 1,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["おきます", "旅行に必要な情報を", "集めて"],
    correctOrder: ["旅行に必要な情報を", "集めて", "おきます"],
    correctAnswer: "旅行に必要な情報を集めておきます。",
  },
  {
    moduleNumber: 3,
    section: "A",
    type: "unscramble",
    questionNumber: 2,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["地震の速報が出ました", "ときに", "テレビを見ていた"],
    correctOrder: ["テレビを見ていた", "ときに", "地震の速報が出ました"],
    correctAnswer: "テレビを見ていたときに地震の速報が出ました。",
  },
  {
    moduleNumber: 3,
    section: "A",
    type: "unscramble",
    questionNumber: 3,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["メモに", "書いてあります", "田中さんへの伝言が"],
    correctOrder: ["田中さんへの伝言が", "メモに", "書いてあります"],
    correctAnswer: "田中さんへの伝言がメモに書いてあります。",
  },
  {
    moduleNumber: 3,
    section: "A",
    type: "unscramble",
    questionNumber: 4,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["なったら", "渡りましょう", "信号が青に"],
    correctOrder: ["信号が青に", "なったら", "渡りましょう"],
    correctAnswer: "信号が青になったら渡りましょう。",
  },
  {
    moduleNumber: 3,
    section: "A",
    type: "unscramble",
    questionNumber: 5,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["郵送する", "書類を", "つもりです"],
    correctOrder: ["書類を", "郵送する", "つもりです"],
    correctAnswer: "書類を郵送するつもりです。",
  },

  // Modul 4
  {
    moduleNumber: 4,
    section: "A",
    type: "unscramble",
    questionNumber: 1,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["働こうと", "新しい職場で", "思っています"],
    correctOrder: ["新しい職場で", "働こうと", "思っています"],
    correctAnswer: "新しい職場で働こうと思っています。",
  },
  {
    moduleNumber: 4,
    section: "A",
    type: "unscramble",
    questionNumber: 2,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["今日は残業する", "仕事が終わらないので", "ことにしました"],
    correctOrder: ["仕事が終わらないので", "今日は残業する", "ことにしました"],
    correctAnswer: "仕事が終わらないので今日は残業することにしました。",
  },
  {
    moduleNumber: 4,
    section: "A",
    type: "unscramble",
    questionNumber: 3,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["並べてあります", "商品が", "店の棚に"],
    correctOrder: ["商品が", "並べてあります", "店の棚に"],
    correctAnswer: "商品が並べてあります店の棚に。",
  },
  {
    moduleNumber: 4,
    section: "A",
    type: "unscramble",
    questionNumber: 4,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["国民の義務だと", "習いました", "税金を払うことは"],
    correctOrder: ["税金を払うことは", "国民の義務だと", "習いました"],
    correctAnswer: "税金を払うことは国民の義務だと習いました。",
  },
  {
    moduleNumber: 4,
    section: "A",
    type: "unscramble",
    questionNumber: 5,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["午後に手術をする", "予定です", "医者は"],
    correctOrder: ["医者は", "午後に手術をする", "予定です"],
    correctAnswer: "医者は午後に手術をする予定です。",
  },

  // Modul 5
  {
    moduleNumber: 5,
    section: "A",
    type: "unscramble",
    questionNumber: 1,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["印刷して", "おきます", "会議で使う資料を"],
    correctOrder: ["会議で使う資料を", "印刷して", "おきます"],
    correctAnswer: "会議で使う資料を印刷しておきます。",
  },
  {
    moduleNumber: 5,
    section: "A",
    type: "unscramble",
    questionNumber: 2,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["卒業論文を", "予定です", "来月提出する"],
    correctOrder: ["卒業論文を", "来月提出する", "予定です"],
    correctAnswer: "卒業論文を来月提出する予定です。",
  },
  {
    moduleNumber: 5,
    section: "A",
    type: "unscramble",
    questionNumber: 3,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["決めます", "新しい案を", "よく検討してから"],
    correctOrder: ["新しい案を", "よく検討してから", "決めます"],
    correctAnswer: "新しい案をよく検討してから決めます。",
  },
  {
    moduleNumber: 5,
    section: "A",
    type: "unscramble",
    questionNumber: 4,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["思っています", "先生に相談しようと", "進学について"],
    correctOrder: ["進学について", "先生に相談しようと", "思っています"],
    correctAnswer: "進学について先生に相談しようと思っています。",
  },
  {
    moduleNumber: 5,
    section: "A",
    type: "unscramble",
    questionNumber: 5,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["ノートに", "書いておきます", "自分の意見を"],
    correctOrder: ["書いておきます", "ノートに", "自分の意見を"],
    correctAnswer: "書いておきますノートに自分の意見を。",
  },

  // Modul 6
  {
    moduleNumber: 6,
    section: "A",
    type: "unscramble",
    questionNumber: 1,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["思っています", "作文に書こうと", "留学の経験を"],
    correctOrder: ["留学の経験を", "作文に書こうと", "思っています"],
    correctAnswer: "留学の経験を作文に書こうと思っています。",
  },
  {
    moduleNumber: 6,
    section: "A",
    type: "unscramble",
    questionNumber: 2,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["授業を開始する", "出席を取ります", "前に"],
    correctOrder: ["授業を開始する", "前に", "出席を取ります"],
    correctAnswer: "授業を開始する前に出席を取ります。",
  },
  {
    moduleNumber: 6,
    section: "A",
    type: "unscramble",
    questionNumber: 3,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["この欄に", "書いてください", "学歴を"],
    correctOrder: ["学歴を", "この欄に", "書いてください"],
    correctAnswer: "学歴をこの欄に書いてください。",
  },
  {
    moduleNumber: 6,
    section: "A",
    type: "unscramble",
    questionNumber: 4,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["史料として", "調べる予定です", "昔の手紙を"],
    correctOrder: ["昔の手紙を", "史料として", "調べる予定です"],
    correctAnswer: "昔の手紙を史料として調べる予定です。",
  },
  {
    moduleNumber: 6,
    section: "A",
    type: "unscramble",
    questionNumber: 5,
    question: "Susunlah potongan kata berikut menjadi satu kalimat yang benar.",
    words: ["忘れないように", "メモしておきます", "提出期限を"],
    correctOrder: ["提出期限を", "忘れないように", "メモしておきます"],
    correctAnswer: "提出期限を忘れないようにメモしておきます。",
  },
];

const sectionB: QuestionSeed[] = [
  // Modul 1
  {
    moduleNumber: 1,
    section: "B",
    type: "multiple",
    questionNumber: 1,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 試 — 試作",
    options: ["Produksi dan Pengembangan", "Konsumsi", "Penggunaan"],
    correctAnswer: "0", // A
  },
  {
    moduleNumber: 1,
    section: "B",
    type: "multiple",
    questionNumber: 2,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 験 — 体験",
    options: ["Pengujian / Pembuktian", "Pengalaman"],
    correctAnswer: "1", // B
  },
  {
    moduleNumber: 1,
    section: "B",
    type: "multiple",
    questionNumber: 3,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 問 — 問答",
    options: ["Tanya Jawab", "Bertanya / Mengajukan Pertanyaan", "Mengunjungi"],
    correctAnswer: "0", // A
  },
  {
    moduleNumber: 1,
    section: "B",
    type: "multiple",
    questionNumber: 4,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 題 — 題名",
    options: ["Soal/Tugas/Masalah", "Judul", "Tema/Topik"],
    correctAnswer: "1", // B
  },
  {
    moduleNumber: 1,
    section: "B",
    type: "multiple",
    questionNumber: 5,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 答 — 答案",
    options: ["Jawaban/Tanggapan", "Cara menjawab", "Hasil Jawaban"],
    correctAnswer: "2", // C
  },

  // Modul 2
  {
    moduleNumber: 2,
    section: "B",
    type: "multiple",
    questionNumber: 1,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 研 — 研磨",
    options: ["Meneliti / Mendalami", "Mengasah / Menghaluskan", "Belajar / Mengasah Kemampuan"],
    correctAnswer: "1", // B
  },
  {
    moduleNumber: 2,
    section: "B",
    type: "multiple",
    questionNumber: 2,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 究 — 探究",
    options: ["Mengkaji / Membahas", "Mendalami / Mengungkap", "Meneliti / Menyelidiki"],
    correctAnswer: "1", // B
  },
  {
    moduleNumber: 2,
    section: "B",
    type: "multiple",
    questionNumber: 3,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 集 — 集合",
    options: ["Mengumpulkan / Menghimpun", "Memusatkan / Mengakumulasi", "Berkumpul / Berkelompok"],
    correctAnswer: "2", // C
  },
  {
    moduleNumber: 2,
    section: "B",
    type: "multiple",
    questionNumber: 4,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 調 — 口調",
    options: ["Kondisi dan Keadaan", "Pengaturan dan Penyesuaian", "Cara Berbicara dan Bunyi"],
    correctAnswer: "2", // C
  },
  {
    moduleNumber: 2,
    section: "B",
    type: "multiple",
    questionNumber: 5,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 査 — 検査",
    options: ["Memeriksa", "Memeriksa dengan Teliti", "Menilai"],
    correctAnswer: "0", // A
  },

  // Modul 3
  {
    moduleNumber: 3,
    section: "B",
    type: "multiple",
    questionNumber: 1,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 情 — 愛情",
    options: ["Kasih Sayang / Hubungan Antarmanusia", "Informasi / Data", "Perasaan / Emosi"],
    correctAnswer: "0", // A
  },
  {
    moduleNumber: 3,
    section: "B",
    type: "multiple",
    questionNumber: 2,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 報 — 日報",
    options: ["Berita / Jenis Informasi", "Informasi / Pemberitahuan", "Laporan / Publikasi / Informasi Resmi"],
    correctAnswer: "2", // C
  },
  {
    moduleNumber: 3,
    section: "B",
    type: "multiple",
    questionNumber: 3,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 伝 — 伝記",
    options: ["Pewarisan Tradisi dan Cerita", "Penyampaian Pesan dan Informasi", "Riwayat dan Informasi Tertulis"],
    correctAnswer: "2", // C
  },
  {
    moduleNumber: 3,
    section: "B",
    type: "multiple",
    questionNumber: 4,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 信 — 通信",
    options: ["Tanda dan Isyarat", "Surat, Informasi, dan Komunikasi", "Kepercayaan dan Keyakinan"],
    correctAnswer: "1", // B
  },
  {
    moduleNumber: 3,
    section: "B",
    type: "multiple",
    questionNumber: 5,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 送 — 送信",
    options: ["Pengiriman / Pengantaran Benda / Barang", "Pengiriman/Pengantaran orang", "Pengiriman Informasi / Pesan"],
    correctAnswer: "2", // C
  },

  // Modul 4
  {
    moduleNumber: 4,
    section: "B",
    type: "multiple",
    questionNumber: 1,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 職 — 転職",
    options: ["Perubahan / Status Pekerjaan", "Profesi / Pekerjaan", "Orang / Tempat Kerja"],
    correctAnswer: "0", // A
  },
  {
    moduleNumber: 4,
    section: "B",
    type: "multiple",
    questionNumber: 2,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 業 — 作業",
    options: ["Pekerjaan / Tugas", "Usaha / Bisnis / Dunia Kerja", "Bidang Industri / Pekerja"],
    correctAnswer: "0", // A
  },
  {
    moduleNumber: 4,
    section: "B",
    type: "multiple",
    questionNumber: 3,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 商 — 商店",
    options: ["Kegiatan Perdagangan", "Tempat Perdagangan", "Produk / Barang Dagangan"],
    correctAnswer: "1", // B
  },
  {
    moduleNumber: 4,
    section: "B",
    type: "multiple",
    questionNumber: 4,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 務 — 義務",
    options: ["Tugas / Kewajiban", "Pekerjaan / Tugas", "Bidang / Urusan Tugas"],
    correctAnswer: "0", // A
  },
  {
    moduleNumber: 4,
    section: "B",
    type: "multiple",
    questionNumber: 5,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 術 — 学術",
    options: ["Teknik / Keterampilan", "Ilmu / Pengetahuan", "Seni / Keahlian Seni"],
    correctAnswer: "1", // B
  },

  // Modul 5
  {
    moduleNumber: 5,
    section: "B",
    type: "multiple",
    questionNumber: 1,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 議 — 議長",
    options: ["Keputusan / Penetapan", "Pelaku / Lembaga / Jalannya Rapat", "Pertemuan / Diskusi"],
    correctAnswer: "1", // B
  },
  {
    moduleNumber: 5,
    section: "B",
    type: "multiple",
    questionNumber: 2,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 論 — 討論",
    options: ["Penalaran / Pemikiran", "Diskusi / Perdebatan", "Penyampaian / Hasil Pemikiran"],
    correctAnswer: "1", // B
  },
  {
    moduleNumber: 5,
    section: "B",
    type: "multiple",
    questionNumber: 3,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 討 — 検討",
    options: ["Membahas / Berdiskusi", "Menyelidiki / Mengkaji"],
    correctAnswer: "1", // B
  },
  {
    moduleNumber: 5,
    section: "B",
    type: "multiple",
    questionNumber: 4,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 談 — 面談",
    options: ["Suasana / Sifat Pembicaraan", "Tujuan / Kegiatan Pembicaraan", "Bentuk / Cara Pembicaraan"],
    correctAnswer: "2", // C
  },
  {
    moduleNumber: 5,
    section: "B",
    type: "multiple",
    questionNumber: 5,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 意 — 注意",
    options: ["Kehendak / Maksud", "Kesadaran / Perhatian", "Pikiran / Makna"],
    correctAnswer: "1", // B
  },

  // Modul 6
  {
    moduleNumber: 6,
    section: "B",
    type: "multiple",
    questionNumber: 1,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 経 — 経験",
    options: ["Jalur / Cara Melalui", "Pengalaman / Proses", "Pengelolaan / Ekonomi"],
    correctAnswer: "1", // B
  },
  {
    moduleNumber: 6,
    section: "B",
    type: "multiple",
    questionNumber: 2,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 始 — 終始",
    options: ["Awal Waktu", "Mulai / Mengawali", "Awal dan Akhir"],
    correctAnswer: "2", // C
  },
  {
    moduleNumber: 6,
    section: "B",
    type: "multiple",
    questionNumber: 3,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 歴 — 歴史",
    options: ["Riwayat Pendidikan / Pekerjaan", "Riwayat Kehidupan", "Sejarah / Perjalanan Waktu"],
    correctAnswer: "2", // C
  },
  {
    moduleNumber: 6,
    section: "B",
    type: "multiple",
    questionNumber: 4,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 史 — 史料",
    options: ["Jenis / Sifat Sejarah", "Masa / Sejarah", "Fakta / Sumber Sejarah"],
    correctAnswer: "2", // C
  },
  {
    moduleNumber: 6,
    section: "B",
    type: "multiple",
    questionNumber: 5,
    question: "Pilih satu kelompok makna untuk jukugo berikut: Kanji 期 — 期限",
    options: ["Tahap Waktu", "Waktu / Periode", "Batas Waktu"],
    correctAnswer: "2", // C
  },
];

const sectionC: QuestionSeed[] = [
  // Modul 1
  {
    moduleNumber: 1,
    section: "C",
    type: "multiple",
    questionNumber: 1,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 試験",
    options: ["Eksperimen", "Pekerjaan rumah", "Ujian"],
    correctAnswer: "2", // C (Ujian)
  },
  {
    moduleNumber: 1,
    section: "C",
    type: "multiple",
    questionNumber: 2,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 実験",
    options: ["Eksperimen", "Pertanyaan", "Ujian"],
    correctAnswer: "0", // A (Eksperimen)
  },
  {
    moduleNumber: 1,
    section: "C",
    type: "multiple",
    questionNumber: 3,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 質問",
    options: ["Eksperimen", "Ujian", "Pertanyaan"],
    correctAnswer: "2", // C (Pertanyaan)
  },
  {
    moduleNumber: 1,
    section: "C",
    type: "multiple",
    questionNumber: 4,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 宿題",
    options: ["Ujian", "Jawaban", "Pekerjaan rumah"],
    correctAnswer: "2", // C (Pekerjaan rumah)
  },
  {
    moduleNumber: 1,
    section: "C",
    type: "multiple",
    questionNumber: 5,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 回答",
    options: ["Jawaban", "Ujian", "Eksperimen"],
    correctAnswer: "0", // A (Jawaban)
  },

  // Modul 2
  {
    moduleNumber: 2,
    section: "C",
    type: "multiple",
    questionNumber: 1,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 研修",
    options: ["Berkumpul", "Pemeriksaan", "Pelatihan"],
    correctAnswer: "2", // C (Pelatihan)
  },
  {
    moduleNumber: 2,
    section: "C",
    type: "multiple",
    questionNumber: 2,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 研究",
    options: ["Pelatihan", "Berkumpul", "Penelitian"],
    correctAnswer: "2", // C (Penelitian)
  },
  {
    moduleNumber: 2,
    section: "C",
    type: "multiple",
    questionNumber: 3,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 集合",
    options: ["Pemeriksaan", "Survei", "Berkumpul"],
    correctAnswer: "2", // C (Berkumpul)
  },
  {
    moduleNumber: 2,
    section: "C",
    type: "multiple",
    questionNumber: 4,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 調査",
    options: ["Berkumpul", "Penelitian", "Survei"],
    correctAnswer: "2", // C (Survei)
  },
  {
    moduleNumber: 2,
    section: "C",
    type: "multiple",
    questionNumber: 5,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 検査",
    options: ["Pelatihan", "Pemeriksaan", "Penelitian"],
    correctAnswer: "1", // B (Pemeriksaan)
  },

  // Modul 3
  {
    moduleNumber: 3,
    section: "C",
    type: "multiple",
    questionNumber: 1,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 情報",
    options: ["Berita kilat", "Informasi", "Pengiriman lewat pos"],
    correctAnswer: "1", // B (Informasi)
  },
  {
    moduleNumber: 3,
    section: "C",
    type: "multiple",
    questionNumber: 2,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 速報",
    options: ["Berita kilat", "Informasi", "Lampu lalu lintas"],
    correctAnswer: "0", // A (Berita kilat)
  },
  {
    moduleNumber: 3,
    section: "C",
    type: "multiple",
    questionNumber: 3,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 伝言",
    options: ["Lampu lalu lintas", "Informasi", "Pesan titipan"],
    correctAnswer: "2", // C (Pesan titipan)
  },
  {
    moduleNumber: 3,
    section: "C",
    type: "multiple",
    questionNumber: 4,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 信号",
    options: ["Lampu lalu lintas", "Berita kilat", "Informasi"],
    correctAnswer: "0", // A (Lampu lalu lintas)
  },
  {
    moduleNumber: 3,
    section: "C",
    type: "multiple",
    questionNumber: 5,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 郵送",
    options: ["Pesan titipan", "Berita kilat", "Pengiriman lewat pos"],
    correctAnswer: "2", // C (Pengiriman lewat pos)
  },

  // Modul 4
  {
    moduleNumber: 4,
    section: "C",
    type: "multiple",
    questionNumber: 1,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 職場",
    options: ["Barang dagangan", "Tempat kerja", "Lembur"],
    correctAnswer: "1", // B (Tempat kerja)
  },
  {
    moduleNumber: 4,
    section: "C",
    type: "multiple",
    questionNumber: 2,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 残業",
    options: ["Kewajiban", "Operasi medis", "Lembur"],
    correctAnswer: "2", // C (Lembur)
  },
  {
    moduleNumber: 4,
    section: "C",
    type: "multiple",
    questionNumber: 3,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 商品",
    options: ["Operasi medis", "Barang dagangan", "Kewajiban"],
    correctAnswer: "1", // B (Barang dagangan)
  },
  {
    moduleNumber: 4,
    section: "C",
    type: "multiple",
    questionNumber: 4,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 義務",
    options: ["Kewajiban", "Barang dagangan", "Lembur"],
    correctAnswer: "0", // A (Kewajiban)
  },
  {
    moduleNumber: 4,
    section: "C",
    type: "multiple",
    questionNumber: 5,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 手術",
    options: ["Tempat kerja", "Operasi medis", "Kewajiban"],
    correctAnswer: "1", // B (Operasi medis)
  },

  // Modul 5
  {
    moduleNumber: 5,
    section: "C",
    type: "multiple",
    questionNumber: 1,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 会議",
    options: ["Konsultasi", "Pendapat", "Rapat"],
    correctAnswer: "2", // C (Rapat)
  },
  {
    moduleNumber: 5,
    section: "C",
    type: "multiple",
    questionNumber: 2,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 論文",
    options: ["Karya ilmiah", "Penelaahan", "Konsultasi"],
    correctAnswer: "0", // A (Karya ilmiah)
  },
  {
    moduleNumber: 5,
    section: "C",
    type: "multiple",
    questionNumber: 3,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 検討",
    options: ["Rapat", "Penelaahan", "Pendapat"],
    correctAnswer: "1", // B (Penelaahan)
  },
  {
    moduleNumber: 5,
    section: "C",
    type: "multiple",
    questionNumber: 4,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 相談",
    options: ["Karya ilmiah", "Konsultasi", "Pendapat"],
    correctAnswer: "1", // B (Konsultasi)
  },
  {
    moduleNumber: 5,
    section: "C",
    type: "multiple",
    questionNumber: 5,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 意見",
    options: ["Konsultasi", "Penelaahan", "Pendapat"],
    correctAnswer: "2", // C (Pendapat)
  },

  // Modul 6
  {
    moduleNumber: 6,
    section: "C",
    type: "multiple",
    questionNumber: 1,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 経験",
    options: ["Pengalaman", "Batas waktu", "Permulaan"],
    correctAnswer: "0", // A (Pengalaman)
  },
  {
    moduleNumber: 6,
    section: "C",
    type: "multiple",
    questionNumber: 2,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 開始",
    options: ["Riwayat pendidikan", "Permulaan", "Sumber sejarah"],
    correctAnswer: "1", // B (Permulaan)
  },
  {
    moduleNumber: 6,
    section: "C",
    type: "multiple",
    questionNumber: 3,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 学歴",
    options: ["Sumber sejarah", "Pengalaman", "Riwayat pendidikan"],
    correctAnswer: "2", // C (Riwayat pendidikan)
  },
  {
    moduleNumber: 6,
    section: "C",
    type: "multiple",
    questionNumber: 4,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 史料",
    options: ["Riwayat pendidikan", "Pengalaman", "Sumber sejarah"],
    correctAnswer: "2", // C (Sumber sejarah)
  },
  {
    moduleNumber: 6,
    section: "C",
    type: "multiple",
    questionNumber: 5,
    question: "Pilihlah satu arti yang paling tepat untuk jukugo: 期限",
    options: ["Batas waktu", "Riwayat pendidikan", "Permulaan"],
    correctAnswer: "0", // A (Batas waktu)
  },
];

const sectionD: QuestionSeed[] = [
  // Modul 1
  {
    moduleNumber: 1,
    section: "D",
    type: "fill",
    questionNumber: 1,
    question: "合格するために、毎日（　）の勉強をしています。",
    options: ["試験", "実験", "質問"],
    correctAnswer: "0", // A (試験)
  },
  {
    moduleNumber: 1,
    section: "D",
    type: "fill",
    questionNumber: 2,
    question: "水を熱するとどうなるか、理科の授業で（　）をしました。",
    options: ["試験", "質問", "実験"],
    correctAnswer: "2", // C (実験)
  },
  {
    moduleNumber: 1,
    section: "D",
    type: "fill",
    questionNumber: 3,
    question: "説明でわからないことがあったので、先生に（　）しました。",
    options: ["質問", "宿題", "試験"],
    correctAnswer: "0", // A (質問)
  },
  {
    moduleNumber: 1,
    section: "D",
    type: "fill",
    questionNumber: 4,
    question: "先生が家でやるように出した（　）は、月曜日に提出します。",
    options: ["宿題", "実験", "回答"],
    correctAnswer: "0", // A (宿題)
  },
  {
    moduleNumber: 1,
    section: "D",
    type: "fill",
    questionNumber: 5,
    question: "アンケートへの（　）は、一人一回までです。",
    options: ["実験", "宿題", "回答"],
    correctAnswer: "2", // C (回答)
  },

  // Modul 2
  {
    moduleNumber: 2,
    section: "D",
    type: "fill",
    questionNumber: 1,
    question: "新入社員は仕事のやり方を学ぶために、三日間の（　）を受けます。",
    options: ["調査", "集合", "研修"],
    correctAnswer: "2", // C (研修)
  },
  {
    moduleNumber: 2,
    section: "D",
    type: "fill",
    questionNumber: 2,
    question: "大学で日本の方言について（　）しています。",
    options: ["検査", "研究", "集合"],
    correctAnswer: "1", // B (研究)
  },
  {
    moduleNumber: 2,
    section: "D",
    type: "fill",
    questionNumber: 3,
    question: "みんなで出発しますから、八時に校門の前に（　）してください。",
    options: ["集合", "研修", "研究"],
    correctAnswer: "0", // A (集合)
  },
  {
    moduleNumber: 2,
    section: "D",
    type: "fill",
    questionNumber: 4,
    question: "学生が毎日何時間勉強するかを知るために、アンケート（　）を行いました。",
    options: ["研修", "調査", "研究"],
    correctAnswer: "1", // B (調査)
  },
  {
    moduleNumber: 2,
    section: "D",
    type: "fill",
    questionNumber: 5,
    question: "空港では、危険な物が入っていないか、荷物の（　）をします。",
    options: ["検査", "調査", "集合"],
    correctAnswer: "0", // A (検査)
  },

  // Modul 3
  {
    moduleNumber: 3,
    section: "D",
    type: "fill",
    questionNumber: 1,
    question: "電車が動いているか、駅のサイトで最新の運行（　）を確認しました。",
    options: ["情報", "速報", "信号"],
    correctAnswer: "0", // A (情報)
  },
  {
    moduleNumber: 3,
    section: "D",
    type: "fill",
    questionNumber: 2,
    question: "大きな地震が起きると、テレビにすぐ地震（　）が出ました。",
    options: ["伝言", "情報", "速報"],
    correctAnswer: "2", // C (速報)
  },
  {
    moduleNumber: 3,
    section: "D",
    type: "fill",
    questionNumber: 3,
    question: "田中さんがいないので、戻ったら電話するように（　）をお願いしました。",
    options: ["速報", "伝言", "情報"],
    correctAnswer: "1", // B (伝言)
  },
  {
    moduleNumber: 3,
    section: "D",
    type: "fill",
    questionNumber: 4,
    question: "交差点の（　）が赤になったので、車は止まりました。",
    options: ["信号", "伝言", "速報"],
    correctAnswer: "0", // A (信号)
  },
  {
    moduleNumber: 3,
    section: "D",
    type: "fill",
    questionNumber: 5,
    question: "書類を封筒に入れて、郵便局から（　）してください。",
    options: ["信号", "郵送", "速報"],
    correctAnswer: "1", // B (郵送)
  },

  // Modul 4
  {
    moduleNumber: 4,
    section: "D",
    type: "fill",
    questionNumber: 1,
    question: "私の（　）は駅の近くにあり、毎日電車で通っています。",
    options: ["残業", "義務", "職場"],
    correctAnswer: "2", // C (職場)
  },
  {
    moduleNumber: 4,
    section: "D",
    type: "fill",
    questionNumber: 2,
    question: "仕事が定時に終わらず、夜八時まで（　）しました。",
    options: ["職場", "残業", "手術"],
    correctAnswer: "1", // B (残業)
  },
  {
    moduleNumber: 4,
    section: "D",
    type: "fill",
    questionNumber: 3,
    question: "この店では、季節によって棚に並ぶ（　）が変わります。",
    options: ["商品", "職場", "残業"],
    correctAnswer: "0", // A (商品)
  },
  {
    moduleNumber: 4,
    section: "D",
    type: "fill",
    questionNumber: 4,
    question: "ルールで必ずしなければならないことを（　）といいます。",
    options: ["義務", "残業", "商品"],
    correctAnswer: "0", // A (義務)
  },
  {
    moduleNumber: 4,
    section: "D",
    type: "fill",
    questionNumber: 5,
    question: "医者は患者のおなかを切って悪い部分を取る（　）をしました。",
    options: ["残業", "手術", "商品"],
    correctAnswer: "1", // B (手術)
  },

  // Modul 5
  {
    moduleNumber: 5,
    section: "D",
    type: "fill",
    questionNumber: 1,
    question: "来月の計画をみんなで話し合うために、午後三時から（　）を開きます。",
    options: ["意見", "論文", "会議"],
    correctAnswer: "2", // C (会議)
  },
  {
    moduleNumber: 5,
    section: "D",
    type: "fill",
    questionNumber: 2,
    question: "研究の結果を学術雑誌に出すために、（　）にまとめました。",
    options: ["意見", "相談", "論文"],
    correctAnswer: "2", // C (論文)
  },
  {
    moduleNumber: 5,
    section: "D",
    type: "fill",
    questionNumber: 3,
    question: "三つの案の長所と短所を比べて、どの案がよいか（　）します。",
    options: ["検討", "相談", "論文"],
    correctAnswer: "0", // A (検討)
  },
  {
    moduleNumber: 5,
    section: "D",
    type: "fill",
    questionNumber: 4,
    question: "進学先を一人で決められないので、先生に（　）して助言をもらいました。",
    options: ["相談", "検討", "論文"],
    correctAnswer: "0", // A (相談)
  },
  {
    moduleNumber: 5,
    section: "D",
    type: "fill",
    questionNumber: 5,
    question: "「私はこの案がよいと思います」と自分の（　）を述べました。",
    options: ["相談", "会議", "意見"],
    correctAnswer: "2", // C (意見)
  },

  // Modul 6
  {
    moduleNumber: 6,
    section: "D",
    type: "fill",
    questionNumber: 1,
    question: "以前ホテルで働いた（　）があるので、この仕事に応募しました。",
    options: ["学歴", "開始", "経験"],
    correctAnswer: "2", // C (経験)
  },
  {
    moduleNumber: 6,
    section: "D",
    type: "fill",
    questionNumber: 2,
    question: "受付はもう終わりました。説明会はこれから（　）します。",
    options: ["経験", "期限", "開始"],
    correctAnswer: "2", // C (開始)
  },
  {
    moduleNumber: 6,
    section: "D",
    type: "fill",
    questionNumber: 3,
    question: "卒業した高校と大学の名前を（　）の欄に書いてください。",
    options: ["史料", "学歴", "経験"],
    correctAnswer: "1", // B (学歴)
  },
  {
    moduleNumber: 6,
    section: "D",
    type: "fill",
    questionNumber: 4,
    question: "研究者は江戸時代の生活を知るために、当時の日記を（　）として使いました。",
    options: ["史料", "開始", "経験"],
    correctAnswer: "0", // A (史料)
  },
  {
    moduleNumber: 6,
    section: "D",
    type: "fill",
    questionNumber: 5,
    question: "提出の（　）は金曜日です。土曜日に出しても受け付けてもらえません。",
    options: ["期限", "開始", "史料"],
    correctAnswer: "0", // A (期限)
  },
];

async function seed() {
  console.log("🚀 Memulai seeding Review Quiz (Fukushuu Modul 1 - 6)...");

  const allQuestions = [...sectionA, ...sectionB, ...sectionC, ...sectionD];
  console.log(`📋 Total pertanyaan yang disiapkan: ${allQuestions.length} butir soal`);

  if (allQuestions.length !== 120) {
    throw new Error(`Jumlah soal tidak sesuai! Ditemukan: ${allQuestions.length}, diharapkan: 120`);
  }

  // Cari atau buat ReviewQuiz induk
  // Peletakan setelah modul 6 (id modul 6 adalah 560, atau nomor urut 6)
  const modul6 = await prisma.module.findFirst({
    where: {
      OR: [
        { id: 560 },
        { title: { contains: "Modul 6" } },
        { title: { contains: "MODUL 6" } },
      ],
    },
  });

  const peletakanSetelahModul = modul6 ? modul6.id : 6;
  console.log(`📌 Peletakan setelah modul ID/urutan: ${peletakanSetelahModul}`);

  // Upsert review quiz
  let reviewQuiz = await prisma.reviewQuiz.findFirst({
    where: { judul: { contains: "Fukushuu Modul 1 - 6" } },
  });

  if (reviewQuiz) {
    reviewQuiz = await prisma.reviewQuiz.update({
      where: { id: reviewQuiz.id },
      data: {
        judul: "Fukushuu Modul 1 - 6",
        peletakanSetelahModul,
        deskripsi:
          "Evaluasi komprehensif materi Modul 1 sampai Modul 6 (Pertemuan 7) yang mencakup Menyusun Kalimat, Mengelompokkan Kata Berdasarkan Grafik Semantik, Memilih Makna Jukugo, dan Melengkapi Kalimat.",
        durasiMenit: 60,
        totalSoal: 120,
        targetScore: 60,
        isOpen: true,
      },
    });
    console.log(`🔄 Review Quiz diperbarui (ID: ${reviewQuiz.id})`);
  } else {
    reviewQuiz = await prisma.reviewQuiz.create({
      data: {
        judul: "Fukushuu Modul 1 - 6",
        peletakanSetelahModul,
        deskripsi:
          "Evaluasi komprehensif materi Modul 1 sampai Modul 6 (Pertemuan 7) yang mencakup Menyusun Kalimat, Mengelompokkan Kata Berdasarkan Grafik Semantik, Memilih Makna Jukugo, dan Melengkapi Kalimat.",
        durasiMenit: 60,
        totalSoal: 120,
        targetScore: 60,
        isOpen: true,
      },
    });
    console.log(`✨ Review Quiz baru dibuat (ID: ${reviewQuiz.id})`);
  }

  // Hapus pertanyaan lama agar idempotent
  await prisma.reviewQuizQuestion.deleteMany({
    where: { reviewQuizId: reviewQuiz.id },
  });

  // Insert seluruh 120 pertanyaan
  console.log("⏳ Menyimpan 120 butir pertanyaan ke review_quiz_question...");
  const records = allQuestions.map((q) => ({
    reviewQuizId: reviewQuiz.id,
    moduleNumber: q.moduleNumber,
    section: q.section,
    type: q.type,
    questionNumber: q.questionNumber,
    question: q.question,
    options: q.options ? JSON.stringify(q.options) : null,
    correctAnswer: q.correctAnswer,
    words: q.words ? JSON.stringify(q.words) : null,
    correctOrder: q.correctOrder ? JSON.stringify(q.correctOrder) : null,
    explanation: q.explanation || null,
  }));

  await prisma.reviewQuizQuestion.createMany({
    data: records,
  });

  const count = await prisma.reviewQuizQuestion.count({
    where: { reviewQuizId: reviewQuiz.id },
  });

  console.log(`✅ Berhasil menyimpan ${count} pertanyaan review quiz di database!`);
}

seed()
  .catch((e) => {
    console.error("❌ Error seeding Review Quiz:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
