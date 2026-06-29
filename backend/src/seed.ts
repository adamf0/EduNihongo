import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Registry of complete details for core kanji (using unique ID strings)
const customDetails: Record<string, {
  onyomi: string;
  kunyomi: string;
  examples: { japanese: string; romaji: string; translation: string }[];
  etymologies: { character: string; romaji: string; detail: string }[];
  graphNodes: { id: string; character: string; meaning: string; type: string; borderColor?: string; isPill?: boolean; parentPill?: string }[];
  graphEdges: { id: string; source: string; target: string }[];
}> = {
  "情報": {
    onyomi: "JOU, HOU",
    kunyomi: "なさ.け, むく.いる",
    examples: [
      { japanese: "正確な情報が必要です。", romaji: "Seikaku na jouhou ga hitsuyou desu.", translation: "Informasi yang akurat sangat diperlukan." },
      { japanese: "インターネットで情報を集める。", romaji: "Intaanetto de jouhou wo atsumeru.", translation: "Kumpulkan informasi di internet." }
    ],
    etymologies: [
      { character: "情", romaji: "JOU • Perasaan, Keadaan", detail: '"keadaan" atau "perasaan" dari segala hal. Mencerminkan kenyataan atau esensi yang mendasari.' },
      { character: "報", romaji: "HOU • Laporan, Berita", detail: "Mengumumkan atau memberi imbalan. Tindakan menyampaikan atau mengembalikan berita." }
    ],
    graphNodes: [
      { id: "情報-root", character: "情報", meaning: "INTI", type: "root" },
      { id: "情報-top-1", character: "情", meaning: "Perasaan", type: "top", borderColor: "border-blue-500" },
      { id: "情報-top-2", character: "報", meaning: "Laporan", type: "top", borderColor: "border-blue-500" },
      { id: "情報-bot-1", character: "感情", meaning: "Emosi", type: "bottom", borderColor: "border-green-500", isPill: true },
      { id: "情報-bot-2", character: "報告", meaning: "Laporan", type: "bottom", borderColor: "border-green-500", isPill: true },
      { id: "情報-sub-1", character: "愛着", meaning: "Keterikatan", type: "sub-bottom", parentPill: "情報-bot-1" },
      { id: "情報-sub-2", character: "理性を失う", meaning: "Hilang Akal", type: "sub-bottom", parentPill: "情報-bot-1" },
      { id: "情報-sub-3", character: "週報", meaning: "Laporan Mingguan", type: "sub-bottom", parentPill: "情報-bot-2" },
      { id: "情報-sub-4", character: "月報", meaning: "Laporan Bulanan", type: "sub-bottom", parentPill: "情報-bot-2" },
      { id: "情報-sub-5", character: "日報", meaning: "Laporan Harian", type: "sub-bottom", parentPill: "情報-bot-1" },
      { id: "情報-sub-6", character: "年報", meaning: "Laporan Tahunan", type: "sub-bottom", parentPill: "情報-bot-2" },
    ],
    graphEdges: [
      { id: "情報-e-top1-root", source: "情報-top-1", target: "情報-root" },
      { id: "情報-e-top2-root", source: "情報-top-2", target: "情報-root" },
      { id: "情報-e-root-bot1", source: "情報-root", target: "情報-bot-1" },
      { id: "情報-e-root-bot2", source: "情報-root", target: "情報-bot-2" },
      { id: "情報-e-bot1-sub1", source: "情報-bot-1", target: "情報-sub-1" },
      { id: "情報-e-bot1-sub2", source: "情報-bot-1", target: "情報-sub-2" },
      { id: "情報-e-bot2-sub3", source: "情報-bot-2", target: "情報-sub-3" },
      { id: "情報-e-bot2-sub4", source: "情報-bot-2", target: "情報-sub-4" },
      { id: "情報-e-bot1-sub5", source: "情報-bot-1", target: "情報-sub-5" },
      { id: "情報-e-bot2-sub6", source: "情報-bot-2", target: "情報-sub-6" },
    ]
  },
  "学": {
    onyomi: "GAKU",
    kunyomi: "まな.bu",
    examples: [
      { japanese: "日本語を学びます。", romaji: "Nihongo wo manabimasu.", translation: "Belajar bahasa Jepang." },
      { japanese: "彼は学校の生徒です。", romaji: "Kare wa gakkou no seito desu.", translation: "Dia adalah siswa sekolah." }
    ],
    etymologies: [
      { character: "子", romaji: "SHI • Anak", detail: "Anak kecil yang menerima ilmu bimbingan." },
      { character: "宀", romaji: "BEN • Atap", detail: "Atap bangunan tempat belajar atau sekolah." }
    ],
    graphNodes: [
      { id: "学-root", character: "学", meaning: "INTI", type: "root" },
      { id: "学-top-1", character: "子", meaning: "Anak", type: "top", borderColor: "border-blue-500" },
      { id: "学-top-2", character: "宀", meaning: "Atap", type: "top", borderColor: "border-blue-500" },
      { id: "学-bot-1", character: "学生", meaning: "Siswa", type: "bottom", borderColor: "border-green-500", isPill: true },
      { id: "学-bot-2", character: "科学", meaning: "Sains", type: "bottom", borderColor: "border-green-500", isPill: true }
    ],
    graphEdges: [
      { id: "学-e-top1-root", source: "学-top-1", target: "学-root" },
      { id: "学-e-top2-root", source: "学-top-2", target: "学-root" },
      { id: "学-e-root-bot1", source: "学-root", target: "学-bot-1" },
      { id: "学-e-root-bot2", source: "学-root", target: "学-bot-2" }
    ]
  },
  "学習": {
    onyomi: "GAKU, SHUU",
    kunyomi: "まな.bu, なら.う",
    examples: [
      { japanese: "効率的な学習法。", romaji: "Kouritsuteki na gakushuuhou.", translation: "Metode belajar yang efisien." },
      { japanese: "毎日学習することが大切です。", romaji: "Mainichi gakushuu suru koto ga taisetsu desu.", translation: "Penting untuk belajar setiap hari." }
    ],
    etymologies: [
      { character: "学", romaji: "GAKU • Belajar", detail: "Mempelajari pengetahuan." },
      { character: "習", romaji: "SHUU • Latihan", detail: "Mempraktikkan berulang kali seperti kepakan sayap burung muda." }
    ],
    graphNodes: [
      { id: "学習-root", character: "学習", meaning: "INTI", type: "root" },
      { id: "学習-top-1", character: "学", meaning: "Belajar", type: "top", borderColor: "border-blue-500" },
      { id: "学習-top-2", character: "習", meaning: "Latihan", type: "top", borderColor: "border-blue-500" },
      { id: "学習-bot-1", character: "学習者", meaning: "Pembelajar", type: "bottom", borderColor: "border-green-500", isPill: true }
    ],
    graphEdges: [
      { id: "学習-e-top1-root", source: "学習-top-1", target: "学習-root" },
      { id: "学習-e-top2-root", source: "学習-top-2", target: "学習-root" },
      { id: "学習-e-root-bot1", source: "学習-root", target: "学習-bot-1" }
    ]
  },
  "先生": {
    onyomi: "SEN, SEI",
    kunyomi: "さき, う.まれる",
    examples: [
      { japanese: "木村先生は優しいです。", romaji: "Kimura sensei wa yasashii desu.", translation: "Guru Kimura sangat baik hati." },
      { japanese: "先生に質問をします。", romaji: "Sensei ni shitsumon wo shimasu.", translation: "Mengajukan pertanyaan kepada guru." }
    ],
    etymologies: [
      { character: "先", romaji: "SEN • Dahulu", detail: "Berjalan di depan." },
      { character: "生", romaji: "SEI • Hidup", detail: "Tunas tanaman yang tumbuh dari bumi, melambangkan kehidupan." }
    ],
    graphNodes: [
      { id: "先生-root", character: "先生", meaning: "INTI", type: "root" },
      { id: "先生-top-1", character: "先", meaning: "Dahulu", type: "top", borderColor: "border-blue-500" },
      { id: "先生-top-2", character: "生", meaning: "Hidup", type: "top", borderColor: "border-blue-500" },
      { id: "先生-bot-1", character: "先月", meaning: "Bulan Lalu", type: "bottom", borderColor: "border-green-500", isPill: true },
      { id: "先生-bot-2", character: "生活", meaning: "Kehidupan", type: "bottom", borderColor: "border-green-500", isPill: true }
    ],
    graphEdges: [
      { id: "先生-e-top1-root", source: "先生-top-1", target: "先生-root" },
      { id: "先生-e-top2-root", source: "先生-top-2", target: "先生-root" },
      { id: "先生-e-root-bot1", source: "先生-root", target: "先生-bot-1" },
      { id: "先生-e-root-bot2", source: "先生-root", target: "先生-bot-2" }
    ]
  }
};

