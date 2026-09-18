"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, RefreshCw, Sparkles } from "lucide-react"
import { members } from "@/data/members"
import { StatusImage } from "@/components/shared/status-image"

type Question = { id: string; question: string; image: string; options: string; answer: number }
type Result = { score: number; average: number; rankPercent: number; total: number }

function praise(score: number) {
  if (score === 100) return "传说级"
  if (score >= 95) return "骨灰级"
  if (score >= 85) return "资深级"
  if (score >= 70) return "核心级"
  if (score >= 50) return "进阶级"
  return "萌新级"
}

function fanTitle(mode: "group" | "member", memberId: string) {
  if (mode === "group") return "Monstiez"
  return ({ ruka: "露粉", pharita: "挞粉", asa: "角粉", ahyeon: "贤粉", rami: "蓝粉", rora: "茶粉", chiquita: "柒粉" } as Record<string, string>)[memberId] ?? "Monstiez"
}

export default function QuizClient({ initialScope, initialMember }: { initialScope?: "group" | "member"; initialMember?: string }) {
  const [mode, setMode] = useState<"group" | "member">(initialScope ?? "group")
  const [memberId, setMemberId] = useState(initialMember ?? "ruka")
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionsLoading, setQuestionsLoading] = useState(true)
  const [questionsError, setQuestionsError] = useState("")
  const [reloadKey, setReloadKey] = useState(0)
  const [intro, setIntro] = useState(Boolean(initialScope || initialMember))
  const [index, setIndex] = useState(-1)
  const [answers, setAnswers] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [pendingAnswers, setPendingAnswers] = useState<number[] | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setQuestions([])
    setQuestionsLoading(true)
    setQuestionsError("")

    fetch(`/api/questions?scope=${mode}${mode === "member" ? `&memberId=${memberId}` : ""}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("题目加载失败")
        const data: unknown = await response.json()
        if (!Array.isArray(data)) throw new Error("题目数据异常")
        setQuestions(data as Question[])
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return
        setQuestionsError("题目加载失败，请检查网络后重试。")
      })
      .finally(() => {
        if (!controller.signal.aborted) setQuestionsLoading(false)
      })

    return () => controller.abort()
  }, [mode, memberId, reloadKey])

  const chooseGroup = () => {
    setMode("group")
    setIntro(true)
    setIndex(-1)
  }

  const chooseMember = (id: string) => {
    setMode("member")
    setMemberId(id)
    setIntro(true)
    setIndex(-1)
  }

  const start = () => {
    setIndex(0)
    setAnswers([])
    setSelected(null)
    setConfirmed(false)
    setResult(null)
    setSubmitError("")
    setPendingAnswers(null)
  }

  const submitQuiz = async (answerList: number[]) => {
    if (submitting) return
    setSubmitting(true)
    setSubmitError("")
    try {
      const answerData = questions.map((question, i) => ({ questionId: question.id, selectedOption: answerList[i] }))
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope: mode, memberId, answers: answerData }),
      })
      if (!response.ok) throw new Error("成绩提交失败")
      setResult(await response.json())
      setPendingAnswers(null)
      setIndex(questions.length)
    } catch {
      setPendingAnswers(answerList)
      setSubmitError("成绩提交失败，请检查网络后重新提交。")
    } finally {
      setSubmitting(false)
    }
  }

  const goNext = async (choice: number) => {
    const nextAnswers = [...answers, choice]
    setAnswers(nextAnswers)
    if (index + 1 < questions.length) {
      setSelected(null)
      setConfirmed(false)
      setIndex(index + 1)
      return
    }
    setPendingAnswers(nextAnswers)
    await submitQuiz(nextAnswers)
  }

  const advance = async () => {
    if (submitting) return
    if (submitError && pendingAnswers) {
      await submitQuiz(pendingAnswers)
      return
    }
    if (selected === null) return
    if (!confirmed) {
      setConfirmed(true)
      if (selected === current?.answer) setTimeout(() => void goNext(selected), 500)
      return
    }
    await goNext(selected)
  }

  const current = questions[index]

  return <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
    <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500"><ArrowLeft size={16} />返回首页</Link>
    <section className="rounded-[2rem] border border-violet-100 bg-white/80 p-6 shadow-xl sm:p-10">
      {index === -1 && !intro && <div className="text-center">
        <h1 className="text-4xl font-black text-slate-900">选择你的挑战</h1>
        <button onClick={chooseGroup} className="mt-8 w-full rounded-full bg-red-600 px-6 py-4 text-2xl font-black text-black">BABYMONSTER</button>
        <div className="mt-8 flex flex-wrap justify-center gap-4">{members.map(member => <button key={member.id} onClick={() => chooseMember(member.id)}>{member.emoji} {member.displayName}</button>)}</div>
      </div>}

      {index === -1 && intro && <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-bold tracking-[.25em] text-violet-500">{mode === "group" ? "GROUP CHALLENGE" : "MEMBER CHALLENGE"}</p>
        <h1 className="mt-3 text-4xl font-black text-slate-900">{mode === "group" ? "BABYMONSTER 全团挑战" : `${members.find(member => member.id === memberId)?.displayName} 专属挑战`}</h1>
        {questionsLoading ? <p className="mt-6 leading-8 text-slate-600">本次测试共有 <strong className="inline-block min-w-[1ch]">&nbsp;</strong> 道题目，题目由易到难，总分 100 分，每题分值相同。完成后可查看成绩、平均分以及你的排名。</p>
          : questionsError ? <div className="mt-6">
            <p className="text-rose-600">{questionsError}</p>
            <button onClick={() => setReloadKey(key => key + 1)} className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 font-semibold text-slate-700"><RefreshCw size={16} />重新加载</button>
          </div>
          : questions.length > 0 ? <p className="mt-6 leading-8 text-slate-600">本次测试共有 <strong>{questions.length}</strong> 道题目，题目由易到难，总分 100 分，每题分值相同。完成后可查看成绩、平均分以及你的排名。</p>
          : <p className="mt-6 leading-8 text-slate-500">当前题库暂无题目。</p>}
        <p className="mt-2 text-sm font-semibold text-amber-600">为保证排名及平均分的可参考性和公平性，请各位 Monstiez 宝宝不要搜索答题和重复做相同题型。</p>
        <button onClick={start} disabled={questionsLoading || Boolean(questionsError) || !questions.length} className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"><Sparkles size={18} />开始挑战</button>
      </div>}

      {current && <div>
        <div className="mb-8 flex justify-between text-sm text-slate-400"><span>第 {index + 1} / {questions.length} 题</span><span>每题 {Number((100 / questions.length).toFixed(1))} 分</span></div>
        <h2 className="text-2xl font-bold text-slate-900">{current.question}</h2>
        {current.image && <StatusImage src={current.image} alt="题目配图" containerClassName="mt-5 min-h-40" className="max-h-72 w-full rounded-2xl object-contain" />}
        <div className="mt-8 grid gap-3">{(JSON.parse(current.options) as string[]).map((option, i) => {
          const correct = i === current.answer
          const wrong = confirmed && i === selected && !correct
          const style = confirmed && correct ? "border-emerald-500 bg-emerald-50 text-emerald-700" : wrong ? "border-rose-500 bg-rose-50 text-rose-700" : selected === i ? "border-violet-500 bg-violet-50 text-violet-700" : "border-slate-200"
          return <button key={option} disabled={confirmed} onClick={() => setSelected(i)} className={`flex items-center gap-3 rounded-2xl border p-4 text-left ${style}`}><span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/70 text-xs font-bold">{String.fromCharCode(65 + i)}</span>{option}</button>
        })}</div>
        {confirmed && <p className={`mt-4 text-center text-sm font-semibold ${selected === current.answer ? "text-emerald-600" : "text-rose-600"}`}>{selected === current.answer ? "回答正确！" : "回答错误，绿色选项为正确答案。"}</p>}
        {submitError && <p className="mt-4 text-center text-sm font-semibold text-rose-600">{submitError}</p>}
        <button onClick={advance} disabled={selected === null || submitting} className="mt-6 w-full rounded-full bg-slate-900 px-5 py-3.5 font-semibold text-white disabled:opacity-40">{submitting ? "正在提交..." : submitError ? "重新提交成绩" : !confirmed ? "确定" : index + 1 === questions.length ? "查看结果" : "下一题"}</button>
      </div>}

      {!current && index === questions.length && result && <div className="py-10 text-center">
        <Check size={48} className="mx-auto text-emerald-500" />
        <p className="mt-5 text-lg text-slate-500">最终得分为</p>
        <h2 className="mt-1 text-5xl font-black text-slate-900">{result.score} 分</h2>
        <p className="mt-4 text-2xl font-black text-violet-600">是一位{praise(result.score)} {fanTitle(mode, memberId)}！</p>
        <p className="mt-5 text-slate-500">平均分 {result.average} · 你已超过 {result.rankPercent}% 的人</p>
        <p className="mx-auto mt-8 max-w-xl text-sm leading-7 text-rose-300">分数只是一次小小的测试，也是属于你和爱豆之间的一份趣味记录。<br />它不能衡量你有多喜欢 TA，也无法定义你们之间的那份热爱。<br /><span className="font-semibold">真正的喜欢，从来都不是一道题、一个分数可以定义的。</span></p>
      </div>}
    </section>
  </main>
}
