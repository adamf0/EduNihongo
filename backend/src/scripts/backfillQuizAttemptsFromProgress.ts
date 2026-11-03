import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ModelCombination {
  rA: number | null;
  sA: number | null;
  maxA: number | null;
  rB: number | null;
  sB: number | null;
  maxB: number | null;
  rC: number | null;
  sC: number | null;
  maxC: number | null;
  rD: number | null;
  sD: number | null;
  maxD: number | null;
  totalScore: number;
}

/**
 * Finds realistic raw scores (rA, rB, rC, rD) whose model percentage scores
 * average out exactly to target totalScore (quizPercent).
 */
function findModelCombination(
  target: number,
  MA: number,
  MB: number,
  MC: number,
  MD: number
): ModelCombination {
  const hasA = MA > 0;
  const hasB = MB > 0;
  const hasC = MC > 0;
  const hasD = MD > 0;

  const activeCount = (hasA ? 1 : 0) + (hasB ? 1 : 0) + (hasC ? 1 : 0) + (hasD ? 1 : 0);

  // If only one model exists (e.g. only Model C multiple choice)
  if (activeCount === 1) {
    if (hasC) {
      const sC = target;
      const rC = Math.round((sC / 100) * MC);
      return {
        rA: null, sA: null, maxA: null,
        rB: null, sB: null, maxB: null,
        rC, sC, maxC: MC,
        rD: null, sD: null, maxD: null,
        totalScore: target,
      };
    }
  }

  let bestComb: { sA: number; sB: number; sC: number; sD: number } | null = null;
  let minVariance = Infinity;

  // Search range around target to keep individual model scores natural and balanced
  const rAMin = hasA ? Math.max(0, Math.floor(((target - 30) / 100) * MA)) : 0;
  const rAMax = hasA ? Math.min(MA, Math.ceil(((target + 30) / 100) * MA)) : 0;
  const rBMin = hasB ? Math.max(0, Math.floor(((target - 30) / 100) * MB)) : 0;
  const rBMax = hasB ? Math.min(MB, Math.ceil(((target + 30) / 100) * MB)) : 0;
  const rCMin = hasC ? Math.max(0, Math.floor(((target - 30) / 100) * MC)) : 0;
  const rCMax = hasC ? Math.min(MC, Math.ceil(((target + 30) / 100) * MC)) : 0;
  const rDMin = hasD ? Math.max(0, Math.floor(((target - 30) / 100) * MD)) : 0;
  const rDMax = hasD ? Math.min(MD, Math.ceil(((target + 30) / 100) * MD)) : 0;

  for (let rA = rAMin; rA <= rAMax; rA++) {
    const sA = hasA ? Math.round((rA / MA) * 100) : 0;
    for (let rB = rBMin; rB <= rBMax; rB++) {
      const sB = hasB ? Math.round((rB / MB) * 100) : 0;
      for (let rC = rCMin; rC <= rCMax; rC++) {
        const sC = hasC ? Math.round((rC / MC) * 100) : 0;
        for (let rD = rDMin; rD <= rDMax; rD++) {
          const sD = hasD ? Math.round((rD / MD) * 100) : 0;

          const activeSum = (hasA ? sA : 0) + (hasB ? sB : 0) + (hasC ? sC : 0) + (hasD ? sD : 0);
          const avg = Math.round(activeSum / activeCount);

          if (avg === target) {
            const varA = hasA ? Math.pow(sA - target, 2) : 0;
            const varB = hasB ? Math.pow(sB - target, 2) : 0;
            const varC = hasC ? Math.pow(sC - target, 2) : 0;
            const varD = hasD ? Math.pow(sD - target, 2) : 0;
            const totalVar = varA + varB + varC + varD;

            if (totalVar < minVariance) {
              minVariance = totalVar;
              bestComb = { sA, sB, sC, sD };
            }
          }
        }
      }
    }
  }

  let finalSA = bestComb ? bestComb.sA : (hasA ? target : 0);
  let finalSB = bestComb ? bestComb.sB : (hasB ? target : 0);
  let finalSC = bestComb ? bestComb.sC : (hasC ? target : 0);
  let finalSD = bestComb ? bestComb.sD : (hasD ? target : 0);

  // Guarantee that sum of active models equals EXACTLY (target * activeCount)
  const desiredSum = target * activeCount;
  let currentSum = (hasA ? finalSA : 0) + (hasB ? finalSB : 0) + (hasC ? finalSC : 0) + (hasD ? finalSD : 0);
  let diff = desiredSum - currentSum;

  const modelRefs = [
    { has: hasA, get s() { return finalSA; }, set s(v) { finalSA = v; } },
    { has: hasB, get s() { return finalSB; }, set s(v) { finalSB = v; } },
    { has: hasC, get s() { return finalSC; }, set s(v) { finalSC = v; } },
    { has: hasD, get s() { return finalSD; }, set s(v) { finalSD = v; } },
  ].filter((m) => m.has);

  while (diff !== 0) {
    let progressed = false;
    if (diff > 0) {
      for (const m of modelRefs) {
        if (m.s < 100 && diff > 0) {
          m.s++;
          diff--;
          progressed = true;
        }
      }
    } else {
      for (const m of modelRefs) {
        if (m.s > 0 && diff < 0) {
          m.s--;
          diff++;
          progressed = true;
        }
      }
    }
    if (!progressed) break;
  }

  // Derive realistic raw integer scores from final sanitized scores
  const rA = hasA ? Math.min(MA, Math.max(0, Math.round((finalSA / 100) * MA))) : null;
  const rB = hasB ? Math.min(MB, Math.max(0, Math.round((finalSB / 100) * MB))) : null;
  const rC = hasC ? Math.min(MC, Math.max(0, Math.round((finalSC / 100) * MC))) : null;
  const rD = hasD ? Math.min(MD, Math.max(0, Math.round((finalSD / 100) * MD))) : null;

  return {
    rA,
    sA: hasA ? finalSA : null,
    maxA: hasA ? MA : null,
    rB,
    sB: hasB ? finalSB : null,
    maxB: hasB ? MB : null,
    rC,
    sC: hasC ? finalSC : null,
    maxC: hasC ? MC : null,
    rD,
    sD: hasD ? finalSD : null,
    maxD: hasD ? MD : null,
    totalScore: target,
  };
}

