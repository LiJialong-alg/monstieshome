import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-auth"

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied
  const [attempts, wrongAnswers, questions] = await Promise.all([
    prisma.quizAttempt.findMany(), prisma.wrongAnswer.findMany(), prisma.question.findMany(),
  ])
  const questionMap = new Map(questions.map((q) => [q.id, q]))
  const currentWrongAnswers = wrongAnswers.filter((wrong) => questionMap.has(wrong.questionId))
  const stats = new Map<string, { wrongCount: number; choices: Record<number, number> }>()
  for (const wrong of currentWrongAnswers) {
    const current = stats.get(wrong.questionId) ?? { wrongCount: 0, choices: {} }
    current.wrongCount += 1
    current.choices[wrong.selectedOption] = (current.choices[wrong.selectedOption] ?? 0) + 1
    stats.set(wrong.questionId, current)
  }
  const questionStats = [...stats.entries()].map(([id, value]) => {
    const question = questionMap.get(id)!
    const options: string[] = JSON.parse(question.options)
    const mostWrong = Object.entries(value.choices).sort((a, b) => b[1] - a[1])[0]
    return { id, question: question.question, scope: question.scope, memberId: question.memberId, wrongCount: value.wrongCount, wrongRate: attempts.filter((attempt) => attempt.scope === question.scope && attempt.memberId === question.memberId).length ? Number((value.wrongCount / attempts.filter((attempt) => attempt.scope === question.scope && attempt.memberId === question.memberId).length * 100).toFixed(1)) : 0, mostWrongOption: mostWrong ? options[Number(mostWrong[0])] ?? `选项 ${Number(mostWrong[0]) + 1}` : "-" }
  }).sort((a, b) => b.wrongCount - a.wrongCount)
  const average = attempts.length ? Number((attempts.reduce((sum, item) => sum + item.score, 0) / attempts.length).toFixed(1)) : 0
  return NextResponse.json({ participantCount: attempts.length, average, totalWrong: currentWrongAnswers.length, questionStats, attempts: attempts.map((attempt) => ({ scope: attempt.scope, memberId: attempt.memberId, score: attempt.score, createdAt: attempt.createdAt })) })
}
