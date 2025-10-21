/**
 * Prisma Client シングルトン
 *
 * 開発環境でのホットリロード対応
 */

import { PrismaClient } from '../generated/prisma/index.js';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * データベース接続を閉じる（テスト用）
 */
export async function disconnectPrisma() {
  await prisma.$disconnect();
}

/**
 * データベースをクリアする（テスト用）
 */
export async function clearDatabase() {
  await prisma.collaborator.deleteMany();
  await prisma.mediaFile.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.content.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.artistDNA.deleteMany();
}
