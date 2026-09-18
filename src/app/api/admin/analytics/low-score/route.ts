import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied
  const body = await request.json().catch(() => ({}))
  const scope = body.scope === "member" ? "member" : "group"
  const memberId = scope === "member" ? String(body.memberId ?? "") : ""
  const score = Math.floor(Math.random() * 31)
  await prisma.quizAttempt.create({ data: { scope, memberId, score, answers: "[]" } })
  return NextResponse.json({ score })
}
