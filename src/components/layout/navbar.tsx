"use client"

import { useState } from "react"
import Link from "next/link"
import { siteConfig } from "@/data/site"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-100/40 bg-purple-50/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center px-3 py-2 sm:px-6 sm:py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-base font-bold text-transparent sm:text-xl">
            {siteConfig.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-purple-50 hover:text-purple-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

      </div>
    </header>
  )
}
