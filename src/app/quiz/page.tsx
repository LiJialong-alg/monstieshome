import QuizClient from "./quiz-client"

export default async function QuizPage({
  searchParams,
}: {
  searchParams: Promise<{ scope?: string; member?: string }>
}) {
  const params = await searchParams
  return <QuizClient initialScope={params.member ? "member" : params.scope === "group" ? "group" : undefined} initialMember={params.member} />
}
