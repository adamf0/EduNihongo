import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function inspect() {
  const kanjiSa = await prisma.kanji.findFirst({ where: { character: "査" } });
  if (!kanjiSa) {
    console.log("Kanji 査 not found in DB.");
    return;
  }
  const kanjiId = kanjiSa.id;

  const sentences = await prisma.exampleSentence.findMany({
    where: { kanjiId }
  });

  const quizzes = await prisma.quiz.findMany({
    where: { kanjiId }
  });

  const refleksi = await prisma.masterRefleksi.findMany({
    where: { kanjiId }
  });

  console.log("=== EXAMPLE SENTENCES (Latihan Membaca) ===");
  console.log("Total Sentences:", sentences.length);
  sentences.forEach((s, i) => {
    console.log(`[${i+1}] ID: ${s.id}`);
    console.log(`    Japanese: ${s.japanese}`);
    console.log(`    Romaji:   ${s.romaji}`);
    console.log(`    Trans:    ${s.translation}`);
  });

  console.log("\n=== QUIZZES (Kuis Evaluasi) ===");
  console.log("Total Quizzes:", quizzes.length);
  quizzes.forEach((q, i) => {
    console.log(`\n[${i+1}] ID: ${q.id} | Type: ${q.type}`);
    console.log(`    Question:      ${q.question}`);
    console.log(`    Target Word:   ${q.targetWord}`);
    console.log(`    Correct Answer:${q.correctAnswer}`);
    console.log(`    Options:       ${q.options}`);
    console.log(`    Words:         ${q.words}`);
    console.log(`    Correct Order: ${q.correctOrder}`);
    console.log(`    Groups:        ${q.groups}`);
    console.log(`    Explanation:   ${q.explanation}`);
  });

  console.log("\n=== MASTER REFLEKSI (Refleksi) ===");
  console.log("Total Refleksi Questions:", refleksi.length);
  refleksi.forEach((r, i) => {
    console.log(`[${i+1}] ID: ${r.id} | Question: ${r.question}`);
  });
}

inspect()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
