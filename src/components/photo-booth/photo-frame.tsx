"use client"

import { useRef, useEffect, useState, forwardRef, useImperativeHandle, useCallback } from "react"
import { ImageIcon } from "lucide-react"
import { useSelfieSegmenter } from "@/hooks/use-selfie-segmenter"

export interface PhotoFrameHandle {
  /** 合成并导出图片，返回 data URL */
  capture: () => string
}

interface PhotoFrameProps {
  /** 摄像头视频元素 */
  videoEl: HTMLVideoElement | null
  /** 当前选中的姿势模板 */
  pose: {
    idolSrc: string
    guideRect: { x: number; y: number; width: number; height: number }
    idolRect: { x: number; y: number; width: number; height: number }
  }
  /** 爱豆素材是否加载完成 */
  idolLoaded: boolean
  /** 场景背景图路径（可选） */
  sceneBg?: string
  /** 自己缩放 (0.5~2) */
  userScale?: number
  /** 爱豆缩放 (0.5~2) */
  idolScale?: number
}

/**
 * 拍立得风格合成画布
 * 使用 MediaPipe 人像分割，将粉丝抠出后与爱豆素材融合到同一背景上
 */
export const PhotoFrame = forwardRef<PhotoFrameHandle, PhotoFrameProps>(
  function PhotoFrame({ videoEl, pose, idolLoaded, sceneBg, userScale = 1, idolScale = 1 }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const idolImgRef = useRef<HTMLImageElement | null>(null)
    const bgImgRef = useRef<HTMLImageElement | null>(null)
    const [frameWidth, setFrameWidth] = useState(0)
    const lastMaskRef = useRef<{ maskBuffer: Uint8Array; width: number; height: number } | null>(null)
    const segCanvasRef = useRef<HTMLCanvasElement | null>(null)

    // MediaPipe 人像分割
    const { loaded: segLoaded, error: segError, startSegmenting } = useSelfieSegmenter()

    // 加载爱豆素材
    useEffect(() => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = pose.idolSrc
      img.onload = () => {
        idolImgRef.current = img
      }
    }, [pose.idolSrc])

    // 加载场景背景
    useEffect(() => {
      if (!sceneBg) return
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = sceneBg
      img.onload = () => {
        bgImgRef.current = img
      }
    }, [sceneBg])

    // 启动/停止人像分割
    useEffect(() => {
      if (!videoEl || !segLoaded) return

      const stop = startSegmenting(videoEl, (data) => {
        lastMaskRef.current = data
      })

      return () => {
        stop()
        lastMaskRef.current = null
      }
    }, [videoEl, segLoaded, startSegmenting])

    // 用 mask 做 Alpha 抠图
    const getSegmentedUser = useCallback(
      (video: HTMLVideoElement, mask: { maskBuffer: Uint8Array; width: number; height: number }) => {
        if (!segCanvasRef.current) {
          segCanvasRef.current = document.createElement("canvas")
        }
        const c = segCanvasRef.current
        c.width = mask.width
        c.height = mask.height
        const ctx = c.getContext("2d")
        if (!ctx) return null

        ctx.drawImage(video, 0, 0, mask.width, mask.height)
        const frameData = ctx.getImageData(0, 0, mask.width, mask.height)
        const pixels = frameData.data

        for (let i = 0; i < mask.maskBuffer.length; i++) {
          pixels[i * 4 + 3] = mask.maskBuffer[i] > 0 ? 0 : 255
        }

        ctx.putImageData(frameData, 0, 0)
        return c
      },
      []
    )

    // 实时预览绘制
    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      let animId: number

      const draw = () => {
        const cw = canvas.width
        const ch = canvas.height
        ctx.clearRect(0, 0, cw, ch)

        // ── 1. 拍立得白色背景 ──
        const padding = 0.04 * cw
        const bottomMargin = 0.18 * ch
        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        ctx.roundRect(0, 0, cw, ch, 12)
        ctx.fill()

        // ── 2. 照片区域 ──
        const photoX = padding
        const photoY = padding
        const photoW = cw - padding * 2
        const photoH = ch - padding - bottomMargin

        // ── 3. 绘制场景背景 ──
        if (bgImgRef.current) {
          ctx.drawImage(bgImgRef.current, photoX, photoY, photoW, photoH)
        } else {
          const grad = ctx.createLinearGradient(photoX, photoY, photoX + photoW, photoY + photoH)
          grad.addColorStop(0, "#fce4ec")
          grad.addColorStop(1, "#e8eaf6")
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.roundRect(photoX, photoY, photoW, photoH, 8)
          ctx.fill()
        }

        // ── 4. 绘制爱豆素材（带缩放） ──
        const idol = idolImgRef.current
        if (idol && idolLoaded) {
          let idolX = pose.idolRect.x * photoW + photoX
          let idolY = pose.idolRect.y * photoH + photoY
          let idolW = pose.idolRect.width * photoW * idolScale
          let idolH = pose.idolRect.height * photoH * idolScale
          // 居中缩放
          idolX -= (idolW - pose.idolRect.width * photoW) / 2
          idolY -= (idolH - pose.idolRect.height * photoH) / 2
          ctx.drawImage(idol, idolX, idolY, idolW, idolH)
        }

        // ── 5. 绘制粉丝（抠出人像，带缩放） ──
        if (videoEl && videoEl.readyState >= 2 && lastMaskRef.current) {
          const mask = lastMaskRef.current
          const segCanvas = getSegmentedUser(videoEl, mask)
          if (segCanvas) {
            let guideX = pose.guideRect.x * photoW + photoX
            let guideY = pose.guideRect.y * photoH + photoY
            let guideW = pose.guideRect.width * photoW * userScale
            let guideH = pose.guideRect.height * photoH * userScale
            // 居中缩放
            guideX -= (guideW - pose.guideRect.width * photoW) / 2
            guideY -= (guideH - pose.guideRect.height * photoH) / 2

            const sRatio = segCanvas.width / segCanvas.height
            const gRatio = guideW / guideH
            let sx = 0, sy = 0, sw = segCanvas.width, sh = segCanvas.height
            if (sRatio > gRatio) {
              sw = segCanvas.height * gRatio
              sx = (segCanvas.width - sw) / 2
            } else {
              sh = segCanvas.width / gRatio
              sy = (segCanvas.height - sh) / 2
            }

            ctx.drawImage(segCanvas, sx, sy, sw, sh, guideX, guideY, guideW, guideH)
          }
        } else if (videoEl && videoEl.readyState >= 2) {
          // fallback：直接显示视频
          let guideX = pose.guideRect.x * photoW + photoX
          let guideY = pose.guideRect.y * photoH + photoY
          let guideW = pose.guideRect.width * photoW * userScale
          let guideH = pose.guideRect.height * photoH * userScale
          guideX -= (guideW - pose.guideRect.width * photoW) / 2
          guideY -= (guideH - pose.guideRect.height * photoH) / 2

          const vRatio = videoEl.videoWidth / videoEl.videoHeight
          const gRatio = guideW / guideH
          let sx = 0, sy = 0, sw = videoEl.videoWidth, sh = videoEl.videoHeight
          if (vRatio > gRatio) {
            sw = videoEl.videoHeight * gRatio
            sx = (videoEl.videoWidth - sw) / 2
          } else {
            sh = videoEl.videoWidth / gRatio
            sy = (videoEl.videoHeight - sh) / 2
          }

          ctx.save()
          ctx.beginPath()
          ctx.roundRect(guideX, guideY, guideW, guideH, 6)
          ctx.clip()
          ctx.drawImage(videoEl, sx, sy, sw, sh, guideX, guideY, guideW, guideH)
          ctx.restore()
        }

        // ── 6. 底部文字 ──
        const textY = photoY + photoH + (bottomMargin - 20) / 2
        ctx.fillStyle = "#888"
        ctx.font = `italic ${Math.round(cw * 0.035)}px serif`
        ctx.textAlign = "center"
        ctx.fillText("monsties home", cw / 2, textY + 8)

        const dateStr = new Date().toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        ctx.fillStyle = "#bbb"
        ctx.font = `${Math.round(cw * 0.025)}px sans-serif`
        ctx.fillText(dateStr, cw / 2, textY + 26)

        animId = requestAnimationFrame(draw)
      }

      draw()
      return () => cancelAnimationFrame(animId)
    }, [videoEl, pose, idolLoaded, sceneBg, getSegmentedUser])

    // 更新 canvas 尺寸
    useEffect(() => {
      const updateSize = () => {
        const parent = canvasRef.current?.parentElement
        if (parent) {
          const w = parent.clientWidth
          const h = w * 1.35
          setFrameWidth(w)
          if (canvasRef.current) {
            canvasRef.current.width = w * 2
            canvasRef.current.height = h * 2
            canvasRef.current.style.width = `${w}px`
            canvasRef.current.style.height = `${h}px`
          }
        }
      }
      updateSize()
      window.addEventListener("resize", updateSize)
      return () => window.removeEventListener("resize", updateSize)
    }, [])

    useImperativeHandle(ref, () => ({
      capture: () => {
        return canvasRef.current?.toDataURL("image/png") ?? ""
      },
    }))

    return (
      <div className="relative mx-auto" style={{ width: frameWidth > 0 ? frameWidth : "100%" }}>
        <canvas
          ref={canvasRef}
          className="w-full rounded-2xl shadow-xl shadow-purple-200/40"
          style={{ aspectRatio: "1 / 1.35" }}
        />

        {(!idolLoaded || (!segLoaded && !segError)) && (
          <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-col items-center gap-2 rounded-xl bg-white/80 p-4 backdrop-blur-sm">
              <ImageIcon size={24} className="animate-pulse text-purple-400" />
              <p className="text-xs text-gray-500">
                {!segLoaded && !segError ? "加载人像分割模型..." : "加载爱豆素材中..."}
              </p>
            </div>
          </div>
        )}
      </div>
    )
  }
)
