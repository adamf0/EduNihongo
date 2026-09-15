import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateMuQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '務' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 務 not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 務 (ID: ${kanji.id})...`);

  // Preserve grouping quiz if exists
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete non-grouping quizzes for kanji 務
  await prisma.quiz.deleteMany({
    where: {
      kanjiId: kanji.id,
      type: { not: 'grouping' }
    }
  });

  const newQuizzes = [
    // --- UNSCRAMBLE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 1: 業務の ・ マニュアルが ・ おいてあります ・ 机に
      words: JSON.stringify(['業務の', 'マニュアルが', 'おいてあります', '机に']),
      correctOrder: JSON.stringify(['机に', '業務の', 'マニュアルが', 'おいてあります']),
      correctAnswer: '0',
      explanation: 'Jawaban: 机に業務のマニュアルがおいてあります。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 2: 用務員室へ ・ んです ・ 用務が ・ 行く ・ あるから
      words: JSON.stringify(['用務員室へ', 'んです', '用務が', '行く', 'あるから']),
      correctOrder: JSON.stringify(['用務が', 'あるから', '用務員室へ', '行く', 'んです']),
      correctAnswer: '0',
      explanation: 'Jawaban: 用務があるから用務員室へ行くんです。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 3: 教務課に ・ 書類を ・ 前に ・ 出して ・ おきます
      words: JSON.stringify(['教務課に', '書類を', '前に', '出して', 'おきます']),
      correctOrder: JSON.stringify(['前に', '教務課に', '書類を', '出して', 'おきます']),
      correctAnswer: '0',
      explanation: 'Jawaban: 前に教務課に書類を出しておきます。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 4: 法務部に ・ 確認した ・ ほうが ・ 先に ・ いいです
      words: JSON.stringify(['法務部に', '確認した', 'ほうが', '先に', 'いいです']),
      correctOrder: JSON.stringify(['先に', '法務部に', '確認した', 'ほうが', 'いいです']),
      correctAnswer: '0',
      explanation: 'Jawaban: 先に法務部に確認したほうがいいです。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 5: 労務が ・ 大変に ・ になるかもしれません ・ 急に
      words: JSON.stringify(['労務が', '大変に', 'になるかもしれません', '急に']),
      correctOrder: JSON.stringify(['急に', '労務が', '大変に', 'になるかもしれません']),
      correctAnswer: '0',
      explanation: 'Jawaban: 急に労務が大変になるかもしれません。'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “pekerjaan atau tugas yang dilakukan dalam suatu kegiatan atau usaha”?',
      options: JSON.stringify(['業務', '任務', '財務']),
      correctAnswer: '0', // a. 業務
      explanation: 'Jawaban tepat: a. 業務 (gyoumu) - pekerjaan/tugas.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “tugas atau pekerjaan yang berkaitan dengan suatu jabatan”?',
      options: JSON.stringify(['職務', '用務', '労務']),
      correctAnswer: '0', // a. 職務
      explanation: 'Jawaban tepat: a. 職務 (shokumu) - tugas jabatan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “kegiatan bekerja atau menjalankan tugas dalam suatu pekerjaan”?',
      options: JSON.stringify(['義務', '勤務', '法務']),
      correctAnswer: '1', // b. 勤務
      explanation: 'Jawaban tepat: b. 勤務 (kinmu) - bekerja/menjalankan tugas.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “tugas atau misi yang dipercayakan kepada seseorang”?',
      options: JSON.stringify(['任務', '実務', '教務']),
      correctAnswer: '0', // a. 任務
      explanation: 'Jawaban tepat: a. 任務 (ninmu) - tugas/misi.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “kewajiban yang harus dilakukan atau dipenuhi”?',
      options: JSON.stringify(['公務', '義務', '服務']),
      correctAnswer: '1', // b. 義務
      explanation: 'Jawaban tepat: b. 義務 (gimu) - kewajiban.'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '会社で毎日（　　　　）をしています。',
      options: JSON.stringify(['業務', '義務', '財務']),
      correctAnswer: '0', // a. 業務
      explanation: 'Jawaban tepat: a. 業務 (gyoumu).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '私は会社で営業の（　　　　）をしています。',
      options: JSON.stringify(['職務', '法務', '教務']),
      correctAnswer: '0', // a. 職務
      explanation: 'Jawaban tepat: a. 職務 (shokumu).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '父は会社に毎日（　　　　）しています。',
      options: JSON.stringify(['任務', '勤務', '財務']),
      correctAnswer: '1', // b. 勤務
      explanation: 'Jawaban tepat: b. 勤務 (kinmu).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'この仕事は私の（　　　　）ですから、しなければなりません。',
      options: JSON.stringify(['義務', '用務', '服務']),
      correctAnswer: '0', // a. 義務
      explanation: 'Jawaban tepat: a. 義務 (gimu).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '明日の会議について、資料を準備して（　　　　）必要があります。',
      options: JSON.stringify(['公務', '用務', '義務']),
      correctAnswer: '2', // c. 義務
      explanation: 'Jawaban tepat: c. 義務 (gimu).'
    }
  ];

  for (const q of newQuizzes) {
    await prisma.quiz.create({
      data: q
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 務.`);
  if (groupingQuiz) {
    console.log(`Grouping quiz ID ${groupingQuiz.id} was retained intact.`);
  }

  await prisma.$disconnect();
}

updateMuQuizzes().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
