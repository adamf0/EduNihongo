import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const katakanaRomajiMap: Record<string, string> = {
  'ア':'A','イ':'I','ウ':'U','エ':'E','オ':'O',
  'カ':'Ka','キ':'Ki','ク':'Ku','ケ':'Ke','コ':'Ko',
  'サ':'Sa','シ':'Shi','ス':'Su','セ':'Se','ソ':'So',
  'タ':'Ta','チ':'Chi','ツ':'Tsu','テ':'Te','ト':'To',
  'ナ':'Na','ニ':'Ni','ヌ':'Nu','ネ':'Ne','ノ':'No',
  'ハ':'Ha','ヒ':'Hi','フ':'Fu','ヘ':'He','ホ':'Ho',
  'マ':'Ma','ミ':'Mi','ム':'Mu','メ':'Me','モ':'Mo',
  'ヤ':'Ya','ユ':'Yu','ヨ':'Yo',
  'ラ':'Ra','リ':'Ri','ル':'Ru','レ':'Re','ロ':'Ro',
  'ワ':'Wa','ヲ':'Wo','ン':'N',
  'ガ':'Ga','ギ':'Gi','グ':'Gu','ゲ':'Ge','ゴ':'Go',
  'ザ':'Za','ジ':'Ji','ズ':'Zu','ゼ':'Ze','ゾ':'Zo',
  'ダ':'Da','ヂ':'Ji','ヅ':'Zu','デ':'De','ド':'Do',
  'バ':'Ba','ビ':'Bi','ブ':'Bu','ベ':'Be','ボ':'Bo',
  'パ':'Pa','ピ':'Pi','プ':'Pu','ペ':'Pe','ポ':'Po',
  'キャ':'Kya','キュ':'Kyu','キョ':'Kyo',
  'シャ':'Sha','シュ':'Shu','ショ':'Sho',
  'チャ':'Cha','チュ':'Chu','チョ':'Cho',
  'ニャ':'Nya','ニュ':'Nyu','ニョ':'Nyo',
  'ヒャ':'Hya','ヒュ':'Hyu','ヒョ':'Hyo',
  'ミャ':'Mya','ミュ':'Myu','ミョ':'Myo',
  'リャ':'Rya','リュ':'Ryu','リョ':'Ryo',
  'ギャ':'Gya','ギュ':'Gyu','ギョ':'Gyo',
  'ジャ':'Ja','ジュ':'Ju','ジョ':'Jo',
  'ビャ':'Bya','ビュ':'Byu','ビョ':'Byo',
  'ピャ':'Pya','ピュ':'Pyu','ピョ':'Pyo',
  'あ':'A','い':'I','う':'U','え':'E','お':'O',
  'か':'Ka','き':'Ki','く':'Ku','け':'Ke','こ':'Ko',
  'さ':'Sa','し':'Shi','す':'Su','せ':'Se','そ':'So',
  'た':'Ta','ち':'Chi','つ':'Tsu','て':'Te','と':'To',
  'な':'Na','に':'Ni','ぬ':'Nu','ね':'Ne','の':'No',
  'は':'Ha','ひ':'Hi','ふ':'Fu','へ':'He','ほ':'Ho',
  'ま':'Ma','み':'Mi','む':'Mu','め':'Me','も':'Mo',
  'や':'Ya','ゆ':'Yu','よ':'Yo',
  'ら':'Ra','り':'Ri','る':'Ru','れ':'Re','ろ':'Ro',
  'わ':'Wa','を':'Wo','ん':'N',
};

function toRomaji(str: string): string {
  if (!str || str === '-') return '-';
  const clean = str.split('、')[0].split('.')[0].split('（')[0].trim();
  let rom = '';
  let i = 0;
  while (i < clean.length) {
    if (i + 1 < clean.length && katakanaRomajiMap[clean.substring(i, i + 2)]) {
      rom += katakanaRomajiMap[clean.substring(i, i + 2)];
      i += 2;
    } else if (katakanaRomajiMap[clean[i]]) {
      rom += katakanaRomajiMap[clean[i]];
      i++;
    } else {
      i++;
    }
  }
  if (rom) return rom.charAt(0).toUpperCase() + rom.slice(1).toLowerCase();
  return '-';
}

