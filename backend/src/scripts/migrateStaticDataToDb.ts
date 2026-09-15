import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Static JUKUGO_RESEARCH_DETAILS extracted from frontend
const JUKUGO_RESEARCH_DETAILS: Record<string, {
  explanation: string;
  charRoles: Record<string, string>;
  category: string;
}> = {
  // Jukugo entries for 点
  "採点": {
    explanation: "Hubungan makna antar kanji 採 dan 点, saat digabungkan menjadi 採点, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'kegiatan memberikan nilai terhadap hasil pekerjaan'",
    charRoles: { "採": "memberi / mengambil", "点": "nilai" },
    category: "Penilaian dan Nilai",
  },
  "得点": {
    explanation: "Hubungan makna antar kanji 得 dan 点 saat digabung menjadi 得点, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'jumlah nilai yang diperoleh seseorang'",
    charRoles: { "得": "memperoleh", "点": "poin" },
    category: "Penilaian dan Nilai",
  },
  "減点": {
    explanation: "Hubungan makna antar kanji 減 dan 点, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'nilai yang dikurangi'",
    charRoles: { "減": "mengurangi", "点": "nilai" },
    category: "Penilaian dan Nilai",
  },
  "地点": {
    explanation: "Hubungan makna antar kanji 地 dan 点 menjadi 地点, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'titik tertentu pada suatu lokasi'",
    charRoles: { "地": "tempat", "点": "titik" },
    category: "Titik dan Lokasi",
  },
  "起点": {
    explanation: "Hubungan makna antar kanji 起 dan 点, menunjukan bahwa gabungan dua kanji tersebut mengandung makna 'tempat dimulainya suatu perjalanan atau aktivitas'",
    charRoles: { "起": "mulai", "点": "awal" },
    category: "Titik dan Lokasi",
  },
  "終点": {
    explanation: "Hubungan makna antar kanji 終 dan 点, menunjukan bahwa gabungan dua kanji tersebut mengandung makna 'tempat berakhirnya suatu perjalanan'",
    charRoles: { "終": "selesai", "点": "tempat" },
    category: "Titik dan Lokasi",
  },
  "観点": {
    explanation: "Hubungan makna antar kanji 観 dan 点 menjadi 観点, menunjukan gabungan dua kanji tersebut mengandung makna 'cara melihat/memandang suatu persoalan'",
    charRoles: { "観": "melihat", "点": "titik" },
    category: "Pandangan dan Aspek",
  },
  "視点": {
    explanation: "Hubungan makna antar kanji 視 dan 点 menjadi 視点, menunjukan bahwa gabungan dua kanji tersebut mengandung makna 'posisi atau sudut pandang dalam memahami suatu masalah'",
    charRoles: { "視": "melihat", "点": "titik" },
    category: "Pandangan dan Aspek",
  },
  "論点": {
    explanation: "Hubungan makna antar kanji 論 dan 点 menjadi 論点, menunjukan bahwa gabungan dua kanji tersebut mengandung makna 'masalah utama yang menjadi inti pembahasan'",
    charRoles: { "論": "pembahasan", "点": "pokok" },
    category: "Pandangan dan Aspek",
  },
  "問題点": {
    explanation: "Hubungan makna antar kanji 問題 dan 点 menjadi 問題点, menunjukan bahwa gabungan kedua kanji tersebut mengandung makna 'bagian yang menjadi sumber masalah'",
    charRoles: { "問": "bertanya / masalah", "題": "topik / masalah", "点": "titik" },
    category: "Fokus dan Permasalahan",
  },
  "重点": {
    explanation: "Hubungan makna antar kanji 重 dan 点 menjadi 重点, menunjukan bahwa gabungan kedua kanji tersebut mengandung makna 'bagian yang terpenting untuk diperhatikan'",
    charRoles: { "重": "penting", "点": "titik" },
    category: "Fokus dan Permasalahan",
  },
  "要点": {
    explanation: "Hubungan makna antar kanji 要 dan 点 menjadi 要点, menunjukan bahwa gabungan kedua kanji tersebut mengandung makna 'pokok dari suatu penjelasan'",
    charRoles: { "要": "inti", "点": "poin" },
    category: "Fokus dan Permasalahan",
  },
  "点検": {
    explanation: "Hubungan makna antar kanji 点 dan 検 menjadi 点検, menunjukan bahwa gabungan kedua kanji tersebut mengandung makna 'keadaan memeriksa kondisi suatu benda atau sistem'",
    charRoles: { "点": "memeriksa", "検": "inspeksi" },
    category: "Pemeriksaan dan Data",
  },
  "点灯": {
    explanation: "Hubungan makna antar kanji 点 dan 灯 menjadi 点灯, menunjukan bahwa gabungan kedua kanji tersebut mengandung makna 'menghidupkan lampu atau penerangan'",
    charRoles: { "点": "menyalakan", "灯": "lampu" },
    category: "Pemeriksaan dan Data",
  },
  "点数": {
    explanation: "Hubungan makna antar kanji 点 dan 数 menjadi 点数, menunjukan bahwa gabungan kedua kanji tersebut mengandung makna 'jumlah nilai yang diperoleh dalam suatu penilaian'",
    charRoles: { "点": "poin", "数": "jumlah" },
    category: "Pemeriksaan dan Data",
  },

  // Jukugo entries for 答
  "回答": {
    explanation: "Hubungan makna antar kanji 回 dan 答, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'jawaban yang diberikan terhadap suatu pertanyaan atau permintaan informasi'",
    charRoles: { "回": "mengembalikan", "答": "jawaban" },
    category: "Pertanyaan dan Jawaban",
  },
  "解答": {
    explanation: "Hubungan makna antar kanji 解 dan 答, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'jawaban yang digunakan untuk menyelesaikan soal atau permasalahan'",
    charRoles: { "解": "menyelesaikan", "答": "jawaban" },
    category: "Pertanyaan dan Jawaban",
  },
  "応答": {
    explanation: "Hubungan makna antar kanji 応 dan 答, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'respons yang diberikan terhadap pertanyaan, panggilan, atau komunikasi'",
    charRoles: { "応": "menanggapi", "答": "jawaban" },
    category: "Pertanyaan dan Jawaban",
  },
  "答案": {
    explanation: "Hubungan makna antar kanji 答 dan 案, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'lembar jawaban untuk menuliskan jawaban dalam ujian atau latihan'",
    charRoles: { "答": "jawaban", "案": "naskah" },
    category: "Pendidikan dan Evaluasi",
  },
  "正答": {
    explanation: "Hubungan makna antar kanji 正 dan 答 menjadi 正答, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'jawaban yang sesuai dengan kebenaran atau kunci jawaban'",
    charRoles: { "正": "benar", "答": "jawaban" },
    category: "Pendidikan dan Evaluasi",
  },
  "解答用紙": {
    explanation: "Hubungan makna antar kanji 解答 dan 用紙 menjadi 解答用紙, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'sebuah lembaran resmi yang digunakan untuk menuliskan jawaban peserta ujian'",
    charRoles: { "解": "menyelesaikan", "答": "jawaban", "用": "keperluan", "紙": "kertas" },
    category: "Pendidikan dan Evaluasi",
  },
  "返答": {
    explanation: "Hubungan makna antar kanji 返 dan 答 menjadi 返答, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'jawaban atau balasan terhadap pertanyaan, surat, maupun pesan'",
    charRoles: { "返": "mengembalikan", "答": "jawaban" },
    category: "Komunikasi dan Diskusi",
  },
  "口答": {
    explanation: "Hubungan makna antar kanji 口 dan 答 menjadi 口答, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'jawaban yang disampaikan secara lisan'",
    charRoles: { "口": "mulut", "答": "jawaban" },
    category: "Komunikasi dan Diskusi",
  },
  "答弁": {
    explanation: "Hubungan makna antar kanji 答 dan 弁 menjadi 答弁, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'jawaban resmi yang diberikan dalam rapat, sidang atau pun forum'",
    charRoles: { "答": "menjawab", "弁": "penjelasan" },
    category: "Komunikasi dan Diskusi",
  },
  "一問一答": {
    explanation: "Hubungan makna antar kanji 一、問、一、dan 答 menjadi 一問一答, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'metode belajar yang menyajikan satu pertanyaan untuk satu jawaban'",
    charRoles: { "一": "satu", "問": "pertanyaan", "答": "jawaban" },
    category: "Akademik dan Penelitian",
  },
  "答申": {
    explanation: "Hubungan makna antar kanji 答 dan 申 menjadi 答申, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'jawaban resmi yang disampaikan kepada pihak yang meminta pertimbangan'",
    charRoles: { "答": "menjawab", "申": "menyampaikan" },
    category: "Akademik dan Penelitian",
  },
  "自動応答": {
    explanation: "Hubungan makna antar kanji 自動 dan 応答 menjadi 自動応答, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'jawaban yang diberikan secara otomatis oleh sistem komputer atau perangkat'",
    charRoles: { "自": "diri", "動": "gerak", "応": "menanggapi", "答": "jawaban" },
    category: "Teknologi dan Layanan",
  },
  "応答時間": {
    explanation: "Hubungan makna antar kanji 応答 dan 時間 menjadi 応答時間, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'lamanya waktu yang diperlukan seseorang atau sistem untuk memberikan jawaban'",
    charRoles: { "応": "menanggapi", "答": "jawaban", "時": "waktu", "間": "durasi" },
    category: "Teknologi dan Layanan",
  },
  "応答率": {
    explanation: "Hubungan makna antar kanji 応答 dan 率 menjadi 応答率, menunjukan bahwa gabungan kedua kanji itu mengandung makna 'persentase jumlah respons yang diterima dibanding jumlah pertanyaan'",
    charRoles: { "応": "menanggapi", "答": "jawaban", "率": "tingkat" },
    category: "Teknologi dan Layanan",
  },

  // Jukugo entries for 題
  "課題": {
    explanation: "Hubungan makna antara kanji 課 dan 題 menjadi 課題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tugas atau persoalan yang diberikan untuk dikerjakan atau diselesaikan.”",
    charRoles: { "課": "memberikan atau membebankan tugas", "題": "soal, persoalan" },
    category: "Soal / Tugas / Masalah",
  },
  "宿題": {
    explanation: "Hubungan makna antara kanji 宿 dan 題 menjadi 宿題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tugas yang dibawa pulang untuk dikerjakan di luar waktu pembelajaran.”",
    charRoles: { "宿": "tempat menginap; bermalam", "題": "soal, tugas" },
    category: "Soal / Tugas / Masalah",
  },
  "出題": {
    explanation: "Hubungan makna antara kanji 出 dan 題 menjadi 出題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengeluarkan atau memberikan soal untuk dijawab.”",
    charRoles: { "出": "mengeluarkan, memberikan", "題": "soal, pertanyaan" },
    category: "Soal / Tugas / Masalah",
  },
  "例題": {
    explanation: "Hubungan makna antara kanji 例 dan 題 menjadi 例題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “soal yang digunakan sebagai contoh.”",
    charRoles: { "例": "contoh", "題": "soal, pertanyaan" },
    category: "Soal / Tugas / Masalah",
  },
  "難題": {
    explanation: "Hubungan makna antara kanji 難 dan 題 menjadi 難題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “persoalan atau masalah yang sulit untuk dijawab atau diselesaikan.”",
    charRoles: { "難": "sulit, sukar", "題": "soal, persoalan" },
    category: "Soal / Tugas / Masalah",
  },
  "主題": {
    explanation: "Hubungan makna antara kanji 主 dan 題 menjadi 主題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tema atau pokok utama yang menjadi pusat suatu pembahasan atau karya.”",
    charRoles: { "主": "utama, pokok", "題": "tema, topik" },
    category: "Tema / Topik",
  },
  "話題": {
    explanation: "Hubungan makna antara kanji 話 dan 題 menjadi 話題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “topik atau pokok yang menjadi bahan pembicaraan.”",
    charRoles: { "話": "berbicara, pembicaraan", "題": "topik, pokok" },
    category: "Tema / Topik",
  },
  "論題": {
    explanation: "Hubungan makna antara kanji 論 dan 題 menjadi 論題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tema atau topik yang menjadi bahan pembahasan, argumentasi, atau perdebatan.”",
    charRoles: { "論": "membahas, berargumentasi", "題": "tema, topik" },
    category: "Tema / Topik",
  },
  "議題": {
    explanation: "Hubungan makna antara kanji 議 dan 題 menjadi 議題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “topik atau persoalan yang diajukan untuk dibahas dalam suatu pertemuan atau rapat.”",
    charRoles: { "議": "membahas, berunding", "題": "topik, persoalan" },
    category: "Tema / Topik",
  },
  "題名": {
    explanation: "Hubungan makna antara kanji 題 dan 名 menjadi 題名, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “nama atau judul yang diberikan pada suatu karya atau tulisan.”",
    charRoles: { "題": "judul", "名": "nama" },
    category: "Judul",
  },
  "表題": {
    explanation: "Hubungan makna antara kanji 表 dan 題 menjadi 表題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “judul yang ditampilkan sebagai penanda isi suatu karya atau tulisan.”",
    charRoles: { "表": "permukaan, menampilkan", "題": "judul" },
    category: "Judul",
  },
  "副題": {
    explanation: "Hubungan makna antara kanji 副 dan 題 menjadi 副題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “judul tambahan yang melengkapi judul utama.”",
    charRoles: { "副": "tambahan, sekunder", "題": "judul" },
    category: "Judul",
  },
  "演題": {
    explanation: "Hubungan makna antara kanji 演 dan 題 menjadi 演題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “judul atau topik yang disampaikan dalam ceramah, pidato, atau presentasi.”",
    charRoles: { "演": "menyampaikan, mempertunjukkan", "題": "judul, topik" },
    category: "Judul",
  },
  "題字": {
    explanation: "Hubungan makna antara kanji 題 dan 字 menjadi 題字, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “huruf atau tulisan yang digunakan sebagai judul.”",
    charRoles: { "題": "judul", "字": "huruf, tulisan" },
    category: "Judul",
  },
  "題材": {
    explanation: "Hubungan makna antara kanji 題 dan 材 menjadi 題材, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bahan atau tema yang dijadikan dasar untuk membuat suatu karya.”",
    charRoles: { "題": "tema, pokok", "材": "bahan, material" },
    category: "Bahan / Tema Karya",
  },

  // Jukugo entries for 問
  "質問": {
    explanation: "Hubungan makna antar kanji 質 dan 問 menjadi 質問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pertanyaan yang diajukan untuk memperoleh informasi atau penjelasan mengenai sesuatu.”",
    charRoles: { "質": "menanyakan, mencari kepastian", "問": "bertanya, menanyakan" },
    category: "Bertanya / Mengajukan Pertanyaan",
  },
  "自問": {
    explanation: "Hubungan makna antar kanji 自 dan 問 menjadi 自問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bertanya atau mempertanyakan sesuatu kepada diri sendiri.”",
    charRoles: { "自": "diri sendiri", "問": "bertanya, menanyakan" },
    category: "Bertanya / Mengajukan Pertanyaan",
  },
  "発問": {
    explanation: "Hubungan makna antar kanji 発 dan 問 menjadi 発問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengemukakan atau mengajukan suatu pertanyaan kepada orang lain.”",
    charRoles: { "発": "mengeluarkan, mengemukakan", "問": "bertanya, pertanyaan" },
    category: "Bertanya / Mengajukan Pertanyaan",
  },
  "反問": {
    explanation: "Hubungan makna antar kanji 反 dan 問 menjadi 反問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengajukan pertanyaan kembali sebagai tanggapan terhadap pertanyaan yang diterima.”",
    charRoles: { "反": "berbalik, kembali", "問": "bertanya, pertanyaan" },
    category: "Bertanya / Mengajukan Pertanyaan",
  },
  "問答": {
    explanation: "Hubungan makna antar kanji 問 dan 答 menjadi 問答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan saling bertanya dan menjawab mengenai suatu hal.”",
    charRoles: { "問": "bertanya, pertanyaan", "答": "menjawab, jawaban" },
    category: "Tanya Jawab",
  },
  "問題": {
    explanation: "Hubungan makna antar kanji 問 dan 題 menjadi 問題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “suatu hal yang menjadi persoalan atau masalah yang perlu dipikirkan dan diselesaikan.”",
    charRoles: { "問": "pertanyaan, masalah", "題": "topik, pokok persoalan" },
    category: "Soal / Pertanyaan",
  },
  "設問": {
    explanation: "Hubungan makna antar kanji 設 dan 問 menjadi 設問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pertanyaan atau soal yang disusun dan diberikan untuk dijawab.”",
    charRoles: { "設": "menyusun, menetapkan", "問": "pertanyaan, soal" },
    category: "Soal / Pertanyaan",
  },
  "試問": {
    explanation: "Hubungan makna antar kanji 試 dan 問 menjadi 試問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengujian yang dilakukan dengan memberikan pertanyaan kepada seseorang”, sehingga mengandung makna ujian lisan.",
    charRoles: { "試": "mencoba, menguji", "問": "bertanya, pertanyaan" },
    category: "Soal / Pertanyaan",
  },
  "難問": {
    explanation: "Hubungan makna antar kanji 難 dan 問 menjadi 難問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pertanyaan atau soal yang sulit untuk dijawab atau diselesaikan.”",
    charRoles: { "難": "sulit, kesulitan", "問": "pertanyaan, soal" },
    category: "Soal / Pertanyaan",
  },
  "問診": {
    explanation: "Hubungan makna antar kanji 問 dan 診 menjadi 問診, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menanyakan kondisi atau gejala seseorang untuk keperluan pemeriksaan dan diagnosis medis.”",
    charRoles: { "問": "bertanya, menanyakan", "診": "memeriksa, mendiagnosis" },
    category: "Pemeriksaan dengan Pertanyaan",
  },
  "検問": {
    explanation: "Hubungan makna antar kanji 検 dan 問 menjadi 検問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “melakukan pemeriksaan atau pengecekan terhadap seseorang atau sesuatu, termasuk dengan menanyakan keterangan.”",
    charRoles: { "検": "memeriksa, mengecek", "問": "bertanya, menanyakan" },
    category: "Pemeriksaan dengan Pertanyaan",
  },
  "問責": {
    explanation: "Hubungan makna antar kanji 問 dan 責 menjadi 問責, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mempertanyakan dan meminta seseorang bertanggung jawab atas suatu tindakan atau keadaan.”",
    charRoles: { "問": "mempertanyakan, meminta penjelasan", "責": "tanggung jawab, kewajiban" },
    category: "Mempertanyakan / Meminta Pertanggungjawaban",
  },
  "不問": {
    explanation: "Hubungan makna antar kanji 不 dan 問 menjadi 不問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tidak mempertanyakan atau tidak mempermasalahkan suatu hal.”",
    charRoles: { "不": "tidak", "問": "mempertanyakan, mempermasalahkan" },
    category: "Mempertanyakan / Meminta Pertanggungjawaban",
  },
  "訪問": {
    explanation: "Hubungan makna antar kanji 訪 dan 問 menjadi 訪問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tindakan mendatangi atau mengunjungi seseorang maupun suatu tempat.”",
    charRoles: { "訪": "mengunjungi, mendatangi", "問": "mengunjungi, menengok" },
    category: "Mengunjungi (Makna Perluasan)",
  },

  // Jukugo entries for 験
  "試験": {
    explanation: "Hubungan makna antara kanji 試 dan 験 menjadi 試験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “suatu kegiatan pengujian yang dilakukan untuk mengetahui atau mengukur pengetahuan, kemampuan, maupun hasil seseorang atau sesuatu”, sehingga mengandung makna ujian atau pengujian.",
    charRoles: { "試": "mencoba, menguji", "験": "menguji, memverifikasi hasil" },
    category: "Pengujian / Pembuktian",
  },
  "受験": {
    explanation: "Hubungan makna antara kanji 受 dan 験 menjadi 受験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tindakan menerima atau menjalani suatu proses pengujian”, sehingga bermakna mengikuti ujian.",
    charRoles: { "受": "menerima, menjalani", "験": "ujian, pengujian" },
    category: "Pengujian / Pembuktian",
  },
  "実験": {
    explanation: "Hubungan makna antara kanji 実 dan 験 menjadi 実験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan melakukan pengujian secara nyata atau praktis untuk membuktikan kebenaran suatu teori, hipotesis, atau fenomena.”",
    charRoles: { "実": "nyata, sungguh-sungguh, fakta", "験": "menguji, membuktikan" },
    category: "Pengujian / Pembuktian",
  },
  "治験": {
    explanation: "Hubungan makna antara kanji 治 dan 験 menjadi 治験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengujian yang dilakukan untuk mengobati atau menyembuhkan, khususnya dalam konteks uji klinis obat atau metode pengobatan baru.”",
    charRoles: { "治": "menyembuhkan, mengobati, mengatur", "験": "menguji, membuktikan" },
    category: "Pengujian / Pembuktian",
  },
  "経験": {
    explanation: "Hubungan makna antara kanji 経 dan 験 menjadi 経験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “proses melewati berbagai peristiwa atau keadaan yang kemudian diuji dan diverifikasi secara langsung melalui kehidupan nyata”, sehingga bermakna pengalaman.",
    charRoles: { "経": "melewati, melalui, mengalami", "験": "pengujian, verifikasi hasil, pengalaman" },
    category: "Pengalaman",
  },
  "体験": {
    explanation: "Hubungan makna antara kanji 体 dan 験 menjadi 体験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengalaman yang dirasakan atau dialami secara langsung oleh tubuh dan diri sendiri.”",
    charRoles: { "体": "tubuh, diri sendiri", "験": "pengalaman, pengujian langsung" },
    category: "Pengalaman",
  },
  "験算": {
    explanation: "Hubungan makna antara kanji 験 dan 算 menjadi 験算, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan memeriksa atau memverifikasi kembali hasil perhitungan untuk memastikan kebenarannya.”",
    charRoles: { "験": "memverifikasi, menguji", "算": "menghitung, perhitungan" },
    category: "Verifikasi / Pemeriksaan",
  },
  "効験": {
    explanation: "Hubungan makna antara kanji 効 dan 験 menjadi 効験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bukti nyata dari adanya khasiat, kemanjuran, atau efektivitas dari suatu usaha, obat, maupun tindakan.”",
    charRoles: { "効": "berkhasiat, efektif, hasil", "験": "bukti, verifikasi hasil" },
    category: "Hasil / Efek / Bukti",
  },

  // Jukugo entries for 試
  "入試": {
    explanation: "Hubungan makna antara kanji 入 dan 試 menjadi 入試, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “ujian yang dilakukan untuk menentukan apakah seseorang dapat masuk ke sekolah, universitas, atau lembaga tertentu.”",
    charRoles: { "入": "masuk", "試": "ujian" },
    category: "Aktivitas Pengujian",
  },
  "追試": {
    explanation: "Hubungan makna antara kanji 追 dan 試 menjadi 追試, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “ujian tambahan atau ujian susulan yang dilakukan setelah ujian utama.”",
    charRoles: { "追": "mengikuti, menyusul", "試": "ujian, pengujian" },
    category: "Aktivitas Pengujian",
  },
  "試着": {
    explanation: "Hubungan makna antara kanji 試 dan 着 menjadi 試着, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba mengenakan pakaian untuk mengetahui ukuran, penampilan, atau kecocokannya.”",
    charRoles: { "試": "Mencoba", "着": "Memakai" },
    category: "Penggunaan",
  },
  "試用": {
    explanation: "Hubungan makna antara kanji 試 dan 用 menjadi 試用, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba menggunakan sesuatu untuk mengetahui fungsi, kualitas, atau kesesuaiannya.”",
    charRoles: { "試": "Mencoba", "用": "Menggunakan" },
    category: "Penggunaan",
  },
  "試乗": {
    explanation: "Hubungan makna antara kanji 試 dan 乗 menjadi 試乗, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba menaiki atau mengendarai kendaraan untuk mengetahui kondisi, kenyamanan, atau performanya.”",
    charRoles: { "試": "Mencoba", "乗": "Menaiki" },
    category: "Penggunaan",
  },
  "試食": {
    explanation: "Hubungan makna antara kanji 試 dan 食 menjadi 試食, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba atau mencicipi makanan untuk mengetahui rasa atau kualitasnya.”",
    charRoles: { "試": "Mencoba", "食": "Makan" },
    category: "Konsumsi",
  },
  "試飲": {
    explanation: "Hubungan makna antara kanji 試 dan 飲 menjadi 試飲, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba atau mencicipi minuman untuk mengetahui rasa atau kualitasnya.”",
    charRoles: { "試": "Mencoba", "飲": "Minum" },
    category: "Konsumsi",
  },
  "試薬": {
    explanation: "Hubungan makna antara kanji 試 dan 薬 menjadi 試薬, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bahan kimia atau reagen yang digunakan untuk melakukan suatu pengujian.”",
    charRoles: { "試": "menguji", "薬": "zat kimia" },
    category: "Bahan Pengujian",
  },
  "試作": {
    explanation: "Hubungan makna antara kanji 試 dan 作 menjadi 試作, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba membuat suatu benda atau produk sebagai percobaan untuk menilai bentuk, fungsi, atau kualitasnya.”",
    charRoles: { "試": "Percobaan", "作": "Membuat" },
    category: "Produksi dan Pengembangan",
  },
  "試製": {
    explanation: "Hubungan makna antara kanji 試 dan 製 menjadi 試製, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “membuat atau memproduksi sesuatu secara percobaan untuk menguji hasilnya sebelum produksi sebenarnya.”",
    charRoles: { "試": "Percobaan", "製": "Memproduksi" },
    category: "Produksi dan Pengembangan",
  },
  "試合": {
    explanation: "Hubungan makna antara kanji 試 dan 合 menjadi 試合, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan mempertemukan dua pihak untuk menguji atau membandingkan kemampuan dalam suatu pertandingan.”",
    charRoles: { "試": "Menguji", "合": "Bertanding" },
    category: "Kompetisi dan Keterampilan",
  },
  "試技": {
    explanation: "Hubungan makna antara kanji 試 dan 技 menjadi 試技, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pelaksanaan atau percobaan suatu teknik untuk menunjukkan atau menguji keterampilan.”",
    charRoles: { "試": "Menguji", "技": "Keterampilan" },
    category: "Kompetisi dan Keterampilan",
  },
  "試射": {
    explanation: "Hubungan makna antara kanji 試 dan 射 menjadi 試射, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “percobaan menembak untuk menguji ketepatan, jarak, atau kondisi senjata.”",
    charRoles: { "試": "Menguji", "射": "Menembak" },
    category: "Kompetisi dan Keterampilan",
  },
  "試練": {
    explanation: "Hubungan makna antara kanji 試 dan 練 menjadi 試練, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “ujian atau cobaan berat yang dialami seseorang untuk melatih dan menguji ketahanan serta kesabaran.”",
    charRoles: { "試": "Menguji", "練": "Melatih" },
    category: "Kompetisi dan Keterampilan",
  },
  "試写": {
    explanation: "Hubungan makna antara kanji 試 dan 写 menjadi 試写, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menayangkan atau melihat film sebagai percobaan sebelum ditampilkan secara umum.”",
    charRoles: { "試": "mencoba", "写": "menayangkan" },
    category: "Media",
  },
  "試聴": {
    explanation: "Hubungan makna antara kanji 試 dan 聴 menjadi 試聴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba mendengarkan musik, rekaman, atau media suara untuk mengetahui isi atau kualitasnya.”",
    charRoles: { "試": "Mencoba", "聴": "Mendengar" },
    category: "Media",
  },
  "試読": {
    explanation: "Hubungan makna antara kanji 試 dan 読 menjadi 試読, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba membaca suatu tulisan atau karya untuk mengetahui isi atau kualitasnya sebelum membaca lebih lanjut.”",
    charRoles: { "試": "mencoba", "読": "membaca" },
    category: "Media",
  },
};

