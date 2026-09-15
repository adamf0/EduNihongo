import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const words = [
    '経験', '経過', '経歴', '経由', '経口', '経済', '経営', '経費', '経理', '経常',
    '年始', '年初', '月始', '開始', '始業', '始動', '終始', '始終', '始末',
    '年表', '歴史', '戦歴', '前歴', '職歴', '学歴', '履歴', '歴年', '歴代', '歴訪', '歴程',
    '先史', '前史', '史実', '史料', '正史', '秘史', '史上',
    '時期', '期間', '長期', '短期', '定期', '周期', '学期', '会期', '初期', '前期', '後期', '早期', '期首', '期末', '末期', '期限', '期日', '納期', '延期', '満期', '期待', '予期'
  ];
  const chars = new Set<string>();
  words.forEach(w => {
    for (const c of w) chars.add(c);
  });
  console.log('Total unique kanji characters needed:', chars.size);
  const existing = await prisma.kanji.findMany({
    where: { character: { in: Array.from(chars) } }
  });
  const existingSet = new Set(existing.map(k => k.character));
  const missing: string[] = [];
  for (const c of chars) {
    if (!existingSet.has(c)) missing.push(c);
  }
  console.log('Missing kanjis in DB:', missing);
  console.log('Existing kanjis count:', existing.length);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
