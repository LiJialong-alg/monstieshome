"use client"

import { motion } from "framer-motion"
import {
  ExternalLink,
  MessageCircle,
  Video,
  Camera,
  Heart,
  Globe,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ExternalLink as ExternalLinkType } from "@/data/links"

const iconMap: Record<string, React.ElementType> = {
  MessageCircle,
  Video,
  Camera,
  Heart,
  Globe,
}

interface LinkCardProps {
  link: ExternalLinkType
}

export function LinkCard({ link }: LinkCardProps) {
  const Icon = iconMap[link.icon] || Globe

  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -3, scale: 1.01 }}
      className={cn(
        "group flex items-center gap-4 rounded-2xl border border-purple-100/40 bg-white/80 backdrop-blur-sm p-4",
        "shadow-sm shadow-purple-200/10 transition-all duration-300",
        "hover:shadow-md hover:shadow-purple-200/30 hover:border-purple-200/60",
      )}
    >
      {/* 图标 */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 shadow-sm">
        <Icon size={20} />
      </div>

      {/* 文字 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-semibold text-gray-800 group-hover:text-purple-700 transition-colors truncate">
            {link.name}
          </h3>
          <ExternalLink size={12} className="shrink-0 text-gray-300 group-hover:text-purple-400 transition-colors" />
        </div>
        <p className="mt-0.5 text-xs text-gray-400 leading-relaxed line-clamp-1">
          {link.description}
        </p>
      </div>

      {/* 跳转提示 */}
      <div className="shrink-0 rounded-full border border-purple-200/50 bg-purple-50/50 px-2.5 py-1 text-[10px] font-medium text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">
        新窗口
      </div>
    </motion.a>
  )
}
