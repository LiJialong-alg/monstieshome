"use client"

import { motion } from "framer-motion"
import { ImageIcon, ExternalLink, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import type { GalleryImage } from "@/data/gallery"

interface PolaroidCardProps {
  image: GalleryImage
  /** 自定义额外样式 */
  className?: string
}

export function PolaroidCard({ image, className }: PolaroidCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{
        y: -6,
        rotate: 0,
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      className={cn(
        "group w-full max-w-[280px] mx-auto",
        "bg-white rounded-xl p-3 pb-12 shadow-md",
        "border border-purple-100/40",
        "transition-shadow duration-300 hover:shadow-xl hover:shadow-purple-200/30",
        className
      )}
      style={{
        transform: `rotate(${image.rotate ?? 0}deg)`,
      }}
    >
      {/* 照片区域 */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
        {/* 没有真实图片时显示占位 */}
        {!image.src ? (
          <div className="flex h-full items-center justify-center">
            <ImageIcon size={40} className="text-purple-300/50" />
          </div>
        ) : (
          <img
            src={image.src}
            alt={image.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* 悬停时显示的外链按钮 */}
        {image.link && (
          <a
            href={image.link}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-purple-600 opacity-0 shadow-sm transition-all duration-200 hover:bg-white hover:scale-105 group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>

      {/* 拍立得底部白边 - 标题等信息 */}
      <div className="mt-2.5 px-1">
        <h3 className="text-sm font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
          {image.title}
        </h3>
        <p className="mt-0.5 text-xs text-gray-400 line-clamp-1">
          {image.description}
        </p>

        {/* 标签行 */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {image.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-500 border border-purple-100/40"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* 收藏按钮 - 装饰性 */}
      <button
        className="absolute bottom-3 right-3 flex items-center gap-1 text-xs text-gray-400 hover:text-pink-400 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <Heart size={12} />
      </button>
    </motion.div>
  )
}
