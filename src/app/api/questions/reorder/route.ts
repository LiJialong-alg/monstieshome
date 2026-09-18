import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-auth"

export async function PUT(req: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied
  const { ids } = await req.json()
  if (!Array.isArray(ids)) return NextResponse.json({ error: "排序数据无效" }, { status: 400 })
  await prisma.$transaction(ids.map((id: string, index: number) => prisma.question.update({ where: { id }, data: { sortOrder: index } })))
  return NextResponse.json({ success: true })
}
