import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { ADMIN_COOKIE, ADMIN_SESSION_SECONDS, createAdminToken } from "@/lib/admin-auth"

const attempts = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 8

function clientIp(req: NextRequest) {
  return req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req)
  const now = Date.now()
  const current = attempts.get(ip)
  if (current && current.resetAt > now && current.count >= MAX_ATTEMPTS) {
    return NextResponse.json({ error: "登录尝试过多，请稍后再试" }, { status: 429 })
  }
  if (current && current.resetAt <= now) attempts.delete(ip)
  const { username, password } = await req.json()

  if (!username || !password) {
    return NextResponse.json({ error: "请输入用户名和密码" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) {
    const state = attempts.get(ip) ?? { count: 0, resetAt: now + WINDOW_MS }
    attempts.set(ip, { ...state, count: state.count + 1 })
    return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 })
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    const state = attempts.get(ip) ?? { count: 0, resetAt: now + WINDOW_MS }
    attempts.set(ip, { ...state, count: state.count + 1 })
    return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 })
  }

  attempts.delete(ip)
  const token = createAdminToken({ id: user.id, username: user.username, role: user.role })

  const response = NextResponse.json({ success: true, user: { username: user.username, role: user.role } })
  
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_SECONDS,
  })

  return response
}
