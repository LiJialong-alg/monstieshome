import { performance } from "node:perf_hooks"
import { readFile } from "node:fs/promises"
import { execFileSync } from "node:child_process"
import os from "node:os"

const baseUrl = process.argv[2] ?? "http://127.0.0.1:3010"
const concurrency = Number(process.argv[3] ?? 10)
const durationSeconds = Number(process.argv[4] ?? 10)
const scenario = process.argv[5] ?? "mixed"
const imagePath = "/monsties-questions/questions/2026/08/b704d661-316b-4d2b-b2e7-df4dfaa2c3f9.png"

const memberRoutes = ["ruka", "pharita", "asa", "ahyeon", "rami", "rora", "chiquita"]
  .map((memberId) => `/api/questions?scope=member&memberId=${memberId}`)

const routes = scenario === "home"
  ? ["/"]
  : scenario === "image"
    ? [imagePath]
  : scenario === "questions"
    ? ["/api/questions?scope=group", ...memberRoutes]
    : ["/", "/api/questions?scope=group", ...memberRoutes]

const deadline = performance.now() + durationSeconds * 1000
const latencies = []
const statuses = new Map()
let requests = 0
let bytes = 0
let errors = 0
const systemSamples = []

let previousCpu
async function sampleSystem() {
  try {
    const stat = await readFile("/proc/stat", "utf8")
    const values = stat.split("\n")[0].trim().split(/\s+/).slice(1).map(Number)
    const idle = values[3] + (values[4] ?? 0)
    const total = values.reduce((sum, value) => sum + value, 0)
    let cpuPercent = 0
    if (previousCpu) {
      const totalDelta = total - previousCpu.total
      const idleDelta = idle - previousCpu.idle
      cpuPercent = totalDelta > 0 ? ((totalDelta - idleDelta) / totalDelta) * 100 : 0
    }
    previousCpu = { idle, total }

    let appRssMB = 0
    try {
      const pid = execFileSync("pgrep", ["-f", "/home/lijialong/monstieshome/server.js"], { encoding: "utf8" }).trim().split("\n")[0]
      const status = await readFile(`/proc/${pid}/status`, "utf8")
      const rss = status.match(/^VmRSS:\s+(\d+)\s+kB$/m)
      appRssMB = rss ? Number(rss[1]) / 1024 : 0
    } catch {}

    systemSamples.push({
      cpuPercent,
      freeMemoryMB: os.freemem() / 1024 / 1024,
      load1: os.loadavg()[0],
      appRssMB,
    })
  } catch {}
}

await sampleSystem()
const sampler = setInterval(sampleSystem, 250)

async function worker(workerId) {
  let index = workerId
  while (performance.now() < deadline) {
    const route = routes[index % routes.length]
    index += concurrency
    const started = performance.now()
    try {
      const response = await fetch(`${baseUrl}${route}`, {
        headers: { Host: scenario === "image" ? "minio.lijialong.online" : "monstiez.lijialong.online", Connection: "keep-alive" },
      })
      const body = await response.arrayBuffer()
      latencies.push(performance.now() - started)
      requests++
      bytes += body.byteLength
      statuses.set(response.status, (statuses.get(response.status) ?? 0) + 1)
      if (!response.ok) errors++
    } catch {
      latencies.push(performance.now() - started)
      requests++
      errors++
    }
  }
}

const started = performance.now()
await Promise.all(Array.from({ length: concurrency }, (_, index) => worker(index)))
clearInterval(sampler)
await sampleSystem()
const elapsedSeconds = (performance.now() - started) / 1000
latencies.sort((a, b) => a - b)

const percentile = (value) => {
  if (!latencies.length) return 0
  return latencies[Math.min(latencies.length - 1, Math.ceil(value * latencies.length) - 1)]
}

console.log(JSON.stringify({
  scenario,
  concurrency,
  durationSeconds: Number(elapsedSeconds.toFixed(2)),
  requests,
  requestsPerSecond: Number((requests / elapsedSeconds).toFixed(1)),
  errorRatePercent: Number(((errors / Math.max(requests, 1)) * 100).toFixed(3)),
  statuses: Object.fromEntries(statuses),
  latencyMs: {
    average: Number((latencies.reduce((sum, value) => sum + value, 0) / Math.max(latencies.length, 1)).toFixed(1)),
    p50: Number(percentile(0.5).toFixed(1)),
    p95: Number(percentile(0.95).toFixed(1)),
    p99: Number(percentile(0.99).toFixed(1)),
    maximum: Number((latencies.at(-1) ?? 0).toFixed(1)),
  },
  transferredMB: Number((bytes / 1024 / 1024).toFixed(1)),
  system: {
    cpuAveragePercent: Number((systemSamples.reduce((sum, sample) => sum + sample.cpuPercent, 0) / Math.max(systemSamples.length - 1, 1)).toFixed(1)),
    cpuPeakPercent: Number(Math.max(...systemSamples.map((sample) => sample.cpuPercent), 0).toFixed(1)),
    minimumFreeMemoryMB: Number(Math.min(...systemSamples.map((sample) => sample.freeMemoryMB), os.freemem() / 1024 / 1024).toFixed(1)),
    maximumLoad1: Number(Math.max(...systemSamples.map((sample) => sample.load1), 0).toFixed(2)),
    maximumAppRssMB: Number(Math.max(...systemSamples.map((sample) => sample.appRssMB), 0).toFixed(1)),
  },
}))
