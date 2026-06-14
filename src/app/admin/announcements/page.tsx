"use client"

import { useState } from "react"
import { Megaphone } from "lucide-react"
import { AdminTable } from "@/components/shared/admin-table"
import { AdminFormModal } from "@/components/shared/admin-form-modal"
import { useCrud } from "@/lib/use-admin"

interface AnnouncementItem {
  id: string
  title: string
  date: string
  summary: string
  tags: string
  pinned: boolean
  visible: boolean
  createdAt: string
}

export default function AdminAnnouncementsPage() {
  const { items, loading, create, update, remove } = useCrud<AnnouncementItem>("/api/announcements")
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<AnnouncementItem | null>(null)

  const fields = [
    { key: "title", label: "标题", type: "text" as const, required: true, placeholder: "公告标题" },
    { key: "date", label: "日期", type: "text" as const, required: true, placeholder: "2025-06-14" },
    { key: "summary", label: "内容", type: "textarea" as const, placeholder: "公告详细内容" },
    { key: "tags", label: "标签", type: "tags" as const, placeholder: "多个标签用逗号分隔" },
    { key: "pinned", label: "置顶", type: "boolean" as const },
    { key: "visible", label: "可见", type: "boolean" as const },
  ]

  const handleSave = async (data: Record<string, any>) => {
    if (editing) {
      await update(editing.id, data)
    } else {
      await create(data)
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Megaphone size={20} className="text-purple-500" />
        <h2 className="text-lg font-semibold text-gray-700">公告管理</h2>
      </div>

      <AdminTable
        items={items}
        loading={loading}
        columns={[
          { key: "title", label: "标题" },
          { key: "date", label: "日期" },
          {
            key: "pinned",
            label: "置顶",
            render: (item) =>
              item.pinned ? (
                <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-600">已置顶</span>
              ) : (
                <span className="text-gray-300">-</span>
              ),
          },
          {
            key: "tags",
            label: "标签",
            render: (item) => {
              try {
                const tags = JSON.parse(item.tags)
                return tags.length > 0 ? tags.join(", ") : "-"
              } catch {
                return "-"
              }
            },
          },
        ]}
        onAdd={() => {
          setEditing(null)
          setModalOpen(true)
        }}
        onEdit={(item) => {
          setEditing(item)
          setModalOpen(true)
        }}
        onDelete={(item) => {
          if (confirm(`确定删除「${item.title}」？`)) remove(item.id)
        }}
        emptyText="还没有公告，点击新增发布第一条～"
      />

      <AdminFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        fields={fields}
        initial={editing ?? undefined}
        title={editing ? "编辑公告" : "新增公告"}
      />
    </div>
  )
}
