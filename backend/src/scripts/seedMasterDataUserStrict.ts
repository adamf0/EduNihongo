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
        { word: "試験", reading: "しけん", meaning: "ujian" },
        { word: "入試", reading: "にゅうし", meaning: "ujian masuk" },
        { word: "追試", reading: "ついし", meaning: "ujian susulan" },
        { word: "試問", reading: "しもん", meaning: "ujian lisan / pengujian melalui pertanyaan" },
        { word: "試着", reading: "しちゃく", meaning: "coba pakaian" },
        { word: "試用", reading: "しよう", meaning: "uji coba" },
        { word: "試乗", reading: "しじょう", meaning: "test drive / coba kendaraan" },
        { word: "試食", reading: "ししょく", meaning: "uji rasa / mencicipi makanan" },
        { word: "試飲", reading: "しいん", meaning: "coba minuman" },
        { word: "試薬", reading: "しやく", meaning: "reagen uji / bahan uji" },
        { word: "試作", reading: "しさく", meaning: "prototipe / pembuatan percobaan" },
        { word: "試製", reading: "しせい", meaning: "produksi uji / pembuatan percobaan" },
        { word: "試合", reading: "しあい", meaning: "pertandingan" },
        { word: "試技", reading: "しぎ", meaning: "uji keterampilan" },
        { word: "試射", reading: "ししゃ", meaning: "uji tembak" },
        { word: "試練", reading: "しれん", meaning: "latihan / ujian berat" },
        { word: "試写", reading: "ししゃ", meaning: "pratinjau film / pemutaran uji" },
        { word: "試聴", reading: "しちょう", meaning: "mendengar contoh / mencoba mendengarkan" },
        { word: "試読", reading: "しどく", meaning: "membaca contoh / mencoba membaca" }
      ],
      semanticRelations: [
        { word: "試験", penjelasan: "Hubungan makna antara kanji 試 dan 験 menjadi 試験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan menguji untuk mengetahui atau membuktikan kemampuan, pengetahuan, atau hasil tertentu.”", nodes: [{ jokugo: "試", arti: "mencoba, menguji" }, { jokugo: "験", arti: "menguji, membuktikan melalui pengalaman atau pengujian" }] },
        { word: "入試", penjelasan: "Hubungan makna antara kanji 入 dan 試 menjadi 入試, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “ujian yang dilakukan untuk menentukan apakah seseorang dapat masuk ke sekolah, universitas, atau lembaga tertentu.”", nodes: [{ jokugo: "入", arti: "masuk, memasuki" }, { jokugo: "試", arti: "mencoba, menguji" }] },
        { word: "追試", penjelasan: "Hubungan makna antara kanji 追 dan 試 menjadi 追試, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “ujian tambahan atau ujian susulan yang dilakukan setelah ujian utama.”", nodes: [{ jokugo: "追", arti: "mengikuti, menyusul, menambahkan" }, { jokugo: "試", arti: "ujian, pengujian" }] },
        { word: "試問", penjelasan: "Hubungan makna antara kanji 試 dan 問 menjadi 試問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengujian yang dilakukan dengan memberikan pertanyaan untuk mengetahui kemampuan atau pengetahuan seseorang.”", nodes: [{ jokugo: "試", arti: "mencoba, menguji" }, { jokugo: "問", arti: "bertanya, pertanyaan" }] },
        { word: "試着", penjelasan: "Hubungan makna antara kanji 試 dan 着 menjadi 試着, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba mengenakan pakaian untuk mengetahui ukuran, penampilan, atau kecocokannya.”", nodes: [{ jokugo: "試", arti: "mencoba, menguji" }, { jokugo: "着", arti: "memakai, mengenakan" }] },
        { word: "試用", penjelasan: "Hubungan makna antara kanji 試 dan 用 menjadi 試用, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba menggunakan sesuatu untuk mengetahui fungsi, kualitas, atau kesesuaiannya.”", nodes: [{ jokugo: "試", arti: "mencoba, menguji" }, { jokugo: "用", arti: "menggunakan, memakai" }] },
        { word: "試乗", penjelasan: "Hubungan makna antara kanji 試 dan 乗 menjadi 試乗, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba menaiki atau mengendarai kendaraan untuk mengetahui kondisi, kenyamanan, atau performanya.”", nodes: [{ jokugo: "試", arti: "mencoba, menguji" }, { jokugo: "乗", arti: "menaiki, mengendarai" }] },
        { word: "試食", penjelasan: "Hubungan makna antara kanji 試 dan 食 menjadi 試食, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba atau mencicipi makanan untuk mengetahui rasa atau kualitasnya.”", nodes: [{ jokugo: "試", arti: "mencoba, menguji" }, { jokugo: "食", arti: "makan, makanan" }] },
        { word: "試飲", penjelasan: "Hubungan makna antara kanji 試 dan 飲 menjadi 試飲, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba atau mencicipi minuman untuk mengetahui rasa atau kualitasnya.”", nodes: [{ jokugo: "試", arti: "mencoba, menguji" }, { jokugo: "飲", arti: "minum" }] },
        { word: "試薬", penjelasan: "Hubungan makna antara kanji 試 dan 薬 menjadi 試薬, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bahan kimia atau reagen yang digunakan untuk melakukan suatu pengujian.”", nodes: [{ jokugo: "試", arti: "mencoba, menguji" }, { jokugo: "薬", arti: "obat, bahan kimia" }] },
        { word: "試作", penjelasan: "Hubungan makna antara kanji 試 dan 作 menjadi 試作, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba membuat suatu benda atau produk sebagai percobaan untuk menilai bentuk, fungsi, atau kualitasnya.”", nodes: [{ jokugo: "試", arti: "mencoba, menguji" }, { jokugo: "作", arti: "membuat, menghasilkan" }] },
        { word: "試製", penjelasan: "Hubungan makna antara kanji 試 dan 製 menjadi 試製, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “membuat atau memproduksi sesuatu secara percobaan untuk menguji hasilnya sebelum produksi sebenarnya.”", nodes: [{ jokugo: "試", arti: "mencoba, menguji" }, { jokugo: "製", arti: "membuat, memproduksi" }] },
        { word: "試合", penjelasan: "Hubungan makna antara kanji 試 dan 合 menjadi 試合, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan mempertemukan dua pihak untuk menguji atau membandingkan kemampuan dalam suatu pertandingan.”", nodes: [{ jokugo: "試", arti: "mencoba, menguji" }, { jokugo: "合", arti: "bertemu, berhadapan" }] },
        { word: "試技", penjelasan: "Hubungan makna antara kanji 試 dan 技 menjadi 試技, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pelaksanaan atau percobaan suatu teknik untuk menunjukkan atau menguji keterampilan.”", nodes: [{ jokugo: "試", arti: "mencoba, menguji" }, { jokugo: "技", arti: "keterampilan, teknik" }] },
        { word: "試射", penjelasan: "Hubungan makna antara kanji 試 dan 射 menjadi 試射, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “percobaan menembak untuk menguji ketepatan, jarak, atau kondisi senjata.”", nodes: [{ jokugo: "試", arti: "mencoba, menguji" }, { jokugo: "射", arti: "menembak, memanah" }] },
        { word: "試練", penjelasan: "Hubungan makna antara kanji 試 dan 練 menjadi 試練, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “ujian atau cobaan berat yang dialami seseorang untuk melatih dan menguji ketahanan serta kesabaran.”", nodes: [{ jokugo: "試", arti: "mencoba, menguji" }, { jokugo: "練", arti: "melatih, menempa" }] },
        { word: "試写", penjelasan: "Hubungan makna antara kanji 試 dan 写 menjadi 試写, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menayangkan atau melihat film sebagai percobaan sebelum ditampilkan secara umum.”", nodes: [{ jokugo: "試", arti: "mencoba, menguji" }, { jokugo: "写", arti: "memotret, menyalin, menayangkan gambar" }] },
        { word: "試聴", penjelasan: "Hubungan makna antara kanji 試 dan 聴 menjadi 試聴, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba mendengarkan musik, rekaman, atau media suara untuk mengetahui isi atau kualitasnya.”", nodes: [{ jokugo: "試", arti: "mencoba, menguji" }, { jokugo: "聴", arti: "mendengarkan" }] },
        { word: "試読", penjelasan: "Hubungan makna antara kanji 試 dan 読 menjadi 試読, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mencoba membaca suatu tulisan atau karya untuk mengetahui isi atau kualitasnya sebelum membaca lebih lanjut.”", nodes: [{ jokugo: "試", arti: "mencoba, menguji" }, { jokugo: "読", arti: "membaca" }] }
      ]
    },
    "験": {
      jukugos: [
        { word: "試験", reading: "しけん", meaning: "ujian / pengujian" },
        { word: "受験", reading: "じゅけん", meaning: "mengikuti ujian" },
        { word: "実験", reading: "じっけん", meaning: "eksperimen / percobaan" },
        { word: "治験", reading: "ちけん", meaning: "uji klinis" },
        { word: "経験", reading: "けいけん", meaning: "pengalaman" },
        { word: "体験", reading: "たいけん", meaning: "pengalaman pribadi / pengalaman langsung" },
        { word: "験算", reading: "けんざん", meaning: "penghitungan ulang / verifikasi hitungan" },
        { word: "効験", reading: "こうけん", meaning: "khasiat / efektivitas / bukti hasil" }
      ],
      semanticRelations: [
        { word: "試験", penjelasan: "Hubungan makna antara kanji 試 dan 験 menjadi 試験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “suatu kegiatan pengujian yang dilakukan untuk mengetahui atau mengukur pengetahuan, kemampuan, maupun hasil seseorang atau sesuatu”, sehingga mengandung makna ujian atau pengujian.", nodes: [{ jokugo: "試", arti: "mencoba, menguji" }, { jokugo: "験", arti: "menguji, memverifikasi hasil" }] },
        { word: "受験", penjelasan: "Hubungan makna antara kanji 受 dan 験 menjadi 受験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tindakan menerima atau menjalani suatu proses pengujian”, sehingga bermakna mengikuti ujian.", nodes: [{ jokugo: "受", arti: "menerima, menjalani" }, { jokugo: "験", arti: "ujian, pengujian" }] },
        { word: "実験", penjelasan: "Hubungan makna antara kanji 実 dan 験 menjadi 実験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan melakukan pengujian secara nyata atau praktis untuk membuktikan kebenaran suatu teori, hipotesis, atau fenomena.”", nodes: [{ jokugo: "実", arti: "nyata, sungguh-sungguh, fakta" }, { jokugo: "験", arti: "menguji, membuktikan" }] },
        { word: "治験", penjelasan: "Hubungan makna antara kanji 治 dan 験 menjadi 治験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengujian yang dilakukan untuk mengobati atau menyembuhkan, khususnya dalam konteks uji klinis obat atau metode pengobatan baru.”", nodes: [{ jokugo: "治", arti: "menyembuhkan, mengobati, mengatur" }, { jokugo: "験", arti: "menguji, membuktikan" }] },
        { word: "経験", penjelasan: "Hubungan makna antara kanji 経 dan 験 menjadi 経験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “proses melewati berbagai peristiwa atau keadaan yang kemudian diuji dan diverifikasi secara langsung melalui kehidupan nyata”, sehingga bermakna pengalaman.", nodes: [{ jokugo: "経", arti: "melewati, melalui, mengalami" }, { jokugo: "験", arti: "pengujian, verifikasi hasil, pengalaman" }] },
        { word: "体験", penjelasan: "Hubungan makna antara kanji 体 dan 験 menjadi 体験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengalaman yang dirasakan atau dialami secara langsung oleh tubuh dan diri sendiri.”", nodes: [{ jokugo: "体", arti: "tubuh, diri sendiri" }, { jokugo: "験", arti: "pengalaman, pengujian langsung" }] },
        { word: "験算", penjelasan: "Hubungan makna antara kanji 験 dan 算 menjadi 験算, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan memeriksa atau memverifikasi kembali hasil perhitungan untuk memastikan kebenarannya.”", nodes: [{ jokugo: "験", arti: "memverifikasi, menguji" }, { jokugo: "算", arti: "menghitung, perhitungan" }] },
        { word: "効験", penjelasan: "Hubungan makna antara kanji 効 dan 験 menjadi 効験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bukti nyata dari adanya khasiat, kemanjuran, atau efektivitas dari suatu usaha, obat, maupun tindakan.”", nodes: [{ jokugo: "効", arti: "berkhasiat, efektif, hasil" }, { jokugo: "験", arti: "bukti, verifikasi hasil" }] }
      ]
    },
    "問": {
      jukugos: [
        { word: "質問", reading: "しつもん", meaning: "pertanyaan" },
        { word: "自問", reading: "じもん", meaning: "bertanya pada diri sendiri" },
        { word: "発問", reading: "はつもん", meaning: "mengajukan pertanyaan" },
        { word: "反問", reading: "はんもん", meaning: "pertanyaan balik" },
        { word: "問答", reading: "もんどう", meaning: "tanya jawab" },
        { word: "問題", reading: "もんだい", meaning: "masalah" },
        { word: "設問", reading: "せつもん", meaning: "pertanyaan" },
        { word: "試問", reading: "しもん", meaning: "ujian lisan" },
        { word: "難問", reading: "なんもん", meaning: "pertanyaan sulit" },
        { word: "問診", reading: "もんしん", meaning: "wawancara medis" },
        { word: "検問", reading: "けんもん", meaning: "pemeriksaan" },
        { word: "問責", reading: "もんせき", meaning: "meminta pertanggungjawaban" },
        { word: "不問", reading: "ふもん", meaning: "tidak dipermasalahkan" },
        { word: "訪問", reading: "ほうもん", meaning: "kunjungan" }
      ],
      semanticRelations: [
        { word: "質問", penjelasan: "Hubungan makna antar kanji 質 dan 問 menjadi 質問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pertanyaan yang diajukan untuk memperoleh informasi atau penjelasan mengenai sesuatu.”", nodes: [{ jokugo: "質", arti: "menanyakan, mencari kepastian" }, { jokugo: "問", arti: "bertanya, menanyakan" }] },
        { word: "自問", penjelasan: "Hubungan makna antar kanji 自 dan 問 menjadi 自問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bertanya atau mempertanyakan sesuatu kepada diri sendiri.”", nodes: [{ jokugo: "自", arti: "diri sendiri" }, { jokugo: "問", arti: "bertanya, menanyakan" }] },
        { word: "発問", penjelasan: "Hubungan makna antar kanji 発 dan 問 menjadi 発問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengemukakan atau mengajukan suatu pertanyaan kepada orang lain.”", nodes: [{ jokugo: "発", arti: "mengeluarkan, mengemukakan" }, { jokugo: "問", arti: "bertanya, pertanyaan" }] },
        { word: "反問", penjelasan: "Hubungan makna antar kanji 反 dan 問 menjadi 反問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mengajukan pertanyaan kembali sebagai tanggapan terhadap pertanyaan yang diterima.”", nodes: [{ jokugo: "反", arti: "berbalik, kembali" }, { jokugo: "問", arti: "bertanya, pertanyaan" }] },
        { word: "問答", penjelasan: "Hubungan makna antar kanji 問 dan 答 menjadi 問答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan saling bertanya dan menjawab mengenai suatu hal.”", nodes: [{ jokugo: "問", arti: "bertanya, pertanyaan" }, { jokugo: "答", arti: "menjawab, jawaban" }] },
        { word: "問題", penjelasan: "Hubungan makna antar kanji 問 dan 題 menjadi 問題, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “suatu hal yang menjadi persoalan atau masalah yang perlu dipikirkan dan diselesaikan.”", nodes: [{ jokugo: "問", arti: "pertanyaan, masalah" }, { jokugo: "題", arti: "topik, pokok persoalan" }] },
        { word: "設問", penjelasan: "Hubungan makna antar kanji 設 dan 問 menjadi 設問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pertanyaan atau soal yang disusun dan diberikan untuk dijawab.”", nodes: [{ jokugo: "設", arti: "menyusun, menetapkan" }, { jokugo: "問", arti: "pertanyaan, soal" }] },
        { word: "試問", penjelasan: "Hubungan makna antar kanji 試 dan 問 menjadi 試問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengujian yang dilakukan dengan memberikan pertanyaan kepada seseorang”, sehingga mengandung makna ujian lisan.", nodes: [{ jokugo: "試", arti: "mencoba, menguji" }, { jokugo: "問", arti: "bertanya, pertanyaan" }] },
        { word: "難問", penjelasan: "Hubungan makna antar kanji 難 dan 問 menjadi 難問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pertanyaan atau soal yang sulit untuk dijawab atau diselesaikan.”", nodes: [{ jokugo: "難", arti: "sulit, kesulitan" }, { jokugo: "問", arti: "pertanyaan, soal" }] },
        { word: "問診", penjelasan: "Hubungan makna antar kanji 問 dan 診 menjadi 問診, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menanyakan kondisi atau gejala seseorang untuk keperluan pemeriksaan dan diagnosis medis.”", nodes: [{ jokugo: "問", arti: "bertanya, menanyakan" }, { jokugo: "診", arti: "memeriksa, mendiagnosis" }] },
        { word: "検問", penjelasan: "Hubungan makna antar kanji 検 dan 問 menjadi 検問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “melakukan pemeriksaan atau pengecekan terhadap seseorang atau sesuatu, termasuk dengan menanyakan keterangan.”", nodes: [{ jokugo: "検", arti: "memeriksa, mengecek" }, { jokugo: "問", arti: "bertanya, menanyakan" }] },
        { word: "問責", penjelasan: "Hubungan makna antar kanji 問 dan 責 menjadi 問責, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “mempertanyakan dan meminta seseorang bertanggung jawab atas suatu tindakan atau keadaan.”", nodes: [{ jokugo: "問", arti: "mempertanyakan, meminta penjelasan" }, { jokugo: "責", arti: "tanggung jawab, kewajiban" }] },
        { word: "不問", penjelasan: "Hubungan makna antar kanji 不 dan 問 menjadi 不問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tidak mempertanyakan atau tidak mempermasalahkan suatu hal.”", nodes: [{ jokugo: "不", arti: "tidak" }, { jokugo: "問", arti: "mempertanyakan, mempermasalahkan" }] },
        { word: "訪問", penjelasan: "Hubungan makna antar kanji 訪 dan 問 menjadi 訪問, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tindakan mendatangi atau mengunjungi seseorang maupun suatu tempat.”", nodes: [{ jokugo: "訪", arti: "mengunjungi, mendatangi" }, { jokugo: "問", arti: "mengunjungi, menengok" }] }
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
        { word: "回答", reading: "かいとう", meaning: "jawaban" },
        { word: "応答", reading: "おうとう", meaning: "tanggapan, respons" },
        { word: "返答", reading: "へんとう", meaning: "jawaban, balasan" },
        { word: "問答", reading: "もんどう", meaning: "tanya jawab" },
        { word: "自答", reading: "じとう", meaning: "menjawab sendiri" },
        { word: "答弁", reading: "とうべん", meaning: "jawaban, penjelasan resmi" },
        { word: "解答", reading: "かいとう", meaning: "jawaban, penyelesaian" },
        { word: "答案", reading: "とうあん", meaning: "jawaban, lembar jawaban" },
        { word: "正答", reading: "せいとう", meaning: "jawaban benar" },
        { word: "確答", reading: "かくとう", meaning: "jawaban yang pasti" },
        { word: "口答", reading: "こうとう", meaning: "jawaban lisan" },
        { word: "直答", reading: "ちょくとう", meaning: "jawaban langsung" },
        { word: "筆答", reading: "ひっとう", meaning: "jawaban tertulis" },
        { word: "答辞", reading: "とうじ", meaning: "ucapan, pidato balasan" },
        { word: "答礼", reading: "とうれい", meaning: "membalas penghormatan" }
      ],
      semanticRelations: [
        { word: "回答", penjelasan: "Hubungan makna antar kanji 回 dan 答, menunjukan bahwa gabungan kedua kanji itu mengandung makna “jawaban yang diberikan terhadap suatu pertanyaan atau permintaan informasi”.", nodes: [{ jokugo: "回", arti: "mengembalikan" }, { jokugo: "答", arti: "jawaban" }] },
        { word: "応答", penjelasan: "Hubungan makna antar kanji 応 dan 答, menunjukan bahwa gabungan kedua kanji itu mengandung makna “respons yang diberikan terhadap pertanyaan, panggilan, atau komunikasi”", nodes: [{ jokugo: "応", arti: "menanggapi" }, { jokugo: "答", arti: "jawaban" }] },
        { word: "返答", penjelasan: "Hubungan makna antara kanji 返 dan 答 menjadi 返答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memberikan jawaban atau balasan kembali kepada orang lain.”", nodes: [{ jokugo: "返", arti: "mengembalikan, membalas" }, { jokugo: "答", arti: "menjawab, jawaban" }] },
        { word: "問答", penjelasan: "Hubungan makna antara kanji 問 dan 答 menjadi 問答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan bertanya dan menjawab antara dua pihak.”", nodes: [{ jokugo: "問", arti: "bertanya, pertanyaan" }, { jokugo: "答", arti: "menjawab, jawaban" }] },
        { word: "自答", penjelasan: "Hubungan makna antara kanji 自 dan 答 menjadi 自答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “menjawab sendiri terhadap pertanyaan atau persoalan yang dipikirkan.”", nodes: [{ jokugo: "自", arti: "diri sendiri" }, { jokugo: "答", arti: "menjawab, jawaban" }] },
        { word: "答弁", penjelasan: "Hubungan makna antara kanji 答 dan 弁 menjadi 答弁, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memberikan jawaban atau penjelasan terhadap pertanyaan, terutama dalam situasi resmi.”", nodes: [{ jokugo: "答", arti: "menjawab, jawaban" }, { jokugo: "弁", arti: "menjelaskan, menyampaikan dengan kata-kata" }] },
        { word: "解答", penjelasan: "Hubungan makna antara kanji 解 dan 答 menjadi 解答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “jawaban yang diperoleh melalui proses memecahkan atau menyelesaikan suatu persoalan.”", nodes: [{ jokugo: "解", arti: "memecahkan, menjelaskan" }, { jokugo: "答", arti: "jawaban" }] },
        { word: "答案", penjelasan: "Hubungan makna antar kanji 答 dan 案, menunjukan bahwa gabungan kedua kanji itu mengandung makna “lembar jawaban untuk menuliskan jawaban dalam ujian atau latihan”", nodes: [{ jokugo: "答", arti: "jawaban" }, { jokugo: "案", arti: "naskah" }] },
        { word: "正答", penjelasan: "Hubungan makna antar kanji 正 dan 答 menjadi 正答, menunjukan bahwa gabungan kedua kanji tersebut membentuk makna “jawaban yang benar atau tepat.”", nodes: [{ jokugo: "正", arti: "benar" }, { jokugo: "答", arti: "jawaban" }] },
        { word: "確答", penjelasan: "Hubungan makna antara kanji 確 dan 答 menjadi 確答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “jawaban yang pasti dan jelas.”", nodes: [{ jokugo: "確", arti: "pasti, jelas" }, { jokugo: "答", arti: "jawaban" }] },
        { word: "口答", penjelasan: "Hubungan makna antara kanji 口 dan 答 menjadi 口答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memberikan jawaban secara lisan.”", nodes: [{ jokugo: "口", arti: "mulut, lisan" }, { jokugo: "答", arti: "menjawab, jawaban" }] },
        { word: "直答", penjelasan: "Hubungan makna antara kanji 直 dan 答 menjadi 直答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memberikan jawaban secara langsung.”", nodes: [{ jokugo: "直", arti: "langsung, tanpa perantara" }, { jokugo: "答", arti: "menjawab, jawaban" }] },
        { word: "筆答", penjelasan: "Hubungan makna antara kanji 筆 dan 答 menjadi 筆答, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “memberikan jawaban melalui tulisan.”", nodes: [{ jokugo: "筆", arti: "pena, tulisan" }, { jokugo: "答", arti: "menjawab, jawaban" }] },
        { word: "答辞", penjelasan: "Hubungan makna antara kanji 答 dan 辞 menjadi 答辞, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “ucapan atau pidato yang disampaikan sebagai balasan terhadap ucapan dari pihak lain.”", nodes: [{ jokugo: "答", arti: "menjawab, membalas" }, { jokugo: "辞", arti: "kata-kata, ucapan" }] },
        { word: "答礼", penjelasan: "Hubungan makna antara kanji 答 dan 礼 menjadi 答礼, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “membalas salam, penghormatan, atau kesopanan yang diterima dari orang lain.”", nodes: [{ jokugo: "答", arti: "menjawab, membalas" }, { jokugo: "礼", arti: "salam, penghormatan" }] }
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