const indonesianDictionary: Record<string, { meaning: string; baseMeaning: string }> = {
  "一": { meaning: "Satu", baseMeaning: "Angka satu atau kesatuan" },
  "不": { meaning: "Tidak / Bukan", baseMeaning: "Awalan negatif yang berarti tidak atau bukan" },
  "与": { meaning: "Memberi / Menyediakan", baseMeaning: "Memberikan, menganugerahkan, atau berperan" },
  "世": { meaning: "Dunia / Zaman", baseMeaning: "Dunia, masyarakat, atau era generasi" },
  "中": { meaning: "Tengah / Dalam", baseMeaning: "Bagian tengah, di dalam, atau sedang berlangsung" },
  "主": { meaning: "Utama / Pemilik / Tuan", baseMeaning: "Yang utama, pemilik, atau pemimpin" },
  "乗": { meaning: "Naik Kendaraan", baseMeaning: "Naik atau menumpangi kendaraan" },
  "予": { meaning: "Sebelumnya / Memprediksi", baseMeaning: "Sebelumnya, persiapan, atau perkiraan" },
  "事": { meaning: "Hal / Urusan / Kejadian", baseMeaning: "Hal, peristiwa, pekerjaan, atau urusan" },
  "人": { meaning: "Orang / Manusia", baseMeaning: "Manusia, orang, atau perorangan" },
  "今": { meaning: "Sekarang", baseMeaning: "Waktu sekarang atau saat ini" },
  "伐": { meaning: "Menebang / Memotong", baseMeaning: "Menebang pohon atau memotong" },
  "会": { meaning: "Bertemu / Perkumpulan", baseMeaning: "Bertemu orang atau organisasi/perkumpulan" },
  "体": { meaning: "Tubuh / Badan", baseMeaning: "Tubuh manusia, wujud, atau bentuk" },
  "作": { meaning: "Membuat / Karya", baseMeaning: "Membuat, menciptakan, atau hasil karya" },
  "保": { meaning: "Menjaga / Mempertahankan", baseMeaning: "Menjaga, melindungi, atau mempertahankan" },
  "修": { meaning: "Memperbaiki / Mempelajari", baseMeaning: "Memperbaiki, melatih, atau mendalami" },
  "像": { meaning: "Patung / Gambar / Bayangan", baseMeaning: "Gambar, rupa, atau citra visual" },
  "入": { meaning: "Masuk / Memasukkan", baseMeaning: "Masuk atau berada di dalam" },
  "共": { meaning: "Bersama / Sama-sama", baseMeaning: "Bersama-sama atau kepemilikan bersama" },
  "公": { meaning: "Umum / Publik", baseMeaning: "Masyarakat umum, resmi, atau publik" },
  "写": { meaning: "Disalin / Diphoto", baseMeaning: "Menyalin, memotret, atau menggambarkan" },
  "出": { meaning: "Keluar / Menerbitkan", baseMeaning: "Keluar dari dalam atau menghasilkan" },
  "力": { meaning: "Kekuatan / Tenaga", baseMeaning: "Kekuatan fisik, daya, atau kemampuan" },
  "功": { meaning: "Jasa / Keberhasilan", baseMeaning: "Hasil pencapaian, prestasi, atau jasa" },
  "労": { meaning: "Kerja Keras / Usaha", baseMeaning: "Kerja keras, usaha, atau kelelahan" },
  "動": { meaning: "Bergerak", baseMeaning: "Bergerak, beraksi, atau berpindah" },
  "勤": { meaning: "Bekerja / Didegikasikan", baseMeaning: "Bekerja rajin atau bertugas" },
  "去": { meaning: "Pergi / Berlalu", baseMeaning: "Pergi meninggalkan atau waktu masa lalu" },
  "参": { meaning: "Ikut Serta / Berkunjung", baseMeaning: "Hadir, berpartisipasi, atau berkunjung" },
  "友": { meaning: "Teman / Sahabat", baseMeaning: "Teman, sahabat, atau persahabatan" },
  "取": { meaning: "Mengambil", baseMeaning: "Mengambil, memperoleh, atau memegang" },
  "口": { meaning: "Mulut / Lubang", baseMeaning: "Mulut, pintu masuk, atau lubang" },
  "古": { meaning: "Lama / Kuno", baseMeaning: "Tua, antik, atau masa lampau" },
  "号": { meaning: "Nomor / Tanda", baseMeaning: "Angka urutan, sebutan, atau sinyal" },
  "合": { meaning: "Cocok / Bergabung", baseMeaning: "Menjadi satu, cocok, atau sesuai" },
  "同": { meaning: "Sama", baseMeaning: "Sama, serupa, atau bersama-sama" },
  "名": { meaning: "Nama / Terkenal", baseMeaning: "Nama diri, sebutan, atau reputasi" },
  "向": { meaning: "Menghadap / Arah", baseMeaning: "Menghadap ke suatu arah atau tujuan" },
  "告": { meaning: "Memberitahu / Mengumumkan", baseMeaning: "Menyampaikan informasi atau mengumumkan" },
  "味": { meaning: "Rasa", baseMeaning: "Sensasi rasa lidah atau makna/kesan" },
  "和": { meaning: "Damai / Jepang", baseMeaning: "Kedamaian, keharmonisan, atau khas Jepang" },
  "品": { meaning: "Barang / Kualitas", baseMeaning: "Barang, barang jadi, atau mutu" },
  "員": { meaning: "Anggota", baseMeaning: "Anggota kelompok atau personel" },
  "営": { meaning: "Mengelola / Menjalankan", baseMeaning: "Menjalankan usaha atau mengelola kegiatan" },
  "回": { meaning: "Kali / Berputar", baseMeaning: "Jumlah frekuensi atau mengelilingi" },
  "国": { meaning: "Negara", baseMeaning: "Negara, wilayah pemerintahan" },
  "地": { meaning: "Tanah / Tempat", baseMeaning: "Permukaan bumi, wilayah, atau landasan" },
  "場": { meaning: "Tempat / Lokasi", baseMeaning: "Lokasi kejadian, arena, atau tempat" },
  "境": { meaning: "Batas / Lingkungan", baseMeaning: "Garis perbatasan atau situasi sekitar" },
  "夢": { meaning: "Mimpi", baseMeaning: "Mimpi waktu tidur atau cita-cita" },
  "大": { meaning: "Besar", baseMeaning: "Ukuran besar, hebat, atau utama" },
  "妥": { meaning: "Tepat / Kompromi", baseMeaning: "Sesuai, layak, atau bersepakat" },
  "子": { meaning: "Anak", baseMeaning: "Anak-anak, keturunan, atau partikel kecil" },
  "字": { meaning: "Huruf / Karakter", baseMeaning: "Simbol tulisan, huruf, atau kata" },
  "学": { meaning: "Belajar / Ilmu", baseMeaning: "Mempelajari, menuntut ilmu, atau sekolah" },
  "完": { meaning: "Sempurna / Selesai", baseMeaning: "Lengkap, tuntas, atau tanpa kekurangan" },
  "定": { meaning: "Menentukan / Tetap", baseMeaning: "Menetapkan, tidak berubah, atau pasti" },
  "室": { meaning: "Ruangan", baseMeaning: "Kamar atau ruangan tertutup" },
  "宿": { meaning: "Penginapan / Tugas", baseMeaning: "Tempat menginap atau rumah tinggal" },
  "審": { meaning: "Memeriksa / Menilai", baseMeaning: "Mengkaji teliti atau menyidangkan" },
  "尋": { meaning: "Bertanya / Mencari", baseMeaning: "Menanyakan atau menelusuri" },
  "小": { meaning: "Kecil", baseMeaning: "Ukuran kecil, sedikit, atau muda" },
  "履": { meaning: "Memakai Sepatu / Menjalani", baseMeaning: "Mengenakan alas kaki atau riwayat proses" },
  "布": { meaning: "Kain / Menyebarkan", baseMeaning: "Kain tenun atau menyebarkan secara meluas" },
  "常": { meaning: "Biasa / Selalu", baseMeaning: "Kondisi umum, lazim, atau terus-menerus" },
  "度": { meaning: "Derajat / Tingkat / Kali", baseMeaning: "Tingkatan, batas, atau frekuensi" },
  "弁": { meaning: "Pembicaraan / Katup / Dialek", baseMeaning: "Berbicara, pidato, atau pembeda" },
  "形": { meaning: "Bentuk / Wujud", baseMeaning: "Bentuk fisik, wujud, atau penampilan" },
  "待": { meaning: "Menunggu", baseMeaning: "Nanti, menantikan, atau menyambut" },
  "得": { meaning: "Mendapatkan / Keuntungan", baseMeaning: "Obtain, meraih, atau menguntungkan" },
  "御": { meaning: "Hormat / Mengendalikan", baseMeaning: "Prefiks awalan halus/sopan atau memimpin" },
  "応": { meaning: "Merespons / Sesuai", baseMeaning: "Menjawab, bereaksi, atau menyesuaikan" },
  "思": { meaning: "Berpikir / Merasa", baseMeaning: "Memikirkan, membayangkan, atau berpendapat" },
  "恋": { meaning: "Cinta / Rindu", baseMeaning: "Perasaan asmara, kasmaran, atau rindu" },
  "悟": { meaning: "Paham / Kesadaran", baseMeaning: "Menyadari pencerahan atau memahami" },
  "慮": { meaning: "Pertimbangan / Dikirakan", baseMeaning: "Pertimbangan matang atau perhatian" },
  "所": { meaning: "Tempat", baseMeaning: "Lokasi fisik atau titik keadaan" },
  "手": { meaning: "Tangan", baseMeaning: "Tangan, keahlian, atau cara" },
  "承": { meaning: "Menerima / Menyetujui", baseMeaning: "Menerima tugas, menyetujui, atau mendengarkan" },
  "授": { meaning: "Mengajar / Memberikan", baseMeaning: "Memberikan pelajaran atau menganugerahi" },
  "採": { meaning: "Mengambil / Memilih", baseMeaning: "Memilih, memetik, atau mengadopsi" },
  "探": { meaning: "Mencari / Menjelajah", baseMeaning: "Mencari benda hilang atau menyelidiki" },
  "提": { meaning: "Mengajukan / Membawa", baseMeaning: "Mengajukan usul, membawa, atau menyajikan" },
  "放": { meaning: "Melepas / Menyebarkan", baseMeaning: "Melepaskan, membiarkan, atau memancarkan" },
  "散": { meaning: "Berserakan / Jalan-jalan", baseMeaning: "Menyebar, menyebar luas, atau santai" },
  "数": { meaning: "Angka / Jumlah", baseMeaning: "Angka hitungan, jumlah, atau beberapa" },
  "整": { meaning: "Merapikan / Teratur", baseMeaning: "Menata dengan rapi atau menyelaraskan" },
  "文": { meaning: "Kalimat / Teks / Sastra", baseMeaning: "Tulisan, susunan kata, atau kebudayaan" },
  "料": { meaning: "Bahan / Biaya", baseMeaning: "Bahan baku, tarif biaya, atau takaran" },
  "日": { meaning: "Hari / Matahari", baseMeaning: "Matahari, hari, atau tanggal" },
  "時": { meaning: "Waktu / Jam", baseMeaning: "Waktu, saat, jam, atau masa" },
  "更": { meaning: "Memperbarui / Makin", baseMeaning: "Mengubah menjadi baru atau bertambah" },
  "書": { meaning: "Menulis / Buku", baseMeaning: "Menulis pesan, dokumen, atau buku" },
  "望": { meaning: "Berharap / Memandang", baseMeaning: "Harapan, cita-cita, atau melihat jauh" },
  "本": { meaning: "Buku / Utama / Asal", baseMeaning: "Buku, sumber utama, atau asal mula" },
  "材": { meaning: "Bahan / Bakat", baseMeaning: "Bahan bangunan atau potensi kemampuan" },
  "根": { meaning: "Akar / Dasar", baseMeaning: "Akar tanaman atau pangkal dasar" },
  "格": { meaning: "Kualifikasi / Status", baseMeaning: "Standar, kedudukan, atau aturan" },
  "案": { meaning: "Rencana / Ide", baseMeaning: "Rancangan usulan, gagasan, atau draf" },
  "検": { meaning: "Memeriksa / Meneliti", baseMeaning: "Memeriksa kebenaran atau menguji" },
  "極": { meaning: "Puncak / Sangat", baseMeaning: "Titik tertinggi, kutub, atau amat sangat" },
  "機": { meaning: "Mesin / Kesempatan", baseMeaning: "Peralatan mesin atau peluang momen" },
  "正": { meaning: "Benar / Tepat", baseMeaning: "Kebenaran, lurus, atau tepat" },
  "歩": { meaning: "Berjalan", baseMeaning: "Melangkahkan kaki atau kemajuan" },
  "水": { meaning: "Air", baseMeaning: "Zat cair air" },
  "決": { meaning: "Memutuskan", baseMeaning: "Menentukan pilihan atau menetapkan" },
  "注": { meaning: "Menuang / Memperhatikan", baseMeaning: "Menuangkan cairan atau memusatkan perhatian" },
  "減": { meaning: "Berkurang / Mengurangi", baseMeaning: "Menjadi sedikit atau memangkas" },
  "演": { meaning: "Tampil / Memerankan", baseMeaning: "Pertunjukan seni, pidato, atau memerankan" },
  "灯": { meaning: "Lampu / Cahaya", baseMeaning: "Lampu penerangan atau api penerang" },
  "特": { meaning: "Khusus / Istimewa", baseMeaning: "Istimewa, beda dari yang lain" },
  "犬": { meaning: "Anjing", baseMeaning: "Hewan anjing" },
  "状": { meaning: "Kondisi / Surat", baseMeaning: "Keadaan fisik/situasi atau dokumen" },
  "玄": { meaning: "Gelap / Misterius / Pintu", baseMeaning: "Mendalam, misterius, atau lorong masuk" },
  "率": { meaning: "Rasio / Memimpin", baseMeaning: "Persentase perbandingan atau memimpin" },
  "現": { meaning: "Muncul / Nyata / Sekarang", baseMeaning: "Tampak jelas, kenyataan saat ini" },
  "環": { meaning: "Lingkaran / Lingkungan", baseMeaning: "Cincin melingkar atau sekeliling" },
  "生": { meaning: "Hidup / Mentah", baseMeaning: "Kehidupan, lahir, tumbuh, atau segar" },
  "産": { meaning: "Melahirkan / Menghasilkan", baseMeaning: "Melahirkan keturunan atau memproduksi" },
  "由": { meaning: "Alasan / Asal", baseMeaning: "Sebab alasan atau kebebasan" },
  "申": { meaning: "Mengatakan / Mengajukan", baseMeaning: "Menjelaskan dengan sopan atau mendaftar" },
  "界": { meaning: "Dunia / Batas", baseMeaning: "Batasan wilayah atau alam sekitar" },
  "番": { meaning: "Giliran / Nomor", baseMeaning: "Urutan giliran atau nomor penjagaan" },
  "白": { meaning: "Putih", baseMeaning: "Warna putih atau murni/jujur" },
  "目": { meaning: "Mata / Poin", baseMeaning: "Indra penglihatan atau poin urutan" },
  "相": { meaning: "Saling / Sisi / Menteri", baseMeaning: "Saling berinteraksi atau wujud muka" },
  "着": { meaning: "Tiba / Memakai", baseMeaning: "Tiba di tujuan atau memakai pakaian" },
  "知": { meaning: "Tahu / Mengetahui", baseMeaning: "Memahami informasi atau kenal" },
  "確": { meaning: "Pasti / Yakin", baseMeaning: "Kepastian, nyata, atau konfirmasi" },
  "磨": { meaning: "Menggosok / Mengasah", baseMeaning: "Menggosok gigi/benda atau melatih skill" },
  "示": { meaning: "Menunjukkan", baseMeaning: "Perlihatkan atau petunjuk" },
  "社": { meaning: "Perusahaan / Kuil", baseMeaning: "Perusahaan bisnis atau masyarakat" },
  "立": { meaning: "Berdiri / Mendirikan", baseMeaning: "Berdiri tegak atau membangun" },
  "粧": { meaning: "Dandan / Rias", baseMeaning: "Mendandani diri atau kosmetik" },
  "紙": { meaning: "Kertas", baseMeaning: "Lembaran kertas" },
  "終": { meaning: "Selesai / Akhir", baseMeaning: "Berakhir, tamat, atau penutup" },
  "統": { meaning: "Menyatukan / Memimpin", baseMeaning: "Menggabungkan sistem atau mengontrol" },
  "編": { meaning: "Mengedit / Menyusun", baseMeaning: "Menenun, menyusun buku, atau mengedit" },
  "織": { meaning: "Menenun / Kain", baseMeaning: "Menenun benang atau struktur kain" },
  "美": { meaning: "Indah / Cantik", baseMeaning: "Keindahan estetika atau kebaikan" },
  "義": { meaning: "Keadilan / Arti", baseMeaning: "Kebenaran moral, keadilan, atau makna" },
  "者": { meaning: "Orang", baseMeaning: "Orang yang melakukan suatu hal" },
  "聴": { meaning: "Mendengar", baseMeaning: "Mendengarkan dengan saksama" },
  "能": { meaning: "Kemampuan / Bakat", baseMeaning: "Kapasitas potensi atau keahlian" },
  "臓": { meaning: "Organ Dalam", baseMeaning: "Organ dalam tubuh manusia/hewan" },
  "自": { meaning: "Diri Sendiri", baseMeaning: "Diri pribadi atau secara otomatis" },
  "芸": { meaning: "Seni / Keterampilan", baseMeaning: "Kesenian, pertunjukan, atau bakat" },
  "薬": { meaning: "Obat", baseMeaning: "Bahan penyembuh atau zat kimia" },
  "行": { meaning: "Pergi / Melakukan", baseMeaning: "Melangkah pergi atau melaksanakan tindakan" },
  "表": { meaning: "Tabel / Depan / Mengungkapkan", baseMeaning: "Permukaan luar, bagan tabel, atau mengekspresikan" },
  "被": { meaning: "Menderita / Dikenai", baseMeaning: "Menerima efek, menderita, atau mengalami" },
  "製": { meaning: "Buatan / Produksi", baseMeaning: "Proses memproduksi atau buatan" },
  "要": { meaning: "Penting / Perlu", baseMeaning: "Dibutuhkan, hal utama, atau penting" },
  "視": { meaning: "Melihat / Memandang", baseMeaning: "Penglihatan indra atau sudut pandang" },
  "覧": { meaning: "Melihat / Membaca", baseMeaning: "Melihat-lihat atau membaca dokumen" },
  "観": { meaning: "Mengamati / Pemandangan", baseMeaning: "Mengamati detail atau pandangan hidup" },
  "言": { meaning: "Bicara / Kata", baseMeaning: "Mengucapkan kata atau ucapan" },
  "訪": { meaning: "Berkunjung", baseMeaning: "Mendatangi tempat atau mengunjungi orang" },
  "設": { meaning: "Mendirikan / Menyiapkan", baseMeaning: "Membangun fasilitas atau merencanakan" },
  "診": { meaning: "Memeriksa Medis", baseMeaning: "Pemeriksaan dokter/kesehatan" },
  "評": { meaning: "Menilai / Ulasan", baseMeaning: "Kritik, ulasan, atau evaluasi" },
  "話": { meaning: "Bicara / Cerita", baseMeaning: "Percakapan, omongan, atau kisah" },
  "読": { meaning: "Membaca", baseMeaning: "Membaca teks tulisan" },
  "課": { meaning: "Seksi / Bab / Tugas", baseMeaning: "Bagian divisi kerja atau bab pelajaran" },
  "謝": { meaning: "Minta Maaf / Terima Kasih", baseMeaning: "Menyampaikan terima kasih atau permohonan maaf" },
  "資": { meaning: "Modal / Sumber Daya", baseMeaning: "Aset dana, bahan baku, atau kualifikasi" },
  "質": { meaning: "Kualitas / Pertanyaan", baseMeaning: "Mutu kualitas atau substansi pertanyaan" },
  "起": { meaning: "Bangun / Terjadi", baseMeaning: "Bangkit tidur atau munculnya kejadian" },
  "車": { meaning: "Mobil / Roda", baseMeaning: "Kendaraan roda atau mobil" },
  "返": { meaning: "Kembali / Membalas", baseMeaning: "Mengembalikan atau memberikan balasan" },
  "述": { meaning: "Menjelaskan / Menyatakan", baseMeaning: "Menguraikan pendapat atau menjelaskan" },
  "追": { meaning: "Mengejar / Menyusul", baseMeaning: "Berlari mengejar atau menyusul" },
  "退": { meaning: "Mundur / Keluar", baseMeaning: "Mundur dari posisi atau keluar" },
  "通": { meaning: "Melewati / Melintas", baseMeaning: "Melewati jalan, berkomunikasi, atau lancar" },
  "連": { meaning: "Berhubung / Mengajak", baseMeaning: "Bersambungan, membawa serta, atau grup" },
  "道": { meaning: "Jalan / Cara", baseMeaning: "Jalan raya, lintasan, atau prinsip filosofi" },
  "達": { meaning: "Mencapai / Jamak (Kalian)", baseMeaning: "Tiba di tujuan atau akhiran jamak orang" },
  "配": { meaning: "Membagi / Khawatir", baseMeaning: "Mendistribusikan atau perhatian" },
  "重": { meaning: "Berat / Penting", baseMeaning: "Bobot berat, berlapis, atau krusial" },
  "金": { meaning: "Emas / Uang", baseMeaning: "Logam mulia emas atau uang belanja" },
  "長": { meaning: "Panjang / Pemimpin", baseMeaning: "Ukuran panjang atau kepala organisasi" },
  "開": { meaning: "Membuka", baseMeaning: "Membuka pintu/acara atau memulai" },
  "防": { meaning: "Mencegah / Bertahan", baseMeaning: "Menjaga dari bahaya atau mencegah" },
  "限": { meaning: "Batas", baseMeaning: "Batasan maksimal atau terhingga" },
  "雑": { meaning: "Campuran / Aneka", baseMeaning: "Bermacam-macam, bercampur, atau rumit" }
};

