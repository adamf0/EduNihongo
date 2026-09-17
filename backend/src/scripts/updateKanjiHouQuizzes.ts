import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateHouQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '報' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 報 not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 報 (ID: ${kanji.id})...`);

  // Preserve grouping quiz if exists
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete non-grouping quizzes for kanji 報
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
      // Scrambled pool from prompt: 日報 ・ に ・ テーブル ・ が ・ おいてあります ・ の ・ 上
      words: JSON.stringify(['日報', 'に', 'テーブル', 'が', 'おいてあります', 'の', '上']),
      correctOrder: JSON.stringify(['テーブル', 'の', '上', 'に', '日報', 'が', 'おいてあります']),
      correctAnswer: '0',
      explanation: 'Jawaban: テーブルの上に日報がおいてあります。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 通報した ・ に ・ ほうが ・ すぐ ・ いいです
      words: JSON.stringify(['通報した', 'に', 'ほうが', 'すぐ', 'いいです']),
      correctOrder: JSON.stringify(['すぐ', 'に', '通報した', 'ほうが', 'いいです']),
      correctAnswer: '0',
      explanation: 'Jawaban: すぐに通報したほうがいいです。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 集めている ・ 情報を ・ 新しい ・ んです
      words: JSON.stringify(['集めている', '情報を', '新しい', 'んです']),
      correctOrder: JSON.stringify(['新しい', '情報を', '集めている', 'んです']),
      correctAnswer: '0',
      explanation: 'Jawaban: 新しい情報を集めているんです。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 待ちます ・ 確報 ・ を ・ 聞きながら ・ ニュース ・ を
      words: JSON.stringify(['待ちます', '確報', 'を', '聞きながら', 'ニュース', 'を']),
      correctOrder: JSON.stringify(['ニュース', 'を', '聞きながら', '確報', 'を', '待ちます']),
      correctAnswer: '0',
      explanation: 'Jawaban: ニュースを聞きながら確報を待ちます。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 方がいいですよ ・ ニュースの報道を ・ 見た ・ よく
      words: JSON.stringify(['方がいいですよ', 'ニュースの報道を', '見た', 'よく']),
      correctOrder: JSON.stringify(['ニュースの報道を', 'よく', '見た', '方がいいですよ']),
      correctAnswer: '0',
      explanation: 'Jawaban: ニュースの報道を よく 見た 方がいいですよ'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo apa yang berhubungan dengan makna “informasi atau keterangan mengenai suatu hal“?',
      options: JSON.stringify(['悲報', '情報', '返報']),
      correctAnswer: '1', // b. 情報
      explanation: 'Jawaban tepat: b. 情報 (jouhou) - informasi.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo apa yang berhubungan dengan makna “memberitahukan atau menyampaikan sesuatu agar diketahui oleh orang lain “?',
      options: JSON.stringify(['報知', '特報', '報復']),
      correctAnswer: '0', // a. 報知
      explanation: 'Jawaban tepat: a. 報知 (houchi) - memberitahukan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo apa yang berhubungan dengan makna “berita yang disampaikan dengan cepat mengenai suatu peristiwa yang baru terjadi “?',
      options: JSON.stringify(['続報', '勝報', '速報']),
      correctAnswer: '2', // c. 速報
      explanation: 'Jawaban tepat: c. 速報 (sokuhou) - berita cepat.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo apa yang berhubungan dengan makna “informasi atau pemberitaan yang disampaikan secara luas kepada masyarakat “?',
      options: JSON.stringify(['外報', '広報', '悲報']),
      correctAnswer: '1', // b. 広報
      explanation: 'Jawaban tepat: b. 広報 (kouhou) - publikasi.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo apa yang berhubungan dengan makna “ memberikan balasan terhadap suatu tindakan yang telah diterima “?',
      options: JSON.stringify(['予報', '報告', '報復']),
      correctAnswer: '2', // c. 報復
      explanation: 'Jawaban tepat: c. 報復 (houfuku) - pembalasan.'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '地震が起きたので、テレビで最新の（　　　　）を確認しました。',
      options: JSON.stringify(['返報', '情報', '報復']),
      correctAnswer: '1', // b. 情報
      explanation: 'Jawaban tepat: b. 情報 (jouhou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '先生は学生に試験の日を（　　　　）しました。',
      options: JSON.stringify(['報知', '悲報', '外報']),
      correctAnswer: '0', // a. 報知
      explanation: 'Jawaban tepat: a. 報知 (houchi).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '会社は毎日、仕事の内容を（　　　　）にまとめています。',
      options: JSON.stringify(['公報', '日報', '特報']),
      correctAnswer: '1', // b. 日報
      explanation: 'Jawaban tepat: b. 日報 (nippou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '新聞でその事件についての（　　　　）を読みました。',
      options: JSON.stringify(['報道', '予報', '報復']),
      correctAnswer: '0', // a. 報道
      explanation: 'Jawaban tepat: a. 報道 (houdou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '天気（　　　　）によると、明日は雨が降るそうです。',
      options: JSON.stringify(['情報', '予報', '悲報']),
      correctAnswer: '1', // b. 予報
      explanation: 'Jawaban tepat: b. 予報 (yohou).'
    }
  ];

  for (const q of newQuizzes) {
    await prisma.quiz.create({
      data: q
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 報.`);
  if (groupingQuiz) {
    console.log(`Grouping quiz ID ${groupingQuiz.id} was retained intact.`);
  }

  await prisma.$disconnect();
}

updateHouQuizzes().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