// Static CONSTITUENT_KANJI_DATA extracted from frontend
const CONSTITUENT_KANJI_DATA: Record<string, any> = {
  // Kanjis for 点
  "点": { romaji: "Ten", meaning: "Titik / Poin / Nilai", baseMeaning: "Titik, Poin, Nilai", bushu: "黑 (Hitam)", kunyomi: "つ.く, た.てる", onyomi: "テン", category: "Kanji Utama" },
  "採": { romaji: "Sai", meaning: "Memberi / Mengambil", baseMeaning: "Mengambil, Memilih, Memetik", bushu: "手 (Tangan)", kunyomi: "と.る", onyomi: "サイ", category: "Penilaian dan Nilai" },
  "得": { romaji: "Toku", meaning: "Memperoleh", baseMeaning: "Memperoleh, Mendapat, Keuntungan", bushu: "彳 (Langkah)", kunyomi: "え.る, う.る", onyomi: "トク", category: "Penilaian dan Nilai" },
  "減": { romaji: "Gen", meaning: "Mengurangi", baseMeaning: "Berkurang, Mengurangi", bushu: "水 (Air)", kunyomi: "へ.る, へ.らす", onyomi: "ゲン", category: "Penilaian dan Nilai" },
  "地": { romaji: "Chi / Ji", meaning: "Tempat / Tanah", baseMeaning: "Bumi, Tanah, Posisi", bushu: "土 (Tanah)", kunyomi: "つち", onyomi: "チ, ジ", category: "Titik dan Lokasi" },
  "起": { romaji: "Ki", meaning: "Mulai / Bangun", baseMeaning: "Bangun, Memicu, Memulai", bushu: "走 (Lari)", kunyomi: "お.きる, お.こる", onyomi: "キ", category: "Titik dan Lokasi" },
  "終": { romaji: "Shuu", meaning: "Selesai / Akhir", baseMeaning: "Berakhir, Selesai", bushu: "糸 (Benang)", kunyomi: "お.わる, お.わる", onyomi: "シュウ", category: "Titik dan Lokasi" },
  "観": { romaji: "Kan", meaning: "Melihat / Pandangan", baseMeaning: "Melihat, Mengamati", bushu: "見 (Melihat)", kunyomi: "み.る", onyomi: "カン", category: "Pandangan dan Aspek" },
  "視": { romaji: "Shi", meaning: "Melihat / Penglihatan", baseMeaning: "Melihat, Memandang", bushu: "見 (Melihat)", kunyomi: "み.る", onyomi: "シ", category: "Pandangan dan Aspek" },
  "論": { romaji: "Ron", meaning: "Pembahasan / Argumen", baseMeaning: "Diskusi, Pembahasan, Teori", bushu: "言 (Bicara)", kunyomi: "あげつら.う", onyomi: "ロン", category: "Pandangan dan Aspek" },
  "問": { romaji: "Mon", meaning: "Bertanya / Masalah", baseMeaning: "Bertanya, Pertanyaan, Masalah", bushu: "口 (Mulut)", kunyomi: "to.u, to.i", onyomi: "モン", category: "Fokus dan Permasalahan" },
  "題": { romaji: "Dai", meaning: "Topik / Judul / Soal", baseMeaning: "Topik, Judul, Tema, Masalah", bushu: "頁 (Kepala)", kunyomi: "だい", onyomi: "ダイ", category: "Kanji Utama" },
  "重": { romaji: "Juu / Chou", meaning: "Penting / Berat", baseMeaning: "Berat, Utama, Penting", bushu: "里 (Desa)", kunyomi: "おも.い, かさ.ねる", onyomi: "ジュウ, チョウ", category: "Fokus dan Permasalahan" },
  "要": { romaji: "You", meaning: "Inti / Penting", baseMeaning: "Inti, Memerlukan, Penting", bushu: "襾 (Penutup)", kunyomi: "い.る, かなめ", onyomi: "ヨウ", category: "Fokus dan Permasalahan" },
  "検": { romaji: "Ken", meaning: "Inspeksi / Memeriksa", baseMeaning: "Memeriksa, Meneliti, Inspeksi", bushu: "木 (Pohon)", kunyomi: "しら.べる", onyomi: "ケン", category: "Pemeriksaan dan Data" },
  "灯": { romaji: "Tou", meaning: "Lampu / Penerangan", baseMeaning: "Lampu, Cahaya, Api", bushu: "火 (Api)", kunyomi: "ひ, あかり", onyomi: "トウ", category: "Pemeriksaan dan Data" },
  "数": { romaji: "Suu / Kazu", meaning: "Jumlah / Angka", baseMeaning: "Angka, Jumlah, Menghitung", bushu: "攴 (Cambuk)", kunyomi: "かず, かぞ.える", onyomi: "スウ, ス", category: "Pemeriksaan dan Data" },

  // Kanjis for 答
  "答": { romaji: "Tou / Kotae", meaning: "Jawaban / Respons", baseMeaning: "Menjawab, membalas, merespon", bushu: "竹 (Bambu)", kunyomi: "こた.える", onyomi: "トウ", category: "Kanji Utama" },
  "回": { romaji: "Kai / Mawa", meaning: "Mengembalikan / Kali", baseMeaning: "Mengelilingi, Mengembalikan", bushu: "口 (Mulut)", kunyomi: "まわ.る", onyomi: "カイ", category: "Pertanyaan dan Jawaban" },
  "解": { romaji: "Kai / Toku", meaning: "Menyelesaikan / Memahami", baseMeaning: "Melepas, Memecahkan, Memahami", bushu: "角 (Tanduk)", kunyomi: "to.ku, to.keru", onyomi: "カイ", category: "Pertanyaan dan Jawaban" },
  "応": { romaji: "Ou", meaning: "Menanggapi / Respons", baseMeaning: "Merespons, Menanggapi", bushu: "心 (Hati)", kunyomi: "こた.える", onyomi: "オウ", category: "Pertanyaan dan Jawaban" },
  "案": { romaji: "An", meaning: "Naskah / Rencana", baseMeaning: "Gagasan, Draft, Lembaran", bushu: "木 (Pohon)", kunyomi: "つくえ", onyomi: "アン", category: "Pendidikan dan Evaluasi" },
  "正": { romaji: "Sei / Shou", meaning: "Benar / Tepat", baseMeaning: "Tepat, Benar, Lurus", bushu: "止 (Berhenti)", kunyomi: "tada.shii", onyomi: "セイ, ショウ", category: "Pendidikan dan Evaluasi" },
  "用": { romaji: "You", meaning: "Menggunakan / Keperluan", baseMeaning: "Guna, Pakai, Lembar", bushu: "用 (Guna)", kunyomi: "mochi.iru", onyomi: "ヨウ", category: "Pendidikan dan Evaluasi" },
  "紙": { romaji: "Shi / Kami", meaning: "Kertas / Lembaran", baseMeaning: "Kertas, Lembaran", bushu: "糸 (Benang)", kunyomi: "kami", onyomi: "シ", category: "Pendidikan dan Evaluasi" },
  "返": { romaji: "Hen / Kae", meaning: "Mengembalikan / Balasan", baseMeaning: "Kembali, Membalas", bushu: "辶 (Jalan)", kunyomi: "kae.su", onyomi: "ヘン", category: "Komunikasi dan Diskusi" },
  "弁": { romaji: "Ben", meaning: "Penjelasan / Bicara", baseMeaning: "Pidato, Penjelasan, Dialek", bushu: "廾 (Dua Tangan)", kunyomi: "waka.metsu", onyomi: "ベン", category: "Komunikasi dan Diskusi" },
  "一": { romaji: "Ichi / Hito", meaning: "Satu", baseMeaning: "Satu, Tunggal", bushu: "一 (Satu)", kunyomi: "hito.tsu", onyomi: "イチ", category: "Akademik dan Penelitian" },
  "申": { romaji: "Shin / Mou", meaning: "Menyampaikan / Melapor", baseMeaning: "Menyampaikan, Berkata", bushu: "田 (Sawah)", kunyomi: "mou.su", onyomi: "シン", category: "Akademik dan Penelitian" },
  "自": { romaji: "Ji / Shi", meaning: "Diri / Sendiri", baseMeaning: "Sendiri, Otomatis", bushu: "自 (Diri)", kunyomi: "mizuka.ra", onyomi: "ジ, シ", category: "Teknologi dan Layanan" },
  "動": { romaji: "Dou / Ugo", meaning: "Bergerak / Otomatis", baseMeaning: "Gerak, Berfungsi", bushu: "力 (Kekuatan)", kunyomi: "ugo.ku", onyomi: "ドウ", category: "Teknologi dan Layanan" },
  "時": { romaji: "Ji / Toki", meaning: "Waktu / Saat", baseMeaning: "Waktu, Jam", bushu: "日 (Matahari)", kunyomi: "toki", onyomi: "ジ", category: "Teknologi dan Layanan" },
  "間": { romaji: "Kan / Aida", meaning: "Jarak / Waktu", baseMeaning: "Antara, Durasi", bushu: "門 (Gerbang)", kunyomi: "aida, ma", onyomi: "カン,ケン", category: "Teknologi dan Layanan" },
  "率": { romaji: "Ritsu / Sotsu", meaning: "Tingkat / Rasio", baseMeaning: "Persentase, Tingkat, Rasio", bushu: "玄 (Gelap)", kunyomi: "hiki.iru", onyomi: "リツ, ソツ", category: "Teknologi dan Layanan" },

  // Additional Kanjis for 題
  "課": { romaji: "Ka", meaning: "Pelajaran / Tugas", baseMeaning: "Pelajaran, Divisi, Tugas", bushu: "言 (Bicara)", kunyomi: "か", onyomi: "カ", category: "Pendidikan dan Evaluasi" },
  "宿": { romaji: "Shuku / Yado", meaning: "Rumah / Tempat Penginapan", baseMeaning: "Rumah, Menginap", bushu: "宀 (Atap)", kunyomi: "yado", onyomi: "シュク", category: "Pendidikan dan Evaluasi" },
  "名": { romaji: "Mei / Na", meaning: "Nama / Judul", baseMeaning: "Nama, Reputasi", bushu: "口 (Mulut)", kunyomi: "na", onyomi: "メイ, ミョウ", category: "Judul dan Tema" },
  "表": { romaji: "Hyou / Omote", meaning: "Bagian Depan / Tampil", baseMeaning: "Depan, Permukaan, Judul", bushu: "衣 (Baju)", kunyomi: "omote, arawa.su", onyomi: "ヒョウ", category: "Judul dan Tema" },
  "主": { romaji: "Shu / Nushi", meaning: "Utama / Pemilik", baseMeaning: "Utama, Pokok", bushu: "丶 (Titik)", kunyomi: "nushi, omo", onyomi: "シュ", category: "Judul dan Tema" },
  "研": { romaji: "Ken / Togi", meaning: "Meneliti / Mengasah", baseMeaning: "Mengasah, Meneliti", bushu: "石 (Batu)", kunyomi: "to.gu", onyomi: "ケン", category: "Akademik dan Penelitian" },
  "究": { romaji: "Kyuu / Kiwa", meaning: "Mendalam / Meneliti", baseMeaning: "Meneliti hingga akhir", bushu: "穴 (Lubang)", kunyomi: "kiwa.meru", onyomi: "キュウ", category: "Akademik dan Penelitian" },
  "出": { romaji: "Shutsu / De", meaning: "Mengeluarkan / Keluar", baseMeaning: "Keluar, Mengeluarkan", bushu: "凵 (Wadah)", kunyomi: "de.ru, da.su", onyomi: "シュツ", category: "Akademik dan Penelitian" },
  "話": { romaji: "Wa / Hanashi", meaning: "Berbicara / Pembicaraan", baseMeaning: "Bicara, Cerita", bushu: "言 (Bicara)", kunyomi: "hana.su, hanashi", onyomi: "ワ", category: "Diskusi dan Pemikiran" },
  "事": { romaji: "Ji / Koto", meaning: "Peristiwa / Hal", baseMeaning: "Hal, Peristiwa, Urusan", bushu: "亅 (Kait)", kunyomi: "koto", onyomi: "ジ, ズ", category: "Diskusi dan Pemikiran" },
  "意": { romaji: "I", meaning: "Pikiran / Maksud", baseMeaning: "Pikiran, Maksud, Kesadaran", bushu: "心 (Hati)", kunyomi: "i", onyomi: "イ", category: "Diskusi dan Pemikiran" },
  "識": { romaji: "Shiki", meaning: "Kesadaran / Pengetahuan", baseMeaning: "Tahu, Sadar, Ilmu", bushu: "言 (Bicara)", kunyomi: "shi.ru", onyomi: "シキ", category: "Diskusi dan Pemikiran" },
  "材": { romaji: "Zai", meaning: "Bahan / Material", baseMeaning: "Bahan, Bakat", bushu: "木 (Pohon)", kunyomi: "zai", onyomi: "ザイ", category: "Media dan Publikasi" },
  "字": { romaji: "Ji / Aza", meaning: "Huruf / Tulisan", baseMeaning: "Huruf, Karakter", bushu: "子 (Anak)", kunyomi: "aza", onyomi: "ジ", category: "Media dan Publikasi" },
  "演": { romaji: "En", meaning: "Presentasi / Pertunjukan", baseMeaning: "Tampil, Pidato, Pertunjukan", bushu: "水 (Air)", kunyomi: "en", onyomi: "エン", category: "Media dan Publikasi" },

  // Additional Kanjis for 験
  "験": { romaji: "Ken", meaning: "Pengalaman / Verifikasi", baseMeaning: "Pengalaman, Membuktikan, Verifikasi", bushu: "馬 (Kuda)", kunyomi: "tameshi", onyomi: "ケン", category: "Kanji Utama" },
  "受": { romaji: "Ju / U", meaning: "Menerima / Mengikuti", baseMeaning: "Menerima, Mengikuti", bushu: "又 (Lagi)", kunyomi: "u.keru", onyomi: "ジュ", category: "Pengujian" },
  "資": { romaji: "Shi", meaning: "Modal / Kualifikasi", baseMeaning: "Modal, Sumber Daya, Kualifikasi", bushu: "貝 (Kerang)", kunyomi: "shi", onyomi: "シ", category: "Pengujian" },
  "格": { romaji: "Kaku", meaning: "Kualifikasi / Status", baseMeaning: "Status, Kualifikasi, Standar", bushu: "木 (Pohon)", kunyomi: "kaku", onyomi: "カク", category: "Pengujian" },
  "経": { romaji: "Kei / Tsuta", meaning: "Melewati / Pengalaman", baseMeaning: "Melewati, Pengalaman", bushu: "糸 (Benang)", kunyomi: "he.ru", onyomi: "ケイ", category: "Pengalaman" },
  "体": { romaji: "Tai / Karada", meaning: "Badan / Tubuh", baseMeaning: "Tubuh, Badan, Bentuk", bushu: "人 (Manusia)", kunyomi: "karada", onyomi: "タイ", category: "Pengalaman" },
  "者": { romaji: "Sha / Mono", meaning: "Orang / Seseorang", baseMeaning: "Orang, Seseorang", bushu: "老 (Tua)", kunyomi: "mono", onyomi: "シャ", category: "Pengalaman" },
  "実": { romaji: "Jitsu / Mi", meaning: "Nyata / Kebenaran", baseMeaning: "Kenyataan, Percobaan", bushu: "宀 (Atap)", kunyomi: "mi, mino.ru", onyomi: "ジツ", category: "Penelitian" },
  "室": { romaji: "Shitsu / Muro", meaning: "Ruangan / Kamar", baseMeaning: "Ruangan, Kamar", bushu: "宀 (Atap)", kunyomi: "muro", onyomi: "シツ", category: "Penelitian" },
  "被": { romaji: "Hi / Kou", meaning: "Dikenai / Objek", baseMeaning: "Menerima, Dikenai", bushu: "衣 (Baju)", kunyomi: "ko.muru", onyomi: "ヒ", category: "Penelitian" },
  "生": { romaji: "Sei / Sei", meaning: "Siswa / Hidup", baseMeaning: "Siswa, Pelajar, Hidup", bushu: "生 (Hidup)", kunyomi: "i.kiru, uma.reru", onyomi: "セイ, ジョウ", category: "Sertifikasi" },
  "定": { romaji: "Tei / Sada", meaning: "Menetapkan / Standar", baseMeaning: "Tetap, Menetapkan", bushu: "宀 (Atap)", kunyomi: "sada.meru", onyomi: "テイ, ジョウ", category: "Sertifikasi" },
  "番": { romaji: "Ban", meaning: "Nomor / Urutan", baseMeaning: "Nomor, Giliran", bushu: "田 (Sawah)", kunyomi: "tsugai", onyomi: "バン", category: "Sertifikasi" },

  // Additional Kanjis for 試
  "試": { romaji: "Shi", meaning: "Menguji / Mencoba", baseMeaning: "Menguji, Mencoba, Percobaan", bushu: "言 (Bicara)", kunyomi: "kokoro.miru, tame.su", onyomi: "シ", category: "Kanji Utama" },
  "入": { romaji: "Nyuu / I", meaning: "Masuk / Memasukkan", baseMeaning: "Masuk, Memasukkan", bushu: "入 (Masuk)", kunyomi: "hai.ru, i.reru", onyomi: "ニュウ", category: "Aktivitas Pengujian" },
  "着": { romaji: "Chaku / Ki", meaning: "Memakai / Tiba", baseMeaning: "Memakai, Tiba, Berada", bushu: "目 (Mata)", kunyomi: "ki.ru, tsu.ku", onyomi: "チャク", category: "Penggunaan" },
  "乗": { romaji: "Jou / No", meaning: "Menaiki / Naik", baseMeaning: "Naik, Menaiki kendaraan", bushu: "丿 (Garis)", kunyomi: "no.ru, no.seru", onyomi: "ジョウ", category: "Penggunaan" },
  "食": { romaji: "Shoku / Tabe", meaning: "Makan / Makanan", baseMeaning: "Makan, Makanan", bushu: "食 (Makan)", kunyomi: "tabe.ru, ku.u", onyomi: "ショク", category: "Konsumsi" },
  "飲": { romaji: "In / No", meaning: "Minum / Minuman", baseMeaning: "Minum, Minuman", bushu: "食 (Makan)", kunyomi: "tabe.ru", onyomi: "イン", category: "Konsumsi" },
  "薬": { romaji: "Yaku / Kusuri", meaning: "Obat / Zat Kimia", baseMeaning: "Obat, Bahan Kimia", bushu: "艹 (Rumput)", kunyomi: "kusuri", onyomi: "ヤク", category: "Konsumsi" },
  "作": { romaji: "Saku / Tsuku", meaning: "Membuat / Karya", baseMeaning: "Membuat, Karya", bushu: "人 (Manusia)", kunyomi: "tsuku.ru", onyomi: "サク, サ", category: "Produksi dan Pengembangan" },
  "品": { romaji: "Hin / Shina", meaning: "Produk / Barang", baseMeaning: "Barang, Produk, Kualitas", bushu: "口 (Mulut)", kunyomi: "shina", onyomi: "ヒン", category: "Produksi dan Pengembangan" },
  "製": { romaji: "Sei", meaning: "Memproduksi / Buatan", baseMeaning: "Membuat, Manufaktur", bushu: "衣 (Baju)", kunyomi: "sei", onyomi: "セイ", category: "Produksi dan Pengembangan" },
  "合": { romaji: "Gou / Ai", meaning: "Cocok / Bertanding", baseMeaning: "Cocok, Bergabung, Uji", bushu: "口 (Mulut)", kunyomi: "a.u, a.waseru", onyomi: "ゴウ, ガッ", category: "Kompetisi dan Media" },
  "技": { romaji: "Gi / Waza", meaning: "Keterampilan / Teknik", baseMeaning: "Teknik, Keterampilan", bushu: "手 (Tangan)", kunyomi: "waza", onyomi: "ギ", category: "Kompetisi dan Media" },
  "聴": { romaji: "Chou / Kiku", meaning: "Mendengar / Uji Dengar", baseMeaning: "Mendengar, Menyimak", bushu: "耳 (Telinga)", kunyomi: "ki.ku", onyomi: "チョウ", category: "Kompetisi dan Media" },
  "写": { romaji: "Sha / Utsu", meaning: "Menayangkan / Menyalin", baseMeaning: "Menyalin, Menayangkan", bushu: "冖 (Mahkota)", kunyomi: "utsu.su", onyomi: "シャ", category: "Kompetisi dan Media" },
  "読": { romaji: "Doku / Yo", meaning: "Membaca / Pratinjau", baseMeaning: "Membaca", bushu: "言 (Bicara)", kunyomi: "yo.mu", onyomi: "ドク, トク", category: "Kompetisi dan Media" },
};

