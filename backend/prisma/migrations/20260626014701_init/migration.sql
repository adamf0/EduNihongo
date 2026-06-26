-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'N3',
    "levelName" TEXT NOT NULL DEFAULT 'Gerbang Besi',
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "streak" INTEGER NOT NULL DEFAULT 15,
    "totalXp" INTEGER NOT NULL DEFAULT 1240,
    "rank" TEXT NOT NULL DEFAULT 'Top 5% Learner',
    "masteryReading" INTEGER NOT NULL DEFAULT 88,
    "masteryWriting" INTEGER NOT NULL DEFAULT 65,
    "masteryVocabulary" INTEGER NOT NULL DEFAULT 74,
    "dailyTargetKanji" INTEGER NOT NULL DEFAULT 5,
    "dailyTargetVocab" INTEGER NOT NULL DEFAULT 10
);

-- CreateTable
CREATE TABLE "UserActivity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kanjiCount" INTEGER NOT NULL DEFAULT 0,
    "vocabCount" INTEGER NOT NULL DEFAULT 0,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "activityType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "UserActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "icon" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "bgClass" TEXT,
    "iconColor" TEXT
);

-- CreateTable
CREATE TABLE "UserBadge" (
    "userId" INTEGER NOT NULL,
    "badgeId" INTEGER NOT NULL,
    "unlockedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isUnlocked" BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY ("userId", "badgeId"),
    CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Module" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserModuleProgress" (
    "userId" INTEGER NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "progressPercent" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("userId", "moduleId"),
    CONSTRAINT "UserModuleProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserModuleProgress_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Kanji" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "character" TEXT NOT NULL,
    "romaji" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "onyomi" TEXT,
    "kunyomi" TEXT,
    "difficulty" TEXT NOT NULL DEFAULT 'N3',
    "isJukugo" BOOLEAN NOT NULL DEFAULT false,
    "border" TEXT
);

-- CreateTable
CREATE TABLE "UserKanjiProgress" (
    "userId" INTEGER NOT NULL,
    "kanjiId" INTEGER NOT NULL,
    "masteryPercent" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'LEARNING',
    "mistakeCount" INTEGER NOT NULL DEFAULT 0,
    "lastPracticed" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId", "kanjiId"),
    CONSTRAINT "UserKanjiProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserKanjiProgress_kanjiId_fkey" FOREIGN KEY ("kanjiId") REFERENCES "Kanji" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExampleSentence" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kanjiId" INTEGER NOT NULL,
    "japanese" TEXT NOT NULL,
    "romaji" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    CONSTRAINT "ExampleSentence_kanjiId_fkey" FOREIGN KEY ("kanjiId") REFERENCES "Kanji" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Etymology" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kanjiId" INTEGER NOT NULL,
    "character" TEXT NOT NULL,
    "romaji" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    CONSTRAINT "Etymology_kanjiId_fkey" FOREIGN KEY ("kanjiId") REFERENCES "Kanji" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KanjiGraphNode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kanjiId" INTEGER NOT NULL,
    "character" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "borderColor" TEXT,
    "isPill" BOOLEAN NOT NULL DEFAULT false,
    "parentPill" TEXT,
    CONSTRAINT "KanjiGraphNode_kanjiId_fkey" FOREIGN KEY ("kanjiId") REFERENCES "Kanji" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KanjiGraphEdge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kanjiId" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    CONSTRAINT "KanjiGraphEdge_kanjiId_fkey" FOREIGN KEY ("kanjiId") REFERENCES "Kanji" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Kanji_character_key" ON "Kanji"("character");
