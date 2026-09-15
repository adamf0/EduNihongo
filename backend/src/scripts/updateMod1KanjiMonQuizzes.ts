import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateMonQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '問' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 問 (Module 1) not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 問 (ID: ${kanji.id})...`);

  // Preserve grouping quiz
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete non-grouping quizzes for kanji 問
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
      // Exact chips from prompt: あったら、・先生・が・問題/質問・に・もし・聞いて下さい
      words: JSON.stringify(['あったら', '先生', 'が', '問題', '質問', 'に', 'もし', '聞いて下さい']),
      correctOrder: JSON.stringify(['もし', '質問', 'が', 'あったら', '先生', 'に', '聞いて下さい']),
      correctAnswer: '0',
      explanation: 'Jawaban: もし質問があったら、先生に聞いて下さい。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Exact chips from prompt: 質問 ・ 先生 ・ が ・ あるん ・ に ・ です
      words: JSON.stringify(['質問', '先生', 'が', 'あるん', 'に', 'です']),
      correctOrder: JSON.stringify(['先生', 'に', '質問', 'が', 'あるん', 'です']),
      correctAnswer: '0',
      explanation: 'Jawaban: 先生に質問があるんです。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Exact chips from prompt: 設問 ・ ・ 書いて ・ が ・ に ・ あります
      words: JSON.stringify(['設問', 'に', '書いて', 'あります']),
      correctOrder: JSON.stringify(['設問', 'に', '書いて', 'あります']),
      correctAnswer: '0',
      explanation: 'Jawaban: 設問に書いてあります。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Exact chips from prompt: 反問した ・ ん ・ 先生 ・ です ・ に ・ 彼は
      words: JSON.stringify(['反問した', 'ん', '先生', 'です', 'に', '彼は']),
      correctOrder: JSON.stringify(['彼は', '先生', 'に', '反問した', 'ん', 'です']),
      correctAnswer: '0',
      explanation: 'Jawaban: 彼は先生に反問したんです。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Exact chips from prompt: 予定 ・ を ・ 先生の家 ・ です ・ 来週 ・ 訪問する
      words: JSON.stringify(['予定', 'を', '先生の家', 'です', '来週', '訪問する']),
      correctOrder: JSON.stringify(['来週', '先生の家', 'を', '訪問する', '予定', 'です']),
      correctAnswer: '0',
      explanation: 'Jawaban: 来週、先生の家を訪問する予定です。'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan kegiatan wawancara medis?',
      options: JSON.stringify(['設問', '問診', '質問']),
      correctAnswer: '1', // b. 問診
      explanation: 'Jawaban tepat: b. 問診 (monshin) - wawancara medis.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “pertanyaan yang diajukan untuk memperoleh informasi atau penjelasan"?',
      options: JSON.stringify(['質問', '問答', '問題']),
      correctAnswer: '0', // a. 質問
      explanation: 'Jawaban tepat: a. 質問 (shitsumon) - pertanyaan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo apa yang berhubungan dengan kegiatan “bertanya kepada diri sendiri"?',
      options: JSON.stringify(['発問', '自問', '設問']),
      correctAnswer: '1', // b. 自問
      explanation: 'Jawaban tepat: b. 自問 (jimon) - bertanya kepada diri sendiri.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “bertanya kembali kepada orang yang telah mengajukan pertanyaan"?',
      options: JSON.stringify(['自問', '質問', '反問']),
      correctAnswer: '2', // c. 反問
      explanation: 'Jawaban tepat: c. 反問 (hanmon) - bertanya kembali.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan kegiatan “menguji seseorang dengan memberikan pertanyaan"?',
      options: JSON.stringify(['問診', '試問', '難問']),
      correctAnswer: '1', // b. 試問
      explanation: 'Jawaban tepat: b. 試問 (shimon) - menguji dengan pertanyaan.'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'この問題は難しいんですが、先生に（　　　　）してもいいですか。',
      options: JSON.stringify(['訪問', '質問', '検問']),
      correctAnswer: '1', // b. 質問
      explanation: 'Jawaban tepat: b. 質問 (shitsumon).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '日本語の勉強で何か（　　　　）があるんですが、先生に聞いてもいいですか。',
      options: JSON.stringify(['問題', '問診', '訪問']),
      correctAnswer: '0', // a. 問題
      explanation: 'Jawaban tepat: a. 問題 (mondai).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '病院では最初に（　　　　）を受けます。',
      options: JSON.stringify(['問診', '問答', '設問']),
      correctAnswer: '0', // a. 問診
      explanation: 'Jawaban tepat: a. 問診 (monshin).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'この（　　　　）に答えたら、次のページを見てください。',
      options: JSON.stringify(['問答', '設問', '訪問']),
      correctAnswer: '1', // b. 設問
      explanation: 'Jawaban tepat: b. 設問 (setsumon).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '明日（　　{blank}　　）があるかもしれませんから、よく勉強しておきます。',
      options: JSON.stringify(['問責', '自問', '試問']),
      correctAnswer: '2', // c. 試問
      explanation: 'Jawaban tepat: c. 試問 (shimon).'
    }
  ];

  // Clean question 5 fill text to standard bracket representation:
  newQuizzes[14].question = '明日（　　　　）があるかもしれませんから、よく勉強しておきます。';

  for (const q of newQuizzes) {
    await prisma.quiz.create({
      data: q
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 問.`);
  if (groupingQuiz) {
    console.log(`Grouping quiz ID ${groupingQuiz.id} was retained intact.`);
  }

  await prisma.$disconnect();
}

updateMonQuizzes().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
