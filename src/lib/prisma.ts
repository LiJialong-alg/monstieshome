import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// 开发和生产都复用单一 PrismaClient，避免热更新或并发请求创建过多数据库连接。
globalForPrisma.prisma = prisma
