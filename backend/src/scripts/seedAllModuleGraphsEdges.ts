import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CrossLinkRule {
  source: string;
  target: string;
  predicate: string;
}

const ALL_GRAPH_EDGES_DATA: Record<string, CrossLinkRule[]> = {
  // ==================== MODUL 1 ====================
  "試": [
    { source: "試験", target: "入試", predicate: "jenis ujian" },
    { source: "試験", target: "試問", predicate: "metode pengujian" },
    { source: "試験", target: "追試", predicate: "ujian susulan" },
    { source: "試着", target: "試用", predicate: "mirip penggunaan" },
    { source: "試用", target: "試乗", predicate: "sejenis uji coba" },
    { source: "試食", target: "試飲", predicate: "pasangan uji rasa" },
    { source: "試作", target: "試製", predicate: "tahapan produksi" },
    { source: "試聴", target: "試写", predicate: "media pratingkat" },
    { source: "試写", target: "試読", predicate: "uji baca pratingkat" },
    { source: "試合", target: "試技", predicate: "kegiatan keahlian" },
    { source: "試薬", target: "試用", predicate: "bahan uji coba" },
    { source: "試練", target: "試験", predicate: "cobaan ketahanan" },
    { source: "試射", target: "試技", predicate: "uji tembak keahlian" }
  ],
  "験": [
    { source: "試験", target: "受験", predicate: "proses pengujian" },
    { source: "経験", target: "体験", predicate: "mirip makna pengalaman" },
    { source: "実験", target: "治験", predicate: "pengujian medis ilmiah" },
    { source: "試験", target: "実験", predicate: "metode pembuktian" },
    { source: "験算", target: "実験", predicate: "verifikasi hitungan" },
    { source: "効験", target: "治験", predicate: "efektivitas obat" }
  ],
  "問": [
    { source: "質問", target: "問題", predicate: "berkaitan pertanyaan" },
    { source: "設問", target: "問題", predicate: "unsur pembuatan soal" },
    { source: "問答", target: "自問", predicate: "interaksi tanya jawab" },
    { source: "問診", target: "検問", predicate: "prosedur pemeriksaan" },
    { source: "試問", target: "発問", predicate: "pengujian lisan" },
    { source: "難問", target: "問題", predicate: "soal tingkat tinggi" },
    { source: "反問", target: "問答", predicate: "sanggahan tanya jawab" },
    { source: "訪問", target: "問診", predicate: "kunjungan pemeriksaan" },
    { source: "不問", target: "問責", predicate: "pembebasan vs penuntutan" }
  ],
  "題": [
    { source: "課題", target: "宿題", predicate: "mirip makna tugas" },
    { source: "題名", target: "表題", predicate: "mirip makna judul" },
    { source: "主題", target: "演題", predicate: "mirip makna tema" },
    { source: "論題", target: "議題", predicate: "topik pembahasan" },
    { source: "出題", target: "例題", predicate: "pembuatan contoh soal" },
    { source: "話題", target: "題材", predicate: "bahan perbincangan" },
    { source: "副題", target: "題名", predicate: "sub-judul pendukung" },
    { source: "難題", target: "課題", predicate: "tugas berat" },
    { source: "問題", target: "出題", predicate: "proses pembuatan soal" },
    { source: "題字", target: "題名", predicate: "gaya penulisan judul" }
  ],
  "答": [
    { source: "回答", target: "解答", predicate: "mirip makna jawaban" },
    { source: "解答", target: "答案", predicate: "ditulis pada lembar jawaban" },
    { source: "応答", target: "返答", predicate: "interaksi merespons" },
    { source: "正答", target: "解答", predicate: "jawaban yang benar" },
    { source: "答弁", target: "口答", predicate: "penjelasan lisan resmi" },
    { source: "筆答", target: "口答", predicate: "metode tulisan vs lisan" },
    { source: "答辞", target: "答礼", predicate: "balasan penghormatan" },
    { source: "自答", target: "問答", predicate: "tanya jawab mandiri" },
    { source: "確答", target: "回答", predicate: "jawaban kepastian" },
    { source: "直答", target: "返答", predicate: "jawaban langsung" }
  ],

  // ==================== MODUL 2 ====================
  "研": [
    { source: "研究", target: "研修", predicate: "teori vs pelatihan" },
    { source: "研修", target: "研習", predicate: "proses belajar magang" },
    { source: "研磨", target: "研削", predicate: "pengasahan & pemotongan" },
    { source: "研学", target: "研鑽", predicate: "pendalaman keilmuan" },
    { source: "研精", target: "研鑽", predicate: "tekun mengasah keahlian" }
  ],
  "究": [
    { source: "究明", target: "探究", predicate: "penyelidikan & pencarian" },
    { source: "究理", target: "考究", predicate: "memahami prinsip dasar" },
    { source: "研究", target: "探究", predicate: "penyelidikan ilmiah" },
    { source: "追究", target: "究明", predicate: "mengejar kejelasan fakta" },
    { source: "討究", target: "論究", predicate: "diskusi teori mendalam" },
    { source: "講究", target: "考究", predicate: "pemikiran mendalam" }
  ],
  "集": [
    { source: "集会", target: "集合", predicate: "perkumpulan massa" },
    { source: "収集", target: "採集", predicate: "mengumpulkan benda/data" },
    { source: "集結", target: "結集", predicate: "pemusatan kekuatan" },
    { source: "募集", target: "招集", predicate: "perekrutan & panggilan" },
    { source: "全集", target: "選集", predicate: "kumpulan lengkap vs pilihan" },
    { source: "密集", target: "集積", predicate: "pemadatan & penumpukan" },
    { source: "集中", target: "集成", predicate: "fokus pemusatan" },
    { source: "集団", target: "集会", predicate: "kelompok massa perkumpulan" }
  ],
  "調": [
    { source: "好調", target: "順調", predicate: "kondisi sangat baik" },
    { source: "不調", target: "低調", predicate: "kondisi lesu/buruk" },
    { source: "口調", target: "語調", predicate: "nada gaya bicara" },
    { source: "声調", target: "音調", predicate: "nada suara & musik" },
    { source: "調査", target: "調書", predicate: "penyelidikan & berita acara" },
    { source: "調合", target: "調製", predicate: "pencampuran & pembuatan" },
    { source: "調薬", target: "調理", predicate: "penyiapan obat vs makanan" },
    { source: "調達", target: "調印", predicate: "pengadaan & penandatanganan" },
    { source: "調律", target: "変調", predicate: "penyetelan & modulasi" },
    { source: "体調", target: "好調", predicate: "kondisi fisik kesehatan" },
    { source: "快調", target: "順調", predicate: "kondisi lancar menyenangkan" },
    { source: "高調", target: "好調", predicate: "kondisi memuncak semangat" },
    { source: "調味料", target: "調理", predicate: "bumbu masakan" },
    { source: "強調", target: "口調", predicate: "penekanan nada bicara" },
    { source: "歩調", target: "順調", predicate: "keselarasan langkah" },
    { source: "移調", target: "変調", predicate: "perubahan nada modulasi" }
  ],
  "査": [
    { source: "調査", target: "検査", predicate: "survei & pemeriksaan teknis" },
    { source: "精査", target: "細査", predicate: "pemeriksaan mendetail" },
    { source: "査定", target: "考査", predicate: "penilaian kualifikasi" },
    { source: "査問", target: "内査", predicate: "interogasi & pemeriksaan internal" },
    { source: "実査", target: "点査", predicate: "survei fisik & titik" },
    { source: "簡査", target: "査験", predicate: "pemeriksaan singkat & verifikasi" }
  ],

  // ==================== MODUL 3 ====================
  "情": [
    { source: "感情", target: "表情", predicate: "perasaan & ekspresi wajah" },
    { source: "心情", target: "真情", predicate: "perasaan batin sejujurnya" },
    { source: "愛情", target: "友情", predicate: "kasih sayang & persahabatan" },
    { source: "同情", target: "人情", predicate: "simpati & kemanusiaan" },
    { source: "事情", target: "実情", predicate: "latar belakang & kenyataan" },
    { source: "内情", target: "情勢", predicate: "kondisi internal & situasi" },
    { source: "情熱", target: "熱情", predicate: "semangat membara" },
    { source: "苦情", target: "情報", predicate: "keluhan & penyampaian data" },
    { source: "純情", target: "心情", predicate: "kemurnian perasaan" },
    { source: "交情", target: "友情", predicate: "keakraban persahabatan" },
    { source: "情景", target: "表情", predicate: "suasana gambaran perasaan" }
  ],
  "報": [
    { source: "情報", target: "報告", predicate: "informasi & penyampaian laporan" },
    { source: "予報", target: "速報", predicate: "prakiraan & berita cepat" },
    { source: "通報", target: "報知", predicate: "pemberitahuan kejadian" },
    { source: "続報", target: "特報", predicate: "berita susulan & berita khusus" },
    { source: "悲報", target: "勝報", predicate: "berita duka vs kemenangan" },
    { source: "日報", target: "会報", predicate: "laporan harian & warta" },
    { source: "広報", target: "公報", predicate: "humas & pengumuman publik" },
    { source: "返報", target: "報復", predicate: "balasan jasa vs dendam" },
    { source: "報道", target: "電報", predicate: "pemberitaan & telegram" },
    { source: "確報", target: "速報", predicate: "berita kepastian resmi" },
    { source: "時報", target: "日報", predicate: "penanda waktu & laporan berkala" },
    { source: "外報", target: "報道", predicate: "berita luar negeri & media" }
  ],
  "伝": [
    { source: "伝言", target: "伝達", predicate: "pesan lisan & penyampaian" },
    { source: "伝授", target: "伝受", predicate: "pemberian & penerimaan ajaran" },
    { source: "伝統", target: "伝説", predicate: "tradisi & cerita rakyat" },
    { source: "伝記", target: "自伝", predicate: "biografi & otobiografi" },
    { source: "伝送", target: "伝書", predicate: "pengiriman sinyal & surat" },
    { source: "伝道", target: "伝習", predicate: "penyebaran & pemelajaran" },
    { source: "伝聞", target: "伝言", predicate: "kabar dengar & pesan lisan" },
    { source: "伝令", target: "伝達", predicate: "perintah & penyampaian pesan" },
    { source: "伝写", target: "伝書", predicate: "salinan tulisan & surat" }
  ],
  "信": [
    { source: "発信", target: "送信", predicate: "pengiriman pesan" },
    { source: "送信", target: "返信", predicate: "kirim & balasan pesan" },
    { source: "通信", target: "交信", predicate: "komunikasi data & radio" },
    { source: "信念", target: "確信", predicate: "keyakinan & kepastian" },
    { source: "信頼", target: "信用", predicate: "kepercayaan & kredibilitas" },
    { source: "信者", target: "信徒", predicate: "penganut ajaran" },
    { source: "信任", target: "信義", predicate: "kepercayaan & integritas" },
    { source: "自信", target: "確信", predicate: "percaya diri & keyakinan" },
    { source: "信言", target: "信念", predicate: "perkataan jujur & keyakinan" },
    { source: "信号", target: "通信", predicate: "sinyal isyarat & komunikasi" },
    { source: "信書", target: "送信", predicate: "surat rahasia & pengiriman" }
  ],
  "送": [
    { source: "発送", target: "直送", predicate: "pengiriman & pengiriman langsung" },
    { source: "郵送", target: "配送", predicate: "kirim pos & distribusi" },
    { source: "輸送", target: "陸送", predicate: "pengangkutan & angkutan darat" },
    { source: "転送", target: "回送", predicate: "meneruskan vs pengembalian" },
    { source: "護送", target: "送検", predicate: "pengawalan & penyerahan hukum" },
    { source: "送別", target: "歓送", predicate: "acara perpisahan" },
    { source: "送辞", target: "送別", predicate: "kata perpisahan" },
    { source: "送信", target: "発送", predicate: "pengiriman pesan & barang" },
    { source: "電送", target: "伝送", predicate: "pengiriman sinyal & data" },
    { source: "放送", target: "直送", predicate: "penyiaran publik & kirim langsung" },
    { source: "送付", target: "郵送", predicate: "penyerahan dokumen & pos" },
    { source: "移送", target: "輸送", predicate: "pemindahan lokasi & angkut" },
    { source: "押送", target: "護送", predicate: "pengawalan ketat tahanan" }
  ],

  // ==================== MODUL 4 ====================
  "職": [
    { source: "職業", target: "職人", predicate: "pekerjaan & ahli pengrajin" },
    { source: "職場", target: "職員", predicate: "tempat kerja & pegawai" },
    { source: "求職", target: "転職", predicate: "pencarian & pindah kerja" },
    { source: "退職", target: "無職", predicate: "pensiun & belum bekerja" },
    { source: "有職", target: "職業", predicate: "memiliki pekerjaan" }
  ],
  "業": [
    { source: "産業", target: "工業", predicate: "industri & manufaktur" },
    { source: "工業", target: "農業", predicate: "manufaktur & pertanian" },
    { source: "農業", target: "漁業", predicate: "pertanian & perikanan" },
    { source: "業務", target: "作業", predicate: "tugas & aktivitas kerja" },
    { source: "始業", target: "就業", predicate: "mulai jam kerja" },
    { source: "残業", target: "失業", predicate: "lembur vs pengangguran" },
    { source: "営業", target: "企業", predicate: "bisnis & perusahaan" },
    { source: "自営業", target: "家業", predicate: "usaha mandiri & keluarga" },
    { source: "事業", target: "企業", predicate: "kegiatan usaha & perusahaan" },
    { source: "業者", target: "業界", predicate: "pelaku usaha & industri" },
    { source: "商業", target: "営業", predicate: "perdagangan & operasional" },
    { source: "本業", target: "家業", predicate: "pekerjaan utama & keluarga" }
  ],
  "務": [
    { source: "義務", target: "任務", predicate: "kewajiban & tugas" },
    { source: "勤務", target: "職務", predicate: "dinas & rincian tugas" },
    { source: "業務", target: "実務", predicate: "pelaksanaan & praktik kerja" },
    { source: "事務", target: "用務", predicate: "kerja kantor & urusan dinas" },
    { source: "公務", target: "法務", predicate: "dinas pemerintah & hukum" },
    { source: "財務", target: "教務", predicate: "keuangan & akademik" },
    { source: "労務", target: "勤務", predicate: "tenaga kerja & dinas" },
    { source: "服務", target: "職務", predicate: "kepatuhan & tugas dinas" }
  ],
  "術": [
    { source: "技術", target: "学術", predicate: "keahlian & ilmu akademis" },
    { source: "美術", target: "芸術", predicate: "seni rupa & karya seni" },
    { source: "手術", target: "技術", predicate: "tindakan medis presisi" },
    { source: "話術", target: "秘術", predicate: "seni bicara & rahasia" },
    { source: "算術", target: "技術", predicate: "berhitung & penerapan" }
  ],
  "商": [
    { source: "商店", target: "商店街", predicate: "toko & kawasan pertokoan" },
    { source: "商品", target: "商取引", predicate: "barang & transaksi bisnis" },
    { source: "商売", target: "商業", predicate: "perniagaan & perdagangan" },
    { source: "商人", target: "商社", predicate: "pedagang & perusahaan dagang" }
  ],

  // ==================== MODUL 5 ====================
  "議": [
    { source: "会議", target: "議会", predicate: "rapat & parlemen dewan" },
    { source: "議論", target: "討議", predicate: "perdebatan & pembahasan" },
    { source: "決議", target: "議決", predicate: "penetapan keputusan" },
    { source: "議案", target: "議題", predicate: "draf usulan & agenda" },
    { source: "発議", target: "動議", predicate: "pengajuan usulan & mosi" },
    { source: "建議", target: "発議", predicate: "rekomendasi usulan formal" },
    { source: "議員", target: "議長", predicate: "anggota & ketua dewan" },
    { source: "異議", target: "物議", predicate: "keberatan & kontroversi" },
    { source: "争議", target: "和議", predicate: "perselisihan vs perdamaian" },
    { source: "論議", target: "議論", predicate: "diskusi pembahasan masalah" },
    { source: "合議", target: "評議", predicate: "musyawarah kesepakatan" },
    { source: "談議", target: "会議", predicate: "obrolan diskusi & rapat" },
    { source: "議事", target: "議案", predicate: "jalannya sidang & materi draf" }
  ],
  "論": [
    { source: "議論", target: "討論", predicate: "diskusi & perdebatan" },
    { source: "口論", target: "論争", predicate: "pertengkaran & perdebatan" },
    { source: "反論", target: "弁論", predicate: "sanggahan & pembelaan" },
    { source: "異論", target: "持論", predicate: "pendapat beda & pribadi" },
    { source: "言論", target: "世論", predicate: "pendapat & opini publik" },
    { source: "理論", target: "論理", predicate: "teori & logika berpikir" },
    { source: "論点", target: "結論", predicate: "pokok masalah & kesimpulan" },
    { source: "論文", target: "評論", predicate: "karya ilmiah & ulasan" },
    { source: "論議", target: "議論", predicate: "diskusi perdebatan teori" },
    { source: "論述", target: "論文", predicate: "pemaparan argumen & karya" }
  ],
  "談": [
    { source: "会談", target: "対談", predicate: "pertemuan resmi & dialog" },
    { source: "座談", target: "面談", predicate: "diskusi & wawancara muka" },
    { source: "相談", target: "商談", predicate: "konsultasi & negosiasi" },
    { source: "談合", target: "用談", predicate: "kesepakatan & urusan dinas" },
    { source: "雑談", target: "談笑", predicate: "ngobrol & obrolan tawa" },
    { source: "談話", target: "冗談", predicate: "pernyataan vs lelucon" },
    { source: "直談", target: "面談", predicate: "negosiasi langsung & wawancara" }
  ],
  "討": [
    { source: "討議", target: "討論", predicate: "pembahasan & perdebatan" },
    { source: "検討", target: "討究", predicate: "pengkajian & penyelidikan" },
    { source: "討伐", target: "検討", predicate: "penumpasan vs peninjauan" }
  ],
  "意": [
    { source: "意見", target: "意向", predicate: "pendapat & maksud" },
    { source: "意思", target: "意志", predicate: "kemauan & tekad kuat" },
    { source: "意図", target: "決意", predicate: "tujuan terencana & ketetapan" },
    { source: "意欲", target: "意識", predicate: "semangat & kesadaran" },
    { source: "同意", target: "合意", predicate: "persetujuan & kesepakatan" },
    { source: "好意", target: "悪意", predicate: "niat baik vs niat buruk" },
    { source: "注意", target: "用意", predicate: "kewaspadaan & persiapan" },
    { source: "意味", target: "意図", predicate: "makna arti & maksud" }
  ],

  // ==================== MODUL 6 ====================
  "経": [
    { source: "経験", target: "経歴", predicate: "pengalaman & rekam jejak" },
    { source: "経済", target: "経営", predicate: "perekonomian & pengelolaan" },
    { source: "経過", target: "経由", predicate: "proses waktu & transit" },
    { source: "経費", target: "経理", predicate: "biaya & akuntansi" },
    { source: "経口", target: "経常", predicate: "asupan vs kondisi rutin" }
  ],
  "歴": [
    { source: "歴史", target: "年表", predicate: "sejarah & garis waktu" },
    { source: "経歴", target: "職歴", predicate: "riwayat hidup & kerja" },
    { source: "学歴", target: "職歴", predicate: "pendidikan & riwayat kerja" },
    { source: "前歴", target: "履歴", predicate: "rekam jejak & riwayat" },
    { source: "歴代", target: "歴年", predicate: "generasi & perjalanan tahun" }
  ],
  "史": [
    { source: "歴史", target: "史実", predicate: "sejarah & fakta sejarah" },
    { source: "史料", target: "史実", predicate: "dokumen & kebenaran fakta" },
    { source: "先史", target: "前史", predicate: "prasejarah & sejarah awal" },
    { source: "正史", target: "秘史", predicate: "sejarah resmi vs rahasia" },
    { source: "史上", target: "歴史", predicate: "pencatatan sejarah" }
  ],
  "期": [
    { source: "初期", target: "後期", predicate: "tahap awal vs akhir" },
    { source: "前期", target: "後期", predicate: "periode awal vs kedua" },
    { source: "長期", target: "短期", predicate: "jangka panjang vs pendek" },
    { source: "期首", target: "期末", predicate: "awal vs akhir periode" },
    { source: "期限", target: "期日", predicate: "batas waktu & penetapan" },
    { source: "納期", target: "延期", predicate: "penyerahan vs penundaan" },
    { source: "満期", target: "延期", predicate: "jatuh tempo vs penundaan" },
    { source: "期待", target: "予期", predicate: "harapan & ekspektasi" },
    { source: "定期", target: "周期", predicate: "rutin periodik & siklus" },
    { source: "学期", target: "会期", predicate: "semester & persidangan" },
    { source: "期間", target: "期限", predicate: "rentang waktu & batas akhir" },
    { source: "時期", target: "周期", predicate: "saat waktu & siklus" },
    { source: "早期", target: "初期", predicate: "tahapan awal pemulaan" },
    { source: "末期", target: "期末", predicate: "stadium akhir & akhir periode" }
  ],
  "始": [
    { source: "開始", target: "始動", predicate: "memulai & menyalakan mesin" },
    { source: "始業", target: "開始", predicate: "mulai kerja & pembukaan" },
    { source: "年始", target: "始業", predicate: "awal tahun & aktivitas kerja" },
    { source: "終始", target: "始終", predicate: "awal hingga akhir / senantiasa" },
    { source: "始末", target: "開始", predicate: "penyelesaian vs pengawalan" }
  ]
};

