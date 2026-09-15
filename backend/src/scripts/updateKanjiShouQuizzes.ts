import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateShouQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '商' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 商 not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 商 (ID: ${kanji.id})...`);

  // Preserve grouping quiz if exists
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete non-grouping quizzes for kanji 商
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
      // Prompt 1: 商社で ・ 働こうと ・ 有名な ・ 思っています
      words: JSON.stringify(['商社で', '働こうと', '有名な', '思っています']),
      correctOrder: JSON.stringify(['有名な', '商社で', '働こうと', '思っています']),
      correctAnswer: '0',
      explanation: 'Jawaban: 有名な商社で働こうと思っています。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 2: いいです・ した ・商談の ・ ほうが いいです・前に
      words: JSON.stringify(['いいです', 'した', '商談の', 'ほうが', '前に']),
      correctOrder: JSON.stringify(['商談の', '前に', 'した', 'ほうが', 'いいです']),
      correctAnswer: '0',
      explanation: 'Jawaban: 商談の前に準備したほうがいいです。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 3: んです ・ 書類を ・商工会議所に ・ 出す
      words: JSON.stringify(['んです', '書類を', '商工会議所に', '出す']),
      correctOrder: JSON.stringify(['商工会議所に', '書類を', '出す', 'んです']),
      correctAnswer: '0',
      explanation: 'Jawaban: 商工会議所に書類を出すんです。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 4: 港に ・ 到着するかもしれません・大きな 商船が
      words: JSON.stringify(['港に', '到着するかもしれません', '大きな', '商船が']),
      correctOrder: JSON.stringify(['港に', '大きな', '商船が', '到着するかもしれません']),
      correctAnswer: '0',
      explanation: 'Jawaban: 港に大きな商船が到着するかもしれません。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut menjadi kalimat yang tepat.',
      options: JSON.stringify([]),
      // Prompt 5: 会社の ・ 商号を ・ 変更して ・ おきます ・ 事前に
      words: JSON.stringify(['会社の', '商号を', '変更して', 'おきます', '事前に']),
      correctOrder: JSON.stringify(['事前に', '会社の', '商号を', '変更して', 'おきます']),
      correctAnswer: '0',
      explanation: 'Jawaban: 事前に会社の商号を変更しておきます。'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “toko atau tempat untuk melakukan kegiatan perdagangan”?',
      options: JSON.stringify(['商店', '商品', '商人']),
      correctAnswer: '0', // a. 商店
      explanation: 'Jawaban tepat: a. 商店 (shouten) - toko.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “kawasan yang terdiri atas toko-toko”?',
      options: JSON.stringify(['商社', '商店街', '商売']),
      correctAnswer: '1', // b. 商店街
      explanation: 'Jawaban tepat: b. 商店街 (shoutengai) - kawasan pertokoan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “barang atau produk yang diperjualbelikan”?',
      options: JSON.stringify(['商人', '商業', '商品']),
      correctAnswer: '2', // c. 商品
      explanation: 'Jawaban tepat: c. 商品 (shouhin) - barang produk.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “kegiatan bisnis atau perdagangan”?',
      options: JSON.stringify(['商売', '商店', '商人']),
      correctAnswer: '0', // a. 商売
      explanation: 'Jawaban tepat: a. 商売 (shoubai) - kegiatan bisnis.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “kegiatan usaha dalam bidang perdagangan”?',
      options: JSON.stringify(['商業', '商社', '商店街']),
      correctAnswer: '0', // a. 商業
      explanation: 'Jawaban tepat: a. 商業 (shougyou) - bidang perdagangan.'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '駅の近くに新しい（　　　　）ができました。',
      options: JSON.stringify(['商店', '商品', '商人']),
      correctAnswer: '0', // a. 商店
      explanation: 'Jawaban tepat: a. 商店 (shouten).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'デパートで新しい（　　　　）を買いました。',
      options: JSON.stringify(['商店街', '商品', '商社']),
      correctAnswer: '1', // b. 商品
      explanation: 'Jawaban tepat: b. 商品 (shouhin).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '父は会社で（　　　　）の仕事をしています。',
      options: JSON.stringify(['商取引', '商人', '商店']),
      correctAnswer: '0', // a. 商取引
      explanation: 'Jawaban tepat: a. 商取引 (shoutorihiki).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '日本の（　　　　）について勉強しています。',
      options: JSON.stringify(['商業', '商店', '商品']),
      correctAnswer: '0', // a. 商業
      explanation: 'Jawaban tepat: a. 商業 (shougyou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'この店ではいろいろな商品を（　　　　）しています。',
      options: JSON.stringify(['商人', '商店街', '商売']),
      correctAnswer: '2', // c. 商売
      explanation: 'Jawaban tepat: c. 商売 (shoubai).'
    }
  ];

  for (const q of newQuizzes) {
    await prisma.quiz.create({
      data: q
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 商.`);
  if (groupingQuiz) {
    console.log(`Grouping quiz ID ${groupingQuiz.id} was retained intact.`);
  }

  await prisma.$disconnect();
}

updateShouQuizzes().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
