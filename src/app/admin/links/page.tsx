"use client"

import { useState } from "react"
import { Link as LinkIcon } from "lucide-react"
import { AdminTable } from "@/components/shared/admin-table"
import { AdminFormModal } from "@/components/shared/admin-form-modal"
import { useCrud } from "@/lib/use-admin"

interface LinkItem {
  id: string
  name: string
  description: string
  url: string
  icon: string
  category: string
  sortOrder: number
  visible: boolean
  createdAt: string
}

export default function AdminLinksPage() {
  const { items, loading, create, update, remove } = useCrud<LinkItem>("/api/links")
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<LinkItem | null>(null)

  const fields = [
    { key: "name", label: "站点名称", type: "text" as const, required: true, placeholder: "例如：微博超话" },
    { key: "url", label: "链接地址", type: "text" as const, required: true, placeholder: "https://..." },
    { key: "description", label: "简介", type: "text" as const, placeholder: "简短描述" },
    { key: "category", label: "分类", type: "text" as const, placeholder: "社交平台 / 视频平台 / 官方站点" },
    { key: "icon", label: "图标标识", type: "text" as const, placeholder: "Globe / Camera / Video / Heart / MessageCircle" },
    { key: "sortOrder", label: "排序权重", type: "number" as const, placeholder: "数字越小越靠前" },
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
        <LinkIcon size={20} className="text-purple-500" />
        <h2 className="text-lg font-semibold text-gray-700">外链管理</h2>
      </div>

      <AdminTable
        items={items}
        loading={loading}
        columns={[
          { key: "name", label: "名称" },
          { key: "category", label: "分类" },
          {
            key: "url", label: "链接", render: (item) => (
              <span className="max-w-[180px] truncate block text-gray-400">{item.url}</span>
            )
          },
          {
            key: "visible",
            label: "可见",
            render: (item) =>
              item.visible ? (
                <span className="text-green-500 text-xs font-medium">可见</span>
              ) : (
                <span className="text-gray-300 text-xs">隐藏</span>
              ),
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
          if (confirm(`确定删除「${item.name}」？`)) remove(item.id)
        }}
        emptyText="还没有外链，点击新增添加第一个～"
      />

      <AdminFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        fields={fields}
        initial={editing ?? undefined}
        title={editing ? "编辑外链" : "新增外链"}
      />
    </div>
  )
}
