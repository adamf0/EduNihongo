import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const KEN_MOD1_SEMANTIC_DATA = [
  // 1) Pengujian / Pembuktian
  {
    kanji: "試験",
    arti: "ujian / pengujian",
    penjelasan: "Hubungan makna antara kanji 試 dan 験 menjadi 試験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “suatu kegiatan pengujian yang dilakukan untuk mengetahui atau mengukur pengetahuan, kemampuan, maupun hasil seseorang atau sesuatu”, sehingga mengandung makna ujian atau pengujian.",
    nodes: [
      { jokugo: "試", arti: "mencoba, menguji" },
      { jokugo: "験", arti: "menguji, memverifikasi hasil" }
    ]
  },
  {
    kanji: "受験",
    arti: "mengikuti ujian",
    penjelasan: "Hubungan makna antara kanji 受 dan 験 menjadi 受験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “tindakan menerima atau menjalani suatu proses pengujian”, sehingga bermakna mengikuti ujian.",
    nodes: [
      { jokugo: "受", arti: "menerima, menjalani" },
      { jokugo: "験", arti: "ujian, pengujian" }
    ]
  },
  {
    kanji: "実験",
    arti: "eksperimen / percobaan",
    penjelasan: "Hubungan makna antara kanji 実 dan 験 menjadi 実験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan melakukan pengujian secara nyata atau praktis untuk membuktikan kebenaran suatu teori, hipotesis, atau fenomena.”",
    nodes: [
      { jokugo: "実", arti: "nyata, sungguh-sungguh, fakta" },
      { jokugo: "験", arti: "menguji, membuktikan" }
    ]
  },
  {
    kanji: "治験",
    arti: "uji klinis",
    penjelasan: "Hubungan makna antara kanji 治 dan 験 menjadi 治験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengujian yang dilakukan untuk mengobati atau menyembuhkan, khususnya dalam konteks uji klinis obat atau metode pengobatan baru.”",
    nodes: [
      { jokugo: "治", arti: "menyembuhkan, mengobati, mengatur" },
      { jokugo: "験", arti: "menguji, membuktikan" }
    ]
  },

  // 2) Pengalaman
  {
    kanji: "経験",
    arti: "pengalaman",
    penjelasan: "Hubungan makna antara kanji 経 dan 験 menjadi 経験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “proses melewati berbagai peristiwa atau keadaan yang kemudian diuji dan diverifikasi secara langsung melalui kehidupan nyata”, sehingga bermakna pengalaman.",
    nodes: [
      { jokugo: "経", arti: "melewati, melalui, mengalami" },
      { jokugo: "験", arti: "pengujian, verifikasi hasil, pengalaman" }
    ]
  },
  {
    kanji: "体験",
    arti: "pengalaman pribadi / pengalaman langsung",
    penjelasan: "Hubungan makna antara kanji 体 dan 験 menjadi 体験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “pengalaman yang dirasakan atau dialami secara langsung oleh tubuh dan diri sendiri.”",
    nodes: [
      { jokugo: "体", arti: "tubuh, diri sendiri" },
      { jokugo: "験", arti: "pengalaman, pengujian langsung" }
    ]
  },

  // 3) Verifikasi / Pemeriksaan
  {
    kanji: "験算",
    arti: "penghitungan ulang / verifikasi hitungan",
    penjelasan: "Hubungan makna antara kanji 験 dan 算 menjadi 験算, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “kegiatan memeriksa atau memverifikasi kembali hasil perhitungan untuk memastikan kebenarannya.”",
    nodes: [
      { jokugo: "験", arti: "memverifikasi, menguji" },
      { jokugo: "算", arti: "menghitung, perhitungan" }
    ]
  },

  // 4) Hasil / Efek / Bukti
  {
    kanji: "効験",
    arti: "khasiat / efektivitas / bukti hasil",
    penjelasan: "Hubungan makna antara kanji 効 dan 験 menjadi 効験, menunjukkan bahwa gabungan kedua kanji tersebut membentuk makna “bukti nyata dari adanya khasiat, kemanjuran, atau efektivitas dari suatu usaha, obat, maupun tindakan.”",
    nodes: [
      { jokugo: "効", arti: "berkhasiat, efektif, hasil" },
      { jokugo: "験", arti: "bukti, verifikasi hasil" }
    ]
  }
];

export async function seedSemanticRelationKenMod1() {
  const kanji = await prisma.kanji.findFirst({ where: { character: "験" } });
  if (!kanji) {
    console.error("Kanji 験 not found");
    return;
  }

  await prisma.semanticRelation.deleteMany({ where: { kanjiId: kanji.id } });

  for (const item of KEN_MOD1_SEMANTIC_DATA) {
    const matchedJukugo = await prisma.jukugo.findFirst({
      where: { kanjiId: kanji.id, word: item.kanji }
    });

    const createdSem = await prisma.semanticRelation.create({
      data: {
        kanjiId: kanji.id,
        jukugoId: matchedJukugo?.id || null,
        penjelasan: item.penjelasan,
      }
    });

    if (item.nodes && item.nodes.length > 0) {
      await prisma.semanticRelationNode.createMany({
        data: item.nodes.map(n => ({
          semanticId: createdSem.id,
          jokugo: n.jokugo,
          arti: n.arti
        }))
      });
    }
  }
  console.log(`✅ Seeded ${KEN_MOD1_SEMANTIC_DATA.length} SemanticRelation records for Kanji 験.`);
}
