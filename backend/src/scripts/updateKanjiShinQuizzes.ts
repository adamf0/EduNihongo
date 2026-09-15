import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateShinQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '信' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 信 not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 信 (ID: ${kanji.id})...`);

  // Preserve grouping quiz if exists
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete non-grouping quizzes for kanji 信
  await prisma.quiz.deleteMany({
    where: {
      kanjiId: kanji.id,
      type: { not: 'grouping' }
    }
  });

  const newQuizzes = [
    // --- UNSCRAMBLE QUIZZES (5) ---
    // Instruction from prompt: Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt chips 1: 情報を ・ 前に ・ 発信して ・ おきます ・ の
      words: JSON.stringify(['情報を', '前に', '発信して', 'おきます', 'の']),
      correctOrder: JSON.stringify(['の', '前に', '情報を', '発信して', 'おきます']),
      correctAnswer: '0',
      explanation: 'Jawaban: 会議の前に、情報を発信しておきます。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt chips 2: 信用を ・ うそを ・ つけば ・ なくします ・ ついたら
      words: JSON.stringify(['信用を', 'うそを', 'つけば', 'なくします', 'ついたら']),
      correctOrder: JSON.stringify(['うそを', 'ついたら', '信用を', 'なくします', 'つけば']),
      correctAnswer: '0',
      explanation: 'Jawaban: うそをつけたら、信用をなくします。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt chips 3: おいてあります ・ 大切な ・ の ・ 信書が ・ 上に
      words: JSON.stringify(['おいてあります', '大切な', 'の', '信書が', '上に']),
      correctOrder: JSON.stringify(['の', '上に', '大切な', '信書が', 'おいてあります']),
      correctAnswer: '0',
      explanation: 'Jawaban: 机の上に大切な信書がおいてあります。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt chips 4: あれば・ するでしょう ・ 信念が ・ く
      words: JSON.stringify(['あれば', 'するでしょう', '信念が', 'く']),
      correctOrder: JSON.stringify(['信念が', 'く', 'あれば', 'するでしょう']),
      correctAnswer: '0',
      explanation: 'Jawaban: 信念が強くあれば、せいこうするでしょう。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah soal rumpang dibawah ini menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt chips 5: 返信が ・ んです ・ まだ ・ 来ない
      words: JSON.stringify(['返信が', 'んです', 'まだ', '来ない']),
      correctOrder: JSON.stringify(['返信が', 'まだ', '来ない', 'んです']),
      correctAnswer: '0',
      explanation: 'Jawaban: 返信がまだ来ないんです。'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “kegiatan saling mengirim dan menerima pesan atau informasi antar dua pihak atau lebih”?',
      options: JSON.stringify(['通信', '信号', '信念']),
      correctAnswer: '0', // a. 通信
      explanation: 'Jawaban tepat: a. 通信 (tsuushin) - komunikasi.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “kegiatan mengirim pesan atau informasi kepada orang lain melalui suatu media”?',
      options: JSON.stringify(['発信', '自信', '信者']),
      correctAnswer: '0', // a. 発信
      explanation: 'Jawaban tepat: a. 発信 (hasshin) - pengiriman pesan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “tindakan membalas pesan atau surat yang telah diterima dari orang lain”?',
      options: JSON.stringify(['信頼', '返信', '信号']),
      correctAnswer: '1', // b. 返信
      explanation: 'Jawaban tepat: b. 返信 (henshin) - membalas pesan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “tanda yang digunakan untuk menyampaikan informasi atau petunjuk tertentu”?',
      options: JSON.stringify(['信書', '信義', '信号']),
      correctAnswer: '2', // c. 信号
      explanation: 'Jawaban tepat: c. 信号 (shingou) - tanda/sinyal.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “keyakinan atau prinsip yang diyakini dan dijadikan pegangan oleh seseorang”?',
      options: JSON.stringify(['信念', '信者', '自信']),
      correctAnswer: '0', // a. 信念
      explanation: 'Jawaban tepat: a. 信念 (shinnen) - keyakinan/prinsip.'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'インターネットを使って友達と（　　　　）しています。',
      options: JSON.stringify(['通信', '信号', '信念']),
      correctAnswer: '0', // a. 通信
      explanation: 'Jawaban tepat: a. 通信 (tsuushin).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'メールを受け取ったので、すぐに（　　　　）しました。',
      options: JSON.stringify(['信頼', '返信', '信用']),
      correctAnswer: '1', // b. 返信
      explanation: 'Jawaban tepat: b. 返信 (henshin).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '駅では赤い（　　　　）が見えたら、電車に注意してください。',
      options: JSON.stringify(['信号', '信者', '信念']),
      correctAnswer: '0', // a. 信号
      explanation: 'Jawaban tepat: a. 信号 (shingou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '彼は自分の力を信じる強い（　　　　）を持っています。',
      options: JSON.stringify(['自信', '信書', '信号']),
      correctAnswer: '0', // a. 自信
      explanation: 'Jawaban tepat: a. 自信 (jishin).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '私は約束を守る彼をとても（　　　　）しています。',
      options: JSON.stringify(['信号', '信頼', '信念']),
      correctAnswer: '1', // b. 信頼
      explanation: 'Jawaban tepat: b. 信頼 (shinrai).'
    }
  ];

  for (const q of newQuizzes) {
    await prisma.quiz.create({
      data: q
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 信.`);
  if (groupingQuiz) {
    console.log(`Grouping quiz ID ${groupingQuiz.id} was retained intact.`);
  }

  await prisma.$disconnect();
}

updateShinQuizzes().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
