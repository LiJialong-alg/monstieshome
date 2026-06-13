import { siteConfig } from "@/data/site"
import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-auto border-t border-purple-100/40 bg-white/50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-3 text-center text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart size={14} className="fill-pink-400 text-pink-400" />
            <span>by fans</span>
          </div>
          <p className="text-xs leading-relaxed text-gray-400">
            {siteConfig.footer.disclaimer}
          </p>
          <p className="text-xs text-gray-400">
            {siteConfig.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
