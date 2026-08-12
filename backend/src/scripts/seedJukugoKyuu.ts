import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const CATEGORIES_DATA_KYUU = [
  {
    name: "Penelitian dan Penyelidikan",
    description: "Kelompok kegiatan dan proses penelitian serta penyelidikan secara mendalam.",
    items: [
      { word: "究明", reading: "きゅうめい", meaning: "Penyelidikan menyeluruh" },
      { word: "究査", reading: "きゅうさ", meaning: "Penyelidikan secara mendalam" },
      { word: "究問", reading: "きゅうもん", meaning: "Penyelidikan terhadap satu perkara" },
      { word: "究理", reading: "きゅうり", meaning: "Menyelidiki atau mencari prinsip yang benar." }
    ]
  },
  {
    name: "Pencarian Penyebab",
    description: "Kelompok penyelidikan untuk menemukan penyebab, fakta, dan kebenaran peristiwa.",
    items: [
      { word: "原因究明", reading: "げんいんきゅうめい", meaning: "Menyelidiki penyebab" },
      { word: "真相究明", reading: "しんそうきゅうめい", meaning: "Menyelidiki kebenaran suatu peristiwa" },
      { word: "事実究明", reading: "じじつきゅうめい", meaning: "Menyelidiki fakta" },
      { word: "問題究明", reading: "もんだいきゅうめい", meaning: "Menyelidiki atau memecahkan masalah" }
    ]
  },
  {
    name: "Akademik dan Ilmiah",
    description: "Kelompok fasilitas, program, dan media dalam lingkungan akademik dan penelitian.",
    items: [
      { word: "研究科", reading: "けんきゅうか", meaning: "Program studi (pascasarjana)" },
      { word: "研究室", reading: "けんきゅうしつ", meaning: "Ruang penelitian" },
      { word: "研究書", reading: "けんきゅうしょ", meaning: "Buku penelitian" },
      { word: "研究方法", reading: "けんきゅうほうほう", meaning: "Metode penelitian" }
    ]
  },
  {
    name: "Pendalaman Ilmu",
    description: "Kelompok dorongan, rasa ingin tahu, dan semangat untuk mendalami ilmu pengetahuan.",
    items: [
      { word: "探究心", reading: "たんきゅうしん", meaning: "Rasa ingin tahu yang tinggi" },
      { word: "学究心", reading: "がっきゅうしん", meaning: "Semangat mendalami ilmu" },
      { word: "追究する", reading: "ついきゅうする", meaning: "Mengejar dan menyelidiki lebih dalam" },
      { word: "深く究める", reading: "ふかくきわめる", meaning: "Mendalami ilmu sampai selesai" },
      { word: "深く", reading: "ふかく", meaning: "secara mendalam" },
      { word: "究める", reading: "きわめる", meaning: "mendalami hingga mencapai pemahaman yang utuh" },
      { word: "追究", reading: "ついきゅう", meaning: "mengejar dan menyelidiki" },
      { word: "探究", reading: "たんきゅう", meaning: "pencarian dan penyelidikan" },
      { word: "学究", reading: "がっきゅう", meaning: "studi akademik" }
    ]
  },
  {
    name: "Hasil dan Pemahaman",
    description: "Kelompok hasil pencapaian, kesimpulan, dan pemahaman hakikat tertinggi.",
    items: [
      { word: "究極", reading: "きゅうきょく", meaning: "Titik/tingkat tertinggi yang dicapai" },
      { word: "結論究明", reading: "けつろんきゅうめい", meaning: "Meneliti hingga memperoleh kesimpulan" },
      { word: "本質究明", reading: "ほんしつきゅうめい", meaning: "Menemukan hakikat (esensi) sesungguhnya" }
    ]
  }
];

export async function seedJukugoKyuu() {
  const kanji = await prisma.kanji.findFirst({ where: { character: "究" } });
  if (!kanji) {
    console.error("Kanji 究 not found");
    return;
  }

  await prisma.kanji.update({
    where: { id: kanji.id },
    data: {
      meaning: "Menyelidiki, mencari, mendalami hingga tuntas",
      baseMeaning: "Menyelidiki, mencari, atau mendalami sesuatu secara mendalam hingga mencapai pemahaman yang lengkap atau menemukan hakikat/penyebabnya."
    }
  });

  for (const cat of CATEGORIES_DATA_KYUU) {
    let masterCat = await prisma.masterCategory.findFirst({ where: { name: cat.name } });
    if (!masterCat) {
      masterCat = await prisma.masterCategory.create({
        data: { name: cat.name, description: cat.description }
      });
    }

    for (const item of cat.items) {
      let jukugoRec = await prisma.jukugo.findFirst({
        where: { kanjiId: kanji.id, word: item.word }
      });

      if (!jukugoRec) {
        jukugoRec = await prisma.jukugo.create({
          data: {
            kanjiId: kanji.id,
            word: item.word,
            reading: item.reading,
            meaning: item.meaning
          }
        });
      }

      const existingLink = await prisma.kategoriKanji.findFirst({
        where: { categoryId: masterCat.id, jokugoId: jukugoRec.id }
      });

      if (!existingLink) {
        await prisma.kategoriKanji.create({
          data: {
            categoryId: masterCat.id,
            jokugoId: jukugoRec.id
          }
        });
      }
    }
  }

  console.log(`✅ Seeded Jukugo and Categories for Kanji 究.`);
}
