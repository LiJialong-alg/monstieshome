"use client"

import { useEffect, useState } from "react"
import { Megaphone } from "lucide-react"
import { AnnouncementCard } from "@/components/shared/announcement-card"
import type { Announcement } from "@/data/announcements"

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/announcements")
      .then((res) => res.json())
      .then(setItems)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      {/* 页头 */}
      <div className="mb-8 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <Megaphone size={24} className="text-purple-500" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            公告
          </h1>
        </div>
        <p className="mt-1 text-sm text-gray-400">
          站点动态和活动信息，第一时间掌握 📢
        </p>
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <Megaphone size={32} className="animate-bounce text-purple-300" />
            <p className="text-sm">加载中...</p>
          </div>
        </div>
      )}

      {/* 公告列表 */}
      {!loading && (
        <>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Megaphone size={48} className="text-purple-300 mb-4" />
              <p className="text-gray-400 text-sm">暂无公告，等待站长发布第一条消息 🎉</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <AnnouncementCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* 底部 */}
          <div className="mt-10 text-center text-xs text-gray-400">
            — 没有更多了 —
          </div>
        </>
      )}
    </div>
  )
}

