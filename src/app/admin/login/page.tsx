"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Lock, User, LogIn, Eye, EyeOff, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "登录失败")
        setLoading(false)
        return
      }

      router.replace("/admin/gallery")
    } catch {
      setError("网络错误，请稍后重试")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* 标题 */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-200/50">
            <Lock size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">后台管理登录</h1>
          <p className="mt-1 text-sm text-gray-400">请输入管理员账号密码</p>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 用户名 */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-600">用户名</label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoFocus
                className="w-full rounded-xl border border-purple-100/60 bg-purple-50/30 py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-200/50 transition-colors"
              />
            </div>
          </div>

          {/* 密码 */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-600">密码</label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-purple-100/60 bg-purple-50/30 py-2.5 pl-10 pr-10 text-sm text-gray-700 placeholder-gray-400 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-200/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={loading || !username || !password}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium text-white shadow-sm transition-all",
              "bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-md",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                登录中...
              </>
            ) : (
              <>
                <LogIn size={16} />
                登录
              </>
            )}
          </button>
        </form>

        {/* 底部提示 */}
        <p className="mt-6 text-center text-xs text-gray-400">
          仅限管理员访问 · 非授权人员请离开
        </p>
      </motion.div>
    </div>
  )
}