// Helper generator to provide fallback details for other kanji
const getKanjiDetails = (char: string, meaning: string, romaji: string, defaultOnyomi?: string, defaultKunyomi?: string) => {
  if (customDetails[char]) {
    return customDetails[char];
  }
  
  const firstChar = char.charAt(0);
  const lastChar = char.length > 1 ? char.charAt(1) : "生";
  const labelMeaning = meaning.split("/")[0] || meaning;

  return {
    onyomi: defaultOnyomi || "GAKU",
    kunyomi: defaultKunyomi || "manabu",
    examples: [
      { japanese: `私は${char}をよく使います。`, romaji: `Watashi wa ${romaji.toLowerCase()} wo yoku tsukaimasu.`, translation: `Saya sering menggunakan ${labelMeaning.toLowerCase()}.` },
      { japanese: `${char}を勉強することはおもしろい。`, romaji: `${romaji} wo benkyou suru koto wa omoshiroi.`, translation: `Mempelajari ${labelMeaning.toLowerCase()} itu menyenangkan.` }
    ],
    etymologies: [
      { character: firstChar, romaji: `${firstChar} • Komponen Pokok`, detail: `Elemen pembentuk utama yang mewakili dasar arti dari ${labelMeaning.toLowerCase()}.` },
      { character: lastChar, romaji: `${lastChar} • Pelengkap`, detail: `Komponen semantik tambahan untuk menyempurnakan makna.` }
    ],
    graphNodes: [
      { id: `${char}-root`, character: char, meaning: "INTI", type: "root" },
      { id: `${char}-top-1`, character: firstChar, meaning: "Radikal", type: "top", borderColor: "border-blue-500" },
      { id: `${char}-top-2`, character: lastChar, meaning: "Suku Kata", type: "top", borderColor: "border-blue-500" },
      { id: `${char}-bot-1`, character: char + "生", meaning: "Turunan 1", type: "bottom", borderColor: "border-green-500", isPill: true },
      { id: `${char}-bot-2`, character: "大" + char, meaning: "Turunan 2", type: "bottom", borderColor: "border-green-500", isPill: true }
    ],
    graphEdges: [
      { id: `${char}-e-top1-root`, source: `${char}-top-1`, target: `${char}-root` },
      { id: `${char}-e-top2-root`, source: `${char}-top-2`, target: `${char}-root` },
      { id: `${char}-e-root-bot1`, source: `${char}-root`, target: `${char}-bot-1` },
      { id: `${char}-e-root-bot2`, source: `${char}-root`, target: `${char}-bot-2` }
    ]
  };
};

