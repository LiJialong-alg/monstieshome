"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Camera, CameraOff, RefreshCw } from "lucide-react"

interface CameraPreviewProps {
  /** 是否显示摄像头 */
  active: boolean
  /** 摄像头画面就绪时回调 */
  onReady: (video: HTMLVideoElement) => void
  /** 摄像头出错时回调 */
  onError?: (error: string) => void
}

export function CameraPreview({ active, onReady, onError }: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [status, setStatus] = useState<"idle" | "starting" | "ready" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user")

  const startCamera = useCallback(async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
    }
    setStatus("starting")
    setErrorMsg("")

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
          setStatus("ready")
          onReady(videoRef.current!)
        }
      }
    } catch (err: any) {
      const msg =
        err.name === "NotAllowedError"
          ? "摄像头权限被拒绝，请在浏览器设置中允许访问摄像头"
          : err.name === "NotFoundError"
            ? "未检测到摄像头设备"
            : `摄像头启动失败: ${err.message}`
      setErrorMsg(msg)
      setStatus("error")
      onError?.(msg)
    }
  }, [facingMode, onReady, onError])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setStatus("idle")
  }, [])

  const toggleCamera = useCallback(() => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
  }, [])

  useEffect(() => {
    if (active) {
      startCamera()
    } else {
      stopCamera()
    }
    return () => stopCamera()
  }, [active, startCamera, stopCamera])

  // 切换摄像头时重启
  useEffect(() => {
    if (active && status === "ready") {
      startCamera()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode])

  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl bg-gray-900 shadow-lg">
      {/* 摄像头画面 */}
      {status === "idle" && (
        <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200">
          <Camera size={48} className="text-white/60" />
          <p className="ml-2 text-sm text-white/80">点击开启摄像头</p>
        </div>
      )}

      {status === "starting" && (
        <div className="flex aspect-[4/3] items-center justify-center bg-gray-800">
          <RefreshCw size={32} className="animate-spin text-purple-300" />
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`aspect-[4/3] w-full object-cover ${status === "ready" ? "block" : "hidden"}`}
      />

      {status === "error" && (
        <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 bg-gray-800 p-6 text-center">
          <CameraOff size={36} className="text-red-400" />
          <p className="text-sm text-red-300">{errorMsg}</p>
        </div>
      )}

      {/* 底部控制栏 */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-3 bg-gradient-to-t from-black/60 to-transparent p-3">
        {status === "idle" && (
          <button
            onClick={startCamera}
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2 text-sm font-medium text-white shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <Camera size={16} />
            开启摄像头
          </button>
        )}

        {status === "ready" && (
          <>
            <button
              onClick={toggleCamera}
              className="rounded-full bg-white/20 px-3 py-1.5 text-xs text-white backdrop-blur-sm transition-all hover:bg-white/30"
            >
              <RefreshCw size={14} className="inline mr-1" />
              翻转
            </button>
            <button
              onClick={stopCamera}
              className="rounded-full bg-red-500/60 px-3 py-1.5 text-xs text-white backdrop-blur-sm transition-all hover:bg-red-500/80"
            >
              <CameraOff size={14} className="inline mr-1" />
              关闭
            </button>
          </>
        )}

        {status === "error" && (
          <button
            onClick={startCamera}
            className="rounded-full bg-white/20 px-4 py-2 text-xs text-white backdrop-blur-sm transition-all hover:bg-white/30"
          >
            重试
          </button>
        )}
      </div>

      {/* 状态指示 */}
      {status === "ready" && (
        <div className="absolute left-3 top-3 flex items-center gap-1.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-400 shadow-lg shadow-green-400/50" />
          <span className="text-xs font-medium text-white drop-shadow-sm">LIVE</span>
        </div>
      )}
    </div>
  )
}
