import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin-auth"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limitParam = searchParams.get("limit")
  const limit = limitParam ? parseInt(limitParam, 10) : undefined

  const images = await prisma.image.findMany({
    orderBy: { createdAt: "desc" },
    ...(limit ? { take: limit } : {}),
  })
  return NextResponse.json(images)
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied
  const body = await req.json()
  const image = await prisma.image.create({
    data: {
      title: body.title,
      description: body.description ?? "",
      src: body.src ?? "",
      tags: body.tags ?? "[]",
      link: body.link ?? "",
    },
  })
  return NextResponse.json(image, { status: 201 })
}