/**
 * Builds realistic question-by-question feedback details array matching the raw scores.
 */
function buildQuestionDetails(
  quizzes: { unscramble: any[]; grouping: any[]; multiple: any[]; fill: any[] },
  comb: ModelCombination
): any[] {
  const details: any[] = [];

  // Model A: Unscramble (rubric score 0..4 per question)
  if (comb.rA !== null && quizzes.unscramble.length > 0) {
    let remainingA = comb.rA;
    quizzes.unscramble.forEach((q, idx) => {
      const qScore = Math.min(4, Math.max(0, Math.round(remainingA / (quizzes.unscramble.length - idx))));
      remainingA -= qScore;
      const wordsArr = Array.isArray(q.words) ? q.words : [];
      const studentAns = wordsArr.join("");
      details.push({
        question: q.question || "Susunlah kata-kata berikut ini menjadi kalimat yang benar.",
        type: "unscramble",
        studentAnswer: studentAns,
        correctAnswer: studentAns,
        isCorrect: qScore === 4,
        rubricScore: qScore,
      });
    });
  }

  // Model B: Grouping
  if (comb.rB !== null && quizzes.grouping.length > 0) {
    const q = quizzes.grouping[0];
    const maxB = comb.maxB || 10;
    const rawB = comb.rB;
    details.push({
      question: q.question || "Kelompokkan jukugo berikut ke dalam kategori yang tepat!",
      type: "grouping",
      studentAnswer: "Rincian pengelompokan jukugo",
      correctAnswer: "Kunci kategori semantik",
      isCorrect: rawB === maxB,
      groupingRatio: maxB > 0 ? rawB / maxB : 0,
      groupingRaw: rawB,
      groupingMax: maxB,
    });
  }

  // Model C: Multiple Choice
  if (comb.rC !== null && quizzes.multiple.length > 0) {
    const rawC = comb.rC;
    quizzes.multiple.forEach((q, idx) => {
      const isCorrect = idx < rawC;
      details.push({
        question: q.question || "Pilihlah jawaban yang paling tepat.",
        type: "multiple",
        studentAnswer: isCorrect ? "Jawaban Benar" : "Jawaban Siswa",
        correctAnswer: "Jawaban Benar",
        isCorrect,
      });
    });
  }

  // Model D: Fill in the blank
  if (comb.rD !== null && quizzes.fill.length > 0) {
    const rawD = comb.rD;
    quizzes.fill.forEach((q, idx) => {
      const isCorrect = idx < rawD;
      details.push({
        question: q.question || "Lengkapilah kalimat berikut dengan kosakata yang sesuai.",
        type: "fill",
        studentAnswer: isCorrect ? "Pilihan Benar" : "Pilihan Siswa",
        correctAnswer: "Pilihan Benar",
        isCorrect,
      });
    });
  }

  return details;
}

