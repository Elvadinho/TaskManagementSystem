import fs from "fs/promises";
import { config as loadEnv } from "dotenv";
import path from "path";

// Load test/.env
loadEnv({ path: path.resolve(process.cwd(), "test", ".env") });

// Import the app prisma instance
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Build Prisma client with adapter using DATABASE_URL from test/.env
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL not set in environment");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const sqlPath = path.resolve(
    process.cwd(),
    "test",
    "prisma",
    "migrations",
    "20260629202324_init",
    "migration.sql",
  );
  const sql = await fs.readFile(sqlPath, "utf8");
  try {
    console.log("Applying migration SQL...");
    await prisma.$executeRawUnsafe(sql);
    console.log("Migration applied.");
  } catch (err) {
    console.error("Failed to apply migration SQL:", err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
