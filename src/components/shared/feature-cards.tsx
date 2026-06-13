"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  Camera,
  Megaphone,
  Link as LinkIcon,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { homeFeatures } from "@/data/content"
import { cn } from "@/lib/utils"

const iconMap: Record<string, React.ElementType> = {
  Camera,
  Megaphone,
  Link: LinkIcon,
  Sparkles,
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

export function FeatureCards() {
  return (
    <section className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {homeFeatures.map((feature) => {
            const Icon = iconMap[feature.icon] || Sparkles
            return (
              <motion.div key={feature.title} variants={item}>
                <Link href={feature.href}>
                  <Card className="group h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-purple-200/40 hover:-translate-y-1">
                    <CardContent className="flex flex-col gap-3 p-5">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm",
                          feature.gradient
                        )}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                      <div className="mt-auto flex items-center gap-1 text-xs font-medium text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>去看看</span>
                        <ArrowRight size={12} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
