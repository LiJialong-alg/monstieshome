import { Client } from "minio"

function envValue(name: string) {
  const value = process.env[name]?.trim().replace(/^['"]|['"]$/g, "")
  return value || undefined
}

function required(name: string) {
  const value = envValue(name)
  if (!value) throw new Error(`Missing environment variable: ${name}`)
  return value
}

export function getMinioConfig() {
  const endpointValue = required("MINIO_ENDPOINT").replace(/^https?:\/\//, "").replace(/\/$/, "")
  const configuredPort = Number(envValue("MINIO_PORT") ?? (envValue("MINIO_USE_SSL") === "true" ? 443 : 9000))
  return {
    endPoint: endpointValue,
    port: Number.isFinite(configuredPort) ? configuredPort : 9000,
    useSSL: envValue("MINIO_USE_SSL") === "true",
    accessKey: required("MINIO_ACCESS_KEY"),
    secretKey: required("MINIO_SECRET_KEY"),
    bucket: envValue("MINIO_BUCKET") ?? "monsties-questions",
    publicUrl: required("MINIO_PUBLIC_URL").replace(/\/$/, ""),
  }
}

export function createMinioClient() {
  const config = getMinioConfig()
  return new Client({
    endPoint: config.endPoint,
    port: config.port,
    useSSL: config.useSSL,
    accessKey: config.accessKey,
    secretKey: config.secretKey,
  })
}

export async function ensureQuestionBucket() {
  const config = getMinioConfig()
  const client = createMinioClient()
  return { client, config }
}
