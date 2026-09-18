import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  const data = verifyAdminToken(token)
  if (data) {
    return NextResponse.json({
      authenticated: true,
      user: { username: data.username, role: data.role },
    })
  }
  const response = NextResponse.json({ authenticated: false }, { status: 401 })
  response.cookies.delete(ADMIN_COOKIE)
  return response
}
