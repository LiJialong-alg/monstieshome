"use client"

import { useEffect, useState } from "react"
import { Camera, ChevronDown } from "lucide-react"
import { PolaroidCard } from "@/components/shared/polaroid-card"
import type { GalleryImage } from "@/data/gallery"

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  /** 数据库存的 tags 是 JSON 字符串，转成数组 */
  function parseTags(tags: any): string[] {
    if (Array.isArray(tags)) return tags
    try {
      return JSON.parse(tags)
    } catch {
      return []
    }
  }

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data: any[]) => {
        setImages(
          data.map((img) => ({
            ...img,
            tags: parseTags(img.tags),
            rotate: Math.random() * 6 - 3,
          }))
        )
        setLoading(false)
      })
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      {/* 页头 */}
      <div className="mb-8 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <Camera size={24} className="text-purple-500" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            照片墙
          </h1>
        </div>
        <p className="mt-1 text-sm text-gray-400">
          一张张拍立得，记录下每一个闪光的瞬间 ✨
        </p>
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <Camera size={32} className="animate-bounce text-purple-300" />
            <p className="text-sm">加载中...</p>
          </div>
        </div>
      )}

      {/* 照片瀑布流网格 */}
      {!loading && (
        <>
          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Camera size={48} className="text-purple-300 mb-4" />
              <p className="text-gray-400 text-sm">还没有照片，期待站长的第一张拍立得 🎞️</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {images.map((img) => (
                <div key={img.id} className="break-inside-avoid">
                  <PolaroidCard image={img} />
                </div>
              ))}
            </div>
          )}

          {/* 底部加载更多占位 */}
          <div className="mt-12 flex justify-center">
            <button
              disabled
              className="flex items-center gap-1 rounded-full border border-purple-200 bg-white px-5 py-2 text-sm text-gray-400 shadow-sm cursor-not-allowed"
            >
              <ChevronDown size={16} />
              没有更多了～ 等待站长更新
            </button>
          </div>
        </>
      )}
    </div>
  )
}

