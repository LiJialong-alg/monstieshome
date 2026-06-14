"use client"

import Link from "next/link"
import { Users } from "lucide-react"
import { members } from "@/data/members"

export default function MembersPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      {/* 页头 */}
      <div className="mb-8 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <Users size={24} className="text-purple-500" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            成员
          </h1>
        </div>
        <p className="mt-1 text-sm text-gray-400">
          每一位都是闪光的星星 ✨
        </p>
      </div>

      {/* 成员网格 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {members.map((member) => (
          <Link key={member.id} href={`/members/${member.id}`}>
            <div className="group rounded-2xl border border-purple-100/40 bg-white/60 backdrop-blur-sm p-6 text-center shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              {/* 头像区 */}
              <div
                className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${member.gradient} text-3xl text-white shadow-md mb-3 transition-transform duration-300 group-hover:scale-105`}
              >
                {member.avatar ? (
                  <img src={member.avatar} alt={member.displayName} className="h-full w-full rounded-2xl object-cover" />
                ) : (
                  <span>{member.emoji}</span>
                )}
              </div>

              <h2 className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
                {member.displayName}
              </h2>
              {member.bio && (
                <p className="mt-1 text-xs text-gray-400 line-clamp-1">{member.bio}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
