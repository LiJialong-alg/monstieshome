export const siteConfig = {
  name: "Monsties Home",
  shortName: "MHome",
  tagline: "欢迎来到小怪兽们的家 🏠",
  description: "一个属于粉丝的小小角落，记录美好瞬间，分享应援热情。",
  url: "https://monstieshome.com",
  since: 2025,
  footer: {
    copyright: `© ${new Date().getFullYear()} Monsties Home. Made with 💜 by fans.`,
    disclaimer: "本站为粉丝个人运营的非官方站点，所有内容仅供参考。",
  },
  nav: [
    { label: "首页", href: "/" },
    { label: "成员", href: "/members" },
    { label: "照片", href: "/gallery" },
    { label: "公告", href: "/announcements" },
    { label: "外链", href: "/links" },
  ],
}

export type SiteConfig = typeof siteConfig

