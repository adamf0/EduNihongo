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
  "回答": { explanation: "Hubungan makna antar kanji 回 dan 答, menunjukan bahwa gabungan kedua kanji itu mengandung makna “jawaban yang diberikan terhadap suatu pertanyaan atau permintaan informasi”.", charRoles: { "回": "mengembalikan", "答": "jawaban" }, category: "Jawaban / Tanggapan" },
  "応答": { explanation: "Hubungan makna antar kanji 応 dan 答, menunjukan bahwa gabungan kedua kanji itu mengandung makna “respons yang diberikan terhadap pertanyaan, panggilan, atau komunikasi”", charRoles: { "応": "menanggapi", "答": "jawaban" }, category: "Jawaban / Tanggapan" },
  "返答": { explanation: "Hubungan makna antara kanji 返 dan 答 menjadi 返答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memberikan jawaban atau balasan kembali kepada orang lain.”", charRoles: { "返": "mengembalikan, membalas", "答": "menjawab, jawaban" }, category: "Jawaban / Tanggapan" },
  "自答": { explanation: "Hubungan makna antara kanji 自 dan 答 menjadi 自答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menjawab sendiri terhadap pertanyaan atau persoalan yang dipikirkan.”", charRoles: { "自": "diri sendiri", "答": "menjawab, jawaban" }, category: "Jawaban / Tanggapan" },
  "答弁": { explanation: "Hubungan makna antara kanji 答 dan 弁 menjadi 答弁, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memberikan jawaban atau penjelasan terhadap pertanyaan, terutama dalam situasi resmi.”", charRoles: { "答": "menjawab, jawaban", "弁": "menjelaskan, menyampaikan dengan kata-kata" }, category: "Jawaban / Tanggapan" },
  "解答": { explanation: "Hubungan makna antara kanji 解 dan 答 menjadi 解答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “jawaban yang diperoleh melalui proses memecahkan atau menyelesaikan suatu persoalan.”", charRoles: { "解": "memecahkan, menjelaskan", "答": "jawaban" }, category: "Hasil Jawaban" },
  "答案": { explanation: "Hubungan makna antar kanji 答 dan 案, menunjukan bahwa gabungan kedua kanji itu mengandung makna “lembar jawaban untuk menuliskan jawaban dalam ujian atau latihan”", charRoles: { "答": "jawaban", "案": "naskah" }, category: "Hasil Jawaban" },
  "正答": { explanation: "Hubungan makna antar kanji 正 dan 答 menjadi 正答, menunjukan bahwa gabungan kedua kanji tersebut membentuk makna “jawaban yang benar atau tepat.”", charRoles: { "正": "benar", "答": "jawaban" }, category: "Hasil Jawaban" },
  "確答": { explanation: "Hubungan makna antara kanji 確 dan 答 menjadi 確答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “jawaban yang pasti dan jelas.”", charRoles: { "確": "pasti, jelas", "答": "jawaban" }, category: "Hasil Jawaban" },
  "口答": { explanation: "Hubungan makna antara kanji 口 dan 答 menjadi 口答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memberikan jawaban secara lisan.”", charRoles: { "口": "mulut, lisan", "答": "menjawab, jawaban" }, category: "Cara Menjawab" },
  "直答": { explanation: "Hubungan makna antara kanji 直 dan 答 menjadi 直答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memberikan jawaban secara langsung.”", charRoles: { "直": "langsung, tanpa perantara", "答": "menjawab, jawaban" }, category: "Cara Menjawab" },
  "筆答": { explanation: "Hubungan makna antara kanji 筆 dan 答 menjadi 筆答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memberikan jawaban melalui tulisan.”", charRoles: { "筆": "pena, tulisan", "答": "menjawab, jawaban" }, category: "Cara Menjawab" },
  "答辞": { explanation: "Hubungan makna antara kanji 答 dan 辞 menjadi 答辞, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “ucapan atau pidato yang disampaikan sebagai balasan terhadap ucapan dari pihak lain.”", charRoles: { "答": "menjawab, membalas", "辞": "kata-kata, ucapan" }, category: "Balasan" },
  "答礼": { explanation: "Hubungan makna antara kanji 答 dan 礼 menjadi 答礼, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “membalas salam, penghormatan, atau kesopanan yang diterima dari orang lain.”", charRoles: { "答": "menjawab, membalas", "礼": "salam, penghormatan" }, category: "Balasan" },

  // Jukugo entries for 題
  "課題": { explanation: "Hubungan makna antara kanji 課 dan 題 menjadi 課題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tugas atau persoalan yang diberikan untuk dikerjakan atau diselesaikan.”", charRoles: { "課": "memberikan atau membebankan tugas", "題": "soal, persoalan" }, category: "Soal / Tugas / Masalah" },
  "宿題": { explanation: "Hubungan makna antara kanji 宿 dan 題 menjadi 宿題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tugas yang dibawa pulang untuk dikerjakan di luar waktu pembelajaran.”", charRoles: { "宿": "tempat menginap; bermalam", "題": "soal, tugas" }, category: "Soal / Tugas / Masalah" },
  "出題": { explanation: "Hubungan makna antara kanji 出 dan 題 menjadi 出題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengeluarkan atau memberikan soal untuk dijawab.”", charRoles: { "出": "mengeluarkan, memberikan", "題": "soal, pertanyaan" }, category: "Soal / Tugas / Masalah" },
  "例題": { explanation: "Hubungan makna antara kanji 例 dan 題 menjadi 例題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “soal yang digunakan sebagai contoh.”", charRoles: { "例": "contoh", "題": "soal, pertanyaan" }, category: "Soal / Tugas / Masalah" },
  "難題": { explanation: "Hubungan makna antara kanji 難 dan 題 menjadi 難題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “persoalan atau masalah yang sulit untuk dijawab atau diselesaikan.”", charRoles: { "難": "sulit, sukar", "題": "soal, persoalan" }, category: "Soal / Tugas / Masalah" },
  "主題": { explanation: "Hubungan makna antara kanji 主 dan 題 menjadi 主題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tema atau pokok utama yang menjadi pusat suatu pembahasan atau karya.”", charRoles: { "主": "utama, pokok", "題": "tema, topik" }, category: "Tema / Topik" },
  "話題": { explanation: "Hubungan makna antara kanji 話 dan 題 menjadi 話題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “topik atau pokok yang menjadi bahan pembicaraan.”", charRoles: { "話": "berbicara, pembicaraan", "題": "topik, pokok" }, category: "Tema / Topik" },
  "論題": { explanation: "Hubungan makna antara kanji 論 dan 題 menjadi 論題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tema atau topik yang menjadi bahan pembahasan, argumentasi, atau perdebatan.”", charRoles: { "論": "membahas, berargumentasi", "題": "tema, topik" }, category: "Tema / Topik" },
  "議題": { explanation: "Hubungan makna antara kanji 議 dan 題 menjadi 議題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “topik atau persoalan yang diajukan untuk dibahas dalam suatu pertemuan atau rapat.”", charRoles: { "議": "membahas, berunding", "題": "topik, persoalan" }, category: "Tema / Topik" },
  "題名": { explanation: "Hubungan makna antara kanji 題 dan 名 menjadi 題名, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “nama atau judul yang diberikan pada suatu karya atau tulisan.”", charRoles: { "題": "judul", "名": "nama" }, category: "Judul" },
  "表題": { explanation: "Hubungan makna antara kanji 表 dan 題 menjadi 表題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “judul yang ditampilkan sebagai penanda isi suatu karya atau tulisan.”", charRoles: { "表": "permukaan, menampilkan", "題": "judul" }, category: "Judul" },
  "副題": { explanation: "Hubungan makna antara kanji 副 dan 題 menjadi 副題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “judul tambahan yang melengkapi judul utama.”", charRoles: { "副": "tambahan, sekunder", "題": "judul" }, category: "Judul" },
  "演題": { explanation: "Hubungan makna antara kanji 演 dan 題 menjadi 演題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “judul atau topik yang disampaikan dalam ceramah, pidato, atau presentasi.”", charRoles: { "演": "menyampaikan, mempertunjukkan", "題": "judul, topik" }, category: "Judul" },
  "題字": { explanation: "Hubungan makna antara kanji 題 dan 字 menjadi 題字, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “huruf atau tulisan yang digunakan sebagai judul.”", charRoles: { "題": "judul", "字": "huruf, tulisan" }, category: "Judul" },
  "題材": { explanation: "Hubungan makna antara kanji 題 dan 材 menjadi 題材, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bahan atau tema yang dijadikan dasar untuk membuat suatu karya.”", charRoles: { "題": "tema, pokok", "材": "bahan, material" }, category: "Bahan / Tema Karya" },

  // Jukugo entries for 問
  "質問": { explanation: "Hubungan makna antar kanji 質 dan 問 menjadi 質問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pertanyaan yang diajukan untuk memperoleh informasi atau penjelasan mengenai sesuatu.”", charRoles: { "質": "menanyakan, mencari kepastian", "問": "bertanya, menanyakan" }, category: "Bertanya / Mengajukan Pertanyaan" },
  "自問": { explanation: "Hubungan makna antar kanji 自 dan 問 menjadi 自問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bertanya atau mempertanyakan sesuatu kepada diri sendiri.”", charRoles: { "自": "diri sendiri", "問": "bertanya, menanyakan" }, category: "Bertanya / Mengajukan Pertanyaan" },
  "発問": { explanation: "Hubungan makna antar kanji 発 dan 問 menjadi 発問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengemukakan atau mengajukan suatu pertanyaan kepada orang lain.”", charRoles: { "発": "mengeluarkan, mengemukakan", "問": "bertanya, pertanyaan" }, category: "Bertanya / Mengajukan Pertanyaan" },
  "反問": { explanation: "Hubungan makna antar kanji 反 dan 問 menjadi 反問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengajukan pertanyaan kembali sebagai tanggapan terhadap pertanyaan yang diterima.”", charRoles: { "反": "berbalik, kembali", "問": "bertanya, pertanyaan" }, category: "Bertanya / Mengajukan Pertanyaan" },
  "問答": { explanation: "Hubungan makna antar kanji 問 dan 答 menjadi 問答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan saling bertanya dan menjawab mengenai suatu hal.”", charRoles: { "問": "bertanya, pertanyaan", "答": "menjawab, jawaban" }, category: "Tanya Jawab" },
  "問題": { explanation: "Hubungan makna antar kanji 問 dan 題 menjadi 問題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “suatu hal yang menjadi persoalan atau masalah yang perlu dipikirkan dan diselesaikan.”", charRoles: { "問": "pertanyaan, masalah", "題": "topik, pokok persoalan" }, category: "Soal / Pertanyaan" },
  "設問": { explanation: "Hubungan makna antar kanji 設 dan 問 menjadi 設問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pertanyaan atau soal yang disusun dan diberikan untuk dijawab.”", charRoles: { "設": "menyusun, menetapkan", "問": "pertanyaan, soal" }, category: "Soal / Pertanyaan" },
  "試問": { explanation: "Hubungan makna antar kanji 試 dan 問 menjadi 試問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengujian yang dilakukan dengan memberikan pertanyaan kepada seseorang”, sehingga mengandung makna ujian lisan.", charRoles: { "試": "mencoba, menguji", "問": "bertanya, pertanyaan" }, category: "Soal / Pertanyaan" },
  "難問": { explanation: "Hubungan makna antar kanji 難 dan 問 menjadi 難問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pertanyaan atau soal yang sulit untuk dijawab atau diselesaikan.”", charRoles: { "難": "sulit, kesulitan", "問": "pertanyaan, soal" }, category: "Soal / Pertanyaan" },
  "問診": { explanation: "Hubungan makna antar kanji 問 dan 診 menjadi 問診, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menanyakan kondisi atau gejala seseorang untuk keperluan pemeriksaan dan diagnosis medis.”", charRoles: { "問": "bertanya, menanyakan", "診": "memeriksa, mendiagnosis" }, category: "Pemeriksaan dengan Pertanyaan" },
  "検問": { explanation: "Hubungan makna antar kanji 検 dan 問 menjadi 検問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “melakukan pemeriksaan atau pengecekan terhadap seseorang atau sesuatu, termasuk dengan menanyakan keterangan.”", charRoles: { "検": "memeriksa, mengecek", "問": "bertanya, menanyakan" }, category: "Pemeriksaan dengan Pertanyaan" },
  "問責": { explanation: "Hubungan makna antar kanji 問 dan 責 menjadi 問責, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mempertanyakan dan meminta seseorang bertanggung jawab atas suatu tindakan atau keadaan.”", charRoles: { "問": "mempertanyakan, meminta penjelasan", "責": "tanggung jawab, kewajiban" }, category: "Mempertanyakan / Meminta Pertanggungjawaban" },
  "不問": { explanation: "Hubungan makna antar kanji 不 dan 問 menjadi 不問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tidak mempertanyakan atau tidak mempermasalahkan suatu hal.”", charRoles: { "不": "tidak", "問": "mempertanyakan, mempermasalahkan" }, category: "Mempertanyakan / Meminta Pertanggungjawaban" },
  "訪問": { explanation: "Hubungan makna antar kanji 訪 dan 問 menjadi 訪問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tindakan mendatangi atau mengunjungi seseorang maupun suatu tempat.”", charRoles: { "訪": "mengunjungi, mendatangi", "問": "mengunjungi, menengok" }, category: "Mengunjungi (Makna Perluasan)" },

  // Jukugo entries for 験
  "試験": { explanation: "Hubungan makna antara kanji 試 dan 験 menjadi 試験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “suatu kegiatan pengujian yang dilakukan untuk mengetahui atau mengukur pengetahuan, kemampuan, maupun hasil seseorang atau sesuatu”, sehingga mengandung makna ujian atau pengujian.", charRoles: { "試": "mencoba, menguji", "験": "menguji, memverifikasi hasil" }, category: "Pengujian / Pembuktian" },
  "受験": { explanation: "Hubungan makna antara kanji 受 dan 験 menjadi 受験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tindakan menerima atau menjalani suatu proses pengujian”, sehingga bermakna mengikuti ujian.", charRoles: { "受": "menerima, menjalani", "験": "ujian, pengujian" }, category: "Pengujian / Pembuktian" },
  "実験": { explanation: "Hubungan makna antara kanji 実 dan 験 menjadi 実験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan melakukan pengujian secara nyata atau praktis untuk membuktikan kebenaran suatu teori, hipotesis, atau fenomena.”", charRoles: { "実": "nyata, sungguh-sungguh, fakta", "験": "menguji, membuktikan" }, category: "Pengujian / Pembuktian" },
  "治験": { explanation: "Hubungan makna antara kanji 治 dan 験 menjadi 治験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengujian yang dilakukan untuk mengobati atau menyembuhkan, khususnya dalam konteks uji klinis obat atau metode pengobatan baru.”", charRoles: { "治": "menyembuhkan, mengobati, mengatur", "験": "menguji, membuktikan" }, category: "Pengujian / Pembuktian" },
  "経験": { explanation: "Hubungan makna antara kanji 経 dan 験 menjadi 経験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “proses melewati berbagai peristiwa atau keadaan yang kemudian diuji dan diverifikasi secara langsung melalui kehidupan nyata”, sehingga bermakna pengalaman.", charRoles: { "経": "melewati, melalui, mengalami", "験": "pengujian, verifikasi hasil, pengalaman" }, category: "Pengalaman" },
  "体験": { explanation: "Hubungan makna antara kanji 体 dan 験 menjadi 体験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengalaman yang dirasakan atau dialami secara langsung oleh tubuh dan diri sendiri.”", charRoles: { "体": "tubuh, diri sendiri", "験": "pengalaman, pengujian langsung" }, category: "Pengalaman" },
  "験算": { explanation: "Hubungan makna antara kanji 験 dan 算 menjadi 験算, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan memeriksa atau memverifikasi kembali hasil perhitungan untuk memastikan kebenarannya.”", charRoles: { "験": "memverifikasi, menguji", "算": "menghitung, perhitungan" }, category: "Verifikasi / Pemeriksaan" },
  "効験": { explanation: "Hubungan makna antara kanji 効 dan 験 menjadi 効験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bukti nyata dari adanya khasiat, kemanjuran, atau efektivitas dari suatu usaha, obat, maupun tindakan.”", charRoles: { "効": "berkhasiat, efektif, hasil", "験": "bukti, verifikasi hasil" }, category: "Hasil / Efek / Bukti" },

  // Jukugo entries for 試
  "入試": { explanation: "Hubungan makna antara kanji 入 dan 試 menjadi 入試, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “ujian yang dilakukan untuk menentukan apakah seseorang dapat masuk ke sekolah, universitas, atau lembaga tertentu.”", charRoles: { "入": "masuk", "試": "ujian" }, category: "Aktivitas Pengujian" },
  "追試": { explanation: "Hubungan makna antara kanji 追 dan 試 menjadi 追試, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “ujian tambahan atau ujian susulan yang dilakukan setelah ujian utama.”", charRoles: { "追": "mengikuti, menyusul", "試": "ujian, pengujian" }, category: "Aktivitas Pengujian" },
  "試着": { explanation: "Hubungan makna antara kanji 試 dan 着 menjadi 試着, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba mengenakan pakaian untuk mengetahui ukuran, penampilan, atau kecocokannya.”", charRoles: { "試": "Mencoba", "着": "Memakai" }, category: "Penggunaan" },
  "試用": { explanation: "Hubungan makna antara kanji 試 dan 用 menjadi 試用, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba menggunakan sesuatu untuk mengetahui fungsi, kualitas, atau kesesuaiannya.”", charRoles: { "試": "Mencoba", "用": "Menggunakan" }, category: "Penggunaan" },
  "試乗": { explanation: "Hubungan makna antara kanji 試 dan 乗 menjadi 試乗, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba menaiki atau mengendarai kendaraan untuk mengetahui kondisi, kenyamanan, atau performanya.”", charRoles: { "試": "Mencoba", "乗": "Menaiki" }, category: "Penggunaan" },
  "試食": { explanation: "Hubungan makna antara kanji 試 dan 食 menjadi 試食, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba atau mencicipi makanan untuk mengetahui rasa atau kualitasnya.”", charRoles: { "試": "Mencoba", "食": "Makan" }, category: "Konsumsi" },
  "試飲": { explanation: "Hubungan makna antara kanji 試 dan 飲 menjadi 試飲, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba atau mencicipi minuman untuk mengetahui rasa atau kualitasnya.”", charRoles: { "試": "Mencoba", "飲": "Minum" }, category: "Konsumsi" },
  "試薬": { explanation: "Hubungan makna antara kanji 試 dan 薬 menjadi 試薬, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bahan kimia atau reagen yang digunakan untuk melakukan suatu pengujian.”", charRoles: { "試": "menguji", "薬": "zat kimia" }, category: "Bahan Pengujian" },
  "試作": { explanation: "Hubungan makna antara kanji 試 dan 作 menjadi 試作, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba membuat suatu benda atau produk sebagai percobaan untuk menilai bentuk, fungsi, atau kualitasnya.”", charRoles: { "試": "Percobaan", "作": "Membuat" }, category: "Produksi dan Pengembangan" },
  "試製": { explanation: "Hubungan makna antara kanji 試 dan 製 menjadi 試製, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “membuat atau memproduksi sesuatu secara percobaan untuk menguji hasilnya sebelum produksi sebenarnya.”", charRoles: { "試": "Percobaan", "製": "Memproduksi" }, category: "Produksi dan Pengembangan" },
  "試合": { explanation: "Hubungan makna antara kanji 試 dan 合 menjadi 試合, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan mempertemukan dua pihak untuk menguji atau membandingkan kemampuan dalam suatu pertandingan.”", charRoles: { "試": "Menguji", "合": "Bertanding" }, category: "Kompetisi dan Keterampilan" },
  "試技": { explanation: "Hubungan makna antara kanji 試 dan 技 menjadi 試技, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pelaksanaan atau percobaan suatu teknik untuk menunjukkan atau menguji keterampilan.”", charRoles: { "試": "Menguji", "技": "Keterampilan" }, category: "Kompetisi dan Keterampilan" },
  "試射": { explanation: "Hubungan makna antara kanji 試 dan 射 menjadi 試射, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “percobaan menembak untuk menguji ketepatan, jarak, atau kondisi senjata.”", charRoles: { "試": "Menguji", "射": "Menembak" }, category: "Kompetisi dan Keterampilan" },
  "試練": { explanation: "Hubungan makna antara kanji 試 dan 練 menjadi 試練, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “ujian atau cobaan berat yang dialami seseorang untuk melatih dan menguji ketahanan serta kesabaran.”", charRoles: { "試": "Menguji", "練": "Melatih" }, category: "Kompetisi dan Keterampilan" },
  "試写": { explanation: "Hubungan makna antara kanji 試 dan 写 menjadi 試写, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menayangkan atau melihat film sebagai percobaan sebelum ditampilkan secara umum.”", charRoles: { "試": "mencoba", "写": "menayangkan" }, category: "Media" },
  "試聴": { explanation: "Hubungan makna antara kanji 試 dan 聴 menjadi 試聴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba mendengarkan musik, rekaman, atau media suara untuk mengetahui isi atau kualitasnya.”", charRoles: { "試": "Mencoba", "聴": "Mendengar" }, category: "Media" },
  "試読": { explanation: "Hubungan makna antara kanji 試 dan 読 menjadi 試読, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba membaca suatu tulisan atau karya untuk mengetahui isi atau kualitasnya sebelum membaca lebih lanjut.”", charRoles: { "試": "mencoba", "読": "membaca" }, category: "Media" },
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
