"use client"

import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"

interface Column<T> {
  key: string
  label: string
  render?: (item: T) => React.ReactNode
}

interface AdminTableProps<T> {
  items: T[]
  loading: boolean
  columns: Column<T>[]
  onAdd: () => void
  onEdit: (item: T) => void
  onDelete: (item: T) => void
  emptyText?: string
}

export function AdminTable<T extends { id: string }>({
  items,
  loading,
  columns,
  onAdd,
  onEdit,
  onDelete,
  emptyText,
}: AdminTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400">
        <Loader2 size={24} className="animate-spin mr-2" />
        <span className="text-sm">加载中...</span>
      </div>
    )
  }

  return (
    <div>
      {/* 新增按钮 */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:shadow-md transition-all"
        >
          <Plus size={16} />
          新增
        </button>
      </div>

      {items.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-gray-400">{emptyText ?? "暂无数据，点击上方按钮添加"}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-purple-100/50 text-gray-500">
                {columns.map((col) => (
                  <th key={col.key} className="px-3 py-3 font-medium whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
                <th className="px-3 py-3 font-medium whitespace-nowrap text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-purple-50/50 hover:bg-purple-50/30 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-3 py-3 text-gray-700">
                      {col.render ? col.render(item) : String((item as any)[col.key] ?? "")}
                    </td>
                  ))}
                  <td className="px-3 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(item)}
                        className="rounded-full p-1.5 text-gray-400 hover:bg-purple-100 hover:text-purple-600 transition-colors"
                        title="编辑"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="rounded-full p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        title="删除"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
