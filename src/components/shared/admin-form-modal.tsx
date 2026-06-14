"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface Field {
  key: string
  label: string
  type: "text" | "textarea" | "boolean" | "number" | "tags"
  required?: boolean
  placeholder?: string
}

interface AdminFormModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: Record<string, any>) => Promise<void>
  fields: Field[]
  initial?: Record<string, any>
  title: string
}

export function AdminFormModal({
  open,
  onClose,
  onSave,
  fields,
  initial,
  title,
}: AdminFormModalProps) {
  const [form, setForm] = useState<Record<string, any>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      const defaults: Record<string, any> = {}
      fields.forEach((f) => {
        defaults[f.key] = initial?.[f.key] ?? (f.type === "boolean" ? false : f.type === "number" ? 0 : "")
      })
      // tags 字段特殊处理：JSON 字符串 <-> 逗号分隔
      fields.forEach((f) => {
        if (f.type === "tags" && defaults[f.key]) {
          try {
            defaults[f.key] = JSON.parse(defaults[f.key]).join(", ")
          } catch {
            defaults[f.key] = defaults[f.key]
          }
        }
      })
      setForm(defaults)
    }
  }, [open, fields, initial])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const data = { ...form }
    // tags 字段转回 JSON
    fields.forEach((f) => {
      if (f.type === "tags" && data[f.key]) {
        data[f.key] = JSON.stringify(
          data[f.key].split(",").map((s: string) => s.trim()).filter(Boolean)
        )
      }
    })
    await onSave(data)
    setSaving(false)
    onClose()
  }

  const set = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }))

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg rounded-2xl border border-purple-100/60 bg-white p-6 shadow-xl"
          >
            {/* 标题 */}
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-gray-400 hover:bg-purple-50 hover:text-purple-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {fields.map((field) => (
                <div key={field.key}>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    {field.label}
                    {field.required && <span className="text-pink-400 ml-0.5">*</span>}
                  </label>

                  {field.type === "textarea" ? (
                    <textarea
                      value={form[field.key] ?? ""}
                      onChange={(e) => set(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full rounded-xl border border-purple-100/60 bg-purple-50/30 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-200/50 transition-colors"
                    />
                  ) : field.type === "boolean" ? (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form[field.key] ?? false}
                        onChange={(e) => set(field.key, e.target.checked)}
                        className="rounded border-purple-300 text-purple-600 focus:ring-purple-300"
                      />
                      <span className="text-sm text-gray-500">启用</span>
                    </label>
                  ) : field.type === "number" ? (
                    <input
                      type="number"
                      value={form[field.key] ?? 0}
                      onChange={(e) => set(field.key, Number(e.target.value))}
                      placeholder={field.placeholder}
                      className="w-full rounded-xl border border-purple-100/60 bg-purple-50/30 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-200/50 transition-colors"
                    />
                  ) : field.type === "tags" ? (
                    <input
                      value={form[field.key] ?? ""}
                      onChange={(e) => set(field.key, e.target.value)}
                      placeholder="多个标签用逗号分隔"
                      className="w-full rounded-xl border border-purple-100/60 bg-purple-50/30 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-200/50 transition-colors"
                    />
                  ) : (
                    <input
                      value={form[field.key] ?? ""}
                      onChange={(e) => set(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full rounded-xl border border-purple-100/60 bg-purple-50/30 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-200/50 transition-colors"
                    />
                  )}
                </div>
              ))}

              <div className="mt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-purple-200 px-5 py-2 text-sm text-gray-600 hover:bg-purple-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2 text-sm font-medium text-white shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                >
                  {saving ? "保存中..." : "保存"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
