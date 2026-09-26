import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface GroupDef {
  name: string;
  correctWords: string[];
}

interface KanjiGroupingData {
  character: string;
  moduleId: number;
  words: string[];
  groups: GroupDef[];
}

export const GROUPING_QUIZZES_FROM_DOCS: KanjiGroupingData[] = [
  // ==========================================
  // MODUL 1 (moduleId: 555)
  // ==========================================
  {
    character: "試",
    moduleId: 555,
    words: [
      "試験", "試問", "試着", "試乗", "試食", "試飲",
      "試薬", "試作", "試製", "試合", "試技", "試聴"
    ],
    groups: [
      { name: "1. Aktivitas Pengujian", correctWords: ["試験", "試問"] },
      { name: "2. Penggunaan", correctWords: ["試着", "試乗"] },
      { name: "3. Konsumsi", correctWords: ["試食", "試飲"] },
      { name: "4. Bahan Pengujian", correctWords: ["試薬"] },
      { name: "5. Produksi dan Pengembangan", correctWords: ["試作", "試製"] },
      { name: "6. Kompetisi dan Keterampilan", correctWords: ["試合", "試技"] },
      { name: "7. Media", correctWords: ["試聴"] }
    ]
  },
  {
    character: "験",
    moduleId: 555,
    words: ["試験", "経験", "効験", "受験", "験算", "体験", "治験", "実験"],
    groups: [
      { name: "1. Pengujian / Pembuktian", correctWords: ["試験", "受験", "実験", "治験"] },
      { name: "2. Pengalaman", correctWords: ["経験", "体験"] },
      { name: "3. Verifikasi / Pemeriksaan", correctWords: ["験算"] },
      { name: "4. Hasil / Efek / Bukti", correctWords: ["効験"] }
    ]
  },
  {
    character: "問",
    moduleId: 555,
    words: [
      "訪問", "問題", "自問", "問診", "問答",
      "反問", "試問", "問責", "質問", "検問"
    ],
    groups: [
      { name: "1. Bertanya / Mengajukan Pertanyaan", correctWords: ["質問", "自問", "反問"] },
      { name: "2. Tanya Jawab", correctWords: ["問答"] },
      { name: "3. Soal / Pertanyaan", correctWords: ["問題", "試問"] },
      { name: "4. Pemeriksaan dengan Pertanyaan", correctWords: ["問診", "検問"] },
      { name: "5. Mempertanyakan / Meminta Pertanggungjawaban", correctWords: ["問責"] },
      { name: "6. Mengunjungi", correctWords: ["訪問"] }
    ]
  },
  {
    character: "題",
    moduleId: 555,
    words: [
      "副題", "問題", "話題", "例題", "題材", "議題",
      "宿題", "題名", "難題", "主題", "出題", "演題"
    ],
    groups: [
      { name: "1. Soal / Tugas / Masalah", correctWords: ["問題", "宿題", "出題", "例題", "難題"] },
      { name: "2. Tema / Topik", correctWords: ["主題", "話題", "議題"] },
      { name: "3. Judul", correctWords: ["題名", "副題", "演題"] },
      { name: "4. Bahan / Tema Karya", correctWords: ["題材"] }
    ]
  },
  {
    character: "答",
    moduleId: 555,
    words: [
      "筆答", "回答", "答礼", "正答", "自答",
      "解答", "直答", "返答", "答案", "答辞"
    ],
    groups: [
      { name: "1. Jawaban / Tanggapan", correctWords: ["回答", "返答", "自答"] },
      { name: "2. Hasil Jawaban", correctWords: ["解答", "答案", "正答"] },
      { name: "3. Cara Menjawab", correctWords: ["直答", "筆答"] },
      { name: "4. Balasan", correctWords: ["答辞", "答礼"] }
    ]
  },

  // ==========================================
  // MODUL 2 (moduleId: 556)
  // ==========================================
  {
    character: "研",
    moduleId: 556,
    words: ["研究", "研学", "研精", "研修", "研習", "研鑽", "研磨", "研削"],
    groups: [
      { name: "1. Meneliti / Mendalami", correctWords: ["研究", "研学", "研精"] },
      { name: "2. Belajar / Mengasah Kemampuan", correctWords: ["研修", "研習", "研鑽"] },
      { name: "3. Mengasah / Menghaluskan", correctWords: ["研磨", "研削"] }
    ]
  },
  {
    character: "究",
    moduleId: 556,
    words: ["研究", "探究", "追究", "考究", "討究", "論究", "講究", "究理", "究明"],
    groups: [
      { name: "1. Meneliti / Menyelidiki", correctWords: ["研究", "探究", "追究"] },
      { name: "2. Mengkaji / Membahas", correctWords: ["考究", "討究", "論究", "講究"] },
      { name: "3. Mendalami / Mengungkap", correctWords: ["究理", "究明"] }
    ]
  },
  {
    character: "集",
    moduleId: 556,
    words: [
      "集合", "集会", "集団", "密集", "集結", "収集",
      "採集", "募集", "集中", "集積", "全集", "選集"
    ],
    groups: [
      { name: "1. Berkumpul / Berkelompok", correctWords: ["集合", "集会", "集団", "密集", "集結"] },
      { name: "2. Mengumpulkan / Menghimpun", correctWords: ["収集", "採集", "募集"] },
      { name: "3. Memusatkan / Mengakumulasi", correctWords: ["集中", "集積"] },
      { name: "4. Kumpulan / Hasil yang Dihimpun", correctWords: ["全集", "選集"] }
    ]
  },
  {
    character: "調",
    moduleId: 556,
    words: [
      "体調", "好調", "不調", "順調", "口調", "語調",
      "調査", "調達", "調理", "調合", "強調", "変調"
    ],
    groups: [
      { name: "1. Kondisi dan Keadaan", correctWords: ["体調", "好調", "不調", "順調"] },
      { name: "2. Cara Berbicara dan Bunyi", correctWords: ["口調", "語調"] },
      { name: "3. Pemeriksaan dan Administrasi", correctWords: ["調査", "調達"] },
      { name: "4. Pengaturan dan Penyesuaian", correctWords: ["調理", "調合"] },
      { name: "5. Penyelidikan dan Perubahan Keadaan", correctWords: ["強調", "変調"] }
    ]
  },
  {
    character: "査",
    moduleId: 556,
    words: [
      "調査", "検査", "実査", "点査", "精査",
      "細査", "査定", "考査", "査問", "査験"
    ],
    groups: [
      { name: "1. Memeriksa", correctWords: ["調査", "検査", "実査", "点査"] },
      { name: "2. Memeriksa dengan Teliti", correctWords: ["精査", "細査"] },
      { name: "3. Menilai", correctWords: ["査定", "考査"] },
      { name: "4. Menyelidiki", correctWords: ["査問"] },
      { name: "5. Menguji", correctWords: ["査験"] }
    ]
  },

  // ==========================================
  // MODUL 3 (moduleId: 557)
  // ==========================================
  {
    character: "情",
    moduleId: 557,
    words: [
      "感情", "表情", "真情", "愛情", "友情", "同情",
      "情熱", "熱情", "事情", "実情", "苦情", "情報"
    ],
    groups: [
      { name: "1. Perasaan / Emosi", correctWords: ["感情", "表情", "真情"] },
      { name: "2. Kasih Sayang / Hubungan Antarmanusia", correctWords: ["愛情", "友情", "同情"] },
      { name: "3. Perasaan / Semangat yang Kuat", correctWords: ["情熱", "熱情"] },
      { name: "4. Keadaan / Situasi", correctWords: ["事情", "実情"] },
      { name: "5. Keluhan / Perasaan Tidak Puas", correctWords: ["苦情"] },
      { name: "6. Informasi / Data", correctWords: ["情報"] }
    ]
  },
  {
    character: "報",
    moduleId: 557,
    words: [
      "情報", "報告", "広報", "日報", "報酬", "悲報",
      "吉報", "返報", "報復", "報道", "通報"
    ],
    groups: [
      { name: "1. Informasi / Pemberitahuan", correctWords: ["情報", "報告", "通報"] },
      { name: "2. Berita / Pemberitaan", correctWords: ["悲報", "吉報", "報道"] },
      { name: "3. Laporan / Penyampaian Informasi", correctWords: ["広報", "日報"] },
      { name: "4. Balasan / Imbalan", correctWords: ["報酬", "返報", "報復"] }
    ]
  },
  {
    character: "伝",
    moduleId: 557,
    words: [
      "伝言", "伝達", "伝聞", "伝令", "伝授", "伝受",
      "伝習", "伝道", "伝統", "伝説", "伝記", "自伝"
    ],
    groups: [
      { name: "1. Penyampaian Pesan dan Informasi", correctWords: ["伝言", "伝達", "伝聞", "伝令"] },
      { name: "2. Penyampaian dan Pewarisan Ilmu / Ajaran", correctWords: ["伝授", "伝受", "伝習"] },
      { name: "3. Pewarisan Tradisi dan Cerita", correctWords: ["伝道", "伝統", "伝説"] },
      { name: "4. Riwayat dan Informasi Tertulis", correctWords: ["伝記", "自伝"] }
    ]
  },
  {
    character: "信",
    moduleId: 557,
    words: [
      "通信", "発信", "送信", "返信", "信号", "信念",
      "信者", "信頼", "信用", "自信", "確信", "信書"
    ],
    groups: [
      { name: "1. Komunikasi / Penyampaian Informasi", correctWords: ["通信", "発信", "送信", "返信"] },
      { name: "2. Keyakinan / Kepercayaan", correctWords: ["信念", "信頼", "信用", "確信"] },
      { name: "3. Kepercayaan Diri / Penganut", correctWords: ["自信", "信者"] },
      { name: "4. Tanda / Dokumen", correctWords: ["信号", "信書"] }
    ]
  },
  {
    character: "送",
    moduleId: 557,
    words: [
      "送信", "伝送", "放送", "発送", "郵送", "配送",
      "送検", "護送", "押送", "送別", "歓送", "送辞"
    ],
    groups: [
      { name: "1. Pengiriman Informasi / Pesan", correctWords: ["送信", "伝送", "放送"] },
      { name: "2. Pengiriman / Pengantaran Benda / Barang", correctWords: ["発送", "郵送", "配送"] },
      { name: "3. Penyerahan / Pengiriman kepada Pihak Berwenang", correctWords: ["送検", "護送", "押送"] },
      { name: "4. Mengirim / Melepas Orang yang Pergi", correctWords: ["送別", "歓送", "送辞"] }
    ]
  },

  // ==========================================
  // MODUL 4 (moduleId: 558)
  // ==========================================
  {
    character: "職",
    moduleId: 558,
    words: [
      "職業", "職人", "職員", "職場", "求職",
      "有職", "転職", "退職", "無職"
    ],
    groups: [
      { name: "1. Profesi / Pekerjaan", correctWords: ["職業", "職人"] },
      { name: "2. Orang / Tempat Kerja", correctWords: ["職員", "職場"] },
      { name: "3. Mencari / Memiliki Pekerjaan", correctWords: ["求職", "有職"] },
      { name: "4. Perubahan / Status Pekerjaan", correctWords: ["転職", "退職", "無職"] }
    ]
  },
  {
    character: "業",
    moduleId: 558,
    words: [
      "業務", "作業", "残業", "営業", "業者",
      "企業", "工業", "農業", "商業", "本業"
    ],
    groups: [
      { name: "1. Pekerjaan / Tugas", correctWords: ["業務", "作業", "残業"] },
      { name: "2. Usaha / Bisnis / Dunia Kerja", correctWords: ["営業", "業者", "企業"] },
      { name: "3. Bidang Industri / Pekerjaan", correctWords: ["工業", "農業", "商業"] },
      { name: "4. Bentuk / Status Pekerjaan", correctWords: ["本業"] }
    ]
  },
  {
    character: "商",
    moduleId: 558,
    words: ["商店", "商店街", "商品", "商売", "商業", "商取引", "商人", "商社"],
    groups: [
      { name: "1. Tempat", correctWords: ["商店", "商店街"] },
      { name: "2. Produk", correctWords: ["商品"] },
      { name: "3. Kegiatan", correctWords: ["商売", "商業", "商取引"] },
      { name: "4. Pelaku", correctWords: ["商人"] },
      { name: "5. Jenis Usaha", correctWords: ["商社"] }
    ]
  },
  {
    character: "務",
    moduleId: 558,
    words: [
      "業務", "職務", "勤務", "任務", "義務", "公務",
      "労務", "服務", "用務", "財務", "教務", "法務"
    ],
    groups: [
      { name: "1. Pekerjaan / Tugas", correctWords: ["業務", "職務", "勤務"] },
      { name: "2. Tugas / Kewajiban", correctWords: ["任務", "義務", "公務"] },
      { name: "3. Urusan / Pelaksanaan Tugas", correctWords: ["労務", "服務", "用務"] },
      { name: "4. Bidang / Urusan Tugas", correctWords: ["財務", "教務", "法務"] }
    ]
  },
  {
    character: "術",
    moduleId: 558,
    words: ["技術", "手術", "話術", "秘術", "学術", "算術", "芸術", "美術"],
    groups: [
      { name: "1. Teknik / Keterampilan", correctWords: ["技術", "手術", "話術", "秘術"] },
      { name: "2. Ilmu / Pengetahuan", correctWords: ["学術", "算術"] },
      { name: "3. Seni / Keahlian Seni", correctWords: ["芸術", "美術"] }
    ]
  },

  // ==========================================
  // MODUL 5 (moduleId: 559)
  // ==========================================
  {
    character: "議",
    moduleId: 559,
    words: [
      "会議", "議論", "決議", "議決", "発議",
      "動議", "異議", "争議", "議員", "議長"
    ],
    groups: [
      { name: "1. Pertemuan / Diskusi", correctWords: ["会議", "議論"] },
      { name: "2. Keputusan / Penetapan", correctWords: ["決議", "議決"] },
      { name: "3. Usulan / Agenda", correctWords: ["発議", "動議"] },
      { name: "4. Pendapat / Konflik", correctWords: ["異議", "争議"] },
      { name: "5. Pelaku / Lembaga / Jalannya Rapat", correctWords: ["議員", "議長"] }
    ]
  },
  {
    character: "論",
    moduleId: 559,
    words: ["論議", "議論", "討論", "異論", "持論", "論理", "理論", "評論"],
    groups: [
      { name: "1. Diskusi / Perdebatan", correctWords: ["論議", "議論", "討論"] },
      { name: "2. Pendapat / Wacana", correctWords: ["異論", "持論"] },
      { name: "3. Penalaran / Pemikiran", correctWords: ["論理", "理論"] },
      { name: "4. Penyampaian / Hasil Pemikiran", correctWords: ["評論"] }
    ]
  },
  {
    character: "討",
    moduleId: 559,
    words: ["討議", "討論", "討究", "検討", "討伐"],
    groups: [
      { name: "1. Membahas / Berdiskusi", correctWords: ["討議", "討論"] },
      { name: "2. Menyelidiki / Mengkaji", correctWords: ["討究", "検討"] },
      { name: "3. Menyerang / Menumpas", correctWords: ["討伐"] }
    ]
  },
  {
    character: "談",
    moduleId: 559,
    words: ["会談", "対談", "相談", "談合", "雑談", "談話", "商談"],
    groups: [
      { name: "1. Bentuk / Cara Pembicaraan", correctWords: ["会談", "対談"] },
      { name: "2. Tujuan / Kegiatan Pembicaraan", correctWords: ["相談", "談合", "商談"] },
      { name: "3. Suasana / Sifat Pembicaraan", correctWords: ["雑談", "談話"] }
    ]
  },
  {
    character: "意",
    moduleId: 559,
    words: ["意味", "意見", "意思", "意向", "意識", "同意", "合意", "用意"],
    groups: [
      { name: "1. Pikiran / Makna", correctWords: ["意味", "意見"] },
      { name: "2. Kehendak / Maksud", correctWords: ["意思", "意向"] },
      { name: "3. Kesadaran / Perhatian", correctWords: ["意識"] },
      { name: "4. Persetujuan / Sikap", correctWords: ["同意", "合意"] },
      { name: "5. Tujuan / Persiapan", correctWords: ["用意"] }
    ]
  },

  // ==========================================
  // MODUL 6 (moduleId: 560)
  // ==========================================
  {
    character: "経",
    moduleId: 560,
    words: [
      "経営", "経験", "経費", "経口", "経常",
      "経歴", "経済", "経由", "経理", "経過"
    ],
    groups: [
      { name: "1. Pengalaman / Perjalanan Waktu", correctWords: ["経験", "経過", "経歴"] },
      { name: "2. Jalur / Cara Melalui", correctWords: ["経由", "経口"] },
      { name: "3. Ekonomi / Pengelolaan", correctWords: ["経済", "経営", "経費", "経理", "経常"] }
    ]
  },
  {
    character: "始",
    moduleId: 560,
    words: ["始動", "年始", "始末", "終始", "開始", "始終", "始業"],
    groups: [
      { name: "1. Awal Waktu", correctWords: ["年始"] },
      { name: "2. Mulai", correctWords: ["開始", "始業", "始動"] },
      { name: "3. Awal–Akhir", correctWords: ["終始", "始終"] },
      { name: "4. Penyelesaian", correctWords: ["始末"] }
    ]
  },
  {
    character: "歴",
    moduleId: 560,
    words: [
      "歴代", "病歴", "学歴", "来歴", "歴史",
      "職歴", "歴年", "前歴", "経歴"
    ],
    groups: [
      { name: "1. Riwayat Pendidikan / Pekerjaan / Karier", correctWords: ["学歴", "職歴", "経歴"] },
      { name: "2. Riwayat Kehidupan / Latar Belakang", correctWords: ["前歴", "病歴", "来歴"] },
      { name: "3. Sejarah / Perjalanan Waktu", correctWords: ["歴史", "歴代", "歴年"] }
    ]
  },
  {
    character: "史",
    moduleId: 560,
    words: ["秘史", "史上", "歴史", "史料", "前史", "正史", "先史", "史実"],
    groups: [
      { name: "1. Sejarah", correctWords: ["歴史", "先史", "前史"] },
      { name: "2. Fakta", correctWords: ["史実"] },
      { name: "3. Sumber", correctWords: ["史料"] },
      { name: "4. Jenis Sejarah", correctWords: ["正史", "秘史"] },
      { name: "5. Dalam Sejarah", correctWords: ["史上"] }
    ]
  },
  {
    character: "期",
    moduleId: 560,
    words: [
      "時期", "期間", "長期", "定期", "初期", "前期",
      "後期", "期限", "期日", "満期", "期待", "予期"
    ],
    groups: [
      { name: "1. Waktu / Periode", correctWords: ["時期", "期間", "長期", "定期"] },
      { name: "2. Tahap Waktu", correctWords: ["初期", "前期", "後期"] },
      { name: "3. Batas Waktu", correctWords: ["期限", "期日", "満期"] },
      { name: "4. Harapan / Perkiraan", correctWords: ["期待", "予期"] }
    ]
  }
];

