"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Camera, Sparkles, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function PhotoBoothCard() {
  return (
    <section className="px-4 py-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/photo-booth">
            <Card className="group cursor-pointer overflow-hidden border-2 border-pink-200/60 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-200/40 hover:-translate-y-1">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left sm:gap-6">
                  {/* 左侧图标区域 */}
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 shadow-lg shadow-pink-200/50 sm:h-24 sm:w-24">
                    <Camera size={36} className="text-white" />
                  </div>

                  {/* 右侧内容 */}
                  <div className="flex-1">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <Sparkles size={18} className="text-pink-500" />
                      <h3 className="text-lg font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent sm:text-xl">
                        与爱豆合照
                      </h3>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                      开启摄像头，选择喜欢的姿势模板，和爱豆拍一张拍立得风格合照吧！
                    </p>
                    <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
                      <span className="rounded-full bg-pink-100 px-3 py-1 text-xs text-pink-600">📸 多种姿势</span>
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-600">🎨 拍立得滤镜</span>
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-600">💾 导出保存</span>
                    </div>
                    <div className="mt-4 flex items-center justify-center sm:justify-start gap-1 text-sm font-medium text-pink-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>开始拍照</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
