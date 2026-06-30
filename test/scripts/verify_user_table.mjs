import { config as loadEnv } from "dotenv";
import path from "path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

loadEnv({ path: path.resolve(process.cwd(), "test", ".env") });

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const users = await prisma.user.findMany({ take: 1 });
    console.log("User query successful, rows:", users.length);
  } catch (err) {
    console.error("User query failed:", err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
