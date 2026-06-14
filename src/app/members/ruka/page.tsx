import type { Metadata } from "next"
import { getMemberById, members } from "@/data/members"
import { MemberPage } from "@/components/shared/member-page"
import { notFound } from "next/navigation"

export function generateStaticParams() {
  return members.map((m) => ({ id: m.id }))
}

export async function generateMetadata(): Promise<Metadata> {
  const member = getMemberById("ruka")
  return { title: member?.displayName ?? "Ruka" }
}

export default function Page() {
  const member = getMemberById("ruka")
  if (!member) notFound()
  return <MemberPage member={member} />
}