async function seedAllEdges() {
  console.log("=== Memulai Seeding KanjiGraphEdge untuk Seluruh Modul 1 - 6 ===");

  const allKanjiInDb = await prisma.kanji.findMany({
    where: { moduleId: { not: null } },
    include: { jukugos: true }
  });

  let totalEdgesCreated = 0;

  for (const kanji of allKanjiInDb) {
    const char = kanji.character;
    const rules = ALL_GRAPH_EDGES_DATA[char] || [];

    // Hapus edge lama untuk kanji ini
    await prisma.kanjiGraphEdge.deleteMany({
      where: { kanjiId: kanji.id }
    });

    let kanjiCreatedCount = 0;
    for (let idx = 0; idx < rules.length; idx++) {
      const r = rules[idx];
      const edgeId = `cross-${kanji.id}-${idx + 1}-${r.source}-${r.target}`;

      await prisma.kanjiGraphEdge.create({
        data: {
          id: edgeId,
          kanjiId: kanji.id,
          source: r.source,
          target: r.target,
          predicate: r.predicate
        }
      });
      kanjiCreatedCount++;
      totalEdgesCreated++;
    }

    console.log(`✅ Kanji: ${char} (Modul ${kanji.moduleId}) -> Created ${kanjiCreatedCount} graph edges.`);
  }

  console.log(`\n🎉 Total ${totalEdgesCreated} KanjiGraphEdge berhasil diperbarui & ditautkan untuk 30 Kanji Modul 1-6.`);
}

seedAllEdges()
  .catch((e) => {
    console.error("Gagal menjalankan seed script:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
