"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { members } from "@/data/members"

export function MemberCircles() {
  return (
    <section className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* 标题 */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 text-center text-sm text-gray-400"
        >
          点击爱豆头像进入她的专属空间 🏠
        </motion.p>

        {/* 圆形按钮网格 */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {members.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 200 }}
            >
              <Link href={`/members/${member.id}`}>
                <div className="group flex flex-col items-center gap-2">
                  {/* 圆形头像 */}
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${member.gradient} shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-purple-200/50 sm:h-24 sm:w-24`}
                  >
                    <span className="text-3xl sm:text-4xl drop-shadow-sm">
                      {member.emoji}
                    </span>
                  </div>
                  {/* 名字 */}
                  <span className="text-sm font-semibold text-gray-600 transition-colors group-hover:text-purple-700">
                    {member.displayName}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
