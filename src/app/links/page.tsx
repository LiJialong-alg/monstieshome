import type { Metadata } from "next"
import { Link } from "lucide-react"

export const metadata: Metadata = {
  title: "外链",
}

export default function LinksPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-20 text-center">
      <Link size={48} className="text-purple-300 mb-4" />
      <h1 className="text-2xl font-bold text-gray-700">外链导航</h1>
      <p className="mt-2 text-sm text-gray-400">外链模块正在建设中，敬请期待 🎉</p>
    </div>
  )
}
