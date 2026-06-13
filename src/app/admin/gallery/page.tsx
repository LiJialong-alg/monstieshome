import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "图片管理",
}

export default function AdminGalleryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-xl font-bold text-gray-700">图片管理</h1>
      <p className="mt-2 text-sm text-gray-400">图片管理功能正在建设中...</p>
    </div>
  )
}
