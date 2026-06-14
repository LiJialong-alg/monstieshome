import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const image = await prisma.image.findUnique({ where: { id } })
  if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(image)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const image = await prisma.image.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
      src: body.src,
      tags: body.tags,
      link: body.link,
    },
  })
  return NextResponse.json(image)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await prisma.image.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
