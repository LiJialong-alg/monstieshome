"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Camera, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { CameraPreview } from "@/components/photo-booth/camera-preview"
import { PoseSelector } from "@/components/photo-booth/pose-selector"
import { PoseGuide } from "@/components/photo-booth/pose-guide"
import { PhotoFrame, type PhotoFrameHandle } from "@/components/photo-booth/photo-frame"
import { ExportButtons, PreviewModal } from "@/components/photo-booth/composite-canvas"
import { poseTemplates, getPoseById, type PoseTemplate } from "@/data/photo-booth"

export default function PhotoBoothPage() {
  const [cameraActive, setCameraActive] = useState(false)
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null)
  const [selectedPoseId, setSelectedPoseId] = useState(poseTemplates[0].id)
  const [idolLoaded, setIdolLoaded] = useState(false)
  const [previewUrl, setPreviewUrl] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [guideContainerSize, setGuideContainerSize] = useState({ width: 0, height: 0 })

  const frameRef = useRef<PhotoFrameHandle>(null)
  const guideContainerRef = useRef<HTMLDivElement>(null)

  const currentPose = getPoseById(selectedPoseId) ?? poseTemplates[0]

  // 摄像头就绪
  const handleCameraReady = useCallback((video: HTMLVideoElement) => {
    setVideoEl(video)
  }, [])

  // 加载爱豆素材
  useEffect(() => {
    setIdolLoaded(false)
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = currentPose.idolSrc
    img.onload = () => setIdolLoaded(true)
    img.onerror = () => {
      // 素材不存在时，使用占位图
      console.warn("爱豆素材加载失败，使用占位:", currentPose.idolSrc)
      setIdolLoaded(false)
    }
  }, [currentPose.idolSrc])

  // 获取引导容器尺寸
  useEffect(() => {
    const updateSize = () => {
      if (guideContainerRef.current) {
        setGuideContainerSize({
          width: guideContainerRef.current.clientWidth,
          height: guideContainerRef.current.clientHeight,
        })
      }
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [cameraActive])

  // 导出图片
  const handleCapture = useCallback(() => {
    const url = frameRef.current?.capture()
    if (url && url !== "data:,") {
      setPreviewUrl(url)
      setShowPreview(true)
    }
  }, [])

  // 导出后回调
  const handleExported = useCallback((_dataUrl: string) => {
    // 预留：后续可接入上传到图床/保存到相册等
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      {/* 页头 */}
      <div className="mb-4 flex items-center gap-2">
        <Link
          href="/"
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-purple-600 transition-colors"
        >
          <ChevronLeft size={14} />
          返回首页
        </Link>
        <span className="text-gray-300 text-sm">|</span>
        <div className="flex items-center gap-1.5">
          <Sparkles size={18} className="text-pink-500" />
          <h1 className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-lg font-bold text-transparent">
            与爱豆合照
          </h1>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* 左侧：摄像头 + 姿势选择 */}
        <div className="space-y-5 lg:col-span-3">
          {/* 摄像头预览 */}
          <div className="relative" ref={guideContainerRef}>
            <CameraPreview
              active={cameraActive}
              onReady={handleCameraReady}
              onError={() => {}}
            />

            {/* 姿势引导框（摄像头开启时显示） */}
            {cameraActive && videoEl && guideContainerSize.width > 0 && (
              <div className="absolute inset-0" style={{ 
                margin: '4%', // 对应 photo-frame 的 padding
                marginBottom: '18%', // 对应 bottomMargin
              }}>
                <PoseGuide
                  pose={currentPose}
                  containerWidth={guideContainerSize.width * 0.92}
                  containerHeight={guideContainerSize.height * 0.78}
                />
              </div>
            )}
          </div>

          {/* 姿势选择 */}
          <PoseSelector
            poses={poseTemplates}
            selected={selectedPoseId}
            onSelect={setSelectedPoseId}
          />

          {/* 相机控制 */}
          <div className="flex justify-center">
            {!cameraActive ? (
              <button
                onClick={() => setCameraActive(true)}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 text-sm font-medium text-white shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                <Camera size={18} />
                开启摄像头
              </button>
            ) : (
              <button
                onClick={handleCapture}
                disabled={!videoEl || !idolLoaded}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-3 text-sm font-medium text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Camera size={18} />
                📸 拍照合成
              </button>
            )}
          </div>
        </div>

        {/* 右侧：合成预览 */}
        <div className="space-y-4 lg:col-span-2">
          {/* 合成画布标题 */}
          <div className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-purple-400" />
            <h3 className="text-sm font-semibold text-gray-600">预览效果</h3>
          </div>

          {/* 合成画布 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPoseId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <PhotoFrame
                ref={frameRef}
                videoEl={videoEl}
                pose={currentPose}
                idolLoaded={idolLoaded}
              />
            </motion.div>
          </AnimatePresence>

          {/* 导出按钮 */}
          <ExportButtons captureFn={() => frameRef.current?.capture() ?? ""} onExported={handleExported} />

          {/* 使用提示 */}
          <div className="rounded-xl bg-purple-50/50 p-4 text-[11px] text-gray-400 leading-relaxed">
            <p>💡 <strong>使用说明：</strong></p>
            <p>1. 点击「开启摄像头」允许摄像头权限</p>
            <p>2. 选择喜欢的拍照姿势模板</p>
            <p>3. 站到虚线框内，参考引导调整位置</p>
            <p>4. 点击「拍照合成」生成拍立得照片</p>
            <p>5. 导出 PNG 或 JPG 保存到相册</p>
            <p className="mt-1 text-purple-400">
              ✨ 提示：使用后置摄像头效果更佳！
            </p>
          </div>
        </div>
      </div>

      {/* 预览模态框 */}
      <PreviewModal
        dataUrl={previewUrl}
        onClose={() => setShowPreview(false)}
      />

      {/* 全屏预览触发 */}
      {showPreview && previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setShowPreview(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-h-[85vh] max-w-xs overflow-hidden rounded-2xl bg-white p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={previewUrl} alt="合成照片" className="w-full rounded-xl" />
            <div className="flex justify-center gap-3 py-3">
              <button
                onClick={() => {
                  const a = document.createElement("a")
                  a.href = previewUrl
                  a.download = `monsties-photo-${Date.now()}.png`
                  a.click()
                }}
                className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2 text-xs font-medium text-white shadow-sm transition-all hover:scale-105"
              >
                💾 保存图片
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="rounded-full border border-purple-200 bg-white px-5 py-2 text-xs font-medium text-gray-500 transition-all hover:bg-purple-50"
              >
                关闭
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
