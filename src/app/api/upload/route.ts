import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { ensureQuestionBucket } from "@/lib/minio"
import { requireAdmin } from "@/lib/admin-auth"

export const runtime = "nodejs"

const allowedTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied
  try {
    const formData = await req.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "请选择图片文件" }, { status: 400 })
    }

    const extension = allowedTypes[file.type]
    if (!extension) {
      return NextResponse.json({ error: "只支持 JPG、PNG、GIF 和 WebP 图片" }, { status: 400 })
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "图片大小不能超过 10MB" }, { status: 400 })
    }

    const { client, config } = await ensureQuestionBucket()
    const now = new Date()
    const objectName = `questions/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${randomUUID()}.${extension}`
    const buffer = Buffer.from(await file.arrayBuffer())

    await client.putObject(config.bucket, objectName, buffer, buffer.length, {
      "Content-Type": file.type,
      "Cache-Control": "public, max-age=31536000, immutable",
    })

    return NextResponse.json({
      url: `${config.publicUrl}/${config.bucket}/${objectName}`,
      objectName,
      bucket: config.bucket,
    })
  } catch (error) {
    console.error("MinIO upload failed:", error)
    const notConfigured = error instanceof Error && error.message.startsWith("Missing environment variable:")
    return NextResponse.json(
      { error: notConfigured ? "图片存储服务尚未配置完成" : "图片上传失败，请稍后重试" },
      { status: notConfigured ? 503 : 500 },
    )
  }
}
