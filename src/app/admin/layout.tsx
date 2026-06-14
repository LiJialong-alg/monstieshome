"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ImageIcon, Megaphone, Link as LinkIcon, Users, ChevronLeft, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

const navItems = [
  { label: "图片管理", href: "/admin/gallery", icon: ImageIcon },
  { label: "公告管理", href: "/admin/announcements", icon: Megaphone },
  { label: "外链管理", href: "/admin/links", icon: LinkIcon },
  { label: "成员管理", href: "/admin/members", icon: Users },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [username, setUsername] = useState<string>("")
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUsername(data.user.username)
        }
        setChecking(false)
      })
      .catch(() => setChecking(false))
  }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.replace("/admin/login")
  }

  // 如果用户未登录直接跳转（中间件兜底，这里加个保护）
  if (!checking && !username && pathname !== "/admin/login") {
    router.replace("/admin/login")
    return null
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] mx-auto max-w-5xl px-4 py-6 sm:py-8">
      {/* 顶部导航 */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-purple-600 transition-colors"
          >
            <ChevronLeft size={14} />
            返回前台
          </Link>
          <span className="text-gray-300 text-sm">|</span>
          <span className="text-sm font-semibold text-gray-700">后台管理</span>
        </div>

        {/* 用户信息 + 退出 */}
        {username && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">
              你好，<span className="text-purple-600 font-medium">{username}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 rounded-full border border-purple-200 px-3 py-1.5 text-xs text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
            >
              <LogOut size={12} />
              退出
            </button>
          </div>
        )}
      </div>

      {/* 标签导航 */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all whitespace-nowrap",
                active
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-purple-100/50 hover:border-purple-200 hover:text-purple-700"
              )}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          )
        })}
      </div>

      {/* 内容区 */}
      <div className="rounded-2xl border border-purple-100/40 bg-white/60 backdrop-blur-sm p-5 sm:p-6 shadow-sm">
        {children}
      </div>
    </div>
  )
}
