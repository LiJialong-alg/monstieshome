import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  try {
    const data = JSON.parse(Buffer.from(token, "base64").toString("utf-8"))
    return NextResponse.json({
      authenticated: true,
      user: { username: data.username, role: data.role },
    })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
