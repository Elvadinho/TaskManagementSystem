import { PrismaClient } from "../src/generated/prisma_dev/client.js";

async function main() {
  const prisma = new PrismaClient();
  try {
    // ensure we can connect and that the model exists
    const users = await prisma.user.findMany();
    console.log("Users count:", users.length);
  } catch (err) {
    console.error("Error querying dev DB:", err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
