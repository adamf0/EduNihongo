import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedCategoriesMaster() {
  console.log("🚀 Seeding Master Categories and connecting Jukugos...");

  const categoryMapping: Record<string, Record<string, string[]>> = {
    "試": {
      "Aktivitas Pengujian": ["試験", "入試", "試問"],
      "Penggunaan": ["試着", "試用", "試乗"],
      "Konsumsi": ["試食", "試飲", "試薬"],
      "Produksi dan Pengembangan": ["試作", "試作品", "試製"],
      "Kompetisi dan Media": ["試合", "試技", "試聴", "試写", "試読"]
    },
    "験": {
      "Pengujian": ["試験", "受験", "資格試験"],
      "Pengalaman": ["経験", "体験", "経験者"],
      "Penelitian": ["実験", "実験室", "被験者"],
      "Sertifikasi": ["受験生", "検定試験", "受験番号"]
    },
    "問": {
      "Pertanyaan dan Ujian": ["問題", "質問", "問答"],
      "Investigasi dan Penyelidikan": ["問診", "尋問", "訪問調査"],
      "Permasalahan Sosial": ["問題点", "社会問題", "環境問題"],
      "Pendidikan dan Evaluasi": ["設問", "問題集", "問 1", "問一"],
      "Komunikasi dan Konsultasi": ["問い合わせ", "問う", "問屋"]
    },
    "題": {
      "Pendidikan dan Evaluasi": ["問題", "課題", "宿題"],
      "Judul dan Tema": ["題名", "表題", "主題"],
      "Akademik dan Penelitian": ["研究課題", "論題", "出題"],
      "Diskusi dan Pemikiran": ["話題", "時事問題", "問題意識"],
      "Media dan Publikasi": ["題材", "題字", "演題"]
    },
    "答": {
      "Pertanyaan dan Jawaban": ["回答", "解答", "応答"],
      "Pendidikan dan Evaluasi": ["答案", "正答", "解答用紙"],
      "Komunikasi dan Diskusi": ["返答", "口答", "答弁"],
      "Akademik dan Penelitian": ["問答", "一問一答", "答申"],
      "Teknologi dan Layanan": ["自動応答", "応答時間", "応答率"]
    },
    "点": {
      "Penilaian dan Nilai": ["採点", "得点", "減点"],
      "Titik dan Lokasi": ["地点", "起点", "終点"],
      "Pandangan dan Aspek": ["観点", "視点", "論点"],
      "Fokus dan Permasalahan": ["問題点", "重点", "要点"],
      "Pemeriksaan dan Data": ["点検", "点灯", "点数"]
    },
    "研": {
      "Kegiatan Penelitian": ["研究", "研究室", "研究者", "研究会"],
      "Pelatihan dan Pengembangan": ["研修", "研修生", "研修旅行"],
      "Ilmu Pengetahuan dan Akademik": ["研究科", "研究書", "研究分野", "研究方法"],
      "Proses Mengasah dan Memperhalus": ["研磨", "研削"]
    },
    "究": {
      "Penelitian dan Penyelidikan": ["究明", "究査", "究問", "究理"],
      "Pencarian Penyebab": ["原因究明", "真相究明", "事実究明", "問題究明"],
      "Akademik dan Ilmiah": ["研究科", "研究室", "研究書", "研究方法"],
      "Pendalaman Ilmu": ["探究心", "学究心", "追究する", "深く究める"],
      "Hasil dan Pemahaman": ["究極", "結論究明", "本質究明"]
    },
    "集": {
      "Orang dan Pertemuan": ["集会", "集合", "集団", "集客"],
      "Mengumpulkan Benda/Informasi": ["収集", "資料収集", "情報収集", "事実収集"],
      "Pendidikan dan Akademik": ["集中", "集中力", "集中学習", "集中講義"],
      "Buku dan Publikasi": ["作品集", "写真集", "詩集", "問題集"],
      "Informasi dan Dokumentasi": ["記録集", "文書集", "報告集", "事例集"]
    },
    "調": {
      "Kondisi dan Keadaan": ["体調", "好調", "不調", "快調", "順調", "高調", "低調"],
      "Cara Berbicara dan Bunyi": ["口調", "語調", "声調", "音調"],
      "Pemeriksaan dan Administrasi": ["調査", "調書", "調印", "調達"],
      "Pengaturan dan Penyesuaian": ["調理", "調合", "調製", "調薬", "調律", "調味料"],
      "Pengendalian dan Perubahan Keadaan": ["強調", "歩調", "変調", "移調"]
    },
    "査": {
      "Pemeriksaan dan Penyelidikan": ["調査", "検査", "審査", "査定"],
      "Akademik dan Publikasi": ["査読", "査問", "再査", "調査研究"],
      "Dokumen dan Administrasi": ["調査報告書", "調査資料", "調査記録", "調査結果"],
      "Bidang Penelitian": ["学術調査", "現地調査", "市場調査", "統計調査"],
      "Perencanaan dan Informasi Penelitian": ["調査対象", "調査方法", "調査内容", "調査目的"]
    },
    "実": {
      "Fakta dan Kenyataan": ["事実", "真実", "実話", "実感", "口実"],
      "Praktik dan Pelaksanaan": ["実験", "実習", "実演", "実戦"],
      "Hasil dan Perwujudan": ["実現", "実用", "実収"],
      "Ketepatan dan Kepastian": ["確実", "着実", "実測", "実質"],
      "Kehidupan Nyata": ["実家", "実業", "実直", "内実"]
    }
  };

  for (const [char, cats] of Object.entries(categoryMapping)) {
    const kanjiObj = await prisma.kanji.findUnique({
      where: { character: char },
      include: { jukugos: true }
    });

    if (!kanjiObj) {
      console.log(`Kanji ${char} not found in DB, skipping.`);
      continue;
    }

    const jukugoMap = new Map<string, number>();
    kanjiObj.jukugos.forEach(j => jukugoMap.set(j.word.trim(), j.id));

    for (const [catName, words] of Object.entries(cats)) {
      // Find or create MasterCategory
      let category = await prisma.masterCategory.findFirst({
        where: { name: catName }
      });
      if (!category) {
        category = await prisma.masterCategory.create({
          data: { name: catName, description: `Kategori ${catName}` }
        });
      }

      for (const word of words) {
        const jukugoId = jukugoMap.get(word.trim());
        if (jukugoId) {
          // Delete existing link to avoid duplication
          await prisma.kategoriKanji.deleteMany({
            where: { jokugoId: jukugoId, categoryId: category.id }
          });

          await prisma.kategoriKanji.create({
            data: {
              categoryId: category.id,
              jokugoId: jukugoId
            }
          });
        }
      }
    }
    console.log(`✅ Categories linked for Kanji [${char}]`);
  }

  console.log("🎉 Category Seeding Completed!");
}
