import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 只保护 /admin 路径（排除 /admin/login）
  if (pathname.startsWith("/admin")) {
    // 登录页不需要验证
    if (pathname === "/admin/login") {
      // 如果已登录，直接跳到管理页
      const token = request.cookies.get("admin_token")?.value
      if (token) {
        try {
          JSON.parse(Buffer.from(token, "base64").toString("utf-8"))
          return NextResponse.redirect(new URL("/admin/gallery", request.url))
        } catch {
          // token 无效，继续展示登录页
        }
      }
      return NextResponse.next()
    }

    // 其他 /admin/* 路径需要验证
    const token = request.cookies.get("admin_token")?.value
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    try {
      JSON.parse(Buffer.from(token, "base64").toString("utf-8"))
      return NextResponse.next()
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
