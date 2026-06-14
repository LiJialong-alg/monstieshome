"use client"

import { useState } from "react"
import { ImageIcon } from "lucide-react"
import { AdminTable } from "@/components/shared/admin-table"
import { AdminFormModal } from "@/components/shared/admin-form-modal"
import { useCrud } from "@/lib/use-admin"

interface ImageItem {
  id: string
  title: string
  description: string
  src: string
  tags: string
  link: string
  createdAt: string
}

export default function AdminGalleryPage() {
  const { items, loading, create, update, remove } = useCrud<ImageItem>("/api/gallery")
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ImageItem | null>(null)

  const fields = [
    { key: "title", label: "标题", type: "text" as const, required: true, placeholder: "照片标题" },
    { key: "description", label: "描述", type: "text" as const, placeholder: "简短描述" },
    { key: "src", label: "图片路径", type: "text" as const, placeholder: "/images/xxx.jpg 或外部 URL" },
    { key: "tags", label: "标签", type: "tags" as const, placeholder: "多个标签用逗号分隔" },
    { key: "link", label: "外链", type: "text" as const, placeholder: "https://..." },
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
        <ImageIcon size={20} className="text-purple-500" />
        <h2 className="text-lg font-semibold text-gray-700">图片管理</h2>
      </div>

      <AdminTable
        items={items}
        loading={loading}
        columns={[
          { key: "title", label: "标题" },
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
          { key: "createdAt", label: "创建时间", render: (item) => new Date(item.createdAt).toLocaleDateString("zh-CN") },
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
        emptyText="还没有照片，点击新增添加第一张～"
      />

      <AdminFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        fields={fields}
        initial={editing ?? undefined}
        title={editing ? "编辑照片" : "新增照片"}
      />
    </div>
  )
}
