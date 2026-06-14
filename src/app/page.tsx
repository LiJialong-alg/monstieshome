"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { HeroSection } from "@/components/shared/hero"
import { MemberCircles } from "@/components/shared/member-circles"
import { PhotoBoothCard } from "@/components/shared/photo-booth-card"
import { AnnouncementHomeCard } from "@/components/shared/announcement-home-card"
import { HorizontalScroll } from "@/components/shared/horizontal-scroll"

export default function HomePage() {
  const [latestImages, setLatestImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/gallery?limit=8")
      .then((res) => res.json())
      .then((data) => {
        setLatestImages(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <>
      {/* 1. 欢迎区域 */}
      <HeroSection />

      {/* 2. 成员圆形按钮（欢迎语正下方） */}
      <MemberCircles />

      {/* 3. 与爱豆合照（核心功能，大卡片） */}
      <PhotoBoothCard />

      {/* 4. 最新照片墙 */}
      <section className="px-4 py-2 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles size={16} className="text-purple-500" />
              <h2 className="text-sm font-semibold text-gray-700">照片墙</h2>
            </div>
            <motion.a
              whileTap={{ scale: 0.95 }}
              href="/gallery"
              className="text-xs text-purple-500 hover:text-purple-700 transition-colors"
            >
              查看全部 →
            </motion.a>
          </div>
        </div>
      </section>
      <HorizontalScroll images={latestImages} loading={loading} />

      {/* 5. 公告卡片 */}
      <AnnouncementHomeCard />

      {/* 6. 底部装饰间距 */}
      <div className="h-8" />
    </>
  )
}
