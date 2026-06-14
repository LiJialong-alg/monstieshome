import type { Metadata } from "next"
import { getMemberById } from "@/data/members"
import { MemberPage } from "@/components/shared/member-page"
import { notFound } from "next/navigation"

export async function generateMetadata(): Promise<Metadata> {
  const member = getMemberById("asa")
  return { title: member?.displayName ?? "Asa" }
}

export default function Page() {
  const member = getMemberById("asa")
  if (!member) notFound()
  return <MemberPage member={member} />
}
