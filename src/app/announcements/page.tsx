import type { Metadata } from "next"
import { Megaphone } from "lucide-react"

export const metadata: Metadata = {
  title: "公告",
}

export default function AnnouncementsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-20 text-center">
      <Megaphone size={48} className="text-purple-300 mb-4" />
      <h1 className="text-2xl font-bold text-gray-700">公告</h1>
      <p className="mt-2 text-sm text-gray-400">公告模块正在建设中，敬请期待 🎉</p>
    </div>
  )
}
