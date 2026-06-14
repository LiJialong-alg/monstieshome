"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PoseTemplate } from "@/data/photo-booth"

interface PoseSelectorProps {
  poses: PoseTemplate[]
  selected: string
  onSelect: (id: string) => void
}

export function PoseSelector({ poses, selected, onSelect }: PoseSelectorProps) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Sparkles size={16} className="text-pink-500" />
        <h3 className="text-sm font-semibold text-gray-700">选择拍照姿势</h3>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
        {poses.map((pose) => {
          const active = pose.id === selected
          return (
            <motion.button
              key={pose.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(pose.id)}
              className={cn(
                "flex shrink-0 flex-col items-center gap-1.5 rounded-2xl border-2 p-3 transition-all duration-200",
                "w-28",
                active
                  ? "border-pink-400 bg-pink-50 shadow-md shadow-pink-200/40"
                  : "border-purple-100/60 bg-white hover:border-purple-200 hover:shadow-sm"
              )}
            >
              {/* 姿势缩略图占位 */}
              <div className="flex h-16 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 text-2xl">
                {pose.id === "pose-heart" && "❤️"}
                {pose.id === "pose-handshake" && "🤝"}
                {pose.id === "pose-victory" && "✌️"}
                {pose.id === "pose-shoulder" && "👫"}
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    "text-sm font-medium",
                    active ? "text-pink-700" : "text-gray-600"
                  )}
                >
                  {pose.name}
                </p>
                <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
                  {pose.description.replace(/[❤️🤝✌️👫]/g, "").trim()}
                </p>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
