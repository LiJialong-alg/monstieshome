import type { Metadata } from "next"
import { Settings } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "后台管理",
}

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 flex items-center gap-3">
        <Settings size={28} className="text-purple-500" />
        <h1 className="text-2xl font-bold text-gray-700">后台管理</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminCard href="/admin/gallery" label="图片管理" desc="上传、删除、管理照片" />
        <AdminCard href="/admin/announcements" label="公告管理" desc="发布、编辑站点公告" />
        <AdminCard href="/admin/links" label="外链管理" desc="增删改外部链接" />
      </div>
    </div>
  )
}

function AdminCard({ href, label, desc }: { href: string; label: string; desc: string }) {
  return (
    <Link href={href}>
      <div className="rounded-2xl border border-purple-100/60 bg-white/80 p-5 transition-all hover:shadow-md hover:border-purple-200">
        <h2 className="font-semibold text-gray-800">{label}</h2>
        <p className="mt-1 text-sm text-gray-500">{desc}</p>
      </div>
    </Link>
  )
}
