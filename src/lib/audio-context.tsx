"use client"

import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"
import { playlist, DEFAULT_VOLUME, type Track, type PlayMode } from "@/data/music"

/** 播放器上下文 */
interface AudioContextValue {
  /** 当前曲目 */
  currentTrack: Track | null
  /** 是否播放中 */
  isPlaying: boolean
  /** 当前进度 (0-1) */
  progress: number
  /** 当前播放时间（秒） */
  currentTime: number
  /** 总时长（秒） */
  duration: number
  /** 音量 (0-1) */
  volume: number
  /** 播放模式 */
  playMode: PlayMode
  /** 播放/暂停 */
  togglePlay: () => void
  /** 播指定曲目 */
  playTrack: (track: Track) => void
  /** 下一首 */
  playNext: () => void
  /** 上一首 */
  playPrev: () => void
  /** 跳转到指定位置 (0-1) */
  seek: (value: number) => void
  /** 设置音量 */
  setVolume: (value: number) => void
  /** 切换播放模式 */
  cyclePlayMode: () => void
  /** 歌单 */
  playlist: Track[]
}

const AudioCtx = createContext<AudioContextValue | null>(null)

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME)
  const [playMode, setPlayMode] = useState<PlayMode>("sequential")

  // 初始化 Audio 实例（只做一次）
  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.volume = DEFAULT_VOLUME

    const audio = audioRef.current

    const onTimeUpdate = () => {
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration)
        setCurrentTime(audio.currentTime)
      }
    }
    const onLoadedMetadata = () => {
      setDuration(audio.duration)
    }
    const onEnded = () => {
      playNext()
    }

    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("loadedmetadata", onLoadedMetadata)
    audio.addEventListener("ended", onEnded)

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("loadedmetadata", onLoadedMetadata)
      audio.removeEventListener("ended", onEnded)
      audio.pause()
      audio.src = ""
    }
  }, [])

  /** 播放/暂停 */
  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    if (audio.paused) {
      audio.play().catch(() => {})
      setIsPlaying(true)
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }, [currentTrack])

  /** 播放指定曲目 */
  const playTrack = useCallback((track: Track) => {
    const audio = audioRef.current
    if (!audio) return

    setCurrentTrack(track)
    setProgress(0)
    setCurrentTime(0)
    audio.src = track.src
    audio.currentTime = 0
    audio.play().catch(() => {})
    setIsPlaying(true)
  }, [])

  /** 获取下一首索引 */
  const getNextIndex = useCallback(
    (currentId: string): number => {
      const currentIdx = playlist.findIndex((t) => t.id === currentId)
      if (playMode === "shuffle") {
        let next = Math.floor(Math.random() * playlist.length)
        if (next === currentIdx && playlist.length > 1) {
          next = (next + 1) % playlist.length
        }
        return next
      }
      // sequential / loop
      return (currentIdx + 1) % playlist.length
    },
    [playMode],
  )

  /** 获取上一首索引 */
  const getPrevIndex = useCallback(
    (currentId: string): number => {
      const currentIdx = playlist.findIndex((t) => t.id === currentId)
      if (playMode === "shuffle") {
        let prev = Math.floor(Math.random() * playlist.length)
        if (prev === currentIdx && playlist.length > 1) {
          prev = (prev + 1) % playlist.length
        }
        return prev
      }
      return (currentIdx - 1 + playlist.length) % playlist.length
    },
    [playMode],
  )

  /** 下一首 */
  const playNext = useCallback(() => {
    if (!currentTrack) {
      playTrack(playlist[0])
      return
    }
    const nextIdx = getNextIndex(currentTrack.id)
    playTrack(playlist[nextIdx])
  }, [currentTrack, getNextIndex, playTrack])

  /** 上一首 */
  const playPrev = useCallback(() => {
    if (!currentTrack) {
      playTrack(playlist[0])
      return
    }
    const prevIdx = getPrevIndex(currentTrack.id)
    playTrack(playlist[prevIdx])
  }, [currentTrack, getPrevIndex, playTrack])

  /** 跳转 */
  const seek = useCallback((value: number) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    audio.currentTime = value * audio.duration
    setProgress(value)
  }, [])

  /** 音量 */
  const setVolume = useCallback((value: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = value
    setVolumeState(value)
  }, [])

  /** 切换播放模式 */
  const cyclePlayMode = useCallback(() => {
    setPlayMode((prev) => {
      if (prev === "sequential") return "loop"
      if (prev === "loop") return "shuffle"
      return "sequential"
    })
  }, [])

  return (
    <AudioCtx.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        currentTime,
        duration,
        volume,
        playMode,
        togglePlay,
        playTrack,
        playNext,
        playPrev,
        seek,
        setVolume,
        cyclePlayMode,
        playlist,
      }}
    >
      {children}
    </AudioCtx.Provider>
  )
}

export function useAudio() {
  const ctx = useContext(AudioCtx)
  if (!ctx) throw new Error("useAudio must be used within AudioProvider")
  return ctx
}
