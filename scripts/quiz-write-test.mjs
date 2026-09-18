import { performance } from "node:perf_hooks"

const baseUrl = process.argv[2] ?? "http://127.0.0.1:3011"
const concurrency = Number(process.argv[3] ?? 5)
const durationSeconds = Number(process.argv[4] ?? 5)

const questionsResponse = await fetch(`${baseUrl}/api/questions?scope=group`)
if (!questionsResponse.ok) throw new Error(`Question request failed: ${questionsResponse.status}`)
const questions = await questionsResponse.json()
const payload = JSON.stringify({
  scope: "group",
  memberId: "",
  answers: questions.map((question) => ({ questionId: question.id, selectedOption: 0 })),
})

const deadline = performance.now() + durationSeconds * 1000
const latencies = []
const statuses = new Map()
let requests = 0
let errors = 0

async function worker() {
  while (performance.now() < deadline) {
    const started = performance.now()
    try {
      const response = await fetch(`${baseUrl}/api/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      })
      await response.arrayBuffer()
      latencies.push(performance.now() - started)
      requests++
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
await Promise.all(Array.from({ length: concurrency }, worker))
const elapsedSeconds = (performance.now() - started) / 1000
latencies.sort((a, b) => a - b)
const percentile = (value) => latencies[Math.min(latencies.length - 1, Math.ceil(value * latencies.length) - 1)] ?? 0

console.log(JSON.stringify({
  scenario: "quiz-write",
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
}))
