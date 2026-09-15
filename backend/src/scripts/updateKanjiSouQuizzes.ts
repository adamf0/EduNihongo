import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateSouQuizzes() {
  const kanji = await prisma.kanji.findFirst({
    where: { character: '送' },
    include: { quizzes: true }
  });

  if (!kanji) {
    console.error('Kanji 送 not found in database!');
    process.exit(1);
  }

  console.log(`Updating quizzes for Kanji 送 (ID: ${kanji.id})...`);

  // Preserve grouping quiz if exists
  const groupingQuiz = kanji.quizzes.find(q => q.type === 'grouping');

  // Delete non-grouping quizzes for kanji 送
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
      question: 'Susunlah kalimat dari kata-kata berikut (5x5=25)',
      options: JSON.stringify([]),
      // Scrambled pool 1: 船で ・ 輸送すれば ・ 安くなるでしょう ・ 荷物を
      words: JSON.stringify(['船で', '輸送すれば', '安くなるでしょう', '荷物を']),
      correctOrder: JSON.stringify(['船で', '荷物を', '輸送すれば', '安くなるでしょう']),
      correctAnswer: '0',
      explanation: 'Jawaban: 船で荷物を輸送すれば、はやくなるでしょう。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kalimat dari kata-kata berikut (5x5=25)',
      options: JSON.stringify([]),
      // Scrambled pool 2: 時間が ・ データ・の ・ かかるかもしれません ・ 伝送に
      words: JSON.stringify(['時間が', 'データ', 'の', 'かかるかもしれません', '伝送に']),
      correctOrder: JSON.stringify(['データ', 'の', '伝送に', '時間が', 'かかるかもしれません']),
      correctAnswer: '0',
      explanation: 'Jawaban: データの伝送に時間がかかるかもしれません。'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kalimat dari kata-kata berikut (5x5=25)',
      options: JSON.stringify([]),
      // Scrambled pool 3: 注文した ・ 直送して ・ おきます ・ 果物を ・ 家に
      words: JSON.stringify(['注文した', '直送して', 'おきます', '果物を', '家に']),
      correctOrder: JSON.stringify(['注文した', '果物を', '家に', '直送して', 'おきます']),
      correctAnswer: '0',
      explanation: 'Jawaban: 注文した果物を家に直送しておきます'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kalimat dari kata-kata berikut (5x5=25)',
      options: JSON.stringify([]),
      // Scrambled pool 4: 練習しよう ・ 式の ・ 前に ・ 送辞を ・ と ・ 思っています
      words: JSON.stringify(['練習しよう', '式の', '前に', '送辞を', 'と', '思っています']),
      correctOrder: JSON.stringify(['式の', '前に', '送辞を', '練習しよう', 'と', '思っています']),
      correctAnswer: '0',
      explanation: 'Jawaban: 式の前に送辞を練習しようと思っています'
    },
    {
      kanjiId: kanji.id,
      type: 'unscramble',
      question: 'Susunlah kalimat dari kata-kata berikut (5x5=25)',
      options: JSON.stringify([]),
      // Scrambled pool 5: 放送を ・ 聞いた ・ ほうが ・ 館内の ・ いいです
      words: JSON.stringify(['放送を', '聞いた', 'ほうが', '館内の', 'いいです']),
      correctOrder: JSON.stringify(['館内の', '放送を', '聞いた', 'ほうが', 'いいです']),
      correctAnswer: '0',
      explanation: 'Jawaban: 館内の放送を聞いたほうがいいです'
    },

    // --- MULTIPLE CHOICE QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “kegiatan mengirim barang atau benda dari satu tempat ke tempat lain”?',
      options: JSON.stringify(['歓送', '送別', '発送']),
      correctAnswer: '2', // c. 発送
      explanation: 'Jawaban tepat: c. 発送 (hassou) - pengiriman barang.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “kegiatan mengirim surat atau barang menggunakan layanan pos”?',
      options: JSON.stringify(['郵送', '送別', '送検']),
      correctAnswer: '0', // a. 郵送
      explanation: 'Jawaban tepat: a. 郵送 (yuusou) - pengiriman pos.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “kegiatan mengirim atau menyampaikan informasi melalui alat komunikasi”?',
      options: JSON.stringify(['送信', '送別', '転送']),
      correctAnswer: '0', // a. 送信
      explanation: 'Jawaban tepat: a. 送信 (soushin) - pengiriman data/informasi.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “kegiatan mengantarkan atau mengirim barang sampai ke tempat tujuan”?',
      options: JSON.stringify(['歓送', '配送', '送辞']),
      correctAnswer: '1', // b. 配送
      explanation: 'Jawaban tepat: b. 配送 (haisou) - pengantaran barang.'
    },
    {
      kanjiId: kanji.id,
      type: 'multiple',
      question: 'Jukugo mana yang berhubungan dengan makna “kegiatan mengucapkan atau menyampaikan kata-kata ketika seseorang akan meninggalkan suatu tempat atau kelompok”?',
      options: JSON.stringify(['送辞', '郵送', '輸送']),
      correctAnswer: '0', // a. 送辞
      explanation: 'Jawaban tepat: a. 送辞 (souji) - pidato perpisahan.'
    },

    // --- FILL IN THE BLANK QUIZZES (5) ---
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '荷物を明日の朝、東京へ（　　　　）します。',
      options: JSON.stringify(['発別', '発送', '送辞']),
      correctAnswer: '1', // b. 発送
      explanation: 'Jawaban tepat: b. 発送 (hassou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '日本からインドネシアへ手紙を（　　　　）しました。',
      options: JSON.stringify(['郵送', '送別', '送辞']),
      correctAnswer: '0', // a. 郵送
      explanation: 'Jawaban tepat: a. 郵送 (yuusou).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '友達が引っ越すので、みんなで（　　　　）の会を開きました。',
      options: JSON.stringify(['送信', '送別', '送検']),
      correctAnswer: '1', // b. 送別
      explanation: 'Jawaban tepat: b. 送別 (soubetsu).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: 'メールを友達に（　　　　）しました。',
      options: JSON.stringify(['送信', '送別', '送辞']),
      correctAnswer: '0', // a. 送信
      explanation: 'Jawaban tepat: a. 送信 (soushin).'
    },
    {
      kanjiId: kanji.id,
      type: 'fill',
      question: '会社は新しい商品を全国の店に（　　　　）しています。',
      options: JSON.stringify(['送別', '配送', '送辞']),
      correctAnswer: '1', // b. 配送
      explanation: 'Jawaban tepat: b. 配送 (haisou).'
    }
  ];

  for (const q of newQuizzes) {
    await prisma.quiz.create({
      data: q
    });
  }

  console.log(`Successfully created ${newQuizzes.length} updated quizzes for Kanji 送.`);
  if (groupingQuiz) {
    console.log(`Grouping quiz ID ${groupingQuiz.id} was retained intact.`);
  }

  await prisma.$disconnect();
}

updateSouQuizzes().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
