"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowDown, ArrowUp, BarChart3, Brain, ImagePlus, Pencil, Plus, Trash2 } from "lucide-react"
import { AdminFormModal } from "@/components/shared/admin-form-modal"
import { members } from "@/data/members"

type Item = { id: string; scope: "group" | "member"; memberId: string; question: string; image: string; options: string; answer: number; sortOrder: number }
type Entry = { key: string; label: string; scope: "group" | "member"; memberId: string; emoji: string }

const entries: Entry[] = [
  { key: "group", label: "全团题目", scope: "group", memberId: "", emoji: "🌟" },
  ...members.map((member) => ({ key: member.id, label: `${member.displayName} 题目`, scope: "member" as const, memberId: member.id, emoji: member.emoji })),
]

export default function QuestionsAdminPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [entryKey, setEntryKey] = useState("group")
  const [editing, setEditing] = useState<Item | null>(null)
  const [open, setOpen] = useState(false)
  const entry = useMemo(() => entries.find((item) => item.key === entryKey) ?? entries[0], [entryKey])

  const load = async () => {
    setLoading(true)
    const params = new URLSearchParams({ admin: "1", scope: entry.scope })
    if (entry.memberId) params.set("memberId", entry.memberId)
    const response = await fetch(`/api/questions?${params}`)
    setItems(await response.json())
    setLoading(false)
  }

  useEffect(() => { void load() }, [entryKey])

  const fields = [
    { key: "question", label: "题目", type: "textarea" as const, required: true },
    { key: "options", label: "选项（用 | 分隔）", type: "text" as const, required: true },
    { key: "answer", label: "正确选项序号（从 0 开始）", type: "number" as const, required: true },
    { key: "image", label: "题目图片（可选）", type: "image" as const },
  ]

  const save = async (data: Record<string, unknown>) => {
    const payload = {
      ...data,
      scope: entry.scope,
      memberId: entry.memberId,
      visible: true,
      options: String(data.options || "").split("|").map((value) => value.trim()).filter(Boolean),
      sortOrder: editing?.sortOrder ?? items.length,
    }
    const response = await fetch(editing ? `/api/questions/${editing.id}` : "/api/questions", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!response.ok) throw new Error((await response.json()).error || "保存失败")
    await load()
  }

  const remove = async (id: string) => {
    if (!confirm("确定删除这道题吗？")) return
    await fetch(`/api/questions/${id}`, { method: "DELETE" })
    await load()
  }

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[index], next[target]] = [next[target], next[index]]
    setItems(next)
    await fetch("/api/questions/reorder", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: next.map((item) => item.id) }) })
  }

  const upload = async (file: File) => {
    const form = new FormData()
    form.append("file", file)
    const response = await fetch("/api/upload", { method: "POST", body: form })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || "上传失败")
    return data.url as string
  }

  return <div>
    <div className="mb-5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2"><Brain size={20} className="text-violet-500" /><div><h2 className="text-lg font-semibold text-slate-800">题库管理</h2><p className="text-xs text-slate-400">先选择团体或成员，再管理对应题目</p></div></div>
      <div className="flex gap-2"><Link href="/admin/analytics" className="flex items-center gap-1 rounded-full border border-violet-200 px-4 py-2 text-sm text-violet-600"><BarChart3 size={15} />数据分析</Link><button onClick={() => { setEditing(null); setOpen(true) }} className="flex items-center gap-1 rounded-full bg-violet-600 px-4 py-2 text-sm text-white"><Plus size={15} />新增题目</button></div>
    </div>
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
      {entries.map((item) => <button key={item.key} onClick={() => setEntryKey(item.key)} className={`rounded-2xl border px-3 py-3 text-center transition ${entryKey === item.key ? "border-violet-500 bg-violet-50 text-violet-700 shadow-sm" : "border-violet-100 bg-white text-slate-500 hover:border-violet-300"}`}><span className="block text-xl">{item.emoji}</span><span className="mt-1 block truncate text-xs font-semibold">{item.label}</span></button>)}
    </div>
    <div className="mb-4 flex items-center justify-between"><h3 className="text-base font-semibold text-slate-700">{entry.emoji} {entry.label}</h3><span className="text-xs text-slate-400">共 {items.length} 道题</span></div>
    {loading ? <p className="py-12 text-center text-sm text-slate-400">加载中...</p> : items.length === 0 ? <div className="rounded-2xl border border-dashed border-violet-200 bg-white/60 py-14 text-center text-sm text-slate-400">这个入口还没有题目，点击右上角新增题目</div> : <div className="space-y-2">{items.map((item, index) => <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-white p-3"><span className="w-8 text-center text-sm font-black text-violet-500">{index + 1}</span>{item.image ? <ImagePlus size={17} className="shrink-0 text-violet-500" /> : <span className="w-4" />}<div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-slate-800">{item.question}</p><p className="text-xs text-slate-400">正确选项：{item.answer + 1}</p></div><button onClick={() => void move(index, -1)} disabled={index === 0} className="rounded-full p-2 text-slate-400 disabled:opacity-20"><ArrowUp size={15} /></button><button onClick={() => void move(index, 1)} disabled={index === items.length - 1} className="rounded-full p-2 text-slate-400 disabled:opacity-20"><ArrowDown size={15} /></button><button onClick={() => { setEditing({ ...item, options: JSON.parse(item.options).join("|") }); setOpen(true) }} className="rounded-full p-2 text-violet-500"><Pencil size={15} /></button><button onClick={() => void remove(item.id)} className="rounded-full p-2 text-rose-500"><Trash2 size={15} /></button></div>)}</div>}
    <AdminFormModal open={open} onClose={() => setOpen(false)} onSave={save} fields={fields} initial={editing || undefined} title={editing ? `编辑${entry.label}` : `新增${entry.label}`} onImageUpload={upload} />
  </div>
}
