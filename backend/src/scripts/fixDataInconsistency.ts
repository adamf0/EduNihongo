import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Romaji to Hiragana mapping for Kunyomi readings
const ROMAJI_TO_HIRAGANA: Record<string, string> = {
  "to.u, to.i": "と.う, と.い",
  "tada.shii": "ただ.しい",
  "mochi.iru": "もち.いる",
  "kami": "かみ",
  "kae.su": "かえ.す",
  "waka.metsu": "わか.めつ",
  "hito.tsu": "ひと.つ",
  "mou.su": "もう.す",
  "mizuka.ra": "みずか.ら",
  "ugo.ku": "うご.く",
  "toki": "とき",
  "hiki.iru": "ひき.いる",
  "yado": "やど",
  "na": "な",
  "omote, arawa.su": "おもて, あらわ.す",
  "nushi, omo": "ぬし, おも",
  "to.gu": "と.ぐ",
  "kiwa.meru": "きわ.める",
  "de.ru, da.su": "で.る, だ.す",
  "hana.su, hanashi": "はな.す, はなし",
  "koto": "こと",
  "shi.ru": "し.る",
  "aza": "あざ",
  "tameshi": "ためし",
  "u.keru": "う.ける",
  "he.ru": "へ.る",
  "karada": "からだ",
  "mono": "もの",
  "mi, mino.ru": "み, みの.る",
  "muro": "むろ",
  "ko.muru": "こ.むる",
  "i.kiru, uma.reru": "い.きる, うま.れる",
  "sada.meru": "さだ.める",
  "tsugai": "つがい",
  "kokoro.miru, tame.su": "こころ.みる, ため.す",
  "hai.ru, i.reru": "はい.る, い.れる",
  "ki.ru, tsu.ku": "き.る, つ.く",
  "no.ru, no.seru": "の.る, の.せる",
  "tabe.ru, ku.u": "たべ.る, く.う",
  "no.mu": "の.む",
  "kusuri": "くすり",
  "tsuku.ru": "つく.る",
  "shina": "しな",
  "a.u, a.waseru": "あ.う, あ.わせる",
  "waza": "わざ",
  "ki.ku": "き.く",
  "utsu.su": "うつ.す",
  "yo.mu": "よ.む",
  "aida, ma": "あいだ, ま",
  "to.u": "と.う",
};

// Full metadata for Kanjis 3344 - 3354
const KANJI_FULL_METADATA: Record<string, {
  romaji: string;
  meaning: string;
  baseMeaning: string;
  bushuu: string;
  onyomi: string;
  kunyomi: string;
}> = {
  "口": { romaji: "Kuchi / Kou", meaning: "Mulut / Lubang / Pintu Masuk", baseMeaning: "Mulut, Bukaan, Pintu", bushuu: "口 (Mulut)", onyomi: "コウ, ク", kunyomi: "くち" },
  "質": { romaji: "Shitsu / Shichi", meaning: "Kualitas / Inti / Pertanyaan", baseMeaning: "Kualitas, Sifat Dasar, Gadai", bushuu: "貝 (Kerang)", onyomi: "シツ, シチ", kunyomi: "たち, ただ.す" },
  "診": { romaji: "Shin", meaning: "Memeriksa / Diagnosa", baseMeaning: "Memeriksa Kesehatan, Mendiagnosa", bushuu: "言 (Bicara)", onyomi: "シン", kunyomi: "み.る" },
  "尋": { romaji: "Jin", meaning: "Menyelidiki / Bertanya", baseMeaning: "Bertanya, Menyelidiki, Ukuran", bushuu: "寸 (Jengkal)", onyomi: "ジン", kunyomi: "たず.ねる" },
  "訪": { romaji: "Hou", meaning: "Mengunjungi / Bertemu", baseMeaning: "Berkunjung, Mendatangi", bushuu: "言 (Bicara)", onyomi: "ホウ", kunyomi: "おとず.れる, たず.ねる" },
  "社": { romaji: "Sha", meaning: "Masyarakat / Perusahaan / Kuil", baseMeaning: "Perusahaan, Kuil, Masyarakat", bushuu: "示 (Kuil/Dewa)", onyomi: "シャ", kunyomi: "やしろ" },
  "会": { romaji: "Kai / Ai", meaning: "Kumpulan / Bertemu / Asosiasi", baseMeaning: "Bertemu, Berkumpul, Pertemuan", bushuu: "人 (Manusia)", onyomi: "カイ, エ", kunyomi: "あ.う" },
  "環": { romaji: "Kan", meaning: "Lingkaran / Lingkungan", baseMeaning: "Lingkaran, Gelang, Mengelilingi", bushuu: "玉 (Permata)", onyomi: "カン", kunyomi: "わ" },
  "境": { romaji: "Kyou / Kei", meaning: "Batas / Lingkungan / Wilayah", baseMeaning: "Batas, Perbatasan, Kondisi", bushuu: "土 (Tanah)", onyomi: "キョウ, ケイ", kunyomi: "さかい" },
  "設": { romaji: "Setsu", meaning: "Menyusun / Mendirikan / Mengatur", baseMeaning: "Mendirikan, Menyusun, Mengatur", bushuu: "言 (Bicara)", onyomi: "セツ", kunyomi: "もうけ.る" },
  "屋": { romaji: "Oku / Ya", meaning: "Toko / Rumah / Grosir", baseMeaning: "Atap, Rumah, Toko", bushuu: "尸 (Atap/Tubuh)", onyomi: "オク", kunyomi: "や" },
};

