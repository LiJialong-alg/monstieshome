/** 曲目类型 */
export interface Track {
  id: string
  /** 歌曲名称 */
  title: string
  /** 艺术家 */
  artist: string
  /** 音频文件路径 */
  src: string
  /** 封面图（可选） */
  cover?: string
  /** 时长（秒） */
  duration?: number
}

/**
 * BGM 歌单
 *
 * ⚠️ 当前使用免费可商用音乐 CDN 示例链接。
 * 如需替换为自己的音频文件，放入 `public/uploads/` 并在 `src` 填 `/uploads/xxx.mp3`
 *
 * 免费音乐来源推荐：
 * - https://pixabay.com/music/
 * - https://uppbeat.io/
 * - https://www.chosic.com/free-music/
 */
export const playlist: Track[] = [
  {
    id: "bgm-1",
    title: "Dreams",
    artist: "Benjamin Tissot",
    src: "https://cdn.pixabay.com/download/audio/2024/01/23/audio_b3b7f5f341.mp3",
  },
  {
    id: "bgm-2",
    title: "Inspiring",
    artist: "Benjamin Tissot",
    src: "https://cdn.pixabay.com/download/audio/2024/01/23/audio_7e2e5f5d9e.mp3",
  },
  {
    id: "bgm-3",
    title: "Happy Day",
    artist: "StockMediaMusic",
    src: "https://cdn.pixabay.com/download/audio/2024/01/23/audio_3c2f8c274f.mp3",
  },
]

/** 默认音量 (0-1) */
export const DEFAULT_VOLUME = 0.5

/** 播放模式 */
export type PlayMode = "sequential" | "loop" | "shuffle"
