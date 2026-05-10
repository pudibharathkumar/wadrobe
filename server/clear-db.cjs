const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.clothingItem.deleteMany({});
  await prisma.outfit.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('Database cleared!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