// Static crossLinkTriples extracted from frontend
const crossLinkTriples = [
  // For 点
  ["起点", "berlawanan dengan", "終点"],
  ["採点", "menghasilkan", "点数"],
  ["観点", "mirip makna", "視点"],
  ["問題点", "memerlukan", "点検"],
  ["重点", "lebih spesifik", "要点"],

  // For 答
  ["回答", "mirip makna", "解答"],
  ["解答", "ditulis pada", "解答用紙"],
  ["応答", "memiliki jenis", "自動応答"],
  ["応答", "diukur dengan", "応答時間"],
  ["応答", "diukur dengan", "応答率"],
  ["返答", "berupa", "口答"],
  ["問答", "metode khusus", "一問一答"],

  // For 問
  ["質問", "mirip makna", "問い合わせ"],
  ["問題", "berkaitan", "問題点"],
  ["問題", "berisi", "問題集"],
  ["設問", "bagian dari", "問一"],
  ["問診", "metode serupa", "尋問"],
  ["社会問題", "jenis serupa", "環境問題"],
  ["問い合わせ", "bentuk verba", "問う"],

  // For 題
  ["課題", "mirip makna", "宿題"],
  ["題名", "mirip makna", "表題"],
  ["主題", "mirip makna", "演題"],
  ["問題", "memicu", "問題意识"],
  ["問題", "menghasilkan", "出題"],
  ["課題", "bentuk khusus", "研究課題"],
  ["論題", "mirip makna", "話題"],
  ["問題", "mencakup", "時事問題"],

  // For 験
  ["試験", "diikuti via", "受験"],
  ["試験", "metode", "実験"],
  ["実験", "pengujian medis", "治験"],
  ["経験", "mirip makna", "体験"],

  // For 試
  ["試験", "jenis", "入試"],
  ["試験", "metode", "試問"],
  ["試着", "mirip makna", "試用"],
  ["試用", "aplikasi", "試乗"],
  ["試食", "pasangan", "試飲"],
  ["試作", "hasil", "試作品"],
  ["試作", "tahapan", "試製"],
  ["試合", "jenis", "試技"],
  ["試聴", "media", "試写"],
  ["試写", "media", "試読"],
];

