import type { Metadata } from "next"
import { getMemberById } from "@/data/members"
import { MemberPage } from "@/components/shared/member-page"
import { notFound } from "next/navigation"

export async function generateMetadata(): Promise<Metadata> {
  const member = getMemberById("rora")
  return { title: member?.displayName ?? "Rora" }
}

export default function Page() {
  const member = getMemberById("rora")
  if (!member) notFound()
  return <MemberPage member={member} />
}
