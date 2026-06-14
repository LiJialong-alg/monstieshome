"use client"

import { useEffect, useState } from "react"
import { Link as LinkIcon, ExternalLink } from "lucide-react"
import { LinkCard } from "@/components/shared/link-card"
import type { ExternalLink as ExternalLinkType } from "@/data/links"

export default function LinksPage() {
  const [grouped, setGrouped] = useState<Record<string, ExternalLinkType[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/links")
      .then((res) => res.json())
      .then((links: ExternalLinkType[]) => {
        const grouped: Record<string, ExternalLinkType[]> = {}
        for (const link of links) {
          if (!grouped[link.category]) grouped[link.category] = []
          grouped[link.category].push(link)
        }
        setGrouped(grouped)
      })
      .finally(() => setLoading(false))
  }, [])

  const categories = Object.keys(grouped)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      {/* 页头 */}
      <div className="mb-8 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <LinkIcon size={24} className="text-purple-500" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            外链导航
          </h1>
        </div>
        <div className="flex items-center justify-center sm:justify-start gap-1 mt-1 text-xs text-gray-400">
          <ExternalLink size={10} />
          <span>点击卡片将跳转到外部网站</span>
        </div>
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <LinkIcon size={32} className="animate-bounce text-purple-300" />
            <p className="text-sm">加载中...</p>
          </div>
        </div>
      )}

      {/* 按分类展示 */}
      {!loading && (
        <>
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <LinkIcon size={48} className="text-purple-300 mb-4" />
              <p className="text-gray-400 text-sm">还没有添加外部链接，等待站长更新 🔗</p>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {categories.map((cat) => (
                <section key={cat}>
                  <h2 className="mb-3 text-sm font-semibold text-gray-500 px-1">
                    {cat}
                  </h2>
                  <div className="flex flex-col gap-3">
                    {grouped[cat].map((link) => (
                      <LinkCard key={link.id} link={link} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

