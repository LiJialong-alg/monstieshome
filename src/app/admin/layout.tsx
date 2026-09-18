"use client"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); const router = useRouter(); const [username,setUsername]=useState(""); const [checking,setChecking]=useState(true)
  useEffect(()=>{fetch("/api/auth/me").then(r=>r.json()).then(d=>{if(d.authenticated)setUsername(d.user.username);setChecking(false)}).catch(()=>setChecking(false))},[])
  if(pathname==="/admin/login") return children
  if(!checking&&!username){router.replace("/admin/login");return null}
  return <div className="mx-auto min-h-[80vh] max-w-6xl px-4 py-8"><div className="rounded-3xl border border-violet-100 bg-white/80 p-5 shadow-xl shadow-violet-100/30 sm:p-7">{children}</div></div>
}
