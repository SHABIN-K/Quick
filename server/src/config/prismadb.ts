import { PrismaClient } from '@prisma/client';

function createPrismaClient(): PrismaClient {
  try {
    return new PrismaClient();
  } catch (error) {
    console.error('Error connecting to Prisma:', error);
    process.exit(1); // Exit the process as Prisma connectivity is essential for the application
  }
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const db = globalThis.prisma || createPrismaClient();
if (process.env.APP_NODE_ENV !== 'production') globalThis.prisma = db;

export default db;