async function migrateStaticDataToDb() {
  console.log("🚀 Starting Static Data Migration to Database...");

  // 1. Get or create default Module
  let defaultModule = await prisma.module.findFirst();
  if (!defaultModule) {
    defaultModule = await prisma.module.create({
      data: {
        title: "Modul Kanji Utama",
        tujuanPembelajaran: "Memahami struktur dan relasi semantik Kanji",
      },
    });
  }

  // 2. Extract all single constituent kanji characters from JUKUGO_RESEARCH_DETAILS & CONSTITUENT_KANJI_DATA
  const allSingleKanjiChars = new Set<string>();

  // From CONSTITUENT_KANJI_DATA keys
  Object.keys(CONSTITUENT_KANJI_DATA).forEach((char) => {
    if (char.length === 1) allSingleKanjiChars.add(char);
  });

  // From JUKUGO_RESEARCH_DETAILS charRoles
  Object.values(JUKUGO_RESEARCH_DETAILS).forEach((item) => {
    Object.keys(item.charRoles).forEach((char) => {
      if (char.length === 1) allSingleKanjiChars.add(char);
    });
  });

  // From Jukugo words themselves (break down into single kanji characters!)
  Object.keys(JUKUGO_RESEARCH_DETAILS).forEach((word) => {
    for (const char of word) {
      if (/[\u4e00-\u9faf]/.test(char)) { // Japanese Kanji regex check
        allSingleKanjiChars.add(char);
      }
    }
  });

  console.log(`📌 Found ${allSingleKanjiChars.size} unique single Kanji characters to verify/insert in 'Kanji' table.`);

  // Insert or update Kanji table with complete columns
  const kanjiMap = new Map<string, number>();
  const mainLearningKanjis = ["試", "験", "問", "題", "答", "点"];

  for (const char of allSingleKanjiChars) {
    const meta = CONSTITUENT_KANJI_DATA[char] || {};
    const existing = await prisma.kanji.findUnique({ where: { character: char } });

    if (existing) {
      kanjiMap.set(char, existing.id);
      // Ensure moduleId is set correctly for main kanji vs constituent kanji
      const targetModuleId = mainLearningKanjis.includes(char) ? defaultModule.id : null;
      if (existing.moduleId !== targetModuleId) {
        await prisma.kanji.update({
          where: { id: existing.id },
          data: { moduleId: targetModuleId },
        });
      }
    } else {
      const created = await prisma.kanji.create({
        data: {
          character: char,
          romaji: meta.romaji || char,
          meaning: meta.meaning || meta.baseMeaning || char,
          bushuu: meta.bushu || "部首",
          onyomi: meta.onyomi || "-",
          kunyomi: meta.kunyomi || "-",
          baseMeaning: meta.baseMeaning || meta.meaning || char,
          isJukugo: false,
          border: "border-slate-300",
          moduleId: mainLearningKanjis.includes(char) ? defaultModule.id : null,
        },
      });
      kanjiMap.set(char, created.id);
      console.log(`✅ Created Kanji: ${char} (ID: ${created.id})`);
    }
  }

  // 3. Migrate MasterCategory & KategoriKanji & Jukugo
  console.log("\n📌 Migrating Jukugo, MasterCategory, and KategoriKanji...");

  for (const [word, details] of Object.entries(JUKUGO_RESEARCH_DETAILS)) {
    // Determine primary parent Kanji for this Jukugo (first constituent character that exists in DB)
    let parentKanjiId: number | undefined;
    for (const char of word) {
      if (kanjiMap.has(char)) {
        parentKanjiId = kanjiMap.get(char);
        break;
      }
    }

    if (!parentKanjiId) {
      const rootKanji = await prisma.kanji.findFirst();
      parentKanjiId = rootKanji?.id || 1;
    }

    // Ensure MasterCategory exists
    const categoryName = details.category || "Kombinasi Utama";
    let masterCat = await prisma.masterCategory.findUnique({ where: { name: categoryName } });
    if (!masterCat) {
      masterCat = await prisma.masterCategory.create({
        data: {
          name: categoryName,
          description: `Kategori semantik ${categoryName}`,
        },
      });
      console.log(`✅ Created MasterCategory: ${categoryName}`);
    }

    // Ensure Jukugo exists
    let jukugoObj = await prisma.jukugo.findFirst({ where: { word } });
    if (!jukugoObj) {
      jukugoObj = await prisma.jukugo.create({
        data: {
          kanjiId: parentKanjiId,
          word: word,
          reading: word,
          meaning: details.explanation,
        },
      });
      console.log(`✅ Created Jukugo: ${word}`);
    }

    // Ensure KategoriKanji link exists
    const existingKatLink = await prisma.kategoriKanji.findFirst({
      where: { categoryId: masterCat.id, jokugoId: jukugoObj.id },
    });
    if (!existingKatLink) {
      await prisma.kategoriKanji.create({
        data: {
          categoryId: masterCat.id,
          jokugoId: jukugoObj.id,
        },
      });
    }

    // 4. Migrate SemanticRelation
    const chars = Array.from(word);
    const char1 = chars[0] || word;
    const char2 = chars[1] || "";
    const role1 = details.charRoles[char1] || (CONSTITUENT_KANJI_DATA[char1]?.meaning || "Peran 1");
    const role2 = details.charRoles[char2] || (CONSTITUENT_KANJI_DATA[char2]?.meaning || "Peran 2");

    const matchedJukugo = await prisma.jukugo.findFirst({
      where: { kanjiId: parentKanjiId, word: word }
    });

    const existingSemantic = await prisma.semanticRelation.findFirst({
      where: { kanjiId: parentKanjiId, jukugoId: matchedJukugo?.id || null },
    });

    if (!existingSemantic) {
      const createdSem = await prisma.semanticRelation.create({
        data: {
          kanjiId: parentKanjiId,
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
      console.log(`✅ Created SemanticRelation for: ${word}`);
    }
  }

  // 5. Migrate KanjiGraphEdge (crossLinkTriples)
  console.log("\n📌 Migrating KanjiGraphEdge cross-links...");
  let createdEdgeCount = 0;

  for (const triple of crossLinkTriples) {
    const [srcWord, predicate, tgtWord] = triple;

    // Find parent kanjis for srcWord and tgtWord
    const allRootKanjis = await prisma.kanji.findMany();
    for (const rootK of allRootKanjis) {
      const edgeId = `cross-${rootK.id}-${srcWord}-${tgtWord}`;
      const existingEdge = await prisma.kanjiGraphEdge.findUnique({ where: { id: edgeId } });

      if (!existingEdge) {
        await prisma.kanjiGraphEdge.create({
          data: {
            id: edgeId,
            kanjiId: rootK.id,
            source: srcWord,
            target: tgtWord,
            predicate: predicate,
          },
        });
        createdEdgeCount++;
      }
    }
  }

  console.log(`✅ Created ${createdEdgeCount} KanjiGraphEdge cross-link entries.`);
  console.log("\n🎉 Static Data Migration Completed Successfully!");
}

migrateStaticDataToDb()
  .catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
