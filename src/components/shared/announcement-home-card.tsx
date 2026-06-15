"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Megaphone, ArrowRight } from "lucide-react"
import type { HomeAnnouncement } from "@/data/content"

/**
 * 公告横幅 - 放置在导航栏正下方
 * 半透明背景，只展示一条最新置顶/最新公告
 */
export function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<HomeAnnouncement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/announcements")
      .then((res) => res.json())
      .then((data) => {
        setAnnouncements(Array.isArray(data) ? data.slice(0, 1) : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading || announcements.length === 0) return null

  const item = announcements[0]

  return (
    <div className="sticky top-[57px] z-40 border-b border-gray-200/60 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2 sm:px-6">
        <div className="flex items-center gap-2 min-w-0">
          <Megaphone size={12} className="shrink-0 text-purple-400" />
          <Link href="/announcements" className="group flex items-center gap-1.5 min-w-0">
            <span className="truncate text-xs text-gray-600 group-hover:text-purple-700 transition-colors">
              {item.title}
            </span>
            <ArrowRight size={10} className="shrink-0 text-purple-300 group-hover:text-purple-500 transition-colors" />
          </Link>
        </div>
        {item.date && (
          <span className="shrink-0 text-[10px] text-gray-400 hidden sm:block">
            {new Date(item.date).toLocaleDateString("zh-CN")}
          </span>
        )}
      </div>
    </div>
  )
}

