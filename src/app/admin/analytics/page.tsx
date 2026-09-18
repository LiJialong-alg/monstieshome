"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, BarChart3, Plus } from "lucide-react"
import { members } from "@/data/members"

type Scope = { scope: "group" | "member"; memberId: string; label: string }
type Data = { participantCount: number; average: number; totalWrong: number; questionStats: Array<{ id: string; question: string; scope: string; memberId: string; wrongCount: number; wrongRate: number; mostWrongOption: string }>; attempts: Array<{ scope: string; memberId: string; score: number; createdAt: string }> }

const scopes: Scope[] = [{ scope: "group", memberId: "", label: "全团" }, ...members.map((member) => ({ scope: "member" as const, memberId: member.id, label: member.displayName }))]

export default function AnalyticsPage() {
  const [data, setData] = useState<Data | null>(null)
  const [active, setActive] = useState(scopes[0])
  const [adding, setAdding] = useState(false)
  const load = () => fetch("/api/admin/analytics").then((response) => response.json()).then(setData)
  useEffect(() => { void load() }, [])
  const scopedAttempts = useMemo(() => data?.attempts.filter((attempt) => attempt.scope === active.scope && attempt.memberId === active.memberId) ?? [], [data, active])
  const scopedQuestions = useMemo(() => data?.questionStats.filter((item) => item.scope === active.scope && item.memberId === active.memberId) ?? [], [data, active])
  const average = scopedAttempts.length ? Number((scopedAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / scopedAttempts.length).toFixed(1)) : 0
  const addLowScore = async () => { setAdding(true); await fetch("/api/admin/analytics/low-score", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ scope: active.scope, memberId: active.memberId }) }); await load(); setAdding(false) }
  return <div>
    <Link href="/admin/questions" className="mb-5 inline-flex items-center gap-1 text-sm text-violet-600"><ArrowLeft size={15} />返回题库</Link>
    <div className="mb-6 flex items-center gap-2"><BarChart3 className="text-violet-500" /><div><h1 className="text-xl font-black text-slate-900">答题数据分析</h1><p className="text-sm text-slate-400">按全团和成员分别查看答题数据</p></div></div>
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">{scopes.map((scope) => <button key={`${scope.scope}-${scope.memberId}`} onClick={() => setActive(scope)} className={`rounded-xl px-3 py-3 text-sm font-bold ${active.label === scope.label ? "bg-violet-600 text-white" : "bg-violet-50 text-violet-700"}`}>{scope.label}</button>)}</div>
    {!data ? <p className="py-12 text-center text-slate-400">加载中...</p> : <>
      <div className="mt-6 grid gap-3 sm:grid-cols-4"><div className="rounded-2xl bg-violet-50 p-5"><p className="text-xs text-slate-500">当前板块参与人数</p><p className="mt-1 text-3xl font-black text-violet-600">{scopedAttempts.length}</p></div><div className="rounded-2xl bg-sky-50 p-5"><p className="text-xs text-slate-500">当前板块平均分</p><p className="mt-1 text-3xl font-black text-sky-600">{average}</p></div><div className="rounded-2xl bg-rose-50 p-5"><p className="text-xs text-slate-500">当前板块错误次数</p><p className="mt-1 text-3xl font-black text-rose-500">{scopedQuestions.reduce((sum, item) => sum + item.wrongCount, 0)}</p></div><div className="flex items-center justify-center rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-4"><button onClick={addLowScore} disabled={adding} className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"><Plus size={16} />{adding ? "添加中..." : "添加低分"}</button></div></div>
      <div className="mt-7 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b text-slate-500"><th className="p-3">题目</th><th className="p-3">错误次数</th><th className="p-3">错误率</th><th className="p-3">最常错选项</th></tr></thead><tbody>{scopedQuestions.map((item) => <tr key={item.id} className="border-b border-slate-100"><td className="max-w-sm p-3 font-medium text-slate-800">{item.question}</td><td className="p-3 font-bold text-rose-500">{item.wrongCount}</td><td className="p-3">{item.wrongRate}%</td><td className="p-3 text-slate-600">{item.mostWrongOption}</td></tr>)}</tbody></table>{!scopedQuestions.length && <p className="py-12 text-center text-slate-400">当前板块还没有错题数据</p>}</div>
    </>}
  </div>
}
