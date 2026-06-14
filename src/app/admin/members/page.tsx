"use client"

import { Users } from "lucide-react"
import { members } from "@/data/members"

export default function AdminMembersPage() {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Users size={20} className="text-purple-500" />
        <h2 className="text-lg font-semibold text-gray-700">成员管理</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="rounded-2xl border border-purple-100/40 bg-white/60 p-5 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${member.gradient} text-2xl text-white shadow-sm shrink-0`}
              >
                {member.emoji}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{member.displayName}</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  bio 和头像可在后续版本中编辑
                </p>
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-500 line-clamp-2">
              {member.bio || "暂无简介"}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
