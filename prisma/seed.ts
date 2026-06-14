import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // 检查是否已存在管理员
  const existing = await prisma.user.findUnique({ where: { username: "admin" } })
  if (existing) {
    console.log("管理员账号已存在，跳过初始化")
    return
  }

  const hashedPassword = await bcrypt.hash("monsties2025", 10)
  await prisma.user.create({
    data: {
      username: "admin",
      password: hashedPassword,
      role: "superadmin",
    },
  })
  console.log("✅ 管理员账号已创建：admin / monsties2025")
  console.log("⚠️  上线前请修改密码！")
}

main()
  .catch((e) => {
    console.error("❌ 初始化失败:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
