import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const images = await prisma.image.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json(images)
}

export async function POST(req: NextRequest) {
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
