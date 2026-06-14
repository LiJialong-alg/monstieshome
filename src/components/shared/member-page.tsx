"use client"

import { motion } from "framer-motion"
import { ImageIcon, ExternalLink } from "lucide-react"
import type { Member } from "@/data/members"
import { cn } from "@/lib/utils"

interface MemberPageProps {
  member: Member
}

export function MemberPage({ member }: MemberPageProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      {/* 头部区域 */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br p-8 sm:p-12 text-white shadow-lg"
        style={{
          backgroundImage: `linear-gradient(135deg, ${member.gradient.replace("from-", "").replace("to-", "").split(" ").join(", ")})`
        }}
      >
        {/* 背景装饰 */}
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-6">
          {/* 头像占位 */}
          <div className="flex h-24 w-24 sm:h-28 sm:w-28 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-4xl shadow-md">
            {member.avatar ? (
              <img src={member.avatar} alt={member.displayName} className="h-full w-full rounded-2xl object-cover" />
            ) : (
              <span>{member.emoji}</span>
            )}
          </div>

          {/* 文字 */}
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {member.displayName}
            </h1>
            {member.bio && (
              <p className="mt-2 text-sm text-white/80 max-w-md">
                {member.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 内容区 — 占位 */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ContentPlaceholder
          icon={ImageIcon}
          title="最新照片"
          description="成员相关照片和直拍"
          gradient={member.gradient}
        />
        <ContentPlaceholder
          icon={ExternalLink}
          title="相关链接"
          description="社交媒体、直拍链接等"
          gradient={member.gradient}
        />
        <ContentPlaceholder
          icon={ImageIcon}
          title="精选合集"
          description="整理好的主题相册"
          gradient={member.gradient}
          className="sm:col-span-2 lg:col-span-1"
        />
      </div>

      <div className="mt-4 text-center py-16 text-sm text-gray-400">
        ✨ 更多内容正在路上，等待站长更新中...
      </div>
    </div>
  )
}

function ContentPlaceholder({
  icon: Icon,
  title,
  description,
  gradient,
  className,
}: {
  icon: React.ElementType
  title: string
  description: string
  gradient: string
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "rounded-2xl border border-purple-100/40 bg-white/60 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-all",
        className
      )}
    >
      <div className={cn(
        "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm mb-3",
        gradient
      )}>
        <Icon size={18} />
      </div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="mt-1 text-sm text-gray-400">{description}</p>
    </motion.div>
  )
}
