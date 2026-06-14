import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const items = await prisma.announcement.findMany({
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    take: 5,
  })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const item = await prisma.announcement.create({
    data: {
      title: body.title,
      date: body.date,
      summary: body.summary ?? "",
      tags: body.tags ?? "[]",
      pinned: body.pinned ?? false,
      visible: body.visible ?? true,
    },
  })
  return NextResponse.json(item, { status: 201 })
}

