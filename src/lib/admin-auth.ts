import { createHmac, timingSafeEqual } from "crypto"
import type { NextRequest } from "next/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const ADMIN_COOKIE = "admin_token"
export const ADMIN_SESSION_SECONDS = 24 * 60 * 60

type AdminSession = {
  id: string
  username: string
  role: string
  iat: number
  exp: number
}

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error("Missing environment variable: ADMIN_SESSION_SECRET")
  }
  return value || "monstiez-development-only-session-secret"
}

function encode(value: string) {
  return Buffer.from(value).toString("base64url")
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url")
}

export function createAdminToken(user: { id: string; username: string; role: string }) {
  const now = Math.floor(Date.now() / 1000)
  const payload = encode(JSON.stringify({ ...user, iat: now, exp: now + ADMIN_SESSION_SECONDS }))
  return `${payload}.${sign(payload)}`
}

export function verifyAdminToken(token?: string | null): AdminSession | null {
  if (!token) return null
  try {
    const [payload, signature] = token.split(".")
    if (!payload || !signature) return null
    const expected = Buffer.from(sign(payload))
    const actual = Buffer.from(signature)
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AdminSession
    if (!session.id || !session.username || !session.exp || session.exp <= Math.floor(Date.now() / 1000)) return null
    return session
  } catch {
    return null
  }
}

export function getAdminSession(req: NextRequest) {
  return verifyAdminToken(req.cookies.get(ADMIN_COOKIE)?.value)
}

export async function requireAdmin() {
  const session = verifyAdminToken((await cookies()).get(ADMIN_COOKIE)?.value)
  return session ? null : NextResponse.json({ error: "未登录或登录已过期" }, { status: 401 })
}
