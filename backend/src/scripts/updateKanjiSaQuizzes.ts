import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateSaQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '査' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 査 not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 査 (ID: ${kanji.id})...`);

  // Preserve grouping quiz if exists
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete non-grouping quizzes for kanji 査
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
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 質問の ・ 査問の ・ 準備して ・ 前に ・ おきます
      words: JSON.stringify(['質問の', '査問の', '準備して', '前に', 'おきます']),
      correctOrder: JSON.stringify(['査問の', '前に', '質問の', '準備して', 'おきます']),
      correctAnswer: '0',
      explanation: 'Jawaban: 査問の 前に 質問の 準備して おきます。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 考査のために ・ 思っています ・ 準備しようと ・ 来週の
      words: JSON.stringify(['考査のために', '思っています', '準備しようと', '来週の']),
      correctOrder: JSON.stringify(['来週の', '考査のために', '準備しようと', '思っています']),
      correctAnswer: '0',
      explanation: 'Jawaban: 来週の 考査のために 準備しようと 思っています。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 査定が ・ もう ・ してあります ・ 車の
      words: JSON.stringify(['査定が', 'もう', 'してあります', '車の']),
      correctOrder: JSON.stringify(['車の', '査定が', 'もう', 'してあります']),
      correctAnswer: '0',
      explanation: 'Jawaban: 車の 査定が もう してあります。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 実査を ・ です ・ 現場の ・ 予定 ・ 行う
      words: JSON.stringify(['実査を', 'です', '現場の', '予定', '行う']),
      correctOrder: JSON.stringify(['現場の', '実査を', '行う', '予定', 'です']),
      correctAnswer: '0',
      explanation: 'Jawaban: 現場の 実査を 行う 予定 です。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 検査を ・ 思っています ・ 体の ・ 受けようと
      words: JSON.stringify(['検査を', '思っています', '体の', '受けようと']),
      correctOrder: JSON.stringify(['体の', '検査を', '受けようと', '思っています']),
      correctAnswer: '0',
      explanation: 'Jawaban: 体の 検査を 受けようと 思っています。'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna "kegiatan memeriksa sesuatu secara teliti untuk meingetahui keadaannya"?',
      options: JSON.stringify(['検査', '調査', '査読']),
      correctAnswer: '1', // b. 調査
      explanation: 'Jawaban tepat: b. 調査 (chousa) - pemeriksaan/penyelidikan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna "pemeriksaan kesehatan di rumah sakit atau tempat medis"?',
      options: JSON.stringify(['番査', '検査', '査定']),
      correctAnswer: '1', // b. 検査
      explanation: 'Jawaban tepat: b. 検査 (kensa) - pemeriksaan kesehatan/medis.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna "penilaian atau penentuan nilai suatu barang atau kondisi"?',
      options: JSON.stringify(['査験', '精査', '査定']),
      correctAnswer: '2', // c. 査定
      explanation: 'Jawaban tepat: c. 査定 (satei) - penilaian/penentuan nilai.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna "pemeriksaan atau penyidikan formal terhadap suatu masalah atau pelanggaran"?',
      options: JSON.stringify(['査問', '査定', '精査']),
      correctAnswer: '0', // a. 査問
      explanation: 'Jawaban tepat: a. 査問 (samon) - interogasi/pemeriksaan formal.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo yang TIDAK lazim digunakan dalam bahasa Jepang adalah…',
      options: JSON.stringify(['調査', '査験', '査問']),
      correctAnswer: '1', // b. 査験
      explanation: 'Jawaban tepat: b. 査験 (bukan istilah standar jukugo).'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '体の具合が悪いんですが、病院で（　　　　）を受けたほうがいいです。',
      options: JSON.stringify(['検査', '点査', '内査']),
      correctAnswer: '0', // a. 検査
      explanation: 'Jawaban tepat: a. 検査 (kensa).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'この会社では、来週、実際の品物を見て（　　　　）する予定です。',
      options: JSON.stringify(['簡査', '内査', '実査']),
      correctAnswer: '2', // c. 実査
      explanation: 'Jawaban tepat: c. 実査 (jissa).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'この部分に問題があるかもしれませんから、もう一度（　　　　）してください。',
      options: JSON.stringify(['内査', '点査', '検査']),
      correctAnswer: '1', // b. 点査
      explanation: 'Jawaban tepat: b. 点査 (tensa).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '時間がありませんから、まず簡単に（　　{blank}　　）したほうがいいです。',
      options: JSON.stringify(['簡査', '実査', '点査']),
      correctAnswer: '0', // a. 簡査
      explanation: 'Jawaban tepat: a. 簡査 (kansa).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '会社の中で問題があるかもしれないので、まず（　　{blank}　　）することになりました。',
      options: JSON.stringify(['実査', '簡査', '内査']),
      correctAnswer: '2', // c. 内査
      explanation: 'Jawaban tepat: c. 内査 (naisa).'
    }
  ];

  for (const q of newQuizzes) {
    await prisma.quiz.create({
      data: q
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 査.`);
  if (groupingQuiz) {
    console.log(`Grouping quiz ID ${groupingQuiz.id} was retained intact.`);
  }

  await prisma.$disconnect();
}

updateSaQuizzes().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
