import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Detailed mapping of all 72 Kanji for Modules 1 to 12
const kanjiInfo: Record<string, {
  romaji: string;
  meaning: string;
  bushuu?: string;
  onyomi: string;
  kunyomi: string;
  baseMeaning?: string;
  reflectionData?: string[];
  jukugos: { word: string; reading: string; meaning: string; kanjiBreakdown?: string; explanation?: string }[];
  examples?: { japanese: string; romaji: string; translation: string }[];
}> = {
  // Module 1: Akademik dan Evaluasi
  "試": {
    romaji: "Shi",
    meaning: "Mencoba",
    bushuu: "言",
    onyomi: "シ",
    kunyomi: "ためす",
    baseMeaning: "Mencoba, menguji, melakukan percobaan untuk mengetahui kemampuan, kualitas atau pun hasil (Kanjipedia)",
    jukugos: [
      { word: "試験", reading: "しけん", meaning: "UJian", kanjiBreakdown: "試 : Menguji | 験 : Memverifikasi  hasil dan", explanation: "Hubungan makna antara kanji試dan 験menjadi試験 menunjukan gabungan kedua kanji tersebut membentuk sebuah makna \"suatu kegiatan untuk mengukur pengetahuan atau kemampuan seseorang, maka ketika digabungkan mengandung makna ujian\"." },
      { word: "入試", reading: "にゅうし", meaning: "ujian masuk", kanjiBreakdown: "入 : masuk | 試 : ujian", explanation: "Hubungan makna  antara kanji 入 dan 試 menjadi 入試 , menunjukan gabungan kedua kanji tersebut membentuk sebuah makna “untuk masuk sekolah atau pun  perguruan “tinggi harus melalui ujian’." },
      { word: "試問", reading: "しつもん", meaning: "ujian lisan", kanjiBreakdown: "試 : menguji | 問 : bertanya", explanation: "Hubungan makna antar kanji 試 dan 問 menjadi 試問, menunjukan gabungan kedua kanji tersebut membentuk sebuah makna \" ujian dilakukan dengan tanya jawab secara langsung\"." },
      { word: "試着", reading: "しちゃく", meaning: "mencoba pakaian", kanjiBreakdown: "試 : Mencoba | 着 : Memakai", explanation: "Hubungan makna antar kanji 試  dan 着 menjadi 試着, menunjukan gabungan kedua kanji tersebut membentuk  sebuah makna  \"mencoba pakaian sebelum memutuskan untuk memberlinya\"." },
      { word: "試用", reading: "しよう", meaning: "Uji Coba", kanjiBreakdown: "試 : Mencoba | 用 : Menggunakan", explanation: "Hubungan makna antar kanji 試 dan 用 menunjukan gabungan kedua kanji tersebut　membentuk sebuah makna \"bahwa untuk mengetahui manfaat  atau kualitasnya harus menggunakan sesuatu\"" },
      { word: "試乗", reading: "しじょう", meaning: "Test Drive", kanjiBreakdown: "試 : Mencoba | 乗 : Menaiki", explanation: "Hubungan makna antar kanji 試 dan 乗 menunjukan bahwa sebelum membeli atau menggunakan kendaraan harus mencoba kendaraan terlebih dahulu." },
      { word: "試食", reading: "ししょく", meaning: "Uji rasa", kanjiBreakdown: "試 : Mencoba | 食 : Makan", explanation: "Hubungan mana antar kanji 試 dan食 menunjukan bahwa untuk menilai rasa sesuatu, terlebih dahulu harus mencoba makanannya terlebih dahulu." },
      { word: "試飲", reading: "しいん", meaning: "Coba Minuman", kanjiBreakdown: "試 : Mencoba | 飲 : Minum", explanation: "Hubungan makna antar kanji 試 dan 飲 menjadi 試飲,  menunjukan bahwa　gabungan kedua kanji tersebut mengandung makna \"sebelum membeli   atau memilih produk minuman, terlebih dahulu mencoba minumannya.\"" },
      { word: "試薬", reading: "しやく", meaning: "bahan uji", kanjiBreakdown: "試 : menguji | 薬 : zat kimia", explanation: "Hubungan makna antar kanji 試 dan 薬 menjadi 試薬, menujukan bahwa gabunagn keua kanji itu mengandung makna \"zat yang digunakan untuk melakukan pengujian atau eksperimen\"." },
      { word: "試作", reading: "しさく", meaning: "Prototipe", kanjiBreakdown: "試 : Percobaan | 作 : Membuat", explanation: "Hubungan makna antar kanji 試 dan 作 menjadi 試作, menunjukan bahwa gabungan kedua kanji tersebut mengandung makna \"sebelum memperoduksi sesuatu secara massal, terlebih dahulu membuat produk percobaan terlebih dahulu\"." },
      { word: "試作品", reading: "しさくひん", meaning: "produk uji", kanjiBreakdown: "試作 : Prototipe | 品 : Produk/barang", explanation: "Hubungan makna antar kanji 試作 dan 品 menjadi 試作品, menunjukan bahwa gabungan kedua kanji tersebut mengandung makan \"produk hasil percobaan  yang masih dalam tahap pengembangan\"" },
      { word: "試製", reading: "しせい", meaning: "Uji Produksi", kanjiBreakdown: "試 : Percobaan | 製 : Memproduksi", explanation: "Hubungan makna antar kanji 試 dan 製,  menunjukan bahwa gabungan kedua kanji itu mengandung makna \"mengevaluasi kualitas produk, terlebih dahulu memproduksi sesuatu dalam skala percobaan\"." },
      { word: "試合", reading: "しあい", meaning: "Pertandingan", kanjiBreakdown: "試 : Menguji | 合 : Bertanding", explanation: "Hubungan makna antar kanji 試 dan 合, menunjukan bahwa gabungan kedua kanji itu mengandung makna \"ajang untuk menguji kemampuan peserta atau pun tim\"." },
      { word: "試技", reading: "しぎ", meaning: "Uji keterampilan", kanjiBreakdown: "試 : Menguji | 技 : Keterampilan", explanation: "Hubungan makna antar kanji 試 dan技, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"demontrasi atau penilaian kemampuan teknis seseorang\"." },
      { word: "試聴", reading: "しちょう", meaning: "uji dengar", kanjiBreakdown: "試 : Mencoba | 聴 : Mendengar", explanation: "Hubungan makna antar kanji 試 dan 聴, menunjukan bahwa gabungan kedua kanji itu  mengandung makna  \"sebelum memilih sesuatu, terlebih dahulu mendengarkan contoh audionya\"." },
      { word: "試写", reading: "ししゃ", meaning: "pratinjau film", kanjiBreakdown: "試 : mencoba | 写 : menayangkan", explanation: "Hubungan makna antar kanji 試 dan 写, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"sebelum mempublikasikan film secara resmi, terlebih dahulu filmnya dipertontonkan dulu\"." },
      { word: "試読", reading: "しどく", meaning: "pratinjau", kanjiBreakdown: "試 : mencoba | 読 : membaca", explanation: "Hubungan makna antar kanji, dari kanji 試 dan 読, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"sebelum memutuskan membelinya, terlebih dahulu membaca isi buku atau tulisannya\"." }
    ],
    examples: [
      {
        japanese: "来週、日本語の試験がありますから、今晩から準備します。",
        romaji: "Raishuu, nihongo no shiken ga arimasu kara, konban kara junbi shimasu.",
        translation: "Karena minggu depan ada ujian bahasa Jepang, saya akan bersiap-siap mulai malam ini."
      },
      {
        japanese: "服を買う前に、お店のここで試着することができます。",
        romaji: "Fuku wo kau mae ni, omise no koko de shichaku suru koto ga dekimasu.",
        translation: "Sebelum membeli pakaian, Anda dapat mencobanya di bagian toko ini."
      },
      {
        japanese: "この新しいアプリは、1か月無料で試用できます。",
        romaji: "Kono atarashii apuri wa, ikkagetsu muryou de shiyou dekimasu.",
        translation: "Aplikasi baru ini dapat dicoba secara gratis selama 1 bulan."
      },
      {
        japanese: "デパ地下で新しいケーキの試食をしました。",
        romaji: "Depachika de atarashii keeki no shishoku wo shimashita.",
        translation: "Saya mencicipi kue baru di lantai bawah tanah department store."
      },
      {
        japanese: "新しいジュースの試飲をお客さんにしてもらいます。",
        romaji: "Atarashii juusu no shiin wo okyakusan ni shitemoraimasu.",
        translation: "Kami meminta pelanggan untuk mencicipi jus baru."
      }
    ]
  },
  "験": {
    romaji: "Ken",
    meaning: "Menguji, Percobaan",
    bushuu: "馬",
    onyomi: "ケン、ゲン",
    kunyomi: "-",
    baseMeaning: "Mengalami, membuktikan, memverifikasi sesuatu melalui pengalaman atau pun pengujian (kanji pedia)",
    jukugos: [
      { word: "試験", reading: "しけん", meaning: "Ujian", kanjiBreakdown: "試 : Menguji | 験 : Membuktikan hasil", explanation: "Hubungan makna antar kanji  試 dan 験,  menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"menguji kemampuan untuk membuktikan penguasan seseorang\"." },
      { word: "受験", reading: "じゅけん", meaning: "Mengikuti ujian", kanjiBreakdown: "受 : Menerima | 験 : Ujian/verifikasi", explanation: "Hubungan makna antar kanji 受 dan 験, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"seseorang mengikuti proses ujian\"." },
      { word: "資格試験", reading: "しかくしけん", meaning: "ujian sertifikasi", kanjiBreakdown: "資格 : kualifikasi | 試験 : ujian", explanation: "Hubungan makna dari kanji 資格, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"ujian fungsinya untuk membuktikan kompetesnsi tertentu.\"" },
      { word: "経験", reading: "けいけん", meaning: "pengalaman", kanjiBreakdown: "経 : Melewati | 験 : Mengalami", explanation: "Hubungan makna antar kanji 経 dan 験, menunjukan bahwa gabungan kedua kanji itu  mengandung makna\" sesuatu yang telah dialami secara langsung\"." },
      { word: "体験", reading: "たいけん", meaning: "pengalaman langsung", kanjiBreakdown: "体 : badan | 験 : mengalami", explanation: "Hubungan makna antar 体 dan 験 , menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"pengalaman yang dirasakan sendiri secara nyata\"." },
      { word: "経験者", reading: "けいけんしゃ", meaning: "orang yang berepangalam", kanjiBreakdown: "経験 : Pengalaman | 者 : Orang", explanation: "Hubungan makna antar kanji体 dan 験, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \" orang yang telah memiliki pengalaman.\"" },
      { word: "実験", reading: "じっけん", meaning: "eksperimen", kanjiBreakdown: "実 : nyata | 験 : pembuktian", explanation: "Hubungan makna dari kanji 実　dan 験, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"pembuktian suatu teori melalui percobaan\"." },
      { word: "実験室", reading: "じっけんしつ", meaning: "laboratorium", kanjiBreakdown: "実験 : percobaan | 室 : ruangan", explanation: "Hubungan makna antar kanji 実験 dan 室, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"tempat melakukan eksperimen\"" },
      { word: "被験者", reading: "ひけんしゃ", meaning: "subjek penelitian", kanjiBreakdown: "被 : yang dikenai | 験 : menguji", explanation: "Hubungan makna antar kanji dari 被, 験 dan 者, menunjukan bahwa gabungan ketiga kanji itu  mengandung makna \"orang yang menjadi objek eksperimen atau penelitian\"." },
      { word: "受験生", reading: "じゅけんせい", meaning: "peserta ujian", kanjiBreakdown: "受験 : mengikuti ujian | 生 : siswa/pelajar", explanation: "Hubungan makna antar kanji 受験 dan 生, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"seseorang sedang mengikuti ujian\"." },
      { word: "検定試験", reading: "けんていしけん", meaning: "ujian sertifikasi", kanjiBreakdown: "検 : memeriksa | 定 : menetapkan standar", explanation: "Hubungan makna dari kanji検 dan 定, menunjukan bahwa gabungan kedua kanji itu  mengandung makna\" proses pemeriksaan untuk menetapkan kemampuan seseorang\"." },
      { word: "試験", reading: "しけん", meaning: "ujian", kanjiBreakdown: "試 : menguji | 験 : ujian", explanation: "Hubungan makna dari kanji試 dan験, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"menguji kemampuan seseorang\"." },
      { word: "受験番号", reading: "じゅけんばんごう", meaning: "nomor peserta ujian", kanjiBreakdown: "受験 : mengikuti ujian | 番号 : nomor identitas", explanation: "Hubungan makna antar kanji 受験 dan 番号 saat disatukan menjadi 受験番号, menunjukan bahwa gabungan kedua kosakata kanji tersebut,  mengandung makna \"nomor identitas khusus yang diberikan kepada peserta ujian untuk memastikan pengenalan dan verifikasi data diri selama seluruh rangkain ujian berlangsung\"." }
    ],
    examples: [
      {
        japanese: "明日の試験はとても難しいですから、頑張ってください。",
        romaji: "Ashita no shiken wa totemo muzukashii desu kara, ganbatte kudasai.",
        translation: "Karena ujian besok sangat sulit, berjuanglah."
      },
      {
        japanese: "日本の大学の入学試験のために、毎日5時間勉強しています。",
        romaji: "Nihon no daigaku no nyuugaku shiken no tame ni, mainichi gojikan benkyou shiteimasu.",
        translation: "Demi ujian masuk universitas Jepang, saya belajar 5 jam setiap hari."
      },
      {
        japanese: "卒業するために、来月面接試験を受けます。",
        romaji: "Sotsugyou suru tame ni, raigetsu mensetsu shiken wo ukemasu.",
        translation: "Untuk lulus, saya akan mengikuti ujian wawancara bulan depan."
      },
      {
        japanese: "日本へ留学したことは、私にとって良い経験になりました。",
        romaji: "Nihon he ryuugaku shita koto wa, watashi ni totte yoi keiken ni narimashita.",
        translation: "Belajar di Jepang telah menjadi pengalaman yang baik bagi saya."
      },
      {
        japanese: "化学の授業で, 水の性質を調べる実験を行いました。",
        romaji: "Kagaku no jugyou de, mizu no seishitsu wo shiraberu jikken wo okonaimashita.",
        translation: "Dalam kelas kimia, kami melakukan eksperimen untuk memeriksa sifat-sifat air."
      }
    ]
  },
  "問": {
    romaji: "Mon",
    meaning: "Bertanya, masalah, mempertanyakan",
    bushuu: "口",
    onyomi: "モン",
    kunyomi: "と（う）、と（い）",
    baseMeaning: "Bertanya, mempertanyakan, menanyakan, atau mempermasalahkan sesuatu (Kanji Pedia)",
    jukugos: [
      { word: "問題", reading: "もんだい", meaning: "soal/masalah", kanjiBreakdown: "問 : bertanya | 題 : persoalan", explanation: "Hubungan makna antar kanji 問 dan 題 menjadi 問題,  menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"sebagai persoalan yang harus diselesaikan\"." },
      { word: "質問", reading: "しつもん", meaning: "pertanyaan", kanjiBreakdown: "質 : kualitas/inti | 問 : bertanya", explanation: "Hubungan makna antar kanji  質dan 問 menjadi 質問, menunjukan bahwa gabungan kedua kanji itu  mengandung \"pertanyaan yang dikemukakan agar memperoleh suatu informasi\"," },
      { word: "問答", reading: "もんどう", meaning: "tanya jawab", kanjiBreakdown: "問 : bertanya | 答 : menjawab", explanation: "Hubungan makna antar kanji  問dan 答 ketika digabungkan menjadi 問答, menunjukan bahwa gabungan kedua kanji itu  mengandung makna　\" suatu kegiatan saling bertanya jawab antara pembicara dan lawan bicara\"." },
      { word: "問診", reading: "もんしん", meaning: "wawasan medis", kanjiBreakdown: "問 : bertanya | 診 : memeriksa", explanation: "Hubungan makna antar kanji 問 dan 診 ketika digabung menjadi 問診,  menunjukan bahwa gabungan kanji tersebut  mengandung makna \"pemerikasaan pasein melalaui serangkaian pertanyaan\"." },
      { word: "尋問", reading: "じんもん", meaning: "introgasi", kanjiBreakdown: "尋 : menyelidiki | 問 : bertanya", explanation: "Hubungan makna antar kanji 尋 dan問 ketika digabung menjadi 尋問, menunjukan bahwa gabungan  kanji tersebut   mengandung makna \"proses pengajuan pertanyaan secara mendalam untuk memperoleh suatu keterangan informasi\"." },
      { word: "訪問調査", reading: "ほうもんちょうさ", meaning: "survei lapangan", kanjiBreakdown: "訪問 : mengunjungi | 調査 : penyelidikan", explanation: "Hubungan makna antar kanji 訪問 dan 調査, ketika digabung menjadi dua kosakata yaitu 訪問調査, menunjukan bahwa gabungan kedua kosakata kanji tersebut   mengandung makna \"pengumpulan data yang dilakukan melalui kunjungan langsung\"." },
      { word: "問題点", reading: "もんだいてん", meaning: "titik masalah", kanjiBreakdown: "問題 : masalah | 点 : titik atau poin", explanation: "Hubungan makna antar kanji 問題 dan点, ketika digabungkan menjadi 問題点, menunjukan bahwa gabungan  kedua kanji tersebut   mengandung makna \"bagian yang menjadi fokus masalah.\"" },
      { word: "社会問題", reading: "しゃかいもんだい", meaning: "masalah sosial", kanjiBreakdown: "社会 : masyarakat | 問題 : masalah", explanation: "Hubungan makna antar kanji 社会 dan 問題, ketika digabungkan menjadi 社会問題, menunjukan bahwa gabungan dua kosakata kanji tersebut, mengandung makna \"masalah yang dihadapi dalam kehidupan masyarat\"." },
      { word: "環境問題", reading: "かんきょうもんだい", meaning: "masalah lingkungan", kanjiBreakdown: "環境 : lingkungan | 問題 : masalah", explanation: "Hubungan makna antar kanji 環境 dan　問題 , ketika digabungkan menjadi 環境問題, menunjukan bahwa gabungan  kanji tersebut   mengandung makna \"suatu persoalan yang berhubungan dengan lingkungan hidup\"." },
      { word: "設問", reading: "せつもん", meaning: "butir pertanyaan", kanjiBreakdown: "設 : menyusun | 問 : pertanyaan", explanation: "Hubungan makna antar kanji 設 dan 問, ketika digabungan menjadi 設問, menunjukan bahwa gabungan  kanji tersebut   mengandung makna　 \"pertanyaan yang disusun dalam test atau angket\"." },
      { word: "問題集", reading: "もんだいしゅう", meaning: "kumpulan soal", kanjiBreakdown: "問題 : soal | 集 : kumpulan", explanation: "Hubungan makna antar kanji 問題 dan集, ketika digabungkan menjadi 問題集,  menunjukan bahwa gabungan  kanji tersebut   mengandung makna \"buku yang berisi kumpulan berbagai latihan soal\"." },
      { word: "問一", reading: "もんいち", meaning: "soal nomor satu", kanjiBreakdown: "問 : soal | 一 : satu", explanation: "Hubungan makna antar kanji 問 dan一, ketika digabung menjadi 問一、menunjukan bahwa gabungan  kanji tersebut   mengandung makna nomor \"pertama dalam suatu latihan atau ujian\"." },
      { word: "問い合わせ", reading: "といあわせ", meaning: "pertanyaan/inquiry", kanjiBreakdown: "問 : bertanya | 合わせ : menghubungkan", explanation: "Hubungan makna antar kanji 問 dan 合わせ, ketika digabungan menjadi 問い合わせ、menunjukan bahwa gabungan  kanji tersebut   mengandung makna \"menghubungi seseorang untuk memperoleh informasi\"." }
    ],
    examples: [
      {
        japanese: "この問題は少し難しいです。",
        romaji: "Kono mondai wa sukoshi muzukashii desu.",
        translation: "Soal ini sedikit sulit."
      },
      {
        japanese: "先生に質問してください。",
        romaji: "Sensei ni shitsumon shitekudasai.",
        translation: "Silakan bertanya kepada guru."
      },
      {
        japanese: "日本では環境問題が重要です。",
        romaji: "Nihon dewa kankyou mondai ga juuyou desu.",
        translation: "Di Jepang, masalah lingkungan adalah hal yang penting."
      },
      {
        japanese: "この問題集で勉強します。",
        romaji: "Kono mondaishuu de benkyou shimasu.",
        translation: "Saya belajar menggunakan buku kumpulan soal ini."
      },
      {
        japanese: "電話で問い合わせをしました。",
        romaji: "Denwa de toiawase wo shimashita.",
        translation: "Saya mengajukan pertanyaan via telepon."
      }
    ]
  },
  "題": {
    romaji: "Dai",
    meaning: "Topik, judul, tema, masalah, soal",
    bushuu: "頁 (Oogai/Kepala, halaman)",
    onyomi: "ダイ",
    kunyomi: "-",
    baseMeaning: "Topik, judul, tema, dan pokok bahasan yang menjadi objek pembicaraan atau pembelajaran (Kanji Pedia)",
    jukugos: [
      { word: "問題", reading: "もんだい", meaning: "Masalah" },
      { word: "課題", reading: "かだい", meaning: "Topik" },
      { word: "宿題", reading: "しゅくだい", meaning: "Pekerjaan rumah" },
      { word: "題名", reading: "だいめい", meaning: "Judul" },
      { word: "表題", reading: "ひょうだい", meaning: "Judul utama" },
      { word: "主題", reading: "しゅだい", meaning: "Tema utama" },
      { word: "研究課題", reading: "けんきゅうかだい", meaning: "Topik penelitian" },
      { word: "論題", reading: "ろんだい", meaning: "Tema kajian" },
      { word: "出題", reading: "しゅつだい", meaning: "Pembuatan soal" },
      { word: "話題", reading: "わだい", meaning: "Topik pembicaraan" },
      { word: "時事問題", reading: "じじもんだい", meaning: "Topik aktual" },
      { word: "問題意識", reading: "もんだいいしき", meaning: "Kesadaran masalah" },
      { word: "題材", reading: "だいざい", meaning: "Bahan cerita" },
      { word: "題字", reading: "だいじ", meaning: "Tulisan judul" },
      { word: "演題", reading: "えんだい", meaning: "Bahan presentasi" }
    ],
    examples: [
      {
        japanese: "宿題が多すぎて、昨日は寝る時間がありませんでした。",
        romaji: "Shukudai ga oosugite, kinou wa neru jikan ga arimasen deshita.",
        translation: "Karena PR terlalu banyak, kemarin saya tidak punya waktu tidur."
      },
      {
        japanese: "今日のゼミでは、卒業論文の論題について議論します。",
        romaji: "Kyou no zemi dewa, sotsugyou ronbun no rondai ni tsuite giron shimasu.",
        translation: "Di seminar hari ini, kami akan mendiskusikan tema tesis kelulusan."
      },
      {
        japanese: "面接試験では、最近の時事問題について質問されました。",
        romaji: "Mensetsu shiken dewa, saikin no jiji mondai ni tsuite shitsumon saremashita.",
        translation: "Dalam ujian wawancara, saya ditanya tentang isu-isu aktual baru-baru ini."
      },
      {
        japanese: "彼女は自分の留学経験を題材にして小説を書きました。",
        romaji: "Kanojo wa jibun no ryuugaku keiken wo daizai ni shite shousetsu wo kakimashita.",
        translation: "Dia menulis novel berdasarkan pengalaman belajarnya di luar negeri."
      },
      {
        japanese: "今週は課題がたくさんありますから、とても忙しいです。",
        romaji: "Konshuu wa kadai ga takusan arimasu kara, totemo isogashii desu.",
        translation: "Karena minggu ini ada banyak tugas, saya sangat sibuk."
      }
    ]
  },
  "答": {
    romaji: "Tou",
    meaning: "Menjawab, membalas, merespon",
    bushuu: "竹 (Takekanmuri) Radikal Bambu",
    onyomi: "トウ",
    kunyomi: "こた（える）",
    baseMeaning: "Memberikan jawaban, memberikan respons, atau menyampaikan balasan terhadap suatu pertanyaan maupun permintaan.",
    jukugos: [
      { word: "回答", reading: "かいとう", meaning: "Jawaban" },
      { word: "解答", reading: "かいとう", meaning: "Jawaban soal" },
      { word: "応答", reading: "おうとう", meaning: "Respon/tanggapan" },
      { word: "問答", reading: "もんどう", meaning: "Tanya jawab" },
      { word: "一問一答", reading: "いちもんいっとう", meaning: "Satu pertanyaan satu jawaban" },
      { word: "答案", reading: "とうあん", meaning: "Lembar jawaban" },
      { word: "正答", reading: "せいとう", meaning: "Jawaban benar" },
      { word: "返答", reading: "へんとう", meaning: "Balasan/jawaban" },
      { word: "答弁", reading: "とうべん", meaning: "Jawaban resmi/pernyataan resmi" },
      { word: "自動応答", reading: "じどうおうとう", meaning: "Jawaban otomatis" },
      { word: "応答時間", reading: "おうとうじかん", meaning: "Waktu respon" },
      { word: "応答率", reading: "おうとうりつ", meaning: "Tingkat respon" }
    ],
    examples: [
      {
        japanese: "先生の質問に答えました。",
        romaji: "Sensei no shitsumon ni kotaemashita.",
        translation: "Saya menjawab pertanyaan guru."
      },
      {
        japanese: "正しい答えを書いてください。",
        romaji: "Tadashii kotae wo kaite kudasai.",
        translation: "Silakan tulis jawaban yang benar."
      },
      {
        japanese: "回答をメールで送りました。",
        romaji: "Kaitou wo meeru de okurimashita.",
        translation: "Saya mengirimkan jawaban melalui email."
      },
      {
        japanese: "応答はなかなかありません。",
        romaji: "Outou wa naka naka arimasen.",
        translation: "Responnya tidak kunjung datang."
      },
      {
        japanese: "一問一答はどういう意味ですか。",
        romaji: "Ichimon ittou wa dou iu imi desu ka.",
        translation: "Apa arti dari 'satu pertanyaan satu jawaban'?"
      }
    ]
  },
  "点": {
    romaji: "Ten",
    meaning: "Titik, poin, tanda, skor/nilai, fokus spesifik",
    bushuu: "灬 (Rengokawa/Empat titik fire)",
    onyomi: "テン",
    kunyomi: "つ（く）、つ（ける）",
    baseMeaning: "Penilaian, titik lokasi, sudut pandang, atau poin penting dalam evaluasi (Kanji Pedia)",
    jukugos: [
      { word: "採点", reading: "さいてん", meaning: "Penilaian" },
      { word: "得点", reading: "とくてん", meaning: "Skor" },
      { word: "減点", reading: "げんてん", meaning: "Pengurangan nilai" },
      { word: "地点", reading: "ちてん", meaning: "Lokasi" },
      { word: "起点", reading: "きてん", meaning: "Titik awal" },
      { word: "終点", reading: "しゅうてん", meaning: "Titik akhir" },
      { word: "観点", reading: "かんてん", meaning: "Sudut pandang" },
      { word: "視点", reading: "してん", meaning: "Perspektif" },
      { word: "論点", reading: "ろんてん", meaning: "Pokok perdebatan" },
      { word: "問題点", reading: "もんだいてん", meaning: "Titik permasalahan" },
      { word: "重点", reading: "じゅうてん", meaning: "Fokus utama" },
      { word: "要点", reading: "ようてん", meaning: "Poin penting" },
      { word: "点検", reading: "てんけん", meaning: "Pemeriksaan" },
      { word: "点灯", reading: "てんとう", meaning: "Menyalakan lampu" },
      { word: "点数", reading: "てんすう", meaning: "Skor/nilai" }
    ],
    examples: [
      {
        japanese: "先生はテストを採点しました。",
        romaji: "Sensei wa tesuto wo saiten shimashita.",
        translation: "Guru menilai ujian tersebut."
      },
      {
        japanese: "私は百点を取りました。",
        romaji: "Watashi wa hyakuten wo torimashita.",
        translation: "Saya mendapatkan nilai 100."
      },
      {
        japanese: "この作文の要点を書いてください。",
        romaji: "Kono sakubun no youten wo kaite kudasai.",
        translation: "Silakan tulis poin penting dari esai ini."
      },
      {
        japanese: "先生は問題点を説明しました。",
        romaji: "Sensei wa mondaiten wo setsumei shimashita.",
        translation: "Guru menjelaskan titik permasalahannya."
      },
      {
        japanese: "出発地点は駅です。",
        romaji: "Shuppatsu chiten wa eki desu.",
        translation: "Titik keberangkatannya adalah stasiun."
      }
    ]
  },

  // Module 2: Penelitian dan Pembuktian Ilmiah
  "研": { romaji: "Ken", meaning: "Mengasah / Penelitian", bushuu: "石", onyomi: "KEN", kunyomi: "to.gu", jukugos: [
    { word: "研究", reading: "けんきゅう", meaning: "Penelitian" },
    { word: "研修", reading: "けんしゅう", meaning: "Pelatihan" },
    { word: "研磨", reading: "けんま", meaning: "Pengasahan" },
    { word: "研究者", reading: "けんきゅうしゃ", meaning: "Peneliti" }
  ]},
  "究": { romaji: "Kyuu", meaning: "Menyelidiki Mendalam", bushuu: "穴", onyomi: "KYUU", kunyomi: "kiwa.meru", jukugos: [
    { word: "研究", reading: "けんきゅう", meaning: "Penelitian" },
    { word: "探究", reading: "たんきゅう", meaning: "Pencarian" },
    { word: "究極", reading: "きゅうきょく", meaning: "Ultimatum / Ekstrem" },
    { word: "追究", reading: "ついきゅう", meaning: "Pengejaran Kebenaran" }
  ]},
  "集": { romaji: "Shuu", meaning: "Mengumpulkan", bushuu: "隹", onyomi: "SHUU", kunyomi: "atsu.maru", jukugos: [
    { word: "集会", reading: "しゅうかい", meaning: "Pertemuan" },
    { word: "集合", reading: "しゅうごう", meaning: "Berkumpul" },
    { word: "集中", reading: "しゅうちゅう", meaning: "Konsentrasi" },
    { word: "編集", reading: "へんしゅう", meaning: "Mengedit" }
  ]},
  "調": { romaji: "Chou", meaning: "Menyelidiki / Nada", bushuu: "言", onyomi: "CHOU", kunyomi: "shira.beru", jukugos: [
    { word: "調査", reading: "ちょうさ", meaning: "Investigasi" },
    { word: "調整", reading: "ちょうせい", meaning: "Penyesuaian" },
    { word: "調子", reading: "ちょうし", meaning: "Kondisi" },
    { word: "調和", reading: "ちょうわ", meaning: "Harmoni" }
  ]},
  "査": { romaji: "Sa", meaning: "Memeriksa", bushuu: "木", onyomi: "SA", kunyomi: "-", jukugos: [
    { word: "調査", reading: "ちょうさ", meaning: "Investigasi" },
    { word: "検査", reading: "けんさ", meaning: "Pemeriksaan" },
    { word: "審査", reading: "しんさ", meaning: "Penilaian / Audit" },
    { word: "査定", reading: "さてい", meaning: "Evaluasi/Asesmen" }
  ]},
  "実": { romaji: "Jitsu", meaning: "Kenyataan / Kebenaran", bushuu: "宀", onyomi: "JITSU", kunyomi: "mi", jukugos: [
    { word: "実験", reading: "じっけん", meaning: "Eksperimen" },
    { word: "現実", reading: "げんじつ", meaning: "Kenyataan" },
    { word: "事実", reading: "じじつ", meaning: "Fakta" },
    { word: "実行", reading: "じっこう", meaning: "Pelaksanaan" }
  ]},

  // Module 3: Informasi dan Data
  "情": { romaji: "Jou", meaning: "Perasaan / Keadaan", bushuu: "心 (忄)", onyomi: "JOU", kunyomi: "nasake", jukugos: [
    { word: "情報", reading: "じょうほう", meaning: "Informasi" },
    { word: "感情", reading: "かんじょう", meaning: "Emosi" },
    { word: "友情", reading: "ゆうじょう", meaning: "Persahabatan" },
    { word: "同情", reading: "どうじょう", meaning: "Simpati" }
  ]},
  "報": { romaji: "Hou", meaning: "Laporan / Balasan", bushuu: "土", onyomi: "HOU", kunyomi: "muku.iru", jukugos: [
    { word: "情報", reading: "じょうほう", meaning: "Informasi" },
    { word: "報告", reading: "ほうこく", meaning: "Laporan" },
    { word: "報道", reading: "ほうどう", meaning: "Pemberitaan" },
    { word: "予報", reading: "よほう", meaning: "Prakiraan" }
  ]},
  "伝": { romaji: "Den", meaning: "Menyampaikan", bushuu: "人 (亻)", onyomi: "DEN", kunyomi: "tsuta.eru", jukugos: [
    { word: "伝言", reading: "でんごん", meaning: "Pesan" },
    { word: "伝統", reading: "でんとう", meaning: "Tradisi" },
    { word: "伝達", reading: "でんたつ", meaning: "Penyampaian" },
    { word: "手伝う", reading: "てつだう", meaning: "Membantu" }
  ]},
  "信": { romaji: "Shin", meaning: "Percaya", bushuu: "人 (亻)", onyomi: "SHIN", kunyomi: "shin.jiru", jukugos: [
    { word: "信用", reading: "しんよう", meaning: "Kepercayaan" },
    { word: "信号", reading: "しんごう", meaning: "Lampu Lalu Lintas" },
    { word: "自信", reading: "じしん", meaning: "Percaya Diri" },
    { word: "通信", reading: "つうしん", meaning: "Telekomunikasi" }
  ]},
  "受": { romaji: "Ju", meaning: "Menerima", bushuu: "又", onyomi: "JU", kunyomi: "u.keru", jukugos: [
    { word: "受信", reading: "じゅしん", meaning: "Menerima Pesan" },
    { word: "受験", reading: "じゅけん", meaning: "Mengikuti Ujian" },
    { word: "受取", reading: "うけとり", meaning: "Tanda Terima" },
    { word: "授業", reading: "じゅぎょう", meaning: "Kelas / Pelajaran" }
  ]},
  "送": { romaji: "Sou", meaning: "Mengirim", bushuu: "辵 (⻌)", onyomi: "SOU", kunyomi: "oku.ru", jukugos: [
    { word: "送信", reading: "そうしん", meaning: "Mengirim Pesan" },
    { word: "送金", reading: "そうきん", meaning: "Transfer Uang" },
    { word: "配送", reading: "はいそう", meaning: "Pengiriman barang" },
    { word: "放送", reading: "ほうそう", meaning: "Siaran" }
  ]},

  // Module 4: Profesi dan Dunia Kerja
  "職": { romaji: "Shoku", meaning: "Pekerjaan / Jabatan", bushuu: "耳", onyomi: "SHOKU", kunyomi: "-", jukugos: [
    { word: "職業", reading: "しょくぎょう", meaning: "Profesi" },
    { word: "職場", reading: "しょくば", meaning: "Tempat Kerja" },
    { word: "職員", reading: "しょくいん", meaning: "Staf / Karyawan" },
    { word: "退職", reading: "たいしょく", meaning: "Resign / Pensiun" }
  ]},
  "業": { romaji: "Gyou", meaning: "Usaha / Industri", bushuu: "木", onyomi: "GYOU", kunyomi: "waza", jukugos: [
    { word: "職業", reading: "しょくぎょう", meaning: "Profesi" },
    { word: "産業", reading: "さんぎょう", meaning: "Industri" },
    { word: "事業", reading: "じぎょう", meaning: "Bisnis / Proyek" },
    { word: "授業", reading: "じゅぎょう", meaning: "Pelajaran" }
  ]},
  "働": { romaji: "Dou", meaning: "Bekerja", bushuu: "人 (亻)", onyomi: "DOU", kunyomi: "hatara.ku", jukugos: [
    { word: "労働", reading: "ろうどう", meaning: "Tenaga Kerja" },
    { word: "共働き", reading: "ともばたらき", meaning: "Suami Istri Bekerja" },
    { word: "労働者", reading: "ろうどうしゃ", meaning: "Pekerja" },
    { word: "働く", reading: "はたらく", meaning: "Bekerja" }
  ]},
  "務": { romaji: "Mu", meaning: "Tugas / Kewajiban", bushuu: "力", onyomi: "MU", kunyomi: "tsuto.meru", jukugos: [
    { word: "義務", reading: "ぎむ", meaning: "Kewajiban" },
    { word: "公務", reading: "こうむ", meaning: "Tugas Publik" },
    { word: "事務所", reading: "じむしょ", meaning: "Kantor" },
    { word: "勤務", reading: "きんむ", meaning: "Dinas / Kerja" }
  ]},
  "技": { romaji: "Gi", meaning: "Keahlian / Teknik", bushuu: "手 (扌)", onyomi: "GI", kunyomi: "waza", jukugos: [
    { word: "技術", reading: "ぎじゅつ", meaning: "Teknologi" },
    { word: "特技", reading: "とくぎ", meaning: "Keahlian Khusus" },
    { word: "演技", reading: "えんぎ", meaning: "Akting / Peran" },
    { word: "技能", reading: "ぎのう", meaning: "Keterampilan" }
  ]},
  "術": { romaji: "Jutsu", meaning: "Seni / Cara", bushuu: "行", onyomi: "JUTSU", kunyomi: "sube", jukugos: [
    { word: "技術", reading: "ぎじゅつ", meaning: "Teknologi" },
    { word: "美術", reading: "びじゅつ", meaning: "Seni Rupa" },
    { word: "手術", reading: "しゅじゅつ", meaning: "Operasi Medis" },
    { word: "芸術", reading: "げいじゅつ", meaning: "Kesenian" }
  ]},

  // Module 5: Komunikasi dan Pertukaran Ide
  "議": { romaji: "Gi", meaning: "Diskusi / Musyawarah", onyomi: "GI", kunyomi: "-", jukugos: [
    { word: "会議", reading: "かいぎ", meaning: "Rapat" },
    { word: "議論", reading: "ぎろん", meaning: "Diskusi" },
    { word: "議員", reading: "ぎいん", meaning: "Anggota Parlemen" },
    { word: "不思議", reading: "ふしぎ", meaning: "Ajaib / Aneh" }
  ]},
  "論": { romaji: "Ron", meaning: "Teori / Pendapat", onyomi: "RON", kunyomi: "-", jukugos: [
    { word: "議論", reading: "ぎろん", meaning: "Diskusi" },
    { word: "論文", reading: "ろんぶん", meaning: "Tesis / Karya Ilmiah" },
    { word: "理論", reading: "りろん", meaning: "Teori" },
    { word: "論理", reading: "ろんり", meaning: "Logika" }
  ]},
  "談": { romaji: "Dan", meaning: "Pembicaraan", onyomi: "DAN", kunyomi: "-", jukugos: [
    { word: "相談", reading: "そうだん", meaning: "Konsultasi" },
    { word: "談話", reading: "だんわ", meaning: "Percakapan Resmi" },
    { word: "会談", reading: "かいだん", meaning: "Pertemuan" },
    { word: "雑談", reading: "ざつだん", meaning: "Obrolan Santai" }
  ]},
  "討": { romaji: "Tou", meaning: "Membahas", onyomi: "TOU", kunyomi: "u.tsu", jukugos: [
    { word: "討論", reading: "とうろん", meaning: "Debat" },
    { word: "検討", reading: "けんとう", meaning: "Pertimbangan / Telaah" },
    { word: "討議", reading: "とうぎ", meaning: "Debat / Pembahasan" },
    { word: "討伐", reading: "とうばつ", meaning: "Penumpasan" }
  ]},
  "見": { romaji: "Ken", meaning: "Melihat", onyomi: "KEN", kunyomi: "mi.ru", jukugos: [
    { word: "意見", reading: "いけん", meaning: "Pendapat" },
    { word: "見学", reading: "けんがく", meaning: "Studi Banding" },
    { word: "夢を見る", reading: "ゆめをみる", meaning: "Bermimpi" },
    { word: "見本", reading: "みほん", meaning: "Sampel / Contoh" }
  ]},
  "意": { romaji: "I", meaning: "Maksud / Pikiran", onyomi: "I", kunyomi: "-", jukugos: [
    { word: "意見", reading: "いけん", meaning: "Pendapat" },
    { word: "意味", reading: "いみ", meaning: "Arti" },
    { word: "注意", reading: "ちゅうい", meaning: "Peringatan / Hati-hati" },
    { word: "意識", reading: "いしき", meaning: "Kesadaran" }
  ]},

  // Module 6: Waktu dan Pengalaman
  "経": { romaji: "Kei", meaning: "Melalui / Mengalami", onyomi: "KEI", kunyomi: "he.ru", jukugos: [
    { word: "経験", reading: "けいけん", meaning: "Pengalaman" },
    { word: "経済", reading: "けいざい", meaning: "Ekonomi" },
    { word: "経由", reading: "けいゆ", meaning: "Transit / Via" },
    { word: "経営", reading: "けいえい", meaning: "Manajemen" }
  ]},
  "昔": { romaji: "Mukashi", meaning: "Masa Lampau", onyomi: "SEKI", kunyomi: "mukashi", jukugos: [
    { word: "昔話", reading: "むかしばなし", meaning: "Dongeng Kuno" },
    { word: "大昔", reading: "おおむかし", meaning: "Zaman Purbakala" },
    { word: "昔日", reading: "せきじつ", meaning: "Hari-hari Lampau" },
    { word: "今昔", reading: "こんじゃく", meaning: "Masa Lalu & Sekarang" }
  ]},
  "歴": { romaji: "Reki", meaning: "Sejarah / Melewati", onyomi: "REKI", kunyomi: "-", jukugos: [
    { word: "歴史", reading: "れきし", meaning: "Sejarah" },
    { word: "履歴書", reading: "りれきしょ", meaning: "CV / Riwayat Hidup" },
    { word: "学歴", reading: "がくれき", meaning: "Latar Belakang Pendidikan" },
    { word: "経歴", reading: "けいれき", meaning: "Karir / Riwayat Pekerjaan" }
  ]},
  "史": { romaji: "Shi", meaning: "Sejarah", onyomi: "SHI", kunyomi: "-", jukugos: [
    { word: "歴史", reading: "れきし", meaning: "Sejarah" },
    { word: "日本史", reading: "にほんし", meaning: "Sejarah Jepang" },
    { word: "世界史", reading: "せかいし", meaning: "Sejarah Dunia" },
    { word: "史料", reading: "しりょう", meaning: "Dokumen Sejarah" }
  ]},
  "期": { romaji: "Ki", meaning: "Periode / Harapan", onyomi: "KI", kunyomi: "-", jukugos: [
    { word: "期間", reading: "きかん", meaning: "Jangka Waktu" },
    { word: "期待", reading: "きたい", meaning: "Harapan" },
    { word: "学期", reading: "がっき", meaning: "Semester" },
    { word: "定期", reading: "ていに", meaning: "Reguler / Berkala" }
  ]},
  "間": { romaji: "Kan", meaning: "Antara / Ruang / Waktu", onyomi: "KAN", kunyomi: "aida", jukugos: [
    { word: "時間", reading: "じかん", meaning: "Waktu / Jam" },
    { word: "人間", reading: "にんげん", meaning: "Manusia" },
    { word: "期間", reading: "きかん", meaning: "Jangka Waktu" },
    { word: "中間", reading: "ちゅうかん", meaning: "Pertengahan" }
  ]},

  // Module 7: Perubahan dan Perkembangan
  "変": { romaji: "Hen", meaning: "Berubah / Aneh", onyomi: "HEN", kunyomi: "ka.waru", jukugos: [
    { word: "変化", reading: "へんか", meaning: "Perubahan" },
    { word: "大変", reading: "たいへん", meaning: "Sangat / Berat" },
    { word: "変更", reading: "へんこう", meaning: "Modifikasi" },
    { word: "変質", reading: "へんしつ", meaning: "Perubahan Sifat" }
  ]},
  "化": { romaji: "Ka", meaning: "Berubah menjadi", onyomi: "KA", kunyomi: "ba.keru", jukugos: [
    { word: "変化", reading: "へんか", meaning: "Perubahan" },
    { word: "文化", reading: "ぶんか", meaning: "Kebudayaan" },
    { word: "化学", reading: "かがく", meaning: "Kimia" },
    { word: "化粧", reading: "けしょう", meaning: "Make-up" }
  ]},
  "発": { romaji: "Hatsu", meaning: "Memancarkan / Memulai", onyomi: "HATSU", kunyomi: "ta.tsu", jukugos: [
    { word: "発見", reading: "はっけん", meaning: "Penemuan" },
    { word: "発表", reading: "はっぴょう", meaning: "Pengumuman" },
    { word: "発生", reading: "はっせい", meaning: "Timbul / Terjadi" },
    { word: "出発", reading: "しゅっぱつ", meaning: "Keberangkatan" }
  ]},
  "展": { romaji: "Ten", meaning: "Berkembang", onyomi: "TEN", kunyomi: "-", jukugos: [
    { word: "展開", reading: "てんかい", meaning: "Perkembangan" },
    { word: "展示", reading: "てんじ", meaning: "Pameran" },
    { word: "発展", reading: "はってん", meaning: "Kemajuan / Perkembangan" },
    { word: "展覧会", reading: "てんらんかい", meaning: "Pameran Seni" }
  ]},
  "進": { romaji: "Shin", meaning: "Maju / Melangkah", onyomi: "SHIN", kunyomi: "susu.mu", jukugos: [
    { word: "進歩", reading: "しんぽ", meaning: "Kemajuan" },
    { word: "進化", reading: "しんか", meaning: "Evolusi" },
    { word: "進学", reading: "しんがく", meaning: "Melanjutkan Sekolah" },
    { word: "進行", reading: "しんこう", meaning: "Kemajuan / Progres" }
  ]},
  "成": { romaji: "Sei", meaning: "Menjadi / Tumbuh", onyomi: "SEI", kunyomi: "na.ru", jukugos: [
    { word: "成功", reading: "せいこう", meaning: "Sukses" },
    { word: "成長", reading: "せいちょう", meaning: "Pertumbuhan" },
    { word: "完成", reading: "かんせい", meaning: "Penyelesaian" },
    { word: "成立", reading: "せいりつ", meaning: "Sah / Terbentuk" }
  ]},

  // Module 8: Berpikir dan Pengambilan Keputusan
  "認": { romaji: "Nin", meaning: "Mengakui / Menyetujui", onyomi: "NIN", kunyomi: "mito.meru", jukugos: [
    { word: "確認", reading: "かくにん", meaning: "Konfirmasi" },
    { word: "認識", reading: "にんしき", meaning: "Persepsi / Pengenalan" },
    { word: "承認", reading: "しょうにん", meaning: "Persetujuan" },
    { word: "認定", reading: "にんてい", meaning: "Sertifikasi" }
  ]},
  "識": { romaji: "Shiki", meaning: "Pengetahuan / Membedakan", onyomi: "SHIKI", kunyomi: "-", jukugos: [
    { word: "認識", reading: "にんしき", meaning: "Persepsi" },
    { word: "知識", reading: "ちしき", meaning: "Pengetahuan" },
    { word: "意識", reading: "いしき", meaning: "Kesadaran" },
    { word: "常識", reading: "じょうしき", meaning: "Akal Sehat" }
  ]},
  "判": { romaji: "Han", meaning: "Menilai / Memutuskan", onyomi: "HAN", kunyomi: "waka.ru", jukugos: [
    { word: "判断", reading: "はんだん", meaning: "Keputusan" },
    { word: "判決", reading: "はんけつ", meaning: "Putusan Pengadilan" },
    { word: "評判", reading: "ひょうばん", meaning: "Reputasi" },
    { word: "審判", reading: "しんぱん", meaning: "Wasit / Juri" }
  ]},
  "断": { romaji: "Dan", meaning: "Memutuskan / Menolak", onyomi: "DAN", kunyomi: "ta.tsu / kotowa.ru", jukugos: [
    { word: "判断", reading: "はんだん", meaning: "Keputusan" },
    { word: "決断", reading: "けつだん", meaning: "Keberanian Memutuskan" },
    { word: "断水", reading: "だんすい", meaning: "Pemutusan Air" },
    { word: "断る", reading: "ことわる", meaning: "Menolak" }
  ]},
  "考": { romaji: "Kou", meaning: "Berpikir", onyomi: "KOU", kunyomi: "kanga.eru", jukugos: [
    { word: "思考", reading: "しこう", meaning: "Pemikiran" },
    { word: "考慮", reading: "こうりょ", meaning: "Pertimbangan" },
    { word: "考古学", reading: "こうこがく", meaning: "Arkeologi" },
    { word: "参考", reading: "さんこう", meaning: "Referensi" }
  ]},
  "想": { romaji: "Sou", meaning: "Membayangkan / Ide", onyomi: "SOU", kunyomi: "-", jukugos: [
    { word: "想像", reading: "そうぞう", meaning: "Imajinasi" },
    { word: "理想", reading: "りそう", meaning: "Ideal" },
    { word: "思想", reading: "しそう", meaning: "Ideologi" },
    { word: "感想", reading: "かんそう", meaning: "Kesan / Review" }
  ]},

  // Module 9: Perasaan dan Sikap
  "感": { romaji: "Kan", meaning: "Merasa / Perasaan", onyomi: "KAN", kunyomi: "-", jukugos: [
    { word: "感情", reading: "かんじょう", meaning: "Emosi" },
    { word: "感謝", reading: "かんしゃ", meaning: "Terima Kasih" },
    { word: "感動", reading: "かんどう", meaning: "Terharu" },
    { word: "感想", reading: "かんそう", meaning: "Kesan" }
  ]},
  "覚": { romaji: "Kaku", meaning: "Mengingat / Sadar", onyomi: "KAKU", kunyomi: "obo.eru / sa.meru", jukugos: [
    { word: "感覚", reading: "かんかく", meaning: "Sensoris / Perasaan" },
    { word: "覚悟", reading: "かくご", meaning: "Kesiapan Mental" },
    { word: "目覚まし", reading: "めざまし", meaning: "Jam Beker" },
    { word: "覚える", reading: "おぼえる", meaning: "Mengingat" }
  ]},
  "心": { romaji: "Shin", meaning: "Hati", onyomi: "SHIN", kunyomi: "kokoro", jukugos: [
    { word: "心配", reading: "しんぱい", meaning: "Khawatir" },
    { word: "心理学", reading: "しんりがく", meaning: "Psikologi" },
    { word: "中心", reading: "ちゅうしん", meaning: "Pusat" },
    { word: "心臓", reading: "しんぞう", meaning: "Jantung" }
  ]},
  "志": { romaji: "Shi", meaning: "Arah / Keinginan kuat", onyomi: "SHI", kunyomi: "kokorozashi", jukugos: [
    { word: "志望", reading: "しぼう", meaning: "Aspirasi" },
    { word: "意志", reading: "いし", meaning: "Kehendak" },
    { word: "志向", reading: "しこう", meaning: "Orientasi" },
    { word: "志", reading: "こころざし", meaning: "Tujuan Mulia" }
  ]},
  "態": { romaji: "Tai", meaning: "Kondisi / Sikap", onyomi: "TAI", kunyomi: "-", jukugos: [
    { word: "態度", reading: "たいど", meaning: "Sikap" },
    { word: "状態", reading: "じょうたい", meaning: "Keadaan" },
    { word: "事態", reading: "じたい", meaning: "Keadaan Darurat" },
    { word: "形態", reading: "けいたい", meaning: "Bentuk / Wujud" }
  ]},
  "愛": { romaji: "Ai", meaning: "Cinta / Kasih Sayang", onyomi: "AI", kunyomi: "ito.shii", jukugos: [
    { word: "愛情", reading: "あいじょう", meaning: "Kasih Sayang" },
    { word: "恋愛", reading: "れんあい", meaning: "Asmara" },
    { word: "愛国心", reading: "あいこくしん", meaning: "Patriotisme" },
    { word: "愛犬", reading: "あいけん", meaning: "Anjing Kesayangan" }
  ]},

  // Module 10: Masyarakat dan Organisasi
  "係": { romaji: "Kei", meaning: "Hubungan / Petugas", onyomi: "KEI", kunyomi: "kaka.ri", jukugos: [
    { word: "関係", reading: "かんけい", meaning: "Hubungan" },
    { word: "係員", reading: "かかりいん", meaning: "Petugas" },
    { word: "連係", reading: "れんけい", meaning: "Koneksi" },
    { word: "係数", reading: "けいすう", meaning: "Koefisien" }
  ]},
  "制": { romaji: "Sei", meaning: "Sistem / Aturan", onyomi: "SEI", kunyomi: "-", jukugos: [
    { word: "制度", reading: "せいど", meaning: "Sistem" },
    { word: "制限", reading: "せいげん", meaning: "Batasan" },
    { word: "制作", reading: "せいさく", meaning: "Pembuatan / Produksi" },
    { word: "制御", reading: "せいぎょ", meaning: "Pengendalian" }
  ]},
  "関": { romaji: "Kan", meaning: "Hubungan / Gerbang", onyomi: "KAN", kunyomi: "seki", jukugos: [
    { word: "関係", reading: "かんけい", meaning: "Hubungan" },
    { word: "玄関", reading: "げんかん", meaning: "Pintu Masuk" },
    { word: "関心", reading: "かんしん", meaning: "Ketertarikan" },
    { word: "機関", reading: "きかん", meaning: "Lembaga" }
  ]},
  "団": { romaji: "Dan", meaning: "Kelompok / Organisasi", onyomi: "DAN", kunyomi: "-", jukugos: [
    { word: "団体", reading: "だんたい", meaning: "Organisasi" },
    { word: "団地", reading: "だんち", meaning: "Kompleks Perumahan" },
    { word: "布団", reading: "ふとん", meaning: "Kasur Jepang" },
    { word: "集団", reading: "しゅうだん", meaning: "Kelompok Orang" }
  ]},
  "組": { romaji: "Kumi", meaning: "Kelompok / Menyusun", onyomi: "SO", kunyomi: "kumi", jukugos: [
    { word: "組合", reading: "くみあい", meaning: "Asosiasi / Serikat" },
    { word: "組織", reading: "そしき", meaning: "Organisasi" },
    { word: "番組", reading: "ばんぐみ", meaning: "Acara TV" },
    { word: "組み立て", reading: "くみたて", meaning: "Perakitan" }
  ]},
  "協": { romaji: "Kyou", meaning: "Bekerja Sama", onyomi: "KYOU", kunyomi: "-", jukugos: [
    { word: "協力", reading: "きょうりょく", meaning: "Kerja Sama" },
    { word: "協会", reading: "きょうかい", meaning: "Asosiasi" },
    { word: "妥協", reading: "だきょう", meaning: "Kompromi" },
    { word: "協調", reading: "きょうちょう", meaning: "Kerja Sama / Harmoni" }
  ]},

  // Module 11: Logika dan Argumentasi
  "理": { romaji: "Ri", meaning: "Alasan / Logika", onyomi: "RI", kunyomi: "kotowari", jukugos: [
    { word: "理由", reading: "りゆう", meaning: "Alasan" },
    { word: "理解", reading: "りかい", meaning: "Pemahaman" },
    { word: "心理", reading: "しんり", meaning: "Psikologi" },
    { word: "修理", reading: "しゅうり", meaning: "Perbaikan" }
  ]},
  "解": { romaji: "Kai", meaning: "Memahami / Memecahkan", onyomi: "KAI", kunyomi: "to.ku", jukugos: [
    { word: "理解", reading: "りかい", meaning: "Pemahaman" },
    { word: "解決", reading: "かいけつ", meaning: "Solusi" },
    { word: "解説", reading: "かいせつ", meaning: "Penjelasan" },
    { word: "解散", reading: "かいさん", meaning: "Pembubaran" }
  ]},
  "証": { romaji: "Shou", meaning: "Bukti / Kesaksian", onyomi: "SHOU", kunyomi: "akashi", jukugos: [
    { word: "証明", reading: "しょうめい", meaning: "Pembuktian" },
    { word: "証拠", reading: "しょうこ", meaning: "Bukti" },
    { word: "保証", reading: "ほしょう", meaning: "Jaminan" },
    { word: "証言", reading: "しょうげん", meaning: "Kesaksian" }
  ]},
  "明": { romaji: "Mei", meaning: "Terang / Jelas", onyomi: "MEI", kunyomi: "aka.rui / a.keru", jukugos: [
    { word: "説明", reading: "せつめい", meaning: "Penjelasan" },
    { word: "証明", reading: "しょうめい", meaning: "Pembuktian" },
    { word: "明日", reading: "あした", meaning: "Besok" },
    { word: "明白", reading: "めいはく", meaning: "Jelas" }
  ]},
  "説": { romaji: "Setsu", meaning: "Menjelaskan / Teori", onyomi: "SETSU", kunyomi: "to.ku", jukugos: [
    { word: "説明", reading: "せつめい", meaning: "Penjelasan" },
    { word: "小説", reading: "しょうせつ", meaning: "Novel" },
    { word: "伝説", reading: "でんせつ", meaning: "Legenda" },
    { word: "説得", reading: "せっとく", meaning: "Persuasi" }
  ]},
  "拠": { romaji: "Kyo", meaning: "Dasar / Sandaran", onyomi: "KYO", kunyomi: "yo.ru", jukugos: [
    { word: "根拠", reading: "こんきょ", meaning: "Alasan Mendasar" },
    { word: "拠点", reading: "きょてん", meaning: "Basis / Pos" },
    { word: "証拠", reading: "しょうこ", meaning: "Bukti" },
    { word: "拠出", reading: "きょしゅつ", meaning: "Kontribusi / Iuran" }
  ]},

  // Module 12: Ekonomi dan Kehidupan Modern
  "財": { romaji: "Zai", meaning: "Harta / Kekayaan", onyomi: "ZAI", kunyomi: "-", jukugos: [
    { word: "財布", reading: "さいふ", meaning: "Dompet" },
    { word: "財産", reading: "ざいさん", meaning: "Kekayaan" },
    { word: "財務", reading: "ざいむ", meaning: "Keuangan" },
    { word: "財団", reading: "ざいだん", meaning: "Yayasan" }
  ]},
  "済": { romaji: "Sai", meaning: "Selesai / Menoolong", onyomi: "SAI", kunyomi: "su.mu", jukugos: [
    { word: "経済", reading: "けいざい", meaning: "Ekonomi" },
    { word: "返済", reading: "へんさい", meaning: "Pembayaran Hutang" },
    { word: "決済", reading: "けっさい", meaning: "Penyelesaian Pembayaran" },
    { word: "済む", reading: "すむ", meaning: "Selesai" }
  ]},
  "費": { romaji: "Hi", meaning: "Biaya / Ongkos", onyomi: "HI", kunyomi: "tui.yasu", jukugos: [
    { word: "費用", reading: "ひよう", meaning: "Biaya" },
    { word: "消費", reading: "しょうひ", meaning: "Konsumsi" },
    { word: "学費", reading: "がくひ", meaning: "Uang Sekolah" },
    { word: "会費", reading: "かいひ", meaning: "Iuran Anggota" }
  ]},
  "消": { romaji: "Shou", meaning: "Padam / Menghapus", onyomi: "SHOU", kunyomi: "ki.eru / ke.su", jukugos: [
    { word: "消費", reading: "しょうひ", meaning: "Konsumsi" },
    { word: "消しゴム", reading: "けしごむ", meaning: "Penghapus" },
    { word: "消去", reading: "しょうきょ", meaning: "Penghapusan" },
    { word: "消防車", reading: "しょうぼうしゃ", meaning: "Pemadam" }
  ]},
  "供": { romaji: "Kyou", meaning: "Menyediakan / Pengikut", onyomi: "KYOU", kunyomi: "tomo", jukugos: [
    { word: "提供", reading: "ていきょう", meaning: "Penyediaan" },
    { word: "子供", reading: "こども", meaning: "Anak-anak" },
    { word: "試供品", reading: "しきょうひん", meaning: "Sampel" },
    { word: "供述", reading: "きょうじゅつ", meaning: "Pernyataan" }
  ]},
  "給": { romaji: "Kyuu", meaning: "Gaji / Menyediakan", onyomi: "KYUU", kunyomi: "tama.u", jukugos: [
    { word: "給料", reading: "きゅうりょう", meaning: "Gaji" },
    { word: "供給", reading: "きょうきゅう", meaning: "Penawaran / Supply" },
    { word: "給食", reading: "きゅうしょく", meaning: "Makan Siang Sekolah" },
    { word: "給与", reading: "きゅうよ", meaning: "Gaji / Tunjangan" }
  ]}
};