// Full JUKUGO_RESEARCH_DETAILS for SemanticRelation
const JUKUGO_RESEARCH_DETAILS: Record<string, {
  explanation: string;
  charRoles: Record<string, string>;
  category: string;
}> = {
  // Jukugo entries for 点
  "採点": { explanation: "Hubungan makna antar kanji 採 dan 点, saat digabungkan menjadi 採点, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'kegiatan memberikan nilai terhadap hasil pekerjaan'", charRoles: { "採": "memberi / mengambil", "点": "nilai" }, category: "Penilaian dan Nilai" },
  "得点": { explanation: "Hubungan makna antar kanji 得 dan 点 saat digabung menjadi 得点, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'jumlah nilai yang diperoleh seseorang'", charRoles: { "得": "memperoleh", "点": "poin" }, category: "Penilaian dan Nilai" },
  "減点": { explanation: "Hubungan makna antar kanji 減 dan 点, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'nilai yang dikurangi'", charRoles: { "減": "mengurangi", "点": "nilai" }, category: "Penilaian dan Nilai" },
  "地点": { explanation: "Hubungan makna antar kanji 地 dan 点 menjadi 地点, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'titik tertentu pada suatu lokasi'", charRoles: { "地": "tempat", "点": "titik" }, category: "Titik dan Lokasi" },
  "起点": { explanation: "Hubungan makna antar kanji 起 dan 点, menunjukan bahwa gabungan dua kanji tersebut mengandung makna 'tempat dimulainya suatu perjalanan atau aktivitas'", charRoles: { "起": "mulai", "点": "awal" }, category: "Titik dan Lokasi" },
  "終点": { explanation: "Hubungan makna antar kanji 終 dan 点, menunjukan bahwa gabungan dua kanji tersebut mengandung makna 'tempat berakhirnya suatu perjalanan'", charRoles: { "終": "selesai", "点": "tempat" }, category: "Titik dan Lokasi" },
  "観点": { explanation: "Hubungan makna antar kanji 観 dan 点 menjadi 観点, menunjukan gabungan dua kanji tersebut mengandung makna 'cara melihat/memandang suatu persoalan'", charRoles: { "観": "melihat", "点": "titik" }, category: "Pandangan dan Aspek" },
  "視点": { explanation: "Hubungan makna antar kanji 視 dan 点 menjadi 視点, menunjukan bahwa gabungan dua kanji tersebut mengandung makna 'posisi atau sudut pandang dalam memahami suatu masalah'", charRoles: { "視": "melihat", "点": "titik" }, category: "Pandangan dan Aspek" },
  "論点": { explanation: "Hubungan makna antar kanji 論 dan 点 menjadi 論点, menunjukan bahwa gabungan dua kanji tersebut mengandung makna 'masalah utama yang menjadi inti pembahasan'", charRoles: { "論": "pembahasan", "点": "pokok" }, category: "Pandangan dan Aspek" },
  "問題点": { explanation: "Hubungan makna antar kanji 問題 dan 点 menjadi 問題点, menunjukan bahwa gabungan kedua kanji tersebut mengandung makna 'bagian yang menjadi sumber masalah'", charRoles: { "問": "bertanya / masalah", "題": "topik / masalah", "点": "titik" }, category: "Fokus dan Permasalahan" },
  "重点": { explanation: "Hubungan makna antar kanji 重 dan 点 menjadi 重点, menunjukan bahwa gabungan kedua kanji tersebut mengandung makna 'bagian yang terpenting untuk diperhatikan'", charRoles: { "重": "penting", "点": "titik" }, category: "Fokus dan Permasalahan" },
  "要点": { explanation: "Hubungan makna antar kanji 要 dan 点 menjadi 要点, menunjukan bahwa gabungan kedua kanji tersebut mengandung makna 'pokok dari suatu penjelasan'", charRoles: { "要": "inti", "点": "poin" }, category: "Fokus dan Permasalahan" },
  "点検": { explanation: "Hubungan makna antar kanji 点 dan 検 menjadi 点検, menunjukan bahwa gabungan kedua kanji tersebut mengandung makna 'keadaan memeriksa kondisi suatu benda atau sistem'", charRoles: { "点": "memeriksa", "検": "inspeksi" }, category: "Pemeriksaan dan Data" },
  "点灯": { explanation: "Hubungan makna antar kanji 点 dan 灯 menjadi 点灯, menunjukan bahwa gabungan kedua kanji tersebut mengandung makna 'menghidupkan lampu atau penerangan'", charRoles: { "点": "menyalakan", "灯": "lampu" }, category: "Pemeriksaan dan Data" },
  "点数": { explanation: "Hubungan makna antar kanji 点 dan 数 menjadi 点数, menunjukan bahwa gabungan kedua kanji tersebut mengandung makna 'jumlah nilai yang diperoleh dalam suatu penilaian'", charRoles: { "点": "poin", "数": "jumlah" }, category: "Pemeriksaan dan Data" },

  // Jukugo entries for 答
  "回答": { explanation: "Hubungan makna antar kanji 回 dan 答, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'jawaban yang diberikan terhadap suatu pertanyaan atau permintaan informasi'", charRoles: { "回": "mengembalikan", "答": "jawaban" }, category: "Pertanyaan dan Jawaban" },
  "解答": { explanation: "Hubungan makna antar kanji 解 dan 答, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'jawaban yang digunakan untuk menyelesaikan soal atau permasalahan'", charRoles: { "解": "menyelesaikan", "答": "jawaban" }, category: "Pertanyaan dan Jawaban" },
  "応答": { explanation: "Hubungan makna antar kanji 応 dan 答, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'respons yang diberikan terhadap pertanyaan, panggilan, atau komunikasi'", charRoles: { "応": "menanggapi", "答": "jawaban" }, category: "Pertanyaan dan Jawaban" },
  "答案": { explanation: "Hubungan makna antar kanji 答 dan 案, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'lembar jawaban untuk menuliskan jawaban dalam ujian atau latihan'", charRoles: { "答": "jawaban", "案": "naskah" }, category: "Pendidikan dan Evaluasi" },
  "正答": { explanation: "Hubungan makna antar kanji 正 dan 答 menjadi 正答, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'jawaban yang sesuai dengan kebenaran atau kunci jawaban'", charRoles: { "正": "benar", "答": "jawaban" }, category: "Pendidikan dan Evaluasi" },
  "解答用紙": { explanation: "Hubungan makna antar kanji 解答 dan 用紙 menjadi 解答用紙, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'sebuah lembaran resmi yang digunakan untuk menuliskan jawaban peserta ujian'", charRoles: { "解": "menyelesaikan", "答": "jawaban", "用": "keperluan", "紙": "kertas" }, category: "Pendidikan dan Evaluasi" },
  "返答": { explanation: "Hubungan makna antar kanji 返 dan 答 menjadi 返答, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'jawaban atau balasan terhadap pertanyaan, surat, maupun pesan'", charRoles: { "返": "mengembalikan", "答": "jawaban" }, category: "Komunikasi dan Diskusi" },
  "口答": { explanation: "Hubungan makna antar kanji 口 dan 答 menjadi 口答, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'jawaban yang disampaikan secara lisan'", charRoles: { "口": "mulut", "答": "jawaban" }, category: "Komunikasi dan Diskusi" },
  "答弁": { explanation: "Hubungan makna antar kanji 答 dan 弁 menjadi 答弁, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'jawaban resmi yang diberikan dalam rapat, sidang atau pun forum'", charRoles: { "答": "menjawab", "弁": "penjelasan" }, category: "Komunikasi dan Diskusi" },
  "問答": { explanation: "Hubungan makna antar kanji 問 dan 答 menjadi 問答, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'suatu kegiatan tanya jawab sebagai proses pembelajaran'", charRoles: { "問": "bertanya", "答": "menjawab" }, category: "Akademik dan Penelitian" },
  "一問一答": { explanation: "Hubungan makna antar kanji 一、問、一、dan 答 menjadi 一問一答, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'metode belajar yang menyajikan satu pertanyaan untuk satu jawaban'", charRoles: { "一": "satu", "問": "pertanyaan", "答": "jawaban" }, category: "Akademik dan Penelitian" },
  "答申": { explanation: "Hubungan makna antar kanji 答 dan 申 menjadi 答申, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'jawaban resmi yang disampaikan kepada pihak yang meminta pertimbangan'", charRoles: { "答": "menjawab", "申": "menyampaikan" }, category: "Akademik dan Penelitian" },
  "自動応答": { explanation: "Hubungan makna antar kanji 自動 dan 応答 menjadi 自動応答, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'jawaban yang diberikan secara otomatis oleh sistem komputer atau perangkat'", charRoles: { "自": "diri", "動": "gerak", "応": "menanggapi", "答": "jawaban" }, category: "Teknologi dan Layanan" },
  "応答時間": { explanation: "Hubungan makna antar kanji 応答 dan 時間 menjadi 応答時間, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'lamanya waktu yang diperlukan seseorang atau sistem untuk memberikan jawaban'", charRoles: { "応": "menanggapi", "答": "jawaban", "時": "waktu", "間": "durasi" }, category: "Teknologi dan Layanan" },
  "応答率": { explanation: "Hubungan makna antar kanji 応答 dan 率 menjadi 応答率, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'persentase jumlah respons yang diterima dibanding jumlah pertanyaan'", charRoles: { "応": "menanggapi", "答": "jawaban", "率": "tingkat" }, category: "Teknologi dan Layanan" },

  // Jukugo entries for 題
  "問題": { explanation: "Hubungan makna antar kanji 問 dan 題 ketika digabungkan menjadi 問題, menunjukan bahwa gabungan kanji tersebut mengandung makna suatu persoalan atau 'masalah yang harus diselesaikan'.", charRoles: { "問": "bertanya", "題": "topik / persoalan" }, category: "Pendidikan dan Evaluasi" },
  "課題": { explanation: "Hubungan makna antara kanji 課 dan 題, ketika digabung menjadi 課題, menunjukan bahwa gabungan kanji tersebut mengandung makna 'tugas yang diberikan untuk dikerjakan'.", charRoles: { "課": "pelajaran / mata kuliah", "題": "topik" }, category: "Pendidikan dan Evaluasi" },
  "宿題": { explanation: "Hubungan makna antar kanji 宿 dan 題 apabila digabungkan menjadi 宿題, menunjukan bahwa gabungan kanji tersebut mengandung makna 'sesuatu tugas yang dikerjakan di rumah'.", charRoles: { "宿": "tempat tinggal / rumah", "題": "tugas" }, category: "Pendidikan dan Evaluasi" },
  "題名": { explanation: "Hubungan makna antar kanji 題 dan 名, ketika digabungkan menjadi 題名, menunjukan bahwa gabungan kanji tersebut mengandung makna nama sebuah tulisan atau karya.", charRoles: { "題": "judul", "名": "nama" }, category: "Judul dan Tema" },
  "表題": { explanation: "Hubungan makna antar kanji 表 dan 題, ketika digabungkan menjadi 表題, menunjukan bahwa gabungan kanji tersebut mengandung makna 'judul yang muncul pada bagian dokumen'.", charRoles: { "表": "bagian depan", "題": "judul" }, category: "Judul dan Tema" },
  "主題": { explanation: "Hubungan makna antar kanji 主 dan 題, ketika digabungkan menjadi kanji 主題, menunjukan bahwa gabungan kanji tersebut mengandung makna 'pokok pembahasan utama'.", charRoles: { "主": "utama", "題": "tema" }, category: "Judul dan Tema" },
  "研究課題": { explanation: "Hubungan makna antar kanji 研究 dan 課題, ketika digabungkan menjadi 研究課題, menunjukan bahwa gabungan kanji tersebut mengandung makna 'suatu masalah yang menjadi fokus penelitian'.", charRoles: { "研": "meneliti", "究": "mendalam", "課": "pelajaran", "題": "topik" }, category: "Akademik dan Penelitian" },
  "論題": { explanation: "Hubungan makna antar kanji 論 dan 題, ketika digabungkan menjadi kanji 論題, menunjukan bahwa gabungan kanji tersebut mengandung makna 'topik yang dibahas secara akademik'.", charRoles: { "論": "argumen / diskusi", "題": "tema" }, category: "Akademik dan Penelitian" },
  "出題": { explanation: "Hubungan makna antar kanji 出 dan 題, ketika digabungkan menjadi kanji 出題, menunjukan bahwa gabungan kanji tersebut mengandung makna 'kegiatan membuat atau mengeluarkan soal'.", charRoles: { "出": "mengeluarkan", "題": "soal" }, category: "Akademik dan Penelitian" },
  "話題": { explanation: "Hubungan makna antar kanji 話 dan 題, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'sesuatu hal yang sedang dibicarakan'.", charRoles: { "話": "berbicara", "題": "topik" }, category: "Diskusi dan Pemikiran" },
  "時事問題": { explanation: "Hubungan makna antar kanji 時事 dan 問題 saat digabungkan menjadi 時事問題, menunjukan bahwa gabungan kanji tersebut mengandung makna 'persoalan yang sedang hangat dibicarakan di masyarakat'.", charRoles: { "時": "waktu", "事": "peristiwa", "問": "bertanya", "題": "masalah" }, category: "Diskusi dan Pemikiran" },
  "問題意識": { explanation: "Hubungan makna antar kanji 問題 dan 意識 saat digabungkan menjadi 問題意識, menunjukan bahwa gabungan kanji tersebut mengandung makna 'suatu kemampuan adanya persoalan yang perlu diselesaikan'.", charRoles: { "問": "bertanya", "題": "masalah", "意": "pikiran", "識": "kesadaran" }, category: "Diskusi dan Pemikiran" },
  "題材": { explanation: "Hubungan makna antar kanji 題 dan 材, saat digabungkan menjadi kanji 題材, menunjukan bahwa gabungan kanji tersebut mengandung makna 'bahan atau tema yang digunakan untuk membuat sebuah karya'.", charRoles: { "題": "tema", "材": "bahan" }, category: "Media dan Publikasi" },
  "題字": { explanation: "Hubungan makna antar kanji 題 dan 字 ketika digabung menjadi 題字, menunjukan bahwa gabungan kanji tersebut mengandung makna 'tulisan yang digunakan sebagai judul'.", charRoles: { "題": "judul", "字": "huruf / tulisan" }, category: "Media dan Publikasi" },

  // Jukugo entries for 問
  "質問": { explanation: "Hubungan makna antar kanji 質 dan 問 menjadi 質問, menunjukan bahwa gabungan kedua kanji itu mengandung 'pertanyaan yang dikemukakan agar memperoleh suatu informasi'.", charRoles: { "質": "kualitas / inti", "問": "bertanya" }, category: "Pertanyaan dan Ujian" },
  "問診": { explanation: "Hubungan makna antar kanji 問 dan 診 ketika digabung menjadi 問診, menunjukan bahwa gabungan kanji tersebut mengandung makna 'pemeriksaan pasien melalui serangkaian pertanyaan'.", charRoles: { "問": "bertanya", "診": "memeriksa" }, category: "Investigasi dan Penyelidikan" },
  "尋問": { explanation: "Hubungan makna antar kanji 尋 dan 問 ketika digabung menjadi 尋問, menunjukan bahwa gabungan kanji tersebut mengandung makna 'proses pengajuan pertanyaan secara mendalam untuk memperoleh suatu keterangan informasi'.", charRoles: { "尋": "menyelidiki", "問": "bertanya" }, category: "Investigasi dan Penyelidikan" },
  "訪問調査": { explanation: "Hubungan makna antar kanji 訪問 dan 調査, ketika digabung menjadi dua kosakata yaitu 訪問調査, menunjukan bahwa gabungan kedua kosakata kanji tersebut mengandung makna 'pengumpulan data yang dilakukan melalui kunjungan langsung'.", charRoles: { "訪": "mengunjungi", "問": "bertanya", "調": "meneliti", "査": "inspeksi" }, category: "Investigasi dan Penyelidikan" },
  "社会問題": { explanation: "Hubungan makna antar kanji 社会 dan 問題, ketika digabungkan menjadi 社会問題, menunjukan bahwa gabungan dua kosakata kanji tersebut, mengandung makna 'masalah yang dihadapi dalam kehidupan masyarakat'.", charRoles: { "社": "masyarakat", "会": "kumpulan", "問": "bertanya", "題": "masalah" }, category: "Permasalahan Sosial" },
  "環境問題": { explanation: "Hubungan makna antar kanji 環境 dan 問題, ketika digabungkan menjadi 環境問題, menunjukan bahwa gabungan kanji tersebut mengandung makna 'suatu persoalan yang berhubungan dengan lingkungan hidup'.", charRoles: { "環": "lingkaran", "境": "batas", "問": "bertanya", "題": "masalah" }, category: "Permasalahan Sosial" },
  "設問": { explanation: "Hubungan makna antar kanji 設 dan 問, ketika digabungkan menjadi 設問, menunjukan bahwa gabungan kanji tersebut mengandung makna 'pertanyaan yang disusun dalam tes atau angket'.", charRoles: { "設": "menyusun", "問": "pertanyaan" }, category: "Pendidikan dan Evaluasi" },
  "問題集": { explanation: "Hubungan makna antar kanji 問題 dan 集, ketika digabungkan menjadi 問題集, menunjukan bahwa gabungan kanji tersebut mengandung makna 'buku yang berisi kumpulan berbagai latihan soal'.", charRoles: { "問": "soal", "題": "masalah", "集": "kumpulan" }, category: "Pendidikan dan Evaluasi" },
  "問一": { explanation: "Hubungan makna antar kanji 問 dan 一, ketika digabung menjadi 問一, menunjukan bahwa gabungan kanji tersebut mengandung makna nomor 'pertama dalam suatu latihan atau ujian'.", charRoles: { "問": "soal", "一": "satu" }, category: "Pendidikan dan Evaluasi" },
  "問い合わせ": { explanation: "Hubungan makna antar kanji 問 dan 合わせ, ketika digabungkan menjadi 問い合わせ, menunjukan bahwa gabungan kanji tersebut mengandung makna 'menghubungi seseorang untuk memperoleh informasi'.", charRoles: { "問": "bertanya", "合": "menghubungkan" }, category: "Komunikasi dan Konsultasi" },
  "問う": { explanation: "Kanji 問 yang berdiri sendiri sebagai kata kerja 問う (とう), mengandung makna menanyakan, mempertanyakan, atau menuntut penjelasan.", charRoles: { "問": "bertanya / menanyakan" }, category: "Komunikasi dan Konsultasi" },
  "問屋": { explanation: "Hubungan makna antar kanji 問 dan 屋 menjadi 問屋 (とんや), mengandung makna pedagang grosir atau distributor utama dalam transaksi perdagangan.", charRoles: { "問": "transaksi", "屋": "toko / grosir" }, category: "Komunikasi dan Konsultasi" },

  // Jukugo entries for 験
  "試験": { explanation: "Hubungan makna antar kanji 試 dan 験, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'menguji kemampuan untuk membuktikan penguasaan seseorang'.", charRoles: { "試": "Menguji", "験": "Membuktikan hasil" }, category: "Pengujian" },
  "受験": { explanation: "Hubungan makna antar kanji 受 dan 験, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'seseorang mengikuti proses ujian'.", charRoles: { "受": "Menerima", "験": "Ujian / verifikasi" }, category: "Pengujian" },
  "資格試験": { explanation: "Hubungan makna dari kanji 資格 dan 試験, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'ujian yang fungsinya untuk membuktikan kompetensi tertentu'.", charRoles: { "資": "modal", "格": "kualifikasi", "試": "menguji", "験": "membuktikan" }, category: "Pengujian" },
  "経験": { explanation: "Hubungan makna antar kanji 経 dan 験, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'sesuatu yang telah dialami secara langsung'.", charRoles: { "経": "Melewati", "験": "Mengalami" }, category: "Pengalaman" },
  "体験": { explanation: "Hubungan makna antar 体 dan 験, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'pengalaman yang dirasakan sendiri secara nyata'.", charRoles: { "体": "badan", "験": "mengalami" }, category: "Pengalaman" },
  "経験者": { explanation: "Hubungan makna antar kanji 経験 dan 者, menunjukan bahwa gabungan kanji tersebut mengandung makna 'orang yang telah memiliki pengalaman'.", charRoles: { "経": "melewati", "験": "mengalami", "者": "orang" }, category: "Pengalaman" },
  "実験": { explanation: "Hubungan makna dari kanji 実 dan 験, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'pembuktian suatu teori melalui percobaan'.", charRoles: { "実": "nyata", "験": "pembuktian" }, category: "Penelitian" },
  "実験室": { explanation: "Hubungan makna antar kanji 実験 dan 室, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'tempat melakukan eksperimen'.", charRoles: { "実": "nyata", "験": "pembuktian", "室": "ruangan" }, category: "Penelitian" },
  "被験者": { explanation: "Hubungan makna antar kanji dari 被, 験 dan 者, menunjukan bahwa gabungan ketiga kanji itu mengandung makna 'orang yang menjadi objek eksperimen atau penelitian'.", charRoles: { "被": "dikenai", "験": "menguji", "者": "orang" }, category: "Penelitian" },
  "受験生": { explanation: "Hubungan makna antar kanji 受験 dan 生, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'seseorang sedang mengikuti ujian'.", charRoles: { "受": "menerima", "験": "ujian", "生": "siswa" }, category: "Sertifikasi" },
  "検定試験": { explanation: "Hubungan makna dari kanji 検, 定 dan 試験, menunjukan bahwa gabungan kanji tersebut mengandung makna 'proses pemeriksaan untuk menetapkan kemampuan seseorang'.", charRoles: { "検": "memeriksa", "定": "menetapkan", "試": "menguji", "験": "membuktikan" }, category: "Sertifikasi" },

  // Jukugo entries for 試
  "入試": { explanation: "Hubungan makna antara kanji 入 dan 試 menjadi 入試, menunjukan gabungan kedua kanji tersebut membentuk sebuah makna 'untuk masuk sekolah atau pun perguruan tinggi harus melalui ujian'.", charRoles: { "入": "masuk", "試": "ujian" }, category: "Aktivitas Pengujian" },
  "試問": { explanation: "Hubungan makna antar kanji 試 dan 問 menjadi 試問, menunjukan gabungan kedua kanji tersebut membentuk sebuah makna 'ujian dilakukan dengan tanya jawab secara langsung'.", charRoles: { "試": "menguji", "問": "bertanya" }, category: "Aktivitas Pengujian" },
  "試着": { explanation: "Hubungan makna antar kanji 試 dan 着 menjadi 試着, menunjukan gabungan kedua kanji tersebut membentuk sebuah makna 'mencoba pakaian sebelum memutuskan untuk membelinya'.", charRoles: { "試": "Mencoba", "着": "Memakai" }, category: "Penggunaan" },
  "試用": { explanation: "Hubungan makna antar kanji 試 dan 用 menunjukan gabungan kedua kanji tersebut membentuk sebuah makna 'bahwa untuk mengetahui manfaat atau kualitasnya harus menggunakan sesuatu'.", charRoles: { "試": "Mencoba", "用": "Menggunakan" }, category: "Penggunaan" },
  "試乗": { explanation: "Hubungan makna antar kanji 試 dan 乗 menunjukan bahwa sebelum membeli atau menggunakan kendaraan harus mencoba kendaraan terlebih dahulu.", charRoles: { "試": "Mencoba", "乗": "Menaiki" }, category: "Penggunaan" },
  "試食": { explanation: "Hubungan makna antar kanji 試 dan 食 menunjukan bahwa untuk menilai rasa sesuatu, terlebih dahulu harus mencoba makanannya terlebih dahulu.", charRoles: { "試": "Mencoba", "食": "Makan" }, category: "Konsumsi" },
  "試飲": { explanation: "Hubungan makna antar kanji 試 dan 飲 menjadi 試飲, menunjukan bahwa gabungan kedua kanji tersebut mengandung makna 'sebelum membeli atau memilih produk minuman, terlebih dahulu mencoba minumannya'.", charRoles: { "試": "Mencoba", "飲": "Minum" }, category: "Konsumsi" },
  "試薬": { explanation: "Hubungan makna antar kanji 試 dan 薬 menjadi 試薬, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'zat yang digunakan untuk melakukan pengujian atau eksperimen'.", charRoles: { "試": "menguji", "薬": "zat kimia" }, category: "Konsumsi" },
  "試作": { explanation: "Hubungan makna antar kanji 試 dan 作 menjadi 試作, menunjukan bahwa gabungan kedua kanji tersebut mengandung makna 'sebelum memproduksi sesuatu secara massal, terlebih dahulu membuat produk percobaan terlebih dahulu'.", charRoles: { "試": "Percobaan", "作": "Membuat" }, category: "Produksi dan Pengembangan" },
  "試作品": { explanation: "Hubungan makna antar kanji 試作 dan 品 menjadi 試作品, menunjukan bahwa gabungan kedua kanji tersebut mengandung makna 'produk hasil percobaan yang masih dalam tahap pengembangan'.", charRoles: { "試": "percobaan", "作": "membuat", "品": "produk" }, category: "Produksi dan Pengembangan" },
  "試製": { explanation: "Hubungan makna antar kanji 試 dan 製, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'mengevaluasi kualitas produk, terlebih dahulu memproduksi sesuatu dalam skala percobaan'.", charRoles: { "試": "Percobaan", "製": "Memproduksi" }, category: "Produksi dan Pengembangan" },
  "試合": { explanation: "Hubungan makna antar kanji 試 dan 合, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'ajang untuk menguji kemampuan peserta atau pun tim'.", charRoles: { "試": "Menguji", "合": "Bertanding" }, category: "Kompetisi dan Media" },
  "試技": { explanation: "Hubungan makna antar kanji 試 dan 技, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'demonstrasi atau penilaian kemampuan teknis seseorang'.", charRoles: { "試": "Menguji", "技": "Keterampilan" }, category: "Kompetisi dan Media" },
  "試聴": { explanation: "Hubungan makna antar kanji 試 dan 聴, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'sebelum memilih sesuatu, terlebih dahulu mendengarkan contoh audionya'.", charRoles: { "試": "Mencoba", "聴": "Mendengar" }, category: "Kompetisi dan Media" },
  "試写": { explanation: "Hubungan makna antar kanji 試 dan 写, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'sebelum mempublikasikan film secara resmi, terlebih dahulu filmnya dipertontonkan dulu'.", charRoles: { "試": "mencoba", "写": "menayangkan" }, category: "Kompetisi dan Media" },
  "試読": { explanation: "Hubungan makna antar kanji 試 dan 読, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'sebelum memutuskan membelinya, terlebih dahulu membaca isi buku atau tulisannya'.", charRoles: { "試": "mencoba", "読": "membaca" }, category: "Kompetisi dan Media" },
};

