import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-auth"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const scope = searchParams.get("scope")
  const memberId = searchParams.get("memberId")
  const admin = searchParams.get("admin") === "1"
  if (admin) {
    const denied = await requireAdmin()
    if (denied) return denied
  }

  const questions = await prisma.question.findMany({
    where: {
      // 题目创建后直接投入使用，保留 admin 参数仅用于兼容旧请求。
      ...(scope ? { scope } : {}),
      ...(memberId ? { memberId } : {}),
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  })

  const response = NextResponse.json(questions)
  if (!admin) response.headers.set("Cache-Control", "public, max-age=30, stale-while-revalidate=120")
  return response
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied
  const body = await req.json()
  const options = Array.isArray(body.options) ? body.options : []
  if (!body.question?.trim() || options.filter(Boolean).length < 2) {
    return NextResponse.json({ error: "请填写题目和至少两个选项" }, { status: 400 })
  }

  const scope = body.scope === "member" ? "member" : "group"
  const memberId = scope === "member" ? body.memberId ?? "" : ""
  const lastQuestion = await prisma.question.findFirst({
    where: { scope, memberId },
    orderBy: [{ sortOrder: "desc" }, { createdAt: "desc" }],
    select: { sortOrder: true },
  })

  const question = await prisma.question.create({
    data: {
      scope,
      memberId,
      question: body.question.trim(),
      image: body.image ?? "",
      options: JSON.stringify(options.map((item: string) => item.trim()).filter(Boolean)),
      answer: Number(body.answer) || 0,
      explanation: body.explanation ?? "",
      difficulty: body.difficulty ?? "入门",
      visible: true,
      sortOrder: (lastQuestion?.sortOrder ?? -1) + 1,
    },
  })
  return NextResponse.json(question, { status: 201 })
}
