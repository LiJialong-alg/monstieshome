"use client"

import { useState, useEffect } from "react"
import { HeroSection } from "@/components/shared/hero"
import { PhotoBoothSection } from "@/components/shared/photo-booth-card"
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
      {/* 1. 欢迎区域 + 成员圆形按钮 */}
      <HeroSection />

      {/* 2. 照片墙 */}
      <HorizontalScroll images={latestImages} loading={loading} />

      {/* 3. 与爱豆合照（核心功能） */}
      <PhotoBoothSection />
      {/* 底部装饰间距 */}
      <div className="h-8" />
    </>
  )
}

