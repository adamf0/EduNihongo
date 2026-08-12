import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedMasterDataUserStrict() {
  console.log("🚀 Starting Master Data Sync strictly based on User specification...");

  const kanjiTargetChars = ["試", "験", "問", "題", "答", "点", "研", "究"];
  const dbKanjis = await prisma.kanji.findMany({
    where: { character: { in: kanjiTargetChars } }
  });

  const kanjiMap = new Map<string, number>();
  dbKanjis.forEach(k => kanjiMap.set(k.character, k.id));

  // Verify all target kanjis exist
  for (const char of kanjiTargetChars) {
    if (!kanjiMap.has(char)) {
      console.error(`❌ Critical error: Kanji ${char} not found in DB.`);
      return;
    }
  }

  // Define master dataset strictly from user input
  const masterDataset: Record<string, { jukugos: { word: string; reading: string; meaning: string }[]; semanticRelations: { word: string; penjelasan: string; nodes: { jokugo: string; arti: string }[] }[] }> = {
    "試": {
      jukugos: [
        { word: "試験", reading: "しけん", meaning: "Ujian" },
        { word: "入試", reading: "にゅうし", meaning: "Ujian masuk" },
        { word: "試問", reading: "しもん", meaning: "Ujian lisan" },
        { word: "試着", reading: "しちゃく", meaning: "Mencoba pakaian" },
        { word: "試用", reading: "しよう", meaning: "Uji coba penggunaan" },
        { word: "試乗", reading: "しじょう", meaning: "Uji coba kendaraan (test drive)" },
        { word: "試食", reading: "ししょく", meaning: "Mencicipi makanan" },
        { word: "試飲", reading: "しいん", meaning: "Mencicipi minuman" },
        { word: "試薬", reading: "しやく", meaning: "Bahan uji lanoratorium" },
        { word: "試作", reading: "しさく", meaning: "Pembuatan prototipe" },
        { word: "試作品", reading: "しさくひん", meaning: "Produk percobaan" },
        { word: "試製", reading: "しせい", meaning: "Produksi percobaan" },
        { word: "試合", reading: "しあい", meaning: "Pertandingan" },
        { word: "試技", reading: "しぎ", meaning: "Uji keterampilan" },
        { word: "試聴", reading: "しちょう", meaning: "Mendengarkan contoh audio" },
        { word: "試写", reading: "ししゃ", meaning: "Pemutaran perdana" },
        { word: "試読", reading: "しどく", meaning: "Membaca contoh naskah" }
      ],
      semanticRelations: [
        { word: "試験", penjelasan: "Hubungan makna antara kanji試dan 験menjadi試験 menunjukan gabungan kedua kanji tersebut membentuk sebuah makna \"suatu kegiatan untuk mengukur pengetahuan atau kemampuan seseorang, maka ketika digabungkan mengandung makna ujian\".", nodes: [{ jokugo: "試", arti: "Menguji" }, { jokugo: "験", arti: "Memverifikasi  hasil dan" }] },
        { word: "入試", penjelasan: "Hubungan makna  antara kanji 入 dan 試 menjadi 入試 , menunjukan gabungan kedua kanji tersebut membentuk sebuah makna “untuk masuk sekolah atau pun  perguruan “tinggi harus melalui ujian’.", nodes: [{ jokugo: "入", arti: "masuk" }, { jokugo: "試", arti: "ujian" }] },
        { word: "試問", penjelasan: "Hubungan makna antar kanji 試 dan 問 menjadi 試問, menunjukan gabungan kedua kanji tersebut membentuk sebuah makna \" ujian dilakukan dengan tanya jawab secara langsung\".", nodes: [{ jokugo: "試", arti: "menguji" }, { jokugo: "問", arti: "bertanya" }] },
        { word: "試着", penjelasan: "Hubungan makna antar kanji 試  dan 着 menjadi 試着, menunjukan gabungan kedua kanji tersebut membentuk  sebuah makna  \"mencoba pakaian sebelum memutuskan untuk memberlinya\".", nodes: [{ jokugo: "試", arti: "Mencoba" }, { jokugo: "着", arti: "Memakai" }] },
        { word: "試用", penjelasan: "Hubungan makna antar kanji 試 dan 用 menunjukan gabungan kedua kanji tersebut　membentuk sebuah makna \"bahwa untuk mengetahui manfaat  atau kualitasnya harus menggunakan sesuatu\"", nodes: [{ jokugo: "試", arti: "Mencoba" }, { jokugo: "用", arti: "Menggunakan" }] },
        { word: "試乗", penjelasan: "Hubungan makna antar kanji 試 dan 乗 menunjukan bahwa sebelum membeli atau menggunakan kendaraan harus mencoba kendaraan terlebih dahulu.", nodes: [{ jokugo: "試", arti: "Mencoba" }, { jokugo: "乗", arti: "Menaiki" }] },
        { word: "試食", penjelasan: "Hubungan mana antar kanji 試 dan食 menunjukan bahwa untuk menilai rasa sesuatu, terlebih dahulu harus mencoba makanannya terlebih dahulu.", nodes: [{ jokugo: "試", arti: "Mencoba" }, { jokugo: "食", arti: "Makan" }] },
        { word: "試飲", penjelasan: "Hubungan makna antar kanji 試 dan 飲 menjadi 試飲,  menunjukan bahwa　gabungan kedua kanji tersebut mengandung makna \"sebelum membeli   atau memilih produk minuman, terlebih dahulu mencoba minumannya.\"", nodes: [{ jokugo: "試", arti: "Mencoba" }, { jokugo: "飲", arti: "Minum" }] },
        { word: "試薬", penjelasan: "Hubungan makna antar kanji 試 dan 薬 menjadi 試薬, menujukan bahwa gabunagn keua kanji itu mengandung makna \"zat yang digunakan untuk melakukan pengujian atau eksperimen\".", nodes: [{ jokugo: "試", arti: "menguji" }, { jokugo: "薬", arti: "zat kimia" }] },
        { word: "試作", penjelasan: "Hubungan makna antar kanji 試 dan 作 menjadi 試作, menunjukan bahwa gabungan kedua kanji tersebut mengandung makna \"sebelum memperoduksi sesuatu secara massal, terlebih dahulu membuat produk percobaan terlebih dahulu\".", nodes: [{ jokugo: "試", arti: "Percobaan" }, { jokugo: "作", arti: "Membuat" }] },
        { word: "試作品", penjelasan: "Hubungan makna antar kanji 試作 dan 品 menjadi 試作品, menunjukan bahwa gabungan kedua kanji tersebut mengandung makan \"produk hasil percobaan  yang masih dalam tahap pengembangan\"", nodes: [{ jokugo: "試作", arti: "Prototipe" }, { jokugo: "品", arti: "Produk/barang" }] },
        { word: "試製", penjelasan: "Hubungan makna antar kanji 試 dan 製,  menunjukan bahwa gabungan kedua kanji itu mengandung makna \"mengevaluasi kualitas produk, terlebih dahulu memproduksi sesuatu dalam skala percobaan\".", nodes: [{ jokugo: "試", arti: "Percobaan" }, { jokugo: "製", arti: "Memproduksi" }] },
        { word: "試合", penjelasan: "Hubungan makna antar kanji 試 dan 合, menunjukan bahwa gabungan kedua kanji itu mengandung makna \"ajang untuk menguji kemampuan peserta atau pun tim\".", nodes: [{ jokugo: "試", arti: "Menguji" }, { jokugo: "合", arti: "Bertanding" }] },
        { word: "試技", penjelasan: "Hubungan makna antar kanji 試 dan技, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"demontrasi atau penilaian kemampuan teknis seseorang\".", nodes: [{ jokugo: "試", arti: "Menguji" }, { jokugo: "技", arti: "Keterampilan" }] },
        { word: "試聴", penjelasan: "Hubungan makna antar kanji 試 dan 聴, menunjukan bahwa gabungan kedua kanji itu  mengandung makna  \"sebelum memilih sesuatu, terlebih dahulu mendengarkan contoh audionya\".", nodes: [{ jokugo: "試", arti: "Mencoba" }, { jokugo: "聴", arti: "Mendengar" }] },
        { word: "試写", penjelasan: "Hubungan makna antar kanji 試 dan 写, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"sebelum mempublikasikan film secara resmi, terlebih dahulu filmnya dipertontonkan dulu\".", nodes: [{ jokugo: "試", arti: "mencoba" }, { jokugo: "写", arti: "menayangkan" }] },
        { word: "試読", penjelasan: "Hubungan makna antar kanji, dari kanji 試 dan 読, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"sebelum memutuskan membelinya, terlebih dahulu membaca isi buku atau tulisannya\".", nodes: [{ jokugo: "試", arti: "mencoba" }, { jokugo: "読", arti: "membaca" }] }
      ]
    },
    "験": {
      jukugos: [
        { word: "試験", reading: "しけん", meaning: "Ujian" },
        { word: "受験", reading: "じゅけん", meaning: "Mengikuti ujian" },
        { word: "資格試験", reading: "しかくしけん", meaning: "Ujian sertifikasi" },
        { word: "経験", reading: "けいけん", meaning: "Pengalaman" },
        { word: "体験", reading: "たいけん", meaning: "Pengalaman langsung" },
        { word: "経験者", reading: "けいけんしゃ", meaning: "Orang yang berpengalaman" },
        { word: "実験", reading: "じっけん", meaning: "Eksperimen" },
        { word: "実験室", reading: "じっけんしつ", meaning: "Ruang  penelitian" },
        { word: "被験者", reading: "ひけんしゃ", meaning: "Subjek penelitian" },
        { word: "受験生", reading: "じゅけんせい", meaning: "Peserta ujian" },
        { word: "検定試験", reading: "けんていしけん", meaning: "Ujian kompetensi" },
        { word: "受験番号", reading: "じゅけんばんごう", meaning: "Nomor peserta ujian" }
      ],
      semanticRelations: [
        { word: "試験", penjelasan: "Hubungan makna antar kanji  試 dan 験,  menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"menguji kemampuan untuk membuktikan penguasan seseorang\".", nodes: [{ jokugo: "試", arti: "Menguji" }, { jokugo: "験", arti: "Membuktikan hasil" }] },
        { word: "受験", penjelasan: "Hubungan makna antar kanji 受 dan 験, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"seseorang mengikuti proses ujian\".", nodes: [{ jokugo: "受", arti: "Menerima" }, { jokugo: "験", arti: "Ujian/verifikasi" }] },
        { word: "資格試験", penjelasan: "Hubungan makna dari kanji 資格, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"ujian fungsinya untuk membuktikan kompetesnsi tertentu.\"", nodes: [{ jokugo: "資格", arti: "kualifikasi" }, { jokugo: "試験", arti: "ujian" }] },
        { word: "経験", penjelasan: "Hubungan makna antar kanji 経 dan 験, menunjukan bahwa gabungan kedua kanji itu  mengandung makna\" sesuatu yang telah dialami secara langsung\".", nodes: [{ jokugo: "経", arti: "Melewati" }, { jokugo: "験", arti: "Mengalami" }] },
        { word: "体験", penjelasan: "Hubungan makna antar 体 dan 験 , menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"pengalaman yang dirasakan sendiri secara nyata\".", nodes: [{ jokugo: "体", arti: "badan" }, { jokugo: "験", arti: "mengalami" }] },
        { word: "経験者", penjelasan: "Hubungan makna antar kanji体 dan 験, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \" orang yang telah memiliki pengalaman.\"", nodes: [{ jokugo: "経験", arti: "Pengalaman" }, { jokugo: "者", arti: "Orang" }] },
        { word: "実験", penjelasan: "Hubungan makna dari kanji 実　dan 験, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"pembuktian suatu teori melalui percobaan\".", nodes: [{ jokugo: "実", arti: "nyata" }, { jokugo: "験", arti: "pembuktian" }] },
        { word: "実験室", penjelasan: "Hubungan makna antar kanji 実験 dan 室, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"tempat melakukan eksperimen\"", nodes: [{ jokugo: "実験", arti: "percobaan" }, { jokugo: "室", arti: "ruangan" }] },
        { word: "被験者", penjelasan: "Hubungan makna antar kanji dari 被, 験 dan 者, menunjukan bahwa gabungan ketiga kanji itu  mengandung makna \"orang yang menjadi objek eksperimen atau penelitian\".", nodes: [{ jokugo: "被", arti: "yang dikenai" }, { jokugo: "験", arti: "menguji" }, { jokugo: "者", arti: "orang" }] },
        { word: "受験生", penjelasan: "Hubungan makna antar kanji 受験 dan 生, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"seseorang sedang mengikuti ujian\".", nodes: [{ jokugo: "受験", arti: "mengikuti ujian" }, { jokugo: "生", arti: "siswa/pelajar" }] },
        { word: "検定試験", penjelasan: "Hubungan makna dari kanji検 dan 定, menunjukan bahwa gabungan kedua kanji itu  mengandung makna\" proses pemeriksaan untuk menetapkan kemampuan seseorang\".", nodes: [{ jokugo: "検", arti: "memeriksa" }, { jokugo: "定", arti: "menetapkan standar" }] },
        { word: "受験番号", penjelasan: "Hubungan makna antar kanji 受験 dan 番号 saat disatukan menjadi 受験番号, menunjukan bahwa gabungan kedua kosakata kanji tersebut,  mengandung makna \"nomor identitas khusus yang diberikan kepada peserta ujian untuk memastikan pengenalan dan verifikasi data diri selama seluruh rangkain ujian berlangsung\".", nodes: [{ jokugo: "受験", arti: "mengikuti ujian" }, { jokugo: "番号", arti: "nomor identitas" }] }
      ]
    },
    "問": {
      jukugos: [
        { word: "問題", reading: "もんだい", meaning: "Masalah, soal" },
        { word: "質問", reading: "しつもん", meaning: "Pertanyaan" },
        { word: "問答", reading: "もんどう", meaning: "Tanya jawab" },
        { word: "設問", reading: "せつもん", meaning: "Butir pertanyaan" },
        { word: "問診", reading: "もんちん", meaning: "Wawancara medis" },
        { word: "尋問", reading: "じんもん", meaning: "Introgasi" },
        { word: "訪問調査", reading: "ほうもんちょうさ", meaning: "Survei lapangan" },
        { word: "社会問題", reading: "しゃかいもんだい", meaning: "Masalah sosial" },
        { word: "環境問題", reading: "かんきょうもんだい", meaning: "Masalah lingkungan" },
        { word: "問題点", reading: "もんだいてん", meaning: "Titik permasalahan" },
        { word: "問題集", reading: "もんだいしゅう", meaning: "Kumpulan soal" },
        { word: "問い合わせ", reading: "といあわせ", meaning: "Pertanyaan/Inquiry" },
        { word: "問う", reading: "とう", meaning: "Menanyakan" },
        { word: "問屋", reading: "とんや", meaning: "Grosir (Pedagang besar)" },
        { word: "一問一答", reading: "いちもんいっと", meaning: "Satu pertanyaan satu jawaban" }
      ],
      semanticRelations: [
        { word: "問題", penjelasan: "Hubungan makna antar kanji 問 dan 題 menjadi 問題,  menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"sebagai persoalan yang harus diselesaikan\".", nodes: [{ jokugo: "問", arti: "bertanya" }, { jokugo: "題", arti: "persoalan" }] },
        { word: "質問", penjelasan: "Hubungan makna antar kanji  質dan 問 menjadi 質問, menunjukan bahwa gabungan kedua kanji itu  mengandung \"pertanyaan yang dikemukakan agar memperoleh suatu informasi\",", nodes: [{ jokugo: "質", arti: "kualitas/inti" }, { jokugo: "問", arti: "bertanya" }] },
        { word: "問答", penjelasan: "Hubungan makna antar kanji  問dan 答 ketika digabungkan menjadi 問答, menunjukan bahwa gabungan kedua kanji itu  mengandung makna　\" suatu kegiatan saling bertanya jawab antara pembicara dan lawan bicara\".", nodes: [{ jokugo: "問", arti: "bertanya" }, { jokugo: "答", arti: "menjawab" }] },
        { word: "問診", penjelasan: "Hubungan makna antar kanji 問 dan 診 ketika digabung menjadi 問診,  menunjukan bahwa gabungan kanji tersebut  mengandung makna \"pemerikasaan pasein melalaui serangkaian pertanyaan\".", nodes: [{ jokugo: "問", arti: "bertanya" }, { jokugo: "診", arti: "memeriksa" }] },
        { word: "尋問", penjelasan: "Hubungan makna antar kanji 尋 dan問 ketika digabung menjadi 尋問, menunjukan bahwa gabungan  kanji tersebut   mengandung makna \"proses pengajuan pertanyaan secara mendalam untuk memperoleh suatu keterangan informasi\".", nodes: [{ jokugo: "尋", arti: "menyelidiki" }, { jokugo: "問", arti: "bertanya" }] },
        { word: "訪問調査", penjelasan: "Hubungan makna antar kanji 訪問 dan 調査, ketika digabung menjadi dua kosakata yaitu 訪問調査, menunjukan bahwa gabungan kedua kosakata kanji tersebut   mengandung makna \"pengumpulan data yang dilakukan melalui kunjungan langsung\".", nodes: [{ jokugo: "訪問", arti: "mengunjungi" }, { jokugo: "調査", arti: "penyelidikan" }] },
        { word: "問題点", penjelasan: "Hubungan makna antar kanji 問題 dan点, ketika digabungkan menjadi 問題点, menunjukan bahwa gabungan  kedua kanji tersebut   mengandung makna \"bagian yang menjadi fokus masalah.\"", nodes: [{ jokugo: "問題", arti: "masalah" }, { jokugo: "点", arti: "titik atau poin" }] },
        { word: "社会問題", penjelasan: "Hubungan makna antar kanji 社会 dan 問題, ketika digabungkan menjadi 社会問題, menunjukan bahwa gabungan dua kosakata kanji tersebut, mengandung makna \"masalah yang dihadapi dalam kehidupan masyarat\".", nodes: [{ jokugo: "社会", arti: "masyarakat" }, { jokugo: "問題", arti: "masalah" }] },
        { word: "環境問題", penjelasan: "Hubungan makna antar kanji 環境 dan　問題 , ketika digabungkan menjadi 環境問題, menunjukan bahwa gabungan  kanji tersebut   mengandung makna \"suatu persoalan yang berhubungan dengan lingkungan hidup\".", nodes: [{ jokugo: "環境", arti: "lingkungan" }, { jokugo: "問題", arti: "masalah" }] },
        { word: "設問", penjelasan: "Hubungan makna antar kanji 設 dan 問, ketika digabungan menjadi 設問, menunjukan bahwa gabungan  kanji tersebut   mengandung makna　 \"pertanyaan yang disusun dalam test atau angket\".", nodes: [{ jokugo: "設", arti: "menyusun" }, { jokugo: "問", arti: "pertanyaan" }] },
        { word: "問題集", penjelasan: "Hubungan makna antar kanji 問題 dan集, ketika digabungkan menjadi 問題集,  menunjukan bahwa gabungan  kanji tersebut   mengandung makna \"buku yang berisi kumpulan berbagai latihan soal\".", nodes: [{ jokugo: "問題", arti: "soal" }, { jokugo: "集", arti: "kumpulan" }] },
        { word: "問一", penjelasan: "Hubungan makna antar kanji 問 dan一, ketika digabung menjadi 問一、menunjukan bahwa gabungan  kanji tersebut   mengandung makna nomor \"pertama dalam suatu latihan atau ujian\".", nodes: [{ jokugo: "問", arti: "soal" }, { jokugo: "一", arti: "satu" }] },
        { word: "問い合わせ", penjelasan: "Hubungan makna antar kanji 問 dan 合わせ, ketika digabungan menjadi 問い合わせ、menunjukan bahwa gabungan  kanji tersebut   mengandung makna \"menghubungi seseorang untuk memperoleh informasi\".", nodes: [{ jokugo: "問", arti: "bertanya" }, { jokugo: "合わせ", arti: "menghubungkan" }] }
      ]
    },
    "題": {
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
      semanticRelations: [
        { word: "問題", penjelasan: "Hubungan makna antar kanji 問 dan 題 ketika digabungkan menjadi 問題、menunjukan bahwa gabungan  kanji tersebut   mengandung makna suatu persoalan atau \"masalah yang harus diselesaikan\".", nodes: [{ jokugo: "問", arti: "bertanya" }, { jokugo: "題", arti: "topik atau persoalan" }] },
        { word: "課題", penjelasan: "Hubungan makna antara kanji 課 dan 題、ketika digabung menjadi 課題, menunjukan bahwa gabungan  kanji tersebut   mengandung makna  \"tugas yang diberikan untuk dikerjakan\".", nodes: [{ jokugo: "課", arti: "Pelajaran/mata kuliah" }, { jokugo: "題", arti: "Topik" }] },
        { word: "宿題", penjelasan: "Hubungan makna antar kanji 宿 dan 題 apabila digabungkan menjadi 宿題、 menunjukan bahwa gabungan  kanji tersebut   mengandung makna \"sesuatu tugas yang dikerjakan di rumah\".", nodes: [{ jokugo: "宿", arti: "tempat tinggal/rumah" }, { jokugo: "題", arti: "tugas" }] },
        { word: "題名", penjelasan: "Hubungan makna antar kanji 題dan 名, ketika digabungkan menjadi 題名、menunjukan bahwa gabungan  kanji tersebut   mengandung makna menunjukan makna atau arti nama sebuah tulisan atau karya.", nodes: [{ jokugo: "題", arti: "judul" }, { jokugo: "名", arti: "nama" }] },
        { word: "表題", penjelasan: "Hubungan makna antar kanji 表 dan題, ketika digabungkan menjadi 表題、menunjukan bahwa gabungan  kanji tersebut   mengandung makna \"judul yang muncul pada bagian dokumen\".", nodes: [{ jokugo: "表", arti: "bagian depan" }, { jokugo: "題", arti: "judul" }] },
        { word: "主題", penjelasan: "Hubungan makna antar kanji 主 dan 題, ketika digabungkan menjadi kanji  主題、 menunjukan bahwa gabungan  kanji tersebut   mengandung makna  \"pokok pembahasan utama\".", nodes: [{ jokugo: "主", arti: "utama" }, { jokugo: "題", arti: "tema" }] },
        { word: "研究課題", penjelasan: "Hubungan makna antar kanji 研究 dan課題, ketika digabungkan menjadi  研究課題、 menunjukan bahwa gabungan  kanji tersebut   mengandung makna \"suatu masalah yang menjadi fokus penelitian\".", nodes: [{ jokugo: "研究", arti: "penelitian" }, { jokugo: "課題", arti: "tugas" }] },
        { word: "論題", penjelasan: "Hubungan makna antar kanji 論dan題, ketika digabungkan menjadi kanji論題、menunjukan bahwa gabungan  kanji tersebut   mengandung makna \"topik yang dibahas secara akademik\".", nodes: [{ jokugo: "論", arti: "argumen/diskusi" }, { jokugo: "題", arti: "tema" }] },
        { word: "出題", penjelasan: "Hubungan makna antar kanji 出dan題, ketika digabungkan menjadi kanji出題、menunjukan bahwa gabungan  kanji tersebut   mengandung makna \"kegiatan membuat atau mengeluarkan soal\".", nodes: [{ jokugo: "出", arti: "mengeluarkan" }, { jokugo: "題", arti: "soal" }] },
        { word: "話題", penjelasan: "Hubungan makna antar kanji 話 dan 題, menunjukan bahwa gabungan kedua kanji itu  mengandung makna\" sesuatu hal yang sedang dibicarakan\".", nodes: [{ jokugo: "話", arti: "berbicara" }, { jokugo: "題", arti: "topik" }] },
        { word: "時事問題", penjelasan: "Hubungan makna antar kanji 時事 dan 問題 saat digabungkan 時事問題、menunjukan bahwa gabungan  kanji tersebut   mengandung makna \"persoalan yang sedang hangat dibicarakan di ｍasyarakat\".", nodes: [{ jokugo: "時事", arti: "peristiwa terkini" }, { jokugo: "問題", arti: "masalah" }] },
        { word: "問題意識", penjelasan: "Hubungan makna antar kanji 問題 dan 意識 saat digabungkan menjadi 問題意識、menunjukan bahwa gabungan  kanji tersebut   mengandung makna \"suatu kemampuan adanya persoalan yang perlu diselesaikan\".", nodes: [{ jokugo: "問題", arti: "masalah" }, { jokugo: "意識", arti: "kesadaran" }] },
        { word: "題材", penjelasan: "Hubungan makna antar kanji 題 dan材, saat digabungakan menjadi kanji 題材、menunjukan bahwa gabungan  kanji tersebut   mengandung makna\"bahan atau tema yang digunakan untuk membuat sebuah karya\"", nodes: [{ jokugo: "題", arti: "tema" }, { jokugo: "材", arti: "bahan" }] },
        { word: "題字", penjelasan: "Hubungan makna antar kanji 題 dan字 ketika digabung menjadi 題字、menunjukan bahwa gabungan  kanji tersebut   mengandung makna \"tulisan yang digunakan sebagai judul\".", nodes: [{ jokugo: "題", arti: "judul" }, { jokugo: "字", arti: "huruf/lisan" }] },
        { word: "演題", penjelasan: "Hubungan makna antar kanji dari kanji 演 dan題, ketika digabung menjadi 演題、menunjukan bahwa gabungan  kanji tersebut   mengandung makna \"judul sebuah presentasi, seminar, atau pidato.\"", nodes: [{ jokugo: "演", arti: "presentasi / pertunjukan" }, { jokugo: "題", arti: "judul" }] }
      ]
    },
    "答": {
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
      semanticRelations: [
        { word: "回答", penjelasan: "Hubungan makna antar kanji 回 dan 答, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"jawaban yang diberikan terhadap suatu pertanyaan atau perminataan informasi\".", nodes: [{ jokugo: "回", arti: "mengembalikan" }, { jokugo: "答", arti: "jawaban" }] },
        { word: "解答", penjelasan: "Hubungan makna antar kanji 解 dan 答,  menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"jawaban yang digunakan untuk menyelesaikan soal atau permasalahan\".", nodes: [{ jokugo: "解", arti: "menyelesaikan" }, { jokugo: "答", arti: "jawaban" }] },
        { word: "応答", penjelasan: "Hubungan makna antar kanji 応dan 答, menunjukan bahwa gabungan kedua kanji itu  mengandung makna\"respons yang diberikan terhadap pertanyaan, panggilan, atau komunikasi\"", nodes: [{ jokugo: "応", arti: "menanggapi" }, { jokugo: "答", arti: "jawaban" }] },
        { word: "答案", penjelasan: "Hubungan makna antar kanji 答 dan 案, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"lembar jawaban untuk menuliskan jawaban dalam ujian atau latihan\"", nodes: [{ jokugo: "答", arti: "jawaban" }, { jokugo: "案", arti: "naskah" }] },
        { word: "正答", penjelasan: "Hubungan makna antar kanji 正 dan 答 menjadi 正答, menunjukan bahwa gabungan kedua kanji itu mengandung makna \"jawaban yang benar pada suatu soal\".", nodes: [{ jokugo: "正", arti: "benar" }, { jokugo: "答", arti: "jawaban" }] },
        { word: "解答用紙", penjelasan: "Hubungan makna antar kanji 解答 dan用紙 menjadi 解答用紙, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"sebuah lembaran resmi yang digunakan untuk menuliskan jawaban peserta ujian\"", nodes: [{ jokugo: "解答", arti: "jawaban" }, { jokugo: "用紙", arti: "lembar kertas" }] },
        { word: "返答", penjelasan: "Hubungan makna antar kanji  返 dan 答 menjadi　返答, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"jawaban atau balasan terhadap pertanyaan, suray, maupun pesan\"", nodes: [{ jokugo: "返", arti: "mengembalikan" }, { jokugo: "答", arti: "jawaban" }] },
        { word: "口答", penjelasan: "Hubungan makna antar kanji 口 dan 答 menjadi口答, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"jawaban yang disampaikan secara lisan\"", nodes: [{ jokugo: "口", arti: "mulut" }, { jokugo: "答", arti: "jawaban" }] },
        { word: "答弁", penjelasan: "Hubungan makna antar kanji 答 dan 弁 menjadi　答弁, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \" jawaban resmi yang diberikan dalam rapat,siding atau pun forum\"", nodes: [{ jokugo: "答", arti: "menjawab" }, { jokugo: "弁", arti: "penjelasan" }] },
        { word: "問答", penjelasan: "Hubungan makna antar kanji 問 dan 答　menjadi問答, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"suatu kegiatan tanya jawab sebagai proses pembelajaran\".", nodes: [{ jokugo: "問", arti: "bertanya" }, { jokugo: "答", arti: "menjawab" }] },
        { word: "一問一答", penjelasan: "Hubungan makna antar kanji 一、問、一、dan答 menjadi 一問一答, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \" metode belajar yang menyajikan satu pertanyaan untuk satu jawaban\".", nodes: [{ jokugo: "一", arti: "satu" }, { jokugo: "問", arti: "pertanyaan" }, { jokugo: "一", arti: "satu" }, { jokugo: "答", arti: "jawaban" }] },
        { word: "答申", penjelasan: "Hubungan makna antar kanji 答 dan 申 menjadi 答申, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"jawaban resmi yang disampaikan kepada pihak yang meminta pertimbangan\"", nodes: [{ jokugo: "答", arti: "menjawab" }, { jokugo: "申", arti: "menyampaikan" }] },
        { word: "自動応答", penjelasan: "Hubungan makna antar kanji 自動 dan 応答　menjadi 自動応答, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"jawaban yang diberikan secara otomatis oleh sistem komputer atau perangkat\"", nodes: [{ jokugo: "自動", arti: "otomatis" }, { jokugo: "応答", arti: "respons" }] },
        { word: "応答時間", penjelasan: "Hubungan makna antar kanji  応答 dan 時間　menjadi応答時間, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \" lamanya waktu yang diperlukan seseorang atau sistem untuk memberikan jawaban\".", nodes: [{ jokugo: "応答", arti: "respons" }, { jokugo: "時間", arti: "waktu" }] },
        { word: "応答率", penjelasan: "Hubungan makna antar kanji  応答 dan 率　menjadi応答率, menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"presentase jumalah respons yang diterima dibanding jumlah pertanyaan\".", nodes: [{ jokugo: "応答", arti: "respons" }, { jokugo: "率", arti: "tingkat" }] }
      ]
    },
    "点": {
      jukugos: [
        { word: "採点", reading: "さいてん", meaning: "Penilaian" },
        { word: "得点", reading: "とくてん", meaning: "Skor" },
        { word: "減点", reading: "げんてん", meaning: "Pengurangan nilai" },
        { word: "地点", reading: "ちてん", meaning: "Lokasi" },
        { word: "起点", reading: "きてん", meaning: "Titik awal" },
        { word: "終点", reading: "しゅうてん", meaning: "Titik akhir" },
        { word: "観点", reading: "かんてん", meaning: "Sudut pandang" },
        { word: "視点", reading: "してん", meaning: "Perspektif" },
        { word: "論点", reading: "ろんてん", meaning: "Pokok bahasan" },
        { word: "問題点", reading: "もんだいてん", meaning: "Titik masalah" },
        { word: "重点", reading: "じゅうてん", meaning: "Fokus utama" },
        { word: "要点", reading: "ようてん", meaning: "Poin utama" },
        { word: "点検", reading: "てんけん", meaning: "Pemeriksaan" },
        { word: "点灯", reading: "てんとう", meaning: "Menyalakan lampu" },
        { word: "点数", reading: "てんすう", meaning: "Nilai" }
      ],
      semanticRelations: [
        { word: "採点", penjelasan: "Hubungan makna antar kanji 採 dan 点, saat digabungkan menjadi 採点, menunjukan bahwa gabungan kedua kanji itu  mengandung makna “ kegiatan memberikan nilai terhadap hasil pekerjaan”", nodes: [{ jokugo: "採", arti: "memberi/mengambil" }, { jokugo: "点", arti: "nilai" }] },
        { word: "得点", penjelasan: "Hubungan makna antar kanji 得 dan点 saat digabung menjadi 得点,  menunjukan bahwa gabungan kedua kanji itu  mengandung makna “jumlah nilai yang diperoleh seseorang”.", nodes: [{ jokugo: "得", arti: "memperoleh" }, { jokugo: "点", arti: "poin" }] },
        { word: "減点", penjelasan: "Hubungan makna antar kanji減 dan 点 , mumjukan gabungan kanji  ini saat digabung menjadi 減点,  menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"nilai yang dikurangi \"", nodes: [{ jokugo: "減", arti: "mengurangi" }, { jokugo: "点", arti: "nilai" }] },
        { word: "地点", penjelasan: "Hubungan makna antar kanji　地dan 点、menjadi 地点 , menunjukan bahwa gabungan kedua kanji itu  mengandung makna \"titik tertentu pada suatu lokasi\"", nodes: [{ jokugo: "地", arti: "tempat" }, { jokugo: "点", arti: "titik" }] },
        { word: "起点", penjelasan: "Hubungan makna antar kanji 起 dan 点 , menunjukan  bahwa gabungan  dua kanji  tersebut mengandung makna \"tempat dimulainya suatu perjalanan atau aktivitas\" .", nodes: [{ jokugo: "起", arti: "mulai" }, { jokugo: "点", arti: "awal" }] },
        { word: "終点", penjelasan: "Hubungan makna antar kanji 終 dan 点 , menunjukan  bahwa gabungan  dua kanji  tersebut  mengandung makna  “tempat berakhirnya suatu perjalanan”.", nodes: [{ jokugo: "終", arti: "selesai" }, { jokugo: "点", arti: "tempat" }] },
        { word: "観点", penjelasan: "Hubungan makna antar kanji 観 dan 点 menjadi 観点、menunjukan gabungaan dua kanji tersebut mengandung makna \"cara melihat/memandang  suatu persoalan \"", nodes: [{ jokugo: "観", arti: "melihat" }, { jokugo: "点", arti: "titik" }] },
        { word: "視点", penjelasan: "Hubungan makna antar kanji 視 dan 点 menjadi 視点, menunjukan bahwa gabungan dua kanji tersebut mengandung makna \"posisi atau sudut pandang dalam memahami suatu masalah\".", nodes: [{ jokugo: "視", arti: "melihat" }, { jokugo: "点", arti: "titik" }] },
        { word: "論点", penjelasan: "Hubungan makna antar kanji 論 dan 点 menjadi 論点, menunjukan bahwa gabungan dua kanji tersebut mengandung makna \"masalah utama yang menjadi inti pembahasaan\".", nodes: [{ jokugo: "論", arti: "pembahasan" }, { jokugo: "点", arti: "pokok" }] },
        { word: "問題点", penjelasan: "Hubungan makna antar kanji 問題 dan 点 menjadi 問題点, menunjukan bahwa gabungan kedua  kanji tersebut mengandung makna \"bagian yang menjadi sumber masalah\".", nodes: [{ jokugo: "問", arti: "masalah" }, { jokugo: "題", arti: "titik" }] },
        { word: "重点", penjelasan: "Hubungan makna antar kanji 重  dan 点 menjadi 重点, menunjukan bahwa gabungan kedua  kanji tersebut mengandung makna \"bagian yang terpenting untuk diperhatikan\"", nodes: [{ jokugo: "重", arti: "penting" }, { jokugo: "点", arti: "titik= titik" }] },
        { word: "要点", penjelasan: "Hubungan makna antar kanji 要  dan 点 menjadi 要点, menunjukan bahwa gabungan kedua  kanji tersebut mengandung makna \"poko dari suatu penjelasan\"", nodes: [{ jokugo: "要", arti: "inti" }, { jokugo: "点", arti: "poin" }] },
        { word: "点検", penjelasan: "Hubungan makna antar kanji   点 dan 検 menjadi 点検, menunjukan bahwa gabungan kedua  kanji tersebut mengandung makna \"keadaan memeriksa kondisi suatu benda atau sistem\".", nodes: [{ jokugo: "点", arti: "memeriksa" }, { jokugo: "検", arti: "inspeksi" }] },
        { word: "点灯", penjelasan: "Hubungan makna antar kanji点 dan 灯 menjadi 点灯、、menunjukan bahwa gabungan kedua  kanji tersebut mengandung makna \"menghidupkan lampu aatau penerangan\".", nodes: [{ jokugo: "点", arti: "menyalakan" }, { jokugo: "灯", arti: "lampu" }] },
        { word: "点数", penjelasan: "Hubungan makna antar kanji点 dan数  menjadi　点数、、 menunjukan bahwa gabungan kedua  kanji tersebut mengandung makna \"jumlah nilai yang diperoleh dalam suatu penilaian\".", nodes: [{ jokugo: "点", arti: "poin" }, { jokugo: "数", arti: "jumlah" }] }
      ]
    },
    "研": {
      jukugos: [
        { word: "研究", reading: "けんきゅう", meaning: "Penelitian" },
        { word: "研究室", reading: "けんきゅうしつ", meaning: "Tempat penelitian" },
        { word: "研究者", reading: "けんきゅうしゃ", meaning: "Peneliti" },
        { word: "研究会", reading: "けんきゅうかい", meaning: "Kelompok penelitian" },
        { word: "研修", reading: "けんしゅう", meaning: "Pelatihan" },
        { word: "研修生", reading: "けんしゅうせい", meaning: "Peserta Pelatihan" },
        { word: "研修旅行", reading: "けんしゅうりょこう", meaning: "Perjalanan studi" },
        { word: "研究科", reading: "けんきゅうか", meaning: "Pascasarjana" },
        { word: "研究書", reading: "けんきゅうしょ", meaning: "Buku penelitian" },
        { word: "研究分野", reading: "けんきゅうぶんや", meaning: "Bidang Penelitian" },
        { word: "研究方法", reading: "けんきゅうほうほう", meaning: "Metode penelitian" },
        { word: "研磨", reading: "けんま", meaning: "Mengasah atau memoles" },
        { word: "研削", reading: "けんさく", meaning: "Penggerindaan" }
      ],
      semanticRelations: [
        { word: "研究", penjelasan: "Hubungan makna antar kanji 研 dan 究 menjadi 研究, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna \"kegiatan menyelidiki suatu objek secara mendalam untuk memperoleh pengetahuan atau menemukan suatu kebenaran\".", nodes: [{ jokugo: "研", arti: "meneliti, mempelajari secara mendalam" }, { jokugo: "究", arti: "menyelidiki hingga tuntas" }] },
        { word: "研究室", penjelasan: "Hubungan makna antar kanji 研・究・室 menjadi 研究室, menunjukkan bahwa gabungan ketiga kanji tersebut membentuk makna \"ruangan yang digunakan untuk melakukan kegiatan penelitian\".", nodes: [{ jokugo: "研", arti: "meneliti" }, { jokugo: "究", arti: "menyelidiki" }, { jokugo: "室", arti: "ruangan" }] },
        { word: "研究者", penjelasan: "Hubungan makna antar kanji 研・究・者 menjadi 研究者, menunjukkan bahwa gabungan ketiga kanji tersebut membentuk makna \"orang yang melakukan penelitian secara mendalam pada suatu bidang ilmu\".", nodes: [{ jokugo: "研", arti: "meneliti" }, { jokugo: "究", arti: "menyelidiki" }, { jokugo: "者", arti: "orang" }] },
        { word: "研究会", penjelasan: "Hubungan makna antar kanji 研・究・会 menjadi 研究会, menunjukkan bahwa gabungan ketiga kanji tersebut membentuk makna \"forum atau kelompok yang berkumpul untuk berdiskusi dan melakukan penelitian bersama\".", nodes: [{ jokugo: "研", arti: "meneliti" }, { jokugo: "究", arti: "menyelidiki" }, { jokugo: "会", arti: "pertemuan" }] },
        { word: "研修", penjelasan: "Hubungan makna antar kanji 研 dan 修 menjadi 研修, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna \"kegiatan belajar yang bertujuan meningkatkan pengetahuan, kemampuan, atau keterampilan seseorang\".", nodes: [{ jokugo: "研", arti: "mempelajari secara mendalam" }, { jokugo: "修", arti: "belajar, memperbaiki" }] },
        { word: "研修生", penjelasan: "Hubungan makna antar kanji 研・修・生 menjadi 研修生, menunjukkan bahwa gabungan ketiga kanji tersebut membentuk makna \"orang yang mengikuti kegiatan pelatihan atau pembelajaran\".", nodes: [{ jokugo: "研", arti: "mempelajari" }, { jokugo: "修", arti: "belajar" }, { jokugo: "生", arti: "orang yang belajar" }] },
        { word: "研修旅行", penjelasan: "Hubungan makna antara 研修 dan 旅行 menjadi 研修旅行, menunjukkan bahwa gabungan kedua unsur tersebut membentuk makna \"perjalanan yang dilakukan sebagai bagian dari kegiatan belajar, pelatihan, atau pengembangan kemampuan\".", nodes: [{ jokugo: "研修", arti: "mempelajari" }, { jokugo: "旅行", arti: "perjalanan" }] },
        { word: "研究科", penjelasan: "Hubungan makna antar kanji 研・究・科 menjadi 研究科, menunjukkan bahwa gabungan ketiga kanji tersebut membentuk makna \"program studi atau bidang ilmu yang berfokus pada penelitian dan pengembangan ilmu pengetahuan\".", nodes: [{ jokugo: "研", arti: "meneliti" }, { jokugo: "究", arti: "menyelidiki" }, { jokugo: "科", arti: "bidang ilmu" }] },
        { word: "研究書", penjelasan: "Hubungan makna antar kanji 研・究・書 menjadi 研究書, menunjukkan bahwa gabungan ketiga kanji tersebut membentuk makna \"buku yang berisi hasil penelitian atau kajian ilmiah.\"", nodes: [{ jokugo: "研", arti: "meneliti" }, { jokugo: "究", arti: "menyelidiki" }, { jokugo: "書", arti: "Menulis" }] },
        { word: "研究分野", penjelasan: "Hubungan makna antara 研究 dan 分野 menjadi 研究分野, menunjukkan bahwa gabungan kedua unsur tersebut membentuk \"makna cabang ilmu atau topik tertentu yang menjadi fokus penelitian\".", nodes: [{ jokugo: "研究", arti: "meneliti" }, { jokugo: "分野", arti: "bidang ilmu" }] },
        { word: "研究方法", penjelasan: "Hubungan makna antara 研究 dan 方法 menjadi 研究方法, menunjukkan bahwa gabungan kedua unsur tersebut membentuk makna \"cara atau prosedur yang digunakan dalam melaksanakan suatu penelitian\".", nodes: [{ jokugo: "研究", arti: "meneliti" }, { jokugo: "方法", arti: "cara atau prosedur" }] },
        { word: "研磨", penjelasan: "Hubungan makna antar kanji 研 dan 磨 menjadi 研磨, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “proses mengasah atau memoles permukaan benda hingga menjadi lebih halus, tajam, atau berkualitas lebih baik”.", nodes: [{ jokugo: "研", arti: "mengasah" }, { jokugo: "磨", arti: "memoles" }] },
        { word: "研削", penjelasan: "Hubungan makna antar kanji 研 dan 削 menjadi 研削, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “proses mengikis dan menghaluskan permukaan suatu benda menggunakan alat sehingga diperoleh hasil yang lebih presisi”.", nodes: [{ jokugo: "研", arti: "mengasah" }, { jokugo: "削", arti: "mengikis" }] }
      ]
    },
    "究": {
      jukugos: [
        { word: "究明", reading: "きゅうめい", meaning: "Penyelidikan menyeluruh" },
        { word: "究査", reading: "きゅうさ", meaning: "Penyelidikan secara mendalam" },
        { word: "究問", reading: "きゅうもん", meaning: "Penyelidikan terhadap satu perkara" },
        { word: "究理", reading: "きゅうり", meaning: "Menyelidiki atau mencari prinsip yang benar." },
        { word: "原因究明", reading: "げんいんきゅうめい", meaning: "Menyelidiki penyebab" },
        { word: "真相究明", reading: "しんそうきゅうめい", meaning: "Menyelidiki kebenaran suatu peristiwa" },
        { word: "事実究明", reading: "じじつきゅうめい", meaning: "Menyelidiki fakta" },
        { word: "問題究明", reading: "もんだいきゅうめい", meaning: "Menyelidiki atau memecahkan masalah" },
        { word: "研究科", reading: "けんきゅうか", meaning: "Peneliti" },
        { word: "研究室", reading: "けんきゅうしつ", meaning: "Ruang penelitian" },
        { word: "研究書", reading: "けんきゅうしょ", meaning: "Buku penelitian" },
        { word: "研究方法", reading: "けんきゅうほうほう", meaning: "Metode penelitian" },
        { word: "探究心", reading: "たんきゅうしん", meaning: "Rasa ingin tahu yang tinggi" },
        { word: "学究心", reading: "がっきゅうしん", meaning: "Semangat mendalami ilmu" },
        { word: "深く究める", reading: "ふかくきわめる", meaning: "Mendalami ilmu sampai selesai." }
      ],
      semanticRelations: [
        { word: "究明", penjelasan: "Hubungan makna antar kanji 究 dan 明 menjadi 究明, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna \"menyelidiki suatu masalah secara mendalam hingga memperoleh penjelasan atau kebenaran yang jelas.\"", nodes: [{ jokugo: "究", arti: "menyelidiki hingga tuntas" }, { jokugo: "明", arti: "jelas, terang" }] },
        { word: "究査", penjelasan: "Hubungan makna antar kanji 究 dan 査 menjadi 究査, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna \"melakukan penyelidikan dan pemeriksaan secara mendalam untuk memperoleh informasi atau fakta yang akurat.\"", nodes: [{ jokugo: "究", arti: "menyelidiki hingga tuntas" }, { jokugo: "査", arti: "memeriksa, menyelidiki" }] },
        { word: "究問", penjelasan: "Hubungan makna antar kanji 究 dan 問 menjadi 究問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna \"menyelidiki suatu persoalan melalui proses mempertanyakan secara mendalam hingga memperoleh pemahaman yang lengkap.\"", nodes: [{ jokugo: "究", arti: "menyelidiki hingga tuntas" }, { jokugo: "問", arti: "bertanya, mempertanyakan" }] },
        { word: "究理", penjelasan: "Hubungan makna antar kanji 究 dan 理 menjadi 究理, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna \"mencari dan memahami prinsip atau hakikat suatu fenomena secara mendalam.\"", nodes: [{ jokugo: "究", arti: "menyelidiki hingga tuntas" }, { jokugo: "理", arti: "prinsip, alasan, hakikat" }] },
        { word: "原因究明", penjelasan: "Hubungan makna antara 原因 dan 究明 menjadi 原因究明, menunjukkan bahwa gabungan tersebut membentuk makna \"menyelidiki secara mendalam untuk menemukan penyebab utama suatu kejadian atau masalah.\"", nodes: [{ jokugo: "原因", arti: "penyebab" }, { jokugo: "究明", arti: "menyelidiki hingga jelas" }] },
        { word: "真相究明", penjelasan: "Hubungan makna antara 真相 dan 究明 menjadi 真相究明, menunjukkan bahwa gabungan tersebut membentuk makna \"menyelidiki secara mendalam untuk mengetahui fakta atau kebenaran yang sesungguhnya.\"", nodes: [{ jokugo: "真相", arti: "keadaan yang sebenarnya" }, { jokugo: "究明", arti: "menyelidiki hingga jelas" }] },
        { word: "事実究明", penjelasan: "Hubungan makna antara 事実 dan 究明 menjadi 事実究明, menunjukkan bahwa gabungan tersebut membentuk makna \"menyelidiki suatu peristiwa hingga memperoleh fakta yang sebenarnya.\"", nodes: [{ jokugo: "事実", arti: "fakta" }, { jokugo: "究明", arti: "menyelidiki hingga jelas" }] },
        { word: "問題究明", penjelasan: "Hubungan makna antara 問題 dan 究明 menjadi 問題究明, menunjukkan bahwa gabungan tersebut membentuk makna \"menganalisis dan menyelidiki suatu permasalahan secara mendalam hingga diketahui penyebab dan solusinya.\"", nodes: [{ jokugo: "問題", arti: "masalah" }, { jokugo: "究明", arti: "menyelidiki hingga jelas" }] },
        { word: "研究科", penjelasan: "Hubungan makna antar kanji 研・究・科 menjadi 研究科, menunjukkan bahwa gabungan ketiga kanji tersebut membentuk makna \"bidang ilmu yang mempelajari suatu disiplin secara mendalam melalui kegiatan penelitian.\"", nodes: [{ jokugo: "研", arti: "meneliti" }, { jokugo: "究", arti: "menyelidiki hingga tuntas" }, { jokugo: "科", arti: "bidang ilmu" }] },
        { word: "研究室", penjelasan: "Hubungan makna antar kanji 研・究・室 menjadi 研究室, menunjukkan bahwa gabungan ketiga kanji tersebut membentuk makna \"ruangan yang digunakan untuk melakukan kegiatan penelitian dan penyelidikan ilmiah.\"", nodes: [{ jokugo: "研", arti: "meneliti" }, { jokugo: "究", arti: "menyelidiki" }, { jokugo: "室", arti: "ruangan" }] },
        { word: "研究書", penjelasan: "Hubungan makna antar kanji 研・究・書 menjadi 研究書, menunjukkan bahwa gabungan ketiga kanji tersebut membentuk makna \"buku yang memuat hasil penelitian atau kajian ilmiah secara mendalam.\"", nodes: [{ jokugo: "研", arti: "meneliti" }, { jokugo: "究", arti: "menyelidiki" }, { jokugo: "書", arti: "buku" }] },
        { word: "研究方法", penjelasan: "Hubungan makna antara 研究 dan 方法 menjadi 研究方法, menunjukkan bahwa gabungan tersebut membentuk makna \"cara atau prosedur yang digunakan untuk melakukan penelitian secara sistematis.\"", nodes: [{ jokugo: "研究", arti: "penelitian" }, { jokugo: "方法", arti: "cara" }] },
        { word: "探究心", penjelasan: "Hubungan makna antar kanji 探・究・心 menjadi 探究心, menunjukkan bahwa gabungan ketiga kanji tersebut membentuk makna \"keinginan yang kuat untuk mencari dan memahami suatu pengetahuan secara mendalam.\"", nodes: [{ jokugo: "探", arti: "mencari" }, { jokugo: "究", arti: "menyelidiki hingga tuntas" }, { jokugo: "心", arti: "hati, keinginan" }] },
        { word: "学究心", penjelasan: "Hubungan makna antar kanji 学・究・心 menjadi 学究心, menunjukkan bahwa gabungan ketiga kanji tersebut membentuk makna \"semangat yang tinggi untuk mempelajari dan mendalami ilmu pengetahuan.\"", nodes: [{ jokugo: "学", arti: "belajar" }, { jokugo: "究", arti: "menyelidiki hingga tuntas" }, { jokugo: "心", arti: "niat, semangat" }] },
        { word: "追究する", penjelasan: "Hubungan makna antar kanji 追 dan 究 menjadi 追究, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna \"terus mencari dan menyelidiki suatu hal hingga diperoleh penjelasan yang memadai.\"", nodes: [{ jokugo: "追", arti: "mengejar" }, { jokugo: "究", arti: "menyelidiki hingga tuntas" }] },
        { word: "深く究める", penjelasan: "Hubungan makna antara 深く dan 究める menunjukkan bahwa kegiatan tersebut bermakna \"mempelajari atau menyelidiki sesuatu secara sungguh-sungguh hingga mencapai tingkat pemahaman yang mendalam.\"", nodes: [{ jokugo: "深く", arti: "secara mendalam" }, { jokugo: "究める", arti: "mendalami hingga mencapai pemahaman yang utuh" }] },
        { word: "究極", penjelasan: "Hubungan makna antar kanji 究 dan 極 menjadi 究極, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna \"tingkat tertinggi atau hasil akhir yang dicapai setelah melalui proses pencarian dan pendalaman.\"", nodes: [{ jokugo: "究", arti: "menyelidiki hingga tuntas" }, { jokugo: "極", arti: "puncak, paling tinggi" }] },
        { word: "究理", penjelasan: "Hubungan makna antar kanji 究 dan 理 menjadi 究理, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna \"pemahaman terhadap prinsip atau hakikat suatu hal yang diperoleh melalui penyelidikan mendalam.\"", nodes: [{ jokugo: "究", arti: "menyelidiki hingga tuntas" }, { jokugo: "理", arti: "prinsip, hakikat" }] },
        { word: "結論究明", penjelasan: "Hubungan makna antara 結論 dan 究明 menjadi 結論究明, menunjukkan bahwa gabungan tersebut membentuk makna \"proses penyelidikan yang dilakukan hingga menghasilkan kesimpulan yang dapat dipertanggungjawabkan.\"", nodes: [{ jokugo: "結論", arti: "kesimpulan" }, { jokugo: "究明", arti: "menyelidiki hingga jelas" }] },
        { word: "本質究明", penjelasan: "Hubungan makna antara 本質 dan 究明 menjadi 本質究明, menunjukkan bahwa gabungan tersebut membentuk makna \"penyelidikan yang bertujuan menemukan esensi atau hakikat sebenarnya dari suatu objek atau peristiwa.\"", nodes: [{ jokugo: "本質", arti: "hakikat, esensi" }, { jokugo: "究明", arti: "menyelidiki hingga jelas" }] }
      ]
    }
  };

  for (const [char, data] of Object.entries(masterDataset)) {
    const kanjiId = kanjiMap.get(char)!;
    console.log(`Syncing Kanji [${char}] (ID: ${kanjiId})...`);

    // 1. Sync Jukugo Table
    await prisma.jukugo.deleteMany({ where: { kanjiId } });

    const createdJukugos: { id: number; word: string }[] = [];
    for (const j of data.jukugos) {
      const createdJ = await prisma.jukugo.create({
        data: {
          kanjiId,
          word: j.word,
          reading: j.reading,
          meaning: j.meaning,
        }
      });
      createdJukugos.push({ id: createdJ.id, word: j.word });
    }

    const createdJukugoMap = new Map<string, number>();
    createdJukugos.forEach(c => createdJukugoMap.set(c.word, c.id));

    // 2. Sync SemanticRelation Table & Nodes
    await prisma.semanticRelation.deleteMany({ where: { kanjiId } });

    for (const sr of data.semanticRelations) {
      const matchedJukugoId = createdJukugoMap.get(sr.word) || null;
      const createdSR = await prisma.semanticRelation.create({
        data: {
          kanjiId,
          jukugoId: matchedJukugoId,
          penjelasan: sr.penjelasan,
        }
      });

      for (const node of sr.nodes) {
        await prisma.semanticRelationNode.create({
          data: {
            semanticId: createdSR.id,
            jokugo: node.jokugo,
            arti: node.arti,
          }
        });
      }
    }

    console.log(`✅ Successfully synced ${data.jukugos.length} Jukugos & ${data.semanticRelations.length} SemanticRelations for [${char}].`);
  }

  console.log("🎉 Complete Master Data Sync Completed Successfully!");
}