const kanjiBushuuMap: Record<string, string> = {
  "一": "一", "不": "一", "与": "一", "世": "一", "中": "丨", "主": "丶", "乗": "丿", "予": "亅",
  "事": "亅", "人": "人 (亻)", "今": "人", "伐": "人 (亻)", "会": "人", "体": "人 (亻)", "作": "人 (亻)",
  "保": "人 (亻)", "修": "人 (亻)", "像": "人 (亻)", "入": "入", "共": "八", "公": "八", "写": "冖",
  "出": "凵", "力": "力", "功": "力", "労": "力", "動": "力", "勤": "力", "去": "厶", "参": "厶",
  "友": "又", "取": "又", "口": "口", "古": "口", "号": "口", "合": "口", "同": "口", "名": "口",
  "向": "口", "告": "口", "味": "口", "和": "口", "品": "口", "員": "口", "営": "口", "回": "囗",
  "国": "囗", "地": "土", "場": "土", "境": "土", "夢": "夕", "大": "大", "妥": "女", "子": "子",
  "字": "宀", "学": "子", "完": "宀", "定": "宀", "室": "宀", "宿": "宀", "審": "宀", "尋": "寸",
  "小": "小", "履": "尸", "布": "巾", "常": "巾", "度": "广", "弁": "廾", "形": "彡", "待": "彳",
  "得": "彳", "御": "彳", "応": "心 (忄)", "思": "心 (忄)", "恋": "心 (心)", "悟": "心 (忄)", "慮": "心 (忄)",
  "所": "戸", "手": "手 (扌)", "承": "手", "授": "手 (扌)", "採": "手 (扌)", "探": "手 (扌)", "提": "手 (扌)",
  "放": "攴 (攵)", "散": "攴 (攵)", "数": "攴 (攵)", "整": "攴 (攵)", "文": "文", "料": "斗", "日": "日",
  "時": "日", "更": "日", "書": "曰", "望": "月", "本": "木", "材": "木", "根": "木", "格": "木",
  "案": "木", "検": "木", "極": "木", "機": "木", "正": "止", "歩": "止", "水": "水 (氵)", "決": "水 (氵)",
  "注": "水 (氵)", "減": "水 (氵)", "演": "水 (氵)", "灯": "火 (灬)", "特": "牛", "犬": "犬 (犭)", "状": "犬 (犭)",
  "玄": "玄", "率": "玄", "現": "玉 (王)", "環": "玉 (王)", "生": "生", "産": "生", "用": "用", "由": "田",
  "申": "田", "界": "田", "番": "田", "白": "白", "目": "目", "相": "目", "着": "羊", "知": "矢",
  "確": "石", "磨": "石", "示": "示 (礻)", "社": "示 (礻)", "立": "立", "粧": "米", "紙": "糸", "終": "糸",
  "統": "糸", "編": "糸", "織": "糸", "美": "羊", "義": "羊", "者": "老", "聴": "耳", "能": "肉 (月)",
  "臓": "肉 (月)", "自": "自", "芸": "艸 (艹)", "薬": "艸 (艹)", "行": "行", "表": "衣 (衤)", "被": "衣 (衤)",
  "製": "衣", "要": "覈", "視": "見", "覧": "見", "観": "見", "言": "言", "訪": "言", "設": "言",
  "診": "言", "評": "言", "話": "言", "読": "言", "課": "言", "謝": "言", "資": "貝", "質": "貝",
  "起": "走", "車": "車", "返": "辵 (⻌)", "述": "辵 (⻌)", "追": "辵 (⻌)", "退": "辵 (⻌)", "通": "辵 (⻌)",
  "連": "辵 (⻌)", "道": "辵 (⻌)", "達": "辵 (⻌)", "配": "酉", "重": "里", "金": "金", "長": "長",
  "開": "門", "防": "阜 (⻕)", "限": "阜 (⻕)", "雑": "隹", "食": "食 (飠)", "飲": "食 (飠)"
};

