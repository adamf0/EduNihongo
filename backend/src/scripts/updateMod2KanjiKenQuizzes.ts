import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateKenQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '研' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 研 (Module 2) not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 研 (ID: ${kanji.id})...`);

  // Preserve grouping quiz
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete non-grouping quizzes for kanji 研
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
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 研鑽を ・ 積もうと ・ 技術の ・ 思っています
      words: JSON.stringify(['研鑽を', '積もうと', '技術の', '思っています']),
      correctOrder: JSON.stringify(['技術の', '研鑽を', '積もうと', '思っています']),
      correctAnswer: '0',
      explanation: 'Jawaban: 技術の研鑽を積もうと思っています。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 研習した ・ ほうが ・ です ・ しっかり ・ いい
      words: JSON.stringify(['研習した', 'ほうが', 'です', 'しっかり', 'いい']),
      correctOrder: JSON.stringify(['しっかり', '研習した', 'ほうが', 'いい', 'です']),
      correctAnswer: '0',
      explanation: 'Jawaban: しっかり研習したほうがいいです。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 学問を ・ 研精しながら ・ 書きます ・ 論文を
      words: JSON.stringify(['学問を', '研精しながら', '書きます', '論文を']),
      correctOrder: JSON.stringify(['学問を', '研精しながら', '論文を', '書きます']),
      correctAnswer: '0',
      explanation: 'Jawaban: 学問を研精しながら論文を書きます。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 資料 ・ 研修 ・ の ・ 前に ・ を ・ 準備して ・ おきます
      words: JSON.stringify(['資料', '研修', 'の', '前に', 'を', '準備して', 'おきます']),
      correctOrder: JSON.stringify(['研修', 'の', '前に', '資料', 'を', '準備して', 'おきます']),
      correctAnswer: '0',
      explanation: 'Jawaban: 研修の前に、資料を準備しておきます。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kata-kata berikut ini menjadi kalimat yang benar.',
      options: JSON.stringify([]),
      // Scrambled pool from prompt: 準備してあります ・ 研削の ・ 事前に ・ 工具が
      words: JSON.stringify(['準備してあります', '研削の', '事前に', '工具が']),
      correctOrder: JSON.stringify(['事前に', '研削の', '工具が', '準備してあります']),
      correctAnswer: '0',
      explanation: 'Jawaban: 事前に研削の工具が準備してあります。'
    },

    // --- MULTIPLE CHOICE QUIZZES (4) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan “kegiatan penelitian untuk memperoleh pengetahuan baru?',
      options: JSON.stringify(['研究', '研修', '研磨']),
      correctAnswer: '0', // a. 研究
      explanation: 'Jawaban tepat: a. 研究 (kenkyuu) - penelitian.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “mengasah atau memoles suatu benda agar permukaannya menjadi lebih halus"?',
      options: JSON.stringify(['研精', '研習', '研磨']),
      correctAnswer: '2', // c. 研磨
      explanation: 'Jawaban tepat: c. 研磨 (kenma) - mengasah/memoles.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “kegiatan belajar atau berlatih untuk meningkatkan pengetahuan dan kemampuan"?',
      options: JSON.stringify(['研精', '研削', '研修']),
      correctAnswer: '2', // c. 研修
      explanation: 'Jawaban tepat: c. 研修 (kenshuu) - pelatihan.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “terus belajar dan mendalami sesuatu untuk mengasah pengetahuan atau kemampuan"?',
      options: JSON.stringify(['研学', '研鑽', '研究']),
      correctAnswer: '1', // b. 研鑽
      explanation: 'Jawaban tepat: b. 研鑽 (kensan) - mendalami & mengasah kemampuan.'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '大学で日本語教育について（　　　　）するつもりです。',
      options: JSON.stringify(['研磨', '研究', '研削']),
      correctAnswer: '1', // b. 研究
      explanation: 'Jawaban tepat: b. 研究 (kenkyuu).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '来月、会社の新人（　　　　）に参加するんです。',
      options: JSON.stringify(['研修', '研精', '研磨']),
      correctAnswer: '0', // a. 研修
      explanation: 'Jawaban tepat: a. 研修 (kenshuu).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '日本語の能力を高めたいんですが、もっと（　　　　）したほうがいいです。',
      options: JSON.stringify(['研削', '研鑽', '研究']),
      correctAnswer: '1', // b. 研鑽
      explanation: 'Jawaban tepat: b. 研鑽 (kensan).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'この金属の表面をきれいにするために、（　　　　）します。',
      options: JSON.stringify(['研習', '研究', '研磨']),
      correctAnswer: '2', // c. 研磨
      explanation: 'Jawaban tepat: c. 研磨 (kenma).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '工場では、これを使って物を（　　　{blank}　　）する予定です。',
      options: JSON.stringify(['研削', '研修', '研学']),
      correctAnswer: '0', // a. 研削
      explanation: 'Jawaban tepat: a. 研削 (kensaku).'
    }
  ];

  // Clean question 5 text:
  newQuizzes[13].question = '工場では、これを使って物を（　　　　）する予定です。';

  for (const q of newQuizzes) {
    await prisma.quiz.create({
      data: q
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 研.`);
  if (groupingQuiz) {
    console.log(`Grouping quiz ID ${groupingQuiz.id} was retained intact.`);
  }

  await prisma.$disconnect();
}

updateKenQuizzes().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
