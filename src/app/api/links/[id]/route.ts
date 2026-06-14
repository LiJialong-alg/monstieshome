import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const item = await prisma.externalLink.findUnique({ where: { id } })
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(item)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const item = await prisma.externalLink.update({
    where: { id },
    data: {
      name: body.name,
      description: body.description,
      url: body.url,
      icon: body.icon,
      category: body.category,
      sortOrder: body.sortOrder,
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
  await prisma.externalLink.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