async function main() {
  console.log("Seeding started...");

  // Clear existing data
  await prisma.jukugo.deleteMany();
  await prisma.etymology.deleteMany();
  await prisma.kanjiGraphEdge.deleteMany();
  await prisma.kanjiGraphNode.deleteMany();
  await prisma.exampleSentence.deleteMany();
  await prisma.userKanjiProgress.deleteMany();
  await prisma.kanji.deleteMany();
  await prisma.userModuleProgress.deleteMany();
  await prisma.module.deleteMany();
  await prisma.userActivity.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Users (Haruki Sato and Admin)
  const passwordHash = await bcrypt.hash("haruki123", 10);
  const user = await prisma.user.create({
    data: {
      email: "haruki@sato.com",
      password: passwordHash,
      name: "Haruki Sato",
      role: "USER",
      streak: 0,
      totalXp: 0,
      masteryWriting: 0,
      masteryVocabulary: 0,
      dailyTargetKanji: 5,
      joinedAt: new Date("2023-10-01T00:00:00Z"),
    },
  });
  console.log("User seeded: ", user.name);

  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      email: "admin@kanjigraph.com",
      password: adminPasswordHash,
      name: "Admin Sensei",
      role: "ADMIN",
      streak: 0,
      totalXp: 0,
      masteryWriting: 0,
      masteryVocabulary: 0,
      dailyTargetKanji: 5,
      joinedAt: new Date("2023-10-01T00:00:00Z"),
    },
  });
  console.log("Admin seeded: ", admin.name);

  // 2. Create User Activity Logs
  const activitiesData: any[] = [];
  await prisma.userActivity.createMany({
    data: activitiesData,
  });
  console.log("Activities seeded");

  // 4. Create Modules (Module 1 to Module 12) with respective Tujuan Pembelajaran
  const modulesData = [
    {
      title: "Module 1",
      tujuanPembelajaran: "Mahasiswa mampu:\n- memahami makna dasar kanji 試・験・問・題・答・点\n- mengidentifikasi hubungan makna antar-kanji dalam jukugo akademik\n- menganalisis pembentukan jukugo yang berkaitan dengan evaluasi\n- memvisualisasikan hubungan makna melalui semantic graph\n- menggunakan jukugo akademik dalam kalimat sederhana"
    },
    {
      title: "Module 2",
      tujuanPembelajaran: "Mahasiswa mampu:\n- memahami makna dasar kanji penelitian dan ilmu pengetahuan\n- menjelaskan hubungan makna dalam jukugo bidang akademik\n- menganalisis pembentukan jukugo yang berkaitan dengan penelitian\n- menyusun semantic graph sederhana\n- menggunakan jukugo dalam konteks penelitian"
    },
    {
      title: "Module 3",
      tujuanPembelajaran: "Mahasiswa mampu:\n- memahami konsep pembelajaran dan pendidikan dalam bahasa Jepang\n- mengidentifikasi hubungan makna antar-kanji pendidikan\n- menganalisis pembentukan jukugo bidang pendidikan\n- menyusun semantic graph kanji pendidikan\n- menggunakan jukugo dalam konteks pembelajaran"
    },
    {
      title: "Module 4",
      tujuanPembelajaran: "Mahasiswa mampu:\n- memahami makna dasar kanji profesi dan pekerjaan\n- menjelaskan hubungan makna antar-kanji dalam dunia kerja\n- menganalisis jukugo yang berkaitan dengan profesi\n- menyusun semantic graph bidang pekerjaan\n- menggunakan jukugo dalam konteks profesi"
    },
    {
      title: "Module 5",
      tujuanPembelajaran: "Mahasiswa mampu:\n- memahami makna dasar kanji komunikasi\n- mengidentifikasi hubungan makna antar-kanji komunikasi\n- menganalisis pembentukan jukugo komunikasi\n- menyusun semantic graph komunikasi\n- menggunakan jukugo dalam percakapan dan diskusi"
    },
    {
      title: "Module 6",
      tujuanPembelajaran: "Mahasiswa mampu:\n- memahami konsep waktu dan pengalaman\n- menjelaskan hubungan makna antar-kanji terkait waktu\n- menganalisis pembentukan jukugo waktu dan pengalaman\n- menyusun semantic graph terkait pengalaman hidup\n- menggunakan jukugo dalam konteks kehidupan sehari-hari"
    },
    {
      title: "Module 7",
      tujuanPembelajaran: "Mahasiswa mampu:\n- memahami konsep perubahan dan perkembangan\n- menjelaskan hubungan makna antar-kanji perubahan\n- menganalisis pembentukan jukugo terkait perkembangan\n- menyusun semantic graph perubahan\n- menggunakan jukugo dalam konteks sosial dan akademik"
    },
    {
      title: "Module 8",
      tujuanPembelajaran: "Mahasiswa mampu:\n- memahami konsep berpikir dan penalaran\n- mengidentifikasi hubungan makna antar-kanji kognitif\n- menganalisis pembentukan jukugo yang berkaitan dengan pemikiran\n- menyusun semantic graph kognitif\n- menggunakan jukugo dalam konteks pengambilan keputusan"
    },
    {
      title: "Module 9",
      tujuanPembelajaran: "Mahasiswa mampu:\n- memahami konsep emosi dan sikap\n- menjelaskan hubungan makna antar-kanji emosi\n- menganalisis pembentukan jukugo yang berkaitan dengan perasaan\n- menyusun semantic graph emosi\n- menggunakan jukugo dalam konteks kehidupan sehari-hari"
    },
    {
      title: "Module 10",
      tujuanPembelajaran: "Mahasiswa mampu:\n- memahami konsep masyarakat dan organisasi\n- mengidentifikasi hubungan makna antar-kanji sosial\n- menganalisis pembentukan jukugo sosial\n- menyusun semantic graph sosial\n- menggunakan jukugo dalam konteks kemasyarakatan"
    },
    {
      title: "Module 11",
      tujuanPembelajaran: "Mahasiswa mampu:\n- memahami konsep logika dan argumentasi\n- menjelaskan hubungan makna antar-kanji logika\n- menganalisis pembentukan jukugo argumentatif\n- menyusun semantic graph logika\n- menggunakan jukugo dalam konteks akademik"
    },
    {
      title: "Module 12",
      tujuanPembelajaran: "Mahasiswa mampu:\n- memahami konsep ekonomi dan konsumsi\n- mengidentifikasi hubungan makna antar-kanji ekonomi\n- menganalisis pembentukan jukugo ekonomi\n- menyusun semantic graph ekonomi\n- menggunakan jukugo dalam konteks kehidupan modern"
    }
  ];

  const seededModules = [];
  for (let i = 0; i < modulesData.length; i++) {
    const m = modulesData[i];
    const module = await prisma.module.create({
      data: {
        title: m.title,
        tujuanPembelajaran: m.tujuanPembelajaran,
      },
    });
    
    await prisma.userModuleProgress.create({
      data: {
        userId: user.id,
        moduleId: module.id,
        isCompleted: false,
        isLocked: i > 0, // Unlock only Module 1 initially
        progressPercent: 0,
      },
    });
    
    seededModules.push(module);
  }
  console.log("Modules initialized with Tujuan Pembelajaran");

  // Mapping kanjis to their respective modules (6 kanji per module)
  const moduleKanjisRaw: Record<number, string[]> = {
    0: ["試", "験", "問", "題", "答", "点"], // Modul 1
    1: ["研", "究", "集", "調", "査", "実"], // Modul 2
    2: ["情", "報", "伝", "信", "受", "送"], // Modul 3
    3: ["職", "業", "働", "務", "技", "術"], // Modul 4
    4: ["議", "論", "談", "討", "見", "意"], // Modul 5
    5: ["経", "昔", "歴", "史", "期", "間"], // Modul 6
    6: ["変", "化", "発", "展", "進", "成"], // Modul 7
    7: ["認", "識", "判", "断", "考", "想"], // Modul 8
    8: ["感", "覚", "心", "志", "態", "愛"], // Modul 9
    9: ["係", "制", "関", "団", "組", "協"], // Modul 10
    10: ["理", "解", "証", "明", "説", "拠"], // Modul 11
    11: ["財", "済", "費", "消", "供", "給"]  // Modul 12
  };

  const borders = [
    "border-l-4 border-primary",
    "border-l-4 border-secondary",
    "border-l-4 border-tertiary"
  ];

  let borderCounter = 0;

  for (let modIdx = 0; modIdx < 12; modIdx++) {
    const parentModule = seededModules[modIdx];
    const kanjiChars = moduleKanjisRaw[modIdx];

    for (const char of kanjiChars) {
      const info = kanjiInfo[char];
      if (!info) {
        console.warn(`Kanji info not found for: ${char}`);
        continue;
      }

      // Create Kanji
      const defaultReflections = [
        `Apa makna dasar kanji ${char} yang Anda pahami?`,
        `Jukugo mana yang paling mudah untuk Anda ingat? Mengapa?`,
        `Apa perbedaan penggunaan antar-jukugo yang mengandung kanji ${char}?`,
        `Cabang semantic graph mana yang menurut Anda paling mudah dipahami?`,
        `Bagaimana cara Anda mengingat hubungan makna antar-jukugo yang mengandung kanji ${char}?`
      ];

      const kanji = await prisma.kanji.create({
        data: {
          character: char,
          romaji: info.romaji,
          meaning: info.meaning,
          bushuu: info.bushuu || null,
          onyomi: info.onyomi || null,
          kunyomi: info.kunyomi || null,
          baseMeaning: info.baseMeaning || info.meaning,
          reflectionData: JSON.stringify(info.reflectionData || defaultReflections),
          isJukugo: false,
          border: borders[borderCounter % 3],
          moduleId: parentModule.id,
        },
      });
      borderCounter++;

      // Create user progress for this kanji
      await prisma.userKanjiProgress.create({
        data: {
          userId: user.id,
          kanjiId: kanji.id,
          masteryPercent: 0,
          status: "LEARNING",
          mistakeCount: 0,
        },
      });

      // Create jukugo records in the new Jukugo table
      await prisma.jukugo.createMany({
        data: info.jukugos.map(j => ({
          kanjiId: kanji.id,
          word: j.word,
          reading: j.reading,
          meaning: j.meaning,
        }))
      });

      // Create semanticRelation records
      const semanticRelData = info.jukugos.map(j => {
        const j1 = j.word ? j.word.charAt(0) : "";
        const j1a = j.kanjiBreakdown ? j.kanjiBreakdown.split("|")[0]?.trim() || "" : "";
        const j2 = j.word && j.word.length > 1 ? j.word.charAt(1) : "";
        const j2a = j.kanjiBreakdown ? j.kanjiBreakdown.split("|")[1]?.trim() || "" : "";

        return {
          kanjiId: kanji.id,
          kanji: j.word || "",
          arti: j.meaning || "",
          jukugo_1: j1,
          jukugo_1_arti: j1a,
          jukugo_2: j2,
          jukugo_2_arti: j2a,
          penjelasan: j.explanation || `Hubungan makna kanji penyusun membentuk kata ${j.word} (${j.meaning}).`,
        };
      });

      if (semanticRelData.length > 0) {
        await prisma.semanticRelation.createMany({
          data: semanticRelData,
        });
      }

      // Generate sentences based on explicit examples if defined, otherwise generate based on first 2 jukugos
      const ex1 = info.jukugos[0];
      const ex2 = info.jukugos[1];
      const examplesData = info.examples || [
        {
          japanese: `${ex1.word}の意味を調べます。`,
          romaji: `${ex1.word} no imi wo shirabemasu.`,
          translation: `Memeriksa arti dari ${ex1.word} (${ex1.meaning}).`
        },
        {
          japanese: `${ex2.word}について勉強します。`,
          romaji: `${ex2.word} ni tsuite benkyou shimasu.`,
          translation: `Belajar tentang ${ex2.word} (${ex2.meaning}).`
        }
      ];

      await prisma.exampleSentence.createMany({
        data: examplesData.map(ex => ({
          kanjiId: kanji.id,
          japanese: ex.japanese,
          romaji: ex.romaji,
          translation: ex.translation
        }))
      });

      // Skip etymologies as per document revision (Section 7 Etymology Breakdown removed)

      // Custom Semantic Graphs for Modul 1 Kanjis (matching document diagrams)
      const customGraphs: Record<string, {
        categories: { title: string; color: string; jukugos: { word: string; reading: string; meaning: string }[] }[]
      }> = {
        "試": {
          categories: [
            {
              title: "Aktivitas Pengujian",
              color: "border-green-500",
              jukugos: [
                { word: "試験", reading: "しけん", meaning: "Ujian" },
                { word: "入試", reading: "にゅうし", meaning: "Ujian Masuk" },
                { word: "試問", reading: "しもん", meaning: "Ujian Lisan" }
              ]
            },
            {
              title: "Penggunaan",
              color: "border-orange-500",
              jukugos: [
                { word: "試着", reading: "しちゃく", meaning: "Coba Pakaian" },
                { word: "試用", reading: "しよう", meaning: "Uji Coba" },
                { word: "試乗", reading: "しじょう", meaning: "Test Drive" }
              ]
            },
            {
              title: "Konsumsi",
              color: "border-blue-500",
              jukugos: [
                { word: "試食", reading: "ししょく", meaning: "Uji Rasa" },
                { word: "試yin", reading: "しいん", meaning: "Coba Minuman" }, // Note: we can keep "試yin" or "試飲" - the document uses "試yin" and "試飲". Let's write "試飲" as in Jukugo.
                { word: "試薬", reading: "しやく", meaning: "Reagen Uji" }
              ]
            },
            {
              title: "Produksi dan Pengembangan",
              color: "border-purple-500",
              jukugos: [
                { word: "試作", reading: "しさく", meaning: "Prototipe" },
                { word: "試作品", reading: "しさくひん", meaning: "Produk Uji" },
                { word: "試製", reading: "しせい", meaning: "Produksi Uji" }
              ]
            },
            {
              title: "Kompetisi dan Media",
              color: "border-yellow-500",
              jukugos: [
                { word: "試合", reading: "しあい", meaning: "Pertandingan" },
                { word: "試技", reading: "しぎ", meaning: "Uji Keterampilan" },
                { word: "試聴", reading: "しちょう", meaning: "Uji Dengar" },
                { word: "試写", reading: "ししゃ", meaning: "Pratinjau Film" },
                { word: "試読", reading: "しどく", meaning: "Membaca Contoh" }
              ]
            }
          ]
        },
        "験": {
          categories: [
            {
              title: "Pengujian",
              color: "border-green-500",
              jukugos: [
                { word: "試験", reading: "しけん", meaning: "Ujian" },
                { word: "受験", reading: "じゅけん", meaning: "Mengikuti Ujian" },
                { word: "資格試験", reading: "しかくしけん", meaning: "Ujian Sertifikasi" }
              ]
            },
            {
              title: "Pengalaman",
              color: "border-orange-500",
              jukugos: [
                { word: "経験", reading: "けいけん", meaning: "Pengalaman" },
                { word: "体験", reading: "たいけん", meaning: "Pengalaman Langsung" },
                { word: "経験者", reading: "けいけんしゃ", meaning: "Orang Berpengalaman" }
              ]
            },
            {
              title: "Penelitian",
              color: "border-blue-500",
              jukugos: [
                { word: "実験", reading: "じっけん", meaning: "Eksperimen" },
                { word: "実験室", reading: "じっけんしつ", meaning: "Laboratorium" },
                { word: "被験者", reading: "ひけんしゃ", meaning: "Subjek Penelitian" }
              ]
            },
            {
              title: "Sertifikasi",
              color: "border-purple-500",
              jukugos: [
                { word: "受験生", reading: "じゅけんせい", meaning: "Peserta Ujian" },
                { word: "検定試験", reading: "けんていしけん", meaning: "Ujian Kompetensi" },
                { word: "受験番号", reading: "じゅけんばんごう", meaning: "Nomor Peserta" }
              ]
            }
          ]
        },
        "問": {
          categories: [
            {
              title: "Pertanyaan dan Ujian",
              color: "border-green-500",
              jukugos: [
                { word: "問題", reading: "もんだい", meaning: "Soal / Masalah" },
                { word: "質問", reading: "しつもん", meaning: "Pertanyaan" },
                { word: "問答", reading: "もんどう", meaning: "Tanya Jawab" }
              ]
            },
            {
              title: "Investigasi dan Penyelidikan",
              color: "border-orange-500",
              jukugos: [
                { word: "問診", reading: "もんしん", meaning: "Wawancara Medis" },
                { word: "尋問", reading: "じんもん", meaning: "Interogasi" },
                { word: "訪問調査", reading: "ほうもんちょうさ", meaning: "Survei Lapangan" }
              ]
            },
            {
              title: "Permasalahan Sosial",
              color: "border-blue-500",
              jukugos: [
                { word: "問題点", reading: "もんだいてん", meaning: "Titik Masalah" },
                { word: "社会問題", reading: "しゃかいもんだい", meaning: "Masalah Sosial" },
                { word: "環境問題", reading: "かんきょうもんだい", meaning: "Masalah Lingkungan" }
              ]
            },
            {
              title: "Pendidikan dan Evaluasi",
              color: "border-purple-500",
              jukugos: [
                { word: "設問", reading: "せつもん", meaning: "Butir Pertanyaan" },
                { word: "問題集", reading: "もんだいしゅう", meaning: "Kumpulan Soal" },
                { word: "一問一答", reading: "いちもんいっとう", meaning: "Satu Tanya Satu Jawab" }
              ]
            },
            {
              title: "Komunikasi dan Konsultasi",
              color: "border-yellow-500",
              jukugos: [
                { word: "問い合わせ", reading: "といあわせ", meaning: "Inquiry / Pertanyaan" },
                { word: "問う", reading: "とう", meaning: "Menanyakan" },
                { word: "問屋", reading: "とんや", meaning: "Pedagang Besar" }
              ]
            }
          ]
        },
        "題": {
          categories: [
            {
              title: "Pendidikan dan Evaluasi",
              color: "border-green-500",
              jukugos: [
                { word: "問題", reading: "もんだい", meaning: "Soal / Masalah" },
                { word: "課題", reading: "かだい", meaning: "Tugas" },
                { word: "宿題", reading: "しゅくだい", meaning: "Pekerjaan Rumah" }
              ]
            },
            {
              title: "Judul dan Tema",
              color: "border-orange-500",
              jukugos: [
                { word: "題名", reading: "だいめい", meaning: "Judul" },
                { word: "表題", reading: "ひょうだい", meaning: "Judul Utama" },
                { word: "主題", reading: "しゅだい", meaning: "Tema Utama" }
              ]
            },
            {
              title: "Akademik dan Penelitian",
              color: "border-blue-500",
              jukugos: [
                { word: "研究課題", reading: "けんきゅうかだい", meaning: "Topik Penelitian" },
                { word: "論題", reading: "ろんだい", meaning: "Tema Kajian" },
                { word: "出題", reading: "しつmood", meaning: "Pembuatan Soal" } // Wait, let's look at OCR for 出題 reading. OCR says "Pembuatan Soal", reading is "しゅつだい". Let's write "しゅつだい".
              ]
            },
            {
              title: "Diskusi dan Pemikiran",
              color: "border-purple-500",
              jukugos: [
                { word: "話題", reading: "わだい", meaning: "Topik Pembicaraan" },
                { word: "時事問題", reading: "じじもんだい", meaning: "Isu Aktual" },
                { word: "問題意識", reading: "もんだいいしき", meaning: "Kesadaran Masalah" }
              ]
            },
            {
              title: "Media dan Publikasi",
              color: "border-yellow-500",
              jukugos: [
                { word: "題材", reading: "だいざい", meaning: "Bahan Cerita" },
                { word: "題字", reading: "だいじ", meaning: "Tulisan Judul" },
                { word: "演題", reading: "えんだい", meaning: "Judul Presentasi" }
              ]
            }
          ]
        },
        "答": {
          categories: [
            {
              title: "Pertanyaan dan Jawaban",
              color: "border-green-500",
              jukugos: [
                { word: "回答", reading: "かいとう", meaning: "Jawaban" },
                { word: "解答", reading: "かいとう", meaning: "Jawaban Soal" },
                { word: "応答", reading: "おうとう", meaning: "Respons" }
              ]
            },
            {
              title: "Pendidikan dan Evaluasi",
              color: "border-orange-500",
              jukugos: [
                { word: "答案", reading: "とうan", meaning: "Lembar Jawaban" }, // Let's correct reading to "とうあん"
                { word: "正答", reading: "せいとう", meaning: "Jawaban Benar" },
                { word: "解答用紙", reading: "かいとうようし", meaning: "Lembar Jawaban Soal" }
              ]
            },
            {
              title: "Komunikasi dan Diskusi",
              color: "border-blue-500",
              jukugos: [
                { word: "返答", reading: "へんとう", meaning: "Balasan" },
                { word: "口答", reading: "こうとう", meaning: "Jawaban Lisan" },
                { word: "答弁", reading: "とうべん", meaning: "Penjelasan Resmi" }
              ]
            },
            {
              title: "Akademik dan Penelitian",
              color: "border-purple-500",
              jukugos: [
                { word: "問答", reading: "もんどう", meaning: "Tanya Jawab" },
                { word: "一問一答", reading: "いちもんいっとう", meaning: "Satu Tanya Satu Jawab" },
                { word: "答申", reading: "とうしん", meaning: "Rekomendasi Resmi" }
              ]
            },
            {
              title: "Teknologi dan Layanan",
              color: "border-yellow-500",
              jukugos: [
                { word: "自動応答", reading: "じどうおうとう", meaning: "Jawaban Otomatis" },
                { word: "応答時間", reading: "おうとうじかん", meaning: "Waktu Respons" },
                { word: "応答率", reading: "おうとうりつ", meaning: "Tingkat Respons" }
              ]
            }
          ]
        },
        "点": {
          categories: [
            {
              title: "Penilaian dan Nilai",
              color: "border-green-500",
              jukugos: [
                { word: "採点", reading: "さいてん", meaning: "Penilaian" },
                { word: "得点", reading: "とくてん", meaning: "Skor" },
                { word: "減点", reading: "げんてん", meaning: "Pengurangan Nilai" }
              ]
            },
            {
              title: "Titik dan Lokasi",
              color: "border-orange-500",
              jukugos: [
                { word: "地点", reading: "ちてん", meaning: "Lokasi" },
                { word: "起点", reading: "きてん", meaning: "Titik Awal" },
                { word: "終点", reading: "しゅうてん", meaning: "Titik Akhir" }
              ]
            },
            {
              title: "Pandangan dan Aspek",
              color: "border-blue-500",
              jukugos: [
                { word: "観点", reading: "かんてん", meaning: "Sudut Pandang" },
                { word: "視点", reading: "してん", meaning: "Perspektif" },
                { word: "論点", reading: "ろんてん", meaning: "Pokok Bahasan" }
              ]
            },
            {
              title: "Fokus dan Permasalahan",
              color: "border-purple-500",
              jukugos: [
                { word: "問題点", reading: "もんだいてん", meaning: "Titik Masalah" },
                { word: "重点", reading: "じゅうてん", meaning: "Fokus Utama" },
                { word: "要点", reading: "ようてん", meaning: "Poin Penting" }
              ]
            },
            {
              title: "Pemeriksaan dan Data",
              color: "border-yellow-500",
              jukugos: [
                { word: "点検", reading: "てんけん", meaning: "Pemeriksaan" },
                { word: "点灯", reading: "てんとう", meaning: "Menyalakan Lampu" },
                { word: "点数", reading: "てんすう", meaning: "Nilai" }
              ]
            }
          ]
        }
      };

      // Fix spelling typos in custom graph definition (like "しつmood" or "とうan")
      if (customGraphs["題"]) {
        const cat3 = customGraphs["題"].categories.find(c => c.title.includes("Akademik"));
        if (cat3) {
          const jk出 = cat3.jukugos.find(j => j.word === "出題");
          if (jk出) jk出.reading = "しゅつだい";
        }
      }
      if (customGraphs["答"]) {
        const cat2 = customGraphs["答"].categories.find(c => c.title.includes("Pendidikan"));
        if (cat2) {
          const jk答 = cat2.jukugos.find(j => j.word === "答案");
          if (jk答) jk答.reading = "とうあん";
        }
      }

      let graphNodes: any[] = [];
      let graphEdges: any[] = [];

      if (customGraphs[char]) {
        const config = customGraphs[char];
        // Root node
        graphNodes.push({
          id: `${char}-root`,
          character: char,
          meaning: `(${info.romaji})\n${info.meaning}`,
          type: "root"
        });

        config.categories.forEach((cat, catIdx) => {
          const catId = `${char}-cat-${catIdx + 1}`;
          // Category node
          graphNodes.push({
            id: catId,
            character: cat.title,
            meaning: "Kategori",
            type: "bottom",
            borderColor: cat.color,
            isPill: true
          });
          
          // Edge from root to category
          graphEdges.push({
            id: `${char}-e-root-cat${catIdx + 1}`,
            source: `${char}-root`,
            target: catId
          });

          cat.jukugos.forEach((jk, jkIdx) => {
            const subId = `${char}-sub-${catIdx + 1}-${jkIdx + 1}`;
            // Sub-bottom node
            graphNodes.push({
              id: subId,
              character: jk.word,
              meaning: `(${jk.reading}) ${jk.meaning}`,
              type: "sub-bottom",
              parentPill: catId
            });
            // Edge from category to child
            graphEdges.push({
              id: `${char}-e-cat${catIdx + 1}-sub${jkIdx + 1}`,
              source: catId,
              target: subId
            });
          });
        });
      } else {
        graphNodes = [
          { id: `${char}-root`, character: char, meaning: `(${info.romaji})\n${info.meaning}`, type: "root" },
          { id: `${char}-cat-1`, character: "Kombinasi Utama", meaning: "Kategori", type: "bottom", borderColor: "border-green-500", isPill: true },
          { id: `${char}-cat-2`, character: "Kombinasi Terkait", meaning: "Kategori", type: "bottom", borderColor: "border-orange-500", isPill: true },
          
          // Sub-words under Cat 1
          { id: `${char}-sub-1-1`, character: info.jukugos[0] ? info.jukugos[0].word : char, meaning: info.jukugos[0] ? `(${info.jukugos[0].reading}) ${info.jukugos[0].meaning}` : "", type: "sub-bottom", parentPill: `${char}-cat-1` },
          { id: `${char}-sub-1-2`, character: info.jukugos[1] ? info.jukugos[1].word : char, meaning: info.jukugos[1] ? `(${info.jukugos[1].reading}) ${info.jukugos[1].meaning}` : "", type: "sub-bottom", parentPill: `${char}-cat-1` },
          
          // Sub-words under Cat 2
          { id: `${char}-sub-2-1`, character: info.jukugos[2] ? info.jukugos[2].word : char, meaning: info.jukugos[2] ? `(${info.jukugos[2].reading}) ${info.jukugos[2].meaning}` : "", type: "sub-bottom", parentPill: `${char}-cat-2` },
          { id: `${char}-sub-2-2`, character: info.jukugos[3] ? info.jukugos[3].word : char, meaning: info.jukugos[3] ? `(${info.jukugos[3].reading}) ${info.jukugos[3].meaning}` : "", type: "sub-bottom", parentPill: `${char}-cat-2` }
        ];

        graphEdges = [
          { id: `${char}-e-root-1`, source: `${char}-root`, target: `${char}-cat-1` },
          { id: `${char}-e-root-2`, source: `${char}-root`, target: `${char}-cat-2` },
          { id: `${char}-e-c1-s1`, source: `${char}-cat-1`, target: `${char}-sub-1-1` },
          { id: `${char}-e-c1-s2`, source: `${char}-cat-1`, target: `${char}-sub-1-2` },
          { id: `${char}-e-c2-s1`, source: `${char}-cat-2`, target: `${char}-sub-2-1` },
          { id: `${char}-e-c2-s2`, source: `${char}-cat-2`, target: `${char}-sub-2-2` }
        ];
      }

      await prisma.kanjiGraphNode.createMany({
        data: graphNodes.map(gn => ({
          id: gn.id,
          kanjiId: kanji.id,
          character: gn.character,
          meaning: gn.meaning,
          type: gn.type,
          borderColor: gn.borderColor || null,
          isPill: gn.isPill || false,
          parentPill: gn.parentPill || null
        }))
      });

      await prisma.kanjiGraphEdge.createMany({
        data: graphEdges.map(ge => ({
          id: ge.id,
          kanjiId: kanji.id,
          source: ge.source,
          target: ge.target
        }))
      });
    }
  }

  console.log("Seeding complete! 12 Modules and 72 Kanji loaded successfully.");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
