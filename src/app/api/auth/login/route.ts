import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  if (!username || !password) {
    return NextResponse.json({ error: "请输入用户名和密码" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) {
    return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 })
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 })
  }

  // 创建 session（简单 token）
  const token = Buffer.from(
    JSON.stringify({ id: user.id, username: user.username, role: user.role })
  ).toString("base64")

  const response = NextResponse.json({ success: true, user: { username: user.username, role: user.role } })
  
  // 设置 cookie，7天有效期
  response.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  })

  return response
}
