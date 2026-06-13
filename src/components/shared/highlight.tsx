"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { todayHighlight } from "@/data/content"

export function TodayHighlight() {
  return (
    <section className="px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-amber-500" />
          <h2 className="text-base font-semibold text-gray-700">🌟 今日推荐</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link href={todayHighlight.href}>
            <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-amber-200/40 hover:-translate-y-1">
              <div className="flex flex-col sm:flex-row">
                {/* 图片占位区 */}
                <div className="flex aspect-[16/9] sm:aspect-auto sm:w-48 items-center justify-center bg-gradient-to-br from-amber-200 via-orange-200 to-pink-200">
                  <Sparkles size={32} className="text-white/60" />
                </div>

                {/* 内容区 */}
                <CardContent className="flex flex-1 flex-col justify-center gap-2 p-5">
                  {todayHighlight.tag && (
                    <span className="w-fit rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                      {todayHighlight.tag}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
                    {todayHighlight.title}
                  </h3>
                  <p className="text-sm text-gray-500">{todayHighlight.subtitle}</p>
                  <div className="mt-2 flex items-center gap-1 text-sm font-medium text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>去看看</span>
                    <ArrowRight size={14} />
                  </div>
                </CardContent>
              </div>
            </Card>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
