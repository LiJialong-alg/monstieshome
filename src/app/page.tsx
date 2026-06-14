"use client"

import { useState, useEffect } from "react"
import { HeroSection } from "@/components/shared/hero"
import { FeatureCards } from "@/components/shared/feature-cards"
import { TodayHighlight } from "@/components/shared/highlight"
import { HorizontalScroll } from "@/components/shared/horizontal-scroll"

export default function HomePage() {
  const [latestImages, setLatestImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 从 API 获取最新图片，用于主页展示
    fetch("/api/gallery?limit=5")
      .then((res) => res.json())
      .then((data) => {
        setLatestImages(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <>
      <HeroSection />
      <FeatureCards />
      <TodayHighlight />
      <HorizontalScroll images={latestImages} loading={loading} />
    </>
  )
}
