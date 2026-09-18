import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const submitted = Array.isArray(body.answers) ? body.answers : []
  const scope = body.scope === "member" ? "member" : "group"
  const memberId = scope === "member" ? String(body.memberId ?? "") : ""
  const submittedIds = submitted.map((item: { questionId?: string }) => String(item.questionId ?? "")).filter(Boolean)
  if (!submitted.length || submittedIds.length !== new Set(submittedIds).size) {
    return NextResponse.json({ error: "答题数据无效" }, { status: 400 })
  }
  const questions = await prisma.question.findMany({ where: { id: { in: submittedIds }, scope, memberId } })
  const byId = new Map(questions.map((question) => [question.id, question]))
  const checked: Array<{ question: (typeof questions)[number]; selectedOption: number }> = submitted.flatMap((item: { questionId?: string; selectedOption?: number }) => {
    const question = byId.get(String(item.questionId ?? ""))
    if (!question) return []
    const selectedOption = Number(item.selectedOption)
    let options: unknown[] = []
    try { options = JSON.parse(question.options) } catch { return [] }
    if (!Number.isInteger(selectedOption) || selectedOption < 0 || selectedOption >= options.length) return []
    return [{ question, selectedOption }]
  })
  if (checked.length !== submitted.length) return NextResponse.json({ error: "题目已更新，请重新开始答题" }, { status: 409 })

  const correctCount = checked.filter((item) => item.selectedOption === item.question.answer).length
  const score = Number(((correctCount / checked.length) * 100).toFixed(1))
  const where = { scope, memberId }
  const previous = await prisma.quizAttempt.aggregate({ where, _avg: { score: true }, _count: { _all: true } })
  const atOrBelow = await prisma.quizAttempt.count({ where: { ...where, score: { lte: score } } })
  const totalBefore = previous._count._all
  const average = Number((((previous._avg.score ?? 0) * totalBefore + score) / (totalBefore + 1)).toFixed(1))
  const rankPercent = Number((((atOrBelow + 1) / (totalBefore + 1)) * 100).toFixed(1))

  const attempt = await prisma.quizAttempt.create({ data: { scope, memberId, score, answers: JSON.stringify(submitted) } })
  const wrong = checked.filter((item) => item.selectedOption !== item.question.answer)
  if (wrong.length) await prisma.wrongAnswer.createMany({ data: wrong.map((item) => ({ attemptId: attempt.id, questionId: item.question.id, selectedOption: item.selectedOption, correctOption: item.question.answer })) })
  return NextResponse.json({ score, average, rankPercent, total: totalBefore + 1 })
}