async function fixDataInconsistency() {
  console.log("🛠 Starting Database Inconsistency Repairs...");

  // 1. Fix Kanji ID 3217 Bushu
  const k3217 = await prisma.kanji.findUnique({ where: { id: 3217 } });
  if (k3217) {
    await prisma.kanji.update({
      where: { id: 3217 },
      data: { bushuu: "黑 (Kuro / Hitam)" },
    });
    console.log("✅ Fixed Kanji 3217 bushuu to '黑 (Kuro / Hitam)'");
  }

  // 2. Fix Kanji 3344 - 3354 Incomplete Data
  for (const [char, meta] of Object.entries(KANJI_FULL_METADATA)) {
    const existing = await prisma.kanji.findUnique({ where: { character: char } });
    if (existing) {
      await prisma.kanji.update({
        where: { id: existing.id },
        data: {
          romaji: meta.romaji,
          meaning: meta.meaning,
          baseMeaning: meta.baseMeaning,
          bushuu: meta.bushuu,
          onyomi: meta.onyomi,
          kunyomi: meta.kunyomi,
        },
      });
      console.log(`✅ Updated Kanji metadata for ${char} (ID: ${existing.id})`);
    }
  }

  // 3. Fix Romaji Kunyomi -> Hiragana Japanese Kunyomi across all Kanji
  const allKanjis = await prisma.kanji.findMany();
  let kunyomiFixCount = 0;

  for (const k of allKanjis) {
    if (k.kunyomi && ROMAJI_TO_HIRAGANA[k.kunyomi.trim()]) {
      const hiraganaKun = ROMAJI_TO_HIRAGANA[k.kunyomi.trim()];
      await prisma.kanji.update({
        where: { id: k.id },
        data: { kunyomi: hiraganaKun },
      });
      kunyomiFixCount++;
      console.log(`✅ Fixed Kunyomi for ${k.character}: '${k.kunyomi}' -> '${hiraganaKun}'`);
    }
  }
  console.log(`📌 Fixed ${kunyomiFixCount} Kanji Kunyomi fields to Hiragana.`);

  // 4. Fix SemanticRelation entries (Delete incomplete ones >= 12247 and re-insert complete ones!)
  console.log("\n🛠 Re-populating SemanticRelation entries with complete jukugo_1, jukugo_1_arti, jukugo_2, jukugo_2_arti...");

  await prisma.semanticRelation.deleteMany({
    where: { id: { gte: 12247 } },
  });
  console.log("✅ Cleaned incomplete SemanticRelation rows >= 12247.");

  let semInsertCount = 0;
  const kanjiDbList = await prisma.kanji.findMany();
  const kanjiDbMap = new Map<string, number>();
  kanjiDbList.forEach((k) => kanjiDbMap.set(k.character, k.id));

  for (const [word, details] of Object.entries(JUKUGO_RESEARCH_DETAILS)) {
    const chars = Array.from(word);
    const char1 = chars[0] || word;
    const char2 = chars[1] || "";

    const role1 = details.charRoles[char1] || (KANJI_FULL_METADATA[char1]?.meaning || "Peran Karakter 1");
    const role2 = details.charRoles[char2] || (KANJI_FULL_METADATA[char2]?.meaning || "Peran Karakter 2");

    // Find parent root kanji ID
    let rootKanjiId: number | undefined;
    for (const c of word) {
      if (kanjiDbMap.has(c)) {
        rootKanjiId = kanjiDbMap.get(c);
        break;
      }
    }
    if (!rootKanjiId) rootKanjiId = kanjiDbMap.get("点") || 3217;

    const matchedJukugo = await prisma.jukugo.findFirst({
      where: { kanjiId: rootKanjiId, word: word }
    });

    const createdSem = await prisma.semanticRelation.create({
      data: {
        kanjiId: rootKanjiId,
        jukugoId: matchedJukugo?.id || null,
        penjelasan: details.explanation,
      },
    });

    await prisma.semanticRelationNode.createMany({
      data: [
        { semanticId: createdSem.id, jokugo: char1, arti: role1 },
        { semanticId: createdSem.id, jokugo: char2, arti: role2 },
      ].filter((n) => n.jokugo),
    });
    semInsertCount++;
  }

  console.log(`✅ Re-inserted ${semInsertCount} complete SemanticRelation entries.`);
  console.log("\n🎉 All database inconsistencies repaired successfully!");
}

fixDataInconsistency()
  .catch((err) => console.error("❌ Repair failed:", err))
  .finally(async () => await prisma.$disconnect());
