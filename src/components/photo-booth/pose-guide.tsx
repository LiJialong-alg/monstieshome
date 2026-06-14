"use client"

import { motion } from "framer-motion"
import type { PoseTemplate } from "@/data/photo-booth"

interface PoseGuideProps {
  pose: PoseTemplate
  /** 画布容器尺寸 */
  containerWidth: number
  containerHeight: number
}

/**
 * 半透明姿势引导框，叠加在摄像头画面上
 * 用虚线框 + 文案提示用户站到合适位置
 */
export function PoseGuide({ pose, containerWidth, containerHeight }: PoseGuideProps) {
  const guide = pose.guideRect

  const left = guide.x * containerWidth
  const top = guide.y * containerHeight
  const width = guide.width * containerWidth
  const height = guide.height * containerHeight

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left,
        top,
        width,
        height,
      }}
    >
      {/* 虚线框 */}
      <div
        className="h-full w-full rounded-2xl border-2 border-dashed"
        style={{
          borderColor: "rgba(255, 255, 255, 0.6)",
          boxShadow: "inset 0 0 30px rgba(255,255,255,0.08)",
        }}
      />

      {/* 提示文字 */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
      >
        <span className="rounded-full bg-black/50 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          {pose.hint}
        </span>
      </motion.div>

      {/* 闪烁的人形图标 */}
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <svg width="40" height="60" viewBox="0 0 40 60" fill="none">
          <circle cx="20" cy="12" r="8" stroke="white" strokeWidth="2" opacity="0.6" />
          <path
            d="M8 38 C8 28, 16 22, 20 22 C24 22, 32 28, 32 38"
            stroke="white"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />
          <line x1="20" y1="22" x2="20" y2="40" stroke="white" strokeWidth="2" opacity="0.6" />
          <line x1="20" y1="40" x2="12" y2="54" stroke="white" strokeWidth="2" opacity="0.6" />
          <line x1="20" y1="40" x2="28" y2="54" stroke="white" strokeWidth="2" opacity="0.6" />
        </svg>
      </motion.div>
    </div>
  )
}
