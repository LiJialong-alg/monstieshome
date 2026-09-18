import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const username = process.env.ADMIN_USERNAME
  const rawPassword = process.env.ADMIN_PASSWORD

  if (!username || !rawPassword) {
    throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD are required")
  }

  const password = await bcrypt.hash(rawPassword, 12)

  await prisma.user.upsert({
    where: { username },
    update: { password, role: "superadmin" },
    create: { username, password, role: "superadmin" },
  })

  console.log("管理账号已写入")
}

main().finally(() => prisma.$disconnect())
