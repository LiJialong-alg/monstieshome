import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const items = await prisma.externalLink.findMany({ orderBy: { sortOrder: "asc" } })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const item = await prisma.externalLink.create({
    data: {
      name: body.name,
      description: body.description ?? "",
      url: body.url,
      icon: body.icon ?? "Globe",
      category: body.category ?? "未分类",
      sortOrder: body.sortOrder ?? 0,
      visible: body.visible ?? true,
    },
  })
  return NextResponse.json(item, { status: 201 })
}
