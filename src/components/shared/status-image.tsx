"use client"

import type { ImgHTMLAttributes } from "react"
import { useState } from "react"

export function StatusImage({ className = "", alt = "图片", onLoad, onError, ...props }: ImgHTMLAttributes<HTMLImageElement> & { containerClassName?: string }) {
  const { containerClassName = "", ...imageProps } = props
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading")
  return (
    <div className={`relative h-full w-full ${containerClassName}`}>
      {state === "loading" && <div className="pointer-events-none absolute left-2 top-2 z-10 rounded-full bg-white/80 px-2.5 py-1 text-[11px] text-slate-500 shadow-sm backdrop-blur-sm">图片加载中…</div>}
      {state === "error" && <div className="pointer-events-none absolute inset-x-2 top-2 z-10 rounded-full bg-rose-50/90 px-2.5 py-1 text-center text-[11px] text-rose-600 shadow-sm">图片加载失败，请检查图片地址</div>}
      <img {...imageProps} alt={alt} className={`${className} ${state === "error" ? "opacity-40" : "opacity-100"}`} onLoad={(event) => { setState("loaded"); onLoad?.(event) }} onError={(event) => { setState("error"); onError?.(event) }} />
    </div>
  )
}
