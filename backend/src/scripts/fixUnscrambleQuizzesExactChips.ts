import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixUnscrambleChips() {
  console.log('Fixing unscramble quiz chips for Kanji 験 and Kanji 試...');

  // ==========================================
  // 1. KANJI 験 (ID: 3213)
  // ==========================================
  const kanjiKen = await prisma.kanji.findFirst({
    where: { character: '験' }
  });

  if (kanjiKen) {
    // Remove existing unscramble quizzes for Kanji 験
    await prisma.quiz.deleteMany({
      where: {
        kanjiId: kanjiKen.id,
        type: 'unscramble'
      }
    });

    const kenUnscrambleQuizzes = [
      {
        kanjiId: kanjiKen.id,
        type: 'unscramble',
        question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
        options: JSON.stringify([]),
        // Exact chips from prompt: 明日 ・ 試験 ・ が ・ から ・ 勉強します ・ ある ・ の点数
        words: JSON.stringify(['明日', '試験', 'が', 'から', '勉強します', 'ある', 'の点数']),
        correctOrder: JSON.stringify(['明日', '試験', 'が', 'ある', 'から', '勉強します']),
        correctAnswer: '0',
        explanation: 'Jawaban: 明日、試験があるから、勉強します。'
      },
      {
        kanjiId: kanjiKen.id,
        type: 'unscramble',
        question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
        options: JSON.stringify([]),
        // Exact chips from prompt: 経験 ・ 働いた ・ が ・ あります ・ 日本で
        words: JSON.stringify(['経験', '働いた', 'が', 'あります', '日本で']),
        correctOrder: JSON.stringify(['日本で', '働いた', '経験', 'が', 'あります']),
        correctAnswer: '0',
        explanation: 'Jawaban: 日本で働いた経験があります。'
      },
      {
        kanjiId: kanjiKen.id,
        type: 'unscramble',
        question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
        options: JSON.stringify([]),
        // Exact chips from prompt: 文化 ・ を ・ 体験しました ・ 京都 ・ で
        words: JSON.stringify(['文化', 'を', '体験しました', '京都', 'で']),
        correctOrder: JSON.stringify(['京都', 'で', '文化', 'を', '体験しました']),
        correctAnswer: '0',
        explanation: 'Jawaban: 京都で文化を体験しました。'
      },
      {
        kanjiId: kanjiKen.id,
        type: 'unscramble',
        question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
        options: JSON.stringify([]),
        // Exact chips from prompt: 実験 ・ を ・ 料理室 ・ しました ・ で
        words: JSON.stringify(['実験', 'を', '料理室', 'しました', 'で']),
        correctOrder: JSON.stringify(['料理室', 'で', '実験', 'を', 'しました']),
        correctAnswer: '0',
        explanation: 'Jawaban: 料理室で実験をしました。'
      },
      {
        kanjiId: kanjiKen.id,
        type: 'unscramble',
        question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
        options: JSON.stringify([]),
        // Exact chips from prompt: 受検しようと ・ 日本語の ・ 思っています ・ 試験を
        words: JSON.stringify(['受検しようと', '日本語の', '思っています', '試験を']),
        correctOrder: JSON.stringify(['日本語の', '試験を', '受検しようと', '思っています']),
        correctAnswer: '0',
        explanation: 'Jawaban: 日本語の試験を受検しようと思っています。'
      }
    ];

    for (const q of kenUnscrambleQuizzes) {
      await prisma.quiz.create({ data: q });
    }
    console.log(`Updated 5 unscramble quizzes for Kanji 験 with exact prompt chips.`);
  }

  // ==========================================
  // 2. KANJI 試 (ID: 3212)
  // ==========================================
  const kanjiShi = await prisma.kanji.findFirst({
    where: { character: '試' }
  });

  if (kanjiShi) {
    // Remove existing unscramble quizzes for Kanji 試
    await prisma.quiz.deleteMany({
      where: {
        kanjiId: kanjiShi.id,
        type: 'unscramble'
      }
    });

    const shiUnscrambleQuizzes = [
      {
        kanjiId: kanjiShi.id,
        type: 'unscramble',
        question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
        options: JSON.stringify([]),
        // Exact chips: ありました ・ 試合 ・ きのう ・ が
        words: JSON.stringify(['ありました', '試合', 'きのう', 'が']),
        correctOrder: JSON.stringify(['きのう', '試合', 'が', 'ありました']),
        correctAnswer: '0',
        explanation: 'Jawaban: きのう試合がありました。'
      },
      {
        kanjiId: kanjiShi.id,
        type: 'unscramble',
        question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
        options: JSON.stringify([]),
        // Exact chips: 試食 ・ しました ・ 新しいパンを ・ スーパーで
        words: JSON.stringify(['試食', 'しました', '新しいパンを', 'スーパーで']),
        correctOrder: JSON.stringify(['スーパーで', '新しいパンを', '試食', 'しました']),
        correctAnswer: '0',
        explanation: 'Jawaban: スーパーで新しいパンを試食しました。'
      },
      {
        kanjiId: kanjiShi.id,
        type: 'unscramble',
        question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
        options: JSON.stringify([]),
        // Exact chips: 試飲 ・ けさ ・ ジャム ・ しました ・ 田中さん ・ を ・ は
        words: JSON.stringify(['試飲', 'けさ', 'ジャム', 'しました', '田中さん', 'を', 'は']),
        correctOrder: JSON.stringify(['田中さん', 'は', 'けさ', 'ジャム', 'を', '試飲', 'しました']),
        correctAnswer: '0',
        explanation: 'Jawaban: 田中さんはけさジャムを試飲しました。'
      },
      {
        kanjiId: kanjiShi.id,
        type: 'unscramble',
        question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
        options: JSON.stringify([]),
        // Exact chips: します ・ 前に ・ 試乗 ・ 買う ・ 新しい車を ・ まず
        words: JSON.stringify(['します', '前に', '試乗', '買う', '新しい車を', 'まず']),
        correctOrder: JSON.stringify(['新しい車を', '買う', '前に', 'まず', '試乗', 'します']),
        correctAnswer: '0',
        explanation: 'Jawaban: 新しい車を買う前に、まず試乗します。'
      },
      {
        kanjiId: kanjiShi.id,
        type: 'unscramble',
        question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
        options: JSON.stringify([]),
        // Exact chips: あったので ・ 昨日 ・ 休みました ・ 試合が ・ 大学を
        words: JSON.stringify(['あったので', '昨日', '休みました', '試合が', '大学を']),
        correctOrder: JSON.stringify(['昨日', '試合が', 'あったので', '大学を', '休みました']),
        correctAnswer: '0',
        explanation: 'Jawaban: 昨日試合があったので、大学をやすみました。'
      }
    ];

    for (const q of shiUnscrambleQuizzes) {
      await prisma.quiz.create({ data: q });
    }
    console.log(`Updated 5 unscramble quizzes for Kanji 試 with exact prompt chips.`);
  }

  await prisma.$disconnect();
}

fixUnscrambleChips().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