async function main() {
  console.log("================================================================================");
  console.log("  BACKFILL QUIZATTEMPT DARI USERKANJIPROGRESS (QUIZPERCENT > 0)");
  console.log("  Aturan ketat: Dilarang mengubah data tabel apapun selain QuizAttempt!");
  console.log("================================================================================\n");

  // 1. Fetch UserKanjiProgress sorted by quizPercent DESC (as requested)
  const progresses = await prisma.userKanjiProgress.findMany({
    where: { quizPercent: { gt: 0 } },
    orderBy: { quizPercent: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      kanji: { select: { id: true, character: true, romaji: true } },
    },
  });

  console.log(`Ditemukan ${progresses.length} baris UserKanjiProgress dengan quizPercent > 0.`);

  // 2. Fetch all Quiz questions to get exact max counts and words per kanji
  const allQuizzes = await prisma.quiz.findMany({
    select: { id: true, kanjiId: true, type: true, words: true, question: true },
  });

  const kanjiQuizMap = new Map<number, { unscramble: any[]; grouping: any[]; multiple: any[]; fill: any[] }>();
  for (const q of allQuizzes) {
    if (!kanjiQuizMap.has(q.kanjiId)) {
      kanjiQuizMap.set(q.kanjiId, { unscramble: [], grouping: [], multiple: [], fill: [] });
    }
    const bucket = kanjiQuizMap.get(q.kanjiId)!;
    if (q.type === "unscramble") bucket.unscramble.push(q);
    else if (q.type === "grouping") bucket.grouping.push(q);
    else if (q.type === "multiple") bucket.multiple.push(q);
    else if (q.type === "fill") bucket.fill.push(q);
  }

  let insertedCount = 0;
  let updatedCount = 0;
  let skippedExistingCount = 0;

  for (let i = 0; i < progresses.length; i++) {
    const p = progresses[i];
    const targetScore = Math.min(100, Math.max(0, Math.round(p.quizPercent)));

    // Check existing attempts for this user and kanji
    const existingAttempts = await prisma.quizAttempt.findMany({
      where: { userId: p.userId, kanjiId: p.kanjiId },
      orderBy: { attemptNumber: "asc" },
    });

    // Determine questions structure for this kanji
    const qInfo = kanjiQuizMap.get(p.kanjiId) || { unscramble: [], grouping: [], multiple: [], fill: [] };
    const MA = qInfo.unscramble.length * 4;
    let MB = 0;
    if (qInfo.grouping.length > 0) {
      try {
        const parsed = JSON.parse(qInfo.grouping[0].words || "[]");
        MB = Array.isArray(parsed) && parsed.length > 0 ? parsed.length : 10;
      } catch {
        MB = 10;
      }
    }
    const MC = qInfo.multiple.length;
    const MD = qInfo.fill.length;

    // Check if an attempt matching this exact totalScore already exists
    const exactAttempt = existingAttempts.find((a) => a.totalScore === targetScore);
    if (exactAttempt) {
      const activeCount = (exactAttempt.scoreModelA !== null ? 1 : 0) +
        (exactAttempt.scoreModelB !== null ? 1 : 0) +
        (exactAttempt.scoreModelC !== null ? 1 : 0) +
        (exactAttempt.scoreModelD !== null ? 1 : 0);
      const activeSum = (exactAttempt.scoreModelA ?? 0) +
        (exactAttempt.scoreModelB ?? 0) +
        (exactAttempt.scoreModelC ?? 0) +
        (exactAttempt.scoreModelD ?? 0);

      // If already exact integer average matching targetScore, skip
      if (activeCount > 0 && activeSum === targetScore * activeCount) {
        skippedExistingCount++;
        continue;
      }

      // Re-calculate with exact integer-sum solver
      const comb = findModelCombination(targetScore, MA, MB, MC, MD);
      const details = buildQuestionDetails(qInfo, comb);

      await prisma.quizAttempt.update({
        where: { id: exactAttempt.id },
        data: {
          scoreModelA: comb.sA,
          rawModelA: comb.rA,
          maxModelA: comb.maxA,
          scoreModelB: comb.sB,
          rawModelB: comb.rB,
          maxModelB: comb.maxB,
          scoreModelC: comb.sC,
          rawModelC: comb.rC,
          maxModelC: comb.maxC,
          scoreModelD: comb.sD,
          rawModelD: comb.rD,
          maxModelD: comb.maxD,
          details: JSON.stringify(details),
        },
      });

      updatedCount++;
      continue;
    }

    const attemptNumber = existingAttempts.length + 1;
    const isNewBest = existingAttempts.length === 0 || targetScore >= Math.max(...existingAttempts.map((a) => a.totalScore));

    // If new best, ensure older attempts have isBestAttempt = false
    if (isNewBest && existingAttempts.length > 0) {
      await prisma.quizAttempt.updateMany({
        where: { userId: p.userId, kanjiId: p.kanjiId, isBestAttempt: true },
        data: { isBestAttempt: false },
      });
    }

    // Find model combination whose average matches targetScore
    const comb = findModelCombination(targetScore, MA, MB, MC, MD);

    // Interpretation rubric
    let interpretation = "Perlu Penguatan";
    if (targetScore >= 86) interpretation = "Sangat Baik";
    else if (targetScore >= 76) interpretation = "Baik";
    else if (targetScore >= 66) interpretation = "Cukup";

    // Build question feedback details
    const details = buildQuestionDetails(qInfo, comb);

    // Creation date from lastPracticed or fallback
    const createdAt = p.lastPracticed ? new Date(p.lastPracticed) : new Date();

    await prisma.quizAttempt.create({
      data: {
        userId: p.userId,
        kanjiId: p.kanjiId,
        attemptNumber,
        scoreModelA: comb.sA,
        rawModelA: comb.rA,
        maxModelA: comb.maxA,
        scoreModelB: comb.sB,
        rawModelB: comb.rB,
        maxModelB: comb.maxB,
        scoreModelC: comb.sC,
        rawModelC: comb.rC,
        maxModelC: comb.maxC,
        scoreModelD: comb.sD,
        rawModelD: comb.rD,
        maxModelD: comb.maxD,
        totalScore: targetScore,
        interpretation,
        isBestAttempt: isNewBest,
        details: JSON.stringify(details),
        createdAt,
      },
    });

    insertedCount++;
    if (insertedCount % 50 === 0 || insertedCount === progresses.length) {
      console.log(`[Progress] Berhasil memasukkan ${insertedCount} QuizAttempt...`);
    }
  }

  console.log("\n================================================================================");
  console.log("  SELESAI BACKFILL");
  console.log(`  - Total baris UserKanjiProgress diproses : ${progresses.length}`);
  console.log(`  - QuizAttempt baru yang di-insert       : ${insertedCount}`);
  console.log(`  - QuizAttempt yang diperbarui (exact)   : ${updatedCount}`);
  console.log(`  - Dilewati karena attempt sudah ada     : ${skippedExistingCount}`);
  console.log("================================================================================");
}

main()
  .catch((err) => {
    console.error("Backfill error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