export async function syncAllGroupingQuizzesFromDocs() {
  console.log("🚀 Memulai sinkronisasi soal Pengelompokan Kata (Grouping) dari dokumen soal.md...");

  let updatedCount = 0;
  let createdCount = 0;

  for (const item of GROUPING_QUIZZES_FROM_DOCS) {
    const kanji = await prisma.kanji.findFirst({
      where: {
        character: item.character,
        moduleId: item.moduleId
      },
      include: {
        quizzes: {
          where: { type: "grouping" }
        }
      }
    });

    if (!kanji) {
      console.warn(`⚠️ Kanji ${item.character} (Modul ${item.moduleId}) tidak ditemukan di database!`);
      continue;
    }

    // Bangun groups data terstandarisasi untuk frontend
    const groupsPayload = item.groups.map(g => ({
      name: g.name,
      category: g.name,
      correctWords: g.correctWords,
      items: g.correctWords,
      [g.name]: g.correctWords
    }));

    const explanation = `Kunci jawaban pengelompokan jukugo untuk kanji ${item.character}:\n` +
      item.groups.map(g => `${g.name}: ${g.correctWords.join("、")}`).join("\n");

    const quizData = {
      type: "grouping",
      question: "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
      words: JSON.stringify(item.words),
      groups: JSON.stringify(groupsPayload),
      explanation: explanation
    };

    if (kanji.quizzes.length > 0) {
      const qId = kanji.quizzes[0].id;
      await prisma.quiz.update({
        where: { id: qId },
        data: quizData
      });
      // Hapus jika ada duplikasi quiz grouping tambahan
      if (kanji.quizzes.length > 1) {
        const extraIds = kanji.quizzes.slice(1).map(q => q.id);
        await prisma.quiz.deleteMany({
          where: { id: { in: extraIds } }
        });
      }
      updatedCount++;
    } else {
      await prisma.quiz.create({
        data: {
          kanjiId: kanji.id,
          ...quizData
        }
      });
      createdCount++;
    }

    console.log(`✓ [Modul ${item.moduleId}] Kanji ${item.character}: ${item.words.length} kata terdaftar dalam ${item.groups.length} kelompok.`);
  }

  console.log(`\n🎉 SINKRONISASI SELESAI: ${updatedCount} kuis diperbarui, ${createdCount} kuis dibuat. Total 30 Kanji Modul 1-6.`);
}

if (require.main === module) {
  syncAllGroupingQuizzesFromDocs()
    .catch(e => {
      console.error("Gagal sinkronisasi:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
