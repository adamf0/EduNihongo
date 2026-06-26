import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");

  // Clear existing data
  await prisma.kanjiGraphEdge.deleteMany();
  await prisma.kanjiGraphNode.deleteMany();
  await prisma.etymology.deleteMany();
  await prisma.exampleSentence.deleteMany();
  await prisma.userKanjiProgress.deleteMany();
  await prisma.kanji.deleteMany();
  await prisma.userModuleProgress.deleteMany();
  await prisma.module.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.userActivity.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create User (Haruki Sato)
  const passwordHash = await bcrypt.hash("haruki123", 10);
  const user = await prisma.user.create({
    data: {
      email: "haruki@sato.com",
      password: passwordHash,
      name: "Haruki Sato",
      level: "N3",
      levelName: "Gerbang Besi",
      streak: 15,
      totalXp: 1240,
      rank: "Top 5% Learner",
      masteryReading: 88,
      masteryWriting: 65,
      masteryVocabulary: 74,
      dailyTargetKanji: 5,
      dailyTargetVocab: 10,
      joinedAt: new Date("2023-10-01T00:00:00Z"),
    },
  });
  console.log("User seeded: ", user.name);

  // 2. Create User Activity Logs (Heatmap activity)
  // Deterministic opacities: 42 days of activity leading up to current date
  const now = new Date();
  const activitiesData = [];
  for (let i = 42; i >= 0; i--) {
    const activityDate = new Date(now);
    activityDate.setDate(now.getDate() - i);
    
    // Generate pseudo-random learning density
    const opacityIdx = (i * 7 + 13) % 5; // 0 to 4
    let kanjiCount = 0;
    let vocabCount = 0;
    let xpEarned = 0;
    
    if (opacityIdx > 0) {
      kanjiCount = opacityIdx * 2;
      vocabCount = opacityIdx * 3;
      xpEarned = opacityIdx * 15;
      
      activitiesData.push({
        userId: user.id,
        date: activityDate,
        kanjiCount,
        vocabCount,
        xpEarned,
        activityType: "LESSON",
        description: `Menyelesaikan ${kanjiCount} Kanji & ${vocabCount} Kosakata`,
      });
    }
  }
  
  // Add some specific recent activity logs
  activitiesData.push({
    userId: user.id,
    date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    kanjiCount: 2,
    vocabCount: 4,
    xpEarned: 45,
    activityType: "LESSON",
    description: "Menyelesaikan Sesi Belajar Kanji N3 Bab 4",
  });
  
  activitiesData.push({
    userId: user.id,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    kanjiCount: 5,
    vocabCount: 10,
    xpEarned: 100,
    activityType: "ACHIEVEMENT",
    description: "Pencapaian Baru: \"Brush Master II\" (100 Kanji terkuasai)",
  });
  
  activitiesData.push({
    userId: user.id,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    kanjiCount: 0,
    vocabCount: 20,
    xpEarned: 30,
    activityType: "REVIEW",
    description: "Review Harian: 20 Kanji dipelajari ulang dengan Akurasi 95%",
  });

  await prisma.userActivity.createMany({
    data: activitiesData,
  });
  console.log("Activities seeded: ", activitiesData.length);

  // 3. Create Badges
  const badges = [
    {
      icon: "star_shine",
      title: "Gerbang Torii",
      description: "Menyelesaikan 100 Kanji N5",
      bgClass: "bg-secondary-container",
      iconColor: "text-on-secondary-container",
    },
    {
      icon: "festival",
      title: "Lampion Festival",
      description: "30 Hari Belajar Beruntun",
      bgClass: "bg-primary-fixed-dim",
      iconColor: "text-on-primary-fixed-variant",
    },
    {
      icon: "yard",
      title: "Bunga Sakura",
      description: "Kuasai 500 Kanji N2",
    },
    {
      icon: "castle",
      title: "Kastil Himeji",
      description: "Kuasai Seluruh Kanji Joyo",
    },
  ];

  for (const b of badges) {
    const badge = await prisma.badge.create({ data: b });
    // Unlock first two badges
    if (b.title === "Gerbang Torii" || b.title === "Lampion Festival") {
      await prisma.userBadge.create({
        data: {
          userId: user.id,
          badgeId: badge.id,
          isUnlocked: true,
        },
      });
    }
  }
  console.log("Badges seeded");

  // 4. Create Modules
  const modules = [
    // Radicals
    { title: "Komponen Radikal", level: "N4", category: "RADICAL", difficulty: "N4", isCompleted: true, isLocked: false, progressPercent: 100 },
    { title: "Masterclass Urutan Goresan", level: "N4", category: "RADICAL", difficulty: "N4", isCompleted: true, isLocked: false, progressPercent: 100 },
    { title: "Mnemonik Visual (Terkunci)", level: "N4", category: "RADICAL", difficulty: "N4", isCompleted: false, isLocked: true, progressPercent: 0 },
    // Kanji
    { title: "24 Kanji Gerbang Besi Esensial", level: "N3", category: "KANJI", difficulty: "N3", isCompleted: true, isLocked: false, progressPercent: 100 },
    { title: "Variasi Kunyomi Tahap 1", level: "N3", category: "KANJI", difficulty: "N3", isCompleted: false, isLocked: false, progressPercent: 32 },
    { title: "Latihan Audio Onyomi", level: "N3", category: "KANJI", difficulty: "N3", isCompleted: false, isLocked: false, progressPercent: 0 },
    // Vocabulary
    { title: "Kata Kerja Majemuk", level: "N3", category: "VOCABULARY", difficulty: "N3", isCompleted: false, isLocked: true, progressPercent: 0 },
    { title: "Konsep Abstrak dalam Teks", level: "N3", category: "VOCABULARY", difficulty: "N3", isCompleted: false, isLocked: true, progressPercent: 0 },
  ];

  for (const m of modules) {
    const module = await prisma.module.create({
      data: {
        title: m.title,
        level: m.level,
        category: m.category,
        difficulty: m.difficulty,
      },
    });
    
    await prisma.userModuleProgress.create({
      data: {
        userId: user.id,
        moduleId: module.id,
        isCompleted: m.isCompleted,
        isLocked: m.isLocked,
        progressPercent: m.progressPercent,
      },
    });
  }
  console.log("Modules and UserModuleProgress seeded");

  // 5. Create Kanji & Compound Jukugo
  const kanjiList = [
    {
      character: "情報",
      romaji: "じょうほう • Jouhou",
      meaning: "Informasi / Berita",
      onyomi: "JOU, HOU",
      kunyomi: "なさ.け, むく.いる",
      difficulty: "N3",
      isJukugo: true,
      border: "border-l-4 border-secondary",
      masteryPercent: 84,
      status: "LEARNING",
    },
    {
      character: "学習",
      romaji: "Gakushū",
      meaning: "Belajar, Pembelajaran",
      difficulty: "N3",
      isJukugo: true,
      border: "border-l-4 border-secondary",
      masteryPercent: 75,
      status: "LEARNING",
    },
    {
      character: "先生",
      romaji: "Sensei",
      meaning: "Guru, Penguasa",
      difficulty: "N4",
      isJukugo: true,
      border: "border-l-4 border-primary",
      masteryPercent: 90,
      status: "MASTERED",
    },
    {
      character: "大学",
      romaji: "Daigaku",
      meaning: "Universitas",
      difficulty: "N3",
      isJukugo: true,
      border: "border-l-4 border-tertiary",
      masteryPercent: 60,
      status: "LEARNING",
    },
    {
      character: "毎日",
      romaji: "Mainichi",
      meaning: "Setiap Hari",
      difficulty: "N3",
      isJukugo: true,
      border: "border-l-4 border-secondary",
      masteryPercent: 85,
      status: "LEARNING",
    },
    // Focus Review Kanji (High mistakes)
    {
      character: "曜",
      romaji: "Yō",
      meaning: "Day of the week",
      difficulty: "N3",
      isJukugo: false,
      masteryPercent: 45,
      status: "REVIEW",
      mistakeCount: 5,
    },
    {
      character: "機",
      romaji: "Ki",
      meaning: "Machine/Opportunity",
      difficulty: "N3",
      isJukugo: false,
      masteryPercent: 50,
      status: "REVIEW",
      mistakeCount: 4,
    },
    {
      character: "議",
      romaji: "Gi",
      meaning: "Deliberation",
      difficulty: "N3",
      isJukugo: false,
      masteryPercent: 55,
      status: "REVIEW",
      mistakeCount: 3,
    },
    // Mastered Kanji Collection
    {
      character: "愛",
      romaji: "Ai",
      meaning: "Love / Affection",
      difficulty: "N3",
      isJukugo: false,
      masteryPercent: 100,
      status: "MASTERED",
    },
    {
      character: "道",
      romaji: "Michi",
      meaning: "Road / Way",
      difficulty: "N3",
      isJukugo: false,
      masteryPercent: 100,
      status: "MASTERED",
    },
    {
      character: "空",
      romaji: "Sora",
      meaning: "Sky / Empty",
      difficulty: "N3",
      isJukugo: false,
      masteryPercent: 100,
      status: "MASTERED",
    },
  ];

  for (const k of kanjiList) {
    const kanji = await prisma.kanji.create({
      data: {
        character: k.character,
        romaji: k.romaji,
        meaning: k.meaning,
        onyomi: k.onyomi,
        kunyomi: k.kunyomi,
        difficulty: k.difficulty,
        isJukugo: k.isJukugo,
        border: k.border,
      },
    });

    await prisma.userKanjiProgress.create({
      data: {
        userId: user.id,
        kanjiId: kanji.id,
        masteryPercent: k.masteryPercent,
        status: k.status,
        mistakeCount: k.mistakeCount || 0,
      },
    });

    // Seed sentences, etymology and graph specifically for "情報"
    if (k.character === "情報") {
      // Examples
      await prisma.exampleSentence.createMany({
        data: [
          {
            kanjiId: kanji.id,
            japanese: "正確な情報が必要です。",
            romaji: "Seikaku na jouhou ga hitsuyou desu.",
            translation: "Informasi yang akurat sangat diperlukan.",
          },
          {
            kanjiId: kanji.id,
            japanese: "インターネットで情報を集める。",
            romaji: "Intaanetto de jouhou wo atsumeru.",
            translation: "Kumpulkan informasi di internet.",
          },
        ],
      });

      // Etymology
      await prisma.etymology.createMany({
        data: [
          {
            kanjiId: kanji.id,
            character: "情",
            romaji: "JOU • Perasaan, Keadaan",
            detail: '"keadaan" atau "perasaan" dari segala hal. Mencerminkan kenyataan atau esensi yang mendasari.',
          },
          {
            kanjiId: kanji.id,
            character: "報",
            romaji: "HOU • Laporan, Berita",
            detail: "Mengumumkan atau memberi imbalan. Tindakan menyampaikan atau mengembalikan berita.",
          },
        ],
      });

      // Semantic Graph Nodes
      const graphNodes = [
        { id: "root", kanjiId: kanji.id, character: "情報", meaning: "INTI", type: "root" },
        { id: "top-1", kanjiId: kanji.id, character: "情", meaning: "Perasaan", type: "top", borderColor: "border-blue-500" },
        { id: "top-2", kanjiId: kanji.id, character: "報", meaning: "Laporan", type: "top", borderColor: "border-blue-500" },
        { id: "bot-1", kanjiId: kanji.id, character: "感情", meaning: "Emosi", type: "bottom", borderColor: "border-green-500", isPill: true },
        { id: "bot-2", kanjiId: kanji.id, character: "報告", meaning: "Laporan", type: "bottom", borderColor: "border-green-500", isPill: true },
        { id: "sub-1", kanjiId: kanji.id, character: "愛着", meaning: "Keterikatan", type: "sub-bottom", parentPill: "bot-1" },
        { id: "sub-2", kanjiId: kanji.id, character: "理性を失う", meaning: "Hilang Akal", type: "sub-bottom", parentPill: "bot-1" },
        { id: "sub-3", kanjiId: kanji.id, character: "週報", meaning: "Laporan Mingguan", type: "sub-bottom", parentPill: "bot-2" },
        { id: "sub-4", kanjiId: kanji.id, character: "月報", meaning: "Laporan Bulanan", type: "sub-bottom", parentPill: "bot-2" },
        { id: "sub-5", kanjiId: kanji.id, character: "日報", meaning: "Laporan Harian", type: "sub-bottom", parentPill: "bot-1" },
        { id: "sub-6", kanjiId: kanji.id, character: "年報", meaning: "Laporan Tahunan", type: "sub-bottom", parentPill: "bot-2" },
      ];

      await prisma.kanjiGraphNode.createMany({
        data: graphNodes,
      });

      // Semantic Graph Edges
      const graphEdges = [
        { id: "e-top1-root", kanjiId: kanji.id, source: "top-1", target: "root" },
        { id: "e-top2-root", kanjiId: kanji.id, source: "top-2", target: "root" },
        { id: "e-root-bot1", kanjiId: kanji.id, source: "root", target: "bot-1" },
        { id: "e-root-bot2", kanjiId: kanji.id, source: "root", target: "bot-2" },
        { id: "e-bot1-sub1", kanjiId: kanji.id, source: "bot-1", target: "sub-1" },
        { id: "e-bot1-sub2", kanjiId: kanji.id, source: "bot-1", target: "sub-2" },
        { id: "e-bot2-sub3", kanjiId: kanji.id, source: "bot-2", target: "sub-3" },
        { id: "e-bot2-sub4", kanjiId: kanji.id, source: "bot-2", target: "sub-4" },
        { id: "e-bot1-sub5", kanjiId: kanji.id, source: "bot-1", target: "sub-5" },
        { id: "e-bot2-sub6", kanjiId: kanji.id, source: "bot-2", target: "sub-6" },
      ];

      await prisma.kanjiGraphEdge.createMany({
        data: graphEdges,
      });
    }
  }
  console.log("Kanji, Example Sentences, Etymology, and Graph seeded successfully");
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