async function fetchKanjiInfo(char: string) {
  let onyomiStr = '-';
  let kunyomiStr = '-';
  try {
    const res = await fetch(`https://kanjiapi.dev/v1/kanji/${encodeURIComponent(char)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (res.ok) {
      const json = await res.json() as any;
      if (Array.isArray(json.on_readings) && json.on_readings.length > 0) {
        onyomiStr = json.on_readings.join('、');
      }
      if (Array.isArray(json.kun_readings) && json.kun_readings.length > 0) {
        kunyomiStr = json.kun_readings.map((r: string) => {
          if (r.includes('.')) {
            const p = r.split('.');
            return `${p[0]}（${p[1]}）`;
          }
          return r;
        }).join('、');
      }
    }
  } catch (e) {}

  const romaji = toRomaji(onyomiStr !== '-' ? onyomiStr : kunyomiStr);
  const dict = indonesianDictionary[char] || {
    meaning: `Karakter Kanji ${char}`,
    baseMeaning: `Makna dan definisi dasar kanji ${char}`
  };
  const bushuu = kanjiBushuuMap[char] || char;

  return {
    char,
    romaji,
    meaning: dict.meaning,
    baseMeaning: dict.baseMeaning,
    bushuu,
    onyomi: onyomiStr,
    kunyomi: kunyomiStr,
  };
}

async function enrichAllKanji() {
  console.log("=== Memulai Pengisian Data Kanji Cepat (id >= 2588) ===");

  const targetKanjis = await prisma.kanji.findMany({
    where: { id: { gte: 2588 } },
  });

  console.log(`Ditemukan ${targetKanjis.length} baris Kanji yang perlu dilengkapi.`);

  // Process in batches of 25 concurrent requests
  const BATCH_SIZE = 25;
  let updatedCount = 0;

  for (let i = 0; i < targetKanjis.length; i += BATCH_SIZE) {
    const batch = targetKanjis.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map(k => fetchKanjiInfo(k.character)));

    for (let j = 0; j < batch.length; j++) {
      const k = batch[j];
      const info = results[j];

      await prisma.kanji.update({
        where: { id: k.id },
        data: {
          romaji: info.romaji,
          meaning: info.meaning,
          baseMeaning: info.baseMeaning,
          bushuu: info.bushuu,
          onyomi: info.onyomi,
          kunyomi: info.kunyomi,
        }
      });
      updatedCount++;
    }
  }

  console.log(`Berhasil memperbarui ${updatedCount} baris Kanji di database!`);
}

enrichAllKanji()
  .catch((e) => {
    console.error("Gagal melengkapi data Kanji:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
