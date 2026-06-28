import dotenv from 'dotenv';
dotenv.config();
const { PrismaClient } = await import('@prisma/client');
const prisma = new PrismaClient();
try {
  await prisma.();
  console.log('PRISMA_CONNECTED');
} catch (e) {
  console.error('PRISMA_ERROR', e.message);
} finally {
  await prisma.();
}
