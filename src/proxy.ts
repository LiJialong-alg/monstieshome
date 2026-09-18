import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-auth"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 只保护 /admin 路径（排除 /admin/login）
  if (pathname.startsWith("/admin")) {
    // 登录页不需要验证
    if (pathname === "/admin/login") {
      // 如果已登录，直接跳到管理页
      const token = request.cookies.get(ADMIN_COOKIE)?.value
      if (verifyAdminToken(token)) return NextResponse.redirect(new URL("/admin/questions", request.url))
      return NextResponse.next()
    }

    // 其他 /admin/* 路径需要验证
    const token = request.cookies.get(ADMIN_COOKIE)?.value
    if (!verifyAdminToken(token)) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
