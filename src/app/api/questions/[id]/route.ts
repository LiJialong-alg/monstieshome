import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-auth"

export async function PUT(req: NextRequest, ctx: RouteContext<"/api/questions/[id]">) {
  const denied = await requireAdmin()
  if (denied) return denied
  const { id } = await ctx.params
  const body = await req.json()
  const options = Array.isArray(body.options) ? body.options.filter(Boolean) : []
  if (!body.question?.trim() || options.length < 2) {
    return NextResponse.json({ error: "请填写题目和至少两个选项" }, { status: 400 })
  }
  const question = await prisma.question.update({
    where: { id },
    data: {
      scope: body.scope === "member" ? "member" : "group",
      memberId: body.scope === "member" ? body.memberId ?? "" : "",
      question: body.question.trim(), image: body.image ?? "",
      options: JSON.stringify(options), answer: Number(body.answer) || 0,
      explanation: body.explanation ?? "", difficulty: body.difficulty ?? "入门",
      visible: true,
      sortOrder: Number(body.sortOrder) || 0,
    },
  })
  return NextResponse.json(question)
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/questions/[id]">) {
  const denied = await requireAdmin()
  if (denied) return denied
  const { id } = await ctx.params
  await prisma.question.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
