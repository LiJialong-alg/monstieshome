"use client"

import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react"
import { ImageIcon } from "lucide-react"

export interface PhotoFrameHandle {
  /** 合成并导出图片，返回 data URL */
  capture: () => string
}

interface PhotoFrameProps {
  /** 摄像头视频元素 */
  videoEl: HTMLVideoElement | null
  /** 当前选中的姿势模板 */
  pose: { idolSrc: string; guideRect: { x: number; y: number; width: number; height: number }; idolRect: { x: number; y: number; width: number; height: number } }
  /** 爱豆素材是否加载完成 */
  idolLoaded: boolean
}

/**
 * 拍立得风格合成画布
 * 左边/右边显示爱豆素材，中间显示摄像头画面
 */
export const PhotoFrame = forwardRef<PhotoFrameHandle, PhotoFrameProps>(
  function PhotoFrame({ videoEl, pose, idolLoaded }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const idolImgRef = useRef<HTMLImageElement | null>(null)
    const [frameWidth, setFrameWidth] = useState(0)

    // 加载爱豆素材
    useEffect(() => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = pose.idolSrc
      img.onload = () => {
        idolImgRef.current = img
      }
    }, [pose.idolSrc])

    // 实时预览绘制（动画循环）
    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      let animId: number

      const draw = () => {
        const cw = canvas.width
        const ch = canvas.height

        // 清空
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

        // 照片区域背景（灰底）
        ctx.fillStyle = "#e5e7eb"
        ctx.beginPath()
        ctx.roundRect(photoX, photoY, photoW, photoH, 8)
        ctx.fill()

        // ── 3. 绘制爱豆素材（左侧或右侧，取决于 idolRect.x） ──
        const idol = idolImgRef.current
        if (idol && idolLoaded) {
          const idolX = pose.idolRect.x * photoW + photoX
          const idolY = pose.idolRect.y * photoH + photoY
          const idolW = pose.idolRect.width * photoW
          const idolH = pose.idolRect.height * photoH
          ctx.drawImage(idol, idolX, idolY, idolW, idolH)
        }

        // ── 4. 绘制摄像头画面 ──
        if (videoEl && videoEl.readyState >= 2) {
          const guideX = pose.guideRect.x * photoW + photoX
          const guideY = pose.guideRect.y * photoH + photoY
          const guideW = pose.guideRect.width * photoW
          const guideH = pose.guideRect.height * photoH

          // 用摄像头画面填充用户位置区域（保持宽高比裁剪）
          const vRatio = videoEl.videoWidth / videoEl.videoHeight
          const gRatio = guideW / guideH

          let sx = 0,
            sy = 0,
            sw = videoEl.videoWidth,
            sh = videoEl.videoHeight

          if (vRatio > gRatio) {
            // 视频更宽，裁剪左右
            sw = videoEl.videoHeight * gRatio
            sx = (videoEl.videoWidth - sw) / 2
          } else {
            // 视频更高，裁剪上下
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

        // ── 5. 底部文字区（拍立得风格） ──
        const textY = photoY + photoH + (bottomMargin - 20) / 2
        ctx.fillStyle = "#888"
        ctx.font = `italic ${Math.round(cw * 0.035)}px serif`
        ctx.textAlign = "center"
        ctx.fillText("monsties home", cw / 2, textY + 8)

        // 日期戳
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
    }, [videoEl, pose, idolLoaded])

    // 更新 canvas 真实尺寸
    useEffect(() => {
      const updateSize = () => {
        const parent = canvasRef.current?.parentElement
        if (parent) {
          const w = parent.clientWidth
          const h = w * 1.35 // 拍立得比例 4:3 照片 + 底部白边
          setFrameWidth(w)
          if (canvasRef.current) {
            canvasRef.current.width = w * 2 // 2x 清晰度
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

    // 导出合成图片
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

        {/* 爱豆素材未加载时的提示 */}
        {!idolLoaded && (
          <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-col items-center gap-2 rounded-xl bg-white/80 p-4 backdrop-blur-sm">
              <ImageIcon size={24} className="animate-pulse text-purple-400" />
              <p className="text-xs text-gray-500">加载爱豆素材中...</p>
            </div>
          </div>
        )}
      </div>
    )
  }
)
