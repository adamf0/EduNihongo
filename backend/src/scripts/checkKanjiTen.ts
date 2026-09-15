import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const k = await prisma.kanji.findFirst({
    where: { character: '点' }
  });
  console.log('Kanji 点:', k);
}

main().finally(() => prisma.$disconnect());
