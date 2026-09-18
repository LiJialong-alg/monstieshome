import Link from "next/link"
import { Sparkles } from "lucide-react"
import { members } from "@/data/members"

const colors: Record<string, string> = {
  ruka: "rgba(244,114,182,.35)",
  pharita: "rgba(192,132,252,.35)",
  asa: "rgba(34,211,238,.3)",
  ahyeon: "rgba(251,191,36,.35)",
  rami: "rgba(52,211,153,.3)",
  rora: "rgba(56,189,248,.3)",
  chiquita: "rgba(250,204,21,.35)",
}

function MemberButton({ member }: { member: (typeof members)[number] }) {
  return (
    <Link href={`/quiz?member=${member.id}`} className="group flex flex-col items-center gap-1.5">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 text-xl shadow-sm backdrop-blur-sm transition group-hover:scale-110 sm:hidden" style={{ background: colors[member.id] }}>{member.emoji}</span>
      <span className={`hidden h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${member.gradient} text-3xl shadow-md transition group-hover:scale-110 sm:flex`}>{member.emoji}</span>
      <span className="text-[10px] font-semibold text-slate-500 sm:text-xs">{member.displayName}</span>
    </Link>
  )
}

export default function HomePage() {
  const first = members.slice(0, 4)
  const second = members.slice(4)

  return (
    <main>
      <section className="relative overflow-hidden px-5 py-16 sm:py-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100" />
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/60 px-4 py-2 text-sm font-semibold text-violet-600"><Sparkles size={15} /> 爱豆知识默契测试</div>
          <h1 className="mt-6 whitespace-nowrap text-4xl font-black leading-tight text-slate-950 sm:text-7xl">MONSTIEZ 大挑战</h1>
          <div className="mx-auto mt-10 max-w-2xl">
            <p className="mb-2 text-xs font-bold tracking-[.24em] text-slate-400">GROUP CHALLENGE</p>
            <p className="mb-3 text-sm text-slate-500">点击进入全团题目</p>
            <Link href="/quiz?scope=group" className="mx-auto flex min-h-20 w-full items-center justify-center rounded-full border-2 border-red-700 bg-red-600 px-8 text-2xl font-black tracking-[.16em] text-black shadow-[0_10px_0_#7f1d1d] sm:text-4xl">BABYMONSTER</Link>
          </div>
          <div className="mt-12">
            <p className="text-xs font-bold tracking-[.24em] text-slate-400">CHOOSE YOUR MEMBER</p>
            <p className="mt-2 text-sm text-slate-500">选择成员，进入个人专属题目</p>
            <div className="mx-auto mt-5 sm:hidden">
              <div className="flex justify-center gap-5">{first.map((member) => <MemberButton key={member.id} member={member} />)}</div>
              <div className="mt-4 flex justify-center gap-5">{second.map((member) => <MemberButton key={member.id} member={member} />)}</div>
            </div>
            <div className="mx-auto mt-5 hidden flex-wrap justify-center gap-5 sm:flex">{members.map((member) => <MemberButton key={member.id} member={member} />)}</div>
          </div>
        </div>
      </section>
    </main>
  )
}
