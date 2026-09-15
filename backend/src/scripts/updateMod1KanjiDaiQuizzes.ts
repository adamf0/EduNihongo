import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateDaiQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '題' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 題 (Module 1) not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 題 (ID: ${kanji.id})...`);

  // Preserve grouping quiz
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete non-grouping quizzes for kanji 題
  await prisma.quiz.deleteMany({
    where: {
      kanjiId: kanji.id,
      type: { not: 'grouping' }
    }
  });

  const newQuizzes = [
    // --- UNSCRAMBLE QUIZZES (4) ---
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 質問 ・ 分からないこと ・ 先生 ・ が ・ に ・ します ・ ありますから (7 chips)
      words: JSON.stringify(['質問', '分からないこと', '先生', 'が', 'に', 'します', 'ありますから']),
      correctOrder: JSON.stringify(['分からないこと', 'が', 'ありますから', '先生', 'に', '質問', 'します']),
      correctAnswer: '0',
      explanation: 'Jawaban: 分からないことがありますから、先生に質問します。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: です ・ 調べたい ・ 本の ・ 主題を
      words: JSON.stringify(['です', '調べたい', '本の', '主題を']),
      correctOrder: JSON.stringify(['本の', '主題を', '調べたい', 'です']),
      correctAnswer: '0',
      explanation: 'Jawaban: 本の主題を調べたいです。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 10個 ・ 明日の ・ 試験は ・ あります ・ 問題が
      words: JSON.stringify(['10個', '明日の', '試験は', 'あります', '問題が']),
      correctOrder: JSON.stringify(['明日の', '試験は', '問題が', '10個', 'あります']),
      correctAnswer: '0',
      explanation: 'Jawaban: 明日の試験は問題が10個あります。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 読んで ・ を ・ ください ・ 設問
      words: JSON.stringify(['読んで', 'を', 'ください', '設問']),
      correctOrder: JSON.stringify(['設問', 'を', '読んで', 'ください']),
      correctAnswer: '0',
      explanation: 'Jawaban: 設問を読んでください。'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo yang mana digunakan untuk menyebut "judul sebuah buku, artikel, atau karya tulis"?',
      options: JSON.stringify(['主題', '題名', '話題']),
      correctAnswer: '1', // b. 題名
      explanation: 'Jawaban tepat: b. 題名 (daimei) - judul buku/karya.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang digunakan untuk menyebut "tugas yang diberikan oleh guru atau dosen"?',
      options: JSON.stringify(['題字', '論題', '課題']),
      correctAnswer: '2', // c. 課題
      explanation: 'Jawaban tepat: c. 課題 (kadai) - tugas.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang digunakan untuk menyebut “topik atau pokok yang menjadi bahan pembahasan atau penelitian”?',
      options: JSON.stringify(['主題', '論題', '話題']),
      correctAnswer: '0', // a. 主題
      explanation: 'Jawaban tepat: a. 主題 (shudai) - topik/pokok pembahasan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang digunakan untuk menyebut "topik pembicaraan dalam percakapan atau diskusi"?',
      options: JSON.stringify(['題名', '主題', '話題']),
      correctAnswer: '2', // c. 話題
      explanation: 'Jawaban tepat: c. 話題 (wadai) - topik pembicaraan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang digunakan untuk menyebut "bahan cerita atau materi yang digunakan untuk mebuat karya"?',
      options: JSON.stringify(['題材', '課題', '表題']),
      correctAnswer: '0', // a. 題材
      explanation: 'Jawaban tepat: a. 題材 (daizai) - bahan cerita/materi karya.'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '夏休みの（　　　　）はまだ終わっていません。',
      options: JSON.stringify(['宿題', '題材', '話題']),
      correctAnswer: '0', // a. 宿題
      explanation: 'Jawaban tepat: a. 宿題 (shukudai).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '卒業論文の（　　　　）が決まりました。',
      options: JSON.stringify(['題名', '出題', '問題意識']),
      correctAnswer: '0', // a. 題名
      explanation: 'Jawaban tepat: a. 題名 (daimei).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '先生は授業で新しい（　　　　）を出しました。',
      options: JSON.stringify(['話題', '課題', '題字']),
      correctAnswer: '1', // b. 課題
      explanation: 'Jawaban tepat: b. 課題 (kadai).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '最近、そのニュースがみんなの（　　　　）になっています。',
      options: JSON.stringify(['主題', '話題', '題材']),
      correctAnswer: '1', // b. 話題
      explanation: 'Jawaban tepat: b. 話題 (wadai).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'この小説は家族の愛について書かれているんですが、（　　　　）は「家族のきずな」です。',
      options: JSON.stringify(['出題', '題字', '主題']),
      correctAnswer: '2', // c. 主題
      explanation: 'Jawaban tepat: c. 主題 (shudai).'
    }
  ];

  for (const q of newQuizzes) {
    await prisma.quiz.create({
      data: q
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 題.`);
  if (groupingQuiz) {
    console.log(`Grouping quiz ID ${groupingQuiz.id} was retained intact.`);
  }

  await prisma.$disconnect();
}

updateDaiQuizzes().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
