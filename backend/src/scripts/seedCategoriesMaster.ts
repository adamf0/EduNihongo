import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedCategoriesMaster() {
  console.log("🚀 Seeding Master Categories and connecting Jukugos...");

  const categoryMapping: Record<string, Record<string, string[]>> = {
    "試": {
      "Aktivitas Pengujian": ["試験", "入試", "追試", "試問"],
      "Penggunaan": ["試着", "試用", "試乗"],
      "Konsumsi": ["試食", "試飲"],
      "Bahan Pengujian": ["試薬"],
      "Produksi dan Pengembangan": ["試作", "試製"],
      "Kompetisi dan Keterampilan": ["試合", "試技", "試射", "試練"],
      "Media": ["試写", "試聴", "試読"]
    },
    "験": {
      "Pengujian / Pembuktian": ["試験", "受験", "実験", "治験"],
      "Pengalaman": ["経験", "体験"],
      "Verifikasi / Pemeriksaan": ["験算"],
      "Hasil / Efek / Bukti": ["効験"]
    },
    "問": {
      "Bertanya / Mengajukan Pertanyaan": ["質問", "自問", "発問", "反問"],
      "Tanya Jawab": ["問答"],
      "Soal / Pertanyaan": ["問題", "設問", "試問", "難問"],
      "Pemeriksaan dengan Pertanyaan": ["問診", "検問"],
      "Mempertanyakan / Meminta Pertanggungjawaban": ["問責", "不問"],
      "Mengunjungi (Makna Perluasan)": ["訪問"]
    },
    "題": {
      "Soal / Tugas / Masalah": ["問題", "課題", "宿題", "出題", "例題", "難題"],
      "Tema / Topik": ["主題", "話題", "論題", "議題"],
      "Judul": ["題名", "表題", "副題", "演題", "題字"],
      "Bahan / Tema Karya": ["題材"]
    },
    "答": {
      "Jawaban / Tanggapan": ["回答", "応答", "返答", "問答", "自答", "答弁"],
      "Hasil Jawaban": ["解答", "答案", "正答", "確答"],
      "Cara Menjawab": ["口答", "直答", "筆答"],
      "Balasan": ["答辞", "答礼"]
    },
    "点": {
      "Penilaian dan Nilai": ["採点", "得点", "減点"],
      "Titik dan Lokasi": ["地点", "起点", "終点"],
      "Pandangan dan Aspek": ["観点", "視点", "論点"],
      "Fokus dan Permasalahan": ["問題点", "重点", "要点"],
      "Pemeriksaan dan Data": ["点検", "点灯", "点数"]
    },
    "研": {
      "1. Meneliti / Mendalami": ["研究", "研学", "研精"],
      "2. Belajar / Mengasah Kemampuan": ["研修", "研習", "研鑽"],
      "3. Mengasah / Menghaluskan": ["研磨", "研削"]
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
