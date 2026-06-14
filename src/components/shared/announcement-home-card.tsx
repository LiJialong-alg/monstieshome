"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Megaphone, ArrowRight, Pin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { HomeAnnouncement } from "@/data/content"

export function AnnouncementHomeCard() {
  const [announcements, setAnnouncements] = useState<HomeAnnouncement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/announcements")
      .then((res) => res.json())
      .then((data) => {
        setAnnouncements(Array.isArray(data) ? data.slice(0, 3) : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section className="px-4 py-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <Card className="overflow-hidden border-purple-100/60 transition-all duration-300 hover:shadow-md hover:shadow-purple-200/30">
            <CardContent className="p-5 sm:p-6">
              {/* 标题行 */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Megaphone size={16} className="text-purple-500" />
                  <h3 className="text-sm font-semibold text-gray-700">最新公告</h3>
                </div>
                <Link
                  href="/announcements"
                  className="flex items-center gap-0.5 text-xs text-purple-500 hover:text-purple-700 transition-colors"
                >
                  查看全部
                  <ArrowRight size={12} />
                </Link>
              </div>

              {/* 公告列表 */}
              {loading && (
                <div className="space-y-2.5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 animate-pulse rounded-lg bg-purple-50" />
                  ))}
                </div>
              )}

              {!loading && announcements.length === 0 && (
                <div className="flex flex-col items-center py-6 text-center">
                  <Megaphone size={24} className="text-purple-300 mb-1" />
                  <p className="text-xs text-gray-400">暂无公告，等待站长更新 ✨</p>
                </div>
              )}

              {!loading && announcements.length > 0 && (
                <div className="space-y-2">
                  {announcements.map((item, i) => (
                    <Link
                      key={item.id}
                      href="/announcements"
                      className="group block rounded-xl border border-purple-50 bg-white p-3 transition-all hover:border-purple-100 hover:bg-purple-50/50 hover:shadow-sm"
                    >
                      <div className="flex items-start gap-2">
                        {/* 置顶标识 */}
                        <span className="mt-0.5 shrink-0">
                          <Pin size={10} className="text-amber-400" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-700 truncate group-hover:text-purple-700 transition-colors">
                            {item.title}
                          </p>
                          <div className="mt-0.5 flex items-center gap-2">
                            <span className="text-[10px] text-gray-400">
                              {new Date(item.date || item.createdAt).toLocaleDateString("zh-CN")}
                            </span>
                            {item.tags?.length > 0 && (
                              <span className="rounded-full bg-purple-100 px-1.5 py-0.5 text-[9px] text-purple-500">
                                {item.tags[0]}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight size={12} className="mt-1 shrink-0 text-gray-300 group-hover:text-purple-400 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
