"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ImageIcon, ChevronRight } from "lucide-react"
import { recentUploads } from "@/data/content"

export function HorizontalScroll() {
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

        {/* 横向滚动容器 */}
        <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex gap-4"
          >
            {recentUploads.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="shrink-0"
              >
                <Link href={item.href}>
                  <div className="group w-44 overflow-hidden rounded-2xl border border-purple-100/60 bg-white shadow-sm shadow-purple-200/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-200/40 hover:-translate-y-1">
                    {/* 图片占位 */}
                    <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
                      <ImageIcon size={28} className="text-purple-300/60" />
                    </div>
                    {/* 信息 */}
                    <div className="p-3">
                      {item.tag && (
                        <span className="inline-block rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-600">
                          {item.tag}
                        </span>
                      )}
                      <h3 className="mt-1.5 text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors truncate">
                        {item.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-gray-400 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
