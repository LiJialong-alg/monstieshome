import type { Metadata } from "next"
import { Camera } from "lucide-react"

export const metadata: Metadata = {
  title: "照片",
}

export default function GalleryPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-20 text-center">
      <Camera size={48} className="text-purple-300 mb-4" />
      <h1 className="text-2xl font-bold text-gray-700">照片展示</h1>
      <p className="mt-2 text-sm text-gray-400">照片模块正在建设中，敬请期待 🎉</p>
    </div>
  )
}
