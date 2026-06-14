import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const item = await prisma.announcement.findUnique({ where: { id } })
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(item)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const item = await prisma.announcement.update({
    where: { id },
    data: {
      title: body.title,
      date: body.date,
      summary: body.summary,
      tags: body.tags,
      pinned: body.pinned,
      visible: body.visible,
    },
  })
  return NextResponse.json(item)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await prisma.announcement.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
