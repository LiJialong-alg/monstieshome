"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { FilesetResolver, ImageSegmenter } from "@mediapipe/tasks-vision"

/**
 * MediaPipe SelfieSegmenter hook
 * 实时从视频帧中分割出人像，返回人像蒙版数据
 */
export function useSelfieSegmenter() {
  const segmenterRef = useRef<ImageSegmenter | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const animRef = useRef<number>(0)

  // 初始化 MediaPipe Segmenter
  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        // 设置 30 秒超时
        const timeout = setTimeout(() => {
          if (!cancelled && !segmenterRef.current) {
            setError("模型加载超时，请检查网络连接")
          }
        }, 30000)

        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm"
        )

        if (cancelled) {
          clearTimeout(timeout)
          return
        }

        const segmenter = await ImageSegmenter.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/1/selfie_segmenter.tflite",
            delegate: "CPU",
          },
          runningMode: "VIDEO",
          outputCategoryMask: true,
          outputConfidenceMasks: false,
        })

        if (cancelled) {
          segmenter.close()
          clearTimeout(timeout)
          return
        }

        segmenterRef.current = segmenter
        clearTimeout(timeout)
        setLoaded(true)
      } catch (err: any) {
        console.error("MediaPipe 初始化失败:", err)
        setError(err.message || "MediaPipe 初始化失败")
      }
    }

    init()

    return () => {
      cancelled = true
      segmenterRef.current?.close()
      segmenterRef.current = null
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  /**
   * 开始对视频进行实时分割
   * @param video 视频元素
   * @param onMask 每帧回调，返回 { maskBuffer: Uint8Array, width: number, height: number }
   *               maskBuffer 中每个像素的值：0=背景, 1=人像
   * @returns 停止函数
   */
  const startSegmenting = useCallback(
    (
      video: HTMLVideoElement,
      onMask: (data: { maskBuffer: Uint8Array; width: number; height: number }) => void
    ) => {
      const segmenter = segmenterRef.current
      if (!segmenter || !video) return () => { }

      let lastTimestamp = -1
      let running = true
      let frameCounter = 0

      const processFrame = () => {
        if (!running) return

        if (video.readyState < 2) {
          animRef.current = requestAnimationFrame(processFrame)
          return
        }

        // 使用严格的单调递增时间戳（微秒）
        frameCounter++
        const now = performance.now() * 1000 // 微秒
        // 确保严格递增
        const timestamp = lastTimestamp < 0 ? now : Math.max(now, lastTimestamp + 1000)
        if (now <= lastTimestamp) {
          animRef.current = requestAnimationFrame(processFrame)
          return
        }
        lastTimestamp = now

        try {
          const results = segmenter.segmentForVideo(video, timestamp)

          if (results && results.categoryMask) {
            const mask = results.categoryMask
            if (mask.width > 0 && mask.height > 0) {
              const maskBuffer = mask.getAsUint8Array()
              onMask({
                maskBuffer,
                width: mask.width,
                height: mask.height,
              })
            }
          }
        } catch (e) {
          // segmentForVideo 出错时不重复报错
        }

        animRef.current = requestAnimationFrame(processFrame)
      }

      animRef.current = requestAnimationFrame(processFrame)

      return () => {
        running = false
        cancelAnimationFrame(animRef.current)
      }
    },
    []
  )

  const stopSegmenting = useCallback(() => {
    cancelAnimationFrame(animRef.current)
  }, [])

  return {
    loaded,
    error,
    startSegmenting,
    stopSegmenting,
  }
}

