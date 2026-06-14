"use client"

import { useState, useRef } from "react"
import { ImageIcon, Upload, Link as LinkIcon } from "lucide-react"
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
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        alert(err.error || "上传失败")
        return
      }

      const data = await res.json()

      // 直接用上传的图片创建记录
      await create({
        title: file.name.replace(/\.[^/.]+$/, ""),
        src: data.url,
        tags: "[]",
        description: "",
        link: "",
      })
    } catch {
      alert("上传失败，请重试")
    } finally {
      setUploading(false)
    }
  }

  const fields = [
    { key: "title", label: "标题", type: "text" as const, required: true, placeholder: "照片标题" },
    { key: "description", label: "描述", type: "text" as const, placeholder: "简短描述" },
    { key: "src", label: "图片链接", type: "text" as const, placeholder: "https://... 或 /uploads/xxx.jpg" },
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
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon size={20} className="text-purple-500" />
          <h2 className="text-lg font-semibold text-gray-700">图片管理</h2>
        </div>

        {/* 上传按钮区域 */}
        <div className="flex items-center gap-2">
          {/* 隐藏的文件输入 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileUpload(file)
              e.target.value = "" // 允许重复选择同一文件
            }}
          />

          {/* 上传图片按钮 */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 rounded-full border border-purple-200 bg-white px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 transition-all disabled:opacity-50"
          >
            {uploading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-purple-400 border-t-transparent" />
                上传中...
              </>
            ) : (
              <>
                <Upload size={16} />
                上传图片
              </>
            )}
          </button>
        </div>
      </div>

      <AdminTable
        items={items}
        loading={loading}
        columns={[
          {
            key: "src",
            label: "预览",
            render: (item) =>
              item.src ? (
                <img
                  src={item.src}
                  alt={item.title}
                  className="h-12 w-12 rounded-lg object-cover border border-purple-100/50"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none"
                  }}
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-xs text-gray-400">
                  无图
                </div>
              ),
          },
          { key: "title", label: "标题" },
          {
            key: "tags",
            label: "标签",
            render: (item) => {
              try {
                const tags = JSON.parse(item.tags)
                return tags.length > 0
                  ? tags.map((t: string) => (
                    <span
                      key={t}
                      className="mr-1 inline-block rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-600"
                    >
                      {t}
                    </span>
                  ))
                  : "-"
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
        emptyText="还没有照片，点击「上传图片」或「新增」添加第一张～"
      />

      <AdminFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        fields={fields}
        initial={editing ?? undefined}
        title={editing ? "编辑照片" : "新增照片"}
      />

      {/* 使用说明 */}
      <div className="mt-4 rounded-xl bg-purple-50/50 p-4 text-xs text-gray-400">
        <p className="flex items-center gap-1">
          <Upload size={12} />
          上传方式：点击「上传图片」从本机选择文件（自动创建记录，支持 JPG/PNG/GIF/WebP，最大 5MB）
        </p>
        <p className="flex items-center gap-1 mt-1">
          <LinkIcon size={12} />
          链接方式：点击「新增」手动填写图片链接（支持外部图床链接）
        </p>
      </div>
    </div>
  )
}
