"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { siteConfig } from "@/data/site"
import { members } from "@/data/members"

// 前四：Ruka, Pharita, Asa, Ahyeon
const firstRow = members.slice(0, 4)
// 后三：Rami, Rora, Chiquita
const secondRow = members.slice(4)

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-12 sm:py-16">
      {/* 背景渐变 */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100" />
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-purple-300/30 to-pink-300/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-300/30 to-purple-300/20 blur-3xl" />

      <div className="mx-auto max-w-3xl text-center">
        {/* 主标题 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl"
        >
          <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            {siteConfig.name}
          </span>
        </motion.h1>

        {/* tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="mt-3 text-base text-gray-600 sm:text-lg"
        >
          {siteConfig.tagline}
        </motion.p>

        {/* 分隔线 */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-purple-300 to-transparent"
        />

        {/* 进入专属空间 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-5 text-xs text-gray-400"
        >
          进入专属空间
        </motion.p>

        {/* 成员圆形按钮 —— 第一行 (4人) 手机端 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mx-auto mt-3 flex max-w-[260px] justify-center gap-x-4 sm:hidden"
        >
          {firstRow.map((member, i) => (
            <MemberCircle key={member.id} member={member} index={i} baseDelay={0.5} />
          ))}
        </motion.div>

        {/* 成员圆形按钮 —— 第二行 (3人) 手机端 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mx-auto mt-2 flex max-w-[200px] justify-center gap-x-5 sm:hidden"
        >
          {secondRow.map((member, i) => (
            <MemberCircle key={member.id} member={member} index={i} baseDelay={0.6} />
          ))}
        </motion.div>

        {/* 桌面端：一行全部显示 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mx-auto mt-3 hidden sm:flex sm:flex-wrap sm:justify-center sm:gap-4"
        >
          {members.map((member, i) => (
            <MemberCircle key={member.id} member={member} index={i} baseDelay={0.5} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/** 成员 -> 手机端半透明玻璃底色 (rgba) */
const memberGlassBg: Record<string, string> = {
  ruka: "rgba(244, 114, 182, 0.35)",     // pink-400
  pharita: "rgba(192, 132, 252, 0.35)",  // purple-400 → violet-400
  asa: "rgba(34, 211, 238, 0.3)",        // cyan-400
  ahyeon: "rgba(251, 191, 36, 0.35)",    // amber-400
  rami: "rgba(52, 211, 153, 0.3)",       // emerald-400
  rora: "rgba(56, 189, 248, 0.3)",       // sky-400
  chiquita: "rgba(250, 204, 21, 0.35)",  // yellow-400
}

function MemberCircle({
  member,
  index,
  baseDelay,
}: {
  member: (typeof members)[number]
  index: number
  baseDelay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: baseDelay + index * 0.06, type: "spring", stiffness: 200 }}
    >
      <Link href={`/members/${member.id}`}>
        <div className="group flex flex-col items-center gap-1">
          {/* ---- 手机版：半透明颜色玻璃质感 ---- */}
          <div
            className="flex sm:hidden h-10 w-10 items-center justify-center rounded-full
              backdrop-blur-sm border border-white/70 shadow-sm
              transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
            style={{ background: memberGlassBg[member.id] ?? "rgba(255,255,255,0.4)" }}
          >
            <span className="text-lg drop-shadow-sm">{member.emoji}</span>
          </div>
          {/* ---- 桌面版：纯渐变圆形（手机端隐藏） ---- */}
          <div
            className={`hidden sm:flex h-16 w-16 items-center justify-center rounded-full
              bg-gradient-to-br ${member.gradient} shadow-md
              transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}
          >
            <span className="text-3xl drop-shadow-sm">{member.emoji}</span>
          </div>
          {/* 成员名字 */}
          <span className="text-[9px] font-semibold text-gray-400 transition-colors group-hover:text-purple-700 sm:text-[11px] sm:text-gray-500">
            {member.displayName}
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
