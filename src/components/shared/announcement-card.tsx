"use client"

import { motion } from "framer-motion"
import { Pin, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Announcement } from "@/data/announcements"

interface AnnouncementCardProps {
  item: Announcement
}

export function AnnouncementCard({ item }: AnnouncementCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-white/80 backdrop-blur-sm p-5 transition-all duration-300",
        item.pinned
          ? "border-purple-200/60 shadow-sm shadow-purple-200/30"
          : "border-purple-100/40 shadow-sm shadow-purple-200/10",
        "hover:shadow-md hover:shadow-purple-200/30 hover:-translate-y-0.5"
      )}
    >
      {/* 置顶标识 */}
      {item.pinned && (
        <div className="absolute top-0 right-0">
          <div className="flex items-center gap-1 rounded-bl-xl bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 text-[10px] font-medium text-white shadow-sm">
            <Pin size={10} />
            置顶
          </div>
        </div>
      )}

      {/* 标题 */}
      <h3 className="text-base font-semibold text-gray-800 pr-16">
        {item.title}
      </h3>

      {/* 日期 */}
      <div className="mt-1.5 flex items-center gap-1 text-xs text-gray-400">
        <CalendarDays size={12} />
        <span>{item.date}</span>
      </div>

      {/* 摘要 */}
      <p className="mt-3 text-sm leading-relaxed text-gray-500">
        {item.summary}
      </p>

      {/* 标签 */}
      {item.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-medium text-purple-500 border border-purple-100/40"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}
