"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ImageIcon, ChevronRight, Loader2 } from "lucide-react"

interface UploadItem {
  id: string
  title: string
  description: string
  src: string
  tags: string
  createdAt: string
}

interface HorizontalScrollProps {
  images: UploadItem[]
  loading?: boolean
}

export function HorizontalScroll({ images, loading }: HorizontalScrollProps) {
  return (
    <section className="px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* 标题 + 查看更多 */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-gray-700">📸 最新上传</h2>
          <Link
            href="/gallery"
            className="flex items-center gap-0.5 text-sm text-purple-500 hover:text-purple-700 transition-colors"
          >
            查看全部 <ChevronRight size={14} />
          </Link>
        </div>

        {/* 加载态 */}
        {loading && (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 size={24} className="animate-spin mr-2" />
            <span className="text-sm">加载中...</span>
          </div>
        )}

        {/* 空态 */}
        {!loading && images.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ImageIcon size={32} className="text-purple-300 mb-2" />
            <p className="text-sm text-gray-400">还没有上传照片，期待站长的第一张拍立得 🎞️</p>
          </div>
        )}

        {/* 横向滚动容器 */}
        {!loading && images.length > 0 && (
          <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex gap-4"
            >
              {images.map((item, i) => {
                let tagList: string[] = []
                try {
                  tagList = JSON.parse(item.tags)
                } catch { }
                const tag = tagList[0]

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="shrink-0"
                  >
                    <Link href="/gallery">
                      <div className="group w-44 overflow-hidden rounded-2xl border border-purple-100/60 bg-white shadow-sm shadow-purple-200/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-200/40 hover:-translate-y-1">
                        {/* 图片 */}
                        <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 overflow-hidden">
                          {item.src ? (
                            <img
                              src={item.src}
                              alt={item.title}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none"
                                const parent = (e.target as HTMLImageElement).parentElement
                                if (parent) {
                                  const icon = document.createElement("div")
                                  icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-300/60"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`
                                  parent.appendChild(icon)
                                }
                              }}
                            />
                          ) : (
                            <ImageIcon size={28} className="text-purple-300/60" />
                          )}
                        </div>
                        {/* 信息 */}
                        <div className="p-3">
                          {tag && (
                            <span className="inline-block rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-600">
                              {tag}
                            </span>
                          )}
                          <h3 className="mt-1.5 text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors truncate">
                            {item.title}
                          </h3>
                          <p className="mt-0.5 text-xs text-gray-400 truncate">
                            {item.description || new Date(item.createdAt).toLocaleDateString("zh-CN")}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  )
}
