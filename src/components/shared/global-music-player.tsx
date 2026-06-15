"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  ChevronUp,
  ChevronDown,
  Volume2,
  Music,
} from "lucide-react"
import { useAudio } from "@/lib/audio-context"

/**
 * 全局浮动音乐播放器
 * 固定在右下角，折叠状态为圆形小按钮，展开后显示完整控制
 */
export function GlobalMusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    progress,
    currentTime,
    duration,
    volume,
    playMode,
    togglePlay,
    playNext,
    playPrev,
    seek,
    setVolume,
    cyclePlayMode,
  } = useAudio()

  const [expanded, setExpanded] = useState(false)

  const playModeIcon = {
    sequential: <Repeat1 size={14} />,
    loop: <Repeat size={14} />,
    shuffle: <Shuffle size={14} />,
  }

  const playModeLabel = {
    sequential: "顺序",
    loop: "单曲循环",
    shuffle: "随机",
  }

  /** 格式化时间 (秒 -> mm:ss) */
  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, "0")}`
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {expanded ? (
          // ---- 展开状态 ----
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-72 rounded-2xl bg-white/90 backdrop-blur-xl border border-purple-200/60 shadow-lg shadow-purple-200/30 p-4"
          >
            {/* 收起按钮 */}
            <button
              onClick={() => setExpanded(false)}
              className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-purple-200/60 shadow-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ChevronDown size={14} />
            </button>

            {/* 歌名 + 封面占位 */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-pink-100">
                <Music size={18} className="text-purple-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-800">
                  {currentTrack?.title ?? "未播放"}
                </p>
                <p className="truncate text-[11px] text-gray-400">
                  {currentTrack?.artist ?? "—"}
                </p>
              </div>
            </div>

            {/* 进度条 */}
            <div className="mb-2">
              <input
                type="range"
                min={0}
                max={1}
                step={0.001}
                value={progress}
                onChange={(e) => seek(Number(e.target.value))}
                className="w-full h-1 rounded-full appearance-none cursor-pointer
                  bg-gradient-to-r from-purple-300 to-pink-300
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500
                  [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:shadow-purple-300/50"
              />
            </div>

            {/* 时间标识 */}
            <div className="flex justify-between text-[10px] text-gray-400 mb-3">
              <span>{fmt(currentTime)}</span>
              <span>{fmt(duration)}</span>
            </div>

            {/* 控制按钮 */}
            <div className="flex items-center justify-center gap-4">
              {/* 播放模式 */}
              <button
                onClick={cyclePlayMode}
                className="text-gray-400 hover:text-purple-600 transition-colors"
                title={playModeLabel[playMode]}
              >
                {playModeIcon[playMode]}
              </button>

              {/* 上一首 */}
              <button
                onClick={playPrev}
                className="text-gray-500 hover:text-purple-600 transition-colors"
              >
                <SkipBack size={18} />
              </button>

              {/* 播放/暂停 */}
              <button
                onClick={togglePlay}
                className="flex h-9 w-9 items-center justify-center rounded-full
                  bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md
                  hover:shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
              </button>

              {/* 下一首 */}
              <button
                onClick={playNext}
                className="text-gray-500 hover:text-purple-600 transition-colors"
              >
                <SkipForward size={18} />
              </button>

              {/* 音量 */}
              <button
                onClick={() => setVolume(volume > 0 ? 0 : 0.5)}
                className="text-gray-400 hover:text-purple-600 transition-colors"
                title={volume > 0 ? "静音" : "恢复音量"}
              >
                <Volume2 size={14} />
              </button>
            </div>
          </motion.div>
        ) : (
          // ---- 折叠状态：圆形小按钮 ----
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => setExpanded(true)}
            className="group relative flex h-12 w-12 items-center justify-center rounded-full
              bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-300/40
              hover:shadow-xl hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            {isPlaying ? (
              <Pause size={18} className="text-white" />
            ) : (
              <Play size={18} className="ml-0.5 text-white" />
            )}
            {/* 正在播放指示小点 */}
            {isPlaying && (
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-purple-500" />
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