async function main() {
  console.log("Seeding started...");

  // Clear existing data
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
  console.log("Admin seeded: ", admin);

  // 2. Create User Activity Logs
  const activitiesData: any[] = [];
  
  await prisma.userActivity.createMany({
    data: activitiesData,
  });
  console.log("Activities seeded: ", activitiesData.length);



  // 4. Create Modules
  const modulesData = [
    { title: "Module 1", isCompleted: false, isLocked: false },
    { title: "Module 2", isCompleted: false, isLocked: true },
    { title: "Module 3", isCompleted: false, isLocked: true },
    { title: "Module 4", isCompleted: false, isLocked: true },
    { title: "Module 5", isCompleted: false, isLocked: true },
  ];

  const seededModules = [];
  for (const m of modulesData) {
    const module = await prisma.module.create({
      data: {
        title: m.title,
      },
    });
    
    await prisma.userModuleProgress.create({
      data: {
        userId: user.id,
        moduleId: module.id,
        isCompleted: m.isCompleted,
        isLocked: m.isLocked,
        progressPercent: 0,
      },
    });
    
    seededModules.push(module);
  }
  console.log("Modules initialized");

  // 5. Create Kanji & Jukugo List
  const kanjiList = [
    { character: "情報", romaji: "Jouhou", meaning: "Informasi / Berita", onyomi: "JOU, HOU", kunyomi: "nasa.ke", border: "border-l-4 border-secondary", masteryPercent: 55, status: "LEARNING", moduleIndex: 0 },
    { character: "学", romaji: "Manabu", meaning: "Belajar, Studi", onyomi: "GAKU", kunyomi: "mana.bu", border: "border-l-4 border-primary", masteryPercent: 0, status: "LEARNING", moduleIndex: 0 },
    { character: "学習", romaji: "Gakushū", meaning: "Belajar, Pembelajaran", onyomi: "GAKU, SHUU", kunyomi: "mana.bu", border: "border-l-4 border-secondary", masteryPercent: 0, status: "LEARNING", moduleIndex: 0 },
    
    { character: "先生", romaji: "Sensei", meaning: "Guru, Penguasa", onyomi: "SEN, SEI", kunyomi: "saki", border: "border-l-4 border-primary", masteryPercent: 0, status: "LEARNING", moduleIndex: 1 },
    { character: "大学", romaji: "Daigaku", meaning: "Universitas", onyomi: "DAI, GAKU", kunyomi: "mana.bu", border: "border-l-4 border-tertiary", masteryPercent: 0, status: "LEARNING", moduleIndex: 1 },
    
    { character: "毎日", romaji: "Mainichi", meaning: "Setiap Hari", onyomi: "MAI, NICHI", kunyomi: "ひ", border: "border-l-4 border-secondary", masteryPercent: 0, status: "LEARNING", moduleIndex: 2 },
    { character: "曜", romaji: "Yō", meaning: "Hari dalam seminggu", onyomi: "YOU", kunyomi: "ひ", border: "border-l-4 border-primary", masteryPercent: 0, status: "LEARNING", moduleIndex: 2 },
    
    { character: "機", romaji: "Ki", meaning: "Mesin / Peluang", onyomi: "KI", kunyomi: "hata", border: "border-l-4 border-secondary", masteryPercent: 0, status: "LEARNING", moduleIndex: 3 },
    { character: "議", romaji: "Gi", meaning: "Musyawarah / Rapat", onyomi: "GI", kunyomi: "-", border: "border-l-4 border-primary", masteryPercent: 0, status: "LEARNING", moduleIndex: 3 },
    
    { character: "愛", romaji: "Ai", meaning: "Cinta / Kasih Sayang", onyomi: "AI", kunyomi: "itoshii", border: "border-l-4 border-primary", masteryPercent: 0, status: "LEARNING", moduleIndex: 4 },
    { character: "道", romaji: "Michi", meaning: "Jalan / Rute", onyomi: "DOU", kunyomi: "michi", border: "border-l-4 border-secondary", masteryPercent: 0, status: "LEARNING", moduleIndex: 4 },
    { character: "空", romaji: "Sora", meaning: "Langit / Kosong", onyomi: "KUU", kunyomi: "sora", border: "border-l-4 border-tertiary", masteryPercent: 0, status: "LEARNING", moduleIndex: 4 }
  ];

  for (const k of kanjiList) {
    const parentModule = seededModules[k.moduleIndex];
    const details = getKanjiDetails(k.character, k.meaning, k.romaji, k.onyomi, k.kunyomi);

    const kanji = await prisma.kanji.create({
      data: {
        character: k.character,
        romaji: k.romaji,
        meaning: k.meaning,
        onyomi: details.onyomi,
        kunyomi: details.kunyomi,
        isJukugo: k.character.length > 1,
        border: k.border,
        moduleId: parentModule.id,
      },
    });

    await prisma.userKanjiProgress.create({
      data: {
        userId: user.id,
        kanjiId: kanji.id,
        masteryPercent: k.masteryPercent,
        status: k.status,
        mistakeCount: 0,
      },
    });

    // Create sentences
    await prisma.exampleSentence.createMany({
      data: details.examples.map(ex => ({
        kanjiId: kanji.id,
        japanese: ex.japanese,
        romaji: ex.romaji,
        translation: ex.translation
      }))
    });



    // Create semantic graph nodes
    await prisma.kanjiGraphNode.createMany({
      data: details.graphNodes.map(gn => ({
        id: gn.id,
        kanjiId: kanji.id,
        character: gn.character,
        meaning: gn.meaning,
        type: gn.type,
        borderColor: gn.borderColor,
        isPill: gn.isPill,
        parentPill: gn.parentPill
      }))
    });

    // Create semantic graph edges
    await prisma.kanjiGraphEdge.createMany({
      data: details.graphEdges.map(ge => ({
        id: ge.id,
        kanjiId: kanji.id,
        source: ge.source,
        target: ge.target
      }))
    });
  }
  console.log("Kanji list seeded with full non-null examples, etymologies, and graphs");

  // 6. Recalculate module progress percentages
  for (const module of seededModules) {
    const linkedKanjis = await prisma.kanji.findMany({
      where: { moduleId: module.id },
      include: {
        userProgress: {
          where: { userId: user.id },
        },
      },
    });

    if (linkedKanjis.length > 0) {
      const totalProgress = linkedKanjis.reduce((sum, k) => {
        const mastery = k.userProgress[0]?.masteryPercent || 0;
        return sum + mastery;
      }, 0);
      const averageProgress = Math.round(totalProgress / linkedKanjis.length);

      await prisma.userModuleProgress.update({
        where: {
          userId_moduleId: {
            userId: user.id,
            moduleId: module.id,
          },
        },
        data: {
          progressPercent: averageProgress,
          isCompleted: averageProgress === 100,
        },
      });
    }
  }
  console.log("Module Progress updated dynamically");
  console.log("Seeding complete! Database is ready.");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
