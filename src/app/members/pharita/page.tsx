import type { Metadata } from "next"
import { getMemberById } from "@/data/members"
import { MemberPage } from "@/components/shared/member-page"
import { notFound } from "next/navigation"

export async function generateMetadata(): Promise<Metadata> {
  const member = getMemberById("pharita")
  return { title: member?.displayName ?? "Pharita" }
}

export default function Page() {
  const member = getMemberById("pharita")
  if (!member) notFound()
  return <MemberPage member={member} />
}
