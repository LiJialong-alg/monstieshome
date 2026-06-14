"use client"

import { useRef, useCallback } from "react"
import { Download, ImageDown } from "lucide-react"

interface CompositeCanvasProps {
  /** 拍立得合成画布的 ref，用于获取最终图片 */
  captureFn: () => string
  /** 导出完成后回调 */
  onExported?: (dataUrl: string) => void
}

/**
 * 导出控制组件
 * 提供导出 PNG/JPG 按钮，以及预览/保存功能
 */
export function ExportButtons({ captureFn, onExported }: CompositeCanvasProps) {
  const linkRef = useRef<HTMLAnchorElement>(null)

  const exportAs = useCallback(
    (format: "png" | "jpg") => {
      const dataUrl = captureFn()
      if (!dataUrl || dataUrl === "data:,") return

      onExported?.(dataUrl)

      // 创建下载链接
      const mimeType = format === "png" ? "image/png" : "image/jpeg"
      const ext = format === "png" ? "png" : "jpg"

      // 如果是 jpg，需要先转换
      if (format === "jpg") {
        const img = new Image()
        img.onload = () => {
          const c = document.createElement("canvas")
          c.width = img.width
          c.height = img.height
          const ctx = c.getContext("2d")!
          ctx.fillStyle = "#fff"
          ctx.fillRect(0, 0, c.width, c.height)
          ctx.drawImage(img, 0, 0)
          const jpgUrl = c.toDataURL("image/jpeg", 0.92)
          downloadFile(jpgUrl, `monsties-photo.${ext}`)
        }
        img.src = dataUrl
      } else {
        downloadFile(dataUrl, `monsties-photo.${ext}`)
      }
    },
    [captureFn, onExported]
  )

  const downloadFile = (url: string, filename: string) => {
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
  }

  return (
    <div className="flex flex-col gap-3">
      {/* 导出按钮 */}
      <div className="flex gap-2">
        <button
          onClick={() => exportAs("png")}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-3 text-sm font-medium text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95"
        >
          <Download size={16} />
          导出 PNG
        </button>
        <button
          onClick={() => exportAs("jpg")}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-purple-200 bg-white px-5 py-3 text-sm font-medium text-purple-600 transition-all hover:border-purple-300 hover:bg-purple-50 active:scale-95"
        >
          <ImageDown size={16} />
          导出 JPG
        </button>
      </div>

      {/* 使用提示 */}
      <p className="text-center text-[11px] text-gray-400">
        💡 长按图片可保存到相册 · 支持 PNG（透明）/ JPG（白色背景）
      </p>
    </div>
  )
}

/**
 * 预览合成结果的大图模态框
 */
export function PreviewModal({
  dataUrl,
  onClose,
}: {
  dataUrl: string
  onClose: () => void
}) {
  if (!dataUrl) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] max-w-sm overflow-hidden rounded-2xl bg-white p-2 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={dataUrl} alt="合成照片" className="w-full rounded-xl" />
        <p className="py-3 text-center text-xs text-gray-400">点击空白处关闭</p>
      </div>
    </div>
  )
}
