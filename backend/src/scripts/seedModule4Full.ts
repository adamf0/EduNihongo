import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedModule4() {
  console.log("🚀 Starting seeding for Modul 4 (職・業・商・務・術)...");

  // 1. Ensure Module 4 exists and updated
  let module4 = await prisma.module.findFirst({
    where: {
      OR: [
        { title: "Module 4" },
        { title: "Modul 4" },
        { title: { contains: "Module 4" } },
        { title: { contains: "Modul 4" } }
      ]
    }
  });

  const tujuanPembelajaranMod4 = `Mahasiswa mampu:
Memahami makna dasar kanji yang berkaitan dengan pekerjaan dan perdagangan.
Menjelaskan hubungan makna antar-kanji dalam dunia kerja dan perdagangan.
Menganalisis jukugo yang berkaitan dengan pekerjaan dan perdagangan.
Menyusun semantic graph bidang pekerjaan dan perdagangan.
Menggunakan jukugo dalam konteks pekerjaan dan perdagangan.`;

  if (!module4) {
    module4 = await prisma.module.create({
      data: {
        title: "Module 4",
        tujuanPembelajaran: tujuanPembelajaranMod4
      }
    });
    console.log(`✅ Created Module 4 with ID: ${module4.id}`);
  } else {
    module4 = await prisma.module.update({
      where: { id: module4.id },
      data: {
        title: "Module 4",
        tujuanPembelajaran: tujuanPembelajaranMod4
      }
    });
    console.log(`✅ Updated Module 4 (ID: ${module4.id})`);
  }

  const moduleId = module4.id;

  // Ensure default user progress exists for Module 4
  const users = await prisma.user.findMany();
  for (const user of users) {
    const existingProgress = await prisma.userModuleProgress.findUnique({
      where: {
        userId_moduleId: {
          userId: user.id,
          moduleId: moduleId
        }
      }
    });
    if (!existingProgress) {
      await prisma.userModuleProgress.create({
        data: {
          userId: user.id,
          moduleId: moduleId,
          isCompleted: false,
          isLocked: false,
          progressPercent: 0
        }
      });
    }
  }

  // 2. Data definition for all 5 Kanjis
  const kanjiDataMap: Record<string, {
    romaji: string;
    meaning: string;
    bushuu: string;
    onyomi: string;
    kunyomi: string;
    baseMeaning: string;
    border: string;
    categories: {
      name: string;
      description: string;
      color: string;
      jukugos: {
        word: string;
        reading: string;
        meaning: string;
        explanation: string;
        charRoles: Record<string, string>;
      }[];
    }[];
    examples: { japanese: string; romaji: string; translation: string }[];
    reflections: string[];
    quizzes: any[];
    crossLinks: [string, string, string][];
  }> = {
    "職": {
      romaji: "Shoku",
      meaning: "pekerjaan; jabatan; profesi",
      bushuu: "耳（みみ）Telinga",
      onyomi: "ショク、シキ",
      kunyomi: "―",
      baseMeaning: "Pekerjaan, jabatan, atau profesi yang menjadi tanggung jawab seseorang.",
      border: "border-l-4 border-primary",
      categories: [
        {
          name: "Profesi / Pekerjaan",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan pekerjaan, profesi, atau orang yang memiliki keterampilan tertentu dalam pekerjaannya.",
          color: "border-purple-500",
          jukugos: [
            {
              word: "職業",
              reading: "しょくぎょう",
              meaning: "profesi / pekerjaan",
              explanation: "Hubungan makna antar kanji 職 dan 業 menjadi 職業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “profesi atau pekerjaan yang dilakukan seseorang.”",
              charRoles: { "職": "pekerjaan, jabatan, profesi", "業": "pekerjaan, usaha, kegiatan" }
            },
            {
              word: "職人",
              reading: "しょくにん",
              meaning: "pengrajin / pekerja terampil",
              explanation: "Hubungan makna antar kanji 職 dan 人 menjadi 職人, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “orang yang memiliki pekerjaan atau keterampilan khusus, terutama sebagai pengrajin atau pekerja terampil.”",
              charRoles: { "職": "pekerjaan, profesi", "人": "orang, manusia" }
            }
          ]
        },
        {
          name: "Orang / Tempat Kerja",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan orang yang bekerja dan tempat berlangsungnya kegiatan pekerjaan.",
          color: "border-blue-500",
          jukugos: [
            {
              word: "職員",
              reading: "しょくいん",
              meaning: "staf / pegawai",
              explanation: "Hubungan makna antar kanji 職 dan 員 menjadi 職員, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “orang yang bekerja sebagai staf atau pegawai dalam suatu organisasi.”",
              charRoles: { "職": "pekerjaan, jabatan", "員": "anggota, staf" }
            },
            {
              word: "職場",
              reading: "しょくば",
              meaning: "tempat kerja",
              explanation: "Hubungan makna antar kanji 職 dan 場 menjadi 職場, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tempat berlangsungnya kegiatan pekerjaan.”",
              charRoles: { "職": "pekerjaan", "場": "tempat" }
            }
          ]
        },
        {
          name: "Mencari / Memiliki Pekerjaan",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan usaha mencari pekerjaan dan keadaan memiliki pekerjaan.",
          color: "border-green-500",
          jukugos: [
            {
              word: "求職",
              reading: "きゅうしょく",
              meaning: "mencari pekerjaan",
              explanation: "Hubungan makna antar kanji 求 dan 職 menjadi 求職, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan mencari pekerjaan.”",
              charRoles: { "求": "mencari, meminta", "職": "pekerjaan" }
            },
            {
              word: "有職",
              reading: "ゆうしょく",
              meaning: "memiliki pekerjaan",
              explanation: "Hubungan makna antar kanji 有 dan 職 menjadi 有職, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keadaan memiliki pekerjaan atau jabatan.”",
              charRoles: { "有": "ada, memiliki", "職": "pekerjaan, jabatan" }
            }
          ]
        },
        {
          name: "Perubahan / Status Pekerjaan",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan perubahan keadaan seseorang dalam pekerjaan, termasuk berpindah, berhenti, atau tidak memiliki pekerjaan.",
          color: "border-orange-500",
          jukugos: [
            {
              word: "転職",
              reading: "てんしょく",
              meaning: "pindah pekerjaan",
              explanation: "Hubungan makna antar kanji 転 dan 職 menjadi 転職, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “berpindah dari satu pekerjaan ke pekerjaan lain.”",
              charRoles: { "転": "berpindah, beralih", "職": "pekerjaan" }
            },
            {
              word: "退職",
              reading: "たいしょく",
              meaning: "berhenti bekerja",
              explanation: "Hubungan makna antar kanji 退 dan 職 menjadi 退職, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “berhenti dari pekerjaan atau jabatan.”",
              charRoles: { "退": "mundur, berhenti", "職": "pekerjaan" }
            },
            {
              word: "無職",
              reading: "むしょく",
              meaning: "tidak bekerja / pengangguran",
              explanation: "Hubungan makna antar kanji 無 dan 職 menjadi 無職, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keadaan tidak memiliki pekerjaan.”",
              charRoles: { "無": "tidak ada, tanpa", "職": "pekerjaan" }
            }
          ]
        }
      ],
      examples: [
        {
          japanese: "そのパンは有名な職人が作ったんです。",
          romaji: "Sono pan wa yuumei na shokunin ga tsukutta n desu.",
          translation: "Roti itu dibuat oleh pengrajin/pekerja terampil yang terkenal."
        },
        {
          japanese: "ここに自分の職業を書くんです。",
          romaji: "Koko ni jibun no shokugyou wo kaku n desu.",
          translation: "Tuliskan profesi Anda sendiri di sini."
        },
        {
          japanese: "部屋の前に職員の名前がはってあります。",
          romaji: "Heya no mae ni shokuin no namae ga hatte arimasu.",
          translation: "Nama staf/pegawai tertempel di depan ruangan."
        },
        {
          japanese: "仕事の前に職場を掃除しておきます。",
          romaji: "Shigoto no mae ni shokuba wo souji shite okimasu.",
          translation: "Sebelum bekerja, bersihkan tempat kerja terlebih dahulu."
        },
        {
          japanese: "無理をしないで、転職したほうがいいです。",
          romaji: "Muri wo shinaide, tenshoku shita hou ga ii desu.",
          translation: "Jangan memaksakan diri, lebih baik pindah pekerjaan."
        }
      ],
      reflections: [
        "Apa makna dasar kanji 職 yang Anda pahami?",
        "Jukugo mana yang mudah untuk diingat? Mengapa?",
        "Apa perbedaan penggunaan 職業、職場、dan 職員?",
        "Cabang semantic graph mana yang menurut Anda paling mudah dipahami?",
        "Bagaimana cara Anda mengingat hubungan makna antar-jukugo yang mengandung kanji 職?"
      ],
      quizzes: [
        // a) Unscramble sentences
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar:\n有職者が ・ 増えている ・ 最近 ・ んです",
          words: ["最近", "有職者が", "増えている", "んです"],
          correctOrder: ["最近", "有職者が", "増えている", "んです"],
          explanation: "Jawaban tepat: 最近有職者が増えているんです。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar:\n辞職するな！ ・ 簡単に ・ 会社を",
          words: ["簡単に", "会社を", "辞職するな！"],
          correctOrder: ["簡単に", "会社を", "辞職するな！"],
          explanation: "Jawaban tepat: 簡単に会社を辞職するな！"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar:\n職能を ・ 高めようと ・ 研修で ・ 思っています",
          words: ["研修で", "職能を", "高めようと", "思っています"],
          correctOrder: ["研修で", "職能を", "高めようと", "思っています"],
          explanation: "Jawaban tepat: 研修で職能を高めようと思っています。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar:\n詳しく ・ 書類に ・ 書いてあります ・ 職歴が",
          words: ["書類に", "詳しく", "職歴が", "書いてあります"],
          correctOrder: ["書類に", "詳しく", "職歴が", "書いてあります"],
          explanation: "Jawaban tepat: 書類に詳しく職歴が書いてあります。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar:\n休職した ・ 体調が ・ 方が ・ 悪いときは ・ いいです",
          words: ["体調が", "悪いときは", "休職した", "方が", "いいです"],
          correctOrder: ["体調が", "悪いときは", "休職した", "方が", "いいです"],
          explanation: "Jawaban tepat: 体調が悪いときは休職した方がいいです。"
        },
        // b) Grouping quiz
        {
          type: "grouping",
          question: "Kelompokkan jukugo berikut ini ke dalam cabang semantic graph kanji 職 yang tepat.",
          words: ["職業", "職人", "職員", "職場", "求職", "有職", "転職", "退職", "無職"],
          groups: [
            { "Profesi / Pekerjaan": ["職業", "職人"] },
            { "Orang / tempat kerja": ["職員", "職場"] },
            { "Mencari / memiliki pekerjaan": ["求職", "有職"] },
            { "Perubahan / status pekerjaan": ["転職", "退職", "無職"] }
          ],
          explanation: "Pengelompokan jukugo berdasarkan cabang semantic graph kanji 職."
        },
        // c) Multiple choice quizzes
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “profesi atau pekerjaan yang dilakukan seseorang”?",
          options: ["職業", "職場", "職員"],
          correctAnswer: 0,
          explanation: "職業 (shokugyou) adalah profesi atau pekerjaan yang dilakukan seseorang."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “orang yang bekerja sebagai staf atau pegawai”?",
          options: ["職人", "職員", "職業"],
          correctAnswer: 1,
          explanation: "職員 (shokuin) adalah staf atau pegawai."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “tempat seseorang bekerja”?",
          options: ["職場", "職人", "求職"],
          correctAnswer: 0,
          explanation: "職場 (shokuba) adalah tempat seseorang bekerja."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “orang yang memiliki keterampilan tertentu dan bekerja sebagai pengrajin atau pekerja terampil”?",
          options: ["職員", "職人", "職場"],
          correctAnswer: 1,
          explanation: "職人 (shokunin) adalah pengrajin atau pekerja terampil."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “berhenti dari pekerjaan”?",
          options: ["退職", "職業", "有職"],
          correctAnswer: 0,
          explanation: "退職 (taishoku) adalah berhenti dari pekerjaan."
        },
        // d) Fill in the blank quizzes
        {
          type: "fill",
          question: "私は大学を卒業したら、（　　　　）を探すつもりです。",
          options: ["職場", "職業", "求職"],
          correctAnswer: 1,
          explanation: "Jawaban tepat: 職業 (shokugyou / profesi)."
        },
        {
          type: "fill",
          question: "父は銀行で（　　　　）をしています。",
          options: ["職員", "職業", "職人"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: 職員 (shokuin / staf pegawai)."
        },
        {
          type: "fill",
          question: "会社を変えたいんですが、（　　　　）したほうがいいですか。",
          options: ["退職", "転職", "有職"],
          correctAnswer: 1,
          explanation: "Jawaban tepat: 転職 (tenshoku / pindah pekerjaan)."
        },
        {
          type: "fill",
          question: "仕事がないので、今（　　　　）です。",
          options: ["有職", "職人", "無職"],
          correctAnswer: 2,
          explanation: "Jawaban tepat: 無職 (mushoku / tidak bekerja / pengangguran)."
        },
        {
          type: "fill",
          question: "ここは私の（　　　　）です。毎日ここで働いています。",
          options: ["職場", "職業", "求職"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: 職場 (shokuba / tempat kerja)."
        }
      ],
      crossLinks: [
        ["職業", "dilakukan di", "職場"],
        ["職業", "dijalankan oleh", "職員"],
        ["職業", "memerlukan", "職能"],
        ["職人", "bekerja di", "職場"],
        ["職員", "menjalankan", "職務"],
        ["求職", "bertujuan untuk", "就職"],
        ["就職", "menghasilkan status", "有職"],
        ["有職", "memiliki", "職歴"],
        ["転職", "mengubah status", "職業"],
        ["退職", "beralih menjadi", "無職"],
        ["辞職", "merupakan jenis", "退職"],
        ["休職", "berhenti sementara dari", "職務"],
        ["職務", "dicatat dalam", "職歴"],
        ["職業", "berkaitan dengan", "業務"],
        ["職場", "tempat berlangsungnya", "勤務"]
      ]
    },

    "業": {
      romaji: "Gyou",
      meaning: "pekerjaan; usaha; kegiatan",
      bushuu: "木（き）Pohon",
      onyomi: "ギョウ、ゴ",
      kunyomi: "わざ",
      baseMeaning: "Pekerjaan, usaha, atau kegiatan yang dilakukan untuk mencapai suatu tujuan.",
      border: "border-l-4 border-secondary",
      categories: [
        {
          name: "Pekerjaan / Tugas",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan pekerjaan, tugas, kegiatan kerja, serta pelaksanaan suatu pekerjaan.",
          color: "border-blue-500",
          jukugos: [
            {
              word: "業務",
              reading: "ぎょうむ",
              meaning: "Pekerjaan / Tugas",
              explanation: "Hubungan makna antara kanji 業 dan 務 menjadi 業務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tugas atau pekerjaan yang menjadi tanggung jawab seseorang dalam suatu pekerjaan atau organisasi.”",
              charRoles: { "業": "pekerjaan, kegiatan", "務": "tugas, kewajiban" }
            },
            {
              word: "作業",
              reading: "さぎょう",
              meaning: "pekerjaan / tugas",
              explanation: "Hubungan makna antara kanji 作 dan 業 menjadi 作業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pekerjaan atau kegiatan yang dilakukan untuk menyelesaikan suatu tugas.”",
              charRoles: { "作": "mengerjakan, membuat", "業": "pekerjaan, kegiatan" }
            },
            {
              word: "始業",
              reading: "しぎょう",
              meaning: "mulai kerja",
              explanation: "Hubungan makna antara kanji 始 dan 業 menjadi 始業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “dimulainya kegiatan kerja atau waktu ketika pekerjaan dimulai.”",
              charRoles: { "始": "mulai", "業": "pekerjaan, kegiatan" }
            },
            {
              word: "残業",
              reading: "ざんぎょう",
              meaning: "kerja lembur",
              explanation: "Hubungan makna antara kanji 残 dan 業 menjadi 残業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pekerjaan yang dilakukan setelah waktu kerja normal berakhir atau pekerjaan lembur.”",
              charRoles: { "残": "tersisa, tetap", "業": "pekerjaan, kegiatan" }
            },
            {
              word: "就業",
              reading: "しゅうぎょう",
              meaning: "bekerja / mulai bekerja",
              explanation: "Hubungan makna antara kanji 就 dan 業 menjadi 就業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan bekerja atau keadaan seseorang mulai menjalankan suatu pekerjaan.”",
              charRoles: { "就": "mulai melakukan, menjalankan", "業": "pekerjaan, kegiatan" }
            },
            {
              word: "失業",
              reading: "しつぎょう",
              meaning: "kehilangan pekerjaan / pengangguran",
              explanation: "Hubungan makna antara kanji 失 dan 業 menjadi 失業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “keadaan seseorang kehilangan pekerjaan atau tidak memiliki pekerjaan.”",
              charRoles: { "失": "kehilangan", "業": "pekerjaan" }
            }
          ]
        },
        {
          name: "Usaha / Bisnis / Dunia Kerja",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan kegiatan usaha, bisnis, perusahaan, pelaku usaha, dan lingkungan dunia kerja.",
          color: "border-green-500",
          jukugos: [
            {
              word: "営業",
              reading: "えいぎょう",
              meaning: "usaha / bisnis / penjualan",
              explanation: "Hubungan makna antara kanji 営 dan 業 menjadi 営業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan menjalankan usaha atau bisnis, termasuk kegiatan penjualan dan pelayanan.”",
              charRoles: { "営": "menjalankan, mengelola", "業": "usaha, kegiatan" }
            },
            {
              word: "業者",
              reading: "ぎょうしゃ",
              meaning: "pelaku usaha / pedagang",
              explanation: "Hubungan makna antara kanji 業 dan 者 menjadi 業者, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “orang atau pihak yang menjalankan suatu usaha atau pekerjaan tertentu.”",
              charRoles: { "業": "usaha, pekerjaan", "者": "orang, pelaku" }
            },
            {
              word: "業界",
              reading: "ぎょうかい",
              meaning: "dunia usaha / industri",
              explanation: "Hubungan makna antara kanji 業 dan 界 menjadi 業界, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “suatu bidang atau lingkungan usaha dan industri tertentu.”",
              charRoles: { "業": "usaha, pekerjaan", "界": "dunia, bidang" }
            },
            {
              word: "家業",
              reading: "かぎょう",
              meaning: "usaha keluarga",
              explanation: "Hubungan makna antara kanji 家 dan 業 menjadi 家業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “usaha atau pekerjaan yang dijalankan oleh suatu keluarga.”",
              charRoles: { "家": "keluarga, rumah", "業": "usaha, pekerjaan" }
            },
            {
              word: "企業",
              reading: "きぎょう",
              meaning: "perusahaan / usaha",
              explanation: "Hubungan makna antara kanji 企 dan 業 menjadi 企業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perusahaan atau organisasi yang menjalankan kegiatan usaha.”",
              charRoles: { "企": "merencanakan, mengusahakan", "業": "usaha, kegiatan" }
            },
            {
              word: "事業",
              reading: "じぎょう",
              meaning: "usaha / kegiatan bisnis",
              explanation: "Hubungan makna antara kanji 事 dan 業 menjadi 事業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “usaha atau kegiatan yang dilakukan secara terencana, terutama dalam bidang bisnis atau organisasi.”",
              charRoles: { "事": "hal, urusan, kegiatan", "業": "usaha, pekerjaan" }
            },
            {
              word: "自営業",
              reading: "じえいぎょう",
              meaning: "usaha sendiri / wiraswasta",
              explanation: "Hubungan makna antara kanji 自・営 dan 業 menjadi 自営業, menunjukkan bahwa gabungan ketiga kanji tersebut membentuk makna “usaha yang dijalankan dan dikelola oleh seseorang untuk dirinya sendiri.”",
              charRoles: { "自営": "mengelola sendiri", "業": "usaha, pekerjaan" }
            }
          ]
        },
        {
          name: "Bidang Industri / Pekerjaan",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan berbagai bidang industri, pekerjaan, usaha, dan kegiatan ekonomi.",
          color: "border-purple-500",
          jukugos: [
            {
              word: "工業",
              reading: "こうぎょう",
              meaning: "industri",
              explanation: "Hubungan makna antara kanji 工 dan 業 menjadi 工業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bidang industri yang berkaitan dengan kegiatan produksi dan pengolahan barang.”",
              charRoles: { "工": "pekerjaan, teknik, industri", "業": "usaha, kegiatan" }
            },
            {
              word: "農業",
              reading: "のうぎょう",
              meaning: "pertanian",
              explanation: "Hubungan makna antara kanji 農 dan 業 menjadi 農業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bidang usaha atau pekerjaan yang berkaitan dengan pertanian.”",
              charRoles: { "農": "pertanian", "業": "usaha, pekerjaan" }
            },
            {
              word: "漁業",
              reading: "ぎょぎょう",
              meaning: "perikanan",
              explanation: "Hubungan makna antara kanji 漁 dan 業 menjadi 漁業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bidang usaha atau pekerjaan yang berkaitan dengan penangkapan dan pemanfaatan hasil perikanan.”",
              charRoles: { "漁": "menangkap ikan, perikanan", "業": "usaha, pekerjaan" }
            },
            {
              word: "産業",
              reading: "さんぎょう",
              meaning: "industri",
              explanation: "Hubungan makna antara kanji 産 dan 業 menjadi 産業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan atau bidang ekonomi yang menghasilkan barang atau jasa.”",
              charRoles: { "産": "menghasilkan, produksi", "業": "usaha, kegiatan" }
            },
            {
              word: "商業",
              reading: "しょうぎょう",
              meaning: "perdagangan / bisnis",
              explanation: "Hubungan makna antara kanji 商 dan 業 menjadi 商業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan usaha yang berkaitan dengan perdagangan dan jual beli barang atau jasa.”",
              charRoles: { "商": "perdagangan, jual beli", "業": "usaha, kegiatan" }
            }
          ]
        },
        {
          name: "Bentuk / Status Pekerjaan",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan kedudukan atau bentuk pekerjaan yang menjadi kegiatan utama seseorang.",
          color: "border-orange-500",
          jukugos: [
            {
              word: "本業",
              reading: "ほんぎょう",
              meaning: "pekerjaan utama",
              explanation: "Hubungan makna antara kanji 本 dan 業 menjadi 本業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pekerjaan atau usaha utama yang menjadi kegiatan pokok seseorang.”",
              charRoles: { "本": "utama, pokok", "業": "pekerjaan, usaha" }
            }
          ]
        }
      ],
      examples: [
        {
          japanese: "明日までに業務の計画を立てておきます。",
          romaji: "Ashita made ni gyoumu no keikaku wo tatete okimasu.",
          translation: "Sebelum besok, saya akan menyusun rencana tugas/pekerjaan."
        },
        {
          japanese: "ラジオを聞きながら作業をします。",
          romaji: "Rajio wo kikinagara sagyou wo shimasu.",
          translation: "Saya melakukan pekerjaan/tugas sambil mendengarkan radio."
        },
        {
          japanese: "明日の始業時間は9時になるでしょう。",
          romaji: "Ashita no shigyou jikan wa kuji ni naru deshou.",
          translation: "Waktu mulai kerja besok sepertinya jam 9."
        },
        {
          japanese: "仕事が多いから、今夜残業するんです。",
          romaji: "Shigoto ga ooi kara, konya zangyou suru n desu.",
          translation: "Karena pekerjaan banyak, malam ini saya akan lembur."
        },
        {
          japanese: "景気が悪いから、失業する人が増えるかもしれません。",
          romaji: "Keiki ga warui kara, shitsugyou suru hito ga meeru kamo shiremasen.",
          translation: "Karena kondisi ekonomi buruk, orang yang kehilangan pekerjaan mungkin akan bertambah."
        }
      ],
      reflections: [
        "Apa makna dasar kanji 業 yang Anda pahami?",
        "Jukugo mana yang mudah untuk diingat? Mengapa?",
        "Apa perbedaan penggunaan 農業、工業 dan 授業?",
        "Cabang semantic graph mana yang menurut Anda paling mudah dipahami?",
        "Bagaimana cara Anda mengingat hubungan makna antar-jukugo yang mengandung kanji 業?"
      ],
      quizzes: [
        // a) Unscramble sentences
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut menjadi kalimat yang tepat:\n働いている ・ ITの ・ 業界で ・ んです",
          words: ["ITの", "業界で", "働いている", "んです"],
          correctOrder: ["ITの", "業界で", "働いている", "んです"],
          explanation: "Jawaban tepat: ITの業界で働いているんです。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut menjadi kalimat yang tepat:\n家業を ・ と ・ 手伝おう ・ 思っています ・ 将来",
          words: ["将来", "家業を", "手伝おうと", "思っています"],
          correctOrder: ["将来", "家業を", "手伝おうと", "思っています"],
          explanation: "Jawaban tepat: 将来家業を手伝おうと思っています。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut menjadi kalimat yang tepat:\n営業の ・ はってあります ・ 紙が ・ ドアに",
          words: ["ドアに", "営業の", "紙が", "はってあります"],
          correctOrder: ["ドアに", "営業の", "紙が", "はってあります"],
          explanation: "Jawaban tepat: ドアに営業の紙がはってあります。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut menjadi kalimat yang tepat:\n農業を ・ 勉強しながら ・ 手伝います ・ 実家の",
          words: ["勉強しながら", "実家の", "農業を", "手伝います"],
          correctOrder: ["勉強しながら", "実家の", "農業を", "手伝います"],
          explanation: "Jawaban tepat: 勉強しながら実家の農業を手伝います。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut menjadi kalimat yang tepat:\n商業の ・ 忘れるな！ ・ 基本を",
          words: ["商業の", "基本を", "忘れるな！"],
          correctOrder: ["商業の", "基本を", "忘れるな！"],
          explanation: "Jawaban tepat: 商業の基本を忘れるな！"
        },
        // b) Grouping quiz
        {
          type: "grouping",
          question: "Kelompokkan jukugo berikut ini ke dalam cabang semantic graph kanji 業 yang tepat.",
          words: ["業務", "作業", "残業", "営業", "業者", "企業", "工業", "農業", "商業", "本業"],
          groups: [
            { "Pekerjaan / Tugas": ["業務", "作業", "残業"] },
            { "Usaha / Bisnis / Dunia Kerja": ["営業", "業者", "企業"] },
            { "Bidang Industri / Pekerjaan": ["工業", "農業", "商業"] },
            { "Bentuk / Status Pekerjaan": ["本業"] }
          ],
          explanation: "Pengelompokan jukugo berdasarkan cabang semantic graph kanji 業."
        },
        // c) Multiple choice quizzes
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “tugas atau pekerjaan yang dilakukan dalam suatu kegiatan atau usaha”?",
          options: ["業務", "営業", "工業"],
          correctAnswer: 0,
          explanation: "業務 (gyoumu) adalah tugas atau pekerjaan yang dilakukan dalam suatu kegiatan/usaha."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “pekerjaan atau tugas yang dilakukan”?",
          options: ["作業", "業界", "本業"],
          correctAnswer: 0,
          explanation: "作業 (sagyou) adalah pekerjaan atau tugas yang dilakukan."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “mulai bekerja”?",
          options: ["就業", "始業", "農業"],
          correctAnswer: 1,
          explanation: "始業 (shigyou) berhubungan dengan dimulainya jam kerja."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “usaha atau kegiatan bisnis yang dilakukan untuk menjual barang atau jasa”?",
          options: ["工業", "営業", "漁業"],
          correctAnswer: 1,
          explanation: "営業 (eigyou) adalah kegiatan usaha atau bisnis penjualan."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “pekerjaan utama seseorang”?",
          options: ["家業", "本業", "産業"],
          correctAnswer: 1,
          explanation: "本業 (hongyou) adalah pekerjaan utama seseorang."
        },
        // d) Fill in the blank quizzes
        {
          type: "fill",
          question: "会社では、毎日いろいろな（　　　　）があります。",
          options: ["業務", "工業", "農業"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: 業務 (gyoumu / tugas pekerjaan)."
        },
        {
          type: "fill",
          question: "日本の（　　　　）は自動車などで有名です。",
          options: ["農業", "工業", "本業"],
          correctAnswer: 1,
          explanation: "Jawaban tepat: 工業 (kougyou / industri manufaktur)."
        },
        {
          type: "fill",
          question: "毎日、会社で（　　　　）をしています。",
          options: ["作業", "漁業", "産業"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: 作業 (sagyou / pekerjaan tugas)."
        },
        {
          type: "fill",
          question: "今日は仕事が多いので、（　　　　）するかもしれません。",
          options: ["始業", "残業", "失業"],
          correctAnswer: 1,
          explanation: "Jawaban tepat: 残業 (zangyou / lembur)."
        },
        {
          type: "fill",
          question: "会社は午前9時から（　　　　）します。",
          options: ["始業", "失業", "本業"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: 始業 (shigyou / mulai bekerja)."
        }
      ],
      crossLinks: [
        ["始業", "memulai", "業務"],
        ["業務", "mencakup", "作業"],
        ["作業", "melebihi jam kerja menjadi", "残業"],
        ["就業", "kebalikan dari", "失業"],
        ["企業", "menjalankan", "事業"],
        ["事業者", "mengelola", "企業"],
        ["企業", "berada dalam", "業界"],
        ["営業", "merupakan kegiatan utama", "企業"],
        ["家業", "merupakan bentuk khusus", "事業"],
        ["産業", "terdiri dari", "工業"],
        ["産業", "mencakup", "農業"],
        ["産業", "mencakup", "漁業"],
        ["業務", "dilakukan dalam", "営業"],
        ["事業", "dilakukan oleh", "企業"],
        ["残業", "terjadi di", "職場"]
      ]
    },

    "商": {
      romaji: "Shou",
      meaning: "Perdagangan / bisnis",
      bushuu: "口（くち・くちへん）",
      onyomi: "ショウ",
      kunyomi: "あきな（う）・はか（る）",
      baseMeaning: "Perdagangan atau bisnis, khususnya kegiatan jual beli barang atau jasa",
      border: "border-l-4 border-tertiary",
      categories: [
        {
          name: "Tempat Perdagangan",
          description: "Kelompok ini berkaitan dengan tempat berlangsungnya kegiatan perdagangan atau tempat yang digunakan untuk melakukan kegiatan jual beli.",
          color: "border-green-500",
          jukugos: [
            {
              word: "商店",
              reading: "しょうてん",
              meaning: "toko",
              explanation: "Hubungan makna antar kanji 商 dan 店 menjadi 商店, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “toko atau tempat untuk melakukan kegiatan perdagangan.”",
              charRoles: { "商": "perdagangan, bisnis", "店": "toko, tempat berjualan" }
            },
            {
              word: "商店街",
              reading: "しょうてんがい",
              meaning: "kawasan pertokoan",
              explanation: "Hubungan makna antar kanji 商・店・街 menjadi 商店街, menunjukkan bahwa gabungan ketiga kanji tersebut membentuk makna “kawasan yang terdiri atas toko-toko atau tempat berlangsungnya kegiatan perdagangan.”",
              charRoles: { "商店": "toko", "街": "jalan, kawasan" }
            }
          ]
        },
        {
          name: "Produk / Barang Dagangan",
          description: "Kelompok ini berkaitan dengan barang atau produk yang diperjualbelikan dalam kegiatan perdagangan.",
          color: "border-blue-500",
          jukugos: [
            {
              word: "商品",
              reading: "しょうひん",
              meaning: "barang / produk",
              explanation: "Hubungan makna antar kanji 商 dan 品 menjadi 商品, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “barang atau produk yang diperjualbelikan dalam kegiatan perdagangan.”",
              charRoles: { "商": "perdagangan, bisnis", "品": "barang, produk" }
            }
          ]
        },
        {
          name: "Kegiatan Perdagangan",
          description: "Kelompok ini berkaitan dengan kegiatan, transaksi, atau aktivitas yang dilakukan dalam perdagangan dan bisnis.",
          color: "border-orange-500",
          jukugos: [
            {
              word: "商売",
              reading: "しょうばい",
              meaning: "bisnis / perdagangan",
              explanation: "Hubungan makna antar kanji 商 dan 売 menjadi 商売, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan bisnis atau perdagangan yang dilakukan melalui aktivitas jual beli.”",
              charRoles: { "商": "perdagangan, bisnis", "売": "menjual, penjualan" }
            },
            {
              word: "商業",
              reading: "しょうぎょう",
              meaning: "perdagangan",
              explanation: "Hubungan makna antar kanji 商 dan 業 menjadi 商業, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan usaha atau bisnis dalam bidang perdagangan.”",
              charRoles: { "商": "perdagangan, bisnis", "業": "pekerjaan, usaha, kegiatan" }
            },
            {
              word: "商取引",
              reading: "しょうとりひき",
              meaning: "transaksi perdagangan",
              explanation: "Hubungan makna antar kanji 商・取・引 menjadi 商取引, menunjukkan bahwa gabungan ketiga kanji tersebut membentuk makna “kegiatan transaksi yang dilakukan dalam perdagangan atau bisnis.”",
              charRoles: { "商": "perdagangan, bisnis", "取引": "transaksi" }
            }
          ]
        },
        {
          name: "Pelaku Perdagangan",
          description: "Kelompok ini berkaitan dengan orang yang melakukan kegiatan perdagangan atau menjalankan aktivitas bisnis.",
          color: "border-purple-500",
          jukugos: [
            {
              word: "商人",
              reading: "しょうにん",
              meaning: "pedagang",
              explanation: "Hubungan makna antar kanji 商 dan 人 menjadi 商人, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “orang yang melakukan kegiatan perdagangan atau berdagang.”",
              charRoles: { "商": "perdagangan, bisnis", "人": "orang" }
            }
          ]
        },
        {
          name: "Jenis Usaha",
          description: "Kelompok ini berkaitan dengan bentuk atau jenis usaha yang bergerak dalam bidang perdagangan dan bisnis.",
          color: "border-yellow-500",
          jukugos: [
            {
              word: "商社",
              reading: "しょうしゃ",
              meaning: "perusahaan dagang",
              explanation: "Hubungan makna antar kanji 商 dan 社 menjadi 商社, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “perusahaan yang bergerak dalam kegiatan perdagangan atau bisnis.”",
              charRoles: { "商": "perdagangan, bisnis", "社": "perusahaan, organisasi" }
            }
          ]
        }
      ],
      examples: [
        {
          japanese: "商店の前にポスターがはってあります。",
          romaji: "Shouten no mae ni posutaa ga hatte arimasu.",
          translation: "Di depan toko tertempel poster."
        },
        {
          japanese: "散歩しながら商店街で買い物します。",
          romaji: "Sanpo shinagara shoutengai de kaimono shimasu.",
          translation: "Sambil jalan-jalan, saya berbelanja di kawasan pertokoan."
        },
        {
          japanese: "お客様が来る前に商品を準備しておきます。",
          romaji: "Okyakusama ga kuru mae ni shouhin wo junbi shite okimasu.",
          translation: "Sebelum pelanggan datang, bersiaplah menyiapkan produk."
        },
        {
          japanese: "この町で商売をしているんです。",
          romaji: "Kono machi de shoubai wo shiteiru n desu.",
          translation: "Saya menjalankan bisnis/perdagangan di kota ini."
        },
        {
          japanese: "ここは商業の中心地になるでしょう。",
          romaji: "Koko wa shougyou no chuushinchi ni naru deshou.",
          translation: "Tempat ini sepertinya akan menjadi pusat perdagangan."
        }
      ],
      reflections: [
        "Apa makna dasar kanji 商 yang Anda pahami?",
        "Jukugo mana yang mudah untuk diingat? Mengapa?",
        "Apa perbedaan penggunaan 商人、商売、dan 商店?",
        "Cabang semantic graph mana yang menurut Anda paling mudah dipahami?",
        "Bagaimana cara Anda mengingat hubungan makna antar-jukugo yang mengandung kanji 商?"
      ],
      quizzes: [
        // a) Unscramble sentences
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut menjadi kalimat yang tepat:\n商社で ・ 働こうと ・ 有名な ・ 思っています",
          words: ["有名な", "商社で", "働こうと", "思っています"],
          correctOrder: ["有名な", "商社で", "働こうと", "思っています"],
          explanation: "Jawaban tepat: 有名な商社で働こうと思っています。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut menjadi kalimat yang tepat:\n準備した ・ 商談の ・ ほうが ・ いいです ・ 前に",
          words: ["商談の", "前に", "準備した", "ほうが", "いいです"],
          correctOrder: ["商談の", "前に", "準備した", "ほうが", "いいです"],
          explanation: "Jawaban tepat: 商談の前に準備したほうがいいです。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut menjadi kalimat yang tepat:\nんです ・ 書類を ・ 商工会議所に ・ 出す",
          words: ["商工会議所に", "書類を", "出す", "んです"],
          correctOrder: ["商工会議所に", "書類を", "出す", "んです"],
          explanation: "Jawaban tepat: 商工会議所に書類を出すんです。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut menjadi kalimat yang tepat:\n港に ・ 到着するかもしれません ・ 大きな ・ 商船が",
          words: ["港に", "大きな", "商船が", "到着するかもしれません"],
          correctOrder: ["港に", "大きな", "商船が", "到着するかもしれません"],
          explanation: "Jawaban tepat: 港に大きな商船が到着するかもしれません。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut menjadi kalimat yang tepat:\n会社の ・ 商号を ・ 変更して ・ おきます ・ 事前に",
          words: ["事前に", "会社の", "商号を", "変更して", "おきます"],
          correctOrder: ["事前に", "会社の", "商号を", "変更して", "おきます"],
          explanation: "Jawaban tepat: 事前に会社の商号を変更しておきます。"
        },
        // b) Grouping quiz
        {
          type: "grouping",
          question: "Kelompokkan jukugo berikut ini ke dalam cabang semantic graph kanji 商 yang tepat.",
          words: ["商店", "商店街", "商品", "商売", "商業", "商取引", "商人", "商社"],
          groups: [
            { "Tempat": ["商店", "商店街"] },
            { "Produk": ["商品"] },
            { "Kegiatan": ["商売", "商業", "商取引"] },
            { "Pelaku": ["商人"] },
            { "Jenis Usaha": ["商社"] }
          ],
          explanation: "Pengelompokan jukugo berdasarkan cabang semantic graph kanji 商."
        },
        // c) Multiple choice quizzes
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “toko atau tempat untuk melakukan kegiatan perdagangan”?",
          options: ["商店", "商品", "商人"],
          correctAnswer: 0,
          explanation: "商店 (shouten) adalah toko atau tempat berdagang."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “kawasan yang terdiri atas toko-toko”?",
          options: ["商社", "商店街", "商売"],
          correctAnswer: 1,
          explanation: "商店街 (shoutengai) adalah kawasan pertokoan."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “barang atau produk yang diperjualbelikan”?",
          options: ["商人", "商業", "商品"],
          correctAnswer: 2,
          explanation: "商品 (shouhin) adalah barang atau produk dagangan."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “kegiatan bisnis atau perdagangan”?",
          options: ["商売", "商店", "商人"],
          correctAnswer: 0,
          explanation: "商売 (shoubai) adalah kegiatan bisnis atau perdagangan."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “kegiatan usaha dalam bidang perdagangan”?",
          options: ["商業", "商社", "商店街"],
          correctAnswer: 0,
          explanation: "商業 (shougyou) adalah kegiatan usaha dalam bidang perdagangan."
        },
        // d) Fill in the blank quizzes
        {
          type: "fill",
          question: "駅の近くに新しい（　　　　）ができました。",
          options: ["商店", "商品", "商人"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: 商店 (shouten / toko)."
        },
        {
          type: "fill",
          question: "デパートで新しい（　　　　）を買いました。",
          options: ["商店街", "商品", "商社"],
          correctAnswer: 1,
          explanation: "Jawaban tepat: 商品 (shouhin / barang produk)."
        },
        {
          type: "fill",
          question: "父は会社で（　　　　）の仕事をしています。",
          options: ["商取引", "商人", "商店"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: 商取引 (shoutorihiki / transaksi perdagangan)."
        },
        {
          type: "fill",
          question: "日本の（　　　　）について勉強しています。",
          options: ["商業", "商店", "商品"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: 商業 (shougyou / bidang perdagangan)."
        },
        {
          type: "fill",
          question: "この店ではいろいろな商品を（　　　　）しています。",
          options: ["商人", "商店街", "商売"],
          correctAnswer: 2,
          explanation: "Jawaban tepat: 商売 (shoubai / memperdagangkan/bisnis)."
        }
      ],
      crossLinks: [
        ["商店", "berlokasi di", "商店街"],
        ["本店", "mengawasi", "商店"],
        ["商店", "menjual", "商品"],
        ["商売", "melakukan", "取引"],
        ["商談", "bertujuan menyepakati", "取引"],
        ["商社", "menjalankan", "商業"],
        ["商社", "melakukan", "商談"],
        ["商社", "memiliki", "商号"],
        ["商工会議所", "mendukung", "商業"],
        ["商船", "mengangkut", "商品"],
        ["商売", "merupakan bagian dari", "商業"],
        ["商品", "dijual di", "商店"],
        ["商談", "dilakukan oleh", "商社"]
      ]
    },

    "務": {
      romaji: "Mu",
      meaning: "Tugas, pekerjaan, kewajiban",
      bushuu: "力（ちから）",
      onyomi: "ム",
      kunyomi: "（つと）める",
      baseMeaning: "Tugas, pekerjaan, atau kewajiban yang harus dilakukan",
      border: "border-l-4 border-primary",
      categories: [
        {
          name: "Pekerjaan / Tugas",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan pekerjaan, tugas, atau aktivitas yang dilakukan dalam suatu pekerjaan.",
          color: "border-blue-500",
          jukugos: [
            {
              word: "業務",
              reading: "ぎょうむ",
              meaning: "pekerjaan / tugas",
              explanation: "Hubungan makna antar kanji 業 dan 務 menjadi 業務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pekerjaan atau tugas yang dilakukan dalam suatu kegiatan atau usaha.”",
              charRoles: { "業": "pekerjaan, usaha, kegiatan", "務": "tugas, pekerjaan, urusan" }
            },
            {
              word: "職務",
              reading: "しょくむ",
              meaning: "tugas / pekerjaan jabatan",
              explanation: "Hubungan makna antar kanji 職 dan 務 menjadi 職務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tugas atau pekerjaan yang berkaitan dengan suatu jabatan.”",
              charRoles: { "職": "pekerjaan, jabatan, profesi", "務": "tugas, pekerjaan, kewajiban" }
            },
            {
              word: "勤務",
              reading: "きんむ",
              meaning: "bekerja / bertugas",
              explanation: "Hubungan makna antar kanji 勤 dan 務 menjadi 勤務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “melaksanakan pekerjaan atau menjalankan tugas dalam suatu pekerjaan.”",
              charRoles: { "勤": "bekerja, menjalankan tugas", "務": "tugas, pekerjaan" }
            },
            {
              word: "実務",
              reading: "じつむ",
              meaning: "pekerjaan praktis",
              explanation: "Hubungan makna antar kanji 実 dan 務 menjadi 実務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pekerjaan yang bersifat praktis atau pekerjaan yang benar-benar dilaksanakan.”",
              charRoles: { "実": "nyata, praktik, kenyataan", "務": "tugas, pekerjaan" }
            },
            {
              word: "事務",
              reading: "じむ",
              meaning: "pekerjaan administrasi / urusan kantor",
              explanation: "Hubungan makna antar kanji 事 dan 務 menjadi 事務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “urusan atau pekerjaan administratif yang perlu dilaksanakan.”",
              charRoles: { "事": "urusan, hal, perkara", "務": "tugas, pekerjaan, urusan" }
            }
          ]
        },
        {
          name: "Tugas / Kewajiban",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan tugas yang diberikan, kewajiban, atau tanggung jawab yang harus dilaksanakan.",
          color: "border-green-500",
          jukugos: [
            {
              word: "任務",
              reading: "にんむ",
              meaning: "tugas / misi",
              explanation: "Hubungan makna antar kanji 任 dan 務 menjadi 任務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tugas atau misi yang dipercayakan kepada seseorang untuk dilaksanakan.”",
              charRoles: { "任": "tugas, tanggung jawab, penugasan", "務": "tugas, pekerjaan, kewajiban" }
            },
            {
              word: "義務",
              reading: "ぎむ",
              meaning: "kewajiban",
              explanation: "Hubungan makna antar kanji 義 dan 務 menjadi 義務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kewajiban yang harus dilakukan atau dipenuhi.”",
              charRoles: { "義": "kewajiban, prinsip", "務": "tugas, kewajiban" }
            },
            {
              word: "公務",
              reading: "こうむ",
              meaning: "tugas / pekerjaan resmi",
              explanation: "Hubungan makna antar kanji 公 dan 務 menjadi 公務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tugas atau pekerjaan resmi yang berkaitan dengan kepentingan umum atau pelayanan publik.”",
              charRoles: { "公": "umum, publik, resmi", "務": "tugas, pekerjaan" }
            }
          ]
        },
        {
          name: "Urusan / Pelaksanaan Tugas",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan pelaksanaan tugas atau urusan pekerjaan dalam bidang tertentu.",
          color: "border-orange-500",
          jukugos: [
            {
              word: "労務",
              reading: "ろうむ",
              meaning: "urusan / pekerjaan tenaga kerja",
              explanation: "Hubungan makna antar kanji 労 dan 務 menjadi 労務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “urusan atau pekerjaan yang berkaitan dengan tenaga kerja.”",
              charRoles: { "労": "tenaga, kerja, usaha", "務": "tugas, pekerjaan, urusan" }
            },
            {
              word: "服務",
              reading: "ふくむ",
              meaning: "menjalankan tugas / dinas",
              explanation: "Hubungan makna antar kanji 服 dan 務 menjadi 服務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menjalankan tugas atau melakukan pekerjaan dalam suatu dinas.”",
              charRoles: { "服": "melayani, menaati, menjalankan", "務": "tugas, pekerjaan" }
            },
            {
              word: "用務",
              reading: "ようむ",
              meaning: "urusan / keperluan pekerjaan",
              explanation: "Hubungan makna antar kanji 用 dan 務 menjadi 用務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “urusan atau keperluan yang berkaitan dengan pekerjaan.”",
              charRoles: { "用": "keperluan, penggunaan, urusan", "務": "tugas, pekerjaan, urusan" }
            }
          ]
        },
        {
          name: "Bidang / Urusan Tugas",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan urusan atau tugas yang berada dalam bidang pekerjaan tertentu.",
          color: "border-purple-500",
          jukugos: [
            {
              word: "財務",
              reading: "ざいむ",
              meaning: "urusan keuangan",
              explanation: "Hubungan makna antar kanji 財 dan 務 menjadi 財務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “urusan atau tugas yang berkaitan dengan keuangan.”",
              charRoles: { "財": "harta, keuangan, kekayaan", "務": "tugas, pekerjaan, urusan" }
            },
            {
              word: "教務",
              reading: "きょうむ",
              meaning: "urusan / tugas pendidikan",
              explanation: "Hubungan makna antar kanji 教 dan 務 menjadi 教務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “urusan atau tugas yang berkaitan dengan kegiatan pendidikan.”",
              charRoles: { "教": "mengajar, pendidikan, ajaran", "務": "tugas, pekerjaan, urusan" }
            },
            {
              word: "法務",
              reading: "ほうむ",
              meaning: "urusan / tugas hukum",
              explanation: "Hubungan makna antar kanji 法 dan 務 menjadi 法務, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “urusan atau tugas yang berkaitan dengan hukum.”",
              charRoles: { "法": "hukum, aturan, ketentuan", "務": "tugas, pekerjaan, urusan" }
            }
          ]
        }
      ],
      examples: [
        {
          japanese: "自分の職務をよく確認しておきます。",
          romaji: "Jibun no shokumu wo yoku kakunin shite okimasu.",
          translation: "Sebelum beraktivitas, periksalah tugas jabatan sendiri dengan baik."
        },
        {
          japanese: "東京の支社で勤務しているんです。",
          romaji: "Toukyou no shisha de kinmu shiteiru n desu.",
          translation: "Saya bekerja/bertugas di kantor cabang Tokyo."
        },
        {
          japanese: "お茶を飲みながら事務をします。",
          romaji: "Ocha wo nominagara jimu wo shimasu.",
          translation: "Saya melakukan pekerjaan administrasi sambil minum teh."
        },
        {
          japanese: "大学で実務の経験を増やそうと思っています。",
          romaji: "Daigaku de jitsumu no keiken wo fuyasou to omotteimasu.",
          translation: "Saya berencana menambah pengalaman praktis di universitas."
        },
        {
          japanese: "社長は公務で出張するでしょう。",
          romaji: "Shachou wa koumu de shutchou suru deshou.",
          translation: "Direktur sepertinya akan berdinas ke luar kota untuk tugas resmi."
        }
      ],
      reflections: [
        "Apa makna dasar kanji 務 yang Anda pahami?",
        "Jukugo 務 mana yang mudah untuk diingat? Mengapa?",
        "Apa perbedaan penggunaan 義務、勤務、dan 教務?",
        "Cabang semantic graph mana yang menurut Anda paling mudah dipahami?",
        "Bagaimana cara Anda mengingat hubungan makna antar-jukugo yang mengandung kanji 務?"
      ],
      quizzes: [
        // a) Unscramble sentences
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut menjadi kalimat yang tepat:\n業務の ・ マニュアルが ・ おいてあります ・ 机に",
          words: ["机に", "業務の", "マニュアルが", "おいてあります"],
          correctOrder: ["机に", "業務の", "マニュアルが", "おいてあります"],
          explanation: "Jawaban tepat: 机に業務のマニュアルがおいてあります。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut menjadi kalimat yang tepat:\n用務員室へ ・ んです ・ 用務が ・ 行く ・ あるから",
          words: ["用務が", "あるから", "用務員室へ", "行く", "んです"],
          correctOrder: ["用務が", "あるから", "用務員室へ", "行く", "んです"],
          explanation: "Jawaban tepat: 用務があるから用務員室へ行くんです。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut menjadi kalimat yang tepat:\n教務課に ・ 書類を ・ 前に ・ 出して ・ おきます",
          words: ["前に", "教務課に", "書類を", "出して", "おきます"],
          correctOrder: ["前に", "教務課に", "書類を", "出して", "おきます"],
          explanation: "Jawaban tepat: 前に教務課に書類を出しておきます。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut menjadi kalimat yang tepat:\n法務部に ・ 確認した ・ ほうが ・ 先に ・ いいです",
          words: ["先に", "法務部に", "確認した", "ほうが", "いいです"],
          correctOrder: ["先に", "法務部に", "確認した", "ほうが", "いいです"],
          explanation: "Jawaban tepat: 先に法務部に確認したほうがいいです。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut menjadi kalimat yang tepat:\n労務が ・ 大変に ・ になるかもしれません ・ 急に",
          words: ["急に", "労務が", "大変に", "なるかもしれません"],
          correctOrder: ["急に", "労務が", "大変に", "なるかもしれません"],
          explanation: "Jawaban tepat: 急に労務が大変になるかもしれません。"
        },
        // b) Grouping quiz
        {
          type: "grouping",
          question: "Kelompokkan jukugo berikut ini ke dalam cabang semantic graph kanji 務 yang tepat.",
          words: ["業務", "職務", "勤務", "任務", "義務", "公務", "労務", "服務", "用務", "財務", "教務", "法務"],
          groups: [
            { "Pekerjaan / Tugas": ["業務", "職務", "勤務"] },
            { "Tugas / Kewajiban": ["任務", "義務", "公務"] },
            { "Urusan / Pelaksanaan Tugas": ["労務", "服務", "用務"] },
            { "Bidang / Urusan Tugas": ["財務", "教務", "法務"] }
          ],
          explanation: "Pengelompokan jukugo berdasarkan cabang semantic graph kanji 務."
        },
        // c) Multiple choice quizzes
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “pekerjaan atau tugas yang dilakukan dalam suatu kegiatan atau usaha”?",
          options: ["業務", "任務", "財務"],
          correctAnswer: 0,
          explanation: "業務 (gyoumu) adalah tugas/pekerjaan dalam kegiatan usaha."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “tugas atau pekerjaan yang berkaitan dengan suatu jabatan”?",
          options: ["職務", "用務", "労務"],
          correctAnswer: 0,
          explanation: "職務 (shokumu) adalah tugas pekerjaan berkaitan dengan jabatan."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “kegiatan bekerja atau menjalankan tugas dalam suatu pekerjaan”?",
          options: ["義務", "勤務", "法務"],
          correctAnswer: 1,
          explanation: "勤務 (kinmu) adalah kegiatan bekerja/menjalankan tugas."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “tugas atau misi yang dipercayakan kepada seseorang”?",
          options: ["任務", "実務", "教務"],
          correctAnswer: 0,
          explanation: "任務 (ninmu) adalah tugas atau misi penugasan."
        },
        {
          type: "multiple",
          question: "Jukugo mana yang berhubungan dengan makna “kewajiban yang harus dilakukan atau dipenuhi”?",
          options: ["公務", "義務", "服務"],
          correctAnswer: 1,
          explanation: "義務 (gimu) adalah kewajiban yang harus dipenuhi."
        },
        // d) Fill in the blank quizzes
        {
          type: "fill",
          question: "会社で毎日（　　　　）をしています。",
          options: ["業務", "義務", "財務"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: 業務 (gyoumu / pekerjaan tugas)."
        },
        {
          type: "fill",
          question: "私は会社で営業の（　　　　）をしています。",
          options: ["職務", "法務", "教務"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: 職務 (shokumu / tugas jabatan)."
        },
        {
          type: "fill",
          question: "父は会社に毎日（　　　　）しています。",
          options: ["任務", "勤務", "財務"],
          correctAnswer: 1,
          explanation: "Jawaban tepat: 勤務 (kinmu / bekerja bertugas)."
        },
        {
          type: "fill",
          question: "この仕事は私の（　　　　）ですから、しなければなりません。",
          options: ["義務", "用務", "服務"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: 義務 (gimu / kewajiban)."
        },
        {
          type: "fill",
          question: "明日の会議について、資料を準備して（　　　　）必要があります。",
          options: ["公務", "用務", "義務"],
          correctAnswer: 1,
          explanation: "Jawaban tepat: 用務 (youmu / urusan keperluan)."
        }
      ],
      crossLinks: [
        ["職務", "dilaksanakan dalam", "勤務"],
        ["勤務", "melibatkan", "事務"],
        ["事務", "menjadi dasar", "実務"],
        ["公務", "dijalankan oleh", "公務員"],
        ["公務員", "memiliki kewajiban", "服務"],
        ["教務", "mengurus", "用務"],
        ["法務", "menangani hukum", "職務"],
        ["財務", "mengelola anggaran", "実務"],
        ["労務", "mengatur kondisi", "勤務"],
        ["職務", "mencakup", "法務"],
        ["財務", "mengurus anggaran", "業務"]
      ]
    },

    "術": {
      romaji: "Jutsu",
      meaning: "Teknik; metode; keterampilan",
      bushuu: "行（ぎょうがまえ）",
      onyomi: "ジュツ",
      kunyomi: "-",
      baseMeaning: "Teknik, metode, atau cara yang digunakan untuk melakukan sesuatu",
      border: "border-l-4 border-secondary",
      categories: [
        {
          name: "Teknik / Keterampilan",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan teknik, keterampilan, atau cara khusus untuk melakukan suatu tindakan.",
          color: "border-blue-500",
          jukugos: [
            {
              word: "技術",
              reading: "ぎじゅつ",
              meaning: "teknik / keterampilan",
              explanation: "Hubungan makna antar kanji 技 dan 術 menjadi 技術, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “teknik atau keterampilan untuk melakukan sesuatu.”",
              charRoles: { "技": "keterampilan, teknik, keahlian", "術": "teknik, keterampilan, metode" }
            },
            {
              word: "手術",
              reading: "しゅじゅつ",
              meaning: "operasi",
              explanation: "Hubungan makna antar kanji 手 dan 術 menjadi 手術, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tindakan medis yang dilakukan dengan teknik atau metode tertentu.”",
              charRoles: { "手": "tangan", "術": "teknik, metode, cara" }
            },
            {
              word: "話術",
              reading: "わじゅつ",
              meaning: "keterampilan berbicara",
              explanation: "Hubungan makna antar kanji 話 dan 術 menjadi 話術, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “teknik atau keterampilan dalam berbicara.”",
              charRoles: { "話": "berbicara, percakapan", "術": "teknik, keterampilan, metode" }
            },
            {
              word: "秘術",
              reading: "ひじゅつ",
              meaning: "teknik rahasia",
              explanation: "Hubungan makna antar kanji 秘 dan 術 menjadi 秘術, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “teknik atau metode khusus yang dirahasiakan.”",
              charRoles: { "秘": "rahasia, tersembunyi", "術": "teknik, metode, keterampilan" }
            },
            {
              word: "戦術",
              reading: "せんじゅつ",
              meaning: "taktik / strategi",
              explanation: "Hubungan makna antar kanji 戦 dan 術 menjadi 戦術, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “taktik atau metode yang digunakan dalam pertandingan atau pertempuran.”",
              charRoles: { "戦": "perang, bertanding", "術": "teknik, metode" }
            },
            {
              word: "心術",
              reading: "しんじゅつ",
              meaning: "sikap mental / niat hati",
              explanation: "Hubungan makna antar kanji 心 dan 術 menjadi 心術, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “sikap mental, niat hati, atau cara berpikir seseorang.”",
              charRoles: { "心": "hati, pikiran", "術": "metode, teknik, sikap" }
            }
          ]
        },
        {
          name: "Ilmu / Pengetahuan",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan ilmu, pengetahuan, atau metode keilmuan tertentu.",
          color: "border-green-500",
          jukugos: [
            {
              word: "学術",
              reading: "がくじゅつ",
              meaning: "ilmu / akademik",
              explanation: "Hubungan makna antar kanji 学 dan 術 menjadi 学術, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “ilmu atau bidang akademik yang memiliki pengetahuan dan metode tertentu.”",
              charRoles: { "学": "belajar, ilmu, pengetahuan", "術": "teknik, metode, keahlian" }
            },
            {
              word: "算術",
              reading: "さんじゅつ",
              meaning: "ilmu hitung",
              explanation: "Hubungan makna antar kanji 算 dan 術 menjadi 算術, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “metode atau ilmu yang berkaitan dengan perhitungan.”",
              charRoles: { "算": "menghitung, perhitungan", "術": "teknik, metode, cara" }
            }
          ]
        },
        {
          name: "Seni / Keahlian Seni",
          description: "Kelompok ini menunjukkan makna yang berkaitan dengan seni dan keterampilan untuk menghasilkan karya seni.",
          color: "border-orange-500",
          jukugos: [
            {
              word: "芸術",
              reading: "げいじゅつ",
              meaning: "seni",
              explanation: "Hubungan makna antar kanji 芸 dan 術 menjadi 芸術, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “seni yang melibatkan keterampilan dan teknik tertentu.”",
              charRoles: { "芸": "seni, keterampilan, karya seni", "術": "teknik, keterampilan, metode" }
            },
            {
              word: "美術",
              reading: "びじゅつ",
              meaning: "seni rupa",
              explanation: "Hubungan makna antar kanji 美 dan 術 menjadi 美術, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “seni yang berkaitan dengan keindahan dan karya seni rupa.”",
              charRoles: { "美": "indah, keindahan", "術": "teknik, keterampilan, metode" }
            }
          ]
        }
      ],
      examples: [
        {
          japanese: "日本の新しい技術を勉強しようと思っています。",
          romaji: "Nihon no atarashii gijutsu wo benkyou shou to omotte imasu.",
          translation: "Saya bermaksud mempelajari teknologi/teknik baru Jepang."
        },
        {
          japanese: "早く病院で手術を受けたほうがいいです。",
          romaji: "Hayaku byouin de shujutsu wo uketa hou ga ii desu.",
          translation: "Lebih baik segera menjalani operasi di rumah sakit."
        },
        {
          japanese: "先生の話術を聞きながらメモをとります。",
          romaji: "Sensei no wajutsu wo kikingara memo wo torimasu.",
          translation: "Saya mencatat sambil mendengarkan teknik berbicara guru."
        },
        {
          japanese: "会議の前に学術論文を読んでおきます。",
          romaji: "Kaigi no mae ni gakujutsu ronbun wo yonde okimasu.",
          translation: "Saya membaca makalah akademis sebelum rapat."
        },
        {
          japanese: "子供のとき算術を習ったんです。",
          romaji: "Kodomo no toki sanjutsu wo naratta n desu.",
          translation: "Sewaktu kecil saya belajar ilmu berhitung/aritmatika."
        }
      ],
      reflections: [
        "Apa makna dasar kanji 術 yang Anda pahami dalam konteks teknik, keahlian, dan seni?",
        "Sebutkan perbedaan bidang penggunaan antara 技術 (teknologi/keterampilan), 学術 (ilmu/akademik), dan 芸術 (seni)!",
        "Mengapa 手術 (operasi) menggunakan kanji 手 (tangan) dan 術 (metode/teknik)?",
        "Sebutkan jukugo kanji 術 yang berhubungan dengan bidang seni rupa dan estetika!",
        "Bagaimana hubungan makna kanji 術 saat digabungkan dengan 技 (技術) dan 美 (美術)?"
      ],
      quizzes: [
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar:\n書いてあります ・ 秘術が ・ 古い ・ 書物に",
          words: ["古い", "書物に", "秘術が", "書いてあります。"],
          correctOrder: ["古い", "書物に", "秘術が", "書いてあります。"],
          explanation: "Jawaban tepat: 古い書物に秘術が書いてあります。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar:\n変えよう ・ 試合の ・ 思っています ・ 戦術を ・ と",
          words: ["試合の", "戦術を", "変えようと", "思っています。"],
          correctOrder: ["試合の", "戦術を", "変えようと", "思っています。"],
          explanation: "Jawaban tepat: 試合の戦術を変えようと思っています。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar:\n心術を ・ いいです ・ 正しい ・ 持った ・ ほうが",
          words: ["正しい", "心術を", "持った", "ほうが", "いいです。"],
          correctOrder: ["正しい", "心術を", "持った", "ほうが", "いいです。"],
          explanation: "Jawaban tepat: 正しい心術を持ったほうがいいです。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar:\n話術を ・ 先生の ・ メモします ・ 聞きながら",
          words: ["先生の", "話術を", "聞きながら", "メモします。"],
          correctOrder: ["先生の", "話術を", "聞きながら", "メモします。"],
          explanation: "Jawaban tepat: 先生の話術を聞きながらメモします。"
        },
        {
          type: "unscramble",
          question: "Susunlah kata-kata berikut ini menjadi kalimat yang benar:\n病院で ・ 手術を ・ 受けた ・ ほうが ・ いいです",
          words: ["病院で", "手術を", "受けた", "ほうが", "いいです。"],
          correctOrder: ["病院で", "手術を", "受けた", "ほうが", "いいです。"],
          explanation: "Jawaban tepat: 病院で手術を受けたほうがいいです。"
        },
        {
          type: "grouping",
          question: "Kelompokkan jukugo berikut ini ke dalam cabang semantic graph kanji 術 yang tepat.",
          words: ["技術", "手術", "話術", "秘術", "学術", "算術", "芸術", "美術"],
          groups: [
            { "Teknik / Keterampilan": ["技術", "手術", "話術", "秘術"] },
            { "Ilmu / Pengetahuan": ["学術", "算術"] },
            { "Seni / Keahlian Seni": ["芸術", "美術"] }
          ],
          explanation: "Pengelompokan jukugo berdasarkan cabang semantic graph kanji 術."
        },
        {
          type: "multiple",
          question: "古い 書物に （　　）が 書いてあります。",
          options: ["秘術", "技術", "算術", "芸術"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: 秘術 (hijutsu / teknik rahasia)."
        },
        {
          type: "multiple",
          question: "試合の （　　）を 変えようと 思っています。",
          options: ["手術", "戦術", "話術", "美術"],
          correctAnswer: 1,
          explanation: "Jawaban tepat: 戦術 (senjutsu / taktik/strategi)."
        },
        {
          type: "multiple",
          question: "正しい （　　）を 持った ほうが いいです。",
          options: ["心術", "算術", "学術", "技術"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: 心術 (shinjutsu / sikap mental/niat hati)."
        },
        {
          type: "multiple",
          question: "先生の （　　）を 聞きながら メモします。",
          options: ["手術", "話術", "秘術", "算術"],
          correctAnswer: 1,
          explanation: "Jawaban tepat: 話術 (wajutsu / teknik berbicara)."
        },
        {
          type: "multiple",
          question: "会議の 前に （　　）論文を 読んで おきます。",
          options: ["学術", "芸術", "心術", "戦術"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: 学術 (gakujutsu / ilmu/akademik)."
        },
        {
          type: "fill",
          question: "日本の 新しい （　　）を 勉強しようと 思っています。",
          options: ["技術", "手術", "芸術"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: 技術 (gijutsu / teknik/teknologi)."
        },
        {
          type: "fill",
          question: "早く 病院で （　　）を 受けた ほうが いいです。",
          options: ["話術", "手術", "算術"],
          correctAnswer: 1,
          explanation: "Jawaban tepat: 手術 (shujutsu / operasi medis)."
        },
        {
          type: "fill",
          question: "先生の （　　）を 聞きながら メモを とります。",
          options: ["話術", "秘術", "美術"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: 話術 (wajutsu / teknik berbicara)."
        },
        {
          type: "fill",
          question: "会議の 前に （　　）論文を 読んで おきます。",
          options: ["算術", "学術", "芸術"],
          correctAnswer: 1,
          explanation: "Jawaban tepat: 学術 (gakujutsu / akademik)."
        },
        {
          type: "fill",
          question: "週末に （　　）館へ 行って 絵を 鑑賞します。",
          options: ["美術", "手術", "算術"],
          correctAnswer: 0,
          explanation: "Jawaban tepat: 美術 (bijutsu / seni rupa)."
        }
      ],
      crossLinks: [
        ["技術", "diterapkan dalam", "手術"],
        ["話術", "menggunakan", "心術"],
        ["戦術", "memerlukan", "技術"],
        ["秘術", "merupakan jenis khusus", "技術"],
        ["学術", "menjadi dasar", "技術"],
        ["算術", "merupakan bagian dari", "学術"],
        ["芸術", "mencakup", "美術"],
        ["話術", "merupakan cabang dari", "芸術"],
        ["美術", "menggunakan", "技術"],
        ["技術", "diterapkan pada", "実務"],
        ["学術", "menjadi dasar", "研究"]
      ]
    }
  };

  // 3. Collect constituent kanjis used in jukugos
  const constituentKanjisInfo: Record<string, { romaji: string; meaning: string; bushuu: string; onyomi: string; kunyomi: string }> = {
    "戦": { romaji: "Sen", meaning: "perang / bertanding", bushuu: "戈", onyomi: "セン", kunyomi: "tatakau" },
    "心": { romaji: "Shin", meaning: "hati / pikiran", bushuu: "心", onyomi: "シン", kunyomi: "kokoro" },
    "人": { romaji: "Jin / Nin", meaning: "orang", bushuu: "人", onyomi: "ジン、ニン", kunyomi: "ひと" },
    "員": { romaji: "In", meaning: "anggota / staf", bushuu: "口", onyomi: "イン", kunyomi: "-" },
    "場": { romaji: "Ba", meaning: "tempat", bushuu: "土", onyomi: "ジョウ", kunyomi: "ば" },
    "求": { romaji: "Kyuu", meaning: "mencari / meminta", bushuu: "水", onyomi: "キュウ", kunyomi: "motomu" },
    "有": { romaji: "Yuu", meaning: "ada / memiliki", bushuu: "月", onyomi: "ユウ、ウ", kunyomi: "aru" },
    "転": { romaji: "Ten", meaning: "berpindah / bergulir", bushuu: "車", onyomi: "テン", kunyomi: "korogaru" },
    "退": { romaji: "Tai", meaning: "mundur / berhenti", bushuu: "⻌", onyomi: "タイ", kunyomi: "shiziroku" },
    "無": { romaji: "Mu", meaning: "tidak ada / tanpa", bushuu: "火", onyomi: "ム、ブ", kunyomi: "nai" },
    "作": { romaji: "Saku", meaning: "membuat / mengerjakan", bushuu: "亻", onyomi: "サク、サ", kunyomi: "tsukuru" },
    "始": { romaji: "Shi", meaning: "mulai", bushuu: "女", onyomi: "シ", kunyomi: "hajimeru" },
    "残": { romaji: "Zan", meaning: "tersisa", bushuu: "歹", onyomi: "ザン", kunyomi: "nokoru" },
    "就": { romaji: "Shuu", meaning: "menjalankan / mulai", bushuu: "尤", onyomi: "シュウ、ジュウ", kunyomi: "tsuku" },
    "失": { romaji: "Shitsu", meaning: "kehilangan", bushuu: "大", onyomi: "シツ", kunyomi: "ushinau" },
    "営": { romaji: "Ei", meaning: "menjalankan / mengelola", bushuu: "口", onyomi: "エイ", kunyomi: "itanamu" },
    "者": { romaji: "Sha", meaning: "orang / pelaku", bushuu: "老", onyomi: "シャ", kunyomi: "mono" },
    "界": { romaji: "Kai", meaning: "dunia / bidang", bushuu: "田", onyomi: "カイ", kunyomi: "-" },
    "家": { romaji: "Ka", meaning: "rumah / keluarga", bushuu: "宀", onyomi: "カ、ケ", kunyomi: "ie" },
    "企": { romaji: "Ki", meaning: "merencanakan", bushuu: "人", onyomi: "キ", kunyomi: "kuwadateru" },
    "事": { romaji: "Ji", meaning: "hal / urusan", bushuu: "亅", onyomi: "ジ、ズ", kunyomi: "koto" },
    "自": { romaji: "Ji", meaning: "diri sendiri", bushuu: "自", onyomi: "ジ、シ", kunyomi: "mizukara" },
    "工": { romaji: "Kou", meaning: "teknik / industri", bushuu: "工", onyomi: "コウ、ク", kunyomi: "-" },
    "農": { romaji: "Nou", meaning: "pertanian", bushuu: "辰", onyomi: "ノウ", kunyomi: "-" },
    "漁": { romaji: "Gyo", meaning: "perikanan", bushuu: "水", onyomi: "ギョ、リョウ", kunyomi: "asaru" },
    "産": { romaji: "San", meaning: "menghasilkan", bushuu: "生", onyomi: "サン", kunyomi: "umare" },
    "本": { romaji: "Hon", meaning: "utama / buku", bushuu: "木", onyomi: "ホン", kunyomi: "moto" },
    "店": { romaji: "Ten", meaning: "toko", bushuu: "广", onyomi: "テン", kunyomi: "mise" },
    "街": { romaji: "Gai", meaning: "jalan / kawasan", bushuu: "行", onyomi: "ガイ", kunyomi: "machi" },
    "品": { romaji: "Hin", meaning: "barang / produk", bushuu: "口", onyomi: "ヒン", kunyomi: "shina" },
    "売": { romaji: "Bai", meaning: "menjual", bushuu: "士", onyomi: "バイ", kunyomi: "uru" },
    "取": { romaji: "Shu", meaning: "mengambil", bushuu: "耳", onyomi: "シュ", kunyomi: "toru" },
    "引": { romaji: "In", meaning: "menarik", bushuu: "弓", onyomi: "イン", kunyomi: "hiku" },
    "社": { romaji: "Sha", meaning: "perusahaan", bushuu: "示", onyomi: "シャ", kunyomi: "yashiro" },
    "勤": { romaji: "Kin", meaning: "bekerja / bertugas", bushuu: "力", onyomi: "キン、ゴン", kunyomi: "tsutomeru" },
    "実": { romaji: "Jitsu", meaning: "nyata / praktis", bushuu: "宀", onyomi: "ジツ", kunyomi: "mi" },
    "任": { romaji: "Nin", meaning: "tugas / penugasan", bushuu: "亻", onyomi: "ニン", kunyomi: "makaseru" },
    "義": { romaji: "Gi", meaning: "kewajiban / prinsip", bushuu: "羊", onyomi: "ギ", kunyomi: "-" },
    "公": { romaji: "Kou", meaning: "publik / resmi", bushuu: "八", onyomi: "コウ", kunyomi: "ooyake" },
    "労": { romaji: "Rou", meaning: "tenaga / kerja", bushuu: "力", onyomi: "ロウ", kunyomi: "negarau" },
    "服": { romaji: "Fuku", meaning: "melayani / pakaian", bushuu: "月", onyomi: "フク", kunyomi: "-" },
    "用": { romaji: "You", meaning: "keperluan / pakai", bushuu: "用", onyomi: "ヨウ", kunyomi: "mochiiru" },
    "財": { romaji: "Zai", meaning: "keuangan / harta", bushuu: "貝", onyomi: "ザイ、サイ", kunyomi: "-" },
    "教": { romaji: "Kyou", meaning: "mengajar / pendidikan", bushuu: "攴", onyomi: "キョウ", kunyomi: "oshieru" },
    "法": { romaji: "Hou", meaning: "hukum / aturan", bushuu: "水", onyomi: "ホウ", kunyomi: "nori" },
    "技": { romaji: "Gi", meaning: "keterampilan / teknik", bushuu: "扌", onyomi: "ギ", kunyomi: "waza" },
    "手": { romaji: "Shu", meaning: "tangan", bushuu: "手", onyomi: "シュ", kunyomi: "te" },
    "話": { romaji: "Wa", meaning: "berbicara / percakapan", bushuu: "言", onyomi: "ワ", kunyomi: "hanasu" },
    "秘": { romaji: "Hi", meaning: "rahasia", bushuu: "示", onyomi: "ヒ", kunyomi: "himeru" },
    "学": { romaji: "Gaku", meaning: "ilmu / belajar", bushuu: "子", onyomi: "ガク", kunyomi: "manabu" },
    "算": { romaji: "San", meaning: "hitung / kalkulasi", bushuu: "竹", onyomi: "サン", kunyomi: "suru" },
    "芸": { romaji: "Gei", meaning: "seni / keahlian", bushuu: "艹", onyomi: "ゲイ", kunyomi: "-" },
    "美": { romaji: "Bi", meaning: "indah / keindahan", bushuu: "羊", onyomi: "ビ", kunyomi: "utsukushii" }
  };

  // Upsert all constituent kanji
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

  // 4. Process each of the 5 main kanji for Module 4
  const mainKanjis = ["職", "業", "商", "務", "術"];

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

    // Clean existing child records to avoid duplicate accumulation
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

  console.log("\n🎉 Modul 4 (職・業・商・務・術) successfully seeded into database!");
}

seedModule4()
  .catch(err => {
    console.error("❌ Error seeding Module 4:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
